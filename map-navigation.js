import {Vector3, Spherical} from 'three';

// OrbitControls pans/zooms on a horizontal plane. A mountain map must instead
// keep its orbit pivot on the terrain; otherwise minDistance stops in mid-air.
export function createTerrainNavigation(camera, controls, {
  width, depth, heightAt, cellSize = 20, clearance = 8,
  isCut = () => false, automatic = () => false,
}) {
  const originalUpdate = controls.update.bind(controls);
  const direction = new Vector3(), previous = new Vector3(), offset = new Vector3();
  const fingers = new Map(), surface = controls.domElement;
  const inside = (x, z) => Math.abs(x) <= width / 2 && Math.abs(z) <= depth / 2;
  const clamp = (n, a, b) => Math.max(a, Math.min(b, n));
  controls.minDistance = 10; controls.maxDistance = 12500;
  controls.minPolarAngle = Math.PI / 180;
  controls.maxPolarAngle = Math.PI * .482;
  controls.screenSpacePanning = false;
  controls.zoomToCursor = true;

  // First intersection with the height field, clipped to the map rectangle.
  // Only a changed pan/zoom pivot needs this search, never every idle frame.
  function groundPoint(origin, ray) {
    if (ray.y >= -1e-5) return null;
    let lo = 0, hi = controls.maxDistance;
    for (const [axis, size] of [['x', width], ['z', depth]]) {
      if (Math.abs(ray[axis]) < 1e-8) { if (Math.abs(origin[axis]) > size / 2) return null; }
      else {
        const a = (-size / 2 - origin[axis]) / ray[axis], b = (size / 2 - origin[axis]) / ray[axis];
        lo = Math.max(lo, Math.min(a, b)); hi = Math.min(hi, Math.max(a, b));
      }
    }
    if (hi <= lo) return null;
    const gap = t => origin.y + ray.y * t - heightAt(origin.x + ray.x * t, origin.z + ray.z * t);
    if (gap(lo) <= 0) return null;
    const steps = Math.max(1, Math.ceil((hi - lo) * Math.hypot(ray.x, ray.z) / (cellSize / 2)));
    let a = lo;
    for (let i = 1; i <= steps; i++) {
      let b = lo + (hi - lo) * i / steps;
      if (gap(b) <= 0) {
        for (let j = 0; j < 14; j++) { const m = (a + b) / 2; if (gap(m) > 0) a = m; else b = m; }
        return origin.clone().addScaledVector(ray, (a + b) / 2);
      }
      a = b;
    }
    return null;
  }

  function constrain(anchor = true) {
    const target = controls.target, position = camera.position;
    // Move the pair together at map edges; clamping only target bends the view.
    const dx = clamp(target.x, -width / 2, width / 2) - target.x;
    const dz = clamp(target.z, -depth / 2, depth / 2) - target.z;
    target.x += dx; target.z += dz; position.x += dx; position.z += dz;
    if (anchor && Math.abs(target.y - heightAt(target.x, target.z)) > .03) {
      direction.copy(target).sub(position).normalize();
      const hit = groundPoint(position, direction);
      if (hit && hit.distanceTo(position) >= controls.minDistance) {
        // Rebase along the SAME sight line: no visual jump or camera movement.
        target.copy(hit); target.y = heightAt(target.x, target.z);
      } else {
        // Looking beyond the map/at the sky: look down at a valid pivot without
        // teleporting the camera towards the ground.
        target.y = heightAt(target.x, target.z);
      }
    }
    offset.copy(position).sub(target);
    const distance = offset.length();
    if (distance < controls.minDistance || distance > controls.maxDistance) {
      if (distance < 1e-8) offset.set(0, 1, 0);
      position.copy(target).add(offset.setLength(clamp(distance, controls.minDistance, controls.maxDistance)));
    }
    if (inside(position.x, position.z) && !isCut(position.x, position.z)) {
      position.y = Math.max(position.y, heightAt(position.x, position.z) + clearance);
    }
    camera.lookAt(target); camera.updateMatrixWorld();
  }

  controls.update = (...args) => {
    previous.copy(camera.position);
    const moved = originalUpdate(...args);
    constrain(!automatic());
    return moved || previous.distanceToSquared(camera.position) > 1e-10;
  };

  // A cursor over the sky/outside the map must not dolly upwards or away from
  // the subject. Such gestures use the grounded centre instead.
  function zoomAt(x, y) {
    const rect = surface.getBoundingClientRect();
    camera.updateMatrixWorld();
    direction.set((x - rect.left) / rect.width * 2 - 1, 1 - (y - rect.top) / rect.height * 2, 1)
      .unproject(camera).sub(camera.position).normalize();
    controls.zoomToCursor = !!groundPoint(camera.position, direction);
  }
  surface.addEventListener('wheel', e => zoomAt(e.clientX, e.clientY), {capture: true, passive: true});
  for (const type of ['pointerdown', 'pointermove']) surface.addEventListener(type, e => {
    if (type === 'pointerdown' && e.pointerType === 'mouse' && e.button === 1) zoomAt(e.clientX, e.clientY);
    if (e.pointerType !== 'touch') return;
    if (type === 'pointermove' && !fingers.has(e.pointerId)) return;
    fingers.set(e.pointerId, {x: e.clientX, y: e.clientY});
    if (fingers.size === 2) { const [a, b] = [...fingers.values()]; zoomAt((a.x + b.x) / 2, (a.y + b.y) / 2); }
  }, {capture: true, passive: true});
  for (const type of ['pointerup', 'pointercancel', 'lostpointercapture']) surface.addEventListener(type, e => fingers.delete(e.pointerId), true);

  function pose({base, scale = 1, heading, polar} = {}) {
    if (!base) constrain();
    const target = (base?.target || controls.target).clone();
    offset.copy(base?.pos || camera.position).sub(target);
    const sphere = new Spherical().setFromVector3(offset);
    sphere.radius = clamp(sphere.radius * scale, controls.minDistance, controls.maxDistance);
    if (heading !== undefined) sphere.theta = -heading;
    if (polar !== undefined) sphere.phi = clamp(polar, controls.minPolarAngle, controls.maxPolarAngle);
    return {target, pos: new Vector3().setFromSpherical(sphere).add(target), orbit: true};
  }
  return {pose, constrain, groundPoint};
}
