var qr=i=>String(i??"").normalize("NFKC").toLowerCase().replace(/[\s()（）·.,，。\-_/]+/g,""),sm=[["toilet",["\u516C\u5171\u5395\u6240","\u516C\u5395","\u5395\u6240","\u536B\u751F\u95F4","\u6D17\u624B\u95F4","wc"],i=>i.k==="\u516C\u5171\u5395\u6240"],["cable",["\u7D22\u9053","\u7F06\u8F66"],i=>i.category==="transport"&&/索道|缆车/.test(i.n)||i.k==="cable-car"],["bus",["\u666F\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u7AD9","\u5BA2\u8FD0\u7AD9","\u5DF4\u58EB\u7AD9","\u4E58\u8F66\u5904","\u8F66\u7AD9"],i=>i.category==="transport"&&/bus/.test(i.k)],["visitor",["\u6E38\u5BA2\u670D\u52A1\u5206\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3","\u6E38\u5BA2\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u7AD9"],i=>i.k==="\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3"],["ticket",["\u552E\u7968\u5904","\u552E\u7968\u70B9","\u552E\u7968\u4EAD","\u7968\u52A1"],i=>/售票/.test([i.n,...i.aliases||[]].join(" "))],["parking",["\u505C\u8F66\u573A","\u505C\u8F66\u5904","\u505C\u8F66\u4F4D","\u505C\u8F66"],i=>i.category==="service"&&/停车场|car park/.test(i.k)],["temple",["\u5BFA\u5E99","\u5BFA\u9662"],i=>i.category==="temple"],["hotel",["\u4F4F\u5BBF","\u9152\u5E97","\u65C5\u9986","\u65C5\u5E97"],i=>i.category==="hotel"],["guesthouse",["\u6C11\u5BBF","\u5BA2\u6808"],i=>i.category==="hotel"&&/民宿|客栈/.test(i.n+(i.k||""))],["food",["\u9910\u996E","\u9910\u5385","\u9910\u9986","\u996D\u5E97","\u996D\u9986","\u5403\u996D"],i=>i.category==="food"],["shop",["\u8D2D\u7269","\u5546\u5E97","\u5546\u94FA","\u5E97\u94FA"],i=>i.category==="shop"],["market",["\u8D85\u5E02","\u4FBF\u5229\u5E97","\u5C0F\u5356\u90E8"],i=>i.category==="shop"&&/超市|便利|小卖部/.test(i.n+(i.k||""))],["sight",["\u666F\u70B9","\u666F\u89C2"],i=>["sight","nature"].includes(i.category)],["nature",["\u81EA\u7136\u666F\u89C2","\u5C71\u6C34\u666F\u89C2","\u5C71\u6C34"],i=>i.category==="nature"],["village",["\u6751\u843D","\u6751\u5E84","\u5730\u540D","\u793E\u533A"],i=>i.category==="village"],["service",["\u516C\u5171\u8BBE\u65BD","\u516C\u5171\u670D\u52A1"],i=>["service","transport"].includes(i.category)],["transport",["\u4EA4\u901A","\u4EA4\u901A\u8BBE\u65BD"],i=>i.category==="transport"]],w1=sm.flatMap(([i,t])=>t.map(e=>({term:qr(e),id:i}))).sort((i,t)=>t.term.length-i.term.length);function T1(i){let t=[];for(let e of String(i??"").normalize("NFKC").toLowerCase().trim().split(/\s+/)){let n=qr(e),s="";for(;n;){let r=w1.find(a=>n.startsWith(a.term));r?(s&&t.push({text:s}),s="",t.push({group:r.id}),n=n.slice(r.term.length)):(s+=n[0],n=n.slice(1))}s&&t.push({text:s})}return t}function rm(i){let t=new Set,e=[];for(let a of i){if(!a.n||!Number.isFinite(a.x)||!Number.isFinite(a.z))continue;let o=a.placeId||a.n;if(t.has(o))continue;t.add(o);let l=[a.n,a.displayName].filter(Boolean).map(qr),h=[a.shortName,...a.aliases||[],a.viewing?.name].filter(Boolean).map(qr),u=[...l,...h,a.address,a.zone,a.k].filter(Boolean).map(qr),f=new Set(sm.filter(([,,g])=>g(a)).map(([g])=>g));e.push({place:a,names:l,aliases:h,texts:u,groups:f})}let n=null,s=new Map;function r(a){let o=String(a??"");if(o===n||(n=o,s=new Map,o.length>200))return s;let l=qr(a),h=T1(a);for(let u of e){let f=-1;if(!String(a??"").trim())f=0;else if(!l)f=-1;else if(u.names.includes(l))f=1e3;else if(u.aliases.includes(l))f=900;else if(h.length&&h.every(g=>g.group?u.groups.has(g.group):u.texts.some(d=>d.includes(g.text)))){let g=h.filter(d=>d.text);f=u.names.some(d=>d.startsWith(l))?800:u.names.some(d=>d.includes(l))?700:u.aliases.some(d=>d.includes(l))?600:g.some(d=>u.names.some(y=>y.includes(d.text)))?500:g.some(d=>u.aliases.some(y=>y.includes(d.text)))?400:200}s.set(u.place,f)}return s}return{score(a,o){return r(o).get(a)??-1},search(a,{accept:o=()=>!0}={}){let l=r(a);return e.filter(h=>l.get(h.place)>=0&&o(h.place)).sort((h,u)=>l.get(u.place)-l.get(h.place)||(u.place.featured?1:0)-(h.place.featured?1:0)||(h.place.p??99)-(u.place.p??99)||h.place.n.localeCompare(u.place.n,"zh-CN")).map(h=>h.place)}}}function om(i,t,{delay:e=90}={}){let n=!1,s,r=()=>{clearTimeout(s),s=void 0},a=()=>{r(),n||t(i.value.trim())},o=u=>{r(),!(n||u?.isComposing)&&(s=setTimeout(a,e))},l=()=>{n=!0,r()},h=()=>{n=!1,o()};return i.addEventListener("input",o),i.addEventListener("compositionstart",l),i.addEventListener("compositionend",h),{flush:a,destroy(){r(),i.removeEventListener("input",o),i.removeEventListener("compositionstart",l),i.removeEventListener("compositionend",h)}}}function am(i){let t=1/0,e=-1/0;for(let n=0;n<i.length;n++)i[n]<t&&(t=i[n]),i[n]>e&&(e=i[n]);return{min:t,max:e}}var lm={"\u516C\u5395\uFF08\u4E09\u89D2\u6D32\u8F66\u7AD9\u505C\u8F66\u573A\u65C1\uFF09":609946470,"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":609892484,"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":609980796,"\u516C\u5171\u5395\u6240(AH-CIZ-0666)":609909660},A1={"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":"facility:toilet-dongya","\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":"facility:toilet-huxingshan",\u864E\u5F62\u5C71\u8F66\u7AD9:"transport:huxingshan-station"},ll=i=>A1[i]||`place:${i}`,cm="\u4E1A\u4E3B\u6307\u8BA4 \xB7 \u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E";function hm(i){i.places.some(e=>e.n==="\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09")||i.places.push({n:"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09",shortName:"\u516C\u5395",category:"service",k:"\u516C\u5171\u5395\u6240",p:3,zone:"\u4E5D\u534E\u8857\uFF08\u9547\u533A\uFF09",x:-1424,z:-17,lon:117.8115+-1424/95950,lat:30.482- -17/110900,address:"\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1",quality:"owner_reported",src:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09",sources:[{name:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09\uFF0C\u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E",url:""}],sourceFamilies:["owner"],coordinateMethod:"\u6A21\u578B\u5E73\u9762\u5750\u6807\u6309\u9879\u76EE\u6295\u5F71\u6362\u7B97\u4E3A\u8FD1\u4F3C WGS84",modelQuality:"schematic",note:"\u8BBE\u65BD\u7531\u4E1A\u4E3B\u6307\u8BA4\uFF1B\u4F4D\u7F6E\u53CA\u5F53\u524D\u5F00\u653E\u72B6\u6001\u672A\u72EC\u7ACB\u6838\u5B9E\u3002",searchable:!0});let t=i.places.find(e=>e.n==="\u864E\u5F62\u5C71\u8F66\u7AD9");t&&(t.aliases=[...new Set([...t.aliases||[],"\u864E\u5F62\u5C71\u8F66\u7AD9\u552E\u7968\u5904","\u864E\u5F62\u5C71\u552E\u7968\u5904"])]);for(let e of i.places)e.placeId=ll(e.n);return i.places}function um(i,t,e){for(let n=i;n;n=n.parent){if(n.userData?.placeId)return t.get(n.userData.placeId);if(n.userData?.landmark&&e.has(n.userData.landmark))return e.get(n.userData.landmark)}}var No={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Oo={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},R1=0,fm=1,C1=2;var Z0=1,bd=2,Pr=3,io=0,xs=1,mn=2;var to=0,Ea=1,dm=2,pm=3,mm=4,P1=5,Eo=100,L1=101,I1=102,gm=103,xm=104,D1=200,U1=201,N1=202,O1=203,If=204,Df=205,F1=206,B1=207,z1=208,k1=209,H1=210,V1=211,G1=212,W1=213,X1=214,q1=0,Y1=1,$1=2,$c=3,Z1=4,J1=5,j1=6,K1=7,Sd=0,Q1=1,ty=2,eo=0,ey=1,ny=2,iy=3,Ed=4,sy=5,ry=6;var J0=300,Aa=301,Ra=302,Uf=303,Nf=304,kh=306,so=1e3,js=1001,Of=1002,Pi=1003,ym=1004;var ju=1005;var gs=1006,oy=1007;var Ml=1008;var no=1009,ay=1010,ly=1011,wd=1012,j0=1013,Kr=1014,Qr=1015,bl=1016,K0=1017,Q0=1018,To=1020,cy=1021,Ks=1023,hy=1024,uy=1025,Ao=1026,Ca=1027,fy=1028,tg=1029,dy=1030,eg=1031,ng=1033,Ku=33776,Qu=33777,tf=33778,ef=33779,_m=35840,vm=35841,Mm=35842,bm=35843,ig=36196,Sm=37492,Em=37496,wm=37808,Tm=37809,Am=37810,Rm=37811,Cm=37812,Pm=37813,Lm=37814,Im=37815,Dm=37816,Um=37817,Nm=37818,Om=37819,Fm=37820,Bm=37821,nf=36492,zm=36494,km=36495,py=36283,Hm=36284,Vm=36285,Gm=36286;var Zc=2300,Jc=2301,sf=2302,Wm=2400,Xm=2401,qm=2402;var sg=3e3,Ro=3001,my=3200,gy=3201,Hh=0,xy=1,Bs="",kn="srgb",Ir="srgb-linear",Td="display-p3",Vh="display-p3-linear",jc="linear",oi="srgb",Kc="rec709",Qc="p3";var ia=7680;var Ym=519,yy=512,_y=513,vy=514,rg=515,My=516,by=517,Sy=518,Ey=519,Ff=35044;var $m="300 es",Bf=1035,Lr=2e3,th=2001,mr=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Qi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Zm=1234567,ml=Math.PI/180,Sl=180/Math.PI;function pr(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qi[i&255]+Qi[i>>8&255]+Qi[i>>16&255]+Qi[i>>24&255]+"-"+Qi[t&255]+Qi[t>>8&255]+"-"+Qi[t>>16&15|64]+Qi[t>>24&255]+"-"+Qi[e&63|128]+Qi[e>>8&255]+"-"+Qi[e>>16&255]+Qi[e>>24&255]+Qi[n&255]+Qi[n>>8&255]+Qi[n>>16&255]+Qi[n>>24&255]).toLowerCase()}function Li(i,t,e){return Math.max(t,Math.min(e,i))}function Ad(i,t){return(i%t+t)%t}function wy(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function Ty(i,t,e){return i!==t?(e-i)/(t-i):0}function gl(i,t,e){return(1-e)*i+e*t}function Ay(i,t,e,n){return gl(i,t,1-Math.exp(-e*n))}function Ry(i,t=1){return t-Math.abs(Ad(i,t*2)-t)}function Cy(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Py(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Ly(i,t){return i+Math.floor(Math.random()*(t-i+1))}function Iy(i,t){return i+Math.random()*(t-i)}function Dy(i){return i*(.5-Math.random())}function Uy(i){i!==void 0&&(Zm=i);let t=Zm+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ny(i){return i*ml}function Oy(i){return i*Sl}function zf(i){return(i&i-1)===0&&i!==0}function Fy(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function eh(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function By(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),h=r((t+n)/2),u=a((t+n)/2),f=r((t-n)/2),g=a((t-n)/2),d=r((n-t)/2),y=a((n-t)/2);switch(s){case"XYX":i.set(o*u,l*f,l*g,o*h);break;case"YZY":i.set(l*g,o*u,l*f,o*h);break;case"ZXZ":i.set(l*f,l*g,o*u,o*h);break;case"XZX":i.set(o*u,l*y,l*d,o*h);break;case"YXY":i.set(l*d,o*u,l*y,o*h);break;case"ZYZ":i.set(l*y,l*d,o*u,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function dr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Gh={DEG2RAD:ml,RAD2DEG:Sl,generateUUID:pr,clamp:Li,euclideanModulo:Ad,mapLinear:wy,inverseLerp:Ty,lerp:gl,damp:Ay,pingpong:Ry,smoothstep:Cy,smootherstep:Py,randInt:Ly,randFloat:Iy,randFloatSpread:Dy,seededRandom:Uy,degToRad:Ny,radToDeg:Oy,isPowerOfTwo:zf,ceilPowerOfTwo:Fy,floorPowerOfTwo:eh,setQuaternionFromProperEuler:By,normalize:Gn,denormalize:dr},de=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Li(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},En=class i{constructor(t,e,n,s,r,a,o,l,h){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h)}set(t,e,n,s,r,a,o,l,h){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],h=n[1],u=n[4],f=n[7],g=n[2],d=n[5],y=n[8],v=s[0],p=s[3],x=s[6],T=s[1],M=s[4],C=s[7],P=s[2],L=s[5],B=s[8];return r[0]=a*v+o*T+l*P,r[3]=a*p+o*M+l*L,r[6]=a*x+o*C+l*B,r[1]=h*v+u*T+f*P,r[4]=h*p+u*M+f*L,r[7]=h*x+u*C+f*B,r[2]=g*v+d*T+y*P,r[5]=g*p+d*M+y*L,r[8]=g*x+d*C+y*B,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8];return e*a*u-e*o*h-n*r*u+n*o*l+s*r*h-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8],f=u*a-o*h,g=o*l-u*r,d=h*r-a*l,y=e*f+n*g+s*d;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/y;return t[0]=f*v,t[1]=(s*h-u*n)*v,t[2]=(o*n-s*a)*v,t[3]=g*v,t[4]=(u*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=d*v,t[7]=(n*l-h*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),h=Math.sin(r);return this.set(n*l,n*h,-n*(l*a+h*o)+a+t,-s*h,s*l,-s*(-h*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(rf.makeScale(t,e)),this}rotate(t){return this.premultiply(rf.makeRotation(-t)),this}translate(t,e){return this.premultiply(rf.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},rf=new En;function og(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function nh(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function zy(){let i=nh("canvas");return i.style.display="block",i}var Jm={};function xl(i){i in Jm||(Jm[i]=!0,console.warn(i))}var jm=new En().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Km=new En().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),_c={[Ir]:{transfer:jc,primaries:Kc,toReference:i=>i,fromReference:i=>i},[kn]:{transfer:oi,primaries:Kc,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Vh]:{transfer:jc,primaries:Qc,toReference:i=>i.applyMatrix3(Km),fromReference:i=>i.applyMatrix3(jm)},[Td]:{transfer:oi,primaries:Qc,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Km),fromReference:i=>i.applyMatrix3(jm).convertLinearToSRGB()}},ky=new Set([Ir,Vh]),Wn={enabled:!0,_workingColorSpace:Ir,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!ky.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=_c[t].toReference,s=_c[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return _c[i].primaries},getTransfer:function(i){return i===Bs?jc:_c[i].transfer}};function wa(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function of(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var sa,ih=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{sa===void 0&&(sa=nh("canvas")),sa.width=t.width,sa.height=t.height;let n=sa.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=sa}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=nh("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=wa(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wa(e[n]/255)*255):e[n]=wa(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Hy=0,sh=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Hy++}),this.uuid=pr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(af(s[a].image)):r.push(af(s[a]))}else r=af(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function af(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?ih.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Vy=0,As=class i extends mr{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=js,s=js,r=gs,a=Ml,o=Ks,l=no,h=i.DEFAULT_ANISOTROPY,u=Bs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Vy++}),this.uuid=pr(),this.name="",this.source=new sh(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new En,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(xl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===Ro?kn:Bs),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==J0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case so:t.x=t.x-Math.floor(t.x);break;case js:t.x=t.x<0?0:1;break;case Of:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case so:t.y=t.y-Math.floor(t.y);break;case js:t.y=t.y<0?0:1;break;case Of:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return xl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===kn?Ro:sg}set encoding(t){xl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===Ro?kn:Bs}};As.DEFAULT_IMAGE=null;As.DEFAULT_MAPPING=J0;As.DEFAULT_ANISOTROPY=1;var Fn=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,h=l[0],u=l[4],f=l[8],g=l[1],d=l[5],y=l[9],v=l[2],p=l[6],x=l[10];if(Math.abs(u-g)<.01&&Math.abs(f-v)<.01&&Math.abs(y-p)<.01){if(Math.abs(u+g)<.1&&Math.abs(f+v)<.1&&Math.abs(y+p)<.1&&Math.abs(h+d+x-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(h+1)/2,C=(d+1)/2,P=(x+1)/2,L=(u+g)/4,B=(f+v)/4,nt=(y+p)/4;return M>C&&M>P?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=L/n,r=B/n):C>P?C<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(C),n=L/s,r=nt/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=B/r,s=nt/r),this.set(n,s,r,e),this}let T=Math.sqrt((p-y)*(p-y)+(f-v)*(f-v)+(g-u)*(g-u));return Math.abs(T)<.001&&(T=1),this.x=(p-y)/T,this.y=(f-v)/T,this.z=(g-u)/T,this.w=Math.acos((h+d+x-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},kf=class extends mr{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Fn(0,0,t,e),this.scissorTest=!1,this.viewport=new Fn(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(xl("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===Ro?kn:Bs),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:gs,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new As(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new sh(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Dr=class extends kf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},rh=class extends As{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pi,this.minFilter=Pi,this.wrapR=js,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Hf=class extends As{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pi,this.minFilter=Pi,this.wrapR=js,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ys=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],h=n[s+1],u=n[s+2],f=n[s+3],g=r[a+0],d=r[a+1],y=r[a+2],v=r[a+3];if(o===0){t[e+0]=l,t[e+1]=h,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=g,t[e+1]=d,t[e+2]=y,t[e+3]=v;return}if(f!==v||l!==g||h!==d||u!==y){let p=1-o,x=l*g+h*d+u*y+f*v,T=x>=0?1:-1,M=1-x*x;if(M>Number.EPSILON){let P=Math.sqrt(M),L=Math.atan2(P,x*T);p=Math.sin(p*L)/P,o=Math.sin(o*L)/P}let C=o*T;if(l=l*p+g*C,h=h*p+d*C,u=u*p+y*C,f=f*p+v*C,p===1-o){let P=1/Math.sqrt(l*l+h*h+u*u+f*f);l*=P,h*=P,u*=P,f*=P}}t[e]=l,t[e+1]=h,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],h=n[s+2],u=n[s+3],f=r[a],g=r[a+1],d=r[a+2],y=r[a+3];return t[e]=o*y+u*f+l*d-h*g,t[e+1]=l*y+u*g+h*f-o*d,t[e+2]=h*y+u*d+o*g-l*f,t[e+3]=u*y-o*f-l*g-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,h=o(n/2),u=o(s/2),f=o(r/2),g=l(n/2),d=l(s/2),y=l(r/2);switch(a){case"XYZ":this._x=g*u*f+h*d*y,this._y=h*d*f-g*u*y,this._z=h*u*y+g*d*f,this._w=h*u*f-g*d*y;break;case"YXZ":this._x=g*u*f+h*d*y,this._y=h*d*f-g*u*y,this._z=h*u*y-g*d*f,this._w=h*u*f+g*d*y;break;case"ZXY":this._x=g*u*f-h*d*y,this._y=h*d*f+g*u*y,this._z=h*u*y+g*d*f,this._w=h*u*f-g*d*y;break;case"ZYX":this._x=g*u*f-h*d*y,this._y=h*d*f+g*u*y,this._z=h*u*y-g*d*f,this._w=h*u*f+g*d*y;break;case"YZX":this._x=g*u*f+h*d*y,this._y=h*d*f+g*u*y,this._z=h*u*y-g*d*f,this._w=h*u*f-g*d*y;break;case"XZY":this._x=g*u*f-h*d*y,this._y=h*d*f-g*u*y,this._z=h*u*y+g*d*f,this._w=h*u*f+g*d*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],h=e[2],u=e[6],f=e[10],g=n+o+f;if(g>0){let d=.5/Math.sqrt(g+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-h)*d,this._z=(a-s)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+h)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(r-h)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+h)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Li(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,h=e._z,u=e._w;return this._x=n*u+a*o+s*h-r*l,this._y=s*u+a*l+r*o-n*h,this._z=r*u+a*h+n*l-s*o,this._w=a*u-n*o-s*l-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}let h=Math.sqrt(l),u=Math.atan2(h,o),f=Math.sin((1-e)*u)/h,g=Math.sin(e*u)/h;return this._w=a*f+this._w*g,this._x=n*f+this._x*g,this._y=s*f+this._y*g,this._z=r*f+this._z*g,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},X=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Qm.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Qm.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,h=2*(a*s-o*n),u=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*h+a*f-o*u,this.y=n+l*u+o*h-r*f,this.z=s+l*f+r*u-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return lf.copy(this).projectOnVector(t),this.sub(lf)}reflect(t){return this.sub(lf.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Li(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},lf=new X,Qm=new ys,es=class{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Ys.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Ys.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Ys.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Ys):Ys.fromBufferAttribute(r,a),Ys.applyMatrix4(t.matrixWorld),this.expandByPoint(Ys);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),vc.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),vc.copy(n.boundingBox)),vc.applyMatrix4(t.matrixWorld),this.union(vc)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Ys),Ys.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(cl),Mc.subVectors(this.max,cl),ra.subVectors(t.a,cl),oa.subVectors(t.b,cl),aa.subVectors(t.c,cl),Yr.subVectors(oa,ra),$r.subVectors(aa,oa),_o.subVectors(ra,aa);let e=[0,-Yr.z,Yr.y,0,-$r.z,$r.y,0,-_o.z,_o.y,Yr.z,0,-Yr.x,$r.z,0,-$r.x,_o.z,0,-_o.x,-Yr.y,Yr.x,0,-$r.y,$r.x,0,-_o.y,_o.x,0];return!cf(e,ra,oa,aa,Mc)||(e=[1,0,0,0,1,0,0,0,1],!cf(e,ra,oa,aa,Mc))?!1:(bc.crossVectors(Yr,$r),e=[bc.x,bc.y,bc.z],cf(e,ra,oa,aa,Mc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Ys).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Ys).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(wr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),wr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),wr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),wr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),wr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),wr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),wr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),wr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(wr),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},wr=[new X,new X,new X,new X,new X,new X,new X,new X],Ys=new X,vc=new es,ra=new X,oa=new X,aa=new X,Yr=new X,$r=new X,_o=new X,cl=new X,Mc=new X,bc=new X,vo=new X;function cf(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){vo.fromArray(i,r);let o=s.x*Math.abs(vo.x)+s.y*Math.abs(vo.y)+s.z*Math.abs(vo.z),l=t.dot(vo),h=e.dot(vo),u=n.dot(vo);if(Math.max(-Math.max(l,h,u),Math.min(l,h,u))>o)return!1}return!0}var Gy=new es,hl=new X,hf=new X,_s=class{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Gy.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;hl.subVectors(t,this.center);let e=hl.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(hl,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(hf.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(hl.copy(t.center).add(hf)),this.expandByPoint(hl.copy(t.center).sub(hf))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},Tr=new X,uf=new X,Sc=new X,Zr=new X,ff=new X,Ec=new X,df=new X,Co=class{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,Tr)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=Tr.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(Tr.copy(this.origin).addScaledVector(this.direction,e),Tr.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){uf.copy(t).add(e).multiplyScalar(.5),Sc.copy(e).sub(t).normalize(),Zr.copy(this.origin).sub(uf);let r=t.distanceTo(e)*.5,a=-this.direction.dot(Sc),o=Zr.dot(this.direction),l=-Zr.dot(Sc),h=Zr.lengthSq(),u=Math.abs(1-a*a),f,g,d,y;if(u>0)if(f=a*l-o,g=a*o-l,y=r*u,f>=0)if(g>=-y)if(g<=y){let v=1/u;f*=v,g*=v,d=f*(f+a*g+2*o)+g*(a*f+g+2*l)+h}else g=r,f=Math.max(0,-(a*g+o)),d=-f*f+g*(g+2*l)+h;else g=-r,f=Math.max(0,-(a*g+o)),d=-f*f+g*(g+2*l)+h;else g<=-y?(f=Math.max(0,-(-a*r+o)),g=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+g*(g+2*l)+h):g<=y?(f=0,g=Math.min(Math.max(-r,-l),r),d=g*(g+2*l)+h):(f=Math.max(0,-(a*r+o)),g=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+g*(g+2*l)+h);else g=a>0?-r:r,f=Math.max(0,-(a*g+o)),d=-f*f+g*(g+2*l)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(uf).addScaledVector(Sc,g),d}intersectSphere(t,e){Tr.subVectors(t.center,this.origin);let n=Tr.dot(this.direction),s=Tr.dot(Tr)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,g=this.origin;return h>=0?(n=(t.min.x-g.x)*h,s=(t.max.x-g.x)*h):(n=(t.max.x-g.x)*h,s=(t.min.x-g.x)*h),u>=0?(r=(t.min.y-g.y)*u,a=(t.max.y-g.y)*u):(r=(t.max.y-g.y)*u,a=(t.min.y-g.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-g.z)*f,l=(t.max.z-g.z)*f):(o=(t.max.z-g.z)*f,l=(t.min.z-g.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,Tr)!==null}intersectTriangle(t,e,n,s,r){ff.subVectors(e,t),Ec.subVectors(n,t),df.crossVectors(ff,Ec);let a=this.direction.dot(df),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Zr.subVectors(this.origin,t);let l=o*this.direction.dot(Ec.crossVectors(Zr,Ec));if(l<0)return null;let h=o*this.direction.dot(ff.cross(Zr));if(h<0||l+h>a)return null;let u=-o*Zr.dot(df);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Nn=class i{constructor(t,e,n,s,r,a,o,l,h,u,f,g,d,y,v,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h,u,f,g,d,y,v,p)}set(t,e,n,s,r,a,o,l,h,u,f,g,d,y,v,p){let x=this.elements;return x[0]=t,x[4]=e,x[8]=n,x[12]=s,x[1]=r,x[5]=a,x[9]=o,x[13]=l,x[2]=h,x[6]=u,x[10]=f,x[14]=g,x[3]=d,x[7]=y,x[11]=v,x[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/la.setFromMatrixColumn(t,0).length(),r=1/la.setFromMatrixColumn(t,1).length(),a=1/la.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),h=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let g=a*u,d=a*f,y=o*u,v=o*f;e[0]=l*u,e[4]=-l*f,e[8]=h,e[1]=d+y*h,e[5]=g-v*h,e[9]=-o*l,e[2]=v-g*h,e[6]=y+d*h,e[10]=a*l}else if(t.order==="YXZ"){let g=l*u,d=l*f,y=h*u,v=h*f;e[0]=g+v*o,e[4]=y*o-d,e[8]=a*h,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=d*o-y,e[6]=v+g*o,e[10]=a*l}else if(t.order==="ZXY"){let g=l*u,d=l*f,y=h*u,v=h*f;e[0]=g-v*o,e[4]=-a*f,e[8]=y+d*o,e[1]=d+y*o,e[5]=a*u,e[9]=v-g*o,e[2]=-a*h,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let g=a*u,d=a*f,y=o*u,v=o*f;e[0]=l*u,e[4]=y*h-d,e[8]=g*h+v,e[1]=l*f,e[5]=v*h+g,e[9]=d*h-y,e[2]=-h,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let g=a*l,d=a*h,y=o*l,v=o*h;e[0]=l*u,e[4]=v-g*f,e[8]=y*f+d,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-h*u,e[6]=d*f+y,e[10]=g-v*f}else if(t.order==="XZY"){let g=a*l,d=a*h,y=o*l,v=o*h;e[0]=l*u,e[4]=-f,e[8]=h*u,e[1]=g*f+v,e[5]=a*u,e[9]=d*f-y,e[2]=y*f-d,e[6]=o*u,e[10]=v*f+g}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Wy,t,Xy)}lookAt(t,e,n){let s=this.elements;return ws.subVectors(t,e),ws.lengthSq()===0&&(ws.z=1),ws.normalize(),Jr.crossVectors(n,ws),Jr.lengthSq()===0&&(Math.abs(n.z)===1?ws.x+=1e-4:ws.z+=1e-4,ws.normalize(),Jr.crossVectors(n,ws)),Jr.normalize(),wc.crossVectors(ws,Jr),s[0]=Jr.x,s[4]=wc.x,s[8]=ws.x,s[1]=Jr.y,s[5]=wc.y,s[9]=ws.y,s[2]=Jr.z,s[6]=wc.z,s[10]=ws.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],h=n[12],u=n[1],f=n[5],g=n[9],d=n[13],y=n[2],v=n[6],p=n[10],x=n[14],T=n[3],M=n[7],C=n[11],P=n[15],L=s[0],B=s[4],nt=s[8],A=s[12],w=s[1],rt=s[5],Et=s[9],re=s[13],tt=s[2],ft=s[6],Mt=s[10],Wt=s[14],Zt=s[3],At=s[7],Yt=s[11],le=s[15];return r[0]=a*L+o*w+l*tt+h*Zt,r[4]=a*B+o*rt+l*ft+h*At,r[8]=a*nt+o*Et+l*Mt+h*Yt,r[12]=a*A+o*re+l*Wt+h*le,r[1]=u*L+f*w+g*tt+d*Zt,r[5]=u*B+f*rt+g*ft+d*At,r[9]=u*nt+f*Et+g*Mt+d*Yt,r[13]=u*A+f*re+g*Wt+d*le,r[2]=y*L+v*w+p*tt+x*Zt,r[6]=y*B+v*rt+p*ft+x*At,r[10]=y*nt+v*Et+p*Mt+x*Yt,r[14]=y*A+v*re+p*Wt+x*le,r[3]=T*L+M*w+C*tt+P*Zt,r[7]=T*B+M*rt+C*ft+P*At,r[11]=T*nt+M*Et+C*Mt+P*Yt,r[15]=T*A+M*re+C*Wt+P*le,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],h=t[13],u=t[2],f=t[6],g=t[10],d=t[14],y=t[3],v=t[7],p=t[11],x=t[15];return y*(+r*l*f-s*h*f-r*o*g+n*h*g+s*o*d-n*l*d)+v*(+e*l*d-e*h*g+r*a*g-s*a*d+s*h*u-r*l*u)+p*(+e*h*f-e*o*d-r*a*f+n*a*d+r*o*u-n*h*u)+x*(-s*o*u-e*l*f+e*o*g+s*a*f-n*a*g+n*l*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8],f=t[9],g=t[10],d=t[11],y=t[12],v=t[13],p=t[14],x=t[15],T=f*p*h-v*g*h+v*l*d-o*p*d-f*l*x+o*g*x,M=y*g*h-u*p*h-y*l*d+a*p*d+u*l*x-a*g*x,C=u*v*h-y*f*h+y*o*d-a*v*d-u*o*x+a*f*x,P=y*f*l-u*v*l-y*o*g+a*v*g+u*o*p-a*f*p,L=e*T+n*M+s*C+r*P;if(L===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let B=1/L;return t[0]=T*B,t[1]=(v*g*r-f*p*r-v*s*d+n*p*d+f*s*x-n*g*x)*B,t[2]=(o*p*r-v*l*r+v*s*h-n*p*h-o*s*x+n*l*x)*B,t[3]=(f*l*r-o*g*r-f*s*h+n*g*h+o*s*d-n*l*d)*B,t[4]=M*B,t[5]=(u*p*r-y*g*r+y*s*d-e*p*d-u*s*x+e*g*x)*B,t[6]=(y*l*r-a*p*r-y*s*h+e*p*h+a*s*x-e*l*x)*B,t[7]=(a*g*r-u*l*r+u*s*h-e*g*h-a*s*d+e*l*d)*B,t[8]=C*B,t[9]=(y*f*r-u*v*r-y*n*d+e*v*d+u*n*x-e*f*x)*B,t[10]=(a*v*r-y*o*r+y*n*h-e*v*h-a*n*x+e*o*x)*B,t[11]=(u*o*r-a*f*r-u*n*h+e*f*h+a*n*d-e*o*d)*B,t[12]=P*B,t[13]=(u*v*s-y*f*s+y*n*g-e*v*g-u*n*p+e*f*p)*B,t[14]=(y*o*s-a*v*s-y*n*l+e*v*l+a*n*p-e*o*p)*B,t[15]=(a*f*s-u*o*s+u*n*l-e*f*l-a*n*g+e*o*g)*B,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,h=r*a,u=r*o;return this.set(h*a+n,h*o-s*l,h*l+s*o,0,h*o+s*l,u*o+n,u*l-s*a,0,h*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,h=r+r,u=a+a,f=o+o,g=r*h,d=r*u,y=r*f,v=a*u,p=a*f,x=o*f,T=l*h,M=l*u,C=l*f,P=n.x,L=n.y,B=n.z;return s[0]=(1-(v+x))*P,s[1]=(d+C)*P,s[2]=(y-M)*P,s[3]=0,s[4]=(d-C)*L,s[5]=(1-(g+x))*L,s[6]=(p+T)*L,s[7]=0,s[8]=(y+M)*B,s[9]=(p-T)*B,s[10]=(1-(g+v))*B,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=la.set(s[0],s[1],s[2]).length(),a=la.set(s[4],s[5],s[6]).length(),o=la.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],$s.copy(this);let h=1/r,u=1/a,f=1/o;return $s.elements[0]*=h,$s.elements[1]*=h,$s.elements[2]*=h,$s.elements[4]*=u,$s.elements[5]*=u,$s.elements[6]*=u,$s.elements[8]*=f,$s.elements[9]*=f,$s.elements[10]*=f,e.setFromRotationMatrix($s),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Lr){let l=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),g=(n+s)/(n-s),d,y;if(o===Lr)d=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===th)d=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=g,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Lr){let l=this.elements,h=1/(e-t),u=1/(n-s),f=1/(a-r),g=(e+t)*h,d=(n+s)*u,y,v;if(o===Lr)y=(a+r)*f,v=-2*f;else if(o===th)y=r*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*h,l[4]=0,l[8]=0,l[12]=-g,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=v,l[14]=-y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},la=new X,$s=new Nn,Wy=new X(0,0,0),Xy=new X(1,1,1),Jr=new X,wc=new X,ws=new X,t0=new Nn,e0=new ys,oh=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],h=s[5],u=s[9],f=s[2],g=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Li(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(g,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Li(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Li(g,-1,1)),Math.abs(g)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Li(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(g,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Li(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Li(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(g,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return t0.makeRotationFromQuaternion(t),this.setFromRotationMatrix(t0,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return e0.setFromEuler(this),this.setFromQuaternion(e0,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};oh.DEFAULT_ORDER="XYZ";var El=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},qy=0,n0=new X,ca=new ys,Ar=new Nn,Tc=new X,ul=new X,Yy=new X,$y=new ys,i0=new X(1,0,0),s0=new X(0,1,0),r0=new X(0,0,1),Zy={type:"added"},Jy={type:"removed"},vi=class i extends mr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:qy++}),this.uuid=pr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new X,e=new oh,n=new ys,s=new X(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Nn},normalMatrix:{value:new En}}),this.matrix=new Nn,this.matrixWorld=new Nn,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new El,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return ca.setFromAxisAngle(t,e),this.quaternion.multiply(ca),this}rotateOnWorldAxis(t,e){return ca.setFromAxisAngle(t,e),this.quaternion.premultiply(ca),this}rotateX(t){return this.rotateOnAxis(i0,t)}rotateY(t){return this.rotateOnAxis(s0,t)}rotateZ(t){return this.rotateOnAxis(r0,t)}translateOnAxis(t,e){return n0.copy(t).applyQuaternion(this.quaternion),this.position.add(n0.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(i0,t)}translateY(t){return this.translateOnAxis(s0,t)}translateZ(t){return this.translateOnAxis(r0,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Ar.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?Tc.copy(t):Tc.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),ul.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Ar.lookAt(ul,Tc,this.up):Ar.lookAt(Tc,ul,this.up),this.quaternion.setFromRotationMatrix(Ar),s&&(Ar.extractRotation(s.matrixWorld),ca.setFromRotationMatrix(Ar),this.quaternion.premultiply(ca.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Zy)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Jy)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Ar.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Ar.multiply(t.parent.matrixWorld)),t.applyMatrix4(Ar),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ul,t,Yy),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(ul,$y,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let h=0,u=l.length;h<u;h++){let f=l[h];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),h=a(t.textures),u=a(t.images),f=a(t.shapes),g=a(t.skeletons),d=a(t.animations),y=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),g.length>0&&(n.skeletons=g),d.length>0&&(n.animations=d),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let l=[];for(let h in o){let u=o[h];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};vi.DEFAULT_UP=new X(0,1,0);vi.DEFAULT_MATRIX_AUTO_UPDATE=!0;vi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Zs=new X,Rr=new X,pf=new X,Cr=new X,ha=new X,ua=new X,o0=new X,mf=new X,gf=new X,xf=new X,Ac=!1,va=class i{constructor(t=new X,e=new X,n=new X){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Zs.subVectors(t,e),s.cross(Zs);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Zs.subVectors(s,e),Rr.subVectors(n,e),pf.subVectors(t,e);let a=Zs.dot(Zs),o=Zs.dot(Rr),l=Zs.dot(pf),h=Rr.dot(Rr),u=Rr.dot(pf),f=a*h-o*o;if(f===0)return r.set(0,0,0),null;let g=1/f,d=(h*l-o*u)*g,y=(a*u-o*l)*g;return r.set(1-d-y,y,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Cr)===null?!1:Cr.x>=0&&Cr.y>=0&&Cr.x+Cr.y<=1}static getUV(t,e,n,s,r,a,o,l){return Ac===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ac=!0),this.getInterpolation(t,e,n,s,r,a,o,l)}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Cr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Cr.x),l.addScaledVector(a,Cr.y),l.addScaledVector(o,Cr.z),l)}static isFrontFacing(t,e,n,s){return Zs.subVectors(n,e),Rr.subVectors(t,e),Zs.cross(Rr).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Zs.subVectors(this.c,this.b),Rr.subVectors(this.a,this.b),Zs.cross(Rr).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Ac===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Ac=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;ha.subVectors(s,n),ua.subVectors(r,n),mf.subVectors(t,n);let l=ha.dot(mf),h=ua.dot(mf);if(l<=0&&h<=0)return e.copy(n);gf.subVectors(t,s);let u=ha.dot(gf),f=ua.dot(gf);if(u>=0&&f<=u)return e.copy(s);let g=l*f-u*h;if(g<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(ha,a);xf.subVectors(t,r);let d=ha.dot(xf),y=ua.dot(xf);if(y>=0&&d<=y)return e.copy(r);let v=d*h-l*y;if(v<=0&&h>=0&&y<=0)return o=h/(h-y),e.copy(n).addScaledVector(ua,o);let p=u*y-d*f;if(p<=0&&f-u>=0&&d-y>=0)return o0.subVectors(r,s),o=(f-u)/(f-u+(d-y)),e.copy(s).addScaledVector(o0,o);let x=1/(p+v+g);return a=v*x,o=g*x,e.copy(n).addScaledVector(ha,a).addScaledVector(ua,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ag={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},jr={h:0,s:0,l:0},Rc={h:0,s:0,l:0};function yf(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var fn=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=kn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wn.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Wn.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wn.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Wn.workingColorSpace){if(t=Ad(t,1),e=Li(e,0,1),n=Li(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=yf(a,r,t+1/3),this.g=yf(a,r,t),this.b=yf(a,r,t-1/3)}return Wn.toWorkingColorSpace(this,s),this}setStyle(t,e=kn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=kn){let n=ag[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wa(t.r),this.g=wa(t.g),this.b=wa(t.b),this}copyLinearToSRGB(t){return this.r=of(t.r),this.g=of(t.g),this.b=of(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=kn){return Wn.fromWorkingColorSpace(ts.copy(this),t),Math.round(Li(ts.r*255,0,255))*65536+Math.round(Li(ts.g*255,0,255))*256+Math.round(Li(ts.b*255,0,255))}getHexString(t=kn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wn.workingColorSpace){Wn.fromWorkingColorSpace(ts.copy(this),e);let n=ts.r,s=ts.g,r=ts.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,h,u=(o+a)/2;if(o===a)l=0,h=0;else{let f=a-o;switch(h=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=h,t.l=u,t}getRGB(t,e=Wn.workingColorSpace){return Wn.fromWorkingColorSpace(ts.copy(this),e),t.r=ts.r,t.g=ts.g,t.b=ts.b,t}getStyle(t=kn){Wn.fromWorkingColorSpace(ts.copy(this),t);let e=ts.r,n=ts.g,s=ts.b;return t!==kn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(jr),this.setHSL(jr.h+t,jr.s+e,jr.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(jr),t.getHSL(Rc);let n=gl(jr.h,Rc.h,e),s=gl(jr.s,Rc.s,e),r=gl(jr.l,Rc.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ts=new fn;fn.NAMES=ag;var jy=0,gr=class extends mr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:jy++}),this.uuid=pr(),this.name="",this.type="Material",this.blending=Ea,this.side=io,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=If,this.blendDst=Df,this.blendEquation=Eo,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fn(0,0,0),this.blendAlpha=0,this.depthFunc=$c,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Ym,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ia,this.stencilZFail=ia,this.stencilZPass=ia,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ea&&(n.blending=this.blending),this.side!==io&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==If&&(n.blendSrc=this.blendSrc),this.blendDst!==Df&&(n.blendDst=this.blendDst),this.blendEquation!==Eo&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==$c&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Ym&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ia&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ia&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ia&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},os=class extends gr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Sd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ai=new X,Cc=new de,Zn=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Ff,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Qr,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Cc.fromBufferAttribute(this,e),Cc.applyMatrix3(t),this.setXY(e,Cc.x,Cc.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.applyMatrix3(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.applyMatrix4(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.applyNormalMatrix(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.transformDirection(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=dr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=dr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=dr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=dr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=dr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array),r=Gn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Ff&&(t.usage=this.usage),t}};var ah=class extends Zn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var lh=class extends Zn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var en=class extends Zn{constructor(t,e,n){super(new Float32Array(t),e,n)}};var Ky=0,Fs=new Nn,_f=new vi,fa=new X,Ts=new es,fl=new es,ki=new X,Ln=class i extends mr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Ky++}),this.uuid=pr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(og(t)?lh:ah)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new En().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Fs.makeRotationFromQuaternion(t),this.applyMatrix4(Fs),this}rotateX(t){return Fs.makeRotationX(t),this.applyMatrix4(Fs),this}rotateY(t){return Fs.makeRotationY(t),this.applyMatrix4(Fs),this}rotateZ(t){return Fs.makeRotationZ(t),this.applyMatrix4(Fs),this}translate(t,e,n){return Fs.makeTranslation(t,e,n),this.applyMatrix4(Fs),this}scale(t,e,n){return Fs.makeScale(t,e,n),this.applyMatrix4(Fs),this}lookAt(t){return _f.lookAt(t),_f.updateMatrix(),this.applyMatrix4(_f.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(fa).negate(),this.translate(fa.x,fa.y,fa.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new en(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ts.setFromBufferAttribute(r),this.morphTargetsRelative?(ki.addVectors(this.boundingBox.min,Ts.min),this.boundingBox.expandByPoint(ki),ki.addVectors(this.boundingBox.max,Ts.max),this.boundingBox.expandByPoint(ki)):(this.boundingBox.expandByPoint(Ts.min),this.boundingBox.expandByPoint(Ts.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _s);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new X,1/0);return}if(t){let n=this.boundingSphere.center;if(Ts.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];fl.setFromBufferAttribute(o),this.morphTargetsRelative?(ki.addVectors(Ts.min,fl.min),Ts.expandByPoint(ki),ki.addVectors(Ts.max,fl.max),Ts.expandByPoint(ki)):(Ts.expandByPoint(fl.min),Ts.expandByPoint(fl.max))}Ts.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)ki.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(ki));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)ki.fromBufferAttribute(o,h),l&&(fa.fromBufferAttribute(t,h),ki.add(fa)),s=Math.max(s,n.distanceToSquared(ki))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Zn(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,h=[],u=[];for(let w=0;w<o;w++)h[w]=new X,u[w]=new X;let f=new X,g=new X,d=new X,y=new de,v=new de,p=new de,x=new X,T=new X;function M(w,rt,Et){f.fromArray(s,w*3),g.fromArray(s,rt*3),d.fromArray(s,Et*3),y.fromArray(a,w*2),v.fromArray(a,rt*2),p.fromArray(a,Et*2),g.sub(f),d.sub(f),v.sub(y),p.sub(y);let re=1/(v.x*p.y-p.x*v.y);isFinite(re)&&(x.copy(g).multiplyScalar(p.y).addScaledVector(d,-v.y).multiplyScalar(re),T.copy(d).multiplyScalar(v.x).addScaledVector(g,-p.x).multiplyScalar(re),h[w].add(x),h[rt].add(x),h[Et].add(x),u[w].add(T),u[rt].add(T),u[Et].add(T))}let C=this.groups;C.length===0&&(C=[{start:0,count:n.length}]);for(let w=0,rt=C.length;w<rt;++w){let Et=C[w],re=Et.start,tt=Et.count;for(let ft=re,Mt=re+tt;ft<Mt;ft+=3)M(n[ft+0],n[ft+1],n[ft+2])}let P=new X,L=new X,B=new X,nt=new X;function A(w){B.fromArray(r,w*3),nt.copy(B);let rt=h[w];P.copy(rt),P.sub(B.multiplyScalar(B.dot(rt))).normalize(),L.crossVectors(nt,rt);let re=L.dot(u[w])<0?-1:1;l[w*4]=P.x,l[w*4+1]=P.y,l[w*4+2]=P.z,l[w*4+3]=re}for(let w=0,rt=C.length;w<rt;++w){let Et=C[w],re=Et.start,tt=Et.count;for(let ft=re,Mt=re+tt;ft<Mt;ft+=3)A(n[ft+0]),A(n[ft+1]),A(n[ft+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Zn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let g=0,d=n.count;g<d;g++)n.setXYZ(g,0,0,0);let s=new X,r=new X,a=new X,o=new X,l=new X,h=new X,u=new X,f=new X;if(t)for(let g=0,d=t.count;g<d;g+=3){let y=t.getX(g+0),v=t.getX(g+1),p=t.getX(g+2);s.fromBufferAttribute(e,y),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,p),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,y),l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,p),o.add(u),l.add(u),h.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,h.x,h.y,h.z)}else for(let g=0,d=e.count;g<d;g+=3)s.fromBufferAttribute(e,g+0),r.fromBufferAttribute(e,g+1),a.fromBufferAttribute(e,g+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(g+0,u.x,u.y,u.z),n.setXYZ(g+1,u.x,u.y,u.z),n.setXYZ(g+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)ki.fromBufferAttribute(t,e),ki.normalize(),t.setXYZ(e,ki.x,ki.y,ki.z)}toNonIndexed(){function t(o,l){let h=o.array,u=o.itemSize,f=o.normalized,g=new h.constructor(l.length*u),d=0,y=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*u;for(let x=0;x<u;x++)g[y++]=h[d++]}return new Zn(g,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],h=t(l,n);e.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let l=[],h=r[o];for(let u=0,f=h.length;u<f;u++){let g=h[u],d=t(g,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let h=n[l];t.data.attributes[l]=h.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let h=this.morphAttributes[l],u=[];for(let f=0,g=h.length;f<g;f++){let d=h[f];u.push(d.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let h in s){let u=s[h];this.setAttribute(h,u.clone(e))}let r=t.morphAttributes;for(let h in r){let u=[],f=r[h];for(let g=0,d=f.length;g<d;g++)u.push(f[g].clone(e));this.morphAttributes[h]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let h=0,u=a.length;h<u;h++){let f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},a0=new Nn,Mo=new Co,Pc=new _s,l0=new X,da=new X,pa=new X,ma=new X,vf=new X,Lc=new X,Ic=new de,Dc=new de,Uc=new de,c0=new X,h0=new X,u0=new X,Nc=new X,Oc=new X,Ke=class extends vi{constructor(t=new Ln,e=new os){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){Lc.set(0,0,0);for(let l=0,h=r.length;l<h;l++){let u=o[l],f=r[l];u!==0&&(vf.fromBufferAttribute(f,t),a?Lc.addScaledVector(vf,u):Lc.addScaledVector(vf.sub(e),u))}e.add(Lc)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Pc.copy(n.boundingSphere),Pc.applyMatrix4(r),Mo.copy(t.ray).recast(t.near),!(Pc.containsPoint(Mo.origin)===!1&&(Mo.intersectSphere(Pc,l0)===null||Mo.origin.distanceToSquared(l0)>(t.far-t.near)**2))&&(a0.copy(r).invert(),Mo.copy(t.ray).applyMatrix4(a0),!(n.boundingBox!==null&&Mo.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,Mo)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,h=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,g=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,v=g.length;y<v;y++){let p=g[y],x=a[p.materialIndex],T=Math.max(p.start,d.start),M=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let C=T,P=M;C<P;C+=3){let L=o.getX(C),B=o.getX(C+1),nt=o.getX(C+2);s=Fc(this,x,t,n,h,u,f,L,B,nt),s&&(s.faceIndex=Math.floor(C/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let p=y,x=v;p<x;p+=3){let T=o.getX(p),M=o.getX(p+1),C=o.getX(p+2);s=Fc(this,a,t,n,h,u,f,T,M,C),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let y=0,v=g.length;y<v;y++){let p=g[y],x=a[p.materialIndex],T=Math.max(p.start,d.start),M=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let C=T,P=M;C<P;C+=3){let L=C,B=C+1,nt=C+2;s=Fc(this,x,t,n,h,u,f,L,B,nt),s&&(s.faceIndex=Math.floor(C/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let p=y,x=v;p<x;p+=3){let T=p,M=p+1,C=p+2;s=Fc(this,a,t,n,h,u,f,T,M,C),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function Qy(i,t,e,n,s,r,a,o){let l;if(t.side===xs?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===io,o),l===null)return null;Oc.copy(o),Oc.applyMatrix4(i.matrixWorld);let h=e.ray.origin.distanceTo(Oc);return h<e.near||h>e.far?null:{distance:h,point:Oc.clone(),object:i}}function Fc(i,t,e,n,s,r,a,o,l,h){i.getVertexPosition(o,da),i.getVertexPosition(l,pa),i.getVertexPosition(h,ma);let u=Qy(i,t,e,n,da,pa,ma,Nc);if(u){s&&(Ic.fromBufferAttribute(s,o),Dc.fromBufferAttribute(s,l),Uc.fromBufferAttribute(s,h),u.uv=va.getInterpolation(Nc,da,pa,ma,Ic,Dc,Uc,new de)),r&&(Ic.fromBufferAttribute(r,o),Dc.fromBufferAttribute(r,l),Uc.fromBufferAttribute(r,h),u.uv1=va.getInterpolation(Nc,da,pa,ma,Ic,Dc,Uc,new de),u.uv2=u.uv1),a&&(c0.fromBufferAttribute(a,o),h0.fromBufferAttribute(a,l),u0.fromBufferAttribute(a,h),u.normal=va.getInterpolation(Nc,da,pa,ma,c0,h0,u0,new X),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:l,c:h,normal:new X,materialIndex:0};va.getNormal(da,pa,ma,f.normal),u.face=f}return u}var Ri=class i extends Ln{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],h=[],u=[],f=[],g=0,d=0;y("z","y","x",-1,-1,n,e,t,a,r,0),y("z","y","x",1,-1,n,e,-t,a,r,1),y("x","z","y",1,1,t,n,e,s,a,2),y("x","z","y",1,-1,t,n,-e,s,a,3),y("x","y","z",1,-1,t,e,n,s,r,4),y("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new en(h,3)),this.setAttribute("normal",new en(u,3)),this.setAttribute("uv",new en(f,2));function y(v,p,x,T,M,C,P,L,B,nt,A){let w=C/B,rt=P/nt,Et=C/2,re=P/2,tt=L/2,ft=B+1,Mt=nt+1,Wt=0,Zt=0,At=new X;for(let Yt=0;Yt<Mt;Yt++){let le=Yt*rt-re;for(let Me=0;Me<ft;Me++){let Rt=Me*w-Et;At[v]=Rt*T,At[p]=le*M,At[x]=tt,h.push(At.x,At.y,At.z),At[v]=0,At[p]=0,At[x]=L>0?1:-1,u.push(At.x,At.y,At.z),f.push(Me/B),f.push(1-Yt/nt),Wt+=1}}for(let Yt=0;Yt<nt;Yt++)for(let le=0;le<B;le++){let Me=g+le+ft*Yt,Rt=g+le+ft*(Yt+1),Ct=g+(le+1)+ft*(Yt+1),ne=g+(le+1)+ft*Yt;l.push(Me,Rt,ne),l.push(Rt,Ct,ne),Zt+=6}o.addGroup(d,Zt,A),d+=Zt,g+=Wt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Pa(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ss(i){let t={};for(let e=0;e<i.length;e++){let n=Pa(i[e]);for(let s in n)t[s]=n[s]}return t}function t_(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function lg(i){return i.getRenderTarget()===null?i.outputColorSpace:Wn.workingColorSpace}var Wh={clone:Pa,merge:ss},e_=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,n_=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,tr=class extends gr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=e_,this.fragmentShader=n_,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Pa(t.uniforms),this.uniformsGroups=t_(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},ch=class extends vi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Nn,this.projectionMatrix=new Nn,this.projectionMatrixInverse=new Nn,this.coordinateSystem=Lr}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Gi=class extends ch{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=Sl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ml*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Sl*2*Math.atan(Math.tan(ml*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ml*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/h,s*=a.width/l,n*=a.height/h}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},ga=-90,xa=1,Vf=class extends vi{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Gi(ga,xa,t,e);s.layers=this.layers,this.add(s);let r=new Gi(ga,xa,t,e);r.layers=this.layers,this.add(r);let a=new Gi(ga,xa,t,e);a.layers=this.layers,this.add(a);let o=new Gi(ga,xa,t,e);o.layers=this.layers,this.add(o);let l=new Gi(ga,xa,t,e);l.layers=this.layers,this.add(l);let h=new Gi(ga,xa,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let h of e)this.remove(h);if(t===Lr)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===th)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,h,u]=this.children,f=t.getRenderTarget(),g=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),y=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(f,g,d),t.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},hh=class extends As{constructor(t,e,n,s,r,a,o,l,h,u){t=t!==void 0?t:[],e=e!==void 0?e:Aa,super(t,e,n,s,r,a,o,l,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Gf=class extends Dr{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(xl("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===Ro?kn:Bs),this.texture=new hh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:gs}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ri(5,5,5),r=new tr({name:"CubemapFromEquirect",uniforms:Pa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:xs,blending:to});r.uniforms.tEquirect.value=e;let a=new Ke(s,r),o=e.minFilter;return e.minFilter===Ml&&(e.minFilter=gs),new Vf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},Mf=new X,i_=new X,s_=new En,Js=class{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=Mf.subVectors(n,e).cross(i_.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(Mf),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||s_.getNormalMatrix(t),s=this.coplanarPoint(Mf).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},bo=new _s,Bc=new X,wl=class{constructor(t=new Js,e=new Js,n=new Js,s=new Js,r=new Js,a=new Js){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Lr){let n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],h=s[4],u=s[5],f=s[6],g=s[7],d=s[8],y=s[9],v=s[10],p=s[11],x=s[12],T=s[13],M=s[14],C=s[15];if(n[0].setComponents(l-r,g-h,p-d,C-x).normalize(),n[1].setComponents(l+r,g+h,p+d,C+x).normalize(),n[2].setComponents(l+a,g+u,p+y,C+T).normalize(),n[3].setComponents(l-a,g-u,p-y,C-T).normalize(),n[4].setComponents(l-o,g-f,p-v,C-M).normalize(),e===Lr)n[5].setComponents(l+o,g+f,p+v,C+M).normalize();else if(e===th)n[5].setComponents(o,f,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),bo.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),bo.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(bo)}intersectsSprite(t){return bo.center.set(0,0,0),bo.radius=.7071067811865476,bo.applyMatrix4(t.matrixWorld),this.intersectsSphere(bo)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Bc.x=s.normal.x>0?t.max.x:t.min.x,Bc.y=s.normal.y>0?t.max.y:t.min.y,Bc.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Bc)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function cg(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function r_(i,t){let e=t.isWebGL2,n=new WeakMap;function s(h,u){let f=h.array,g=h.usage,d=f.byteLength,y=i.createBuffer();i.bindBuffer(u,y),i.bufferData(u,f,g),h.onUploadCallback();let v;if(f instanceof Float32Array)v=i.FLOAT;else if(f instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)v=i.SHORT;else if(f instanceof Uint32Array)v=i.UNSIGNED_INT;else if(f instanceof Int32Array)v=i.INT;else if(f instanceof Int8Array)v=i.BYTE;else if(f instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:y,type:v,bytesPerElement:f.BYTES_PER_ELEMENT,version:h.version,size:d}}function r(h,u,f){let g=u.array,d=u._updateRange,y=u.updateRanges;if(i.bindBuffer(f,h),d.count===-1&&y.length===0&&i.bufferSubData(f,0,g),y.length!==0){for(let v=0,p=y.length;v<p;v++){let x=y[v];e?i.bufferSubData(f,x.start*g.BYTES_PER_ELEMENT,g,x.start,x.count):i.bufferSubData(f,x.start*g.BYTES_PER_ELEMENT,g.subarray(x.start,x.start+x.count))}u.clearUpdateRanges()}d.count!==-1&&(e?i.bufferSubData(f,d.offset*g.BYTES_PER_ELEMENT,g,d.offset,d.count):i.bufferSubData(f,d.offset*g.BYTES_PER_ELEMENT,g.subarray(d.offset,d.offset+d.count)),d.count=-1),u.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function o(h){h.isInterleavedBufferAttribute&&(h=h.data);let u=n.get(h);u&&(i.deleteBuffer(u.buffer),n.delete(h))}function l(h,u){if(h.isGLBufferAttribute){let g=n.get(h);(!g||g.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);let f=n.get(h);if(f===void 0)n.set(h,s(h,u));else if(f.version<h.version){if(f.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,h,u),f.version=h.version}}return{get:a,remove:o,update:l}}var vs=class i extends Ln{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),h=o+1,u=l+1,f=t/o,g=e/l,d=[],y=[],v=[],p=[];for(let x=0;x<u;x++){let T=x*g-a;for(let M=0;M<h;M++){let C=M*f-r;y.push(C,-T,0),v.push(0,0,1),p.push(M/o),p.push(1-x/l)}}for(let x=0;x<l;x++)for(let T=0;T<o;T++){let M=T+h*x,C=T+h*(x+1),P=T+1+h*(x+1),L=T+1+h*x;d.push(M,C,L),d.push(C,P,L)}this.setIndex(d),this.setAttribute("position",new en(y,3)),this.setAttribute("normal",new en(v,3)),this.setAttribute("uv",new en(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},o_=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,a_=`#ifdef USE_ALPHAHASH
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
#endif`,l_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,c_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,h_=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,u_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,f_=`#ifdef USE_AOMAP
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
#endif`,d_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,p_=`#ifdef USE_BATCHING
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
#endif`,m_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,g_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,x_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,y_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,__=`#ifdef USE_IRIDESCENCE
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
#endif`,v_=`#ifdef USE_BUMPMAP
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
#endif`,M_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,b_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,S_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,E_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,w_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,T_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,A_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,R_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,C_=`#define PI 3.141592653589793
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
} // validated`,P_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,L_=`vec3 transformedNormal = objectNormal;
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
#endif`,I_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,D_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,U_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,N_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,O_="gl_FragColor = linearToOutputTexel( gl_FragColor );",F_=`
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
}`,B_=`#ifdef USE_ENVMAP
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
#endif`,z_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,k_=`#ifdef USE_ENVMAP
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
#endif`,H_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,V_=`#ifdef USE_ENVMAP
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
#endif`,G_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,W_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,X_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,q_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Y_=`#ifdef USE_GRADIENTMAP
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
}`,$_=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,Z_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,J_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,j_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,K_=`uniform bool receiveShadow;
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
#endif`,Q_=`#ifdef USE_ENVMAP
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
#endif`,tv=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,ev=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,nv=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,iv=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sv=`PhysicalMaterial material;
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
#endif`,rv=`struct PhysicalMaterial {
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
}`,ov=`
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
#endif`,av=`#if defined( RE_IndirectDiffuse )
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
#endif`,lv=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cv=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,hv=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uv=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,fv=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,dv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,pv=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,mv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,gv=`#if defined( USE_POINTS_UV )
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
#endif`,xv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,yv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,_v=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,vv=`#ifdef USE_MORPHNORMALS
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
#endif`,Mv=`#ifdef USE_MORPHTARGETS
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
#endif`,bv=`#ifdef USE_MORPHTARGETS
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
#endif`,Sv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,Ev=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,wv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Tv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Av=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Rv=`#ifdef USE_NORMALMAP
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
#endif`,Cv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Pv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Lv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Iv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Dv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Uv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Nv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Ov=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Fv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Bv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,zv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,kv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Vv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Gv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Wv=`float getShadowMask() {
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
}`,Xv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,qv=`#ifdef USE_SKINNING
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
#endif`,Yv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,$v=`#ifdef USE_SKINNING
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
#endif`,Zv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Jv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,jv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Kv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,Qv=`#ifdef USE_TRANSMISSION
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
#endif`,tM=`#ifdef USE_TRANSMISSION
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
#endif`,eM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,nM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,iM=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,sM=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,rM=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,oM=`uniform sampler2D t2D;
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
}`,aM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,lM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,cM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,uM=`#include <common>
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
}`,fM=`#if DEPTH_PACKING == 3200
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
}`,dM=`#define DISTANCE
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
}`,pM=`#define DISTANCE
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
}`,mM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,gM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,xM=`uniform float scale;
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
}`,yM=`uniform vec3 diffuse;
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
}`,_M=`#include <common>
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
}`,vM=`uniform vec3 diffuse;
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
}`,MM=`#define LAMBERT
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
}`,bM=`#define LAMBERT
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
}`,SM=`#define MATCAP
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
}`,EM=`#define MATCAP
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
}`,wM=`#define NORMAL
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
}`,TM=`#define NORMAL
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
}`,AM=`#define PHONG
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
}`,RM=`#define PHONG
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
}`,CM=`#define STANDARD
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
}`,PM=`#define STANDARD
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
}`,LM=`#define TOON
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
}`,IM=`#define TOON
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
}`,DM=`uniform float size;
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
}`,UM=`uniform vec3 diffuse;
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
}`,NM=`#include <common>
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
}`,OM=`uniform vec3 color;
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
}`,FM=`uniform float rotation;
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
}`,BM=`uniform vec3 diffuse;
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
}`,Mn={alphahash_fragment:o_,alphahash_pars_fragment:a_,alphamap_fragment:l_,alphamap_pars_fragment:c_,alphatest_fragment:h_,alphatest_pars_fragment:u_,aomap_fragment:f_,aomap_pars_fragment:d_,batching_pars_vertex:p_,batching_vertex:m_,begin_vertex:g_,beginnormal_vertex:x_,bsdfs:y_,iridescence_fragment:__,bumpmap_pars_fragment:v_,clipping_planes_fragment:M_,clipping_planes_pars_fragment:b_,clipping_planes_pars_vertex:S_,clipping_planes_vertex:E_,color_fragment:w_,color_pars_fragment:T_,color_pars_vertex:A_,color_vertex:R_,common:C_,cube_uv_reflection_fragment:P_,defaultnormal_vertex:L_,displacementmap_pars_vertex:I_,displacementmap_vertex:D_,emissivemap_fragment:U_,emissivemap_pars_fragment:N_,colorspace_fragment:O_,colorspace_pars_fragment:F_,envmap_fragment:B_,envmap_common_pars_fragment:z_,envmap_pars_fragment:k_,envmap_pars_vertex:H_,envmap_physical_pars_fragment:Q_,envmap_vertex:V_,fog_vertex:G_,fog_pars_vertex:W_,fog_fragment:X_,fog_pars_fragment:q_,gradientmap_pars_fragment:Y_,lightmap_fragment:$_,lightmap_pars_fragment:Z_,lights_lambert_fragment:J_,lights_lambert_pars_fragment:j_,lights_pars_begin:K_,lights_toon_fragment:tv,lights_toon_pars_fragment:ev,lights_phong_fragment:nv,lights_phong_pars_fragment:iv,lights_physical_fragment:sv,lights_physical_pars_fragment:rv,lights_fragment_begin:ov,lights_fragment_maps:av,lights_fragment_end:lv,logdepthbuf_fragment:cv,logdepthbuf_pars_fragment:hv,logdepthbuf_pars_vertex:uv,logdepthbuf_vertex:fv,map_fragment:dv,map_pars_fragment:pv,map_particle_fragment:mv,map_particle_pars_fragment:gv,metalnessmap_fragment:xv,metalnessmap_pars_fragment:yv,morphcolor_vertex:_v,morphnormal_vertex:vv,morphtarget_pars_vertex:Mv,morphtarget_vertex:bv,normal_fragment_begin:Sv,normal_fragment_maps:Ev,normal_pars_fragment:wv,normal_pars_vertex:Tv,normal_vertex:Av,normalmap_pars_fragment:Rv,clearcoat_normal_fragment_begin:Cv,clearcoat_normal_fragment_maps:Pv,clearcoat_pars_fragment:Lv,iridescence_pars_fragment:Iv,opaque_fragment:Dv,packing:Uv,premultiplied_alpha_fragment:Nv,project_vertex:Ov,dithering_fragment:Fv,dithering_pars_fragment:Bv,roughnessmap_fragment:zv,roughnessmap_pars_fragment:kv,shadowmap_pars_fragment:Hv,shadowmap_pars_vertex:Vv,shadowmap_vertex:Gv,shadowmask_pars_fragment:Wv,skinbase_vertex:Xv,skinning_pars_vertex:qv,skinning_vertex:Yv,skinnormal_vertex:$v,specularmap_fragment:Zv,specularmap_pars_fragment:Jv,tonemapping_fragment:jv,tonemapping_pars_fragment:Kv,transmission_fragment:Qv,transmission_pars_fragment:tM,uv_pars_fragment:eM,uv_pars_vertex:nM,uv_vertex:iM,worldpos_vertex:sM,background_vert:rM,background_frag:oM,backgroundCube_vert:aM,backgroundCube_frag:lM,cube_vert:cM,cube_frag:hM,depth_vert:uM,depth_frag:fM,distanceRGBA_vert:dM,distanceRGBA_frag:pM,equirect_vert:mM,equirect_frag:gM,linedashed_vert:xM,linedashed_frag:yM,meshbasic_vert:_M,meshbasic_frag:vM,meshlambert_vert:MM,meshlambert_frag:bM,meshmatcap_vert:SM,meshmatcap_frag:EM,meshnormal_vert:wM,meshnormal_frag:TM,meshphong_vert:AM,meshphong_frag:RM,meshphysical_vert:CM,meshphysical_frag:PM,meshtoon_vert:LM,meshtoon_frag:IM,points_vert:DM,points_frag:UM,shadow_vert:NM,shadow_frag:OM,sprite_vert:FM,sprite_frag:BM},Ae={common:{diffuse:{value:new fn(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new En}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new En}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new En}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new En},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new En},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new En},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new En}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new En}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new En}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fn(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fn(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0},uvTransform:{value:new En}},sprite:{diffuse:{value:new fn(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}}},rs={basic:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:Mn.meshbasic_vert,fragmentShader:Mn.meshbasic_frag},lambert:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)}}]),vertexShader:Mn.meshlambert_vert,fragmentShader:Mn.meshlambert_frag},phong:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)},specular:{value:new fn(1118481)},shininess:{value:30}}]),vertexShader:Mn.meshphong_vert,fragmentShader:Mn.meshphong_frag},standard:{uniforms:ss([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Mn.meshphysical_vert,fragmentShader:Mn.meshphysical_frag},toon:{uniforms:ss([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)}}]),vertexShader:Mn.meshtoon_vert,fragmentShader:Mn.meshtoon_frag},matcap:{uniforms:ss([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:Mn.meshmatcap_vert,fragmentShader:Mn.meshmatcap_frag},points:{uniforms:ss([Ae.points,Ae.fog]),vertexShader:Mn.points_vert,fragmentShader:Mn.points_frag},dashed:{uniforms:ss([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Mn.linedashed_vert,fragmentShader:Mn.linedashed_frag},depth:{uniforms:ss([Ae.common,Ae.displacementmap]),vertexShader:Mn.depth_vert,fragmentShader:Mn.depth_frag},normal:{uniforms:ss([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:Mn.meshnormal_vert,fragmentShader:Mn.meshnormal_frag},sprite:{uniforms:ss([Ae.sprite,Ae.fog]),vertexShader:Mn.sprite_vert,fragmentShader:Mn.sprite_frag},background:{uniforms:{uvTransform:{value:new En},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Mn.background_vert,fragmentShader:Mn.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Mn.backgroundCube_vert,fragmentShader:Mn.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Mn.cube_vert,fragmentShader:Mn.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Mn.equirect_vert,fragmentShader:Mn.equirect_frag},distanceRGBA:{uniforms:ss([Ae.common,Ae.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Mn.distanceRGBA_vert,fragmentShader:Mn.distanceRGBA_frag},shadow:{uniforms:ss([Ae.lights,Ae.fog,{color:{value:new fn(0)},opacity:{value:1}}]),vertexShader:Mn.shadow_vert,fragmentShader:Mn.shadow_frag}};rs.physical={uniforms:ss([rs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new En},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new En},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new En},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new En},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new En},sheen:{value:0},sheenColor:{value:new fn(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new En},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new En},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new En},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new En},attenuationDistance:{value:0},attenuationColor:{value:new fn(0)},specularColor:{value:new fn(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new En},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new En},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new En}}]),vertexShader:Mn.meshphysical_vert,fragmentShader:Mn.meshphysical_frag};var zc={r:0,b:0,g:0};function zM(i,t,e,n,s,r,a){let o=new fn(0),l=r===!0?0:1,h,u,f=null,g=0,d=null;function y(p,x){let T=!1,M=x.isScene===!0?x.background:null;M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M===null?v(o,l):M&&M.isColor&&(v(M,1),T=!0);let C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||T)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===kh)?(u===void 0&&(u=new Ke(new Ri(1,1,1),new tr({name:"BackgroundCubeMaterial",uniforms:Pa(rs.backgroundCube.uniforms),vertexShader:rs.backgroundCube.vertexShader,fragmentShader:rs.backgroundCube.fragmentShader,side:xs,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,L,B){this.matrixWorld.copyPosition(B.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.toneMapped=Wn.getTransfer(M.colorSpace)!==oi,(f!==M||g!==M.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,f=M,g=M.version,d=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new Ke(new vs(2,2),new tr({name:"BackgroundMaterial",uniforms:Pa(rs.background.uniforms),vertexShader:rs.background.vertexShader,fragmentShader:rs.background.fragmentShader,side:io,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.toneMapped=Wn.getTransfer(M.colorSpace)!==oi,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||g!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=M,g=M.version,d=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null))}function v(p,x){p.getRGB(zc,lg(i)),n.buffers.color.setClear(zc.r,zc.g,zc.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(p,x=1){o.set(p),l=x,v(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,v(o,l)},render:y}}function kM(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=p(null),h=l,u=!1;function f(tt,ft,Mt,Wt,Zt){let At=!1;if(a){let Yt=v(Wt,Mt,ft);h!==Yt&&(h=Yt,d(h.object)),At=x(tt,Wt,Mt,Zt),At&&T(tt,Wt,Mt,Zt)}else{let Yt=ft.wireframe===!0;(h.geometry!==Wt.id||h.program!==Mt.id||h.wireframe!==Yt)&&(h.geometry=Wt.id,h.program=Mt.id,h.wireframe=Yt,At=!0)}Zt!==null&&e.update(Zt,i.ELEMENT_ARRAY_BUFFER),(At||u)&&(u=!1,nt(tt,ft,Mt,Wt),Zt!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Zt).buffer))}function g(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function d(tt){return n.isWebGL2?i.bindVertexArray(tt):r.bindVertexArrayOES(tt)}function y(tt){return n.isWebGL2?i.deleteVertexArray(tt):r.deleteVertexArrayOES(tt)}function v(tt,ft,Mt){let Wt=Mt.wireframe===!0,Zt=o[tt.id];Zt===void 0&&(Zt={},o[tt.id]=Zt);let At=Zt[ft.id];At===void 0&&(At={},Zt[ft.id]=At);let Yt=At[Wt];return Yt===void 0&&(Yt=p(g()),At[Wt]=Yt),Yt}function p(tt){let ft=[],Mt=[],Wt=[];for(let Zt=0;Zt<s;Zt++)ft[Zt]=0,Mt[Zt]=0,Wt[Zt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:ft,enabledAttributes:Mt,attributeDivisors:Wt,object:tt,attributes:{},index:null}}function x(tt,ft,Mt,Wt){let Zt=h.attributes,At=ft.attributes,Yt=0,le=Mt.getAttributes();for(let Me in le)if(le[Me].location>=0){let Ct=Zt[Me],ne=At[Me];if(ne===void 0&&(Me==="instanceMatrix"&&tt.instanceMatrix&&(ne=tt.instanceMatrix),Me==="instanceColor"&&tt.instanceColor&&(ne=tt.instanceColor)),Ct===void 0||Ct.attribute!==ne||ne&&Ct.data!==ne.data)return!0;Yt++}return h.attributesNum!==Yt||h.index!==Wt}function T(tt,ft,Mt,Wt){let Zt={},At=ft.attributes,Yt=0,le=Mt.getAttributes();for(let Me in le)if(le[Me].location>=0){let Ct=At[Me];Ct===void 0&&(Me==="instanceMatrix"&&tt.instanceMatrix&&(Ct=tt.instanceMatrix),Me==="instanceColor"&&tt.instanceColor&&(Ct=tt.instanceColor));let ne={};ne.attribute=Ct,Ct&&Ct.data&&(ne.data=Ct.data),Zt[Me]=ne,Yt++}h.attributes=Zt,h.attributesNum=Yt,h.index=Wt}function M(){let tt=h.newAttributes;for(let ft=0,Mt=tt.length;ft<Mt;ft++)tt[ft]=0}function C(tt){P(tt,0)}function P(tt,ft){let Mt=h.newAttributes,Wt=h.enabledAttributes,Zt=h.attributeDivisors;Mt[tt]=1,Wt[tt]===0&&(i.enableVertexAttribArray(tt),Wt[tt]=1),Zt[tt]!==ft&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](tt,ft),Zt[tt]=ft)}function L(){let tt=h.newAttributes,ft=h.enabledAttributes;for(let Mt=0,Wt=ft.length;Mt<Wt;Mt++)ft[Mt]!==tt[Mt]&&(i.disableVertexAttribArray(Mt),ft[Mt]=0)}function B(tt,ft,Mt,Wt,Zt,At,Yt){Yt===!0?i.vertexAttribIPointer(tt,ft,Mt,Zt,At):i.vertexAttribPointer(tt,ft,Mt,Wt,Zt,At)}function nt(tt,ft,Mt,Wt){if(n.isWebGL2===!1&&(tt.isInstancedMesh||Wt.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();let Zt=Wt.attributes,At=Mt.getAttributes(),Yt=ft.defaultAttributeValues;for(let le in At){let Me=At[le];if(Me.location>=0){let Rt=Zt[le];if(Rt===void 0&&(le==="instanceMatrix"&&tt.instanceMatrix&&(Rt=tt.instanceMatrix),le==="instanceColor"&&tt.instanceColor&&(Rt=tt.instanceColor)),Rt!==void 0){let Ct=Rt.normalized,ne=Rt.itemSize,Re=e.get(Rt);if(Re===void 0)continue;let Le=Re.buffer,We=Re.type,Ze=Re.bytesPerElement,De=n.isWebGL2===!0&&(We===i.INT||We===i.UNSIGNED_INT||Rt.gpuType===j0);if(Rt.isInterleavedBufferAttribute){let Be=Rt.data,K=Be.stride,Se=Rt.offset;if(Be.isInstancedInterleavedBuffer){for(let lt=0;lt<Me.locationSize;lt++)P(Me.location+lt,Be.meshPerAttribute);tt.isInstancedMesh!==!0&&Wt._maxInstanceCount===void 0&&(Wt._maxInstanceCount=Be.meshPerAttribute*Be.count)}else for(let lt=0;lt<Me.locationSize;lt++)C(Me.location+lt);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let lt=0;lt<Me.locationSize;lt++)B(Me.location+lt,ne/Me.locationSize,We,Ct,K*Ze,(Se+ne/Me.locationSize*lt)*Ze,De)}else{if(Rt.isInstancedBufferAttribute){for(let Be=0;Be<Me.locationSize;Be++)P(Me.location+Be,Rt.meshPerAttribute);tt.isInstancedMesh!==!0&&Wt._maxInstanceCount===void 0&&(Wt._maxInstanceCount=Rt.meshPerAttribute*Rt.count)}else for(let Be=0;Be<Me.locationSize;Be++)C(Me.location+Be);i.bindBuffer(i.ARRAY_BUFFER,Le);for(let Be=0;Be<Me.locationSize;Be++)B(Me.location+Be,ne/Me.locationSize,We,Ct,ne*Ze,ne/Me.locationSize*Be*Ze,De)}}else if(Yt!==void 0){let Ct=Yt[le];if(Ct!==void 0)switch(Ct.length){case 2:i.vertexAttrib2fv(Me.location,Ct);break;case 3:i.vertexAttrib3fv(Me.location,Ct);break;case 4:i.vertexAttrib4fv(Me.location,Ct);break;default:i.vertexAttrib1fv(Me.location,Ct)}}}}L()}function A(){Et();for(let tt in o){let ft=o[tt];for(let Mt in ft){let Wt=ft[Mt];for(let Zt in Wt)y(Wt[Zt].object),delete Wt[Zt];delete ft[Mt]}delete o[tt]}}function w(tt){if(o[tt.id]===void 0)return;let ft=o[tt.id];for(let Mt in ft){let Wt=ft[Mt];for(let Zt in Wt)y(Wt[Zt].object),delete Wt[Zt];delete ft[Mt]}delete o[tt.id]}function rt(tt){for(let ft in o){let Mt=o[ft];if(Mt[tt.id]===void 0)continue;let Wt=Mt[tt.id];for(let Zt in Wt)y(Wt[Zt].object),delete Wt[Zt];delete Mt[tt.id]}}function Et(){re(),u=!0,h!==l&&(h=l,d(h.object))}function re(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:Et,resetDefaultState:re,dispose:A,releaseStatesOfGeometry:w,releaseStatesOfProgram:rt,initAttributes:M,enableAttribute:C,disableUnusedAttributes:L}}function HM(i,t,e,n){let s=n.isWebGL2,r;function a(u){r=u}function o(u,f){i.drawArrays(r,u,f),e.update(f,r,1)}function l(u,f,g){if(g===0)return;let d,y;if(s)d=i,y="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),y="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[y](r,u,f,g),e.update(f,r,g)}function h(u,f,g){if(g===0)return;let d=t.get("WEBGL_multi_draw");if(d===null)for(let y=0;y<g;y++)this.render(u[y],f[y]);else{d.multiDrawArraysWEBGL(r,u,0,f,0,g);let y=0;for(let v=0;v<g;v++)y+=f[v];e.update(y,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=h}function VM(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let B=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(B.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(B){if(B==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";B="mediump"}return B==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);let h=a||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),g=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),y=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),T=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=g>0,C=a||t.has("OES_texture_float"),P=M&&C,L=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:g,maxTextureSize:d,maxCubemapSize:y,maxAttributes:v,maxVertexUniforms:p,maxVaryings:x,maxFragmentUniforms:T,vertexTextures:M,floatFragmentTextures:C,floatVertexTextures:P,maxSamples:L}}function GM(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Js,o=new En,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,g){let d=f.length!==0||g||n!==0||s;return s=g,n=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,g){e=u(f,g,0)},this.setState=function(f,g,d){let y=f.clippingPlanes,v=f.clipIntersection,p=f.clipShadows,x=i.get(f);if(!s||y===null||y.length===0||r&&!p)r?u(null):h();else{let T=r?0:n,M=T*4,C=x.clippingState||null;l.value=C,C=u(y,g,M,d);for(let P=0;P!==M;++P)C[P]=e[P];x.clippingState=C,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=T}};function h(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,g,d,y){let v=f!==null?f.length:0,p=null;if(v!==0){if(p=l.value,y!==!0||p===null){let x=d+v*4,T=g.matrixWorldInverse;o.getNormalMatrix(T),(p===null||p.length<x)&&(p=new Float32Array(x));for(let M=0,C=d;M!==v;++M,C+=4)a.copy(f[M]).applyMatrix4(T,o),a.normal.toArray(p,C),p[C+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function WM(i){let t=new WeakMap;function e(a,o){return o===Uf?a.mapping=Aa:o===Nf&&(a.mapping=Ra),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Uf||o===Nf)if(t.has(a)){let l=t.get(a).texture;return e(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let h=new Gf(l.height/2);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var uh=class extends ch{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},Ma=4,f0=[.125,.215,.35,.446,.526,.582],wo=20,bf=new uh,d0=new fn,Sf=null,Ef=0,wf=0,So=(1+Math.sqrt(5))/2,ya=1/So,p0=[new X(1,1,1),new X(-1,1,1),new X(1,1,-1),new X(-1,1,-1),new X(0,So,ya),new X(0,So,-ya),new X(ya,0,So),new X(-ya,0,So),new X(So,ya,0),new X(-So,ya,0)],fh=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){Sf=this._renderer.getRenderTarget(),Ef=this._renderer.getActiveCubeFace(),wf=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=x0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=g0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(Sf,Ef,wf),t.scissorTest=!1,kc(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Aa||t.mapping===Ra?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Sf=this._renderer.getRenderTarget(),Ef=this._renderer.getActiveCubeFace(),wf=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:gs,minFilter:gs,generateMipmaps:!1,type:bl,format:Ks,colorSpace:Ir,depthBuffer:!1},s=m0(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=m0(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=XM(r)),this._blurMaterial=qM(r,t,e)}return s}_compileMaterial(t){let e=new Ke(this._lodPlanes[0],t);this._renderer.compile(e,bf)}_sceneToCubeUV(t,e,n,s){let o=new Gi(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,g=u.toneMapping;u.getClearColor(d0),u.toneMapping=eo,u.autoClear=!1;let d=new os({name:"PMREM.Background",side:xs,depthWrite:!1,depthTest:!1}),y=new Ke(new Ri,d),v=!1,p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,v=!0):(d.color.copy(d0),v=!0);for(let x=0;x<6;x++){let T=x%3;T===0?(o.up.set(0,l[x],0),o.lookAt(h[x],0,0)):T===1?(o.up.set(0,0,l[x]),o.lookAt(0,h[x],0)):(o.up.set(0,l[x],0),o.lookAt(0,0,h[x]));let M=this._cubeSize;kc(s,T*M,x>2?M:0,M,M),u.setRenderTarget(s),v&&u.render(y,o),u.render(t,o)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=g,u.autoClear=f,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Aa||t.mapping===Ra;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=x0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=g0());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Ke(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;kc(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,bf)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=p0[(s-1)%p0.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let l=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,f=new Ke(this._lodPlanes[s],h),g=h.uniforms,d=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*wo-1),v=r/y,p=isFinite(r)?1+Math.floor(u*v):wo;p>wo&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${wo}`);let x=[],T=0;for(let B=0;B<wo;++B){let nt=B/v,A=Math.exp(-nt*nt/2);x.push(A),B===0?T+=A:B<p&&(T+=2*A)}for(let B=0;B<x.length;B++)x[B]=x[B]/T;g.envMap.value=t.texture,g.samples.value=p,g.weights.value=x,g.latitudinal.value=a==="latitudinal",o&&(g.poleAxis.value=o);let{_lodMax:M}=this;g.dTheta.value=y,g.mipInt.value=M-n;let C=this._sizeLods[s],P=3*C*(s>M-Ma?s-M+Ma:0),L=4*(this._cubeSize-C);kc(e,P,L,3*C,2*C),l.setRenderTarget(e),l.render(f,bf)}};function XM(i){let t=[],e=[],n=[],s=i,r=i-Ma+1+f0.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-Ma?l=f0[a-i+Ma-1]:a===0&&(l=0),n.push(l);let h=1/(o-2),u=-h,f=1+h,g=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,y=6,v=3,p=2,x=1,T=new Float32Array(v*y*d),M=new Float32Array(p*y*d),C=new Float32Array(x*y*d);for(let L=0;L<d;L++){let B=L%3*2/3-1,nt=L>2?0:-1,A=[B,nt,0,B+2/3,nt,0,B+2/3,nt+1,0,B,nt,0,B+2/3,nt+1,0,B,nt+1,0];T.set(A,v*y*L),M.set(g,p*y*L);let w=[L,L,L,L,L,L];C.set(w,x*y*L)}let P=new Ln;P.setAttribute("position",new Zn(T,v)),P.setAttribute("uv",new Zn(M,p)),P.setAttribute("faceIndex",new Zn(C,x)),t.push(P),s>Ma&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function m0(i,t,e){let n=new Dr(i,t,e);return n.texture.mapping=kh,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function kc(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function qM(i,t,e){let n=new Float32Array(wo),s=new X(0,1,0);return new tr({name:"SphericalGaussianBlur",defines:{n:wo,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:Rd(),fragmentShader:`

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
		`,blending:to,depthTest:!1,depthWrite:!1})}function g0(){return new tr({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:Rd(),fragmentShader:`

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
		`,blending:to,depthTest:!1,depthWrite:!1})}function x0(){return new tr({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:Rd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:to,depthTest:!1,depthWrite:!1})}function Rd(){return`

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
	`}function YM(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let l=o.mapping,h=l===Uf||l===Nf,u=l===Aa||l===Ra;if(h||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new fh(i)),f=h?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{let f=o.image;if(h&&f&&f.height>0||u&&f&&s(f)){e===null&&(e=new fh(i));let g=h?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,g),o.addEventListener("dispose",r),g.texture}else return null}}}return o}function s(o){let l=0,h=6;for(let u=0;u<h;u++)o[u]!==void 0&&l++;return l===h}function r(o){let l=o.target;l.removeEventListener("dispose",r);let h=t.get(l);h!==void 0&&(t.delete(l),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function $M(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function ZM(i,t,e,n){let s={},r=new WeakMap;function a(f){let g=f.target;g.index!==null&&t.remove(g.index);for(let y in g.attributes)t.remove(g.attributes[y]);for(let y in g.morphAttributes){let v=g.morphAttributes[y];for(let p=0,x=v.length;p<x;p++)t.remove(v[p])}g.removeEventListener("dispose",a),delete s[g.id];let d=r.get(g);d&&(t.remove(d),r.delete(g)),n.releaseStatesOfGeometry(g),g.isInstancedBufferGeometry===!0&&delete g._maxInstanceCount,e.memory.geometries--}function o(f,g){return s[g.id]===!0||(g.addEventListener("dispose",a),s[g.id]=!0,e.memory.geometries++),g}function l(f){let g=f.attributes;for(let y in g)t.update(g[y],i.ARRAY_BUFFER);let d=f.morphAttributes;for(let y in d){let v=d[y];for(let p=0,x=v.length;p<x;p++)t.update(v[p],i.ARRAY_BUFFER)}}function h(f){let g=[],d=f.index,y=f.attributes.position,v=0;if(d!==null){let T=d.array;v=d.version;for(let M=0,C=T.length;M<C;M+=3){let P=T[M+0],L=T[M+1],B=T[M+2];g.push(P,L,L,B,B,P)}}else if(y!==void 0){let T=y.array;v=y.version;for(let M=0,C=T.length/3-1;M<C;M+=3){let P=M+0,L=M+1,B=M+2;g.push(P,L,L,B,B,P)}}else return;let p=new(og(g)?lh:ah)(g,1);p.version=v;let x=r.get(f);x&&t.remove(x),r.set(f,p)}function u(f){let g=r.get(f);if(g){let d=f.index;d!==null&&g.version<d.version&&h(f)}else h(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function JM(i,t,e,n){let s=n.isWebGL2,r;function a(d){r=d}let o,l;function h(d){o=d.type,l=d.bytesPerElement}function u(d,y){i.drawElements(r,y,o,d*l),e.update(y,r,1)}function f(d,y,v){if(v===0)return;let p,x;if(s)p=i,x="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),x="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[x](r,y,o,d*l,v),e.update(y,r,v)}function g(d,y,v){if(v===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<v;x++)this.render(d[x]/l,y[x]);else{p.multiDrawElementsWEBGL(r,y,0,o,d,0,v);let x=0;for(let T=0;T<v;T++)x+=y[T];e.update(x,r,1)}}this.setMode=a,this.setIndex=h,this.render=u,this.renderInstances=f,this.renderMultiDraw=g}function jM(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function KM(i,t){return i[0]-t[0]}function QM(i,t){return Math.abs(t[1])-Math.abs(i[1])}function tb(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,a=new Fn,o=[];for(let h=0;h<8;h++)o[h]=[h,0];function l(h,u,f){let g=h.morphTargetInfluences;if(t.isWebGL2===!0){let d=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,y=d!==void 0?d.length:0,v=r.get(u);if(v===void 0||v.count!==y){let tt=function(){Et.dispose(),r.delete(u),u.removeEventListener("dispose",tt)};v!==void 0&&v.texture.dispose();let T=u.morphAttributes.position!==void 0,M=u.morphAttributes.normal!==void 0,C=u.morphAttributes.color!==void 0,P=u.morphAttributes.position||[],L=u.morphAttributes.normal||[],B=u.morphAttributes.color||[],nt=0;T===!0&&(nt=1),M===!0&&(nt=2),C===!0&&(nt=3);let A=u.attributes.position.count*nt,w=1;A>t.maxTextureSize&&(w=Math.ceil(A/t.maxTextureSize),A=t.maxTextureSize);let rt=new Float32Array(A*w*4*y),Et=new rh(rt,A,w,y);Et.type=Qr,Et.needsUpdate=!0;let re=nt*4;for(let ft=0;ft<y;ft++){let Mt=P[ft],Wt=L[ft],Zt=B[ft],At=A*w*4*ft;for(let Yt=0;Yt<Mt.count;Yt++){let le=Yt*re;T===!0&&(a.fromBufferAttribute(Mt,Yt),rt[At+le+0]=a.x,rt[At+le+1]=a.y,rt[At+le+2]=a.z,rt[At+le+3]=0),M===!0&&(a.fromBufferAttribute(Wt,Yt),rt[At+le+4]=a.x,rt[At+le+5]=a.y,rt[At+le+6]=a.z,rt[At+le+7]=0),C===!0&&(a.fromBufferAttribute(Zt,Yt),rt[At+le+8]=a.x,rt[At+le+9]=a.y,rt[At+le+10]=a.z,rt[At+le+11]=Zt.itemSize===4?a.w:1)}}v={count:y,texture:Et,size:new de(A,w)},r.set(u,v),u.addEventListener("dispose",tt)}let p=0;for(let T=0;T<g.length;T++)p+=g[T];let x=u.morphTargetsRelative?1:1-p;f.getUniforms().setValue(i,"morphTargetBaseInfluence",x),f.getUniforms().setValue(i,"morphTargetInfluences",g),f.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{let d=g===void 0?0:g.length,y=n[u.id];if(y===void 0||y.length!==d){y=[];for(let M=0;M<d;M++)y[M]=[M,0];n[u.id]=y}for(let M=0;M<d;M++){let C=y[M];C[0]=M,C[1]=g[M]}y.sort(QM);for(let M=0;M<8;M++)M<d&&y[M][1]?(o[M][0]=y[M][0],o[M][1]=y[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(KM);let v=u.morphAttributes.position,p=u.morphAttributes.normal,x=0;for(let M=0;M<8;M++){let C=o[M],P=C[0],L=C[1];P!==Number.MAX_SAFE_INTEGER&&L?(v&&u.getAttribute("morphTarget"+M)!==v[P]&&u.setAttribute("morphTarget"+M,v[P]),p&&u.getAttribute("morphNormal"+M)!==p[P]&&u.setAttribute("morphNormal"+M,p[P]),s[M]=L,x+=L):(v&&u.hasAttribute("morphTarget"+M)===!0&&u.deleteAttribute("morphTarget"+M),p&&u.hasAttribute("morphNormal"+M)===!0&&u.deleteAttribute("morphNormal"+M),s[M]=0)}let T=u.morphTargetsRelative?1:1-x;f.getUniforms().setValue(i,"morphTargetBaseInfluence",T),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function eb(i,t,e,n){let s=new WeakMap;function r(l){let h=n.render.frame,u=l.geometry,f=t.get(l,u);if(s.get(f)!==h&&(t.update(f),s.set(f,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==h&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,h))),l.isSkinnedMesh){let g=l.skeleton;s.get(g)!==h&&(g.update(),s.set(g,h))}return f}function a(){s=new WeakMap}function o(l){let h=l.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}var dh=class extends As{constructor(t,e,n,s,r,a,o,l,h,u){if(u=u!==void 0?u:Ao,u!==Ao&&u!==Ca)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===Ao&&(n=Kr),n===void 0&&u===Ca&&(n=To),super(null,s,r,a,o,l,u,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Pi,this.minFilter=l!==void 0?l:Pi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},hg=new As,ug=new dh(1,1);ug.compareFunction=rg;var fg=new rh,dg=new Hf,pg=new hh,y0=[],_0=[],v0=new Float32Array(16),M0=new Float32Array(9),b0=new Float32Array(4);function Da(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=y0[s];if(r===void 0&&(r=new Float32Array(s),y0[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ii(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Di(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Xh(i,t){let e=_0[t];e===void 0&&(e=new Int32Array(t),_0[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function nb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function ib(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ii(e,t))return;i.uniform2fv(this.addr,t),Di(e,t)}}function sb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ii(e,t))return;i.uniform3fv(this.addr,t),Di(e,t)}}function rb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ii(e,t))return;i.uniform4fv(this.addr,t),Di(e,t)}}function ob(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ii(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Di(e,t)}else{if(Ii(e,n))return;b0.set(n),i.uniformMatrix2fv(this.addr,!1,b0),Di(e,n)}}function ab(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ii(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Di(e,t)}else{if(Ii(e,n))return;M0.set(n),i.uniformMatrix3fv(this.addr,!1,M0),Di(e,n)}}function lb(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ii(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Di(e,t)}else{if(Ii(e,n))return;v0.set(n),i.uniformMatrix4fv(this.addr,!1,v0),Di(e,n)}}function cb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function hb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ii(e,t))return;i.uniform2iv(this.addr,t),Di(e,t)}}function ub(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ii(e,t))return;i.uniform3iv(this.addr,t),Di(e,t)}}function fb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ii(e,t))return;i.uniform4iv(this.addr,t),Di(e,t)}}function db(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function pb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ii(e,t))return;i.uniform2uiv(this.addr,t),Di(e,t)}}function mb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ii(e,t))return;i.uniform3uiv(this.addr,t),Di(e,t)}}function gb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ii(e,t))return;i.uniform4uiv(this.addr,t),Di(e,t)}}function xb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?ug:hg;e.setTexture2D(t||r,s)}function yb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||dg,s)}function _b(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||pg,s)}function vb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||fg,s)}function Mb(i){switch(i){case 5126:return nb;case 35664:return ib;case 35665:return sb;case 35666:return rb;case 35674:return ob;case 35675:return ab;case 35676:return lb;case 5124:case 35670:return cb;case 35667:case 35671:return hb;case 35668:case 35672:return ub;case 35669:case 35673:return fb;case 5125:return db;case 36294:return pb;case 36295:return mb;case 36296:return gb;case 35678:case 36198:case 36298:case 36306:case 35682:return xb;case 35679:case 36299:case 36307:return yb;case 35680:case 36300:case 36308:case 36293:return _b;case 36289:case 36303:case 36311:case 36292:return vb}}function bb(i,t){i.uniform1fv(this.addr,t)}function Sb(i,t){let e=Da(t,this.size,2);i.uniform2fv(this.addr,e)}function Eb(i,t){let e=Da(t,this.size,3);i.uniform3fv(this.addr,e)}function wb(i,t){let e=Da(t,this.size,4);i.uniform4fv(this.addr,e)}function Tb(i,t){let e=Da(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function Ab(i,t){let e=Da(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Rb(i,t){let e=Da(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function Cb(i,t){i.uniform1iv(this.addr,t)}function Pb(i,t){i.uniform2iv(this.addr,t)}function Lb(i,t){i.uniform3iv(this.addr,t)}function Ib(i,t){i.uniform4iv(this.addr,t)}function Db(i,t){i.uniform1uiv(this.addr,t)}function Ub(i,t){i.uniform2uiv(this.addr,t)}function Nb(i,t){i.uniform3uiv(this.addr,t)}function Ob(i,t){i.uniform4uiv(this.addr,t)}function Fb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||hg,r[a])}function Bb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||dg,r[a])}function zb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||pg,r[a])}function kb(i,t,e){let n=this.cache,s=t.length,r=Xh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||fg,r[a])}function Hb(i){switch(i){case 5126:return bb;case 35664:return Sb;case 35665:return Eb;case 35666:return wb;case 35674:return Tb;case 35675:return Ab;case 35676:return Rb;case 5124:case 35670:return Cb;case 35667:case 35671:return Pb;case 35668:case 35672:return Lb;case 35669:case 35673:return Ib;case 5125:return Db;case 36294:return Ub;case 36295:return Nb;case 36296:return Ob;case 35678:case 36198:case 36298:case 36306:case 35682:return Fb;case 35679:case 36299:case 36307:return Bb;case 35680:case 36300:case 36308:case 36293:return zb;case 36289:case 36303:case 36311:case 36292:return kb}}var Wf=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=Mb(e.type)}},Xf=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Hb(e.type)}},qf=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},Tf=/(\w+)(\])?(\[|\.)?/g;function S0(i,t){i.seq.push(t),i.map[t.id]=t}function Vb(i,t,e){let n=i.name,s=n.length;for(Tf.lastIndex=0;;){let r=Tf.exec(n),a=Tf.lastIndex,o=r[1],l=r[2]==="]",h=r[3];if(l&&(o=o|0),h===void 0||h==="["&&a+2===s){S0(e,h===void 0?new Wf(o,i,t):new Xf(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new qf(o),S0(e,f)),e=f}}}var Ta=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Vb(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function E0(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Gb=37297,Wb=0;function Xb(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function qb(i){let t=Wn.getPrimaries(Wn.workingColorSpace),e=Wn.getPrimaries(i),n;switch(t===e?n="":t===Qc&&e===Kc?n="LinearDisplayP3ToLinearSRGB":t===Kc&&e===Qc&&(n="LinearSRGBToLinearDisplayP3"),i){case Ir:case Vh:return[n,"LinearTransferOETF"];case kn:case Td:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function w0(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Xb(i.getShaderSource(t),a)}else return s}function Yb(i,t){let e=qb(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function $b(i,t){let e;switch(t){case ey:e="Linear";break;case ny:e="Reinhard";break;case iy:e="OptimizedCineon";break;case Ed:e="ACESFilmic";break;case ry:e="AgX";break;case sy:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Zb(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(ba).join(`
`)}function Jb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(ba).join(`
`)}function jb(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Kb(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function ba(i){return i!==""}function T0(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function A0(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var Qb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Yf(i){return i.replace(Qb,eS)}var tS=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function eS(i,t){let e=Mn[t];if(e===void 0){let n=tS.get(t);if(n!==void 0)e=Mn[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Yf(e)}var nS=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function R0(i){return i.replace(nS,iS)}function iS(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function C0(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function sS(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===Z0?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===bd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Pr&&(t="SHADOWMAP_TYPE_VSM"),t}function rS(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Aa:case Ra:t="ENVMAP_TYPE_CUBE";break;case kh:t="ENVMAP_TYPE_CUBE_UV";break}return t}function oS(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Ra:t="ENVMAP_MODE_REFRACTION";break}return t}function aS(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case Sd:t="ENVMAP_BLENDING_MULTIPLY";break;case Q1:t="ENVMAP_BLENDING_MIX";break;case ty:t="ENVMAP_BLENDING_ADD";break}return t}function lS(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function cS(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=sS(e),h=rS(e),u=oS(e),f=aS(e),g=lS(e),d=e.isWebGL2?"":Zb(e),y=Jb(e),v=jb(r),p=s.createProgram(),x,T,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(ba).join(`
`),x.length>0&&(x+=`
`),T=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(ba).join(`
`),T.length>0&&(T+=`
`)):(x=[C0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(ba).join(`
`),T=[d,C0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",g?"#define CUBEUV_TEXEL_WIDTH "+g.texelWidth:"",g?"#define CUBEUV_TEXEL_HEIGHT "+g.texelHeight:"",g?"#define CUBEUV_MAX_MIP "+g.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==eo?"#define TONE_MAPPING":"",e.toneMapping!==eo?Mn.tonemapping_pars_fragment:"",e.toneMapping!==eo?$b("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Mn.colorspace_pars_fragment,Yb("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(ba).join(`
`)),a=Yf(a),a=T0(a,e),a=A0(a,e),o=Yf(o),o=T0(o,e),o=A0(o,e),a=R0(a),o=R0(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,x=[y,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,T=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===$m?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===$m?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+T);let C=M+x+a,P=M+T+o,L=E0(s,s.VERTEX_SHADER,C),B=E0(s,s.FRAGMENT_SHADER,P);s.attachShader(p,L),s.attachShader(p,B),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function nt(Et){if(i.debug.checkShaderErrors){let re=s.getProgramInfoLog(p).trim(),tt=s.getShaderInfoLog(L).trim(),ft=s.getShaderInfoLog(B).trim(),Mt=!0,Wt=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(Mt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,L,B);else{let Zt=w0(s,L,"vertex"),At=w0(s,B,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+re+`
`+Zt+`
`+At)}else re!==""?console.warn("THREE.WebGLProgram: Program Info Log:",re):(tt===""||ft==="")&&(Wt=!1);Wt&&(Et.diagnostics={runnable:Mt,programLog:re,vertexShader:{log:tt,prefix:x},fragmentShader:{log:ft,prefix:T}})}s.deleteShader(L),s.deleteShader(B),A=new Ta(s,p),w=Kb(s,p)}let A;this.getUniforms=function(){return A===void 0&&nt(this),A};let w;this.getAttributes=function(){return w===void 0&&nt(this),w};let rt=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return rt===!1&&(rt=s.getProgramParameter(p,Gb)),rt},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Wb++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=L,this.fragmentShader=B,this}var hS=0,$f=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Zf(t),e.set(t,n)),n}},Zf=class{constructor(t){this.id=hS++,this.code=t,this.usedTimes=0}};function uS(i,t,e,n,s,r,a){let o=new El,l=new $f,h=[],u=s.isWebGL2,f=s.logarithmicDepthBuffer,g=s.vertexTextures,d=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(A){return A===0?"uv":`uv${A}`}function p(A,w,rt,Et,re){let tt=Et.fog,ft=re.geometry,Mt=A.isMeshStandardMaterial?Et.environment:null,Wt=(A.isMeshStandardMaterial?e:t).get(A.envMap||Mt),Zt=Wt&&Wt.mapping===kh?Wt.image.height:null,At=y[A.type];A.precision!==null&&(d=s.getMaxPrecision(A.precision),d!==A.precision&&console.warn("THREE.WebGLProgram.getParameters:",A.precision,"not supported, using",d,"instead."));let Yt=ft.morphAttributes.position||ft.morphAttributes.normal||ft.morphAttributes.color,le=Yt!==void 0?Yt.length:0,Me=0;ft.morphAttributes.position!==void 0&&(Me=1),ft.morphAttributes.normal!==void 0&&(Me=2),ft.morphAttributes.color!==void 0&&(Me=3);let Rt,Ct,ne,Re;if(At){let He=rs[At];Rt=He.vertexShader,Ct=He.fragmentShader}else Rt=A.vertexShader,Ct=A.fragmentShader,l.update(A),ne=l.getVertexShaderID(A),Re=l.getFragmentShaderID(A);let Le=i.getRenderTarget(),We=re.isInstancedMesh===!0,Ze=re.isBatchedMesh===!0,De=!!A.map,Be=!!A.matcap,K=!!Wt,Se=!!A.aoMap,lt=!!A.lightMap,_e=!!A.bumpMap,Jt=!!A.normalMap,ke=!!A.displacementMap,be=!!A.emissiveMap,O=!!A.metalnessMap,I=!!A.roughnessMap,yt=A.anisotropy>0,ye=A.clearcoat>0,pe=A.iridescence>0,ue=A.sheen>0,Xe=A.transmission>0,qt=yt&&!!A.anisotropyMap,we=ye&&!!A.clearcoatMap,Je=ye&&!!A.clearcoatNormalMap,nn=ye&&!!A.clearcoatRoughnessMap,me=pe&&!!A.iridescenceMap,gn=pe&&!!A.iridescenceThicknessMap,G=ue&&!!A.sheenColorMap,fe=ue&&!!A.sheenRoughnessMap,ve=!!A.specularMap,et=!!A.specularColorMap,dt=!!A.specularIntensityMap,jt=Xe&&!!A.transmissionMap,Qt=Xe&&!!A.thicknessMap,te=!!A.gradientMap,ct=!!A.alphaMap,V=A.alphaTest>0,It=!!A.alphaHash,zt=!!A.extensions,oe=!!ft.attributes.uv1,ce=!!ft.attributes.uv2,Ue=!!ft.attributes.uv3,Kt=eo;return A.toneMapped&&(Le===null||Le.isXRRenderTarget===!0)&&(Kt=i.toneMapping),{isWebGL2:u,shaderID:At,shaderType:A.type,shaderName:A.name,vertexShader:Rt,fragmentShader:Ct,defines:A.defines,customVertexShaderID:ne,customFragmentShaderID:Re,isRawShaderMaterial:A.isRawShaderMaterial===!0,glslVersion:A.glslVersion,precision:d,batching:Ze,instancing:We,instancingColor:We&&re.instanceColor!==null,supportsVertexTextures:g,outputColorSpace:Le===null?i.outputColorSpace:Le.isXRRenderTarget===!0?Le.texture.colorSpace:Ir,map:De,matcap:Be,envMap:K,envMapMode:K&&Wt.mapping,envMapCubeUVHeight:Zt,aoMap:Se,lightMap:lt,bumpMap:_e,normalMap:Jt,displacementMap:g&&ke,emissiveMap:be,normalMapObjectSpace:Jt&&A.normalMapType===xy,normalMapTangentSpace:Jt&&A.normalMapType===Hh,metalnessMap:O,roughnessMap:I,anisotropy:yt,anisotropyMap:qt,clearcoat:ye,clearcoatMap:we,clearcoatNormalMap:Je,clearcoatRoughnessMap:nn,iridescence:pe,iridescenceMap:me,iridescenceThicknessMap:gn,sheen:ue,sheenColorMap:G,sheenRoughnessMap:fe,specularMap:ve,specularColorMap:et,specularIntensityMap:dt,transmission:Xe,transmissionMap:jt,thicknessMap:Qt,gradientMap:te,opaque:A.transparent===!1&&A.blending===Ea,alphaMap:ct,alphaTest:V,alphaHash:It,combine:A.combine,mapUv:De&&v(A.map.channel),aoMapUv:Se&&v(A.aoMap.channel),lightMapUv:lt&&v(A.lightMap.channel),bumpMapUv:_e&&v(A.bumpMap.channel),normalMapUv:Jt&&v(A.normalMap.channel),displacementMapUv:ke&&v(A.displacementMap.channel),emissiveMapUv:be&&v(A.emissiveMap.channel),metalnessMapUv:O&&v(A.metalnessMap.channel),roughnessMapUv:I&&v(A.roughnessMap.channel),anisotropyMapUv:qt&&v(A.anisotropyMap.channel),clearcoatMapUv:we&&v(A.clearcoatMap.channel),clearcoatNormalMapUv:Je&&v(A.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:nn&&v(A.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&v(A.iridescenceMap.channel),iridescenceThicknessMapUv:gn&&v(A.iridescenceThicknessMap.channel),sheenColorMapUv:G&&v(A.sheenColorMap.channel),sheenRoughnessMapUv:fe&&v(A.sheenRoughnessMap.channel),specularMapUv:ve&&v(A.specularMap.channel),specularColorMapUv:et&&v(A.specularColorMap.channel),specularIntensityMapUv:dt&&v(A.specularIntensityMap.channel),transmissionMapUv:jt&&v(A.transmissionMap.channel),thicknessMapUv:Qt&&v(A.thicknessMap.channel),alphaMapUv:ct&&v(A.alphaMap.channel),vertexTangents:!!ft.attributes.tangent&&(Jt||yt),vertexColors:A.vertexColors,vertexAlphas:A.vertexColors===!0&&!!ft.attributes.color&&ft.attributes.color.itemSize===4,vertexUv1s:oe,vertexUv2s:ce,vertexUv3s:Ue,pointsUvs:re.isPoints===!0&&!!ft.attributes.uv&&(De||ct),fog:!!tt,useFog:A.fog===!0,fogExp2:tt&&tt.isFogExp2,flatShading:A.flatShading===!0,sizeAttenuation:A.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:re.isSkinnedMesh===!0,morphTargets:ft.morphAttributes.position!==void 0,morphNormals:ft.morphAttributes.normal!==void 0,morphColors:ft.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:Me,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:A.dithering,shadowMapEnabled:i.shadowMap.enabled&&rt.length>0,shadowMapType:i.shadowMap.type,toneMapping:Kt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:De&&A.map.isVideoTexture===!0&&Wn.getTransfer(A.map.colorSpace)===oi,premultipliedAlpha:A.premultipliedAlpha,doubleSided:A.side===mn,flipSided:A.side===xs,useDepthPacking:A.depthPacking>=0,depthPacking:A.depthPacking||0,index0AttributeName:A.index0AttributeName,extensionDerivatives:zt&&A.extensions.derivatives===!0,extensionFragDepth:zt&&A.extensions.fragDepth===!0,extensionDrawBuffers:zt&&A.extensions.drawBuffers===!0,extensionShaderTextureLOD:zt&&A.extensions.shaderTextureLOD===!0,extensionClipCullDistance:zt&&A.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:A.customProgramCacheKey()}}function x(A){let w=[];if(A.shaderID?w.push(A.shaderID):(w.push(A.customVertexShaderID),w.push(A.customFragmentShaderID)),A.defines!==void 0)for(let rt in A.defines)w.push(rt),w.push(A.defines[rt]);return A.isRawShaderMaterial===!1&&(T(w,A),M(w,A),w.push(i.outputColorSpace)),w.push(A.customProgramCacheKey),w.join()}function T(A,w){A.push(w.precision),A.push(w.outputColorSpace),A.push(w.envMapMode),A.push(w.envMapCubeUVHeight),A.push(w.mapUv),A.push(w.alphaMapUv),A.push(w.lightMapUv),A.push(w.aoMapUv),A.push(w.bumpMapUv),A.push(w.normalMapUv),A.push(w.displacementMapUv),A.push(w.emissiveMapUv),A.push(w.metalnessMapUv),A.push(w.roughnessMapUv),A.push(w.anisotropyMapUv),A.push(w.clearcoatMapUv),A.push(w.clearcoatNormalMapUv),A.push(w.clearcoatRoughnessMapUv),A.push(w.iridescenceMapUv),A.push(w.iridescenceThicknessMapUv),A.push(w.sheenColorMapUv),A.push(w.sheenRoughnessMapUv),A.push(w.specularMapUv),A.push(w.specularColorMapUv),A.push(w.specularIntensityMapUv),A.push(w.transmissionMapUv),A.push(w.thicknessMapUv),A.push(w.combine),A.push(w.fogExp2),A.push(w.sizeAttenuation),A.push(w.morphTargetsCount),A.push(w.morphAttributeCount),A.push(w.numDirLights),A.push(w.numPointLights),A.push(w.numSpotLights),A.push(w.numSpotLightMaps),A.push(w.numHemiLights),A.push(w.numRectAreaLights),A.push(w.numDirLightShadows),A.push(w.numPointLightShadows),A.push(w.numSpotLightShadows),A.push(w.numSpotLightShadowsWithMaps),A.push(w.numLightProbes),A.push(w.shadowMapType),A.push(w.toneMapping),A.push(w.numClippingPlanes),A.push(w.numClipIntersection),A.push(w.depthPacking)}function M(A,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),A.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),A.push(o.mask)}function C(A){let w=y[A.type],rt;if(w){let Et=rs[w];rt=Wh.clone(Et.uniforms)}else rt=A.uniforms;return rt}function P(A,w){let rt;for(let Et=0,re=h.length;Et<re;Et++){let tt=h[Et];if(tt.cacheKey===w){rt=tt,++rt.usedTimes;break}}return rt===void 0&&(rt=new cS(i,w,A,r),h.push(rt)),rt}function L(A){if(--A.usedTimes===0){let w=h.indexOf(A);h[w]=h[h.length-1],h.pop(),A.destroy()}}function B(A){l.remove(A)}function nt(){l.dispose()}return{getParameters:p,getProgramCacheKey:x,getUniforms:C,acquireProgram:P,releaseProgram:L,releaseShaderCache:B,programs:h,dispose:nt}}function fS(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function dS(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function P0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function L0(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,g,d,y,v,p){let x=i[t];return x===void 0?(x={id:f.id,object:f,geometry:g,material:d,groupOrder:y,renderOrder:f.renderOrder,z:v,group:p},i[t]=x):(x.id=f.id,x.object=f,x.geometry=g,x.material=d,x.groupOrder=y,x.renderOrder=f.renderOrder,x.z=v,x.group=p),t++,x}function o(f,g,d,y,v,p){let x=a(f,g,d,y,v,p);d.transmission>0?n.push(x):d.transparent===!0?s.push(x):e.push(x)}function l(f,g,d,y,v,p){let x=a(f,g,d,y,v,p);d.transmission>0?n.unshift(x):d.transparent===!0?s.unshift(x):e.unshift(x)}function h(f,g){e.length>1&&e.sort(f||dS),n.length>1&&n.sort(g||P0),s.length>1&&s.sort(g||P0)}function u(){for(let f=t,g=i.length;f<g;f++){let d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:h}}function pS(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new L0,i.set(n,[a])):s>=r.length?(a=new L0,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function mS(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new fn};break;case"SpotLight":e={position:new X,direction:new X,color:new fn,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new fn,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new fn,groundColor:new fn};break;case"RectAreaLight":e={color:new fn,position:new X,halfWidth:new X,halfHeight:new X};break}return i[t.id]=e,e}}}function gS(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var xS=0;function yS(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function _S(i,t){let e=new mS,n=gS(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)s.probe.push(new X);let r=new X,a=new Nn,o=new Nn;function l(u,f){let g=0,d=0,y=0;for(let Et=0;Et<9;Et++)s.probe[Et].set(0,0,0);let v=0,p=0,x=0,T=0,M=0,C=0,P=0,L=0,B=0,nt=0,A=0;u.sort(yS);let w=f===!0?Math.PI:1;for(let Et=0,re=u.length;Et<re;Et++){let tt=u[Et],ft=tt.color,Mt=tt.intensity,Wt=tt.distance,Zt=tt.shadow&&tt.shadow.map?tt.shadow.map.texture:null;if(tt.isAmbientLight)g+=ft.r*Mt*w,d+=ft.g*Mt*w,y+=ft.b*Mt*w;else if(tt.isLightProbe){for(let At=0;At<9;At++)s.probe[At].addScaledVector(tt.sh.coefficients[At],Mt);A++}else if(tt.isDirectionalLight){let At=e.get(tt);if(At.color.copy(tt.color).multiplyScalar(tt.intensity*w),tt.castShadow){let Yt=tt.shadow,le=n.get(tt);le.shadowBias=Yt.bias,le.shadowNormalBias=Yt.normalBias,le.shadowRadius=Yt.radius,le.shadowMapSize=Yt.mapSize,s.directionalShadow[v]=le,s.directionalShadowMap[v]=Zt,s.directionalShadowMatrix[v]=tt.shadow.matrix,C++}s.directional[v]=At,v++}else if(tt.isSpotLight){let At=e.get(tt);At.position.setFromMatrixPosition(tt.matrixWorld),At.color.copy(ft).multiplyScalar(Mt*w),At.distance=Wt,At.coneCos=Math.cos(tt.angle),At.penumbraCos=Math.cos(tt.angle*(1-tt.penumbra)),At.decay=tt.decay,s.spot[x]=At;let Yt=tt.shadow;if(tt.map&&(s.spotLightMap[B]=tt.map,B++,Yt.updateMatrices(tt),tt.castShadow&&nt++),s.spotLightMatrix[x]=Yt.matrix,tt.castShadow){let le=n.get(tt);le.shadowBias=Yt.bias,le.shadowNormalBias=Yt.normalBias,le.shadowRadius=Yt.radius,le.shadowMapSize=Yt.mapSize,s.spotShadow[x]=le,s.spotShadowMap[x]=Zt,L++}x++}else if(tt.isRectAreaLight){let At=e.get(tt);At.color.copy(ft).multiplyScalar(Mt),At.halfWidth.set(tt.width*.5,0,0),At.halfHeight.set(0,tt.height*.5,0),s.rectArea[T]=At,T++}else if(tt.isPointLight){let At=e.get(tt);if(At.color.copy(tt.color).multiplyScalar(tt.intensity*w),At.distance=tt.distance,At.decay=tt.decay,tt.castShadow){let Yt=tt.shadow,le=n.get(tt);le.shadowBias=Yt.bias,le.shadowNormalBias=Yt.normalBias,le.shadowRadius=Yt.radius,le.shadowMapSize=Yt.mapSize,le.shadowCameraNear=Yt.camera.near,le.shadowCameraFar=Yt.camera.far,s.pointShadow[p]=le,s.pointShadowMap[p]=Zt,s.pointShadowMatrix[p]=tt.shadow.matrix,P++}s.point[p]=At,p++}else if(tt.isHemisphereLight){let At=e.get(tt);At.skyColor.copy(tt.color).multiplyScalar(Mt*w),At.groundColor.copy(tt.groundColor).multiplyScalar(Mt*w),s.hemi[M]=At,M++}}T>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_FLOAT_1,s.rectAreaLTC2=Ae.LTC_FLOAT_2):(s.rectAreaLTC1=Ae.LTC_HALF_1,s.rectAreaLTC2=Ae.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_FLOAT_1,s.rectAreaLTC2=Ae.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_HALF_1,s.rectAreaLTC2=Ae.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=g,s.ambient[1]=d,s.ambient[2]=y;let rt=s.hash;(rt.directionalLength!==v||rt.pointLength!==p||rt.spotLength!==x||rt.rectAreaLength!==T||rt.hemiLength!==M||rt.numDirectionalShadows!==C||rt.numPointShadows!==P||rt.numSpotShadows!==L||rt.numSpotMaps!==B||rt.numLightProbes!==A)&&(s.directional.length=v,s.spot.length=x,s.rectArea.length=T,s.point.length=p,s.hemi.length=M,s.directionalShadow.length=C,s.directionalShadowMap.length=C,s.pointShadow.length=P,s.pointShadowMap.length=P,s.spotShadow.length=L,s.spotShadowMap.length=L,s.directionalShadowMatrix.length=C,s.pointShadowMatrix.length=P,s.spotLightMatrix.length=L+B-nt,s.spotLightMap.length=B,s.numSpotLightShadowsWithMaps=nt,s.numLightProbes=A,rt.directionalLength=v,rt.pointLength=p,rt.spotLength=x,rt.rectAreaLength=T,rt.hemiLength=M,rt.numDirectionalShadows=C,rt.numPointShadows=P,rt.numSpotShadows=L,rt.numSpotMaps=B,rt.numLightProbes=A,s.version=xS++)}function h(u,f){let g=0,d=0,y=0,v=0,p=0,x=f.matrixWorldInverse;for(let T=0,M=u.length;T<M;T++){let C=u[T];if(C.isDirectionalLight){let P=s.directional[g];P.direction.setFromMatrixPosition(C.matrixWorld),r.setFromMatrixPosition(C.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(x),g++}else if(C.isSpotLight){let P=s.spot[y];P.position.setFromMatrixPosition(C.matrixWorld),P.position.applyMatrix4(x),P.direction.setFromMatrixPosition(C.matrixWorld),r.setFromMatrixPosition(C.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(x),y++}else if(C.isRectAreaLight){let P=s.rectArea[v];P.position.setFromMatrixPosition(C.matrixWorld),P.position.applyMatrix4(x),o.identity(),a.copy(C.matrixWorld),a.premultiply(x),o.extractRotation(a),P.halfWidth.set(C.width*.5,0,0),P.halfHeight.set(0,C.height*.5,0),P.halfWidth.applyMatrix4(o),P.halfHeight.applyMatrix4(o),v++}else if(C.isPointLight){let P=s.point[d];P.position.setFromMatrixPosition(C.matrixWorld),P.position.applyMatrix4(x),d++}else if(C.isHemisphereLight){let P=s.hemi[p];P.direction.setFromMatrixPosition(C.matrixWorld),P.direction.transformDirection(x),p++}}}return{setup:l,setupView:h,state:s}}function I0(i,t){let e=new _S(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(f){n.push(f)}function o(f){s.push(f)}function l(f){e.setup(n,f)}function h(f){e.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o}}function vS(i,t){let e=new WeakMap;function n(r,a=0){let o=e.get(r),l;return o===void 0?(l=new I0(i,t),e.set(r,[l])):a>=o.length?(l=new I0(i,t),o.push(l)):l=o[a],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var Jf=class extends gr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=my,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},jf=class extends gr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},MS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,bS=`uniform sampler2D shadow_pass;
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
}`;function SS(i,t,e){let n=new wl,s=new de,r=new de,a=new Fn,o=new Jf({depthPacking:gy}),l=new jf,h={},u=e.maxTextureSize,f={[io]:xs,[xs]:io,[mn]:mn},g=new tr({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:MS,fragmentShader:bS}),d=g.clone();d.defines.HORIZONTAL_PASS=1;let y=new Ln;y.setAttribute("position",new Zn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Ke(y,g),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Z0;let x=this.type;this.render=function(L,B,nt){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||L.length===0)return;let A=i.getRenderTarget(),w=i.getActiveCubeFace(),rt=i.getActiveMipmapLevel(),Et=i.state;Et.setBlending(to),Et.buffers.color.setClear(1,1,1,1),Et.buffers.depth.setTest(!0),Et.setScissorTest(!1);let re=x!==Pr&&this.type===Pr,tt=x===Pr&&this.type!==Pr;for(let ft=0,Mt=L.length;ft<Mt;ft++){let Wt=L[ft],Zt=Wt.shadow;if(Zt===void 0){console.warn("THREE.WebGLShadowMap:",Wt,"has no shadow.");continue}if(Zt.autoUpdate===!1&&Zt.needsUpdate===!1)continue;s.copy(Zt.mapSize);let At=Zt.getFrameExtents();if(s.multiply(At),r.copy(Zt.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/At.x),s.x=r.x*At.x,Zt.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/At.y),s.y=r.y*At.y,Zt.mapSize.y=r.y)),Zt.map===null||re===!0||tt===!0){let le=this.type!==Pr?{minFilter:Pi,magFilter:Pi}:{};Zt.map!==null&&Zt.map.dispose(),Zt.map=new Dr(s.x,s.y,le),Zt.map.texture.name=Wt.name+".shadowMap",Zt.camera.updateProjectionMatrix()}i.setRenderTarget(Zt.map),i.clear();let Yt=Zt.getViewportCount();for(let le=0;le<Yt;le++){let Me=Zt.getViewport(le);a.set(r.x*Me.x,r.y*Me.y,r.x*Me.z,r.y*Me.w),Et.viewport(a),Zt.updateMatrices(Wt,le),n=Zt.getFrustum(),C(B,nt,Zt.camera,Wt,this.type)}Zt.isPointLightShadow!==!0&&this.type===Pr&&T(Zt,nt),Zt.needsUpdate=!1}x=this.type,p.needsUpdate=!1,i.setRenderTarget(A,w,rt)};function T(L,B){let nt=t.update(v);g.defines.VSM_SAMPLES!==L.blurSamples&&(g.defines.VSM_SAMPLES=L.blurSamples,d.defines.VSM_SAMPLES=L.blurSamples,g.needsUpdate=!0,d.needsUpdate=!0),L.mapPass===null&&(L.mapPass=new Dr(s.x,s.y)),g.uniforms.shadow_pass.value=L.map.texture,g.uniforms.resolution.value=L.mapSize,g.uniforms.radius.value=L.radius,i.setRenderTarget(L.mapPass),i.clear(),i.renderBufferDirect(B,null,nt,g,v,null),d.uniforms.shadow_pass.value=L.mapPass.texture,d.uniforms.resolution.value=L.mapSize,d.uniforms.radius.value=L.radius,i.setRenderTarget(L.map),i.clear(),i.renderBufferDirect(B,null,nt,d,v,null)}function M(L,B,nt,A){let w=null,rt=nt.isPointLight===!0?L.customDistanceMaterial:L.customDepthMaterial;if(rt!==void 0)w=rt;else if(w=nt.isPointLight===!0?l:o,i.localClippingEnabled&&B.clipShadows===!0&&Array.isArray(B.clippingPlanes)&&B.clippingPlanes.length!==0||B.displacementMap&&B.displacementScale!==0||B.alphaMap&&B.alphaTest>0||B.map&&B.alphaTest>0){let Et=w.uuid,re=B.uuid,tt=h[Et];tt===void 0&&(tt={},h[Et]=tt);let ft=tt[re];ft===void 0&&(ft=w.clone(),tt[re]=ft,B.addEventListener("dispose",P)),w=ft}if(w.visible=B.visible,w.wireframe=B.wireframe,A===Pr?w.side=B.shadowSide!==null?B.shadowSide:B.side:w.side=B.shadowSide!==null?B.shadowSide:f[B.side],w.alphaMap=B.alphaMap,w.alphaTest=B.alphaTest,w.map=B.map,w.clipShadows=B.clipShadows,w.clippingPlanes=B.clippingPlanes,w.clipIntersection=B.clipIntersection,w.displacementMap=B.displacementMap,w.displacementScale=B.displacementScale,w.displacementBias=B.displacementBias,w.wireframeLinewidth=B.wireframeLinewidth,w.linewidth=B.linewidth,nt.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let Et=i.properties.get(w);Et.light=nt}return w}function C(L,B,nt,A,w){if(L.visible===!1)return;if(L.layers.test(B.layers)&&(L.isMesh||L.isLine||L.isPoints)&&(L.castShadow||L.receiveShadow&&w===Pr)&&(!L.frustumCulled||n.intersectsObject(L))){L.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,L.matrixWorld);let re=t.update(L),tt=L.material;if(Array.isArray(tt)){let ft=re.groups;for(let Mt=0,Wt=ft.length;Mt<Wt;Mt++){let Zt=ft[Mt],At=tt[Zt.materialIndex];if(At&&At.visible){let Yt=M(L,At,A,w);L.onBeforeShadow(i,L,B,nt,re,Yt,Zt),i.renderBufferDirect(nt,null,re,Yt,L,Zt),L.onAfterShadow(i,L,B,nt,re,Yt,Zt)}}}else if(tt.visible){let ft=M(L,tt,A,w);L.onBeforeShadow(i,L,B,nt,re,ft,null),i.renderBufferDirect(nt,null,re,ft,L,null),L.onAfterShadow(i,L,B,nt,re,ft,null)}}let Et=L.children;for(let re=0,tt=Et.length;re<tt;re++)C(Et[re],B,nt,A,w)}function P(L){L.target.removeEventListener("dispose",P);for(let nt in h){let A=h[nt],w=L.target.uuid;w in A&&(A[w].dispose(),delete A[w])}}}function ES(i,t,e){let n=e.isWebGL2;function s(){let V=!1,It=new Fn,zt=null,oe=new Fn(0,0,0,0);return{setMask:function(ce){zt!==ce&&!V&&(i.colorMask(ce,ce,ce,ce),zt=ce)},setLocked:function(ce){V=ce},setClear:function(ce,Ue,Kt,Ne,He){He===!0&&(ce*=Ne,Ue*=Ne,Kt*=Ne),It.set(ce,Ue,Kt,Ne),oe.equals(It)===!1&&(i.clearColor(ce,Ue,Kt,Ne),oe.copy(It))},reset:function(){V=!1,zt=null,oe.set(-1,0,0,0)}}}function r(){let V=!1,It=null,zt=null,oe=null;return{setTest:function(ce){ce?Ze(i.DEPTH_TEST):De(i.DEPTH_TEST)},setMask:function(ce){It!==ce&&!V&&(i.depthMask(ce),It=ce)},setFunc:function(ce){if(zt!==ce){switch(ce){case q1:i.depthFunc(i.NEVER);break;case Y1:i.depthFunc(i.ALWAYS);break;case $1:i.depthFunc(i.LESS);break;case $c:i.depthFunc(i.LEQUAL);break;case Z1:i.depthFunc(i.EQUAL);break;case J1:i.depthFunc(i.GEQUAL);break;case j1:i.depthFunc(i.GREATER);break;case K1:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}zt=ce}},setLocked:function(ce){V=ce},setClear:function(ce){oe!==ce&&(i.clearDepth(ce),oe=ce)},reset:function(){V=!1,It=null,zt=null,oe=null}}}function a(){let V=!1,It=null,zt=null,oe=null,ce=null,Ue=null,Kt=null,Ne=null,He=null;return{setTest:function(Oe){V||(Oe?Ze(i.STENCIL_TEST):De(i.STENCIL_TEST))},setMask:function(Oe){It!==Oe&&!V&&(i.stencilMask(Oe),It=Oe)},setFunc:function(Oe,sn,hn){(zt!==Oe||oe!==sn||ce!==hn)&&(i.stencilFunc(Oe,sn,hn),zt=Oe,oe=sn,ce=hn)},setOp:function(Oe,sn,hn){(Ue!==Oe||Kt!==sn||Ne!==hn)&&(i.stencilOp(Oe,sn,hn),Ue=Oe,Kt=sn,Ne=hn)},setLocked:function(Oe){V=Oe},setClear:function(Oe){He!==Oe&&(i.clearStencil(Oe),He=Oe)},reset:function(){V=!1,It=null,zt=null,oe=null,ce=null,Ue=null,Kt=null,Ne=null,He=null}}}let o=new s,l=new r,h=new a,u=new WeakMap,f=new WeakMap,g={},d={},y=new WeakMap,v=[],p=null,x=!1,T=null,M=null,C=null,P=null,L=null,B=null,nt=null,A=new fn(0,0,0),w=0,rt=!1,Et=null,re=null,tt=null,ft=null,Mt=null,Wt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Zt=!1,At=0,Yt=i.getParameter(i.VERSION);Yt.indexOf("WebGL")!==-1?(At=parseFloat(/^WebGL (\d)/.exec(Yt)[1]),Zt=At>=1):Yt.indexOf("OpenGL ES")!==-1&&(At=parseFloat(/^OpenGL ES (\d)/.exec(Yt)[1]),Zt=At>=2);let le=null,Me={},Rt=i.getParameter(i.SCISSOR_BOX),Ct=i.getParameter(i.VIEWPORT),ne=new Fn().fromArray(Rt),Re=new Fn().fromArray(Ct);function Le(V,It,zt,oe){let ce=new Uint8Array(4),Ue=i.createTexture();i.bindTexture(V,Ue),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Kt=0;Kt<zt;Kt++)n&&(V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY)?i.texImage3D(It,0,i.RGBA,1,1,oe,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(It+Kt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return Ue}let We={};We[i.TEXTURE_2D]=Le(i.TEXTURE_2D,i.TEXTURE_2D,1),We[i.TEXTURE_CUBE_MAP]=Le(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(We[i.TEXTURE_2D_ARRAY]=Le(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),We[i.TEXTURE_3D]=Le(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),h.setClear(0),Ze(i.DEPTH_TEST),l.setFunc($c),be(!1),O(fm),Ze(i.CULL_FACE),Jt(to);function Ze(V){g[V]!==!0&&(i.enable(V),g[V]=!0)}function De(V){g[V]!==!1&&(i.disable(V),g[V]=!1)}function Be(V,It){return d[V]!==It?(i.bindFramebuffer(V,It),d[V]=It,n&&(V===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=It),V===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=It)),!0):!1}function K(V,It){let zt=v,oe=!1;if(V)if(zt=y.get(It),zt===void 0&&(zt=[],y.set(It,zt)),V.isWebGLMultipleRenderTargets){let ce=V.texture;if(zt.length!==ce.length||zt[0]!==i.COLOR_ATTACHMENT0){for(let Ue=0,Kt=ce.length;Ue<Kt;Ue++)zt[Ue]=i.COLOR_ATTACHMENT0+Ue;zt.length=ce.length,oe=!0}}else zt[0]!==i.COLOR_ATTACHMENT0&&(zt[0]=i.COLOR_ATTACHMENT0,oe=!0);else zt[0]!==i.BACK&&(zt[0]=i.BACK,oe=!0);oe&&(e.isWebGL2?i.drawBuffers(zt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(zt))}function Se(V){return p!==V?(i.useProgram(V),p=V,!0):!1}let lt={[Eo]:i.FUNC_ADD,[L1]:i.FUNC_SUBTRACT,[I1]:i.FUNC_REVERSE_SUBTRACT};if(n)lt[gm]=i.MIN,lt[xm]=i.MAX;else{let V=t.get("EXT_blend_minmax");V!==null&&(lt[gm]=V.MIN_EXT,lt[xm]=V.MAX_EXT)}let _e={[D1]:i.ZERO,[U1]:i.ONE,[N1]:i.SRC_COLOR,[If]:i.SRC_ALPHA,[H1]:i.SRC_ALPHA_SATURATE,[z1]:i.DST_COLOR,[F1]:i.DST_ALPHA,[O1]:i.ONE_MINUS_SRC_COLOR,[Df]:i.ONE_MINUS_SRC_ALPHA,[k1]:i.ONE_MINUS_DST_COLOR,[B1]:i.ONE_MINUS_DST_ALPHA,[V1]:i.CONSTANT_COLOR,[G1]:i.ONE_MINUS_CONSTANT_COLOR,[W1]:i.CONSTANT_ALPHA,[X1]:i.ONE_MINUS_CONSTANT_ALPHA};function Jt(V,It,zt,oe,ce,Ue,Kt,Ne,He,Oe){if(V===to){x===!0&&(De(i.BLEND),x=!1);return}if(x===!1&&(Ze(i.BLEND),x=!0),V!==P1){if(V!==T||Oe!==rt){if((M!==Eo||L!==Eo)&&(i.blendEquation(i.FUNC_ADD),M=Eo,L=Eo),Oe)switch(V){case Ea:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dm:i.blendFunc(i.ONE,i.ONE);break;case pm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mm:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case Ea:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case dm:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case pm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case mm:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}C=null,P=null,B=null,nt=null,A.set(0,0,0),w=0,T=V,rt=Oe}return}ce=ce||It,Ue=Ue||zt,Kt=Kt||oe,(It!==M||ce!==L)&&(i.blendEquationSeparate(lt[It],lt[ce]),M=It,L=ce),(zt!==C||oe!==P||Ue!==B||Kt!==nt)&&(i.blendFuncSeparate(_e[zt],_e[oe],_e[Ue],_e[Kt]),C=zt,P=oe,B=Ue,nt=Kt),(Ne.equals(A)===!1||He!==w)&&(i.blendColor(Ne.r,Ne.g,Ne.b,He),A.copy(Ne),w=He),T=V,rt=!1}function ke(V,It){V.side===mn?De(i.CULL_FACE):Ze(i.CULL_FACE);let zt=V.side===xs;It&&(zt=!zt),be(zt),V.blending===Ea&&V.transparent===!1?Jt(to):Jt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),l.setFunc(V.depthFunc),l.setTest(V.depthTest),l.setMask(V.depthWrite),o.setMask(V.colorWrite);let oe=V.stencilWrite;h.setTest(oe),oe&&(h.setMask(V.stencilWriteMask),h.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),h.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),yt(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?Ze(i.SAMPLE_ALPHA_TO_COVERAGE):De(i.SAMPLE_ALPHA_TO_COVERAGE)}function be(V){Et!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),Et=V)}function O(V){V!==R1?(Ze(i.CULL_FACE),V!==re&&(V===fm?i.cullFace(i.BACK):V===C1?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):De(i.CULL_FACE),re=V}function I(V){V!==tt&&(Zt&&i.lineWidth(V),tt=V)}function yt(V,It,zt){V?(Ze(i.POLYGON_OFFSET_FILL),(ft!==It||Mt!==zt)&&(i.polygonOffset(It,zt),ft=It,Mt=zt)):De(i.POLYGON_OFFSET_FILL)}function ye(V){V?Ze(i.SCISSOR_TEST):De(i.SCISSOR_TEST)}function pe(V){V===void 0&&(V=i.TEXTURE0+Wt-1),le!==V&&(i.activeTexture(V),le=V)}function ue(V,It,zt){zt===void 0&&(le===null?zt=i.TEXTURE0+Wt-1:zt=le);let oe=Me[zt];oe===void 0&&(oe={type:void 0,texture:void 0},Me[zt]=oe),(oe.type!==V||oe.texture!==It)&&(le!==zt&&(i.activeTexture(zt),le=zt),i.bindTexture(V,It||We[V]),oe.type=V,oe.texture=It)}function Xe(){let V=Me[le];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function qt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function we(){try{i.compressedTexImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Je(){try{i.texSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function nn(){try{i.texSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function me(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function gn(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function G(){try{i.texStorage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function fe(){try{i.texStorage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ve(){try{i.texImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function et(){try{i.texImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function dt(V){ne.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),ne.copy(V))}function jt(V){Re.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),Re.copy(V))}function Qt(V,It){let zt=f.get(It);zt===void 0&&(zt=new WeakMap,f.set(It,zt));let oe=zt.get(V);oe===void 0&&(oe=i.getUniformBlockIndex(It,V.name),zt.set(V,oe))}function te(V,It){let oe=f.get(It).get(V);u.get(It)!==oe&&(i.uniformBlockBinding(It,oe,V.__bindingPointIndex),u.set(It,oe))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),g={},le=null,Me={},d={},y=new WeakMap,v=[],p=null,x=!1,T=null,M=null,C=null,P=null,L=null,B=null,nt=null,A=new fn(0,0,0),w=0,rt=!1,Et=null,re=null,tt=null,ft=null,Mt=null,ne.set(0,0,i.canvas.width,i.canvas.height),Re.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),h.reset()}return{buffers:{color:o,depth:l,stencil:h},enable:Ze,disable:De,bindFramebuffer:Be,drawBuffers:K,useProgram:Se,setBlending:Jt,setMaterial:ke,setFlipSided:be,setCullFace:O,setLineWidth:I,setPolygonOffset:yt,setScissorTest:ye,activeTexture:pe,bindTexture:ue,unbindTexture:Xe,compressedTexImage2D:qt,compressedTexImage3D:we,texImage2D:ve,texImage3D:et,updateUBOMapping:Qt,uniformBlockBinding:te,texStorage2D:G,texStorage3D:fe,texSubImage2D:Je,texSubImage3D:nn,compressedTexSubImage2D:me,compressedTexSubImage3D:gn,scissor:dt,viewport:jt,reset:ct}}function wS(i,t,e,n,s,r,a){let o=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap,f,g=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(O,I){return d?new OffscreenCanvas(O,I):nh("canvas")}function v(O,I,yt,ye){let pe=1;if((O.width>ye||O.height>ye)&&(pe=ye/Math.max(O.width,O.height)),pe<1||I===!0)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap){let ue=I?eh:Math.floor,Xe=ue(pe*O.width),qt=ue(pe*O.height);f===void 0&&(f=y(Xe,qt));let we=yt?y(Xe,qt):f;return we.width=Xe,we.height=qt,we.getContext("2d").drawImage(O,0,0,Xe,qt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+O.width+"x"+O.height+") to ("+Xe+"x"+qt+")."),we}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+O.width+"x"+O.height+")."),O;return O}function p(O){return zf(O.width)&&zf(O.height)}function x(O){return o?!1:O.wrapS!==js||O.wrapT!==js||O.minFilter!==Pi&&O.minFilter!==gs}function T(O,I){return O.generateMipmaps&&I&&O.minFilter!==Pi&&O.minFilter!==gs}function M(O){i.generateMipmap(O)}function C(O,I,yt,ye,pe=!1){if(o===!1)return I;if(O!==null){if(i[O]!==void 0)return i[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let ue=I;if(I===i.RED&&(yt===i.FLOAT&&(ue=i.R32F),yt===i.HALF_FLOAT&&(ue=i.R16F),yt===i.UNSIGNED_BYTE&&(ue=i.R8)),I===i.RED_INTEGER&&(yt===i.UNSIGNED_BYTE&&(ue=i.R8UI),yt===i.UNSIGNED_SHORT&&(ue=i.R16UI),yt===i.UNSIGNED_INT&&(ue=i.R32UI),yt===i.BYTE&&(ue=i.R8I),yt===i.SHORT&&(ue=i.R16I),yt===i.INT&&(ue=i.R32I)),I===i.RG&&(yt===i.FLOAT&&(ue=i.RG32F),yt===i.HALF_FLOAT&&(ue=i.RG16F),yt===i.UNSIGNED_BYTE&&(ue=i.RG8)),I===i.RGBA){let Xe=pe?jc:Wn.getTransfer(ye);yt===i.FLOAT&&(ue=i.RGBA32F),yt===i.HALF_FLOAT&&(ue=i.RGBA16F),yt===i.UNSIGNED_BYTE&&(ue=Xe===oi?i.SRGB8_ALPHA8:i.RGBA8),yt===i.UNSIGNED_SHORT_4_4_4_4&&(ue=i.RGBA4),yt===i.UNSIGNED_SHORT_5_5_5_1&&(ue=i.RGB5_A1)}return(ue===i.R16F||ue===i.R32F||ue===i.RG16F||ue===i.RG32F||ue===i.RGBA16F||ue===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ue}function P(O,I,yt){return T(O,yt)===!0||O.isFramebufferTexture&&O.minFilter!==Pi&&O.minFilter!==gs?Math.log2(Math.max(I.width,I.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?I.mipmaps.length:1}function L(O){return O===Pi||O===ym||O===ju?i.NEAREST:i.LINEAR}function B(O){let I=O.target;I.removeEventListener("dispose",B),A(I),I.isVideoTexture&&u.delete(I)}function nt(O){let I=O.target;I.removeEventListener("dispose",nt),rt(I)}function A(O){let I=n.get(O);if(I.__webglInit===void 0)return;let yt=O.source,ye=g.get(yt);if(ye){let pe=ye[I.__cacheKey];pe.usedTimes--,pe.usedTimes===0&&w(O),Object.keys(ye).length===0&&g.delete(yt)}n.remove(O)}function w(O){let I=n.get(O);i.deleteTexture(I.__webglTexture);let yt=O.source,ye=g.get(yt);delete ye[I.__cacheKey],a.memory.textures--}function rt(O){let I=O.texture,yt=n.get(O),ye=n.get(I);if(ye.__webglTexture!==void 0&&(i.deleteTexture(ye.__webglTexture),a.memory.textures--),O.depthTexture&&O.depthTexture.dispose(),O.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(yt.__webglFramebuffer[pe]))for(let ue=0;ue<yt.__webglFramebuffer[pe].length;ue++)i.deleteFramebuffer(yt.__webglFramebuffer[pe][ue]);else i.deleteFramebuffer(yt.__webglFramebuffer[pe]);yt.__webglDepthbuffer&&i.deleteRenderbuffer(yt.__webglDepthbuffer[pe])}else{if(Array.isArray(yt.__webglFramebuffer))for(let pe=0;pe<yt.__webglFramebuffer.length;pe++)i.deleteFramebuffer(yt.__webglFramebuffer[pe]);else i.deleteFramebuffer(yt.__webglFramebuffer);if(yt.__webglDepthbuffer&&i.deleteRenderbuffer(yt.__webglDepthbuffer),yt.__webglMultisampledFramebuffer&&i.deleteFramebuffer(yt.__webglMultisampledFramebuffer),yt.__webglColorRenderbuffer)for(let pe=0;pe<yt.__webglColorRenderbuffer.length;pe++)yt.__webglColorRenderbuffer[pe]&&i.deleteRenderbuffer(yt.__webglColorRenderbuffer[pe]);yt.__webglDepthRenderbuffer&&i.deleteRenderbuffer(yt.__webglDepthRenderbuffer)}if(O.isWebGLMultipleRenderTargets)for(let pe=0,ue=I.length;pe<ue;pe++){let Xe=n.get(I[pe]);Xe.__webglTexture&&(i.deleteTexture(Xe.__webglTexture),a.memory.textures--),n.remove(I[pe])}n.remove(I),n.remove(O)}let Et=0;function re(){Et=0}function tt(){let O=Et;return O>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+s.maxTextures),Et+=1,O}function ft(O){let I=[];return I.push(O.wrapS),I.push(O.wrapT),I.push(O.wrapR||0),I.push(O.magFilter),I.push(O.minFilter),I.push(O.anisotropy),I.push(O.internalFormat),I.push(O.format),I.push(O.type),I.push(O.generateMipmaps),I.push(O.premultiplyAlpha),I.push(O.flipY),I.push(O.unpackAlignment),I.push(O.colorSpace),I.join()}function Mt(O,I){let yt=n.get(O);if(O.isVideoTexture&&ke(O),O.isRenderTargetTexture===!1&&O.version>0&&yt.__version!==O.version){let ye=O.image;if(ye===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ye.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ne(yt,O,I);return}}e.bindTexture(i.TEXTURE_2D,yt.__webglTexture,i.TEXTURE0+I)}function Wt(O,I){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){ne(yt,O,I);return}e.bindTexture(i.TEXTURE_2D_ARRAY,yt.__webglTexture,i.TEXTURE0+I)}function Zt(O,I){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){ne(yt,O,I);return}e.bindTexture(i.TEXTURE_3D,yt.__webglTexture,i.TEXTURE0+I)}function At(O,I){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){Re(yt,O,I);return}e.bindTexture(i.TEXTURE_CUBE_MAP,yt.__webglTexture,i.TEXTURE0+I)}let Yt={[so]:i.REPEAT,[js]:i.CLAMP_TO_EDGE,[Of]:i.MIRRORED_REPEAT},le={[Pi]:i.NEAREST,[ym]:i.NEAREST_MIPMAP_NEAREST,[ju]:i.NEAREST_MIPMAP_LINEAR,[gs]:i.LINEAR,[oy]:i.LINEAR_MIPMAP_NEAREST,[Ml]:i.LINEAR_MIPMAP_LINEAR},Me={[yy]:i.NEVER,[Ey]:i.ALWAYS,[_y]:i.LESS,[rg]:i.LEQUAL,[vy]:i.EQUAL,[Sy]:i.GEQUAL,[My]:i.GREATER,[by]:i.NOTEQUAL};function Rt(O,I,yt){if(yt?(i.texParameteri(O,i.TEXTURE_WRAP_S,Yt[I.wrapS]),i.texParameteri(O,i.TEXTURE_WRAP_T,Yt[I.wrapT]),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,Yt[I.wrapR]),i.texParameteri(O,i.TEXTURE_MAG_FILTER,le[I.magFilter]),i.texParameteri(O,i.TEXTURE_MIN_FILTER,le[I.minFilter])):(i.texParameteri(O,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(O,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(I.wrapS!==js||I.wrapT!==js)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(O,i.TEXTURE_MAG_FILTER,L(I.magFilter)),i.texParameteri(O,i.TEXTURE_MIN_FILTER,L(I.minFilter)),I.minFilter!==Pi&&I.minFilter!==gs&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),I.compareFunction&&(i.texParameteri(O,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(O,i.TEXTURE_COMPARE_FUNC,Me[I.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let ye=t.get("EXT_texture_filter_anisotropic");if(I.magFilter===Pi||I.minFilter!==ju&&I.minFilter!==Ml||I.type===Qr&&t.has("OES_texture_float_linear")===!1||o===!1&&I.type===bl&&t.has("OES_texture_half_float_linear")===!1)return;(I.anisotropy>1||n.get(I).__currentAnisotropy)&&(i.texParameterf(O,ye.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(I.anisotropy,s.getMaxAnisotropy())),n.get(I).__currentAnisotropy=I.anisotropy)}}function Ct(O,I){let yt=!1;O.__webglInit===void 0&&(O.__webglInit=!0,I.addEventListener("dispose",B));let ye=I.source,pe=g.get(ye);pe===void 0&&(pe={},g.set(ye,pe));let ue=ft(I);if(ue!==O.__cacheKey){pe[ue]===void 0&&(pe[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,yt=!0),pe[ue].usedTimes++;let Xe=pe[O.__cacheKey];Xe!==void 0&&(pe[O.__cacheKey].usedTimes--,Xe.usedTimes===0&&w(I)),O.__cacheKey=ue,O.__webglTexture=pe[ue].texture}return yt}function ne(O,I,yt){let ye=i.TEXTURE_2D;(I.isDataArrayTexture||I.isCompressedArrayTexture)&&(ye=i.TEXTURE_2D_ARRAY),I.isData3DTexture&&(ye=i.TEXTURE_3D);let pe=Ct(O,I),ue=I.source;e.bindTexture(ye,O.__webglTexture,i.TEXTURE0+yt);let Xe=n.get(ue);if(ue.version!==Xe.__version||pe===!0){e.activeTexture(i.TEXTURE0+yt);let qt=Wn.getPrimaries(Wn.workingColorSpace),we=I.colorSpace===Bs?null:Wn.getPrimaries(I.colorSpace),Je=I.colorSpace===Bs||qt===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,I.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,I.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Je);let nn=x(I)&&p(I.image)===!1,me=v(I.image,nn,!1,s.maxTextureSize);me=be(I,me);let gn=p(me)||o,G=r.convert(I.format,I.colorSpace),fe=r.convert(I.type),ve=C(I.internalFormat,G,fe,I.colorSpace,I.isVideoTexture);Rt(ye,I,gn);let et,dt=I.mipmaps,jt=o&&I.isVideoTexture!==!0&&ve!==ig,Qt=Xe.__version===void 0||pe===!0,te=P(I,me,gn);if(I.isDepthTexture)ve=i.DEPTH_COMPONENT,o?I.type===Qr?ve=i.DEPTH_COMPONENT32F:I.type===Kr?ve=i.DEPTH_COMPONENT24:I.type===To?ve=i.DEPTH24_STENCIL8:ve=i.DEPTH_COMPONENT16:I.type===Qr&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),I.format===Ao&&ve===i.DEPTH_COMPONENT&&I.type!==wd&&I.type!==Kr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),I.type=Kr,fe=r.convert(I.type)),I.format===Ca&&ve===i.DEPTH_COMPONENT&&(ve=i.DEPTH_STENCIL,I.type!==To&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),I.type=To,fe=r.convert(I.type))),Qt&&(jt?e.texStorage2D(i.TEXTURE_2D,1,ve,me.width,me.height):e.texImage2D(i.TEXTURE_2D,0,ve,me.width,me.height,0,G,fe,null));else if(I.isDataTexture)if(dt.length>0&&gn){jt&&Qt&&e.texStorage2D(i.TEXTURE_2D,te,ve,dt[0].width,dt[0].height);for(let ct=0,V=dt.length;ct<V;ct++)et=dt[ct],jt?e.texSubImage2D(i.TEXTURE_2D,ct,0,0,et.width,et.height,G,fe,et.data):e.texImage2D(i.TEXTURE_2D,ct,ve,et.width,et.height,0,G,fe,et.data);I.generateMipmaps=!1}else jt?(Qt&&e.texStorage2D(i.TEXTURE_2D,te,ve,me.width,me.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,me.width,me.height,G,fe,me.data)):e.texImage2D(i.TEXTURE_2D,0,ve,me.width,me.height,0,G,fe,me.data);else if(I.isCompressedTexture)if(I.isCompressedArrayTexture){jt&&Qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,te,ve,dt[0].width,dt[0].height,me.depth);for(let ct=0,V=dt.length;ct<V;ct++)et=dt[ct],I.format!==Ks?G!==null?jt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ct,0,0,0,et.width,et.height,me.depth,G,et.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ct,ve,et.width,et.height,me.depth,0,et.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,ct,0,0,0,et.width,et.height,me.depth,G,fe,et.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ct,ve,et.width,et.height,me.depth,0,G,fe,et.data)}else{jt&&Qt&&e.texStorage2D(i.TEXTURE_2D,te,ve,dt[0].width,dt[0].height);for(let ct=0,V=dt.length;ct<V;ct++)et=dt[ct],I.format!==Ks?G!==null?jt?e.compressedTexSubImage2D(i.TEXTURE_2D,ct,0,0,et.width,et.height,G,et.data):e.compressedTexImage2D(i.TEXTURE_2D,ct,ve,et.width,et.height,0,et.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):jt?e.texSubImage2D(i.TEXTURE_2D,ct,0,0,et.width,et.height,G,fe,et.data):e.texImage2D(i.TEXTURE_2D,ct,ve,et.width,et.height,0,G,fe,et.data)}else if(I.isDataArrayTexture)jt?(Qt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,te,ve,me.width,me.height,me.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,G,fe,me.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ve,me.width,me.height,me.depth,0,G,fe,me.data);else if(I.isData3DTexture)jt?(Qt&&e.texStorage3D(i.TEXTURE_3D,te,ve,me.width,me.height,me.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,G,fe,me.data)):e.texImage3D(i.TEXTURE_3D,0,ve,me.width,me.height,me.depth,0,G,fe,me.data);else if(I.isFramebufferTexture){if(Qt)if(jt)e.texStorage2D(i.TEXTURE_2D,te,ve,me.width,me.height);else{let ct=me.width,V=me.height;for(let It=0;It<te;It++)e.texImage2D(i.TEXTURE_2D,It,ve,ct,V,0,G,fe,null),ct>>=1,V>>=1}}else if(dt.length>0&&gn){jt&&Qt&&e.texStorage2D(i.TEXTURE_2D,te,ve,dt[0].width,dt[0].height);for(let ct=0,V=dt.length;ct<V;ct++)et=dt[ct],jt?e.texSubImage2D(i.TEXTURE_2D,ct,0,0,G,fe,et):e.texImage2D(i.TEXTURE_2D,ct,ve,G,fe,et);I.generateMipmaps=!1}else jt?(Qt&&e.texStorage2D(i.TEXTURE_2D,te,ve,me.width,me.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,G,fe,me)):e.texImage2D(i.TEXTURE_2D,0,ve,G,fe,me);T(I,gn)&&M(ye),Xe.__version=ue.version,I.onUpdate&&I.onUpdate(I)}O.__version=I.version}function Re(O,I,yt){if(I.image.length!==6)return;let ye=Ct(O,I),pe=I.source;e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+yt);let ue=n.get(pe);if(pe.version!==ue.__version||ye===!0){e.activeTexture(i.TEXTURE0+yt);let Xe=Wn.getPrimaries(Wn.workingColorSpace),qt=I.colorSpace===Bs?null:Wn.getPrimaries(I.colorSpace),we=I.colorSpace===Bs||Xe===qt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,I.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,I.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let Je=I.isCompressedTexture||I.image[0].isCompressedTexture,nn=I.image[0]&&I.image[0].isDataTexture,me=[];for(let ct=0;ct<6;ct++)!Je&&!nn?me[ct]=v(I.image[ct],!1,!0,s.maxCubemapSize):me[ct]=nn?I.image[ct].image:I.image[ct],me[ct]=be(I,me[ct]);let gn=me[0],G=p(gn)||o,fe=r.convert(I.format,I.colorSpace),ve=r.convert(I.type),et=C(I.internalFormat,fe,ve,I.colorSpace),dt=o&&I.isVideoTexture!==!0,jt=ue.__version===void 0||ye===!0,Qt=P(I,gn,G);Rt(i.TEXTURE_CUBE_MAP,I,G);let te;if(Je){dt&&jt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Qt,et,gn.width,gn.height);for(let ct=0;ct<6;ct++){te=me[ct].mipmaps;for(let V=0;V<te.length;V++){let It=te[V];I.format!==Ks?fe!==null?dt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,0,0,It.width,It.height,fe,It.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,et,It.width,It.height,0,It.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,0,0,It.width,It.height,fe,ve,It.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,et,It.width,It.height,0,fe,ve,It.data)}}}else{te=I.mipmaps,dt&&jt&&(te.length>0&&Qt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Qt,et,me[0].width,me[0].height));for(let ct=0;ct<6;ct++)if(nn){dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,me[ct].width,me[ct].height,fe,ve,me[ct].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,et,me[ct].width,me[ct].height,0,fe,ve,me[ct].data);for(let V=0;V<te.length;V++){let zt=te[V].image[ct].image;dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,0,0,zt.width,zt.height,fe,ve,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,et,zt.width,zt.height,0,fe,ve,zt.data)}}else{dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,fe,ve,me[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,et,fe,ve,me[ct]);for(let V=0;V<te.length;V++){let It=te[V];dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,0,0,fe,ve,It.image[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,et,fe,ve,It.image[ct])}}}T(I,G)&&M(i.TEXTURE_CUBE_MAP),ue.__version=pe.version,I.onUpdate&&I.onUpdate(I)}O.__version=I.version}function Le(O,I,yt,ye,pe,ue){let Xe=r.convert(yt.format,yt.colorSpace),qt=r.convert(yt.type),we=C(yt.internalFormat,Xe,qt,yt.colorSpace);if(!n.get(I).__hasExternalTextures){let nn=Math.max(1,I.width>>ue),me=Math.max(1,I.height>>ue);pe===i.TEXTURE_3D||pe===i.TEXTURE_2D_ARRAY?e.texImage3D(pe,ue,we,nn,me,I.depth,0,Xe,qt,null):e.texImage2D(pe,ue,we,nn,me,0,Xe,qt,null)}e.bindFramebuffer(i.FRAMEBUFFER,O),Jt(I)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ye,pe,n.get(yt).__webglTexture,0,_e(I)):(pe===i.TEXTURE_2D||pe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&pe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ye,pe,n.get(yt).__webglTexture,ue),e.bindFramebuffer(i.FRAMEBUFFER,null)}function We(O,I,yt){if(i.bindRenderbuffer(i.RENDERBUFFER,O),I.depthBuffer&&!I.stencilBuffer){let ye=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(yt||Jt(I)){let pe=I.depthTexture;pe&&pe.isDepthTexture&&(pe.type===Qr?ye=i.DEPTH_COMPONENT32F:pe.type===Kr&&(ye=i.DEPTH_COMPONENT24));let ue=_e(I);Jt(I)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ue,ye,I.width,I.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,ye,I.width,I.height)}else i.renderbufferStorage(i.RENDERBUFFER,ye,I.width,I.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,O)}else if(I.depthBuffer&&I.stencilBuffer){let ye=_e(I);yt&&Jt(I)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ye,i.DEPTH24_STENCIL8,I.width,I.height):Jt(I)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ye,i.DEPTH24_STENCIL8,I.width,I.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,O)}else{let ye=I.isWebGLMultipleRenderTargets===!0?I.texture:[I.texture];for(let pe=0;pe<ye.length;pe++){let ue=ye[pe],Xe=r.convert(ue.format,ue.colorSpace),qt=r.convert(ue.type),we=C(ue.internalFormat,Xe,qt,ue.colorSpace),Je=_e(I);yt&&Jt(I)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,Je,we,I.width,I.height):Jt(I)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,Je,we,I.width,I.height):i.renderbufferStorage(i.RENDERBUFFER,we,I.width,I.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ze(O,I){if(I&&I.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,O),!(I.depthTexture&&I.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(I.depthTexture).__webglTexture||I.depthTexture.image.width!==I.width||I.depthTexture.image.height!==I.height)&&(I.depthTexture.image.width=I.width,I.depthTexture.image.height=I.height,I.depthTexture.needsUpdate=!0),Mt(I.depthTexture,0);let ye=n.get(I.depthTexture).__webglTexture,pe=_e(I);if(I.depthTexture.format===Ao)Jt(I)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ye,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ye,0);else if(I.depthTexture.format===Ca)Jt(I)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ye,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ye,0);else throw new Error("Unknown depthTexture format")}function De(O){let I=n.get(O),yt=O.isWebGLCubeRenderTarget===!0;if(O.depthTexture&&!I.__autoAllocateDepthBuffer){if(yt)throw new Error("target.depthTexture not supported in Cube render targets");Ze(I.__webglFramebuffer,O)}else if(yt){I.__webglDepthbuffer=[];for(let ye=0;ye<6;ye++)e.bindFramebuffer(i.FRAMEBUFFER,I.__webglFramebuffer[ye]),I.__webglDepthbuffer[ye]=i.createRenderbuffer(),We(I.__webglDepthbuffer[ye],O,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,I.__webglFramebuffer),I.__webglDepthbuffer=i.createRenderbuffer(),We(I.__webglDepthbuffer,O,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Be(O,I,yt){let ye=n.get(O);I!==void 0&&Le(ye.__webglFramebuffer,O,O.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),yt!==void 0&&De(O)}function K(O){let I=O.texture,yt=n.get(O),ye=n.get(I);O.addEventListener("dispose",nt),O.isWebGLMultipleRenderTargets!==!0&&(ye.__webglTexture===void 0&&(ye.__webglTexture=i.createTexture()),ye.__version=I.version,a.memory.textures++);let pe=O.isWebGLCubeRenderTarget===!0,ue=O.isWebGLMultipleRenderTargets===!0,Xe=p(O)||o;if(pe){yt.__webglFramebuffer=[];for(let qt=0;qt<6;qt++)if(o&&I.mipmaps&&I.mipmaps.length>0){yt.__webglFramebuffer[qt]=[];for(let we=0;we<I.mipmaps.length;we++)yt.__webglFramebuffer[qt][we]=i.createFramebuffer()}else yt.__webglFramebuffer[qt]=i.createFramebuffer()}else{if(o&&I.mipmaps&&I.mipmaps.length>0){yt.__webglFramebuffer=[];for(let qt=0;qt<I.mipmaps.length;qt++)yt.__webglFramebuffer[qt]=i.createFramebuffer()}else yt.__webglFramebuffer=i.createFramebuffer();if(ue)if(s.drawBuffers){let qt=O.texture;for(let we=0,Je=qt.length;we<Je;we++){let nn=n.get(qt[we]);nn.__webglTexture===void 0&&(nn.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&O.samples>0&&Jt(O)===!1){let qt=ue?I:[I];yt.__webglMultisampledFramebuffer=i.createFramebuffer(),yt.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer);for(let we=0;we<qt.length;we++){let Je=qt[we];yt.__webglColorRenderbuffer[we]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,yt.__webglColorRenderbuffer[we]);let nn=r.convert(Je.format,Je.colorSpace),me=r.convert(Je.type),gn=C(Je.internalFormat,nn,me,Je.colorSpace,O.isXRRenderTarget===!0),G=_e(O);i.renderbufferStorageMultisample(i.RENDERBUFFER,G,gn,O.width,O.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,yt.__webglColorRenderbuffer[we])}i.bindRenderbuffer(i.RENDERBUFFER,null),O.depthBuffer&&(yt.__webglDepthRenderbuffer=i.createRenderbuffer(),We(yt.__webglDepthRenderbuffer,O,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(pe){e.bindTexture(i.TEXTURE_CUBE_MAP,ye.__webglTexture),Rt(i.TEXTURE_CUBE_MAP,I,Xe);for(let qt=0;qt<6;qt++)if(o&&I.mipmaps&&I.mipmaps.length>0)for(let we=0;we<I.mipmaps.length;we++)Le(yt.__webglFramebuffer[qt][we],O,I,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+qt,we);else Le(yt.__webglFramebuffer[qt],O,I,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+qt,0);T(I,Xe)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ue){let qt=O.texture;for(let we=0,Je=qt.length;we<Je;we++){let nn=qt[we],me=n.get(nn);e.bindTexture(i.TEXTURE_2D,me.__webglTexture),Rt(i.TEXTURE_2D,nn,Xe),Le(yt.__webglFramebuffer,O,nn,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,0),T(nn,Xe)&&M(i.TEXTURE_2D)}e.unbindTexture()}else{let qt=i.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(o?qt=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(qt,ye.__webglTexture),Rt(qt,I,Xe),o&&I.mipmaps&&I.mipmaps.length>0)for(let we=0;we<I.mipmaps.length;we++)Le(yt.__webglFramebuffer[we],O,I,i.COLOR_ATTACHMENT0,qt,we);else Le(yt.__webglFramebuffer,O,I,i.COLOR_ATTACHMENT0,qt,0);T(I,Xe)&&M(qt),e.unbindTexture()}O.depthBuffer&&De(O)}function Se(O){let I=p(O)||o,yt=O.isWebGLMultipleRenderTargets===!0?O.texture:[O.texture];for(let ye=0,pe=yt.length;ye<pe;ye++){let ue=yt[ye];if(T(ue,I)){let Xe=O.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,qt=n.get(ue).__webglTexture;e.bindTexture(Xe,qt),M(Xe),e.unbindTexture()}}}function lt(O){if(o&&O.samples>0&&Jt(O)===!1){let I=O.isWebGLMultipleRenderTargets?O.texture:[O.texture],yt=O.width,ye=O.height,pe=i.COLOR_BUFFER_BIT,ue=[],Xe=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,qt=n.get(O),we=O.isWebGLMultipleRenderTargets===!0;if(we)for(let Je=0;Je<I.length;Je++)e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,qt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,qt.__webglFramebuffer);for(let Je=0;Je<I.length;Je++){ue.push(i.COLOR_ATTACHMENT0+Je),O.depthBuffer&&ue.push(Xe);let nn=qt.__ignoreDepthValues!==void 0?qt.__ignoreDepthValues:!1;if(nn===!1&&(O.depthBuffer&&(pe|=i.DEPTH_BUFFER_BIT),O.stencilBuffer&&(pe|=i.STENCIL_BUFFER_BIT)),we&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,qt.__webglColorRenderbuffer[Je]),nn===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Xe]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Xe])),we){let me=n.get(I[Je]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,me,0)}i.blitFramebuffer(0,0,yt,ye,0,0,yt,ye,pe,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ue)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),we)for(let Je=0;Je<I.length;Je++){e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.RENDERBUFFER,qt.__webglColorRenderbuffer[Je]);let nn=n.get(I[Je]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+Je,i.TEXTURE_2D,nn,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,qt.__webglMultisampledFramebuffer)}}function _e(O){return Math.min(s.maxSamples,O.samples)}function Jt(O){let I=n.get(O);return o&&O.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&I.__useRenderToTexture!==!1}function ke(O){let I=a.render.frame;u.get(O)!==I&&(u.set(O,I),O.update())}function be(O,I){let yt=O.colorSpace,ye=O.format,pe=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||O.format===Bf||yt!==Ir&&yt!==Bs&&(Wn.getTransfer(yt)===oi?o===!1?t.has("EXT_sRGB")===!0&&ye===Ks?(O.format=Bf,O.minFilter=gs,O.generateMipmaps=!1):I=ih.sRGBToLinear(I):(ye!==Ks||pe!==no)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",yt)),I}this.allocateTextureUnit=tt,this.resetTextureUnits=re,this.setTexture2D=Mt,this.setTexture2DArray=Wt,this.setTexture3D=Zt,this.setTextureCube=At,this.rebindTextures=Be,this.setupRenderTarget=K,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=lt,this.setupDepthRenderbuffer=De,this.setupFrameBufferTexture=Le,this.useMultisampledRTT=Jt}function TS(i,t,e){let n=e.isWebGL2;function s(r,a=Bs){let o,l=Wn.getTransfer(a);if(r===no)return i.UNSIGNED_BYTE;if(r===K0)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Q0)return i.UNSIGNED_SHORT_5_5_5_1;if(r===ay)return i.BYTE;if(r===ly)return i.SHORT;if(r===wd)return i.UNSIGNED_SHORT;if(r===j0)return i.INT;if(r===Kr)return i.UNSIGNED_INT;if(r===Qr)return i.FLOAT;if(r===bl)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===cy)return i.ALPHA;if(r===Ks)return i.RGBA;if(r===hy)return i.LUMINANCE;if(r===uy)return i.LUMINANCE_ALPHA;if(r===Ao)return i.DEPTH_COMPONENT;if(r===Ca)return i.DEPTH_STENCIL;if(r===Bf)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===fy)return i.RED;if(r===tg)return i.RED_INTEGER;if(r===dy)return i.RG;if(r===eg)return i.RG_INTEGER;if(r===ng)return i.RGBA_INTEGER;if(r===Ku||r===Qu||r===tf||r===ef)if(l===oi)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Ku)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Qu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===tf)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===ef)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Ku)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Qu)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===tf)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===ef)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===_m||r===vm||r===Mm||r===bm)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===_m)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===vm)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===Mm)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===bm)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===ig)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===Sm||r===Em)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===Sm)return l===oi?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===Em)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===wm||r===Tm||r===Am||r===Rm||r===Cm||r===Pm||r===Lm||r===Im||r===Dm||r===Um||r===Nm||r===Om||r===Fm||r===Bm)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===wm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===Tm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Am)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Rm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===Cm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Pm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Lm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Im)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Dm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Um)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Nm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Om)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Fm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Bm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===nf||r===zm||r===km)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===nf)return l===oi?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===zm)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===km)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===py||r===Hm||r===Vm||r===Gm)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===nf)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Hm)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Vm)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Gm)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===To?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Kf=class extends Gi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Pn=class extends vi{constructor(){super(),this.isGroup=!0,this.type="Group"}},AS={type:"move"},yl=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),x=this._getHandJoint(h,v);p!==null&&(x.matrix.fromArray(p.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=p.radius),x.visible=p!==null}let u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],g=u.position.distanceTo(f.position),d=.02,y=.005;h.inputState.pinching&&g>d+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&g<=d-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(AS)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Pn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Qf=class extends mr{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,h=null,u=null,f=null,g=null,d=null,y=null,v=e.getContextAttributes(),p=null,x=null,T=[],M=[],C=new de,P=null,L=new Gi;L.layers.enable(1),L.viewport=new Fn;let B=new Gi;B.layers.enable(2),B.viewport=new Fn;let nt=[L,B],A=new Kf;A.layers.enable(1),A.layers.enable(2);let w=null,rt=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Rt){let Ct=T[Rt];return Ct===void 0&&(Ct=new yl,T[Rt]=Ct),Ct.getTargetRaySpace()},this.getControllerGrip=function(Rt){let Ct=T[Rt];return Ct===void 0&&(Ct=new yl,T[Rt]=Ct),Ct.getGripSpace()},this.getHand=function(Rt){let Ct=T[Rt];return Ct===void 0&&(Ct=new yl,T[Rt]=Ct),Ct.getHandSpace()};function Et(Rt){let Ct=M.indexOf(Rt.inputSource);if(Ct===-1)return;let ne=T[Ct];ne!==void 0&&(ne.update(Rt.inputSource,Rt.frame,h||a),ne.dispatchEvent({type:Rt.type,data:Rt.inputSource}))}function re(){s.removeEventListener("select",Et),s.removeEventListener("selectstart",Et),s.removeEventListener("selectend",Et),s.removeEventListener("squeeze",Et),s.removeEventListener("squeezestart",Et),s.removeEventListener("squeezeend",Et),s.removeEventListener("end",re),s.removeEventListener("inputsourceschange",tt);for(let Rt=0;Rt<T.length;Rt++){let Ct=M[Rt];Ct!==null&&(M[Rt]=null,T[Rt].disconnect(Ct))}w=null,rt=null,t.setRenderTarget(p),d=null,g=null,f=null,s=null,x=null,Me.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Rt){r=Rt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Rt){o=Rt,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Rt){h=Rt},this.getBaseLayer=function(){return g!==null?g:d},this.getBinding=function(){return f},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(Rt){if(s=Rt,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",Et),s.addEventListener("selectstart",Et),s.addEventListener("selectend",Et),s.addEventListener("squeeze",Et),s.addEventListener("squeezestart",Et),s.addEventListener("squeezeend",Et),s.addEventListener("end",re),s.addEventListener("inputsourceschange",tt),v.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(C),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let Ct={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,Ct),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Dr(d.framebufferWidth,d.framebufferHeight,{format:Ks,type:no,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let Ct=null,ne=null,Re=null;v.depth&&(Re=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Ct=v.stencil?Ca:Ao,ne=v.stencil?To:Kr);let Le={colorFormat:e.RGBA8,depthFormat:Re,scaleFactor:r};f=new XRWebGLBinding(s,e),g=f.createProjectionLayer(Le),s.updateRenderState({layers:[g]}),t.setPixelRatio(1),t.setSize(g.textureWidth,g.textureHeight,!1),x=new Dr(g.textureWidth,g.textureHeight,{format:Ks,type:no,depthTexture:new dh(g.textureWidth,g.textureHeight,ne,void 0,void 0,void 0,void 0,void 0,void 0,Ct),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});let We=t.properties.get(x);We.__ignoreDepthValues=g.ignoreDepthValues}x.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await s.requestReferenceSpace(o),Me.setContext(s),Me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function tt(Rt){for(let Ct=0;Ct<Rt.removed.length;Ct++){let ne=Rt.removed[Ct],Re=M.indexOf(ne);Re>=0&&(M[Re]=null,T[Re].disconnect(ne))}for(let Ct=0;Ct<Rt.added.length;Ct++){let ne=Rt.added[Ct],Re=M.indexOf(ne);if(Re===-1){for(let We=0;We<T.length;We++)if(We>=M.length){M.push(ne),Re=We;break}else if(M[We]===null){M[We]=ne,Re=We;break}if(Re===-1)break}let Le=T[Re];Le&&Le.connect(ne)}}let ft=new X,Mt=new X;function Wt(Rt,Ct,ne){ft.setFromMatrixPosition(Ct.matrixWorld),Mt.setFromMatrixPosition(ne.matrixWorld);let Re=ft.distanceTo(Mt),Le=Ct.projectionMatrix.elements,We=ne.projectionMatrix.elements,Ze=Le[14]/(Le[10]-1),De=Le[14]/(Le[10]+1),Be=(Le[9]+1)/Le[5],K=(Le[9]-1)/Le[5],Se=(Le[8]-1)/Le[0],lt=(We[8]+1)/We[0],_e=Ze*Se,Jt=Ze*lt,ke=Re/(-Se+lt),be=ke*-Se;Ct.matrixWorld.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.translateX(be),Rt.translateZ(ke),Rt.matrixWorld.compose(Rt.position,Rt.quaternion,Rt.scale),Rt.matrixWorldInverse.copy(Rt.matrixWorld).invert();let O=Ze+ke,I=De+ke,yt=_e-be,ye=Jt+(Re-be),pe=Be*De/I*O,ue=K*De/I*O;Rt.projectionMatrix.makePerspective(yt,ye,pe,ue,O,I),Rt.projectionMatrixInverse.copy(Rt.projectionMatrix).invert()}function Zt(Rt,Ct){Ct===null?Rt.matrixWorld.copy(Rt.matrix):Rt.matrixWorld.multiplyMatrices(Ct.matrixWorld,Rt.matrix),Rt.matrixWorldInverse.copy(Rt.matrixWorld).invert()}this.updateCamera=function(Rt){if(s===null)return;A.near=B.near=L.near=Rt.near,A.far=B.far=L.far=Rt.far,(w!==A.near||rt!==A.far)&&(s.updateRenderState({depthNear:A.near,depthFar:A.far}),w=A.near,rt=A.far);let Ct=Rt.parent,ne=A.cameras;Zt(A,Ct);for(let Re=0;Re<ne.length;Re++)Zt(ne[Re],Ct);ne.length===2?Wt(A,L,B):A.projectionMatrix.copy(L.projectionMatrix),At(Rt,A,Ct)};function At(Rt,Ct,ne){ne===null?Rt.matrix.copy(Ct.matrixWorld):(Rt.matrix.copy(ne.matrixWorld),Rt.matrix.invert(),Rt.matrix.multiply(Ct.matrixWorld)),Rt.matrix.decompose(Rt.position,Rt.quaternion,Rt.scale),Rt.updateMatrixWorld(!0),Rt.projectionMatrix.copy(Ct.projectionMatrix),Rt.projectionMatrixInverse.copy(Ct.projectionMatrixInverse),Rt.isPerspectiveCamera&&(Rt.fov=Sl*2*Math.atan(1/Rt.projectionMatrix.elements[5]),Rt.zoom=1)}this.getCamera=function(){return A},this.getFoveation=function(){if(!(g===null&&d===null))return l},this.setFoveation=function(Rt){l=Rt,g!==null&&(g.fixedFoveation=Rt),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Rt)};let Yt=null;function le(Rt,Ct){if(u=Ct.getViewerPose(h||a),y=Ct,u!==null){let ne=u.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let Re=!1;ne.length!==A.cameras.length&&(A.cameras.length=0,Re=!0);for(let Le=0;Le<ne.length;Le++){let We=ne[Le],Ze=null;if(d!==null)Ze=d.getViewport(We);else{let Be=f.getViewSubImage(g,We);Ze=Be.viewport,Le===0&&(t.setRenderTargetTextures(x,Be.colorTexture,g.ignoreDepthValues?void 0:Be.depthStencilTexture),t.setRenderTarget(x))}let De=nt[Le];De===void 0&&(De=new Gi,De.layers.enable(Le),De.viewport=new Fn,nt[Le]=De),De.matrix.fromArray(We.transform.matrix),De.matrix.decompose(De.position,De.quaternion,De.scale),De.projectionMatrix.fromArray(We.projectionMatrix),De.projectionMatrixInverse.copy(De.projectionMatrix).invert(),De.viewport.set(Ze.x,Ze.y,Ze.width,Ze.height),Le===0&&(A.matrix.copy(De.matrix),A.matrix.decompose(A.position,A.quaternion,A.scale)),Re===!0&&A.cameras.push(De)}}for(let ne=0;ne<T.length;ne++){let Re=M[ne],Le=T[ne];Re!==null&&Le!==void 0&&Le.update(Re,Ct,h||a)}Yt&&Yt(Rt,Ct),Ct.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Ct}),y=null}let Me=new cg;Me.setAnimationLoop(le),this.setAnimationLoop=function(Rt){Yt=Rt},this.dispose=function(){}}};function RS(i,t){function e(p,x){p.matrixAutoUpdate===!0&&p.updateMatrix(),x.value.copy(p.matrix)}function n(p,x){x.color.getRGB(p.fogColor.value,lg(i)),x.isFog?(p.fogNear.value=x.near,p.fogFar.value=x.far):x.isFogExp2&&(p.fogDensity.value=x.density)}function s(p,x,T,M,C){x.isMeshBasicMaterial||x.isMeshLambertMaterial?r(p,x):x.isMeshToonMaterial?(r(p,x),f(p,x)):x.isMeshPhongMaterial?(r(p,x),u(p,x)):x.isMeshStandardMaterial?(r(p,x),g(p,x),x.isMeshPhysicalMaterial&&d(p,x,C)):x.isMeshMatcapMaterial?(r(p,x),y(p,x)):x.isMeshDepthMaterial?r(p,x):x.isMeshDistanceMaterial?(r(p,x),v(p,x)):x.isMeshNormalMaterial?r(p,x):x.isLineBasicMaterial?(a(p,x),x.isLineDashedMaterial&&o(p,x)):x.isPointsMaterial?l(p,x,T,M):x.isSpriteMaterial?h(p,x):x.isShadowMaterial?(p.color.value.copy(x.color),p.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function r(p,x){p.opacity.value=x.opacity,x.color&&p.diffuse.value.copy(x.color),x.emissive&&p.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.bumpMap&&(p.bumpMap.value=x.bumpMap,e(x.bumpMap,p.bumpMapTransform),p.bumpScale.value=x.bumpScale,x.side===xs&&(p.bumpScale.value*=-1)),x.normalMap&&(p.normalMap.value=x.normalMap,e(x.normalMap,p.normalMapTransform),p.normalScale.value.copy(x.normalScale),x.side===xs&&p.normalScale.value.negate()),x.displacementMap&&(p.displacementMap.value=x.displacementMap,e(x.displacementMap,p.displacementMapTransform),p.displacementScale.value=x.displacementScale,p.displacementBias.value=x.displacementBias),x.emissiveMap&&(p.emissiveMap.value=x.emissiveMap,e(x.emissiveMap,p.emissiveMapTransform)),x.specularMap&&(p.specularMap.value=x.specularMap,e(x.specularMap,p.specularMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest);let T=t.get(x).envMap;if(T&&(p.envMap.value=T,p.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=x.reflectivity,p.ior.value=x.ior,p.refractionRatio.value=x.refractionRatio),x.lightMap){p.lightMap.value=x.lightMap;let M=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=x.lightMapIntensity*M,e(x.lightMap,p.lightMapTransform)}x.aoMap&&(p.aoMap.value=x.aoMap,p.aoMapIntensity.value=x.aoMapIntensity,e(x.aoMap,p.aoMapTransform))}function a(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform))}function o(p,x){p.dashSize.value=x.dashSize,p.totalSize.value=x.dashSize+x.gapSize,p.scale.value=x.scale}function l(p,x,T,M){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.size.value=x.size*T,p.scale.value=M*.5,x.map&&(p.map.value=x.map,e(x.map,p.uvTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function h(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.rotation.value=x.rotation,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function u(p,x){p.specular.value.copy(x.specular),p.shininess.value=Math.max(x.shininess,1e-4)}function f(p,x){x.gradientMap&&(p.gradientMap.value=x.gradientMap)}function g(p,x){p.metalness.value=x.metalness,x.metalnessMap&&(p.metalnessMap.value=x.metalnessMap,e(x.metalnessMap,p.metalnessMapTransform)),p.roughness.value=x.roughness,x.roughnessMap&&(p.roughnessMap.value=x.roughnessMap,e(x.roughnessMap,p.roughnessMapTransform)),t.get(x).envMap&&(p.envMapIntensity.value=x.envMapIntensity)}function d(p,x,T){p.ior.value=x.ior,x.sheen>0&&(p.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),p.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(p.sheenColorMap.value=x.sheenColorMap,e(x.sheenColorMap,p.sheenColorMapTransform)),x.sheenRoughnessMap&&(p.sheenRoughnessMap.value=x.sheenRoughnessMap,e(x.sheenRoughnessMap,p.sheenRoughnessMapTransform))),x.clearcoat>0&&(p.clearcoat.value=x.clearcoat,p.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(p.clearcoatMap.value=x.clearcoatMap,e(x.clearcoatMap,p.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,e(x.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(p.clearcoatNormalMap.value=x.clearcoatNormalMap,e(x.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===xs&&p.clearcoatNormalScale.value.negate())),x.iridescence>0&&(p.iridescence.value=x.iridescence,p.iridescenceIOR.value=x.iridescenceIOR,p.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(p.iridescenceMap.value=x.iridescenceMap,e(x.iridescenceMap,p.iridescenceMapTransform)),x.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=x.iridescenceThicknessMap,e(x.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),x.transmission>0&&(p.transmission.value=x.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),x.transmissionMap&&(p.transmissionMap.value=x.transmissionMap,e(x.transmissionMap,p.transmissionMapTransform)),p.thickness.value=x.thickness,x.thicknessMap&&(p.thicknessMap.value=x.thicknessMap,e(x.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=x.attenuationDistance,p.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(p.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(p.anisotropyMap.value=x.anisotropyMap,e(x.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=x.specularIntensity,p.specularColor.value.copy(x.specularColor),x.specularColorMap&&(p.specularColorMap.value=x.specularColorMap,e(x.specularColorMap,p.specularColorMapTransform)),x.specularIntensityMap&&(p.specularIntensityMap.value=x.specularIntensityMap,e(x.specularIntensityMap,p.specularIntensityMapTransform))}function y(p,x){x.matcap&&(p.matcap.value=x.matcap)}function v(p,x){let T=t.get(x).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function CS(i,t,e,n){let s={},r={},a=[],o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(T,M){let C=M.program;n.uniformBlockBinding(T,C)}function h(T,M){let C=s[T.id];C===void 0&&(y(T),C=u(T),s[T.id]=C,T.addEventListener("dispose",p));let P=M.program;n.updateUBOMapping(T,P);let L=t.render.frame;r[T.id]!==L&&(g(T),r[T.id]=L)}function u(T){let M=f();T.__bindingPointIndex=M;let C=i.createBuffer(),P=T.__size,L=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,C),i.bufferData(i.UNIFORM_BUFFER,P,L),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,C),C}function f(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function g(T){let M=s[T.id],C=T.uniforms,P=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let L=0,B=C.length;L<B;L++){let nt=Array.isArray(C[L])?C[L]:[C[L]];for(let A=0,w=nt.length;A<w;A++){let rt=nt[A];if(d(rt,L,A,P)===!0){let Et=rt.__offset,re=Array.isArray(rt.value)?rt.value:[rt.value],tt=0;for(let ft=0;ft<re.length;ft++){let Mt=re[ft],Wt=v(Mt);typeof Mt=="number"||typeof Mt=="boolean"?(rt.__data[0]=Mt,i.bufferSubData(i.UNIFORM_BUFFER,Et+tt,rt.__data)):Mt.isMatrix3?(rt.__data[0]=Mt.elements[0],rt.__data[1]=Mt.elements[1],rt.__data[2]=Mt.elements[2],rt.__data[3]=0,rt.__data[4]=Mt.elements[3],rt.__data[5]=Mt.elements[4],rt.__data[6]=Mt.elements[5],rt.__data[7]=0,rt.__data[8]=Mt.elements[6],rt.__data[9]=Mt.elements[7],rt.__data[10]=Mt.elements[8],rt.__data[11]=0):(Mt.toArray(rt.__data,tt),tt+=Wt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,Et,rt.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(T,M,C,P){let L=T.value,B=M+"_"+C;if(P[B]===void 0)return typeof L=="number"||typeof L=="boolean"?P[B]=L:P[B]=L.clone(),!0;{let nt=P[B];if(typeof L=="number"||typeof L=="boolean"){if(nt!==L)return P[B]=L,!0}else if(nt.equals(L)===!1)return nt.copy(L),!0}return!1}function y(T){let M=T.uniforms,C=0,P=16;for(let B=0,nt=M.length;B<nt;B++){let A=Array.isArray(M[B])?M[B]:[M[B]];for(let w=0,rt=A.length;w<rt;w++){let Et=A[w],re=Array.isArray(Et.value)?Et.value:[Et.value];for(let tt=0,ft=re.length;tt<ft;tt++){let Mt=re[tt],Wt=v(Mt),Zt=C%P;Zt!==0&&P-Zt<Wt.boundary&&(C+=P-Zt),Et.__data=new Float32Array(Wt.storage/Float32Array.BYTES_PER_ELEMENT),Et.__offset=C,C+=Wt.storage}}}let L=C%P;return L>0&&(C+=P-L),T.__size=C,T.__cache={},this}function v(T){let M={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(M.boundary=4,M.storage=4):T.isVector2?(M.boundary=8,M.storage=8):T.isVector3||T.isColor?(M.boundary=16,M.storage=12):T.isVector4?(M.boundary=16,M.storage=16):T.isMatrix3?(M.boundary=48,M.storage=48):T.isMatrix4?(M.boundary=64,M.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),M}function p(T){let M=T.target;M.removeEventListener("dispose",p);let C=a.indexOf(M.__bindingPointIndex);a.splice(C,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function x(){for(let T in s)i.deleteBuffer(s[T]);a=[],s={},r={}}return{bind:l,update:h,dispose:x}}var Tl=class{constructor(t={}){let{canvas:e=zy(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let g;n!==null?g=n.getContextAttributes().alpha:g=a;let d=new Uint32Array(4),y=new Int32Array(4),v=null,p=null,x=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kn,this._useLegacyLights=!1,this.toneMapping=eo,this.toneMappingExposure=1;let M=this,C=!1,P=0,L=0,B=null,nt=-1,A=null,w=new Fn,rt=new Fn,Et=null,re=new fn(0),tt=0,ft=e.width,Mt=e.height,Wt=1,Zt=null,At=null,Yt=new Fn(0,0,ft,Mt),le=new Fn(0,0,ft,Mt),Me=!1,Rt=new wl,Ct=!1,ne=!1,Re=null,Le=new Nn,We=new de,Ze=new X,De={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Be(){return B===null?Wt:1}let K=n;function Se(z,gt){for(let Pt=0;Pt<z.length;Pt++){let Ft=z[Pt],Lt=e.getContext(Ft,gt);if(Lt!==null)return Lt}return null}try{let z={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",V,!1),e.addEventListener("webglcontextcreationerror",It,!1),K===null){let gt=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&gt.shift(),K=Se(gt,z),K===null)throw Se(gt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&K instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),K.getShaderPrecisionFormat===void 0&&(K.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(z){throw console.error("THREE.WebGLRenderer: "+z.message),z}let lt,_e,Jt,ke,be,O,I,yt,ye,pe,ue,Xe,qt,we,Je,nn,me,gn,G,fe,ve,et,dt,jt;function Qt(){lt=new $M(K),_e=new VM(K,lt,t),lt.init(_e),et=new TS(K,lt,_e),Jt=new ES(K,lt,_e),ke=new jM(K),be=new fS,O=new wS(K,lt,Jt,be,_e,et,ke),I=new WM(M),yt=new YM(M),ye=new r_(K,_e),dt=new kM(K,lt,ye,_e),pe=new ZM(K,ye,ke,dt),ue=new eb(K,pe,ye,ke),G=new tb(K,_e,O),nn=new GM(be),Xe=new uS(M,I,yt,lt,_e,dt,nn),qt=new RS(M,be),we=new pS,Je=new vS(lt,_e),gn=new zM(M,I,yt,Jt,ue,g,l),me=new SS(M,ue,_e),jt=new CS(K,ke,_e,Jt),fe=new HM(K,lt,ke,_e),ve=new JM(K,lt,ke,_e),ke.programs=Xe.programs,M.capabilities=_e,M.extensions=lt,M.properties=be,M.renderLists=we,M.shadowMap=me,M.state=Jt,M.info=ke}Qt();let te=new Qf(M,K);this.xr=te,this.getContext=function(){return K},this.getContextAttributes=function(){return K.getContextAttributes()},this.forceContextLoss=function(){let z=lt.get("WEBGL_lose_context");z&&z.loseContext()},this.forceContextRestore=function(){let z=lt.get("WEBGL_lose_context");z&&z.restoreContext()},this.getPixelRatio=function(){return Wt},this.setPixelRatio=function(z){z!==void 0&&(Wt=z,this.setSize(ft,Mt,!1))},this.getSize=function(z){return z.set(ft,Mt)},this.setSize=function(z,gt,Pt=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ft=z,Mt=gt,e.width=Math.floor(z*Wt),e.height=Math.floor(gt*Wt),Pt===!0&&(e.style.width=z+"px",e.style.height=gt+"px"),this.setViewport(0,0,z,gt)},this.getDrawingBufferSize=function(z){return z.set(ft*Wt,Mt*Wt).floor()},this.setDrawingBufferSize=function(z,gt,Pt){ft=z,Mt=gt,Wt=Pt,e.width=Math.floor(z*Pt),e.height=Math.floor(gt*Pt),this.setViewport(0,0,z,gt)},this.getCurrentViewport=function(z){return z.copy(w)},this.getViewport=function(z){return z.copy(Yt)},this.setViewport=function(z,gt,Pt,Ft){z.isVector4?Yt.set(z.x,z.y,z.z,z.w):Yt.set(z,gt,Pt,Ft),Jt.viewport(w.copy(Yt).multiplyScalar(Wt).floor())},this.getScissor=function(z){return z.copy(le)},this.setScissor=function(z,gt,Pt,Ft){z.isVector4?le.set(z.x,z.y,z.z,z.w):le.set(z,gt,Pt,Ft),Jt.scissor(rt.copy(le).multiplyScalar(Wt).floor())},this.getScissorTest=function(){return Me},this.setScissorTest=function(z){Jt.setScissorTest(Me=z)},this.setOpaqueSort=function(z){Zt=z},this.setTransparentSort=function(z){At=z},this.getClearColor=function(z){return z.copy(gn.getClearColor())},this.setClearColor=function(){gn.setClearColor.apply(gn,arguments)},this.getClearAlpha=function(){return gn.getClearAlpha()},this.setClearAlpha=function(){gn.setClearAlpha.apply(gn,arguments)},this.clear=function(z=!0,gt=!0,Pt=!0){let Ft=0;if(z){let Lt=!1;if(B!==null){let Ie=B.texture.format;Lt=Ie===ng||Ie===eg||Ie===tg}if(Lt){let Ie=B.texture.type,$e=Ie===no||Ie===Kr||Ie===wd||Ie===To||Ie===K0||Ie===Q0,Qe=gn.getClearColor(),on=gn.getClearAlpha(),dn=Qe.r,un=Qe.g,an=Qe.b;$e?(d[0]=dn,d[1]=un,d[2]=an,d[3]=on,K.clearBufferuiv(K.COLOR,0,d)):(y[0]=dn,y[1]=un,y[2]=an,y[3]=on,K.clearBufferiv(K.COLOR,0,y))}else Ft|=K.COLOR_BUFFER_BIT}gt&&(Ft|=K.DEPTH_BUFFER_BIT),Pt&&(Ft|=K.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K.clear(Ft)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",V,!1),e.removeEventListener("webglcontextcreationerror",It,!1),we.dispose(),Je.dispose(),be.dispose(),I.dispose(),yt.dispose(),ue.dispose(),dt.dispose(),jt.dispose(),Xe.dispose(),te.dispose(),te.removeEventListener("sessionstart",He),te.removeEventListener("sessionend",Oe),Re&&(Re.dispose(),Re=null),sn.stop()};function ct(z){z.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function V(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let z=ke.autoReset,gt=me.enabled,Pt=me.autoUpdate,Ft=me.needsUpdate,Lt=me.type;Qt(),ke.autoReset=z,me.enabled=gt,me.autoUpdate=Pt,me.needsUpdate=Ft,me.type=Lt}function It(z){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",z.statusMessage)}function zt(z){let gt=z.target;gt.removeEventListener("dispose",zt),oe(gt)}function oe(z){ce(z),be.remove(z)}function ce(z){let gt=be.get(z).programs;gt!==void 0&&(gt.forEach(function(Pt){Xe.releaseProgram(Pt)}),z.isShaderMaterial&&Xe.releaseShaderCache(z))}this.renderBufferDirect=function(z,gt,Pt,Ft,Lt,Ie){gt===null&&(gt=De);let $e=Lt.isMesh&&Lt.matrixWorld.determinant()<0,Qe=In(z,gt,Pt,Ft,Lt);Jt.setMaterial(Ft,$e);let on=Pt.index,dn=1;if(Ft.wireframe===!0){if(on=pe.getWireframeAttribute(Pt),on===void 0)return;dn=2}let un=Pt.drawRange,an=Pt.attributes.position,Vn=un.start*dn,Si=(un.start+un.count)*dn;Ie!==null&&(Vn=Math.max(Vn,Ie.start*dn),Si=Math.min(Si,(Ie.start+Ie.count)*dn)),on!==null?(Vn=Math.max(Vn,0),Si=Math.min(Si,on.count)):an!=null&&(Vn=Math.max(Vn,0),Si=Math.min(Si,an.count));let ci=Si-Vn;if(ci<0||ci===1/0)return;dt.setup(Lt,Ft,Qe,Pt,on);let cs,si=fe;if(on!==null&&(cs=ye.get(on),si=ve,si.setIndex(cs)),Lt.isMesh)Ft.wireframe===!0?(Jt.setLineWidth(Ft.wireframeLinewidth*Be()),si.setMode(K.LINES)):si.setMode(K.TRIANGLES);else if(Lt.isLine){let _n=Ft.linewidth;_n===void 0&&(_n=1),Jt.setLineWidth(_n*Be()),Lt.isLineSegments?si.setMode(K.LINES):Lt.isLineLoop?si.setMode(K.LINE_LOOP):si.setMode(K.LINE_STRIP)}else Lt.isPoints?si.setMode(K.POINTS):Lt.isSprite&&si.setMode(K.TRIANGLES);if(Lt.isBatchedMesh)si.renderMultiDraw(Lt._multiDrawStarts,Lt._multiDrawCounts,Lt._multiDrawCount);else if(Lt.isInstancedMesh)si.renderInstances(Vn,ci,Lt.count);else if(Pt.isInstancedBufferGeometry){let _n=Pt._maxInstanceCount!==void 0?Pt._maxInstanceCount:1/0,ir=Math.min(Pt.instanceCount,_n);si.renderInstances(Vn,ci,ir)}else si.render(Vn,ci)};function Ue(z,gt,Pt){z.transparent===!0&&z.side===mn&&z.forceSinglePass===!1?(z.side=xs,z.needsUpdate=!0,li(z,gt,Pt),z.side=io,z.needsUpdate=!0,li(z,gt,Pt),z.side=mn):li(z,gt,Pt)}this.compile=function(z,gt,Pt=null){Pt===null&&(Pt=z),p=Je.get(Pt),p.init(),T.push(p),Pt.traverseVisible(function(Lt){Lt.isLight&&Lt.layers.test(gt.layers)&&(p.pushLight(Lt),Lt.castShadow&&p.pushShadow(Lt))}),z!==Pt&&z.traverseVisible(function(Lt){Lt.isLight&&Lt.layers.test(gt.layers)&&(p.pushLight(Lt),Lt.castShadow&&p.pushShadow(Lt))}),p.setupLights(M._useLegacyLights);let Ft=new Set;return z.traverse(function(Lt){let Ie=Lt.material;if(Ie)if(Array.isArray(Ie))for(let $e=0;$e<Ie.length;$e++){let Qe=Ie[$e];Ue(Qe,Pt,Lt),Ft.add(Qe)}else Ue(Ie,Pt,Lt),Ft.add(Ie)}),T.pop(),p=null,Ft},this.compileAsync=function(z,gt,Pt=null){let Ft=this.compile(z,gt,Pt);return new Promise(Lt=>{function Ie(){if(Ft.forEach(function($e){be.get($e).currentProgram.isReady()&&Ft.delete($e)}),Ft.size===0){Lt(z);return}setTimeout(Ie,10)}lt.get("KHR_parallel_shader_compile")!==null?Ie():setTimeout(Ie,10)})};let Kt=null;function Ne(z){Kt&&Kt(z)}function He(){sn.stop()}function Oe(){sn.start()}let sn=new cg;sn.setAnimationLoop(Ne),typeof self<"u"&&sn.setContext(self),this.setAnimationLoop=function(z){Kt=z,te.setAnimationLoop(z),z===null?sn.stop():sn.start()},te.addEventListener("sessionstart",He),te.addEventListener("sessionend",Oe),this.render=function(z,gt){if(gt!==void 0&&gt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),gt.parent===null&&gt.matrixWorldAutoUpdate===!0&&gt.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(gt),gt=te.getCamera()),z.isScene===!0&&z.onBeforeRender(M,z,gt,B),p=Je.get(z,T.length),p.init(),T.push(p),Le.multiplyMatrices(gt.projectionMatrix,gt.matrixWorldInverse),Rt.setFromProjectionMatrix(Le),ne=this.localClippingEnabled,Ct=nn.init(this.clippingPlanes,ne),v=we.get(z,x.length),v.init(),x.push(v),hn(z,gt,0,M.sortObjects),v.finish(),M.sortObjects===!0&&v.sort(Zt,At),this.info.render.frame++,Ct===!0&&nn.beginShadows();let Pt=p.state.shadowsArray;if(me.render(Pt,z,gt),Ct===!0&&nn.endShadows(),this.info.autoReset===!0&&this.info.reset(),gn.render(v,z),p.setupLights(M._useLegacyLights),gt.isArrayCamera){let Ft=gt.cameras;for(let Lt=0,Ie=Ft.length;Lt<Ie;Lt++){let $e=Ft[Lt];pn(v,z,$e,$e.viewport)}}else pn(v,z,gt);B!==null&&(O.updateMultisampleRenderTarget(B),O.updateRenderTargetMipmap(B)),z.isScene===!0&&z.onAfterRender(M,z,gt),dt.resetDefaultState(),nt=-1,A=null,T.pop(),T.length>0?p=T[T.length-1]:p=null,x.pop(),x.length>0?v=x[x.length-1]:v=null};function hn(z,gt,Pt,Ft){if(z.visible===!1)return;if(z.layers.test(gt.layers)){if(z.isGroup)Pt=z.renderOrder;else if(z.isLOD)z.autoUpdate===!0&&z.update(gt);else if(z.isLight)p.pushLight(z),z.castShadow&&p.pushShadow(z);else if(z.isSprite){if(!z.frustumCulled||Rt.intersectsSprite(z)){Ft&&Ze.setFromMatrixPosition(z.matrixWorld).applyMatrix4(Le);let $e=ue.update(z),Qe=z.material;Qe.visible&&v.push(z,$e,Qe,Pt,Ze.z,null)}}else if((z.isMesh||z.isLine||z.isPoints)&&(!z.frustumCulled||Rt.intersectsObject(z))){let $e=ue.update(z),Qe=z.material;if(Ft&&(z.boundingSphere!==void 0?(z.boundingSphere===null&&z.computeBoundingSphere(),Ze.copy(z.boundingSphere.center)):($e.boundingSphere===null&&$e.computeBoundingSphere(),Ze.copy($e.boundingSphere.center)),Ze.applyMatrix4(z.matrixWorld).applyMatrix4(Le)),Array.isArray(Qe)){let on=$e.groups;for(let dn=0,un=on.length;dn<un;dn++){let an=on[dn],Vn=Qe[an.materialIndex];Vn&&Vn.visible&&v.push(z,$e,Vn,Pt,Ze.z,an)}}else Qe.visible&&v.push(z,$e,Qe,Pt,Ze.z,null)}}let Ie=z.children;for(let $e=0,Qe=Ie.length;$e<Qe;$e++)hn(Ie[$e],gt,Pt,Ft)}function pn(z,gt,Pt,Ft){let Lt=z.opaque,Ie=z.transmissive,$e=z.transparent;p.setupLightsView(Pt),Ct===!0&&nn.setGlobalState(M.clippingPlanes,Pt),Ie.length>0&&Rn(Lt,Ie,gt,Pt),Ft&&Jt.viewport(w.copy(Ft)),Lt.length>0&&Tn(Lt,gt,Pt),Ie.length>0&&Tn(Ie,gt,Pt),$e.length>0&&Tn($e,gt,Pt),Jt.buffers.depth.setTest(!0),Jt.buffers.depth.setMask(!0),Jt.buffers.color.setMask(!0),Jt.setPolygonOffset(!1)}function Rn(z,gt,Pt,Ft){if((Pt.isScene===!0?Pt.overrideMaterial:null)!==null)return;let Ie=_e.isWebGL2;Re===null&&(Re=new Dr(1,1,{generateMipmaps:!0,type:lt.has("EXT_color_buffer_half_float")?bl:no,minFilter:Ml,samples:Ie?4:0})),M.getDrawingBufferSize(We),Ie?Re.setSize(We.x,We.y):Re.setSize(eh(We.x),eh(We.y));let $e=M.getRenderTarget();M.setRenderTarget(Re),M.getClearColor(re),tt=M.getClearAlpha(),tt<1&&M.setClearColor(16777215,.5),M.clear();let Qe=M.toneMapping;M.toneMapping=eo,Tn(z,Pt,Ft),O.updateMultisampleRenderTarget(Re),O.updateRenderTargetMipmap(Re);let on=!1;for(let dn=0,un=gt.length;dn<un;dn++){let an=gt[dn],Vn=an.object,Si=an.geometry,ci=an.material,cs=an.group;if(ci.side===mn&&Vn.layers.test(Ft.layers)){let si=ci.side;ci.side=xs,ci.needsUpdate=!0,Bn(Vn,Pt,Ft,Si,ci,cs),ci.side=si,ci.needsUpdate=!0,on=!0}}on===!0&&(O.updateMultisampleRenderTarget(Re),O.updateRenderTargetMipmap(Re)),M.setRenderTarget($e),M.setClearColor(re,tt),M.toneMapping=Qe}function Tn(z,gt,Pt){let Ft=gt.isScene===!0?gt.overrideMaterial:null;for(let Lt=0,Ie=z.length;Lt<Ie;Lt++){let $e=z[Lt],Qe=$e.object,on=$e.geometry,dn=Ft===null?$e.material:Ft,un=$e.group;Qe.layers.test(Pt.layers)&&Bn(Qe,gt,Pt,on,dn,un)}}function Bn(z,gt,Pt,Ft,Lt,Ie){z.onBeforeRender(M,gt,Pt,Ft,Lt,Ie),z.modelViewMatrix.multiplyMatrices(Pt.matrixWorldInverse,z.matrixWorld),z.normalMatrix.getNormalMatrix(z.modelViewMatrix),Lt.onBeforeRender(M,gt,Pt,Ft,z,Ie),Lt.transparent===!0&&Lt.side===mn&&Lt.forceSinglePass===!1?(Lt.side=xs,Lt.needsUpdate=!0,M.renderBufferDirect(Pt,gt,Ft,Lt,z,Ie),Lt.side=io,Lt.needsUpdate=!0,M.renderBufferDirect(Pt,gt,Ft,Lt,z,Ie),Lt.side=mn):M.renderBufferDirect(Pt,gt,Ft,Lt,z,Ie),z.onAfterRender(M,gt,Pt,Ft,Lt,Ie)}function li(z,gt,Pt){gt.isScene!==!0&&(gt=De);let Ft=be.get(z),Lt=p.state.lights,Ie=p.state.shadowsArray,$e=Lt.state.version,Qe=Xe.getParameters(z,Lt.state,Ie,gt,Pt),on=Xe.getProgramCacheKey(Qe),dn=Ft.programs;Ft.environment=z.isMeshStandardMaterial?gt.environment:null,Ft.fog=gt.fog,Ft.envMap=(z.isMeshStandardMaterial?yt:I).get(z.envMap||Ft.environment),dn===void 0&&(z.addEventListener("dispose",zt),dn=new Map,Ft.programs=dn);let un=dn.get(on);if(un!==void 0){if(Ft.currentProgram===un&&Ft.lightsStateVersion===$e)return ls(z,Qe),un}else Qe.uniforms=Xe.getUniforms(z),z.onBuild(Pt,Qe,M),z.onBeforeCompile(Qe,M),un=Xe.acquireProgram(Qe,on),dn.set(on,un),Ft.uniforms=Qe.uniforms;let an=Ft.uniforms;return(!z.isShaderMaterial&&!z.isRawShaderMaterial||z.clipping===!0)&&(an.clippingPlanes=nn.uniform),ls(z,Qe),Ft.needsLights=Vs(z),Ft.lightsStateVersion=$e,Ft.needsLights&&(an.ambientLightColor.value=Lt.state.ambient,an.lightProbe.value=Lt.state.probe,an.directionalLights.value=Lt.state.directional,an.directionalLightShadows.value=Lt.state.directionalShadow,an.spotLights.value=Lt.state.spot,an.spotLightShadows.value=Lt.state.spotShadow,an.rectAreaLights.value=Lt.state.rectArea,an.ltc_1.value=Lt.state.rectAreaLTC1,an.ltc_2.value=Lt.state.rectAreaLTC2,an.pointLights.value=Lt.state.point,an.pointLightShadows.value=Lt.state.pointShadow,an.hemisphereLights.value=Lt.state.hemi,an.directionalShadowMap.value=Lt.state.directionalShadowMap,an.directionalShadowMatrix.value=Lt.state.directionalShadowMatrix,an.spotShadowMap.value=Lt.state.spotShadowMap,an.spotLightMatrix.value=Lt.state.spotLightMatrix,an.spotLightMap.value=Lt.state.spotLightMap,an.pointShadowMap.value=Lt.state.pointShadowMap,an.pointShadowMatrix.value=Lt.state.pointShadowMatrix),Ft.currentProgram=un,Ft.uniformsList=null,un}function Hs(z){if(z.uniformsList===null){let gt=z.currentProgram.getUniforms();z.uniformsList=Ta.seqWithValue(gt.seq,z.uniforms)}return z.uniformsList}function ls(z,gt){let Pt=be.get(z);Pt.outputColorSpace=gt.outputColorSpace,Pt.batching=gt.batching,Pt.instancing=gt.instancing,Pt.instancingColor=gt.instancingColor,Pt.skinning=gt.skinning,Pt.morphTargets=gt.morphTargets,Pt.morphNormals=gt.morphNormals,Pt.morphColors=gt.morphColors,Pt.morphTargetsCount=gt.morphTargetsCount,Pt.numClippingPlanes=gt.numClippingPlanes,Pt.numIntersection=gt.numClipIntersection,Pt.vertexAlphas=gt.vertexAlphas,Pt.vertexTangents=gt.vertexTangents,Pt.toneMapping=gt.toneMapping}function In(z,gt,Pt,Ft,Lt){gt.isScene!==!0&&(gt=De),O.resetTextureUnits();let Ie=gt.fog,$e=Ft.isMeshStandardMaterial?gt.environment:null,Qe=B===null?M.outputColorSpace:B.isXRRenderTarget===!0?B.texture.colorSpace:Ir,on=(Ft.isMeshStandardMaterial?yt:I).get(Ft.envMap||$e),dn=Ft.vertexColors===!0&&!!Pt.attributes.color&&Pt.attributes.color.itemSize===4,un=!!Pt.attributes.tangent&&(!!Ft.normalMap||Ft.anisotropy>0),an=!!Pt.morphAttributes.position,Vn=!!Pt.morphAttributes.normal,Si=!!Pt.morphAttributes.color,ci=eo;Ft.toneMapped&&(B===null||B.isXRRenderTarget===!0)&&(ci=M.toneMapping);let cs=Pt.morphAttributes.position||Pt.morphAttributes.normal||Pt.morphAttributes.color,si=cs!==void 0?cs.length:0,_n=be.get(Ft),ir=p.state.lights;if(Ct===!0&&(ne===!0||z!==A)){let fs=z===A&&Ft.id===nt;nn.setState(Ft,z,fs)}let qn=!1;Ft.version===_n.__version?(_n.needsLights&&_n.lightsStateVersion!==ir.state.version||_n.outputColorSpace!==Qe||Lt.isBatchedMesh&&_n.batching===!1||!Lt.isBatchedMesh&&_n.batching===!0||Lt.isInstancedMesh&&_n.instancing===!1||!Lt.isInstancedMesh&&_n.instancing===!0||Lt.isSkinnedMesh&&_n.skinning===!1||!Lt.isSkinnedMesh&&_n.skinning===!0||Lt.isInstancedMesh&&_n.instancingColor===!0&&Lt.instanceColor===null||Lt.isInstancedMesh&&_n.instancingColor===!1&&Lt.instanceColor!==null||_n.envMap!==on||Ft.fog===!0&&_n.fog!==Ie||_n.numClippingPlanes!==void 0&&(_n.numClippingPlanes!==nn.numPlanes||_n.numIntersection!==nn.numIntersection)||_n.vertexAlphas!==dn||_n.vertexTangents!==un||_n.morphTargets!==an||_n.morphNormals!==Vn||_n.morphColors!==Si||_n.toneMapping!==ci||_e.isWebGL2===!0&&_n.morphTargetsCount!==si)&&(qn=!0):(qn=!0,_n.__version=Ft.version);let Ji=_n.currentProgram;qn===!0&&(Ji=li(Ft,gt,Lt));let sr=!1,rr=!1,Ho=!1,Ei=Ji.getUniforms(),hs=_n.uniforms;if(Jt.useProgram(Ji.program)&&(sr=!0,rr=!0,Ho=!0),Ft.id!==nt&&(nt=Ft.id,rr=!0),sr||A!==z){Ei.setValue(K,"projectionMatrix",z.projectionMatrix),Ei.setValue(K,"viewMatrix",z.matrixWorldInverse);let fs=Ei.map.cameraPosition;fs!==void 0&&fs.setValue(K,Ze.setFromMatrixPosition(z.matrixWorld)),_e.logarithmicDepthBuffer&&Ei.setValue(K,"logDepthBufFC",2/(Math.log(z.far+1)/Math.LN2)),(Ft.isMeshPhongMaterial||Ft.isMeshToonMaterial||Ft.isMeshLambertMaterial||Ft.isMeshBasicMaterial||Ft.isMeshStandardMaterial||Ft.isShaderMaterial)&&Ei.setValue(K,"isOrthographic",z.isOrthographicCamera===!0),A!==z&&(A=z,rr=!0,Ho=!0)}if(Lt.isSkinnedMesh){Ei.setOptional(K,Lt,"bindMatrix"),Ei.setOptional(K,Lt,"bindMatrixInverse");let fs=Lt.skeleton;fs&&(_e.floatVertexTextures?(fs.boneTexture===null&&fs.computeBoneTexture(),Ei.setValue(K,"boneTexture",fs.boneTexture,O)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Lt.isBatchedMesh&&(Ei.setOptional(K,Lt,"batchingTexture"),Ei.setValue(K,"batchingTexture",Lt._matricesTexture,O));let us=Pt.morphAttributes;if((us.position!==void 0||us.normal!==void 0||us.color!==void 0&&_e.isWebGL2===!0)&&G.update(Lt,Pt,Ji),(rr||_n.receiveShadow!==Lt.receiveShadow)&&(_n.receiveShadow=Lt.receiveShadow,Ei.setValue(K,"receiveShadow",Lt.receiveShadow)),Ft.isMeshGouraudMaterial&&Ft.envMap!==null&&(hs.envMap.value=on,hs.flipEnvMap.value=on.isCubeTexture&&on.isRenderTargetTexture===!1?-1:1),rr&&(Ei.setValue(K,"toneMappingExposure",M.toneMappingExposure),_n.needsLights&&xn(hs,Ho),Ie&&Ft.fog===!0&&qt.refreshFogUniforms(hs,Ie),qt.refreshMaterialUniforms(hs,Ft,Wt,Mt,Re),Ta.upload(K,Hs(_n),hs,O)),Ft.isShaderMaterial&&Ft.uniformsNeedUpdate===!0&&(Ta.upload(K,Hs(_n),hs,O),Ft.uniformsNeedUpdate=!1),Ft.isSpriteMaterial&&Ei.setValue(K,"center",Lt.center),Ei.setValue(K,"modelViewMatrix",Lt.modelViewMatrix),Ei.setValue(K,"normalMatrix",Lt.normalMatrix),Ei.setValue(K,"modelMatrix",Lt.matrixWorld),Ft.isShaderMaterial||Ft.isRawShaderMaterial){let fs=Ft.uniformsGroups;for(let za=0,Fr=fs.length;za<Fr;za++)if(_e.isWebGL2){let Vo=fs[za];jt.update(Vo,Ji),jt.bind(Vo,Ji)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ji}function xn(z,gt){z.ambientLightColor.needsUpdate=gt,z.lightProbe.needsUpdate=gt,z.directionalLights.needsUpdate=gt,z.directionalLightShadows.needsUpdate=gt,z.pointLights.needsUpdate=gt,z.pointLightShadows.needsUpdate=gt,z.spotLights.needsUpdate=gt,z.spotLightShadows.needsUpdate=gt,z.rectAreaLights.needsUpdate=gt,z.hemisphereLights.needsUpdate=gt}function Vs(z){return z.isMeshLambertMaterial||z.isMeshToonMaterial||z.isMeshPhongMaterial||z.isMeshStandardMaterial||z.isShadowMaterial||z.isShaderMaterial&&z.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return L},this.getRenderTarget=function(){return B},this.setRenderTargetTextures=function(z,gt,Pt){be.get(z.texture).__webglTexture=gt,be.get(z.depthTexture).__webglTexture=Pt;let Ft=be.get(z);Ft.__hasExternalTextures=!0,Ft.__hasExternalTextures&&(Ft.__autoAllocateDepthBuffer=Pt===void 0,Ft.__autoAllocateDepthBuffer||lt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Ft.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(z,gt){let Pt=be.get(z);Pt.__webglFramebuffer=gt,Pt.__useDefaultFramebuffer=gt===void 0},this.setRenderTarget=function(z,gt=0,Pt=0){B=z,P=gt,L=Pt;let Ft=!0,Lt=null,Ie=!1,$e=!1;if(z){let on=be.get(z);on.__useDefaultFramebuffer!==void 0?(Jt.bindFramebuffer(K.FRAMEBUFFER,null),Ft=!1):on.__webglFramebuffer===void 0?O.setupRenderTarget(z):on.__hasExternalTextures&&O.rebindTextures(z,be.get(z.texture).__webglTexture,be.get(z.depthTexture).__webglTexture);let dn=z.texture;(dn.isData3DTexture||dn.isDataArrayTexture||dn.isCompressedArrayTexture)&&($e=!0);let un=be.get(z).__webglFramebuffer;z.isWebGLCubeRenderTarget?(Array.isArray(un[gt])?Lt=un[gt][Pt]:Lt=un[gt],Ie=!0):_e.isWebGL2&&z.samples>0&&O.useMultisampledRTT(z)===!1?Lt=be.get(z).__webglMultisampledFramebuffer:Array.isArray(un)?Lt=un[Pt]:Lt=un,w.copy(z.viewport),rt.copy(z.scissor),Et=z.scissorTest}else w.copy(Yt).multiplyScalar(Wt).floor(),rt.copy(le).multiplyScalar(Wt).floor(),Et=Me;if(Jt.bindFramebuffer(K.FRAMEBUFFER,Lt)&&_e.drawBuffers&&Ft&&Jt.drawBuffers(z,Lt),Jt.viewport(w),Jt.scissor(rt),Jt.setScissorTest(Et),Ie){let on=be.get(z.texture);K.framebufferTexture2D(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,K.TEXTURE_CUBE_MAP_POSITIVE_X+gt,on.__webglTexture,Pt)}else if($e){let on=be.get(z.texture),dn=gt||0;K.framebufferTextureLayer(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,on.__webglTexture,Pt||0,dn)}nt=-1},this.readRenderTargetPixels=function(z,gt,Pt,Ft,Lt,Ie,$e){if(!(z&&z.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Qe=be.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&$e!==void 0&&(Qe=Qe[$e]),Qe){Jt.bindFramebuffer(K.FRAMEBUFFER,Qe);try{let on=z.texture,dn=on.format,un=on.type;if(dn!==Ks&&et.convert(dn)!==K.getParameter(K.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let an=un===bl&&(lt.has("EXT_color_buffer_half_float")||_e.isWebGL2&&lt.has("EXT_color_buffer_float"));if(un!==no&&et.convert(un)!==K.getParameter(K.IMPLEMENTATION_COLOR_READ_TYPE)&&!(un===Qr&&(_e.isWebGL2||lt.has("OES_texture_float")||lt.has("WEBGL_color_buffer_float")))&&!an){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}gt>=0&&gt<=z.width-Ft&&Pt>=0&&Pt<=z.height-Lt&&K.readPixels(gt,Pt,Ft,Lt,et.convert(dn),et.convert(un),Ie)}finally{let on=B!==null?be.get(B).__webglFramebuffer:null;Jt.bindFramebuffer(K.FRAMEBUFFER,on)}}},this.copyFramebufferToTexture=function(z,gt,Pt=0){let Ft=Math.pow(2,-Pt),Lt=Math.floor(gt.image.width*Ft),Ie=Math.floor(gt.image.height*Ft);O.setTexture2D(gt,0),K.copyTexSubImage2D(K.TEXTURE_2D,Pt,0,0,z.x,z.y,Lt,Ie),Jt.unbindTexture()},this.copyTextureToTexture=function(z,gt,Pt,Ft=0){let Lt=gt.image.width,Ie=gt.image.height,$e=et.convert(Pt.format),Qe=et.convert(Pt.type);O.setTexture2D(Pt,0),K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,Pt.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Pt.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,Pt.unpackAlignment),gt.isDataTexture?K.texSubImage2D(K.TEXTURE_2D,Ft,z.x,z.y,Lt,Ie,$e,Qe,gt.image.data):gt.isCompressedTexture?K.compressedTexSubImage2D(K.TEXTURE_2D,Ft,z.x,z.y,gt.mipmaps[0].width,gt.mipmaps[0].height,$e,gt.mipmaps[0].data):K.texSubImage2D(K.TEXTURE_2D,Ft,z.x,z.y,$e,Qe,gt.image),Ft===0&&Pt.generateMipmaps&&K.generateMipmap(K.TEXTURE_2D),Jt.unbindTexture()},this.copyTextureToTexture3D=function(z,gt,Pt,Ft,Lt=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Ie=z.max.x-z.min.x+1,$e=z.max.y-z.min.y+1,Qe=z.max.z-z.min.z+1,on=et.convert(Ft.format),dn=et.convert(Ft.type),un;if(Ft.isData3DTexture)O.setTexture3D(Ft,0),un=K.TEXTURE_3D;else if(Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)O.setTexture2DArray(Ft,0),un=K.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,Ft.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Ft.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,Ft.unpackAlignment);let an=K.getParameter(K.UNPACK_ROW_LENGTH),Vn=K.getParameter(K.UNPACK_IMAGE_HEIGHT),Si=K.getParameter(K.UNPACK_SKIP_PIXELS),ci=K.getParameter(K.UNPACK_SKIP_ROWS),cs=K.getParameter(K.UNPACK_SKIP_IMAGES),si=Pt.isCompressedTexture?Pt.mipmaps[Lt]:Pt.image;K.pixelStorei(K.UNPACK_ROW_LENGTH,si.width),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,si.height),K.pixelStorei(K.UNPACK_SKIP_PIXELS,z.min.x),K.pixelStorei(K.UNPACK_SKIP_ROWS,z.min.y),K.pixelStorei(K.UNPACK_SKIP_IMAGES,z.min.z),Pt.isDataTexture||Pt.isData3DTexture?K.texSubImage3D(un,Lt,gt.x,gt.y,gt.z,Ie,$e,Qe,on,dn,si.data):Pt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),K.compressedTexSubImage3D(un,Lt,gt.x,gt.y,gt.z,Ie,$e,Qe,on,si.data)):K.texSubImage3D(un,Lt,gt.x,gt.y,gt.z,Ie,$e,Qe,on,dn,si),K.pixelStorei(K.UNPACK_ROW_LENGTH,an),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,Vn),K.pixelStorei(K.UNPACK_SKIP_PIXELS,Si),K.pixelStorei(K.UNPACK_SKIP_ROWS,ci),K.pixelStorei(K.UNPACK_SKIP_IMAGES,cs),Lt===0&&Ft.generateMipmaps&&K.generateMipmap(un),Jt.unbindTexture()},this.initTexture=function(z){z.isCubeTexture?O.setTextureCube(z,0):z.isData3DTexture?O.setTexture3D(z,0):z.isDataArrayTexture||z.isCompressedArrayTexture?O.setTexture2DArray(z,0):O.setTexture2D(z,0),Jt.unbindTexture()},this.resetState=function(){P=0,L=0,B=null,Jt.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Lr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===Td?"display-p3":"srgb",e.unpackColorSpace=Wn.workingColorSpace===Vh?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===kn?Ro:sg}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===Ro?kn:Ir}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},td=class extends Tl{};td.prototype.isWebGL1Renderer=!0;var ph=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new fn(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var mh=class extends vi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}},gh=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Ff,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=pr()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=pr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},is=new X,er=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyMatrix4(t),this.setXYZ(e,is.x,is.y,is.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyNormalMatrix(t),this.setXYZ(e,is.x,is.y,is.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.transformDirection(t),this.setXYZ(e,is.x,is.y,is.z);return this}setX(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=dr(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=dr(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=dr(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=dr(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array),r=Gn(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Zn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var xh=class extends As{constructor(t=null,e=1,n=1,s,r,a,o,l,h=Pi,u=Pi,f,g){super(null,a,o,l,h,u,s,r,f,g),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Al=class extends Zn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},_a=new Nn,D0=new Nn,Hc=[],U0=new es,PS=new Nn,dl=new Ke,pl=new _s,Ur=class extends Ke{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Al(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,PS)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new es),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,_a),U0.copy(t.boundingBox).applyMatrix4(_a),this.boundingBox.union(U0)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new _s),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,_a),pl.copy(t.boundingSphere).applyMatrix4(_a),this.boundingSphere.union(pl)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,s=this.count;if(dl.geometry=this.geometry,dl.material=this.material,dl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),pl.copy(this.boundingSphere),pl.applyMatrix4(n),t.ray.intersectsSphere(pl)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,_a),D0.multiplyMatrices(n,_a),dl.matrixWorld=D0,dl.raycast(t,Hc);for(let a=0,o=Hc.length;a<o;a++){let l=Hc[a];l.instanceId=r,l.object=this,e.push(l)}Hc.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Al(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var La=class extends gr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fn(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},N0=new X,O0=new X,F0=new Nn,Af=new Co,Vc=new _s,ed=class extends vi{constructor(t=new Ln,e=new La){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)N0.fromBufferAttribute(e,s-1),O0.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=N0.distanceTo(O0);t.setAttribute("lineDistance",new en(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Vc.copy(n.boundingSphere),Vc.applyMatrix4(s),Vc.radius+=r,t.ray.intersectsSphere(Vc)===!1)return;F0.copy(s).invert(),Af.copy(t.ray).applyMatrix4(F0);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=new X,u=new X,f=new X,g=new X,d=this.isLineSegments?2:1,y=n.index,p=n.attributes.position;if(y!==null){let x=Math.max(0,a.start),T=Math.min(y.count,a.start+a.count);for(let M=x,C=T-1;M<C;M+=d){let P=y.getX(M),L=y.getX(M+1);if(h.fromBufferAttribute(p,P),u.fromBufferAttribute(p,L),Af.distanceSqToSegment(h,u,g,f)>l)continue;g.applyMatrix4(this.matrixWorld);let nt=t.ray.origin.distanceTo(g);nt<t.near||nt>t.far||e.push({distance:nt,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}else{let x=Math.max(0,a.start),T=Math.min(p.count,a.start+a.count);for(let M=x,C=T-1;M<C;M+=d){if(h.fromBufferAttribute(p,M),u.fromBufferAttribute(p,M+1),Af.distanceSqToSegment(h,u,g,f)>l)continue;g.applyMatrix4(this.matrixWorld);let L=t.ray.origin.distanceTo(g);L<t.near||L>t.far||e.push({distance:L,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}},B0=new X,z0=new X,Rl=class extends ed{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)B0.fromBufferAttribute(e,s),z0.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+B0.distanceTo(z0);t.setAttribute("lineDistance",new en(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var as=class extends As{constructor(t,e,n,s,r,a,o,l,h){super(t,e,n,s,r,a,o,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},zs=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,h;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],g=n[s+1]-u,d=(a-u)/g;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new de:new X);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new X,s=[],r=[],a=[],o=new X,l=new Nn;for(let d=0;d<=t;d++){let y=d/t;s[d]=this.getTangentAt(y,new X)}r[0]=new X,a[0]=new X;let h=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),g=Math.abs(s[0].z);u<=h&&(h=u,n.set(1,0,0)),f<=h&&(h=f,n.set(0,1,0)),g<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let y=Math.acos(Li(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,y))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Li(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let y=1;y<=t;y++)r[y].applyMatrix4(l.makeRotationAxis(s[y],d*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},Cl=class extends zs{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e){let n=e||new de,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),g=l-this.aX,d=h-this.aY;l=g*u-d*f+this.aX,h=g*f+d*u+this.aY}return n.set(l,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},nd=class extends Cl{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Cd(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,h){s(a,o,h*(o-r),h*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,h,u,f){let g=(a-r)/h-(o-r)/(h+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;g*=u,d*=u,s(a,o,g,d)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var Gc=new X,Rf=new Cd,Cf=new Cd,Pf=new Cd,Po=class extends zs{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new X){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let h,u;this.closed||o>0?h=s[(o-1)%r]:(Gc.subVectors(s[0],s[1]).add(s[0]),h=Gc);let f=s[o%r],g=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Gc.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Gc),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,y=Math.pow(h.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(g),d),p=Math.pow(g.distanceToSquared(u),d);v<1e-4&&(v=1),y<1e-4&&(y=v),p<1e-4&&(p=v),Rf.initNonuniformCatmullRom(h.x,f.x,g.x,u.x,y,v,p),Cf.initNonuniformCatmullRom(h.y,f.y,g.y,u.y,y,v,p),Pf.initNonuniformCatmullRom(h.z,f.z,g.z,u.z,y,v,p)}else this.curveType==="catmullrom"&&(Rf.initCatmullRom(h.x,f.x,g.x,u.x,this.tension),Cf.initCatmullRom(h.y,f.y,g.y,u.y,this.tension),Pf.initCatmullRom(h.z,f.z,g.z,u.z,this.tension));return n.set(Rf.calc(l),Cf.calc(l),Pf.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new X().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function k0(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function LS(i,t){let e=1-i;return e*e*t}function IS(i,t){return 2*(1-i)*i*t}function DS(i,t){return i*i*t}function _l(i,t,e,n){return LS(i,t)+IS(i,e)+DS(i,n)}function US(i,t){let e=1-i;return e*e*e*t}function NS(i,t){let e=1-i;return 3*e*e*i*t}function OS(i,t){return 3*(1-i)*i*i*t}function FS(i,t){return i*i*i*t}function vl(i,t,e,n,s){return US(i,t)+NS(i,e)+OS(i,n)+FS(i,s)}var yh=class extends zs{constructor(t=new de,e=new de,n=new de,s=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new de){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(vl(t,s.x,r.x,a.x,o.x),vl(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},id=class extends zs{constructor(t=new X,e=new X,n=new X,s=new X){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new X){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(vl(t,s.x,r.x,a.x,o.x),vl(t,s.y,r.y,a.y,o.y),vl(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},_h=class extends zs{constructor(t=new de,e=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new de){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new de){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},sd=class extends zs{constructor(t=new X,e=new X){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new X){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new X){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},vh=class extends zs{constructor(t=new de,e=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new de){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(_l(t,s.x,r.x,a.x),_l(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Mh=class extends zs{constructor(t=new X,e=new X,n=new X){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new X){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(_l(t,s.x,r.x,a.x),_l(t,s.y,r.y,a.y),_l(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},bh=class extends zs{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new de){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],h=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(k0(o,l.x,h.x,u.x,f.x),k0(o,l.y,h.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new de().fromArray(s))}return this}},Sh=Object.freeze({__proto__:null,ArcCurve:nd,CatmullRomCurve3:Po,CubicBezierCurve:yh,CubicBezierCurve3:id,EllipseCurve:Cl,LineCurve:_h,LineCurve3:sd,QuadraticBezierCurve:vh,QuadraticBezierCurve3:Mh,SplineCurve:bh}),rd=class extends zs{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new Sh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),h=l===0?0:1-a/l;return o.getPointAt(h,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let h=0;h<l.length;h++){let u=l[h];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new Sh[s.type]().fromJSON(s))}return this}},Eh=class extends rd{constructor(t){super(),this.type="Path",this.currentPoint=new de,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new _h(this.currentPoint.clone(),new de(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new vh(this.currentPoint.clone(),new de(t,e),new de(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new yh(this.currentPoint.clone(),new de(t,e),new de(n,s),new de(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new bh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){let h=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+h,e+u,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){let h=new Cl(t,e,n,s,r,a,o,l);if(this.curves.length>0){let f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);let u=h.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var wh=class i extends Ln{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],l=[],h=new X,u=new de;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,g=3;f<=e;f++,g+=3){let d=n+f/e*s;h.x=t*Math.cos(d),h.y=t*Math.sin(d),a.push(h.x,h.y,h.z),o.push(0,0,1),u.x=(a[g]/t+1)/2,u.y=(a[g+1]/t+1)/2,l.push(u.x,u.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new en(a,3)),this.setAttribute("normal",new en(o,3)),this.setAttribute("uv",new en(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Wi=class i extends Ln{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let h=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],g=[],d=[],y=0,v=[],p=n/2,x=0;T(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new en(f,3)),this.setAttribute("normal",new en(g,3)),this.setAttribute("uv",new en(d,2));function T(){let C=new X,P=new X,L=0,B=(e-t)/n;for(let nt=0;nt<=r;nt++){let A=[],w=nt/r,rt=w*(e-t)+t;for(let Et=0;Et<=s;Et++){let re=Et/s,tt=re*l+o,ft=Math.sin(tt),Mt=Math.cos(tt);P.x=rt*ft,P.y=-w*n+p,P.z=rt*Mt,f.push(P.x,P.y,P.z),C.set(ft,B,Mt).normalize(),g.push(C.x,C.y,C.z),d.push(re,1-w),A.push(y++)}v.push(A)}for(let nt=0;nt<s;nt++)for(let A=0;A<r;A++){let w=v[A][nt],rt=v[A+1][nt],Et=v[A+1][nt+1],re=v[A][nt+1];u.push(w,rt,re),u.push(rt,Et,re),L+=6}h.addGroup(x,L,0),x+=L}function M(C){let P=y,L=new de,B=new X,nt=0,A=C===!0?t:e,w=C===!0?1:-1;for(let Et=1;Et<=s;Et++)f.push(0,p*w,0),g.push(0,w,0),d.push(.5,.5),y++;let rt=y;for(let Et=0;Et<=s;Et++){let tt=Et/s*l+o,ft=Math.cos(tt),Mt=Math.sin(tt);B.x=A*Mt,B.y=p*w,B.z=A*ft,f.push(B.x,B.y,B.z),g.push(0,w,0),L.x=ft*.5+.5,L.y=Mt*.5*w+.5,d.push(L.x,L.y),y++}for(let Et=0;Et<s;Et++){let re=P+Et,tt=rt+Et;C===!0?u.push(tt,tt+1,re):u.push(tt+1,tt,re),nt+=3}h.addGroup(x,nt,C===!0?1:2),x+=nt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},ro=class i extends Wi{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},od=class i extends Ln{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],a=[];o(s),h(n),u(),this.setAttribute("position",new en(r,3)),this.setAttribute("normal",new en(r.slice(),3)),this.setAttribute("uv",new en(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(T){let M=new X,C=new X,P=new X;for(let L=0;L<e.length;L+=3)d(e[L+0],M),d(e[L+1],C),d(e[L+2],P),l(M,C,P,T)}function l(T,M,C,P){let L=P+1,B=[];for(let nt=0;nt<=L;nt++){B[nt]=[];let A=T.clone().lerp(C,nt/L),w=M.clone().lerp(C,nt/L),rt=L-nt;for(let Et=0;Et<=rt;Et++)Et===0&&nt===L?B[nt][Et]=A:B[nt][Et]=A.clone().lerp(w,Et/rt)}for(let nt=0;nt<L;nt++)for(let A=0;A<2*(L-nt)-1;A++){let w=Math.floor(A/2);A%2===0?(g(B[nt][w+1]),g(B[nt+1][w]),g(B[nt][w])):(g(B[nt][w+1]),g(B[nt+1][w+1]),g(B[nt+1][w]))}}function h(T){let M=new X;for(let C=0;C<r.length;C+=3)M.x=r[C+0],M.y=r[C+1],M.z=r[C+2],M.normalize().multiplyScalar(T),r[C+0]=M.x,r[C+1]=M.y,r[C+2]=M.z}function u(){let T=new X;for(let M=0;M<r.length;M+=3){T.x=r[M+0],T.y=r[M+1],T.z=r[M+2];let C=p(T)/2/Math.PI+.5,P=x(T)/Math.PI+.5;a.push(C,1-P)}y(),f()}function f(){for(let T=0;T<a.length;T+=6){let M=a[T+0],C=a[T+2],P=a[T+4],L=Math.max(M,C,P),B=Math.min(M,C,P);L>.9&&B<.1&&(M<.2&&(a[T+0]+=1),C<.2&&(a[T+2]+=1),P<.2&&(a[T+4]+=1))}}function g(T){r.push(T.x,T.y,T.z)}function d(T,M){let C=T*3;M.x=t[C+0],M.y=t[C+1],M.z=t[C+2]}function y(){let T=new X,M=new X,C=new X,P=new X,L=new de,B=new de,nt=new de;for(let A=0,w=0;A<r.length;A+=9,w+=6){T.set(r[A+0],r[A+1],r[A+2]),M.set(r[A+3],r[A+4],r[A+5]),C.set(r[A+6],r[A+7],r[A+8]),L.set(a[w+0],a[w+1]),B.set(a[w+2],a[w+3]),nt.set(a[w+4],a[w+5]),P.copy(T).add(M).add(C).divideScalar(3);let rt=p(P);v(L,w+0,T,rt),v(B,w+2,M,rt),v(nt,w+4,C,rt)}}function v(T,M,C,P){P<0&&T.x===1&&(a[M]=T.x-1),C.x===0&&C.z===0&&(a[M]=P/2/Math.PI+.5)}function p(T){return Math.atan2(T.z,-T.x)}function x(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var Nr=class extends Eh{constructor(t){super(t),this.uuid=pr(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new Eh().fromJSON(s))}return this}},BS={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=mg(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,h,u,f,g,d;if(n&&(r=GS(i,t,r,e)),i.length>80*e){o=h=i[0],l=u=i[1];for(let y=e;y<s;y+=e)f=i[y],g=i[y+1],f<o&&(o=f),g<l&&(l=g),f>h&&(h=f),g>u&&(u=g);d=Math.max(h-o,u-l),d=d!==0?32767/d:0}return Pl(r,a,e,o,l,d,0),a}};function mg(i,t,e,n,s){let r,a;if(s===t2(i,t,e,n)>0)for(r=t;r<e;r+=n)a=H0(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=H0(r,i[r],i[r+1],a);return a&&qh(a,a.next)&&(Il(a),a=a.next),a}function Lo(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(qh(e,e.next)||_i(e.prev,e,e.next)===0)){if(Il(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Pl(i,t,e,n,s,r,a){if(!i)return;!a&&r&&$S(i,n,s,r);let o=i,l,h;for(;i.prev!==i.next;){if(l=i.prev,h=i.next,r?kS(i,n,s,r):zS(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(h.i/e|0),Il(i),i=h.next,o=h.next;continue}if(i=h,i===o){a?a===1?(i=HS(Lo(i),t,e),Pl(i,t,e,n,s,r,2)):a===2&&VS(i,t,e,n,s,r):Pl(Lo(i),t,e,n,s,r,1);break}}}function zS(i){let t=i.prev,e=i,n=i.next;if(_i(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,h=n.y,u=s<r?s<a?s:a:r<a?r:a,f=o<l?o<h?o:h:l<h?l:h,g=s>r?s>a?s:a:r>a?r:a,d=o>l?o>h?o:h:l>h?l:h,y=n.next;for(;y!==t;){if(y.x>=u&&y.x<=g&&y.y>=f&&y.y<=d&&Sa(s,o,r,l,a,h,y.x,y.y)&&_i(y.prev,y,y.next)>=0)return!1;y=y.next}return!0}function kS(i,t,e,n){let s=i.prev,r=i,a=i.next;if(_i(s,r,a)>=0)return!1;let o=s.x,l=r.x,h=a.x,u=s.y,f=r.y,g=a.y,d=o<l?o<h?o:h:l<h?l:h,y=u<f?u<g?u:g:f<g?f:g,v=o>l?o>h?o:h:l>h?l:h,p=u>f?u>g?u:g:f>g?f:g,x=ad(d,y,t,e,n),T=ad(v,p,t,e,n),M=i.prevZ,C=i.nextZ;for(;M&&M.z>=x&&C&&C.z<=T;){if(M.x>=d&&M.x<=v&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&Sa(o,u,l,f,h,g,M.x,M.y)&&_i(M.prev,M,M.next)>=0||(M=M.prevZ,C.x>=d&&C.x<=v&&C.y>=y&&C.y<=p&&C!==s&&C!==a&&Sa(o,u,l,f,h,g,C.x,C.y)&&_i(C.prev,C,C.next)>=0))return!1;C=C.nextZ}for(;M&&M.z>=x;){if(M.x>=d&&M.x<=v&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&Sa(o,u,l,f,h,g,M.x,M.y)&&_i(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;C&&C.z<=T;){if(C.x>=d&&C.x<=v&&C.y>=y&&C.y<=p&&C!==s&&C!==a&&Sa(o,u,l,f,h,g,C.x,C.y)&&_i(C.prev,C,C.next)>=0)return!1;C=C.nextZ}return!0}function HS(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!qh(s,r)&&gg(s,n,n.next,r)&&Ll(s,r)&&Ll(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Il(n),Il(n.next),n=i=r),n=n.next}while(n!==i);return Lo(n)}function VS(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&jS(a,o)){let l=xg(a,o);a=Lo(a,a.next),l=Lo(l,l.next),Pl(a,t,e,n,s,r,0),Pl(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function GS(i,t,e,n){let s=[],r,a,o,l,h;for(r=0,a=t.length;r<a;r++)o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,h=mg(i,o,l,n,!1),h===h.next&&(h.steiner=!0),s.push(JS(h));for(s.sort(WS),r=0;r<s.length;r++)e=XS(s[r],e);return e}function WS(i,t){return i.x-t.x}function XS(i,t){let e=qS(i,t);if(!e)return t;let n=xg(e,i);return Lo(n,n.next),Lo(e,e.next)}function qS(i,t){let e=t,n=-1/0,s,r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){let g=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(g<=r&&g>n&&(n=g,s=e.x<e.next.x?e:e.next,g===r))return s}e=e.next}while(e!==t);if(!s)return null;let o=s,l=s.x,h=s.y,u=1/0,f;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&Sa(a<h?r:n,a,l,h,a<h?n:r,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(r-e.x),Ll(e,i)&&(f<u||f===u&&(e.x>s.x||e.x===s.x&&YS(s,e)))&&(s=e,u=f)),e=e.next;while(e!==o);return s}function YS(i,t){return _i(i.prev,i,t.prev)<0&&_i(t.next,i,i.next)<0}function $S(i,t,e,n){let s=i;do s.z===0&&(s.z=ad(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,ZS(s)}function ZS(i){let t,e,n,s,r,a,o,l,h=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<h&&(o++,n=n.nextZ,!!n);t++);for(l=h;o>0||l>0&&n;)o!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,h*=2}while(a>1);return i}function ad(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function JS(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function Sa(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function jS(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!KS(i,t)&&(Ll(i,t)&&Ll(t,i)&&QS(i,t)&&(_i(i.prev,i,t.prev)||_i(i,t.prev,t))||qh(i,t)&&_i(i.prev,i,i.next)>0&&_i(t.prev,t,t.next)>0)}function _i(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function qh(i,t){return i.x===t.x&&i.y===t.y}function gg(i,t,e,n){let s=Xc(_i(i,t,e)),r=Xc(_i(i,t,n)),a=Xc(_i(e,n,i)),o=Xc(_i(e,n,t));return!!(s!==r&&a!==o||s===0&&Wc(i,e,t)||r===0&&Wc(i,n,t)||a===0&&Wc(e,i,n)||o===0&&Wc(e,t,n))}function Wc(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Xc(i){return i>0?1:i<0?-1:0}function KS(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&gg(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Ll(i,t){return _i(i.prev,i,i.next)<0?_i(i,t,i.next)>=0&&_i(i,i.prev,t)>=0:_i(i,t,i.prev)<0||_i(i,i.next,t)<0}function QS(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function xg(i,t){let e=new ld(i.i,i.x,i.y),n=new ld(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function H0(i,t,e,n){let s=new ld(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Il(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function ld(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function t2(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Qs=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];V0(t),G0(n,t);let a=t.length;e.forEach(V0);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,G0(n,e[l]);let o=BS.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function V0(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function G0(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Dl=class i extends Ln{constructor(t=new Nr([new de(.5,.5),new de(-.5,.5),new de(-.5,-.5),new de(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){let h=t[o];a(h)}this.setAttribute("position",new en(s,3)),this.setAttribute("uv",new en(r,2)),this.computeVertexNormals();function a(o){let l=[],h=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1,g=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,y=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,x=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:e2,M,C=!1,P,L,B,nt;x&&(M=x.getSpacedPoints(u),C=!0,g=!1,P=x.computeFrenetFrames(u,!1),L=new X,B=new X,nt=new X),g||(p=0,d=0,y=0,v=0);let A=o.extractPoints(h),w=A.shape,rt=A.holes;if(!Qs.isClockWise(w)){w=w.reverse();for(let K=0,Se=rt.length;K<Se;K++){let lt=rt[K];Qs.isClockWise(lt)&&(rt[K]=lt.reverse())}}let re=Qs.triangulateShape(w,rt),tt=w;for(let K=0,Se=rt.length;K<Se;K++){let lt=rt[K];w=w.concat(lt)}function ft(K,Se,lt){return Se||console.error("THREE.ExtrudeGeometry: vec does not exist"),K.clone().addScaledVector(Se,lt)}let Mt=w.length,Wt=re.length;function Zt(K,Se,lt){let _e,Jt,ke,be=K.x-Se.x,O=K.y-Se.y,I=lt.x-K.x,yt=lt.y-K.y,ye=be*be+O*O,pe=be*yt-O*I;if(Math.abs(pe)>Number.EPSILON){let ue=Math.sqrt(ye),Xe=Math.sqrt(I*I+yt*yt),qt=Se.x-O/ue,we=Se.y+be/ue,Je=lt.x-yt/Xe,nn=lt.y+I/Xe,me=((Je-qt)*yt-(nn-we)*I)/(be*yt-O*I);_e=qt+be*me-K.x,Jt=we+O*me-K.y;let gn=_e*_e+Jt*Jt;if(gn<=2)return new de(_e,Jt);ke=Math.sqrt(gn/2)}else{let ue=!1;be>Number.EPSILON?I>Number.EPSILON&&(ue=!0):be<-Number.EPSILON?I<-Number.EPSILON&&(ue=!0):Math.sign(O)===Math.sign(yt)&&(ue=!0),ue?(_e=-O,Jt=be,ke=Math.sqrt(ye)):(_e=be,Jt=O,ke=Math.sqrt(ye/2))}return new de(_e/ke,Jt/ke)}let At=[];for(let K=0,Se=tt.length,lt=Se-1,_e=K+1;K<Se;K++,lt++,_e++)lt===Se&&(lt=0),_e===Se&&(_e=0),At[K]=Zt(tt[K],tt[lt],tt[_e]);let Yt=[],le,Me=At.concat();for(let K=0,Se=rt.length;K<Se;K++){let lt=rt[K];le=[];for(let _e=0,Jt=lt.length,ke=Jt-1,be=_e+1;_e<Jt;_e++,ke++,be++)ke===Jt&&(ke=0),be===Jt&&(be=0),le[_e]=Zt(lt[_e],lt[ke],lt[be]);Yt.push(le),Me=Me.concat(le)}for(let K=0;K<p;K++){let Se=K/p,lt=d*Math.cos(Se*Math.PI/2),_e=y*Math.sin(Se*Math.PI/2)+v;for(let Jt=0,ke=tt.length;Jt<ke;Jt++){let be=ft(tt[Jt],At[Jt],_e);Le(be.x,be.y,-lt)}for(let Jt=0,ke=rt.length;Jt<ke;Jt++){let be=rt[Jt];le=Yt[Jt];for(let O=0,I=be.length;O<I;O++){let yt=ft(be[O],le[O],_e);Le(yt.x,yt.y,-lt)}}}let Rt=y+v;for(let K=0;K<Mt;K++){let Se=g?ft(w[K],Me[K],Rt):w[K];C?(B.copy(P.normals[0]).multiplyScalar(Se.x),L.copy(P.binormals[0]).multiplyScalar(Se.y),nt.copy(M[0]).add(B).add(L),Le(nt.x,nt.y,nt.z)):Le(Se.x,Se.y,0)}for(let K=1;K<=u;K++)for(let Se=0;Se<Mt;Se++){let lt=g?ft(w[Se],Me[Se],Rt):w[Se];C?(B.copy(P.normals[K]).multiplyScalar(lt.x),L.copy(P.binormals[K]).multiplyScalar(lt.y),nt.copy(M[K]).add(B).add(L),Le(nt.x,nt.y,nt.z)):Le(lt.x,lt.y,f/u*K)}for(let K=p-1;K>=0;K--){let Se=K/p,lt=d*Math.cos(Se*Math.PI/2),_e=y*Math.sin(Se*Math.PI/2)+v;for(let Jt=0,ke=tt.length;Jt<ke;Jt++){let be=ft(tt[Jt],At[Jt],_e);Le(be.x,be.y,f+lt)}for(let Jt=0,ke=rt.length;Jt<ke;Jt++){let be=rt[Jt];le=Yt[Jt];for(let O=0,I=be.length;O<I;O++){let yt=ft(be[O],le[O],_e);C?Le(yt.x,yt.y+M[u-1].y,M[u-1].x+lt):Le(yt.x,yt.y,f+lt)}}}Ct(),ne();function Ct(){let K=s.length/3;if(g){let Se=0,lt=Mt*Se;for(let _e=0;_e<Wt;_e++){let Jt=re[_e];We(Jt[2]+lt,Jt[1]+lt,Jt[0]+lt)}Se=u+p*2,lt=Mt*Se;for(let _e=0;_e<Wt;_e++){let Jt=re[_e];We(Jt[0]+lt,Jt[1]+lt,Jt[2]+lt)}}else{for(let Se=0;Se<Wt;Se++){let lt=re[Se];We(lt[2],lt[1],lt[0])}for(let Se=0;Se<Wt;Se++){let lt=re[Se];We(lt[0]+Mt*u,lt[1]+Mt*u,lt[2]+Mt*u)}}n.addGroup(K,s.length/3-K,0)}function ne(){let K=s.length/3,Se=0;Re(tt,Se),Se+=tt.length;for(let lt=0,_e=rt.length;lt<_e;lt++){let Jt=rt[lt];Re(Jt,Se),Se+=Jt.length}n.addGroup(K,s.length/3-K,1)}function Re(K,Se){let lt=K.length;for(;--lt>=0;){let _e=lt,Jt=lt-1;Jt<0&&(Jt=K.length-1);for(let ke=0,be=u+p*2;ke<be;ke++){let O=Mt*ke,I=Mt*(ke+1),yt=Se+_e+O,ye=Se+Jt+O,pe=Se+Jt+I,ue=Se+_e+I;Ze(yt,ye,pe,ue)}}}function Le(K,Se,lt){l.push(K),l.push(Se),l.push(lt)}function We(K,Se,lt){De(K),De(Se),De(lt);let _e=s.length/3,Jt=T.generateTopUV(n,s,_e-3,_e-2,_e-1);Be(Jt[0]),Be(Jt[1]),Be(Jt[2])}function Ze(K,Se,lt,_e){De(K),De(Se),De(_e),De(Se),De(lt),De(_e);let Jt=s.length/3,ke=T.generateSideWallUV(n,s,Jt-6,Jt-3,Jt-2,Jt-1);Be(ke[0]),Be(ke[1]),Be(ke[3]),Be(ke[1]),Be(ke[2]),Be(ke[3])}function De(K){s.push(l[K*3+0]),s.push(l[K*3+1]),s.push(l[K*3+2])}function Be(K){r.push(K.x),r.push(K.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return n2(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new Sh[s.type]().fromJSON(s)),new i(n,t.options)}},e2={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],h=t[s*3],u=t[s*3+1];return[new de(r,a),new de(o,l),new de(h,u)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],h=t[n*3],u=t[n*3+1],f=t[n*3+2],g=t[s*3],d=t[s*3+1],y=t[s*3+2],v=t[r*3],p=t[r*3+1],x=t[r*3+2];return Math.abs(o-u)<Math.abs(a-h)?[new de(a,1-l),new de(h,1-f),new de(g,1-y),new de(v,1-x)]:[new de(o,1-l),new de(u,1-f),new de(d,1-y),new de(p,1-x)]}};function n2(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var Th=class i extends od{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var Ah=class i extends Ln{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],h=[],u=[],f=t,g=(e-t)/s,d=new X,y=new de;for(let v=0;v<=s;v++){for(let p=0;p<=n;p++){let x=r+p/n*a;d.x=f*Math.cos(x),d.y=f*Math.sin(x),l.push(d.x,d.y,d.z),h.push(0,0,1),y.x=(d.x/e+1)/2,y.y=(d.y/e+1)/2,u.push(y.x,y.y)}f+=g}for(let v=0;v<s;v++){let p=v*(n+1);for(let x=0;x<n;x++){let T=x+p,M=T,C=T+n+1,P=T+n+2,L=T+1;o.push(M,C,L),o.push(C,P,L)}}this.setIndex(o),this.setAttribute("position",new en(l,3)),this.setAttribute("normal",new en(h,3)),this.setAttribute("uv",new en(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Ul=class i extends Ln{constructor(t=new Nr([new de(0,.5),new de(-.5,-.5),new de(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(t)===!1)h(t);else for(let u=0;u<t.length;u++)h(t[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new en(s,3)),this.setAttribute("normal",new en(r,3)),this.setAttribute("uv",new en(a,2));function h(u){let f=s.length/3,g=u.extractPoints(e),d=g.shape,y=g.holes;Qs.isClockWise(d)===!1&&(d=d.reverse());for(let p=0,x=y.length;p<x;p++){let T=y[p];Qs.isClockWise(T)===!0&&(y[p]=T.reverse())}let v=Qs.triangulateShape(d,y);for(let p=0,x=y.length;p<x;p++){let T=y[p];d=d.concat(T)}for(let p=0,x=d.length;p<x;p++){let T=d[p];s.push(T.x,T.y,0),r.push(0,0,1),a.push(T.x,T.y)}for(let p=0,x=v.length;p<x;p++){let T=v[p],M=T[0]+f,C=T[1]+f,P=T[2]+f;n.push(M,C,P),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return i2(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let a=e[t.shapes[s]];n.push(a)}return new i(n,t.curveSegments)}};function i2(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var Xi=class i extends Ln{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),h=0,u=[],f=new X,g=new X,d=[],y=[],v=[],p=[];for(let x=0;x<=n;x++){let T=[],M=x/n,C=0;x===0&&a===0?C=.5/e:x===n&&l===Math.PI&&(C=-.5/e);for(let P=0;P<=e;P++){let L=P/e;f.x=-t*Math.cos(s+L*r)*Math.sin(a+M*o),f.y=t*Math.cos(a+M*o),f.z=t*Math.sin(s+L*r)*Math.sin(a+M*o),y.push(f.x,f.y,f.z),g.copy(f).normalize(),v.push(g.x,g.y,g.z),p.push(L+C,1-M),T.push(h++)}u.push(T)}for(let x=0;x<n;x++)for(let T=0;T<e;T++){let M=u[x][T+1],C=u[x][T],P=u[x+1][T],L=u[x+1][T+1];(x!==0||a>0)&&d.push(M,C,L),(x!==n-1||l<Math.PI)&&d.push(C,P,L)}this.setIndex(d),this.setAttribute("position",new en(y,3)),this.setAttribute("normal",new en(v,3)),this.setAttribute("uv",new en(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var Rh=class i extends Ln{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],l=[],h=[],u=new X,f=new X,g=new X;for(let d=0;d<=n;d++)for(let y=0;y<=s;y++){let v=y/s*r,p=d/n*Math.PI*2;f.x=(t+e*Math.cos(p))*Math.cos(v),f.y=(t+e*Math.cos(p))*Math.sin(v),f.z=e*Math.sin(p),o.push(f.x,f.y,f.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),g.subVectors(f,u).normalize(),l.push(g.x,g.y,g.z),h.push(y/s),h.push(d/n)}for(let d=1;d<=n;d++)for(let y=1;y<=s;y++){let v=(s+1)*d+y-1,p=(s+1)*(d-1)+y-1,x=(s+1)*(d-1)+y,T=(s+1)*d+y;a.push(v,p,T),a.push(p,x,T)}this.setIndex(a),this.setAttribute("position",new en(o,3)),this.setAttribute("normal",new en(l,3)),this.setAttribute("uv",new en(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Ch=class i extends Ln{constructor(t=new Mh(new X(-1,-1,0),new X(-1,1,0),new X(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new X,l=new X,h=new de,u=new X,f=[],g=[],d=[],y=[];v(),this.setIndex(y),this.setAttribute("position",new en(f,3)),this.setAttribute("normal",new en(g,3)),this.setAttribute("uv",new en(d,2));function v(){for(let M=0;M<e;M++)p(M);p(r===!1?e:0),T(),x()}function p(M){u=t.getPointAt(M/e,u);let C=a.normals[M],P=a.binormals[M];for(let L=0;L<=s;L++){let B=L/s*Math.PI*2,nt=Math.sin(B),A=-Math.cos(B);l.x=A*C.x+nt*P.x,l.y=A*C.y+nt*P.y,l.z=A*C.z+nt*P.z,l.normalize(),g.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,f.push(o.x,o.y,o.z)}}function x(){for(let M=1;M<=e;M++)for(let C=1;C<=s;C++){let P=(s+1)*(M-1)+(C-1),L=(s+1)*M+(C-1),B=(s+1)*M+C,nt=(s+1)*(M-1)+C;y.push(P,L,nt),y.push(L,B,nt)}}function T(){for(let M=0;M<=e;M++)for(let C=0;C<=s;C++)h.x=M/e,h.y=C/s,d.push(h.x,h.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new Sh[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},Ph=class extends Ln{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],n=new Set,s=new X,r=new X;if(t.index!==null){let a=t.attributes.position,o=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let h=0,u=l.length;h<u;++h){let f=l[h],g=f.start,d=f.count;for(let y=g,v=g+d;y<v;y+=3)for(let p=0;p<3;p++){let x=o.getX(y+p),T=o.getX(y+(p+1)%3);s.fromBufferAttribute(a,x),r.fromBufferAttribute(a,T),W0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let h=0;h<3;h++){let u=3*o+h,f=3*o+(h+1)%3;s.fromBufferAttribute(a,u),r.fromBufferAttribute(a,f),W0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new en(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function W0(i,t,e){let n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}var Lh=class extends gr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new fn(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Ih=class extends gr{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new fn(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Dh=class extends gr{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Hh,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=Sd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function qc(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function s2(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Ia=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},cd=class extends Ia{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Wm,endingEnd:Wm}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Xm:r=t,o=2*e-n;break;case qm:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Xm:a=t,l=2*n-e;break;case qm:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let h=(n-e)*.5,u=this.valueSize;this._weightPrev=h/(e-o),this._weightNext=h/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,h=l-o,u=this._offsetPrev,f=this._offsetNext,g=this._weightPrev,d=this._weightNext,y=(n-e)/(s-e),v=y*y,p=v*y,x=-g*p+2*g*v-g*y,T=(1+g)*p+(-1.5-2*g)*v+(-.5+g)*y+1,M=(-1-d)*p+(1.5+d)*v+.5*y,C=d*p-d*v;for(let P=0;P!==o;++P)r[P]=x*a[u+P]+T*a[h+P]+M*a[l+P]+C*a[f+P];return r}},hd=class extends Ia{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,h=l-o,u=(n-e)/(s-e),f=1-u;for(let g=0;g!==o;++g)r[g]=a[h+g]*f+a[l+g]*u;return r}},ud=class extends Ia{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},nr=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=qc(e,this.TimeBufferType),this.values=qc(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:qc(t.times,Array),values:qc(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new ud(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new hd(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new cd(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Zc:e=this.InterpolantFactoryMethodDiscrete;break;case Jc:e=this.InterpolantFactoryMethodLinear;break;case sf:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Zc;case this.InterpolantFactoryMethodLinear:return Jc;case this.InterpolantFactoryMethodSmooth:return sf}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&s2(s))for(let o=0,l=s.length;o!==l;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===sf,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,h=t[o],u=t[o+1];if(h!==u&&(o!==1||h!==t[0]))if(s)l=!0;else{let f=o*n,g=f-n,d=f+n;for(let y=0;y!==n;++y){let v=e[f+y];if(v!==e[g+y]||v!==e[d+y]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let f=o*n,g=a*n;for(let d=0;d!==n;++d)e[g+d]=e[f+d]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,h=0;h!==n;++h)e[l+h]=e[o+h];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};nr.prototype.TimeBufferType=Float32Array;nr.prototype.ValueBufferType=Float32Array;nr.prototype.DefaultInterpolation=Jc;var Io=class extends nr{};Io.prototype.ValueTypeName="bool";Io.prototype.ValueBufferType=Array;Io.prototype.DefaultInterpolation=Zc;Io.prototype.InterpolantFactoryMethodLinear=void 0;Io.prototype.InterpolantFactoryMethodSmooth=void 0;var fd=class extends nr{};fd.prototype.ValueTypeName="color";var dd=class extends nr{};dd.prototype.ValueTypeName="number";var pd=class extends Ia{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),h=t*o;for(let u=h+o;h!==u;h+=4)ys.slerpFlat(r,0,a,h-o,a,h,l);return r}},Nl=class extends nr{InterpolantFactoryMethodLinear(t){return new pd(this.times,this.values,this.getValueSize(),t)}};Nl.prototype.ValueTypeName="quaternion";Nl.prototype.DefaultInterpolation=Jc;Nl.prototype.InterpolantFactoryMethodSmooth=void 0;var Do=class extends nr{};Do.prototype.ValueTypeName="string";Do.prototype.ValueBufferType=Array;Do.prototype.DefaultInterpolation=Zc;Do.prototype.InterpolantFactoryMethodLinear=void 0;Do.prototype.InterpolantFactoryMethodSmooth=void 0;var md=class extends nr{};md.prototype.ValueTypeName="vector";var gd=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,h=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return h.push(u,f),this},this.removeHandler=function(u){let f=h.indexOf(u);return f!==-1&&h.splice(f,2),this},this.getHandler=function(u){for(let f=0,g=h.length;f<g;f+=2){let d=h[f],y=h[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return y}return null}}},r2=new gd,xd=class{constructor(t){this.manager=t!==void 0?t:r2,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};xd.DEFAULT_MATERIAL_NAME="__DEFAULT";var Uh=class extends vi{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new fn(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},Nh=class extends Uh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vi.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fn(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Lf=new Nn,X0=new X,q0=new X,yd=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.map=null,this.mapPass=null,this.matrix=new Nn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new wl,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new Fn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;X0.setFromMatrixPosition(t.matrixWorld),e.position.copy(X0),q0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(q0),e.updateMatrixWorld(),Lf.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Lf),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Lf)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var _d=class extends yd{constructor(){super(new uh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Oh=class extends Uh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vi.DEFAULT_UP),this.updateMatrix(),this.target=new vi,this.shadow=new _d}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Fh=class extends Ln{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Pd="\\[\\]\\.:\\/",o2=new RegExp("["+Pd+"]","g"),Ld="[^"+Pd+"]",a2="[^"+Pd.replace("\\.","")+"]",l2=/((?:WC+[\/:])*)/.source.replace("WC",Ld),c2=/(WCOD+)?/.source.replace("WCOD",a2),h2=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Ld),u2=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Ld),f2=new RegExp("^"+l2+c2+h2+u2+"$"),d2=["material","materials","bones","map"],vd=class{constructor(t,e,n){let s=n||fi.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},fi=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(o2,"")}static parseTrackName(t){let e=f2.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);d2.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===h){h=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(h!==void 0){if(t[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let a=t[s];if(a===void 0){let h=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};fi.Composite=vd;fi.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};fi.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};fi.prototype.GetterByBindingType=[fi.prototype._getValue_direct,fi.prototype._getValue_array,fi.prototype._getValue_arrayElement,fi.prototype._getValue_toArray];fi.prototype.SetterByBindingTypeAndVersioning=[[fi.prototype._setValue_direct,fi.prototype._setValue_direct_setNeedsUpdate,fi.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[fi.prototype._setValue_array,fi.prototype._setValue_array_setNeedsUpdate,fi.prototype._setValue_array_setMatrixWorldNeedsUpdate],[fi.prototype._setValue_arrayElement,fi.prototype._setValue_arrayElement_setNeedsUpdate,fi.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[fi.prototype._setValue_fromArray,fi.prototype._setValue_fromArray_setNeedsUpdate,fi.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var V2=new Float32Array(1);var Uo=class extends gh{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}};var Bh=class{constructor(t,e,n=0,s=1/0){this.ray=new Co(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new El,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return Md(t,this,n,e),n.sort(Y0),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)Md(t[s],this,n,e);return n.sort(Y0),n}};function Y0(i,t){return i.distance-t.distance}function Md(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,a=s.length;r<a;r++)Md(s[r],t,e,!0)}}var Ol=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Li(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var $0=new X,Yc=new X,zh=class{constructor(t=new X,e=new X){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){$0.subVectors(t,this.start),Yc.subVectors(this.end,this.start);let n=Yc.dot(Yc),r=Yc.dot($0)/n;return e&&(r=Li(r,0,1)),r}closestPointToPoint(t,e,n){let s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var yg={type:"change"},Id={type:"start"},_g={type:"end"},Yh=new Co,vg=new Js,p2=Math.cos(70*Gh.DEG2RAD),$h=class extends mr{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new X,this.cursor=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:No.ROTATE,MIDDLE:No.DOLLY,RIGHT:No.PAN},this.touches={ONE:Oo.ROTATE,TWO:Oo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(G){G.addEventListener("keydown",ue),this._domElementKeyEvents=G},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ue),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(yg),n.update(),r=s.NONE},this.update=(function(){let G=new X,fe=new ys().setFromUnitVectors(t.up,new X(0,1,0)),ve=fe.clone().invert(),et=new X,dt=new ys,jt=new X,Qt=2*Math.PI;return function(ct=null){let V=n.object.position;G.copy(V).sub(n.target),G.applyQuaternion(fe),o.setFromVector3(G),n.autoRotate&&r===s.NONE&&rt(A(ct)),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let It=n.minAzimuthAngle,zt=n.maxAzimuthAngle;isFinite(It)&&isFinite(zt)&&(It<-Math.PI?It+=Qt:It>Math.PI&&(It-=Qt),zt<-Math.PI?zt+=Qt:zt>Math.PI&&(zt-=Qt),It<=zt?o.theta=Math.max(It,Math.min(zt,o.theta)):o.theta=o.theta>(It+zt)/2?Math.max(It,o.theta):Math.min(zt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&L||n.object.isOrthographicCamera?o.radius=At(o.radius):o.radius=At(o.radius*h),G.setFromSpherical(o),G.applyQuaternion(ve),V.copy(n.target).add(G),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0));let oe=!1;if(n.zoomToCursor&&L){let ce=null;if(n.object.isPerspectiveCamera){let Ue=G.length();ce=At(Ue*h);let Kt=Ue-ce;n.object.position.addScaledVector(C,Kt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let Ue=new X(P.x,P.y,0);Ue.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),oe=!0;let Kt=new X(P.x,P.y,0);Kt.unproject(n.object),n.object.position.sub(Kt).add(Ue),n.object.updateMatrixWorld(),ce=G.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ce!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ce).add(n.object.position):(Yh.origin.copy(n.object.position),Yh.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Yh.direction))<p2?t.lookAt(n.target):(vg.setFromNormalAndCoplanarPoint(n.object.up,n.target),Yh.intersectPlane(vg,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),oe=!0);return h=1,L=!1,oe||et.distanceToSquared(n.object.position)>a||8*(1-dt.dot(n.object.quaternion))>a||jt.distanceToSquared(n.target)>0?(n.dispatchEvent(yg),et.copy(n.object.position),dt.copy(n.object.quaternion),jt.copy(n.target),!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",we),n.domElement.removeEventListener("pointerdown",be),n.domElement.removeEventListener("pointercancel",I),n.domElement.removeEventListener("wheel",pe),n.domElement.removeEventListener("pointermove",O),n.domElement.removeEventListener("pointerup",I),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ue),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new Ol,l=new Ol,h=1,u=new X,f=new de,g=new de,d=new de,y=new de,v=new de,p=new de,x=new de,T=new de,M=new de,C=new X,P=new de,L=!1,B=[],nt={};function A(G){return G!==null?2*Math.PI/60*n.autoRotateSpeed*G:2*Math.PI/60/60*n.autoRotateSpeed}function w(G){let fe=Math.abs(G)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*fe)}function rt(G){l.theta-=G}function Et(G){l.phi-=G}let re=(function(){let G=new X;return function(ve,et){G.setFromMatrixColumn(et,0),G.multiplyScalar(-ve),u.add(G)}})(),tt=(function(){let G=new X;return function(ve,et){n.screenSpacePanning===!0?G.setFromMatrixColumn(et,1):(G.setFromMatrixColumn(et,0),G.crossVectors(n.object.up,G)),G.multiplyScalar(ve),u.add(G)}})(),ft=(function(){let G=new X;return function(ve,et){let dt=n.domElement;if(n.object.isPerspectiveCamera){let jt=n.object.position;G.copy(jt).sub(n.target);let Qt=G.length();Qt*=Math.tan(n.object.fov/2*Math.PI/180),re(2*ve*Qt/dt.clientHeight,n.object.matrix),tt(2*et*Qt/dt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(re(ve*(n.object.right-n.object.left)/n.object.zoom/dt.clientWidth,n.object.matrix),tt(et*(n.object.top-n.object.bottom)/n.object.zoom/dt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function Mt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Wt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Zt(G,fe){if(!n.zoomToCursor)return;L=!0;let ve=n.domElement.getBoundingClientRect(),et=G-ve.left,dt=fe-ve.top,jt=ve.width,Qt=ve.height;P.x=et/jt*2-1,P.y=-(dt/Qt)*2+1,C.set(P.x,P.y,1).unproject(n.object).sub(n.object.position).normalize()}function At(G){return Math.max(n.minDistance,Math.min(n.maxDistance,G))}function Yt(G){f.set(G.clientX,G.clientY)}function le(G){Zt(G.clientX,G.clientX),x.set(G.clientX,G.clientY)}function Me(G){y.set(G.clientX,G.clientY)}function Rt(G){g.set(G.clientX,G.clientY),d.subVectors(g,f).multiplyScalar(n.rotateSpeed);let fe=n.domElement;rt(2*Math.PI*d.x/fe.clientHeight),Et(2*Math.PI*d.y/fe.clientHeight),f.copy(g),n.update()}function Ct(G){T.set(G.clientX,G.clientY),M.subVectors(T,x),M.y>0?Mt(w(M.y)):M.y<0&&Wt(w(M.y)),x.copy(T),n.update()}function ne(G){v.set(G.clientX,G.clientY),p.subVectors(v,y).multiplyScalar(n.panSpeed),ft(p.x,p.y),y.copy(v),n.update()}function Re(G){Zt(G.clientX,G.clientY),G.deltaY<0?Wt(w(G.deltaY)):G.deltaY>0&&Mt(w(G.deltaY)),n.update()}function Le(G){let fe=!1;switch(G.code){case n.keys.UP:G.ctrlKey||G.metaKey||G.shiftKey?Et(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(0,n.keyPanSpeed),fe=!0;break;case n.keys.BOTTOM:G.ctrlKey||G.metaKey||G.shiftKey?Et(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(0,-n.keyPanSpeed),fe=!0;break;case n.keys.LEFT:G.ctrlKey||G.metaKey||G.shiftKey?rt(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(n.keyPanSpeed,0),fe=!0;break;case n.keys.RIGHT:G.ctrlKey||G.metaKey||G.shiftKey?rt(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(-n.keyPanSpeed,0),fe=!0;break}fe&&(G.preventDefault(),n.update())}function We(G){if(B.length===1)f.set(G.pageX,G.pageY);else{let fe=gn(G),ve=.5*(G.pageX+fe.x),et=.5*(G.pageY+fe.y);f.set(ve,et)}}function Ze(G){if(B.length===1)y.set(G.pageX,G.pageY);else{let fe=gn(G),ve=.5*(G.pageX+fe.x),et=.5*(G.pageY+fe.y);y.set(ve,et)}}function De(G){let fe=gn(G),ve=G.pageX-fe.x,et=G.pageY-fe.y,dt=Math.sqrt(ve*ve+et*et);x.set(0,dt)}function Be(G){n.enableZoom&&De(G),n.enablePan&&Ze(G)}function K(G){n.enableZoom&&De(G),n.enableRotate&&We(G)}function Se(G){if(B.length==1)g.set(G.pageX,G.pageY);else{let ve=gn(G),et=.5*(G.pageX+ve.x),dt=.5*(G.pageY+ve.y);g.set(et,dt)}d.subVectors(g,f).multiplyScalar(n.rotateSpeed);let fe=n.domElement;rt(2*Math.PI*d.x/fe.clientHeight),Et(2*Math.PI*d.y/fe.clientHeight),f.copy(g)}function lt(G){if(B.length===1)v.set(G.pageX,G.pageY);else{let fe=gn(G),ve=.5*(G.pageX+fe.x),et=.5*(G.pageY+fe.y);v.set(ve,et)}p.subVectors(v,y).multiplyScalar(n.panSpeed),ft(p.x,p.y),y.copy(v)}function _e(G){let fe=gn(G),ve=G.pageX-fe.x,et=G.pageY-fe.y,dt=Math.sqrt(ve*ve+et*et);T.set(0,dt),M.set(0,Math.pow(T.y/x.y,n.zoomSpeed)),Mt(M.y),x.copy(T);let jt=(G.pageX+fe.x)*.5,Qt=(G.pageY+fe.y)*.5;Zt(jt,Qt)}function Jt(G){n.enableZoom&&_e(G),n.enablePan&&lt(G)}function ke(G){n.enableZoom&&_e(G),n.enableRotate&&Se(G)}function be(G){n.enabled!==!1&&(B.length===0&&(n.domElement.setPointerCapture(G.pointerId),n.domElement.addEventListener("pointermove",O),n.domElement.addEventListener("pointerup",I)),Je(G),G.pointerType==="touch"?Xe(G):yt(G))}function O(G){n.enabled!==!1&&(G.pointerType==="touch"?qt(G):ye(G))}function I(G){nn(G),B.length===0&&(n.domElement.releasePointerCapture(G.pointerId),n.domElement.removeEventListener("pointermove",O),n.domElement.removeEventListener("pointerup",I)),n.dispatchEvent(_g),r=s.NONE}function yt(G){let fe;switch(G.button){case 0:fe=n.mouseButtons.LEFT;break;case 1:fe=n.mouseButtons.MIDDLE;break;case 2:fe=n.mouseButtons.RIGHT;break;default:fe=-1}switch(fe){case No.DOLLY:if(n.enableZoom===!1)return;le(G),r=s.DOLLY;break;case No.ROTATE:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enablePan===!1)return;Me(G),r=s.PAN}else{if(n.enableRotate===!1)return;Yt(G),r=s.ROTATE}break;case No.PAN:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enableRotate===!1)return;Yt(G),r=s.ROTATE}else{if(n.enablePan===!1)return;Me(G),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Id)}function ye(G){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Rt(G);break;case s.DOLLY:if(n.enableZoom===!1)return;Ct(G);break;case s.PAN:if(n.enablePan===!1)return;ne(G);break}}function pe(G){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(G.preventDefault(),n.dispatchEvent(Id),Re(G),n.dispatchEvent(_g))}function ue(G){n.enabled===!1||n.enablePan===!1||Le(G)}function Xe(G){switch(me(G),B.length){case 1:switch(n.touches.ONE){case Oo.ROTATE:if(n.enableRotate===!1)return;We(G),r=s.TOUCH_ROTATE;break;case Oo.PAN:if(n.enablePan===!1)return;Ze(G),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Oo.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Be(G),r=s.TOUCH_DOLLY_PAN;break;case Oo.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;K(G),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Id)}function qt(G){switch(me(G),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Se(G),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;lt(G),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Jt(G),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ke(G),n.update();break;default:r=s.NONE}}function we(G){n.enabled!==!1&&G.preventDefault()}function Je(G){B.push(G.pointerId)}function nn(G){delete nt[G.pointerId];for(let fe=0;fe<B.length;fe++)if(B[fe]==G.pointerId){B.splice(fe,1);return}}function me(G){let fe=nt[G.pointerId];fe===void 0&&(fe=new de,nt[G.pointerId]=fe),fe.set(G.pageX,G.pageY)}function gn(G){let fe=G.pointerId===B[0]?B[1]:B[0];return nt[fe]}n.domElement.addEventListener("contextmenu",we),n.domElement.addEventListener("pointerdown",be),n.domElement.addEventListener("pointercancel",I),n.domElement.addEventListener("wheel",pe,{passive:!1}),this.update()}};function Mg(i,t,e){let n=new $h(i,t),s=new Set,r=null,a=()=>{r?.gesture||(r&&(r.gesture=!0),n.dispatchEvent({type:"gesturestart"}))};n.stopMotion=()=>{let l=i.position.clone(),h=n.target.clone(),u=n.enableDamping;n.enableDamping=!1,n.update(),i.position.copy(l),n.target.copy(h),n.enableDamping=u,n.update()},t.addEventListener("pointerdown",l=>{s.size||(r={id:l.pointerId,x:l.clientX,y:l.clientY,time:l.timeStamp,primary:l.button===0,tolerance:l.pointerType==="mouse"?5:8,label:l.target.closest?.(".maplabel button"),moved:!1,multiple:!1}),s.add(l.pointerId),t.setPointerCapture(l.pointerId),r&&s.size>1&&(r.multiple=!0,a())}),t.addEventListener("pointermove",l=>{r&&r.id===l.pointerId&&Math.hypot(l.clientX-r.x,l.clientY-r.y)>=r.tolerance&&(r.moved=!0,a())}),t.addEventListener("pointerup",l=>{let h=s.has(l.pointerId)&&s.size===1&&r&&r.id===l.pointerId&&r.primary&&!r.multiple&&!r.moved&&l.timeStamp-r.time<550&&Math.hypot(l.clientX-r.x,l.clientY-r.y)<r.tolerance,u=r?.label;s.delete(l.pointerId),s.size||(r=null),h&&(u?u.isConnected&&u.click():e(l))});let o=l=>{s.delete(l.pointerId)&&(r=null)};return t.addEventListener("pointercancel",o),t.addEventListener("lostpointercapture",o),t.addEventListener("wheel",a,{passive:!0}),t.addEventListener("click",l=>{(l.detail>0||l.pointerType)&&l.target.closest?.(".maplabel button")&&(l.preventDefault(),l.stopPropagation())},!0),n}function bg(i,t,{now:e=()=>performance.now(),reducedMotion:n=!1}={}){let s=null,r=()=>{s=null};function a(l,h=1200,u=null,f=0){r(),t.stopMotion?.(),s={from:i.position.clone(),targetFrom:t.target.clone(),pos:l.pos.clone(),target:l.target.clone(),start:e(),duration:n?0:h,onDone:u,arrivalDelay:n?0:f},s.duration||o(s.start)}function o(l){if(!s)return!1;let h=s,u=h.duration?Math.max(0,Math.min(1,(l-h.start)/h.duration)):1,f=u<.5?4*u*u*u:1-(-2*u+2)**3/2;return i.position.lerpVectors(h.from,h.pos,f),t.target.lerpVectors(h.targetFrom,h.target,f),i.position.y+=Math.sin(u*Math.PI)*Math.min(180,h.from.distanceTo(h.pos)*.12),u===1&&l>=h.start+h.duration+h.arrivalDelay&&(s=null,h.onDone?.()),!0}return{move:a,update:o,cancel:r,get active(){return!!s},get destination(){return s}}}var Fo=class extends vi{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new de(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof Element&&e.element.parentNode!==null&&e.element.parentNode.removeChild(e.element)})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}},Ua=new X,Sg=new Nn,Eg=new Nn,wg=new X,Tg=new X,Zh=class{constructor(t={}){let e=this,n,s,r,a,o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:n,height:s}},this.render=function(d,y){d.matrixWorldAutoUpdate===!0&&d.updateMatrixWorld(),y.parent===null&&y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),Sg.copy(y.matrixWorldInverse),Eg.multiplyMatrices(y.projectionMatrix,Sg),h(d,d,y),g(d)},this.setSize=function(d,y){n=d,s=y,r=n/2,a=s/2,l.style.width=d+"px",l.style.height=y+"px"};function h(d,y,v){if(d.isCSS2DObject){Ua.setFromMatrixPosition(d.matrixWorld),Ua.applyMatrix4(Eg);let p=d.visible===!0&&Ua.z>=-1&&Ua.z<=1&&d.layers.test(v.layers)===!0;if(d.element.style.display=p===!0?"":"none",p===!0){d.onBeforeRender(e,y,v);let T=d.element;T.style.transform="translate("+-100*d.center.x+"%,"+-100*d.center.y+"%)translate("+(Ua.x*r+r)+"px,"+(-Ua.y*a+a)+"px)",T.parentNode!==l&&l.appendChild(T),d.onAfterRender(e,y,v)}let x={distanceToCameraSquared:u(v,d)};o.objects.set(d,x)}for(let p=0,x=d.children.length;p<x;p++)h(d.children[p],y,v)}function u(d,y){return wg.setFromMatrixPosition(d.matrixWorld),Tg.setFromMatrixPosition(y.matrixWorld),wg.distanceToSquared(Tg)}function f(d){let y=[];return d.traverse(function(v){v.isCSS2DObject&&y.push(v)}),y}function g(d){let y=f(d).sort(function(p,x){if(p.renderOrder!==x.renderOrder)return x.renderOrder-p.renderOrder;let T=o.objects.get(p).distanceToCameraSquared,M=o.objects.get(x).distanceToCameraSquared;return T-M}),v=y.length;for(let p=0,x=y.length;p<x;p++)y[p].element.style.zIndex=v-p}}};function Ag(){let i=document.querySelector("#gesture-tour"),t=document.querySelector("#help-open"),e=document.querySelector("#tour-skip"),n=[...i.querySelectorAll(".tour-step")],s=[...i.querySelectorAll(".tour-progress i")],r=matchMedia("(prefers-reduced-motion:reduce)"),a=[],o;function l(){a.forEach(clearTimeout),a=[],cancelAnimationFrame(o)}function h(g){n.forEach((d,y)=>{d.classList.toggle("active",y===g),d.setAttribute("aria-hidden",String(y!==g)),s[y].classList.toggle("active",y===g)})}function u(){l(),i.classList.remove("show"),i.contains(document.activeElement)&&t.focus({preventScroll:!0}),a.push(setTimeout(()=>{i.hidden=!0},r.matches?0:600))}function f(){l(),i.classList.remove("show"),n.forEach(g=>g.classList.remove("active")),i.hidden=!1,i.offsetWidth,h(0),o=requestAnimationFrame(()=>i.classList.add("show")),a.push(setTimeout(()=>h(1),3800)),a.push(setTimeout(()=>h(2),6500)),a.push(setTimeout(u,9300))}return t.addEventListener("click",f),e.addEventListener("click",u),document.addEventListener("keydown",g=>{g.key==="Escape"&&!i.hidden&&u()}),document.addEventListener("pointerdown",g=>{!i.hidden&&g.target instanceof Element&&!g.target.closest("#gesture-tour,#help-open")&&u()},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.hidden&&u()}),{start:f,stop:u}}var Rg=new es,Jh=new X,Na=class extends Fh{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new en(t,3)),this.setAttribute("uv",new en(e,2))}applyMatrix4(t){let e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new Uo(e,6,1);return this.setAttribute("instanceStart",new er(n,3,0)),this.setAttribute("instanceEnd",new er(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new Uo(e,6,1);return this.setAttribute("instanceColorStart",new er(n,3,0)),this.setAttribute("instanceColorEnd",new er(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Ph(t.geometry)),this}fromLineSegments(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),Rg.setFromBufferAttribute(e),this.boundingBox.union(Rg))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new _s),this.boundingBox===null&&this.computeBoundingBox();let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Jh.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Jh)),Jh.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Jh));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}};Ae.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new de(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};rs.line={uniforms:Wh.merge([Ae.common,Ae.fog,Ae.line]),vertexShader:`
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
		`};var oo=class extends tr{constructor(t){super({type:"LineMaterial",uniforms:Wh.clone(rs.line.uniforms),vertexShader:rs.line.vertexShader,fragmentShader:rs.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}};var Cg=new X,Pg=new X,qi=new Fn,Yi=new Fn,xr=new Fn,Dd=new X,Ud=new Nn,$i=new zh,Lg=new X,jh=new es,Kh=new _s,yr=new Fn,_r,Bo;function Ig(i,t,e){return yr.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),yr.multiplyScalar(1/yr.w),yr.x=Bo/e.width,yr.y=Bo/e.height,yr.applyMatrix4(i.projectionMatrixInverse),yr.multiplyScalar(1/yr.w),Math.abs(Math.max(yr.x,yr.y))}function m2(i,t){let e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){$i.start.fromBufferAttribute(s,o),$i.end.fromBufferAttribute(r,o),$i.applyMatrix4(e);let h=new X,u=new X;_r.distanceSqToSegment($i.start,$i.end,u,h),u.distanceTo(h)<Bo*.5&&t.push({point:u,pointOnLine:h,distance:_r.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function g2(i,t,e){let n=t.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,h=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),f=-t.near;_r.at(1,xr),xr.w=1,xr.applyMatrix4(t.matrixWorldInverse),xr.applyMatrix4(n),xr.multiplyScalar(1/xr.w),xr.x*=r.x/2,xr.y*=r.y/2,xr.z=0,Dd.copy(xr),Ud.multiplyMatrices(t.matrixWorldInverse,a);for(let g=0,d=u;g<d;g++){if(qi.fromBufferAttribute(l,g),Yi.fromBufferAttribute(h,g),qi.w=1,Yi.w=1,qi.applyMatrix4(Ud),Yi.applyMatrix4(Ud),qi.z>f&&Yi.z>f)continue;if(qi.z>f){let M=qi.z-Yi.z,C=(qi.z-f)/M;qi.lerp(Yi,C)}else if(Yi.z>f){let M=Yi.z-qi.z,C=(Yi.z-f)/M;Yi.lerp(qi,C)}qi.applyMatrix4(n),Yi.applyMatrix4(n),qi.multiplyScalar(1/qi.w),Yi.multiplyScalar(1/Yi.w),qi.x*=r.x/2,qi.y*=r.y/2,Yi.x*=r.x/2,Yi.y*=r.y/2,$i.start.copy(qi),$i.start.z=0,$i.end.copy(Yi),$i.end.z=0;let v=$i.closestPointToPointParameter(Dd,!0);$i.at(v,Lg);let p=Gh.lerp(qi.z,Yi.z,v),x=p>=-1&&p<=1,T=Dd.distanceTo(Lg)<Bo*.5;if(x&&T){$i.start.fromBufferAttribute(l,g),$i.end.fromBufferAttribute(h,g),$i.start.applyMatrix4(a),$i.end.applyMatrix4(a);let M=new X,C=new X;_r.distanceSqToSegment($i.start,$i.end,C,M),e.push({point:C,pointOnLine:M,distance:_r.origin.distanceTo(C),object:i,face:null,faceIndex:g,uv:null,uv1:null})}}}var Qh=class extends Ke{constructor(t=new Na,e=new oo({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let a=0,o=0,l=e.count;a<l;a++,o+=2)Cg.fromBufferAttribute(e,a),Pg.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Cg.distanceTo(Pg);let r=new Uo(s,2,1);return t.setAttribute("instanceDistanceStart",new er(r,1,0)),t.setAttribute("instanceDistanceEnd",new er(r,1,1)),this}raycast(t,e){let n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;_r=t.ray;let a=this.matrixWorld,o=this.geometry,l=this.material;Bo=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),Kh.copy(o.boundingSphere).applyMatrix4(a);let h;if(n)h=Bo*.5;else{let f=Math.max(s.near,Kh.distanceToPoint(_r.origin));h=Ig(s,f,l.resolution)}if(Kh.radius+=h,_r.intersectsSphere(Kh)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),jh.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=Bo*.5;else{let f=Math.max(s.near,jh.distanceToPoint(_r.origin));u=Ig(s,f,l.resolution)}jh.expandByScalar(u),_r.intersectsBox(jh)!==!1&&(n?m2(this,e):g2(this,s,e))}};var Oa=class extends Na{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setPositions(n),this}setColors(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setColors(n),this}fromLine(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}};var tu=class extends Qh{constructor(t=new Oa,e=new oo({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}};function ao(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ln,h=0;for(let u=0;u<i.length;++u){let f=i[u],g=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),g++}if(g!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(h,d,u),h+=d}}if(e){let u=0,f=[];for(let g=0;g<i.length;++g){let d=i[g].index;for(let y=0;y<d.count;++y)f.push(d.getX(y)+u);u+=i[g].attributes.position.count}l.setIndex(f)}for(let u in r){let f=Dg(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(let u in a){let f=a[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let g=0;g<f;++g){let d=[];for(let v=0;v<a[u].length;++v)d.push(a[u][v][g]);let y=Dg(d);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(y)}}return l}function Dg(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){let u=i[h];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}let a=new t(r),o=0;for(let h=0;h<i.length;++h)a.set(i[h].array,o),o+=i[h].array.length;let l=new Zn(a,e,n);return s!==void 0&&(l.gpuType=s),l}function Ug(i,t=1e-4){t=Math.max(t,Number.EPSILON);let e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),l={},h={},u=[],f=["getX","getY","getZ","getW"],g=["setX","setY","setZ","setW"];for(let T=0,M=o.length;T<M;T++){let C=o[T],P=i.attributes[C];l[C]=new Zn(new P.array.constructor(P.count*P.itemSize),P.itemSize,P.normalized);let L=i.morphAttributes[C];L&&(h[C]=new Zn(new L.array.constructor(L.count*L.itemSize),L.itemSize,L.normalized))}let d=t*.5,y=Math.log10(1/t),v=Math.pow(10,y),p=d*v;for(let T=0;T<r;T++){let M=n?n.getX(T):T,C="";for(let P=0,L=o.length;P<L;P++){let B=o[P],nt=i.getAttribute(B),A=nt.itemSize;for(let w=0;w<A;w++)C+=`${~~(nt[f[w]](M)*v+p)},`}if(C in e)u.push(e[C]);else{for(let P=0,L=o.length;P<L;P++){let B=o[P],nt=i.getAttribute(B),A=i.morphAttributes[B],w=nt.itemSize,rt=l[B],Et=h[B];for(let re=0;re<w;re++){let tt=f[re],ft=g[re];if(rt[ft](a,nt[tt](M)),A)for(let Mt=0,Wt=A.length;Mt<Wt;Mt++)Et[Mt][ft](a,A[Mt][tt](M))}}e[C]=a,u.push(a),a++}}let x=i.clone();for(let T in i.attributes){let M=l[T];if(x.setAttribute(T,new Zn(M.array.slice(0,a*M.itemSize),M.itemSize,M.normalized)),T in h)for(let C=0;C<h[T].length;C++){let P=h[T][C];x.morphAttributes[T][C]=new Zn(P.array.slice(0,a*P.itemSize),P.itemSize,P.normalized)}}return x.setIndex(u),x}var Nd=new X(-.4,.85,.35).normalize();function eu(i,t,e=0,n=0,s=0){let r=i.index?i.toNonIndexed():i;r.deleteAttribute("uv"),r.translate(e,n,s),r.computeVertexNormals();let a=new fn(t),o=r.attributes.normal,l=new Float32Array(o.count*3);for(let h=0;h<o.count;h++){let u=.62+.38*Math.max(0,o.getX(h)*Nd.x+o.getY(h)*Nd.y+o.getZ(h)*Nd.z);l[h*3]=a.r*u,l[h*3+1]=a.g*u,l[h*3+2]=a.b*u}return r.deleteAttribute("normal"),r.setAttribute("color",new Zn(l,3)),r}var ii=(i,t,e,n,s,r,a)=>eu(new Ri(i,t,e),n,s,r,a),Ng="#e2862b",x2="#f0c8a0",y2="#3b4a63",_2="#7c5b3c",Og="#f3e6c4",zo="#466266",Bg="#943f2d",zg="#eee8d8",Fg="#2e6fd0",v2="#7a4fc9",Od="#26282a";function M2(i){let t=new Pn;t.add(new Ke(ao([ii(.3,.36,.19,Ng,0,.64,0),ii(.22,.27,.1,_2,0,.66,.14),ii(.08,.33,.1,"#d27a22",-.195,.625,0),ii(.08,.33,.1,"#d27a22",.195,.625,0),eu(new Xi(.115,8,6),x2,0,.91,0),eu(new Wi(.17,.17,.025,10),Og,0,.975,0),eu(new Wi(.09,.11,.08,10),Og,0,1.02,0)]),i));let e=s=>{let r=new Ke(ii(.11,.44,.13,y2,0,-.22,0),i);return r.position.set(s,.46,0),t.add(r),r},n=[e(-.075),e(.075)];return{group:t,px:34,real:1.65,base:[Ng,1,1],box:[-.32,-1.12,.32,.22],swing(s){n[0].rotation.x=s*.55,n[1].rotation.x=-s*.55}}}function b2(i){let t=new Pn;return t.add(new Ke(ao([ii(.34,.27,1,Fg,0,.195,0),ii(.352,.1,.8,zo,0,.255,.04),ii(.3,.11,.02,zo,0,.25,-.505),ii(.26,.09,.02,zo,0,.26,.505),ii(.351,.025,.98,"#f7f5ee",0,.13,0),ii(.28,.03,.86,"#d9e6f7",0,.345,.02),ii(.36,.1,.14,Od,0,.06,-.32),ii(.36,.1,.14,Od,0,.06,.32),ii(.05,.03,.01,"#ffe9a8",-.11,.12,-.505),ii(.05,.03,.01,"#ffe9a8",.11,.12,-.505)]),i)),{group:t,px:64,real:11,base:[Fg,1.05,1.55],pitch:!0,box:[-.55,-.5,.55,.28]}}function S2(i){let t=new Pn;return t.add(new Ke(ao([ii(.3,.3,.8,zg,0,.21,0),ii(.312,.12,.7,zo,0,.25,0),ii(.26,.1,.012,zo,0,.25,-.405),ii(.26,.1,.012,zo,0,.25,.405),ii(.32,.05,.84,Bg,0,.385,0),ii(.24,.06,.6,Od,0,.03,0)]),i)),{group:t,px:64,real:13,base:[v2,.95,1.3],pitch:!0,box:[-.5,-.55,.5,.28]}}function E2(i){let t=new Pn;return t.add(new Ke(ao([ii(.12,.07,.2,"#3e514c",0,-.035,0),ii(.035,.24,.035,"#594937",0,-.19,0),ii(.44,.38,.38,Bg,0,-.5,0),ii(.452,.14,.392,zo,0,-.46,0),ii(.36,.04,.32,zg,0,-.29,0)]),i)),{group:t,px:76,real:3.8,box:[-.3,-.12,.3,.72]}}function kg(i){let t=new Pn;t.visible=!1,t.renderOrder=1e6,i.add(t);let e=new os({vertexColors:!0,transparent:!0,fog:!1,toneMapped:!1}),n=new os({vertexColors:!0,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}),s=(p,x,T)=>{let M=new fn(x),C=p.attributes.position.count,P=new Float32Array(C*4);for(let L=0;L<C;L++)P.set([M.r,M.g,M.b,T],L*4);return p.deleteAttribute("uv"),p.deleteAttribute("normal"),p.setAttribute("color",new Zn(P,4)),p},r=([p,x,T])=>new Ke(ao([s(new wh(.34,24),p,.32),s(new Ah(.34,.42,24),"#ffffff",.92)]).rotateX(-Math.PI/2).scale(x,1,T).translate(0,.005,0),n),a={walk:M2(e),bus:b2(e),funicular:S2(e),cable:E2(e)};for(let p of Object.values(a))p.group.rotation.order="YXZ",p.group.visible=!1,t.add(p.group),p.base&&p.group.add(r(p.base));let o=-1,l=p=>{let x=p.info.render.frame;x!==o&&(o=x,p.state.buffers.depth.setMask(!0),p.clearDepth())};t.traverse(p=>{p.isGroup?p.renderOrder=1e6:p.isMesh&&(p.onBeforeRender=l,p.renderOrder=p.material===e?1:0)});let h=null,u=0,f=null,g=0,d=0,y=0,v=new X;return{get visible(){return t.visible},get mode(){return h},show(p,x){p!==h&&(h&&(a[h].group.visible=!1),h=p,a[h].group.visible=!0,t.visible=!0,u=x)},hide(){h&&(a[h].group.visible=!1),t.visible=!1,h=null,f=null,d=0},update(p,x,T,M,C,P,L){if(!h)return;let B=a[h],nt=Math.min(1,(C-u)/320),A=nt<1?.35+.65*(1+2.2*(nt-1)**3+1.2*(nt-1)**2):1,w=Math.max(B.real,B.px/L);if(y=w*L,t.position.copy(p),t.scale.setScalar(w*A),x!==null)if(f===null)f=x;else{let rt=Math.atan2(Math.sin(x-f),Math.cos(x-f));f+=rt*Math.min(1,P*10)}d+=((M?1:0)-d)*Math.min(1,P*8),M&&(g+=P*Math.PI*2*2.3),B.group.rotation.set(B.pitch?Math.max(-.5,Math.min(.5,T)):0,-(f??0),h==="cable"?Math.sin(C/320)*.05*d:0),B.swing?.(Math.sin(g)*d)},screenBox(p,x,T){if(!t.visible||!h||(v.copy(t.position).project(p),v.z<-1||v.z>1))return null;let M=(v.x+1)/2*x,C=(1-v.y)/2*T,P=a[h].box,L=y;return[M+P[0]*L,C+P[1]*L,M+P[2]*L,C+P[3]*L]}}}var Hg={walk:{name:"\u6B65\u884C",color:"#e2862b"},funicular:{name:"\u7F06\u8F66",color:"#7a4fc9"},cable:{name:"\u7D22\u9053",color:"#7a4fc9"},bus:{name:"\u666F\u4EA4\u8F66",color:"#2e6fd0"}},Fd={walk:1,funicular:1.3,cable:1.6,bus:2.5},w2={walk:1,funicular:1.3,cable:1.6,bus:2.4},T2='<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-7.5L14 16v5M8 12l2-4.5 3-.5 2.5 3.5L18 11M10.5 7.8 9 13"/></svg>',A2='<svg viewBox="0 0 24 24"><path d="M3 5.5 21 3M12 4.3V8M6.5 8h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16.5v-7A1.5 1.5 0 0 1 6.5 8zM5 12.5h14"/></svg>',R2='<svg viewBox="0 0 24 24"><rect x="4.5" y="3.5" width="15" height="15" rx="2.5"/><path d="M4.5 11h15M8 18.5V21M16 18.5V21"/><circle cx="8.5" cy="15" r=".9"/><circle cx="15.5" cy="15" r=".9"/></svg>',Bd='<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>',Vg='<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',C2='<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',Fa=i=>i>=1e3?`${(i/1e3).toFixed(1)} \u516C\u91CC`:`${Math.round(i/10)*10} \u7C73`;function je(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function Gg(i){let{routes:t,world:e,camera:n,controls:s,hAt:r,realH:a=et=>et,fly:o,pose:l,cancelFlight:h,openPanel:u,closeSheetsForRoute:f,onFrame:g,isMobile:d,visibleRect:y}=i,v=document.querySelector("#route-list"),p=document.querySelector("#route-detail"),x=document.querySelector("#route-hud"),T=x.querySelector(".rh-stops"),M=x.querySelector(".rh-bar i"),C=new Pn;C.renderOrder=5,e.add(C);let P=[],L=null,B=[],nt=[],A=null,w=null,rt=-1,Et=null,re=()=>{clearTimeout(Et),Et=null};function tt(et){let dt=et.pts,jt=[],Qt=et.mode==="cable"?22:2.6,te=r(...dt[0])+Qt,ct=r(...dt.at(-1))+Qt,V=0,It=[];for(let oe=1;oe<dt.length;oe++){let ce=Math.hypot(dt[oe][0]-dt[oe-1][0],dt[oe][1]-dt[oe-1][1]);It.push(ce),V+=ce}let zt=0;for(let oe=0;oe<dt.length;oe++)if(oe>0){let[ce,Ue]=dt[oe-1],[Kt,Ne]=dt[oe],He=It[oe-1],Oe=Math.max(1,Math.ceil(He/6));for(let sn=1;sn<=Oe;sn++){let hn=sn/Oe,pn=ce+(Kt-ce)*hn,Rn=Ue+(Ne-Ue)*hn,Tn=zt+He*hn,Bn=r(pn,Rn)+2.6,li=et.mode==="cable"?Math.max(Bn+12,te+(ct-te)*(Tn/V)):Bn;jt.push(new X(pn,li,Rn))}zt+=He}else jt.push(new X(dt[0][0],et.mode==="cable"?te:r(...dt[0])+2.6,dt[0][1]));return jt}function ft(et,dt,jt,Qt={}){let te=new Oa;te.setPositions(et.flatMap(It=>[It.x,It.y,It.z]));let ct=new oo({color:dt,linewidth:jt,transparent:!0,opacity:Qt.opacity??1,depthTest:Qt.depthTest??!0,depthWrite:!1,dashed:!!Qt.dashed,dashSize:9,gapSize:7});ct.resolution.set(innerWidth,innerHeight),P.push(ct);let V=new tu(te,ct);return Qt.dashed&&V.computeLineDistances(),V.renderOrder=Qt.order??5,V.frustumCulled=!1,C.add(V),V}addEventListener("resize",()=>{for(let et of P)et.resolution.set(innerWidth,innerHeight)});function Mt(et){Wt();let dt=[];et.legs.forEach((te,ct)=>te.parts.forEach(V=>{let It=Hg[V.mode].color,zt=V.mode!=="walk",oe=V.segments||[{pts:V.pts,estimated:!1}];for(let ce of oe){let Ue=tt({...V,pts:ce.pts}),Kt=ce.estimated,Ne={dashed:zt||Kt};ft(Ue,It,4,{...Ne,depthTest:!1,opacity:.38,order:4}),ft(Ue,"#ffffff",8.5,{...Ne,order:5}),ft(Ue,It,5,{...Ne,opacity:Kt?.75:1,order:6});for(let He of Ue)dt.push({p:He,mode:V.mode,leg:ct})}}));let jt=new Map;et.stops.forEach((te,ct)=>{jt.has(te.place)||jt.set(te.place,{s:te,idx:[]}),jt.get(te.place).idx.push(ct)});let Qt=et.stops.length-1;for(let{s:te,idx:ct}of jt.values()){let V=je("div","maplabel route-stop"+(ct.includes(0)?" start":ct.includes(Qt)?" end":"")),It=je("button"),zt=je("span","rs-name",te.n);It.type="button",It.title=te.n,It.tabIndex=-1,It.append(je("span","rs-num"+(ct.length>1?" multi":""),ct.map(Ue=>Ue+1).join("\xB7")),zt),It.onclick=()=>De(ct[0]);let oe=je("i");V.append(It,oe);let ce=new Fo(V);ce.center.set(.5,1),ce.position.set(te.x,r(te.x,te.z)+9,te.z),C.add(ce);for(let Ue of ct)B[Ue]=V;nt.push({box:V,b:It,name:zt,stem:oe,label:ce,lift:0,rank:ct.includes(0)||ct.includes(Qt)?1:2+ct[0]/100})}Zt="",A=ne(et,dt),document.body.classList.add("route-on")}function Wt(){for(let et of[...C.children])C.remove(et),et.isLine2&&(et.geometry.dispose(),et.material.dispose()),et.isCSS2DObject&&et.element.remove();P.length=0,B=[],nt=[],A=null,document.body.classList.remove("route-on")}let Zt="",At=0,Yt=null,le=[],Me=-1e9,Rt=new X;function Ct(et){if(!nt.length)return!1;n.updateMatrixWorld();let dt=n.matrixWorld.elements.map(Kt=>Kt.toFixed(1)).join()+n.projectionMatrix.elements.join()+innerWidth+"x"+innerHeight+":"+rt+":"+(K.mode??"");if(dt===Zt&&et-At<500)return!1;(!Yt||et-Me>=500)&&(Yt=y(),le=i.covers?.()??[],Me=et),Zt=dt,At=et;let jt=Yt,Qt=innerWidth,te=innerHeight,ct=[],V=[],It=B[rt],zt=(Kt,Ne)=>Ne.some(He=>Kt[0]<He[2]&&Kt[2]>He[0]&&Kt[1]<He[3]&&Kt[3]>He[1]),oe=(Kt,Ne)=>[Kt[0]+Ne,Kt[1]+Ne,Kt[2]-Ne,Kt[3]-Ne],ce=[...nt].sort((Kt,Ne)=>(Ne.box===It)-(Kt.box===It)||Kt.rank-Ne.rank),Ue=K.screenBox(n,Qt,te);Ue&&ct.push(Ue);for(let Kt of ce){!Kt.bh&&Kt.b.offsetHeight&&(Kt.bw=Kt.b.offsetWidth,Kt.bh=Kt.b.offsetHeight,Kt.h=Kt.box.offsetHeight-Kt.lift,Kt.nw=Kt.name.offsetWidth,Kt.nh=Kt.name.offsetHeight),Kt.label.getWorldPosition(Rt).project(n),Kt.on=Rt.z>-1&&Rt.z<1;let Ne=Kt.bw||26,He=Kt.bh||26,Oe=(Rt.x+1)/2*Qt,sn=(1-Rt.y)/2*te-(Kt.h||36)+He/2,hn=Rn=>[Oe-Ne/2,sn-Rn-He/2,Oe+Ne/2,sn-Rn+He/2],pn=0;if(Kt.on){let Rn=hn(0),Tn=ct.filter(li=>zt(oe(Rn,6),[li])),Bn=Tn.length?Math.max(...Tn.map(li=>Rn[3]-li[1]+2)):0;Bn&&Bn<=2*He+6&&hn(Bn)[1]>=jt.top&&!zt(oe(hn(Bn),4),ct)&&!zt(hn(Bn),le)&&(pn=Math.round(Bn))}Kt.dot=hn(pn),Kt.on&&ct.push(Kt.dot),Kt.stemBox=Kt.on?[Oe-4,Kt.dot[3],Oe+4,(1-Rt.y)/2*te+5]:null,Kt.stemBox&&V.push(Kt.stemBox),pn!==Kt.lift&&(Kt.lift=pn,Kt.stem.style.height=pn?`${10+pn}px`:""),Kt.box.classList.toggle("veiled",!!Ue&&Kt.on&&zt([Oe-4,Kt.dot[3],Oe+4,(1-Rt.y)/2*te+6],[Ue]))}for(let Kt of ce){let Ne=0;if(Kt.on){let He=Kt.nw||[...Kt.name.textContent].length*12+20,Oe=Kt.nh||22,[sn,hn,pn,Rn]=Kt.dot,Tn=(hn+Rn)/2,Bn=[[pn+3,Tn-Oe/2,pn+3+He,Tn+Oe/2],[sn-3-He,Tn-Oe/2,sn-3,Tn+Oe/2]],li=xn=>xn[0]>=jt.left+4&&xn[2]<=jt.right-4&&xn[1]>=jt.top+2&&xn[3]<=jt.bottom-2,Hs=V.filter(xn=>xn!==Kt.stemBox),ls=xn=>li(xn)&&!zt(xn,le),In=Bn.findIndex(xn=>ls(xn)&&!zt(xn,ct)&&!zt(xn,Hs));In<0&&Kt.box===It&&(In=Bn.findIndex(xn=>ls(xn)&&!(Ue&&zt(xn,[Ue]))),In<0&&(In=Bn.findIndex(ls)),In<0&&(In=Bn.findIndex(li)),In<0&&(In=Math.max(0,Bn.findIndex(xn=>xn[0]>=0&&xn[2]<=Qt)))),In>=0&&(Ne=In?-1:1,ct.push(Bn[In]))}Kt.box.classList.toggle("named",Ne!==0),Kt.box.classList.toggle("flip",Ne===-1)}return!0}function ne(et,dt){let jt=[],Qt=[],te=[],ct=0;dt.forEach((oe,ce)=>{ce&&(ct+=oe.p.distanceTo(dt[ce-1].p)/Fd[oe.mode]),jt.push(oe.p),Qt.push(ct),te.push(oe.mode)});let V=et.stops.map((oe,ce)=>{if(ce===0)return 0;let Ue=0,Kt=1/0,Ne=dt.findLastIndex(He=>He.leg===ce-1);for(let He=Math.max(0,Ne-40);He<=Ne;He++){let Oe=Math.hypot(jt[He].x-oe.x,jt[He].z-oe.z);Oe<Kt&&(Kt=Oe,Ue=He)}return Qt[Ue]}),It=et.legs.map((oe,ce)=>Qt[dt.findLastIndex(Ue=>Ue.leg===ce)]),zt=[];for(let oe=1;oe<dt.length;oe++)dt[oe].mode!==dt[oe-1].mode&&dt[oe].leg===dt[oe-1].leg&&zt.push(Qt[oe-1]);return{pts:jt,cum:Qt,modes:te,total:ct,stopAt:V,legEnd:It,switches:zt}}function Re(et,dt){let{pts:jt,cum:Qt}=et,te=0,ct=Qt.length-1;if(dt<=0)return jt[0].clone();if(dt>=Qt[ct])return jt[ct].clone();for(;ct-te>1;){let It=te+ct>>1;Qt[It]<=dt?te=It:ct=It}let V=(dt-Qt[te])/Math.max(1e-6,Qt[ct]-Qt[te]);return jt[te].clone().lerp(jt[ct],V)}function Le(et,dt){let{cum:jt,modes:Qt}=et,te=0,ct=jt.length-1;if(dt>=jt[ct])return Qt[ct];for(;ct-te>1;){let V=te+ct>>1;jt[V]<=dt?te=V:ct=V}return Qt[ct]}function We(et){let dt=[];et.legs.forEach(In=>In.parts.forEach(xn=>xn.pts.forEach(([Vs,z],gt)=>{(gt%3===0||gt===xn.pts.length-1)&&dt.push([Vs,z,8,0,0])}))),et.stops.forEach(In=>dt.push([In.x,In.z,9,15,38]));let jt=dt.length,Qt=dt.reduce((In,xn)=>In+xn[0],0)/jt,te=dt.reduce((In,xn)=>In+xn[1],0)/jt,ct=0,V=0,It=0;for(let[In,xn]of dt)ct+=(In-Qt)**2,V+=(xn-te)**2,It+=(In-Qt)*(xn-te);let zt=Math.atan2(2*It,ct-V)/2*180/Math.PI;for(;zt-25>90;)zt-=180;for(;25-zt>90;)zt+=180;let oe=52,ce=y(),Ue=innerWidth,Kt=innerHeight,Ne=22,He=16,Oe={w:ce.right-ce.left,h:ce.bottom-ce.top},sn=(ce.left+ce.right)/2+ce.shiftX,hn=(ce.top+ce.bottom)/2+ce.shiftY,pn=new Gi(43,Ue/Kt,1,6e4),Rn=new X,Tn=new X,Bn=new X,li=Qt,Hs=te,ls=1600;for(let In=0;In<30;In++){let xn=l(li,Hs,ls,zt,oe);pn.position.copy(xn.pos),pn.lookAt(xn.target),pn.updateMatrixWorld();let Vs=1/0,z=-1/0,gt=1/0,Pt=-1/0;for(let[on,dn,un,an,Vn]of dt){Rn.set(on,(r(on,dn)+un)*e.scale.y,dn).project(pn);let Si=(Rn.x+1)/2*Ue,ci=(1-Rn.y)/2*Kt;Vs=Math.min(Vs,Si-an),z=Math.max(z,Si+an),gt=Math.min(gt,ci-Vn),Pt=Math.max(Pt,ci)}let Ft=Math.max((z-Vs)/Math.max(80,Oe.w-2*Ne),(Pt-gt)/Math.max(60,Oe.h-2*He)),Lt=2*ls*Math.tan(43*Math.PI/360)/Kt,Ie=(Vs+z)/2-sn,$e=(gt+Pt)/2-hn;Tn.setFromMatrixColumn(pn.matrixWorld,0).setY(0).normalize(),Bn.setFromMatrixColumn(pn.matrixWorld,2).negate().setY(0).normalize();let Qe=Lt/Math.cos(oe*Math.PI/180);if(li+=(Tn.x*Ie*Lt-Bn.x*$e*Qe)*.85,Hs+=(Tn.z*Ie*Lt-Bn.z*$e*Qe)*.85,ls=Math.min(12e3,Math.max(250,ls*Math.min(1.8,Math.max(.55,Ft)))),Math.abs(Ft-1)<.01&&Math.abs(Ie)<2&&Math.abs($e)<2)break}return l(li,Hs,ls*1.06,zt,oe)}function Ze(){if(ke(),!L)return;let et=We(L);o(et,1500)}function De(et){if(!L)return;ke();let dt=L.stops[et];o(l(dt.x,dt.z,L.id==="tiantai-classic"?420:260,25,55),1300),Be(et)}function Be(et){rt=et;for(let dt of new Set(B))dt.classList.toggle("active",dt===B[et]);p.querySelectorAll(".rs-stop").forEach(dt=>dt.classList.toggle("active",+dt.dataset.i===et)),ve()}let K=kg(i.scene??e.parent??e),Se={walk:"\u6B65\u884C",bus:"\u4E58\u666F\u4EA4\u8F66",funicular:"\u4E58\u7F06\u8F66",cable:"\u4E58\u7D22\u9053"},lt={bus:"\u666F\u4EA4\u8F66",funicular:"\u7F06\u8F66",cable:"\u7D22\u9053"},_e=(et,dt)=>dt==="walk"?`\u4E0B${et==="bus"?"\u8F66":lt[et]}\u6B65\u884C`:et==="walk"?`\u4E58${lt[dt]}`:`\u6362\u4E58${lt[dt]}`;function Jt(){if(!L||!A)return;re(),h(),f(),s.stopMotion?.();let et=Math.min(50,Math.max(22,A.total/90)),dt=L.id==="tiantai-classic"?430:250;w??={s:0,speed:A.total/et,pause:1.2,stop:0,heading:null,dist:dt,camDist:dt},w.paused=!1,Be(w.stop),ve()}function ke(){re(),!(!w||w.paused)&&(w.paused=!0,ve())}function be(et){if(w.pause>0)w.pause-=et,w.pause<=0&&(w.switching=!1);else{let Oe=w.s,sn=w.stop+1,hn=sn<A.stopAt.length?A.stopAt[sn]:1/0,pn=Math.min(A.total,Oe+w.speed*et),Rn=A.switches.find(Tn=>Tn>Oe&&Tn<=pn&&Tn<hn);Rn!==void 0?(pn=Rn,w.pause=.8,w.switching=!0):pn>=hn&&(pn=hn,w.stop=sn,w.pause=1.1),w.s=pn,w.stop===sn&&Be(sn)}let dt=Le(A,w.s),jt=Fd[dt];w.camDist+=(w.dist*w2[O()]-w.camDist)*Math.min(1,et*.7);let Qt=w.camDist/w.dist,te=Re(A,w.s),ct=Re(A,w.s+Math.min(160*(w.speed/90),400*Qt/jt)),V=Math.atan2(ct.x-te.x,-(ct.z-te.z));w.heading===null&&(w.heading=V);let It=V-w.heading;It=Math.atan2(Math.sin(It),Math.cos(It)),w.heading+=It*Math.min(1,et*1.6/Qt);let zt=te.y*e.scale.y,oe=57*Math.PI/180,ce=w.camDist,Ue=new X(te.x,zt,te.z),Kt=Ue.clone().add(new X(-Math.sin(w.heading)*ce*Math.sin(oe),ce*Math.cos(oe),Math.cos(w.heading)*ce*Math.sin(oe))),Ne=Math.min(1,et*3.2*jt/Qt);s.target.lerp(Ue,Ne),n.position.lerp(Kt,Ne);let He=w.pause<=0&&w.stop+1<A.stopAt.length;He!==w.moving&&(w.moving=He,He&&(w.swapped=!1),ve()),fe(w.s/A.total),w.s>=A.total&&w.pause<=0&&(w=null,Be(-1),ve(!0),Et=setTimeout(()=>{Et=null,u("routes"),p.scrollTop=0,Ze()},400))}function O(){let et=w.stop,dt=L.legs[et];return dt&&et>0&&w.s<=A.legEnd[et-1]?dt.parts[0].mode:Le(A,w.s)}let I=new X;function yt(et,dt){let jt=O();jt!==w.mode&&(w.fromMode=w.mode,w.mode=jt,w.swapped=!!w.fromMode,K.show(jt,et),ve());let Qt=Re(A,w.s),te=r(Qt.x,Qt.z);I.set(Qt.x,(jt==="cable"?Math.max(Qt.y,te+20):te+2.6)*e.scale.y,Qt.z);let ct=10/Fd[jt],V=Re(A,Math.max(0,w.s-ct)),It=Re(A,Math.min(A.total,w.s+ct)),zt=Math.hypot(It.x-V.x,It.z-V.z),oe=zt>1?Math.atan2(It.x-V.x,-(It.z-V.z)):null,ce=zt>1?Math.atan2((It.y-V.y)*e.scale.y,zt):0,Ue=innerHeight/(2*Math.max(1,n.position.distanceTo(I))*Math.tan(43*Math.PI/360));K.update(I,oe,ce,!w.paused&&w.pause<=0,et,dt,Ue)}g((et,dt)=>{if(!w||!A){K.visible&&K.hide();return}let jt=Math.min(dt,64)/1e3;w.paused||be(jt),w&&yt(et,jt)}),s.addEventListener("gesturestart",ke);function ye(et){let dt=je("button","route-card"+(et.featured?" featured":""));return dt.type="button",dt.append(je("span","rc-by",et.by),je("strong","",et.name),je("span","rc-meta",`${et.duration} \xB7 \u6B65\u884C ${Fa(et.walkM)} \xB7 \u722C\u5347 ${et.climb} \u7C73`)),et.fit&&dt.append(je("span","rc-fit","\u9002\u5408\uFF1A"+et.fit)),dt.append(je("span","rc-path",et.stops.map(jt=>jt.n).filter((jt,Qt,te)=>te.indexOf(jt)===Qt).join(" \u2192 "))),dt.onclick=()=>Je(et.id),dt}function pe(){v.replaceChildren(...t.map(ye))}function ue(et){let dt=[],jt=[],Qt=[],te=0;et.legs.forEach((Oe,sn)=>{Qt.push({s:te,i:sn}),Oe.parts.forEach(hn=>{if(hn.mode==="bus")return;let pn=tt(hn);pn.forEach((Rn,Tn)=>{(Tn||!dt.length)&&(dt.length&&(te+=Math.hypot(Rn.x-pn[Math.max(0,Tn-1)].x,Rn.z-pn[Math.max(0,Tn-1)].z)),dt.push(te),jt.push(a(Rn.y-2.6)))})})}),Qt.push({s:te,i:et.stops.length-1});let ct=300,V=64,It=Math.min(...jt),zt=Math.max(...jt),oe=Math.max(40,zt-It),ce=Oe=>Oe/Math.max(1,te)*ct,Ue=Oe=>V-6-(Oe-It)/oe*(V-16),Kt=dt.map((Oe,sn)=>`${sn?"L":"M"}${ce(Oe).toFixed(1)} ${Ue(jt[sn]).toFixed(1)}`).join(""),Ne=`<svg viewBox="0 0 ${ct} ${V}" preserveAspectRatio="none" aria-hidden="true"><path class="pf-area" d="${Kt}L${ct} ${V}L0 ${V}Z"/><path class="pf-line" d="${Kt}"/>${Qt.map(Oe=>{let sn=dt.findIndex(pn=>pn>=Oe.s),hn=Ue(jt[Math.max(0,sn===-1?jt.length-1:sn)]);return`<circle cx="${ce(Oe.s).toFixed(1)}" cy="${hn.toFixed(1)}" r="3"/>`}).join("")}</svg>`,He=je("div","route-profile");return He.innerHTML=Ne,He.append(je("span","pf-hi",`${Math.round(zt)} \u7C73`),je("span","pf-lo",`${Math.round(It)} \u7C73`),je("span","pf-cap","\u6CBF\u9014\u6D77\u62D4")),He}function Xe(et){let dt=et.parts.map(ct=>ct.mode==="walk"?`\u6B65\u884C${et.minutesBy!=="\u4F30\u7B97"&&et.parts.length===1?"\u7EA6 "+et.minutes:"\u7EA6 "+ct.minutes} \u5206\u949F \xB7 ${Fa(ct.m)}${ct.up>=15?` \xB7 \u4E0A\u5761 ${ct.up} \u7C73`:ct.down>=15?` \xB7 \u4E0B\u5761 ${ct.down} \u7C73`:""}`:ct.mode==="bus"?`\u5750${ct.line}\u7EA6 ${ct.minutes} \u5206\u949F \xB7 ${Fa(ct.m)}`:`\u5750${ct.line}\u7EA6 ${ct.minutes} \u5206\u949F`),jt=et.parts.flatMap(ct=>ct.segments||[]).filter(ct=>ct.estimated).reduce((ct,V)=>ct+V.m,0),Qt=et.parts.at(-1)?.segments?.at(-1),te=Qt?.estimated?Qt.m:0;return dt.join("\uFF0C\u518D")+(jt>=1?` \xB7 \u542B\u7EA6 ${Fa(jt)}\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF08\u672A\u6838\u5B9E\u901A\u884C${te>=10?`\uFF0C\u672B\u6BB5\u7EA6 ${Fa(te)}`:""}\uFF09`:"")}function qt(et){let dt=et.parts.find(jt=>jt.mode!=="walk")?.mode;return dt==="bus"?R2:dt?A2:T2}function we(et){p.replaceChildren();let dt=je("div","route-top"),jt=je("button","route-back","\u5168\u90E8\u8DEF\u7EBF");jt.type="button",jt.onclick=nn,dt.append(jt,je("span","rc-by",et.by));let Qt=je("div","route-stats"),te=et.walkMinutes>=60?`\u7EA6 ${(et.walkMinutes/60).toFixed(1)} \u5C0F\u65F6`:`\u7EA6 ${et.walkMinutes} \u5206\u949F`;for(let[Ne,He]of[[et.duration,"\u5168\u7A0B"],[Fa(et.walkM),"\u6B65\u884C"],[te,"\u6B65\u884C\u7528\u65F6"],[`${et.climb} \u7C73`,"\u7D2F\u8BA1\u722C\u5347"]]){let Oe=je("span");Oe.append(je("b","",Ne),je("small","",He)),Qt.append(Oe)}let ct=je("div","route-actions"),V=je("button","btn primary route-play");V.type="button",V.innerHTML=Bd,V.append("\u8DEF\u7EBF\u9884\u6F14"),V.onclick=()=>w&&!w.paused?ke():Jt();let It=je("button","btn ghost");It.type="button",It.innerHTML=C2,It.append("\u770B\u5168\u7A0B"),It.onclick=Ze,ct.append(V,It);let zt=je("ol","route-steps");et.stops.forEach((Ne,He)=>{let Oe=je("li","rs-stop");Oe.dataset.i=He;let sn=je("button");sn.type="button",sn.onclick=()=>De(He),sn.append(je("span","rs-num",String(He+1)),je("strong","",Ne.n)),Ne.note&&sn.append(je("small","",Ne.note)),Oe.append(sn),zt.append(Oe);let hn=et.legs[He];if(hn){let pn=je("li","rs-leg"),Rn=je("span","rs-icon");Rn.innerHTML=qt(hn);let Tn=je("span","rs-leg-text",Xe(hn));hn.note&&Tn.append(je("em","",hn.note)),pn.append(Rn,Tn),zt.append(pn)}});let oe=je("ul","route-tips");for(let Ne of et.tips)oe.append(je("li","",Ne));let ce=je("details","more");ce.append(je("summary","","\u8D44\u6599\u4E0E\u4F9D\u636E")),ce.append(je("p","","\u7EBF\u8DEF\u6CBF\u5730\u56FE\u4E0A\u7684\u6B65\u9053\u3001\u53F0\u9636\u548C\u8857\u9053\u7ED8\u5236\uFF1B\u5730\u56FE\u7F3A\u5931\u5904\u3001\u70B9\u4F4D\u5230\u8DEF\u7F51\u3001\u7A7F\u8FC7\u5E7F\u573A\u548C\u5317\u95E8\u95E8\u697C\u7B49\u5F3A\u5236\u8FDE\u63A5\u6BB5\u6309\u76F4\u7EBF\u793A\u610F\uFF08\u865A\u7EBF\uFF09\uFF0C\u4E0D\u4EE3\u8868\u5B9E\u6D4B\u6216\u5DF2\u6838\u5B9E\u53EF\u901A\u884C\u9053\u8DEF\uFF0C\u8BF7\u4EE5\u73B0\u573A\u9053\u8DEF\u4E3A\u51C6\u3002\u6B65\u884C\u65F6\u95F4\u6309\u8DDD\u79BB\u548C\u5761\u5EA6\u4F30\u7B97\uFF08\u53F0\u9636\u7528\u65F6\u589E\u52A0\u4E09\u6210\uFF09\uFF0C\u6BCF\u4E2A\u4EBA\u5FEB\u6162\u4E0D\u540C\uFF1B\u6807\u201C\u4E1A\u4E3B\u63D0\u4F9B\u201D\u7684\u4E3A\u5C45\u4E4B\u6797\u4E1A\u4E3B\u7ED9\u51FA\u7684\u65F6\u95F4\u3002\u7F06\u8F66\u3001\u7D22\u9053\u548C\u666F\u4EA4\u8F66\u7684\u4E58\u5750\u65F6\u95F4\u6309\u7EBF\u8DEF\u957F\u5EA6\u4F30\u7B97\uFF0C\u4E0D\u542B\u6392\u961F\u3002\u5F00\u653E\u548C\u8FD0\u884C\u65F6\u95F4\u4EE5\u73B0\u573A\u516C\u793A\u4E3A\u51C6\u3002"));let Ue=je("div","links");for(let Ne of et.sources)if(Ne.url){let He=je("a","",Ne.name);He.href=Ne.url,He.target="_blank",He.rel="noopener",Ue.append(He)}else Ue.append(je("span","",Ne.name));ce.append(Ue);let Kt=je("p","route-summary route-legend","\u6A59\u8272\u5B9E\u7EBF\uFF1A\u5730\u56FE\u6B65\u9053\uFF1B\u6A59\u8272\u865A\u7EBF\uFF1A\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF0C\u672A\u6838\u5B9E\u53EF\u901A\u884C\uFF1B\u84DD\uFF0F\u7D2B\u865A\u7EBF\uFF1A\u4E58\u8F66\u6BB5\uFF08\u5176\u4E2D\u76F4\u7EBF\u63A5\u9A73\u89C1\u884C\u7A0B\u63D0\u793A\uFF09\u3002");p.append(dt,je("h3","route-title",et.name),Qt,ct,Kt,je("p","route-summary",et.summary),ue(et),zt,je("h4","","\u51FA\u53D1\u524D\u770B\u770B"),oe,ce),p.scrollTop=0}function Je(et){let dt=t.find(Qt=>Qt.id===et);if(!dt)return;ke(),w=null,L=dt,rt=-1,u("routes"),v.hidden=!0,p.hidden=!1,we(dt),Mt(dt),gn(dt),G="",ve();let jt=We(dt);o(jt,1600),p.focus?.({preventScroll:!0})}function nn(){let et=L,dt=p.contains(document.activeElement);ke(),h(),w=null,L=null,Wt(),T.replaceChildren(),p.hidden=!0,v.hidden=!1,ve(),dt&&et&&v.children[t.indexOf(et)]?.focus?.({preventScroll:!0})}function me(et){let dt=et.parts.find(jt=>jt.mode!=="walk");return`${dt?Hg[dt.mode].name:"\u6B65\u884C"} ${et.minutes} \u5206\u949F`}function gn(et){T.replaceChildren(),et.stops.forEach((dt,jt)=>{let Qt=je("li","rh-stop"+(jt===0?" start":jt===et.stops.length-1?" end":""));Qt.dataset.i=jt;let te=je("button");te.type="button",te.onclick=()=>De(jt),te.append(je("span","rs-num",String(jt+1)),je("span","rh-name",dt.n)),Qt.append(te),T.append(Qt);let ct=et.legs[jt];if(ct){let V=je("li","rh-leg");V.dataset.i=jt;let It=je("span","rs-icon");It.innerHTML=qt(ct),V.append(It,je("span","",me(ct))),T.append(V)}})}let G="";function fe(et){M.style.transform=`scaleX(${Math.max(0,Math.min(1,et)).toFixed(4)})`}function ve(et){i.onPlaybackChange?.();let dt=!!w&&!w.paused,jt=dt?"\u6682\u505C\u9884\u6F14":w?"\u7EE7\u7EED\u9884\u6F14":"\u8DEF\u7EBF\u9884\u6F14",Qt=p.querySelector(".route-play");if(Qt&&(Qt.innerHTML=dt?Vg:Bd,Qt.append(jt)),!L){x.hidden=!0;return}let te=L.stops.length,ct=w?w.stop:rt,V=!!w?.moving,It=L.stops[Math.max(0,ct)],zt=L.stops[ct+1];x.querySelector("b").textContent=L.short;let oe=(Kt,Ne,He)=>{let Oe=je("span","rh-where",Kt),sn=Ne?He?[je("span","rh-note",Ne),Oe]:[Oe,je("span","rh-note",Ne)]:[Oe];w?.paused&&sn.unshift(je("span","rh-note","\u5DF2\u6682\u505C \xB7\xA0")),x.querySelector("small").replaceChildren(...sn)};w?V&&zt?oe(`${Se[w.mode]??"\u6B63\u5728"}\u524D\u5F80 ${zt.n}`):w.switching&&zt?oe(`\xA0\xB7 \u524D\u5F80 ${zt.n}`,_e(w.fromMode,w.mode),!0):oe(ct===0?`\u4ECE ${It.n} \u51FA\u53D1`:`${ct+1}/${te} \u5230\u8FBE ${It.n}`,w.swapped?`\xA0\xB7 ${_e(w.fromMode,w.mode)}`:""):oe(ct>=0?`${ct+1}/${te} \xB7 ${It.n}`:et?"\u9884\u6F14\u5B8C\u6BD5 \xB7 \u53EF\u518D\u770B\u4E00\u6B21":`${te} \u7AD9 \xB7 ${L.duration} \xB7 \u70B9 \u25B6 \u5F00\u59CB\u9884\u6F14`);let ce=x.querySelector(".rh-play");ce.innerHTML=dt?Vg:Bd,ce.setAttribute("aria-label",jt),x.hidden=!1,x.classList.toggle("playing",dt),x.classList.toggle("live",!!w);for(let Kt of T.children){let Ne=+Kt.dataset.i,He=Kt.classList.contains("rh-stop");Kt.classList.toggle("done",!!et||Ne<ct),He?(Kt.classList.toggle("current",Ne===ct),Kt.classList.toggle("next",!!w&&Ne===ct+1)):Kt.classList.toggle("moving",V&&Ne===ct)}fe(w?w.s/A.total:et?1:ct>=0&&A?A.stopAt[ct]/A.total:0);let Ue=`${L.id}:${ct}:${!!w}`;if(Ue!==G&&x.offsetParent){G=Ue;let Kt=T.querySelector(`.rh-stop[data-i="${Math.max(0,ct)}"]`);if(Kt){let Ne=parseFloat(globalThis.getComputedStyle?.(T).paddingLeft??12);T.scrollTo?.({left:Math.max(0,Kt.offsetLeft-Ne),behavior:globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}}return x.querySelector(".rh-play").onclick=()=>w&&!w.paused?ke():Jt(),x.querySelector(".rh-list").onclick=()=>{ke(),u("routes")},x.querySelector(".rh-close").onclick=nn,addEventListener("keydown",et=>{et.key==="Escape"&&w&&ke()}),pe(),{open:Je,close:nn,stopPreview:ke,startPreview:Jt,updateLabels:Ct,get labelObjects(){return nt.map(et=>et.label)},get active(){return L},get previewing(){return!!w&&!w.paused},get canResume(){return!!w?.paused}}}var P2={\u53F2\u6599:"history",\u4FE1\u4EF0:"belief",\u4F20\u8BF4:"legend",\u5EFA\u7B51:"building",\u5730\u8C8C:"building",\u63D0\u793A:"tip"};function ai(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function zd(i){return ai("span","kind k-"+(P2[i]||"tip"),i)}var L2=i=>/^1\d{10}$/.test(i)?`${i.slice(0,3)} ${i.slice(3,7)} ${i.slice(7)}`:i;function I2(i){let t=ai("p","guide-src");return t.append(ai("span","","\u6765\u6E90\uFF1A")),i.forEach((e,n)=>{let s=ai("a","",e.name);s.href=e.url,s.target="_blank",s.rel="noopener",t.append(s),n<i.length-1&&t.append("\uFF1B")}),t}function Wg(i){let t=ai("dl","guide-rows");for(let[e,n]of i)t.append(ai("dt","",e),ai("dd","",n));return t}function Xg(i,t){let e=i.guide;if(!e){t.replaceChildren(ai("p","empty","\u6E38\u89C8\u987B\u77E5\u6682\u65F6\u6CA1\u6709\u52A0\u8F7D\uFF0C\u5237\u65B0\u9875\u9762\u518D\u8BD5\u3002"));return}t.replaceChildren(ai("p","guide-intro",`\u51FA\u53D1\u524D\u770B\u770B \xB7 \u5B98\u65B9\u8D44\u6599 ${e.verified} \u6838\u9A8C`));for(let n of e.sections){let s=ai("details","guide-sec"),r=ai("summary"),a=ai("div","guide-body");s.dataset.id=n.id,r.append(ai("b","",n.title),ai("small","",n.teaser)),s.append(r,a);for(let[o,l]of n.paras||[]){let h=ai("p","story");h.append(zd(o),l),a.append(h)}if(n.rows?.length&&a.append(Wg(n.rows)),n.transitHours&&i.transit&&a.append(ai("h4","","\u8FD0\u8425\u65F6\u95F4"),Wg([...i.transit.routes.map(o=>[o.name,o.hours]),...i.transit.cableways.map(o=>[o.name,o.hours+(o.phone?` \xB7 \u54A8\u8BE2 ${o.phone}`:"")])])),n.items?.length){let o=ai("ul","guide-list");for(let l of n.items)o.append(ai("li","",l));a.append(o)}if(n.phones?.length){let o=ai("ul","guide-phones");for(let[l,h,u]of n.phones){let f=ai("li"),g=ai("span","nums");for(let d of h){let y=ai("a","",L2(d));y.href="tel:"+d.replace(/\D/g,""),g.append(y)}f.append(ai("span","who",l),g),u&&f.append(ai("small","",u)),o.append(f)}a.append(o)}n.note&&a.append(ai("p","guide-note",n.note)),n.sources?.length&&a.append(I2(n.sources)),t.append(s)}}function qg(i,t){if(i?.model?.kind!=="entrance-checkpoint")return null;let[e,n]=i.model.front,s=Math.hypot(e,n),r=e/s,a=n/s,o=[i.x,i.z],l=t(...o)+.55,h=y=>(y=Math.max(0,Math.min(1,y)),y*y*(3-2*y)),u=(y,v)=>{let p=y-o[0],x=v-o[1];return[p*a-x*r,p*r+x*a]};return{origin:o,floor:l,fx:r,fz:a,local:u,world:(y,v)=>[o[0]+y*a+v*r,o[1]-y*r+v*a],outer:{x:18,z:14},height:(y,v,p)=>{if(Math.abs(y-o[0])>32||Math.abs(v-o[1])>32)return p;let[x,T]=u(y,v),M=(1-h((Math.abs(x)-10.3)/7.7))*(1-h((Math.abs(T)-6.2)/7.8));if(!M)return p;let C=l-.14-Math.min(.9,Math.max(0,T-2.7)*.45);return p+(C-p)*M},rotation:Math.atan2(r,a),viewAzimuth:Math.atan2(-r,a)*180/Math.PI}}function Yg(i,t,e,n,s){let r=[],a=[],o=[],l=i.outer.x*2,h=i.outer.z*2;for(let g=0;g<=h;g++)for(let d=0;d<=l;d++){let[y,v]=i.world(d-i.outer.x,g-i.outer.z);r.push(y,i.height(y,v,t(y,v)),v),a.push((y+e/2)/e,1-(v+n/2)/n)}for(let g=0;g<h;g++)for(let d=0;d<l;d++){let y=g*(l+1)+d,v=y+1,p=y+l+1,x=p+1;o.push(y,p,v,v,p,x)}let u=new Ln;u.setAttribute("position",new en(r,3)),u.setAttribute("uv",new en(a,2)),u.setIndex(o),u.computeVertexNormals();let f=new Ke(u,s);return f.receiveShadow=!0,f}function D2(){let i=document.createElement("canvas");i.width=1024,i.height=512;let t=i.getContext("2d");t.textAlign="center",t.textBaseline="middle",t.fillStyle="#ff322b",t.font='700 76px "PingFang SC",sans-serif',t.shadowColor="#ef1d16",t.shadowBlur=3,t.fillText("\u4E5D\u534E\u5C71\u98CE\u666F\u533A\u6B22\u8FCE\u60A8",512,48),t.shadowBlur=0,t.fillStyle="#d9cd8f",t.font='700 174px "Kaiti SC","STKaiti","Songti SC",serif',["\u4E5D","\u83EF","\u5C71"].forEach((n,s)=>t.fillText(n,s*224+112,208));let e=new as(i);return e.colorSpace=kn,e.anisotropy=4,new os({map:e,transparent:!0,alphaTest:.16,side:mn,toneMapped:!1})}function $g(i,t,{signs:e=!0}={}){let n=new Pn;n.position.set(i.origin[0],i.floor,i.origin[1]),n.rotation.y=i.rotation,n.userData.landmark="\u666F\u533A\u68C0\u7968\u53E3";let s=new Ri(1,1,1),r=t("#40332d"),a=t("#373c3a"),o=t("#b9b2a4"),l=t("#9caeae"),h=t("#192626"),u=t("#e5dfcb"),f=t("#658b90"),g=t("#205b9c"),d=(y,v,p,x,T,M,C)=>{let P=new Ke(s,C);return P.position.set(y,v+T/2,p),P.scale.set(x,T,M),P.castShadow=P.receiveShadow=!0,n.add(P),P};d(0,-.3,-.65,19.2,.3,7.5,o);for(let y=0;y<5;y++)d(0,-1.3,3.3+y*.4,19.2,1.3-(y+1)*.18,.4,o);d(0,-1.16,5.65,19.2,.15,1.1,o);for(let y of[-9.1,-4.2,4.2,9.1]){let v=Math.abs(y)<5?5.4:4.65;d(y,0,2.7,.7,.8,.7,o),d(y,.8,2.7,.46,v-.8,.46,r),d(y,0,-3.7,.38,3.9,.38,r)}d(0,3.85,-.5,18.8,.2,6.6,a);for(let[y,v,p]of[[0,9.6,5.4],[-6.9,5.7,4.65],[6.9,5.7,4.65]])d(y,p-.35,2.7,v-.6,.35,.5,r),d(y,p,2.8,v,.28,1.65,a);d(0,3.65,2.7,18.4,.23,.32,r),d(0,4.32,3.025,7.95,.93,.18,r),d(0,4.39,3.125,7.72,.78,.035,h);for(let y of[-2.85,0,2.85])d(y,5.68,2.7,.065,1.08,.065,h);for(let y of[-3.1,-1.1,.9,2.9])d(y,0,.35,.38,.98,1.55,l),d(y,.98,.35,.4,.1,1.6,h);for(let y of[-8.5,-5.6]){for(let v of[-3.1,-.6,1.9])d(y,0,v,.065,1.05,.065,h);d(y,1,-.6,.07,.085,5.2,h)}if(d(6.6,0,-.5,3.7,2.65,4.7,u),d(6.6,1.02,1.867,3.38,1.34,.04,f),d(4.73,1.02,-.5,.04,1.34,4.34,f),d(6.6,1,1.904,.09,1.4,.07,r),d(6.6,2.65,-.5,4,.19,4.95,a),d(5.55,0,2.35,.82,1.68,.6,g),d(5.55,1,2.66,.65,.48,.035,u),d(5.55,1.08,2.688,.44,.27,.018,h),e){let y=D2(),v=(p,x,T,M,C,P,L,B,nt)=>{let A=new vs(M,C),w=A.attributes.uv;for(let Et=0;Et<w.count;Et++)w.setXY(Et,(P+w.getX(Et)*B)/1024,1-(L+(1-w.getY(Et))*nt)/512);let rt=new Ke(A,y);rt.position.set(p,x,T),n.add(rt)};v(0,4.8,3.152,7.35,.69,0,0,1024,96),[-2.85,0,2.85].forEach((p,x)=>v(p,6.55,2.74,1.85,1.85,x*224,112,224,208))}return n.userData.checkpoint={width:19.2,depth:10.65,height:7.5,steps:5,validators:4,approximateDimensions:!0},n}function Zg(i,{cellSize:t=400,enterDistance:e=2100,exitDistance:n=2500}={}){let s=i.geometry,r=s.attributes.position,a=s.index;if(Array.isArray(i.material)||s.groups.length||!r)return null;let o=a?a.count:r.count,l=new Map,h=new X;for(let y=0;y<o;y+=3){let v=a?a.getX(y):y,p=a?a.getX(y+1):y+1,x=a?a.getX(y+2):y+2,T=(r.getX(v)+r.getX(p)+r.getX(x))/3,M=(r.getZ(v)+r.getZ(p)+r.getZ(x))/3,C=Math.floor(T/t)+","+Math.floor(M/t),P=l.get(C);P||(P={indices:[],box:new es},l.set(C,P)),P.indices.push(v,p,x);for(let L of[v,p,x])P.box.expandByPoint(h.fromBufferAttribute(r,L))}let u=[];for(let{indices:y,box:v}of l.values()){let p=new Ln;for(let[C,P]of Object.entries(s.attributes))p.setAttribute(C,P);p.setIndex(y);let x=v.getCenter(new X),T=0;for(let C of y)T=Math.max(T,h.fromBufferAttribute(r,C).distanceToSquared(x));p.boundingBox=v,p.boundingSphere=new _s(x,Math.sqrt(T));let M=new Ke(p,i.material);M.castShadow=i.castShadow,M.receiveShadow=i.receiveShadow,M.renderOrder=i.renderOrder,M.layers.mask=i.layers.mask,M.matrixAutoUpdate=!1,M.visible=!1,M.raycast=()=>{},i.add(M),u.push(M)}let f={...s.drawRange},g=i.raycast;i.raycast=function(y,v){if(!this.visible)return;let{start:p,count:x}=s.drawRange;s.setDrawRange(f.start,f.count);try{g.call(this,y,v)}finally{s.setDrawRange(p,x)}};let d=!1;return{mesh:i,chunks:u,get near(){return d},update(y){let v=d?y<n:y<e;if(v===d)return!1;d=v,s.setDrawRange(f.start,d?0:f.count);for(let p of u)p.visible=d;return!0}}}function U2(i){let t=i.filter(s=>Number.isFinite(s)&&s>0).sort((s,r)=>s-r);if(!t.length)return{mean:0,p90:0,slow:!1,fast:!1};let e=t.reduce((s,r)=>s+r,0)/t.length,n=t[Math.min(t.length-1,Math.floor(t.length*.9))];return{mean:e,p90:n,slow:e>34||n>50,fast:e<19.5&&n<24}}var nu=class{constructor(t){this.setCeiling(t,!0)}setCeiling(t,e=!1){this.ceiling=t,this.floor=Math.min(1,t),this.limit=e?t:Math.max(this.floor,Math.min(this.limit,t)),e&&(this.holdUntil=0,this.recoverAfter=0)}pixelRatio(t=!1){return t?this.ceiling:this.limit}observe(t,e){let n=U2(t);if(!n.mean||e<this.holdUntil)return{...n,action:"hold"};let s="hold";return n.slow?(this.recoverAfter=e+15e3,this.limit>this.floor+.01?(this.limit=Math.max(this.floor,Math.round((this.limit-.25)*100)/100),this.holdUntil=e+2500,s="resolution-down"):s="tier-down"):n.fast&&e>=this.recoverAfter&&this.limit<this.ceiling-.01&&(this.limit=Math.min(this.ceiling,Math.round((this.limit+.25)*100)/100),this.holdUntil=e+4e3,this.recoverAfter=e+15e3,s="resolution-up"),{...n,action:s}}};var Jg="button,a,input,select,textarea,label,summary";function jg({compact:i,closePanel:t=null}){let e=P=>document.querySelector(P),n=e("#panel"),s=e("#card"),r=e("#settings"),a=r?.querySelector(".settings-wrap"),o=0,l=()=>{dispatchEvent(new Event("sheetchange")),clearTimeout(o),o=setTimeout(()=>dispatchEvent(new Event("sheetchange")),500)},h=[{el:n,watch:n,grow:!0,open:()=>!n.classList.contains("closed"),close:()=>t?t():e("#panel-close")?.click(),grab:(P,L)=>P.closest(".sheet-grip")?"grip":P.closest(Jg)?null:L<24?"grip":P.closest(".panel-head")?"head":null},{el:s,watch:s,grow:!0,open:()=>s.classList.contains("show"),close:()=>s.querySelector(":scope > .close")?.click(),grab:(P,L)=>P.closest("button,input,select,textarea,label,summary")?null:L<24?"grip":P.closest(".card-head")?P.closest("a")?null:"head":P.closest(".card-hero")?"hero":null},{el:a,watch:r,grow:!1,open:()=>!r.classList.contains("collapsed"),close:()=>e("#settings-toggle")?.click(),grab:(P,L)=>P.closest(Jg)?null:L<24||P.closest(".settings-head")?"head":null}].filter(P=>P.el&&P.watch),u=P=>P.open()&&i()&&P.el.offsetWidth>innerWidth*.6,f=null,g=0,d=P=>{P.style.transition="",P.style.transform=""},y=P=>{try{f.s.el.setPointerCapture(P.pointerId)}catch{}},v=()=>{let P=f.trail[0],L=f.trail[f.trail.length-1];return L[0]>P[0]?(L[1]-P[1])/(L[0]-P[0]):0},p=P=>{let L=P.timeStamp;for(f.trail.push([L,P.clientY]);f.trail.length>2&&L-f.trail[0][0]>100;)f.trail.shift()};function x(P,L){if(L.isPrimary&&L.button===0&&(g=0),f||!L.isPrimary||L.button!==0||!(L.target instanceof Element)||!u(P))return;let B=P.grab(L.target,L.clientY-P.el.getBoundingClientRect().top);B&&(f={s:P,kind:B,id:L.pointerId,x0:L.clientX,y0:L.clientY,drag:!1,trail:[[L.timeStamp,L.clientY]],expanded:P.el.classList.contains("expanded")},B!=="hero"&&y(L))}function T(P){if(!f||P.pointerId!==f.id)return;let L=P.clientX-f.x0,B=P.clientY-f.y0;if(!f.drag){if(Math.hypot(L,B)<8)return;if(f.kind==="hero"&&Math.abs(B)<=Math.abs(L)){f=null;return}f.drag=!0,y(P),f.s.el.style.transition="none"}p(P);let nt=f.s.grow&&!f.expanded,A=B>=0?B:nt?B>-40?B:Math.max(-64,-40+(B+40)*.2):Math.max(-40,B*.35);f.s.el.style.transform=`translateY(${A}px)`}function M(P){if(!f||P.pointerId!==f.id)return;let{s:L,kind:B,drag:nt,expanded:A}=f;if(!nt){f=null,B==="grip"&&L.grow&&(g=performance.now()+350,L.el.classList.toggle("expanded"),l());return}p(P);let w=P.clientY-f.y0,rt=v(),Et=L.el.offsetHeight;f=null,d(L.el),w>0&&(w>90||rt>.6)?A&&L.grow&&w<=Et*.45?(L.el.classList.remove("expanded"),l()):L.close():w<0&&L.grow&&!A&&(w<-50||rt<-.5)&&(L.el.classList.add("expanded"),l()),g=performance.now()+350}function C(P){!f||P.pointerId!==f.id||(f.drag&&d(f.s.el),f=null)}for(let P of h){P.el.addEventListener("pointerdown",nt=>x(P,nt)),P.el.addEventListener("pointermove",T),P.el.addEventListener("pointerup",M),P.el.addEventListener("pointercancel",C),P.el.addEventListener("click",nt=>{nt.detail===0&&!nt.pointerType||performance.now()<g&&(g=0,nt.preventDefault(),nt.stopPropagation())},!0),P.el.addEventListener("dragstart",nt=>{f?.s===P&&nt.preventDefault()}),P.grow||P.el.addEventListener("touchmove",nt=>{f?.s===P&&f.kind!=="hero"&&nt.preventDefault()},{passive:!1});let L=P.open(),B=0;new MutationObserver(()=>{let nt=P.open();nt!==L&&(L=nt,clearTimeout(B),nt?B&&(B=0,P.el.classList.remove("expanded"),l()):(f?.s===P&&(d(P.el),f=null),P.el.classList.contains("expanded")&&(B=setTimeout(()=>{B=0,P.open()||(P.el.classList.remove("expanded"),l())},480))))}).observe(P.watch,{attributes:!0,attributeFilter:["class"]})}}var Gt=i=>document.querySelector(i),Zi=i=>[...document.querySelectorAll(i)],iu={get(i){try{return localStorage.getItem("jiuhua."+i)}catch{return null}},set(i,t){try{localStorage.setItem("jiuhua."+i,t)}catch{}}},Xn=(i,t,e)=>Math.min(e,Math.max(t,i)),Ui=i=>()=>{i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};function Te(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function Ba(i){clearTimeout(i._t),i.hidden=!1,i.offsetWidth,i.classList.add("show")}function ko(i,t=440){i.classList.remove("show"),clearTimeout(i._t),i._t=setTimeout(()=>{i.classList.contains("show")||(i.hidden=!0)},t)}function Bl(i){let t=Gt("#toast");t.textContent=i,Ba(t),clearTimeout(Bl.t),Bl.t=setTimeout(()=>ko(t,400),3200)}function kd(i){let t=Te("div","photo-credit"),e=[i.author&&`\u6444\u5F71\uFF1A${i.author}`,i.takenAt&&`\u62CD\u6444\u4E8E ${i.takenAt}`].filter(Boolean).join(" \xB7 ");e&&t.append(Te("span","",e+" \xB7 "));for(let[n,s]of[[i.sourceName||"\u56FE\u7247\u51FA\u5904",i.sourceUrl],[i.license,i.licenseUrl]]){if(!n||!s)continue;let r=Te("a","",n);r.href=s,r.target="_blank",r.rel="noopener noreferrer",t.lastChild?.tagName==="A"&&t.append(" \xB7 "),t.append(r)}return t}function Kg({reducedMotion:i,onToggle:t,focusLost:e,restoreFocus:n,fallbackFocus:s}){function r(o,l,h="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",u=[],f=document.activeElement){let g=Gt("#viewer"),d=g.querySelector(".viewer-strip"),y=g.querySelector(".viewer-count"),v=g.querySelector(".viewer-prev"),p=g.querySelector(".viewer-next");g.classList.contains("show")||(g._opener=f),g.setAttribute("aria-label",h+"\u7167\u7247");let x=g.querySelector(".viewer-caption");x||(x=Te("div","viewer-caption"),x.onclick=P=>P.stopPropagation(),g.append(x)),d.replaceChildren(...o.map((P,L)=>{let B=Te("div","slide"),nt=Te("img");return nt.src=P,nt.alt=u[L]?.alt||h+" \xB7 "+(L+1),B.append(nt),B}));let T=()=>Xn(Math.round(d.scrollLeft/Math.max(1,d.clientWidth)),0,o.length-1),M=()=>{let P=T();y.textContent=`${P+1} / ${o.length}`,x.replaceChildren();let L=u[P];x.hidden=!L,L&&(x.append(Te("span","",L.alt)),L.sourceUrl&&x.append(kd(L)));let B=document.activeElement;v.hidden=p.hidden=o.length<2,v.disabled=P===0,p.disabled=P===o.length-1,(B===v&&v.disabled||B===p&&p.disabled)&&(p.disabled&&v.disabled?g.querySelector(".viewer-close"):B===v?p:v).focus({preventScroll:!0})};d.onscroll=M;let C=P=>d.scrollTo({left:Xn(T()+P,0,o.length-1)*d.clientWidth,behavior:i?"auto":"smooth"});g._go=C,v.onclick=P=>{P.stopPropagation(),C(-1)},p.onclick=P=>{P.stopPropagation(),C(1)},g.onclick=a,Ba(g),d.scrollLeft=l*d.clientWidth,M(),t(),g.querySelector(".viewer-close").focus({preventScroll:!0})}function a(){let o=Gt("#viewer"),l=o._opener,h=o.contains(document.activeElement);o._opener=null,ko(o,260),t(),(h||e())&&n(l,s())}return{open:r,close:a}}function Qg({W:i,D:t,stats:e,transit:n,places:s}){let r=s.filter(o=>o.searchable&&["service","transport"].includes(o.category)).length,a=s.filter(o=>["sight","nature","village"].includes(o.category)).length;return`<p>\u672C\u6B21\u66F4\u65B0\uFF1A2026 \u5E74 9 \u6708 28 \u65E5\u3002\u8986\u76D6\u7EA6 ${(i/1e3).toFixed(2)} \xD7 ${(t/1e3).toFixed(2)} \u516C\u91CC\uFF0C\u91CD\u70B9\u4E3A\u4E5D\u534E\u8857\u3001\u767E\u5C81\u5BAB\u3001\u95F5\u56ED\u3001\u5929\u53F0\u4E0E\u82B1\u53F0\u3002\u5B83\u662F\u4F9D\u636E\u516C\u5F00\u8D44\u6599\u91CD\u5EFA\u7684\u53EF\u4EA4\u4E92\u6A21\u578B\uFF0C\u4E0D\u662F\u503E\u659C\u6444\u5F71\u6216\u5B9E\u6D4B\u6210\u679C\u3002</p>
<table><tr><th>\u5185\u5BB9</th><th>\u4F9D\u636E\u4E0E\u7CBE\u5EA6</th></tr>
<tr><td>\u5C45\u4E4B\u6797\u6C11\u5BBF</td><td>\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u4E0E\u822A\u62CD\u56FE\u624B\u5DE5\u5EFA\u6A21\uFF1B\u73B0\u6709\u536B\u661F\u5F71\u50CF\u65E9\u4E8E\u65B0\u5EFA\uFF0C\u843D\u4F4D\u6309\u95E8\u724C\u987A\u5E8F\u4F30\u8BA1\uFF0C\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002</td></tr>
<tr><td>${e.buildings} \u4E2A\u5EFA\u7B51\u8F6E\u5ED3</td><td>${e.osmBuildings} \u4E2A OpenStreetMap \u8F6E\u5ED3 + ${e.supplementaryBuildings} \u4E2A Overture \u5F71\u50CF\u8BC6\u522B\u8865\u5145\u8F6E\u5ED3\u3002\u697C\u5C42\u3001\u5899\u8272\u3001\u74E6\u8272\u3001\u9A6C\u5934\u5899\u3001\u62AB\u6A90\u3001\u5E97\u9762\u6309\u7247\u533A\u89C4\u5F8B\u5206\u914D\uFF08${e.levelsRankedByGlobfp||0} \u680B\u7684\u697C\u5C42\u9AD8\u4F4E\u987A\u5E8F\u53C2\u8003 3D-GloBFP \u4F30\u7B97\u9AD8\u5EA6\uFF09\uFF0C\u89C4\u5F8B\u6765\u81EA\u89C4\u5212\u6587\u4EF6\u4E0E\u516C\u5F00\u7167\u7247\uFF0C\u9010\u680B\u672A\u5B9E\u6D4B\u3002\u70B9\u5EFA\u7B51\u53EF\u770B\u4F9D\u636E\u3002</td></tr>
<tr><td>\u5730\u70B9\u6807\u6CE8</td><td>\u5BFA\u5E99 ${e.temples} \xB7 \u666F\u70B9\u5C71\u6C34\u4E0E\u6751\u843D ${a} \xB7 \u516C\u5171\u8BBE\u65BD ${r}\uFF08\u8F66\u7AD9\u3001\u7D22\u9053\u3001\u505C\u8F66\u573A\u3001\u516C\u5395\u3001\u6E38\u5BA2\u4E2D\u5FC3\u3001\u6D3E\u51FA\u6240\u3001\u533B\u9662\u7B49\uFF09\uFF1B\u53E6\u6709 ${e.halls} \u5904\u6BBF\u5802\u5C0F\u6807\u6CE8\u3002\u591A\u4E2A\u5E73\u53F0\u7684\u540C\u4E00\u5730\u70B9\u5DF2\u5408\u5E76\u3002\u9664\u5C45\u4E4B\u6797\u5916\uFF0C\u5730\u56FE\u4E0D\u6807\u6CE8\u5546\u5BB6\u3002</td></tr>
<tr><td>\u771F\u5B9E\u5730\u5F62</td><td>Copernicus GLO-30\uFF082011\u20132015 \u96F7\u8FBE\u6D4B\u91CF\uFF09\uFF0C257\xD7257 \u7F51\u683C\u7EA6 21 m \u95F4\u8DDD\uFF1B\u4E0E SRTM \u76F8\u6BD4\u5CF0\u9876\u548C\u7D22\u9053\u9AD8\u5DEE\u66F4\u63A5\u8FD1\u5B98\u65B9\u6570\u636E\u3002\u5C40\u90E8\u4E0E\u5176\u4ED6\u9AD8\u7A0B\u6E90\u76F8\u5DEE 30 m \u4EE5\u4E0A\u7684\u683C\u70B9\u53D6\u56DB\u6E90\u4E2D\u4F4D\u6570\u3002\u4ECD\u662F\u8868\u9762\u6A21\u578B\uFF08\u542B\u6811\u51A0\uFF09\u3002</td></tr>
<tr><td>\u4E3B\u8981\u5BFA\u9662</td><td>\u5316\u57CE\u5BFA\u3001\u7947\u56ED\u5BFA\u3001\u8089\u8EAB\u5B9D\u6BBF\u3001\u767E\u5C81\u5BAB\u3001\u65C3\u6A80\u7985\u6797\u7B49\u7684\u5899\u8272\u3001\u74E6\u8272\u3001\u5C4B\u9876\u5F62\u5F0F\u4F9D\u636E\u5B98\u65B9\u89C4\u5212\u3001\u516C\u5F00\u7167\u7247\u4E0E\u536B\u661F\u5F71\u50CF\uFF1B\u6BBF\u4F53\u6BD4\u4F8B\u3001\u7EC6\u90E8\u4ECD\u5C5E\u590D\u539F\u3002</td></tr></table>
<h3>\u666F\u533A\u4EA4\u901A\uFF08\u5B98\u7F51 ${n?.retrieved||""}\uFF09</h3>${(n?.routes||[]).map(o=>`<p><b>${o.name}</b>\u3000${o.hours}<br><small>${o.stops.join(" \u2192 ")}${o.note?"\u3002"+o.note:""}</small></p>`).join("")}<p>${(n?.cableways||[]).map(o=>`${o.name} ${o.hours}`).join("\u3000\xB7\u3000")}<br><small>\u65C5\u6E38\u54A8\u8BE2 ${n?.hotlines?.\u65C5\u6E38\u54A8\u8BE2\u6295\u8BC9||""} \xB7 \u7D27\u6025\u6551\u63F4 ${n?.hotlines?.\u7D27\u6025\u6551\u63F4||""} \xB7 \u5C1A\u65E0\u516C\u5F00\u5750\u6807\u7684\u7AD9\u70B9\uFF1A${(n?.unlocatedStops||[]).join("\u3001")}</small></p>
<h3>\u5750\u6807\u4E0E\u6570\u636E\u8D28\u91CF</h3><p>\u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u7B49\u5E73\u53F0\u7684 GCJ-02 \u5750\u6807\u5747\u7528 coordtransform \u6362\u7B97\u4E3A WGS84\uFF0C\u539F\u59CB\u5750\u6807\u4FDD\u5B58\u5728\u6570\u636E\u4E2D\uFF1B\u6BCF\u4E2A\u6570\u636E\u96C6\u90FD\u7ECF\u8FC7\u72EC\u7ACB\u62BD\u68C0\u3002\u7EF4\u57FA\u6570\u636E\u7B49\u5F00\u653E\u6570\u636E\u4E2D\u7EA6 1 km \u504F\u79FB\u7684\u5BFA\u5E99\u70B9\uFF08\u767E\u5EA6\u5750\u6807\u8BEF\u6807\u4E3A WGS84\uFF09\u672A\u7528\u4E8E\u5B9A\u4F4D\u3002\u5730\u70B9\u5B9A\u4F4D\u4F9D\u636E\u53EF\u5728\u7B80\u4ECB\u5361\u7684\u201C\u8D44\u6599\u4E0E\u4F9D\u636E\u201D\u4E2D\u67E5\u770B\u3002</p>
<h3>\u8D44\u6599\u4E0E\u8BB8\u53EF</h3><p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors / ODbL</a> \xB7 <a href="https://docs.overturemaps.org/attribution/" target="_blank" rel="noopener">Overture Maps\uFF1A\u5EFA\u7B51 ODbL\uFF1B\u5730\u70B9 CDLA-Permissive 2.0</a> \xB7 <a href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model" target="_blank" rel="noopener">Copernicus DEM GLO-30 \xA9 DLR e.V. 2010-2014 and \xA9 Airbus Defence and Space GmbH 2014-2018\uFF0C\u7531 ESA \u5728 Copernicus \u8BA1\u5212\u4E0B\u63D0\u4F9B</a> \xB7 <a href="https://www.jiuhuashan.gov.cn/file_cz/54/202506/202506269aaa0b14711f440284eefd14e047a66e.pdf" target="_blank" rel="noopener">\u4E5D\u534E\u5C71\u5B98\u65B9\u5730\u8D28\u516C\u56ED\u89C4\u5212</a> \xB7 <a href="https://doi.org/10.5194/essd-16-5357-2024" target="_blank" rel="noopener">3D-GloBFP \u5EFA\u7B51\u9AD8\u5EA6\uFF08Che \u7B49 2024\uFF0CCC BY 4.0\uFF09</a>\uFF0C\u4EC5\u7528\u4E8E\u540C\u7247\u533A\u5185\u697C\u5C42\u9AD8\u4F4E\u6392\u5E8F \xB7 \u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u516C\u5F00\u9875\u9762\uFF08\u9010\u6761\u94FE\u63A5\u89C1\u5730\u70B9\u5361\u7247\uFF09</p><p>\u8865\u5145\u5EFA\u7B51\u7531 Qian Shi \u7B49\u7684\u4E1C\u4E9A\u5EFA\u7B51\u6570\u636E\u7ECF Overture \u63D0\u4F9B\uFF0C\u539F\u59CB\u6570\u636E\u4E3A <a href="https://doi.org/10.5281/zenodo.8174931" target="_blank" rel="noopener">CC BY 4.0</a>\uFF1B\u672C\u9879\u76EE\u505A\u4E86\u88C1\u526A\u3001\u53BB\u91CD\u4E0E\u5C4B\u9876\u91CD\u5EFA\u3002\u5B98\u65B9\u7167\u7247\u4E0E\u516C\u5F00\u7167\u7247\u4EC5\u7528\u4E8E\u5F52\u7EB3\u5916\u89C2\u89C4\u5F8B\uFF0C\u672A\u4F5C\u4E3A\u8D34\u56FE\u3002</p>`}var zl=i=>getComputedStyle(document.documentElement).getPropertyValue(i).trim(),su=/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;function lo(i,t,e,n,s,r){r=Math.max(0,Math.min(r,n/2,s/2)),i.beginPath(),i.roundRect?i.roundRect(t,e,n,s,r):(i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath())}function ru(i,t,e,n){let s=t&&t!=="none"&&t.match(su);if(s&&s.length>1){let r=+(t.match(/([\d.]+)deg/)?.[1]??180)*Math.PI/180,a=Math.sin(r),o=-Math.cos(r),l=(Math.abs(n.width*a)+Math.abs(n.height*o))/2,h=n.x+n.width/2,u=n.y+n.height/2,f=i.createLinearGradient(h-a*l,u-o*l,h+a*l,u+o*l);return f.addColorStop(0,s[0]),f.addColorStop(1,s.at(-1)),f}return!e||/^transparent$|^rgba\(.*,\s*0\)$/.test(e)?null:e}function ou(i,t,e,n,s){for(let r of t)i.fillText(r,e,n),e+=i.measureText(r).width+s;return e}var tx=(i,t,e)=>i.measureText(t).width+[...t].length*e;function ex(i,t,e,n){let s=parseFloat(t.borderTopLeftRadius)||0,r=ru(i,t.backgroundImage,t.backgroundColor,e),a=parseFloat(t.borderTopWidth)||0,o=t.boxShadow==="none"?[]:t.boxShadow.split(/,(?![^(]*\))/).filter(l=>!/inset/.test(l)).map(l=>({col:l.match(su)?.[0]||"transparent",v:l.replace(su,"").trim().split(/\s+/).map(parseFloat)}));for(let l of o)!l.v[2]&&l.v[3]>0&&(lo(i,e.x+l.v[0]-l.v[3],e.y+l.v[1]-l.v[3],e.width+2*l.v[3],e.height+2*l.v[3],s+l.v[3]),i.fillStyle=l.col,i.fill());if(r){let l=o.filter(h=>h.v[2]>0).sort((h,u)=>u.v[2]-h.v[2])[0];i.save(),l&&(i.shadowColor=l.col,i.shadowBlur=l.v[2]*n*.8,i.shadowOffsetX=l.v[0]*n,i.shadowOffsetY=l.v[1]*n),lo(i,e.x,e.y,e.width,e.height,s),i.fillStyle=r,i.fill(),i.restore()}a&&t.borderTopStyle!=="none"&&ru(i,"none",t.borderTopColor,e)&&(i.lineWidth=a,i.strokeStyle=t.borderTopColor,i.setLineDash(t.borderTopStyle==="dashed"?[3,2]:[]),lo(i,e.x+a/2,e.y+a/2,e.width-a,e.height-a,s-a/2),i.stroke(),i.setLineDash([]))}function nx(i,t,e){for(let n of t.childNodes){if(n.nodeType===3){let a=n.textContent;if(!a.trim())continue;let o=getComputedStyle(t),l=document.createRange();l.selectNodeContents(n);let h=l.getBoundingClientRect(),u=parseFloat(o.letterSpacing)||0,f=h.y+h.height/2;if(i.font=`${o.fontStyle} ${o.fontWeight} ${o.fontSize} ${o.fontFamily}`,i.textAlign="left",i.textBaseline="middle",i.fillStyle=o.color,o.textShadow!=="none"){i.save(),i.shadowColor="rgba(255,255,255,.95)";for(let g of[3,9])i.shadowBlur=g*e,ou(i,a,h.x,f,u);i.restore()}ou(i,a,h.x,f,u);continue}if(n.nodeType!==1)continue;let s=getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden"||+s.opacity<.05)continue;let r=n.getBoundingClientRect();if(n.tagName.toLowerCase()==="svg"){let a=n.viewBox?.baseVal,o=n.querySelector("path");o&&a?.width&&(i.save(),i.translate(r.x,r.y),i.scale(r.width/a.width,r.height/a.height),i.fillStyle=s.fill,i.fill(new Path2D(o.getAttribute("d"))),i.restore());continue}ex(i,s,r,e),nx(i,n,e)}}function N2(i,t,e,n){let s=t.querySelector("button"),r=getComputedStyle(s),a=s.getBoundingClientRect();if(!a.width||r.visibility==="hidden"||a.x<0||a.y<0||a.right>innerWidth||a.bottom>n)return;let o=t.querySelector("i"),l=o&&getComputedStyle(o);if(l&&l.display!=="none"){let f=getComputedStyle(o,"::after"),g=parseFloat(f.width)||0;i.save();let d,y;if(t.classList.contains("pin")){let v=t.getBoundingClientRect();d=v.x+v.width/2,y=v.bottom;let p=Xn(d,a.x,a.right),x=Xn(y,a.y,a.bottom);if(Math.hypot(p-d,x-y)>=3){let T=parseFloat(l.height)||1.5,M=l.boxShadow.match(/rgba?\([^)]*\)/);i.lineCap="round",M&&(i.strokeStyle=M[0],i.lineWidth=T+1.5,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()),i.strokeStyle=l.backgroundColor,i.lineWidth=T,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()}}else{let v=o.getBoundingClientRect();i.globalAlpha=t.classList.contains("route-stop")?+l.opacity:1,i.fillStyle=ru(i,l.backgroundImage,l.backgroundColor,v)||"transparent",i.fillRect(v.x,v.y,v.width,v.height),d=v.x+v.width/2,y=v.bottom-(parseFloat(f.bottom)||0)-g/2}if(g){let v=f.boxShadow.match(/(rgba?\([^)]*\)) 0px 0px 0px ([\d.]+)px/);v&&(i.fillStyle=v[1],i.beginPath(),i.arc(d,y,g/2+ +v[2],0,7),i.fill()),i.fillStyle=f.backgroundColor,i.beginPath(),i.arc(d,y,g/2,0,7),i.fill()}i.restore()}ex(i,r,a,e);let h=getComputedStyle(s,"::before"),u=parseFloat(h.width)||0;u&&h.display!=="none"&&h.content!=="none"&&(i.fillStyle=h.backgroundColor,i.beginPath(),i.arc(a.x+(parseFloat(r.borderLeftWidth)||0)+(parseFloat(r.paddingLeft)||0)+u/2,a.y+a.height/2,u/2,0,7),i.fill()),nx(i,s,e)}function ix({frame:i,stats:t,render:e}){let n=innerWidth,s=innerHeight,r=Math.min(2,Math.max(devicePixelRatio||1,i.width/n)),a=document.createElement("canvas");a.width=Math.round(n*r),a.height=Math.round(s*r);let o=a.getContext("2d"),l=zl("--sans")||"sans-serif",h=zl("--serif")||"serif",u=zl("--ink")||"#1c2a25",f=zl("--muted")||"#5c6962";o.font=`10.5px ${l}`;let g=[];for(let tt of[["\xA9 OpenStreetMap contributors","Overture Maps Foundation","Copernicus DEM (ESA)","\u53BB\u54EA\u513F/360\u5730\u56FE/OSM \u516C\u5F00\u5730\u70B9"],["\u8865\u5145\u8F6E\u5ED3\uFF1AQian Shi \u7B49 / CC BY 4.0","\u5EFA\u7B51\u697C\u9AD8\u3001\u7ACB\u9762\u53CA\u690D\u88AB\u4E3A\u8FD1\u4F3C\u590D\u539F"]]){let ft="";for(let Mt of tt){let Wt=ft?ft+" \xB7 "+Mt:Mt;ft&&o.measureText(Wt).width>n-24?(g.push(ft),ft=Mt):ft=Wt}g.push(ft)}let d=12+g.length*15,y=n<600?12:24,v=15,p=44,x=y+v+p+13,T="\u4E5D\u534E\u5C71",M="\u4E09\u7EF4\u5B9E\u5730\u5BFC\u89C8 \xB7 \u8D70\u8FD1\u4E5D\u534E",C=`${t.buildings} \u5EFA\u7B51\u8F6E\u5ED3 \xB7 ${t.places} \u5730\u70B9 \xB7 2026.09.27`;o.font=`600 26px ${h}`;let P=tx(o,T,3.64);o.font=`12.5px ${l}`;let L=tx(o,M,.75);o.font=`11px ${l}`;let B=o.measureText(C).width,nt=x-y+Math.max(P,L,B)+20,A=v*2+66,w=e([[y,y,y+nt,y+A],[0,s-d,n,s]]);o.fillStyle="#dce5df",o.fillRect(0,0,a.width,a.height),o.drawImage(i,0,0,a.width,a.height),o.scale(r,r);for(let tt of w.filter(ft=>ft.classList.contains("maplabel")&&ft.style.display!=="none").sort((ft,Mt)=>(parseInt(getComputedStyle(ft).zIndex)||0)-(parseInt(getComputedStyle(Mt).zIndex)||0)))N2(o,tt,r,s-d);o.save(),o.shadowColor="rgba(20,32,27,.24)",o.shadowBlur=20*r,o.shadowOffsetY=6*r,lo(o,y,y,nt,A,18),o.fillStyle="rgba(251,249,243,.96)",o.fill(),o.restore(),o.lineWidth=1,o.strokeStyle="rgba(28,42,37,.09)",lo(o,y+.5,y+.5,nt-1,A-1,17.5),o.stroke();let rt=y+v,Et=y+v,re=zl("--zhu-fill").match(su)||["#c24536","#a8322a"];return o.fillStyle=ru(o,`linear-gradient(160deg, ${re[0]}, ${re.at(-1)})`,null,{x:rt,y:Et,width:p,height:p}),lo(o,rt,Et,p,p,10),o.fill(),o.lineWidth=2,o.strokeStyle="#b23a2d",lo(o,rt+1,Et+1,p-2,p-2,9),o.stroke(),o.lineWidth=1,o.strokeStyle="rgba(251,241,230,.55)",lo(o,rt+2.5,Et+2.5,p-5,p-5,7.5),o.stroke(),o.fillStyle="#fbf1e6",o.font=`600 16px ${h}`,o.textAlign="center",o.textBaseline="middle",o.fillText("\u4E5D",rt+p/2,Et+p/2-8.5),o.fillText("\u534E",rt+p/2,Et+p/2+8.5),o.textAlign="left",o.textBaseline="alphabetic",o.fillStyle=u,o.font=`600 26px ${h}`,ou(o,T,x,Et+25,3.64),o.fillStyle=f,o.font=`12.5px ${l}`,ou(o,M,x,Et+46,.75),o.font=`11px ${l}`,o.fillText(C,x,Et+64),o.fillStyle="rgba(251,249,243,.95)",o.fillRect(0,s-d,n,d),o.fillStyle="rgba(28,42,37,.09)",o.fillRect(0,s-d,n,1),o.fillStyle=f,o.font=`10.5px ${l}`,o.textBaseline="middle",g.forEach((tt,ft)=>o.fillText(tt,12,s-d+13.5+ft*15)),a}function O2(i,t,{W:e,D:n}){let{longitude:s,latitude:r,accuracy:a}=i;if(![s,r,a].every(Number.isFinite)||Math.abs(s)>180||Math.abs(r)>90||a<0)return null;let{origin:o,kx:l,ky:h}=t;if(!o||![o.lon,o.lat,l,h,e,n].every(Number.isFinite)||l<=0||h<=0||e<=0||n<=0)return null;let u=(s-o.lon)*l,f=(o.lat-r)*h;return{x:u,z:f,accuracy:a,inside:Math.abs(u)<=e/2&&Math.abs(f)<=n/2}}function sx({geo:i,terrain:t,onChange:e,geolocation:n=navigator.geolocation,secure:s=window.isSecureContext,doc:r=document,win:a=window,now:o=Date.now,schedule:l=setInterval,unschedule:h=clearInterval,maxAccuracy:u=100,maxAge:f=3e4,retainAge:g=12e4,retryAfter:d=6e4,maxRetryAfter:y=24e4}){let v=!1,p=!1,x=null,T=0,M=null,C="",P=0,L=null,B=0,nt=d,A=0,w=null,rt=!1,Et=null,re=5e3,tt=()=>L&&o()-P<=g?L:null,ft=()=>L&&o()-P<=f;function Mt(We,Ze=null,De=!1){let Be=We!==C;C=We;let K=Ze&&w?.point&&Math.hypot(Ze.x-w.point.x,Ze.z-w.point.z)<1&&Math.ceil(Ze.accuracy/10)===Math.ceil(w.point.accuracy/10);!Be&&w?.enabled===v&&w.fresh===De&&(!Ze&&!w.point||K)||(w={state:C,point:Ze,enabled:v,changed:Be,fresh:De},e(w))}function Wt(){T++,x!==null&&(n.clearWatch(x),x=null)}function Zt(){Et=null,Wt(),M!==null&&(h(M),M=null)}function At(){L=null,P=0,A=0,rt=!1,re=5e3}function Yt(){!rt&&Et===null&&(Et=o()+re)}function le(){v&&(v=!1,Zt(),At(),Mt("off"))}function Me(){Et=null,Wt(),B=o();let We=T;Mt("waiting",tt());try{let Ze=n.watchPosition(De=>{if(We!==T||!v||r.hidden)return;if(B=o(),!Number.isFinite(De.timestamp)||o()-De.timestamp>f||De.timestamp>o()+5e3){Yt(),Mt("stale",tt());return}let Be=O2(De.coords,i,t);if(!Be){Yt(),Mt("unavailable",tt());return}if(Be.accuracy>u){A++,(Be.accuracy>u*2||A>=3)&&(L=null,P=0),Mt(Be.accuracy>=1e3?"approximate":"inaccurate",tt());return}A=0,nt=d,rt=!0,Et=null,re=5e3,L=Be.inside?Be:null,P=De.timestamp,Mt(Be.inside?"inside":"outside",L,!!L)},De=>{We!==T||!v||r.hidden||(De.code===1?(v=!1,Zt(),At(),Mt("denied")):(Yt(),Mt(De.code===3?"timeout":"unavailable",tt())))},{enableHighAccuracy:!0,maximumAge:0,timeout:15e3});We===T&&v?x=Ze:n.clearWatch(Ze)}catch{v=!1,Zt(),At(),Mt("unavailable")}}function Rt(){if(!v||r.hidden)return;if(Et!==null){o()>=Et&&(re=Math.min(6e4,re*2),Me());return}let We=tt();C==="inside"&&!ft()?Mt("stale",We):w?.point&&!We&&Mt(C),o()-B>=nt&&(nt=Math.min(y,nt*2),Me())}function Ct(){M=l(Rt,5e3),Me()}function ne(){if(!(v||p)){if(!s){Mt("insecure");return}if(!n){Mt("unsupported");return}At(),nt=d,v=!0,r.hidden?Mt("paused"):Ct()}}function Re(){v&&(Zt(),r.hidden?Mt("paused",tt()):Ct())}function Le(){v&&le()}return r.addEventListener("visibilitychange",Re),a.addEventListener("pagehide",Le),{start:ne,stop:le,get enabled(){return v},destroy(){le(),p=!0,r.removeEventListener("visibilitychange",Re),a.removeEventListener("pagehide",Le)}}}var rx=Ag(),Hd=()=>matchMedia("(max-width:820px), (max-width:960px) and (orientation:landscape) and (max-height:520px)").matches,Hn=Hd(),ks=Hn||matchMedia("(pointer:coarse)").matches&&!matchMedia("(any-pointer:fine)").matches,Or=[{name:"\u6D41\u7545",dpr:1,pbr:!1,blur:!1,hiShapes:!1,forest:0,bamboo:!1,trunkDist:0,detailDist:450,landmarkDist:2600,labelCap:16,shadows:!1},{name:"\u6807\u51C6",dpr:1.5,pbr:!1,blur:!1,hiShapes:!1,forest:1,bamboo:!0,trunkDist:1400,detailDist:900,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u9AD8\u6E05",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:2600,detailDist:2600,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u6781\u81F4",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:1e9,detailDist:1e9,landmarkDist:4e3,labelCap:null,shadows:!0}],Vd=ks?2:3,di=+(iu.get("autoTier")??(ks?1:3));di>=0&&di<=Vd||(di=ks?1:3);var vr=!1,kl=matchMedia("(prefers-reduced-motion:reduce)").matches,F2=matchMedia("(hover:hover) and (pointer:fine)");function ox(i){let t=Gt("#loading");t.hidden=!1,t.classList.remove("done"),t.classList.add("failed"),Gt("#load-text").textContent=i;let e=Gt("#reload");e.hidden=!1,e.onclick=()=>location.reload()}addEventListener("gesturestart",i=>i.preventDefault());function B2(){let i=Gt("#reload");i.hidden||Gt("#loading").classList.contains("failed")||(i.hidden=!0,Gt("#load-text").textContent="\u8BFB\u53D6\u5730\u5F62\u4E0E\u771F\u5B9E\u5EFA\u7B51\u8F6E\u5ED3")}try{await z2()}catch(i){console.error(i),ox(/webgl/i.test(i.message)?"\u8FD9\u4E2A\u6D4F\u89C8\u5668\u65E0\u6CD5\u663E\u793A\u4E09\u7EF4\u5730\u56FE\uFF08WebGL \u4E0D\u53EF\u7528\uFF09\u3002\u8BF7\u6362\u7528\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6216\u66F4\u65B0\u6D4F\u89C8\u5668\u540E\u91CD\u8BD5\uFF1B\u5728\u5FAE\u4FE1\u91CC\u53EF\u70B9\u53F3\u4E0A\u89D2\u201C\xB7\xB7\xB7\u201D\uFF0C\u9009\u201C\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u201D\u3002":"\u5730\u56FE\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u3002"+i.message)}async function z2(){let[i,t]=window.__JIUHUA_DATA__||await Promise.all(["data/terrain.json","data/geodata.json?v=20261004-flickr-photos"].map(async c=>{let m=await fetch(c);if(!m.ok)throw new Error(c);return m.json()}));B2(),t.water=t.water.filter(c=>!(c.kind==="stream"&&c.pts.every(m=>m[0]>=-1900&&m[0]<=-1195&&m[1]>=-165&&m[1]<=230)));for(let c of t.water){let m=c.pts;if(c.kind!=="river"||Math.hypot(m[0][0]+1226,m[0][1]+159)>5)continue;let _=m.findIndex(b=>b[1]<-761.7);if(_>0){let b=m[_-1],E=m[_],R=(-761.7-b[1])/(E[1]-b[1]);c.pts=[[b[0]+(E[0]-b[0])*R,-761.7],...m.slice(_)]}}t.areas.push({kind:"plaza",ring:[[-1338,-60],[-1372,10],[-1398,-1],[-1370,-70]]}),hm(t),t.roads.push({id:"lane-hushan-plaza",name:"",kind:"alley",width:1.5,drape:!0,pts:[[-1341.3,-48.2],[-1376,0]]}),t.roads.push({id:"lane-hushan-huacheng",name:"",kind:"alley",width:1.5,pts:[[-1376,0],[-1386,27],[-1385,56],[-1378,64],[-1357,101],[-1350.5,108],[-1350.5,114.5],[-1355.8,120.5],[-1355,126],[-1352,133],[-1349.5,140]]}),t.roads.push({id:"lane-police",name:"",kind:"alley",width:2,pts:[[-1408.5,-146.8],[-1424,-140],[-1450,-128.5],[-1475,-117],[-1481,-116.5],[-1487.5,-110]]}),t.roads.push({id:"lane-huacheng",name:"",kind:"alley",width:1.2,pts:[[-1330.4,238.6],[-1330.4,226.5],[-1330.6,224.6],[-1334.5,222.3],[-1341.5,219.6],[-1344.6,211],[-1347.6,205.6],[-1348.4,201]]});let{W:e,D:n,N:s}=i,r=Uint8Array.from(atob(i.h),c=>c.charCodeAt(0)),a=new DataView(r.buffer),o=new Float32Array(s*s);for(let c=0;c<o.length;c++)o[c]=a.getUint16(c*2,!0)/4;let l=1.6,h=l,u=am(o).min;for(let c=0;c<o.length;c++)o[c]=u+(o[c]-u)*l;let f=c=>u+(c-u)/l;for(let c of t.buildings)c.base=u+(c.base-u)*l;function g(c,m){let _=Xn((c+e/2)/e*(s-1),0,s-1.001),b=Xn((m+n/2)/n*(s-1),0,s-1.001),E=_|0,R=b|0,U=_-E,W=b-R;return(o[R*s+E]*(1-U)+o[R*s+E+1]*U)*(1-W)+(o[(R+1)*s+E]*(1-U)+o[(R+1)*s+E+1]*U)*W}let d=t.places.find(c=>c.model?.kind==="entrance-checkpoint"),y=qg(d,g);function v(c,m){let _=g(c,m);return y?y.height(c,m,_):_}let p=new Tl({antialias:!(ks&&devicePixelRatio>=2),alpha:!0,powerPreference:"high-performance"});document.documentElement.classList.toggle("lite",!Or[di].blur);let x=()=>Math.min(devicePixelRatio,vr?.8:Or[di].dpr),T=new nu(x()),M=!1,C=0,P=()=>T.pixelRatio(M),L=()=>Or[di].shadows&&!Hn&&!ks;function B(c=!1,m=performance.now()){M=c;let _=P();Math.abs(p.getPixelRatio()-_)<.01||(p.setPixelRatio(_),C=m)}p.setPixelRatio(P()),p.outputColorSpace=kn,p.toneMapping=Ed,p.toneMappingExposure=1,p.shadowMap.enabled=L(),p.shadowMap.type=bd,Gt("#stage").appendChild(p.domElement),p.domElement.addEventListener("webglcontextlost",c=>{c.preventDefault(),ox("\u8BBE\u5907\u56FE\u5F62\u5185\u5B58\u4E0D\u8DB3\uFF0C\u4E09\u7EF4\u753B\u9762\u5DF2\u505C\u6B62\u3002\u5173\u95ED\u5176\u4ED6\u9875\u9762\u540E\u70B9\u201C\u91CD\u65B0\u52A0\u8F7D\u201D\u3002")});let nt=new Zh;nt.domElement.className="labels",Gt("#stage").appendChild(nt.domElement);let A=new Pn;A.matrixWorldAutoUpdate=!1;let w=[],rt=!0,Et=0,re=0,tt=!0,ft=[],Mt=0,Wt=new mh;Wt.fog=new ph("#f4dcc0",2e-4);let Zt=()=>{Wt.fog.density=.13/Xn(Ct.position.distanceTo(ne.target),600,2e4)},At=new Pn,Yt=new Pn,le=new Pn,Me=new Pn,Rt=new Pn;Wt.add(At),At.add(Yt,le,Me,Rt);let Ct=new Gi(43,1,.7,32e3),ne=Mg(Ct,Gt("#stage"),Yx);ne.enableDamping=!0,ne.dampingFactor=.075,ne.minDistance=10,ne.maxDistance=12500,ne.maxPolarAngle=Math.PI*.482,ne.zoomToCursor=!0,ne.screenSpacePanning=!1,Wt.add(new Nh("#fff6e8","#7a8a70",1.1));let Re=new Oh("#fff0d6",2.6);Re.position.set(-2600,1900,-1500),Re.castShadow=L(),Re.shadow.mapSize.set(4096,4096),Object.assign(Re.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:6500}),Re.shadow.bias=-1e-4,Re.shadow.normalBias=.7,Wt.add(Re,Re.target);let Le=c=>new fn(c),We=["roughness","metalness","roughnessMap","metalnessMap","envMapIntensity"],Ze=c=>{let m={...c};for(let _ of We)delete m[_];return m},De=(()=>{let c=new xh(new Uint8Array([168,168,168,255,214,214,214,255,255,255,255,255]),3,1);return c.minFilter=c.magFilter=Pi,c.needsUpdate=!0,c})();function Be(c={}){let m=new Ih({...Ze(c),gradientMap:De});return m.userData.params=c,m}let K=["side","transparent","opacity","depthWrite","depthTest","polygonOffset","polygonOffsetFactor","polygonOffsetUnits","alphaTest","vertexColors","map","emissiveMap","emissiveIntensity","fog","toneMapped","flatShading","name"];function Se(c,m){if(c.isMeshToonMaterial||!c.userData.params||c.isMeshStandardMaterial===m)return c;if(c.userData.twin)return c.userData.twin;let _=m?new Lh(c.userData.params):new Dh(Ze(c.userData.params));for(let b of K)b in c&&b in _&&(_[b]=c[b]);return _.color?.copy(c.color),_.emissive?.copy(c.emissive),_.onBeforeCompile=c.onBeforeCompile,_.userData.params=c.userData.params,_.userData.twin=c,c.userData.twin=_,_}let lt=(c,m={})=>Be({color:c,roughness:.9,metalness:0,...m}),_e={},Jt=null;function ke(c){return _e[c]??=c?{leaf:Va(),pine:new ro(1,1,6),trunk:new Wi(.18,.3,1,4,1,!0),bamboo:Va(),lantern:new Xi(.24,10,8)}:{leaf:Va(),pine:new ro(1,1,6,1,!0),trunk:new Wi(.18,.3,1,3,1,!0),bamboo:Va(),lantern:Va().scale(.24,.24,.24)}}let be=lt("#b9b7a4"),O=lt("#594937"),I=lt("#e0a83a",{roughness:.67}),yt=lt("#c0452f"),ye=lt("#77889a"),pe=lt("#466266",{roughness:.3,metalness:.15}),ue=new Ri(1,1,1),Xe=new Wi(1,1,1,8);function qt(c,m,_,b,E,R,U,W){let H=new Ke(ue,W);return H.position.set(m,_+R/2,b),H.scale.set(E,R,U),H.castShadow=!0,H.receiveShadow=!0,c.add(H),H}function we(c,m,_,b,E,R,U){let W=new Ke(Xe,U);return W.position.set(m,_+R/2,b),W.scale.set(E,R,E),W.castShadow=!0,c.add(W),W}let Je=new Map;function nn(c,m,_="#777865"){let b=Je.get(c);b||(b={p:[],c:[]},Je.set(c,b));let E=Le(_);for(let R=1;R<m.length;R++)b.p.push(...m[R-1],...m[R]),b.c.push(E.r,E.g,E.b,E.r,E.g,E.b)}let me=new Map,gn=c=>{if(typeof c!="string")return Le(c);let m=me.get(c);return m||me.set(c,m=Le(c)),m};class G{constructor(){this.p=[],this.c=[],this.uv=[],this.ids=[]}tri(m,_,b,E="#ffffff",R=null,U=-1){this.p.push(m[0],m[1],m[2],_[0],_[1],_[2],b[0],b[1],b[2]);let W=gn(E),H=W.r,D=W.g,j=W.b;this.c.push(H,D,j,H,D,j,H,D,j),R?this.uv.push(R[0][0],R[0][1],R[1][0],R[1][1],R[2][0],R[2][1]):this.uv.push(m[0]/8,m[2]/8,_[0]/8,_[2]/8,b[0]/8,b[2]/8),this.ids.push(U)}quad(m,_,b,E,R,U=null,W=-1){this.tri(m,_,b,R,U?[U[0],U[1],U[2]]:null,W),this.tri(m,b,E,R,U?[U[0],U[2],U[3]]:null,W)}mesh(m,_){let b=new Ln;b.setAttribute("position",new en(this.p,3)),b.setAttribute("color",new en(this.c,3)),b.setAttribute("uv",new en(this.uv,2)),b.computeVertexNormals();let E=new Ke(b,m);return E.castShadow=!0,E.receiveShadow=!0,E.userData.triangleIds=this.ids,_.add(E),E}}let fe=c=>c*c*(3-2*c),ve=(()=>{let c=Ui(4711),m=256,_=new Float32Array(m*m);for(let E=0;E<_.length;E++)_[E]=c();let b=(E,R)=>{let U=Math.floor(E),W=Math.floor(R),H=E-U,D=R-W,j=fe,Y=(k,Z)=>_[(Z&255)*m+(k&255)];return(Y(U,W)*(1-j(H))+Y(U+1,W)*j(H))*(1-j(D))+(Y(U,W+1)*(1-j(H))+Y(U+1,W+1)*j(H))*j(D)};return(E,R)=>.55*b(E/400+31,R/400+17)+.3*b(E/160+5,R/160+93)+.15*b(E/60+71,R/60+3)})(),et=(c,m,_)=>_<100||_>1310?0:Xn((ve(c,m)-.42)/.2,0,1),dt=ks?1024:2048,jt=document.createElement("canvas");jt.width=jt.height=dt;let Qt=jt.getContext("2d"),te=(c,m)=>[(c+e/2)/e*dt,(m+n/2)/n*dt],ct=document.createElement("canvas");ct.width=ct.height=1024;let V=ct.getContext("2d"),It=(c,m)=>[(c+e/2)/e*1024,(m+n/2)/n*1024];function zt(c,m,_,b=!1){c.beginPath(),m.forEach((E,R)=>{let U=_(...E);R?c.lineTo(...U):c.moveTo(...U)}),b&&c.closePath()}let oe=Qt.createImageData(dt,dt),ce=Ui(23),Ue=new X,Kt=new X(-.72,.53,-.42).normalize();for(let c=0;c<dt;c++)for(let m=0;m<dt;m++){let _=(m/dt-.5)*e,b=(c/dt-.5)*n,E=v(_,b),R=v(_+30,b),U=v(_-30,b),W=v(_,b+30),H=v(_,b-30),D=(R-U)/60,j=(W-H)/60,Y=Xn(-(R+U+W+H-4*E)/900*14,-.22,.22);Ue.set(-D,1,-j).normalize();let k=f(E),Z=1/Math.sqrt(1+(D*D+j*j)/(l*l)),J=Xn((1-Z-.27)*2.8,0,.67)*(k>720?1:.35),at=(ce()-.5)*10,pt=Math.sin(_*.008)*Math.cos(b*.007)*4,Ut=Xn((k-430)/760,0,1),xt=Ut+(Math.floor(Ut*5)+fe(Math.min(1,Math.max(0,(Ut*5%1-.35)/.3)))-Ut*5)/5*.6,Ht=Xn(1-xt*2,0,1),kt=Xn(xt*2-1,0,1),bt=Math.max(0,Ue.dot(Kt)),N=[0,1,2].map(st=>[136,184,96][st]*Ht+[86,146,74][st]*(1-Ht-kt)+[108,146,92][st]*kt+pt),ot=(.55+.55*bt)*(1+Y),mt=(c*dt+m)*4;{let st=et(_,b,k)*(1-J*1.4),ht=.82+.3*ve(_*7.3,b*7.3);if(st>0)for(let ut=0;ut<3;ut++)N[ut]+=([44,104,62][ut]*ht-N[ut])*fe(Math.min(1,st))*.78}for(let st=0;st<3;st++)oe.data[mt+st]=(N[st]*(1-J)+[200,190,164][st]*J)*ot+[6,4,-6][st]*bt+[-6,-2,8][st]*(1-bt)+at;oe.data[mt+3]=255}Qt.putImageData(oe,0,0);for(let c of t.areas)["residential","religious","parking","water","grass","meadow","plaza","site"].includes(c.kind)&&(zt(Qt,c.ring,te,!0),Qt.fillStyle={residential:"#b7b6a0",religious:"#bdb9a6",parking:"#92998f",water:"#4fa6d8",grass:"#849268",meadow:"#899767",plaza:"#b9b4a1",site:"#a9a89c"}[c.kind],Qt.fill(),["residential","religious","parking","water","plaza","site"].includes(c.kind)&&(zt(V,c.ring,It,!0),V.fill()));Qt.lineJoin="round";for(let c of t.buildings)c.style==="rural"||c.style==="tiantai"||(zt(Qt,c.ring,te,!0),Qt.strokeStyle="#a9a797",Qt.lineWidth=Math.max(1.2,7/e*dt),Qt.stroke());for(let c of t.buildings)zt(Qt,c.ring,te,!0),Qt.fillStyle="#bcbcaf",Qt.fill(),zt(V,c.ring,It,!0),V.fill(),V.lineWidth=3,V.stroke();for(let c of t.roads)zt(V,c.pts,It),V.lineWidth=Math.max(2,(c.width+7)/e*1024),V.stroke();for(let c of t.water)zt(Qt,c.pts,te),Qt.strokeStyle="#4a9fd0",Qt.lineWidth=c.kind==="river"?3:1,Qt.stroke(),zt(V,c.pts,It),V.lineWidth=5,V.stroke();let Ne=V.getImageData(0,0,1024,1024).data,He=(c,m)=>{let[_,b]=It(c,m).map(Math.floor);return _<0||b<0||_>=1024||b>=1024||Ne[(b*1024+_)*4+3]>0},Oe=ks?2048:4096,sn=document.createElement("canvas");sn.width=sn.height=Oe;let hn=sn.getContext("2d"),pn=new as(sn);pn.flipY=!1,pn.generateMipmaps=!1,pn.minFilter=pn.magFilter=gs;let Rn=new as(jt);Rn.colorSpace=kn,Rn.anisotropy=p.capabilities.getMaxAnisotropy();let Tn=new vs(e,n,s-1,s-1).rotateX(-Math.PI/2);for(let c=0;c<o.length;c++)Tn.attributes.position.setY(c,o[c]);Tn.computeVertexNormals();let Bn=new Ke(Tn,lt("#ffffff",{map:Rn}));Bn.receiveShadow=!0,At.add(Bn),y&&At.add(Yg(y,Wd,e,n,lt("#ffffff",{map:Rn})));let li={o:new Fn(0,0,1,0),s:new Fn(1,0,1,0)},Hs=y?{o:new Fn(...y.origin,y.fz,-y.fx),s:new Fn(-18,18,-14,14)}:{o:new Fn(0,0,1,0),s:new Fn(1,0,1,0)},ls=(c,m)=>{let _=li.o,b=li.s,E=c-_.x,R=m-_.y,U=E*_.z+R*_.w,W=E*_.w-R*_.z;return U>b.x-3&&U<b.y+3&&W>b.z-3&&W<b.w+3};{let c=document.createElement("canvas");c.width=c.height=256;let m=c.getContext("2d"),_=m.createImageData(256,256),b=Ui(7),E=(D,j)=>{let Y=new Float32Array((D+1)*(D+1)),k=Ui(j);for(let Z=0;Z<Y.length;Z++)Y[Z]=k();return(Z,J)=>{let at=Z*D,pt=J*D,Ut=Math.floor(at),xt=Math.floor(pt),Ht=at-Ut,kt=pt-xt,bt=ot=>ot*ot*(3-2*ot),N=(ot,mt)=>Y[mt%D*(D+1)+ot%D];return(N(Ut,xt)*(1-bt(Ht))+N(Ut+1,xt)*bt(Ht))*(1-bt(kt))+(N(Ut,xt+1)*(1-bt(Ht))+N(Ut+1,xt+1)*bt(Ht))*bt(kt)}},R=E(64,11),U=E(16,12),W=E(8,13);for(let D=0;D<256;D++)for(let j=0;j<256;j++){let Y=j/256,k=D/256,Z=(D*256+j)*4,J=.55*R(Y,k)+.45*b();_.data[Z]=J*255,_.data[Z+1]=(.6*U(Y,k)+.4*W(Y,k))*255,_.data[Z+2]=128,_.data[Z+3]=255}m.putImageData(_,0,0);let H=new as(c);H.wrapS=H.wrapT=so,H.anisotropy=8,Bn.material.onBeforeCompile=D=>{D.uniforms.detailMap={value:H},D.uniforms.roadMask={value:pn},D.uniforms.terrainWD={value:new de(e,n)},D.uniforms.cutO={value:li.o},D.uniforms.cutS={value:li.s},D.uniforms.checkpointO={value:Hs.o},D.uniforms.checkpointS={value:Hs.s},D.vertexShader=D.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;`).replace("#include <project_vertex>",`#include <project_vertex>
vDetailPos=(modelMatrix*vec4(transformed,1.0)).xyz;`),D.fragmentShader=D.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;uniform sampler2D detailMap;uniform vec4 cutO;uniform vec4 cutS;uniform sampler2D roadMask;uniform vec2 terrainWD;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
if(texture2D(roadMask,vDetailPos.xz/terrainWD+.5).r>.5)discard;
{vec2 dq=vDetailPos.xz-cutO.xy;float cu=dot(dq,cutO.zw),cv=dot(dq,vec2(cutO.w,-cutO.z));if(cu>cutS.x&&cu<cutS.y&&cv>cutS.z&&cv<cutS.w)discard;}`).replace("#include <map_fragment>",`#include <map_fragment>
{float near=smoothstep(1600.0,150.0,length(vDetailPos-cameraPosition));float fine=texture2D(detailMap,vDetailPos.xz/7.0).r;float mid=texture2D(detailMap,vDetailPos.xz/61.0).g;diffuseColor.rgb*=mix(1.0,0.74+0.38*fine+0.22*(mid-0.5),near);}`);let j=D.fragmentShader;D.fragmentShader=j.replace("uniform vec4 cutS;","uniform vec4 cutS;uniform vec4 checkpointO;uniform vec4 checkpointS;").replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
{vec2 dq=vDetailPos.xz-checkpointO.xy;float cu=dot(dq,checkpointO.zw),cv=dot(dq,vec2(-checkpointO.w,checkpointO.z));if(cu>checkpointS.x&&cu<checkpointS.y&&cv>checkpointS.z&&cv<checkpointS.w)discard;}`)},Bn.material.needsUpdate=!0}let In=new G,xn=[];for(let c=0;c<s;c++)xn.push([c,0]);for(let c=1;c<s;c++)xn.push([s-1,c]);for(let c=s-2;c>=0;c--)xn.push([c,s-1]);for(let c=s-2;c>=0;c--)xn.push([0,c]);for(let c=1;c<xn.length;c++){let[m,_]=xn[c-1],[b,E]=xn[c],R=-e/2+m*e/(s-1),U=-n/2+_*n/(s-1),W=-e/2+b*e/(s-1),H=-n/2+E*n/(s-1);In.quad([R,o[_*s+m],U],[W,o[E*s+b],H],[W,u-90,H],[R,u-90,U],"#8f8974")}{let c=In.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),At),m=c.geometry.attributes.position,_=c.geometry.attributes.color,b=Le("#6c6f5c"),E=Le("#f3d6b2"),R=new fn;for(let U=0;U<m.count;U++)R.copy(b).lerp(E,m.getY(U)<u-80?1:0),_.setXYZ(U,R.r,R.g,R.b);c.castShadow=c.receiveShadow=!1}Gt("#load-text").textContent="\u6309\u771F\u5B9E\u8F6E\u5ED3\u91CD\u5EFA\u5C4B\u9876\u3001\u7A97\u6237\u548C\u6CBF\u8857\u7ACB\u9762",await new Promise(requestAnimationFrame);function Vs(c){let m=document.createElement("canvas");m.width=m.height=256;let _=m.getContext("2d");_.fillStyle=c==="roof"?"#e4e2da":"#e6e3d9",_.fillRect(0,0,256,256);let b=Ui(c==="roof"?44:98);for(let R=0;R<3500;R++)_.fillStyle=`rgba(${b()>.5?"255,255,255":"50,55,44"},${b()*.07})`,_.fillRect(b()*256,b()*256,1+b()*3,1+b()*2);if(c==="roof"){for(let R=0;R<256;R+=12)_.fillStyle="#e3dfd540",_.fillRect(R,0,3,256),_.fillStyle="#222c2c2c",_.fillRect(R+8,0,2,256);for(let R=0;R<256;R+=20)_.fillStyle="#23333122",_.fillRect(0,R,256,1)}let E=new as(m);return E.wrapS=E.wrapT=so,E.colorSpace=kn,E.anisotropy=8,E}let z={"#6A6F72":"#7b8da2","#8A4B35":"#a9483a","#B4623F":"#c9603d","#D9A93A":"#f6c02c","#7A2E26":"#b63a2a","#8C6A3E":"#b98a45","#3D4141":"#6f7f92","#C0582E":"#dc6435"},gt={"#F0EEE8":"#fbf4e6","#D8D6CF":"#e6dece","#EAEAE6":"#f5efe2","#D8A035":"#f2b33a","#E4D9C4":"#f3e3c0"},Pt=Vs("roof"),Ft=Vs("wall"),Lt=new G,Ie=new G,$e=new G,Qe=new G,on=new G,dn=new G,un=[],an=[],Vn=[],Si=[],ci="overture-6eed6b02-0a6b-40b7-9326-5247a9383063",cs=new Set([609757872,609561169,t.buildings.find(c=>c.id===ci)?.osmId,609909704,609909706]);for(let c of t.areas)for(let m of c.frame?.replaces||[])cs.add(t.buildings.find(_=>_.id===m)?.osmId);let si=["#D9A93A","#7A2E26","#C0582E"],_n=t.buildings.filter(c=>c.style==="temple"&&c.area>=240&&(si.includes(c.roofColor)||c.osmId===609990009));for(let c of _n)cs.add(c.osmId);let ir=lm,qn=new Set(Object.values(ir));for(let c of qn)cs.add(c);let Ji=256,sr=48,rr=8,Ho=ks?24:44,Ei=[],hs=document.createElement("canvas");hs.width=Ji*rr,hs.height=sr*Ho;let us=hs.getContext("2d");function fs(c){let m=Ei.length;if(m>=rr*Ho)return null;Ei.push(c);let _=m%rr*Ji,b=Math.floor(m/rr)*sr;us.fillStyle="#1c1a17",us.fillRect(_,b,Ji,sr),us.strokeStyle="#8b6d30",us.lineWidth=3,us.strokeRect(_+4,b+4,Ji-8,sr-8),us.fillStyle="#dcb95c";let E=Math.min(32,Math.floor((Ji-26)/Math.max(2,[...c].length)));us.font=`600 ${E}px "Songti SC","STSong","Noto Serif SC","PingFang SC",serif`,us.textAlign="center",us.textBaseline="middle",us.fillText(c,_+Ji/2,b+sr/2+1);let R=hs.width,U=hs.height;return[[_/R,1-(b+sr)/U],[(_+Ji)/R,1-(b+sr)/U],[(_+Ji)/R,1-b/U],[_/R,1-b/U]]}let za=c=>[...c.replace(/^(九华山上?|池州|花筑·?)/,"").replace(/[（(].*$/,"").replace(/(精品|主题)?(民宿|客栈|山庄|宾馆|酒店)$/,_=>_.length>2?_.slice(-2):_).trim()].slice(0,9).join(""),Fr=[],Vo=[],ka=(c,m)=>{let _=new fn(c);return _.offsetHSL(0,0,m),"#"+_.getHexString()};for(let c=0;c<t.buildings.length;c++){let he=function(se){let ee=-(se[0]-bt)*kt+(se[1]-N)*Ht;return b+mt*Xn(1-Math.abs(ee)/ot,0,1)},m=t.buildings[c];if(cs.has(m.osmId))continue;let _=m.ring,b=m.base+m.wallHeight,E=Ui(m.osmId),R=E(),U=m.style==="temple",W=gt[m.wallColor]||m.wallColor||(m.precinct==="\u767E\u5C81\u5BAB"?"#e8dfc2":m.kind==="temple"?m.roofColor==="gold"?"#cdb787":"#e6dbc1":"#ebe6d9"),H=z[m.roofColor]||(m.roofColor?.startsWith("#")?m.roofColor:m.roofColor==="gold"?"#c1a14e":"#5b6062"),D=ka(H,(R-.5)*.06),j=m.levels||2,Y=(m.wallHeight-.35)/j,k=!!m.lattice,Z=(m.eave??.5)*1.6,J=k?"#2f2721":"#56676a",at=k?"#3a3029":"#687675",pt=0;_.forEach((se,ee)=>{let ge=_[(ee+1)%_.length];pt+=se[0]*ge[1]-ge[0]*se[1]});let Ut=!0,xt=new Set(m.partyEdges||[]);for(let se=0;se<_.length;se++){let Jn=function(wn,Yn,Cn,jn,zn,Ko,Qo=.035,nl=null,hc=!1){let Bi=ee[0]+Xt*Yn+Nt*Qo,Ls=ee[1]+Pe*Yn+xe*Qo,Ci=jn/2,Sr=hc?ln:Xt,gi=hc?rn:Pe;wn.quad([Bi-Sr*Ci,Cn,Ls-gi*Ci],[Bi+Sr*Ci,Cn,Ls+gi*Ci],[Bi+Sr*Ci,Cn+zn,Ls+gi*Ci],[Bi-Sr*Ci,Cn+zn,Ls-gi*Ci],Ko,nl)},ee=_[se],ge=_[(se+1)%_.length],q=Math.hypot(ge[0]-ee[0],ge[1]-ee[1]);if(q<.1)continue;let St=Math.min(m.base,v(...ee)-.12),wt=Math.min(m.base,v(...ge)-.12),Ot=U?m.base+.5:Math.min(m.base+.5,St+1.2),Q=U?m.base+.5:Math.min(m.base+.5,wt+1.2);if(Lt.quad([ee[0],Ot,ee[1]],[ge[0],Q,ge[1]],[ge[0],b,ge[1]],[ee[0],b,ee[1]],W,[[0,Ot/8],[q/8,Q/8],[q/8,b/8],[0,b/8]],c),(Ot-St>.25||Q-wt>.25)&&$e.quad([ee[0],St,ee[1]],[ge[0],wt,ge[1]],[ge[0],Q,ge[1]],[ee[0],Ot,ee[1]],"#9c9a93",null,c),xt.has(se))continue;let Nt=(pt>0?1:-1)*(ge[1]-ee[1])/q,xe=(pt>0?-1:1)*(ge[0]-ee[0])/q,Xt=(ge[0]-ee[0])/q,Pe=(ge[1]-ee[1])/q,ln=xe,rn=-Nt,Ws=se===m.front&&m.frontDist!=null&&m.frontDist<14,Fi=m.shopfront&&Ws&&q>2.4;if(q>2.4){let wn=Math.max(1,Math.floor(q/(U?3.1:3.3))),Yn=U?0:-Math.floor((m.base+.35-Math.min(Ot,Q))/Y);for(let Cn=Yn;Cn<j;Cn++)if(!(Cn===0&&Fi))for(let jn=0;jn<wn;jn++){if(se!==m.front||Cn!==j-1||jn%2)continue;let zn=(jn+.5)*q/wn,Ko=m.base+.35+Cn*Y+(Cn===0?.95:.8),Qo=Math.min(1.75,Y*.54),nl=U?1.3:k?1.1:1.4;Cn<0&&Ko<Ot+(Q-Ot)*zn/q+.35||Jn(Qe,zn,Ko,nl,Qo,(jn+Cn)%3?J:at,.055)}if(se===m.front&&!Fi&&!U&&q>3&&(Jn(Qe,q/2,m.base+.33,1.3,2.35,"#3a342d",.07),m.lanterns))for(let Cn of[-1.15,1.15])Fr.push([ee[0]+Xt*(q/2+Cn)+Nt*.45,m.base+2.45,ee[1]+Pe*(q/2+Cn)+xe*.45])}if(Fi){let wn=Math.max(1,Math.floor(q/3.2)),Yn=q/wn;for(let Cn=0;Cn<wn;Cn++){let jn=(Cn+.5)*Yn;Jn(Qe,jn,m.base+.42,Yn-.42,2.3,Cn%2?"#2b2622":"#322b25",.06),m.lanterns&&Cn<4&&Fr.push([ee[0]+Xt*(jn-Yn/2+.3)+Nt*.62,m.base+2.55,ee[1]+Pe*(jn-Yn/2+.3)+xe*.62])}Jn(on,q/2,m.base+2.78,q-.1,.42,m.style==="oldStreet"?"#7b2d22":"#6d5a45",.07)}if(!Ut&&Ws&&q>2.2){let wn=Fi&&m.businesses.find(jn=>jn.category!=="hotel")||m.businesses[0],Yn=za(wn.short||wn.n),Cn=Yn?fs(Yn):null;if(Cn){let jn=Math.min(q*.82,.62*[...Yn].length+1.1),zn=Fi?m.base+3.28:m.base+Math.min(m.wallHeight-1.1,3.25);Jn(dn,q/2,zn,jn,Math.min(.95,jn*.19),"#ffffff",.14,Cn,!0),Ut=!0}}}let[Ht,kt]=m.axis,[bt,N]=m.rectCenter,ot=Math.max(.8,m.depth/2),mt=m.roofRise;if([541482372,538484526,538484527,538484528,609990014,609990009].includes(m.osmId))continue;let ht=(se,ee)=>[se/6,ee/6],ut=m.area/Math.max(1,m.width*m.depth),it=m.partyGable?.12:Z,Tt=m.partyEave?Math.min(Z,.15):Z;if(m.hip&&ut>.82){let se=m.width/2+it,ee=m.depth/2+Tt,ge=b-mt*Tt/ot,q=Math.max(0,m.width/2-m.depth/2),St=(Pe,ln,rn)=>[bt+Ht*Pe-kt*ln,rn,N+kt*Pe+Ht*ln],wt=St(-se,-ee,ge),Ot=St(se,-ee,ge),Q=St(se,ee,ge),Nt=St(-se,ee,ge),xe=St(-q,0,b+mt),Xt=St(q,0,b+mt);Ie.quad(wt,Ot,Xt,xe,D,[ht(-se,-ee),ht(se,-ee),ht(q,0),ht(-q,0)],c),Ie.quad(Q,Nt,xe,Xt,D,[ht(se,ee),ht(-se,ee),ht(-q,0),ht(q,0)],c),Ie.tri(Ot,Q,Xt,ka(H,-.03),[ht(se,-ee),ht(se,ee),ht(q,0)],c),Ie.tri(Nt,wt,xe,ka(H,-.03),[ht(-se,ee),ht(-se,-ee),ht(-q,0)],c);for(let[Pe,ln]of[[wt,Ot],[Ot,Q],[Q,Nt],[Nt,wt],[xe,Xt],[wt,xe],[Ot,Xt],[Q,Xt],[Nt,xe]])un.push(...Pe,...ln);continue}let Ce=m.horseHead?1:1+2*it/Math.max(2,m.width),Dt=1+2*Tt/Math.max(2,m.depth),ae=se=>{let ee=(se[0]-bt)*Ht+(se[1]-N)*kt,ge=-(se[0]-bt)*kt+(se[1]-N)*Ht,q=ee*Ce,St=ge*Dt;return[bt+Ht*q-kt*St,b+mt*(1-Math.abs(St)/ot),N+kt*q+Ht*St,q,St]};for(let se=0;se<_.length;se++){let ee=_[se],ge=_[(se+1)%_.length],q=-(ee[0]-bt)*kt+(ee[1]-N)*Ht,St=-(ge[0]-bt)*kt+(ge[1]-N)*Ht,wt=Math.hypot(ge[0]-ee[0],ge[1]-ee[1]),Ot=q*St<0;if(Ot&&m.horseHead&&wt>4){let Nt=wt>9?5:3,xe=Nt===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let Xt=0;Xt<Nt;Xt++){let Pe=Xt/Nt,ln=(Xt+1)/Nt,rn=[ee[0]+(ge[0]-ee[0])*Pe,ee[1]+(ge[1]-ee[1])*Pe],Jn=[ee[0]+(ge[0]-ee[0])*ln,ee[1]+(ge[1]-ee[1])*ln],Ws=b+(mt+.95)*xe[Xt]+.25,Fi=Math.max(he(rn),he(Jn))+.45,wn=Math.max(Ws,Fi);Lt.quad([rn[0],b,rn[1]],[Jn[0],b,Jn[1]],[Jn[0],wn,Jn[1]],[rn[0],wn,rn[1]],W,null,c);let Yn=-(ge[1]-ee[1])/wt*.3,Cn=(ge[0]-ee[0])/wt*.3;on.quad([rn[0]-Yn,wn-.04,rn[1]-Cn],[Jn[0]-Yn,wn-.04,Jn[1]-Cn],[Jn[0],wn+.2,Jn[1]],[rn[0],wn+.2,rn[1]],"#3e4144"),on.quad([rn[0],wn+.2,rn[1]],[Jn[0],wn+.2,Jn[1]],[Jn[0]+Yn,wn-.04,Jn[1]+Cn],[rn[0]+Yn,wn-.04,rn[1]+Cn],"#3e4144")}continue}let Q=[ee];if(Ot){let Nt=q/(q-St);Q.push([ee[0]+(ge[0]-ee[0])*Nt,ee[1]+(ge[1]-ee[1])*Nt])}Q.push(ge);for(let Nt=1;Nt<Q.length;Nt++){let xe=Q[Nt-1],Xt=Q[Nt];Lt.quad([xe[0],b,xe[1]],[Xt[0],b,Xt[1]],[Xt[0],he(Xt),Xt[1]],[xe[0],he(xe),xe[1]],W,null,c)}}for(let se of m.roofTriangles){let ee=se.map(ae);Ie.tri(...ee.map(ge=>ge.slice(0,3)),D,ee.map(ge=>ht(ge[3],ge[4])),c)}for(let se=0;se<_.length;se++){let ee=ae(_[se]),ge=ae(_[(se+1)%_.length]);un.push(ee[0],ee[1]+.06,ee[2],ge[0],ge[1]+.06,ge[2])}}let ax=Lt.mesh(lt("#ffffff",{vertexColors:!0,map:Ft,side:mn}),Yt),lx=Ie.mesh(lt("#ffffff",{vertexColors:!0,map:Pt,side:mn}),Yt);Vn.push($e.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),Yt)),Si.push(Qe.mesh(lt("#ffffff",{vertexColors:!0,roughness:.4,metalness:.05,side:mn}),Yt)),on.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),Yt),Vn.push(ax,lx);let Hl=new as(hs);if(Hl.colorSpace=kn,Hl.anisotropy=8,dn.mesh(Be({map:Hl,roughness:.55,side:mn,emissive:"#ffffff",emissiveMap:Hl,emissiveIntensity:.18}),Yt),Fr.length){let c=Jt=new Ur(ke(Or[di].hiShapes).lantern,Be({color:"#c8261c",emissive:"#8a1208",emissiveIntensity:.55,roughness:.5}),Fr.length),m=new vi;Fr.forEach((_,b)=>{m.position.set(..._),m.scale.set(1,1.25,1),m.updateMatrix(),c.setMatrixAt(b,m.matrix)}),Yt.add(c),Si.push(c)}if(Vo.length){let c=new Ur(new Ri(.8,.55,.3),lt("#d8d8d2",{roughness:.6}),Vo.length),m=new vi;Vo.forEach((_,b)=>{m.position.set(_[0],_[1],_[2]),m.rotation.set(0,_[3],0),m.updateMatrix(),c.setMatrixAt(b,m.matrix)}),Yt.add(c)}let Gd=new Ln;Gd.setAttribute("position",new en(un,3)),Yt.add(new Rl(Gd,new La({color:"#2b2420",transparent:!0,opacity:.9})));function or(c,m,_,b,E,R,U,W=ye,{hip:H=!1,upturn:D=!1}={}){let j=new G,Y=E/2,k=R/2,Z=H?Math.max(1,Y-k*.8):Y,J=[m-Y,_+(D?.6:0),b-k],at=[m+Y,_+(D?.6:0),b-k],pt=[m+Y,_+(D?.6:0),b+k],Ut=[m-Y,_+(D?.6:0),b+k],xt=[m-Z,_+U,b],Ht=[m+Z,_+U,b];j.quad(J,at,Ht,xt,"#ffffff"),j.quad(Ut,xt,Ht,pt,"#ffffff"),j.tri(J,xt,Ut,"#ffffff"),j.tri(at,pt,Ht,"#ffffff");let kt=W.clone();if(kt.map=Pt,kt.side=mn,j.mesh(kt,c),nn(c,[xt,Ht],W===I?"#ba9144":"#5b6459"),D)for(let[bt,N,ot,mt]of[[m-Y,b-k,-1,-1],[m+Y,b-k,1,-1],[m-Y,b+k,-1,1],[m+Y,b+k,1,1]])nn(c,[[bt-ot*3,_+.03,N-mt*1.8],[bt,_+.6,N],[bt+ot*.65,_+1.05,N+mt*.5]],"#71694c")}function ar(c,m,_){let b=new Pn;return b.position.set(c,v(c,m),m),b.userData.landmark=_,b.userData.placeId=ll(_),Yt.add(b),an.push(b),b}function Ha(c,m,_,b){let E=Math.atan2(_,b),R=Math.cos(E),U=Math.sin(E);return{rot:E,wp:(W,H)=>[c+W*R+H*U,m-W*U+H*R]}}function bn(c,m,_,b,E,R,U,W){let H=(k,Z,J)=>[[0,0],[k/8,0],[k/8,J/8],[0,J/8]],D=E-b,j=_-m,Y=U-R;c.quad([m,b,U],[_,b,U],[_,E,U],[m,E,U],W,H(j,0,D)),c.quad([_,b,R],[m,b,R],[m,E,R],[_,E,R],W,H(j,0,D)),c.quad([_,b,U],[_,b,R],[_,E,R],[_,E,U],W,H(Y,0,D)),c.quad([m,b,R],[m,b,U],[m,E,U],[m,E,R],W,H(Y,0,D)),c.quad([m,E,U],[_,E,U],[_,E,R],[m,E,R],W,[[m/8,U/8],[_/8,U/8],[_/8,R/8],[m/8,R/8]])}let Mr=new Map;{let c=t.buildings.find(m=>m.name==="\u5316\u57CE\u5BFA");if(c){let[m,_]=c.rectCenter,{rot:b,wp:E}=Ha(m,_,-c.axis[0],-c.axis[1]),R=c.depth/2,U=c.width/2,W=c.width/58.75,H=ar(m,_,"\u5316\u57CE\u5BFA");H.rotation.y=b;let D=H.position.y,j=gt[c.wallColor]||c.wallColor||"#fbf4e6",Y=z[c.roofColor]||c.roofColor||"#7b8da2",k="#3e4144",Z="#4a4f50",J=new G,at=new G,pt=new G,Ut=(mt,st,ht)=>{let ut=ht===Math.max?-1e9:1e9;for(let it=0;it<=4;it++)for(let Tt=-2;Tt<=2;Tt++)ut=ht(ut,v(...E(Tt*R/2,mt+(st-mt)*it/4)));return ut-D},xt=[{name:"\u7075\u5B98\u6BBF",hall:8,court:3.75,doc:3.7,h:6,rise:2.4,wing:2.6},{name:"\u5929\u738B\u6BBF",hall:9.5,court:4.5,doc:5.2,h:6.4,rise:2.85,wing:2.6},{name:"\u5927\u96C4\u5B9D\u6BBF",hall:11.5,court:7.5,doc:6.4,h:8,rise:3.45,wing:3},{name:"\u85CF\u7ECF\u697C",hall:14,court:0,doc:9.1,h:10.5,rise:4.2}],Ht=v(...E(0,U+6))-D,kt=U,bt=-1e9;for(let mt of xt){mt.front=kt,mt.hallBack=kt-mt.hall*W,mt.back=mt.hallBack-mt.court*W,kt=mt.back,mt.y=Math.max(Ht+mt.doc,Ut(mt.back,mt.front,Math.max)+.3,bt),bt=mt.y;let st=Ut(mt.back,mt.front,Math.min)-1.2;bn(pt,-R,R,st,mt.y,mt.back,mt.front,"#b9b7a4")}let N=.8;for(let[mt,st]of xt.entries()){let ht=st.hallBack,ut=st.front,it=(ht+ut)/2,Tt=(ut-ht)/2,Ce=st.y+st.h,Dt=Ce+st.rise,ae=Ce-st.rise*N/Tt,he=Math.hypot(Tt+N,Dt-ae);bn(J,-R,R,st.y,Ce,ht,ut,j);for(let q of[-1,1])J.tri([q*R,Ce,ht],[q*R,Ce,ut],[q*R,Dt,it],j,[[0,0],[Tt/4,0],[Tt/8,st.rise/8]]);at.quad([-R,ae,ut+N],[R,ae,ut+N],[R,Dt,it],[-R,Dt,it],Y,[[-R/6,0],[R/6,0],[R/6,he/6],[-R/6,he/6]]),at.quad([R,ae,ht-N],[-R,ae,ht-N],[-R,Dt,it],[R,Dt,it],Y,[[R/6,0],[-R/6,0],[-R/6,he/6],[R/6,he/6]]),bn(pt,-R,R,Dt-.12,Dt+.32,it-.22,it+.22,Z);let se=st.hall>9?5:3,ee=se===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let q of[-1,1])for(let St=0;St<se;St++){let wt=ht+(ut-ht)*St/se,Ot=ht+(ut-ht)*(St+1)/se,Q=Ce+(st.rise+.95)*ee[St]+.3,Nt=q*R-q*.36,xe=q*R+q*.06,Xt=q*R-q*.48,Pe=q*R+q*.18;bn(J,Math.min(Nt,xe),Math.max(Nt,xe),Ce,Q,wt,Ot,j),bn(pt,Math.min(Xt,Pe),Math.max(Xt,Pe),Q,Q+.2,wt-.06,Ot+.06,k)}let ge=ut+.06;if(mt===0){for(let q of[-R*.46,0,R*.46]){let St=q?2.6:3.3,wt=q?3.7:4.5,Ot=new Nr;Ot.moveTo(-St/2,0),Ot.lineTo(St/2,0),Ot.lineTo(St/2,wt-St/2),Ot.absarc(0,wt-St/2,St/2,0,Math.PI,!1),Ot.lineTo(-St/2,0);let Q=new Ke(new Ul(Ot,14),O);Q.position.set(q,st.y+.02,ge),H.add(Q)}bn(pt,-2.2,2.2,st.y+4.9,st.y+5.7,ge,ge+.12,"#2b2622");for(let q of[-R*.7,-R*.23,R*.23,R*.7]){let St=new Ke(new Xi(.42,10,7),yt);St.position.set(q,Ce-.75,ut+.55),St.scale.y=1.22,H.add(St)}}else if(mt===1){bn(pt,-1.8,1.8,st.y,st.y+3.4,ge-.02,ge+.06,"#3a2a1f");for(let q of[-1,1])bn(pt,q*5.2-1.1,q*5.2+1.1,st.y+1.4,st.y+3.2,ge-.02,ge+.05,"#3a3029")}else if(mt===2){for(let St=0;St<=5;St++){let wt=-R+1.2+St*(2*R-2.4)/5;we(H,wt,st.y,ut+.42,.2,st.h-.1,yt)}for(let St=0;St<5;St++){let wt=-R+1.2+(St+.5)*(2*R-2.4)/5,Ot=(2*R-2.4)/5-.5;bn(pt,wt-Ot/2,wt+Ot/2,st.y+.2,st.y+st.h*.72,ge-.02,ge+.05,"#8a3a2a");for(let Q=1;Q<4;Q++)bn(pt,wt-Ot/2,wt+Ot/2,st.y+.2+Q*st.h*.18-.04,st.y+.2+Q*st.h*.18+.04,ge,ge+.08,"#4a2a20")}bn(pt,-2,2,Ce-1.3,Ce-.5,ge+.05,ge+.14,"#2b2622")}else{for(let q of[ut+.05,ht-.05])for(let St=0;St<3;St++)for(let wt=0;wt<5;wt++){let Ot=-R+(wt+.5)*2*R/5,Q=st.y+.9+St*3.3;bn(pt,Ot-.85,Ot+.85,Q,Q+1.7,q-.03,q+.03,"#3a2a1f"),bn(pt,Ot-.04,Ot+.04,Q,Q+1.7,q-.05,q+.05,"#5a4633")}for(let q=1;q<3;q++)bn(pt,-R,R,st.y+q*3.3+.2,st.y+q*3.3+.38,ut,ut+.45,"#5a4633")}if(st.court>0){let q=st.back,St=st.hallBack,wt=st.wing;for(let Xt of[-1,1]){let Pe=Xt*R,ln=Xt*(R-wt),rn=mt===2?3.2:3.6,Jn=st.y+rn+1.1,Ws=st.y+rn-.1;bn(J,Math.min(Pe,ln),Math.max(Pe,ln),st.y,st.y+rn,q+.02,St-.02,j),bn(J,Math.min(Pe,Pe-Xt*.3),Math.max(Pe,Pe-Xt*.3),st.y+rn,Jn,q+.02,St-.02,j),at.quad([Pe,Jn,q],[Pe,Jn,St],[ln-Xt*.6,Ws,St],[ln-Xt*.6,Ws,q],Y,[[q/6,0],[St/6,0],[St/6,(wt+.6)/6],[q/6,(wt+.6)/6]]);let Fi=ln-Xt*.05;if(mt===2)for(let wn=0;wn<4;wn++){let Yn=q+(St-q)*(wn+.5)/4;bn(pt,Math.min(Fi,Fi-Xt*.18),Math.max(Fi,Fi-Xt*.18),st.y+.3,st.y+2.3,Yn-.55,Yn+.55,"#77736a")}else for(let wn=0;wn<2;wn++){let Yn=q+(St-q)*(wn+.5)/2;bn(pt,Math.min(Fi,Fi-Xt*.06),Math.max(Fi,Fi-Xt*.06),st.y+1,st.y+2.6,Yn-.7,Yn+.7,"#3a3029")}}let Ot=xt[mt+1],Q=Ot.y-st.y,Nt=Math.max(1,Math.ceil(Q/.18)),xe=Math.min(.32,(St-q)*.7/Nt);for(let Xt=0;Xt<Nt;Xt++)bn(pt,-3,3,st.y-.05,Ot.y-Xt*Q/Nt,q+Xt*xe,q+(Xt+1)*xe,"#c2bfb0")}}{let mt=xt[0],st=v(...E(0,U+3))-D,ht=mt.y-st;if(ht>.25){let ut=Math.ceil(ht/.17),it=.33;for(let Tt=0;Tt<ut;Tt++)bn(pt,-4.5,4.5,Math.min(st,Ht)-1,mt.y-(Tt+1)*ht/ut,U+Tt*it,U+(Tt+1)*it,"#c2bfb0");for(let Tt of[-1,1])bn(pt,Tt*5.4-.5,Tt*5.4+.5,st,st+.7,U+ut*it-1.1,U+ut*it-.1,"#9f9d92"),bn(pt,Tt*5.4-.35,Tt*5.4+.35,st+.7,st+1.8,U+ut*it-.95,U+ut*it-.25,"#9f9d92")}}J.mesh(lt("#ffffff",{vertexColors:!0,map:Ft,side:mn}),H),at.mesh(lt("#ffffff",{vertexColors:!0,map:Pt,side:mn}),H),pt.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),H),Mr.set("\u5316\u57CE\u5BFA",D+xt[2].y+xt[2].h+xt[2].rise);let ot=t.places.find(mt=>mt.n==="\u5316\u57CE\u5BFA");ot&&(ot.modelNote="\u6A21\u578B\u6309 OpenStreetMap \u5B9E\u6D4B\u5360\u5730\uFF08\u7EA6 59 \xD7 20 \u7C73\uFF0C\u8F74\u7EBF\u671D\u5411\u653E\u751F\u6C60\uFF09\u590D\u539F\u56DB\u8FDB\u9662\u843D\uFF1A\u7075\u5B98\u6BBF\u3001\u5929\u738B\u6BBF\u3001\u5927\u96C4\u5B9D\u6BBF\u3001\u85CF\u7ECF\u697C\uFF0C\u8FDB\u6DF1\u6309\u5B98\u65B9\u89C4\u5212\u6BD4\u4F8B\u7F29\u653E\uFF0C\u53F0\u57FA\u9010\u8FDB\u5347\u9AD8 3.7 / 1.5 / \u7EA6 1.2 / 2.7 \u7C73\uFF1B\u7B2C\u4E09\u3001\u56DB\u8FDB\u4E4B\u95F4\u4E3A\u7891\u5ECA\u9662\u3002\u5355\u4F53\u7ACB\u9762\u4E0E\u7EC6\u90E8\u4E3A\u8FD1\u4F3C\u3002")}}{let c=t.buildings.find(_=>_.id===ci),m=t.places.find(_=>_.n==="\u8089\u8EAB\u5B9D\u6BBF");if(c&&m){let[_,b]=c.rectCenter,{rot:E,wp:R}=Ha(_,b,-c.axis[0],-c.axis[1]),U=c.depth,W=c.width,H=ar(_,b,"\u8089\u8EAB\u5B9D\u6BBF");H.rotation.y=E;let D=H.position.y,j=lt("#55606a",{roughness:.7,metalness:.25}),Y=-1e9,k=1e9;for(let kt=-2;kt<=2;kt++)for(let bt=-2;bt<=2;bt++){let N=v(...R(kt*U/4,bt*W/4));Y=Math.max(Y,N),k=Math.min(k,N)}let Z=Y-D+.9,J=U-3.6,at=W-3.6;qt(H,0,k-D-1,0,U+1.2,Z-(k-D-1),W+1.2,be),qt(H,0,Z,0,J,6.2,at,yt),or(H,0,Z+6.2,0,U+1.2,W+1.2,2.4,j,{hip:!0,upturn:!0}),qt(H,0,Z+6.2,0,J*.72,4.6,at*.72,yt),or(H,0,Z+10.8,0,J*.72+2.6,at*.72+2.6,3.6,j,{hip:!0,upturn:!0});let pt=[...Array(6)].map((kt,bt)=>-(U/2-.45)+bt*(U-.9)/5),Ut=[1,2,3,4].map(kt=>-(W/2-.45)+kt*(W-.9)/5);for(let kt of[-1,1]){for(let bt of pt)we(H,bt,Z,kt*(W/2-.45),.22,6.2,be);for(let bt of Ut)we(H,kt*(U/2-.45),Z,bt,.22,6.2,be)}for(let kt of[-J/3,0,J/3])qt(H,kt,Z+.1,at/2+.02,J/3-.5,4.3,.1,O);qt(H,0,Z+4.8,at/2+.08,2.6,.8,.12,I);let xt=v(...R(0,W/2+2.5))-D,Ht=Z-xt;if(Ht>.2){let kt=Math.ceil(Ht/.17);for(let bt=0;bt<kt;bt++)qt(H,0,xt-.6,W/2+.6+bt*.32+.16,6,Z-(bt+1)*Ht/kt-(xt-.6),.32,be)}Mr.set("\u8089\u8EAB\u5B9D\u6BBF",D+Z+14.4),m.modelNote="\u6309\u5B98\u65B9\u63CF\u8FF0\u590D\u539F\u5317\u5411\u5165\u53E3\u3001\u7EA2\u5899\u3001\u6DF1\u8272\u94C1\u74E6\u91CD\u6A90\u6B47\u5C71\u3001\u7EA6 15 \u7C73\u6BBF\u9AD8\u4E0E 20 \u6839\u5916\u56F4\u77F3\u67F1\uFF1B\u4E3B\u6BBF\u843D\u5728\u5730\u56FE\u70B9\u4F4D\u5904\u7684\u5F71\u50CF\u8BC6\u522B\u8F6E\u5ED3\u4E0A\uFF0C\u4E24\u4FA7\u9EC4\u5899\u914D\u6BBF\u6309\u5404\u81EA\u8F6E\u5ED3\u5EFA\u6A21\u3002\u6BBF\u4F53\u6BD4\u4F8B\u4E0E\u53F0\u9636\u4E3A\u8FD1\u4F3C\u3002"}}function pi(c,m,_,{repeat:b=!1}={}){let E=document.createElement("canvas");E.width=c,E.height=m,_(E.getContext("2d"),c,m);let R=new as(E);return R.colorSpace=kn,R.anisotropy=8,b&&(R.wrapS=R.wrapT=so),R}function Rs(c,m,_,b,E,R,U,{back:W=!1,emissive:H=0}={}){let D=new Ke(new vs(E,R),Be({map:U,roughness:.6,emissive:H?"#ffffff":"#000000",emissiveMap:H?U:null,emissiveIntensity:H}));return D.position.set(m,_+R/2,b),W&&(D.rotation.y=Math.PI),c.add(D),D}let au='"Songti SC","STSong","Noto Serif SC","PingFang SC",serif';function Wd(c,m){let _=Xn((c+e/2)/e*(s-1),0,s-1.001),b=Xn((m+n/2)/n*(s-1),0,s-1.001),E=_|0,R=b|0,U=_-E,W=b-R,H=o[R*s+E],D=o[R*s+E+1],j=o[(R+1)*s+E],Y=o[(R+1)*s+E+1];return U+W<=1?H+U*(D-H)+W*(j-H):Y+(1-U)*(j-Y)+(1-W)*(D-Y)}function mi(c,m){let _=Wd(c,m);return y?y.height(c,m,_):_}function Xd(c,m,_,b,E=3.5,R=[]){let U=Qs.triangulateShape(m.map(D=>new de(D[0],D[1])),R.map(D=>D.map(j=>new de(j[0],j[1])))),W=m.concat(...R),H=(D,j,Y)=>{if(Math.max(Math.hypot(D[0]-j[0],D[1]-j[1]),Math.hypot(j[0]-Y[0],j[1]-Y[1]),Math.hypot(Y[0]-D[0],Y[1]-D[1]))>E){let Z=(Ut,xt)=>[(Ut[0]+xt[0])/2,(Ut[1]+xt[1])/2],J=Z(D,j),at=Z(j,Y),pt=Z(Y,D);H(D,J,pt),H(J,j,at),H(pt,at,Y),H(J,at,pt);return}(j[1]-D[1])*(Y[0]-D[0])-(j[0]-D[0])*(Y[1]-D[1])<0&&([j,Y]=[Y,j]),c.tri([D[0],mi(...D)+_,D[1]],[j[0],mi(...j)+_,j[1]],[Y[0],mi(...Y)+_,Y[1]],b)};for(let[D,j,Y]of U)H(W[D],W[j],W[Y])}function qd(c){let m=0;return c.forEach((_,b)=>{let E=c[(b+1)%c.length];m+=_[0]*E[1]-E[0]*_[1]}),m>0?1:-1}function Yd(c,m,{h:_=.3,w:b=.35,co:E="#a39e91"}={}){let R=qd(m);for(let U=0;U<m.length;U++){let W=m[U],H=m[(U+1)%m.length],D=Math.hypot(H[0]-W[0],H[1]-W[1]);if(D<.05)continue;let j=Math.ceil(D/2.5),Y=-R*(H[1]-W[1])/D*b,k=R*(H[0]-W[0])/D*b;for(let Z=0;Z<j;Z++){let J=[W[0]+(H[0]-W[0])*Z/j,W[1]+(H[1]-W[1])*Z/j],at=[W[0]+(H[0]-W[0])*(Z+1)/j,W[1]+(H[1]-W[1])*(Z+1)/j],pt=mi(...J),Ut=mi(...at),xt=[J[0]+Y,J[1]+k],Ht=[at[0]+Y,at[1]+k],kt=mi(...xt),bt=mi(...Ht);c.quad([J[0],pt-.25,J[1]],[at[0],Ut-.25,at[1]],[at[0],Ut+_,at[1]],[J[0],pt+_,J[1]],E),c.quad([J[0],pt+_,J[1]],[at[0],Ut+_,at[1]],[Ht[0],bt+_,Ht[1]],[xt[0],kt+_,xt[1]],E),c.quad([xt[0],kt+_,xt[1]],[Ht[0],bt+_,Ht[1]],[Ht[0],bt+.08,Ht[1]],[xt[0],kt+.08,xt[1]],E)}}}{let c=t.areas.filter(_=>_.kind==="plaza"),m=t.areas.find(_=>_.id==="r4-plaza-lawn");if(c.length){let _=pi(512,512,(D,j)=>{let Y=Ui(311),k=64;D.fillStyle="#7f7a70",D.fillRect(0,0,j,j);for(let Z=0;Z<16;Z++)for(let J=-1;J<9;J++){let at=Y(),pt=J*k+Z%2*k/2,Ut=Z*k/2,xt=((Math.floor((pt+k/4)/256)+Math.floor(Ut/256))%2+2)%2,Ht=xt?[172,166,153]:[188,182,168];D.fillStyle=`rgb(${Ht[0]+at*18|0},${Ht[1]+at*16|0},${Ht[2]+at*14|0})`,D.fillRect(pt+1.5,Ut+1.5,k-3,k/2-3)}D.fillStyle="#857f73",D.fillRect(0,0,j,32),D.fillRect(0,0,32,j),D.fillStyle="#c9c2b0",D.fillRect(0,32,j,5),D.fillRect(32,0,5,j),D.fillRect(0,0,j,3),D.fillRect(0,0,3,j);for(let Z=0;Z<12e3;Z++)D.fillStyle=`rgba(${Y()<.5?"255,255,255":"40,40,36"},${Y()*.1})`,D.fillRect(Y()*j,Y()*j,1.5,1.5)},{repeat:!0}),b=new G,E=new G,R=(D,j)=>{let Y=!1;for(let k=0,Z=j.length-1;k<j.length;Z=k++){let J=j[k],at=j[Z];J[1]>D[1]!=at[1]>D[1]&&D[0]<(at[0]-J[0])*(D[1]-J[1])/(at[1]-J[1])+J[0]&&(Y=!Y)}return Y};for(let D of c)Xd(b,D.ring,.16,"#ffffff",3.5,m&&m.ring.every(j=>R(j,D.ring))?[m.ring]:[]),Yd(E,D.ring);let U=b.mesh(lt("#ffffff",{map:_,roughness:.93}),At);if(U.castShadow=!1,m){let D=pi(256,256,(N,ot)=>{let mt=Ui(77);N.fillStyle="#6f8b4f",N.fillRect(0,0,ot,ot);for(let st=0;st<6e3;st++)N.fillStyle=`rgba(${mt()<.5?"150,180,100":"50,80,40"},${.25*mt()})`,N.fillRect(mt()*ot,mt()*ot,1,2+mt()*3)},{repeat:!0}),j=new G;Xd(j,m.ring,.24,"#ffffff",1.5);let Y=j.mesh(lt("#ffffff",{map:D,roughness:1}),At);Y.castShadow=!1,Yd(E,m.ring,{h:.4,w:.3,co:"#b3ad9f"});let k=m.ring,Z=[k.reduce((N,ot)=>N+ot[0],0)/k.length,k.reduce((N,ot)=>N+ot[1],0)/k.length],J=[k[1][0]-k[0][0],k[1][1]-k[0][1]],at=[k[2][0]-k[1][0],k[2][1]-k[1][1]],pt=Math.hypot(...J),Ut=Math.hypot(...at),xt=[J[0]/pt,J[1]/pt],Ht=[at[0]/Ut,at[1]/Ut],kt=[];for(let N=0;N<=128;N++){let ot=N/128*Math.PI*2;kt.push([Z[0]+xt[0]*Math.cos(ot)*pt*.36+Ht[0]*Math.sin(ot)*Ut*.4,Z[1]+xt[1]*Math.cos(ot)*pt*.36+Ht[1]*Math.sin(ot)*Ut*.4])}let bt=new G;for(let N=1;N<kt.length;N++){let ot=kt[N-1],mt=kt[N],st=Math.hypot(mt[0]-ot[0],mt[1]-ot[1]),ht=-(mt[1]-ot[1])/st*.8,ut=(mt[0]-ot[0])/st*.8;bt.quad([ot[0]-ht,mi(ot[0]-ht,ot[1]-ut)+.45,ot[1]-ut],[mt[0]-ht,mi(mt[0]-ht,mt[1]-ut)+.45,mt[1]-ut],[mt[0]+ht,mi(mt[0]+ht,mt[1]+ut)+.45,mt[1]+ut],[ot[0]+ht,mi(ot[0]+ht,ot[1]+ut)+.45,ot[1]+ut],"#c9c3b2")}bt.mesh(lt("#ffffff",{vertexColors:!0,roughness:.95,side:mn,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),At)}E.mesh(lt("#ffffff",{vertexColors:!0,roughness:.9,side:mn}),At);let W=[];for(let D of c){let j=qd(D.ring),Y=8;for(let k=0;k<D.ring.length;k++){let Z=D.ring[k],J=D.ring[(k+1)%D.ring.length],at=Math.hypot(J[0]-Z[0],J[1]-Z[1]);if(at<.05)continue;let pt=-j*(J[1]-Z[1])/at,Ut=j*(J[0]-Z[0])/at;for(let xt=Y;xt<at;xt+=16){let Ht=Z[0]+(J[0]-Z[0])*xt/at+pt*1.2,kt=Z[1]+(J[1]-Z[1])*xt/at+Ut*1.2;W.push([Ht,mi(Ht,kt)+.16,kt])}Y=((Y-at)%16+16)%16}}if(W.length){let D=new vi,j=new Ur(new Wi(.07,.11,4.2,6),lt("#34383a",{roughness:.5,metalness:.4}),W.length),Y=new Ur(new Ri(.46,.62,.46),Be({color:"#f3e2b8",emissive:"#ffcf7a",emissiveIntensity:.45,roughness:.5}),W.length),k=new Ur(new ro(.42,.34,4),lt("#2f3333"),W.length);W.forEach((Z,J)=>{D.rotation.set(0,Math.PI/4,0),D.position.set(Z[0],Z[1]+2.1,Z[2]),D.updateMatrix(),j.setMatrixAt(J,D.matrix),D.position.set(Z[0],Z[1]+4.45,Z[2]),D.updateMatrix(),Y.setMatrixAt(J,D.matrix),D.position.set(Z[0],Z[1]+4.93,Z[2]),D.updateMatrix(),k.setMatrixAt(J,D.matrix)});for(let Z of[j,Y,k])Z.castShadow=!0,Rt.add(Z)}let H=t.places.find(D=>D.n==="\u795E\u5149\u5CAD\u5E7F\u573A");H&&(Mr.set(H.n,v(H.x,H.z)+3),H.modelNote="\u5E7F\u573A\u94FA\u88C5\u3001\u8DEF\u7F18\u3001\u706F\u67F1\u4E0E\u897F\u5317\u89D2\u8349\u576A\u6309\u536B\u661F\u5F71\u50CF\u793A\u610F\u590D\u539F\uFF1B\u94FA\u5730\u7EB9\u6837\u4E0E\u706F\u5177\u6837\u5F0F\u4E3A\u793A\u610F\u3002")}}for(let c of t.roads){if(c.model!=="stair")continue;let[m,_]=c.pts,b=Math.hypot(_[0]-m[0],_[1]-m[1]),E=c.width/2,R=.4,U=E-R,{rot:W,wp:H}=Ha(m[0],m[1],(_[0]-m[0])/b,(_[1]-m[1])/b),D=ar(m[0],m[1],"\u4E09\u89D2\u6D32\u8F66\u7AD9");D.rotation.y=W;let j=D.position.y,Y=(ot,mt)=>{let[st,ht]=H(ot,mt);return Math.max(v(st,ht),mi(st,ht))},k=.25,Z=Math.ceil(b/k),J=[];for(let ot=0;ot<=Z;ot++){let mt=-1e9;for(let st=-E;st<=E+.01;st+=E/3)mt=Math.max(mt,Y(st,Math.min(b,ot*k)));J.push(mt+.06)}for(let ot=Z-1;ot>=0;ot--)J[ot]=Math.max(J[ot],J[ot+1]);let at=J[0],pt=J[Z],Ut=Math.max(1,Math.round((at-pt)/.15)),xt=(at-pt)/Ut,Ht=lt("#bdb8aa",{roughness:.85}),kt=lt("#9d998b",{roughness:.9}),bt=lt("#d2cdc0",{roughness:.8});for(let ot=0,mt=0,st=0;ot<Ut&&st<b;ot++){let ht=at-ot*xt;for(;mt<Z&&J[mt]>ht-xt+1e-6;)mt++;let ut=Math.min(b,Math.max(st+.28,mt*k)),it=(st+ut)/2,Tt=1e9;for(let ae of[st,it,ut])for(let he of[-E,0,E])Tt=Math.min(Tt,Y(he,ae));let Ce=Tt-.8-j,Dt=ht-j;qt(D,0,Ce,it,2*U,Dt-Ce,ut-st,Ht);for(let ae of[-1,1])qt(D,ae*(U+R/2),Ce,it,R,Dt+.85-Ce,ut-st,kt),qt(D,ae*(U+R/2),Dt+.85,it,R+.1,.1,ut-st,bt);st=ut}let N=t.places.find(ot=>ot.n==="\u4E09\u89D2\u6D32\u8F66\u7AD9");N&&(N.modelNote="\u8F66\u7AD9\u65C1\u4E0B\u5230\u795E\u5149\u5CAD\u5E7F\u573A\u7684\u53F0\u9636\u6309\u7528\u6237\u8BF4\u660E\u793A\u610F\u590D\u539F\uFF1A\u9AD8\u5DEE\u7EA6 12 \u7C73\uFF08\u5E7F\u573A\u5730\u9762\u5DF2\u6309\u6B64\u4FEE\u6B63\uFF09\uFF1B\u53F0\u9636\u5BBD\u5EA6\u3001\u7EA7\u6570\u548C\u8E0F\u6B65\u5C3A\u5BF8\u4E3A\u4F30\u8BA1\u3002")}{let c=t.buildings.find(_=>_.osmId===609909704),m=t.places.find(_=>_.n==="\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");if(c){let[_,b]=c.rectCenter,E=-c.axis[1],R=c.axis[0];v(_+E*6,b+R*6)>v(_-E*6,b-R*6)&&(E=-E,R=-R);let{rot:U,wp:W}=Ha(_,b,E,R),H=ar(_,b,m?m.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");H.rotation.y=U;let D=H.position.y,j=c.width,Y=c.depth,k=-1e9,Z=1e9;for(let q=-3;q<=3;q++){k=Math.max(k,v(...W(q*j/6,-Y/2)),v(...W(q*j/6,0)));for(let St of[-Y/2,0,Y/2,Y/2+4])Z=Math.min(Z,v(...W(q*j/6,St)))}let J=v(...W(0,Y/2+3))-D,at=Math.max(k-D+.25,J+1.2),pt=Z-D-1.2,Ut=lt("#b3312a",{roughness:.7}),xt=lt("#dcd9cf",{roughness:.6}),Ht=lt("#5d6a74",{roughness:.8}),kt=lt("#2a6184",{roughness:.7}),bt=new Pn;bt.position.y=at,H.add(bt),qt(H,0,pt,(-Y/2+2.8)/2,j-.2,at-pt,2.8+Y/2,be);{let q=at-J,St=Math.max(1,Math.ceil(q/.16)),wt=new G;for(let Ot=0;Ot<St;Ot++){let Q=at-(Ot+1)*q/St,Nt=2.8+Ot*.32;qt(H,0,pt,Nt+.16,17,Q-pt,.32,xt);for(let xe of[-1,1]){let Xt=xe*8.72;wt.quad([Xt-.14*xe,Q,Nt],[Xt-.14*xe,Q,Nt+.32],[Xt-.14*xe,Q+.9,Nt+.32],[Xt-.14*xe,Q+.9,Nt],"#e2dfd6"),wt.quad([Xt+.14*xe,Q,Nt],[Xt+.14*xe,Q,Nt+.32],[Xt+.14*xe,Q+.9,Nt+.32],[Xt+.14*xe,Q+.9,Nt],"#d6d3c9"),wt.quad([Xt-.14,Q+.9,Nt],[Xt+.14,Q+.9,Nt],[Xt+.14,Q+.9,Nt+.32],[Xt-.14,Q+.9,Nt+.32],"#eeebe3"),Ot%3===0&&qt(H,Xt,Q,Nt+.16,.3,1.15,.3,xt)}}wt.mesh(lt("#ffffff",{vertexColors:!0,roughness:.6,side:mn}),H)}let N=10.7,ot=9,mt=new Nr,st=(q,St,wt)=>{mt.lineTo(q-St,0),mt.lineTo(q-St,wt),mt.absarc(q,wt,St,Math.PI,0,!0),mt.lineTo(q+St,0)};mt.moveTo(-N,0),st(-6.8,1.9,3.9),st(0,2.7,5.2),st(6.8,1.9,3.9),mt.lineTo(N,0),mt.lineTo(N,ot),mt.lineTo(-N,ot),mt.lineTo(-N,0);let ht=new Ke(new Dl(mt,{depth:1.5,bevelEnabled:!1,curveSegments:18}),Ut);ht.position.z=-.2,ht.castShadow=ht.receiveShadow=!0,bt.add(ht);for(let[q,St,wt]of[[-6.8,1.9,3.9],[0,2.7,5.2],[6.8,1.9,3.9]]){let Ot=new Nr;Ot.moveTo(q-St-.32,0),Ot.lineTo(q-St-.32,wt),Ot.absarc(q,wt,St+.32,Math.PI,0,!0),Ot.lineTo(q+St+.32,0),Ot.lineTo(q+St,0),Ot.lineTo(q+St,wt),Ot.absarc(q,wt,St,0,Math.PI,!1),Ot.lineTo(q-St,0),Ot.lineTo(q-St-.32,0);let Q=new Ke(new Dl(Ot,{depth:.06,bevelEnabled:!1,curveSegments:18}),lt("#e4ddca",{roughness:.6}));Q.position.z=1.3,bt.add(Q)}for(let q of[-9.7,-3.8,3.8,9.7])qt(bt,q,0,.55,q*q>40?2.3:2.5,.7,1.8,xt);let ut=q=>pi(128,700,(St,wt,Ot)=>{St.fillStyle="#a52a22",St.fillRect(0,0,wt,Ot),St.strokeStyle="#d9b04a",St.lineWidth=5,St.strokeRect(8,8,wt-16,Ot-16),St.fillStyle="#f0c85a",St.font=`700 70px ${au}`,St.textAlign="center",St.textBaseline="middle",[...q].forEach((Q,Nt)=>St.fillText(Q,wt/2,50+Nt*(Ot-100)/(q.length-1)))});Rs(bt,-3.8,2.95,1.33,1.05,5.85,ut("\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B")),Rs(bt,3.8,2.95,1.33,1.05,5.85,ut("\u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0"));let it=pi(2048,160,(q,St,wt)=>{q.fillStyle="#1f4f78",q.fillRect(0,0,St,wt),q.fillStyle="#2f8466",q.fillRect(0,0,St,26),q.fillRect(0,wt-26,St,26),q.fillStyle="#d8ad45",q.fillRect(0,26,St,5),q.fillRect(0,wt-31,St,5);let Ot=Ui(5);for(let Q=40;Q<St;Q+=170){q.strokeStyle="#e8e4d6",q.lineWidth=4,q.beginPath(),q.arc(Q,wt/2,34,0,Math.PI*2),q.stroke(),q.fillStyle="#3a7fb0",q.beginPath(),q.arc(Q,wt/2,26,0,Math.PI*2),q.fill(),q.fillStyle="#d8ad45",q.beginPath(),q.arc(Q,wt/2,9,0,Math.PI*2),q.fill(),q.strokeStyle="#d8ad45",q.lineWidth=5,q.beginPath(),q.moveTo(Q+48,wt/2);for(let Nt=0;Nt<6;Nt++)q.quadraticCurveTo(Q+58+Nt*14,wt/2+(Nt%2?-22:22)*(.6+Ot()*.4),Q+66+Nt*14,wt/2);q.stroke()}for(let Q=0;Q<St;Q+=18)q.fillStyle=Q%36?"#f4f1e6":"#c44b3a",q.fillRect(Q,8,10,10),q.fillRect(Q,wt-18,10,10)});qt(bt,0,ot,.55,2*N+.5,1.75,1.75,kt),Rs(bt,0,ot,1.43,2*N+.5,1.75,it),Rs(bt,0,ot,-.33,2*N+.5,1.75,it,{back:!0});let Tt=pi(840,250,(q,St,wt)=>{q.fillStyle="#b8862f",q.fillRect(0,0,St,wt),q.fillStyle="#e3bf62",q.fillRect(10,10,St-20,wt-20),q.fillStyle="#161412",q.fillRect(34,34,St-68,wt-68),q.fillStyle="#e6c25e",q.font=`700 132px ${au}`,q.textAlign="center",q.textBaseline="middle",["\u76E1","\u7121","\u9858","\u884C"].forEach((Ot,Q)=>q.fillText(Ot,St*(.2+.2*Q),wt/2+4))});Rs(bt,0,ot+.15,1.5,4.2,1.25,Tt,{emissive:.12});let Ce=pi(512,160,(q,St,wt)=>{q.fillStyle="#2c6a52",q.fillRect(0,0,St,wt);for(let Ot=0;Ot<St;Ot+=64)q.fillStyle="#1f4f78",q.fillRect(Ot+6,20,52,70),q.fillStyle="#d8ad45",q.fillRect(Ot+26,10,12,90),q.fillStyle="#8a2f25",q.fillRect(Ot+4,100,56,40);q.fillStyle="#d8ad45",q.fillRect(0,0,St,6),q.fillRect(0,wt-6,St,6)});qt(bt,0,ot+1.75,.55,6.8,2.55,1.3,kt),Rs(bt,0,ot+1.75,1.21,6.8,2.55,Ce),Rs(bt,0,ot+1.75,-.11,6.8,2.55,Ce,{back:!0});let Dt=pi(180,320,(q,St,wt)=>{q.fillStyle="#c79a3c",q.fillRect(0,0,St,wt),q.fillStyle="#1a1715",q.fillRect(22,34,St-44,wt-68),q.fillStyle="#e6c25e",q.font=`700 92px ${au}`,q.textAlign="center",q.textBaseline="middle",q.fillText("\u5C71",St/2,wt*.33),q.fillText("\u9580",St/2,wt*.68)});Rs(bt,0,ot+1.95,1.25,.8,1.45,Dt,{emissive:.12});for(let q of[-1,1])qt(bt,q*6.8,ot+1.75,.55,4.8,1.05,1.1,kt),Rs(bt,q*6.8,ot+1.75,1.11,4.8,1.05,Ce);or(bt,0,ot+4.3,.55,9.4,4.8,2.3,Ht,{hip:!0,upturn:!0});for(let q of[-1,1])or(bt,q*6.8,ot+2.8,.55,6.4,4.2,1.8,Ht,{hip:!0,upturn:!0}),or(bt,q*10.4,ot+1.7,.55,3.6,3.8,1.5,Ht,{hip:!0,upturn:!0});{let q=ot+4.3+2.3,St=lt("#3d4a44",{roughness:.6,metalness:.2}),wt=new Ke(new Xi(.26,12,10),I);wt.position.set(0,q+.55,.55),bt.add(wt),we(bt,0,q,.55,.08,.35,I);for(let Ot of[-1,1]){let Q=[];for(let Pe=0;Pe<=12;Pe++){let ln=Pe/12;Q.push(new X(Ot*(.45+ln*2.1),q+.12+Math.sin(ln*Math.PI*2.2)*.22+(1-ln)*.25,.55))}let Nt=new Ke(new Ch(new Po(Q),32,.09,6),St);bt.add(Nt);let xe=new Ke(new Xi(.16,8,6),St);xe.position.copy(Q[0]),xe.position.y+=.12,bt.add(xe);let Xt=qt(bt,Ot*2.78,q-.1,.55,.28,.95,.32,St);Xt.rotation.z=-Ot*.25}}let ae=pi(128,128,(q,St)=>{q.fillStyle="#22201e",q.fillRect(0,0,St,St);for(let wt of[32,96])for(let Ot of[32,96]){let Q=q.createRadialGradient(wt-5,Ot-5,2,wt,Ot,15);Q.addColorStop(0,"#77716a"),Q.addColorStop(1,"#2a2724"),q.fillStyle=Q,q.beginPath(),q.arc(wt,Ot,13,0,Math.PI*2),q.fill()}},{repeat:!0});ae.repeat.set(2,2);let he=new Nr,se=q=>{let St=Math.abs(q);return St<3.9?6.7+.9*(q/3.9)**2:5.3+.9*((St-7.15)/3.25)**2};he.moveTo(-10.4,0),he.lineTo(10.4,0);for(let q=0;q<=80;q++){let St=10.4-q*20.8/80;he.lineTo(St,se(St))}he.lineTo(-10.4,0);let ee=new Ke(new Ul(he,4),Be({map:ae,roughness:.55,metalness:.35,side:mn}));ee.position.z=-1.15,bt.add(ee);for(let q of[-1,1]){let St=new Ke(new Rh(.24,.045,6,16),I);St.position.set(q*.75,3.1,-1.08),bt.add(St)}let ge=lt("#cfcbc0",{roughness:.8});for(let q of[-9.7,-3.8,3.8,9.7]){qt(bt,q,0,2.05,1.15,1.25,1.25,xt);let St=new Pn;St.position.set(q,1.25,2.05),bt.add(St),qt(St,0,0,-.05,.62,.75,.95,ge);let wt=new Ke(new Xi(.4,10,8),ge);wt.position.set(0,1.05,.2),wt.scale.set(1,.95,.85),St.add(wt);let Ot=new Ke(new Xi(.47,10,8),ge);Ot.position.set(0,.95,.05),Ot.scale.set(1.05,1,.7),St.add(Ot);let Q=new Ke(new Xi(.17,8,6),ge);Q.position.set(q<0?.22:-.22,.1,.42),St.add(Q)}for(let q of[-1,1])qt(bt,q*11.75,0,.1,1.7,4.2,.9,lt("#d6a13a")),qt(bt,q*11.75,4.2,.1,2,.32,1.3,Ht);Mr.set(m?m.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8",D+at+17),m&&(m.modelNote="\u95E8\u697C\u6309\u7528\u6237\u63D0\u4F9B\u7684\u5B9E\u666F\u7167\u7247\u590D\u539F\uFF1A\u4E09\u62F1\u7EA2\u8272\u724C\u697C\u3001\u5185\u4FA7\u4E24\u67F1\u91D1\u5B57\u5BF9\u8054\uFF08\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B / \u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0\uFF09\u3001\u5F69\u753B\u989D\u678B\u3001\u4E2D\u533E\u201C\u884C\u9858\u7121\u76E1\u201D\u3001\u4E0A\u90E8\u201C\u5C71\u9580\u201D\u7AD6\u533E\u3001\u4E94\u5EA7\u5C4B\u9876\uFF0C\u62F1\u540E\u4E3A\u9ED1\u8272\u94C1\u9489\u5927\u95E8\uFF0C\u95E8\u524D\u77F3\u72EE\u4E0E\u6C49\u767D\u7389\u680F\u6746\u77F3\u9636\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002")}}{let c=t.buildings.find(b=>b.osmId===609909706),m=t.buildings.find(b=>b.osmId===609909704),_=t.places.find(b=>b.n==="\u8089\u8EAB\u5B9D\u6BBF-\u5730\u85CF\u7985\u5BFA");if(c){let[b,E]=c.rectCenter,R=-c.axis[0],U=-c.axis[1];m&&(m.center[0]-b)*R+(m.center[1]-E)*U<0&&(R=-R,U=-U);let{rot:W,wp:H}=Ha(b,E,R,U),D=Math.cos(W),j=Math.sin(W),Y=([Q,Nt])=>[(Q-b)*D-(Nt-E)*j,(Q-b)*j+(Nt-E)*D],k=c.ring.map(Y),Z=k.map(Q=>Q[0]),J=(Math.max(...Z)-Math.min(...Z))/2,at=(Math.max(...Z)+Math.min(...Z))/2,pt=k.filter(Q=>Math.abs(Q[0]-at)>J*.6),Ut=Math.max(...pt.map(Q=>Q[1])),xt=Math.min(...pt.map(Q=>Q[1])),Ht=Math.min(...k.map(Q=>Q[1])),kt=k.filter(Q=>Q[1]<xt-.5),bt=ar(b,E,_?_.n:"\u5730\u85CF\u7985\u5BFA");bt.rotation.y=W;let N=bt.position.y,ot=lt("#a8302a",{roughness:.7}),mt=lt("#5d6a74",{roughness:.8}),st=lt("#d6a23c"),ht=lt("#4a2a22"),ut=[],it=1e9;for(let Q=0;Q<=6;Q++)for(let Nt=0;Nt<=6;Nt++){let xe=v(...H(at-J+Q*J/3,xt+(Ut-xt)*Nt/6));ut.push(xe),it=Math.min(it,xe)}ut.sort((Q,Nt)=>Q-Nt);let Tt=ut[Math.floor(ut.length*.7)]-N+.5,Ce=it-N-1.2,Dt=2*J,ae=Ut-xt,he=(Ut+xt)/2;qt(bt,at,Ce,he,Dt+1.6,Tt-Ce,ae+1.6,be);{let Q=v(...H(at,Ut+4))-N,Nt=Tt-Q;if(Nt>.2){let xe=Math.ceil(Nt/.16);for(let Xt=0;Xt<xe;Xt++)qt(bt,at,Ce,Ut+.8+Xt*.3+.15,10,Tt-(Xt+1)*Nt/xe-Ce,.3,be);for(let Xt of[-1,1])qt(bt,at+Xt*5.3,Ce,Ut+.8+xe*.15,.5,Tt+.9-Ce,xe*.3,be)}}let se=6.8;qt(bt,at,Tt,he,Dt-4.4,se,ae-4.4,st);let ee=pi(256,256,(Q,Nt)=>{Q.fillStyle="#6b2a20",Q.fillRect(0,0,Nt,Nt),Q.strokeStyle="#3a1a14",Q.lineWidth=3;for(let xe=8;xe<Nt;xe+=16)Q.beginPath(),Q.moveTo(xe,0),Q.lineTo(xe,Nt*.7),Q.stroke(),Q.beginPath(),Q.moveTo(0,xe*.7),Q.lineTo(Nt,xe*.7),Q.stroke();Q.fillStyle="#5a221a",Q.fillRect(0,Nt*.72,Nt,Nt*.28),Q.strokeStyle="#c9a24a",Q.lineWidth=4,Q.strokeRect(4,4,Nt-8,Nt-8)}),ge=7;for(let Q=0;Q<ge;Q++){let Nt=at-(Dt-4.4)/2+(Q+.5)*(Dt-4.4)/ge;Rs(bt,Nt,Tt+.15,Ut-2.2+.03,(Dt-4.4)/ge-.35,se*.75,ee)}for(let Q=0;Q<=8;Q++){let Nt=at-Dt/2+.6+Q*(Dt-1.2)/8;we(bt,Nt,Tt,Ut-.6,.3,se,ot),we(bt,Nt,Tt,xt+.6,.3,se,ot)}for(let Q=1;Q<7;Q++){let Nt=xt+.6+Q*(ae-1.2)/7;we(bt,at-Dt/2+.6,Tt,Nt,.3,se,ot),we(bt,at+Dt/2-.6,Tt,Nt,.3,se,ot)}qt(bt,at,Tt+se-.9,Ut-.6,Dt-.6,.9,.5,ot),or(bt,at,Tt+se,he,Dt+2.4,ae+2.4,3.1,mt,{hip:!0,upturn:!0});let q=Dt*.6,St=ae*.55,wt=5.4;qt(bt,at,Tt+se,he,q,wt,St,ht);for(let Q=0;Q<=6;Q++)we(bt,at-q/2+.3+Q*(q-.6)/6,Tt+se+2.2,he+St/2+.25,.24,wt-2.2,ot);for(let Q=0;Q<6;Q++){let Nt=at-q/2+.3+(Q+.5)*(q-.6)/6;Rs(bt,Nt,Tt+se+2.6,he+St/2+.02,(q-.6)/6-.4,2.2,ee)}let Ot=pi(420,140,(Q,Nt,xe)=>{Q.fillStyle="#c79a3c",Q.fillRect(0,0,Nt,xe),Q.fillStyle="#1a1715",Q.fillRect(16,16,Nt-32,xe-32),Q.strokeStyle="#e6c25e",Q.lineWidth=3,Q.strokeRect(24,24,Nt-48,xe-48)});Rs(bt,at,Tt+se+wt-1.6,he+St/2+.35,3.6,1.2,Ot),or(bt,at,Tt+se+wt,he,q+3.4,St+3.4,3.8,mt,{hip:!0,upturn:!0});{let Q=Tt+se+wt+3.8,Nt=lt("#3d4a44",{roughness:.6,metalness:.2}),xe=Math.max(1,(q+3.4)/2-(St+3.4)/2*.8);for(let Pe of[-1,1]){let ln=qt(bt,at+Pe*xe,Q-.15,he,.35,1.2,.4,Nt);ln.rotation.z=-Pe*.25}we(bt,at,Q,he,.1,.5,I);let Xt=new Ke(new Xi(.3,12,10),I);Xt.position.set(at,Q+.75,he),bt.add(Xt)}if(kt.length){let Q=kt.map(rn=>rn[0]),Nt=Math.max(...Q)-Math.min(...Q),xe=(Math.max(...Q)+Math.min(...Q))/2,Xt=(xt+Ht)/2,Pe=xt-Ht,ln=Math.max(...[0,.5,1].map(rn=>v(...H(xe,Ht+Pe*rn))))-N;qt(bt,xe,Math.min(ln,Tt)-1,Xt,Nt,Math.max(Tt,ln+.3)-Math.min(ln,Tt)+1+4.6,Pe,st),or(bt,xe,Math.max(Tt,ln+.3)+4.6,Xt,Nt+1.6,Pe+1.6,2,mt,{hip:!0,upturn:!0})}Mr.set(_?_.n:"\u5730\u85CF\u7985\u5BFA",Math.max(Mr.get(_?.n)??0,N+Tt+se+wt+5)),_&&(_.modelNote="\u5317\u95E8\u540E\u7684\u5927\u6BBF\u6309\u7528\u6237\u6307\u8BA4\uFF08OSM way 609909706\uFF09\u505A\u6210\u91CD\u6A90\u6B47\u5C71\u6BBF\u5802\uFF1A\u77F3\u53F0\u57FA\u3001\u7EA2\u67F1\u56DE\u5ECA\u3001\u6728\u683C\u95E8\u3001\u9EC4\u5899\u3001\u4E0A\u5C42\u6728\u6784\u3002\u6BBF\u540D\u4E0E\u5C3A\u5BF8\u672A\u89C1\u516C\u5F00\u8D44\u6599\uFF0C\u5F62\u5236\u4E3A\u793A\u610F\uFF1B\u9662\u4E2D\u65B9\u4EAD\u6309\u536B\u661F\u5F71\u50CF\u4E0E\u5B9E\u666F\u7167\u7247\u8865\u51FA\u3002");{let[Q,Nt]=[-1807,82],xe=ar(Q,Nt,_?_.n:"\u5730\u85CF\u7985\u5BFA");xe.rotation.y=W,qt(xe,0,-1.2,0,7.6,1.6,7.6,be);for(let ln of[-1,1])for(let rn of[-1,1])we(xe,ln*2.9,.4,rn*2.9,.22,3.6,ot);qt(xe,0,3.6,0,6.4,.45,6.4,lt("#2a6184",{roughness:.7})),or(xe,0,4.05,0,8.6,8.6,2.8,mt,{hip:!0,upturn:!0});let Xt=new Ke(new Xi(.28,12,10),I);Xt.position.set(0,7.2,0),xe.add(Xt),we(xe,0,6.8,0,.08,.4,I);let Pe=lt("#6a5534",{roughness:.45,metalness:.55});we(xe,0,.4,0,.7,1.1,Pe),or(xe,0,1.5,0,1.7,1.7,.7,Pe,{hip:!0,upturn:!0})}}}let co=null;{let c=t.areas.find(_=>_.id==="r4-juzhilin-site"),m=t.places.find(_=>_.featured);if(c&&m){let pt=function(S,F,$,_t,Bt,Vt=256){return pi(Vt,Vt,(ie,Ee)=>{let Ye=Ui(S),Ge=[];for(let Sn=0;Sn<F;Sn++)for(let Un=0;Un<F;Un++)Ge.push([(Un+.12+.76*Ye())*Ee/F,(Sn+.12+.76*Ye())*Ee/F,at($[Math.floor(Ye()*$.length)]),.86+.28*Ye()]);let cn=ie.createImageData(Ee,Ee),vn=at(_t);for(let Sn=0;Sn<Ee;Sn++)for(let Un=0;Un<Ee;Un++){let On=1e9,bi=1e9,Ss=null;for(let ns of Ge){let fr=Math.abs(Un-ns[0]),al=Math.abs(Sn-ns[1]);fr=Math.min(fr,Ee-fr),al=Math.min(al,Ee-al);let yc=fr*fr+al*al;yc<On?(bi=On,On=yc,Ss=ns):yc<bi&&(bi=yc)}let Es=(Sn*Ee+Un)*4,Os=Math.sqrt(bi)-Math.sqrt(On),Xr=(Ye()-.5)*18;if(Os<Bt)for(let ns=0;ns<3;ns++)cn.data[Es+ns]=vn[ns]+Xr*.4;else{let ns=Ss[3]*(Os<Bt+2.5?.82:1);for(let fr=0;fr<3;fr++)cn.data[Es+fr]=Ss[2][fr]*ns+Xr}cn.data[Es+3]=255}ie.putImageData(cn,0,0)},{repeat:!0})},vt=function(S,F,$,_t,Bt,Vt,ie,Ee=2){if($-F<.001||Bt-_t<.001||ie-Vt<.001)return;let Ye=$-F,Ge=Bt-_t,cn=ie-Vt,vn=new Ri(Ye,Ge,cn),Sn=vn.attributes.uv,Un=[[cn,Ge,Vt,_t],[cn,Ge,Vt,_t],[Ye,cn,F,Vt],[Ye,cn,F,Vt],[Ye,Ge,F,_t],[Ye,Ge,F,_t]];for(let On=0;On<6;On++)for(let bi=0;bi<4;bi++){let Ss=On*4+bi;Sn.setXY(Ss,(Sn.getX(Ss)*Un[On][0]+Un[On][2])/Ee,(Sn.getY(Ss)*Un[On][1]+Un[On][3])/Ee)}vn.translate((F+$)/2,(_t+Bt)/2,-(Vt+ie)/2),gi(vn,S)},wi=function(S,F,$,_t,Bt,Vt=[[0,0],[1,0],[1,1],[0,1]]){let ie=new Ln,Ee=[F,$,_t,F,_t,Bt].map(Vp).flat(),Ye=[0,1,2,0,2,3].map(Ge=>Vt[Ge]).flat();ie.setAttribute("position",new en(Ee,3)),ie.setAttribute("uv",new en(Ye,2)),ie.computeVertexNormals(),gi(ie,S)},o1=function(S,F,$,_t,Bt=[[0,0],[1,0],[.5,1]]){let Vt=new Ln;Vt.setAttribute("position",new en([F,$,_t].map(Vp).flat(),3)),Vt.setAttribute("uv",new en(Bt.flat(),2)),Vt.computeVertexNormals(),gi(Vt,S)},Er=function(S,F,$=1.05){for(let _t=1;_t<S.length;_t++){let Bt=S[_t-1],Vt=S[_t],ie=F[_t-1],Ee=F[_t];wi(nl,[Bt[0],ie,Bt[1]],[Vt[0],Ee,Vt[1]],[Vt[0],Ee+$,Vt[1]],[Bt[0],ie+$,Bt[1]]);let Ye=new Ri(1,1,1),Ge=Vt[0]-Bt[0],cn=Vt[1]-Bt[1],vn=Math.hypot(Ge,cn);Ye.scale(vn,.035,.05),Ye.rotateY(Math.atan2(cn,Ge)),Ye.rotateZ(0),Ye.translate((Bt[0]+Vt[0])/2,(ie+Ee)/2+$,-(Bt[1]+Vt[1])/2),gi(Ye,hc)}},xi=function(S,F,$,_t=Cn){ps(_t,S,F,$,.3,.42,10,.26),Hi(_t,S,F+.62,$+.18,.3,.28,.12)},Xs=function(S,F,$,_t=.45){ps(zn,S,F,$,.05,.7,6),ps(jn,S,F+.7,$,_t,.05,16)},Gr=function(S,F,$,_t=.12,Bt=.35,Vt=1){vt(Ls,S-_t/2,S+_t/2,F,F+Bt,$-.02,$+.04*Vt)},_=c.frame,b=_.origin,E=_.u,R=[E[1],-E[0]],U=_.length,W=_.depth,H=_.front,D=-9,j=(S,F)=>[b[0]+E[0]*S+R[0]*F,b[1]+E[1]*S+R[1]*F],Y=v(...j(3,H))+.25,k=S=>v(...j(S,H))+.25-Y,Z=(S,F)=>mi(...j(S,F))-Y;li.o.set(b[0],b[1],E[0],E[1]),li.s.set(0,U,H,W);let J=ar(b[0],b[1],m.n);J.position.y=Y,J.rotation.y=Math.atan2(-R[0],-R[1]);let at=S=>[parseInt(S.slice(1,3),16),parseInt(S.slice(3,5),16),parseInt(S.slice(5,7),16)],Ut=pt(41,9,["#8e8b84","#7d7a73","#9a968d","#6f6d68","#a8a296"],"#c9c5bb",1.6),xt=pt(57,7,["#a8855f","#94765a","#b99c78","#7f6a55","#c2a784","#8c7b6b"],"#efe9dc",2.4),Ht=pi(256,256,(S,F)=>{let $=Ui(9);for(let _t=0;_t<16;_t++){let Bt=$();S.fillStyle=`rgb(${104+Bt*18|0},${70+Bt*12|0},${48+Bt*9|0})`,S.fillRect(_t*16,0,16,F),S.fillStyle="#3b2618",S.fillRect(_t*16+14,0,2,F)}for(let _t=0;_t<2500;_t++)S.fillStyle=`rgba(40,22,12,${$()*.12})`,S.fillRect($()*F,$()*F,1,6+$()*14)},{repeat:!0}),kt=pi(256,256,(S,F)=>{let $=Ui(13);for(let _t=0;_t<18;_t++){let Bt=_t*F/18;for(let Vt=-(_t*53%120);Vt<F;Vt+=120+_t*31%60){let ie=$();S.fillStyle=`rgb(${120+ie*22|0},${80+ie*14|0},${60+ie*10|0})`,S.fillRect(Vt,Bt,118+_t*31%60,F/18-1.6)}}for(let _t=0;_t<3e3;_t++)S.fillStyle=`rgba(50,28,18,${$()*.1})`,S.fillRect($()*F,$()*F,10+$()*20,1)},{repeat:!0}),bt=pi(256,256,(S,F)=>{let $=Ui(21);S.fillStyle="#5e2716",S.fillRect(0,0,F,F);let _t=F/10,Bt=F/8;for(let Vt=0;Vt<8;Vt++)for(let ie=0;ie<10;ie++){let Ee=ie*_t,Ye=Vt*Bt,Ge=$(),cn=S.createLinearGradient(Ee,0,Ee+_t,0),vn=[184+Ge*20,86+Ge*16,48+Ge*10];cn.addColorStop(0,`rgb(${vn[0]*.55|0},${vn[1]*.55|0},${vn[2]*.55|0})`),cn.addColorStop(.45,`rgb(${vn[0]|0},${vn[1]|0},${vn[2]|0})`),cn.addColorStop(.62,`rgb(${Math.min(255,vn[0]*1.14)|0},${vn[1]*1.12|0},${vn[2]*1.1|0})`),cn.addColorStop(1,`rgb(${vn[0]*.5|0},${vn[1]*.5|0},${vn[2]*.5|0})`),S.fillStyle=cn,S.fillRect(Ee+1,Ye+2,_t-2,Bt-2),S.fillStyle="rgba(40,14,6,.55)",S.fillRect(Ee,Ye,_t,3)}},{repeat:!0}),N=(S,F,$)=>pi(128,128,(_t,Bt)=>{let Vt=Ui($);_t.fillStyle=S,_t.fillRect(0,0,Bt,Bt);for(let ie=0;ie<3500;ie++)_t.fillStyle=F[Math.floor(Vt()*F.length)],_t.fillRect(Vt()*Bt,Vt()*Bt,1+Vt()*1.5,1+Vt()*1.5)},{repeat:!0}),ot=N("#cdc2ae",["#e6dccb","#a99b86","#bfb09a","#8f8270"],3),mt=N("#565f6b",["#79828d","#3c434c","#8b939c","#4a525c"],4),st=N("#edebe5",["#f6f4ef","#e2dfd7","#e8e5de"],5),ht=pi(128,128,(S,F)=>{S.fillStyle="#d8d3c7",S.fillRect(0,0,F,F),S.strokeStyle="#b8b2a5",S.lineWidth=2;for(let $=0;$<=F;$+=F/2)S.beginPath(),S.moveTo($,0),S.lineTo($,F),S.stroke(),S.beginPath(),S.moveTo(0,$),S.lineTo(F,$),S.stroke()},{repeat:!0}),ut=pi(256,192,(S,F,$)=>{let _t=S.createLinearGradient(0,0,0,$);_t.addColorStop(0,"#ffe2ad"),_t.addColorStop(.55,"#f4bf73"),_t.addColorStop(1,"#c8813e"),S.fillStyle=_t,S.fillRect(0,0,F,$),S.fillStyle="#f7ecd6",S.fillRect(F*.1,$*.62,F*.46,$*.2),S.fillStyle="#8a5a36",S.fillRect(F*.1,$*.52,F*.46,$*.1),S.fillStyle="#fff3d8",S.beginPath(),S.arc(F*.75,$*.34,$*.1,0,Math.PI*2),S.fill(),S.fillStyle="#6d4a30",S.fillRect(F*.72,$*.44,F*.06,$*.4),S.fillStyle="#2a2b2d",S.fillRect(0,0,F,7),S.fillRect(0,$-7,F,7),S.fillRect(0,0,7,$),S.fillRect(F-7,0,7,$),S.fillRect(F/2-3,0,6,$)}),it=(S,F={})=>Be({color:S,roughness:.85,side:mn,...F}),Tt=it("#ffffff",{map:st}),Ce=it("#223044"),Dt=it("#ffffff",{map:Ht,roughness:.75}),ae=it("#ffffff",{map:Ut,roughness:.95}),he=it("#ffffff",{map:xt,roughness:.95}),se=it("#ffffff",{map:bt,roughness:.7}),ee=it("#8a3b21",{roughness:.7}),ge=it("#ffffff",{map:kt,roughness:.8}),q=it("#ffffff",{map:ot}),St=it("#ffffff",{map:mt}),wt=it("#ffffff",{map:ht}),Ot=it("#a9a99f"),Q=it("#c9c4b8"),Nt=it("#2c2e31",{roughness:.5}),xe=it("#6e2c1f",{roughness:.6}),Xt=it("#4a4e52",{roughness:.6}),Pe=it("#ddd8cc"),ln=it("#ebe8e0"),rn=it("#8d3c26"),Jn=it("#9a6a36"),Ws=it("#56683a"),Fi=it("#3b5a33"),wn=it("#5b4636"),Yn=it("#bd8e78"),Cn=it("#a9763d"),jn=it("#6b4a30"),zn=it("#26282b",{roughness:.45,metalness:.5}),Ko=it("#c93a24"),Qo=it("#17344d",{roughness:.06,metalness:.45}),nl=Be({color:"#cfeee9",transparent:!0,opacity:.26,roughness:.05,metalness:.1,side:mn,depthWrite:!1}),hc=it("#8fe0d2",{emissive:"#7fe7d6",emissiveIntensity:.55}),Bi=it("#ffb24a",{emissive:"#ff9f2e",emissiveIntensity:2.2}),Ls=it("#ffdca0",{emissive:"#ffc46b",emissiveIntensity:1.8}),Ci=Be({map:ut,emissive:"#ffffff",emissiveMap:ut,emissiveIntensity:.8,roughness:.25,side:mn}),Sr=new Map,gi=(S,F)=>{Sr.has(F)||Sr.set(F,[]),Sr.get(F).push(S.index?S.toNonIndexed():S)},Vp=([S,F,$])=>[S,F,-$],ta=(S,F,$,_t,Bt,Vt)=>{let ie=new vs($-F,Bt-_t);ie.translate((F+$)/2,(_t+Bt)/2,-Vt),gi(ie,S)},uc=(S,F,$,_t,Bt,Vt,ie)=>{let Ee=new vs(_t-$,Vt-Bt);Ee.rotateY(ie*Math.PI/2),Ee.translate(F,(Bt+Vt)/2,-($+_t)/2),gi(Ee,S)},ps=(S,F,$,_t,Bt,Vt,ie=12,Ee=Bt)=>{let Ye=new Wi(Ee,Bt,Vt,ie);Ye.translate(F,$+Vt/2,-_t),gi(Ye,S)},Hi=(S,F,$,_t,Bt,Vt,ie)=>{let Ee=new Xi(1,10,7);Ee.scale(Bt,Vt,ie),Ee.translate(F,$,-_t),gi(Ee,S)},a1=(S,F,$,_t,Bt=.5)=>{let Vt=Ui(Math.round(S*97+_t*13));for(let ie=S+.3;ie<F-.1;ie+=.55)Hi(Vt()<.7?rn:Jn,ie,$+.22,_t+(Vt()-.5)*Bt*.4,.38,.3+Vt()*.12,Bt*.55)},Vr=(S,F,$,_t,Bt,Vt=.55)=>{vt(ln,S,F,$,$+Vt,_t,Bt),a1(S,F,$+Vt,(_t+Bt)/2,Bt-_t)},ea=(S,F,$,_t,Bt,Vt)=>Er([[S,F],[$,_t]],[Bt,Bt],Vt),$t=4.2,Fe=8.4,Kn=.6,ze=Math.min(k(32)+.45,0),Qn=6.5,ri=24.5,yi=27.3,l1=38,qe=44.3,ti=36.6,Ve=3.65,Dn=k(qe),yn=$t+1.4;for(let S=0;S<qe-1e-6;S+=1){let F=Math.min(qe,S+1),$=k(S),_t=k(F);wi(Ot,[S,$,1.2],[F,_t,1.2],[F,_t,H],[S,$,H],[[S/2,.6],[F/2,.6],[F/2,-.4],[S/2,-.4]]),wi(Ot,[S,D,H],[F,D,H],[F,_t,H],[S,$,H])}wi(Ot,[0,D,1.2],[0,D,H],[0,k(0),H],[0,k(0),1.2]),vt(Ce,0,Qn,D,.38,1,8.5),vt(Tt,0,Qn,.38,3.95,1,8.5,4),vt(Q,-.05,Qn+.05,3.95,$t,.95,8.5),vt(q,0,Qn,$t,$t+.02,1,8.5);for(let S of[1.85,4.65])ta(Ci,S-1.1,S+1.1,.95,3,.99),vt(Nt,S-1.16,S+1.16,.89,.95,.94,1),vt(Nt,S-1.16,S+1.16,3,3.06,.94,1);Gr(3.25,2.1,.97,.12,.32),Gr(.35,2.1,.97,.12,.32),Gr(Qn-.35,2.1,.97,.12,.32),uc(Ci,-.01,4.2,6.4,1,2.9,-1),ea(0,1.02,Qn,1.02,$t,1.05),ea(.02,1,.02,8.5,$t,1.05),ea(Qn-.02,1,Qn-.02,4.6,$t,1.05),ps(ln,1.5,$t,2.6,.78,.5,24),Hi(rn,1.5,$t+.75,2.6,.62,.36,.62),xi(3.6,$t,2.2,zn),xi(4.6,$t,2.5,zn),Xs(4.1,$t,3.2,.3),vt(ae,Qn,ri,D,Kn,1.2,4.6,3),vt(wt,Qn,ri,Kn,Kn+.04,1.75,4.6),vt(ae,Qn,ri,Kn,Kn+1.05,1.2,1.75,3),vt(Q,Qn-.05,ri,Kn+1.05,Kn+1.15,1.15,1.8);let Bu=(ri-Qn)/5;for(let S=0;S<5;S++){let F=Qn+(S+.5)*Bu;ta(Ci,F-1.15,F+1.15,Kn+.08,Kn+2.6,4.52),vt(Nt,F-1.2,F+1.2,Kn+2.6,Kn+2.68,4.5,4.56),vt(Nt,F-.03,F+.03,Kn+.08,Kn+2.6,4.49,4.53),xi(F-.75,Kn,3),xi(F+.75,Kn,3),Xs(F,Kn,2.6,.28),S&&vt(ae,Qn+S*Bu-.2,Qn+S*Bu+.2,Kn,Kn+1.75,1.75,4.5,3)}vt(Tt,Qn,ri,Kn,3.9,4.6,10.5,4),vt(Dt,Qn,ri,Kn,3.62,4.52,4.6),wi(Dt,[Qn,3.85,4.6],[ri,3.85,4.6],[ri,3.62,3],[Qn,3.62,3],[[0,0],[9,0],[9,.8],[0,.8]]),vt(jn,Qn,ri,3.44,3.64,2.95,3.05),vt(Bi,Qn,ri,3.4,3.45,2.98,3.06),vt(Q,Qn,ri,3.9,$t,4.45,10.5);let fc=k(25.9),zu=Math.ceil(($t-fc)/.165),c1=($t-fc)/zu,ku=1.3+zu*.28;for(let S=0;S<zu;S++){let F=1.3+S*.28,$=fc+(S+1)*c1;vt(Pe,ri+.4,yi-.4,D,$,F,F+.28),vt(Bi,ri+.4,yi-.4,$-.07,$-.035,F-.02,F+.01),vt(Tt,ri,ri+.4,D,$+.95,F,F+.28,4),vt(Tt,yi-.4,yi,D,$+.18,F,F+.28,4)}Er([[yi-.2,1.3],[yi-.2,ku]],[fc+.18,$t+.18],.95),vt(Tt,ri-.3,ri+.4,k(24.6)-.2,Kn+2.3,.3,1.3,4),vt(Tt,yi-.4,yi+.3,k(27.4)-.2,Kn+2.3,.3,1.3,4),vt(Q,ri-.35,ri+.45,Kn+2.3,Kn+2.4,.25,1.35),vt(Q,yi-.45,yi+.35,Kn+2.3,Kn+2.4,.25,1.35);let ur=[29,30.8],dc=Math.max(0,Math.ceil((ze-k(29.9))/.16)),h1=dc?(ze-k(29.9))/dc:0,u1=1.2+dc*.3;vt(ae,yi,ur[0],D,ze,1.2,5.6,3),vt(ae,ur[1],ti,D,ze,1.2,5.6,3),vt(ae,ur[0],ur[1],D,ze,u1,5.6,3);for(let S=0;S<dc;S++){let F=1.2+S*.3;vt(Pe,ur[0],ur[1],D,k(29.9)+(S+1)*h1,F,F+.3)}vt(wt,yi,ti,ze,ze+.04,1.75,5.6),vt(ae,yi,ur[0],ze,ze+.85,1.2,1.7,3),vt(ae,ur[1],ti-.9,ze,ze+.85,1.2,1.7,3),vt(Q,yi,ur[0],ze+.85,ze+.95,1.15,1.75),vt(Q,ur[1],ti-.9,ze+.85,ze+.95,1.15,1.75),vt(Tt,yi,qe,ze,3.9,5.6,12.5,4),vt(Dt,yi,ti,ze,3.9,5.52,5.6);let pc=Math.min(3.5,3.6-ze-.2);for(let[S,F]of[[27.9,31.3],[31.9,35.9]]){ta(Ci,S,F,ze+.05,ze+pc,5.5),vt(Nt,S-.05,F+.05,ze+pc,ze+pc+.07,5.47,5.53);for(let $=S+(F-S)/3;$<F-.1;$+=(F-S)/3)vt(Nt,$-.03,$+.03,ze+.05,ze+pc,5.46,5.5)}for(let S of[32.3,33.1,33.9])ps(zn,S,ze,4.9,.03,.9,5),Hi(Ko,S,ze+1.05,4.9,.28,.34,.28);vt(Xt,yi,ti,3.9,$t+.05,5.42,5.6),vt(Bi,yi,ti,3.86,3.9,5.44,5.52),vt(ae,0,Qn,D,$t,8.5,W,3),vt(ae,Qn,ri,D,$t,10.5,W,3),vt(ae,ri,yi,D,$t,ku,W,3),vt(ae,yi,l1,D,$t,12.5,W,3),vt(q,0,4,$t,$t+.03,8.5,14.8);let $n=[4,18.5],tn=[5.2,14.2],qs=7.8,Gp=2.6,Is=(tn[0]+tn[1])/2,Ds=qs+Gp,il=Gp/((tn[1]-tn[0])/2),An=.6,sl=.35,Wp=S=>Ds-il*(S-Is),xo=Is+(Ds-Fe)/il,ui=[9.9,13.1],ms=[xo+.2,xo+3.4],Hu=ms[1]+.2;Vr(Qn+.1,$n[1]-.1,$t,4.5,5.15,.5),vt(Tt,$n[0],$n[1],$t,qs,tn[0],tn[1],4);for(let S=0;S<4;S++){let F=$n[0]+(S+.5)*($n[1]-$n[0])/4;ta(Ci,F-1.3,F+1.3,$t+.45,$t+2.85,tn[0]-.02),vt(xe,F-1.42,F+1.42,$t+.33,$t+.45,tn[0]-.08,tn[0]),vt(xe,F-1.42,F+1.42,$t+2.85,$t+2.97,tn[0]-.08,tn[0]),vt(xe,F-1.42,F-1.3,$t+.45,$t+2.85,tn[0]-.08,tn[0]),vt(xe,F+1.3,F+1.42,$t+.45,$t+2.85,tn[0]-.08,tn[0]),vt(Nt,F-.03,F+.03,$t+.45,$t+2.85,tn[0]-.06,tn[0]-.02),vt(Nt,F-1.3,F+1.3,$t+2.2,$t+2.25,tn[0]-.06,tn[0]-.02),S<3&&Gr($n[0]+(S+1)*($n[1]-$n[0])/4,$t+1.9,tn[0]-.03,.12,.34)}vt(xe,$n[0],$n[1],qs-.5,qs-.12,tn[0]-.08,tn[0]),vt(Bi,$n[0],$n[1],qs-.12,qs-.06,tn[0]-.12,tn[0]-.02),uc(Ci,$n[0]-.01,8.6,10.8,$t+.8,$t+2.6,-1);{let S=qs-il*An,F=$n[0]-sl,$=$n[1]+sl,_t=($-F)/2,Bt=Math.hypot(Is-tn[0]+An,Ds-S)/2;wi(se,[F,S,tn[0]-An],[$,S,tn[0]-An],[$,Ds,Is],[F,Ds,Is],[[0,Bt],[_t,Bt],[_t,0],[0,0]]),wi(se,[$,S,tn[1]+An],[F,S,tn[1]+An],[F,Ds,Is],[$,Ds,Is],[[_t,Bt],[0,Bt],[0,0],[_t,0]]),wi(ee,[F,S-.14,tn[0]-An],[$,S-.14,tn[0]-An],[$,S,tn[0]-An],[F,S,tn[0]-An]),wi(ee,[$,S-.14,tn[1]+An],[F,S-.14,tn[1]+An],[F,S,tn[1]+An],[$,S,tn[1]+An]);let Vt=new Wi(.17,.17,$-F+.3,10);Vt.rotateZ(Math.PI/2),Vt.translate((F+$)/2,Ds+.06,-Is),gi(Vt,ee);for(let[ie,Ee]of[[F-.1,-1],[$+.1,1]]){let Ye=new Ri(.7,.24,.3);Ye.rotateZ(Ee*.55),Ye.translate(ie+Ee*.12,Ds+.25,-Is),gi(Ye,ee)}for(let ie of $n){o1(Tt,[ie,qs,tn[0]],[ie,qs,tn[1]],[ie,Ds,Is]);for(let[Ee,Ye]of[[tn[0]-An,Is],[tn[1]+An,Is]]){let Ge=qs-il*An,cn=ie===$n[0]?-sl:sl;wi(ee,[ie+cn,Ge,Ee],[ie+cn,Ds,Ye],[ie+cn,Ds+.2,Ye],[ie+cn,Ge+.2,Ee])}for(let Ee of[tn[0]-An,tn[1]+An]){let Ye=new Ri(.28,.5,.28),Ge=ie===$n[0]?-1:1;Ye.rotateZ(Ge*.5),Ye.translate(ie+Ge*(sl+.1),qs-il*An+.25,-Ee),gi(Ye,ee)}}for(let[ie,Ee,Ye]of[[6,10.4,3],[12.6,17,3],[10.4,12.6,1]])for(let Ge=3-Ye;Ge<3;Ge++){let cn=xo-.8*Ge,vn=cn-.8,Sn=Wp(vn)+.35;vt(Dt,ie,Ee,Wp(cn)-.2,Sn-.05,vn,cn,1),vt(ge,ie-.03,Ee+.03,Sn-.06,Sn,vn-.02,cn+.05),vt(Bi,ie,Ee,Sn-.13,Sn-.08,cn+.01,cn+.05)}for(let ie of[8.2,14.8])Gr(ie,Fe+.6,xo+.02,.14,.22);vt(ge,$n[0],ui[0],Fe-.3,Fe+.03,xo,tn[1]+An),vt(ge,ui[1],$n[1],Fe-.3,Fe+.03,xo,tn[1]+An),vt(ge,ui[0],ui[1],Fe-.3,Fe+.03,xo,ms[0]),vt(Qo,ui[0],ui[1],Fe-.6,Fe-.08,ms[0],ms[1]),vt(Q,ui[0]-.2,ui[1]+.2,Fe-.1,Fe+.06,ms[1],ms[1]+.2),vt(Q,ui[0]-.2,ui[0],Fe-.1,Fe+.06,ms[0],ms[1]),vt(Q,ui[1],ui[1]+.2,Fe-.1,Fe+.06,ms[0],ms[1]),Vr(7.4,ui[0]-.3,Fe,ms[1]-.6,ms[1]+.9,.6),Vr(ui[1]+.3,15.6,Fe,ms[1]-.6,ms[1]+.9,.6)}let Ms=[35.3,37.3];vt(he,0,ui[0]-.2,$t,Fe,tn[1]+An,W,3),vt(he,ui[1]+.2,Ms[0],$t,Fe,tn[1]+An,W,3),vt(he,ui[0]-.2,ui[1]+.2,$t,Fe,Hu,W,3),vt(he,ui[0]-.2,ui[1]+.2,$t,Fe-.6,tn[1]+An,Hu,3),vt(he,$n[1],20.5,$t,Fe,12.5,tn[1]+An,3),vt(q,0,ui[0]-.2,Fe,Fe+.03,tn[1]+An,W),vt(q,ui[1]+.2,Ms[0],Fe,Fe+.03,tn[1]+An,W),vt(q,ui[0]-.2,ui[1]+.2,Fe,Fe+.03,Hu,W),vt(q,$n[1],20.5,Fe,Fe+.03,12.5,tn[1]+An),vt(ge,15.8,18.3,Fe+.02,Fe+.05,tn[1]+An,W-1),ea(0,tn[1]+An+.02,$n[0],tn[1]+An+.02,Fe,1.05);{for(let $ of[-1,1])for(let _t of[-1,1]){let Bt=new Ri(.06,2.3,.06);Bt.rotateX(_t*.18),Bt.translate(2.4+$*1,Fe+1.1,-(19.5+_t*.2)),gi(Bt,zn)}vt(zn,2.4-1.05,2.4+1.05,Fe+2.2,Fe+2.26,19.5-.05,19.5+.05),wi(Xt,[2.4-1.2,Fe+2.35,19.5-.8],[2.4+1.2,Fe+2.35,19.5-.8],[2.4+1.2,Fe+2.1,19.5+.8],[2.4-1.2,Fe+2.1,19.5+.8]),vt(Xt,2.4-.8,2.4+.8,Fe+.55,Fe+.7,19.5-.25,19.5+.25)}Xs(6.5,Fe,21.5,.45),xi(5.8,Fe,21.5,zn),xi(7.2,Fe,21.5,zn),vt(ge,$n[1],ri,$t,$t+.05,4.6,12.5),vt(ge,ri,yi,$t,$t+.05,ku,12.5),vt(ge,yi,qe,$t,$t+.05,5.6,12.5),vt(ge,ti,qe,$t,$t+.05,Ve,5.6),ea($n[1],4.62,ri,4.62,$t,1.05),Er([[yi,5.62],[ti,5.62],[ti,Ve+.02],[qe-.02,Ve+.02],[qe-.02,12.5]],[$t,$t,$t,$t,$t],1.05);{ps(wn,21.6,$t,9.3,.16,1.6,8,.2);let $=new Wi(.09,.13,1.4,6);$.rotateZ(.7),$.translate(21.6+.45,$t+1.7,-9.3),gi($,wn);for(let[_t,Bt,Vt,ie]of[[-.6,1.2,.1,1],[.5,1.7,-.1,1.15],[1.2,2.25,.2,.9],[-.1,2.45,0,.95],[.3,3,.05,.7]])Hi(Fi,21.6+_t,$t+Bt,9.3+Vt,ie,.22,ie*.8);vt(Tt,21.6-1.3,21.6+1.3,$t,$t+.4,9.3-1.3,9.3+1.3,4),Hi(rn,21.6+.9,$t+.55,9.3+.9,.5,.3,.45),Hi(Jn,21.6-.8,$t+.55,9.3+.8,.45,.28,.4)}vt(St,23.5,33.5,$t+.03,$t+.08,9.1,11.2,1.5);for(let S of[25.2,28.6,32])for(let F of[9.4,10.2,11])vt(wt,S-.45,S+.45,$t+.05,$t+.11,F-.28,F+.28,1);Vr(19,22.8,$t,11.4,12.3),Vr(24.6,28.4,$t+.02,11.55,12.3),Vr(30.2,33.8,$t+.02,11.55,12.3);for(let S of[26.2,31.2])vt(Yn,S,S+1.7,$t+.05,$t+.5,7.25,7.7,1);{let S=new Wi(.62,.72,.1,9);S.translate(28.9,$t+.72,-7.5),gi(S,jn),ps(jn,28.9,$t+.05,7.5,.18,.67,7)}Xs(34.6,$t+.05,8.2,.4),xi(33.9,$t+.05,8.2,zn),xi(35.3,$t+.05,8.2,zn),Xs(36.7,$t+.05,10.2,.4),xi(36,$t+.05,10.2,zn),xi(37.4,$t+.05,10.2,zn),Xs(41.3,$t+.05,8.4,.45),xi(40.6,$t+.05,8.4,zn),xi(42,$t+.05,8.4,zn),Xs(39.2,$t+.05,5,.4),xi(38.5,$t+.05,5,zn),xi(39.9,$t+.05,5,zn);let Vi=[20.5,35],ei=[12.5,18],Wr=7.6;vt(Tt,Vi[0],Vi[1],$t,Wr,ei[0],ei[1],4),vt(Xt,Vi[0],Vi[1],$t,$t+.14,ei[0]-.06,ei[0]);for(let[S,F]of[[21.3,23.9],[25.5,28.1],[29.3,33.3]])ta(Ci,S,F,$t+.08,$t+2.75,ei[0]-.02),vt(Nt,S-.06,F+.06,$t+2.75,$t+2.83,ei[0]-.07,ei[0]),vt(Nt,S-.06,S,$t+.08,$t+2.75,ei[0]-.07,ei[0]),vt(Nt,F,F+.06,$t+.08,$t+2.75,ei[0]-.07,ei[0]),vt(Nt,(S+F)/2-.03,(S+F)/2+.03,$t+.08,$t+2.75,ei[0]-.06,ei[0]-.02);for(let S of[24.7,28.7,34.1])Gr(S,$t+1.3,ei[0]-.03,.06,1.3);vt(Xt,Vi[0]-.3,Vi[1]+.3,Wr,Fe,ei[0]-1,ei[1]+.2),vt(Bi,Vi[0]-.3,Vi[1]+.3,Wr-.05,Wr,ei[0]-1,ei[0]-.94),vt(Bi,Vi[0]-.3,Vi[0]-.24,Wr-.05,Wr,ei[0]-1,ei[1]);for(let S=Vi[0]+1;S<Vi[1];S+=2.4)vt(Ls,S-.09,S+.09,Wr-.03,Wr,ei[0]-.62,ei[0]-.44);vt(q,Vi[0],Vi[1],Fe,Fe+.03,ei[0]-1,ei[1]);{let S=[[$n[1],12.52],[Vi[0]-.3,12.52]];for(let F=1;F<=8;F++){let $=F/8*Math.PI/2;S.push([Vi[0]-.3+2.2*Math.sin($),ei[0]-.98+1*Math.cos($)])}S.push([Vi[1]+.3,ei[0]-.98]),Er(S,S.map(()=>Fe),1.05)}Xs(24,Fe+.03,14.5,.45),xi(23.3,Fe+.03,14.5,zn),xi(24.7,Fe+.03,14.5,zn),Xs(30,Fe+.03,15.2,.45),xi(29.3,Fe+.03,15.2,zn),xi(30.7,Fe+.03,15.2,zn);let f1=it("#34363a",{roughness:.95}),Xp=it("#e9e7df",{roughness:.8}),d1=it("#2b3440"),qp=it("#a8a39a",{roughness:.95}),p1=it("#bdb2a0",{roughness:.95}),m1=it("#ddd6c8",{roughness:.8}),Vu=it("#c9cdd1",{roughness:.35,metalness:.12}),Gu=it("#1f262c",{roughness:.1,metalness:.3}),Wu=it("#18191b"),Yp=it("#f2f3f1",{roughness:.4}),g1=it("#3f7dff",{emissive:"#3d78ff",emissiveIntensity:1.6}),$p=it("#4c3a2c",{roughness:1}),x1=it("#2e4b2c",{roughness:.95}),Zp=it("#3a5b35",{roughness:.95}),y1=it("#4a6c3f",{roughness:.95}),Jp=it("#5d5a55",{roughness:.7}),_1=it("#a8743f",{roughness:.6}),jp=it("#eeebe4"),v1=it("#6c6a66",{roughness:.9}),M1=it("#5f7a3e",{roughness:1}),b1=it("#b9bbb8",{roughness:.5}),Kp=it("#d2311f",{emissive:"#8a150a",emissiveIntensity:.55,roughness:.6}),Qp=it("#e67a2c",{emissive:"#8a3a0c",emissiveIntensity:.5,roughness:.6}),S1=it("#e8c74c",{emissive:"#7d6414",emissiveIntensity:.45,roughness:.6}),rl=(S,F,$,_t,Bt=_t)=>{let Vt=new X(F[0],F[1],-F[2]),ie=new X($[0],$[1],-$[2]),Ee=ie.clone().sub(Vt),Ye=Ee.length(),Ge=new Wi(Bt,_t,Ye,7);Ge.translate(0,Ye/2,0),Ge.applyQuaternion(new ys().setFromUnitVectors(new X(0,1,0),Ee.normalize())),Ge.translate(Vt.x,Vt.y,Vt.z),gi(Ge,S)},Xu=(S,F=0)=>Be({map:S,roughness:.55,emissive:F?"#ffffff":"#000000",emissiveMap:F?S:null,emissiveIntensity:F,side:mn}),qu=(S,F,$,_t,Bt,Vt,{emissive:ie=0}={})=>{let Ee=new Ke(new vs($-F,Bt-_t),Xu(S,ie));return Ee.position.set((F+$)/2,(_t+Bt)/2,-Vt+.01),J.add(Ee),Ee},tm=(S,F,$,_t,Bt,Vt,{emissive:ie=0}={})=>{let Ee=new Ke(new vs(_t-$,Vt-Bt),Xu(S,ie));return Ee.rotation.y=Math.PI/2,Ee.position.set(F,(Bt+Vt)/2,-($+_t)/2),J.add(Ee),Ee},Yu='"Xingkai SC","STXingkai","Kaiti SC","STKaiti","KaiTi",serif',Ti=S=>k(S)+.03,mc=Dn+3.3,Us=$t-.9,ni=12.5,zi=19.9,$u=Math.max(1,Math.ceil((ze-Dn)/.165)),em=(ze-Dn)/$u,gc=.38,Ns=qe-$u*gc;vt(Tt,ti,qe,ze,3.9,Ve,5.6,4),vt(ae,ti,qe-.42,D,ze,Ve,5.6,3),vt(he,ti,qe-.01,D,ze+.06,Ve-.08,Ve,2),vt(Dt,ti,qe,ze+.06,3.9,Ve-.08,Ve,1),vt(Dt,ti-.08,ti,ze,3.9,Ve,5.6,1);{let S=Ns+.35,F=qe-1.35;ta(Ci,S,F,ze+.45,ze+2.85,Ve-.1);for(let[$,_t,Bt,Vt]of[[S-.15,F+.15,ze+.3,ze+.45],[S-.15,F+.15,ze+2.85,ze+3],[S-.15,S,ze+.3,ze+3],[F,F+.15,ze+.3,ze+3],[(S+F)/2-.05,(S+F)/2+.05,ze+.45,ze+2.85]])vt(_1,$,_t,Bt,Vt,Ve-.17,Ve-.08);vt(Nt,S-.25,F+.25,ze+.2,ze+3.1,Ve-.1,Ve-.08);for(let $ of[ti+.8,qe-.6])vt(Ls,$-.03,$+.03,ze+1.2,ze+2.6,Ve-.12,Ve-.08)}uc(Ci,ti-.09,Ve+.35,Ve+1.45,ze+.05,ze+2.55,-1),vt(Nt,ti-.12,ti-.08,ze+2.55,ze+2.65,Ve+.3,Ve+1.5),qu(pi(128,72,(S,F,$)=>{S.fillStyle="#1d3f6e",S.fillRect(0,0,F,$),S.fillStyle="#fff",S.font='600 18px "PingFang SC",sans-serif',S.textAlign="center",S.fillText("\u51E4\u5F62\u65B0\u6751",F/2,28),S.font='700 28px "PingFang SC",sans-serif',S.fillText("19",F/2,62)}),qe-.55,qe-.2,ze+.1,ze+.32,Ve-.1),vt(Xt,ti,qe,3.9,$t+.05,Ve-.35,Ve),vt(jp,ti,qe,3.88,3.9,Ve-.33,Ve),vt(Bi,ti,qe,3.84,3.88,Ve-.35,Ve-.3);for(let S=0;S<$u;S++){let F=qe-S*gc,$=F-gc,_t=Dn+(S+1)*em;vt(qp,$,F+.02,D,_t,1.75,Ve,1),vt(Nt,$,$+.025,_t-.03,_t+.004,1.75,Ve)}vt(m1,ti,Ns,ze,ze+.04,1.75,Ve,1),vt(ae,ti,Ns,D,ze,1.75,Ve,3);{let S=$=>$<=Ns?ze+.9:Dn+(Math.floor((qe-$)/gc)+1)*em+.9,F=Ui(733);for(let $=ti-.9;$<qe-.01;$+=.62){let _t=Math.min(qe,$+.6),Bt=S(Math.min($+.3,qe-.01))+(F()-.5)*.06;vt(F()<.5?p1:qp,$,_t,D,Bt,1.2,1.75,1),vt(Q,$-.01,_t+.01,Bt,Bt+.07,1.18,1.77)}for(let[$,_t]of[[Ns-.8,1],[Ns+.5,.8],[Ns+2.6,1],[qe-.9,.8]]){let Bt=S($)+.07;ps(Jp,$,Bt,1.48,.16*_t,.32*_t,10,.12*_t),Hi(Jp,$,Bt+.42*_t,1.48,.13*_t,.15*_t,.13*_t)}}{let S=Ns-1.45;vt(Tt,S,S+.55,ze,ze+1.35,Ve-.6,Ve-.05,4),vt(Ls,S+.04,S+.51,ze+1.35,ze+1.8,Ve-.56,Ve-.09),vt(Nt,S,S+.55,ze+1.8,ze+1.86,Ve-.6,Ve-.05);for(let F of[.14,.27,.4])vt(Nt,S+F,S+F+.02,ze+1.36,ze+1.79,Ve-.61,Ve-.59);vt(ln,S+.65,Ns,ze,ze+.4,Ve-.55,Ve-.05);for(let F=S+.8;F<Ns-.1;F+=.33)Hi(Ws,F,ze+.72,Ve-.3,.3,.38,.26);ps(wn,Ns-.35,ze+.4,Ve-.3,.05,1.4,6);for(let[F,$]of[[0,1.9],[.2,1.6],[-.2,1.7]])Hi(Ws,Ns-.35+F,ze+$,Ve-.3,.35,.45,.3)}vt(d1,qe-.4,qe,D,Dn+1.25,Ve,12.5),vt(Tt,qe-.4,qe,Dn+1.25,ze,Ve,12.5,4),vt(Xt,qe-.35,qe+.12,3.9,$t+.05,Ve,12.5),vt(Bi,qe+.08,qe+.13,3.86,3.9,Ve,12.5),tm(pi(200,250,(S,F,$)=>{S.fillStyle="#24211e",S.fillRect(0,0,F,$),S.strokeStyle="#4a443c",S.lineWidth=4,S.strokeRect(6,6,F-12,$-12),S.fillStyle="#d8b56a",S.font=`70px ${Yu}`,S.textAlign="center",S.textBaseline="middle",S.fillText("\u5C45",F*.4,$*.24),S.fillText("\u4E4B",F*.62,$*.5),S.fillText("\u6797",F*.42,$*.76),S.font="10px sans-serif",S.fillText("JU ZHI LIN",F*.24,$*.5)}),qe+.02,Ve+.3,Ve+1.2,Dn+1.75,Dn+2.85),vt(Xt,qe,qe+.16,Dn+2.95,Dn+3.07,Ve+.6,Ve+.9);for(let[S,F]of[[Ve+2,Ve+4.2],[Ve+4.8,Ve+6.4]]){uc(Ci,qe+.01,S,F,Dn+2.4,Dn+4.7,1);for(let[$,_t,Bt,Vt]of[[S-.06,F+.06,Dn+2.34,Dn+2.4],[S-.06,F+.06,Dn+4.7,Dn+4.76],[S-.06,S,Dn+2.4,Dn+4.7],[F,F+.06,Dn+2.4,Dn+4.7],[(S+F)/2-.03,(S+F)/2+.03,Dn+2.4,Dn+4.7]])vt(Nt,qe,qe+.07,Bt,Vt,$,_t)}for(let S of[Ve+1.6,Ve+4.5,Ve+6.8])vt(Ls,qe,qe+.05,Dn+2.6,Dn+4.2,S-.03,S+.03);vt(Yp,qe,qe+.3,Dn+2.5,Dn+3.05,Ve+7.3,Ve+7.95),tm(pi(96,64,(S,F,$)=>{S.fillStyle="#e9eae7",S.fillRect(0,0,F,$),S.fillStyle="#55585a",S.beginPath(),S.arc(F*.42,$/2,$*.4,0,Math.PI*2),S.fill(),S.strokeStyle="#e9eae7",S.lineWidth=2;for(let _t=4;_t<$*.4;_t+=4)S.beginPath(),S.arc(F*.42,$/2,_t,0,Math.PI*2),S.stroke()}),qe+.31,Ve+7.32,Ve+7.93,Dn+2.52,Dn+3.03),vt(b1,qe,qe+.2,Dn+.85,Dn+1.95,Ve+7.4,Ve+8),ps(Tt,qe+.08,D,Ve+.1,.055,$t-D-.3,8);let nm=S=>[(S[0]-b[0])*E[0]+(S[1]-b[1])*E[1],(S[0]-b[0])*R[0]+(S[1]-b[1])*R[1]],E1=S=>{let F=-1e9;for(let $ of t.roads)if(!["footway","path","steps","pedestrian"].includes($.kind))for(let _t=1;_t<$.pts.length;_t++){let Bt=nm($.pts[_t-1]),Vt=nm($.pts[_t]);if((Bt[0]-S)*(Vt[0]-S)>0||Bt[0]===Vt[0])continue;let ie=Bt[1]+(Vt[1]-Bt[1])*(S-Bt[0])/(Vt[0]-Bt[0]);ie>-10&&ie<8&&(F=Math.max(F,ie+$.width/2))}return F},xc=S=>Math.max(H,E1(S)-.3);for(let S=qe;S<U-1e-6;S+=.5){let F=Math.min(U,S+.5),$=xc(S),_t=xc(F);wi(f1,[S,Ti(S),ni],[F,Ti(F),ni],[F,Ti(F),_t],[S,Ti(S),$],[[S/2,ni/2],[F/2,ni/2],[F/2,_t/2],[S/2,$/2]]),wi(Ot,[S,D,$],[F,D,_t],[F,Ti(F),_t],[S,Ti(S),$])}wi(Ot,[U,D,xc(U)],[U,D,ni],[U,Ti(U),ni],[U,Ti(U),xc(U)]);let ol=[44.6,47.2,49.8,52.4,55,57.6],na=ni-5.3,Mi=ol[1];for(let S of ol)wi(Xp,[S-.06,Ti(S)+.02,ni-.05],[S+.06,Ti(S)+.02,ni-.05],[S+.06,Ti(S)+.02,na],[S-.06,Ti(S)+.02,na]);for(let S=ol[0]-.06;S<ol.at(-1)+.06-1e-6;S+=.5){let F=Math.min(ol.at(-1)+.06,S+.5);wi(Xp,[S,Ti(S)+.02,na+.06],[F,Ti(F)+.02,na+.06],[F,Ti(F)+.02,na-.06],[S,Ti(S)+.02,na-.06])}{let S=Mi+1.3,F=.95,$=ni-.4,_t=$-4.7,Bt=Ti(S);vt(Vu,S-F,S+F,Bt+.34,Bt+1,_t,$),vt(Vu,S-F+.04,S+F-.04,Bt+.5,Bt+.98,_t-.02,_t+.3),vt(Gu,S-F+.1,S+F-.1,Bt+1,Bt+1.56,_t+1.45,$-.5),vt(Vu,S-F+.14,S+F-.14,Bt+1.56,Bt+1.64,_t+1.5,$-.55),wi(Gu,[S-F+.1,Bt+1,_t+.85],[S+F-.1,Bt+1,_t+.85],[S+F-.14,Bt+1.56,_t+1.45],[S-F+.14,Bt+1.56,_t+1.45]),vt(Bi,S-F+.2,S+F-.2,Bt+.84,Bt+.88,_t-.03,_t);for(let ie of[S-F+.04,S+F-.04])for(let Ee of[_t+.95,$-.95]){let Ye=new Wi(.37,.37,.26,16);Ye.rotateZ(Math.PI/2),Ye.translate(ie,Bt+.37,-Ee),gi(Ye,Wu)}let Vt=Ti(Mi);vt(Yp,Mi-.3,Mi+.3,Vt+.45,Vt+1.2,ni-.28,ni),vt(Gu,Mi-.1,Mi+.1,Vt+.88,Vt+1.06,ni-.3,ni-.28),vt(g1,Mi-.26,Mi-.22,Vt+.52,Vt+1.1,ni-.3,ni-.28),rl(Tt,[qe,Ti(qe)+.14,ni-.08],[Mi-.3,Vt+.14,ni-.08],.045),rl(Wu,[Mi+.22,Vt+.52,ni-.3],[Mi+.55,Vt+.08,ni-.9],.02),rl(Wu,[Mi+.55,Vt+.08,ni-.9],[S-F,Bt+.8,$-.7],.02)}let bs=ni+.32,yo=ni+.58;vt(ae,qe,U,D,mc,ni,bs,2.4),vt(Q,qe,U,mc,mc+.08,ni-.05,bs),vt(ae,qe,U,mc,Us,bs,yo,2.4),vt(Tt,qe,U,Us,yn+.1,bs,yo,4),vt(Q,qe,U,yn+.1,yn+.18,bs-.04,yo+.04),Er([[38,12.52],[qe,12.52],[qe,yo+.02],[U,yo+.02]],[yn+.1,yn+.1,yn+.1,yn+.1],1.05);{vt(Xt,Mi-1.85,Mi+1.85,Us+.62,Us+1.72,bs-.1,bs),qu(pi(512,176,(S,F,$)=>{S.fillStyle="#141414",S.fillRect(0,0,F,$),S.strokeStyle="#3a3a3a",S.lineWidth=6,S.strokeRect(3,3,F-6,$-6),S.fillStyle="#fbfbf6",S.shadowColor="#ffffff",S.shadowBlur=10,S.font=`120px ${Yu}`,S.textAlign="center",S.textBaseline="middle",S.fillText("\u5C45\u4E4B\u6797",F/2,$/2+6)}),Mi-1.75,Mi+1.75,Us+.67,Us+1.67,bs-.11,{emissive:.9}),vt(Xt,Mi-2.6,Mi+2.6,Us+.1,Us+.5,bs-.06,bs),qu(pi(700,52,(S,F,$)=>{S.fillStyle="#101318",S.fillRect(0,0,F,$),S.fillStyle="#f5f7ff",S.shadowColor="#bcd0ff",S.shadowBlur=6,S.font='700 30px "PingFang SC",sans-serif',S.textBaseline="middle",S.fillText("173 5664 8281",18,$/2+1),S.fillStyle="#3a3e46",S.fillRect(262,6,4,$-12),S.fillStyle="#f5f7ff",S.font='700 32px "PingFang SC",sans-serif',S.fillText("\u9690\u4E8E\u5C71\u6797  \u5F52\u4E8E\u81EA\u7136",290,$/2+1)}),Mi-2.5,Mi+2.5,Us+.13,Us+.47,bs-.07,{emissive:1});for(let S of[Mi-1.9,Mi+1.9])vt(Ls,S-.08,S+.08,Us-.8,Us-.5,bs-.06,bs)}vt(ae,38,qe,D,yn,12.5,zi,3),vt(Tt,38,qe,$t,yn+.1,12.42,12.5,4),vt(Tt,37.92,38,$t,yn+.1,12.5,14.1,4),vt(ae,Ms[0],38,D,yn,15.3,zi,3),vt(Tt,Ms[0],38,$t,yn+.1,15.22,15.3,4),vt(q,Ms[0],38,yn,yn+.03,15.3,zi),vt(q,38,qe,yn,yn+.03,12.5,zi),vt(ae,qe,U,D,yn,yo,zi,3),vt(q,qe,U,yn,yn+.03,yo,zi),Er([[38,14.1],[38,12.52]],[yn+.1,yn+.1],1.05),Er([[Ms[0],15.32],[37.2,15.32]],[yn+.1,yn+.1],1.05),Xs(42.2,yn+.03,13.7,.45),xi(41.5,yn+.03,13.7,jn),xi(42.9,yn+.03,13.7,jn),ps(zn,43.1,yn+.03,14.9,.03,2.2,6),ps(jp,43.1,yn+1.2,14.9,.02,1.1,10,.13);for(let[S,F,$]of[[39,40.8,17.2],[45.4,47.2,19.3]])vt(Yn,S,F,yn+.03,yn+.48,$,$+.45,1);Xs(51.5,yn+.03,15.6,.45),xi(50.8,yn+.03,15.6,jn),xi(52.2,yn+.03,15.6,jn),vt(ge,Ms[0]-.3,38,$t,$t+.05,12.5,15.3);{let S=Math.max(1,Math.ceil((yn-$t)/.16)),F=(yn-$t)/S,$=Vt=>[36.4+1.6*(1-Math.cos(Math.PI*Vt/2)),12+2.35*Math.sin(Math.PI*Vt/2)],_t=[[],[]],Bt=[];for(let Vt=0;Vt<S;Vt++){let ie=$(Vt/S),Ee=$((Vt+1)/S),Ye=$t+(Vt+1)*F,Ge=[(ie[0]+Ee[0])/2,(ie[1]+Ee[1])/2],cn=Math.hypot(Ee[0]-ie[0],Ee[1]-ie[1]),vn=new Ri(1.4,Ye-$t+.3,Math.max(.28,cn));vn.translate(0,-(Ye-$t+.3)/2,0),vn.rotateY(Math.atan2(Ee[0]-ie[0],-(Ee[1]-ie[1]))),vn.translate(Ge[0],Ye,-Ge[1]),gi(vn,Pe);let Sn=new Ri(1.36,.035,.03);Sn.rotateY(Math.atan2(Ee[0]-ie[0],-(Ee[1]-ie[1]))),Sn.translate(ie[0],Ye-.06,-ie[1]),gi(Sn,Bi);let Un=-(Ee[1]-ie[1])/cn,On=(Ee[0]-ie[0])/cn;for(let bi of[0,1])_t[bi].push([Ge[0]+(bi?1:-1)*.72*Un,Ge[1]+(bi?1:-1)*.72*On]);Bt.push(Ye)}for(let Vt of[0,1])Er(_t[Vt],Bt.map(ie=>ie+.05),1)}for(let[S,F,$]of[[35.55,13,.7],[35.75,14.2,.9],[36.2,15,.55]])Hi(v1,S,$t+$*.5,F,$,$*.7,$*.8);vt(M1,Ms[0]-.3,36.2,$t+.05,$t+.08,12.6,15.2),ps(wn,35.5,$t,14.8,.06,1.6,6),Hi(rn,35.5,$t+1.9,14.8,.55,.6,.5);{let S=Math.max(1,Math.ceil((Fe-yn)/.165)),F=(Fe-yn)/S,$=.28,_t=Ms[0]+S*$;for(let Bt=0;Bt<S;Bt++){let Vt=_t-Bt*$,ie=Vt-$,Ee=yn+(Bt+1)*F;vt(Pe,ie,Vt,yn,Ee,18.45,zi-.02,1),vt(Bi,ie-.01,ie+.01,Ee-.07,Ee-.04,18.47,zi-.05)}Er([[_t,18.43],[Ms[0],18.43]],[yn+.05,Fe+.05],1)}vt(he,Ms[0],U,D,Fe,zi,W,3),vt(q,Ms[0],U,Fe,Fe+.03,zi,W),ea(Ms[0],zi+.02,U,zi+.02,Fe,1.05),Vr(37.5,43.9,Fe,zi+.4,zi+1.3),Vr(47.7,56,Fe,zi+.4,zi+1.3),Gr(45.5,yn+2.6,zi-.03,.22,.4);{let $=Ui(1771),_t=17,Bt=Fe;ps(he,45.8,Bt,21.3,1.1,.35,20),rl($p,[45.8,Bt,21.3],[45.8+.35,Bt+_t*.86,21.3-.25],.55,.16);let Vt=[[4.8,5.4],[6.6,6],[8.4,5.6],[10.2,4.9],[11.9,4.1],[13.5,3.1],[15,2.1],[16.3,1.1]],ie=[];for(let[Ge,cn]of Vt){let vn=Math.max(3,Math.round(cn*1.7)),Sn=45.8+Ge*.02,Un=21.3-Ge*.015;for(let On=0;On<vn*2;On++){let bi=On/(vn*2)*Math.PI*2+$()*.9,Ss=cn*(.25+.6*$()),Es=Sn+Math.cos(bi)*Ss,Os=Un+Math.sin(bi)*Ss*.9,Xr=Bt+Ge+($()-.3)*.9,ns=cn*(.22+.16*$())+.55;Hi($()<.35?x1:Zp,Es,Xr,Os,ns,.75+.55*$(),ns*(.85+.3*$())),$()<.5&&Hi(y1,Es+($()-.5)*.8,Xr+.55,Os+($()-.5)*.8,ns*.6,.45+.3*$(),ns*.55),Ge<12&&On%2&&rl($p,[Sn,Xr-.3,Un],[Sn+(Es-Sn)*.8,Xr-.1,Un+(Os-Un)*.8],.12,.06),Ge<9&&On%2&&ie.push([Es-Math.cos(bi)*.6,Xr-.55,Os-Math.sin(bi)*.6])}Hi(Zp,Sn,Bt+Ge+.35,Un,cn*.4,.8,cn*.4)}let Ee=[Kp,Qp,S1,Kp,Qp];for(let[Ge,cn,vn]of ie)for(let Sn=0,Un=3+Math.floor($()*3);Sn<Un;Sn++){let On=.24+.06*$();Hi(Ee[Math.floor($()*Ee.length)],Ge,cn-.35-Sn*.62,vn,On,On*.88,On)}let Ye=new Ke(new vs(.5,2.2),Xu(pi(96,420,(Ge,cn,vn)=>{Ge.fillStyle="#f3efe6",Ge.fillRect(0,0,cn,vn),Ge.fillStyle="#1b1b1b",Ge.font=`62px ${Yu}`,Ge.textAlign="center",Ge.textBaseline="middle",[..."\u65E0\u4E8B\u5C0F\u795E\u4ED9"].forEach((Sn,Un)=>Ge.fillText(Sn,cn/2,48+Un*80))})));Ye.position.set(45.8+2.3,Bt+3.4,-(21.3-2.4)),Ye.rotation.y=1.2,J.add(Ye)}vt(ln,13.5,27,Fe,Fe+.45,W-1.3,W-.25);for(let S=13.8;S<26.8;S+=.62)Hi(Ws,S,Fe+.95,W-.78,.42,.55,.42);for(let S of[16,16.9,17.8,18.7])xi(S,Fe+.03,W-2.1,jn);vt(Dt,5,27,Fe,12.6,W-.22,W,1),vt(Xt,5,27,12.6,12.72,W-.3,W);for(let S=6.5;S<27;S+=3)Gr(S,10.7,W-.25,.22,.42);let im={left:S=>S<1?k(0):S<tn[1]+An?$t:Fe,right:S=>S<ni?Ti(U):S<zi?yn:Fe,back:()=>Fe},Zu=(S,F,$,_t)=>{for(let Bt=1;Bt<F.length;Bt++){let[Vt,ie]=[F[Bt-1],F[Bt]],Ee=$(Vt),Ye=$(ie),Ge=Z(Vt[0],Vt[1]),cn=Z(ie[0],ie[1]);if(Math.max(Ge-Ee,cn-Ye)<.05)continue;let vn=[Vt[0],Math.min(Ee,Ge)-.3,Vt[1]],Sn=[ie[0],Math.min(Ye,cn)-.3,ie[1]],Un=[ie[0],Math.max(Ye,cn)+.15,ie[1]],On=[Vt[0],Math.max(Ee,Ge)+.15,Vt[1]],bi=Math.hypot(ie[0]-Vt[0],ie[1]-Vt[1]),Ss=[[0,vn[1]/3],[bi/3,Sn[1]/3],[bi/3,Un[1]/3],[0,On[1]/3]];_t>0?wi(S,vn,Sn,Un,On,Ss):wi(S,Sn,vn,On,Un,Ss);let Es=-(ie[1]-Vt[1])/bi*.2,Os=(ie[0]-Vt[0])/bi*.2;wi(Q,[Vt[0]-Es,On[1],Vt[1]-Os],[ie[0]-Es,Un[1],ie[1]-Os],[ie[0]+Es,Un[1],ie[1]+Os],[Vt[0]+Es,On[1],Vt[1]+Os])}},Ju=(S,F,$=Math.ceil(Math.hypot(F[0]-S[0],F[1]-S[1])/1.25))=>[...Array($+1)].map((_t,Bt)=>[S[0]+(F[0]-S[0])*Bt/$,S[1]+(F[1]-S[1])*Bt/$]);Zu(he,Ju([0,H],[0,W]),S=>im.left(S[1]),1),Zu(ae,Ju([U,H],[U,W]),S=>im.right(S[1]),-1),Zu(he,Ju([0,W],[U,W]),()=>Fe,1);for(let[S,F]of Sr){let $=0;for(let Ge of F)$+=Ge.attributes.position.count;let _t=new Float32Array($*3),Bt=new Float32Array($*3),Vt=new Float32Array($*2),ie=0;for(let Ge of F)_t.set(Ge.attributes.position.array,ie*3),Bt.set(Ge.attributes.normal.array,ie*3),Ge.attributes.uv&&Vt.set(Ge.attributes.uv.array,ie*2),ie+=Ge.attributes.position.count;let Ee=new Ln;Ee.setAttribute("position",new Zn(_t,3)),Ee.setAttribute("normal",new Zn(Bt,3)),Ee.setAttribute("uv",new Zn(Vt,2)),Ee.computeBoundingSphere();let Ye=new Ke(Ee,S);Ye.castShadow=!S.transparent&&S!==Bi&&S!==Ls,Ye.receiveShadow=!S.transparent,J.add(Ye)}{let S=new Pn,F=Be({color:"#c3302a",emissive:"#8f160f",emissiveIntensity:.55,roughness:.35}),$=new Ke(new Xi(1.5,24,16),F),_t=new Ke(new ro(1.32,3.2,24),F),Bt=new Ke(new Xi(.62,16,12),Be({color:"#fff4dc",emissive:"#ffe3a8",emissiveIntensity:.6}));_t.rotation.x=Math.PI,_t.position.y=1.6,$.position.y=3.9,Bt.position.set(0,3.9,1.2),S.add(_t,$,Bt);let Vt=j(25,11);S.position.set(Vt[0],Y+15.5,Vt[1]),S.userData={base:Y+15.5,head:5.4},Rt.add(S),co=S}Mr.set(m.n,Y+15.5+5.4),m.modelNote="\u4E09\u7EF4\u6A21\u578B\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u548C\u822A\u62CD\u56FE\u5EFA\u9020\uFF1A\u4E00\u5C42\u767D\u8272\u8F6C\u89D2\u623F\u3001\u4E94\u95F4\u5E26\u77F3\u5899\u5C0F\u9662\u7684\u5BA2\u623F\u3001\u706F\u5149\u76F4\u68AF\u4E0E\u73BB\u7483\u95E8\u5927\u5802\uFF1B\u4E1C\u5934\u8336\u5BA4\u4E34\u8DEF\u4E00\u9762\u4E3A\u77F3\u6750\u52D2\u811A\u3001\u6728\u9970\u9762\u548C\u6728\u6846\u5927\u7A97\uFF0C\u5165\u6237\u77F3\u9636\u6CBF\u8336\u5BA4\u5411\u897F\u4E0A\u5230\u524D\u9662\uFF0C\u5916\u4FA7\u662F\u5927\u5757\u82B1\u5C97\u5CA9\u6321\u5899\u548C\u5C0F\u77F3\u50E7\u50CF\uFF1B\u8336\u5BA4\u4E1C\u5C71\u5899\u767D\u5899\u6DF1\u84DD\u52D2\u811A\uFF0C\u6302\u201C\u5C45\u4E4B\u6797\u201D\u7AD6\u533E\uFF0C\u9762\u671D\u505C\u8F66\u573A\uFF1B\u505C\u8F66\u573A\u671D\u5357\uFF0C\u4E00\u6392\u8F66\u4F4D\u5782\u76F4\u4E8E\u5317\u4FA7\u4E24\u7EA7\u6BDB\u77F3\u6321\u5899\uFF0C\u8F66\u5934\u671D\u5357\uFF0C\u5145\u7535\u6869\u6302\u5728\u6321\u5899\u4E0A\u3001\u6B63\u4E0A\u65B9\u662F\u53D1\u5149\u62DB\u724C\u201C\u5C45\u4E4B\u6797\u201D\u548C\u201C173 5664 8281\u3000\u9690\u4E8E\u5C71\u6797 \u5F52\u4E8E\u81EA\u7136\u201D\uFF1B\u6321\u5899\u4E0A\u65B9\u662F\u6709\u684C\u6905\u7684\u5E73\u53F0\uFF0C\u7531\u4E8C\u5C42\u6728\u5E73\u53F0\u7ECF\u5F27\u5F62\u706F\u5149\u697C\u68AF\u4E0A\u53BB\uFF0C\u518D\u6CBF\u77F3\u5899\u76F4\u68AF\u4E0A\u5230\u4E09\u5C42\uFF0C\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u957F\u5728\u4E09\u5C42\uFF1B\u4E8C\u5C42\u7EA2\u9676\u74E6\u5761\u9876\u5BA2\u623F\u548C\u5E73\u9876\u767D\u8272\u697C\uFF0C\u524D\u6709\u7F57\u6C49\u677E\u3001\u767D\u8272\u82B1\u6C60\u3001\u783E\u77F3\u6C40\u6B65\u4E0E\u6728\u5E73\u53F0\uFF1B\u4E09\u5C42\u5C4B\u9876\u9732\u53F0\u6709\u74E6\u5C4B\u9762\u4E0A\u7684\u6728\u8D28\u9636\u68AF\u5EA7\u3001\u6C34\u666F\u6C60\u548C\u6728\u683C\u6805\u6321\u5899\u58C1\u706F\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002"}}{let c=t.buildings.find(m=>m.osmId===541482372);if(c){let m=ar(...c.rectCenter,"\u767E\u5C81\u5BAB");m.position.y=c.base,m.rotation.y=Math.atan2(-c.axis[1],c.axis[0]);let _=c.width,b=c.depth,E=new G,R=[[-_/2-1,-b/2-1],[_/2+1,-b/2-1],[_/2+1,b/2+1],[-_/2-1,b/2+1]],U=[[-_*.14,-b*.2],[_*.14,-b*.2],[_*.14,b*.2],[-_*.14,b*.2]],W=R.map((k,Z)=>[(k[0]+U[Z][0])*.5,(k[1]+U[Z][1])*.5]),H=(k,Z)=>[k[0],Z,k[1]],D=c.wallHeight+.4,j=D+3.1;for(let k=0;k<4;k++){let Z=(k+1)%4;E.quad(H(R[k],D),H(R[Z],D),H(W[Z],j),H(W[k],j)),E.quad(H(W[k],j),H(W[Z],j),H(U[Z],D),H(U[k],D)),nn(m,[H(W[k],j+.08),H(W[Z],j+.08)],"#4e564c")}E.mesh(lt("#7b8da2",{map:Pt,side:mn}),m);let Y=new G;for(let k=0;k<4;k++){let Z=(k+1)%4;Y.quad(H(U[k],D-4),H(U[Z],D-4),H(U[Z],D),H(U[k],D),"#c7c4b4")}Y.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),m),qt(m,0,D-4,0,_*.28,.15,b*.4,be);for(let k of[-1,1])for(let Z=1;Z<5;Z++)qt(m,0,Z*3,k*(b/2+.24),_,.2,.6,be)}}function cx(c,{double:m=!1,roofCol:_="#f0b52e",wallCol:b="#f2b33a"}={}){let E=ar(...c.rectCenter,c.precinct||c.name||"\u5BFA\u9662");E.position.y=c.base,E.rotation.y=Math.atan2(-c.axis[1],c.axis[0]);let R=Math.cos(E.rotation.y),U=Math.sin(E.rotation.y),W=(Dt,ae)=>[c.rectCenter[0]+Dt*R+ae*U,c.rectCenter[1]-Dt*U+ae*R],H=c.width/2,D=c.depth/2,j=Math.max(c.wallHeight,m?11:7.5),Y=new G,k=new G,Z=new G,J=new G,at=0;for(let[Dt,ae]of[[-H,-D],[H,-D],[H,D],[-H,D],[0,D],[0,-D]])at=Math.min(at,v(...W(Dt*1.1,ae*1.1))-c.base);let pt=.9;bn(Y,-H-.6,H+.6,at-.5,pt,-D-.6,D+.6,"#d8d0bc"),bn(Y,-H-.75,H+.75,pt-.12,pt+.05,-D-.75,D+.75,"#c4bba5");for(let Dt=0;Dt<4;Dt++)bn(Y,-3.2,3.2,at-.5,pt-Dt*.22,D+.6+Dt*.38,D+.98+Dt*.38,"#d2cab5");let Ut=1.9,xt=H-Ut,Ht=D-Ut,kt=m?j*.56:j*.86;bn(k,-xt,xt,pt,kt,-Ht,Ht,b);let bt="#b8332a",N=(Dt,ae,he,se)=>bn(k,Dt-.28,Dt+.28,he,se,ae-.28,ae+.28,bt),ot=Math.max(2,Math.round(2*H/3.4)),mt=Math.max(2,Math.round(2*D/3.4));for(let Dt=0;Dt<=ot;Dt++){let ae=-H+.5+Dt*(2*H-1)/ot;N(ae,-D+.5,pt,kt),N(ae,D-.5,pt,kt)}for(let Dt=1;Dt<mt;Dt++){let ae=-D+.5+Dt*(2*D-1)/mt;N(-H+.5,ae,pt,kt),N(H-.5,ae,pt,kt)}let st=(Dt,ae,he,se,ee)=>{bn(J,Dt,ae,ee-.75,ee,he,se,"#2f6f6c"),bn(J,Dt-.01,ae+.01,ee-.85,ee-.75,he-.01,se+.01,"#e2b64a")};st(-H+.2,H-.2,-D+.2,-D+.75,kt),st(-H+.2,H-.2,D-.75,D-.2,kt),st(-H+.2,-H+.75,-D+.2,D-.2,kt),st(H-.75,H-.2,-D+.2,D-.2,kt);let ht=Math.max(3,Math.min(7,Math.round(2*xt/3.4)|1)),ut=2*xt/ht;for(let Dt=0;Dt<ht;Dt++){let ae=-xt+Dt*ut+.25,he=-xt+(Dt+1)*ut-.25;bn(J,ae,he,pt+.1,Math.min(kt-1,pt+4.2),Ht,Ht+.08,"#8e2a20");for(let se=1;se<4;se++){let ee=pt+.1+se*(Math.min(kt-1,pt+4.2)-pt-.1)/4;bn(J,ae,he,ee-.04,ee+.04,Ht+.08,Ht+.12,"#d9ad4c")}bn(J,(ae+he)/2-.04,(ae+he)/2+.04,pt+.1,Math.min(kt-1,pt+4.2),Ht+.08,Ht+.12,"#d9ad4c")}function it(Dt,ae,he,se,ee,ge=1.5){let q=he+se*.48,St=he+se,wt=Math.max(1,Dt-ae*.62),Ot=ae*.5,Q=10,Nt=Xt=>ge*Math.pow(Xt,3),xe=(Xt,Pe)=>[Xt,he+Nt(Math.max(Math.abs(Xt)/Dt,Math.abs(Pe)/ae)),Pe];for(let Xt of[-1,1])for(let Pe=0;Pe<Q;Pe++){let ln=-1+2*Pe/Q,rn=-1+2*(Pe+1)/Q;Z.quad(xe(ln*Dt,Xt*ae),xe(rn*Dt,Xt*ae),[rn*wt,q,Xt*Ot],[ln*wt,q,Xt*Ot],ee)}for(let Xt of[-1,1])for(let Pe=0;Pe<Q;Pe++){let ln=-1+2*Pe/Q,rn=-1+2*(Pe+1)/Q;Z.quad(xe(Xt*Dt,ln*ae),xe(Xt*Dt,rn*ae),[Xt*wt,q,rn*Ot],[Xt*wt,q,ln*Ot],ee)}for(let Xt of[-1,1])Z.quad([-wt,q,Xt*Ot],[wt,q,Xt*Ot],[wt+.15,St,0],[-wt-.15,St,0],ee);for(let Xt of[-1,1])k.tri([Xt*wt,q,-Ot],[Xt*wt,q,Ot],[Xt*wt,St,0],bt);bn(J,-wt-.4,wt+.4,St-.15,St+.55,-.32,.32,ka(ee,-.18));for(let Xt of[-1,1])bn(J,Xt*(wt+.1)-.35,Xt*(wt+.1)+.35,St,St+1.7,-.3,.3,"#c9952e"),bn(J,Xt*(wt+.1)-(Xt>0?.9:-.5),Xt*(wt+.1)+(Xt>0?-.5:.9),St+1.2,St+1.7,-.26,.26,"#c9952e");for(let[Xt,Pe]of[[-1,-1],[1,-1],[1,1],[-1,1]])bn(J,Xt*Dt-.18,Xt*Dt+.18,he+ge-.05,he+ge+.45,Pe*ae-.18,Pe*ae+.18,ka(ee,-.22))}let Tt=_,Ce=Math.max(c.roofRise||0,D*.55,3.5);if(m){let Dt=xt-.2,ae=Ht-.2;bn(k,-Dt,Dt,kt,j,-ae,ae,b);for(let Ot=0;Ot<=ot;Ot++){let Q=-Dt+Ot*2*Dt/ot;bn(k,Q-.22,Q+.22,kt+1.4,j,ae,ae+.06,bt),bn(k,Q-.22,Q+.22,kt+1.4,j,-ae-.06,-ae,bt)}let he=H+1.3,se=D+1.3,ee=kt+.2,ge=ee+1.9,q=10,St=Ot=>1.1*Math.pow(Ot,3),wt=(Ot,Q)=>[Ot,ee+St(Math.max(Math.abs(Ot)/he,Math.abs(Q)/se)),Q];for(let Ot of[-1,1])for(let Q=0;Q<q;Q++){let Nt=-1+2*Q/q,xe=-1+2*(Q+1)/q;Z.quad(wt(Nt*he,Ot*se),wt(xe*he,Ot*se),[xe*Dt,ge,Ot*ae],[Nt*Dt,ge,Ot*ae],Tt)}for(let Ot of[-1,1])for(let Q=0;Q<q;Q++){let Nt=-1+2*Q/q,xe=-1+2*(Q+1)/q;Z.quad(wt(Ot*he,Nt*se),wt(Ot*he,xe*se),[Ot*Dt,ge,xe*ae],[Ot*Dt,ge,Nt*ae],Tt)}st(-Dt,Dt,ae,ae+.1,j),st(-Dt,Dt,-ae-.1,-ae,j),it(Dt+1.6,ae+1.6,j,Ce,Tt,1.6)}else it(H+1.4,D+1.4,kt+.15,Ce,Tt,1.5);Y.mesh(lt("#ffffff",{vertexColors:!0}),E),k.mesh(lt("#ffffff",{vertexColors:!0,map:Ft,side:mn}),E),Z.mesh(lt("#ffffff",{vertexColors:!0,map:Pt,side:mn}),E),J.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),E)}for(let c of qn){let m=t.buildings.find(_=>_.osmId===c);if(m){let _=m.ring,b=m.base-.4,E=3.9,R=m.base+E,U=new G,W=new G,H=0;_.forEach((ht,ut)=>{let it=_[(ut+1)%_.length];H+=ht[0]*it[1]-it[0]*ht[1]});for(let ht=0;ht<_.length;ht++){let ut=_[ht],it=_[(ht+1)%_.length],Tt=Math.hypot(it[0]-ut[0],it[1]-ut[1]);U.quad([ut[0],b,ut[1]],[it[0],b,it[1]],[it[0],R,it[1]],[ut[0],R,ut[1]],"#f6f7f5",[[0,b/.6],[Tt/.6,b/.6],[Tt/.6,R/.6],[0,R/.6]]);let Ce=(H>0?1:-1)*(it[1]-ut[1])/Tt*.03,Dt=(H>0?-1:1)*(it[0]-ut[0])/Tt*.03;U.quad([ut[0]+Ce,b,ut[1]+Dt],[it[0]+Ce,b,it[1]+Dt],[it[0]+Ce,m.base+1.1,it[1]+Dt],[ut[0]+Ce,m.base+1.1,ut[1]+Dt],"#9aa2a6",[[0,0],[Tt/.6,0],[Tt/.6,1.5/.6],[0,1.5/.6]]);let ae=Ce*12,he=Dt*12;W.quad([ut[0]+ae,R,ut[1]+he],[it[0]+ae,R,it[1]+he],[it[0]+ae,R+.45,it[1]+he],[ut[0]+ae,R+.45,ut[1]+he],"#6f7a80")}let D=new G;for(let ht of Qs.triangulateShape(_.map(ut=>new de(ut[0],ut[1])),[]))D.tri(...ht.map(ut=>[_[ut][0],R+.3,_[ut][1]]),"#b9bec0");let j=_[m.front],Y=_[(m.front+1)%_.length],k=Math.hypot(Y[0]-j[0],Y[1]-j[1]),Z=(Y[0]-j[0])/k,J=(Y[1]-j[1])/k,at=(H>0?1:-1)*J,pt=(H>0?-1:1)*Z,Ut=document.createElement("canvas");Ut.width=1024,Ut.height=256;let xt=Ut.getContext("2d");xt.fillStyle="#1f5fae",xt.fillRect(0,0,1024,128),xt.fillStyle="#fff",xt.font='bold 84px "PingFang SC","Noto Sans SC",sans-serif',xt.textAlign="center",xt.textBaseline="middle",xt.fillText("\u516C\u5171\u5395\u6240  WC",512,68);let Ht=(ht,ut,it)=>{xt.fillStyle=ut,xt.fillRect(ht,128,128,128),xt.fillStyle="#fff",xt.beginPath(),xt.arc(ht+64,158,14,0,7),xt.fill(),it?(xt.beginPath(),xt.moveTo(ht+64,174),xt.lineTo(ht+92,224),xt.lineTo(ht+36,224),xt.fill(),xt.fillRect(ht+52,224,8,22),xt.fillRect(ht+68,224,8,22)):(xt.fillRect(ht+48,174,32,46),xt.fillRect(ht+50,220,11,28),xt.fillRect(ht+67,220,11,28))};Ht(0,"#1f5fae",!1),Ht(128,"#d0342c",!0),xt.font='bold 92px "PingFang SC",sans-serif',xt.fillStyle="#1f5fae",xt.fillText("\u7537",320,194),xt.fillStyle="#d0342c",xt.fillText("\u5973",448,194);let kt=new as(Ut);kt.colorSpace=kn,kt.anisotropy=8;let bt=new G,N=(ht,ut,it,Tt,Ce,Dt,ae,he)=>{let se=j[0]+Z*ut+at*Dt,ee=j[1]+J*ut+pt*Dt;ht.quad([se-Z*Tt/2,it,ee-J*Tt/2],[se+Z*Tt/2,it,ee+J*Tt/2],[se+Z*Tt/2,it+Ce,ee+J*Tt/2],[se-Z*Tt/2,it+Ce,ee-J*Tt/2],ae,he)},ot=Math.min(k*.7,7.5);N(bt,k/2,m.base+2.75,ot,ot/8,.08,"#ffffff",[[0,.5],[1,.5],[1,1],[0,1]]);for(let[ht,ut]of[[0,.27],[1,.73]]){let it=k*ut;N(W,it,m.base,1.5,2.35,.06,"#2f3a40"),N(W,it,m.base,1.7,.12,.07,"#e9ece9"),N(W,it-.85,m.base,.12,2.47,.07,"#e9ece9"),N(W,it+.85,m.base,.12,2.47,.07,"#e9ece9"),N(bt,it+(ht?-1.35:1.35),m.base+1.45,.62,.62,.09,"#ffffff",[[ht*.125,0],[ht*.125+.125,0],[ht*.125+.125,.5],[ht*.125,.5]])}N(bt,k*.27,m.base+2.42,.5,.25,.09,"#ffffff",[[.25,.08],[.375,.08],[.375,.42],[.25,.42]]),N(bt,k*.73,m.base+2.42,.5,.25,.09,"#ffffff",[[.375,.08],[.5,.08],[.5,.42],[.375,.42]]);let mt=(()=>{let ht=document.createElement("canvas");ht.width=ht.height=64;let ut=ht.getContext("2d");ut.fillStyle="#fff",ut.fillRect(0,0,64,64),ut.fillStyle="#c9cfd2",ut.fillRect(0,0,64,3),ut.fillRect(0,0,3,64);let it=new as(ht);return it.wrapS=it.wrapT=so,it.colorSpace=kn,it})(),st=new Pn;st.userData.placeId=ll(Object.keys(ir).find(ht=>ir[ht]===c)),Yt.add(st),an.push(st),U.mesh(lt("#ffffff",{vertexColors:!0,map:mt,side:mn}),st),W.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),st),D.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),st),bt.mesh(new os({map:kt,toneMapped:!1,side:mn,polygonOffset:!0,polygonOffsetFactor:-2}),st)}}{let _=mi(-1372,-25),b=new Pn;b.position.set(-1372,_,-25),b.rotation.y=Math.atan2(10,-37),b.userData.placeId=ll("\u864E\u5F62\u5C71\u8F66\u7AD9"),Yt.add(b),an.push(b);let E=3,R=2.2,U=3.3,W=lt("#f6f4ee"),H=lt("#2a62c9"),D=lt("#33424a");qt(b,0,-.6,0,E*2+.6,.6,R*2+.6,lt("#c9c3b3")),qt(b,0,0,0,E*2,U,R*2,W),qt(b,0,U,0,E*2+.8,.35,R*2+.8,lt("#d8dcdc")),qt(b,0,U-.9,R+.03,E*2+.1,.75,.12,H),qt(b,-.9,.95,R+.02,1.6,1.15,.08,lt("#7fa4b5")),qt(b,-.9,.9,R+.2,1.9,.08,.4,D),qt(b,1.25,0,R+.02,1,2.2,.08,D);let j=document.createElement("canvas");j.width=512,j.height=96;let Y=j.getContext("2d");Y.fillStyle="#2a62c9",Y.fillRect(0,0,512,96),Y.fillStyle="#fff",Y.font='bold 64px "PingFang SC","Noto Sans SC",sans-serif',Y.textAlign="center",Y.textBaseline="middle",Y.fillText("\u552E \u7968 \u5904",256,52);let k=new as(j);k.colorSpace=kn;let Z=new Ke(new vs(E*2-.4,.62),new os({map:k,toneMapped:!1}));Z.position.set(0,U-.52,R+.1),b.add(Z)}for(let c of _n){let m=c.area>=600,_=c.osmId===609990009?"#D9A93A":c.roofColor;cx(c,{double:m,roofCol:z[_]||_,wallCol:gt[c.wallColor]||c.wallColor||"#f2b33a"})}{let c=t.buildings.find(m=>m.name==="\u4E07\u4F5B\u5854");if(c){let m=ar(...c.center,"\u4E07\u4F5B\u5854");m.position.y=c.base;for(let _=0;_<7;_++){let b=6.2-_*.51;we(m,0,_*4.3,0,b,3.5,I);let E=new ro(b+1.4,1.4,8),R=new Ke(E,I);R.position.y=_*4.3+4,m.add(R)}we(m,0,30,0,.36,3,I)}}function hx(c,m=2){let _=c;for(let b=0;b<m&&_.length>2;b++){let E=[_[0]];for(let R=1;R<_.length;R++){let U=_[R-1],W=_[R];E.push([U[0]*.75+W[0]*.25,U[1]*.75+W[1]*.25],[U[0]*.25+W[0]*.75,U[1]*.25+W[1]*.75])}E.push(_.at(-1)),_=E}return _}function ux(c,m){let _=0,b=[];for(let H=1;H<c.length;H++){let D=Math.hypot(c[H][0]-c[H-1][0],c[H][1]-c[H-1][1]);b.push(D),_+=D}let E=Math.max(1,Math.round(_/m)),R=[c[0]],U=0,W=0;for(let H=1;H<E;H++){let D=_*H/E;for(;U<b.length-1&&W+b[U]<D;)W+=b[U],U++;let j=b[U]?(D-W)/b[U]:0,Y=c[U],k=c[U+1];R.push([Y[0]+(k[0]-Y[0])*j,Y[1]+(k[1]-Y[1])*j])}return R.push(c.at(-1)),R}let Vl=new Map,Gl=8,fx=(c,m)=>Math.floor(c/Gl)+","+Math.floor(m/Gl);function ho(c,m,_,b=-1,E=!1){let R=null,U=_,W=Math.floor(c/Gl),H=Math.floor(m/Gl);for(let D=-1;D<=1;D++)for(let j=-1;j<=1;j++)for(let Y of Vl.get(W+D+","+(H+j))||[]){if(Y[7]===b)continue;let k=Y[2]-Y[0],Z=Y[3]-Y[1],J=k*k+Z*Z||1,at=Xn(((c-Y[0])*k+(m-Y[1])*Z)/J,0,1),pt=Y[0]+k*at,Ut=Y[1]+Z*at,xt=Math.hypot(c-pt,m-Ut);xt<U&&(E||xt<Y[6])&&(U=xt,R=[pt,Ut,Y[4]+(Y[5]-Y[4])*at,Y[6],Y[7]])}return R}let lu=0,$d=[],Zd=[],dx=(c,m)=>[(c+e/2)/e,1-(m+n/2)/n];function Jd(c,m,_,b,E=null,{lift:R=.15,step:U=3,smooth:W=!0,level:H=!0,shoulder:D=2,bridge:j=!1}={}){let Y=ux(W?hx(c):c,U).filter((N,ot,mt)=>!ot||Math.hypot(N[0]-mt[ot-1][0],N[1]-mt[ot-1][1])>.05);if(Y.length<2)return Y;let k=m/2,Z=E?Math.min(.6,m*.2):0,J=Y.length,at=Y.map(N=>mi(N[0],N[1]));if(j){let N=ut=>ho(Y[ut][0],Y[ut][1],8)?.[2]??at[ut],ot=N(0),mt=N(J-1),st=0,ht=[0];for(let ut=1;ut<J;ut++)ht.push(st+=Math.hypot(Y[ut][0]-Y[ut-1][0],Y[ut][1]-Y[ut-1][1]));at=ht.map(ut=>ot+(mt-ot)*ut/(st||1))}else if(H){let N=Math.max(1,Math.round(8/U));at=at.map((st,ht)=>{let ut=0,it=0;for(let Tt=Math.max(0,ht-N);Tt<=Math.min(J-1,ht+N);Tt++)ut+=at[Tt],it++;return ut/it});let ot=[0];for(let st=1;st<J;st++)ot.push(ot[st-1]+Math.hypot(Y[st][0]-Y[st-1][0],Y[st][1]-Y[st-1][1]));let mt=Y.map((st,ht)=>{let ut=ht===0||ht===J-1,it=ut?ho(st[0],st[1],k+3,-1,!0):ho(st[0],st[1],k+2);return it&&(ut||it[3]>=k+.2)?it[2]:null});for(let st of Zd){let ht=-1,ut=k+1.5;for(let it=0;it<J;it++){let Tt=Math.hypot(Y[it][0]-st[0],Y[it][1]-st[1]);Tt<ut&&(ut=Tt,ht=it)}ht>=0&&mt[ht]==null&&(mt[ht]=st[2])}at=at.map((st,ht)=>{if(mt[ht]!=null)return mt[ht];let ut=null,it=15;for(let Dt=0;Dt<J;Dt++)mt[Dt]!=null&&Math.abs(ot[Dt]-ot[ht])<it&&(it=Math.abs(ot[Dt]-ot[ht]),ut=mt[Dt]);if(ut==null)return st;let Tt=it/15,Ce=Tt*Tt*(3-2*Tt);return ut+(st-ut)*Ce})}let pt=Y.map((N,ot)=>{let mt=Y[Math.max(0,ot-1)],st=Y[Math.min(J-1,ot+1)],ht=Math.hypot(st[0]-mt[0],st[1]-mt[1])||1;return[(st[0]-mt[0])/ht,(st[1]-mt[1])/ht]}),Ut=new Map,xt=N=>{if(!Ut.has(N)){let ot,mt;Ut.set(N,Y.map((st,ht)=>{let ut=st[0]-pt[ht][1]*N,it=st[1]+pt[ht][0]*N;return ht&&(ut-ot)*pt[ht][0]+(it-mt)*pt[ht][1]<=0&&(ut=ot,it=mt),ot=ut,mt=it,[ut,it]}))}return Ut.get(N)},Ht=(N,ot,mt)=>{let[st,ht]=xt(ot)[N];return[st,H?mt:mi(st,ht)+mt-at[N],ht]},kt=N=>at[N]+R,bt=N=>at[N]+R-.04;for(let N=1;N<J;N++)Z&&(_.edge.quad(Ht(N-1,-k,bt(N-1)),Ht(N,-k,bt(N)),Ht(N,-k+Z,bt(N)),Ht(N-1,-k+Z,bt(N-1)),E),_.edge.quad(Ht(N-1,k-Z,bt(N-1)),Ht(N,k-Z,bt(N)),Ht(N,k,bt(N)),Ht(N-1,k,bt(N-1)),E)),_.fill.quad(Ht(N-1,-k+Z,kt(N-1)),Ht(N,-k+Z,kt(N)),Ht(N,k-Z,kt(N)),Ht(N-1,k-Z,kt(N-1)),b);for(let[N,ot]of[[0,-1],[J-1,1]]){let mt=Y[N],st=Math.atan2(pt[N][1],pt[N][0]),ht=(ut,it,Tt)=>[mt[0]+Math.cos(ut)*it*ot,Tt,mt[1]+Math.sin(ut)*it*ot];for(let ut=0;ut<8;ut++){let it=st-Math.PI/2+Math.PI*ut/8,Tt=st-Math.PI/2+Math.PI*(ut+1)/8;_.fill.tri([mt[0],kt(N),mt[1]],ht(it,k-Z,kt(N)),ht(Tt,k-Z,kt(N)),b),Z&&_.edge.quad(ht(it,k-Z,bt(N)),ht(Tt,k-Z,bt(N)),ht(Tt,k,bt(N)),ht(it,k,bt(N)),E)}}if(j)for(let N of[-1,1])for(let ot=1;ot<J;ot++)_.edge.quad(Ht(ot-1,N*k,bt(ot-1)),Ht(ot,N*k,bt(ot)),Ht(ot,N*k,bt(ot)-1),Ht(ot-1,N*k,bt(ot-1)-1),"#cfc8b6");if(H&&_.skirt&&!j){$d.push({s:Y,h:at,dir:pt,w:k,shoulder:D,lift:R,id:lu,L:_,off:xt}),Zd.push([Y[0][0],Y[0][1],at[0]],[Y[J-1][0],Y[J-1][1],at[J-1]]),hn.lineCap=hn.lineJoin="round",hn.strokeStyle="#fff",hn.lineWidth=(m+D*1.1)/e*Oe,hn.beginPath(),Y.forEach((N,ot)=>{let mt=(N[0]+e/2)/e*Oe,st=(N[1]+n/2)/n*Oe;ot?hn.lineTo(mt,st):hn.moveTo(mt,st)}),hn.stroke();for(let N=1;N<J;N++){let ot=[Y[N-1][0],Y[N-1][1],Y[N][0],Y[N][1],at[N-1],at[N],k,lu],mt=new Set;for(let st of[0,.25,.5,.75,1])mt.add(fx(Y[N-1][0]+(Y[N][0]-Y[N-1][0])*st,Y[N-1][1]+(Y[N][1]-Y[N-1][1])*st));for(let st of mt)Vl.has(st)||Vl.set(st,[]),Vl.get(st).push(ot)}}return lu++,Y}let Go={fill:"#62676b",edge:"#d6d1c4"},jd={primary:{w:6.5,...Go},tertiary:{w:4.6,...Go},residential:{w:4,...Go},unclassified:{w:4,...Go},service:{w:3.4,...Go},bus_stop:{w:3,...Go},footway:{w:2.2,fill:"#d9d4c7",edge:"#9c9483"},path:{w:1.9,fill:"#e2bf84",edge:"#a27a45"},steps:{w:2.4,fill:"#cfc9bb",edge:"#8f8776"},alley:{w:1.2,fill:"#d3cec1",edge:"#8f887a"}},cu={primary:6,tertiary:5,residential:4,unclassified:4,service:3,bus_stop:3,footway:2,steps:2,alley:1,path:1},Kd=()=>({edge:new G,fill:new G,skirt:new G}),Wl=Kd(),Xl=Kd(),Qd=new G,hu={edge:new G,fill:new G,skirt:null},px=c=>[c.pts[0],c.pts.at(-1)].filter(m=>t.roads.some(_=>_!==c&&_.pts.some((b,E)=>E&&E<_.pts.length-1&&Math.hypot(b[0]-m[0],b[1]-m[1])<6||E&&(()=>{let R=_.pts[E-1],U=b[0]-R[0],W=b[1]-R[1],H=U*U+W*W||1,D=Xn(((m[0]-R[0])*U+(m[1]-R[1])*W)/H,.05,.95);return Math.hypot(m[0]-R[0]-U*D,m[1]-R[1]-W*D)<2})()))).length;for(let c of t.roads)c._ends=px(c);for(let c of[...t.roads].sort((m,_)=>!!m.bridge-!!_.bridge||(cu[_.kind]||3)-(cu[m.kind]||3)||m._ends-_._ends)){if(c.model==="stair")continue;let m=jd[c.kind]||jd.service,_=["steps","path","footway","alley"].includes(c.kind),b=Math.max(c.width,m.w),E=cu[c.kind]||3,R=Jd(c.pts,b,_?Xl:Wl,m.fill,m.edge,{lift:.14+E*.012+(c.drape?.12:0),step:c.drape?1:_?4:5,bridge:!!c.bridge,smooth:!c.bridge,level:!c.drape,shoulder:_?1.4:2.2});if(c.kind==="primary"||c.kind==="tertiary"){let U=R.map(W=>ho(W[0],W[1],1)?.[2]??mi(W[0],W[1]));for(let W=0;W+1<R.length;W+=3){let H=(U[W]+U[W+1])/2+.14+E*.012+.03;Qd.quad(...[[R[W],-.11],[R[W+1],-.11],[R[W+1],.11],[R[W],.11]].map(([D,j])=>{let Y=[R[W+1][0]-R[W][0],R[W+1][1]-R[W][1]],k=Math.hypot(...Y)||1;return[D[0]-Y[1]/k*j,H,D[1]+Y[0]/k*j]}),"#ffffff")}}if(c.kind==="steps"){let U=0;for(let W=1;W<R.length;W++){let H=R[W-1],D=R[W],j=Math.hypot(D[0]-H[0],D[1]-H[1]),Y=-(D[1]-H[1])/j,k=(D[0]-H[0])/j;for(let Z=(.7-U%.7)/j;Z<1;Z+=.7/j){let J=H[0]+(D[0]-H[0])*Z,at=H[1]+(D[1]-H[1])*Z,pt=b*.4,Ut=(ho(J,at,1)?.[2]??mi(J,at))+.2+E*.012;nn(Me,[[J+Y*pt,Ut,at+k*pt],[J-Y*pt,Ut,at-k*pt]],"#9c8a6c")}U+=j}}if(c.bridge)for(let U of[-1,1]){let W=c.pts.map((H,D)=>{let j=c.pts[Math.min(D+1,c.pts.length-1)]||H,Y=c.pts[Math.max(0,D-1)],k=j[0]-Y[0],Z=j[1]-Y[1],J=Math.hypot(k,Z)||1,at=H[0]-Z/J*b/2*U,pt=H[1]+k/J*b/2*U;return[at,(ho(H[0],H[1],b)?.[2]??v(...H))+1.1,pt]});nn(Rt,W,"#ceccc0")}}for(let c of $d){let{s:m,h:_,dir:b,w:E,shoulder:R,lift:U,id:W,L:H,off:D}=c,j=m.length,Y=(J,at,pt)=>{let[Ut,xt]=D(at)[J];return[Ut,pt??mi(Ut,xt),xt]},k=J=>{let at=ho(J[0],J[2],12,W);return at&&(J[1]=Math.min(J[1],at[2]-.15)),J},Z=(J,at,pt,Ut)=>H.skirt.quad(...[J,at,pt,Ut].map(k),"#ffffff",[J,at,pt,Ut].map(xt=>dx(xt[0],xt[2])));for(let J of[-1,1])for(let at=1;at<j;at++)Z(Y(at-1,J*E,_[at-1]+U-.06),Y(at,J*E,_[at]+U-.06),Y(at,J*(E+R)),Y(at-1,J*(E+R)));for(let[J,at]of[[0,-1],[j-1,1]]){let pt=m[J],Ut=b[J],xt=Math.atan2(Ut[1],Ut[0]),Ht=_[J]+U-.06;for(let kt=0;kt<8;kt++){let bt=xt-Math.PI/2+Math.PI*kt/8,N=xt-Math.PI/2+Math.PI*(kt+1)/8,ot=st=>[pt[0]+Math.cos(st)*E*at,Ht,pt[1]+Math.sin(st)*E*at],mt=st=>{let ht=pt[0]+Math.cos(st)*(E+R)*at,ut=pt[1]+Math.sin(st)*(E+R)*at;return[ht,mi(ht,ut),ut]};Z(ot(bt),ot(N),mt(N),mt(bt))}}}pn.needsUpdate=!0;for(let c of t.water)Jd(c.pts,c.kind==="river"?5:1.8,hu,"#5fb4dc",c.kind==="river"?"#3f8fbd":null,{lift:.1,step:5,level:!1});let uo=c=>new os({vertexColors:!0,side:mn,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:c}),tp=new os({map:Rn,color:"#d9d9d9",side:mn});Wl.skirt.mesh(tp,At),Xl.skirt.mesh(tp,Me),Wl.edge.mesh(uo(-2),At),Xl.edge.mesh(uo(-2),Me),hu.edge.mesh(uo(-2),At),hu.fill.mesh(uo(-4),At),Xl.fill.mesh(uo(-4),Me),Wl.fill.mesh(uo(-6),At),Qd.mesh(uo(-8),At);for(let c of t.areas.filter(m=>m.kind==="water")){let m=new G;for(let _ of c.triangles)m.tri(..._.map(b=>[b[0],v(...b)+.3,b[1]]),"#6b9290");m.mesh(lt("#ffffff",{vertexColors:!0,roughness:.25,side:mn}),At)}Gt("#load-text").textContent="\u94FA\u8BBE\u5C71\u6797\u3001\u7F06\u8F66\u4E0E\u5546\u5BB6\u6807\u8BB0",await new Promise(requestAnimationFrame);let mx=t.places.filter(c=>["\u4E0A\u95F5\u56ED","\u4E2D\u95F5\u56ED","\u4E0B\u95F5\u56ED","\u95F5\u56ED"].includes(c.n)).map(c=>[c.x,c.z]);function gx(c,m,_,b){if(_<420||_>1e3||b>1.1)return 0;let E=1e9;for(let[R,U]of mx)E=Math.min(E,Math.hypot(c-R,m-U));return E<900?.55:_<760&&E<2600?.12:0}let uu=[],ql=[],lr=Ui(892),ep=ks?3600:16e3;for(let c=0;c<ep*8&&ql.length<ep;c++){let m=(lr()-.5)*e*.998,_=(lr()-.5)*n*.998,b=v(m,_),E=f(b);if(He(m,_)||E<100||E>1310)continue;let R=Math.hypot(v(m+10,_)-v(m-10,_),v(m,_+10)-v(m,_-10))/20/l;if(R>1.7&&lr()<.84)continue;let U=et(m,_,E);if(lr()>.06+.94*U*U)continue;let W=(6.5+lr()*6.7)*(U>.6?1.15:.9),H=gx(m,_,E,R);if(H&&lr()<H){uu.push({x:m,z:_,h:b,s:9+lr()*4,r:lr()});continue}ql.push({x:m,z:_,h:b,s:W,r:lr(),pine:lr()<.18+(E>800?.25:0)})}let fo=3,np=(c,m)=>Math.min(fo-1,Math.max(0,Math.floor((c+e/2)/e*fo)))*fo+Math.min(fo-1,Math.max(0,Math.floor((m+n/2)/n*fo)));function Va(){let c=new Th(1,0);c.deleteAttribute("normal"),c.deleteAttribute("uv");let m=Ug(c);return m.setAttribute("normal",m.getAttribute("position").clone()),m}let Yl=ke(Or[di].hiShapes),xx=lt("#686854"),yx=lt("#ffffff"),_x=lt("#ffffff"),vx=lt("#ffffff",{roughness:.85}),fu=ks?1:4,ip=ks?1.35:1,Ga=[],du=[...Array(fo*fo)].map(()=>({list:[],bamboo:[]}));for(let c of ql)du[np(c.x,c.z)].list.push(c);for(let c of uu)du[np(c.x,c.z)].bamboo.push(c);let Ni=new vi,Wo=new fn,$l=(c,m,_,b)=>{if(!_)return null;let E=new Ur(c,m,_);return E.receiveShadow=b,le.add(E),E};for(let c of du){let m=c.list,_=[0],b=[0];for(let k of m)_.push(_.at(-1)+(k.pine?0:1)),b.push(b.at(-1)+(k.pine?1:0));let E=$l(Yl.trunk,xx,m.length,!1),R=$l(Yl.leaf,yx,_.at(-1),!0),U=$l(Yl.pine,_x,b.at(-1)*2,!0),W=$l(Yl.bamboo,vx,c.bamboo.length*fu,!0),H=0,D=0,j=0,Y=0;for(let k of m){Ni.position.set(k.x,k.h+k.s*.35,k.z),Ni.rotation.set(0,k.r*6.28,0),Ni.scale.set(1,k.s*.7,1),Ni.updateMatrix(),E.setMatrixAt(H++,Ni.matrix);for(let Z=0;Z<2;Z++)k.pine?(Ni.position.set(k.x,k.h+k.s*(.68+Z*.36),k.z),Ni.scale.set(k.s*(.5-Z*.12),k.s*.91,k.s*(.5-Z*.12)),Wo.set(k.r>.5?"#2e7a52":"#3d8c5a"),Ni.updateMatrix(),U.setMatrixAt(j,Ni.matrix),U.setColorAt(j++,Wo)):Z||(Ni.position.set(k.x,k.h+k.s*.72,k.z),Ni.scale.set(k.s*.74,k.s*.5,k.s*.72),Wo.set(k.r<.05?"#f0b23e":k.r>.965?"#e86a3f":["#5aa646","#78bb4e","#3f8f45","#93c95a"][Math.floor(k.r*4)]),Ni.updateMatrix(),R.setMatrixAt(D,Ni.matrix),R.setColorAt(D++,Wo))}for(let k of c.bamboo)for(let Z=0;Z<fu;Z++){let J=k.r*6.28+Z*1.9,at=Z?2.2+(k.r*97+Z*13)%1*1.8:0;Ni.position.set(k.x+Math.cos(J)*at,k.h+k.s*(.6-.05*Z),k.z+Math.sin(J)*at),Ni.rotation.set(Math.sin(J)*.22,0,Math.cos(J)*.22),Ni.scale.set((2.1+.4*(Z*7%3))*ip,k.s*.46*(1-.06*Z),(2.1+.4*(Z*5%3))*ip),Ni.updateMatrix(),W.setMatrixAt(Y,Ni.matrix),Wo.set(["#8cc25a","#99ca62","#7fb852","#a6d16c"][(Z+Math.floor(k.r*4))%4]),W.setColorAt(Y++,Wo)}for(let k of[E,R,U,W])k&&(k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),k.computeBoundingSphere());Ga.push({trunk:E,crown:R,cone:U,bam:W,n:m.length,leafPre:_,pinePre:b,nb:c.bamboo.length})}function Mx(c){for(let m of Ga){let _=Math.round(c*m.n);m.trunk&&(m.trunk.count=_),m.crown&&(m.crown.count=m.leafPre[_]),m.cone&&(m.cone.count=2*m.pinePre[_]),m.bam&&(m.bam.count=Math.round(c*m.nb)*fu)}}let sp=null;function rp(){let c=Or[di],m=sp??(c.forest>0&&!vr);le.visible=m,Gt("#layer-trees").checked=m,m&&Mx(c.forest||1)}function bx(c){let m=ke(c);for(let _ of Ga)_.trunk&&(_.trunk.geometry=m.trunk),_.crown&&(_.crown.geometry=m.leaf),_.cone&&(_.cone.geometry=m.pine),_.bam&&(_.bam.geometry=m.bamboo);Jt&&(Jt.geometry=m.lantern)}function op(){let c=Or[di];T.setCeiling(x(),!0),B(!1),rt=!0,Wt.traverse(_=>{_.isMesh&&_.material&&!Array.isArray(_.material)&&(_.material=Se(_.material,c.pbr))}),document.documentElement.classList.toggle("lite",!c.blur),bx(c.hiShapes),rp();for(let _ of Ga)_.bam&&(_.bam.visible=c.bamboo&&!vr);ap=vr?12:c.labelCap;let m=L();p.shadowMap.enabled!==m&&(p.shadowMap.enabled=Re.castShadow=m,Wt.traverse(_=>{if(_.material)for(let b of[].concat(_.material))b.needsUpdate=!0}))}let pu=[];for(let c of t.cables){let m=c.pts[0],_=c.pts.at(-1),b=Math.hypot(_[0]-m[0],_[1]-m[1]),E=[];for(let H=0;H<=90;H++){let D=H/90,j=m[0]+(_[0]-m[0])*D,Y=m[1]+(_[1]-m[1])*D,k=Math.max(v(j,Y)+13,v(...m)*(1-D)+v(..._)*D+23-Math.sin(D*Math.PI)*b*.017);E.push(new X(j,k,Y))}let R=new Po(E),U=-(_[1]-m[1])/b*2,W=(_[0]-m[0])/b*2;for(let H of[-1,1])nn(Rt,E.map(D=>[D.x+U*H,D.y,D.z+W*H]),"#3e514c");for(let H of[.2,.43,.67,.84]){let D=R.getPoint(H),j=v(D.x,D.z);we(Rt,D.x,j,D.z,.6,D.y-j,be),qt(Rt,D.x,D.y-1,D.z,10,.65,1.2,be)}for(let H=0;H<6;H++){let D=new Pn;qt(D,0,0,0,3.6,2.6,2.4,yt),qt(D,0,1,0,3.7,1,2.45,pe),qt(D,0,2.8,0,.2,3,.2,O),Rt.add(D),pu.push({g:D,curve:R,phase:H/6,kind:"cable"})}}for(let c of t.funicular){let m=[];for(let R=1;R<c.pts.length;R++){let U=c.pts[R-1],W=c.pts[R],H=Math.ceil(Math.hypot(W[0]-U[0],W[1]-U[1])/3);for(let D=0;D<H;D++){let j=D/H,Y=U[0]+(W[0]-U[0])*j,k=U[1]+(W[1]-U[1])*j;m.push(new X(Y,v(Y,k)+.8,k))}}let _=c.pts.at(-1);m.push(new X(_[0],v(..._)+.8,_[1]));let b=new Po(m);for(let R of[-1,1])nn(Rt,m.map(U=>[U.x,U.y,U.z+R*.8]),"#dad8c3");let E=new Pn;qt(E,0,0,0,7,2.5,2.4,lt("#eee8d8")),qt(E,0,.8,0,6.8,1.2,2.45,pe),qt(E,0,2.3,0,7,.45,2.6,yt),Rt.add(E),pu.push({g:E,curve:b,phase:.4,kind:"funicular"})}{let c=[[/厕|洗手亭/,"wc"],[/停车场/,"park"],[/索道|缆车/,"cable"],[/加油站/,"fuel"],[/充电站/,"charge"],[/车站|客运站/,"bus"],[/售票|检票/,"ticket"],[/游客服务/,"info"],[/卫生院|医院/,"hospital"],[/药房|药堂/,"pharmacy"],[/派出所|公安|警/,"police"],[/小学|幼儿园|学校/,"school"],[/邮政|邮局/,"post"],[/银行/,"bank"]],m={wc:["#2f7fd0","WC"],park:["#2a62c9","P"],cable:["#7a52c2","\u7F06"],fuel:["#d9432f","\u6CB9"],charge:["#13a07a","\u7535"],bus:["#1d9a5b","bus"],ticket:["#e08a1e","\u7968"],info:["#2b8fd6","i"],hospital:["#ffffff","+r"],pharmacy:["#ffffff","+g"],police:["#1f4fa3","\u8B66"],school:["#e5a72e","\u5B66"],post:["#1a8a4a","\u90AE"],bank:["#c0392b","\xA5"]},_=Object.keys(m),b=document.createElement("canvas");b.width=b.height=512;let E=b.getContext("2d");_.forEach((J,at)=>{let[pt,Ut]=m[J],xt=at%4*128,Ht=Math.floor(at/4)*128;E.fillStyle=pt,E.fillRect(xt,Ht,128,128),E.strokeStyle="rgba(0,0,0,.18)",E.lineWidth=6,E.strokeRect(xt+3,Ht+3,122,122),E.fillStyle="#fff",E.textAlign="center",E.textBaseline="middle",Ut==="+r"||Ut==="+g"?(E.fillStyle=Ut==="+r"?"#d8312a":"#1f9a52",E.fillRect(xt+50,Ht+22,28,84),E.fillRect(xt+22,Ht+50,84,28)):Ut==="bus"?(E.beginPath(),E.roundRect(xt+22,Ht+26,84,66,10),E.fill(),E.fillStyle=pt,E.fillRect(xt+30,Ht+36,68,24),E.fillStyle="#fff",E.beginPath(),E.arc(xt+42,Ht+98,10,0,7),E.arc(xt+86,Ht+98,10,0,7),E.fill()):(E.font=`bold ${Ut.length>1&&/^[A-Z]/.test(Ut)?64:Ut==="i"?92:76}px "PingFang SC","Noto Sans SC",sans-serif`,E.fillText(Ut,xt+64,Ht+68))});let R=new as(b);R.colorSpace=kn,R.anisotropy=8;let U=new G,W=new G,H=new G,D=(J,at,pt)=>{let Ut=!1;for(let xt=0,Ht=pt.length-1;xt<pt.length;Ht=xt++){let kt=pt[xt],bt=pt[Ht];kt[1]>at!=bt[1]>at&&J<(bt[0]-kt[0])*(at-kt[1])/(bt[1]-kt[1])+kt[0]&&(Ut=!Ut)}return Ut},j=(J,at)=>{let pt=null,Ut=40;for(let xt of t.roads)if(!["footway","path","steps"].includes(xt.kind))for(let Ht=1;Ht<xt.pts.length;Ht++){let kt=xt.pts[Ht-1],bt=xt.pts[Ht],N=bt[0]-kt[0],ot=bt[1]-kt[1],mt=N*N+ot*ot||1,st=Xn(((J-kt[0])*N+(at-kt[1])*ot)/mt,0,1),ht=kt[0]+N*st,ut=kt[1]+ot*st,it=Math.hypot(J-ht,at-ut);it<Ut&&(Ut=it,pt={x:ht,z:ut,ux:N/Math.sqrt(mt),uz:ot/Math.sqrt(mt)})}return pt},Y=(J,at,pt,Ut,xt,Ht,kt,bt)=>{let N=[[at,Ut,Ht],[pt,Ut,Ht],[pt,Ut,kt],[at,Ut,kt],[at,xt,Ht],[pt,xt,Ht],[pt,xt,kt],[at,xt,kt]];for(let ot of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])J.quad(N[ot[0]],N[ot[1]],N[ot[2]],N[ot[3]],bt)},k=(J,at,pt,Ut,xt,Ht,kt,bt,N,ot)=>{let mt=-xt,st=Ut,ht=(it,Tt,Ce)=>[at+Ut*it+mt*Tt,Ce,pt+xt*it+st*Tt],ut=[ht(-Ht,-kt,bt),ht(Ht,-kt,bt),ht(Ht,kt,bt),ht(-Ht,kt,bt),ht(-Ht,-kt,N),ht(Ht,-kt,N),ht(Ht,kt,N),ht(-Ht,kt,N)];for(let it of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])J.quad(ut[it[0]],ut[it[1]],ut[it[2]],ut[it[3]],ot)};for(let J of t.places){if(J.category!=="service"&&J.category!=="transport")continue;let at=c.find(([he])=>he.test(J.n))?.[1];if(!at||/公司|营业厅/.test(J.n)||ir[J.n])continue;let pt=_.indexOf(at),Ut=pt%4/4,xt=1-Math.floor(pt/4)/4,Ht=[[Ut+.004,xt-.246],[Ut+.246,xt-.246],[Ut+.246,xt-.004],[Ut+.004,xt-.004]],kt=t.buildings.find(he=>Math.abs(he.rectCenter[0]-J.x)<40&&Math.abs(he.rectCenter[1]-J.z)<40&&D(J.x,J.z,he.ring)),bt=mi(J.x,J.z),N=kt?qn.has(kt.osmId)?kt.base+4.2:kt.base+kt.wallHeight+(kt.roofRise||0):bt,ot=5.5,mt=N+(kt?1.5:7),st=ot/2;Y(W,J.x-.18,J.x+.18,kt?N-.5:bt,mt,J.z-.18,J.z+.18,"#5b6066");let ht=J.x-st,ut=J.x+st,it=J.z-st,Tt=J.z+st,Ce=mt,Dt=mt+ot;U.quad([ht,Ce,Tt],[ut,Ce,Tt],[ut,Dt,Tt],[ht,Dt,Tt],"#ffffff",Ht),U.quad([ut,Ce,it],[ht,Ce,it],[ht,Dt,it],[ut,Dt,it],"#ffffff",Ht),U.quad([ut,Ce,Tt],[ut,Ce,it],[ut,Dt,it],[ut,Dt,Tt],"#ffffff",Ht),U.quad([ht,Ce,it],[ht,Ce,Tt],[ht,Dt,Tt],[ht,Dt,it],"#ffffff",Ht);let ae=[[Ut+.12,xt-.12],[Ut+.13,xt-.12],[Ut+.13,xt-.13],[Ut+.12,xt-.13]];if(U.quad([ht,Dt,Tt],[ut,Dt,Tt],[ut,Dt,it],[ht,Dt,it],"#ffffff",ae),at==="bus"&&J.n!=="\u4E09\u89D2\u6D32\u8F66\u7AD9"){let he=j(J.x,J.z);if(he){let se=he.x,ee=he.z,ge=mi(se,ee)+.45;k(H,se,ee,he.ux,he.uz,4.6,1.25,ge,ge+2.9,"#2fae6a"),k(H,se,ee,he.ux,he.uz,4.62,1.27,ge+1.55,ge+2.45,"#2b3a40"),k(H,se,ee,he.ux,he.uz,4.5,1.2,ge+2.9,ge+3.1,"#f4f1e8");for(let q of[-2.9,2.9])for(let St of[-1,1]){let wt=se+he.ux*q-he.uz*1.2*St,Ot=ee+he.uz*q+he.ux*1.2*St;k(H,wt,Ot,he.ux,he.uz,.5,.18,ge-.45,ge+.5,"#2a2a2a")}}}if(at==="fuel"){let he=bt+5.2;Y(H,J.x-6,J.x+6,he,he+.8,J.z-4.5,J.z+4.5,"#f4f1e8"),Y(H,J.x-6.05,J.x+6.05,he+.15,he+.55,J.z-4.55,J.z+4.55,"#d9432f");for(let[se,ee]of[[-5,-3.5],[5,-3.5],[-5,3.5],[5,3.5]])Y(H,J.x+se-.2,J.x+se+.2,bt,he,J.z+ee-.2,J.z+ee+.2,"#e8e4da");for(let se of[-2.2,2.2])Y(H,J.x+se-.5,J.x+se+.5,bt,bt+1.9,J.z-.35,J.z+.35,"#d9432f")}}let Z=new Pn;Rt.add(Z),Si.push(U.mesh(new os({map:R,toneMapped:!1}),Z),W.mesh(lt("#ffffff",{vertexColors:!0}),Z)),H.p.length&&H.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),Z)}for(let[c,m]of Je){let _=new Ln;_.setAttribute("position",new en(m.p,3)),_.setAttribute("color",new en(m.c,3)),c.add(new Rl(_,new La({vertexColors:!0})))}if(y){let c=$g(y,lt);Yt.add(c),an.push(c),Mr.set(d.n,y.floor+7.5)}{let c=new Map,m=E=>[E.type,E.color?.getHexString(),E.emissive?.getHexString(),E.emissiveIntensity,E.roughness,E.metalness,E.opacity,E.transparent,E.side,E.map?.uuid,E.emissiveMap?.uuid,E.vertexColors,E.flatShading,E.depthWrite,E.depthTest,E.alphaTest,E.polygonOffset,E.polygonOffsetFactor,E.polygonOffsetUnits,E.fog,E.toneMapped].join("/"),_=E=>{let R=m(E);return c.has(R)||c.set(R,E),c.get(R)},b=E=>{for(let U of[...E.children])!U.isMesh&&U.children.length&&b(U);let R=new Map;for(let U of E.children){if(!U.isMesh||U.isInstancedMesh||U.isSkinnedMesh||Array.isArray(U.material)||U.children.length||!U.visible||Object.keys(U.geometry.morphAttributes).length)continue;U.material=_(U.material);let W=U.geometry,H=m(U.material)+"|"+Object.keys(W.attributes).sort().join()+"|"+!!W.index+"|"+U.castShadow+U.receiveShadow+"|"+U.renderOrder;R.has(H)||R.set(H,[]),R.get(H).push(U)}for(let U of R.values()){if(U.length<2)continue;let W=ao(U.map(D=>(D.matrixAutoUpdate&&D.updateMatrix(),D.geometry.clone().applyMatrix4(D.matrix))));if(!W)continue;let H=new Ke(W,U[0].material);H.castShadow=U[0].castShadow,H.receiveShadow=U[0].receiveShadow,H.renderOrder=U[0].renderOrder;for(let D of U)E.remove(D);E.add(H)}};for(let E of Yt.children)E.isGroup&&b(E)}for(let c of an)Vn.push(c);let mu=[];if(p.capabilities.isWebGL2||p.extensions.has("OES_element_index_uint")){let c=[Bn,...Yt.children.filter(m=>m.isMesh&&!m.isInstancedMesh&&!m.material.transparent&&!m.children.length&&m.geometry.attributes.position.count>3e3)];for(let m of c){let _=Zg(m);_&&mu.push(_)}}At.traverse(c=>{c.isMesh&&(c.updateMatrix(),c.matrixAutoUpdate=!1)});let cr=t.places.map(c=>({...c})),Sx=new Map(cr.map(c=>[c.n,c])),Ex=new Map(cr.map(c=>[c.placeId,c])),gu=c=>["hotel","food","shop"].includes(c.category),xu=c=>c.quality?.startsWith("legacy")||["overture","unverified_listing","derived_area","owner_reported"].includes(c.quality),ji=null,Zl="all",Xo="",wx=0,Jl=0,ap=null,Tx={temple:"\u5BFA",hotel:"\u5BBF",food:"\u98DF",shop:"\u8D2D",transport:"\u884C",nature:"\u5C71",sight:"\u666F",village:"\u6751",service:"\u516C"},Ax={temple:["temple"],sight:["sight","nature","village"],service:["service","transport"]},lp=rm(cr),br=cr.find(c=>c.featured),Rx=c=>c.quality==="owner_reported"?cm:c.featured?"\u4E1A\u4E3B\u63D0\u4F9B\u5B9E\u62CD \xB7 \u4F4D\u7F6E\u6309\u95E8\u724C\u4F30\u8BA1":c.qualityLabel||{converted_listing:"\u643A\u7A0B\u516C\u5F00\u5750\u6807 \xB7 \u5DF2\u6362\u7B97",mapped:"OpenStreetMap \u5730\u56FE\u8BB0\u5F55",multi_source:"\u591A\u4E2A\u5E73\u53F0\u5750\u6807\u76F8\u4E92\u5370\u8BC1",platform_listing:"\u516C\u5F00\u5E73\u53F0\u5750\u6807 \xB7 \u5355\u4E00\u6765\u6E90",unverified_listing:"\u5355\u4E00\u5E73\u53F0\u6536\u5F55 \xB7 \u4F4D\u7F6E\u4E0E\u8425\u4E1A\u72B6\u6001\u5F85\u6838",derived_area:"\u7531\u95E8\u724C\u5730\u5740\u8303\u56F4\u63A8\u7B97",overture:"\u516C\u5F00\u5730\u56FE\u8BB0\u5F55 \xB7 \u5F85\u590D\u6838",legacy_osm:"\u65E7\u7248\u5730\u56FE\u70B9 \xB7 \u5F85\u590D\u6838",user_confirmed:"\u7528\u6237\u5B9E\u5730\u786E\u8BA4"}[c.quality]||"\u65E7\u7248\u4F30\u8BA1\u4F4D\u7F6E \xB7 \u5F85\u6838",jl=new Map;for(let c of t.buildings){let m=Math.floor(c.center[0]/60)+","+Math.floor(c.center[1]/60);jl.has(m)||jl.set(m,[]),jl.get(m).push(c)}function Cx(c,m=20){let _=null,b=m,E=Math.floor(c.x/60),R=Math.floor(c.z/60);for(let U=-1;U<=1;U++)for(let W=-1;W<=1;W++)for(let H of jl.get(E+U+","+(R+W))||[]){let D=Math.hypot(c.x-H.center[0],c.z-H.center[1]);D<b&&(_=H,b=D)}return _}let Px=new Map(t.buildings.map(c=>[c.id,c])),Lx='<svg viewBox="0 0 24 24"><path d="M4 11.2 12 4.5l8 6.7V19a1 1 0 0 1-1 1h-4.6v-5.2H9.6V20H5a1 1 0 0 1-1-1z"/></svg>',Ix={featured:[14.85,9.5,48,39],area:[16.5,11.5,4,15],major:[14.04,8.8,34,34],small:[10.71,6.6,24,27],road:[10.2,6.2,18,20],plain:[12.24,7.5,29,31]};function Dx(c,m){let[_,b,E,R]=Ix[["featured","area","major","small","road"].find(W=>c.includes(W))||"plain"],U=E;for(let W of m)U+=W.codePointAt(0)>=11904?_:b;return[Math.ceil(U),R]}function yu(c,m,_,b){let E=Te("div","maplabel pin "+m);c.placeId&&(E.dataset.placeId=c.placeId),c.stem=m.includes("featured")?9:m.includes("area")||m.includes("road")?0:7;let R=Te("button","");if(R.type="button",R.tabIndex=-1,c.featured){let W=Te("span","lb-icon");W.innerHTML=Lx,R.append(W)}R.append(_),b&&(R.onclick=b),E.append(R,Te("i"));let U=new Fo(E);return U.center.set(.5,1),c.label=U,c.el=E,[c.labelWidth,c.labelHeight]=Dx(m,_),U}for(let c of cr){if(!Number.isFinite(c.x)||!Number.isFinite(c.z)||!(c.searchable||c.featured))continue;let m=(c.featured?"featured ":"")+"c-"+c.category+(c.p===1&&!c.featured?" major":"")+(xu(c)?" estimated":"")+(c.category==="village"?" area":""),_=yu(c,m,c.displayName||c.shortName||c.n,()=>Ja(c,!0));c.tier=c.featured||c.p===1?2:c.category==="temple"&&c.story?1:0;let b=c.n==="\u767E\u5C81\u5BAB"?t.buildings.find(R=>R.osmId===541482372):ir[c.n]?t.buildings.find(R=>R.osmId===ir[c.n]):null,E=b||c.buildingId&&Px.get(c.buildingId)||Cx(c,gu(c)?12:35);c.top=Mr.get(c.n)??(qn.has(b?.osmId)?b.base+4.4:c.category==="village"?v(c.x,c.z)+40:E?E.base+E.wallHeight+E.roofRise:v(c.x,c.z)+(c.category==="temple"?22:gu(c)?9:11)),_.position.set(b?b.center[0]:c.x,c.top+5,b?b.center[1]:c.z),c.nearest=E,c.limit=c.featured||c.p===1?1/0:c.category==="village"?2600:gu(c)?c.quality==="unverified_listing"?650:1250:c.category==="temple"||c.p<=2?3600:1900}let Kl=[];for(let c of cr)for(let m of c.halls||[]){let _={n:m.n,x:m.x,z:m.z,p:5,parent:c,limit:300,hall:!0};yu(_,"small hall",m.n,()=>Ja(c,!1)),_.top=v(m.x,m.z)+9,_.label.position.set(m.x,_.top+4,m.z),Kl.push(_)}{let c=new Map;for(let m of t.roads){if(!m.name||m.pts.length<2)continue;let _=0;for(let b=1;b<m.pts.length;b++)_+=Math.hypot(m.pts[b][0]-m.pts[b-1][0],m.pts[b][1]-m.pts[b-1][1]);(!c.has(m.name)||c.get(m.name).len<_)&&c.set(m.name,{r:m,len:_})}for(let[m,{r:_}]of c){let b=_.pts[Math.floor(_.pts.length/2)],E={n:m,x:b[0],z:b[1],p:4,limit:2200,road:!0};yu(E,"road",m.replace(/\s*\(.*\)$/,""),null),E.top=v(b[0],b[1]),E.label.position.set(b[0],E.top+3,b[1]),Kl.push(E)}}let Ux=cr.concat(Kl).filter(c=>c.label);function ds(c,m,_=900,b=145,E=57){let R=new X(c,v(c,m)*At.scale.y,m),U=b*Math.PI/180,W=E*Math.PI/180;return{target:R,pos:R.clone().add(new X(-Math.sin(U)*_*Math.sin(W),_*Math.cos(W),Math.cos(U)*_*Math.sin(W)))}}let hi=null,qo=!1,cp=[],Oi=bg(Ct,ne,{reducedMotion:kl}),Yo=Te("div","my-location");Yo.append(Te("span","","\u6211\u7684\u4F4D\u7F6E"),Te("i"));let Br=new Fo(Yo);Br.center.set(.5,1),Br.renderOrder=10,Br.visible=!1,Wt.add(Br);let $o=Gt("#locate"),Nx=Gt("#location-status"),_u=null,Ql=!1,hr=null,hp="",vu=new Set,Mu={off:"\u5B9A\u4F4D\u5DF2\u5173\u95ED",waiting:"\u6B63\u5728\u83B7\u53D6\u4F4D\u7F6E\uFF0C\u70B9\u51FB\u5B9A\u4F4D\u6309\u94AE\u53EF\u5173\u95ED",inside:"\u5B9A\u4F4D\u5DF2\u5F00\u542F",outside:"\u60A8\u5DF2\u8D85\u51FA\u5730\u56FE\u8986\u76D6\u8303\u56F4\uFF0C\u8FD4\u56DE\u8303\u56F4\u540E\u4F1A\u81EA\u52A8\u663E\u793A",inaccurate:"\u5B9A\u4F4D\u7CBE\u5EA6\u4E0D\u8DB3\uFF0C\u8BF7\u79FB\u81F3\u5F00\u9614\u5904",approximate:"\u4F4D\u7F6E\u7CBE\u5EA6\u8F83\u4F4E\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u201C\u7CBE\u786E\u4F4D\u7F6E\u201D\u8BBE\u7F6E\u6216\u79FB\u81F3\u5F00\u9614\u5904",stale:"\u6682\u672A\u6536\u5230\u65B0\u4F4D\u7F6E\uFF0C\u6B63\u5728\u7B49\u5F85\u66F4\u65B0",timeout:"\u5B9A\u4F4D\u6682\u65F6\u8D85\u65F6\uFF0C\u6B63\u5728\u5C1D\u8BD5\u66F4\u65B0\uFF1B\u53EF\u68C0\u67E5\u7CFB\u7EDF\u5B9A\u4F4D\u670D\u52A1",unavailable:"\u6682\u65F6\u65E0\u6CD5\u5B9A\u4F4D\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u5B9A\u4F4D\u670D\u52A1\uFF1B\u5FAE\u4FE1\u4E2D\u53EF\u5C1D\u8BD5\u5728\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6253\u5F00",denied:"\u672A\u83B7\u5F97\u5B9A\u4F4D\u6743\u9650\uFF0C\u8BF7\u5728\u7CFB\u7EDF\u548C\u6D4F\u89C8\u5668\u8BBE\u7F6E\u4E2D\u5141\u8BB8\u5B9A\u4F4D\u540E\u91CD\u8BD5",insecure:"\u5B9A\u4F4D\u9700\u8981 HTTPS\uFF0C\u8BF7\u6253\u5F00\u7EBF\u4E0A\u5B89\u5168\u7F51\u5740",unsupported:"\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5B9A\u4F4D\uFF0C\u8BF7\u5C1D\u8BD5\u7CFB\u7EDF\u6D4F\u89C8\u5668",paused:"\u5B9A\u4F4D\u5DF2\u6682\u505C\uFF0C\u8FD4\u56DE\u9875\u9762\u540E\u7EE7\u7EED"},bu=sx({geo:t.geo,terrain:i,onChange:({state:c,point:m,enabled:_,changed:b,fresh:E})=>{_u=m,Br.visible=!!m,Ql=!0,Yo.classList.toggle("is-stale",!!m&&!E),Yo.firstChild.textContent=E?"\u6211\u7684\u4F4D\u7F6E":"\u4E0A\u6B21\u4F4D\u7F6E",$o.setAttribute("aria-pressed",String(_)),$o.setAttribute("aria-label",_?"\u5173\u95ED\u6211\u7684\u4F4D\u7F6E":"\u663E\u793A\u6211\u7684\u4F4D\u7F6E"),$o.setAttribute("aria-busy",String(c==="waiting")),$o.dataset.state=c;let R=[c,_,!!m,E].join(":");if(R!==hp){let U=m?Math.ceil(m.accuracy/10)*10:0;Nx.textContent=m?E?`\u6211\u7684\u4F4D\u7F6E \xB7 \u7CBE\u5EA6\u7EA6 ${U} \u7C73\uFF08\u4EC5\u4F9B\u53C2\u8003\uFF09`:`${Mu[c]}\uFF1B\u663E\u793A\u4E0A\u6B21\u4F4D\u7F6E\uFF0C\u975E\u5B9E\u65F6\u5B9A\u4F4D`:Mu[c],hp=R}if((!_||["paused","outside","stale"].includes(c))&&(hr=null),b&&!["inside","paused","waiting","off"].includes(c)&&!vu.has(c)&&(vu.add(c),Bl(Mu[c])),m&&E&&hr!==null){let U=performance.now()-hr<2e4&&!hi?.previewing&&!Oi.active;hr=null,U&&Gs(ds(m.x,m.z,650),1e3)}}});$o.onclick=()=>{bu.enabled?bu.stop():(vu.clear(),hr=performance.now(),bu.start())},ne.addEventListener("gesturestart",()=>{hr=null});function Ox(){if(_u){let{x:c,z:m}=_u;Br.position.set(c,v(c,m)*At.scale.y+8,m),Br.updateMatrixWorld(!0)}}function Gs(c,m=1200,_=null,b=0){hr=null,hi?.stopPreview(),Oi.move(c,m,_,b),qo&&Ki()}let up=c=>Xn(900+Ct.position.distanceTo(c.pos)*.35,1100,2400),Cs=null;function fp(){let c=Oi.destination;Cs??={pos:(c?c.pos:Ct.position).clone(),target:(c?c.target:ne.target).clone(),view:Gt(".viewbar button.active")?.dataset.view}}function Fx(){let c=Cs;Cs=null,c&&(Gs(c,Math.round(up(c)*1.2)),Zi("[data-view]").forEach(m=>m.classList.toggle("active",m.dataset.view===c.view)),tc())}let Wa=()=>{let c=ne.target.clone().sub(Ct.position);return Math.atan2(c.x,-c.z)*180/Math.PI};function Su(c=Hn?220:160){return ds(br.x,br.z,c,15,57)}function dp(c){return c.model?.kind==="entrance-checkpoint"&&y?ds(c.x,c.z,Hn?150:110,y.viewAzimuth,59):ds(c.x,c.z,c.category==="temple"?400:300,Wa(),57)}function pp(c,m,_,b){let E=c.getBoundingClientRect(),R=m.getBoundingClientRect(),U=E.width/c.offsetWidth||1;c.style.setProperty(_,((R.left-E.left)/U-c.clientLeft).toFixed(2)+"px"),c.style.setProperty(b,(R.width/U).toFixed(2)+"px")}function tc(){let c=Gt(".viewbar"),m=c.querySelector("button.active");if(!m){c.style.setProperty("--ind-o",0);return}pp(c,m,"--ind-x","--ind-w"),c.style.setProperty("--ind-o",1)}function Eu(){Zi("[data-view]").forEach(c=>c.classList.remove("active")),tc()}let wu=()=>ds(-1390,50,Hn?1550:1370,38,53);function Tu(c){Cs=null,Gs({town:wu,all:()=>ds(-150,200,7800,110,51),top:()=>ds(ne.target.x,ne.target.z,Math.max(900,Ct.position.distanceTo(ne.target)),0,1),baisui:()=>{let _=t.buildings.find(b=>b.osmId===541482372);return ds(..._.center,260,60,63)},juzhilin:()=>Su(),tiantai:()=>ds(773,1635,520,130,64)}[c]()),Zi("[data-view]").forEach(_=>_.classList.toggle("active",_.dataset.view===c)),tc()}Zi("[data-view]").forEach(c=>c.onclick=()=>Tu(c.dataset.view)),ne.addEventListener("gesturestart",()=>{let c=!!Oi.destination?.onDone;Oi.cancel(),Eu(),c&&!Gt("#card").classList.contains("show")&&(Xa++,ec(),Cs=null),Ki()}),Gs(wu(),0),Gt("#north").onclick=()=>Gs(ds(ne.target.x,ne.target.z,Ct.position.distanceTo(ne.target),0,ne.getPolarAngle()*180/Math.PI)),Gt("#zoom-in").onclick=()=>Gs(ds(ne.target.x,ne.target.z,Math.max(40,Ct.position.distanceTo(ne.target)*.65),Wa(),ne.getPolarAngle()*180/Math.PI),450),Gt("#zoom-out").onclick=()=>Gs(ds(ne.target.x,ne.target.z,Math.min(12e3,Ct.position.distanceTo(ne.target)*1.5),Wa(),ne.getPolarAngle()*180/Math.PI),450);function Au(c){let m=Te("div","links");for(let _ of c.sources||[]){if(!/^https:\/\//.test(_.url))continue;let b=Te("a","",_.name);b.href=_.url,b.target="_blank",b.rel="noopener",m.append(b)}return m}function ec(){ji?.el&&ji.el.classList.remove("selected"),ji=null;for(let c of Zi(".place-item.selected"))c.classList.remove("selected")}let Xa=0,Ru=c=>!!c?.isConnected&&!c.disabled&&!c.closest("[inert]")&&c.getClientRects().length>0&&getComputedStyle(c).visibility!=="hidden",Zo=()=>{let c=document.activeElement;return!c||c===document.body||!Ru(c)};function nc(c){if(!c)return;let m=()=>{Ru(c)&&document.activeElement!==c&&c.focus({preventScroll:!0})};m(),document.activeElement!==c&&requestAnimationFrame(m)}function qa(...c){for(let m of c)if(Ru(m))return m.focus({preventScroll:!0}),!0;return!1}let Ya=null,ic=null,Cu=null;function mp(){let c=Gt("#card"),m=document.activeElement;c.classList.contains("show")||c.contains(m)||(Ya=m&&m!==document.body?m:null,ic=m?.matches?.(".place-item")?m.dataset.name:null)}function Jo(c=!0){let m=Gt("#card"),_=m.classList.contains("show"),b=m.contains(document.activeElement);if(Xa++,Oi.cancel(),ec(),ko(m),Ki(),c?Fx():Cs=null,_&&(b||Zo())){let E=ic&&[...Zi("#place-list .place-item")].find(R=>R.dataset.name===ic);qa(Ya,E,!Hn&&!Gt("#panel").classList.contains("closed")?Gt('.panel-tabs [aria-selected="true"]'):null,Gt("#panel-open"))}Ya=ic=null}function $a(c){let m=Gt("#settings"),_=!c&&m.querySelector(".settings-wrap").contains(document.activeElement);m.classList.toggle("collapsed",!c),Gt("#settings-toggle").setAttribute("aria-expanded",c),qo&&Ki(),_&&nc(Gt("#settings-toggle"))}function Pu(){let c=Gt("#data-dialog");c.open&&(c.classList.add("closing"),setTimeout(()=>{c.classList.remove("closing"),c.close(),Ki()},190))}function Za(c){Hn&&(c!=="directory"&&(Gt("#panel").classList.add("closed"),Gt("#search").blur(),Ki()),c!=="detail"&&Jo(!1),c!=="settings"&&$a(!1),c!=="data"&&Pu())}let Bx='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';function gp(c,m,{cat:_="",sub:b="",hero:E=null,featured:R=!1}={}){Za("detail");let U=Gt("#card"),W=U.classList.contains("show");U.replaceChildren(),U.classList.toggle("featured",R);let H=Te("div","card-head"),D=Te("div","card-content"+(W?" swap":"")),j=Te("button","close icon-btn");j.innerHTML=Bx,j.setAttribute("aria-label","\u5173\u95ED\u5730\u70B9\u8BE6\u60C5"),j.onclick=()=>Jo();let Y=Te("h2","",c);Y.tabIndex=-1,H.append(Te("span","tag"+(_?" c-"+_:""),m),Y),b&&H.append(Te("p","sub",b)),D.tabIndex=0,D.setAttribute("role","region"),D.setAttribute("aria-label","\u5730\u70B9\u8BE6\u7EC6\u5185\u5BB9");let k=document.activeElement,Z=k===Ya||U.contains(k),J=Te("div","sheet-grip");return J.setAttribute("aria-hidden","true"),E&&U.append(E),U.append(j,H,D,J),W||Ba(U),Ki(),requestAnimationFrame(Ki),(Z||Zo())&&nc(Y),D}let{open:xp,close:zx}=Kg({reducedMotion:kl,onToggle:()=>Ki(),focusLost:Zo,restoreFocus:qa,fallbackFocus:()=>Gt("#card .card-head h2")}),yp={temple:"\u5BFA\u9662",sight:"\u666F\u70B9",nature:"\u5C71\u6C34\u666F\u89C2",village:"\u6751\u843D\u5730\u540D",service:"\u516C\u5171\u670D\u52A1",transport:"\u4EA4\u901A",hotel:"\u4F4F\u5BBF",food:"\u9910\u996E",shop:"\u8D2D\u7269"},kx="17356648281",_p="173 5664 8281";function vp(c){let m=Te("details","more");return m.append(Te("summary","",c)),m}function Hx(c,m,_){let b=Te("button","btn "+c);return b.type="button",b.innerHTML=m,b.append(_),b}let Vx='<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/></svg>',Gx='<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></svg>',Wx='<svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></svg>';function Mp(c){let m=t.routes?.find(H=>H.id==="juzhilin-halfday"),_=hi?.canResume?hi.active:null,b=c.querySelector(".route-teaser"),E=_?"resume:"+_.id:m?"start":"";if((b?.dataset.kind||"")===E)return;if(!E){b?.remove();return}let R=Te("button","route-teaser"),U=Te("span","");R.type="button",R.dataset.kind=E,R.innerHTML=Vx,_?(U.append(Te("b","","\u7EE7\u7EED\u8DEF\u7EBF\u9884\u6F14"),Te("small","",_.short+" \xB7 \u4ECE\u521A\u624D\u6682\u505C\u7684\u4F4D\u7F6E\u7EE7\u7EED")),R.onclick=()=>hi.canResume&&hi.active===_?hi.startPreview():hi.open(_.id)):(U.append(Te("b","","\u4ECE\u8FD9\u91CC\u51FA\u53D1 \xB7 "+m.short),Te("small","",`${m.duration} \xB7 \u8089\u8EAB\u5B9D\u6BBF \u2192 \u5316\u57CE\u5BFA \u2192 \u7F06\u8F66\u4E0A\u767E\u5C81\u5BAB \xB7 \u770B\u8DEF\u7EBF`)),R.onclick=()=>hi?.open(m.id)),R.append(U);let W=c.querySelector(".card-summary");if(b){let H=document.activeElement===b;b.replaceWith(R),H&&R.focus({preventScroll:!0})}else W?W.after(R):c.append(R)}function Xx(){let c=Gt("#card");c.classList.contains("show")&&c.classList.contains("featured")&&Mp(c.querySelector(".card-content"))}function Ja(c,m){mp(),ec(),ji=c,c.el&&c.el.classList.add("selected");let _=++Xa,b=()=>{let U=null;if(c.featured){U=Te("div","card-hero");let k=[["jzl-1",640],["jzl-2",541],["jzl-5",720],["jzl-6",540],["jzl-3",540],["jzl-4",640]],Z=k.map(([J])=>{let at=`media/juzhilin/${J}.jpg`;return window.__JIUHUA_MEDIA__?.[at]||at});for(let[J,at]of Z.entries()){let pt=Te("a");pt.href=at,pt.target="_blank",pt.rel="noopener",pt.onclick=xt=>{xt.preventDefault(),xp(Z,J,void 0,void 0,pt)};let Ut=Te("img");Ut.width=960,Ut.height=k[J][1],Ut.src=at,Ut.alt="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",Ut.loading="lazy",pt.append(Ut),U.append(pt)}}let W=[...c.photos||[],...c.viewing?.photos||[]];if(W.length){U=Te("div","card-hero");let k=W,Z=k.map(J=>window.__JIUHUA_MEDIA__?.[J.src]||J.src);for(let[J,at]of k.entries()){let pt=Te("a");pt.href=Z[J],pt.setAttribute("aria-label",at.alt+"\uFF0C\u70B9\u5F00\u653E\u5927"),pt.onclick=kt=>{kt.preventDefault(),xp(Z,J,c.n,k,pt)};let Ut=Te("img"),xt=window.__JIUHUA_MEDIA__,Ht=at.thumb&&(xt?xt[at.thumb]:at.thumb);Ut.src=Ht||Z[J],Ut.width=at.width,Ut.height=at.height,Ut.alt=at.alt,Ut.loading="lazy",pt.append(Ut),at.takenAt&&pt.append(Te("span","photo-date",at.takenAt.slice(0,4)+"\u5E74\u5B9E\u62CD \xB7 \u70B9\u5F00\u653E\u5927")),U.append(pt)}}let H=gp(c.displayName||(c.featured?c.shortName:c.n),c.featured?"\u7CBE\u9009\u6C11\u5BBF \xB7 \u5B9E\u62CD\u5EFA\u6A21":yp[c.category]||"\u5730\u70B9",{cat:c.category,hero:U,featured:!!c.featured}),D=Te("div","chips");(c.address||c.zone)&&D.append(Te("span","",c.address||c.zone)),c.featured&&D.append(Te("span","","\u4E1A\u4E3B\u5B9E\u62CD \xB7 \u4E09\u7EF4\u5EFA\u6A21")),D.append(Te("span","",`\u6D77\u62D4\u7EA6 ${Math.round(f(v(c.x,c.z)))} m`)),c.halls?.length&&D.append(Te("span","",`\u6BBF\u5802 ${c.halls.length} \u5904`)),c.transit?.length&&D.append(Te("span","","\u666F\u533A\u4EA4\u901A\u7AD9\u70B9"));let j=Te("div","card-summary");if(j.append(D),H.append(j),c.featured&&Mp(H),c.featured&&H.append(Te("p","lead","\u4E09\u5C42\u9000\u53F0\u7684\u5C71\u5730\u6C11\u5BBF\uFF1A\u5C4B\u9876\u9732\u53F0\u8FDC\u773A\u4E5D\u534E\u8BF8\u5CF0\uFF0C\u4E8C\u5C42\u6728\u5E73\u53F0\u4E0E\u7F57\u6C49\u677E\u5C0F\u9662\uFF0C\u95E8\u524D\u505C\u8F66\u573A\u5E26\u5145\u7535\u6869\uFF0C\u6321\u5899\u4E0A\u65B9\u662F\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u3002")),c.highlight){let k=Te("p","highlight");k.append(Te("b","","\u770B\u70B9"),c.highlight),H.append(k)}if(c.note&&H.append(Te("p","lead",c.note)),c.story?.length){let k=Te("div","story-box");k.append(Te("h4","",c.story.some(Z=>Z.kind==="\u5730\u8C8C")?"\u5730\u8C8C\u770B\u70B9":"\u6587\u5316\u770B\u70B9"));for(let Z of c.story){let J=Te("p","story");J.append(zd(Z.kind),Z.text),k.append(J)}H.append(k)}else c.architecture&&H.append(Te("p","",c.architecture));if(c.transit?.length){let k=Te("div","transit");for(let Z of c.transit)k.append(Te("p","",`${Z.route}${Z.stop&&Z.route!==Z.stop?`\uFF08${Z.stop}\u7AD9\uFF09`:""}\uFF1A${Z.hours}`)),Z.order&&k.append(Te("small","",Z.order)),Z.phone&&k.append(Te("small","",`\u54A8\u8BE2 ${Z.phone}`));k.append(Te("small","",`\u65F6\u95F4\u4EE5\u73B0\u573A\u4E3A\u51C6 \xB7 \u4E5D\u534E\u5C71\u98CE\u666F\u533A\u5B98\u7F51 ${t.transit?.retrieved||""} \u67E5\u8BE2`)),H.append(k)}let Y=vp(c.featured?"\u5EFA\u6A21\u8BF4\u660E":c.photos?.length?"\u8D44\u6599\u4E0E\u7167\u7247\u51FA\u5904":"\u8D44\u6599\u4E0E\u4F9D\u636E");if(c.storySources?.length){let k=Au({sources:c.storySources});k.prepend(Te("span","","\u6587\u5B57\u51FA\u5904")),Y.append(k)}if(c.halls?.length&&Y.append(Te("p","",`\u5BFA\u5185\u6BBF\u5802 ${c.halls.length} \u5904\uFF1A${c.halls.slice(0,8).map(k=>k.n).join("\u3001")}${c.halls.length>8?"\u7B49":""}\uFF1B\u9760\u8FD1\u65F6\u663E\u793A\u4E3A\u5C0F\u6807\u6CE8\u3002`)),c.photos?.length){let k=Te("div","photo-credits");k.append(Te("h4","",`\u5B9E\u62CD\u7167\u7247 \xB7 ${c.photos.length} \u5F20`));for(let Z of c.photos)k.append(Te("p","",Z.alt),kd(Z));Y.append(k)}for(let k of[`\u5B9A\u4F4D\uFF1A${Rx(c)}`,c.story?.length&&c.architecture,c.modelNote,c.positionNote,c.viewing?.source,c.aliases?.length&&!c.featured&&"\u5176\u4ED6\u540D\u79F0\uFF1A"+c.aliases.slice(0,4).join("\u3001"),c.category==="village"&&c.addressCount&&`\u7EA6 ${c.addressCount} \u4E2A\u516C\u5F00\u5730\u5740\u542B\u6B64\u5730\u540D\u3002`,c.quality?.startsWith("legacy")&&"\u6B64\u70B9\u6CBF\u7528\u539F\u7248\u5BFC\u89C8\u4F4D\u7F6E\uFF0C\u5C1A\u672A\u83B7\u5F97\u72EC\u7ACB\u5750\u6807\u8BC1\u636E\uFF1B\u865A\u7EBF\u6807\u6CE8\u8868\u793A\u5F85\u6838\u3002"])k&&Y.append(Te("p","",k));if(Y.append(Te("p","coords",`${c.lon?.toFixed(6)??""}\xB0E \xB7 ${c.lat?.toFixed(6)??""}\xB0N`),Au(c)),H.append(Y),c.featured){let k=Te("div","card-actions"),Z=Te("a","btn accent");Z.href="tel:"+kx,Z.innerHTML=Wx,Z.append(Te("span","full","\u81F4\u7535 "+_p),Te("span","short","\u81F4\u7535\u6C11\u5BBF")),Z.setAttribute("aria-label","\u81F4\u7535\u5C45\u4E4B\u6797\u6C11\u5BBF "+_p),k.append(Z),j.append(k)}};if(Hn&&(Gt("#panel").classList.add("closed"),Ki()),Zi(".place-item").forEach(U=>U.classList.toggle("selected",U.dataset.name===c.n)),!m){hi?.stopPreview(),Oi.cancel(),b();return}let E=Gt("#card");E.classList.contains("show")&&ko(E,440),fp(),Eu();let R=c.featured?Su():dp(c);Gt("#flight-hint .fh-name").textContent=c.displayName||(c.featured?c.shortName:c.n),Gs(R,up(R),()=>{if(_!==Xa||ji!==c){Ki();return}E.classList.add("arrive"),b(),clearTimeout(E._arrive),E._arrive=setTimeout(()=>E.classList.remove("arrive"),1600)},150)}function qx(c){mp(),hi?.stopPreview(),Oi.cancel(),Xa++,ec();let m=c.positionQuality==="ml_roofprint",_=gp(c.name||c.precinct||c.templeGuess||"\u5BFA\u9662\u5EFA\u7B51","\u5BFA\u9662\u5EFA\u7B51",{cat:"temple",sub:c.precinct?`${c.precinct} \u5BFA\u9662\u8303\u56F4\u5185`:""}),b=Te("div","chips");b.append(Te("span","",`\u5360\u5730\u7EA6 ${Math.round(c.area)} m\xB2`),Te("span","",`${c.levels||"-"} \u5C42`),Te("span","",`\u5899\u9AD8 ${c.wallHeight.toFixed(1)} m`)),_.append(b);let E=vp("\u5916\u89C2\u4E0E\u6570\u636E\u4F9D\u636E");E.append(Te("p","",m?"\u5E73\u9762\u8F6E\u5ED3\u6765\u81EA\u5F71\u50CF\u8BC6\u522B\uFF0C\u53EF\u80FD\u5305\u542B\u8BC6\u522B\u8BEF\u5DEE\u3002":"\u5E73\u9762\u5F62\u72B6\u4E0E\u671D\u5411\u6765\u81EA\u5730\u56FE\u8BB0\u5F55\u3002")),c.styleRule&&E.append(Te("p","",`\u5916\u89C2\u4F9D\u636E\uFF08${{observed:"\u7167\u7247\u89C2\u5BDF",documented:"\u6587\u732E\u8BB0\u8F7D",inferred:"\u63A8\u65AD",secondary:"\u4E8C\u624B\u8D44\u6599"}[c.styleCertainty]||c.styleCertainty||"\u63A8\u65AD"}\uFF09\uFF1A${c.styleRule}\u3002\u9010\u680B\u697C\u5C42\u4E0E\u95E8\u7A97\u672A\u7ECF\u5B9E\u6D4B\u3002`)),E.append(Au({sources:[{name:"\u67E5\u770B\u5EFA\u7B51\u6570\u636E\u6765\u6E90",url:c.source}]})),_.append(E);let R=Te("div","card-actions"),U=Hx("ghost",Gx,"\u73AF\u770B\u8FD9\u680B\u5EFA\u7B51");U.onclick=()=>{fp(),Gs(ds(...c.center,Math.max(70,c.width*3),Wa()+70,66)),Eu()},R.append(U),_.append(R)}let bp=new Bh,Sp=new de;function Yx(c){if(Oi.active||!Yt.visible)return;Sp.set(c.clientX/innerWidth*2-1,-c.clientY/innerHeight*2+1),bp.setFromCamera(Sp,Ct);let m=bp.intersectObjects(Vn,!0)[0],_=m&&um(m.object,Ex,Sx);if(_){Ja(_,!1);return}let b=m&&t.buildings[m.object.userData.triangleIds?.[m.faceIndex]];b?.style==="temple"?qx(b):Hn&&Jo()}let Ep=c=>Zl==="all"||(Ax[Zl]||[Zl]).includes(c.category);function $x(c,m=Xo){return Ep(c)&&lp.score(c,m)>=0}function sc(c){let m=Gt("#place-list");m.classList.toggle("animate",!!c),m.replaceChildren();let _=lp.search(Xo,{accept:E=>Ep(E)&&(qr(Xo)?!0:E.searchable||E===br)});Gt("#list-summary").textContent=`${_.length} \u4E2A\u7ED3\u679C \xB7 \u53EF\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u516C\u5171\u8BBE\u65BD\u4E0E\u5546\u5BB6`;let b=_.slice(0,Xo?400:220);b.forEach((E,R)=>{let U=Te("button","place-item"+(E===br?" featured":"")+(E===ji?" selected":""));c&&(U.style.animationDelay=Math.min(R,14)*16+"ms"),U.dataset.name=E.n,U.dataset.placeId=E.placeId,U.type="button",U.append(Te("span","pi-icon c-"+E.category,E===br?"\u5BBF":Tx[E.category]||"\xB7"));let W=Te("span","pi-text");W.append(Te("strong","",E.displayName||(E===br?E.shortName:E.n)),Te("small",xu(E)?"estimate":"",E===br?`\u7CBE\u9009\u6C11\u5BBF \xB7 ${E.address}`:[yp[E.category],E.highlight||(E.viewing?`\u53EF\u8FDC\u773A${E.viewing.name}`:E.zone)].filter(Boolean).join(" \xB7 ")+(xu(E)?" \xB7 \u4F4D\u7F6E\u5F85\u6838":""))),U.append(W),U.onclick=()=>Ja(E,!0),m.append(U)}),_.length>b.length&&m.append(Te("p","empty",`\u53E6\u6709 ${_.length-b.length} \u4E2A\u70B9\u4F4D\u672A\u5217\u51FA\uFF0C\u8BF7\u8F93\u5165\u540D\u79F0\u3001\u95E8\u724C\u6216\u6751\u540D\u7F29\u5C0F\u8303\u56F4\u3002`)),_.length||m.append(Te("p","empty","\u6CA1\u6709\u5339\u914D\u7684\u5730\u70B9\u3002\u53EF\u4EE5\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u6751\u540D\u6216\u8F66\u7AD9\u3001\u516C\u5395\u3001\u505C\u8F66\u573A\uFF0C\u4F8B\u5982\u201C\u5316\u57CE\u5BFA\u201D\u201C\u51E4\u51F0\u677E\u201D\u201C\u8F66\u7AD9\u201D\u3002"))}let Zx=om(Gt("#search"),c=>{Xo=c,rt=!0,sc()}),Jx=()=>Zx.flush();Zi("[data-category]").forEach(c=>c.onclick=()=>{Jx(),Zl=c.dataset.category,Zi("[data-category]").forEach(m=>m.classList.toggle("active",m===c)),sc(!0)}),sc();function wp(){pp(Gt(".panel-tabs"),Gt(".panel-tabs .active"),"--tab-x","--tab-w")}function rc(c){let m=Gt(".panel-tabs .active")?.dataset.tab;Zi(".panel-tabs [data-tab]").forEach(_=>{let b=_.dataset.tab===c;_.classList.toggle("active",b),_.setAttribute("aria-selected",b),_.tabIndex=b?0:-1}),Gt("#tab-routes").hidden=c!=="routes",Gt("#tab-places").hidden=c!=="places",Gt("#tab-guide").hidden=c!=="guide",c==="places"&&m!=="places"&&sc(!0),wp()}function oc(c){let m=Gt("#panel"),_=document.activeElement;m.classList.contains("closed")&&!m.contains(_)&&(Cu=_!==document.body?_:null),hi?.stopPreview(),!Hn&&(Gt("#card").classList.contains("show")||Oi.destination?.onDone)&&Jo(!1),Oi.cancel(),c&&rc(c),Za("directory"),m.classList.remove("closed"),ja(),requestAnimationFrame(wp);let b=Gt(".tab-pane:not([hidden])");nc(b?.id==="tab-places"?Gt("#search"):b?.id==="tab-routes"&&!Gt("#route-detail").hidden?Gt("#route-detail"):Gt('.panel-tabs [aria-selected="true"]'))}Zi(".panel-tabs [data-tab]").forEach(c=>c.onclick=()=>rc(c.dataset.tab)),rc("routes"),Xg(t,Gt("#guide")),Gt(".panel-tabs").addEventListener("keydown",c=>{let m=Zi(".panel-tabs [data-tab]"),_=m.indexOf(document.activeElement),b={ArrowLeft:_-1,ArrowRight:_+1,Home:0,End:m.length-1}[c.key];if(_<0||b===void 0)return;c.preventDefault();let E=m[(b+m.length)%m.length];rc(E.dataset.tab),E.focus()});function Tp(){let c=Gt("#panel"),m=c.contains(document.activeElement);return c.classList.add("closed"),Gt("#search").blur(),ja(),m}function Lu(c){(c||Zo())&&qa(Cu,Gt("#panel-open"),Gt("#route-hud .rh-list")),Cu=null}Gt("#panel-close").onclick=()=>{let c=hi?.active&&!hi.canResume&&!Gt("#tab-routes").hidden,m=Tp();c&&(hi.close(),Tu("town")),Lu(m)},Gt("#panel-open").onclick=()=>oc("places"),Gt("#routes-open").onclick=()=>oc("routes"),Gt("#guide-open").onclick=()=>oc("guide"),Hn&&Gt("#panel").classList.add("closed"),Gt("#settings-toggle").onclick=()=>{let c=Gt("#settings").classList.contains("collapsed");c&&Za("settings"),$a(c)},$a(!1),Gt("#featured-cta").onclick=()=>Ja(br,!0);function jx(){let c=innerWidth,m=innerHeight,_=Gt("#panel"),b=Gt("#card"),E=!_.classList.contains("closed"),R=Gt("#route-hud"),U=Gt(".rail"),W=U.querySelector(".map-actions"),H=document.body.classList.contains("map-chrome-hidden")?0:Gt(".viewbar").getBoundingClientRect().bottom,D=m,j=0,Y=c,k=!!W?.offsetWidth&&getComputedStyle(W).visibility!=="hidden";if(Hn)E?_.offsetWidth>c*.6?D=_.offsetTop:Y=_.offsetLeft:c>m&&k&&(Y=U.offsetLeft-8);else{j=Ap(b.classList.contains("show")?b:E?_:null),k&&(Y=U.offsetLeft-12);let Z=Gt(".map-meta");Z.offsetHeight&&(D=Math.min(m,Z.offsetTop-8))}return!R.hidden&&R.offsetParent&&(H=Math.max(H,R.getBoundingClientRect().bottom)),{left:j,top:H,right:Y,bottom:D,shiftX:kr.x,shiftY:kr.y}}let Kx=".brand,.viewbar,.rail>*,.dock,.map-meta>*,#route-hud,#flight-hint,.settings-wrap";function Qx(){let c=[];for(let m of Zi(Kx)){if(!m.offsetWidth||m.closest(".is-hidden")||getComputedStyle(m).visibility==="hidden")continue;let _=m.getBoundingClientRect();c.push([_.left,_.top,_.right,_.bottom])}return c}hi=Gg({routes:t.routes||[],scene:Wt,world:At,camera:Ct,controls:ne,hAt:v,realH:f,fly:Gs,pose:ds,openPanel:oc,isMobile:()=>Hn,visibleRect:jx,covers:Qx,onFrame:c=>cp.push(c),cancelFlight:()=>{Oi.destination?.onDone||Oi.cancel()},onPlaybackChange:()=>{hr=null,qo&&Ki(),Xx()},closeSheetsForRoute:()=>{let c=document.activeElement,m=Hn&&!Gt("#panel").classList.contains("closed")&&Gt("#panel").contains(c)||Gt("#card").classList.contains("show")&&Gt("#card").contains(c);Jo(!1),Hn&&Gt("#panel").classList.add("closed"),ja(),m&&nc(Gt("#route-hud .rh-play"))}}),Gt("#route-hud .rh-close").onclick=()=>{let c=Gt("#route-hud").contains(document.activeElement),m=Gt("#card").classList.contains("show"),_=!!Oi.destination?.onDone;hi.close(),m||_?Cs={...wu(),view:"town"}:Tu("town"),(c||Zo())&&qa(m?Gt("#card .card-head h2"):null,_?Ya:null,!Hn&&!Gt("#panel").classList.contains("closed")?Gt("#route-list .route-card"):null,Gt("#routes-open"),Gt("#panel-open"))},jg({compact:Hd,closePanel:()=>Lu(Tp())}),addEventListener("sheetchange",()=>Ki()),Gt("#layer-buildings").onchange=c=>Yt.visible=c.target.checked,Gt("#layer-trees").onchange=c=>{sp=c.target.checked,rp()},Gt("#layer-trails").onchange=c=>Me.visible=c.target.checked,Gt("#height").oninput=c=>{let m=At.scale.y;h=+c.target.value;let _=h/l;c.target.style.setProperty("--fill",(h-1)/.8*100+"%"),At.scale.y=_,Gt("#height-value").textContent=h===1?"\u771F\u5B9E\u6BD4\u4F8B \xD71.0":`\u5730\u5F62\u589E\u5F3A \xD7${h.toFixed(1)}`;let b=v(ne.target.x,ne.target.z)*(_-m);if(ne.target.y+=b,Ct.position.y+=b,Cs){let E=v(Cs.target.x,Cs.target.z)*(_-m);Cs.target.y+=E,Cs.pos.y+=E}for(let E of cr)E.label&&(E.label.position.y=(E.top+5)*_);for(let E of Kl)E.label.position.y=(E.top+4)*_},Gt("#data-content").innerHTML=Qg({W:e,D:n,stats:t.stats,transit:t.transit,places:cr});let Iu=null;Gt("#credit-data").onclick=Gt("#credit-mobile").onclick=c=>{Iu=c.currentTarget,Za("data"),Gt("#data-dialog").showModal(),Ki()},Gt("#data-close").onclick=Pu,Gt("#data-dialog").onclick=c=>{c.target===Gt("#data-dialog")&&Pu()},Gt("#data-dialog").addEventListener("close",()=>{qo&&(Ki(),Zo()&&qa(Iu,Gt("#credit-mobile"),Gt("#credit-data")),Iu=null)}),Gt("#capture").onclick=()=>{let c=ix({frame:p.domElement,stats:t.stats,render:_=>(Ct.updateMatrixWorld(),Pp(_),Zt(),p.render(Wt,Ct),hi?.updateLabels(performance.now()),Lp(),rt=!0,[...nt.domElement.children])}),m=document.createElement("a");m.download="\u4E5D\u534E\u5C71\u4E09\u7EF4\u5730\u56FE-\u5B9E\u666F\u589E\u5F3A\u7248.png",m.href=c.toDataURL("image/png"),m.click(),Bl("\u5F53\u524D\u4E09\u7EF4\u753B\u9762\u5DF2\u5BFC\u51FA")};let t1=43,zr={x:0,y:0},kr={x:0,y:0};function Du(){let c=innerWidth,m=innerHeight,{x:_,y:b}=zr,E=c+2*Math.abs(_),R=m+2*Math.abs(b);Ct.aspect=E/R,Ct.fov=Math.atan(Math.tan(t1*Math.PI/360)*R/m)*360/Math.PI,E>c+1||R>m+1?Ct.setViewOffset(E,R,_>0?2*_:0,b>0?2*b:0,c,m):Ct.clearViewOffset(),Ct.updateProjectionMatrix()}function Ap(c){return c&&c.offsetWidth?c.offsetLeft+c.offsetWidth+12:0}function Ki(){let c=innerWidth,m=innerHeight,_=Gt("#card"),b=Gt("#panel"),E=document.body,R=!b.classList.contains("closed"),U=_.classList.contains("show"),W=!Gt("#settings").classList.contains("collapsed"),H=!!Oi.destination?.onDone,D=0,j=0,Y=Gt("#viewer").classList.contains("show"),k=R||U||H||!!hi?.active||Gt("#data-dialog").open||Y,Z=Hn?k||W:!!hi?.active;E.classList.toggle("panel-open",R),E.classList.toggle("card-open",U),E.classList.toggle("settings-open",W),E.classList.toggle("card-flight",H),E.classList.contains("map-chrome-hidden")!==Z&&(E.classList.toggle("map-chrome-hidden",Z),Z&&rx.stop());for(let pt of Zi(".map-chrome")){let Ut=Hn?pt.id==="settings"?k:Z:Z&&pt.matches(".viewbar");if(pt.inert!==(Ut||Y)&&(pt.inert=Ut||Y),pt.classList.contains("is-hidden")!==Ut){pt.classList.toggle("is-hidden",Ut),pt.setAttribute("aria-hidden",String(Ut)),pt.matches("button")&&(pt.disabled=Ut);for(let xt of pt.querySelectorAll("button"))xt.disabled=Ut}}for(let pt of Gt("#app").children){if(pt.id==="viewer"||pt.matches(".map-chrome,dialog"))continue;let Ut=Y||pt.id==="panel"&&!Hn&&U;pt.inert!==Ut&&(pt.inert=Ut)}let J=Gt("#flight-hint"),at=!kl&&H&&!!J.querySelector(".fh-name").textContent;if(at&&!J.classList.contains("show")?Ba(J):!at&&J.classList.contains("show")&&ko(J,240),!Hn)D=-Ap(U?_:R||H?b:null)/2;else{let pt=U?_:R?b:null;if(pt&&pt.offsetWidth>c*.6){let Ut=Gt(".viewbar"),xt=Z?pt===_?8:0:Ut.offsetTop+Ut.offsetHeight;j=Math.max(0,m/2-(xt+pt.offsetTop)/2)}else pt&&(D=Math.max(0,(c-pt.offsetLeft)/2))}kr={x:D,y:j},qo||(zr={x:D,y:j},Du())}function ja(){rt=!0,po(),T.setCeiling(x()),B(M);let c=innerWidth,m=innerHeight,_=Hd(),b=_!==Hn;b&&(Hn=_,_&&(Gt("#panel").classList.add("closed"),$a(!1)),p.shadowMap.enabled=Re.castShadow=L()),p.setSize(c,m),nt.setSize(c,m);let E=!Hn&&!Gt("#panel").classList.contains("closed");document.body.classList.toggle("with-panel",E),Ki(),Du(),tc(),b&&ji&&Gt("#card").classList.contains("show")&&!Oi.active&&Gs(ji.featured?Su():dp(ji),700)}function jo(){let c=window.visualViewport,m=c?c.height:innerHeight,_=document.activeElement===Gt("#search"),b=Hn&&_&&c?Math.max(0,innerHeight-c.height-c.offsetTop):0;document.documentElement.style.setProperty("--visible-height",`${Math.round(m)}px`),document.documentElement.style.setProperty("--keyboard-inset",b>120?`${Math.round(b)}px`:"0px"),document.body.classList.toggle("keyboard-open",b>120)}window.visualViewport?.addEventListener("resize",jo),window.visualViewport?.addEventListener("scroll",jo),addEventListener("focusin",jo),addEventListener("focusout",()=>requestAnimationFrame(jo)),addEventListener("resize",jo),jo(),addEventListener("keydown",c=>{let m=Gt("#viewer");if(!m.hidden){c.key==="Escape"?zx():(c.key==="ArrowLeft"||c.key==="ArrowRight")&&m._go(c.key==="ArrowLeft"?-1:1);return}if(c.key==="Escape"&&!Gt("#data-dialog").open){let _=Gt("#panel"),b=Hn&&!_.classList.contains("closed"),E=_.contains(document.activeElement);Jo(),Za("detail"),Hn||$a(!1),b&&Lu(E)}}),addEventListener("resize",ja),ja();let Ka=new X;function Rp(c,m=4,_=0){let b=Ct.position,E=c.label.position,R=_?1-_/Math.max(_*1.2,b.distanceTo(E)):1;for(let U=2;U<24&&U/24<R;U++){let W=U/24,H=b.x+(E.x-b.x)*W,D=b.z+(E.z-b.z)*W;if(!(Math.abs(H)>e/2||Math.abs(D)>n/2)&&v(H,D)*At.scale.y>b.y+(E.y-b.y)*W+m)return!0}return!1}let Cp=".brand,.viewbar,.rail>*,.dock,.map-meta,#route-hud,#flight-hint,#panel,#card,.settings-wrap";function e1(c){let m=0,_=0;for(let b=c;b;b=b.offsetParent)m+=b.offsetLeft,_+=b.offsetTop;return[m,_,m+c.offsetWidth,_+c.offsetHeight]}function n1(){let c=innerWidth,m=innerHeight,_=!Gt("#settings").classList.contains("collapsed");tt=!1,ft=[],Mt++;for(let b of Zi(Cp)){if(!b.offsetWidth||b.closest(".is-hidden")||b.id==="panel"&&b.classList.contains("closed")||(b.id==="card"||b.id==="flight-hint")&&!b.classList.contains("show")||b.matches(".settings-wrap")&&!_||getComputedStyle(b).visibility==="hidden")continue;let E=e1(b);b.matches(".sheet")?(Hn?b.offsetWidth>c*.6?(E[0]=0,E[2]=c):(E[1]=0,E[2]=c):E[0]=E[1]=0,E[3]=m):(E[0]<16&&(E[0]=0),c-E[2]<16&&(E[2]=c),E[1]<16&&(E[1]=0),m-E[3]<16&&(E[3]=m)),(b.matches(".sheet")||Hn&&b.matches(".settings-wrap"))&&E.push(1),ft.push(E)}}function po(){tt=!0,po.t||(rt=!0),clearTimeout(po.t),po.t=setTimeout(()=>{po.t=0,tt=rt=!0},520)}{let c=new MutationObserver(po),m=window.ResizeObserver&&new ResizeObserver(po);c.observe(document.body,{attributes:!0,attributeFilter:["class"]});for(let _ of Zi(Cp))c.observe(_,{attributes:!0,attributeFilter:["class","hidden"]}),m?.observe(_)}function i1(c,m){let _=c.pos;if(_&&_.ox===m.ox&&_.oy===m.oy&&_.len===m.len&&_.ang===m.ang)return;c.pos=m;let b=c.el.style;b.setProperty("--dx",m.ox+"px"),b.setProperty("--dy",m.oy+"px"),b.setProperty("--len",m.len+"px"),b.setProperty("--ang",m.ang+"deg")}let s1=c=>({ox:0,oy:-c.stem,len:c.stem,ang:-90});function Pp(c,m=!1){re++;let _=!1;w.length=0;let b=Gt("#layer-labels").checked,E=[],R=innerWidth,U=innerHeight,W=Ct.position,H=ap??(Hn?28:60);b&&!c&&tt&&n1();let D=c||(b?ft:[]),j=D.filter(N=>N[4]),Y=D.filter(N=>!N[4]),k=!Gt("#panel").classList.contains("closed")&&!Gt("#tab-places").hidden,Z=document.body.classList.contains("route-on");for(let N of Ux){let ot=N.label.position,mt=Math.hypot(ot.x-W.x,ot.y-W.y,ot.z-W.z),st=N===ji?2:N.tier||0,ht=b&&(!Z||N===ji)&&(mt<N.limit||N===ji||N.hall&&N.parent===ji&&mt<900)&&(N.road||N.hall||N.featured||N===ji||!k||$x(N,Xo)),ut=0,it=0;if(ht){Ka.copy(ot).project(Ct),ut=(Ka.x+1)*R/2,it=(1-Ka.y)*U/2;let Tt=N.labelWidth/2,Ce=it-N.labelHeight;if(Ka.z>1||Ka.z<0||(st?ut<4||ut>R-4||it<4||it>U-8:ut<Tt+4||ut>R-Tt-4||Ce<4||it>U-18))ht=!1;else if(st){for(let Dt of st>1?j:D)if(ut>Dt[0]&&ut<Dt[2]&&it>Dt[1]&&it<Dt[3]){ht=!1;break}}else for(let Dt of D)if(ut-Tt<Dt[2]&&ut+Tt>Dt[0]&&Ce<Dt[3]&&it+4>Dt[1]){ht=!1;break}}if(ht&&!N.road&&!N.featured){let Tt=st?Rp(N,N.occ?0:10,150):Rp(N);Tt!==N.occ?(N.occN=(N.occN||0)+1,N.occ===void 0||N.occN>=2?(N.occ=Tt,N.occN=0):_=!0):N.occN=0,N.occ&&(ht=!1)}E.push({p:N,dist:mt,x:ut,y:it,v:ht,tier:st})}E.sort((N,ot)=>!!ot.p.featured-!!N.p.featured||(ot.p===ji)-(N.p===ji)||ot.tier-N.tier||N.p.p-ot.p.p||N.dist-ot.dist),Jl=0;let J=(N,ot)=>Math.max(0,Math.min(N[2],ot[2])-Math.max(N[0],ot[0]))*Math.max(0,Math.min(N[3],ot[3])-Math.max(N[1],ot[1])),at=(N,ot,mt)=>N>mt[0]&&N<mt[2]&&ot>mt[1]&&ot<mt[3],pt=(N,ot,mt,st,ht)=>{let ut=0,it=1,Tt=mt-N,Ce=st-ot;for(let[Dt,ae]of[[-Tt,N-ht[0]],[Tt,ht[2]-N],[-Ce,ot-ht[1]],[Ce,ht[3]-ot]])if(Dt){let he=ae/Dt;if(Dt<0){if(he>it)return!1;he>ut&&(ut=he)}else{if(he<ut)return!1;he<it&&(it=he)}}else if(ae<0)return!1;return it-ut>.02},Ut=(N,ot)=>{let mt=(st,ht,ut)=>(ht[0]-st[0])*(ut[1]-st[1])-(ht[1]-st[1])*(ut[0]-st[0]);return mt(N[0],N[1],ot[0])*mt(N[0],N[1],ot[1])<0&&mt(ot[0],ot[1],N[0])*mt(ot[0],ot[1],N[1])<0},xt=[],Ht=[],kt=E.filter(N=>N.v&&N.tier).map(N=>[N.x,N.y,N.p]),bt=0;for(let N of E){let ot=null;if(N.v){let mt=N.p,st=mt.labelWidth/2,ht=mt.labelHeight-mt.stem,ut=[N.x,N.y],it=(Tt,Ce)=>{let Dt=[N.x+Tt-st,N.y+Ce-ht,N.x+Tt+st,N.y+Ce],ae=Xn(N.x,Dt[0],Dt[2]),he=Xn(N.y,Dt[1],Dt[3]),se=Math.hypot(ae-N.x,he-N.y);return{ox:Math.round(Tt*2)/2,oy:Math.round(Ce*2)/2,len:se<3?0:Math.round(se*2)/2,ang:Math.round(Math.atan2(he-N.y,ae-N.x)*180/Math.PI),r:Dt,t:[ae,he]}};if(N.tier){let Tt=[it(0,-mt.stem)],Ce=mt.pos;Ce&&Tt.push(it(Ce.ox,Ce.oy));let Dt=wt=>{let Ot=Math.max(0,2-wt.r[0])+Math.min(0,R-2-wt.r[2]),Q=Math.max(0,2-wt.r[1])+Math.min(0,U-2-wt.r[3]);return Ot||Q?it(wt.ox+Ot,wt.oy+Q):null},ae=Y.some(wt=>at(N.x,N.y,wt)),he=ae?280:190,se=mt.featured?7:4;for(let wt of ae?[10,26,48,76,110,150,200,250]:[10,26,48,76,110,150])for(let Ot=0;Ot<12;Ot++){let Q=(Ot*30-90)*Math.PI/180,Nt=Math.cos(Q),xe=Math.sin(Q),Xt=Math.min(Math.abs(Nt)>.001?st/Math.abs(Nt):1e9,Math.abs(xe)>.001?ht/2/Math.abs(xe):1e9),Pe=it(Nt*(wt+Xt),xe*(wt+Xt)+ht/2);Tt.push(Pe);let ln=Dt(Pe);ln&&Tt.push(ln)}for(let wt of Y)if(!(Math.max(wt[0]-N.x,N.x-wt[2],wt[1]-N.y,N.y-wt[3])>40))for(let Q of[it(0,wt[3]+4+ht-N.y),it(0,wt[1]-4-N.y),it(wt[0]-4-st-N.x,ht/2),it(wt[2]+4+st-N.x,ht/2)]){Tt.push(Q);let Nt=Dt(Q);Nt&&Tt.push(Nt)}let ee=null,ge=1/0,q=null,St=1/0;for(let wt of Tt){let Ot=wt.r;if(Ot[0]<1||Ot[2]>R-1||Ot[1]<1||Ot[3]>U-1||wt.len>he)continue;let Q=.8*Math.max(0,wt.len-mt.stem);if(Ce){let Pe=Math.hypot(wt.ox-Ce.ox,wt.oy-Ce.oy);Q+=m?1.2*Pe+4*Math.max(0,Pe-70):Pe<2?-2:0}if(Q>=ge)continue;let Nt=[Ot[0]-2,Ot[1]-2,Ot[2]+2,Ot[3]+2],xe=0;for(let Pe of D)xe+=4*J(Ot,Pe);for(let Pe of xt)xe+=4*J(Nt,Pe);for(let[Pe,ln,rn]of kt)(rn!==mt?at(Pe,ln,[Nt[0]-3,Nt[1]-3,Nt[2]+3,Nt[3]+3]):wt!==Tt[0]&&at(Pe,ln,[Nt[0]-se,Nt[1]-se,Nt[2]+se,Nt[3]+se]))&&(xe+=rn===mt?3e3:1500);for(let[Pe,ln]of Ht)pt(Pe[0],Pe[1],ln[0],ln[1],[Ot[0]+3,Ot[1]+3,Ot[2]-3,Ot[3]-3])&&(xe+=1200);if(N.tier<2&&xe||xe+Q>=ge)continue;if(wt.len){let[Pe,ln]=wt.t;for(let rn of xt)pt(N.x,N.y,Pe,ln,[rn[0]+3,rn[1]+3,rn[2]-3,rn[3]-3])&&(Q+=1200);for(let rn of Ht)Ut([ut,wt.t],rn)&&(Q+=600);for(let rn of Y)!at(N.x,N.y,rn)&&pt(N.x,N.y,Pe,ln,[rn[0]-4,rn[1]-4,rn[2]+4,rn[3]+4])&&(Q+=900)}let Xt=xe+Q;if(Xt<ge&&(ge=Xt,ee=wt),!xe&&Xt<St&&(St=Xt,q=wt),Xt<=0)break}ot=N.tier>1?ee||Tt[0]:q,ot?(xt.push([ot.r[0]-2,ot.r[1]-2,ot.r[2]+2,ot.r[3]+2]),ot.len&&Ht.push([ut,ot.t]),Jl++):N.v=!1}else{let Tt=[N.x-st-2,N.y-mt.labelHeight-2,N.x+st+2,N.y+4];bt>=H||xt.some(Ce=>J(Tt,Ce))||kt.some(([Ce,Dt])=>at(Ce,Dt,Tt))||Ht.some(([Ce,Dt])=>pt(Ce[0],Ce[1],Dt[0],Dt[1],Tt))?N.v=!1:(xt.push(Tt),bt++,Jl++)}}i1(N.p,ot||s1(N.p)),N.v?(N.p.label.parent||Wt.add(N.p.label),N.p.label.visible=!0,w.push(N.p.label)):N.p.label.parent&&Wt.remove(N.p.label)}return _}function Lp(){Ox(),A.children=w.filter(m=>m.parent).concat(hi?.labelObjects||[],Br),nt.render(A,Ct);let c=+Yo.style.zIndex||0;for(let m of hi?.labelObjects||[])if(m.element.classList.contains("named")){let _=1e3+(+m.element.style.zIndex||0);m.element.style.zIndex=_,c=Math.max(c,_+1)}Yo.style.zIndex=c,Et++}let Qa=0,Ip=0,Uu=0,ac=!1,Hr=0,mo=0,tl=0,Ps=[],el=16.7,go=0,Nu=0,Ou=!0,Fu=!0,Dp=0,Up=0,Np=0,Op=new Nn,Fp=new Nn,Bp=new X,zp=new ys;for(let c of["pointerdown","pointermove","wheel","keydown","input","change","click"])addEventListener(c,m=>{Uu=performance.now(),c!=="pointermove"&&!$o.contains(m.target)&&(hr=null),["keydown","input","change","click"].includes(c)&&(rt=!0)},{capture:!0,passive:!0});function lc(c){mo=c,Hr=performance.now()+3e3,Ps=[]}function cc(c,m){c=Math.max(0,Math.min(Vd,c));let _=di,b=vr;di=c,vr=m==="emergency",(c!==_||vr!==b)&&op()}function kp(c,m){if(c.action==="resolution-down"||c.action==="resolution-up")return B(!1,m),!0;if(c.action==="tier-down"){if(Ou=!1,di>0)cc(mo===2&&di>tl?tl:di-1,"slow");else if(!vr)cc(0,"emergency");else return!1;return iu.set("autoTier",di),!0}return!1}function r1(c,m){if(!(m-C<500)){if(Hr){if(m<Hr-2200||(Ps.push(Math.min(c,250)),m<Hr||Ps.length<12))return;let _=T.observe(Ps,m);if(el=_.mean,go=0,kp(_,m)){lc(mo===2&&di>tl?2:1);return}if(Hr=0,Ps=[],Nu=m+3e3,mo===1&&Ou&&_.fast&&T.limit===T.ceiling&&di<Vd&&!vr){Ou=!1,tl=di,cc(di+1,"probe"),lc(2);return}mo===2&&_.mean>22&&cc(tl,"probe-revert"),mo=0,iu.set("autoTier",di);return}if(el=go?el+(Math.min(c,250)-el)*.05:Math.min(c,250),go++,Ps.push(Math.min(c,250)),Ps.length>240&&Ps.shift(),m>Nu&&go>45){let _=T.observe(Ps,m);kp(_,m),go=0,Ps=[],Nu=m+3e3}}}document.addEventListener("visibilitychange",()=>{document.hidden&&(hr=null),Qa=0,ac=!1,Ps=[],go=0,rt=!0,!document.hidden&&Hr&&lc(mo)});function Hp(c){if(requestAnimationFrame(Hp),document.hidden){Qa=0;return}let m=Qa?c-Qa:16.7;Qa=c;for(let j of cp)j(c,m);Oi.update(c),ne.target.x=Xn(ne.target.x,-e/2,e/2),ne.target.z=Xn(ne.target.z,-n/2,n/2);let _=ne.update();Math.abs(Ct.position.x)<e/2&&Math.abs(Ct.position.z)<n/2&&!ls(Ct.position.x,Ct.position.z)&&(Ct.position.y=Math.max(Ct.position.y,v(Ct.position.x,Ct.position.z)*At.scale.y+8));let b=zr.x!==kr.x||zr.y!==kr.y;if(b){let j=kl?1:1-Math.pow(.86,m/16.7);for(let Y of["x","y"])zr[Y]+=(kr[Y]-zr[Y])*j,Math.abs(zr[Y]-kr[Y])<.4&&(zr[Y]=kr[Y]);Du()}let E=ks&&!Hr&&!Oi.active&&!_&&!b&&!hi?.previewing&&c-Uu>1500;if(E&&!rt&&!Ql&&c-Ip<(c-Uu>8e3?98:48)){ac=!1;return}ac&&!E?r1(m,c):Hr||(Ps=[],go=0),ac=!0,Ip=c,B(E,c),Np++;for(let j of pu){let Y=kl?j.phase:j.kind==="funicular"?(Math.sin(c/16e3)*.5+.5)*.96+.02:(c/14e4+j.phase)%1,k=j.curve.getPoint(Y);j.g.position.copy(k),j.kind==="cable"&&(j.g.position.y-=5.5);let Z=j.curve.getTangent(Y);j.g.rotation.y=Math.atan2(-Z.z,Z.x)}let R=Ct.position.distanceTo(ne.target),U=Or[di];for(let j of an)j.visible=R<U.landmarkDist;for(let j of mu)j.update(R);for(let j of Ga)j.trunk&&(j.trunk.visible=R<U.trunkDist);for(let j of Si)j.visible=R<U.detailDist;if(co){let j=Ct.position.distanceTo(co.position),Y=Xn(j/160,1,26);co.scale.setScalar(Y),co.rotation.y=c/1400;let k=br;k?.label&&(k.label.position.y=(co.userData.base+co.userData.head*Y)*At.scale.y+2*Y)}Ct.updateMatrixWorld();let W=!Op.equals(Ct.matrixWorld)||!Fp.equals(Ct.projectionMatrix);W&&(Fu=!0);let H=rt||Fu&&c-Dp>=110;if(H){let j=Ct.position.distanceTo(Bp)>Math.max(.02,Ct.position.distanceTo(ne.target)*4e-4)||zp.angleTo(Ct.quaternion)>4e-4;Bp.copy(Ct.position),zp.copy(Ct.quaternion),Fu=Pp(null,j)||j,Dp=c}if(H||W&&c-Up>=110){Up=c;let j=ne.target;Re.target.position.copy(j),Re.position.set(j.x-1200,j.y+2100,j.z-1300),Gt("#north-arrow").style.transform=`rotate(${-Wa()}deg)`,Gt("#scene-status").textContent=R<350?"\u5EFA\u7B51\u8FD1\u666F \xB7 \u7EC6\u90E8\u590D\u539F":R<2100?"\u4E5D\u534E\u5C71\u8857\u533A \xB7 \u62D6\u52A8\u73AF\u770B":F2.matches?"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u6EDA\u8F6E\u7F29\u653E":"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u53CC\u6307\u7F29\u653E";let Y=R*2*Math.tan(43*Math.PI/360)/innerHeight*80;Gt("#scale-line").textContent=Y>1e3?`${(Y/1e3).toFixed(1)} km`:`${Math.round(Y/10)*10||5} m`}Zt(),p.render(Wt,Ct);let D=hi?.updateLabels(c);(W||H||D||Ql)&&Lp(),rt=Ql=!1,Op.copy(Ct.matrixWorld),Fp.copy(Ct.projectionMatrix),++wx===30&&console.info("Map verification",JSON.stringify(window.mapDiagnostics))}qo=!0,op(),lc(1),Gt("#loading").classList.add("done"),setTimeout(()=>{Gt("#loading").hidden=!0,document.body.classList.contains("map-chrome-hidden")||rx.start()},700),requestAnimationFrame(Hp),window.mapDiagnostics={version:t.version,buildings:t.stats.buildings,places:cr.length,businesses:t.stats.businesses,trees:ql.length,bamboo:uu.length,roads:t.roads.length,coordinateSystem:t.geo.crs,randomHouses:0,detailModel:"mapped footprints + area-rule facades; only \u5C45\u4E4B\u6797 named among businesses",signs:Ei.length,lanterns:Fr.length,get drawCalls(){return p.info.render.calls},get frames(){return p.info.render.frame},get pixelRatio(){return p.getPixelRatio()},get quality(){return Or[di].name+(vr?"-":"")},get tier(){return di},get frameMs(){return Math.round(el*10)/10},get triangles(){return p.info.render.triangles},get visibleLabels(){return Jl},get resolutionLimit(){return T.limit},get idleResolution(){return M},get spatialMode(){return mu.some(c=>c.near)?"near":"far"},get labelPasses(){return Et},get labelSelections(){return re},get labelCovers(){return ft.map(c=>c.map(Math.round))},get coverMeasures(){return Mt},get animationUpdates(){return Np}}}
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
