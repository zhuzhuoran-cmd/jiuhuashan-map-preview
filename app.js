import * as THREE from 'three';
import {createMapControls} from './map-input.js?v=20260929-camera-handoff';
import {createCameraFlight} from './camera-flight.js?v=20260929-camera-handoff';
import {CSS2DRenderer,CSS2DObject} from 'three/addons/renderers/CSS2DRenderer.js';
import {setupInteractionGuide} from './interaction-guide.js?v=20260929-camera-handoff';
import {setupRoutes} from './routes.js?v=20260929-camera-handoff';
import {setupGuide,kindLabel} from './guide.js';
import {createCheckpointSite,checkpointTerrain,buildEntranceCheckpoint} from './entrance-checkpoint.js';
import {mergeGeometries,mergeVertices} from 'three/addons/utils/BufferGeometryUtils.js';
import {createSpatialBatch,AdaptiveResolution} from './render-performance.js?v=20260929-mobile-perf';

const interactionGuide=setupInteractionGuide();

const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
const compactViewport=()=>matchMedia('(max-width:820px), (max-width:960px) and (orientation:landscape) and (max-height:520px)').matches;let mobile=compactViewport();
// Phones and touch-only tablets get the lighter scene (fewer tree facets, no shadows, capped resolution) whatever their layout.
const lowPower=mobile||matchMedia('(pointer:coarse)').matches&&!matchMedia('(any-pointer:fine)').matches;
// Phones start at 标准, desktops at 极致 (or the device's remembered tier). Sustained
// slow frames first lower the independent DPR budget; only then step down a tier.
// Existing forest/shape presets stay intact, including the visitor's layer choice.
const TIERS=[
 {name:'流畅',dpr:1,pbr:false,blur:false,hiShapes:false,forest:0,bamboo:false,trunkDist:0,detailDist:450,landmarkDist:2600,labelCap:16,shadows:false},
 {name:'标准',dpr:1.5,pbr:false,blur:false,hiShapes:false,forest:1,bamboo:true,trunkDist:1400,detailDist:900,landmarkDist:4000,labelCap:null,shadows:false},
 {name:'高清',dpr:2,pbr:true,blur:true,hiShapes:true,forest:1,bamboo:true,trunkDist:2600,detailDist:2600,landmarkDist:4000,labelCap:null,shadows:false},
 {name:'极致',dpr:2,pbr:true,blur:true,hiShapes:true,forest:1,bamboo:true,trunkDist:1e9,detailDist:1e9,landmarkDist:4000,labelCap:null,shadows:true}];
const maxTier=lowPower?2:3;
const store={get(k){try{return localStorage.getItem('jiuhua.'+k);}catch{return null;}},set(k,v){try{localStorage.setItem('jiuhua.'+k,v);}catch{}}};
let tier=+(store.get('autoTier')??(lowPower?1:3));if(!(tier>=0&&tier<=maxTier))tier=lowPower?1:3;
let emergency=false; // below 流畅: automatic only, when even 流畅 cannot hold ~25 fps
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const escape=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
// Panels slide/fade in and out: `hidden` is only set once the exit transition has finished.
function reveal(el){clearTimeout(el._t);el.hidden=false;void el.offsetWidth;el.classList.add('show');}
function conceal(el,ms=440){el.classList.remove('show');clearTimeout(el._t);el._t=setTimeout(()=>{if(!el.classList.contains('show'))el.hidden=true;},ms);}
function toast(s){const t=$('#toast');t.textContent=s;reveal(t);clearTimeout(toast.t);toast.t=setTimeout(()=>conceal(t,400),3200);}

// The loading screen doubles as the error screen, with a reload button.
function fatal(msg){const l=$('#loading');l.hidden=false;l.classList.remove('done');l.classList.add('failed');$('#load-text').textContent=msg;const r=$('#reload');r.hidden=false;r.onclick=()=>location.reload();}
// iOS Safari ignores user-scalable; a pinch that starts on a panel or label would zoom the whole page instead of the map.
addEventListener('gesturestart',e=>e.preventDefault());
try{await init();}catch(e){console.error(e);fatal(/webgl/i.test(e.message)?'这个浏览器无法显示三维地图（WebGL 不可用）。请换用系统浏览器或更新浏览器后重试；在微信里可点右上角“···”，选“在浏览器打开”。':'地图加载失败，请重新加载。'+e.message);}
async function init(){
const [M,G]=window.__JIUHUA_DATA__||await Promise.all(['data/terrain.json','data/geodata.json?v=20260929-guide'].map(async u=>{const r=await fetch(u);if(!r.ok)throw new Error(u);return r.json();}));
const {W,D,N}=M, bytes=Uint8Array.from(atob(M.h),c=>c.charCodeAt(0)),dv=new DataView(bytes.buffer),H=new Float32Array(N*N);
for(let i=0;i<H.length;i++)H[i]=dv.getUint16(i*2,true)/4;
let EX=1;const hMin=Math.min(...H);
function rawHeight(x,z){const u=clamp((x+W/2)/W*(N-1),0,N-1.001),v=clamp((z+D/2)/D*(N-1),0,N-1.001),i=u|0,j=v|0,a=u-i,b=v-j;return(H[j*N+i]*(1-a)+H[j*N+i+1]*a)*(1-b)+(H[(j+1)*N+i]*(1-a)+H[(j+1)*N+i+1]*a)*b;}
const checkpoint=G.places.find(p=>p.model?.kind==='entrance-checkpoint'),checkpointSite=createCheckpointSite(checkpoint,rawHeight);
function hAt(x,z){const h=rawHeight(x,z);return checkpointSite?checkpointSite.height(x,z,h):h;}
// No preserveDrawingBuffer: the capture button renders and copies in the same task, and keeping the buffer costs phones a copy per frame.
// Low-power devices with dense screens skip MSAA: it doubles memory traffic on older mobile GPUs and the pixels are small.
const renderer=new THREE.WebGLRenderer({antialias:!(lowPower&&devicePixelRatio>=2),alpha:true,powerPreference:'high-performance'});
// Tiers below 高清 skip the frosted-glass blur behind panels (re-blurred every frame over the moving map): html.lite.
document.documentElement.classList.toggle('lite',!TIERS[tier].blur);
const resolutionCeiling=()=>Math.min(devicePixelRatio,emergency?.8:TIERS[tier].dpr),resolution=new AdaptiveResolution(resolutionCeiling());
let idleResolution=false,resolutionChangedAt=0;
const dprCap=()=>resolution.pixelRatio(idleResolution),shadows=()=>TIERS[tier].shadows&&!mobile&&!lowPower;
function syncResolution(idle=false,now=performance.now()){idleResolution=idle;const ratio=dprCap();if(Math.abs(renderer.getPixelRatio()-ratio)<.01)return;renderer.setPixelRatio(ratio);resolutionChangedAt=now;}
renderer.setPixelRatio(dprCap());renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.02;
renderer.shadowMap.enabled=shadows();renderer.shadowMap.type=THREE.PCFSoftShadowMap;$('#stage').appendChild(renderer.domElement);
// Phones can drop the GPU context under memory pressure (other tabs, backgrounding); say so instead of leaving a frozen frame.
renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();fatal('设备图形内存不足，三维画面已停止。关闭其他页面后点“重新加载”。');});
const labels=new CSS2DRenderer();labels.domElement.className='labels';$('#stage').appendChild(labels.domElement);
// A read-only CSS render list, not a second parent. Real labels keep their scene /
// route parents and world matrices; CSS2D no longer walks all the geometry again.
const labelRoot=new THREE.Group();labelRoot.matrixWorldAutoUpdate=false;
const attachedLabels=[];let labelsDirty=true,labelPasses=0,labelSelections=0;
const scene=new THREE.Scene();scene.fog=new THREE.FogExp2('#ceded9',.000072);
const world=new THREE.Group(),built=new THREE.Group(),forest=new THREE.Group(),trailGroup=new THREE.Group(),decor=new THREE.Group();scene.add(world);world.add(built,forest,trailGroup,decor);
const camera=new THREE.PerspectiveCamera(43,1,.7,32000);const controls=createMapControls(camera,$('#stage'),onMapTap);
controls.enableDamping=true;controls.dampingFactor=.075;controls.minDistance=10;controls.maxDistance=12500;controls.maxPolarAngle=Math.PI*.482;controls.zoomToCursor=true;controls.screenSpacePanning=false;
scene.add(new THREE.HemisphereLight('#ebf4f2','#5c6552',1.35));const sun=new THREE.DirectionalLight('#fff2d9',2.65);sun.position.set(-2000,3400,-1100);sun.castShadow=shadows();sun.shadow.mapSize.set(4096,4096);Object.assign(sun.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:6500});sun.shadow.bias=-.0001;sun.shadow.normalBias=.7;scene.add(sun,sun.target);
const color=c=>new THREE.Color(c);
// Phones and tablets shade with Lambert (diffuse only): the scene is matte almost everywhere, so it looks nearly the same at
// a fraction of the per-pixel cost. Gloss-only parameters are dropped there.
const PBR_ONLY=['roughness','metalness','roughnessMap','metalnessMap','envMapIntensity'];
const lambertParams=o=>{const q={...o};for(const k of PBR_ONLY)delete q[k];return q;};
function StdMat(o={}){const m=TIERS[tier].pbr?new THREE.MeshStandardMaterial(o):new THREE.MeshLambertMaterial(lambertParams(o));m.userData.params=o;return m;}
// The other shading kind of a material, made once and cached both ways; settings changed after creation are carried over.
const CARRY=['side','transparent','opacity','depthWrite','depthTest','polygonOffset','polygonOffsetFactor','polygonOffsetUnits','alphaTest','vertexColors','map','emissiveMap','emissiveIntensity','fog','toneMapped','flatShading','name'];
function twinOf(m,pbr){if(!m.userData.params||m.isMeshStandardMaterial===pbr)return m;if(m.userData.twin)return m.userData.twin;
 const t=pbr?new THREE.MeshStandardMaterial(m.userData.params):new THREE.MeshLambertMaterial(lambertParams(m.userData.params));
 for(const k of CARRY)if(k in m&&k in t)t[k]=m[k];t.color?.copy(m.color);t.emissive?.copy(m.emissive);t.onBeforeCompile=m.onBeforeCompile;
 t.userData.params=m.userData.params;t.userData.twin=m;m.userData.twin=t;return t;}
const mat=(c,more={})=>StdMat({color:c,roughness:.9,metalness:0,...more});
// Tree, bamboo and lantern shapes at two levels of detail; tiers below 高清 use the coarse ones (see setShapes).
const SHAPES={};let lanternMesh=null;
function shapes(hi){return SHAPES[hi]??=hi?{leaf:new THREE.SphereGeometry(1,7,5),pine:new THREE.ConeGeometry(1,1,9),trunk:new THREE.CylinderGeometry(.18,.3,1,5),bamboo:new THREE.SphereGeometry(1,7,6),lantern:new THREE.SphereGeometry(.24,10,8)}
 :{leaf:softBlob(),pine:new THREE.ConeGeometry(1,1,6,1,true),trunk:new THREE.CylinderGeometry(.18,.3,1,3,1,true),bamboo:softBlob(),lantern:softBlob().scale(.24,.24,.24)};}
const stone=mat('#b9b7a4'),wood=mat('#594937'),gold=mat('#ae833d',{roughness:.67}),red=mat('#943f2d'),roofDark=mat('#59605c'),glass=mat('#466266',{roughness:.3,metalness:.15});
const boxGeo=new THREE.BoxGeometry(1,1,1),cylGeo=new THREE.CylinderGeometry(1,1,1,8);
function box(parent,x,y,z,w,h,d,m){const o=new THREE.Mesh(boxGeo,m);o.position.set(x,y+h/2,z);o.scale.set(w,h,d);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
function cylinder(parent,x,y,z,r,h,m){const o=new THREE.Mesh(cylGeo,m);o.position.set(x,y+h/2,z);o.scale.set(r,h,r);o.castShadow=true;parent.add(o);return o;}
const lineBatches=new Map();
function line(parent,points,c='#777865'){let b=lineBatches.get(parent);if(!b){b={p:[],c:[]};lineBatches.set(parent,b);}const col=color(c);for(let i=1;i<points.length;i++){b.p.push(...points[i-1],...points[i]);b.c.push(col.r,col.g,col.b,col.r,col.g,col.b);}}
// Batches colour hundreds of thousands of triangles from a few dozen hex strings: parse each string once (read-only use).
const batchColors=new Map(),batchColor=co=>{if(typeof co!=='string')return color(co);let c=batchColors.get(co);if(!c)batchColors.set(co,c=color(co));return c;};
class Batch{
 constructor(){this.p=[];this.c=[];this.uv=[];this.ids=[];}
 tri(a,b,c,co='#ffffff',uvs=null,id=-1){this.p.push(a[0],a[1],a[2],b[0],b[1],b[2],c[0],c[1],c[2]);const col=batchColor(co),r=col.r,g=col.g,v=col.b;this.c.push(r,g,v,r,g,v,r,g,v);
  if(uvs)this.uv.push(uvs[0][0],uvs[0][1],uvs[1][0],uvs[1][1],uvs[2][0],uvs[2][1]);else this.uv.push(a[0]/8,a[2]/8,b[0]/8,b[2]/8,c[0]/8,c[2]/8);this.ids.push(id);} // plain pushes: no spread or temporary arrays per triangle
 quad(a,b,c,d,co,uvs=null,id=-1){this.tri(a,b,c,co,uvs?[uvs[0],uvs[1],uvs[2]]:null,id);this.tri(a,c,d,co,uvs?[uvs[0],uvs[2],uvs[3]]:null,id);}
 mesh(material,parent){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(this.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(this.c,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(this.uv,2));g.computeVertexNormals();const m=new THREE.Mesh(g,material);m.castShadow=true;m.receiveShadow=true;m.userData.triangleIds=this.ids;parent.add(m);return m;}
}
const TEX=lowPower?1024:2048,cv=document.createElement('canvas');cv.width=cv.height=TEX;const ctx=cv.getContext('2d');
const px=(x,z)=>[(x+W/2)/W*TEX,(z+D/2)/D*TEX];
const mask=document.createElement('canvas');mask.width=mask.height=1024;const mc=mask.getContext('2d');const mx=(x,z)=>[(x+W/2)/W*1024,(z+D/2)/D*1024];
function drawPath(context,pts,to,close=false){context.beginPath();pts.forEach((p,i)=>{const q=to(...p);i?context.lineTo(...q):context.moveTo(...q);});if(close)context.closePath();}
const im=ctx.createImageData(TEX,TEX),rand=rng(23),up=new THREE.Vector3(),light=new THREE.Vector3(-.55,.74,-.38).normalize();
for(let j=0;j<TEX;j++)for(let i=0;i<TEX;i++){
 const x=(i/TEX-.5)*W,z=(j/TEX-.5)*D,h=hAt(x,z),dx=(hAt(x+12,z)-hAt(x-12,z))/24,dz=(hAt(x,z+12)-hAt(x,z-12))/24;
 up.set(-dx,1,-dz).normalize();const rock=clamp((1-up.y-.27)*2.8,0,.67)*(h>720?1:.35);const grain=(rand()-.5)*10;
 const coarse=Math.sin(x*.008)*Math.cos(z*.007)*4;const rgb=[61+coarse,83+coarse,54+coarse];const lit=.79+.19*Math.max(0,up.dot(light));const k=(j*TEX+i)*4;
 for(let q=0;q<3;q++)im.data[k+q]=(rgb[q]*(1-rock)+[150,148,130][q]*rock)*lit+grain;im.data[k+3]=255;
}
ctx.putImageData(im,0,0);
// Plazas are paved open ground (traced on imagery): stone colour, and no trees or bamboo on them.
for(const a of G.areas){if(!['residential','religious','parking','water','grass','meadow','plaza','site'].includes(a.kind))continue;drawPath(ctx,a.ring,px,true);ctx.fillStyle=({residential:'#b7b6a0',religious:'#bdb9a6',parking:'#92998f',water:'#588e90',grass:'#849268',meadow:'#899767',plaza:'#b9b4a1',site:'#a9a89c'})[a.kind];ctx.fill();if(['residential','religious','parking','water','plaza','site'].includes(a.kind)){drawPath(mc,a.ring,mx,true);mc.fill();}}
// Roofprint footprints and actual road lines determine the settlement, never random houses.
ctx.lineJoin='round';for(const b of G.buildings){if(b.style==='rural'||b.style==='tiantai')continue;drawPath(ctx,b.ring,px,true);ctx.strokeStyle='#a9a797';ctx.lineWidth=Math.max(1.2,7/W*TEX);ctx.stroke();}
for(const b of G.buildings){drawPath(ctx,b.ring,px,true);ctx.fillStyle='#bcbcaf';ctx.fill();drawPath(mc,b.ring,mx,true);mc.fill();mc.lineWidth=3;mc.stroke();}
for(const r of G.roads){drawPath(ctx,r.pts,px);ctx.lineJoin=ctx.lineCap='round';ctx.strokeStyle=['path','footway','steps'].includes(r.kind)?'#b6ab8c':'#858e85';ctx.lineWidth=Math.max(.8,r.width/W*TEX);ctx.stroke();drawPath(mc,r.pts,mx);mc.lineWidth=Math.max(2,(r.width+7)/W*1024);mc.stroke();}
for(const r of G.water){drawPath(ctx,r.pts,px);ctx.strokeStyle='#648f8d';ctx.lineWidth=r.kind==='river'?3:1;ctx.stroke();drawPath(mc,r.pts,mx);mc.lineWidth=5;mc.stroke();}
const maskPixels=mc.getImageData(0,0,1024,1024).data;const blocked=(x,z)=>{const [i,j]=mx(x,z).map(Math.floor);return i<0||j<0||i>=1024||j>=1024||maskPixels[(j*1024+i)*4+3]>0;};
const texture=new THREE.CanvasTexture(cv);texture.colorSpace=THREE.SRGBColorSpace;texture.anisotropy=renderer.capabilities.getMaxAnisotropy();
const tg=new THREE.PlaneGeometry(W,D,N-1,N-1).rotateX(-Math.PI/2);for(let k=0;k<H.length;k++)tg.attributes.position.setY(k,H[k]);tg.computeVertexNormals();
const terrain=new THREE.Mesh(tg,mat('#ffffff',{map:texture}));terrain.receiveShadow=true;world.add(terrain);
if(checkpointSite)world.add(checkpointTerrain(checkpointSite,rawMeshHeight,W,D,mat('#ffffff',{map:texture})));
// Hand-built sites (居之林) hide the DEM inside a rotated rectangle: origin.xy + unit u.zw; s = (u0,u1,v0,v1), v = (u.y,-u.x).
const terrainCut={o:new THREE.Vector4(0,0,1,0),s:new THREE.Vector4(1,0,1,0)};
const checkpointCut=checkpointSite?{o:new THREE.Vector4(...checkpointSite.origin,checkpointSite.fz,-checkpointSite.fx),s:new THREE.Vector4(-18,18,-14,14)}:{o:new THREE.Vector4(0,0,1,0),s:new THREE.Vector4(1,0,1,0)};
// Inside a hand-built site the hidden DEM does not bound the camera, so visitors can walk the stairs and car park.
const inTerrainCut=(x,z)=>{const o=terrainCut.o,c=terrainCut.s,dx=x-o.x,dz=z-o.y,u=dx*o.z+dz*o.w,v=dx*o.w-dz*o.z;return u>c.x-3&&u<c.y+3&&v>c.z-3&&v<c.w+3;};
// Close-range ground grain: the 2048 px overview texture is ~2.7 m/px, so blend a tiled noise detail near the camera.
{const dc=document.createElement('canvas');dc.width=dc.height=256;const dx=dc.getContext('2d'),dimg=dx.createImageData(256,256),dr=rng(7);
 const oct=(f,seed)=>{const g=new Float32Array((f+1)*(f+1)),rr=rng(seed);for(let i=0;i<g.length;i++)g[i]=rr();return(x,y)=>{const u=x*f,v=y*f,i=Math.floor(u),j=Math.floor(v),a=u-i,b=v-j,s=t=>t*t*(3-2*t),at=(ii,jj)=>g[(jj%f)*(f+1)+(ii%f)];return(at(i,j)*(1-s(a))+at(i+1,j)*s(a))*(1-s(b))+(at(i,j+1)*(1-s(a))+at(i+1,j+1)*s(a))*s(b);};};
 const n1=oct(64,11),n2=oct(16,12),n3=oct(8,13);
 for(let j=0;j<256;j++)for(let i=0;i<256;i++){const x=i/256,y=j/256,k=(j*256+i)*4;const fine=.55*n1(x,y)+.45*dr();dimg.data[k]=fine*255;dimg.data[k+1]=(.6*n2(x,y)+.4*n3(x,y))*255;dimg.data[k+2]=128;dimg.data[k+3]=255;}
 dx.putImageData(dimg,0,0);const detailTex=new THREE.CanvasTexture(dc);detailTex.wrapS=detailTex.wrapT=THREE.RepeatWrapping;detailTex.anisotropy=8;
 terrain.material.onBeforeCompile=sh=>{sh.uniforms.detailMap={value:detailTex};sh.uniforms.cutO={value:terrainCut.o};sh.uniforms.cutS={value:terrainCut.s};sh.uniforms.checkpointO={value:checkpointCut.o};sh.uniforms.checkpointS={value:checkpointCut.s};
  sh.vertexShader=sh.vertexShader.replace('#include <common>','#include <common>\nvarying vec3 vDetailPos;').replace('#include <project_vertex>','#include <project_vertex>\nvDetailPos=(modelMatrix*vec4(transformed,1.0)).xyz;');
  sh.fragmentShader=sh.fragmentShader.replace('#include <common>','#include <common>\nvarying vec3 vDetailPos;uniform sampler2D detailMap;uniform vec4 cutO;uniform vec4 cutS;').replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n{vec2 dq=vDetailPos.xz-cutO.xy;float cu=dot(dq,cutO.zw),cv=dot(dq,vec2(cutO.w,-cutO.z));if(cu>cutS.x&&cu<cutS.y&&cv>cutS.z&&cv<cutS.w)discard;}').replace('#include <map_fragment>','#include <map_fragment>\n{float near=smoothstep(1600.0,150.0,length(vDetailPos-cameraPosition));float fine=texture2D(detailMap,vDetailPos.xz/7.0).r;float mid=texture2D(detailMap,vDetailPos.xz/61.0).g;diffuseColor.rgb*=mix(1.0,0.74+0.38*fine+0.22*(mid-0.5),near);}');
  const prev=sh.fragmentShader;sh.fragmentShader=prev.replace('uniform vec4 cutS;','uniform vec4 cutS;uniform vec4 checkpointO;uniform vec4 checkpointS;').replace('#include <clipping_planes_fragment>','#include <clipping_planes_fragment>\n{vec2 dq=vDetailPos.xz-checkpointO.xy;float cu=dot(dq,checkpointO.zw),cv=dot(dq,vec2(-checkpointO.w,checkpointO.z));if(cu>checkpointS.x&&cu<checkpointS.y&&cv>checkpointS.z&&cv<checkpointS.w)discard;}');};
 terrain.material.needsUpdate=true;}
const skirt=new Batch();const sides=[];for(let i=0;i<N;i++)sides.push([i,0]);for(let j=1;j<N;j++)sides.push([N-1,j]);for(let i=N-2;i>=0;i--)sides.push([i,N-1]);for(let j=N-2;j>=0;j--)sides.push([0,j]);
for(let i=1;i<sides.length;i++){const [a,b]=sides[i-1],[c,d]=sides[i],x=-W/2+a*W/(N-1),z=-D/2+b*D/(N-1),xx=-W/2+c*W/(N-1),zz=-D/2+d*D/(N-1);skirt.quad([x,H[b*N+a],z],[xx,H[d*N+c],zz],[xx,hMin-90,zz],[x,hMin-90,z],'#8f8974');}
skirt.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),world);
$('#load-text').textContent='按真实轮廓重建屋顶、窗户和沿街立面';
await new Promise(requestAnimationFrame);

function textureTile(mode){const c=document.createElement('canvas');c.width=c.height=256;const ct=c.getContext('2d');ct.fillStyle=mode==='roof'?'#aaa99f':'#e6e3d9';ct.fillRect(0,0,256,256);const r=rng(mode==='roof'?44:98);for(let i=0;i<3500;i++){ct.fillStyle=`rgba(${r()>.5?'255,255,255':'50,55,44'},${r()*.07})`;ct.fillRect(r()*256,r()*256,1+r()*3,1+r()*2);}if(mode==='roof'){for(let x=0;x<256;x+=12){ct.fillStyle='#e3dfd550';ct.fillRect(x,0,3,256);ct.fillStyle='#222c2c60';ct.fillRect(x+8,0,2,256);}for(let y=0;y<256;y+=20){ct.fillStyle='#23333145';ct.fillRect(0,y,256,1);}}const tex=new THREE.CanvasTexture(c);tex.wrapS=tex.wrapT=THREE.RepeatWrapping;tex.colorSpace=THREE.SRGBColorSpace;tex.anisotropy=8;return tex;}
const roofTex=textureTile('roof'),wallTex=textureTile('wall');const walls=new Batch(),roofs=new Batch(),foundation=new Batch(),windowBatch=new Batch(),trim=new Batch(),signBatch=new Batch();
const roofEdges=[];const detailedGroups=[];const pickables=[];
// Details a phone cannot resolve from afar (windows ~1 m wide, lanterns 0.5 m): tiers below 高清 hide them beyond a
// distance, where they would only shimmer (no MSAA on phones) and cost triangles. See tick().
const farDetail=[];// Footprints drawn by hand-built landmarks below (化城寺, 万佛塔, 肉身宝殿 main hall, 北门, 地藏禅寺 hall) are not also extruded.
const ROUSHEN_ID='overture-6eed6b02-0a6b-40b7-9326-5247a9383063';const replaced=new Set([609757872,609561169,G.buildings.find(b=>b.id===ROUSHEN_ID)?.osmId,609909704,609909706]); // + 肉身宝殿北门 and the 地藏禅寺 hall behind it
for(const a of G.areas)for(const id of a.frame?.replaces||[])replaced.add(G.buildings.find(b=>b.id===id)?.osmId); // footprints inside hand-built sites (居之林)
// Street signs carry real names from public listings, matched to the footprint that contains (or is within 8 m of) the pin.
const SIGN_W=256,SIGN_H=48,SIGN_COLS=8,SIGN_ROWS=lowPower?24:44,signTexts=[];
const signCanvas=document.createElement('canvas');signCanvas.width=SIGN_W*SIGN_COLS;signCanvas.height=SIGN_H*SIGN_ROWS;const sgc=signCanvas.getContext('2d');
function signSlot(text){const i=signTexts.length;if(i>=SIGN_COLS*SIGN_ROWS)return null;signTexts.push(text);const x=(i%SIGN_COLS)*SIGN_W,y=Math.floor(i/SIGN_COLS)*SIGN_H;
 sgc.fillStyle='#1c1a17';sgc.fillRect(x,y,SIGN_W,SIGN_H);sgc.strokeStyle='#8b6d30';sgc.lineWidth=3;sgc.strokeRect(x+4,y+4,SIGN_W-8,SIGN_H-8);
 sgc.fillStyle='#dcb95c';const size=Math.min(32,Math.floor((SIGN_W-26)/Math.max(2,[...text].length)));sgc.font=`600 ${size}px "Songti SC","STSong","Noto Serif SC","PingFang SC",serif`;sgc.textAlign='center';sgc.textBaseline='middle';sgc.fillText(text,x+SIGN_W/2,y+SIGN_H/2+1);
 const W2=signCanvas.width,H2=signCanvas.height;return[[x/W2,1-(y+SIGN_H)/H2],[(x+SIGN_W)/W2,1-(y+SIGN_H)/H2],[(x+SIGN_W)/W2,1-y/H2],[x/W2,1-y/H2]];}
const signName=s=>{const t=s.replace(/^(九华山上?|池州|花筑·?)/,'').replace(/[（(].*$/,'').replace(/(精品|主题)?(民宿|客栈|山庄|宾馆|酒店)$/,m=>m.length>2?m.slice(-2):m).trim();return[...t].slice(0,9).join('');};
const lanternPts=[],acPts=[];const shade=(hex,k)=>{const c=new THREE.Color(hex);c.offsetHSL(0,0,k);return'#'+c.getHexString();};
for(let bi=0;bi<G.buildings.length;bi++){
 const b=G.buildings[bi];if(replaced.has(b.osmId))continue;
 const ring=b.ring,top=b.base+b.wallHeight,rand=rng(b.osmId),tone=rand(),temple=b.style==='temple';
 const wallCol=b.wallColor||(b.precinct==='百岁宫'?'#e8dfc2':b.kind==='temple'?(b.roofColor==='gold'?'#cdb787':'#e6dbc1'):'#e9e6dc');
 const roofHex=b.roofColor?.startsWith('#')?b.roofColor:b.roofColor==='gold'?'#c1a14e':'#6f756c',roofCol=shade(roofHex,(tone-.5)*.06);
 const levels=b.levels||2,floorH=(b.wallHeight-.35)/levels,lattice=!!b.lattice,eave=b.eave??.5;
 const frameCol=lattice?'#3a2a1f':'#3c3f42',glassA=lattice?'#2f2721':'#465f61',glassB=lattice?'#3a3029':'#5b6f6f';
 let signed=0;ring.forEach((p,i)=>{const q=ring[(i+1)%ring.length];signed+=p[0]*q[1]-q[0]*p[1];});
 let signDone=true;/* no business signs: the map names no business except 居之林 (user 2026-09-28) */const party=new Set(b.partyEdges||[]);
 for(let i=0;i<ring.length;i++){
  const a=ring[i],d=ring[(i+1)%ring.length],len=Math.hypot(d[0]-a[0],d[1]-a[1]);if(len<.1)continue;
  // Stone footing (≤1.2 m) along the ground, wall above it: the two used to overlap and z-fight. Where the ground
  // falls away downhill a house's wall runs down to the footing and gets lower storeys (see windows below); temple
  // halls stand on a stone terrace (台基) instead.
  const ya=Math.min(b.base,hAt(...a)-.12),yd=Math.min(b.base,hAt(...d)-.12),fa=temple?b.base+.5:Math.min(b.base+.5,ya+1.2),fdn=temple?b.base+.5:Math.min(b.base+.5,yd+1.2);
  walls.quad([a[0],fa,a[1]],[d[0],fdn,d[1]],[d[0],top,d[1]],[a[0],top,a[1]],wallCol,[[0,fa/8],[len/8,fdn/8],[len/8,top/8],[0,top/8]],bi);
  foundation.quad([a[0],ya,a[1]],[d[0],yd,d[1]],[d[0],fdn,d[1]],[a[0],fa,a[1]],'#9c9a93',null,bi);
  // Walls shared with a neighbouring footprint stay blank: nothing may poke into the house next door.
  if(party.has(i))continue;
  const nx=(signed>0?1:-1)*(d[1]-a[1])/len,nz=(signed>0?-1:1)*(d[0]-a[0])/len,ux=(d[0]-a[0])/len,uz=(d[1]-a[1])/len;
  // Screen-right for someone facing this wall from outside, so sign text never reads mirrored.
  const rx=nz,rz=-nx;
  function faceQuad(batch,mid,y,width,height,co,offset=.035,uvs=null,right=false){const cx=a[0]+ux*mid+nx*offset,cz=a[1]+uz*mid+nz*offset,ww=width/2,sx=right?rx:ux,sz=right?rz:uz;batch.quad([cx-sx*ww,y,cz-sz*ww],[cx+sx*ww,y,cz+sz*ww],[cx+sx*ww,y+height,cz+sz*ww],[cx-sx*ww,y+height,cz-sz*ww],co,uvs);}
  const isFront=i===b.front&&b.frontDist!=null&&b.frontDist<14,shop=b.shopfront&&isFront&&len>2.4;
  if(len>2.4){const num=Math.max(1,Math.floor(len/(temple?3.1:3.3))),lmin=temple?0:-Math.floor((b.base+.35-Math.min(fa,fdn))/floorH);
   for(let l=lmin;l<levels;l++){if(l===0&&shop)continue;
    for(let n=0;n<num;n++){const along=(n+.5)*len/num,y=b.base+.35+l*floorH+(l===0?.95:.8),wh=Math.min(1.75,floorH*.54),ww=temple?1.3:lattice?1.1:1.4;
     if(l<0&&y<fa+(fdn-fa)*along/len+.35)continue; // lower storeys only where the wall stands clear of the footing
     faceQuad(trim,along,y-.1,ww+.18,wh+.18,frameCol);faceQuad(windowBatch,along,y,ww,wh,(n+l)%3?glassA:glassB,.055);
     if(lattice){faceQuad(trim,along,y,.05,wh,'#5a4633',.07);faceQuad(trim,along,y+wh*.5,ww,.05,'#5a4633',.072);faceQuad(trim,along-ww*.25,y,.035,wh,'#5a4633',.071);faceQuad(trim,along+ww*.25,y,.035,wh,'#5a4633',.071);}
     else faceQuad(trim,along,y,.05,wh,'#c3c6b5',.073);
     if(!temple&&!lowPower&&l>=1&&rand()<.13)acPts.push([a[0]+ux*(along+ww*.35)+nx*.28,y-.62,a[1]+uz*(along+ww*.35)+nz*.28,Math.atan2(nx,nz)]);
    }}
   if(i===b.front&&!shop&&!temple&&len>3){faceQuad(trim,len/2,b.base+.3,1.6,2.55,'#8d8778');faceQuad(windowBatch,len/2,b.base+.33,1.3,2.35,'#3a342d',.07);
    if(b.lanterns)for(const s of[-1.15,1.15])lanternPts.push([a[0]+ux*(len/2+s)+nx*.45,b.base+2.45,a[1]+uz*(len/2+s)+nz*.45]);}
  }
  if(shop){const nb=Math.max(1,Math.floor(len/3.2)),bw=len/nb;
   for(let n=0;n<nb;n++){const along=(n+.5)*bw;faceQuad(windowBatch,along,b.base+.42,bw-.42,2.3,n%2?'#2b2622':'#322b25',.06);faceQuad(trim,along-bw/2+.12,b.base+.4,.22,2.45,'#3a2a1f',.08);
    if(b.lanterns&&n<4)lanternPts.push([a[0]+ux*(along-bw/2+.3)+nx*.62,b.base+2.55,a[1]+uz*(along-bw/2+.3)+nz*.62]);}
   faceQuad(trim,len-.12,b.base+.4,.22,2.45,'#3a2a1f',.08);
   faceQuad(trim,len/2,b.base+2.78,len-.1,.42,b.style==='oldStreet'?'#7b2d22':'#6d5a45',.07);
  }
  if(!signDone&&isFront&&len>2.2){const biz=(shop&&b.businesses.find(x=>x.category!=='hotel'))||b.businesses[0],text=signName(biz.short||biz.n),uvs=text?signSlot(text):null;
   if(uvs){const w=Math.min(len*.82,.62*[...text].length+1.1),y=shop?b.base+3.28:b.base+Math.min(b.wallHeight-1.1,3.25);faceQuad(signBatch,len/2,y,w,Math.min(.95,w*.19),'#ffffff',.14,uvs,true);signDone=true;}}
  if(b.pentEave&&levels>1&&len>2){const y0=b.base+.35+floorH,o=.62;const p1=[a[0],y0+.34,a[1]],p2=[d[0],y0+.34,d[1]],p3=[d[0]+nx*o,y0,d[1]+nz*o],p4=[a[0]+nx*o,y0,a[1]+nz*o];roofs.quad(p1,p2,p3,p4,shade(roofHex,-.04),[[0,0],[len/6,0],[len/6,.2],[0,.2]],-1);}
  if(b.balcony&&isFront&&len>3.4){for(let l=1;l<levels;l++){const y=b.base+.35+l*floorH,o=1.05,w=Math.min(len-1,len*.7),m=len/2,s0=m-w/2,s1=m+w/2;
   const A=[a[0]+ux*s0,y,a[1]+uz*s0],B=[a[0]+ux*s1,y,a[1]+uz*s1],C=[B[0]+nx*o,y,B[2]+nz*o],E=[A[0]+nx*o,y,A[2]+nz*o];trim.quad(A,B,C,E,'#c9c6bc');trim.quad(E,C,[C[0],y-.18,C[2]],[E[0],y-.18,E[2]],'#b4b1a7');
   trim.quad(E,C,[C[0],y+1,C[2]],[E[0],y+1,E[2]],'#8f948f');}}
 }
 const [ux,uz]=b.axis,[cx,cz]=b.rectCenter,half=Math.max(.8,b.depth/2),rise=b.roofRise;
 const specialRoof=[541482372,538484526,538484527,538484528,609990014,609990009].includes(b.osmId);
 if(specialRoof)continue;
 const toUV=(pu,pv)=>[pu/6,pv/6];
 const rectFit=b.area/Math.max(1,b.width*b.depth);
 // Eaves stop short over a shared wall instead of running into the neighbour's walls and roof.
 const eaveG=b.partyGable?.12:eave,eaveE=b.partyEave?Math.min(eave,.15):eave;
 if(b.hip&&rectFit>.82){ // Hip roof over the fitted rectangle, with eaves.
  const hw=b.width/2+eaveG,hd=b.depth/2+eaveE,eaveY=top-rise*eaveE/half,rh=Math.max(0,b.width/2-b.depth/2);
  const P=(pu,pv,y)=>[cx+ux*pu-uz*pv,y,cz+uz*pu+ux*pv];
  const c1=P(-hw,-hd,eaveY),c2=P(hw,-hd,eaveY),c3=P(hw,hd,eaveY),c4=P(-hw,hd,eaveY),r1=P(-rh,0,top+rise),r2=P(rh,0,top+rise);
  roofs.quad(c1,c2,r2,r1,roofCol,[toUV(-hw,-hd),toUV(hw,-hd),toUV(rh,0),toUV(-rh,0)],bi);roofs.quad(c3,c4,r1,r2,roofCol,[toUV(hw,hd),toUV(-hw,hd),toUV(-rh,0),toUV(rh,0)],bi);
  roofs.tri(c2,c3,r2,shade(roofHex,-.03),[toUV(hw,-hd),toUV(hw,hd),toUV(rh,0)],bi);roofs.tri(c4,c1,r1,shade(roofHex,-.03),[toUV(-hw,hd),toUV(-hw,-hd),toUV(-rh,0)],bi);
  for(const[p,q]of[[c1,c2],[c2,c3],[c3,c4],[c4,c1],[r1,r2],[c1,r1],[c2,r2],[c3,r2],[c4,r1]])roofEdges.push(...p,...q);
  continue;}
 const ku=b.horseHead?1:1+2*eaveG/Math.max(2,b.width),kv=1+2*eaveE/Math.max(2,b.depth);
 const ext=p=>{const pu=(p[0]-cx)*ux+(p[1]-cz)*uz,pv=-(p[0]-cx)*uz+(p[1]-cz)*ux,qu=pu*ku,qv=pv*kv;return[cx+ux*qu-uz*qv,top+rise*(1-Math.abs(qv)/half),cz+uz*qu+ux*qv,qu,qv];};
 function ry(p){const v=-(p[0]-cx)*uz+(p[1]-cz)*ux;return top+rise*clamp(1-Math.abs(v)/half,0,1);}
 for(let i=0;i<ring.length;i++){const a=ring[i],d=ring[(i+1)%ring.length],va=-(a[0]-cx)*uz+(a[1]-cz)*ux,vd=-(d[0]-cx)*uz+(d[1]-cz)*ux,len=Math.hypot(d[0]-a[0],d[1]-a[1]);
  const gable=va*vd<0;
  if(gable&&b.horseHead&&len>4){ // Stepped horse-head gable (马头墙): white parapet with dark tile coping above the roof line.
   const steps=len>9?5:3,prof=steps===5?[.42,.74,1,.74,.42]:[.6,1,.6];
   for(let k=0;k<steps;k++){const s0=k/steps,s1=(k+1)/steps,p0=[a[0]+(d[0]-a[0])*s0,a[1]+(d[1]-a[1])*s0],p1=[a[0]+(d[0]-a[0])*s1,a[1]+(d[1]-a[1])*s1];
    const h=top+(rise+.95)*prof[k]+.25,hin=Math.max(ry(p0),ry(p1))+.45,y=Math.max(h,hin);
    walls.quad([p0[0],top,p0[1]],[p1[0],top,p1[1]],[p1[0],y,p1[1]],[p0[0],y,p0[1]],wallCol,null,bi);
    const tx=-(d[1]-a[1])/len*.3,tz=(d[0]-a[0])/len*.3;trim.quad([p0[0]-tx,y-.04,p0[1]-tz],[p1[0]-tx,y-.04,p1[1]-tz],[p1[0],y+.2,p1[1]],[p0[0],y+.2,p0[1]],'#3e4144');trim.quad([p0[0],y+.2,p0[1]],[p1[0],y+.2,p1[1]],[p1[0]+tx,y-.04,p1[1]+tz],[p0[0]+tx,y-.04,p0[1]+tz],'#3e4144');}
   continue;}
  const points=[a];if(gable){const t=va/(va-vd);points.push([a[0]+(d[0]-a[0])*t,a[1]+(d[1]-a[1])*t]);}points.push(d);for(let k=1;k<points.length;k++){const p=points[k-1],q=points[k];walls.quad([p[0],top,p[1]],[q[0],top,q[1]],[q[0],ry(q),q[1]],[p[0],ry(p),p[1]],wallCol,null,bi);}}
 for(const tri of b.roofTriangles){const vs=tri.map(ext);roofs.tri(...vs.map(v=>v.slice(0,3)),roofCol,vs.map(v=>toUV(v[3],v[4])),bi);}
 for(let i=0;i<ring.length;i++){const p=ext(ring[i]),q=ext(ring[(i+1)%ring.length]);roofEdges.push(p[0],p[1]+.06,p[2],q[0],q[1]+.06,q[2]);}
}
const wallMesh=walls.mesh(mat('#ffffff',{vertexColors:true,map:wallTex,side:THREE.DoubleSide}),built),roofMesh=roofs.mesh(mat('#ffffff',{vertexColors:true,map:roofTex,side:THREE.DoubleSide}),built);
pickables.push(foundation.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),built));farDetail.push(windowBatch.mesh(mat('#ffffff',{vertexColors:true,roughness:.4,metalness:.05,side:THREE.DoubleSide}),built));trim.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),built);pickables.push(wallMesh,roofMesh);
const signTex=new THREE.CanvasTexture(signCanvas);signTex.colorSpace=THREE.SRGBColorSpace;signTex.anisotropy=8;signBatch.mesh(StdMat({map:signTex,roughness:.55,side:THREE.DoubleSide,emissive:'#ffffff',emissiveMap:signTex,emissiveIntensity:.18}),built);
if(lanternPts.length){const lm=lanternMesh=new THREE.InstancedMesh(shapes(TIERS[tier].hiShapes).lantern,StdMat({color:'#c8261c',emissive:'#8a1208',emissiveIntensity:.55,roughness:.5}),lanternPts.length),o=new THREE.Object3D();lanternPts.forEach((p,i)=>{o.position.set(...p);o.scale.set(1,1.25,1);o.updateMatrix();lm.setMatrixAt(i,o.matrix);});built.add(lm);farDetail.push(lm);}
if(acPts.length){const am=new THREE.InstancedMesh(new THREE.BoxGeometry(.8,.55,.3),mat('#d8d8d2',{roughness:.6}),acPts.length),o=new THREE.Object3D();acPts.forEach((p,i)=>{o.position.set(p[0],p[1],p[2]);o.rotation.set(0,p[3],0);o.updateMatrix();am.setMatrixAt(i,o.matrix);});built.add(am);}
const eg=new THREE.BufferGeometry();eg.setAttribute('position',new THREE.Float32BufferAttribute(roofEdges,3));built.add(new THREE.LineSegments(eg,new THREE.LineBasicMaterial({color:'#3f3a33',transparent:true,opacity:.55})));

// Roof profiles are separate from location confidence. These are informed reconstructions, not scans.
function roof(parent,cx,y,cz,w,d,rise,material=roofDark,{hip=false,upturn=false}={}){
 const batch=new Batch(),half=w/2,deep=d/2;
 const ridgeHalf=hip?Math.max(1,half-deep*.8):half;
 const A=[cx-half,y+(upturn?.6:0),cz-deep],B=[cx+half,y+(upturn?.6:0),cz-deep],C=[cx+half,y+(upturn?.6:0),cz+deep],D2=[cx-half,y+(upturn?.6:0),cz+deep],R=[cx-ridgeHalf,y+rise,cz],S=[cx+ridgeHalf,y+rise,cz];
 batch.quad(A,B,S,R,'#ffffff');batch.quad(D2,R,S,C,'#ffffff');batch.tri(A,R,D2,'#ffffff');batch.tri(B,C,S,'#ffffff');
 const m=material.clone();m.map=roofTex;m.side=THREE.DoubleSide;batch.mesh(m,parent);
 line(parent,[R,S],material===gold?'#ba9144':'#5b6459');
 if(upturn){for(const [xx,zz,sx,sz]of[[cx-half,cz-deep,-1,-1],[cx+half,cz-deep,1,-1],[cx-half,cz+deep,-1,1],[cx+half,cz+deep,1,1]])line(parent,[[xx-sx*3,y+.03,zz-sz*1.8],[xx,y+.6,zz],[xx+sx*.65,y+1.05,zz+sz*.5]],'#71694c');}
}
function localGroup(x,z,name){const g=new THREE.Group();g.position.set(x,hAt(x,z),z);g.userData.landmark=name;built.add(g);detailedGroups.push(g);return g;}
// Landmarks rotated onto their mapped footprint: local +z is the facade direction, local x runs across it.
function footprintFrame(cx,cz,fx,fz){const rot=Math.atan2(fx,fz),c=Math.cos(rot),s=Math.sin(rot);return{rot,wp:(lx,lz)=>[cx+lx*c+lz*s,cz-lx*s+lz*c]};}
// Axis-aligned block in a group's local frame, added to a Batch with wall-texture UVs.
function slab(bt,x0,x1,y0,y1,z0,z1,co){const u=(a,b,h)=>[[0,0],[a/8,0],[a/8,h/8],[0,h/8]],h=y1-y0,dx=x1-x0,dz=z1-z0;
 bt.quad([x0,y0,z1],[x1,y0,z1],[x1,y1,z1],[x0,y1,z1],co,u(dx,0,h));bt.quad([x1,y0,z0],[x0,y0,z0],[x0,y1,z0],[x1,y1,z0],co,u(dx,0,h));
 bt.quad([x1,y0,z1],[x1,y0,z0],[x1,y1,z0],[x1,y1,z1],co,u(dz,0,h));bt.quad([x0,y0,z0],[x0,y0,z1],[x0,y1,z1],[x0,y1,z0],co,u(dz,0,h));
 bt.quad([x0,y1,z1],[x1,y1,z1],[x1,y1,z0],[x0,y1,z0],co,[[x0/8,z1/8],[x1/8,z1/8],[x1/8,z0/8],[x0/8,z0/8]]);}
const landmarkTop=new Map();
// 化城寺: 四进院落 fitted inside the mapped OSM footprint (58.8 × 19.9 m), axis NNW→SSE facing 放生池.
// Range depths follow the official plan (灵官殿 16.5, 天王殿 20.5, 大雄宝殿 20.5, 藏经楼 14 m, fitted to the
// footprint); the 碑廊 court between the 3rd and 4th ranges is the courtyard visible on imagery. Terraces rise
// 3.7 / 1.5 / (inferred 1.2) / 2.7 m from the plaza and never sit below the DEM under each range. Hard gables with
// 马头墙 on the side walls; nothing leaves the footprint except eaves (0.8 m) and the front stair.
{const b=G.buildings.find(b=>b.name==='化城寺');if(b){
 const [cx,cz]=b.rectCenter,{rot,wp}=footprintFrame(cx,cz,-b.axis[0],-b.axis[1]),hw=b.depth/2,hl=b.width/2,k=b.width/58.75;
 const g=localGroup(cx,cz,'化城寺');g.rotation.y=rot;const y0=g.position.y;
 const wallC=b.wallColor||'#f0eee8',roofC=b.roofColor||'#6a6f72',capC='#3e4144',ridgeC='#4a4f50';
 const wallB=new Batch(),roofB=new Batch(),trimB=new Batch();
 const ground=(z0,z1,f)=>{let m=f===Math.max?-1e9:1e9;for(let i=0;i<=4;i++)for(let j=-2;j<=2;j++)m=f(m,hAt(...wp(j*hw/2,z0+(z1-z0)*i/4)));return m-y0;};
 const R=[{name:'灵官殿',hall:8,court:3.75,doc:3.7,h:6,rise:2.4,wing:2.6},{name:'天王殿',hall:9.5,court:4.5,doc:5.2,h:6.4,rise:2.85,wing:2.6},
  {name:'大雄宝殿',hall:11.5,court:7.5,doc:6.4,h:8,rise:3.45,wing:3},{name:'藏经楼',hall:14,court:0,doc:9.1,h:10.5,rise:4.2}];
 const plaza=hAt(...wp(0,hl+6))-y0;let zf=hl,lvl=-1e9;
 for(const r of R){r.front=zf;r.hallBack=zf-r.hall*k;r.back=r.hallBack-r.court*k;zf=r.back;r.y=Math.max(plaza+r.doc,ground(r.back,r.front,Math.max)+.3,lvl);lvl=r.y;
  const lo=ground(r.back,r.front,Math.min)-1.2;slab(trimB,-hw,hw,lo,r.y,r.back,r.front,'#b9b7a4');}
 const ov=.8;
 for(const[i,r]of R.entries()){const zb=r.hallBack,zfr=r.front,zm=(zb+zfr)/2,half=(zfr-zb)/2,yt=r.y+r.h,yr=yt+r.rise,ye=yt-r.rise*ov/half,sl=Math.hypot(half+ov,yr-ye);
  slab(wallB,-hw,hw,r.y,yt,zb,zfr,wallC);
  for(const s of[-1,1])wallB.tri([s*hw,yt,zb],[s*hw,yt,zfr],[s*hw,yr,zm],wallC,[[0,0],[half/4,0],[half/8,r.rise/8]]);
  roofB.quad([-hw,ye,zfr+ov],[hw,ye,zfr+ov],[hw,yr,zm],[-hw,yr,zm],roofC,[[-hw/6,0],[hw/6,0],[hw/6,sl/6],[-hw/6,sl/6]]);
  roofB.quad([hw,ye,zb-ov],[-hw,ye,zb-ov],[-hw,yr,zm],[hw,yr,zm],roofC,[[hw/6,0],[-hw/6,0],[-hw/6,sl/6],[hw/6,sl/6]]);
  slab(trimB,-hw,hw,yr-.12,yr+.32,zm-.22,zm+.22,ridgeC);
  // Stepped 马头墙 on both gable ends, each step clearing the roof beneath it.
  const steps=r.hall>9?5:3,prof=steps===5?[.42,.74,1,.74,.42]:[.6,1,.6];
  for(const s of[-1,1])for(let q=0;q<steps;q++){const z0=zb+(zfr-zb)*q/steps,z1=zb+(zfr-zb)*(q+1)/steps,tp=yt+(r.rise+.95)*prof[q]+.3;
   const xa=s*hw-s*.36,xb=s*hw+s*.06,ca=s*hw-s*.48,cb=s*hw+s*.18;slab(wallB,Math.min(xa,xb),Math.max(xa,xb),yt,tp,z0,z1,wallC);slab(trimB,Math.min(ca,cb),Math.max(ca,cb),tp,tp+.2,z0-.06,z1+.06,capC);}
  // Facade toward the approach (+z).
  const fz=zfr+.06;
  if(i===0){for(const off of[-hw*.46,0,hw*.46]){const ww=off?2.6:3.3,hh=off?3.7:4.5,arch=new THREE.Shape();arch.moveTo(-ww/2,0);arch.lineTo(ww/2,0);arch.lineTo(ww/2,hh-ww/2);arch.absarc(0,hh-ww/2,ww/2,0,Math.PI,false);arch.lineTo(-ww/2,0);const m=new THREE.Mesh(new THREE.ShapeGeometry(arch,14),wood);m.position.set(off,r.y+.02,fz);g.add(m);}
   slab(trimB,-2.2,2.2,r.y+4.9,r.y+5.7,fz,fz+.12,'#2b2622');for(const off of[-hw*.7,-hw*.23,hw*.23,hw*.7]){const l=new THREE.Mesh(new THREE.SphereGeometry(.42,10,7),red);l.position.set(off,yt-.75,zfr+.55);l.scale.y=1.22;g.add(l);}}
  else if(i===1){slab(trimB,-1.8,1.8,r.y,r.y+3.4,fz-.02,fz+.06,'#3a2a1f');for(const s of[-1,1])slab(trimB,s*5.2-1.1,s*5.2+1.1,r.y+1.4,r.y+3.2,fz-.02,fz+.05,'#3a3029');}
  else if(i===2){const n=5;for(let c=0;c<=n;c++){const x=-hw+1.2+c*(2*hw-2.4)/n;cylinder(g,x,r.y,zfr+.42,.2,r.h-.1,red);}
   for(let c=0;c<n;c++){const x=-hw+1.2+(c+.5)*(2*hw-2.4)/n,w2=(2*hw-2.4)/n-.5;slab(trimB,x-w2/2,x+w2/2,r.y+.2,r.y+r.h*.72,fz-.02,fz+.05,'#8a3a2a');for(let q=1;q<4;q++)slab(trimB,x-w2/2,x+w2/2,r.y+.2+q*r.h*.18-.04,r.y+.2+q*r.h*.18+.04,fz,fz+.08,'#4a2a20');}
   slab(trimB,-2,2,yt-1.3,yt-.5,fz+.05,fz+.14,'#2b2622');}
  else{for(const face of[zfr+.05,zb-.05])for(let fl=0;fl<3;fl++)for(let c=0;c<5;c++){const x=-hw+(c+.5)*2*hw/5,y=r.y+.9+fl*3.3;slab(trimB,x-.85,x+.85,y,y+1.7,face-.03,face+.03,'#3a2a1f');slab(trimB,x-.04,x+.04,y,y+1.7,face-.05,face+.05,'#5a4633');}
   for(let fl=1;fl<3;fl++)slab(trimB,-hw,hw,r.y+fl*3.3+.2,r.y+fl*3.3+.38,zfr,zfr+.45,'#5a4633');}
  // Courtyard behind this hall: side rooms (厢房) or, behind the main hall, the 碑廊 with the eight inset steles.
  if(r.court>0){const z0=r.back,z1=r.hallBack,wd=r.wing;
   for(const s of[-1,1]){const xo=s*hw,xi=s*(hw-wd),hgt=i===2?3.2:3.6,yo=r.y+hgt+1.1,yi=r.y+hgt-.1;
    slab(wallB,Math.min(xo,xi),Math.max(xo,xi),r.y,r.y+hgt,z0+.02,z1-.02,wallC);slab(wallB,Math.min(xo,xo-s*.3),Math.max(xo,xo-s*.3),r.y+hgt,yo,z0+.02,z1-.02,wallC);
    roofB.quad([xo,yo,z0],[xo,yo,z1],[xi-s*.6,yi,z1],[xi-s*.6,yi,z0],roofC,[[z0/6,0],[z1/6,0],[z1/6,(wd+.6)/6],[z0/6,(wd+.6)/6]]);
    const fx=xi-s*.05;
    if(i===2){for(let q=0;q<4;q++){const zz=z0+(z1-z0)*(q+.5)/4;slab(trimB,Math.min(fx,fx-s*.18),Math.max(fx,fx-s*.18),r.y+.3,r.y+2.3,zz-.55,zz+.55,'#77736a');}}
    else for(let q=0;q<2;q++){const zz=z0+(z1-z0)*(q+.5)/2;slab(trimB,Math.min(fx,fx-s*.06),Math.max(fx,fx-s*.06),r.y+1,r.y+2.6,zz-.7,zz+.7,'#3a3029');}}
   // Steps up to the next terrace, set against its front.
   const nx=R[i+1],dh=nx.y-r.y,n=Math.max(1,Math.ceil(dh/.18)),td=Math.min(.32,(z1-z0)*.7/n);
   for(let q=0;q<n;q++)slab(trimB,-3,3,r.y-.05,nx.y-q*dh/n,z0+q*td,z0+(q+1)*td,'#c2bfb0');}}
 // Front stair from the plaza up to the first terrace, flanked by stone lions (observed).
 {const r=R[0],gy=hAt(...wp(0,hl+3))-y0,dh=r.y-gy;if(dh>.25){const n=Math.ceil(dh/.17),td=.33;
  for(let q=0;q<n;q++)slab(trimB,-4.5,4.5,Math.min(gy,plaza)-1,r.y-(q+1)*dh/n,hl+q*td,hl+(q+1)*td,'#c2bfb0');
  for(const s of[-1,1]){slab(trimB,s*5.4-.5,s*5.4+.5,gy,gy+.7,hl+n*td-1.1,hl+n*td-.1,'#9f9d92');slab(trimB,s*5.4-.35,s*5.4+.35,gy+.7,gy+1.8,hl+n*td-.95,hl+n*td-.25,'#9f9d92');}}}
 wallB.mesh(mat('#ffffff',{vertexColors:true,map:wallTex,side:THREE.DoubleSide}),g);roofB.mesh(mat('#ffffff',{vertexColors:true,map:roofTex,side:THREE.DoubleSide}),g);trimB.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),g);
 landmarkTop.set('化城寺',y0+R[2].y+R[2].h+R[2].rise);
 const p=G.places.find(p=>p.n==='化城寺');if(p)p.modelNote='模型按 OpenStreetMap 实测占地（约 59 × 20 米，轴线朝向放生池）复原四进院落：灵官殿、天王殿、大雄宝殿、藏经楼，进深按官方规划比例缩放，台基逐进升高 3.7 / 1.5 / 约 1.2 / 2.7 米；第三、四进之间为碑廊院。单体立面与细部为近似。';
}}
// 肉身宝殿: north-facing red hall, dark iron-tile 重檐歇山 and 20 stone columns in a surrounding gallery, set on the
// imagery roofprint at the mapped point (Overture/Esri; the earlier fixed spot was the open terrace north of it and
// cut through the yellow side halls). Height ≈15 m per the official plan.
{const b=G.buildings.find(b=>b.id===ROUSHEN_ID),p=G.places.find(p=>p.n==='肉身宝殿');if(b&&p){
 const [cx,cz]=b.rectCenter,{rot,wp}=footprintFrame(cx,cz,-b.axis[0],-b.axis[1]),fw=b.depth,fd=b.width;
 const g=localGroup(cx,cz,'肉身宝殿');g.rotation.y=rot;const y0=g.position.y,iron=mat('#2f3232',{roughness:.7,metalness:.25});
 let hi=-1e9,lo=1e9;for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){const h=hAt(...wp(i*fw/4,j*fd/4));hi=Math.max(hi,h);lo=Math.min(lo,h);}
 const ty=hi-y0+.9,w=fw-3.6,d=fd-3.6;box(g,0,lo-y0-1,0,fw+1.2,ty-(lo-y0-1),fd+1.2,stone);
 box(g,0,ty,0,w,6.2,d,red);roof(g,0,ty+6.2,0,fw+1.2,fd+1.2,2.4,iron,{hip:true,upturn:true});
 box(g,0,ty+6.2,0,w*.72,4.6,d*.72,red);roof(g,0,ty+10.8,0,w*.72+2.6,d*.72+2.6,3.6,iron,{hip:true,upturn:true});
 const cxs=[...Array(6)].map((_,i)=>-(fw/2-.45)+i*(fw-.9)/5),czs=[1,2,3,4].map(i=>-(fd/2-.45)+i*(fd-.9)/5);
 for(const s of[-1,1]){for(const x of cxs)cylinder(g,x,ty,s*(fd/2-.45),.22,6.2,stone);for(const z of czs)cylinder(g,s*(fw/2-.45),ty,z,.22,6.2,stone);}
 for(const x of[-w/3,0,w/3])box(g,x,ty+.1,d/2+.02,w/3-.5,4.3,.1,wood);box(g,0,ty+4.8,d/2+.08,2.6,.8,.12,gold);
 const gy=hAt(...wp(0,fd/2+2.5))-y0,dh=ty-gy;if(dh>.2){const n=Math.ceil(dh/.17);for(let i=0;i<n;i++)box(g,0,gy-.6,fd/2+.6+i*.32+.16,6,ty-(i+1)*dh/n-(gy-.6),.32,stone);}
 landmarkTop.set('肉身宝殿',y0+ty+14.4);
 p.modelNote='按官方描述复原北向入口、红墙、深色铁瓦重檐歇山、约 15 米殿高与 20 根外围石柱；主殿落在地图点位处的影像识别轮廓上，两侧黄墙配殿按各自轮廓建模。殿体比例与台阶为近似。';
}}
// Canvas helpers for painted details (plaques, couplets, 彩画 bands); textures stay small and are drawn once.
function paintTex(w,h,draw,{repeat=false}={}){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.colorSpace=THREE.SRGBColorSpace;t.anisotropy=8;if(repeat)t.wrapS=t.wrapT=THREE.RepeatWrapping;return t;}
function facePlane(parent,x,y,z,w,h,tex,{back=false,emissive=0}={}){const m=new THREE.Mesh(new THREE.PlaneGeometry(w,h),StdMat({map:tex,roughness:.6,emissive:emissive?'#ffffff':'#000000',emissiveMap:emissive?tex:null,emissiveIntensity:emissive}));m.position.set(x,y+h/2,z);if(back)m.rotation.y=Math.PI;parent.add(m);return m;}
const SERIF='"Songti SC","STSong","Noto Serif SC","PingFang SC",serif';
// Draped ground mesh (paving, lawn, paths) that follows the terrain surface as rendered: the terrain mesh is planar per
// grid triangle, so hAt's bilinear value can sit under it; hMesh matches the triangles exactly.
function rawMeshHeight(x,z){const u=clamp((x+W/2)/W*(N-1),0,N-1.001),v=clamp((z+D/2)/D*(N-1),0,N-1.001),i=u|0,j=v|0,a=u-i,b=v-j,h00=H[j*N+i],h10=H[j*N+i+1],h01=H[(j+1)*N+i],h11=H[(j+1)*N+i+1];return a+b<=1?h00+a*(h10-h00)+b*(h01-h00):h11+(1-a)*(h01-h11)+(1-b)*(h10-h11);}
function hMesh(x,z){const h=rawMeshHeight(x,z);return checkpointSite?checkpointSite.height(x,z,h):h;}
function drapePolygon(batch,ring,lift,co,maxEdge=3.5,holes=[]){const tris=THREE.ShapeUtils.triangulateShape(ring.map(p=>new THREE.Vector2(p[0],p[1])),holes.map(h=>h.map(p=>new THREE.Vector2(p[0],p[1])))),all=ring.concat(...holes);
 const put=(a,b,c)=>{const e=Math.max(Math.hypot(a[0]-b[0],a[1]-b[1]),Math.hypot(b[0]-c[0],b[1]-c[1]),Math.hypot(c[0]-a[0],c[1]-a[1]));
  if(e>maxEdge){const m=(p,q)=>[(p[0]+q[0])/2,(p[1]+q[1])/2],ab=m(a,b),bc=m(b,c),ca=m(c,a);put(a,ab,ca);put(ab,b,bc);put(ca,bc,c);put(ab,bc,ca);return;}
  if((b[1]-a[1])*(c[0]-a[0])-(b[0]-a[0])*(c[1]-a[1])<0)[b,c]=[c,b]; // wind counter-clockwise seen from above so the face points up
  batch.tri([a[0],hMesh(...a)+lift,a[1]],[b[0],hMesh(...b)+lift,b[1]],[c[0],hMesh(...c)+lift,c[1]],co);};
 for(const[i,j,k]of tris)put(all[i],all[j],all[k]);}
function ringInward(ring){let s=0;ring.forEach((p,i)=>{const q=ring[(i+1)%ring.length];s+=p[0]*q[1]-q[0]*p[1];});return s>0?1:-1;}
// Cut-stone kerb along a ring: outer face, top and inner lip, sampled every ~2.5 m so it hugs the ground.
function kerb(batch,ring,{h=.3,w=.35,co='#a39e91'}={}){const sgn=ringInward(ring);
 for(let i=0;i<ring.length;i++){const a=ring[i],b=ring[(i+1)%ring.length],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<.05)continue;const n=Math.ceil(len/2.5),nx=-sgn*(b[1]-a[1])/len*w,nz=sgn*(b[0]-a[0])/len*w;
  for(let k=0;k<n;k++){const p=[a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n],q=[a[0]+(b[0]-a[0])*(k+1)/n,a[1]+(b[1]-a[1])*(k+1)/n],hp=hMesh(...p),hq=hMesh(...q);
   const P=[p[0]+nx,p[1]+nz],Q=[q[0]+nx,q[1]+nz],hP=hMesh(...P),hQ=hMesh(...Q);
   batch.quad([p[0],hp-.25,p[1]],[q[0],hq-.25,q[1]],[q[0],hq+h,q[1]],[p[0],hp+h,p[1]],co);
   batch.quad([p[0],hp+h,p[1]],[q[0],hq+h,q[1]],[Q[0],hQ+h,Q[1]],[P[0],hP+h,P[1]],co);
   batch.quad([P[0],hP+h,P[1]],[Q[0],hQ+h,Q[1]],[Q[0],hQ+.08,Q[1]],[P[0],hP+.08,P[1]],co);}}}

// 神光岭广场 (named by the user; outline traced on Esri imagery): granite paving in running bond with darker banding on an
// 8 m grid, a cut-stone kerb, lamp posts round the edge, and the lawn with its oval path at the north-west end.
{const plazas=G.areas.filter(a=>a.kind==='plaza'),lawn=G.areas.find(a=>a.id==='r4-plaza-lawn');
 if(plazas.length){
  // 8 m repeat: 4 m squares in two granite tones (readable from a distance), 1 × 0.5 m slabs in running bond inside
  // them, and a dark 0.5 m band with a light edging stone on the 8 m grid.
  const paveTex=paintTex(512,512,(g,w)=>{const r=rng(311),S=64;g.fillStyle='#7f7a70';g.fillRect(0,0,w,w);
   for(let row=0;row<16;row++)for(let col=-1;col<9;col++){const t=r(),x=col*S+(row%2)*S/2,y=row*S/2,alt=((Math.floor((x+S/4)/256)+Math.floor(y/256))%2+2)%2,base=alt?[172,166,153]:[188,182,168];
    g.fillStyle=`rgb(${base[0]+t*18|0},${base[1]+t*16|0},${base[2]+t*14|0})`;g.fillRect(x+1.5,y+1.5,S-3,S/2-3);}
   g.fillStyle='#857f73';g.fillRect(0,0,w,32);g.fillRect(0,0,32,w);g.fillStyle='#c9c2b0';g.fillRect(0,32,w,5);g.fillRect(32,0,5,w);g.fillRect(0,0,w,3);g.fillRect(0,0,3,w);
   for(let i=0;i<12000;i++){g.fillStyle=`rgba(${r()<.5?'255,255,255':'40,40,36'},${r()*.1})`;g.fillRect(r()*w,r()*w,1.5,1.5);}},{repeat:true});
  const pave=new Batch(),edge=new Batch();
  // The lawn is cut out of the paving so the two never fight where the draped triangles cross terrain creases.
  const inside=(pt,ring)=>{let c=false;for(let i=0,j=ring.length-1;i<ring.length;j=i++){const a=ring[i],b=ring[j];if((a[1]>pt[1])!==(b[1]>pt[1])&&pt[0]<(b[0]-a[0])*(pt[1]-a[1])/(b[1]-a[1])+a[0])c=!c;}return c;};
  for(const a of plazas){drapePolygon(pave,a.ring,.16,'#ffffff',3.5,lawn&&lawn.ring.every(q=>inside(q,a.ring))?[lawn.ring]:[]);kerb(edge,a.ring);}
  const pm=pave.mesh(mat('#ffffff',{map:paveTex,roughness:.93}),world);pm.castShadow=false;
  if(lawn){const grassTex=paintTex(256,256,(g,w)=>{const r=rng(77);g.fillStyle='#6f8b4f';g.fillRect(0,0,w,w);for(let i=0;i<6000;i++){g.fillStyle=`rgba(${r()<.5?'150,180,100':'50,80,40'},${.25*r()})`;g.fillRect(r()*w,r()*w,1,2+r()*3);}},{repeat:true});
   const lb=new Batch();drapePolygon(lb,lawn.ring,.24,'#ffffff',1.5);const lm=lb.mesh(mat('#ffffff',{map:grassTex,roughness:1}),world);lm.castShadow=false;kerb(edge,lawn.ring,{h:.4,w:.3,co:'#b3ad9f'});
   // The oval path seen on imagery, inscribed in the lawn rectangle.
   const R=lawn.ring,c=[R.reduce((s,p)=>s+p[0],0)/R.length,R.reduce((s,p)=>s+p[1],0)/R.length],e0=[R[1][0]-R[0][0],R[1][1]-R[0][1]],e1=[R[2][0]-R[1][0],R[2][1]-R[1][1]],l0=Math.hypot(...e0),l1=Math.hypot(...e1),u0=[e0[0]/l0,e0[1]/l0],u1=[e1[0]/l1,e1[1]/l1];
   const oval=[];for(let k=0;k<=128;k++){const t=k/128*Math.PI*2;oval.push([c[0]+u0[0]*Math.cos(t)*l0*.36+u1[0]*Math.sin(t)*l1*.4,c[1]+u0[1]*Math.cos(t)*l0*.36+u1[1]*Math.sin(t)*l1*.4]);}
   const ob=new Batch();for(let k=1;k<oval.length;k++){const a=oval[k-1],b=oval[k],len=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/len*.8,nz=(b[0]-a[0])/len*.8;ob.quad([a[0]-nx,hMesh(a[0]-nx,a[1]-nz)+.45,a[1]-nz],[b[0]-nx,hMesh(b[0]-nx,b[1]-nz)+.45,b[1]-nz],[b[0]+nx,hMesh(b[0]+nx,b[1]+nz)+.45,b[1]+nz],[a[0]+nx,hMesh(a[0]+nx,a[1]+nz)+.45,a[1]+nz],'#c9c3b2');}
   ob.mesh(mat('#ffffff',{vertexColors:true,roughness:.95,side:THREE.DoubleSide,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),world);}
  edge.mesh(mat('#ffffff',{vertexColors:true,roughness:.9,side:THREE.DoubleSide}),world);
  // Lamp posts every ~16 m, 1.2 m inside the kerb: dark iron pole, lantern with a small tiled cap.
  const lamps=[];for(const a of plazas){const sgn=ringInward(a.ring);let carry=8;
   for(let i=0;i<a.ring.length;i++){const p=a.ring[i],q=a.ring[(i+1)%a.ring.length],len=Math.hypot(q[0]-p[0],q[1]-p[1]);if(len<.05)continue;const nx=-sgn*(q[1]-p[1])/len,nz=sgn*(q[0]-p[0])/len;
    for(let d=carry;d<len;d+=16){const x=p[0]+(q[0]-p[0])*d/len+nx*1.2,z=p[1]+(q[1]-p[1])*d/len+nz*1.2;lamps.push([x,hMesh(x,z)+.16,z]);}carry=((carry-len)%16+16)%16;}}
  if(lamps.length){const o=new THREE.Object3D(),pole=new THREE.InstancedMesh(new THREE.CylinderGeometry(.07,.11,4.2,6),mat('#34383a',{roughness:.5,metalness:.4}),lamps.length),
    head=new THREE.InstancedMesh(new THREE.BoxGeometry(.46,.62,.46),StdMat({color:'#f3e2b8',emissive:'#ffcf7a',emissiveIntensity:.45,roughness:.5}),lamps.length),
    cap=new THREE.InstancedMesh(new THREE.ConeGeometry(.42,.34,4),mat('#2f3333'),lamps.length);
   lamps.forEach((p,i)=>{o.rotation.set(0,Math.PI/4,0);o.position.set(p[0],p[1]+2.1,p[2]);o.updateMatrix();pole.setMatrixAt(i,o.matrix);o.position.set(p[0],p[1]+4.45,p[2]);o.updateMatrix();head.setMatrixAt(i,o.matrix);o.position.set(p[0],p[1]+4.93,p[2]);o.updateMatrix();cap.setMatrixAt(i,o.matrix);});
   for(const m of[pole,head,cap]){m.castShadow=true;decor.add(m);}}
  const p=G.places.find(p=>p.n==='神光岭广场');if(p){landmarkTop.set(p.n,hAt(p.x,p.z)+3);p.modelNote='广场铺装、路缘、灯柱与西北角草坪按卫星影像示意复原；铺地纹样与灯具样式为示意。';}
 }}

// 三角洲车站台阶 (user, 2026-09-28): steps from 莲花大道 down to 神光岭广场, about 12 m lower (corrections.py lowers the
// square's ground to match). 15 cm risers are laid on that slope and each tread runs on until the ground ahead has dropped
// below the next riser, so the long treads by the road read as its landing; granite cheek walls with a coping on both
// sides. Width and step size are estimates. Picking the steps opens the stop.
for(const r of G.roads){if(r.model!=='stair')continue;
 const [a,b]=r.pts,len=Math.hypot(b[0]-a[0],b[1]-a[1]),half=r.width/2,WALL=.4,inner=half-WALL;
 const {rot,wp}=footprintFrame(a[0],a[1],(b[0]-a[0])/len,(b[1]-a[1])/len),g=localGroup(a[0],a[1],'三角洲车站');g.rotation.y=rot;const y0=g.position.y;
 const ground=(lx,lz)=>{const [x,z]=wp(lx,lz);return Math.max(hAt(x,z),hMesh(x,z));};
 // highest ground across the stair every 25 cm, then the highest from there to the foot, so no tread dips under the ground
 const ds=.25,n=Math.ceil(len/ds),env=[];for(let k=0;k<=n;k++){let h=-1e9;for(let o=-half;o<=half+.01;o+=half/3)h=Math.max(h,ground(o,Math.min(len,k*ds)));env.push(h+.06);}
 for(let k=n-1;k>=0;k--)env[k]=Math.max(env[k],env[k+1]);
 const top=env[0],foot=env[n],count=Math.max(1,Math.round((top-foot)/.15)),rise=(top-foot)/count;
 const granite=mat('#bdb8aa',{roughness:.85}),wall=mat('#9d998b',{roughness:.9}),coping=mat('#d2cdc0',{roughness:.8});
 for(let q=0,k=0,s0=0;q<count&&s0<len;q++){const h=top-q*rise;while(k<n&&env[k]>h-rise+1e-6)k++;const s1=Math.min(len,Math.max(s0+.28,k*ds)),zc=(s0+s1)/2;
  let lo=1e9;for(const lz of[s0,zc,s1])for(const lx of[-half,0,half])lo=Math.min(lo,ground(lx,lz));const yb=lo-.8-y0,yt=h-y0;
  box(g,0,yb,zc,2*inner,yt-yb,s1-s0,granite);
  for(const sd of[-1,1]){box(g,sd*(inner+WALL/2),yb,zc,WALL,yt+.85-yb,s1-s0,wall);box(g,sd*(inner+WALL/2),yt+.85,zc,WALL+.1,.1,s1-s0,coping);}
  s0=s1;}
 const p=G.places.find(p=>p.n==='三角洲车站');if(p)p.modelNote='车站旁下到神光岭广场的台阶按用户说明示意复原：高差约 12 米（广场地面已按此修正）；台阶宽度、级数和踏步尺寸为估计。';
}

// 肉身宝殿北门 (identified by the user from photos; OSM way 609909704): a red three-arch 牌楼 with gold couplets on the
// piers, painted 彩画 beams, the plaque 行願無盡 and a 山門 tablet, five tiled roofs with dragons on the top ridge, black
// iron-studded doors behind the arches, stone lions on marble plinths, and a balustraded stair down to the stream bridges.
{const b=G.buildings.find(b=>b.osmId===609909704),p=G.places.find(p=>p.n==='肉身宝殿北门');if(b){
 const [cx,cz]=b.rectCenter;let fx=-b.axis[1],fz=b.axis[0];if(hAt(cx+fx*6,cz+fz*6)>hAt(cx-fx*6,cz-fz*6)){fx=-fx;fz=-fz;} // faces downhill, to the bridges
 const {rot,wp}=footprintFrame(cx,cz,fx,fz),g=localGroup(cx,cz,p?p.n:'肉身宝殿北门');g.rotation.y=rot;const y0=g.position.y,Wd=b.width,Dp=b.depth;
 let back=-1e9,lo=1e9;for(let i=-3;i<=3;i++){back=Math.max(back,hAt(...wp(i*Wd/6,-Dp/2)),hAt(...wp(i*Wd/6,0)));for(const zz of[-Dp/2,0,Dp/2,Dp/2+4])lo=Math.min(lo,hAt(...wp(i*Wd/6,zz)));}
 const gF=hAt(...wp(0,Dp/2+3))-y0,top=Math.max(back-y0+.25,gF+1.2),yb=lo-y0-1.2;
 const red=mat('#b3312a',{roughness:.7}),marble=mat('#dcd9cf',{roughness:.6}),tile=mat('#3a3e3f',{roughness:.8}),paint=mat('#2a6184',{roughness:.7}),G0=new THREE.Group();G0.position.y=top;g.add(G0);
 // terrace and stair
 box(g,0,yb,(-Dp/2+2.8)/2,Wd-.2,top-yb,2.8+Dp/2,stone);
 {const dh=top-gF,n=Math.max(1,Math.ceil(dh/.16)),bal=new Batch();for(let i=0;i<n;i++){const st=top-(i+1)*dh/n,z0=2.8+i*.32;box(g,0,yb,z0+.16,17,st-yb,.32,marble);
   for(const s of[-1,1]){const x=s*8.72;bal.quad([x-.14*s,st,z0],[x-.14*s,st,z0+.32],[x-.14*s,st+.9,z0+.32],[x-.14*s,st+.9,z0],'#e2dfd6');bal.quad([x+.14*s,st,z0],[x+.14*s,st,z0+.32],[x+.14*s,st+.9,z0+.32],[x+.14*s,st+.9,z0],'#d6d3c9');bal.quad([x-.14,st+.9,z0],[x+.14,st+.9,z0],[x+.14,st+.9,z0+.32],[x-.14,st+.9,z0+.32],'#eeebe3');
    if(i%3===0)box(g,x,st,z0+.16,.3,1.15,.3,marble);}}
  bal.mesh(mat('#ffffff',{vertexColors:true,roughness:.6,side:THREE.DoubleSide}),g);}
 // arched front wall: three openings, central one larger
 const HW=10.7,H1=9,sh=new THREE.Shape(),arch=(cxa,hw,spr)=>{sh.lineTo(cxa-hw,0);sh.lineTo(cxa-hw,spr);sh.absarc(cxa,spr,hw,Math.PI,0,true);sh.lineTo(cxa+hw,0);};
 sh.moveTo(-HW,0);arch(-6.8,1.9,3.9);arch(0,2.7,5.2);arch(6.8,1.9,3.9);sh.lineTo(HW,0);sh.lineTo(HW,H1);sh.lineTo(-HW,H1);sh.lineTo(-HW,0);
 const wall=new THREE.Mesh(new THREE.ExtrudeGeometry(sh,{depth:1.5,bevelEnabled:false,curveSegments:18}),red);wall.position.z=-.2;wall.castShadow=wall.receiveShadow=true;G0.add(wall);
 for(const[cxa,hw,spr]of[[-6.8,1.9,3.9],[0,2.7,5.2],[6.8,1.9,3.9]]){const s2=new THREE.Shape();s2.moveTo(cxa-hw-.32,0);s2.lineTo(cxa-hw-.32,spr);s2.absarc(cxa,spr,hw+.32,Math.PI,0,true);s2.lineTo(cxa+hw+.32,0);s2.lineTo(cxa+hw,0);s2.lineTo(cxa+hw,spr);s2.absarc(cxa,spr,hw,0,Math.PI,false);s2.lineTo(cxa-hw,0);s2.lineTo(cxa-hw-.32,0);
  const m=new THREE.Mesh(new THREE.ExtrudeGeometry(s2,{depth:.06,bevelEnabled:false,curveSegments:18}),mat('#e4ddca',{roughness:.6}));m.position.z=1.3;G0.add(m);}
 for(const x of[-9.7,-3.8,3.8,9.7])box(G0,x,0,.55,x*x>40?2.3:2.5,.7,1.8,marble);
 // couplets on the inner piers (from the photos), gold on red
 const couplet=t=>paintTex(128,700,(c,w,h)=>{c.fillStyle='#a52a22';c.fillRect(0,0,w,h);c.strokeStyle='#d9b04a';c.lineWidth=5;c.strokeRect(8,8,w-16,h-16);c.fillStyle='#f0c85a';c.font=`700 70px ${SERIF}`;c.textAlign='center';c.textBaseline='middle';[...t].forEach((ch,i)=>c.fillText(ch,w/2,50+i*(h-100)/(t.length-1)));});
 facePlane(G0,-3.8,2.95,1.33,1.05,5.85,couplet('地獄未空誓不成佛'));facePlane(G0,3.8,2.95,1.33,1.05,5.85,couplet('眾生度盡方證菩提'));
 // painted beam band with the main plaque
 const bandTex=paintTex(2048,160,(c,w,h)=>{c.fillStyle='#1f4f78';c.fillRect(0,0,w,h);c.fillStyle='#2f8466';c.fillRect(0,0,w,26);c.fillRect(0,h-26,w,26);c.fillStyle='#d8ad45';c.fillRect(0,26,w,5);c.fillRect(0,h-31,w,5);
  const r=rng(5);for(let x=40;x<w;x+=170){c.strokeStyle='#e8e4d6';c.lineWidth=4;c.beginPath();c.arc(x,h/2,34,0,Math.PI*2);c.stroke();c.fillStyle='#3a7fb0';c.beginPath();c.arc(x,h/2,26,0,Math.PI*2);c.fill();c.fillStyle='#d8ad45';c.beginPath();c.arc(x,h/2,9,0,Math.PI*2);c.fill();
   c.strokeStyle='#d8ad45';c.lineWidth=5;c.beginPath();c.moveTo(x+48,h/2);for(let k=0;k<6;k++)c.quadraticCurveTo(x+58+k*14,h/2+(k%2?-22:22)*(.6+r()*.4),x+66+k*14,h/2);c.stroke();}
  for(let x=0;x<w;x+=18){c.fillStyle=x%36?'#f4f1e6':'#c44b3a';c.fillRect(x,8,10,10);c.fillRect(x,h-18,10,10);}});
 box(G0,0,H1,.55,2*HW+.5,1.75,1.75,paint);facePlane(G0,0,H1,1.43,2*HW+.5,1.75,bandTex);facePlane(G0,0,H1,-.33,2*HW+.5,1.75,bandTex,{back:true});
 const plaque=paintTex(840,250,(c,w,h)=>{c.fillStyle='#b8862f';c.fillRect(0,0,w,h);c.fillStyle='#e3bf62';c.fillRect(10,10,w-20,h-20);c.fillStyle='#161412';c.fillRect(34,34,w-68,h-68);c.fillStyle='#e6c25e';c.font=`700 132px ${SERIF}`;c.textAlign='center';c.textBaseline='middle';['盡','無','願','行'].forEach((ch,i)=>c.fillText(ch,w*(.2+.2*i),h/2+4));});
 facePlane(G0,0,H1+.15,1.5,4.2,1.25,plaque,{emissive:.12});
 // raised centre bay with the 山門 tablet, side bays, then the five roofs
 const bracketTex=paintTex(512,160,(c,w,h)=>{c.fillStyle='#2c6a52';c.fillRect(0,0,w,h);for(let x=0;x<w;x+=64){c.fillStyle='#1f4f78';c.fillRect(x+6,20,52,70);c.fillStyle='#d8ad45';c.fillRect(x+26,10,12,90);c.fillStyle='#8a2f25';c.fillRect(x+4,100,56,40);}c.fillStyle='#d8ad45';c.fillRect(0,0,w,6);c.fillRect(0,h-6,w,6);});
 box(G0,0,H1+1.75,.55,6.8,2.55,1.3,paint);facePlane(G0,0,H1+1.75,1.21,6.8,2.55,bracketTex);facePlane(G0,0,H1+1.75,-.11,6.8,2.55,bracketTex,{back:true});
 const tablet=paintTex(180,320,(c,w,h)=>{c.fillStyle='#c79a3c';c.fillRect(0,0,w,h);c.fillStyle='#1a1715';c.fillRect(22,34,w-44,h-68);c.fillStyle='#e6c25e';c.font=`700 92px ${SERIF}`;c.textAlign='center';c.textBaseline='middle';c.fillText('山',w/2,h*.33);c.fillText('門',w/2,h*.68);});
 facePlane(G0,0,H1+1.95,1.25,.8,1.45,tablet,{emissive:.12});
 for(const s of[-1,1]){box(G0,s*6.8,H1+1.75,.55,4.8,1.05,1.1,paint);facePlane(G0,s*6.8,H1+1.75,1.11,4.8,1.05,bracketTex);}
 roof(G0,0,H1+4.3,.55,9.4,4.8,2.3,tile,{hip:true,upturn:true});
 for(const s of[-1,1]){roof(G0,s*6.8,H1+2.8,.55,6.4,4.2,1.8,tile,{hip:true,upturn:true});roof(G0,s*10.4,H1+1.7,.55,3.6,3.8,1.5,tile,{hip:true,upturn:true});}
 // ridge: two dragons facing a gilded pearl, 鸱吻 at the ends
 {const ry=H1+4.3+2.3,dm=mat('#3d4a44',{roughness:.6,metalness:.2});const pearl=new THREE.Mesh(new THREE.SphereGeometry(.26,12,10),gold);pearl.position.set(0,ry+.55,.55);G0.add(pearl);cylinder(G0,0,ry,.55,.08,.35,gold);
  for(const s of[-1,1]){const pts=[];for(let k=0;k<=12;k++){const t=k/12;pts.push(new THREE.Vector3(s*(.45+t*2.1),ry+.12+Math.sin(t*Math.PI*2.2)*.22+(1-t)*.25,.55));}
   const d=new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts),32,.09,6),dm);G0.add(d);const hd=new THREE.Mesh(new THREE.SphereGeometry(.16,8,6),dm);hd.position.copy(pts[0]);hd.position.y+=.12;G0.add(hd);
   const w=box(G0,s*2.78,ry-.1,.55,.28,.95,.32,dm);w.rotation.z=-s*.25;}}
 // black iron doors behind the arches, studded, with ring knockers
 const studTex=paintTex(128,128,(c,w)=>{c.fillStyle='#22201e';c.fillRect(0,0,w,w);for(const x of[32,96])for(const y of[32,96]){const gr=c.createRadialGradient(x-5,y-5,2,x,y,15);gr.addColorStop(0,'#77716a');gr.addColorStop(1,'#2a2724');c.fillStyle=gr;c.beginPath();c.arc(x,y,13,0,Math.PI*2);c.fill();}},{repeat:true});
 studTex.repeat.set(2,2);const ds=new THREE.Shape(),topY=x=>{const a=Math.abs(x);return a<3.9?6.7+.9*(x/3.9)**2:5.3+.9*((a-7.15)/3.25)**2;};
 ds.moveTo(-10.4,0);ds.lineTo(10.4,0);for(let k=0;k<=80;k++){const x=10.4-k*20.8/80;ds.lineTo(x,topY(x));}ds.lineTo(-10.4,0);
 const door=new THREE.Mesh(new THREE.ShapeGeometry(ds,4),StdMat({map:studTex,roughness:.55,metalness:.35,side:THREE.DoubleSide}));door.position.z=-1.15;G0.add(door);
 for(const s of[-1,1]){const k=new THREE.Mesh(new THREE.TorusGeometry(.24,.045,6,16),gold);k.position.set(s*.75,3.1,-1.08);G0.add(k);}
 // stone lions on marble plinths in front of each pier
 const lionM=mat('#cfcbc0',{roughness:.8});for(const x of[-9.7,-3.8,3.8,9.7]){box(G0,x,0,2.05,1.15,1.25,1.25,marble);const L=new THREE.Group();L.position.set(x,1.25,2.05);G0.add(L);
  box(L,0,0,-.05,.62,.75,.95,lionM);const hd=new THREE.Mesh(new THREE.SphereGeometry(.4,10,8),lionM);hd.position.set(0,1.05,.2);hd.scale.set(1,.95,.85);L.add(hd);const mn=new THREE.Mesh(new THREE.SphereGeometry(.47,10,8),lionM);mn.position.set(0,.95,.05);mn.scale.set(1.05,1,.7);L.add(mn);
  const ball=new THREE.Mesh(new THREE.SphereGeometry(.17,8,6),lionM);ball.position.set(x<0?.22:-.22,.1,.42);L.add(ball);}
 // short yellow walls closing the footprint ends
 for(const s of[-1,1]){box(G0,s*11.75,0,.1,1.7,4.2,.9,mat('#d6a13a'));box(G0,s*11.75,4.2,.1,2,.32,1.3,tile);}
 landmarkTop.set(p?p.n:'肉身宝殿北门',y0+top+17);
 if(p)p.modelNote='门楼按用户提供的实景照片复原：三拱红色牌楼、内侧两柱金字对联（地獄未空誓不成佛 / 眾生度盡方證菩提）、彩画额枋、中匾“行願無盡”、上部“山門”竖匾、五座屋顶，拱后为黑色铁钉大门，门前石狮与汉白玉栏杆石阶。尺寸按照片比例估计。';
}}

// 地藏禅寺 main hall behind 北门 (the user: a temple hall, not a house; OSM way 609909706): stone terrace facing the gate,
// red columns round a gallery with lattice doors, yellow side walls, a dark timber upper storey and double 歇山 roofs;
// plus the square pavilion in the forecourt (dark roof on imagery, visible through the gate in the user's photo).
{const b=G.buildings.find(b=>b.osmId===609909706),gt=G.buildings.find(b=>b.osmId===609909704),p=G.places.find(p=>p.n==='肉身宝殿-地藏禅寺');if(b){
 const [cx,cz]=b.rectCenter;let fx=-b.axis[0],fz=-b.axis[1];if(gt&&(gt.center[0]-cx)*fx+(gt.center[1]-cz)*fz<0){fx=-fx;fz=-fz;}
 const {rot,wp}=footprintFrame(cx,cz,fx,fz),c=Math.cos(rot),s=Math.sin(rot),loc=([x,z])=>[(x-cx)*c-(z-cz)*s,(x-cx)*s+(z-cz)*c];
 const L=b.ring.map(loc),xs=L.map(q=>q[0]),hw=(Math.max(...xs)-Math.min(...xs))/2,xm=(Math.max(...xs)+Math.min(...xs))/2;
 const wide=L.filter(q=>Math.abs(q[0]-xm)>hw*.6),zF=Math.max(...wide.map(q=>q[1])),zB=Math.min(...wide.map(q=>q[1])),zA=Math.min(...L.map(q=>q[1])),annex=L.filter(q=>q[1]<zB-.5);
 const g=localGroup(cx,cz,p?p.n:'地藏禅寺');g.rotation.y=rot;const y0=g.position.y,red=mat('#a8302a',{roughness:.7}),tile=mat('#3d4242',{roughness:.8}),yellow=mat('#d6a23c'),timber=mat('#4a2a22');
 const hs=[];let lo=1e9;for(let i=0;i<=6;i++)for(let j=0;j<=6;j++){const h=hAt(...wp(xm-hw+i*hw/3,zB+(zF-zB)*j/6));hs.push(h);lo=Math.min(lo,h);}hs.sort((a,b)=>a-b);
 const top=hs[Math.floor(hs.length*.7)]-y0+.5,yb=lo-y0-1.2,bw=2*hw,bd=zF-zB,zc=(zF+zB)/2;
 box(g,xm,yb,zc,bw+1.6,top-yb,bd+1.6,stone);
 {const gy=hAt(...wp(xm,zF+4))-y0,dh=top-gy;if(dh>.2){const n=Math.ceil(dh/.16);for(let i=0;i<n;i++)box(g,xm,yb,zF+.8+i*.3+.15,10,top-(i+1)*dh/n-yb,.3,stone);
   for(const sx of[-1,1])box(g,xm+sx*5.3,yb,zF+.8+n*.15,.5,top+.9-yb,n*.3,stone);}}
 // ground floor: gallery of red columns, walls set back 2.2 m (yellow sides/back, red lattice doors in front)
 const ih=6.8;box(g,xm,top,zc,bw-4.4,ih,bd-4.4,yellow);
 const lattice=paintTex(256,256,(q,w)=>{q.fillStyle='#6b2a20';q.fillRect(0,0,w,w);q.strokeStyle='#3a1a14';q.lineWidth=3;for(let k=8;k<w;k+=16){q.beginPath();q.moveTo(k,0);q.lineTo(k,w*.7);q.stroke();q.beginPath();q.moveTo(0,k*.7);q.lineTo(w,k*.7);q.stroke();}q.fillStyle='#5a221a';q.fillRect(0,w*.72,w,w*.28);q.strokeStyle='#c9a24a';q.lineWidth=4;q.strokeRect(4,4,w-8,w-8);});
 const bays=7;for(let k=0;k<bays;k++){const x=xm-(bw-4.4)/2+(k+.5)*(bw-4.4)/bays;facePlane(g,x,top+.15,zF-2.2+.03,(bw-4.4)/bays-.35,ih*.75,lattice);}
 for(let k=0;k<=8;k++){const x=xm-bw/2+.6+k*(bw-1.2)/8;cylinder(g,x,top,zF-.6,.3,ih,red);cylinder(g,x,top,zB+.6,.3,ih,red);}
 for(let k=1;k<7;k++){const z=zB+.6+k*(bd-1.2)/7;cylinder(g,xm-bw/2+.6,top,z,.3,ih,red);cylinder(g,xm+bw/2-.6,top,z,.3,ih,red);}
 box(g,xm,top+ih-.9,zF-.6,bw-.6,.9,.5,red);
 roof(g,xm,top+ih,zc,bw+2.4,bd+2.4,3.1,tile,{hip:true,upturn:true});
 // upper storey and top roof
 const uw=bw*.6,ud=bd*.55,uh=5.4;box(g,xm,top+ih,zc,uw,uh,ud,timber);
 for(let k=0;k<=6;k++)cylinder(g,xm-uw/2+.3+k*(uw-.6)/6,top+ih+2.2,zc+ud/2+.25,.24,uh-2.2,red);
 for(let k=0;k<6;k++){const x=xm-uw/2+.3+(k+.5)*(uw-.6)/6;facePlane(g,x,top+ih+2.6,zc+ud/2+.02,(uw-.6)/6-.4,2.2,lattice);}
 const board=paintTex(420,140,(q,w,h)=>{q.fillStyle='#c79a3c';q.fillRect(0,0,w,h);q.fillStyle='#1a1715';q.fillRect(16,16,w-32,h-32);q.strokeStyle='#e6c25e';q.lineWidth=3;q.strokeRect(24,24,w-48,h-48);});
 facePlane(g,xm,top+ih+uh-1.6,zc+ud/2+.35,3.6,1.2,board);
 roof(g,xm,top+ih+uh,zc,uw+3.4,ud+3.4,3.8,tile,{hip:true,upturn:true});
 {const ry=top+ih+uh+3.8,dm=mat('#3d4a44',{roughness:.6,metalness:.2}),rh=Math.max(1,(uw+3.4)/2-(ud+3.4)/2*.8);for(const sx of[-1,1]){const w=box(g,xm+sx*rh,ry-.15,zc,.35,1.2,.4,dm);w.rotation.z=-sx*.25;}
  cylinder(g,xm,ry,zc,.1,.5,gold);const f=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),gold);f.position.set(xm,ry+.75,zc);g.add(f);}
 // rear annex (lower block on the higher ground behind)
 if(annex.length){const ax=annex.map(q=>q[0]),aw=Math.max(...ax)-Math.min(...ax),axm=(Math.max(...ax)+Math.min(...ax))/2,azc=(zB+zA)/2,ad=zB-zA;
  const ah=Math.max(...[0,.5,1].map(t=>hAt(...wp(axm,zA+ad*t))))-y0;box(g,axm,Math.min(ah,top)-1,azc,aw,Math.max(top,ah+.3)-Math.min(ah,top)+1+4.6,ad,yellow);roof(g,axm,Math.max(top,ah+.3)+4.6,azc,aw+1.6,ad+1.6,2,tile,{hip:true,upturn:true});}
 landmarkTop.set(p?p.n:'地藏禅寺',Math.max(landmarkTop.get(p?.n)??0,y0+top+ih+uh+5));
 if(p)p.modelNote='北门后的大殿按用户指认（OSM way 609909706）做成重檐歇山殿堂：石台基、红柱回廊、木格门、黄墙、上层木构。殿名与尺寸未见公开资料，形制为示意；院中方亭按卫星影像与实景照片补出。';
 // forecourt pavilion (香亭): the dark square roof between 北门 and the hall on imagery
 {const [px0,pz0]=[-1807,82],g2=localGroup(px0,pz0,p?p.n:'地藏禅寺');g2.rotation.y=rot;
  box(g2,0,-1.2,0,7.6,1.6,7.6,stone);for(const sx of[-1,1])for(const sz of[-1,1])cylinder(g2,sx*2.9,.4,sz*2.9,.22,3.6,red);
  box(g2,0,3.6,0,6.4,.45,6.4,mat('#2a6184',{roughness:.7}));roof(g2,0,4.05,0,8.6,8.6,2.8,tile,{hip:true,upturn:true});const f=new THREE.Mesh(new THREE.SphereGeometry(.28,12,10),gold);f.position.set(0,7.2,0);g2.add(f);cylinder(g2,0,6.8,0,.08,.4,gold);
  const bronze=mat('#6a5534',{roughness:.45,metalness:.55});cylinder(g2,0,.4,0,.7,1.1,bronze);roof(g2,0,1.5,0,1.7,1.7,.7,bronze,{hip:true,upturn:true});}
}}
// 居之林民宿 — the client's guesthouse (凤形新村19号), built from the owner's photos. A terraced lodge cut into the slope
// above the road. Level 1: white corner block, five patio rooms behind rubble-stone walls under a timber canopy, a
// straight lit stair and the glazed lobby. Level 2: the clay-tile hall (four big windows, LED eave) and a flat-roofed
// white block with a dark fascia, bonsai garden, gravel beds and timber deck. Level 3: roof terraces with wooden
// bleachers on the tile roof, a reflecting pool, a curved glass stair and a timber back wall with lamps. Terrain inside
// the site is hidden by the terrain shader's cut, so the lodge's own terraces and retaining walls form the ground.
let featuredPin=null;
{const site=G.areas.find(a=>a.id==='r4-juzhilin-site'),place=G.places.find(p=>p.featured);if(site&&place){
 const F=site.frame,O=F.origin,U=F.u,V=[U[1],-U[0]],L=F.length,DP=F.depth,FR=F.front,BOT=-9;
 const W=(u,v)=>[O[0]+U[0]*u+V[0]*v,O[1]+U[1]*u+V[1]*v];
 const D=hAt(...W(3,FR))+.25,E=u=>hAt(...W(u,FR))+.25-D,T=(u,v)=>hMesh(...W(u,v))-D;
 terrainCut.o.set(O[0],O[1],U[0],U[1]);terrainCut.s.set(0,L,FR,DP);
 const g=localGroup(O[0],O[1],place.n);g.position.y=D;g.rotation.y=Math.atan2(-V[0],-V[1]);
 // ---- textures (each tile covers tm metres; box UVs are in metres / tm) ----
 const rgb=h=>[parseInt(h.slice(1,3),16),parseInt(h.slice(3,5),16),parseInt(h.slice(5,7),16)];
 function stoneTex(seed,cells,cols,mortar,mw,size=256){return paintTex(size,size,(c,w)=>{const r=rng(seed),pts=[];for(let j=0;j<cells;j++)for(let i=0;i<cells;i++)pts.push([(i+.12+.76*r())*w/cells,(j+.12+.76*r())*w/cells,rgb(cols[Math.floor(r()*cols.length)]),.86+.28*r()]);
  const img=c.createImageData(w,w),m=rgb(mortar);for(let y=0;y<w;y++)for(let x=0;x<w;x++){let d1=1e9,d2=1e9,b=null;for(const p of pts){let dx=Math.abs(x-p[0]),dy=Math.abs(y-p[1]);dx=Math.min(dx,w-dx);dy=Math.min(dy,w-dy);const d=dx*dx+dy*dy;if(d<d1){d2=d1;d1=d;b=p;}else if(d<d2)d2=d;}
   const k=(y*w+x)*4,edge=Math.sqrt(d2)-Math.sqrt(d1),n=(r()-.5)*18;if(edge<mw)for(let q=0;q<3;q++)img.data[k+q]=m[q]+n*.4;else{const sh=b[3]*(edge<mw+2.5?.82:1);for(let q=0;q<3;q++)img.data[k+q]=b[2][q]*sh+n;}img.data[k+3]=255;}
  c.putImageData(img,0,0);},{repeat:true});}
 const rubbleTex=stoneTex(41,9,['#8e8b84','#7d7a73','#9a968d','#6f6d68','#a8a296'],'#c9c5bb',1.6);
 const flagTex=stoneTex(57,7,['#a8855f','#94765a','#b99c78','#7f6a55','#c2a784','#8c7b6b'],'#efe9dc',2.4);
 const slatTex=paintTex(256,256,(c,w)=>{const r=rng(9);for(let i=0;i<16;i++){const t=r();c.fillStyle=`rgb(${104+t*18|0},${70+t*12|0},${48+t*9|0})`;c.fillRect(i*16,0,16,w);c.fillStyle='#3b2618';c.fillRect(i*16+14,0,2,w);}for(let i=0;i<2500;i++){c.fillStyle=`rgba(40,22,12,${r()*.12})`;c.fillRect(r()*w,r()*w,1,6+r()*14);}},{repeat:true});
 const deckTex=paintTex(256,256,(c,w)=>{const r=rng(13);for(let j=0;j<18;j++){const y=j*w/18;for(let x=-((j*53)%120);x<w;x+=120+((j*31)%60)){const t=r();c.fillStyle=`rgb(${120+t*22|0},${80+t*14|0},${60+t*10|0})`;c.fillRect(x,y,118+((j*31)%60),w/18-1.6);}}for(let i=0;i<3000;i++){c.fillStyle=`rgba(50,28,18,${r()*.1})`;c.fillRect(r()*w,r()*w,10+r()*20,1);}},{repeat:true});
 const tileTex=paintTex(256,256,(c,w)=>{const r=rng(21);c.fillStyle='#5e2716';c.fillRect(0,0,w,w);const cw=w/10,rh=w/8;for(let row=0;row<8;row++)for(let col=0;col<10;col++){const x=col*cw,y=row*rh,t=r(),gr=c.createLinearGradient(x,0,x+cw,0);
   const base=[184+t*20,86+t*16,48+t*10];gr.addColorStop(0,`rgb(${base[0]*.55|0},${base[1]*.55|0},${base[2]*.55|0})`);gr.addColorStop(.45,`rgb(${base[0]|0},${base[1]|0},${base[2]|0})`);gr.addColorStop(.62,`rgb(${Math.min(255,base[0]*1.14)|0},${base[1]*1.12|0},${base[2]*1.1|0})`);gr.addColorStop(1,`rgb(${base[0]*.5|0},${base[1]*.5|0},${base[2]*.5|0})`);
   c.fillStyle=gr;c.fillRect(x+1,y+2,cw-2,rh-2);c.fillStyle='rgba(40,14,6,.55)';c.fillRect(x,y,cw,3);}},{repeat:true});
 const speckle=(base,dots,seed)=>paintTex(128,128,(c,w)=>{const r=rng(seed);c.fillStyle=base;c.fillRect(0,0,w,w);for(let i=0;i<3500;i++){c.fillStyle=dots[Math.floor(r()*dots.length)];c.fillRect(r()*w,r()*w,1+r()*1.5,1+r()*1.5);}},{repeat:true});
 const resinTex=speckle('#cdc2ae',['#e6dccb','#a99b86','#bfb09a','#8f8270'],3),gravelTex=speckle('#565f6b',['#79828d','#3c434c','#8b939c','#4a525c'],4),stuccoTex=speckle('#edebe5',['#f6f4ef','#e2dfd7','#e8e5de'],5),floorTex=paintTex(128,128,(c,w)=>{c.fillStyle='#d8d3c7';c.fillRect(0,0,w,w);c.strokeStyle='#b8b2a5';c.lineWidth=2;for(let i=0;i<=w;i+=w/2){c.beginPath();c.moveTo(i,0);c.lineTo(i,w);c.stroke();c.beginPath();c.moveTo(0,i);c.lineTo(w,i);c.stroke();}},{repeat:true});
 const winTex=paintTex(256,192,(c,w,h)=>{const gr=c.createLinearGradient(0,0,0,h);gr.addColorStop(0,'#ffe2ad');gr.addColorStop(.55,'#f4bf73');gr.addColorStop(1,'#c8813e');c.fillStyle=gr;c.fillRect(0,0,w,h);
  c.fillStyle='#f7ecd6';c.fillRect(w*.1,h*.62,w*.46,h*.2);c.fillStyle='#8a5a36';c.fillRect(w*.1,h*.52,w*.46,h*.1);c.fillStyle='#fff3d8';c.beginPath();c.arc(w*.75,h*.34,h*.1,0,Math.PI*2);c.fill();c.fillStyle='#6d4a30';c.fillRect(w*.72,h*.44,w*.06,h*.4);
  c.fillStyle='#2a2b2d';c.fillRect(0,0,w,7);c.fillRect(0,h-7,w,7);c.fillRect(0,0,7,h);c.fillRect(w-7,0,7,h);c.fillRect(w/2-3,0,6,h);});
 // ---- materials ----
 const M=(c,o={})=>StdMat({color:c,roughness:.85,side:THREE.DoubleSide,...o});
 const mStucco=M('#ffffff',{map:stuccoTex}),mNavy=M('#223044'),mSlat=M('#ffffff',{map:slatTex,roughness:.75}),mRubble=M('#ffffff',{map:rubbleTex,roughness:.95}),mFlag=M('#ffffff',{map:flagTex,roughness:.95}),
  mTile=M('#ffffff',{map:tileTex,roughness:.7}),mTileCap=M('#8a3b21',{roughness:.7}),mDeck=M('#ffffff',{map:deckTex,roughness:.8}),mResin=M('#ffffff',{map:resinTex}),mGravel=M('#ffffff',{map:gravelTex}),mFloor=M('#ffffff',{map:floorTex}),
  mApron=M('#a9a99f'),mCoping=M('#c9c4b8'),mFrame=M('#2c2e31',{roughness:.5}),mFrameRed=M('#6e2c1f',{roughness:.6}),mFascia=M('#4a4e52',{roughness:.6}),mStep=M('#ddd8cc'),mPlanter=M('#ebe8e0'),
  mShrubRed=M('#8d3c26'),mShrubOchre=M('#9a6a36'),mShrubGreen=M('#56683a'),mPine=M('#3b5a33'),mTrunk=M('#5b4636'),mGranite=M('#bd8e78'),mRattan=M('#a9763d'),mWood=M('#6b4a30'),mMetal=M('#26282b',{roughness:.45,metalness:.5}),mRedFlower=M('#c93a24'),
  mWater=M('#17344d',{roughness:.06,metalness:.45}),mGlass=StdMat({color:'#cfeee9',transparent:true,opacity:.26,roughness:.05,metalness:.1,side:THREE.DoubleSide,depthWrite:false}),
  mGlassEdge=M('#8fe0d2',{emissive:'#7fe7d6',emissiveIntensity:.55}),mLED=M('#ffb24a',{emissive:'#ff9f2e',emissiveIntensity:2.2}),mSconce=M('#ffdca0',{emissive:'#ffc46b',emissiveIntensity:1.8}),
  mWin=StdMat({map:winTex,emissive:'#ffffff',emissiveMap:winTex,emissiveIntensity:.8,roughness:.25,side:THREE.DoubleSide});
 // ---- merged builders (local frame: x = u along the facade, y = height above the road datum, z = -v into the hill) ----
 const kit=new Map(),add=(geo,m)=>{if(!kit.has(m))kit.set(m,[]);kit.get(m).push(geo.index?geo.toNonIndexed():geo);};
 function bx(m,u0,u1,y0,y1,v0,v1,tm=2){if(u1-u0<1e-3||y1-y0<1e-3||v1-v0<1e-3)return;const w=u1-u0,h=y1-y0,d=v1-v0,geo=new THREE.BoxGeometry(w,h,d),uv=geo.attributes.uv,dims=[[d,h,v0,y0],[d,h,v0,y0],[w,d,u0,v0],[w,d,u0,v0],[w,h,u0,y0],[w,h,u0,y0]];
  for(let f=0;f<6;f++)for(let k=0;k<4;k++){const i=f*4+k;uv.setXY(i,(uv.getX(i)*dims[f][0]+dims[f][2])/tm,(uv.getY(i)*dims[f][1]+dims[f][3])/tm);}geo.translate((u0+u1)/2,(y0+y1)/2,-(v0+v1)/2);add(geo,m);}
 const P3=([u,y,v])=>[u,y,-v];
 function qd(m,a,b,c,d,uv=[[0,0],[1,0],[1,1],[0,1]]){const geo=new THREE.BufferGeometry(),p=[a,b,c,a,c,d].map(P3).flat(),t=[0,1,2,0,2,3].map(i=>uv[i]).flat();geo.setAttribute('position',new THREE.Float32BufferAttribute(p,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(t,2));geo.computeVertexNormals();add(geo,m);}
 function tri(m,a,b,c,uv=[[0,0],[1,0],[.5,1]]){const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute([a,b,c].map(P3).flat(),3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(uv.flat(),2));geo.computeVertexNormals();add(geo,m);}
 const fp=(m,u0,u1,y0,y1,v)=>{const geo=new THREE.PlaneGeometry(u1-u0,y1-y0);geo.translate((u0+u1)/2,(y0+y1)/2,-v);add(geo,m);};           // faces the road (+z)
 const sp=(m,u,v0,v1,y0,y1,dir)=>{const geo=new THREE.PlaneGeometry(v1-v0,y1-y0);geo.rotateY(dir*Math.PI/2);geo.translate(u,(y0+y1)/2,-(v0+v1)/2);add(geo,m);}; // faces ±x
 const cyl=(m,u,y0,v,r,h,seg=12,r2=r)=>{const geo=new THREE.CylinderGeometry(r2,r,h,seg);geo.translate(u,y0+h/2,-v);add(geo,m);};
 const blob=(m,u,y,v,rx,ry,rz)=>{const geo=new THREE.SphereGeometry(1,10,7);geo.scale(rx,ry,rz);geo.translate(u,y,-v);add(geo,m);};
 const shrubs=(u0,u1,y,v,depth=.5)=>{const r=rng(Math.round(u0*97+v*13));for(let u=u0+.3;u<u1-.1;u+=.55)blob(r()<.7?mShrubRed:mShrubOchre,u,y+.22,v+(r()-.5)*depth*.4,.38,.3+r()*.12,depth*.55);};
 const planter=(u0,u1,y,v0,v1,h=.55)=>{bx(mPlanter,u0,u1,y,y+h,v0,v1);shrubs(u0,u1,y+h,(v0+v1)/2,v1-v0);};
 function rail(pts,y0s,h=1.05){for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],ya=y0s[i-1],yb=y0s[i];qd(mGlass,[a[0],ya,a[1]],[b[0],yb,b[1]],[b[0],yb+h,b[1]],[a[0],ya+h,a[1]]);
   const geo=new THREE.BoxGeometry(1,1,1),dx=b[0]-a[0],dv=b[1]-a[1],len=Math.hypot(dx,dv);geo.scale(len,.035,.05);geo.rotateY(Math.atan2(dv,dx));geo.rotateZ(0);geo.translate((a[0]+b[0])/2,(ya+yb)/2+h,-(a[1]+b[1])/2);add(geo,mGlassEdge);}}
 const railLine=(u0,v0,u1,v1,y,h)=>rail([[u0,v0],[u1,v1]],[y,y],h);
 function chair(u,y,v,m=mRattan){cyl(m,u,y,v,.3,.42,10,.26);blob(m,u,y+.62,v+.18,.3,.28,.12);}
 function table(u,y,v,r=.45){cyl(mMetal,u,y,v,.05,.7,6);cyl(mWood,u,y+.7,v,r,.05,16);}
 function light(u,y,v,w=.12,h=.35,face=1){bx(mSconce,u-w/2,u+w/2,y,y+h,v-.02,v+.04*face);}
 // ---- levels ----
 const L2=4.2,L3=8.4,PAT=.6,LOB=Math.min(E(32)+.45,0),WB=6.5,PR=24.5,ST=27.3,L0=38,AX1=44.3,TRU=36.6,TRV=3.65,P0=E(AX1),TE=L2+1.4; // AX1: east gable; TRU/TRV: tea-room west end / front; P0: car park at the gable; TE: pine terrace
 // road apron between the road ribbon and the lodge, with its front and end faces down to the hidden terrain
 for(let u=0;u<AX1-1e-6;u+=1){const u1=Math.min(AX1,u+1),a=E(u),b=E(u1);qd(mApron,[u,a,1.2],[u1,b,1.2],[u1,b,FR],[u,a,FR],[[u/2,.6],[u1/2,.6],[u1/2,-.4],[u/2,-.4]]);qd(mApron,[u,BOT,FR],[u1,BOT,FR],[u1,b,FR],[u,a,FR]);}
 qd(mApron,[0,BOT,1.2],[0,BOT,FR],[0,E(0),FR],[0,E(0),1.2]);
 // Level 1 — white corner block
 bx(mNavy,0,WB,BOT,.38,1,8.5);bx(mStucco,0,WB,.38,3.95,1,8.5,4);bx(mCoping,-.05,WB+.05,3.95,L2,.95,8.5);bx(mResin,0,WB,L2,L2+.02,1,8.5);
 for(const c of[1.85,4.65]){fp(mWin,c-1.1,c+1.1,.95,3.0,.99);bx(mFrame,c-1.16,c+1.16,.89,.95,.94,1);bx(mFrame,c-1.16,c+1.16,3.0,3.06,.94,1);}
 light(3.25,2.1,.97,.12,.32);light(.35,2.1,.97,.12,.32);light(WB-.35,2.1,.97,.12,.32);
 sp(mWin,-.01,4.2,6.4,1.0,2.9,-1);
 railLine(0,1.02,WB,1.02,L2,1.05);railLine(.02,1,.02,8.5,L2,1.05);railLine(WB-.02,1,WB-.02,4.6,L2,1.05);
 cyl(mPlanter,1.5,L2,2.6,.78,.5,24);blob(mShrubRed,1.5,L2+.75,2.6,.62,.36,.62);chair(3.6,L2,2.2,mMetal);chair(4.6,L2,2.5,mMetal);table(4.1,L2,3.2,.3);
 // Level 1 — five patio rooms: rubble front wall and wing walls, stone patios, timber-clad rooms with glass doors, canopy
 bx(mRubble,WB,PR,BOT,PAT,1.2,4.6,3);bx(mFloor,WB,PR,PAT,PAT+.04,1.75,4.6);bx(mRubble,WB,PR,PAT,PAT+1.05,1.2,1.75,3);bx(mCoping,WB-.05,PR,PAT+1.05,PAT+1.15,1.15,1.8);
 const RW=(PR-WB)/5;
 for(let k=0;k<5;k++){const c=WB+(k+.5)*RW;fp(mWin,c-1.15,c+1.15,PAT+.08,PAT+2.6,4.52);bx(mFrame,c-1.2,c+1.2,PAT+2.6,PAT+2.68,4.5,4.56);bx(mFrame,c-.03,c+.03,PAT+.08,PAT+2.6,4.49,4.53);
  chair(c-.75,PAT,3.0);chair(c+.75,PAT,3.0);table(c,PAT,2.6,.28);if(k)bx(mRubble,WB+k*RW-.2,WB+k*RW+.2,PAT,PAT+1.75,1.75,4.5,3);}
 bx(mStucco,WB,PR,PAT,3.9,4.6,10.5,4);bx(mSlat,WB,PR,PAT,3.62,4.52,4.6);
 qd(mSlat,[WB,3.85,4.6],[PR,3.85,4.6],[PR,3.62,3.0],[WB,3.62,3.0],[[0,0],[9,0],[9,.8],[0,.8]]);bx(mWood,WB,PR,3.44,3.64,2.95,3.05);bx(mLED,WB,PR,3.4,3.45,2.98,3.06);
 bx(mCoping,WB,PR,3.9,L2,4.45,10.5);
 // Level 1 — gate piers and the straight lit stair up to level 2
 const S0=E(25.9),SN=Math.ceil((L2-S0)/.165),SR=(L2-S0)/SN,SV=1.3+SN*.28;
 for(let i=0;i<SN;i++){const v=1.3+i*.28,top=S0+(i+1)*SR;bx(mStep,PR+.4,ST-.4,BOT,top,v,v+.28);bx(mLED,PR+.4,ST-.4,top-.07,top-.035,v-.02,v+.01);bx(mStucco,PR,PR+.4,BOT,top+.95,v,v+.28,4);bx(mStucco,ST-.4,ST,BOT,top+.18,v,v+.28,4);}
 rail([[ST-.2,1.3],[ST-.2,SV]],[S0+.18,L2+.18],.95);
 bx(mStucco,PR-.3,PR+.4,E(24.6)-.2,PAT+2.3,.3,1.3,4);bx(mStucco,ST-.4,ST+.3,E(27.4)-.2,PAT+2.3,.3,1.3,4);bx(mCoping,PR-.35,PR+.45,PAT+2.3,PAT+2.4,.25,1.35);bx(mCoping,ST-.45,ST+.35,PAT+2.3,PAT+2.4,.25,1.35);
 // Level 1 — lobby: raised forecourt behind a rubble wall, timber-clad glass front, fascia with LED
 const EN=[29,30.8],ES=Math.max(0,Math.ceil((LOB-E(29.9))/.16)),ER=ES?(LOB-E(29.9))/ES:0,EV=1.2+ES*.3;
 bx(mRubble,ST,EN[0],BOT,LOB,1.2,5.6,3);bx(mRubble,EN[1],TRU,BOT,LOB,1.2,5.6,3);bx(mRubble,EN[0],EN[1],BOT,LOB,EV,5.6,3);
 for(let i=0;i<ES;i++){const v=1.2+i*.3;bx(mStep,EN[0],EN[1],BOT,E(29.9)+(i+1)*ER,v,v+.3);}
 bx(mFloor,ST,TRU,LOB,LOB+.04,1.75,5.6);bx(mRubble,ST,EN[0],LOB,LOB+.85,1.2,1.7,3);bx(mRubble,EN[1],TRU-.9,LOB,LOB+.85,1.2,1.7,3);bx(mCoping,ST,EN[0],LOB+.85,LOB+.95,1.15,1.75);bx(mCoping,EN[1],TRU-.9,LOB+.85,LOB+.95,1.15,1.75);
 bx(mStucco,ST,AX1,LOB,3.9,5.6,12.5,4);bx(mSlat,ST,TRU,LOB,3.9,5.52,5.6);
 const GH=Math.min(3.5,3.6-LOB-.2);
 for(const[a,b]of[[27.9,31.3],[31.9,35.9]]){fp(mWin,a,b,LOB+.05,LOB+GH,5.5);bx(mFrame,a-.05,b+.05,LOB+GH,LOB+GH+.07,5.47,5.53);for(let x=a+(b-a)/3;x<b-.1;x+=(b-a)/3)bx(mFrame,x-.03,x+.03,LOB+.05,LOB+GH,5.46,5.5);}
 for(const x of[32.3,33.1,33.9]){cyl(mMetal,x,LOB,4.9,.03,.9,5);blob(mRedFlower,x,LOB+1.05,4.9,.28,.34,.28);}
 bx(mFascia,ST,TRU,3.9,L2+.05,5.42,5.6);bx(mLED,ST,TRU,3.86,3.9,5.44,5.52);
 // Level 2 mass: the solid terrace behind level 1 (its exposed faces are retaining walls)
 bx(mRubble,0,WB,BOT,L2,8.5,DP,3);bx(mRubble,WB,PR,BOT,L2,10.5,DP,3);bx(mRubble,PR,ST,BOT,L2,SV,DP,3);bx(mRubble,ST,L0,BOT,L2,12.5,DP,3);
 bx(mResin,0,4,L2,L2+.03,8.5,14.8);
 // Level 2 — clay-tile hall: white walls, four big windows in red-brown frames, LED under the eave, gable roof
 const TH=[4,18.5],TV=[5.2,14.2],EAV=7.8,RISE=2.6,RV=(TV[0]+TV[1])/2,RT=EAV+RISE,SL=RISE/((TV[1]-TV[0])/2),OVE=.6,OVG=.35;
 const roofY=v=>RT-SL*(v-RV),VR=RV+(RT-L3)/SL,PU=[9.9,13.1],PV=[VR+.2,VR+3.4],PB=PV[1]+.2;
 planter(WB+.1,TH[1]-.1,L2,4.5,5.15,.5);
 bx(mStucco,TH[0],TH[1],L2,EAV,TV[0],TV[1],4);
 for(let k=0;k<4;k++){const c=TH[0]+(k+.5)*(TH[1]-TH[0])/4;fp(mWin,c-1.3,c+1.3,L2+.45,L2+2.85,TV[0]-.02);
  bx(mFrameRed,c-1.42,c+1.42,L2+.33,L2+.45,TV[0]-.08,TV[0]);bx(mFrameRed,c-1.42,c+1.42,L2+2.85,L2+2.97,TV[0]-.08,TV[0]);bx(mFrameRed,c-1.42,c-1.3,L2+.45,L2+2.85,TV[0]-.08,TV[0]);bx(mFrameRed,c+1.3,c+1.42,L2+.45,L2+2.85,TV[0]-.08,TV[0]);
  bx(mFrame,c-.03,c+.03,L2+.45,L2+2.85,TV[0]-.06,TV[0]-.02);bx(mFrame,c-1.3,c+1.3,L2+2.2,L2+2.25,TV[0]-.06,TV[0]-.02);if(k<3)light(TH[0]+(k+1)*(TH[1]-TH[0])/4,L2+1.9,TV[0]-.03,.12,.34);}
 bx(mFrameRed,TH[0],TH[1],EAV-.5,EAV-.12,TV[0]-.08,TV[0]);bx(mLED,TH[0],TH[1],EAV-.12,EAV-.06,TV[0]-.12,TV[0]-.02);
 sp(mWin,TH[0]-.01,8.6,10.8,L2+.8,L2+2.6,-1);
 {const eY=EAV-SL*OVE,u0=TH[0]-OVG,u1=TH[1]+OVG,len=(u1-u0)/2,sl=Math.hypot(RV-TV[0]+OVE,RT-eY)/2;
  qd(mTile,[u0,eY,TV[0]-OVE],[u1,eY,TV[0]-OVE],[u1,RT,RV],[u0,RT,RV],[[0,sl],[len,sl],[len,0],[0,0]]);
  qd(mTile,[u1,eY,TV[1]+OVE],[u0,eY,TV[1]+OVE],[u0,RT,RV],[u1,RT,RV],[[len,sl],[0,sl],[0,0],[len,0]]);
  qd(mTileCap,[u0,eY-.14,TV[0]-OVE],[u1,eY-.14,TV[0]-OVE],[u1,eY,TV[0]-OVE],[u0,eY,TV[0]-OVE]);qd(mTileCap,[u1,eY-.14,TV[1]+OVE],[u0,eY-.14,TV[1]+OVE],[u0,eY,TV[1]+OVE],[u1,eY,TV[1]+OVE]);
  const rc=new THREE.CylinderGeometry(.17,.17,u1-u0+.3,10);rc.rotateZ(Math.PI/2);rc.translate((u0+u1)/2,RT+.06,-RV);add(rc,mTileCap);
  for(const[u,s]of[[u0-.1,-1],[u1+.1,1]]){const t=new THREE.BoxGeometry(.7,.24,.3);t.rotateZ(s*.55);t.translate(u+s*.12,RT+.25,-RV);add(t,mTileCap);}
  // white gables with a dark tile coping and the upturned eave tips seen on the hall
  for(const u of TH){tri(mStucco,[u,EAV,TV[0]],[u,EAV,TV[1]],[u,RT,RV]);
   for(const[vA,vB]of[[TV[0]-OVE,RV],[TV[1]+OVE,RV]]){const ya=EAV-SL*OVE,off=u===TH[0]?-OVG:OVG;qd(mTileCap,[u+off,ya,vA],[u+off,RT,vB],[u+off,RT+.2,vB],[u+off,ya+.2,vA]);}
   for(const vv of[TV[0]-OVE,TV[1]+OVE]){const t=new THREE.BoxGeometry(.28,.5,.28),s=u===TH[0]?-1:1;t.rotateZ(s*.5);t.translate(u+s*(OVG+.1),EAV-SL*OVE+.25,-vv);add(t,mTileCap);}}
  // wooden bleachers on the back slope, LED under each seat, the centre left open so the tiles show (owner's photos)
  for(const[a,b,tiers]of[[6,10.4,3],[12.6,17,3],[10.4,12.6,1]])for(let k=3-tiers;k<3;k++){const vf=VR-.8*k,vb=vf-.8,top=roofY(vb)+.35;bx(mSlat,a,b,roofY(vf)-.2,top-.05,vb,vf,1);bx(mDeck,a-.03,b+.03,top-.06,top,vb-.02,vf+.05);bx(mLED,a,b,top-.13,top-.08,vf+.01,vf+.05);}
  for(const u of[8.2,14.8])light(u,L3+.6,VR+.02,.14,.22);
  // Level 3 floor over the lower roof slope, then the reflecting pool, planters, deck and resin paving behind
  bx(mDeck,TH[0],PU[0],L3-.3,L3+.03,VR,TV[1]+OVE);bx(mDeck,PU[1],TH[1],L3-.3,L3+.03,VR,TV[1]+OVE);bx(mDeck,PU[0],PU[1],L3-.3,L3+.03,VR,PV[0]);
  bx(mWater,PU[0],PU[1],L3-.6,L3-.08,PV[0],PV[1]);bx(mCoping,PU[0]-.2,PU[1]+.2,L3-.1,L3+.06,PV[1],PV[1]+.2);bx(mCoping,PU[0]-.2,PU[0],L3-.1,L3+.06,PV[0],PV[1]);bx(mCoping,PU[1],PU[1]+.2,L3-.1,L3+.06,PV[0],PV[1]);
  planter(7.4,PU[0]-.3,L3,PV[1]-.6,PV[1]+.9,.6);planter(PU[1]+.3,15.6,L3,PV[1]-.6,PV[1]+.9,.6);}
 // Level 3 mass and paving
 const CS=[35.3,37.3];
 bx(mFlag,0,PU[0]-.2,L2,L3,TV[1]+OVE,DP,3);bx(mFlag,PU[1]+.2,CS[0],L2,L3,TV[1]+OVE,DP,3);bx(mFlag,PU[0]-.2,PU[1]+.2,L2,L3,PB,DP,3);bx(mFlag,PU[0]-.2,PU[1]+.2,L2,L3-.6,TV[1]+OVE,PB,3);
 bx(mFlag,TH[1],20.5,L2,L3,12.5,TV[1]+OVE,3);
 bx(mResin,0,PU[0]-.2,L3,L3+.03,TV[1]+OVE,DP);bx(mResin,PU[1]+.2,CS[0],L3,L3+.03,TV[1]+OVE,DP);bx(mResin,PU[0]-.2,PU[1]+.2,L3,L3+.03,PB,DP);bx(mResin,TH[1],20.5,L3,L3+.03,12.5,TV[1]+OVE);
 bx(mDeck,15.8,18.3,L3+.02,L3+.05,TV[1]+OVE,DP-1);
 railLine(0,TV[1]+OVE+.02,TH[0],TV[1]+OVE+.02,L3,1.05);
 // swing seat and a table set on the terrace (owner's photos)
 {const su=2.4,sv=19.5;for(const a of[-1,1])for(const b of[-1,1]){const t=new THREE.BoxGeometry(.06,2.3,.06);t.rotateX(b*.18);t.translate(su+a*1.0,L3+1.1,-(sv+b*.2));add(t,mMetal);}
  bx(mMetal,su-1.05,su+1.05,L3+2.2,L3+2.26,sv-.05,sv+.05);qd(mFascia,[su-1.2,L3+2.35,sv-.8],[su+1.2,L3+2.35,sv-.8],[su+1.2,L3+2.1,sv+.8],[su-1.2,L3+2.1,sv+.8]);bx(mFascia,su-.8,su+.8,L3+.55,L3+.7,sv-.25,sv+.25);}
 table(6.5,L3,21.5,.45);chair(5.8,L3,21.5,mMetal);chair(7.2,L3,21.5,mMetal);
 // Level 2 — timber deck and bonsai garden in front of the flat-roofed white block
 bx(mDeck,TH[1],PR,L2,L2+.05,4.6,12.5);bx(mDeck,PR,ST,L2,L2+.05,SV,12.5);bx(mDeck,ST,AX1,L2,L2+.05,5.6,12.5);bx(mDeck,TRU,AX1,L2,L2+.05,TRV,5.6);
 railLine(TH[1],4.62,PR,4.62,L2,1.05);rail([[ST,5.62],[TRU,5.62],[TRU,TRV+.02],[AX1-.02,TRV+.02],[AX1-.02,12.5]],[L2,L2,L2,L2,L2],1.05);
 {const bu=21.6,bv=9.3;cyl(mTrunk,bu,L2,bv,.16,1.6,8,.2);const tt=new THREE.CylinderGeometry(.09,.13,1.4,6);tt.rotateZ(.7);tt.translate(bu+.45,L2+1.7,-bv);add(tt,mTrunk);
  for(const[du,dy,dv,rx]of[[-.6,1.2,.1,1.0],[.5,1.7,-.1,1.15],[1.2,2.25,.2,.9],[-.1,2.45,0,.95],[.3,3.0,.05,.7]])blob(mPine,bu+du,L2+dy,bv+dv,rx,.22,rx*.8);
  bx(mStucco,bu-1.3,bu+1.3,L2,L2+.4,bv-1.3,bv+1.3,4);blob(mShrubRed,bu+.9,L2+.55,bv+.9,.5,.3,.45);blob(mShrubOchre,bu-.8,L2+.55,bv+.8,.45,.28,.4);}
 bx(mGravel,23.5,33.5,L2+.03,L2+.08,9.1,11.2,1.5);for(const u of[25.2,28.6,32])for(const v of[9.4,10.2,11.0])bx(mFloor,u-.45,u+.45,L2+.05,L2+.11,v-.28,v+.28,1);
 planter(19,22.8,L2,11.4,12.3);planter(24.6,28.4,L2+.02,11.55,12.3);planter(30.2,33.8,L2+.02,11.55,12.3);
 for(const u of[26.2,31.2])bx(mGranite,u,u+1.7,L2+.05,L2+.5,7.25,7.7,1);
 {const r=new THREE.CylinderGeometry(.62,.72,.1,9);r.translate(28.9,L2+.72,-7.5);add(r,mWood);cyl(mWood,28.9,L2+.05,7.5,.18,.67,7);}
 table(34.6,L2+.05,8.2,.4);chair(33.9,L2+.05,8.2,mMetal);chair(35.3,L2+.05,8.2,mMetal);table(36.7,L2+.05,10.2,.4);chair(36,L2+.05,10.2,mMetal);chair(37.4,L2+.05,10.2,mMetal);table(41.3,L2+.05,8.4,.45);chair(40.6,L2+.05,8.4,mMetal);chair(42,L2+.05,8.4,mMetal);table(39.2,L2+.05,5.0,.4);chair(38.5,L2+.05,5.0,mMetal);chair(39.9,L2+.05,5.0,mMetal);
 // Level 2 — flat-roofed white block: glass doors, slim wall lights, deep dark fascia with an LED line and downlights
 const MB=[20.5,35],MV=[12.5,18],MT=7.6;
 bx(mStucco,MB[0],MB[1],L2,MT,MV[0],MV[1],4);bx(mFascia,MB[0],MB[1],L2,L2+.14,MV[0]-.06,MV[0]);
 for(const[a,b]of[[21.3,23.9],[25.5,28.1],[29.3,33.3]]){fp(mWin,a,b,L2+.08,L2+2.75,MV[0]-.02);bx(mFrame,a-.06,b+.06,L2+2.75,L2+2.83,MV[0]-.07,MV[0]);bx(mFrame,a-.06,a,L2+.08,L2+2.75,MV[0]-.07,MV[0]);bx(mFrame,b,b+.06,L2+.08,L2+2.75,MV[0]-.07,MV[0]);bx(mFrame,(a+b)/2-.03,(a+b)/2+.03,L2+.08,L2+2.75,MV[0]-.06,MV[0]-.02);}
 for(const u of[24.7,28.7,34.1])light(u,L2+1.3,MV[0]-.03,.06,1.3);
 bx(mFascia,MB[0]-.3,MB[1]+.3,MT,L3,MV[0]-1,MV[1]+.2);bx(mLED,MB[0]-.3,MB[1]+.3,MT-.05,MT,MV[0]-1,MV[0]-.94);bx(mLED,MB[0]-.3,MB[0]-.24,MT-.05,MT,MV[0]-1,MV[1]);
 for(let u=MB[0]+1;u<MB[1];u+=2.4)bx(mSconce,u-.09,u+.09,MT-.03,MT,MV[0]-.62,MV[0]-.44);
 bx(mResin,MB[0],MB[1],L3,L3+.03,MV[0]-1,MV[1]);
 {const pts=[[TH[1],12.52],[MB[0]-.3,12.52]];for(let k=1;k<=8;k++){const t=k/8*Math.PI/2;pts.push([MB[0]-.3+2.2*Math.sin(t),MV[0]-.98+1.0*Math.cos(t)]);}pts.push([MB[1]+.3,MV[0]-.98]);rail(pts,pts.map(()=>L3),1.05);} // curved glass corner (owner's aerial photo)
 table(24,L3+.03,14.5,.45);chair(23.3,L3+.03,14.5,mMetal);chair(24.7,L3+.03,14.5,mMetal);table(30,L3+.03,15.2,.45);chair(29.3,L3+.03,15.2,mMetal);chair(30.7,L3+.03,15.2,mMetal);
 // ---- East end, rebuilt from the owner's photos and aerial (2026-09-27). The tea room is the east end of the lobby block
 // and projects ~2 m towards the road (TRV); the level-2 timber deck runs over it to the east gable (AX1). That gable is
 // white on a navy plinth and faces EAST onto the car park: 居之林 plaque by the south corner, two windows, slim wall
 // lights, AC unit and meter box. The entry stair runs down along the tea room's front (flagstone base, timber cladding,
 // big wood-framed window) from a tiled landing at forecourt level to the car park, inside a granite-block cheek wall
 // topped with little stone monks. North of the gable a two-tier rubble retaining wall faces the car park and curves
 // round to the east, with the lit 居之林 sign on its white parapet. Behind it the pine terrace (TE, one landing above the
 // deck): the curved lit stair climbs to it from the deck past a rock garden, and a straight flight along the flagstone
 // wall continues to level 3.
 const mAsphalt=M('#34363a',{roughness:.95}),mLine=M('#e9e7df',{roughness:.8}),mNavyB=M('#2b3440'),mGraniteG=M('#a8a39a',{roughness:.95}),mGranBlk=M('#bdb2a0',{roughness:.95}),mTileL=M('#ddd6c8',{roughness:.8}),
  mCar=M('#c9cdd1',{roughness:.35,metalness:.12}),mCarGlass=M('#1f262c',{roughness:.1,metalness:.3}),mTyre=M('#18191b'),mCharger=M('#f2f3f1',{roughness:.4}),mBlue=M('#3f7dff',{emissive:'#3d78ff',emissiveIntensity:1.6}),
  mBark=M('#4c3a2c',{roughness:1}),mPineA=M('#2e4b2c',{roughness:.95}),mPineB=M('#3a5b35',{roughness:.95}),mPineC=M('#4a6c3f',{roughness:.95}),mMonk=M('#5d5a55',{roughness:.7}),mWoodFrame=M('#a8743f',{roughness:.6}),
  mSoffit=M('#eeebe4'),mRock=M('#6c6a66',{roughness:.9}),mGrass=M('#5f7a3e',{roughness:1}),mMeter=M('#b9bbb8',{roughness:.5}),
  mLanR=M('#d2311f',{emissive:'#8a150a',emissiveIntensity:.55,roughness:.6}),mLanO=M('#e67a2c',{emissive:'#8a3a0c',emissiveIntensity:.5,roughness:.6}),mLanY=M('#e8c74c',{emissive:'#7d6414',emissiveIntensity:.45,roughness:.6});
 const stick=(m,a,b,r0,r1=r0)=>{const A=new THREE.Vector3(a[0],a[1],-a[2]),B=new THREE.Vector3(b[0],b[1],-b[2]),dir=B.clone().sub(A),len=dir.length(),geo=new THREE.CylinderGeometry(r1,r0,len,7);
  geo.translate(0,len/2,0);geo.applyQuaternion(new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir.normalize()));geo.translate(A.x,A.y,A.z);add(geo,m);};
 const plateMat=(tex,emissive=0)=>StdMat({map:tex,roughness:.55,emissive:emissive?'#ffffff':'#000000',emissiveMap:emissive?tex:null,emissiveIntensity:emissive,side:THREE.DoubleSide});
 const plate=(tex,u0,u1,y0,y1,v,{emissive=0}={})=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(u1-u0,y1-y0),plateMat(tex,emissive));m.position.set((u0+u1)/2,(y0+y1)/2,-v+.01);g.add(m);return m;};  // faces the road (-v)
 const eastPlate=(tex,u,v0,v1,y0,y1,{emissive=0}={})=>{const m=new THREE.Mesh(new THREE.PlaneGeometry(v1-v0,y1-y0),plateMat(tex,emissive));m.rotation.y=Math.PI/2;m.position.set(u,(y0+y1)/2,-(v0+v1)/2);g.add(m);return m;}; // faces +u
 const CAL='"Xingkai SC","STXingkai","Kaiti SC","STKaiti","KaiTi",serif';
 const Pk=u=>E(u)+.03,HL=P0+3.3,HU=L2-.9,WN=12.5,VN=19.9; // WN: face of the car park's north retaining wall
 // ---- tea room: projecting front (TRV) over a flagstone base, timber cladding, wood-framed window, door to the forecourt
 const EN_N=Math.max(1,Math.ceil((LOB-P0)/.165)),EN_R=(LOB-P0)/EN_N,EN_T=.38,EN_H=AX1-EN_N*EN_T; // entry stair: steps, rise, tread, head
 bx(mStucco,TRU,AX1,LOB,3.9,TRV,5.6,4);bx(mRubble,TRU,AX1-.42,BOT,LOB,TRV,5.6,3);
 bx(mFlag,TRU,AX1-.01,BOT,LOB+.06,TRV-.08,TRV,2);bx(mSlat,TRU,AX1,LOB+.06,3.9,TRV-.08,TRV,1);bx(mSlat,TRU-.08,TRU,LOB,3.9,TRV,5.6,1);
 {const w0=EN_H+.35,w1=AX1-1.35;fp(mWin,w0,w1,LOB+.45,LOB+2.85,TRV-.1);
  for(const[a,b,y0,y1]of[[w0-.15,w1+.15,LOB+.3,LOB+.45],[w0-.15,w1+.15,LOB+2.85,LOB+3.0],[w0-.15,w0,LOB+.3,LOB+3.0],[w1,w1+.15,LOB+.3,LOB+3.0],[(w0+w1)/2-.05,(w0+w1)/2+.05,LOB+.45,LOB+2.85]])bx(mWoodFrame,a,b,y0,y1,TRV-.17,TRV-.08);
  bx(mFrame,w0-.25,w1+.25,LOB+.2,LOB+3.1,TRV-.1,TRV-.08);
  for(const u of[TRU+.8,AX1-.6])bx(mSconce,u-.03,u+.03,LOB+1.2,LOB+2.6,TRV-.12,TRV-.08);}
 sp(mWin,TRU-.09,TRV+.35,TRV+1.45,LOB+.05,LOB+2.55,-1);bx(mFrame,TRU-.12,TRU-.08,LOB+2.55,LOB+2.65,TRV+.3,TRV+1.5);
 plate(paintTex(128,72,(c,w,h)=>{c.fillStyle='#1d3f6e';c.fillRect(0,0,w,h);c.fillStyle='#fff';c.font=`600 18px "PingFang SC",sans-serif`;c.textAlign='center';c.fillText('凤形新村',w/2,28);c.font=`700 28px "PingFang SC",sans-serif`;c.fillText('19',w/2,62);}),AX1-.55,AX1-.2,LOB+.1,LOB+.32,TRV-.1);
 // deep eave over the tea room: dark fascia, white soffit, LED line (the deck above carries on to the gable)
 bx(mFascia,TRU,AX1,3.9,L2+.05,TRV-.35,TRV);bx(mSoffit,TRU,AX1,3.88,3.9,TRV-.33,TRV);bx(mLED,TRU,AX1,3.84,3.88,TRV-.35,TRV-.3);
 // ---- entry stair along the tea room, tiled landing, granite cheek wall with stone monks, pier with lattice lantern
 for(let i=0;i<EN_N;i++){const u1=AX1-i*EN_T,u0=u1-EN_T,y=P0+(i+1)*EN_R;bx(mGraniteG,u0,u1+.02,BOT,y,1.75,TRV,1);bx(mFrame,u0,u0+.025,y-.03,y+.004,1.75,TRV);}
 bx(mTileL,TRU,EN_H,LOB,LOB+.04,1.75,TRV,1);bx(mRubble,TRU,EN_H,BOT,LOB,1.75,TRV,3);
 {const topAt=u=>u<=EN_H?LOB+.9:P0+(Math.floor((AX1-u)/EN_T)+1)*EN_R+.9,rb=rng(733);
  for(let u=TRU-.9;u<AX1-.01;u+=.62){const u1=Math.min(AX1,u+.6),tp=topAt(Math.min(u+.3,AX1-.01))+(rb()-.5)*.06;bx(rb()<.5?mGranBlk:mGraniteG,u,u1,BOT,tp,1.2,1.75,1);bx(mCoping,u-.01,u1+.01,tp,tp+.07,1.18,1.77);}
  for(const[u,s]of[[EN_H-.8,1],[EN_H+.5,.8],[EN_H+2.6,1],[AX1-.9,.8]]){const y=topAt(u)+.07;cyl(mMonk,u,y,1.48,.16*s,.32*s,10,.12*s);blob(mMonk,u,y+.42*s,1.48,.13*s,.15*s,.13*s);}}
 {const pu=EN_H-1.45;bx(mStucco,pu,pu+.55,LOB,LOB+1.35,TRV-.6,TRV-.05,4);bx(mSconce,pu+.04,pu+.51,LOB+1.35,LOB+1.8,TRV-.56,TRV-.09);bx(mFrame,pu,pu+.55,LOB+1.8,LOB+1.86,TRV-.6,TRV-.05);
  for(const d of[.14,.27,.4])bx(mFrame,pu+d,pu+d+.02,LOB+1.36,LOB+1.79,TRV-.61,TRV-.59);
  bx(mPlanter,pu+.65,EN_H,LOB,LOB+.4,TRV-.55,TRV-.05);for(let u=pu+.8;u<EN_H-.1;u+=.33)blob(mShrubGreen,u,LOB+.72,TRV-.3,.3,.38,.26);
  cyl(mTrunk,EN_H-.35,LOB+.4,TRV-.3,.05,1.4,6);for(const[du,dy]of[[0,1.9],[.2,1.6],[-.2,1.7]])blob(mShrubGreen,EN_H-.35+du,LOB+dy,TRV-.3,.35,.45,.3);}
 // ---- east gable: white on a navy plinth, plaque with its lamp, two windows, wall lights, AC, meter box, downpipe
 bx(mNavyB,AX1-.4,AX1,BOT,P0+1.25,TRV,12.5);bx(mStucco,AX1-.4,AX1,P0+1.25,LOB,TRV,12.5,4);
 bx(mFascia,AX1-.35,AX1+.12,3.9,L2+.05,TRV,12.5);bx(mLED,AX1+.08,AX1+.13,3.86,3.9,TRV,12.5);
 eastPlate(paintTex(200,250,(c,w,h)=>{c.fillStyle='#24211e';c.fillRect(0,0,w,h);c.strokeStyle='#4a443c';c.lineWidth=4;c.strokeRect(6,6,w-12,h-12);c.fillStyle='#d8b56a';c.font=`70px ${CAL}`;c.textAlign='center';c.textBaseline='middle';c.fillText('居',w*.4,h*.24);c.fillText('之',w*.62,h*.5);c.fillText('林',w*.42,h*.76);c.font='10px sans-serif';c.fillText('JU ZHI LIN',w*.24,h*.5);}),AX1+.02,TRV+.3,TRV+1.2,P0+1.75,P0+2.85);
 bx(mFascia,AX1,AX1+.16,P0+2.95,P0+3.07,TRV+.6,TRV+.9);
 for(const[a,b]of[[TRV+2.0,TRV+4.2],[TRV+4.8,TRV+6.4]]){sp(mWin,AX1+.01,a,b,P0+2.4,P0+4.7,1);for(const[v0,v1,y0,y1]of[[a-.06,b+.06,P0+2.34,P0+2.4],[a-.06,b+.06,P0+4.7,P0+4.76],[a-.06,a,P0+2.4,P0+4.7],[b,b+.06,P0+2.4,P0+4.7],[(a+b)/2-.03,(a+b)/2+.03,P0+2.4,P0+4.7]])bx(mFrame,AX1,AX1+.07,y0,y1,v0,v1);}
 for(const v of[TRV+1.6,TRV+4.5,TRV+6.8])bx(mSconce,AX1,AX1+.05,P0+2.6,P0+4.2,v-.03,v+.03);
 bx(mCharger,AX1,AX1+.3,P0+2.5,P0+3.05,TRV+7.3,TRV+7.95);eastPlate(paintTex(96,64,(c,w,h)=>{c.fillStyle='#e9eae7';c.fillRect(0,0,w,h);c.fillStyle='#55585a';c.beginPath();c.arc(w*.42,h/2,h*.4,0,Math.PI*2);c.fill();c.strokeStyle='#e9eae7';c.lineWidth=2;for(let q=4;q<h*.4;q+=4){c.beginPath();c.arc(w*.42,h/2,q,0,Math.PI*2);c.stroke();}}),AX1+.31,TRV+7.32,TRV+7.93,P0+2.52,P0+3.03);
 bx(mMeter,AX1,AX1+.2,P0+.85,P0+1.95,TRV+7.4,TRV+8.0);cyl(mStucco,AX1+.08,BOT,TRV+.1,.055,L2-BOT-.3,8);
 // ---- car park (faces south, user 2026-09-27): asphalt from the road edge up to the north retaining wall, one row of
 // bays square to that wall, cars reversed in nose-south; the EV charger is on the wall right under the lit sign.
 const frm=q=>[(q[0]-O[0])*U[0]+(q[1]-O[1])*U[1],(q[0]-O[0])*V[0]+(q[1]-O[1])*V[1]];
 const roadN=u=>{let e=-1e9;for(const r of G.roads){if(['footway','path','steps','pedestrian'].includes(r.kind))continue;for(let i=1;i<r.pts.length;i++){const a=frm(r.pts[i-1]),b=frm(r.pts[i]);if((a[0]-u)*(b[0]-u)>0||a[0]===b[0])continue;const v=a[1]+(b[1]-a[1])*(u-a[0])/(b[0]-a[0]);if(v>-10&&v<8)e=Math.max(e,v+r.width/2);}}return e;};
 const VF=u=>Math.max(FR,roadN(u)-.3); // the lot meets the road ribbon where the road bends north at the east end
 for(let u=AX1;u<L-1e-6;u+=.5){const u1=Math.min(L,u+.5),fa=VF(u),fb=VF(u1);qd(mAsphalt,[u,Pk(u),WN],[u1,Pk(u1),WN],[u1,Pk(u1),fb],[u,Pk(u),fa],[[u/2,WN/2],[u1/2,WN/2],[u1/2,fb/2],[u/2,fa/2]]);qd(mApron,[u,BOT,fa],[u1,BOT,fb],[u1,Pk(u1),fb],[u,Pk(u),fa]);}
 qd(mApron,[L,BOT,VF(L)],[L,BOT,WN],[L,Pk(L),WN],[L,Pk(L),VF(L)]);
 const BAYS=[44.6,47.2,49.8,52.4,55.0,57.6],VB=WN-5.3,CH=BAYS[1];
 for(const u of BAYS)qd(mLine,[u-.06,Pk(u)+.02,WN-.05],[u+.06,Pk(u)+.02,WN-.05],[u+.06,Pk(u)+.02,VB],[u-.06,Pk(u)+.02,VB]);
 for(let u=BAYS[0]-.06;u<BAYS.at(-1)+.06-1e-6;u+=.5){const w=Math.min(BAYS.at(-1)+.06,u+.5);qd(mLine,[u,Pk(u)+.02,VB+.06],[w,Pk(w)+.02,VB+.06],[w,Pk(w)+.02,VB-.06],[u,Pk(u)+.02,VB-.06]);}
 // silver SUV reversed into the bay east of the charger, nose to the road
 {const cu=CH+1.3,hw=.95,vR=WN-.4,vN=vR-4.7,y=Pk(cu);
  bx(mCar,cu-hw,cu+hw,y+.34,y+1.0,vN,vR);bx(mCar,cu-hw+.04,cu+hw-.04,y+.5,y+.98,vN-.02,vN+.3);
  bx(mCarGlass,cu-hw+.1,cu+hw-.1,y+1.0,y+1.56,vN+1.45,vR-.5);bx(mCar,cu-hw+.14,cu+hw-.14,y+1.56,y+1.64,vN+1.5,vR-.55);
  qd(mCarGlass,[cu-hw+.1,y+1.0,vN+.85],[cu+hw-.1,y+1.0,vN+.85],[cu+hw-.14,y+1.56,vN+1.45],[cu-hw+.14,y+1.56,vN+1.45]);bx(mLED,cu-hw+.2,cu+hw-.2,y+.84,y+.88,vN-.03,vN);
  for(const uu of[cu-hw+.04,cu+hw-.04])for(const vv of[vN+.95,vR-.95]){const w=new THREE.CylinderGeometry(.37,.37,.26,16);w.rotateZ(Math.PI/2);w.translate(uu,y+.37,-vv);add(w,mTyre);}
  // wall-mounted charger (white box, small screen, blue light), white conduit along the wall base, cable to the car
  const cy=Pk(CH);bx(mCharger,CH-.3,CH+.3,cy+.45,cy+1.2,WN-.28,WN);bx(mCarGlass,CH-.1,CH+.1,cy+.88,cy+1.06,WN-.3,WN-.28);bx(mBlue,CH-.26,CH-.22,cy+.52,cy+1.1,WN-.3,WN-.28);
  stick(mStucco,[AX1,Pk(AX1)+.14,WN-.08],[CH-.3,cy+.14,WN-.08],.045);
  stick(mTyre,[CH+.22,cy+.52,WN-.3],[CH+.55,cy+.08,WN-.9],.02);stick(mTyre,[CH+.55,cy+.08,WN-.9],[cu-hw,y+.8,vR-.7],.02);}
 // ---- two-tier rubble retaining wall along the north side of the car park, white parapet on top, glass rail
 const WU=WN+.32,WP=WN+.58;
 bx(mRubble,AX1,L,BOT,HL,WN,WU,2.4);bx(mCoping,AX1,L,HL,HL+.08,WN-.05,WU);bx(mRubble,AX1,L,HL,HU,WU,WP,2.4);
 bx(mStucco,AX1,L,HU,TE+.1,WU,WP,4);bx(mCoping,AX1,L,TE+.1,TE+.18,WU-.04,WP+.04);
 rail([[38,12.52],[AX1,12.52],[AX1,WP+.02],[L,WP+.02]],[TE+.1,TE+.1,TE+.1,TE+.1],1.05);
 // the lit sign on the white parapet right above the charger, the phone / slogan strip just below, two wall lamps
 {bx(mFascia,CH-1.85,CH+1.85,HU+.62,HU+1.72,WU-.1,WU);
  plate(paintTex(512,176,(c,w,h)=>{c.fillStyle='#141414';c.fillRect(0,0,w,h);c.strokeStyle='#3a3a3a';c.lineWidth=6;c.strokeRect(3,3,w-6,h-6);c.fillStyle='#fbfbf6';c.shadowColor='#ffffff';c.shadowBlur=10;c.font=`120px ${CAL}`;c.textAlign='center';c.textBaseline='middle';c.fillText('居之林',w/2,h/2+6);}),CH-1.75,CH+1.75,HU+.67,HU+1.67,WU-.11,{emissive:.9});
  bx(mFascia,CH-2.6,CH+2.6,HU+.1,HU+.5,WU-.06,WU);
  plate(paintTex(700,52,(c,w,h)=>{c.fillStyle='#101318';c.fillRect(0,0,w,h);c.fillStyle='#f5f7ff';c.shadowColor='#bcd0ff';c.shadowBlur=6;c.font=`700 30px "PingFang SC",sans-serif`;c.textBaseline='middle';c.fillText('173 5664 8281',18,h/2+1);c.fillStyle='#3a3e46';c.fillRect(262,6,4,h-12);c.fillStyle='#f5f7ff';c.font=`700 32px "PingFang SC",sans-serif`;c.fillText('隐于山林  归于自然',290,h/2+1);}),CH-2.5,CH+2.5,HU+.13,HU+.47,WU-.07,{emissive:1});
  for(const u of[CH-1.9,CH+1.9])bx(mSconce,u-.08,u+.08,HU-.8,HU-.5,WU-.06,WU);}
 // ---- pine terrace (TE): white faces towards the deck, paving, table set with a folded parasol, benches
 bx(mRubble,38,AX1,BOT,TE,12.5,VN,3);bx(mStucco,38,AX1,L2,TE+.1,12.42,12.5,4);bx(mStucco,37.92,38,L2,TE+.1,12.5,14.1,4);
 bx(mRubble,CS[0],38,BOT,TE,15.3,VN,3);bx(mStucco,CS[0],38,L2,TE+.1,15.22,15.3,4);
 bx(mResin,CS[0],38,TE,TE+.03,15.3,VN);bx(mResin,38,AX1,TE,TE+.03,12.5,VN);bx(mRubble,AX1,L,BOT,TE,WP,VN,3);bx(mResin,AX1,L,TE,TE+.03,WP,VN);
 rail([[38,14.1],[38,12.52]],[TE+.1,TE+.1],1.05);rail([[CS[0],15.32],[37.2,15.32]],[TE+.1,TE+.1],1.05);
 table(42.2,TE+.03,13.7,.45);chair(41.5,TE+.03,13.7,mWood);chair(42.9,TE+.03,13.7,mWood);cyl(mMetal,43.1,TE+.03,14.9,.03,2.2,6);cyl(mSoffit,43.1,TE+1.2,14.9,.02,1.1,10,.13);
 for(const[a,b,v]of[[39,40.8,17.2],[45.4,47.2,19.3]])bx(mGranite,a,b,TE+.03,TE+.48,v,v+.45,1);table(51.5,TE+.03,15.6,.45);chair(50.8,TE+.03,15.6,mWood);chair(52.2,TE+.03,15.6,mWood);
 // ---- curved lit stair from the deck up to the terrace, rock garden beside it
 bx(mDeck,CS[0]-.3,38,L2,L2+.05,12.5,15.3);
 {const n=Math.max(1,Math.ceil((TE-L2)/.16)),rs=(TE-L2)/n,path=t=>[36.4+1.6*(1-Math.cos(Math.PI*t/2)),12.0+2.35*Math.sin(Math.PI*t/2)],sides=[[],[]],ys=[];
  for(let i=0;i<n;i++){const a=path(i/n),b=path((i+1)/n),top=L2+(i+1)*rs,c=[(a[0]+b[0])/2,(a[1]+b[1])/2],len=Math.hypot(b[0]-a[0],b[1]-a[1]),geo=new THREE.BoxGeometry(1.4,top-L2+.3,Math.max(.28,len));
   geo.translate(0,-(top-L2+.3)/2,0);geo.rotateY(Math.atan2(b[0]-a[0],-(b[1]-a[1])));geo.translate(c[0],top,-c[1]);add(geo,mStep);
   const led=new THREE.BoxGeometry(1.36,.035,.03);led.rotateY(Math.atan2(b[0]-a[0],-(b[1]-a[1])));led.translate(a[0],top-.06,-a[1]);add(led,mLED);
   const nx=-(b[1]-a[1])/len,nz=(b[0]-a[0])/len;for(const s of[0,1])sides[s].push([c[0]+(s?1:-1)*.72*nx,c[1]+(s?1:-1)*.72*nz]);ys.push(top);}
  for(const s of[0,1])rail(sides[s],ys.map(y=>y+.05),1.0);}
 for(const[u,v,s]of[[35.55,13.0,.7],[35.75,14.2,.9],[36.2,15.0,.55]])blob(mRock,u,L2+s*.5,v,s,s*.7,s*.8);
 bx(mGrass,CS[0]-.3,36.2,L2+.05,L2+.08,12.6,15.2);cyl(mTrunk,35.5,L2,14.8,.06,1.6,6);blob(mShrubRed,35.5,L2+1.9,14.8,.55,.6,.5);
 // ---- straight lit flight along the flagstone wall from the terrace to level 3
 {const n=Math.max(1,Math.ceil((L3-TE)/.165)),rs=(L3-TE)/n,t=.28,ub=CS[0]+n*t;
  for(let i=0;i<n;i++){const u1=ub-i*t,u0=u1-t,y=TE+(i+1)*rs;bx(mStep,u0,u1,TE,y,18.45,VN-.02,1);bx(mLED,u0-.01,u0+.01,y-.07,y-.04,18.47,VN-.05);}
  rail([[ub,18.43],[CS[0],18.43]],[TE+.05,L3+.05],1.0);}
 // ---- level 3 north of the terrace; its flagstone face carries a lamp
 bx(mFlag,CS[0],L,BOT,L3,VN,DP,3);bx(mResin,CS[0],L,L3,L3+.03,VN,DP);railLine(CS[0],VN+.02,L,VN+.02,L3,1.05);planter(37.5,43.9,L3,VN+.4,VN+1.3);planter(47.7,56,L3,VN+.4,VN+1.3);light(45.5,TE+2.6,VN-.03,.22,.4);
 // ---- the big pine on level 3 (user 2026-09-27: its root is on the top terrace above the sign), 黄山松 form: straight
 // trunk, tiered flat crown, ~17 m, with strings of red, orange and yellow lanterns
 {const pu=45.8,pv=21.3,r=rng(1771),Hn=17,PB=L3;cyl(mFlag,pu,PB,pv,1.1,.35,20);stick(mBark,[pu,PB,pv],[pu+.35,PB+Hn*.86,pv-.25],.55,.16);
  const tiers=[[4.8,5.4],[6.6,6.0],[8.4,5.6],[10.2,4.9],[11.9,4.1],[13.5,3.1],[15,2.1],[16.3,1.1]],hang=[];
  for(const[hh,rr]of tiers){const n=Math.max(3,Math.round(rr*1.7)),cu=pu+hh*.02,cv=pv-hh*.015;
   // irregular, overlapping needle clumps: each tier is a ragged ring of ellipsoids, lighter on top, darker underneath
   for(let k=0;k<n*2;k++){const a=k/(n*2)*Math.PI*2+r()*.9,d=rr*(.25+.6*r()),x=cu+Math.cos(a)*d,z=cv+Math.sin(a)*d*.9,y=PB+hh+(r()-.3)*.9,s=rr*(.22+.16*r())+.55;
    blob(r()<.35?mPineA:mPineB,x,y,z,s,.75+.55*r(),s*(.85+.3*r()));if(r()<.5)blob(mPineC,x+(r()-.5)*.8,y+.55,z+(r()-.5)*.8,s*.6,.45+.3*r(),s*.55);
    if(hh<12&&k%2)stick(mBark,[cu,y-.3,cv],[cu+(x-cu)*.8,y-.1,cv+(z-cv)*.8],.12,.06);
    if(hh<9&&k%2)hang.push([x-Math.cos(a)*.6,y-.55,z-Math.sin(a)*.6]);}
   blob(mPineB,cu,PB+hh+.35,cv,rr*.4,.8,rr*.4);}
  const lan=[mLanR,mLanO,mLanY,mLanR,mLanO];
  for(const[x,y,z]of hang)for(let k=0,n=3+Math.floor(r()*3);k<n;k++){const rad=.24+.06*r();blob(lan[Math.floor(r()*lan.length)],x,y-.35-k*.62,z,rad,rad*.88,rad);}
  const ban=new THREE.Mesh(new THREE.PlaneGeometry(.5,2.2),plateMat(paintTex(96,420,(c,w,h)=>{c.fillStyle='#f3efe6';c.fillRect(0,0,w,h);c.fillStyle='#1b1b1b';c.font=`62px ${CAL}`;c.textAlign='center';c.textBaseline='middle';[...'无事小神仙'].forEach((ch,i)=>c.fillText(ch,w/2,48+i*80));})));
  ban.position.set(pu+2.3,PB+3.4,-(pv-2.4));ban.rotation.y=1.2;g.add(ban);}
 // back wall of the terraces: flagstone, timber cladding with a row of wall lamps
 bx(mPlanter,13.5,27,L3,L3+.45,DP-1.3,DP-.25);for(let u=13.8;u<26.8;u+=.62)blob(mShrubGreen,u,L3+.95,DP-.78,.42,.55,.42);for(const u of[16,16.9,17.8,18.7])chair(u,L3+.03,DP-2.1,mWood);
 bx(mSlat,5,27,L3,12.6,DP-.22,DP,1);bx(mFascia,5,27,12.6,12.72,DP-.3,DP);for(let u=6.5;u<27;u+=3)light(u,10.7,DP-.25,.22,.42);
 // retaining walls where the hillside outside the site stands above the terraces (left, right and back edges)
 const tops={left:v=>v<1?E(0):v<TV[1]+OVE?L2:L3,right:v=>v<WN?Pk(L):v<VN?TE:L3,back:()=>L3};
 const edge=(m,pts,topAt,dir)=>{for(let i=1;i<pts.length;i++){const[a,b]=[pts[i-1],pts[i]],ta=topAt(a),tb=topAt(b),ga=T(a[0],a[1]),gb=T(b[0],b[1]);if(Math.max(ga-ta,gb-tb)<.05)continue;
   const A=[a[0],Math.min(ta,ga)-.3,a[1]],B=[b[0],Math.min(tb,gb)-.3,b[1]],C=[b[0],Math.max(tb,gb)+.15,b[1]],Dd=[a[0],Math.max(ta,ga)+.15,a[1]],len=Math.hypot(b[0]-a[0],b[1]-a[1]),uvw=[[0,A[1]/3],[len/3,B[1]/3],[len/3,C[1]/3],[0,Dd[1]/3]];
   dir>0?qd(m,A,B,C,Dd,uvw):qd(m,B,A,Dd,C,uvw);const nx=-(b[1]-a[1])/len*.2,nv=(b[0]-a[0])/len*.2;qd(mCoping,[a[0]-nx,Dd[1],a[1]-nv],[b[0]-nx,C[1],b[1]-nv],[b[0]+nx,C[1],b[1]+nv],[a[0]+nx,Dd[1],a[1]+nv]);}}; // coping follows the slope
 const samp=(a,b,n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/1.25))=>[...Array(n+1)].map((_,k)=>[a[0]+(b[0]-a[0])*k/n,a[1]+(b[1]-a[1])*k/n]);
 edge(mFlag,samp([0,FR],[0,DP]),p=>tops.left(p[1]),1);edge(mRubble,samp([L,FR],[L,DP]),p=>tops.right(p[1]),-1);edge(mFlag,samp([0,DP],[L,DP]),()=>L3,1);
 for(const[m,list]of kit){let n=0;for(const q of list)n+=q.attributes.position.count;const pos=new Float32Array(n*3),nor=new Float32Array(n*3),uv=new Float32Array(n*2);let o=0;
  for(const q of list){pos.set(q.attributes.position.array,o*3);nor.set(q.attributes.normal.array,o*3);if(q.attributes.uv)uv.set(q.attributes.uv.array,o*2);o+=q.attributes.position.count;}
  const bg=new THREE.BufferGeometry();bg.setAttribute('position',new THREE.BufferAttribute(pos,3));bg.setAttribute('normal',new THREE.BufferAttribute(nor,3));bg.setAttribute('uv',new THREE.BufferAttribute(uv,2));bg.computeBoundingSphere();
  const mesh=new THREE.Mesh(bg,m);mesh.castShadow=!m.transparent&&m!==mLED&&m!==mSconce;mesh.receiveShadow=!m.transparent;g.add(mesh);}
 // The map pin that marks the client's guesthouse from anywhere on the mountain (scaled with camera distance in tick()).
 {const pin=new THREE.Group(),red=StdMat({color:'#c3302a',emissive:'#8f160f',emissiveIntensity:.55,roughness:.35}),head=new THREE.Mesh(new THREE.SphereGeometry(1.5,24,16),red),tip=new THREE.Mesh(new THREE.ConeGeometry(1.32,3.2,24),red),dot=new THREE.Mesh(new THREE.SphereGeometry(.62,16,12),StdMat({color:'#fff4dc',emissive:'#ffe3a8',emissiveIntensity:.6}));
  tip.rotation.x=Math.PI;tip.position.y=1.6;head.position.y=3.9;dot.position.set(0,3.9,1.2);pin.add(tip,head,dot);const c=W(25,11);pin.position.set(c[0],D+15.5,c[1]);pin.userData={base:D+15.5,head:5.4};decor.add(pin);featuredPin=pin;}
 landmarkTop.set(place.n,D+15.5+5.4);
 place.modelNote='三维模型按业主提供的实拍照片和航拍图建造：一层白色转角房、五间带石墙小院的客房、灯光直梯与玻璃门大堂；东头茶室临路一面为石材勒脚、木饰面和木框大窗，入户石阶沿茶室向西上到前院，外侧是大块花岗岩挡墙和小石僧像；茶室东山墙白墙深蓝勒脚，挂“居之林”竖匾，面朝停车场；停车场朝南，一排车位垂直于北侧两级毛石挡墙，车头朝南，充电桩挂在挡墙上、正上方是发光招牌“居之林”和“173 5664 8281　隐于山林 归于自然”；挡墙上方是有桌椅的平台，由二层木平台经弧形灯光楼梯上去，再沿石墙直梯上到三层，挂满灯笼的大松树长在三层；二层红陶瓦坡顶客房和平顶白色楼，前有罗汉松、白色花池、砾石汀步与木平台；三层屋顶露台有瓦屋面上的木质阶梯座、水景池和木格栅挡墙壁灯。尺寸按照片比例估计。';
}}
// Baisui is a unified multi-storey cliff compound, not a pagoda.
{const b=G.buildings.find(b=>b.osmId===541482372);if(b){const g=localGroup(...b.rectCenter,'百岁宫');g.position.y=b.base;g.rotation.y=Math.atan2(-b.axis[1],b.axis[0]);const w=b.width,d=b.depth;
 const roofB=new Batch(),outer=[[-w/2-1,-d/2-1],[w/2+1,-d/2-1],[w/2+1,d/2+1],[-w/2-1,d/2+1]],inner=[[-w*.14,-d*.20],[w*.14,-d*.20],[w*.14,d*.20],[-w*.14,d*.20]],mid=outer.map((p,i)=>[(p[0]+inner[i][0])*.5,(p[1]+inner[i][1])*.5]);
 const v=(p,h)=>[p[0],h,p[1]],eave=b.wallHeight+.4,ridge=eave+3.1;
 for(let i=0;i<4;i++){const j=(i+1)%4;roofB.quad(v(outer[i],eave),v(outer[j],eave),v(mid[j],ridge),v(mid[i],ridge));roofB.quad(v(mid[i],ridge),v(mid[j],ridge),v(inner[j],eave),v(inner[i],eave));
  line(g,[v(mid[i],ridge+.08),v(mid[j],ridge+.08)],'#4e564c');
 }
 roofB.mesh(mat('#636a60',{map:roofTex,side:THREE.DoubleSide}),g);
 const inside=new Batch();for(let i=0;i<4;i++){const j=(i+1)%4;inside.quad(v(inner[i],eave-4),v(inner[j],eave-4),v(inner[j],eave),v(inner[i],eave),'#c7c4b4');}inside.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),g);
 box(g,0,eave-4,0,w*.28,.15,d*.4,stone);
 for(const side of[-1,1])for(let l=1;l<5;l++)box(g,0,l*3,side*(d/2+.24),w,.2,.6,stone);
}}
// Additional characteristic architecture at mapped temple footprints. The eave overhang shrinks where another
// footprint is close, so these glazed roofs no longer cut into the neighbouring halls (祇园寺).
for(const id of[538484526,538484527,538484528,609990014,609990009]){const b=G.buildings.find(b=>b.osmId===id);if(!b)continue;const g=localGroup(...b.rectCenter,b.precinct);g.position.y=b.base;g.rotation.y=Math.atan2(-b.axis[1],b.axis[0]);const oh=clamp((b.eaveRoom??1.1)-.1,.3,1);roof(g,0,b.wallHeight+.3,0,b.width+2*oh,b.depth+2*oh,b.roofRise+.5,b.roofColor?.startsWith('#')?mat(b.roofColor,{roughness:.5,metalness:.1}):gold,{hip:true,upturn:true});for(let i=0;i<Math.round(b.width/3);i++)cylinder(g,-b.width/2+(i+.5)*3,0,b.depth/2+.25,.18,b.wallHeight,red);}
// 万佛塔: seven octagonal levels and bronze material; height 33m from official inventory.
{const b=G.buildings.find(b=>b.name==='万佛塔');if(b){const g=localGroup(...b.center,'万佛塔');g.position.y=b.base;for(let i=0;i<7;i++){const r=6.2-i*.51;cylinder(g,0,i*4.3,0,r,3.5,gold);const rg=new THREE.ConeGeometry(r+1.4,1.4,8),o=new THREE.Mesh(rg,gold);o.position.y=i*4.3+4;g.add(o);}cylinder(g,0,30,0,.36,3,gold);}}

// Roads, water, steps and bridge parapets are draped along the recorded centerlines.
function ribbon(pts,width,batch,col,lift=.22){const samples=[];for(let i=1;i<pts.length;i++){const a=pts[i-1],b=pts[i],dist=Math.hypot(b[0]-a[0],b[1]-a[1]),n=Math.max(1,Math.ceil(dist/5));for(let j=0;j<n;j++)samples.push([a[0]+(b[0]-a[0])*j/n,a[1]+(b[1]-a[1])*j/n]);}samples.push(pts.at(-1));for(let i=1;i<samples.length;i++){const a=samples[i-1],b=samples[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]);if(len<.001)continue;const nx=-(b[1]-a[1])/len*width/2,nz=(b[0]-a[0])/len*width/2;batch.quad([a[0]-nx,hAt(a[0]-nx,a[1]-nz)+lift,a[1]-nz],[b[0]-nx,hAt(b[0]-nx,b[1]-nz)+lift,b[1]-nz],[b[0]+nx,hAt(b[0]+nx,b[1]+nz)+lift,b[1]+nz],[a[0]+nx,hAt(a[0]+nx,a[1]+nz)+lift,a[1]+nz],col);}return samples;}
const roadB=new Batch(),trailB=new Batch(),waterB=new Batch(),markB=new Batch();
for(const r of G.roads){if(r.model==='stair')continue; // modelled above (三角洲车站台阶)
 const isTrail=['steps','path','footway'].includes(r.kind);const ss=ribbon(r.pts,r.width,isTrail?trailB:roadB,isTrail?'#b6b29b':'#879087',isTrail?.28:.25);
 if(r.kind==='primary'){for(let i=1;i<ss.length;i+=4)ribbon([ss[i-1],ss[i]],.11,markB,'#e5dcc0',.31);}
 if(r.kind==='steps'){for(let i=1;i<ss.length;i++){const a=ss[i-1],b=ss[i],len=Math.hypot(b[0]-a[0],b[1]-a[1]),nx=-(b[1]-a[1])/len,nz=(b[0]-a[0])/len;for(let t=0;t<1;t+=.16){const x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;line(trailGroup,[[x+nx*r.width*.45,hAt(x,z)+.38,z+nz*r.width*.45],[x-nx*r.width*.45,hAt(x,z)+.38,z-nz*r.width*.45]],'#828a7a');}}}
 if(r.bridge){for(const side of[-1,1]){const pts=r.pts.map((p,i)=>{const q=r.pts[Math.min(i+1,r.pts.length-1)]||p;const prev=r.pts[Math.max(0,i-1)],dx=q[0]-prev[0],dz=q[1]-prev[1],l=Math.hypot(dx,dz)||1;return[p[0]-dz/l*r.width/2*side,hAt(...p)+1.3,p[1]+dx/l*r.width/2*side];});line(decor,pts,'#ceccc0');}}
}
for(const w of G.water)ribbon(w.pts,w.kind==='river'?5:1.7,waterB,'#609492',.12);
roadB.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),world);trailB.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),trailGroup);waterB.mesh(mat('#ffffff',{vertexColors:true,roughness:.3,metalness:.12,side:THREE.DoubleSide}),world);markB.mesh(mat('#ffffff',{vertexColors:true,side:THREE.DoubleSide}),world);
for(const a of G.areas.filter(a=>a.kind==='water')){const batch=new Batch();for(const t of a.triangles)batch.tri(...t.map(p=>[p[0],hAt(...p)+.3,p[1]]),'#6b9290');batch.mesh(mat('#ffffff',{vertexColors:true,roughness:.25,side:THREE.DoubleSide}),world);}

$('#load-text').textContent='铺设山林、缆车与商家标记';await new Promise(requestAnimationFrame);
// Bamboo groves (竹海): the official 闵园 guide describes bamboo seas along 龙溪; groves are also common on mid slopes
// round the town. Density falls off with distance from the 闵园 villages; exact grove outlines are not mapped.
const minyuanPts=G.places.filter(p=>['上闵园','中闵园','下闵园','闵园'].includes(p.n)).map(p=>[p.x,p.z]);
function bambooZone(x,z,h,steep){if(h<420||h>1000||steep>1.1)return 0;let d=1e9;for(const[a,b]of minyuanPts)d=Math.min(d,Math.hypot(x-a,z-b));return d<900?.55:(h<760&&d<2600?.12:0);}
// Phones plant 6 600 trees, 30 % of the 22 000 they had (the owner's choice once the forest was measured, 2026-09-28);
// desktops keep 56 000.
const bamboo=[];const trees=[],rf=rng(892);const treeLimit=lowPower?6600:56000;
for(let i=0;i<treeLimit*2&&trees.length<treeLimit;i++){
 const x=(rf()-.5)*W*.998,z=(rf()-.5)*D*.998,h=hAt(x,z);
 if(blocked(x,z)||h<100||h>1310)continue;
 const steep=Math.hypot(hAt(x+10,z)-hAt(x-10,z),hAt(x,z+10)-hAt(x,z-10))/20;
 if(steep>1.7&&rf()<.84)continue;
 const s=6.5+rf()*6.7,bz=bambooZone(x,z,h,steep);if(bz&&rf()<bz){bamboo.push({x,z,h,s:9+rf()*4,r:rf()});continue;}trees.push({x,z,h,s,r:rf(),pine:rf()<.18+(h>800?.25:0)});
}
// The forest is cut into TILES×TILES blocks over the terrain, each with its own instanced trunks, broadleaf crowns, pine
// cones and bamboo, so a view of part of the mountain skips the blocks outside it. Tiers below 高清 use coarser shapes
// (20-triangle crowns, three-sided trunks, six-sided cones) and hide trunks from afar; low-power devices plant one plume
// per bamboo clump. A tier can thin every block (setForestDensity keeps a tree's trunk and crowns together); 流畅 and
// below hide the forest (applyTrees).
const TILES=3,tileOf=(x,z)=>Math.min(TILES-1,Math.max(0,Math.floor((x+W/2)/W*TILES)))*TILES+Math.min(TILES-1,Math.max(0,Math.floor((z+D/2)/D*TILES)));
function softBlob(){const g=new THREE.IcosahedronGeometry(1,0);g.deleteAttribute('normal');g.deleteAttribute('uv');const m=mergeVertices(g);m.setAttribute('normal',m.getAttribute('position').clone());return m;}
const S0=shapes(TIERS[tier].hiShapes);
const trunkMat=mat('#686854'),leafMat=mat('#ffffff'),pineMat=mat('#ffffff'),bambooMat=mat('#ffffff',{roughness:.85}),culms=lowPower?1:4,culmW=lowPower?1.35:1;
const forestTiles=[],tiles=[...Array(TILES*TILES)].map(()=>({list:[],bamboo:[]}));
for(const t of trees)tiles[tileOf(t.x,t.z)].list.push(t);for(const t of bamboo)tiles[tileOf(t.x,t.z)].bamboo.push(t);
const dummy=new THREE.Object3D(),tc=new THREE.Color();
const instanced=(geo,m,n,shadow)=>{if(!n)return null;const im=new THREE.InstancedMesh(geo,m,n);im.receiveShadow=shadow;forest.add(im);return im;};
for(const tile of tiles){
 const L=tile.list,leafPre=[0],pinePre=[0];for(const t of L){leafPre.push(leafPre.at(-1)+(t.pine?0:1));pinePre.push(pinePre.at(-1)+(t.pine?1:0));}
 const trunk=instanced(S0.trunk,trunkMat,L.length,false),crown=instanced(S0.leaf,leafMat,leafPre.at(-1)*2,true),cone=instanced(S0.pine,pineMat,pinePre.at(-1)*2,true),bam=instanced(S0.bamboo,bambooMat,tile.bamboo.length*culms,true);
 let ti=0,li=0,pi=0,k=0;
 for(const t of L){dummy.position.set(t.x,t.h+t.s*.35,t.z);dummy.rotation.set(0,t.r*6.28,0);dummy.scale.set(1,t.s*.7,1);dummy.updateMatrix();trunk.setMatrixAt(ti++,dummy.matrix);
  for(let j=0;j<2;j++){if(t.pine){dummy.position.set(t.x,t.h+t.s*(.68+j*.36),t.z);dummy.scale.set(t.s*(.5-j*.12),t.s*.91,t.s*(.5-j*.12));tc.set(t.r>.5?'#304f39':'#385842');dummy.updateMatrix();cone.setMatrixAt(pi,dummy.matrix);cone.setColorAt(pi++,tc);}else{dummy.position.set(t.x+(j?1.7:-1.1),t.h+t.s*(.67+j*.13),t.z+(j?-1.2:.9));dummy.scale.set(t.s*(.59-j*.04),t.s*(.40+j*.03),t.s*.57);tc.set(['#3e5b36','#4b663d','#38583d','#526b42'][Math.floor(t.r*4)]);dummy.updateMatrix();crown.setMatrixAt(li,dummy.matrix);crown.setColorAt(li++,tc);}}
 }
 // A grove reads as a few tall, soft, yellow-green plumes that lean outward (feathery 毛竹 canopy), lighter than broadleaf forest.
 for(const t of tile.bamboo)for(let c=0;c<culms;c++){const a=t.r*6.28+c*1.9,rr=c?2.2+((t.r*97+c*13)%1)*1.8:0;dummy.position.set(t.x+Math.cos(a)*rr,t.h+t.s*(.6-.05*c),t.z+Math.sin(a)*rr);dummy.rotation.set(Math.sin(a)*.22,0,Math.cos(a)*.22);dummy.scale.set((2.1+.4*((c*7)%3))*culmW,t.s*.46*(1-.06*c),(2.1+.4*((c*5)%3))*culmW);dummy.updateMatrix();bam.setMatrixAt(k,dummy.matrix);tc.set(['#76984c','#809f52','#6b8c47','#8aa65a'][(c+Math.floor(t.r*4))%4]);bam.setColorAt(k++,tc);}
 for(const m of[trunk,crown,cone,bam])if(m){m.instanceMatrix.needsUpdate=true;if(m.instanceColor)m.instanceColor.needsUpdate=true;m.computeBoundingSphere();}
 forestTiles.push({trunk,crown,cone,bam,n:L.length,leafPre,pinePre,nb:tile.bamboo.length});
}
function setForestDensity(f){for(const t of forestTiles){const K=Math.round(f*t.n);if(t.trunk)t.trunk.count=K;if(t.crown)t.crown.count=2*t.leafPre[K];if(t.cone)t.cone.count=2*t.pinePre[K];if(t.bam)t.bam.count=Math.round(f*t.nb)*culms;}}
// 山林植被: the tier decides whether the forest shows until the visitor flips the switch under 图层, whose choice then
// stands. The switch always shows the real state, so it is off when a slow phone has the forest turned off.
let treesChoice=null;
function applyTrees(){const T=TIERS[tier],on=treesChoice??(T.forest>0&&!emergency);forest.visible=on;$('#layer-trees').checked=on;if(on)setForestDensity(T.forest||1);}
function setShapes(hi){const S=shapes(hi);for(const t of forestTiles){if(t.trunk)t.trunk.geometry=S.trunk;if(t.crown)t.crown.geometry=S.leaf;if(t.cone)t.cone.geometry=S.pine;if(t.bam)t.bam.geometry=S.bamboo;}if(lanternMesh)lanternMesh.geometry=S.lantern;}
// Everything a tier controls that can change while the map is open (MSAA and the tree count are fixed at start-up).
function applyTier(){const T=TIERS[tier];resolution.setCeiling(resolutionCeiling(),true);syncResolution(false);labelsDirty=true;
 scene.traverse(o=>{if(o.isMesh&&o.material&&!Array.isArray(o.material))o.material=twinOf(o.material,T.pbr);});
 document.documentElement.classList.toggle('lite',!T.blur);setShapes(T.hiShapes);applyTrees();
 for(const t of forestTiles)if(t.bam)t.bam.visible=T.bamboo&&!emergency;labelCap=emergency?12:T.labelCap;
 const sh=shadows();if(renderer.shadowMap.enabled!==sh){renderer.shadowMap.enabled=sun.castShadow=sh;scene.traverse(o=>{if(o.material)for(const m of[].concat(o.material))m.needsUpdate=true;});}}

const movers=[];
for(const cable of G.cables){const a=cable.pts[0],b=cable.pts.at(-1),dist=Math.hypot(b[0]-a[0],b[1]-a[1]);const pts=[];
 for(let k=0;k<=90;k++){const t=k/90,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t,y=Math.max(hAt(x,z)+13,hAt(...a)*(1-t)+hAt(...b)*t+23-Math.sin(t*Math.PI)*dist*.017);pts.push(new THREE.Vector3(x,y,z));}
 const curve=new THREE.CatmullRomCurve3(pts),nx=-(b[1]-a[1])/dist*2,nz=(b[0]-a[0])/dist*2;
 for(const s of[-1,1])line(decor,pts.map(p=>[p.x+nx*s,p.y,p.z+nz*s]),'#3e514c');
 for(const t of[.2,.43,.67,.84]){const p=curve.getPoint(t),h=hAt(p.x,p.z);cylinder(decor,p.x,h,p.z,.6,p.y-h,stone);box(decor,p.x,p.y-1,p.z,10,.65,1.2,stone);}
 for(let i=0;i<6;i++){const g=new THREE.Group();box(g,0,0,0,3.6,2.6,2.4,red);box(g,0,1,0,3.7,1,2.45,glass);box(g,0,2.8,0,.2,3,.2,wood);decor.add(g);movers.push({g,curve,phase:i/6,kind:'cable'});}
}
for(const f of G.funicular){const pts=[];for(let i=1;i<f.pts.length;i++){const a=f.pts[i-1],b=f.pts[i],n=Math.ceil(Math.hypot(b[0]-a[0],b[1]-a[1])/3);for(let j=0;j<n;j++){const t=j/n,x=a[0]+(b[0]-a[0])*t,z=a[1]+(b[1]-a[1])*t;pts.push(new THREE.Vector3(x,hAt(x,z)+.8,z));}}const b=f.pts.at(-1);pts.push(new THREE.Vector3(b[0],hAt(...b)+.8,b[1]));
 const curve=new THREE.CatmullRomCurve3(pts);for(const s of[-1,1])line(decor,pts.map(p=>[p.x,p.y,p.z+s*.8]),'#dad8c3');const g=new THREE.Group();box(g,0,0,0,7,2.5,2.4,mat('#eee8d8'));box(g,0,.8,0,6.8,1.2,2.45,glass);box(g,0,2.3,0,7,.45,2.6,red);decor.add(g);movers.push({g,curve,phase:.4,kind:'funicular'});
}
for(const[parent,b]of lineBatches){const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(b.p,3));g.setAttribute('color',new THREE.Float32BufferAttribute(b.c,3));parent.add(new THREE.LineSegments(g,new THREE.LineBasicMaterial({vertexColors:true})));}
// Simple entrance landmark, placed from the user's circled screenshot and photo.
if(checkpointSite){const g=buildEntranceCheckpoint(checkpointSite,mat);built.add(g);detailedGroups.push(g);landmarkTop.set(checkpoint.n,checkpointSite.floor+7.5);}

// Hand-built landmarks (北门, 地藏禅寺, 居之林 …) are hundreds of small meshes, and on older phones it is the draw calls
// that hurt there. Within every group, static meshes that look the same (identical material settings) are merged into
// one mesh; groups, picking and the distance culling above stay as they were. Nothing changes materials at run time.
{const shared=new Map(),key=m=>[m.type,m.color?.getHexString(),m.emissive?.getHexString(),m.emissiveIntensity,m.roughness,m.metalness,m.opacity,m.transparent,m.side,m.map?.uuid,m.emissiveMap?.uuid,m.vertexColors,m.flatShading,m.depthWrite,m.depthTest,m.alphaTest,m.polygonOffset,m.polygonOffsetFactor,m.polygonOffsetUnits,m.fog,m.toneMapped].join('/');
 const same=m=>{const k=key(m);if(!shared.has(k))shared.set(k,m);return shared.get(k);};
 const mergeGroup=g=>{for(const c of[...g.children])if(!c.isMesh&&c.children.length)mergeGroup(c);
  const buckets=new Map();
  for(const o of g.children){if(!o.isMesh||o.isInstancedMesh||o.isSkinnedMesh||Array.isArray(o.material)||o.children.length||!o.visible||Object.keys(o.geometry.morphAttributes).length)continue;
   o.material=same(o.material);const geo=o.geometry,k=key(o.material)+'|'+Object.keys(geo.attributes).sort().join()+'|'+!!geo.index+'|'+o.castShadow+o.receiveShadow+'|'+o.renderOrder;
   if(!buckets.has(k))buckets.set(k,[]);buckets.get(k).push(o);}
  for(const list of buckets.values()){if(list.length<2)continue;
   const merged=mergeGeometries(list.map(o=>{if(o.matrixAutoUpdate)o.updateMatrix();return o.geometry.clone().applyMatrix4(o.matrix);}));if(!merged)continue;
   const m=new THREE.Mesh(merged,list[0].material);m.castShadow=list[0].castShadow;m.receiveShadow=list[0].receiveShadow;m.renderOrder=list[0].renderOrder;
   for(const o of list)g.remove(o);g.add(m);}};
 for(const g of built.children)if(g.isGroup)mergeGroup(g);}
for(const g of detailedGroups)pickables.push(g);

// Exact geometry at both distances. The near representation shares vertex buffers
// and culls 400 m tiles; the far representation keeps the original low draw count.
const spatialBatches=[];
if(renderer.capabilities.isWebGL2||renderer.extensions.has('OES_element_index_uint')){
 const targets=[terrain,...built.children.filter(o=>o.isMesh&&!o.isInstancedMesh&&!o.material.transparent&&!o.children.length&&o.geometry.attributes.position.count>3000)];
 for(const mesh of targets){const batch=createSpatialBatch(mesh);if(batch)spatialBatches.push(batch);}
}
// Mesh transforms are static; moving cable cars and the featured pin are groups.
// Parent/world matrices still update, including the height-exaggeration control.
world.traverse(o=>{if(o.isMesh){o.updateMatrix();o.matrixAutoUpdate=false;}});

const places=G.places.map(p=>({...p}));const byName=new Map(places.map(p=>[p.n,p]));const business=p=>['hotel','food','shop'].includes(p.category);const estimated=p=>p.quality?.startsWith('legacy')||['overture','unverified_listing','derived_area'].includes(p.quality);
let selected=null,category='all',search='',frame=0,visibleLabelCount=0,labelCap=null;
const icon={temple:'寺',hotel:'宿',food:'食',shop:'购',transport:'行',nature:'山',sight:'景',village:'村',service:'公'};
const GROUPS={temple:['temple'],sight:['sight','nature','village'],service:['service','transport']};
// Search covers temples, sights, place names and public facilities only (p.searchable, set in corrections.py); other
// businesses stay on the map but never come up in the directory or a search. The client's guesthouse is pinned first.
const featured=places.find(p=>p.featured);
const qualityText=p=>p.featured?'业主提供实拍 · 位置按门牌估计':p.qualityLabel||({converted_listing:'携程公开坐标 · 已换算',mapped:'OpenStreetMap 地图记录',multi_source:'多个平台坐标相互印证',platform_listing:'公开平台坐标 · 单一来源',unverified_listing:'单一平台收录 · 位置与营业状态待核',derived_area:'由门牌地址范围推算',overture:'公开地图记录 · 待复核',legacy_osm:'旧版地图点 · 待复核',user_confirmed:'用户实地确认'})[p.quality]||'旧版估计位置 · 待核';
const bGrid=new Map();for(const b of G.buildings){const k=Math.floor(b.center[0]/60)+','+Math.floor(b.center[1]/60);if(!bGrid.has(k))bGrid.set(k,[]);bGrid.get(k).push(b);}
function closestBuilding(p,max=20){let best=null,dist=max;const gx=Math.floor(p.x/60),gz=Math.floor(p.z/60);for(let i=-1;i<=1;i++)for(let j=-1;j<=1;j++)for(const b of bGrid.get((gx+i)+','+(gz+j))||[]){const d=Math.hypot(p.x-b.center[0],p.z-b.center[1]);if(d<dist){best=b;dist=d;}}return best;}
const buildingById=new Map(G.buildings.map(b=>[b.id,b]));
// Labels are created for every place but only attached to the scene while shown (≈1,200 places).
const HOUSE_SVG='<svg viewBox="0 0 24 24"><path d="M4 11.2 12 4.5l8 6.7V19a1 1 0 0 1-1 1h-4.6v-5.2H9.6V20H5a1 1 0 0 1-1-1z"/></svg>';
function makeLabel(p,cls,text,onClick){const el=node('div','maplabel '+cls);const btn=node('button','');btn.type='button';if(p.featured){const ic=node('span','lb-icon');ic.innerHTML=HOUSE_SVG;btn.append(ic);}btn.append(text);if(onClick)btn.onclick=onClick;else btn.tabIndex=-1;el.append(btn,node('i'));const label=new CSS2DObject(el);label.center.set(.5,1);p.label=label;p.el=el;
 const n=[...text].length;p.labelWidth=cls.includes('featured')?n*15+56:cls.includes('major')?n*15+36:cls.includes('small')||cls.includes('road')?n*10+24:n*11+30;return label;}
// Only temples, sights, place names and public facilities are labelled, plus 居之林; other businesses are not shown.
for(const p of places){if(!Number.isFinite(p.x)||!Number.isFinite(p.z)||!(p.searchable||p.featured))continue;
 const cls=(p.featured?'featured ':'')+'c-'+p.category+(p.p===1&&!p.featured?' major':'')+(estimated(p)?' estimated':'')+(p.category==='village'?' area':'');
 const label=makeLabel(p,cls,p.displayName||p.shortName||p.n,()=>selectPlace(p,true));
 const anchored=p.n==='百岁宫'?G.buildings.find(b=>b.osmId===541482372):null,b=anchored||(p.buildingId&&buildingById.get(p.buildingId))||closestBuilding(p,business(p)?12:35);
 p.top=landmarkTop.get(p.n)??(p.category==='village'?hAt(p.x,p.z)+40:b?b.base+b.wallHeight+b.roofRise:hAt(p.x,p.z)+(p.category==='temple'?22:business(p)?9:11));
 label.position.set(anchored?anchored.center[0]:p.x,p.top+5,anchored?anchored.center[1]:p.z);p.nearest=b;
 p.limit=p.featured?Infinity:p.p===1?9500:p.category==='village'?2600:business(p)?(p.quality==='unverified_listing'?650:1250):p.category==='temple'?3600:p.p<=2?3600:1900;}
// Temple halls (Qunar hall records near their parent temple) and road names: small labels at close range only.
const extraLabels=[];
for(const p of places)for(const h of p.halls||[]){const q={n:h.n,x:h.x,z:h.z,p:5,parent:p,limit:300,hall:true};makeLabel(q,'small hall',h.n,()=>selectPlace(p,false));q.top=hAt(h.x,h.z)+9;q.label.position.set(h.x,q.top+4,h.z);extraLabels.push(q);}
{const best=new Map();for(const r of G.roads){if(!r.name||r.pts.length<2)continue;let len=0;for(let i=1;i<r.pts.length;i++)len+=Math.hypot(r.pts[i][0]-r.pts[i-1][0],r.pts[i][1]-r.pts[i-1][1]);if(!best.has(r.name)||best.get(r.name).len<len)best.set(r.name,{r,len});}
 for(const[name,{r}]of best){const m=r.pts[Math.floor(r.pts.length/2)];const q={n:name,x:m[0],z:m[1],p:4,limit:2200,road:true};makeLabel(q,'road',name.replace(/\s*\(.*\)$/,''),null);q.top=hAt(m[0],m[1]);q.label.position.set(m[0],q.top+3,m[1]);extraLabels.push(q);}}
const labelPlaces=places.concat(extraLabels).filter(p=>p.label);


function pose(x,z,dist=900,az=145,pol=57){const target=new THREE.Vector3(x,hAt(x,z)*EX,z);const a=az*Math.PI/180,p=pol*Math.PI/180;return{target,pos:target.clone().add(new THREE.Vector3(-Math.sin(a)*dist*Math.sin(p),dist*Math.cos(p),Math.cos(a)*dist*Math.sin(p)))};}
let routes=null,started=false;const frameHooks=[]; // routes: set up after the panel; frameHooks run each frame before the controls
const cameraFlight=createCameraFlight(camera,controls,{reducedMotion:reduce});
function fly(to,ms=1200,onDone=null,arrivalDelay=0){routes?.stopPreview();cameraFlight.move(to,ms,onDone,arrivalDelay);if(started)syncViewShift();}
// Longer hops take a little longer so the move never feels rushed.
const flightMs=to=>clamp(900+camera.position.distanceTo(to.pos)*.35,1100,2400);
// The view from before a card first moved the camera (the destination if a flight is under way); closing the card eases back to it.
let homePose=null;
function saveHome(){const to=cameraFlight.destination;homePose??={pos:(to?to.pos:camera.position).clone(),target:(to?to.target:controls.target).clone(),view:$('.viewbar button.active')?.dataset.view};}
function flyHome(){const h=homePose;homePose=null;if(!h)return;fly(h,Math.round(flightMs(h)*1.2));$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===h.view));syncSeg();}
const heading=()=>{const d=controls.target.clone().sub(camera.position);return Math.atan2(d.x,-d.z)*180/Math.PI;};
// The guesthouse is always shown from the road (front). On desktop the target sits 22 m roadside so the lodge shows above
// the bottom card; phones aim at the lodge itself, since their sheets already shift the map centre clear (syncViewShift).
function featuredPose(dist=mobile?220:160){const a=15*Math.PI/180,off=mobile?0:22,x=featured.x-Math.sin(a)*off,z=featured.z+Math.cos(a)*off;return pose(x,z,dist,15,57);}
function placePose(p,near=false){if(p.model?.kind==='entrance-checkpoint'&&checkpointSite)return pose(p.x,p.z,near?(mobile?82:62):(mobile?150:110),checkpointSite.viewAzimuth,near?75:59);return pose(p.x,p.z,p.category==='temple'?(near?210:400):(near?135:300),heading(),near?65:57);}
function syncSeg(){const nav=$('.viewbar'),a=nav.querySelector('button.active');if(!a){nav.style.setProperty('--ind-o',0);return;}nav.style.setProperty('--ind-x',a.offsetLeft-4+'px');nav.style.setProperty('--ind-w',a.offsetWidth+'px');nav.style.setProperty('--ind-o',1);}
function clearViews(){$$('[data-view]').forEach(b=>b.classList.remove('active'));syncSeg();}
function view(name){homePose=null;const poses={town:()=>pose(-1390,50,mobile?1550:1370,38,53),all:()=>pose(-150,200,7800,110,51),top:()=>pose(controls.target.x,controls.target.z,Math.max(900,camera.position.distanceTo(controls.target)),0,1),baisui:()=>{const b=G.buildings.find(b=>b.osmId===541482372);return pose(...b.center,260,60,63);},juzhilin:()=>featuredPose(),tiantai:()=>pose(773,1635,520,130,64)};fly(poses[name]());$$('[data-view]').forEach(b=>b.classList.toggle('active',b.dataset.view===name));syncSeg();}
$$('[data-view]').forEach(b=>b.onclick=()=>view(b.dataset.view));controls.addEventListener('gesturestart',()=>{cameraFlight.cancel();clearViews();syncViewShift();});
fly(pose(-1390,50,mobile?1550:1370,38,53),0);
$('#north').onclick=()=>fly(pose(controls.target.x,controls.target.z,camera.position.distanceTo(controls.target),0,controls.getPolarAngle()*180/Math.PI));
$('#zoom-in').onclick=()=>fly(pose(controls.target.x,controls.target.z,Math.max(40,camera.position.distanceTo(controls.target)*.65),heading(),controls.getPolarAngle()*180/Math.PI),450);
$('#zoom-out').onclick=()=>fly(pose(controls.target.x,controls.target.z,Math.min(12000,camera.position.distanceTo(controls.target)*1.5),heading(),controls.getPolarAngle()*180/Math.PI),450);
function sourceLinks(p){const links=node('div','links');for(const s of p.sources||[]){if(!/^https:\/\//.test(s.url))continue;const a=node('a','',s.name);a.href=s.url;a.target='_blank';a.rel='noopener';links.append(a);}return links;}
function deselect(){if(selected?.el)selected.el.classList.remove('selected');selected=null;}
let cardToken=0; // bumps whenever the card is closed or replaced, cancelling a card still waiting for its camera flight
// back=false when another mobile sheet takes the card's place: the camera stays and the saved view is dropped.
function closeCard(back=true){cardToken++;cameraFlight.cancel();deselect();conceal($('#card'));syncViewShift();if(back)flyHome();else homePose=null;}
function setSettings(open){$('#settings').classList.toggle('collapsed',!open);$('#settings-toggle').setAttribute('aria-expanded',open);if(started)syncViewShift();}
function closeDialog(){const d=$('#data-dialog');if(!d.open)return;d.classList.add('closing');setTimeout(()=>{d.classList.remove('closing');d.close();syncViewShift();},190);}
function closeMobileSheets(keep){
 if(!mobile)return;
 if(keep!=='directory'){$('#panel').classList.add('closed');$('#search').blur();syncViewShift();}
 if(keep!=='detail')closeCard(false);
 if(keep!=='settings')setSettings(false);
 if(keep!=='data')closeDialog();
}
const X_SVG='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';
function cardBase(title,tag,{cat='',sub='',hero=null,featured=false}={}){
 closeMobileSheets('detail');
 const card=$('#card'),open=card.classList.contains('show');card.replaceChildren();card.classList.toggle('featured',featured);
 const head=node('div','card-head'),body=node('div','card-content'+(open?' swap':''));
 const close=node('button','close icon-btn');close.innerHTML=X_SVG;close.setAttribute('aria-label','关闭地点详情');close.onclick=()=>closeCard();
 head.append(node('span','tag'+(cat?' c-'+cat:''),tag),node('h2','',title));if(sub)head.append(node('p','sub',sub));
 body.tabIndex=0;body.setAttribute('role','region');body.setAttribute('aria-label','地点详细内容');
 if(hero)card.append(hero);card.append(close,head,body);if(!open)reveal(card);requestAnimationFrame(syncViewShift);return body;
}
// Photos open inside the page and swipe sideways, including embedded offline images.
function openViewer(srcs,start,title='居之林民宿实拍'){const v=$('#viewer'),strip=v.querySelector('.viewer-strip'),count=v.querySelector('.viewer-count');
 v.setAttribute('aria-label',title+'照片');
 strip.replaceChildren(...srcs.map((src,i)=>{const f=node('div','slide'),img=node('img');img.src=src;img.alt=title+' · '+(i+1);f.append(img);return f;}));
 const at=()=>Math.round(strip.scrollLeft/Math.max(1,strip.clientWidth)),upd=()=>{count.textContent=`${at()+1} / ${srcs.length}`;};strip.onscroll=upd;
 const go=d=>strip.scrollTo({left:clamp(at()+d,0,srcs.length-1)*strip.clientWidth,behavior:reduce?'auto':'smooth'});v._go=go;
 v.querySelector('.viewer-prev').onclick=e=>{e.stopPropagation();go(-1);};v.querySelector('.viewer-next').onclick=e=>{e.stopPropagation();go(1);};v.onclick=closeViewer;
 reveal(v);strip.scrollLeft=start*strip.clientWidth;upd();syncViewShift();v.querySelector('.viewer-close').focus({preventScroll:true});}
function closeViewer(){conceal($('#viewer'),260);syncViewShift();}
const CAT={temple:'寺院',sight:'景点',nature:'山水景观',village:'村落地名',service:'公共服务',transport:'交通',hotel:'住宿',food:'餐饮',shop:'购物'};
const TEL='17356648281',TEL_TEXT='173 5664 8281';
function more(title){const d=node('details','more');d.append(node('summary','',title));return d;}
function actionBtn(cls,svg,text){const b=node('button','btn '+cls);b.type='button';b.innerHTML=svg;b.append(text);return b;}
const ROUTE_SVG='<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/></svg>',GO_SVG='<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3.2"/><path d="M12 3v3M12 18v3M3 12h3M18 12h3"/></svg>',ORBIT_SVG='<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></svg>',PHONE_SVG='<svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></svg>';
// With doFly the camera moves first; the card is only built and eased in once the flight has finished.
function selectPlace(p,doFly){deselect();selected=p;if(p.el)p.el.classList.add('selected');const token=++cardToken;
 const build=()=>{
 let hero=null;
 if(p.featured){hero=node('div','card-hero');// Photo sizes (all 960 wide) are set up front: in Safari a strip of still-zero-width images makes scroll-snap settle on a later photo.
 const photos=[['jzl-1',640],['jzl-2',541],['jzl-5',720],['jzl-6',540],['jzl-3',540],['jzl-4',640]],srcs=photos.map(([f])=>{const path=`media/juzhilin/${f}.jpg`;return window.__JIUHUA_MEDIA__?.[path]||path;});
 for(const[i,src]of srcs.entries()){const a=node('a');a.href=src;a.target='_blank';a.rel='noopener';a.onclick=e=>{e.preventDefault();openViewer(srcs,i);};const img=node('img');img.width=960;img.height=photos[i][1];img.src=src;img.alt='居之林民宿实拍';img.loading='lazy';a.append(img);hero.append(a);}}
 if(p.viewing?.photos?.length){hero=node('div','card-hero');const photos=p.viewing.photos,srcs=photos.map(photo=>window.__JIUHUA_MEDIA__?.[photo.src]||photo.src);
 for(const [i,photo]of photos.entries()){const a=node('a');a.href=srcs[i];a.setAttribute('aria-label',photo.alt+'，点开放大');a.onclick=e=>{e.preventDefault();openViewer(srcs,i,p.viewing.name);};const img=node('img');img.src=srcs[i];img.width=photo.width;img.height=photo.height;img.alt=photo.alt;img.loading='lazy';a.append(img);hero.append(a);}}
 const card=cardBase(p.displayName||(p.featured?p.shortName:p.n),p.featured?'精选民宿 · 实拍建模':CAT[p.category]||'地点',{cat:p.category,sub:p.address||p.zone||'',hero,featured:!!p.featured});
 const chips=node('div','chips');if(p.featured)chips.append(node('span','','业主实拍 · 三维建模'));chips.append(node('span','',`海拔约 ${Math.round(hAt(p.x,p.z))} m`));if(p.halls?.length)chips.append(node('span','',`殿堂 ${p.halls.length} 处`));if(p.transit?.length)chips.append(node('span','','景区交通站点'));card.append(chips);if(p.featured&&G.routes?.some(r=>r.id==='juzhilin-halfday')){const r=G.routes.find(r=>r.id==='juzhilin-halfday'),t=node('button','route-teaser');t.type='button';t.innerHTML=ROUTE_SVG;const tx=node('span','');tx.append(node('b','','从这里出发 · '+r.short),node('small','',`${r.duration} · 肉身宝殿 → 化城寺 → 缆车上百岁宫 · 看路线`));t.append(tx);t.onclick=()=>routes?.open(r.id);card.append(t);}
 if(p.featured&&routes?.canResume){const resume=card.querySelector('.route-teaser')||node('button','route-teaser');resume.type='button';resume.innerHTML=ROUTE_SVG;const text=node('span','');text.append(node('b','','继续路线预演'),node('small','',routes.active.short+' · 从刚才暂停的位置继续'));resume.append(text);resume.onclick=()=>routes.startPreview();if(!resume.parentNode)card.append(resume);}
 if(p.featured)card.append(node('p','lead','三层退台的山地民宿：屋顶露台远眺九华诸峰，二层木平台与罗汉松小院，门前停车场带充电桩，挡墙上方是挂满灯笼的大松树。'));
 // Why go first, then the story with how each paragraph should be read; where a story exists the building notes move into 资料与依据.
 if(p.highlight){const h=node('p','highlight');h.append(node('b','','看点'),p.highlight);card.append(h);}
 if(p.note)card.append(node('p','lead',p.note));
 if(p.story?.length){const box=node('div','story-box');box.append(node('h4','','文化看点'));for(const s of p.story){const para=node('p','story');para.append(kindLabel(s.kind),s.text);box.append(para);}
  if(p.storySources?.length){const src=sourceLinks({sources:p.storySources});src.prepend(node('span','','出处'));box.append(src);}card.append(box);}
 else if(p.architecture)card.append(node('p','',p.architecture));
 if(p.transit?.length){const box=node('div','transit');for(const t of p.transit){box.append(node('p','',`${t.route}${t.stop&&t.route!==t.stop?`（${t.stop}站）`:''}：${t.hours}`));if(t.order)box.append(node('small','',t.order));if(t.phone)box.append(node('small','',`咨询 ${t.phone}`));}box.append(node('small','',`时间以现场为准 · 九华山风景区官网 ${G.transit?.retrieved||''} 查询`));card.append(box);}
 if(p.halls?.length)card.append(node('p','',`寺内殿堂 ${p.halls.length} 处：${p.halls.slice(0,8).map(h=>h.n).join('、')}${p.halls.length>8?'等':''}；靠近时显示为小标注。`));
 const d=more(p.featured?'建模说明':'资料与依据');
 for(const t of[`定位：${qualityText(p)}`,p.story?.length&&p.architecture,p.modelNote,p.positionNote,p.viewing?.source,p.aliases?.length&&!p.featured&&('其他名称：'+p.aliases.slice(0,4).join('、')),p.category==='village'&&p.addressCount&&`约 ${p.addressCount} 个公开地址含此地名。`,p.quality?.startsWith('legacy')&&'此点沿用原版导览位置，尚未获得独立坐标证据；虚线标注表示待核。'])if(t)d.append(node('p','',t));
 d.append(node('p','coords',`${p.lon?.toFixed(6)??''}°E · ${p.lat?.toFixed(6)??''}°N`),sourceLinks(p));card.append(d);
 const acts=node('div','card-actions'),go=actionBtn('primary',GO_SVG,'靠近查看');go.onclick=()=>{saveHome();fly(p.featured?featuredPose(70):placePose(p,true));};acts.append(go);
 if(p.featured){const call=node('a','btn accent');call.href='tel:'+TEL;call.innerHTML=PHONE_SVG;call.append(node('span','full','致电 '+TEL_TEXT),node('span','short','致电民宿'));call.setAttribute('aria-label','致电居之林民宿 '+TEL_TEXT);acts.append(call);}
 card.append(acts);
 };
 if(mobile){$('#panel').classList.add('closed');syncViewShift();}
 $$('.place-item').forEach(b=>b.classList.toggle('selected',b.dataset.name===p.n));
 if(!doFly){routes?.stopPreview();cameraFlight.cancel();build();return;}
 const card=$('#card');if(card.classList.contains('show'))conceal(card,440);saveHome();clearViews();
 const to=p.featured?featuredPose():placePose(p);
 fly(to,flightMs(to),()=>{if(token!==cardToken||selected!==p)return;card.classList.add('arrive');build();clearTimeout(card._arrive);card._arrive=setTimeout(()=>card.classList.remove('arrive'),1600);},150);
}
function selectBuilding(b){routes?.stopPreview();cameraFlight.cancel();cardToken++;deselect();const ml=b.positionQuality==='ml_roofprint',temple=b.style==='temple';
 const card=cardBase(temple?(b.name||b.precinct||b.templeGuess||'寺院建筑'):'民居建筑',temple?'寺院建筑':'街区建筑',{cat:temple?'temple':'village',sub:b.precinct?`${b.precinct} 寺院范围内`:''});
 const chips=node('div','chips');chips.append(node('span','',`占地约 ${Math.round(b.area)} m²`),node('span','',`${b.levels||'-'} 层`),node('span','',`墙高 ${b.wallHeight.toFixed(1)} m`));card.append(chips);
 const d=more('外观与数据依据');d.append(node('p','',ml?'平面轮廓来自影像识别，可能包含识别误差。':'平面形状与朝向来自地图记录。'));
 if(b.styleRule)d.append(node('p','',`外观依据（${({observed:'照片观察',documented:'文献记载',inferred:'推断',secondary:'二手资料'})[b.styleCertainty]||b.styleCertainty||'推断'}）：${b.styleRule}。逐栋楼层与门窗未经实测。`));
 d.append(sourceLinks({sources:[{name:'查看建筑数据来源',url:b.source}]}));card.append(d);
 const acts=node('div','card-actions'),btn=actionBtn('ghost',ORBIT_SVG,'环看这栋建筑');btn.onclick=()=>{saveHome();fly(pose(...b.center,Math.max(70,b.width*3),heading()+70,66));clearViews();};acts.append(btn);card.append(acts);}
const ray=new THREE.Raycaster(),ndc=new THREE.Vector2();
function onMapTap(e){
 if(cameraFlight.active||!built.visible)return;
 ndc.set(e.clientX/innerWidth*2-1,-e.clientY/innerHeight*2+1);ray.setFromCamera(ndc,camera);const hit=ray.intersectObjects(pickables,true)[0];
 if(!hit){if(mobile)closeCard();return;}
 let o=hit.object;while(o&&!o.userData.landmark)o=o.parent;
 if(o?.userData.landmark&&byName.has(o.userData.landmark)){selectPlace(byName.get(o.userData.landmark),false);return;}
 const i=hit.object.userData.triangleIds?.[hit.faceIndex];if(i>=0)selectBuilding(G.buildings[i]);
}

function filtered(p,query=search){return(category==='all'||(GROUPS[category]||[category]).includes(p.category))&&(!query||p.searchable&&(p.n+' '+(p.displayName||'')+' '+(p.address||'')+' '+(p.aliases||[]).join(' ')+' '+(p.viewing?.name||'')).includes(query));}
function renderList(){const list=$('#place-list');list.replaceChildren();const found=places.filter(p=>p.searchable&&(filtered(p)||p===featured&&category==='all'&&!search)).sort((a,b)=>(b===featured)-(a===featured)||a.p-b.p||a.n.localeCompare(b.n,'zh-CN'));
 $('#list-summary').textContent=`${found.length} 个结果 · 可搜寺庙、景点、村名与公共设施`;
 const shown=found.slice(0,search?400:220);
 shown.forEach((p,i)=>{const b=node('button','place-item'+(p===featured?' featured':''));b.style.animationDelay=Math.min(i,14)*16+'ms';b.dataset.name=p.n;b.type='button';b.append(node('span','pi-icon c-'+p.category,p===featured?'宿':icon[p.category]||'·'));const t=node('span','pi-text');t.append(node('strong','',p.displayName||(p===featured?p.shortName:p.n)),node('small',estimated(p)?'estimate':'',p===featured?`精选民宿 · ${p.address}`:[CAT[p.category],p.highlight||(p.viewing?`可远眺${p.viewing.name}`:p.zone)].filter(Boolean).join(' · ')+(estimated(p)?' · 位置待核':'')));b.append(t);b.onclick=()=>selectPlace(p,true);list.append(b);});
 if(found.length>shown.length)list.append(node('p','empty',`另有 ${found.length-shown.length} 个点位未列出，请输入名称、门牌或村名缩小范围。`));
 if(!found.length)list.append(node('p','empty','没有匹配的地点。可以搜寺庙、景点、村名或车站、公厕、停车场，例如“化城寺”“凤凰松”“车站”。'));
}
$('#search').oninput=e=>{search=e.target.value.trim();renderList();};$$('[data-category]').forEach(b=>b.onclick=()=>{category=b.dataset.category;$$('[data-category]').forEach(x=>x.classList.toggle('active',x===b));renderList();});renderList();
function setTab(tab){$$('.panel-tabs [data-tab]').forEach(b=>{const on=b.dataset.tab===tab;b.classList.toggle('active',on);b.setAttribute('aria-selected',on);});$('#tab-routes').hidden=tab!=='routes';$('#tab-places').hidden=tab!=='places';$('#tab-guide').hidden=tab!=='guide';const a=$('.panel-tabs .active'),bar=$('.panel-tabs');bar.style.setProperty('--tab-x',a.offsetLeft+'px');bar.style.setProperty('--tab-w',a.offsetWidth+'px');}
function openPanel(tab){routes?.stopPreview();cameraFlight.cancel();if(tab)setTab(tab);closeMobileSheets('directory');$('#panel').classList.remove('closed');resize();requestAnimationFrame(()=>setTab($('.panel-tabs .active').dataset.tab));}
$$('.panel-tabs [data-tab]').forEach(b=>b.onclick=()=>setTab(b.dataset.tab));setTab('routes');setupGuide(G,$('#guide'));
$('#panel-close').onclick=()=>{$('#panel').classList.add('closed');resize();};$('#panel-open').onclick=()=>openPanel('places');$('#routes-open').onclick=()=>openPanel('routes');if(mobile)$('#panel').classList.add('closed');
$('#settings-toggle').onclick=()=>{const open=$('#settings').classList.contains('collapsed');if(open)closeMobileSheets('settings');setSettings(open);};if(mobile)setSettings(false);
$('#featured-cta').onclick=()=>selectPlace(featured,true);
// The part of the map left uncovered, for framing a route: below the top bar and above a phone's sheet (or left of a side
// sheet), or beside the open desktop panel. The view shift centres the map in the same area.
function visibleRect(){const w=innerWidth,h=innerHeight,p=$('#panel'),open=!p.classList.contains('closed');let top=0,bottom=h,left=0,right=w;
 if(mobile){top=document.body.classList.contains('map-chrome-hidden')?0:$('.viewbar').getBoundingClientRect().bottom;if(open){if(p.offsetWidth>w*.6)bottom=p.offsetTop;else right=p.offsetLeft;}}else if(open)right=w-340;
 return{left,top,right,bottom,shiftX:shiftTarget.x,shiftY:shiftTarget.y};}
routes=setupRoutes({routes:G.routes||[],world,camera,controls,hAt,fly,pose,openPanel,isMobile:()=>mobile,visibleRect,onFrame:f=>frameHooks.push(f),cancelFlight:()=>cameraFlight.cancel(),
 onPlaybackChange:()=>{if(started)syncViewShift();},
 closeSheetsForRoute:()=>{closeCard(false);if(mobile)$('#panel').classList.add('closed');resize();}});
$('#layer-buildings').onchange=e=>built.visible=e.target.checked;$('#layer-trees').onchange=e=>{treesChoice=e.target.checked;applyTrees();};$('#layer-trails').onchange=e=>trailGroup.visible=e.target.checked;
$('#height').oninput=e=>{const old=EX;EX=+e.target.value;e.target.style.setProperty('--fill',(EX-1)/.8*100+'%');world.scale.y=EX;$('#height-value').textContent=EX===1?'真实比例 ×1.0':`视觉增强 ×${EX.toFixed(1)}`;const dy=hAt(controls.target.x,controls.target.z)*(EX-old);controls.target.y+=dy;camera.position.y+=dy;if(homePose){const hy=hAt(homePose.target.x,homePose.target.z)*(EX-old);homePose.target.y+=hy;homePose.pos.y+=hy;}for(const p of places)if(p.label)p.label.position.y=(p.top+5)*EX;for(const q of extraLabels)q.label.position.y=(q.top+4)*EX;};
const S=G.stats,ST=S.buildingStyles||{};
const pubCount=places.filter(p=>p.searchable&&['service','transport'].includes(p.category)).length,sightCount=places.filter(p=>['sight','nature','village'].includes(p.category)).length;
const dataText=`<p>本次更新：2026 年 9 月 28 日。覆盖约 ${(W/1000).toFixed(2)} × ${(D/1000).toFixed(2)} 公里，重点为九华街、百岁宫、闵园、天台与花台。它是依据公开资料重建的可交互模型，不是倾斜摄影或实测成果。</p>
<table><tr><th>内容</th><th>依据与精度</th></tr>
<tr><td>居之林民宿</td><td>按业主提供的实拍照片与航拍图手工建模；现有卫星影像早于新建，落位按门牌顺序估计，尺寸按照片比例估计。</td></tr>
<tr><td>${S.buildings} 个建筑轮廓</td><td>${S.osmBuildings} 个 OpenStreetMap 轮廓 + ${S.supplementaryBuildings} 个 Overture 影像识别补充轮廓。楼层、墙色、瓦色、马头墙、披檐、店面按片区规律分配（${S.levelsRankedByGlobfp||0} 栋的楼层高低顺序参考 3D-GloBFP 估算高度），规律来自规划文件与公开照片，逐栋未实测。点建筑可看依据。</td></tr>
<tr><td>地点标注</td><td>寺庙 ${S.temples} · 景点山水与村落 ${sightCount} · 公共设施 ${pubCount}（车站、索道、停车场、公厕、游客中心、派出所、医院等）；另有 ${S.halls} 处殿堂小标注。多个平台的同一地点已合并。除居之林外，地图不标注商家。</td></tr>
<tr><td>真实地形</td><td>Copernicus GLO-30（2011–2015 雷达测量），257×257 网格约 21 m 间距；与 SRTM 相比峰顶和索道高差更接近官方数据。局部与其他高程源相差 30 m 以上的格点取四源中位数。仍是表面模型（含树冠）。</td></tr>
<tr><td>主要寺院</td><td>化城寺、祇园寺、肉身宝殿、百岁宫、旃檀禅林等的墙色、瓦色、屋顶形式依据官方规划、公开照片与卫星影像；殿体比例、细部仍属复原。</td></tr></table>
<h3>景区交通（官网 ${G.transit?.retrieved||''}）</h3>${(G.transit?.routes||[]).map(r=>`<p><b>${r.name}</b>　${r.hours}<br><small>${r.stops.join(' → ')}${r.note?'。'+r.note:''}</small></p>`).join('')}<p>${(G.transit?.cableways||[]).map(c=>`${c.name} ${c.hours}`).join('　·　')}<br><small>旅游咨询 ${G.transit?.hotlines?.['旅游咨询投诉']||''} · 紧急救援 ${G.transit?.hotlines?.['紧急救援']||''} · 尚无公开坐标的站点：${(G.transit?.unlocatedStops||[]).join('、')}</small></p>
<h3>坐标与数据质量</h3><p>去哪儿、360 地图等平台的 GCJ-02 坐标均用 coordtransform 换算为 WGS84，原始坐标保存在数据中；每个数据集都经过独立抽检。维基数据等开放数据中约 1 km 偏移的寺庙点（百度坐标误标为 WGS84）未用于定位。地点定位依据可在简介卡的“资料与依据”中查看。</p>
<h3>资料与许可</h3><p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors / ODbL</a> · <a href="https://docs.overturemaps.org/attribution/" target="_blank" rel="noopener">Overture Maps：建筑 ODbL；地点 CDLA-Permissive 2.0</a> · <a href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model" target="_blank" rel="noopener">Copernicus DEM GLO-30 © DLR e.V. 2010-2014 and © Airbus Defence and Space GmbH 2014-2018，由 ESA 在 Copernicus 计划下提供</a> · <a href="https://www.jiuhuashan.gov.cn/file_cz/54/202506/202506269aaa0b14711f440284eefd14e047a66e.pdf" target="_blank" rel="noopener">九华山官方地质公园规划</a> · <a href="https://doi.org/10.5194/essd-16-5357-2024" target="_blank" rel="noopener">3D-GloBFP 建筑高度（Che 等 2024，CC BY 4.0）</a>，仅用于同片区内楼层高低排序 · 去哪儿、360 地图公开页面（逐条链接见地点卡片）</p><p>补充建筑由 Qian Shi 等的东亚建筑数据经 Overture 提供，原始数据为 <a href="https://doi.org/10.5281/zenodo.8174931" target="_blank" rel="noopener">CC BY 4.0</a>；本项目做了裁剪、去重与屋顶重建。官方照片与公开照片仅用于归纳外观规律，未作为贴图。</p>`;
$('#data-content').innerHTML=dataText;$('#credit-data').onclick=$('#credit-mobile').onclick=()=>{closeMobileSheets('data');$('#data-dialog').showModal();syncViewShift();};$('#data-close').onclick=closeDialog;$('#data-dialog').onclick=e=>{if(e.target===$('#data-dialog'))closeDialog();};$('#data-dialog').addEventListener('close',()=>{if(started)syncViewShift();});
$('#capture').onclick=()=>{
 camera.updateMatrixWorld();updateLabels();renderer.render(scene,camera);routes?.updateLabels(performance.now());renderLabelLayer();
 const out=document.createElement('canvas');out.width=renderer.domElement.width;out.height=renderer.domElement.height;
 const c=out.getContext('2d');c.fillStyle='#dce5df';c.fillRect(0,0,out.width,out.height);c.drawImage(renderer.domElement,0,0);
 const ratio=out.width/innerWidth;c.scale(ratio,ratio);
 for(const p of places){if(!p.label?.parent||!p.label.visible)continue;const b=p.el.querySelector('button'),r=b.getBoundingClientRect();
  if(r.width===0||r.x<0||r.y<0||r.right>innerWidth||r.bottom>innerHeight-44)continue;
  c.fillStyle=p.featured?'#b5332af2':p.p===1?'#f7ecd4f2':'#fbfaf6ee';c.strokeStyle=estimated(p)?'#9c916b':'#c8cfbc';
  c.setLineDash(estimated(p)?[3,2]:[]);c.beginPath();c.roundRect(r.x,r.y,r.width,r.height,r.height/2);c.fill();c.stroke();c.setLineDash([]);
  c.fillStyle=p.featured?'#fff':'#1f3a31';c.font=(p.p===1||p.featured?'600 12px':'11px')+' "PingFang SC",sans-serif';c.textAlign='center';c.textBaseline='middle';c.fillText(p.displayName||p.shortName||p.n,r.x+r.width/2,r.y+r.height/2);
 }
 c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle='#fafbf3ed';c.fillRect(24,24,290,81);c.fillStyle='#253e35';c.font='600 24px "PingFang SC",sans-serif';c.fillText('九华山 · 三维实地导览',38,57);c.font='11px sans-serif';c.fillText(`${G.stats.buildings} 建筑轮廓 · ${G.stats.places} 地点 · 2026.09.27`,38,82);
 c.fillStyle='#fafbf3eb';c.fillRect(0,innerHeight-42,innerWidth,42);c.fillStyle='#52655a';c.font='10px sans-serif';
 c.fillText('© OpenStreetMap contributors · Overture Maps Foundation · Copernicus DEM (ESA) · 去哪儿/360地图/OSM 公开地点',12,innerHeight-25);
 c.fillText('补充轮廓：Qian Shi 等 / CC BY 4.0 · 建筑楼高、立面及植被为近似复原',12,innerHeight-9);
 const a=document.createElement('a');a.download='九华山三维地图-实景增强版.png';a.href=out.toDataURL('image/png');a.click();toast('当前三维画面已导出');
};

// Whatever covers part of the map (the desktop search panel, a phone's bottom sheet or landscape side sheet) slides the map
// centre into the part still visible, so a chosen place is never hidden under its own card; the shift eases in tick().
// A vertical offset gets a matching taller fov so the visible part keeps its scale (setViewOffset itself sets the aspect).
const FOV=43;let shift={x:0,y:0},shiftTarget={x:0,y:0};
function applyViewShift(){const w=innerWidth,h=innerHeight,{x,y}=shift,fw=w+2*Math.abs(x),fh=h+2*Math.abs(y);camera.aspect=fw/fh;camera.fov=Math.atan(Math.tan(FOV*Math.PI/360)*fh/h)*360/Math.PI;
 if(fw>w+1||fh>h+1)camera.setViewOffset(fw,fh,x>0?2*x:0,y>0?2*y:0,w,h);else camera.clearViewOffset();camera.updateProjectionMatrix();}
function syncViewShift(){const w=innerWidth,h=innerHeight,card=$('#card'),panel=$('#panel'),directoryOpen=!panel.classList.contains('closed');let x=0,y=0;
 const otherInteraction=directoryOpen||card.classList.contains('show')||!!cameraFlight.destination?.onDone||!!routes?.previewing||$('#data-dialog').open||$('#viewer').classList.contains('show');
 const hideChrome=otherInteraction||!$('#settings').classList.contains('collapsed');
 if(document.body.classList.contains('map-chrome-hidden')!==hideChrome){
  document.body.classList.toggle('map-chrome-hidden',hideChrome);
  if(hideChrome)interactionGuide.stop();
 }
 // The active layer panel keeps its own toggle available so it can be closed.
 for(const el of $$('.map-chrome')){const hide=el.id==='settings'?otherInteraction:hideChrome;if(el.inert===hide)continue;
  el.classList.toggle('is-hidden',hide);el.inert=hide;el.setAttribute('aria-hidden',String(hide));if(el.matches('button'))el.disabled=hide;for(const button of el.querySelectorAll('button'))button.disabled=hide;}
 if(!mobile)x=panel.classList.contains('closed')?0:160;
 else{const sheet=card.classList.contains('show')?card:panel.classList.contains('closed')?null:panel;
  if(sheet&&sheet.offsetWidth>w*.6){const bar=$('.viewbar'),top=hideChrome?0:bar.offsetTop+bar.offsetHeight;y=Math.max(0,h/2-(top+sheet.offsetTop)/2);}
  else if(sheet)x=Math.max(0,(w-sheet.offsetLeft)/2);}
 shiftTarget={x,y};if(!started){shift={x,y};applyViewShift();}}
function resize(){labelsDirty=true;resolution.setCeiling(resolutionCeiling());syncResolution(idleResolution);const w=innerWidth,h=innerHeight,narrow=compactViewport();if(narrow!==mobile){mobile=narrow;if(narrow){$('#panel').classList.add('closed');setSettings(false);}renderer.shadowMap.enabled=sun.castShadow=shadows();}renderer.setSize(w,h);labels.setSize(w,h);
 const open=!mobile&&!$('#panel').classList.contains('closed');document.body.classList.toggle('with-panel',open);syncViewShift();applyViewShift();syncSeg();}
function syncVisibleViewport(){const vv=window.visualViewport,visible=vv?vv.height:innerHeight,editing=document.activeElement===$('#search');const inset=mobile&&editing&&vv?Math.max(0,innerHeight-vv.height-vv.offsetTop):0;document.documentElement.style.setProperty('--visible-height',`${Math.round(visible)}px`);document.documentElement.style.setProperty('--keyboard-inset',inset>120?`${Math.round(inset)}px`:'0px');document.body.classList.toggle('keyboard-open',inset>120);}
window.visualViewport?.addEventListener('resize',syncVisibleViewport);window.visualViewport?.addEventListener('scroll',syncVisibleViewport);addEventListener('focusin',syncVisibleViewport);addEventListener('focusout',()=>requestAnimationFrame(syncVisibleViewport));addEventListener('resize',syncVisibleViewport);syncVisibleViewport();
addEventListener('keydown',e=>{const v=$('#viewer');if(!v.hidden){if(e.key==='Escape')closeViewer();else if(e.key==='ArrowLeft'||e.key==='ArrowRight')v._go(e.key==='ArrowLeft'?-1:1);return;}if(e.key==='Escape'&&!$('#data-dialog').open){closeCard();closeMobileSheets(null);}});addEventListener('resize',resize);resize();
const temp=new THREE.Vector3();
function occluded(p){const a=camera.position,b=p.label.position;for(let k=2;k<24;k++){const t=k/24,x=a.x+(b.x-a.x)*t,z=a.z+(b.z-a.z)*t;if(Math.abs(x)>W/2||Math.abs(z)>D/2)continue;if(hAt(x,z)*EX>a.y+(b.y-a.y)*t+4)return true;}return false;}
function updateLabels(){labelSelections++;attachedLabels.length=0;const show=$('#layer-labels').checked,cands=[],w=innerWidth,h=innerHeight,cam=camera.position,cap=labelCap??(mobile?28:60);
 // Keep the query for reopening search, but only filter map labels while its panel is visible.
 const mapQuery=!$('#panel').classList.contains('closed')&&!$('#tab-places').hidden?search:'';
 for(const p of labelPlaces){const lp=p.label.position,dist=Math.hypot(lp.x-cam.x,lp.y-cam.y,lp.z-cam.z);
  let v=show&&(dist<p.limit||p===selected||(p.hall&&p.parent===selected&&dist<900))&&(p.road||p.hall||p.featured||filtered(p,mapQuery));let x=0,y=0;
  if(v){temp.copy(lp).project(camera);x=(temp.x+1)*w/2;y=(1-temp.y)*h/2;if(temp.z>1||temp.z<0||x<p.labelWidth/2+4||x>w-p.labelWidth/2-4||y<35||y>h-18)v=false;}
  if(v&&!p.road&&!p.featured&&occluded(p))v=false;cands.push({p,dist,x,y,v});}
 cands.sort((a,b)=>(!!b.p.featured)-(!!a.p.featured)||(b.p===selected)-(a.p===selected)||a.p.p-b.p.p||a.dist-b.dist);const occupied=[];visibleLabelCount=0;
 for(const c of cands){if(c.v){const r=[c.x-c.p.labelWidth/2,c.y-30,c.x+c.p.labelWidth/2,c.y+4];if(c.p!==selected&&!c.p.featured&&(visibleLabelCount>=cap||occupied.some(o=>!(r[2]<o[0]||r[0]>o[2]||r[3]<o[1]||r[1]>o[3]))))c.v=false;else{occupied.push(r);visibleLabelCount++;}}
  if(c.v){if(!c.p.label.parent)scene.add(c.p.label);c.p.label.visible=true;attachedLabels.push(c.p.label);}else if(c.p.label.parent)scene.remove(c.p.label);}
}
function renderLabelLayer(){labelRoot.children=attachedLabels.filter(o=>o.parent).concat(routes?.labelObjects||[]);labels.render(labelRoot,camera);labelPasses++;}
// Idle phones retain low-rate decorative animation. Skip that animation's CPU work
// as well as the GPU draw on unused frames; gestures, damping and route previews
// still run at full rate. Idle resolution restores clarity without lowering models.
let lastFrame=0,lastRender=0,lastInput=0,renderedLast=false,benchUntil=0,benchPhase=0,benchFrom=0,samples=[],frameAvg=16.7,frameN=0,watchAt=0,tierProbeAllowed=true;
let selectionPending=true,selectionAt=0,hudAt=0,animationUpdates=0;
const labelCamera=new THREE.Matrix4(),labelProjection=new THREE.Matrix4();
for(const ev of['pointerdown','pointermove','wheel','keydown','input','change','click'])addEventListener(ev,()=>{lastInput=performance.now();if(['keydown','input','change','click'].includes(ev))labelsDirty=true;},{capture:true,passive:true});
function startBench(phase){benchPhase=phase;benchUntil=performance.now()+3000;samples=[];}
function setTier(t,why){t=Math.max(0,Math.min(maxTier,t));const was=tier,wasE=emergency;tier=t;emergency=why==='emergency';if(t!==was||emergency!==wasE)applyTier();}
function applyBudget(result,now){
 if(result.action==='resolution-down'||result.action==='resolution-up'){syncResolution(false,now);return true;}
 if(result.action==='tier-down'){
  tierProbeAllowed=false;
  if(tier>0)setTier(benchPhase===2&&tier>benchFrom?benchFrom:tier-1,'slow');
  else if(!emergency)setTier(0,'emergency');else return false;
  store.set('autoTier',tier);return true;
 }
 return false;
}
function measure(dt,now){
 if(now-resolutionChangedAt<500)return; // resizing/upload work is not steady-state load
 if(benchUntil){if(now<benchUntil-2200)return; // the first frames of a phase compile shaders and upload geometry
  samples.push(Math.min(dt,250));if(now<benchUntil||samples.length<12)return;
  const result=resolution.observe(samples,now);frameAvg=result.mean;frameN=0;
  if(applyBudget(result,now)){startBench(benchPhase===2&&tier>benchFrom?2:1);return;}
  benchUntil=0;samples=[];watchAt=now+3000;
  if(benchPhase===1&&tierProbeAllowed&&result.fast&&resolution.limit===resolution.ceiling&&tier<maxTier&&!emergency){
   tierProbeAllowed=false;benchFrom=tier;setTier(tier+1,'probe');startBench(2);return;}
  if(benchPhase===2&&result.mean>22){setTier(benchFrom,'probe-revert');}
  benchPhase=0;store.set('autoTier',tier);return;
 }
 frameAvg=frameN?frameAvg+(Math.min(dt,250)-frameAvg)*.05:Math.min(dt,250);frameN++;
 samples.push(Math.min(dt,250));if(samples.length>240)samples.shift();
 if(now>watchAt&&frameN>45){const result=resolution.observe(samples,now);applyBudget(result,now);frameN=0;samples=[];watchAt=now+3000;}
}
document.addEventListener('visibilitychange',()=>{lastFrame=0;renderedLast=false;samples=[];frameN=0;labelsDirty=true;if(!document.hidden&&benchUntil)startBench(benchPhase);});
function tick(now){requestAnimationFrame(tick);if(document.hidden){lastFrame=0;return;}
 const dt=lastFrame?now-lastFrame:16.7;lastFrame=now;
 for(const f of frameHooks)f(now,dt);
 cameraFlight.update(now);
 controls.target.x=clamp(controls.target.x,-W/2,W/2);controls.target.z=clamp(controls.target.z,-D/2,D/2);const moved=controls.update();if(Math.abs(camera.position.x)<W/2&&Math.abs(camera.position.z)<D/2&&!inTerrainCut(camera.position.x,camera.position.z))camera.position.y=Math.max(camera.position.y,hAt(camera.position.x,camera.position.z)*EX+8);
 const shifting=shift.x!==shiftTarget.x||shift.y!==shiftTarget.y;
 if(shifting){const k=1-Math.pow(.86,dt/16.7);for(const a of['x','y']){shift[a]+=(shiftTarget[a]-shift[a])*k;if(Math.abs(shift[a]-shiftTarget[a])<.4)shift[a]=shiftTarget[a];}applyViewShift();}
 const idle=lowPower&&!benchUntil&&!cameraFlight.active&&!moved&&!shifting&&!routes?.previewing&&now-lastInput>1500;
 if(idle&&!labelsDirty&&now-lastRender<(now-lastInput>8000?98:48)){renderedLast=false;return;}
 if(renderedLast&&!idle)measure(dt,now);else if(!benchUntil){samples=[];frameN=0;}renderedLast=true;lastRender=now;syncResolution(idle,now);
 animationUpdates++;
 for(const m of movers){const t=reduce?m.phase:m.kind==='funicular'?(Math.sin(now/16000)*.5+.5)*.96+.02:((now/140000)+m.phase)%1;const p=m.curve.getPoint(t);m.g.position.copy(p);if(m.kind==='cable')m.g.position.y-=5.5;const tangent=m.curve.getTangent(t);m.g.rotation.y=Math.atan2(-tangent.z,tangent.x);}
 const distance=camera.position.distanceTo(controls.target),TQ=TIERS[tier];for(const g of detailedGroups)g.visible=distance<TQ.landmarkDist;
 for(const batch of spatialBatches)batch.update(distance);
 for(const t of forestTiles)if(t.trunk)t.trunk.visible=distance<TQ.trunkDist;for(const m of farDetail)m.visible=distance<TQ.detailDist;
 if(featuredPin){const d=camera.position.distanceTo(featuredPin.position),k=clamp(d/160,1,26);featuredPin.scale.setScalar(k);featuredPin.rotation.y=now/1400;const fp=featured;if(fp?.label)fp.label.position.y=(featuredPin.userData.base+featuredPin.userData.head*k)*EX+2*k;}
 camera.updateMatrixWorld();const cameraChanged=!labelCamera.equals(camera.matrixWorld)||!labelProjection.equals(camera.projectionMatrix);
 if(cameraChanged)selectionPending=true;
 const selectedLabels=labelsDirty||selectionPending&&now-selectionAt>=110;
 if(selectedLabels){updateLabels();selectionAt=now;selectionPending=false;}
 if(selectedLabels||cameraChanged&&now-hudAt>=110){hudAt=now;const ct=controls.target;sun.target.position.copy(ct);sun.position.set(ct.x-1200,ct.y+2100,ct.z-1300);$('#north-arrow').style.transform=`rotate(${-heading()}deg)`;$('#scene-status').textContent=distance<350?'建筑近景 · 细部复原':distance<2100?'九华山街区 · 拖动环看':'九华山全景 · 双指缩放';const v=distance*2*Math.tan(43*Math.PI/360)/innerHeight*80;$('#scale-line').textContent=v>1000?`${(v/1000).toFixed(1)} km`:`${Math.round(v/10)*10||5} m`;}
 renderer.render(scene,camera);const routeLabelsChanged=routes?.updateLabels(now);
 if(cameraChanged||selectedLabels||routeLabelsChanged)renderLabelLayer();labelsDirty=false;
 labelCamera.copy(camera.matrixWorld);labelProjection.copy(camera.projectionMatrix);
 if(++frame===30)console.info('Map verification',JSON.stringify(window.mapDiagnostics));
}
started=true;applyTier();startBench(1);$('#loading').classList.add('done');setTimeout(()=>{$('#loading').hidden=true;if(!document.body.classList.contains('map-chrome-hidden'))interactionGuide.start();},700);requestAnimationFrame(tick);
// Inspectable public diagnostics are also useful for verifying delivery, without private app state.
window.mapDiagnostics={version:G.version,buildings:G.stats.buildings,places:places.length,businesses:G.stats.businesses,trees:trees.length,bamboo:bamboo.length,roads:G.roads.length,coordinateSystem:G.geo.crs,randomHouses:0,detailModel:'mapped footprints + area-rule facades; only 居之林 named among businesses',signs:signTexts.length,lanterns:lanternPts.length,get drawCalls(){return renderer.info.render.calls;},get frames(){return renderer.info.render.frame;},get pixelRatio(){return renderer.getPixelRatio();},get quality(){return TIERS[tier].name+(emergency?'-':'');},get tier(){return tier;},get frameMs(){return Math.round(frameAvg*10)/10;},get triangles(){return renderer.info.render.triangles;},get visibleLabels(){return visibleLabelCount;},get resolutionLimit(){return resolution.limit;},get idleResolution(){return idleResolution;},get spatialMode(){return spatialBatches.some(b=>b.near)?'near':'far';},get labelPasses(){return labelPasses;},get labelSelections(){return labelSelections;},get animationUpdates(){return animationUpdates;}};
}
