// One flight owns both camera movement and its delayed arrival callback. A new
// navigation or a real map gesture cancels both, so an old card cannot reopen.
export function createCameraFlight(camera, controls, {now = () => performance.now(), reducedMotion = false} = {}) {
  let flight = null;
  const cancel = () => { flight = null; };
  function move(to, duration = 1200, onDone = null, arrivalDelay = 0) {
    cancel(); controls.stopMotion?.();
    flight = {from: camera.position.clone(), targetFrom: controls.target.clone(),
      pos: to.pos.clone(), target: to.target.clone(), start: now(), duration: reducedMotion ? 0 : duration,
      onDone, arrivalDelay: reducedMotion ? 0 : arrivalDelay};
    if (!flight.duration) update(flight.start);
  }
  function update(time) {
    if (!flight) return false;
    const f = flight, t = f.duration ? Math.max(0, Math.min(1, (time - f.start) / f.duration)) : 1;
    const eased = t < .5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
    camera.position.lerpVectors(f.from, f.pos, eased);
    controls.target.lerpVectors(f.targetFrom, f.target, eased);
    camera.position.y += Math.sin(t * Math.PI) * Math.min(180, f.from.distanceTo(f.pos) * .12);
    if (t === 1 && time >= f.start + f.duration + f.arrivalDelay) {
      flight = null; f.onDone?.();
    }
    return true;
  }
  return {move, update, cancel, get active() { return !!flight; }, get destination() { return flight; }};
}
