// Recommended routes: the list and itinerary in the panel, the route drawn on the terrain with numbered stops, and a
// camera preview that travels it. Route data (stops, legs, measured metres and minutes) is built by scripts/r3/routes.py.
import * as THREE from 'three';
import {CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import {Line2} from 'three/addons/lines/Line2.js';
import {LineMaterial} from 'three/addons/lines/LineMaterial.js';
import {LineGeometry} from 'three/addons/lines/LineGeometry.js';

const MODES = {walk: {name: '步行', color: '#e2862b'}, funicular: {name: '缆车', color: '#7a4fc9'},
  cable: {name: '索道', color: '#7a4fc9'}, bus: {name: '景交车', color: '#2e6fd0'}};
// Preview pace relative to walking: rides are fast-forwarded so a whole route plays in about half a minute.
const PACE = {walk: 1, funicular: 1.3, cable: 1.6, bus: 5};
const WALK_SVG = '<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-7.5L14 16v5M8 12l2-4.5 3-.5 2.5 3.5L18 11M10.5 7.8 9 13"/></svg>';
const RIDE_SVG = '<svg viewBox="0 0 24 24"><path d="M3 5.5 21 3M12 4.3V8M6.5 8h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16.5v-7A1.5 1.5 0 0 1 6.5 8zM5 12.5h14"/></svg>';
const BUS_SVG = '<svg viewBox="0 0 24 24"><rect x="4.5" y="3.5" width="15" height="15" rx="2.5"/><path d="M4.5 11h15M8 18.5V21M16 18.5V21"/><circle cx="8.5" cy="15" r=".9"/><circle cx="15.5" cy="15" r=".9"/></svg>';
const PLAY_SVG = '<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>';
const STOP_SVG = '<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>';
const FIT_SVG = '<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>';

const km = m => m >= 1000 ? `${(m / 1000).toFixed(1)} 公里` : `${Math.round(m / 10) * 10} 米`;
function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }

export function setupRoutes(ctx) {
  const {routes, world, camera, controls, hAt, fly, pose, cancelFlight, openPanel, closeSheetsForRoute, onFrame, isMobile, visibleRect} = ctx;
  const list = document.querySelector('#route-list'), detail = document.querySelector('#route-detail');
  const hud = document.querySelector('#route-hud');
  const group = new THREE.Group(); group.renderOrder = 5; world.add(group);
  const materials = [];
  let current = null, labels = [], path = null, preview = null, focusIndex = -1;

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
    // a place visited twice (out and back) gets one label carrying both numbers, e.g. “2·12”
    const byPlace = new Map();
    route.stops.forEach((s, i) => { if (!byPlace.has(s.place)) byPlace.set(s.place, {s, idx: []}); byPlace.get(s.place).idx.push(i); });
    for (const {s, idx} of byPlace.values()) {
      const last = route.stops.length - 1;
      const box = el('div', 'maplabel route-stop' + (idx.includes(0) ? ' start' : idx.includes(last) ? ' end' : ''));
      const b = el('button'); b.type = 'button';
      b.append(el('span', 'rs-num' + (idx.length > 1 ? ' multi' : ''), idx.map(i => i + 1).join('·')), s.n); b.onclick = () => focusStop(idx[0]);
      box.append(b, el('i'));
      const label = new CSS2DObject(box); label.center.set(.5, 1); label.position.set(s.x, hAt(s.x, s.z) + 9, s.z);
      group.add(label); for (const i of idx) labels[i] = box;
    }
    path = buildPath(route, pts3);
    document.body.classList.add('route-on');
  }
  function clearDrawing() {
    for (const o of [...group.children]) { group.remove(o); if (o.isLine2) { o.geometry.dispose(); o.material.dispose(); } if (o.isCSS2DObject) o.element.remove(); }
    materials.length = 0; labels = []; path = null; document.body.classList.remove('route-on');
  }

  // ---- the travelled path: cumulative distance, pace per point, and where each stop falls
  function buildPath(route, pts3) {
    const pts = [], cum = [0], weight = [];
    let s = 0;
    pts3.forEach((q, i) => {
      if (i) { const d = q.p.distanceTo(pts3[i - 1].p); s += d * PACE[q.mode]; }
      pts.push(q.p); cum.push(s); weight.push(q.mode);
    });
    cum.shift();
    const stopAt = route.stops.map((st, i) => {
      if (i === 0) return 0;
      let best = 0, bd = Infinity; const legEnd = pts3.findLastIndex(q => q.leg === i - 1);
      for (let k = Math.max(0, legEnd - 40); k <= legEnd; k++) { const d = Math.hypot(pts[k].x - st.x, pts[k].z - st.z); if (d < bd) { bd = d; best = k; } }
      return cum[best];
    });
    return {pts, cum, total: s, stopAt};
  }
  function at(path, s) {
    const {pts, cum} = path; let lo = 0, hi = cum.length - 1;
    if (s <= 0) return pts[0].clone(); if (s >= cum[hi]) return pts[hi].clone();
    while (hi - lo > 1) { const mid = (lo + hi) >> 1; if (cum[mid] <= s) lo = mid; else hi = mid; }
    const t = (s - cum[lo]) / Math.max(1e-6, cum[hi] - cum[lo]); return pts[lo].clone().lerp(pts[hi], t);
  }

  // ---- camera
  // Frame the whole route in the part of the screen left uncovered (between the top bar and a phone's sheet, or beside the
  // desktop panel): turn so the route's long axis runs across the screen, then refine centre and distance by projecting it.
  function fitPose(route) {
    const pts = [];
    route.legs.forEach(l => l.parts.forEach(p => p.pts.forEach(([x, z], i) => { if (i % 3 === 0 || i === p.pts.length - 1) pts.push([x, z, 8, 0]); })));
    // stop labels stand about 30 m above their point and are centred on it: keep half their width (≈12 px a character) clear
    const seen = new Map(); route.stops.forEach((s, i) => seen.set(s.place, (seen.get(s.place) || '') + (seen.has(s.place) ? '·' : '') + (i + 1)));
    route.stops.forEach(s => pts.push([s.x, s.z, 34, ([...s.n].length * 12.5 + seen.get(s.place).length * 7 + 34) / 2]));
    const n = pts.length, mx = pts.reduce((a, p) => a + p[0], 0) / n, mz = pts.reduce((a, p) => a + p[1], 0) / n;
    let sxx = 0, szz = 0, sxz = 0; for (const [x, z] of pts) { sxx += (x - mx) ** 2; szz += (z - mz) ** 2; sxz += (x - mx) * (z - mz); }
    let az = Math.atan2(2 * sxz, sxx - szz) / 2 * 180 / Math.PI;  // long axis → screen horizontal
    while (az - 25 > 90) az -= 180; while (25 - az > 90) az += 180;  // of the two ways round, keep closest to the usual view
    // labels are up to ~120 px wide, so keep more room at the sides than at the top and bottom
    const pol = 52, R = visibleRect(), W = innerWidth, H = innerHeight, mx0 = 12, my0 = 34;
    const vis = {w: R.right - R.left, h: R.bottom - R.top}, aimX = (R.left + R.right) / 2 + R.shiftX, aimY = (R.top + R.bottom) / 2 + R.shiftY;
    const cam = new THREE.PerspectiveCamera(43, W / H, 1, 60000), v = new THREE.Vector3(), right = new THREE.Vector3(), fwd = new THREE.Vector3();
    let cx = mx, cz = mz, dist = 1600;
    for (let k = 0; k < 30; k++) {
      const P = pose(cx, cz, dist, az, pol); cam.position.copy(P.pos); cam.lookAt(P.target); cam.updateMatrixWorld();
      let x0 = Infinity, x1 = -Infinity, y0 = Infinity, y1 = -Infinity;
      for (const [x, z, up, hw] of pts) {
        v.set(x, (hAt(x, z) + up) * world.scale.y, z).project(cam);
        const px = (v.x + 1) / 2 * W, py = (1 - v.y) / 2 * H; x0 = Math.min(x0, px - hw); x1 = Math.max(x1, px + hw); y0 = Math.min(y0, py); y1 = Math.max(y1, py);
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

  // ---- preview: the target walks the path; the camera trails behind, facing the direction of travel
  function startPreview() {
    if (!current || !path) return;
    cancelFlight(); closeSheetsForRoute();
    const secs = Math.min(42, Math.max(22, path.total / 90));
    preview = {s: 0, speed: path.total / secs, pause: 1.2, stop: 0, heading: null, dist: current.id === 'tiantai-classic' ? 430 : 250};
    setFocus(0); updateHud();
  }
  function stopPreview() { if (!preview) return; preview = null; updateHud(); }
  onFrame((now, dt) => {
    if (!preview || !path) return;
    const sec = Math.min(dt, 64) / 1000;
    if (preview.pause > 0) preview.pause -= sec;
    else {
      preview.s = Math.min(path.total, preview.s + preview.speed * sec);
      const next = preview.stop + 1;
      if (next < path.stopAt.length && preview.s >= path.stopAt[next]) { preview.s = path.stopAt[next]; preview.stop = next; preview.pause = 1.1; setFocus(next); }
    }
    const here = at(path, preview.s), ahead = at(path, preview.s + 160 * (preview.speed / 90));
    let h = Math.atan2(ahead.x - here.x, -(ahead.z - here.z));
    if (preview.heading === null) preview.heading = h;
    let dh = h - preview.heading; dh = Math.atan2(Math.sin(dh), Math.cos(dh));
    preview.heading += dh * Math.min(1, sec * 1.6);
    const y = here.y * world.scale.y, pol = 57 * Math.PI / 180, d = preview.dist;
    const target = new THREE.Vector3(here.x, y, here.z);
    const cam = target.clone().add(new THREE.Vector3(-Math.sin(preview.heading) * d * Math.sin(pol), d * Math.cos(pol), Math.cos(preview.heading) * d * Math.sin(pol)));
    const k = Math.min(1, sec * 3.2);
    controls.target.lerp(target, k); camera.position.lerp(cam, k);
    if (preview.s >= path.total && preview.pause <= 0) { preview = null; setFocus(-1); updateHud(true); setTimeout(overview, 400); }
  });
  controls.addEventListener('start', stopPreview);

  // ---- panel: list and itinerary
  function card(route) {
    const b = el('button', 'route-card' + (route.featured ? ' featured' : '')); b.type = 'button';
    b.append(el('span', 'rc-by', route.by), el('strong', '', route.name),
      el('span', 'rc-meta', `${route.duration} · 步行 ${km(route.walkM)} · 爬升 ${route.climb} 米`),
      el('span', 'rc-path', route.stops.map(s => s.n).filter((n, i, a) => a.indexOf(n) === i).join(' → ')));
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
        pts.forEach((p, k) => { if (k || !xs.length) { if (xs.length) s += Math.hypot(p.x - pts[Math.max(0, k - 1)].x, p.z - pts[Math.max(0, k - 1)].z); xs.push(s); ys.push(p.y - 2.6); } });
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

  function renderDetail(route) {
    detail.replaceChildren();
    const back = el('button', 'route-back', '全部路线'); back.type = 'button'; back.onclick = close;
    const head = el('div', 'route-head');
    head.append(el('span', 'rc-by', route.by), el('h3', '', route.name), el('p', 'route-summary', route.summary));
    const stats = el('div', 'route-stats');
    const walkTime = route.walkMinutes >= 60 ? `约 ${(route.walkMinutes / 60).toFixed(1)} 小时` : `约 ${route.walkMinutes} 分钟`;
    for (const [v, k] of [[route.duration, '全程'], [km(route.walkM), '步行'], [walkTime, '步行用时'], [`${route.climb} 米`, '累计爬升']]) {
      const s = el('span'); s.append(el('b', '', v), el('small', '', k)); stats.append(s);
    }
    const acts = el('div', 'route-actions');
    const play = el('button', 'btn primary route-play'); play.type = 'button'; play.innerHTML = PLAY_SVG; play.append('路线预演');
    play.onclick = () => preview ? stopPreview() : startPreview();
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
    more.append(el('p', '', '线路沿地图上的步道、台阶和街道绘制，进出寺院的最后一小段按直线示意。步行时间按距离和坡度估算（台阶按慢三成计），每个人快慢不同；标“业主提供”的为居之林业主给出的时间。缆车、索道和景交车的乘坐时间按线路长度估算，不含排队。开放和运行时间以现场公示为准。'));
    const links = el('div', 'links');
    for (const s of route.sources) { if (s.url) { const a = el('a', '', s.name); a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; links.append(a); } else links.append(el('span', '', s.name)); }
    more.append(links);
    detail.append(back, head, stats, acts, profile(route), steps, el('h4', '', '出发前看看'), tips, more);
    detail.scrollTop = 0;
  }

  function open(id) {
    const route = routes.find(r => r.id === id); if (!route) return;
    stopPreview(); current = route; focusIndex = -1;
    openPanel('routes');
    list.hidden = true; detail.hidden = false; renderDetail(route); draw(route);
    const to = fitPose(route); fly(to, 1600);
    updateHud();
  }
  function close() {
    stopPreview(); current = null; clearDrawing();
    detail.hidden = true; list.hidden = false; updateHud();
  }

  // ---- compact bar while the route is on the map and the panel is out of the way (or a preview is playing)
  function updateHud(finished) {
    const play = detail.querySelector('.route-play');
    if (play) { play.innerHTML = preview ? STOP_SVG : PLAY_SVG; play.append(preview ? '停止预演' : '路线预演'); }
    if (!current) { hud.hidden = true; return; }
    const s = current.stops[Math.max(0, focusIndex)];
    hud.querySelector('b').textContent = current.short;
    hud.querySelector('small').textContent = preview || focusIndex >= 0 ? `${Math.max(0, focusIndex) + 1} / ${current.stops.length} · ${s.n}` : finished ? '预演完毕 · 可再看一次' : `${current.stops.length} 站 · ${current.duration}`;
    const pb = hud.querySelector('.rh-play'); pb.innerHTML = preview ? STOP_SVG : PLAY_SVG; pb.setAttribute('aria-label', preview ? '停止预演' : '路线预演');
    hud.hidden = false; hud.classList.toggle('playing', !!preview);
  }
  hud.querySelector('.rh-play').onclick = () => preview ? stopPreview() : startPreview();
  hud.querySelector('.rh-list').onclick = () => { stopPreview(); openPanel('routes'); };
  hud.querySelector('.rh-close').onclick = close;
  addEventListener('keydown', e => { if (e.key === 'Escape' && preview) stopPreview(); });

  renderList();
  return {open, close, stopPreview, get active() { return current; }, get previewing() { return !!preview; }};
}
