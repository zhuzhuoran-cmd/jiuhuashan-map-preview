// The traveller shown during a route preview: a walker on foot legs, and the vehicle actually ridden on the others — the
// scenic bus (景交车), the 百岁宫 funicular car and a 天台 ropeway cabin, the last two styled like the ones already running
// on the map. Kept deliberately plain for older phones: boxes, a few short cylinders and one small sphere, about 60–300
// triangles a model with its ground ring, lighting baked into vertex colours so one unlit material serves them all, and
// only the model in use is drawn (1–4 draw calls, and none while no preview is shown).
// It keeps a steady size on screen (or its real size when the camera is close enough for that to be larger) and is
// drawn over the scene — the depth buffer is cleared just before it — so hills and roofs never hide it.
import * as THREE from 'three';
import {mergeGeometries} from 'three/addons/utils/BufferGeometryUtils.js';

const LIGHT = new THREE.Vector3(-.4, .85, .35).normalize();
// A shape with its colour, translated into place, flat-shaded by face against a fixed light.
function part(geometry, color, x = 0, y = 0, z = 0) {
  const g = geometry.index ? geometry.toNonIndexed() : geometry;
  g.deleteAttribute('uv'); g.translate(x, y, z); g.computeVertexNormals();
  const c = new THREE.Color(color), n = g.attributes.normal, out = new Float32Array(n.count * 3);
  for (let i = 0; i < n.count; i++) {
    const k = .62 + .38 * Math.max(0, n.getX(i) * LIGHT.x + n.getY(i) * LIGHT.y + n.getZ(i) * LIGHT.z);
    out[i * 3] = c.r * k; out[i * 3 + 1] = c.g * k; out[i * 3 + 2] = c.b * k;
  }
  g.deleteAttribute('normal'); g.setAttribute('color', new THREE.BufferAttribute(out, 3));
  return g;
}
const box = (w, h, d, color, x, y, z) => part(new THREE.BoxGeometry(w, h, d), color, x, y, z);

// Models face -z, stand on y = 0 (the ropeway cabin hangs from its grip at y = 0), and are sized in their own units:
// px is how many screen pixels one unit takes, real how many metres it is in life, base the tint and x/z stretch of the
// ground ring. box is the screen area it covers around its anchor, in units (left, top, right, bottom; y down), which
// the stop labels keep clear of.
const JACKET = '#e2862b', SKIN = '#f0c8a0', TROUSERS = '#3b4a63', BAG = '#7c5b3c', HAT = '#f3e6c4';
const GLASS = '#466266', CABIN_RED = '#943f2d', CREAM = '#eee8d8', BUS_BLUE = '#2e6fd0', PURPLE = '#7a4fc9', TYRE = '#26282a';

function walker(mat) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(mergeGeometries([
    box(.3, .36, .19, JACKET, 0, .64, 0), box(.22, .27, .1, BAG, 0, .66, .14),
    box(.08, .33, .1, '#d27a22', -.195, .625, 0), box(.08, .33, .1, '#d27a22', .195, .625, 0),
    part(new THREE.SphereGeometry(.115, 8, 6), SKIN, 0, .91, 0),
    part(new THREE.CylinderGeometry(.17, .17, .025, 10), HAT, 0, .975, 0), part(new THREE.CylinderGeometry(.09, .11, .08, 10), HAT, 0, 1.02, 0),
  ]), mat));
  // the legs hang from the hip so they can swing; at this size swinging arms would not be seen, so they are part of the body
  const leg = x => { const m = new THREE.Mesh(box(.11, .44, .13, TROUSERS, 0, -.22, 0), mat); m.position.set(x, .46, 0); g.add(m); return m; };
  const legs = [leg(-.075), leg(.075)];
  return {group: g, px: 34, real: 1.65, base: [JACKET, 1, 1], box: [-.32, -1.12, .32, .22], swing(a) { legs[0].rotation.x = a * .55; legs[1].rotation.x = -a * .55; }};
}
function bus(mat) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(mergeGeometries([
    box(.34, .27, 1, BUS_BLUE, 0, .195, 0), box(.352, .1, .8, GLASS, 0, .255, .04), box(.3, .11, .02, GLASS, 0, .25, -.505),
    box(.26, .09, .02, GLASS, 0, .26, .505), box(.351, .025, .98, '#f7f5ee', 0, .13, 0), box(.28, .03, .86, '#d9e6f7', 0, .345, .02),
    box(.36, .1, .14, TYRE, 0, .06, -.32), box(.36, .1, .14, TYRE, 0, .06, .32),
    box(.05, .03, .01, '#ffe9a8', -.11, .12, -.505), box(.05, .03, .01, '#ffe9a8', .11, .12, -.505),
  ]), mat));
  return {group: g, px: 64, real: 11, base: [BUS_BLUE, 1.05, 1.55], pitch: true, box: [-.55, -.5, .55, .28]};
}
function funicular(mat) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(mergeGeometries([
    box(.3, .3, .8, CREAM, 0, .21, 0), box(.312, .12, .7, GLASS, 0, .25, 0), box(.26, .1, .012, GLASS, 0, .25, -.405),
    box(.26, .1, .012, GLASS, 0, .25, .405), box(.32, .05, .84, CABIN_RED, 0, .385, 0), box(.24, .06, .6, TYRE, 0, .03, 0),
  ]), mat));
  return {group: g, px: 64, real: 13, base: [PURPLE, .95, 1.3], pitch: true, box: [-.5, -.55, .5, .28]};
}
function cabin(mat) {
  const g = new THREE.Group();
  g.add(new THREE.Mesh(mergeGeometries([
    box(.12, .07, .2, '#3e514c', 0, -.035, 0), box(.035, .24, .035, '#594937', 0, -.19, 0),
    box(.44, .38, .38, CABIN_RED, 0, -.5, 0), box(.452, .14, .392, GLASS, 0, -.46, 0), box(.36, .04, .32, CREAM, 0, -.29, 0),
  ]), mat));
  return {group: g, px: 76, real: 3.8, box: [-.3, -.12, .3, .72]};
}

export function createTraveller(parent) {
  const root = new THREE.Group(); root.visible = false; root.renderOrder = 1e6; parent.add(root);
  // transparent (at full opacity) so it sorts after the route lines, which are drawn in the transparent pass too
  const mat = new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, fog: false, toneMapped: false});
  const baseMat = new THREE.MeshBasicMaterial({vertexColors: true, transparent: true, depthWrite: false, fog: false, toneMapped: false});
  // a white ring on the ground marks where it stands, tinted inside with the colour of its leg on the map (one mesh:
  // the colours carry their own opacity)
  const paint = (g, color, alpha) => {
    const c = new THREE.Color(color), n = g.attributes.position.count, a = new Float32Array(n * 4);
    for (let i = 0; i < n; i++) a.set([c.r, c.g, c.b, alpha], i * 4);
    g.deleteAttribute('uv'); g.deleteAttribute('normal'); g.setAttribute('color', new THREE.BufferAttribute(a, 4)); return g;
  };
  const base = ([tint, sx, sz]) => new THREE.Mesh(mergeGeometries([paint(new THREE.CircleGeometry(.34, 24), tint, .32),
    paint(new THREE.RingGeometry(.34, .42, 24), '#ffffff', .92)]).rotateX(-Math.PI / 2).scale(sx, 1, sz).translate(0, .005, 0), baseMat);
  const models = {walk: walker(mat), bus: bus(mat), funicular: funicular(mat), cable: cabin(mat)};
  for (const m of Object.values(models)) {
    m.group.rotation.order = 'YXZ'; m.group.visible = false; root.add(m.group);
    if (m.base) m.group.add(base(m.base));
  }
  // Drawn last and over everything: the first traveller mesh drawn in a frame clears the depth buffer (depth writes are
  // switched back on first, as the route lines before it leave them off).
  let clearedFrame = -1;
  const onTop = renderer => {
    const frame = renderer.info.render.frame; if (frame === clearedFrame) return;
    clearedFrame = frame; renderer.state.buffers.depth.setMask(true); renderer.clearDepth();
  };
  // every group level carries the order, as a nested group passes its own renderOrder down instead of its parent's
  root.traverse(o => { if (o.isGroup) o.renderOrder = 1e6; else if (o.isMesh) { o.onBeforeRender = onTop; o.renderOrder = o.material === mat ? 1 : 0; } });

  let mode = null, shownAt = 0, heading = null, phase = 0, amp = 0, pxPerUnit = 0;
  const v = new THREE.Vector3();
  return {
    get visible() { return root.visible; },
    get mode() { return mode; },
    // switch model (with a short pop so the change is noticed)
    show(next, now) {
      if (next === mode) return;
      if (mode) models[mode].group.visible = false;
      mode = next; models[mode].group.visible = true; root.visible = true; shownAt = now;
    },
    hide() { if (mode) models[mode].group.visible = false; root.visible = false; mode = null; heading = null; amp = 0; },
    // pos in scene coordinates; yaw as used by the route preview (null keeps the last); pxPerMetre at pos
    update(pos, yaw, pitch, moving, now, sec, pxPerMetre) {
      if (!mode) return;
      const m = models[mode], t = Math.min(1, (now - shownAt) / 320), pop = t < 1 ? .35 + .65 * (1 + 2.2 * (t - 1) ** 3 + 1.2 * (t - 1) ** 2) : 1;
      const k = Math.max(m.real, m.px / pxPerMetre);
      pxPerUnit = k * pxPerMetre; root.position.copy(pos); root.scale.setScalar(k * pop);
      if (yaw !== null) { if (heading === null) heading = yaw; else { const d = Math.atan2(Math.sin(yaw - heading), Math.cos(yaw - heading)); heading += d * Math.min(1, sec * 10); } }
      amp += ((moving ? 1 : 0) - amp) * Math.min(1, sec * 8);
      if (moving) phase += sec * Math.PI * 2 * 2.3;
      m.group.rotation.set(m.pitch ? Math.max(-.5, Math.min(.5, pitch)) : 0, -(heading ?? 0), mode === 'cable' ? Math.sin(now / 320) * .05 * amp : 0);
      m.swing?.(Math.sin(phase) * amp);
    },
    // the screen rectangle it covers (for keeping stop labels clear of it), or null while hidden
    screenBox(camera, w, h) {
      if (!root.visible || !mode) return null;
      v.copy(root.position).project(camera); if (v.z < -1 || v.z > 1) return null;
      const x = (v.x + 1) / 2 * w, y = (1 - v.y) / 2 * h, b = models[mode].box, u = pxPerUnit;
      return [x + b[0] * u, y + b[1] * u, x + b[2] * u, y + b[3] * u];
    },
  };
}
