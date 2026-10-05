// Pure data helpers shared by startup and regression checks (including runtime-only POIs).
export function heightExtrema(values) {
  let min = Infinity, max = -Infinity;
  for (let i = 0; i < values.length; i++) {
    if (values[i] < min) min = values[i];
    if (values[i] > max) max = values[i];
  }
  return {min, max};
}
export const TOILET_MODELS = {
  '公厕（三角洲车站停车场旁）': 609946470,
  '公厕（东崖宾馆附近）': 609892484,
  '公厕（虎形山车站旁）': 609980796,
  '公共厕所(AH-CIZ-0666)': 609909660,
};
const FACILITY_IDS = {
  '公厕（东崖宾馆附近）': 'facility:toilet-dongya',
  '公厕（虎形山车站旁）': 'facility:toilet-huxingshan',
  '虎形山车站': 'transport:huxingshan-station',
};
export const placeId = name => FACILITY_IDS[name] || `place:${name}`;
export const ownerQualityText = '业主指认 · 位置按模型估计，未独立核实';
export function augmentPlaces(data) {
  if (!data.places.some(p => p.n === '公厕（虎形山车站旁）')) {
    const x = -1424, z = -17;
    data.places.push({
      n: '公厕（虎形山车站旁）', shortName: '公厕', category: 'service', k: '公共厕所',
      p: 3, zone: '九华街（镇区）', x, z, lon: 117.8115 + x / 95950, lat: 30.482 - z / 110900,
      address: '虎形山车站旁', quality: 'owner_reported', src: '业主指认（2026-10-01）',
      sources: [{name: '业主指认（2026-10-01），位置按模型估计，未独立核实', url: ''}],
      sourceFamilies: ['owner'], coordinateMethod: '模型平面坐标按项目投影换算为近似 WGS84',
      modelQuality: 'schematic', note: '设施由业主指认；位置及当前开放状态未独立核实。', searchable: true,
    });
  }
  // The existing ticket-office model selects the station; these aliases refer to that same place.
  const station = data.places.find(p => p.n === '虎形山车站');
  if (station) station.aliases = [...new Set([...(station.aliases || []),'虎形山车站售票处','虎形山售票处'])];
  for (const p of data.places) p.placeId = placeId(p.n);
  return data.places;
}
export function pickedPlace(object, byId, byName) {
  for (let o = object; o; o = o.parent) {
    if (o.userData?.placeId) return byId.get(o.userData.placeId);
    if (o.userData?.landmark && byName.has(o.userData.landmark)) return byName.get(o.userData.landmark);
  }
}
// Use the same place card for an individual hall and its label. A named hall
// (e.g. 五百罗汉堂) takes precedence over the surrounding temple precinct.
export function buildingPlace(building, byName) {
  if (building?.style !== 'temple') return undefined;
  for (const name of [building.name, building.precinct, building.templeGuess]) {
    const place = byName.get(name);
    if (place?.category === 'temple') return place;
  }
}
export function pickedBuilding(object, faceIndex, buildings, byId) {
  for (let o = object; o; o = o.parent) {
    if (o.userData?.buildingId) return byId.get(o.userData.buildingId);
    const index = o.userData?.triangleIds?.[faceIndex];
    if (index !== undefined) return buildings[index];
  }
}
