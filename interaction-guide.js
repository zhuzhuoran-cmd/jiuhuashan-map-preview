// A non-modal tour: the map stays visible and receives gestures through it.
export function setupInteractionGuide() {
  const tour = document.querySelector('#gesture-tour');
  const replay = document.querySelector('#help-open');
  const skip = document.querySelector('#tour-skip');
  const steps = [...tour.querySelectorAll('.tour-step')];
  const dots = [...tour.querySelectorAll('.tour-progress i')];
  const reducedMotion = matchMedia('(prefers-reduced-motion:reduce)');
  let timers = [];
  let frame;

  function clearPlayback() {
    timers.forEach(clearTimeout);
    timers = [];
    cancelAnimationFrame(frame);
  }

  function showStep(index) {
    steps.forEach((step, i) => {
      step.classList.toggle('active', i === index);
      step.setAttribute('aria-hidden', String(i !== index));
      dots[i].classList.toggle('active', i === index);
    });
  }

  function stop() {
    clearPlayback();
    tour.classList.remove('show');
    // Avoid leaving keyboard focus on a control that is about to disappear.
    if (tour.contains(document.activeElement)) replay.focus({preventScroll: true});
    timers.push(setTimeout(() => { tour.hidden = true; }, reducedMotion.matches ? 0 : 600));
  }

  function start() {
    clearPlayback();
    tour.classList.remove('show');
    steps.forEach(step => step.classList.remove('active'));
    tour.hidden = false;
    void tour.offsetWidth; // Restart the hand animation when replay is clicked.
    showStep(0);
    frame = requestAnimationFrame(() => tour.classList.add('show'));
    timers.push(setTimeout(() => showStep(1), 3800));
    timers.push(setTimeout(() => showStep(2), 6500));
    timers.push(setTimeout(stop, 9300));
  }

  replay.addEventListener('click', start);
  skip.addEventListener('click', stop);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !tour.hidden) stop();
  });
  // Start exploring at any moment; the tour never consumes a map gesture.
  document.addEventListener('pointerdown', event => {
    if (!tour.hidden && event.target instanceof Element &&
        !event.target.closest('#gesture-tour,#help-open')) stop();
  }, {passive: true});
  document.addEventListener('visibilitychange', () => { if (document.hidden) stop(); });
  return {start};
}
