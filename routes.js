// Recommended routes: the list and itinerary in the panel, the route drawn on the terrain with numbered stops, and a
// camera preview that travels it. Route data (stops, legs, measured metres and minutes) is built by scripts/r3/routes.py.
import * as THREE from 'three';
import {CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import {Line2} from 'three/addons/lines/Line2.js';
import {LineMaterial} from 'three/addons/lines/LineMaterial.js';
import {LineGeometry} from 'three/addons/lines/LineGeometry.js';
import {createTraveller} from './traveller.js?v=20260930-traveller';

const MODES = {walk: {name: '步行', color: '#e2862b'}, funicular: {name: '缆车', color: '#7a4fc9'},
  cable: {name: '索道', color: '#7a4fc9'}, bus: {name: '景交车', color: '#2e6fd0'}};
// Preview speed relative to walking: rides are fast-forwarded (the bus covers 2.5 times the ground in the same time),
// so a whole route plays in under a minute without the rides taking most of it. On a ride the camera also draws back
// (ZOOM times its walking distance) and follows more calmly, so a long winding bus ride does not rush past close up.
const PACE = {walk: 1, funicular: 1.3, cable: 1.6, bus: 2.5};
const ZOOM = {walk: 1, funicular: 1.3, cable: 1.6, bus: 2.4};
const WALK_SVG = '<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-7.5L14 16v5M8 12l2-4.5 3-.5 2.5 3.5L18 11M10.5 7.8 9 13"/></svg>';
const RIDE_SVG = '<svg viewBox="0 0 24 24"><path d="M3 5.5 21 3M12 4.3V8M6.5 8h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16.5v-7A1.5 1.5 0 0 1 6.5 8zM5 12.5h14"/></svg>';
const BUS_SVG = '<svg viewBox="0 0 24 24"><rect x="4.5" y="3.5" width="15" height="15" rx="2.5"/><path d="M4.5 11h15M8 18.5V21M16 18.5V21"/><circle cx="8.5" cy="15" r=".9"/><circle cx="15.5" cy="15" r=".9"/></svg>';
const PLAY_SVG = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
const STOP_SVG = '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>';
const FIT_SVG = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';

const km = m => m >= 1000 ? `${(m / 1000).toFixed(1)} 公里` : `${Math.round(m / 10) * 10} 米`;
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }

export function setupRoutes(ctx) {
  const {routes, world, camera, controls, hAt, realH = h => h, fly, pose, cancelFlight, openPanel, closeSheetsForRoute, onFrame, isMobile, visibleRect} = ctx;
  const list = document.querySelector('#route-list'), detail = document.querySelector('#route-detail');
  const hud = document.querySelector('#route-hud'), strip = hud.querySelector('.rh-stops'), bar = hud.querySelector('.rh-bar i');
  const group = new THREE.Group(); group.renderOrder = 5; world.add(group);
  const materials = [];
  let current = null, labels = [], marks = [], path = null, preview = null, focusIndex = -1;
  let finishTimer = null;
  const cancelFinish = () => { clearTimeout(finishTimer); finishTimer = null; };

  // ---- geometry: parts sampled every ~6 m, draped a little above the terrain (cable lines hang above it)
  function sample(part) {
    const pts = part.pts, out = [];
    const rise = part.mode === 'cable' ? 22 : 2.6;
    const h0 = hAt(...pts[0]) + rise, h1 = hAt(...pts.at(-1)) + rise;
    let total = 0; const seg = [];
    for (let i = 1; i < pts.length; i++) { const d = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); seg.push(d); total += d; }
    let run = 0;
    for (let i = 0; i < pts.length; i++) {
      if (i > 0) {
        const [ax, az] = pts[i - 1], [bx, bz] = pts[i], d = seg[i - 1], n = Math.max(1, Math.ceil(d / 6));
        for (let k = 1; k <= n; k++) {
          const t = k / n, x = ax + (bx - ax) * t, z = az + (bz - az) * t, s = run + d * t;
          const ground = hAt(x, z) + 2.6;
          const y = part.mode === 'cable' ? Math.max(ground + 12, h0 + (h1 - h0) * (s / total)) : ground;
          out.push(new THREE.Vector3(x, y, z));
        }
        run += d;
      } else out.push(new THREE.Vector3(pts[0][0], part.mode === 'cable' ? h0 : hAt(...pts[0]) + 2.6, pts[0][1]));
    }
    return out;
  }
  function line(points, color, width, opts = {}) {
    const g = new LineGeometry(); g.setPositions(points.flatMap(p => [p.x, p.y, p.z]));
    const m = new LineMaterial({color, linewidth: width, transparent: true, opacity: opts.opacity ?? 1, depthTest: opts.depthTest ?? true,
      depthWrite: false, dashed: !!opts.dashed, dashSize: 9, gapSize: 7});
    m.resolution.set(innerWidth, innerHeight); materials.push(m);
    const l = new Line2(g, m); if (opts.dashed) l.computeLineDistances();
    l.renderOrder = opts.order ?? 5; l.frustumCulled = false; group.add(l); return l;
  }
  addEventListener('resize', () => { for (const m of materials) m.resolution.set(innerWidth, innerHeight); });

  function draw(route) {
    clearDrawing();
    const pts3 = [];
    route.legs.forEach((leg, li) => leg.parts.forEach(part => {
      const pts = sample(part), color = MODES[part.mode].color, ride = part.mode !== 'walk';
      // faint copy drawn through hills and roofs so the whole route stays readable, then a white casing and the line
      line(pts, color, 4, {depthTest: false, opacity: .38, order: 4, dashed: ride});
      line(pts, '#ffffff', 8.5, {order: 5});
      line(pts, color, 5, {order: 6, dashed: ride});
      for (const p of pts) pts3.push({p, mode: part.mode, leg: li});
    }));
    // a place visited twice (out and back) gets one label carrying both numbers, e.g. “2·12”. Each stop is a small numbered
    // dot; its name sits beside the dot and is shown only where it fits (see placeNames).
    const byPlace = new Map();
    route.stops.forEach((s, i) => { if (!byPlace.has(s.place)) byPlace.set(s.place, {s, idx: []}); byPlace.get(s.place).idx.push(i); });
    const last = route.stops.length - 1;
    for (const {s, idx} of byPlace.values()) {
      const box = el('div', 'maplabel route-stop' + (idx.includes(0) ? ' start' : idx.includes(last) ? ' end' : ''));
      // out of the Tab order, like the map's other labels: the itinerary and the route bar list the same stops as buttons
      const b = el('button'), name = el('span', 'rs-name', s.n); b.type = 'button'; b.title = s.n; b.tabIndex = -1;
      b.append(el('span', 'rs-num' + (idx.length > 1 ? ' multi' : ''), idx.map(i => i + 1).join('·')), name); b.onclick = () => focusStop(idx[0]);
      const stem = el('i'); box.append(b, stem);
      const label = new CSS2DObject(box); label.center.set(.5, 1); label.position.set(s.x, hAt(s.x, s.z) + 9, s.z);
      group.add(label); for (const i of idx) labels[i] = box;
      marks.push({box, b, name, stem, label, lift: 0, rank: idx.includes(0) || idx.includes(last) ? 1 : 2 + idx[0] / 100});
    }
    placedKey = '';
    path = buildPath(route, pts3);
    document.body.classList.add('route-on');
  }
  function clearDrawing() {
    for (const o of [...group.children]) { group.remove(o); if (o.isLine2) { o.geometry.dispose(); o.material.dispose(); } if (o.isCSS2DObject) o.element.remove(); }
    materials.length = 0; labels = []; marks = []; path = null; document.body.classList.remove('route-on');
  }

  // ---- stop dots and names. Stops close together would hide each other's numbers, so a dot that would cover one already
  // placed stands higher on a longer stem. Names go to the right of their dot, or else to the left, only where they cover no
  // other dot, stem or name, no chrome still over the map (ctx.covers: the rail, the credits row, the route bar…) and stay
  // inside the uncovered part of the screen. The focused stop goes first and always shows its name, then the start and end,
  // then the rest in order. The itinerary lists every name, a tap on a dot shows it, and so does hovering on a desktop.
  let placedKey = '', placedAt = 0, rect = null, covers = [], rectAt = -1e9;
  const v = new THREE.Vector3();
  function placeNames(now) {
    if (!marks.length) return false;
    camera.updateMatrixWorld();
    const key = camera.matrixWorld.elements.map(e => e.toFixed(1)).join() + camera.projectionMatrix.elements.join() + innerWidth + 'x' + innerHeight + ':' + focusIndex + ':' + (traveller.mode ?? '');
    if (key === placedKey && now - placedAt < 500) return false;  // still camera: re-check twice a second (a sheet may have moved)
    // reads the page layout, so at most twice a second, also while the camera moves (a sheet may have gone meanwhile)
    if (!rect || now - rectAt >= 500) { rect = visibleRect(); covers = ctx.covers?.() ?? []; rectAt = now; }
    placedKey = key; placedAt = now;
    const R = rect, W = innerWidth, H = innerHeight, taken = [], stems = [], active = labels[focusIndex];
    const hits = (r, list) => list.some(o => r[0] < o[2] && r[2] > o[0] && r[1] < o[3] && r[3] > o[1]);
    const inset = (r, d) => [r[0] + d, r[1] + d, r[2] - d, r[3] - d];
    const order = [...marks].sort((a, b) => (b.box === active) - (a.box === active) || a.rank - b.rank);
    const body = traveller.screenBox(camera, W, H); if (body) taken.push(body);  // dots rise and names step aside for the traveller
    for (const m of order) {
      // sizes are read once the label has been laid out; until then, estimates from the text
      if (!m.bh && m.b.offsetHeight) { m.bw = m.b.offsetWidth; m.bh = m.b.offsetHeight; m.h = m.box.offsetHeight - m.lift; m.nw = m.name.offsetWidth; m.nh = m.name.offsetHeight; }
      m.label.getWorldPosition(v).project(camera);
      m.on = v.z > -1 && v.z < 1;
      const bw = m.bw || 26, bh = m.bh || 26, x = (v.x + 1) / 2 * W, y = (1 - v.y) / 2 * H - (m.h || 36) + bh / 2;
      const dot = up => [x - bw / 2, y - up - bh / 2, x + bw / 2, y - up + bh / 2];
      // dots may touch; one that would cover much of another steps up just clear of it, at most about two dots high and
      // never out of the uncovered area
      let lift = 0;
      if (m.on) {
        const d0 = dot(0), below = taken.filter(o => hits(inset(d0, 6), [o]));
        const up = below.length ? Math.max(...below.map(o => d0[3] - o[1] + 2)) : 0;
        if (up && up <= 2 * bh + 6 && dot(up)[1] >= R.top && !hits(inset(dot(up), 4), taken) && !hits(dot(up), covers)) lift = Math.round(up);
      }
      m.dot = dot(lift); if (m.on) taken.push(m.dot);
      // the stem and its ground dot, from under the dot down to the stop's point: a name laid across them would be cut
      m.stemBox = m.on ? [x - 4, m.dot[3], x + 4, (1 - v.y) / 2 * H + 5] : null; if (m.stemBox) stems.push(m.stemBox);
      if (lift !== m.lift) { m.lift = lift; m.stem.style.height = lift ? `${10 + lift}px` : ''; }
      // a stem that runs across the traveller fades, so it does not cut through the figure
      m.box.classList.toggle('veiled', !!body && m.on && hits([x - 4, m.dot[3], x + 4, (1 - v.y) / 2 * H + 6], [body]));
    }
    for (const m of order) {
      let side = 0;
      if (m.on) {
        const nw = m.nw || [...m.name.textContent].length * 12 + 20, nh = m.nh || 22, [l, t, r, b] = m.dot, cy = (t + b) / 2;
        const rects = [[r + 3, cy - nh / 2, r + 3 + nw, cy + nh / 2], [l - 3 - nw, cy - nh / 2, l - 3, cy + nh / 2]];
        const inside = q => q[0] >= R.left + 4 && q[2] <= R.right - 4 && q[1] >= R.top + 2 && q[3] <= R.bottom - 2;
        const others = stems.filter(o => o !== m.stemBox);
        const clear = q => inside(q) && !hits(q, covers);
        let k = rects.findIndex(q => clear(q) && !hits(q, taken) && !hits(q, others));
        // the focused stop always shows its name: clear of chrome and the traveller if either side allows it, else wherever it fits
        if (k < 0 && m.box === active) {
          k = rects.findIndex(q => clear(q) && !(body && hits(q, [body])));
          if (k < 0) k = rects.findIndex(clear); if (k < 0) k = rects.findIndex(inside);
          if (k < 0) k = Math.max(0, rects.findIndex(q => q[0] >= 0 && q[2] <= W));  // at least on the screen
        }
        if (k >= 0) { side = k ? -1 : 1; taken.push(rects[k]); }
      }
      m.box.classList.toggle('named', side !== 0); m.box.classList.toggle('flip', side === -1);
    }
    return true;
  }

  // ---- the travelled path: cumulative paced distance, the mode of each stretch (that of the point it ends at), where
  // each stop falls and each leg ends, and where a leg changes between walking and a ride away from any stop
  function buildPath(route, pts3) {
    const pts = [], cum = [], modes = [];
    let s = 0;
    pts3.forEach((q, i) => {
      if (i) s += q.p.distanceTo(pts3[i - 1].p) / PACE[q.mode];
      pts.push(q.p); cum.push(s); modes.push(q.mode);
    });
    const stopAt = route.stops.map((st, i) => {
      if (i === 0) return 0;
      let best = 0, bd = Infinity; const legEnd = pts3.findLastIndex(q => q.leg === i - 1);
      for (let k = Math.max(0, legEnd - 40); k <= legEnd; k++) { const d = Math.hypot(pts[k].x - st.x, pts[k].z - st.z); if (d < bd) { bd = d; best = k; } }
      return cum[best];
    });
    const legEnd = route.legs.map((_, li) => cum[pts3.findLastIndex(q => q.leg === li)]);
    const switches = [];
    for (let i = 1; i < pts3.length; i++) if (pts3[i].mode !== pts3[i - 1].mode && pts3[i].leg === pts3[i - 1].leg) switches.push(cum[i - 1]);
    return {pts, cum, modes, total: s, stopAt, legEnd, switches};
  }
  function at(path, s) {
    const {pts, cum} = path; let lo = 0, hi = cum.length - 1;
    if (s <= 0) return pts[0].clone(); if (s >= cum[hi]) return pts[hi].clone();
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
    const t = (s - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]); return pts[lo].clone().lerp(pts[hi], t);
  }
  function modeAt(path, s) {
    const {cum, modes} = path; let lo = 0, hi = cum.length - 1;
    if (s >= cum[hi]) return modes[hi];
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
    return modes[hi];
  }

  // ---- camera
  // Frame the whole route in the part of the screen left uncovered (between the top bar and a phone's sheet, or beside the
  // desktop panel): turn so the route's long axis runs across the screen, then refine centre and distance by projecting it.
  function fitPose(route) {
    const pts = [];
    route.legs.forEach(l => l.parts.forEach(p => p.pts.forEach(([x, z], i) => { if (i % 3 === 0 || i === p.pts.length - 1) pts.push([x, z, 8, 0, 0]); })));
    // each stop's numbered dot stands about 38 px tall and 30 px wide over its point; names are only shown where they fit
    // (placeNames), so they need no room of their own and the route can fill the view
    route.stops.forEach(s => pts.push([s.x, s.z, 9, 15, 38]));
    const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, mz = pts.reduce((a, p) => a + p[1], 0) / n;
    let sxx = 0, szz = 0, sxz = 0; for (const [x, z] of pts) { sxx += (x - mx) ** 2; szz += (z - mz) ** 2; sxz += (x - mx) * (z - mz); }
    let az = Math.atan2(2 * sxz, sxx - szz) / 2 * 180 / Math.PI;  // long axis → screen horizontal
    while (az - 25 > 90) az -= 180; while (25 - az > 90) az += 180;  // of the two ways round, keep closest to the usual view
    // a little more room at the sides, where the names of the outermost stops go
    const pol = 52, R = visibleRect(), W = innerWidth, H = innerHeight, mx0 = 22, my0 = 16;
    const vis = {w: R.right - R.left, h: R.bottom - R.top}, aimX = (R.left + R.right) / 2 + R.shiftX, aimY = (R.top + R.bottom) / 2 + R.shiftY;
    const cam = new THREE.PerspectiveCamera(43, W / H, 1, 60000), v = new THREE.Vector3(), right = new THREE.Vector3(), fwd = new THREE.Vector3();
    let cx = mx, cz = mz, dist = 1600;
    for (let k = 0; k < 30; k++) {
      const P = pose(cx, cz, dist, az, pol); cam.position.copy(P.pos); cam.lookAt(P.target); cam.updateMatrixWorld();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const [x, z, up, hw, top] of pts) {
        v.set(x, (hAt(x, z) + up) * world.scale.y, z).project(cam);
        const px = (v.x + 1) / 2 * W, py = (1 - v.y) / 2 * H; x0 = Math.min(x0, px - hw); x1 = Math.max(x1, px + hw); y0 = Math.min(y0, py - top); y1 = Math.max(y1, py);
      }
      const need = Math.max((x1 - x0) / Math.max(80, vis.w - 2 * mx0), (y1 - y0) / Math.max(60, vis.h - 2 * my0));
      const mpp = 2 * dist * Math.tan(43 * Math.PI / 360) / H, ox = (x0 + x1) / 2 - aimX, oy = (y0 + y1) / 2 - aimY;
      right.setFromMatrixColumn(cam.matrixWorld, 0).setY(0).normalize(); fwd.setFromMatrixColumn(cam.matrixWorld, 2).negate().setY(0).normalize();
      const along = mpp / Math.cos(pol * Math.PI / 180);
      cx += (right.x * ox * mpp - fwd.x * oy * along) * .85; cz += (right.z * ox * mpp - fwd.z * oy * along) * .85;
      dist = Math.min(12000, Math.max(250, dist * Math.min(1.8, Math.max(.55, need))));
      if (Math.abs(need - 1) < .01 && Math.abs(ox) < 2 && Math.abs(oy) < 2) break;
    }
    return pose(cx, cz, dist * 1.06, az, pol);
  }
  function overview() { stopPreview(); if (!current) return; const to = fitPose(current); fly(to, 1500); }
  function focusStop(i) {
    if (!current) return; stopPreview();
    const s = current.stops[i]; fly(pose(s.x, s.z, current.id === 'tiantai-classic' ? 420 : 260, 25, 55), 1300);
    setFocus(i);
  }
  function setFocus(i) {
    focusIndex = i;
    for (const b of new Set(labels)) b.classList.toggle('active', b === labels[i]);
    detail.querySelectorAll('.rs-stop').forEach(li => li.classList.toggle('active', +li.dataset.i === i));
    updateHud();
  }

  // ---- preview: the target travels the path and the camera trails behind, facing the direction of travel. A traveller
  // goes along it: a walker, or the vehicle ridden on that stretch. It stops briefly at each stop and wherever a leg
  // changes between walking and a ride, so the change can be seen; the route bar says what is happening.
  const traveller = createTraveller(ctx.scene ?? world.parent ?? world);
  const VERB = {walk: '步行', bus: '乘景交车', funicular: '乘缆车', cable: '乘索道'}, RIDE = {bus: '景交车', funicular: '缆车', cable: '索道'};
  const change = (from, to) => to === 'walk' ? `下${from === 'bus' ? '车' : RIDE[from]}步行` : from === 'walk' ? `乘${RIDE[to]}` : `换乘${RIDE[to]}`;
  function startPreview() {
    if (!current || !path) return;
    cancelFinish(); cancelFlight(); closeSheetsForRoute(); controls.stopMotion?.();
    const secs = Math.min(50, Math.max(22, path.total / 90)), dist = current.id === 'tiantai-classic' ? 430 : 250;
    preview ??= {s: 0, speed: path.total / secs, pause: 1.2, stop: 0, heading: null, dist, camDist: dist};
    preview.paused = false;
    setFocus(preview.stop); updateHud();
  }
  function stopPreview() { cancelFinish(); if (!preview || preview.paused) return; preview.paused = true; updateHud(); }
  function advance(sec) {
    if (preview.pause > 0) { preview.pause -= sec; if (preview.pause <= 0) preview.switching = false; }
    else {
      const from = preview.s, next = preview.stop + 1, stopS = next < path.stopAt.length ? path.stopAt[next] : Infinity;
      let to = Math.min(path.total, from + preview.speed * sec);
      const sw = path.switches.find(w => w > from && w <= to && w < stopS);
      if (sw !== undefined) { to = sw; preview.pause = .8; preview.switching = true; }
      else if (to >= stopS) { to = stopS; preview.stop = next; preview.pause = 1.1; }
      preview.s = to;
      if (preview.stop === next) setFocus(next);
    }
    const mode = modeAt(path, preview.s), pace = PACE[mode];
    // the camera draws back for a ride (from the station where it is boarded) and comes back in once it is over
    preview.camDist += (preview.dist * ZOOM[travelMode()] - preview.camDist) * Math.min(1, sec * .7);
    const zoom = preview.camDist / preview.dist;
    const here = at(path, preview.s), ahead = at(path, preview.s + Math.min(160 * (preview.speed / 90), 400 * zoom / pace));
    let h = Math.atan2(ahead.x - here.x, -(ahead.z - here.z));
    if (preview.heading === null) preview.heading = h;
    let dh = h - preview.heading; dh = Math.atan2(Math.sin(dh), Math.cos(dh));
    preview.heading += dh * Math.min(1, sec * 1.6 / zoom);  // turns more slowly when drawn back, so bends do not swing the view
    const y = here.y * world.scale.y, pol = 57 * Math.PI / 180, d = preview.camDist;
    const target = new THREE.Vector3(here.x, y, here.z);
    const cam = target.clone().add(new THREE.Vector3(-Math.sin(preview.heading) * d * Math.sin(pol), d * Math.cos(pol), Math.cos(preview.heading) * d * Math.sin(pol)));
    // faster rides are followed more tightly, so the traveller keeps about the same place on screen on any of them
    const k = Math.min(1, sec * 3.2 * pace / zoom);
    controls.target.lerp(target, k); camera.position.lerp(cam, k);
    const moving = preview.pause <= 0 && preview.stop + 1 < path.stopAt.length;
    if (moving !== preview.moving) { preview.moving = moving; if (moving) preview.swapped = false; updateHud(); }
    setProgress(preview.s / path.total);
    if (preview.s >= path.total && preview.pause <= 0) {
      preview = null; setFocus(-1); updateHud(true);
      // back to the route's page: the itinerary opens again and the camera shows the whole route
      finishTimer = setTimeout(() => { finishTimer = null; openPanel('routes'); detail.scrollTop = 0; overview(); }, 400);
    }
  }
  // What the traveller is: from a stop to the end of the leg that arrived there, it already shows how the next leg goes
  // (boarding at a station, getting off at the end of a ride); elsewhere, the mode of the stretch it is on.
  function travelMode() {
    const k = preview.stop, leg = current.legs[k];
    if (leg && k > 0 && preview.s <= path.legEnd[k - 1]) return leg.parts[0].mode;
    return modeAt(path, preview.s);
  }
  const tv = new THREE.Vector3();
  function placeTraveller(now, sec) {
    const mode = travelMode();
    if (mode !== preview.mode) { preview.fromMode = preview.mode; preview.mode = mode; preview.swapped = !!preview.fromMode; traveller.show(mode, now); updateHud(); }
    // on foot and on wheels it stands on the ground; the ropeway cabin hangs from the cable (at a station, where the cable starts)
    const here = at(path, preview.s), ground = hAt(here.x, here.z);
    tv.set(here.x, (mode === 'cable' ? Math.max(here.y, ground + 20) : ground + 2.6) * world.scale.y, here.z);
    const d = 10 / PACE[mode], a = at(path, Math.max(0, preview.s - d)), b = at(path, Math.min(path.total, preview.s + d)), flat = Math.hypot(b.x - a.x, b.z - a.z);
    const yaw = flat > 1 ? Math.atan2(b.x - a.x, -(b.z - a.z)) : null, pitch = flat > 1 ? Math.atan2((b.y - a.y) * world.scale.y, flat) : 0;
    const pxPerMetre = innerHeight / (2 * Math.max(1, camera.position.distanceTo(tv)) * Math.tan(43 * Math.PI / 360));
    traveller.update(tv, yaw, pitch, !preview.paused && preview.pause <= 0, now, sec, pxPerMetre);
  }
  onFrame((now, dt) => {
    if (!preview || !path) { if (traveller.visible) traveller.hide(); return; }
    const sec = Math.min(dt, 64) / 1000;
    if (!preview.paused) advance(sec);
    if (preview) placeTraveller(now, sec);  // advance() may have finished it
  });
  controls.addEventListener('gesturestart', stopPreview);

  // ---- panel: list and itinerary
  function card(route) {
    const b = el('button', 'route-card' + (route.featured ? ' featured' : '')); b.type = 'button';
    b.append(el('span', 'rc-by', route.by), el('strong', '', route.name),
      el('span', 'rc-meta', `${route.duration} · 步行 ${km(route.walkM)} · 爬升 ${route.climb} 米`));
    if (route.fit) b.append(el('span', 'rc-fit', '适合：' + route.fit));  // who it suits, so a visitor can pick between routes
    b.append(el('span', 'rc-path', route.stops.map(s => s.n).filter((n, i, a) => a.indexOf(n) === i).join(' → ')));
    b.onclick = () => open(route.id);
    return b;
  }
  function renderList() { list.replaceChildren(...routes.map(card)); }

  function profile(route) {
    // elevation along the walked and ridden parts (bus rides left out: flat and long), stops marked
    const xs = [], ys = [], marks = []; let s = 0;
    route.legs.forEach((leg, li) => {
      marks.push({s, i: li});
      leg.parts.forEach(part => {
        if (part.mode === 'bus') return;
        const pts = sample(part);
        pts.forEach((p, k) => { if (k || !xs.length) { if (xs.length) s += Math.hypot(p.x - pts[Math.max(0, k - 1)].x, p.z - pts[Math.max(0, k - 1)].z); xs.push(s); ys.push(realH(p.y - 2.6)); } });
      });
    });
    marks.push({s, i: route.stops.length - 1});
    const W = 300, H = 64, lo = Math.min(...ys), hi = Math.max(...ys), span = Math.max(40, hi - lo);
    const X = v => v / Math.max(1, s) * W, Y = v => H - 6 - (v - lo) / span * (H - 16);
    const line = xs.map((x, i) => `${i ? 'L' : 'M'}${X(x).toFixed(1)} ${Y(ys[i]).toFixed(1)}`).join('');
    const svg = `<svg viewBox="0 0 ${W} ${H}" preserveAspectRatio="none" aria-hidden="true"><path class="pf-area" d="${line}L${W} ${H}L0 ${H}Z"/><path class="pf-line" d="${line}"/>${marks.map(m => {
      const i = xs.findIndex(x => x >= m.s); const y = Y(ys[Math.max(0, i === -1 ? ys.length - 1 : i)]);
      return `<circle cx="${X(m.s).toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`;
    }).join('')}</svg>`;
    const box = el('div', 'route-profile'); box.innerHTML = svg;
    box.append(el('span', 'pf-hi', `${Math.round(hi)} 米`), el('span', 'pf-lo', `${Math.round(lo)} 米`), el('span', 'pf-cap', '沿途海拔'));
    return box;
  }
  function legText(leg) {
    const parts = leg.parts.map(p => {
      if (p.mode === 'walk') {
        const own = leg.minutesBy !== '估算' && leg.parts.length === 1;
        return `步行${own ? '约 ' + leg.minutes : '约 ' + p.minutes} 分钟 · ${km(p.m)}${p.up >= 15 ? ` · 上坡 ${p.up} 米` : p.down >= 15 ? ` · 下坡 ${p.down} 米` : ''}`;
      }
      if (p.mode === 'bus') return `坐${p.line}约 ${p.minutes} 分钟 · ${km(p.m)}`;
      return `坐${p.line}约 ${p.minutes} 分钟`;
    });
    return parts.join('，再');
  }
  function legIcon(leg) { const m = leg.parts.find(p => p.mode !== 'walk')?.mode; return m === 'bus' ? BUS_SVG : m ? RIDE_SVG : WALK_SVG; }

  // The name, the key figures and the two map actions come first, so a short phone sheet shows 路线预演 without scrolling;
  // the description, height profile and itinerary follow.
  function renderDetail(route) {
    detail.replaceChildren();
    const top = el('div', 'route-top'), back = el('button', 'route-back', '全部路线'); back.type = 'button'; back.onclick = close;
    top.append(back, el('span', 'rc-by', route.by));
    const stats = el('div', 'route-stats');
    const walkTime = route.walkMinutes >= 60 ? `约 ${(route.walkMinutes / 60).toFixed(1)} 小时` : `约 ${route.walkMinutes} 分钟`;
    for (const [v, k] of [[route.duration, '全程'], [km(route.walkM), '步行'], [walkTime, '步行用时'], [`${route.climb} 米`, '累计爬升']]) {
      const s = el('span'); s.append(el('b', '', v), el('small', '', k)); stats.append(s);
    }
    const acts = el('div', 'route-actions');
    const play = el('button', 'btn primary route-play'); play.type = 'button'; play.innerHTML = PLAY_SVG; play.append('路线预演');
    play.onclick = () => preview && !preview.paused ? stopPreview() : startPreview();
    const fit = el('button', 'btn ghost'); fit.type = 'button'; fit.innerHTML = FIT_SVG; fit.append('看全程'); fit.onclick = overview;
    acts.append(play, fit);
    const steps = el('ol', 'route-steps');
    route.stops.forEach((s, i) => {
      const li = el('li', 'rs-stop'); li.dataset.i = i;
      const b = el('button'); b.type = 'button'; b.onclick = () => focusStop(i);
      b.append(el('span', 'rs-num', String(i + 1)), el('strong', '', s.n)); if (s.note) b.append(el('small', '', s.note));
      li.append(b); steps.append(li);
      const leg = route.legs[i];
      if (leg) {
        const lg = el('li', 'rs-leg'); const icon = el('span', 'rs-icon'); icon.innerHTML = legIcon(leg);
        const t = el('span', 'rs-leg-text', legText(leg)); if (leg.note) t.append(el('em', '', leg.note));
        lg.append(icon, t); steps.append(lg);
      }
    });
    const tips = el('ul', 'route-tips'); for (const t of route.tips) tips.append(el('li', '', t));
    const more = el('details', 'more'); more.append(el('summary', '', '资料与依据'));
    more.append(el('p', '', '线路沿地图上的步道、台阶和街道绘制；地图上没有画出的台阶、穿过广场和北门门楼的一段以及进出寺院的最后一小段按直线示意。步行时间按距离和坡度估算（台阶按慢三成计），每个人快慢不同；标“业主提供”的为居之林业主给出的时间。缆车、索道和景交车的乘坐时间按线路长度估算，不含排队。开放和运行时间以现场公示为准。'));
    const links = el('div', 'links');
    for (const s of route.sources) { if (s.url) { const a = el('a', '', s.name); a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; links.append(a); } else links.append(el('span', '', s.name)); }
    more.append(links);
    detail.append(top, el('h3', 'route-title', route.name), stats, acts, el('p', 'route-summary', route.summary), profile(route), steps,
      el('h4', '', '出发前看看'), tips, more);
    detail.scrollTop = 0;
  }

  function open(id) {
    const route = routes.find(r => r.id === id); if (!route) return;
    stopPreview(); preview = null; current = route; focusIndex = -1;
    openPanel('routes');
    list.hidden = true; detail.hidden = false; renderDetail(route); draw(route); renderStrip(route); stripKey = '';
    updateHud();  // the route bar first, so the framing leaves room below it
    const to = fitPose(route); fly(to, 1600);
    detail.focus?.({preventScroll: true});  // the chosen card has gone from the list: focus goes to the route's page
  }
  function close() {
    const was = current, had = detail.contains(document.activeElement);
    stopPreview(); cancelFlight(); preview = null; current = null; clearDrawing(); strip.replaceChildren();
    detail.hidden = true; list.hidden = false; updateHud();
    if (had && was) list.children[routes.indexOf(was)]?.focus?.({preventScroll: true});  // 全部路线: back to that route's card
  }

  // ---- route bar at the top of the map while the route is shown: name, where the preview is (or which stop is picked),
  // a progress line, and the whole itinerary as a strip of stops with the way between them. During a preview the strip
  // follows along: stops passed are dimmed, the current one is filled, the next one is tagged 下一站, the leg being
  // travelled glows, and the strip scrolls to keep them in view. Tapping a stop flies there, as on the map.
  function legShort(leg) {
    const ride = leg.parts.find(p => p.mode !== 'walk');
    return `${ride ? MODES[ride.mode].name : '步行'} ${leg.minutes} 分钟`;
  }
  function renderStrip(route) {
    strip.replaceChildren();
    route.stops.forEach((s, i) => {
      const li = el('li', 'rh-stop' + (i === 0 ? ' start' : i === route.stops.length - 1 ? ' end' : '')); li.dataset.i = i;
      const b = el('button'); b.type = 'button'; b.onclick = () => focusStop(i);
      b.append(el('span', 'rs-num', String(i + 1)), el('span', 'rh-name', s.n)); li.append(b); strip.append(li);
      const leg = route.legs[i];
      if (leg) {
        const lg = el('li', 'rh-leg'); lg.dataset.i = i;
        const icon = el('span', 'rs-icon'); icon.innerHTML = legIcon(leg); lg.append(icon, el('span', '', legShort(leg))); strip.append(lg);
      }
    });
  }
  let stripKey = '';
  function setProgress(f) { bar.style.transform = `scaleX(${Math.max(0, Math.min(1, f)).toFixed(4)})`; }
  function updateHud(finished) {
    ctx.onPlaybackChange?.();
    const playing = !!preview && !preview.paused, playLabel = playing ? '暂停预演' : preview ? '继续预演' : '路线预演';
    const play = detail.querySelector('.route-play');
    if (play) { play.innerHTML = playing ? STOP_SVG : PLAY_SVG; play.append(playLabel); }
    if (!current) { hud.hidden = true; return; }
    const n = current.stops.length, cur = preview ? preview.stop : focusIndex, moving = !!preview?.moving;
    const s = current.stops[Math.max(0, cur)], next = current.stops[cur + 1];
    hud.querySelector('b').textContent = current.short;
    // what is happening, in two parts: a place that may be cut short on a narrow screen, and a note (paused, or a change
    // between walking and a ride) that is always shown whole
    const say = (where, note, noteFirst) => {
      const w = el('span', 'rh-where', where), parts = note ? (noteFirst ? [el('span', 'rh-note', note), w] : [w, el('span', 'rh-note', note)]) : [w];
      if (preview?.paused) parts.unshift(el('span', 'rh-note', '已暂停 ·\u00a0'));
      hud.querySelector('small').replaceChildren(...parts);
    };
    if (!preview) say(cur >= 0 ? `${cur + 1}/${n} · ${s.n}` : finished ? '预演完毕 · 可再看一次' : `${n} 站 · ${current.duration} · 点 ▶ 开始预演`);
    else if (moving && next) say(`${VERB[preview.mode] ?? '正在'}前往 ${next.n}`);
    else if (preview.switching && next) say(`\u00a0· 前往 ${next.n}`, change(preview.fromMode, preview.mode), true);  // no-break spaces: a flex item drops edge spaces
    else say(cur === 0 ? `从 ${s.n} 出发` : `${cur + 1}/${n} 到达 ${s.n}`, preview.swapped ? `\u00a0· ${change(preview.fromMode, preview.mode)}` : '');
    const pb = hud.querySelector('.rh-play'); pb.innerHTML = playing ? STOP_SVG : PLAY_SVG; pb.setAttribute('aria-label', playLabel);
    hud.hidden = false; hud.classList.toggle('playing', playing); hud.classList.toggle('live', !!preview);
    for (const li of strip.children) {
      const i = +li.dataset.i, stop = li.classList.contains('rh-stop');
      li.classList.toggle('done', !!finished || i < cur);
      if (stop) { li.classList.toggle('current', i === cur); li.classList.toggle('next', !!preview && i === cur + 1); }
      else li.classList.toggle('moving', moving && i === cur);
    }
    setProgress(preview ? preview.s / path.total : finished ? 1 : cur >= 0 && path ? path.stopAt[cur] / path.total : 0);
    // scroll so the current stop (the filled one, the most important) starts just inside the strip's padding, clear of its
    // edge fade; the next stop may then be cut at the right edge, where the fade already says the strip goes on
    const key = `${current.id}:${cur}:${!!preview}`;
    if (key !== stripKey && hud.offsetParent) {  // not while a sheet or card hides the bar
      stripKey = key;
      const here = strip.querySelector(`.rh-stop[data-i="${Math.max(0, cur)}"]`);
      if (here) {
        const pad = parseFloat(globalThis.getComputedStyle?.(strip).paddingLeft ?? 12);
        strip.scrollTo?.({left: Math.max(0, here.offsetLeft - pad), behavior: globalThis.matchMedia?.('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'});
      }
    }
  }
  hud.querySelector('.rh-play').onclick = () => preview && !preview.paused ? stopPreview() : startPreview();
  hud.querySelector('.rh-list').onclick = () => { stopPreview(); openPanel('routes'); };
  hud.querySelector('.rh-close').onclick = close;
  addEventListener('keydown', e => { if (e.key === 'Escape' && preview) stopPreview(); });

  renderList();
  return {open, close, stopPreview, startPreview, updateLabels: placeNames, get labelObjects() { return marks.map(m => m.label); }, get active() { return current; }, get previewing() { return !!preview && !preview.paused; }, get canResume() { return !!preview?.paused; }};
}
