// 游览须知: the panel page built from G.guide (scripts/r3/guide.py) and the official transit hours in G.transit, plus the
// small label that says how a paragraph of a place's story should be read (史料 / 信仰 / 传说 / 建筑 / 提示).
const KIND = {史料: 'history', 信仰: 'belief', 传说: 'legend', 建筑: 'building', 提示: 'tip'};

function el(tag, cls, text) { const n = document.createElement(tag); if (cls) n.className = cls; if (text !== undefined) n.textContent = text; return n; }
export function kindLabel(kind) { return el('span', 'kind k-' + (KIND[kind] || 'tip'), kind); }
// 11-digit mobiles read as 3-4-4; landlines keep their written form
const shownNumber = n => /^1\d{10}$/.test(n) ? `${n.slice(0, 3)} ${n.slice(3, 7)} ${n.slice(7)}` : n;

function sourceLine(sources) {
  const box = el('p', 'guide-src'); box.append(el('span', '', '来源：'));
  sources.forEach((s, i) => { const a = el('a', '', s.name); a.href = s.url; a.target = '_blank'; a.rel = 'noopener'; box.append(a); if (i < sources.length - 1) box.append('；'); });
  return box;
}
function rows(pairs) { const dl = el('dl', 'guide-rows'); for (const [k, v] of pairs) dl.append(el('dt', '', k), el('dd', '', v)); return dl; }

export function setupGuide(G, root) {
  const guide = G.guide;
  if (!guide) { root.replaceChildren(el('p', 'empty', '游览须知暂时没有加载，刷新页面再试。')); return; }
  root.replaceChildren(el('p', 'guide-intro', `出发前看看 · 官方资料 ${guide.verified} 核验`));
  for (const s of guide.sections) {
    const sec = el('details', 'guide-sec'), sum = el('summary'), body = el('div', 'guide-body');
    sec.dataset.id = s.id; sum.append(el('b', '', s.title), el('small', '', s.teaser)); sec.append(sum, body);
    for (const [k, t] of s.paras || []) { const p = el('p', 'story'); p.append(kindLabel(k), t); body.append(p); }
    if (s.rows?.length) body.append(rows(s.rows));
    if (s.transitHours && G.transit) {
      body.append(el('h4', '', '运营时间'), rows([...G.transit.routes.map(r => [r.name, r.hours]),
        ...G.transit.cableways.map(c => [c.name, c.hours + (c.phone ? ` · 咨询 ${c.phone}` : '')])]));
    }
    if (s.items?.length) { const ul = el('ul', 'guide-list'); for (const t of s.items) ul.append(el('li', '', t)); body.append(ul); }
    if (s.phones?.length) {
      const ul = el('ul', 'guide-phones');
      for (const [name, numbers, when] of s.phones) {
        const li = el('li'), nums = el('span', 'nums');
        for (const n of numbers) { const a = el('a', '', shownNumber(n)); a.href = 'tel:' + n.replace(/\D/g, ''); nums.append(a); }
        li.append(el('span', 'who', name), nums); if (when) li.append(el('small', '', when)); ul.append(li);
      }
      body.append(ul);
    }
    if (s.note) body.append(el('p', 'guide-note', s.note));
    if (s.sources?.length) body.append(sourceLine(s.sources));
    root.append(sec);
  }
}
