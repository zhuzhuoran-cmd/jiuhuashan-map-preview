var Yr=i=>String(i??"").normalize("NFKC").toLowerCase().replace(/[\s()（）·.,，。\-_/]+/g,""),om=[["toilet",["\u516C\u5171\u5395\u6240","\u516C\u5395","\u5395\u6240","\u536B\u751F\u95F4","\u6D17\u624B\u95F4","wc"],i=>i.k==="\u516C\u5171\u5395\u6240"],["cable",["\u7D22\u9053","\u7F06\u8F66"],i=>i.category==="transport"&&/索道|缆车/.test(i.n)||i.k==="cable-car"],["bus",["\u666F\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u7AD9","\u5BA2\u8FD0\u7AD9","\u5DF4\u58EB\u7AD9","\u4E58\u8F66\u5904","\u8F66\u7AD9"],i=>i.category==="transport"&&/bus/.test(i.k)],["visitor",["\u6E38\u5BA2\u670D\u52A1\u5206\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3","\u6E38\u5BA2\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u7AD9"],i=>i.k==="\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3"],["ticket",["\u552E\u7968\u5904","\u552E\u7968\u70B9","\u552E\u7968\u4EAD","\u7968\u52A1"],i=>/售票/.test([i.n,...i.aliases||[]].join(" "))],["parking",["\u505C\u8F66\u573A","\u505C\u8F66\u5904","\u505C\u8F66\u4F4D","\u505C\u8F66"],i=>i.category==="service"&&/停车场|car park/.test(i.k)],["temple",["\u5BFA\u5E99","\u5BFA\u9662"],i=>i.category==="temple"],["hotel",["\u4F4F\u5BBF","\u9152\u5E97","\u65C5\u9986","\u65C5\u5E97"],i=>i.category==="hotel"],["guesthouse",["\u6C11\u5BBF","\u5BA2\u6808"],i=>i.category==="hotel"&&/民宿|客栈/.test(i.n+(i.k||""))],["food",["\u9910\u996E","\u9910\u5385","\u9910\u9986","\u996D\u5E97","\u996D\u9986","\u5403\u996D"],i=>i.category==="food"],["shop",["\u8D2D\u7269","\u5546\u5E97","\u5546\u94FA","\u5E97\u94FA"],i=>i.category==="shop"],["market",["\u8D85\u5E02","\u4FBF\u5229\u5E97","\u5C0F\u5356\u90E8"],i=>i.category==="shop"&&/超市|便利|小卖部/.test(i.n+(i.k||""))],["sight",["\u666F\u70B9","\u666F\u89C2"],i=>["sight","nature"].includes(i.category)],["nature",["\u81EA\u7136\u666F\u89C2","\u5C71\u6C34\u666F\u89C2","\u5C71\u6C34"],i=>i.category==="nature"],["village",["\u6751\u843D","\u6751\u5E84","\u5730\u540D","\u793E\u533A"],i=>i.category==="village"],["service",["\u516C\u5171\u8BBE\u65BD","\u516C\u5171\u670D\u52A1"],i=>["service","transport"].includes(i.category)],["transport",["\u4EA4\u901A","\u4EA4\u901A\u8BBE\u65BD"],i=>i.category==="transport"]],R1=om.flatMap(([i,t])=>t.map(e=>({term:Yr(e),id:i}))).sort((i,t)=>t.term.length-i.term.length);function C1(i){let t=[];for(let e of String(i??"").normalize("NFKC").toLowerCase().trim().split(/\s+/)){let n=Yr(e),s="";for(;n;){let r=R1.find(a=>n.startsWith(a.term));r?(s&&t.push({text:s}),s="",t.push({group:r.id}),n=n.slice(r.term.length)):(s+=n[0],n=n.slice(1))}s&&t.push({text:s})}return t}function am(i){let t=new Set,e=[];for(let a of i){if(!a.n||!Number.isFinite(a.x)||!Number.isFinite(a.z))continue;let o=a.placeId||a.n;if(t.has(o))continue;t.add(o);let c=[a.n,a.displayName].filter(Boolean).map(Yr),h=[a.shortName,...a.aliases||[],a.viewing?.name].filter(Boolean).map(Yr),u=[...c,...h,a.address,a.zone,a.k].filter(Boolean).map(Yr),f=new Set(om.filter(([,,g])=>g(a)).map(([g])=>g));e.push({place:a,names:c,aliases:h,texts:u,groups:f})}let n=null,s=new Map;function r(a){let o=String(a??"");if(o===n||(n=o,s=new Map,o.length>200))return s;let c=Yr(a),h=C1(a);for(let u of e){let f=-1;if(!String(a??"").trim())f=0;else if(!c)f=-1;else if(u.names.includes(c))f=1e3;else if(u.aliases.includes(c))f=900;else if(h.length&&h.every(g=>g.group?u.groups.has(g.group):u.texts.some(d=>d.includes(g.text)))){let g=h.filter(d=>d.text);f=u.names.some(d=>d.startsWith(c))?800:u.names.some(d=>d.includes(c))?700:u.aliases.some(d=>d.includes(c))?600:g.some(d=>u.names.some(y=>y.includes(d.text)))?500:g.some(d=>u.aliases.some(y=>y.includes(d.text)))?400:200}s.set(u.place,f)}return s}return{score(a,o){return r(o).get(a)??-1},search(a,{accept:o=()=>!0}={}){let c=r(a);return e.filter(h=>c.get(h.place)>=0&&o(h.place)).sort((h,u)=>c.get(u.place)-c.get(h.place)||(u.place.featured?1:0)-(h.place.featured?1:0)||(h.place.p??99)-(u.place.p??99)||h.place.n.localeCompare(u.place.n,"zh-CN")).map(h=>h.place)}}}function lm(i,t,{delay:e=90}={}){let n=!1,s,r=()=>{clearTimeout(s),s=void 0},a=()=>{r(),n||t(i.value.trim())},o=u=>{r(),!(n||u?.isComposing)&&(s=setTimeout(a,e))},c=()=>{n=!0,r()},h=()=>{n=!1,o()};return i.addEventListener("input",o),i.addEventListener("compositionstart",c),i.addEventListener("compositionend",h),{flush:a,destroy(){r(),i.removeEventListener("input",o),i.removeEventListener("compositionstart",c),i.removeEventListener("compositionend",h)}}}function cm(i){let t=1/0,e=-1/0;for(let n=0;n<i.length;n++)i[n]<t&&(t=i[n]),i[n]>e&&(e=i[n]);return{min:t,max:e}}var hm={"\u516C\u5395\uFF08\u4E09\u89D2\u6D32\u8F66\u7AD9\u505C\u8F66\u573A\u65C1\uFF09":609946470,"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":609892484,"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":609980796,"\u516C\u5171\u5395\u6240(AH-CIZ-0666)":609909660},P1={"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":"facility:toilet-dongya","\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":"facility:toilet-huxingshan",\u864E\u5F62\u5C71\u8F66\u7AD9:"transport:huxingshan-station"},ll=i=>P1[i]||`place:${i}`,um="\u4E1A\u4E3B\u6307\u8BA4 \xB7 \u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E";function fm(i){i.places.some(e=>e.n==="\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09")||i.places.push({n:"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09",shortName:"\u516C\u5395",category:"service",k:"\u516C\u5171\u5395\u6240",p:3,zone:"\u4E5D\u534E\u8857\uFF08\u9547\u533A\uFF09",x:-1424,z:-17,lon:117.8115+-1424/95950,lat:30.482- -17/110900,address:"\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1",quality:"owner_reported",src:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09",sources:[{name:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09\uFF0C\u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E",url:""}],sourceFamilies:["owner"],coordinateMethod:"\u6A21\u578B\u5E73\u9762\u5750\u6807\u6309\u9879\u76EE\u6295\u5F71\u6362\u7B97\u4E3A\u8FD1\u4F3C WGS84",modelQuality:"schematic",note:"\u8BBE\u65BD\u7531\u4E1A\u4E3B\u6307\u8BA4\uFF1B\u4F4D\u7F6E\u53CA\u5F53\u524D\u5F00\u653E\u72B6\u6001\u672A\u72EC\u7ACB\u6838\u5B9E\u3002",searchable:!0});let t=i.places.find(e=>e.n==="\u864E\u5F62\u5C71\u8F66\u7AD9");t&&(t.aliases=[...new Set([...t.aliases||[],"\u864E\u5F62\u5C71\u8F66\u7AD9\u552E\u7968\u5904","\u864E\u5F62\u5C71\u552E\u7968\u5904"])]);for(let e of i.places)e.placeId=ll(e.n);return i.places}function dm(i,t,e){for(let n=i;n;n=n.parent){if(n.userData?.placeId)return t.get(n.userData.placeId);if(n.userData?.landmark&&e.has(n.userData.landmark))return e.get(n.userData.landmark)}}var Oo={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Fo={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},L1=0,pm=1,I1=2;var j0=1,Sd=2,Lr=3,so=0,gs=1,mn=2;var eo=0,wa=1,mm=2,gm=3,xm=4,D1=5,wo=100,U1=101,N1=102,ym=103,_m=104,O1=200,F1=201,B1=202,z1=203,Df=204,Uf=205,k1=206,H1=207,V1=208,G1=209,W1=210,X1=211,q1=212,Y1=213,$1=214,Z1=0,J1=1,j1=2,$c=3,K1=4,Q1=5,ty=6,ey=7,Ed=0,ny=1,iy=2,no=0,sy=1,ry=2,oy=3,wd=4,ay=5,ly=6;var K0=300,Ra=301,Ca=302,Nf=303,Of=304,kh=306,ro=1e3,Js=1001,Ff=1002,Li=1003,vm=1004;var Ku=1005;var ms=1006,cy=1007;var Ml=1008;var io=1009,hy=1010,uy=1011,Td=1012,Q0=1013,Qr=1014,to=1015,bl=1016,tg=1017,eg=1018,Ao=1020,fy=1021,js=1023,dy=1024,py=1025,Ro=1026,Pa=1027,my=1028,ng=1029,gy=1030,ig=1031,sg=1033,Qu=33776,tf=33777,ef=33778,nf=33779,Mm=35840,bm=35841,Sm=35842,Em=35843,rg=36196,wm=37492,Tm=37496,Am=37808,Rm=37809,Cm=37810,Pm=37811,Lm=37812,Im=37813,Dm=37814,Um=37815,Nm=37816,Om=37817,Fm=37818,Bm=37819,zm=37820,km=37821,sf=36492,Hm=36494,Vm=36495,xy=36283,Gm=36284,Wm=36285,Xm=36286;var Zc=2300,Jc=2301,rf=2302,qm=2400,Ym=2401,$m=2402;var og=3e3,Co=3001,yy=3200,_y=3201,Hh=0,vy=1,Fs="",kn="srgb",Dr="srgb-linear",Ad="display-p3",Vh="display-p3-linear",jc="linear",ai="srgb",Kc="rec709",Qc="p3";var sa=7680;var Zm=519,My=512,by=513,Sy=514,ag=515,Ey=516,wy=517,Ty=518,Ay=519,Bf=35044;var Jm="300 es",zf=1035,Ir=2e3,th=2001,gr=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Qi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],jm=1234567,ml=Math.PI/180,Sl=180/Math.PI;function mr(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qi[i&255]+Qi[i>>8&255]+Qi[i>>16&255]+Qi[i>>24&255]+"-"+Qi[t&255]+Qi[t>>8&255]+"-"+Qi[t>>16&15|64]+Qi[t>>24&255]+"-"+Qi[e&63|128]+Qi[e>>8&255]+"-"+Qi[e>>16&255]+Qi[e>>24&255]+Qi[n&255]+Qi[n>>8&255]+Qi[n>>16&255]+Qi[n>>24&255]).toLowerCase()}function Ii(i,t,e){return Math.max(t,Math.min(e,i))}function Rd(i,t){return(i%t+t)%t}function Ry(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Cy(i,t,e){return i!==t?(e-i)/(t-i):0}function gl(i,t,e){return(1-e)*i+e*t}function Py(i,t,e,n){return gl(i,t,1-Math.exp(-e*n))}function Ly(i,t=1){return t-Math.abs(Rd(i,t*2)-t)}function Iy(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Dy(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Uy(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Ny(i,t){return i+Math.random()*(t-i)}function Oy(i){return i*(.5-Math.random())}function Fy(i){i!==void 0&&(jm=i);let t=jm+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function By(i){return i*ml}function zy(i){return i*Sl}function kf(i){return(i&i-1)===0&&i!==0}function ky(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function eh(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Hy(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),c=a(e/2),h=r((t+n)/2),u=a((t+n)/2),f=r((t-n)/2),g=a((t-n)/2),d=r((n-t)/2),y=a((n-t)/2);switch(s){case"XYX":i.set(o*u,c*f,c*g,o*h);break;case"YZY":i.set(c*g,o*u,c*f,o*h);break;case"ZXZ":i.set(c*f,c*g,o*u,o*h);break;case"XZX":i.set(o*u,c*y,c*d,o*h);break;case"YXY":i.set(c*d,o*u,c*y,o*h);break;case"ZYZ":i.set(c*y,c*d,o*u,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function pr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Gh={DEG2RAD:ml,RAD2DEG:Sl,generateUUID:mr,clamp:Ii,euclideanModulo:Rd,mapLinear:Ry,inverseLerp:Cy,lerp:gl,damp:Py,pingpong:Ly,smoothstep:Iy,smootherstep:Dy,randInt:Uy,randFloat:Ny,randFloatSpread:Oy,seededRandom:Fy,degToRad:By,radToDeg:zy,isPowerOfTwo:kf,ceilPowerOfTwo:ky,floorPowerOfTwo:eh,setQuaternionFromProperEuler:Hy,normalize:Gn,denormalize:pr},fe=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ii(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},En=class i{constructor(t,e,n,s,r,a,o,c,h){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h)}set(t,e,n,s,r,a,o,c,h){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=c,u[6]=n,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],c=n[6],h=n[1],u=n[4],f=n[7],g=n[2],d=n[5],y=n[8],v=s[0],p=s[3],x=s[6],A=s[1],M=s[4],L=s[7],R=s[2],T=s[5],N=s[8];return r[0]=a*v+o*A+c*R,r[3]=a*p+o*M+c*T,r[6]=a*x+o*L+c*N,r[1]=h*v+u*A+f*R,r[4]=h*p+u*M+f*T,r[7]=h*x+u*L+f*N,r[2]=g*v+d*A+y*R,r[5]=g*p+d*M+y*T,r[8]=g*x+d*L+y*N,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],u=t[8];return e*a*u-e*o*h-n*r*u+n*o*c+s*r*h-s*a*c}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],u=t[8],f=u*a-o*h,g=o*c-u*r,d=h*r-a*c,y=e*f+n*g+s*d;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/y;return t[0]=f*v,t[1]=(s*h-u*n)*v,t[2]=(o*n-s*a)*v,t[3]=g*v,t[4]=(u*e-s*c)*v,t[5]=(s*r-o*e)*v,t[6]=d*v,t[7]=(n*c-h*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let c=Math.cos(r),h=Math.sin(r);return this.set(n*c,n*h,-n*(c*a+h*o)+a+t,-s*h,s*c,-s*(-h*a+c*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(of.makeScale(t,e)),this}rotate(t){return this.premultiply(of.makeRotation(-t)),this}translate(t,e){return this.premultiply(of.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},of=new En;function lg(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function nh(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Vy(){let i=nh("canvas");return i.style.display="block",i}var Km={};function xl(i){i in Km||(Km[i]=!0,console.warn(i))}var Qm=new En().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),t0=new En().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),_c={[Dr]:{transfer:jc,primaries:Kc,toReference:i=>i,fromReference:i=>i},[kn]:{transfer:ai,primaries:Kc,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Vh]:{transfer:jc,primaries:Qc,toReference:i=>i.applyMatrix3(t0),fromReference:i=>i.applyMatrix3(Qm)},[Ad]:{transfer:ai,primaries:Qc,toReference:i=>i.convertSRGBToLinear().applyMatrix3(t0),fromReference:i=>i.applyMatrix3(Qm).convertLinearToSRGB()}},Gy=new Set([Dr,Vh]),Wn={enabled:!0,_workingColorSpace:Dr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Gy.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=_c[t].toReference,s=_c[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return _c[i].primaries},getTransfer:function(i){return i===Fs?jc:_c[i].transfer}};function Ta(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function af(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var ra,ih=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ra===void 0&&(ra=nh("canvas")),ra.width=t.width,ra.height=t.height;let n=ra.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ra}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=nh("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=Ta(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(Ta(e[n]/255)*255):e[n]=Ta(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Wy=0,sh=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Wy++}),this.uuid=mr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(lf(s[a].image)):r.push(lf(s[a]))}else r=lf(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function lf(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ih.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Xy=0,Ts=class i extends gr{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Js,s=Js,r=ms,a=Ml,o=js,c=io,h=i.DEFAULT_ANISOTROPY,u=Fs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Xy++}),this.uuid=mr(),this.name="",this.source=new sh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=c,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new En,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(xl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===Co?kn:Fs),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==K0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case ro:t.x=t.x-Math.floor(t.x);break;case Js:t.x=t.x<0?0:1;break;case Ff:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case ro:t.y=t.y-Math.floor(t.y);break;case Js:t.y=t.y<0?0:1;break;case Ff:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return xl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===kn?Co:og}set encoding(t){xl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Co?kn:Fs}};Ts.DEFAULT_IMAGE=null;Ts.DEFAULT_MAPPING=K0;Ts.DEFAULT_ANISOTROPY=1;var Fn=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,c=t.elements,h=c[0],u=c[4],f=c[8],g=c[1],d=c[5],y=c[9],v=c[2],p=c[6],x=c[10];if(Math.abs(u-g)<.01&&Math.abs(f-v)<.01&&Math.abs(y-p)<.01){if(Math.abs(u+g)<.1&&Math.abs(f+v)<.1&&Math.abs(y+p)<.1&&Math.abs(h+d+x-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(h+1)/2,L=(d+1)/2,R=(x+1)/2,T=(u+g)/4,N=(f+v)/4,K=(y+p)/4;return M>L&&M>R?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=N/n):L>R?L<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(L),n=T/s,r=K/s):R<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(R),n=N/r,s=K/r),this.set(n,s,r,e),this}let A=Math.sqrt((p-y)*(p-y)+(f-v)*(f-v)+(g-u)*(g-u));return Math.abs(A)<.001&&(A=1),this.x=(p-y)/A,this.y=(f-v)/A,this.z=(g-u)/A,this.w=Math.acos((h+d+x-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Hf=class extends gr{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Fn(0,0,t,e),this.scissorTest=!1,this.viewport=new Fn(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(xl("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Co?kn:Fs),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ms,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Ts(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new sh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ur=class extends Hf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},rh=class extends Ts{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Li,this.minFilter=Li,this.wrapR=Js,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Vf=class extends Ts{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Li,this.minFilter=Li,this.wrapR=Js,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var xs=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let c=n[s+0],h=n[s+1],u=n[s+2],f=n[s+3],g=r[a+0],d=r[a+1],y=r[a+2],v=r[a+3];if(o===0){t[e+0]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=g,t[e+1]=d,t[e+2]=y,t[e+3]=v;return}if(f!==v||c!==g||h!==d||u!==y){let p=1-o,x=c*g+h*d+u*y+f*v,A=x>=0?1:-1,M=1-x*x;if(M>Number.EPSILON){let R=Math.sqrt(M),T=Math.atan2(R,x*A);p=Math.sin(p*T)/R,o=Math.sin(o*T)/R}let L=o*A;if(c=c*p+g*L,h=h*p+d*L,u=u*p+y*L,f=f*p+v*L,p===1-o){let R=1/Math.sqrt(c*c+h*h+u*u+f*f);c*=R,h*=R,u*=R,f*=R}}t[e]=c,t[e+1]=h,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],c=n[s+1],h=n[s+2],u=n[s+3],f=r[a],g=r[a+1],d=r[a+2],y=r[a+3];return t[e]=o*y+u*f+c*d-h*g,t[e+1]=c*y+u*g+h*f-o*d,t[e+2]=h*y+u*d+o*g-c*f,t[e+3]=u*y-o*f-c*g-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,c=Math.sin,h=o(n/2),u=o(s/2),f=o(r/2),g=c(n/2),d=c(s/2),y=c(r/2);switch(a){case"XYZ":this._x=g*u*f+h*d*y,this._y=h*d*f-g*u*y,this._z=h*u*y+g*d*f,this._w=h*u*f-g*d*y;break;case"YXZ":this._x=g*u*f+h*d*y,this._y=h*d*f-g*u*y,this._z=h*u*y-g*d*f,this._w=h*u*f+g*d*y;break;case"ZXY":this._x=g*u*f-h*d*y,this._y=h*d*f+g*u*y,this._z=h*u*y+g*d*f,this._w=h*u*f-g*d*y;break;case"ZYX":this._x=g*u*f-h*d*y,this._y=h*d*f+g*u*y,this._z=h*u*y-g*d*f,this._w=h*u*f+g*d*y;break;case"YZX":this._x=g*u*f+h*d*y,this._y=h*d*f+g*u*y,this._z=h*u*y-g*d*f,this._w=h*u*f-g*d*y;break;case"XZY":this._x=g*u*f-h*d*y,this._y=h*d*f-g*u*y,this._z=h*u*y+g*d*f,this._w=h*u*f+g*d*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],c=e[9],h=e[2],u=e[6],f=e[10],g=n+o+f;if(g>0){let d=.5/Math.sqrt(g+1);this._w=.25/d,this._x=(u-c)*d,this._y=(r-h)*d,this._z=(a-s)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(u-c)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+h)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(r-h)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(c+u)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+h)/d,this._y=(c+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ii(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,c=e._y,h=e._z,u=e._w;return this._x=n*u+a*o+s*h-r*c,this._y=s*u+a*c+r*o-n*h,this._z=r*u+a*h+n*c-s*o,this._w=a*u-n*o-s*c-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let c=1-o*o;if(c<=Number.EPSILON){let d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}let h=Math.sqrt(c),u=Math.atan2(h,o),f=Math.sin((1-e)*u)/h,g=Math.sin(e*u)/h;return this._w=a*f+this._w*g,this._x=n*f+this._x*g,this._y=s*f+this._y*g,this._z=r*f+this._z*g,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(e0.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(e0.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,c=t.w,h=2*(a*s-o*n),u=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+c*h+a*f-o*u,this.y=n+c*u+o*h-r*f,this.z=s+c*f+r*u-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,c=e.z;return this.x=s*c-r*o,this.y=r*a-n*c,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return cf.copy(this).projectOnVector(t),this.sub(cf)}reflect(t){return this.sub(cf.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ii(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},cf=new W,e0=new xs,es=class{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(qs.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(qs.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=qs.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,qs):qs.fromBufferAttribute(r,a),qs.applyMatrix4(t.matrixWorld),this.expandByPoint(qs);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),vc.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vc.copy(n.boundingBox)),vc.applyMatrix4(t.matrixWorld),this.union(vc)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,qs),qs.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(cl),Mc.subVectors(this.max,cl),oa.subVectors(t.a,cl),aa.subVectors(t.b,cl),la.subVectors(t.c,cl),$r.subVectors(aa,oa),Zr.subVectors(la,aa),vo.subVectors(oa,la);let e=[0,-$r.z,$r.y,0,-Zr.z,Zr.y,0,-vo.z,vo.y,$r.z,0,-$r.x,Zr.z,0,-Zr.x,vo.z,0,-vo.x,-$r.y,$r.x,0,-Zr.y,Zr.x,0,-vo.y,vo.x,0];return!hf(e,oa,aa,la,Mc)||(e=[1,0,0,0,1,0,0,0,1],!hf(e,oa,aa,la,Mc))?!1:(bc.crossVectors($r,Zr),e=[bc.x,bc.y,bc.z],hf(e,oa,aa,la,Mc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,qs).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(qs).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Tr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Tr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Tr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Tr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Tr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Tr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Tr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Tr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Tr),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Tr=[new W,new W,new W,new W,new W,new W,new W,new W],qs=new W,vc=new es,oa=new W,aa=new W,la=new W,$r=new W,Zr=new W,vo=new W,cl=new W,Mc=new W,bc=new W,Mo=new W;function hf(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){Mo.fromArray(i,r);let o=s.x*Math.abs(Mo.x)+s.y*Math.abs(Mo.y)+s.z*Math.abs(Mo.z),c=t.dot(Mo),h=e.dot(Mo),u=n.dot(Mo);if(Math.max(-Math.max(c,h,u),Math.min(c,h,u))>o)return!1}return!0}var qy=new es,hl=new W,uf=new W,ys=class{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):qy.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;hl.subVectors(t,this.center);let e=hl.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(hl,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(uf.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(hl.copy(t.center).add(uf)),this.expandByPoint(hl.copy(t.center).sub(uf))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Ar=new W,ff=new W,Sc=new W,Jr=new W,df=new W,Ec=new W,pf=new W,Po=class{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Ar)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Ar.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Ar.copy(this.origin).addScaledVector(this.direction,e),Ar.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ff.copy(t).add(e).multiplyScalar(.5),Sc.copy(e).sub(t).normalize(),Jr.copy(this.origin).sub(ff);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Sc),o=Jr.dot(this.direction),c=-Jr.dot(Sc),h=Jr.lengthSq(),u=Math.abs(1-a*a),f,g,d,y;if(u>0)if(f=a*c-o,g=a*o-c,y=r*u,f>=0)if(g>=-y)if(g<=y){let v=1/u;f*=v,g*=v,d=f*(f+a*g+2*o)+g*(a*f+g+2*c)+h}else g=r,f=Math.max(0,-(a*g+o)),d=-f*f+g*(g+2*c)+h;else g=-r,f=Math.max(0,-(a*g+o)),d=-f*f+g*(g+2*c)+h;else g<=-y?(f=Math.max(0,-(-a*r+o)),g=f>0?-r:Math.min(Math.max(-r,-c),r),d=-f*f+g*(g+2*c)+h):g<=y?(f=0,g=Math.min(Math.max(-r,-c),r),d=g*(g+2*c)+h):(f=Math.max(0,-(a*r+o)),g=f>0?r:Math.min(Math.max(-r,-c),r),d=-f*f+g*(g+2*c)+h);else g=a>0?-r:r,f=Math.max(0,-(a*g+o)),d=-f*f+g*(g+2*c)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ff).addScaledVector(Sc,g),d}intersectSphere(t,e){Ar.subVectors(t.center,this.origin);let n=Ar.dot(this.direction),s=Ar.dot(Ar)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,c=n+a;return c<0?null:o<0?this.at(c,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,c,h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,g=this.origin;return h>=0?(n=(t.min.x-g.x)*h,s=(t.max.x-g.x)*h):(n=(t.max.x-g.x)*h,s=(t.min.x-g.x)*h),u>=0?(r=(t.min.y-g.y)*u,a=(t.max.y-g.y)*u):(r=(t.max.y-g.y)*u,a=(t.min.y-g.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-g.z)*f,c=(t.max.z-g.z)*f):(o=(t.max.z-g.z)*f,c=(t.min.z-g.z)*f),n>c||o>s)||((o>n||n!==n)&&(n=o),(c<s||s!==s)&&(s=c),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Ar)!==null}intersectTriangle(t,e,n,s,r){df.subVectors(e,t),Ec.subVectors(n,t),pf.crossVectors(df,Ec);let a=this.direction.dot(pf),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Jr.subVectors(this.origin,t);let c=o*this.direction.dot(Ec.crossVectors(Jr,Ec));if(c<0)return null;let h=o*this.direction.dot(df.cross(Jr));if(h<0||c+h>a)return null;let u=-o*Jr.dot(pf);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Nn=class i{constructor(t,e,n,s,r,a,o,c,h,u,f,g,d,y,v,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,c,h,u,f,g,d,y,v,p)}set(t,e,n,s,r,a,o,c,h,u,f,g,d,y,v,p){let x=this.elements;return x[0]=t,x[4]=e,x[8]=n,x[12]=s,x[1]=r,x[5]=a,x[9]=o,x[13]=c,x[2]=h,x[6]=u,x[10]=f,x[14]=g,x[3]=d,x[7]=y,x[11]=v,x[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/ca.setFromMatrixColumn(t,0).length(),r=1/ca.setFromMatrixColumn(t,1).length(),a=1/ca.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),c=Math.cos(s),h=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let g=a*u,d=a*f,y=o*u,v=o*f;e[0]=c*u,e[4]=-c*f,e[8]=h,e[1]=d+y*h,e[5]=g-v*h,e[9]=-o*c,e[2]=v-g*h,e[6]=y+d*h,e[10]=a*c}else if(t.order==="YXZ"){let g=c*u,d=c*f,y=h*u,v=h*f;e[0]=g+v*o,e[4]=y*o-d,e[8]=a*h,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=d*o-y,e[6]=v+g*o,e[10]=a*c}else if(t.order==="ZXY"){let g=c*u,d=c*f,y=h*u,v=h*f;e[0]=g-v*o,e[4]=-a*f,e[8]=y+d*o,e[1]=d+y*o,e[5]=a*u,e[9]=v-g*o,e[2]=-a*h,e[6]=o,e[10]=a*c}else if(t.order==="ZYX"){let g=a*u,d=a*f,y=o*u,v=o*f;e[0]=c*u,e[4]=y*h-d,e[8]=g*h+v,e[1]=c*f,e[5]=v*h+g,e[9]=d*h-y,e[2]=-h,e[6]=o*c,e[10]=a*c}else if(t.order==="YZX"){let g=a*c,d=a*h,y=o*c,v=o*h;e[0]=c*u,e[4]=v-g*f,e[8]=y*f+d,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-h*u,e[6]=d*f+y,e[10]=g-v*f}else if(t.order==="XZY"){let g=a*c,d=a*h,y=o*c,v=o*h;e[0]=c*u,e[4]=-f,e[8]=h*u,e[1]=g*f+v,e[5]=a*u,e[9]=d*f-y,e[2]=y*f-d,e[6]=o*u,e[10]=v*f+g}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Yy,t,$y)}lookAt(t,e,n){let s=this.elements;return Es.subVectors(t,e),Es.lengthSq()===0&&(Es.z=1),Es.normalize(),jr.crossVectors(n,Es),jr.lengthSq()===0&&(Math.abs(n.z)===1?Es.x+=1e-4:Es.z+=1e-4,Es.normalize(),jr.crossVectors(n,Es)),jr.normalize(),wc.crossVectors(Es,jr),s[0]=jr.x,s[4]=wc.x,s[8]=Es.x,s[1]=jr.y,s[5]=wc.y,s[9]=Es.y,s[2]=jr.z,s[6]=wc.z,s[10]=Es.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],c=n[8],h=n[12],u=n[1],f=n[5],g=n[9],d=n[13],y=n[2],v=n[6],p=n[10],x=n[14],A=n[3],M=n[7],L=n[11],R=n[15],T=s[0],N=s[4],K=s[8],C=s[12],w=s[1],it=s[5],mt=s[9],Kt=s[13],Q=s[2],lt=s[6],bt=s[10],Wt=s[14],Zt=s[3],At=s[7],Yt=s[11],le=s[15];return r[0]=a*T+o*w+c*Q+h*Zt,r[4]=a*N+o*it+c*lt+h*At,r[8]=a*K+o*mt+c*bt+h*Yt,r[12]=a*C+o*Kt+c*Wt+h*le,r[1]=u*T+f*w+g*Q+d*Zt,r[5]=u*N+f*it+g*lt+d*At,r[9]=u*K+f*mt+g*bt+d*Yt,r[13]=u*C+f*Kt+g*Wt+d*le,r[2]=y*T+v*w+p*Q+x*Zt,r[6]=y*N+v*it+p*lt+x*At,r[10]=y*K+v*mt+p*bt+x*Yt,r[14]=y*C+v*Kt+p*Wt+x*le,r[3]=A*T+M*w+L*Q+R*Zt,r[7]=A*N+M*it+L*lt+R*At,r[11]=A*K+M*mt+L*bt+R*Yt,r[15]=A*C+M*Kt+L*Wt+R*le,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],c=t[9],h=t[13],u=t[2],f=t[6],g=t[10],d=t[14],y=t[3],v=t[7],p=t[11],x=t[15];return y*(+r*c*f-s*h*f-r*o*g+n*h*g+s*o*d-n*c*d)+v*(+e*c*d-e*h*g+r*a*g-s*a*d+s*h*u-r*c*u)+p*(+e*h*f-e*o*d-r*a*f+n*a*d+r*o*u-n*h*u)+x*(-s*o*u-e*c*f+e*o*g+s*a*f-n*a*g+n*c*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],c=t[6],h=t[7],u=t[8],f=t[9],g=t[10],d=t[11],y=t[12],v=t[13],p=t[14],x=t[15],A=f*p*h-v*g*h+v*c*d-o*p*d-f*c*x+o*g*x,M=y*g*h-u*p*h-y*c*d+a*p*d+u*c*x-a*g*x,L=u*v*h-y*f*h+y*o*d-a*v*d-u*o*x+a*f*x,R=y*f*c-u*v*c-y*o*g+a*v*g+u*o*p-a*f*p,T=e*A+n*M+s*L+r*R;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let N=1/T;return t[0]=A*N,t[1]=(v*g*r-f*p*r-v*s*d+n*p*d+f*s*x-n*g*x)*N,t[2]=(o*p*r-v*c*r+v*s*h-n*p*h-o*s*x+n*c*x)*N,t[3]=(f*c*r-o*g*r-f*s*h+n*g*h+o*s*d-n*c*d)*N,t[4]=M*N,t[5]=(u*p*r-y*g*r+y*s*d-e*p*d-u*s*x+e*g*x)*N,t[6]=(y*c*r-a*p*r-y*s*h+e*p*h+a*s*x-e*c*x)*N,t[7]=(a*g*r-u*c*r+u*s*h-e*g*h-a*s*d+e*c*d)*N,t[8]=L*N,t[9]=(y*f*r-u*v*r-y*n*d+e*v*d+u*n*x-e*f*x)*N,t[10]=(a*v*r-y*o*r+y*n*h-e*v*h-a*n*x+e*o*x)*N,t[11]=(u*o*r-a*f*r-u*n*h+e*f*h+a*n*d-e*o*d)*N,t[12]=R*N,t[13]=(u*v*s-y*f*s+y*n*g-e*v*g-u*n*p+e*f*p)*N,t[14]=(y*o*s-a*v*s-y*n*c+e*v*c+a*n*p-e*o*p)*N,t[15]=(a*f*s-u*o*s+u*n*c-e*f*c-a*n*g+e*o*g)*N,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,c=t.z,h=r*a,u=r*o;return this.set(h*a+n,h*o-s*c,h*c+s*o,0,h*o+s*c,u*o+n,u*c-s*a,0,h*c-s*o,u*c+s*a,r*c*c+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,c=e._w,h=r+r,u=a+a,f=o+o,g=r*h,d=r*u,y=r*f,v=a*u,p=a*f,x=o*f,A=c*h,M=c*u,L=c*f,R=n.x,T=n.y,N=n.z;return s[0]=(1-(v+x))*R,s[1]=(d+L)*R,s[2]=(y-M)*R,s[3]=0,s[4]=(d-L)*T,s[5]=(1-(g+x))*T,s[6]=(p+A)*T,s[7]=0,s[8]=(y+M)*N,s[9]=(p-A)*N,s[10]=(1-(g+v))*N,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=ca.set(s[0],s[1],s[2]).length(),a=ca.set(s[4],s[5],s[6]).length(),o=ca.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ys.copy(this);let h=1/r,u=1/a,f=1/o;return Ys.elements[0]*=h,Ys.elements[1]*=h,Ys.elements[2]*=h,Ys.elements[4]*=u,Ys.elements[5]*=u,Ys.elements[6]*=u,Ys.elements[8]*=f,Ys.elements[9]*=f,Ys.elements[10]*=f,e.setFromRotationMatrix(Ys),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Ir){let c=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),g=(n+s)/(n-s),d,y;if(o===Ir)d=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===th)d=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return c[0]=h,c[4]=0,c[8]=f,c[12]=0,c[1]=0,c[5]=u,c[9]=g,c[13]=0,c[2]=0,c[6]=0,c[10]=d,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Ir){let c=this.elements,h=1/(e-t),u=1/(n-s),f=1/(a-r),g=(e+t)*h,d=(n+s)*u,y,v;if(o===Ir)y=(a+r)*f,v=-2*f;else if(o===th)y=r*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return c[0]=2*h,c[4]=0,c[8]=0,c[12]=-g,c[1]=0,c[5]=2*u,c[9]=0,c[13]=-d,c[2]=0,c[6]=0,c[10]=v,c[14]=-y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ca=new W,Ys=new Nn,Yy=new W(0,0,0),$y=new W(1,1,1),jr=new W,wc=new W,Es=new W,n0=new Nn,i0=new xs,oh=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],c=s[1],h=s[5],u=s[9],f=s[2],g=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Ii(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(g,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ii(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(c,h)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ii(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(c,r));break;case"ZYX":this._y=Math.asin(-Ii(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(g,d),this._z=Math.atan2(c,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Ii(c,-1,1)),Math.abs(c)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ii(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(g,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return n0.makeRotationFromQuaternion(t),this.setFromRotationMatrix(n0,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return i0.setFromEuler(this),this.setFromQuaternion(i0,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};oh.DEFAULT_ORDER="XYZ";var El=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Zy=0,s0=new W,ha=new xs,Rr=new Nn,Tc=new W,ul=new W,Jy=new W,jy=new xs,r0=new W(1,0,0),o0=new W(0,1,0),a0=new W(0,0,1),Ky={type:"added"},Qy={type:"removed"},vi=class i extends gr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Zy++}),this.uuid=mr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new W,e=new oh,n=new xs,s=new W(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Nn},normalMatrix:{value:new En}}),this.matrix=new Nn,this.matrixWorld=new Nn,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new El,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ha.setFromAxisAngle(t,e),this.quaternion.multiply(ha),this}rotateOnWorldAxis(t,e){return ha.setFromAxisAngle(t,e),this.quaternion.premultiply(ha),this}rotateX(t){return this.rotateOnAxis(r0,t)}rotateY(t){return this.rotateOnAxis(o0,t)}rotateZ(t){return this.rotateOnAxis(a0,t)}translateOnAxis(t,e){return s0.copy(t).applyQuaternion(this.quaternion),this.position.add(s0.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(r0,t)}translateY(t){return this.translateOnAxis(o0,t)}translateZ(t){return this.translateOnAxis(a0,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Rr.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Tc.copy(t):Tc.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ul.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Rr.lookAt(ul,Tc,this.up):Rr.lookAt(Tc,ul,this.up),this.quaternion.setFromRotationMatrix(Rr),s&&(Rr.extractRotation(s.matrixWorld),ha.setFromRotationMatrix(Rr),this.quaternion.premultiply(ha.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Ky)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Qy)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Rr.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Rr.multiply(t.parent.matrixWorld)),t.applyMatrix4(Rr),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ul,t,Jy),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ul,jy,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,c){return o[c.uuid]===void 0&&(o[c.uuid]=c.toJSON(t)),c.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let c=o.shapes;if(Array.isArray(c))for(let h=0,u=c.length;h<u;h++){let f=c[h];r(t.shapes,f)}else r(t.shapes,c)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let c=0,h=this.material.length;c<h;c++)o.push(r(t.materials,this.material[c]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let c=this.animations[o];s.animations.push(r(t.animations,c))}}if(e){let o=a(t.geometries),c=a(t.materials),h=a(t.textures),u=a(t.images),f=a(t.shapes),g=a(t.skeletons),d=a(t.animations),y=a(t.nodes);o.length>0&&(n.geometries=o),c.length>0&&(n.materials=c),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),g.length>0&&(n.skeletons=g),d.length>0&&(n.animations=d),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let c=[];for(let h in o){let u=o[h];delete u.metadata,c.push(u)}return c}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};vi.DEFAULT_UP=new W(0,1,0);vi.DEFAULT_MATRIX_AUTO_UPDATE=!0;vi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $s=new W,Cr=new W,mf=new W,Pr=new W,ua=new W,fa=new W,l0=new W,gf=new W,xf=new W,yf=new W,Ac=!1,Ma=class i{constructor(t=new W,e=new W,n=new W){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),$s.subVectors(t,e),s.cross($s);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){$s.subVectors(s,e),Cr.subVectors(n,e),mf.subVectors(t,e);let a=$s.dot($s),o=$s.dot(Cr),c=$s.dot(mf),h=Cr.dot(Cr),u=Cr.dot(mf),f=a*h-o*o;if(f===0)return r.set(0,0,0),null;let g=1/f,d=(h*c-o*u)*g,y=(a*u-o*c)*g;return r.set(1-d-y,y,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Pr)===null?!1:Pr.x>=0&&Pr.y>=0&&Pr.x+Pr.y<=1}static getUV(t,e,n,s,r,a,o,c){return Ac===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ac=!0),this.getInterpolation(t,e,n,s,r,a,o,c)}static getInterpolation(t,e,n,s,r,a,o,c){return this.getBarycoord(t,e,n,s,Pr)===null?(c.x=0,c.y=0,"z"in c&&(c.z=0),"w"in c&&(c.w=0),null):(c.setScalar(0),c.addScaledVector(r,Pr.x),c.addScaledVector(a,Pr.y),c.addScaledVector(o,Pr.z),c)}static isFrontFacing(t,e,n,s){return $s.subVectors(n,e),Cr.subVectors(t,e),$s.cross(Cr).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $s.subVectors(this.c,this.b),Cr.subVectors(this.a,this.b),$s.cross(Cr).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Ac===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ac=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;ua.subVectors(s,n),fa.subVectors(r,n),gf.subVectors(t,n);let c=ua.dot(gf),h=fa.dot(gf);if(c<=0&&h<=0)return e.copy(n);xf.subVectors(t,s);let u=ua.dot(xf),f=fa.dot(xf);if(u>=0&&f<=u)return e.copy(s);let g=c*f-u*h;if(g<=0&&c>=0&&u<=0)return a=c/(c-u),e.copy(n).addScaledVector(ua,a);yf.subVectors(t,r);let d=ua.dot(yf),y=fa.dot(yf);if(y>=0&&d<=y)return e.copy(r);let v=d*h-c*y;if(v<=0&&h>=0&&y<=0)return o=h/(h-y),e.copy(n).addScaledVector(fa,o);let p=u*y-d*f;if(p<=0&&f-u>=0&&d-y>=0)return l0.subVectors(r,s),o=(f-u)/(f-u+(d-y)),e.copy(s).addScaledVector(l0,o);let x=1/(p+v+g);return a=v*x,o=g*x,e.copy(n).addScaledVector(ua,a).addScaledVector(fa,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},cg={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Kr={h:0,s:0,l:0},Rc={h:0,s:0,l:0};function _f(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var fn=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=kn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wn.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Wn.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wn.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Wn.workingColorSpace){if(t=Rd(t,1),e=Ii(e,0,1),n=Ii(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=_f(a,r,t+1/3),this.g=_f(a,r,t),this.b=_f(a,r,t-1/3)}return Wn.toWorkingColorSpace(this,s),this}setStyle(t,e=kn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=kn){let n=cg[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=Ta(t.r),this.g=Ta(t.g),this.b=Ta(t.b),this}copyLinearToSRGB(t){return this.r=af(t.r),this.g=af(t.g),this.b=af(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=kn){return Wn.fromWorkingColorSpace(ts.copy(this),t),Math.round(Ii(ts.r*255,0,255))*65536+Math.round(Ii(ts.g*255,0,255))*256+Math.round(Ii(ts.b*255,0,255))}getHexString(t=kn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wn.workingColorSpace){Wn.fromWorkingColorSpace(ts.copy(this),e);let n=ts.r,s=ts.g,r=ts.b,a=Math.max(n,s,r),o=Math.min(n,s,r),c,h,u=(o+a)/2;if(o===a)c=0,h=0;else{let f=a-o;switch(h=u<=.5?f/(a+o):f/(2-a-o),a){case n:c=(s-r)/f+(s<r?6:0);break;case s:c=(r-n)/f+2;break;case r:c=(n-s)/f+4;break}c/=6}return t.h=c,t.s=h,t.l=u,t}getRGB(t,e=Wn.workingColorSpace){return Wn.fromWorkingColorSpace(ts.copy(this),e),t.r=ts.r,t.g=ts.g,t.b=ts.b,t}getStyle(t=kn){Wn.fromWorkingColorSpace(ts.copy(this),t);let e=ts.r,n=ts.g,s=ts.b;return t!==kn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Kr),this.setHSL(Kr.h+t,Kr.s+e,Kr.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Kr),t.getHSL(Rc);let n=gl(Kr.h,Rc.h,e),s=gl(Kr.s,Rc.s,e),r=gl(Kr.l,Rc.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ts=new fn;fn.NAMES=cg;var t_=0,xr=class extends gr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:t_++}),this.uuid=mr(),this.name="",this.type="Material",this.blending=wa,this.side=so,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Df,this.blendDst=Uf,this.blendEquation=wo,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fn(0,0,0),this.blendAlpha=0,this.depthFunc=$c,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Zm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=sa,this.stencilZFail=sa,this.stencilZPass=sa,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==wa&&(n.blending=this.blending),this.side!==so&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Df&&(n.blendSrc=this.blendSrc),this.blendDst!==Uf&&(n.blendDst=this.blendDst),this.blendEquation!==wo&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==$c&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Zm&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==sa&&(n.stencilFail=this.stencilFail),this.stencilZFail!==sa&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==sa&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let c=r[o];delete c.metadata,a.push(c)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},os=class extends xr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ed,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ri=new W,Cc=new fe,$n=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Bf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=to,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Cc.fromBufferAttribute(this,e),Cc.applyMatrix3(t),this.setXY(e,Cc.x,Cc.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ri.fromBufferAttribute(this,e),Ri.applyMatrix3(t),this.setXYZ(e,Ri.x,Ri.y,Ri.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ri.fromBufferAttribute(this,e),Ri.applyMatrix4(t),this.setXYZ(e,Ri.x,Ri.y,Ri.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ri.fromBufferAttribute(this,e),Ri.applyNormalMatrix(t),this.setXYZ(e,Ri.x,Ri.y,Ri.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ri.fromBufferAttribute(this,e),Ri.transformDirection(t),this.setXYZ(e,Ri.x,Ri.y,Ri.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=pr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=pr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=pr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=pr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=pr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array),r=Gn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Bf&&(t.usage=this.usage),t}};var ah=class extends $n{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var lh=class extends $n{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var en=class extends $n{constructor(t,e,n){super(new Float32Array(t),e,n)}};var e_=0,Os=new Nn,vf=new vi,da=new W,ws=new es,fl=new es,ki=new W,Ln=class i extends gr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:e_++}),this.uuid=mr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(lg(t)?lh:ah)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new En().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Os.makeRotationFromQuaternion(t),this.applyMatrix4(Os),this}rotateX(t){return Os.makeRotationX(t),this.applyMatrix4(Os),this}rotateY(t){return Os.makeRotationY(t),this.applyMatrix4(Os),this}rotateZ(t){return Os.makeRotationZ(t),this.applyMatrix4(Os),this}translate(t,e,n){return Os.makeTranslation(t,e,n),this.applyMatrix4(Os),this}scale(t,e,n){return Os.makeScale(t,e,n),this.applyMatrix4(Os),this}lookAt(t){return vf.lookAt(t),vf.updateMatrix(),this.applyMatrix4(vf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(da).negate(),this.translate(da.x,da.y,da.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new en(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];ws.setFromBufferAttribute(r),this.morphTargetsRelative?(ki.addVectors(this.boundingBox.min,ws.min),this.boundingBox.expandByPoint(ki),ki.addVectors(this.boundingBox.max,ws.max),this.boundingBox.expandByPoint(ki)):(this.boundingBox.expandByPoint(ws.min),this.boundingBox.expandByPoint(ws.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ys);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new W,1/0);return}if(t){let n=this.boundingSphere.center;if(ws.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];fl.setFromBufferAttribute(o),this.morphTargetsRelative?(ki.addVectors(ws.min,fl.min),ws.expandByPoint(ki),ki.addVectors(ws.max,fl.max),ws.expandByPoint(ki)):(ws.expandByPoint(fl.min),ws.expandByPoint(fl.max))}ws.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)ki.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ki));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],c=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)ki.fromBufferAttribute(o,h),c&&(da.fromBufferAttribute(t,h),ki.add(da)),s=Math.max(s,n.distanceToSquared(ki))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new $n(new Float32Array(4*o),4));let c=this.getAttribute("tangent").array,h=[],u=[];for(let w=0;w<o;w++)h[w]=new W,u[w]=new W;let f=new W,g=new W,d=new W,y=new fe,v=new fe,p=new fe,x=new W,A=new W;function M(w,it,mt){f.fromArray(s,w*3),g.fromArray(s,it*3),d.fromArray(s,mt*3),y.fromArray(a,w*2),v.fromArray(a,it*2),p.fromArray(a,mt*2),g.sub(f),d.sub(f),v.sub(y),p.sub(y);let Kt=1/(v.x*p.y-p.x*v.y);isFinite(Kt)&&(x.copy(g).multiplyScalar(p.y).addScaledVector(d,-v.y).multiplyScalar(Kt),A.copy(d).multiplyScalar(v.x).addScaledVector(g,-p.x).multiplyScalar(Kt),h[w].add(x),h[it].add(x),h[mt].add(x),u[w].add(A),u[it].add(A),u[mt].add(A))}let L=this.groups;L.length===0&&(L=[{start:0,count:n.length}]);for(let w=0,it=L.length;w<it;++w){let mt=L[w],Kt=mt.start,Q=mt.count;for(let lt=Kt,bt=Kt+Q;lt<bt;lt+=3)M(n[lt+0],n[lt+1],n[lt+2])}let R=new W,T=new W,N=new W,K=new W;function C(w){N.fromArray(r,w*3),K.copy(N);let it=h[w];R.copy(it),R.sub(N.multiplyScalar(N.dot(it))).normalize(),T.crossVectors(K,it);let Kt=T.dot(u[w])<0?-1:1;c[w*4]=R.x,c[w*4+1]=R.y,c[w*4+2]=R.z,c[w*4+3]=Kt}for(let w=0,it=L.length;w<it;++w){let mt=L[w],Kt=mt.start,Q=mt.count;for(let lt=Kt,bt=Kt+Q;lt<bt;lt+=3)C(n[lt+0]),C(n[lt+1]),C(n[lt+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new $n(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let g=0,d=n.count;g<d;g++)n.setXYZ(g,0,0,0);let s=new W,r=new W,a=new W,o=new W,c=new W,h=new W,u=new W,f=new W;if(t)for(let g=0,d=t.count;g<d;g+=3){let y=t.getX(g+0),v=t.getX(g+1),p=t.getX(g+2);s.fromBufferAttribute(e,y),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,p),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,y),c.fromBufferAttribute(n,v),h.fromBufferAttribute(n,p),o.add(u),c.add(u),h.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(v,c.x,c.y,c.z),n.setXYZ(p,h.x,h.y,h.z)}else for(let g=0,d=e.count;g<d;g+=3)s.fromBufferAttribute(e,g+0),r.fromBufferAttribute(e,g+1),a.fromBufferAttribute(e,g+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(g+0,u.x,u.y,u.z),n.setXYZ(g+1,u.x,u.y,u.z),n.setXYZ(g+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ki.fromBufferAttribute(t,e),ki.normalize(),t.setXYZ(e,ki.x,ki.y,ki.z)}toNonIndexed(){function t(o,c){let h=o.array,u=o.itemSize,f=o.normalized,g=new h.constructor(c.length*u),d=0,y=0;for(let v=0,p=c.length;v<p;v++){o.isInterleavedBufferAttribute?d=c[v]*o.data.stride+o.offset:d=c[v]*u;for(let x=0;x<u;x++)g[y++]=h[d++]}return new $n(g,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let c=s[o],h=t(c,n);e.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let c=[],h=r[o];for(let u=0,f=h.length;u<f;u++){let g=h[u],d=t(g,n);c.push(d)}e.morphAttributes[o]=c}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,c=a.length;o<c;o++){let h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let c=this.parameters;for(let h in c)c[h]!==void 0&&(t[h]=c[h]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let c in n){let h=n[c];t.data.attributes[c]=h.toJSON(t.data)}let s={},r=!1;for(let c in this.morphAttributes){let h=this.morphAttributes[c],u=[];for(let f=0,g=h.length;f<g;f++){let d=h[f];u.push(d.toJSON(t.data))}u.length>0&&(s[c]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let h in s){let u=s[h];this.setAttribute(h,u.clone(e))}let r=t.morphAttributes;for(let h in r){let u=[],f=r[h];for(let g=0,d=f.length;g<d;g++)u.push(f[g].clone(e));this.morphAttributes[h]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let h=0,u=a.length;h<u;h++){let f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let c=t.boundingSphere;return c!==null&&(this.boundingSphere=c.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},c0=new Nn,bo=new Po,Pc=new ys,h0=new W,pa=new W,ma=new W,ga=new W,Mf=new W,Lc=new W,Ic=new fe,Dc=new fe,Uc=new fe,u0=new W,f0=new W,d0=new W,Nc=new W,Oc=new W,Ke=class extends vi{constructor(t=new Ln,e=new os){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){Lc.set(0,0,0);for(let c=0,h=r.length;c<h;c++){let u=o[c],f=r[c];u!==0&&(Mf.fromBufferAttribute(f,t),a?Lc.addScaledVector(Mf,u):Lc.addScaledVector(Mf.sub(e),u))}e.add(Lc)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pc.copy(n.boundingSphere),Pc.applyMatrix4(r),bo.copy(t.ray).recast(t.near),!(Pc.containsPoint(bo.origin)===!1&&(bo.intersectSphere(Pc,h0)===null||bo.origin.distanceToSquared(h0)>(t.far-t.near)**2))&&(c0.copy(r).invert(),bo.copy(t.ray).applyMatrix4(c0),!(n.boundingBox!==null&&bo.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,bo)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,c=r.attributes.position,h=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,g=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,v=g.length;y<v;y++){let p=g[y],x=a[p.materialIndex],A=Math.max(p.start,d.start),M=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let L=A,R=M;L<R;L+=3){let T=o.getX(L),N=o.getX(L+1),K=o.getX(L+2);s=Fc(this,x,t,n,h,u,f,T,N,K),s&&(s.faceIndex=Math.floor(L/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let p=y,x=v;p<x;p+=3){let A=o.getX(p),M=o.getX(p+1),L=o.getX(p+2);s=Fc(this,a,t,n,h,u,f,A,M,L),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(c!==void 0)if(Array.isArray(a))for(let y=0,v=g.length;y<v;y++){let p=g[y],x=a[p.materialIndex],A=Math.max(p.start,d.start),M=Math.min(c.count,Math.min(p.start+p.count,d.start+d.count));for(let L=A,R=M;L<R;L+=3){let T=L,N=L+1,K=L+2;s=Fc(this,x,t,n,h,u,f,T,N,K),s&&(s.faceIndex=Math.floor(L/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),v=Math.min(c.count,d.start+d.count);for(let p=y,x=v;p<x;p+=3){let A=p,M=p+1,L=p+2;s=Fc(this,a,t,n,h,u,f,A,M,L),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function n_(i,t,e,n,s,r,a,o){let c;if(t.side===gs?c=n.intersectTriangle(a,r,s,!0,o):c=n.intersectTriangle(s,r,a,t.side===so,o),c===null)return null;Oc.copy(o),Oc.applyMatrix4(i.matrixWorld);let h=e.ray.origin.distanceTo(Oc);return h<e.near||h>e.far?null:{distance:h,point:Oc.clone(),object:i}}function Fc(i,t,e,n,s,r,a,o,c,h){i.getVertexPosition(o,pa),i.getVertexPosition(c,ma),i.getVertexPosition(h,ga);let u=n_(i,t,e,n,pa,ma,ga,Nc);if(u){s&&(Ic.fromBufferAttribute(s,o),Dc.fromBufferAttribute(s,c),Uc.fromBufferAttribute(s,h),u.uv=Ma.getInterpolation(Nc,pa,ma,ga,Ic,Dc,Uc,new fe)),r&&(Ic.fromBufferAttribute(r,o),Dc.fromBufferAttribute(r,c),Uc.fromBufferAttribute(r,h),u.uv1=Ma.getInterpolation(Nc,pa,ma,ga,Ic,Dc,Uc,new fe),u.uv2=u.uv1),a&&(u0.fromBufferAttribute(a,o),f0.fromBufferAttribute(a,c),d0.fromBufferAttribute(a,h),u.normal=Ma.getInterpolation(Nc,pa,ma,ga,u0,f0,d0,new W),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:c,c:h,normal:new W,materialIndex:0};Ma.getNormal(pa,ma,ga,f.normal),u.face=f}return u}var Ci=class i extends Ln{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let c=[],h=[],u=[],f=[],g=0,d=0;y("z","y","x",-1,-1,n,e,t,a,r,0),y("z","y","x",1,-1,n,e,-t,a,r,1),y("x","z","y",1,1,t,n,e,s,a,2),y("x","z","y",1,-1,t,n,-e,s,a,3),y("x","y","z",1,-1,t,e,n,s,r,4),y("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(c),this.setAttribute("position",new en(h,3)),this.setAttribute("normal",new en(u,3)),this.setAttribute("uv",new en(f,2));function y(v,p,x,A,M,L,R,T,N,K,C){let w=L/N,it=R/K,mt=L/2,Kt=R/2,Q=T/2,lt=N+1,bt=K+1,Wt=0,Zt=0,At=new W;for(let Yt=0;Yt<bt;Yt++){let le=Yt*it-Kt;for(let Me=0;Me<lt;Me++){let Rt=Me*w-mt;At[v]=Rt*A,At[p]=le*M,At[x]=Q,h.push(At.x,At.y,At.z),At[v]=0,At[p]=0,At[x]=T>0?1:-1,u.push(At.x,At.y,At.z),f.push(Me/N),f.push(1-Yt/K),Wt+=1}}for(let Yt=0;Yt<K;Yt++)for(let le=0;le<N;le++){let Me=g+le+lt*Yt,Rt=g+le+lt*(Yt+1),Ft=g+(le+1)+lt*(Yt+1),ye=g+(le+1)+lt*Yt;c.push(Me,Rt,ye),c.push(Rt,Ft,ye),Zt+=6}o.addGroup(d,Zt,C),d+=Zt,g+=Wt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function La(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ss(i){let t={};for(let e=0;e<i.length;e++){let n=La(i[e]);for(let s in n)t[s]=n[s]}return t}function i_(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function hg(i){return i.getRenderTarget()===null?i.outputColorSpace:Wn.workingColorSpace}var Wh={clone:La,merge:ss},s_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,r_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Qs=class extends xr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=s_,this.fragmentShader=r_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=La(t.uniforms),this.uniformsGroups=i_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},ch=class extends vi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Nn,this.projectionMatrix=new Nn,this.projectionMatrixInverse=new Nn,this.coordinateSystem=Ir}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Gi=class extends ch{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Sl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ml*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Sl*2*Math.atan(Math.tan(ml*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ml*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let c=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/c,e-=a.offsetY*n/h,s*=a.width/c,n*=a.height/h}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},xa=-90,ya=1,Gf=class extends vi{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Gi(xa,ya,t,e);s.layers=this.layers,this.add(s);let r=new Gi(xa,ya,t,e);r.layers=this.layers,this.add(r);let a=new Gi(xa,ya,t,e);a.layers=this.layers,this.add(a);let o=new Gi(xa,ya,t,e);o.layers=this.layers,this.add(o);let c=new Gi(xa,ya,t,e);c.layers=this.layers,this.add(c);let h=new Gi(xa,ya,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,c]=e;for(let h of e)this.remove(h);if(t===Ir)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),c.up.set(0,1,0),c.lookAt(0,0,-1);else if(t===th)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),c.up.set(0,-1,0),c.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,c,h,u]=this.children,f=t.getRenderTarget(),g=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),y=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,c),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(f,g,d),t.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},hh=class extends Ts{constructor(t,e,n,s,r,a,o,c,h,u){t=t!==void 0?t:[],e=e!==void 0?e:Ra,super(t,e,n,s,r,a,o,c,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Wf=class extends Ur{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(xl("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Co?kn:Fs),this.texture=new hh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ms}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},s=new Ci(5,5,5),r=new Qs({name:"CubemapFromEquirect",uniforms:La(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:gs,blending:eo});r.uniforms.tEquirect.value=e;let a=new Ke(s,r),o=e.minFilter;return e.minFilter===Ml&&(e.minFilter=ms),new Gf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},bf=new W,o_=new W,a_=new En,Zs=class{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=bf.subVectors(n,e).cross(o_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(bf),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||a_.getNormalMatrix(t),s=this.coplanarPoint(bf).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},So=new ys,Bc=new W,wl=class{constructor(t=new Zs,e=new Zs,n=new Zs,s=new Zs,r=new Zs,a=new Zs){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Ir){let n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],c=s[3],h=s[4],u=s[5],f=s[6],g=s[7],d=s[8],y=s[9],v=s[10],p=s[11],x=s[12],A=s[13],M=s[14],L=s[15];if(n[0].setComponents(c-r,g-h,p-d,L-x).normalize(),n[1].setComponents(c+r,g+h,p+d,L+x).normalize(),n[2].setComponents(c+a,g+u,p+y,L+A).normalize(),n[3].setComponents(c-a,g-u,p-y,L-A).normalize(),n[4].setComponents(c-o,g-f,p-v,L-M).normalize(),e===Ir)n[5].setComponents(c+o,g+f,p+v,L+M).normalize();else if(e===th)n[5].setComponents(o,f,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),So.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),So.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(So)}intersectsSprite(t){return So.center.set(0,0,0),So.radius=.7071067811865476,So.applyMatrix4(t.matrixWorld),this.intersectsSphere(So)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Bc.x=s.normal.x>0?t.max.x:t.min.x,Bc.y=s.normal.y>0?t.max.y:t.min.y,Bc.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Bc)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function ug(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function l_(i,t){let e=t.isWebGL2,n=new WeakMap;function s(h,u){let f=h.array,g=h.usage,d=f.byteLength,y=i.createBuffer();i.bindBuffer(u,y),i.bufferData(u,f,g),h.onUploadCallback();let v;if(f instanceof Float32Array)v=i.FLOAT;else if(f instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)v=i.SHORT;else if(f instanceof Uint32Array)v=i.UNSIGNED_INT;else if(f instanceof Int32Array)v=i.INT;else if(f instanceof Int8Array)v=i.BYTE;else if(f instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:y,type:v,bytesPerElement:f.BYTES_PER_ELEMENT,version:h.version,size:d}}function r(h,u,f){let g=u.array,d=u._updateRange,y=u.updateRanges;if(i.bindBuffer(f,h),d.count===-1&&y.length===0&&i.bufferSubData(f,0,g),y.length!==0){for(let v=0,p=y.length;v<p;v++){let x=y[v];e?i.bufferSubData(f,x.start*g.BYTES_PER_ELEMENT,g,x.start,x.count):i.bufferSubData(f,x.start*g.BYTES_PER_ELEMENT,g.subarray(x.start,x.start+x.count))}u.clearUpdateRanges()}d.count!==-1&&(e?i.bufferSubData(f,d.offset*g.BYTES_PER_ELEMENT,g,d.offset,d.count):i.bufferSubData(f,d.offset*g.BYTES_PER_ELEMENT,g.subarray(d.offset,d.offset+d.count)),d.count=-1),u.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function o(h){h.isInterleavedBufferAttribute&&(h=h.data);let u=n.get(h);u&&(i.deleteBuffer(u.buffer),n.delete(h))}function c(h,u){if(h.isGLBufferAttribute){let g=n.get(h);(!g||g.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);let f=n.get(h);if(f===void 0)n.set(h,s(h,u));else if(f.version<h.version){if(f.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,h,u),f.version=h.version}}return{get:a,remove:o,update:c}}var _s=class i extends Ln{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),c=Math.floor(s),h=o+1,u=c+1,f=t/o,g=e/c,d=[],y=[],v=[],p=[];for(let x=0;x<u;x++){let A=x*g-a;for(let M=0;M<h;M++){let L=M*f-r;y.push(L,-A,0),v.push(0,0,1),p.push(M/o),p.push(1-x/c)}}for(let x=0;x<c;x++)for(let A=0;A<o;A++){let M=A+h*x,L=A+h*(x+1),R=A+1+h*(x+1),T=A+1+h*x;d.push(M,L,T),d.push(L,R,T)}this.setIndex(d),this.setAttribute("position",new en(y,3)),this.setAttribute("normal",new en(v,3)),this.setAttribute("uv",new en(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},c_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,h_=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,u_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,f_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,d_=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,p_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,m_=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,g_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,x_=`#ifdef USE_BATCHING
	attribute float batchId;
	uniform highp sampler2D batchingTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,y_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,__=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,v_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,M_=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,b_=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,S_=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,E_=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#pragma unroll_loop_start
	for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
		plane = clippingPlanes[ i ];
		if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
	}
	#pragma unroll_loop_end
	#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
		bool clipped = true;
		#pragma unroll_loop_start
		for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
		}
		#pragma unroll_loop_end
		if ( clipped ) discard;
	#endif
#endif`,w_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,T_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,A_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,R_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,C_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,P_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,L_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,I_=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
mat3 transposeMat3( const in mat3 m ) {
	mat3 tmp;
	tmp[ 0 ] = vec3( m[ 0 ].x, m[ 1 ].x, m[ 2 ].x );
	tmp[ 1 ] = vec3( m[ 0 ].y, m[ 1 ].y, m[ 2 ].y );
	tmp[ 2 ] = vec3( m[ 0 ].z, m[ 1 ].z, m[ 2 ].z );
	return tmp;
}
float luminance( const in vec3 rgb ) {
	const vec3 weights = vec3( 0.2126729, 0.7151522, 0.0721750 );
	return dot( weights, rgb );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,D_=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,U_=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,N_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,O_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,F_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,B_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,z_="gl_FragColor = linearToOutputTexel( gl_FragColor );",k_=`
const mat3 LINEAR_SRGB_TO_LINEAR_DISPLAY_P3 = mat3(
	vec3( 0.8224621, 0.177538, 0.0 ),
	vec3( 0.0331941, 0.9668058, 0.0 ),
	vec3( 0.0170827, 0.0723974, 0.9105199 )
);
const mat3 LINEAR_DISPLAY_P3_TO_LINEAR_SRGB = mat3(
	vec3( 1.2249401, - 0.2249404, 0.0 ),
	vec3( - 0.0420569, 1.0420571, 0.0 ),
	vec3( - 0.0196376, - 0.0786361, 1.0982735 )
);
vec4 LinearSRGBToLinearDisplayP3( in vec4 value ) {
	return vec4( value.rgb * LINEAR_SRGB_TO_LINEAR_DISPLAY_P3, value.a );
}
vec4 LinearDisplayP3ToLinearSRGB( in vec4 value ) {
	return vec4( value.rgb * LINEAR_DISPLAY_P3_TO_LINEAR_SRGB, value.a );
}
vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}
vec4 LinearToLinear( in vec4 value ) {
	return value;
}
vec4 LinearTosRGB( in vec4 value ) {
	return sRGBTransferOETF( value );
}`,H_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, vec3( flipEnvMap * reflectVec.x, reflectVec.yz ) );
	#else
		vec4 envColor = vec4( 0.0 );
	#endif
	#ifdef ENVMAP_BLENDING_MULTIPLY
		outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_MIX )
		outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
	#elif defined( ENVMAP_BLENDING_ADD )
		outgoingLight += envColor.xyz * specularStrength * reflectivity;
	#endif
#endif`,V_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,G_=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,W_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,X_=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,q_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Y_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,$_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,Z_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,J_=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,j_=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,K_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Q_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,tv=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,ev=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	#if defined ( LEGACY_LIGHTS )
		if ( cutoffDistance > 0.0 && decayExponent > 0.0 ) {
			return pow( saturate( - lightDistance / cutoffDistance + 1.0 ), decayExponent );
		}
		return 1.0;
	#else
		float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
		if ( cutoffDistance > 0.0 ) {
			distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
		}
		return distanceFalloff;
	#endif
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif`,nv=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, roughness * roughness) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,iv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,sv=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,rv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,ov=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,av=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb * ( 1.0 - metalnessFactor );
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = mix( min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = mix( vec3( 0.04 ), diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.07, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,lv=`struct PhysicalMaterial {
	vec3 diffuseColor;
	float roughness;
	vec3 specularColor;
	float specularF90;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		float v = 0.5 / ( gv + gl );
		return saturate(v);
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColor;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transposeMat3( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float a = roughness < 0.25 ? -339.2 * r2 + 161.4 * roughness - 25.9 : -8.48 * r2 + 14.3 * roughness - 9.95;
	float b = roughness < 0.25 ? 44.0 * r2 - 23.7 * roughness + 3.26 : 1.97 * r2 - 3.27 * roughness + 0.72;
	float DG = exp( a * dotNV + b ) + ( roughness < 0.25 ? 0.0 : 0.1 * ( roughness - 0.25 ) );
	return saturate( DG * RECIPROCAL_PI );
}
vec2 DFGApprox( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	const vec4 c0 = vec4( - 1, - 0.0275, - 0.572, 0.022 );
	const vec4 c1 = vec4( 1, 0.0425, 1.04, - 0.04 );
	vec4 r = roughness * c0 + c1;
	float a004 = min( r.x * r.x, exp2( - 9.28 * dotNV ) ) * r.x + r.y;
	vec2 fab = vec2( - 1.04, 1.04 ) * a004 + r.zw;
	return fab;
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	vec2 fab = DFGApprox( normal, viewDir, roughness );
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColor * t2.x + ( vec3( 1.0 ) - material.specularColor ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseColor * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
	#endif
	vec3 singleScattering = vec3( 0.0 );
	vec3 multiScattering = vec3( 0.0 );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnel, material.roughness, singleScattering, multiScattering );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScattering, multiScattering );
	#endif
	vec3 totalScattering = singleScattering + multiScattering;
	vec3 diffuse = material.diffuseColor * ( 1.0 - max( max( totalScattering.r, totalScattering.g ), totalScattering.b ) );
	reflectedLight.indirectSpecular += radiance * singleScattering;
	reflectedLight.indirectSpecular += multiScattering * cosineWeightedIrradiance;
	reflectedLight.indirectDiffuse += diffuse * cosineWeightedIrradiance;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,cv=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnel = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,hv=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD ) && defined( ENVMAP_TYPE_CUBE_UV )
		iblIrradiance += getIBLIrradiance( geometryNormal );
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,uv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,fv=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,dv=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,pv=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,mv=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,gv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,xv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,yv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,_v=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,vv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,Mv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,bv=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,Sv=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		objectNormal += morphNormal0 * morphTargetInfluences[ 0 ];
		objectNormal += morphNormal1 * morphTargetInfluences[ 1 ];
		objectNormal += morphNormal2 * morphTargetInfluences[ 2 ];
		objectNormal += morphNormal3 * morphTargetInfluences[ 3 ];
	#endif
#endif`,Ev=`#ifdef USE_MORPHTARGETS
	uniform float morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
		uniform sampler2DArray morphTargetsTexture;
		uniform ivec2 morphTargetsTextureSize;
		vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
			int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
			int y = texelIndex / morphTargetsTextureSize.x;
			int x = texelIndex - y * morphTargetsTextureSize.x;
			ivec3 morphUV = ivec3( x, y, morphTargetIndex );
			return texelFetch( morphTargetsTexture, morphUV, 0 );
		}
	#else
		#ifndef USE_MORPHNORMALS
			uniform float morphTargetInfluences[ 8 ];
		#else
			uniform float morphTargetInfluences[ 4 ];
		#endif
	#endif
#endif`,wv=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	#ifdef MORPHTARGETS_TEXTURE
		for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
			if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
		}
	#else
		transformed += morphTarget0 * morphTargetInfluences[ 0 ];
		transformed += morphTarget1 * morphTargetInfluences[ 1 ];
		transformed += morphTarget2 * morphTargetInfluences[ 2 ];
		transformed += morphTarget3 * morphTargetInfluences[ 3 ];
		#ifndef USE_MORPHNORMALS
			transformed += morphTarget4 * morphTargetInfluences[ 4 ];
			transformed += morphTarget5 * morphTargetInfluences[ 5 ];
			transformed += morphTarget6 * morphTargetInfluences[ 6 ];
			transformed += morphTarget7 * morphTargetInfluences[ 7 ];
		#endif
	#endif
#endif`,Tv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,Av=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Rv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Pv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Lv=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Iv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Dv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Uv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Ov=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Fv=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;
const vec3 PackFactors = vec3( 256. * 256. * 256., 256. * 256., 256. );
const vec4 UnpackFactors = UnpackDownscale / vec4( PackFactors, 1. );
const float ShiftRight8 = 1. / 256.;
vec4 packDepthToRGBA( const in float v ) {
	vec4 r = vec4( fract( v * PackFactors ), v );
	r.yzw -= r.xyz * ShiftRight8;	return r * PackUpscale;
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors );
}
vec2 packDepthToRG( in highp float v ) {
	return packDepthToRGBA( v ).yx;
}
float unpackRGToDepth( const in highp vec2 v ) {
	return unpackRGBAToDepth( vec4( v.xy, 0.0, 0.0 ) );
}
vec4 pack2HalfToRGBA( vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return depth * ( near - far ) - near;
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	return ( near * far ) / ( ( far - near ) * depth - far );
}`,Bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,zv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Hv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Vv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Gv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Wv=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform sampler2D pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	float texture2DCompare( sampler2D depths, vec2 uv, float compare ) {
		return step( compare, unpackRGBAToDepth( texture2D( depths, uv ) ) );
	}
	vec2 texture2DDistribution( sampler2D shadow, vec2 uv ) {
		return unpackRGBATo2Half( texture2D( shadow, uv ) );
	}
	float VSMShadow (sampler2D shadow, vec2 uv, float compare ){
		float occlusion = 1.0;
		vec2 distribution = texture2DDistribution( shadow, uv );
		float hard_shadow = step( compare , distribution.x );
		if (hard_shadow != 1.0 ) {
			float distance = compare - distribution.x ;
			float variance = max( 0.00000, distribution.y * distribution.y );
			float softness_probability = variance / (variance + distance * distance );			softness_probability = clamp( ( softness_probability - 0.3 ) / ( 0.95 - 0.3 ), 0.0, 1.0 );			occlusion = clamp( max( hard_shadow, softness_probability ), 0.0, 1.0 );
		}
		return occlusion;
	}
	float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
		float shadow = 1.0;
		shadowCoord.xyz /= shadowCoord.w;
		shadowCoord.z += shadowBias;
		bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
		bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
		if ( frustumTest ) {
		#if defined( SHADOWMAP_TYPE_PCF )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx0 = - texelSize.x * shadowRadius;
			float dy0 = - texelSize.y * shadowRadius;
			float dx1 = + texelSize.x * shadowRadius;
			float dy1 = + texelSize.y * shadowRadius;
			float dx2 = dx0 / 2.0;
			float dy2 = dy0 / 2.0;
			float dx3 = dx1 / 2.0;
			float dy3 = dy1 / 2.0;
			shadow = (
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy2 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx2, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx3, dy3 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( 0.0, dy1 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, shadowCoord.xy + vec2( dx1, dy1 ), shadowCoord.z )
			) * ( 1.0 / 17.0 );
		#elif defined( SHADOWMAP_TYPE_PCF_SOFT )
			vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
			float dx = texelSize.x;
			float dy = texelSize.y;
			vec2 uv = shadowCoord.xy;
			vec2 f = fract( uv * shadowMapSize + 0.5 );
			uv -= f * texelSize;
			shadow = (
				texture2DCompare( shadowMap, uv, shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( dx, 0.0 ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + vec2( 0.0, dy ), shadowCoord.z ) +
				texture2DCompare( shadowMap, uv + texelSize, shadowCoord.z ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, 0.0 ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 0.0 ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( -dx, dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, dy ), shadowCoord.z ),
					 f.x ) +
				mix( texture2DCompare( shadowMap, uv + vec2( 0.0, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( 0.0, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( texture2DCompare( shadowMap, uv + vec2( dx, -dy ), shadowCoord.z ),
					 texture2DCompare( shadowMap, uv + vec2( dx, 2.0 * dy ), shadowCoord.z ),
					 f.y ) +
				mix( mix( texture2DCompare( shadowMap, uv + vec2( -dx, -dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, -dy ), shadowCoord.z ),
						  f.x ),
					 mix( texture2DCompare( shadowMap, uv + vec2( -dx, 2.0 * dy ), shadowCoord.z ),
						  texture2DCompare( shadowMap, uv + vec2( 2.0 * dx, 2.0 * dy ), shadowCoord.z ),
						  f.x ),
					 f.y )
			) * ( 1.0 / 9.0 );
		#elif defined( SHADOWMAP_TYPE_VSM )
			shadow = VSMShadow( shadowMap, shadowCoord.xy, shadowCoord.z );
		#else
			shadow = texture2DCompare( shadowMap, shadowCoord.xy, shadowCoord.z );
		#endif
		}
		return shadow;
	}
	vec2 cubeToUV( vec3 v, float texelSizeY ) {
		vec3 absV = abs( v );
		float scaleToCube = 1.0 / max( absV.x, max( absV.y, absV.z ) );
		absV *= scaleToCube;
		v *= scaleToCube * ( 1.0 - 2.0 * texelSizeY );
		vec2 planar = v.xy;
		float almostATexel = 1.5 * texelSizeY;
		float almostOne = 1.0 - almostATexel;
		if ( absV.z >= almostOne ) {
			if ( v.z > 0.0 )
				planar.x = 4.0 - v.x;
		} else if ( absV.x >= almostOne ) {
			float signX = sign( v.x );
			planar.x = v.z * signX + 2.0 * signX;
		} else if ( absV.y >= almostOne ) {
			float signY = sign( v.y );
			planar.x = v.x + 2.0 * signY + 2.0;
			planar.y = v.z * signY - 2.0;
		}
		return vec2( 0.125, 0.25 ) * planar + vec2( 0.375, 0.75 );
	}
	float getPointShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		vec2 texelSize = vec2( 1.0 ) / ( shadowMapSize * vec2( 4.0, 2.0 ) );
		vec3 lightToPosition = shadowCoord.xyz;
		float dp = ( length( lightToPosition ) - shadowCameraNear ) / ( shadowCameraFar - shadowCameraNear );		dp += shadowBias;
		vec3 bd3D = normalize( lightToPosition );
		#if defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_PCF_SOFT ) || defined( SHADOWMAP_TYPE_VSM )
			vec2 offset = vec2( - 1, 1 ) * shadowRadius * texelSize.y;
			return (
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yyx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxy, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.xxx, texelSize.y ), dp ) +
				texture2DCompare( shadowMap, cubeToUV( bd3D + offset.yxx, texelSize.y ), dp )
			) * ( 1.0 / 9.0 );
		#else
			return texture2DCompare( shadowMap, cubeToUV( bd3D, texelSize.y ), dp );
		#endif
	}
#endif`,Xv=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,qv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,Yv=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,$v=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Zv=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Jv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,jv=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Kv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Qv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,tM=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,eM=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 OptimizedCineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color *= toneMappingExposure;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	return color;
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,nM=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseColor, material.specularColor, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,iM=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
		vec3 refractedRayExit = position + transmissionRay;
		vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
		vec2 refractionCoords = ndcPos.xy / ndcPos.w;
		refractionCoords += 1.0;
		refractionCoords /= 2.0;
		vec4 transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
		vec3 transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,sM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,oM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,aM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,lM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,cM=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,uM=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float flipEnvMap;
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, vec3( flipEnvMap * vWorldDirection.x, vWorldDirection.yz ) );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,dM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,pM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,mM=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	float fragCoordZ = 0.5 * vHighPrecisionZW[0] / vHighPrecisionZW[1] + 0.5;
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#endif
}`,gM=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,xM=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( 1.0 );
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = packDepthToRGBA( dist );
}`,yM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_M=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vM=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,MM=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,bM=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,SM=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,EM=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,wM=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,TM=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,AM=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,RM=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,CM=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <packing>
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( packNormalToRGB( normal ), opacity );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,PM=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,LM=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,IM=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,DM=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
		float sheenEnergyComp = 1.0 - 0.157 * max3( material.sheenColor );
		outgoingLight = outgoingLight * sheenEnergyComp + sheenSpecularDirect + sheenSpecularIndirect;
	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,UM=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,NM=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <packing>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec4 diffuseColor = vec4( diffuse, opacity );
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,OM=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,FM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,BM=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,zM=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <packing>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,kM=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix * vec4( 0.0, 0.0, 0.0, 1.0 );
	vec2 scale;
	scale.x = length( vec3( modelMatrix[ 0 ].x, modelMatrix[ 0 ].y, modelMatrix[ 0 ].z ) );
	scale.y = length( vec3( modelMatrix[ 1 ].x, modelMatrix[ 1 ].y, modelMatrix[ 1 ].z ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,HM=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Mn={alphahash_fragment:c_,alphahash_pars_fragment:h_,alphamap_fragment:u_,alphamap_pars_fragment:f_,alphatest_fragment:d_,alphatest_pars_fragment:p_,aomap_fragment:m_,aomap_pars_fragment:g_,batching_pars_vertex:x_,batching_vertex:y_,begin_vertex:__,beginnormal_vertex:v_,bsdfs:M_,iridescence_fragment:b_,bumpmap_pars_fragment:S_,clipping_planes_fragment:E_,clipping_planes_pars_fragment:w_,clipping_planes_pars_vertex:T_,clipping_planes_vertex:A_,color_fragment:R_,color_pars_fragment:C_,color_pars_vertex:P_,color_vertex:L_,common:I_,cube_uv_reflection_fragment:D_,defaultnormal_vertex:U_,displacementmap_pars_vertex:N_,displacementmap_vertex:O_,emissivemap_fragment:F_,emissivemap_pars_fragment:B_,colorspace_fragment:z_,colorspace_pars_fragment:k_,envmap_fragment:H_,envmap_common_pars_fragment:V_,envmap_pars_fragment:G_,envmap_pars_vertex:W_,envmap_physical_pars_fragment:nv,envmap_vertex:X_,fog_vertex:q_,fog_pars_vertex:Y_,fog_fragment:$_,fog_pars_fragment:Z_,gradientmap_pars_fragment:J_,lightmap_fragment:j_,lightmap_pars_fragment:K_,lights_lambert_fragment:Q_,lights_lambert_pars_fragment:tv,lights_pars_begin:ev,lights_toon_fragment:iv,lights_toon_pars_fragment:sv,lights_phong_fragment:rv,lights_phong_pars_fragment:ov,lights_physical_fragment:av,lights_physical_pars_fragment:lv,lights_fragment_begin:cv,lights_fragment_maps:hv,lights_fragment_end:uv,logdepthbuf_fragment:fv,logdepthbuf_pars_fragment:dv,logdepthbuf_pars_vertex:pv,logdepthbuf_vertex:mv,map_fragment:gv,map_pars_fragment:xv,map_particle_fragment:yv,map_particle_pars_fragment:_v,metalnessmap_fragment:vv,metalnessmap_pars_fragment:Mv,morphcolor_vertex:bv,morphnormal_vertex:Sv,morphtarget_pars_vertex:Ev,morphtarget_vertex:wv,normal_fragment_begin:Tv,normal_fragment_maps:Av,normal_pars_fragment:Rv,normal_pars_vertex:Cv,normal_vertex:Pv,normalmap_pars_fragment:Lv,clearcoat_normal_fragment_begin:Iv,clearcoat_normal_fragment_maps:Dv,clearcoat_pars_fragment:Uv,iridescence_pars_fragment:Nv,opaque_fragment:Ov,packing:Fv,premultiplied_alpha_fragment:Bv,project_vertex:zv,dithering_fragment:kv,dithering_pars_fragment:Hv,roughnessmap_fragment:Vv,roughnessmap_pars_fragment:Gv,shadowmap_pars_fragment:Wv,shadowmap_pars_vertex:Xv,shadowmap_vertex:qv,shadowmask_pars_fragment:Yv,skinbase_vertex:$v,skinning_pars_vertex:Zv,skinning_vertex:Jv,skinnormal_vertex:jv,specularmap_fragment:Kv,specularmap_pars_fragment:Qv,tonemapping_fragment:tM,tonemapping_pars_fragment:eM,transmission_fragment:nM,transmission_pars_fragment:iM,uv_pars_fragment:sM,uv_pars_vertex:rM,uv_vertex:oM,worldpos_vertex:aM,background_vert:lM,background_frag:cM,backgroundCube_vert:hM,backgroundCube_frag:uM,cube_vert:fM,cube_frag:dM,depth_vert:pM,depth_frag:mM,distanceRGBA_vert:gM,distanceRGBA_frag:xM,equirect_vert:yM,equirect_frag:_M,linedashed_vert:vM,linedashed_frag:MM,meshbasic_vert:bM,meshbasic_frag:SM,meshlambert_vert:EM,meshlambert_frag:wM,meshmatcap_vert:TM,meshmatcap_frag:AM,meshnormal_vert:RM,meshnormal_frag:CM,meshphong_vert:PM,meshphong_frag:LM,meshphysical_vert:IM,meshphysical_frag:DM,meshtoon_vert:UM,meshtoon_frag:NM,points_vert:OM,points_frag:FM,shadow_vert:BM,shadow_frag:zM,sprite_vert:kM,sprite_frag:HM},Ae={common:{diffuse:{value:new fn(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new En}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new En}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new En}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new En},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new En},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new En},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new En}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new En}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new En}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fn(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fn(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0},uvTransform:{value:new En}},sprite:{diffuse:{value:new fn(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}}},rs={basic:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:Mn.meshbasic_vert,fragmentShader:Mn.meshbasic_frag},lambert:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)}}]),vertexShader:Mn.meshlambert_vert,fragmentShader:Mn.meshlambert_frag},phong:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)},specular:{value:new fn(1118481)},shininess:{value:30}}]),vertexShader:Mn.meshphong_vert,fragmentShader:Mn.meshphong_frag},standard:{uniforms:ss([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Mn.meshphysical_vert,fragmentShader:Mn.meshphysical_frag},toon:{uniforms:ss([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)}}]),vertexShader:Mn.meshtoon_vert,fragmentShader:Mn.meshtoon_frag},matcap:{uniforms:ss([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:Mn.meshmatcap_vert,fragmentShader:Mn.meshmatcap_frag},points:{uniforms:ss([Ae.points,Ae.fog]),vertexShader:Mn.points_vert,fragmentShader:Mn.points_frag},dashed:{uniforms:ss([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Mn.linedashed_vert,fragmentShader:Mn.linedashed_frag},depth:{uniforms:ss([Ae.common,Ae.displacementmap]),vertexShader:Mn.depth_vert,fragmentShader:Mn.depth_frag},normal:{uniforms:ss([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:Mn.meshnormal_vert,fragmentShader:Mn.meshnormal_frag},sprite:{uniforms:ss([Ae.sprite,Ae.fog]),vertexShader:Mn.sprite_vert,fragmentShader:Mn.sprite_frag},background:{uniforms:{uvTransform:{value:new En},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Mn.background_vert,fragmentShader:Mn.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Mn.backgroundCube_vert,fragmentShader:Mn.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Mn.cube_vert,fragmentShader:Mn.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Mn.equirect_vert,fragmentShader:Mn.equirect_frag},distanceRGBA:{uniforms:ss([Ae.common,Ae.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Mn.distanceRGBA_vert,fragmentShader:Mn.distanceRGBA_frag},shadow:{uniforms:ss([Ae.lights,Ae.fog,{color:{value:new fn(0)},opacity:{value:1}}]),vertexShader:Mn.shadow_vert,fragmentShader:Mn.shadow_frag}};rs.physical={uniforms:ss([rs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new En},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new En},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new En},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new En},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new En},sheen:{value:0},sheenColor:{value:new fn(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new En},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new En},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new En},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new En},attenuationDistance:{value:0},attenuationColor:{value:new fn(0)},specularColor:{value:new fn(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new En},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new En},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new En}}]),vertexShader:Mn.meshphysical_vert,fragmentShader:Mn.meshphysical_frag};var zc={r:0,b:0,g:0};function VM(i,t,e,n,s,r,a){let o=new fn(0),c=r===!0?0:1,h,u,f=null,g=0,d=null;function y(p,x){let A=!1,M=x.isScene===!0?x.background:null;M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M===null?v(o,c):M&&M.isColor&&(v(M,1),A=!0);let L=i.xr.getEnvironmentBlendMode();L==="additive"?n.buffers.color.setClear(0,0,0,1,a):L==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||A)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===kh)?(u===void 0&&(u=new Ke(new Ci(1,1,1),new Qs({name:"BackgroundCubeMaterial",uniforms:La(rs.backgroundCube.uniforms),vertexShader:rs.backgroundCube.vertexShader,fragmentShader:rs.backgroundCube.fragmentShader,side:gs,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(R,T,N){this.matrixWorld.copyPosition(N.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.toneMapped=Wn.getTransfer(M.colorSpace)!==ai,(f!==M||g!==M.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,f=M,g=M.version,d=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new Ke(new _s(2,2),new Qs({name:"BackgroundMaterial",uniforms:La(rs.background.uniforms),vertexShader:rs.background.vertexShader,fragmentShader:rs.background.fragmentShader,side:so,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.toneMapped=Wn.getTransfer(M.colorSpace)!==ai,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||g!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=M,g=M.version,d=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null))}function v(p,x){p.getRGB(zc,hg(i)),n.buffers.color.setClear(zc.r,zc.g,zc.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(p,x=1){o.set(p),c=x,v(o,c)},getClearAlpha:function(){return c},setClearAlpha:function(p){c=p,v(o,c)},render:y}}function GM(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},c=p(null),h=c,u=!1;function f(Q,lt,bt,Wt,Zt){let At=!1;if(a){let Yt=v(Wt,bt,lt);h!==Yt&&(h=Yt,d(h.object)),At=x(Q,Wt,bt,Zt),At&&A(Q,Wt,bt,Zt)}else{let Yt=lt.wireframe===!0;(h.geometry!==Wt.id||h.program!==bt.id||h.wireframe!==Yt)&&(h.geometry=Wt.id,h.program=bt.id,h.wireframe=Yt,At=!0)}Zt!==null&&e.update(Zt,i.ELEMENT_ARRAY_BUFFER),(At||u)&&(u=!1,K(Q,lt,bt,Wt),Zt!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Zt).buffer))}function g(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function d(Q){return n.isWebGL2?i.bindVertexArray(Q):r.bindVertexArrayOES(Q)}function y(Q){return n.isWebGL2?i.deleteVertexArray(Q):r.deleteVertexArrayOES(Q)}function v(Q,lt,bt){let Wt=bt.wireframe===!0,Zt=o[Q.id];Zt===void 0&&(Zt={},o[Q.id]=Zt);let At=Zt[lt.id];At===void 0&&(At={},Zt[lt.id]=At);let Yt=At[Wt];return Yt===void 0&&(Yt=p(g()),At[Wt]=Yt),Yt}function p(Q){let lt=[],bt=[],Wt=[];for(let Zt=0;Zt<s;Zt++)lt[Zt]=0,bt[Zt]=0,Wt[Zt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:lt,enabledAttributes:bt,attributeDivisors:Wt,object:Q,attributes:{},index:null}}function x(Q,lt,bt,Wt){let Zt=h.attributes,At=lt.attributes,Yt=0,le=bt.getAttributes();for(let Me in le)if(le[Me].location>=0){let Ft=Zt[Me],ye=At[Me];if(ye===void 0&&(Me==="instanceMatrix"&&Q.instanceMatrix&&(ye=Q.instanceMatrix),Me==="instanceColor"&&Q.instanceColor&&(ye=Q.instanceColor)),Ft===void 0||Ft.attribute!==ye||ye&&Ft.data!==ye.data)return!0;Yt++}return h.attributesNum!==Yt||h.index!==Wt}function A(Q,lt,bt,Wt){let Zt={},At=lt.attributes,Yt=0,le=bt.getAttributes();for(let Me in le)if(le[Me].location>=0){let Ft=At[Me];Ft===void 0&&(Me==="instanceMatrix"&&Q.instanceMatrix&&(Ft=Q.instanceMatrix),Me==="instanceColor"&&Q.instanceColor&&(Ft=Q.instanceColor));let ye={};ye.attribute=Ft,Ft&&Ft.data&&(ye.data=Ft.data),Zt[Me]=ye,Yt++}h.attributes=Zt,h.attributesNum=Yt,h.index=Wt}function M(){let Q=h.newAttributes;for(let lt=0,bt=Q.length;lt<bt;lt++)Q[lt]=0}function L(Q){R(Q,0)}function R(Q,lt){let bt=h.newAttributes,Wt=h.enabledAttributes,Zt=h.attributeDivisors;bt[Q]=1,Wt[Q]===0&&(i.enableVertexAttribArray(Q),Wt[Q]=1),Zt[Q]!==lt&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](Q,lt),Zt[Q]=lt)}function T(){let Q=h.newAttributes,lt=h.enabledAttributes;for(let bt=0,Wt=lt.length;bt<Wt;bt++)lt[bt]!==Q[bt]&&(i.disableVertexAttribArray(bt),lt[bt]=0)}function N(Q,lt,bt,Wt,Zt,At,Yt){Yt===!0?i.vertexAttribIPointer(Q,lt,bt,Zt,At):i.vertexAttribPointer(Q,lt,bt,Wt,Zt,At)}function K(Q,lt,bt,Wt){if(n.isWebGL2===!1&&(Q.isInstancedMesh||Wt.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();let Zt=Wt.attributes,At=bt.getAttributes(),Yt=lt.defaultAttributeValues;for(let le in At){let Me=At[le];if(Me.location>=0){let Rt=Zt[le];if(Rt===void 0&&(le==="instanceMatrix"&&Q.instanceMatrix&&(Rt=Q.instanceMatrix),le==="instanceColor"&&Q.instanceColor&&(Rt=Q.instanceColor)),Rt!==void 0){let Ft=Rt.normalized,ye=Rt.itemSize,Re=e.get(Rt);if(Re===void 0)continue;let Le=Re.buffer,Xe=Re.type,Ze=Re.bytesPerElement,De=n.isWebGL2===!0&&(Xe===i.INT||Xe===i.UNSIGNED_INT||Rt.gpuType===Q0);if(Rt.isInterleavedBufferAttribute){let Be=Rt.data,tt=Be.stride,Se=Rt.offset;if(Be.isInstancedInterleavedBuffer){for(let ct=0;ct<Me.locationSize;ct++)R(Me.location+ct,Be.meshPerAttribute);Q.isInstancedMesh!==!0&&Wt._maxInstanceCount===void 0&&(Wt._maxInstanceCount=Be.meshPerAttribute*Be.count)}else for(let ct=0;ct<Me.locationSize;ct++)L(Me.location+ct);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let ct=0;ct<Me.locationSize;ct++)N(Me.location+ct,ye/Me.locationSize,Xe,Ft,tt*Ze,(Se+ye/Me.locationSize*ct)*Ze,De)}else{if(Rt.isInstancedBufferAttribute){for(let Be=0;Be<Me.locationSize;Be++)R(Me.location+Be,Rt.meshPerAttribute);Q.isInstancedMesh!==!0&&Wt._maxInstanceCount===void 0&&(Wt._maxInstanceCount=Rt.meshPerAttribute*Rt.count)}else for(let Be=0;Be<Me.locationSize;Be++)L(Me.location+Be);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let Be=0;Be<Me.locationSize;Be++)N(Me.location+Be,ye/Me.locationSize,Xe,Ft,ye*Ze,ye/Me.locationSize*Be*Ze,De)}}else if(Yt!==void 0){let Ft=Yt[le];if(Ft!==void 0)switch(Ft.length){case 2:i.vertexAttrib2fv(Me.location,Ft);break;case 3:i.vertexAttrib3fv(Me.location,Ft);break;case 4:i.vertexAttrib4fv(Me.location,Ft);break;default:i.vertexAttrib1fv(Me.location,Ft)}}}}T()}function C(){mt();for(let Q in o){let lt=o[Q];for(let bt in lt){let Wt=lt[bt];for(let Zt in Wt)y(Wt[Zt].object),delete Wt[Zt];delete lt[bt]}delete o[Q]}}function w(Q){if(o[Q.id]===void 0)return;let lt=o[Q.id];for(let bt in lt){let Wt=lt[bt];for(let Zt in Wt)y(Wt[Zt].object),delete Wt[Zt];delete lt[bt]}delete o[Q.id]}function it(Q){for(let lt in o){let bt=o[lt];if(bt[Q.id]===void 0)continue;let Wt=bt[Q.id];for(let Zt in Wt)y(Wt[Zt].object),delete Wt[Zt];delete bt[Q.id]}}function mt(){Kt(),u=!0,h!==c&&(h=c,d(h.object))}function Kt(){c.geometry=null,c.program=null,c.wireframe=!1}return{setup:f,reset:mt,resetDefaultState:Kt,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfProgram:it,initAttributes:M,enableAttribute:L,disableUnusedAttributes:T}}function WM(i,t,e,n){let s=n.isWebGL2,r;function a(u){r=u}function o(u,f){i.drawArrays(r,u,f),e.update(f,r,1)}function c(u,f,g){if(g===0)return;let d,y;if(s)d=i,y="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),y="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[y](r,u,f,g),e.update(f,r,g)}function h(u,f,g){if(g===0)return;let d=t.get("WEBGL_multi_draw");if(d===null)for(let y=0;y<g;y++)this.render(u[y],f[y]);else{d.multiDrawArraysWEBGL(r,u,0,f,0,g);let y=0;for(let v=0;v<g;v++)y+=f[v];e.update(y,r,1)}}this.setMode=a,this.render=o,this.renderInstances=c,this.renderMultiDraw=h}function XM(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let N=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(N.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(N){if(N==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";N="mediump"}return N==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",c=r(o);c!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",c,"instead."),o=c);let h=a||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),y=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),A=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,L=a||t.has("OES_texture_float"),R=M&&L,T=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:d,maxCubemapSize:y,maxAttributes:v,maxVertexUniforms:p,maxVaryings:x,maxFragmentUniforms:A,vertexTextures:M,floatFragmentTextures:L,floatVertexTextures:R,maxSamples:T}}function qM(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Zs,o=new En,c={value:null,needsUpdate:!1};this.uniform=c,this.numPlanes=0,this.numIntersection=0,this.init=function(f,g){let d=f.length!==0||g||n!==0||s;return s=g,n=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,g){e=u(f,g,0)},this.setState=function(f,g,d){let y=f.clippingPlanes,v=f.clipIntersection,p=f.clipShadows,x=i.get(f);if(!s||y===null||y.length===0||r&&!p)r?u(null):h();else{let A=r?0:n,M=A*4,L=x.clippingState||null;c.value=L,L=u(y,g,M,d);for(let R=0;R!==M;++R)L[R]=e[R];x.clippingState=L,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=A}};function h(){c.value!==e&&(c.value=e,c.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,g,d,y){let v=f!==null?f.length:0,p=null;if(v!==0){if(p=c.value,y!==!0||p===null){let x=d+v*4,A=g.matrixWorldInverse;o.getNormalMatrix(A),(p===null||p.length<x)&&(p=new Float32Array(x));for(let M=0,L=d;M!==v;++M,L+=4)a.copy(f[M]).applyMatrix4(A,o),a.normal.toArray(p,L),p[L+3]=a.constant}c.value=p,c.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function YM(i){let t=new WeakMap;function e(a,o){return o===Nf?a.mapping=Ra:o===Of&&(a.mapping=Ca),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Nf||o===Of)if(t.has(a)){let c=t.get(a).texture;return e(c,a.mapping)}else{let c=a.image;if(c&&c.height>0){let h=new Wf(c.height/2);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let c=t.get(o);c!==void 0&&(t.delete(o),c.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var uh=class extends ch{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,c=s-e;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=u*this.view.offsetY,c=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,c,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ba=4,p0=[.125,.215,.35,.446,.526,.582],To=20,Sf=new uh,m0=new fn,Ef=null,wf=0,Tf=0,Eo=(1+Math.sqrt(5))/2,_a=1/Eo,g0=[new W(1,1,1),new W(-1,1,1),new W(1,1,-1),new W(-1,1,-1),new W(0,Eo,_a),new W(0,Eo,-_a),new W(_a,0,Eo),new W(-_a,0,Eo),new W(Eo,_a,0),new W(-Eo,_a,0)],fh=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Ef=this._renderer.getRenderTarget(),wf=this._renderer.getActiveCubeFace(),Tf=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=_0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=y0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Ef,wf,Tf),t.scissorTest=!1,kc(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ra||t.mapping===Ca?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Ef=this._renderer.getRenderTarget(),wf=this._renderer.getActiveCubeFace(),Tf=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ms,minFilter:ms,generateMipmaps:!1,type:bl,format:js,colorSpace:Dr,depthBuffer:!1},s=x0(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=x0(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=$M(r)),this._blurMaterial=ZM(r,t,e)}return s}_compileMaterial(t){let e=new Ke(this._lodPlanes[0],t);this._renderer.compile(e,Sf)}_sceneToCubeUV(t,e,n,s){let o=new Gi(90,1,e,n),c=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,g=u.toneMapping;u.getClearColor(m0),u.toneMapping=no,u.autoClear=!1;let d=new os({name:"PMREM.Background",side:gs,depthWrite:!1,depthTest:!1}),y=new Ke(new Ci,d),v=!1,p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,v=!0):(d.color.copy(m0),v=!0);for(let x=0;x<6;x++){let A=x%3;A===0?(o.up.set(0,c[x],0),o.lookAt(h[x],0,0)):A===1?(o.up.set(0,0,c[x]),o.lookAt(0,h[x],0)):(o.up.set(0,c[x],0),o.lookAt(0,0,h[x]));let M=this._cubeSize;kc(s,A*M,x>2?M:0,M,M),u.setRenderTarget(s),v&&u.render(y,o),u.render(t,o)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=g,u.autoClear=f,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ra||t.mapping===Ca;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=_0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=y0());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ke(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let c=this._cubeSize;kc(e,0,0,3*c,2*c),n.setRenderTarget(e),n.render(a,Sf)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=g0[(s-1)%g0.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let c=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,f=new Ke(this._lodPlanes[s],h),g=h.uniforms,d=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*To-1),v=r/y,p=isFinite(r)?1+Math.floor(u*v):To;p>To&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${To}`);let x=[],A=0;for(let N=0;N<To;++N){let K=N/v,C=Math.exp(-K*K/2);x.push(C),N===0?A+=C:N<p&&(A+=2*C)}for(let N=0;N<x.length;N++)x[N]=x[N]/A;g.envMap.value=t.texture,g.samples.value=p,g.weights.value=x,g.latitudinal.value=a==="latitudinal",o&&(g.poleAxis.value=o);let{_lodMax:M}=this;g.dTheta.value=y,g.mipInt.value=M-n;let L=this._sizeLods[s],R=3*L*(s>M-ba?s-M+ba:0),T=4*(this._cubeSize-L);kc(e,R,T,3*L,2*L),c.setRenderTarget(e),c.render(f,Sf)}};function $M(i){let t=[],e=[],n=[],s=i,r=i-ba+1+p0.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let c=1/o;a>i-ba?c=p0[a-i+ba-1]:a===0&&(c=0),n.push(c);let h=1/(o-2),u=-h,f=1+h,g=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,y=6,v=3,p=2,x=1,A=new Float32Array(v*y*d),M=new Float32Array(p*y*d),L=new Float32Array(x*y*d);for(let T=0;T<d;T++){let N=T%3*2/3-1,K=T>2?0:-1,C=[N,K,0,N+2/3,K,0,N+2/3,K+1,0,N,K,0,N+2/3,K+1,0,N,K+1,0];A.set(C,v*y*T),M.set(g,p*y*T);let w=[T,T,T,T,T,T];L.set(w,x*y*T)}let R=new Ln;R.setAttribute("position",new $n(A,v)),R.setAttribute("uv",new $n(M,p)),R.setAttribute("faceIndex",new $n(L,x)),t.push(R),s>ba&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function x0(i,t,e){let n=new Ur(i,t,e);return n.texture.mapping=kh,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function kc(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function ZM(i,t,e){let n=new Float32Array(To),s=new W(0,1,0);return new Qs({name:"SphericalGaussianBlur",defines:{n:To,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Cd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:eo,depthTest:!1,depthWrite:!1})}function y0(){return new Qs({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Cd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:eo,depthTest:!1,depthWrite:!1})}function _0(){return new Qs({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Cd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:eo,depthTest:!1,depthWrite:!1})}function Cd(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}function JM(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let c=o.mapping,h=c===Nf||c===Of,u=c===Ra||c===Ca;if(h||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new fh(i)),f=h?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{let f=o.image;if(h&&f&&f.height>0||u&&f&&s(f)){e===null&&(e=new fh(i));let g=h?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,g),o.addEventListener("dispose",r),g.texture}else return null}}}return o}function s(o){let c=0,h=6;for(let u=0;u<h;u++)o[u]!==void 0&&c++;return c===h}function r(o){let c=o.target;c.removeEventListener("dispose",r);let h=t.get(c);h!==void 0&&(t.delete(c),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function jM(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function KM(i,t,e,n){let s={},r=new WeakMap;function a(f){let g=f.target;g.index!==null&&t.remove(g.index);for(let y in g.attributes)t.remove(g.attributes[y]);for(let y in g.morphAttributes){let v=g.morphAttributes[y];for(let p=0,x=v.length;p<x;p++)t.remove(v[p])}g.removeEventListener("dispose",a),delete s[g.id];let d=r.get(g);d&&(t.remove(d),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function o(f,g){return s[g.id]===!0||(g.addEventListener("dispose",a),s[g.id]=!0,e.memory.geometries++),g}function c(f){let g=f.attributes;for(let y in g)t.update(g[y],i.ARRAY_BUFFER);let d=f.morphAttributes;for(let y in d){let v=d[y];for(let p=0,x=v.length;p<x;p++)t.update(v[p],i.ARRAY_BUFFER)}}function h(f){let g=[],d=f.index,y=f.attributes.position,v=0;if(d!==null){let A=d.array;v=d.version;for(let M=0,L=A.length;M<L;M+=3){let R=A[M+0],T=A[M+1],N=A[M+2];g.push(R,T,T,N,N,R)}}else if(y!==void 0){let A=y.array;v=y.version;for(let M=0,L=A.length/3-1;M<L;M+=3){let R=M+0,T=M+1,N=M+2;g.push(R,T,T,N,N,R)}}else return;let p=new(lg(g)?lh:ah)(g,1);p.version=v;let x=r.get(f);x&&t.remove(x),r.set(f,p)}function u(f){let g=r.get(f);if(g){let d=f.index;d!==null&&g.version<d.version&&h(f)}else h(f);return r.get(f)}return{get:o,update:c,getWireframeAttribute:u}}function QM(i,t,e,n){let s=n.isWebGL2,r;function a(d){r=d}let o,c;function h(d){o=d.type,c=d.bytesPerElement}function u(d,y){i.drawElements(r,y,o,d*c),e.update(y,r,1)}function f(d,y,v){if(v===0)return;let p,x;if(s)p=i,x="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),x="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[x](r,y,o,d*c,v),e.update(y,r,v)}function g(d,y,v){if(v===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<v;x++)this.render(d[x]/c,y[x]);else{p.multiDrawElementsWEBGL(r,y,0,o,d,0,v);let x=0;for(let A=0;A<v;A++)x+=y[A];e.update(x,r,1)}}this.setMode=a,this.setIndex=h,this.render=u,this.renderInstances=f,this.renderMultiDraw=g}function tb(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function eb(i,t){return i[0]-t[0]}function nb(i,t){return Math.abs(t[1])-Math.abs(i[1])}function ib(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,a=new Fn,o=[];for(let h=0;h<8;h++)o[h]=[h,0];function c(h,u,f){let g=h.morphTargetInfluences;if(t.isWebGL2===!0){let d=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,y=d!==void 0?d.length:0,v=r.get(u);if(v===void 0||v.count!==y){let Q=function(){mt.dispose(),r.delete(u),u.removeEventListener("dispose",Q)};v!==void 0&&v.texture.dispose();let A=u.morphAttributes.position!==void 0,M=u.morphAttributes.normal!==void 0,L=u.morphAttributes.color!==void 0,R=u.morphAttributes.position||[],T=u.morphAttributes.normal||[],N=u.morphAttributes.color||[],K=0;A===!0&&(K=1),M===!0&&(K=2),L===!0&&(K=3);let C=u.attributes.position.count*K,w=1;C>t.maxTextureSize&&(w=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);let it=new Float32Array(C*w*4*y),mt=new rh(it,C,w,y);mt.type=to,mt.needsUpdate=!0;let Kt=K*4;for(let lt=0;lt<y;lt++){let bt=R[lt],Wt=T[lt],Zt=N[lt],At=C*w*4*lt;for(let Yt=0;Yt<bt.count;Yt++){let le=Yt*Kt;A===!0&&(a.fromBufferAttribute(bt,Yt),it[At+le+0]=a.x,it[At+le+1]=a.y,it[At+le+2]=a.z,it[At+le+3]=0),M===!0&&(a.fromBufferAttribute(Wt,Yt),it[At+le+4]=a.x,it[At+le+5]=a.y,it[At+le+6]=a.z,it[At+le+7]=0),L===!0&&(a.fromBufferAttribute(Zt,Yt),it[At+le+8]=a.x,it[At+le+9]=a.y,it[At+le+10]=a.z,it[At+le+11]=Zt.itemSize===4?a.w:1)}}v={count:y,texture:mt,size:new fe(C,w)},r.set(u,v),u.addEventListener("dispose",Q)}let p=0;for(let A=0;A<g.length;A++)p+=g[A];let x=u.morphTargetsRelative?1:1-p;f.getUniforms().setValue(i,"morphTargetBaseInfluence",x),f.getUniforms().setValue(i,"morphTargetInfluences",g),f.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{let d=g===void 0?0:g.length,y=n[u.id];if(y===void 0||y.length!==d){y=[];for(let M=0;M<d;M++)y[M]=[M,0];n[u.id]=y}for(let M=0;M<d;M++){let L=y[M];L[0]=M,L[1]=g[M]}y.sort(nb);for(let M=0;M<8;M++)M<d&&y[M][1]?(o[M][0]=y[M][0],o[M][1]=y[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(eb);let v=u.morphAttributes.position,p=u.morphAttributes.normal,x=0;for(let M=0;M<8;M++){let L=o[M],R=L[0],T=L[1];R!==Number.MAX_SAFE_INTEGER&&T?(v&&u.getAttribute("morphTarget"+M)!==v[R]&&u.setAttribute("morphTarget"+M,v[R]),p&&u.getAttribute("morphNormal"+M)!==p[R]&&u.setAttribute("morphNormal"+M,p[R]),s[M]=T,x+=T):(v&&u.hasAttribute("morphTarget"+M)===!0&&u.deleteAttribute("morphTarget"+M),p&&u.hasAttribute("morphNormal"+M)===!0&&u.deleteAttribute("morphNormal"+M),s[M]=0)}let A=u.morphTargetsRelative?1:1-x;f.getUniforms().setValue(i,"morphTargetBaseInfluence",A),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:c}}function sb(i,t,e,n){let s=new WeakMap;function r(c){let h=n.render.frame,u=c.geometry,f=t.get(c,u);if(s.get(f)!==h&&(t.update(f),s.set(f,h)),c.isInstancedMesh&&(c.hasEventListener("dispose",o)===!1&&c.addEventListener("dispose",o),s.get(c)!==h&&(e.update(c.instanceMatrix,i.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,i.ARRAY_BUFFER),s.set(c,h))),c.isSkinnedMesh){let g=c.skeleton;s.get(g)!==h&&(g.update(),s.set(g,h))}return f}function a(){s=new WeakMap}function o(c){let h=c.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}var dh=class extends Ts{constructor(t,e,n,s,r,a,o,c,h,u){if(u=u!==void 0?u:Ro,u!==Ro&&u!==Pa)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Ro&&(n=Qr),n===void 0&&u===Pa&&(n=Ao),super(null,s,r,a,o,c,u,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Li,this.minFilter=c!==void 0?c:Li,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},fg=new Ts,dg=new dh(1,1);dg.compareFunction=ag;var pg=new rh,mg=new Vf,gg=new hh,v0=[],M0=[],b0=new Float32Array(16),S0=new Float32Array(9),E0=new Float32Array(4);function Ua(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=v0[s];if(r===void 0&&(r=new Float32Array(s),v0[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Di(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Ui(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Xh(i,t){let e=M0[t];e===void 0&&(e=new Int32Array(t),M0[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function rb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function ob(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Di(e,t))return;i.uniform2fv(this.addr,t),Ui(e,t)}}function ab(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Di(e,t))return;i.uniform3fv(this.addr,t),Ui(e,t)}}function lb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Di(e,t))return;i.uniform4fv(this.addr,t),Ui(e,t)}}function cb(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Di(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Ui(e,t)}else{if(Di(e,n))return;E0.set(n),i.uniformMatrix2fv(this.addr,!1,E0),Ui(e,n)}}function hb(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Di(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Ui(e,t)}else{if(Di(e,n))return;S0.set(n),i.uniformMatrix3fv(this.addr,!1,S0),Ui(e,n)}}function ub(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Di(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Ui(e,t)}else{if(Di(e,n))return;b0.set(n),i.uniformMatrix4fv(this.addr,!1,b0),Ui(e,n)}}function fb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function db(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Di(e,t))return;i.uniform2iv(this.addr,t),Ui(e,t)}}function pb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Di(e,t))return;i.uniform3iv(this.addr,t),Ui(e,t)}}function mb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Di(e,t))return;i.uniform4iv(this.addr,t),Ui(e,t)}}function gb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function xb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Di(e,t))return;i.uniform2uiv(this.addr,t),Ui(e,t)}}function yb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Di(e,t))return;i.uniform3uiv(this.addr,t),Ui(e,t)}}function _b(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Di(e,t))return;i.uniform4uiv(this.addr,t),Ui(e,t)}}function vb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?dg:fg;e.setTexture2D(t||r,s)}function Mb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||mg,s)}function bb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||gg,s)}function Sb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||pg,s)}function Eb(i){switch(i){case 5126:return rb;case 35664:return ob;case 35665:return ab;case 35666:return lb;case 35674:return cb;case 35675:return hb;case 35676:return ub;case 5124:case 35670:return fb;case 35667:case 35671:return db;case 35668:case 35672:return pb;case 35669:case 35673:return mb;case 5125:return gb;case 36294:return xb;case 36295:return yb;case 36296:return _b;case 35678:case 36198:case 36298:case 36306:case 35682:return vb;case 35679:case 36299:case 36307:return Mb;case 35680:case 36300:case 36308:case 36293:return bb;case 36289:case 36303:case 36311:case 36292:return Sb}}function wb(i,t){i.uniform1fv(this.addr,t)}function Tb(i,t){let e=Ua(t,this.size,2);i.uniform2fv(this.addr,e)}function Ab(i,t){let e=Ua(t,this.size,3);i.uniform3fv(this.addr,e)}function Rb(i,t){let e=Ua(t,this.size,4);i.uniform4fv(this.addr,e)}function Cb(i,t){let e=Ua(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Pb(i,t){let e=Ua(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Lb(i,t){let e=Ua(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Ib(i,t){i.uniform1iv(this.addr,t)}function Db(i,t){i.uniform2iv(this.addr,t)}function Ub(i,t){i.uniform3iv(this.addr,t)}function Nb(i,t){i.uniform4iv(this.addr,t)}function Ob(i,t){i.uniform1uiv(this.addr,t)}function Fb(i,t){i.uniform2uiv(this.addr,t)}function Bb(i,t){i.uniform3uiv(this.addr,t)}function zb(i,t){i.uniform4uiv(this.addr,t)}function kb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Di(n,r)||(i.uniform1iv(this.addr,r),Ui(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||fg,r[a])}function Hb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Di(n,r)||(i.uniform1iv(this.addr,r),Ui(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||mg,r[a])}function Vb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Di(n,r)||(i.uniform1iv(this.addr,r),Ui(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||gg,r[a])}function Gb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Di(n,r)||(i.uniform1iv(this.addr,r),Ui(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||pg,r[a])}function Wb(i){switch(i){case 5126:return wb;case 35664:return Tb;case 35665:return Ab;case 35666:return Rb;case 35674:return Cb;case 35675:return Pb;case 35676:return Lb;case 5124:case 35670:return Ib;case 35667:case 35671:return Db;case 35668:case 35672:return Ub;case 35669:case 35673:return Nb;case 5125:return Ob;case 36294:return Fb;case 36295:return Bb;case 36296:return zb;case 35678:case 36198:case 36298:case 36306:case 35682:return kb;case 35679:case 36299:case 36307:return Hb;case 35680:case 36300:case 36308:case 36293:return Vb;case 36289:case 36303:case 36311:case 36292:return Gb}}var Xf=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Eb(e.type)}},qf=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Wb(e.type)}},Yf=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},Af=/(\w+)(\])?(\[|\.)?/g;function w0(i,t){i.seq.push(t),i.map[t.id]=t}function Xb(i,t,e){let n=i.name,s=n.length;for(Af.lastIndex=0;;){let r=Af.exec(n),a=Af.lastIndex,o=r[1],c=r[2]==="]",h=r[3];if(c&&(o=o|0),h===void 0||h==="["&&a+2===s){w0(e,h===void 0?new Xf(o,i,t):new qf(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Yf(o),w0(e,f)),e=f}}}var Aa=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Xb(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],c=n[o.id];c.needsUpdate!==!1&&o.setValue(t,c.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function T0(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var qb=37297,Yb=0;function $b(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function Zb(i){let t=Wn.getPrimaries(Wn.workingColorSpace),e=Wn.getPrimaries(i),n;switch(t===e?n="":t===Qc&&e===Kc?n="LinearDisplayP3ToLinearSRGB":t===Kc&&e===Qc&&(n="LinearSRGBToLinearDisplayP3"),i){case Dr:case Vh:return[n,"LinearTransferOETF"];case kn:case Ad:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function A0(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+$b(i.getShaderSource(t),a)}else return s}function Jb(i,t){let e=Zb(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function jb(i,t){let e;switch(t){case sy:e="Linear";break;case ry:e="Reinhard";break;case oy:e="OptimizedCineon";break;case wd:e="ACESFilmic";break;case ly:e="AgX";break;case ay:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Kb(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(Sa).join(`
`)}function Qb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(Sa).join(`
`)}function tS(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function eS(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function Sa(i){return i!==""}function R0(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function C0(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var nS=/^[ \t]*#include +<([\w\d./]+)>/gm;function $f(i){return i.replace(nS,sS)}var iS=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function sS(i,t){let e=Mn[t];if(e===void 0){let n=iS.get(t);if(n!==void 0)e=Mn[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return $f(e)}var rS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function P0(i){return i.replace(rS,oS)}function oS(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function L0(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function aS(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===j0?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===Sd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Lr&&(t="SHADOWMAP_TYPE_VSM"),t}function lS(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ra:case Ca:t="ENVMAP_TYPE_CUBE";break;case kh:t="ENVMAP_TYPE_CUBE_UV";break}return t}function cS(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ca:t="ENVMAP_MODE_REFRACTION";break}return t}function hS(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Ed:t="ENVMAP_BLENDING_MULTIPLY";break;case ny:t="ENVMAP_BLENDING_MIX";break;case iy:t="ENVMAP_BLENDING_ADD";break}return t}function uS(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function fS(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,c=aS(e),h=lS(e),u=cS(e),f=hS(e),g=uS(e),d=e.isWebGL2?"":Kb(e),y=Qb(e),v=tS(r),p=s.createProgram(),x,A,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Sa).join(`
`),x.length>0&&(x+=`
`),A=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(Sa).join(`
`),A.length>0&&(A+=`
`)):(x=[L0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(Sa).join(`
`),A=[d,L0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+c:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==no?"#define TONE_MAPPING":"",e.toneMapping!==no?Mn.tonemapping_pars_fragment:"",e.toneMapping!==no?jb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Mn.colorspace_pars_fragment,Jb("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(Sa).join(`
`)),a=$f(a),a=R0(a,e),a=C0(a,e),o=$f(o),o=R0(o,e),o=C0(o,e),a=P0(a),o=P0(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,x=[y,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,A=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Jm?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Jm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+A);let L=M+x+a,R=M+A+o,T=T0(s,s.VERTEX_SHADER,L),N=T0(s,s.FRAGMENT_SHADER,R);s.attachShader(p,T),s.attachShader(p,N),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function K(mt){if(i.debug.checkShaderErrors){let Kt=s.getProgramInfoLog(p).trim(),Q=s.getShaderInfoLog(T).trim(),lt=s.getShaderInfoLog(N).trim(),bt=!0,Wt=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(bt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,T,N);else{let Zt=A0(s,T,"vertex"),At=A0(s,N,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+Kt+`
`+Zt+`
`+At)}else Kt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Kt):(Q===""||lt==="")&&(Wt=!1);Wt&&(mt.diagnostics={runnable:bt,programLog:Kt,vertexShader:{log:Q,prefix:x},fragmentShader:{log:lt,prefix:A}})}s.deleteShader(T),s.deleteShader(N),C=new Aa(s,p),w=eS(s,p)}let C;this.getUniforms=function(){return C===void 0&&K(this),C};let w;this.getAttributes=function(){return w===void 0&&K(this),w};let it=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return it===!1&&(it=s.getProgramParameter(p,qb)),it},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Yb++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=T,this.fragmentShader=N,this}var dS=0,Zf=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Jf(t),e.set(t,n)),n}},Jf=class{constructor(t){this.id=dS++,this.code=t,this.usedTimes=0}};function pS(i,t,e,n,s,r,a){let o=new El,c=new Zf,h=[],u=s.isWebGL2,f=s.logarithmicDepthBuffer,g=s.vertexTextures,d=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(C){return C===0?"uv":`uv${C}`}function p(C,w,it,mt,Kt){let Q=mt.fog,lt=Kt.geometry,bt=C.isMeshStandardMaterial?mt.environment:null,Wt=(C.isMeshStandardMaterial?e:t).get(C.envMap||bt),Zt=Wt&&Wt.mapping===kh?Wt.image.height:null,At=y[C.type];C.precision!==null&&(d=s.getMaxPrecision(C.precision),d!==C.precision&&console.warn("THREE.WebGLProgram.getParameters:",C.precision,"not supported, using",d,"instead."));let Yt=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,le=Yt!==void 0?Yt.length:0,Me=0;lt.morphAttributes.position!==void 0&&(Me=1),lt.morphAttributes.normal!==void 0&&(Me=2),lt.morphAttributes.color!==void 0&&(Me=3);let Rt,Ft,ye,Re;if(At){let He=rs[At];Rt=He.vertexShader,Ft=He.fragmentShader}else Rt=C.vertexShader,Ft=C.fragmentShader,c.update(C),ye=c.getVertexShaderID(C),Re=c.getFragmentShaderID(C);let Le=i.getRenderTarget(),Xe=Kt.isInstancedMesh===!0,Ze=Kt.isBatchedMesh===!0,De=!!C.map,Be=!!C.matcap,tt=!!Wt,Se=!!C.aoMap,ct=!!C.lightMap,_e=!!C.bumpMap,Jt=!!C.normalMap,ke=!!C.displacementMap,be=!!C.emissiveMap,F=!!C.metalnessMap,I=!!C.roughnessMap,_t=C.anisotropy>0,xe=C.clearcoat>0,de=C.iridescence>0,ue=C.sheen>0,We=C.transmission>0,qt=_t&&!!C.anisotropyMap,we=xe&&!!C.clearcoatMap,Je=xe&&!!C.clearcoatNormalMap,nn=xe&&!!C.clearcoatRoughnessMap,pe=de&&!!C.iridescenceMap,gn=de&&!!C.iridescenceThicknessMap,G=ue&&!!C.sheenColorMap,oe=ue&&!!C.sheenRoughnessMap,ve=!!C.specularMap,nt=!!C.specularColorMap,dt=!!C.specularIntensityMap,jt=We&&!!C.transmissionMap,te=We&&!!C.thicknessMap,ee=!!C.gradientMap,ht=!!C.alphaMap,V=C.alphaTest>0,Lt=!!C.alphaHash,zt=!!C.extensions,re=!!lt.attributes.uv1,ce=!!lt.attributes.uv2,Ue=!!lt.attributes.uv3,Qt=no;return C.toneMapped&&(Le===null||Le.isXRRenderTarget===!0)&&(Qt=i.toneMapping),{isWebGL2:u,shaderID:At,shaderType:C.type,shaderName:C.name,vertexShader:Rt,fragmentShader:Ft,defines:C.defines,customVertexShaderID:ye,customFragmentShaderID:Re,isRawShaderMaterial:C.isRawShaderMaterial===!0,glslVersion:C.glslVersion,precision:d,batching:Ze,instancing:Xe,instancingColor:Xe&&Kt.instanceColor!==null,supportsVertexTextures:g,outputColorSpace:Le===null?i.outputColorSpace:Le.isXRRenderTarget===!0?Le.texture.colorSpace:Dr,map:De,matcap:Be,envMap:tt,envMapMode:tt&&Wt.mapping,envMapCubeUVHeight:Zt,aoMap:Se,lightMap:ct,bumpMap:_e,normalMap:Jt,displacementMap:g&&ke,emissiveMap:be,normalMapObjectSpace:Jt&&C.normalMapType===vy,normalMapTangentSpace:Jt&&C.normalMapType===Hh,metalnessMap:F,roughnessMap:I,anisotropy:_t,anisotropyMap:qt,clearcoat:xe,clearcoatMap:we,clearcoatNormalMap:Je,clearcoatRoughnessMap:nn,iridescence:de,iridescenceMap:pe,iridescenceThicknessMap:gn,sheen:ue,sheenColorMap:G,sheenRoughnessMap:oe,specularMap:ve,specularColorMap:nt,specularIntensityMap:dt,transmission:We,transmissionMap:jt,thicknessMap:te,gradientMap:ee,opaque:C.transparent===!1&&C.blending===wa,alphaMap:ht,alphaTest:V,alphaHash:Lt,combine:C.combine,mapUv:De&&v(C.map.channel),aoMapUv:Se&&v(C.aoMap.channel),lightMapUv:ct&&v(C.lightMap.channel),bumpMapUv:_e&&v(C.bumpMap.channel),normalMapUv:Jt&&v(C.normalMap.channel),displacementMapUv:ke&&v(C.displacementMap.channel),emissiveMapUv:be&&v(C.emissiveMap.channel),metalnessMapUv:F&&v(C.metalnessMap.channel),roughnessMapUv:I&&v(C.roughnessMap.channel),anisotropyMapUv:qt&&v(C.anisotropyMap.channel),clearcoatMapUv:we&&v(C.clearcoatMap.channel),clearcoatNormalMapUv:Je&&v(C.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nn&&v(C.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&v(C.iridescenceMap.channel),iridescenceThicknessMapUv:gn&&v(C.iridescenceThicknessMap.channel),sheenColorMapUv:G&&v(C.sheenColorMap.channel),sheenRoughnessMapUv:oe&&v(C.sheenRoughnessMap.channel),specularMapUv:ve&&v(C.specularMap.channel),specularColorMapUv:nt&&v(C.specularColorMap.channel),specularIntensityMapUv:dt&&v(C.specularIntensityMap.channel),transmissionMapUv:jt&&v(C.transmissionMap.channel),thicknessMapUv:te&&v(C.thicknessMap.channel),alphaMapUv:ht&&v(C.alphaMap.channel),vertexTangents:!!lt.attributes.tangent&&(Jt||_t),vertexColors:C.vertexColors,vertexAlphas:C.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,vertexUv1s:re,vertexUv2s:ce,vertexUv3s:Ue,pointsUvs:Kt.isPoints===!0&&!!lt.attributes.uv&&(De||ht),fog:!!Q,useFog:C.fog===!0,fogExp2:Q&&Q.isFogExp2,flatShading:C.flatShading===!0,sizeAttenuation:C.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:Kt.isSkinnedMesh===!0,morphTargets:lt.morphAttributes.position!==void 0,morphNormals:lt.morphAttributes.normal!==void 0,morphColors:lt.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:Me,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:C.dithering,shadowMapEnabled:i.shadowMap.enabled&&it.length>0,shadowMapType:i.shadowMap.type,toneMapping:Qt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:De&&C.map.isVideoTexture===!0&&Wn.getTransfer(C.map.colorSpace)===ai,premultipliedAlpha:C.premultipliedAlpha,doubleSided:C.side===mn,flipSided:C.side===gs,useDepthPacking:C.depthPacking>=0,depthPacking:C.depthPacking||0,index0AttributeName:C.index0AttributeName,extensionDerivatives:zt&&C.extensions.derivatives===!0,extensionFragDepth:zt&&C.extensions.fragDepth===!0,extensionDrawBuffers:zt&&C.extensions.drawBuffers===!0,extensionShaderTextureLOD:zt&&C.extensions.shaderTextureLOD===!0,extensionClipCullDistance:zt&&C.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:C.customProgramCacheKey()}}function x(C){let w=[];if(C.shaderID?w.push(C.shaderID):(w.push(C.customVertexShaderID),w.push(C.customFragmentShaderID)),C.defines!==void 0)for(let it in C.defines)w.push(it),w.push(C.defines[it]);return C.isRawShaderMaterial===!1&&(A(w,C),M(w,C),w.push(i.outputColorSpace)),w.push(C.customProgramCacheKey),w.join()}function A(C,w){C.push(w.precision),C.push(w.outputColorSpace),C.push(w.envMapMode),C.push(w.envMapCubeUVHeight),C.push(w.mapUv),C.push(w.alphaMapUv),C.push(w.lightMapUv),C.push(w.aoMapUv),C.push(w.bumpMapUv),C.push(w.normalMapUv),C.push(w.displacementMapUv),C.push(w.emissiveMapUv),C.push(w.metalnessMapUv),C.push(w.roughnessMapUv),C.push(w.anisotropyMapUv),C.push(w.clearcoatMapUv),C.push(w.clearcoatNormalMapUv),C.push(w.clearcoatRoughnessMapUv),C.push(w.iridescenceMapUv),C.push(w.iridescenceThicknessMapUv),C.push(w.sheenColorMapUv),C.push(w.sheenRoughnessMapUv),C.push(w.specularMapUv),C.push(w.specularColorMapUv),C.push(w.specularIntensityMapUv),C.push(w.transmissionMapUv),C.push(w.thicknessMapUv),C.push(w.combine),C.push(w.fogExp2),C.push(w.sizeAttenuation),C.push(w.morphTargetsCount),C.push(w.morphAttributeCount),C.push(w.numDirLights),C.push(w.numPointLights),C.push(w.numSpotLights),C.push(w.numSpotLightMaps),C.push(w.numHemiLights),C.push(w.numRectAreaLights),C.push(w.numDirLightShadows),C.push(w.numPointLightShadows),C.push(w.numSpotLightShadows),C.push(w.numSpotLightShadowsWithMaps),C.push(w.numLightProbes),C.push(w.shadowMapType),C.push(w.toneMapping),C.push(w.numClippingPlanes),C.push(w.numClipIntersection),C.push(w.depthPacking)}function M(C,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),C.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),C.push(o.mask)}function L(C){let w=y[C.type],it;if(w){let mt=rs[w];it=Wh.clone(mt.uniforms)}else it=C.uniforms;return it}function R(C,w){let it;for(let mt=0,Kt=h.length;mt<Kt;mt++){let Q=h[mt];if(Q.cacheKey===w){it=Q,++it.usedTimes;break}}return it===void 0&&(it=new fS(i,w,C,r),h.push(it)),it}function T(C){if(--C.usedTimes===0){let w=h.indexOf(C);h[w]=h[h.length-1],h.pop(),C.destroy()}}function N(C){c.remove(C)}function K(){c.dispose()}return{getParameters:p,getProgramCacheKey:x,getUniforms:L,acquireProgram:R,releaseProgram:T,releaseShaderCache:N,programs:h,dispose:K}}function mS(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function gS(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function I0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function D0(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,g,d,y,v,p){let x=i[t];return x===void 0?(x={id:f.id,object:f,geometry:g,material:d,groupOrder:y,renderOrder:f.renderOrder,z:v,group:p},i[t]=x):(x.id=f.id,x.object=f,x.geometry=g,x.material=d,x.groupOrder=y,x.renderOrder=f.renderOrder,x.z=v,x.group=p),t++,x}function o(f,g,d,y,v,p){let x=a(f,g,d,y,v,p);d.transmission>0?n.push(x):d.transparent===!0?s.push(x):e.push(x)}function c(f,g,d,y,v,p){let x=a(f,g,d,y,v,p);d.transmission>0?n.unshift(x):d.transparent===!0?s.unshift(x):e.unshift(x)}function h(f,g){e.length>1&&e.sort(f||gS),n.length>1&&n.sort(g||I0),s.length>1&&s.sort(g||I0)}function u(){for(let f=t,g=i.length;f<g;f++){let d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:c,finish:u,sort:h}}function xS(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new D0,i.set(n,[a])):s>=r.length?(a=new D0,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function yS(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new fn};break;case"SpotLight":e={position:new W,direction:new W,color:new fn,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new fn,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new fn,groundColor:new fn};break;case"RectAreaLight":e={color:new fn,position:new W,halfWidth:new W,halfHeight:new W};break}return i[t.id]=e,e}}}function _S(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var vS=0;function MS(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function bS(i,t){let e=new yS,n=_S(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)s.probe.push(new W);let r=new W,a=new Nn,o=new Nn;function c(u,f){let g=0,d=0,y=0;for(let mt=0;mt<9;mt++)s.probe[mt].set(0,0,0);let v=0,p=0,x=0,A=0,M=0,L=0,R=0,T=0,N=0,K=0,C=0;u.sort(MS);let w=f===!0?Math.PI:1;for(let mt=0,Kt=u.length;mt<Kt;mt++){let Q=u[mt],lt=Q.color,bt=Q.intensity,Wt=Q.distance,Zt=Q.shadow&&Q.shadow.map?Q.shadow.map.texture:null;if(Q.isAmbientLight)g+=lt.r*bt*w,d+=lt.g*bt*w,y+=lt.b*bt*w;else if(Q.isLightProbe){for(let At=0;At<9;At++)s.probe[At].addScaledVector(Q.sh.coefficients[At],bt);C++}else if(Q.isDirectionalLight){let At=e.get(Q);if(At.color.copy(Q.color).multiplyScalar(Q.intensity*w),Q.castShadow){let Yt=Q.shadow,le=n.get(Q);le.shadowBias=Yt.bias,le.shadowNormalBias=Yt.normalBias,le.shadowRadius=Yt.radius,le.shadowMapSize=Yt.mapSize,s.directionalShadow[v]=le,s.directionalShadowMap[v]=Zt,s.directionalShadowMatrix[v]=Q.shadow.matrix,L++}s.directional[v]=At,v++}else if(Q.isSpotLight){let At=e.get(Q);At.position.setFromMatrixPosition(Q.matrixWorld),At.color.copy(lt).multiplyScalar(bt*w),At.distance=Wt,At.coneCos=Math.cos(Q.angle),At.penumbraCos=Math.cos(Q.angle*(1-Q.penumbra)),At.decay=Q.decay,s.spot[x]=At;let Yt=Q.shadow;if(Q.map&&(s.spotLightMap[N]=Q.map,N++,Yt.updateMatrices(Q),Q.castShadow&&K++),s.spotLightMatrix[x]=Yt.matrix,Q.castShadow){let le=n.get(Q);le.shadowBias=Yt.bias,le.shadowNormalBias=Yt.normalBias,le.shadowRadius=Yt.radius,le.shadowMapSize=Yt.mapSize,s.spotShadow[x]=le,s.spotShadowMap[x]=Zt,T++}x++}else if(Q.isRectAreaLight){let At=e.get(Q);At.color.copy(lt).multiplyScalar(bt),At.halfWidth.set(Q.width*.5,0,0),At.halfHeight.set(0,Q.height*.5,0),s.rectArea[A]=At,A++}else if(Q.isPointLight){let At=e.get(Q);if(At.color.copy(Q.color).multiplyScalar(Q.intensity*w),At.distance=Q.distance,At.decay=Q.decay,Q.castShadow){let Yt=Q.shadow,le=n.get(Q);le.shadowBias=Yt.bias,le.shadowNormalBias=Yt.normalBias,le.shadowRadius=Yt.radius,le.shadowMapSize=Yt.mapSize,le.shadowCameraNear=Yt.camera.near,le.shadowCameraFar=Yt.camera.far,s.pointShadow[p]=le,s.pointShadowMap[p]=Zt,s.pointShadowMatrix[p]=Q.shadow.matrix,R++}s.point[p]=At,p++}else if(Q.isHemisphereLight){let At=e.get(Q);At.skyColor.copy(Q.color).multiplyScalar(bt*w),At.groundColor.copy(Q.groundColor).multiplyScalar(bt*w),s.hemi[M]=At,M++}}A>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_FLOAT_1,s.rectAreaLTC2=Ae.LTC_FLOAT_2):(s.rectAreaLTC1=Ae.LTC_HALF_1,s.rectAreaLTC2=Ae.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_FLOAT_1,s.rectAreaLTC2=Ae.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_HALF_1,s.rectAreaLTC2=Ae.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=g,s.ambient[1]=d,s.ambient[2]=y;let it=s.hash;(it.directionalLength!==v||it.pointLength!==p||it.spotLength!==x||it.rectAreaLength!==A||it.hemiLength!==M||it.numDirectionalShadows!==L||it.numPointShadows!==R||it.numSpotShadows!==T||it.numSpotMaps!==N||it.numLightProbes!==C)&&(s.directional.length=v,s.spot.length=x,s.rectArea.length=A,s.point.length=p,s.hemi.length=M,s.directionalShadow.length=L,s.directionalShadowMap.length=L,s.pointShadow.length=R,s.pointShadowMap.length=R,s.spotShadow.length=T,s.spotShadowMap.length=T,s.directionalShadowMatrix.length=L,s.pointShadowMatrix.length=R,s.spotLightMatrix.length=T+N-K,s.spotLightMap.length=N,s.numSpotLightShadowsWithMaps=K,s.numLightProbes=C,it.directionalLength=v,it.pointLength=p,it.spotLength=x,it.rectAreaLength=A,it.hemiLength=M,it.numDirectionalShadows=L,it.numPointShadows=R,it.numSpotShadows=T,it.numSpotMaps=N,it.numLightProbes=C,s.version=vS++)}function h(u,f){let g=0,d=0,y=0,v=0,p=0,x=f.matrixWorldInverse;for(let A=0,M=u.length;A<M;A++){let L=u[A];if(L.isDirectionalLight){let R=s.directional[g];R.direction.setFromMatrixPosition(L.matrixWorld),r.setFromMatrixPosition(L.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(x),g++}else if(L.isSpotLight){let R=s.spot[y];R.position.setFromMatrixPosition(L.matrixWorld),R.position.applyMatrix4(x),R.direction.setFromMatrixPosition(L.matrixWorld),r.setFromMatrixPosition(L.target.matrixWorld),R.direction.sub(r),R.direction.transformDirection(x),y++}else if(L.isRectAreaLight){let R=s.rectArea[v];R.position.setFromMatrixPosition(L.matrixWorld),R.position.applyMatrix4(x),o.identity(),a.copy(L.matrixWorld),a.premultiply(x),o.extractRotation(a),R.halfWidth.set(L.width*.5,0,0),R.halfHeight.set(0,L.height*.5,0),R.halfWidth.applyMatrix4(o),R.halfHeight.applyMatrix4(o),v++}else if(L.isPointLight){let R=s.point[d];R.position.setFromMatrixPosition(L.matrixWorld),R.position.applyMatrix4(x),d++}else if(L.isHemisphereLight){let R=s.hemi[p];R.direction.setFromMatrixPosition(L.matrixWorld),R.direction.transformDirection(x),p++}}}return{setup:c,setupView:h,state:s}}function U0(i,t){let e=new bS(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(f){n.push(f)}function o(f){s.push(f)}function c(f){e.setup(n,f)}function h(f){e.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:c,setupLightsView:h,pushLight:a,pushShadow:o}}function SS(i,t){let e=new WeakMap;function n(r,a=0){let o=e.get(r),c;return o===void 0?(c=new U0(i,t),e.set(r,[c])):a>=o.length?(c=new U0(i,t),o.push(c)):c=o[a],c}function s(){e=new WeakMap}return{get:n,dispose:s}}var jf=class extends xr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=yy,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Kf=class extends xr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},ES=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,wS=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
#include <packing>
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = unpackRGBATo2Half( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ) );
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = unpackRGBAToDepth( texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ) );
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( squared_mean - mean * mean );
	gl_FragColor = pack2HalfToRGBA( vec2( mean, std_dev ) );
}`;function TS(i,t,e){let n=new wl,s=new fe,r=new fe,a=new Fn,o=new jf({depthPacking:_y}),c=new Kf,h={},u=e.maxTextureSize,f={[so]:gs,[gs]:so,[mn]:mn},g=new Qs({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:ES,fragmentShader:wS}),d=g.clone();d.defines.HORIZONTAL_PASS=1;let y=new Ln;y.setAttribute("position",new $n(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Ke(y,g),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=j0;let x=this.type;this.render=function(T,N,K){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;let C=i.getRenderTarget(),w=i.getActiveCubeFace(),it=i.getActiveMipmapLevel(),mt=i.state;mt.setBlending(eo),mt.buffers.color.setClear(1,1,1,1),mt.buffers.depth.setTest(!0),mt.setScissorTest(!1);let Kt=x!==Lr&&this.type===Lr,Q=x===Lr&&this.type!==Lr;for(let lt=0,bt=T.length;lt<bt;lt++){let Wt=T[lt],Zt=Wt.shadow;if(Zt===void 0){console.warn("THREE.WebGLShadowMap:",Wt,"has no shadow.");continue}if(Zt.autoUpdate===!1&&Zt.needsUpdate===!1)continue;s.copy(Zt.mapSize);let At=Zt.getFrameExtents();if(s.multiply(At),r.copy(Zt.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/At.x),s.x=r.x*At.x,Zt.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/At.y),s.y=r.y*At.y,Zt.mapSize.y=r.y)),Zt.map===null||Kt===!0||Q===!0){let le=this.type!==Lr?{minFilter:Li,magFilter:Li}:{};Zt.map!==null&&Zt.map.dispose(),Zt.map=new Ur(s.x,s.y,le),Zt.map.texture.name=Wt.name+".shadowMap",Zt.camera.updateProjectionMatrix()}i.setRenderTarget(Zt.map),i.clear();let Yt=Zt.getViewportCount();for(let le=0;le<Yt;le++){let Me=Zt.getViewport(le);a.set(r.x*Me.x,r.y*Me.y,r.x*Me.z,r.y*Me.w),mt.viewport(a),Zt.updateMatrices(Wt,le),n=Zt.getFrustum(),L(N,K,Zt.camera,Wt,this.type)}Zt.isPointLightShadow!==!0&&this.type===Lr&&A(Zt,K),Zt.needsUpdate=!1}x=this.type,p.needsUpdate=!1,i.setRenderTarget(C,w,it)};function A(T,N){let K=t.update(v);g.defines.VSM_SAMPLES!==T.blurSamples&&(g.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,g.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Ur(s.x,s.y)),g.uniforms.shadow_pass.value=T.map.texture,g.uniforms.resolution.value=T.mapSize,g.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(N,null,K,g,v,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(N,null,K,d,v,null)}function M(T,N,K,C){let w=null,it=K.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(it!==void 0)w=it;else if(w=K.isPointLight===!0?c:o,i.localClippingEnabled&&N.clipShadows===!0&&Array.isArray(N.clippingPlanes)&&N.clippingPlanes.length!==0||N.displacementMap&&N.displacementScale!==0||N.alphaMap&&N.alphaTest>0||N.map&&N.alphaTest>0){let mt=w.uuid,Kt=N.uuid,Q=h[mt];Q===void 0&&(Q={},h[mt]=Q);let lt=Q[Kt];lt===void 0&&(lt=w.clone(),Q[Kt]=lt,N.addEventListener("dispose",R)),w=lt}if(w.visible=N.visible,w.wireframe=N.wireframe,C===Lr?w.side=N.shadowSide!==null?N.shadowSide:N.side:w.side=N.shadowSide!==null?N.shadowSide:f[N.side],w.alphaMap=N.alphaMap,w.alphaTest=N.alphaTest,w.map=N.map,w.clipShadows=N.clipShadows,w.clippingPlanes=N.clippingPlanes,w.clipIntersection=N.clipIntersection,w.displacementMap=N.displacementMap,w.displacementScale=N.displacementScale,w.displacementBias=N.displacementBias,w.wireframeLinewidth=N.wireframeLinewidth,w.linewidth=N.linewidth,K.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let mt=i.properties.get(w);mt.light=K}return w}function L(T,N,K,C,w){if(T.visible===!1)return;if(T.layers.test(N.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&w===Lr)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(K.matrixWorldInverse,T.matrixWorld);let Kt=t.update(T),Q=T.material;if(Array.isArray(Q)){let lt=Kt.groups;for(let bt=0,Wt=lt.length;bt<Wt;bt++){let Zt=lt[bt],At=Q[Zt.materialIndex];if(At&&At.visible){let Yt=M(T,At,C,w);T.onBeforeShadow(i,T,N,K,Kt,Yt,Zt),i.renderBufferDirect(K,null,Kt,Yt,T,Zt),T.onAfterShadow(i,T,N,K,Kt,Yt,Zt)}}}else if(Q.visible){let lt=M(T,Q,C,w);T.onBeforeShadow(i,T,N,K,Kt,lt,null),i.renderBufferDirect(K,null,Kt,lt,T,null),T.onAfterShadow(i,T,N,K,Kt,lt,null)}}let mt=T.children;for(let Kt=0,Q=mt.length;Kt<Q;Kt++)L(mt[Kt],N,K,C,w)}function R(T){T.target.removeEventListener("dispose",R);for(let K in h){let C=h[K],w=T.target.uuid;w in C&&(C[w].dispose(),delete C[w])}}}function AS(i,t,e){let n=e.isWebGL2;function s(){let V=!1,Lt=new Fn,zt=null,re=new Fn(0,0,0,0);return{setMask:function(ce){zt!==ce&&!V&&(i.colorMask(ce,ce,ce,ce),zt=ce)},setLocked:function(ce){V=ce},setClear:function(ce,Ue,Qt,Ne,He){He===!0&&(ce*=Ne,Ue*=Ne,Qt*=Ne),Lt.set(ce,Ue,Qt,Ne),re.equals(Lt)===!1&&(i.clearColor(ce,Ue,Qt,Ne),re.copy(Lt))},reset:function(){V=!1,zt=null,re.set(-1,0,0,0)}}}function r(){let V=!1,Lt=null,zt=null,re=null;return{setTest:function(ce){ce?Ze(i.DEPTH_TEST):De(i.DEPTH_TEST)},setMask:function(ce){Lt!==ce&&!V&&(i.depthMask(ce),Lt=ce)},setFunc:function(ce){if(zt!==ce){switch(ce){case Z1:i.depthFunc(i.NEVER);break;case J1:i.depthFunc(i.ALWAYS);break;case j1:i.depthFunc(i.LESS);break;case $c:i.depthFunc(i.LEQUAL);break;case K1:i.depthFunc(i.EQUAL);break;case Q1:i.depthFunc(i.GEQUAL);break;case ty:i.depthFunc(i.GREATER);break;case ey:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}zt=ce}},setLocked:function(ce){V=ce},setClear:function(ce){re!==ce&&(i.clearDepth(ce),re=ce)},reset:function(){V=!1,Lt=null,zt=null,re=null}}}function a(){let V=!1,Lt=null,zt=null,re=null,ce=null,Ue=null,Qt=null,Ne=null,He=null;return{setTest:function(Oe){V||(Oe?Ze(i.STENCIL_TEST):De(i.STENCIL_TEST))},setMask:function(Oe){Lt!==Oe&&!V&&(i.stencilMask(Oe),Lt=Oe)},setFunc:function(Oe,sn,hn){(zt!==Oe||re!==sn||ce!==hn)&&(i.stencilFunc(Oe,sn,hn),zt=Oe,re=sn,ce=hn)},setOp:function(Oe,sn,hn){(Ue!==Oe||Qt!==sn||Ne!==hn)&&(i.stencilOp(Oe,sn,hn),Ue=Oe,Qt=sn,Ne=hn)},setLocked:function(Oe){V=Oe},setClear:function(Oe){He!==Oe&&(i.clearStencil(Oe),He=Oe)},reset:function(){V=!1,Lt=null,zt=null,re=null,ce=null,Ue=null,Qt=null,Ne=null,He=null}}}let o=new s,c=new r,h=new a,u=new WeakMap,f=new WeakMap,g={},d={},y=new WeakMap,v=[],p=null,x=!1,A=null,M=null,L=null,R=null,T=null,N=null,K=null,C=new fn(0,0,0),w=0,it=!1,mt=null,Kt=null,Q=null,lt=null,bt=null,Wt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Zt=!1,At=0,Yt=i.getParameter(i.VERSION);Yt.indexOf("WebGL")!==-1?(At=parseFloat(/^WebGL (\d)/.exec(Yt)[1]),Zt=At>=1):Yt.indexOf("OpenGL ES")!==-1&&(At=parseFloat(/^OpenGL ES (\d)/.exec(Yt)[1]),Zt=At>=2);let le=null,Me={},Rt=i.getParameter(i.SCISSOR_BOX),Ft=i.getParameter(i.VIEWPORT),ye=new Fn().fromArray(Rt),Re=new Fn().fromArray(Ft);function Le(V,Lt,zt,re){let ce=new Uint8Array(4),Ue=i.createTexture();i.bindTexture(V,Ue),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Qt=0;Qt<zt;Qt++)n&&(V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY)?i.texImage3D(Lt,0,i.RGBA,1,1,re,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(Lt+Qt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return Ue}let Xe={};Xe[i.TEXTURE_2D]=Le(i.TEXTURE_2D,i.TEXTURE_2D,1),Xe[i.TEXTURE_CUBE_MAP]=Le(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Xe[i.TEXTURE_2D_ARRAY]=Le(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Xe[i.TEXTURE_3D]=Le(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),c.setClear(1),h.setClear(0),Ze(i.DEPTH_TEST),c.setFunc($c),be(!1),F(pm),Ze(i.CULL_FACE),Jt(eo);function Ze(V){g[V]!==!0&&(i.enable(V),g[V]=!0)}function De(V){g[V]!==!1&&(i.disable(V),g[V]=!1)}function Be(V,Lt){return d[V]!==Lt?(i.bindFramebuffer(V,Lt),d[V]=Lt,n&&(V===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=Lt),V===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=Lt)),!0):!1}function tt(V,Lt){let zt=v,re=!1;if(V)if(zt=y.get(Lt),zt===void 0&&(zt=[],y.set(Lt,zt)),V.isWebGLMultipleRenderTargets){let ce=V.texture;if(zt.length!==ce.length||zt[0]!==i.COLOR_ATTACHMENT0){for(let Ue=0,Qt=ce.length;Ue<Qt;Ue++)zt[Ue]=i.COLOR_ATTACHMENT0+Ue;zt.length=ce.length,re=!0}}else zt[0]!==i.COLOR_ATTACHMENT0&&(zt[0]=i.COLOR_ATTACHMENT0,re=!0);else zt[0]!==i.BACK&&(zt[0]=i.BACK,re=!0);re&&(e.isWebGL2?i.drawBuffers(zt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(zt))}function Se(V){return p!==V?(i.useProgram(V),p=V,!0):!1}let ct={[wo]:i.FUNC_ADD,[U1]:i.FUNC_SUBTRACT,[N1]:i.FUNC_REVERSE_SUBTRACT};if(n)ct[ym]=i.MIN,ct[_m]=i.MAX;else{let V=t.get("EXT_blend_minmax");V!==null&&(ct[ym]=V.MIN_EXT,ct[_m]=V.MAX_EXT)}let _e={[O1]:i.ZERO,[F1]:i.ONE,[B1]:i.SRC_COLOR,[Df]:i.SRC_ALPHA,[W1]:i.SRC_ALPHA_SATURATE,[V1]:i.DST_COLOR,[k1]:i.DST_ALPHA,[z1]:i.ONE_MINUS_SRC_COLOR,[Uf]:i.ONE_MINUS_SRC_ALPHA,[G1]:i.ONE_MINUS_DST_COLOR,[H1]:i.ONE_MINUS_DST_ALPHA,[X1]:i.CONSTANT_COLOR,[q1]:i.ONE_MINUS_CONSTANT_COLOR,[Y1]:i.CONSTANT_ALPHA,[$1]:i.ONE_MINUS_CONSTANT_ALPHA};function Jt(V,Lt,zt,re,ce,Ue,Qt,Ne,He,Oe){if(V===eo){x===!0&&(De(i.BLEND),x=!1);return}if(x===!1&&(Ze(i.BLEND),x=!0),V!==D1){if(V!==A||Oe!==it){if((M!==wo||T!==wo)&&(i.blendEquation(i.FUNC_ADD),M=wo,T=wo),Oe)switch(V){case wa:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case mm:i.blendFunc(i.ONE,i.ONE);break;case gm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xm:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case wa:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case mm:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case gm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case xm:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}L=null,R=null,N=null,K=null,C.set(0,0,0),w=0,A=V,it=Oe}return}ce=ce||Lt,Ue=Ue||zt,Qt=Qt||re,(Lt!==M||ce!==T)&&(i.blendEquationSeparate(ct[Lt],ct[ce]),M=Lt,T=ce),(zt!==L||re!==R||Ue!==N||Qt!==K)&&(i.blendFuncSeparate(_e[zt],_e[re],_e[Ue],_e[Qt]),L=zt,R=re,N=Ue,K=Qt),(Ne.equals(C)===!1||He!==w)&&(i.blendColor(Ne.r,Ne.g,Ne.b,He),C.copy(Ne),w=He),A=V,it=!1}function ke(V,Lt){V.side===mn?De(i.CULL_FACE):Ze(i.CULL_FACE);let zt=V.side===gs;Lt&&(zt=!zt),be(zt),V.blending===wa&&V.transparent===!1?Jt(eo):Jt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),c.setFunc(V.depthFunc),c.setTest(V.depthTest),c.setMask(V.depthWrite),o.setMask(V.colorWrite);let re=V.stencilWrite;h.setTest(re),re&&(h.setMask(V.stencilWriteMask),h.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),h.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),_t(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?Ze(i.SAMPLE_ALPHA_TO_COVERAGE):De(i.SAMPLE_ALPHA_TO_COVERAGE)}function be(V){mt!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),mt=V)}function F(V){V!==L1?(Ze(i.CULL_FACE),V!==Kt&&(V===pm?i.cullFace(i.BACK):V===I1?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):De(i.CULL_FACE),Kt=V}function I(V){V!==Q&&(Zt&&i.lineWidth(V),Q=V)}function _t(V,Lt,zt){V?(Ze(i.POLYGON_OFFSET_FILL),(lt!==Lt||bt!==zt)&&(i.polygonOffset(Lt,zt),lt=Lt,bt=zt)):De(i.POLYGON_OFFSET_FILL)}function xe(V){V?Ze(i.SCISSOR_TEST):De(i.SCISSOR_TEST)}function de(V){V===void 0&&(V=i.TEXTURE0+Wt-1),le!==V&&(i.activeTexture(V),le=V)}function ue(V,Lt,zt){zt===void 0&&(le===null?zt=i.TEXTURE0+Wt-1:zt=le);let re=Me[zt];re===void 0&&(re={type:void 0,texture:void 0},Me[zt]=re),(re.type!==V||re.texture!==Lt)&&(le!==zt&&(i.activeTexture(zt),le=zt),i.bindTexture(V,Lt||Xe[V]),re.type=V,re.texture=Lt)}function We(){let V=Me[le];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function qt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function we(){try{i.compressedTexImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Je(){try{i.texSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function nn(){try{i.texSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function pe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function gn(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function G(){try{i.texStorage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function oe(){try{i.texStorage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ve(){try{i.texImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function nt(){try{i.texImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function dt(V){ye.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),ye.copy(V))}function jt(V){Re.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),Re.copy(V))}function te(V,Lt){let zt=f.get(Lt);zt===void 0&&(zt=new WeakMap,f.set(Lt,zt));let re=zt.get(V);re===void 0&&(re=i.getUniformBlockIndex(Lt,V.name),zt.set(V,re))}function ee(V,Lt){let re=f.get(Lt).get(V);u.get(Lt)!==re&&(i.uniformBlockBinding(Lt,re,V.__bindingPointIndex),u.set(Lt,re))}function ht(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),g={},le=null,Me={},d={},y=new WeakMap,v=[],p=null,x=!1,A=null,M=null,L=null,R=null,T=null,N=null,K=null,C=new fn(0,0,0),w=0,it=!1,mt=null,Kt=null,Q=null,lt=null,bt=null,ye.set(0,0,i.canvas.width,i.canvas.height),Re.set(0,0,i.canvas.width,i.canvas.height),o.reset(),c.reset(),h.reset()}return{buffers:{color:o,depth:c,stencil:h},enable:Ze,disable:De,bindFramebuffer:Be,drawBuffers:tt,useProgram:Se,setBlending:Jt,setMaterial:ke,setFlipSided:be,setCullFace:F,setLineWidth:I,setPolygonOffset:_t,setScissorTest:xe,activeTexture:de,bindTexture:ue,unbindTexture:We,compressedTexImage2D:qt,compressedTexImage3D:we,texImage2D:ve,texImage3D:nt,updateUBOMapping:te,uniformBlockBinding:ee,texStorage2D:G,texStorage3D:oe,texSubImage2D:Je,texSubImage3D:nn,compressedTexSubImage2D:pe,compressedTexSubImage3D:gn,scissor:dt,viewport:jt,reset:ht}}function RS(i,t,e,n,s,r,a){let o=s.isWebGL2,c=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap,f,g=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(F,I){return d?new OffscreenCanvas(F,I):nh("canvas")}function v(F,I,_t,xe){let de=1;if((F.width>xe||F.height>xe)&&(de=xe/Math.max(F.width,F.height)),de<1||I===!0)if(typeof HTMLImageElement<"u"&&F instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&F instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&F instanceof ImageBitmap){let ue=I?eh:Math.floor,We=ue(de*F.width),qt=ue(de*F.height);f===void 0&&(f=y(We,qt));let we=_t?y(We,qt):f;return we.width=We,we.height=qt,we.getContext("2d").drawImage(F,0,0,We,qt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+F.width+"x"+F.height+") to ("+We+"x"+qt+")."),we}else return"data"in F&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+F.width+"x"+F.height+")."),F;return F}function p(F){return kf(F.width)&&kf(F.height)}function x(F){return o?!1:F.wrapS!==Js||F.wrapT!==Js||F.minFilter!==Li&&F.minFilter!==ms}function A(F,I){return F.generateMipmaps&&I&&F.minFilter!==Li&&F.minFilter!==ms}function M(F){i.generateMipmap(F)}function L(F,I,_t,xe,de=!1){if(o===!1)return I;if(F!==null){if(i[F]!==void 0)return i[F];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+F+"'")}let ue=I;if(I===i.RED&&(_t===i.FLOAT&&(ue=i.R32F),_t===i.HALF_FLOAT&&(ue=i.R16F),_t===i.UNSIGNED_BYTE&&(ue=i.R8)),I===i.RED_INTEGER&&(_t===i.UNSIGNED_BYTE&&(ue=i.R8UI),_t===i.UNSIGNED_SHORT&&(ue=i.R16UI),_t===i.UNSIGNED_INT&&(ue=i.R32UI),_t===i.BYTE&&(ue=i.R8I),_t===i.SHORT&&(ue=i.R16I),_t===i.INT&&(ue=i.R32I)),I===i.RG&&(_t===i.FLOAT&&(ue=i.RG32F),_t===i.HALF_FLOAT&&(ue=i.RG16F),_t===i.UNSIGNED_BYTE&&(ue=i.RG8)),I===i.RGBA){let We=de?jc:Wn.getTransfer(xe);_t===i.FLOAT&&(ue=i.RGBA32F),_t===i.HALF_FLOAT&&(ue=i.RGBA16F),_t===i.UNSIGNED_BYTE&&(ue=We===ai?i.SRGB8_ALPHA8:i.RGBA8),_t===i.UNSIGNED_SHORT_4_4_4_4&&(ue=i.RGBA4),_t===i.UNSIGNED_SHORT_5_5_5_1&&(ue=i.RGB5_A1)}return(ue===i.R16F||ue===i.R32F||ue===i.RG16F||ue===i.RG32F||ue===i.RGBA16F||ue===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ue}function R(F,I,_t){return A(F,_t)===!0||F.isFramebufferTexture&&F.minFilter!==Li&&F.minFilter!==ms?Math.log2(Math.max(I.width,I.height))+1:F.mipmaps!==void 0&&F.mipmaps.length>0?F.mipmaps.length:F.isCompressedTexture&&Array.isArray(F.image)?I.mipmaps.length:1}function T(F){return F===Li||F===vm||F===Ku?i.NEAREST:i.LINEAR}function N(F){let I=F.target;I.removeEventListener("dispose",N),C(I),I.isVideoTexture&&u.delete(I)}function K(F){let I=F.target;I.removeEventListener("dispose",K),it(I)}function C(F){let I=n.get(F);if(I.__webglInit===void 0)return;let _t=F.source,xe=g.get(_t);if(xe){let de=xe[I.__cacheKey];de.usedTimes--,de.usedTimes===0&&w(F),Object.keys(xe).length===0&&g.delete(_t)}n.remove(F)}function w(F){let I=n.get(F);i.deleteTexture(I.__webglTexture);let _t=F.source,xe=g.get(_t);delete xe[I.__cacheKey],a.memory.textures--}function it(F){let I=F.texture,_t=n.get(F),xe=n.get(I);if(xe.__webglTexture!==void 0&&(i.deleteTexture(xe.__webglTexture),a.memory.textures--),F.depthTexture&&F.depthTexture.dispose(),F.isWebGLCubeRenderTarget)for(let de=0;de<6;de++){if(Array.isArray(_t.__webglFramebuffer[de]))for(let ue=0;ue<_t.__webglFramebuffer[de].length;ue++)i.deleteFramebuffer(_t.__webglFramebuffer[de][ue]);else i.deleteFramebuffer(_t.__webglFramebuffer[de]);_t.__webglDepthbuffer&&i.deleteRenderbuffer(_t.__webglDepthbuffer[de])}else{if(Array.isArray(_t.__webglFramebuffer))for(let de=0;de<_t.__webglFramebuffer.length;de++)i.deleteFramebuffer(_t.__webglFramebuffer[de]);else i.deleteFramebuffer(_t.__webglFramebuffer);if(_t.__webglDepthbuffer&&i.deleteRenderbuffer(_t.__webglDepthbuffer),_t.__webglMultisampledFramebuffer&&i.deleteFramebuffer(_t.__webglMultisampledFramebuffer),_t.__webglColorRenderbuffer)for(let de=0;de<_t.__webglColorRenderbuffer.length;de++)_t.__webglColorRenderbuffer[de]&&i.deleteRenderbuffer(_t.__webglColorRenderbuffer[de]);_t.__webglDepthRenderbuffer&&i.deleteRenderbuffer(_t.__webglDepthRenderbuffer)}if(F.isWebGLMultipleRenderTargets)for(let de=0,ue=I.length;de<ue;de++){let We=n.get(I[de]);We.__webglTexture&&(i.deleteTexture(We.__webglTexture),a.memory.textures--),n.remove(I[de])}n.remove(I),n.remove(F)}let mt=0;function Kt(){mt=0}function Q(){let F=mt;return F>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+F+" texture units while this GPU supports only "+s.maxTextures),mt+=1,F}function lt(F){let I=[];return I.push(F.wrapS),I.push(F.wrapT),I.push(F.wrapR||0),I.push(F.magFilter),I.push(F.minFilter),I.push(F.anisotropy),I.push(F.internalFormat),I.push(F.format),I.push(F.type),I.push(F.generateMipmaps),I.push(F.premultiplyAlpha),I.push(F.flipY),I.push(F.unpackAlignment),I.push(F.colorSpace),I.join()}function bt(F,I){let _t=n.get(F);if(F.isVideoTexture&&ke(F),F.isRenderTargetTexture===!1&&F.version>0&&_t.__version!==F.version){let xe=F.image;if(xe===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(xe.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ye(_t,F,I);return}}e.bindTexture(i.TEXTURE_2D,_t.__webglTexture,i.TEXTURE0+I)}function Wt(F,I){let _t=n.get(F);if(F.version>0&&_t.__version!==F.version){ye(_t,F,I);return}e.bindTexture(i.TEXTURE_2D_ARRAY,_t.__webglTexture,i.TEXTURE0+I)}function Zt(F,I){let _t=n.get(F);if(F.version>0&&_t.__version!==F.version){ye(_t,F,I);return}e.bindTexture(i.TEXTURE_3D,_t.__webglTexture,i.TEXTURE0+I)}function At(F,I){let _t=n.get(F);if(F.version>0&&_t.__version!==F.version){Re(_t,F,I);return}e.bindTexture(i.TEXTURE_CUBE_MAP,_t.__webglTexture,i.TEXTURE0+I)}let Yt={[ro]:i.REPEAT,[Js]:i.CLAMP_TO_EDGE,[Ff]:i.MIRRORED_REPEAT},le={[Li]:i.NEAREST,[vm]:i.NEAREST_MIPMAP_NEAREST,[Ku]:i.NEAREST_MIPMAP_LINEAR,[ms]:i.LINEAR,[cy]:i.LINEAR_MIPMAP_NEAREST,[Ml]:i.LINEAR_MIPMAP_LINEAR},Me={[My]:i.NEVER,[Ay]:i.ALWAYS,[by]:i.LESS,[ag]:i.LEQUAL,[Sy]:i.EQUAL,[Ty]:i.GEQUAL,[Ey]:i.GREATER,[wy]:i.NOTEQUAL};function Rt(F,I,_t){if(_t?(i.texParameteri(F,i.TEXTURE_WRAP_S,Yt[I.wrapS]),i.texParameteri(F,i.TEXTURE_WRAP_T,Yt[I.wrapT]),(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)&&i.texParameteri(F,i.TEXTURE_WRAP_R,Yt[I.wrapR]),i.texParameteri(F,i.TEXTURE_MAG_FILTER,le[I.magFilter]),i.texParameteri(F,i.TEXTURE_MIN_FILTER,le[I.minFilter])):(i.texParameteri(F,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(F,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(F===i.TEXTURE_3D||F===i.TEXTURE_2D_ARRAY)&&i.texParameteri(F,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(I.wrapS!==Js||I.wrapT!==Js)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(F,i.TEXTURE_MAG_FILTER,T(I.magFilter)),i.texParameteri(F,i.TEXTURE_MIN_FILTER,T(I.minFilter)),I.minFilter!==Li&&I.minFilter!==ms&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),I.compareFunction&&(i.texParameteri(F,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(F,i.TEXTURE_COMPARE_FUNC,Me[I.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let xe=t.get("EXT_texture_filter_anisotropic");if(I.magFilter===Li||I.minFilter!==Ku&&I.minFilter!==Ml||I.type===to&&t.has("OES_texture_float_linear")===!1||o===!1&&I.type===bl&&t.has("OES_texture_half_float_linear")===!1)return;(I.anisotropy>1||n.get(I).__currentAnisotropy)&&(i.texParameterf(F,xe.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(I.anisotropy,s.getMaxAnisotropy())),n.get(I).__currentAnisotropy=I.anisotropy)}}function Ft(F,I){let _t=!1;F.__webglInit===void 0&&(F.__webglInit=!0,I.addEventListener("dispose",N));let xe=I.source,de=g.get(xe);de===void 0&&(de={},g.set(xe,de));let ue=lt(I);if(ue!==F.__cacheKey){de[ue]===void 0&&(de[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,_t=!0),de[ue].usedTimes++;let We=de[F.__cacheKey];We!==void 0&&(de[F.__cacheKey].usedTimes--,We.usedTimes===0&&w(I)),F.__cacheKey=ue,F.__webglTexture=de[ue].texture}return _t}function ye(F,I,_t){let xe=i.TEXTURE_2D;(I.isDataArrayTexture||I.isCompressedArrayTexture)&&(xe=i.TEXTURE_2D_ARRAY),I.isData3DTexture&&(xe=i.TEXTURE_3D);let de=Ft(F,I),ue=I.source;e.bindTexture(xe,F.__webglTexture,i.TEXTURE0+_t);let We=n.get(ue);if(ue.version!==We.__version||de===!0){e.activeTexture(i.TEXTURE0+_t);let qt=Wn.getPrimaries(Wn.workingColorSpace),we=I.colorSpace===Fs?null:Wn.getPrimaries(I.colorSpace),Je=I.colorSpace===Fs||qt===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,I.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,I.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);let nn=x(I)&&p(I.image)===!1,pe=v(I.image,nn,!1,s.maxTextureSize);pe=be(I,pe);let gn=p(pe)||o,G=r.convert(I.format,I.colorSpace),oe=r.convert(I.type),ve=L(I.internalFormat,G,oe,I.colorSpace,I.isVideoTexture);Rt(xe,I,gn);let nt,dt=I.mipmaps,jt=o&&I.isVideoTexture!==!0&&ve!==rg,te=We.__version===void 0||de===!0,ee=R(I,pe,gn);if(I.isDepthTexture)ve=i.DEPTH_COMPONENT,o?I.type===to?ve=i.DEPTH_COMPONENT32F:I.type===Qr?ve=i.DEPTH_COMPONENT24:I.type===Ao?ve=i.DEPTH24_STENCIL8:ve=i.DEPTH_COMPONENT16:I.type===to&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),I.format===Ro&&ve===i.DEPTH_COMPONENT&&I.type!==Td&&I.type!==Qr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),I.type=Qr,oe=r.convert(I.type)),I.format===Pa&&ve===i.DEPTH_COMPONENT&&(ve=i.DEPTH_STENCIL,I.type!==Ao&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),I.type=Ao,oe=r.convert(I.type))),te&&(jt?e.texStorage2D(i.TEXTURE_2D,1,ve,pe.width,pe.height):e.texImage2D(i.TEXTURE_2D,0,ve,pe.width,pe.height,0,G,oe,null));else if(I.isDataTexture)if(dt.length>0&&gn){jt&&te&&e.texStorage2D(i.TEXTURE_2D,ee,ve,dt[0].width,dt[0].height);for(let ht=0,V=dt.length;ht<V;ht++)nt=dt[ht],jt?e.texSubImage2D(i.TEXTURE_2D,ht,0,0,nt.width,nt.height,G,oe,nt.data):e.texImage2D(i.TEXTURE_2D,ht,ve,nt.width,nt.height,0,G,oe,nt.data);I.generateMipmaps=!1}else jt?(te&&e.texStorage2D(i.TEXTURE_2D,ee,ve,pe.width,pe.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,pe.width,pe.height,G,oe,pe.data)):e.texImage2D(i.TEXTURE_2D,0,ve,pe.width,pe.height,0,G,oe,pe.data);else if(I.isCompressedTexture)if(I.isCompressedArrayTexture){jt&&te&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ee,ve,dt[0].width,dt[0].height,pe.depth);for(let ht=0,V=dt.length;ht<V;ht++)nt=dt[ht],I.format!==js?G!==null?jt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,nt.width,nt.height,pe.depth,G,nt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ht,ve,nt.width,nt.height,pe.depth,0,nt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,nt.width,nt.height,pe.depth,G,oe,nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ht,ve,nt.width,nt.height,pe.depth,0,G,oe,nt.data)}else{jt&&te&&e.texStorage2D(i.TEXTURE_2D,ee,ve,dt[0].width,dt[0].height);for(let ht=0,V=dt.length;ht<V;ht++)nt=dt[ht],I.format!==js?G!==null?jt?e.compressedTexSubImage2D(i.TEXTURE_2D,ht,0,0,nt.width,nt.height,G,nt.data):e.compressedTexImage2D(i.TEXTURE_2D,ht,ve,nt.width,nt.height,0,nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage2D(i.TEXTURE_2D,ht,0,0,nt.width,nt.height,G,oe,nt.data):e.texImage2D(i.TEXTURE_2D,ht,ve,nt.width,nt.height,0,G,oe,nt.data)}else if(I.isDataArrayTexture)jt?(te&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ee,ve,pe.width,pe.height,pe.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,G,oe,pe.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ve,pe.width,pe.height,pe.depth,0,G,oe,pe.data);else if(I.isData3DTexture)jt?(te&&e.texStorage3D(i.TEXTURE_3D,ee,ve,pe.width,pe.height,pe.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,G,oe,pe.data)):e.texImage3D(i.TEXTURE_3D,0,ve,pe.width,pe.height,pe.depth,0,G,oe,pe.data);else if(I.isFramebufferTexture){if(te)if(jt)e.texStorage2D(i.TEXTURE_2D,ee,ve,pe.width,pe.height);else{let ht=pe.width,V=pe.height;for(let Lt=0;Lt<ee;Lt++)e.texImage2D(i.TEXTURE_2D,Lt,ve,ht,V,0,G,oe,null),ht>>=1,V>>=1}}else if(dt.length>0&&gn){jt&&te&&e.texStorage2D(i.TEXTURE_2D,ee,ve,dt[0].width,dt[0].height);for(let ht=0,V=dt.length;ht<V;ht++)nt=dt[ht],jt?e.texSubImage2D(i.TEXTURE_2D,ht,0,0,G,oe,nt):e.texImage2D(i.TEXTURE_2D,ht,ve,G,oe,nt);I.generateMipmaps=!1}else jt?(te&&e.texStorage2D(i.TEXTURE_2D,ee,ve,pe.width,pe.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,G,oe,pe)):e.texImage2D(i.TEXTURE_2D,0,ve,G,oe,pe);A(I,gn)&&M(xe),We.__version=ue.version,I.onUpdate&&I.onUpdate(I)}F.__version=I.version}function Re(F,I,_t){if(I.image.length!==6)return;let xe=Ft(F,I),de=I.source;e.bindTexture(i.TEXTURE_CUBE_MAP,F.__webglTexture,i.TEXTURE0+_t);let ue=n.get(de);if(de.version!==ue.__version||xe===!0){e.activeTexture(i.TEXTURE0+_t);let We=Wn.getPrimaries(Wn.workingColorSpace),qt=I.colorSpace===Fs?null:Wn.getPrimaries(I.colorSpace),we=I.colorSpace===Fs||We===qt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,I.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,I.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let Je=I.isCompressedTexture||I.image[0].isCompressedTexture,nn=I.image[0]&&I.image[0].isDataTexture,pe=[];for(let ht=0;ht<6;ht++)!Je&&!nn?pe[ht]=v(I.image[ht],!1,!0,s.maxCubemapSize):pe[ht]=nn?I.image[ht].image:I.image[ht],pe[ht]=be(I,pe[ht]);let gn=pe[0],G=p(gn)||o,oe=r.convert(I.format,I.colorSpace),ve=r.convert(I.type),nt=L(I.internalFormat,oe,ve,I.colorSpace),dt=o&&I.isVideoTexture!==!0,jt=ue.__version===void 0||xe===!0,te=R(I,gn,G);Rt(i.TEXTURE_CUBE_MAP,I,G);let ee;if(Je){dt&&jt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,te,nt,gn.width,gn.height);for(let ht=0;ht<6;ht++){ee=pe[ht].mipmaps;for(let V=0;V<ee.length;V++){let Lt=ee[V];I.format!==js?oe!==null?dt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,0,0,Lt.width,Lt.height,oe,Lt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,nt,Lt.width,Lt.height,0,Lt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,0,0,Lt.width,Lt.height,oe,ve,Lt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,nt,Lt.width,Lt.height,0,oe,ve,Lt.data)}}}else{ee=I.mipmaps,dt&&jt&&(ee.length>0&&te++,e.texStorage2D(i.TEXTURE_CUBE_MAP,te,nt,pe[0].width,pe[0].height));for(let ht=0;ht<6;ht++)if(nn){dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,pe[ht].width,pe[ht].height,oe,ve,pe[ht].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,nt,pe[ht].width,pe[ht].height,0,oe,ve,pe[ht].data);for(let V=0;V<ee.length;V++){let zt=ee[V].image[ht].image;dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,0,0,zt.width,zt.height,oe,ve,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,nt,zt.width,zt.height,0,oe,ve,zt.data)}}else{dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,oe,ve,pe[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,nt,oe,ve,pe[ht]);for(let V=0;V<ee.length;V++){let Lt=ee[V];dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,0,0,oe,ve,Lt.image[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,nt,oe,ve,Lt.image[ht])}}}A(I,G)&&M(i.TEXTURE_CUBE_MAP),ue.__version=de.version,I.onUpdate&&I.onUpdate(I)}F.__version=I.version}function Le(F,I,_t,xe,de,ue){let We=r.convert(_t.format,_t.colorSpace),qt=r.convert(_t.type),we=L(_t.internalFormat,We,qt,_t.colorSpace);if(!n.get(I).__hasExternalTextures){let nn=Math.max(1,I.width>>ue),pe=Math.max(1,I.height>>ue);de===i.TEXTURE_3D||de===i.TEXTURE_2D_ARRAY?e.texImage3D(de,ue,we,nn,pe,I.depth,0,We,qt,null):e.texImage2D(de,ue,we,nn,pe,0,We,qt,null)}e.bindFramebuffer(i.FRAMEBUFFER,F),Jt(I)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,xe,de,n.get(_t).__webglTexture,0,_e(I)):(de===i.TEXTURE_2D||de>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&de<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,xe,de,n.get(_t).__webglTexture,ue),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Xe(F,I,_t){if(i.bindRenderbuffer(i.RENDERBUFFER,F),I.depthBuffer&&!I.stencilBuffer){let xe=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(_t||Jt(I)){let de=I.depthTexture;de&&de.isDepthTexture&&(de.type===to?xe=i.DEPTH_COMPONENT32F:de.type===Qr&&(xe=i.DEPTH_COMPONENT24));let ue=_e(I);Jt(I)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ue,xe,I.width,I.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,xe,I.width,I.height)}else i.renderbufferStorage(i.RENDERBUFFER,xe,I.width,I.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,F)}else if(I.depthBuffer&&I.stencilBuffer){let xe=_e(I);_t&&Jt(I)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,xe,i.DEPTH24_STENCIL8,I.width,I.height):Jt(I)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,xe,i.DEPTH24_STENCIL8,I.width,I.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,F)}else{let xe=I.isWebGLMultipleRenderTargets===!0?I.texture:[I.texture];for(let de=0;de<xe.length;de++){let ue=xe[de],We=r.convert(ue.format,ue.colorSpace),qt=r.convert(ue.type),we=L(ue.internalFormat,We,qt,ue.colorSpace),Je=_e(I);_t&&Jt(I)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Je,we,I.width,I.height):Jt(I)?c.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Je,we,I.width,I.height):i.renderbufferStorage(i.RENDERBUFFER,we,I.width,I.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ze(F,I){if(I&&I.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,F),!(I.depthTexture&&I.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(I.depthTexture).__webglTexture||I.depthTexture.image.width!==I.width||I.depthTexture.image.height!==I.height)&&(I.depthTexture.image.width=I.width,I.depthTexture.image.height=I.height,I.depthTexture.needsUpdate=!0),bt(I.depthTexture,0);let xe=n.get(I.depthTexture).__webglTexture,de=_e(I);if(I.depthTexture.format===Ro)Jt(I)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,xe,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,xe,0);else if(I.depthTexture.format===Pa)Jt(I)?c.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,xe,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,xe,0);else throw new Error("Unknown depthTexture format")}function De(F){let I=n.get(F),_t=F.isWebGLCubeRenderTarget===!0;if(F.depthTexture&&!I.__autoAllocateDepthBuffer){if(_t)throw new Error("target.depthTexture not supported in Cube render targets");Ze(I.__webglFramebuffer,F)}else if(_t){I.__webglDepthbuffer=[];for(let xe=0;xe<6;xe++)e.bindFramebuffer(i.FRAMEBUFFER,I.__webglFramebuffer[xe]),I.__webglDepthbuffer[xe]=i.createRenderbuffer(),Xe(I.__webglDepthbuffer[xe],F,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,I.__webglFramebuffer),I.__webglDepthbuffer=i.createRenderbuffer(),Xe(I.__webglDepthbuffer,F,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Be(F,I,_t){let xe=n.get(F);I!==void 0&&Le(xe.__webglFramebuffer,F,F.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),_t!==void 0&&De(F)}function tt(F){let I=F.texture,_t=n.get(F),xe=n.get(I);F.addEventListener("dispose",K),F.isWebGLMultipleRenderTargets!==!0&&(xe.__webglTexture===void 0&&(xe.__webglTexture=i.createTexture()),xe.__version=I.version,a.memory.textures++);let de=F.isWebGLCubeRenderTarget===!0,ue=F.isWebGLMultipleRenderTargets===!0,We=p(F)||o;if(de){_t.__webglFramebuffer=[];for(let qt=0;qt<6;qt++)if(o&&I.mipmaps&&I.mipmaps.length>0){_t.__webglFramebuffer[qt]=[];for(let we=0;we<I.mipmaps.length;we++)_t.__webglFramebuffer[qt][we]=i.createFramebuffer()}else _t.__webglFramebuffer[qt]=i.createFramebuffer()}else{if(o&&I.mipmaps&&I.mipmaps.length>0){_t.__webglFramebuffer=[];for(let qt=0;qt<I.mipmaps.length;qt++)_t.__webglFramebuffer[qt]=i.createFramebuffer()}else _t.__webglFramebuffer=i.createFramebuffer();if(ue)if(s.drawBuffers){let qt=F.texture;for(let we=0,Je=qt.length;we<Je;we++){let nn=n.get(qt[we]);nn.__webglTexture===void 0&&(nn.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&F.samples>0&&Jt(F)===!1){let qt=ue?I:[I];_t.__webglMultisampledFramebuffer=i.createFramebuffer(),_t.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,_t.__webglMultisampledFramebuffer);for(let we=0;we<qt.length;we++){let Je=qt[we];_t.__webglColorRenderbuffer[we]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,_t.__webglColorRenderbuffer[we]);let nn=r.convert(Je.format,Je.colorSpace),pe=r.convert(Je.type),gn=L(Je.internalFormat,nn,pe,Je.colorSpace,F.isXRRenderTarget===!0),G=_e(F);i.renderbufferStorageMultisample(i.RENDERBUFFER,G,gn,F.width,F.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,_t.__webglColorRenderbuffer[we])}i.bindRenderbuffer(i.RENDERBUFFER,null),F.depthBuffer&&(_t.__webglDepthRenderbuffer=i.createRenderbuffer(),Xe(_t.__webglDepthRenderbuffer,F,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(de){e.bindTexture(i.TEXTURE_CUBE_MAP,xe.__webglTexture),Rt(i.TEXTURE_CUBE_MAP,I,We);for(let qt=0;qt<6;qt++)if(o&&I.mipmaps&&I.mipmaps.length>0)for(let we=0;we<I.mipmaps.length;we++)Le(_t.__webglFramebuffer[qt][we],F,I,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+qt,we);else Le(_t.__webglFramebuffer[qt],F,I,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+qt,0);A(I,We)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ue){let qt=F.texture;for(let we=0,Je=qt.length;we<Je;we++){let nn=qt[we],pe=n.get(nn);e.bindTexture(i.TEXTURE_2D,pe.__webglTexture),Rt(i.TEXTURE_2D,nn,We),Le(_t.__webglFramebuffer,F,nn,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,0),A(nn,We)&&M(i.TEXTURE_2D)}e.unbindTexture()}else{let qt=i.TEXTURE_2D;if((F.isWebGL3DRenderTarget||F.isWebGLArrayRenderTarget)&&(o?qt=F.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(qt,xe.__webglTexture),Rt(qt,I,We),o&&I.mipmaps&&I.mipmaps.length>0)for(let we=0;we<I.mipmaps.length;we++)Le(_t.__webglFramebuffer[we],F,I,i.COLOR_ATTACHMENT0,qt,we);else Le(_t.__webglFramebuffer,F,I,i.COLOR_ATTACHMENT0,qt,0);A(I,We)&&M(qt),e.unbindTexture()}F.depthBuffer&&De(F)}function Se(F){let I=p(F)||o,_t=F.isWebGLMultipleRenderTargets===!0?F.texture:[F.texture];for(let xe=0,de=_t.length;xe<de;xe++){let ue=_t[xe];if(A(ue,I)){let We=F.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,qt=n.get(ue).__webglTexture;e.bindTexture(We,qt),M(We),e.unbindTexture()}}}function ct(F){if(o&&F.samples>0&&Jt(F)===!1){let I=F.isWebGLMultipleRenderTargets?F.texture:[F.texture],_t=F.width,xe=F.height,de=i.COLOR_BUFFER_BIT,ue=[],We=F.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,qt=n.get(F),we=F.isWebGLMultipleRenderTargets===!0;if(we)for(let Je=0;Je<I.length;Je++)e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,qt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,qt.__webglFramebuffer);for(let Je=0;Je<I.length;Je++){ue.push(i.COLOR_ATTACHMENT0+Je),F.depthBuffer&&ue.push(We);let nn=qt.__ignoreDepthValues!==void 0?qt.__ignoreDepthValues:!1;if(nn===!1&&(F.depthBuffer&&(de|=i.DEPTH_BUFFER_BIT),F.stencilBuffer&&(de|=i.STENCIL_BUFFER_BIT)),we&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,qt.__webglColorRenderbuffer[Je]),nn===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[We]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[We])),we){let pe=n.get(I[Je]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pe,0)}i.blitFramebuffer(0,0,_t,xe,0,0,_t,xe,de,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ue)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),we)for(let Je=0;Je<I.length;Je++){e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.RENDERBUFFER,qt.__webglColorRenderbuffer[Je]);let nn=n.get(I[Je]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.TEXTURE_2D,nn,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,qt.__webglMultisampledFramebuffer)}}function _e(F){return Math.min(s.maxSamples,F.samples)}function Jt(F){let I=n.get(F);return o&&F.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&I.__useRenderToTexture!==!1}function ke(F){let I=a.render.frame;u.get(F)!==I&&(u.set(F,I),F.update())}function be(F,I){let _t=F.colorSpace,xe=F.format,de=F.type;return F.isCompressedTexture===!0||F.isVideoTexture===!0||F.format===zf||_t!==Dr&&_t!==Fs&&(Wn.getTransfer(_t)===ai?o===!1?t.has("EXT_sRGB")===!0&&xe===js?(F.format=zf,F.minFilter=ms,F.generateMipmaps=!1):I=ih.sRGBToLinear(I):(xe!==js||de!==io)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",_t)),I}this.allocateTextureUnit=Q,this.resetTextureUnits=Kt,this.setTexture2D=bt,this.setTexture2DArray=Wt,this.setTexture3D=Zt,this.setTextureCube=At,this.rebindTextures=Be,this.setupRenderTarget=tt,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=ct,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=Le,this.useMultisampledRTT=Jt}function CS(i,t,e){let n=e.isWebGL2;function s(r,a=Fs){let o,c=Wn.getTransfer(a);if(r===io)return i.UNSIGNED_BYTE;if(r===tg)return i.UNSIGNED_SHORT_4_4_4_4;if(r===eg)return i.UNSIGNED_SHORT_5_5_5_1;if(r===hy)return i.BYTE;if(r===uy)return i.SHORT;if(r===Td)return i.UNSIGNED_SHORT;if(r===Q0)return i.INT;if(r===Qr)return i.UNSIGNED_INT;if(r===to)return i.FLOAT;if(r===bl)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===fy)return i.ALPHA;if(r===js)return i.RGBA;if(r===dy)return i.LUMINANCE;if(r===py)return i.LUMINANCE_ALPHA;if(r===Ro)return i.DEPTH_COMPONENT;if(r===Pa)return i.DEPTH_STENCIL;if(r===zf)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===my)return i.RED;if(r===ng)return i.RED_INTEGER;if(r===gy)return i.RG;if(r===ig)return i.RG_INTEGER;if(r===sg)return i.RGBA_INTEGER;if(r===Qu||r===tf||r===ef||r===nf)if(c===ai)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Qu)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===tf)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===ef)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===nf)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Qu)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===tf)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===ef)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===nf)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===Mm||r===bm||r===Sm||r===Em)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===Mm)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===bm)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Sm)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===Em)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===rg)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===wm||r===Tm)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===wm)return c===ai?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Tm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Am||r===Rm||r===Cm||r===Pm||r===Lm||r===Im||r===Dm||r===Um||r===Nm||r===Om||r===Fm||r===Bm||r===zm||r===km)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Am)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Rm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Cm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Pm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Lm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Im)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Dm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Um)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Nm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Om)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Fm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Bm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===zm)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===km)return c===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===sf||r===Hm||r===Vm)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===sf)return c===ai?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Hm)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Vm)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===xy||r===Gm||r===Wm||r===Xm)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===sf)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Gm)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Wm)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Xm)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Ao?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Qf=class extends Gi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Pn=class extends vi{constructor(){super(),this.isGroup=!0,this.type="Group"}},PS={type:"move"},yl=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,c=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),x=this._getHandJoint(h,v);p!==null&&(x.matrix.fromArray(p.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=p.radius),x.visible=p!==null}let u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],g=u.position.distanceTo(f.position),d=.02,y=.005;h.inputState.pinching&&g>d+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&g<=d-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else c!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(c.matrix.fromArray(r.transform.matrix),c.matrix.decompose(c.position,c.rotation,c.scale),c.matrixWorldNeedsUpdate=!0,r.linearVelocity?(c.hasLinearVelocity=!0,c.linearVelocity.copy(r.linearVelocity)):c.hasLinearVelocity=!1,r.angularVelocity?(c.hasAngularVelocity=!0,c.angularVelocity.copy(r.angularVelocity)):c.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(PS)))}return o!==null&&(o.visible=s!==null),c!==null&&(c.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Pn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},td=class extends gr{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",c=1,h=null,u=null,f=null,g=null,d=null,y=null,v=e.getContextAttributes(),p=null,x=null,A=[],M=[],L=new fe,R=null,T=new Gi;T.layers.enable(1),T.viewport=new Fn;let N=new Gi;N.layers.enable(2),N.viewport=new Fn;let K=[T,N],C=new Qf;C.layers.enable(1),C.layers.enable(2);let w=null,it=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Rt){let Ft=A[Rt];return Ft===void 0&&(Ft=new yl,A[Rt]=Ft),Ft.getTargetRaySpace()},this.getControllerGrip=function(Rt){let Ft=A[Rt];return Ft===void 0&&(Ft=new yl,A[Rt]=Ft),Ft.getGripSpace()},this.getHand=function(Rt){let Ft=A[Rt];return Ft===void 0&&(Ft=new yl,A[Rt]=Ft),Ft.getHandSpace()};function mt(Rt){let Ft=M.indexOf(Rt.inputSource);if(Ft===-1)return;let ye=A[Ft];ye!==void 0&&(ye.update(Rt.inputSource,Rt.frame,h||a),ye.dispatchEvent({type:Rt.type,data:Rt.inputSource}))}function Kt(){s.removeEventListener("select",mt),s.removeEventListener("selectstart",mt),s.removeEventListener("selectend",mt),s.removeEventListener("squeeze",mt),s.removeEventListener("squeezestart",mt),s.removeEventListener("squeezeend",mt),s.removeEventListener("end",Kt),s.removeEventListener("inputsourceschange",Q);for(let Rt=0;Rt<A.length;Rt++){let Ft=M[Rt];Ft!==null&&(M[Rt]=null,A[Rt].disconnect(Ft))}w=null,it=null,t.setRenderTarget(p),d=null,g=null,f=null,s=null,x=null,Me.stop(),n.isPresenting=!1,t.setPixelRatio(R),t.setSize(L.width,L.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Rt){r=Rt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Rt){o=Rt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Rt){h=Rt},this.getBaseLayer=function(){return g!==null?g:d},this.getBinding=function(){return f},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(Rt){if(s=Rt,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",mt),s.addEventListener("selectstart",mt),s.addEventListener("selectend",mt),s.addEventListener("squeeze",mt),s.addEventListener("squeezestart",mt),s.addEventListener("squeezeend",mt),s.addEventListener("end",Kt),s.addEventListener("inputsourceschange",Q),v.xrCompatible!==!0&&await e.makeXRCompatible(),R=t.getPixelRatio(),t.getSize(L),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let Ft={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,Ft),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Ur(d.framebufferWidth,d.framebufferHeight,{format:js,type:io,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let Ft=null,ye=null,Re=null;v.depth&&(Re=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Ft=v.stencil?Pa:Ro,ye=v.stencil?Ao:Qr);let Le={colorFormat:e.RGBA8,depthFormat:Re,scaleFactor:r};f=new XRWebGLBinding(s,e),g=f.createProjectionLayer(Le),s.updateRenderState({layers:[g]}),t.setPixelRatio(1),t.setSize(g.textureWidth,g.textureHeight,!1),x=new Ur(g.textureWidth,g.textureHeight,{format:js,type:io,depthTexture:new dh(g.textureWidth,g.textureHeight,ye,void 0,void 0,void 0,void 0,void 0,void 0,Ft),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});let Xe=t.properties.get(x);Xe.__ignoreDepthValues=g.ignoreDepthValues}x.isXRRenderTarget=!0,this.setFoveation(c),h=null,a=await s.requestReferenceSpace(o),Me.setContext(s),Me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function Q(Rt){for(let Ft=0;Ft<Rt.removed.length;Ft++){let ye=Rt.removed[Ft],Re=M.indexOf(ye);Re>=0&&(M[Re]=null,A[Re].disconnect(ye))}for(let Ft=0;Ft<Rt.added.length;Ft++){let ye=Rt.added[Ft],Re=M.indexOf(ye);if(Re===-1){for(let Xe=0;Xe<A.length;Xe++)if(Xe>=M.length){M.push(ye),Re=Xe;break}else if(M[Xe]===null){M[Xe]=ye,Re=Xe;break}if(Re===-1)break}let Le=A[Re];Le&&Le.connect(ye)}}let lt=new W,bt=new W;function Wt(Rt,Ft,ye){lt.setFromMatrixPosition(Ft.matrixWorld),bt.setFromMatrixPosition(ye.matrixWorld);let Re=lt.distanceTo(bt),Le=Ft.projectionMatrix.elements,Xe=ye.projectionMatrix.elements,Ze=Le[14]/(Le[10]-1),De=Le[14]/(Le[10]+1),Be=(Le[9]+1)/Le[5],tt=(Le[9]-1)/Le[5],Se=(Le[8]-1)/Le[0],ct=(Xe[8]+1)/Xe[0],_e=Ze*Se,Jt=Ze*ct,ke=Re/(-Se+ct),be=ke*-Se;Ft.matrixWorld.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.translateX(be),Rt.translateZ(ke),Rt.matrixWorld.compose(Rt.position,Rt.quaternion,Rt.scale),Rt.matrixWorldInverse.copy(Rt.matrixWorld).invert();let F=Ze+ke,I=De+ke,_t=_e-be,xe=Jt+(Re-be),de=Be*De/I*F,ue=tt*De/I*F;Rt.projectionMatrix.makePerspective(_t,xe,de,ue,F,I),Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert()}function Zt(Rt,Ft){Ft===null?Rt.matrixWorld.copy(Rt.matrix):Rt.matrixWorld.multiplyMatrices(Ft.matrixWorld,Rt.matrix),Rt.matrixWorldInverse.copy(Rt.matrixWorld).invert()}this.updateCamera=function(Rt){if(s===null)return;C.near=N.near=T.near=Rt.near,C.far=N.far=T.far=Rt.far,(w!==C.near||it!==C.far)&&(s.updateRenderState({depthNear:C.near,depthFar:C.far}),w=C.near,it=C.far);let Ft=Rt.parent,ye=C.cameras;Zt(C,Ft);for(let Re=0;Re<ye.length;Re++)Zt(ye[Re],Ft);ye.length===2?Wt(C,T,N):C.projectionMatrix.copy(T.projectionMatrix),At(Rt,C,Ft)};function At(Rt,Ft,ye){ye===null?Rt.matrix.copy(Ft.matrixWorld):(Rt.matrix.copy(ye.matrixWorld),Rt.matrix.invert(),Rt.matrix.multiply(Ft.matrixWorld)),Rt.matrix.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.updateMatrixWorld(!0),Rt.projectionMatrix.copy(Ft.projectionMatrix),Rt.projectionMatrixInverse.copy(Ft.projectionMatrixInverse),Rt.isPerspectiveCamera&&(Rt.fov=Sl*2*Math.atan(1/Rt.projectionMatrix.elements[5]),Rt.zoom=1)}this.getCamera=function(){return C},this.getFoveation=function(){if(!(g===null&&d===null))return c},this.setFoveation=function(Rt){c=Rt,g!==null&&(g.fixedFoveation=Rt),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Rt)};let Yt=null;function le(Rt,Ft){if(u=Ft.getViewerPose(h||a),y=Ft,u!==null){let ye=u.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let Re=!1;ye.length!==C.cameras.length&&(C.cameras.length=0,Re=!0);for(let Le=0;Le<ye.length;Le++){let Xe=ye[Le],Ze=null;if(d!==null)Ze=d.getViewport(Xe);else{let Be=f.getViewSubImage(g,Xe);Ze=Be.viewport,Le===0&&(t.setRenderTargetTextures(x,Be.colorTexture,g.ignoreDepthValues?void 0:Be.depthStencilTexture),t.setRenderTarget(x))}let De=K[Le];De===void 0&&(De=new Gi,De.layers.enable(Le),De.viewport=new Fn,K[Le]=De),De.matrix.fromArray(Xe.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(Xe.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(Ze.x,Ze.y,Ze.width,Ze.height),Le===0&&(C.matrix.copy(De.matrix),C.matrix.decompose(C.position,C.quaternion,C.scale)),Re===!0&&C.cameras.push(De)}}for(let ye=0;ye<A.length;ye++){let Re=M[ye],Le=A[ye];Re!==null&&Le!==void 0&&Le.update(Re,Ft,h||a)}Yt&&Yt(Rt,Ft),Ft.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Ft}),y=null}let Me=new ug;Me.setAnimationLoop(le),this.setAnimationLoop=function(Rt){Yt=Rt},this.dispose=function(){}}};function LS(i,t){function e(p,x){p.matrixAutoUpdate===!0&&p.updateMatrix(),x.value.copy(p.matrix)}function n(p,x){x.color.getRGB(p.fogColor.value,hg(i)),x.isFog?(p.fogNear.value=x.near,p.fogFar.value=x.far):x.isFogExp2&&(p.fogDensity.value=x.density)}function s(p,x,A,M,L){x.isMeshBasicMaterial||x.isMeshLambertMaterial?r(p,x):x.isMeshToonMaterial?(r(p,x),f(p,x)):x.isMeshPhongMaterial?(r(p,x),u(p,x)):x.isMeshStandardMaterial?(r(p,x),g(p,x),x.isMeshPhysicalMaterial&&d(p,x,L)):x.isMeshMatcapMaterial?(r(p,x),y(p,x)):x.isMeshDepthMaterial?r(p,x):x.isMeshDistanceMaterial?(r(p,x),v(p,x)):x.isMeshNormalMaterial?r(p,x):x.isLineBasicMaterial?(a(p,x),x.isLineDashedMaterial&&o(p,x)):x.isPointsMaterial?c(p,x,A,M):x.isSpriteMaterial?h(p,x):x.isShadowMaterial?(p.color.value.copy(x.color),p.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function r(p,x){p.opacity.value=x.opacity,x.color&&p.diffuse.value.copy(x.color),x.emissive&&p.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.bumpMap&&(p.bumpMap.value=x.bumpMap,e(x.bumpMap,p.bumpMapTransform),p.bumpScale.value=x.bumpScale,x.side===gs&&(p.bumpScale.value*=-1)),x.normalMap&&(p.normalMap.value=x.normalMap,e(x.normalMap,p.normalMapTransform),p.normalScale.value.copy(x.normalScale),x.side===gs&&p.normalScale.value.negate()),x.displacementMap&&(p.displacementMap.value=x.displacementMap,e(x.displacementMap,p.displacementMapTransform),p.displacementScale.value=x.displacementScale,p.displacementBias.value=x.displacementBias),x.emissiveMap&&(p.emissiveMap.value=x.emissiveMap,e(x.emissiveMap,p.emissiveMapTransform)),x.specularMap&&(p.specularMap.value=x.specularMap,e(x.specularMap,p.specularMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest);let A=t.get(x).envMap;if(A&&(p.envMap.value=A,p.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=x.reflectivity,p.ior.value=x.ior,p.refractionRatio.value=x.refractionRatio),x.lightMap){p.lightMap.value=x.lightMap;let M=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=x.lightMapIntensity*M,e(x.lightMap,p.lightMapTransform)}x.aoMap&&(p.aoMap.value=x.aoMap,p.aoMapIntensity.value=x.aoMapIntensity,e(x.aoMap,p.aoMapTransform))}function a(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform))}function o(p,x){p.dashSize.value=x.dashSize,p.totalSize.value=x.dashSize+x.gapSize,p.scale.value=x.scale}function c(p,x,A,M){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.size.value=x.size*A,p.scale.value=M*.5,x.map&&(p.map.value=x.map,e(x.map,p.uvTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function h(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.rotation.value=x.rotation,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function u(p,x){p.specular.value.copy(x.specular),p.shininess.value=Math.max(x.shininess,1e-4)}function f(p,x){x.gradientMap&&(p.gradientMap.value=x.gradientMap)}function g(p,x){p.metalness.value=x.metalness,x.metalnessMap&&(p.metalnessMap.value=x.metalnessMap,e(x.metalnessMap,p.metalnessMapTransform)),p.roughness.value=x.roughness,x.roughnessMap&&(p.roughnessMap.value=x.roughnessMap,e(x.roughnessMap,p.roughnessMapTransform)),t.get(x).envMap&&(p.envMapIntensity.value=x.envMapIntensity)}function d(p,x,A){p.ior.value=x.ior,x.sheen>0&&(p.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),p.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(p.sheenColorMap.value=x.sheenColorMap,e(x.sheenColorMap,p.sheenColorMapTransform)),x.sheenRoughnessMap&&(p.sheenRoughnessMap.value=x.sheenRoughnessMap,e(x.sheenRoughnessMap,p.sheenRoughnessMapTransform))),x.clearcoat>0&&(p.clearcoat.value=x.clearcoat,p.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(p.clearcoatMap.value=x.clearcoatMap,e(x.clearcoatMap,p.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,e(x.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(p.clearcoatNormalMap.value=x.clearcoatNormalMap,e(x.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===gs&&p.clearcoatNormalScale.value.negate())),x.iridescence>0&&(p.iridescence.value=x.iridescence,p.iridescenceIOR.value=x.iridescenceIOR,p.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(p.iridescenceMap.value=x.iridescenceMap,e(x.iridescenceMap,p.iridescenceMapTransform)),x.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=x.iridescenceThicknessMap,e(x.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),x.transmission>0&&(p.transmission.value=x.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),x.transmissionMap&&(p.transmissionMap.value=x.transmissionMap,e(x.transmissionMap,p.transmissionMapTransform)),p.thickness.value=x.thickness,x.thicknessMap&&(p.thicknessMap.value=x.thicknessMap,e(x.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=x.attenuationDistance,p.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(p.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(p.anisotropyMap.value=x.anisotropyMap,e(x.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=x.specularIntensity,p.specularColor.value.copy(x.specularColor),x.specularColorMap&&(p.specularColorMap.value=x.specularColorMap,e(x.specularColorMap,p.specularColorMapTransform)),x.specularIntensityMap&&(p.specularIntensityMap.value=x.specularIntensityMap,e(x.specularIntensityMap,p.specularIntensityMapTransform))}function y(p,x){x.matcap&&(p.matcap.value=x.matcap)}function v(p,x){let A=t.get(x).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function IS(i,t,e,n){let s={},r={},a=[],o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function c(A,M){let L=M.program;n.uniformBlockBinding(A,L)}function h(A,M){let L=s[A.id];L===void 0&&(y(A),L=u(A),s[A.id]=L,A.addEventListener("dispose",p));let R=M.program;n.updateUBOMapping(A,R);let T=t.render.frame;r[A.id]!==T&&(g(A),r[A.id]=T)}function u(A){let M=f();A.__bindingPointIndex=M;let L=i.createBuffer(),R=A.__size,T=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,L),i.bufferData(i.UNIFORM_BUFFER,R,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,L),L}function f(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(A){let M=s[A.id],L=A.uniforms,R=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,N=L.length;T<N;T++){let K=Array.isArray(L[T])?L[T]:[L[T]];for(let C=0,w=K.length;C<w;C++){let it=K[C];if(d(it,T,C,R)===!0){let mt=it.__offset,Kt=Array.isArray(it.value)?it.value:[it.value],Q=0;for(let lt=0;lt<Kt.length;lt++){let bt=Kt[lt],Wt=v(bt);typeof bt=="number"||typeof bt=="boolean"?(it.__data[0]=bt,i.bufferSubData(i.UNIFORM_BUFFER,mt+Q,it.__data)):bt.isMatrix3?(it.__data[0]=bt.elements[0],it.__data[1]=bt.elements[1],it.__data[2]=bt.elements[2],it.__data[3]=0,it.__data[4]=bt.elements[3],it.__data[5]=bt.elements[4],it.__data[6]=bt.elements[5],it.__data[7]=0,it.__data[8]=bt.elements[6],it.__data[9]=bt.elements[7],it.__data[10]=bt.elements[8],it.__data[11]=0):(bt.toArray(it.__data,Q),Q+=Wt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,mt,it.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(A,M,L,R){let T=A.value,N=M+"_"+L;if(R[N]===void 0)return typeof T=="number"||typeof T=="boolean"?R[N]=T:R[N]=T.clone(),!0;{let K=R[N];if(typeof T=="number"||typeof T=="boolean"){if(K!==T)return R[N]=T,!0}else if(K.equals(T)===!1)return K.copy(T),!0}return!1}function y(A){let M=A.uniforms,L=0,R=16;for(let N=0,K=M.length;N<K;N++){let C=Array.isArray(M[N])?M[N]:[M[N]];for(let w=0,it=C.length;w<it;w++){let mt=C[w],Kt=Array.isArray(mt.value)?mt.value:[mt.value];for(let Q=0,lt=Kt.length;Q<lt;Q++){let bt=Kt[Q],Wt=v(bt),Zt=L%R;Zt!==0&&R-Zt<Wt.boundary&&(L+=R-Zt),mt.__data=new Float32Array(Wt.storage/Float32Array.BYTES_PER_ELEMENT),mt.__offset=L,L+=Wt.storage}}}let T=L%R;return T>0&&(L+=R-T),A.__size=L,A.__cache={},this}function v(A){let M={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(M.boundary=4,M.storage=4):A.isVector2?(M.boundary=8,M.storage=8):A.isVector3||A.isColor?(M.boundary=16,M.storage=12):A.isVector4?(M.boundary=16,M.storage=16):A.isMatrix3?(M.boundary=48,M.storage=48):A.isMatrix4?(M.boundary=64,M.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),M}function p(A){let M=A.target;M.removeEventListener("dispose",p);let L=a.indexOf(M.__bindingPointIndex);a.splice(L,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function x(){for(let A in s)i.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:c,update:h,dispose:x}}var Tl=class{constructor(t={}){let{canvas:e=Vy(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:c=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let g;n!==null?g=n.getContextAttributes().alpha:g=a;let d=new Uint32Array(4),y=new Int32Array(4),v=null,p=null,x=[],A=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kn,this._useLegacyLights=!1,this.toneMapping=no,this.toneMappingExposure=1;let M=this,L=!1,R=0,T=0,N=null,K=-1,C=null,w=new Fn,it=new Fn,mt=null,Kt=new fn(0),Q=0,lt=e.width,bt=e.height,Wt=1,Zt=null,At=null,Yt=new Fn(0,0,lt,bt),le=new Fn(0,0,lt,bt),Me=!1,Rt=new wl,Ft=!1,ye=!1,Re=null,Le=new Nn,Xe=new fe,Ze=new W,De={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Be(){return N===null?Wt:1}let tt=n;function Se(z,xt){for(let Ct=0;Ct<z.length;Ct++){let Ot=z[Ct],Pt=e.getContext(Ot,xt);if(Pt!==null)return Pt}return null}try{let z={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:c,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",V,!1),e.addEventListener("webglcontextcreationerror",Lt,!1),tt===null){let xt=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&xt.shift(),tt=Se(xt,z),tt===null)throw Se(xt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&tt instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),tt.getShaderPrecisionFormat===void 0&&(tt.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(z){throw console.error("THREE.WebGLRenderer: "+z.message),z}let ct,_e,Jt,ke,be,F,I,_t,xe,de,ue,We,qt,we,Je,nn,pe,gn,G,oe,ve,nt,dt,jt;function te(){ct=new jM(tt),_e=new XM(tt,ct,t),ct.init(_e),nt=new CS(tt,ct,_e),Jt=new AS(tt,ct,_e),ke=new tb(tt),be=new mS,F=new RS(tt,ct,Jt,be,_e,nt,ke),I=new YM(M),_t=new JM(M),xe=new l_(tt,_e),dt=new GM(tt,ct,xe,_e),de=new KM(tt,xe,ke,dt),ue=new sb(tt,de,xe,ke),G=new ib(tt,_e,F),nn=new qM(be),We=new pS(M,I,_t,ct,_e,dt,nn),qt=new LS(M,be),we=new xS,Je=new SS(ct,_e),gn=new VM(M,I,_t,Jt,ue,g,c),pe=new TS(M,ue,_e),jt=new IS(tt,ke,_e,Jt),oe=new WM(tt,ct,ke,_e),ve=new QM(tt,ct,ke,_e),ke.programs=We.programs,M.capabilities=_e,M.extensions=ct,M.properties=be,M.renderLists=we,M.shadowMap=pe,M.state=Jt,M.info=ke}te();let ee=new td(M,tt);this.xr=ee,this.getContext=function(){return tt},this.getContextAttributes=function(){return tt.getContextAttributes()},this.forceContextLoss=function(){let z=ct.get("WEBGL_lose_context");z&&z.loseContext()},this.forceContextRestore=function(){let z=ct.get("WEBGL_lose_context");z&&z.restoreContext()},this.getPixelRatio=function(){return Wt},this.setPixelRatio=function(z){z!==void 0&&(Wt=z,this.setSize(lt,bt,!1))},this.getSize=function(z){return z.set(lt,bt)},this.setSize=function(z,xt,Ct=!0){if(ee.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}lt=z,bt=xt,e.width=Math.floor(z*Wt),e.height=Math.floor(xt*Wt),Ct===!0&&(e.style.width=z+"px",e.style.height=xt+"px"),this.setViewport(0,0,z,xt)},this.getDrawingBufferSize=function(z){return z.set(lt*Wt,bt*Wt).floor()},this.setDrawingBufferSize=function(z,xt,Ct){lt=z,bt=xt,Wt=Ct,e.width=Math.floor(z*Ct),e.height=Math.floor(xt*Ct),this.setViewport(0,0,z,xt)},this.getCurrentViewport=function(z){return z.copy(w)},this.getViewport=function(z){return z.copy(Yt)},this.setViewport=function(z,xt,Ct,Ot){z.isVector4?Yt.set(z.x,z.y,z.z,z.w):Yt.set(z,xt,Ct,Ot),Jt.viewport(w.copy(Yt).multiplyScalar(Wt).floor())},this.getScissor=function(z){return z.copy(le)},this.setScissor=function(z,xt,Ct,Ot){z.isVector4?le.set(z.x,z.y,z.z,z.w):le.set(z,xt,Ct,Ot),Jt.scissor(it.copy(le).multiplyScalar(Wt).floor())},this.getScissorTest=function(){return Me},this.setScissorTest=function(z){Jt.setScissorTest(Me=z)},this.setOpaqueSort=function(z){Zt=z},this.setTransparentSort=function(z){At=z},this.getClearColor=function(z){return z.copy(gn.getClearColor())},this.setClearColor=function(){gn.setClearColor.apply(gn,arguments)},this.getClearAlpha=function(){return gn.getClearAlpha()},this.setClearAlpha=function(){gn.setClearAlpha.apply(gn,arguments)},this.clear=function(z=!0,xt=!0,Ct=!0){let Ot=0;if(z){let Pt=!1;if(N!==null){let Ie=N.texture.format;Pt=Ie===sg||Ie===ig||Ie===ng}if(Pt){let Ie=N.texture.type,$e=Ie===io||Ie===Qr||Ie===Td||Ie===Ao||Ie===tg||Ie===eg,Qe=gn.getClearColor(),on=gn.getClearAlpha(),dn=Qe.r,un=Qe.g,an=Qe.b;$e?(d[0]=dn,d[1]=un,d[2]=an,d[3]=on,tt.clearBufferuiv(tt.COLOR,0,d)):(y[0]=dn,y[1]=un,y[2]=an,y[3]=on,tt.clearBufferiv(tt.COLOR,0,y))}else Ot|=tt.COLOR_BUFFER_BIT}xt&&(Ot|=tt.DEPTH_BUFFER_BIT),Ct&&(Ot|=tt.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),tt.clear(Ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",V,!1),e.removeEventListener("webglcontextcreationerror",Lt,!1),we.dispose(),Je.dispose(),be.dispose(),I.dispose(),_t.dispose(),ue.dispose(),dt.dispose(),jt.dispose(),We.dispose(),ee.dispose(),ee.removeEventListener("sessionstart",He),ee.removeEventListener("sessionend",Oe),Re&&(Re.dispose(),Re=null),sn.stop()};function ht(z){z.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),L=!0}function V(){console.log("THREE.WebGLRenderer: Context Restored."),L=!1;let z=ke.autoReset,xt=pe.enabled,Ct=pe.autoUpdate,Ot=pe.needsUpdate,Pt=pe.type;te(),ke.autoReset=z,pe.enabled=xt,pe.autoUpdate=Ct,pe.needsUpdate=Ot,pe.type=Pt}function Lt(z){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",z.statusMessage)}function zt(z){let xt=z.target;xt.removeEventListener("dispose",zt),re(xt)}function re(z){ce(z),be.remove(z)}function ce(z){let xt=be.get(z).programs;xt!==void 0&&(xt.forEach(function(Ct){We.releaseProgram(Ct)}),z.isShaderMaterial&&We.releaseShaderCache(z))}this.renderBufferDirect=function(z,xt,Ct,Ot,Pt,Ie){xt===null&&(xt=De);let $e=Pt.isMesh&&Pt.matrixWorld.determinant()<0,Qe=In(z,xt,Ct,Ot,Pt);Jt.setMaterial(Ot,$e);let on=Ct.index,dn=1;if(Ot.wireframe===!0){if(on=de.getWireframeAttribute(Ct),on===void 0)return;dn=2}let un=Ct.drawRange,an=Ct.attributes.position,Vn=un.start*dn,Si=(un.start+un.count)*dn;Ie!==null&&(Vn=Math.max(Vn,Ie.start*dn),Si=Math.min(Si,(Ie.start+Ie.count)*dn)),on!==null?(Vn=Math.max(Vn,0),Si=Math.min(Si,on.count)):an!=null&&(Vn=Math.max(Vn,0),Si=Math.min(Si,an.count));let hi=Si-Vn;if(hi<0||hi===1/0)return;dt.setup(Pt,Ot,Qe,Ct,on);let cs,si=oe;if(on!==null&&(cs=xe.get(on),si=ve,si.setIndex(cs)),Pt.isMesh)Ot.wireframe===!0?(Jt.setLineWidth(Ot.wireframeLinewidth*Be()),si.setMode(tt.LINES)):si.setMode(tt.TRIANGLES);else if(Pt.isLine){let _n=Ot.linewidth;_n===void 0&&(_n=1),Jt.setLineWidth(_n*Be()),Pt.isLineSegments?si.setMode(tt.LINES):Pt.isLineLoop?si.setMode(tt.LINE_LOOP):si.setMode(tt.LINE_STRIP)}else Pt.isPoints?si.setMode(tt.POINTS):Pt.isSprite&&si.setMode(tt.TRIANGLES);if(Pt.isBatchedMesh)si.renderMultiDraw(Pt._multiDrawStarts,Pt._multiDrawCounts,Pt._multiDrawCount);else if(Pt.isInstancedMesh)si.renderInstances(Vn,hi,Pt.count);else if(Ct.isInstancedBufferGeometry){let _n=Ct._maxInstanceCount!==void 0?Ct._maxInstanceCount:1/0,ir=Math.min(Ct.instanceCount,_n);si.renderInstances(Vn,hi,ir)}else si.render(Vn,hi)};function Ue(z,xt,Ct){z.transparent===!0&&z.side===mn&&z.forceSinglePass===!1?(z.side=gs,z.needsUpdate=!0,ci(z,xt,Ct),z.side=so,z.needsUpdate=!0,ci(z,xt,Ct),z.side=mn):ci(z,xt,Ct)}this.compile=function(z,xt,Ct=null){Ct===null&&(Ct=z),p=Je.get(Ct),p.init(),A.push(p),Ct.traverseVisible(function(Pt){Pt.isLight&&Pt.layers.test(xt.layers)&&(p.pushLight(Pt),Pt.castShadow&&p.pushShadow(Pt))}),z!==Ct&&z.traverseVisible(function(Pt){Pt.isLight&&Pt.layers.test(xt.layers)&&(p.pushLight(Pt),Pt.castShadow&&p.pushShadow(Pt))}),p.setupLights(M._useLegacyLights);let Ot=new Set;return z.traverse(function(Pt){let Ie=Pt.material;if(Ie)if(Array.isArray(Ie))for(let $e=0;$e<Ie.length;$e++){let Qe=Ie[$e];Ue(Qe,Ct,Pt),Ot.add(Qe)}else Ue(Ie,Ct,Pt),Ot.add(Ie)}),A.pop(),p=null,Ot},this.compileAsync=function(z,xt,Ct=null){let Ot=this.compile(z,xt,Ct);return new Promise(Pt=>{function Ie(){if(Ot.forEach(function($e){be.get($e).currentProgram.isReady()&&Ot.delete($e)}),Ot.size===0){Pt(z);return}setTimeout(Ie,10)}ct.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let Qt=null;function Ne(z){Qt&&Qt(z)}function He(){sn.stop()}function Oe(){sn.start()}let sn=new ug;sn.setAnimationLoop(Ne),typeof self<"u"&&sn.setContext(self),this.setAnimationLoop=function(z){Qt=z,ee.setAnimationLoop(z),z===null?sn.stop():sn.start()},ee.addEventListener("sessionstart",He),ee.addEventListener("sessionend",Oe),this.render=function(z,xt){if(xt!==void 0&&xt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),xt.parent===null&&xt.matrixWorldAutoUpdate===!0&&xt.updateMatrixWorld(),ee.enabled===!0&&ee.isPresenting===!0&&(ee.cameraAutoUpdate===!0&&ee.updateCamera(xt),xt=ee.getCamera()),z.isScene===!0&&z.onBeforeRender(M,z,xt,N),p=Je.get(z,A.length),p.init(),A.push(p),Le.multiplyMatrices(xt.projectionMatrix,xt.matrixWorldInverse),Rt.setFromProjectionMatrix(Le),ye=this.localClippingEnabled,Ft=nn.init(this.clippingPlanes,ye),v=we.get(z,x.length),v.init(),x.push(v),hn(z,xt,0,M.sortObjects),v.finish(),M.sortObjects===!0&&v.sort(Zt,At),this.info.render.frame++,Ft===!0&&nn.beginShadows();let Ct=p.state.shadowsArray;if(pe.render(Ct,z,xt),Ft===!0&&nn.endShadows(),this.info.autoReset===!0&&this.info.reset(),gn.render(v,z),p.setupLights(M._useLegacyLights),xt.isArrayCamera){let Ot=xt.cameras;for(let Pt=0,Ie=Ot.length;Pt<Ie;Pt++){let $e=Ot[Pt];pn(v,z,$e,$e.viewport)}}else pn(v,z,xt);N!==null&&(F.updateMultisampleRenderTarget(N),F.updateRenderTargetMipmap(N)),z.isScene===!0&&z.onAfterRender(M,z,xt),dt.resetDefaultState(),K=-1,C=null,A.pop(),A.length>0?p=A[A.length-1]:p=null,x.pop(),x.length>0?v=x[x.length-1]:v=null};function hn(z,xt,Ct,Ot){if(z.visible===!1)return;if(z.layers.test(xt.layers)){if(z.isGroup)Ct=z.renderOrder;else if(z.isLOD)z.autoUpdate===!0&&z.update(xt);else if(z.isLight)p.pushLight(z),z.castShadow&&p.pushShadow(z);else if(z.isSprite){if(!z.frustumCulled||Rt.intersectsSprite(z)){Ot&&Ze.setFromMatrixPosition(z.matrixWorld).applyMatrix4(Le);let $e=ue.update(z),Qe=z.material;Qe.visible&&v.push(z,$e,Qe,Ct,Ze.z,null)}}else if((z.isMesh||z.isLine||z.isPoints)&&(!z.frustumCulled||Rt.intersectsObject(z))){let $e=ue.update(z),Qe=z.material;if(Ot&&(z.boundingSphere!==void 0?(z.boundingSphere===null&&z.computeBoundingSphere(),Ze.copy(z.boundingSphere.center)):($e.boundingSphere===null&&$e.computeBoundingSphere(),Ze.copy($e.boundingSphere.center)),Ze.applyMatrix4(z.matrixWorld).applyMatrix4(Le)),Array.isArray(Qe)){let on=$e.groups;for(let dn=0,un=on.length;dn<un;dn++){let an=on[dn],Vn=Qe[an.materialIndex];Vn&&Vn.visible&&v.push(z,$e,Vn,Ct,Ze.z,an)}}else Qe.visible&&v.push(z,$e,Qe,Ct,Ze.z,null)}}let Ie=z.children;for(let $e=0,Qe=Ie.length;$e<Qe;$e++)hn(Ie[$e],xt,Ct,Ot)}function pn(z,xt,Ct,Ot){let Pt=z.opaque,Ie=z.transmissive,$e=z.transparent;p.setupLightsView(Ct),Ft===!0&&nn.setGlobalState(M.clippingPlanes,Ct),Ie.length>0&&Rn(Pt,Ie,xt,Ct),Ot&&Jt.viewport(w.copy(Ot)),Pt.length>0&&Tn(Pt,xt,Ct),Ie.length>0&&Tn(Ie,xt,Ct),$e.length>0&&Tn($e,xt,Ct),Jt.buffers.depth.setTest(!0),Jt.buffers.depth.setMask(!0),Jt.buffers.color.setMask(!0),Jt.setPolygonOffset(!1)}function Rn(z,xt,Ct,Ot){if((Ct.isScene===!0?Ct.overrideMaterial:null)!==null)return;let Ie=_e.isWebGL2;Re===null&&(Re=new Ur(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")?bl:io,minFilter:Ml,samples:Ie?4:0})),M.getDrawingBufferSize(Xe),Ie?Re.setSize(Xe.x,Xe.y):Re.setSize(eh(Xe.x),eh(Xe.y));let $e=M.getRenderTarget();M.setRenderTarget(Re),M.getClearColor(Kt),Q=M.getClearAlpha(),Q<1&&M.setClearColor(16777215,.5),M.clear();let Qe=M.toneMapping;M.toneMapping=no,Tn(z,Ct,Ot),F.updateMultisampleRenderTarget(Re),F.updateRenderTargetMipmap(Re);let on=!1;for(let dn=0,un=xt.length;dn<un;dn++){let an=xt[dn],Vn=an.object,Si=an.geometry,hi=an.material,cs=an.group;if(hi.side===mn&&Vn.layers.test(Ot.layers)){let si=hi.side;hi.side=gs,hi.needsUpdate=!0,Bn(Vn,Ct,Ot,Si,hi,cs),hi.side=si,hi.needsUpdate=!0,on=!0}}on===!0&&(F.updateMultisampleRenderTarget(Re),F.updateRenderTargetMipmap(Re)),M.setRenderTarget($e),M.setClearColor(Kt,Q),M.toneMapping=Qe}function Tn(z,xt,Ct){let Ot=xt.isScene===!0?xt.overrideMaterial:null;for(let Pt=0,Ie=z.length;Pt<Ie;Pt++){let $e=z[Pt],Qe=$e.object,on=$e.geometry,dn=Ot===null?$e.material:Ot,un=$e.group;Qe.layers.test(Ct.layers)&&Bn(Qe,xt,Ct,on,dn,un)}}function Bn(z,xt,Ct,Ot,Pt,Ie){z.onBeforeRender(M,xt,Ct,Ot,Pt,Ie),z.modelViewMatrix.multiplyMatrices(Ct.matrixWorldInverse,z.matrixWorld),z.normalMatrix.getNormalMatrix(z.modelViewMatrix),Pt.onBeforeRender(M,xt,Ct,Ot,z,Ie),Pt.transparent===!0&&Pt.side===mn&&Pt.forceSinglePass===!1?(Pt.side=gs,Pt.needsUpdate=!0,M.renderBufferDirect(Ct,xt,Ot,Pt,z,Ie),Pt.side=so,Pt.needsUpdate=!0,M.renderBufferDirect(Ct,xt,Ot,Pt,z,Ie),Pt.side=mn):M.renderBufferDirect(Ct,xt,Ot,Pt,z,Ie),z.onAfterRender(M,xt,Ct,Ot,Pt,Ie)}function ci(z,xt,Ct){xt.isScene!==!0&&(xt=De);let Ot=be.get(z),Pt=p.state.lights,Ie=p.state.shadowsArray,$e=Pt.state.version,Qe=We.getParameters(z,Pt.state,Ie,xt,Ct),on=We.getProgramCacheKey(Qe),dn=Ot.programs;Ot.environment=z.isMeshStandardMaterial?xt.environment:null,Ot.fog=xt.fog,Ot.envMap=(z.isMeshStandardMaterial?_t:I).get(z.envMap||Ot.environment),dn===void 0&&(z.addEventListener("dispose",zt),dn=new Map,Ot.programs=dn);let un=dn.get(on);if(un!==void 0){if(Ot.currentProgram===un&&Ot.lightsStateVersion===$e)return ls(z,Qe),un}else Qe.uniforms=We.getUniforms(z),z.onBuild(Ct,Qe,M),z.onBeforeCompile(Qe,M),un=We.acquireProgram(Qe,on),dn.set(on,un),Ot.uniforms=Qe.uniforms;let an=Ot.uniforms;return(!z.isShaderMaterial&&!z.isRawShaderMaterial||z.clipping===!0)&&(an.clippingPlanes=nn.uniform),ls(z,Qe),Ot.needsLights=Hs(z),Ot.lightsStateVersion=$e,Ot.needsLights&&(an.ambientLightColor.value=Pt.state.ambient,an.lightProbe.value=Pt.state.probe,an.directionalLights.value=Pt.state.directional,an.directionalLightShadows.value=Pt.state.directionalShadow,an.spotLights.value=Pt.state.spot,an.spotLightShadows.value=Pt.state.spotShadow,an.rectAreaLights.value=Pt.state.rectArea,an.ltc_1.value=Pt.state.rectAreaLTC1,an.ltc_2.value=Pt.state.rectAreaLTC2,an.pointLights.value=Pt.state.point,an.pointLightShadows.value=Pt.state.pointShadow,an.hemisphereLights.value=Pt.state.hemi,an.directionalShadowMap.value=Pt.state.directionalShadowMap,an.directionalShadowMatrix.value=Pt.state.directionalShadowMatrix,an.spotShadowMap.value=Pt.state.spotShadowMap,an.spotLightMatrix.value=Pt.state.spotLightMatrix,an.spotLightMap.value=Pt.state.spotLightMap,an.pointShadowMap.value=Pt.state.pointShadowMap,an.pointShadowMatrix.value=Pt.state.pointShadowMatrix),Ot.currentProgram=un,Ot.uniformsList=null,un}function ks(z){if(z.uniformsList===null){let xt=z.currentProgram.getUniforms();z.uniformsList=Aa.seqWithValue(xt.seq,z.uniforms)}return z.uniformsList}function ls(z,xt){let Ct=be.get(z);Ct.outputColorSpace=xt.outputColorSpace,Ct.batching=xt.batching,Ct.instancing=xt.instancing,Ct.instancingColor=xt.instancingColor,Ct.skinning=xt.skinning,Ct.morphTargets=xt.morphTargets,Ct.morphNormals=xt.morphNormals,Ct.morphColors=xt.morphColors,Ct.morphTargetsCount=xt.morphTargetsCount,Ct.numClippingPlanes=xt.numClippingPlanes,Ct.numIntersection=xt.numClipIntersection,Ct.vertexAlphas=xt.vertexAlphas,Ct.vertexTangents=xt.vertexTangents,Ct.toneMapping=xt.toneMapping}function In(z,xt,Ct,Ot,Pt){xt.isScene!==!0&&(xt=De),F.resetTextureUnits();let Ie=xt.fog,$e=Ot.isMeshStandardMaterial?xt.environment:null,Qe=N===null?M.outputColorSpace:N.isXRRenderTarget===!0?N.texture.colorSpace:Dr,on=(Ot.isMeshStandardMaterial?_t:I).get(Ot.envMap||$e),dn=Ot.vertexColors===!0&&!!Ct.attributes.color&&Ct.attributes.color.itemSize===4,un=!!Ct.attributes.tangent&&(!!Ot.normalMap||Ot.anisotropy>0),an=!!Ct.morphAttributes.position,Vn=!!Ct.morphAttributes.normal,Si=!!Ct.morphAttributes.color,hi=no;Ot.toneMapped&&(N===null||N.isXRRenderTarget===!0)&&(hi=M.toneMapping);let cs=Ct.morphAttributes.position||Ct.morphAttributes.normal||Ct.morphAttributes.color,si=cs!==void 0?cs.length:0,_n=be.get(Ot),ir=p.state.lights;if(Ft===!0&&(ye===!0||z!==C)){let fs=z===C&&Ot.id===K;nn.setState(Ot,z,fs)}let Xn=!1;Ot.version===_n.__version?(_n.needsLights&&_n.lightsStateVersion!==ir.state.version||_n.outputColorSpace!==Qe||Pt.isBatchedMesh&&_n.batching===!1||!Pt.isBatchedMesh&&_n.batching===!0||Pt.isInstancedMesh&&_n.instancing===!1||!Pt.isInstancedMesh&&_n.instancing===!0||Pt.isSkinnedMesh&&_n.skinning===!1||!Pt.isSkinnedMesh&&_n.skinning===!0||Pt.isInstancedMesh&&_n.instancingColor===!0&&Pt.instanceColor===null||Pt.isInstancedMesh&&_n.instancingColor===!1&&Pt.instanceColor!==null||_n.envMap!==on||Ot.fog===!0&&_n.fog!==Ie||_n.numClippingPlanes!==void 0&&(_n.numClippingPlanes!==nn.numPlanes||_n.numIntersection!==nn.numIntersection)||_n.vertexAlphas!==dn||_n.vertexTangents!==un||_n.morphTargets!==an||_n.morphNormals!==Vn||_n.morphColors!==Si||_n.toneMapping!==hi||_e.isWebGL2===!0&&_n.morphTargetsCount!==si)&&(Xn=!0):(Xn=!0,_n.__version=Ot.version);let Ji=_n.currentProgram;Xn===!0&&(Ji=ci(Ot,xt,Pt));let sr=!1,rr=!1,Vo=!1,wi=Ji.getUniforms(),hs=_n.uniforms;if(Jt.useProgram(Ji.program)&&(sr=!0,rr=!0,Vo=!0),Ot.id!==K&&(K=Ot.id,rr=!0),sr||C!==z){wi.setValue(tt,"projectionMatrix",z.projectionMatrix),wi.setValue(tt,"viewMatrix",z.matrixWorldInverse);let fs=wi.map.cameraPosition;fs!==void 0&&fs.setValue(tt,Ze.setFromMatrixPosition(z.matrixWorld)),_e.logarithmicDepthBuffer&&wi.setValue(tt,"logDepthBufFC",2/(Math.log(z.far+1)/Math.LN2)),(Ot.isMeshPhongMaterial||Ot.isMeshToonMaterial||Ot.isMeshLambertMaterial||Ot.isMeshBasicMaterial||Ot.isMeshStandardMaterial||Ot.isShaderMaterial)&&wi.setValue(tt,"isOrthographic",z.isOrthographicCamera===!0),C!==z&&(C=z,rr=!0,Vo=!0)}if(Pt.isSkinnedMesh){wi.setOptional(tt,Pt,"bindMatrix"),wi.setOptional(tt,Pt,"bindMatrixInverse");let fs=Pt.skeleton;fs&&(_e.floatVertexTextures?(fs.boneTexture===null&&fs.computeBoneTexture(),wi.setValue(tt,"boneTexture",fs.boneTexture,F)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Pt.isBatchedMesh&&(wi.setOptional(tt,Pt,"batchingTexture"),wi.setValue(tt,"batchingTexture",Pt._matricesTexture,F));let us=Ct.morphAttributes;if((us.position!==void 0||us.normal!==void 0||us.color!==void 0&&_e.isWebGL2===!0)&&G.update(Pt,Ct,Ji),(rr||_n.receiveShadow!==Pt.receiveShadow)&&(_n.receiveShadow=Pt.receiveShadow,wi.setValue(tt,"receiveShadow",Pt.receiveShadow)),Ot.isMeshGouraudMaterial&&Ot.envMap!==null&&(hs.envMap.value=on,hs.flipEnvMap.value=on.isCubeTexture&&on.isRenderTargetTexture===!1?-1:1),rr&&(wi.setValue(tt,"toneMappingExposure",M.toneMappingExposure),_n.needsLights&&xn(hs,Vo),Ie&&Ot.fog===!0&&qt.refreshFogUniforms(hs,Ie),qt.refreshMaterialUniforms(hs,Ot,Wt,bt,Re),Aa.upload(tt,ks(_n),hs,F)),Ot.isShaderMaterial&&Ot.uniformsNeedUpdate===!0&&(Aa.upload(tt,ks(_n),hs,F),Ot.uniformsNeedUpdate=!1),Ot.isSpriteMaterial&&wi.setValue(tt,"center",Pt.center),wi.setValue(tt,"modelViewMatrix",Pt.modelViewMatrix),wi.setValue(tt,"normalMatrix",Pt.normalMatrix),wi.setValue(tt,"modelMatrix",Pt.matrixWorld),Ot.isShaderMaterial||Ot.isRawShaderMaterial){let fs=Ot.uniformsGroups;for(let ka=0,Br=fs.length;ka<Br;ka++)if(_e.isWebGL2){let Go=fs[ka];jt.update(Go,Ji),jt.bind(Go,Ji)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ji}function xn(z,xt){z.ambientLightColor.needsUpdate=xt,z.lightProbe.needsUpdate=xt,z.directionalLights.needsUpdate=xt,z.directionalLightShadows.needsUpdate=xt,z.pointLights.needsUpdate=xt,z.pointLightShadows.needsUpdate=xt,z.spotLights.needsUpdate=xt,z.spotLightShadows.needsUpdate=xt,z.rectAreaLights.needsUpdate=xt,z.hemisphereLights.needsUpdate=xt}function Hs(z){return z.isMeshLambertMaterial||z.isMeshToonMaterial||z.isMeshPhongMaterial||z.isMeshStandardMaterial||z.isShadowMaterial||z.isShaderMaterial&&z.lights===!0}this.getActiveCubeFace=function(){return R},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return N},this.setRenderTargetTextures=function(z,xt,Ct){be.get(z.texture).__webglTexture=xt,be.get(z.depthTexture).__webglTexture=Ct;let Ot=be.get(z);Ot.__hasExternalTextures=!0,Ot.__hasExternalTextures&&(Ot.__autoAllocateDepthBuffer=Ct===void 0,Ot.__autoAllocateDepthBuffer||ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Ot.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(z,xt){let Ct=be.get(z);Ct.__webglFramebuffer=xt,Ct.__useDefaultFramebuffer=xt===void 0},this.setRenderTarget=function(z,xt=0,Ct=0){N=z,R=xt,T=Ct;let Ot=!0,Pt=null,Ie=!1,$e=!1;if(z){let on=be.get(z);on.__useDefaultFramebuffer!==void 0?(Jt.bindFramebuffer(tt.FRAMEBUFFER,null),Ot=!1):on.__webglFramebuffer===void 0?F.setupRenderTarget(z):on.__hasExternalTextures&&F.rebindTextures(z,be.get(z.texture).__webglTexture,be.get(z.depthTexture).__webglTexture);let dn=z.texture;(dn.isData3DTexture||dn.isDataArrayTexture||dn.isCompressedArrayTexture)&&($e=!0);let un=be.get(z).__webglFramebuffer;z.isWebGLCubeRenderTarget?(Array.isArray(un[xt])?Pt=un[xt][Ct]:Pt=un[xt],Ie=!0):_e.isWebGL2&&z.samples>0&&F.useMultisampledRTT(z)===!1?Pt=be.get(z).__webglMultisampledFramebuffer:Array.isArray(un)?Pt=un[Ct]:Pt=un,w.copy(z.viewport),it.copy(z.scissor),mt=z.scissorTest}else w.copy(Yt).multiplyScalar(Wt).floor(),it.copy(le).multiplyScalar(Wt).floor(),mt=Me;if(Jt.bindFramebuffer(tt.FRAMEBUFFER,Pt)&&_e.drawBuffers&&Ot&&Jt.drawBuffers(z,Pt),Jt.viewport(w),Jt.scissor(it),Jt.setScissorTest(mt),Ie){let on=be.get(z.texture);tt.framebufferTexture2D(tt.FRAMEBUFFER,tt.COLOR_ATTACHMENT0,tt.TEXTURE_CUBE_MAP_POSITIVE_X+xt,on.__webglTexture,Ct)}else if($e){let on=be.get(z.texture),dn=xt||0;tt.framebufferTextureLayer(tt.FRAMEBUFFER,tt.COLOR_ATTACHMENT0,on.__webglTexture,Ct||0,dn)}K=-1},this.readRenderTargetPixels=function(z,xt,Ct,Ot,Pt,Ie,$e){if(!(z&&z.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Qe=be.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&$e!==void 0&&(Qe=Qe[$e]),Qe){Jt.bindFramebuffer(tt.FRAMEBUFFER,Qe);try{let on=z.texture,dn=on.format,un=on.type;if(dn!==js&&nt.convert(dn)!==tt.getParameter(tt.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let an=un===bl&&(ct.has("EXT_color_buffer_half_float")||_e.isWebGL2&&ct.has("EXT_color_buffer_float"));if(un!==io&&nt.convert(un)!==tt.getParameter(tt.IMPLEMENTATION_COLOR_READ_TYPE)&&!(un===to&&(_e.isWebGL2||ct.has("OES_texture_float")||ct.has("WEBGL_color_buffer_float")))&&!an){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}xt>=0&&xt<=z.width-Ot&&Ct>=0&&Ct<=z.height-Pt&&tt.readPixels(xt,Ct,Ot,Pt,nt.convert(dn),nt.convert(un),Ie)}finally{let on=N!==null?be.get(N).__webglFramebuffer:null;Jt.bindFramebuffer(tt.FRAMEBUFFER,on)}}},this.copyFramebufferToTexture=function(z,xt,Ct=0){let Ot=Math.pow(2,-Ct),Pt=Math.floor(xt.image.width*Ot),Ie=Math.floor(xt.image.height*Ot);F.setTexture2D(xt,0),tt.copyTexSubImage2D(tt.TEXTURE_2D,Ct,0,0,z.x,z.y,Pt,Ie),Jt.unbindTexture()},this.copyTextureToTexture=function(z,xt,Ct,Ot=0){let Pt=xt.image.width,Ie=xt.image.height,$e=nt.convert(Ct.format),Qe=nt.convert(Ct.type);F.setTexture2D(Ct,0),tt.pixelStorei(tt.UNPACK_FLIP_Y_WEBGL,Ct.flipY),tt.pixelStorei(tt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Ct.premultiplyAlpha),tt.pixelStorei(tt.UNPACK_ALIGNMENT,Ct.unpackAlignment),xt.isDataTexture?tt.texSubImage2D(tt.TEXTURE_2D,Ot,z.x,z.y,Pt,Ie,$e,Qe,xt.image.data):xt.isCompressedTexture?tt.compressedTexSubImage2D(tt.TEXTURE_2D,Ot,z.x,z.y,xt.mipmaps[0].width,xt.mipmaps[0].height,$e,xt.mipmaps[0].data):tt.texSubImage2D(tt.TEXTURE_2D,Ot,z.x,z.y,$e,Qe,xt.image),Ot===0&&Ct.generateMipmaps&&tt.generateMipmap(tt.TEXTURE_2D),Jt.unbindTexture()},this.copyTextureToTexture3D=function(z,xt,Ct,Ot,Pt=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Ie=z.max.x-z.min.x+1,$e=z.max.y-z.min.y+1,Qe=z.max.z-z.min.z+1,on=nt.convert(Ot.format),dn=nt.convert(Ot.type),un;if(Ot.isData3DTexture)F.setTexture3D(Ot,0),un=tt.TEXTURE_3D;else if(Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)F.setTexture2DArray(Ot,0),un=tt.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}tt.pixelStorei(tt.UNPACK_FLIP_Y_WEBGL,Ot.flipY),tt.pixelStorei(tt.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Ot.premultiplyAlpha),tt.pixelStorei(tt.UNPACK_ALIGNMENT,Ot.unpackAlignment);let an=tt.getParameter(tt.UNPACK_ROW_LENGTH),Vn=tt.getParameter(tt.UNPACK_IMAGE_HEIGHT),Si=tt.getParameter(tt.UNPACK_SKIP_PIXELS),hi=tt.getParameter(tt.UNPACK_SKIP_ROWS),cs=tt.getParameter(tt.UNPACK_SKIP_IMAGES),si=Ct.isCompressedTexture?Ct.mipmaps[Pt]:Ct.image;tt.pixelStorei(tt.UNPACK_ROW_LENGTH,si.width),tt.pixelStorei(tt.UNPACK_IMAGE_HEIGHT,si.height),tt.pixelStorei(tt.UNPACK_SKIP_PIXELS,z.min.x),tt.pixelStorei(tt.UNPACK_SKIP_ROWS,z.min.y),tt.pixelStorei(tt.UNPACK_SKIP_IMAGES,z.min.z),Ct.isDataTexture||Ct.isData3DTexture?tt.texSubImage3D(un,Pt,xt.x,xt.y,xt.z,Ie,$e,Qe,on,dn,si.data):Ct.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),tt.compressedTexSubImage3D(un,Pt,xt.x,xt.y,xt.z,Ie,$e,Qe,on,si.data)):tt.texSubImage3D(un,Pt,xt.x,xt.y,xt.z,Ie,$e,Qe,on,dn,si),tt.pixelStorei(tt.UNPACK_ROW_LENGTH,an),tt.pixelStorei(tt.UNPACK_IMAGE_HEIGHT,Vn),tt.pixelStorei(tt.UNPACK_SKIP_PIXELS,Si),tt.pixelStorei(tt.UNPACK_SKIP_ROWS,hi),tt.pixelStorei(tt.UNPACK_SKIP_IMAGES,cs),Pt===0&&Ot.generateMipmaps&&tt.generateMipmap(un),Jt.unbindTexture()},this.initTexture=function(z){z.isCubeTexture?F.setTextureCube(z,0):z.isData3DTexture?F.setTexture3D(z,0):z.isDataArrayTexture||z.isCompressedArrayTexture?F.setTexture2DArray(z,0):F.setTexture2D(z,0),Jt.unbindTexture()},this.resetState=function(){R=0,T=0,N=null,Jt.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ir}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Ad?"display-p3":"srgb",e.unpackColorSpace=Wn.workingColorSpace===Vh?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===kn?Co:og}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Co?kn:Dr}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},ed=class extends Tl{};ed.prototype.isWebGL1Renderer=!0;var ph=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new fn(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var mh=class extends vi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}},gh=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Bf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=mr()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=mr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},is=new W,tr=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyMatrix4(t),this.setXYZ(e,is.x,is.y,is.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyNormalMatrix(t),this.setXYZ(e,is.x,is.y,is.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.transformDirection(t),this.setXYZ(e,is.x,is.y,is.z);return this}setX(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=pr(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=pr(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=pr(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=pr(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array),r=Gn(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new $n(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var xh=class extends Ts{constructor(t=null,e=1,n=1,s,r,a,o,c,h=Li,u=Li,f,g){super(null,a,o,c,h,u,s,r,f,g),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Al=class extends $n{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},va=new Nn,N0=new Nn,Hc=[],O0=new es,DS=new Nn,dl=new Ke,pl=new ys,Nr=class extends Ke{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Al(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,DS)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new es),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,va),O0.copy(t.boundingBox).applyMatrix4(va),this.boundingBox.union(O0)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ys),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,va),pl.copy(t.boundingSphere).applyMatrix4(va),this.boundingSphere.union(pl)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,s=this.count;if(dl.geometry=this.geometry,dl.material=this.material,dl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pl.copy(this.boundingSphere),pl.applyMatrix4(n),t.ray.intersectsSphere(pl)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,va),N0.multiplyMatrices(n,va),dl.matrixWorld=N0,dl.raycast(t,Hc);for(let a=0,o=Hc.length;a<o;a++){let c=Hc[a];c.instanceId=r,c.object=this,e.push(c)}Hc.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Al(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Ia=class extends xr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fn(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},F0=new W,B0=new W,z0=new Nn,Rf=new Po,Vc=new ys,nd=class extends vi{constructor(t=new Ln,e=new Ia){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)F0.fromBufferAttribute(e,s-1),B0.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=F0.distanceTo(B0);t.setAttribute("lineDistance",new en(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vc.copy(n.boundingSphere),Vc.applyMatrix4(s),Vc.radius+=r,t.ray.intersectsSphere(Vc)===!1)return;z0.copy(s).invert(),Rf.copy(t.ray).applyMatrix4(z0);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),c=o*o,h=new W,u=new W,f=new W,g=new W,d=this.isLineSegments?2:1,y=n.index,p=n.attributes.position;if(y!==null){let x=Math.max(0,a.start),A=Math.min(y.count,a.start+a.count);for(let M=x,L=A-1;M<L;M+=d){let R=y.getX(M),T=y.getX(M+1);if(h.fromBufferAttribute(p,R),u.fromBufferAttribute(p,T),Rf.distanceSqToSegment(h,u,g,f)>c)continue;g.applyMatrix4(this.matrixWorld);let K=t.ray.origin.distanceTo(g);K<t.near||K>t.far||e.push({distance:K,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}else{let x=Math.max(0,a.start),A=Math.min(p.count,a.start+a.count);for(let M=x,L=A-1;M<L;M+=d){if(h.fromBufferAttribute(p,M),u.fromBufferAttribute(p,M+1),Rf.distanceSqToSegment(h,u,g,f)>c)continue;g.applyMatrix4(this.matrixWorld);let T=t.ray.origin.distanceTo(g);T<t.near||T>t.far||e.push({distance:T,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}},k0=new W,H0=new W,Rl=class extends nd{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)k0.fromBufferAttribute(e,s),H0.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+k0.distanceTo(H0);t.setAttribute("lineDistance",new en(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var as=class extends Ts{constructor(t,e,n,s,r,a,o,c,h){super(t,e,n,s,r,a,o,c,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},Bs=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,c=r-1,h;for(;o<=c;)if(s=Math.floor(o+(c-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)c=s-1;else{c=s;break}if(s=c,n[s]===a)return s/(r-1);let u=n[s],g=n[s+1]-u,d=(a-u)/g;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),c=e||(a.isVector2?new fe:new W);return c.copy(o).sub(a).normalize(),c}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new W,s=[],r=[],a=[],o=new W,c=new Nn;for(let d=0;d<=t;d++){let y=d/t;s[d]=this.getTangentAt(y,new W)}r[0]=new W,a[0]=new W;let h=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),g=Math.abs(s[0].z);u<=h&&(h=u,n.set(1,0,0)),f<=h&&(h=f,n.set(0,1,0)),g<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let y=Math.acos(Ii(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(c.makeRotationAxis(o,y))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Ii(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let y=1;y<=t;y++)r[y].applyMatrix4(c.makeRotationAxis(s[y],d*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Cl=class extends Bs{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,c=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=c}getPoint(t,e){let n=e||new fe,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,c=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),g=c-this.aX,d=h-this.aY;c=g*u-d*f+this.aX,h=g*f+d*u+this.aY}return n.set(c,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},id=class extends Cl{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Pd(){let i=0,t=0,e=0,n=0;function s(r,a,o,c){i=r,t=o,e=-3*r+3*a-2*o-c,n=2*r-2*a+o+c}return{initCatmullRom:function(r,a,o,c,h){s(a,o,h*(o-r),h*(c-a))},initNonuniformCatmullRom:function(r,a,o,c,h,u,f){let g=(a-r)/h-(o-r)/(h+u)+(o-a)/u,d=(o-a)/u-(c-a)/(u+f)+(c-o)/f;g*=u,d*=u,s(a,o,g,d)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var Gc=new W,Cf=new Pd,Pf=new Pd,Lf=new Pd,Lo=class extends Bs{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new W){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),c=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:c===0&&o===r-1&&(o=r-2,c=1);let h,u;this.closed||o>0?h=s[(o-1)%r]:(Gc.subVectors(s[0],s[1]).add(s[0]),h=Gc);let f=s[o%r],g=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Gc.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Gc),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,y=Math.pow(h.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(g),d),p=Math.pow(g.distanceToSquared(u),d);v<1e-4&&(v=1),y<1e-4&&(y=v),p<1e-4&&(p=v),Cf.initNonuniformCatmullRom(h.x,f.x,g.x,u.x,y,v,p),Pf.initNonuniformCatmullRom(h.y,f.y,g.y,u.y,y,v,p),Lf.initNonuniformCatmullRom(h.z,f.z,g.z,u.z,y,v,p)}else this.curveType==="catmullrom"&&(Cf.initCatmullRom(h.x,f.x,g.x,u.x,this.tension),Pf.initCatmullRom(h.y,f.y,g.y,u.y,this.tension),Lf.initCatmullRom(h.z,f.z,g.z,u.z,this.tension));return n.set(Cf.calc(c),Pf.calc(c),Lf.calc(c)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new W().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function V0(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,c=i*o;return(2*e-2*n+r+a)*c+(-3*e+3*n-2*r-a)*o+r*i+e}function US(i,t){let e=1-i;return e*e*t}function NS(i,t){return 2*(1-i)*i*t}function OS(i,t){return i*i*t}function _l(i,t,e,n){return US(i,t)+NS(i,e)+OS(i,n)}function FS(i,t){let e=1-i;return e*e*e*t}function BS(i,t){let e=1-i;return 3*e*e*i*t}function zS(i,t){return 3*(1-i)*i*i*t}function kS(i,t){return i*i*i*t}function vl(i,t,e,n,s){return FS(i,t)+BS(i,e)+zS(i,n)+kS(i,s)}var yh=class extends Bs{constructor(t=new fe,e=new fe,n=new fe,s=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new fe){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(vl(t,s.x,r.x,a.x,o.x),vl(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},sd=class extends Bs{constructor(t=new W,e=new W,n=new W,s=new W){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new W){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(vl(t,s.x,r.x,a.x,o.x),vl(t,s.y,r.y,a.y,o.y),vl(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},_h=class extends Bs{constructor(t=new fe,e=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new fe){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new fe){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},rd=class extends Bs{constructor(t=new W,e=new W){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new W){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new W){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},vh=class extends Bs{constructor(t=new fe,e=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new fe){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(_l(t,s.x,r.x,a.x),_l(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Mh=class extends Bs{constructor(t=new W,e=new W,n=new W){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new W){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(_l(t,s.x,r.x,a.x),_l(t,s.y,r.y,a.y),_l(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},bh=class extends Bs{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new fe){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,c=s[a===0?a:a-1],h=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(V0(o,c.x,h.x,u.x,f.x),V0(o,c.y,h.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new fe().fromArray(s))}return this}},Sh=Object.freeze({__proto__:null,ArcCurve:id,CatmullRomCurve3:Lo,CubicBezierCurve:yh,CubicBezierCurve3:sd,EllipseCurve:Cl,LineCurve:_h,LineCurve3:rd,QuadraticBezierCurve:vh,QuadraticBezierCurve3:Mh,SplineCurve:bh}),od=class extends Bs{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Sh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],c=o.getLength(),h=c===0?0:1-a/c;return o.getPointAt(h,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,c=a.getPoints(o);for(let h=0;h<c.length;h++){let u=c[h];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Sh[s.type]().fromJSON(s))}return this}},Eh=class extends od{constructor(t){super(),this.type="Path",this.currentPoint=new fe,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new _h(this.currentPoint.clone(),new fe(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new vh(this.currentPoint.clone(),new fe(t,e),new fe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new yh(this.currentPoint.clone(),new fe(t,e),new fe(n,s),new fe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new bh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,c=this.currentPoint.y;return this.absarc(t+o,e+c,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,c){let h=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+h,e+u,n,s,r,a,o,c),this}absellipse(t,e,n,s,r,a,o,c){let h=new Cl(t,e,n,s,r,a,o,c);if(this.curves.length>0){let f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);let u=h.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var wh=class i extends Ln{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],c=[],h=new W,u=new fe;a.push(0,0,0),o.push(0,0,1),c.push(.5,.5);for(let f=0,g=3;f<=e;f++,g+=3){let d=n+f/e*s;h.x=t*Math.cos(d),h.y=t*Math.sin(d),a.push(h.x,h.y,h.z),o.push(0,0,1),u.x=(a[g]/t+1)/2,u.y=(a[g+1]/t+1)/2,c.push(u.x,u.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new en(a,3)),this.setAttribute("normal",new en(o,3)),this.setAttribute("uv",new en(c,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Wi=class i extends Ln{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,c=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:c};let h=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],g=[],d=[],y=0,v=[],p=n/2,x=0;A(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new en(f,3)),this.setAttribute("normal",new en(g,3)),this.setAttribute("uv",new en(d,2));function A(){let L=new W,R=new W,T=0,N=(e-t)/n;for(let K=0;K<=r;K++){let C=[],w=K/r,it=w*(e-t)+t;for(let mt=0;mt<=s;mt++){let Kt=mt/s,Q=Kt*c+o,lt=Math.sin(Q),bt=Math.cos(Q);R.x=it*lt,R.y=-w*n+p,R.z=it*bt,f.push(R.x,R.y,R.z),L.set(lt,N,bt).normalize(),g.push(L.x,L.y,L.z),d.push(Kt,1-w),C.push(y++)}v.push(C)}for(let K=0;K<s;K++)for(let C=0;C<r;C++){let w=v[C][K],it=v[C+1][K],mt=v[C+1][K+1],Kt=v[C][K+1];u.push(w,it,Kt),u.push(it,mt,Kt),T+=6}h.addGroup(x,T,0),x+=T}function M(L){let R=y,T=new fe,N=new W,K=0,C=L===!0?t:e,w=L===!0?1:-1;for(let mt=1;mt<=s;mt++)f.push(0,p*w,0),g.push(0,w,0),d.push(.5,.5),y++;let it=y;for(let mt=0;mt<=s;mt++){let Q=mt/s*c+o,lt=Math.cos(Q),bt=Math.sin(Q);N.x=C*bt,N.y=p*w,N.z=C*lt,f.push(N.x,N.y,N.z),g.push(0,w,0),T.x=lt*.5+.5,T.y=bt*.5*w+.5,d.push(T.x,T.y),y++}for(let mt=0;mt<s;mt++){let Kt=R+mt,Q=it+mt;L===!0?u.push(Q,Q+1,Kt):u.push(Q+1,Q,Kt),K+=3}h.addGroup(x,K,L===!0?1:2),x+=K}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},oo=class i extends Wi{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ad=class i extends Ln{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],a=[];o(s),h(n),u(),this.setAttribute("position",new en(r,3)),this.setAttribute("normal",new en(r.slice(),3)),this.setAttribute("uv",new en(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(A){let M=new W,L=new W,R=new W;for(let T=0;T<e.length;T+=3)d(e[T+0],M),d(e[T+1],L),d(e[T+2],R),c(M,L,R,A)}function c(A,M,L,R){let T=R+1,N=[];for(let K=0;K<=T;K++){N[K]=[];let C=A.clone().lerp(L,K/T),w=M.clone().lerp(L,K/T),it=T-K;for(let mt=0;mt<=it;mt++)mt===0&&K===T?N[K][mt]=C:N[K][mt]=C.clone().lerp(w,mt/it)}for(let K=0;K<T;K++)for(let C=0;C<2*(T-K)-1;C++){let w=Math.floor(C/2);C%2===0?(g(N[K][w+1]),g(N[K+1][w]),g(N[K][w])):(g(N[K][w+1]),g(N[K+1][w+1]),g(N[K+1][w]))}}function h(A){let M=new W;for(let L=0;L<r.length;L+=3)M.x=r[L+0],M.y=r[L+1],M.z=r[L+2],M.normalize().multiplyScalar(A),r[L+0]=M.x,r[L+1]=M.y,r[L+2]=M.z}function u(){let A=new W;for(let M=0;M<r.length;M+=3){A.x=r[M+0],A.y=r[M+1],A.z=r[M+2];let L=p(A)/2/Math.PI+.5,R=x(A)/Math.PI+.5;a.push(L,1-R)}y(),f()}function f(){for(let A=0;A<a.length;A+=6){let M=a[A+0],L=a[A+2],R=a[A+4],T=Math.max(M,L,R),N=Math.min(M,L,R);T>.9&&N<.1&&(M<.2&&(a[A+0]+=1),L<.2&&(a[A+2]+=1),R<.2&&(a[A+4]+=1))}}function g(A){r.push(A.x,A.y,A.z)}function d(A,M){let L=A*3;M.x=t[L+0],M.y=t[L+1],M.z=t[L+2]}function y(){let A=new W,M=new W,L=new W,R=new W,T=new fe,N=new fe,K=new fe;for(let C=0,w=0;C<r.length;C+=9,w+=6){A.set(r[C+0],r[C+1],r[C+2]),M.set(r[C+3],r[C+4],r[C+5]),L.set(r[C+6],r[C+7],r[C+8]),T.set(a[w+0],a[w+1]),N.set(a[w+2],a[w+3]),K.set(a[w+4],a[w+5]),R.copy(A).add(M).add(L).divideScalar(3);let it=p(R);v(T,w+0,A,it),v(N,w+2,M,it),v(K,w+4,L,it)}}function v(A,M,L,R){R<0&&A.x===1&&(a[M]=A.x-1),L.x===0&&L.z===0&&(a[M]=R/2/Math.PI+.5)}function p(A){return Math.atan2(A.z,-A.x)}function x(A){return Math.atan2(-A.y,Math.sqrt(A.x*A.x+A.z*A.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var Or=class extends Eh{constructor(t){super(t),this.uuid=mr(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Eh().fromJSON(s))}return this}},HS={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=xg(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,c,h,u,f,g,d;if(n&&(r=qS(i,t,r,e)),i.length>80*e){o=h=i[0],c=u=i[1];for(let y=e;y<s;y+=e)f=i[y],g=i[y+1],f<o&&(o=f),g<c&&(c=g),f>h&&(h=f),g>u&&(u=g);d=Math.max(h-o,u-c),d=d!==0?32767/d:0}return Pl(r,a,e,o,c,d,0),a}};function xg(i,t,e,n,s){let r,a;if(s===i2(i,t,e,n)>0)for(r=t;r<e;r+=n)a=G0(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=G0(r,i[r],i[r+1],a);return a&&qh(a,a.next)&&(Il(a),a=a.next),a}function Io(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(qh(e,e.next)||_i(e.prev,e,e.next)===0)){if(Il(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Pl(i,t,e,n,s,r,a){if(!i)return;!a&&r&&jS(i,n,s,r);let o=i,c,h;for(;i.prev!==i.next;){if(c=i.prev,h=i.next,r?GS(i,n,s,r):VS(i)){t.push(c.i/e|0),t.push(i.i/e|0),t.push(h.i/e|0),Il(i),i=h.next,o=h.next;continue}if(i=h,i===o){a?a===1?(i=WS(Io(i),t,e),Pl(i,t,e,n,s,r,2)):a===2&&XS(i,t,e,n,s,r):Pl(Io(i),t,e,n,s,r,1);break}}}function VS(i){let t=i.prev,e=i,n=i.next;if(_i(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,c=e.y,h=n.y,u=s<r?s<a?s:a:r<a?r:a,f=o<c?o<h?o:h:c<h?c:h,g=s>r?s>a?s:a:r>a?r:a,d=o>c?o>h?o:h:c>h?c:h,y=n.next;for(;y!==t;){if(y.x>=u&&y.x<=g&&y.y>=f&&y.y<=d&&Ea(s,o,r,c,a,h,y.x,y.y)&&_i(y.prev,y,y.next)>=0)return!1;y=y.next}return!0}function GS(i,t,e,n){let s=i.prev,r=i,a=i.next;if(_i(s,r,a)>=0)return!1;let o=s.x,c=r.x,h=a.x,u=s.y,f=r.y,g=a.y,d=o<c?o<h?o:h:c<h?c:h,y=u<f?u<g?u:g:f<g?f:g,v=o>c?o>h?o:h:c>h?c:h,p=u>f?u>g?u:g:f>g?f:g,x=ld(d,y,t,e,n),A=ld(v,p,t,e,n),M=i.prevZ,L=i.nextZ;for(;M&&M.z>=x&&L&&L.z<=A;){if(M.x>=d&&M.x<=v&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&Ea(o,u,c,f,h,g,M.x,M.y)&&_i(M.prev,M,M.next)>=0||(M=M.prevZ,L.x>=d&&L.x<=v&&L.y>=y&&L.y<=p&&L!==s&&L!==a&&Ea(o,u,c,f,h,g,L.x,L.y)&&_i(L.prev,L,L.next)>=0))return!1;L=L.nextZ}for(;M&&M.z>=x;){if(M.x>=d&&M.x<=v&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&Ea(o,u,c,f,h,g,M.x,M.y)&&_i(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;L&&L.z<=A;){if(L.x>=d&&L.x<=v&&L.y>=y&&L.y<=p&&L!==s&&L!==a&&Ea(o,u,c,f,h,g,L.x,L.y)&&_i(L.prev,L,L.next)>=0)return!1;L=L.nextZ}return!0}function WS(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!qh(s,r)&&yg(s,n,n.next,r)&&Ll(s,r)&&Ll(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Il(n),Il(n.next),n=i=r),n=n.next}while(n!==i);return Io(n)}function XS(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&t2(a,o)){let c=_g(a,o);a=Io(a,a.next),c=Io(c,c.next),Pl(a,t,e,n,s,r,0),Pl(c,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function qS(i,t,e,n){let s=[],r,a,o,c,h;for(r=0,a=t.length;r<a;r++)o=t[r]*n,c=r<a-1?t[r+1]*n:i.length,h=xg(i,o,c,n,!1),h===h.next&&(h.steiner=!0),s.push(QS(h));for(s.sort(YS),r=0;r<s.length;r++)e=$S(s[r],e);return e}function YS(i,t){return i.x-t.x}function $S(i,t){let e=ZS(i,t);if(!e)return t;let n=_g(e,i);return Io(n,n.next),Io(e,e.next)}function ZS(i,t){let e=t,n=-1/0,s,r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){let g=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(g<=r&&g>n&&(n=g,s=e.x<e.next.x?e:e.next,g===r))return s}e=e.next}while(e!==t);if(!s)return null;let o=s,c=s.x,h=s.y,u=1/0,f;e=s;do r>=e.x&&e.x>=c&&r!==e.x&&Ea(a<h?r:n,a,c,h,a<h?n:r,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(r-e.x),Ll(e,i)&&(f<u||f===u&&(e.x>s.x||e.x===s.x&&JS(s,e)))&&(s=e,u=f)),e=e.next;while(e!==o);return s}function JS(i,t){return _i(i.prev,i,t.prev)<0&&_i(t.next,i,i.next)<0}function jS(i,t,e,n){let s=i;do s.z===0&&(s.z=ld(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,KS(s)}function KS(i){let t,e,n,s,r,a,o,c,h=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<h&&(o++,n=n.nextZ,!!n);t++);for(c=h;o>0||c>0&&n;)o!==0&&(c===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,c--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,h*=2}while(a>1);return i}function ld(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function QS(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Ea(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function t2(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!e2(i,t)&&(Ll(i,t)&&Ll(t,i)&&n2(i,t)&&(_i(i.prev,i,t.prev)||_i(i,t.prev,t))||qh(i,t)&&_i(i.prev,i,i.next)>0&&_i(t.prev,t,t.next)>0)}function _i(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function qh(i,t){return i.x===t.x&&i.y===t.y}function yg(i,t,e,n){let s=Xc(_i(i,t,e)),r=Xc(_i(i,t,n)),a=Xc(_i(e,n,i)),o=Xc(_i(e,n,t));return!!(s!==r&&a!==o||s===0&&Wc(i,e,t)||r===0&&Wc(i,n,t)||a===0&&Wc(e,i,n)||o===0&&Wc(e,t,n))}function Wc(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Xc(i){return i>0?1:i<0?-1:0}function e2(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&yg(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ll(i,t){return _i(i.prev,i,i.next)<0?_i(i,t,i.next)>=0&&_i(i,i.prev,t)>=0:_i(i,t,i.prev)<0||_i(i,i.next,t)<0}function n2(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function _g(i,t){let e=new cd(i.i,i.x,i.y),n=new cd(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function G0(i,t,e,n){let s=new cd(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Il(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function cd(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function i2(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Ks=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];W0(t),X0(n,t);let a=t.length;e.forEach(W0);for(let c=0;c<e.length;c++)s.push(a),a+=e[c].length,X0(n,e[c]);let o=HS.triangulate(n,s);for(let c=0;c<o.length;c+=3)r.push(o.slice(c,c+3));return r}};function W0(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function X0(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Dl=class i extends Ln{constructor(t=new Or([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,c=t.length;o<c;o++){let h=t[o];a(h)}this.setAttribute("position",new en(s,3)),this.setAttribute("uv",new en(r,2)),this.computeVertexNormals();function a(o){let c=[],h=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1,g=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,y=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,x=e.extrudePath,A=e.UVGenerator!==void 0?e.UVGenerator:s2,M,L=!1,R,T,N,K;x&&(M=x.getSpacedPoints(u),L=!0,g=!1,R=x.computeFrenetFrames(u,!1),T=new W,N=new W,K=new W),g||(p=0,d=0,y=0,v=0);let C=o.extractPoints(h),w=C.shape,it=C.holes;if(!Ks.isClockWise(w)){w=w.reverse();for(let tt=0,Se=it.length;tt<Se;tt++){let ct=it[tt];Ks.isClockWise(ct)&&(it[tt]=ct.reverse())}}let Kt=Ks.triangulateShape(w,it),Q=w;for(let tt=0,Se=it.length;tt<Se;tt++){let ct=it[tt];w=w.concat(ct)}function lt(tt,Se,ct){return Se||console.error("THREE.ExtrudeGeometry: vec does not exist"),tt.clone().addScaledVector(Se,ct)}let bt=w.length,Wt=Kt.length;function Zt(tt,Se,ct){let _e,Jt,ke,be=tt.x-Se.x,F=tt.y-Se.y,I=ct.x-tt.x,_t=ct.y-tt.y,xe=be*be+F*F,de=be*_t-F*I;if(Math.abs(de)>Number.EPSILON){let ue=Math.sqrt(xe),We=Math.sqrt(I*I+_t*_t),qt=Se.x-F/ue,we=Se.y+be/ue,Je=ct.x-_t/We,nn=ct.y+I/We,pe=((Je-qt)*_t-(nn-we)*I)/(be*_t-F*I);_e=qt+be*pe-tt.x,Jt=we+F*pe-tt.y;let gn=_e*_e+Jt*Jt;if(gn<=2)return new fe(_e,Jt);ke=Math.sqrt(gn/2)}else{let ue=!1;be>Number.EPSILON?I>Number.EPSILON&&(ue=!0):be<-Number.EPSILON?I<-Number.EPSILON&&(ue=!0):Math.sign(F)===Math.sign(_t)&&(ue=!0),ue?(_e=-F,Jt=be,ke=Math.sqrt(xe)):(_e=be,Jt=F,ke=Math.sqrt(xe/2))}return new fe(_e/ke,Jt/ke)}let At=[];for(let tt=0,Se=Q.length,ct=Se-1,_e=tt+1;tt<Se;tt++,ct++,_e++)ct===Se&&(ct=0),_e===Se&&(_e=0),At[tt]=Zt(Q[tt],Q[ct],Q[_e]);let Yt=[],le,Me=At.concat();for(let tt=0,Se=it.length;tt<Se;tt++){let ct=it[tt];le=[];for(let _e=0,Jt=ct.length,ke=Jt-1,be=_e+1;_e<Jt;_e++,ke++,be++)ke===Jt&&(ke=0),be===Jt&&(be=0),le[_e]=Zt(ct[_e],ct[ke],ct[be]);Yt.push(le),Me=Me.concat(le)}for(let tt=0;tt<p;tt++){let Se=tt/p,ct=d*Math.cos(Se*Math.PI/2),_e=y*Math.sin(Se*Math.PI/2)+v;for(let Jt=0,ke=Q.length;Jt<ke;Jt++){let be=lt(Q[Jt],At[Jt],_e);Le(be.x,be.y,-ct)}for(let Jt=0,ke=it.length;Jt<ke;Jt++){let be=it[Jt];le=Yt[Jt];for(let F=0,I=be.length;F<I;F++){let _t=lt(be[F],le[F],_e);Le(_t.x,_t.y,-ct)}}}let Rt=y+v;for(let tt=0;tt<bt;tt++){let Se=g?lt(w[tt],Me[tt],Rt):w[tt];L?(N.copy(R.normals[0]).multiplyScalar(Se.x),T.copy(R.binormals[0]).multiplyScalar(Se.y),K.copy(M[0]).add(N).add(T),Le(K.x,K.y,K.z)):Le(Se.x,Se.y,0)}for(let tt=1;tt<=u;tt++)for(let Se=0;Se<bt;Se++){let ct=g?lt(w[Se],Me[Se],Rt):w[Se];L?(N.copy(R.normals[tt]).multiplyScalar(ct.x),T.copy(R.binormals[tt]).multiplyScalar(ct.y),K.copy(M[tt]).add(N).add(T),Le(K.x,K.y,K.z)):Le(ct.x,ct.y,f/u*tt)}for(let tt=p-1;tt>=0;tt--){let Se=tt/p,ct=d*Math.cos(Se*Math.PI/2),_e=y*Math.sin(Se*Math.PI/2)+v;for(let Jt=0,ke=Q.length;Jt<ke;Jt++){let be=lt(Q[Jt],At[Jt],_e);Le(be.x,be.y,f+ct)}for(let Jt=0,ke=it.length;Jt<ke;Jt++){let be=it[Jt];le=Yt[Jt];for(let F=0,I=be.length;F<I;F++){let _t=lt(be[F],le[F],_e);L?Le(_t.x,_t.y+M[u-1].y,M[u-1].x+ct):Le(_t.x,_t.y,f+ct)}}}Ft(),ye();function Ft(){let tt=s.length/3;if(g){let Se=0,ct=bt*Se;for(let _e=0;_e<Wt;_e++){let Jt=Kt[_e];Xe(Jt[2]+ct,Jt[1]+ct,Jt[0]+ct)}Se=u+p*2,ct=bt*Se;for(let _e=0;_e<Wt;_e++){let Jt=Kt[_e];Xe(Jt[0]+ct,Jt[1]+ct,Jt[2]+ct)}}else{for(let Se=0;Se<Wt;Se++){let ct=Kt[Se];Xe(ct[2],ct[1],ct[0])}for(let Se=0;Se<Wt;Se++){let ct=Kt[Se];Xe(ct[0]+bt*u,ct[1]+bt*u,ct[2]+bt*u)}}n.addGroup(tt,s.length/3-tt,0)}function ye(){let tt=s.length/3,Se=0;Re(Q,Se),Se+=Q.length;for(let ct=0,_e=it.length;ct<_e;ct++){let Jt=it[ct];Re(Jt,Se),Se+=Jt.length}n.addGroup(tt,s.length/3-tt,1)}function Re(tt,Se){let ct=tt.length;for(;--ct>=0;){let _e=ct,Jt=ct-1;Jt<0&&(Jt=tt.length-1);for(let ke=0,be=u+p*2;ke<be;ke++){let F=bt*ke,I=bt*(ke+1),_t=Se+_e+F,xe=Se+Jt+F,de=Se+Jt+I,ue=Se+_e+I;Ze(_t,xe,de,ue)}}}function Le(tt,Se,ct){c.push(tt),c.push(Se),c.push(ct)}function Xe(tt,Se,ct){De(tt),De(Se),De(ct);let _e=s.length/3,Jt=A.generateTopUV(n,s,_e-3,_e-2,_e-1);Be(Jt[0]),Be(Jt[1]),Be(Jt[2])}function Ze(tt,Se,ct,_e){De(tt),De(Se),De(_e),De(Se),De(ct),De(_e);let Jt=s.length/3,ke=A.generateSideWallUV(n,s,Jt-6,Jt-3,Jt-2,Jt-1);Be(ke[0]),Be(ke[1]),Be(ke[3]),Be(ke[1]),Be(ke[2]),Be(ke[3])}function De(tt){s.push(c[tt*3+0]),s.push(c[tt*3+1]),s.push(c[tt*3+2])}function Be(tt){r.push(tt.x),r.push(tt.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return r2(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Sh[s.type]().fromJSON(s)),new i(n,t.options)}},s2={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],c=t[n*3+1],h=t[s*3],u=t[s*3+1];return[new fe(r,a),new fe(o,c),new fe(h,u)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],c=t[e*3+2],h=t[n*3],u=t[n*3+1],f=t[n*3+2],g=t[s*3],d=t[s*3+1],y=t[s*3+2],v=t[r*3],p=t[r*3+1],x=t[r*3+2];return Math.abs(o-u)<Math.abs(a-h)?[new fe(a,1-c),new fe(h,1-f),new fe(g,1-y),new fe(v,1-x)]:[new fe(o,1-c),new fe(u,1-f),new fe(d,1-y),new fe(p,1-x)]}};function r2(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Th=class i extends ad{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var Ah=class i extends Ln{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],c=[],h=[],u=[],f=t,g=(e-t)/s,d=new W,y=new fe;for(let v=0;v<=s;v++){for(let p=0;p<=n;p++){let x=r+p/n*a;d.x=f*Math.cos(x),d.y=f*Math.sin(x),c.push(d.x,d.y,d.z),h.push(0,0,1),y.x=(d.x/e+1)/2,y.y=(d.y/e+1)/2,u.push(y.x,y.y)}f+=g}for(let v=0;v<s;v++){let p=v*(n+1);for(let x=0;x<n;x++){let A=x+p,M=A,L=A+n+1,R=A+n+2,T=A+1;o.push(M,L,T),o.push(L,R,T)}}this.setIndex(o),this.setAttribute("position",new en(c,3)),this.setAttribute("normal",new en(h,3)),this.setAttribute("uv",new en(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Ul=class i extends Ln{constructor(t=new Or([new fe(0,.5),new fe(-.5,-.5),new fe(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],a=[],o=0,c=0;if(Array.isArray(t)===!1)h(t);else for(let u=0;u<t.length;u++)h(t[u]),this.addGroup(o,c,u),o+=c,c=0;this.setIndex(n),this.setAttribute("position",new en(s,3)),this.setAttribute("normal",new en(r,3)),this.setAttribute("uv",new en(a,2));function h(u){let f=s.length/3,g=u.extractPoints(e),d=g.shape,y=g.holes;Ks.isClockWise(d)===!1&&(d=d.reverse());for(let p=0,x=y.length;p<x;p++){let A=y[p];Ks.isClockWise(A)===!0&&(y[p]=A.reverse())}let v=Ks.triangulateShape(d,y);for(let p=0,x=y.length;p<x;p++){let A=y[p];d=d.concat(A)}for(let p=0,x=d.length;p<x;p++){let A=d[p];s.push(A.x,A.y,0),r.push(0,0,1),a.push(A.x,A.y)}for(let p=0,x=v.length;p<x;p++){let A=v[p],M=A[0]+f,L=A[1]+f,R=A[2]+f;n.push(M,L,R),c+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return o2(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let a=e[t.shapes[s]];n.push(a)}return new i(n,t.curveSegments)}};function o2(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var Xi=class i extends Ln{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let c=Math.min(a+o,Math.PI),h=0,u=[],f=new W,g=new W,d=[],y=[],v=[],p=[];for(let x=0;x<=n;x++){let A=[],M=x/n,L=0;x===0&&a===0?L=.5/e:x===n&&c===Math.PI&&(L=-.5/e);for(let R=0;R<=e;R++){let T=R/e;f.x=-t*Math.cos(s+T*r)*Math.sin(a+M*o),f.y=t*Math.cos(a+M*o),f.z=t*Math.sin(s+T*r)*Math.sin(a+M*o),y.push(f.x,f.y,f.z),g.copy(f).normalize(),v.push(g.x,g.y,g.z),p.push(T+L,1-M),A.push(h++)}u.push(A)}for(let x=0;x<n;x++)for(let A=0;A<e;A++){let M=u[x][A+1],L=u[x][A],R=u[x+1][A],T=u[x+1][A+1];(x!==0||a>0)&&d.push(M,L,T),(x!==n-1||c<Math.PI)&&d.push(L,R,T)}this.setIndex(d),this.setAttribute("position",new en(y,3)),this.setAttribute("normal",new en(v,3)),this.setAttribute("uv",new en(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Rh=class i extends Ln{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],c=[],h=[],u=new W,f=new W,g=new W;for(let d=0;d<=n;d++)for(let y=0;y<=s;y++){let v=y/s*r,p=d/n*Math.PI*2;f.x=(t+e*Math.cos(p))*Math.cos(v),f.y=(t+e*Math.cos(p))*Math.sin(v),f.z=e*Math.sin(p),o.push(f.x,f.y,f.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),g.subVectors(f,u).normalize(),c.push(g.x,g.y,g.z),h.push(y/s),h.push(d/n)}for(let d=1;d<=n;d++)for(let y=1;y<=s;y++){let v=(s+1)*d+y-1,p=(s+1)*(d-1)+y-1,x=(s+1)*(d-1)+y,A=(s+1)*d+y;a.push(v,p,A),a.push(p,x,A)}this.setIndex(a),this.setAttribute("position",new en(o,3)),this.setAttribute("normal",new en(c,3)),this.setAttribute("uv",new en(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Ch=class i extends Ln{constructor(t=new Mh(new W(-1,-1,0),new W(-1,1,0),new W(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new W,c=new W,h=new fe,u=new W,f=[],g=[],d=[],y=[];v(),this.setIndex(y),this.setAttribute("position",new en(f,3)),this.setAttribute("normal",new en(g,3)),this.setAttribute("uv",new en(d,2));function v(){for(let M=0;M<e;M++)p(M);p(r===!1?e:0),A(),x()}function p(M){u=t.getPointAt(M/e,u);let L=a.normals[M],R=a.binormals[M];for(let T=0;T<=s;T++){let N=T/s*Math.PI*2,K=Math.sin(N),C=-Math.cos(N);c.x=C*L.x+K*R.x,c.y=C*L.y+K*R.y,c.z=C*L.z+K*R.z,c.normalize(),g.push(c.x,c.y,c.z),o.x=u.x+n*c.x,o.y=u.y+n*c.y,o.z=u.z+n*c.z,f.push(o.x,o.y,o.z)}}function x(){for(let M=1;M<=e;M++)for(let L=1;L<=s;L++){let R=(s+1)*(M-1)+(L-1),T=(s+1)*M+(L-1),N=(s+1)*M+L,K=(s+1)*(M-1)+L;y.push(R,T,K),y.push(T,N,K)}}function A(){for(let M=0;M<=e;M++)for(let L=0;L<=s;L++)h.x=M/e,h.y=L/s,d.push(h.x,h.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Sh[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},Ph=class extends Ln{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],n=new Set,s=new W,r=new W;if(t.index!==null){let a=t.attributes.position,o=t.index,c=t.groups;c.length===0&&(c=[{start:0,count:o.count,materialIndex:0}]);for(let h=0,u=c.length;h<u;++h){let f=c[h],g=f.start,d=f.count;for(let y=g,v=g+d;y<v;y+=3)for(let p=0;p<3;p++){let x=o.getX(y+p),A=o.getX(y+(p+1)%3);s.fromBufferAttribute(a,x),r.fromBufferAttribute(a,A),q0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let a=t.attributes.position;for(let o=0,c=a.count/3;o<c;o++)for(let h=0;h<3;h++){let u=3*o+h,f=3*o+(h+1)%3;s.fromBufferAttribute(a,u),r.fromBufferAttribute(a,f),q0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new en(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function q0(i,t,e){let n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}var Lh=class extends xr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new fn(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Ih=class extends xr{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new fn(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Dh=class extends xr{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Ed,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function qc(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function a2(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Da=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let c=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===c)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},hd=class extends Da{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:qm,endingEnd:qm}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],c=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Ym:r=t,o=2*e-n;break;case $m:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(c===void 0)switch(this.getSettings_().endingEnd){case Ym:a=t,c=2*n-e;break;case $m:a=1,c=n+s[1]-s[0];break;default:a=t-1,c=e}let h=(n-e)*.5,u=this.valueSize;this._weightPrev=h/(e-o),this._weightNext=h/(c-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,h=c-o,u=this._offsetPrev,f=this._offsetNext,g=this._weightPrev,d=this._weightNext,y=(n-e)/(s-e),v=y*y,p=v*y,x=-g*p+2*g*v-g*y,A=(1+g)*p+(-1.5-2*g)*v+(-.5+g)*y+1,M=(-1-d)*p+(1.5+d)*v+.5*y,L=d*p-d*v;for(let R=0;R!==o;++R)r[R]=x*a[u+R]+A*a[h+R]+M*a[c+R]+L*a[f+R];return r}},ud=class extends Da{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=t*o,h=c-o,u=(n-e)/(s-e),f=1-u;for(let g=0;g!==o;++g)r[g]=a[h+g]*f+a[c+g]*u;return r}},fd=class extends Da{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},er=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=qc(e,this.TimeBufferType),this.values=qc(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:qc(t.times,Array),values:qc(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new fd(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ud(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new hd(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Zc:e=this.InterpolantFactoryMethodDiscrete;break;case Jc:e=this.InterpolantFactoryMethodLinear;break;case rf:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zc;case this.InterpolantFactoryMethodLinear:return Jc;case this.InterpolantFactoryMethodSmooth:return rf}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let c=n[o];if(typeof c=="number"&&isNaN(c)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,c),t=!1;break}if(a!==null&&a>c){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,c,a),t=!1;break}a=c}if(s!==void 0&&a2(s))for(let o=0,c=s.length;o!==c;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===rf,r=t.length-1,a=1;for(let o=1;o<r;++o){let c=!1,h=t[o],u=t[o+1];if(h!==u&&(o!==1||h!==t[0]))if(s)c=!0;else{let f=o*n,g=f-n,d=f+n;for(let y=0;y!==n;++y){let v=e[f+y];if(v!==e[g+y]||v!==e[d+y]){c=!0;break}}}if(c){if(o!==a){t[a]=t[o];let f=o*n,g=a*n;for(let d=0;d!==n;++d)e[g+d]=e[f+d]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,c=a*n,h=0;h!==n;++h)e[c+h]=e[o+h];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};er.prototype.TimeBufferType=Float32Array;er.prototype.ValueBufferType=Float32Array;er.prototype.DefaultInterpolation=Jc;var Do=class extends er{};Do.prototype.ValueTypeName="bool";Do.prototype.ValueBufferType=Array;Do.prototype.DefaultInterpolation=Zc;Do.prototype.InterpolantFactoryMethodLinear=void 0;Do.prototype.InterpolantFactoryMethodSmooth=void 0;var dd=class extends er{};dd.prototype.ValueTypeName="color";var pd=class extends er{};pd.prototype.ValueTypeName="number";var md=class extends Da{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,c=(n-e)/(s-e),h=t*o;for(let u=h+o;h!==u;h+=4)xs.slerpFlat(r,0,a,h-o,a,h,c);return r}},Nl=class extends er{InterpolantFactoryMethodLinear(t){return new md(this.times,this.values,this.getValueSize(),t)}};Nl.prototype.ValueTypeName="quaternion";Nl.prototype.DefaultInterpolation=Jc;Nl.prototype.InterpolantFactoryMethodSmooth=void 0;var Uo=class extends er{};Uo.prototype.ValueTypeName="string";Uo.prototype.ValueBufferType=Array;Uo.prototype.DefaultInterpolation=Zc;Uo.prototype.InterpolantFactoryMethodLinear=void 0;Uo.prototype.InterpolantFactoryMethodSmooth=void 0;var gd=class extends er{};gd.prototype.ValueTypeName="vector";var xd=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,c,h=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return c?c(u):u},this.setURLModifier=function(u){return c=u,this},this.addHandler=function(u,f){return h.push(u,f),this},this.removeHandler=function(u){let f=h.indexOf(u);return f!==-1&&h.splice(f,2),this},this.getHandler=function(u){for(let f=0,g=h.length;f<g;f+=2){let d=h[f],y=h[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return y}return null}}},l2=new xd,yd=class{constructor(t){this.manager=t!==void 0?t:l2,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};yd.DEFAULT_MATERIAL_NAME="__DEFAULT";var Uh=class extends vi{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new fn(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},Nh=class extends Uh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vi.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fn(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},If=new Nn,Y0=new W,$0=new W,_d=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.map=null,this.mapPass=null,this.matrix=new Nn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wl,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new Fn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;Y0.setFromMatrixPosition(t.matrixWorld),e.position.copy(Y0),$0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt($0),e.updateMatrixWorld(),If.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(If),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(If)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var vd=class extends _d{constructor(){super(new uh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Oh=class extends Uh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vi.DEFAULT_UP),this.updateMatrix(),this.target=new vi,this.shadow=new vd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Fh=class extends Ln{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Ld="\\[\\]\\.:\\/",c2=new RegExp("["+Ld+"]","g"),Id="[^"+Ld+"]",h2="[^"+Ld.replace("\\.","")+"]",u2=/((?:WC+[\/:])*)/.source.replace("WC",Id),f2=/(WCOD+)?/.source.replace("WCOD",h2),d2=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Id),p2=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Id),m2=new RegExp("^"+u2+f2+d2+p2+"$"),g2=["material","materials","bones","map"],Md=class{constructor(t,e,n){let s=n||fi.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},fi=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(c2,"")}static parseTrackName(t){let e=m2.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);g2.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let c=n(o.children);if(c)return c}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===h){h=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(h!==void 0){if(t[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let a=t[s];if(a===void 0){let h=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let c=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}c=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(c=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(c=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[c],this.setValue=this.SetterByBindingTypeAndVersioning[c][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fi.Composite=Md;fi.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};fi.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};fi.prototype.GetterByBindingType=[fi.prototype._getValue_direct,fi.prototype._getValue_array,fi.prototype._getValue_arrayElement,fi.prototype._getValue_toArray];fi.prototype.SetterByBindingTypeAndVersioning=[[fi.prototype._setValue_direct,fi.prototype._setValue_direct_setNeedsUpdate,fi.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fi.prototype._setValue_array,fi.prototype._setValue_array_setNeedsUpdate,fi.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fi.prototype._setValue_arrayElement,fi.prototype._setValue_arrayElement_setNeedsUpdate,fi.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fi.prototype._setValue_fromArray,fi.prototype._setValue_fromArray_setNeedsUpdate,fi.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var X2=new Float32Array(1);var No=class extends gh{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}};var Bh=class{constructor(t,e,n=0,s=1/0){this.ray=new Po(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new El,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return bd(t,this,n,e),n.sort(Z0),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)bd(t[s],this,n,e);return n.sort(Z0),n}};function Z0(i,t){return i.distance-t.distance}function bd(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,a=s.length;r<a;r++)bd(s[r],t,e,!0)}}var nr=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ii(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var J0=new W,Yc=new W,zh=class{constructor(t=new W,e=new W){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){J0.subVectors(t,this.start),Yc.subVectors(this.end,this.start);let n=Yc.dot(Yc),r=Yc.dot(J0)/n;return e&&(r=Ii(r,0,1)),r}closestPointToPoint(t,e,n){let s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var vg={type:"change"},Dd={type:"start"},Mg={type:"end"},Yh=new Po,bg=new Zs,x2=Math.cos(70*Gh.DEG2RAD),$h=class extends gr{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new W,this.cursor=new W,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Oo.ROTATE,MIDDLE:Oo.DOLLY,RIGHT:Oo.PAN},this.touches={ONE:Fo.ROTATE,TWO:Fo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(G){G.addEventListener("keydown",ue),this._domElementKeyEvents=G},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ue),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(vg),n.update(),r=s.NONE},this.update=(function(){let G=new W,oe=new xs().setFromUnitVectors(t.up,new W(0,1,0)),ve=oe.clone().invert(),nt=new W,dt=new xs,jt=new W,te=2*Math.PI;return function(ht=null){let V=n.object.position;G.copy(V).sub(n.target),G.applyQuaternion(oe),o.setFromVector3(G),n.autoRotate&&r===s.NONE&&it(C(ht)),n.enableDamping?(o.theta+=c.theta*n.dampingFactor,o.phi+=c.phi*n.dampingFactor):(o.theta+=c.theta,o.phi+=c.phi);let Lt=n.minAzimuthAngle,zt=n.maxAzimuthAngle;isFinite(Lt)&&isFinite(zt)&&(Lt<-Math.PI?Lt+=te:Lt>Math.PI&&(Lt-=te),zt<-Math.PI?zt+=te:zt>Math.PI&&(zt-=te),Lt<=zt?o.theta=Math.max(Lt,Math.min(zt,o.theta)):o.theta=o.theta>(Lt+zt)/2?Math.max(Lt,o.theta):Math.min(zt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&T||n.object.isOrthographicCamera?o.radius=At(o.radius):o.radius=At(o.radius*h),G.setFromSpherical(o),G.applyQuaternion(ve),V.copy(n.target).add(G),n.object.lookAt(n.target),n.enableDamping===!0?(c.theta*=1-n.dampingFactor,c.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(c.set(0,0,0),u.set(0,0,0));let re=!1;if(n.zoomToCursor&&T){let ce=null;if(n.object.isPerspectiveCamera){let Ue=G.length();ce=At(Ue*h);let Qt=Ue-ce;n.object.position.addScaledVector(L,Qt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let Ue=new W(R.x,R.y,0);Ue.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),re=!0;let Qt=new W(R.x,R.y,0);Qt.unproject(n.object),n.object.position.sub(Qt).add(Ue),n.object.updateMatrixWorld(),ce=G.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ce!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ce).add(n.object.position):(Yh.origin.copy(n.object.position),Yh.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Yh.direction))<x2?t.lookAt(n.target):(bg.setFromNormalAndCoplanarPoint(n.object.up,n.target),Yh.intersectPlane(bg,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),re=!0);return h=1,T=!1,re||nt.distanceToSquared(n.object.position)>a||8*(1-dt.dot(n.object.quaternion))>a||jt.distanceToSquared(n.target)>0?(n.dispatchEvent(vg),nt.copy(n.object.position),dt.copy(n.object.quaternion),jt.copy(n.target),!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",we),n.domElement.removeEventListener("pointerdown",be),n.domElement.removeEventListener("pointercancel",I),n.domElement.removeEventListener("lostpointercapture",I),n.domElement.removeEventListener("wheel",de),n.domElement.removeEventListener("pointermove",F),n.domElement.removeEventListener("pointerup",I),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ue),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new nr,c=new nr,h=1,u=new W,f=new fe,g=new fe,d=new fe,y=new fe,v=new fe,p=new fe,x=new fe,A=new fe,M=new fe,L=new W,R=new fe,T=!1,N=[],K={};function C(G){return G!==null?2*Math.PI/60*n.autoRotateSpeed*G:2*Math.PI/60/60*n.autoRotateSpeed}function w(G){let oe=Math.abs(G)/(100*Math.max(1,window.devicePixelRatio||1));return Math.pow(.95,n.zoomSpeed*oe)}function it(G){c.theta-=G}function mt(G){c.phi-=G}let Kt=(function(){let G=new W;return function(ve,nt){G.setFromMatrixColumn(nt,0),G.multiplyScalar(-ve),u.add(G)}})(),Q=(function(){let G=new W;return function(ve,nt){n.screenSpacePanning===!0?G.setFromMatrixColumn(nt,1):(G.setFromMatrixColumn(nt,0),G.crossVectors(n.object.up,G)),G.multiplyScalar(ve),u.add(G)}})(),lt=(function(){let G=new W;return function(ve,nt){let dt=n.domElement;if(n.object.isPerspectiveCamera){let jt=n.object.position;G.copy(jt).sub(n.target);let te=G.length();te*=Math.tan(n.object.fov/2*Math.PI/180),Kt(2*ve*te/dt.clientHeight,n.object.matrix),Q(2*nt*te/dt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(Kt(ve*(n.object.right-n.object.left)/n.object.zoom/dt.clientWidth,n.object.matrix),Q(nt*(n.object.top-n.object.bottom)/n.object.zoom/dt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function bt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Wt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Zt(G,oe){if(!n.zoomToCursor)return;T=!0;let ve=n.domElement.getBoundingClientRect(),nt=G-ve.left,dt=oe-ve.top,jt=ve.width,te=ve.height;R.x=nt/jt*2-1,R.y=-(dt/te)*2+1,L.set(R.x,R.y,1).unproject(n.object).sub(n.object.position).normalize()}function At(G){return Math.max(n.minDistance,Math.min(n.maxDistance,G))}function Yt(G){f.set(G.clientX,G.clientY)}function le(G){Zt(G.clientX,G.clientY),x.set(G.clientX,G.clientY)}function Me(G){y.set(G.clientX,G.clientY)}function Rt(G){g.set(G.clientX,G.clientY),d.subVectors(g,f).multiplyScalar(n.rotateSpeed);let oe=n.domElement;it(2*Math.PI*d.x/oe.clientHeight),mt(2*Math.PI*d.y/oe.clientHeight),f.copy(g),n.update()}function Ft(G){A.set(G.clientX,G.clientY),M.subVectors(A,x),M.y>0?bt(w(M.y)):M.y<0&&Wt(w(M.y)),x.copy(A),n.update()}function ye(G){v.set(G.clientX,G.clientY),p.subVectors(v,y).multiplyScalar(n.panSpeed),lt(p.x,p.y),y.copy(v),n.update()}function Re(G){Zt(G.clientX,G.clientY),G.deltaY<0?Wt(w(G.deltaY)):G.deltaY>0&&bt(w(G.deltaY)),n.update()}function Le(G){let oe=!1;switch(G.code){case n.keys.UP:G.ctrlKey||G.metaKey||G.shiftKey?mt(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(0,n.keyPanSpeed),oe=!0;break;case n.keys.BOTTOM:G.ctrlKey||G.metaKey||G.shiftKey?mt(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(0,-n.keyPanSpeed),oe=!0;break;case n.keys.LEFT:G.ctrlKey||G.metaKey||G.shiftKey?it(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(n.keyPanSpeed,0),oe=!0;break;case n.keys.RIGHT:G.ctrlKey||G.metaKey||G.shiftKey?it(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(-n.keyPanSpeed,0),oe=!0;break}oe&&(G.preventDefault(),n.update())}function Xe(G){if(N.length===1)f.set(G.pageX,G.pageY);else{let oe=gn(G),ve=.5*(G.pageX+oe.x),nt=.5*(G.pageY+oe.y);f.set(ve,nt)}}function Ze(G){if(N.length===1)y.set(G.pageX,G.pageY);else{let oe=gn(G),ve=.5*(G.pageX+oe.x),nt=.5*(G.pageY+oe.y);y.set(ve,nt)}}function De(G){let oe=gn(G),ve=G.pageX-oe.x,nt=G.pageY-oe.y,dt=Math.sqrt(ve*ve+nt*nt);x.set(0,dt)}function Be(G){n.enableZoom&&De(G),n.enablePan&&Ze(G)}function tt(G){n.enableZoom&&De(G),n.enableRotate&&Xe(G)}function Se(G){if(N.length==1)g.set(G.pageX,G.pageY);else{let ve=gn(G),nt=.5*(G.pageX+ve.x),dt=.5*(G.pageY+ve.y);g.set(nt,dt)}d.subVectors(g,f).multiplyScalar(n.rotateSpeed);let oe=n.domElement;it(2*Math.PI*d.x/oe.clientHeight),mt(2*Math.PI*d.y/oe.clientHeight),f.copy(g)}function ct(G){if(N.length===1)v.set(G.pageX,G.pageY);else{let oe=gn(G),ve=.5*(G.pageX+oe.x),nt=.5*(G.pageY+oe.y);v.set(ve,nt)}p.subVectors(v,y).multiplyScalar(n.panSpeed),lt(p.x,p.y),y.copy(v)}function _e(G){let oe=gn(G),ve=G.pageX-oe.x,nt=G.pageY-oe.y,dt=Math.sqrt(ve*ve+nt*nt);if(A.set(0,dt),dt<1||x.y<1){x.copy(A);return}M.set(0,Math.pow(A.y/x.y,n.zoomSpeed)),bt(M.y),x.copy(A);let jt=(G.pageX+oe.x)*.5,te=(G.pageY+oe.y)*.5;Zt(jt,te)}function Jt(G){n.enableZoom&&_e(G),n.enablePan&&ct(G)}function ke(G){n.enableZoom&&_e(G),n.enableRotate&&Se(G)}function be(G){n.enabled!==!1&&(N.length===0&&(n.domElement.setPointerCapture(G.pointerId),n.domElement.addEventListener("pointermove",F),n.domElement.addEventListener("pointerup",I)),Je(G),G.pointerType==="touch"?We(G):_t(G))}function F(G){n.enabled!==!1&&(G.pointerType==="touch"?qt(G):xe(G))}function I(G){if(!N.includes(G.pointerId))return;nn(G),N.length===0&&((!n.domElement.hasPointerCapture||n.domElement.hasPointerCapture(G.pointerId))&&n.domElement.releasePointerCapture(G.pointerId),n.domElement.removeEventListener("pointermove",F),n.domElement.removeEventListener("pointerup",I)),n.dispatchEvent(Mg),r=s.NONE;let oe=K[N[0]];oe&&We({pointerId:N[0],pageX:oe.x,pageY:oe.y})}function _t(G){let oe;switch(G.button){case 0:oe=n.mouseButtons.LEFT;break;case 1:oe=n.mouseButtons.MIDDLE;break;case 2:oe=n.mouseButtons.RIGHT;break;default:oe=-1}switch(oe){case Oo.DOLLY:if(n.enableZoom===!1)return;le(G),r=s.DOLLY;break;case Oo.ROTATE:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enablePan===!1)return;Me(G),r=s.PAN}else{if(n.enableRotate===!1)return;Yt(G),r=s.ROTATE}break;case Oo.PAN:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enableRotate===!1)return;Yt(G),r=s.ROTATE}else{if(n.enablePan===!1)return;Me(G),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Dd)}function xe(G){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Rt(G);break;case s.DOLLY:if(n.enableZoom===!1)return;Ft(G);break;case s.PAN:if(n.enablePan===!1)return;ye(G);break}}function de(G){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(G.preventDefault(),n.dispatchEvent(Dd),Re(G),n.dispatchEvent(Mg))}function ue(G){n.enabled===!1||n.enablePan===!1||Le(G)}function We(G){switch(pe(G),N.length){case 1:switch(n.touches.ONE){case Fo.ROTATE:if(n.enableRotate===!1)return;Xe(G),r=s.TOUCH_ROTATE;break;case Fo.PAN:if(n.enablePan===!1)return;Ze(G),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Fo.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Be(G),r=s.TOUCH_DOLLY_PAN;break;case Fo.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;tt(G),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Dd)}function qt(G){switch(pe(G),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Se(G),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;ct(G),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Jt(G),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ke(G),n.update();break;default:r=s.NONE}}function we(G){n.enabled!==!1&&G.preventDefault()}function Je(G){N.push(G.pointerId)}function nn(G){delete K[G.pointerId];for(let oe=0;oe<N.length;oe++)if(N[oe]==G.pointerId){N.splice(oe,1);return}}function pe(G){let oe=K[G.pointerId];oe===void 0&&(oe=new fe,K[G.pointerId]=oe),oe.set(G.pageX,G.pageY)}function gn(G){let oe=G.pointerId===N[0]?N[1]:N[0];return K[oe]}n.domElement.addEventListener("contextmenu",we),n.domElement.addEventListener("pointerdown",be),n.domElement.addEventListener("pointercancel",I),n.domElement.addEventListener("lostpointercapture",I),n.domElement.addEventListener("wheel",de,{passive:!1}),this.update()}};function Sg(i,t,e){let n=new $h(i,t),s=n.update.bind(n),r=new Set,a=null,o=()=>{a?.gesture||(a&&(a.gesture=!0),n.dispatchEvent({type:"gesturestart"}))};n.stopMotion=()=>{let h=i.position.clone(),u=n.target.clone(),f=n.enableDamping;n.enableDamping=!1,s(),i.position.copy(h),n.target.copy(u),n.enableDamping=f,s()},t.addEventListener("pointerdown",h=>{r.size||(a={id:h.pointerId,x:h.clientX,y:h.clientY,time:h.timeStamp,primary:h.button===0,tolerance:h.pointerType==="mouse"?5:8,label:h.target.closest?.(".maplabel button"),moved:!1,multiple:!1}),r.add(h.pointerId),t.setPointerCapture(h.pointerId),a&&r.size>1&&(a.multiple=!0,o())}),t.addEventListener("pointermove",h=>{a&&a.id===h.pointerId&&Math.hypot(h.clientX-a.x,h.clientY-a.y)>=a.tolerance&&(a.moved=!0,o())}),t.addEventListener("pointerup",h=>{let u=r.has(h.pointerId)&&r.size===1&&a&&a.id===h.pointerId&&a.primary&&!a.multiple&&!a.moved&&h.timeStamp-a.time<550&&Math.hypot(h.clientX-a.x,h.clientY-a.y)<a.tolerance,f=a?.label;r.delete(h.pointerId),r.size||(a=null),u&&(f?f.isConnected&&f.click():e(h))});let c=h=>{r.delete(h.pointerId)&&(a=null)};return t.addEventListener("pointercancel",c),t.addEventListener("lostpointercapture",c),t.addEventListener("wheel",o,{passive:!0,capture:!0}),t.addEventListener("click",h=>{(h.detail>0||h.pointerType)&&h.target.closest?.(".maplabel button")&&(h.preventDefault(),h.stopPropagation())},!0),n}function Eg(i,t,{now:e=()=>performance.now(),reducedMotion:n=!1}={}){let s=null,r=()=>{s=null};function a(c,h=1200,u=null,f=0){if(r(),t.stopMotion?.(),s={from:i.position.clone(),targetFrom:t.target.clone(),pos:c.pos.clone(),target:c.target.clone(),start:e(),duration:n?0:h,onDone:u,arrivalDelay:n?0:f,orbit:!!c.orbit},s.orbit){s.fromOrbit=new nr().setFromVector3(s.from.clone().sub(s.targetFrom)),s.toOrbit=new nr().setFromVector3(s.pos.clone().sub(s.target));let g=s.toOrbit.theta-s.fromOrbit.theta;s.toOrbit.theta=s.fromOrbit.theta+Math.atan2(Math.sin(g),Math.cos(g))}s.duration||o(s.start)}function o(c){if(!s)return!1;let h=s,u=h.duration?Math.max(0,Math.min(1,(c-h.start)/h.duration)):1,f=u<.5?4*u*u*u:1-(-2*u+2)**3/2;if(t.target.lerpVectors(h.targetFrom,h.target,f),h.orbit){let g=h.fromOrbit,d=h.toOrbit,y=(v,p)=>v+(p-v)*f;i.position.copy(new W().setFromSpherical(new nr(y(g.radius,d.radius),y(g.phi,d.phi),y(g.theta,d.theta)))).add(t.target)}else i.position.lerpVectors(h.from,h.pos,f),i.position.y+=Math.sin(u*Math.PI)*Math.min(180,h.from.distanceTo(h.pos)*.12);return u===1&&c>=h.start+h.duration+h.arrivalDelay&&(s=null,h.onDone?.()),!0}return{move:a,update:o,cancel:r,get active(){return!!s},get destination(){return s}}}function wg(i,t,{width:e,depth:n,heightAt:s,cellSize:r=20,clearance:a=8,isCut:o=()=>!1,automatic:c=()=>!1}){let h=t.update.bind(t),u=new W,f=new W,g=new W,d=new Map,y=t.domElement,v=(R,T)=>Math.abs(R)<=e/2&&Math.abs(T)<=n/2,p=(R,T,N)=>Math.max(T,Math.min(N,R));t.minDistance=10,t.maxDistance=12500,t.minPolarAngle=Math.PI/180,t.maxPolarAngle=Math.PI*.482,t.screenSpacePanning=!1,t.zoomToCursor=!0;function x(R,T){if(T.y>=-1e-5)return null;let N=0,K=t.maxDistance;for(let[mt,Kt]of[["x",e],["z",n]])if(Math.abs(T[mt])<1e-8){if(Math.abs(R[mt])>Kt/2)return null}else{let Q=(-Kt/2-R[mt])/T[mt],lt=(Kt/2-R[mt])/T[mt];N=Math.max(N,Math.min(Q,lt)),K=Math.min(K,Math.max(Q,lt))}if(K<=N)return null;let C=mt=>R.y+T.y*mt-s(R.x+T.x*mt,R.z+T.z*mt);if(C(N)<=0)return null;let w=Math.max(1,Math.ceil((K-N)*Math.hypot(T.x,T.z)/(r/2))),it=N;for(let mt=1;mt<=w;mt++){let Kt=N+(K-N)*mt/w;if(C(Kt)<=0){for(let Q=0;Q<14;Q++){let lt=(it+Kt)/2;C(lt)>0?it=lt:Kt=lt}return R.clone().addScaledVector(T,(it+Kt)/2)}it=Kt}return null}function A(R=!0){let T=t.target,N=i.position,K=p(T.x,-e/2,e/2)-T.x,C=p(T.z,-n/2,n/2)-T.z;if(T.x+=K,T.z+=C,N.x+=K,N.z+=C,R&&Math.abs(T.y-s(T.x,T.z))>.03){u.copy(T).sub(N).normalize();let it=x(N,u);it&&it.distanceTo(N)>=t.minDistance&&T.copy(it),T.y=s(T.x,T.z)}g.copy(N).sub(T);let w=g.length();(w<t.minDistance||w>t.maxDistance)&&(w<1e-8&&g.set(0,1,0),N.copy(T).add(g.setLength(p(w,t.minDistance,t.maxDistance)))),v(N.x,N.z)&&!o(N.x,N.z)&&(N.y=Math.max(N.y,s(N.x,N.z)+a)),i.lookAt(T),i.updateMatrixWorld()}t.update=(...R)=>{f.copy(i.position);let T=h(...R);return A(!c()),T||f.distanceToSquared(i.position)>1e-10};function M(R,T){let N=y.getBoundingClientRect();i.updateMatrixWorld(),u.set((R-N.left)/N.width*2-1,1-(T-N.top)/N.height*2,1).unproject(i).sub(i.position).normalize(),t.zoomToCursor=!!x(i.position,u)}y.addEventListener("wheel",R=>M(R.clientX,R.clientY),{capture:!0,passive:!0});for(let R of["pointerdown","pointermove"])y.addEventListener(R,T=>{if(R==="pointerdown"&&T.pointerType==="mouse"&&T.button===1&&M(T.clientX,T.clientY),T.pointerType==="touch"&&!(R==="pointermove"&&!d.has(T.pointerId))&&(d.set(T.pointerId,{x:T.clientX,y:T.clientY}),d.size===2)){let[N,K]=[...d.values()];M((N.x+K.x)/2,(N.y+K.y)/2)}},{capture:!0,passive:!0});for(let R of["pointerup","pointercancel","lostpointercapture"])y.addEventListener(R,T=>d.delete(T.pointerId),!0);function L({base:R,scale:T=1,heading:N,polar:K}={}){R||A();let C=(R?.target||t.target).clone();g.copy(R?.pos||i.position).sub(C);let w=new nr().setFromVector3(g);return w.radius=p(w.radius*T,t.minDistance,t.maxDistance),N!==void 0&&(w.theta=-N),K!==void 0&&(w.phi=p(K,t.minPolarAngle,t.maxPolarAngle)),{target:C,pos:new W().setFromSpherical(w).add(C),orbit:!0}}return{pose:L,constrain:A,groundPoint:x}}var Bo=class extends vi{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new fe(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof Element&&e.element.parentNode!==null&&e.element.parentNode.removeChild(e.element)})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}},Na=new W,Tg=new Nn,Ag=new Nn,Rg=new W,Cg=new W,Zh=class{constructor(t={}){let e=this,n,s,r,a,o={objects:new WeakMap},c=t.element!==void 0?t.element:document.createElement("div");c.style.overflow="hidden",this.domElement=c,this.getSize=function(){return{width:n,height:s}},this.render=function(d,y){d.matrixWorldAutoUpdate===!0&&d.updateMatrixWorld(),y.parent===null&&y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),Tg.copy(y.matrixWorldInverse),Ag.multiplyMatrices(y.projectionMatrix,Tg),h(d,d,y),g(d)},this.setSize=function(d,y){n=d,s=y,r=n/2,a=s/2,c.style.width=d+"px",c.style.height=y+"px"};function h(d,y,v){if(d.isCSS2DObject){Na.setFromMatrixPosition(d.matrixWorld),Na.applyMatrix4(Ag);let p=d.visible===!0&&Na.z>=-1&&Na.z<=1&&d.layers.test(v.layers)===!0;if(d.element.style.display=p===!0?"":"none",p===!0){d.onBeforeRender(e,y,v);let A=d.element;A.style.transform="translate("+-100*d.center.x+"%,"+-100*d.center.y+"%)translate("+(Na.x*r+r)+"px,"+(-Na.y*a+a)+"px)",A.parentNode!==c&&c.appendChild(A),d.onAfterRender(e,y,v)}let x={distanceToCameraSquared:u(v,d)};o.objects.set(d,x)}for(let p=0,x=d.children.length;p<x;p++)h(d.children[p],y,v)}function u(d,y){return Rg.setFromMatrixPosition(d.matrixWorld),Cg.setFromMatrixPosition(y.matrixWorld),Rg.distanceToSquared(Cg)}function f(d){let y=[];return d.traverse(function(v){v.isCSS2DObject&&y.push(v)}),y}function g(d){let y=f(d).sort(function(p,x){if(p.renderOrder!==x.renderOrder)return x.renderOrder-p.renderOrder;let A=o.objects.get(p).distanceToCameraSquared,M=o.objects.get(x).distanceToCameraSquared;return A-M}),v=y.length;for(let p=0,x=y.length;p<x;p++)y[p].element.style.zIndex=v-p}}};function Pg(){let i=document.querySelector("#gesture-tour"),t=document.querySelector("#help-open"),e=document.querySelector("#tour-skip"),n=[...i.querySelectorAll(".tour-step")],s=[...i.querySelectorAll(".tour-progress i")],r=matchMedia("(prefers-reduced-motion:reduce)"),a=[],o;function c(){a.forEach(clearTimeout),a=[],cancelAnimationFrame(o)}function h(g){n.forEach((d,y)=>{d.classList.toggle("active",y===g),d.setAttribute("aria-hidden",String(y!==g)),s[y].classList.toggle("active",y===g)})}function u(){c(),i.classList.remove("show"),i.contains(document.activeElement)&&t.focus({preventScroll:!0}),a.push(setTimeout(()=>{i.hidden=!0},r.matches?0:600))}function f(){c(),i.classList.remove("show"),n.forEach(g=>g.classList.remove("active")),i.hidden=!1,i.offsetWidth,h(0),o=requestAnimationFrame(()=>i.classList.add("show")),a.push(setTimeout(()=>h(1),3800)),a.push(setTimeout(()=>h(2),6500)),a.push(setTimeout(u,9300))}return t.addEventListener("click",f),e.addEventListener("click",u),document.addEventListener("keydown",g=>{g.key==="Escape"&&!i.hidden&&u()}),document.addEventListener("pointerdown",g=>{!i.hidden&&g.target instanceof Element&&!g.target.closest("#gesture-tour,#help-open")&&u()},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.hidden&&u()}),{start:f,stop:u}}var Lg=new es,Jh=new W,Oa=class extends Fh{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new en(t,3)),this.setAttribute("uv",new en(e,2))}applyMatrix4(t){let e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new No(e,6,1);return this.setAttribute("instanceStart",new tr(n,3,0)),this.setAttribute("instanceEnd",new tr(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new No(e,6,1);return this.setAttribute("instanceColorStart",new tr(n,3,0)),this.setAttribute("instanceColorEnd",new tr(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Ph(t.geometry)),this}fromLineSegments(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Lg.setFromBufferAttribute(e),this.boundingBox.union(Lg))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ys),this.boundingBox===null&&this.computeBoundingBox();let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Jh.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Jh)),Jh.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Jh));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}};Ae.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new fe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};rs.line={uniforms:Wh.merge([Ae.common,Ae.fog,Ae.line]),vertexShader:`
		#include <common>
		#include <color_pars_vertex>
		#include <fog_pars_vertex>
		#include <logdepthbuf_pars_vertex>
		#include <clipping_planes_pars_vertex>

		uniform float linewidth;
		uniform vec2 resolution;

		attribute vec3 instanceStart;
		attribute vec3 instanceEnd;

		attribute vec3 instanceColorStart;
		attribute vec3 instanceColorEnd;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#ifdef USE_DASH

			uniform float dashScale;
			attribute float instanceDistanceStart;
			attribute float instanceDistanceEnd;
			varying float vLineDistance;

		#endif

		void trimSegment( const in vec4 start, inout vec4 end ) {

			// trim end segment so it terminates between the camera plane and the near plane

			// conservative estimate of the near plane
			float a = projectionMatrix[ 2 ][ 2 ]; // 3nd entry in 3th column
			float b = projectionMatrix[ 3 ][ 2 ]; // 3nd entry in 4th column
			float nearEstimate = - 0.5 * b / a;

			float alpha = ( nearEstimate - start.z ) / ( end.z - start.z );

			end.xyz = mix( start.xyz, end.xyz, alpha );

		}

		void main() {

			#ifdef USE_COLOR

				vColor.xyz = ( position.y < 0.5 ) ? instanceColorStart : instanceColorEnd;

			#endif

			#ifdef USE_DASH

				vLineDistance = ( position.y < 0.5 ) ? dashScale * instanceDistanceStart : dashScale * instanceDistanceEnd;
				vUv = uv;

			#endif

			float aspect = resolution.x / resolution.y;

			// camera space
			vec4 start = modelViewMatrix * vec4( instanceStart, 1.0 );
			vec4 end = modelViewMatrix * vec4( instanceEnd, 1.0 );

			#ifdef WORLD_UNITS

				worldStart = start.xyz;
				worldEnd = end.xyz;

			#else

				vUv = uv;

			#endif

			// special case for perspective projection, and segments that terminate either in, or behind, the camera plane
			// clearly the gpu firmware has a way of addressing this issue when projecting into ndc space
			// but we need to perform ndc-space calculations in the shader, so we must address this issue directly
			// perhaps there is a more elegant solution -- WestLangley

			bool perspective = ( projectionMatrix[ 2 ][ 3 ] == - 1.0 ); // 4th entry in the 3rd column

			if ( perspective ) {

				if ( start.z < 0.0 && end.z >= 0.0 ) {

					trimSegment( start, end );

				} else if ( end.z < 0.0 && start.z >= 0.0 ) {

					trimSegment( end, start );

				}

			}

			// clip space
			vec4 clipStart = projectionMatrix * start;
			vec4 clipEnd = projectionMatrix * end;

			// ndc space
			vec3 ndcStart = clipStart.xyz / clipStart.w;
			vec3 ndcEnd = clipEnd.xyz / clipEnd.w;

			// direction
			vec2 dir = ndcEnd.xy - ndcStart.xy;

			// account for clip-space aspect ratio
			dir.x *= aspect;
			dir = normalize( dir );

			#ifdef WORLD_UNITS

				vec3 worldDir = normalize( end.xyz - start.xyz );
				vec3 tmpFwd = normalize( mix( start.xyz, end.xyz, 0.5 ) );
				vec3 worldUp = normalize( cross( worldDir, tmpFwd ) );
				vec3 worldFwd = cross( worldDir, worldUp );
				worldPos = position.y < 0.5 ? start: end;

				// height offset
				float hw = linewidth * 0.5;
				worldPos.xyz += position.x < 0.0 ? hw * worldUp : - hw * worldUp;

				// don't extend the line if we're rendering dashes because we
				// won't be rendering the endcaps
				#ifndef USE_DASH

					// cap extension
					worldPos.xyz += position.y < 0.5 ? - hw * worldDir : hw * worldDir;

					// add width to the box
					worldPos.xyz += worldFwd * hw;

					// endcaps
					if ( position.y > 1.0 || position.y < 0.0 ) {

						worldPos.xyz -= worldFwd * 2.0 * hw;

					}

				#endif

				// project the worldpos
				vec4 clip = projectionMatrix * worldPos;

				// shift the depth of the projected points so the line
				// segments overlap neatly
				vec3 clipPose = ( position.y < 0.5 ) ? ndcStart : ndcEnd;
				clip.z = clipPose.z * clip.w;

			#else

				vec2 offset = vec2( dir.y, - dir.x );
				// undo aspect ratio adjustment
				dir.x /= aspect;
				offset.x /= aspect;

				// sign flip
				if ( position.x < 0.0 ) offset *= - 1.0;

				// endcaps
				if ( position.y < 0.0 ) {

					offset += - dir;

				} else if ( position.y > 1.0 ) {

					offset += dir;

				}

				// adjust for linewidth
				offset *= linewidth;

				// adjust for clip-space to screen-space conversion // maybe resolution should be based on viewport ...
				offset /= resolution.y;

				// select end
				vec4 clip = ( position.y < 0.5 ) ? clipStart : clipEnd;

				// back to clip space
				offset *= clip.w;

				clip.xy += offset;

			#endif

			gl_Position = clip;

			vec4 mvPosition = ( position.y < 0.5 ) ? start : end; // this is an approximation

			#include <logdepthbuf_vertex>
			#include <clipping_planes_vertex>
			#include <fog_vertex>

		}
		`,fragmentShader:`
		uniform vec3 diffuse;
		uniform float opacity;
		uniform float linewidth;

		#ifdef USE_DASH

			uniform float dashOffset;
			uniform float dashSize;
			uniform float gapSize;

		#endif

		varying float vLineDistance;

		#ifdef WORLD_UNITS

			varying vec4 worldPos;
			varying vec3 worldStart;
			varying vec3 worldEnd;

			#ifdef USE_DASH

				varying vec2 vUv;

			#endif

		#else

			varying vec2 vUv;

		#endif

		#include <common>
		#include <color_pars_fragment>
		#include <fog_pars_fragment>
		#include <logdepthbuf_pars_fragment>
		#include <clipping_planes_pars_fragment>

		vec2 closestLineToLine(vec3 p1, vec3 p2, vec3 p3, vec3 p4) {

			float mua;
			float mub;

			vec3 p13 = p1 - p3;
			vec3 p43 = p4 - p3;

			vec3 p21 = p2 - p1;

			float d1343 = dot( p13, p43 );
			float d4321 = dot( p43, p21 );
			float d1321 = dot( p13, p21 );
			float d4343 = dot( p43, p43 );
			float d2121 = dot( p21, p21 );

			float denom = d2121 * d4343 - d4321 * d4321;

			float numer = d1343 * d4321 - d1321 * d4343;

			mua = numer / denom;
			mua = clamp( mua, 0.0, 1.0 );
			mub = ( d1343 + d4321 * ( mua ) ) / d4343;
			mub = clamp( mub, 0.0, 1.0 );

			return vec2( mua, mub );

		}

		void main() {

			#include <clipping_planes_fragment>

			#ifdef USE_DASH

				if ( vUv.y < - 1.0 || vUv.y > 1.0 ) discard; // discard endcaps

				if ( mod( vLineDistance + dashOffset, dashSize + gapSize ) > dashSize ) discard; // todo - FIX

			#endif

			float alpha = opacity;

			#ifdef WORLD_UNITS

				// Find the closest points on the view ray and the line segment
				vec3 rayEnd = normalize( worldPos.xyz ) * 1e5;
				vec3 lineDir = worldEnd - worldStart;
				vec2 params = closestLineToLine( worldStart, worldEnd, vec3( 0.0, 0.0, 0.0 ), rayEnd );

				vec3 p1 = worldStart + lineDir * params.x;
				vec3 p2 = rayEnd * params.y;
				vec3 delta = p1 - p2;
				float len = length( delta );
				float norm = len / linewidth;

				#ifndef USE_DASH

					#ifdef USE_ALPHA_TO_COVERAGE

						float dnorm = fwidth( norm );
						alpha = 1.0 - smoothstep( 0.5 - dnorm, 0.5 + dnorm, norm );

					#else

						if ( norm > 0.5 ) {

							discard;

						}

					#endif

				#endif

			#else

				#ifdef USE_ALPHA_TO_COVERAGE

					// artifacts appear on some hardware if a derivative is taken within a conditional
					float a = vUv.x;
					float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
					float len2 = a * a + b * b;
					float dlen = fwidth( len2 );

					if ( abs( vUv.y ) > 1.0 ) {

						alpha = 1.0 - smoothstep( 1.0 - dlen, 1.0 + dlen, len2 );

					}

				#else

					if ( abs( vUv.y ) > 1.0 ) {

						float a = vUv.x;
						float b = ( vUv.y > 0.0 ) ? vUv.y - 1.0 : vUv.y + 1.0;
						float len2 = a * a + b * b;

						if ( len2 > 1.0 ) discard;

					}

				#endif

			#endif

			vec4 diffuseColor = vec4( diffuse, alpha );

			#include <logdepthbuf_fragment>
			#include <color_fragment>

			gl_FragColor = vec4( diffuseColor.rgb, alpha );

			#include <tonemapping_fragment>
			#include <colorspace_fragment>
			#include <fog_fragment>
			#include <premultiplied_alpha_fragment>

		}
		`};var ao=class extends Qs{constructor(t){super({type:"LineMaterial",uniforms:Wh.clone(rs.line.uniforms),vertexShader:rs.line.vertexShader,fragmentShader:rs.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}};var Ig=new W,Dg=new W,qi=new Fn,Yi=new Fn,yr=new Fn,Ud=new W,Nd=new Nn,$i=new zh,Ug=new W,jh=new es,Kh=new ys,_r=new Fn,vr,zo;function Ng(i,t,e){return _r.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),_r.multiplyScalar(1/_r.w),_r.x=zo/e.width,_r.y=zo/e.height,_r.applyMatrix4(i.projectionMatrixInverse),_r.multiplyScalar(1/_r.w),Math.abs(Math.max(_r.x,_r.y))}function y2(i,t){let e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,c=a;o<c;o++){$i.start.fromBufferAttribute(s,o),$i.end.fromBufferAttribute(r,o),$i.applyMatrix4(e);let h=new W,u=new W;vr.distanceSqToSegment($i.start,$i.end,u,h),u.distanceTo(h)<zo*.5&&t.push({point:u,pointOnLine:h,distance:vr.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function _2(i,t,e){let n=t.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,c=o.attributes.instanceStart,h=o.attributes.instanceEnd,u=Math.min(o.instanceCount,c.count),f=-t.near;vr.at(1,yr),yr.w=1,yr.applyMatrix4(t.matrixWorldInverse),yr.applyMatrix4(n),yr.multiplyScalar(1/yr.w),yr.x*=r.x/2,yr.y*=r.y/2,yr.z=0,Ud.copy(yr),Nd.multiplyMatrices(t.matrixWorldInverse,a);for(let g=0,d=u;g<d;g++){if(qi.fromBufferAttribute(c,g),Yi.fromBufferAttribute(h,g),qi.w=1,Yi.w=1,qi.applyMatrix4(Nd),Yi.applyMatrix4(Nd),qi.z>f&&Yi.z>f)continue;if(qi.z>f){let M=qi.z-Yi.z,L=(qi.z-f)/M;qi.lerp(Yi,L)}else if(Yi.z>f){let M=Yi.z-qi.z,L=(Yi.z-f)/M;Yi.lerp(qi,L)}qi.applyMatrix4(n),Yi.applyMatrix4(n),qi.multiplyScalar(1/qi.w),Yi.multiplyScalar(1/Yi.w),qi.x*=r.x/2,qi.y*=r.y/2,Yi.x*=r.x/2,Yi.y*=r.y/2,$i.start.copy(qi),$i.start.z=0,$i.end.copy(Yi),$i.end.z=0;let v=$i.closestPointToPointParameter(Ud,!0);$i.at(v,Ug);let p=Gh.lerp(qi.z,Yi.z,v),x=p>=-1&&p<=1,A=Ud.distanceTo(Ug)<zo*.5;if(x&&A){$i.start.fromBufferAttribute(c,g),$i.end.fromBufferAttribute(h,g),$i.start.applyMatrix4(a),$i.end.applyMatrix4(a);let M=new W,L=new W;vr.distanceSqToSegment($i.start,$i.end,L,M),e.push({point:L,pointOnLine:M,distance:vr.origin.distanceTo(L),object:i,face:null,faceIndex:g,uv:null,uv1:null})}}}var Qh=class extends Ke{constructor(t=new Oa,e=new ao({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let a=0,o=0,c=e.count;a<c;a++,o+=2)Ig.fromBufferAttribute(e,a),Dg.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Ig.distanceTo(Dg);let r=new No(s,2,1);return t.setAttribute("instanceDistanceStart",new tr(r,1,0)),t.setAttribute("instanceDistanceEnd",new tr(r,1,1)),this}raycast(t,e){let n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;vr=t.ray;let a=this.matrixWorld,o=this.geometry,c=this.material;zo=c.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),Kh.copy(o.boundingSphere).applyMatrix4(a);let h;if(n)h=zo*.5;else{let f=Math.max(s.near,Kh.distanceToPoint(vr.origin));h=Ng(s,f,c.resolution)}if(Kh.radius+=h,vr.intersectsSphere(Kh)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),jh.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=zo*.5;else{let f=Math.max(s.near,jh.distanceToPoint(vr.origin));u=Ng(s,f,c.resolution)}jh.expandByScalar(u),vr.intersectsBox(jh)!==!1&&(n?y2(this,e):_2(this,s,e))}};var Fa=class extends Oa{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setPositions(n),this}setColors(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setColors(n),this}fromLine(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}};var tu=class extends Qh{constructor(t=new Fa,e=new ao({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}};function lo(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,c=new Ln,h=0;for(let u=0;u<i.length;++u){let f=i[u],g=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),g++}if(g!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;c.addGroup(h,d,u),h+=d}}if(e){let u=0,f=[];for(let g=0;g<i.length;++g){let d=i[g].index;for(let y=0;y<d.count;++y)f.push(d.getX(y)+u);u+=i[g].attributes.position.count}c.setIndex(f)}for(let u in r){let f=Og(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;c.setAttribute(u,f)}for(let u in a){let f=a[u][0].length;if(f===0)break;c.morphAttributes=c.morphAttributes||{},c.morphAttributes[u]=[];for(let g=0;g<f;++g){let d=[];for(let v=0;v<a[u].length;++v)d.push(a[u][v][g]);let y=Og(d);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;c.morphAttributes[u].push(y)}}return c}function Og(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){let u=i[h];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}let a=new t(r),o=0;for(let h=0;h<i.length;++h)a.set(i[h].array,o),o+=i[h].array.length;let c=new $n(a,e,n);return s!==void 0&&(c.gpuType=s),c}function Fg(i,t=1e-4){t=Math.max(t,Number.EPSILON);let e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),c={},h={},u=[],f=["getX","getY","getZ","getW"],g=["setX","setY","setZ","setW"];for(let A=0,M=o.length;A<M;A++){let L=o[A],R=i.attributes[L];c[L]=new $n(new R.array.constructor(R.count*R.itemSize),R.itemSize,R.normalized);let T=i.morphAttributes[L];T&&(h[L]=new $n(new T.array.constructor(T.count*T.itemSize),T.itemSize,T.normalized))}let d=t*.5,y=Math.log10(1/t),v=Math.pow(10,y),p=d*v;for(let A=0;A<r;A++){let M=n?n.getX(A):A,L="";for(let R=0,T=o.length;R<T;R++){let N=o[R],K=i.getAttribute(N),C=K.itemSize;for(let w=0;w<C;w++)L+=`${~~(K[f[w]](M)*v+p)},`}if(L in e)u.push(e[L]);else{for(let R=0,T=o.length;R<T;R++){let N=o[R],K=i.getAttribute(N),C=i.morphAttributes[N],w=K.itemSize,it=c[N],mt=h[N];for(let Kt=0;Kt<w;Kt++){let Q=f[Kt],lt=g[Kt];if(it[lt](a,K[Q](M)),C)for(let bt=0,Wt=C.length;bt<Wt;bt++)mt[bt][lt](a,C[bt][Q](M))}}e[L]=a,u.push(a),a++}}let x=i.clone();for(let A in i.attributes){let M=c[A];if(x.setAttribute(A,new $n(M.array.slice(0,a*M.itemSize),M.itemSize,M.normalized)),A in h)for(let L=0;L<h[A].length;L++){let R=h[A][L];x.morphAttributes[A][L]=new $n(R.array.slice(0,a*R.itemSize),R.itemSize,R.normalized)}}return x.setIndex(u),x}var Od=new W(-.4,.85,.35).normalize();function eu(i,t,e=0,n=0,s=0){let r=i.index?i.toNonIndexed():i;r.deleteAttribute("uv"),r.translate(e,n,s),r.computeVertexNormals();let a=new fn(t),o=r.attributes.normal,c=new Float32Array(o.count*3);for(let h=0;h<o.count;h++){let u=.62+.38*Math.max(0,o.getX(h)*Od.x+o.getY(h)*Od.y+o.getZ(h)*Od.z);c[h*3]=a.r*u,c[h*3+1]=a.g*u,c[h*3+2]=a.b*u}return r.deleteAttribute("normal"),r.setAttribute("color",new $n(c,3)),r}var ni=(i,t,e,n,s,r,a)=>eu(new Ci(i,t,e),n,s,r,a),Bg="#e2862b",v2="#f0c8a0",M2="#3b4a63",b2="#7c5b3c",zg="#f3e6c4",ko="#466266",Hg="#943f2d",Vg="#eee8d8",kg="#2e6fd0",S2="#7a4fc9",Fd="#26282a";function E2(i){let t=new Pn;t.add(new Ke(lo([ni(.3,.36,.19,Bg,0,.64,0),ni(.22,.27,.1,b2,0,.66,.14),ni(.08,.33,.1,"#d27a22",-.195,.625,0),ni(.08,.33,.1,"#d27a22",.195,.625,0),eu(new Xi(.115,8,6),v2,0,.91,0),eu(new Wi(.17,.17,.025,10),zg,0,.975,0),eu(new Wi(.09,.11,.08,10),zg,0,1.02,0)]),i));let e=s=>{let r=new Ke(ni(.11,.44,.13,M2,0,-.22,0),i);return r.position.set(s,.46,0),t.add(r),r},n=[e(-.075),e(.075)];return{group:t,px:34,real:1.65,base:[Bg,1,1],box:[-.32,-1.12,.32,.22],swing(s){n[0].rotation.x=s*.55,n[1].rotation.x=-s*.55}}}function w2(i){let t=new Pn;return t.add(new Ke(lo([ni(.34,.27,1,kg,0,.195,0),ni(.352,.1,.8,ko,0,.255,.04),ni(.3,.11,.02,ko,0,.25,-.505),ni(.26,.09,.02,ko,0,.26,.505),ni(.351,.025,.98,"#f7f5ee",0,.13,0),ni(.28,.03,.86,"#d9e6f7",0,.345,.02),ni(.36,.1,.14,Fd,0,.06,-.32),ni(.36,.1,.14,Fd,0,.06,.32),ni(.05,.03,.01,"#ffe9a8",-.11,.12,-.505),ni(.05,.03,.01,"#ffe9a8",.11,.12,-.505)]),i)),{group:t,px:64,real:11,base:[kg,1.05,1.55],pitch:!0,box:[-.55,-.5,.55,.28]}}function T2(i){let t=new Pn;return t.add(new Ke(lo([ni(.3,.3,.8,Vg,0,.21,0),ni(.312,.12,.7,ko,0,.25,0),ni(.26,.1,.012,ko,0,.25,-.405),ni(.26,.1,.012,ko,0,.25,.405),ni(.32,.05,.84,Hg,0,.385,0),ni(.24,.06,.6,Fd,0,.03,0)]),i)),{group:t,px:64,real:13,base:[S2,.95,1.3],pitch:!0,box:[-.5,-.55,.5,.28]}}function A2(i){let t=new Pn;return t.add(new Ke(lo([ni(.12,.07,.2,"#3e514c",0,-.035,0),ni(.035,.24,.035,"#594937",0,-.19,0),ni(.44,.38,.38,Hg,0,-.5,0),ni(.452,.14,.392,ko,0,-.46,0),ni(.36,.04,.32,Vg,0,-.29,0)]),i)),{group:t,px:76,real:3.8,box:[-.3,-.12,.3,.72]}}function Gg(i){let t=new Pn;t.visible=!1,t.renderOrder=1e6,i.add(t);let e=new os({vertexColors:!0,transparent:!0,fog:!1,toneMapped:!1}),n=new os({vertexColors:!0,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}),s=(p,x,A)=>{let M=new fn(x),L=p.attributes.position.count,R=new Float32Array(L*4);for(let T=0;T<L;T++)R.set([M.r,M.g,M.b,A],T*4);return p.deleteAttribute("uv"),p.deleteAttribute("normal"),p.setAttribute("color",new $n(R,4)),p},r=([p,x,A])=>new Ke(lo([s(new wh(.34,24),p,.32),s(new Ah(.34,.42,24),"#ffffff",.92)]).rotateX(-Math.PI/2).scale(x,1,A).translate(0,.005,0),n),a={walk:E2(e),bus:w2(e),funicular:T2(e),cable:A2(e)};for(let p of Object.values(a))p.group.rotation.order="YXZ",p.group.visible=!1,t.add(p.group),p.base&&p.group.add(r(p.base));let o=-1,c=p=>{let x=p.info.render.frame;x!==o&&(o=x,p.state.buffers.depth.setMask(!0),p.clearDepth())};t.traverse(p=>{p.isGroup?p.renderOrder=1e6:p.isMesh&&(p.onBeforeRender=c,p.renderOrder=p.material===e?1:0)});let h=null,u=0,f=null,g=0,d=0,y=0,v=new W;return{get visible(){return t.visible},get mode(){return h},show(p,x){p!==h&&(h&&(a[h].group.visible=!1),h=p,a[h].group.visible=!0,t.visible=!0,u=x)},hide(){h&&(a[h].group.visible=!1),t.visible=!1,h=null,f=null,d=0},update(p,x,A,M,L,R,T){if(!h)return;let N=a[h],K=Math.min(1,(L-u)/320),C=K<1?.35+.65*(1+2.2*(K-1)**3+1.2*(K-1)**2):1,w=Math.max(N.real,N.px/T);if(y=w*T,t.position.copy(p),t.scale.setScalar(w*C),x!==null)if(f===null)f=x;else{let it=Math.atan2(Math.sin(x-f),Math.cos(x-f));f+=it*Math.min(1,R*10)}d+=((M?1:0)-d)*Math.min(1,R*8),M&&(g+=R*Math.PI*2*2.3),N.group.rotation.set(N.pitch?Math.max(-.5,Math.min(.5,A)):0,-(f??0),h==="cable"?Math.sin(L/320)*.05*d:0),N.swing?.(Math.sin(g)*d)},screenBox(p,x,A){if(!t.visible||!h||(v.copy(t.position).project(p),v.z<-1||v.z>1))return null;let M=(v.x+1)/2*x,L=(1-v.y)/2*A,R=a[h].box,T=y;return[M+R[0]*T,L+R[1]*T,M+R[2]*T,L+R[3]*T]}}}var Wg={walk:{name:"\u6B65\u884C",color:"#e2862b"},funicular:{name:"\u7F06\u8F66",color:"#7a4fc9"},cable:{name:"\u7D22\u9053",color:"#7a4fc9"},bus:{name:"\u666F\u4EA4\u8F66",color:"#2e6fd0"}},Bd={walk:1,funicular:1.3,cable:1.6,bus:2.5},R2={walk:1,funicular:1.3,cable:1.6,bus:2.4},C2='<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-7.5L14 16v5M8 12l2-4.5 3-.5 2.5 3.5L18 11M10.5 7.8 9 13"/></svg>',P2='<svg viewBox="0 0 24 24"><path d="M3 5.5 21 3M12 4.3V8M6.5 8h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16.5v-7A1.5 1.5 0 0 1 6.5 8zM5 12.5h14"/></svg>',L2='<svg viewBox="0 0 24 24"><rect x="4.5" y="3.5" width="15" height="15" rx="2.5"/><path d="M4.5 11h15M8 18.5V21M16 18.5V21"/><circle cx="8.5" cy="15" r=".9"/><circle cx="15.5" cy="15" r=".9"/></svg>',zd='<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>',Xg='<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',I2='<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',Ba=i=>i>=1e3?`${(i/1e3).toFixed(1)} \u516C\u91CC`:`${Math.round(i/10)*10} \u7C73`;function je(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function qg(i){let{routes:t,world:e,camera:n,controls:s,hAt:r,realH:a=nt=>nt,fly:o,pose:c,cancelFlight:h,openPanel:u,closeSheetsForRoute:f,onFrame:g,isMobile:d,visibleRect:y}=i,v=document.querySelector("#route-list"),p=document.querySelector("#route-detail"),x=document.querySelector("#route-hud"),A=x.querySelector(".rh-stops"),M=x.querySelector(".rh-bar i"),L=new Pn;L.renderOrder=5,e.add(L);let R=[],T=null,N=[],K=[],C=null,w=null,it=-1,mt=null,Kt=()=>{clearTimeout(mt),mt=null};function Q(nt){let dt=nt.pts,jt=[],te=nt.mode==="cable"?22:2.6,ee=r(...dt[0])+te,ht=r(...dt.at(-1))+te,V=0,Lt=[];for(let re=1;re<dt.length;re++){let ce=Math.hypot(dt[re][0]-dt[re-1][0],dt[re][1]-dt[re-1][1]);Lt.push(ce),V+=ce}let zt=0;for(let re=0;re<dt.length;re++)if(re>0){let[ce,Ue]=dt[re-1],[Qt,Ne]=dt[re],He=Lt[re-1],Oe=Math.max(1,Math.ceil(He/6));for(let sn=1;sn<=Oe;sn++){let hn=sn/Oe,pn=ce+(Qt-ce)*hn,Rn=Ue+(Ne-Ue)*hn,Tn=zt+He*hn,Bn=r(pn,Rn)+2.6,ci=nt.mode==="cable"?Math.max(Bn+12,ee+(ht-ee)*(Tn/V)):Bn;jt.push(new W(pn,ci,Rn))}zt+=He}else jt.push(new W(dt[0][0],nt.mode==="cable"?ee:r(...dt[0])+2.6,dt[0][1]));return jt}function lt(nt,dt,jt,te={}){let ee=new Fa;ee.setPositions(nt.flatMap(Lt=>[Lt.x,Lt.y,Lt.z]));let ht=new ao({color:dt,linewidth:jt,transparent:!0,opacity:te.opacity??1,depthTest:te.depthTest??!0,depthWrite:!1,dashed:!!te.dashed,dashSize:9,gapSize:7});ht.resolution.set(innerWidth,innerHeight),R.push(ht);let V=new tu(ee,ht);return te.dashed&&V.computeLineDistances(),V.renderOrder=te.order??5,V.frustumCulled=!1,L.add(V),V}addEventListener("resize",()=>{for(let nt of R)nt.resolution.set(innerWidth,innerHeight)});function bt(nt){Wt();let dt=[];nt.legs.forEach((ee,ht)=>ee.parts.forEach(V=>{let Lt=Wg[V.mode].color,zt=V.mode!=="walk",re=V.segments||[{pts:V.pts,estimated:!1}];for(let ce of re){let Ue=Q({...V,pts:ce.pts}),Qt=ce.estimated,Ne={dashed:zt||Qt};lt(Ue,Lt,4,{...Ne,depthTest:!1,opacity:.38,order:4}),lt(Ue,"#ffffff",8.5,{...Ne,order:5}),lt(Ue,Lt,5,{...Ne,opacity:Qt?.75:1,order:6});for(let He of Ue)dt.push({p:He,mode:V.mode,leg:ht})}}));let jt=new Map;nt.stops.forEach((ee,ht)=>{jt.has(ee.place)||jt.set(ee.place,{s:ee,idx:[]}),jt.get(ee.place).idx.push(ht)});let te=nt.stops.length-1;for(let{s:ee,idx:ht}of jt.values()){let V=je("div","maplabel route-stop"+(ht.includes(0)?" start":ht.includes(te)?" end":"")),Lt=je("button"),zt=je("span","rs-name",ee.n);Lt.type="button",Lt.title=ee.n,Lt.tabIndex=-1,Lt.append(je("span","rs-num"+(ht.length>1?" multi":""),ht.map(Ue=>Ue+1).join("\xB7")),zt),Lt.onclick=()=>De(ht[0]);let re=je("i");V.append(Lt,re);let ce=new Bo(V);ce.center.set(.5,1),ce.position.set(ee.x,r(ee.x,ee.z)+9,ee.z),L.add(ce);for(let Ue of ht)N[Ue]=V;K.push({box:V,b:Lt,name:zt,stem:re,label:ce,lift:0,rank:ht.includes(0)||ht.includes(te)?1:2+ht[0]/100})}Zt="",C=ye(nt,dt),document.body.classList.add("route-on")}function Wt(){for(let nt of[...L.children])L.remove(nt),nt.isLine2&&(nt.geometry.dispose(),nt.material.dispose()),nt.isCSS2DObject&&nt.element.remove();R.length=0,N=[],K=[],C=null,document.body.classList.remove("route-on")}let Zt="",At=0,Yt=null,le=[],Me=-1e9,Rt=new W;function Ft(nt){if(!K.length)return!1;n.updateMatrixWorld();let dt=n.matrixWorld.elements.map(Qt=>Qt.toFixed(1)).join()+n.projectionMatrix.elements.join()+innerWidth+"x"+innerHeight+":"+it+":"+(tt.mode??"");if(dt===Zt&&nt-At<500)return!1;(!Yt||nt-Me>=500)&&(Yt=y(),le=i.covers?.()??[],Me=nt),Zt=dt,At=nt;let jt=Yt,te=innerWidth,ee=innerHeight,ht=[],V=[],Lt=N[it],zt=(Qt,Ne)=>Ne.some(He=>Qt[0]<He[2]&&Qt[2]>He[0]&&Qt[1]<He[3]&&Qt[3]>He[1]),re=(Qt,Ne)=>[Qt[0]+Ne,Qt[1]+Ne,Qt[2]-Ne,Qt[3]-Ne],ce=[...K].sort((Qt,Ne)=>(Ne.box===Lt)-(Qt.box===Lt)||Qt.rank-Ne.rank),Ue=tt.screenBox(n,te,ee);Ue&&ht.push(Ue);for(let Qt of ce){!Qt.bh&&Qt.b.offsetHeight&&(Qt.bw=Qt.b.offsetWidth,Qt.bh=Qt.b.offsetHeight,Qt.h=Qt.box.offsetHeight-Qt.lift,Qt.nw=Qt.name.offsetWidth,Qt.nh=Qt.name.offsetHeight),Qt.label.getWorldPosition(Rt).project(n),Qt.on=Rt.z>-1&&Rt.z<1;let Ne=Qt.bw||26,He=Qt.bh||26,Oe=(Rt.x+1)/2*te,sn=(1-Rt.y)/2*ee-(Qt.h||36)+He/2,hn=Rn=>[Oe-Ne/2,sn-Rn-He/2,Oe+Ne/2,sn-Rn+He/2],pn=0;if(Qt.on){let Rn=hn(0),Tn=ht.filter(ci=>zt(re(Rn,6),[ci])),Bn=Tn.length?Math.max(...Tn.map(ci=>Rn[3]-ci[1]+2)):0;Bn&&Bn<=2*He+6&&hn(Bn)[1]>=jt.top&&!zt(re(hn(Bn),4),ht)&&!zt(hn(Bn),le)&&(pn=Math.round(Bn))}Qt.dot=hn(pn),Qt.on&&ht.push(Qt.dot),Qt.stemBox=Qt.on?[Oe-4,Qt.dot[3],Oe+4,(1-Rt.y)/2*ee+5]:null,Qt.stemBox&&V.push(Qt.stemBox),pn!==Qt.lift&&(Qt.lift=pn,Qt.stem.style.height=pn?`${10+pn}px`:""),Qt.box.classList.toggle("veiled",!!Ue&&Qt.on&&zt([Oe-4,Qt.dot[3],Oe+4,(1-Rt.y)/2*ee+6],[Ue]))}for(let Qt of ce){let Ne=0;if(Qt.on){let He=Qt.nw||[...Qt.name.textContent].length*12+20,Oe=Qt.nh||22,[sn,hn,pn,Rn]=Qt.dot,Tn=(hn+Rn)/2,Bn=[[pn+3,Tn-Oe/2,pn+3+He,Tn+Oe/2],[sn-3-He,Tn-Oe/2,sn-3,Tn+Oe/2]],ci=xn=>xn[0]>=jt.left+4&&xn[2]<=jt.right-4&&xn[1]>=jt.top+2&&xn[3]<=jt.bottom-2,ks=V.filter(xn=>xn!==Qt.stemBox),ls=xn=>ci(xn)&&!zt(xn,le),In=Bn.findIndex(xn=>ls(xn)&&!zt(xn,ht)&&!zt(xn,ks));In<0&&Qt.box===Lt&&(In=Bn.findIndex(xn=>ls(xn)&&!(Ue&&zt(xn,[Ue]))),In<0&&(In=Bn.findIndex(ls)),In<0&&(In=Bn.findIndex(ci)),In<0&&(In=Math.max(0,Bn.findIndex(xn=>xn[0]>=0&&xn[2]<=te)))),In>=0&&(Ne=In?-1:1,ht.push(Bn[In]))}Qt.box.classList.toggle("named",Ne!==0),Qt.box.classList.toggle("flip",Ne===-1)}return!0}function ye(nt,dt){let jt=[],te=[],ee=[],ht=0;dt.forEach((re,ce)=>{ce&&(ht+=re.p.distanceTo(dt[ce-1].p)/Bd[re.mode]),jt.push(re.p),te.push(ht),ee.push(re.mode)});let V=nt.stops.map((re,ce)=>{if(ce===0)return 0;let Ue=0,Qt=1/0,Ne=dt.findLastIndex(He=>He.leg===ce-1);for(let He=Math.max(0,Ne-40);He<=Ne;He++){let Oe=Math.hypot(jt[He].x-re.x,jt[He].z-re.z);Oe<Qt&&(Qt=Oe,Ue=He)}return te[Ue]}),Lt=nt.legs.map((re,ce)=>te[dt.findLastIndex(Ue=>Ue.leg===ce)]),zt=[];for(let re=1;re<dt.length;re++)dt[re].mode!==dt[re-1].mode&&dt[re].leg===dt[re-1].leg&&zt.push(te[re-1]);return{pts:jt,cum:te,modes:ee,total:ht,stopAt:V,legEnd:Lt,switches:zt}}function Re(nt,dt){let{pts:jt,cum:te}=nt,ee=0,ht=te.length-1;if(dt<=0)return jt[0].clone();if(dt>=te[ht])return jt[ht].clone();for(;ht-ee>1;){let Lt=ee+ht>>1;te[Lt]<=dt?ee=Lt:ht=Lt}let V=(dt-te[ee])/Math.max(1e-6,te[ht]-te[ee]);return jt[ee].clone().lerp(jt[ht],V)}function Le(nt,dt){let{cum:jt,modes:te}=nt,ee=0,ht=jt.length-1;if(dt>=jt[ht])return te[ht];for(;ht-ee>1;){let V=ee+ht>>1;jt[V]<=dt?ee=V:ht=V}return te[ht]}function Xe(nt){let dt=[];nt.legs.forEach(In=>In.parts.forEach(xn=>xn.pts.forEach(([Hs,z],xt)=>{(xt%3===0||xt===xn.pts.length-1)&&dt.push([Hs,z,8,0,0])}))),nt.stops.forEach(In=>dt.push([In.x,In.z,9,15,38]));let jt=dt.length,te=dt.reduce((In,xn)=>In+xn[0],0)/jt,ee=dt.reduce((In,xn)=>In+xn[1],0)/jt,ht=0,V=0,Lt=0;for(let[In,xn]of dt)ht+=(In-te)**2,V+=(xn-ee)**2,Lt+=(In-te)*(xn-ee);let zt=Math.atan2(2*Lt,ht-V)/2*180/Math.PI;for(;zt-25>90;)zt-=180;for(;25-zt>90;)zt+=180;let re=52,ce=y(),Ue=innerWidth,Qt=innerHeight,Ne=22,He=16,Oe={w:ce.right-ce.left,h:ce.bottom-ce.top},sn=(ce.left+ce.right)/2+ce.shiftX,hn=(ce.top+ce.bottom)/2+ce.shiftY,pn=new Gi(43,Ue/Qt,1,6e4),Rn=new W,Tn=new W,Bn=new W,ci=te,ks=ee,ls=1600;for(let In=0;In<30;In++){let xn=c(ci,ks,ls,zt,re);pn.position.copy(xn.pos),pn.lookAt(xn.target),pn.updateMatrixWorld();let Hs=1/0,z=-1/0,xt=1/0,Ct=-1/0;for(let[on,dn,un,an,Vn]of dt){Rn.set(on,(r(on,dn)+un)*e.scale.y,dn).project(pn);let Si=(Rn.x+1)/2*Ue,hi=(1-Rn.y)/2*Qt;Hs=Math.min(Hs,Si-an),z=Math.max(z,Si+an),xt=Math.min(xt,hi-Vn),Ct=Math.max(Ct,hi)}let Ot=Math.max((z-Hs)/Math.max(80,Oe.w-2*Ne),(Ct-xt)/Math.max(60,Oe.h-2*He)),Pt=2*ls*Math.tan(43*Math.PI/360)/Qt,Ie=(Hs+z)/2-sn,$e=(xt+Ct)/2-hn;Tn.setFromMatrixColumn(pn.matrixWorld,0).setY(0).normalize(),Bn.setFromMatrixColumn(pn.matrixWorld,2).negate().setY(0).normalize();let Qe=Pt/Math.cos(re*Math.PI/180);if(ci+=(Tn.x*Ie*Pt-Bn.x*$e*Qe)*.85,ks+=(Tn.z*Ie*Pt-Bn.z*$e*Qe)*.85,ls=Math.min(12e3,Math.max(250,ls*Math.min(1.8,Math.max(.55,Ot)))),Math.abs(Ot-1)<.01&&Math.abs(Ie)<2&&Math.abs($e)<2)break}return c(ci,ks,ls*1.06,zt,re)}function Ze(){if(ke(),!T)return;let nt=Xe(T);o(nt,1500)}function De(nt){if(!T)return;ke();let dt=T.stops[nt];o(c(dt.x,dt.z,T.id==="tiantai-classic"?420:260,25,55),1300),Be(nt)}function Be(nt){it=nt;for(let dt of new Set(N))dt.classList.toggle("active",dt===N[nt]);p.querySelectorAll(".rs-stop").forEach(dt=>dt.classList.toggle("active",+dt.dataset.i===nt)),ve()}let tt=Gg(i.scene??e.parent??e),Se={walk:"\u6B65\u884C",bus:"\u4E58\u666F\u4EA4\u8F66",funicular:"\u4E58\u7F06\u8F66",cable:"\u4E58\u7D22\u9053"},ct={bus:"\u666F\u4EA4\u8F66",funicular:"\u7F06\u8F66",cable:"\u7D22\u9053"},_e=(nt,dt)=>dt==="walk"?`\u4E0B${nt==="bus"?"\u8F66":ct[nt]}\u6B65\u884C`:nt==="walk"?`\u4E58${ct[dt]}`:`\u6362\u4E58${ct[dt]}`;function Jt(){if(!T||!C)return;Kt(),h(),f(),s.stopMotion?.();let nt=Math.min(50,Math.max(22,C.total/90)),dt=T.id==="tiantai-classic"?430:250;w??={s:0,speed:C.total/nt,pause:1.2,stop:0,heading:null,dist:dt,camDist:dt},w.paused=!1,Be(w.stop),ve()}function ke(){Kt(),!(!w||w.paused)&&(w.paused=!0,ve())}function be(nt){if(w.pause>0)w.pause-=nt,w.pause<=0&&(w.switching=!1);else{let Oe=w.s,sn=w.stop+1,hn=sn<C.stopAt.length?C.stopAt[sn]:1/0,pn=Math.min(C.total,Oe+w.speed*nt),Rn=C.switches.find(Tn=>Tn>Oe&&Tn<=pn&&Tn<hn);Rn!==void 0?(pn=Rn,w.pause=.8,w.switching=!0):pn>=hn&&(pn=hn,w.stop=sn,w.pause=1.1),w.s=pn,w.stop===sn&&Be(sn)}let dt=Le(C,w.s),jt=Bd[dt];w.camDist+=(w.dist*R2[F()]-w.camDist)*Math.min(1,nt*.7);let te=w.camDist/w.dist,ee=Re(C,w.s),ht=Re(C,w.s+Math.min(160*(w.speed/90),400*te/jt)),V=Math.atan2(ht.x-ee.x,-(ht.z-ee.z));w.heading===null&&(w.heading=V);let Lt=V-w.heading;Lt=Math.atan2(Math.sin(Lt),Math.cos(Lt)),w.heading+=Lt*Math.min(1,nt*1.6/te);let zt=ee.y*e.scale.y,re=57*Math.PI/180,ce=w.camDist,Ue=new W(ee.x,zt,ee.z),Qt=Ue.clone().add(new W(-Math.sin(w.heading)*ce*Math.sin(re),ce*Math.cos(re),Math.cos(w.heading)*ce*Math.sin(re))),Ne=Math.min(1,nt*3.2*jt/te);s.target.lerp(Ue,Ne),n.position.lerp(Qt,Ne);let He=w.pause<=0&&w.stop+1<C.stopAt.length;He!==w.moving&&(w.moving=He,He&&(w.swapped=!1),ve()),oe(w.s/C.total),w.s>=C.total&&w.pause<=0&&(w=null,Be(-1),ve(!0),mt=setTimeout(()=>{mt=null,u("routes"),p.scrollTop=0,Ze()},400))}function F(){let nt=w.stop,dt=T.legs[nt];return dt&&nt>0&&w.s<=C.legEnd[nt-1]?dt.parts[0].mode:Le(C,w.s)}let I=new W;function _t(nt,dt){let jt=F();jt!==w.mode&&(w.fromMode=w.mode,w.mode=jt,w.swapped=!!w.fromMode,tt.show(jt,nt),ve());let te=Re(C,w.s),ee=r(te.x,te.z);I.set(te.x,(jt==="cable"?Math.max(te.y,ee+20):ee+2.6)*e.scale.y,te.z);let ht=10/Bd[jt],V=Re(C,Math.max(0,w.s-ht)),Lt=Re(C,Math.min(C.total,w.s+ht)),zt=Math.hypot(Lt.x-V.x,Lt.z-V.z),re=zt>1?Math.atan2(Lt.x-V.x,-(Lt.z-V.z)):null,ce=zt>1?Math.atan2((Lt.y-V.y)*e.scale.y,zt):0,Ue=innerHeight/(2*Math.max(1,n.position.distanceTo(I))*Math.tan(43*Math.PI/360));tt.update(I,re,ce,!w.paused&&w.pause<=0,nt,dt,Ue)}g((nt,dt)=>{if(!w||!C){tt.visible&&tt.hide();return}let jt=Math.min(dt,64)/1e3;w.paused||be(jt),w&&_t(nt,jt)}),s.addEventListener("gesturestart",ke);function xe(nt){let dt=je("button","route-card"+(nt.featured?" featured":""));return dt.type="button",dt.append(je("span","rc-by",nt.by),je("strong","",nt.name),je("span","rc-meta",`${nt.duration} \xB7 \u6B65\u884C ${Ba(nt.walkM)} \xB7 \u722C\u5347 ${nt.climb} \u7C73`)),nt.fit&&dt.append(je("span","rc-fit","\u9002\u5408\uFF1A"+nt.fit)),dt.append(je("span","rc-path",nt.stops.map(jt=>jt.n).filter((jt,te,ee)=>ee.indexOf(jt)===te).join(" \u2192 "))),dt.onclick=()=>Je(nt.id),dt}function de(){v.replaceChildren(...t.map(xe))}function ue(nt){let dt=[],jt=[],te=[],ee=0;nt.legs.forEach((Oe,sn)=>{te.push({s:ee,i:sn}),Oe.parts.forEach(hn=>{if(hn.mode==="bus")return;let pn=Q(hn);pn.forEach((Rn,Tn)=>{(Tn||!dt.length)&&(dt.length&&(ee+=Math.hypot(Rn.x-pn[Math.max(0,Tn-1)].x,Rn.z-pn[Math.max(0,Tn-1)].z)),dt.push(ee),jt.push(a(Rn.y-2.6)))})})}),te.push({s:ee,i:nt.stops.length-1});let ht=300,V=64,Lt=Math.min(...jt),zt=Math.max(...jt),re=Math.max(40,zt-Lt),ce=Oe=>Oe/Math.max(1,ee)*ht,Ue=Oe=>V-6-(Oe-Lt)/re*(V-16),Qt=dt.map((Oe,sn)=>`${sn?"L":"M"}${ce(Oe).toFixed(1)} ${Ue(jt[sn]).toFixed(1)}`).join(""),Ne=`<svg viewBox="0 0 ${ht} ${V}" preserveAspectRatio="none" aria-hidden="true"><path class="pf-area" d="${Qt}L${ht} ${V}L0 ${V}Z"/><path class="pf-line" d="${Qt}"/>${te.map(Oe=>{let sn=dt.findIndex(pn=>pn>=Oe.s),hn=Ue(jt[Math.max(0,sn===-1?jt.length-1:sn)]);return`<circle cx="${ce(Oe.s).toFixed(1)}" cy="${hn.toFixed(1)}" r="3"/>`}).join("")}</svg>`,He=je("div","route-profile");return He.innerHTML=Ne,He.append(je("span","pf-hi",`${Math.round(zt)} \u7C73`),je("span","pf-lo",`${Math.round(Lt)} \u7C73`),je("span","pf-cap","\u6CBF\u9014\u6D77\u62D4")),He}function We(nt){let dt=nt.parts.map(ht=>ht.mode==="walk"?`\u6B65\u884C${nt.minutesBy!=="\u4F30\u7B97"&&nt.parts.length===1?"\u7EA6 "+nt.minutes:"\u7EA6 "+ht.minutes} \u5206\u949F \xB7 ${Ba(ht.m)}${ht.up>=15?` \xB7 \u4E0A\u5761 ${ht.up} \u7C73`:ht.down>=15?` \xB7 \u4E0B\u5761 ${ht.down} \u7C73`:""}`:ht.mode==="bus"?`\u5750${ht.line}\u7EA6 ${ht.minutes} \u5206\u949F \xB7 ${Ba(ht.m)}`:`\u5750${ht.line}\u7EA6 ${ht.minutes} \u5206\u949F`),jt=nt.parts.flatMap(ht=>ht.segments||[]).filter(ht=>ht.estimated).reduce((ht,V)=>ht+V.m,0),te=nt.parts.at(-1)?.segments?.at(-1),ee=te?.estimated?te.m:0;return dt.join("\uFF0C\u518D")+(jt>=1?` \xB7 \u542B\u7EA6 ${Ba(jt)}\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF08\u672A\u6838\u5B9E\u901A\u884C${ee>=10?`\uFF0C\u672B\u6BB5\u7EA6 ${Ba(ee)}`:""}\uFF09`:"")}function qt(nt){let dt=nt.parts.find(jt=>jt.mode!=="walk")?.mode;return dt==="bus"?L2:dt?P2:C2}function we(nt){p.replaceChildren();let dt=je("div","route-top"),jt=je("button","route-back","\u5168\u90E8\u8DEF\u7EBF");jt.type="button",jt.onclick=nn,dt.append(jt,je("span","rc-by",nt.by));let te=je("div","route-stats"),ee=nt.walkMinutes>=60?`\u7EA6 ${(nt.walkMinutes/60).toFixed(1)} \u5C0F\u65F6`:`\u7EA6 ${nt.walkMinutes} \u5206\u949F`;for(let[Ne,He]of[[nt.duration,"\u5168\u7A0B"],[Ba(nt.walkM),"\u6B65\u884C"],[ee,"\u6B65\u884C\u7528\u65F6"],[`${nt.climb} \u7C73`,"\u7D2F\u8BA1\u722C\u5347"]]){let Oe=je("span");Oe.append(je("b","",Ne),je("small","",He)),te.append(Oe)}let ht=je("div","route-actions"),V=je("button","btn primary route-play");V.type="button",V.innerHTML=zd,V.append("\u8DEF\u7EBF\u9884\u6F14"),V.onclick=()=>w&&!w.paused?ke():Jt();let Lt=je("button","btn ghost");Lt.type="button",Lt.innerHTML=I2,Lt.append("\u770B\u5168\u7A0B"),Lt.onclick=Ze,ht.append(V,Lt);let zt=je("ol","route-steps");nt.stops.forEach((Ne,He)=>{let Oe=je("li","rs-stop");Oe.dataset.i=He;let sn=je("button");sn.type="button",sn.onclick=()=>De(He),sn.append(je("span","rs-num",String(He+1)),je("strong","",Ne.n)),Ne.note&&sn.append(je("small","",Ne.note)),Oe.append(sn),zt.append(Oe);let hn=nt.legs[He];if(hn){let pn=je("li","rs-leg"),Rn=je("span","rs-icon");Rn.innerHTML=qt(hn);let Tn=je("span","rs-leg-text",We(hn));hn.note&&Tn.append(je("em","",hn.note)),pn.append(Rn,Tn),zt.append(pn)}});let re=je("ul","route-tips");for(let Ne of nt.tips)re.append(je("li","",Ne));let ce=je("details","more");ce.append(je("summary","","\u8D44\u6599\u4E0E\u4F9D\u636E")),ce.append(je("p","","\u7EBF\u8DEF\u6CBF\u5730\u56FE\u4E0A\u7684\u6B65\u9053\u3001\u53F0\u9636\u548C\u8857\u9053\u7ED8\u5236\uFF1B\u5730\u56FE\u7F3A\u5931\u5904\u3001\u70B9\u4F4D\u5230\u8DEF\u7F51\u3001\u7A7F\u8FC7\u5E7F\u573A\u548C\u5317\u95E8\u95E8\u697C\u7B49\u5F3A\u5236\u8FDE\u63A5\u6BB5\u6309\u76F4\u7EBF\u793A\u610F\uFF08\u865A\u7EBF\uFF09\uFF0C\u4E0D\u4EE3\u8868\u5B9E\u6D4B\u6216\u5DF2\u6838\u5B9E\u53EF\u901A\u884C\u9053\u8DEF\uFF0C\u8BF7\u4EE5\u73B0\u573A\u9053\u8DEF\u4E3A\u51C6\u3002\u6B65\u884C\u65F6\u95F4\u6309\u8DDD\u79BB\u548C\u5761\u5EA6\u4F30\u7B97\uFF08\u53F0\u9636\u7528\u65F6\u589E\u52A0\u4E09\u6210\uFF09\uFF0C\u6BCF\u4E2A\u4EBA\u5FEB\u6162\u4E0D\u540C\uFF1B\u6807\u201C\u4E1A\u4E3B\u63D0\u4F9B\u201D\u7684\u4E3A\u5C45\u4E4B\u6797\u4E1A\u4E3B\u7ED9\u51FA\u7684\u65F6\u95F4\u3002\u7F06\u8F66\u3001\u7D22\u9053\u548C\u666F\u4EA4\u8F66\u7684\u4E58\u5750\u65F6\u95F4\u6309\u7EBF\u8DEF\u957F\u5EA6\u4F30\u7B97\uFF0C\u4E0D\u542B\u6392\u961F\u3002\u5F00\u653E\u548C\u8FD0\u884C\u65F6\u95F4\u4EE5\u73B0\u573A\u516C\u793A\u4E3A\u51C6\u3002"));let Ue=je("div","links");for(let Ne of nt.sources)if(Ne.url){let He=je("a","",Ne.name);He.href=Ne.url,He.target="_blank",He.rel="noopener",Ue.append(He)}else Ue.append(je("span","",Ne.name));ce.append(Ue);let Qt=je("p","route-summary route-legend","\u6A59\u8272\u5B9E\u7EBF\uFF1A\u5730\u56FE\u6B65\u9053\uFF1B\u6A59\u8272\u865A\u7EBF\uFF1A\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF0C\u672A\u6838\u5B9E\u53EF\u901A\u884C\uFF1B\u84DD\uFF0F\u7D2B\u865A\u7EBF\uFF1A\u4E58\u8F66\u6BB5\uFF08\u5176\u4E2D\u76F4\u7EBF\u63A5\u9A73\u89C1\u884C\u7A0B\u63D0\u793A\uFF09\u3002");p.append(dt,je("h3","route-title",nt.name),te,ht,Qt,je("p","route-summary",nt.summary),ue(nt),zt,je("h4","","\u51FA\u53D1\u524D\u770B\u770B"),re,ce),p.scrollTop=0}function Je(nt){let dt=t.find(te=>te.id===nt);if(!dt)return;ke(),w=null,T=dt,it=-1,u("routes"),v.hidden=!0,p.hidden=!1,we(dt),bt(dt),gn(dt),G="",ve();let jt=Xe(dt);o(jt,1600),p.focus?.({preventScroll:!0})}function nn(){let nt=T,dt=p.contains(document.activeElement);ke(),h(),w=null,T=null,Wt(),A.replaceChildren(),p.hidden=!0,v.hidden=!1,ve(),dt&&nt&&v.children[t.indexOf(nt)]?.focus?.({preventScroll:!0})}function pe(nt){let dt=nt.parts.find(jt=>jt.mode!=="walk");return`${dt?Wg[dt.mode].name:"\u6B65\u884C"} ${nt.minutes} \u5206\u949F`}function gn(nt){A.replaceChildren(),nt.stops.forEach((dt,jt)=>{let te=je("li","rh-stop"+(jt===0?" start":jt===nt.stops.length-1?" end":""));te.dataset.i=jt;let ee=je("button");ee.type="button",ee.onclick=()=>De(jt),ee.append(je("span","rs-num",String(jt+1)),je("span","rh-name",dt.n)),te.append(ee),A.append(te);let ht=nt.legs[jt];if(ht){let V=je("li","rh-leg");V.dataset.i=jt;let Lt=je("span","rs-icon");Lt.innerHTML=qt(ht),V.append(Lt,je("span","",pe(ht))),A.append(V)}})}let G="";function oe(nt){M.style.transform=`scaleX(${Math.max(0,Math.min(1,nt)).toFixed(4)})`}function ve(nt){i.onPlaybackChange?.();let dt=!!w&&!w.paused,jt=dt?"\u6682\u505C\u9884\u6F14":w?"\u7EE7\u7EED\u9884\u6F14":"\u8DEF\u7EBF\u9884\u6F14",te=p.querySelector(".route-play");if(te&&(te.innerHTML=dt?Xg:zd,te.append(jt)),!T){x.hidden=!0;return}let ee=T.stops.length,ht=w?w.stop:it,V=!!w?.moving,Lt=T.stops[Math.max(0,ht)],zt=T.stops[ht+1];x.querySelector("b").textContent=T.short;let re=(Qt,Ne,He)=>{let Oe=je("span","rh-where",Qt),sn=Ne?He?[je("span","rh-note",Ne),Oe]:[Oe,je("span","rh-note",Ne)]:[Oe];w?.paused&&sn.unshift(je("span","rh-note","\u5DF2\u6682\u505C \xB7\xA0")),x.querySelector("small").replaceChildren(...sn)};w?V&&zt?re(`${Se[w.mode]??"\u6B63\u5728"}\u524D\u5F80 ${zt.n}`):w.switching&&zt?re(`\xA0\xB7 \u524D\u5F80 ${zt.n}`,_e(w.fromMode,w.mode),!0):re(ht===0?`\u4ECE ${Lt.n} \u51FA\u53D1`:`${ht+1}/${ee} \u5230\u8FBE ${Lt.n}`,w.swapped?`\xA0\xB7 ${_e(w.fromMode,w.mode)}`:""):re(ht>=0?`${ht+1}/${ee} \xB7 ${Lt.n}`:nt?"\u9884\u6F14\u5B8C\u6BD5 \xB7 \u53EF\u518D\u770B\u4E00\u6B21":`${ee} \u7AD9 \xB7 ${T.duration} \xB7 \u70B9 \u25B6 \u5F00\u59CB\u9884\u6F14`);let ce=x.querySelector(".rh-play");ce.innerHTML=dt?Xg:zd,ce.setAttribute("aria-label",jt),x.hidden=!1,x.classList.toggle("playing",dt),x.classList.toggle("live",!!w);for(let Qt of A.children){let Ne=+Qt.dataset.i,He=Qt.classList.contains("rh-stop");Qt.classList.toggle("done",!!nt||Ne<ht),He?(Qt.classList.toggle("current",Ne===ht),Qt.classList.toggle("next",!!w&&Ne===ht+1)):Qt.classList.toggle("moving",V&&Ne===ht)}oe(w?w.s/C.total:nt?1:ht>=0&&C?C.stopAt[ht]/C.total:0);let Ue=`${T.id}:${ht}:${!!w}`;if(Ue!==G&&x.offsetParent){G=Ue;let Qt=A.querySelector(`.rh-stop[data-i="${Math.max(0,ht)}"]`);if(Qt){let Ne=parseFloat(globalThis.getComputedStyle?.(A).paddingLeft??12);A.scrollTo?.({left:Math.max(0,Qt.offsetLeft-Ne),behavior:globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}}return x.querySelector(".rh-play").onclick=()=>w&&!w.paused?ke():Jt(),x.querySelector(".rh-list").onclick=()=>{ke(),u("routes")},x.querySelector(".rh-close").onclick=nn,addEventListener("keydown",nt=>{nt.key==="Escape"&&w&&ke()}),de(),{open:Je,close:nn,stopPreview:ke,startPreview:Jt,updateLabels:Ft,get labelObjects(){return K.map(nt=>nt.label)},get active(){return T},get previewing(){return!!w&&!w.paused},get canResume(){return!!w?.paused}}}var D2={\u53F2\u6599:"history",\u4FE1\u4EF0:"belief",\u4F20\u8BF4:"legend",\u5EFA\u7B51:"building",\u5730\u8C8C:"building",\u63D0\u793A:"tip"};function li(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function kd(i){return li("span","kind k-"+(D2[i]||"tip"),i)}var U2=i=>/^1\d{10}$/.test(i)?`${i.slice(0,3)} ${i.slice(3,7)} ${i.slice(7)}`:i;function N2(i){let t=li("p","guide-src");return t.append(li("span","","\u6765\u6E90\uFF1A")),i.forEach((e,n)=>{let s=li("a","",e.name);s.href=e.url,s.target="_blank",s.rel="noopener",t.append(s),n<i.length-1&&t.append("\uFF1B")}),t}function Yg(i){let t=li("dl","guide-rows");for(let[e,n]of i)t.append(li("dt","",e),li("dd","",n));return t}function $g(i,t){let e=i.guide;if(!e){t.replaceChildren(li("p","empty","\u6E38\u89C8\u987B\u77E5\u6682\u65F6\u6CA1\u6709\u52A0\u8F7D\uFF0C\u5237\u65B0\u9875\u9762\u518D\u8BD5\u3002"));return}t.replaceChildren(li("p","guide-intro",`\u51FA\u53D1\u524D\u770B\u770B \xB7 \u5B98\u65B9\u8D44\u6599 ${e.verified} \u6838\u9A8C`));for(let n of e.sections){let s=li("details","guide-sec"),r=li("summary"),a=li("div","guide-body");s.dataset.id=n.id,r.append(li("b","",n.title),li("small","",n.teaser)),s.append(r,a);for(let[o,c]of n.paras||[]){let h=li("p","story");h.append(kd(o),c),a.append(h)}if(n.rows?.length&&a.append(Yg(n.rows)),n.transitHours&&i.transit&&a.append(li("h4","","\u8FD0\u8425\u65F6\u95F4"),Yg([...i.transit.routes.map(o=>[o.name,o.hours]),...i.transit.cableways.map(o=>[o.name,o.hours+(o.phone?` \xB7 \u54A8\u8BE2 ${o.phone}`:"")])])),n.items?.length){let o=li("ul","guide-list");for(let c of n.items)o.append(li("li","",c));a.append(o)}if(n.phones?.length){let o=li("ul","guide-phones");for(let[c,h,u]of n.phones){let f=li("li"),g=li("span","nums");for(let d of h){let y=li("a","",U2(d));y.href="tel:"+d.replace(/\D/g,""),g.append(y)}f.append(li("span","who",c),g),u&&f.append(li("small","",u)),o.append(f)}a.append(o)}n.note&&a.append(li("p","guide-note",n.note)),n.sources?.length&&a.append(N2(n.sources)),t.append(s)}}function Zg(i,t){if(i?.model?.kind!=="entrance-checkpoint")return null;let[e,n]=i.model.front,s=Math.hypot(e,n),r=e/s,a=n/s,o=[i.x,i.z],c=t(...o)+.55,h=y=>(y=Math.max(0,Math.min(1,y)),y*y*(3-2*y)),u=(y,v)=>{let p=y-o[0],x=v-o[1];return[p*a-x*r,p*r+x*a]};return{origin:o,floor:c,fx:r,fz:a,local:u,world:(y,v)=>[o[0]+y*a+v*r,o[1]-y*r+v*a],outer:{x:18,z:14},height:(y,v,p)=>{if(Math.abs(y-o[0])>32||Math.abs(v-o[1])>32)return p;let[x,A]=u(y,v),M=(1-h((Math.abs(x)-10.3)/7.7))*(1-h((Math.abs(A)-6.2)/7.8));if(!M)return p;let L=c-.14-Math.min(.9,Math.max(0,A-2.7)*.45);return p+(L-p)*M},rotation:Math.atan2(r,a),viewAzimuth:Math.atan2(-r,a)*180/Math.PI}}function Jg(i,t,e,n,s){let r=[],a=[],o=[],c=i.outer.x*2,h=i.outer.z*2;for(let g=0;g<=h;g++)for(let d=0;d<=c;d++){let[y,v]=i.world(d-i.outer.x,g-i.outer.z);r.push(y,i.height(y,v,t(y,v)),v),a.push((y+e/2)/e,1-(v+n/2)/n)}for(let g=0;g<h;g++)for(let d=0;d<c;d++){let y=g*(c+1)+d,v=y+1,p=y+c+1,x=p+1;o.push(y,p,v,v,p,x)}let u=new Ln;u.setAttribute("position",new en(r,3)),u.setAttribute("uv",new en(a,2)),u.setIndex(o),u.computeVertexNormals();let f=new Ke(u,s);return f.receiveShadow=!0,f}function O2(){let i=document.createElement("canvas");i.width=1024,i.height=512;let t=i.getContext("2d");t.textAlign="center",t.textBaseline="middle",t.fillStyle="#ff322b",t.font='700 76px "PingFang SC",sans-serif',t.shadowColor="#ef1d16",t.shadowBlur=3,t.fillText("\u4E5D\u534E\u5C71\u98CE\u666F\u533A\u6B22\u8FCE\u60A8",512,48),t.shadowBlur=0,t.fillStyle="#d9cd8f",t.font='700 174px "Kaiti SC","STKaiti","Songti SC",serif',["\u4E5D","\u83EF","\u5C71"].forEach((n,s)=>t.fillText(n,s*224+112,208));let e=new as(i);return e.colorSpace=kn,e.anisotropy=4,new os({map:e,transparent:!0,alphaTest:.16,side:mn,toneMapped:!1})}function jg(i,t,{signs:e=!0}={}){let n=new Pn;n.position.set(i.origin[0],i.floor,i.origin[1]),n.rotation.y=i.rotation,n.userData.landmark="\u666F\u533A\u68C0\u7968\u53E3";let s=new Ci(1,1,1),r=t("#40332d"),a=t("#373c3a"),o=t("#b9b2a4"),c=t("#9caeae"),h=t("#192626"),u=t("#e5dfcb"),f=t("#658b90"),g=t("#205b9c"),d=(y,v,p,x,A,M,L)=>{let R=new Ke(s,L);return R.position.set(y,v+A/2,p),R.scale.set(x,A,M),R.castShadow=R.receiveShadow=!0,n.add(R),R};d(0,-.3,-.65,19.2,.3,7.5,o);for(let y=0;y<5;y++)d(0,-1.3,3.3+y*.4,19.2,1.3-(y+1)*.18,.4,o);d(0,-1.16,5.65,19.2,.15,1.1,o);for(let y of[-9.1,-4.2,4.2,9.1]){let v=Math.abs(y)<5?5.4:4.65;d(y,0,2.7,.7,.8,.7,o),d(y,.8,2.7,.46,v-.8,.46,r),d(y,0,-3.7,.38,3.9,.38,r)}d(0,3.85,-.5,18.8,.2,6.6,a);for(let[y,v,p]of[[0,9.6,5.4],[-6.9,5.7,4.65],[6.9,5.7,4.65]])d(y,p-.35,2.7,v-.6,.35,.5,r),d(y,p,2.8,v,.28,1.65,a);d(0,3.65,2.7,18.4,.23,.32,r),d(0,4.32,3.025,7.95,.93,.18,r),d(0,4.39,3.125,7.72,.78,.035,h);for(let y of[-2.85,0,2.85])d(y,5.68,2.7,.065,1.08,.065,h);for(let y of[-3.1,-1.1,.9,2.9])d(y,0,.35,.38,.98,1.55,c),d(y,.98,.35,.4,.1,1.6,h);for(let y of[-8.5,-5.6]){for(let v of[-3.1,-.6,1.9])d(y,0,v,.065,1.05,.065,h);d(y,1,-.6,.07,.085,5.2,h)}if(d(6.6,0,-.5,3.7,2.65,4.7,u),d(6.6,1.02,1.867,3.38,1.34,.04,f),d(4.73,1.02,-.5,.04,1.34,4.34,f),d(6.6,1,1.904,.09,1.4,.07,r),d(6.6,2.65,-.5,4,.19,4.95,a),d(5.55,0,2.35,.82,1.68,.6,g),d(5.55,1,2.66,.65,.48,.035,u),d(5.55,1.08,2.688,.44,.27,.018,h),e){let y=O2(),v=(p,x,A,M,L,R,T,N,K)=>{let C=new _s(M,L),w=C.attributes.uv;for(let mt=0;mt<w.count;mt++)w.setXY(mt,(R+w.getX(mt)*N)/1024,1-(T+(1-w.getY(mt))*K)/512);let it=new Ke(C,y);it.position.set(p,x,A),n.add(it)};v(0,4.8,3.152,7.35,.69,0,0,1024,96),[-2.85,0,2.85].forEach((p,x)=>v(p,6.55,2.74,1.85,1.85,x*224,112,224,208))}return n.userData.checkpoint={width:19.2,depth:10.65,height:7.5,steps:5,validators:4,approximateDimensions:!0},n}function Kg(i,{cellSize:t=400,enterDistance:e=2100,exitDistance:n=2500}={}){let s=i.geometry,r=s.attributes.position,a=s.index;if(Array.isArray(i.material)||s.groups.length||!r)return null;let o=a?a.count:r.count,c=new Map,h=new W;for(let y=0;y<o;y+=3){let v=a?a.getX(y):y,p=a?a.getX(y+1):y+1,x=a?a.getX(y+2):y+2,A=(r.getX(v)+r.getX(p)+r.getX(x))/3,M=(r.getZ(v)+r.getZ(p)+r.getZ(x))/3,L=Math.floor(A/t)+","+Math.floor(M/t),R=c.get(L);R||(R={indices:[],box:new es},c.set(L,R)),R.indices.push(v,p,x);for(let T of[v,p,x])R.box.expandByPoint(h.fromBufferAttribute(r,T))}let u=[];for(let{indices:y,box:v}of c.values()){let p=new Ln;for(let[L,R]of Object.entries(s.attributes))p.setAttribute(L,R);p.setIndex(y);let x=v.getCenter(new W),A=0;for(let L of y)A=Math.max(A,h.fromBufferAttribute(r,L).distanceToSquared(x));p.boundingBox=v,p.boundingSphere=new ys(x,Math.sqrt(A));let M=new Ke(p,i.material);M.castShadow=i.castShadow,M.receiveShadow=i.receiveShadow,M.renderOrder=i.renderOrder,M.layers.mask=i.layers.mask,M.matrixAutoUpdate=!1,M.visible=!1,M.raycast=()=>{},i.add(M),u.push(M)}let f={...s.drawRange},g=i.raycast;i.raycast=function(y,v){if(!this.visible)return;let{start:p,count:x}=s.drawRange;s.setDrawRange(f.start,f.count);try{g.call(this,y,v)}finally{s.setDrawRange(p,x)}};let d=!1;return{mesh:i,chunks:u,get near(){return d},update(y){let v=d?y<n:y<e;if(v===d)return!1;d=v,s.setDrawRange(f.start,d?0:f.count);for(let p of u)p.visible=d;return!0}}}function F2(i){let t=i.filter(s=>Number.isFinite(s)&&s>0).sort((s,r)=>s-r);if(!t.length)return{mean:0,p90:0,slow:!1,fast:!1};let e=t.reduce((s,r)=>s+r,0)/t.length,n=t[Math.min(t.length-1,Math.floor(t.length*.9))];return{mean:e,p90:n,slow:e>34||n>50,fast:e<19.5&&n<24}}var nu=class{constructor(t){this.setCeiling(t,!0)}setCeiling(t,e=!1){this.ceiling=t,this.floor=Math.min(1,t),this.limit=e?t:Math.max(this.floor,Math.min(this.limit,t)),e&&(this.holdUntil=0,this.recoverAfter=0)}pixelRatio(t=!1){return t?this.ceiling:this.limit}observe(t,e){let n=F2(t);if(!n.mean||e<this.holdUntil)return{...n,action:"hold"};let s="hold";return n.slow?(this.recoverAfter=e+15e3,this.limit>this.floor+.01?(this.limit=Math.max(this.floor,Math.round((this.limit-.25)*100)/100),this.holdUntil=e+2500,s="resolution-down"):s="tier-down"):n.fast&&e>=this.recoverAfter&&this.limit<this.ceiling-.01&&(this.limit=Math.min(this.ceiling,Math.round((this.limit+.25)*100)/100),this.holdUntil=e+4e3,this.recoverAfter=e+15e3,s="resolution-up"),{...n,action:s}}};var Qg="button,a,input,select,textarea,label,summary";function tx({compact:i,closePanel:t=null}){let e=R=>document.querySelector(R),n=e("#panel"),s=e("#card"),r=e("#settings"),a=r?.querySelector(".settings-wrap"),o=0,c=()=>{dispatchEvent(new Event("sheetchange")),clearTimeout(o),o=setTimeout(()=>dispatchEvent(new Event("sheetchange")),500)},h=[{el:n,watch:n,grow:!0,open:()=>!n.classList.contains("closed"),close:()=>t?t():e("#panel-close")?.click(),grab:(R,T)=>R.closest(".sheet-grip")?"grip":R.closest(Qg)?null:T<24?"grip":R.closest(".panel-head")?"head":null},{el:s,watch:s,grow:!0,open:()=>s.classList.contains("show"),close:()=>s.querySelector(":scope > .close")?.click(),grab:(R,T)=>R.closest("button,input,select,textarea,label,summary")?null:T<24?"grip":R.closest(".card-head")?R.closest("a")?null:"head":R.closest(".card-hero")?"hero":null},{el:a,watch:r,grow:!1,open:()=>!r.classList.contains("collapsed"),close:()=>e("#settings-toggle")?.click(),grab:(R,T)=>R.closest(Qg)?null:T<24||R.closest(".settings-head")?"head":null}].filter(R=>R.el&&R.watch),u=R=>R.open()&&i()&&R.el.offsetWidth>innerWidth*.6,f=null,g=0,d=R=>{R.style.transition="",R.style.transform=""},y=R=>{try{f.s.el.setPointerCapture(R.pointerId)}catch{}},v=()=>{let R=f.trail[0],T=f.trail[f.trail.length-1];return T[0]>R[0]?(T[1]-R[1])/(T[0]-R[0]):0},p=R=>{let T=R.timeStamp;for(f.trail.push([T,R.clientY]);f.trail.length>2&&T-f.trail[0][0]>100;)f.trail.shift()};function x(R,T){if(T.isPrimary&&T.button===0&&(g=0),f||!T.isPrimary||T.button!==0||!(T.target instanceof Element)||!u(R))return;let N=R.grab(T.target,T.clientY-R.el.getBoundingClientRect().top);N&&(f={s:R,kind:N,id:T.pointerId,x0:T.clientX,y0:T.clientY,drag:!1,trail:[[T.timeStamp,T.clientY]],expanded:R.el.classList.contains("expanded")},N!=="hero"&&y(T))}function A(R){if(!f||R.pointerId!==f.id)return;let T=R.clientX-f.x0,N=R.clientY-f.y0;if(!f.drag){if(Math.hypot(T,N)<8)return;if(f.kind==="hero"&&Math.abs(N)<=Math.abs(T)){f=null;return}f.drag=!0,y(R),f.s.el.style.transition="none"}p(R);let K=f.s.grow&&!f.expanded,C=N>=0?N:K?N>-40?N:Math.max(-64,-40+(N+40)*.2):Math.max(-40,N*.35);f.s.el.style.transform=`translateY(${C}px)`}function M(R){if(!f||R.pointerId!==f.id)return;let{s:T,kind:N,drag:K,expanded:C}=f;if(!K){f=null,N==="grip"&&T.grow&&(g=performance.now()+350,T.el.classList.toggle("expanded"),c());return}p(R);let w=R.clientY-f.y0,it=v(),mt=T.el.offsetHeight;f=null,d(T.el),w>0&&(w>90||it>.6)?C&&T.grow&&w<=mt*.45?(T.el.classList.remove("expanded"),c()):T.close():w<0&&T.grow&&!C&&(w<-50||it<-.5)&&(T.el.classList.add("expanded"),c()),g=performance.now()+350}function L(R){!f||R.pointerId!==f.id||(f.drag&&d(f.s.el),f=null)}for(let R of h){R.el.addEventListener("pointerdown",K=>x(R,K)),R.el.addEventListener("pointermove",A),R.el.addEventListener("pointerup",M),R.el.addEventListener("pointercancel",L),R.el.addEventListener("click",K=>{K.detail===0&&!K.pointerType||performance.now()<g&&(g=0,K.preventDefault(),K.stopPropagation())},!0),R.el.addEventListener("dragstart",K=>{f?.s===R&&K.preventDefault()}),R.grow||R.el.addEventListener("touchmove",K=>{f?.s===R&&f.kind!=="hero"&&K.preventDefault()},{passive:!1});let T=R.open(),N=0;new MutationObserver(()=>{let K=R.open();K!==T&&(T=K,clearTimeout(N),K?N&&(N=0,R.el.classList.remove("expanded"),c()):(f?.s===R&&(d(R.el),f=null),R.el.classList.contains("expanded")&&(N=setTimeout(()=>{N=0,R.open()||(R.el.classList.remove("expanded"),c())},480))))}).observe(R.watch,{attributes:!0,attributeFilter:["class"]})}}var Gt=i=>document.querySelector(i),Zi=i=>[...document.querySelectorAll(i)],iu={get(i){try{return localStorage.getItem("jiuhua."+i)}catch{return null}},set(i,t){try{localStorage.setItem("jiuhua."+i,t)}catch{}}},ii=(i,t,e)=>Math.min(e,Math.max(t,i)),Ni=i=>()=>{i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};function Te(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function za(i){clearTimeout(i._t),i.hidden=!1,i.offsetWidth,i.classList.add("show")}function Ho(i,t=440){i.classList.remove("show"),clearTimeout(i._t),i._t=setTimeout(()=>{i.classList.contains("show")||(i.hidden=!0)},t)}function Fl(i){let t=Gt("#toast");t.textContent=i,za(t),clearTimeout(Fl.t),Fl.t=setTimeout(()=>Ho(t,400),3200)}function Hd(i){let t=Te("div","photo-credit"),e=[i.author&&`\u6444\u5F71\uFF1A${i.author}`,i.takenAt&&`\u62CD\u6444\u4E8E ${i.takenAt}`].filter(Boolean).join(" \xB7 ");e&&t.append(Te("span","",e+" \xB7 "));for(let[n,s]of[[i.sourceName||"\u56FE\u7247\u51FA\u5904",i.sourceUrl],[i.license,i.licenseUrl]]){if(!n||!s)continue;let r=Te("a","",n);r.href=s,r.target="_blank",r.rel="noopener noreferrer",t.lastChild?.tagName==="A"&&t.append(" \xB7 "),t.append(r)}return t}function ex({reducedMotion:i,onToggle:t,focusLost:e,restoreFocus:n,fallbackFocus:s}){function r(o,c,h="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",u=[],f=document.activeElement){let g=Gt("#viewer"),d=g.querySelector(".viewer-strip"),y=g.querySelector(".viewer-count"),v=g.querySelector(".viewer-prev"),p=g.querySelector(".viewer-next");g.classList.contains("show")||(g._opener=f),g.setAttribute("aria-label",h+"\u7167\u7247");let x=g.querySelector(".viewer-caption");x||(x=Te("div","viewer-caption"),x.onclick=R=>R.stopPropagation(),g.append(x)),d.replaceChildren(...o.map((R,T)=>{let N=Te("div","slide"),K=Te("img");return K.src=R,K.alt=u[T]?.alt||h+" \xB7 "+(T+1),N.append(K),N}));let A=()=>ii(Math.round(d.scrollLeft/Math.max(1,d.clientWidth)),0,o.length-1),M=()=>{let R=A();y.textContent=`${R+1} / ${o.length}`,x.replaceChildren();let T=u[R];x.hidden=!T,T&&(x.append(Te("span","",T.alt)),T.sourceUrl&&x.append(Hd(T)));let N=document.activeElement;v.hidden=p.hidden=o.length<2,v.disabled=R===0,p.disabled=R===o.length-1,(N===v&&v.disabled||N===p&&p.disabled)&&(p.disabled&&v.disabled?g.querySelector(".viewer-close"):N===v?p:v).focus({preventScroll:!0})};d.onscroll=M;let L=R=>d.scrollTo({left:ii(A()+R,0,o.length-1)*d.clientWidth,behavior:i?"auto":"smooth"});g._go=L,v.onclick=R=>{R.stopPropagation(),L(-1)},p.onclick=R=>{R.stopPropagation(),L(1)},g.onclick=a,za(g),d.scrollLeft=c*d.clientWidth,M(),t(),g.querySelector(".viewer-close").focus({preventScroll:!0})}function a(){let o=Gt("#viewer"),c=o._opener,h=o.contains(document.activeElement);o._opener=null,Ho(o,260),t(),(h||e())&&n(c,s())}return{open:r,close:a}}function nx({W:i,D:t,stats:e,transit:n,places:s}){let r=s.filter(o=>o.searchable&&["service","transport"].includes(o.category)).length,a=s.filter(o=>["sight","nature","village"].includes(o.category)).length;return`<p>\u672C\u6B21\u66F4\u65B0\uFF1A2026 \u5E74 9 \u6708 28 \u65E5\u3002\u8986\u76D6\u7EA6 ${(i/1e3).toFixed(2)} \xD7 ${(t/1e3).toFixed(2)} \u516C\u91CC\uFF0C\u91CD\u70B9\u4E3A\u4E5D\u534E\u8857\u3001\u767E\u5C81\u5BAB\u3001\u95F5\u56ED\u3001\u5929\u53F0\u4E0E\u82B1\u53F0\u3002\u5B83\u662F\u4F9D\u636E\u516C\u5F00\u8D44\u6599\u91CD\u5EFA\u7684\u53EF\u4EA4\u4E92\u6A21\u578B\uFF0C\u4E0D\u662F\u503E\u659C\u6444\u5F71\u6216\u5B9E\u6D4B\u6210\u679C\u3002</p>
<table><tr><th>\u5185\u5BB9</th><th>\u4F9D\u636E\u4E0E\u7CBE\u5EA6</th></tr>
<tr><td>\u5C45\u4E4B\u6797\u6C11\u5BBF</td><td>\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u4E0E\u822A\u62CD\u56FE\u624B\u5DE5\u5EFA\u6A21\uFF1B\u73B0\u6709\u536B\u661F\u5F71\u50CF\u65E9\u4E8E\u65B0\u5EFA\uFF0C\u843D\u4F4D\u6309\u95E8\u724C\u987A\u5E8F\u4F30\u8BA1\uFF0C\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002</td></tr>
<tr><td>${e.buildings} \u4E2A\u5EFA\u7B51\u8F6E\u5ED3</td><td>${e.osmBuildings} \u4E2A OpenStreetMap \u8F6E\u5ED3 + ${e.supplementaryBuildings} \u4E2A Overture \u5F71\u50CF\u8BC6\u522B\u8865\u5145\u8F6E\u5ED3\u3002\u697C\u5C42\u3001\u5899\u8272\u3001\u74E6\u8272\u3001\u9A6C\u5934\u5899\u3001\u62AB\u6A90\u3001\u5E97\u9762\u6309\u7247\u533A\u89C4\u5F8B\u5206\u914D\uFF08${e.levelsRankedByGlobfp||0} \u680B\u7684\u697C\u5C42\u9AD8\u4F4E\u987A\u5E8F\u53C2\u8003 3D-GloBFP \u4F30\u7B97\u9AD8\u5EA6\uFF09\uFF0C\u89C4\u5F8B\u6765\u81EA\u89C4\u5212\u6587\u4EF6\u4E0E\u516C\u5F00\u7167\u7247\uFF0C\u9010\u680B\u672A\u5B9E\u6D4B\u3002\u70B9\u5EFA\u7B51\u53EF\u770B\u4F9D\u636E\u3002</td></tr>
<tr><td>\u5730\u70B9\u6807\u6CE8</td><td>\u5BFA\u5E99 ${e.temples} \xB7 \u666F\u70B9\u5C71\u6C34\u4E0E\u6751\u843D ${a} \xB7 \u516C\u5171\u8BBE\u65BD ${r}\uFF08\u8F66\u7AD9\u3001\u7D22\u9053\u3001\u505C\u8F66\u573A\u3001\u516C\u5395\u3001\u6E38\u5BA2\u4E2D\u5FC3\u3001\u6D3E\u51FA\u6240\u3001\u533B\u9662\u7B49\uFF09\uFF1B\u53E6\u6709 ${e.halls} \u5904\u6BBF\u5802\u5C0F\u6807\u6CE8\u3002\u591A\u4E2A\u5E73\u53F0\u7684\u540C\u4E00\u5730\u70B9\u5DF2\u5408\u5E76\u3002\u9664\u5C45\u4E4B\u6797\u5916\uFF0C\u5730\u56FE\u4E0D\u6807\u6CE8\u5546\u5BB6\u3002</td></tr>
<tr><td>\u771F\u5B9E\u5730\u5F62</td><td>Copernicus GLO-30\uFF082011\u20132015 \u96F7\u8FBE\u6D4B\u91CF\uFF09\uFF0C257\xD7257 \u7F51\u683C\u7EA6 21 m \u95F4\u8DDD\uFF1B\u4E0E SRTM \u76F8\u6BD4\u5CF0\u9876\u548C\u7D22\u9053\u9AD8\u5DEE\u66F4\u63A5\u8FD1\u5B98\u65B9\u6570\u636E\u3002\u5C40\u90E8\u4E0E\u5176\u4ED6\u9AD8\u7A0B\u6E90\u76F8\u5DEE 30 m \u4EE5\u4E0A\u7684\u683C\u70B9\u53D6\u56DB\u6E90\u4E2D\u4F4D\u6570\u3002\u4ECD\u662F\u8868\u9762\u6A21\u578B\uFF08\u542B\u6811\u51A0\uFF09\u3002</td></tr>
<tr><td>\u4E3B\u8981\u5BFA\u9662</td><td>\u5316\u57CE\u5BFA\u3001\u7947\u56ED\u5BFA\u3001\u8089\u8EAB\u5B9D\u6BBF\u3001\u767E\u5C81\u5BAB\u3001\u65C3\u6A80\u7985\u6797\u7B49\u7684\u5899\u8272\u3001\u74E6\u8272\u3001\u5C4B\u9876\u5F62\u5F0F\u4F9D\u636E\u5B98\u65B9\u89C4\u5212\u3001\u516C\u5F00\u7167\u7247\u4E0E\u536B\u661F\u5F71\u50CF\uFF1B\u6BBF\u4F53\u6BD4\u4F8B\u3001\u7EC6\u90E8\u4ECD\u5C5E\u590D\u539F\u3002</td></tr></table>
<h3>\u666F\u533A\u4EA4\u901A\uFF08\u5B98\u7F51 ${n?.retrieved||""}\uFF09</h3>${(n?.routes||[]).map(o=>`<p><b>${o.name}</b>\u3000${o.hours}<br><small>${o.stops.join(" \u2192 ")}${o.note?"\u3002"+o.note:""}</small></p>`).join("")}<p>${(n?.cableways||[]).map(o=>`${o.name} ${o.hours}`).join("\u3000\xB7\u3000")}<br><small>\u65C5\u6E38\u54A8\u8BE2 ${n?.hotlines?.\u65C5\u6E38\u54A8\u8BE2\u6295\u8BC9||""} \xB7 \u7D27\u6025\u6551\u63F4 ${n?.hotlines?.\u7D27\u6025\u6551\u63F4||""} \xB7 \u5C1A\u65E0\u516C\u5F00\u5750\u6807\u7684\u7AD9\u70B9\uFF1A${(n?.unlocatedStops||[]).join("\u3001")}</small></p>
<h3>\u5750\u6807\u4E0E\u6570\u636E\u8D28\u91CF</h3><p>\u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u7B49\u5E73\u53F0\u7684 GCJ-02 \u5750\u6807\u5747\u7528 coordtransform \u6362\u7B97\u4E3A WGS84\uFF0C\u539F\u59CB\u5750\u6807\u4FDD\u5B58\u5728\u6570\u636E\u4E2D\uFF1B\u6BCF\u4E2A\u6570\u636E\u96C6\u90FD\u7ECF\u8FC7\u72EC\u7ACB\u62BD\u68C0\u3002\u7EF4\u57FA\u6570\u636E\u7B49\u5F00\u653E\u6570\u636E\u4E2D\u7EA6 1 km \u504F\u79FB\u7684\u5BFA\u5E99\u70B9\uFF08\u767E\u5EA6\u5750\u6807\u8BEF\u6807\u4E3A WGS84\uFF09\u672A\u7528\u4E8E\u5B9A\u4F4D\u3002\u5730\u70B9\u5B9A\u4F4D\u4F9D\u636E\u53EF\u5728\u7B80\u4ECB\u5361\u7684\u201C\u8D44\u6599\u4E0E\u4F9D\u636E\u201D\u4E2D\u67E5\u770B\u3002</p>
<h3>\u8D44\u6599\u4E0E\u8BB8\u53EF</h3><p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors / ODbL</a> \xB7 <a href="https://docs.overturemaps.org/attribution/" target="_blank" rel="noopener">Overture Maps\uFF1A\u5EFA\u7B51 ODbL\uFF1B\u5730\u70B9 CDLA-Permissive 2.0</a> \xB7 <a href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model" target="_blank" rel="noopener">Copernicus DEM GLO-30 \xA9 DLR e.V. 2010-2014 and \xA9 Airbus Defence and Space GmbH 2014-2018\uFF0C\u7531 ESA \u5728 Copernicus \u8BA1\u5212\u4E0B\u63D0\u4F9B</a> \xB7 <a href="https://www.jiuhuashan.gov.cn/file_cz/54/202506/202506269aaa0b14711f440284eefd14e047a66e.pdf" target="_blank" rel="noopener">\u4E5D\u534E\u5C71\u5B98\u65B9\u5730\u8D28\u516C\u56ED\u89C4\u5212</a> \xB7 <a href="https://doi.org/10.5194/essd-16-5357-2024" target="_blank" rel="noopener">3D-GloBFP \u5EFA\u7B51\u9AD8\u5EA6\uFF08Che \u7B49 2024\uFF0CCC BY 4.0\uFF09</a>\uFF0C\u4EC5\u7528\u4E8E\u540C\u7247\u533A\u5185\u697C\u5C42\u9AD8\u4F4E\u6392\u5E8F \xB7 \u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u516C\u5F00\u9875\u9762\uFF08\u9010\u6761\u94FE\u63A5\u89C1\u5730\u70B9\u5361\u7247\uFF09</p><p>\u8865\u5145\u5EFA\u7B51\u7531 Qian Shi \u7B49\u7684\u4E1C\u4E9A\u5EFA\u7B51\u6570\u636E\u7ECF Overture \u63D0\u4F9B\uFF0C\u539F\u59CB\u6570\u636E\u4E3A <a href="https://doi.org/10.5281/zenodo.8174931" target="_blank" rel="noopener">CC BY 4.0</a>\uFF1B\u672C\u9879\u76EE\u505A\u4E86\u88C1\u526A\u3001\u53BB\u91CD\u4E0E\u5C4B\u9876\u91CD\u5EFA\u3002\u5B98\u65B9\u7167\u7247\u4E0E\u516C\u5F00\u7167\u7247\u4EC5\u7528\u4E8E\u5F52\u7EB3\u5916\u89C2\u89C4\u5F8B\uFF0C\u672A\u4F5C\u4E3A\u8D34\u56FE\u3002</p>`}var Bl=i=>getComputedStyle(document.documentElement).getPropertyValue(i).trim(),su=/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;function co(i,t,e,n,s,r){r=Math.max(0,Math.min(r,n/2,s/2)),i.beginPath(),i.roundRect?i.roundRect(t,e,n,s,r):(i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath())}function ru(i,t,e,n){let s=t&&t!=="none"&&t.match(su);if(s&&s.length>1){let r=+(t.match(/([\d.]+)deg/)?.[1]??180)*Math.PI/180,a=Math.sin(r),o=-Math.cos(r),c=(Math.abs(n.width*a)+Math.abs(n.height*o))/2,h=n.x+n.width/2,u=n.y+n.height/2,f=i.createLinearGradient(h-a*c,u-o*c,h+a*c,u+o*c);return f.addColorStop(0,s[0]),f.addColorStop(1,s.at(-1)),f}return!e||/^transparent$|^rgba\(.*,\s*0\)$/.test(e)?null:e}function ou(i,t,e,n,s){for(let r of t)i.fillText(r,e,n),e+=i.measureText(r).width+s;return e}var ix=(i,t,e)=>i.measureText(t).width+[...t].length*e;function sx(i,t,e,n){let s=parseFloat(t.borderTopLeftRadius)||0,r=ru(i,t.backgroundImage,t.backgroundColor,e),a=parseFloat(t.borderTopWidth)||0,o=t.boxShadow==="none"?[]:t.boxShadow.split(/,(?![^(]*\))/).filter(c=>!/inset/.test(c)).map(c=>({col:c.match(su)?.[0]||"transparent",v:c.replace(su,"").trim().split(/\s+/).map(parseFloat)}));for(let c of o)!c.v[2]&&c.v[3]>0&&(co(i,e.x+c.v[0]-c.v[3],e.y+c.v[1]-c.v[3],e.width+2*c.v[3],e.height+2*c.v[3],s+c.v[3]),i.fillStyle=c.col,i.fill());if(r){let c=o.filter(h=>h.v[2]>0).sort((h,u)=>u.v[2]-h.v[2])[0];i.save(),c&&(i.shadowColor=c.col,i.shadowBlur=c.v[2]*n*.8,i.shadowOffsetX=c.v[0]*n,i.shadowOffsetY=c.v[1]*n),co(i,e.x,e.y,e.width,e.height,s),i.fillStyle=r,i.fill(),i.restore()}a&&t.borderTopStyle!=="none"&&ru(i,"none",t.borderTopColor,e)&&(i.lineWidth=a,i.strokeStyle=t.borderTopColor,i.setLineDash(t.borderTopStyle==="dashed"?[3,2]:[]),co(i,e.x+a/2,e.y+a/2,e.width-a,e.height-a,s-a/2),i.stroke(),i.setLineDash([]))}function rx(i,t,e){for(let n of t.childNodes){if(n.nodeType===3){let a=n.textContent;if(!a.trim())continue;let o=getComputedStyle(t),c=document.createRange();c.selectNodeContents(n);let h=c.getBoundingClientRect(),u=parseFloat(o.letterSpacing)||0,f=h.y+h.height/2;if(i.font=`${o.fontStyle} ${o.fontWeight} ${o.fontSize} ${o.fontFamily}`,i.textAlign="left",i.textBaseline="middle",i.fillStyle=o.color,o.textShadow!=="none"){i.save(),i.shadowColor="rgba(255,255,255,.95)";for(let g of[3,9])i.shadowBlur=g*e,ou(i,a,h.x,f,u);i.restore()}ou(i,a,h.x,f,u);continue}if(n.nodeType!==1)continue;let s=getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden"||+s.opacity<.05)continue;let r=n.getBoundingClientRect();if(n.tagName.toLowerCase()==="svg"){let a=n.viewBox?.baseVal,o=n.querySelector("path");o&&a?.width&&(i.save(),i.translate(r.x,r.y),i.scale(r.width/a.width,r.height/a.height),i.fillStyle=s.fill,i.fill(new Path2D(o.getAttribute("d"))),i.restore());continue}sx(i,s,r,e),rx(i,n,e)}}function B2(i,t,e,n){let s=t.querySelector("button"),r=getComputedStyle(s),a=s.getBoundingClientRect();if(!a.width||r.visibility==="hidden"||a.x<0||a.y<0||a.right>innerWidth||a.bottom>n)return;let o=t.querySelector("i"),c=o&&getComputedStyle(o);if(c&&c.display!=="none"){let f=getComputedStyle(o,"::after"),g=parseFloat(f.width)||0;i.save();let d,y;if(t.classList.contains("pin")){let v=t.getBoundingClientRect();d=v.x+v.width/2,y=v.bottom;let p=ii(d,a.x,a.right),x=ii(y,a.y,a.bottom);if(Math.hypot(p-d,x-y)>=3){let A=parseFloat(c.height)||1.5,M=c.boxShadow.match(/rgba?\([^)]*\)/);i.lineCap="round",M&&(i.strokeStyle=M[0],i.lineWidth=A+1.5,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()),i.strokeStyle=c.backgroundColor,i.lineWidth=A,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()}}else{let v=o.getBoundingClientRect();i.globalAlpha=t.classList.contains("route-stop")?+c.opacity:1,i.fillStyle=ru(i,c.backgroundImage,c.backgroundColor,v)||"transparent",i.fillRect(v.x,v.y,v.width,v.height),d=v.x+v.width/2,y=v.bottom-(parseFloat(f.bottom)||0)-g/2}if(g){let v=f.boxShadow.match(/(rgba?\([^)]*\)) 0px 0px 0px ([\d.]+)px/);v&&(i.fillStyle=v[1],i.beginPath(),i.arc(d,y,g/2+ +v[2],0,7),i.fill()),i.fillStyle=f.backgroundColor,i.beginPath(),i.arc(d,y,g/2,0,7),i.fill()}i.restore()}sx(i,r,a,e);let h=getComputedStyle(s,"::before"),u=parseFloat(h.width)||0;u&&h.display!=="none"&&h.content!=="none"&&(i.fillStyle=h.backgroundColor,i.beginPath(),i.arc(a.x+(parseFloat(r.borderLeftWidth)||0)+(parseFloat(r.paddingLeft)||0)+u/2,a.y+a.height/2,u/2,0,7),i.fill()),rx(i,s,e)}function ox({frame:i,stats:t,render:e}){let n=innerWidth,s=innerHeight,r=Math.min(2,Math.max(devicePixelRatio||1,i.width/n)),a=document.createElement("canvas");a.width=Math.round(n*r),a.height=Math.round(s*r);let o=a.getContext("2d"),c=Bl("--sans")||"sans-serif",h=Bl("--serif")||"serif",u=Bl("--ink")||"#1c2a25",f=Bl("--muted")||"#5c6962";o.font=`10.5px ${c}`;let g=[];for(let Q of[["\xA9 OpenStreetMap contributors","Overture Maps Foundation","Copernicus DEM (ESA)","\u53BB\u54EA\u513F/360\u5730\u56FE/OSM \u516C\u5F00\u5730\u70B9"],["\u8865\u5145\u8F6E\u5ED3\uFF1AQian Shi \u7B49 / CC BY 4.0","\u5EFA\u7B51\u697C\u9AD8\u3001\u7ACB\u9762\u53CA\u690D\u88AB\u4E3A\u8FD1\u4F3C\u590D\u539F"]]){let lt="";for(let bt of Q){let Wt=lt?lt+" \xB7 "+bt:bt;lt&&o.measureText(Wt).width>n-24?(g.push(lt),lt=bt):lt=Wt}g.push(lt)}let d=12+g.length*15,y=n<600?12:24,v=15,p=44,x=y+v+p+13,A="\u4E5D\u534E\u5C71",M="\u4E09\u7EF4\u5B9E\u5730\u5BFC\u89C8 \xB7 \u8D70\u8FD1\u4E5D\u534E",L=`${t.buildings} \u5EFA\u7B51\u8F6E\u5ED3 \xB7 ${t.places} \u5730\u70B9 \xB7 2026.09.27`;o.font=`600 26px ${h}`;let R=ix(o,A,3.64);o.font=`12.5px ${c}`;let T=ix(o,M,.75);o.font=`11px ${c}`;let N=o.measureText(L).width,K=x-y+Math.max(R,T,N)+20,C=v*2+66,w=e([[y,y,y+K,y+C],[0,s-d,n,s]]);o.fillStyle="#dce5df",o.fillRect(0,0,a.width,a.height),o.drawImage(i,0,0,a.width,a.height),o.scale(r,r);for(let Q of w.filter(lt=>lt.classList.contains("maplabel")&&lt.style.display!=="none").sort((lt,bt)=>(parseInt(getComputedStyle(lt).zIndex)||0)-(parseInt(getComputedStyle(bt).zIndex)||0)))B2(o,Q,r,s-d);o.save(),o.shadowColor="rgba(20,32,27,.24)",o.shadowBlur=20*r,o.shadowOffsetY=6*r,co(o,y,y,K,C,18),o.fillStyle="rgba(251,249,243,.96)",o.fill(),o.restore(),o.lineWidth=1,o.strokeStyle="rgba(28,42,37,.09)",co(o,y+.5,y+.5,K-1,C-1,17.5),o.stroke();let it=y+v,mt=y+v,Kt=Bl("--zhu-fill").match(su)||["#c24536","#a8322a"];return o.fillStyle=ru(o,`linear-gradient(160deg, ${Kt[0]}, ${Kt.at(-1)})`,null,{x:it,y:mt,width:p,height:p}),co(o,it,mt,p,p,10),o.fill(),o.lineWidth=2,o.strokeStyle="#b23a2d",co(o,it+1,mt+1,p-2,p-2,9),o.stroke(),o.lineWidth=1,o.strokeStyle="rgba(251,241,230,.55)",co(o,it+2.5,mt+2.5,p-5,p-5,7.5),o.stroke(),o.fillStyle="#fbf1e6",o.font=`600 16px ${h}`,o.textAlign="center",o.textBaseline="middle",o.fillText("\u4E5D",it+p/2,mt+p/2-8.5),o.fillText("\u534E",it+p/2,mt+p/2+8.5),o.textAlign="left",o.textBaseline="alphabetic",o.fillStyle=u,o.font=`600 26px ${h}`,ou(o,A,x,mt+25,3.64),o.fillStyle=f,o.font=`12.5px ${c}`,ou(o,M,x,mt+46,.75),o.font=`11px ${c}`,o.fillText(L,x,mt+64),o.fillStyle="rgba(251,249,243,.95)",o.fillRect(0,s-d,n,d),o.fillStyle="rgba(28,42,37,.09)",o.fillRect(0,s-d,n,1),o.fillStyle=f,o.font=`10.5px ${c}`,o.textBaseline="middle",g.forEach((Q,lt)=>o.fillText(Q,12,s-d+13.5+lt*15)),a}function z2(i,t,{W:e,D:n}){let{longitude:s,latitude:r,accuracy:a}=i;if(![s,r,a].every(Number.isFinite)||Math.abs(s)>180||Math.abs(r)>90||a<0)return null;let{origin:o,kx:c,ky:h}=t;if(!o||![o.lon,o.lat,c,h,e,n].every(Number.isFinite)||c<=0||h<=0||e<=0||n<=0)return null;let u=(s-o.lon)*c,f=(o.lat-r)*h;return{x:u,z:f,accuracy:a,inside:Math.abs(u)<=e/2&&Math.abs(f)<=n/2}}function ax({geo:i,terrain:t,onChange:e,geolocation:n=navigator.geolocation,secure:s=window.isSecureContext,doc:r=document,win:a=window,now:o=Date.now,schedule:c=setInterval,unschedule:h=clearInterval,maxAccuracy:u=100,maxAge:f=3e4,retainAge:g=12e4,retryAfter:d=6e4,maxRetryAfter:y=24e4}){let v=!1,p=!1,x=null,A=0,M=null,L="",R=0,T=null,N=0,K=d,C=0,w=null,it=!1,mt=null,Kt=5e3,Q=()=>T&&o()-R<=g?T:null,lt=()=>T&&o()-R<=f;function bt(Xe,Ze=null,De=!1){let Be=Xe!==L;L=Xe;let tt=Ze&&w?.point&&Math.hypot(Ze.x-w.point.x,Ze.z-w.point.z)<1&&Math.ceil(Ze.accuracy/10)===Math.ceil(w.point.accuracy/10);!Be&&w?.enabled===v&&w.fresh===De&&(!Ze&&!w.point||tt)||(w={state:L,point:Ze,enabled:v,changed:Be,fresh:De},e(w))}function Wt(){A++,x!==null&&(n.clearWatch(x),x=null)}function Zt(){mt=null,Wt(),M!==null&&(h(M),M=null)}function At(){T=null,R=0,C=0,it=!1,Kt=5e3}function Yt(){!it&&mt===null&&(mt=o()+Kt)}function le(){v&&(v=!1,Zt(),At(),bt("off"))}function Me(){mt=null,Wt(),N=o();let Xe=A;bt("waiting",Q());try{let Ze=n.watchPosition(De=>{if(Xe!==A||!v||r.hidden)return;if(N=o(),!Number.isFinite(De.timestamp)||o()-De.timestamp>f||De.timestamp>o()+5e3){Yt(),bt("stale",Q());return}let Be=z2(De.coords,i,t);if(!Be){Yt(),bt("unavailable",Q());return}if(Be.accuracy>u){C++,(Be.accuracy>u*2||C>=3)&&(T=null,R=0),bt(Be.accuracy>=1e3?"approximate":"inaccurate",Q());return}C=0,K=d,it=!0,mt=null,Kt=5e3,T=Be.inside?Be:null,R=De.timestamp,bt(Be.inside?"inside":"outside",T,!!T)},De=>{Xe!==A||!v||r.hidden||(De.code===1?(v=!1,Zt(),At(),bt("denied")):(Yt(),bt(De.code===3?"timeout":"unavailable",Q())))},{enableHighAccuracy:!0,maximumAge:0,timeout:15e3});Xe===A&&v?x=Ze:n.clearWatch(Ze)}catch{v=!1,Zt(),At(),bt("unavailable")}}function Rt(){if(!v||r.hidden)return;if(mt!==null){o()>=mt&&(Kt=Math.min(6e4,Kt*2),Me());return}let Xe=Q();L==="inside"&&!lt()?bt("stale",Xe):w?.point&&!Xe&&bt(L),o()-N>=K&&(K=Math.min(y,K*2),Me())}function Ft(){M=c(Rt,5e3),Me()}function ye(){if(!(v||p)){if(!s){bt("insecure");return}if(!n){bt("unsupported");return}At(),K=d,v=!0,r.hidden?bt("paused"):Ft()}}function Re(){v&&(Zt(),r.hidden?bt("paused",Q()):Ft())}function Le(){v&&le()}return r.addEventListener("visibilitychange",Re),a.addEventListener("pagehide",Le),{start:ye,stop:le,get enabled(){return v},destroy(){le(),p=!0,r.removeEventListener("visibilitychange",Re),a.removeEventListener("pagehide",Le)}}}var lx=Pg(),Vd=()=>matchMedia("(max-width:820px), (max-width:960px) and (orientation:landscape) and (max-height:520px)").matches,Hn=Vd(),zs=Hn||matchMedia("(pointer:coarse)").matches&&!matchMedia("(any-pointer:fine)").matches,Fr=[{name:"\u6D41\u7545",dpr:1,pbr:!1,blur:!1,hiShapes:!1,forest:0,bamboo:!1,trunkDist:0,detailDist:450,landmarkDist:2600,labelCap:16,shadows:!1},{name:"\u6807\u51C6",dpr:1.5,pbr:!1,blur:!1,hiShapes:!1,forest:1,bamboo:!0,trunkDist:1400,detailDist:900,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u9AD8\u6E05",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:2600,detailDist:2600,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u6781\u81F4",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:1e9,detailDist:1e9,landmarkDist:4e3,labelCap:null,shadows:!0}],Gd=zs?2:3,di=+(iu.get("autoTier")??(zs?1:3));di>=0&&di<=Gd||(di=zs?1:3);var Mr=!1,zl=matchMedia("(prefers-reduced-motion:reduce)").matches,k2=matchMedia("(hover:hover) and (pointer:fine)");function cx(i){let t=Gt("#loading");t.hidden=!1,t.classList.remove("done"),t.classList.add("failed"),Gt("#load-text").textContent=i;let e=Gt("#reload");e.hidden=!1,e.onclick=()=>location.reload()}addEventListener("gesturestart",i=>i.preventDefault());function H2(){let i=Gt("#reload");i.hidden||Gt("#loading").classList.contains("failed")||(i.hidden=!0,Gt("#load-text").textContent="\u8BFB\u53D6\u5730\u5F62\u4E0E\u771F\u5B9E\u5EFA\u7B51\u8F6E\u5ED3")}try{await V2()}catch(i){console.error(i),cx(/webgl/i.test(i.message)?"\u8FD9\u4E2A\u6D4F\u89C8\u5668\u65E0\u6CD5\u663E\u793A\u4E09\u7EF4\u5730\u56FE\uFF08WebGL \u4E0D\u53EF\u7528\uFF09\u3002\u8BF7\u6362\u7528\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6216\u66F4\u65B0\u6D4F\u89C8\u5668\u540E\u91CD\u8BD5\uFF1B\u5728\u5FAE\u4FE1\u91CC\u53EF\u70B9\u53F3\u4E0A\u89D2\u201C\xB7\xB7\xB7\u201D\uFF0C\u9009\u201C\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u201D\u3002":"\u5730\u56FE\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u3002"+i.message)}async function V2(){let[i,t]=window.__JIUHUA_DATA__||await Promise.all(["data/terrain.json","data/geodata.json?v=20261004-flickr-photos"].map(async l=>{let m=await fetch(l);if(!m.ok)throw new Error(l);return m.json()}));H2(),t.water=t.water.filter(l=>!(l.kind==="stream"&&l.pts.every(m=>m[0]>=-1900&&m[0]<=-1195&&m[1]>=-165&&m[1]<=230)));for(let l of t.water){let m=l.pts;if(l.kind!=="river"||Math.hypot(m[0][0]+1226,m[0][1]+159)>5)continue;let _=m.findIndex(b=>b[1]<-761.7);if(_>0){let b=m[_-1],E=m[_],P=(-761.7-b[1])/(E[1]-b[1]);l.pts=[[b[0]+(E[0]-b[0])*P,-761.7],...m.slice(_)]}}t.areas.push({kind:"plaza",ring:[[-1338,-60],[-1372,10],[-1398,-1],[-1370,-70]]}),fm(t),t.roads.push({id:"lane-hushan-plaza",name:"",kind:"alley",width:1.5,drape:!0,pts:[[-1341.3,-48.2],[-1376,0]]}),t.roads.push({id:"lane-hushan-huacheng",name:"",kind:"alley",width:1.5,pts:[[-1376,0],[-1386,27],[-1385,56],[-1378,64],[-1357,101],[-1350.5,108],[-1350.5,114.5],[-1355.8,120.5],[-1355,126],[-1352,133],[-1349.5,140]]}),t.roads.push({id:"lane-police",name:"",kind:"alley",width:2,pts:[[-1408.5,-146.8],[-1424,-140],[-1450,-128.5],[-1475,-117],[-1481,-116.5],[-1487.5,-110]]}),t.roads.push({id:"lane-huacheng",name:"",kind:"alley",width:1.2,pts:[[-1330.4,238.6],[-1330.4,226.5],[-1330.6,224.6],[-1334.5,222.3],[-1341.5,219.6],[-1344.6,211],[-1347.6,205.6],[-1348.4,201]]});let{W:e,D:n,N:s}=i,r=Uint8Array.from(atob(i.h),l=>l.charCodeAt(0)),a=new DataView(r.buffer),o=new Float32Array(s*s);for(let l=0;l<o.length;l++)o[l]=a.getUint16(l*2,!0)/4;let c=1.6,h=c,u=cm(o).min;for(let l=0;l<o.length;l++)o[l]=u+(o[l]-u)*c;let f=l=>u+(l-u)/c;for(let l of t.buildings)l.base=u+(l.base-u)*c;function g(l,m){let _=ii((l+e/2)/e*(s-1),0,s-1.001),b=ii((m+n/2)/n*(s-1),0,s-1.001),E=_|0,P=b|0,U=_-E,X=b-P;return(o[P*s+E]*(1-U)+o[P*s+E+1]*U)*(1-X)+(o[(P+1)*s+E]*(1-U)+o[(P+1)*s+E+1]*U)*X}let d=t.places.find(l=>l.model?.kind==="entrance-checkpoint"),y=Zg(d,g);function v(l,m){let _=g(l,m);return y?y.height(l,m,_):_}let p=new Tl({antialias:!(zs&&devicePixelRatio>=2),alpha:!0,powerPreference:"high-performance"});document.documentElement.classList.toggle("lite",!Fr[di].blur);let x=()=>Math.min(devicePixelRatio,Mr?.8:Fr[di].dpr),A=new nu(x()),M=!1,L=0,R=()=>A.pixelRatio(M),T=()=>Fr[di].shadows&&!Hn&&!zs;function N(l=!1,m=performance.now()){M=l;let _=R();Math.abs(p.getPixelRatio()-_)<.01||(p.setPixelRatio(_),L=m)}p.setPixelRatio(R()),p.outputColorSpace=kn,p.toneMapping=wd,p.toneMappingExposure=1,p.shadowMap.enabled=T(),p.shadowMap.type=Sd,Gt("#stage").appendChild(p.domElement),p.domElement.addEventListener("webglcontextlost",l=>{l.preventDefault(),cx("\u8BBE\u5907\u56FE\u5F62\u5185\u5B58\u4E0D\u8DB3\uFF0C\u4E09\u7EF4\u753B\u9762\u5DF2\u505C\u6B62\u3002\u5173\u95ED\u5176\u4ED6\u9875\u9762\u540E\u70B9\u201C\u91CD\u65B0\u52A0\u8F7D\u201D\u3002")});let K=new Zh;K.domElement.className="labels",Gt("#stage").appendChild(K.domElement);let C=new Pn;C.matrixWorldAutoUpdate=!1;let w=[],it=!0,mt=0,Kt=0,Q=!0,lt=[],bt=0,Wt=new mh;Wt.fog=new ph("#f4dcc0",2e-4);let Zt=()=>{Wt.fog.density=.13/ii(Ft.position.distanceTo(ye.target),600,2e4)},At=new Pn,Yt=new Pn,le=new Pn,Me=new Pn,Rt=new Pn;Wt.add(At),At.add(Yt,le,Me,Rt);let Ft=new Gi(43,1,.7,32e3),ye=Sg(Ft,Gt("#stage"),Jx);ye.enableDamping=!0,ye.dampingFactor=.075,Wt.add(new Nh("#fff6e8","#7a8a70",1.1));let Re=new Oh("#fff0d6",2.6);Re.position.set(-2600,1900,-1500),Re.castShadow=T(),Re.shadow.mapSize.set(4096,4096),Object.assign(Re.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:6500}),Re.shadow.bias=-1e-4,Re.shadow.normalBias=.7,Wt.add(Re,Re.target);let Le=l=>new fn(l),Xe=["roughness","metalness","roughnessMap","metalnessMap","envMapIntensity"],Ze=l=>{let m={...l};for(let _ of Xe)delete m[_];return m},De=(()=>{let l=new xh(new Uint8Array([168,168,168,255,214,214,214,255,255,255,255,255]),3,1);return l.minFilter=l.magFilter=Li,l.needsUpdate=!0,l})();function Be(l={}){let m=new Ih({...Ze(l),gradientMap:De});return m.userData.params=l,m}let tt=["side","transparent","opacity","depthWrite","depthTest","polygonOffset","polygonOffsetFactor","polygonOffsetUnits","alphaTest","vertexColors","map","emissiveMap","emissiveIntensity","fog","toneMapped","flatShading","name"];function Se(l,m){if(l.isMeshToonMaterial||!l.userData.params||l.isMeshStandardMaterial===m)return l;if(l.userData.twin)return l.userData.twin;let _=m?new Lh(l.userData.params):new Dh(Ze(l.userData.params));for(let b of tt)b in l&&b in _&&(_[b]=l[b]);return _.color?.copy(l.color),_.emissive?.copy(l.emissive),_.onBeforeCompile=l.onBeforeCompile,_.userData.params=l.userData.params,_.userData.twin=l,l.userData.twin=_,_}let ct=(l,m={})=>Be({color:l,roughness:.9,metalness:0,...m}),_e={},Jt=null;function ke(l){return _e[l]??=l?{leaf:Ga(),pine:new oo(1,1,6),trunk:new Wi(.18,.3,1,4,1,!0),bamboo:Ga(),lantern:new Xi(.24,10,8)}:{leaf:Ga(),pine:new oo(1,1,6,1,!0),trunk:new Wi(.18,.3,1,3,1,!0),bamboo:Ga(),lantern:Ga().scale(.24,.24,.24)}}let be=ct("#b9b7a4"),F=ct("#594937"),I=ct("#e0a83a",{roughness:.67}),_t=ct("#c0452f"),xe=ct("#77889a"),de=ct("#466266",{roughness:.3,metalness:.15}),ue=new Ci(1,1,1),We=new Wi(1,1,1,8);function qt(l,m,_,b,E,P,U,X){let H=new Ke(ue,X);return H.position.set(m,_+P/2,b),H.scale.set(E,P,U),H.castShadow=!0,H.receiveShadow=!0,l.add(H),H}function we(l,m,_,b,E,P,U){let X=new Ke(We,U);return X.position.set(m,_+P/2,b),X.scale.set(E,P,E),X.castShadow=!0,l.add(X),X}let Je=new Map;function nn(l,m,_="#777865"){let b=Je.get(l);b||(b={p:[],c:[]},Je.set(l,b));let E=Le(_);for(let P=1;P<m.length;P++)b.p.push(...m[P-1],...m[P]),b.c.push(E.r,E.g,E.b,E.r,E.g,E.b)}let pe=new Map,gn=l=>{if(typeof l!="string")return Le(l);let m=pe.get(l);return m||pe.set(l,m=Le(l)),m};class G{constructor(){this.p=[],this.c=[],this.uv=[],this.ids=[]}tri(m,_,b,E="#ffffff",P=null,U=-1){this.p.push(m[0],m[1],m[2],_[0],_[1],_[2],b[0],b[1],b[2]);let X=gn(E),H=X.r,D=X.g,j=X.b;this.c.push(H,D,j,H,D,j,H,D,j),P?this.uv.push(P[0][0],P[0][1],P[1][0],P[1][1],P[2][0],P[2][1]):this.uv.push(m[0]/8,m[2]/8,_[0]/8,_[2]/8,b[0]/8,b[2]/8),this.ids.push(U)}quad(m,_,b,E,P,U=null,X=-1){this.tri(m,_,b,P,U?[U[0],U[1],U[2]]:null,X),this.tri(m,b,E,P,U?[U[0],U[2],U[3]]:null,X)}mesh(m,_){let b=new Ln;b.setAttribute("position",new en(this.p,3)),b.setAttribute("color",new en(this.c,3)),b.setAttribute("uv",new en(this.uv,2)),b.computeVertexNormals();let E=new Ke(b,m);return E.castShadow=!0,E.receiveShadow=!0,E.userData.triangleIds=this.ids,_.add(E),E}}let oe=l=>l*l*(3-2*l),ve=(()=>{let l=Ni(4711),m=256,_=new Float32Array(m*m);for(let E=0;E<_.length;E++)_[E]=l();let b=(E,P)=>{let U=Math.floor(E),X=Math.floor(P),H=E-U,D=P-X,j=oe,Y=(k,Z)=>_[(Z&255)*m+(k&255)];return(Y(U,X)*(1-j(H))+Y(U+1,X)*j(H))*(1-j(D))+(Y(U,X+1)*(1-j(H))+Y(U+1,X+1)*j(H))*j(D)};return(E,P)=>.55*b(E/400+31,P/400+17)+.3*b(E/160+5,P/160+93)+.15*b(E/60+71,P/60+3)})(),nt=(l,m,_)=>_<100||_>1310?0:ii((ve(l,m)-.42)/.2,0,1),dt=zs?1024:2048,jt=document.createElement("canvas");jt.width=jt.height=dt;let te=jt.getContext("2d"),ee=(l,m)=>[(l+e/2)/e*dt,(m+n/2)/n*dt],ht=document.createElement("canvas");ht.width=ht.height=1024;let V=ht.getContext("2d"),Lt=(l,m)=>[(l+e/2)/e*1024,(m+n/2)/n*1024];function zt(l,m,_,b=!1){l.beginPath(),m.forEach((E,P)=>{let U=_(...E);P?l.lineTo(...U):l.moveTo(...U)}),b&&l.closePath()}let re=te.createImageData(dt,dt),ce=Ni(23),Ue=new W,Qt=new W(-.72,.53,-.42).normalize();for(let l=0;l<dt;l++)for(let m=0;m<dt;m++){let _=(m/dt-.5)*e,b=(l/dt-.5)*n,E=v(_,b),P=v(_+30,b),U=v(_-30,b),X=v(_,b+30),H=v(_,b-30),D=(P-U)/60,j=(X-H)/60,Y=ii(-(P+U+X+H-4*E)/900*14,-.22,.22);Ue.set(-D,1,-j).normalize();let k=f(E),Z=1/Math.sqrt(1+(D*D+j*j)/(c*c)),J=ii((1-Z-.27)*2.8,0,.67)*(k>720?1:.35),at=(ce()-.5)*10,pt=Math.sin(_*.008)*Math.cos(b*.007)*4,Dt=ii((k-430)/760,0,1),yt=Dt+(Math.floor(Dt*5)+oe(Math.min(1,Math.max(0,(Dt*5%1-.35)/.3)))-Dt*5)/5*.6,Ht=ii(1-yt*2,0,1),kt=ii(yt*2-1,0,1),St=Math.max(0,Ue.dot(Qt)),O=[0,1,2].map(rt=>[136,184,96][rt]*Ht+[86,146,74][rt]*(1-Ht-kt)+[108,146,92][rt]*kt+pt),ot=(.55+.55*St)*(1+Y),gt=(l*dt+m)*4;{let rt=nt(_,b,k)*(1-J*1.4),ut=.82+.3*ve(_*7.3,b*7.3);if(rt>0)for(let ft=0;ft<3;ft++)O[ft]+=([44,104,62][ft]*ut-O[ft])*oe(Math.min(1,rt))*.78}for(let rt=0;rt<3;rt++)re.data[gt+rt]=(O[rt]*(1-J)+[200,190,164][rt]*J)*ot+[6,4,-6][rt]*St+[-6,-2,8][rt]*(1-St)+at;re.data[gt+3]=255}te.putImageData(re,0,0);for(let l of t.areas)["residential","religious","parking","water","grass","meadow","plaza","site"].includes(l.kind)&&(zt(te,l.ring,ee,!0),te.fillStyle={residential:"#b7b6a0",religious:"#bdb9a6",parking:"#92998f",water:"#4fa6d8",grass:"#849268",meadow:"#899767",plaza:"#b9b4a1",site:"#a9a89c"}[l.kind],te.fill(),["residential","religious","parking","water","plaza","site"].includes(l.kind)&&(zt(V,l.ring,Lt,!0),V.fill()));te.lineJoin="round";for(let l of t.buildings)l.style==="rural"||l.style==="tiantai"||(zt(te,l.ring,ee,!0),te.strokeStyle="#a9a797",te.lineWidth=Math.max(1.2,7/e*dt),te.stroke());for(let l of t.buildings)zt(te,l.ring,ee,!0),te.fillStyle="#bcbcaf",te.fill(),zt(V,l.ring,Lt,!0),V.fill(),V.lineWidth=3,V.stroke();for(let l of t.roads)zt(V,l.pts,Lt),V.lineWidth=Math.max(2,(l.width+7)/e*1024),V.stroke();for(let l of t.water)zt(te,l.pts,ee),te.strokeStyle="#4a9fd0",te.lineWidth=l.kind==="river"?3:1,te.stroke(),zt(V,l.pts,Lt),V.lineWidth=5,V.stroke();let Ne=V.getImageData(0,0,1024,1024).data,He=(l,m)=>{let[_,b]=Lt(l,m).map(Math.floor);return _<0||b<0||_>=1024||b>=1024||Ne[(b*1024+_)*4+3]>0},Oe=zs?2048:4096,sn=document.createElement("canvas");sn.width=sn.height=Oe;let hn=sn.getContext("2d"),pn=new as(sn);pn.flipY=!1,pn.generateMipmaps=!1,pn.minFilter=pn.magFilter=ms;let Rn=new as(jt);Rn.colorSpace=kn,Rn.anisotropy=p.capabilities.getMaxAnisotropy();let Tn=new _s(e,n,s-1,s-1).rotateX(-Math.PI/2);for(let l=0;l<o.length;l++)Tn.attributes.position.setY(l,o[l]);Tn.computeVertexNormals();let Bn=new Ke(Tn,ct("#ffffff",{map:Rn}));Bn.receiveShadow=!0,At.add(Bn),y&&At.add(Jg(y,Xd,e,n,ct("#ffffff",{map:Rn})));let ci={o:new Fn(0,0,1,0),s:new Fn(1,0,1,0)},ks=y?{o:new Fn(...y.origin,y.fz,-y.fx),s:new Fn(-18,18,-14,14)}:{o:new Fn(0,0,1,0),s:new Fn(1,0,1,0)},ls=(l,m)=>{let _=ci.o,b=ci.s,E=l-_.x,P=m-_.y,U=E*_.z+P*_.w,X=E*_.w-P*_.z;return U>b.x-3&&U<b.y+3&&X>b.z-3&&X<b.w+3};{let l=document.createElement("canvas");l.width=l.height=256;let m=l.getContext("2d"),_=m.createImageData(256,256),b=Ni(7),E=(D,j)=>{let Y=new Float32Array((D+1)*(D+1)),k=Ni(j);for(let Z=0;Z<Y.length;Z++)Y[Z]=k();return(Z,J)=>{let at=Z*D,pt=J*D,Dt=Math.floor(at),yt=Math.floor(pt),Ht=at-Dt,kt=pt-yt,St=ot=>ot*ot*(3-2*ot),O=(ot,gt)=>Y[gt%D*(D+1)+ot%D];return(O(Dt,yt)*(1-St(Ht))+O(Dt+1,yt)*St(Ht))*(1-St(kt))+(O(Dt,yt+1)*(1-St(Ht))+O(Dt+1,yt+1)*St(Ht))*St(kt)}},P=E(64,11),U=E(16,12),X=E(8,13);for(let D=0;D<256;D++)for(let j=0;j<256;j++){let Y=j/256,k=D/256,Z=(D*256+j)*4,J=.55*P(Y,k)+.45*b();_.data[Z]=J*255,_.data[Z+1]=(.6*U(Y,k)+.4*X(Y,k))*255,_.data[Z+2]=128,_.data[Z+3]=255}m.putImageData(_,0,0);let H=new as(l);H.wrapS=H.wrapT=ro,H.anisotropy=8,Bn.material.onBeforeCompile=D=>{D.uniforms.detailMap={value:H},D.uniforms.roadMask={value:pn},D.uniforms.terrainWD={value:new fe(e,n)},D.uniforms.cutO={value:ci.o},D.uniforms.cutS={value:ci.s},D.uniforms.checkpointO={value:ks.o},D.uniforms.checkpointS={value:ks.s},D.vertexShader=D.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;`).replace("#include <project_vertex>",`#include <project_vertex>
vDetailPos=(modelMatrix*vec4(transformed,1.0)).xyz;`),D.fragmentShader=D.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;uniform sampler2D detailMap;uniform vec4 cutO;uniform vec4 cutS;uniform sampler2D roadMask;uniform vec2 terrainWD;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
if(texture2D(roadMask,vDetailPos.xz/terrainWD+.5).r>.5)discard;
{vec2 dq=vDetailPos.xz-cutO.xy;float cu=dot(dq,cutO.zw),cv=dot(dq,vec2(cutO.w,-cutO.z));if(cu>cutS.x&&cu<cutS.y&&cv>cutS.z&&cv<cutS.w)discard;}`).replace("#include <map_fragment>",`#include <map_fragment>
{float near=smoothstep(1600.0,150.0,length(vDetailPos-cameraPosition));float fine=texture2D(detailMap,vDetailPos.xz/7.0).r;float mid=texture2D(detailMap,vDetailPos.xz/61.0).g;diffuseColor.rgb*=mix(1.0,0.74+0.38*fine+0.22*(mid-0.5),near);}`);let j=D.fragmentShader;D.fragmentShader=j.replace("uniform vec4 cutS;","uniform vec4 cutS;uniform vec4 checkpointO;uniform vec4 checkpointS;").replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
{vec2 dq=vDetailPos.xz-checkpointO.xy;float cu=dot(dq,checkpointO.zw),cv=dot(dq,vec2(-checkpointO.w,checkpointO.z));if(cu>checkpointS.x&&cu<checkpointS.y&&cv>checkpointS.z&&cv<checkpointS.w)discard;}`)},Bn.material.needsUpdate=!0}let In=new G,xn=[];for(let l=0;l<s;l++)xn.push([l,0]);for(let l=1;l<s;l++)xn.push([s-1,l]);for(let l=s-2;l>=0;l--)xn.push([l,s-1]);for(let l=s-2;l>=0;l--)xn.push([0,l]);for(let l=1;l<xn.length;l++){let[m,_]=xn[l-1],[b,E]=xn[l],P=-e/2+m*e/(s-1),U=-n/2+_*n/(s-1),X=-e/2+b*e/(s-1),H=-n/2+E*n/(s-1);In.quad([P,o[_*s+m],U],[X,o[E*s+b],H],[X,u-90,H],[P,u-90,U],"#8f8974")}{let l=In.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),At),m=l.geometry.attributes.position,_=l.geometry.attributes.color,b=Le("#6c6f5c"),E=Le("#f3d6b2"),P=new fn;for(let U=0;U<m.count;U++)P.copy(b).lerp(E,m.getY(U)<u-80?1:0),_.setXYZ(U,P.r,P.g,P.b);l.castShadow=l.receiveShadow=!1}Gt("#load-text").textContent="\u6309\u771F\u5B9E\u8F6E\u5ED3\u91CD\u5EFA\u5C4B\u9876\u3001\u7A97\u6237\u548C\u6CBF\u8857\u7ACB\u9762",await new Promise(requestAnimationFrame);function Hs(l){let m=document.createElement("canvas");m.width=m.height=256;let _=m.getContext("2d");_.fillStyle=l==="roof"?"#e4e2da":"#e6e3d9",_.fillRect(0,0,256,256);let b=Ni(l==="roof"?44:98);for(let P=0;P<3500;P++)_.fillStyle=`rgba(${b()>.5?"255,255,255":"50,55,44"},${b()*.07})`,_.fillRect(b()*256,b()*256,1+b()*3,1+b()*2);if(l==="roof"){for(let P=0;P<256;P+=12)_.fillStyle="#e3dfd540",_.fillRect(P,0,3,256),_.fillStyle="#222c2c2c",_.fillRect(P+8,0,2,256);for(let P=0;P<256;P+=20)_.fillStyle="#23333122",_.fillRect(0,P,256,1)}let E=new as(m);return E.wrapS=E.wrapT=ro,E.colorSpace=kn,E.anisotropy=8,E}let z={"#6A6F72":"#7b8da2","#8A4B35":"#a9483a","#B4623F":"#c9603d","#D9A93A":"#f6c02c","#7A2E26":"#b63a2a","#8C6A3E":"#b98a45","#3D4141":"#6f7f92","#C0582E":"#dc6435"},xt={"#F0EEE8":"#fbf4e6","#D8D6CF":"#e6dece","#EAEAE6":"#f5efe2","#D8A035":"#f2b33a","#E4D9C4":"#f3e3c0"},Ct=Hs("roof"),Ot=Hs("wall"),Pt=new G,Ie=new G,$e=new G,Qe=new G,on=new G,dn=new G,un=[],an=[],Vn=[],Si=[],hi="overture-6eed6b02-0a6b-40b7-9326-5247a9383063",cs=new Set([609757872,609561169,t.buildings.find(l=>l.id===hi)?.osmId,609909704,609909706]);for(let l of t.areas)for(let m of l.frame?.replaces||[])cs.add(t.buildings.find(_=>_.id===m)?.osmId);let si=["#D9A93A","#7A2E26","#C0582E"],_n=t.buildings.filter(l=>l.style==="temple"&&l.area>=240&&(si.includes(l.roofColor)||l.osmId===609990009));for(let l of _n)cs.add(l.osmId);let ir=hm,Xn=new Set(Object.values(ir));for(let l of Xn)cs.add(l);let Ji=256,sr=48,rr=8,Vo=zs?24:44,wi=[],hs=document.createElement("canvas");hs.width=Ji*rr,hs.height=sr*Vo;let us=hs.getContext("2d");function fs(l){let m=wi.length;if(m>=rr*Vo)return null;wi.push(l);let _=m%rr*Ji,b=Math.floor(m/rr)*sr;us.fillStyle="#1c1a17",us.fillRect(_,b,Ji,sr),us.strokeStyle="#8b6d30",us.lineWidth=3,us.strokeRect(_+4,b+4,Ji-8,sr-8),us.fillStyle="#dcb95c";let E=Math.min(32,Math.floor((Ji-26)/Math.max(2,[...l].length)));us.font=`600 ${E}px "Songti SC","STSong","Noto Serif SC","PingFang SC",serif`,us.textAlign="center",us.textBaseline="middle",us.fillText(l,_+Ji/2,b+sr/2+1);let P=hs.width,U=hs.height;return[[_/P,1-(b+sr)/U],[(_+Ji)/P,1-(b+sr)/U],[(_+Ji)/P,1-b/U],[_/P,1-b/U]]}let ka=l=>[...l.replace(/^(九华山上?|池州|花筑·?)/,"").replace(/[（(].*$/,"").replace(/(精品|主题)?(民宿|客栈|山庄|宾馆|酒店)$/,_=>_.length>2?_.slice(-2):_).trim()].slice(0,9).join(""),Br=[],Go=[],Ha=(l,m)=>{let _=new fn(l);return _.offsetHSL(0,0,m),"#"+_.getHexString()};for(let l=0;l<t.buildings.length;l++){let he=function(se){let ne=-(se[0]-St)*kt+(se[1]-O)*Ht;return b+gt*ii(1-Math.abs(ne)/ot,0,1)},m=t.buildings[l];if(cs.has(m.osmId))continue;let _=m.ring,b=m.base+m.wallHeight,E=Ni(m.osmId),P=E(),U=m.style==="temple",X=xt[m.wallColor]||m.wallColor||(m.precinct==="\u767E\u5C81\u5BAB"?"#e8dfc2":m.kind==="temple"?m.roofColor==="gold"?"#cdb787":"#e6dbc1":"#ebe6d9"),H=z[m.roofColor]||(m.roofColor?.startsWith("#")?m.roofColor:m.roofColor==="gold"?"#c1a14e":"#5b6062"),D=Ha(H,(P-.5)*.06),j=m.levels||2,Y=(m.wallHeight-.35)/j,k=!!m.lattice,Z=(m.eave??.5)*1.6,J=k?"#2f2721":"#56676a",at=k?"#3a3029":"#687675",pt=0;_.forEach((se,ne)=>{let me=_[(ne+1)%_.length];pt+=se[0]*me[1]-me[0]*se[1]});let Dt=!0,yt=new Set(m.partyEdges||[]);for(let se=0;se<_.length;se++){let Zn=function(wn,qn,Cn,Jn,zn,Qo,ta=.035,nl=null,hc=!1){let Bi=ne[0]+Xt*qn+Ut*ta,Ps=ne[1]+Pe*qn+ge*ta,Pi=Jn/2,Er=hc?ln:Xt,gi=hc?rn:Pe;wn.quad([Bi-Er*Pi,Cn,Ps-gi*Pi],[Bi+Er*Pi,Cn,Ps+gi*Pi],[Bi+Er*Pi,Cn+zn,Ps+gi*Pi],[Bi-Er*Pi,Cn+zn,Ps-gi*Pi],Qo,nl)},ne=_[se],me=_[(se+1)%_.length],q=Math.hypot(me[0]-ne[0],me[1]-ne[1]);if(q<.1)continue;let Et=Math.min(m.base,v(...ne)-.12),wt=Math.min(m.base,v(...me)-.12),Nt=U?m.base+.5:Math.min(m.base+.5,Et+1.2),et=U?m.base+.5:Math.min(m.base+.5,wt+1.2);if(Pt.quad([ne[0],Nt,ne[1]],[me[0],et,me[1]],[me[0],b,me[1]],[ne[0],b,ne[1]],X,[[0,Nt/8],[q/8,et/8],[q/8,b/8],[0,b/8]],l),(Nt-Et>.25||et-wt>.25)&&$e.quad([ne[0],Et,ne[1]],[me[0],wt,me[1]],[me[0],et,me[1]],[ne[0],Nt,ne[1]],"#9c9a93",null,l),yt.has(se))continue;let Ut=(pt>0?1:-1)*(me[1]-ne[1])/q,ge=(pt>0?-1:1)*(me[0]-ne[0])/q,Xt=(me[0]-ne[0])/q,Pe=(me[1]-ne[1])/q,ln=ge,rn=-Ut,Gs=se===m.front&&m.frontDist!=null&&m.frontDist<14,Fi=m.shopfront&&Gs&&q>2.4;if(q>2.4){let wn=Math.max(1,Math.floor(q/(U?3.1:3.3))),qn=U?0:-Math.floor((m.base+.35-Math.min(Nt,et))/Y);for(let Cn=qn;Cn<j;Cn++)if(!(Cn===0&&Fi))for(let Jn=0;Jn<wn;Jn++){if(se!==m.front||Cn!==j-1||Jn%2)continue;let zn=(Jn+.5)*q/wn,Qo=m.base+.35+Cn*Y+(Cn===0?.95:.8),ta=Math.min(1.75,Y*.54),nl=U?1.3:k?1.1:1.4;Cn<0&&Qo<Nt+(et-Nt)*zn/q+.35||Zn(Qe,zn,Qo,nl,ta,(Jn+Cn)%3?J:at,.055)}if(se===m.front&&!Fi&&!U&&q>3&&(Zn(Qe,q/2,m.base+.33,1.3,2.35,"#3a342d",.07),m.lanterns))for(let Cn of[-1.15,1.15])Br.push([ne[0]+Xt*(q/2+Cn)+Ut*.45,m.base+2.45,ne[1]+Pe*(q/2+Cn)+ge*.45])}if(Fi){let wn=Math.max(1,Math.floor(q/3.2)),qn=q/wn;for(let Cn=0;Cn<wn;Cn++){let Jn=(Cn+.5)*qn;Zn(Qe,Jn,m.base+.42,qn-.42,2.3,Cn%2?"#2b2622":"#322b25",.06),m.lanterns&&Cn<4&&Br.push([ne[0]+Xt*(Jn-qn/2+.3)+Ut*.62,m.base+2.55,ne[1]+Pe*(Jn-qn/2+.3)+ge*.62])}Zn(on,q/2,m.base+2.78,q-.1,.42,m.style==="oldStreet"?"#7b2d22":"#6d5a45",.07)}if(!Dt&&Gs&&q>2.2){let wn=Fi&&m.businesses.find(Jn=>Jn.category!=="hotel")||m.businesses[0],qn=ka(wn.short||wn.n),Cn=qn?fs(qn):null;if(Cn){let Jn=Math.min(q*.82,.62*[...qn].length+1.1),zn=Fi?m.base+3.28:m.base+Math.min(m.wallHeight-1.1,3.25);Zn(dn,q/2,zn,Jn,Math.min(.95,Jn*.19),"#ffffff",.14,Cn,!0),Dt=!0}}}let[Ht,kt]=m.axis,[St,O]=m.rectCenter,ot=Math.max(.8,m.depth/2),gt=m.roofRise;if([541482372,538484526,538484527,538484528,609990014,609990009].includes(m.osmId))continue;let ut=(se,ne)=>[se/6,ne/6],ft=m.area/Math.max(1,m.width*m.depth),st=m.partyGable?.12:Z,Tt=m.partyEave?Math.min(Z,.15):Z;if(m.hip&&ft>.82){let se=m.width/2+st,ne=m.depth/2+Tt,me=b-gt*Tt/ot,q=Math.max(0,m.width/2-m.depth/2),Et=(Pe,ln,rn)=>[St+Ht*Pe-kt*ln,rn,O+kt*Pe+Ht*ln],wt=Et(-se,-ne,me),Nt=Et(se,-ne,me),et=Et(se,ne,me),Ut=Et(-se,ne,me),ge=Et(-q,0,b+gt),Xt=Et(q,0,b+gt);Ie.quad(wt,Nt,Xt,ge,D,[ut(-se,-ne),ut(se,-ne),ut(q,0),ut(-q,0)],l),Ie.quad(et,Ut,ge,Xt,D,[ut(se,ne),ut(-se,ne),ut(-q,0),ut(q,0)],l),Ie.tri(Nt,et,Xt,Ha(H,-.03),[ut(se,-ne),ut(se,ne),ut(q,0)],l),Ie.tri(Ut,wt,ge,Ha(H,-.03),[ut(-se,ne),ut(-se,-ne),ut(-q,0)],l);for(let[Pe,ln]of[[wt,Nt],[Nt,et],[et,Ut],[Ut,wt],[ge,Xt],[wt,ge],[Nt,Xt],[et,Xt],[Ut,ge]])un.push(...Pe,...ln);continue}let Ce=m.horseHead?1:1+2*st/Math.max(2,m.width),It=1+2*Tt/Math.max(2,m.depth),ae=se=>{let ne=(se[0]-St)*Ht+(se[1]-O)*kt,me=-(se[0]-St)*kt+(se[1]-O)*Ht,q=ne*Ce,Et=me*It;return[St+Ht*q-kt*Et,b+gt*(1-Math.abs(Et)/ot),O+kt*q+Ht*Et,q,Et]};for(let se=0;se<_.length;se++){let ne=_[se],me=_[(se+1)%_.length],q=-(ne[0]-St)*kt+(ne[1]-O)*Ht,Et=-(me[0]-St)*kt+(me[1]-O)*Ht,wt=Math.hypot(me[0]-ne[0],me[1]-ne[1]),Nt=q*Et<0;if(Nt&&m.horseHead&&wt>4){let Ut=wt>9?5:3,ge=Ut===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let Xt=0;Xt<Ut;Xt++){let Pe=Xt/Ut,ln=(Xt+1)/Ut,rn=[ne[0]+(me[0]-ne[0])*Pe,ne[1]+(me[1]-ne[1])*Pe],Zn=[ne[0]+(me[0]-ne[0])*ln,ne[1]+(me[1]-ne[1])*ln],Gs=b+(gt+.95)*ge[Xt]+.25,Fi=Math.max(he(rn),he(Zn))+.45,wn=Math.max(Gs,Fi);Pt.quad([rn[0],b,rn[1]],[Zn[0],b,Zn[1]],[Zn[0],wn,Zn[1]],[rn[0],wn,rn[1]],X,null,l);let qn=-(me[1]-ne[1])/wt*.3,Cn=(me[0]-ne[0])/wt*.3;on.quad([rn[0]-qn,wn-.04,rn[1]-Cn],[Zn[0]-qn,wn-.04,Zn[1]-Cn],[Zn[0],wn+.2,Zn[1]],[rn[0],wn+.2,rn[1]],"#3e4144"),on.quad([rn[0],wn+.2,rn[1]],[Zn[0],wn+.2,Zn[1]],[Zn[0]+qn,wn-.04,Zn[1]+Cn],[rn[0]+qn,wn-.04,rn[1]+Cn],"#3e4144")}continue}let et=[ne];if(Nt){let Ut=q/(q-Et);et.push([ne[0]+(me[0]-ne[0])*Ut,ne[1]+(me[1]-ne[1])*Ut])}et.push(me);for(let Ut=1;Ut<et.length;Ut++){let ge=et[Ut-1],Xt=et[Ut];Pt.quad([ge[0],b,ge[1]],[Xt[0],b,Xt[1]],[Xt[0],he(Xt),Xt[1]],[ge[0],he(ge),ge[1]],X,null,l)}}for(let se of m.roofTriangles){let ne=se.map(ae);Ie.tri(...ne.map(me=>me.slice(0,3)),D,ne.map(me=>ut(me[3],me[4])),l)}for(let se=0;se<_.length;se++){let ne=ae(_[se]),me=ae(_[(se+1)%_.length]);un.push(ne[0],ne[1]+.06,ne[2],me[0],me[1]+.06,me[2])}}let hx=Pt.mesh(ct("#ffffff",{vertexColors:!0,map:Ot,side:mn}),Yt),ux=Ie.mesh(ct("#ffffff",{vertexColors:!0,map:Ct,side:mn}),Yt);Vn.push($e.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),Yt)),Si.push(Qe.mesh(ct("#ffffff",{vertexColors:!0,roughness:.4,metalness:.05,side:mn}),Yt)),on.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),Yt),Vn.push(hx,ux);let kl=new as(hs);if(kl.colorSpace=kn,kl.anisotropy=8,dn.mesh(Be({map:kl,roughness:.55,side:mn,emissive:"#ffffff",emissiveMap:kl,emissiveIntensity:.18}),Yt),Br.length){let l=Jt=new Nr(ke(Fr[di].hiShapes).lantern,Be({color:"#c8261c",emissive:"#8a1208",emissiveIntensity:.55,roughness:.5}),Br.length),m=new vi;Br.forEach((_,b)=>{m.position.set(..._),m.scale.set(1,1.25,1),m.updateMatrix(),l.setMatrixAt(b,m.matrix)}),Yt.add(l),Si.push(l)}if(Go.length){let l=new Nr(new Ci(.8,.55,.3),ct("#d8d8d2",{roughness:.6}),Go.length),m=new vi;Go.forEach((_,b)=>{m.position.set(_[0],_[1],_[2]),m.rotation.set(0,_[3],0),m.updateMatrix(),l.setMatrixAt(b,m.matrix)}),Yt.add(l)}let Wd=new Ln;Wd.setAttribute("position",new en(un,3)),Yt.add(new Rl(Wd,new Ia({color:"#2b2420",transparent:!0,opacity:.9})));function or(l,m,_,b,E,P,U,X=xe,{hip:H=!1,upturn:D=!1}={}){let j=new G,Y=E/2,k=P/2,Z=H?Math.max(1,Y-k*.8):Y,J=[m-Y,_+(D?.6:0),b-k],at=[m+Y,_+(D?.6:0),b-k],pt=[m+Y,_+(D?.6:0),b+k],Dt=[m-Y,_+(D?.6:0),b+k],yt=[m-Z,_+U,b],Ht=[m+Z,_+U,b];j.quad(J,at,Ht,yt,"#ffffff"),j.quad(Dt,yt,Ht,pt,"#ffffff"),j.tri(J,yt,Dt,"#ffffff"),j.tri(at,pt,Ht,"#ffffff");let kt=X.clone();if(kt.map=Ct,kt.side=mn,j.mesh(kt,l),nn(l,[yt,Ht],X===I?"#ba9144":"#5b6459"),D)for(let[St,O,ot,gt]of[[m-Y,b-k,-1,-1],[m+Y,b-k,1,-1],[m-Y,b+k,-1,1],[m+Y,b+k,1,1]])nn(l,[[St-ot*3,_+.03,O-gt*1.8],[St,_+.6,O],[St+ot*.65,_+1.05,O+gt*.5]],"#71694c")}function ar(l,m,_){let b=new Pn;return b.position.set(l,v(l,m),m),b.userData.landmark=_,b.userData.placeId=ll(_),Yt.add(b),an.push(b),b}function Va(l,m,_,b){let E=Math.atan2(_,b),P=Math.cos(E),U=Math.sin(E);return{rot:E,wp:(X,H)=>[l+X*P+H*U,m-X*U+H*P]}}function bn(l,m,_,b,E,P,U,X){let H=(k,Z,J)=>[[0,0],[k/8,0],[k/8,J/8],[0,J/8]],D=E-b,j=_-m,Y=U-P;l.quad([m,b,U],[_,b,U],[_,E,U],[m,E,U],X,H(j,0,D)),l.quad([_,b,P],[m,b,P],[m,E,P],[_,E,P],X,H(j,0,D)),l.quad([_,b,U],[_,b,P],[_,E,P],[_,E,U],X,H(Y,0,D)),l.quad([m,b,P],[m,b,U],[m,E,U],[m,E,P],X,H(Y,0,D)),l.quad([m,E,U],[_,E,U],[_,E,P],[m,E,P],X,[[m/8,U/8],[_/8,U/8],[_/8,P/8],[m/8,P/8]])}let br=new Map;{let l=t.buildings.find(m=>m.name==="\u5316\u57CE\u5BFA");if(l){let[m,_]=l.rectCenter,{rot:b,wp:E}=Va(m,_,-l.axis[0],-l.axis[1]),P=l.depth/2,U=l.width/2,X=l.width/58.75,H=ar(m,_,"\u5316\u57CE\u5BFA");H.rotation.y=b;let D=H.position.y,j=xt[l.wallColor]||l.wallColor||"#fbf4e6",Y=z[l.roofColor]||l.roofColor||"#7b8da2",k="#3e4144",Z="#4a4f50",J=new G,at=new G,pt=new G,Dt=(gt,rt,ut)=>{let ft=ut===Math.max?-1e9:1e9;for(let st=0;st<=4;st++)for(let Tt=-2;Tt<=2;Tt++)ft=ut(ft,v(...E(Tt*P/2,gt+(rt-gt)*st/4)));return ft-D},yt=[{name:"\u7075\u5B98\u6BBF",hall:8,court:3.75,doc:3.7,h:6,rise:2.4,wing:2.6},{name:"\u5929\u738B\u6BBF",hall:9.5,court:4.5,doc:5.2,h:6.4,rise:2.85,wing:2.6},{name:"\u5927\u96C4\u5B9D\u6BBF",hall:11.5,court:7.5,doc:6.4,h:8,rise:3.45,wing:3},{name:"\u85CF\u7ECF\u697C",hall:14,court:0,doc:9.1,h:10.5,rise:4.2}],Ht=v(...E(0,U+6))-D,kt=U,St=-1e9;for(let gt of yt){gt.front=kt,gt.hallBack=kt-gt.hall*X,gt.back=gt.hallBack-gt.court*X,kt=gt.back,gt.y=Math.max(Ht+gt.doc,Dt(gt.back,gt.front,Math.max)+.3,St),St=gt.y;let rt=Dt(gt.back,gt.front,Math.min)-1.2;bn(pt,-P,P,rt,gt.y,gt.back,gt.front,"#b9b7a4")}let O=.8;for(let[gt,rt]of yt.entries()){let ut=rt.hallBack,ft=rt.front,st=(ut+ft)/2,Tt=(ft-ut)/2,Ce=rt.y+rt.h,It=Ce+rt.rise,ae=Ce-rt.rise*O/Tt,he=Math.hypot(Tt+O,It-ae);bn(J,-P,P,rt.y,Ce,ut,ft,j);for(let q of[-1,1])J.tri([q*P,Ce,ut],[q*P,Ce,ft],[q*P,It,st],j,[[0,0],[Tt/4,0],[Tt/8,rt.rise/8]]);at.quad([-P,ae,ft+O],[P,ae,ft+O],[P,It,st],[-P,It,st],Y,[[-P/6,0],[P/6,0],[P/6,he/6],[-P/6,he/6]]),at.quad([P,ae,ut-O],[-P,ae,ut-O],[-P,It,st],[P,It,st],Y,[[P/6,0],[-P/6,0],[-P/6,he/6],[P/6,he/6]]),bn(pt,-P,P,It-.12,It+.32,st-.22,st+.22,Z);let se=rt.hall>9?5:3,ne=se===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let q of[-1,1])for(let Et=0;Et<se;Et++){let wt=ut+(ft-ut)*Et/se,Nt=ut+(ft-ut)*(Et+1)/se,et=Ce+(rt.rise+.95)*ne[Et]+.3,Ut=q*P-q*.36,ge=q*P+q*.06,Xt=q*P-q*.48,Pe=q*P+q*.18;bn(J,Math.min(Ut,ge),Math.max(Ut,ge),Ce,et,wt,Nt,j),bn(pt,Math.min(Xt,Pe),Math.max(Xt,Pe),et,et+.2,wt-.06,Nt+.06,k)}let me=ft+.06;if(gt===0){for(let q of[-P*.46,0,P*.46]){let Et=q?2.6:3.3,wt=q?3.7:4.5,Nt=new Or;Nt.moveTo(-Et/2,0),Nt.lineTo(Et/2,0),Nt.lineTo(Et/2,wt-Et/2),Nt.absarc(0,wt-Et/2,Et/2,0,Math.PI,!1),Nt.lineTo(-Et/2,0);let et=new Ke(new Ul(Nt,14),F);et.position.set(q,rt.y+.02,me),H.add(et)}bn(pt,-2.2,2.2,rt.y+4.9,rt.y+5.7,me,me+.12,"#2b2622");for(let q of[-P*.7,-P*.23,P*.23,P*.7]){let Et=new Ke(new Xi(.42,10,7),_t);Et.position.set(q,Ce-.75,ft+.55),Et.scale.y=1.22,H.add(Et)}}else if(gt===1){bn(pt,-1.8,1.8,rt.y,rt.y+3.4,me-.02,me+.06,"#3a2a1f");for(let q of[-1,1])bn(pt,q*5.2-1.1,q*5.2+1.1,rt.y+1.4,rt.y+3.2,me-.02,me+.05,"#3a3029")}else if(gt===2){for(let Et=0;Et<=5;Et++){let wt=-P+1.2+Et*(2*P-2.4)/5;we(H,wt,rt.y,ft+.42,.2,rt.h-.1,_t)}for(let Et=0;Et<5;Et++){let wt=-P+1.2+(Et+.5)*(2*P-2.4)/5,Nt=(2*P-2.4)/5-.5;bn(pt,wt-Nt/2,wt+Nt/2,rt.y+.2,rt.y+rt.h*.72,me-.02,me+.05,"#8a3a2a");for(let et=1;et<4;et++)bn(pt,wt-Nt/2,wt+Nt/2,rt.y+.2+et*rt.h*.18-.04,rt.y+.2+et*rt.h*.18+.04,me,me+.08,"#4a2a20")}bn(pt,-2,2,Ce-1.3,Ce-.5,me+.05,me+.14,"#2b2622")}else{for(let q of[ft+.05,ut-.05])for(let Et=0;Et<3;Et++)for(let wt=0;wt<5;wt++){let Nt=-P+(wt+.5)*2*P/5,et=rt.y+.9+Et*3.3;bn(pt,Nt-.85,Nt+.85,et,et+1.7,q-.03,q+.03,"#3a2a1f"),bn(pt,Nt-.04,Nt+.04,et,et+1.7,q-.05,q+.05,"#5a4633")}for(let q=1;q<3;q++)bn(pt,-P,P,rt.y+q*3.3+.2,rt.y+q*3.3+.38,ft,ft+.45,"#5a4633")}if(rt.court>0){let q=rt.back,Et=rt.hallBack,wt=rt.wing;for(let Xt of[-1,1]){let Pe=Xt*P,ln=Xt*(P-wt),rn=gt===2?3.2:3.6,Zn=rt.y+rn+1.1,Gs=rt.y+rn-.1;bn(J,Math.min(Pe,ln),Math.max(Pe,ln),rt.y,rt.y+rn,q+.02,Et-.02,j),bn(J,Math.min(Pe,Pe-Xt*.3),Math.max(Pe,Pe-Xt*.3),rt.y+rn,Zn,q+.02,Et-.02,j),at.quad([Pe,Zn,q],[Pe,Zn,Et],[ln-Xt*.6,Gs,Et],[ln-Xt*.6,Gs,q],Y,[[q/6,0],[Et/6,0],[Et/6,(wt+.6)/6],[q/6,(wt+.6)/6]]);let Fi=ln-Xt*.05;if(gt===2)for(let wn=0;wn<4;wn++){let qn=q+(Et-q)*(wn+.5)/4;bn(pt,Math.min(Fi,Fi-Xt*.18),Math.max(Fi,Fi-Xt*.18),rt.y+.3,rt.y+2.3,qn-.55,qn+.55,"#77736a")}else for(let wn=0;wn<2;wn++){let qn=q+(Et-q)*(wn+.5)/2;bn(pt,Math.min(Fi,Fi-Xt*.06),Math.max(Fi,Fi-Xt*.06),rt.y+1,rt.y+2.6,qn-.7,qn+.7,"#3a3029")}}let Nt=yt[gt+1],et=Nt.y-rt.y,Ut=Math.max(1,Math.ceil(et/.18)),ge=Math.min(.32,(Et-q)*.7/Ut);for(let Xt=0;Xt<Ut;Xt++)bn(pt,-3,3,rt.y-.05,Nt.y-Xt*et/Ut,q+Xt*ge,q+(Xt+1)*ge,"#c2bfb0")}}{let gt=yt[0],rt=v(...E(0,U+3))-D,ut=gt.y-rt;if(ut>.25){let ft=Math.ceil(ut/.17),st=.33;for(let Tt=0;Tt<ft;Tt++)bn(pt,-4.5,4.5,Math.min(rt,Ht)-1,gt.y-(Tt+1)*ut/ft,U+Tt*st,U+(Tt+1)*st,"#c2bfb0");for(let Tt of[-1,1])bn(pt,Tt*5.4-.5,Tt*5.4+.5,rt,rt+.7,U+ft*st-1.1,U+ft*st-.1,"#9f9d92"),bn(pt,Tt*5.4-.35,Tt*5.4+.35,rt+.7,rt+1.8,U+ft*st-.95,U+ft*st-.25,"#9f9d92")}}J.mesh(ct("#ffffff",{vertexColors:!0,map:Ot,side:mn}),H),at.mesh(ct("#ffffff",{vertexColors:!0,map:Ct,side:mn}),H),pt.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),H),br.set("\u5316\u57CE\u5BFA",D+yt[2].y+yt[2].h+yt[2].rise);let ot=t.places.find(gt=>gt.n==="\u5316\u57CE\u5BFA");ot&&(ot.modelNote="\u6A21\u578B\u6309 OpenStreetMap \u5B9E\u6D4B\u5360\u5730\uFF08\u7EA6 59 \xD7 20 \u7C73\uFF0C\u8F74\u7EBF\u671D\u5411\u653E\u751F\u6C60\uFF09\u590D\u539F\u56DB\u8FDB\u9662\u843D\uFF1A\u7075\u5B98\u6BBF\u3001\u5929\u738B\u6BBF\u3001\u5927\u96C4\u5B9D\u6BBF\u3001\u85CF\u7ECF\u697C\uFF0C\u8FDB\u6DF1\u6309\u5B98\u65B9\u89C4\u5212\u6BD4\u4F8B\u7F29\u653E\uFF0C\u53F0\u57FA\u9010\u8FDB\u5347\u9AD8 3.7 / 1.5 / \u7EA6 1.2 / 2.7 \u7C73\uFF1B\u7B2C\u4E09\u3001\u56DB\u8FDB\u4E4B\u95F4\u4E3A\u7891\u5ECA\u9662\u3002\u5355\u4F53\u7ACB\u9762\u4E0E\u7EC6\u90E8\u4E3A\u8FD1\u4F3C\u3002")}}{let l=t.buildings.find(_=>_.id===hi),m=t.places.find(_=>_.n==="\u8089\u8EAB\u5B9D\u6BBF");if(l&&m){let[_,b]=l.rectCenter,{rot:E,wp:P}=Va(_,b,-l.axis[0],-l.axis[1]),U=l.depth,X=l.width,H=ar(_,b,"\u8089\u8EAB\u5B9D\u6BBF");H.rotation.y=E;let D=H.position.y,j=ct("#55606a",{roughness:.7,metalness:.25}),Y=-1e9,k=1e9;for(let kt=-2;kt<=2;kt++)for(let St=-2;St<=2;St++){let O=v(...P(kt*U/4,St*X/4));Y=Math.max(Y,O),k=Math.min(k,O)}let Z=Y-D+.9,J=U-3.6,at=X-3.6;qt(H,0,k-D-1,0,U+1.2,Z-(k-D-1),X+1.2,be),qt(H,0,Z,0,J,6.2,at,_t),or(H,0,Z+6.2,0,U+1.2,X+1.2,2.4,j,{hip:!0,upturn:!0}),qt(H,0,Z+6.2,0,J*.72,4.6,at*.72,_t),or(H,0,Z+10.8,0,J*.72+2.6,at*.72+2.6,3.6,j,{hip:!0,upturn:!0});let pt=[...Array(6)].map((kt,St)=>-(U/2-.45)+St*(U-.9)/5),Dt=[1,2,3,4].map(kt=>-(X/2-.45)+kt*(X-.9)/5);for(let kt of[-1,1]){for(let St of pt)we(H,St,Z,kt*(X/2-.45),.22,6.2,be);for(let St of Dt)we(H,kt*(U/2-.45),Z,St,.22,6.2,be)}for(let kt of[-J/3,0,J/3])qt(H,kt,Z+.1,at/2+.02,J/3-.5,4.3,.1,F);qt(H,0,Z+4.8,at/2+.08,2.6,.8,.12,I);let yt=v(...P(0,X/2+2.5))-D,Ht=Z-yt;if(Ht>.2){let kt=Math.ceil(Ht/.17);for(let St=0;St<kt;St++)qt(H,0,yt-.6,X/2+.6+St*.32+.16,6,Z-(St+1)*Ht/kt-(yt-.6),.32,be)}br.set("\u8089\u8EAB\u5B9D\u6BBF",D+Z+14.4),m.modelNote="\u6309\u5B98\u65B9\u63CF\u8FF0\u590D\u539F\u5317\u5411\u5165\u53E3\u3001\u7EA2\u5899\u3001\u6DF1\u8272\u94C1\u74E6\u91CD\u6A90\u6B47\u5C71\u3001\u7EA6 15 \u7C73\u6BBF\u9AD8\u4E0E 20 \u6839\u5916\u56F4\u77F3\u67F1\uFF1B\u4E3B\u6BBF\u843D\u5728\u5730\u56FE\u70B9\u4F4D\u5904\u7684\u5F71\u50CF\u8BC6\u522B\u8F6E\u5ED3\u4E0A\uFF0C\u4E24\u4FA7\u9EC4\u5899\u914D\u6BBF\u6309\u5404\u81EA\u8F6E\u5ED3\u5EFA\u6A21\u3002\u6BBF\u4F53\u6BD4\u4F8B\u4E0E\u53F0\u9636\u4E3A\u8FD1\u4F3C\u3002"}}function pi(l,m,_,{repeat:b=!1}={}){let E=document.createElement("canvas");E.width=l,E.height=m,_(E.getContext("2d"),l,m);let P=new as(E);return P.colorSpace=kn,P.anisotropy=8,b&&(P.wrapS=P.wrapT=ro),P}function As(l,m,_,b,E,P,U,{back:X=!1,emissive:H=0}={}){let D=new Ke(new _s(E,P),Be({map:U,roughness:.6,emissive:H?"#ffffff":"#000000",emissiveMap:H?U:null,emissiveIntensity:H}));return D.position.set(m,_+P/2,b),X&&(D.rotation.y=Math.PI),l.add(D),D}let au='"Songti SC","STSong","Noto Serif SC","PingFang SC",serif';function Xd(l,m){let _=ii((l+e/2)/e*(s-1),0,s-1.001),b=ii((m+n/2)/n*(s-1),0,s-1.001),E=_|0,P=b|0,U=_-E,X=b-P,H=o[P*s+E],D=o[P*s+E+1],j=o[(P+1)*s+E],Y=o[(P+1)*s+E+1];return U+X<=1?H+U*(D-H)+X*(j-H):Y+(1-U)*(j-Y)+(1-X)*(D-Y)}function mi(l,m){let _=Xd(l,m);return y?y.height(l,m,_):_}function qd(l,m,_,b,E=3.5,P=[]){let U=Ks.triangulateShape(m.map(D=>new fe(D[0],D[1])),P.map(D=>D.map(j=>new fe(j[0],j[1])))),X=m.concat(...P),H=(D,j,Y)=>{if(Math.max(Math.hypot(D[0]-j[0],D[1]-j[1]),Math.hypot(j[0]-Y[0],j[1]-Y[1]),Math.hypot(Y[0]-D[0],Y[1]-D[1]))>E){let Z=(Dt,yt)=>[(Dt[0]+yt[0])/2,(Dt[1]+yt[1])/2],J=Z(D,j),at=Z(j,Y),pt=Z(Y,D);H(D,J,pt),H(J,j,at),H(pt,at,Y),H(J,at,pt);return}(j[1]-D[1])*(Y[0]-D[0])-(j[0]-D[0])*(Y[1]-D[1])<0&&([j,Y]=[Y,j]),l.tri([D[0],mi(...D)+_,D[1]],[j[0],mi(...j)+_,j[1]],[Y[0],mi(...Y)+_,Y[1]],b)};for(let[D,j,Y]of U)H(X[D],X[j],X[Y])}function Yd(l){let m=0;return l.forEach((_,b)=>{let E=l[(b+1)%l.length];m+=_[0]*E[1]-E[0]*_[1]}),m>0?1:-1}function $d(l,m,{h:_=.3,w:b=.35,co:E="#a39e91"}={}){let P=Yd(m);for(let U=0;U<m.length;U++){let X=m[U],H=m[(U+1)%m.length],D=Math.hypot(H[0]-X[0],H[1]-X[1]);if(D<.05)continue;let j=Math.ceil(D/2.5),Y=-P*(H[1]-X[1])/D*b,k=P*(H[0]-X[0])/D*b;for(let Z=0;Z<j;Z++){let J=[X[0]+(H[0]-X[0])*Z/j,X[1]+(H[1]-X[1])*Z/j],at=[X[0]+(H[0]-X[0])*(Z+1)/j,X[1]+(H[1]-X[1])*(Z+1)/j],pt=mi(...J),Dt=mi(...at),yt=[J[0]+Y,J[1]+k],Ht=[at[0]+Y,at[1]+k],kt=mi(...yt),St=mi(...Ht);l.quad([J[0],pt-.25,J[1]],[at[0],Dt-.25,at[1]],[at[0],Dt+_,at[1]],[J[0],pt+_,J[1]],E),l.quad([J[0],pt+_,J[1]],[at[0],Dt+_,at[1]],[Ht[0],St+_,Ht[1]],[yt[0],kt+_,yt[1]],E),l.quad([yt[0],kt+_,yt[1]],[Ht[0],St+_,Ht[1]],[Ht[0],St+.08,Ht[1]],[yt[0],kt+.08,yt[1]],E)}}}{let l=t.areas.filter(_=>_.kind==="plaza"),m=t.areas.find(_=>_.id==="r4-plaza-lawn");if(l.length){let _=pi(512,512,(D,j)=>{let Y=Ni(311),k=64;D.fillStyle="#7f7a70",D.fillRect(0,0,j,j);for(let Z=0;Z<16;Z++)for(let J=-1;J<9;J++){let at=Y(),pt=J*k+Z%2*k/2,Dt=Z*k/2,yt=((Math.floor((pt+k/4)/256)+Math.floor(Dt/256))%2+2)%2,Ht=yt?[172,166,153]:[188,182,168];D.fillStyle=`rgb(${Ht[0]+at*18|0},${Ht[1]+at*16|0},${Ht[2]+at*14|0})`,D.fillRect(pt+1.5,Dt+1.5,k-3,k/2-3)}D.fillStyle="#857f73",D.fillRect(0,0,j,32),D.fillRect(0,0,32,j),D.fillStyle="#c9c2b0",D.fillRect(0,32,j,5),D.fillRect(32,0,5,j),D.fillRect(0,0,j,3),D.fillRect(0,0,3,j);for(let Z=0;Z<12e3;Z++)D.fillStyle=`rgba(${Y()<.5?"255,255,255":"40,40,36"},${Y()*.1})`,D.fillRect(Y()*j,Y()*j,1.5,1.5)},{repeat:!0}),b=new G,E=new G,P=(D,j)=>{let Y=!1;for(let k=0,Z=j.length-1;k<j.length;Z=k++){let J=j[k],at=j[Z];J[1]>D[1]!=at[1]>D[1]&&D[0]<(at[0]-J[0])*(D[1]-J[1])/(at[1]-J[1])+J[0]&&(Y=!Y)}return Y};for(let D of l)qd(b,D.ring,.16,"#ffffff",3.5,m&&m.ring.every(j=>P(j,D.ring))?[m.ring]:[]),$d(E,D.ring);let U=b.mesh(ct("#ffffff",{map:_,roughness:.93}),At);if(U.castShadow=!1,m){let D=pi(256,256,(O,ot)=>{let gt=Ni(77);O.fillStyle="#6f8b4f",O.fillRect(0,0,ot,ot);for(let rt=0;rt<6e3;rt++)O.fillStyle=`rgba(${gt()<.5?"150,180,100":"50,80,40"},${.25*gt()})`,O.fillRect(gt()*ot,gt()*ot,1,2+gt()*3)},{repeat:!0}),j=new G;qd(j,m.ring,.24,"#ffffff",1.5);let Y=j.mesh(ct("#ffffff",{map:D,roughness:1}),At);Y.castShadow=!1,$d(E,m.ring,{h:.4,w:.3,co:"#b3ad9f"});let k=m.ring,Z=[k.reduce((O,ot)=>O+ot[0],0)/k.length,k.reduce((O,ot)=>O+ot[1],0)/k.length],J=[k[1][0]-k[0][0],k[1][1]-k[0][1]],at=[k[2][0]-k[1][0],k[2][1]-k[1][1]],pt=Math.hypot(...J),Dt=Math.hypot(...at),yt=[J[0]/pt,J[1]/pt],Ht=[at[0]/Dt,at[1]/Dt],kt=[];for(let O=0;O<=128;O++){let ot=O/128*Math.PI*2;kt.push([Z[0]+yt[0]*Math.cos(ot)*pt*.36+Ht[0]*Math.sin(ot)*Dt*.4,Z[1]+yt[1]*Math.cos(ot)*pt*.36+Ht[1]*Math.sin(ot)*Dt*.4])}let St=new G;for(let O=1;O<kt.length;O++){let ot=kt[O-1],gt=kt[O],rt=Math.hypot(gt[0]-ot[0],gt[1]-ot[1]),ut=-(gt[1]-ot[1])/rt*.8,ft=(gt[0]-ot[0])/rt*.8;St.quad([ot[0]-ut,mi(ot[0]-ut,ot[1]-ft)+.45,ot[1]-ft],[gt[0]-ut,mi(gt[0]-ut,gt[1]-ft)+.45,gt[1]-ft],[gt[0]+ut,mi(gt[0]+ut,gt[1]+ft)+.45,gt[1]+ft],[ot[0]+ut,mi(ot[0]+ut,ot[1]+ft)+.45,ot[1]+ft],"#c9c3b2")}St.mesh(ct("#ffffff",{vertexColors:!0,roughness:.95,side:mn,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),At)}E.mesh(ct("#ffffff",{vertexColors:!0,roughness:.9,side:mn}),At);let X=[];for(let D of l){let j=Yd(D.ring),Y=8;for(let k=0;k<D.ring.length;k++){let Z=D.ring[k],J=D.ring[(k+1)%D.ring.length],at=Math.hypot(J[0]-Z[0],J[1]-Z[1]);if(at<.05)continue;let pt=-j*(J[1]-Z[1])/at,Dt=j*(J[0]-Z[0])/at;for(let yt=Y;yt<at;yt+=16){let Ht=Z[0]+(J[0]-Z[0])*yt/at+pt*1.2,kt=Z[1]+(J[1]-Z[1])*yt/at+Dt*1.2;X.push([Ht,mi(Ht,kt)+.16,kt])}Y=((Y-at)%16+16)%16}}if(X.length){let D=new vi,j=new Nr(new Wi(.07,.11,4.2,6),ct("#34383a",{roughness:.5,metalness:.4}),X.length),Y=new Nr(new Ci(.46,.62,.46),Be({color:"#f3e2b8",emissive:"#ffcf7a",emissiveIntensity:.45,roughness:.5}),X.length),k=new Nr(new oo(.42,.34,4),ct("#2f3333"),X.length);X.forEach((Z,J)=>{D.rotation.set(0,Math.PI/4,0),D.position.set(Z[0],Z[1]+2.1,Z[2]),D.updateMatrix(),j.setMatrixAt(J,D.matrix),D.position.set(Z[0],Z[1]+4.45,Z[2]),D.updateMatrix(),Y.setMatrixAt(J,D.matrix),D.position.set(Z[0],Z[1]+4.93,Z[2]),D.updateMatrix(),k.setMatrixAt(J,D.matrix)});for(let Z of[j,Y,k])Z.castShadow=!0,Rt.add(Z)}let H=t.places.find(D=>D.n==="\u795E\u5149\u5CAD\u5E7F\u573A");H&&(br.set(H.n,v(H.x,H.z)+3),H.modelNote="\u5E7F\u573A\u94FA\u88C5\u3001\u8DEF\u7F18\u3001\u706F\u67F1\u4E0E\u897F\u5317\u89D2\u8349\u576A\u6309\u536B\u661F\u5F71\u50CF\u793A\u610F\u590D\u539F\uFF1B\u94FA\u5730\u7EB9\u6837\u4E0E\u706F\u5177\u6837\u5F0F\u4E3A\u793A\u610F\u3002")}}for(let l of t.roads){if(l.model!=="stair")continue;let[m,_]=l.pts,b=Math.hypot(_[0]-m[0],_[1]-m[1]),E=l.width/2,P=.4,U=E-P,{rot:X,wp:H}=Va(m[0],m[1],(_[0]-m[0])/b,(_[1]-m[1])/b),D=ar(m[0],m[1],"\u4E09\u89D2\u6D32\u8F66\u7AD9");D.rotation.y=X;let j=D.position.y,Y=(ot,gt)=>{let[rt,ut]=H(ot,gt);return Math.max(v(rt,ut),mi(rt,ut))},k=.25,Z=Math.ceil(b/k),J=[];for(let ot=0;ot<=Z;ot++){let gt=-1e9;for(let rt=-E;rt<=E+.01;rt+=E/3)gt=Math.max(gt,Y(rt,Math.min(b,ot*k)));J.push(gt+.06)}for(let ot=Z-1;ot>=0;ot--)J[ot]=Math.max(J[ot],J[ot+1]);let at=J[0],pt=J[Z],Dt=Math.max(1,Math.round((at-pt)/.15)),yt=(at-pt)/Dt,Ht=ct("#bdb8aa",{roughness:.85}),kt=ct("#9d998b",{roughness:.9}),St=ct("#d2cdc0",{roughness:.8});for(let ot=0,gt=0,rt=0;ot<Dt&&rt<b;ot++){let ut=at-ot*yt;for(;gt<Z&&J[gt]>ut-yt+1e-6;)gt++;let ft=Math.min(b,Math.max(rt+.28,gt*k)),st=(rt+ft)/2,Tt=1e9;for(let ae of[rt,st,ft])for(let he of[-E,0,E])Tt=Math.min(Tt,Y(he,ae));let Ce=Tt-.8-j,It=ut-j;qt(D,0,Ce,st,2*U,It-Ce,ft-rt,Ht);for(let ae of[-1,1])qt(D,ae*(U+P/2),Ce,st,P,It+.85-Ce,ft-rt,kt),qt(D,ae*(U+P/2),It+.85,st,P+.1,.1,ft-rt,St);rt=ft}let O=t.places.find(ot=>ot.n==="\u4E09\u89D2\u6D32\u8F66\u7AD9");O&&(O.modelNote="\u8F66\u7AD9\u65C1\u4E0B\u5230\u795E\u5149\u5CAD\u5E7F\u573A\u7684\u53F0\u9636\u6309\u7528\u6237\u8BF4\u660E\u793A\u610F\u590D\u539F\uFF1A\u9AD8\u5DEE\u7EA6 12 \u7C73\uFF08\u5E7F\u573A\u5730\u9762\u5DF2\u6309\u6B64\u4FEE\u6B63\uFF09\uFF1B\u53F0\u9636\u5BBD\u5EA6\u3001\u7EA7\u6570\u548C\u8E0F\u6B65\u5C3A\u5BF8\u4E3A\u4F30\u8BA1\u3002")}{let l=t.buildings.find(_=>_.osmId===609909704),m=t.places.find(_=>_.n==="\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");if(l){let[_,b]=l.rectCenter,E=-l.axis[1],P=l.axis[0];v(_+E*6,b+P*6)>v(_-E*6,b-P*6)&&(E=-E,P=-P);let{rot:U,wp:X}=Va(_,b,E,P),H=ar(_,b,m?m.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");H.rotation.y=U;let D=H.position.y,j=l.width,Y=l.depth,k=-1e9,Z=1e9;for(let q=-3;q<=3;q++){k=Math.max(k,v(...X(q*j/6,-Y/2)),v(...X(q*j/6,0)));for(let Et of[-Y/2,0,Y/2,Y/2+4])Z=Math.min(Z,v(...X(q*j/6,Et)))}let J=v(...X(0,Y/2+3))-D,at=Math.max(k-D+.25,J+1.2),pt=Z-D-1.2,Dt=ct("#b3312a",{roughness:.7}),yt=ct("#dcd9cf",{roughness:.6}),Ht=ct("#5d6a74",{roughness:.8}),kt=ct("#2a6184",{roughness:.7}),St=new Pn;St.position.y=at,H.add(St),qt(H,0,pt,(-Y/2+2.8)/2,j-.2,at-pt,2.8+Y/2,be);{let q=at-J,Et=Math.max(1,Math.ceil(q/.16)),wt=new G;for(let Nt=0;Nt<Et;Nt++){let et=at-(Nt+1)*q/Et,Ut=2.8+Nt*.32;qt(H,0,pt,Ut+.16,17,et-pt,.32,yt);for(let ge of[-1,1]){let Xt=ge*8.72;wt.quad([Xt-.14*ge,et,Ut],[Xt-.14*ge,et,Ut+.32],[Xt-.14*ge,et+.9,Ut+.32],[Xt-.14*ge,et+.9,Ut],"#e2dfd6"),wt.quad([Xt+.14*ge,et,Ut],[Xt+.14*ge,et,Ut+.32],[Xt+.14*ge,et+.9,Ut+.32],[Xt+.14*ge,et+.9,Ut],"#d6d3c9"),wt.quad([Xt-.14,et+.9,Ut],[Xt+.14,et+.9,Ut],[Xt+.14,et+.9,Ut+.32],[Xt-.14,et+.9,Ut+.32],"#eeebe3"),Nt%3===0&&qt(H,Xt,et,Ut+.16,.3,1.15,.3,yt)}}wt.mesh(ct("#ffffff",{vertexColors:!0,roughness:.6,side:mn}),H)}let O=10.7,ot=9,gt=new Or,rt=(q,Et,wt)=>{gt.lineTo(q-Et,0),gt.lineTo(q-Et,wt),gt.absarc(q,wt,Et,Math.PI,0,!0),gt.lineTo(q+Et,0)};gt.moveTo(-O,0),rt(-6.8,1.9,3.9),rt(0,2.7,5.2),rt(6.8,1.9,3.9),gt.lineTo(O,0),gt.lineTo(O,ot),gt.lineTo(-O,ot),gt.lineTo(-O,0);let ut=new Ke(new Dl(gt,{depth:1.5,bevelEnabled:!1,curveSegments:18}),Dt);ut.position.z=-.2,ut.castShadow=ut.receiveShadow=!0,St.add(ut);for(let[q,Et,wt]of[[-6.8,1.9,3.9],[0,2.7,5.2],[6.8,1.9,3.9]]){let Nt=new Or;Nt.moveTo(q-Et-.32,0),Nt.lineTo(q-Et-.32,wt),Nt.absarc(q,wt,Et+.32,Math.PI,0,!0),Nt.lineTo(q+Et+.32,0),Nt.lineTo(q+Et,0),Nt.lineTo(q+Et,wt),Nt.absarc(q,wt,Et,0,Math.PI,!1),Nt.lineTo(q-Et,0),Nt.lineTo(q-Et-.32,0);let et=new Ke(new Dl(Nt,{depth:.06,bevelEnabled:!1,curveSegments:18}),ct("#e4ddca",{roughness:.6}));et.position.z=1.3,St.add(et)}for(let q of[-9.7,-3.8,3.8,9.7])qt(St,q,0,.55,q*q>40?2.3:2.5,.7,1.8,yt);let ft=q=>pi(128,700,(Et,wt,Nt)=>{Et.fillStyle="#a52a22",Et.fillRect(0,0,wt,Nt),Et.strokeStyle="#d9b04a",Et.lineWidth=5,Et.strokeRect(8,8,wt-16,Nt-16),Et.fillStyle="#f0c85a",Et.font=`700 70px ${au}`,Et.textAlign="center",Et.textBaseline="middle",[...q].forEach((et,Ut)=>Et.fillText(et,wt/2,50+Ut*(Nt-100)/(q.length-1)))});As(St,-3.8,2.95,1.33,1.05,5.85,ft("\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B")),As(St,3.8,2.95,1.33,1.05,5.85,ft("\u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0"));let st=pi(2048,160,(q,Et,wt)=>{q.fillStyle="#1f4f78",q.fillRect(0,0,Et,wt),q.fillStyle="#2f8466",q.fillRect(0,0,Et,26),q.fillRect(0,wt-26,Et,26),q.fillStyle="#d8ad45",q.fillRect(0,26,Et,5),q.fillRect(0,wt-31,Et,5);let Nt=Ni(5);for(let et=40;et<Et;et+=170){q.strokeStyle="#e8e4d6",q.lineWidth=4,q.beginPath(),q.arc(et,wt/2,34,0,Math.PI*2),q.stroke(),q.fillStyle="#3a7fb0",q.beginPath(),q.arc(et,wt/2,26,0,Math.PI*2),q.fill(),q.fillStyle="#d8ad45",q.beginPath(),q.arc(et,wt/2,9,0,Math.PI*2),q.fill(),q.strokeStyle="#d8ad45",q.lineWidth=5,q.beginPath(),q.moveTo(et+48,wt/2);for(let Ut=0;Ut<6;Ut++)q.quadraticCurveTo(et+58+Ut*14,wt/2+(Ut%2?-22:22)*(.6+Nt()*.4),et+66+Ut*14,wt/2);q.stroke()}for(let et=0;et<Et;et+=18)q.fillStyle=et%36?"#f4f1e6":"#c44b3a",q.fillRect(et,8,10,10),q.fillRect(et,wt-18,10,10)});qt(St,0,ot,.55,2*O+.5,1.75,1.75,kt),As(St,0,ot,1.43,2*O+.5,1.75,st),As(St,0,ot,-.33,2*O+.5,1.75,st,{back:!0});let Tt=pi(840,250,(q,Et,wt)=>{q.fillStyle="#b8862f",q.fillRect(0,0,Et,wt),q.fillStyle="#e3bf62",q.fillRect(10,10,Et-20,wt-20),q.fillStyle="#161412",q.fillRect(34,34,Et-68,wt-68),q.fillStyle="#e6c25e",q.font=`700 132px ${au}`,q.textAlign="center",q.textBaseline="middle",["\u76E1","\u7121","\u9858","\u884C"].forEach((Nt,et)=>q.fillText(Nt,Et*(.2+.2*et),wt/2+4))});As(St,0,ot+.15,1.5,4.2,1.25,Tt,{emissive:.12});let Ce=pi(512,160,(q,Et,wt)=>{q.fillStyle="#2c6a52",q.fillRect(0,0,Et,wt);for(let Nt=0;Nt<Et;Nt+=64)q.fillStyle="#1f4f78",q.fillRect(Nt+6,20,52,70),q.fillStyle="#d8ad45",q.fillRect(Nt+26,10,12,90),q.fillStyle="#8a2f25",q.fillRect(Nt+4,100,56,40);q.fillStyle="#d8ad45",q.fillRect(0,0,Et,6),q.fillRect(0,wt-6,Et,6)});qt(St,0,ot+1.75,.55,6.8,2.55,1.3,kt),As(St,0,ot+1.75,1.21,6.8,2.55,Ce),As(St,0,ot+1.75,-.11,6.8,2.55,Ce,{back:!0});let It=pi(180,320,(q,Et,wt)=>{q.fillStyle="#c79a3c",q.fillRect(0,0,Et,wt),q.fillStyle="#1a1715",q.fillRect(22,34,Et-44,wt-68),q.fillStyle="#e6c25e",q.font=`700 92px ${au}`,q.textAlign="center",q.textBaseline="middle",q.fillText("\u5C71",Et/2,wt*.33),q.fillText("\u9580",Et/2,wt*.68)});As(St,0,ot+1.95,1.25,.8,1.45,It,{emissive:.12});for(let q of[-1,1])qt(St,q*6.8,ot+1.75,.55,4.8,1.05,1.1,kt),As(St,q*6.8,ot+1.75,1.11,4.8,1.05,Ce);or(St,0,ot+4.3,.55,9.4,4.8,2.3,Ht,{hip:!0,upturn:!0});for(let q of[-1,1])or(St,q*6.8,ot+2.8,.55,6.4,4.2,1.8,Ht,{hip:!0,upturn:!0}),or(St,q*10.4,ot+1.7,.55,3.6,3.8,1.5,Ht,{hip:!0,upturn:!0});{let q=ot+4.3+2.3,Et=ct("#3d4a44",{roughness:.6,metalness:.2}),wt=new Ke(new Xi(.26,12,10),I);wt.position.set(0,q+.55,.55),St.add(wt),we(St,0,q,.55,.08,.35,I);for(let Nt of[-1,1]){let et=[];for(let Pe=0;Pe<=12;Pe++){let ln=Pe/12;et.push(new W(Nt*(.45+ln*2.1),q+.12+Math.sin(ln*Math.PI*2.2)*.22+(1-ln)*.25,.55))}let Ut=new Ke(new Ch(new Lo(et),32,.09,6),Et);St.add(Ut);let ge=new Ke(new Xi(.16,8,6),Et);ge.position.copy(et[0]),ge.position.y+=.12,St.add(ge);let Xt=qt(St,Nt*2.78,q-.1,.55,.28,.95,.32,Et);Xt.rotation.z=-Nt*.25}}let ae=pi(128,128,(q,Et)=>{q.fillStyle="#22201e",q.fillRect(0,0,Et,Et);for(let wt of[32,96])for(let Nt of[32,96]){let et=q.createRadialGradient(wt-5,Nt-5,2,wt,Nt,15);et.addColorStop(0,"#77716a"),et.addColorStop(1,"#2a2724"),q.fillStyle=et,q.beginPath(),q.arc(wt,Nt,13,0,Math.PI*2),q.fill()}},{repeat:!0});ae.repeat.set(2,2);let he=new Or,se=q=>{let Et=Math.abs(q);return Et<3.9?6.7+.9*(q/3.9)**2:5.3+.9*((Et-7.15)/3.25)**2};he.moveTo(-10.4,0),he.lineTo(10.4,0);for(let q=0;q<=80;q++){let Et=10.4-q*20.8/80;he.lineTo(Et,se(Et))}he.lineTo(-10.4,0);let ne=new Ke(new Ul(he,4),Be({map:ae,roughness:.55,metalness:.35,side:mn}));ne.position.z=-1.15,St.add(ne);for(let q of[-1,1]){let Et=new Ke(new Rh(.24,.045,6,16),I);Et.position.set(q*.75,3.1,-1.08),St.add(Et)}let me=ct("#cfcbc0",{roughness:.8});for(let q of[-9.7,-3.8,3.8,9.7]){qt(St,q,0,2.05,1.15,1.25,1.25,yt);let Et=new Pn;Et.position.set(q,1.25,2.05),St.add(Et),qt(Et,0,0,-.05,.62,.75,.95,me);let wt=new Ke(new Xi(.4,10,8),me);wt.position.set(0,1.05,.2),wt.scale.set(1,.95,.85),Et.add(wt);let Nt=new Ke(new Xi(.47,10,8),me);Nt.position.set(0,.95,.05),Nt.scale.set(1.05,1,.7),Et.add(Nt);let et=new Ke(new Xi(.17,8,6),me);et.position.set(q<0?.22:-.22,.1,.42),Et.add(et)}for(let q of[-1,1])qt(St,q*11.75,0,.1,1.7,4.2,.9,ct("#d6a13a")),qt(St,q*11.75,4.2,.1,2,.32,1.3,Ht);br.set(m?m.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8",D+at+17),m&&(m.modelNote="\u95E8\u697C\u6309\u7528\u6237\u63D0\u4F9B\u7684\u5B9E\u666F\u7167\u7247\u590D\u539F\uFF1A\u4E09\u62F1\u7EA2\u8272\u724C\u697C\u3001\u5185\u4FA7\u4E24\u67F1\u91D1\u5B57\u5BF9\u8054\uFF08\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B / \u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0\uFF09\u3001\u5F69\u753B\u989D\u678B\u3001\u4E2D\u533E\u201C\u884C\u9858\u7121\u76E1\u201D\u3001\u4E0A\u90E8\u201C\u5C71\u9580\u201D\u7AD6\u533E\u3001\u4E94\u5EA7\u5C4B\u9876\uFF0C\u62F1\u540E\u4E3A\u9ED1\u8272\u94C1\u9489\u5927\u95E8\uFF0C\u95E8\u524D\u77F3\u72EE\u4E0E\u6C49\u767D\u7389\u680F\u6746\u77F3\u9636\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002")}}{let l=t.buildings.find(b=>b.osmId===609909706),m=t.buildings.find(b=>b.osmId===609909704),_=t.places.find(b=>b.n==="\u8089\u8EAB\u5B9D\u6BBF-\u5730\u85CF\u7985\u5BFA");if(l){let[b,E]=l.rectCenter,P=-l.axis[0],U=-l.axis[1];m&&(m.center[0]-b)*P+(m.center[1]-E)*U<0&&(P=-P,U=-U);let{rot:X,wp:H}=Va(b,E,P,U),D=Math.cos(X),j=Math.sin(X),Y=([et,Ut])=>[(et-b)*D-(Ut-E)*j,(et-b)*j+(Ut-E)*D],k=l.ring.map(Y),Z=k.map(et=>et[0]),J=(Math.max(...Z)-Math.min(...Z))/2,at=(Math.max(...Z)+Math.min(...Z))/2,pt=k.filter(et=>Math.abs(et[0]-at)>J*.6),Dt=Math.max(...pt.map(et=>et[1])),yt=Math.min(...pt.map(et=>et[1])),Ht=Math.min(...k.map(et=>et[1])),kt=k.filter(et=>et[1]<yt-.5),St=ar(b,E,_?_.n:"\u5730\u85CF\u7985\u5BFA");St.rotation.y=X;let O=St.position.y,ot=ct("#a8302a",{roughness:.7}),gt=ct("#5d6a74",{roughness:.8}),rt=ct("#d6a23c"),ut=ct("#4a2a22"),ft=[],st=1e9;for(let et=0;et<=6;et++)for(let Ut=0;Ut<=6;Ut++){let ge=v(...H(at-J+et*J/3,yt+(Dt-yt)*Ut/6));ft.push(ge),st=Math.min(st,ge)}ft.sort((et,Ut)=>et-Ut);let Tt=ft[Math.floor(ft.length*.7)]-O+.5,Ce=st-O-1.2,It=2*J,ae=Dt-yt,he=(Dt+yt)/2;qt(St,at,Ce,he,It+1.6,Tt-Ce,ae+1.6,be);{let et=v(...H(at,Dt+4))-O,Ut=Tt-et;if(Ut>.2){let ge=Math.ceil(Ut/.16);for(let Xt=0;Xt<ge;Xt++)qt(St,at,Ce,Dt+.8+Xt*.3+.15,10,Tt-(Xt+1)*Ut/ge-Ce,.3,be);for(let Xt of[-1,1])qt(St,at+Xt*5.3,Ce,Dt+.8+ge*.15,.5,Tt+.9-Ce,ge*.3,be)}}let se=6.8;qt(St,at,Tt,he,It-4.4,se,ae-4.4,rt);let ne=pi(256,256,(et,Ut)=>{et.fillStyle="#6b2a20",et.fillRect(0,0,Ut,Ut),et.strokeStyle="#3a1a14",et.lineWidth=3;for(let ge=8;ge<Ut;ge+=16)et.beginPath(),et.moveTo(ge,0),et.lineTo(ge,Ut*.7),et.stroke(),et.beginPath(),et.moveTo(0,ge*.7),et.lineTo(Ut,ge*.7),et.stroke();et.fillStyle="#5a221a",et.fillRect(0,Ut*.72,Ut,Ut*.28),et.strokeStyle="#c9a24a",et.lineWidth=4,et.strokeRect(4,4,Ut-8,Ut-8)}),me=7;for(let et=0;et<me;et++){let Ut=at-(It-4.4)/2+(et+.5)*(It-4.4)/me;As(St,Ut,Tt+.15,Dt-2.2+.03,(It-4.4)/me-.35,se*.75,ne)}for(let et=0;et<=8;et++){let Ut=at-It/2+.6+et*(It-1.2)/8;we(St,Ut,Tt,Dt-.6,.3,se,ot),we(St,Ut,Tt,yt+.6,.3,se,ot)}for(let et=1;et<7;et++){let Ut=yt+.6+et*(ae-1.2)/7;we(St,at-It/2+.6,Tt,Ut,.3,se,ot),we(St,at+It/2-.6,Tt,Ut,.3,se,ot)}qt(St,at,Tt+se-.9,Dt-.6,It-.6,.9,.5,ot),or(St,at,Tt+se,he,It+2.4,ae+2.4,3.1,gt,{hip:!0,upturn:!0});let q=It*.6,Et=ae*.55,wt=5.4;qt(St,at,Tt+se,he,q,wt,Et,ut);for(let et=0;et<=6;et++)we(St,at-q/2+.3+et*(q-.6)/6,Tt+se+2.2,he+Et/2+.25,.24,wt-2.2,ot);for(let et=0;et<6;et++){let Ut=at-q/2+.3+(et+.5)*(q-.6)/6;As(St,Ut,Tt+se+2.6,he+Et/2+.02,(q-.6)/6-.4,2.2,ne)}let Nt=pi(420,140,(et,Ut,ge)=>{et.fillStyle="#c79a3c",et.fillRect(0,0,Ut,ge),et.fillStyle="#1a1715",et.fillRect(16,16,Ut-32,ge-32),et.strokeStyle="#e6c25e",et.lineWidth=3,et.strokeRect(24,24,Ut-48,ge-48)});As(St,at,Tt+se+wt-1.6,he+Et/2+.35,3.6,1.2,Nt),or(St,at,Tt+se+wt,he,q+3.4,Et+3.4,3.8,gt,{hip:!0,upturn:!0});{let et=Tt+se+wt+3.8,Ut=ct("#3d4a44",{roughness:.6,metalness:.2}),ge=Math.max(1,(q+3.4)/2-(Et+3.4)/2*.8);for(let Pe of[-1,1]){let ln=qt(St,at+Pe*ge,et-.15,he,.35,1.2,.4,Ut);ln.rotation.z=-Pe*.25}we(St,at,et,he,.1,.5,I);let Xt=new Ke(new Xi(.3,12,10),I);Xt.position.set(at,et+.75,he),St.add(Xt)}if(kt.length){let et=kt.map(rn=>rn[0]),Ut=Math.max(...et)-Math.min(...et),ge=(Math.max(...et)+Math.min(...et))/2,Xt=(yt+Ht)/2,Pe=yt-Ht,ln=Math.max(...[0,.5,1].map(rn=>v(...H(ge,Ht+Pe*rn))))-O;qt(St,ge,Math.min(ln,Tt)-1,Xt,Ut,Math.max(Tt,ln+.3)-Math.min(ln,Tt)+1+4.6,Pe,rt),or(St,ge,Math.max(Tt,ln+.3)+4.6,Xt,Ut+1.6,Pe+1.6,2,gt,{hip:!0,upturn:!0})}br.set(_?_.n:"\u5730\u85CF\u7985\u5BFA",Math.max(br.get(_?.n)??0,O+Tt+se+wt+5)),_&&(_.modelNote="\u5317\u95E8\u540E\u7684\u5927\u6BBF\u6309\u7528\u6237\u6307\u8BA4\uFF08OSM way 609909706\uFF09\u505A\u6210\u91CD\u6A90\u6B47\u5C71\u6BBF\u5802\uFF1A\u77F3\u53F0\u57FA\u3001\u7EA2\u67F1\u56DE\u5ECA\u3001\u6728\u683C\u95E8\u3001\u9EC4\u5899\u3001\u4E0A\u5C42\u6728\u6784\u3002\u6BBF\u540D\u4E0E\u5C3A\u5BF8\u672A\u89C1\u516C\u5F00\u8D44\u6599\uFF0C\u5F62\u5236\u4E3A\u793A\u610F\uFF1B\u9662\u4E2D\u65B9\u4EAD\u6309\u536B\u661F\u5F71\u50CF\u4E0E\u5B9E\u666F\u7167\u7247\u8865\u51FA\u3002");{let[et,Ut]=[-1807,82],ge=ar(et,Ut,_?_.n:"\u5730\u85CF\u7985\u5BFA");ge.rotation.y=X,qt(ge,0,-1.2,0,7.6,1.6,7.6,be);for(let ln of[-1,1])for(let rn of[-1,1])we(ge,ln*2.9,.4,rn*2.9,.22,3.6,ot);qt(ge,0,3.6,0,6.4,.45,6.4,ct("#2a6184",{roughness:.7})),or(ge,0,4.05,0,8.6,8.6,2.8,gt,{hip:!0,upturn:!0});let Xt=new Ke(new Xi(.28,12,10),I);Xt.position.set(0,7.2,0),ge.add(Xt),we(ge,0,6.8,0,.08,.4,I);let Pe=ct("#6a5534",{roughness:.45,metalness:.55});we(ge,0,.4,0,.7,1.1,Pe),or(ge,0,1.5,0,1.7,1.7,.7,Pe,{hip:!0,upturn:!0})}}}let ho=null;{let l=t.areas.find(_=>_.id==="r4-juzhilin-site"),m=t.places.find(_=>_.featured);if(l&&m){let pt=function(S,B,$,vt,Bt,Vt=256){return pi(Vt,Vt,(ie,Ee)=>{let Ye=Ni(S),Ge=[];for(let Sn=0;Sn<B;Sn++)for(let Un=0;Un<B;Un++)Ge.push([(Un+.12+.76*Ye())*Ee/B,(Sn+.12+.76*Ye())*Ee/B,at($[Math.floor(Ye()*$.length)]),.86+.28*Ye()]);let cn=ie.createImageData(Ee,Ee),vn=at(vt);for(let Sn=0;Sn<Ee;Sn++)for(let Un=0;Un<Ee;Un++){let On=1e9,bi=1e9,bs=null;for(let ns of Ge){let dr=Math.abs(Un-ns[0]),al=Math.abs(Sn-ns[1]);dr=Math.min(dr,Ee-dr),al=Math.min(al,Ee-al);let yc=dr*dr+al*al;yc<On?(bi=On,On=yc,bs=ns):yc<bi&&(bi=yc)}let Ss=(Sn*Ee+Un)*4,Ns=Math.sqrt(bi)-Math.sqrt(On),qr=(Ye()-.5)*18;if(Ns<Bt)for(let ns=0;ns<3;ns++)cn.data[Ss+ns]=vn[ns]+qr*.4;else{let ns=bs[3]*(Ns<Bt+2.5?.82:1);for(let dr=0;dr<3;dr++)cn.data[Ss+dr]=bs[2][dr]*ns+qr}cn.data[Ss+3]=255}ie.putImageData(cn,0,0)},{repeat:!0})},Mt=function(S,B,$,vt,Bt,Vt,ie,Ee=2){if($-B<.001||Bt-vt<.001||ie-Vt<.001)return;let Ye=$-B,Ge=Bt-vt,cn=ie-Vt,vn=new Ci(Ye,Ge,cn),Sn=vn.attributes.uv,Un=[[cn,Ge,Vt,vt],[cn,Ge,Vt,vt],[Ye,cn,B,Vt],[Ye,cn,B,Vt],[Ye,Ge,B,vt],[Ye,Ge,B,vt]];for(let On=0;On<6;On++)for(let bi=0;bi<4;bi++){let bs=On*4+bi;Sn.setXY(bs,(Sn.getX(bs)*Un[On][0]+Un[On][2])/Ee,(Sn.getY(bs)*Un[On][1]+Un[On][3])/Ee)}vn.translate((B+$)/2,(vt+Bt)/2,-(Vt+ie)/2),gi(vn,S)},Ti=function(S,B,$,vt,Bt,Vt=[[0,0],[1,0],[1,1],[0,1]]){let ie=new Ln,Ee=[B,$,vt,B,vt,Bt].map(Wp).flat(),Ye=[0,1,2,0,2,3].map(Ge=>Vt[Ge]).flat();ie.setAttribute("position",new en(Ee,3)),ie.setAttribute("uv",new en(Ye,2)),ie.computeVertexNormals(),gi(ie,S)},c1=function(S,B,$,vt,Bt=[[0,0],[1,0],[.5,1]]){let Vt=new Ln;Vt.setAttribute("position",new en([B,$,vt].map(Wp).flat(),3)),Vt.setAttribute("uv",new en(Bt.flat(),2)),Vt.computeVertexNormals(),gi(Vt,S)},wr=function(S,B,$=1.05){for(let vt=1;vt<S.length;vt++){let Bt=S[vt-1],Vt=S[vt],ie=B[vt-1],Ee=B[vt];Ti(nl,[Bt[0],ie,Bt[1]],[Vt[0],Ee,Vt[1]],[Vt[0],Ee+$,Vt[1]],[Bt[0],ie+$,Bt[1]]);let Ye=new Ci(1,1,1),Ge=Vt[0]-Bt[0],cn=Vt[1]-Bt[1],vn=Math.hypot(Ge,cn);Ye.scale(vn,.035,.05),Ye.rotateY(Math.atan2(cn,Ge)),Ye.rotateZ(0),Ye.translate((Bt[0]+Vt[0])/2,(ie+Ee)/2+$,-(Bt[1]+Vt[1])/2),gi(Ye,hc)}},xi=function(S,B,$,vt=Cn){ds(vt,S,B,$,.3,.42,10,.26),Hi(vt,S,B+.62,$+.18,.3,.28,.12)},Ws=function(S,B,$,vt=.45){ds(zn,S,B,$,.05,.7,6),ds(Jn,S,B+.7,$,vt,.05,16)},Wr=function(S,B,$,vt=.12,Bt=.35,Vt=1){Mt(Ps,S-vt/2,S+vt/2,B,B+Bt,$-.02,$+.04*Vt)},_=l.frame,b=_.origin,E=_.u,P=[E[1],-E[0]],U=_.length,X=_.depth,H=_.front,D=-9,j=(S,B)=>[b[0]+E[0]*S+P[0]*B,b[1]+E[1]*S+P[1]*B],Y=v(...j(3,H))+.25,k=S=>v(...j(S,H))+.25-Y,Z=(S,B)=>mi(...j(S,B))-Y;ci.o.set(b[0],b[1],E[0],E[1]),ci.s.set(0,U,H,X);let J=ar(b[0],b[1],m.n);J.position.y=Y,J.rotation.y=Math.atan2(-P[0],-P[1]);let at=S=>[parseInt(S.slice(1,3),16),parseInt(S.slice(3,5),16),parseInt(S.slice(5,7),16)],Dt=pt(41,9,["#8e8b84","#7d7a73","#9a968d","#6f6d68","#a8a296"],"#c9c5bb",1.6),yt=pt(57,7,["#a8855f","#94765a","#b99c78","#7f6a55","#c2a784","#8c7b6b"],"#efe9dc",2.4),Ht=pi(256,256,(S,B)=>{let $=Ni(9);for(let vt=0;vt<16;vt++){let Bt=$();S.fillStyle=`rgb(${104+Bt*18|0},${70+Bt*12|0},${48+Bt*9|0})`,S.fillRect(vt*16,0,16,B),S.fillStyle="#3b2618",S.fillRect(vt*16+14,0,2,B)}for(let vt=0;vt<2500;vt++)S.fillStyle=`rgba(40,22,12,${$()*.12})`,S.fillRect($()*B,$()*B,1,6+$()*14)},{repeat:!0}),kt=pi(256,256,(S,B)=>{let $=Ni(13);for(let vt=0;vt<18;vt++){let Bt=vt*B/18;for(let Vt=-(vt*53%120);Vt<B;Vt+=120+vt*31%60){let ie=$();S.fillStyle=`rgb(${120+ie*22|0},${80+ie*14|0},${60+ie*10|0})`,S.fillRect(Vt,Bt,118+vt*31%60,B/18-1.6)}}for(let vt=0;vt<3e3;vt++)S.fillStyle=`rgba(50,28,18,${$()*.1})`,S.fillRect($()*B,$()*B,10+$()*20,1)},{repeat:!0}),St=pi(256,256,(S,B)=>{let $=Ni(21);S.fillStyle="#5e2716",S.fillRect(0,0,B,B);let vt=B/10,Bt=B/8;for(let Vt=0;Vt<8;Vt++)for(let ie=0;ie<10;ie++){let Ee=ie*vt,Ye=Vt*Bt,Ge=$(),cn=S.createLinearGradient(Ee,0,Ee+vt,0),vn=[184+Ge*20,86+Ge*16,48+Ge*10];cn.addColorStop(0,`rgb(${vn[0]*.55|0},${vn[1]*.55|0},${vn[2]*.55|0})`),cn.addColorStop(.45,`rgb(${vn[0]|0},${vn[1]|0},${vn[2]|0})`),cn.addColorStop(.62,`rgb(${Math.min(255,vn[0]*1.14)|0},${vn[1]*1.12|0},${vn[2]*1.1|0})`),cn.addColorStop(1,`rgb(${vn[0]*.5|0},${vn[1]*.5|0},${vn[2]*.5|0})`),S.fillStyle=cn,S.fillRect(Ee+1,Ye+2,vt-2,Bt-2),S.fillStyle="rgba(40,14,6,.55)",S.fillRect(Ee,Ye,vt,3)}},{repeat:!0}),O=(S,B,$)=>pi(128,128,(vt,Bt)=>{let Vt=Ni($);vt.fillStyle=S,vt.fillRect(0,0,Bt,Bt);for(let ie=0;ie<3500;ie++)vt.fillStyle=B[Math.floor(Vt()*B.length)],vt.fillRect(Vt()*Bt,Vt()*Bt,1+Vt()*1.5,1+Vt()*1.5)},{repeat:!0}),ot=O("#cdc2ae",["#e6dccb","#a99b86","#bfb09a","#8f8270"],3),gt=O("#565f6b",["#79828d","#3c434c","#8b939c","#4a525c"],4),rt=O("#edebe5",["#f6f4ef","#e2dfd7","#e8e5de"],5),ut=pi(128,128,(S,B)=>{S.fillStyle="#d8d3c7",S.fillRect(0,0,B,B),S.strokeStyle="#b8b2a5",S.lineWidth=2;for(let $=0;$<=B;$+=B/2)S.beginPath(),S.moveTo($,0),S.lineTo($,B),S.stroke(),S.beginPath(),S.moveTo(0,$),S.lineTo(B,$),S.stroke()},{repeat:!0}),ft=pi(256,192,(S,B,$)=>{let vt=S.createLinearGradient(0,0,0,$);vt.addColorStop(0,"#ffe2ad"),vt.addColorStop(.55,"#f4bf73"),vt.addColorStop(1,"#c8813e"),S.fillStyle=vt,S.fillRect(0,0,B,$),S.fillStyle="#f7ecd6",S.fillRect(B*.1,$*.62,B*.46,$*.2),S.fillStyle="#8a5a36",S.fillRect(B*.1,$*.52,B*.46,$*.1),S.fillStyle="#fff3d8",S.beginPath(),S.arc(B*.75,$*.34,$*.1,0,Math.PI*2),S.fill(),S.fillStyle="#6d4a30",S.fillRect(B*.72,$*.44,B*.06,$*.4),S.fillStyle="#2a2b2d",S.fillRect(0,0,B,7),S.fillRect(0,$-7,B,7),S.fillRect(0,0,7,$),S.fillRect(B-7,0,7,$),S.fillRect(B/2-3,0,6,$)}),st=(S,B={})=>Be({color:S,roughness:.85,side:mn,...B}),Tt=st("#ffffff",{map:rt}),Ce=st("#223044"),It=st("#ffffff",{map:Ht,roughness:.75}),ae=st("#ffffff",{map:Dt,roughness:.95}),he=st("#ffffff",{map:yt,roughness:.95}),se=st("#ffffff",{map:St,roughness:.7}),ne=st("#8a3b21",{roughness:.7}),me=st("#ffffff",{map:kt,roughness:.8}),q=st("#ffffff",{map:ot}),Et=st("#ffffff",{map:gt}),wt=st("#ffffff",{map:ut}),Nt=st("#a9a99f"),et=st("#c9c4b8"),Ut=st("#2c2e31",{roughness:.5}),ge=st("#6e2c1f",{roughness:.6}),Xt=st("#4a4e52",{roughness:.6}),Pe=st("#ddd8cc"),ln=st("#ebe8e0"),rn=st("#8d3c26"),Zn=st("#9a6a36"),Gs=st("#56683a"),Fi=st("#3b5a33"),wn=st("#5b4636"),qn=st("#bd8e78"),Cn=st("#a9763d"),Jn=st("#6b4a30"),zn=st("#26282b",{roughness:.45,metalness:.5}),Qo=st("#c93a24"),ta=st("#17344d",{roughness:.06,metalness:.45}),nl=Be({color:"#cfeee9",transparent:!0,opacity:.26,roughness:.05,metalness:.1,side:mn,depthWrite:!1}),hc=st("#8fe0d2",{emissive:"#7fe7d6",emissiveIntensity:.55}),Bi=st("#ffb24a",{emissive:"#ff9f2e",emissiveIntensity:2.2}),Ps=st("#ffdca0",{emissive:"#ffc46b",emissiveIntensity:1.8}),Pi=Be({map:ft,emissive:"#ffffff",emissiveMap:ft,emissiveIntensity:.8,roughness:.25,side:mn}),Er=new Map,gi=(S,B)=>{Er.has(B)||Er.set(B,[]),Er.get(B).push(S.index?S.toNonIndexed():S)},Wp=([S,B,$])=>[S,B,-$],ea=(S,B,$,vt,Bt,Vt)=>{let ie=new _s($-B,Bt-vt);ie.translate((B+$)/2,(vt+Bt)/2,-Vt),gi(ie,S)},uc=(S,B,$,vt,Bt,Vt,ie)=>{let Ee=new _s(vt-$,Vt-Bt);Ee.rotateY(ie*Math.PI/2),Ee.translate(B,(Bt+Vt)/2,-($+vt)/2),gi(Ee,S)},ds=(S,B,$,vt,Bt,Vt,ie=12,Ee=Bt)=>{let Ye=new Wi(Ee,Bt,Vt,ie);Ye.translate(B,$+Vt/2,-vt),gi(Ye,S)},Hi=(S,B,$,vt,Bt,Vt,ie)=>{let Ee=new Xi(1,10,7);Ee.scale(Bt,Vt,ie),Ee.translate(B,$,-vt),gi(Ee,S)},h1=(S,B,$,vt,Bt=.5)=>{let Vt=Ni(Math.round(S*97+vt*13));for(let ie=S+.3;ie<B-.1;ie+=.55)Hi(Vt()<.7?rn:Zn,ie,$+.22,vt+(Vt()-.5)*Bt*.4,.38,.3+Vt()*.12,Bt*.55)},Gr=(S,B,$,vt,Bt,Vt=.55)=>{Mt(ln,S,B,$,$+Vt,vt,Bt),h1(S,B,$+Vt,(vt+Bt)/2,Bt-vt)},na=(S,B,$,vt,Bt,Vt)=>wr([[S,B],[$,vt]],[Bt,Bt],Vt),$t=4.2,Fe=8.4,jn=.6,ze=Math.min(k(32)+.45,0),Kn=6.5,oi=24.5,yi=27.3,u1=38,qe=44.3,Qn=36.6,Ve=3.65,Dn=k(qe),yn=$t+1.4;for(let S=0;S<qe-1e-6;S+=1){let B=Math.min(qe,S+1),$=k(S),vt=k(B);Ti(Nt,[S,$,1.2],[B,vt,1.2],[B,vt,H],[S,$,H],[[S/2,.6],[B/2,.6],[B/2,-.4],[S/2,-.4]]),Ti(Nt,[S,D,H],[B,D,H],[B,vt,H],[S,$,H])}Ti(Nt,[0,D,1.2],[0,D,H],[0,k(0),H],[0,k(0),1.2]),Mt(Ce,0,Kn,D,.38,1,8.5),Mt(Tt,0,Kn,.38,3.95,1,8.5,4),Mt(et,-.05,Kn+.05,3.95,$t,.95,8.5),Mt(q,0,Kn,$t,$t+.02,1,8.5);for(let S of[1.85,4.65])ea(Pi,S-1.1,S+1.1,.95,3,.99),Mt(Ut,S-1.16,S+1.16,.89,.95,.94,1),Mt(Ut,S-1.16,S+1.16,3,3.06,.94,1);Wr(3.25,2.1,.97,.12,.32),Wr(.35,2.1,.97,.12,.32),Wr(Kn-.35,2.1,.97,.12,.32),uc(Pi,-.01,4.2,6.4,1,2.9,-1),na(0,1.02,Kn,1.02,$t,1.05),na(.02,1,.02,8.5,$t,1.05),na(Kn-.02,1,Kn-.02,4.6,$t,1.05),ds(ln,1.5,$t,2.6,.78,.5,24),Hi(rn,1.5,$t+.75,2.6,.62,.36,.62),xi(3.6,$t,2.2,zn),xi(4.6,$t,2.5,zn),Ws(4.1,$t,3.2,.3),Mt(ae,Kn,oi,D,jn,1.2,4.6,3),Mt(wt,Kn,oi,jn,jn+.04,1.75,4.6),Mt(ae,Kn,oi,jn,jn+1.05,1.2,1.75,3),Mt(et,Kn-.05,oi,jn+1.05,jn+1.15,1.15,1.8);let zu=(oi-Kn)/5;for(let S=0;S<5;S++){let B=Kn+(S+.5)*zu;ea(Pi,B-1.15,B+1.15,jn+.08,jn+2.6,4.52),Mt(Ut,B-1.2,B+1.2,jn+2.6,jn+2.68,4.5,4.56),Mt(Ut,B-.03,B+.03,jn+.08,jn+2.6,4.49,4.53),xi(B-.75,jn,3),xi(B+.75,jn,3),Ws(B,jn,2.6,.28),S&&Mt(ae,Kn+S*zu-.2,Kn+S*zu+.2,jn,jn+1.75,1.75,4.5,3)}Mt(Tt,Kn,oi,jn,3.9,4.6,10.5,4),Mt(It,Kn,oi,jn,3.62,4.52,4.6),Ti(It,[Kn,3.85,4.6],[oi,3.85,4.6],[oi,3.62,3],[Kn,3.62,3],[[0,0],[9,0],[9,.8],[0,.8]]),Mt(Jn,Kn,oi,3.44,3.64,2.95,3.05),Mt(Bi,Kn,oi,3.4,3.45,2.98,3.06),Mt(et,Kn,oi,3.9,$t,4.45,10.5);let fc=k(25.9),ku=Math.ceil(($t-fc)/.165),f1=($t-fc)/ku,Hu=1.3+ku*.28;for(let S=0;S<ku;S++){let B=1.3+S*.28,$=fc+(S+1)*f1;Mt(Pe,oi+.4,yi-.4,D,$,B,B+.28),Mt(Bi,oi+.4,yi-.4,$-.07,$-.035,B-.02,B+.01),Mt(Tt,oi,oi+.4,D,$+.95,B,B+.28,4),Mt(Tt,yi-.4,yi,D,$+.18,B,B+.28,4)}wr([[yi-.2,1.3],[yi-.2,Hu]],[fc+.18,$t+.18],.95),Mt(Tt,oi-.3,oi+.4,k(24.6)-.2,jn+2.3,.3,1.3,4),Mt(Tt,yi-.4,yi+.3,k(27.4)-.2,jn+2.3,.3,1.3,4),Mt(et,oi-.35,oi+.45,jn+2.3,jn+2.4,.25,1.35),Mt(et,yi-.45,yi+.35,jn+2.3,jn+2.4,.25,1.35);let fr=[29,30.8],dc=Math.max(0,Math.ceil((ze-k(29.9))/.16)),d1=dc?(ze-k(29.9))/dc:0,p1=1.2+dc*.3;Mt(ae,yi,fr[0],D,ze,1.2,5.6,3),Mt(ae,fr[1],Qn,D,ze,1.2,5.6,3),Mt(ae,fr[0],fr[1],D,ze,p1,5.6,3);for(let S=0;S<dc;S++){let B=1.2+S*.3;Mt(Pe,fr[0],fr[1],D,k(29.9)+(S+1)*d1,B,B+.3)}Mt(wt,yi,Qn,ze,ze+.04,1.75,5.6),Mt(ae,yi,fr[0],ze,ze+.85,1.2,1.7,3),Mt(ae,fr[1],Qn-.9,ze,ze+.85,1.2,1.7,3),Mt(et,yi,fr[0],ze+.85,ze+.95,1.15,1.75),Mt(et,fr[1],Qn-.9,ze+.85,ze+.95,1.15,1.75),Mt(Tt,yi,qe,ze,3.9,5.6,12.5,4),Mt(It,yi,Qn,ze,3.9,5.52,5.6);let pc=Math.min(3.5,3.6-ze-.2);for(let[S,B]of[[27.9,31.3],[31.9,35.9]]){ea(Pi,S,B,ze+.05,ze+pc,5.5),Mt(Ut,S-.05,B+.05,ze+pc,ze+pc+.07,5.47,5.53);for(let $=S+(B-S)/3;$<B-.1;$+=(B-S)/3)Mt(Ut,$-.03,$+.03,ze+.05,ze+pc,5.46,5.5)}for(let S of[32.3,33.1,33.9])ds(zn,S,ze,4.9,.03,.9,5),Hi(Qo,S,ze+1.05,4.9,.28,.34,.28);Mt(Xt,yi,Qn,3.9,$t+.05,5.42,5.6),Mt(Bi,yi,Qn,3.86,3.9,5.44,5.52),Mt(ae,0,Kn,D,$t,8.5,X,3),Mt(ae,Kn,oi,D,$t,10.5,X,3),Mt(ae,oi,yi,D,$t,Hu,X,3),Mt(ae,yi,u1,D,$t,12.5,X,3),Mt(q,0,4,$t,$t+.03,8.5,14.8);let Yn=[4,18.5],tn=[5.2,14.2],Xs=7.8,Xp=2.6,Ls=(tn[0]+tn[1])/2,Is=Xs+Xp,il=Xp/((tn[1]-tn[0])/2),An=.6,sl=.35,qp=S=>Is-il*(S-Ls),yo=Ls+(Is-Fe)/il,ui=[9.9,13.1],ps=[yo+.2,yo+3.4],Vu=ps[1]+.2;Gr(Kn+.1,Yn[1]-.1,$t,4.5,5.15,.5),Mt(Tt,Yn[0],Yn[1],$t,Xs,tn[0],tn[1],4);for(let S=0;S<4;S++){let B=Yn[0]+(S+.5)*(Yn[1]-Yn[0])/4;ea(Pi,B-1.3,B+1.3,$t+.45,$t+2.85,tn[0]-.02),Mt(ge,B-1.42,B+1.42,$t+.33,$t+.45,tn[0]-.08,tn[0]),Mt(ge,B-1.42,B+1.42,$t+2.85,$t+2.97,tn[0]-.08,tn[0]),Mt(ge,B-1.42,B-1.3,$t+.45,$t+2.85,tn[0]-.08,tn[0]),Mt(ge,B+1.3,B+1.42,$t+.45,$t+2.85,tn[0]-.08,tn[0]),Mt(Ut,B-.03,B+.03,$t+.45,$t+2.85,tn[0]-.06,tn[0]-.02),Mt(Ut,B-1.3,B+1.3,$t+2.2,$t+2.25,tn[0]-.06,tn[0]-.02),S<3&&Wr(Yn[0]+(S+1)*(Yn[1]-Yn[0])/4,$t+1.9,tn[0]-.03,.12,.34)}Mt(ge,Yn[0],Yn[1],Xs-.5,Xs-.12,tn[0]-.08,tn[0]),Mt(Bi,Yn[0],Yn[1],Xs-.12,Xs-.06,tn[0]-.12,tn[0]-.02),uc(Pi,Yn[0]-.01,8.6,10.8,$t+.8,$t+2.6,-1);{let S=Xs-il*An,B=Yn[0]-sl,$=Yn[1]+sl,vt=($-B)/2,Bt=Math.hypot(Ls-tn[0]+An,Is-S)/2;Ti(se,[B,S,tn[0]-An],[$,S,tn[0]-An],[$,Is,Ls],[B,Is,Ls],[[0,Bt],[vt,Bt],[vt,0],[0,0]]),Ti(se,[$,S,tn[1]+An],[B,S,tn[1]+An],[B,Is,Ls],[$,Is,Ls],[[vt,Bt],[0,Bt],[0,0],[vt,0]]),Ti(ne,[B,S-.14,tn[0]-An],[$,S-.14,tn[0]-An],[$,S,tn[0]-An],[B,S,tn[0]-An]),Ti(ne,[$,S-.14,tn[1]+An],[B,S-.14,tn[1]+An],[B,S,tn[1]+An],[$,S,tn[1]+An]);let Vt=new Wi(.17,.17,$-B+.3,10);Vt.rotateZ(Math.PI/2),Vt.translate((B+$)/2,Is+.06,-Ls),gi(Vt,ne);for(let[ie,Ee]of[[B-.1,-1],[$+.1,1]]){let Ye=new Ci(.7,.24,.3);Ye.rotateZ(Ee*.55),Ye.translate(ie+Ee*.12,Is+.25,-Ls),gi(Ye,ne)}for(let ie of Yn){c1(Tt,[ie,Xs,tn[0]],[ie,Xs,tn[1]],[ie,Is,Ls]);for(let[Ee,Ye]of[[tn[0]-An,Ls],[tn[1]+An,Ls]]){let Ge=Xs-il*An,cn=ie===Yn[0]?-sl:sl;Ti(ne,[ie+cn,Ge,Ee],[ie+cn,Is,Ye],[ie+cn,Is+.2,Ye],[ie+cn,Ge+.2,Ee])}for(let Ee of[tn[0]-An,tn[1]+An]){let Ye=new Ci(.28,.5,.28),Ge=ie===Yn[0]?-1:1;Ye.rotateZ(Ge*.5),Ye.translate(ie+Ge*(sl+.1),Xs-il*An+.25,-Ee),gi(Ye,ne)}}for(let[ie,Ee,Ye]of[[6,10.4,3],[12.6,17,3],[10.4,12.6,1]])for(let Ge=3-Ye;Ge<3;Ge++){let cn=yo-.8*Ge,vn=cn-.8,Sn=qp(vn)+.35;Mt(It,ie,Ee,qp(cn)-.2,Sn-.05,vn,cn,1),Mt(me,ie-.03,Ee+.03,Sn-.06,Sn,vn-.02,cn+.05),Mt(Bi,ie,Ee,Sn-.13,Sn-.08,cn+.01,cn+.05)}for(let ie of[8.2,14.8])Wr(ie,Fe+.6,yo+.02,.14,.22);Mt(me,Yn[0],ui[0],Fe-.3,Fe+.03,yo,tn[1]+An),Mt(me,ui[1],Yn[1],Fe-.3,Fe+.03,yo,tn[1]+An),Mt(me,ui[0],ui[1],Fe-.3,Fe+.03,yo,ps[0]),Mt(ta,ui[0],ui[1],Fe-.6,Fe-.08,ps[0],ps[1]),Mt(et,ui[0]-.2,ui[1]+.2,Fe-.1,Fe+.06,ps[1],ps[1]+.2),Mt(et,ui[0]-.2,ui[0],Fe-.1,Fe+.06,ps[0],ps[1]),Mt(et,ui[1],ui[1]+.2,Fe-.1,Fe+.06,ps[0],ps[1]),Gr(7.4,ui[0]-.3,Fe,ps[1]-.6,ps[1]+.9,.6),Gr(ui[1]+.3,15.6,Fe,ps[1]-.6,ps[1]+.9,.6)}let vs=[35.3,37.3];Mt(he,0,ui[0]-.2,$t,Fe,tn[1]+An,X,3),Mt(he,ui[1]+.2,vs[0],$t,Fe,tn[1]+An,X,3),Mt(he,ui[0]-.2,ui[1]+.2,$t,Fe,Vu,X,3),Mt(he,ui[0]-.2,ui[1]+.2,$t,Fe-.6,tn[1]+An,Vu,3),Mt(he,Yn[1],20.5,$t,Fe,12.5,tn[1]+An,3),Mt(q,0,ui[0]-.2,Fe,Fe+.03,tn[1]+An,X),Mt(q,ui[1]+.2,vs[0],Fe,Fe+.03,tn[1]+An,X),Mt(q,ui[0]-.2,ui[1]+.2,Fe,Fe+.03,Vu,X),Mt(q,Yn[1],20.5,Fe,Fe+.03,12.5,tn[1]+An),Mt(me,15.8,18.3,Fe+.02,Fe+.05,tn[1]+An,X-1),na(0,tn[1]+An+.02,Yn[0],tn[1]+An+.02,Fe,1.05);{for(let $ of[-1,1])for(let vt of[-1,1]){let Bt=new Ci(.06,2.3,.06);Bt.rotateX(vt*.18),Bt.translate(2.4+$*1,Fe+1.1,-(19.5+vt*.2)),gi(Bt,zn)}Mt(zn,2.4-1.05,2.4+1.05,Fe+2.2,Fe+2.26,19.5-.05,19.5+.05),Ti(Xt,[2.4-1.2,Fe+2.35,19.5-.8],[2.4+1.2,Fe+2.35,19.5-.8],[2.4+1.2,Fe+2.1,19.5+.8],[2.4-1.2,Fe+2.1,19.5+.8]),Mt(Xt,2.4-.8,2.4+.8,Fe+.55,Fe+.7,19.5-.25,19.5+.25)}Ws(6.5,Fe,21.5,.45),xi(5.8,Fe,21.5,zn),xi(7.2,Fe,21.5,zn),Mt(me,Yn[1],oi,$t,$t+.05,4.6,12.5),Mt(me,oi,yi,$t,$t+.05,Hu,12.5),Mt(me,yi,qe,$t,$t+.05,5.6,12.5),Mt(me,Qn,qe,$t,$t+.05,Ve,5.6),na(Yn[1],4.62,oi,4.62,$t,1.05),wr([[yi,5.62],[Qn,5.62],[Qn,Ve+.02],[qe-.02,Ve+.02],[qe-.02,12.5]],[$t,$t,$t,$t,$t],1.05);{ds(wn,21.6,$t,9.3,.16,1.6,8,.2);let $=new Wi(.09,.13,1.4,6);$.rotateZ(.7),$.translate(21.6+.45,$t+1.7,-9.3),gi($,wn);for(let[vt,Bt,Vt,ie]of[[-.6,1.2,.1,1],[.5,1.7,-.1,1.15],[1.2,2.25,.2,.9],[-.1,2.45,0,.95],[.3,3,.05,.7]])Hi(Fi,21.6+vt,$t+Bt,9.3+Vt,ie,.22,ie*.8);Mt(Tt,21.6-1.3,21.6+1.3,$t,$t+.4,9.3-1.3,9.3+1.3,4),Hi(rn,21.6+.9,$t+.55,9.3+.9,.5,.3,.45),Hi(Zn,21.6-.8,$t+.55,9.3+.8,.45,.28,.4)}Mt(Et,23.5,33.5,$t+.03,$t+.08,9.1,11.2,1.5);for(let S of[25.2,28.6,32])for(let B of[9.4,10.2,11])Mt(wt,S-.45,S+.45,$t+.05,$t+.11,B-.28,B+.28,1);Gr(19,22.8,$t,11.4,12.3),Gr(24.6,28.4,$t+.02,11.55,12.3),Gr(30.2,33.8,$t+.02,11.55,12.3);for(let S of[26.2,31.2])Mt(qn,S,S+1.7,$t+.05,$t+.5,7.25,7.7,1);{let S=new Wi(.62,.72,.1,9);S.translate(28.9,$t+.72,-7.5),gi(S,Jn),ds(Jn,28.9,$t+.05,7.5,.18,.67,7)}Ws(34.6,$t+.05,8.2,.4),xi(33.9,$t+.05,8.2,zn),xi(35.3,$t+.05,8.2,zn),Ws(36.7,$t+.05,10.2,.4),xi(36,$t+.05,10.2,zn),xi(37.4,$t+.05,10.2,zn),Ws(41.3,$t+.05,8.4,.45),xi(40.6,$t+.05,8.4,zn),xi(42,$t+.05,8.4,zn),Ws(39.2,$t+.05,5,.4),xi(38.5,$t+.05,5,zn),xi(39.9,$t+.05,5,zn);let Vi=[20.5,35],ti=[12.5,18],Xr=7.6;Mt(Tt,Vi[0],Vi[1],$t,Xr,ti[0],ti[1],4),Mt(Xt,Vi[0],Vi[1],$t,$t+.14,ti[0]-.06,ti[0]);for(let[S,B]of[[21.3,23.9],[25.5,28.1],[29.3,33.3]])ea(Pi,S,B,$t+.08,$t+2.75,ti[0]-.02),Mt(Ut,S-.06,B+.06,$t+2.75,$t+2.83,ti[0]-.07,ti[0]),Mt(Ut,S-.06,S,$t+.08,$t+2.75,ti[0]-.07,ti[0]),Mt(Ut,B,B+.06,$t+.08,$t+2.75,ti[0]-.07,ti[0]),Mt(Ut,(S+B)/2-.03,(S+B)/2+.03,$t+.08,$t+2.75,ti[0]-.06,ti[0]-.02);for(let S of[24.7,28.7,34.1])Wr(S,$t+1.3,ti[0]-.03,.06,1.3);Mt(Xt,Vi[0]-.3,Vi[1]+.3,Xr,Fe,ti[0]-1,ti[1]+.2),Mt(Bi,Vi[0]-.3,Vi[1]+.3,Xr-.05,Xr,ti[0]-1,ti[0]-.94),Mt(Bi,Vi[0]-.3,Vi[0]-.24,Xr-.05,Xr,ti[0]-1,ti[1]);for(let S=Vi[0]+1;S<Vi[1];S+=2.4)Mt(Ps,S-.09,S+.09,Xr-.03,Xr,ti[0]-.62,ti[0]-.44);Mt(q,Vi[0],Vi[1],Fe,Fe+.03,ti[0]-1,ti[1]);{let S=[[Yn[1],12.52],[Vi[0]-.3,12.52]];for(let B=1;B<=8;B++){let $=B/8*Math.PI/2;S.push([Vi[0]-.3+2.2*Math.sin($),ti[0]-.98+1*Math.cos($)])}S.push([Vi[1]+.3,ti[0]-.98]),wr(S,S.map(()=>Fe),1.05)}Ws(24,Fe+.03,14.5,.45),xi(23.3,Fe+.03,14.5,zn),xi(24.7,Fe+.03,14.5,zn),Ws(30,Fe+.03,15.2,.45),xi(29.3,Fe+.03,15.2,zn),xi(30.7,Fe+.03,15.2,zn);let m1=st("#34363a",{roughness:.95}),Yp=st("#e9e7df",{roughness:.8}),g1=st("#2b3440"),$p=st("#a8a39a",{roughness:.95}),x1=st("#bdb2a0",{roughness:.95}),y1=st("#ddd6c8",{roughness:.8}),Gu=st("#c9cdd1",{roughness:.35,metalness:.12}),Wu=st("#1f262c",{roughness:.1,metalness:.3}),Xu=st("#18191b"),Zp=st("#f2f3f1",{roughness:.4}),_1=st("#3f7dff",{emissive:"#3d78ff",emissiveIntensity:1.6}),Jp=st("#4c3a2c",{roughness:1}),v1=st("#2e4b2c",{roughness:.95}),jp=st("#3a5b35",{roughness:.95}),M1=st("#4a6c3f",{roughness:.95}),Kp=st("#5d5a55",{roughness:.7}),b1=st("#a8743f",{roughness:.6}),Qp=st("#eeebe4"),S1=st("#6c6a66",{roughness:.9}),E1=st("#5f7a3e",{roughness:1}),w1=st("#b9bbb8",{roughness:.5}),tm=st("#d2311f",{emissive:"#8a150a",emissiveIntensity:.55,roughness:.6}),em=st("#e67a2c",{emissive:"#8a3a0c",emissiveIntensity:.5,roughness:.6}),T1=st("#e8c74c",{emissive:"#7d6414",emissiveIntensity:.45,roughness:.6}),rl=(S,B,$,vt,Bt=vt)=>{let Vt=new W(B[0],B[1],-B[2]),ie=new W($[0],$[1],-$[2]),Ee=ie.clone().sub(Vt),Ye=Ee.length(),Ge=new Wi(Bt,vt,Ye,7);Ge.translate(0,Ye/2,0),Ge.applyQuaternion(new xs().setFromUnitVectors(new W(0,1,0),Ee.normalize())),Ge.translate(Vt.x,Vt.y,Vt.z),gi(Ge,S)},qu=(S,B=0)=>Be({map:S,roughness:.55,emissive:B?"#ffffff":"#000000",emissiveMap:B?S:null,emissiveIntensity:B,side:mn}),Yu=(S,B,$,vt,Bt,Vt,{emissive:ie=0}={})=>{let Ee=new Ke(new _s($-B,Bt-vt),qu(S,ie));return Ee.position.set((B+$)/2,(vt+Bt)/2,-Vt+.01),J.add(Ee),Ee},nm=(S,B,$,vt,Bt,Vt,{emissive:ie=0}={})=>{let Ee=new Ke(new _s(vt-$,Vt-Bt),qu(S,ie));return Ee.rotation.y=Math.PI/2,Ee.position.set(B,(Bt+Vt)/2,-($+vt)/2),J.add(Ee),Ee},$u='"Xingkai SC","STXingkai","Kaiti SC","STKaiti","KaiTi",serif',Ai=S=>k(S)+.03,mc=Dn+3.3,Ds=$t-.9,ei=12.5,zi=19.9,Zu=Math.max(1,Math.ceil((ze-Dn)/.165)),im=(ze-Dn)/Zu,gc=.38,Us=qe-Zu*gc;Mt(Tt,Qn,qe,ze,3.9,Ve,5.6,4),Mt(ae,Qn,qe-.42,D,ze,Ve,5.6,3),Mt(he,Qn,qe-.01,D,ze+.06,Ve-.08,Ve,2),Mt(It,Qn,qe,ze+.06,3.9,Ve-.08,Ve,1),Mt(It,Qn-.08,Qn,ze,3.9,Ve,5.6,1);{let S=Us+.35,B=qe-1.35;ea(Pi,S,B,ze+.45,ze+2.85,Ve-.1);for(let[$,vt,Bt,Vt]of[[S-.15,B+.15,ze+.3,ze+.45],[S-.15,B+.15,ze+2.85,ze+3],[S-.15,S,ze+.3,ze+3],[B,B+.15,ze+.3,ze+3],[(S+B)/2-.05,(S+B)/2+.05,ze+.45,ze+2.85]])Mt(b1,$,vt,Bt,Vt,Ve-.17,Ve-.08);Mt(Ut,S-.25,B+.25,ze+.2,ze+3.1,Ve-.1,Ve-.08);for(let $ of[Qn+.8,qe-.6])Mt(Ps,$-.03,$+.03,ze+1.2,ze+2.6,Ve-.12,Ve-.08)}uc(Pi,Qn-.09,Ve+.35,Ve+1.45,ze+.05,ze+2.55,-1),Mt(Ut,Qn-.12,Qn-.08,ze+2.55,ze+2.65,Ve+.3,Ve+1.5),Yu(pi(128,72,(S,B,$)=>{S.fillStyle="#1d3f6e",S.fillRect(0,0,B,$),S.fillStyle="#fff",S.font='600 18px "PingFang SC",sans-serif',S.textAlign="center",S.fillText("\u51E4\u5F62\u65B0\u6751",B/2,28),S.font='700 28px "PingFang SC",sans-serif',S.fillText("19",B/2,62)}),qe-.55,qe-.2,ze+.1,ze+.32,Ve-.1),Mt(Xt,Qn,qe,3.9,$t+.05,Ve-.35,Ve),Mt(Qp,Qn,qe,3.88,3.9,Ve-.33,Ve),Mt(Bi,Qn,qe,3.84,3.88,Ve-.35,Ve-.3);for(let S=0;S<Zu;S++){let B=qe-S*gc,$=B-gc,vt=Dn+(S+1)*im;Mt($p,$,B+.02,D,vt,1.75,Ve,1),Mt(Ut,$,$+.025,vt-.03,vt+.004,1.75,Ve)}Mt(y1,Qn,Us,ze,ze+.04,1.75,Ve,1),Mt(ae,Qn,Us,D,ze,1.75,Ve,3);{let S=$=>$<=Us?ze+.9:Dn+(Math.floor((qe-$)/gc)+1)*im+.9,B=Ni(733);for(let $=Qn-.9;$<qe-.01;$+=.62){let vt=Math.min(qe,$+.6),Bt=S(Math.min($+.3,qe-.01))+(B()-.5)*.06;Mt(B()<.5?x1:$p,$,vt,D,Bt,1.2,1.75,1),Mt(et,$-.01,vt+.01,Bt,Bt+.07,1.18,1.77)}for(let[$,vt]of[[Us-.8,1],[Us+.5,.8],[Us+2.6,1],[qe-.9,.8]]){let Bt=S($)+.07;ds(Kp,$,Bt,1.48,.16*vt,.32*vt,10,.12*vt),Hi(Kp,$,Bt+.42*vt,1.48,.13*vt,.15*vt,.13*vt)}}{let S=Us-1.45;Mt(Tt,S,S+.55,ze,ze+1.35,Ve-.6,Ve-.05,4),Mt(Ps,S+.04,S+.51,ze+1.35,ze+1.8,Ve-.56,Ve-.09),Mt(Ut,S,S+.55,ze+1.8,ze+1.86,Ve-.6,Ve-.05);for(let B of[.14,.27,.4])Mt(Ut,S+B,S+B+.02,ze+1.36,ze+1.79,Ve-.61,Ve-.59);Mt(ln,S+.65,Us,ze,ze+.4,Ve-.55,Ve-.05);for(let B=S+.8;B<Us-.1;B+=.33)Hi(Gs,B,ze+.72,Ve-.3,.3,.38,.26);ds(wn,Us-.35,ze+.4,Ve-.3,.05,1.4,6);for(let[B,$]of[[0,1.9],[.2,1.6],[-.2,1.7]])Hi(Gs,Us-.35+B,ze+$,Ve-.3,.35,.45,.3)}Mt(g1,qe-.4,qe,D,Dn+1.25,Ve,12.5),Mt(Tt,qe-.4,qe,Dn+1.25,ze,Ve,12.5,4),Mt(Xt,qe-.35,qe+.12,3.9,$t+.05,Ve,12.5),Mt(Bi,qe+.08,qe+.13,3.86,3.9,Ve,12.5),nm(pi(200,250,(S,B,$)=>{S.fillStyle="#24211e",S.fillRect(0,0,B,$),S.strokeStyle="#4a443c",S.lineWidth=4,S.strokeRect(6,6,B-12,$-12),S.fillStyle="#d8b56a",S.font=`70px ${$u}`,S.textAlign="center",S.textBaseline="middle",S.fillText("\u5C45",B*.4,$*.24),S.fillText("\u4E4B",B*.62,$*.5),S.fillText("\u6797",B*.42,$*.76),S.font="10px sans-serif",S.fillText("JU ZHI LIN",B*.24,$*.5)}),qe+.02,Ve+.3,Ve+1.2,Dn+1.75,Dn+2.85),Mt(Xt,qe,qe+.16,Dn+2.95,Dn+3.07,Ve+.6,Ve+.9);for(let[S,B]of[[Ve+2,Ve+4.2],[Ve+4.8,Ve+6.4]]){uc(Pi,qe+.01,S,B,Dn+2.4,Dn+4.7,1);for(let[$,vt,Bt,Vt]of[[S-.06,B+.06,Dn+2.34,Dn+2.4],[S-.06,B+.06,Dn+4.7,Dn+4.76],[S-.06,S,Dn+2.4,Dn+4.7],[B,B+.06,Dn+2.4,Dn+4.7],[(S+B)/2-.03,(S+B)/2+.03,Dn+2.4,Dn+4.7]])Mt(Ut,qe,qe+.07,Bt,Vt,$,vt)}for(let S of[Ve+1.6,Ve+4.5,Ve+6.8])Mt(Ps,qe,qe+.05,Dn+2.6,Dn+4.2,S-.03,S+.03);Mt(Zp,qe,qe+.3,Dn+2.5,Dn+3.05,Ve+7.3,Ve+7.95),nm(pi(96,64,(S,B,$)=>{S.fillStyle="#e9eae7",S.fillRect(0,0,B,$),S.fillStyle="#55585a",S.beginPath(),S.arc(B*.42,$/2,$*.4,0,Math.PI*2),S.fill(),S.strokeStyle="#e9eae7",S.lineWidth=2;for(let vt=4;vt<$*.4;vt+=4)S.beginPath(),S.arc(B*.42,$/2,vt,0,Math.PI*2),S.stroke()}),qe+.31,Ve+7.32,Ve+7.93,Dn+2.52,Dn+3.03),Mt(w1,qe,qe+.2,Dn+.85,Dn+1.95,Ve+7.4,Ve+8),ds(Tt,qe+.08,D,Ve+.1,.055,$t-D-.3,8);let sm=S=>[(S[0]-b[0])*E[0]+(S[1]-b[1])*E[1],(S[0]-b[0])*P[0]+(S[1]-b[1])*P[1]],A1=S=>{let B=-1e9;for(let $ of t.roads)if(!["footway","path","steps","pedestrian"].includes($.kind))for(let vt=1;vt<$.pts.length;vt++){let Bt=sm($.pts[vt-1]),Vt=sm($.pts[vt]);if((Bt[0]-S)*(Vt[0]-S)>0||Bt[0]===Vt[0])continue;let ie=Bt[1]+(Vt[1]-Bt[1])*(S-Bt[0])/(Vt[0]-Bt[0]);ie>-10&&ie<8&&(B=Math.max(B,ie+$.width/2))}return B},xc=S=>Math.max(H,A1(S)-.3);for(let S=qe;S<U-1e-6;S+=.5){let B=Math.min(U,S+.5),$=xc(S),vt=xc(B);Ti(m1,[S,Ai(S),ei],[B,Ai(B),ei],[B,Ai(B),vt],[S,Ai(S),$],[[S/2,ei/2],[B/2,ei/2],[B/2,vt/2],[S/2,$/2]]),Ti(Nt,[S,D,$],[B,D,vt],[B,Ai(B),vt],[S,Ai(S),$])}Ti(Nt,[U,D,xc(U)],[U,D,ei],[U,Ai(U),ei],[U,Ai(U),xc(U)]);let ol=[44.6,47.2,49.8,52.4,55,57.6],ia=ei-5.3,Mi=ol[1];for(let S of ol)Ti(Yp,[S-.06,Ai(S)+.02,ei-.05],[S+.06,Ai(S)+.02,ei-.05],[S+.06,Ai(S)+.02,ia],[S-.06,Ai(S)+.02,ia]);for(let S=ol[0]-.06;S<ol.at(-1)+.06-1e-6;S+=.5){let B=Math.min(ol.at(-1)+.06,S+.5);Ti(Yp,[S,Ai(S)+.02,ia+.06],[B,Ai(B)+.02,ia+.06],[B,Ai(B)+.02,ia-.06],[S,Ai(S)+.02,ia-.06])}{let S=Mi+1.3,B=.95,$=ei-.4,vt=$-4.7,Bt=Ai(S);Mt(Gu,S-B,S+B,Bt+.34,Bt+1,vt,$),Mt(Gu,S-B+.04,S+B-.04,Bt+.5,Bt+.98,vt-.02,vt+.3),Mt(Wu,S-B+.1,S+B-.1,Bt+1,Bt+1.56,vt+1.45,$-.5),Mt(Gu,S-B+.14,S+B-.14,Bt+1.56,Bt+1.64,vt+1.5,$-.55),Ti(Wu,[S-B+.1,Bt+1,vt+.85],[S+B-.1,Bt+1,vt+.85],[S+B-.14,Bt+1.56,vt+1.45],[S-B+.14,Bt+1.56,vt+1.45]),Mt(Bi,S-B+.2,S+B-.2,Bt+.84,Bt+.88,vt-.03,vt);for(let ie of[S-B+.04,S+B-.04])for(let Ee of[vt+.95,$-.95]){let Ye=new Wi(.37,.37,.26,16);Ye.rotateZ(Math.PI/2),Ye.translate(ie,Bt+.37,-Ee),gi(Ye,Xu)}let Vt=Ai(Mi);Mt(Zp,Mi-.3,Mi+.3,Vt+.45,Vt+1.2,ei-.28,ei),Mt(Wu,Mi-.1,Mi+.1,Vt+.88,Vt+1.06,ei-.3,ei-.28),Mt(_1,Mi-.26,Mi-.22,Vt+.52,Vt+1.1,ei-.3,ei-.28),rl(Tt,[qe,Ai(qe)+.14,ei-.08],[Mi-.3,Vt+.14,ei-.08],.045),rl(Xu,[Mi+.22,Vt+.52,ei-.3],[Mi+.55,Vt+.08,ei-.9],.02),rl(Xu,[Mi+.55,Vt+.08,ei-.9],[S-B,Bt+.8,$-.7],.02)}let Ms=ei+.32,_o=ei+.58;Mt(ae,qe,U,D,mc,ei,Ms,2.4),Mt(et,qe,U,mc,mc+.08,ei-.05,Ms),Mt(ae,qe,U,mc,Ds,Ms,_o,2.4),Mt(Tt,qe,U,Ds,yn+.1,Ms,_o,4),Mt(et,qe,U,yn+.1,yn+.18,Ms-.04,_o+.04),wr([[38,12.52],[qe,12.52],[qe,_o+.02],[U,_o+.02]],[yn+.1,yn+.1,yn+.1,yn+.1],1.05);{Mt(Xt,Mi-1.85,Mi+1.85,Ds+.62,Ds+1.72,Ms-.1,Ms),Yu(pi(512,176,(S,B,$)=>{S.fillStyle="#141414",S.fillRect(0,0,B,$),S.strokeStyle="#3a3a3a",S.lineWidth=6,S.strokeRect(3,3,B-6,$-6),S.fillStyle="#fbfbf6",S.shadowColor="#ffffff",S.shadowBlur=10,S.font=`120px ${$u}`,S.textAlign="center",S.textBaseline="middle",S.fillText("\u5C45\u4E4B\u6797",B/2,$/2+6)}),Mi-1.75,Mi+1.75,Ds+.67,Ds+1.67,Ms-.11,{emissive:.9}),Mt(Xt,Mi-2.6,Mi+2.6,Ds+.1,Ds+.5,Ms-.06,Ms),Yu(pi(700,52,(S,B,$)=>{S.fillStyle="#101318",S.fillRect(0,0,B,$),S.fillStyle="#f5f7ff",S.shadowColor="#bcd0ff",S.shadowBlur=6,S.font='700 30px "PingFang SC",sans-serif',S.textBaseline="middle",S.fillText("173 5664 8281",18,$/2+1),S.fillStyle="#3a3e46",S.fillRect(262,6,4,$-12),S.fillStyle="#f5f7ff",S.font='700 32px "PingFang SC",sans-serif',S.fillText("\u9690\u4E8E\u5C71\u6797  \u5F52\u4E8E\u81EA\u7136",290,$/2+1)}),Mi-2.5,Mi+2.5,Ds+.13,Ds+.47,Ms-.07,{emissive:1});for(let S of[Mi-1.9,Mi+1.9])Mt(Ps,S-.08,S+.08,Ds-.8,Ds-.5,Ms-.06,Ms)}Mt(ae,38,qe,D,yn,12.5,zi,3),Mt(Tt,38,qe,$t,yn+.1,12.42,12.5,4),Mt(Tt,37.92,38,$t,yn+.1,12.5,14.1,4),Mt(ae,vs[0],38,D,yn,15.3,zi,3),Mt(Tt,vs[0],38,$t,yn+.1,15.22,15.3,4),Mt(q,vs[0],38,yn,yn+.03,15.3,zi),Mt(q,38,qe,yn,yn+.03,12.5,zi),Mt(ae,qe,U,D,yn,_o,zi,3),Mt(q,qe,U,yn,yn+.03,_o,zi),wr([[38,14.1],[38,12.52]],[yn+.1,yn+.1],1.05),wr([[vs[0],15.32],[37.2,15.32]],[yn+.1,yn+.1],1.05),Ws(42.2,yn+.03,13.7,.45),xi(41.5,yn+.03,13.7,Jn),xi(42.9,yn+.03,13.7,Jn),ds(zn,43.1,yn+.03,14.9,.03,2.2,6),ds(Qp,43.1,yn+1.2,14.9,.02,1.1,10,.13);for(let[S,B,$]of[[39,40.8,17.2],[45.4,47.2,19.3]])Mt(qn,S,B,yn+.03,yn+.48,$,$+.45,1);Ws(51.5,yn+.03,15.6,.45),xi(50.8,yn+.03,15.6,Jn),xi(52.2,yn+.03,15.6,Jn),Mt(me,vs[0]-.3,38,$t,$t+.05,12.5,15.3);{let S=Math.max(1,Math.ceil((yn-$t)/.16)),B=(yn-$t)/S,$=Vt=>[36.4+1.6*(1-Math.cos(Math.PI*Vt/2)),12+2.35*Math.sin(Math.PI*Vt/2)],vt=[[],[]],Bt=[];for(let Vt=0;Vt<S;Vt++){let ie=$(Vt/S),Ee=$((Vt+1)/S),Ye=$t+(Vt+1)*B,Ge=[(ie[0]+Ee[0])/2,(ie[1]+Ee[1])/2],cn=Math.hypot(Ee[0]-ie[0],Ee[1]-ie[1]),vn=new Ci(1.4,Ye-$t+.3,Math.max(.28,cn));vn.translate(0,-(Ye-$t+.3)/2,0),vn.rotateY(Math.atan2(Ee[0]-ie[0],-(Ee[1]-ie[1]))),vn.translate(Ge[0],Ye,-Ge[1]),gi(vn,Pe);let Sn=new Ci(1.36,.035,.03);Sn.rotateY(Math.atan2(Ee[0]-ie[0],-(Ee[1]-ie[1]))),Sn.translate(ie[0],Ye-.06,-ie[1]),gi(Sn,Bi);let Un=-(Ee[1]-ie[1])/cn,On=(Ee[0]-ie[0])/cn;for(let bi of[0,1])vt[bi].push([Ge[0]+(bi?1:-1)*.72*Un,Ge[1]+(bi?1:-1)*.72*On]);Bt.push(Ye)}for(let Vt of[0,1])wr(vt[Vt],Bt.map(ie=>ie+.05),1)}for(let[S,B,$]of[[35.55,13,.7],[35.75,14.2,.9],[36.2,15,.55]])Hi(S1,S,$t+$*.5,B,$,$*.7,$*.8);Mt(E1,vs[0]-.3,36.2,$t+.05,$t+.08,12.6,15.2),ds(wn,35.5,$t,14.8,.06,1.6,6),Hi(rn,35.5,$t+1.9,14.8,.55,.6,.5);{let S=Math.max(1,Math.ceil((Fe-yn)/.165)),B=(Fe-yn)/S,$=.28,vt=vs[0]+S*$;for(let Bt=0;Bt<S;Bt++){let Vt=vt-Bt*$,ie=Vt-$,Ee=yn+(Bt+1)*B;Mt(Pe,ie,Vt,yn,Ee,18.45,zi-.02,1),Mt(Bi,ie-.01,ie+.01,Ee-.07,Ee-.04,18.47,zi-.05)}wr([[vt,18.43],[vs[0],18.43]],[yn+.05,Fe+.05],1)}Mt(he,vs[0],U,D,Fe,zi,X,3),Mt(q,vs[0],U,Fe,Fe+.03,zi,X),na(vs[0],zi+.02,U,zi+.02,Fe,1.05),Gr(37.5,43.9,Fe,zi+.4,zi+1.3),Gr(47.7,56,Fe,zi+.4,zi+1.3),Wr(45.5,yn+2.6,zi-.03,.22,.4);{let $=Ni(1771),vt=17,Bt=Fe;ds(he,45.8,Bt,21.3,1.1,.35,20),rl(Jp,[45.8,Bt,21.3],[45.8+.35,Bt+vt*.86,21.3-.25],.55,.16);let Vt=[[4.8,5.4],[6.6,6],[8.4,5.6],[10.2,4.9],[11.9,4.1],[13.5,3.1],[15,2.1],[16.3,1.1]],ie=[];for(let[Ge,cn]of Vt){let vn=Math.max(3,Math.round(cn*1.7)),Sn=45.8+Ge*.02,Un=21.3-Ge*.015;for(let On=0;On<vn*2;On++){let bi=On/(vn*2)*Math.PI*2+$()*.9,bs=cn*(.25+.6*$()),Ss=Sn+Math.cos(bi)*bs,Ns=Un+Math.sin(bi)*bs*.9,qr=Bt+Ge+($()-.3)*.9,ns=cn*(.22+.16*$())+.55;Hi($()<.35?v1:jp,Ss,qr,Ns,ns,.75+.55*$(),ns*(.85+.3*$())),$()<.5&&Hi(M1,Ss+($()-.5)*.8,qr+.55,Ns+($()-.5)*.8,ns*.6,.45+.3*$(),ns*.55),Ge<12&&On%2&&rl(Jp,[Sn,qr-.3,Un],[Sn+(Ss-Sn)*.8,qr-.1,Un+(Ns-Un)*.8],.12,.06),Ge<9&&On%2&&ie.push([Ss-Math.cos(bi)*.6,qr-.55,Ns-Math.sin(bi)*.6])}Hi(jp,Sn,Bt+Ge+.35,Un,cn*.4,.8,cn*.4)}let Ee=[tm,em,T1,tm,em];for(let[Ge,cn,vn]of ie)for(let Sn=0,Un=3+Math.floor($()*3);Sn<Un;Sn++){let On=.24+.06*$();Hi(Ee[Math.floor($()*Ee.length)],Ge,cn-.35-Sn*.62,vn,On,On*.88,On)}let Ye=new Ke(new _s(.5,2.2),qu(pi(96,420,(Ge,cn,vn)=>{Ge.fillStyle="#f3efe6",Ge.fillRect(0,0,cn,vn),Ge.fillStyle="#1b1b1b",Ge.font=`62px ${$u}`,Ge.textAlign="center",Ge.textBaseline="middle",[..."\u65E0\u4E8B\u5C0F\u795E\u4ED9"].forEach((Sn,Un)=>Ge.fillText(Sn,cn/2,48+Un*80))})));Ye.position.set(45.8+2.3,Bt+3.4,-(21.3-2.4)),Ye.rotation.y=1.2,J.add(Ye)}Mt(ln,13.5,27,Fe,Fe+.45,X-1.3,X-.25);for(let S=13.8;S<26.8;S+=.62)Hi(Gs,S,Fe+.95,X-.78,.42,.55,.42);for(let S of[16,16.9,17.8,18.7])xi(S,Fe+.03,X-2.1,Jn);Mt(It,5,27,Fe,12.6,X-.22,X,1),Mt(Xt,5,27,12.6,12.72,X-.3,X);for(let S=6.5;S<27;S+=3)Wr(S,10.7,X-.25,.22,.42);let rm={left:S=>S<1?k(0):S<tn[1]+An?$t:Fe,right:S=>S<ei?Ai(U):S<zi?yn:Fe,back:()=>Fe},Ju=(S,B,$,vt)=>{for(let Bt=1;Bt<B.length;Bt++){let[Vt,ie]=[B[Bt-1],B[Bt]],Ee=$(Vt),Ye=$(ie),Ge=Z(Vt[0],Vt[1]),cn=Z(ie[0],ie[1]);if(Math.max(Ge-Ee,cn-Ye)<.05)continue;let vn=[Vt[0],Math.min(Ee,Ge)-.3,Vt[1]],Sn=[ie[0],Math.min(Ye,cn)-.3,ie[1]],Un=[ie[0],Math.max(Ye,cn)+.15,ie[1]],On=[Vt[0],Math.max(Ee,Ge)+.15,Vt[1]],bi=Math.hypot(ie[0]-Vt[0],ie[1]-Vt[1]),bs=[[0,vn[1]/3],[bi/3,Sn[1]/3],[bi/3,Un[1]/3],[0,On[1]/3]];vt>0?Ti(S,vn,Sn,Un,On,bs):Ti(S,Sn,vn,On,Un,bs);let Ss=-(ie[1]-Vt[1])/bi*.2,Ns=(ie[0]-Vt[0])/bi*.2;Ti(et,[Vt[0]-Ss,On[1],Vt[1]-Ns],[ie[0]-Ss,Un[1],ie[1]-Ns],[ie[0]+Ss,Un[1],ie[1]+Ns],[Vt[0]+Ss,On[1],Vt[1]+Ns])}},ju=(S,B,$=Math.ceil(Math.hypot(B[0]-S[0],B[1]-S[1])/1.25))=>[...Array($+1)].map((vt,Bt)=>[S[0]+(B[0]-S[0])*Bt/$,S[1]+(B[1]-S[1])*Bt/$]);Ju(he,ju([0,H],[0,X]),S=>rm.left(S[1]),1),Ju(ae,ju([U,H],[U,X]),S=>rm.right(S[1]),-1),Ju(he,ju([0,X],[U,X]),()=>Fe,1);for(let[S,B]of Er){let $=0;for(let Ge of B)$+=Ge.attributes.position.count;let vt=new Float32Array($*3),Bt=new Float32Array($*3),Vt=new Float32Array($*2),ie=0;for(let Ge of B)vt.set(Ge.attributes.position.array,ie*3),Bt.set(Ge.attributes.normal.array,ie*3),Ge.attributes.uv&&Vt.set(Ge.attributes.uv.array,ie*2),ie+=Ge.attributes.position.count;let Ee=new Ln;Ee.setAttribute("position",new $n(vt,3)),Ee.setAttribute("normal",new $n(Bt,3)),Ee.setAttribute("uv",new $n(Vt,2)),Ee.computeBoundingSphere();let Ye=new Ke(Ee,S);Ye.castShadow=!S.transparent&&S!==Bi&&S!==Ps,Ye.receiveShadow=!S.transparent,J.add(Ye)}{let S=new Pn,B=Be({color:"#c3302a",emissive:"#8f160f",emissiveIntensity:.55,roughness:.35}),$=new Ke(new Xi(1.5,24,16),B),vt=new Ke(new oo(1.32,3.2,24),B),Bt=new Ke(new Xi(.62,16,12),Be({color:"#fff4dc",emissive:"#ffe3a8",emissiveIntensity:.6}));vt.rotation.x=Math.PI,vt.position.y=1.6,$.position.y=3.9,Bt.position.set(0,3.9,1.2),S.add(vt,$,Bt);let Vt=j(25,11);S.position.set(Vt[0],Y+15.5,Vt[1]),S.userData={base:Y+15.5,head:5.4},Rt.add(S),ho=S}br.set(m.n,Y+15.5+5.4),m.modelNote="\u4E09\u7EF4\u6A21\u578B\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u548C\u822A\u62CD\u56FE\u5EFA\u9020\uFF1A\u4E00\u5C42\u767D\u8272\u8F6C\u89D2\u623F\u3001\u4E94\u95F4\u5E26\u77F3\u5899\u5C0F\u9662\u7684\u5BA2\u623F\u3001\u706F\u5149\u76F4\u68AF\u4E0E\u73BB\u7483\u95E8\u5927\u5802\uFF1B\u4E1C\u5934\u8336\u5BA4\u4E34\u8DEF\u4E00\u9762\u4E3A\u77F3\u6750\u52D2\u811A\u3001\u6728\u9970\u9762\u548C\u6728\u6846\u5927\u7A97\uFF0C\u5165\u6237\u77F3\u9636\u6CBF\u8336\u5BA4\u5411\u897F\u4E0A\u5230\u524D\u9662\uFF0C\u5916\u4FA7\u662F\u5927\u5757\u82B1\u5C97\u5CA9\u6321\u5899\u548C\u5C0F\u77F3\u50E7\u50CF\uFF1B\u8336\u5BA4\u4E1C\u5C71\u5899\u767D\u5899\u6DF1\u84DD\u52D2\u811A\uFF0C\u6302\u201C\u5C45\u4E4B\u6797\u201D\u7AD6\u533E\uFF0C\u9762\u671D\u505C\u8F66\u573A\uFF1B\u505C\u8F66\u573A\u671D\u5357\uFF0C\u4E00\u6392\u8F66\u4F4D\u5782\u76F4\u4E8E\u5317\u4FA7\u4E24\u7EA7\u6BDB\u77F3\u6321\u5899\uFF0C\u8F66\u5934\u671D\u5357\uFF0C\u5145\u7535\u6869\u6302\u5728\u6321\u5899\u4E0A\u3001\u6B63\u4E0A\u65B9\u662F\u53D1\u5149\u62DB\u724C\u201C\u5C45\u4E4B\u6797\u201D\u548C\u201C173 5664 8281\u3000\u9690\u4E8E\u5C71\u6797 \u5F52\u4E8E\u81EA\u7136\u201D\uFF1B\u6321\u5899\u4E0A\u65B9\u662F\u6709\u684C\u6905\u7684\u5E73\u53F0\uFF0C\u7531\u4E8C\u5C42\u6728\u5E73\u53F0\u7ECF\u5F27\u5F62\u706F\u5149\u697C\u68AF\u4E0A\u53BB\uFF0C\u518D\u6CBF\u77F3\u5899\u76F4\u68AF\u4E0A\u5230\u4E09\u5C42\uFF0C\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u957F\u5728\u4E09\u5C42\uFF1B\u4E8C\u5C42\u7EA2\u9676\u74E6\u5761\u9876\u5BA2\u623F\u548C\u5E73\u9876\u767D\u8272\u697C\uFF0C\u524D\u6709\u7F57\u6C49\u677E\u3001\u767D\u8272\u82B1\u6C60\u3001\u783E\u77F3\u6C40\u6B65\u4E0E\u6728\u5E73\u53F0\uFF1B\u4E09\u5C42\u5C4B\u9876\u9732\u53F0\u6709\u74E6\u5C4B\u9762\u4E0A\u7684\u6728\u8D28\u9636\u68AF\u5EA7\u3001\u6C34\u666F\u6C60\u548C\u6728\u683C\u6805\u6321\u5899\u58C1\u706F\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002"}}{let l=t.buildings.find(m=>m.osmId===541482372);if(l){let m=ar(...l.rectCenter,"\u767E\u5C81\u5BAB");m.position.y=l.base,m.rotation.y=Math.atan2(-l.axis[1],l.axis[0]);let _=l.width,b=l.depth,E=new G,P=[[-_/2-1,-b/2-1],[_/2+1,-b/2-1],[_/2+1,b/2+1],[-_/2-1,b/2+1]],U=[[-_*.14,-b*.2],[_*.14,-b*.2],[_*.14,b*.2],[-_*.14,b*.2]],X=P.map((k,Z)=>[(k[0]+U[Z][0])*.5,(k[1]+U[Z][1])*.5]),H=(k,Z)=>[k[0],Z,k[1]],D=l.wallHeight+.4,j=D+3.1;for(let k=0;k<4;k++){let Z=(k+1)%4;E.quad(H(P[k],D),H(P[Z],D),H(X[Z],j),H(X[k],j)),E.quad(H(X[k],j),H(X[Z],j),H(U[Z],D),H(U[k],D)),nn(m,[H(X[k],j+.08),H(X[Z],j+.08)],"#4e564c")}E.mesh(ct("#7b8da2",{map:Ct,side:mn}),m);let Y=new G;for(let k=0;k<4;k++){let Z=(k+1)%4;Y.quad(H(U[k],D-4),H(U[Z],D-4),H(U[Z],D),H(U[k],D),"#c7c4b4")}Y.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),m),qt(m,0,D-4,0,_*.28,.15,b*.4,be);for(let k of[-1,1])for(let Z=1;Z<5;Z++)qt(m,0,Z*3,k*(b/2+.24),_,.2,.6,be)}}function fx(l,{double:m=!1,roofCol:_="#f0b52e",wallCol:b="#f2b33a"}={}){let E=ar(...l.rectCenter,l.precinct||l.name||"\u5BFA\u9662");E.position.y=l.base,E.rotation.y=Math.atan2(-l.axis[1],l.axis[0]);let P=Math.cos(E.rotation.y),U=Math.sin(E.rotation.y),X=(It,ae)=>[l.rectCenter[0]+It*P+ae*U,l.rectCenter[1]-It*U+ae*P],H=l.width/2,D=l.depth/2,j=Math.max(l.wallHeight,m?11:7.5),Y=new G,k=new G,Z=new G,J=new G,at=0;for(let[It,ae]of[[-H,-D],[H,-D],[H,D],[-H,D],[0,D],[0,-D]])at=Math.min(at,v(...X(It*1.1,ae*1.1))-l.base);let pt=.9;bn(Y,-H-.6,H+.6,at-.5,pt,-D-.6,D+.6,"#d8d0bc"),bn(Y,-H-.75,H+.75,pt-.12,pt+.05,-D-.75,D+.75,"#c4bba5");for(let It=0;It<4;It++)bn(Y,-3.2,3.2,at-.5,pt-It*.22,D+.6+It*.38,D+.98+It*.38,"#d2cab5");let Dt=1.9,yt=H-Dt,Ht=D-Dt,kt=m?j*.56:j*.86;bn(k,-yt,yt,pt,kt,-Ht,Ht,b);let St="#b8332a",O=(It,ae,he,se)=>bn(k,It-.28,It+.28,he,se,ae-.28,ae+.28,St),ot=Math.max(2,Math.round(2*H/3.4)),gt=Math.max(2,Math.round(2*D/3.4));for(let It=0;It<=ot;It++){let ae=-H+.5+It*(2*H-1)/ot;O(ae,-D+.5,pt,kt),O(ae,D-.5,pt,kt)}for(let It=1;It<gt;It++){let ae=-D+.5+It*(2*D-1)/gt;O(-H+.5,ae,pt,kt),O(H-.5,ae,pt,kt)}let rt=(It,ae,he,se,ne)=>{bn(J,It,ae,ne-.75,ne,he,se,"#2f6f6c"),bn(J,It-.01,ae+.01,ne-.85,ne-.75,he-.01,se+.01,"#e2b64a")};rt(-H+.2,H-.2,-D+.2,-D+.75,kt),rt(-H+.2,H-.2,D-.75,D-.2,kt),rt(-H+.2,-H+.75,-D+.2,D-.2,kt),rt(H-.75,H-.2,-D+.2,D-.2,kt);let ut=Math.max(3,Math.min(7,Math.round(2*yt/3.4)|1)),ft=2*yt/ut;for(let It=0;It<ut;It++){let ae=-yt+It*ft+.25,he=-yt+(It+1)*ft-.25;bn(J,ae,he,pt+.1,Math.min(kt-1,pt+4.2),Ht,Ht+.08,"#8e2a20");for(let se=1;se<4;se++){let ne=pt+.1+se*(Math.min(kt-1,pt+4.2)-pt-.1)/4;bn(J,ae,he,ne-.04,ne+.04,Ht+.08,Ht+.12,"#d9ad4c")}bn(J,(ae+he)/2-.04,(ae+he)/2+.04,pt+.1,Math.min(kt-1,pt+4.2),Ht+.08,Ht+.12,"#d9ad4c")}function st(It,ae,he,se,ne,me=1.5){let q=he+se*.48,Et=he+se,wt=Math.max(1,It-ae*.62),Nt=ae*.5,et=10,Ut=Xt=>me*Math.pow(Xt,3),ge=(Xt,Pe)=>[Xt,he+Ut(Math.max(Math.abs(Xt)/It,Math.abs(Pe)/ae)),Pe];for(let Xt of[-1,1])for(let Pe=0;Pe<et;Pe++){let ln=-1+2*Pe/et,rn=-1+2*(Pe+1)/et;Z.quad(ge(ln*It,Xt*ae),ge(rn*It,Xt*ae),[rn*wt,q,Xt*Nt],[ln*wt,q,Xt*Nt],ne)}for(let Xt of[-1,1])for(let Pe=0;Pe<et;Pe++){let ln=-1+2*Pe/et,rn=-1+2*(Pe+1)/et;Z.quad(ge(Xt*It,ln*ae),ge(Xt*It,rn*ae),[Xt*wt,q,rn*Nt],[Xt*wt,q,ln*Nt],ne)}for(let Xt of[-1,1])Z.quad([-wt,q,Xt*Nt],[wt,q,Xt*Nt],[wt+.15,Et,0],[-wt-.15,Et,0],ne);for(let Xt of[-1,1])k.tri([Xt*wt,q,-Nt],[Xt*wt,q,Nt],[Xt*wt,Et,0],St);bn(J,-wt-.4,wt+.4,Et-.15,Et+.55,-.32,.32,Ha(ne,-.18));for(let Xt of[-1,1])bn(J,Xt*(wt+.1)-.35,Xt*(wt+.1)+.35,Et,Et+1.7,-.3,.3,"#c9952e"),bn(J,Xt*(wt+.1)-(Xt>0?.9:-.5),Xt*(wt+.1)+(Xt>0?-.5:.9),Et+1.2,Et+1.7,-.26,.26,"#c9952e");for(let[Xt,Pe]of[[-1,-1],[1,-1],[1,1],[-1,1]])bn(J,Xt*It-.18,Xt*It+.18,he+me-.05,he+me+.45,Pe*ae-.18,Pe*ae+.18,Ha(ne,-.22))}let Tt=_,Ce=Math.max(l.roofRise||0,D*.55,3.5);if(m){let It=yt-.2,ae=Ht-.2;bn(k,-It,It,kt,j,-ae,ae,b);for(let Nt=0;Nt<=ot;Nt++){let et=-It+Nt*2*It/ot;bn(k,et-.22,et+.22,kt+1.4,j,ae,ae+.06,St),bn(k,et-.22,et+.22,kt+1.4,j,-ae-.06,-ae,St)}let he=H+1.3,se=D+1.3,ne=kt+.2,me=ne+1.9,q=10,Et=Nt=>1.1*Math.pow(Nt,3),wt=(Nt,et)=>[Nt,ne+Et(Math.max(Math.abs(Nt)/he,Math.abs(et)/se)),et];for(let Nt of[-1,1])for(let et=0;et<q;et++){let Ut=-1+2*et/q,ge=-1+2*(et+1)/q;Z.quad(wt(Ut*he,Nt*se),wt(ge*he,Nt*se),[ge*It,me,Nt*ae],[Ut*It,me,Nt*ae],Tt)}for(let Nt of[-1,1])for(let et=0;et<q;et++){let Ut=-1+2*et/q,ge=-1+2*(et+1)/q;Z.quad(wt(Nt*he,Ut*se),wt(Nt*he,ge*se),[Nt*It,me,ge*ae],[Nt*It,me,Ut*ae],Tt)}rt(-It,It,ae,ae+.1,j),rt(-It,It,-ae-.1,-ae,j),st(It+1.6,ae+1.6,j,Ce,Tt,1.6)}else st(H+1.4,D+1.4,kt+.15,Ce,Tt,1.5);Y.mesh(ct("#ffffff",{vertexColors:!0}),E),k.mesh(ct("#ffffff",{vertexColors:!0,map:Ot,side:mn}),E),Z.mesh(ct("#ffffff",{vertexColors:!0,map:Ct,side:mn}),E),J.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),E)}for(let l of Xn){let m=t.buildings.find(_=>_.osmId===l);if(m){let _=m.ring,b=m.base-.4,E=3.9,P=m.base+E,U=new G,X=new G,H=0;_.forEach((ut,ft)=>{let st=_[(ft+1)%_.length];H+=ut[0]*st[1]-st[0]*ut[1]});for(let ut=0;ut<_.length;ut++){let ft=_[ut],st=_[(ut+1)%_.length],Tt=Math.hypot(st[0]-ft[0],st[1]-ft[1]);U.quad([ft[0],b,ft[1]],[st[0],b,st[1]],[st[0],P,st[1]],[ft[0],P,ft[1]],"#f6f7f5",[[0,b/.6],[Tt/.6,b/.6],[Tt/.6,P/.6],[0,P/.6]]);let Ce=(H>0?1:-1)*(st[1]-ft[1])/Tt*.03,It=(H>0?-1:1)*(st[0]-ft[0])/Tt*.03;U.quad([ft[0]+Ce,b,ft[1]+It],[st[0]+Ce,b,st[1]+It],[st[0]+Ce,m.base+1.1,st[1]+It],[ft[0]+Ce,m.base+1.1,ft[1]+It],"#9aa2a6",[[0,0],[Tt/.6,0],[Tt/.6,1.5/.6],[0,1.5/.6]]);let ae=Ce*12,he=It*12;X.quad([ft[0]+ae,P,ft[1]+he],[st[0]+ae,P,st[1]+he],[st[0]+ae,P+.45,st[1]+he],[ft[0]+ae,P+.45,ft[1]+he],"#6f7a80")}let D=new G;for(let ut of Ks.triangulateShape(_.map(ft=>new fe(ft[0],ft[1])),[]))D.tri(...ut.map(ft=>[_[ft][0],P+.3,_[ft][1]]),"#b9bec0");let j=_[m.front],Y=_[(m.front+1)%_.length],k=Math.hypot(Y[0]-j[0],Y[1]-j[1]),Z=(Y[0]-j[0])/k,J=(Y[1]-j[1])/k,at=(H>0?1:-1)*J,pt=(H>0?-1:1)*Z,Dt=document.createElement("canvas");Dt.width=1024,Dt.height=256;let yt=Dt.getContext("2d");yt.fillStyle="#1f5fae",yt.fillRect(0,0,1024,128),yt.fillStyle="#fff",yt.font='bold 84px "PingFang SC","Noto Sans SC",sans-serif',yt.textAlign="center",yt.textBaseline="middle",yt.fillText("\u516C\u5171\u5395\u6240  WC",512,68);let Ht=(ut,ft,st)=>{yt.fillStyle=ft,yt.fillRect(ut,128,128,128),yt.fillStyle="#fff",yt.beginPath(),yt.arc(ut+64,158,14,0,7),yt.fill(),st?(yt.beginPath(),yt.moveTo(ut+64,174),yt.lineTo(ut+92,224),yt.lineTo(ut+36,224),yt.fill(),yt.fillRect(ut+52,224,8,22),yt.fillRect(ut+68,224,8,22)):(yt.fillRect(ut+48,174,32,46),yt.fillRect(ut+50,220,11,28),yt.fillRect(ut+67,220,11,28))};Ht(0,"#1f5fae",!1),Ht(128,"#d0342c",!0),yt.font='bold 92px "PingFang SC",sans-serif',yt.fillStyle="#1f5fae",yt.fillText("\u7537",320,194),yt.fillStyle="#d0342c",yt.fillText("\u5973",448,194);let kt=new as(Dt);kt.colorSpace=kn,kt.anisotropy=8;let St=new G,O=(ut,ft,st,Tt,Ce,It,ae,he)=>{let se=j[0]+Z*ft+at*It,ne=j[1]+J*ft+pt*It;ut.quad([se-Z*Tt/2,st,ne-J*Tt/2],[se+Z*Tt/2,st,ne+J*Tt/2],[se+Z*Tt/2,st+Ce,ne+J*Tt/2],[se-Z*Tt/2,st+Ce,ne-J*Tt/2],ae,he)},ot=Math.min(k*.7,7.5);O(St,k/2,m.base+2.75,ot,ot/8,.08,"#ffffff",[[0,.5],[1,.5],[1,1],[0,1]]);for(let[ut,ft]of[[0,.27],[1,.73]]){let st=k*ft;O(X,st,m.base,1.5,2.35,.06,"#2f3a40"),O(X,st,m.base,1.7,.12,.07,"#e9ece9"),O(X,st-.85,m.base,.12,2.47,.07,"#e9ece9"),O(X,st+.85,m.base,.12,2.47,.07,"#e9ece9"),O(St,st+(ut?-1.35:1.35),m.base+1.45,.62,.62,.09,"#ffffff",[[ut*.125,0],[ut*.125+.125,0],[ut*.125+.125,.5],[ut*.125,.5]])}O(St,k*.27,m.base+2.42,.5,.25,.09,"#ffffff",[[.25,.08],[.375,.08],[.375,.42],[.25,.42]]),O(St,k*.73,m.base+2.42,.5,.25,.09,"#ffffff",[[.375,.08],[.5,.08],[.5,.42],[.375,.42]]);let gt=(()=>{let ut=document.createElement("canvas");ut.width=ut.height=64;let ft=ut.getContext("2d");ft.fillStyle="#fff",ft.fillRect(0,0,64,64),ft.fillStyle="#c9cfd2",ft.fillRect(0,0,64,3),ft.fillRect(0,0,3,64);let st=new as(ut);return st.wrapS=st.wrapT=ro,st.colorSpace=kn,st})(),rt=new Pn;rt.userData.placeId=ll(Object.keys(ir).find(ut=>ir[ut]===l)),Yt.add(rt),an.push(rt),U.mesh(ct("#ffffff",{vertexColors:!0,map:gt,side:mn}),rt),X.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),rt),D.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),rt),St.mesh(new os({map:kt,toneMapped:!1,side:mn,polygonOffset:!0,polygonOffsetFactor:-2}),rt)}}{let _=mi(-1372,-25),b=new Pn;b.position.set(-1372,_,-25),b.rotation.y=Math.atan2(10,-37),b.userData.placeId=ll("\u864E\u5F62\u5C71\u8F66\u7AD9"),Yt.add(b),an.push(b);let E=3,P=2.2,U=3.3,X=ct("#f6f4ee"),H=ct("#2a62c9"),D=ct("#33424a");qt(b,0,-.6,0,E*2+.6,.6,P*2+.6,ct("#c9c3b3")),qt(b,0,0,0,E*2,U,P*2,X),qt(b,0,U,0,E*2+.8,.35,P*2+.8,ct("#d8dcdc")),qt(b,0,U-.9,P+.03,E*2+.1,.75,.12,H),qt(b,-.9,.95,P+.02,1.6,1.15,.08,ct("#7fa4b5")),qt(b,-.9,.9,P+.2,1.9,.08,.4,D),qt(b,1.25,0,P+.02,1,2.2,.08,D);let j=document.createElement("canvas");j.width=512,j.height=96;let Y=j.getContext("2d");Y.fillStyle="#2a62c9",Y.fillRect(0,0,512,96),Y.fillStyle="#fff",Y.font='bold 64px "PingFang SC","Noto Sans SC",sans-serif',Y.textAlign="center",Y.textBaseline="middle",Y.fillText("\u552E \u7968 \u5904",256,52);let k=new as(j);k.colorSpace=kn;let Z=new Ke(new _s(E*2-.4,.62),new os({map:k,toneMapped:!1}));Z.position.set(0,U-.52,P+.1),b.add(Z)}for(let l of _n){let m=l.area>=600,_=l.osmId===609990009?"#D9A93A":l.roofColor;fx(l,{double:m,roofCol:z[_]||_,wallCol:xt[l.wallColor]||l.wallColor||"#f2b33a"})}{let l=t.buildings.find(m=>m.name==="\u4E07\u4F5B\u5854");if(l){let m=ar(...l.center,"\u4E07\u4F5B\u5854");m.position.y=l.base;for(let _=0;_<7;_++){let b=6.2-_*.51;we(m,0,_*4.3,0,b,3.5,I);let E=new oo(b+1.4,1.4,8),P=new Ke(E,I);P.position.y=_*4.3+4,m.add(P)}we(m,0,30,0,.36,3,I)}}function dx(l,m=2){let _=l;for(let b=0;b<m&&_.length>2;b++){let E=[_[0]];for(let P=1;P<_.length;P++){let U=_[P-1],X=_[P];E.push([U[0]*.75+X[0]*.25,U[1]*.75+X[1]*.25],[U[0]*.25+X[0]*.75,U[1]*.25+X[1]*.75])}E.push(_.at(-1)),_=E}return _}function px(l,m){let _=0,b=[];for(let H=1;H<l.length;H++){let D=Math.hypot(l[H][0]-l[H-1][0],l[H][1]-l[H-1][1]);b.push(D),_+=D}let E=Math.max(1,Math.round(_/m)),P=[l[0]],U=0,X=0;for(let H=1;H<E;H++){let D=_*H/E;for(;U<b.length-1&&X+b[U]<D;)X+=b[U],U++;let j=b[U]?(D-X)/b[U]:0,Y=l[U],k=l[U+1];P.push([Y[0]+(k[0]-Y[0])*j,Y[1]+(k[1]-Y[1])*j])}return P.push(l.at(-1)),P}let Hl=new Map,Vl=8,mx=(l,m)=>Math.floor(l/Vl)+","+Math.floor(m/Vl);function uo(l,m,_,b=-1,E=!1){let P=null,U=_,X=Math.floor(l/Vl),H=Math.floor(m/Vl);for(let D=-1;D<=1;D++)for(let j=-1;j<=1;j++)for(let Y of Hl.get(X+D+","+(H+j))||[]){if(Y[7]===b)continue;let k=Y[2]-Y[0],Z=Y[3]-Y[1],J=k*k+Z*Z||1,at=ii(((l-Y[0])*k+(m-Y[1])*Z)/J,0,1),pt=Y[0]+k*at,Dt=Y[1]+Z*at,yt=Math.hypot(l-pt,m-Dt);yt<U&&(E||yt<Y[6])&&(U=yt,P=[pt,Dt,Y[4]+(Y[5]-Y[4])*at,Y[6],Y[7]])}return P}let lu=0,Zd=[],Jd=[],gx=(l,m)=>[(l+e/2)/e,1-(m+n/2)/n];function jd(l,m,_,b,E=null,{lift:P=.15,step:U=3,smooth:X=!0,level:H=!0,shoulder:D=2,bridge:j=!1}={}){let Y=px(X?dx(l):l,U).filter((O,ot,gt)=>!ot||Math.hypot(O[0]-gt[ot-1][0],O[1]-gt[ot-1][1])>.05);if(Y.length<2)return Y;let k=m/2,Z=E?Math.min(.6,m*.2):0,J=Y.length,at=Y.map(O=>mi(O[0],O[1]));if(j){let O=ft=>uo(Y[ft][0],Y[ft][1],8)?.[2]??at[ft],ot=O(0),gt=O(J-1),rt=0,ut=[0];for(let ft=1;ft<J;ft++)ut.push(rt+=Math.hypot(Y[ft][0]-Y[ft-1][0],Y[ft][1]-Y[ft-1][1]));at=ut.map(ft=>ot+(gt-ot)*ft/(rt||1))}else if(H){let O=Math.max(1,Math.round(8/U));at=at.map((rt,ut)=>{let ft=0,st=0;for(let Tt=Math.max(0,ut-O);Tt<=Math.min(J-1,ut+O);Tt++)ft+=at[Tt],st++;return ft/st});let ot=[0];for(let rt=1;rt<J;rt++)ot.push(ot[rt-1]+Math.hypot(Y[rt][0]-Y[rt-1][0],Y[rt][1]-Y[rt-1][1]));let gt=Y.map((rt,ut)=>{let ft=ut===0||ut===J-1,st=ft?uo(rt[0],rt[1],k+3,-1,!0):uo(rt[0],rt[1],k+2);return st&&(ft||st[3]>=k+.2)?st[2]:null});for(let rt of Jd){let ut=-1,ft=k+1.5;for(let st=0;st<J;st++){let Tt=Math.hypot(Y[st][0]-rt[0],Y[st][1]-rt[1]);Tt<ft&&(ft=Tt,ut=st)}ut>=0&&gt[ut]==null&&(gt[ut]=rt[2])}at=at.map((rt,ut)=>{if(gt[ut]!=null)return gt[ut];let ft=null,st=15;for(let It=0;It<J;It++)gt[It]!=null&&Math.abs(ot[It]-ot[ut])<st&&(st=Math.abs(ot[It]-ot[ut]),ft=gt[It]);if(ft==null)return rt;let Tt=st/15,Ce=Tt*Tt*(3-2*Tt);return ft+(rt-ft)*Ce})}let pt=Y.map((O,ot)=>{let gt=Y[Math.max(0,ot-1)],rt=Y[Math.min(J-1,ot+1)],ut=Math.hypot(rt[0]-gt[0],rt[1]-gt[1])||1;return[(rt[0]-gt[0])/ut,(rt[1]-gt[1])/ut]}),Dt=new Map,yt=O=>{if(!Dt.has(O)){let ot,gt;Dt.set(O,Y.map((rt,ut)=>{let ft=rt[0]-pt[ut][1]*O,st=rt[1]+pt[ut][0]*O;return ut&&(ft-ot)*pt[ut][0]+(st-gt)*pt[ut][1]<=0&&(ft=ot,st=gt),ot=ft,gt=st,[ft,st]}))}return Dt.get(O)},Ht=(O,ot,gt)=>{let[rt,ut]=yt(ot)[O];return[rt,H?gt:mi(rt,ut)+gt-at[O],ut]},kt=O=>at[O]+P,St=O=>at[O]+P-.04;for(let O=1;O<J;O++)Z&&(_.edge.quad(Ht(O-1,-k,St(O-1)),Ht(O,-k,St(O)),Ht(O,-k+Z,St(O)),Ht(O-1,-k+Z,St(O-1)),E),_.edge.quad(Ht(O-1,k-Z,St(O-1)),Ht(O,k-Z,St(O)),Ht(O,k,St(O)),Ht(O-1,k,St(O-1)),E)),_.fill.quad(Ht(O-1,-k+Z,kt(O-1)),Ht(O,-k+Z,kt(O)),Ht(O,k-Z,kt(O)),Ht(O-1,k-Z,kt(O-1)),b);for(let[O,ot]of[[0,-1],[J-1,1]]){let gt=Y[O],rt=Math.atan2(pt[O][1],pt[O][0]),ut=(ft,st,Tt)=>[gt[0]+Math.cos(ft)*st*ot,Tt,gt[1]+Math.sin(ft)*st*ot];for(let ft=0;ft<8;ft++){let st=rt-Math.PI/2+Math.PI*ft/8,Tt=rt-Math.PI/2+Math.PI*(ft+1)/8;_.fill.tri([gt[0],kt(O),gt[1]],ut(st,k-Z,kt(O)),ut(Tt,k-Z,kt(O)),b),Z&&_.edge.quad(ut(st,k-Z,St(O)),ut(Tt,k-Z,St(O)),ut(Tt,k,St(O)),ut(st,k,St(O)),E)}}if(j)for(let O of[-1,1])for(let ot=1;ot<J;ot++)_.edge.quad(Ht(ot-1,O*k,St(ot-1)),Ht(ot,O*k,St(ot)),Ht(ot,O*k,St(ot)-1),Ht(ot-1,O*k,St(ot-1)-1),"#cfc8b6");if(H&&_.skirt&&!j){Zd.push({s:Y,h:at,dir:pt,w:k,shoulder:D,lift:P,id:lu,L:_,off:yt}),Jd.push([Y[0][0],Y[0][1],at[0]],[Y[J-1][0],Y[J-1][1],at[J-1]]),hn.lineCap=hn.lineJoin="round",hn.strokeStyle="#fff",hn.lineWidth=(m+D*1.1)/e*Oe,hn.beginPath(),Y.forEach((O,ot)=>{let gt=(O[0]+e/2)/e*Oe,rt=(O[1]+n/2)/n*Oe;ot?hn.lineTo(gt,rt):hn.moveTo(gt,rt)}),hn.stroke();for(let O=1;O<J;O++){let ot=[Y[O-1][0],Y[O-1][1],Y[O][0],Y[O][1],at[O-1],at[O],k,lu],gt=new Set;for(let rt of[0,.25,.5,.75,1])gt.add(mx(Y[O-1][0]+(Y[O][0]-Y[O-1][0])*rt,Y[O-1][1]+(Y[O][1]-Y[O-1][1])*rt));for(let rt of gt)Hl.has(rt)||Hl.set(rt,[]),Hl.get(rt).push(ot)}}return lu++,Y}let Wo={fill:"#62676b",edge:"#d6d1c4"},Kd={primary:{w:6.5,...Wo},tertiary:{w:4.6,...Wo},residential:{w:4,...Wo},unclassified:{w:4,...Wo},service:{w:3.4,...Wo},bus_stop:{w:3,...Wo},footway:{w:2.2,fill:"#d9d4c7",edge:"#9c9483"},path:{w:1.9,fill:"#e2bf84",edge:"#a27a45"},steps:{w:2.4,fill:"#cfc9bb",edge:"#8f8776"},alley:{w:1.2,fill:"#d3cec1",edge:"#8f887a"}},cu={primary:6,tertiary:5,residential:4,unclassified:4,service:3,bus_stop:3,footway:2,steps:2,alley:1,path:1},Qd=()=>({edge:new G,fill:new G,skirt:new G}),Gl=Qd(),Wl=Qd(),tp=new G,hu={edge:new G,fill:new G,skirt:null},xx=l=>[l.pts[0],l.pts.at(-1)].filter(m=>t.roads.some(_=>_!==l&&_.pts.some((b,E)=>E&&E<_.pts.length-1&&Math.hypot(b[0]-m[0],b[1]-m[1])<6||E&&(()=>{let P=_.pts[E-1],U=b[0]-P[0],X=b[1]-P[1],H=U*U+X*X||1,D=ii(((m[0]-P[0])*U+(m[1]-P[1])*X)/H,.05,.95);return Math.hypot(m[0]-P[0]-U*D,m[1]-P[1]-X*D)<2})()))).length;for(let l of t.roads)l._ends=xx(l);for(let l of[...t.roads].sort((m,_)=>!!m.bridge-!!_.bridge||(cu[_.kind]||3)-(cu[m.kind]||3)||m._ends-_._ends)){if(l.model==="stair")continue;let m=Kd[l.kind]||Kd.service,_=["steps","path","footway","alley"].includes(l.kind),b=Math.max(l.width,m.w),E=cu[l.kind]||3,P=jd(l.pts,b,_?Wl:Gl,m.fill,m.edge,{lift:.14+E*.012+(l.drape?.12:0),step:l.drape?1:_?4:5,bridge:!!l.bridge,smooth:!l.bridge,level:!l.drape,shoulder:_?1.4:2.2});if(l.kind==="primary"||l.kind==="tertiary"){let U=P.map(X=>uo(X[0],X[1],1)?.[2]??mi(X[0],X[1]));for(let X=0;X+1<P.length;X+=3){let H=(U[X]+U[X+1])/2+.14+E*.012+.03;tp.quad(...[[P[X],-.11],[P[X+1],-.11],[P[X+1],.11],[P[X],.11]].map(([D,j])=>{let Y=[P[X+1][0]-P[X][0],P[X+1][1]-P[X][1]],k=Math.hypot(...Y)||1;return[D[0]-Y[1]/k*j,H,D[1]+Y[0]/k*j]}),"#ffffff")}}if(l.kind==="steps"){let U=0;for(let X=1;X<P.length;X++){let H=P[X-1],D=P[X],j=Math.hypot(D[0]-H[0],D[1]-H[1]),Y=-(D[1]-H[1])/j,k=(D[0]-H[0])/j;for(let Z=(.7-U%.7)/j;Z<1;Z+=.7/j){let J=H[0]+(D[0]-H[0])*Z,at=H[1]+(D[1]-H[1])*Z,pt=b*.4,Dt=(uo(J,at,1)?.[2]??mi(J,at))+.2+E*.012;nn(Me,[[J+Y*pt,Dt,at+k*pt],[J-Y*pt,Dt,at-k*pt]],"#9c8a6c")}U+=j}}if(l.bridge)for(let U of[-1,1]){let X=l.pts.map((H,D)=>{let j=l.pts[Math.min(D+1,l.pts.length-1)]||H,Y=l.pts[Math.max(0,D-1)],k=j[0]-Y[0],Z=j[1]-Y[1],J=Math.hypot(k,Z)||1,at=H[0]-Z/J*b/2*U,pt=H[1]+k/J*b/2*U;return[at,(uo(H[0],H[1],b)?.[2]??v(...H))+1.1,pt]});nn(Rt,X,"#ceccc0")}}for(let l of Zd){let{s:m,h:_,dir:b,w:E,shoulder:P,lift:U,id:X,L:H,off:D}=l,j=m.length,Y=(J,at,pt)=>{let[Dt,yt]=D(at)[J];return[Dt,pt??mi(Dt,yt),yt]},k=J=>{let at=uo(J[0],J[2],12,X);return at&&(J[1]=Math.min(J[1],at[2]-.15)),J},Z=(J,at,pt,Dt)=>H.skirt.quad(...[J,at,pt,Dt].map(k),"#ffffff",[J,at,pt,Dt].map(yt=>gx(yt[0],yt[2])));for(let J of[-1,1])for(let at=1;at<j;at++)Z(Y(at-1,J*E,_[at-1]+U-.06),Y(at,J*E,_[at]+U-.06),Y(at,J*(E+P)),Y(at-1,J*(E+P)));for(let[J,at]of[[0,-1],[j-1,1]]){let pt=m[J],Dt=b[J],yt=Math.atan2(Dt[1],Dt[0]),Ht=_[J]+U-.06;for(let kt=0;kt<8;kt++){let St=yt-Math.PI/2+Math.PI*kt/8,O=yt-Math.PI/2+Math.PI*(kt+1)/8,ot=rt=>[pt[0]+Math.cos(rt)*E*at,Ht,pt[1]+Math.sin(rt)*E*at],gt=rt=>{let ut=pt[0]+Math.cos(rt)*(E+P)*at,ft=pt[1]+Math.sin(rt)*(E+P)*at;return[ut,mi(ut,ft),ft]};Z(ot(St),ot(O),gt(O),gt(St))}}}pn.needsUpdate=!0;for(let l of t.water)jd(l.pts,l.kind==="river"?5:1.8,hu,"#5fb4dc",l.kind==="river"?"#3f8fbd":null,{lift:.1,step:5,level:!1});let fo=l=>new os({vertexColors:!0,side:mn,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:l}),ep=new os({map:Rn,color:"#d9d9d9",side:mn});Gl.skirt.mesh(ep,At),Wl.skirt.mesh(ep,Me),Gl.edge.mesh(fo(-2),At),Wl.edge.mesh(fo(-2),Me),hu.edge.mesh(fo(-2),At),hu.fill.mesh(fo(-4),At),Wl.fill.mesh(fo(-4),Me),Gl.fill.mesh(fo(-6),At),tp.mesh(fo(-8),At);for(let l of t.areas.filter(m=>m.kind==="water")){let m=new G;for(let _ of l.triangles)m.tri(..._.map(b=>[b[0],v(...b)+.3,b[1]]),"#6b9290");m.mesh(ct("#ffffff",{vertexColors:!0,roughness:.25,side:mn}),At)}Gt("#load-text").textContent="\u94FA\u8BBE\u5C71\u6797\u3001\u7F06\u8F66\u4E0E\u5546\u5BB6\u6807\u8BB0",await new Promise(requestAnimationFrame);let yx=t.places.filter(l=>["\u4E0A\u95F5\u56ED","\u4E2D\u95F5\u56ED","\u4E0B\u95F5\u56ED","\u95F5\u56ED"].includes(l.n)).map(l=>[l.x,l.z]);function _x(l,m,_,b){if(_<420||_>1e3||b>1.1)return 0;let E=1e9;for(let[P,U]of yx)E=Math.min(E,Math.hypot(l-P,m-U));return E<900?.55:_<760&&E<2600?.12:0}let uu=[],Xl=[],lr=Ni(892),np=zs?3600:16e3;for(let l=0;l<np*8&&Xl.length<np;l++){let m=(lr()-.5)*e*.998,_=(lr()-.5)*n*.998,b=v(m,_),E=f(b);if(He(m,_)||E<100||E>1310)continue;let P=Math.hypot(v(m+10,_)-v(m-10,_),v(m,_+10)-v(m,_-10))/20/c;if(P>1.7&&lr()<.84)continue;let U=nt(m,_,E);if(lr()>.06+.94*U*U)continue;let X=(6.5+lr()*6.7)*(U>.6?1.15:.9),H=_x(m,_,E,P);if(H&&lr()<H){uu.push({x:m,z:_,h:b,s:9+lr()*4,r:lr()});continue}Xl.push({x:m,z:_,h:b,s:X,r:lr(),pine:lr()<.18+(E>800?.25:0)})}let po=3,ip=(l,m)=>Math.min(po-1,Math.max(0,Math.floor((l+e/2)/e*po)))*po+Math.min(po-1,Math.max(0,Math.floor((m+n/2)/n*po)));function Ga(){let l=new Th(1,0);l.deleteAttribute("normal"),l.deleteAttribute("uv");let m=Fg(l);return m.setAttribute("normal",m.getAttribute("position").clone()),m}let ql=ke(Fr[di].hiShapes),vx=ct("#686854"),Mx=ct("#ffffff"),bx=ct("#ffffff"),Sx=ct("#ffffff",{roughness:.85}),fu=zs?1:4,sp=zs?1.35:1,Wa=[],du=[...Array(po*po)].map(()=>({list:[],bamboo:[]}));for(let l of Xl)du[ip(l.x,l.z)].list.push(l);for(let l of uu)du[ip(l.x,l.z)].bamboo.push(l);let Oi=new vi,Xo=new fn,Yl=(l,m,_,b)=>{if(!_)return null;let E=new Nr(l,m,_);return E.receiveShadow=b,le.add(E),E};for(let l of du){let m=l.list,_=[0],b=[0];for(let k of m)_.push(_.at(-1)+(k.pine?0:1)),b.push(b.at(-1)+(k.pine?1:0));let E=Yl(ql.trunk,vx,m.length,!1),P=Yl(ql.leaf,Mx,_.at(-1),!0),U=Yl(ql.pine,bx,b.at(-1)*2,!0),X=Yl(ql.bamboo,Sx,l.bamboo.length*fu,!0),H=0,D=0,j=0,Y=0;for(let k of m){Oi.position.set(k.x,k.h+k.s*.35,k.z),Oi.rotation.set(0,k.r*6.28,0),Oi.scale.set(1,k.s*.7,1),Oi.updateMatrix(),E.setMatrixAt(H++,Oi.matrix);for(let Z=0;Z<2;Z++)k.pine?(Oi.position.set(k.x,k.h+k.s*(.68+Z*.36),k.z),Oi.scale.set(k.s*(.5-Z*.12),k.s*.91,k.s*(.5-Z*.12)),Xo.set(k.r>.5?"#2e7a52":"#3d8c5a"),Oi.updateMatrix(),U.setMatrixAt(j,Oi.matrix),U.setColorAt(j++,Xo)):Z||(Oi.position.set(k.x,k.h+k.s*.72,k.z),Oi.scale.set(k.s*.74,k.s*.5,k.s*.72),Xo.set(k.r<.05?"#f0b23e":k.r>.965?"#e86a3f":["#5aa646","#78bb4e","#3f8f45","#93c95a"][Math.floor(k.r*4)]),Oi.updateMatrix(),P.setMatrixAt(D,Oi.matrix),P.setColorAt(D++,Xo))}for(let k of l.bamboo)for(let Z=0;Z<fu;Z++){let J=k.r*6.28+Z*1.9,at=Z?2.2+(k.r*97+Z*13)%1*1.8:0;Oi.position.set(k.x+Math.cos(J)*at,k.h+k.s*(.6-.05*Z),k.z+Math.sin(J)*at),Oi.rotation.set(Math.sin(J)*.22,0,Math.cos(J)*.22),Oi.scale.set((2.1+.4*(Z*7%3))*sp,k.s*.46*(1-.06*Z),(2.1+.4*(Z*5%3))*sp),Oi.updateMatrix(),X.setMatrixAt(Y,Oi.matrix),Xo.set(["#8cc25a","#99ca62","#7fb852","#a6d16c"][(Z+Math.floor(k.r*4))%4]),X.setColorAt(Y++,Xo)}for(let k of[E,P,U,X])k&&(k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),k.computeBoundingSphere());Wa.push({trunk:E,crown:P,cone:U,bam:X,n:m.length,leafPre:_,pinePre:b,nb:l.bamboo.length})}function Ex(l){for(let m of Wa){let _=Math.round(l*m.n);m.trunk&&(m.trunk.count=_),m.crown&&(m.crown.count=m.leafPre[_]),m.cone&&(m.cone.count=2*m.pinePre[_]),m.bam&&(m.bam.count=Math.round(l*m.nb)*fu)}}let rp=null;function op(){let l=Fr[di],m=rp??(l.forest>0&&!Mr);le.visible=m,Gt("#layer-trees").checked=m,m&&Ex(l.forest||1)}function wx(l){let m=ke(l);for(let _ of Wa)_.trunk&&(_.trunk.geometry=m.trunk),_.crown&&(_.crown.geometry=m.leaf),_.cone&&(_.cone.geometry=m.pine),_.bam&&(_.bam.geometry=m.bamboo);Jt&&(Jt.geometry=m.lantern)}function ap(){let l=Fr[di];A.setCeiling(x(),!0),N(!1),it=!0,Wt.traverse(_=>{_.isMesh&&_.material&&!Array.isArray(_.material)&&(_.material=Se(_.material,l.pbr))}),document.documentElement.classList.toggle("lite",!l.blur),wx(l.hiShapes),op();for(let _ of Wa)_.bam&&(_.bam.visible=l.bamboo&&!Mr);lp=Mr?12:l.labelCap;let m=T();p.shadowMap.enabled!==m&&(p.shadowMap.enabled=Re.castShadow=m,Wt.traverse(_=>{if(_.material)for(let b of[].concat(_.material))b.needsUpdate=!0}))}let pu=[];for(let l of t.cables){let m=l.pts[0],_=l.pts.at(-1),b=Math.hypot(_[0]-m[0],_[1]-m[1]),E=[];for(let H=0;H<=90;H++){let D=H/90,j=m[0]+(_[0]-m[0])*D,Y=m[1]+(_[1]-m[1])*D,k=Math.max(v(j,Y)+13,v(...m)*(1-D)+v(..._)*D+23-Math.sin(D*Math.PI)*b*.017);E.push(new W(j,k,Y))}let P=new Lo(E),U=-(_[1]-m[1])/b*2,X=(_[0]-m[0])/b*2;for(let H of[-1,1])nn(Rt,E.map(D=>[D.x+U*H,D.y,D.z+X*H]),"#3e514c");for(let H of[.2,.43,.67,.84]){let D=P.getPoint(H),j=v(D.x,D.z);we(Rt,D.x,j,D.z,.6,D.y-j,be),qt(Rt,D.x,D.y-1,D.z,10,.65,1.2,be)}for(let H=0;H<6;H++){let D=new Pn;qt(D,0,0,0,3.6,2.6,2.4,_t),qt(D,0,1,0,3.7,1,2.45,de),qt(D,0,2.8,0,.2,3,.2,F),Rt.add(D),pu.push({g:D,curve:P,phase:H/6,kind:"cable"})}}for(let l of t.funicular){let m=[];for(let P=1;P<l.pts.length;P++){let U=l.pts[P-1],X=l.pts[P],H=Math.ceil(Math.hypot(X[0]-U[0],X[1]-U[1])/3);for(let D=0;D<H;D++){let j=D/H,Y=U[0]+(X[0]-U[0])*j,k=U[1]+(X[1]-U[1])*j;m.push(new W(Y,v(Y,k)+.8,k))}}let _=l.pts.at(-1);m.push(new W(_[0],v(..._)+.8,_[1]));let b=new Lo(m);for(let P of[-1,1])nn(Rt,m.map(U=>[U.x,U.y,U.z+P*.8]),"#dad8c3");let E=new Pn;qt(E,0,0,0,7,2.5,2.4,ct("#eee8d8")),qt(E,0,.8,0,6.8,1.2,2.45,de),qt(E,0,2.3,0,7,.45,2.6,_t),Rt.add(E),pu.push({g:E,curve:b,phase:.4,kind:"funicular"})}{let l=[[/厕|洗手亭/,"wc"],[/停车场/,"park"],[/索道|缆车/,"cable"],[/加油站/,"fuel"],[/充电站/,"charge"],[/车站|客运站/,"bus"],[/售票|检票/,"ticket"],[/游客服务/,"info"],[/卫生院|医院/,"hospital"],[/药房|药堂/,"pharmacy"],[/派出所|公安|警/,"police"],[/小学|幼儿园|学校/,"school"],[/邮政|邮局/,"post"],[/银行/,"bank"]],m={wc:["#2f7fd0","WC"],park:["#2a62c9","P"],cable:["#7a52c2","\u7F06"],fuel:["#d9432f","\u6CB9"],charge:["#13a07a","\u7535"],bus:["#1d9a5b","bus"],ticket:["#e08a1e","\u7968"],info:["#2b8fd6","i"],hospital:["#ffffff","+r"],pharmacy:["#ffffff","+g"],police:["#1f4fa3","\u8B66"],school:["#e5a72e","\u5B66"],post:["#1a8a4a","\u90AE"],bank:["#c0392b","\xA5"]},_=Object.keys(m),b=document.createElement("canvas");b.width=b.height=512;let E=b.getContext("2d");_.forEach((J,at)=>{let[pt,Dt]=m[J],yt=at%4*128,Ht=Math.floor(at/4)*128;E.fillStyle=pt,E.fillRect(yt,Ht,128,128),E.strokeStyle="rgba(0,0,0,.18)",E.lineWidth=6,E.strokeRect(yt+3,Ht+3,122,122),E.fillStyle="#fff",E.textAlign="center",E.textBaseline="middle",Dt==="+r"||Dt==="+g"?(E.fillStyle=Dt==="+r"?"#d8312a":"#1f9a52",E.fillRect(yt+50,Ht+22,28,84),E.fillRect(yt+22,Ht+50,84,28)):Dt==="bus"?(E.beginPath(),E.roundRect(yt+22,Ht+26,84,66,10),E.fill(),E.fillStyle=pt,E.fillRect(yt+30,Ht+36,68,24),E.fillStyle="#fff",E.beginPath(),E.arc(yt+42,Ht+98,10,0,7),E.arc(yt+86,Ht+98,10,0,7),E.fill()):(E.font=`bold ${Dt.length>1&&/^[A-Z]/.test(Dt)?64:Dt==="i"?92:76}px "PingFang SC","Noto Sans SC",sans-serif`,E.fillText(Dt,yt+64,Ht+68))});let P=new as(b);P.colorSpace=kn,P.anisotropy=8;let U=new G,X=new G,H=new G,D=(J,at,pt)=>{let Dt=!1;for(let yt=0,Ht=pt.length-1;yt<pt.length;Ht=yt++){let kt=pt[yt],St=pt[Ht];kt[1]>at!=St[1]>at&&J<(St[0]-kt[0])*(at-kt[1])/(St[1]-kt[1])+kt[0]&&(Dt=!Dt)}return Dt},j=(J,at)=>{let pt=null,Dt=40;for(let yt of t.roads)if(!["footway","path","steps"].includes(yt.kind))for(let Ht=1;Ht<yt.pts.length;Ht++){let kt=yt.pts[Ht-1],St=yt.pts[Ht],O=St[0]-kt[0],ot=St[1]-kt[1],gt=O*O+ot*ot||1,rt=ii(((J-kt[0])*O+(at-kt[1])*ot)/gt,0,1),ut=kt[0]+O*rt,ft=kt[1]+ot*rt,st=Math.hypot(J-ut,at-ft);st<Dt&&(Dt=st,pt={x:ut,z:ft,ux:O/Math.sqrt(gt),uz:ot/Math.sqrt(gt)})}return pt},Y=(J,at,pt,Dt,yt,Ht,kt,St)=>{let O=[[at,Dt,Ht],[pt,Dt,Ht],[pt,Dt,kt],[at,Dt,kt],[at,yt,Ht],[pt,yt,Ht],[pt,yt,kt],[at,yt,kt]];for(let ot of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])J.quad(O[ot[0]],O[ot[1]],O[ot[2]],O[ot[3]],St)},k=(J,at,pt,Dt,yt,Ht,kt,St,O,ot)=>{let gt=-yt,rt=Dt,ut=(st,Tt,Ce)=>[at+Dt*st+gt*Tt,Ce,pt+yt*st+rt*Tt],ft=[ut(-Ht,-kt,St),ut(Ht,-kt,St),ut(Ht,kt,St),ut(-Ht,kt,St),ut(-Ht,-kt,O),ut(Ht,-kt,O),ut(Ht,kt,O),ut(-Ht,kt,O)];for(let st of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])J.quad(ft[st[0]],ft[st[1]],ft[st[2]],ft[st[3]],ot)};for(let J of t.places){if(J.category!=="service"&&J.category!=="transport")continue;let at=l.find(([he])=>he.test(J.n))?.[1];if(!at||/公司|营业厅/.test(J.n)||ir[J.n])continue;let pt=_.indexOf(at),Dt=pt%4/4,yt=1-Math.floor(pt/4)/4,Ht=[[Dt+.004,yt-.246],[Dt+.246,yt-.246],[Dt+.246,yt-.004],[Dt+.004,yt-.004]],kt=t.buildings.find(he=>Math.abs(he.rectCenter[0]-J.x)<40&&Math.abs(he.rectCenter[1]-J.z)<40&&D(J.x,J.z,he.ring)),St=mi(J.x,J.z),O=kt?Xn.has(kt.osmId)?kt.base+4.2:kt.base+kt.wallHeight+(kt.roofRise||0):St,ot=5.5,gt=O+(kt?1.5:7),rt=ot/2;Y(X,J.x-.18,J.x+.18,kt?O-.5:St,gt,J.z-.18,J.z+.18,"#5b6066");let ut=J.x-rt,ft=J.x+rt,st=J.z-rt,Tt=J.z+rt,Ce=gt,It=gt+ot;U.quad([ut,Ce,Tt],[ft,Ce,Tt],[ft,It,Tt],[ut,It,Tt],"#ffffff",Ht),U.quad([ft,Ce,st],[ut,Ce,st],[ut,It,st],[ft,It,st],"#ffffff",Ht),U.quad([ft,Ce,Tt],[ft,Ce,st],[ft,It,st],[ft,It,Tt],"#ffffff",Ht),U.quad([ut,Ce,st],[ut,Ce,Tt],[ut,It,Tt],[ut,It,st],"#ffffff",Ht);let ae=[[Dt+.12,yt-.12],[Dt+.13,yt-.12],[Dt+.13,yt-.13],[Dt+.12,yt-.13]];if(U.quad([ut,It,Tt],[ft,It,Tt],[ft,It,st],[ut,It,st],"#ffffff",ae),at==="bus"&&J.n!=="\u4E09\u89D2\u6D32\u8F66\u7AD9"){let he=j(J.x,J.z);if(he){let se=he.x,ne=he.z,me=mi(se,ne)+.45;k(H,se,ne,he.ux,he.uz,4.6,1.25,me,me+2.9,"#2fae6a"),k(H,se,ne,he.ux,he.uz,4.62,1.27,me+1.55,me+2.45,"#2b3a40"),k(H,se,ne,he.ux,he.uz,4.5,1.2,me+2.9,me+3.1,"#f4f1e8");for(let q of[-2.9,2.9])for(let Et of[-1,1]){let wt=se+he.ux*q-he.uz*1.2*Et,Nt=ne+he.uz*q+he.ux*1.2*Et;k(H,wt,Nt,he.ux,he.uz,.5,.18,me-.45,me+.5,"#2a2a2a")}}}if(at==="fuel"){let he=St+5.2;Y(H,J.x-6,J.x+6,he,he+.8,J.z-4.5,J.z+4.5,"#f4f1e8"),Y(H,J.x-6.05,J.x+6.05,he+.15,he+.55,J.z-4.55,J.z+4.55,"#d9432f");for(let[se,ne]of[[-5,-3.5],[5,-3.5],[-5,3.5],[5,3.5]])Y(H,J.x+se-.2,J.x+se+.2,St,he,J.z+ne-.2,J.z+ne+.2,"#e8e4da");for(let se of[-2.2,2.2])Y(H,J.x+se-.5,J.x+se+.5,St,St+1.9,J.z-.35,J.z+.35,"#d9432f")}}let Z=new Pn;Rt.add(Z),Si.push(U.mesh(new os({map:P,toneMapped:!1}),Z),X.mesh(ct("#ffffff",{vertexColors:!0}),Z)),H.p.length&&H.mesh(ct("#ffffff",{vertexColors:!0,side:mn}),Z)}for(let[l,m]of Je){let _=new Ln;_.setAttribute("position",new en(m.p,3)),_.setAttribute("color",new en(m.c,3)),l.add(new Rl(_,new Ia({vertexColors:!0})))}if(y){let l=jg(y,ct);Yt.add(l),an.push(l),br.set(d.n,y.floor+7.5)}{let l=new Map,m=E=>[E.type,E.color?.getHexString(),E.emissive?.getHexString(),E.emissiveIntensity,E.roughness,E.metalness,E.opacity,E.transparent,E.side,E.map?.uuid,E.emissiveMap?.uuid,E.vertexColors,E.flatShading,E.depthWrite,E.depthTest,E.alphaTest,E.polygonOffset,E.polygonOffsetFactor,E.polygonOffsetUnits,E.fog,E.toneMapped].join("/"),_=E=>{let P=m(E);return l.has(P)||l.set(P,E),l.get(P)},b=E=>{for(let U of[...E.children])!U.isMesh&&U.children.length&&b(U);let P=new Map;for(let U of E.children){if(!U.isMesh||U.isInstancedMesh||U.isSkinnedMesh||Array.isArray(U.material)||U.children.length||!U.visible||Object.keys(U.geometry.morphAttributes).length)continue;U.material=_(U.material);let X=U.geometry,H=m(U.material)+"|"+Object.keys(X.attributes).sort().join()+"|"+!!X.index+"|"+U.castShadow+U.receiveShadow+"|"+U.renderOrder;P.has(H)||P.set(H,[]),P.get(H).push(U)}for(let U of P.values()){if(U.length<2)continue;let X=lo(U.map(D=>(D.matrixAutoUpdate&&D.updateMatrix(),D.geometry.clone().applyMatrix4(D.matrix))));if(!X)continue;let H=new Ke(X,U[0].material);H.castShadow=U[0].castShadow,H.receiveShadow=U[0].receiveShadow,H.renderOrder=U[0].renderOrder;for(let D of U)E.remove(D);E.add(H)}};for(let E of Yt.children)E.isGroup&&b(E)}for(let l of an)Vn.push(l);let mu=[];if(p.capabilities.isWebGL2||p.extensions.has("OES_element_index_uint")){let l=[Bn,...Yt.children.filter(m=>m.isMesh&&!m.isInstancedMesh&&!m.material.transparent&&!m.children.length&&m.geometry.attributes.position.count>3e3)];for(let m of l){let _=Kg(m);_&&mu.push(_)}}At.traverse(l=>{l.isMesh&&(l.updateMatrix(),l.matrixAutoUpdate=!1)});let cr=t.places.map(l=>({...l})),Tx=new Map(cr.map(l=>[l.n,l])),Ax=new Map(cr.map(l=>[l.placeId,l])),gu=l=>["hotel","food","shop"].includes(l.category),xu=l=>l.quality?.startsWith("legacy")||["overture","unverified_listing","derived_area","owner_reported"].includes(l.quality),ji=null,$l="all",qo="",Rx=0,Zl=0,lp=null,Cx={temple:"\u5BFA",hotel:"\u5BBF",food:"\u98DF",shop:"\u8D2D",transport:"\u884C",nature:"\u5C71",sight:"\u666F",village:"\u6751",service:"\u516C"},Px={temple:["temple"],sight:["sight","nature","village"],service:["service","transport"]},cp=am(cr),Sr=cr.find(l=>l.featured),Lx=l=>l.quality==="owner_reported"?um:l.featured?"\u4E1A\u4E3B\u63D0\u4F9B\u5B9E\u62CD \xB7 \u4F4D\u7F6E\u6309\u95E8\u724C\u4F30\u8BA1":l.qualityLabel||{converted_listing:"\u643A\u7A0B\u516C\u5F00\u5750\u6807 \xB7 \u5DF2\u6362\u7B97",mapped:"OpenStreetMap \u5730\u56FE\u8BB0\u5F55",multi_source:"\u591A\u4E2A\u5E73\u53F0\u5750\u6807\u76F8\u4E92\u5370\u8BC1",platform_listing:"\u516C\u5F00\u5E73\u53F0\u5750\u6807 \xB7 \u5355\u4E00\u6765\u6E90",unverified_listing:"\u5355\u4E00\u5E73\u53F0\u6536\u5F55 \xB7 \u4F4D\u7F6E\u4E0E\u8425\u4E1A\u72B6\u6001\u5F85\u6838",derived_area:"\u7531\u95E8\u724C\u5730\u5740\u8303\u56F4\u63A8\u7B97",overture:"\u516C\u5F00\u5730\u56FE\u8BB0\u5F55 \xB7 \u5F85\u590D\u6838",legacy_osm:"\u65E7\u7248\u5730\u56FE\u70B9 \xB7 \u5F85\u590D\u6838",user_confirmed:"\u7528\u6237\u5B9E\u5730\u786E\u8BA4"}[l.quality]||"\u65E7\u7248\u4F30\u8BA1\u4F4D\u7F6E \xB7 \u5F85\u6838",Jl=new Map;for(let l of t.buildings){let m=Math.floor(l.center[0]/60)+","+Math.floor(l.center[1]/60);Jl.has(m)||Jl.set(m,[]),Jl.get(m).push(l)}function Ix(l,m=20){let _=null,b=m,E=Math.floor(l.x/60),P=Math.floor(l.z/60);for(let U=-1;U<=1;U++)for(let X=-1;X<=1;X++)for(let H of Jl.get(E+U+","+(P+X))||[]){let D=Math.hypot(l.x-H.center[0],l.z-H.center[1]);D<b&&(_=H,b=D)}return _}let Dx=new Map(t.buildings.map(l=>[l.id,l])),Ux='<svg viewBox="0 0 24 24"><path d="M4 11.2 12 4.5l8 6.7V19a1 1 0 0 1-1 1h-4.6v-5.2H9.6V20H5a1 1 0 0 1-1-1z"/></svg>',Nx={featured:[14.85,9.5,48,39],area:[16.5,11.5,4,15],major:[14.04,8.8,34,34],small:[10.71,6.6,24,27],road:[10.2,6.2,18,20],plain:[12.24,7.5,29,31]};function Ox(l,m){let[_,b,E,P]=Nx[["featured","area","major","small","road"].find(X=>l.includes(X))||"plain"],U=E;for(let X of m)U+=X.codePointAt(0)>=11904?_:b;return[Math.ceil(U),P]}function yu(l,m,_,b){let E=Te("div","maplabel pin "+m);l.placeId&&(E.dataset.placeId=l.placeId),l.stem=m.includes("featured")?9:m.includes("area")||m.includes("road")?0:7;let P=Te("button","");if(P.type="button",P.tabIndex=-1,l.featured){let X=Te("span","lb-icon");X.innerHTML=Ux,P.append(X)}P.append(_),b&&(P.onclick=b),E.append(P,Te("i"));let U=new Bo(E);return U.center.set(.5,1),l.label=U,l.el=E,[l.labelWidth,l.labelHeight]=Ox(m,_),U}for(let l of cr){if(!Number.isFinite(l.x)||!Number.isFinite(l.z)||!(l.searchable||l.featured))continue;let m=(l.featured?"featured ":"")+"c-"+l.category+(l.p===1&&!l.featured?" major":"")+(xu(l)?" estimated":"")+(l.category==="village"?" area":""),_=yu(l,m,l.displayName||l.shortName||l.n,()=>Ja(l,!0));l.tier=l.featured||l.p===1?2:l.category==="temple"&&l.story?1:0;let b=l.n==="\u767E\u5C81\u5BAB"?t.buildings.find(P=>P.osmId===541482372):ir[l.n]?t.buildings.find(P=>P.osmId===ir[l.n]):null,E=b||l.buildingId&&Dx.get(l.buildingId)||Ix(l,gu(l)?12:35);l.top=br.get(l.n)??(Xn.has(b?.osmId)?b.base+4.4:l.category==="village"?v(l.x,l.z)+40:E?E.base+E.wallHeight+E.roofRise:v(l.x,l.z)+(l.category==="temple"?22:gu(l)?9:11)),_.position.set(b?b.center[0]:l.x,l.top+5,b?b.center[1]:l.z),l.nearest=E,l.limit=l.featured||l.p===1?1/0:l.category==="village"?2600:gu(l)?l.quality==="unverified_listing"?650:1250:l.category==="temple"||l.p<=2?3600:1900}let jl=[];for(let l of cr)for(let m of l.halls||[]){let _={n:m.n,x:m.x,z:m.z,p:5,parent:l,limit:300,hall:!0};yu(_,"small hall",m.n,()=>Ja(l,!1)),_.top=v(m.x,m.z)+9,_.label.position.set(m.x,_.top+4,m.z),jl.push(_)}{let l=new Map;for(let m of t.roads){if(!m.name||m.pts.length<2)continue;let _=0;for(let b=1;b<m.pts.length;b++)_+=Math.hypot(m.pts[b][0]-m.pts[b-1][0],m.pts[b][1]-m.pts[b-1][1]);(!l.has(m.name)||l.get(m.name).len<_)&&l.set(m.name,{r:m,len:_})}for(let[m,{r:_}]of l){let b=_.pts[Math.floor(_.pts.length/2)],E={n:m,x:b[0],z:b[1],p:4,limit:2200,road:!0};yu(E,"road",m.replace(/\s*\(.*\)$/,""),null),E.top=v(b[0],b[1]),E.label.position.set(b[0],E.top+3,b[1]),jl.push(E)}}let Fx=cr.concat(jl).filter(l=>l.label);function hr(l,m,_=900,b=145,E=57){let P=new W(l,v(l,m)*At.scale.y,m),U=b*Math.PI/180,X=E*Math.PI/180;return{target:P,pos:P.clone().add(new W(-Math.sin(U)*_*Math.sin(X),_*Math.cos(X),Math.cos(U)*_*Math.sin(X)))}}let ri=null,Yo=!1,hp=[],Ei=Eg(Ft,ye,{reducedMotion:zl}),up=wg(Ft,ye,{width:e,depth:n,cellSize:Math.min(e,n)/(s-1),heightAt:(l,m)=>v(l,m)*At.scale.y,isCut:ls,automatic:()=>Ei.active||!!ri?.previewing}),$o=Te("div","my-location");$o.append(Te("span","","\u6211\u7684\u4F4D\u7F6E"),Te("i"));let zr=new Bo($o);zr.center.set(.5,1),zr.renderOrder=10,zr.visible=!1,Wt.add(zr);let Zo=Gt("#locate"),Bx=Gt("#location-status"),_u=null,Kl=!1,ur=null,fp="",vu=new Set,Mu={off:"\u5B9A\u4F4D\u5DF2\u5173\u95ED",waiting:"\u6B63\u5728\u83B7\u53D6\u4F4D\u7F6E\uFF0C\u70B9\u51FB\u5B9A\u4F4D\u6309\u94AE\u53EF\u5173\u95ED",inside:"\u5B9A\u4F4D\u5DF2\u5F00\u542F",outside:"\u60A8\u5DF2\u8D85\u51FA\u5730\u56FE\u8986\u76D6\u8303\u56F4\uFF0C\u8FD4\u56DE\u8303\u56F4\u540E\u4F1A\u81EA\u52A8\u663E\u793A",inaccurate:"\u5B9A\u4F4D\u7CBE\u5EA6\u4E0D\u8DB3\uFF0C\u8BF7\u79FB\u81F3\u5F00\u9614\u5904",approximate:"\u4F4D\u7F6E\u7CBE\u5EA6\u8F83\u4F4E\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u201C\u7CBE\u786E\u4F4D\u7F6E\u201D\u8BBE\u7F6E\u6216\u79FB\u81F3\u5F00\u9614\u5904",stale:"\u6682\u672A\u6536\u5230\u65B0\u4F4D\u7F6E\uFF0C\u6B63\u5728\u7B49\u5F85\u66F4\u65B0",timeout:"\u5B9A\u4F4D\u6682\u65F6\u8D85\u65F6\uFF0C\u6B63\u5728\u5C1D\u8BD5\u66F4\u65B0\uFF1B\u53EF\u68C0\u67E5\u7CFB\u7EDF\u5B9A\u4F4D\u670D\u52A1",unavailable:"\u6682\u65F6\u65E0\u6CD5\u5B9A\u4F4D\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u5B9A\u4F4D\u670D\u52A1\uFF1B\u5FAE\u4FE1\u4E2D\u53EF\u5C1D\u8BD5\u5728\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6253\u5F00",denied:"\u672A\u83B7\u5F97\u5B9A\u4F4D\u6743\u9650\uFF0C\u8BF7\u5728\u7CFB\u7EDF\u548C\u6D4F\u89C8\u5668\u8BBE\u7F6E\u4E2D\u5141\u8BB8\u5B9A\u4F4D\u540E\u91CD\u8BD5",insecure:"\u5B9A\u4F4D\u9700\u8981 HTTPS\uFF0C\u8BF7\u6253\u5F00\u7EBF\u4E0A\u5B89\u5168\u7F51\u5740",unsupported:"\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5B9A\u4F4D\uFF0C\u8BF7\u5C1D\u8BD5\u7CFB\u7EDF\u6D4F\u89C8\u5668",paused:"\u5B9A\u4F4D\u5DF2\u6682\u505C\uFF0C\u8FD4\u56DE\u9875\u9762\u540E\u7EE7\u7EED"},bu=ax({geo:t.geo,terrain:i,onChange:({state:l,point:m,enabled:_,changed:b,fresh:E})=>{_u=m,zr.visible=!!m,Kl=!0,$o.classList.toggle("is-stale",!!m&&!E),$o.firstChild.textContent=E?"\u6211\u7684\u4F4D\u7F6E":"\u4E0A\u6B21\u4F4D\u7F6E",Zo.setAttribute("aria-pressed",String(_)),Zo.setAttribute("aria-label",_?"\u5173\u95ED\u6211\u7684\u4F4D\u7F6E":"\u663E\u793A\u6211\u7684\u4F4D\u7F6E"),Zo.setAttribute("aria-busy",String(l==="waiting")),Zo.dataset.state=l;let P=[l,_,!!m,E].join(":");if(P!==fp){let U=m?Math.ceil(m.accuracy/10)*10:0;Bx.textContent=m?E?`\u6211\u7684\u4F4D\u7F6E \xB7 \u7CBE\u5EA6\u7EA6 ${U} \u7C73\uFF08\u4EC5\u4F9B\u53C2\u8003\uFF09`:`${Mu[l]}\uFF1B\u663E\u793A\u4E0A\u6B21\u4F4D\u7F6E\uFF0C\u975E\u5B9E\u65F6\u5B9A\u4F4D`:Mu[l],fp=P}if((!_||["paused","outside","stale"].includes(l))&&(ur=null),b&&!["inside","paused","waiting","off"].includes(l)&&!vu.has(l)&&(vu.add(l),Fl(Mu[l])),m&&E&&ur!==null){let U=performance.now()-ur<2e4&&!ri?.previewing&&!Ei.active;ur=null,U&&Vs(hr(m.x,m.z,650),1e3)}}});Zo.onclick=()=>{bu.enabled?bu.stop():(vu.clear(),ur=performance.now(),bu.start())},ye.addEventListener("gesturestart",()=>{ur=null});function zx(){if(_u){let{x:l,z:m}=_u;zr.position.set(l,v(l,m)*At.scale.y+8,m),zr.updateMatrixWorld(!0)}}function Vs(l,m=1200,_=null,b=0){ur=null,ri?.stopPreview(),Ei.move(l,m,_,b),Yo&&Ki()}let dp=l=>ii(900+Ft.position.distanceTo(l.pos)*.35,1100,2400),Rs=null;function pp(){let l=Ei.destination;Rs??={pos:(l?l.pos:Ft.position).clone(),target:(l?l.target:ye.target).clone(),view:Gt(".viewbar button.active")?.dataset.view}}function kx(){let l=Rs;Rs=null,l&&(Vs(l,Math.round(dp(l)*1.2)),Zi("[data-view]").forEach(m=>m.classList.toggle("active",m.dataset.view===l.view)),Ql())}let Su=()=>{let l=ye.target.clone().sub(Ft.position);return Math.atan2(l.x,-l.z)*180/Math.PI};function Eu(l=Hn?220:160){return hr(Sr.x,Sr.z,l,15,57)}function mp(l){return l.model?.kind==="entrance-checkpoint"&&y?hr(l.x,l.z,Hn?150:110,y.viewAzimuth,59):hr(l.x,l.z,l.category==="temple"?400:300,Su(),57)}function gp(l,m,_,b){let E=l.getBoundingClientRect(),P=m.getBoundingClientRect(),U=E.width/l.offsetWidth||1;l.style.setProperty(_,((P.left-E.left)/U-l.clientLeft).toFixed(2)+"px"),l.style.setProperty(b,(P.width/U).toFixed(2)+"px")}function Ql(){let l=Gt(".viewbar"),m=l.querySelector("button.active");if(!m){l.style.setProperty("--ind-o",0);return}gp(l,m,"--ind-x","--ind-w"),l.style.setProperty("--ind-o",1)}function wu(){Zi("[data-view]").forEach(l=>l.classList.remove("active")),Ql()}let Tu=()=>hr(-1390,50,Hn?1550:1370,38,53);function tc(l){let m=Ei.destination?.orbit?Ei.destination:null;return ye.dispatchEvent({type:"gesturestart"}),up.pose({...l,base:m})}function Au(l){Rs=null,Vs({town:Tu,all:()=>hr(-150,200,7800,110,51),top:()=>tc({heading:0,polar:Math.PI/180}),baisui:()=>{let _=t.buildings.find(b=>b.osmId===541482372);return hr(..._.center,260,60,63)},juzhilin:()=>Eu(),tiantai:()=>hr(773,1635,520,130,64)}[l]()),Zi("[data-view]").forEach(_=>_.classList.toggle("active",_.dataset.view===l)),Ql()}Zi("[data-view]").forEach(l=>l.onclick=()=>Au(l.dataset.view)),ye.addEventListener("gesturestart",()=>{let l=!!Ei.destination?.onDone;Ei.cancel(),wu(),l&&!Gt("#card").classList.contains("show")&&(Xa++,ec(),Rs=null),Ki()}),ye.addEventListener("gesturestart",()=>up.constrain()),Vs(Tu(),0),Gt("#north").onclick=()=>Vs(tc({heading:0}),650),Gt("#zoom-in").onclick=()=>Vs(tc({scale:.65}),450),Gt("#zoom-out").onclick=()=>Vs(tc({scale:1/.65}),450);function Ru(l){let m=Te("div","links");for(let _ of l.sources||[]){if(!/^https:\/\//.test(_.url))continue;let b=Te("a","",_.name);b.href=_.url,b.target="_blank",b.rel="noopener",m.append(b)}return m}function ec(){ji?.el&&ji.el.classList.remove("selected"),ji=null;for(let l of Zi(".place-item.selected"))l.classList.remove("selected")}let Xa=0,Cu=l=>!!l?.isConnected&&!l.disabled&&!l.closest("[inert]")&&l.getClientRects().length>0&&getComputedStyle(l).visibility!=="hidden",Jo=()=>{let l=document.activeElement;return!l||l===document.body||!Cu(l)};function nc(l){if(!l)return;let m=()=>{Cu(l)&&document.activeElement!==l&&l.focus({preventScroll:!0})};m(),document.activeElement!==l&&requestAnimationFrame(m)}function qa(...l){for(let m of l)if(Cu(m))return m.focus({preventScroll:!0}),!0;return!1}let Ya=null,ic=null,Pu=null;function xp(){let l=Gt("#card"),m=document.activeElement;l.classList.contains("show")||l.contains(m)||(Ya=m&&m!==document.body?m:null,ic=m?.matches?.(".place-item")?m.dataset.name:null)}function jo(l=!0){let m=Gt("#card"),_=m.classList.contains("show"),b=m.contains(document.activeElement);if(Xa++,Ei.cancel(),ec(),Ho(m),Ki(),l?kx():Rs=null,_&&(b||Jo())){let E=ic&&[...Zi("#place-list .place-item")].find(P=>P.dataset.name===ic);qa(Ya,E,!Hn&&!Gt("#panel").classList.contains("closed")?Gt('.panel-tabs [aria-selected="true"]'):null,Gt("#panel-open"))}Ya=ic=null}function $a(l){let m=Gt("#settings"),_=!l&&m.querySelector(".settings-wrap").contains(document.activeElement);m.classList.toggle("collapsed",!l),Gt("#settings-toggle").setAttribute("aria-expanded",l),Yo&&Ki(),_&&nc(Gt("#settings-toggle"))}function Lu(){let l=Gt("#data-dialog");l.open&&(l.classList.add("closing"),setTimeout(()=>{l.classList.remove("closing"),l.close(),Ki()},190))}function Za(l){Hn&&(l!=="directory"&&(Gt("#panel").classList.add("closed"),Gt("#search").blur(),Ki()),l!=="detail"&&jo(!1),l!=="settings"&&$a(!1),l!=="data"&&Lu())}let Hx='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';function yp(l,m,{cat:_="",sub:b="",hero:E=null,featured:P=!1}={}){Za("detail");let U=Gt("#card"),X=U.classList.contains("show");U.replaceChildren(),U.classList.toggle("featured",P);let H=Te("div","card-head"),D=Te("div","card-content"+(X?" swap":"")),j=Te("button","close icon-btn");j.innerHTML=Hx,j.setAttribute("aria-label","\u5173\u95ED\u5730\u70B9\u8BE6\u60C5"),j.onclick=()=>jo();let Y=Te("h2","",l);Y.tabIndex=-1,H.append(Te("span","tag"+(_?" c-"+_:""),m),Y),b&&H.append(Te("p","sub",b)),D.tabIndex=0,D.setAttribute("role","region"),D.setAttribute("aria-label","\u5730\u70B9\u8BE6\u7EC6\u5185\u5BB9");let k=document.activeElement,Z=k===Ya||U.contains(k),J=Te("div","sheet-grip");return J.setAttribute("aria-hidden","true"),E&&U.append(E),U.append(j,H,D,J),X||za(U),Ki(),requestAnimationFrame(Ki),(Z||Jo())&&nc(Y),D}let{open:_p,close:Vx}=ex({reducedMotion:zl,onToggle:()=>Ki(),focusLost:Jo,restoreFocus:qa,fallbackFocus:()=>Gt("#card .card-head h2")}),vp={temple:"\u5BFA\u9662",sight:"\u666F\u70B9",nature:"\u5C71\u6C34\u666F\u89C2",village:"\u6751\u843D\u5730\u540D",service:"\u516C\u5171\u670D\u52A1",transport:"\u4EA4\u901A",hotel:"\u4F4F\u5BBF",food:"\u9910\u996E",shop:"\u8D2D\u7269"},Gx="17356648281",Mp="173 5664 8281";function bp(l){let m=Te("details","more");return m.append(Te("summary","",l)),m}function Wx(l,m,_){let b=Te("button","btn "+l);return b.type="button",b.innerHTML=m,b.append(_),b}let Xx='<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/></svg>',qx='<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></svg>',Yx='<svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></svg>';function Sp(l){let m=t.routes?.find(H=>H.id==="juzhilin-halfday"),_=ri?.canResume?ri.active:null,b=l.querySelector(".route-teaser"),E=_?"resume:"+_.id:m?"start":"";if((b?.dataset.kind||"")===E)return;if(!E){b?.remove();return}let P=Te("button","route-teaser"),U=Te("span","");P.type="button",P.dataset.kind=E,P.innerHTML=Xx,_?(U.append(Te("b","","\u7EE7\u7EED\u8DEF\u7EBF\u9884\u6F14"),Te("small","",_.short+" \xB7 \u4ECE\u521A\u624D\u6682\u505C\u7684\u4F4D\u7F6E\u7EE7\u7EED")),P.onclick=()=>ri.canResume&&ri.active===_?ri.startPreview():ri.open(_.id)):(U.append(Te("b","","\u4ECE\u8FD9\u91CC\u51FA\u53D1 \xB7 "+m.short),Te("small","",`${m.duration} \xB7 \u8089\u8EAB\u5B9D\u6BBF \u2192 \u5316\u57CE\u5BFA \u2192 \u7F06\u8F66\u4E0A\u767E\u5C81\u5BAB \xB7 \u770B\u8DEF\u7EBF`)),P.onclick=()=>ri?.open(m.id)),P.append(U);let X=l.querySelector(".card-summary");if(b){let H=document.activeElement===b;b.replaceWith(P),H&&P.focus({preventScroll:!0})}else X?X.after(P):l.append(P)}function $x(){let l=Gt("#card");l.classList.contains("show")&&l.classList.contains("featured")&&Sp(l.querySelector(".card-content"))}function Ja(l,m){xp(),ec(),ji=l,l.el&&l.el.classList.add("selected");let _=++Xa,b=()=>{let U=null;if(l.featured){U=Te("div","card-hero");let k=[["jzl-1",640],["jzl-2",541],["jzl-5",720],["jzl-6",540],["jzl-3",540],["jzl-4",640]],Z=k.map(([J])=>{let at=`media/juzhilin/${J}.jpg`;return window.__JIUHUA_MEDIA__?.[at]||at});for(let[J,at]of Z.entries()){let pt=Te("a");pt.href=at,pt.target="_blank",pt.rel="noopener",pt.onclick=yt=>{yt.preventDefault(),_p(Z,J,void 0,void 0,pt)};let Dt=Te("img");Dt.width=960,Dt.height=k[J][1],Dt.src=at,Dt.alt="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",Dt.loading="lazy",pt.append(Dt),U.append(pt)}}let X=[...l.photos||[],...l.viewing?.photos||[]];if(X.length){U=Te("div","card-hero");let k=X,Z=k.map(J=>window.__JIUHUA_MEDIA__?.[J.src]||J.src);for(let[J,at]of k.entries()){let pt=Te("a");pt.href=Z[J],pt.setAttribute("aria-label",at.alt+"\uFF0C\u70B9\u5F00\u653E\u5927"),pt.onclick=kt=>{kt.preventDefault(),_p(Z,J,l.n,k,pt)};let Dt=Te("img"),yt=window.__JIUHUA_MEDIA__,Ht=at.thumb&&(yt?yt[at.thumb]:at.thumb);Dt.src=Ht||Z[J],Dt.width=at.width,Dt.height=at.height,Dt.alt=at.alt,Dt.loading="lazy",pt.append(Dt),at.takenAt&&pt.append(Te("span","photo-date",at.takenAt.slice(0,4)+"\u5E74\u5B9E\u62CD \xB7 \u70B9\u5F00\u653E\u5927")),U.append(pt)}}let H=yp(l.displayName||(l.featured?l.shortName:l.n),l.featured?"\u7CBE\u9009\u6C11\u5BBF \xB7 \u5B9E\u62CD\u5EFA\u6A21":vp[l.category]||"\u5730\u70B9",{cat:l.category,hero:U,featured:!!l.featured}),D=Te("div","chips");(l.address||l.zone)&&D.append(Te("span","",l.address||l.zone)),l.featured&&D.append(Te("span","","\u4E1A\u4E3B\u5B9E\u62CD \xB7 \u4E09\u7EF4\u5EFA\u6A21")),D.append(Te("span","",`\u6D77\u62D4\u7EA6 ${Math.round(f(v(l.x,l.z)))} m`)),l.halls?.length&&D.append(Te("span","",`\u6BBF\u5802 ${l.halls.length} \u5904`)),l.transit?.length&&D.append(Te("span","","\u666F\u533A\u4EA4\u901A\u7AD9\u70B9"));let j=Te("div","card-summary");if(j.append(D),H.append(j),l.featured&&Sp(H),l.featured&&H.append(Te("p","lead","\u4E09\u5C42\u9000\u53F0\u7684\u5C71\u5730\u6C11\u5BBF\uFF1A\u5C4B\u9876\u9732\u53F0\u8FDC\u773A\u4E5D\u534E\u8BF8\u5CF0\uFF0C\u4E8C\u5C42\u6728\u5E73\u53F0\u4E0E\u7F57\u6C49\u677E\u5C0F\u9662\uFF0C\u95E8\u524D\u505C\u8F66\u573A\u5E26\u5145\u7535\u6869\uFF0C\u6321\u5899\u4E0A\u65B9\u662F\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u3002")),l.highlight){let k=Te("p","highlight");k.append(Te("b","","\u770B\u70B9"),l.highlight),H.append(k)}if(l.note&&H.append(Te("p","lead",l.note)),l.story?.length){let k=Te("div","story-box");k.append(Te("h4","",l.story.some(Z=>Z.kind==="\u5730\u8C8C")?"\u5730\u8C8C\u770B\u70B9":"\u6587\u5316\u770B\u70B9"));for(let Z of l.story){let J=Te("p","story");J.append(kd(Z.kind),Z.text),k.append(J)}H.append(k)}else l.architecture&&H.append(Te("p","",l.architecture));if(l.transit?.length){let k=Te("div","transit");for(let Z of l.transit)k.append(Te("p","",`${Z.route}${Z.stop&&Z.route!==Z.stop?`\uFF08${Z.stop}\u7AD9\uFF09`:""}\uFF1A${Z.hours}`)),Z.order&&k.append(Te("small","",Z.order)),Z.phone&&k.append(Te("small","",`\u54A8\u8BE2 ${Z.phone}`));k.append(Te("small","",`\u65F6\u95F4\u4EE5\u73B0\u573A\u4E3A\u51C6 \xB7 \u4E5D\u534E\u5C71\u98CE\u666F\u533A\u5B98\u7F51 ${t.transit?.retrieved||""} \u67E5\u8BE2`)),H.append(k)}let Y=bp(l.featured?"\u5EFA\u6A21\u8BF4\u660E":l.photos?.length?"\u8D44\u6599\u4E0E\u7167\u7247\u51FA\u5904":"\u8D44\u6599\u4E0E\u4F9D\u636E");if(l.storySources?.length){let k=Ru({sources:l.storySources});k.prepend(Te("span","","\u6587\u5B57\u51FA\u5904")),Y.append(k)}if(l.halls?.length&&Y.append(Te("p","",`\u5BFA\u5185\u6BBF\u5802 ${l.halls.length} \u5904\uFF1A${l.halls.slice(0,8).map(k=>k.n).join("\u3001")}${l.halls.length>8?"\u7B49":""}\uFF1B\u9760\u8FD1\u65F6\u663E\u793A\u4E3A\u5C0F\u6807\u6CE8\u3002`)),l.photos?.length){let k=Te("div","photo-credits");k.append(Te("h4","",`\u5B9E\u62CD\u7167\u7247 \xB7 ${l.photos.length} \u5F20`));for(let Z of l.photos)k.append(Te("p","",Z.alt),Hd(Z));Y.append(k)}for(let k of[`\u5B9A\u4F4D\uFF1A${Lx(l)}`,l.story?.length&&l.architecture,l.modelNote,l.positionNote,l.viewing?.source,l.aliases?.length&&!l.featured&&"\u5176\u4ED6\u540D\u79F0\uFF1A"+l.aliases.slice(0,4).join("\u3001"),l.category==="village"&&l.addressCount&&`\u7EA6 ${l.addressCount} \u4E2A\u516C\u5F00\u5730\u5740\u542B\u6B64\u5730\u540D\u3002`,l.quality?.startsWith("legacy")&&"\u6B64\u70B9\u6CBF\u7528\u539F\u7248\u5BFC\u89C8\u4F4D\u7F6E\uFF0C\u5C1A\u672A\u83B7\u5F97\u72EC\u7ACB\u5750\u6807\u8BC1\u636E\uFF1B\u865A\u7EBF\u6807\u6CE8\u8868\u793A\u5F85\u6838\u3002"])k&&Y.append(Te("p","",k));if(Y.append(Te("p","coords",`${l.lon?.toFixed(6)??""}\xB0E \xB7 ${l.lat?.toFixed(6)??""}\xB0N`),Ru(l)),H.append(Y),l.featured){let k=Te("div","card-actions"),Z=Te("a","btn accent");Z.href="tel:"+Gx,Z.innerHTML=Yx,Z.append(Te("span","full","\u81F4\u7535 "+Mp),Te("span","short","\u81F4\u7535\u6C11\u5BBF")),Z.setAttribute("aria-label","\u81F4\u7535\u5C45\u4E4B\u6797\u6C11\u5BBF "+Mp),k.append(Z),j.append(k)}};if(Hn&&(Gt("#panel").classList.add("closed"),Ki()),Zi(".place-item").forEach(U=>U.classList.toggle("selected",U.dataset.name===l.n)),!m){ri?.stopPreview(),Ei.cancel(),b();return}let E=Gt("#card");E.classList.contains("show")&&Ho(E,440),pp(),wu();let P=l.featured?Eu():mp(l);Gt("#flight-hint .fh-name").textContent=l.displayName||(l.featured?l.shortName:l.n),Vs(P,dp(P),()=>{if(_!==Xa||ji!==l){Ki();return}E.classList.add("arrive"),b(),clearTimeout(E._arrive),E._arrive=setTimeout(()=>E.classList.remove("arrive"),1600)},150)}function Zx(l){xp(),ri?.stopPreview(),Ei.cancel(),Xa++,ec();let m=l.positionQuality==="ml_roofprint",_=yp(l.name||l.precinct||l.templeGuess||"\u5BFA\u9662\u5EFA\u7B51","\u5BFA\u9662\u5EFA\u7B51",{cat:"temple",sub:l.precinct?`${l.precinct} \u5BFA\u9662\u8303\u56F4\u5185`:""}),b=Te("div","chips");b.append(Te("span","",`\u5360\u5730\u7EA6 ${Math.round(l.area)} m\xB2`),Te("span","",`${l.levels||"-"} \u5C42`),Te("span","",`\u5899\u9AD8 ${l.wallHeight.toFixed(1)} m`)),_.append(b);let E=bp("\u5916\u89C2\u4E0E\u6570\u636E\u4F9D\u636E");E.append(Te("p","",m?"\u5E73\u9762\u8F6E\u5ED3\u6765\u81EA\u5F71\u50CF\u8BC6\u522B\uFF0C\u53EF\u80FD\u5305\u542B\u8BC6\u522B\u8BEF\u5DEE\u3002":"\u5E73\u9762\u5F62\u72B6\u4E0E\u671D\u5411\u6765\u81EA\u5730\u56FE\u8BB0\u5F55\u3002")),l.styleRule&&E.append(Te("p","",`\u5916\u89C2\u4F9D\u636E\uFF08${{observed:"\u7167\u7247\u89C2\u5BDF",documented:"\u6587\u732E\u8BB0\u8F7D",inferred:"\u63A8\u65AD",secondary:"\u4E8C\u624B\u8D44\u6599"}[l.styleCertainty]||l.styleCertainty||"\u63A8\u65AD"}\uFF09\uFF1A${l.styleRule}\u3002\u9010\u680B\u697C\u5C42\u4E0E\u95E8\u7A97\u672A\u7ECF\u5B9E\u6D4B\u3002`)),E.append(Ru({sources:[{name:"\u67E5\u770B\u5EFA\u7B51\u6570\u636E\u6765\u6E90",url:l.source}]})),_.append(E);let P=Te("div","card-actions"),U=Wx("ghost",qx,"\u73AF\u770B\u8FD9\u680B\u5EFA\u7B51");U.onclick=()=>{pp(),Vs(hr(...l.center,Math.max(70,l.width*3),Su()+70,66)),wu()},P.append(U),_.append(P)}let Ep=new Bh,wp=new fe;function Jx(l){if(Ei.active||!Yt.visible)return;wp.set(l.clientX/innerWidth*2-1,-l.clientY/innerHeight*2+1),Ep.setFromCamera(wp,Ft);let m=Ep.intersectObjects(Vn,!0)[0],_=m&&dm(m.object,Ax,Tx);if(_){Ja(_,!1);return}let b=m&&t.buildings[m.object.userData.triangleIds?.[m.faceIndex]];b?.style==="temple"?Zx(b):Hn&&jo()}let Tp=l=>$l==="all"||(Px[$l]||[$l]).includes(l.category);function jx(l,m=qo){return Tp(l)&&cp.score(l,m)>=0}function sc(l){let m=Gt("#place-list");m.classList.toggle("animate",!!l),m.replaceChildren();let _=cp.search(qo,{accept:E=>Tp(E)&&(Yr(qo)?!0:E.searchable||E===Sr)});Gt("#list-summary").textContent=`${_.length} \u4E2A\u7ED3\u679C \xB7 \u53EF\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u516C\u5171\u8BBE\u65BD\u4E0E\u5546\u5BB6`;let b=_.slice(0,qo?400:220);b.forEach((E,P)=>{let U=Te("button","place-item"+(E===Sr?" featured":"")+(E===ji?" selected":""));l&&(U.style.animationDelay=Math.min(P,14)*16+"ms"),U.dataset.name=E.n,U.dataset.placeId=E.placeId,U.type="button",U.append(Te("span","pi-icon c-"+E.category,E===Sr?"\u5BBF":Cx[E.category]||"\xB7"));let X=Te("span","pi-text");X.append(Te("strong","",E.displayName||(E===Sr?E.shortName:E.n)),Te("small",xu(E)?"estimate":"",E===Sr?`\u7CBE\u9009\u6C11\u5BBF \xB7 ${E.address}`:[vp[E.category],E.highlight||(E.viewing?`\u53EF\u8FDC\u773A${E.viewing.name}`:E.zone)].filter(Boolean).join(" \xB7 ")+(xu(E)?" \xB7 \u4F4D\u7F6E\u5F85\u6838":""))),U.append(X),U.onclick=()=>Ja(E,!0),m.append(U)}),_.length>b.length&&m.append(Te("p","empty",`\u53E6\u6709 ${_.length-b.length} \u4E2A\u70B9\u4F4D\u672A\u5217\u51FA\uFF0C\u8BF7\u8F93\u5165\u540D\u79F0\u3001\u95E8\u724C\u6216\u6751\u540D\u7F29\u5C0F\u8303\u56F4\u3002`)),_.length||m.append(Te("p","empty","\u6CA1\u6709\u5339\u914D\u7684\u5730\u70B9\u3002\u53EF\u4EE5\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u6751\u540D\u6216\u8F66\u7AD9\u3001\u516C\u5395\u3001\u505C\u8F66\u573A\uFF0C\u4F8B\u5982\u201C\u5316\u57CE\u5BFA\u201D\u201C\u51E4\u51F0\u677E\u201D\u201C\u8F66\u7AD9\u201D\u3002"))}let Kx=lm(Gt("#search"),l=>{qo=l,it=!0,sc()}),Qx=()=>Kx.flush();Zi("[data-category]").forEach(l=>l.onclick=()=>{Qx(),$l=l.dataset.category,Zi("[data-category]").forEach(m=>m.classList.toggle("active",m===l)),sc(!0)}),sc();function Ap(){gp(Gt(".panel-tabs"),Gt(".panel-tabs .active"),"--tab-x","--tab-w")}function rc(l){let m=Gt(".panel-tabs .active")?.dataset.tab;Zi(".panel-tabs [data-tab]").forEach(_=>{let b=_.dataset.tab===l;_.classList.toggle("active",b),_.setAttribute("aria-selected",b),_.tabIndex=b?0:-1}),Gt("#tab-routes").hidden=l!=="routes",Gt("#tab-places").hidden=l!=="places",Gt("#tab-guide").hidden=l!=="guide",l==="places"&&m!=="places"&&sc(!0),Ap()}function oc(l){let m=Gt("#panel"),_=document.activeElement;m.classList.contains("closed")&&!m.contains(_)&&(Pu=_!==document.body?_:null),ri?.stopPreview(),!Hn&&(Gt("#card").classList.contains("show")||Ei.destination?.onDone)&&jo(!1),Ei.cancel(),l&&rc(l),Za("directory"),m.classList.remove("closed"),ja(),requestAnimationFrame(Ap);let b=Gt(".tab-pane:not([hidden])");nc(b?.id==="tab-places"?Gt("#search"):b?.id==="tab-routes"&&!Gt("#route-detail").hidden?Gt("#route-detail"):Gt('.panel-tabs [aria-selected="true"]'))}Zi(".panel-tabs [data-tab]").forEach(l=>l.onclick=()=>rc(l.dataset.tab)),rc("routes"),$g(t,Gt("#guide")),Gt(".panel-tabs").addEventListener("keydown",l=>{let m=Zi(".panel-tabs [data-tab]"),_=m.indexOf(document.activeElement),b={ArrowLeft:_-1,ArrowRight:_+1,Home:0,End:m.length-1}[l.key];if(_<0||b===void 0)return;l.preventDefault();let E=m[(b+m.length)%m.length];rc(E.dataset.tab),E.focus()});function Rp(){let l=Gt("#panel"),m=l.contains(document.activeElement);return l.classList.add("closed"),Gt("#search").blur(),ja(),m}function Iu(l){(l||Jo())&&qa(Pu,Gt("#panel-open"),Gt("#route-hud .rh-list")),Pu=null}Gt("#panel-close").onclick=()=>{let l=ri?.active&&!ri.canResume&&!Gt("#tab-routes").hidden,m=Rp();l&&(ri.close(),Au("town")),Iu(m)},Gt("#panel-open").onclick=()=>oc("places"),Gt("#routes-open").onclick=()=>oc("routes"),Gt("#guide-open").onclick=()=>oc("guide"),Hn&&Gt("#panel").classList.add("closed"),Gt("#settings-toggle").onclick=()=>{let l=Gt("#settings").classList.contains("collapsed");l&&Za("settings"),$a(l)},$a(!1),Gt("#featured-cta").onclick=()=>Ja(Sr,!0);function t1(){let l=innerWidth,m=innerHeight,_=Gt("#panel"),b=Gt("#card"),E=!_.classList.contains("closed"),P=Gt("#route-hud"),U=Gt(".rail"),X=U.querySelector(".map-actions"),H=document.body.classList.contains("map-chrome-hidden")?0:Gt(".viewbar").getBoundingClientRect().bottom,D=m,j=0,Y=l,k=!!X?.offsetWidth&&getComputedStyle(X).visibility!=="hidden";if(Hn)E?_.offsetWidth>l*.6?D=_.offsetTop:Y=_.offsetLeft:l>m&&k&&(Y=U.offsetLeft-8);else{j=Cp(b.classList.contains("show")?b:E?_:null),k&&(Y=U.offsetLeft-12);let Z=Gt(".map-meta");Z.offsetHeight&&(D=Math.min(m,Z.offsetTop-8))}return!P.hidden&&P.offsetParent&&(H=Math.max(H,P.getBoundingClientRect().bottom)),{left:j,top:H,right:Y,bottom:D,shiftX:Hr.x,shiftY:Hr.y}}let e1=".brand,.viewbar,.rail>*,.dock,.map-meta>*,#route-hud,#flight-hint,.settings-wrap";function n1(){let l=[];for(let m of Zi(e1)){if(!m.offsetWidth||m.closest(".is-hidden")||getComputedStyle(m).visibility==="hidden")continue;let _=m.getBoundingClientRect();l.push([_.left,_.top,_.right,_.bottom])}return l}ri=qg({routes:t.routes||[],scene:Wt,world:At,camera:Ft,controls:ye,hAt:v,realH:f,fly:Vs,pose:hr,openPanel:oc,isMobile:()=>Hn,visibleRect:t1,covers:n1,onFrame:l=>hp.push(l),cancelFlight:()=>{Ei.destination?.onDone||Ei.cancel()},onPlaybackChange:()=>{ur=null,Yo&&Ki(),$x()},closeSheetsForRoute:()=>{let l=document.activeElement,m=Hn&&!Gt("#panel").classList.contains("closed")&&Gt("#panel").contains(l)||Gt("#card").classList.contains("show")&&Gt("#card").contains(l);jo(!1),Hn&&Gt("#panel").classList.add("closed"),ja(),m&&nc(Gt("#route-hud .rh-play"))}}),Gt("#route-hud .rh-close").onclick=()=>{let l=Gt("#route-hud").contains(document.activeElement),m=Gt("#card").classList.contains("show"),_=!!Ei.destination?.onDone;ri.close(),m||_?Rs={...Tu(),view:"town"}:Au("town"),(l||Jo())&&qa(m?Gt("#card .card-head h2"):null,_?Ya:null,!Hn&&!Gt("#panel").classList.contains("closed")?Gt("#route-list .route-card"):null,Gt("#routes-open"),Gt("#panel-open"))},tx({compact:Vd,closePanel:()=>Iu(Rp())}),addEventListener("sheetchange",()=>Ki()),Gt("#layer-buildings").onchange=l=>Yt.visible=l.target.checked,Gt("#layer-trees").onchange=l=>{rp=l.target.checked,op()},Gt("#layer-trails").onchange=l=>Me.visible=l.target.checked,Gt("#height").oninput=l=>{ye.dispatchEvent({type:"gesturestart"});let m=At.scale.y;h=+l.target.value;let _=h/c;l.target.style.setProperty("--fill",(h-1)/.8*100+"%"),At.scale.y=_,Gt("#height-value").textContent=h===1?"\u771F\u5B9E\u6BD4\u4F8B \xD71.0":`\u5730\u5F62\u589E\u5F3A \xD7${h.toFixed(1)}`;let b=v(ye.target.x,ye.target.z)*(_-m);if(ye.target.y+=b,Ft.position.y+=b,Rs){let E=v(Rs.target.x,Rs.target.z)*(_-m);Rs.target.y+=E,Rs.pos.y+=E}for(let E of cr)E.label&&(E.label.position.y=(E.top+5)*_);for(let E of jl)E.label.position.y=(E.top+4)*_},Gt("#data-content").innerHTML=nx({W:e,D:n,stats:t.stats,transit:t.transit,places:cr});let Du=null;Gt("#credit-data").onclick=Gt("#credit-mobile").onclick=l=>{Du=l.currentTarget,Za("data"),Gt("#data-dialog").showModal(),Ki()},Gt("#data-close").onclick=Lu,Gt("#data-dialog").onclick=l=>{l.target===Gt("#data-dialog")&&Lu()},Gt("#data-dialog").addEventListener("close",()=>{Yo&&(Ki(),Jo()&&qa(Du,Gt("#credit-mobile"),Gt("#credit-data")),Du=null)}),Gt("#capture").onclick=()=>{let l=ox({frame:p.domElement,stats:t.stats,render:_=>(Ft.updateMatrixWorld(),Ip(_),Zt(),p.render(Wt,Ft),ri?.updateLabels(performance.now()),Dp(),it=!0,[...K.domElement.children])}),m=document.createElement("a");m.download="\u4E5D\u534E\u5C71\u4E09\u7EF4\u5730\u56FE-\u5B9E\u666F\u589E\u5F3A\u7248.png",m.href=l.toDataURL("image/png"),m.click(),Fl("\u5F53\u524D\u4E09\u7EF4\u753B\u9762\u5DF2\u5BFC\u51FA")};let i1=43,kr={x:0,y:0},Hr={x:0,y:0};function Uu(){let l=innerWidth,m=innerHeight,{x:_,y:b}=kr,E=l+2*Math.abs(_),P=m+2*Math.abs(b);Ft.aspect=E/P,Ft.fov=Math.atan(Math.tan(i1*Math.PI/360)*P/m)*360/Math.PI,E>l+1||P>m+1?Ft.setViewOffset(E,P,_>0?2*_:0,b>0?2*b:0,l,m):Ft.clearViewOffset(),Ft.updateProjectionMatrix()}function Cp(l){return l&&l.offsetWidth?l.offsetLeft+l.offsetWidth+12:0}function Ki(){let l=innerWidth,m=innerHeight,_=Gt("#card"),b=Gt("#panel"),E=document.body,P=!b.classList.contains("closed"),U=_.classList.contains("show"),X=!Gt("#settings").classList.contains("collapsed"),H=!!Ei.destination?.onDone,D=0,j=0,Y=Gt("#viewer").classList.contains("show"),k=P||U||H||!!ri?.active||Gt("#data-dialog").open||Y,Z=Hn?k||X:!!ri?.active;E.classList.toggle("panel-open",P),E.classList.toggle("card-open",U),E.classList.toggle("settings-open",X),E.classList.toggle("card-flight",H),E.classList.contains("map-chrome-hidden")!==Z&&(E.classList.toggle("map-chrome-hidden",Z),Z&&lx.stop());for(let pt of Zi(".map-chrome")){let Dt=Hn?pt.id==="settings"?k:Z:Z&&pt.matches(".viewbar");if(pt.inert!==(Dt||Y)&&(pt.inert=Dt||Y),pt.classList.contains("is-hidden")!==Dt){pt.classList.toggle("is-hidden",Dt),pt.setAttribute("aria-hidden",String(Dt)),pt.matches("button")&&(pt.disabled=Dt);for(let yt of pt.querySelectorAll("button"))yt.disabled=Dt}}for(let pt of Gt("#app").children){if(pt.id==="viewer"||pt.matches(".map-chrome,dialog"))continue;let Dt=Y||pt.id==="panel"&&!Hn&&U;pt.inert!==Dt&&(pt.inert=Dt)}let J=Gt("#flight-hint"),at=!zl&&H&&!!J.querySelector(".fh-name").textContent;if(at&&!J.classList.contains("show")?za(J):!at&&J.classList.contains("show")&&Ho(J,240),!Hn)D=-Cp(U?_:P||H?b:null)/2;else{let pt=U?_:P?b:null;if(pt&&pt.offsetWidth>l*.6){let Dt=Gt(".viewbar"),yt=Z?pt===_?8:0:Dt.offsetTop+Dt.offsetHeight;j=Math.max(0,m/2-(yt+pt.offsetTop)/2)}else pt&&(D=Math.max(0,(l-pt.offsetLeft)/2))}Hr={x:D,y:j},Yo||(kr={x:D,y:j},Uu())}function ja(){it=!0,mo(),A.setCeiling(x()),N(M);let l=innerWidth,m=innerHeight,_=Vd(),b=_!==Hn;b&&(Hn=_,_&&(Gt("#panel").classList.add("closed"),$a(!1)),p.shadowMap.enabled=Re.castShadow=T()),p.setSize(l,m),K.setSize(l,m);let E=!Hn&&!Gt("#panel").classList.contains("closed");document.body.classList.toggle("with-panel",E),Ki(),Uu(),Ql(),b&&ji&&Gt("#card").classList.contains("show")&&!Ei.active&&Vs(ji.featured?Eu():mp(ji),700)}function Ko(){let l=window.visualViewport,m=l?l.height:innerHeight,_=document.activeElement===Gt("#search"),b=Hn&&_&&l?Math.max(0,innerHeight-l.height-l.offsetTop):0;document.documentElement.style.setProperty("--visible-height",`${Math.round(m)}px`),document.documentElement.style.setProperty("--keyboard-inset",b>120?`${Math.round(b)}px`:"0px"),document.body.classList.toggle("keyboard-open",b>120)}window.visualViewport?.addEventListener("resize",Ko),window.visualViewport?.addEventListener("scroll",Ko),addEventListener("focusin",Ko),addEventListener("focusout",()=>requestAnimationFrame(Ko)),addEventListener("resize",Ko),Ko(),addEventListener("keydown",l=>{let m=Gt("#viewer");if(!m.hidden){l.key==="Escape"?Vx():(l.key==="ArrowLeft"||l.key==="ArrowRight")&&m._go(l.key==="ArrowLeft"?-1:1);return}if(l.key==="Escape"&&!Gt("#data-dialog").open){let _=Gt("#panel"),b=Hn&&!_.classList.contains("closed"),E=_.contains(document.activeElement);jo(),Za("detail"),Hn||$a(!1),b&&Iu(E)}}),addEventListener("resize",ja),ja();let Ka=new W;function Pp(l,m=4,_=0){let b=Ft.position,E=l.label.position,P=_?1-_/Math.max(_*1.2,b.distanceTo(E)):1;for(let U=2;U<24&&U/24<P;U++){let X=U/24,H=b.x+(E.x-b.x)*X,D=b.z+(E.z-b.z)*X;if(!(Math.abs(H)>e/2||Math.abs(D)>n/2)&&v(H,D)*At.scale.y>b.y+(E.y-b.y)*X+m)return!0}return!1}let Lp=".brand,.viewbar,.rail>*,.dock,.map-meta,#route-hud,#flight-hint,#panel,#card,.settings-wrap";function s1(l){let m=0,_=0;for(let b=l;b;b=b.offsetParent)m+=b.offsetLeft,_+=b.offsetTop;return[m,_,m+l.offsetWidth,_+l.offsetHeight]}function r1(){let l=innerWidth,m=innerHeight,_=!Gt("#settings").classList.contains("collapsed");Q=!1,lt=[],bt++;for(let b of Zi(Lp)){if(!b.offsetWidth||b.closest(".is-hidden")||b.id==="panel"&&b.classList.contains("closed")||(b.id==="card"||b.id==="flight-hint")&&!b.classList.contains("show")||b.matches(".settings-wrap")&&!_||getComputedStyle(b).visibility==="hidden")continue;let E=s1(b);b.matches(".sheet")?(Hn?b.offsetWidth>l*.6?(E[0]=0,E[2]=l):(E[1]=0,E[2]=l):E[0]=E[1]=0,E[3]=m):(E[0]<16&&(E[0]=0),l-E[2]<16&&(E[2]=l),E[1]<16&&(E[1]=0),m-E[3]<16&&(E[3]=m)),(b.matches(".sheet")||Hn&&b.matches(".settings-wrap"))&&E.push(1),lt.push(E)}}function mo(){Q=!0,mo.t||(it=!0),clearTimeout(mo.t),mo.t=setTimeout(()=>{mo.t=0,Q=it=!0},520)}{let l=new MutationObserver(mo),m=window.ResizeObserver&&new ResizeObserver(mo);l.observe(document.body,{attributes:!0,attributeFilter:["class"]});for(let _ of Zi(Lp))l.observe(_,{attributes:!0,attributeFilter:["class","hidden"]}),m?.observe(_)}function o1(l,m){let _=l.pos;if(_&&_.ox===m.ox&&_.oy===m.oy&&_.len===m.len&&_.ang===m.ang)return;l.pos=m;let b=l.el.style;b.setProperty("--dx",m.ox+"px"),b.setProperty("--dy",m.oy+"px"),b.setProperty("--len",m.len+"px"),b.setProperty("--ang",m.ang+"deg")}let a1=l=>({ox:0,oy:-l.stem,len:l.stem,ang:-90});function Ip(l,m=!1){Kt++;let _=!1;w.length=0;let b=Gt("#layer-labels").checked,E=[],P=innerWidth,U=innerHeight,X=Ft.position,H=lp??(Hn?28:60);b&&!l&&Q&&r1();let D=l||(b?lt:[]),j=D.filter(O=>O[4]),Y=D.filter(O=>!O[4]),k=!Gt("#panel").classList.contains("closed")&&!Gt("#tab-places").hidden,Z=document.body.classList.contains("route-on");for(let O of Fx){let ot=O.label.position,gt=Math.hypot(ot.x-X.x,ot.y-X.y,ot.z-X.z),rt=O===ji?2:O.tier||0,ut=b&&(!Z||O===ji)&&(gt<O.limit||O===ji||O.hall&&O.parent===ji&&gt<900)&&(O.road||O.hall||O.featured||O===ji||!k||jx(O,qo)),ft=0,st=0;if(ut){Ka.copy(ot).project(Ft),ft=(Ka.x+1)*P/2,st=(1-Ka.y)*U/2;let Tt=O.labelWidth/2,Ce=st-O.labelHeight;if(Ka.z>1||Ka.z<0||(rt?ft<4||ft>P-4||st<4||st>U-8:ft<Tt+4||ft>P-Tt-4||Ce<4||st>U-18))ut=!1;else if(rt){for(let It of rt>1?j:D)if(ft>It[0]&&ft<It[2]&&st>It[1]&&st<It[3]){ut=!1;break}}else for(let It of D)if(ft-Tt<It[2]&&ft+Tt>It[0]&&Ce<It[3]&&st+4>It[1]){ut=!1;break}}if(ut&&!O.road&&!O.featured){let Tt=rt?Pp(O,O.occ?0:10,150):Pp(O);Tt!==O.occ?(O.occN=(O.occN||0)+1,O.occ===void 0||O.occN>=2?(O.occ=Tt,O.occN=0):_=!0):O.occN=0,O.occ&&(ut=!1)}E.push({p:O,dist:gt,x:ft,y:st,v:ut,tier:rt})}E.sort((O,ot)=>!!ot.p.featured-!!O.p.featured||(ot.p===ji)-(O.p===ji)||ot.tier-O.tier||O.p.p-ot.p.p||O.dist-ot.dist),Zl=0;let J=(O,ot)=>Math.max(0,Math.min(O[2],ot[2])-Math.max(O[0],ot[0]))*Math.max(0,Math.min(O[3],ot[3])-Math.max(O[1],ot[1])),at=(O,ot,gt)=>O>gt[0]&&O<gt[2]&&ot>gt[1]&&ot<gt[3],pt=(O,ot,gt,rt,ut)=>{let ft=0,st=1,Tt=gt-O,Ce=rt-ot;for(let[It,ae]of[[-Tt,O-ut[0]],[Tt,ut[2]-O],[-Ce,ot-ut[1]],[Ce,ut[3]-ot]])if(It){let he=ae/It;if(It<0){if(he>st)return!1;he>ft&&(ft=he)}else{if(he<ft)return!1;he<st&&(st=he)}}else if(ae<0)return!1;return st-ft>.02},Dt=(O,ot)=>{let gt=(rt,ut,ft)=>(ut[0]-rt[0])*(ft[1]-rt[1])-(ut[1]-rt[1])*(ft[0]-rt[0]);return gt(O[0],O[1],ot[0])*gt(O[0],O[1],ot[1])<0&&gt(ot[0],ot[1],O[0])*gt(ot[0],ot[1],O[1])<0},yt=[],Ht=[],kt=E.filter(O=>O.v&&O.tier).map(O=>[O.x,O.y,O.p]),St=0;for(let O of E){let ot=null;if(O.v){let gt=O.p,rt=gt.labelWidth/2,ut=gt.labelHeight-gt.stem,ft=[O.x,O.y],st=(Tt,Ce)=>{let It=[O.x+Tt-rt,O.y+Ce-ut,O.x+Tt+rt,O.y+Ce],ae=ii(O.x,It[0],It[2]),he=ii(O.y,It[1],It[3]),se=Math.hypot(ae-O.x,he-O.y);return{ox:Math.round(Tt*2)/2,oy:Math.round(Ce*2)/2,len:se<3?0:Math.round(se*2)/2,ang:Math.round(Math.atan2(he-O.y,ae-O.x)*180/Math.PI),r:It,t:[ae,he]}};if(O.tier){let Tt=[st(0,-gt.stem)],Ce=gt.pos;Ce&&Tt.push(st(Ce.ox,Ce.oy));let It=wt=>{let Nt=Math.max(0,2-wt.r[0])+Math.min(0,P-2-wt.r[2]),et=Math.max(0,2-wt.r[1])+Math.min(0,U-2-wt.r[3]);return Nt||et?st(wt.ox+Nt,wt.oy+et):null},ae=Y.some(wt=>at(O.x,O.y,wt)),he=ae?280:190,se=gt.featured?7:4;for(let wt of ae?[10,26,48,76,110,150,200,250]:[10,26,48,76,110,150])for(let Nt=0;Nt<12;Nt++){let et=(Nt*30-90)*Math.PI/180,Ut=Math.cos(et),ge=Math.sin(et),Xt=Math.min(Math.abs(Ut)>.001?rt/Math.abs(Ut):1e9,Math.abs(ge)>.001?ut/2/Math.abs(ge):1e9),Pe=st(Ut*(wt+Xt),ge*(wt+Xt)+ut/2);Tt.push(Pe);let ln=It(Pe);ln&&Tt.push(ln)}for(let wt of Y)if(!(Math.max(wt[0]-O.x,O.x-wt[2],wt[1]-O.y,O.y-wt[3])>40))for(let et of[st(0,wt[3]+4+ut-O.y),st(0,wt[1]-4-O.y),st(wt[0]-4-rt-O.x,ut/2),st(wt[2]+4+rt-O.x,ut/2)]){Tt.push(et);let Ut=It(et);Ut&&Tt.push(Ut)}let ne=null,me=1/0,q=null,Et=1/0;for(let wt of Tt){let Nt=wt.r;if(Nt[0]<1||Nt[2]>P-1||Nt[1]<1||Nt[3]>U-1||wt.len>he)continue;let et=.8*Math.max(0,wt.len-gt.stem);if(Ce){let Pe=Math.hypot(wt.ox-Ce.ox,wt.oy-Ce.oy);et+=m?1.2*Pe+4*Math.max(0,Pe-70):Pe<2?-2:0}if(et>=me)continue;let Ut=[Nt[0]-2,Nt[1]-2,Nt[2]+2,Nt[3]+2],ge=0;for(let Pe of D)ge+=4*J(Nt,Pe);for(let Pe of yt)ge+=4*J(Ut,Pe);for(let[Pe,ln,rn]of kt)(rn!==gt?at(Pe,ln,[Ut[0]-3,Ut[1]-3,Ut[2]+3,Ut[3]+3]):wt!==Tt[0]&&at(Pe,ln,[Ut[0]-se,Ut[1]-se,Ut[2]+se,Ut[3]+se]))&&(ge+=rn===gt?3e3:1500);for(let[Pe,ln]of Ht)pt(Pe[0],Pe[1],ln[0],ln[1],[Nt[0]+3,Nt[1]+3,Nt[2]-3,Nt[3]-3])&&(ge+=1200);if(O.tier<2&&ge||ge+et>=me)continue;if(wt.len){let[Pe,ln]=wt.t;for(let rn of yt)pt(O.x,O.y,Pe,ln,[rn[0]+3,rn[1]+3,rn[2]-3,rn[3]-3])&&(et+=1200);for(let rn of Ht)Dt([ft,wt.t],rn)&&(et+=600);for(let rn of Y)!at(O.x,O.y,rn)&&pt(O.x,O.y,Pe,ln,[rn[0]-4,rn[1]-4,rn[2]+4,rn[3]+4])&&(et+=900)}let Xt=ge+et;if(Xt<me&&(me=Xt,ne=wt),!ge&&Xt<Et&&(Et=Xt,q=wt),Xt<=0)break}ot=O.tier>1?ne||Tt[0]:q,ot?(yt.push([ot.r[0]-2,ot.r[1]-2,ot.r[2]+2,ot.r[3]+2]),ot.len&&Ht.push([ft,ot.t]),Zl++):O.v=!1}else{let Tt=[O.x-rt-2,O.y-gt.labelHeight-2,O.x+rt+2,O.y+4];St>=H||yt.some(Ce=>J(Tt,Ce))||kt.some(([Ce,It])=>at(Ce,It,Tt))||Ht.some(([Ce,It])=>pt(Ce[0],Ce[1],It[0],It[1],Tt))?O.v=!1:(yt.push(Tt),St++,Zl++)}}o1(O.p,ot||a1(O.p)),O.v?(O.p.label.parent||Wt.add(O.p.label),O.p.label.visible=!0,w.push(O.p.label)):O.p.label.parent&&Wt.remove(O.p.label)}return _}function Dp(){zx(),C.children=w.filter(m=>m.parent).concat(ri?.labelObjects||[],zr),K.render(C,Ft);let l=+$o.style.zIndex||0;for(let m of ri?.labelObjects||[])if(m.element.classList.contains("named")){let _=1e3+(+m.element.style.zIndex||0);m.element.style.zIndex=_,l=Math.max(l,_+1)}$o.style.zIndex=l,mt++}let Qa=0,Up=0,Nu=0,ac=!1,Vr=0,go=0,tl=0,Cs=[],el=16.7,xo=0,Ou=0,Fu=!0,Bu=!0,Np=0,Op=0,Fp=0,Bp=new Nn,zp=new Nn,kp=new W,Hp=new xs;for(let l of["pointerdown","pointermove","wheel","keydown","input","change","click"])addEventListener(l,m=>{Nu=performance.now(),l!=="pointermove"&&!Zo.contains(m.target)&&(ur=null),["keydown","input","change","click"].includes(l)&&(it=!0)},{capture:!0,passive:!0});function lc(l){go=l,Vr=performance.now()+3e3,Cs=[]}function cc(l,m){l=Math.max(0,Math.min(Gd,l));let _=di,b=Mr;di=l,Mr=m==="emergency",(l!==_||Mr!==b)&&ap()}function Vp(l,m){if(l.action==="resolution-down"||l.action==="resolution-up")return N(!1,m),!0;if(l.action==="tier-down"){if(Fu=!1,di>0)cc(go===2&&di>tl?tl:di-1,"slow");else if(!Mr)cc(0,"emergency");else return!1;return iu.set("autoTier",di),!0}return!1}function l1(l,m){if(!(m-L<500)){if(Vr){if(m<Vr-2200||(Cs.push(Math.min(l,250)),m<Vr||Cs.length<12))return;let _=A.observe(Cs,m);if(el=_.mean,xo=0,Vp(_,m)){lc(go===2&&di>tl?2:1);return}if(Vr=0,Cs=[],Ou=m+3e3,go===1&&Fu&&_.fast&&A.limit===A.ceiling&&di<Gd&&!Mr){Fu=!1,tl=di,cc(di+1,"probe"),lc(2);return}go===2&&_.mean>22&&cc(tl,"probe-revert"),go=0,iu.set("autoTier",di);return}if(el=xo?el+(Math.min(l,250)-el)*.05:Math.min(l,250),xo++,Cs.push(Math.min(l,250)),Cs.length>240&&Cs.shift(),m>Ou&&xo>45){let _=A.observe(Cs,m);Vp(_,m),xo=0,Cs=[],Ou=m+3e3}}}document.addEventListener("visibilitychange",()=>{document.hidden&&(ur=null),Qa=0,ac=!1,Cs=[],xo=0,it=!0,!document.hidden&&Vr&&lc(go)});function Gp(l){if(requestAnimationFrame(Gp),document.hidden){Qa=0;return}let m=Qa?l-Qa:16.7;Qa=l;for(let j of hp)j(l,m);Ei.update(l);let _=ye.update(),b=kr.x!==Hr.x||kr.y!==Hr.y;if(b){let j=zl?1:1-Math.pow(.86,m/16.7);for(let Y of["x","y"])kr[Y]+=(Hr[Y]-kr[Y])*j,Math.abs(kr[Y]-Hr[Y])<.4&&(kr[Y]=Hr[Y]);Uu()}let E=zs&&!Vr&&!Ei.active&&!_&&!b&&!ri?.previewing&&l-Nu>1500;if(E&&!it&&!Kl&&l-Up<(l-Nu>8e3?98:48)){ac=!1;return}ac&&!E?l1(m,l):Vr||(Cs=[],xo=0),ac=!0,Up=l,N(E,l),Fp++;for(let j of pu){let Y=zl?j.phase:j.kind==="funicular"?(Math.sin(l/16e3)*.5+.5)*.96+.02:(l/14e4+j.phase)%1,k=j.curve.getPoint(Y);j.g.position.copy(k),j.kind==="cable"&&(j.g.position.y-=5.5);let Z=j.curve.getTangent(Y);j.g.rotation.y=Math.atan2(-Z.z,Z.x)}let P=Ft.position.distanceTo(ye.target),U=Fr[di];for(let j of an)j.visible=P<U.landmarkDist;for(let j of mu)j.update(P);for(let j of Wa)j.trunk&&(j.trunk.visible=P<U.trunkDist);for(let j of Si)j.visible=P<U.detailDist;if(ho){let j=Ft.position.distanceTo(ho.position),Y=ii(j/160,1,26);ho.scale.setScalar(Y),ho.rotation.y=l/1400;let k=Sr;k?.label&&(k.label.position.y=(ho.userData.base+ho.userData.head*Y)*At.scale.y+2*Y)}Ft.updateMatrixWorld();let X=!Bp.equals(Ft.matrixWorld)||!zp.equals(Ft.projectionMatrix);X&&(Bu=!0);let H=it||Bu&&l-Np>=110;if(H){let j=Ft.position.distanceTo(kp)>Math.max(.02,Ft.position.distanceTo(ye.target)*4e-4)||Hp.angleTo(Ft.quaternion)>4e-4;kp.copy(Ft.position),Hp.copy(Ft.quaternion),Bu=Ip(null,j)||j,Np=l}if(H||X&&l-Op>=110){Op=l;let j=ye.target;Re.target.position.copy(j),Re.position.set(j.x-1200,j.y+2100,j.z-1300),Gt("#north-arrow").style.transform=`rotate(${-Su()}deg)`,Gt("#scene-status").textContent=P<350?"\u5EFA\u7B51\u8FD1\u666F \xB7 \u7EC6\u90E8\u590D\u539F":P<2100?"\u4E5D\u534E\u5C71\u8857\u533A \xB7 \u62D6\u52A8\u73AF\u770B":k2.matches?"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u6EDA\u8F6E\u7F29\u653E":"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u53CC\u6307\u7F29\u653E";let Y=P*2*Math.tan(43*Math.PI/360)/innerHeight*80;Gt("#scale-line").textContent=Y>1e3?`${(Y/1e3).toFixed(1)} km`:`${Math.round(Y/10)*10||5} m`}Zt(),p.render(Wt,Ft);let D=ri?.updateLabels(l);(X||H||D||Kl)&&Dp(),it=Kl=!1,Bp.copy(Ft.matrixWorld),zp.copy(Ft.projectionMatrix),++Rx===30&&console.info("Map verification",JSON.stringify(window.mapDiagnostics))}Yo=!0,ap(),lc(1),Gt("#loading").classList.add("done"),setTimeout(()=>{Gt("#loading").hidden=!0,document.body.classList.contains("map-chrome-hidden")||lx.start()},700),requestAnimationFrame(Gp),window.mapDiagnostics={version:t.version,buildings:t.stats.buildings,places:cr.length,businesses:t.stats.businesses,trees:Xl.length,bamboo:uu.length,roads:t.roads.length,coordinateSystem:t.geo.crs,randomHouses:0,detailModel:"mapped footprints + area-rule facades; only \u5C45\u4E4B\u6797 named among businesses",signs:wi.length,lanterns:Br.length,get drawCalls(){return p.info.render.calls},get frames(){return p.info.render.frame},get pixelRatio(){return p.getPixelRatio()},get quality(){return Fr[di].name+(Mr?"-":"")},get tier(){return di},get frameMs(){return Math.round(el*10)/10},get triangles(){return p.info.render.triangles},get visibleLabels(){return Zl},get resolutionLimit(){return A.limit},get idleResolution(){return M},get spatialMode(){return mu.some(l=>l.near)?"near":"far"},get labelPasses(){return mt},get labelSelections(){return Kt},get labelCovers(){return lt.map(l=>l.map(Math.round))},get coverMeasures(){return bt},get animationUpdates(){return Fp}}}
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
