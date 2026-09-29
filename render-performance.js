import * as THREE from 'three';

// Share vertex attributes with the existing batch. Only the tile indices and bounds
// are new: the original mesh remains the owner of its vertices and picking IDs.
// These geometries live for the scene's lifetime. Do not dispose a tile on a LOD
// switch: r160 does not reference-count GPU buffers shared between geometries.
export function createSpatialBatch(mesh, {cellSize = 400, enterDistance = 2100, exitDistance = 2500} = {}) {
  const source = mesh.geometry, position = source.attributes.position, index = source.index;
  if (Array.isArray(mesh.material) || source.groups.length || !position) return null;
  const count = index ? index.count : position.count, buckets = new Map();
  const point = new THREE.Vector3();
  for (let i = 0; i < count; i += 3) {
    const a = index ? index.getX(i) : i, b = index ? index.getX(i + 1) : i + 1, c = index ? index.getX(i + 2) : i + 2;
    const x = (position.getX(a) + position.getX(b) + position.getX(c)) / 3;
    const z = (position.getZ(a) + position.getZ(b) + position.getZ(c)) / 3;
    const key = Math.floor(x / cellSize) + ',' + Math.floor(z / cellSize);
    let tile = buckets.get(key);
    if (!tile) { tile = {indices: [], box: new THREE.Box3()}; buckets.set(key, tile); }
    tile.indices.push(a, b, c);
    for (const id of [a, b, c]) tile.box.expandByPoint(point.fromBufferAttribute(position, id));
  }
  const chunks = [];
  for (const {indices, box} of buckets.values()) {
    const geometry = new THREE.BufferGeometry();
    for (const [name, attribute] of Object.entries(source.attributes)) geometry.setAttribute(name, attribute);
    geometry.setIndex(indices);
    // computeBoundingSphere() would inspect ALL shared vertices, defeating culling.
    const center = box.getCenter(new THREE.Vector3()); let radiusSq = 0;
    for (const id of indices) radiusSq = Math.max(radiusSq, point.fromBufferAttribute(position, id).distanceToSquared(center));
    geometry.boundingBox = box;
    geometry.boundingSphere = new THREE.Sphere(center, Math.sqrt(radiusSq));
    const chunk = new THREE.Mesh(geometry, mesh.material);
    chunk.castShadow = mesh.castShadow; chunk.receiveShadow = mesh.receiveShadow;
    chunk.renderOrder = mesh.renderOrder; chunk.layers.mask = mesh.layers.mask;
    chunk.matrixAutoUpdate = false; chunk.visible = false;
    // Raycaster visits hidden children too. Pick through the original mesh only.
    chunk.raycast = () => {};
    mesh.add(chunk); chunks.push(chunk);
  }
  const fullRange = {...source.drawRange}, raycast = mesh.raycast;
  mesh.raycast = function (raycaster, hits) {
    if (!this.visible) return;
    const {start, count} = source.drawRange;
    source.setDrawRange(fullRange.start, fullRange.count);
    try { raycast.call(this, raycaster, hits); }
    finally { source.setDrawRange(start, count); }
  };
  let near = false;
  return {
    mesh, chunks,
    get near() { return near; },
    update(distance) {
      const next = near ? distance < exitDistance : distance < enterDistance;
      if (next === near) return false;
      near = next;
      source.setDrawRange(fullRange.start, near ? 0 : fullRange.count);
      for (const chunk of chunks) chunk.visible = near;
      return true;
    }
  };
}

export function frameSummary(samples) {
  const sorted = samples.filter(v => Number.isFinite(v) && v > 0).sort((a, b) => a - b);
  if (!sorted.length) return {mean: 0, p90: 0, slow: false, fast: false};
  const mean = sorted.reduce((sum, v) => sum + v, 0) / sorted.length;
  const p90 = sorted[Math.min(sorted.length - 1, Math.floor(sorted.length * .9))];
  return {mean, p90, slow: mean > 34 || p90 > 50, fast: mean < 19.5 && p90 < 24};
}

// Resolution is a separate budget from geometry/material quality. A sustained
// slow window first lowers DPR in small steps; only its floor permits tier-down.
export class AdaptiveResolution {
  constructor(ceiling) { this.setCeiling(ceiling, true); }
  setCeiling(ceiling, reset = false) {
    this.ceiling = ceiling; this.floor = Math.min(1, ceiling);
    this.limit = reset ? ceiling : Math.max(this.floor, Math.min(this.limit, ceiling));
    if (reset) { this.holdUntil = 0; this.recoverAfter = 0; }
  }
  pixelRatio(idle = false) { return idle ? this.ceiling : this.limit; }
  observe(samples, now) {
    const summary = frameSummary(samples);
    if (!summary.mean || now < this.holdUntil) return {...summary, action: 'hold'};
    let action = 'hold';
    if (summary.slow) {
      this.recoverAfter = now + 15000;
      if (this.limit > this.floor + .01) {
        this.limit = Math.max(this.floor, Math.round((this.limit - .25) * 100) / 100);
        this.holdUntil = now + 2500; action = 'resolution-down';
      } else action = 'tier-down';
    } else if (summary.fast && now >= this.recoverAfter && this.limit < this.ceiling - .01) {
      this.limit = Math.min(this.ceiling, Math.round((this.limit + .25) * 100) / 100);
      this.holdUntil = now + 4000; this.recoverAfter = now + 15000; action = 'resolution-up';
    }
    return {...summary, action};
  }
}
