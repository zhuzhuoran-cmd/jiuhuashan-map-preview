// Local search only: names/known aliases rank first; semantic terms use actual place types.
export const normalizeSearch = value => String(value ?? '').normalize('NFKC').toLowerCase()
  .replace(/[\s()（）·.,，。\-_/]+/g, '');
const GROUPS = [
  ['toilet', ['公共厕所','公厕','厕所','卫生间','洗手间','wc'], p => p.k === '公共厕所'],
  ['cable', ['索道','缆车'], p => (p.category === 'transport' && /索道|缆车/.test(p.n)) || p.k === 'cable-car'],
  ['bus', ['景交车站','公交车站','公交站','客运站','巴士站','乘车处','车站'], p => p.category === 'transport' && /bus/.test(p.k)],
  ['visitor', ['游客服务分中心','游客服务中心','游客中心','游客服务站'], p => p.k === '游客服务中心'],
  ['ticket', ['售票处','售票点','售票亭','票务'], p => /售票/.test([p.n,...(p.aliases || [])].join(' '))],
  ['parking', ['停车场','停车处','停车位','停车'], p => p.category === 'service' && /停车场|car park/.test(p.k)],
  ['temple', ['寺庙','寺院'], p => p.category === 'temple'],
  ['hotel', ['住宿','酒店','旅馆','旅店'], p => p.category === 'hotel'],
  ['guesthouse', ['民宿','客栈'], p => p.category === 'hotel' && /民宿|客栈/.test(p.n + (p.k || ''))],
  ['food', ['餐饮','餐厅','餐馆','饭店','饭馆','吃饭'], p => p.category === 'food'],
  ['shop', ['购物','商店','商铺','店铺'], p => p.category === 'shop'],
  ['market', ['超市','便利店','小卖部'], p => p.category === 'shop' && /超市|便利|小卖部/.test(p.n + (p.k || ''))],
  ['sight', ['景点','景观'], p => ['sight','nature'].includes(p.category)],
  ['nature', ['自然景观','山水景观','山水'], p => p.category === 'nature'],
  ['village', ['村落','村庄','地名','社区'], p => p.category === 'village'],
  ['service', ['公共设施','公共服务'], p => ['service','transport'].includes(p.category)],
  ['transport', ['交通','交通设施'], p => p.category === 'transport'],
];
const TERMS = GROUPS.flatMap(([id, terms]) => terms.map(term => ({term:normalizeSearch(term), id})))
  .sort((a,b) => b.term.length - a.term.length);
function tokens(query) {
  // Split known semantic phrases even without spaces (“虎形山厕所”); never strip 寺/山/庵 from names.
  const result = [];
  for (const word of String(query ?? '').normalize('NFKC').toLowerCase().trim().split(/\s+/)) {
    let text = normalizeSearch(word), literal = '';
    while (text) {
      const match = TERMS.find(t => text.startsWith(t.term));
      if (match) {
        if (literal) result.push({text:literal});
        literal = ''; result.push({group:match.id}); text = text.slice(match.term.length);
      } else { literal += text[0]; text = text.slice(1); }
    }
    if (literal) result.push({text:literal});
  }
  return result;
}
export function createPlaceSearch(places) {
  const seen = new Set(), entries = [];
  for (const place of places) {
    if (!place.n || !Number.isFinite(place.x) || !Number.isFinite(place.z)) continue;
    const id = place.placeId || place.n;
    if (seen.has(id)) continue;
    seen.add(id);
    const names = [place.n,place.displayName].filter(Boolean).map(normalizeSearch);
    const aliases = [place.shortName,...(place.aliases || []),place.viewing?.name].filter(Boolean).map(normalizeSearch);
    const texts = [...names,...aliases,place.address,place.zone,place.k].filter(Boolean).map(normalizeSearch);
    const groups = new Set(GROUPS.filter(([, , accepts]) => accepts(place)).map(([id]) => id));
    entries.push({place,names,aliases,texts,groups});
  }
  let previous = null, scores = new Map();
  function rank(query) {
    const key = String(query ?? '');
    if (key === previous) return scores;
    previous = key; scores = new Map();
    if (key.length > 200) return scores; // same bound as the search field; no work on oversized input
    const full = normalizeSearch(query), parts = tokens(query);
    for (const e of entries) {
      let score = -1;
      if (!String(query ?? '').trim()) score = 0;
      else if (!full) score = -1;
      else if (e.names.includes(full)) score = 1000;
      else if (e.aliases.includes(full)) score = 900;
      else if (parts.length && parts.every(t => t.group ? e.groups.has(t.group) : e.texts.some(s => s.includes(t.text)))) {
        // A literal fragment in a name/alias ranks above address/type-only matches.
        const literal = parts.filter(t => t.text);
        score = e.names.some(s => s.startsWith(full)) ? 800 : e.names.some(s => s.includes(full)) ? 700
          : e.aliases.some(s => s.includes(full)) ? 600 : literal.some(t => e.names.some(s => s.includes(t.text))) ? 500
          : literal.some(t => e.aliases.some(s => s.includes(t.text))) ? 400 : 200;
      }
      scores.set(e.place,score);
    }
    return scores;
  }
  return {
    score(place,query) {return rank(query).get(place) ?? -1;},
    search(query,{accept=()=>true}={}) {
      const scores=rank(query);
      return entries.filter(e => scores.get(e.place)>=0 && accept(e.place)).sort((a,b) => scores.get(b.place)-scores.get(a.place)
        || (b.place.featured?1:0)-(a.place.featured?1:0) || (a.place.p ?? 99)-(b.place.p ?? 99) || a.place.n.localeCompare(b.place.n,'zh-CN')).map(e=>e.place);
    },
  };
}
// Debounce committed text only. Composition events leave the previous results in place until conversion finishes.
export function bindPlaceSearch(input,onChange,{delay=90}={}) {
  let composing=false,timer;
  const cancel=()=>{clearTimeout(timer);timer=undefined;};
  const commit=()=>{cancel();if(!composing)onChange(input.value.trim());};
  const schedule=event=>{cancel();if(composing || event?.isComposing)return;timer=setTimeout(commit,delay);};
  const start=()=>{composing=true;cancel();};
  const end=()=>{composing=false;schedule();};
  input.addEventListener('input',schedule);input.addEventListener('compositionstart',start);input.addEventListener('compositionend',end);
  return {flush:commit,destroy(){cancel();input.removeEventListener('input',schedule);input.removeEventListener('compositionstart',start);input.removeEventListener('compositionend',end);}};
}
