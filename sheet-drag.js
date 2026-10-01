// A phone's bottom sheets follow the finger: the directory (#panel), the place card (#card) and the layer settings
// (.settings-wrap) drag down to close and up to their taller size (.expanded); a tap on the grip toggles that size.
// Portrait phones only: landscape side sheets and the desktop column stay put. Closing goes through each sheet's own close
// control, so the app keeps its bookkeeping (camera return, route bar, view shift) in one place; the directory is the
// exception when the app passes closePanel: a drag only puts it away, where its × on a route's page also leaves the
// route (swiping the sheet down to look at the map must not throw away the route just opened). After every
// size change a 'sheetchange' event lets the app re-centre the map, once at once and again when the height has settled.
const SKIP = 'button,a,input,select,textarea,label,summary';

export function setupSheetDrag({compact, closePanel = null}) {
  const $ = s => document.querySelector(s);
  const panel = $('#panel'), card = $('#card'), settings = $('#settings'), wrap = settings?.querySelector('.settings-wrap');
  let notifyTimer = 0;
  const notify = () => {
    dispatchEvent(new Event('sheetchange'));
    clearTimeout(notifyTimer); notifyTimer = setTimeout(() => dispatchEvent(new Event('sheetchange')), 500);
  };
  // grab(target, y from the sheet's top) says how a press may move the sheet: 'grip' (drag, or tap to resize), 'head'
  // (drag), 'hero' (drag only once the move is clearly vertical, so the photo strip still scrolls sideways) or nothing.
  const sheets = [
    {el: panel, watch: panel, grow: true, open: () => !panel.classList.contains('closed'), close: () => closePanel ? closePanel() : $('#panel-close')?.click(),
      grab: (t, y) => t.closest('.sheet-grip') ? 'grip' : t.closest(SKIP) ? null : y < 24 ? 'grip' : t.closest('.panel-head') ? 'head' : null},
    {el: card, watch: card, grow: true, open: () => card.classList.contains('show'), close: () => card.querySelector(':scope > .close')?.click(),
      grab: (t, y) => t.closest('button,input,select,textarea,label,summary') ? null : y < 24 ? 'grip' :
        t.closest('.card-head') ? (t.closest('a') ? null : 'head') : t.closest('.card-hero') ? 'hero' : null},
    {el: wrap, watch: settings, grow: false, open: () => !settings.classList.contains('collapsed'), close: () => $('#settings-toggle')?.click(),
      grab: (t, y) => t.closest(SKIP) ? null : y < 24 || t.closest('.settings-head') ? 'head' : null},
  ].filter(s => s.el && s.watch);
  const usable = s => s.open() && compact() && s.el.offsetWidth > innerWidth * .6;

  let g = null, swallowUntil = 0;
  const unstyle = el => { el.style.transition = ''; el.style.transform = ''; };
  const capture = e => { try { g.s.el.setPointerCapture(e.pointerId); } catch {} };
  const speed = () => { const a = g.trail[0], b = g.trail[g.trail.length - 1]; return b[0] > a[0] ? (b[1] - a[1]) / (b[0] - a[0]) : 0; };
  const track = e => { const t = e.timeStamp; g.trail.push([t, e.clientY]); while (g.trail.length > 2 && t - g.trail[0][0] > 100) g.trail.shift(); };

  function down(s, e) {
    if (g || !e.isPrimary || e.button !== 0 || !(e.target instanceof Element) || !usable(s)) return;
    const kind = s.grab(e.target, e.clientY - s.el.getBoundingClientRect().top); if (!kind) return;
    g = {s, kind, id: e.pointerId, x0: e.clientX, y0: e.clientY, drag: false, trail: [[e.timeStamp, e.clientY]], expanded: s.el.classList.contains('expanded')};
    if (kind !== 'hero') capture(e);
  }
  function move(e) {
    if (!g || e.pointerId !== g.id) return;
    const dx = e.clientX - g.x0, dy = e.clientY - g.y0;
    if (!g.drag) {
      if (Math.hypot(dx, dy) < 8) return;
      if (g.kind === 'hero' && Math.abs(dy) <= Math.abs(dx)) { g = null; return; }  // sideways: the photos scroll
      g.drag = true; capture(e); g.s.el.style.transition = 'none';
    }
    track(e);
    // Downwards the sheet follows the finger. Upwards a default-size sheet gives 40 px (the wish to expand), an expanded
    // one only resists; either way it never lifts far off the bottom edge.
    const room = g.s.grow && !g.expanded;
    const lift = dy >= 0 ? dy : room ? (dy > -40 ? dy : Math.max(-64, -40 + (dy + 40) * .2)) : Math.max(-40, dy * .35);
    g.s.el.style.transform = `translateY(${lift}px)`;
  }
  function up(e) {
    if (!g || e.pointerId !== g.id) return;
    const {s, kind, drag, expanded} = g;
    if (!drag) {
      g = null;
      if (kind === 'grip' && s.grow) { swallowUntil = performance.now() + 350; s.el.classList.toggle('expanded'); notify(); }
      return;
    }
    track(e);
    const dy = e.clientY - g.y0, v = speed(), h = s.el.offsetHeight;
    g = null;
    unstyle(s.el);  // the sheet's own CSS transitions carry it from where the finger left it
    if (dy > 0 && (dy > 90 || v > .6)) {
      if (expanded && s.grow && dy <= h * .45) { s.el.classList.remove('expanded'); notify(); }  // first step down: default size
      else s.close();
    } else if (dy < 0 && s.grow && !expanded && (dy < -50 || v < -.5)) { s.el.classList.add('expanded'); notify(); }
    swallowUntil = performance.now() + 350;  // only now: close() itself clicks a control inside the sheet
  }
  function cancel(e) {
    if (!g || e.pointerId !== g.id) return;
    if (g.drag) unstyle(g.s.el);
    g = null;
  }

  for (const s of sheets) {
    s.el.addEventListener('pointerdown', e => down(s, e));
    s.el.addEventListener('pointermove', move);
    s.el.addEventListener('pointerup', up);
    s.el.addEventListener('pointercancel', cancel);
    // The click that ends a drag or a grip tap must not also open a photo or press what lies under the finger.
    s.el.addEventListener('click', e => { if (performance.now() < swallowUntil) { swallowUntil = 0; e.preventDefault(); e.stopPropagation(); } }, true);
    // A mouse press on a photo would otherwise start the browser's own image drag and end ours.
    s.el.addEventListener('dragstart', e => { if (g?.s === s) e.preventDefault(); });
    // The settings sheet has nothing that scrolls, so it can hold on to a touch anywhere in its grip strip (CSS only
    // stops panning on .settings-head). The panel and card are not given this: a blocking touch listener there would
    // delay the start of every list scroll; their handles rely on CSS touch-action instead.
    if (!s.grow) s.el.addEventListener('touchmove', e => { if (g?.s === s && g.kind !== 'hero') e.preventDefault(); }, {passive: false});
    // Closing keeps the tall size while the sheet slides away, then drops it, so the next opening starts at the default
    // size (at once, if it opens again before that).
    let wasOpen = s.open(), stale = 0;
    new MutationObserver(() => {
      const open = s.open(); if (open === wasOpen) return; wasOpen = open;
      clearTimeout(stale);
      if (!open) {
        if (g?.s === s) { unstyle(s.el); g = null; }
        if (s.el.classList.contains('expanded')) stale = setTimeout(() => { stale = 0; if (!s.open()) { s.el.classList.remove('expanded'); notify(); } }, 480);
      } else if (stale) { stale = 0; s.el.classList.remove('expanded'); notify(); }
    }).observe(s.watch, {attributes: true, attributeFilter: ['class']});
  }
}
