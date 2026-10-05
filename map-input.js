import {OrbitControls} from 'three/addons/controls/OrbitControls.js';

// The canvas and CSS labels are siblings. Listen on their shared surface so a
// gesture can start on either one, including two fingers on different layers.
export function createMapControls(camera, surface, onMapTap) {
  const controls = new OrbitControls(camera, surface);
  const updateOrbit = controls.update.bind(controls);
  const pointers = new Set();
  let down = null;
  const beginGesture = () => {
    if (down?.gesture) return;
    if (down) down.gesture = true;
    controls.dispatchEvent({type: 'gesturestart'});
  };
  // Flush old drag/zoom damping before an explicit flight or route takes over.
  // OrbitControls exposes no velocity reset; drain it while preserving the pose.
  controls.stopMotion = () => {
    const position = camera.position.clone(), target = controls.target.clone(), damping = controls.enableDamping;
    controls.enableDamping = false; updateOrbit();
    camera.position.copy(position); controls.target.copy(target);
    controls.enableDamping = damping; updateOrbit();
  };

  surface.addEventListener('pointerdown', event => {
    if (!pointers.size) {
      down = {
        id: event.pointerId, x: event.clientX, y: event.clientY,
        time: event.timeStamp, primary: event.button === 0,
        tolerance: event.pointerType === 'mouse' ? 5 : 8,
        label: event.target.closest?.('.maplabel button'),
        moved: false, multiple: false,
      };
    }
    pointers.add(event.pointerId);
    // Capture every finger on a stable element: labels can leave the scene
    // while panning, and their implicit touch capture would disappear with them.
    surface.setPointerCapture(event.pointerId);
    if (down && pointers.size > 1) { down.multiple = true; beginGesture(); }
  });

  surface.addEventListener('pointermove', event => {
    if (down && down.id === event.pointerId &&
        Math.hypot(event.clientX - down.x, event.clientY - down.y) >= down.tolerance) {
      down.moved = true; beginGesture();
    }
  });

  surface.addEventListener('pointerup', event => {
    const tap = pointers.has(event.pointerId) && pointers.size === 1 && down &&
      down.id === event.pointerId && down.primary && !down.multiple && !down.moved &&
      event.timeStamp - down.time < 550 &&
      Math.hypot(event.clientX - down.x, event.clientY - down.y) < down.tolerance;
    const label = down?.label;
    pointers.delete(event.pointerId);
    if (!pointers.size) down = null;
    if (!tap) return;
    // OrbitControls captures the pointer on the shared surface. Remember the
    // original label so a short tap still opens it after pointerup is retargeted.
    if (label) {
      if (label.isConnected) label.click();
    } else {
      onMapTap(event);
    }
  });

  const cancel = event => {
    if (pointers.delete(event.pointerId)) down = null;
  };
  surface.addEventListener('pointercancel', cancel);
  surface.addEventListener('lostpointercapture', cancel);
  surface.addEventListener('wheel', beginGesture, {passive: true, capture: true});
  surface.addEventListener('click', event => {
    // Pointer taps are handled above; suppress the browser's follow-up click,
    // including clicks after a drag. Keyboard and accessibility clicks still work.
    if ((event.detail > 0 || event.pointerType) && event.target.closest?.('.maplabel button')) {
      event.preventDefault();
      event.stopPropagation();
    }
  }, true);
  return controls;
}
