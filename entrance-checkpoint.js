import * as THREE from 'three';

// User's circled map and entrance photograph, 2026-09-28. Local +z faces the approach;
// dimensions and the unseen rear are estimates. The small level bench compensates for
// the 30 m DEM cells, without moving the public road or changing the stored terrain.
export function createCheckpointSite(place, rawHeight) {
  if (place?.model?.kind !== 'entrance-checkpoint') return null;
  const [ax, az] = place.model.front, length = Math.hypot(ax, az);
  const fx = ax / length, fz = az / length;
  const origin = [place.x, place.z], floor = rawHeight(...origin) + .55;
  const smooth = t => { t = Math.max(0, Math.min(1, t)); return t * t * (3 - 2 * t); };
  const local = (x, z) => { const dx = x - origin[0], dz = z - origin[1]; return [dx * fz - dz * fx, dx * fx + dz * fz]; };
  const world = (x, z) => [origin[0] + x * fz + z * fx, origin[1] - x * fx + z * fz];
  const outer = { x: 18, z: 14 };
  const height = (x, z, raw) => {
    if (Math.abs(x - origin[0]) > 32 || Math.abs(z - origin[1]) > 32) return raw;
    const [u, v] = local(x, z);
    const blend = (1 - smooth((Math.abs(u) - 10.3) / 7.7)) * (1 - smooth((Math.abs(v) - 6.2) / 7.8));
    if (!blend) return raw;
    // The five 18 cm entrance steps descend toward +z. Keep the ground below their treads.
    const bench = floor - .14 - Math.min(.9, Math.max(0, v - 2.7) * .45);
    return raw + (bench - raw) * blend;
  };
  return { origin, floor, fx, fz, local, world, outer, height, rotation: Math.atan2(fx, fz), viewAzimuth: Math.atan2(-fx, fz) * 180 / Math.PI };
}

// A 1 m grid replaces just the entrance's small rotated rectangle. Its edge follows
// the original triangle surface, so the surrounding hills have no gap or height change.
export function checkpointTerrain(site, rawMeshHeight, W, D, material) {
  const positions = [], uvs = [], indices = [], nx = site.outer.x * 2, nz = site.outer.z * 2;
  for (let j = 0; j <= nz; j++) for (let i = 0; i <= nx; i++) {
    const [x, z] = site.world(i - site.outer.x, j - site.outer.z);
    positions.push(x, site.height(x, z, rawMeshHeight(x, z)), z);
    uvs.push((x + W / 2) / W, 1 - (z + D / 2) / D);
  }
  for (let j = 0; j < nz; j++) for (let i = 0; i < nx; i++) {
    const a = j * (nx + 1) + i, b = a + 1, c = a + nx + 1, d = c + 1;
    indices.push(a, c, b, b, c, d);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  geometry.setAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2));
  geometry.setIndex(indices); geometry.computeVertexNormals();
  const mesh = new THREE.Mesh(geometry, material); mesh.receiveShadow = true;
  return mesh;
}

function signAtlas() {
  const canvas = document.createElement('canvas'); canvas.width = 1024; canvas.height = 512;
  const c = canvas.getContext('2d'); c.textAlign = 'center'; c.textBaseline = 'middle';
  c.fillStyle = '#ff322b'; c.font = '700 76px "PingFang SC",sans-serif';
  c.shadowColor = '#ef1d16'; c.shadowBlur = 3;
  c.fillText('九华山风景区欢迎您', 512, 48);
  c.shadowBlur = 0; c.fillStyle = '#d9cd8f'; c.font = '700 174px "Kaiti SC","STKaiti","Songti SC",serif';
  ['九', '華', '山'].forEach((text, i) => c.fillText(text, i * 224 + 112, 208));
  const texture = new THREE.CanvasTexture(canvas); texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 4;
  return new THREE.MeshBasicMaterial({ map: texture, transparent: true, alphaTest: .16, side: THREE.DoubleSide, toneMapped: false });
}

export function buildEntranceCheckpoint(site, material, { signs = true } = {}) {
  const group = new THREE.Group();
  group.position.set(site.origin[0], site.floor, site.origin[1]);
  group.rotation.y = site.rotation; group.userData.landmark = '景区检票口';
  const unit = new THREE.BoxGeometry(1, 1, 1);
  const wood = material('#40332d'), roof = material('#373c3a'), stone = material('#b9b2a4');
  const steel = material('#9caeae'), black = material('#192626'), cream = material('#e5dfcb');
  const glass = material('#658b90'), blue = material('#205b9c');
  const box = (x, y, z, w, h, d, mat) => {
    const mesh = new THREE.Mesh(unit, mat); mesh.position.set(x, y + h / 2, z); mesh.scale.set(w, h, d);
    mesh.castShadow = mesh.receiveShadow = true; group.add(mesh); return mesh;
  };
  // Simple silhouette only: five steps, raised middle roof, lower side wings and an open passage.
  box(0, -.3, -.65, 19.2, .3, 7.5, stone);
  for (let i = 0; i < 5; i++) box(0, -1.3, 3.3 + i * .4, 19.2, 1.3 - (i + 1) * .18, .4, stone);
  box(0, -1.16, 5.65, 19.2, .15, 1.1, stone);
  for (const x of [-9.1, -4.2, 4.2, 9.1]) {
    const h = Math.abs(x) < 5 ? 5.4 : 4.65;
    box(x, 0, 2.7, .7, .8, .7, stone);
    box(x, .8, 2.7, .46, h - .8, .46, wood);
    box(x, 0, -3.7, .38, 3.9, .38, wood);
  }
  box(0, 3.85, -.5, 18.8, .20, 6.6, roof);
  for (const [x, width, h] of [[0, 9.6, 5.4], [-6.9, 5.7, 4.65], [6.9, 5.7, 4.65]]) {
    box(x, h - .35, 2.7, width - .6, .35, .5, wood);
    box(x, h, 2.8, width, .28, 1.65, roof);
  }
  box(0, 3.65, 2.7, 18.4, .23, .32, wood);
  // Red welcome sign below the central roof and gold characters above it.
  box(0, 4.32, 3.025, 7.95, .93, .18, wood);
  box(0, 4.39, 3.125, 7.72, .78, .035, black);
  for (const x of [-2.85, 0, 2.85]) box(x, 5.68, 2.7, .065, 1.08, .065, black);
  // Four low silver posts suggest three ticket lanes. The booth is a plain cream cabin with blue-grey windows.
  for (const x of [-3.1, -1.1, .9, 2.9]) {
    box(x, 0, .35, .38, .98, 1.55, steel);
    box(x, .98, .35, .4, .10, 1.6, black);
  }
  for (const x of [-8.5, -5.6]) {
    for (const z of [-3.1, -.6, 1.9]) box(x, 0, z, .065, 1.05, .065, black);
    box(x, 1.0, -.6, .07, .085, 5.2, black);
  }
  box(6.6, 0, -.5, 3.7, 2.65, 4.7, cream);
  box(6.6, 1.02, 1.867, 3.38, 1.34, .04, glass);
  box(4.73, 1.02, -.5, .04, 1.34, 4.34, glass);
  box(6.6, 1.0, 1.904, .09, 1.4, .07, wood);
  box(6.6, 2.65, -.5, 4.0, .19, 4.95, roof);
  box(5.55, 0, 2.35, .82, 1.68, .60, blue);
  box(5.55, 1.0, 2.66, .65, .48, .035, cream);
  box(5.55, 1.08, 2.688, .44, .27, .018, black);
  if (signs) {
    const atlas = signAtlas();
    const sign = (x, y, z, w, h, sx, sy, sw, sh) => {
      const geometry = new THREE.PlaneGeometry(w, h), uv = geometry.attributes.uv;
      for (let i = 0; i < uv.count; i++) uv.setXY(i, (sx + uv.getX(i) * sw) / 1024, 1 - (sy + (1 - uv.getY(i)) * sh) / 512);
      const mesh = new THREE.Mesh(geometry, atlas); mesh.position.set(x, y, z); group.add(mesh);
    };
    sign(0, 4.80, 3.152, 7.35, .69, 0, 0, 1024, 96);
    [-2.85, 0, 2.85].forEach((x, i) => sign(x, 6.55, 2.74, 1.85, 1.85, i * 224, 112, 224, 208));
  }
  group.userData.checkpoint = { width: 19.2, depth: 10.65, height: 7.5, steps: 5, validators: 4, approximateDimensions: true };
  return group;
}
