var Gr=i=>String(i??"").normalize("NFKC").toLowerCase().replace(/[\s()（）·.,，。\-_/]+/g,""),Kp=[["toilet",["\u516C\u5171\u5395\u6240","\u516C\u5395","\u5395\u6240","\u536B\u751F\u95F4","\u6D17\u624B\u95F4","wc"],i=>i.k==="\u516C\u5171\u5395\u6240"],["cable",["\u7D22\u9053","\u7F06\u8F66"],i=>i.category==="transport"&&/索道|缆车/.test(i.n)||i.k==="cable-car"],["bus",["\u666F\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u7AD9","\u5BA2\u8FD0\u7AD9","\u5DF4\u58EB\u7AD9","\u4E58\u8F66\u5904","\u8F66\u7AD9"],i=>i.category==="transport"&&/bus/.test(i.k)],["visitor",["\u6E38\u5BA2\u670D\u52A1\u5206\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3","\u6E38\u5BA2\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u7AD9"],i=>i.k==="\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3"],["ticket",["\u552E\u7968\u5904","\u552E\u7968\u70B9","\u552E\u7968\u4EAD","\u7968\u52A1"],i=>/售票/.test([i.n,...i.aliases||[]].join(" "))],["parking",["\u505C\u8F66\u573A","\u505C\u8F66\u5904","\u505C\u8F66\u4F4D","\u505C\u8F66"],i=>i.category==="service"&&/停车场|car park/.test(i.k)],["temple",["\u5BFA\u5E99","\u5BFA\u9662"],i=>i.category==="temple"],["hotel",["\u4F4F\u5BBF","\u9152\u5E97","\u65C5\u9986","\u65C5\u5E97"],i=>i.category==="hotel"],["guesthouse",["\u6C11\u5BBF","\u5BA2\u6808"],i=>i.category==="hotel"&&/民宿|客栈/.test(i.n+(i.k||""))],["sight",["\u666F\u70B9","\u666F\u89C2"],i=>["sight","nature"].includes(i.category)],["nature",["\u81EA\u7136\u666F\u89C2","\u5C71\u6C34\u666F\u89C2","\u5C71\u6C34"],i=>i.category==="nature"],["village",["\u6751\u843D","\u6751\u5E84","\u5730\u540D","\u793E\u533A"],i=>i.category==="village"],["service",["\u516C\u5171\u8BBE\u65BD","\u516C\u5171\u670D\u52A1"],i=>["service","transport"].includes(i.category)],["transport",["\u4EA4\u901A","\u4EA4\u901A\u8BBE\u65BD"],i=>i.category==="transport"]],y1=Kp.flatMap(([i,t])=>t.map(e=>({term:Gr(e),id:i}))).sort((i,t)=>t.term.length-i.term.length);function _1(i){let t=[];for(let e of String(i??"").normalize("NFKC").toLowerCase().trim().split(/\s+/)){let n=Gr(e),s="";for(;n;){let r=y1.find(a=>n.startsWith(a.term));r?(s&&t.push({text:s}),s="",t.push({group:r.id}),n=n.slice(r.term.length)):(s+=n[0],n=n.slice(1))}s&&t.push({text:s})}return t}function Qp(i){let t=new Set,e=[];for(let a of i){if(!a.n||!Number.isFinite(a.x)||!Number.isFinite(a.z))continue;let o=a.placeId||a.n;if(t.has(o))continue;t.add(o);let l=[a.n,a.displayName].filter(Boolean).map(Gr),h=[a.shortName,...a.aliases||[],a.viewing?.name].filter(Boolean).map(Gr),u=[...l,...h,a.address,a.zone,a.k].filter(Boolean).map(Gr),f=new Set(Kp.filter(([,,m])=>m(a)).map(([m])=>m));e.push({place:a,names:l,aliases:h,texts:u,groups:f})}let n=null,s=new Map;function r(a){let o=String(a??"");if(o===n||(n=o,s=new Map,o.length>200))return s;let l=Gr(a),h=_1(a);for(let u of e){let f=-1;if(!String(a??"").trim())f=0;else if(!l)f=-1;else if(u.names.includes(l))f=1e3;else if(u.aliases.includes(l))f=900;else if(h.length&&h.every(m=>m.group?u.groups.has(m.group):u.texts.some(d=>d.includes(m.text)))){let m=h.filter(d=>d.text);f=u.names.some(d=>d.startsWith(l))?800:u.names.some(d=>d.includes(l))?700:u.aliases.some(d=>d.includes(l))?600:m.some(d=>u.names.some(y=>y.includes(d.text)))?500:m.some(d=>u.aliases.some(y=>y.includes(d.text)))?400:200}s.set(u.place,f)}return s}return{score(a,o){return r(o).get(a)??-1},search(a,{accept:o=()=>!0}={}){let l=r(a);return e.filter(h=>l.get(h.place)>=0&&o(h.place)).sort((h,u)=>l.get(u.place)-l.get(h.place)||(u.place.featured?1:0)-(h.place.featured?1:0)||(h.place.p??99)-(u.place.p??99)||h.place.n.localeCompare(u.place.n,"zh-CN")).map(h=>h.place)}}}function tm(i,t,{delay:e=90}={}){let n=!1,s,r=()=>{clearTimeout(s),s=void 0},a=()=>{r(),n||t(i.value.trim())},o=u=>{r(),!(n||u?.isComposing)&&(s=setTimeout(a,e))},l=()=>{n=!0,r()},h=()=>{n=!1,o()};return i.addEventListener("input",o),i.addEventListener("compositionstart",l),i.addEventListener("compositionend",h),{flush:a,destroy(){r(),i.removeEventListener("input",o),i.removeEventListener("compositionstart",l),i.removeEventListener("compositionend",h)}}}function em(i){let t=1/0,e=-1/0;for(let n=0;n<i.length;n++)i[n]<t&&(t=i[n]),i[n]>e&&(e=i[n]);return{min:t,max:e}}var nm={"\u516C\u5395\uFF08\u4E09\u89D2\u6D32\u8F66\u7AD9\u505C\u8F66\u573A\u65C1\uFF09":609946470,"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":609892484,"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":609980796,"\u516C\u5171\u5395\u6240(AH-CIZ-0666)":609909660},v1={"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":"facility:toilet-dongya","\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":"facility:toilet-huxingshan",\u864E\u5F62\u5C71\u8F66\u7AD9:"transport:huxingshan-station"},el=i=>v1[i]||`place:${i}`,im="\u4E1A\u4E3B\u6307\u8BA4 \xB7 \u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E";function sm(i){i.places.some(e=>e.n==="\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09")||i.places.push({n:"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09",shortName:"\u516C\u5395",category:"service",k:"\u516C\u5171\u5395\u6240",p:3,zone:"\u4E5D\u534E\u8857\uFF08\u9547\u533A\uFF09",x:-1424,z:-17,lon:117.8115+-1424/95950,lat:30.482- -17/110900,address:"\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1",quality:"owner_reported",src:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09",sources:[{name:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09\uFF0C\u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E",url:""}],sourceFamilies:["owner"],coordinateMethod:"\u6A21\u578B\u5E73\u9762\u5750\u6807\u6309\u9879\u76EE\u6295\u5F71\u6362\u7B97\u4E3A\u8FD1\u4F3C WGS84",modelQuality:"schematic",note:"\u8BBE\u65BD\u7531\u4E1A\u4E3B\u6307\u8BA4\uFF1B\u4F4D\u7F6E\u53CA\u5F53\u524D\u5F00\u653E\u72B6\u6001\u672A\u72EC\u7ACB\u6838\u5B9E\u3002",searchable:!0});let t=i.places.find(e=>e.n==="\u864E\u5F62\u5C71\u8F66\u7AD9");t&&(t.aliases=[...new Set([...t.aliases||[],"\u864E\u5F62\u5C71\u8F66\u7AD9\u552E\u7968\u5904","\u864E\u5F62\u5C71\u552E\u7968\u5904"])]);for(let e of i.places)e.placeId=el(e.n);return i.places}function rm(i,t,e){for(let n=i;n;n=n.parent){if(n.userData?.placeId)return t.get(n.userData.placeId);if(n.userData?.landmark&&e.has(n.userData.landmark))return e.get(n.userData.landmark)}}function om(i,t){if(i?.style==="temple")for(let e of[i.name,i.precinct,i.templeGuess]){let n=t.get(e);if(n?.category==="temple")return n}}function am(i,t,e,n){for(let s=i;s;s=s.parent){if(s.userData?.buildingId)return n.get(s.userData.buildingId);let r=s.userData?.triangleIds?.[t];if(r!==void 0)return e[r]}}var Do={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Uo={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},M1=0,lm=1,b1=2;var X0=1,pd=2,Tr=3,to=0,fs=1,xn=2;var jr=0,Ma=1,cm=2,hm=3,um=4,S1=5,bo=100,E1=101,w1=102,fm=103,dm=104,T1=200,A1=201,R1=202,C1=203,Ef=204,wf=205,P1=206,L1=207,I1=208,D1=209,U1=210,N1=211,O1=212,F1=213,B1=214,z1=0,k1=1,H1=2,kc=3,V1=4,G1=5,W1=6,X1=7,md=0,q1=1,Y1=2,Kr=0,$1=1,Z1=2,J1=3,gd=4,j1=5,K1=6;var q0=300,Ea=301,wa=302,Tf=303,Af=304,Ih=306,eo=1e3,Zs=1001,Rf=1002,Ai=1003,pm=1004;var Gu=1005;var us=1006,Q1=1007;var pl=1008;var Qr=1009,ty=1010,ey=1011,xd=1012,Y0=1013,Zr=1014,Jr=1015,ml=1016,$0=1017,Z0=1018,Eo=1020,ny=1021,Js=1023,iy=1024,sy=1025,wo=1026,Ta=1027,ry=1028,J0=1029,oy=1030,j0=1031,K0=1033,Wu=33776,Xu=33777,qu=33778,Yu=33779,mm=35840,gm=35841,xm=35842,ym=35843,Q0=36196,_m=37492,vm=37496,Mm=37808,bm=37809,Sm=37810,Em=37811,wm=37812,Tm=37813,Am=37814,Rm=37815,Cm=37816,Pm=37817,Lm=37818,Im=37819,Dm=37820,Um=37821,$u=36492,Nm=36494,Om=36495,ay=36283,Fm=36284,Bm=36285,zm=36286;var Hc=2300,Vc=2301,Zu=2302,km=2400,Hm=2401,Vm=2402;var tg=3e3,To=3001,ly=3200,cy=3201,Dh=0,hy=1,Ns="",Wn="srgb",Rr="srgb-linear",yd="display-p3",Uh="display-p3-linear",Gc="linear",ai="srgb",Wc="rec709",Xc="p3";var ta=7680;var Gm=519,uy=512,fy=513,dy=514,eg=515,py=516,my=517,gy=518,xy=519,Cf=35044;var Wm="300 es",Pf=1035,Ar=2e3,qc=2001,fr=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},ji=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],Xm=1234567,ll=Math.PI/180,gl=180/Math.PI;function ur(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(ji[i&255]+ji[i>>8&255]+ji[i>>16&255]+ji[i>>24&255]+"-"+ji[t&255]+ji[t>>8&255]+"-"+ji[t>>16&15|64]+ji[t>>24&255]+"-"+ji[e&63|128]+ji[e>>8&255]+"-"+ji[e>>16&255]+ji[e>>24&255]+ji[n&255]+ji[n>>8&255]+ji[n>>16&255]+ji[n>>24&255]).toLowerCase()}function Ri(i,t,e){return Math.max(t,Math.min(e,i))}function _d(i,t){return(i%t+t)%t}function yy(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function _y(i,t,e){return i!==t?(e-i)/(t-i):0}function cl(i,t,e){return(1-e)*i+e*t}function vy(i,t,e,n){return cl(i,t,1-Math.exp(-e*n))}function My(i,t=1){return t-Math.abs(_d(i,t*2)-t)}function by(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function Sy(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function Ey(i,t){return i+Math.floor(Math.random()*(t-i+1))}function wy(i,t){return i+Math.random()*(t-i)}function Ty(i){return i*(.5-Math.random())}function Ay(i){i!==void 0&&(Xm=i);let t=Xm+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function Ry(i){return i*ll}function Cy(i){return i*gl}function Lf(i){return(i&i-1)===0&&i!==0}function Py(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Yc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function Ly(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),h=r((t+n)/2),u=a((t+n)/2),f=r((t-n)/2),m=a((t-n)/2),d=r((n-t)/2),y=a((n-t)/2);switch(s){case"XYX":i.set(o*u,l*f,l*m,o*h);break;case"YZY":i.set(l*m,o*u,l*f,o*h);break;case"ZXZ":i.set(l*f,l*m,o*u,o*h);break;case"XZX":i.set(o*u,l*y,l*d,o*h);break;case"YXY":i.set(l*d,o*u,l*y,o*h);break;case"ZYZ":i.set(l*y,l*d,o*u,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function hr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Vn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Nh={DEG2RAD:ll,RAD2DEG:gl,generateUUID:ur,clamp:Ri,euclideanModulo:_d,mapLinear:yy,inverseLerp:_y,lerp:cl,damp:vy,pingpong:My,smoothstep:by,smootherstep:Sy,randInt:Ey,randFloat:wy,randFloatSpread:Ty,seededRandom:Ay,degToRad:Ry,radToDeg:Cy,isPowerOfTwo:Lf,ceilPowerOfTwo:Py,floorPowerOfTwo:Yc,setQuaternionFromProperEuler:Ly,normalize:Vn,denormalize:hr},fe=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ri(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},En=class i{constructor(t,e,n,s,r,a,o,l,h){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h)}set(t,e,n,s,r,a,o,l,h){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],h=n[1],u=n[4],f=n[7],m=n[2],d=n[5],y=n[8],_=s[0],p=s[3],x=s[6],A=s[1],M=s[4],P=s[7],C=s[2],T=s[5],D=s[8];return r[0]=a*_+o*A+l*C,r[3]=a*p+o*M+l*T,r[6]=a*x+o*P+l*D,r[1]=h*_+u*A+f*C,r[4]=h*p+u*M+f*T,r[7]=h*x+u*P+f*D,r[2]=m*_+d*A+y*C,r[5]=m*p+d*M+y*T,r[8]=m*x+d*P+y*D,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8];return e*a*u-e*o*h-n*r*u+n*o*l+s*r*h-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8],f=u*a-o*h,m=o*l-u*r,d=h*r-a*l,y=e*f+n*m+s*d;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let _=1/y;return t[0]=f*_,t[1]=(s*h-u*n)*_,t[2]=(o*n-s*a)*_,t[3]=m*_,t[4]=(u*e-s*l)*_,t[5]=(s*r-o*e)*_,t[6]=d*_,t[7]=(n*l-h*e)*_,t[8]=(a*e-n*r)*_,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),h=Math.sin(r);return this.set(n*l,n*h,-n*(l*a+h*o)+a+t,-s*h,s*l,-s*(-h*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Ju.makeScale(t,e)),this}rotate(t){return this.premultiply(Ju.makeRotation(-t)),this}translate(t,e){return this.premultiply(Ju.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Ju=new En;function ng(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function $c(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Iy(){let i=$c("canvas");return i.style.display="block",i}var qm={};function hl(i){i in qm||(qm[i]=!0,console.warn(i))}var Ym=new En().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),$m=new En().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),uc={[Rr]:{transfer:Gc,primaries:Wc,toReference:i=>i,fromReference:i=>i},[Wn]:{transfer:ai,primaries:Wc,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Uh]:{transfer:Gc,primaries:Xc,toReference:i=>i.applyMatrix3($m),fromReference:i=>i.applyMatrix3(Ym)},[yd]:{transfer:ai,primaries:Xc,toReference:i=>i.convertSRGBToLinear().applyMatrix3($m),fromReference:i=>i.applyMatrix3(Ym).convertLinearToSRGB()}},Dy=new Set([Rr,Uh]),Gn={enabled:!0,_workingColorSpace:Rr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Dy.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=uc[t].toReference,s=uc[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return uc[i].primaries},getTransfer:function(i){return i===Ns?Gc:uc[i].transfer}};function ba(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function ju(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var ea,Zc=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{ea===void 0&&(ea=$c("canvas")),ea.width=t.width,ea.height=t.height;let n=ea.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=ea}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=$c("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=ba(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(ba(e[n]/255)*255):e[n]=ba(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Uy=0,Jc=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Uy++}),this.uuid=ur(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(Ku(s[a].image)):r.push(Ku(s[a]))}else r=Ku(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function Ku(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?Zc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Ny=0,Es=class i extends fr{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Zs,s=Zs,r=us,a=pl,o=Js,l=Qr,h=i.DEFAULT_ANISOTROPY,u=Ns){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Ny++}),this.uuid=ur(),this.name="",this.source=new Jc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new fe(0,0),this.repeat=new fe(1,1),this.center=new fe(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new En,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(hl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===To?Wn:Ns),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==q0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case eo:t.x=t.x-Math.floor(t.x);break;case Zs:t.x=t.x<0?0:1;break;case Rf:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case eo:t.y=t.y-Math.floor(t.y);break;case Zs:t.y=t.y<0?0:1;break;case Rf:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return hl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===Wn?To:tg}set encoding(t){hl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===To?Wn:Ns}};Es.DEFAULT_IMAGE=null;Es.DEFAULT_MAPPING=q0;Es.DEFAULT_ANISOTROPY=1;var On=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,h=l[0],u=l[4],f=l[8],m=l[1],d=l[5],y=l[9],_=l[2],p=l[6],x=l[10];if(Math.abs(u-m)<.01&&Math.abs(f-_)<.01&&Math.abs(y-p)<.01){if(Math.abs(u+m)<.1&&Math.abs(f+_)<.1&&Math.abs(y+p)<.1&&Math.abs(h+d+x-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(h+1)/2,P=(d+1)/2,C=(x+1)/2,T=(u+m)/4,D=(f+_)/4,Y=(y+p)/4;return M>P&&M>C?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=T/n,r=D/n):P>C?P<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(P),n=T/s,r=Y/s):C<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(C),n=D/r,s=Y/r),this.set(n,s,r,e),this}let A=Math.sqrt((p-y)*(p-y)+(f-_)*(f-_)+(m-u)*(m-u));return Math.abs(A)<.001&&(A=1),this.x=(p-y)/A,this.y=(f-_)/A,this.z=(m-u)/A,this.w=Math.acos((h+d+x-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},If=class extends fr{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new On(0,0,t,e),this.scissorTest=!1,this.viewport=new On(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(hl("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===To?Wn:Ns),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:us,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new Es(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Jc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Cr=class extends If{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},jc=class extends Es{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ai,this.minFilter=Ai,this.wrapR=Zs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Df=class extends Es{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Ai,this.minFilter=Ai,this.wrapR=Zs,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var ds=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],h=n[s+1],u=n[s+2],f=n[s+3],m=r[a+0],d=r[a+1],y=r[a+2],_=r[a+3];if(o===0){t[e+0]=l,t[e+1]=h,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=m,t[e+1]=d,t[e+2]=y,t[e+3]=_;return}if(f!==_||l!==m||h!==d||u!==y){let p=1-o,x=l*m+h*d+u*y+f*_,A=x>=0?1:-1,M=1-x*x;if(M>Number.EPSILON){let C=Math.sqrt(M),T=Math.atan2(C,x*A);p=Math.sin(p*T)/C,o=Math.sin(o*T)/C}let P=o*A;if(l=l*p+m*P,h=h*p+d*P,u=u*p+y*P,f=f*p+_*P,p===1-o){let C=1/Math.sqrt(l*l+h*h+u*u+f*f);l*=C,h*=C,u*=C,f*=C}}t[e]=l,t[e+1]=h,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],h=n[s+2],u=n[s+3],f=r[a],m=r[a+1],d=r[a+2],y=r[a+3];return t[e]=o*y+u*f+l*d-h*m,t[e+1]=l*y+u*m+h*f-o*d,t[e+2]=h*y+u*d+o*m-l*f,t[e+3]=u*y-o*f-l*m-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,h=o(n/2),u=o(s/2),f=o(r/2),m=l(n/2),d=l(s/2),y=l(r/2);switch(a){case"XYZ":this._x=m*u*f+h*d*y,this._y=h*d*f-m*u*y,this._z=h*u*y+m*d*f,this._w=h*u*f-m*d*y;break;case"YXZ":this._x=m*u*f+h*d*y,this._y=h*d*f-m*u*y,this._z=h*u*y-m*d*f,this._w=h*u*f+m*d*y;break;case"ZXY":this._x=m*u*f-h*d*y,this._y=h*d*f+m*u*y,this._z=h*u*y+m*d*f,this._w=h*u*f-m*d*y;break;case"ZYX":this._x=m*u*f-h*d*y,this._y=h*d*f+m*u*y,this._z=h*u*y-m*d*f,this._w=h*u*f+m*d*y;break;case"YZX":this._x=m*u*f+h*d*y,this._y=h*d*f+m*u*y,this._z=h*u*y-m*d*f,this._w=h*u*f-m*d*y;break;case"XZY":this._x=m*u*f-h*d*y,this._y=h*d*f-m*u*y,this._z=h*u*y+m*d*f,this._w=h*u*f+m*d*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],h=e[2],u=e[6],f=e[10],m=n+o+f;if(m>0){let d=.5/Math.sqrt(m+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-h)*d,this._z=(a-s)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+h)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(r-h)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+h)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Ri(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,h=e._z,u=e._w;return this._x=n*u+a*o+s*h-r*l,this._y=s*u+a*l+r*o-n*h,this._z=r*u+a*h+n*l-s*o,this._w=a*u-n*o-s*l-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}let h=Math.sqrt(l),u=Math.atan2(h,o),f=Math.sin((1-e)*u)/h,m=Math.sin(e*u)/h;return this._w=a*f+this._w*m,this._x=n*f+this._x*m,this._y=s*f+this._y*m,this._z=r*f+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},W=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Zm.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Zm.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,h=2*(a*s-o*n),u=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*h+a*f-o*u,this.y=n+l*u+o*h-r*f,this.z=s+l*f+r*u-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Qu.copy(this).projectOnVector(t),this.sub(Qu)}reflect(t){return this.sub(Qu.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Ri(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Qu=new W,Zm=new ds,Qi=class{constructor(t=new W(1/0,1/0,1/0),e=new W(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Xs.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Xs.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=Xs.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,Xs):Xs.fromBufferAttribute(r,a),Xs.applyMatrix4(t.matrixWorld),this.expandByPoint(Xs);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),fc.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),fc.copy(n.boundingBox)),fc.applyMatrix4(t.matrixWorld),this.union(fc)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,Xs),Xs.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(nl),dc.subVectors(this.max,nl),na.subVectors(t.a,nl),ia.subVectors(t.b,nl),sa.subVectors(t.c,nl),Wr.subVectors(ia,na),Xr.subVectors(sa,ia),xo.subVectors(na,sa);let e=[0,-Wr.z,Wr.y,0,-Xr.z,Xr.y,0,-xo.z,xo.y,Wr.z,0,-Wr.x,Xr.z,0,-Xr.x,xo.z,0,-xo.x,-Wr.y,Wr.x,0,-Xr.y,Xr.x,0,-xo.y,xo.x,0];return!tf(e,na,ia,sa,dc)||(e=[1,0,0,0,1,0,0,0,1],!tf(e,na,ia,sa,dc))?!1:(pc.crossVectors(Wr,Xr),e=[pc.x,pc.y,pc.z],tf(e,na,ia,sa,dc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Xs).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Xs).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Mr[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Mr[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Mr[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Mr[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Mr[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Mr[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Mr[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Mr[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Mr),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Mr=[new W,new W,new W,new W,new W,new W,new W,new W],Xs=new W,fc=new Qi,na=new W,ia=new W,sa=new W,Wr=new W,Xr=new W,xo=new W,nl=new W,dc=new W,pc=new W,yo=new W;function tf(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){yo.fromArray(i,r);let o=s.x*Math.abs(yo.x)+s.y*Math.abs(yo.y)+s.z*Math.abs(yo.z),l=t.dot(yo),h=e.dot(yo),u=n.dot(yo);if(Math.max(-Math.max(l,h,u),Math.min(l,h,u))>o)return!1}return!0}var Oy=new Qi,il=new W,ef=new W,ps=class{constructor(t=new W,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Oy.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;il.subVectors(t,this.center);let e=il.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(il,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(ef.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(il.copy(t.center).add(ef)),this.expandByPoint(il.copy(t.center).sub(ef))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},br=new W,nf=new W,mc=new W,qr=new W,sf=new W,gc=new W,rf=new W,Ao=class{constructor(t=new W,e=new W(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,br)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=br.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(br.copy(this.origin).addScaledVector(this.direction,e),br.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){nf.copy(t).add(e).multiplyScalar(.5),mc.copy(e).sub(t).normalize(),qr.copy(this.origin).sub(nf);let r=t.distanceTo(e)*.5,a=-this.direction.dot(mc),o=qr.dot(this.direction),l=-qr.dot(mc),h=qr.lengthSq(),u=Math.abs(1-a*a),f,m,d,y;if(u>0)if(f=a*l-o,m=a*o-l,y=r*u,f>=0)if(m>=-y)if(m<=y){let _=1/u;f*=_,m*=_,d=f*(f+a*m+2*o)+m*(a*f+m+2*l)+h}else m=r,f=Math.max(0,-(a*m+o)),d=-f*f+m*(m+2*l)+h;else m=-r,f=Math.max(0,-(a*m+o)),d=-f*f+m*(m+2*l)+h;else m<=-y?(f=Math.max(0,-(-a*r+o)),m=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+m*(m+2*l)+h):m<=y?(f=0,m=Math.min(Math.max(-r,-l),r),d=m*(m+2*l)+h):(f=Math.max(0,-(a*r+o)),m=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+m*(m+2*l)+h);else m=a>0?-r:r,f=Math.max(0,-(a*m+o)),d=-f*f+m*(m+2*l)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(nf).addScaledVector(mc,m),d}intersectSphere(t,e){br.subVectors(t.center,this.origin);let n=br.dot(this.direction),s=br.dot(br)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,m=this.origin;return h>=0?(n=(t.min.x-m.x)*h,s=(t.max.x-m.x)*h):(n=(t.max.x-m.x)*h,s=(t.min.x-m.x)*h),u>=0?(r=(t.min.y-m.y)*u,a=(t.max.y-m.y)*u):(r=(t.max.y-m.y)*u,a=(t.min.y-m.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-m.z)*f,l=(t.max.z-m.z)*f):(o=(t.max.z-m.z)*f,l=(t.min.z-m.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,br)!==null}intersectTriangle(t,e,n,s,r){sf.subVectors(e,t),gc.subVectors(n,t),rf.crossVectors(sf,gc);let a=this.direction.dot(rf),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;qr.subVectors(this.origin,t);let l=o*this.direction.dot(gc.crossVectors(qr,gc));if(l<0)return null;let h=o*this.direction.dot(sf.cross(qr));if(h<0||l+h>a)return null;let u=-o*qr.dot(rf);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Un=class i{constructor(t,e,n,s,r,a,o,l,h,u,f,m,d,y,_,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h,u,f,m,d,y,_,p)}set(t,e,n,s,r,a,o,l,h,u,f,m,d,y,_,p){let x=this.elements;return x[0]=t,x[4]=e,x[8]=n,x[12]=s,x[1]=r,x[5]=a,x[9]=o,x[13]=l,x[2]=h,x[6]=u,x[10]=f,x[14]=m,x[3]=d,x[7]=y,x[11]=_,x[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/ra.setFromMatrixColumn(t,0).length(),r=1/ra.setFromMatrixColumn(t,1).length(),a=1/ra.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),h=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let m=a*u,d=a*f,y=o*u,_=o*f;e[0]=l*u,e[4]=-l*f,e[8]=h,e[1]=d+y*h,e[5]=m-_*h,e[9]=-o*l,e[2]=_-m*h,e[6]=y+d*h,e[10]=a*l}else if(t.order==="YXZ"){let m=l*u,d=l*f,y=h*u,_=h*f;e[0]=m+_*o,e[4]=y*o-d,e[8]=a*h,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=d*o-y,e[6]=_+m*o,e[10]=a*l}else if(t.order==="ZXY"){let m=l*u,d=l*f,y=h*u,_=h*f;e[0]=m-_*o,e[4]=-a*f,e[8]=y+d*o,e[1]=d+y*o,e[5]=a*u,e[9]=_-m*o,e[2]=-a*h,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let m=a*u,d=a*f,y=o*u,_=o*f;e[0]=l*u,e[4]=y*h-d,e[8]=m*h+_,e[1]=l*f,e[5]=_*h+m,e[9]=d*h-y,e[2]=-h,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let m=a*l,d=a*h,y=o*l,_=o*h;e[0]=l*u,e[4]=_-m*f,e[8]=y*f+d,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-h*u,e[6]=d*f+y,e[10]=m-_*f}else if(t.order==="XZY"){let m=a*l,d=a*h,y=o*l,_=o*h;e[0]=l*u,e[4]=-f,e[8]=h*u,e[1]=m*f+_,e[5]=a*u,e[9]=d*f-y,e[2]=y*f-d,e[6]=o*u,e[10]=_*f+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Fy,t,By)}lookAt(t,e,n){let s=this.elements;return bs.subVectors(t,e),bs.lengthSq()===0&&(bs.z=1),bs.normalize(),Yr.crossVectors(n,bs),Yr.lengthSq()===0&&(Math.abs(n.z)===1?bs.x+=1e-4:bs.z+=1e-4,bs.normalize(),Yr.crossVectors(n,bs)),Yr.normalize(),xc.crossVectors(bs,Yr),s[0]=Yr.x,s[4]=xc.x,s[8]=bs.x,s[1]=Yr.y,s[5]=xc.y,s[9]=bs.y,s[2]=Yr.z,s[6]=xc.z,s[10]=bs.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],h=n[12],u=n[1],f=n[5],m=n[9],d=n[13],y=n[2],_=n[6],p=n[10],x=n[14],A=n[3],M=n[7],P=n[11],C=n[15],T=s[0],D=s[4],Y=s[8],R=s[12],E=s[1],st=s[5],mt=s[9],Qt=s[13],tt=s[2],lt=s[6],bt=s[10],qt=s[14],Jt=s[3],Tt=s[7],$t=s[11],le=s[15];return r[0]=a*T+o*E+l*tt+h*Jt,r[4]=a*D+o*st+l*lt+h*Tt,r[8]=a*Y+o*mt+l*bt+h*$t,r[12]=a*R+o*Qt+l*qt+h*le,r[1]=u*T+f*E+m*tt+d*Jt,r[5]=u*D+f*st+m*lt+d*Tt,r[9]=u*Y+f*mt+m*bt+d*$t,r[13]=u*R+f*Qt+m*qt+d*le,r[2]=y*T+_*E+p*tt+x*Jt,r[6]=y*D+_*st+p*lt+x*Tt,r[10]=y*Y+_*mt+p*bt+x*$t,r[14]=y*R+_*Qt+p*qt+x*le,r[3]=A*T+M*E+P*tt+C*Jt,r[7]=A*D+M*st+P*lt+C*Tt,r[11]=A*Y+M*mt+P*bt+C*$t,r[15]=A*R+M*Qt+P*qt+C*le,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],h=t[13],u=t[2],f=t[6],m=t[10],d=t[14],y=t[3],_=t[7],p=t[11],x=t[15];return y*(+r*l*f-s*h*f-r*o*m+n*h*m+s*o*d-n*l*d)+_*(+e*l*d-e*h*m+r*a*m-s*a*d+s*h*u-r*l*u)+p*(+e*h*f-e*o*d-r*a*f+n*a*d+r*o*u-n*h*u)+x*(-s*o*u-e*l*f+e*o*m+s*a*f-n*a*m+n*l*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8],f=t[9],m=t[10],d=t[11],y=t[12],_=t[13],p=t[14],x=t[15],A=f*p*h-_*m*h+_*l*d-o*p*d-f*l*x+o*m*x,M=y*m*h-u*p*h-y*l*d+a*p*d+u*l*x-a*m*x,P=u*_*h-y*f*h+y*o*d-a*_*d-u*o*x+a*f*x,C=y*f*l-u*_*l-y*o*m+a*_*m+u*o*p-a*f*p,T=e*A+n*M+s*P+r*C;if(T===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let D=1/T;return t[0]=A*D,t[1]=(_*m*r-f*p*r-_*s*d+n*p*d+f*s*x-n*m*x)*D,t[2]=(o*p*r-_*l*r+_*s*h-n*p*h-o*s*x+n*l*x)*D,t[3]=(f*l*r-o*m*r-f*s*h+n*m*h+o*s*d-n*l*d)*D,t[4]=M*D,t[5]=(u*p*r-y*m*r+y*s*d-e*p*d-u*s*x+e*m*x)*D,t[6]=(y*l*r-a*p*r-y*s*h+e*p*h+a*s*x-e*l*x)*D,t[7]=(a*m*r-u*l*r+u*s*h-e*m*h-a*s*d+e*l*d)*D,t[8]=P*D,t[9]=(y*f*r-u*_*r-y*n*d+e*_*d+u*n*x-e*f*x)*D,t[10]=(a*_*r-y*o*r+y*n*h-e*_*h-a*n*x+e*o*x)*D,t[11]=(u*o*r-a*f*r-u*n*h+e*f*h+a*n*d-e*o*d)*D,t[12]=C*D,t[13]=(u*_*s-y*f*s+y*n*m-e*_*m-u*n*p+e*f*p)*D,t[14]=(y*o*s-a*_*s-y*n*l+e*_*l+a*n*p-e*o*p)*D,t[15]=(a*f*s-u*o*s+u*n*l-e*f*l-a*n*m+e*o*m)*D,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,h=r*a,u=r*o;return this.set(h*a+n,h*o-s*l,h*l+s*o,0,h*o+s*l,u*o+n,u*l-s*a,0,h*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,h=r+r,u=a+a,f=o+o,m=r*h,d=r*u,y=r*f,_=a*u,p=a*f,x=o*f,A=l*h,M=l*u,P=l*f,C=n.x,T=n.y,D=n.z;return s[0]=(1-(_+x))*C,s[1]=(d+P)*C,s[2]=(y-M)*C,s[3]=0,s[4]=(d-P)*T,s[5]=(1-(m+x))*T,s[6]=(p+A)*T,s[7]=0,s[8]=(y+M)*D,s[9]=(p-A)*D,s[10]=(1-(m+_))*D,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=ra.set(s[0],s[1],s[2]).length(),a=ra.set(s[4],s[5],s[6]).length(),o=ra.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],qs.copy(this);let h=1/r,u=1/a,f=1/o;return qs.elements[0]*=h,qs.elements[1]*=h,qs.elements[2]*=h,qs.elements[4]*=u,qs.elements[5]*=u,qs.elements[6]*=u,qs.elements[8]*=f,qs.elements[9]*=f,qs.elements[10]*=f,e.setFromRotationMatrix(qs),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Ar){let l=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),m=(n+s)/(n-s),d,y;if(o===Ar)d=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===qc)d=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Ar){let l=this.elements,h=1/(e-t),u=1/(n-s),f=1/(a-r),m=(e+t)*h,d=(n+s)*u,y,_;if(o===Ar)y=(a+r)*f,_=-2*f;else if(o===qc)y=r*f,_=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*h,l[4]=0,l[8]=0,l[12]=-m,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=_,l[14]=-y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ra=new W,qs=new Un,Fy=new W(0,0,0),By=new W(1,1,1),Yr=new W,xc=new W,bs=new W,Jm=new Un,jm=new ds,Kc=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],h=s[5],u=s[9],f=s[2],m=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Ri(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Ri(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Ri(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Ri(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(m,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Ri(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Ri(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Jm.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Jm,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return jm.setFromEuler(this),this.setFromQuaternion(jm,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};Kc.DEFAULT_ORDER="XYZ";var xl=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},zy=0,Km=new W,oa=new ds,Sr=new Un,yc=new W,sl=new W,ky=new W,Hy=new ds,Qm=new W(1,0,0),t0=new W(0,1,0),e0=new W(0,0,1),Vy={type:"added"},Gy={type:"removed"},xi=class i extends fr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:zy++}),this.uuid=ur(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new W,e=new Kc,n=new ds,s=new W(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Un},normalMatrix:{value:new En}}),this.matrix=new Un,this.matrixWorld=new Un,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new xl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return oa.setFromAxisAngle(t,e),this.quaternion.multiply(oa),this}rotateOnWorldAxis(t,e){return oa.setFromAxisAngle(t,e),this.quaternion.premultiply(oa),this}rotateX(t){return this.rotateOnAxis(Qm,t)}rotateY(t){return this.rotateOnAxis(t0,t)}rotateZ(t){return this.rotateOnAxis(e0,t)}translateOnAxis(t,e){return Km.copy(t).applyQuaternion(this.quaternion),this.position.add(Km.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Qm,t)}translateY(t){return this.translateOnAxis(t0,t)}translateZ(t){return this.translateOnAxis(e0,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Sr.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?yc.copy(t):yc.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),sl.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Sr.lookAt(sl,yc,this.up):Sr.lookAt(yc,sl,this.up),this.quaternion.setFromRotationMatrix(Sr),s&&(Sr.extractRotation(s.matrixWorld),oa.setFromRotationMatrix(Sr),this.quaternion.premultiply(oa.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Vy)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Gy)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Sr.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Sr.multiply(t.parent.matrixWorld)),t.applyMatrix4(Sr),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sl,t,ky),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(sl,Hy,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let h=0,u=l.length;h<u;h++){let f=l[h];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),h=a(t.textures),u=a(t.images),f=a(t.shapes),m=a(t.skeletons),d=a(t.animations),y=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),m.length>0&&(n.skeletons=m),d.length>0&&(n.animations=d),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let l=[];for(let h in o){let u=o[h];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};xi.DEFAULT_UP=new W(0,1,0);xi.DEFAULT_MATRIX_AUTO_UPDATE=!0;xi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var Ys=new W,Er=new W,of=new W,wr=new W,aa=new W,la=new W,n0=new W,af=new W,lf=new W,cf=new W,_c=!1,xa=class i{constructor(t=new W,e=new W,n=new W){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),Ys.subVectors(t,e),s.cross(Ys);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){Ys.subVectors(s,e),Er.subVectors(n,e),of.subVectors(t,e);let a=Ys.dot(Ys),o=Ys.dot(Er),l=Ys.dot(of),h=Er.dot(Er),u=Er.dot(of),f=a*h-o*o;if(f===0)return r.set(0,0,0),null;let m=1/f,d=(h*l-o*u)*m,y=(a*u-o*l)*m;return r.set(1-d-y,y,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,wr)===null?!1:wr.x>=0&&wr.y>=0&&wr.x+wr.y<=1}static getUV(t,e,n,s,r,a,o,l){return _c===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),_c=!0),this.getInterpolation(t,e,n,s,r,a,o,l)}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,wr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,wr.x),l.addScaledVector(a,wr.y),l.addScaledVector(o,wr.z),l)}static isFrontFacing(t,e,n,s){return Ys.subVectors(n,e),Er.subVectors(t,e),Ys.cross(Er).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return Ys.subVectors(this.c,this.b),Er.subVectors(this.a,this.b),Ys.cross(Er).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return _c===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),_c=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;aa.subVectors(s,n),la.subVectors(r,n),af.subVectors(t,n);let l=aa.dot(af),h=la.dot(af);if(l<=0&&h<=0)return e.copy(n);lf.subVectors(t,s);let u=aa.dot(lf),f=la.dot(lf);if(u>=0&&f<=u)return e.copy(s);let m=l*f-u*h;if(m<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(aa,a);cf.subVectors(t,r);let d=aa.dot(cf),y=la.dot(cf);if(y>=0&&d<=y)return e.copy(r);let _=d*h-l*y;if(_<=0&&h>=0&&y<=0)return o=h/(h-y),e.copy(n).addScaledVector(la,o);let p=u*y-d*f;if(p<=0&&f-u>=0&&d-y>=0)return n0.subVectors(r,s),o=(f-u)/(f-u+(d-y)),e.copy(s).addScaledVector(n0,o);let x=1/(p+_+m);return a=_*x,o=m*x,e.copy(n).addScaledVector(aa,a).addScaledVector(la,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},ig={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},$r={h:0,s:0,l:0},vc={h:0,s:0,l:0};function hf(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var fn=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Wn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Gn.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Gn.workingColorSpace){return this.r=t,this.g=e,this.b=n,Gn.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Gn.workingColorSpace){if(t=_d(t,1),e=Ri(e,0,1),n=Ri(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=hf(a,r,t+1/3),this.g=hf(a,r,t),this.b=hf(a,r,t-1/3)}return Gn.toWorkingColorSpace(this,s),this}setStyle(t,e=Wn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Wn){let n=ig[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=ba(t.r),this.g=ba(t.g),this.b=ba(t.b),this}copyLinearToSRGB(t){return this.r=ju(t.r),this.g=ju(t.g),this.b=ju(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Wn){return Gn.fromWorkingColorSpace(Ki.copy(this),t),Math.round(Ri(Ki.r*255,0,255))*65536+Math.round(Ri(Ki.g*255,0,255))*256+Math.round(Ri(Ki.b*255,0,255))}getHexString(t=Wn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Gn.workingColorSpace){Gn.fromWorkingColorSpace(Ki.copy(this),e);let n=Ki.r,s=Ki.g,r=Ki.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,h,u=(o+a)/2;if(o===a)l=0,h=0;else{let f=a-o;switch(h=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=h,t.l=u,t}getRGB(t,e=Gn.workingColorSpace){return Gn.fromWorkingColorSpace(Ki.copy(this),e),t.r=Ki.r,t.g=Ki.g,t.b=Ki.b,t}getStyle(t=Wn){Gn.fromWorkingColorSpace(Ki.copy(this),t);let e=Ki.r,n=Ki.g,s=Ki.b;return t!==Wn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL($r),this.setHSL($r.h+t,$r.s+e,$r.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL($r),t.getHSL(vc);let n=cl($r.h,vc.h,e),s=cl($r.s,vc.s,e),r=cl($r.l,vc.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},Ki=new fn;fn.NAMES=ig;var Wy=0,dr=class extends fr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:Wy++}),this.uuid=ur(),this.name="",this.type="Material",this.blending=Ma,this.side=to,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Ef,this.blendDst=wf,this.blendEquation=bo,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fn(0,0,0),this.blendAlpha=0,this.depthFunc=kc,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Gm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ta,this.stencilZFail=ta,this.stencilZPass=ta,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==Ma&&(n.blending=this.blending),this.side!==to&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Ef&&(n.blendSrc=this.blendSrc),this.blendDst!==wf&&(n.blendDst=this.blendDst),this.blendEquation!==bo&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==kc&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Gm&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ta&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ta&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ta&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},os=class extends dr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=md,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Si=new W,Mc=new fe,Yn=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Cf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=Jr,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Mc.fromBufferAttribute(this,e),Mc.applyMatrix3(t),this.setXY(e,Mc.x,Mc.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Si.fromBufferAttribute(this,e),Si.applyMatrix3(t),this.setXYZ(e,Si.x,Si.y,Si.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Si.fromBufferAttribute(this,e),Si.applyMatrix4(t),this.setXYZ(e,Si.x,Si.y,Si.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Si.fromBufferAttribute(this,e),Si.applyNormalMatrix(t),this.setXYZ(e,Si.x,Si.y,Si.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Si.fromBufferAttribute(this,e),Si.transformDirection(t),this.setXYZ(e,Si.x,Si.y,Si.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=hr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Vn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=hr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Vn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=hr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Vn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=hr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Vn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=hr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Vn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Vn(e,this.array),n=Vn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Vn(e,this.array),n=Vn(n,this.array),s=Vn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Vn(e,this.array),n=Vn(n,this.array),s=Vn(s,this.array),r=Vn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Cf&&(t.usage=this.usage),t}};var Qc=class extends Yn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var th=class extends Yn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var sn=class extends Yn{constructor(t,e,n){super(new Float32Array(t),e,n)}};var Xy=0,Us=new Un,uf=new xi,ca=new W,Ss=new Qi,rl=new Qi,Bi=new W,Pn=class i extends fr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:Xy++}),this.uuid=ur(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(ng(t)?th:Qc)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new En().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Us.makeRotationFromQuaternion(t),this.applyMatrix4(Us),this}rotateX(t){return Us.makeRotationX(t),this.applyMatrix4(Us),this}rotateY(t){return Us.makeRotationY(t),this.applyMatrix4(Us),this}rotateZ(t){return Us.makeRotationZ(t),this.applyMatrix4(Us),this}translate(t,e,n){return Us.makeTranslation(t,e,n),this.applyMatrix4(Us),this}scale(t,e,n){return Us.makeScale(t,e,n),this.applyMatrix4(Us),this}lookAt(t){return uf.lookAt(t),uf.updateMatrix(),this.applyMatrix4(uf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(ca).negate(),this.translate(ca.x,ca.y,ca.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new sn(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qi);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new W(-1/0,-1/0,-1/0),new W(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ss.setFromBufferAttribute(r),this.morphTargetsRelative?(Bi.addVectors(this.boundingBox.min,Ss.min),this.boundingBox.expandByPoint(Bi),Bi.addVectors(this.boundingBox.max,Ss.max),this.boundingBox.expandByPoint(Bi)):(this.boundingBox.expandByPoint(Ss.min),this.boundingBox.expandByPoint(Ss.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ps);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new W,1/0);return}if(t){let n=this.boundingSphere.center;if(Ss.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];rl.setFromBufferAttribute(o),this.morphTargetsRelative?(Bi.addVectors(Ss.min,rl.min),Ss.expandByPoint(Bi),Bi.addVectors(Ss.max,rl.max),Ss.expandByPoint(Bi)):(Ss.expandByPoint(rl.min),Ss.expandByPoint(rl.max))}Ss.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Bi.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Bi));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)Bi.fromBufferAttribute(o,h),l&&(ca.fromBufferAttribute(t,h),Bi.add(ca)),s=Math.max(s,n.distanceToSquared(Bi))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Yn(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,h=[],u=[];for(let E=0;E<o;E++)h[E]=new W,u[E]=new W;let f=new W,m=new W,d=new W,y=new fe,_=new fe,p=new fe,x=new W,A=new W;function M(E,st,mt){f.fromArray(s,E*3),m.fromArray(s,st*3),d.fromArray(s,mt*3),y.fromArray(a,E*2),_.fromArray(a,st*2),p.fromArray(a,mt*2),m.sub(f),d.sub(f),_.sub(y),p.sub(y);let Qt=1/(_.x*p.y-p.x*_.y);isFinite(Qt)&&(x.copy(m).multiplyScalar(p.y).addScaledVector(d,-_.y).multiplyScalar(Qt),A.copy(d).multiplyScalar(_.x).addScaledVector(m,-p.x).multiplyScalar(Qt),h[E].add(x),h[st].add(x),h[mt].add(x),u[E].add(A),u[st].add(A),u[mt].add(A))}let P=this.groups;P.length===0&&(P=[{start:0,count:n.length}]);for(let E=0,st=P.length;E<st;++E){let mt=P[E],Qt=mt.start,tt=mt.count;for(let lt=Qt,bt=Qt+tt;lt<bt;lt+=3)M(n[lt+0],n[lt+1],n[lt+2])}let C=new W,T=new W,D=new W,Y=new W;function R(E){D.fromArray(r,E*3),Y.copy(D);let st=h[E];C.copy(st),C.sub(D.multiplyScalar(D.dot(st))).normalize(),T.crossVectors(Y,st);let Qt=T.dot(u[E])<0?-1:1;l[E*4]=C.x,l[E*4+1]=C.y,l[E*4+2]=C.z,l[E*4+3]=Qt}for(let E=0,st=P.length;E<st;++E){let mt=P[E],Qt=mt.start,tt=mt.count;for(let lt=Qt,bt=Qt+tt;lt<bt;lt+=3)R(n[lt+0]),R(n[lt+1]),R(n[lt+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Yn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let m=0,d=n.count;m<d;m++)n.setXYZ(m,0,0,0);let s=new W,r=new W,a=new W,o=new W,l=new W,h=new W,u=new W,f=new W;if(t)for(let m=0,d=t.count;m<d;m+=3){let y=t.getX(m+0),_=t.getX(m+1),p=t.getX(m+2);s.fromBufferAttribute(e,y),r.fromBufferAttribute(e,_),a.fromBufferAttribute(e,p),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,y),l.fromBufferAttribute(n,_),h.fromBufferAttribute(n,p),o.add(u),l.add(u),h.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(_,l.x,l.y,l.z),n.setXYZ(p,h.x,h.y,h.z)}else for(let m=0,d=e.count;m<d;m+=3)s.fromBufferAttribute(e,m+0),r.fromBufferAttribute(e,m+1),a.fromBufferAttribute(e,m+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(m+0,u.x,u.y,u.z),n.setXYZ(m+1,u.x,u.y,u.z),n.setXYZ(m+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Bi.fromBufferAttribute(t,e),Bi.normalize(),t.setXYZ(e,Bi.x,Bi.y,Bi.z)}toNonIndexed(){function t(o,l){let h=o.array,u=o.itemSize,f=o.normalized,m=new h.constructor(l.length*u),d=0,y=0;for(let _=0,p=l.length;_<p;_++){o.isInterleavedBufferAttribute?d=l[_]*o.data.stride+o.offset:d=l[_]*u;for(let x=0;x<u;x++)m[y++]=h[d++]}return new Yn(m,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],h=t(l,n);e.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let l=[],h=r[o];for(let u=0,f=h.length;u<f;u++){let m=h[u],d=t(m,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let h=n[l];t.data.attributes[l]=h.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let h=this.morphAttributes[l],u=[];for(let f=0,m=h.length;f<m;f++){let d=h[f];u.push(d.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let h in s){let u=s[h];this.setAttribute(h,u.clone(e))}let r=t.morphAttributes;for(let h in r){let u=[],f=r[h];for(let m=0,d=f.length;m<d;m++)u.push(f[m].clone(e));this.morphAttributes[h]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let h=0,u=a.length;h<u;h++){let f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},i0=new Un,_o=new Ao,bc=new ps,s0=new W,ha=new W,ua=new W,fa=new W,ff=new W,Sc=new W,Ec=new fe,wc=new fe,Tc=new fe,r0=new W,o0=new W,a0=new W,Ac=new W,Rc=new W,Qe=class extends xi{constructor(t=new Pn,e=new os){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){Sc.set(0,0,0);for(let l=0,h=r.length;l<h;l++){let u=o[l],f=r[l];u!==0&&(ff.fromBufferAttribute(f,t),a?Sc.addScaledVector(ff,u):Sc.addScaledVector(ff.sub(e),u))}e.add(Sc)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),bc.copy(n.boundingSphere),bc.applyMatrix4(r),_o.copy(t.ray).recast(t.near),!(bc.containsPoint(_o.origin)===!1&&(_o.intersectSphere(bc,s0)===null||_o.origin.distanceToSquared(s0)>(t.far-t.near)**2))&&(i0.copy(r).invert(),_o.copy(t.ray).applyMatrix4(i0),!(n.boundingBox!==null&&_o.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,_o)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,h=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,m=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,_=m.length;y<_;y++){let p=m[y],x=a[p.materialIndex],A=Math.max(p.start,d.start),M=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let P=A,C=M;P<C;P+=3){let T=o.getX(P),D=o.getX(P+1),Y=o.getX(P+2);s=Cc(this,x,t,n,h,u,f,T,D,Y),s&&(s.faceIndex=Math.floor(P/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),_=Math.min(o.count,d.start+d.count);for(let p=y,x=_;p<x;p+=3){let A=o.getX(p),M=o.getX(p+1),P=o.getX(p+2);s=Cc(this,a,t,n,h,u,f,A,M,P),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let y=0,_=m.length;y<_;y++){let p=m[y],x=a[p.materialIndex],A=Math.max(p.start,d.start),M=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let P=A,C=M;P<C;P+=3){let T=P,D=P+1,Y=P+2;s=Cc(this,x,t,n,h,u,f,T,D,Y),s&&(s.faceIndex=Math.floor(P/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),_=Math.min(l.count,d.start+d.count);for(let p=y,x=_;p<x;p+=3){let A=p,M=p+1,P=p+2;s=Cc(this,a,t,n,h,u,f,A,M,P),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function qy(i,t,e,n,s,r,a,o){let l;if(t.side===fs?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===to,o),l===null)return null;Rc.copy(o),Rc.applyMatrix4(i.matrixWorld);let h=e.ray.origin.distanceTo(Rc);return h<e.near||h>e.far?null:{distance:h,point:Rc.clone(),object:i}}function Cc(i,t,e,n,s,r,a,o,l,h){i.getVertexPosition(o,ha),i.getVertexPosition(l,ua),i.getVertexPosition(h,fa);let u=qy(i,t,e,n,ha,ua,fa,Ac);if(u){s&&(Ec.fromBufferAttribute(s,o),wc.fromBufferAttribute(s,l),Tc.fromBufferAttribute(s,h),u.uv=xa.getInterpolation(Ac,ha,ua,fa,Ec,wc,Tc,new fe)),r&&(Ec.fromBufferAttribute(r,o),wc.fromBufferAttribute(r,l),Tc.fromBufferAttribute(r,h),u.uv1=xa.getInterpolation(Ac,ha,ua,fa,Ec,wc,Tc,new fe),u.uv2=u.uv1),a&&(r0.fromBufferAttribute(a,o),o0.fromBufferAttribute(a,l),a0.fromBufferAttribute(a,h),u.normal=xa.getInterpolation(Ac,ha,ua,fa,r0,o0,a0,new W),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:l,c:h,normal:new W,materialIndex:0};xa.getNormal(ha,ua,fa,f.normal),u.face=f}return u}var Ei=class i extends Pn{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],h=[],u=[],f=[],m=0,d=0;y("z","y","x",-1,-1,n,e,t,a,r,0),y("z","y","x",1,-1,n,e,-t,a,r,1),y("x","z","y",1,1,t,n,e,s,a,2),y("x","z","y",1,-1,t,n,-e,s,a,3),y("x","y","z",1,-1,t,e,n,s,r,4),y("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new sn(h,3)),this.setAttribute("normal",new sn(u,3)),this.setAttribute("uv",new sn(f,2));function y(_,p,x,A,M,P,C,T,D,Y,R){let E=P/D,st=C/Y,mt=P/2,Qt=C/2,tt=T/2,lt=D+1,bt=Y+1,qt=0,Jt=0,Tt=new W;for(let $t=0;$t<bt;$t++){let le=$t*st-Qt;for(let Me=0;Me<lt;Me++){let Ct=Me*E-mt;Tt[_]=Ct*A,Tt[p]=le*M,Tt[x]=tt,h.push(Tt.x,Tt.y,Tt.z),Tt[_]=0,Tt[p]=0,Tt[x]=T>0?1:-1,u.push(Tt.x,Tt.y,Tt.z),f.push(Me/D),f.push(1-$t/Y),qt+=1}}for(let $t=0;$t<Y;$t++)for(let le=0;le<D;le++){let Me=m+le+lt*$t,Ct=m+le+lt*($t+1),Bt=m+(le+1)+lt*($t+1),ge=m+(le+1)+lt*$t;l.push(Me,Ct,ge),l.push(Ct,Bt,ge),Jt+=6}o.addGroup(d,Jt,R),d+=Jt,m+=qt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function Aa(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ss(i){let t={};for(let e=0;e<i.length;e++){let n=Aa(i[e]);for(let s in n)t[s]=n[s]}return t}function Yy(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function sg(i){return i.getRenderTarget()===null?i.outputColorSpace:Gn.workingColorSpace}var Oh={clone:Aa,merge:ss},$y=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Zy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Ks=class extends dr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=$y,this.fragmentShader=Zy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Aa(t.uniforms),this.uniformsGroups=Yy(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},eh=class extends xi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Un,this.projectionMatrix=new Un,this.projectionMatrixInverse=new Un,this.coordinateSystem=Ar}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Hi=class extends eh{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=gl*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ll*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return gl*2*Math.atan(Math.tan(ll*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ll*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/h,s*=a.width/l,n*=a.height/h}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},da=-90,pa=1,Uf=class extends xi{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Hi(da,pa,t,e);s.layers=this.layers,this.add(s);let r=new Hi(da,pa,t,e);r.layers=this.layers,this.add(r);let a=new Hi(da,pa,t,e);a.layers=this.layers,this.add(a);let o=new Hi(da,pa,t,e);o.layers=this.layers,this.add(o);let l=new Hi(da,pa,t,e);l.layers=this.layers,this.add(l);let h=new Hi(da,pa,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let h of e)this.remove(h);if(t===Ar)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===qc)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,h,u]=this.children,f=t.getRenderTarget(),m=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),y=t.xr.enabled;t.xr.enabled=!1;let _=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=_,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(f,m,d),t.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},nh=class extends Es{constructor(t,e,n,s,r,a,o,l,h,u){t=t!==void 0?t:[],e=e!==void 0?e:Ea,super(t,e,n,s,r,a,o,l,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Nf=class extends Cr{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(hl("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===To?Wn:Ns),this.texture=new nh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:us}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ei(5,5,5),r=new Ks({name:"CubemapFromEquirect",uniforms:Aa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:fs,blending:jr});r.uniforms.tEquirect.value=e;let a=new Qe(s,r),o=e.minFilter;return e.minFilter===pl&&(e.minFilter=us),new Uf(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},df=new W,Jy=new W,jy=new En,$s=class{constructor(t=new W(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=df.subVectors(n,e).cross(Jy.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(df),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||jy.getNormalMatrix(t),s=this.coplanarPoint(df).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},vo=new ps,Pc=new W,yl=class{constructor(t=new $s,e=new $s,n=new $s,s=new $s,r=new $s,a=new $s){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Ar){let n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],h=s[4],u=s[5],f=s[6],m=s[7],d=s[8],y=s[9],_=s[10],p=s[11],x=s[12],A=s[13],M=s[14],P=s[15];if(n[0].setComponents(l-r,m-h,p-d,P-x).normalize(),n[1].setComponents(l+r,m+h,p+d,P+x).normalize(),n[2].setComponents(l+a,m+u,p+y,P+A).normalize(),n[3].setComponents(l-a,m-u,p-y,P-A).normalize(),n[4].setComponents(l-o,m-f,p-_,P-M).normalize(),e===Ar)n[5].setComponents(l+o,m+f,p+_,P+M).normalize();else if(e===qc)n[5].setComponents(o,f,_,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vo.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vo.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vo)}intersectsSprite(t){return vo.center.set(0,0,0),vo.radius=.7071067811865476,vo.applyMatrix4(t.matrixWorld),this.intersectsSphere(vo)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Pc.x=s.normal.x>0?t.max.x:t.min.x,Pc.y=s.normal.y>0?t.max.y:t.min.y,Pc.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Pc)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function rg(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function Ky(i,t){let e=t.isWebGL2,n=new WeakMap;function s(h,u){let f=h.array,m=h.usage,d=f.byteLength,y=i.createBuffer();i.bindBuffer(u,y),i.bufferData(u,f,m),h.onUploadCallback();let _;if(f instanceof Float32Array)_=i.FLOAT;else if(f instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)_=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else _=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)_=i.SHORT;else if(f instanceof Uint32Array)_=i.UNSIGNED_INT;else if(f instanceof Int32Array)_=i.INT;else if(f instanceof Int8Array)_=i.BYTE;else if(f instanceof Uint8Array)_=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)_=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:y,type:_,bytesPerElement:f.BYTES_PER_ELEMENT,version:h.version,size:d}}function r(h,u,f){let m=u.array,d=u._updateRange,y=u.updateRanges;if(i.bindBuffer(f,h),d.count===-1&&y.length===0&&i.bufferSubData(f,0,m),y.length!==0){for(let _=0,p=y.length;_<p;_++){let x=y[_];e?i.bufferSubData(f,x.start*m.BYTES_PER_ELEMENT,m,x.start,x.count):i.bufferSubData(f,x.start*m.BYTES_PER_ELEMENT,m.subarray(x.start,x.start+x.count))}u.clearUpdateRanges()}d.count!==-1&&(e?i.bufferSubData(f,d.offset*m.BYTES_PER_ELEMENT,m,d.offset,d.count):i.bufferSubData(f,d.offset*m.BYTES_PER_ELEMENT,m.subarray(d.offset,d.offset+d.count)),d.count=-1),u.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function o(h){h.isInterleavedBufferAttribute&&(h=h.data);let u=n.get(h);u&&(i.deleteBuffer(u.buffer),n.delete(h))}function l(h,u){if(h.isGLBufferAttribute){let m=n.get(h);(!m||m.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);let f=n.get(h);if(f===void 0)n.set(h,s(h,u));else if(f.version<h.version){if(f.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,h,u),f.version=h.version}}return{get:a,remove:o,update:l}}var ms=class i extends Pn{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),h=o+1,u=l+1,f=t/o,m=e/l,d=[],y=[],_=[],p=[];for(let x=0;x<u;x++){let A=x*m-a;for(let M=0;M<h;M++){let P=M*f-r;y.push(P,-A,0),_.push(0,0,1),p.push(M/o),p.push(1-x/l)}}for(let x=0;x<l;x++)for(let A=0;A<o;A++){let M=A+h*x,P=A+h*(x+1),C=A+1+h*(x+1),T=A+1+h*x;d.push(M,P,T),d.push(P,C,T)}this.setIndex(d),this.setAttribute("position",new sn(y,3)),this.setAttribute("normal",new sn(_,3)),this.setAttribute("uv",new sn(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},Qy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,t_=`#ifdef USE_ALPHAHASH
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
#endif`,e_=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,n_=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,i_=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,s_=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,r_=`#ifdef USE_AOMAP
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
#endif`,o_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,a_=`#ifdef USE_BATCHING
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
#endif`,l_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,c_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,h_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,u_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,f_=`#ifdef USE_IRIDESCENCE
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
#endif`,d_=`#ifdef USE_BUMPMAP
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
#endif`,p_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,m_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,g_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,x_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,y_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,__=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,v_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,M_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,b_=`#define PI 3.141592653589793
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
} // validated`,S_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,E_=`vec3 transformedNormal = objectNormal;
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
#endif`,w_=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,T_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,A_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,R_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,C_="gl_FragColor = linearToOutputTexel( gl_FragColor );",P_=`
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
}`,L_=`#ifdef USE_ENVMAP
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
#endif`,I_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,D_=`#ifdef USE_ENVMAP
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
#endif`,U_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,N_=`#ifdef USE_ENVMAP
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
#endif`,O_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,F_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,B_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,z_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,k_=`#ifdef USE_GRADIENTMAP
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
}`,H_=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,V_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,G_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,W_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,X_=`uniform bool receiveShadow;
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
#endif`,q_=`#ifdef USE_ENVMAP
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
#endif`,Y_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,$_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,Z_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,J_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,j_=`PhysicalMaterial material;
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
#endif`,K_=`struct PhysicalMaterial {
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
}`,Q_=`
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
#endif`,tv=`#if defined( RE_IndirectDiffuse )
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
#endif`,ev=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,nv=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,iv=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,sv=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,rv=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,ov=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,av=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,lv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,cv=`#if defined( USE_POINTS_UV )
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
#endif`,hv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,uv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,fv=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,dv=`#ifdef USE_MORPHNORMALS
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
#endif`,pv=`#ifdef USE_MORPHTARGETS
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
#endif`,mv=`#ifdef USE_MORPHTARGETS
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
#endif`,gv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,xv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,yv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,_v=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,vv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Mv=`#ifdef USE_NORMALMAP
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
#endif`,bv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,Sv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Ev=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,wv=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Tv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Av=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,Rv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Cv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Pv=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,Lv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Iv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Dv=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Uv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Nv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Ov=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Fv=`float getShadowMask() {
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
}`,Bv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,zv=`#ifdef USE_SKINNING
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
#endif`,kv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Hv=`#ifdef USE_SKINNING
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
#endif`,Vv=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Gv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Wv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,Xv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,qv=`#ifdef USE_TRANSMISSION
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
#endif`,Yv=`#ifdef USE_TRANSMISSION
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
#endif`,$v=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Zv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Jv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,jv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,Kv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Qv=`uniform sampler2D t2D;
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
}`,tM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,eM=`#ifdef ENVMAP_TYPE_CUBE
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
}`,nM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,iM=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sM=`#include <common>
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
}`,rM=`#if DEPTH_PACKING == 3200
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
}`,oM=`#define DISTANCE
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
}`,aM=`#define DISTANCE
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
}`,lM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,cM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,hM=`uniform float scale;
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
}`,uM=`uniform vec3 diffuse;
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
}`,fM=`#include <common>
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
}`,dM=`uniform vec3 diffuse;
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
}`,pM=`#define LAMBERT
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
}`,mM=`#define LAMBERT
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
}`,gM=`#define MATCAP
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
}`,xM=`#define MATCAP
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
}`,yM=`#define NORMAL
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
}`,_M=`#define NORMAL
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
}`,vM=`#define PHONG
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
}`,MM=`#define PHONG
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
}`,bM=`#define STANDARD
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
}`,SM=`#define STANDARD
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
}`,EM=`#define TOON
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
}`,wM=`#define TOON
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
}`,TM=`uniform float size;
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
}`,AM=`uniform vec3 diffuse;
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
}`,RM=`#include <common>
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
}`,CM=`uniform vec3 color;
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
}`,PM=`uniform float rotation;
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
}`,LM=`uniform vec3 diffuse;
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
}`,bn={alphahash_fragment:Qy,alphahash_pars_fragment:t_,alphamap_fragment:e_,alphamap_pars_fragment:n_,alphatest_fragment:i_,alphatest_pars_fragment:s_,aomap_fragment:r_,aomap_pars_fragment:o_,batching_pars_vertex:a_,batching_vertex:l_,begin_vertex:c_,beginnormal_vertex:h_,bsdfs:u_,iridescence_fragment:f_,bumpmap_pars_fragment:d_,clipping_planes_fragment:p_,clipping_planes_pars_fragment:m_,clipping_planes_pars_vertex:g_,clipping_planes_vertex:x_,color_fragment:y_,color_pars_fragment:__,color_pars_vertex:v_,color_vertex:M_,common:b_,cube_uv_reflection_fragment:S_,defaultnormal_vertex:E_,displacementmap_pars_vertex:w_,displacementmap_vertex:T_,emissivemap_fragment:A_,emissivemap_pars_fragment:R_,colorspace_fragment:C_,colorspace_pars_fragment:P_,envmap_fragment:L_,envmap_common_pars_fragment:I_,envmap_pars_fragment:D_,envmap_pars_vertex:U_,envmap_physical_pars_fragment:q_,envmap_vertex:N_,fog_vertex:O_,fog_pars_vertex:F_,fog_fragment:B_,fog_pars_fragment:z_,gradientmap_pars_fragment:k_,lightmap_fragment:H_,lightmap_pars_fragment:V_,lights_lambert_fragment:G_,lights_lambert_pars_fragment:W_,lights_pars_begin:X_,lights_toon_fragment:Y_,lights_toon_pars_fragment:$_,lights_phong_fragment:Z_,lights_phong_pars_fragment:J_,lights_physical_fragment:j_,lights_physical_pars_fragment:K_,lights_fragment_begin:Q_,lights_fragment_maps:tv,lights_fragment_end:ev,logdepthbuf_fragment:nv,logdepthbuf_pars_fragment:iv,logdepthbuf_pars_vertex:sv,logdepthbuf_vertex:rv,map_fragment:ov,map_pars_fragment:av,map_particle_fragment:lv,map_particle_pars_fragment:cv,metalnessmap_fragment:hv,metalnessmap_pars_fragment:uv,morphcolor_vertex:fv,morphnormal_vertex:dv,morphtarget_pars_vertex:pv,morphtarget_vertex:mv,normal_fragment_begin:gv,normal_fragment_maps:xv,normal_pars_fragment:yv,normal_pars_vertex:_v,normal_vertex:vv,normalmap_pars_fragment:Mv,clearcoat_normal_fragment_begin:bv,clearcoat_normal_fragment_maps:Sv,clearcoat_pars_fragment:Ev,iridescence_pars_fragment:wv,opaque_fragment:Tv,packing:Av,premultiplied_alpha_fragment:Rv,project_vertex:Cv,dithering_fragment:Pv,dithering_pars_fragment:Lv,roughnessmap_fragment:Iv,roughnessmap_pars_fragment:Dv,shadowmap_pars_fragment:Uv,shadowmap_pars_vertex:Nv,shadowmap_vertex:Ov,shadowmask_pars_fragment:Fv,skinbase_vertex:Bv,skinning_pars_vertex:zv,skinning_vertex:kv,skinnormal_vertex:Hv,specularmap_fragment:Vv,specularmap_pars_fragment:Gv,tonemapping_fragment:Wv,tonemapping_pars_fragment:Xv,transmission_fragment:qv,transmission_pars_fragment:Yv,uv_pars_fragment:$v,uv_pars_vertex:Zv,uv_vertex:Jv,worldpos_vertex:jv,background_vert:Kv,background_frag:Qv,backgroundCube_vert:tM,backgroundCube_frag:eM,cube_vert:nM,cube_frag:iM,depth_vert:sM,depth_frag:rM,distanceRGBA_vert:oM,distanceRGBA_frag:aM,equirect_vert:lM,equirect_frag:cM,linedashed_vert:hM,linedashed_frag:uM,meshbasic_vert:fM,meshbasic_frag:dM,meshlambert_vert:pM,meshlambert_frag:mM,meshmatcap_vert:gM,meshmatcap_frag:xM,meshnormal_vert:yM,meshnormal_frag:_M,meshphong_vert:vM,meshphong_frag:MM,meshphysical_vert:bM,meshphysical_frag:SM,meshtoon_vert:EM,meshtoon_frag:wM,points_vert:TM,points_frag:AM,shadow_vert:RM,shadow_frag:CM,sprite_vert:PM,sprite_frag:LM},Ae={common:{diffuse:{value:new fn(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new En}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new En}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new En}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new En},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new En},normalScale:{value:new fe(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new En},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new En}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new En}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new En}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fn(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fn(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0},uvTransform:{value:new En}},sprite:{diffuse:{value:new fn(16777215)},opacity:{value:1},center:{value:new fe(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}}},rs={basic:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.fog]),vertexShader:bn.meshbasic_vert,fragmentShader:bn.meshbasic_frag},lambert:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)}}]),vertexShader:bn.meshlambert_vert,fragmentShader:bn.meshlambert_frag},phong:{uniforms:ss([Ae.common,Ae.specularmap,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)},specular:{value:new fn(1118481)},shininess:{value:30}}]),vertexShader:bn.meshphong_vert,fragmentShader:bn.meshphong_frag},standard:{uniforms:ss([Ae.common,Ae.envmap,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.roughnessmap,Ae.metalnessmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:bn.meshphysical_vert,fragmentShader:bn.meshphysical_frag},toon:{uniforms:ss([Ae.common,Ae.aomap,Ae.lightmap,Ae.emissivemap,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.gradientmap,Ae.fog,Ae.lights,{emissive:{value:new fn(0)}}]),vertexShader:bn.meshtoon_vert,fragmentShader:bn.meshtoon_frag},matcap:{uniforms:ss([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,Ae.fog,{matcap:{value:null}}]),vertexShader:bn.meshmatcap_vert,fragmentShader:bn.meshmatcap_frag},points:{uniforms:ss([Ae.points,Ae.fog]),vertexShader:bn.points_vert,fragmentShader:bn.points_frag},dashed:{uniforms:ss([Ae.common,Ae.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:bn.linedashed_vert,fragmentShader:bn.linedashed_frag},depth:{uniforms:ss([Ae.common,Ae.displacementmap]),vertexShader:bn.depth_vert,fragmentShader:bn.depth_frag},normal:{uniforms:ss([Ae.common,Ae.bumpmap,Ae.normalmap,Ae.displacementmap,{opacity:{value:1}}]),vertexShader:bn.meshnormal_vert,fragmentShader:bn.meshnormal_frag},sprite:{uniforms:ss([Ae.sprite,Ae.fog]),vertexShader:bn.sprite_vert,fragmentShader:bn.sprite_frag},background:{uniforms:{uvTransform:{value:new En},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:bn.background_vert,fragmentShader:bn.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:bn.backgroundCube_vert,fragmentShader:bn.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:bn.cube_vert,fragmentShader:bn.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:bn.equirect_vert,fragmentShader:bn.equirect_frag},distanceRGBA:{uniforms:ss([Ae.common,Ae.displacementmap,{referencePosition:{value:new W},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:bn.distanceRGBA_vert,fragmentShader:bn.distanceRGBA_frag},shadow:{uniforms:ss([Ae.lights,Ae.fog,{color:{value:new fn(0)},opacity:{value:1}}]),vertexShader:bn.shadow_vert,fragmentShader:bn.shadow_frag}};rs.physical={uniforms:ss([rs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new En},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new En},clearcoatNormalScale:{value:new fe(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new En},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new En},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new En},sheen:{value:0},sheenColor:{value:new fn(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new En},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new En},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new En},transmissionSamplerSize:{value:new fe},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new En},attenuationDistance:{value:0},attenuationColor:{value:new fn(0)},specularColor:{value:new fn(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new En},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new En},anisotropyVector:{value:new fe},anisotropyMap:{value:null},anisotropyMapTransform:{value:new En}}]),vertexShader:bn.meshphysical_vert,fragmentShader:bn.meshphysical_frag};var Lc={r:0,b:0,g:0};function IM(i,t,e,n,s,r,a){let o=new fn(0),l=r===!0?0:1,h,u,f=null,m=0,d=null;function y(p,x){let A=!1,M=x.isScene===!0?x.background:null;M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M===null?_(o,l):M&&M.isColor&&(_(M,1),A=!0);let P=i.xr.getEnvironmentBlendMode();P==="additive"?n.buffers.color.setClear(0,0,0,1,a):P==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||A)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Ih)?(u===void 0&&(u=new Qe(new Ei(1,1,1),new Ks({name:"BackgroundCubeMaterial",uniforms:Aa(rs.backgroundCube.uniforms),vertexShader:rs.backgroundCube.vertexShader,fragmentShader:rs.backgroundCube.fragmentShader,side:fs,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(C,T,D){this.matrixWorld.copyPosition(D.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.toneMapped=Gn.getTransfer(M.colorSpace)!==ai,(f!==M||m!==M.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,f=M,m=M.version,d=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new Qe(new ms(2,2),new Ks({name:"BackgroundMaterial",uniforms:Aa(rs.background.uniforms),vertexShader:rs.background.vertexShader,fragmentShader:rs.background.fragmentShader,side:to,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.toneMapped=Gn.getTransfer(M.colorSpace)!==ai,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||m!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=M,m=M.version,d=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null))}function _(p,x){p.getRGB(Lc,sg(i)),n.buffers.color.setClear(Lc.r,Lc.g,Lc.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(p,x=1){o.set(p),l=x,_(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,_(o,l)},render:y}}function DM(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=p(null),h=l,u=!1;function f(tt,lt,bt,qt,Jt){let Tt=!1;if(a){let $t=_(qt,bt,lt);h!==$t&&(h=$t,d(h.object)),Tt=x(tt,qt,bt,Jt),Tt&&A(tt,qt,bt,Jt)}else{let $t=lt.wireframe===!0;(h.geometry!==qt.id||h.program!==bt.id||h.wireframe!==$t)&&(h.geometry=qt.id,h.program=bt.id,h.wireframe=$t,Tt=!0)}Jt!==null&&e.update(Jt,i.ELEMENT_ARRAY_BUFFER),(Tt||u)&&(u=!1,Y(tt,lt,bt,qt),Jt!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Jt).buffer))}function m(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function d(tt){return n.isWebGL2?i.bindVertexArray(tt):r.bindVertexArrayOES(tt)}function y(tt){return n.isWebGL2?i.deleteVertexArray(tt):r.deleteVertexArrayOES(tt)}function _(tt,lt,bt){let qt=bt.wireframe===!0,Jt=o[tt.id];Jt===void 0&&(Jt={},o[tt.id]=Jt);let Tt=Jt[lt.id];Tt===void 0&&(Tt={},Jt[lt.id]=Tt);let $t=Tt[qt];return $t===void 0&&($t=p(m()),Tt[qt]=$t),$t}function p(tt){let lt=[],bt=[],qt=[];for(let Jt=0;Jt<s;Jt++)lt[Jt]=0,bt[Jt]=0,qt[Jt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:lt,enabledAttributes:bt,attributeDivisors:qt,object:tt,attributes:{},index:null}}function x(tt,lt,bt,qt){let Jt=h.attributes,Tt=lt.attributes,$t=0,le=bt.getAttributes();for(let Me in le)if(le[Me].location>=0){let Bt=Jt[Me],ge=Tt[Me];if(ge===void 0&&(Me==="instanceMatrix"&&tt.instanceMatrix&&(ge=tt.instanceMatrix),Me==="instanceColor"&&tt.instanceColor&&(ge=tt.instanceColor)),Bt===void 0||Bt.attribute!==ge||ge&&Bt.data!==ge.data)return!0;$t++}return h.attributesNum!==$t||h.index!==qt}function A(tt,lt,bt,qt){let Jt={},Tt=lt.attributes,$t=0,le=bt.getAttributes();for(let Me in le)if(le[Me].location>=0){let Bt=Tt[Me];Bt===void 0&&(Me==="instanceMatrix"&&tt.instanceMatrix&&(Bt=tt.instanceMatrix),Me==="instanceColor"&&tt.instanceColor&&(Bt=tt.instanceColor));let ge={};ge.attribute=Bt,Bt&&Bt.data&&(ge.data=Bt.data),Jt[Me]=ge,$t++}h.attributes=Jt,h.attributesNum=$t,h.index=qt}function M(){let tt=h.newAttributes;for(let lt=0,bt=tt.length;lt<bt;lt++)tt[lt]=0}function P(tt){C(tt,0)}function C(tt,lt){let bt=h.newAttributes,qt=h.enabledAttributes,Jt=h.attributeDivisors;bt[tt]=1,qt[tt]===0&&(i.enableVertexAttribArray(tt),qt[tt]=1),Jt[tt]!==lt&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](tt,lt),Jt[tt]=lt)}function T(){let tt=h.newAttributes,lt=h.enabledAttributes;for(let bt=0,qt=lt.length;bt<qt;bt++)lt[bt]!==tt[bt]&&(i.disableVertexAttribArray(bt),lt[bt]=0)}function D(tt,lt,bt,qt,Jt,Tt,$t){$t===!0?i.vertexAttribIPointer(tt,lt,bt,Jt,Tt):i.vertexAttribPointer(tt,lt,bt,qt,Jt,Tt)}function Y(tt,lt,bt,qt){if(n.isWebGL2===!1&&(tt.isInstancedMesh||qt.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();let Jt=qt.attributes,Tt=bt.getAttributes(),$t=lt.defaultAttributeValues;for(let le in Tt){let Me=Tt[le];if(Me.location>=0){let Ct=Jt[le];if(Ct===void 0&&(le==="instanceMatrix"&&tt.instanceMatrix&&(Ct=tt.instanceMatrix),le==="instanceColor"&&tt.instanceColor&&(Ct=tt.instanceColor)),Ct!==void 0){let Bt=Ct.normalized,ge=Ct.itemSize,Re=e.get(Ct);if(Re===void 0)continue;let Pe=Re.buffer,Xe=Re.type,Ze=Re.bytesPerElement,Ie=n.isWebGL2===!0&&(Xe===i.INT||Xe===i.UNSIGNED_INT||Ct.gpuType===Y0);if(Ct.isInterleavedBufferAttribute){let Be=Ct.data,et=Be.stride,Se=Ct.offset;if(Be.isInstancedInterleavedBuffer){for(let ct=0;ct<Me.locationSize;ct++)C(Me.location+ct,Be.meshPerAttribute);tt.isInstancedMesh!==!0&&qt._maxInstanceCount===void 0&&(qt._maxInstanceCount=Be.meshPerAttribute*Be.count)}else for(let ct=0;ct<Me.locationSize;ct++)P(Me.location+ct);i.bindBuffer(i.ARRAY_BUFFER,Pe);for(let ct=0;ct<Me.locationSize;ct++)D(Me.location+ct,ge/Me.locationSize,Xe,Bt,et*Ze,(Se+ge/Me.locationSize*ct)*Ze,Ie)}else{if(Ct.isInstancedBufferAttribute){for(let Be=0;Be<Me.locationSize;Be++)C(Me.location+Be,Ct.meshPerAttribute);tt.isInstancedMesh!==!0&&qt._maxInstanceCount===void 0&&(qt._maxInstanceCount=Ct.meshPerAttribute*Ct.count)}else for(let Be=0;Be<Me.locationSize;Be++)P(Me.location+Be);i.bindBuffer(i.ARRAY_BUFFER,Pe);for(let Be=0;Be<Me.locationSize;Be++)D(Me.location+Be,ge/Me.locationSize,Xe,Bt,ge*Ze,ge/Me.locationSize*Be*Ze,Ie)}}else if($t!==void 0){let Bt=$t[le];if(Bt!==void 0)switch(Bt.length){case 2:i.vertexAttrib2fv(Me.location,Bt);break;case 3:i.vertexAttrib3fv(Me.location,Bt);break;case 4:i.vertexAttrib4fv(Me.location,Bt);break;default:i.vertexAttrib1fv(Me.location,Bt)}}}}T()}function R(){mt();for(let tt in o){let lt=o[tt];for(let bt in lt){let qt=lt[bt];for(let Jt in qt)y(qt[Jt].object),delete qt[Jt];delete lt[bt]}delete o[tt]}}function E(tt){if(o[tt.id]===void 0)return;let lt=o[tt.id];for(let bt in lt){let qt=lt[bt];for(let Jt in qt)y(qt[Jt].object),delete qt[Jt];delete lt[bt]}delete o[tt.id]}function st(tt){for(let lt in o){let bt=o[lt];if(bt[tt.id]===void 0)continue;let qt=bt[tt.id];for(let Jt in qt)y(qt[Jt].object),delete qt[Jt];delete bt[tt.id]}}function mt(){Qt(),u=!0,h!==l&&(h=l,d(h.object))}function Qt(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:mt,resetDefaultState:Qt,dispose:R,releaseStatesOfGeometry:E,releaseStatesOfProgram:st,initAttributes:M,enableAttribute:P,disableUnusedAttributes:T}}function UM(i,t,e,n){let s=n.isWebGL2,r;function a(u){r=u}function o(u,f){i.drawArrays(r,u,f),e.update(f,r,1)}function l(u,f,m){if(m===0)return;let d,y;if(s)d=i,y="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),y="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[y](r,u,f,m),e.update(f,r,m)}function h(u,f,m){if(m===0)return;let d=t.get("WEBGL_multi_draw");if(d===null)for(let y=0;y<m;y++)this.render(u[y],f[y]);else{d.multiDrawArraysWEBGL(r,u,0,f,0,m);let y=0;for(let _=0;_<m;_++)y+=f[_];e.update(y,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=h}function NM(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let D=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(D.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(D){if(D==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";D="mediump"}return D==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);let h=a||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),y=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),_=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),A=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=m>0,P=a||t.has("OES_texture_float"),C=M&&P,T=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:d,maxCubemapSize:y,maxAttributes:_,maxVertexUniforms:p,maxVaryings:x,maxFragmentUniforms:A,vertexTextures:M,floatFragmentTextures:P,floatVertexTextures:C,maxSamples:T}}function OM(i){let t=this,e=null,n=0,s=!1,r=!1,a=new $s,o=new En,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,m){let d=f.length!==0||m||n!==0||s;return s=m,n=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,m){e=u(f,m,0)},this.setState=function(f,m,d){let y=f.clippingPlanes,_=f.clipIntersection,p=f.clipShadows,x=i.get(f);if(!s||y===null||y.length===0||r&&!p)r?u(null):h();else{let A=r?0:n,M=A*4,P=x.clippingState||null;l.value=P,P=u(y,m,M,d);for(let C=0;C!==M;++C)P[C]=e[C];x.clippingState=P,this.numIntersection=_?this.numPlanes:0,this.numPlanes+=A}};function h(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,m,d,y){let _=f!==null?f.length:0,p=null;if(_!==0){if(p=l.value,y!==!0||p===null){let x=d+_*4,A=m.matrixWorldInverse;o.getNormalMatrix(A),(p===null||p.length<x)&&(p=new Float32Array(x));for(let M=0,P=d;M!==_;++M,P+=4)a.copy(f[M]).applyMatrix4(A,o),a.normal.toArray(p,P),p[P+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=_,t.numIntersection=0,p}}function FM(i){let t=new WeakMap;function e(a,o){return o===Tf?a.mapping=Ea:o===Af&&(a.mapping=wa),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===Tf||o===Af)if(t.has(a)){let l=t.get(a).texture;return e(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let h=new Nf(l.height/2);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var ih=class extends eh{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ya=4,l0=[.125,.215,.35,.446,.526,.582],So=20,pf=new ih,c0=new fn,mf=null,gf=0,xf=0,Mo=(1+Math.sqrt(5))/2,ma=1/Mo,h0=[new W(1,1,1),new W(-1,1,1),new W(1,1,-1),new W(-1,1,-1),new W(0,Mo,ma),new W(0,Mo,-ma),new W(ma,0,Mo),new W(-ma,0,Mo),new W(Mo,ma,0),new W(-Mo,ma,0)],sh=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){mf=this._renderer.getRenderTarget(),gf=this._renderer.getActiveCubeFace(),xf=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=d0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=f0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(mf,gf,xf),t.scissorTest=!1,Ic(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===Ea||t.mapping===wa?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),mf=this._renderer.getRenderTarget(),gf=this._renderer.getActiveCubeFace(),xf=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:us,minFilter:us,generateMipmaps:!1,type:ml,format:Js,colorSpace:Rr,depthBuffer:!1},s=u0(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=u0(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=BM(r)),this._blurMaterial=zM(r,t,e)}return s}_compileMaterial(t){let e=new Qe(this._lodPlanes[0],t);this._renderer.compile(e,pf)}_sceneToCubeUV(t,e,n,s){let o=new Hi(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,m=u.toneMapping;u.getClearColor(c0),u.toneMapping=Kr,u.autoClear=!1;let d=new os({name:"PMREM.Background",side:fs,depthWrite:!1,depthTest:!1}),y=new Qe(new Ei,d),_=!1,p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,_=!0):(d.color.copy(c0),_=!0);for(let x=0;x<6;x++){let A=x%3;A===0?(o.up.set(0,l[x],0),o.lookAt(h[x],0,0)):A===1?(o.up.set(0,0,l[x]),o.lookAt(0,h[x],0)):(o.up.set(0,l[x],0),o.lookAt(0,0,h[x]));let M=this._cubeSize;Ic(s,A*M,x>2?M:0,M,M),u.setRenderTarget(s),_&&u.render(y,o),u.render(t,o)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=m,u.autoClear=f,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===Ea||t.mapping===wa;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=d0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=f0());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Qe(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;Ic(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,pf)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=h0[(s-1)%h0.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let l=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,f=new Qe(this._lodPlanes[s],h),m=h.uniforms,d=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*So-1),_=r/y,p=isFinite(r)?1+Math.floor(u*_):So;p>So&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${So}`);let x=[],A=0;for(let D=0;D<So;++D){let Y=D/_,R=Math.exp(-Y*Y/2);x.push(R),D===0?A+=R:D<p&&(A+=2*R)}for(let D=0;D<x.length;D++)x[D]=x[D]/A;m.envMap.value=t.texture,m.samples.value=p,m.weights.value=x,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);let{_lodMax:M}=this;m.dTheta.value=y,m.mipInt.value=M-n;let P=this._sizeLods[s],C=3*P*(s>M-ya?s-M+ya:0),T=4*(this._cubeSize-P);Ic(e,C,T,3*P,2*P),l.setRenderTarget(e),l.render(f,pf)}};function BM(i){let t=[],e=[],n=[],s=i,r=i-ya+1+l0.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-ya?l=l0[a-i+ya-1]:a===0&&(l=0),n.push(l);let h=1/(o-2),u=-h,f=1+h,m=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,y=6,_=3,p=2,x=1,A=new Float32Array(_*y*d),M=new Float32Array(p*y*d),P=new Float32Array(x*y*d);for(let T=0;T<d;T++){let D=T%3*2/3-1,Y=T>2?0:-1,R=[D,Y,0,D+2/3,Y,0,D+2/3,Y+1,0,D,Y,0,D+2/3,Y+1,0,D,Y+1,0];A.set(R,_*y*T),M.set(m,p*y*T);let E=[T,T,T,T,T,T];P.set(E,x*y*T)}let C=new Pn;C.setAttribute("position",new Yn(A,_)),C.setAttribute("uv",new Yn(M,p)),C.setAttribute("faceIndex",new Yn(P,x)),t.push(C),s>ya&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function u0(i,t,e){let n=new Cr(i,t,e);return n.texture.mapping=Ih,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Ic(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function zM(i,t,e){let n=new Float32Array(So),s=new W(0,1,0);return new Ks({name:"SphericalGaussianBlur",defines:{n:So,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:vd(),fragmentShader:`

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
		`,blending:jr,depthTest:!1,depthWrite:!1})}function f0(){return new Ks({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:vd(),fragmentShader:`

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
		`,blending:jr,depthTest:!1,depthWrite:!1})}function d0(){return new Ks({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:vd(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:jr,depthTest:!1,depthWrite:!1})}function vd(){return`

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
	`}function kM(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let l=o.mapping,h=l===Tf||l===Af,u=l===Ea||l===wa;if(h||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new sh(i)),f=h?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{let f=o.image;if(h&&f&&f.height>0||u&&f&&s(f)){e===null&&(e=new sh(i));let m=h?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,m),o.addEventListener("dispose",r),m.texture}else return null}}}return o}function s(o){let l=0,h=6;for(let u=0;u<h;u++)o[u]!==void 0&&l++;return l===h}function r(o){let l=o.target;l.removeEventListener("dispose",r);let h=t.get(l);h!==void 0&&(t.delete(l),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function HM(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function VM(i,t,e,n){let s={},r=new WeakMap;function a(f){let m=f.target;m.index!==null&&t.remove(m.index);for(let y in m.attributes)t.remove(m.attributes[y]);for(let y in m.morphAttributes){let _=m.morphAttributes[y];for(let p=0,x=_.length;p<x;p++)t.remove(_[p])}m.removeEventListener("dispose",a),delete s[m.id];let d=r.get(m);d&&(t.remove(d),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function o(f,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,e.memory.geometries++),m}function l(f){let m=f.attributes;for(let y in m)t.update(m[y],i.ARRAY_BUFFER);let d=f.morphAttributes;for(let y in d){let _=d[y];for(let p=0,x=_.length;p<x;p++)t.update(_[p],i.ARRAY_BUFFER)}}function h(f){let m=[],d=f.index,y=f.attributes.position,_=0;if(d!==null){let A=d.array;_=d.version;for(let M=0,P=A.length;M<P;M+=3){let C=A[M+0],T=A[M+1],D=A[M+2];m.push(C,T,T,D,D,C)}}else if(y!==void 0){let A=y.array;_=y.version;for(let M=0,P=A.length/3-1;M<P;M+=3){let C=M+0,T=M+1,D=M+2;m.push(C,T,T,D,D,C)}}else return;let p=new(ng(m)?th:Qc)(m,1);p.version=_;let x=r.get(f);x&&t.remove(x),r.set(f,p)}function u(f){let m=r.get(f);if(m){let d=f.index;d!==null&&m.version<d.version&&h(f)}else h(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function GM(i,t,e,n){let s=n.isWebGL2,r;function a(d){r=d}let o,l;function h(d){o=d.type,l=d.bytesPerElement}function u(d,y){i.drawElements(r,y,o,d*l),e.update(y,r,1)}function f(d,y,_){if(_===0)return;let p,x;if(s)p=i,x="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),x="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[x](r,y,o,d*l,_),e.update(y,r,_)}function m(d,y,_){if(_===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<_;x++)this.render(d[x]/l,y[x]);else{p.multiDrawElementsWEBGL(r,y,0,o,d,0,_);let x=0;for(let A=0;A<_;A++)x+=y[A];e.update(x,r,1)}}this.setMode=a,this.setIndex=h,this.render=u,this.renderInstances=f,this.renderMultiDraw=m}function WM(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function XM(i,t){return i[0]-t[0]}function qM(i,t){return Math.abs(t[1])-Math.abs(i[1])}function YM(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,a=new On,o=[];for(let h=0;h<8;h++)o[h]=[h,0];function l(h,u,f){let m=h.morphTargetInfluences;if(t.isWebGL2===!0){let d=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,y=d!==void 0?d.length:0,_=r.get(u);if(_===void 0||_.count!==y){let tt=function(){mt.dispose(),r.delete(u),u.removeEventListener("dispose",tt)};_!==void 0&&_.texture.dispose();let A=u.morphAttributes.position!==void 0,M=u.morphAttributes.normal!==void 0,P=u.morphAttributes.color!==void 0,C=u.morphAttributes.position||[],T=u.morphAttributes.normal||[],D=u.morphAttributes.color||[],Y=0;A===!0&&(Y=1),M===!0&&(Y=2),P===!0&&(Y=3);let R=u.attributes.position.count*Y,E=1;R>t.maxTextureSize&&(E=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);let st=new Float32Array(R*E*4*y),mt=new jc(st,R,E,y);mt.type=Jr,mt.needsUpdate=!0;let Qt=Y*4;for(let lt=0;lt<y;lt++){let bt=C[lt],qt=T[lt],Jt=D[lt],Tt=R*E*4*lt;for(let $t=0;$t<bt.count;$t++){let le=$t*Qt;A===!0&&(a.fromBufferAttribute(bt,$t),st[Tt+le+0]=a.x,st[Tt+le+1]=a.y,st[Tt+le+2]=a.z,st[Tt+le+3]=0),M===!0&&(a.fromBufferAttribute(qt,$t),st[Tt+le+4]=a.x,st[Tt+le+5]=a.y,st[Tt+le+6]=a.z,st[Tt+le+7]=0),P===!0&&(a.fromBufferAttribute(Jt,$t),st[Tt+le+8]=a.x,st[Tt+le+9]=a.y,st[Tt+le+10]=a.z,st[Tt+le+11]=Jt.itemSize===4?a.w:1)}}_={count:y,texture:mt,size:new fe(R,E)},r.set(u,_),u.addEventListener("dispose",tt)}let p=0;for(let A=0;A<m.length;A++)p+=m[A];let x=u.morphTargetsRelative?1:1-p;f.getUniforms().setValue(i,"morphTargetBaseInfluence",x),f.getUniforms().setValue(i,"morphTargetInfluences",m),f.getUniforms().setValue(i,"morphTargetsTexture",_.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",_.size)}else{let d=m===void 0?0:m.length,y=n[u.id];if(y===void 0||y.length!==d){y=[];for(let M=0;M<d;M++)y[M]=[M,0];n[u.id]=y}for(let M=0;M<d;M++){let P=y[M];P[0]=M,P[1]=m[M]}y.sort(qM);for(let M=0;M<8;M++)M<d&&y[M][1]?(o[M][0]=y[M][0],o[M][1]=y[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(XM);let _=u.morphAttributes.position,p=u.morphAttributes.normal,x=0;for(let M=0;M<8;M++){let P=o[M],C=P[0],T=P[1];C!==Number.MAX_SAFE_INTEGER&&T?(_&&u.getAttribute("morphTarget"+M)!==_[C]&&u.setAttribute("morphTarget"+M,_[C]),p&&u.getAttribute("morphNormal"+M)!==p[C]&&u.setAttribute("morphNormal"+M,p[C]),s[M]=T,x+=T):(_&&u.hasAttribute("morphTarget"+M)===!0&&u.deleteAttribute("morphTarget"+M),p&&u.hasAttribute("morphNormal"+M)===!0&&u.deleteAttribute("morphNormal"+M),s[M]=0)}let A=u.morphTargetsRelative?1:1-x;f.getUniforms().setValue(i,"morphTargetBaseInfluence",A),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function $M(i,t,e,n){let s=new WeakMap;function r(l){let h=n.render.frame,u=l.geometry,f=t.get(l,u);if(s.get(f)!==h&&(t.update(f),s.set(f,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==h&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,h))),l.isSkinnedMesh){let m=l.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return f}function a(){s=new WeakMap}function o(l){let h=l.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}var rh=class extends Es{constructor(t,e,n,s,r,a,o,l,h,u){if(u=u!==void 0?u:wo,u!==wo&&u!==Ta)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===wo&&(n=Zr),n===void 0&&u===Ta&&(n=Eo),super(null,s,r,a,o,l,u,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Ai,this.minFilter=l!==void 0?l:Ai,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},og=new Es,ag=new rh(1,1);ag.compareFunction=eg;var lg=new jc,cg=new Df,hg=new nh,p0=[],m0=[],g0=new Float32Array(16),x0=new Float32Array(9),y0=new Float32Array(4);function Pa(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=p0[s];if(r===void 0&&(r=new Float32Array(s),p0[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ci(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Pi(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function Fh(i,t){let e=m0[t];e===void 0&&(e=new Int32Array(t),m0[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function ZM(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function JM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ci(e,t))return;i.uniform2fv(this.addr,t),Pi(e,t)}}function jM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ci(e,t))return;i.uniform3fv(this.addr,t),Pi(e,t)}}function KM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ci(e,t))return;i.uniform4fv(this.addr,t),Pi(e,t)}}function QM(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ci(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Pi(e,t)}else{if(Ci(e,n))return;y0.set(n),i.uniformMatrix2fv(this.addr,!1,y0),Pi(e,n)}}function tb(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ci(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Pi(e,t)}else{if(Ci(e,n))return;x0.set(n),i.uniformMatrix3fv(this.addr,!1,x0),Pi(e,n)}}function eb(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ci(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Pi(e,t)}else{if(Ci(e,n))return;g0.set(n),i.uniformMatrix4fv(this.addr,!1,g0),Pi(e,n)}}function nb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function ib(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ci(e,t))return;i.uniform2iv(this.addr,t),Pi(e,t)}}function sb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ci(e,t))return;i.uniform3iv(this.addr,t),Pi(e,t)}}function rb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ci(e,t))return;i.uniform4iv(this.addr,t),Pi(e,t)}}function ob(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function ab(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ci(e,t))return;i.uniform2uiv(this.addr,t),Pi(e,t)}}function lb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ci(e,t))return;i.uniform3uiv(this.addr,t),Pi(e,t)}}function cb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ci(e,t))return;i.uniform4uiv(this.addr,t),Pi(e,t)}}function hb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?ag:og;e.setTexture2D(t||r,s)}function ub(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||cg,s)}function fb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||hg,s)}function db(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||lg,s)}function pb(i){switch(i){case 5126:return ZM;case 35664:return JM;case 35665:return jM;case 35666:return KM;case 35674:return QM;case 35675:return tb;case 35676:return eb;case 5124:case 35670:return nb;case 35667:case 35671:return ib;case 35668:case 35672:return sb;case 35669:case 35673:return rb;case 5125:return ob;case 36294:return ab;case 36295:return lb;case 36296:return cb;case 35678:case 36198:case 36298:case 36306:case 35682:return hb;case 35679:case 36299:case 36307:return ub;case 35680:case 36300:case 36308:case 36293:return fb;case 36289:case 36303:case 36311:case 36292:return db}}function mb(i,t){i.uniform1fv(this.addr,t)}function gb(i,t){let e=Pa(t,this.size,2);i.uniform2fv(this.addr,e)}function xb(i,t){let e=Pa(t,this.size,3);i.uniform3fv(this.addr,e)}function yb(i,t){let e=Pa(t,this.size,4);i.uniform4fv(this.addr,e)}function _b(i,t){let e=Pa(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function vb(i,t){let e=Pa(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function Mb(i,t){let e=Pa(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function bb(i,t){i.uniform1iv(this.addr,t)}function Sb(i,t){i.uniform2iv(this.addr,t)}function Eb(i,t){i.uniform3iv(this.addr,t)}function wb(i,t){i.uniform4iv(this.addr,t)}function Tb(i,t){i.uniform1uiv(this.addr,t)}function Ab(i,t){i.uniform2uiv(this.addr,t)}function Rb(i,t){i.uniform3uiv(this.addr,t)}function Cb(i,t){i.uniform4uiv(this.addr,t)}function Pb(i,t,e){let n=this.cache,s=t.length,r=Fh(e,s);Ci(n,r)||(i.uniform1iv(this.addr,r),Pi(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||og,r[a])}function Lb(i,t,e){let n=this.cache,s=t.length,r=Fh(e,s);Ci(n,r)||(i.uniform1iv(this.addr,r),Pi(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||cg,r[a])}function Ib(i,t,e){let n=this.cache,s=t.length,r=Fh(e,s);Ci(n,r)||(i.uniform1iv(this.addr,r),Pi(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||hg,r[a])}function Db(i,t,e){let n=this.cache,s=t.length,r=Fh(e,s);Ci(n,r)||(i.uniform1iv(this.addr,r),Pi(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||lg,r[a])}function Ub(i){switch(i){case 5126:return mb;case 35664:return gb;case 35665:return xb;case 35666:return yb;case 35674:return _b;case 35675:return vb;case 35676:return Mb;case 5124:case 35670:return bb;case 35667:case 35671:return Sb;case 35668:case 35672:return Eb;case 35669:case 35673:return wb;case 5125:return Tb;case 36294:return Ab;case 36295:return Rb;case 36296:return Cb;case 35678:case 36198:case 36298:case 36306:case 35682:return Pb;case 35679:case 36299:case 36307:return Lb;case 35680:case 36300:case 36308:case 36293:return Ib;case 36289:case 36303:case 36311:case 36292:return Db}}var Of=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=pb(e.type)}},Ff=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Ub(e.type)}},Bf=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},yf=/(\w+)(\])?(\[|\.)?/g;function _0(i,t){i.seq.push(t),i.map[t.id]=t}function Nb(i,t,e){let n=i.name,s=n.length;for(yf.lastIndex=0;;){let r=yf.exec(n),a=yf.lastIndex,o=r[1],l=r[2]==="]",h=r[3];if(l&&(o=o|0),h===void 0||h==="["&&a+2===s){_0(e,h===void 0?new Of(o,i,t):new Ff(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Bf(o),_0(e,f)),e=f}}}var Sa=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Nb(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function v0(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Ob=37297,Fb=0;function Bb(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function zb(i){let t=Gn.getPrimaries(Gn.workingColorSpace),e=Gn.getPrimaries(i),n;switch(t===e?n="":t===Xc&&e===Wc?n="LinearDisplayP3ToLinearSRGB":t===Wc&&e===Xc&&(n="LinearSRGBToLinearDisplayP3"),i){case Rr:case Uh:return[n,"LinearTransferOETF"];case Wn:case yd:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function M0(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Bb(i.getShaderSource(t),a)}else return s}function kb(i,t){let e=zb(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Hb(i,t){let e;switch(t){case $1:e="Linear";break;case Z1:e="Reinhard";break;case J1:e="OptimizedCineon";break;case gd:e="ACESFilmic";break;case K1:e="AgX";break;case j1:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Vb(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(_a).join(`
`)}function Gb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(_a).join(`
`)}function Wb(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function Xb(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function _a(i){return i!==""}function b0(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function S0(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var qb=/^[ \t]*#include +<([\w\d./]+)>/gm;function zf(i){return i.replace(qb,$b)}var Yb=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function $b(i,t){let e=bn[t];if(e===void 0){let n=Yb.get(t);if(n!==void 0)e=bn[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return zf(e)}var Zb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function E0(i){return i.replace(Zb,Jb)}function Jb(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function w0(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function jb(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===X0?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===pd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Tr&&(t="SHADOWMAP_TYPE_VSM"),t}function Kb(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case Ea:case wa:t="ENVMAP_TYPE_CUBE";break;case Ih:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Qb(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case wa:t="ENVMAP_MODE_REFRACTION";break}return t}function t2(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case md:t="ENVMAP_BLENDING_MULTIPLY";break;case q1:t="ENVMAP_BLENDING_MIX";break;case Y1:t="ENVMAP_BLENDING_ADD";break}return t}function e2(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function n2(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=jb(e),h=Kb(e),u=Qb(e),f=t2(e),m=e2(e),d=e.isWebGL2?"":Vb(e),y=Gb(e),_=Wb(r),p=s.createProgram(),x,A,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(_a).join(`
`),x.length>0&&(x+=`
`),A=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_].filter(_a).join(`
`),A.length>0&&(A+=`
`)):(x=[w0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(_a).join(`
`),A=[d,w0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,_,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Kr?"#define TONE_MAPPING":"",e.toneMapping!==Kr?bn.tonemapping_pars_fragment:"",e.toneMapping!==Kr?Hb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",bn.colorspace_pars_fragment,kb("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(_a).join(`
`)),a=zf(a),a=b0(a,e),a=S0(a,e),o=zf(o),o=b0(o,e),o=S0(o,e),a=E0(a),o=E0(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,x=[y,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,A=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Wm?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Wm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+A);let P=M+x+a,C=M+A+o,T=v0(s,s.VERTEX_SHADER,P),D=v0(s,s.FRAGMENT_SHADER,C);s.attachShader(p,T),s.attachShader(p,D),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function Y(mt){if(i.debug.checkShaderErrors){let Qt=s.getProgramInfoLog(p).trim(),tt=s.getShaderInfoLog(T).trim(),lt=s.getShaderInfoLog(D).trim(),bt=!0,qt=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(bt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,T,D);else{let Jt=M0(s,T,"vertex"),Tt=M0(s,D,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+Qt+`
`+Jt+`
`+Tt)}else Qt!==""?console.warn("THREE.WebGLProgram: Program Info Log:",Qt):(tt===""||lt==="")&&(qt=!1);qt&&(mt.diagnostics={runnable:bt,programLog:Qt,vertexShader:{log:tt,prefix:x},fragmentShader:{log:lt,prefix:A}})}s.deleteShader(T),s.deleteShader(D),R=new Sa(s,p),E=Xb(s,p)}let R;this.getUniforms=function(){return R===void 0&&Y(this),R};let E;this.getAttributes=function(){return E===void 0&&Y(this),E};let st=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return st===!1&&(st=s.getProgramParameter(p,Ob)),st},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Fb++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=T,this.fragmentShader=D,this}var i2=0,kf=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new Hf(t),e.set(t,n)),n}},Hf=class{constructor(t){this.id=i2++,this.code=t,this.usedTimes=0}};function s2(i,t,e,n,s,r,a){let o=new xl,l=new kf,h=[],u=s.isWebGL2,f=s.logarithmicDepthBuffer,m=s.vertexTextures,d=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function _(R){return R===0?"uv":`uv${R}`}function p(R,E,st,mt,Qt){let tt=mt.fog,lt=Qt.geometry,bt=R.isMeshStandardMaterial?mt.environment:null,qt=(R.isMeshStandardMaterial?e:t).get(R.envMap||bt),Jt=qt&&qt.mapping===Ih?qt.image.height:null,Tt=y[R.type];R.precision!==null&&(d=s.getMaxPrecision(R.precision),d!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",d,"instead."));let $t=lt.morphAttributes.position||lt.morphAttributes.normal||lt.morphAttributes.color,le=$t!==void 0?$t.length:0,Me=0;lt.morphAttributes.position!==void 0&&(Me=1),lt.morphAttributes.normal!==void 0&&(Me=2),lt.morphAttributes.color!==void 0&&(Me=3);let Ct,Bt,ge,Re;if(Tt){let He=rs[Tt];Ct=He.vertexShader,Bt=He.fragmentShader}else Ct=R.vertexShader,Bt=R.fragmentShader,l.update(R),ge=l.getVertexShaderID(R),Re=l.getFragmentShaderID(R);let Pe=i.getRenderTarget(),Xe=Qt.isInstancedMesh===!0,Ze=Qt.isBatchedMesh===!0,Ie=!!R.map,Be=!!R.matcap,et=!!qt,Se=!!R.aoMap,ct=!!R.lightMap,ye=!!R.bumpMap,jt=!!R.normalMap,ke=!!R.displacementMap,be=!!R.emissiveMap,O=!!R.metalnessMap,I=!!R.roughnessMap,yt=R.anisotropy>0,me=R.clearcoat>0,de=R.iridescence>0,ue=R.sheen>0,We=R.transmission>0,Yt=yt&&!!R.anisotropyMap,we=me&&!!R.clearcoatMap,je=me&&!!R.clearcoatNormalMap,rn=me&&!!R.clearcoatRoughnessMap,pe=de&&!!R.iridescenceMap,yn=de&&!!R.iridescenceThicknessMap,G=ue&&!!R.sheenColorMap,ae=ue&&!!R.sheenRoughnessMap,ve=!!R.specularMap,nt=!!R.specularColorMap,ft=!!R.specularIntensityMap,Kt=We&&!!R.transmissionMap,ee=We&&!!R.thicknessMap,ne=!!R.gradientMap,ht=!!R.alphaMap,V=R.alphaTest>0,Dt=!!R.alphaHash,Ht=!!R.extensions,re=!!lt.attributes.uv1,ce=!!lt.attributes.uv2,De=!!lt.attributes.uv3,te=Kr;return R.toneMapped&&(Pe===null||Pe.isXRRenderTarget===!0)&&(te=i.toneMapping),{isWebGL2:u,shaderID:Tt,shaderType:R.type,shaderName:R.name,vertexShader:Ct,fragmentShader:Bt,defines:R.defines,customVertexShaderID:ge,customFragmentShaderID:Re,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:d,batching:Ze,instancing:Xe,instancingColor:Xe&&Qt.instanceColor!==null,supportsVertexTextures:m,outputColorSpace:Pe===null?i.outputColorSpace:Pe.isXRRenderTarget===!0?Pe.texture.colorSpace:Rr,map:Ie,matcap:Be,envMap:et,envMapMode:et&&qt.mapping,envMapCubeUVHeight:Jt,aoMap:Se,lightMap:ct,bumpMap:ye,normalMap:jt,displacementMap:m&&ke,emissiveMap:be,normalMapObjectSpace:jt&&R.normalMapType===hy,normalMapTangentSpace:jt&&R.normalMapType===Dh,metalnessMap:O,roughnessMap:I,anisotropy:yt,anisotropyMap:Yt,clearcoat:me,clearcoatMap:we,clearcoatNormalMap:je,clearcoatRoughnessMap:rn,iridescence:de,iridescenceMap:pe,iridescenceThicknessMap:yn,sheen:ue,sheenColorMap:G,sheenRoughnessMap:ae,specularMap:ve,specularColorMap:nt,specularIntensityMap:ft,transmission:We,transmissionMap:Kt,thicknessMap:ee,gradientMap:ne,opaque:R.transparent===!1&&R.blending===Ma,alphaMap:ht,alphaTest:V,alphaHash:Dt,combine:R.combine,mapUv:Ie&&_(R.map.channel),aoMapUv:Se&&_(R.aoMap.channel),lightMapUv:ct&&_(R.lightMap.channel),bumpMapUv:ye&&_(R.bumpMap.channel),normalMapUv:jt&&_(R.normalMap.channel),displacementMapUv:ke&&_(R.displacementMap.channel),emissiveMapUv:be&&_(R.emissiveMap.channel),metalnessMapUv:O&&_(R.metalnessMap.channel),roughnessMapUv:I&&_(R.roughnessMap.channel),anisotropyMapUv:Yt&&_(R.anisotropyMap.channel),clearcoatMapUv:we&&_(R.clearcoatMap.channel),clearcoatNormalMapUv:je&&_(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:rn&&_(R.clearcoatRoughnessMap.channel),iridescenceMapUv:pe&&_(R.iridescenceMap.channel),iridescenceThicknessMapUv:yn&&_(R.iridescenceThicknessMap.channel),sheenColorMapUv:G&&_(R.sheenColorMap.channel),sheenRoughnessMapUv:ae&&_(R.sheenRoughnessMap.channel),specularMapUv:ve&&_(R.specularMap.channel),specularColorMapUv:nt&&_(R.specularColorMap.channel),specularIntensityMapUv:ft&&_(R.specularIntensityMap.channel),transmissionMapUv:Kt&&_(R.transmissionMap.channel),thicknessMapUv:ee&&_(R.thicknessMap.channel),alphaMapUv:ht&&_(R.alphaMap.channel),vertexTangents:!!lt.attributes.tangent&&(jt||yt),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!lt.attributes.color&&lt.attributes.color.itemSize===4,vertexUv1s:re,vertexUv2s:ce,vertexUv3s:De,pointsUvs:Qt.isPoints===!0&&!!lt.attributes.uv&&(Ie||ht),fog:!!tt,useFog:R.fog===!0,fogExp2:tt&&tt.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:Qt.isSkinnedMesh===!0,morphTargets:lt.morphAttributes.position!==void 0,morphNormals:lt.morphAttributes.normal!==void 0,morphColors:lt.morphAttributes.color!==void 0,morphTargetsCount:le,morphTextureStride:Me,numDirLights:E.directional.length,numPointLights:E.point.length,numSpotLights:E.spot.length,numSpotLightMaps:E.spotLightMap.length,numRectAreaLights:E.rectArea.length,numHemiLights:E.hemi.length,numDirLightShadows:E.directionalShadowMap.length,numPointLightShadows:E.pointShadowMap.length,numSpotLightShadows:E.spotShadowMap.length,numSpotLightShadowsWithMaps:E.numSpotLightShadowsWithMaps,numLightProbes:E.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:R.dithering,shadowMapEnabled:i.shadowMap.enabled&&st.length>0,shadowMapType:i.shadowMap.type,toneMapping:te,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Ie&&R.map.isVideoTexture===!0&&Gn.getTransfer(R.map.colorSpace)===ai,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===xn,flipSided:R.side===fs,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionDerivatives:Ht&&R.extensions.derivatives===!0,extensionFragDepth:Ht&&R.extensions.fragDepth===!0,extensionDrawBuffers:Ht&&R.extensions.drawBuffers===!0,extensionShaderTextureLOD:Ht&&R.extensions.shaderTextureLOD===!0,extensionClipCullDistance:Ht&&R.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()}}function x(R){let E=[];if(R.shaderID?E.push(R.shaderID):(E.push(R.customVertexShaderID),E.push(R.customFragmentShaderID)),R.defines!==void 0)for(let st in R.defines)E.push(st),E.push(R.defines[st]);return R.isRawShaderMaterial===!1&&(A(E,R),M(E,R),E.push(i.outputColorSpace)),E.push(R.customProgramCacheKey),E.join()}function A(R,E){R.push(E.precision),R.push(E.outputColorSpace),R.push(E.envMapMode),R.push(E.envMapCubeUVHeight),R.push(E.mapUv),R.push(E.alphaMapUv),R.push(E.lightMapUv),R.push(E.aoMapUv),R.push(E.bumpMapUv),R.push(E.normalMapUv),R.push(E.displacementMapUv),R.push(E.emissiveMapUv),R.push(E.metalnessMapUv),R.push(E.roughnessMapUv),R.push(E.anisotropyMapUv),R.push(E.clearcoatMapUv),R.push(E.clearcoatNormalMapUv),R.push(E.clearcoatRoughnessMapUv),R.push(E.iridescenceMapUv),R.push(E.iridescenceThicknessMapUv),R.push(E.sheenColorMapUv),R.push(E.sheenRoughnessMapUv),R.push(E.specularMapUv),R.push(E.specularColorMapUv),R.push(E.specularIntensityMapUv),R.push(E.transmissionMapUv),R.push(E.thicknessMapUv),R.push(E.combine),R.push(E.fogExp2),R.push(E.sizeAttenuation),R.push(E.morphTargetsCount),R.push(E.morphAttributeCount),R.push(E.numDirLights),R.push(E.numPointLights),R.push(E.numSpotLights),R.push(E.numSpotLightMaps),R.push(E.numHemiLights),R.push(E.numRectAreaLights),R.push(E.numDirLightShadows),R.push(E.numPointLightShadows),R.push(E.numSpotLightShadows),R.push(E.numSpotLightShadowsWithMaps),R.push(E.numLightProbes),R.push(E.shadowMapType),R.push(E.toneMapping),R.push(E.numClippingPlanes),R.push(E.numClipIntersection),R.push(E.depthPacking)}function M(R,E){o.disableAll(),E.isWebGL2&&o.enable(0),E.supportsVertexTextures&&o.enable(1),E.instancing&&o.enable(2),E.instancingColor&&o.enable(3),E.matcap&&o.enable(4),E.envMap&&o.enable(5),E.normalMapObjectSpace&&o.enable(6),E.normalMapTangentSpace&&o.enable(7),E.clearcoat&&o.enable(8),E.iridescence&&o.enable(9),E.alphaTest&&o.enable(10),E.vertexColors&&o.enable(11),E.vertexAlphas&&o.enable(12),E.vertexUv1s&&o.enable(13),E.vertexUv2s&&o.enable(14),E.vertexUv3s&&o.enable(15),E.vertexTangents&&o.enable(16),E.anisotropy&&o.enable(17),E.alphaHash&&o.enable(18),E.batching&&o.enable(19),R.push(o.mask),o.disableAll(),E.fog&&o.enable(0),E.useFog&&o.enable(1),E.flatShading&&o.enable(2),E.logarithmicDepthBuffer&&o.enable(3),E.skinning&&o.enable(4),E.morphTargets&&o.enable(5),E.morphNormals&&o.enable(6),E.morphColors&&o.enable(7),E.premultipliedAlpha&&o.enable(8),E.shadowMapEnabled&&o.enable(9),E.useLegacyLights&&o.enable(10),E.doubleSided&&o.enable(11),E.flipSided&&o.enable(12),E.useDepthPacking&&o.enable(13),E.dithering&&o.enable(14),E.transmission&&o.enable(15),E.sheen&&o.enable(16),E.opaque&&o.enable(17),E.pointsUvs&&o.enable(18),E.decodeVideoTexture&&o.enable(19),R.push(o.mask)}function P(R){let E=y[R.type],st;if(E){let mt=rs[E];st=Oh.clone(mt.uniforms)}else st=R.uniforms;return st}function C(R,E){let st;for(let mt=0,Qt=h.length;mt<Qt;mt++){let tt=h[mt];if(tt.cacheKey===E){st=tt,++st.usedTimes;break}}return st===void 0&&(st=new n2(i,E,R,r),h.push(st)),st}function T(R){if(--R.usedTimes===0){let E=h.indexOf(R);h[E]=h[h.length-1],h.pop(),R.destroy()}}function D(R){l.remove(R)}function Y(){l.dispose()}return{getParameters:p,getProgramCacheKey:x,getUniforms:P,acquireProgram:C,releaseProgram:T,releaseShaderCache:D,programs:h,dispose:Y}}function r2(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function o2(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function T0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function A0(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,m,d,y,_,p){let x=i[t];return x===void 0?(x={id:f.id,object:f,geometry:m,material:d,groupOrder:y,renderOrder:f.renderOrder,z:_,group:p},i[t]=x):(x.id=f.id,x.object=f,x.geometry=m,x.material=d,x.groupOrder=y,x.renderOrder=f.renderOrder,x.z=_,x.group=p),t++,x}function o(f,m,d,y,_,p){let x=a(f,m,d,y,_,p);d.transmission>0?n.push(x):d.transparent===!0?s.push(x):e.push(x)}function l(f,m,d,y,_,p){let x=a(f,m,d,y,_,p);d.transmission>0?n.unshift(x):d.transparent===!0?s.unshift(x):e.unshift(x)}function h(f,m){e.length>1&&e.sort(f||o2),n.length>1&&n.sort(m||T0),s.length>1&&s.sort(m||T0)}function u(){for(let f=t,m=i.length;f<m;f++){let d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:h}}function a2(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new A0,i.set(n,[a])):s>=r.length?(a=new A0,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function l2(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new W,color:new fn};break;case"SpotLight":e={position:new W,direction:new W,color:new fn,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new W,color:new fn,distance:0,decay:0};break;case"HemisphereLight":e={direction:new W,skyColor:new fn,groundColor:new fn};break;case"RectAreaLight":e={color:new fn,position:new W,halfWidth:new W,halfHeight:new W};break}return i[t.id]=e,e}}}function c2(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new fe,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var h2=0;function u2(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function f2(i,t){let e=new l2,n=c2(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)s.probe.push(new W);let r=new W,a=new Un,o=new Un;function l(u,f){let m=0,d=0,y=0;for(let mt=0;mt<9;mt++)s.probe[mt].set(0,0,0);let _=0,p=0,x=0,A=0,M=0,P=0,C=0,T=0,D=0,Y=0,R=0;u.sort(u2);let E=f===!0?Math.PI:1;for(let mt=0,Qt=u.length;mt<Qt;mt++){let tt=u[mt],lt=tt.color,bt=tt.intensity,qt=tt.distance,Jt=tt.shadow&&tt.shadow.map?tt.shadow.map.texture:null;if(tt.isAmbientLight)m+=lt.r*bt*E,d+=lt.g*bt*E,y+=lt.b*bt*E;else if(tt.isLightProbe){for(let Tt=0;Tt<9;Tt++)s.probe[Tt].addScaledVector(tt.sh.coefficients[Tt],bt);R++}else if(tt.isDirectionalLight){let Tt=e.get(tt);if(Tt.color.copy(tt.color).multiplyScalar(tt.intensity*E),tt.castShadow){let $t=tt.shadow,le=n.get(tt);le.shadowBias=$t.bias,le.shadowNormalBias=$t.normalBias,le.shadowRadius=$t.radius,le.shadowMapSize=$t.mapSize,s.directionalShadow[_]=le,s.directionalShadowMap[_]=Jt,s.directionalShadowMatrix[_]=tt.shadow.matrix,P++}s.directional[_]=Tt,_++}else if(tt.isSpotLight){let Tt=e.get(tt);Tt.position.setFromMatrixPosition(tt.matrixWorld),Tt.color.copy(lt).multiplyScalar(bt*E),Tt.distance=qt,Tt.coneCos=Math.cos(tt.angle),Tt.penumbraCos=Math.cos(tt.angle*(1-tt.penumbra)),Tt.decay=tt.decay,s.spot[x]=Tt;let $t=tt.shadow;if(tt.map&&(s.spotLightMap[D]=tt.map,D++,$t.updateMatrices(tt),tt.castShadow&&Y++),s.spotLightMatrix[x]=$t.matrix,tt.castShadow){let le=n.get(tt);le.shadowBias=$t.bias,le.shadowNormalBias=$t.normalBias,le.shadowRadius=$t.radius,le.shadowMapSize=$t.mapSize,s.spotShadow[x]=le,s.spotShadowMap[x]=Jt,T++}x++}else if(tt.isRectAreaLight){let Tt=e.get(tt);Tt.color.copy(lt).multiplyScalar(bt),Tt.halfWidth.set(tt.width*.5,0,0),Tt.halfHeight.set(0,tt.height*.5,0),s.rectArea[A]=Tt,A++}else if(tt.isPointLight){let Tt=e.get(tt);if(Tt.color.copy(tt.color).multiplyScalar(tt.intensity*E),Tt.distance=tt.distance,Tt.decay=tt.decay,tt.castShadow){let $t=tt.shadow,le=n.get(tt);le.shadowBias=$t.bias,le.shadowNormalBias=$t.normalBias,le.shadowRadius=$t.radius,le.shadowMapSize=$t.mapSize,le.shadowCameraNear=$t.camera.near,le.shadowCameraFar=$t.camera.far,s.pointShadow[p]=le,s.pointShadowMap[p]=Jt,s.pointShadowMatrix[p]=tt.shadow.matrix,C++}s.point[p]=Tt,p++}else if(tt.isHemisphereLight){let Tt=e.get(tt);Tt.skyColor.copy(tt.color).multiplyScalar(bt*E),Tt.groundColor.copy(tt.groundColor).multiplyScalar(bt*E),s.hemi[M]=Tt,M++}}A>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_FLOAT_1,s.rectAreaLTC2=Ae.LTC_FLOAT_2):(s.rectAreaLTC1=Ae.LTC_HALF_1,s.rectAreaLTC2=Ae.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_FLOAT_1,s.rectAreaLTC2=Ae.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Ae.LTC_HALF_1,s.rectAreaLTC2=Ae.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=m,s.ambient[1]=d,s.ambient[2]=y;let st=s.hash;(st.directionalLength!==_||st.pointLength!==p||st.spotLength!==x||st.rectAreaLength!==A||st.hemiLength!==M||st.numDirectionalShadows!==P||st.numPointShadows!==C||st.numSpotShadows!==T||st.numSpotMaps!==D||st.numLightProbes!==R)&&(s.directional.length=_,s.spot.length=x,s.rectArea.length=A,s.point.length=p,s.hemi.length=M,s.directionalShadow.length=P,s.directionalShadowMap.length=P,s.pointShadow.length=C,s.pointShadowMap.length=C,s.spotShadow.length=T,s.spotShadowMap.length=T,s.directionalShadowMatrix.length=P,s.pointShadowMatrix.length=C,s.spotLightMatrix.length=T+D-Y,s.spotLightMap.length=D,s.numSpotLightShadowsWithMaps=Y,s.numLightProbes=R,st.directionalLength=_,st.pointLength=p,st.spotLength=x,st.rectAreaLength=A,st.hemiLength=M,st.numDirectionalShadows=P,st.numPointShadows=C,st.numSpotShadows=T,st.numSpotMaps=D,st.numLightProbes=R,s.version=h2++)}function h(u,f){let m=0,d=0,y=0,_=0,p=0,x=f.matrixWorldInverse;for(let A=0,M=u.length;A<M;A++){let P=u[A];if(P.isDirectionalLight){let C=s.directional[m];C.direction.setFromMatrixPosition(P.matrixWorld),r.setFromMatrixPosition(P.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(x),m++}else if(P.isSpotLight){let C=s.spot[y];C.position.setFromMatrixPosition(P.matrixWorld),C.position.applyMatrix4(x),C.direction.setFromMatrixPosition(P.matrixWorld),r.setFromMatrixPosition(P.target.matrixWorld),C.direction.sub(r),C.direction.transformDirection(x),y++}else if(P.isRectAreaLight){let C=s.rectArea[_];C.position.setFromMatrixPosition(P.matrixWorld),C.position.applyMatrix4(x),o.identity(),a.copy(P.matrixWorld),a.premultiply(x),o.extractRotation(a),C.halfWidth.set(P.width*.5,0,0),C.halfHeight.set(0,P.height*.5,0),C.halfWidth.applyMatrix4(o),C.halfHeight.applyMatrix4(o),_++}else if(P.isPointLight){let C=s.point[d];C.position.setFromMatrixPosition(P.matrixWorld),C.position.applyMatrix4(x),d++}else if(P.isHemisphereLight){let C=s.hemi[p];C.direction.setFromMatrixPosition(P.matrixWorld),C.direction.transformDirection(x),p++}}}return{setup:l,setupView:h,state:s}}function R0(i,t){let e=new f2(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(f){n.push(f)}function o(f){s.push(f)}function l(f){e.setup(n,f)}function h(f){e.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o}}function d2(i,t){let e=new WeakMap;function n(r,a=0){let o=e.get(r),l;return o===void 0?(l=new R0(i,t),e.set(r,[l])):a>=o.length?(l=new R0(i,t),o.push(l)):l=o[a],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var Vf=class extends dr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ly,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Gf=class extends dr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},p2=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,m2=`uniform sampler2D shadow_pass;
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
}`;function g2(i,t,e){let n=new yl,s=new fe,r=new fe,a=new On,o=new Vf({depthPacking:cy}),l=new Gf,h={},u=e.maxTextureSize,f={[to]:fs,[fs]:to,[xn]:xn},m=new Ks({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new fe},radius:{value:4}},vertexShader:p2,fragmentShader:m2}),d=m.clone();d.defines.HORIZONTAL_PASS=1;let y=new Pn;y.setAttribute("position",new Yn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let _=new Qe(y,m),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=X0;let x=this.type;this.render=function(T,D,Y){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||T.length===0)return;let R=i.getRenderTarget(),E=i.getActiveCubeFace(),st=i.getActiveMipmapLevel(),mt=i.state;mt.setBlending(jr),mt.buffers.color.setClear(1,1,1,1),mt.buffers.depth.setTest(!0),mt.setScissorTest(!1);let Qt=x!==Tr&&this.type===Tr,tt=x===Tr&&this.type!==Tr;for(let lt=0,bt=T.length;lt<bt;lt++){let qt=T[lt],Jt=qt.shadow;if(Jt===void 0){console.warn("THREE.WebGLShadowMap:",qt,"has no shadow.");continue}if(Jt.autoUpdate===!1&&Jt.needsUpdate===!1)continue;s.copy(Jt.mapSize);let Tt=Jt.getFrameExtents();if(s.multiply(Tt),r.copy(Jt.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Tt.x),s.x=r.x*Tt.x,Jt.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Tt.y),s.y=r.y*Tt.y,Jt.mapSize.y=r.y)),Jt.map===null||Qt===!0||tt===!0){let le=this.type!==Tr?{minFilter:Ai,magFilter:Ai}:{};Jt.map!==null&&Jt.map.dispose(),Jt.map=new Cr(s.x,s.y,le),Jt.map.texture.name=qt.name+".shadowMap",Jt.camera.updateProjectionMatrix()}i.setRenderTarget(Jt.map),i.clear();let $t=Jt.getViewportCount();for(let le=0;le<$t;le++){let Me=Jt.getViewport(le);a.set(r.x*Me.x,r.y*Me.y,r.x*Me.z,r.y*Me.w),mt.viewport(a),Jt.updateMatrices(qt,le),n=Jt.getFrustum(),P(D,Y,Jt.camera,qt,this.type)}Jt.isPointLightShadow!==!0&&this.type===Tr&&A(Jt,Y),Jt.needsUpdate=!1}x=this.type,p.needsUpdate=!1,i.setRenderTarget(R,E,st)};function A(T,D){let Y=t.update(_);m.defines.VSM_SAMPLES!==T.blurSamples&&(m.defines.VSM_SAMPLES=T.blurSamples,d.defines.VSM_SAMPLES=T.blurSamples,m.needsUpdate=!0,d.needsUpdate=!0),T.mapPass===null&&(T.mapPass=new Cr(s.x,s.y)),m.uniforms.shadow_pass.value=T.map.texture,m.uniforms.resolution.value=T.mapSize,m.uniforms.radius.value=T.radius,i.setRenderTarget(T.mapPass),i.clear(),i.renderBufferDirect(D,null,Y,m,_,null),d.uniforms.shadow_pass.value=T.mapPass.texture,d.uniforms.resolution.value=T.mapSize,d.uniforms.radius.value=T.radius,i.setRenderTarget(T.map),i.clear(),i.renderBufferDirect(D,null,Y,d,_,null)}function M(T,D,Y,R){let E=null,st=Y.isPointLight===!0?T.customDistanceMaterial:T.customDepthMaterial;if(st!==void 0)E=st;else if(E=Y.isPointLight===!0?l:o,i.localClippingEnabled&&D.clipShadows===!0&&Array.isArray(D.clippingPlanes)&&D.clippingPlanes.length!==0||D.displacementMap&&D.displacementScale!==0||D.alphaMap&&D.alphaTest>0||D.map&&D.alphaTest>0){let mt=E.uuid,Qt=D.uuid,tt=h[mt];tt===void 0&&(tt={},h[mt]=tt);let lt=tt[Qt];lt===void 0&&(lt=E.clone(),tt[Qt]=lt,D.addEventListener("dispose",C)),E=lt}if(E.visible=D.visible,E.wireframe=D.wireframe,R===Tr?E.side=D.shadowSide!==null?D.shadowSide:D.side:E.side=D.shadowSide!==null?D.shadowSide:f[D.side],E.alphaMap=D.alphaMap,E.alphaTest=D.alphaTest,E.map=D.map,E.clipShadows=D.clipShadows,E.clippingPlanes=D.clippingPlanes,E.clipIntersection=D.clipIntersection,E.displacementMap=D.displacementMap,E.displacementScale=D.displacementScale,E.displacementBias=D.displacementBias,E.wireframeLinewidth=D.wireframeLinewidth,E.linewidth=D.linewidth,Y.isPointLight===!0&&E.isMeshDistanceMaterial===!0){let mt=i.properties.get(E);mt.light=Y}return E}function P(T,D,Y,R,E){if(T.visible===!1)return;if(T.layers.test(D.layers)&&(T.isMesh||T.isLine||T.isPoints)&&(T.castShadow||T.receiveShadow&&E===Tr)&&(!T.frustumCulled||n.intersectsObject(T))){T.modelViewMatrix.multiplyMatrices(Y.matrixWorldInverse,T.matrixWorld);let Qt=t.update(T),tt=T.material;if(Array.isArray(tt)){let lt=Qt.groups;for(let bt=0,qt=lt.length;bt<qt;bt++){let Jt=lt[bt],Tt=tt[Jt.materialIndex];if(Tt&&Tt.visible){let $t=M(T,Tt,R,E);T.onBeforeShadow(i,T,D,Y,Qt,$t,Jt),i.renderBufferDirect(Y,null,Qt,$t,T,Jt),T.onAfterShadow(i,T,D,Y,Qt,$t,Jt)}}}else if(tt.visible){let lt=M(T,tt,R,E);T.onBeforeShadow(i,T,D,Y,Qt,lt,null),i.renderBufferDirect(Y,null,Qt,lt,T,null),T.onAfterShadow(i,T,D,Y,Qt,lt,null)}}let mt=T.children;for(let Qt=0,tt=mt.length;Qt<tt;Qt++)P(mt[Qt],D,Y,R,E)}function C(T){T.target.removeEventListener("dispose",C);for(let Y in h){let R=h[Y],E=T.target.uuid;E in R&&(R[E].dispose(),delete R[E])}}}function x2(i,t,e){let n=e.isWebGL2;function s(){let V=!1,Dt=new On,Ht=null,re=new On(0,0,0,0);return{setMask:function(ce){Ht!==ce&&!V&&(i.colorMask(ce,ce,ce,ce),Ht=ce)},setLocked:function(ce){V=ce},setClear:function(ce,De,te,Ue,He){He===!0&&(ce*=Ue,De*=Ue,te*=Ue),Dt.set(ce,De,te,Ue),re.equals(Dt)===!1&&(i.clearColor(ce,De,te,Ue),re.copy(Dt))},reset:function(){V=!1,Ht=null,re.set(-1,0,0,0)}}}function r(){let V=!1,Dt=null,Ht=null,re=null;return{setTest:function(ce){ce?Ze(i.DEPTH_TEST):Ie(i.DEPTH_TEST)},setMask:function(ce){Dt!==ce&&!V&&(i.depthMask(ce),Dt=ce)},setFunc:function(ce){if(Ht!==ce){switch(ce){case z1:i.depthFunc(i.NEVER);break;case k1:i.depthFunc(i.ALWAYS);break;case H1:i.depthFunc(i.LESS);break;case kc:i.depthFunc(i.LEQUAL);break;case V1:i.depthFunc(i.EQUAL);break;case G1:i.depthFunc(i.GEQUAL);break;case W1:i.depthFunc(i.GREATER);break;case X1:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}Ht=ce}},setLocked:function(ce){V=ce},setClear:function(ce){re!==ce&&(i.clearDepth(ce),re=ce)},reset:function(){V=!1,Dt=null,Ht=null,re=null}}}function a(){let V=!1,Dt=null,Ht=null,re=null,ce=null,De=null,te=null,Ue=null,He=null;return{setTest:function(Ne){V||(Ne?Ze(i.STENCIL_TEST):Ie(i.STENCIL_TEST))},setMask:function(Ne){Dt!==Ne&&!V&&(i.stencilMask(Ne),Dt=Ne)},setFunc:function(Ne,on,un){(Ht!==Ne||re!==on||ce!==un)&&(i.stencilFunc(Ne,on,un),Ht=Ne,re=on,ce=un)},setOp:function(Ne,on,un){(De!==Ne||te!==on||Ue!==un)&&(i.stencilOp(Ne,on,un),De=Ne,te=on,Ue=un)},setLocked:function(Ne){V=Ne},setClear:function(Ne){He!==Ne&&(i.clearStencil(Ne),He=Ne)},reset:function(){V=!1,Dt=null,Ht=null,re=null,ce=null,De=null,te=null,Ue=null,He=null}}}let o=new s,l=new r,h=new a,u=new WeakMap,f=new WeakMap,m={},d={},y=new WeakMap,_=[],p=null,x=!1,A=null,M=null,P=null,C=null,T=null,D=null,Y=null,R=new fn(0,0,0),E=0,st=!1,mt=null,Qt=null,tt=null,lt=null,bt=null,qt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Jt=!1,Tt=0,$t=i.getParameter(i.VERSION);$t.indexOf("WebGL")!==-1?(Tt=parseFloat(/^WebGL (\d)/.exec($t)[1]),Jt=Tt>=1):$t.indexOf("OpenGL ES")!==-1&&(Tt=parseFloat(/^OpenGL ES (\d)/.exec($t)[1]),Jt=Tt>=2);let le=null,Me={},Ct=i.getParameter(i.SCISSOR_BOX),Bt=i.getParameter(i.VIEWPORT),ge=new On().fromArray(Ct),Re=new On().fromArray(Bt);function Pe(V,Dt,Ht,re){let ce=new Uint8Array(4),De=i.createTexture();i.bindTexture(V,De),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let te=0;te<Ht;te++)n&&(V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY)?i.texImage3D(Dt,0,i.RGBA,1,1,re,0,i.RGBA,i.UNSIGNED_BYTE,ce):i.texImage2D(Dt+te,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ce);return De}let Xe={};Xe[i.TEXTURE_2D]=Pe(i.TEXTURE_2D,i.TEXTURE_2D,1),Xe[i.TEXTURE_CUBE_MAP]=Pe(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(Xe[i.TEXTURE_2D_ARRAY]=Pe(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),Xe[i.TEXTURE_3D]=Pe(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),h.setClear(0),Ze(i.DEPTH_TEST),l.setFunc(kc),be(!1),O(lm),Ze(i.CULL_FACE),jt(jr);function Ze(V){m[V]!==!0&&(i.enable(V),m[V]=!0)}function Ie(V){m[V]!==!1&&(i.disable(V),m[V]=!1)}function Be(V,Dt){return d[V]!==Dt?(i.bindFramebuffer(V,Dt),d[V]=Dt,n&&(V===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=Dt),V===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=Dt)),!0):!1}function et(V,Dt){let Ht=_,re=!1;if(V)if(Ht=y.get(Dt),Ht===void 0&&(Ht=[],y.set(Dt,Ht)),V.isWebGLMultipleRenderTargets){let ce=V.texture;if(Ht.length!==ce.length||Ht[0]!==i.COLOR_ATTACHMENT0){for(let De=0,te=ce.length;De<te;De++)Ht[De]=i.COLOR_ATTACHMENT0+De;Ht.length=ce.length,re=!0}}else Ht[0]!==i.COLOR_ATTACHMENT0&&(Ht[0]=i.COLOR_ATTACHMENT0,re=!0);else Ht[0]!==i.BACK&&(Ht[0]=i.BACK,re=!0);re&&(e.isWebGL2?i.drawBuffers(Ht):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(Ht))}function Se(V){return p!==V?(i.useProgram(V),p=V,!0):!1}let ct={[bo]:i.FUNC_ADD,[E1]:i.FUNC_SUBTRACT,[w1]:i.FUNC_REVERSE_SUBTRACT};if(n)ct[fm]=i.MIN,ct[dm]=i.MAX;else{let V=t.get("EXT_blend_minmax");V!==null&&(ct[fm]=V.MIN_EXT,ct[dm]=V.MAX_EXT)}let ye={[T1]:i.ZERO,[A1]:i.ONE,[R1]:i.SRC_COLOR,[Ef]:i.SRC_ALPHA,[U1]:i.SRC_ALPHA_SATURATE,[I1]:i.DST_COLOR,[P1]:i.DST_ALPHA,[C1]:i.ONE_MINUS_SRC_COLOR,[wf]:i.ONE_MINUS_SRC_ALPHA,[D1]:i.ONE_MINUS_DST_COLOR,[L1]:i.ONE_MINUS_DST_ALPHA,[N1]:i.CONSTANT_COLOR,[O1]:i.ONE_MINUS_CONSTANT_COLOR,[F1]:i.CONSTANT_ALPHA,[B1]:i.ONE_MINUS_CONSTANT_ALPHA};function jt(V,Dt,Ht,re,ce,De,te,Ue,He,Ne){if(V===jr){x===!0&&(Ie(i.BLEND),x=!1);return}if(x===!1&&(Ze(i.BLEND),x=!0),V!==S1){if(V!==A||Ne!==st){if((M!==bo||T!==bo)&&(i.blendEquation(i.FUNC_ADD),M=bo,T=bo),Ne)switch(V){case Ma:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cm:i.blendFunc(i.ONE,i.ONE);break;case hm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case um:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case Ma:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case cm:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case hm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case um:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}P=null,C=null,D=null,Y=null,R.set(0,0,0),E=0,A=V,st=Ne}return}ce=ce||Dt,De=De||Ht,te=te||re,(Dt!==M||ce!==T)&&(i.blendEquationSeparate(ct[Dt],ct[ce]),M=Dt,T=ce),(Ht!==P||re!==C||De!==D||te!==Y)&&(i.blendFuncSeparate(ye[Ht],ye[re],ye[De],ye[te]),P=Ht,C=re,D=De,Y=te),(Ue.equals(R)===!1||He!==E)&&(i.blendColor(Ue.r,Ue.g,Ue.b,He),R.copy(Ue),E=He),A=V,st=!1}function ke(V,Dt){V.side===xn?Ie(i.CULL_FACE):Ze(i.CULL_FACE);let Ht=V.side===fs;Dt&&(Ht=!Ht),be(Ht),V.blending===Ma&&V.transparent===!1?jt(jr):jt(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),l.setFunc(V.depthFunc),l.setTest(V.depthTest),l.setMask(V.depthWrite),o.setMask(V.colorWrite);let re=V.stencilWrite;h.setTest(re),re&&(h.setMask(V.stencilWriteMask),h.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),h.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),yt(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?Ze(i.SAMPLE_ALPHA_TO_COVERAGE):Ie(i.SAMPLE_ALPHA_TO_COVERAGE)}function be(V){mt!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),mt=V)}function O(V){V!==M1?(Ze(i.CULL_FACE),V!==Qt&&(V===lm?i.cullFace(i.BACK):V===b1?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ie(i.CULL_FACE),Qt=V}function I(V){V!==tt&&(Jt&&i.lineWidth(V),tt=V)}function yt(V,Dt,Ht){V?(Ze(i.POLYGON_OFFSET_FILL),(lt!==Dt||bt!==Ht)&&(i.polygonOffset(Dt,Ht),lt=Dt,bt=Ht)):Ie(i.POLYGON_OFFSET_FILL)}function me(V){V?Ze(i.SCISSOR_TEST):Ie(i.SCISSOR_TEST)}function de(V){V===void 0&&(V=i.TEXTURE0+qt-1),le!==V&&(i.activeTexture(V),le=V)}function ue(V,Dt,Ht){Ht===void 0&&(le===null?Ht=i.TEXTURE0+qt-1:Ht=le);let re=Me[Ht];re===void 0&&(re={type:void 0,texture:void 0},Me[Ht]=re),(re.type!==V||re.texture!==Dt)&&(le!==Ht&&(i.activeTexture(Ht),le=Ht),i.bindTexture(V,Dt||Xe[V]),re.type=V,re.texture=Dt)}function We(){let V=Me[le];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function Yt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function we(){try{i.compressedTexImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function je(){try{i.texSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function rn(){try{i.texSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function pe(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function yn(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function G(){try{i.texStorage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ae(){try{i.texStorage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ve(){try{i.texImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function nt(){try{i.texImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ft(V){ge.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),ge.copy(V))}function Kt(V){Re.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),Re.copy(V))}function ee(V,Dt){let Ht=f.get(Dt);Ht===void 0&&(Ht=new WeakMap,f.set(Dt,Ht));let re=Ht.get(V);re===void 0&&(re=i.getUniformBlockIndex(Dt,V.name),Ht.set(V,re))}function ne(V,Dt){let re=f.get(Dt).get(V);u.get(Dt)!==re&&(i.uniformBlockBinding(Dt,re,V.__bindingPointIndex),u.set(Dt,re))}function ht(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),m={},le=null,Me={},d={},y=new WeakMap,_=[],p=null,x=!1,A=null,M=null,P=null,C=null,T=null,D=null,Y=null,R=new fn(0,0,0),E=0,st=!1,mt=null,Qt=null,tt=null,lt=null,bt=null,ge.set(0,0,i.canvas.width,i.canvas.height),Re.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),h.reset()}return{buffers:{color:o,depth:l,stencil:h},enable:Ze,disable:Ie,bindFramebuffer:Be,drawBuffers:et,useProgram:Se,setBlending:jt,setMaterial:ke,setFlipSided:be,setCullFace:O,setLineWidth:I,setPolygonOffset:yt,setScissorTest:me,activeTexture:de,bindTexture:ue,unbindTexture:We,compressedTexImage2D:Yt,compressedTexImage3D:we,texImage2D:ve,texImage3D:nt,updateUBOMapping:ee,uniformBlockBinding:ne,texStorage2D:G,texStorage3D:ae,texSubImage2D:je,texSubImage3D:rn,compressedTexSubImage2D:pe,compressedTexSubImage3D:yn,scissor:ft,viewport:Kt,reset:ht}}function y2(i,t,e,n,s,r,a){let o=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap,f,m=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(O,I){return d?new OffscreenCanvas(O,I):$c("canvas")}function _(O,I,yt,me){let de=1;if((O.width>me||O.height>me)&&(de=me/Math.max(O.width,O.height)),de<1||I===!0)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap){let ue=I?Yc:Math.floor,We=ue(de*O.width),Yt=ue(de*O.height);f===void 0&&(f=y(We,Yt));let we=yt?y(We,Yt):f;return we.width=We,we.height=Yt,we.getContext("2d").drawImage(O,0,0,We,Yt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+O.width+"x"+O.height+") to ("+We+"x"+Yt+")."),we}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+O.width+"x"+O.height+")."),O;return O}function p(O){return Lf(O.width)&&Lf(O.height)}function x(O){return o?!1:O.wrapS!==Zs||O.wrapT!==Zs||O.minFilter!==Ai&&O.minFilter!==us}function A(O,I){return O.generateMipmaps&&I&&O.minFilter!==Ai&&O.minFilter!==us}function M(O){i.generateMipmap(O)}function P(O,I,yt,me,de=!1){if(o===!1)return I;if(O!==null){if(i[O]!==void 0)return i[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let ue=I;if(I===i.RED&&(yt===i.FLOAT&&(ue=i.R32F),yt===i.HALF_FLOAT&&(ue=i.R16F),yt===i.UNSIGNED_BYTE&&(ue=i.R8)),I===i.RED_INTEGER&&(yt===i.UNSIGNED_BYTE&&(ue=i.R8UI),yt===i.UNSIGNED_SHORT&&(ue=i.R16UI),yt===i.UNSIGNED_INT&&(ue=i.R32UI),yt===i.BYTE&&(ue=i.R8I),yt===i.SHORT&&(ue=i.R16I),yt===i.INT&&(ue=i.R32I)),I===i.RG&&(yt===i.FLOAT&&(ue=i.RG32F),yt===i.HALF_FLOAT&&(ue=i.RG16F),yt===i.UNSIGNED_BYTE&&(ue=i.RG8)),I===i.RGBA){let We=de?Gc:Gn.getTransfer(me);yt===i.FLOAT&&(ue=i.RGBA32F),yt===i.HALF_FLOAT&&(ue=i.RGBA16F),yt===i.UNSIGNED_BYTE&&(ue=We===ai?i.SRGB8_ALPHA8:i.RGBA8),yt===i.UNSIGNED_SHORT_4_4_4_4&&(ue=i.RGBA4),yt===i.UNSIGNED_SHORT_5_5_5_1&&(ue=i.RGB5_A1)}return(ue===i.R16F||ue===i.R32F||ue===i.RG16F||ue===i.RG32F||ue===i.RGBA16F||ue===i.RGBA32F)&&t.get("EXT_color_buffer_float"),ue}function C(O,I,yt){return A(O,yt)===!0||O.isFramebufferTexture&&O.minFilter!==Ai&&O.minFilter!==us?Math.log2(Math.max(I.width,I.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?I.mipmaps.length:1}function T(O){return O===Ai||O===pm||O===Gu?i.NEAREST:i.LINEAR}function D(O){let I=O.target;I.removeEventListener("dispose",D),R(I),I.isVideoTexture&&u.delete(I)}function Y(O){let I=O.target;I.removeEventListener("dispose",Y),st(I)}function R(O){let I=n.get(O);if(I.__webglInit===void 0)return;let yt=O.source,me=m.get(yt);if(me){let de=me[I.__cacheKey];de.usedTimes--,de.usedTimes===0&&E(O),Object.keys(me).length===0&&m.delete(yt)}n.remove(O)}function E(O){let I=n.get(O);i.deleteTexture(I.__webglTexture);let yt=O.source,me=m.get(yt);delete me[I.__cacheKey],a.memory.textures--}function st(O){let I=O.texture,yt=n.get(O),me=n.get(I);if(me.__webglTexture!==void 0&&(i.deleteTexture(me.__webglTexture),a.memory.textures--),O.depthTexture&&O.depthTexture.dispose(),O.isWebGLCubeRenderTarget)for(let de=0;de<6;de++){if(Array.isArray(yt.__webglFramebuffer[de]))for(let ue=0;ue<yt.__webglFramebuffer[de].length;ue++)i.deleteFramebuffer(yt.__webglFramebuffer[de][ue]);else i.deleteFramebuffer(yt.__webglFramebuffer[de]);yt.__webglDepthbuffer&&i.deleteRenderbuffer(yt.__webglDepthbuffer[de])}else{if(Array.isArray(yt.__webglFramebuffer))for(let de=0;de<yt.__webglFramebuffer.length;de++)i.deleteFramebuffer(yt.__webglFramebuffer[de]);else i.deleteFramebuffer(yt.__webglFramebuffer);if(yt.__webglDepthbuffer&&i.deleteRenderbuffer(yt.__webglDepthbuffer),yt.__webglMultisampledFramebuffer&&i.deleteFramebuffer(yt.__webglMultisampledFramebuffer),yt.__webglColorRenderbuffer)for(let de=0;de<yt.__webglColorRenderbuffer.length;de++)yt.__webglColorRenderbuffer[de]&&i.deleteRenderbuffer(yt.__webglColorRenderbuffer[de]);yt.__webglDepthRenderbuffer&&i.deleteRenderbuffer(yt.__webglDepthRenderbuffer)}if(O.isWebGLMultipleRenderTargets)for(let de=0,ue=I.length;de<ue;de++){let We=n.get(I[de]);We.__webglTexture&&(i.deleteTexture(We.__webglTexture),a.memory.textures--),n.remove(I[de])}n.remove(I),n.remove(O)}let mt=0;function Qt(){mt=0}function tt(){let O=mt;return O>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+s.maxTextures),mt+=1,O}function lt(O){let I=[];return I.push(O.wrapS),I.push(O.wrapT),I.push(O.wrapR||0),I.push(O.magFilter),I.push(O.minFilter),I.push(O.anisotropy),I.push(O.internalFormat),I.push(O.format),I.push(O.type),I.push(O.generateMipmaps),I.push(O.premultiplyAlpha),I.push(O.flipY),I.push(O.unpackAlignment),I.push(O.colorSpace),I.join()}function bt(O,I){let yt=n.get(O);if(O.isVideoTexture&&ke(O),O.isRenderTargetTexture===!1&&O.version>0&&yt.__version!==O.version){let me=O.image;if(me===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(me.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{ge(yt,O,I);return}}e.bindTexture(i.TEXTURE_2D,yt.__webglTexture,i.TEXTURE0+I)}function qt(O,I){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){ge(yt,O,I);return}e.bindTexture(i.TEXTURE_2D_ARRAY,yt.__webglTexture,i.TEXTURE0+I)}function Jt(O,I){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){ge(yt,O,I);return}e.bindTexture(i.TEXTURE_3D,yt.__webglTexture,i.TEXTURE0+I)}function Tt(O,I){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){Re(yt,O,I);return}e.bindTexture(i.TEXTURE_CUBE_MAP,yt.__webglTexture,i.TEXTURE0+I)}let $t={[eo]:i.REPEAT,[Zs]:i.CLAMP_TO_EDGE,[Rf]:i.MIRRORED_REPEAT},le={[Ai]:i.NEAREST,[pm]:i.NEAREST_MIPMAP_NEAREST,[Gu]:i.NEAREST_MIPMAP_LINEAR,[us]:i.LINEAR,[Q1]:i.LINEAR_MIPMAP_NEAREST,[pl]:i.LINEAR_MIPMAP_LINEAR},Me={[uy]:i.NEVER,[xy]:i.ALWAYS,[fy]:i.LESS,[eg]:i.LEQUAL,[dy]:i.EQUAL,[gy]:i.GEQUAL,[py]:i.GREATER,[my]:i.NOTEQUAL};function Ct(O,I,yt){if(yt?(i.texParameteri(O,i.TEXTURE_WRAP_S,$t[I.wrapS]),i.texParameteri(O,i.TEXTURE_WRAP_T,$t[I.wrapT]),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,$t[I.wrapR]),i.texParameteri(O,i.TEXTURE_MAG_FILTER,le[I.magFilter]),i.texParameteri(O,i.TEXTURE_MIN_FILTER,le[I.minFilter])):(i.texParameteri(O,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(O,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(I.wrapS!==Zs||I.wrapT!==Zs)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(O,i.TEXTURE_MAG_FILTER,T(I.magFilter)),i.texParameteri(O,i.TEXTURE_MIN_FILTER,T(I.minFilter)),I.minFilter!==Ai&&I.minFilter!==us&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),I.compareFunction&&(i.texParameteri(O,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(O,i.TEXTURE_COMPARE_FUNC,Me[I.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let me=t.get("EXT_texture_filter_anisotropic");if(I.magFilter===Ai||I.minFilter!==Gu&&I.minFilter!==pl||I.type===Jr&&t.has("OES_texture_float_linear")===!1||o===!1&&I.type===ml&&t.has("OES_texture_half_float_linear")===!1)return;(I.anisotropy>1||n.get(I).__currentAnisotropy)&&(i.texParameterf(O,me.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(I.anisotropy,s.getMaxAnisotropy())),n.get(I).__currentAnisotropy=I.anisotropy)}}function Bt(O,I){let yt=!1;O.__webglInit===void 0&&(O.__webglInit=!0,I.addEventListener("dispose",D));let me=I.source,de=m.get(me);de===void 0&&(de={},m.set(me,de));let ue=lt(I);if(ue!==O.__cacheKey){de[ue]===void 0&&(de[ue]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,yt=!0),de[ue].usedTimes++;let We=de[O.__cacheKey];We!==void 0&&(de[O.__cacheKey].usedTimes--,We.usedTimes===0&&E(I)),O.__cacheKey=ue,O.__webglTexture=de[ue].texture}return yt}function ge(O,I,yt){let me=i.TEXTURE_2D;(I.isDataArrayTexture||I.isCompressedArrayTexture)&&(me=i.TEXTURE_2D_ARRAY),I.isData3DTexture&&(me=i.TEXTURE_3D);let de=Bt(O,I),ue=I.source;e.bindTexture(me,O.__webglTexture,i.TEXTURE0+yt);let We=n.get(ue);if(ue.version!==We.__version||de===!0){e.activeTexture(i.TEXTURE0+yt);let Yt=Gn.getPrimaries(Gn.workingColorSpace),we=I.colorSpace===Ns?null:Gn.getPrimaries(I.colorSpace),je=I.colorSpace===Ns||Yt===we?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,I.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,I.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,je);let rn=x(I)&&p(I.image)===!1,pe=_(I.image,rn,!1,s.maxTextureSize);pe=be(I,pe);let yn=p(pe)||o,G=r.convert(I.format,I.colorSpace),ae=r.convert(I.type),ve=P(I.internalFormat,G,ae,I.colorSpace,I.isVideoTexture);Ct(me,I,yn);let nt,ft=I.mipmaps,Kt=o&&I.isVideoTexture!==!0&&ve!==Q0,ee=We.__version===void 0||de===!0,ne=C(I,pe,yn);if(I.isDepthTexture)ve=i.DEPTH_COMPONENT,o?I.type===Jr?ve=i.DEPTH_COMPONENT32F:I.type===Zr?ve=i.DEPTH_COMPONENT24:I.type===Eo?ve=i.DEPTH24_STENCIL8:ve=i.DEPTH_COMPONENT16:I.type===Jr&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),I.format===wo&&ve===i.DEPTH_COMPONENT&&I.type!==xd&&I.type!==Zr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),I.type=Zr,ae=r.convert(I.type)),I.format===Ta&&ve===i.DEPTH_COMPONENT&&(ve=i.DEPTH_STENCIL,I.type!==Eo&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),I.type=Eo,ae=r.convert(I.type))),ee&&(Kt?e.texStorage2D(i.TEXTURE_2D,1,ve,pe.width,pe.height):e.texImage2D(i.TEXTURE_2D,0,ve,pe.width,pe.height,0,G,ae,null));else if(I.isDataTexture)if(ft.length>0&&yn){Kt&&ee&&e.texStorage2D(i.TEXTURE_2D,ne,ve,ft[0].width,ft[0].height);for(let ht=0,V=ft.length;ht<V;ht++)nt=ft[ht],Kt?e.texSubImage2D(i.TEXTURE_2D,ht,0,0,nt.width,nt.height,G,ae,nt.data):e.texImage2D(i.TEXTURE_2D,ht,ve,nt.width,nt.height,0,G,ae,nt.data);I.generateMipmaps=!1}else Kt?(ee&&e.texStorage2D(i.TEXTURE_2D,ne,ve,pe.width,pe.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,pe.width,pe.height,G,ae,pe.data)):e.texImage2D(i.TEXTURE_2D,0,ve,pe.width,pe.height,0,G,ae,pe.data);else if(I.isCompressedTexture)if(I.isCompressedArrayTexture){Kt&&ee&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ne,ve,ft[0].width,ft[0].height,pe.depth);for(let ht=0,V=ft.length;ht<V;ht++)nt=ft[ht],I.format!==Js?G!==null?Kt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,nt.width,nt.height,pe.depth,G,nt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ht,ve,nt.width,nt.height,pe.depth,0,nt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,ht,0,0,0,nt.width,nt.height,pe.depth,G,ae,nt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ht,ve,nt.width,nt.height,pe.depth,0,G,ae,nt.data)}else{Kt&&ee&&e.texStorage2D(i.TEXTURE_2D,ne,ve,ft[0].width,ft[0].height);for(let ht=0,V=ft.length;ht<V;ht++)nt=ft[ht],I.format!==Js?G!==null?Kt?e.compressedTexSubImage2D(i.TEXTURE_2D,ht,0,0,nt.width,nt.height,G,nt.data):e.compressedTexImage2D(i.TEXTURE_2D,ht,ve,nt.width,nt.height,0,nt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?e.texSubImage2D(i.TEXTURE_2D,ht,0,0,nt.width,nt.height,G,ae,nt.data):e.texImage2D(i.TEXTURE_2D,ht,ve,nt.width,nt.height,0,G,ae,nt.data)}else if(I.isDataArrayTexture)Kt?(ee&&e.texStorage3D(i.TEXTURE_2D_ARRAY,ne,ve,pe.width,pe.height,pe.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,pe.width,pe.height,pe.depth,G,ae,pe.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ve,pe.width,pe.height,pe.depth,0,G,ae,pe.data);else if(I.isData3DTexture)Kt?(ee&&e.texStorage3D(i.TEXTURE_3D,ne,ve,pe.width,pe.height,pe.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,pe.width,pe.height,pe.depth,G,ae,pe.data)):e.texImage3D(i.TEXTURE_3D,0,ve,pe.width,pe.height,pe.depth,0,G,ae,pe.data);else if(I.isFramebufferTexture){if(ee)if(Kt)e.texStorage2D(i.TEXTURE_2D,ne,ve,pe.width,pe.height);else{let ht=pe.width,V=pe.height;for(let Dt=0;Dt<ne;Dt++)e.texImage2D(i.TEXTURE_2D,Dt,ve,ht,V,0,G,ae,null),ht>>=1,V>>=1}}else if(ft.length>0&&yn){Kt&&ee&&e.texStorage2D(i.TEXTURE_2D,ne,ve,ft[0].width,ft[0].height);for(let ht=0,V=ft.length;ht<V;ht++)nt=ft[ht],Kt?e.texSubImage2D(i.TEXTURE_2D,ht,0,0,G,ae,nt):e.texImage2D(i.TEXTURE_2D,ht,ve,G,ae,nt);I.generateMipmaps=!1}else Kt?(ee&&e.texStorage2D(i.TEXTURE_2D,ne,ve,pe.width,pe.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,G,ae,pe)):e.texImage2D(i.TEXTURE_2D,0,ve,G,ae,pe);A(I,yn)&&M(me),We.__version=ue.version,I.onUpdate&&I.onUpdate(I)}O.__version=I.version}function Re(O,I,yt){if(I.image.length!==6)return;let me=Bt(O,I),de=I.source;e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+yt);let ue=n.get(de);if(de.version!==ue.__version||me===!0){e.activeTexture(i.TEXTURE0+yt);let We=Gn.getPrimaries(Gn.workingColorSpace),Yt=I.colorSpace===Ns?null:Gn.getPrimaries(I.colorSpace),we=I.colorSpace===Ns||We===Yt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,I.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,I.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,I.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,we);let je=I.isCompressedTexture||I.image[0].isCompressedTexture,rn=I.image[0]&&I.image[0].isDataTexture,pe=[];for(let ht=0;ht<6;ht++)!je&&!rn?pe[ht]=_(I.image[ht],!1,!0,s.maxCubemapSize):pe[ht]=rn?I.image[ht].image:I.image[ht],pe[ht]=be(I,pe[ht]);let yn=pe[0],G=p(yn)||o,ae=r.convert(I.format,I.colorSpace),ve=r.convert(I.type),nt=P(I.internalFormat,ae,ve,I.colorSpace),ft=o&&I.isVideoTexture!==!0,Kt=ue.__version===void 0||me===!0,ee=C(I,yn,G);Ct(i.TEXTURE_CUBE_MAP,I,G);let ne;if(je){ft&&Kt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,ee,nt,yn.width,yn.height);for(let ht=0;ht<6;ht++){ne=pe[ht].mipmaps;for(let V=0;V<ne.length;V++){let Dt=ne[V];I.format!==Js?ae!==null?ft?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,0,0,Dt.width,Dt.height,ae,Dt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,nt,Dt.width,Dt.height,0,Dt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):ft?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,0,0,Dt.width,Dt.height,ae,ve,Dt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V,nt,Dt.width,Dt.height,0,ae,ve,Dt.data)}}}else{ne=I.mipmaps,ft&&Kt&&(ne.length>0&&ee++,e.texStorage2D(i.TEXTURE_CUBE_MAP,ee,nt,pe[0].width,pe[0].height));for(let ht=0;ht<6;ht++)if(rn){ft?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,pe[ht].width,pe[ht].height,ae,ve,pe[ht].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,nt,pe[ht].width,pe[ht].height,0,ae,ve,pe[ht].data);for(let V=0;V<ne.length;V++){let Ht=ne[V].image[ht].image;ft?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,0,0,Ht.width,Ht.height,ae,ve,Ht.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,nt,Ht.width,Ht.height,0,ae,ve,Ht.data)}}else{ft?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,0,0,ae,ve,pe[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,0,nt,ae,ve,pe[ht]);for(let V=0;V<ne.length;V++){let Dt=ne[V];ft?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,0,0,ae,ve,Dt.image[ht]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ht,V+1,nt,ae,ve,Dt.image[ht])}}}A(I,G)&&M(i.TEXTURE_CUBE_MAP),ue.__version=de.version,I.onUpdate&&I.onUpdate(I)}O.__version=I.version}function Pe(O,I,yt,me,de,ue){let We=r.convert(yt.format,yt.colorSpace),Yt=r.convert(yt.type),we=P(yt.internalFormat,We,Yt,yt.colorSpace);if(!n.get(I).__hasExternalTextures){let rn=Math.max(1,I.width>>ue),pe=Math.max(1,I.height>>ue);de===i.TEXTURE_3D||de===i.TEXTURE_2D_ARRAY?e.texImage3D(de,ue,we,rn,pe,I.depth,0,We,Yt,null):e.texImage2D(de,ue,we,rn,pe,0,We,Yt,null)}e.bindFramebuffer(i.FRAMEBUFFER,O),jt(I)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,me,de,n.get(yt).__webglTexture,0,ye(I)):(de===i.TEXTURE_2D||de>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&de<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,me,de,n.get(yt).__webglTexture,ue),e.bindFramebuffer(i.FRAMEBUFFER,null)}function Xe(O,I,yt){if(i.bindRenderbuffer(i.RENDERBUFFER,O),I.depthBuffer&&!I.stencilBuffer){let me=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(yt||jt(I)){let de=I.depthTexture;de&&de.isDepthTexture&&(de.type===Jr?me=i.DEPTH_COMPONENT32F:de.type===Zr&&(me=i.DEPTH_COMPONENT24));let ue=ye(I);jt(I)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ue,me,I.width,I.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,ue,me,I.width,I.height)}else i.renderbufferStorage(i.RENDERBUFFER,me,I.width,I.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,O)}else if(I.depthBuffer&&I.stencilBuffer){let me=ye(I);yt&&jt(I)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,me,i.DEPTH24_STENCIL8,I.width,I.height):jt(I)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,me,i.DEPTH24_STENCIL8,I.width,I.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,I.width,I.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,O)}else{let me=I.isWebGLMultipleRenderTargets===!0?I.texture:[I.texture];for(let de=0;de<me.length;de++){let ue=me[de],We=r.convert(ue.format,ue.colorSpace),Yt=r.convert(ue.type),we=P(ue.internalFormat,We,Yt,ue.colorSpace),je=ye(I);yt&&jt(I)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,je,we,I.width,I.height):jt(I)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,je,we,I.width,I.height):i.renderbufferStorage(i.RENDERBUFFER,we,I.width,I.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function Ze(O,I){if(I&&I.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,O),!(I.depthTexture&&I.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(I.depthTexture).__webglTexture||I.depthTexture.image.width!==I.width||I.depthTexture.image.height!==I.height)&&(I.depthTexture.image.width=I.width,I.depthTexture.image.height=I.height,I.depthTexture.needsUpdate=!0),bt(I.depthTexture,0);let me=n.get(I.depthTexture).__webglTexture,de=ye(I);if(I.depthTexture.format===wo)jt(I)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,me,0);else if(I.depthTexture.format===Ta)jt(I)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0,de):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,me,0);else throw new Error("Unknown depthTexture format")}function Ie(O){let I=n.get(O),yt=O.isWebGLCubeRenderTarget===!0;if(O.depthTexture&&!I.__autoAllocateDepthBuffer){if(yt)throw new Error("target.depthTexture not supported in Cube render targets");Ze(I.__webglFramebuffer,O)}else if(yt){I.__webglDepthbuffer=[];for(let me=0;me<6;me++)e.bindFramebuffer(i.FRAMEBUFFER,I.__webglFramebuffer[me]),I.__webglDepthbuffer[me]=i.createRenderbuffer(),Xe(I.__webglDepthbuffer[me],O,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,I.__webglFramebuffer),I.__webglDepthbuffer=i.createRenderbuffer(),Xe(I.__webglDepthbuffer,O,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function Be(O,I,yt){let me=n.get(O);I!==void 0&&Pe(me.__webglFramebuffer,O,O.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),yt!==void 0&&Ie(O)}function et(O){let I=O.texture,yt=n.get(O),me=n.get(I);O.addEventListener("dispose",Y),O.isWebGLMultipleRenderTargets!==!0&&(me.__webglTexture===void 0&&(me.__webglTexture=i.createTexture()),me.__version=I.version,a.memory.textures++);let de=O.isWebGLCubeRenderTarget===!0,ue=O.isWebGLMultipleRenderTargets===!0,We=p(O)||o;if(de){yt.__webglFramebuffer=[];for(let Yt=0;Yt<6;Yt++)if(o&&I.mipmaps&&I.mipmaps.length>0){yt.__webglFramebuffer[Yt]=[];for(let we=0;we<I.mipmaps.length;we++)yt.__webglFramebuffer[Yt][we]=i.createFramebuffer()}else yt.__webglFramebuffer[Yt]=i.createFramebuffer()}else{if(o&&I.mipmaps&&I.mipmaps.length>0){yt.__webglFramebuffer=[];for(let Yt=0;Yt<I.mipmaps.length;Yt++)yt.__webglFramebuffer[Yt]=i.createFramebuffer()}else yt.__webglFramebuffer=i.createFramebuffer();if(ue)if(s.drawBuffers){let Yt=O.texture;for(let we=0,je=Yt.length;we<je;we++){let rn=n.get(Yt[we]);rn.__webglTexture===void 0&&(rn.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&O.samples>0&&jt(O)===!1){let Yt=ue?I:[I];yt.__webglMultisampledFramebuffer=i.createFramebuffer(),yt.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer);for(let we=0;we<Yt.length;we++){let je=Yt[we];yt.__webglColorRenderbuffer[we]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,yt.__webglColorRenderbuffer[we]);let rn=r.convert(je.format,je.colorSpace),pe=r.convert(je.type),yn=P(je.internalFormat,rn,pe,je.colorSpace,O.isXRRenderTarget===!0),G=ye(O);i.renderbufferStorageMultisample(i.RENDERBUFFER,G,yn,O.width,O.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+we,i.RENDERBUFFER,yt.__webglColorRenderbuffer[we])}i.bindRenderbuffer(i.RENDERBUFFER,null),O.depthBuffer&&(yt.__webglDepthRenderbuffer=i.createRenderbuffer(),Xe(yt.__webglDepthRenderbuffer,O,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(de){e.bindTexture(i.TEXTURE_CUBE_MAP,me.__webglTexture),Ct(i.TEXTURE_CUBE_MAP,I,We);for(let Yt=0;Yt<6;Yt++)if(o&&I.mipmaps&&I.mipmaps.length>0)for(let we=0;we<I.mipmaps.length;we++)Pe(yt.__webglFramebuffer[Yt][we],O,I,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Yt,we);else Pe(yt.__webglFramebuffer[Yt],O,I,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+Yt,0);A(I,We)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ue){let Yt=O.texture;for(let we=0,je=Yt.length;we<je;we++){let rn=Yt[we],pe=n.get(rn);e.bindTexture(i.TEXTURE_2D,pe.__webglTexture),Ct(i.TEXTURE_2D,rn,We),Pe(yt.__webglFramebuffer,O,rn,i.COLOR_ATTACHMENT0+we,i.TEXTURE_2D,0),A(rn,We)&&M(i.TEXTURE_2D)}e.unbindTexture()}else{let Yt=i.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(o?Yt=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(Yt,me.__webglTexture),Ct(Yt,I,We),o&&I.mipmaps&&I.mipmaps.length>0)for(let we=0;we<I.mipmaps.length;we++)Pe(yt.__webglFramebuffer[we],O,I,i.COLOR_ATTACHMENT0,Yt,we);else Pe(yt.__webglFramebuffer,O,I,i.COLOR_ATTACHMENT0,Yt,0);A(I,We)&&M(Yt),e.unbindTexture()}O.depthBuffer&&Ie(O)}function Se(O){let I=p(O)||o,yt=O.isWebGLMultipleRenderTargets===!0?O.texture:[O.texture];for(let me=0,de=yt.length;me<de;me++){let ue=yt[me];if(A(ue,I)){let We=O.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,Yt=n.get(ue).__webglTexture;e.bindTexture(We,Yt),M(We),e.unbindTexture()}}}function ct(O){if(o&&O.samples>0&&jt(O)===!1){let I=O.isWebGLMultipleRenderTargets?O.texture:[O.texture],yt=O.width,me=O.height,de=i.COLOR_BUFFER_BIT,ue=[],We=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,Yt=n.get(O),we=O.isWebGLMultipleRenderTargets===!0;if(we)for(let je=0;je<I.length;je++)e.bindFramebuffer(i.FRAMEBUFFER,Yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+je,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,Yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+je,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,Yt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Yt.__webglFramebuffer);for(let je=0;je<I.length;je++){ue.push(i.COLOR_ATTACHMENT0+je),O.depthBuffer&&ue.push(We);let rn=Yt.__ignoreDepthValues!==void 0?Yt.__ignoreDepthValues:!1;if(rn===!1&&(O.depthBuffer&&(de|=i.DEPTH_BUFFER_BIT),O.stencilBuffer&&(de|=i.STENCIL_BUFFER_BIT)),we&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,Yt.__webglColorRenderbuffer[je]),rn===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[We]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[We])),we){let pe=n.get(I[je]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,pe,0)}i.blitFramebuffer(0,0,yt,me,0,0,yt,me,de,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,ue)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),we)for(let je=0;je<I.length;je++){e.bindFramebuffer(i.FRAMEBUFFER,Yt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+je,i.RENDERBUFFER,Yt.__webglColorRenderbuffer[je]);let rn=n.get(I[je]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,Yt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+je,i.TEXTURE_2D,rn,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,Yt.__webglMultisampledFramebuffer)}}function ye(O){return Math.min(s.maxSamples,O.samples)}function jt(O){let I=n.get(O);return o&&O.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&I.__useRenderToTexture!==!1}function ke(O){let I=a.render.frame;u.get(O)!==I&&(u.set(O,I),O.update())}function be(O,I){let yt=O.colorSpace,me=O.format,de=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||O.format===Pf||yt!==Rr&&yt!==Ns&&(Gn.getTransfer(yt)===ai?o===!1?t.has("EXT_sRGB")===!0&&me===Js?(O.format=Pf,O.minFilter=us,O.generateMipmaps=!1):I=Zc.sRGBToLinear(I):(me!==Js||de!==Qr)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",yt)),I}this.allocateTextureUnit=tt,this.resetTextureUnits=Qt,this.setTexture2D=bt,this.setTexture2DArray=qt,this.setTexture3D=Jt,this.setTextureCube=Tt,this.rebindTextures=Be,this.setupRenderTarget=et,this.updateRenderTargetMipmap=Se,this.updateMultisampleRenderTarget=ct,this.setupDepthRenderbuffer=Ie,this.setupFrameBufferTexture=Pe,this.useMultisampledRTT=jt}function _2(i,t,e){let n=e.isWebGL2;function s(r,a=Ns){let o,l=Gn.getTransfer(a);if(r===Qr)return i.UNSIGNED_BYTE;if(r===$0)return i.UNSIGNED_SHORT_4_4_4_4;if(r===Z0)return i.UNSIGNED_SHORT_5_5_5_1;if(r===ty)return i.BYTE;if(r===ey)return i.SHORT;if(r===xd)return i.UNSIGNED_SHORT;if(r===Y0)return i.INT;if(r===Zr)return i.UNSIGNED_INT;if(r===Jr)return i.FLOAT;if(r===ml)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===ny)return i.ALPHA;if(r===Js)return i.RGBA;if(r===iy)return i.LUMINANCE;if(r===sy)return i.LUMINANCE_ALPHA;if(r===wo)return i.DEPTH_COMPONENT;if(r===Ta)return i.DEPTH_STENCIL;if(r===Pf)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===ry)return i.RED;if(r===J0)return i.RED_INTEGER;if(r===oy)return i.RG;if(r===j0)return i.RG_INTEGER;if(r===K0)return i.RGBA_INTEGER;if(r===Wu||r===Xu||r===qu||r===Yu)if(l===ai)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Wu)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Xu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===qu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===Yu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Wu)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Xu)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===qu)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===Yu)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===mm||r===gm||r===xm||r===ym)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===mm)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===gm)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===xm)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===ym)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Q0)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===_m||r===vm)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===_m)return l===ai?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===vm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===Mm||r===bm||r===Sm||r===Em||r===wm||r===Tm||r===Am||r===Rm||r===Cm||r===Pm||r===Lm||r===Im||r===Dm||r===Um)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===Mm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===bm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===Sm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===Em)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===wm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===Tm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Am)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===Rm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Cm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Pm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===Lm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Im)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Dm)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Um)return l===ai?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===$u||r===Nm||r===Om)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===$u)return l===ai?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Nm)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Om)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===ay||r===Fm||r===Bm||r===zm)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===$u)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Fm)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Bm)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===zm)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Eo?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Wf=class extends Hi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Cn=class extends xi{constructor(){super(),this.isGroup=!0,this.type="Group"}},v2={type:"move"},ul=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Cn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Cn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new W,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new W),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Cn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new W,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new W),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(let _ of t.hand.values()){let p=e.getJointPose(_,n),x=this._getHandJoint(h,_);p!==null&&(x.matrix.fromArray(p.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=p.radius),x.visible=p!==null}let u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],m=u.position.distanceTo(f.position),d=.02,y=.005;h.inputState.pinching&&m>d+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&m<=d-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(v2)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Cn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Xf=class extends fr{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,h=null,u=null,f=null,m=null,d=null,y=null,_=e.getContextAttributes(),p=null,x=null,A=[],M=[],P=new fe,C=null,T=new Hi;T.layers.enable(1),T.viewport=new On;let D=new Hi;D.layers.enable(2),D.viewport=new On;let Y=[T,D],R=new Wf;R.layers.enable(1),R.layers.enable(2);let E=null,st=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Ct){let Bt=A[Ct];return Bt===void 0&&(Bt=new ul,A[Ct]=Bt),Bt.getTargetRaySpace()},this.getControllerGrip=function(Ct){let Bt=A[Ct];return Bt===void 0&&(Bt=new ul,A[Ct]=Bt),Bt.getGripSpace()},this.getHand=function(Ct){let Bt=A[Ct];return Bt===void 0&&(Bt=new ul,A[Ct]=Bt),Bt.getHandSpace()};function mt(Ct){let Bt=M.indexOf(Ct.inputSource);if(Bt===-1)return;let ge=A[Bt];ge!==void 0&&(ge.update(Ct.inputSource,Ct.frame,h||a),ge.dispatchEvent({type:Ct.type,data:Ct.inputSource}))}function Qt(){s.removeEventListener("select",mt),s.removeEventListener("selectstart",mt),s.removeEventListener("selectend",mt),s.removeEventListener("squeeze",mt),s.removeEventListener("squeezestart",mt),s.removeEventListener("squeezeend",mt),s.removeEventListener("end",Qt),s.removeEventListener("inputsourceschange",tt);for(let Ct=0;Ct<A.length;Ct++){let Bt=M[Ct];Bt!==null&&(M[Ct]=null,A[Ct].disconnect(Bt))}E=null,st=null,t.setRenderTarget(p),d=null,m=null,f=null,s=null,x=null,Me.stop(),n.isPresenting=!1,t.setPixelRatio(C),t.setSize(P.width,P.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Ct){r=Ct,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Ct){o=Ct,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Ct){h=Ct},this.getBaseLayer=function(){return m!==null?m:d},this.getBinding=function(){return f},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(Ct){if(s=Ct,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",mt),s.addEventListener("selectstart",mt),s.addEventListener("selectend",mt),s.addEventListener("squeeze",mt),s.addEventListener("squeezestart",mt),s.addEventListener("squeezeend",mt),s.addEventListener("end",Qt),s.addEventListener("inputsourceschange",tt),_.xrCompatible!==!0&&await e.makeXRCompatible(),C=t.getPixelRatio(),t.getSize(P),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let Bt={antialias:s.renderState.layers===void 0?_.antialias:!0,alpha:!0,depth:_.depth,stencil:_.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,Bt),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Cr(d.framebufferWidth,d.framebufferHeight,{format:Js,type:Qr,colorSpace:t.outputColorSpace,stencilBuffer:_.stencil})}else{let Bt=null,ge=null,Re=null;_.depth&&(Re=_.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,Bt=_.stencil?Ta:wo,ge=_.stencil?Eo:Zr);let Pe={colorFormat:e.RGBA8,depthFormat:Re,scaleFactor:r};f=new XRWebGLBinding(s,e),m=f.createProjectionLayer(Pe),s.updateRenderState({layers:[m]}),t.setPixelRatio(1),t.setSize(m.textureWidth,m.textureHeight,!1),x=new Cr(m.textureWidth,m.textureHeight,{format:Js,type:Qr,depthTexture:new rh(m.textureWidth,m.textureHeight,ge,void 0,void 0,void 0,void 0,void 0,void 0,Bt),stencilBuffer:_.stencil,colorSpace:t.outputColorSpace,samples:_.antialias?4:0});let Xe=t.properties.get(x);Xe.__ignoreDepthValues=m.ignoreDepthValues}x.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await s.requestReferenceSpace(o),Me.setContext(s),Me.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function tt(Ct){for(let Bt=0;Bt<Ct.removed.length;Bt++){let ge=Ct.removed[Bt],Re=M.indexOf(ge);Re>=0&&(M[Re]=null,A[Re].disconnect(ge))}for(let Bt=0;Bt<Ct.added.length;Bt++){let ge=Ct.added[Bt],Re=M.indexOf(ge);if(Re===-1){for(let Xe=0;Xe<A.length;Xe++)if(Xe>=M.length){M.push(ge),Re=Xe;break}else if(M[Xe]===null){M[Xe]=ge,Re=Xe;break}if(Re===-1)break}let Pe=A[Re];Pe&&Pe.connect(ge)}}let lt=new W,bt=new W;function qt(Ct,Bt,ge){lt.setFromMatrixPosition(Bt.matrixWorld),bt.setFromMatrixPosition(ge.matrixWorld);let Re=lt.distanceTo(bt),Pe=Bt.projectionMatrix.elements,Xe=ge.projectionMatrix.elements,Ze=Pe[14]/(Pe[10]-1),Ie=Pe[14]/(Pe[10]+1),Be=(Pe[9]+1)/Pe[5],et=(Pe[9]-1)/Pe[5],Se=(Pe[8]-1)/Pe[0],ct=(Xe[8]+1)/Xe[0],ye=Ze*Se,jt=Ze*ct,ke=Re/(-Se+ct),be=ke*-Se;Bt.matrixWorld.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.translateX(be),Ct.translateZ(ke),Ct.matrixWorld.compose(Ct.position,Ct.quaternion,Ct.scale),Ct.matrixWorldInverse.copy(Ct.matrixWorld).invert();let O=Ze+ke,I=Ie+ke,yt=ye-be,me=jt+(Re-be),de=Be*Ie/I*O,ue=et*Ie/I*O;Ct.projectionMatrix.makePerspective(yt,me,de,ue,O,I),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert()}function Jt(Ct,Bt){Bt===null?Ct.matrixWorld.copy(Ct.matrix):Ct.matrixWorld.multiplyMatrices(Bt.matrixWorld,Ct.matrix),Ct.matrixWorldInverse.copy(Ct.matrixWorld).invert()}this.updateCamera=function(Ct){if(s===null)return;R.near=D.near=T.near=Ct.near,R.far=D.far=T.far=Ct.far,(E!==R.near||st!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),E=R.near,st=R.far);let Bt=Ct.parent,ge=R.cameras;Jt(R,Bt);for(let Re=0;Re<ge.length;Re++)Jt(ge[Re],Bt);ge.length===2?qt(R,T,D):R.projectionMatrix.copy(T.projectionMatrix),Tt(Ct,R,Bt)};function Tt(Ct,Bt,ge){ge===null?Ct.matrix.copy(Bt.matrixWorld):(Ct.matrix.copy(ge.matrixWorld),Ct.matrix.invert(),Ct.matrix.multiply(Bt.matrixWorld)),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.updateMatrixWorld(!0),Ct.projectionMatrix.copy(Bt.projectionMatrix),Ct.projectionMatrixInverse.copy(Bt.projectionMatrixInverse),Ct.isPerspectiveCamera&&(Ct.fov=gl*2*Math.atan(1/Ct.projectionMatrix.elements[5]),Ct.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(m===null&&d===null))return l},this.setFoveation=function(Ct){l=Ct,m!==null&&(m.fixedFoveation=Ct),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Ct)};let $t=null;function le(Ct,Bt){if(u=Bt.getViewerPose(h||a),y=Bt,u!==null){let ge=u.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let Re=!1;ge.length!==R.cameras.length&&(R.cameras.length=0,Re=!0);for(let Pe=0;Pe<ge.length;Pe++){let Xe=ge[Pe],Ze=null;if(d!==null)Ze=d.getViewport(Xe);else{let Be=f.getViewSubImage(m,Xe);Ze=Be.viewport,Pe===0&&(t.setRenderTargetTextures(x,Be.colorTexture,m.ignoreDepthValues?void 0:Be.depthStencilTexture),t.setRenderTarget(x))}let Ie=Y[Pe];Ie===void 0&&(Ie=new Hi,Ie.layers.enable(Pe),Ie.viewport=new On,Y[Pe]=Ie),Ie.matrix.fromArray(Xe.transform.matrix),Ie.matrix.decompose(Ie.position,Ie.quaternion,Ie.scale),Ie.projectionMatrix.fromArray(Xe.projectionMatrix),Ie.projectionMatrixInverse.copy(Ie.projectionMatrix).invert(),Ie.viewport.set(Ze.x,Ze.y,Ze.width,Ze.height),Pe===0&&(R.matrix.copy(Ie.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),Re===!0&&R.cameras.push(Ie)}}for(let ge=0;ge<A.length;ge++){let Re=M[ge],Pe=A[ge];Re!==null&&Pe!==void 0&&Pe.update(Re,Bt,h||a)}$t&&$t(Ct,Bt),Bt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:Bt}),y=null}let Me=new rg;Me.setAnimationLoop(le),this.setAnimationLoop=function(Ct){$t=Ct},this.dispose=function(){}}};function M2(i,t){function e(p,x){p.matrixAutoUpdate===!0&&p.updateMatrix(),x.value.copy(p.matrix)}function n(p,x){x.color.getRGB(p.fogColor.value,sg(i)),x.isFog?(p.fogNear.value=x.near,p.fogFar.value=x.far):x.isFogExp2&&(p.fogDensity.value=x.density)}function s(p,x,A,M,P){x.isMeshBasicMaterial||x.isMeshLambertMaterial?r(p,x):x.isMeshToonMaterial?(r(p,x),f(p,x)):x.isMeshPhongMaterial?(r(p,x),u(p,x)):x.isMeshStandardMaterial?(r(p,x),m(p,x),x.isMeshPhysicalMaterial&&d(p,x,P)):x.isMeshMatcapMaterial?(r(p,x),y(p,x)):x.isMeshDepthMaterial?r(p,x):x.isMeshDistanceMaterial?(r(p,x),_(p,x)):x.isMeshNormalMaterial?r(p,x):x.isLineBasicMaterial?(a(p,x),x.isLineDashedMaterial&&o(p,x)):x.isPointsMaterial?l(p,x,A,M):x.isSpriteMaterial?h(p,x):x.isShadowMaterial?(p.color.value.copy(x.color),p.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function r(p,x){p.opacity.value=x.opacity,x.color&&p.diffuse.value.copy(x.color),x.emissive&&p.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.bumpMap&&(p.bumpMap.value=x.bumpMap,e(x.bumpMap,p.bumpMapTransform),p.bumpScale.value=x.bumpScale,x.side===fs&&(p.bumpScale.value*=-1)),x.normalMap&&(p.normalMap.value=x.normalMap,e(x.normalMap,p.normalMapTransform),p.normalScale.value.copy(x.normalScale),x.side===fs&&p.normalScale.value.negate()),x.displacementMap&&(p.displacementMap.value=x.displacementMap,e(x.displacementMap,p.displacementMapTransform),p.displacementScale.value=x.displacementScale,p.displacementBias.value=x.displacementBias),x.emissiveMap&&(p.emissiveMap.value=x.emissiveMap,e(x.emissiveMap,p.emissiveMapTransform)),x.specularMap&&(p.specularMap.value=x.specularMap,e(x.specularMap,p.specularMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest);let A=t.get(x).envMap;if(A&&(p.envMap.value=A,p.flipEnvMap.value=A.isCubeTexture&&A.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=x.reflectivity,p.ior.value=x.ior,p.refractionRatio.value=x.refractionRatio),x.lightMap){p.lightMap.value=x.lightMap;let M=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=x.lightMapIntensity*M,e(x.lightMap,p.lightMapTransform)}x.aoMap&&(p.aoMap.value=x.aoMap,p.aoMapIntensity.value=x.aoMapIntensity,e(x.aoMap,p.aoMapTransform))}function a(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform))}function o(p,x){p.dashSize.value=x.dashSize,p.totalSize.value=x.dashSize+x.gapSize,p.scale.value=x.scale}function l(p,x,A,M){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.size.value=x.size*A,p.scale.value=M*.5,x.map&&(p.map.value=x.map,e(x.map,p.uvTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function h(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.rotation.value=x.rotation,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function u(p,x){p.specular.value.copy(x.specular),p.shininess.value=Math.max(x.shininess,1e-4)}function f(p,x){x.gradientMap&&(p.gradientMap.value=x.gradientMap)}function m(p,x){p.metalness.value=x.metalness,x.metalnessMap&&(p.metalnessMap.value=x.metalnessMap,e(x.metalnessMap,p.metalnessMapTransform)),p.roughness.value=x.roughness,x.roughnessMap&&(p.roughnessMap.value=x.roughnessMap,e(x.roughnessMap,p.roughnessMapTransform)),t.get(x).envMap&&(p.envMapIntensity.value=x.envMapIntensity)}function d(p,x,A){p.ior.value=x.ior,x.sheen>0&&(p.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),p.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(p.sheenColorMap.value=x.sheenColorMap,e(x.sheenColorMap,p.sheenColorMapTransform)),x.sheenRoughnessMap&&(p.sheenRoughnessMap.value=x.sheenRoughnessMap,e(x.sheenRoughnessMap,p.sheenRoughnessMapTransform))),x.clearcoat>0&&(p.clearcoat.value=x.clearcoat,p.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(p.clearcoatMap.value=x.clearcoatMap,e(x.clearcoatMap,p.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,e(x.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(p.clearcoatNormalMap.value=x.clearcoatNormalMap,e(x.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===fs&&p.clearcoatNormalScale.value.negate())),x.iridescence>0&&(p.iridescence.value=x.iridescence,p.iridescenceIOR.value=x.iridescenceIOR,p.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(p.iridescenceMap.value=x.iridescenceMap,e(x.iridescenceMap,p.iridescenceMapTransform)),x.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=x.iridescenceThicknessMap,e(x.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),x.transmission>0&&(p.transmission.value=x.transmission,p.transmissionSamplerMap.value=A.texture,p.transmissionSamplerSize.value.set(A.width,A.height),x.transmissionMap&&(p.transmissionMap.value=x.transmissionMap,e(x.transmissionMap,p.transmissionMapTransform)),p.thickness.value=x.thickness,x.thicknessMap&&(p.thicknessMap.value=x.thicknessMap,e(x.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=x.attenuationDistance,p.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(p.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(p.anisotropyMap.value=x.anisotropyMap,e(x.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=x.specularIntensity,p.specularColor.value.copy(x.specularColor),x.specularColorMap&&(p.specularColorMap.value=x.specularColorMap,e(x.specularColorMap,p.specularColorMapTransform)),x.specularIntensityMap&&(p.specularIntensityMap.value=x.specularIntensityMap,e(x.specularIntensityMap,p.specularIntensityMapTransform))}function y(p,x){x.matcap&&(p.matcap.value=x.matcap)}function _(p,x){let A=t.get(x).light;p.referencePosition.value.setFromMatrixPosition(A.matrixWorld),p.nearDistance.value=A.shadow.camera.near,p.farDistance.value=A.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function b2(i,t,e,n){let s={},r={},a=[],o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(A,M){let P=M.program;n.uniformBlockBinding(A,P)}function h(A,M){let P=s[A.id];P===void 0&&(y(A),P=u(A),s[A.id]=P,A.addEventListener("dispose",p));let C=M.program;n.updateUBOMapping(A,C);let T=t.render.frame;r[A.id]!==T&&(m(A),r[A.id]=T)}function u(A){let M=f();A.__bindingPointIndex=M;let P=i.createBuffer(),C=A.__size,T=A.usage;return i.bindBuffer(i.UNIFORM_BUFFER,P),i.bufferData(i.UNIFORM_BUFFER,C,T),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,P),P}function f(){for(let A=0;A<o;A++)if(a.indexOf(A)===-1)return a.push(A),A;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(A){let M=s[A.id],P=A.uniforms,C=A.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let T=0,D=P.length;T<D;T++){let Y=Array.isArray(P[T])?P[T]:[P[T]];for(let R=0,E=Y.length;R<E;R++){let st=Y[R];if(d(st,T,R,C)===!0){let mt=st.__offset,Qt=Array.isArray(st.value)?st.value:[st.value],tt=0;for(let lt=0;lt<Qt.length;lt++){let bt=Qt[lt],qt=_(bt);typeof bt=="number"||typeof bt=="boolean"?(st.__data[0]=bt,i.bufferSubData(i.UNIFORM_BUFFER,mt+tt,st.__data)):bt.isMatrix3?(st.__data[0]=bt.elements[0],st.__data[1]=bt.elements[1],st.__data[2]=bt.elements[2],st.__data[3]=0,st.__data[4]=bt.elements[3],st.__data[5]=bt.elements[4],st.__data[6]=bt.elements[5],st.__data[7]=0,st.__data[8]=bt.elements[6],st.__data[9]=bt.elements[7],st.__data[10]=bt.elements[8],st.__data[11]=0):(bt.toArray(st.__data,tt),tt+=qt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,mt,st.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(A,M,P,C){let T=A.value,D=M+"_"+P;if(C[D]===void 0)return typeof T=="number"||typeof T=="boolean"?C[D]=T:C[D]=T.clone(),!0;{let Y=C[D];if(typeof T=="number"||typeof T=="boolean"){if(Y!==T)return C[D]=T,!0}else if(Y.equals(T)===!1)return Y.copy(T),!0}return!1}function y(A){let M=A.uniforms,P=0,C=16;for(let D=0,Y=M.length;D<Y;D++){let R=Array.isArray(M[D])?M[D]:[M[D]];for(let E=0,st=R.length;E<st;E++){let mt=R[E],Qt=Array.isArray(mt.value)?mt.value:[mt.value];for(let tt=0,lt=Qt.length;tt<lt;tt++){let bt=Qt[tt],qt=_(bt),Jt=P%C;Jt!==0&&C-Jt<qt.boundary&&(P+=C-Jt),mt.__data=new Float32Array(qt.storage/Float32Array.BYTES_PER_ELEMENT),mt.__offset=P,P+=qt.storage}}}let T=P%C;return T>0&&(P+=C-T),A.__size=P,A.__cache={},this}function _(A){let M={boundary:0,storage:0};return typeof A=="number"||typeof A=="boolean"?(M.boundary=4,M.storage=4):A.isVector2?(M.boundary=8,M.storage=8):A.isVector3||A.isColor?(M.boundary=16,M.storage=12):A.isVector4?(M.boundary=16,M.storage=16):A.isMatrix3?(M.boundary=48,M.storage=48):A.isMatrix4?(M.boundary=64,M.storage=64):A.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",A),M}function p(A){let M=A.target;M.removeEventListener("dispose",p);let P=a.indexOf(M.__bindingPointIndex);a.splice(P,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function x(){for(let A in s)i.deleteBuffer(s[A]);a=[],s={},r={}}return{bind:l,update:h,dispose:x}}var _l=class{constructor(t={}){let{canvas:e=Iy(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let m;n!==null?m=n.getContextAttributes().alpha:m=a;let d=new Uint32Array(4),y=new Int32Array(4),_=null,p=null,x=[],A=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=Wn,this._useLegacyLights=!1,this.toneMapping=Kr,this.toneMappingExposure=1;let M=this,P=!1,C=0,T=0,D=null,Y=-1,R=null,E=new On,st=new On,mt=null,Qt=new fn(0),tt=0,lt=e.width,bt=e.height,qt=1,Jt=null,Tt=null,$t=new On(0,0,lt,bt),le=new On(0,0,lt,bt),Me=!1,Ct=new yl,Bt=!1,ge=!1,Re=null,Pe=new Un,Xe=new fe,Ze=new W,Ie={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function Be(){return D===null?qt:1}let et=n;function Se(z,gt){for(let Pt=0;Pt<z.length;Pt++){let Ot=z[Pt],Lt=e.getContext(Ot,gt);if(Lt!==null)return Lt}return null}try{let z={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",ht,!1),e.addEventListener("webglcontextrestored",V,!1),e.addEventListener("webglcontextcreationerror",Dt,!1),et===null){let gt=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&gt.shift(),et=Se(gt,z),et===null)throw Se(gt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&et instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),et.getShaderPrecisionFormat===void 0&&(et.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(z){throw console.error("THREE.WebGLRenderer: "+z.message),z}let ct,ye,jt,ke,be,O,I,yt,me,de,ue,We,Yt,we,je,rn,pe,yn,G,ae,ve,nt,ft,Kt;function ee(){ct=new HM(et),ye=new NM(et,ct,t),ct.init(ye),nt=new _2(et,ct,ye),jt=new x2(et,ct,ye),ke=new WM(et),be=new r2,O=new y2(et,ct,jt,be,ye,nt,ke),I=new FM(M),yt=new kM(M),me=new Ky(et,ye),ft=new DM(et,ct,me,ye),de=new VM(et,me,ke,ft),ue=new $M(et,de,me,ke),G=new YM(et,ye,O),rn=new OM(be),We=new s2(M,I,yt,ct,ye,ft,rn),Yt=new M2(M,be),we=new a2,je=new d2(ct,ye),yn=new IM(M,I,yt,jt,ue,m,l),pe=new g2(M,ue,ye),Kt=new b2(et,ke,ye,jt),ae=new UM(et,ct,ke,ye),ve=new GM(et,ct,ke,ye),ke.programs=We.programs,M.capabilities=ye,M.extensions=ct,M.properties=be,M.renderLists=we,M.shadowMap=pe,M.state=jt,M.info=ke}ee();let ne=new Xf(M,et);this.xr=ne,this.getContext=function(){return et},this.getContextAttributes=function(){return et.getContextAttributes()},this.forceContextLoss=function(){let z=ct.get("WEBGL_lose_context");z&&z.loseContext()},this.forceContextRestore=function(){let z=ct.get("WEBGL_lose_context");z&&z.restoreContext()},this.getPixelRatio=function(){return qt},this.setPixelRatio=function(z){z!==void 0&&(qt=z,this.setSize(lt,bt,!1))},this.getSize=function(z){return z.set(lt,bt)},this.setSize=function(z,gt,Pt=!0){if(ne.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}lt=z,bt=gt,e.width=Math.floor(z*qt),e.height=Math.floor(gt*qt),Pt===!0&&(e.style.width=z+"px",e.style.height=gt+"px"),this.setViewport(0,0,z,gt)},this.getDrawingBufferSize=function(z){return z.set(lt*qt,bt*qt).floor()},this.setDrawingBufferSize=function(z,gt,Pt){lt=z,bt=gt,qt=Pt,e.width=Math.floor(z*Pt),e.height=Math.floor(gt*Pt),this.setViewport(0,0,z,gt)},this.getCurrentViewport=function(z){return z.copy(E)},this.getViewport=function(z){return z.copy($t)},this.setViewport=function(z,gt,Pt,Ot){z.isVector4?$t.set(z.x,z.y,z.z,z.w):$t.set(z,gt,Pt,Ot),jt.viewport(E.copy($t).multiplyScalar(qt).floor())},this.getScissor=function(z){return z.copy(le)},this.setScissor=function(z,gt,Pt,Ot){z.isVector4?le.set(z.x,z.y,z.z,z.w):le.set(z,gt,Pt,Ot),jt.scissor(st.copy(le).multiplyScalar(qt).floor())},this.getScissorTest=function(){return Me},this.setScissorTest=function(z){jt.setScissorTest(Me=z)},this.setOpaqueSort=function(z){Jt=z},this.setTransparentSort=function(z){Tt=z},this.getClearColor=function(z){return z.copy(yn.getClearColor())},this.setClearColor=function(){yn.setClearColor.apply(yn,arguments)},this.getClearAlpha=function(){return yn.getClearAlpha()},this.setClearAlpha=function(){yn.setClearAlpha.apply(yn,arguments)},this.clear=function(z=!0,gt=!0,Pt=!0){let Ot=0;if(z){let Lt=!1;if(D!==null){let Le=D.texture.format;Lt=Le===K0||Le===j0||Le===J0}if(Lt){let Le=D.texture.type,$e=Le===Qr||Le===Zr||Le===xd||Le===Eo||Le===$0||Le===Z0,tn=yn.getClearColor(),an=yn.getClearAlpha(),dn=tn.r,ln=tn.g,hn=tn.b;$e?(d[0]=dn,d[1]=ln,d[2]=hn,d[3]=an,et.clearBufferuiv(et.COLOR,0,d)):(y[0]=dn,y[1]=ln,y[2]=hn,y[3]=an,et.clearBufferiv(et.COLOR,0,y))}else Ot|=et.COLOR_BUFFER_BIT}gt&&(Ot|=et.DEPTH_BUFFER_BIT),Pt&&(Ot|=et.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),et.clear(Ot)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ht,!1),e.removeEventListener("webglcontextrestored",V,!1),e.removeEventListener("webglcontextcreationerror",Dt,!1),we.dispose(),je.dispose(),be.dispose(),I.dispose(),yt.dispose(),ue.dispose(),ft.dispose(),Kt.dispose(),We.dispose(),ne.dispose(),ne.removeEventListener("sessionstart",He),ne.removeEventListener("sessionend",Ne),Re&&(Re.dispose(),Re=null),on.stop()};function ht(z){z.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),P=!0}function V(){console.log("THREE.WebGLRenderer: Context Restored."),P=!1;let z=ke.autoReset,gt=pe.enabled,Pt=pe.autoUpdate,Ot=pe.needsUpdate,Lt=pe.type;ee(),ke.autoReset=z,pe.enabled=gt,pe.autoUpdate=Pt,pe.needsUpdate=Ot,pe.type=Lt}function Dt(z){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",z.statusMessage)}function Ht(z){let gt=z.target;gt.removeEventListener("dispose",Ht),re(gt)}function re(z){ce(z),be.remove(z)}function ce(z){let gt=be.get(z).programs;gt!==void 0&&(gt.forEach(function(Pt){We.releaseProgram(Pt)}),z.isShaderMaterial&&We.releaseShaderCache(z))}this.renderBufferDirect=function(z,gt,Pt,Ot,Lt,Le){gt===null&&(gt=Ie);let $e=Lt.isMesh&&Lt.matrixWorld.determinant()<0,tn=Ln(z,gt,Pt,Ot,Lt);jt.setMaterial(Ot,$e);let an=Pt.index,dn=1;if(Ot.wireframe===!0){if(an=de.getWireframeAttribute(Pt),an===void 0)return;dn=2}let ln=Pt.drawRange,hn=Pt.attributes.position,Hn=ln.start*dn,wi=(ln.start+ln.count)*dn;Le!==null&&(Hn=Math.max(Hn,Le.start*dn),wi=Math.min(wi,(Le.start+Le.count)*dn)),an!==null?(Hn=Math.max(Hn,0),wi=Math.min(wi,an.count)):hn!=null&&(Hn=Math.max(Hn,0),wi=Math.min(wi,hn.count));let $n=wi-Hn;if($n<0||$n===1/0)return;ft.setup(Lt,Ot,tn,Pt,an);let zs,Zn=ae;if(an!==null&&(zs=me.get(an),Zn=ve,Zn.setIndex(zs)),Lt.isMesh)Ot.wireframe===!0?(jt.setLineWidth(Ot.wireframeLinewidth*Be()),Zn.setMode(et.LINES)):Zn.setMode(et.TRIANGLES);else if(Lt.isLine){let pn=Ot.linewidth;pn===void 0&&(pn=1),jt.setLineWidth(pn*Be()),Lt.isLineSegments?Zn.setMode(et.LINES):Lt.isLineLoop?Zn.setMode(et.LINE_LOOP):Zn.setMode(et.LINE_STRIP)}else Lt.isPoints?Zn.setMode(et.POINTS):Lt.isSprite&&Zn.setMode(et.TRIANGLES);if(Lt.isBatchedMesh)Zn.renderMultiDraw(Lt._multiDrawStarts,Lt._multiDrawCounts,Lt._multiDrawCount);else if(Lt.isInstancedMesh)Zn.renderInstances(Hn,$n,Lt.count);else if(Pt.isInstancedBufferGeometry){let pn=Pt._maxInstanceCount!==void 0?Pt._maxInstanceCount:1/0,Dr=Math.min(Pt.instanceCount,pn);Zn.renderInstances(Hn,$n,Dr)}else Zn.render(Hn,$n)};function De(z,gt,Pt){z.transparent===!0&&z.side===xn&&z.forceSinglePass===!1?(z.side=fs,z.needsUpdate=!0,ci(z,gt,Pt),z.side=to,z.needsUpdate=!0,ci(z,gt,Pt),z.side=xn):ci(z,gt,Pt)}this.compile=function(z,gt,Pt=null){Pt===null&&(Pt=z),p=je.get(Pt),p.init(),A.push(p),Pt.traverseVisible(function(Lt){Lt.isLight&&Lt.layers.test(gt.layers)&&(p.pushLight(Lt),Lt.castShadow&&p.pushShadow(Lt))}),z!==Pt&&z.traverseVisible(function(Lt){Lt.isLight&&Lt.layers.test(gt.layers)&&(p.pushLight(Lt),Lt.castShadow&&p.pushShadow(Lt))}),p.setupLights(M._useLegacyLights);let Ot=new Set;return z.traverse(function(Lt){let Le=Lt.material;if(Le)if(Array.isArray(Le))for(let $e=0;$e<Le.length;$e++){let tn=Le[$e];De(tn,Pt,Lt),Ot.add(tn)}else De(Le,Pt,Lt),Ot.add(Le)}),A.pop(),p=null,Ot},this.compileAsync=function(z,gt,Pt=null){let Ot=this.compile(z,gt,Pt);return new Promise(Lt=>{function Le(){if(Ot.forEach(function($e){be.get($e).currentProgram.isReady()&&Ot.delete($e)}),Ot.size===0){Lt(z);return}setTimeout(Le,10)}ct.get("KHR_parallel_shader_compile")!==null?Le():setTimeout(Le,10)})};let te=null;function Ue(z){te&&te(z)}function He(){on.stop()}function Ne(){on.start()}let on=new rg;on.setAnimationLoop(Ue),typeof self<"u"&&on.setContext(self),this.setAnimationLoop=function(z){te=z,ne.setAnimationLoop(z),z===null?on.stop():on.start()},ne.addEventListener("sessionstart",He),ne.addEventListener("sessionend",Ne),this.render=function(z,gt){if(gt!==void 0&&gt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(P===!0)return;z.matrixWorldAutoUpdate===!0&&z.updateMatrixWorld(),gt.parent===null&&gt.matrixWorldAutoUpdate===!0&&gt.updateMatrixWorld(),ne.enabled===!0&&ne.isPresenting===!0&&(ne.cameraAutoUpdate===!0&&ne.updateCamera(gt),gt=ne.getCamera()),z.isScene===!0&&z.onBeforeRender(M,z,gt,D),p=je.get(z,A.length),p.init(),A.push(p),Pe.multiplyMatrices(gt.projectionMatrix,gt.matrixWorldInverse),Ct.setFromProjectionMatrix(Pe),ge=this.localClippingEnabled,Bt=rn.init(this.clippingPlanes,ge),_=we.get(z,x.length),_.init(),x.push(_),un(z,gt,0,M.sortObjects),_.finish(),M.sortObjects===!0&&_.sort(Jt,Tt),this.info.render.frame++,Bt===!0&&rn.beginShadows();let Pt=p.state.shadowsArray;if(pe.render(Pt,z,gt),Bt===!0&&rn.endShadows(),this.info.autoReset===!0&&this.info.reset(),yn.render(_,z),p.setupLights(M._useLegacyLights),gt.isArrayCamera){let Ot=gt.cameras;for(let Lt=0,Le=Ot.length;Lt<Le;Lt++){let $e=Ot[Lt];mn(_,z,$e,$e.viewport)}}else mn(_,z,gt);D!==null&&(O.updateMultisampleRenderTarget(D),O.updateRenderTargetMipmap(D)),z.isScene===!0&&z.onAfterRender(M,z,gt),ft.resetDefaultState(),Y=-1,R=null,A.pop(),A.length>0?p=A[A.length-1]:p=null,x.pop(),x.length>0?_=x[x.length-1]:_=null};function un(z,gt,Pt,Ot){if(z.visible===!1)return;if(z.layers.test(gt.layers)){if(z.isGroup)Pt=z.renderOrder;else if(z.isLOD)z.autoUpdate===!0&&z.update(gt);else if(z.isLight)p.pushLight(z),z.castShadow&&p.pushShadow(z);else if(z.isSprite){if(!z.frustumCulled||Ct.intersectsSprite(z)){Ot&&Ze.setFromMatrixPosition(z.matrixWorld).applyMatrix4(Pe);let $e=ue.update(z),tn=z.material;tn.visible&&_.push(z,$e,tn,Pt,Ze.z,null)}}else if((z.isMesh||z.isLine||z.isPoints)&&(!z.frustumCulled||Ct.intersectsObject(z))){let $e=ue.update(z),tn=z.material;if(Ot&&(z.boundingSphere!==void 0?(z.boundingSphere===null&&z.computeBoundingSphere(),Ze.copy(z.boundingSphere.center)):($e.boundingSphere===null&&$e.computeBoundingSphere(),Ze.copy($e.boundingSphere.center)),Ze.applyMatrix4(z.matrixWorld).applyMatrix4(Pe)),Array.isArray(tn)){let an=$e.groups;for(let dn=0,ln=an.length;dn<ln;dn++){let hn=an[dn],Hn=tn[hn.materialIndex];Hn&&Hn.visible&&_.push(z,$e,Hn,Pt,Ze.z,hn)}}else tn.visible&&_.push(z,$e,tn,Pt,Ze.z,null)}}let Le=z.children;for(let $e=0,tn=Le.length;$e<tn;$e++)un(Le[$e],gt,Pt,Ot)}function mn(z,gt,Pt,Ot){let Lt=z.opaque,Le=z.transmissive,$e=z.transparent;p.setupLightsView(Pt),Bt===!0&&rn.setGlobalState(M.clippingPlanes,Pt),Le.length>0&&Rn(Lt,Le,gt,Pt),Ot&&jt.viewport(E.copy(Ot)),Lt.length>0&&Tn(Lt,gt,Pt),Le.length>0&&Tn(Le,gt,Pt),$e.length>0&&Tn($e,gt,Pt),jt.buffers.depth.setTest(!0),jt.buffers.depth.setMask(!0),jt.buffers.color.setMask(!0),jt.setPolygonOffset(!1)}function Rn(z,gt,Pt,Ot){if((Pt.isScene===!0?Pt.overrideMaterial:null)!==null)return;let Le=ye.isWebGL2;Re===null&&(Re=new Cr(1,1,{generateMipmaps:!0,type:ct.has("EXT_color_buffer_half_float")?ml:Qr,minFilter:pl,samples:Le?4:0})),M.getDrawingBufferSize(Xe),Le?Re.setSize(Xe.x,Xe.y):Re.setSize(Yc(Xe.x),Yc(Xe.y));let $e=M.getRenderTarget();M.setRenderTarget(Re),M.getClearColor(Qt),tt=M.getClearAlpha(),tt<1&&M.setClearColor(16777215,.5),M.clear();let tn=M.toneMapping;M.toneMapping=Kr,Tn(z,Pt,Ot),O.updateMultisampleRenderTarget(Re),O.updateRenderTargetMipmap(Re);let an=!1;for(let dn=0,ln=gt.length;dn<ln;dn++){let hn=gt[dn],Hn=hn.object,wi=hn.geometry,$n=hn.material,zs=hn.group;if($n.side===xn&&Hn.layers.test(Ot.layers)){let Zn=$n.side;$n.side=fs,$n.needsUpdate=!0,Fn(Hn,Pt,Ot,wi,$n,zs),$n.side=Zn,$n.needsUpdate=!0,an=!0}}an===!0&&(O.updateMultisampleRenderTarget(Re),O.updateRenderTargetMipmap(Re)),M.setRenderTarget($e),M.setClearColor(Qt,tt),M.toneMapping=tn}function Tn(z,gt,Pt){let Ot=gt.isScene===!0?gt.overrideMaterial:null;for(let Lt=0,Le=z.length;Lt<Le;Lt++){let $e=z[Lt],tn=$e.object,an=$e.geometry,dn=Ot===null?$e.material:Ot,ln=$e.group;tn.layers.test(Pt.layers)&&Fn(tn,gt,Pt,an,dn,ln)}}function Fn(z,gt,Pt,Ot,Lt,Le){z.onBeforeRender(M,gt,Pt,Ot,Lt,Le),z.modelViewMatrix.multiplyMatrices(Pt.matrixWorldInverse,z.matrixWorld),z.normalMatrix.getNormalMatrix(z.modelViewMatrix),Lt.onBeforeRender(M,gt,Pt,Ot,z,Le),Lt.transparent===!0&&Lt.side===xn&&Lt.forceSinglePass===!1?(Lt.side=fs,Lt.needsUpdate=!0,M.renderBufferDirect(Pt,gt,Ot,Lt,z,Le),Lt.side=to,Lt.needsUpdate=!0,M.renderBufferDirect(Pt,gt,Ot,Lt,z,Le),Lt.side=xn):M.renderBufferDirect(Pt,gt,Ot,Lt,z,Le),z.onAfterRender(M,gt,Pt,Ot,Lt,Le)}function ci(z,gt,Pt){gt.isScene!==!0&&(gt=Ie);let Ot=be.get(z),Lt=p.state.lights,Le=p.state.shadowsArray,$e=Lt.state.version,tn=We.getParameters(z,Lt.state,Le,gt,Pt),an=We.getProgramCacheKey(tn),dn=Ot.programs;Ot.environment=z.isMeshStandardMaterial?gt.environment:null,Ot.fog=gt.fog,Ot.envMap=(z.isMeshStandardMaterial?yt:I).get(z.envMap||Ot.environment),dn===void 0&&(z.addEventListener("dispose",Ht),dn=new Map,Ot.programs=dn);let ln=dn.get(an);if(ln!==void 0){if(Ot.currentProgram===ln&&Ot.lightsStateVersion===$e)return as(z,tn),ln}else tn.uniforms=We.getUniforms(z),z.onBuild(Pt,tn,M),z.onBeforeCompile(tn,M),ln=We.acquireProgram(tn,an),dn.set(an,ln),Ot.uniforms=tn.uniforms;let hn=Ot.uniforms;return(!z.isShaderMaterial&&!z.isRawShaderMaterial||z.clipping===!0)&&(hn.clippingPlanes=rn.uniform),as(z,tn),Ot.needsLights=Bs(z),Ot.lightsStateVersion=$e,Ot.needsLights&&(hn.ambientLightColor.value=Lt.state.ambient,hn.lightProbe.value=Lt.state.probe,hn.directionalLights.value=Lt.state.directional,hn.directionalLightShadows.value=Lt.state.directionalShadow,hn.spotLights.value=Lt.state.spot,hn.spotLightShadows.value=Lt.state.spotShadow,hn.rectAreaLights.value=Lt.state.rectArea,hn.ltc_1.value=Lt.state.rectAreaLTC1,hn.ltc_2.value=Lt.state.rectAreaLTC2,hn.pointLights.value=Lt.state.point,hn.pointLightShadows.value=Lt.state.pointShadow,hn.hemisphereLights.value=Lt.state.hemi,hn.directionalShadowMap.value=Lt.state.directionalShadowMap,hn.directionalShadowMatrix.value=Lt.state.directionalShadowMatrix,hn.spotShadowMap.value=Lt.state.spotShadowMap,hn.spotLightMatrix.value=Lt.state.spotLightMatrix,hn.spotLightMap.value=Lt.state.spotLightMap,hn.pointShadowMap.value=Lt.state.pointShadowMap,hn.pointShadowMatrix.value=Lt.state.pointShadowMatrix),Ot.currentProgram=ln,Ot.uniformsList=null,ln}function Fs(z){if(z.uniformsList===null){let gt=z.currentProgram.getUniforms();z.uniformsList=Sa.seqWithValue(gt.seq,z.uniforms)}return z.uniformsList}function as(z,gt){let Pt=be.get(z);Pt.outputColorSpace=gt.outputColorSpace,Pt.batching=gt.batching,Pt.instancing=gt.instancing,Pt.instancingColor=gt.instancingColor,Pt.skinning=gt.skinning,Pt.morphTargets=gt.morphTargets,Pt.morphNormals=gt.morphNormals,Pt.morphColors=gt.morphColors,Pt.morphTargetsCount=gt.morphTargetsCount,Pt.numClippingPlanes=gt.numClippingPlanes,Pt.numIntersection=gt.numClipIntersection,Pt.vertexAlphas=gt.vertexAlphas,Pt.vertexTangents=gt.vertexTangents,Pt.toneMapping=gt.toneMapping}function Ln(z,gt,Pt,Ot,Lt){gt.isScene!==!0&&(gt=Ie),O.resetTextureUnits();let Le=gt.fog,$e=Ot.isMeshStandardMaterial?gt.environment:null,tn=D===null?M.outputColorSpace:D.isXRRenderTarget===!0?D.texture.colorSpace:Rr,an=(Ot.isMeshStandardMaterial?yt:I).get(Ot.envMap||$e),dn=Ot.vertexColors===!0&&!!Pt.attributes.color&&Pt.attributes.color.itemSize===4,ln=!!Pt.attributes.tangent&&(!!Ot.normalMap||Ot.anisotropy>0),hn=!!Pt.morphAttributes.position,Hn=!!Pt.morphAttributes.normal,wi=!!Pt.morphAttributes.color,$n=Kr;Ot.toneMapped&&(D===null||D.isXRRenderTarget===!0)&&($n=M.toneMapping);let zs=Pt.morphAttributes.position||Pt.morphAttributes.normal||Pt.morphAttributes.color,Zn=zs!==void 0?zs.length:0,pn=be.get(Ot),Dr=p.state.lights;if(Bt===!0&&(ge===!0||z!==R)){let Di=z===R&&Ot.id===Y;rn.setState(Ot,z,Di)}let Bn=!1;Ot.version===pn.__version?(pn.needsLights&&pn.lightsStateVersion!==Dr.state.version||pn.outputColorSpace!==tn||Lt.isBatchedMesh&&pn.batching===!1||!Lt.isBatchedMesh&&pn.batching===!0||Lt.isInstancedMesh&&pn.instancing===!1||!Lt.isInstancedMesh&&pn.instancing===!0||Lt.isSkinnedMesh&&pn.skinning===!1||!Lt.isSkinnedMesh&&pn.skinning===!0||Lt.isInstancedMesh&&pn.instancingColor===!0&&Lt.instanceColor===null||Lt.isInstancedMesh&&pn.instancingColor===!1&&Lt.instanceColor!==null||pn.envMap!==an||Ot.fog===!0&&pn.fog!==Le||pn.numClippingPlanes!==void 0&&(pn.numClippingPlanes!==rn.numPlanes||pn.numIntersection!==rn.numIntersection)||pn.vertexAlphas!==dn||pn.vertexTangents!==ln||pn.morphTargets!==hn||pn.morphNormals!==Hn||pn.morphColors!==wi||pn.toneMapping!==$n||ye.isWebGL2===!0&&pn.morphTargetsCount!==Zn)&&(Bn=!0):(Bn=!0,pn.__version=Ot.version);let ks=pn.currentProgram;Bn===!0&&(ks=ci(Ot,gt,Lt));let Ur=!1,oo=!1,Oa=!1,Ti=ks.getUniforms(),Ii=pn.uniforms;if(jt.useProgram(ks.program)&&(Ur=!0,oo=!0,Oa=!0),Ot.id!==Y&&(Y=Ot.id,oo=!0),Ur||R!==z){Ti.setValue(et,"projectionMatrix",z.projectionMatrix),Ti.setValue(et,"viewMatrix",z.matrixWorldInverse);let Di=Ti.map.cameraPosition;Di!==void 0&&Di.setValue(et,Ze.setFromMatrixPosition(z.matrixWorld)),ye.logarithmicDepthBuffer&&Ti.setValue(et,"logDepthBufFC",2/(Math.log(z.far+1)/Math.LN2)),(Ot.isMeshPhongMaterial||Ot.isMeshToonMaterial||Ot.isMeshLambertMaterial||Ot.isMeshBasicMaterial||Ot.isMeshStandardMaterial||Ot.isShaderMaterial)&&Ti.setValue(et,"isOrthographic",z.isOrthographicCamera===!0),R!==z&&(R=z,oo=!0,Oa=!0)}if(Lt.isSkinnedMesh){Ti.setOptional(et,Lt,"bindMatrix"),Ti.setOptional(et,Lt,"bindMatrixInverse");let Di=Lt.skeleton;Di&&(ye.floatVertexTextures?(Di.boneTexture===null&&Di.computeBoneTexture(),Ti.setValue(et,"boneTexture",Di.boneTexture,O)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}Lt.isBatchedMesh&&(Ti.setOptional(et,Lt,"batchingTexture"),Ti.setValue(et,"batchingTexture",Lt._matricesTexture,O));let ls=Pt.morphAttributes;if((ls.position!==void 0||ls.normal!==void 0||ls.color!==void 0&&ye.isWebGL2===!0)&&G.update(Lt,Pt,ks),(oo||pn.receiveShadow!==Lt.receiveShadow)&&(pn.receiveShadow=Lt.receiveShadow,Ti.setValue(et,"receiveShadow",Lt.receiveShadow)),Ot.isMeshGouraudMaterial&&Ot.envMap!==null&&(Ii.envMap.value=an,Ii.flipEnvMap.value=an.isCubeTexture&&an.isRenderTargetTexture===!1?-1:1),oo&&(Ti.setValue(et,"toneMappingExposure",M.toneMappingExposure),pn.needsLights&&_n(Ii,Oa),Le&&Ot.fog===!0&&Yt.refreshFogUniforms(Ii,Le),Yt.refreshMaterialUniforms(Ii,Ot,qt,bt,Re),Sa.upload(et,Fs(pn),Ii,O)),Ot.isShaderMaterial&&Ot.uniformsNeedUpdate===!0&&(Sa.upload(et,Fs(pn),Ii,O),Ot.uniformsNeedUpdate=!1),Ot.isSpriteMaterial&&Ti.setValue(et,"center",Lt.center),Ti.setValue(et,"modelViewMatrix",Lt.modelViewMatrix),Ti.setValue(et,"normalMatrix",Lt.normalMatrix),Ti.setValue(et,"modelMatrix",Lt.matrixWorld),Ot.isShaderMaterial||Ot.isRawShaderMaterial){let Di=Ot.uniformsGroups;for(let gn=0,Hs=Di.length;gn<Hs;gn++)if(ye.isWebGL2){let Jn=Di[gn];Kt.update(Jn,ks),Kt.bind(Jn,ks)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return ks}function _n(z,gt){z.ambientLightColor.needsUpdate=gt,z.lightProbe.needsUpdate=gt,z.directionalLights.needsUpdate=gt,z.directionalLightShadows.needsUpdate=gt,z.pointLights.needsUpdate=gt,z.pointLightShadows.needsUpdate=gt,z.spotLights.needsUpdate=gt,z.spotLightShadows.needsUpdate=gt,z.rectAreaLights.needsUpdate=gt,z.hemisphereLights.needsUpdate=gt}function Bs(z){return z.isMeshLambertMaterial||z.isMeshToonMaterial||z.isMeshPhongMaterial||z.isMeshStandardMaterial||z.isShadowMaterial||z.isShaderMaterial&&z.lights===!0}this.getActiveCubeFace=function(){return C},this.getActiveMipmapLevel=function(){return T},this.getRenderTarget=function(){return D},this.setRenderTargetTextures=function(z,gt,Pt){be.get(z.texture).__webglTexture=gt,be.get(z.depthTexture).__webglTexture=Pt;let Ot=be.get(z);Ot.__hasExternalTextures=!0,Ot.__hasExternalTextures&&(Ot.__autoAllocateDepthBuffer=Pt===void 0,Ot.__autoAllocateDepthBuffer||ct.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Ot.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(z,gt){let Pt=be.get(z);Pt.__webglFramebuffer=gt,Pt.__useDefaultFramebuffer=gt===void 0},this.setRenderTarget=function(z,gt=0,Pt=0){D=z,C=gt,T=Pt;let Ot=!0,Lt=null,Le=!1,$e=!1;if(z){let an=be.get(z);an.__useDefaultFramebuffer!==void 0?(jt.bindFramebuffer(et.FRAMEBUFFER,null),Ot=!1):an.__webglFramebuffer===void 0?O.setupRenderTarget(z):an.__hasExternalTextures&&O.rebindTextures(z,be.get(z.texture).__webglTexture,be.get(z.depthTexture).__webglTexture);let dn=z.texture;(dn.isData3DTexture||dn.isDataArrayTexture||dn.isCompressedArrayTexture)&&($e=!0);let ln=be.get(z).__webglFramebuffer;z.isWebGLCubeRenderTarget?(Array.isArray(ln[gt])?Lt=ln[gt][Pt]:Lt=ln[gt],Le=!0):ye.isWebGL2&&z.samples>0&&O.useMultisampledRTT(z)===!1?Lt=be.get(z).__webglMultisampledFramebuffer:Array.isArray(ln)?Lt=ln[Pt]:Lt=ln,E.copy(z.viewport),st.copy(z.scissor),mt=z.scissorTest}else E.copy($t).multiplyScalar(qt).floor(),st.copy(le).multiplyScalar(qt).floor(),mt=Me;if(jt.bindFramebuffer(et.FRAMEBUFFER,Lt)&&ye.drawBuffers&&Ot&&jt.drawBuffers(z,Lt),jt.viewport(E),jt.scissor(st),jt.setScissorTest(mt),Le){let an=be.get(z.texture);et.framebufferTexture2D(et.FRAMEBUFFER,et.COLOR_ATTACHMENT0,et.TEXTURE_CUBE_MAP_POSITIVE_X+gt,an.__webglTexture,Pt)}else if($e){let an=be.get(z.texture),dn=gt||0;et.framebufferTextureLayer(et.FRAMEBUFFER,et.COLOR_ATTACHMENT0,an.__webglTexture,Pt||0,dn)}Y=-1},this.readRenderTargetPixels=function(z,gt,Pt,Ot,Lt,Le,$e){if(!(z&&z.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let tn=be.get(z).__webglFramebuffer;if(z.isWebGLCubeRenderTarget&&$e!==void 0&&(tn=tn[$e]),tn){jt.bindFramebuffer(et.FRAMEBUFFER,tn);try{let an=z.texture,dn=an.format,ln=an.type;if(dn!==Js&&nt.convert(dn)!==et.getParameter(et.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let hn=ln===ml&&(ct.has("EXT_color_buffer_half_float")||ye.isWebGL2&&ct.has("EXT_color_buffer_float"));if(ln!==Qr&&nt.convert(ln)!==et.getParameter(et.IMPLEMENTATION_COLOR_READ_TYPE)&&!(ln===Jr&&(ye.isWebGL2||ct.has("OES_texture_float")||ct.has("WEBGL_color_buffer_float")))&&!hn){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}gt>=0&&gt<=z.width-Ot&&Pt>=0&&Pt<=z.height-Lt&&et.readPixels(gt,Pt,Ot,Lt,nt.convert(dn),nt.convert(ln),Le)}finally{let an=D!==null?be.get(D).__webglFramebuffer:null;jt.bindFramebuffer(et.FRAMEBUFFER,an)}}},this.copyFramebufferToTexture=function(z,gt,Pt=0){let Ot=Math.pow(2,-Pt),Lt=Math.floor(gt.image.width*Ot),Le=Math.floor(gt.image.height*Ot);O.setTexture2D(gt,0),et.copyTexSubImage2D(et.TEXTURE_2D,Pt,0,0,z.x,z.y,Lt,Le),jt.unbindTexture()},this.copyTextureToTexture=function(z,gt,Pt,Ot=0){let Lt=gt.image.width,Le=gt.image.height,$e=nt.convert(Pt.format),tn=nt.convert(Pt.type);O.setTexture2D(Pt,0),et.pixelStorei(et.UNPACK_FLIP_Y_WEBGL,Pt.flipY),et.pixelStorei(et.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Pt.premultiplyAlpha),et.pixelStorei(et.UNPACK_ALIGNMENT,Pt.unpackAlignment),gt.isDataTexture?et.texSubImage2D(et.TEXTURE_2D,Ot,z.x,z.y,Lt,Le,$e,tn,gt.image.data):gt.isCompressedTexture?et.compressedTexSubImage2D(et.TEXTURE_2D,Ot,z.x,z.y,gt.mipmaps[0].width,gt.mipmaps[0].height,$e,gt.mipmaps[0].data):et.texSubImage2D(et.TEXTURE_2D,Ot,z.x,z.y,$e,tn,gt.image),Ot===0&&Pt.generateMipmaps&&et.generateMipmap(et.TEXTURE_2D),jt.unbindTexture()},this.copyTextureToTexture3D=function(z,gt,Pt,Ot,Lt=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Le=z.max.x-z.min.x+1,$e=z.max.y-z.min.y+1,tn=z.max.z-z.min.z+1,an=nt.convert(Ot.format),dn=nt.convert(Ot.type),ln;if(Ot.isData3DTexture)O.setTexture3D(Ot,0),ln=et.TEXTURE_3D;else if(Ot.isDataArrayTexture||Ot.isCompressedArrayTexture)O.setTexture2DArray(Ot,0),ln=et.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}et.pixelStorei(et.UNPACK_FLIP_Y_WEBGL,Ot.flipY),et.pixelStorei(et.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Ot.premultiplyAlpha),et.pixelStorei(et.UNPACK_ALIGNMENT,Ot.unpackAlignment);let hn=et.getParameter(et.UNPACK_ROW_LENGTH),Hn=et.getParameter(et.UNPACK_IMAGE_HEIGHT),wi=et.getParameter(et.UNPACK_SKIP_PIXELS),$n=et.getParameter(et.UNPACK_SKIP_ROWS),zs=et.getParameter(et.UNPACK_SKIP_IMAGES),Zn=Pt.isCompressedTexture?Pt.mipmaps[Lt]:Pt.image;et.pixelStorei(et.UNPACK_ROW_LENGTH,Zn.width),et.pixelStorei(et.UNPACK_IMAGE_HEIGHT,Zn.height),et.pixelStorei(et.UNPACK_SKIP_PIXELS,z.min.x),et.pixelStorei(et.UNPACK_SKIP_ROWS,z.min.y),et.pixelStorei(et.UNPACK_SKIP_IMAGES,z.min.z),Pt.isDataTexture||Pt.isData3DTexture?et.texSubImage3D(ln,Lt,gt.x,gt.y,gt.z,Le,$e,tn,an,dn,Zn.data):Pt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),et.compressedTexSubImage3D(ln,Lt,gt.x,gt.y,gt.z,Le,$e,tn,an,Zn.data)):et.texSubImage3D(ln,Lt,gt.x,gt.y,gt.z,Le,$e,tn,an,dn,Zn),et.pixelStorei(et.UNPACK_ROW_LENGTH,hn),et.pixelStorei(et.UNPACK_IMAGE_HEIGHT,Hn),et.pixelStorei(et.UNPACK_SKIP_PIXELS,wi),et.pixelStorei(et.UNPACK_SKIP_ROWS,$n),et.pixelStorei(et.UNPACK_SKIP_IMAGES,zs),Lt===0&&Ot.generateMipmaps&&et.generateMipmap(ln),jt.unbindTexture()},this.initTexture=function(z){z.isCubeTexture?O.setTextureCube(z,0):z.isData3DTexture?O.setTexture3D(z,0):z.isDataArrayTexture||z.isCompressedArrayTexture?O.setTexture2DArray(z,0):O.setTexture2D(z,0),jt.unbindTexture()},this.resetState=function(){C=0,T=0,D=null,jt.reset(),ft.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Ar}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===yd?"display-p3":"srgb",e.unpackColorSpace=Gn.workingColorSpace===Uh?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===Wn?To:tg}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===To?Wn:Rr}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},qf=class extends _l{};qf.prototype.isWebGL1Renderer=!0;var oh=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new fn(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var ah=class extends xi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}},lh=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Cf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=ur()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ur()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=ur()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},is=new W,Qs=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyMatrix4(t),this.setXYZ(e,is.x,is.y,is.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyNormalMatrix(t),this.setXYZ(e,is.x,is.y,is.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.transformDirection(t),this.setXYZ(e,is.x,is.y,is.z);return this}setX(t,e){return this.normalized&&(e=Vn(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Vn(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Vn(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Vn(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=hr(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=hr(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=hr(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=hr(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Vn(e,this.array),n=Vn(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Vn(e,this.array),n=Vn(n,this.array),s=Vn(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Vn(e,this.array),n=Vn(n,this.array),s=Vn(s,this.array),r=Vn(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Yn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var ch=class extends Es{constructor(t=null,e=1,n=1,s,r,a,o,l,h=Ai,u=Ai,f,m){super(null,a,o,l,h,u,s,r,f,m),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var vl=class extends Yn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},ga=new Un,C0=new Un,Dc=[],P0=new Qi,S2=new Un,ol=new Qe,al=new ps,Pr=class extends Qe{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new vl(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,S2)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new Qi),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ga),P0.copy(t.boundingBox).applyMatrix4(ga),this.boundingBox.union(P0)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ps),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,ga),al.copy(t.boundingSphere).applyMatrix4(ga),this.boundingSphere.union(al)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,s=this.count;if(ol.geometry=this.geometry,ol.material=this.material,ol.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),al.copy(this.boundingSphere),al.applyMatrix4(n),t.ray.intersectsSphere(al)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,ga),C0.multiplyMatrices(n,ga),ol.matrixWorld=C0,ol.raycast(t,Dc);for(let a=0,o=Dc.length;a<o;a++){let l=Dc[a];l.instanceId=r,l.object=this,e.push(l)}Dc.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new vl(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Ra=class extends dr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fn(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},L0=new W,I0=new W,D0=new Un,_f=new Ao,Uc=new ps,Yf=class extends xi{constructor(t=new Pn,e=new Ra){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)L0.fromBufferAttribute(e,s-1),I0.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=L0.distanceTo(I0);t.setAttribute("lineDistance",new sn(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Uc.copy(n.boundingSphere),Uc.applyMatrix4(s),Uc.radius+=r,t.ray.intersectsSphere(Uc)===!1)return;D0.copy(s).invert(),_f.copy(t.ray).applyMatrix4(D0);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=new W,u=new W,f=new W,m=new W,d=this.isLineSegments?2:1,y=n.index,p=n.attributes.position;if(y!==null){let x=Math.max(0,a.start),A=Math.min(y.count,a.start+a.count);for(let M=x,P=A-1;M<P;M+=d){let C=y.getX(M),T=y.getX(M+1);if(h.fromBufferAttribute(p,C),u.fromBufferAttribute(p,T),_f.distanceSqToSegment(h,u,m,f)>l)continue;m.applyMatrix4(this.matrixWorld);let Y=t.ray.origin.distanceTo(m);Y<t.near||Y>t.far||e.push({distance:Y,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}else{let x=Math.max(0,a.start),A=Math.min(p.count,a.start+a.count);for(let M=x,P=A-1;M<P;M+=d){if(h.fromBufferAttribute(p,M),u.fromBufferAttribute(p,M+1),_f.distanceSqToSegment(h,u,m,f)>l)continue;m.applyMatrix4(this.matrixWorld);let T=t.ray.origin.distanceTo(m);T<t.near||T>t.far||e.push({distance:T,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}},U0=new W,N0=new W,Ml=class extends Yf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)U0.fromBufferAttribute(e,s),N0.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+U0.distanceTo(N0);t.setAttribute("lineDistance",new sn(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var gs=class extends Es{constructor(t,e,n,s,r,a,o,l,h){super(t,e,n,s,r,a,o,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},Os=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,h;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],m=n[s+1]-u,d=(a-u)/m;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new fe:new W);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new W,s=[],r=[],a=[],o=new W,l=new Un;for(let d=0;d<=t;d++){let y=d/t;s[d]=this.getTangentAt(y,new W)}r[0]=new W,a[0]=new W;let h=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),m=Math.abs(s[0].z);u<=h&&(h=u,n.set(1,0,0)),f<=h&&(h=f,n.set(0,1,0)),m<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let y=Math.acos(Ri(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,y))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Ri(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let y=1;y<=t;y++)r[y].applyMatrix4(l.makeRotationAxis(s[y],d*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},bl=class extends Os{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e){let n=e||new fe,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),m=l-this.aX,d=h-this.aY;l=m*u-d*f+this.aX,h=m*f+d*u+this.aY}return n.set(l,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},$f=class extends bl{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function Md(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,h){s(a,o,h*(o-r),h*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,h,u,f){let m=(a-r)/h-(o-r)/(h+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;m*=u,d*=u,s(a,o,m,d)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var Nc=new W,vf=new Md,Mf=new Md,bf=new Md,Ro=class extends Os{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new W){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let h,u;this.closed||o>0?h=s[(o-1)%r]:(Nc.subVectors(s[0],s[1]).add(s[0]),h=Nc);let f=s[o%r],m=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Nc.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Nc),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,y=Math.pow(h.distanceToSquared(f),d),_=Math.pow(f.distanceToSquared(m),d),p=Math.pow(m.distanceToSquared(u),d);_<1e-4&&(_=1),y<1e-4&&(y=_),p<1e-4&&(p=_),vf.initNonuniformCatmullRom(h.x,f.x,m.x,u.x,y,_,p),Mf.initNonuniformCatmullRom(h.y,f.y,m.y,u.y,y,_,p),bf.initNonuniformCatmullRom(h.z,f.z,m.z,u.z,y,_,p)}else this.curveType==="catmullrom"&&(vf.initCatmullRom(h.x,f.x,m.x,u.x,this.tension),Mf.initCatmullRom(h.y,f.y,m.y,u.y,this.tension),bf.initCatmullRom(h.z,f.z,m.z,u.z,this.tension));return n.set(vf.calc(l),Mf.calc(l),bf.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new W().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function O0(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function E2(i,t){let e=1-i;return e*e*t}function w2(i,t){return 2*(1-i)*i*t}function T2(i,t){return i*i*t}function fl(i,t,e,n){return E2(i,t)+w2(i,e)+T2(i,n)}function A2(i,t){let e=1-i;return e*e*e*t}function R2(i,t){let e=1-i;return 3*e*e*i*t}function C2(i,t){return 3*(1-i)*i*i*t}function P2(i,t){return i*i*i*t}function dl(i,t,e,n,s){return A2(i,t)+R2(i,e)+C2(i,n)+P2(i,s)}var hh=class extends Os{constructor(t=new fe,e=new fe,n=new fe,s=new fe){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new fe){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(dl(t,s.x,r.x,a.x,o.x),dl(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},Zf=class extends Os{constructor(t=new W,e=new W,n=new W,s=new W){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new W){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(dl(t,s.x,r.x,a.x,o.x),dl(t,s.y,r.y,a.y,o.y),dl(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},uh=class extends Os{constructor(t=new fe,e=new fe){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new fe){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new fe){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Jf=class extends Os{constructor(t=new W,e=new W){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new W){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new W){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},fh=class extends Os{constructor(t=new fe,e=new fe,n=new fe){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new fe){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(fl(t,s.x,r.x,a.x),fl(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},dh=class extends Os{constructor(t=new W,e=new W,n=new W){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new W){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(fl(t,s.x,r.x,a.x),fl(t,s.y,r.y,a.y),fl(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ph=class extends Os{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new fe){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],h=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(O0(o,l.x,h.x,u.x,f.x),O0(o,l.y,h.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new fe().fromArray(s))}return this}},mh=Object.freeze({__proto__:null,ArcCurve:$f,CatmullRomCurve3:Ro,CubicBezierCurve:hh,CubicBezierCurve3:Zf,EllipseCurve:bl,LineCurve:uh,LineCurve3:Jf,QuadraticBezierCurve:fh,QuadraticBezierCurve3:dh,SplineCurve:ph}),jf=class extends Os{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new mh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),h=l===0?0:1-a/l;return o.getPointAt(h,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let h=0;h<l.length;h++){let u=l[h];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new mh[s.type]().fromJSON(s))}return this}},gh=class extends jf{constructor(t){super(),this.type="Path",this.currentPoint=new fe,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new uh(this.currentPoint.clone(),new fe(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new fh(this.currentPoint.clone(),new fe(t,e),new fe(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new hh(this.currentPoint.clone(),new fe(t,e),new fe(n,s),new fe(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new ph(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){let h=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+h,e+u,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){let h=new bl(t,e,n,s,r,a,o,l);if(this.curves.length>0){let f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);let u=h.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var xh=class i extends Pn{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],l=[],h=new W,u=new fe;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,m=3;f<=e;f++,m+=3){let d=n+f/e*s;h.x=t*Math.cos(d),h.y=t*Math.sin(d),a.push(h.x,h.y,h.z),o.push(0,0,1),u.x=(a[m]/t+1)/2,u.y=(a[m+1]/t+1)/2,l.push(u.x,u.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new sn(a,3)),this.setAttribute("normal",new sn(o,3)),this.setAttribute("uv",new sn(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Vi=class i extends Pn{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let h=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],m=[],d=[],y=0,_=[],p=n/2,x=0;A(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new sn(f,3)),this.setAttribute("normal",new sn(m,3)),this.setAttribute("uv",new sn(d,2));function A(){let P=new W,C=new W,T=0,D=(e-t)/n;for(let Y=0;Y<=r;Y++){let R=[],E=Y/r,st=E*(e-t)+t;for(let mt=0;mt<=s;mt++){let Qt=mt/s,tt=Qt*l+o,lt=Math.sin(tt),bt=Math.cos(tt);C.x=st*lt,C.y=-E*n+p,C.z=st*bt,f.push(C.x,C.y,C.z),P.set(lt,D,bt).normalize(),m.push(P.x,P.y,P.z),d.push(Qt,1-E),R.push(y++)}_.push(R)}for(let Y=0;Y<s;Y++)for(let R=0;R<r;R++){let E=_[R][Y],st=_[R+1][Y],mt=_[R+1][Y+1],Qt=_[R][Y+1];u.push(E,st,Qt),u.push(st,mt,Qt),T+=6}h.addGroup(x,T,0),x+=T}function M(P){let C=y,T=new fe,D=new W,Y=0,R=P===!0?t:e,E=P===!0?1:-1;for(let mt=1;mt<=s;mt++)f.push(0,p*E,0),m.push(0,E,0),d.push(.5,.5),y++;let st=y;for(let mt=0;mt<=s;mt++){let tt=mt/s*l+o,lt=Math.cos(tt),bt=Math.sin(tt);D.x=R*bt,D.y=p*E,D.z=R*lt,f.push(D.x,D.y,D.z),m.push(0,E,0),T.x=lt*.5+.5,T.y=bt*.5*E+.5,d.push(T.x,T.y),y++}for(let mt=0;mt<s;mt++){let Qt=C+mt,tt=st+mt;P===!0?u.push(tt,tt+1,Qt):u.push(tt+1,tt,Qt),Y+=3}h.addGroup(x,Y,P===!0?1:2),x+=Y}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},no=class i extends Vi{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},Kf=class i extends Pn{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],a=[];o(s),h(n),u(),this.setAttribute("position",new sn(r,3)),this.setAttribute("normal",new sn(r.slice(),3)),this.setAttribute("uv",new sn(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(A){let M=new W,P=new W,C=new W;for(let T=0;T<e.length;T+=3)d(e[T+0],M),d(e[T+1],P),d(e[T+2],C),l(M,P,C,A)}function l(A,M,P,C){let T=C+1,D=[];for(let Y=0;Y<=T;Y++){D[Y]=[];let R=A.clone().lerp(P,Y/T),E=M.clone().lerp(P,Y/T),st=T-Y;for(let mt=0;mt<=st;mt++)mt===0&&Y===T?D[Y][mt]=R:D[Y][mt]=R.clone().lerp(E,mt/st)}for(let Y=0;Y<T;Y++)for(let R=0;R<2*(T-Y)-1;R++){let E=Math.floor(R/2);R%2===0?(m(D[Y][E+1]),m(D[Y+1][E]),m(D[Y][E])):(m(D[Y][E+1]),m(D[Y+1][E+1]),m(D[Y+1][E]))}}function h(A){let M=new W;for(let P=0;P<r.length;P+=3)M.x=r[P+0],M.y=r[P+1],M.z=r[P+2],M.normalize().multiplyScalar(A),r[P+0]=M.x,r[P+1]=M.y,r[P+2]=M.z}function u(){let A=new W;for(let M=0;M<r.length;M+=3){A.x=r[M+0],A.y=r[M+1],A.z=r[M+2];let P=p(A)/2/Math.PI+.5,C=x(A)/Math.PI+.5;a.push(P,1-C)}y(),f()}function f(){for(let A=0;A<a.length;A+=6){let M=a[A+0],P=a[A+2],C=a[A+4],T=Math.max(M,P,C),D=Math.min(M,P,C);T>.9&&D<.1&&(M<.2&&(a[A+0]+=1),P<.2&&(a[A+2]+=1),C<.2&&(a[A+4]+=1))}}function m(A){r.push(A.x,A.y,A.z)}function d(A,M){let P=A*3;M.x=t[P+0],M.y=t[P+1],M.z=t[P+2]}function y(){let A=new W,M=new W,P=new W,C=new W,T=new fe,D=new fe,Y=new fe;for(let R=0,E=0;R<r.length;R+=9,E+=6){A.set(r[R+0],r[R+1],r[R+2]),M.set(r[R+3],r[R+4],r[R+5]),P.set(r[R+6],r[R+7],r[R+8]),T.set(a[E+0],a[E+1]),D.set(a[E+2],a[E+3]),Y.set(a[E+4],a[E+5]),C.copy(A).add(M).add(P).divideScalar(3);let st=p(C);_(T,E+0,A,st),_(D,E+2,M,st),_(Y,E+4,P,st)}}function _(A,M,P,C){C<0&&A.x===1&&(a[M]=A.x-1),P.x===0&&P.z===0&&(a[M]=C/2/Math.PI+.5)}function p(A){return Math.atan2(A.z,-A.x)}function x(A){return Math.atan2(-A.y,Math.sqrt(A.x*A.x+A.z*A.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var Lr=class extends gh{constructor(t){super(t),this.uuid=ur(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new gh().fromJSON(s))}return this}},L2={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=ug(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,h,u,f,m,d;if(n&&(r=O2(i,t,r,e)),i.length>80*e){o=h=i[0],l=u=i[1];for(let y=e;y<s;y+=e)f=i[y],m=i[y+1],f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m);d=Math.max(h-o,u-l),d=d!==0?32767/d:0}return Sl(r,a,e,o,l,d,0),a}};function ug(i,t,e,n,s){let r,a;if(s===Y2(i,t,e,n)>0)for(r=t;r<e;r+=n)a=F0(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=F0(r,i[r],i[r+1],a);return a&&Bh(a,a.next)&&(wl(a),a=a.next),a}function Co(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(Bh(e,e.next)||gi(e.prev,e,e.next)===0)){if(wl(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Sl(i,t,e,n,s,r,a){if(!i)return;!a&&r&&H2(i,n,s,r);let o=i,l,h;for(;i.prev!==i.next;){if(l=i.prev,h=i.next,r?D2(i,n,s,r):I2(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(h.i/e|0),wl(i),i=h.next,o=h.next;continue}if(i=h,i===o){a?a===1?(i=U2(Co(i),t,e),Sl(i,t,e,n,s,r,2)):a===2&&N2(i,t,e,n,s,r):Sl(Co(i),t,e,n,s,r,1);break}}}function I2(i){let t=i.prev,e=i,n=i.next;if(gi(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,h=n.y,u=s<r?s<a?s:a:r<a?r:a,f=o<l?o<h?o:h:l<h?l:h,m=s>r?s>a?s:a:r>a?r:a,d=o>l?o>h?o:h:l>h?l:h,y=n.next;for(;y!==t;){if(y.x>=u&&y.x<=m&&y.y>=f&&y.y<=d&&va(s,o,r,l,a,h,y.x,y.y)&&gi(y.prev,y,y.next)>=0)return!1;y=y.next}return!0}function D2(i,t,e,n){let s=i.prev,r=i,a=i.next;if(gi(s,r,a)>=0)return!1;let o=s.x,l=r.x,h=a.x,u=s.y,f=r.y,m=a.y,d=o<l?o<h?o:h:l<h?l:h,y=u<f?u<m?u:m:f<m?f:m,_=o>l?o>h?o:h:l>h?l:h,p=u>f?u>m?u:m:f>m?f:m,x=Qf(d,y,t,e,n),A=Qf(_,p,t,e,n),M=i.prevZ,P=i.nextZ;for(;M&&M.z>=x&&P&&P.z<=A;){if(M.x>=d&&M.x<=_&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&va(o,u,l,f,h,m,M.x,M.y)&&gi(M.prev,M,M.next)>=0||(M=M.prevZ,P.x>=d&&P.x<=_&&P.y>=y&&P.y<=p&&P!==s&&P!==a&&va(o,u,l,f,h,m,P.x,P.y)&&gi(P.prev,P,P.next)>=0))return!1;P=P.nextZ}for(;M&&M.z>=x;){if(M.x>=d&&M.x<=_&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&va(o,u,l,f,h,m,M.x,M.y)&&gi(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;P&&P.z<=A;){if(P.x>=d&&P.x<=_&&P.y>=y&&P.y<=p&&P!==s&&P!==a&&va(o,u,l,f,h,m,P.x,P.y)&&gi(P.prev,P,P.next)>=0)return!1;P=P.nextZ}return!0}function U2(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!Bh(s,r)&&fg(s,n,n.next,r)&&El(s,r)&&El(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),wl(n),wl(n.next),n=i=r),n=n.next}while(n!==i);return Co(n)}function N2(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&W2(a,o)){let l=dg(a,o);a=Co(a,a.next),l=Co(l,l.next),Sl(a,t,e,n,s,r,0),Sl(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function O2(i,t,e,n){let s=[],r,a,o,l,h;for(r=0,a=t.length;r<a;r++)o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,h=ug(i,o,l,n,!1),h===h.next&&(h.steiner=!0),s.push(G2(h));for(s.sort(F2),r=0;r<s.length;r++)e=B2(s[r],e);return e}function F2(i,t){return i.x-t.x}function B2(i,t){let e=z2(i,t);if(!e)return t;let n=dg(e,i);return Co(n,n.next),Co(e,e.next)}function z2(i,t){let e=t,n=-1/0,s,r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){let m=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(m<=r&&m>n&&(n=m,s=e.x<e.next.x?e:e.next,m===r))return s}e=e.next}while(e!==t);if(!s)return null;let o=s,l=s.x,h=s.y,u=1/0,f;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&va(a<h?r:n,a,l,h,a<h?n:r,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(r-e.x),El(e,i)&&(f<u||f===u&&(e.x>s.x||e.x===s.x&&k2(s,e)))&&(s=e,u=f)),e=e.next;while(e!==o);return s}function k2(i,t){return gi(i.prev,i,t.prev)<0&&gi(t.next,i,i.next)<0}function H2(i,t,e,n){let s=i;do s.z===0&&(s.z=Qf(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,V2(s)}function V2(i){let t,e,n,s,r,a,o,l,h=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<h&&(o++,n=n.nextZ,!!n);t++);for(l=h;o>0||l>0&&n;)o!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,h*=2}while(a>1);return i}function Qf(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function G2(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function va(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function W2(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!X2(i,t)&&(El(i,t)&&El(t,i)&&q2(i,t)&&(gi(i.prev,i,t.prev)||gi(i,t.prev,t))||Bh(i,t)&&gi(i.prev,i,i.next)>0&&gi(t.prev,t,t.next)>0)}function gi(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function Bh(i,t){return i.x===t.x&&i.y===t.y}function fg(i,t,e,n){let s=Fc(gi(i,t,e)),r=Fc(gi(i,t,n)),a=Fc(gi(e,n,i)),o=Fc(gi(e,n,t));return!!(s!==r&&a!==o||s===0&&Oc(i,e,t)||r===0&&Oc(i,n,t)||a===0&&Oc(e,i,n)||o===0&&Oc(e,t,n))}function Oc(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function Fc(i){return i>0?1:i<0?-1:0}function X2(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&fg(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function El(i,t){return gi(i.prev,i,i.next)<0?gi(i,t,i.next)>=0&&gi(i,i.prev,t)>=0:gi(i,t,i.prev)<0||gi(i,i.next,t)<0}function q2(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function dg(i,t){let e=new td(i.i,i.x,i.y),n=new td(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function F0(i,t,e,n){let s=new td(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function wl(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function td(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function Y2(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var js=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];B0(t),z0(n,t);let a=t.length;e.forEach(B0);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,z0(n,e[l]);let o=L2.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function B0(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function z0(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Tl=class i extends Pn{constructor(t=new Lr([new fe(.5,.5),new fe(-.5,.5),new fe(-.5,-.5),new fe(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){let h=t[o];a(h)}this.setAttribute("position",new sn(s,3)),this.setAttribute("uv",new sn(r,2)),this.computeVertexNormals();function a(o){let l=[],h=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1,m=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,y=e.bevelSize!==void 0?e.bevelSize:d-.1,_=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,x=e.extrudePath,A=e.UVGenerator!==void 0?e.UVGenerator:$2,M,P=!1,C,T,D,Y;x&&(M=x.getSpacedPoints(u),P=!0,m=!1,C=x.computeFrenetFrames(u,!1),T=new W,D=new W,Y=new W),m||(p=0,d=0,y=0,_=0);let R=o.extractPoints(h),E=R.shape,st=R.holes;if(!js.isClockWise(E)){E=E.reverse();for(let et=0,Se=st.length;et<Se;et++){let ct=st[et];js.isClockWise(ct)&&(st[et]=ct.reverse())}}let Qt=js.triangulateShape(E,st),tt=E;for(let et=0,Se=st.length;et<Se;et++){let ct=st[et];E=E.concat(ct)}function lt(et,Se,ct){return Se||console.error("THREE.ExtrudeGeometry: vec does not exist"),et.clone().addScaledVector(Se,ct)}let bt=E.length,qt=Qt.length;function Jt(et,Se,ct){let ye,jt,ke,be=et.x-Se.x,O=et.y-Se.y,I=ct.x-et.x,yt=ct.y-et.y,me=be*be+O*O,de=be*yt-O*I;if(Math.abs(de)>Number.EPSILON){let ue=Math.sqrt(me),We=Math.sqrt(I*I+yt*yt),Yt=Se.x-O/ue,we=Se.y+be/ue,je=ct.x-yt/We,rn=ct.y+I/We,pe=((je-Yt)*yt-(rn-we)*I)/(be*yt-O*I);ye=Yt+be*pe-et.x,jt=we+O*pe-et.y;let yn=ye*ye+jt*jt;if(yn<=2)return new fe(ye,jt);ke=Math.sqrt(yn/2)}else{let ue=!1;be>Number.EPSILON?I>Number.EPSILON&&(ue=!0):be<-Number.EPSILON?I<-Number.EPSILON&&(ue=!0):Math.sign(O)===Math.sign(yt)&&(ue=!0),ue?(ye=-O,jt=be,ke=Math.sqrt(me)):(ye=be,jt=O,ke=Math.sqrt(me/2))}return new fe(ye/ke,jt/ke)}let Tt=[];for(let et=0,Se=tt.length,ct=Se-1,ye=et+1;et<Se;et++,ct++,ye++)ct===Se&&(ct=0),ye===Se&&(ye=0),Tt[et]=Jt(tt[et],tt[ct],tt[ye]);let $t=[],le,Me=Tt.concat();for(let et=0,Se=st.length;et<Se;et++){let ct=st[et];le=[];for(let ye=0,jt=ct.length,ke=jt-1,be=ye+1;ye<jt;ye++,ke++,be++)ke===jt&&(ke=0),be===jt&&(be=0),le[ye]=Jt(ct[ye],ct[ke],ct[be]);$t.push(le),Me=Me.concat(le)}for(let et=0;et<p;et++){let Se=et/p,ct=d*Math.cos(Se*Math.PI/2),ye=y*Math.sin(Se*Math.PI/2)+_;for(let jt=0,ke=tt.length;jt<ke;jt++){let be=lt(tt[jt],Tt[jt],ye);Pe(be.x,be.y,-ct)}for(let jt=0,ke=st.length;jt<ke;jt++){let be=st[jt];le=$t[jt];for(let O=0,I=be.length;O<I;O++){let yt=lt(be[O],le[O],ye);Pe(yt.x,yt.y,-ct)}}}let Ct=y+_;for(let et=0;et<bt;et++){let Se=m?lt(E[et],Me[et],Ct):E[et];P?(D.copy(C.normals[0]).multiplyScalar(Se.x),T.copy(C.binormals[0]).multiplyScalar(Se.y),Y.copy(M[0]).add(D).add(T),Pe(Y.x,Y.y,Y.z)):Pe(Se.x,Se.y,0)}for(let et=1;et<=u;et++)for(let Se=0;Se<bt;Se++){let ct=m?lt(E[Se],Me[Se],Ct):E[Se];P?(D.copy(C.normals[et]).multiplyScalar(ct.x),T.copy(C.binormals[et]).multiplyScalar(ct.y),Y.copy(M[et]).add(D).add(T),Pe(Y.x,Y.y,Y.z)):Pe(ct.x,ct.y,f/u*et)}for(let et=p-1;et>=0;et--){let Se=et/p,ct=d*Math.cos(Se*Math.PI/2),ye=y*Math.sin(Se*Math.PI/2)+_;for(let jt=0,ke=tt.length;jt<ke;jt++){let be=lt(tt[jt],Tt[jt],ye);Pe(be.x,be.y,f+ct)}for(let jt=0,ke=st.length;jt<ke;jt++){let be=st[jt];le=$t[jt];for(let O=0,I=be.length;O<I;O++){let yt=lt(be[O],le[O],ye);P?Pe(yt.x,yt.y+M[u-1].y,M[u-1].x+ct):Pe(yt.x,yt.y,f+ct)}}}Bt(),ge();function Bt(){let et=s.length/3;if(m){let Se=0,ct=bt*Se;for(let ye=0;ye<qt;ye++){let jt=Qt[ye];Xe(jt[2]+ct,jt[1]+ct,jt[0]+ct)}Se=u+p*2,ct=bt*Se;for(let ye=0;ye<qt;ye++){let jt=Qt[ye];Xe(jt[0]+ct,jt[1]+ct,jt[2]+ct)}}else{for(let Se=0;Se<qt;Se++){let ct=Qt[Se];Xe(ct[2],ct[1],ct[0])}for(let Se=0;Se<qt;Se++){let ct=Qt[Se];Xe(ct[0]+bt*u,ct[1]+bt*u,ct[2]+bt*u)}}n.addGroup(et,s.length/3-et,0)}function ge(){let et=s.length/3,Se=0;Re(tt,Se),Se+=tt.length;for(let ct=0,ye=st.length;ct<ye;ct++){let jt=st[ct];Re(jt,Se),Se+=jt.length}n.addGroup(et,s.length/3-et,1)}function Re(et,Se){let ct=et.length;for(;--ct>=0;){let ye=ct,jt=ct-1;jt<0&&(jt=et.length-1);for(let ke=0,be=u+p*2;ke<be;ke++){let O=bt*ke,I=bt*(ke+1),yt=Se+ye+O,me=Se+jt+O,de=Se+jt+I,ue=Se+ye+I;Ze(yt,me,de,ue)}}}function Pe(et,Se,ct){l.push(et),l.push(Se),l.push(ct)}function Xe(et,Se,ct){Ie(et),Ie(Se),Ie(ct);let ye=s.length/3,jt=A.generateTopUV(n,s,ye-3,ye-2,ye-1);Be(jt[0]),Be(jt[1]),Be(jt[2])}function Ze(et,Se,ct,ye){Ie(et),Ie(Se),Ie(ye),Ie(Se),Ie(ct),Ie(ye);let jt=s.length/3,ke=A.generateSideWallUV(n,s,jt-6,jt-3,jt-2,jt-1);Be(ke[0]),Be(ke[1]),Be(ke[3]),Be(ke[1]),Be(ke[2]),Be(ke[3])}function Ie(et){s.push(l[et*3+0]),s.push(l[et*3+1]),s.push(l[et*3+2])}function Be(et){r.push(et.x),r.push(et.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Z2(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new mh[s.type]().fromJSON(s)),new i(n,t.options)}},$2={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],h=t[s*3],u=t[s*3+1];return[new fe(r,a),new fe(o,l),new fe(h,u)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],h=t[n*3],u=t[n*3+1],f=t[n*3+2],m=t[s*3],d=t[s*3+1],y=t[s*3+2],_=t[r*3],p=t[r*3+1],x=t[r*3+2];return Math.abs(o-u)<Math.abs(a-h)?[new fe(a,1-l),new fe(h,1-f),new fe(m,1-y),new fe(_,1-x)]:[new fe(o,1-l),new fe(u,1-f),new fe(d,1-y),new fe(p,1-x)]}};function Z2(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var yh=class i extends Kf{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var _h=class i extends Pn{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],h=[],u=[],f=t,m=(e-t)/s,d=new W,y=new fe;for(let _=0;_<=s;_++){for(let p=0;p<=n;p++){let x=r+p/n*a;d.x=f*Math.cos(x),d.y=f*Math.sin(x),l.push(d.x,d.y,d.z),h.push(0,0,1),y.x=(d.x/e+1)/2,y.y=(d.y/e+1)/2,u.push(y.x,y.y)}f+=m}for(let _=0;_<s;_++){let p=_*(n+1);for(let x=0;x<n;x++){let A=x+p,M=A,P=A+n+1,C=A+n+2,T=A+1;o.push(M,P,T),o.push(P,C,T)}}this.setIndex(o),this.setAttribute("position",new sn(l,3)),this.setAttribute("normal",new sn(h,3)),this.setAttribute("uv",new sn(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Al=class i extends Pn{constructor(t=new Lr([new fe(0,.5),new fe(-.5,-.5),new fe(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(t)===!1)h(t);else for(let u=0;u<t.length;u++)h(t[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new sn(s,3)),this.setAttribute("normal",new sn(r,3)),this.setAttribute("uv",new sn(a,2));function h(u){let f=s.length/3,m=u.extractPoints(e),d=m.shape,y=m.holes;js.isClockWise(d)===!1&&(d=d.reverse());for(let p=0,x=y.length;p<x;p++){let A=y[p];js.isClockWise(A)===!0&&(y[p]=A.reverse())}let _=js.triangulateShape(d,y);for(let p=0,x=y.length;p<x;p++){let A=y[p];d=d.concat(A)}for(let p=0,x=d.length;p<x;p++){let A=d[p];s.push(A.x,A.y,0),r.push(0,0,1),a.push(A.x,A.y)}for(let p=0,x=_.length;p<x;p++){let A=_[p],M=A[0]+f,P=A[1]+f,C=A[2]+f;n.push(M,P,C),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return J2(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let a=e[t.shapes[s]];n.push(a)}return new i(n,t.curveSegments)}};function J2(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var Gi=class i extends Pn{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),h=0,u=[],f=new W,m=new W,d=[],y=[],_=[],p=[];for(let x=0;x<=n;x++){let A=[],M=x/n,P=0;x===0&&a===0?P=.5/e:x===n&&l===Math.PI&&(P=-.5/e);for(let C=0;C<=e;C++){let T=C/e;f.x=-t*Math.cos(s+T*r)*Math.sin(a+M*o),f.y=t*Math.cos(a+M*o),f.z=t*Math.sin(s+T*r)*Math.sin(a+M*o),y.push(f.x,f.y,f.z),m.copy(f).normalize(),_.push(m.x,m.y,m.z),p.push(T+P,1-M),A.push(h++)}u.push(A)}for(let x=0;x<n;x++)for(let A=0;A<e;A++){let M=u[x][A+1],P=u[x][A],C=u[x+1][A],T=u[x+1][A+1];(x!==0||a>0)&&d.push(M,P,T),(x!==n-1||l<Math.PI)&&d.push(P,C,T)}this.setIndex(d),this.setAttribute("position",new sn(y,3)),this.setAttribute("normal",new sn(_,3)),this.setAttribute("uv",new sn(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var vh=class i extends Pn{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],l=[],h=[],u=new W,f=new W,m=new W;for(let d=0;d<=n;d++)for(let y=0;y<=s;y++){let _=y/s*r,p=d/n*Math.PI*2;f.x=(t+e*Math.cos(p))*Math.cos(_),f.y=(t+e*Math.cos(p))*Math.sin(_),f.z=e*Math.sin(p),o.push(f.x,f.y,f.z),u.x=t*Math.cos(_),u.y=t*Math.sin(_),m.subVectors(f,u).normalize(),l.push(m.x,m.y,m.z),h.push(y/s),h.push(d/n)}for(let d=1;d<=n;d++)for(let y=1;y<=s;y++){let _=(s+1)*d+y-1,p=(s+1)*(d-1)+y-1,x=(s+1)*(d-1)+y,A=(s+1)*d+y;a.push(_,p,A),a.push(p,x,A)}this.setIndex(a),this.setAttribute("position",new sn(o,3)),this.setAttribute("normal",new sn(l,3)),this.setAttribute("uv",new sn(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Mh=class i extends Pn{constructor(t=new dh(new W(-1,-1,0),new W(-1,1,0),new W(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new W,l=new W,h=new fe,u=new W,f=[],m=[],d=[],y=[];_(),this.setIndex(y),this.setAttribute("position",new sn(f,3)),this.setAttribute("normal",new sn(m,3)),this.setAttribute("uv",new sn(d,2));function _(){for(let M=0;M<e;M++)p(M);p(r===!1?e:0),A(),x()}function p(M){u=t.getPointAt(M/e,u);let P=a.normals[M],C=a.binormals[M];for(let T=0;T<=s;T++){let D=T/s*Math.PI*2,Y=Math.sin(D),R=-Math.cos(D);l.x=R*P.x+Y*C.x,l.y=R*P.y+Y*C.y,l.z=R*P.z+Y*C.z,l.normalize(),m.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,f.push(o.x,o.y,o.z)}}function x(){for(let M=1;M<=e;M++)for(let P=1;P<=s;P++){let C=(s+1)*(M-1)+(P-1),T=(s+1)*M+(P-1),D=(s+1)*M+P,Y=(s+1)*(M-1)+P;y.push(C,T,Y),y.push(T,D,Y)}}function A(){for(let M=0;M<=e;M++)for(let P=0;P<=s;P++)h.x=M/e,h.y=P/s,d.push(h.x,h.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new mh[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},bh=class extends Pn{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],n=new Set,s=new W,r=new W;if(t.index!==null){let a=t.attributes.position,o=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let h=0,u=l.length;h<u;++h){let f=l[h],m=f.start,d=f.count;for(let y=m,_=m+d;y<_;y+=3)for(let p=0;p<3;p++){let x=o.getX(y+p),A=o.getX(y+(p+1)%3);s.fromBufferAttribute(a,x),r.fromBufferAttribute(a,A),k0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let h=0;h<3;h++){let u=3*o+h,f=3*o+(h+1)%3;s.fromBufferAttribute(a,u),r.fromBufferAttribute(a,f),k0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new sn(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function k0(i,t,e){let n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}var Sh=class extends dr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new fn(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dh,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Eh=class extends dr{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new fn(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dh,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var wh=class extends dr{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Dh,this.normalScale=new fe(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=md,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function Bc(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function j2(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Ca=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},ed=class extends Ca{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:km,endingEnd:km}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Hm:r=t,o=2*e-n;break;case Vm:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Hm:a=t,l=2*n-e;break;case Vm:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let h=(n-e)*.5,u=this.valueSize;this._weightPrev=h/(e-o),this._weightNext=h/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,h=l-o,u=this._offsetPrev,f=this._offsetNext,m=this._weightPrev,d=this._weightNext,y=(n-e)/(s-e),_=y*y,p=_*y,x=-m*p+2*m*_-m*y,A=(1+m)*p+(-1.5-2*m)*_+(-.5+m)*y+1,M=(-1-d)*p+(1.5+d)*_+.5*y,P=d*p-d*_;for(let C=0;C!==o;++C)r[C]=x*a[u+C]+A*a[h+C]+M*a[l+C]+P*a[f+C];return r}},nd=class extends Ca{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,h=l-o,u=(n-e)/(s-e),f=1-u;for(let m=0;m!==o;++m)r[m]=a[h+m]*f+a[l+m]*u;return r}},id=class extends Ca{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},tr=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=Bc(e,this.TimeBufferType),this.values=Bc(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:Bc(t.times,Array),values:Bc(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new id(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new nd(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new ed(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Hc:e=this.InterpolantFactoryMethodDiscrete;break;case Vc:e=this.InterpolantFactoryMethodLinear;break;case Zu:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Hc;case this.InterpolantFactoryMethodLinear:return Vc;case this.InterpolantFactoryMethodSmooth:return Zu}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&j2(s))for(let o=0,l=s.length;o!==l;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===Zu,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,h=t[o],u=t[o+1];if(h!==u&&(o!==1||h!==t[0]))if(s)l=!0;else{let f=o*n,m=f-n,d=f+n;for(let y=0;y!==n;++y){let _=e[f+y];if(_!==e[m+y]||_!==e[d+y]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let f=o*n,m=a*n;for(let d=0;d!==n;++d)e[m+d]=e[f+d]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,h=0;h!==n;++h)e[l+h]=e[o+h];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};tr.prototype.TimeBufferType=Float32Array;tr.prototype.ValueBufferType=Float32Array;tr.prototype.DefaultInterpolation=Vc;var Po=class extends tr{};Po.prototype.ValueTypeName="bool";Po.prototype.ValueBufferType=Array;Po.prototype.DefaultInterpolation=Hc;Po.prototype.InterpolantFactoryMethodLinear=void 0;Po.prototype.InterpolantFactoryMethodSmooth=void 0;var sd=class extends tr{};sd.prototype.ValueTypeName="color";var rd=class extends tr{};rd.prototype.ValueTypeName="number";var od=class extends Ca{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),h=t*o;for(let u=h+o;h!==u;h+=4)ds.slerpFlat(r,0,a,h-o,a,h,l);return r}},Rl=class extends tr{InterpolantFactoryMethodLinear(t){return new od(this.times,this.values,this.getValueSize(),t)}};Rl.prototype.ValueTypeName="quaternion";Rl.prototype.DefaultInterpolation=Vc;Rl.prototype.InterpolantFactoryMethodSmooth=void 0;var Lo=class extends tr{};Lo.prototype.ValueTypeName="string";Lo.prototype.ValueBufferType=Array;Lo.prototype.DefaultInterpolation=Hc;Lo.prototype.InterpolantFactoryMethodLinear=void 0;Lo.prototype.InterpolantFactoryMethodSmooth=void 0;var ad=class extends tr{};ad.prototype.ValueTypeName="vector";var ld=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,h=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return h.push(u,f),this},this.removeHandler=function(u){let f=h.indexOf(u);return f!==-1&&h.splice(f,2),this},this.getHandler=function(u){for(let f=0,m=h.length;f<m;f+=2){let d=h[f],y=h[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return y}return null}}},K2=new ld,cd=class{constructor(t){this.manager=t!==void 0?t:K2,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};cd.DEFAULT_MATERIAL_NAME="__DEFAULT";var Th=class extends xi{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new fn(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},Ah=class extends Th{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(xi.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fn(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},Sf=new Un,H0=new W,V0=new W,hd=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new fe(512,512),this.map=null,this.mapPass=null,this.matrix=new Un,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new yl,this._frameExtents=new fe(1,1),this._viewportCount=1,this._viewports=[new On(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;H0.setFromMatrixPosition(t.matrixWorld),e.position.copy(H0),V0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(V0),e.updateMatrixWorld(),Sf.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(Sf),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(Sf)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var ud=class extends hd{constructor(){super(new ih(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Rh=class extends Th{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(xi.DEFAULT_UP),this.updateMatrix(),this.target=new xi,this.shadow=new ud}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Ch=class extends Pn{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var bd="\\[\\]\\.:\\/",Q2=new RegExp("["+bd+"]","g"),Sd="[^"+bd+"]",tS="[^"+bd.replace("\\.","")+"]",eS=/((?:WC+[\/:])*)/.source.replace("WC",Sd),nS=/(WCOD+)?/.source.replace("WCOD",tS),iS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",Sd),sS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",Sd),rS=new RegExp("^"+eS+nS+iS+sS+"$"),oS=["material","materials","bones","map"],fd=class{constructor(t,e,n){let s=n||ui.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ui=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(Q2,"")}static parseTrackName(t){let e=rS.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);oS.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===h){h=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(h!==void 0){if(t[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let a=t[s];if(a===void 0){let h=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ui.Composite=fd;ui.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ui.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ui.prototype.GetterByBindingType=[ui.prototype._getValue_direct,ui.prototype._getValue_array,ui.prototype._getValue_arrayElement,ui.prototype._getValue_toArray];ui.prototype.SetterByBindingTypeAndVersioning=[[ui.prototype._setValue_direct,ui.prototype._setValue_direct_setNeedsUpdate,ui.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ui.prototype._setValue_array,ui.prototype._setValue_array_setNeedsUpdate,ui.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ui.prototype._setValue_arrayElement,ui.prototype._setValue_arrayElement_setNeedsUpdate,ui.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ui.prototype._setValue_fromArray,ui.prototype._setValue_fromArray_setNeedsUpdate,ui.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var NS=new Float32Array(1);var Io=class extends lh{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}};var Ph=class{constructor(t,e,n=0,s=1/0){this.ray=new Ao(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new xl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return dd(t,this,n,e),n.sort(G0),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)dd(t[s],this,n,e);return n.sort(G0),n}};function G0(i,t){return i.distance-t.distance}function dd(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,a=s.length;r<a;r++)dd(s[r],t,e,!0)}}var er=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Ri(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var W0=new W,zc=new W,Lh=class{constructor(t=new W,e=new W){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){W0.subVectors(t,this.start),zc.subVectors(this.end,this.start);let n=zc.dot(zc),r=zc.dot(W0)/n;return e&&(r=Ri(r,0,1)),r}closestPointToPoint(t,e,n){let s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var pg={type:"change"},Ed={type:"start"},mg={type:"end"},zh=new Ao,gg=new $s,aS=Math.cos(70*Nh.DEG2RAD),kh=class extends fr{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new W,this.cursor=new W,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Do.ROTATE,MIDDLE:Do.DOLLY,RIGHT:Do.PAN},this.touches={ONE:Uo.ROTATE,TWO:Uo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(G){G.addEventListener("keydown",ue),this._domElementKeyEvents=G},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",ue),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(pg),n.update(),r=s.NONE},this.update=(function(){let G=new W,ae=new ds().setFromUnitVectors(t.up,new W(0,1,0)),ve=ae.clone().invert(),nt=new W,ft=new ds,Kt=new W,ee=2*Math.PI;return function(ht=null){let V=n.object.position;G.copy(V).sub(n.target),G.applyQuaternion(ae),o.setFromVector3(G),n.autoRotate&&r===s.NONE&&st(R(ht)),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let Dt=n.minAzimuthAngle,Ht=n.maxAzimuthAngle;isFinite(Dt)&&isFinite(Ht)&&(Dt<-Math.PI?Dt+=ee:Dt>Math.PI&&(Dt-=ee),Ht<-Math.PI?Ht+=ee:Ht>Math.PI&&(Ht-=ee),Dt<=Ht?o.theta=Math.max(Dt,Math.min(Ht,o.theta)):o.theta=o.theta>(Dt+Ht)/2?Math.max(Dt,o.theta):Math.min(Ht,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&T||n.object.isOrthographicCamera?o.radius=Tt(o.radius):o.radius=Tt(o.radius*h),G.setFromSpherical(o),G.applyQuaternion(ve),V.copy(n.target).add(G),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0));let re=!1;if(n.zoomToCursor&&T){let ce=null;if(n.object.isPerspectiveCamera){let De=G.length();ce=Tt(De*h);let te=De-ce;n.object.position.addScaledVector(P,te),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let De=new W(C.x,C.y,0);De.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),re=!0;let te=new W(C.x,C.y,0);te.unproject(n.object),n.object.position.sub(te).add(De),n.object.updateMatrixWorld(),ce=G.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ce!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ce).add(n.object.position):(zh.origin.copy(n.object.position),zh.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(zh.direction))<aS?t.lookAt(n.target):(gg.setFromNormalAndCoplanarPoint(n.object.up,n.target),zh.intersectPlane(gg,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),re=!0);return h=1,T=!1,re||nt.distanceToSquared(n.object.position)>a||8*(1-ft.dot(n.object.quaternion))>a||Kt.distanceToSquared(n.target)>0?(n.dispatchEvent(pg),nt.copy(n.object.position),ft.copy(n.object.quaternion),Kt.copy(n.target),!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",we),n.domElement.removeEventListener("pointerdown",be),n.domElement.removeEventListener("pointercancel",I),n.domElement.removeEventListener("lostpointercapture",I),n.domElement.removeEventListener("wheel",de),n.domElement.removeEventListener("pointermove",O),n.domElement.removeEventListener("pointerup",I),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",ue),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new er,l=new er,h=1,u=new W,f=new fe,m=new fe,d=new fe,y=new fe,_=new fe,p=new fe,x=new fe,A=new fe,M=new fe,P=new W,C=new fe,T=!1,D=[],Y={};function R(G){return G!==null?2*Math.PI/60*n.autoRotateSpeed*G:2*Math.PI/60/60*n.autoRotateSpeed}function E(G){let ae=Math.abs(G)/(100*Math.max(1,window.devicePixelRatio||1));return Math.pow(.95,n.zoomSpeed*ae)}function st(G){l.theta-=G}function mt(G){l.phi-=G}let Qt=(function(){let G=new W;return function(ve,nt){G.setFromMatrixColumn(nt,0),G.multiplyScalar(-ve),u.add(G)}})(),tt=(function(){let G=new W;return function(ve,nt){n.screenSpacePanning===!0?G.setFromMatrixColumn(nt,1):(G.setFromMatrixColumn(nt,0),G.crossVectors(n.object.up,G)),G.multiplyScalar(ve),u.add(G)}})(),lt=(function(){let G=new W;return function(ve,nt){let ft=n.domElement;if(n.object.isPerspectiveCamera){let Kt=n.object.position;G.copy(Kt).sub(n.target);let ee=G.length();ee*=Math.tan(n.object.fov/2*Math.PI/180),Qt(2*ve*ee/ft.clientHeight,n.object.matrix),tt(2*nt*ee/ft.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(Qt(ve*(n.object.right-n.object.left)/n.object.zoom/ft.clientWidth,n.object.matrix),tt(nt*(n.object.top-n.object.bottom)/n.object.zoom/ft.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function bt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function qt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Jt(G,ae){if(!n.zoomToCursor)return;T=!0;let ve=n.domElement.getBoundingClientRect(),nt=G-ve.left,ft=ae-ve.top,Kt=ve.width,ee=ve.height;C.x=nt/Kt*2-1,C.y=-(ft/ee)*2+1,P.set(C.x,C.y,1).unproject(n.object).sub(n.object.position).normalize()}function Tt(G){return Math.max(n.minDistance,Math.min(n.maxDistance,G))}function $t(G){f.set(G.clientX,G.clientY)}function le(G){Jt(G.clientX,G.clientY),x.set(G.clientX,G.clientY)}function Me(G){y.set(G.clientX,G.clientY)}function Ct(G){m.set(G.clientX,G.clientY),d.subVectors(m,f).multiplyScalar(n.rotateSpeed);let ae=n.domElement;st(2*Math.PI*d.x/ae.clientHeight),mt(2*Math.PI*d.y/ae.clientHeight),f.copy(m),n.update()}function Bt(G){A.set(G.clientX,G.clientY),M.subVectors(A,x),M.y>0?bt(E(M.y)):M.y<0&&qt(E(M.y)),x.copy(A),n.update()}function ge(G){_.set(G.clientX,G.clientY),p.subVectors(_,y).multiplyScalar(n.panSpeed),lt(p.x,p.y),y.copy(_),n.update()}function Re(G){Jt(G.clientX,G.clientY),G.deltaY<0?qt(E(G.deltaY)):G.deltaY>0&&bt(E(G.deltaY)),n.update()}function Pe(G){let ae=!1;switch(G.code){case n.keys.UP:G.ctrlKey||G.metaKey||G.shiftKey?mt(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(0,n.keyPanSpeed),ae=!0;break;case n.keys.BOTTOM:G.ctrlKey||G.metaKey||G.shiftKey?mt(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(0,-n.keyPanSpeed),ae=!0;break;case n.keys.LEFT:G.ctrlKey||G.metaKey||G.shiftKey?st(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(n.keyPanSpeed,0),ae=!0;break;case n.keys.RIGHT:G.ctrlKey||G.metaKey||G.shiftKey?st(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):lt(-n.keyPanSpeed,0),ae=!0;break}ae&&(G.preventDefault(),n.update())}function Xe(G){if(D.length===1)f.set(G.pageX,G.pageY);else{let ae=yn(G),ve=.5*(G.pageX+ae.x),nt=.5*(G.pageY+ae.y);f.set(ve,nt)}}function Ze(G){if(D.length===1)y.set(G.pageX,G.pageY);else{let ae=yn(G),ve=.5*(G.pageX+ae.x),nt=.5*(G.pageY+ae.y);y.set(ve,nt)}}function Ie(G){let ae=yn(G),ve=G.pageX-ae.x,nt=G.pageY-ae.y,ft=Math.sqrt(ve*ve+nt*nt);x.set(0,ft)}function Be(G){n.enableZoom&&Ie(G),n.enablePan&&Ze(G)}function et(G){n.enableZoom&&Ie(G),n.enableRotate&&Xe(G)}function Se(G){if(D.length==1)m.set(G.pageX,G.pageY);else{let ve=yn(G),nt=.5*(G.pageX+ve.x),ft=.5*(G.pageY+ve.y);m.set(nt,ft)}d.subVectors(m,f).multiplyScalar(n.rotateSpeed);let ae=n.domElement;st(2*Math.PI*d.x/ae.clientHeight),mt(2*Math.PI*d.y/ae.clientHeight),f.copy(m)}function ct(G){if(D.length===1)_.set(G.pageX,G.pageY);else{let ae=yn(G),ve=.5*(G.pageX+ae.x),nt=.5*(G.pageY+ae.y);_.set(ve,nt)}p.subVectors(_,y).multiplyScalar(n.panSpeed),lt(p.x,p.y),y.copy(_)}function ye(G){let ae=yn(G),ve=G.pageX-ae.x,nt=G.pageY-ae.y,ft=Math.sqrt(ve*ve+nt*nt);if(A.set(0,ft),ft<1||x.y<1){x.copy(A);return}M.set(0,Math.pow(A.y/x.y,n.zoomSpeed)),bt(M.y),x.copy(A);let Kt=(G.pageX+ae.x)*.5,ee=(G.pageY+ae.y)*.5;Jt(Kt,ee)}function jt(G){n.enableZoom&&ye(G),n.enablePan&&ct(G)}function ke(G){n.enableZoom&&ye(G),n.enableRotate&&Se(G)}function be(G){n.enabled!==!1&&(D.length===0&&(n.domElement.setPointerCapture(G.pointerId),n.domElement.addEventListener("pointermove",O),n.domElement.addEventListener("pointerup",I)),je(G),G.pointerType==="touch"?We(G):yt(G))}function O(G){n.enabled!==!1&&(G.pointerType==="touch"?Yt(G):me(G))}function I(G){if(!D.includes(G.pointerId))return;rn(G),D.length===0&&((!n.domElement.hasPointerCapture||n.domElement.hasPointerCapture(G.pointerId))&&n.domElement.releasePointerCapture(G.pointerId),n.domElement.removeEventListener("pointermove",O),n.domElement.removeEventListener("pointerup",I)),n.dispatchEvent(mg),r=s.NONE;let ae=Y[D[0]];ae&&We({pointerId:D[0],pageX:ae.x,pageY:ae.y})}function yt(G){let ae;switch(G.button){case 0:ae=n.mouseButtons.LEFT;break;case 1:ae=n.mouseButtons.MIDDLE;break;case 2:ae=n.mouseButtons.RIGHT;break;default:ae=-1}switch(ae){case Do.DOLLY:if(n.enableZoom===!1)return;le(G),r=s.DOLLY;break;case Do.ROTATE:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enablePan===!1)return;Me(G),r=s.PAN}else{if(n.enableRotate===!1)return;$t(G),r=s.ROTATE}break;case Do.PAN:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enableRotate===!1)return;$t(G),r=s.ROTATE}else{if(n.enablePan===!1)return;Me(G),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ed)}function me(G){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Ct(G);break;case s.DOLLY:if(n.enableZoom===!1)return;Bt(G);break;case s.PAN:if(n.enablePan===!1)return;ge(G);break}}function de(G){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(G.preventDefault(),n.dispatchEvent(Ed),Re(G),n.dispatchEvent(mg))}function ue(G){n.enabled===!1||n.enablePan===!1||Pe(G)}function We(G){switch(pe(G),D.length){case 1:switch(n.touches.ONE){case Uo.ROTATE:if(n.enableRotate===!1)return;Xe(G),r=s.TOUCH_ROTATE;break;case Uo.PAN:if(n.enablePan===!1)return;Ze(G),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Uo.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;Be(G),r=s.TOUCH_DOLLY_PAN;break;case Uo.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;et(G),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Ed)}function Yt(G){switch(pe(G),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;Se(G),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;ct(G),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;jt(G),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;ke(G),n.update();break;default:r=s.NONE}}function we(G){n.enabled!==!1&&G.preventDefault()}function je(G){D.push(G.pointerId)}function rn(G){delete Y[G.pointerId];for(let ae=0;ae<D.length;ae++)if(D[ae]==G.pointerId){D.splice(ae,1);return}}function pe(G){let ae=Y[G.pointerId];ae===void 0&&(ae=new fe,Y[G.pointerId]=ae),ae.set(G.pageX,G.pageY)}function yn(G){let ae=G.pointerId===D[0]?D[1]:D[0];return Y[ae]}n.domElement.addEventListener("contextmenu",we),n.domElement.addEventListener("pointerdown",be),n.domElement.addEventListener("pointercancel",I),n.domElement.addEventListener("lostpointercapture",I),n.domElement.addEventListener("wheel",de,{passive:!1}),this.update()}};function xg(i,t,e){let n=new kh(i,t),s=n.update.bind(n),r=new Set,a=null,o=()=>{a?.gesture||(a&&(a.gesture=!0),n.dispatchEvent({type:"gesturestart"}))};n.stopMotion=()=>{let h=i.position.clone(),u=n.target.clone(),f=n.enableDamping;n.enableDamping=!1,s(),i.position.copy(h),n.target.copy(u),n.enableDamping=f,s()},t.addEventListener("pointerdown",h=>{r.size||(a={id:h.pointerId,x:h.clientX,y:h.clientY,time:h.timeStamp,primary:h.button===0,tolerance:h.pointerType==="mouse"?5:8,label:h.target.closest?.(".maplabel button"),moved:!1,multiple:!1}),r.add(h.pointerId),t.setPointerCapture(h.pointerId),a&&r.size>1&&(a.multiple=!0,o())}),t.addEventListener("pointermove",h=>{a&&a.id===h.pointerId&&Math.hypot(h.clientX-a.x,h.clientY-a.y)>=a.tolerance&&(a.moved=!0,o())}),t.addEventListener("pointerup",h=>{let u=r.has(h.pointerId)&&r.size===1&&a&&a.id===h.pointerId&&a.primary&&!a.multiple&&!a.moved&&h.timeStamp-a.time<550&&Math.hypot(h.clientX-a.x,h.clientY-a.y)<a.tolerance,f=a?.label;r.delete(h.pointerId),r.size||(a=null),u&&(f?f.click():e(h))});let l=h=>{r.delete(h.pointerId)&&(a=null)};return t.addEventListener("pointercancel",l),t.addEventListener("lostpointercapture",l),t.addEventListener("wheel",o,{passive:!0,capture:!0}),t.addEventListener("click",h=>{(h.detail>0||h.pointerType)&&h.target.closest?.(".maplabel button")&&(h.preventDefault(),h.stopPropagation())},!0),n}function yg(i,t,{now:e=()=>performance.now(),reducedMotion:n=!1}={}){let s=null,r=()=>{s=null};function a(l,h=1200,u=null,f=0){if(r(),t.stopMotion?.(),s={from:i.position.clone(),targetFrom:t.target.clone(),pos:l.pos.clone(),target:l.target.clone(),start:e(),duration:n?0:h,onDone:u,arrivalDelay:n?0:f,orbit:!!l.orbit},s.orbit){s.fromOrbit=new er().setFromVector3(s.from.clone().sub(s.targetFrom)),s.toOrbit=new er().setFromVector3(s.pos.clone().sub(s.target));let m=s.toOrbit.theta-s.fromOrbit.theta;s.toOrbit.theta=s.fromOrbit.theta+Math.atan2(Math.sin(m),Math.cos(m))}s.duration||o(s.start)}function o(l){if(!s)return!1;let h=s,u=h.duration?Math.max(0,Math.min(1,(l-h.start)/h.duration)):1,f=u<.5?4*u*u*u:1-(-2*u+2)**3/2;if(t.target.lerpVectors(h.targetFrom,h.target,f),h.orbit){let m=h.fromOrbit,d=h.toOrbit,y=(_,p)=>_+(p-_)*f;i.position.copy(new W().setFromSpherical(new er(y(m.radius,d.radius),y(m.phi,d.phi),y(m.theta,d.theta)))).add(t.target)}else i.position.lerpVectors(h.from,h.pos,f),i.position.y+=Math.sin(u*Math.PI)*Math.min(180,h.from.distanceTo(h.pos)*.12);return u===1&&l>=h.start+h.duration+h.arrivalDelay&&(s=null,h.onDone?.()),!0}return{move:a,update:o,cancel:r,get active(){return!!s},get destination(){return s}}}function _g(i,t,{width:e,depth:n,heightAt:s,cellSize:r=20,clearance:a=8,isCut:o=()=>!1,automatic:l=()=>!1}){let h=t.update.bind(t),u=new W,f=new W,m=new W,d=new Map,y=t.domElement,_=(C,T)=>Math.abs(C)<=e/2&&Math.abs(T)<=n/2,p=(C,T,D)=>Math.max(T,Math.min(D,C));t.minDistance=10,t.maxDistance=12500,t.minPolarAngle=Math.PI/180,t.maxPolarAngle=Math.PI*.482,t.screenSpacePanning=!1,t.zoomToCursor=!0;function x(C,T){if(T.y>=-1e-5)return null;let D=0,Y=t.maxDistance;for(let[mt,Qt]of[["x",e],["z",n]])if(Math.abs(T[mt])<1e-8){if(Math.abs(C[mt])>Qt/2)return null}else{let tt=(-Qt/2-C[mt])/T[mt],lt=(Qt/2-C[mt])/T[mt];D=Math.max(D,Math.min(tt,lt)),Y=Math.min(Y,Math.max(tt,lt))}if(Y<=D)return null;let R=mt=>C.y+T.y*mt-s(C.x+T.x*mt,C.z+T.z*mt);if(R(D)<=0)return null;let E=Math.max(1,Math.ceil((Y-D)*Math.hypot(T.x,T.z)/(r/2))),st=D;for(let mt=1;mt<=E;mt++){let Qt=D+(Y-D)*mt/E;if(R(Qt)<=0){for(let tt=0;tt<14;tt++){let lt=(st+Qt)/2;R(lt)>0?st=lt:Qt=lt}return C.clone().addScaledVector(T,(st+Qt)/2)}st=Qt}return null}function A(C=!0){let T=t.target,D=i.position,Y=p(T.x,-e/2,e/2)-T.x,R=p(T.z,-n/2,n/2)-T.z;if(T.x+=Y,T.z+=R,D.x+=Y,D.z+=R,C&&Math.abs(T.y-s(T.x,T.z))>.03){u.copy(T).sub(D).normalize();let st=x(D,u);st&&st.distanceTo(D)>=t.minDistance&&T.copy(st),T.y=s(T.x,T.z)}m.copy(D).sub(T);let E=m.length();(E<t.minDistance||E>t.maxDistance)&&(E<1e-8&&m.set(0,1,0),D.copy(T).add(m.setLength(p(E,t.minDistance,t.maxDistance)))),_(D.x,D.z)&&!o(D.x,D.z)&&(D.y=Math.max(D.y,s(D.x,D.z)+a)),i.lookAt(T),i.updateMatrixWorld()}t.update=(...C)=>{f.copy(i.position);let T=h(...C);return A(!l()),T||f.distanceToSquared(i.position)>1e-10};function M(C,T){let D=y.getBoundingClientRect();i.updateMatrixWorld(),u.set((C-D.left)/D.width*2-1,1-(T-D.top)/D.height*2,1).unproject(i).sub(i.position).normalize(),t.zoomToCursor=!!x(i.position,u)}y.addEventListener("wheel",C=>M(C.clientX,C.clientY),{capture:!0,passive:!0});for(let C of["pointerdown","pointermove"])y.addEventListener(C,T=>{if(C==="pointerdown"&&T.pointerType==="mouse"&&T.button===1&&M(T.clientX,T.clientY),T.pointerType==="touch"&&!(C==="pointermove"&&!d.has(T.pointerId))&&(d.set(T.pointerId,{x:T.clientX,y:T.clientY}),d.size===2)){let[D,Y]=[...d.values()];M((D.x+Y.x)/2,(D.y+Y.y)/2)}},{capture:!0,passive:!0});for(let C of["pointerup","pointercancel","lostpointercapture"])y.addEventListener(C,T=>d.delete(T.pointerId),!0);function P({base:C,scale:T=1,heading:D,polar:Y}={}){C||A();let R=(C?.target||t.target).clone();m.copy(C?.pos||i.position).sub(R);let E=new er().setFromVector3(m);return E.radius=p(E.radius*T,t.minDistance,t.maxDistance),D!==void 0&&(E.theta=-D),Y!==void 0&&(E.phi=p(Y,t.minPolarAngle,t.maxPolarAngle)),{target:R,pos:new W().setFromSpherical(E).add(R),orbit:!0}}return{pose:P,constrain:A,groundPoint:x}}var No=class extends xi{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new fe(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof Element&&e.element.parentNode!==null&&e.element.parentNode.removeChild(e.element)})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}},La=new W,vg=new Un,Mg=new Un,bg=new W,Sg=new W,Hh=class{constructor(t={}){let e=this,n,s,r,a,o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:n,height:s}},this.render=function(d,y){d.matrixWorldAutoUpdate===!0&&d.updateMatrixWorld(),y.parent===null&&y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),vg.copy(y.matrixWorldInverse),Mg.multiplyMatrices(y.projectionMatrix,vg),h(d,d,y),m(d)},this.setSize=function(d,y){n=d,s=y,r=n/2,a=s/2,l.style.width=d+"px",l.style.height=y+"px"};function h(d,y,_){if(d.isCSS2DObject){La.setFromMatrixPosition(d.matrixWorld),La.applyMatrix4(Mg);let p=d.visible===!0&&La.z>=-1&&La.z<=1&&d.layers.test(_.layers)===!0;if(d.element.style.display=p===!0?"":"none",p===!0){d.onBeforeRender(e,y,_);let A=d.element;A.style.transform="translate("+-100*d.center.x+"%,"+-100*d.center.y+"%)translate("+(La.x*r+r)+"px,"+(-La.y*a+a)+"px)",A.parentNode!==l&&l.appendChild(A),d.onAfterRender(e,y,_)}let x={distanceToCameraSquared:u(_,d)};o.objects.set(d,x)}for(let p=0,x=d.children.length;p<x;p++)h(d.children[p],y,_)}function u(d,y){return bg.setFromMatrixPosition(d.matrixWorld),Sg.setFromMatrixPosition(y.matrixWorld),bg.distanceToSquared(Sg)}function f(d){let y=[];return d.traverse(function(_){_.isCSS2DObject&&y.push(_)}),y}function m(d){let y=f(d).sort(function(p,x){if(p.renderOrder!==x.renderOrder)return x.renderOrder-p.renderOrder;let A=o.objects.get(p).distanceToCameraSquared,M=o.objects.get(x).distanceToCameraSquared;return A-M}),_=y.length;for(let p=0,x=y.length;p<x;p++)y[p].element.style.zIndex=_-p}}};function Eg(){let i=document.querySelector("#gesture-tour"),t=document.querySelector("#help-open"),e=document.querySelector("#tour-skip"),n=[...i.querySelectorAll(".tour-step")],s=[...i.querySelectorAll(".tour-progress i")],r=matchMedia("(prefers-reduced-motion:reduce)"),a=[],o;function l(){a.forEach(clearTimeout),a=[],cancelAnimationFrame(o)}function h(m){n.forEach((d,y)=>{d.classList.toggle("active",y===m),d.setAttribute("aria-hidden",String(y!==m)),s[y].classList.toggle("active",y===m)})}function u(){l(),i.classList.remove("show"),i.contains(document.activeElement)&&t.focus({preventScroll:!0}),a.push(setTimeout(()=>{i.hidden=!0},r.matches?0:600))}function f(){l(),i.classList.remove("show"),n.forEach(m=>m.classList.remove("active")),i.hidden=!1,i.offsetWidth,h(0),o=requestAnimationFrame(()=>i.classList.add("show")),a.push(setTimeout(()=>h(1),3800)),a.push(setTimeout(()=>h(2),6500)),a.push(setTimeout(u,9300))}return t.addEventListener("click",f),e.addEventListener("click",u),document.addEventListener("keydown",m=>{m.key==="Escape"&&!i.hidden&&u()}),document.addEventListener("pointerdown",m=>{!i.hidden&&m.target instanceof Element&&!m.target.closest("#gesture-tour,#help-open")&&u()},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.hidden&&u()}),{start:f,stop:u}}var wg=new Qi,Vh=new W,Ia=class extends Ch{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new sn(t,3)),this.setAttribute("uv",new sn(e,2))}applyMatrix4(t){let e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new Io(e,6,1);return this.setAttribute("instanceStart",new Qs(n,3,0)),this.setAttribute("instanceEnd",new Qs(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new Io(e,6,1);return this.setAttribute("instanceColorStart",new Qs(n,3,0)),this.setAttribute("instanceColorEnd",new Qs(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new bh(t.geometry)),this}fromLineSegments(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new Qi);let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),wg.setFromBufferAttribute(e),this.boundingBox.union(wg))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ps),this.boundingBox===null&&this.computeBoundingBox();let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Vh.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Vh)),Vh.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Vh));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}};Ae.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new fe(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};rs.line={uniforms:Oh.merge([Ae.common,Ae.fog,Ae.line]),vertexShader:`
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
		`};var io=class extends Ks{constructor(t){super({type:"LineMaterial",uniforms:Oh.clone(rs.line.uniforms),vertexShader:rs.line.vertexShader,fragmentShader:rs.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}};var Tg=new W,Ag=new W,Wi=new On,Xi=new On,pr=new On,wd=new W,Td=new Un,qi=new Lh,Rg=new W,Gh=new Qi,Wh=new ps,mr=new On,gr,Oo;function Cg(i,t,e){return mr.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),mr.multiplyScalar(1/mr.w),mr.x=Oo/e.width,mr.y=Oo/e.height,mr.applyMatrix4(i.projectionMatrixInverse),mr.multiplyScalar(1/mr.w),Math.abs(Math.max(mr.x,mr.y))}function lS(i,t){let e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){qi.start.fromBufferAttribute(s,o),qi.end.fromBufferAttribute(r,o),qi.applyMatrix4(e);let h=new W,u=new W;gr.distanceSqToSegment(qi.start,qi.end,u,h),u.distanceTo(h)<Oo*.5&&t.push({point:u,pointOnLine:h,distance:gr.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function cS(i,t,e){let n=t.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,h=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),f=-t.near;gr.at(1,pr),pr.w=1,pr.applyMatrix4(t.matrixWorldInverse),pr.applyMatrix4(n),pr.multiplyScalar(1/pr.w),pr.x*=r.x/2,pr.y*=r.y/2,pr.z=0,wd.copy(pr),Td.multiplyMatrices(t.matrixWorldInverse,a);for(let m=0,d=u;m<d;m++){if(Wi.fromBufferAttribute(l,m),Xi.fromBufferAttribute(h,m),Wi.w=1,Xi.w=1,Wi.applyMatrix4(Td),Xi.applyMatrix4(Td),Wi.z>f&&Xi.z>f)continue;if(Wi.z>f){let M=Wi.z-Xi.z,P=(Wi.z-f)/M;Wi.lerp(Xi,P)}else if(Xi.z>f){let M=Xi.z-Wi.z,P=(Xi.z-f)/M;Xi.lerp(Wi,P)}Wi.applyMatrix4(n),Xi.applyMatrix4(n),Wi.multiplyScalar(1/Wi.w),Xi.multiplyScalar(1/Xi.w),Wi.x*=r.x/2,Wi.y*=r.y/2,Xi.x*=r.x/2,Xi.y*=r.y/2,qi.start.copy(Wi),qi.start.z=0,qi.end.copy(Xi),qi.end.z=0;let _=qi.closestPointToPointParameter(wd,!0);qi.at(_,Rg);let p=Nh.lerp(Wi.z,Xi.z,_),x=p>=-1&&p<=1,A=wd.distanceTo(Rg)<Oo*.5;if(x&&A){qi.start.fromBufferAttribute(l,m),qi.end.fromBufferAttribute(h,m),qi.start.applyMatrix4(a),qi.end.applyMatrix4(a);let M=new W,P=new W;gr.distanceSqToSegment(qi.start,qi.end,P,M),e.push({point:P,pointOnLine:M,distance:gr.origin.distanceTo(P),object:i,face:null,faceIndex:m,uv:null,uv1:null})}}}var Xh=class extends Qe{constructor(t=new Ia,e=new io({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let a=0,o=0,l=e.count;a<l;a++,o+=2)Tg.fromBufferAttribute(e,a),Ag.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+Tg.distanceTo(Ag);let r=new Io(s,2,1);return t.setAttribute("instanceDistanceStart",new Qs(r,1,0)),t.setAttribute("instanceDistanceEnd",new Qs(r,1,1)),this}raycast(t,e){let n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;gr=t.ray;let a=this.matrixWorld,o=this.geometry,l=this.material;Oo=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),Wh.copy(o.boundingSphere).applyMatrix4(a);let h;if(n)h=Oo*.5;else{let f=Math.max(s.near,Wh.distanceToPoint(gr.origin));h=Cg(s,f,l.resolution)}if(Wh.radius+=h,gr.intersectsSphere(Wh)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Gh.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=Oo*.5;else{let f=Math.max(s.near,Gh.distanceToPoint(gr.origin));u=Cg(s,f,l.resolution)}Gh.expandByScalar(u),gr.intersectsBox(Gh)!==!1&&(n?lS(this,e):cS(this,s,e))}};var Da=class extends Ia{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setPositions(n),this}setColors(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setColors(n),this}fromLine(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}};var qh=class extends Xh{constructor(t=new Da,e=new io({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}};function so(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Pn,h=0;for(let u=0;u<i.length;++u){let f=i[u],m=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),m++}if(m!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(h,d,u),h+=d}}if(e){let u=0,f=[];for(let m=0;m<i.length;++m){let d=i[m].index;for(let y=0;y<d.count;++y)f.push(d.getX(y)+u);u+=i[m].attributes.position.count}l.setIndex(f)}for(let u in r){let f=Pg(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(let u in a){let f=a[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let m=0;m<f;++m){let d=[];for(let _=0;_<a[u].length;++_)d.push(a[u][_][m]);let y=Pg(d);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(y)}}return l}function Pg(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){let u=i[h];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}let a=new t(r),o=0;for(let h=0;h<i.length;++h)a.set(i[h].array,o),o+=i[h].array.length;let l=new Yn(a,e,n);return s!==void 0&&(l.gpuType=s),l}function Lg(i,t=1e-4){t=Math.max(t,Number.EPSILON);let e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),l={},h={},u=[],f=["getX","getY","getZ","getW"],m=["setX","setY","setZ","setW"];for(let A=0,M=o.length;A<M;A++){let P=o[A],C=i.attributes[P];l[P]=new Yn(new C.array.constructor(C.count*C.itemSize),C.itemSize,C.normalized);let T=i.morphAttributes[P];T&&(h[P]=new Yn(new T.array.constructor(T.count*T.itemSize),T.itemSize,T.normalized))}let d=t*.5,y=Math.log10(1/t),_=Math.pow(10,y),p=d*_;for(let A=0;A<r;A++){let M=n?n.getX(A):A,P="";for(let C=0,T=o.length;C<T;C++){let D=o[C],Y=i.getAttribute(D),R=Y.itemSize;for(let E=0;E<R;E++)P+=`${~~(Y[f[E]](M)*_+p)},`}if(P in e)u.push(e[P]);else{for(let C=0,T=o.length;C<T;C++){let D=o[C],Y=i.getAttribute(D),R=i.morphAttributes[D],E=Y.itemSize,st=l[D],mt=h[D];for(let Qt=0;Qt<E;Qt++){let tt=f[Qt],lt=m[Qt];if(st[lt](a,Y[tt](M)),R)for(let bt=0,qt=R.length;bt<qt;bt++)mt[bt][lt](a,R[bt][tt](M))}}e[P]=a,u.push(a),a++}}let x=i.clone();for(let A in i.attributes){let M=l[A];if(x.setAttribute(A,new Yn(M.array.slice(0,a*M.itemSize),M.itemSize,M.normalized)),A in h)for(let P=0;P<h[A].length;P++){let C=h[A][P];x.morphAttributes[A][P]=new Yn(C.array.slice(0,a*C.itemSize),C.itemSize,C.normalized)}}return x.setIndex(u),x}var Ad=new W(-.4,.85,.35).normalize();function Yh(i,t,e=0,n=0,s=0){let r=i.index?i.toNonIndexed():i;r.deleteAttribute("uv"),r.translate(e,n,s),r.computeVertexNormals();let a=new fn(t),o=r.attributes.normal,l=new Float32Array(o.count*3);for(let h=0;h<o.count;h++){let u=.62+.38*Math.max(0,o.getX(h)*Ad.x+o.getY(h)*Ad.y+o.getZ(h)*Ad.z);l[h*3]=a.r*u,l[h*3+1]=a.g*u,l[h*3+2]=a.b*u}return r.deleteAttribute("normal"),r.setAttribute("color",new Yn(l,3)),r}var ii=(i,t,e,n,s,r,a)=>Yh(new Ei(i,t,e),n,s,r,a),Ig="#e2862b",hS="#f0c8a0",uS="#3b4a63",fS="#7c5b3c",Dg="#f3e6c4",Fo="#466266",Ng="#943f2d",Og="#eee8d8",Ug="#2e6fd0",dS="#7a4fc9",Rd="#26282a";function pS(i){let t=new Cn;t.add(new Qe(so([ii(.3,.36,.19,Ig,0,.64,0),ii(.22,.27,.1,fS,0,.66,.14),ii(.08,.33,.1,"#d27a22",-.195,.625,0),ii(.08,.33,.1,"#d27a22",.195,.625,0),Yh(new Gi(.115,8,6),hS,0,.91,0),Yh(new Vi(.17,.17,.025,10),Dg,0,.975,0),Yh(new Vi(.09,.11,.08,10),Dg,0,1.02,0)]),i));let e=s=>{let r=new Qe(ii(.11,.44,.13,uS,0,-.22,0),i);return r.position.set(s,.46,0),t.add(r),r},n=[e(-.075),e(.075)];return{group:t,px:34,real:1.65,base:[Ig,1,1],box:[-.32,-1.12,.32,.22],swing(s){n[0].rotation.x=s*.55,n[1].rotation.x=-s*.55}}}function mS(i){let t=new Cn;return t.add(new Qe(so([ii(.34,.27,1,Ug,0,.195,0),ii(.352,.1,.8,Fo,0,.255,.04),ii(.3,.11,.02,Fo,0,.25,-.505),ii(.26,.09,.02,Fo,0,.26,.505),ii(.351,.025,.98,"#f7f5ee",0,.13,0),ii(.28,.03,.86,"#d9e6f7",0,.345,.02),ii(.36,.1,.14,Rd,0,.06,-.32),ii(.36,.1,.14,Rd,0,.06,.32),ii(.05,.03,.01,"#ffe9a8",-.11,.12,-.505),ii(.05,.03,.01,"#ffe9a8",.11,.12,-.505)]),i)),{group:t,px:64,real:11,base:[Ug,1.05,1.55],pitch:!0,box:[-.55,-.5,.55,.28]}}function gS(i){let t=new Cn;return t.add(new Qe(so([ii(.3,.3,.8,Og,0,.21,0),ii(.312,.12,.7,Fo,0,.25,0),ii(.26,.1,.012,Fo,0,.25,-.405),ii(.26,.1,.012,Fo,0,.25,.405),ii(.32,.05,.84,Ng,0,.385,0),ii(.24,.06,.6,Rd,0,.03,0)]),i)),{group:t,px:64,real:13,base:[dS,.95,1.3],pitch:!0,box:[-.5,-.55,.5,.28]}}function xS(i){let t=new Cn;return t.add(new Qe(so([ii(.12,.07,.2,"#3e514c",0,-.035,0),ii(.035,.24,.035,"#594937",0,-.19,0),ii(.44,.38,.38,Ng,0,-.5,0),ii(.452,.14,.392,Fo,0,-.46,0),ii(.36,.04,.32,Og,0,-.29,0)]),i)),{group:t,px:76,real:3.8,box:[-.3,-.12,.3,.72]}}function Fg(i){let t=new Cn;t.visible=!1,t.renderOrder=1e6,i.add(t);let e=new os({vertexColors:!0,transparent:!0,fog:!1,toneMapped:!1}),n=new os({vertexColors:!0,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}),s=(p,x,A)=>{let M=new fn(x),P=p.attributes.position.count,C=new Float32Array(P*4);for(let T=0;T<P;T++)C.set([M.r,M.g,M.b,A],T*4);return p.deleteAttribute("uv"),p.deleteAttribute("normal"),p.setAttribute("color",new Yn(C,4)),p},r=([p,x,A])=>new Qe(so([s(new xh(.34,24),p,.32),s(new _h(.34,.42,24),"#ffffff",.92)]).rotateX(-Math.PI/2).scale(x,1,A).translate(0,.005,0),n),a={walk:pS(e),bus:mS(e),funicular:gS(e),cable:xS(e)};for(let p of Object.values(a))p.group.rotation.order="YXZ",p.group.visible=!1,t.add(p.group),p.base&&p.group.add(r(p.base));let o=-1,l=p=>{let x=p.info.render.frame;x!==o&&(o=x,p.state.buffers.depth.setMask(!0),p.clearDepth())};t.traverse(p=>{p.isGroup?p.renderOrder=1e6:p.isMesh&&(p.onBeforeRender=l,p.renderOrder=p.material===e?1:0)});let h=null,u=0,f=null,m=0,d=0,y=0,_=new W;return{get visible(){return t.visible},get mode(){return h},show(p,x){p!==h&&(h&&(a[h].group.visible=!1),h=p,a[h].group.visible=!0,t.visible=!0,u=x)},hide(){h&&(a[h].group.visible=!1),t.visible=!1,h=null,f=null,d=0},update(p,x,A,M,P,C,T){if(!h)return;let D=a[h],Y=Math.min(1,(P-u)/320),R=Y<1?.35+.65*(1+2.2*(Y-1)**3+1.2*(Y-1)**2):1,E=Math.max(D.real,D.px/T);if(y=E*T,t.position.copy(p),t.scale.setScalar(E*R),x!==null)if(f===null)f=x;else{let st=Math.atan2(Math.sin(x-f),Math.cos(x-f));f+=st*Math.min(1,C*10)}d+=((M?1:0)-d)*Math.min(1,C*8),M&&(m+=C*Math.PI*2*2.3),D.group.rotation.set(D.pitch?Math.max(-.5,Math.min(.5,A)):0,-(f??0),h==="cable"?Math.sin(P/320)*.05*d:0),D.swing?.(Math.sin(m)*d)},screenBox(p,x,A){if(!t.visible||!h||(_.copy(t.position).project(p),_.z<-1||_.z>1))return null;let M=(_.x+1)/2*x,P=(1-_.y)/2*A,C=a[h].box,T=y;return[M+C[0]*T,P+C[1]*T,M+C[2]*T,P+C[3]*T]}}}var Bg={walk:{name:"\u6B65\u884C",color:"#e2862b"},funicular:{name:"\u7F06\u8F66",color:"#7a4fc9"},cable:{name:"\u7D22\u9053",color:"#7a4fc9"},bus:{name:"\u666F\u4EA4\u8F66",color:"#2e6fd0"}},Cd={walk:1,funicular:1.3,cable:1.6,bus:2.5},yS={walk:1,funicular:1.3,cable:1.6,bus:2.4},_S='<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-7.5L14 16v5M8 12l2-4.5 3-.5 2.5 3.5L18 11M10.5 7.8 9 13"/></svg>',vS='<svg viewBox="0 0 24 24"><path d="M3 5.5 21 3M12 4.3V8M6.5 8h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16.5v-7A1.5 1.5 0 0 1 6.5 8zM5 12.5h14"/></svg>',MS='<svg viewBox="0 0 24 24"><rect x="4.5" y="3.5" width="15" height="15" rx="2.5"/><path d="M4.5 11h15M8 18.5V21M16 18.5V21"/><circle cx="8.5" cy="15" r=".9"/><circle cx="15.5" cy="15" r=".9"/></svg>',Pd='<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>',zg='<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',bS='<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',Ua=i=>i>=1e3?`${(i/1e3).toFixed(1)} \u516C\u91CC`:`${Math.round(i/10)*10} \u7C73`;function Ke(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function kg(i){let{routes:t,world:e,camera:n,controls:s,hAt:r,realH:a=nt=>nt,fly:o,pose:l,cancelFlight:h,openPanel:u,closeSheetsForRoute:f,onFrame:m,isMobile:d,visibleRect:y}=i,_=document.querySelector("#route-list"),p=document.querySelector("#route-detail"),x=document.querySelector("#route-hud"),A=x.querySelector(".rh-stops"),M=x.querySelector(".rh-bar i"),P=new Cn;P.renderOrder=5,e.add(P);let C=[],T=null,D=[],Y=[],R=null,E=null,st=-1,mt=null,Qt=()=>{clearTimeout(mt),mt=null};function tt(nt){let ft=nt.pts,Kt=[],ee=nt.mode==="cable"?22:2.6,ne=r(...ft[0])+ee,ht=r(...ft.at(-1))+ee,V=0,Dt=[];for(let re=1;re<ft.length;re++){let ce=Math.hypot(ft[re][0]-ft[re-1][0],ft[re][1]-ft[re-1][1]);Dt.push(ce),V+=ce}let Ht=0;for(let re=0;re<ft.length;re++)if(re>0){let[ce,De]=ft[re-1],[te,Ue]=ft[re],He=Dt[re-1],Ne=Math.max(1,Math.ceil(He/6));for(let on=1;on<=Ne;on++){let un=on/Ne,mn=ce+(te-ce)*un,Rn=De+(Ue-De)*un,Tn=Ht+He*un,Fn=r(mn,Rn)+2.6,ci=nt.mode==="cable"?Math.max(Fn+12,ne+(ht-ne)*(Tn/V)):Fn;Kt.push(new W(mn,ci,Rn))}Ht+=He}else Kt.push(new W(ft[0][0],nt.mode==="cable"?ne:r(...ft[0])+2.6,ft[0][1]));return Kt}function lt(nt,ft,Kt,ee={}){let ne=new Da;ne.setPositions(nt.flatMap(Dt=>[Dt.x,Dt.y,Dt.z]));let ht=new io({color:ft,linewidth:Kt,transparent:!0,opacity:ee.opacity??1,depthTest:ee.depthTest??!0,depthWrite:!1,dashed:!!ee.dashed,dashSize:9,gapSize:7});ht.resolution.set(innerWidth,innerHeight),C.push(ht);let V=new qh(ne,ht);return ee.dashed&&V.computeLineDistances(),V.renderOrder=ee.order??5,V.frustumCulled=!1,P.add(V),V}addEventListener("resize",()=>{for(let nt of C)nt.resolution.set(innerWidth,innerHeight)});function bt(nt){qt();let ft=[];nt.legs.forEach((ne,ht)=>ne.parts.forEach(V=>{let Dt=Bg[V.mode].color,Ht=V.mode!=="walk",re=V.segments||[{pts:V.pts,estimated:!1}];for(let ce of re){let De=tt({...V,pts:ce.pts}),te=ce.estimated,Ue={dashed:Ht||te};lt(De,Dt,4,{...Ue,depthTest:!1,opacity:.38,order:4}),lt(De,"#ffffff",8.5,{...Ue,order:5}),lt(De,Dt,5,{...Ue,opacity:te?.75:1,order:6});for(let He of De)ft.push({p:He,mode:V.mode,leg:ht})}}));let Kt=new Map;nt.stops.forEach((ne,ht)=>{Kt.has(ne.place)||Kt.set(ne.place,{s:ne,idx:[]}),Kt.get(ne.place).idx.push(ht)});let ee=nt.stops.length-1;for(let{s:ne,idx:ht}of Kt.values()){let V=Ke("div","maplabel route-stop"+(ht.includes(0)?" start":ht.includes(ee)?" end":"")),Dt=Ke("button"),Ht=Ke("span","rs-name",ne.n);Dt.type="button",Dt.title=ne.n,Dt.tabIndex=-1,Dt.append(Ke("span","rs-num"+(ht.length>1?" multi":""),ht.map(De=>De+1).join("\xB7")),Ht),Dt.onclick=()=>Ie(ht[0]);let re=Ke("i");V.append(Dt,re);let ce=new No(V);ce.center.set(.5,1),ce.position.set(ne.x,r(ne.x,ne.z)+9,ne.z),P.add(ce);for(let De of ht)D[De]=V;Y.push({box:V,b:Dt,name:Ht,stem:re,label:ce,lift:0,rank:ht.includes(0)||ht.includes(ee)?1:2+ht[0]/100})}Jt="",R=ge(nt,ft),document.body.classList.add("route-on")}function qt(){for(let nt of[...P.children])P.remove(nt),nt.isLine2&&(nt.geometry.dispose(),nt.material.dispose()),nt.isCSS2DObject&&nt.element.remove();C.length=0,D=[],Y=[],R=null,document.body.classList.remove("route-on")}let Jt="",Tt=0,$t=null,le=[],Me=-1e9,Ct=new W;function Bt(nt){if(!Y.length)return!1;n.updateMatrixWorld();let ft=n.matrixWorld.elements.map(te=>te.toFixed(1)).join()+n.projectionMatrix.elements.join()+innerWidth+"x"+innerHeight+":"+st+":"+(et.mode??"");if(ft===Jt&&nt-Tt<500)return!1;(!$t||nt-Me>=500)&&($t=y(),le=i.covers?.()??[],Me=nt),Jt=ft,Tt=nt;let Kt=$t,ee=innerWidth,ne=innerHeight,ht=[],V=[],Dt=D[st],Ht=(te,Ue)=>Ue.some(He=>te[0]<He[2]&&te[2]>He[0]&&te[1]<He[3]&&te[3]>He[1]),re=(te,Ue)=>[te[0]+Ue,te[1]+Ue,te[2]-Ue,te[3]-Ue],ce=[...Y].sort((te,Ue)=>(Ue.box===Dt)-(te.box===Dt)||te.rank-Ue.rank),De=et.screenBox(n,ee,ne);De&&ht.push(De);for(let te of ce){!te.bh&&te.b.offsetHeight&&(te.bw=te.b.offsetWidth,te.bh=te.b.offsetHeight,te.h=te.box.offsetHeight-te.lift,te.nw=te.name.offsetWidth,te.nh=te.name.offsetHeight),te.label.getWorldPosition(Ct).project(n),te.on=Ct.z>-1&&Ct.z<1;let Ue=te.bw||26,He=te.bh||26,Ne=(Ct.x+1)/2*ee,on=(1-Ct.y)/2*ne-(te.h||36)+He/2,un=Rn=>[Ne-Ue/2,on-Rn-He/2,Ne+Ue/2,on-Rn+He/2],mn=0;if(te.on){let Rn=un(0),Tn=ht.filter(ci=>Ht(re(Rn,6),[ci])),Fn=Tn.length?Math.max(...Tn.map(ci=>Rn[3]-ci[1]+2)):0;Fn&&Fn<=2*He+6&&un(Fn)[1]>=Kt.top&&!Ht(re(un(Fn),4),ht)&&!Ht(un(Fn),le)&&(mn=Math.round(Fn))}te.dot=un(mn),te.on&&ht.push(te.dot),te.stemBox=te.on?[Ne-4,te.dot[3],Ne+4,(1-Ct.y)/2*ne+5]:null,te.stemBox&&V.push(te.stemBox),mn!==te.lift&&(te.lift=mn,te.stem.style.height=mn?`${10+mn}px`:""),te.box.classList.toggle("veiled",!!De&&te.on&&Ht([Ne-4,te.dot[3],Ne+4,(1-Ct.y)/2*ne+6],[De]))}for(let te of ce){let Ue=0;if(te.on){let He=te.nw||[...te.name.textContent].length*12+20,Ne=te.nh||22,[on,un,mn,Rn]=te.dot,Tn=(un+Rn)/2,Fn=[[mn+3,Tn-Ne/2,mn+3+He,Tn+Ne/2],[on-3-He,Tn-Ne/2,on-3,Tn+Ne/2]],ci=_n=>_n[0]>=Kt.left+4&&_n[2]<=Kt.right-4&&_n[1]>=Kt.top+2&&_n[3]<=Kt.bottom-2,Fs=V.filter(_n=>_n!==te.stemBox),as=_n=>ci(_n)&&!Ht(_n,le),Ln=Fn.findIndex(_n=>as(_n)&&!Ht(_n,ht)&&!Ht(_n,Fs));Ln<0&&te.box===Dt&&(Ln=Fn.findIndex(_n=>as(_n)&&!(De&&Ht(_n,[De]))),Ln<0&&(Ln=Fn.findIndex(as)),Ln<0&&(Ln=Fn.findIndex(ci)),Ln<0&&(Ln=Math.max(0,Fn.findIndex(_n=>_n[0]>=0&&_n[2]<=ee)))),Ln>=0&&(Ue=Ln?-1:1,ht.push(Fn[Ln]))}te.box.classList.toggle("named",Ue!==0),te.box.classList.toggle("flip",Ue===-1)}return!0}function ge(nt,ft){let Kt=[],ee=[],ne=[],ht=0;ft.forEach((re,ce)=>{ce&&(ht+=re.p.distanceTo(ft[ce-1].p)/Cd[re.mode]),Kt.push(re.p),ee.push(ht),ne.push(re.mode)});let V=nt.stops.map((re,ce)=>{if(ce===0)return 0;let De=0,te=1/0,Ue=ft.findLastIndex(He=>He.leg===ce-1);for(let He=Math.max(0,Ue-40);He<=Ue;He++){let Ne=Math.hypot(Kt[He].x-re.x,Kt[He].z-re.z);Ne<te&&(te=Ne,De=He)}return ee[De]}),Dt=nt.legs.map((re,ce)=>ee[ft.findLastIndex(De=>De.leg===ce)]),Ht=[];for(let re=1;re<ft.length;re++)ft[re].mode!==ft[re-1].mode&&ft[re].leg===ft[re-1].leg&&Ht.push(ee[re-1]);return{pts:Kt,cum:ee,modes:ne,total:ht,stopAt:V,legEnd:Dt,switches:Ht}}function Re(nt,ft){let{pts:Kt,cum:ee}=nt,ne=0,ht=ee.length-1;if(ft<=0)return Kt[0].clone();if(ft>=ee[ht])return Kt[ht].clone();for(;ht-ne>1;){let Dt=ne+ht>>1;ee[Dt]<=ft?ne=Dt:ht=Dt}let V=(ft-ee[ne])/Math.max(1e-6,ee[ht]-ee[ne]);return Kt[ne].clone().lerp(Kt[ht],V)}function Pe(nt,ft){let{cum:Kt,modes:ee}=nt,ne=0,ht=Kt.length-1;if(ft>=Kt[ht])return ee[ht];for(;ht-ne>1;){let V=ne+ht>>1;Kt[V]<=ft?ne=V:ht=V}return ee[ht]}function Xe(nt){let ft=[];nt.legs.forEach(Ln=>Ln.parts.forEach(_n=>_n.pts.forEach(([Bs,z],gt)=>{(gt%3===0||gt===_n.pts.length-1)&&ft.push([Bs,z,8,0,0])}))),nt.stops.forEach(Ln=>ft.push([Ln.x,Ln.z,9,15,38]));let Kt=ft.length,ee=ft.reduce((Ln,_n)=>Ln+_n[0],0)/Kt,ne=ft.reduce((Ln,_n)=>Ln+_n[1],0)/Kt,ht=0,V=0,Dt=0;for(let[Ln,_n]of ft)ht+=(Ln-ee)**2,V+=(_n-ne)**2,Dt+=(Ln-ee)*(_n-ne);let Ht=Math.atan2(2*Dt,ht-V)/2*180/Math.PI;for(;Ht-25>90;)Ht-=180;for(;25-Ht>90;)Ht+=180;let re=52,ce=y(),De=innerWidth,te=innerHeight,Ue=22,He=16,Ne={w:ce.right-ce.left,h:ce.bottom-ce.top},on=(ce.left+ce.right)/2+ce.shiftX,un=(ce.top+ce.bottom)/2+ce.shiftY,mn=new Hi(43,De/te,1,6e4),Rn=new W,Tn=new W,Fn=new W,ci=ee,Fs=ne,as=1600;for(let Ln=0;Ln<30;Ln++){let _n=l(ci,Fs,as,Ht,re);mn.position.copy(_n.pos),mn.lookAt(_n.target),mn.updateMatrixWorld();let Bs=1/0,z=-1/0,gt=1/0,Pt=-1/0;for(let[an,dn,ln,hn,Hn]of ft){Rn.set(an,(r(an,dn)+ln)*e.scale.y,dn).project(mn);let wi=(Rn.x+1)/2*De,$n=(1-Rn.y)/2*te;Bs=Math.min(Bs,wi-hn),z=Math.max(z,wi+hn),gt=Math.min(gt,$n-Hn),Pt=Math.max(Pt,$n)}let Ot=Math.max((z-Bs)/Math.max(80,Ne.w-2*Ue),(Pt-gt)/Math.max(60,Ne.h-2*He)),Lt=2*as*Math.tan(43*Math.PI/360)/te,Le=(Bs+z)/2-on,$e=(gt+Pt)/2-un;Tn.setFromMatrixColumn(mn.matrixWorld,0).setY(0).normalize(),Fn.setFromMatrixColumn(mn.matrixWorld,2).negate().setY(0).normalize();let tn=Lt/Math.cos(re*Math.PI/180);if(ci+=(Tn.x*Le*Lt-Fn.x*$e*tn)*.85,Fs+=(Tn.z*Le*Lt-Fn.z*$e*tn)*.85,as=Math.min(12e3,Math.max(250,as*Math.min(1.8,Math.max(.55,Ot)))),Math.abs(Ot-1)<.01&&Math.abs(Le)<2&&Math.abs($e)<2)break}return l(ci,Fs,as*1.06,Ht,re)}function Ze(){if(ke(),!T)return;let nt=Xe(T);o(nt,1500)}function Ie(nt){if(!T)return;ke();let ft=T.stops[nt];o(l(ft.x,ft.z,T.id==="tiantai-classic"?420:260,25,55),1300),Be(nt)}function Be(nt){st=nt;for(let ft of new Set(D))ft.classList.toggle("active",ft===D[nt]);p.querySelectorAll(".rs-stop").forEach(ft=>ft.classList.toggle("active",+ft.dataset.i===nt)),ve()}let et=Fg(i.scene??e.parent??e),Se={walk:"\u6B65\u884C",bus:"\u4E58\u666F\u4EA4\u8F66",funicular:"\u4E58\u7F06\u8F66",cable:"\u4E58\u7D22\u9053"},ct={bus:"\u666F\u4EA4\u8F66",funicular:"\u7F06\u8F66",cable:"\u7D22\u9053"},ye=(nt,ft)=>ft==="walk"?`\u4E0B${nt==="bus"?"\u8F66":ct[nt]}\u6B65\u884C`:nt==="walk"?`\u4E58${ct[ft]}`:`\u6362\u4E58${ct[ft]}`;function jt(){if(!T||!R)return;Qt(),h(),f(),s.stopMotion?.();let nt=Math.min(50,Math.max(22,R.total/90)),ft=T.id==="tiantai-classic"?430:250;E??={s:0,speed:R.total/nt,pause:1.2,stop:0,heading:null,dist:ft,camDist:ft},E.paused=!1,Be(E.stop),ve()}function ke(){Qt(),!(!E||E.paused)&&(E.paused=!0,ve())}function be(nt){if(E.pause>0)E.pause-=nt,E.pause<=0&&(E.switching=!1);else{let Ne=E.s,on=E.stop+1,un=on<R.stopAt.length?R.stopAt[on]:1/0,mn=Math.min(R.total,Ne+E.speed*nt),Rn=R.switches.find(Tn=>Tn>Ne&&Tn<=mn&&Tn<un);Rn!==void 0?(mn=Rn,E.pause=.8,E.switching=!0):mn>=un&&(mn=un,E.stop=on,E.pause=1.1),E.s=mn,E.stop===on&&Be(on)}let ft=Pe(R,E.s),Kt=Cd[ft];E.camDist+=(E.dist*yS[O()]-E.camDist)*Math.min(1,nt*.7);let ee=E.camDist/E.dist,ne=Re(R,E.s),ht=Re(R,E.s+Math.min(160*(E.speed/90),400*ee/Kt)),V=Math.atan2(ht.x-ne.x,-(ht.z-ne.z));E.heading===null&&(E.heading=V);let Dt=V-E.heading;Dt=Math.atan2(Math.sin(Dt),Math.cos(Dt)),E.heading+=Dt*Math.min(1,nt*1.6/ee);let Ht=ne.y*e.scale.y,re=57*Math.PI/180,ce=E.camDist,De=new W(ne.x,Ht,ne.z),te=De.clone().add(new W(-Math.sin(E.heading)*ce*Math.sin(re),ce*Math.cos(re),Math.cos(E.heading)*ce*Math.sin(re))),Ue=Math.min(1,nt*3.2*Kt/ee);s.target.lerp(De,Ue),n.position.lerp(te,Ue);let He=E.pause<=0&&E.stop+1<R.stopAt.length;He!==E.moving&&(E.moving=He,He&&(E.swapped=!1),ve()),ae(E.s/R.total),E.s>=R.total&&E.pause<=0&&(E=null,Be(-1),ve(!0),mt=setTimeout(()=>{mt=null,u("routes"),p.scrollTop=0,Ze()},400))}function O(){let nt=E.stop,ft=T.legs[nt];return ft&&nt>0&&E.s<=R.legEnd[nt-1]?ft.parts[0].mode:Pe(R,E.s)}let I=new W;function yt(nt,ft){let Kt=O();Kt!==E.mode&&(E.fromMode=E.mode,E.mode=Kt,E.swapped=!!E.fromMode,et.show(Kt,nt),ve());let ee=Re(R,E.s),ne=r(ee.x,ee.z);I.set(ee.x,(Kt==="cable"?Math.max(ee.y,ne+20):ne+2.6)*e.scale.y,ee.z);let ht=10/Cd[Kt],V=Re(R,Math.max(0,E.s-ht)),Dt=Re(R,Math.min(R.total,E.s+ht)),Ht=Math.hypot(Dt.x-V.x,Dt.z-V.z),re=Ht>1?Math.atan2(Dt.x-V.x,-(Dt.z-V.z)):null,ce=Ht>1?Math.atan2((Dt.y-V.y)*e.scale.y,Ht):0,De=innerHeight/(2*Math.max(1,n.position.distanceTo(I))*Math.tan(43*Math.PI/360));et.update(I,re,ce,!E.paused&&E.pause<=0,nt,ft,De)}m((nt,ft)=>{if(!E||!R){et.visible&&et.hide();return}let Kt=Math.min(ft,64)/1e3;E.paused||be(Kt),E&&yt(nt,Kt)}),s.addEventListener("gesturestart",ke);function me(nt){let ft=Ke("button","route-card"+(nt.featured?" featured":""));return ft.type="button",ft.append(Ke("span","rc-by",nt.by),Ke("strong","",nt.name),Ke("span","rc-meta",`${nt.duration} \xB7 \u6B65\u884C ${Ua(nt.walkM)} \xB7 \u722C\u5347 ${nt.climb} \u7C73`)),nt.fit&&ft.append(Ke("span","rc-fit","\u9002\u5408\uFF1A"+nt.fit)),ft.append(Ke("span","rc-path",nt.stops.map(Kt=>Kt.n).filter((Kt,ee,ne)=>ne.indexOf(Kt)===ee).join(" \u2192 "))),ft.onclick=()=>je(nt.id),ft}function de(){_.replaceChildren(...t.map(me))}function ue(nt){let ft=[],Kt=[],ee=[],ne=0;nt.legs.forEach((Ne,on)=>{ee.push({s:ne,i:on}),Ne.parts.forEach(un=>{if(un.mode==="bus")return;let mn=tt(un);mn.forEach((Rn,Tn)=>{(Tn||!ft.length)&&(ft.length&&(ne+=Math.hypot(Rn.x-mn[Math.max(0,Tn-1)].x,Rn.z-mn[Math.max(0,Tn-1)].z)),ft.push(ne),Kt.push(a(Rn.y-2.6)))})})}),ee.push({s:ne,i:nt.stops.length-1});let ht=300,V=64,Dt=Math.min(...Kt),Ht=Math.max(...Kt),re=Math.max(40,Ht-Dt),ce=Ne=>Ne/Math.max(1,ne)*ht,De=Ne=>V-6-(Ne-Dt)/re*(V-16),te=ft.map((Ne,on)=>`${on?"L":"M"}${ce(Ne).toFixed(1)} ${De(Kt[on]).toFixed(1)}`).join(""),Ue=`<svg viewBox="0 0 ${ht} ${V}" preserveAspectRatio="none" aria-hidden="true"><path class="pf-area" d="${te}L${ht} ${V}L0 ${V}Z"/><path class="pf-line" d="${te}"/>${ee.map(Ne=>{let on=ft.findIndex(mn=>mn>=Ne.s),un=De(Kt[Math.max(0,on===-1?Kt.length-1:on)]);return`<circle cx="${ce(Ne.s).toFixed(1)}" cy="${un.toFixed(1)}" r="3"/>`}).join("")}</svg>`,He=Ke("div","route-profile");return He.innerHTML=Ue,He.append(Ke("span","pf-hi",`${Math.round(Ht)} \u7C73`),Ke("span","pf-lo",`${Math.round(Dt)} \u7C73`),Ke("span","pf-cap","\u6CBF\u9014\u6D77\u62D4")),He}function We(nt){let ft=nt.parts.map(ht=>ht.mode==="walk"?`\u6B65\u884C${nt.minutesBy!=="\u4F30\u7B97"&&nt.parts.length===1?"\u7EA6 "+nt.minutes:"\u7EA6 "+ht.minutes} \u5206\u949F \xB7 ${Ua(ht.m)}${ht.up>=15?` \xB7 \u4E0A\u5761 ${ht.up} \u7C73`:ht.down>=15?` \xB7 \u4E0B\u5761 ${ht.down} \u7C73`:""}`:ht.mode==="bus"?`\u5750${ht.line}\u7EA6 ${ht.minutes} \u5206\u949F \xB7 ${Ua(ht.m)}`:`\u5750${ht.line}\u7EA6 ${ht.minutes} \u5206\u949F`),Kt=nt.parts.flatMap(ht=>ht.segments||[]).filter(ht=>ht.estimated).reduce((ht,V)=>ht+V.m,0),ee=nt.parts.at(-1)?.segments?.at(-1),ne=ee?.estimated?ee.m:0;return ft.join("\uFF0C\u518D")+(Kt>=1?` \xB7 \u542B\u7EA6 ${Ua(Kt)}\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF08\u672A\u6838\u5B9E\u901A\u884C${ne>=10?`\uFF0C\u672B\u6BB5\u7EA6 ${Ua(ne)}`:""}\uFF09`:"")}function Yt(nt){let ft=nt.parts.find(Kt=>Kt.mode!=="walk")?.mode;return ft==="bus"?MS:ft?vS:_S}function we(nt){p.replaceChildren();let ft=Ke("div","route-top"),Kt=Ke("button","route-back","\u5168\u90E8\u8DEF\u7EBF");Kt.type="button",Kt.onclick=rn,ft.append(Kt,Ke("span","rc-by",nt.by));let ee=Ke("div","route-stats"),ne=nt.walkMinutes>=60?`\u7EA6 ${(nt.walkMinutes/60).toFixed(1)} \u5C0F\u65F6`:`\u7EA6 ${nt.walkMinutes} \u5206\u949F`;for(let[Ue,He]of[[nt.duration,"\u5168\u7A0B"],[Ua(nt.walkM),"\u6B65\u884C"],[ne,"\u6B65\u884C\u7528\u65F6"],[`${nt.climb} \u7C73`,"\u7D2F\u8BA1\u722C\u5347"]]){let Ne=Ke("span");Ne.append(Ke("b","",Ue),Ke("small","",He)),ee.append(Ne)}let ht=Ke("div","route-actions"),V=Ke("button","btn primary route-play");V.type="button",V.innerHTML=Pd,V.append("\u8DEF\u7EBF\u9884\u6F14"),V.onclick=()=>E&&!E.paused?ke():jt();let Dt=Ke("button","btn ghost");Dt.type="button",Dt.innerHTML=bS,Dt.append("\u770B\u5168\u7A0B"),Dt.onclick=Ze,ht.append(V,Dt);let Ht=Ke("ol","route-steps");nt.stops.forEach((Ue,He)=>{let Ne=Ke("li","rs-stop");Ne.dataset.i=He;let on=Ke("button");on.type="button",on.onclick=()=>Ie(He),on.append(Ke("span","rs-num",String(He+1)),Ke("strong","",Ue.n)),Ue.note&&on.append(Ke("small","",Ue.note)),Ne.append(on),Ht.append(Ne);let un=nt.legs[He];if(un){let mn=Ke("li","rs-leg"),Rn=Ke("span","rs-icon");Rn.innerHTML=Yt(un);let Tn=Ke("span","rs-leg-text",We(un));un.note&&Tn.append(Ke("em","",un.note)),mn.append(Rn,Tn),Ht.append(mn)}});let re=Ke("ul","route-tips");for(let Ue of nt.tips)re.append(Ke("li","",Ue));let ce=Ke("details","more");ce.append(Ke("summary","","\u8D44\u6599\u4E0E\u4F9D\u636E")),ce.append(Ke("p","","\u7EBF\u8DEF\u6CBF\u5730\u56FE\u4E0A\u7684\u6B65\u9053\u3001\u53F0\u9636\u548C\u8857\u9053\u7ED8\u5236\uFF1B\u5730\u56FE\u7F3A\u5931\u5904\u3001\u70B9\u4F4D\u5230\u8DEF\u7F51\u3001\u7A7F\u8FC7\u5E7F\u573A\u548C\u5317\u95E8\u95E8\u697C\u7B49\u5F3A\u5236\u8FDE\u63A5\u6BB5\u6309\u76F4\u7EBF\u793A\u610F\uFF08\u865A\u7EBF\uFF09\uFF0C\u4E0D\u4EE3\u8868\u5B9E\u6D4B\u6216\u5DF2\u6838\u5B9E\u53EF\u901A\u884C\u9053\u8DEF\uFF0C\u8BF7\u4EE5\u73B0\u573A\u9053\u8DEF\u4E3A\u51C6\u3002\u6B65\u884C\u65F6\u95F4\u6309\u8DDD\u79BB\u548C\u5761\u5EA6\u4F30\u7B97\uFF08\u53F0\u9636\u7528\u65F6\u589E\u52A0\u4E09\u6210\uFF09\uFF0C\u6BCF\u4E2A\u4EBA\u5FEB\u6162\u4E0D\u540C\uFF1B\u6807\u201C\u4E1A\u4E3B\u63D0\u4F9B\u201D\u7684\u4E3A\u5C45\u4E4B\u6797\u4E1A\u4E3B\u7ED9\u51FA\u7684\u65F6\u95F4\u3002\u7F06\u8F66\u3001\u7D22\u9053\u548C\u666F\u4EA4\u8F66\u7684\u4E58\u5750\u65F6\u95F4\u6309\u7EBF\u8DEF\u957F\u5EA6\u4F30\u7B97\uFF0C\u4E0D\u542B\u6392\u961F\u3002\u5F00\u653E\u548C\u8FD0\u884C\u65F6\u95F4\u4EE5\u73B0\u573A\u516C\u793A\u4E3A\u51C6\u3002"));let De=Ke("div","links");for(let Ue of nt.sources)if(Ue.url){let He=Ke("a","",Ue.name);He.href=Ue.url,He.target="_blank",He.rel="noopener",De.append(He)}else De.append(Ke("span","",Ue.name));ce.append(De);let te=Ke("p","route-summary route-legend","\u6A59\u8272\u5B9E\u7EBF\uFF1A\u5730\u56FE\u6B65\u9053\uFF1B\u6A59\u8272\u865A\u7EBF\uFF1A\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF0C\u672A\u6838\u5B9E\u53EF\u901A\u884C\uFF1B\u84DD\uFF0F\u7D2B\u865A\u7EBF\uFF1A\u4E58\u8F66\u6BB5\uFF08\u5176\u4E2D\u76F4\u7EBF\u63A5\u9A73\u89C1\u884C\u7A0B\u63D0\u793A\uFF09\u3002");p.append(ft,Ke("h3","route-title",nt.name),ee,ht,te,Ke("p","route-summary",nt.summary),ue(nt),Ht,Ke("h4","","\u51FA\u53D1\u524D\u770B\u770B"),re,ce),p.scrollTop=0}function je(nt){let ft=t.find(ee=>ee.id===nt);if(!ft)return;ke(),E=null,T=ft,st=-1,u("routes"),_.hidden=!0,p.hidden=!1,we(ft),bt(ft),yn(ft),G="",ve();let Kt=Xe(ft);o(Kt,1600),p.focus?.({preventScroll:!0})}function rn(){let nt=T,ft=p.contains(document.activeElement);ke(),h(),E=null,T=null,qt(),A.replaceChildren(),p.hidden=!0,_.hidden=!1,ve(),ft&&nt&&_.children[t.indexOf(nt)]?.focus?.({preventScroll:!0})}function pe(nt){let ft=nt.parts.find(Kt=>Kt.mode!=="walk");return`${ft?Bg[ft.mode].name:"\u6B65\u884C"} ${nt.minutes} \u5206\u949F`}function yn(nt){A.replaceChildren(),nt.stops.forEach((ft,Kt)=>{let ee=Ke("li","rh-stop"+(Kt===0?" start":Kt===nt.stops.length-1?" end":""));ee.dataset.i=Kt;let ne=Ke("button");ne.type="button",ne.onclick=()=>Ie(Kt),ne.append(Ke("span","rs-num",String(Kt+1)),Ke("span","rh-name",ft.n)),ee.append(ne),A.append(ee);let ht=nt.legs[Kt];if(ht){let V=Ke("li","rh-leg");V.dataset.i=Kt;let Dt=Ke("span","rs-icon");Dt.innerHTML=Yt(ht),V.append(Dt,Ke("span","",pe(ht))),A.append(V)}})}let G="";function ae(nt){M.style.transform=`scaleX(${Math.max(0,Math.min(1,nt)).toFixed(4)})`}function ve(nt){i.onPlaybackChange?.();let ft=!!E&&!E.paused,Kt=ft?"\u6682\u505C\u9884\u6F14":E?"\u7EE7\u7EED\u9884\u6F14":"\u8DEF\u7EBF\u9884\u6F14",ee=p.querySelector(".route-play");if(ee&&(ee.innerHTML=ft?zg:Pd,ee.append(Kt)),!T){x.hidden=!0;return}let ne=T.stops.length,ht=E?E.stop:st,V=!!E?.moving,Dt=T.stops[Math.max(0,ht)],Ht=T.stops[ht+1];x.querySelector("b").textContent=T.short;let re=(te,Ue,He)=>{let Ne=Ke("span","rh-where",te),on=Ue?He?[Ke("span","rh-note",Ue),Ne]:[Ne,Ke("span","rh-note",Ue)]:[Ne];E?.paused&&on.unshift(Ke("span","rh-note","\u5DF2\u6682\u505C \xB7\xA0")),x.querySelector("small").replaceChildren(...on)};E?V&&Ht?re(`${Se[E.mode]??"\u6B63\u5728"}\u524D\u5F80 ${Ht.n}`):E.switching&&Ht?re(`\xA0\xB7 \u524D\u5F80 ${Ht.n}`,ye(E.fromMode,E.mode),!0):re(ht===0?`\u4ECE ${Dt.n} \u51FA\u53D1`:`${ht+1}/${ne} \u5230\u8FBE ${Dt.n}`,E.swapped?`\xA0\xB7 ${ye(E.fromMode,E.mode)}`:""):re(ht>=0?`${ht+1}/${ne} \xB7 ${Dt.n}`:nt?"\u9884\u6F14\u5B8C\u6BD5 \xB7 \u53EF\u518D\u770B\u4E00\u6B21":`${ne} \u7AD9 \xB7 ${T.duration} \xB7 \u70B9 \u25B6 \u5F00\u59CB\u9884\u6F14`);let ce=x.querySelector(".rh-play");ce.innerHTML=ft?zg:Pd,ce.setAttribute("aria-label",Kt),x.hidden=!1,x.classList.toggle("playing",ft),x.classList.toggle("live",!!E);for(let te of A.children){let Ue=+te.dataset.i,He=te.classList.contains("rh-stop");te.classList.toggle("done",!!nt||Ue<ht),He?(te.classList.toggle("current",Ue===ht),te.classList.toggle("next",!!E&&Ue===ht+1)):te.classList.toggle("moving",V&&Ue===ht)}ae(E?E.s/R.total:nt?1:ht>=0&&R?R.stopAt[ht]/R.total:0);let De=`${T.id}:${ht}:${!!E}`;if(De!==G&&x.offsetParent){G=De;let te=A.querySelector(`.rh-stop[data-i="${Math.max(0,ht)}"]`);if(te){let Ue=parseFloat(globalThis.getComputedStyle?.(A).paddingLeft??12);A.scrollTo?.({left:Math.max(0,te.offsetLeft-Ue),behavior:globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}}return x.querySelector(".rh-play").onclick=()=>E&&!E.paused?ke():jt(),x.querySelector(".rh-list").onclick=()=>{ke(),u("routes")},x.querySelector(".rh-close").onclick=rn,addEventListener("keydown",nt=>{nt.key==="Escape"&&E&&ke()}),de(),{open:je,close:rn,stopPreview:ke,startPreview:jt,updateLabels:Bt,get labelObjects(){return Y.map(nt=>nt.label)},get active(){return T},get previewing(){return!!E&&!E.paused},get canResume(){return!!E?.paused}}}var SS={\u53F2\u6599:"history",\u4FE1\u4EF0:"belief",\u4F20\u8BF4:"legend",\u5EFA\u7B51:"building",\u5730\u8C8C:"building",\u63D0\u793A:"tip"};function li(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function Ld(i){return li("span","kind k-"+(SS[i]||"tip"),i)}var ES=i=>/^1\d{10}$/.test(i)?`${i.slice(0,3)} ${i.slice(3,7)} ${i.slice(7)}`:i;function wS(i){let t=li("p","guide-src");return t.append(li("span","","\u6765\u6E90\uFF1A")),i.forEach((e,n)=>{let s=li("a","",e.name);s.href=e.url,s.target="_blank",s.rel="noopener",t.append(s),n<i.length-1&&t.append("\uFF1B")}),t}function Hg(i){let t=li("dl","guide-rows");for(let[e,n]of i)t.append(li("dt","",e),li("dd","",n));return t}function Vg(i,t){let e=i.guide;if(!e){t.replaceChildren(li("p","empty","\u6E38\u89C8\u987B\u77E5\u6682\u65F6\u6CA1\u6709\u52A0\u8F7D\uFF0C\u5237\u65B0\u9875\u9762\u518D\u8BD5\u3002"));return}t.replaceChildren(li("p","guide-intro",`\u51FA\u53D1\u524D\u770B\u770B \xB7 \u5B98\u65B9\u8D44\u6599 ${e.verified} \u6838\u9A8C`));for(let n of e.sections){let s=li("details","guide-sec"),r=li("summary"),a=li("div","guide-body");s.dataset.id=n.id,r.append(li("b","",n.title),li("small","",n.teaser)),s.append(r,a);for(let[o,l]of n.paras||[]){let h=li("p","story");h.append(Ld(o),l),a.append(h)}if(n.rows?.length&&a.append(Hg(n.rows)),n.transitHours&&i.transit&&a.append(li("h4","","\u8FD0\u8425\u65F6\u95F4"),Hg([...i.transit.routes.map(o=>[o.name,o.hours]),...i.transit.cableways.map(o=>[o.name,o.hours+(o.phone?` \xB7 \u54A8\u8BE2 ${o.phone}`:"")])])),n.items?.length){let o=li("ul","guide-list");for(let l of n.items)o.append(li("li","",l));a.append(o)}if(n.phones?.length){let o=li("ul","guide-phones");for(let[l,h,u]of n.phones){let f=li("li"),m=li("span","nums");for(let d of h){let y=li("a","",ES(d));y.href="tel:"+d.replace(/\D/g,""),m.append(y)}f.append(li("span","who",l),m),u&&f.append(li("small","",u)),o.append(f)}a.append(o)}n.note&&a.append(li("p","guide-note",n.note)),n.sources?.length&&a.append(wS(n.sources)),t.append(s)}}function Gg(i,t){if(i?.model?.kind!=="entrance-checkpoint")return null;let[e,n]=i.model.front,s=Math.hypot(e,n),r=e/s,a=n/s,o=[i.x,i.z],l=t(...o)+.55,h=y=>(y=Math.max(0,Math.min(1,y)),y*y*(3-2*y)),u=(y,_)=>{let p=y-o[0],x=_-o[1];return[p*a-x*r,p*r+x*a]};return{origin:o,floor:l,fx:r,fz:a,local:u,world:(y,_)=>[o[0]+y*a+_*r,o[1]-y*r+_*a],outer:{x:18,z:14},height:(y,_,p)=>{if(Math.abs(y-o[0])>32||Math.abs(_-o[1])>32)return p;let[x,A]=u(y,_),M=(1-h((Math.abs(x)-10.3)/7.7))*(1-h((Math.abs(A)-6.2)/7.8));if(!M)return p;let P=l-.14-Math.min(.9,Math.max(0,A-2.7)*.45);return p+(P-p)*M},rotation:Math.atan2(r,a),viewAzimuth:Math.atan2(-r,a)*180/Math.PI}}function Wg(i,t,e,n,s){let r=[],a=[],o=[],l=i.outer.x*2,h=i.outer.z*2;for(let m=0;m<=h;m++)for(let d=0;d<=l;d++){let[y,_]=i.world(d-i.outer.x,m-i.outer.z);r.push(y,i.height(y,_,t(y,_)),_),a.push((y+e/2)/e,1-(_+n/2)/n)}for(let m=0;m<h;m++)for(let d=0;d<l;d++){let y=m*(l+1)+d,_=y+1,p=y+l+1,x=p+1;o.push(y,p,_,_,p,x)}let u=new Pn;u.setAttribute("position",new sn(r,3)),u.setAttribute("uv",new sn(a,2)),u.setIndex(o),u.computeVertexNormals();let f=new Qe(u,s);return f.receiveShadow=!0,f}function TS(){let i=document.createElement("canvas");i.width=1024,i.height=512;let t=i.getContext("2d");t.textAlign="center",t.textBaseline="middle",t.fillStyle="#ff322b",t.font='700 76px "PingFang SC",sans-serif',t.shadowColor="#ef1d16",t.shadowBlur=3,t.fillText("\u4E5D\u534E\u5C71\u98CE\u666F\u533A\u6B22\u8FCE\u60A8",512,48),t.shadowBlur=0,t.fillStyle="#d9cd8f",t.font='700 174px "Kaiti SC","STKaiti","Songti SC",serif',["\u4E5D","\u83EF","\u5C71"].forEach((n,s)=>t.fillText(n,s*224+112,208));let e=new gs(i);return e.colorSpace=Wn,e.anisotropy=4,new os({map:e,transparent:!0,alphaTest:.16,side:xn,toneMapped:!1})}function Xg(i,t,{signs:e=!0}={}){let n=new Cn;n.position.set(i.origin[0],i.floor,i.origin[1]),n.rotation.y=i.rotation,n.userData.landmark="\u666F\u533A\u68C0\u7968\u53E3";let s=new Ei(1,1,1),r=t("#40332d"),a=t("#373c3a"),o=t("#b9b2a4"),l=t("#9caeae"),h=t("#192626"),u=t("#e5dfcb"),f=t("#658b90"),m=t("#205b9c"),d=(y,_,p,x,A,M,P)=>{let C=new Qe(s,P);return C.position.set(y,_+A/2,p),C.scale.set(x,A,M),C.castShadow=C.receiveShadow=!0,n.add(C),C};d(0,-.3,-.65,19.2,.3,7.5,o);for(let y=0;y<5;y++)d(0,-1.3,3.3+y*.4,19.2,1.3-(y+1)*.18,.4,o);d(0,-1.16,5.65,19.2,.15,1.1,o);for(let y of[-9.1,-4.2,4.2,9.1]){let _=Math.abs(y)<5?5.4:4.65;d(y,0,2.7,.7,.8,.7,o),d(y,.8,2.7,.46,_-.8,.46,r),d(y,0,-3.7,.38,3.9,.38,r)}d(0,3.85,-.5,18.8,.2,6.6,a);for(let[y,_,p]of[[0,9.6,5.4],[-6.9,5.7,4.65],[6.9,5.7,4.65]])d(y,p-.35,2.7,_-.6,.35,.5,r),d(y,p,2.8,_,.28,1.65,a);d(0,3.65,2.7,18.4,.23,.32,r),d(0,4.32,3.025,7.95,.93,.18,r),d(0,4.39,3.125,7.72,.78,.035,h);for(let y of[-2.85,0,2.85])d(y,5.68,2.7,.065,1.08,.065,h);for(let y of[-3.1,-1.1,.9,2.9])d(y,0,.35,.38,.98,1.55,l),d(y,.98,.35,.4,.1,1.6,h);for(let y of[-8.5,-5.6]){for(let _ of[-3.1,-.6,1.9])d(y,0,_,.065,1.05,.065,h);d(y,1,-.6,.07,.085,5.2,h)}if(d(6.6,0,-.5,3.7,2.65,4.7,u),d(6.6,1.02,1.867,3.38,1.34,.04,f),d(4.73,1.02,-.5,.04,1.34,4.34,f),d(6.6,1,1.904,.09,1.4,.07,r),d(6.6,2.65,-.5,4,.19,4.95,a),d(5.55,0,2.35,.82,1.68,.6,m),d(5.55,1,2.66,.65,.48,.035,u),d(5.55,1.08,2.688,.44,.27,.018,h),e){let y=TS(),_=(p,x,A,M,P,C,T,D,Y)=>{let R=new ms(M,P),E=R.attributes.uv;for(let mt=0;mt<E.count;mt++)E.setXY(mt,(C+E.getX(mt)*D)/1024,1-(T+(1-E.getY(mt))*Y)/512);let st=new Qe(R,y);st.position.set(p,x,A),n.add(st)};_(0,4.8,3.152,7.35,.69,0,0,1024,96),[-2.85,0,2.85].forEach((p,x)=>_(p,6.55,2.74,1.85,1.85,x*224,112,224,208))}return n.userData.checkpoint={width:19.2,depth:10.65,height:7.5,steps:5,validators:4,approximateDimensions:!0},n}function qg(i,{cellSize:t=400,enterDistance:e=2100,exitDistance:n=2500}={}){let s=i.geometry,r=s.attributes.position,a=s.index;if(Array.isArray(i.material)||s.groups.length||!r)return null;let o=a?a.count:r.count,l=new Map,h=new W;for(let y=0;y<o;y+=3){let _=a?a.getX(y):y,p=a?a.getX(y+1):y+1,x=a?a.getX(y+2):y+2,A=(r.getX(_)+r.getX(p)+r.getX(x))/3,M=(r.getZ(_)+r.getZ(p)+r.getZ(x))/3,P=Math.floor(A/t)+","+Math.floor(M/t),C=l.get(P);C||(C={indices:[],box:new Qi},l.set(P,C)),C.indices.push(_,p,x);for(let T of[_,p,x])C.box.expandByPoint(h.fromBufferAttribute(r,T))}let u=[];for(let{indices:y,box:_}of l.values()){let p=new Pn;for(let[P,C]of Object.entries(s.attributes))p.setAttribute(P,C);p.setIndex(y);let x=_.getCenter(new W),A=0;for(let P of y)A=Math.max(A,h.fromBufferAttribute(r,P).distanceToSquared(x));p.boundingBox=_,p.boundingSphere=new ps(x,Math.sqrt(A));let M=new Qe(p,i.material);M.castShadow=i.castShadow,M.receiveShadow=i.receiveShadow,M.renderOrder=i.renderOrder,M.layers.mask=i.layers.mask,M.matrixAutoUpdate=!1,M.visible=!1,M.raycast=()=>{},i.add(M),u.push(M)}let f={...s.drawRange},m=i.raycast;i.raycast=function(y,_){if(!this.visible)return;let{start:p,count:x}=s.drawRange;s.setDrawRange(f.start,f.count);try{m.call(this,y,_)}finally{s.setDrawRange(p,x)}};let d=!1;return{mesh:i,chunks:u,get near(){return d},update(y){let _=d?y<n:y<e;if(_===d)return!1;d=_,s.setDrawRange(f.start,d?0:f.count);for(let p of u)p.visible=d;return!0}}}function AS(i){let t=i.filter(s=>Number.isFinite(s)&&s>0).sort((s,r)=>s-r);if(!t.length)return{mean:0,p90:0,slow:!1,fast:!1};let e=t.reduce((s,r)=>s+r,0)/t.length,n=t[Math.min(t.length-1,Math.floor(t.length*.9))];return{mean:e,p90:n,slow:e>34||n>50,fast:e<19.5&&n<24}}var $h=class{constructor(t){this.setCeiling(t,!0)}setCeiling(t,e=!1){this.ceiling=t,this.floor=Math.min(1,t),this.limit=e?t:Math.max(this.floor,Math.min(this.limit,t)),e&&(this.holdUntil=0,this.recoverAfter=0)}pixelRatio(t=!1){return t?this.ceiling:this.limit}observe(t,e){let n=AS(t);if(!n.mean||e<this.holdUntil)return{...n,action:"hold"};let s="hold";return n.slow?(this.recoverAfter=e+15e3,this.limit>this.floor+.01?(this.limit=Math.max(this.floor,Math.round((this.limit-.25)*100)/100),this.holdUntil=e+2500,s="resolution-down"):s="tier-down"):n.fast&&e>=this.recoverAfter&&this.limit<this.ceiling-.01&&(this.limit=Math.min(this.ceiling,Math.round((this.limit+.25)*100)/100),this.holdUntil=e+4e3,this.recoverAfter=e+15e3,s="resolution-up"),{...n,action:s}}};var Yg="button,a,input,select,textarea,label,summary";function $g({compact:i,closePanel:t=null}){let e=C=>document.querySelector(C),n=e("#panel"),s=e("#card"),r=e("#settings"),a=r?.querySelector(".settings-wrap"),o=0,l=()=>{dispatchEvent(new Event("sheetchange")),clearTimeout(o),o=setTimeout(()=>dispatchEvent(new Event("sheetchange")),500)},h=[{el:n,watch:n,grow:!0,open:()=>!n.classList.contains("closed"),close:()=>t?t():e("#panel-close")?.click(),grab:(C,T)=>C.closest(".sheet-grip")?"grip":C.closest(Yg)?null:T<24?"grip":C.closest(".panel-head")?"head":null},{el:s,watch:s,grow:!0,open:()=>s.classList.contains("show"),close:()=>s.querySelector(":scope > .close")?.click(),grab:(C,T)=>C.closest("button,input,select,textarea,label,summary")?null:T<24?"grip":C.closest(".card-head")?C.closest("a")?null:"head":C.closest(".card-hero")?"hero":null},{el:a,watch:r,grow:!1,open:()=>!r.classList.contains("collapsed"),close:()=>e("#settings-toggle")?.click(),grab:(C,T)=>C.closest(Yg)?null:T<24||C.closest(".settings-head")?"head":null}].filter(C=>C.el&&C.watch),u=C=>C.open()&&i()&&C.el.offsetWidth>innerWidth*.6,f=null,m=0,d=C=>{C.style.transition="",C.style.transform=""},y=C=>{try{f.s.el.setPointerCapture(C.pointerId)}catch{}},_=()=>{let C=f.trail[0],T=f.trail[f.trail.length-1];return T[0]>C[0]?(T[1]-C[1])/(T[0]-C[0]):0},p=C=>{let T=C.timeStamp;for(f.trail.push([T,C.clientY]);f.trail.length>2&&T-f.trail[0][0]>100;)f.trail.shift()};function x(C,T){if(T.isPrimary&&T.button===0&&(m=0),f||!T.isPrimary||T.button!==0||!(T.target instanceof Element)||!u(C))return;let D=C.grab(T.target,T.clientY-C.el.getBoundingClientRect().top);D&&(f={s:C,kind:D,id:T.pointerId,x0:T.clientX,y0:T.clientY,drag:!1,trail:[[T.timeStamp,T.clientY]],expanded:C.el.classList.contains("expanded")},D!=="hero"&&y(T))}function A(C){if(!f||C.pointerId!==f.id)return;let T=C.clientX-f.x0,D=C.clientY-f.y0;if(!f.drag){if(Math.hypot(T,D)<8)return;if(f.kind==="hero"&&Math.abs(D)<=Math.abs(T)){f=null;return}f.drag=!0,y(C),f.s.el.style.transition="none"}p(C);let Y=f.s.grow&&!f.expanded,R=D>=0?D:Y?D>-40?D:Math.max(-64,-40+(D+40)*.2):Math.max(-40,D*.35);f.s.el.style.transform=`translateY(${R}px)`}function M(C){if(!f||C.pointerId!==f.id)return;let{s:T,kind:D,drag:Y,expanded:R}=f;if(!Y){f=null,D==="grip"&&T.grow&&(m=performance.now()+350,T.el.classList.toggle("expanded"),l());return}p(C);let E=C.clientY-f.y0,st=_(),mt=T.el.offsetHeight;f=null,d(T.el),E>0&&(E>90||st>.6)?R&&T.grow&&E<=mt*.45?(T.el.classList.remove("expanded"),l()):T.close():E<0&&T.grow&&!R&&(E<-50||st<-.5)&&(T.el.classList.add("expanded"),l()),m=performance.now()+350}function P(C){!f||C.pointerId!==f.id||(f.drag&&d(f.s.el),f=null)}for(let C of h){C.el.addEventListener("pointerdown",Y=>x(C,Y)),C.el.addEventListener("pointermove",A),C.el.addEventListener("pointerup",M),C.el.addEventListener("pointercancel",P),C.el.addEventListener("click",Y=>{Y.detail===0&&!Y.pointerType||performance.now()<m&&(m=0,Y.preventDefault(),Y.stopPropagation())},!0),C.el.addEventListener("dragstart",Y=>{f?.s===C&&Y.preventDefault()}),C.grow||C.el.addEventListener("touchmove",Y=>{f?.s===C&&f.kind!=="hero"&&Y.preventDefault()},{passive:!1});let T=C.open(),D=0;new MutationObserver(()=>{let Y=C.open();Y!==T&&(T=Y,clearTimeout(D),Y?D&&(D=0,C.el.classList.remove("expanded"),l()):(f?.s===C&&(d(C.el),f=null),C.el.classList.contains("expanded")&&(D=setTimeout(()=>{D=0,C.open()||(C.el.classList.remove("expanded"),l())},480))))}).observe(C.watch,{attributes:!0,attributeFilter:["class"]})}}var Xt=i=>document.querySelector(i),Yi=i=>[...document.querySelectorAll(i)],Zh={get(i){try{return localStorage.getItem("jiuhua."+i)}catch{return null}},set(i,t){try{localStorage.setItem("jiuhua."+i,t)}catch{}}},si=(i,t,e)=>Math.min(e,Math.max(t,i)),Li=i=>()=>{i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};function Te(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function Na(i){clearTimeout(i._t),i.hidden=!1,i.offsetWidth,i.classList.add("show")}function Bo(i,t=440){i.classList.remove("show"),clearTimeout(i._t),i._t=setTimeout(()=>{i.classList.contains("show")||(i.hidden=!0)},t)}function Pl(i){let t=Xt("#toast");t.textContent=i,Na(t),clearTimeout(Pl.t),Pl.t=setTimeout(()=>Bo(t,400),3200)}function Id(i){let t=Te("div","photo-credit"),e=[i.author&&`\u6444\u5F71\uFF1A${i.author}`,i.takenAt?`\u62CD\u6444\u4E8E ${i.takenAt}`:i.publishedAt?`\u6765\u6E90\u9875\u9762 ${i.publishedAt} \xB7 \u62CD\u6444\u65E5\u671F\u672A\u6CE8\u660E`:i.sourceUrl&&"\u62CD\u6444\u65E5\u671F\u672A\u6CE8\u660E"].filter(Boolean).join(" \xB7 ");e&&t.append(Te("span","",e+" \xB7 "));for(let[n,s]of[[i.sourceName||"\u56FE\u7247\u51FA\u5904",i.sourceUrl],[i.license,i.licenseUrl]]){if(!n||!s)continue;let r=Te("a","",n);r.href=s,r.target="_blank",r.rel="noopener noreferrer",t.lastChild?.tagName==="A"&&t.append(" \xB7 "),t.append(r)}return t}function Zg({reducedMotion:i,onToggle:t,focusLost:e,restoreFocus:n,fallbackFocus:s}){function r(o,l,h="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",u=[],f=document.activeElement){let m=Xt("#viewer"),d=m.querySelector(".viewer-strip"),y=m.querySelector(".viewer-count"),_=m.querySelector(".viewer-prev"),p=m.querySelector(".viewer-next");m.classList.contains("show")||(m._opener=f),m.setAttribute("aria-label",h+"\u7167\u7247");let x=m.querySelector(".viewer-caption");x||(x=Te("div","viewer-caption"),x.onclick=D=>D.stopPropagation(),m.append(x));let A=o.map((D,Y)=>{let R=Te("img");return R.alt=u[Y]?.alt||h+" \xB7 "+(Y+1),R.decoding="async",R}),M=D=>{let Y=A[D];Y&&!Y.hasAttribute("src")&&(Y.src=o[D])};d.replaceChildren(...A.map(D=>{let Y=Te("div","slide");return Y.append(D),Y}));let P=()=>si(Math.round(d.scrollLeft/Math.max(1,d.clientWidth)),0,o.length-1),C=()=>{let D=P();M(D),y.textContent=`${D+1} / ${o.length}`,x.replaceChildren();let Y=u[D];x.hidden=!Y,Y&&(x.append(Te("span","",Y.alt)),Y.sourceUrl&&x.append(Id(Y)));let R=document.activeElement;_.hidden=p.hidden=o.length<2,_.disabled=D===0,p.disabled=D===o.length-1,(R===_&&_.disabled||R===p&&p.disabled)&&(p.disabled&&_.disabled?m.querySelector(".viewer-close"):R===_?p:_).focus({preventScroll:!0})};d.onscroll=C;let T=D=>{let Y=si(P()+D,0,o.length-1);M(Y),d.scrollTo({left:Y*d.clientWidth,behavior:i?"auto":"smooth"})};m._go=T,_.onclick=D=>{D.stopPropagation(),T(-1)},p.onclick=D=>{D.stopPropagation(),T(1)},m.onclick=a,Na(m),d.scrollLeft=l*d.clientWidth,C(),t(),m.querySelector(".viewer-close").focus({preventScroll:!0})}function a(){let o=Xt("#viewer"),l=o._opener,h=o.contains(document.activeElement);o._opener=null,Bo(o,260),t(),(h||e())&&n(l,s())}return{open:r,close:a}}function Jg({W:i,D:t,stats:e,transit:n,places:s}){let r=s.filter(o=>o.searchable&&["service","transport"].includes(o.category)).length,a=s.filter(o=>["sight","nature","village"].includes(o.category)).length;return`<p>\u672C\u6B21\u66F4\u65B0\uFF1A2026 \u5E74 9 \u6708 28 \u65E5\u3002\u8986\u76D6\u7EA6 ${(i/1e3).toFixed(2)} \xD7 ${(t/1e3).toFixed(2)} \u516C\u91CC\uFF0C\u91CD\u70B9\u4E3A\u4E5D\u534E\u8857\u3001\u767E\u5C81\u5BAB\u3001\u95F5\u56ED\u3001\u5929\u53F0\u4E0E\u82B1\u53F0\u3002\u5B83\u662F\u4F9D\u636E\u516C\u5F00\u8D44\u6599\u91CD\u5EFA\u7684\u53EF\u4EA4\u4E92\u6A21\u578B\uFF0C\u4E0D\u662F\u503E\u659C\u6444\u5F71\u6216\u5B9E\u6D4B\u6210\u679C\u3002</p>
<table><tr><th>\u5185\u5BB9</th><th>\u4F9D\u636E\u4E0E\u7CBE\u5EA6</th></tr>
<tr><td>\u5C45\u4E4B\u6797\u6C11\u5BBF</td><td>\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u4E0E\u822A\u62CD\u56FE\u624B\u5DE5\u5EFA\u6A21\uFF1B\u73B0\u6709\u536B\u661F\u5F71\u50CF\u65E9\u4E8E\u65B0\u5EFA\uFF0C\u843D\u4F4D\u6309\u95E8\u724C\u987A\u5E8F\u4F30\u8BA1\uFF0C\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002</td></tr>
<tr><td>${e.buildings} \u4E2A\u5EFA\u7B51\u8F6E\u5ED3</td><td>${e.osmBuildings} \u4E2A OpenStreetMap \u8F6E\u5ED3 + ${e.supplementaryBuildings} \u4E2A Overture \u5F71\u50CF\u8BC6\u522B\u8865\u5145\u8F6E\u5ED3\u3002\u697C\u5C42\u3001\u5899\u8272\u3001\u74E6\u8272\u3001\u9A6C\u5934\u5899\u3001\u62AB\u6A90\u3001\u5E97\u9762\u6309\u7247\u533A\u89C4\u5F8B\u5206\u914D\uFF08${e.levelsRankedByGlobfp||0} \u680B\u7684\u697C\u5C42\u9AD8\u4F4E\u987A\u5E8F\u53C2\u8003 3D-GloBFP \u4F30\u7B97\u9AD8\u5EA6\uFF09\uFF0C\u89C4\u5F8B\u6765\u81EA\u89C4\u5212\u6587\u4EF6\u4E0E\u516C\u5F00\u7167\u7247\uFF0C\u9010\u680B\u672A\u5B9E\u6D4B\u3002\u70B9\u5EFA\u7B51\u53EF\u770B\u4F9D\u636E\u3002</td></tr>
<tr><td>\u5730\u70B9\u6807\u6CE8</td><td>\u5BFA\u5E99 ${e.temples} \xB7 \u666F\u70B9\u5C71\u6C34\u4E0E\u6751\u843D ${a} \xB7 \u516C\u5171\u8BBE\u65BD ${r}\uFF08\u8F66\u7AD9\u3001\u7D22\u9053\u3001\u505C\u8F66\u573A\u3001\u516C\u5395\u3001\u6E38\u5BA2\u4E2D\u5FC3\u3001\u6D3E\u51FA\u6240\u3001\u533B\u9662\u7B49\uFF09\uFF1B\u53E6\u6709 ${e.halls} \u5904\u6BBF\u5802\u5C0F\u6807\u6CE8\u3002\u591A\u4E2A\u5E73\u53F0\u7684\u540C\u4E00\u5730\u70B9\u5DF2\u5408\u5E76\u3002\u9664\u5C45\u4E4B\u6797\u5916\uFF0C\u5176\u4ED6\u5546\u5BB6\u70B9\u4F4D\u5DF2\u4ECE\u5730\u56FE\u6570\u636E\u4E0E\u641C\u7D22\u4E2D\u79FB\u9664\u3002</td></tr>
<tr><td>\u771F\u5B9E\u5730\u5F62</td><td>Copernicus GLO-30\uFF082011\u20132015 \u96F7\u8FBE\u6D4B\u91CF\uFF09\uFF0C257\xD7257 \u7F51\u683C\u7EA6 21 m \u95F4\u8DDD\uFF1B\u4E0E SRTM \u76F8\u6BD4\u5CF0\u9876\u548C\u7D22\u9053\u9AD8\u5DEE\u66F4\u63A5\u8FD1\u5B98\u65B9\u6570\u636E\u3002\u5C40\u90E8\u4E0E\u5176\u4ED6\u9AD8\u7A0B\u6E90\u76F8\u5DEE 30 m \u4EE5\u4E0A\u7684\u683C\u70B9\u53D6\u56DB\u6E90\u4E2D\u4F4D\u6570\u3002\u4ECD\u662F\u8868\u9762\u6A21\u578B\uFF08\u542B\u6811\u51A0\uFF09\u3002</td></tr>
<tr><td>\u4E3B\u8981\u5BFA\u9662</td><td>\u5316\u57CE\u5BFA\u3001\u7947\u56ED\u5BFA\u3001\u8089\u8EAB\u5B9D\u6BBF\u3001\u767E\u5C81\u5BAB\u3001\u65C3\u6A80\u7985\u6797\u7B49\u7684\u5899\u8272\u3001\u74E6\u8272\u3001\u5C4B\u9876\u5F62\u5F0F\u4F9D\u636E\u5B98\u65B9\u89C4\u5212\u3001\u516C\u5F00\u7167\u7247\u4E0E\u536B\u661F\u5F71\u50CF\uFF1B\u6BBF\u4F53\u6BD4\u4F8B\u3001\u7EC6\u90E8\u4ECD\u5C5E\u590D\u539F\u3002</td></tr></table>
<h3>\u666F\u533A\u4EA4\u901A\uFF08\u5B98\u7F51 ${n?.retrieved||""}\uFF09</h3>${(n?.routes||[]).map(o=>`<p><b>${o.name}</b>\u3000${o.hours}<br><small>${o.stops.join(" \u2192 ")}${o.note?"\u3002"+o.note:""}</small></p>`).join("")}<p>${(n?.cableways||[]).map(o=>`${o.name} ${o.hours}`).join("\u3000\xB7\u3000")}<br><small>\u65C5\u6E38\u54A8\u8BE2 ${n?.hotlines?.\u65C5\u6E38\u54A8\u8BE2\u6295\u8BC9||""} \xB7 \u7D27\u6025\u6551\u63F4 ${n?.hotlines?.\u7D27\u6025\u6551\u63F4||""} \xB7 \u5C1A\u65E0\u516C\u5F00\u5750\u6807\u7684\u7AD9\u70B9\uFF1A${(n?.unlocatedStops||[]).join("\u3001")}</small></p>
<h3>\u5750\u6807\u4E0E\u6570\u636E\u8D28\u91CF</h3><p>\u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u7B49\u5E73\u53F0\u7684 GCJ-02 \u5750\u6807\u5747\u7528 coordtransform \u6362\u7B97\u4E3A WGS84\uFF0C\u539F\u59CB\u5750\u6807\u4FDD\u5B58\u5728\u6570\u636E\u4E2D\uFF1B\u6BCF\u4E2A\u6570\u636E\u96C6\u90FD\u7ECF\u8FC7\u72EC\u7ACB\u62BD\u68C0\u3002\u7EF4\u57FA\u6570\u636E\u7B49\u5F00\u653E\u6570\u636E\u4E2D\u7EA6 1 km \u504F\u79FB\u7684\u5BFA\u5E99\u70B9\uFF08\u767E\u5EA6\u5750\u6807\u8BEF\u6807\u4E3A WGS84\uFF09\u672A\u7528\u4E8E\u5B9A\u4F4D\u3002\u5730\u70B9\u5B9A\u4F4D\u4F9D\u636E\u53EF\u5728\u7B80\u4ECB\u5361\u7684\u201C\u8D44\u6599\u4E0E\u4F9D\u636E\u201D\u4E2D\u67E5\u770B\u3002</p>
<h3>\u8D44\u6599\u4E0E\u8BB8\u53EF</h3><p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors / ODbL</a> \xB7 <a href="https://docs.overturemaps.org/attribution/" target="_blank" rel="noopener">Overture Maps\uFF1A\u5EFA\u7B51 ODbL\uFF1B\u5730\u70B9 CDLA-Permissive 2.0</a> \xB7 <a href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model" target="_blank" rel="noopener">Copernicus DEM GLO-30 \xA9 DLR e.V. 2010-2014 and \xA9 Airbus Defence and Space GmbH 2014-2018\uFF0C\u7531 ESA \u5728 Copernicus \u8BA1\u5212\u4E0B\u63D0\u4F9B</a> \xB7 <a href="https://www.jiuhuashan.gov.cn/file_cz/54/202506/202506269aaa0b14711f440284eefd14e047a66e.pdf" target="_blank" rel="noopener">\u4E5D\u534E\u5C71\u5B98\u65B9\u5730\u8D28\u516C\u56ED\u89C4\u5212</a> \xB7 <a href="https://doi.org/10.5194/essd-16-5357-2024" target="_blank" rel="noopener">3D-GloBFP \u5EFA\u7B51\u9AD8\u5EA6\uFF08Che \u7B49 2024\uFF0CCC BY 4.0\uFF09</a>\uFF0C\u4EC5\u7528\u4E8E\u540C\u7247\u533A\u5185\u697C\u5C42\u9AD8\u4F4E\u6392\u5E8F \xB7 \u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u516C\u5F00\u9875\u9762\uFF08\u9010\u6761\u94FE\u63A5\u89C1\u5730\u70B9\u5361\u7247\uFF09</p><p>\u8865\u5145\u5EFA\u7B51\u7531 Qian Shi \u7B49\u7684\u4E1C\u4E9A\u5EFA\u7B51\u6570\u636E\u7ECF Overture \u63D0\u4F9B\uFF0C\u539F\u59CB\u6570\u636E\u4E3A <a href="https://doi.org/10.5281/zenodo.8174931" target="_blank" rel="noopener">CC BY 4.0</a>\uFF1B\u672C\u9879\u76EE\u505A\u4E86\u88C1\u526A\u3001\u53BB\u91CD\u4E0E\u5C4B\u9876\u91CD\u5EFA\u3002\u5B98\u65B9\u7167\u7247\u4E0E\u516C\u5F00\u7167\u7247\u4EC5\u7528\u4E8E\u5F52\u7EB3\u5916\u89C2\u89C4\u5F8B\uFF0C\u672A\u4F5C\u4E3A\u8D34\u56FE\u3002</p>`}var Ll=i=>getComputedStyle(document.documentElement).getPropertyValue(i).trim(),Jh=/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;function ro(i,t,e,n,s,r){r=Math.max(0,Math.min(r,n/2,s/2)),i.beginPath(),i.roundRect?i.roundRect(t,e,n,s,r):(i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath())}function jh(i,t,e,n){let s=t&&t!=="none"&&t.match(Jh);if(s&&s.length>1){let r=+(t.match(/([\d.]+)deg/)?.[1]??180)*Math.PI/180,a=Math.sin(r),o=-Math.cos(r),l=(Math.abs(n.width*a)+Math.abs(n.height*o))/2,h=n.x+n.width/2,u=n.y+n.height/2,f=i.createLinearGradient(h-a*l,u-o*l,h+a*l,u+o*l);return f.addColorStop(0,s[0]),f.addColorStop(1,s.at(-1)),f}return!e||/^transparent$|^rgba\(.*,\s*0\)$/.test(e)?null:e}function Kh(i,t,e,n,s){for(let r of t)i.fillText(r,e,n),e+=i.measureText(r).width+s;return e}var jg=(i,t,e)=>i.measureText(t).width+[...t].length*e;function Kg(i,t,e,n){let s=parseFloat(t.borderTopLeftRadius)||0,r=jh(i,t.backgroundImage,t.backgroundColor,e),a=parseFloat(t.borderTopWidth)||0,o=t.boxShadow==="none"?[]:t.boxShadow.split(/,(?![^(]*\))/).filter(l=>!/inset/.test(l)).map(l=>({col:l.match(Jh)?.[0]||"transparent",v:l.replace(Jh,"").trim().split(/\s+/).map(parseFloat)}));for(let l of o)!l.v[2]&&l.v[3]>0&&(ro(i,e.x+l.v[0]-l.v[3],e.y+l.v[1]-l.v[3],e.width+2*l.v[3],e.height+2*l.v[3],s+l.v[3]),i.fillStyle=l.col,i.fill());if(r){let l=o.filter(h=>h.v[2]>0).sort((h,u)=>u.v[2]-h.v[2])[0];i.save(),l&&(i.shadowColor=l.col,i.shadowBlur=l.v[2]*n*.8,i.shadowOffsetX=l.v[0]*n,i.shadowOffsetY=l.v[1]*n),ro(i,e.x,e.y,e.width,e.height,s),i.fillStyle=r,i.fill(),i.restore()}a&&t.borderTopStyle!=="none"&&jh(i,"none",t.borderTopColor,e)&&(i.lineWidth=a,i.strokeStyle=t.borderTopColor,i.setLineDash(t.borderTopStyle==="dashed"?[3,2]:[]),ro(i,e.x+a/2,e.y+a/2,e.width-a,e.height-a,s-a/2),i.stroke(),i.setLineDash([]))}function Qg(i,t,e){for(let n of t.childNodes){if(n.nodeType===3){let a=n.textContent;if(!a.trim())continue;let o=getComputedStyle(t),l=document.createRange();l.selectNodeContents(n);let h=l.getBoundingClientRect(),u=parseFloat(o.letterSpacing)||0,f=h.y+h.height/2;if(i.font=`${o.fontStyle} ${o.fontWeight} ${o.fontSize} ${o.fontFamily}`,i.textAlign="left",i.textBaseline="middle",i.fillStyle=o.color,o.textShadow!=="none"){i.save(),i.shadowColor="rgba(255,255,255,.95)";for(let m of[3,9])i.shadowBlur=m*e,Kh(i,a,h.x,f,u);i.restore()}Kh(i,a,h.x,f,u);continue}if(n.nodeType!==1)continue;let s=getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden"||+s.opacity<.05)continue;let r=n.getBoundingClientRect();if(n.tagName.toLowerCase()==="svg"){let a=n.viewBox?.baseVal,o=n.querySelector("path");o&&a?.width&&(i.save(),i.translate(r.x,r.y),i.scale(r.width/a.width,r.height/a.height),i.fillStyle=s.fill,i.fill(new Path2D(o.getAttribute("d"))),i.restore());continue}Kg(i,s,r,e),Qg(i,n,e)}}function RS(i,t,e,n){let s=t.querySelector("button"),r=getComputedStyle(s),a=s.getBoundingClientRect();if(!a.width||r.visibility==="hidden"||a.x<0||a.y<0||a.right>innerWidth||a.bottom>n)return;let o=t.querySelector("i"),l=o&&getComputedStyle(o);if(l&&l.display!=="none"){let f=getComputedStyle(o,"::after"),m=parseFloat(f.width)||0;i.save();let d,y;if(t.classList.contains("pin")){let _=t.getBoundingClientRect();d=_.x+_.width/2,y=_.bottom;let p=si(d,a.x,a.right),x=si(y,a.y,a.bottom);if(Math.hypot(p-d,x-y)>=3){let A=parseFloat(l.height)||1.5,M=l.boxShadow.match(/rgba?\([^)]*\)/);i.lineCap="round",M&&(i.strokeStyle=M[0],i.lineWidth=A+1.5,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()),i.strokeStyle=l.backgroundColor,i.lineWidth=A,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()}}else{let _=o.getBoundingClientRect();i.globalAlpha=t.classList.contains("route-stop")?+l.opacity:1,i.fillStyle=jh(i,l.backgroundImage,l.backgroundColor,_)||"transparent",i.fillRect(_.x,_.y,_.width,_.height),d=_.x+_.width/2,y=_.bottom-(parseFloat(f.bottom)||0)-m/2}if(m){let _=f.boxShadow.match(/(rgba?\([^)]*\)) 0px 0px 0px ([\d.]+)px/);_&&(i.fillStyle=_[1],i.beginPath(),i.arc(d,y,m/2+ +_[2],0,7),i.fill()),i.fillStyle=f.backgroundColor,i.beginPath(),i.arc(d,y,m/2,0,7),i.fill()}i.restore()}Kg(i,r,a,e);let h=getComputedStyle(s,"::before"),u=parseFloat(h.width)||0;u&&h.display!=="none"&&h.content!=="none"&&(i.fillStyle=h.backgroundColor,i.beginPath(),i.arc(a.x+(parseFloat(r.borderLeftWidth)||0)+(parseFloat(r.paddingLeft)||0)+u/2,a.y+a.height/2,u/2,0,7),i.fill()),Qg(i,s,e)}function tx({frame:i,stats:t,render:e}){let n=innerWidth,s=innerHeight,r=Math.min(2,Math.max(devicePixelRatio||1,i.width/n)),a=document.createElement("canvas");a.width=Math.round(n*r),a.height=Math.round(s*r);let o=a.getContext("2d"),l=Ll("--sans")||"sans-serif",h=Ll("--serif")||"serif",u=Ll("--ink")||"#1c2a25",f=Ll("--muted")||"#5c6962";o.font=`10.5px ${l}`;let m=[];for(let tt of[["\xA9 OpenStreetMap contributors","Overture Maps Foundation","Copernicus DEM (ESA)","\u53BB\u54EA\u513F/360\u5730\u56FE/OSM \u516C\u5F00\u5730\u70B9"],["\u8865\u5145\u8F6E\u5ED3\uFF1AQian Shi \u7B49 / CC BY 4.0","\u5EFA\u7B51\u697C\u9AD8\u3001\u7ACB\u9762\u53CA\u690D\u88AB\u4E3A\u8FD1\u4F3C\u590D\u539F"]]){let lt="";for(let bt of tt){let qt=lt?lt+" \xB7 "+bt:bt;lt&&o.measureText(qt).width>n-24?(m.push(lt),lt=bt):lt=qt}m.push(lt)}let d=12+m.length*15,y=n<600?12:24,_=15,p=44,x=y+_+p+13,A="\u4E5D\u534E\u5C71",M="\u4E09\u7EF4\u5B9E\u5730\u5BFC\u89C8 \xB7 \u8D70\u8FD1\u4E5D\u534E",P=`${t.buildings} \u5EFA\u7B51\u8F6E\u5ED3 \xB7 ${t.places} \u5730\u70B9 \xB7 2026.09.27`;o.font=`600 26px ${h}`;let C=jg(o,A,3.64);o.font=`12.5px ${l}`;let T=jg(o,M,.75);o.font=`11px ${l}`;let D=o.measureText(P).width,Y=x-y+Math.max(C,T,D)+20,R=_*2+66,E=e([[y,y,y+Y,y+R],[0,s-d,n,s]]);o.fillStyle="#dce5df",o.fillRect(0,0,a.width,a.height),o.drawImage(i,0,0,a.width,a.height),o.scale(r,r);for(let tt of E.filter(lt=>lt.classList.contains("maplabel")&&lt.style.display!=="none").sort((lt,bt)=>(parseInt(getComputedStyle(lt).zIndex)||0)-(parseInt(getComputedStyle(bt).zIndex)||0)))RS(o,tt,r,s-d);o.save(),o.shadowColor="rgba(20,32,27,.24)",o.shadowBlur=20*r,o.shadowOffsetY=6*r,ro(o,y,y,Y,R,18),o.fillStyle="rgba(251,249,243,.96)",o.fill(),o.restore(),o.lineWidth=1,o.strokeStyle="rgba(28,42,37,.09)",ro(o,y+.5,y+.5,Y-1,R-1,17.5),o.stroke();let st=y+_,mt=y+_,Qt=Ll("--zhu-fill").match(Jh)||["#c24536","#a8322a"];return o.fillStyle=jh(o,`linear-gradient(160deg, ${Qt[0]}, ${Qt.at(-1)})`,null,{x:st,y:mt,width:p,height:p}),ro(o,st,mt,p,p,10),o.fill(),o.lineWidth=2,o.strokeStyle="#b23a2d",ro(o,st+1,mt+1,p-2,p-2,9),o.stroke(),o.lineWidth=1,o.strokeStyle="rgba(251,241,230,.55)",ro(o,st+2.5,mt+2.5,p-5,p-5,7.5),o.stroke(),o.fillStyle="#fbf1e6",o.font=`600 16px ${h}`,o.textAlign="center",o.textBaseline="middle",o.fillText("\u4E5D",st+p/2,mt+p/2-8.5),o.fillText("\u534E",st+p/2,mt+p/2+8.5),o.textAlign="left",o.textBaseline="alphabetic",o.fillStyle=u,o.font=`600 26px ${h}`,Kh(o,A,x,mt+25,3.64),o.fillStyle=f,o.font=`12.5px ${l}`,Kh(o,M,x,mt+46,.75),o.font=`11px ${l}`,o.fillText(P,x,mt+64),o.fillStyle="rgba(251,249,243,.95)",o.fillRect(0,s-d,n,d),o.fillStyle="rgba(28,42,37,.09)",o.fillRect(0,s-d,n,1),o.fillStyle=f,o.font=`10.5px ${l}`,o.textBaseline="middle",m.forEach((tt,lt)=>o.fillText(tt,12,s-d+13.5+lt*15)),a}function CS(i,t,{W:e,D:n}){let{longitude:s,latitude:r,accuracy:a}=i;if(![s,r,a].every(Number.isFinite)||Math.abs(s)>180||Math.abs(r)>90||a<0)return null;let{origin:o,kx:l,ky:h}=t;if(!o||![o.lon,o.lat,l,h,e,n].every(Number.isFinite)||l<=0||h<=0||e<=0||n<=0)return null;let u=(s-o.lon)*l,f=(o.lat-r)*h;return{x:u,z:f,accuracy:a,inside:Math.abs(u)<=e/2&&Math.abs(f)<=n/2}}function ex({geo:i,terrain:t,onChange:e,geolocation:n=navigator.geolocation,secure:s=window.isSecureContext,doc:r=document,win:a=window,now:o=Date.now,schedule:l=setInterval,unschedule:h=clearInterval,maxAccuracy:u=100,maxAge:f=3e4,retainAge:m=12e4,retryAfter:d=6e4,maxRetryAfter:y=24e4}){let _=!1,p=!1,x=null,A=0,M=null,P="",C=0,T=null,D=0,Y=d,R=0,E=null,st=!1,mt=null,Qt=5e3,tt=()=>T&&o()-C<=m?T:null,lt=()=>T&&o()-C<=f;function bt(Xe,Ze=null,Ie=!1){let Be=Xe!==P;P=Xe;let et=Ze&&E?.point&&Math.hypot(Ze.x-E.point.x,Ze.z-E.point.z)<1&&Math.ceil(Ze.accuracy/10)===Math.ceil(E.point.accuracy/10);!Be&&E?.enabled===_&&E.fresh===Ie&&(!Ze&&!E.point||et)||(E={state:P,point:Ze,enabled:_,changed:Be,fresh:Ie},e(E))}function qt(){A++,x!==null&&(n.clearWatch(x),x=null)}function Jt(){mt=null,qt(),M!==null&&(h(M),M=null)}function Tt(){T=null,C=0,R=0,st=!1,Qt=5e3}function $t(){!st&&mt===null&&(mt=o()+Qt)}function le(){_&&(_=!1,Jt(),Tt(),bt("off"))}function Me(){mt=null,qt(),D=o();let Xe=A;bt("waiting",tt());try{let Ze=n.watchPosition(Ie=>{if(Xe!==A||!_||r.hidden)return;if(D=o(),!Number.isFinite(Ie.timestamp)||o()-Ie.timestamp>f||Ie.timestamp>o()+5e3){$t(),bt("stale",tt());return}let Be=CS(Ie.coords,i,t);if(!Be){$t(),bt("unavailable",tt());return}if(Be.accuracy>u){R++,(Be.accuracy>u*2||R>=3)&&(T=null,C=0),bt(Be.accuracy>=1e3?"approximate":"inaccurate",tt());return}R=0,Y=d,st=!0,mt=null,Qt=5e3,T=Be.inside?Be:null,C=Ie.timestamp,bt(Be.inside?"inside":"outside",T,!!T)},Ie=>{Xe!==A||!_||r.hidden||(Ie.code===1?(_=!1,Jt(),Tt(),bt("denied")):($t(),bt(Ie.code===3?"timeout":"unavailable",tt())))},{enableHighAccuracy:!0,maximumAge:0,timeout:15e3});Xe===A&&_?x=Ze:n.clearWatch(Ze)}catch{_=!1,Jt(),Tt(),bt("unavailable")}}function Ct(){if(!_||r.hidden)return;if(mt!==null){o()>=mt&&(Qt=Math.min(6e4,Qt*2),Me());return}let Xe=tt();P==="inside"&&!lt()?bt("stale",Xe):E?.point&&!Xe&&bt(P),o()-D>=Y&&(Y=Math.min(y,Y*2),Me())}function Bt(){M=l(Ct,5e3),Me()}function ge(){if(!(_||p)){if(!s){bt("insecure");return}if(!n){bt("unsupported");return}Tt(),Y=d,_=!0,r.hidden?bt("paused"):Bt()}}function Re(){_&&(Jt(),r.hidden?bt("paused",tt()):Bt())}function Pe(){_&&le()}return r.addEventListener("visibilitychange",Re),a.addEventListener("pagehide",Pe),{start:ge,stop:le,get enabled(){return _},destroy(){le(),p=!0,r.removeEventListener("visibilitychange",Re),a.removeEventListener("pagehide",Pe)}}}var nx=Eg(),Dd=()=>matchMedia("(max-width:820px), (max-width:960px) and (orientation:landscape) and (max-height:520px)").matches,kn=Dd(),nr=kn||matchMedia("(pointer:coarse)").matches&&!matchMedia("(any-pointer:fine)").matches,Ir=[{name:"\u6D41\u7545",dpr:1,pbr:!1,blur:!1,hiShapes:!1,forest:0,bamboo:!1,trunkDist:0,detailDist:450,landmarkDist:2600,labelCap:16,shadows:!1},{name:"\u6807\u51C6",dpr:1.5,pbr:!1,blur:!1,hiShapes:!1,forest:1,bamboo:!0,trunkDist:1400,detailDist:900,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u9AD8\u6E05",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:2600,detailDist:2600,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u6781\u81F4",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:1e9,detailDist:1e9,landmarkDist:4e3,labelCap:null,shadows:!0}],Ud=nr?2:3,fi=+(Zh.get("autoTier")??(nr?1:3));fi>=0&&fi<=Ud||(fi=nr?1:3);var xr=!1,Il=matchMedia("(prefers-reduced-motion:reduce)").matches,PS=matchMedia("(hover:hover) and (pointer:fine)");function ix(i){let t=Xt("#loading");t.hidden=!1,t.classList.remove("done"),t.classList.add("failed"),Xt("#load-text").textContent=i;let e=Xt("#reload");e.hidden=!1,e.onclick=()=>location.reload()}addEventListener("gesturestart",i=>i.preventDefault());function LS(){let i=Xt("#reload");i.hidden||Xt("#loading").classList.contains("failed")||(i.hidden=!0,Xt("#load-text").textContent="\u8BFB\u53D6\u5730\u5F62\u4E0E\u771F\u5B9E\u5EFA\u7B51\u8F6E\u5ED3")}try{await IS()}catch(i){console.error(i),ix(/webgl/i.test(i.message)?"\u8FD9\u4E2A\u6D4F\u89C8\u5668\u65E0\u6CD5\u663E\u793A\u4E09\u7EF4\u5730\u56FE\uFF08WebGL \u4E0D\u53EF\u7528\uFF09\u3002\u8BF7\u6362\u7528\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6216\u66F4\u65B0\u6D4F\u89C8\u5668\u540E\u91CD\u8BD5\uFF1B\u5728\u5FAE\u4FE1\u91CC\u53EF\u70B9\u53F3\u4E0A\u89D2\u201C\xB7\xB7\xB7\u201D\uFF0C\u9009\u201C\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u201D\u3002":"\u5730\u56FE\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u3002"+i.message)}async function IS(){let[i,t]=window.__JIUHUA_DATA__||await Promise.all(["data/terrain.json?v=20261005-public-places","data/geodata.json?v=20261005-domestic-photos-public-places"].map(async c=>{let g=await fetch(c);if(!g.ok)throw new Error(c);return g.json()}));LS(),t.water=t.water.filter(c=>!(c.kind==="stream"&&c.pts.every(g=>g[0]>=-1900&&g[0]<=-1195&&g[1]>=-165&&g[1]<=230)));for(let c of t.water){let g=c.pts;if(c.kind!=="river"||Math.hypot(g[0][0]+1226,g[0][1]+159)>5)continue;let v=g.findIndex(S=>S[1]<-761.7);if(v>0){let S=g[v-1],w=g[v],L=(-761.7-S[1])/(w[1]-S[1]);c.pts=[[S[0]+(w[0]-S[0])*L,-761.7],...g.slice(v)]}}t.areas.push({kind:"plaza",ring:[[-1338,-60],[-1372,10],[-1398,-1],[-1370,-70]]}),sm(t),t.roads.push({id:"lane-hushan-plaza",name:"",kind:"alley",width:1.5,drape:!0,pts:[[-1341.3,-48.2],[-1376,0]]}),t.roads.push({id:"lane-hushan-huacheng",name:"",kind:"alley",width:1.5,pts:[[-1376,0],[-1386,27],[-1385,56],[-1378,64],[-1357,101],[-1350.5,108],[-1350.5,114.5],[-1355.8,120.5],[-1355,126],[-1352,133],[-1349.5,140]]}),t.roads.push({id:"lane-police",name:"",kind:"alley",width:2,pts:[[-1408.5,-146.8],[-1424,-140],[-1450,-128.5],[-1475,-117],[-1481,-116.5],[-1487.5,-110]]}),t.roads.push({id:"lane-huacheng",name:"",kind:"alley",width:1.2,pts:[[-1330.4,238.6],[-1330.4,226.5],[-1330.6,224.6],[-1334.5,222.3],[-1341.5,219.6],[-1344.6,211],[-1347.6,205.6],[-1348.4,201]]});let{W:e,D:n,N:s}=i,r=Uint8Array.from(atob(i.h),c=>c.charCodeAt(0)),a=new DataView(r.buffer),o=new Float32Array(s*s);for(let c=0;c<o.length;c++)o[c]=a.getUint16(c*2,!0)/4;let l=1.6,h=l,u=em(o).min;for(let c=0;c<o.length;c++)o[c]=u+(o[c]-u)*l;let f=c=>u+(c-u)/l;for(let c of t.buildings)c.base=u+(c.base-u)*l;function m(c,g){let v=si((c+e/2)/e*(s-1),0,s-1.001),S=si((g+n/2)/n*(s-1),0,s-1.001),w=v|0,L=S|0,N=v-w,X=S-L;return(o[L*s+w]*(1-N)+o[L*s+w+1]*N)*(1-X)+(o[(L+1)*s+w]*(1-N)+o[(L+1)*s+w+1]*N)*X}let d=t.places.find(c=>c.model?.kind==="entrance-checkpoint"),y=Gg(d,m);function _(c,g){let v=m(c,g);return y?y.height(c,g,v):v}let p=new _l({antialias:!(nr&&devicePixelRatio>=2),alpha:!0,powerPreference:"high-performance"});document.documentElement.classList.toggle("lite",!Ir[fi].blur);let x=()=>Math.min(devicePixelRatio,xr?.8:Ir[fi].dpr),A=new $h(x()),M=!1,P=0,C=()=>A.pixelRatio(M),T=()=>Ir[fi].shadows&&!kn&&!nr;function D(c=!1,g=performance.now()){M=c;let v=C();Math.abs(p.getPixelRatio()-v)<.01||(p.setPixelRatio(v),P=g)}p.setPixelRatio(C()),p.outputColorSpace=Wn,p.toneMapping=gd,p.toneMappingExposure=1,p.shadowMap.enabled=T(),p.shadowMap.type=pd,Xt("#stage").appendChild(p.domElement),p.domElement.addEventListener("webglcontextlost",c=>{c.preventDefault(),ix("\u8BBE\u5907\u56FE\u5F62\u5185\u5B58\u4E0D\u8DB3\uFF0C\u4E09\u7EF4\u753B\u9762\u5DF2\u505C\u6B62\u3002\u5173\u95ED\u5176\u4ED6\u9875\u9762\u540E\u70B9\u201C\u91CD\u65B0\u52A0\u8F7D\u201D\u3002")});let Y=new Hh;Y.domElement.className="labels",Xt("#stage").appendChild(Y.domElement);let R=new Cn;R.matrixWorldAutoUpdate=!1;let E=[],st=!0,mt=0,Qt=0,tt=!0,lt=[],bt=0,qt=new ah;qt.fog=new oh("#f4dcc0",2e-4);let Jt=()=>{qt.fog.density=.13/si(Bt.position.distanceTo(ge.target),600,2e4)},Tt=new Cn,$t=new Cn,le=new Cn,Me=new Cn,Ct=new Cn;qt.add(Tt),Tt.add($t,le,Me,Ct);let Bt=new Hi(43,1,.7,32e3),ge=xg(Bt,Xt("#stage"),kx);ge.enableDamping=!0,ge.dampingFactor=.075,qt.add(new Ah("#fff6e8","#7a8a70",1.1));let Re=new Rh("#fff0d6",2.6);Re.position.set(-2600,1900,-1500),Re.castShadow=T(),Re.shadow.mapSize.set(4096,4096),Object.assign(Re.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:6500}),Re.shadow.bias=-1e-4,Re.shadow.normalBias=.7,qt.add(Re,Re.target);let Pe=c=>new fn(c),Xe=["roughness","metalness","roughnessMap","metalnessMap","envMapIntensity"],Ze=c=>{let g={...c};for(let v of Xe)delete g[v];return g},Ie=(()=>{let c=new ch(new Uint8Array([168,168,168,255,214,214,214,255,255,255,255,255]),3,1);return c.minFilter=c.magFilter=Ai,c.needsUpdate=!0,c})();function Be(c={}){let g=new Eh({...Ze(c),gradientMap:Ie});return g.userData.params=c,g}let et=["side","transparent","opacity","depthWrite","depthTest","polygonOffset","polygonOffsetFactor","polygonOffsetUnits","alphaTest","vertexColors","map","emissiveMap","emissiveIntensity","fog","toneMapped","flatShading","name"];function Se(c,g){if(c.isMeshToonMaterial||!c.userData.params||c.isMeshStandardMaterial===g)return c;if(c.userData.twin)return c.userData.twin;let v=g?new Sh(c.userData.params):new wh(Ze(c.userData.params));for(let S of et)S in c&&S in v&&(v[S]=c[S]);return v.color?.copy(c.color),v.emissive?.copy(c.emissive),v.onBeforeCompile=c.onBeforeCompile,v.userData.params=c.userData.params,v.userData.twin=c,c.userData.twin=v,v}let ct=(c,g={})=>Be({color:c,roughness:.9,metalness:0,...g}),ye={},jt=null;function ke(c){return ye[c]??=c?{leaf:Fa(),pine:new no(1,1,6),trunk:new Vi(.18,.3,1,4,1,!0),bamboo:Fa(),lantern:new Gi(.24,10,8)}:{leaf:Fa(),pine:new no(1,1,6,1,!0),trunk:new Vi(.18,.3,1,3,1,!0),bamboo:Fa(),lantern:Fa().scale(.24,.24,.24)}}let be=ct("#b9b7a4"),O=ct("#594937"),I=ct("#e0a83a",{roughness:.67}),yt=ct("#c0452f"),me=ct("#77889a"),de=ct("#466266",{roughness:.3,metalness:.15}),ue=new Ei(1,1,1),We=new Vi(1,1,1,8);function Yt(c,g,v,S,w,L,N,X){let H=new Qe(ue,X);return H.position.set(g,v+L/2,S),H.scale.set(w,L,N),H.castShadow=!0,H.receiveShadow=!0,c.add(H),H}function we(c,g,v,S,w,L,N){let X=new Qe(We,N);return X.position.set(g,v+L/2,S),X.scale.set(w,L,w),X.castShadow=!0,c.add(X),X}let je=new Map;function rn(c,g,v="#777865"){let S=je.get(c);S||(S={p:[],c:[]},je.set(c,S));let w=Pe(v);for(let L=1;L<g.length;L++)S.p.push(...g[L-1],...g[L]),S.c.push(w.r,w.g,w.b,w.r,w.g,w.b)}let pe=new Map,yn=c=>{if(typeof c!="string")return Pe(c);let g=pe.get(c);return g||pe.set(c,g=Pe(c)),g};class G{constructor(){this.p=[],this.c=[],this.uv=[],this.ids=[]}tri(g,v,S,w="#ffffff",L=null,N=-1){this.p.push(g[0],g[1],g[2],v[0],v[1],v[2],S[0],S[1],S[2]);let X=yn(w),H=X.r,U=X.g,K=X.b;this.c.push(H,U,K,H,U,K,H,U,K),L?this.uv.push(L[0][0],L[0][1],L[1][0],L[1][1],L[2][0],L[2][1]):this.uv.push(g[0]/8,g[2]/8,v[0]/8,v[2]/8,S[0]/8,S[2]/8),this.ids.push(N)}quad(g,v,S,w,L,N=null,X=-1){this.tri(g,v,S,L,N?[N[0],N[1],N[2]]:null,X),this.tri(g,S,w,L,N?[N[0],N[2],N[3]]:null,X)}mesh(g,v){let S=new Pn;S.setAttribute("position",new sn(this.p,3)),S.setAttribute("color",new sn(this.c,3)),S.setAttribute("uv",new sn(this.uv,2)),S.computeVertexNormals();let w=new Qe(S,g);return w.castShadow=!0,w.receiveShadow=!0,w.userData.triangleIds=this.ids,v.add(w),w}}let ae=c=>c*c*(3-2*c),ve=(()=>{let c=Li(4711),g=256,v=new Float32Array(g*g);for(let w=0;w<v.length;w++)v[w]=c();let S=(w,L)=>{let N=Math.floor(w),X=Math.floor(L),H=w-N,U=L-X,K=ae,q=(k,J)=>v[(J&255)*g+(k&255)];return(q(N,X)*(1-K(H))+q(N+1,X)*K(H))*(1-K(U))+(q(N,X+1)*(1-K(H))+q(N+1,X+1)*K(H))*K(U)};return(w,L)=>.55*S(w/400+31,L/400+17)+.3*S(w/160+5,L/160+93)+.15*S(w/60+71,L/60+3)})(),nt=(c,g,v)=>v<100||v>1310?0:si((ve(c,g)-.42)/.2,0,1),ft=nr?1024:2048,Kt=document.createElement("canvas");Kt.width=Kt.height=ft;let ee=Kt.getContext("2d"),ne=(c,g)=>[(c+e/2)/e*ft,(g+n/2)/n*ft],ht=document.createElement("canvas");ht.width=ht.height=1024;let V=ht.getContext("2d"),Dt=(c,g)=>[(c+e/2)/e*1024,(g+n/2)/n*1024];function Ht(c,g,v,S=!1){c.beginPath(),g.forEach((w,L)=>{let N=v(...w);L?c.lineTo(...N):c.moveTo(...N)}),S&&c.closePath()}let re=ee.createImageData(ft,ft),ce=Li(23),De=new W,te=new W(-.72,.53,-.42).normalize();for(let c=0;c<ft;c++)for(let g=0;g<ft;g++){let v=(g/ft-.5)*e,S=(c/ft-.5)*n,w=_(v,S),L=_(v+30,S),N=_(v-30,S),X=_(v,S+30),H=_(v,S-30),U=(L-N)/60,K=(X-H)/60,q=si(-(L+N+X+H-4*w)/900*14,-.22,.22);De.set(-U,1,-K).normalize();let k=f(w),J=1/Math.sqrt(1+(U*U+K*K)/(l*l)),j=si((1-J-.27)*2.8,0,.67)*(k>720?1:.35),at=(ce()-.5)*10,pt=Math.sin(v*.008)*Math.cos(S*.007)*4,Ut=si((k-430)/760,0,1),dt=Ut+(Math.floor(Ut*5)+ae(Math.min(1,Math.max(0,(Ut*5%1-.35)/.3)))-Ut*5)/5*.6,Vt=si(1-dt*2,0,1),Gt=si(dt*2-1,0,1),St=Math.max(0,De.dot(te)),F=[0,1,2].map(it=>[136,184,96][it]*Vt+[86,146,74][it]*(1-Vt-Gt)+[108,146,92][it]*Gt+pt),ot=(.55+.55*St)*(1+q),_t=(c*ft+g)*4;{let it=nt(v,S,k)*(1-j*1.4),xt=.82+.3*ve(v*7.3,S*7.3);if(it>0)for(let ut=0;ut<3;ut++)F[ut]+=([44,104,62][ut]*xt-F[ut])*ae(Math.min(1,it))*.78}for(let it=0;it<3;it++)re.data[_t+it]=(F[it]*(1-j)+[200,190,164][it]*j)*ot+[6,4,-6][it]*St+[-6,-2,8][it]*(1-St)+at;re.data[_t+3]=255}ee.putImageData(re,0,0);for(let c of t.areas)["residential","religious","parking","water","grass","meadow","plaza","site"].includes(c.kind)&&(Ht(ee,c.ring,ne,!0),ee.fillStyle={residential:"#b7b6a0",religious:"#bdb9a6",parking:"#92998f",water:"#4fa6d8",grass:"#849268",meadow:"#899767",plaza:"#b9b4a1",site:"#a9a89c"}[c.kind],ee.fill(),["residential","religious","parking","water","plaza","site"].includes(c.kind)&&(Ht(V,c.ring,Dt,!0),V.fill()));ee.lineJoin="round";for(let c of t.buildings)c.style==="rural"||c.style==="tiantai"||(Ht(ee,c.ring,ne,!0),ee.strokeStyle="#a9a797",ee.lineWidth=Math.max(1.2,7/e*ft),ee.stroke());for(let c of t.buildings)Ht(ee,c.ring,ne,!0),ee.fillStyle="#bcbcaf",ee.fill(),Ht(V,c.ring,Dt,!0),V.fill(),V.lineWidth=3,V.stroke();for(let c of t.roads)Ht(V,c.pts,Dt),V.lineWidth=Math.max(2,(c.width+7)/e*1024),V.stroke();for(let c of t.water)Ht(ee,c.pts,ne),ee.strokeStyle="#4a9fd0",ee.lineWidth=c.kind==="river"?3:1,ee.stroke(),Ht(V,c.pts,Dt),V.lineWidth=5,V.stroke();let Ue=V.getImageData(0,0,1024,1024).data,He=(c,g)=>{let[v,S]=Dt(c,g).map(Math.floor);return v<0||S<0||v>=1024||S>=1024||Ue[(S*1024+v)*4+3]>0},Ne=nr?2048:4096,on=document.createElement("canvas");on.width=on.height=Ne;let un=on.getContext("2d"),mn=new gs(on);mn.flipY=!1,mn.generateMipmaps=!1,mn.minFilter=mn.magFilter=us;let Rn=new gs(Kt);Rn.colorSpace=Wn,Rn.anisotropy=p.capabilities.getMaxAnisotropy();let Tn=new ms(e,n,s-1,s-1).rotateX(-Math.PI/2);for(let c=0;c<o.length;c++)Tn.attributes.position.setY(c,o[c]);Tn.computeVertexNormals();let Fn=new Qe(Tn,ct("#ffffff",{map:Rn}));Fn.receiveShadow=!0,Tt.add(Fn),y&&Tt.add(Wg(y,Nd,e,n,ct("#ffffff",{map:Rn})));let ci={o:new On(0,0,1,0),s:new On(1,0,1,0)},Fs=y?{o:new On(...y.origin,y.fz,-y.fx),s:new On(-18,18,-14,14)}:{o:new On(0,0,1,0),s:new On(1,0,1,0)},as=(c,g)=>{let v=ci.o,S=ci.s,w=c-v.x,L=g-v.y,N=w*v.z+L*v.w,X=w*v.w-L*v.z;return N>S.x-3&&N<S.y+3&&X>S.z-3&&X<S.w+3};{let c=document.createElement("canvas");c.width=c.height=256;let g=c.getContext("2d"),v=g.createImageData(256,256),S=Li(7),w=(U,K)=>{let q=new Float32Array((U+1)*(U+1)),k=Li(K);for(let J=0;J<q.length;J++)q[J]=k();return(J,j)=>{let at=J*U,pt=j*U,Ut=Math.floor(at),dt=Math.floor(pt),Vt=at-Ut,Gt=pt-dt,St=ot=>ot*ot*(3-2*ot),F=(ot,_t)=>q[_t%U*(U+1)+ot%U];return(F(Ut,dt)*(1-St(Vt))+F(Ut+1,dt)*St(Vt))*(1-St(Gt))+(F(Ut,dt+1)*(1-St(Vt))+F(Ut+1,dt+1)*St(Vt))*St(Gt)}},L=w(64,11),N=w(16,12),X=w(8,13);for(let U=0;U<256;U++)for(let K=0;K<256;K++){let q=K/256,k=U/256,J=(U*256+K)*4,j=.55*L(q,k)+.45*S();v.data[J]=j*255,v.data[J+1]=(.6*N(q,k)+.4*X(q,k))*255,v.data[J+2]=128,v.data[J+3]=255}g.putImageData(v,0,0);let H=new gs(c);H.wrapS=H.wrapT=eo,H.anisotropy=8,Fn.material.onBeforeCompile=U=>{U.uniforms.detailMap={value:H},U.uniforms.roadMask={value:mn},U.uniforms.terrainWD={value:new fe(e,n)},U.uniforms.cutO={value:ci.o},U.uniforms.cutS={value:ci.s},U.uniforms.checkpointO={value:Fs.o},U.uniforms.checkpointS={value:Fs.s},U.vertexShader=U.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;`).replace("#include <project_vertex>",`#include <project_vertex>
vDetailPos=(modelMatrix*vec4(transformed,1.0)).xyz;`),U.fragmentShader=U.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;uniform sampler2D detailMap;uniform vec4 cutO;uniform vec4 cutS;uniform sampler2D roadMask;uniform vec2 terrainWD;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
if(texture2D(roadMask,vDetailPos.xz/terrainWD+.5).r>.5)discard;
{vec2 dq=vDetailPos.xz-cutO.xy;float cu=dot(dq,cutO.zw),cv=dot(dq,vec2(cutO.w,-cutO.z));if(cu>cutS.x&&cu<cutS.y&&cv>cutS.z&&cv<cutS.w)discard;}`).replace("#include <map_fragment>",`#include <map_fragment>
{float near=smoothstep(1600.0,150.0,length(vDetailPos-cameraPosition));float fine=texture2D(detailMap,vDetailPos.xz/7.0).r;float mid=texture2D(detailMap,vDetailPos.xz/61.0).g;diffuseColor.rgb*=mix(1.0,0.74+0.38*fine+0.22*(mid-0.5),near);}`);let K=U.fragmentShader;U.fragmentShader=K.replace("uniform vec4 cutS;","uniform vec4 cutS;uniform vec4 checkpointO;uniform vec4 checkpointS;").replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
{vec2 dq=vDetailPos.xz-checkpointO.xy;float cu=dot(dq,checkpointO.zw),cv=dot(dq,vec2(-checkpointO.w,checkpointO.z));if(cu>checkpointS.x&&cu<checkpointS.y&&cv>checkpointS.z&&cv<checkpointS.w)discard;}`)},Fn.material.needsUpdate=!0}let Ln=new G,_n=[];for(let c=0;c<s;c++)_n.push([c,0]);for(let c=1;c<s;c++)_n.push([s-1,c]);for(let c=s-2;c>=0;c--)_n.push([c,s-1]);for(let c=s-2;c>=0;c--)_n.push([0,c]);for(let c=1;c<_n.length;c++){let[g,v]=_n[c-1],[S,w]=_n[c],L=-e/2+g*e/(s-1),N=-n/2+v*n/(s-1),X=-e/2+S*e/(s-1),H=-n/2+w*n/(s-1);Ln.quad([L,o[v*s+g],N],[X,o[w*s+S],H],[X,u-90,H],[L,u-90,N],"#8f8974")}{let c=Ln.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),Tt),g=c.geometry.attributes.position,v=c.geometry.attributes.color,S=Pe("#6c6f5c"),w=Pe("#f3d6b2"),L=new fn;for(let N=0;N<g.count;N++)L.copy(S).lerp(w,g.getY(N)<u-80?1:0),v.setXYZ(N,L.r,L.g,L.b);c.castShadow=c.receiveShadow=!1}Xt("#load-text").textContent="\u6309\u771F\u5B9E\u8F6E\u5ED3\u91CD\u5EFA\u5C4B\u9876\u3001\u7A97\u6237\u548C\u6CBF\u8857\u7ACB\u9762",await new Promise(requestAnimationFrame);function Bs(c){let g=document.createElement("canvas");g.width=g.height=256;let v=g.getContext("2d");v.fillStyle=c==="roof"?"#e4e2da":"#e6e3d9",v.fillRect(0,0,256,256);let S=Li(c==="roof"?44:98);for(let L=0;L<3500;L++)v.fillStyle=`rgba(${S()>.5?"255,255,255":"50,55,44"},${S()*.07})`,v.fillRect(S()*256,S()*256,1+S()*3,1+S()*2);if(c==="roof"){for(let L=0;L<256;L+=12)v.fillStyle="#e3dfd540",v.fillRect(L,0,3,256),v.fillStyle="#222c2c2c",v.fillRect(L+8,0,2,256);for(let L=0;L<256;L+=20)v.fillStyle="#23333122",v.fillRect(0,L,256,1)}let w=new gs(g);return w.wrapS=w.wrapT=eo,w.colorSpace=Wn,w.anisotropy=8,w}let z={"#6A6F72":"#7b8da2","#8A4B35":"#a9483a","#B4623F":"#c9603d","#D9A93A":"#f6c02c","#7A2E26":"#b63a2a","#8C6A3E":"#b98a45","#3D4141":"#6f7f92","#C0582E":"#dc6435"},gt={"#F0EEE8":"#fbf4e6","#D8D6CF":"#e6dece","#EAEAE6":"#f5efe2","#D8A035":"#f2b33a","#E4D9C4":"#f3e3c0"},Pt=Bs("roof"),Ot=Bs("wall"),Lt=new G,Le=new G,$e=new G,tn=new G,an=new G,dn=[],ln=[],hn=[],Hn=[],wi="overture-6eed6b02-0a6b-40b7-9326-5247a9383063",$n=new Set([609757872,609561169,t.buildings.find(c=>c.id===wi)?.osmId,609909704,609909706]);for(let c of t.areas)for(let g of c.frame?.replaces||[])$n.add(t.buildings.find(v=>v.id===g)?.osmId);let zs=["#D9A93A","#7A2E26","#C0582E"],Zn=t.buildings.filter(c=>c.style==="temple"&&c.area>=240&&(zs.includes(c.roofColor)||c.osmId===609990009));for(let c of Zn)$n.add(c.osmId);let pn=nm,Dr=new Set(Object.values(pn));for(let c of Dr)$n.add(c);let Bn=[],ks=[],Ur=(c,g)=>{let v=new fn(c);return v.offsetHSL(0,0,g),"#"+v.getHexString()};for(let c=0;c<t.buildings.length;c++){let oe=function(Rt){let kt=-(Rt[0]-Gt)*Vt+(Rt[1]-St)*dt;return S+ot*si(1-Math.abs(kt)/F,0,1)},g=t.buildings[c];if($n.has(g.osmId))continue;let v=g.ring,S=g.base+g.wallHeight,w=Li(g.osmId),L=w(),N=g.style==="temple",X=gt[g.wallColor]||g.wallColor||(g.precinct==="\u767E\u5C81\u5BAB"?"#e8dfc2":g.kind==="temple"?g.roofColor==="gold"?"#cdb787":"#e6dbc1":"#ebe6d9"),H=z[g.roofColor]||(g.roofColor?.startsWith("#")?g.roofColor:g.roofColor==="gold"?"#c1a14e":"#5b6062"),U=Ur(H,(L-.5)*.06),K=g.levels||2,q=(g.wallHeight-.35)/K,k=!!g.lattice,J=(g.eave??.5)*1.6,j=k?"#2f2721":"#56676a",at=k?"#3a3029":"#687675",pt=0;v.forEach((Rt,kt)=>{let xe=v[(kt+1)%v.length];pt+=Rt[0]*xe[1]-xe[0]*Rt[1]});let Ut=new Set(g.partyEdges||[]);for(let Rt=0;Rt<v.length;Rt++){let en=function(zn,Xn,wn,xs,ts,jn,Zo=.035,Za=null,nc=!1){let Jo=kt[0]+he*Xn+Q*Zo,Ni=kt[1]+ie*Xn+Ft*Zo,Ji=xs/2,es=nc?Oe:he,_r=nc?Je:ie;zn.quad([Jo-es*Ji,wn,Ni-_r*Ji],[Jo+es*Ji,wn,Ni+_r*Ji],[Jo+es*Ji,wn+ts,Ni+_r*Ji],[Jo-es*Ji,wn+ts,Ni-_r*Ji],jn,Za)},kt=v[Rt],xe=v[(Rt+1)%v.length],_e=Math.hypot(xe[0]-kt[0],xe[1]-kt[1]);if(_e<.1)continue;let Z=Math.min(g.base,_(...kt)-.12),Et=Math.min(g.base,_(...xe)-.12),wt=N?g.base+.5:Math.min(g.base+.5,Z+1.2),Nt=N?g.base+.5:Math.min(g.base+.5,Et+1.2);if(Lt.quad([kt[0],wt,kt[1]],[xe[0],Nt,xe[1]],[xe[0],S,xe[1]],[kt[0],S,kt[1]],X,[[0,wt/8],[_e/8,Nt/8],[_e/8,S/8],[0,S/8]],c),(wt-Z>.25||Nt-Et>.25)&&$e.quad([kt[0],Z,kt[1]],[xe[0],Et,xe[1]],[xe[0],Nt,xe[1]],[kt[0],wt,kt[1]],"#9c9a93",null,c),Ut.has(Rt))continue;let Q=(pt>0?1:-1)*(xe[1]-kt[1])/_e,Ft=(pt>0?-1:1)*(xe[0]-kt[0])/_e,he=(xe[0]-kt[0])/_e,ie=(xe[1]-kt[1])/_e,Oe=Ft,Je=-Q,ar=Rt===g.front&&g.frontDist!=null&&g.frontDist<14,Rs=g.shopfront&&ar&&_e>2.4;if(_e>2.4){let zn=Math.max(1,Math.floor(_e/(N?3.1:3.3))),Xn=N?0:-Math.floor((g.base+.35-Math.min(wt,Nt))/q);for(let wn=Xn;wn<K;wn++)if(!(wn===0&&Rs))for(let xs=0;xs<zn;xs++){if(Rt!==g.front||wn!==K-1||xs%2)continue;let ts=(xs+.5)*_e/zn,jn=g.base+.35+wn*q+(wn===0?.95:.8),Zo=Math.min(1.75,q*.54),Za=N?1.3:k?1.1:1.4;wn<0&&jn<wt+(Nt-wt)*ts/_e+.35||en(tn,ts,jn,Za,Zo,(xs+wn)%3?j:at,.055)}if(Rt===g.front&&!Rs&&!N&&_e>3&&(en(tn,_e/2,g.base+.33,1.3,2.35,"#3a342d",.07),g.lanterns))for(let wn of[-1.15,1.15])Bn.push([kt[0]+he*(_e/2+wn)+Q*.45,g.base+2.45,kt[1]+ie*(_e/2+wn)+Ft*.45])}if(Rs){let zn=Math.max(1,Math.floor(_e/3.2)),Xn=_e/zn;for(let wn=0;wn<zn;wn++){let xs=(wn+.5)*Xn;en(tn,xs,g.base+.42,Xn-.42,2.3,wn%2?"#2b2622":"#322b25",.06),g.lanterns&&wn<4&&Bn.push([kt[0]+he*(xs-Xn/2+.3)+Q*.62,g.base+2.55,kt[1]+ie*(xs-Xn/2+.3)+Ft*.62])}en(an,_e/2,g.base+2.78,_e-.1,.42,g.style==="oldStreet"?"#7b2d22":"#6d5a45",.07)}}let[dt,Vt]=g.axis,[Gt,St]=g.rectCenter,F=Math.max(.8,g.depth/2),ot=g.roofRise;if([541482372,538484526,538484527,538484528,609990014,609990009].includes(g.osmId))continue;let it=(Rt,kt)=>[Rt/6,kt/6],xt=g.area/Math.max(1,g.width*g.depth),ut=g.partyGable?.12:J,rt=g.partyEave?Math.min(J,.15):J;if(g.hip&&xt>.82){let Rt=g.width/2+ut,kt=g.depth/2+rt,xe=S-ot*rt/F,_e=Math.max(0,g.width/2-g.depth/2),Z=(ie,Oe,Je)=>[Gt+dt*ie-Vt*Oe,Je,St+Vt*ie+dt*Oe],Et=Z(-Rt,-kt,xe),wt=Z(Rt,-kt,xe),Nt=Z(Rt,kt,xe),Q=Z(-Rt,kt,xe),Ft=Z(-_e,0,S+ot),he=Z(_e,0,S+ot);Le.quad(Et,wt,he,Ft,U,[it(-Rt,-kt),it(Rt,-kt),it(_e,0),it(-_e,0)],c),Le.quad(Nt,Q,Ft,he,U,[it(Rt,kt),it(-Rt,kt),it(-_e,0),it(_e,0)],c),Le.tri(wt,Nt,he,Ur(H,-.03),[it(Rt,-kt),it(Rt,kt),it(_e,0)],c),Le.tri(Q,Et,Ft,Ur(H,-.03),[it(-Rt,kt),it(-Rt,-kt),it(-_e,0)],c);for(let[ie,Oe]of[[Et,wt],[wt,Nt],[Nt,Q],[Q,Et],[Ft,he],[Et,Ft],[wt,he],[Nt,he],[Q,Ft]])dn.push(...ie,...Oe);continue}let At=g.horseHead?1:1+2*ut/Math.max(2,g.width),Ce=1+2*rt/Math.max(2,g.depth),It=Rt=>{let kt=(Rt[0]-Gt)*dt+(Rt[1]-St)*Vt,xe=-(Rt[0]-Gt)*Vt+(Rt[1]-St)*dt,_e=kt*At,Z=xe*Ce;return[Gt+dt*_e-Vt*Z,S+ot*(1-Math.abs(Z)/F),St+Vt*_e+dt*Z,_e,Z]};for(let Rt=0;Rt<v.length;Rt++){let kt=v[Rt],xe=v[(Rt+1)%v.length],_e=-(kt[0]-Gt)*Vt+(kt[1]-St)*dt,Z=-(xe[0]-Gt)*Vt+(xe[1]-St)*dt,Et=Math.hypot(xe[0]-kt[0],xe[1]-kt[1]),wt=_e*Z<0;if(wt&&g.horseHead&&Et>4){let Q=Et>9?5:3,Ft=Q===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let he=0;he<Q;he++){let ie=he/Q,Oe=(he+1)/Q,Je=[kt[0]+(xe[0]-kt[0])*ie,kt[1]+(xe[1]-kt[1])*ie],en=[kt[0]+(xe[0]-kt[0])*Oe,kt[1]+(xe[1]-kt[1])*Oe],ar=S+(ot+.95)*Ft[he]+.25,Rs=Math.max(oe(Je),oe(en))+.45,zn=Math.max(ar,Rs);Lt.quad([Je[0],S,Je[1]],[en[0],S,en[1]],[en[0],zn,en[1]],[Je[0],zn,Je[1]],X,null,c);let Xn=-(xe[1]-kt[1])/Et*.3,wn=(xe[0]-kt[0])/Et*.3;an.quad([Je[0]-Xn,zn-.04,Je[1]-wn],[en[0]-Xn,zn-.04,en[1]-wn],[en[0],zn+.2,en[1]],[Je[0],zn+.2,Je[1]],"#3e4144"),an.quad([Je[0],zn+.2,Je[1]],[en[0],zn+.2,en[1]],[en[0]+Xn,zn-.04,en[1]+wn],[Je[0]+Xn,zn-.04,Je[1]+wn],"#3e4144")}continue}let Nt=[kt];if(wt){let Q=_e/(_e-Z);Nt.push([kt[0]+(xe[0]-kt[0])*Q,kt[1]+(xe[1]-kt[1])*Q])}Nt.push(xe);for(let Q=1;Q<Nt.length;Q++){let Ft=Nt[Q-1],he=Nt[Q];Lt.quad([Ft[0],S,Ft[1]],[he[0],S,he[1]],[he[0],oe(he),he[1]],[Ft[0],oe(Ft),Ft[1]],X,null,c)}}for(let Rt of g.roofTriangles){let kt=Rt.map(It);Le.tri(...kt.map(xe=>xe.slice(0,3)),U,kt.map(xe=>it(xe[3],xe[4])),c)}for(let Rt=0;Rt<v.length;Rt++){let kt=It(v[Rt]),xe=It(v[(Rt+1)%v.length]);dn.push(kt[0],kt[1]+.06,kt[2],xe[0],xe[1]+.06,xe[2])}}let oo=Lt.mesh(ct("#ffffff",{vertexColors:!0,map:Ot,side:xn}),$t),Oa=Le.mesh(ct("#ffffff",{vertexColors:!0,map:Pt,side:xn}),$t);if(hn.push($e.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),$t)),Hn.push(tn.mesh(ct("#ffffff",{vertexColors:!0,roughness:.4,metalness:.05,side:xn}),$t)),an.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),$t),hn.push(oo,Oa),Bn.length){let c=jt=new Pr(ke(Ir[fi].hiShapes).lantern,Be({color:"#c8261c",emissive:"#8a1208",emissiveIntensity:.55,roughness:.5}),Bn.length),g=new xi;Bn.forEach((v,S)=>{g.position.set(...v),g.scale.set(1,1.25,1),g.updateMatrix(),c.setMatrixAt(S,g.matrix)}),$t.add(c),Hn.push(c)}if(ks.length){let c=new Pr(new Ei(.8,.55,.3),ct("#d8d8d2",{roughness:.6}),ks.length),g=new xi;ks.forEach((v,S)=>{g.position.set(v[0],v[1],v[2]),g.rotation.set(0,v[3],0),g.updateMatrix(),c.setMatrixAt(S,g.matrix)}),$t.add(c)}let Ti=new Pn;Ti.setAttribute("position",new sn(dn,3)),$t.add(new Ml(Ti,new Ra({color:"#2b2420",transparent:!0,opacity:.9})));function Ii(c,g,v,S,w,L,N,X=me,{hip:H=!1,upturn:U=!1}={}){let K=new G,q=w/2,k=L/2,J=H?Math.max(1,q-k*.8):q,j=[g-q,v+(U?.6:0),S-k],at=[g+q,v+(U?.6:0),S-k],pt=[g+q,v+(U?.6:0),S+k],Ut=[g-q,v+(U?.6:0),S+k],dt=[g-J,v+N,S],Vt=[g+J,v+N,S];K.quad(j,at,Vt,dt,"#ffffff"),K.quad(Ut,dt,Vt,pt,"#ffffff"),K.tri(j,dt,Ut,"#ffffff"),K.tri(at,pt,Vt,"#ffffff");let Gt=X.clone();if(Gt.map=Pt,Gt.side=xn,K.mesh(Gt,c),rn(c,[dt,Vt],X===I?"#ba9144":"#5b6459"),U)for(let[St,F,ot,_t]of[[g-q,S-k,-1,-1],[g+q,S-k,1,-1],[g-q,S+k,-1,1],[g+q,S+k,1,1]])rn(c,[[St-ot*3,v+.03,F-_t*1.8],[St,v+.6,F],[St+ot*.65,v+1.05,F+_t*.5]],"#71694c")}function ls(c,g,v){let S=new Cn;return S.position.set(c,_(c,g),g),S.userData.landmark=v,S.userData.placeId=el(v),$t.add(S),ln.push(S),S}function Di(c,g,v,S){let w=Math.atan2(v,S),L=Math.cos(w),N=Math.sin(w);return{rot:w,wp:(X,H)=>[c+X*L+H*N,g-X*N+H*L]}}function gn(c,g,v,S,w,L,N,X){let H=(k,J,j)=>[[0,0],[k/8,0],[k/8,j/8],[0,j/8]],U=w-S,K=v-g,q=N-L;c.quad([g,S,N],[v,S,N],[v,w,N],[g,w,N],X,H(K,0,U)),c.quad([v,S,L],[g,S,L],[g,w,L],[v,w,L],X,H(K,0,U)),c.quad([v,S,N],[v,S,L],[v,w,L],[v,w,N],X,H(q,0,U)),c.quad([g,S,L],[g,S,N],[g,w,N],[g,w,L],X,H(q,0,U)),c.quad([g,w,N],[v,w,N],[v,w,L],[g,w,L],X,[[g/8,N/8],[v/8,N/8],[v/8,L/8],[g/8,L/8]])}let Hs=new Map;{let c=t.buildings.find(g=>g.name==="\u5316\u57CE\u5BFA");if(c){let[g,v]=c.rectCenter,{rot:S,wp:w}=Di(g,v,-c.axis[0],-c.axis[1]),L=c.depth/2,N=c.width/2,X=c.width/58.75,H=ls(g,v,"\u5316\u57CE\u5BFA");H.rotation.y=S;let U=H.position.y,K=gt[c.wallColor]||c.wallColor||"#fbf4e6",q=z[c.roofColor]||c.roofColor||"#7b8da2",k="#3e4144",J="#4a4f50",j=new G,at=new G,pt=new G,Ut=(_t,it,xt)=>{let ut=xt===Math.max?-1e9:1e9;for(let rt=0;rt<=4;rt++)for(let At=-2;At<=2;At++)ut=xt(ut,_(...w(At*L/2,_t+(it-_t)*rt/4)));return ut-U},dt=[{name:"\u7075\u5B98\u6BBF",hall:8,court:3.75,doc:3.7,h:6,rise:2.4,wing:2.6},{name:"\u5929\u738B\u6BBF",hall:9.5,court:4.5,doc:5.2,h:6.4,rise:2.85,wing:2.6},{name:"\u5927\u96C4\u5B9D\u6BBF",hall:11.5,court:7.5,doc:6.4,h:8,rise:3.45,wing:3},{name:"\u85CF\u7ECF\u697C",hall:14,court:0,doc:9.1,h:10.5,rise:4.2}],Vt=_(...w(0,N+6))-U,Gt=N,St=-1e9;for(let _t of dt){_t.front=Gt,_t.hallBack=Gt-_t.hall*X,_t.back=_t.hallBack-_t.court*X,Gt=_t.back,_t.y=Math.max(Vt+_t.doc,Ut(_t.back,_t.front,Math.max)+.3,St),St=_t.y;let it=Ut(_t.back,_t.front,Math.min)-1.2;gn(pt,-L,L,it,_t.y,_t.back,_t.front,"#b9b7a4")}let F=.8;for(let[_t,it]of dt.entries()){let xt=it.hallBack,ut=it.front,rt=(xt+ut)/2,At=(ut-xt)/2,Ce=it.y+it.h,It=Ce+it.rise,oe=Ce-it.rise*F/At,Rt=Math.hypot(At+F,It-oe);gn(j,-L,L,it.y,Ce,xt,ut,K);for(let Z of[-1,1])j.tri([Z*L,Ce,xt],[Z*L,Ce,ut],[Z*L,It,rt],K,[[0,0],[At/4,0],[At/8,it.rise/8]]);at.quad([-L,oe,ut+F],[L,oe,ut+F],[L,It,rt],[-L,It,rt],q,[[-L/6,0],[L/6,0],[L/6,Rt/6],[-L/6,Rt/6]]),at.quad([L,oe,xt-F],[-L,oe,xt-F],[-L,It,rt],[L,It,rt],q,[[L/6,0],[-L/6,0],[-L/6,Rt/6],[L/6,Rt/6]]),gn(pt,-L,L,It-.12,It+.32,rt-.22,rt+.22,J);let kt=it.hall>9?5:3,xe=kt===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let Z of[-1,1])for(let Et=0;Et<kt;Et++){let wt=xt+(ut-xt)*Et/kt,Nt=xt+(ut-xt)*(Et+1)/kt,Q=Ce+(it.rise+.95)*xe[Et]+.3,Ft=Z*L-Z*.36,he=Z*L+Z*.06,ie=Z*L-Z*.48,Oe=Z*L+Z*.18;gn(j,Math.min(Ft,he),Math.max(Ft,he),Ce,Q,wt,Nt,K),gn(pt,Math.min(ie,Oe),Math.max(ie,Oe),Q,Q+.2,wt-.06,Nt+.06,k)}let _e=ut+.06;if(_t===0){for(let Z of[-L*.46,0,L*.46]){let Et=Z?2.6:3.3,wt=Z?3.7:4.5,Nt=new Lr;Nt.moveTo(-Et/2,0),Nt.lineTo(Et/2,0),Nt.lineTo(Et/2,wt-Et/2),Nt.absarc(0,wt-Et/2,Et/2,0,Math.PI,!1),Nt.lineTo(-Et/2,0);let Q=new Qe(new Al(Nt,14),O);Q.position.set(Z,it.y+.02,_e),H.add(Q)}gn(pt,-2.2,2.2,it.y+4.9,it.y+5.7,_e,_e+.12,"#2b2622");for(let Z of[-L*.7,-L*.23,L*.23,L*.7]){let Et=new Qe(new Gi(.42,10,7),yt);Et.position.set(Z,Ce-.75,ut+.55),Et.scale.y=1.22,H.add(Et)}}else if(_t===1){gn(pt,-1.8,1.8,it.y,it.y+3.4,_e-.02,_e+.06,"#3a2a1f");for(let Z of[-1,1])gn(pt,Z*5.2-1.1,Z*5.2+1.1,it.y+1.4,it.y+3.2,_e-.02,_e+.05,"#3a3029")}else if(_t===2){for(let Et=0;Et<=5;Et++){let wt=-L+1.2+Et*(2*L-2.4)/5;we(H,wt,it.y,ut+.42,.2,it.h-.1,yt)}for(let Et=0;Et<5;Et++){let wt=-L+1.2+(Et+.5)*(2*L-2.4)/5,Nt=(2*L-2.4)/5-.5;gn(pt,wt-Nt/2,wt+Nt/2,it.y+.2,it.y+it.h*.72,_e-.02,_e+.05,"#8a3a2a");for(let Q=1;Q<4;Q++)gn(pt,wt-Nt/2,wt+Nt/2,it.y+.2+Q*it.h*.18-.04,it.y+.2+Q*it.h*.18+.04,_e,_e+.08,"#4a2a20")}gn(pt,-2,2,Ce-1.3,Ce-.5,_e+.05,_e+.14,"#2b2622")}else{for(let Z of[ut+.05,xt-.05])for(let Et=0;Et<3;Et++)for(let wt=0;wt<5;wt++){let Nt=-L+(wt+.5)*2*L/5,Q=it.y+.9+Et*3.3;gn(pt,Nt-.85,Nt+.85,Q,Q+1.7,Z-.03,Z+.03,"#3a2a1f"),gn(pt,Nt-.04,Nt+.04,Q,Q+1.7,Z-.05,Z+.05,"#5a4633")}for(let Z=1;Z<3;Z++)gn(pt,-L,L,it.y+Z*3.3+.2,it.y+Z*3.3+.38,ut,ut+.45,"#5a4633")}if(it.court>0){let Z=it.back,Et=it.hallBack,wt=it.wing;for(let ie of[-1,1]){let Oe=ie*L,Je=ie*(L-wt),en=_t===2?3.2:3.6,ar=it.y+en+1.1,Rs=it.y+en-.1;gn(j,Math.min(Oe,Je),Math.max(Oe,Je),it.y,it.y+en,Z+.02,Et-.02,K),gn(j,Math.min(Oe,Oe-ie*.3),Math.max(Oe,Oe-ie*.3),it.y+en,ar,Z+.02,Et-.02,K),at.quad([Oe,ar,Z],[Oe,ar,Et],[Je-ie*.6,Rs,Et],[Je-ie*.6,Rs,Z],q,[[Z/6,0],[Et/6,0],[Et/6,(wt+.6)/6],[Z/6,(wt+.6)/6]]);let zn=Je-ie*.05;if(_t===2)for(let Xn=0;Xn<4;Xn++){let wn=Z+(Et-Z)*(Xn+.5)/4;gn(pt,Math.min(zn,zn-ie*.18),Math.max(zn,zn-ie*.18),it.y+.3,it.y+2.3,wn-.55,wn+.55,"#77736a")}else for(let Xn=0;Xn<2;Xn++){let wn=Z+(Et-Z)*(Xn+.5)/2;gn(pt,Math.min(zn,zn-ie*.06),Math.max(zn,zn-ie*.06),it.y+1,it.y+2.6,wn-.7,wn+.7,"#3a3029")}}let Nt=dt[_t+1],Q=Nt.y-it.y,Ft=Math.max(1,Math.ceil(Q/.18)),he=Math.min(.32,(Et-Z)*.7/Ft);for(let ie=0;ie<Ft;ie++)gn(pt,-3,3,it.y-.05,Nt.y-ie*Q/Ft,Z+ie*he,Z+(ie+1)*he,"#c2bfb0")}}{let _t=dt[0],it=_(...w(0,N+3))-U,xt=_t.y-it;if(xt>.25){let ut=Math.ceil(xt/.17),rt=.33;for(let At=0;At<ut;At++)gn(pt,-4.5,4.5,Math.min(it,Vt)-1,_t.y-(At+1)*xt/ut,N+At*rt,N+(At+1)*rt,"#c2bfb0");for(let At of[-1,1])gn(pt,At*5.4-.5,At*5.4+.5,it,it+.7,N+ut*rt-1.1,N+ut*rt-.1,"#9f9d92"),gn(pt,At*5.4-.35,At*5.4+.35,it+.7,it+1.8,N+ut*rt-.95,N+ut*rt-.25,"#9f9d92")}}j.mesh(ct("#ffffff",{vertexColors:!0,map:Ot,side:xn}),H),at.mesh(ct("#ffffff",{vertexColors:!0,map:Pt,side:xn}),H),pt.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),H),Hs.set("\u5316\u57CE\u5BFA",U+dt[2].y+dt[2].h+dt[2].rise);let ot=t.places.find(_t=>_t.n==="\u5316\u57CE\u5BFA");ot&&(ot.modelNote="\u6A21\u578B\u6309 OpenStreetMap \u5B9E\u6D4B\u5360\u5730\uFF08\u7EA6 59 \xD7 20 \u7C73\uFF0C\u8F74\u7EBF\u671D\u5411\u653E\u751F\u6C60\uFF09\u590D\u539F\u56DB\u8FDB\u9662\u843D\uFF1A\u7075\u5B98\u6BBF\u3001\u5929\u738B\u6BBF\u3001\u5927\u96C4\u5B9D\u6BBF\u3001\u85CF\u7ECF\u697C\uFF0C\u8FDB\u6DF1\u6309\u5B98\u65B9\u89C4\u5212\u6BD4\u4F8B\u7F29\u653E\uFF0C\u53F0\u57FA\u9010\u8FDB\u5347\u9AD8 3.7 / 1.5 / \u7EA6 1.2 / 2.7 \u7C73\uFF1B\u7B2C\u4E09\u3001\u56DB\u8FDB\u4E4B\u95F4\u4E3A\u7891\u5ECA\u9662\u3002\u5355\u4F53\u7ACB\u9762\u4E0E\u7EC6\u90E8\u4E3A\u8FD1\u4F3C\u3002")}}{let c=t.buildings.find(v=>v.id===wi),g=t.places.find(v=>v.n==="\u8089\u8EAB\u5B9D\u6BBF");if(c&&g){let[v,S]=c.rectCenter,{rot:w,wp:L}=Di(v,S,-c.axis[0],-c.axis[1]),N=c.depth,X=c.width,H=ls(v,S,"\u8089\u8EAB\u5B9D\u6BBF");H.rotation.y=w;let U=H.position.y,K=ct("#55606a",{roughness:.7,metalness:.25}),q=-1e9,k=1e9;for(let Gt=-2;Gt<=2;Gt++)for(let St=-2;St<=2;St++){let F=_(...L(Gt*N/4,St*X/4));q=Math.max(q,F),k=Math.min(k,F)}let J=q-U+.9,j=N-3.6,at=X-3.6;Yt(H,0,k-U-1,0,N+1.2,J-(k-U-1),X+1.2,be),Yt(H,0,J,0,j,6.2,at,yt),Ii(H,0,J+6.2,0,N+1.2,X+1.2,2.4,K,{hip:!0,upturn:!0}),Yt(H,0,J+6.2,0,j*.72,4.6,at*.72,yt),Ii(H,0,J+10.8,0,j*.72+2.6,at*.72+2.6,3.6,K,{hip:!0,upturn:!0});let pt=[...Array(6)].map((Gt,St)=>-(N/2-.45)+St*(N-.9)/5),Ut=[1,2,3,4].map(Gt=>-(X/2-.45)+Gt*(X-.9)/5);for(let Gt of[-1,1]){for(let St of pt)we(H,St,J,Gt*(X/2-.45),.22,6.2,be);for(let St of Ut)we(H,Gt*(N/2-.45),J,St,.22,6.2,be)}for(let Gt of[-j/3,0,j/3])Yt(H,Gt,J+.1,at/2+.02,j/3-.5,4.3,.1,O);Yt(H,0,J+4.8,at/2+.08,2.6,.8,.12,I);let dt=_(...L(0,X/2+2.5))-U,Vt=J-dt;if(Vt>.2){let Gt=Math.ceil(Vt/.17);for(let St=0;St<Gt;St++)Yt(H,0,dt-.6,X/2+.6+St*.32+.16,6,J-(St+1)*Vt/Gt-(dt-.6),.32,be)}Hs.set("\u8089\u8EAB\u5B9D\u6BBF",U+J+14.4),g.modelNote="\u6309\u5B98\u65B9\u63CF\u8FF0\u590D\u539F\u5317\u5411\u5165\u53E3\u3001\u7EA2\u5899\u3001\u6DF1\u8272\u94C1\u74E6\u91CD\u6A90\u6B47\u5C71\u3001\u7EA6 15 \u7C73\u6BBF\u9AD8\u4E0E 20 \u6839\u5916\u56F4\u77F3\u67F1\uFF1B\u4E3B\u6BBF\u843D\u5728\u5730\u56FE\u70B9\u4F4D\u5904\u7684\u5F71\u50CF\u8BC6\u522B\u8F6E\u5ED3\u4E0A\uFF0C\u4E24\u4FA7\u9EC4\u5899\u914D\u6BBF\u6309\u5404\u81EA\u8F6E\u5ED3\u5EFA\u6A21\u3002\u6BBF\u4F53\u6BD4\u4F8B\u4E0E\u53F0\u9636\u4E3A\u8FD1\u4F3C\u3002"}}function Jn(c,g,v,{repeat:S=!1}={}){let w=document.createElement("canvas");w.width=c,w.height=g,v(w.getContext("2d"),c,g);let L=new gs(w);return L.colorSpace=Wn,L.anisotropy=8,S&&(L.wrapS=L.wrapT=eo),L}function ws(c,g,v,S,w,L,N,{back:X=!1,emissive:H=0}={}){let U=new Qe(new ms(w,L),Be({map:N,roughness:.6,emissive:H?"#ffffff":"#000000",emissiveMap:H?N:null,emissiveIntensity:H}));return U.position.set(g,v+L/2,S),X&&(U.rotation.y=Math.PI),c.add(U),U}let Qh='"Songti SC","STSong","Noto Serif SC","PingFang SC",serif';function Nd(c,g){let v=si((c+e/2)/e*(s-1),0,s-1.001),S=si((g+n/2)/n*(s-1),0,s-1.001),w=v|0,L=S|0,N=v-w,X=S-L,H=o[L*s+w],U=o[L*s+w+1],K=o[(L+1)*s+w],q=o[(L+1)*s+w+1];return N+X<=1?H+N*(U-H)+X*(K-H):q+(1-N)*(K-q)+(1-X)*(U-q)}function di(c,g){let v=Nd(c,g);return y?y.height(c,g,v):v}function Od(c,g,v,S,w=3.5,L=[]){let N=js.triangulateShape(g.map(U=>new fe(U[0],U[1])),L.map(U=>U.map(K=>new fe(K[0],K[1])))),X=g.concat(...L),H=(U,K,q)=>{if(Math.max(Math.hypot(U[0]-K[0],U[1]-K[1]),Math.hypot(K[0]-q[0],K[1]-q[1]),Math.hypot(q[0]-U[0],q[1]-U[1]))>w){let J=(Ut,dt)=>[(Ut[0]+dt[0])/2,(Ut[1]+dt[1])/2],j=J(U,K),at=J(K,q),pt=J(q,U);H(U,j,pt),H(j,K,at),H(pt,at,q),H(j,at,pt);return}(K[1]-U[1])*(q[0]-U[0])-(K[0]-U[0])*(q[1]-U[1])<0&&([K,q]=[q,K]),c.tri([U[0],di(...U)+v,U[1]],[K[0],di(...K)+v,K[1]],[q[0],di(...q)+v,q[1]],S)};for(let[U,K,q]of N)H(X[U],X[K],X[q])}function Fd(c){let g=0;return c.forEach((v,S)=>{let w=c[(S+1)%c.length];g+=v[0]*w[1]-w[0]*v[1]}),g>0?1:-1}function Bd(c,g,{h:v=.3,w:S=.35,co:w="#a39e91"}={}){let L=Fd(g);for(let N=0;N<g.length;N++){let X=g[N],H=g[(N+1)%g.length],U=Math.hypot(H[0]-X[0],H[1]-X[1]);if(U<.05)continue;let K=Math.ceil(U/2.5),q=-L*(H[1]-X[1])/U*S,k=L*(H[0]-X[0])/U*S;for(let J=0;J<K;J++){let j=[X[0]+(H[0]-X[0])*J/K,X[1]+(H[1]-X[1])*J/K],at=[X[0]+(H[0]-X[0])*(J+1)/K,X[1]+(H[1]-X[1])*(J+1)/K],pt=di(...j),Ut=di(...at),dt=[j[0]+q,j[1]+k],Vt=[at[0]+q,at[1]+k],Gt=di(...dt),St=di(...Vt);c.quad([j[0],pt-.25,j[1]],[at[0],Ut-.25,at[1]],[at[0],Ut+v,at[1]],[j[0],pt+v,j[1]],w),c.quad([j[0],pt+v,j[1]],[at[0],Ut+v,at[1]],[Vt[0],St+v,Vt[1]],[dt[0],Gt+v,dt[1]],w),c.quad([dt[0],Gt+v,dt[1]],[Vt[0],St+v,Vt[1]],[Vt[0],St+.08,Vt[1]],[dt[0],Gt+.08,dt[1]],w)}}}{let c=t.areas.filter(v=>v.kind==="plaza"),g=t.areas.find(v=>v.id==="r4-plaza-lawn");if(c.length){let v=Jn(512,512,(U,K)=>{let q=Li(311),k=64;U.fillStyle="#7f7a70",U.fillRect(0,0,K,K);for(let J=0;J<16;J++)for(let j=-1;j<9;j++){let at=q(),pt=j*k+J%2*k/2,Ut=J*k/2,dt=((Math.floor((pt+k/4)/256)+Math.floor(Ut/256))%2+2)%2,Vt=dt?[172,166,153]:[188,182,168];U.fillStyle=`rgb(${Vt[0]+at*18|0},${Vt[1]+at*16|0},${Vt[2]+at*14|0})`,U.fillRect(pt+1.5,Ut+1.5,k-3,k/2-3)}U.fillStyle="#857f73",U.fillRect(0,0,K,32),U.fillRect(0,0,32,K),U.fillStyle="#c9c2b0",U.fillRect(0,32,K,5),U.fillRect(32,0,5,K),U.fillRect(0,0,K,3),U.fillRect(0,0,3,K);for(let J=0;J<12e3;J++)U.fillStyle=`rgba(${q()<.5?"255,255,255":"40,40,36"},${q()*.1})`,U.fillRect(q()*K,q()*K,1.5,1.5)},{repeat:!0}),S=new G,w=new G,L=(U,K)=>{let q=!1;for(let k=0,J=K.length-1;k<K.length;J=k++){let j=K[k],at=K[J];j[1]>U[1]!=at[1]>U[1]&&U[0]<(at[0]-j[0])*(U[1]-j[1])/(at[1]-j[1])+j[0]&&(q=!q)}return q};for(let U of c)Od(S,U.ring,.16,"#ffffff",3.5,g&&g.ring.every(K=>L(K,U.ring))?[g.ring]:[]),Bd(w,U.ring);let N=S.mesh(ct("#ffffff",{map:v,roughness:.93}),Tt);if(N.castShadow=!1,g){let U=Jn(256,256,(F,ot)=>{let _t=Li(77);F.fillStyle="#6f8b4f",F.fillRect(0,0,ot,ot);for(let it=0;it<6e3;it++)F.fillStyle=`rgba(${_t()<.5?"150,180,100":"50,80,40"},${.25*_t()})`,F.fillRect(_t()*ot,_t()*ot,1,2+_t()*3)},{repeat:!0}),K=new G;Od(K,g.ring,.24,"#ffffff",1.5);let q=K.mesh(ct("#ffffff",{map:U,roughness:1}),Tt);q.castShadow=!1,Bd(w,g.ring,{h:.4,w:.3,co:"#b3ad9f"});let k=g.ring,J=[k.reduce((F,ot)=>F+ot[0],0)/k.length,k.reduce((F,ot)=>F+ot[1],0)/k.length],j=[k[1][0]-k[0][0],k[1][1]-k[0][1]],at=[k[2][0]-k[1][0],k[2][1]-k[1][1]],pt=Math.hypot(...j),Ut=Math.hypot(...at),dt=[j[0]/pt,j[1]/pt],Vt=[at[0]/Ut,at[1]/Ut],Gt=[];for(let F=0;F<=128;F++){let ot=F/128*Math.PI*2;Gt.push([J[0]+dt[0]*Math.cos(ot)*pt*.36+Vt[0]*Math.sin(ot)*Ut*.4,J[1]+dt[1]*Math.cos(ot)*pt*.36+Vt[1]*Math.sin(ot)*Ut*.4])}let St=new G;for(let F=1;F<Gt.length;F++){let ot=Gt[F-1],_t=Gt[F],it=Math.hypot(_t[0]-ot[0],_t[1]-ot[1]),xt=-(_t[1]-ot[1])/it*.8,ut=(_t[0]-ot[0])/it*.8;St.quad([ot[0]-xt,di(ot[0]-xt,ot[1]-ut)+.45,ot[1]-ut],[_t[0]-xt,di(_t[0]-xt,_t[1]-ut)+.45,_t[1]-ut],[_t[0]+xt,di(_t[0]+xt,_t[1]+ut)+.45,_t[1]+ut],[ot[0]+xt,di(ot[0]+xt,ot[1]+ut)+.45,ot[1]+ut],"#c9c3b2")}St.mesh(ct("#ffffff",{vertexColors:!0,roughness:.95,side:xn,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),Tt)}w.mesh(ct("#ffffff",{vertexColors:!0,roughness:.9,side:xn}),Tt);let X=[];for(let U of c){let K=Fd(U.ring),q=8;for(let k=0;k<U.ring.length;k++){let J=U.ring[k],j=U.ring[(k+1)%U.ring.length],at=Math.hypot(j[0]-J[0],j[1]-J[1]);if(at<.05)continue;let pt=-K*(j[1]-J[1])/at,Ut=K*(j[0]-J[0])/at;for(let dt=q;dt<at;dt+=16){let Vt=J[0]+(j[0]-J[0])*dt/at+pt*1.2,Gt=J[1]+(j[1]-J[1])*dt/at+Ut*1.2;X.push([Vt,di(Vt,Gt)+.16,Gt])}q=((q-at)%16+16)%16}}if(X.length){let U=new xi,K=new Pr(new Vi(.07,.11,4.2,6),ct("#34383a",{roughness:.5,metalness:.4}),X.length),q=new Pr(new Ei(.46,.62,.46),Be({color:"#f3e2b8",emissive:"#ffcf7a",emissiveIntensity:.45,roughness:.5}),X.length),k=new Pr(new no(.42,.34,4),ct("#2f3333"),X.length);X.forEach((J,j)=>{U.rotation.set(0,Math.PI/4,0),U.position.set(J[0],J[1]+2.1,J[2]),U.updateMatrix(),K.setMatrixAt(j,U.matrix),U.position.set(J[0],J[1]+4.45,J[2]),U.updateMatrix(),q.setMatrixAt(j,U.matrix),U.position.set(J[0],J[1]+4.93,J[2]),U.updateMatrix(),k.setMatrixAt(j,U.matrix)});for(let J of[K,q,k])J.castShadow=!0,Ct.add(J)}let H=t.places.find(U=>U.n==="\u795E\u5149\u5CAD\u5E7F\u573A");H&&(Hs.set(H.n,_(H.x,H.z)+3),H.modelNote="\u5E7F\u573A\u94FA\u88C5\u3001\u8DEF\u7F18\u3001\u706F\u67F1\u4E0E\u897F\u5317\u89D2\u8349\u576A\u6309\u536B\u661F\u5F71\u50CF\u793A\u610F\u590D\u539F\uFF1B\u94FA\u5730\u7EB9\u6837\u4E0E\u706F\u5177\u6837\u5F0F\u4E3A\u793A\u610F\u3002")}}for(let c of t.roads){if(c.model!=="stair")continue;let[g,v]=c.pts,S=Math.hypot(v[0]-g[0],v[1]-g[1]),w=c.width/2,L=.4,N=w-L,{rot:X,wp:H}=Di(g[0],g[1],(v[0]-g[0])/S,(v[1]-g[1])/S),U=ls(g[0],g[1],"\u4E09\u89D2\u6D32\u8F66\u7AD9");U.rotation.y=X;let K=U.position.y,q=(ot,_t)=>{let[it,xt]=H(ot,_t);return Math.max(_(it,xt),di(it,xt))},k=.25,J=Math.ceil(S/k),j=[];for(let ot=0;ot<=J;ot++){let _t=-1e9;for(let it=-w;it<=w+.01;it+=w/3)_t=Math.max(_t,q(it,Math.min(S,ot*k)));j.push(_t+.06)}for(let ot=J-1;ot>=0;ot--)j[ot]=Math.max(j[ot],j[ot+1]);let at=j[0],pt=j[J],Ut=Math.max(1,Math.round((at-pt)/.15)),dt=(at-pt)/Ut,Vt=ct("#bdb8aa",{roughness:.85}),Gt=ct("#9d998b",{roughness:.9}),St=ct("#d2cdc0",{roughness:.8});for(let ot=0,_t=0,it=0;ot<Ut&&it<S;ot++){let xt=at-ot*dt;for(;_t<J&&j[_t]>xt-dt+1e-6;)_t++;let ut=Math.min(S,Math.max(it+.28,_t*k)),rt=(it+ut)/2,At=1e9;for(let oe of[it,rt,ut])for(let Rt of[-w,0,w])At=Math.min(At,q(Rt,oe));let Ce=At-.8-K,It=xt-K;Yt(U,0,Ce,rt,2*N,It-Ce,ut-it,Vt);for(let oe of[-1,1])Yt(U,oe*(N+L/2),Ce,rt,L,It+.85-Ce,ut-it,Gt),Yt(U,oe*(N+L/2),It+.85,rt,L+.1,.1,ut-it,St);it=ut}let F=t.places.find(ot=>ot.n==="\u4E09\u89D2\u6D32\u8F66\u7AD9");F&&(F.modelNote="\u8F66\u7AD9\u65C1\u4E0B\u5230\u795E\u5149\u5CAD\u5E7F\u573A\u7684\u53F0\u9636\u6309\u7528\u6237\u8BF4\u660E\u793A\u610F\u590D\u539F\uFF1A\u9AD8\u5DEE\u7EA6 12 \u7C73\uFF08\u5E7F\u573A\u5730\u9762\u5DF2\u6309\u6B64\u4FEE\u6B63\uFF09\uFF1B\u53F0\u9636\u5BBD\u5EA6\u3001\u7EA7\u6570\u548C\u8E0F\u6B65\u5C3A\u5BF8\u4E3A\u4F30\u8BA1\u3002")}{let c=t.buildings.find(v=>v.osmId===609909704),g=t.places.find(v=>v.n==="\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");if(c){let[v,S]=c.rectCenter,w=-c.axis[1],L=c.axis[0];_(v+w*6,S+L*6)>_(v-w*6,S-L*6)&&(w=-w,L=-L);let{rot:N,wp:X}=Di(v,S,w,L),H=ls(v,S,g?g.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");H.rotation.y=N;let U=H.position.y,K=c.width,q=c.depth,k=-1e9,J=1e9;for(let Z=-3;Z<=3;Z++){k=Math.max(k,_(...X(Z*K/6,-q/2)),_(...X(Z*K/6,0)));for(let Et of[-q/2,0,q/2,q/2+4])J=Math.min(J,_(...X(Z*K/6,Et)))}let j=_(...X(0,q/2+3))-U,at=Math.max(k-U+.25,j+1.2),pt=J-U-1.2,Ut=ct("#b3312a",{roughness:.7}),dt=ct("#dcd9cf",{roughness:.6}),Vt=ct("#5d6a74",{roughness:.8}),Gt=ct("#2a6184",{roughness:.7}),St=new Cn;St.position.y=at,H.add(St),Yt(H,0,pt,(-q/2+2.8)/2,K-.2,at-pt,2.8+q/2,be);{let Z=at-j,Et=Math.max(1,Math.ceil(Z/.16)),wt=new G;for(let Nt=0;Nt<Et;Nt++){let Q=at-(Nt+1)*Z/Et,Ft=2.8+Nt*.32;Yt(H,0,pt,Ft+.16,17,Q-pt,.32,dt);for(let he of[-1,1]){let ie=he*8.72;wt.quad([ie-.14*he,Q,Ft],[ie-.14*he,Q,Ft+.32],[ie-.14*he,Q+.9,Ft+.32],[ie-.14*he,Q+.9,Ft],"#e2dfd6"),wt.quad([ie+.14*he,Q,Ft],[ie+.14*he,Q,Ft+.32],[ie+.14*he,Q+.9,Ft+.32],[ie+.14*he,Q+.9,Ft],"#d6d3c9"),wt.quad([ie-.14,Q+.9,Ft],[ie+.14,Q+.9,Ft],[ie+.14,Q+.9,Ft+.32],[ie-.14,Q+.9,Ft+.32],"#eeebe3"),Nt%3===0&&Yt(H,ie,Q,Ft+.16,.3,1.15,.3,dt)}}wt.mesh(ct("#ffffff",{vertexColors:!0,roughness:.6,side:xn}),H)}let F=10.7,ot=9,_t=new Lr,it=(Z,Et,wt)=>{_t.lineTo(Z-Et,0),_t.lineTo(Z-Et,wt),_t.absarc(Z,wt,Et,Math.PI,0,!0),_t.lineTo(Z+Et,0)};_t.moveTo(-F,0),it(-6.8,1.9,3.9),it(0,2.7,5.2),it(6.8,1.9,3.9),_t.lineTo(F,0),_t.lineTo(F,ot),_t.lineTo(-F,ot),_t.lineTo(-F,0);let xt=new Qe(new Tl(_t,{depth:1.5,bevelEnabled:!1,curveSegments:18}),Ut);xt.position.z=-.2,xt.castShadow=xt.receiveShadow=!0,St.add(xt);for(let[Z,Et,wt]of[[-6.8,1.9,3.9],[0,2.7,5.2],[6.8,1.9,3.9]]){let Nt=new Lr;Nt.moveTo(Z-Et-.32,0),Nt.lineTo(Z-Et-.32,wt),Nt.absarc(Z,wt,Et+.32,Math.PI,0,!0),Nt.lineTo(Z+Et+.32,0),Nt.lineTo(Z+Et,0),Nt.lineTo(Z+Et,wt),Nt.absarc(Z,wt,Et,0,Math.PI,!1),Nt.lineTo(Z-Et,0),Nt.lineTo(Z-Et-.32,0);let Q=new Qe(new Tl(Nt,{depth:.06,bevelEnabled:!1,curveSegments:18}),ct("#e4ddca",{roughness:.6}));Q.position.z=1.3,St.add(Q)}for(let Z of[-9.7,-3.8,3.8,9.7])Yt(St,Z,0,.55,Z*Z>40?2.3:2.5,.7,1.8,dt);let ut=Z=>Jn(128,700,(Et,wt,Nt)=>{Et.fillStyle="#a52a22",Et.fillRect(0,0,wt,Nt),Et.strokeStyle="#d9b04a",Et.lineWidth=5,Et.strokeRect(8,8,wt-16,Nt-16),Et.fillStyle="#f0c85a",Et.font=`700 70px ${Qh}`,Et.textAlign="center",Et.textBaseline="middle",[...Z].forEach((Q,Ft)=>Et.fillText(Q,wt/2,50+Ft*(Nt-100)/(Z.length-1)))});ws(St,-3.8,2.95,1.33,1.05,5.85,ut("\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B")),ws(St,3.8,2.95,1.33,1.05,5.85,ut("\u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0"));let rt=Jn(2048,160,(Z,Et,wt)=>{Z.fillStyle="#1f4f78",Z.fillRect(0,0,Et,wt),Z.fillStyle="#2f8466",Z.fillRect(0,0,Et,26),Z.fillRect(0,wt-26,Et,26),Z.fillStyle="#d8ad45",Z.fillRect(0,26,Et,5),Z.fillRect(0,wt-31,Et,5);let Nt=Li(5);for(let Q=40;Q<Et;Q+=170){Z.strokeStyle="#e8e4d6",Z.lineWidth=4,Z.beginPath(),Z.arc(Q,wt/2,34,0,Math.PI*2),Z.stroke(),Z.fillStyle="#3a7fb0",Z.beginPath(),Z.arc(Q,wt/2,26,0,Math.PI*2),Z.fill(),Z.fillStyle="#d8ad45",Z.beginPath(),Z.arc(Q,wt/2,9,0,Math.PI*2),Z.fill(),Z.strokeStyle="#d8ad45",Z.lineWidth=5,Z.beginPath(),Z.moveTo(Q+48,wt/2);for(let Ft=0;Ft<6;Ft++)Z.quadraticCurveTo(Q+58+Ft*14,wt/2+(Ft%2?-22:22)*(.6+Nt()*.4),Q+66+Ft*14,wt/2);Z.stroke()}for(let Q=0;Q<Et;Q+=18)Z.fillStyle=Q%36?"#f4f1e6":"#c44b3a",Z.fillRect(Q,8,10,10),Z.fillRect(Q,wt-18,10,10)});Yt(St,0,ot,.55,2*F+.5,1.75,1.75,Gt),ws(St,0,ot,1.43,2*F+.5,1.75,rt),ws(St,0,ot,-.33,2*F+.5,1.75,rt,{back:!0});let At=Jn(840,250,(Z,Et,wt)=>{Z.fillStyle="#b8862f",Z.fillRect(0,0,Et,wt),Z.fillStyle="#e3bf62",Z.fillRect(10,10,Et-20,wt-20),Z.fillStyle="#161412",Z.fillRect(34,34,Et-68,wt-68),Z.fillStyle="#e6c25e",Z.font=`700 132px ${Qh}`,Z.textAlign="center",Z.textBaseline="middle",["\u76E1","\u7121","\u9858","\u884C"].forEach((Nt,Q)=>Z.fillText(Nt,Et*(.2+.2*Q),wt/2+4))});ws(St,0,ot+.15,1.5,4.2,1.25,At,{emissive:.12});let Ce=Jn(512,160,(Z,Et,wt)=>{Z.fillStyle="#2c6a52",Z.fillRect(0,0,Et,wt);for(let Nt=0;Nt<Et;Nt+=64)Z.fillStyle="#1f4f78",Z.fillRect(Nt+6,20,52,70),Z.fillStyle="#d8ad45",Z.fillRect(Nt+26,10,12,90),Z.fillStyle="#8a2f25",Z.fillRect(Nt+4,100,56,40);Z.fillStyle="#d8ad45",Z.fillRect(0,0,Et,6),Z.fillRect(0,wt-6,Et,6)});Yt(St,0,ot+1.75,.55,6.8,2.55,1.3,Gt),ws(St,0,ot+1.75,1.21,6.8,2.55,Ce),ws(St,0,ot+1.75,-.11,6.8,2.55,Ce,{back:!0});let It=Jn(180,320,(Z,Et,wt)=>{Z.fillStyle="#c79a3c",Z.fillRect(0,0,Et,wt),Z.fillStyle="#1a1715",Z.fillRect(22,34,Et-44,wt-68),Z.fillStyle="#e6c25e",Z.font=`700 92px ${Qh}`,Z.textAlign="center",Z.textBaseline="middle",Z.fillText("\u5C71",Et/2,wt*.33),Z.fillText("\u9580",Et/2,wt*.68)});ws(St,0,ot+1.95,1.25,.8,1.45,It,{emissive:.12});for(let Z of[-1,1])Yt(St,Z*6.8,ot+1.75,.55,4.8,1.05,1.1,Gt),ws(St,Z*6.8,ot+1.75,1.11,4.8,1.05,Ce);Ii(St,0,ot+4.3,.55,9.4,4.8,2.3,Vt,{hip:!0,upturn:!0});for(let Z of[-1,1])Ii(St,Z*6.8,ot+2.8,.55,6.4,4.2,1.8,Vt,{hip:!0,upturn:!0}),Ii(St,Z*10.4,ot+1.7,.55,3.6,3.8,1.5,Vt,{hip:!0,upturn:!0});{let Z=ot+4.3+2.3,Et=ct("#3d4a44",{roughness:.6,metalness:.2}),wt=new Qe(new Gi(.26,12,10),I);wt.position.set(0,Z+.55,.55),St.add(wt),we(St,0,Z,.55,.08,.35,I);for(let Nt of[-1,1]){let Q=[];for(let Oe=0;Oe<=12;Oe++){let Je=Oe/12;Q.push(new W(Nt*(.45+Je*2.1),Z+.12+Math.sin(Je*Math.PI*2.2)*.22+(1-Je)*.25,.55))}let Ft=new Qe(new Mh(new Ro(Q),32,.09,6),Et);St.add(Ft);let he=new Qe(new Gi(.16,8,6),Et);he.position.copy(Q[0]),he.position.y+=.12,St.add(he);let ie=Yt(St,Nt*2.78,Z-.1,.55,.28,.95,.32,Et);ie.rotation.z=-Nt*.25}}let oe=Jn(128,128,(Z,Et)=>{Z.fillStyle="#22201e",Z.fillRect(0,0,Et,Et);for(let wt of[32,96])for(let Nt of[32,96]){let Q=Z.createRadialGradient(wt-5,Nt-5,2,wt,Nt,15);Q.addColorStop(0,"#77716a"),Q.addColorStop(1,"#2a2724"),Z.fillStyle=Q,Z.beginPath(),Z.arc(wt,Nt,13,0,Math.PI*2),Z.fill()}},{repeat:!0});oe.repeat.set(2,2);let Rt=new Lr,kt=Z=>{let Et=Math.abs(Z);return Et<3.9?6.7+.9*(Z/3.9)**2:5.3+.9*((Et-7.15)/3.25)**2};Rt.moveTo(-10.4,0),Rt.lineTo(10.4,0);for(let Z=0;Z<=80;Z++){let Et=10.4-Z*20.8/80;Rt.lineTo(Et,kt(Et))}Rt.lineTo(-10.4,0);let xe=new Qe(new Al(Rt,4),Be({map:oe,roughness:.55,metalness:.35,side:xn}));xe.position.z=-1.15,St.add(xe);for(let Z of[-1,1]){let Et=new Qe(new vh(.24,.045,6,16),I);Et.position.set(Z*.75,3.1,-1.08),St.add(Et)}let _e=ct("#cfcbc0",{roughness:.8});for(let Z of[-9.7,-3.8,3.8,9.7]){Yt(St,Z,0,2.05,1.15,1.25,1.25,dt);let Et=new Cn;Et.position.set(Z,1.25,2.05),St.add(Et),Yt(Et,0,0,-.05,.62,.75,.95,_e);let wt=new Qe(new Gi(.4,10,8),_e);wt.position.set(0,1.05,.2),wt.scale.set(1,.95,.85),Et.add(wt);let Nt=new Qe(new Gi(.47,10,8),_e);Nt.position.set(0,.95,.05),Nt.scale.set(1.05,1,.7),Et.add(Nt);let Q=new Qe(new Gi(.17,8,6),_e);Q.position.set(Z<0?.22:-.22,.1,.42),Et.add(Q)}for(let Z of[-1,1])Yt(St,Z*11.75,0,.1,1.7,4.2,.9,ct("#d6a13a")),Yt(St,Z*11.75,4.2,.1,2,.32,1.3,Vt);Hs.set(g?g.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8",U+at+17),g&&(g.modelNote="\u95E8\u697C\u6309\u7528\u6237\u63D0\u4F9B\u7684\u5B9E\u666F\u7167\u7247\u590D\u539F\uFF1A\u4E09\u62F1\u7EA2\u8272\u724C\u697C\u3001\u5185\u4FA7\u4E24\u67F1\u91D1\u5B57\u5BF9\u8054\uFF08\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B / \u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0\uFF09\u3001\u5F69\u753B\u989D\u678B\u3001\u4E2D\u533E\u201C\u884C\u9858\u7121\u76E1\u201D\u3001\u4E0A\u90E8\u201C\u5C71\u9580\u201D\u7AD6\u533E\u3001\u4E94\u5EA7\u5C4B\u9876\uFF0C\u62F1\u540E\u4E3A\u9ED1\u8272\u94C1\u9489\u5927\u95E8\uFF0C\u95E8\u524D\u77F3\u72EE\u4E0E\u6C49\u767D\u7389\u680F\u6746\u77F3\u9636\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002")}}{let c=t.buildings.find(S=>S.osmId===609909706),g=t.buildings.find(S=>S.osmId===609909704),v=t.places.find(S=>S.n==="\u8089\u8EAB\u5B9D\u6BBF-\u5730\u85CF\u7985\u5BFA");if(c){let[S,w]=c.rectCenter,L=-c.axis[0],N=-c.axis[1];g&&(g.center[0]-S)*L+(g.center[1]-w)*N<0&&(L=-L,N=-N);let{rot:X,wp:H}=Di(S,w,L,N),U=Math.cos(X),K=Math.sin(X),q=([Q,Ft])=>[(Q-S)*U-(Ft-w)*K,(Q-S)*K+(Ft-w)*U],k=c.ring.map(q),J=k.map(Q=>Q[0]),j=(Math.max(...J)-Math.min(...J))/2,at=(Math.max(...J)+Math.min(...J))/2,pt=k.filter(Q=>Math.abs(Q[0]-at)>j*.6),Ut=Math.max(...pt.map(Q=>Q[1])),dt=Math.min(...pt.map(Q=>Q[1])),Vt=Math.min(...k.map(Q=>Q[1])),Gt=k.filter(Q=>Q[1]<dt-.5),St=ls(S,w,v?v.n:"\u5730\u85CF\u7985\u5BFA");St.rotation.y=X;let F=St.position.y,ot=ct("#a8302a",{roughness:.7}),_t=ct("#5d6a74",{roughness:.8}),it=ct("#d6a23c"),xt=ct("#4a2a22"),ut=[],rt=1e9;for(let Q=0;Q<=6;Q++)for(let Ft=0;Ft<=6;Ft++){let he=_(...H(at-j+Q*j/3,dt+(Ut-dt)*Ft/6));ut.push(he),rt=Math.min(rt,he)}ut.sort((Q,Ft)=>Q-Ft);let At=ut[Math.floor(ut.length*.7)]-F+.5,Ce=rt-F-1.2,It=2*j,oe=Ut-dt,Rt=(Ut+dt)/2;Yt(St,at,Ce,Rt,It+1.6,At-Ce,oe+1.6,be);{let Q=_(...H(at,Ut+4))-F,Ft=At-Q;if(Ft>.2){let he=Math.ceil(Ft/.16);for(let ie=0;ie<he;ie++)Yt(St,at,Ce,Ut+.8+ie*.3+.15,10,At-(ie+1)*Ft/he-Ce,.3,be);for(let ie of[-1,1])Yt(St,at+ie*5.3,Ce,Ut+.8+he*.15,.5,At+.9-Ce,he*.3,be)}}let kt=6.8;Yt(St,at,At,Rt,It-4.4,kt,oe-4.4,it);let xe=Jn(256,256,(Q,Ft)=>{Q.fillStyle="#6b2a20",Q.fillRect(0,0,Ft,Ft),Q.strokeStyle="#3a1a14",Q.lineWidth=3;for(let he=8;he<Ft;he+=16)Q.beginPath(),Q.moveTo(he,0),Q.lineTo(he,Ft*.7),Q.stroke(),Q.beginPath(),Q.moveTo(0,he*.7),Q.lineTo(Ft,he*.7),Q.stroke();Q.fillStyle="#5a221a",Q.fillRect(0,Ft*.72,Ft,Ft*.28),Q.strokeStyle="#c9a24a",Q.lineWidth=4,Q.strokeRect(4,4,Ft-8,Ft-8)}),_e=7;for(let Q=0;Q<_e;Q++){let Ft=at-(It-4.4)/2+(Q+.5)*(It-4.4)/_e;ws(St,Ft,At+.15,Ut-2.2+.03,(It-4.4)/_e-.35,kt*.75,xe)}for(let Q=0;Q<=8;Q++){let Ft=at-It/2+.6+Q*(It-1.2)/8;we(St,Ft,At,Ut-.6,.3,kt,ot),we(St,Ft,At,dt+.6,.3,kt,ot)}for(let Q=1;Q<7;Q++){let Ft=dt+.6+Q*(oe-1.2)/7;we(St,at-It/2+.6,At,Ft,.3,kt,ot),we(St,at+It/2-.6,At,Ft,.3,kt,ot)}Yt(St,at,At+kt-.9,Ut-.6,It-.6,.9,.5,ot),Ii(St,at,At+kt,Rt,It+2.4,oe+2.4,3.1,_t,{hip:!0,upturn:!0});let Z=It*.6,Et=oe*.55,wt=5.4;Yt(St,at,At+kt,Rt,Z,wt,Et,xt);for(let Q=0;Q<=6;Q++)we(St,at-Z/2+.3+Q*(Z-.6)/6,At+kt+2.2,Rt+Et/2+.25,.24,wt-2.2,ot);for(let Q=0;Q<6;Q++){let Ft=at-Z/2+.3+(Q+.5)*(Z-.6)/6;ws(St,Ft,At+kt+2.6,Rt+Et/2+.02,(Z-.6)/6-.4,2.2,xe)}let Nt=Jn(420,140,(Q,Ft,he)=>{Q.fillStyle="#c79a3c",Q.fillRect(0,0,Ft,he),Q.fillStyle="#1a1715",Q.fillRect(16,16,Ft-32,he-32),Q.strokeStyle="#e6c25e",Q.lineWidth=3,Q.strokeRect(24,24,Ft-48,he-48)});ws(St,at,At+kt+wt-1.6,Rt+Et/2+.35,3.6,1.2,Nt),Ii(St,at,At+kt+wt,Rt,Z+3.4,Et+3.4,3.8,_t,{hip:!0,upturn:!0});{let Q=At+kt+wt+3.8,Ft=ct("#3d4a44",{roughness:.6,metalness:.2}),he=Math.max(1,(Z+3.4)/2-(Et+3.4)/2*.8);for(let Oe of[-1,1]){let Je=Yt(St,at+Oe*he,Q-.15,Rt,.35,1.2,.4,Ft);Je.rotation.z=-Oe*.25}we(St,at,Q,Rt,.1,.5,I);let ie=new Qe(new Gi(.3,12,10),I);ie.position.set(at,Q+.75,Rt),St.add(ie)}if(Gt.length){let Q=Gt.map(en=>en[0]),Ft=Math.max(...Q)-Math.min(...Q),he=(Math.max(...Q)+Math.min(...Q))/2,ie=(dt+Vt)/2,Oe=dt-Vt,Je=Math.max(...[0,.5,1].map(en=>_(...H(he,Vt+Oe*en))))-F;Yt(St,he,Math.min(Je,At)-1,ie,Ft,Math.max(At,Je+.3)-Math.min(Je,At)+1+4.6,Oe,it),Ii(St,he,Math.max(At,Je+.3)+4.6,ie,Ft+1.6,Oe+1.6,2,_t,{hip:!0,upturn:!0})}Hs.set(v?v.n:"\u5730\u85CF\u7985\u5BFA",Math.max(Hs.get(v?.n)??0,F+At+kt+wt+5)),v&&(v.modelNote="\u5317\u95E8\u540E\u7684\u5927\u6BBF\u6309\u7528\u6237\u6307\u8BA4\uFF08OSM way 609909706\uFF09\u505A\u6210\u91CD\u6A90\u6B47\u5C71\u6BBF\u5802\uFF1A\u77F3\u53F0\u57FA\u3001\u7EA2\u67F1\u56DE\u5ECA\u3001\u6728\u683C\u95E8\u3001\u9EC4\u5899\u3001\u4E0A\u5C42\u6728\u6784\u3002\u6BBF\u540D\u4E0E\u5C3A\u5BF8\u672A\u89C1\u516C\u5F00\u8D44\u6599\uFF0C\u5F62\u5236\u4E3A\u793A\u610F\uFF1B\u9662\u4E2D\u65B9\u4EAD\u6309\u536B\u661F\u5F71\u50CF\u4E0E\u5B9E\u666F\u7167\u7247\u8865\u51FA\u3002");{let[Q,Ft]=[-1807,82],he=ls(Q,Ft,v?v.n:"\u5730\u85CF\u7985\u5BFA");he.rotation.y=X,Yt(he,0,-1.2,0,7.6,1.6,7.6,be);for(let Je of[-1,1])for(let en of[-1,1])we(he,Je*2.9,.4,en*2.9,.22,3.6,ot);Yt(he,0,3.6,0,6.4,.45,6.4,ct("#2a6184",{roughness:.7})),Ii(he,0,4.05,0,8.6,8.6,2.8,_t,{hip:!0,upturn:!0});let ie=new Qe(new Gi(.28,12,10),I);ie.position.set(0,7.2,0),he.add(ie),we(he,0,6.8,0,.08,.4,I);let Oe=ct("#6a5534",{roughness:.45,metalness:.55});we(he,0,.4,0,.7,1.1,Oe),Ii(he,0,1.5,0,1.7,1.7,.7,Oe,{hip:!0,upturn:!0})}}}let ao=null;{let c=t.areas.find(v=>v.id==="r4-juzhilin-site"),g=t.places.find(v=>v.featured);if(c&&g){let pt=function(b,B,$,vt,zt,Wt=256){return Jn(Wt,Wt,(se,Ee)=>{let Ye=Li(b),Ge=[];for(let Sn=0;Sn<B;Sn++)for(let Dn=0;Dn<B;Dn++)Ge.push([(Dn+.12+.76*Ye())*Ee/B,(Sn+.12+.76*Ye())*Ee/B,at($[Math.floor(Ye()*$.length)]),.86+.28*Ye()]);let cn=se.createImageData(Ee,Ee),Mn=at(vt);for(let Sn=0;Sn<Ee;Sn++)for(let Dn=0;Dn<Ee;Dn++){let Nn=1e9,_i=1e9,vs=null;for(let ns of Ge){let cr=Math.abs(Dn-ns[0]),tl=Math.abs(Sn-ns[1]);cr=Math.min(cr,Ee-cr),tl=Math.min(tl,Ee-tl);let hc=cr*cr+tl*tl;hc<Nn?(_i=Nn,Nn=hc,vs=ns):hc<_i&&(_i=hc)}let Ms=(Sn*Ee+Dn)*4,Ds=Math.sqrt(_i)-Math.sqrt(Nn),Vr=(Ye()-.5)*18;if(Ds<zt)for(let ns=0;ns<3;ns++)cn.data[Ms+ns]=Mn[ns]+Vr*.4;else{let ns=vs[3]*(Ds<zt+2.5?.82:1);for(let cr=0;cr<3;cr++)cn.data[Ms+cr]=vs[2][cr]*ns+Vr}cn.data[Ms+3]=255}se.putImageData(cn,0,0)},{repeat:!0})},Mt=function(b,B,$,vt,zt,Wt,se,Ee=2){if($-B<.001||zt-vt<.001||se-Wt<.001)return;let Ye=$-B,Ge=zt-vt,cn=se-Wt,Mn=new Ei(Ye,Ge,cn),Sn=Mn.attributes.uv,Dn=[[cn,Ge,Wt,vt],[cn,Ge,Wt,vt],[Ye,cn,B,Wt],[Ye,cn,B,Wt],[Ye,Ge,B,vt],[Ye,Ge,B,vt]];for(let Nn=0;Nn<6;Nn++)for(let _i=0;_i<4;_i++){let vs=Nn*4+_i;Sn.setXY(vs,(Sn.getX(vs)*Dn[Nn][0]+Dn[Nn][2])/Ee,(Sn.getY(vs)*Dn[Nn][1]+Dn[Nn][3])/Ee)}Mn.translate((B+$)/2,(vt+zt)/2,-(Wt+se)/2),Oi(Mn,b)},Mi=function(b,B,$,vt,zt,Wt=[[0,0],[1,0],[1,1],[0,1]]){let se=new Pn,Ee=[B,$,vt,B,vt,zt].map(Op).flat(),Ye=[0,1,2,0,2,3].map(Ge=>Wt[Ge]).flat();se.setAttribute("position",new sn(Ee,3)),se.setAttribute("uv",new sn(Ye,2)),se.computeVertexNormals(),Oi(se,b)},Qx=function(b,B,$,vt,zt=[[0,0],[1,0],[.5,1]]){let Wt=new Pn;Wt.setAttribute("position",new sn([B,$,vt].map(Op).flat(),3)),Wt.setAttribute("uv",new sn(zt.flat(),2)),Wt.computeVertexNormals(),Oi(Wt,b)},vr=function(b,B,$=1.05){for(let vt=1;vt<b.length;vt++){let zt=b[vt-1],Wt=b[vt],se=B[vt-1],Ee=B[vt];Mi(nc,[zt[0],se,zt[1]],[Wt[0],Ee,Wt[1]],[Wt[0],Ee+$,Wt[1]],[zt[0],se+$,zt[1]]);let Ye=new Ei(1,1,1),Ge=Wt[0]-zt[0],cn=Wt[1]-zt[1],Mn=Math.hypot(Ge,cn);Ye.scale(Mn,.035,.05),Ye.rotateY(Math.atan2(cn,Ge)),Ye.rotateZ(0),Ye.translate((zt[0]+Wt[0])/2,(se+Ee)/2+$,-(zt[1]+Wt[1])/2),Oi(Ye,Jo)}},pi=function(b,B,$,vt=xs){cs(vt,b,B,$,.3,.42,10,.26),zi(vt,b,B+.62,$+.18,.3,.28,.12)},Gs=function(b,B,$,vt=.45){cs(jn,b,B,$,.05,.7,6),cs(ts,b,B+.7,$,vt,.05,16)},kr=function(b,B,$,vt=.12,zt=.35,Wt=1){Mt(Ji,b-vt/2,b+vt/2,B,B+zt,$-.02,$+.04*Wt)},v=c.frame,S=v.origin,w=v.u,L=[w[1],-w[0]],N=v.length,X=v.depth,H=v.front,U=-9,K=(b,B)=>[S[0]+w[0]*b+L[0]*B,S[1]+w[1]*b+L[1]*B],q=_(...K(3,H))+.25,k=b=>_(...K(b,H))+.25-q,J=(b,B)=>di(...K(b,B))-q;ci.o.set(S[0],S[1],w[0],w[1]),ci.s.set(0,N,H,X);let j=ls(S[0],S[1],g.n);j.position.y=q,j.rotation.y=Math.atan2(-L[0],-L[1]);let at=b=>[parseInt(b.slice(1,3),16),parseInt(b.slice(3,5),16),parseInt(b.slice(5,7),16)],Ut=pt(41,9,["#8e8b84","#7d7a73","#9a968d","#6f6d68","#a8a296"],"#c9c5bb",1.6),dt=pt(57,7,["#a8855f","#94765a","#b99c78","#7f6a55","#c2a784","#8c7b6b"],"#efe9dc",2.4),Vt=Jn(256,256,(b,B)=>{let $=Li(9);for(let vt=0;vt<16;vt++){let zt=$();b.fillStyle=`rgb(${104+zt*18|0},${70+zt*12|0},${48+zt*9|0})`,b.fillRect(vt*16,0,16,B),b.fillStyle="#3b2618",b.fillRect(vt*16+14,0,2,B)}for(let vt=0;vt<2500;vt++)b.fillStyle=`rgba(40,22,12,${$()*.12})`,b.fillRect($()*B,$()*B,1,6+$()*14)},{repeat:!0}),Gt=Jn(256,256,(b,B)=>{let $=Li(13);for(let vt=0;vt<18;vt++){let zt=vt*B/18;for(let Wt=-(vt*53%120);Wt<B;Wt+=120+vt*31%60){let se=$();b.fillStyle=`rgb(${120+se*22|0},${80+se*14|0},${60+se*10|0})`,b.fillRect(Wt,zt,118+vt*31%60,B/18-1.6)}}for(let vt=0;vt<3e3;vt++)b.fillStyle=`rgba(50,28,18,${$()*.1})`,b.fillRect($()*B,$()*B,10+$()*20,1)},{repeat:!0}),St=Jn(256,256,(b,B)=>{let $=Li(21);b.fillStyle="#5e2716",b.fillRect(0,0,B,B);let vt=B/10,zt=B/8;for(let Wt=0;Wt<8;Wt++)for(let se=0;se<10;se++){let Ee=se*vt,Ye=Wt*zt,Ge=$(),cn=b.createLinearGradient(Ee,0,Ee+vt,0),Mn=[184+Ge*20,86+Ge*16,48+Ge*10];cn.addColorStop(0,`rgb(${Mn[0]*.55|0},${Mn[1]*.55|0},${Mn[2]*.55|0})`),cn.addColorStop(.45,`rgb(${Mn[0]|0},${Mn[1]|0},${Mn[2]|0})`),cn.addColorStop(.62,`rgb(${Math.min(255,Mn[0]*1.14)|0},${Mn[1]*1.12|0},${Mn[2]*1.1|0})`),cn.addColorStop(1,`rgb(${Mn[0]*.5|0},${Mn[1]*.5|0},${Mn[2]*.5|0})`),b.fillStyle=cn,b.fillRect(Ee+1,Ye+2,vt-2,zt-2),b.fillStyle="rgba(40,14,6,.55)",b.fillRect(Ee,Ye,vt,3)}},{repeat:!0}),F=(b,B,$)=>Jn(128,128,(vt,zt)=>{let Wt=Li($);vt.fillStyle=b,vt.fillRect(0,0,zt,zt);for(let se=0;se<3500;se++)vt.fillStyle=B[Math.floor(Wt()*B.length)],vt.fillRect(Wt()*zt,Wt()*zt,1+Wt()*1.5,1+Wt()*1.5)},{repeat:!0}),ot=F("#cdc2ae",["#e6dccb","#a99b86","#bfb09a","#8f8270"],3),_t=F("#565f6b",["#79828d","#3c434c","#8b939c","#4a525c"],4),it=F("#edebe5",["#f6f4ef","#e2dfd7","#e8e5de"],5),xt=Jn(128,128,(b,B)=>{b.fillStyle="#d8d3c7",b.fillRect(0,0,B,B),b.strokeStyle="#b8b2a5",b.lineWidth=2;for(let $=0;$<=B;$+=B/2)b.beginPath(),b.moveTo($,0),b.lineTo($,B),b.stroke(),b.beginPath(),b.moveTo(0,$),b.lineTo(B,$),b.stroke()},{repeat:!0}),ut=Jn(256,192,(b,B,$)=>{let vt=b.createLinearGradient(0,0,0,$);vt.addColorStop(0,"#ffe2ad"),vt.addColorStop(.55,"#f4bf73"),vt.addColorStop(1,"#c8813e"),b.fillStyle=vt,b.fillRect(0,0,B,$),b.fillStyle="#f7ecd6",b.fillRect(B*.1,$*.62,B*.46,$*.2),b.fillStyle="#8a5a36",b.fillRect(B*.1,$*.52,B*.46,$*.1),b.fillStyle="#fff3d8",b.beginPath(),b.arc(B*.75,$*.34,$*.1,0,Math.PI*2),b.fill(),b.fillStyle="#6d4a30",b.fillRect(B*.72,$*.44,B*.06,$*.4),b.fillStyle="#2a2b2d",b.fillRect(0,0,B,7),b.fillRect(0,$-7,B,7),b.fillRect(0,0,7,$),b.fillRect(B-7,0,7,$),b.fillRect(B/2-3,0,6,$)}),rt=(b,B={})=>Be({color:b,roughness:.85,side:xn,...B}),At=rt("#ffffff",{map:it}),Ce=rt("#223044"),It=rt("#ffffff",{map:Vt,roughness:.75}),oe=rt("#ffffff",{map:Ut,roughness:.95}),Rt=rt("#ffffff",{map:dt,roughness:.95}),kt=rt("#ffffff",{map:St,roughness:.7}),xe=rt("#8a3b21",{roughness:.7}),_e=rt("#ffffff",{map:Gt,roughness:.8}),Z=rt("#ffffff",{map:ot}),Et=rt("#ffffff",{map:_t}),wt=rt("#ffffff",{map:xt}),Nt=rt("#a9a99f"),Q=rt("#c9c4b8"),Ft=rt("#2c2e31",{roughness:.5}),he=rt("#6e2c1f",{roughness:.6}),ie=rt("#4a4e52",{roughness:.6}),Oe=rt("#ddd8cc"),Je=rt("#ebe8e0"),en=rt("#8d3c26"),ar=rt("#9a6a36"),Rs=rt("#56683a"),zn=rt("#3b5a33"),Xn=rt("#5b4636"),wn=rt("#bd8e78"),xs=rt("#a9763d"),ts=rt("#6b4a30"),jn=rt("#26282b",{roughness:.45,metalness:.5}),Zo=rt("#c93a24"),Za=rt("#17344d",{roughness:.06,metalness:.45}),nc=Be({color:"#cfeee9",transparent:!0,opacity:.26,roughness:.05,metalness:.1,side:xn,depthWrite:!1}),Jo=rt("#8fe0d2",{emissive:"#7fe7d6",emissiveIntensity:.55}),Ni=rt("#ffb24a",{emissive:"#ff9f2e",emissiveIntensity:2.2}),Ji=rt("#ffdca0",{emissive:"#ffc46b",emissiveIntensity:1.8}),es=Be({map:ut,emissive:"#ffffff",emissiveMap:ut,emissiveIntensity:.8,roughness:.25,side:xn}),_r=new Map,Oi=(b,B)=>{_r.has(B)||_r.set(B,[]),_r.get(B).push(b.index?b.toNonIndexed():b)},Op=([b,B,$])=>[b,B,-$],jo=(b,B,$,vt,zt,Wt)=>{let se=new ms($-B,zt-vt);se.translate((B+$)/2,(vt+zt)/2,-Wt),Oi(se,b)},ic=(b,B,$,vt,zt,Wt,se)=>{let Ee=new ms(vt-$,Wt-zt);Ee.rotateY(se*Math.PI/2),Ee.translate(B,(zt+Wt)/2,-($+vt)/2),Oi(Ee,b)},cs=(b,B,$,vt,zt,Wt,se=12,Ee=zt)=>{let Ye=new Vi(Ee,zt,Wt,se);Ye.translate(B,$+Wt/2,-vt),Oi(Ye,b)},zi=(b,B,$,vt,zt,Wt,se)=>{let Ee=new Gi(1,10,7);Ee.scale(zt,Wt,se),Ee.translate(B,$,-vt),Oi(Ee,b)},t1=(b,B,$,vt,zt=.5)=>{let Wt=Li(Math.round(b*97+vt*13));for(let se=b+.3;se<B-.1;se+=.55)zi(Wt()<.7?en:ar,se,$+.22,vt+(Wt()-.5)*zt*.4,.38,.3+Wt()*.12,zt*.55)},zr=(b,B,$,vt,zt,Wt=.55)=>{Mt(Je,b,B,$,$+Wt,vt,zt),t1(b,B,$+Wt,(vt+zt)/2,zt-vt)},Ko=(b,B,$,vt,zt,Wt)=>vr([[b,B],[$,vt]],[zt,zt],Wt),Zt=4.2,Fe=8.4,Kn=.6,ze=Math.min(k(32)+.45,0),Qn=6.5,oi=24.5,mi=27.3,e1=38,qe=44.3,ti=36.6,Ve=3.65,In=k(qe),vn=Zt+1.4;for(let b=0;b<qe-1e-6;b+=1){let B=Math.min(qe,b+1),$=k(b),vt=k(B);Mi(Nt,[b,$,1.2],[B,vt,1.2],[B,vt,H],[b,$,H],[[b/2,.6],[B/2,.6],[B/2,-.4],[b/2,-.4]]),Mi(Nt,[b,U,H],[B,U,H],[B,vt,H],[b,$,H])}Mi(Nt,[0,U,1.2],[0,U,H],[0,k(0),H],[0,k(0),1.2]),Mt(Ce,0,Qn,U,.38,1,8.5),Mt(At,0,Qn,.38,3.95,1,8.5,4),Mt(Q,-.05,Qn+.05,3.95,Zt,.95,8.5),Mt(Z,0,Qn,Zt,Zt+.02,1,8.5);for(let b of[1.85,4.65])jo(es,b-1.1,b+1.1,.95,3,.99),Mt(Ft,b-1.16,b+1.16,.89,.95,.94,1),Mt(Ft,b-1.16,b+1.16,3,3.06,.94,1);kr(3.25,2.1,.97,.12,.32),kr(.35,2.1,.97,.12,.32),kr(Qn-.35,2.1,.97,.12,.32),ic(es,-.01,4.2,6.4,1,2.9,-1),Ko(0,1.02,Qn,1.02,Zt,1.05),Ko(.02,1,.02,8.5,Zt,1.05),Ko(Qn-.02,1,Qn-.02,4.6,Zt,1.05),cs(Je,1.5,Zt,2.6,.78,.5,24),zi(en,1.5,Zt+.75,2.6,.62,.36,.62),pi(3.6,Zt,2.2,jn),pi(4.6,Zt,2.5,jn),Gs(4.1,Zt,3.2,.3),Mt(oe,Qn,oi,U,Kn,1.2,4.6,3),Mt(wt,Qn,oi,Kn,Kn+.04,1.75,4.6),Mt(oe,Qn,oi,Kn,Kn+1.05,1.2,1.75,3),Mt(Q,Qn-.05,oi,Kn+1.05,Kn+1.15,1.15,1.8);let Pu=(oi-Qn)/5;for(let b=0;b<5;b++){let B=Qn+(b+.5)*Pu;jo(es,B-1.15,B+1.15,Kn+.08,Kn+2.6,4.52),Mt(Ft,B-1.2,B+1.2,Kn+2.6,Kn+2.68,4.5,4.56),Mt(Ft,B-.03,B+.03,Kn+.08,Kn+2.6,4.49,4.53),pi(B-.75,Kn,3),pi(B+.75,Kn,3),Gs(B,Kn,2.6,.28),b&&Mt(oe,Qn+b*Pu-.2,Qn+b*Pu+.2,Kn,Kn+1.75,1.75,4.5,3)}Mt(At,Qn,oi,Kn,3.9,4.6,10.5,4),Mt(It,Qn,oi,Kn,3.62,4.52,4.6),Mi(It,[Qn,3.85,4.6],[oi,3.85,4.6],[oi,3.62,3],[Qn,3.62,3],[[0,0],[9,0],[9,.8],[0,.8]]),Mt(ts,Qn,oi,3.44,3.64,2.95,3.05),Mt(Ni,Qn,oi,3.4,3.45,2.98,3.06),Mt(Q,Qn,oi,3.9,Zt,4.45,10.5);let sc=k(25.9),Lu=Math.ceil((Zt-sc)/.165),n1=(Zt-sc)/Lu,Iu=1.3+Lu*.28;for(let b=0;b<Lu;b++){let B=1.3+b*.28,$=sc+(b+1)*n1;Mt(Oe,oi+.4,mi-.4,U,$,B,B+.28),Mt(Ni,oi+.4,mi-.4,$-.07,$-.035,B-.02,B+.01),Mt(At,oi,oi+.4,U,$+.95,B,B+.28,4),Mt(At,mi-.4,mi,U,$+.18,B,B+.28,4)}vr([[mi-.2,1.3],[mi-.2,Iu]],[sc+.18,Zt+.18],.95),Mt(At,oi-.3,oi+.4,k(24.6)-.2,Kn+2.3,.3,1.3,4),Mt(At,mi-.4,mi+.3,k(27.4)-.2,Kn+2.3,.3,1.3,4),Mt(Q,oi-.35,oi+.45,Kn+2.3,Kn+2.4,.25,1.35),Mt(Q,mi-.45,mi+.35,Kn+2.3,Kn+2.4,.25,1.35);let lr=[29,30.8],rc=Math.max(0,Math.ceil((ze-k(29.9))/.16)),i1=rc?(ze-k(29.9))/rc:0,s1=1.2+rc*.3;Mt(oe,mi,lr[0],U,ze,1.2,5.6,3),Mt(oe,lr[1],ti,U,ze,1.2,5.6,3),Mt(oe,lr[0],lr[1],U,ze,s1,5.6,3);for(let b=0;b<rc;b++){let B=1.2+b*.3;Mt(Oe,lr[0],lr[1],U,k(29.9)+(b+1)*i1,B,B+.3)}Mt(wt,mi,ti,ze,ze+.04,1.75,5.6),Mt(oe,mi,lr[0],ze,ze+.85,1.2,1.7,3),Mt(oe,lr[1],ti-.9,ze,ze+.85,1.2,1.7,3),Mt(Q,mi,lr[0],ze+.85,ze+.95,1.15,1.75),Mt(Q,lr[1],ti-.9,ze+.85,ze+.95,1.15,1.75),Mt(At,mi,qe,ze,3.9,5.6,12.5,4),Mt(It,mi,ti,ze,3.9,5.52,5.6);let oc=Math.min(3.5,3.6-ze-.2);for(let[b,B]of[[27.9,31.3],[31.9,35.9]]){jo(es,b,B,ze+.05,ze+oc,5.5),Mt(Ft,b-.05,B+.05,ze+oc,ze+oc+.07,5.47,5.53);for(let $=b+(B-b)/3;$<B-.1;$+=(B-b)/3)Mt(Ft,$-.03,$+.03,ze+.05,ze+oc,5.46,5.5)}for(let b of[32.3,33.1,33.9])cs(jn,b,ze,4.9,.03,.9,5),zi(Zo,b,ze+1.05,4.9,.28,.34,.28);Mt(ie,mi,ti,3.9,Zt+.05,5.42,5.6),Mt(Ni,mi,ti,3.86,3.9,5.44,5.52),Mt(oe,0,Qn,U,Zt,8.5,X,3),Mt(oe,Qn,oi,U,Zt,10.5,X,3),Mt(oe,oi,mi,U,Zt,Iu,X,3),Mt(oe,mi,e1,U,Zt,12.5,X,3),Mt(Z,0,4,Zt,Zt+.03,8.5,14.8);let qn=[4,18.5],nn=[5.2,14.2],Ws=7.8,Fp=2.6,Cs=(nn[0]+nn[1])/2,Ps=Ws+Fp,Ja=Fp/((nn[1]-nn[0])/2),An=.6,ja=.35,Bp=b=>Ps-Ja*(b-Cs),mo=Cs+(Ps-Fe)/Ja,hi=[9.9,13.1],hs=[mo+.2,mo+3.4],Du=hs[1]+.2;zr(Qn+.1,qn[1]-.1,Zt,4.5,5.15,.5),Mt(At,qn[0],qn[1],Zt,Ws,nn[0],nn[1],4);for(let b=0;b<4;b++){let B=qn[0]+(b+.5)*(qn[1]-qn[0])/4;jo(es,B-1.3,B+1.3,Zt+.45,Zt+2.85,nn[0]-.02),Mt(he,B-1.42,B+1.42,Zt+.33,Zt+.45,nn[0]-.08,nn[0]),Mt(he,B-1.42,B+1.42,Zt+2.85,Zt+2.97,nn[0]-.08,nn[0]),Mt(he,B-1.42,B-1.3,Zt+.45,Zt+2.85,nn[0]-.08,nn[0]),Mt(he,B+1.3,B+1.42,Zt+.45,Zt+2.85,nn[0]-.08,nn[0]),Mt(Ft,B-.03,B+.03,Zt+.45,Zt+2.85,nn[0]-.06,nn[0]-.02),Mt(Ft,B-1.3,B+1.3,Zt+2.2,Zt+2.25,nn[0]-.06,nn[0]-.02),b<3&&kr(qn[0]+(b+1)*(qn[1]-qn[0])/4,Zt+1.9,nn[0]-.03,.12,.34)}Mt(he,qn[0],qn[1],Ws-.5,Ws-.12,nn[0]-.08,nn[0]),Mt(Ni,qn[0],qn[1],Ws-.12,Ws-.06,nn[0]-.12,nn[0]-.02),ic(es,qn[0]-.01,8.6,10.8,Zt+.8,Zt+2.6,-1);{let b=Ws-Ja*An,B=qn[0]-ja,$=qn[1]+ja,vt=($-B)/2,zt=Math.hypot(Cs-nn[0]+An,Ps-b)/2;Mi(kt,[B,b,nn[0]-An],[$,b,nn[0]-An],[$,Ps,Cs],[B,Ps,Cs],[[0,zt],[vt,zt],[vt,0],[0,0]]),Mi(kt,[$,b,nn[1]+An],[B,b,nn[1]+An],[B,Ps,Cs],[$,Ps,Cs],[[vt,zt],[0,zt],[0,0],[vt,0]]),Mi(xe,[B,b-.14,nn[0]-An],[$,b-.14,nn[0]-An],[$,b,nn[0]-An],[B,b,nn[0]-An]),Mi(xe,[$,b-.14,nn[1]+An],[B,b-.14,nn[1]+An],[B,b,nn[1]+An],[$,b,nn[1]+An]);let Wt=new Vi(.17,.17,$-B+.3,10);Wt.rotateZ(Math.PI/2),Wt.translate((B+$)/2,Ps+.06,-Cs),Oi(Wt,xe);for(let[se,Ee]of[[B-.1,-1],[$+.1,1]]){let Ye=new Ei(.7,.24,.3);Ye.rotateZ(Ee*.55),Ye.translate(se+Ee*.12,Ps+.25,-Cs),Oi(Ye,xe)}for(let se of qn){Qx(At,[se,Ws,nn[0]],[se,Ws,nn[1]],[se,Ps,Cs]);for(let[Ee,Ye]of[[nn[0]-An,Cs],[nn[1]+An,Cs]]){let Ge=Ws-Ja*An,cn=se===qn[0]?-ja:ja;Mi(xe,[se+cn,Ge,Ee],[se+cn,Ps,Ye],[se+cn,Ps+.2,Ye],[se+cn,Ge+.2,Ee])}for(let Ee of[nn[0]-An,nn[1]+An]){let Ye=new Ei(.28,.5,.28),Ge=se===qn[0]?-1:1;Ye.rotateZ(Ge*.5),Ye.translate(se+Ge*(ja+.1),Ws-Ja*An+.25,-Ee),Oi(Ye,xe)}}for(let[se,Ee,Ye]of[[6,10.4,3],[12.6,17,3],[10.4,12.6,1]])for(let Ge=3-Ye;Ge<3;Ge++){let cn=mo-.8*Ge,Mn=cn-.8,Sn=Bp(Mn)+.35;Mt(It,se,Ee,Bp(cn)-.2,Sn-.05,Mn,cn,1),Mt(_e,se-.03,Ee+.03,Sn-.06,Sn,Mn-.02,cn+.05),Mt(Ni,se,Ee,Sn-.13,Sn-.08,cn+.01,cn+.05)}for(let se of[8.2,14.8])kr(se,Fe+.6,mo+.02,.14,.22);Mt(_e,qn[0],hi[0],Fe-.3,Fe+.03,mo,nn[1]+An),Mt(_e,hi[1],qn[1],Fe-.3,Fe+.03,mo,nn[1]+An),Mt(_e,hi[0],hi[1],Fe-.3,Fe+.03,mo,hs[0]),Mt(Za,hi[0],hi[1],Fe-.6,Fe-.08,hs[0],hs[1]),Mt(Q,hi[0]-.2,hi[1]+.2,Fe-.1,Fe+.06,hs[1],hs[1]+.2),Mt(Q,hi[0]-.2,hi[0],Fe-.1,Fe+.06,hs[0],hs[1]),Mt(Q,hi[1],hi[1]+.2,Fe-.1,Fe+.06,hs[0],hs[1]),zr(7.4,hi[0]-.3,Fe,hs[1]-.6,hs[1]+.9,.6),zr(hi[1]+.3,15.6,Fe,hs[1]-.6,hs[1]+.9,.6)}let ys=[35.3,37.3];Mt(Rt,0,hi[0]-.2,Zt,Fe,nn[1]+An,X,3),Mt(Rt,hi[1]+.2,ys[0],Zt,Fe,nn[1]+An,X,3),Mt(Rt,hi[0]-.2,hi[1]+.2,Zt,Fe,Du,X,3),Mt(Rt,hi[0]-.2,hi[1]+.2,Zt,Fe-.6,nn[1]+An,Du,3),Mt(Rt,qn[1],20.5,Zt,Fe,12.5,nn[1]+An,3),Mt(Z,0,hi[0]-.2,Fe,Fe+.03,nn[1]+An,X),Mt(Z,hi[1]+.2,ys[0],Fe,Fe+.03,nn[1]+An,X),Mt(Z,hi[0]-.2,hi[1]+.2,Fe,Fe+.03,Du,X),Mt(Z,qn[1],20.5,Fe,Fe+.03,12.5,nn[1]+An),Mt(_e,15.8,18.3,Fe+.02,Fe+.05,nn[1]+An,X-1),Ko(0,nn[1]+An+.02,qn[0],nn[1]+An+.02,Fe,1.05);{for(let $ of[-1,1])for(let vt of[-1,1]){let zt=new Ei(.06,2.3,.06);zt.rotateX(vt*.18),zt.translate(2.4+$*1,Fe+1.1,-(19.5+vt*.2)),Oi(zt,jn)}Mt(jn,2.4-1.05,2.4+1.05,Fe+2.2,Fe+2.26,19.5-.05,19.5+.05),Mi(ie,[2.4-1.2,Fe+2.35,19.5-.8],[2.4+1.2,Fe+2.35,19.5-.8],[2.4+1.2,Fe+2.1,19.5+.8],[2.4-1.2,Fe+2.1,19.5+.8]),Mt(ie,2.4-.8,2.4+.8,Fe+.55,Fe+.7,19.5-.25,19.5+.25)}Gs(6.5,Fe,21.5,.45),pi(5.8,Fe,21.5,jn),pi(7.2,Fe,21.5,jn),Mt(_e,qn[1],oi,Zt,Zt+.05,4.6,12.5),Mt(_e,oi,mi,Zt,Zt+.05,Iu,12.5),Mt(_e,mi,qe,Zt,Zt+.05,5.6,12.5),Mt(_e,ti,qe,Zt,Zt+.05,Ve,5.6),Ko(qn[1],4.62,oi,4.62,Zt,1.05),vr([[mi,5.62],[ti,5.62],[ti,Ve+.02],[qe-.02,Ve+.02],[qe-.02,12.5]],[Zt,Zt,Zt,Zt,Zt],1.05);{cs(Xn,21.6,Zt,9.3,.16,1.6,8,.2);let $=new Vi(.09,.13,1.4,6);$.rotateZ(.7),$.translate(21.6+.45,Zt+1.7,-9.3),Oi($,Xn);for(let[vt,zt,Wt,se]of[[-.6,1.2,.1,1],[.5,1.7,-.1,1.15],[1.2,2.25,.2,.9],[-.1,2.45,0,.95],[.3,3,.05,.7]])zi(zn,21.6+vt,Zt+zt,9.3+Wt,se,.22,se*.8);Mt(At,21.6-1.3,21.6+1.3,Zt,Zt+.4,9.3-1.3,9.3+1.3,4),zi(en,21.6+.9,Zt+.55,9.3+.9,.5,.3,.45),zi(ar,21.6-.8,Zt+.55,9.3+.8,.45,.28,.4)}Mt(Et,23.5,33.5,Zt+.03,Zt+.08,9.1,11.2,1.5);for(let b of[25.2,28.6,32])for(let B of[9.4,10.2,11])Mt(wt,b-.45,b+.45,Zt+.05,Zt+.11,B-.28,B+.28,1);zr(19,22.8,Zt,11.4,12.3),zr(24.6,28.4,Zt+.02,11.55,12.3),zr(30.2,33.8,Zt+.02,11.55,12.3);for(let b of[26.2,31.2])Mt(wn,b,b+1.7,Zt+.05,Zt+.5,7.25,7.7,1);{let b=new Vi(.62,.72,.1,9);b.translate(28.9,Zt+.72,-7.5),Oi(b,ts),cs(ts,28.9,Zt+.05,7.5,.18,.67,7)}Gs(34.6,Zt+.05,8.2,.4),pi(33.9,Zt+.05,8.2,jn),pi(35.3,Zt+.05,8.2,jn),Gs(36.7,Zt+.05,10.2,.4),pi(36,Zt+.05,10.2,jn),pi(37.4,Zt+.05,10.2,jn),Gs(41.3,Zt+.05,8.4,.45),pi(40.6,Zt+.05,8.4,jn),pi(42,Zt+.05,8.4,jn),Gs(39.2,Zt+.05,5,.4),pi(38.5,Zt+.05,5,jn),pi(39.9,Zt+.05,5,jn);let ki=[20.5,35],ei=[12.5,18],Hr=7.6;Mt(At,ki[0],ki[1],Zt,Hr,ei[0],ei[1],4),Mt(ie,ki[0],ki[1],Zt,Zt+.14,ei[0]-.06,ei[0]);for(let[b,B]of[[21.3,23.9],[25.5,28.1],[29.3,33.3]])jo(es,b,B,Zt+.08,Zt+2.75,ei[0]-.02),Mt(Ft,b-.06,B+.06,Zt+2.75,Zt+2.83,ei[0]-.07,ei[0]),Mt(Ft,b-.06,b,Zt+.08,Zt+2.75,ei[0]-.07,ei[0]),Mt(Ft,B,B+.06,Zt+.08,Zt+2.75,ei[0]-.07,ei[0]),Mt(Ft,(b+B)/2-.03,(b+B)/2+.03,Zt+.08,Zt+2.75,ei[0]-.06,ei[0]-.02);for(let b of[24.7,28.7,34.1])kr(b,Zt+1.3,ei[0]-.03,.06,1.3);Mt(ie,ki[0]-.3,ki[1]+.3,Hr,Fe,ei[0]-1,ei[1]+.2),Mt(Ni,ki[0]-.3,ki[1]+.3,Hr-.05,Hr,ei[0]-1,ei[0]-.94),Mt(Ni,ki[0]-.3,ki[0]-.24,Hr-.05,Hr,ei[0]-1,ei[1]);for(let b=ki[0]+1;b<ki[1];b+=2.4)Mt(Ji,b-.09,b+.09,Hr-.03,Hr,ei[0]-.62,ei[0]-.44);Mt(Z,ki[0],ki[1],Fe,Fe+.03,ei[0]-1,ei[1]);{let b=[[qn[1],12.52],[ki[0]-.3,12.52]];for(let B=1;B<=8;B++){let $=B/8*Math.PI/2;b.push([ki[0]-.3+2.2*Math.sin($),ei[0]-.98+1*Math.cos($)])}b.push([ki[1]+.3,ei[0]-.98]),vr(b,b.map(()=>Fe),1.05)}Gs(24,Fe+.03,14.5,.45),pi(23.3,Fe+.03,14.5,jn),pi(24.7,Fe+.03,14.5,jn),Gs(30,Fe+.03,15.2,.45),pi(29.3,Fe+.03,15.2,jn),pi(30.7,Fe+.03,15.2,jn);let r1=rt("#34363a",{roughness:.95}),zp=rt("#e9e7df",{roughness:.8}),o1=rt("#2b3440"),kp=rt("#a8a39a",{roughness:.95}),a1=rt("#bdb2a0",{roughness:.95}),l1=rt("#ddd6c8",{roughness:.8}),Uu=rt("#c9cdd1",{roughness:.35,metalness:.12}),Nu=rt("#1f262c",{roughness:.1,metalness:.3}),Ou=rt("#18191b"),Hp=rt("#f2f3f1",{roughness:.4}),c1=rt("#3f7dff",{emissive:"#3d78ff",emissiveIntensity:1.6}),Vp=rt("#4c3a2c",{roughness:1}),h1=rt("#2e4b2c",{roughness:.95}),Gp=rt("#3a5b35",{roughness:.95}),u1=rt("#4a6c3f",{roughness:.95}),Wp=rt("#5d5a55",{roughness:.7}),f1=rt("#a8743f",{roughness:.6}),Xp=rt("#eeebe4"),d1=rt("#6c6a66",{roughness:.9}),p1=rt("#5f7a3e",{roughness:1}),m1=rt("#b9bbb8",{roughness:.5}),qp=rt("#d2311f",{emissive:"#8a150a",emissiveIntensity:.55,roughness:.6}),Yp=rt("#e67a2c",{emissive:"#8a3a0c",emissiveIntensity:.5,roughness:.6}),g1=rt("#e8c74c",{emissive:"#7d6414",emissiveIntensity:.45,roughness:.6}),Ka=(b,B,$,vt,zt=vt)=>{let Wt=new W(B[0],B[1],-B[2]),se=new W($[0],$[1],-$[2]),Ee=se.clone().sub(Wt),Ye=Ee.length(),Ge=new Vi(zt,vt,Ye,7);Ge.translate(0,Ye/2,0),Ge.applyQuaternion(new ds().setFromUnitVectors(new W(0,1,0),Ee.normalize())),Ge.translate(Wt.x,Wt.y,Wt.z),Oi(Ge,b)},Fu=(b,B=0)=>Be({map:b,roughness:.55,emissive:B?"#ffffff":"#000000",emissiveMap:B?b:null,emissiveIntensity:B,side:xn}),Bu=(b,B,$,vt,zt,Wt,{emissive:se=0}={})=>{let Ee=new Qe(new ms($-B,zt-vt),Fu(b,se));return Ee.position.set((B+$)/2,(vt+zt)/2,-Wt+.01),j.add(Ee),Ee},$p=(b,B,$,vt,zt,Wt,{emissive:se=0}={})=>{let Ee=new Qe(new ms(vt-$,Wt-zt),Fu(b,se));return Ee.rotation.y=Math.PI/2,Ee.position.set(B,(zt+Wt)/2,-($+vt)/2),j.add(Ee),Ee},zu='"Xingkai SC","STXingkai","Kaiti SC","STKaiti","KaiTi",serif',bi=b=>k(b)+.03,ac=In+3.3,Ls=Zt-.9,ni=12.5,Fi=19.9,ku=Math.max(1,Math.ceil((ze-In)/.165)),Zp=(ze-In)/ku,lc=.38,Is=qe-ku*lc;Mt(At,ti,qe,ze,3.9,Ve,5.6,4),Mt(oe,ti,qe-.42,U,ze,Ve,5.6,3),Mt(Rt,ti,qe-.01,U,ze+.06,Ve-.08,Ve,2),Mt(It,ti,qe,ze+.06,3.9,Ve-.08,Ve,1),Mt(It,ti-.08,ti,ze,3.9,Ve,5.6,1);{let b=Is+.35,B=qe-1.35;jo(es,b,B,ze+.45,ze+2.85,Ve-.1);for(let[$,vt,zt,Wt]of[[b-.15,B+.15,ze+.3,ze+.45],[b-.15,B+.15,ze+2.85,ze+3],[b-.15,b,ze+.3,ze+3],[B,B+.15,ze+.3,ze+3],[(b+B)/2-.05,(b+B)/2+.05,ze+.45,ze+2.85]])Mt(f1,$,vt,zt,Wt,Ve-.17,Ve-.08);Mt(Ft,b-.25,B+.25,ze+.2,ze+3.1,Ve-.1,Ve-.08);for(let $ of[ti+.8,qe-.6])Mt(Ji,$-.03,$+.03,ze+1.2,ze+2.6,Ve-.12,Ve-.08)}ic(es,ti-.09,Ve+.35,Ve+1.45,ze+.05,ze+2.55,-1),Mt(Ft,ti-.12,ti-.08,ze+2.55,ze+2.65,Ve+.3,Ve+1.5),Bu(Jn(128,72,(b,B,$)=>{b.fillStyle="#1d3f6e",b.fillRect(0,0,B,$),b.fillStyle="#fff",b.font='600 18px "PingFang SC",sans-serif',b.textAlign="center",b.fillText("\u51E4\u5F62\u65B0\u6751",B/2,28),b.font='700 28px "PingFang SC",sans-serif',b.fillText("19",B/2,62)}),qe-.55,qe-.2,ze+.1,ze+.32,Ve-.1),Mt(ie,ti,qe,3.9,Zt+.05,Ve-.35,Ve),Mt(Xp,ti,qe,3.88,3.9,Ve-.33,Ve),Mt(Ni,ti,qe,3.84,3.88,Ve-.35,Ve-.3);for(let b=0;b<ku;b++){let B=qe-b*lc,$=B-lc,vt=In+(b+1)*Zp;Mt(kp,$,B+.02,U,vt,1.75,Ve,1),Mt(Ft,$,$+.025,vt-.03,vt+.004,1.75,Ve)}Mt(l1,ti,Is,ze,ze+.04,1.75,Ve,1),Mt(oe,ti,Is,U,ze,1.75,Ve,3);{let b=$=>$<=Is?ze+.9:In+(Math.floor((qe-$)/lc)+1)*Zp+.9,B=Li(733);for(let $=ti-.9;$<qe-.01;$+=.62){let vt=Math.min(qe,$+.6),zt=b(Math.min($+.3,qe-.01))+(B()-.5)*.06;Mt(B()<.5?a1:kp,$,vt,U,zt,1.2,1.75,1),Mt(Q,$-.01,vt+.01,zt,zt+.07,1.18,1.77)}for(let[$,vt]of[[Is-.8,1],[Is+.5,.8],[Is+2.6,1],[qe-.9,.8]]){let zt=b($)+.07;cs(Wp,$,zt,1.48,.16*vt,.32*vt,10,.12*vt),zi(Wp,$,zt+.42*vt,1.48,.13*vt,.15*vt,.13*vt)}}{let b=Is-1.45;Mt(At,b,b+.55,ze,ze+1.35,Ve-.6,Ve-.05,4),Mt(Ji,b+.04,b+.51,ze+1.35,ze+1.8,Ve-.56,Ve-.09),Mt(Ft,b,b+.55,ze+1.8,ze+1.86,Ve-.6,Ve-.05);for(let B of[.14,.27,.4])Mt(Ft,b+B,b+B+.02,ze+1.36,ze+1.79,Ve-.61,Ve-.59);Mt(Je,b+.65,Is,ze,ze+.4,Ve-.55,Ve-.05);for(let B=b+.8;B<Is-.1;B+=.33)zi(Rs,B,ze+.72,Ve-.3,.3,.38,.26);cs(Xn,Is-.35,ze+.4,Ve-.3,.05,1.4,6);for(let[B,$]of[[0,1.9],[.2,1.6],[-.2,1.7]])zi(Rs,Is-.35+B,ze+$,Ve-.3,.35,.45,.3)}Mt(o1,qe-.4,qe,U,In+1.25,Ve,12.5),Mt(At,qe-.4,qe,In+1.25,ze,Ve,12.5,4),Mt(ie,qe-.35,qe+.12,3.9,Zt+.05,Ve,12.5),Mt(Ni,qe+.08,qe+.13,3.86,3.9,Ve,12.5),$p(Jn(200,250,(b,B,$)=>{b.fillStyle="#24211e",b.fillRect(0,0,B,$),b.strokeStyle="#4a443c",b.lineWidth=4,b.strokeRect(6,6,B-12,$-12),b.fillStyle="#d8b56a",b.font=`70px ${zu}`,b.textAlign="center",b.textBaseline="middle",b.fillText("\u5C45",B*.4,$*.24),b.fillText("\u4E4B",B*.62,$*.5),b.fillText("\u6797",B*.42,$*.76),b.font="10px sans-serif",b.fillText("JU ZHI LIN",B*.24,$*.5)}),qe+.02,Ve+.3,Ve+1.2,In+1.75,In+2.85),Mt(ie,qe,qe+.16,In+2.95,In+3.07,Ve+.6,Ve+.9);for(let[b,B]of[[Ve+2,Ve+4.2],[Ve+4.8,Ve+6.4]]){ic(es,qe+.01,b,B,In+2.4,In+4.7,1);for(let[$,vt,zt,Wt]of[[b-.06,B+.06,In+2.34,In+2.4],[b-.06,B+.06,In+4.7,In+4.76],[b-.06,b,In+2.4,In+4.7],[B,B+.06,In+2.4,In+4.7],[(b+B)/2-.03,(b+B)/2+.03,In+2.4,In+4.7]])Mt(Ft,qe,qe+.07,zt,Wt,$,vt)}for(let b of[Ve+1.6,Ve+4.5,Ve+6.8])Mt(Ji,qe,qe+.05,In+2.6,In+4.2,b-.03,b+.03);Mt(Hp,qe,qe+.3,In+2.5,In+3.05,Ve+7.3,Ve+7.95),$p(Jn(96,64,(b,B,$)=>{b.fillStyle="#e9eae7",b.fillRect(0,0,B,$),b.fillStyle="#55585a",b.beginPath(),b.arc(B*.42,$/2,$*.4,0,Math.PI*2),b.fill(),b.strokeStyle="#e9eae7",b.lineWidth=2;for(let vt=4;vt<$*.4;vt+=4)b.beginPath(),b.arc(B*.42,$/2,vt,0,Math.PI*2),b.stroke()}),qe+.31,Ve+7.32,Ve+7.93,In+2.52,In+3.03),Mt(m1,qe,qe+.2,In+.85,In+1.95,Ve+7.4,Ve+8),cs(At,qe+.08,U,Ve+.1,.055,Zt-U-.3,8);let Jp=b=>[(b[0]-S[0])*w[0]+(b[1]-S[1])*w[1],(b[0]-S[0])*L[0]+(b[1]-S[1])*L[1]],x1=b=>{let B=-1e9;for(let $ of t.roads)if(!["footway","path","steps","pedestrian"].includes($.kind))for(let vt=1;vt<$.pts.length;vt++){let zt=Jp($.pts[vt-1]),Wt=Jp($.pts[vt]);if((zt[0]-b)*(Wt[0]-b)>0||zt[0]===Wt[0])continue;let se=zt[1]+(Wt[1]-zt[1])*(b-zt[0])/(Wt[0]-zt[0]);se>-10&&se<8&&(B=Math.max(B,se+$.width/2))}return B},cc=b=>Math.max(H,x1(b)-.3);for(let b=qe;b<N-1e-6;b+=.5){let B=Math.min(N,b+.5),$=cc(b),vt=cc(B);Mi(r1,[b,bi(b),ni],[B,bi(B),ni],[B,bi(B),vt],[b,bi(b),$],[[b/2,ni/2],[B/2,ni/2],[B/2,vt/2],[b/2,$/2]]),Mi(Nt,[b,U,$],[B,U,vt],[B,bi(B),vt],[b,bi(b),$])}Mi(Nt,[N,U,cc(N)],[N,U,ni],[N,bi(N),ni],[N,bi(N),cc(N)]);let Qa=[44.6,47.2,49.8,52.4,55,57.6],Qo=ni-5.3,yi=Qa[1];for(let b of Qa)Mi(zp,[b-.06,bi(b)+.02,ni-.05],[b+.06,bi(b)+.02,ni-.05],[b+.06,bi(b)+.02,Qo],[b-.06,bi(b)+.02,Qo]);for(let b=Qa[0]-.06;b<Qa.at(-1)+.06-1e-6;b+=.5){let B=Math.min(Qa.at(-1)+.06,b+.5);Mi(zp,[b,bi(b)+.02,Qo+.06],[B,bi(B)+.02,Qo+.06],[B,bi(B)+.02,Qo-.06],[b,bi(b)+.02,Qo-.06])}{let b=yi+1.3,B=.95,$=ni-.4,vt=$-4.7,zt=bi(b);Mt(Uu,b-B,b+B,zt+.34,zt+1,vt,$),Mt(Uu,b-B+.04,b+B-.04,zt+.5,zt+.98,vt-.02,vt+.3),Mt(Nu,b-B+.1,b+B-.1,zt+1,zt+1.56,vt+1.45,$-.5),Mt(Uu,b-B+.14,b+B-.14,zt+1.56,zt+1.64,vt+1.5,$-.55),Mi(Nu,[b-B+.1,zt+1,vt+.85],[b+B-.1,zt+1,vt+.85],[b+B-.14,zt+1.56,vt+1.45],[b-B+.14,zt+1.56,vt+1.45]),Mt(Ni,b-B+.2,b+B-.2,zt+.84,zt+.88,vt-.03,vt);for(let se of[b-B+.04,b+B-.04])for(let Ee of[vt+.95,$-.95]){let Ye=new Vi(.37,.37,.26,16);Ye.rotateZ(Math.PI/2),Ye.translate(se,zt+.37,-Ee),Oi(Ye,Ou)}let Wt=bi(yi);Mt(Hp,yi-.3,yi+.3,Wt+.45,Wt+1.2,ni-.28,ni),Mt(Nu,yi-.1,yi+.1,Wt+.88,Wt+1.06,ni-.3,ni-.28),Mt(c1,yi-.26,yi-.22,Wt+.52,Wt+1.1,ni-.3,ni-.28),Ka(At,[qe,bi(qe)+.14,ni-.08],[yi-.3,Wt+.14,ni-.08],.045),Ka(Ou,[yi+.22,Wt+.52,ni-.3],[yi+.55,Wt+.08,ni-.9],.02),Ka(Ou,[yi+.55,Wt+.08,ni-.9],[b-B,zt+.8,$-.7],.02)}let _s=ni+.32,go=ni+.58;Mt(oe,qe,N,U,ac,ni,_s,2.4),Mt(Q,qe,N,ac,ac+.08,ni-.05,_s),Mt(oe,qe,N,ac,Ls,_s,go,2.4),Mt(At,qe,N,Ls,vn+.1,_s,go,4),Mt(Q,qe,N,vn+.1,vn+.18,_s-.04,go+.04),vr([[38,12.52],[qe,12.52],[qe,go+.02],[N,go+.02]],[vn+.1,vn+.1,vn+.1,vn+.1],1.05);{Mt(ie,yi-1.85,yi+1.85,Ls+.62,Ls+1.72,_s-.1,_s),Bu(Jn(512,176,(b,B,$)=>{b.fillStyle="#141414",b.fillRect(0,0,B,$),b.strokeStyle="#3a3a3a",b.lineWidth=6,b.strokeRect(3,3,B-6,$-6),b.fillStyle="#fbfbf6",b.shadowColor="#ffffff",b.shadowBlur=10,b.font=`120px ${zu}`,b.textAlign="center",b.textBaseline="middle",b.fillText("\u5C45\u4E4B\u6797",B/2,$/2+6)}),yi-1.75,yi+1.75,Ls+.67,Ls+1.67,_s-.11,{emissive:.9}),Mt(ie,yi-2.6,yi+2.6,Ls+.1,Ls+.5,_s-.06,_s),Bu(Jn(700,52,(b,B,$)=>{b.fillStyle="#101318",b.fillRect(0,0,B,$),b.fillStyle="#f5f7ff",b.shadowColor="#bcd0ff",b.shadowBlur=6,b.font='700 30px "PingFang SC",sans-serif',b.textBaseline="middle",b.fillText("173 5664 8281",18,$/2+1),b.fillStyle="#3a3e46",b.fillRect(262,6,4,$-12),b.fillStyle="#f5f7ff",b.font='700 32px "PingFang SC",sans-serif',b.fillText("\u9690\u4E8E\u5C71\u6797  \u5F52\u4E8E\u81EA\u7136",290,$/2+1)}),yi-2.5,yi+2.5,Ls+.13,Ls+.47,_s-.07,{emissive:1});for(let b of[yi-1.9,yi+1.9])Mt(Ji,b-.08,b+.08,Ls-.8,Ls-.5,_s-.06,_s)}Mt(oe,38,qe,U,vn,12.5,Fi,3),Mt(At,38,qe,Zt,vn+.1,12.42,12.5,4),Mt(At,37.92,38,Zt,vn+.1,12.5,14.1,4),Mt(oe,ys[0],38,U,vn,15.3,Fi,3),Mt(At,ys[0],38,Zt,vn+.1,15.22,15.3,4),Mt(Z,ys[0],38,vn,vn+.03,15.3,Fi),Mt(Z,38,qe,vn,vn+.03,12.5,Fi),Mt(oe,qe,N,U,vn,go,Fi,3),Mt(Z,qe,N,vn,vn+.03,go,Fi),vr([[38,14.1],[38,12.52]],[vn+.1,vn+.1],1.05),vr([[ys[0],15.32],[37.2,15.32]],[vn+.1,vn+.1],1.05),Gs(42.2,vn+.03,13.7,.45),pi(41.5,vn+.03,13.7,ts),pi(42.9,vn+.03,13.7,ts),cs(jn,43.1,vn+.03,14.9,.03,2.2,6),cs(Xp,43.1,vn+1.2,14.9,.02,1.1,10,.13);for(let[b,B,$]of[[39,40.8,17.2],[45.4,47.2,19.3]])Mt(wn,b,B,vn+.03,vn+.48,$,$+.45,1);Gs(51.5,vn+.03,15.6,.45),pi(50.8,vn+.03,15.6,ts),pi(52.2,vn+.03,15.6,ts),Mt(_e,ys[0]-.3,38,Zt,Zt+.05,12.5,15.3);{let b=Math.max(1,Math.ceil((vn-Zt)/.16)),B=(vn-Zt)/b,$=Wt=>[36.4+1.6*(1-Math.cos(Math.PI*Wt/2)),12+2.35*Math.sin(Math.PI*Wt/2)],vt=[[],[]],zt=[];for(let Wt=0;Wt<b;Wt++){let se=$(Wt/b),Ee=$((Wt+1)/b),Ye=Zt+(Wt+1)*B,Ge=[(se[0]+Ee[0])/2,(se[1]+Ee[1])/2],cn=Math.hypot(Ee[0]-se[0],Ee[1]-se[1]),Mn=new Ei(1.4,Ye-Zt+.3,Math.max(.28,cn));Mn.translate(0,-(Ye-Zt+.3)/2,0),Mn.rotateY(Math.atan2(Ee[0]-se[0],-(Ee[1]-se[1]))),Mn.translate(Ge[0],Ye,-Ge[1]),Oi(Mn,Oe);let Sn=new Ei(1.36,.035,.03);Sn.rotateY(Math.atan2(Ee[0]-se[0],-(Ee[1]-se[1]))),Sn.translate(se[0],Ye-.06,-se[1]),Oi(Sn,Ni);let Dn=-(Ee[1]-se[1])/cn,Nn=(Ee[0]-se[0])/cn;for(let _i of[0,1])vt[_i].push([Ge[0]+(_i?1:-1)*.72*Dn,Ge[1]+(_i?1:-1)*.72*Nn]);zt.push(Ye)}for(let Wt of[0,1])vr(vt[Wt],zt.map(se=>se+.05),1)}for(let[b,B,$]of[[35.55,13,.7],[35.75,14.2,.9],[36.2,15,.55]])zi(d1,b,Zt+$*.5,B,$,$*.7,$*.8);Mt(p1,ys[0]-.3,36.2,Zt+.05,Zt+.08,12.6,15.2),cs(Xn,35.5,Zt,14.8,.06,1.6,6),zi(en,35.5,Zt+1.9,14.8,.55,.6,.5);{let b=Math.max(1,Math.ceil((Fe-vn)/.165)),B=(Fe-vn)/b,$=.28,vt=ys[0]+b*$;for(let zt=0;zt<b;zt++){let Wt=vt-zt*$,se=Wt-$,Ee=vn+(zt+1)*B;Mt(Oe,se,Wt,vn,Ee,18.45,Fi-.02,1),Mt(Ni,se-.01,se+.01,Ee-.07,Ee-.04,18.47,Fi-.05)}vr([[vt,18.43],[ys[0],18.43]],[vn+.05,Fe+.05],1)}Mt(Rt,ys[0],N,U,Fe,Fi,X,3),Mt(Z,ys[0],N,Fe,Fe+.03,Fi,X),Ko(ys[0],Fi+.02,N,Fi+.02,Fe,1.05),zr(37.5,43.9,Fe,Fi+.4,Fi+1.3),zr(47.7,56,Fe,Fi+.4,Fi+1.3),kr(45.5,vn+2.6,Fi-.03,.22,.4);{let $=Li(1771),vt=17,zt=Fe;cs(Rt,45.8,zt,21.3,1.1,.35,20),Ka(Vp,[45.8,zt,21.3],[45.8+.35,zt+vt*.86,21.3-.25],.55,.16);let Wt=[[4.8,5.4],[6.6,6],[8.4,5.6],[10.2,4.9],[11.9,4.1],[13.5,3.1],[15,2.1],[16.3,1.1]],se=[];for(let[Ge,cn]of Wt){let Mn=Math.max(3,Math.round(cn*1.7)),Sn=45.8+Ge*.02,Dn=21.3-Ge*.015;for(let Nn=0;Nn<Mn*2;Nn++){let _i=Nn/(Mn*2)*Math.PI*2+$()*.9,vs=cn*(.25+.6*$()),Ms=Sn+Math.cos(_i)*vs,Ds=Dn+Math.sin(_i)*vs*.9,Vr=zt+Ge+($()-.3)*.9,ns=cn*(.22+.16*$())+.55;zi($()<.35?h1:Gp,Ms,Vr,Ds,ns,.75+.55*$(),ns*(.85+.3*$())),$()<.5&&zi(u1,Ms+($()-.5)*.8,Vr+.55,Ds+($()-.5)*.8,ns*.6,.45+.3*$(),ns*.55),Ge<12&&Nn%2&&Ka(Vp,[Sn,Vr-.3,Dn],[Sn+(Ms-Sn)*.8,Vr-.1,Dn+(Ds-Dn)*.8],.12,.06),Ge<9&&Nn%2&&se.push([Ms-Math.cos(_i)*.6,Vr-.55,Ds-Math.sin(_i)*.6])}zi(Gp,Sn,zt+Ge+.35,Dn,cn*.4,.8,cn*.4)}let Ee=[qp,Yp,g1,qp,Yp];for(let[Ge,cn,Mn]of se)for(let Sn=0,Dn=3+Math.floor($()*3);Sn<Dn;Sn++){let Nn=.24+.06*$();zi(Ee[Math.floor($()*Ee.length)],Ge,cn-.35-Sn*.62,Mn,Nn,Nn*.88,Nn)}let Ye=new Qe(new ms(.5,2.2),Fu(Jn(96,420,(Ge,cn,Mn)=>{Ge.fillStyle="#f3efe6",Ge.fillRect(0,0,cn,Mn),Ge.fillStyle="#1b1b1b",Ge.font=`62px ${zu}`,Ge.textAlign="center",Ge.textBaseline="middle",[..."\u65E0\u4E8B\u5C0F\u795E\u4ED9"].forEach((Sn,Dn)=>Ge.fillText(Sn,cn/2,48+Dn*80))})));Ye.position.set(45.8+2.3,zt+3.4,-(21.3-2.4)),Ye.rotation.y=1.2,j.add(Ye)}Mt(Je,13.5,27,Fe,Fe+.45,X-1.3,X-.25);for(let b=13.8;b<26.8;b+=.62)zi(Rs,b,Fe+.95,X-.78,.42,.55,.42);for(let b of[16,16.9,17.8,18.7])pi(b,Fe+.03,X-2.1,ts);Mt(It,5,27,Fe,12.6,X-.22,X,1),Mt(ie,5,27,12.6,12.72,X-.3,X);for(let b=6.5;b<27;b+=3)kr(b,10.7,X-.25,.22,.42);let jp={left:b=>b<1?k(0):b<nn[1]+An?Zt:Fe,right:b=>b<ni?bi(N):b<Fi?vn:Fe,back:()=>Fe},Hu=(b,B,$,vt)=>{for(let zt=1;zt<B.length;zt++){let[Wt,se]=[B[zt-1],B[zt]],Ee=$(Wt),Ye=$(se),Ge=J(Wt[0],Wt[1]),cn=J(se[0],se[1]);if(Math.max(Ge-Ee,cn-Ye)<.05)continue;let Mn=[Wt[0],Math.min(Ee,Ge)-.3,Wt[1]],Sn=[se[0],Math.min(Ye,cn)-.3,se[1]],Dn=[se[0],Math.max(Ye,cn)+.15,se[1]],Nn=[Wt[0],Math.max(Ee,Ge)+.15,Wt[1]],_i=Math.hypot(se[0]-Wt[0],se[1]-Wt[1]),vs=[[0,Mn[1]/3],[_i/3,Sn[1]/3],[_i/3,Dn[1]/3],[0,Nn[1]/3]];vt>0?Mi(b,Mn,Sn,Dn,Nn,vs):Mi(b,Sn,Mn,Nn,Dn,vs);let Ms=-(se[1]-Wt[1])/_i*.2,Ds=(se[0]-Wt[0])/_i*.2;Mi(Q,[Wt[0]-Ms,Nn[1],Wt[1]-Ds],[se[0]-Ms,Dn[1],se[1]-Ds],[se[0]+Ms,Dn[1],se[1]+Ds],[Wt[0]+Ms,Nn[1],Wt[1]+Ds])}},Vu=(b,B,$=Math.ceil(Math.hypot(B[0]-b[0],B[1]-b[1])/1.25))=>[...Array($+1)].map((vt,zt)=>[b[0]+(B[0]-b[0])*zt/$,b[1]+(B[1]-b[1])*zt/$]);Hu(Rt,Vu([0,H],[0,X]),b=>jp.left(b[1]),1),Hu(oe,Vu([N,H],[N,X]),b=>jp.right(b[1]),-1),Hu(Rt,Vu([0,X],[N,X]),()=>Fe,1);for(let[b,B]of _r){let $=0;for(let Ge of B)$+=Ge.attributes.position.count;let vt=new Float32Array($*3),zt=new Float32Array($*3),Wt=new Float32Array($*2),se=0;for(let Ge of B)vt.set(Ge.attributes.position.array,se*3),zt.set(Ge.attributes.normal.array,se*3),Ge.attributes.uv&&Wt.set(Ge.attributes.uv.array,se*2),se+=Ge.attributes.position.count;let Ee=new Pn;Ee.setAttribute("position",new Yn(vt,3)),Ee.setAttribute("normal",new Yn(zt,3)),Ee.setAttribute("uv",new Yn(Wt,2)),Ee.computeBoundingSphere();let Ye=new Qe(Ee,b);Ye.castShadow=!b.transparent&&b!==Ni&&b!==Ji,Ye.receiveShadow=!b.transparent,j.add(Ye)}{let b=new Cn,B=Be({color:"#c3302a",emissive:"#8f160f",emissiveIntensity:.55,roughness:.35}),$=new Qe(new Gi(1.5,24,16),B),vt=new Qe(new no(1.32,3.2,24),B),zt=new Qe(new Gi(.62,16,12),Be({color:"#fff4dc",emissive:"#ffe3a8",emissiveIntensity:.6}));vt.rotation.x=Math.PI,vt.position.y=1.6,$.position.y=3.9,zt.position.set(0,3.9,1.2),b.add(vt,$,zt);let Wt=K(25,11);b.position.set(Wt[0],q+15.5,Wt[1]),b.userData={base:q+15.5,head:5.4},Ct.add(b),ao=b}Hs.set(g.n,q+15.5+5.4),g.modelNote="\u4E09\u7EF4\u6A21\u578B\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u548C\u822A\u62CD\u56FE\u5EFA\u9020\uFF1A\u4E00\u5C42\u767D\u8272\u8F6C\u89D2\u623F\u3001\u4E94\u95F4\u5E26\u77F3\u5899\u5C0F\u9662\u7684\u5BA2\u623F\u3001\u706F\u5149\u76F4\u68AF\u4E0E\u73BB\u7483\u95E8\u5927\u5802\uFF1B\u4E1C\u5934\u8336\u5BA4\u4E34\u8DEF\u4E00\u9762\u4E3A\u77F3\u6750\u52D2\u811A\u3001\u6728\u9970\u9762\u548C\u6728\u6846\u5927\u7A97\uFF0C\u5165\u6237\u77F3\u9636\u6CBF\u8336\u5BA4\u5411\u897F\u4E0A\u5230\u524D\u9662\uFF0C\u5916\u4FA7\u662F\u5927\u5757\u82B1\u5C97\u5CA9\u6321\u5899\u548C\u5C0F\u77F3\u50E7\u50CF\uFF1B\u8336\u5BA4\u4E1C\u5C71\u5899\u767D\u5899\u6DF1\u84DD\u52D2\u811A\uFF0C\u6302\u201C\u5C45\u4E4B\u6797\u201D\u7AD6\u533E\uFF0C\u9762\u671D\u505C\u8F66\u573A\uFF1B\u505C\u8F66\u573A\u671D\u5357\uFF0C\u4E00\u6392\u8F66\u4F4D\u5782\u76F4\u4E8E\u5317\u4FA7\u4E24\u7EA7\u6BDB\u77F3\u6321\u5899\uFF0C\u8F66\u5934\u671D\u5357\uFF0C\u5145\u7535\u6869\u6302\u5728\u6321\u5899\u4E0A\u3001\u6B63\u4E0A\u65B9\u662F\u53D1\u5149\u62DB\u724C\u201C\u5C45\u4E4B\u6797\u201D\u548C\u201C173 5664 8281\u3000\u9690\u4E8E\u5C71\u6797 \u5F52\u4E8E\u81EA\u7136\u201D\uFF1B\u6321\u5899\u4E0A\u65B9\u662F\u6709\u684C\u6905\u7684\u5E73\u53F0\uFF0C\u7531\u4E8C\u5C42\u6728\u5E73\u53F0\u7ECF\u5F27\u5F62\u706F\u5149\u697C\u68AF\u4E0A\u53BB\uFF0C\u518D\u6CBF\u77F3\u5899\u76F4\u68AF\u4E0A\u5230\u4E09\u5C42\uFF0C\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u957F\u5728\u4E09\u5C42\uFF1B\u4E8C\u5C42\u7EA2\u9676\u74E6\u5761\u9876\u5BA2\u623F\u548C\u5E73\u9876\u767D\u8272\u697C\uFF0C\u524D\u6709\u7F57\u6C49\u677E\u3001\u767D\u8272\u82B1\u6C60\u3001\u783E\u77F3\u6C40\u6B65\u4E0E\u6728\u5E73\u53F0\uFF1B\u4E09\u5C42\u5C4B\u9876\u9732\u53F0\u6709\u74E6\u5C4B\u9762\u4E0A\u7684\u6728\u8D28\u9636\u68AF\u5EA7\u3001\u6C34\u666F\u6C60\u548C\u6728\u683C\u6805\u6321\u5899\u58C1\u706F\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002"}}{let c=t.buildings.find(g=>g.osmId===541482372);if(c){let g=ls(...c.rectCenter,"\u767E\u5C81\u5BAB");g.position.y=c.base,g.rotation.y=Math.atan2(-c.axis[1],c.axis[0]);let v=c.width,S=c.depth,w=new G,L=[[-v/2-1,-S/2-1],[v/2+1,-S/2-1],[v/2+1,S/2+1],[-v/2-1,S/2+1]],N=[[-v*.14,-S*.2],[v*.14,-S*.2],[v*.14,S*.2],[-v*.14,S*.2]],X=L.map((k,J)=>[(k[0]+N[J][0])*.5,(k[1]+N[J][1])*.5]),H=(k,J)=>[k[0],J,k[1]],U=c.wallHeight+.4,K=U+3.1;for(let k=0;k<4;k++){let J=(k+1)%4;w.quad(H(L[k],U),H(L[J],U),H(X[J],K),H(X[k],K)),w.quad(H(X[k],K),H(X[J],K),H(N[J],U),H(N[k],U)),rn(g,[H(X[k],K+.08),H(X[J],K+.08)],"#4e564c")}w.mesh(ct("#7b8da2",{map:Pt,side:xn}),g);let q=new G;for(let k=0;k<4;k++){let J=(k+1)%4;q.quad(H(N[k],U-4),H(N[J],U-4),H(N[J],U),H(N[k],U),"#c7c4b4")}q.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),g),Yt(g,0,U-4,0,v*.28,.15,S*.4,be);for(let k of[-1,1])for(let J=1;J<5;J++)Yt(g,0,J*3,k*(S/2+.24),v,.2,.6,be)}}function sx(c,{double:g=!1,roofCol:v="#f0b52e",wallCol:S="#f2b33a"}={}){let w=ls(...c.rectCenter,c.name||c.precinct||c.templeGuess||"\u5BFA\u9662");w.userData.buildingId=c.id,w.position.y=c.base,w.rotation.y=Math.atan2(-c.axis[1],c.axis[0]);let L=Math.cos(w.rotation.y),N=Math.sin(w.rotation.y),X=(It,oe)=>[c.rectCenter[0]+It*L+oe*N,c.rectCenter[1]-It*N+oe*L],H=c.width/2,U=c.depth/2,K=Math.max(c.wallHeight,g?11:7.5),q=new G,k=new G,J=new G,j=new G,at=0;for(let[It,oe]of[[-H,-U],[H,-U],[H,U],[-H,U],[0,U],[0,-U]])at=Math.min(at,_(...X(It*1.1,oe*1.1))-c.base);let pt=.9;gn(q,-H-.6,H+.6,at-.5,pt,-U-.6,U+.6,"#d8d0bc"),gn(q,-H-.75,H+.75,pt-.12,pt+.05,-U-.75,U+.75,"#c4bba5");for(let It=0;It<4;It++)gn(q,-3.2,3.2,at-.5,pt-It*.22,U+.6+It*.38,U+.98+It*.38,"#d2cab5");let Ut=1.9,dt=H-Ut,Vt=U-Ut,Gt=g?K*.56:K*.86;gn(k,-dt,dt,pt,Gt,-Vt,Vt,S);let St="#b8332a",F=(It,oe,Rt,kt)=>gn(k,It-.28,It+.28,Rt,kt,oe-.28,oe+.28,St),ot=Math.max(2,Math.round(2*H/3.4)),_t=Math.max(2,Math.round(2*U/3.4));for(let It=0;It<=ot;It++){let oe=-H+.5+It*(2*H-1)/ot;F(oe,-U+.5,pt,Gt),F(oe,U-.5,pt,Gt)}for(let It=1;It<_t;It++){let oe=-U+.5+It*(2*U-1)/_t;F(-H+.5,oe,pt,Gt),F(H-.5,oe,pt,Gt)}let it=(It,oe,Rt,kt,xe)=>{gn(j,It,oe,xe-.75,xe,Rt,kt,"#2f6f6c"),gn(j,It-.01,oe+.01,xe-.85,xe-.75,Rt-.01,kt+.01,"#e2b64a")};it(-H+.2,H-.2,-U+.2,-U+.75,Gt),it(-H+.2,H-.2,U-.75,U-.2,Gt),it(-H+.2,-H+.75,-U+.2,U-.2,Gt),it(H-.75,H-.2,-U+.2,U-.2,Gt);let xt=Math.max(3,Math.min(7,Math.round(2*dt/3.4)|1)),ut=2*dt/xt;for(let It=0;It<xt;It++){let oe=-dt+It*ut+.25,Rt=-dt+(It+1)*ut-.25;gn(j,oe,Rt,pt+.1,Math.min(Gt-1,pt+4.2),Vt,Vt+.08,"#8e2a20");for(let kt=1;kt<4;kt++){let xe=pt+.1+kt*(Math.min(Gt-1,pt+4.2)-pt-.1)/4;gn(j,oe,Rt,xe-.04,xe+.04,Vt+.08,Vt+.12,"#d9ad4c")}gn(j,(oe+Rt)/2-.04,(oe+Rt)/2+.04,pt+.1,Math.min(Gt-1,pt+4.2),Vt+.08,Vt+.12,"#d9ad4c")}function rt(It,oe,Rt,kt,xe,_e=1.5){let Z=Rt+kt*.48,Et=Rt+kt,wt=Math.max(1,It-oe*.62),Nt=oe*.5,Q=10,Ft=ie=>_e*Math.pow(ie,3),he=(ie,Oe)=>[ie,Rt+Ft(Math.max(Math.abs(ie)/It,Math.abs(Oe)/oe)),Oe];for(let ie of[-1,1])for(let Oe=0;Oe<Q;Oe++){let Je=-1+2*Oe/Q,en=-1+2*(Oe+1)/Q;J.quad(he(Je*It,ie*oe),he(en*It,ie*oe),[en*wt,Z,ie*Nt],[Je*wt,Z,ie*Nt],xe)}for(let ie of[-1,1])for(let Oe=0;Oe<Q;Oe++){let Je=-1+2*Oe/Q,en=-1+2*(Oe+1)/Q;J.quad(he(ie*It,Je*oe),he(ie*It,en*oe),[ie*wt,Z,en*Nt],[ie*wt,Z,Je*Nt],xe)}for(let ie of[-1,1])J.quad([-wt,Z,ie*Nt],[wt,Z,ie*Nt],[wt+.15,Et,0],[-wt-.15,Et,0],xe);for(let ie of[-1,1])k.tri([ie*wt,Z,-Nt],[ie*wt,Z,Nt],[ie*wt,Et,0],St);gn(j,-wt-.4,wt+.4,Et-.15,Et+.55,-.32,.32,Ur(xe,-.18));for(let ie of[-1,1])gn(j,ie*(wt+.1)-.35,ie*(wt+.1)+.35,Et,Et+1.7,-.3,.3,"#c9952e"),gn(j,ie*(wt+.1)-(ie>0?.9:-.5),ie*(wt+.1)+(ie>0?-.5:.9),Et+1.2,Et+1.7,-.26,.26,"#c9952e");for(let[ie,Oe]of[[-1,-1],[1,-1],[1,1],[-1,1]])gn(j,ie*It-.18,ie*It+.18,Rt+_e-.05,Rt+_e+.45,Oe*oe-.18,Oe*oe+.18,Ur(xe,-.22))}let At=v,Ce=Math.max(c.roofRise||0,U*.55,3.5);if(g){let It=dt-.2,oe=Vt-.2;gn(k,-It,It,Gt,K,-oe,oe,S);for(let Nt=0;Nt<=ot;Nt++){let Q=-It+Nt*2*It/ot;gn(k,Q-.22,Q+.22,Gt+1.4,K,oe,oe+.06,St),gn(k,Q-.22,Q+.22,Gt+1.4,K,-oe-.06,-oe,St)}let Rt=H+1.3,kt=U+1.3,xe=Gt+.2,_e=xe+1.9,Z=10,Et=Nt=>1.1*Math.pow(Nt,3),wt=(Nt,Q)=>[Nt,xe+Et(Math.max(Math.abs(Nt)/Rt,Math.abs(Q)/kt)),Q];for(let Nt of[-1,1])for(let Q=0;Q<Z;Q++){let Ft=-1+2*Q/Z,he=-1+2*(Q+1)/Z;J.quad(wt(Ft*Rt,Nt*kt),wt(he*Rt,Nt*kt),[he*It,_e,Nt*oe],[Ft*It,_e,Nt*oe],At)}for(let Nt of[-1,1])for(let Q=0;Q<Z;Q++){let Ft=-1+2*Q/Z,he=-1+2*(Q+1)/Z;J.quad(wt(Nt*Rt,Ft*kt),wt(Nt*Rt,he*kt),[Nt*It,_e,he*oe],[Nt*It,_e,Ft*oe],At)}it(-It,It,oe,oe+.1,K),it(-It,It,-oe-.1,-oe,K),rt(It+1.6,oe+1.6,K,Ce,At,1.6)}else rt(H+1.4,U+1.4,Gt+.15,Ce,At,1.5);q.mesh(ct("#ffffff",{vertexColors:!0}),w),k.mesh(ct("#ffffff",{vertexColors:!0,map:Ot,side:xn}),w),J.mesh(ct("#ffffff",{vertexColors:!0,map:Pt,side:xn}),w),j.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),w)}for(let c of Dr){let g=t.buildings.find(v=>v.osmId===c);if(g){let v=g.ring,S=g.base-.4,w=3.9,L=g.base+w,N=new G,X=new G,H=0;v.forEach((xt,ut)=>{let rt=v[(ut+1)%v.length];H+=xt[0]*rt[1]-rt[0]*xt[1]});for(let xt=0;xt<v.length;xt++){let ut=v[xt],rt=v[(xt+1)%v.length],At=Math.hypot(rt[0]-ut[0],rt[1]-ut[1]);N.quad([ut[0],S,ut[1]],[rt[0],S,rt[1]],[rt[0],L,rt[1]],[ut[0],L,ut[1]],"#f6f7f5",[[0,S/.6],[At/.6,S/.6],[At/.6,L/.6],[0,L/.6]]);let Ce=(H>0?1:-1)*(rt[1]-ut[1])/At*.03,It=(H>0?-1:1)*(rt[0]-ut[0])/At*.03;N.quad([ut[0]+Ce,S,ut[1]+It],[rt[0]+Ce,S,rt[1]+It],[rt[0]+Ce,g.base+1.1,rt[1]+It],[ut[0]+Ce,g.base+1.1,ut[1]+It],"#9aa2a6",[[0,0],[At/.6,0],[At/.6,1.5/.6],[0,1.5/.6]]);let oe=Ce*12,Rt=It*12;X.quad([ut[0]+oe,L,ut[1]+Rt],[rt[0]+oe,L,rt[1]+Rt],[rt[0]+oe,L+.45,rt[1]+Rt],[ut[0]+oe,L+.45,ut[1]+Rt],"#6f7a80")}let U=new G;for(let xt of js.triangulateShape(v.map(ut=>new fe(ut[0],ut[1])),[]))U.tri(...xt.map(ut=>[v[ut][0],L+.3,v[ut][1]]),"#b9bec0");let K=v[g.front],q=v[(g.front+1)%v.length],k=Math.hypot(q[0]-K[0],q[1]-K[1]),J=(q[0]-K[0])/k,j=(q[1]-K[1])/k,at=(H>0?1:-1)*j,pt=(H>0?-1:1)*J,Ut=document.createElement("canvas");Ut.width=1024,Ut.height=256;let dt=Ut.getContext("2d");dt.fillStyle="#1f5fae",dt.fillRect(0,0,1024,128),dt.fillStyle="#fff",dt.font='bold 84px "PingFang SC","Noto Sans SC",sans-serif',dt.textAlign="center",dt.textBaseline="middle",dt.fillText("\u516C\u5171\u5395\u6240  WC",512,68);let Vt=(xt,ut,rt)=>{dt.fillStyle=ut,dt.fillRect(xt,128,128,128),dt.fillStyle="#fff",dt.beginPath(),dt.arc(xt+64,158,14,0,7),dt.fill(),rt?(dt.beginPath(),dt.moveTo(xt+64,174),dt.lineTo(xt+92,224),dt.lineTo(xt+36,224),dt.fill(),dt.fillRect(xt+52,224,8,22),dt.fillRect(xt+68,224,8,22)):(dt.fillRect(xt+48,174,32,46),dt.fillRect(xt+50,220,11,28),dt.fillRect(xt+67,220,11,28))};Vt(0,"#1f5fae",!1),Vt(128,"#d0342c",!0),dt.font='bold 92px "PingFang SC",sans-serif',dt.fillStyle="#1f5fae",dt.fillText("\u7537",320,194),dt.fillStyle="#d0342c",dt.fillText("\u5973",448,194);let Gt=new gs(Ut);Gt.colorSpace=Wn,Gt.anisotropy=8;let St=new G,F=(xt,ut,rt,At,Ce,It,oe,Rt)=>{let kt=K[0]+J*ut+at*It,xe=K[1]+j*ut+pt*It;xt.quad([kt-J*At/2,rt,xe-j*At/2],[kt+J*At/2,rt,xe+j*At/2],[kt+J*At/2,rt+Ce,xe+j*At/2],[kt-J*At/2,rt+Ce,xe-j*At/2],oe,Rt)},ot=Math.min(k*.7,7.5);F(St,k/2,g.base+2.75,ot,ot/8,.08,"#ffffff",[[0,.5],[1,.5],[1,1],[0,1]]);for(let[xt,ut]of[[0,.27],[1,.73]]){let rt=k*ut;F(X,rt,g.base,1.5,2.35,.06,"#2f3a40"),F(X,rt,g.base,1.7,.12,.07,"#e9ece9"),F(X,rt-.85,g.base,.12,2.47,.07,"#e9ece9"),F(X,rt+.85,g.base,.12,2.47,.07,"#e9ece9"),F(St,rt+(xt?-1.35:1.35),g.base+1.45,.62,.62,.09,"#ffffff",[[xt*.125,0],[xt*.125+.125,0],[xt*.125+.125,.5],[xt*.125,.5]])}F(St,k*.27,g.base+2.42,.5,.25,.09,"#ffffff",[[.25,.08],[.375,.08],[.375,.42],[.25,.42]]),F(St,k*.73,g.base+2.42,.5,.25,.09,"#ffffff",[[.375,.08],[.5,.08],[.5,.42],[.375,.42]]);let _t=(()=>{let xt=document.createElement("canvas");xt.width=xt.height=64;let ut=xt.getContext("2d");ut.fillStyle="#fff",ut.fillRect(0,0,64,64),ut.fillStyle="#c9cfd2",ut.fillRect(0,0,64,3),ut.fillRect(0,0,3,64);let rt=new gs(xt);return rt.wrapS=rt.wrapT=eo,rt.colorSpace=Wn,rt})(),it=new Cn;it.userData.placeId=el(Object.keys(pn).find(xt=>pn[xt]===c)),$t.add(it),ln.push(it),N.mesh(ct("#ffffff",{vertexColors:!0,map:_t,side:xn}),it),X.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),it),U.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),it),St.mesh(new os({map:Gt,toneMapped:!1,side:xn,polygonOffset:!0,polygonOffsetFactor:-2}),it)}}{let v=di(-1372,-25),S=new Cn;S.position.set(-1372,v,-25),S.rotation.y=Math.atan2(10,-37),S.userData.placeId=el("\u864E\u5F62\u5C71\u8F66\u7AD9"),$t.add(S),ln.push(S);let w=3,L=2.2,N=3.3,X=ct("#f6f4ee"),H=ct("#2a62c9"),U=ct("#33424a");Yt(S,0,-.6,0,w*2+.6,.6,L*2+.6,ct("#c9c3b3")),Yt(S,0,0,0,w*2,N,L*2,X),Yt(S,0,N,0,w*2+.8,.35,L*2+.8,ct("#d8dcdc")),Yt(S,0,N-.9,L+.03,w*2+.1,.75,.12,H),Yt(S,-.9,.95,L+.02,1.6,1.15,.08,ct("#7fa4b5")),Yt(S,-.9,.9,L+.2,1.9,.08,.4,U),Yt(S,1.25,0,L+.02,1,2.2,.08,U);let K=document.createElement("canvas");K.width=512,K.height=96;let q=K.getContext("2d");q.fillStyle="#2a62c9",q.fillRect(0,0,512,96),q.fillStyle="#fff",q.font='bold 64px "PingFang SC","Noto Sans SC",sans-serif',q.textAlign="center",q.textBaseline="middle",q.fillText("\u552E \u7968 \u5904",256,52);let k=new gs(K);k.colorSpace=Wn;let J=new Qe(new ms(w*2-.4,.62),new os({map:k,toneMapped:!1}));J.position.set(0,N-.52,L+.1),S.add(J)}for(let c of Zn){let g=c.area>=600,v=c.osmId===609990009?"#D9A93A":c.roofColor;sx(c,{double:g,roofCol:z[v]||v,wallCol:gt[c.wallColor]||c.wallColor||"#f2b33a"})}{let c=t.buildings.find(g=>g.name==="\u4E07\u4F5B\u5854");if(c){let g=ls(...c.center,"\u4E07\u4F5B\u5854");g.position.y=c.base;for(let v=0;v<7;v++){let S=6.2-v*.51;we(g,0,v*4.3,0,S,3.5,I);let w=new no(S+1.4,1.4,8),L=new Qe(w,I);L.position.y=v*4.3+4,g.add(L)}we(g,0,30,0,.36,3,I)}}function rx(c,g=2){let v=c;for(let S=0;S<g&&v.length>2;S++){let w=[v[0]];for(let L=1;L<v.length;L++){let N=v[L-1],X=v[L];w.push([N[0]*.75+X[0]*.25,N[1]*.75+X[1]*.25],[N[0]*.25+X[0]*.75,N[1]*.25+X[1]*.75])}w.push(v.at(-1)),v=w}return v}function ox(c,g){let v=0,S=[];for(let H=1;H<c.length;H++){let U=Math.hypot(c[H][0]-c[H-1][0],c[H][1]-c[H-1][1]);S.push(U),v+=U}let w=Math.max(1,Math.round(v/g)),L=[c[0]],N=0,X=0;for(let H=1;H<w;H++){let U=v*H/w;for(;N<S.length-1&&X+S[N]<U;)X+=S[N],N++;let K=S[N]?(U-X)/S[N]:0,q=c[N],k=c[N+1];L.push([q[0]+(k[0]-q[0])*K,q[1]+(k[1]-q[1])*K])}return L.push(c.at(-1)),L}let Dl=new Map,Ul=8,ax=(c,g)=>Math.floor(c/Ul)+","+Math.floor(g/Ul);function lo(c,g,v,S=-1,w=!1){let L=null,N=v,X=Math.floor(c/Ul),H=Math.floor(g/Ul);for(let U=-1;U<=1;U++)for(let K=-1;K<=1;K++)for(let q of Dl.get(X+U+","+(H+K))||[]){if(q[7]===S)continue;let k=q[2]-q[0],J=q[3]-q[1],j=k*k+J*J||1,at=si(((c-q[0])*k+(g-q[1])*J)/j,0,1),pt=q[0]+k*at,Ut=q[1]+J*at,dt=Math.hypot(c-pt,g-Ut);dt<N&&(w||dt<q[6])&&(N=dt,L=[pt,Ut,q[4]+(q[5]-q[4])*at,q[6],q[7]])}return L}let tu=0,zd=[],kd=[],lx=(c,g)=>[(c+e/2)/e,1-(g+n/2)/n];function Hd(c,g,v,S,w=null,{lift:L=.15,step:N=3,smooth:X=!0,level:H=!0,shoulder:U=2,bridge:K=!1}={}){let q=ox(X?rx(c):c,N).filter((F,ot,_t)=>!ot||Math.hypot(F[0]-_t[ot-1][0],F[1]-_t[ot-1][1])>.05);if(q.length<2)return q;let k=g/2,J=w?Math.min(.6,g*.2):0,j=q.length,at=q.map(F=>di(F[0],F[1]));if(K){let F=ut=>lo(q[ut][0],q[ut][1],8)?.[2]??at[ut],ot=F(0),_t=F(j-1),it=0,xt=[0];for(let ut=1;ut<j;ut++)xt.push(it+=Math.hypot(q[ut][0]-q[ut-1][0],q[ut][1]-q[ut-1][1]));at=xt.map(ut=>ot+(_t-ot)*ut/(it||1))}else if(H){let F=Math.max(1,Math.round(8/N));at=at.map((it,xt)=>{let ut=0,rt=0;for(let At=Math.max(0,xt-F);At<=Math.min(j-1,xt+F);At++)ut+=at[At],rt++;return ut/rt});let ot=[0];for(let it=1;it<j;it++)ot.push(ot[it-1]+Math.hypot(q[it][0]-q[it-1][0],q[it][1]-q[it-1][1]));let _t=q.map((it,xt)=>{let ut=xt===0||xt===j-1,rt=ut?lo(it[0],it[1],k+3,-1,!0):lo(it[0],it[1],k+2);return rt&&(ut||rt[3]>=k+.2)?rt[2]:null});for(let it of kd){let xt=-1,ut=k+1.5;for(let rt=0;rt<j;rt++){let At=Math.hypot(q[rt][0]-it[0],q[rt][1]-it[1]);At<ut&&(ut=At,xt=rt)}xt>=0&&_t[xt]==null&&(_t[xt]=it[2])}at=at.map((it,xt)=>{if(_t[xt]!=null)return _t[xt];let ut=null,rt=15;for(let It=0;It<j;It++)_t[It]!=null&&Math.abs(ot[It]-ot[xt])<rt&&(rt=Math.abs(ot[It]-ot[xt]),ut=_t[It]);if(ut==null)return it;let At=rt/15,Ce=At*At*(3-2*At);return ut+(it-ut)*Ce})}let pt=q.map((F,ot)=>{let _t=q[Math.max(0,ot-1)],it=q[Math.min(j-1,ot+1)],xt=Math.hypot(it[0]-_t[0],it[1]-_t[1])||1;return[(it[0]-_t[0])/xt,(it[1]-_t[1])/xt]}),Ut=new Map,dt=F=>{if(!Ut.has(F)){let ot,_t;Ut.set(F,q.map((it,xt)=>{let ut=it[0]-pt[xt][1]*F,rt=it[1]+pt[xt][0]*F;return xt&&(ut-ot)*pt[xt][0]+(rt-_t)*pt[xt][1]<=0&&(ut=ot,rt=_t),ot=ut,_t=rt,[ut,rt]}))}return Ut.get(F)},Vt=(F,ot,_t)=>{let[it,xt]=dt(ot)[F];return[it,H?_t:di(it,xt)+_t-at[F],xt]},Gt=F=>at[F]+L,St=F=>at[F]+L-.04;for(let F=1;F<j;F++)J&&(v.edge.quad(Vt(F-1,-k,St(F-1)),Vt(F,-k,St(F)),Vt(F,-k+J,St(F)),Vt(F-1,-k+J,St(F-1)),w),v.edge.quad(Vt(F-1,k-J,St(F-1)),Vt(F,k-J,St(F)),Vt(F,k,St(F)),Vt(F-1,k,St(F-1)),w)),v.fill.quad(Vt(F-1,-k+J,Gt(F-1)),Vt(F,-k+J,Gt(F)),Vt(F,k-J,Gt(F)),Vt(F-1,k-J,Gt(F-1)),S);for(let[F,ot]of[[0,-1],[j-1,1]]){let _t=q[F],it=Math.atan2(pt[F][1],pt[F][0]),xt=(ut,rt,At)=>[_t[0]+Math.cos(ut)*rt*ot,At,_t[1]+Math.sin(ut)*rt*ot];for(let ut=0;ut<8;ut++){let rt=it-Math.PI/2+Math.PI*ut/8,At=it-Math.PI/2+Math.PI*(ut+1)/8;v.fill.tri([_t[0],Gt(F),_t[1]],xt(rt,k-J,Gt(F)),xt(At,k-J,Gt(F)),S),J&&v.edge.quad(xt(rt,k-J,St(F)),xt(At,k-J,St(F)),xt(At,k,St(F)),xt(rt,k,St(F)),w)}}if(K)for(let F of[-1,1])for(let ot=1;ot<j;ot++)v.edge.quad(Vt(ot-1,F*k,St(ot-1)),Vt(ot,F*k,St(ot)),Vt(ot,F*k,St(ot)-1),Vt(ot-1,F*k,St(ot-1)-1),"#cfc8b6");if(H&&v.skirt&&!K){zd.push({s:q,h:at,dir:pt,w:k,shoulder:U,lift:L,id:tu,L:v,off:dt}),kd.push([q[0][0],q[0][1],at[0]],[q[j-1][0],q[j-1][1],at[j-1]]),un.lineCap=un.lineJoin="round",un.strokeStyle="#fff",un.lineWidth=(g+U*1.1)/e*Ne,un.beginPath(),q.forEach((F,ot)=>{let _t=(F[0]+e/2)/e*Ne,it=(F[1]+n/2)/n*Ne;ot?un.lineTo(_t,it):un.moveTo(_t,it)}),un.stroke();for(let F=1;F<j;F++){let ot=[q[F-1][0],q[F-1][1],q[F][0],q[F][1],at[F-1],at[F],k,tu],_t=new Set;for(let it of[0,.25,.5,.75,1])_t.add(ax(q[F-1][0]+(q[F][0]-q[F-1][0])*it,q[F-1][1]+(q[F][1]-q[F-1][1])*it));for(let it of _t)Dl.has(it)||Dl.set(it,[]),Dl.get(it).push(ot)}}return tu++,q}let zo={fill:"#62676b",edge:"#d6d1c4"},Vd={primary:{w:6.5,...zo},tertiary:{w:4.6,...zo},residential:{w:4,...zo},unclassified:{w:4,...zo},service:{w:3.4,...zo},bus_stop:{w:3,...zo},footway:{w:2.2,fill:"#d9d4c7",edge:"#9c9483"},path:{w:1.9,fill:"#e2bf84",edge:"#a27a45"},steps:{w:2.4,fill:"#cfc9bb",edge:"#8f8776"},alley:{w:1.2,fill:"#d3cec1",edge:"#8f887a"}},eu={primary:6,tertiary:5,residential:4,unclassified:4,service:3,bus_stop:3,footway:2,steps:2,alley:1,path:1},Gd=()=>({edge:new G,fill:new G,skirt:new G}),Nl=Gd(),Ol=Gd(),Wd=new G,nu={edge:new G,fill:new G,skirt:null},cx=c=>[c.pts[0],c.pts.at(-1)].filter(g=>t.roads.some(v=>v!==c&&v.pts.some((S,w)=>w&&w<v.pts.length-1&&Math.hypot(S[0]-g[0],S[1]-g[1])<6||w&&(()=>{let L=v.pts[w-1],N=S[0]-L[0],X=S[1]-L[1],H=N*N+X*X||1,U=si(((g[0]-L[0])*N+(g[1]-L[1])*X)/H,.05,.95);return Math.hypot(g[0]-L[0]-N*U,g[1]-L[1]-X*U)<2})()))).length;for(let c of t.roads)c._ends=cx(c);for(let c of[...t.roads].sort((g,v)=>!!g.bridge-!!v.bridge||(eu[v.kind]||3)-(eu[g.kind]||3)||g._ends-v._ends)){if(c.model==="stair")continue;let g=Vd[c.kind]||Vd.service,v=["steps","path","footway","alley"].includes(c.kind),S=Math.max(c.width,g.w),w=eu[c.kind]||3,L=Hd(c.pts,S,v?Ol:Nl,g.fill,g.edge,{lift:.14+w*.012+(c.drape?.12:0),step:c.drape?1:v?4:5,bridge:!!c.bridge,smooth:!c.bridge,level:!c.drape,shoulder:v?1.4:2.2});if(c.kind==="primary"||c.kind==="tertiary"){let N=L.map(X=>lo(X[0],X[1],1)?.[2]??di(X[0],X[1]));for(let X=0;X+1<L.length;X+=3){let H=(N[X]+N[X+1])/2+.14+w*.012+.03;Wd.quad(...[[L[X],-.11],[L[X+1],-.11],[L[X+1],.11],[L[X],.11]].map(([U,K])=>{let q=[L[X+1][0]-L[X][0],L[X+1][1]-L[X][1]],k=Math.hypot(...q)||1;return[U[0]-q[1]/k*K,H,U[1]+q[0]/k*K]}),"#ffffff")}}if(c.kind==="steps"){let N=0;for(let X=1;X<L.length;X++){let H=L[X-1],U=L[X],K=Math.hypot(U[0]-H[0],U[1]-H[1]),q=-(U[1]-H[1])/K,k=(U[0]-H[0])/K;for(let J=(.7-N%.7)/K;J<1;J+=.7/K){let j=H[0]+(U[0]-H[0])*J,at=H[1]+(U[1]-H[1])*J,pt=S*.4,Ut=(lo(j,at,1)?.[2]??di(j,at))+.2+w*.012;rn(Me,[[j+q*pt,Ut,at+k*pt],[j-q*pt,Ut,at-k*pt]],"#9c8a6c")}N+=K}}if(c.bridge)for(let N of[-1,1]){let X=c.pts.map((H,U)=>{let K=c.pts[Math.min(U+1,c.pts.length-1)]||H,q=c.pts[Math.max(0,U-1)],k=K[0]-q[0],J=K[1]-q[1],j=Math.hypot(k,J)||1,at=H[0]-J/j*S/2*N,pt=H[1]+k/j*S/2*N;return[at,(lo(H[0],H[1],S)?.[2]??_(...H))+1.1,pt]});rn(Ct,X,"#ceccc0")}}for(let c of zd){let{s:g,h:v,dir:S,w,shoulder:L,lift:N,id:X,L:H,off:U}=c,K=g.length,q=(j,at,pt)=>{let[Ut,dt]=U(at)[j];return[Ut,pt??di(Ut,dt),dt]},k=j=>{let at=lo(j[0],j[2],12,X);return at&&(j[1]=Math.min(j[1],at[2]-.15)),j},J=(j,at,pt,Ut)=>H.skirt.quad(...[j,at,pt,Ut].map(k),"#ffffff",[j,at,pt,Ut].map(dt=>lx(dt[0],dt[2])));for(let j of[-1,1])for(let at=1;at<K;at++)J(q(at-1,j*w,v[at-1]+N-.06),q(at,j*w,v[at]+N-.06),q(at,j*(w+L)),q(at-1,j*(w+L)));for(let[j,at]of[[0,-1],[K-1,1]]){let pt=g[j],Ut=S[j],dt=Math.atan2(Ut[1],Ut[0]),Vt=v[j]+N-.06;for(let Gt=0;Gt<8;Gt++){let St=dt-Math.PI/2+Math.PI*Gt/8,F=dt-Math.PI/2+Math.PI*(Gt+1)/8,ot=it=>[pt[0]+Math.cos(it)*w*at,Vt,pt[1]+Math.sin(it)*w*at],_t=it=>{let xt=pt[0]+Math.cos(it)*(w+L)*at,ut=pt[1]+Math.sin(it)*(w+L)*at;return[xt,di(xt,ut),ut]};J(ot(St),ot(F),_t(F),_t(St))}}}mn.needsUpdate=!0;for(let c of t.water)Hd(c.pts,c.kind==="river"?5:1.8,nu,"#5fb4dc",c.kind==="river"?"#3f8fbd":null,{lift:.1,step:5,level:!1});let co=c=>new os({vertexColors:!0,side:xn,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:c}),Xd=new os({map:Rn,color:"#d9d9d9",side:xn});Nl.skirt.mesh(Xd,Tt),Ol.skirt.mesh(Xd,Me),Nl.edge.mesh(co(-2),Tt),Ol.edge.mesh(co(-2),Me),nu.edge.mesh(co(-2),Tt),nu.fill.mesh(co(-4),Tt),Ol.fill.mesh(co(-4),Me),Nl.fill.mesh(co(-6),Tt),Wd.mesh(co(-8),Tt);for(let c of t.areas.filter(g=>g.kind==="water")){let g=new G;for(let v of c.triangles)g.tri(...v.map(S=>[S[0],_(...S)+.3,S[1]]),"#6b9290");g.mesh(ct("#ffffff",{vertexColors:!0,roughness:.25,side:xn}),Tt)}Xt("#load-text").textContent="\u94FA\u8BBE\u5C71\u6797\u3001\u7F06\u8F66\u4E0E\u5730\u70B9\u6807\u8BB0",await new Promise(requestAnimationFrame);let hx=t.places.filter(c=>["\u4E0A\u95F5\u56ED","\u4E2D\u95F5\u56ED","\u4E0B\u95F5\u56ED","\u95F5\u56ED"].includes(c.n)).map(c=>[c.x,c.z]);function ux(c,g,v,S){if(v<420||v>1e3||S>1.1)return 0;let w=1e9;for(let[L,N]of hx)w=Math.min(w,Math.hypot(c-L,g-N));return w<900?.55:v<760&&w<2600?.12:0}let iu=[],Fl=[],ir=Li(892),qd=nr?3600:16e3;for(let c=0;c<qd*8&&Fl.length<qd;c++){let g=(ir()-.5)*e*.998,v=(ir()-.5)*n*.998,S=_(g,v),w=f(S);if(He(g,v)||w<100||w>1310)continue;let L=Math.hypot(_(g+10,v)-_(g-10,v),_(g,v+10)-_(g,v-10))/20/l;if(L>1.7&&ir()<.84)continue;let N=nt(g,v,w);if(ir()>.06+.94*N*N)continue;let X=(6.5+ir()*6.7)*(N>.6?1.15:.9),H=ux(g,v,w,L);if(H&&ir()<H){iu.push({x:g,z:v,h:S,s:9+ir()*4,r:ir()});continue}Fl.push({x:g,z:v,h:S,s:X,r:ir(),pine:ir()<.18+(w>800?.25:0)})}let ho=3,Yd=(c,g)=>Math.min(ho-1,Math.max(0,Math.floor((c+e/2)/e*ho)))*ho+Math.min(ho-1,Math.max(0,Math.floor((g+n/2)/n*ho)));function Fa(){let c=new yh(1,0);c.deleteAttribute("normal"),c.deleteAttribute("uv");let g=Lg(c);return g.setAttribute("normal",g.getAttribute("position").clone()),g}let Bl=ke(Ir[fi].hiShapes),fx=ct("#686854"),dx=ct("#ffffff"),px=ct("#ffffff"),mx=ct("#ffffff",{roughness:.85}),su=nr?1:4,$d=nr?1.35:1,Ba=[],ru=[...Array(ho*ho)].map(()=>({list:[],bamboo:[]}));for(let c of Fl)ru[Yd(c.x,c.z)].list.push(c);for(let c of iu)ru[Yd(c.x,c.z)].bamboo.push(c);let Ui=new xi,ko=new fn,zl=(c,g,v,S)=>{if(!v)return null;let w=new Pr(c,g,v);return w.receiveShadow=S,le.add(w),w};for(let c of ru){let g=c.list,v=[0],S=[0];for(let k of g)v.push(v.at(-1)+(k.pine?0:1)),S.push(S.at(-1)+(k.pine?1:0));let w=zl(Bl.trunk,fx,g.length,!1),L=zl(Bl.leaf,dx,v.at(-1),!0),N=zl(Bl.pine,px,S.at(-1)*2,!0),X=zl(Bl.bamboo,mx,c.bamboo.length*su,!0),H=0,U=0,K=0,q=0;for(let k of g){Ui.position.set(k.x,k.h+k.s*.35,k.z),Ui.rotation.set(0,k.r*6.28,0),Ui.scale.set(1,k.s*.7,1),Ui.updateMatrix(),w.setMatrixAt(H++,Ui.matrix);for(let J=0;J<2;J++)k.pine?(Ui.position.set(k.x,k.h+k.s*(.68+J*.36),k.z),Ui.scale.set(k.s*(.5-J*.12),k.s*.91,k.s*(.5-J*.12)),ko.set(k.r>.5?"#2e7a52":"#3d8c5a"),Ui.updateMatrix(),N.setMatrixAt(K,Ui.matrix),N.setColorAt(K++,ko)):J||(Ui.position.set(k.x,k.h+k.s*.72,k.z),Ui.scale.set(k.s*.74,k.s*.5,k.s*.72),ko.set(k.r<.05?"#f0b23e":k.r>.965?"#e86a3f":["#5aa646","#78bb4e","#3f8f45","#93c95a"][Math.floor(k.r*4)]),Ui.updateMatrix(),L.setMatrixAt(U,Ui.matrix),L.setColorAt(U++,ko))}for(let k of c.bamboo)for(let J=0;J<su;J++){let j=k.r*6.28+J*1.9,at=J?2.2+(k.r*97+J*13)%1*1.8:0;Ui.position.set(k.x+Math.cos(j)*at,k.h+k.s*(.6-.05*J),k.z+Math.sin(j)*at),Ui.rotation.set(Math.sin(j)*.22,0,Math.cos(j)*.22),Ui.scale.set((2.1+.4*(J*7%3))*$d,k.s*.46*(1-.06*J),(2.1+.4*(J*5%3))*$d),Ui.updateMatrix(),X.setMatrixAt(q,Ui.matrix),ko.set(["#8cc25a","#99ca62","#7fb852","#a6d16c"][(J+Math.floor(k.r*4))%4]),X.setColorAt(q++,ko)}for(let k of[w,L,N,X])k&&(k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),k.computeBoundingSphere());Ba.push({trunk:w,crown:L,cone:N,bam:X,n:g.length,leafPre:v,pinePre:S,nb:c.bamboo.length})}function gx(c){for(let g of Ba){let v=Math.round(c*g.n);g.trunk&&(g.trunk.count=v),g.crown&&(g.crown.count=g.leafPre[v]),g.cone&&(g.cone.count=2*g.pinePre[v]),g.bam&&(g.bam.count=Math.round(c*g.nb)*su)}}let Zd=null;function Jd(){let c=Ir[fi],g=Zd??(c.forest>0&&!xr);le.visible=g,Xt("#layer-trees").checked=g,g&&gx(c.forest||1)}function xx(c){let g=ke(c);for(let v of Ba)v.trunk&&(v.trunk.geometry=g.trunk),v.crown&&(v.crown.geometry=g.leaf),v.cone&&(v.cone.geometry=g.pine),v.bam&&(v.bam.geometry=g.bamboo);jt&&(jt.geometry=g.lantern)}function jd(){let c=Ir[fi];A.setCeiling(x(),!0),D(!1),st=!0,qt.traverse(v=>{v.isMesh&&v.material&&!Array.isArray(v.material)&&(v.material=Se(v.material,c.pbr))}),document.documentElement.classList.toggle("lite",!c.blur),xx(c.hiShapes),Jd();for(let v of Ba)v.bam&&(v.bam.visible=c.bamboo&&!xr);Qd=xr?12:c.labelCap;let g=T();p.shadowMap.enabled!==g&&(p.shadowMap.enabled=Re.castShadow=g,qt.traverse(v=>{if(v.material)for(let S of[].concat(v.material))S.needsUpdate=!0}))}let ou=[];for(let c of t.cables){let g=c.pts[0],v=c.pts.at(-1),S=Math.hypot(v[0]-g[0],v[1]-g[1]),w=[];for(let H=0;H<=90;H++){let U=H/90,K=g[0]+(v[0]-g[0])*U,q=g[1]+(v[1]-g[1])*U,k=Math.max(_(K,q)+13,_(...g)*(1-U)+_(...v)*U+23-Math.sin(U*Math.PI)*S*.017);w.push(new W(K,k,q))}let L=new Ro(w),N=-(v[1]-g[1])/S*2,X=(v[0]-g[0])/S*2;for(let H of[-1,1])rn(Ct,w.map(U=>[U.x+N*H,U.y,U.z+X*H]),"#3e514c");for(let H of[.2,.43,.67,.84]){let U=L.getPoint(H),K=_(U.x,U.z);we(Ct,U.x,K,U.z,.6,U.y-K,be),Yt(Ct,U.x,U.y-1,U.z,10,.65,1.2,be)}for(let H=0;H<6;H++){let U=new Cn;Yt(U,0,0,0,3.6,2.6,2.4,yt),Yt(U,0,1,0,3.7,1,2.45,de),Yt(U,0,2.8,0,.2,3,.2,O),Ct.add(U),ou.push({g:U,curve:L,phase:H/6,kind:"cable"})}}for(let c of t.funicular){let g=[];for(let L=1;L<c.pts.length;L++){let N=c.pts[L-1],X=c.pts[L],H=Math.ceil(Math.hypot(X[0]-N[0],X[1]-N[1])/3);for(let U=0;U<H;U++){let K=U/H,q=N[0]+(X[0]-N[0])*K,k=N[1]+(X[1]-N[1])*K;g.push(new W(q,_(q,k)+.8,k))}}let v=c.pts.at(-1);g.push(new W(v[0],_(...v)+.8,v[1]));let S=new Ro(g);for(let L of[-1,1])rn(Ct,g.map(N=>[N.x,N.y,N.z+L*.8]),"#dad8c3");let w=new Cn;Yt(w,0,0,0,7,2.5,2.4,ct("#eee8d8")),Yt(w,0,.8,0,6.8,1.2,2.45,de),Yt(w,0,2.3,0,7,.45,2.6,yt),Ct.add(w),ou.push({g:w,curve:S,phase:.4,kind:"funicular"})}{let c=[[/厕|洗手亭/,"wc"],[/停车场/,"park"],[/索道|缆车/,"cable"],[/加油站/,"fuel"],[/充电站/,"charge"],[/车站|客运站/,"bus"],[/售票|检票/,"ticket"],[/游客服务/,"info"],[/卫生院|医院/,"hospital"],[/药房|药堂/,"pharmacy"],[/派出所|公安|警/,"police"],[/小学|幼儿园|学校/,"school"],[/邮政|邮局/,"post"],[/银行/,"bank"]],g={wc:["#2f7fd0","WC"],park:["#2a62c9","P"],cable:["#7a52c2","\u7F06"],fuel:["#d9432f","\u6CB9"],charge:["#13a07a","\u7535"],bus:["#1d9a5b","bus"],ticket:["#e08a1e","\u7968"],info:["#2b8fd6","i"],hospital:["#ffffff","+r"],pharmacy:["#ffffff","+g"],police:["#1f4fa3","\u8B66"],school:["#e5a72e","\u5B66"],post:["#1a8a4a","\u90AE"],bank:["#c0392b","\xA5"]},v=Object.keys(g),S=document.createElement("canvas");S.width=S.height=512;let w=S.getContext("2d");v.forEach((j,at)=>{let[pt,Ut]=g[j],dt=at%4*128,Vt=Math.floor(at/4)*128;w.fillStyle=pt,w.fillRect(dt,Vt,128,128),w.strokeStyle="rgba(0,0,0,.18)",w.lineWidth=6,w.strokeRect(dt+3,Vt+3,122,122),w.fillStyle="#fff",w.textAlign="center",w.textBaseline="middle",Ut==="+r"||Ut==="+g"?(w.fillStyle=Ut==="+r"?"#d8312a":"#1f9a52",w.fillRect(dt+50,Vt+22,28,84),w.fillRect(dt+22,Vt+50,84,28)):Ut==="bus"?(w.beginPath(),w.roundRect(dt+22,Vt+26,84,66,10),w.fill(),w.fillStyle=pt,w.fillRect(dt+30,Vt+36,68,24),w.fillStyle="#fff",w.beginPath(),w.arc(dt+42,Vt+98,10,0,7),w.arc(dt+86,Vt+98,10,0,7),w.fill()):(w.font=`bold ${Ut.length>1&&/^[A-Z]/.test(Ut)?64:Ut==="i"?92:76}px "PingFang SC","Noto Sans SC",sans-serif`,w.fillText(Ut,dt+64,Vt+68))});let L=new gs(S);L.colorSpace=Wn,L.anisotropy=8;let N=new G,X=new G,H=new G,U=(j,at,pt)=>{let Ut=!1;for(let dt=0,Vt=pt.length-1;dt<pt.length;Vt=dt++){let Gt=pt[dt],St=pt[Vt];Gt[1]>at!=St[1]>at&&j<(St[0]-Gt[0])*(at-Gt[1])/(St[1]-Gt[1])+Gt[0]&&(Ut=!Ut)}return Ut},K=(j,at)=>{let pt=null,Ut=40;for(let dt of t.roads)if(!["footway","path","steps"].includes(dt.kind))for(let Vt=1;Vt<dt.pts.length;Vt++){let Gt=dt.pts[Vt-1],St=dt.pts[Vt],F=St[0]-Gt[0],ot=St[1]-Gt[1],_t=F*F+ot*ot||1,it=si(((j-Gt[0])*F+(at-Gt[1])*ot)/_t,0,1),xt=Gt[0]+F*it,ut=Gt[1]+ot*it,rt=Math.hypot(j-xt,at-ut);rt<Ut&&(Ut=rt,pt={x:xt,z:ut,ux:F/Math.sqrt(_t),uz:ot/Math.sqrt(_t)})}return pt},q=(j,at,pt,Ut,dt,Vt,Gt,St)=>{let F=[[at,Ut,Vt],[pt,Ut,Vt],[pt,Ut,Gt],[at,Ut,Gt],[at,dt,Vt],[pt,dt,Vt],[pt,dt,Gt],[at,dt,Gt]];for(let ot of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])j.quad(F[ot[0]],F[ot[1]],F[ot[2]],F[ot[3]],St)},k=(j,at,pt,Ut,dt,Vt,Gt,St,F,ot)=>{let _t=-dt,it=Ut,xt=(rt,At,Ce)=>[at+Ut*rt+_t*At,Ce,pt+dt*rt+it*At],ut=[xt(-Vt,-Gt,St),xt(Vt,-Gt,St),xt(Vt,Gt,St),xt(-Vt,Gt,St),xt(-Vt,-Gt,F),xt(Vt,-Gt,F),xt(Vt,Gt,F),xt(-Vt,Gt,F)];for(let rt of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])j.quad(ut[rt[0]],ut[rt[1]],ut[rt[2]],ut[rt[3]],ot)};for(let j of t.places){if(j.category!=="service"&&j.category!=="transport")continue;let at=c.find(([Rt])=>Rt.test(j.n))?.[1];if(!at||/公司|营业厅/.test(j.n)||pn[j.n])continue;let pt=v.indexOf(at),Ut=pt%4/4,dt=1-Math.floor(pt/4)/4,Vt=[[Ut+.004,dt-.246],[Ut+.246,dt-.246],[Ut+.246,dt-.004],[Ut+.004,dt-.004]],Gt=t.buildings.find(Rt=>Math.abs(Rt.rectCenter[0]-j.x)<40&&Math.abs(Rt.rectCenter[1]-j.z)<40&&U(j.x,j.z,Rt.ring)),St=di(j.x,j.z),F=Gt?Dr.has(Gt.osmId)?Gt.base+4.2:Gt.base+Gt.wallHeight+(Gt.roofRise||0):St,ot=5.5,_t=F+(Gt?1.5:7),it=ot/2;q(X,j.x-.18,j.x+.18,Gt?F-.5:St,_t,j.z-.18,j.z+.18,"#5b6066");let xt=j.x-it,ut=j.x+it,rt=j.z-it,At=j.z+it,Ce=_t,It=_t+ot;N.quad([xt,Ce,At],[ut,Ce,At],[ut,It,At],[xt,It,At],"#ffffff",Vt),N.quad([ut,Ce,rt],[xt,Ce,rt],[xt,It,rt],[ut,It,rt],"#ffffff",Vt),N.quad([ut,Ce,At],[ut,Ce,rt],[ut,It,rt],[ut,It,At],"#ffffff",Vt),N.quad([xt,Ce,rt],[xt,Ce,At],[xt,It,At],[xt,It,rt],"#ffffff",Vt);let oe=[[Ut+.12,dt-.12],[Ut+.13,dt-.12],[Ut+.13,dt-.13],[Ut+.12,dt-.13]];if(N.quad([xt,It,At],[ut,It,At],[ut,It,rt],[xt,It,rt],"#ffffff",oe),at==="bus"&&j.n!=="\u4E09\u89D2\u6D32\u8F66\u7AD9"){let Rt=K(j.x,j.z);if(Rt){let kt=Rt.x,xe=Rt.z,_e=di(kt,xe)+.45;k(H,kt,xe,Rt.ux,Rt.uz,4.6,1.25,_e,_e+2.9,"#2fae6a"),k(H,kt,xe,Rt.ux,Rt.uz,4.62,1.27,_e+1.55,_e+2.45,"#2b3a40"),k(H,kt,xe,Rt.ux,Rt.uz,4.5,1.2,_e+2.9,_e+3.1,"#f4f1e8");for(let Z of[-2.9,2.9])for(let Et of[-1,1]){let wt=kt+Rt.ux*Z-Rt.uz*1.2*Et,Nt=xe+Rt.uz*Z+Rt.ux*1.2*Et;k(H,wt,Nt,Rt.ux,Rt.uz,.5,.18,_e-.45,_e+.5,"#2a2a2a")}}}if(at==="fuel"){let Rt=St+5.2;q(H,j.x-6,j.x+6,Rt,Rt+.8,j.z-4.5,j.z+4.5,"#f4f1e8"),q(H,j.x-6.05,j.x+6.05,Rt+.15,Rt+.55,j.z-4.55,j.z+4.55,"#d9432f");for(let[kt,xe]of[[-5,-3.5],[5,-3.5],[-5,3.5],[5,3.5]])q(H,j.x+kt-.2,j.x+kt+.2,St,Rt,j.z+xe-.2,j.z+xe+.2,"#e8e4da");for(let kt of[-2.2,2.2])q(H,j.x+kt-.5,j.x+kt+.5,St,St+1.9,j.z-.35,j.z+.35,"#d9432f")}}let J=new Cn;Ct.add(J),Hn.push(N.mesh(new os({map:L,toneMapped:!1}),J),X.mesh(ct("#ffffff",{vertexColors:!0}),J)),H.p.length&&H.mesh(ct("#ffffff",{vertexColors:!0,side:xn}),J)}for(let[c,g]of je){let v=new Pn;v.setAttribute("position",new sn(g.p,3)),v.setAttribute("color",new sn(g.c,3)),c.add(new Ml(v,new Ra({vertexColors:!0})))}if(y){let c=Xg(y,ct);$t.add(c),ln.push(c),Hs.set(d.n,y.floor+7.5)}{let c=new Map,g=w=>[w.type,w.color?.getHexString(),w.emissive?.getHexString(),w.emissiveIntensity,w.roughness,w.metalness,w.opacity,w.transparent,w.side,w.map?.uuid,w.emissiveMap?.uuid,w.vertexColors,w.flatShading,w.depthWrite,w.depthTest,w.alphaTest,w.polygonOffset,w.polygonOffsetFactor,w.polygonOffsetUnits,w.fog,w.toneMapped].join("/"),v=w=>{let L=g(w);return c.has(L)||c.set(L,w),c.get(L)},S=w=>{for(let N of[...w.children])!N.isMesh&&N.children.length&&S(N);let L=new Map;for(let N of w.children){if(!N.isMesh||N.isInstancedMesh||N.isSkinnedMesh||Array.isArray(N.material)||N.children.length||!N.visible||Object.keys(N.geometry.morphAttributes).length)continue;N.material=v(N.material);let X=N.geometry,H=g(N.material)+"|"+Object.keys(X.attributes).sort().join()+"|"+!!X.index+"|"+N.castShadow+N.receiveShadow+"|"+N.renderOrder;L.has(H)||L.set(H,[]),L.get(H).push(N)}for(let N of L.values()){if(N.length<2)continue;let X=so(N.map(U=>(U.matrixAutoUpdate&&U.updateMatrix(),U.geometry.clone().applyMatrix4(U.matrix))));if(!X)continue;let H=new Qe(X,N[0].material);H.castShadow=N[0].castShadow,H.receiveShadow=N[0].receiveShadow,H.renderOrder=N[0].renderOrder;for(let U of N)w.remove(U);w.add(H)}};for(let w of $t.children)w.isGroup&&S(w)}for(let c of ln)hn.push(c);let au=[];if(p.capabilities.isWebGL2||p.extensions.has("OES_element_index_uint")){let c=[Fn,...$t.children.filter(g=>g.isMesh&&!g.isInstancedMesh&&!g.material.transparent&&!g.children.length&&g.geometry.attributes.position.count>3e3)];for(let g of c){let v=qg(g);v&&au.push(v)}}Tt.traverse(c=>{c.isMesh&&(c.updateMatrix(),c.matrixAutoUpdate=!1)});let sr=t.places.map(c=>({...c})),Kd=new Map(sr.map(c=>[c.n,c])),yx=new Map(sr.map(c=>[c.placeId,c])),lu=c=>c.quality?.startsWith("legacy")||["overture","unverified_listing","derived_area","owner_reported"].includes(c.quality),$i=null,kl="all",Ho="",_x=0,Hl=0,Qd=null,vx={temple:"\u5BFA",hotel:"\u5BBF",transport:"\u884C",nature:"\u5C71",sight:"\u666F",village:"\u6751",service:"\u516C"},Mx={temple:["temple"],sight:["sight","nature","village"],service:["service","transport"]},tp=Qp(sr),yr=sr.find(c=>c.featured),bx=c=>c.quality==="owner_reported"?im:c.featured?"\u4E1A\u4E3B\u63D0\u4F9B\u5B9E\u62CD \xB7 \u4F4D\u7F6E\u6309\u95E8\u724C\u4F30\u8BA1":c.qualityLabel||{converted_listing:"\u643A\u7A0B\u516C\u5F00\u5750\u6807 \xB7 \u5DF2\u6362\u7B97",mapped:"OpenStreetMap \u5730\u56FE\u8BB0\u5F55",multi_source:"\u591A\u4E2A\u5E73\u53F0\u5750\u6807\u76F8\u4E92\u5370\u8BC1",platform_listing:"\u516C\u5F00\u5E73\u53F0\u5750\u6807 \xB7 \u5355\u4E00\u6765\u6E90",unverified_listing:"\u5355\u4E00\u5E73\u53F0\u6536\u5F55 \xB7 \u4F4D\u7F6E\u4E0E\u8425\u4E1A\u72B6\u6001\u5F85\u6838",derived_area:"\u7531\u95E8\u724C\u5730\u5740\u8303\u56F4\u63A8\u7B97",overture:"\u516C\u5F00\u5730\u56FE\u8BB0\u5F55 \xB7 \u5F85\u590D\u6838",legacy_osm:"\u65E7\u7248\u5730\u56FE\u70B9 \xB7 \u5F85\u590D\u6838",user_confirmed:"\u7528\u6237\u5B9E\u5730\u786E\u8BA4"}[c.quality]||"\u65E7\u7248\u4F30\u8BA1\u4F4D\u7F6E \xB7 \u5F85\u6838",Vl=new Map;for(let c of t.buildings){let g=Math.floor(c.center[0]/60)+","+Math.floor(c.center[1]/60);Vl.has(g)||Vl.set(g,[]),Vl.get(g).push(c)}function Sx(c,g=20){let v=null,S=g,w=Math.floor(c.x/60),L=Math.floor(c.z/60);for(let N=-1;N<=1;N++)for(let X=-1;X<=1;X++)for(let H of Vl.get(w+N+","+(L+X))||[]){let U=Math.hypot(c.x-H.center[0],c.z-H.center[1]);U<S&&(v=H,S=U)}return v}let ep=new Map(t.buildings.map(c=>[c.id,c])),Ex='<svg viewBox="0 0 24 24"><path d="M4 11.2 12 4.5l8 6.7V19a1 1 0 0 1-1 1h-4.6v-5.2H9.6V20H5a1 1 0 0 1-1-1z"/></svg>',wx={featured:[14.85,9.5,48,39],area:[16.5,11.5,4,15],major:[14.04,8.8,34,34],small:[10.71,6.6,24,27],road:[10.2,6.2,18,20],plain:[12.24,7.5,29,31]};function Tx(c,g){let[v,S,w,L]=wx[["featured","area","major","small","road"].find(X=>c.includes(X))||"plain"],N=w;for(let X of g)N+=X.codePointAt(0)>=11904?v:S;return[Math.ceil(N),L]}function cu(c,g,v,S){let w=Te("div","maplabel pin "+g);c.placeId&&(w.dataset.placeId=c.placeId),c.stem=g.includes("featured")?9:g.includes("area")||g.includes("road")?0:7;let L=Te("button","");if(L.type="button",L.tabIndex=-1,c.featured){let X=Te("span","lb-icon");X.innerHTML=Ex,L.append(X)}L.append(v),S&&(L.onclick=S),w.append(L,Te("i"));let N=new No(w);return N.center.set(.5,1),c.label=N,c.el=w,[c.labelWidth,c.labelHeight]=Tx(g,v),N}for(let c of sr){if(!Number.isFinite(c.x)||!Number.isFinite(c.z)||!(c.searchable||c.featured))continue;let g=(c.featured?"featured ":"")+"c-"+c.category+(c.p===1&&!c.featured?" major":"")+(lu(c)?" estimated":"")+(c.category==="village"?" area":""),v=cu(c,g,c.displayName||c.shortName||c.n,()=>Yo(c,!1));c.tier=c.featured||c.p===1?2:c.category==="temple"&&c.story?1:0;let S=c.n==="\u767E\u5C81\u5BAB"?t.buildings.find(L=>L.osmId===541482372):pn[c.n]?t.buildings.find(L=>L.osmId===pn[c.n]):null,w=S||c.buildingId&&ep.get(c.buildingId)||Sx(c,c.featured?12:35);c.top=Hs.get(c.n)??(Dr.has(S?.osmId)?S.base+4.4:c.category==="village"?_(c.x,c.z)+40:w?w.base+w.wallHeight+w.roofRise:_(c.x,c.z)+(c.category==="temple"?22:c.featured?9:11)),v.position.set(S?S.center[0]:c.x,c.top+5,S?S.center[1]:c.z),c.nearest=w,c.limit=c.featured||c.p===1?1/0:c.category==="village"?2600:c.category==="temple"||c.p<=2?3600:1900}let Gl=[];for(let c of sr)for(let g of c.halls||[]){let v={n:g.n,x:g.x,z:g.z,p:5,parent:c,limit:300,hall:!0};cu(v,"small hall",g.n,()=>Yo(c,!1)),v.top=_(g.x,g.z)+9,v.label.position.set(g.x,v.top+4,g.z),Gl.push(v)}{let c=new Map;for(let g of t.roads){if(!g.name||g.pts.length<2)continue;let v=0;for(let S=1;S<g.pts.length;S++)v+=Math.hypot(g.pts[S][0]-g.pts[S-1][0],g.pts[S][1]-g.pts[S-1][1]);(!c.has(g.name)||c.get(g.name).len<v)&&c.set(g.name,{r:g,len:v})}for(let[g,{r:v}]of c){let S=v.pts[Math.floor(v.pts.length/2)],w={n:g,x:S[0],z:S[1],p:4,limit:2200,road:!0};cu(w,"road",g.replace(/\s*\(.*\)$/,""),null),w.top=_(S[0],S[1]),w.label.position.set(S[0],w.top+3,S[1]),Gl.push(w)}}let Ax=sr.concat(Gl).filter(c=>c.label);function rr(c,g,v=900,S=145,w=57){let L=new W(c,_(c,g)*Tt.scale.y,g),N=S*Math.PI/180,X=w*Math.PI/180;return{target:L,pos:L.clone().add(new W(-Math.sin(N)*v*Math.sin(X),v*Math.cos(X),Math.cos(N)*v*Math.sin(X)))}}let ri=null,Vo=!1,np=[],vi=yg(Bt,ge,{reducedMotion:Il}),ip=_g(Bt,ge,{width:e,depth:n,cellSize:Math.min(e,n)/(s-1),heightAt:(c,g)=>_(c,g)*Tt.scale.y,isCut:as,automatic:()=>vi.active||!!ri?.previewing}),Go=Te("div","my-location");Go.append(Te("span","","\u6211\u7684\u4F4D\u7F6E"),Te("i"));let Nr=new No(Go);Nr.center.set(.5,1),Nr.renderOrder=10,Nr.visible=!1,qt.add(Nr);let Wo=Xt("#locate"),Rx=Xt("#location-status"),hu=null,Wl=!1,or=null,sp="",uu=new Set,fu={off:"\u5B9A\u4F4D\u5DF2\u5173\u95ED",waiting:"\u6B63\u5728\u83B7\u53D6\u4F4D\u7F6E\uFF0C\u70B9\u51FB\u5B9A\u4F4D\u6309\u94AE\u53EF\u5173\u95ED",inside:"\u5B9A\u4F4D\u5DF2\u5F00\u542F",outside:"\u60A8\u5DF2\u8D85\u51FA\u5730\u56FE\u8986\u76D6\u8303\u56F4\uFF0C\u8FD4\u56DE\u8303\u56F4\u540E\u4F1A\u81EA\u52A8\u663E\u793A",inaccurate:"\u5B9A\u4F4D\u7CBE\u5EA6\u4E0D\u8DB3\uFF0C\u8BF7\u79FB\u81F3\u5F00\u9614\u5904",approximate:"\u4F4D\u7F6E\u7CBE\u5EA6\u8F83\u4F4E\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u201C\u7CBE\u786E\u4F4D\u7F6E\u201D\u8BBE\u7F6E\u6216\u79FB\u81F3\u5F00\u9614\u5904",stale:"\u6682\u672A\u6536\u5230\u65B0\u4F4D\u7F6E\uFF0C\u6B63\u5728\u7B49\u5F85\u66F4\u65B0",timeout:"\u5B9A\u4F4D\u6682\u65F6\u8D85\u65F6\uFF0C\u6B63\u5728\u5C1D\u8BD5\u66F4\u65B0\uFF1B\u53EF\u68C0\u67E5\u7CFB\u7EDF\u5B9A\u4F4D\u670D\u52A1",unavailable:"\u6682\u65F6\u65E0\u6CD5\u5B9A\u4F4D\uFF0C\u8BF7\u68C0\u67E5\u7CFB\u7EDF\u5B9A\u4F4D\u670D\u52A1\uFF1B\u5FAE\u4FE1\u4E2D\u53EF\u5C1D\u8BD5\u5728\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6253\u5F00",denied:"\u672A\u83B7\u5F97\u5B9A\u4F4D\u6743\u9650\uFF0C\u8BF7\u5728\u7CFB\u7EDF\u548C\u6D4F\u89C8\u5668\u8BBE\u7F6E\u4E2D\u5141\u8BB8\u5B9A\u4F4D\u540E\u91CD\u8BD5",insecure:"\u5B9A\u4F4D\u9700\u8981 HTTPS\uFF0C\u8BF7\u6253\u5F00\u7EBF\u4E0A\u5B89\u5168\u7F51\u5740",unsupported:"\u5F53\u524D\u6D4F\u89C8\u5668\u4E0D\u652F\u6301\u5B9A\u4F4D\uFF0C\u8BF7\u5C1D\u8BD5\u7CFB\u7EDF\u6D4F\u89C8\u5668",paused:"\u5B9A\u4F4D\u5DF2\u6682\u505C\uFF0C\u8FD4\u56DE\u9875\u9762\u540E\u7EE7\u7EED"},du=ex({geo:t.geo,terrain:i,onChange:({state:c,point:g,enabled:v,changed:S,fresh:w})=>{hu=g,Nr.visible=!!g,Wl=!0,Go.classList.toggle("is-stale",!!g&&!w),Go.firstChild.textContent=w?"\u6211\u7684\u4F4D\u7F6E":"\u4E0A\u6B21\u4F4D\u7F6E",Wo.setAttribute("aria-pressed",String(v)),Wo.setAttribute("aria-label",v?"\u5173\u95ED\u6211\u7684\u4F4D\u7F6E":"\u663E\u793A\u6211\u7684\u4F4D\u7F6E"),Wo.setAttribute("aria-busy",String(c==="waiting")),Wo.dataset.state=c;let L=[c,v,!!g,w].join(":");if(L!==sp){let N=g?Math.ceil(g.accuracy/10)*10:0;Rx.textContent=g?w?`\u6211\u7684\u4F4D\u7F6E \xB7 \u7CBE\u5EA6\u7EA6 ${N} \u7C73\uFF08\u4EC5\u4F9B\u53C2\u8003\uFF09`:`${fu[c]}\uFF1B\u663E\u793A\u4E0A\u6B21\u4F4D\u7F6E\uFF0C\u975E\u5B9E\u65F6\u5B9A\u4F4D`:fu[c],sp=L}if((!v||["paused","outside","stale"].includes(c))&&(or=null),S&&!["inside","paused","waiting","off"].includes(c)&&!uu.has(c)&&(uu.add(c),Pl(fu[c])),g&&w&&or!==null){let N=performance.now()-or<2e4&&!ri?.previewing&&!vi.active;or=null,N&&Vs(rr(g.x,g.z,650),1e3)}}});Wo.onclick=()=>{du.enabled?du.stop():(uu.clear(),or=performance.now(),du.start())},ge.addEventListener("gesturestart",()=>{or=null});function Cx(){if(hu){let{x:c,z:g}=hu;Nr.position.set(c,_(c,g)*Tt.scale.y+8,g),Nr.updateMatrixWorld(!0)}}function Vs(c,g=1200,v=null,S=0){or=null,ri?.stopPreview(),vi.move(c,g,v,S),Vo&&Zi()}let rp=c=>si(900+Bt.position.distanceTo(c.pos)*.35,1100,2400),Ts=null;function op(){let c=vi.destination;Ts??={pos:(c?c.pos:Bt.position).clone(),target:(c?c.target:ge.target).clone(),view:Xt(".viewbar button.active")?.dataset.view}}function Px(){let c=Ts;Ts=null,c&&(Vs(c,Math.round(rp(c)*1.2)),Yi("[data-view]").forEach(g=>g.classList.toggle("active",g.dataset.view===c.view)),Xl())}let pu=()=>{let c=ge.target.clone().sub(Bt.position);return Math.atan2(c.x,-c.z)*180/Math.PI};function mu(c=kn?220:160){return rr(yr.x,yr.z,c,15,57)}function ap(c){return c.model?.kind==="entrance-checkpoint"&&y?rr(c.x,c.z,kn?150:110,y.viewAzimuth,59):rr(c.x,c.z,c.category==="temple"?400:300,pu(),57)}function lp(c,g,v,S){let w=c.getBoundingClientRect(),L=g.getBoundingClientRect(),N=w.width/c.offsetWidth||1;c.style.setProperty(v,((L.left-w.left)/N-c.clientLeft).toFixed(2)+"px"),c.style.setProperty(S,(L.width/N).toFixed(2)+"px")}function Xl(){let c=Xt(".viewbar"),g=c.querySelector("button.active");if(!g){c.style.setProperty("--ind-o",0);return}lp(c,g,"--ind-x","--ind-w"),c.style.setProperty("--ind-o",1)}function gu(){Yi("[data-view]").forEach(c=>c.classList.remove("active")),Xl()}let xu=()=>rr(-1390,50,kn?1550:1370,38,53);function ql(c){let g=vi.destination?.orbit?vi.destination:null;return ge.dispatchEvent({type:"gesturestart"}),ip.pose({...c,base:g})}function yu(c){Ts=null,Vs({town:xu,all:()=>rr(-150,200,7800,110,51),top:()=>ql({heading:0,polar:Math.PI/180}),baisui:()=>{let v=t.buildings.find(S=>S.osmId===541482372);return rr(...v.center,260,60,63)},juzhilin:()=>mu(),tiantai:()=>rr(773,1635,520,130,64)}[c]()),Yi("[data-view]").forEach(v=>v.classList.toggle("active",v.dataset.view===c)),Xl()}Yi("[data-view]").forEach(c=>c.onclick=()=>yu(c.dataset.view)),ge.addEventListener("gesturestart",()=>{let c=!!vi.destination?.onDone;vi.cancel(),gu(),c&&!Xt("#card").classList.contains("show")&&(za++,Yl(),Ts=null),Zi()}),ge.addEventListener("gesturestart",()=>ip.constrain()),Vs(xu(),0),Xt("#north").onclick=()=>Vs(ql({heading:0}),650),Xt("#zoom-in").onclick=()=>Vs(ql({scale:.65}),450),Xt("#zoom-out").onclick=()=>Vs(ql({scale:1/.65}),450);function _u(c){let g=Te("div","links");for(let v of c.sources||[]){if(!/^https:\/\//.test(v.url))continue;let S=Te("a","",v.name);S.href=v.url,S.target="_blank",S.rel="noopener",g.append(S)}return g}function Yl(){$i?.el&&$i.el.classList.remove("selected"),$i=null;for(let c of Yi(".place-item.selected"))c.classList.remove("selected")}let za=0,vu=c=>!!c?.isConnected&&!c.disabled&&!c.closest("[inert]")&&c.getClientRects().length>0&&getComputedStyle(c).visibility!=="hidden",Xo=()=>{let c=document.activeElement;return!c||c===document.body||!vu(c)};function $l(c){if(!c)return;let g=()=>{vu(c)&&document.activeElement!==c&&c.focus({preventScroll:!0})};g(),document.activeElement!==c&&requestAnimationFrame(g)}function ka(...c){for(let g of c)if(vu(g))return g.focus({preventScroll:!0}),!0;return!1}let Ha=null,Zl=null,Mu=null;function cp(){let c=Xt("#card"),g=document.activeElement;c.classList.contains("show")||c.contains(g)||(Ha=g&&g!==document.body?g:null,Zl=g?.matches?.(".place-item")?g.dataset.name:null)}function qo(c=!0){let g=Xt("#card"),v=g.classList.contains("show"),S=g.contains(document.activeElement);if(za++,vi.cancel(),Yl(),Bo(g),Zi(),c?Px():Ts=null,v&&(S||Xo())){let w=Zl&&[...Yi("#place-list .place-item")].find(L=>L.dataset.name===Zl);ka(Ha,w,!kn&&!Xt("#panel").classList.contains("closed")?Xt('.panel-tabs [aria-selected="true"]'):null,Xt("#panel-open"))}Ha=Zl=null}function Va(c){let g=Xt("#settings"),v=!c&&g.querySelector(".settings-wrap").contains(document.activeElement);g.classList.toggle("collapsed",!c),Xt("#settings-toggle").setAttribute("aria-expanded",c),Vo&&Zi(),v&&$l(Xt("#settings-toggle"))}function bu(){let c=Xt("#data-dialog");c.open&&(c.classList.add("closing"),setTimeout(()=>{c.classList.remove("closing"),c.close(),Zi()},190))}function Ga(c){kn&&(c!=="directory"&&(Xt("#panel").classList.add("closed"),Xt("#search").blur(),Zi()),c!=="detail"&&qo(!1),c!=="settings"&&Va(!1),c!=="data"&&bu())}let Lx='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';function hp(c,g,{cat:v="",sub:S="",hero:w=null,featured:L=!1}={}){Ga("detail");let N=Xt("#card"),X=N.classList.contains("show");N.replaceChildren(),N.classList.toggle("featured",L);let H=Te("div","card-head"),U=Te("div","card-content"+(X?" swap":"")),K=Te("button","close icon-btn");K.innerHTML=Lx,K.setAttribute("aria-label","\u5173\u95ED\u5730\u70B9\u8BE6\u60C5"),K.onclick=()=>qo();let q=Te("h2","",c);q.tabIndex=-1,H.append(Te("span","tag"+(v?" c-"+v:""),g),q),S&&H.append(Te("p","sub",S)),U.tabIndex=0,U.setAttribute("role","region"),U.setAttribute("aria-label","\u5730\u70B9\u8BE6\u7EC6\u5185\u5BB9");let k=document.activeElement,J=k===Ha||N.contains(k),j=Te("div","sheet-grip");return j.setAttribute("aria-hidden","true"),w&&N.append(w),N.append(K,H,U,j),X||Na(N),Zi(),requestAnimationFrame(Zi),(J||Xo())&&$l(q),U}let{open:up,close:Ix}=Zg({reducedMotion:Il,onToggle:()=>Zi(),focusLost:Xo,restoreFocus:ka,fallbackFocus:()=>Xt("#card .card-head h2")}),fp={temple:"\u5BFA\u9662",sight:"\u666F\u70B9",nature:"\u5C71\u6C34\u666F\u89C2",village:"\u6751\u843D\u5730\u540D",service:"\u516C\u5171\u670D\u52A1",transport:"\u4EA4\u901A",hotel:"\u4F4F\u5BBF"},Dx="17356648281",dp="173 5664 8281";function pp(c){let g=Te("details","more");return g.append(Te("summary","",c)),g}function Ux(c,g,v){let S=Te("button","btn "+c);return S.type="button",S.innerHTML=g,S.append(v),S}let Nx='<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/></svg>',Ox='<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></svg>',Fx='<svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></svg>';function mp(c){let g=t.routes?.find(H=>H.id==="juzhilin-halfday"),v=ri?.canResume?ri.active:null,S=c.querySelector(".route-teaser"),w=v?"resume:"+v.id:g?"start":"";if((S?.dataset.kind||"")===w)return;if(!w){S?.remove();return}let L=Te("button","route-teaser"),N=Te("span","");L.type="button",L.dataset.kind=w,L.innerHTML=Nx,v?(N.append(Te("b","","\u7EE7\u7EED\u8DEF\u7EBF\u9884\u6F14"),Te("small","",v.short+" \xB7 \u4ECE\u521A\u624D\u6682\u505C\u7684\u4F4D\u7F6E\u7EE7\u7EED")),L.onclick=()=>ri.canResume&&ri.active===v?ri.startPreview():ri.open(v.id)):(N.append(Te("b","","\u4ECE\u8FD9\u91CC\u51FA\u53D1 \xB7 "+g.short),Te("small","",`${g.duration} \xB7 \u8089\u8EAB\u5B9D\u6BBF \u2192 \u5316\u57CE\u5BFA \u2192 \u7F06\u8F66\u4E0A\u767E\u5C81\u5BAB \xB7 \u770B\u8DEF\u7EBF`)),L.onclick=()=>ri?.open(g.id)),L.append(N);let X=c.querySelector(".card-summary");if(S){let H=document.activeElement===S;S.replaceWith(L),H&&L.focus({preventScroll:!0})}else X?X.after(L):c.append(L)}function Bx(){let c=Xt("#card");c.classList.contains("show")&&c.classList.contains("featured")&&mp(c.querySelector(".card-content"))}function Yo(c,g){cp(),Yl(),$i=c,c.el&&c.el.classList.add("selected");let v=++za,S=()=>{let N=null;if(c.featured){N=Te("div","card-hero");let k=[["jzl-1",640],["jzl-2",541],["jzl-5",720],["jzl-6",540],["jzl-3",540],["jzl-4",640]],J=k.map(([j])=>{let at=`media/juzhilin/${j}.jpg`;return window.__JIUHUA_MEDIA__?.[at]||at});for(let[j,at]of J.entries()){let pt=Te("a");pt.href=at,pt.target="_blank",pt.rel="noopener",pt.onclick=dt=>{dt.preventDefault(),up(J,j,void 0,void 0,pt)};let Ut=Te("img");Ut.width=960,Ut.height=k[j][1],Ut.src=at,Ut.alt="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",Ut.loading="lazy",pt.append(Ut),N.append(pt)}}let X=[...c.photos||[],...c.viewing?.photos||[]];if(X.length){N=Te("div","card-hero");let k=X,J=k.map(j=>window.__JIUHUA_MEDIA__?.[j.src]||j.src);for(let[j,at]of k.entries()){let pt=Te("a");pt.href=J[j],pt.setAttribute("aria-label",at.alt+"\uFF0C\u70B9\u5F00\u653E\u5927"),pt.onclick=Gt=>{Gt.preventDefault(),up(J,j,c.n,k,pt)};let Ut=Te("img"),dt=window.__JIUHUA_MEDIA__,Vt=at.thumb&&(dt?dt[at.thumb]:at.thumb);Ut.src=Vt||J[j],Ut.width=at.width,Ut.height=at.height,Ut.alt=at.alt,Ut.loading="lazy",pt.append(Ut),at.takenAt&&pt.append(Te("span","photo-date",at.takenAt.slice(0,4)+"\u5E74\u5B9E\u62CD \xB7 \u70B9\u5F00\u653E\u5927")),N.append(pt)}}let H=hp(c.displayName||(c.featured?c.shortName:c.n),c.featured?"\u7CBE\u9009\u6C11\u5BBF \xB7 \u5B9E\u62CD\u5EFA\u6A21":fp[c.category]||"\u5730\u70B9",{cat:c.category,hero:N,featured:!!c.featured}),U=Te("div","chips");(c.address||c.zone)&&U.append(Te("span","",c.address||c.zone)),c.featured&&U.append(Te("span","","\u4E1A\u4E3B\u5B9E\u62CD \xB7 \u4E09\u7EF4\u5EFA\u6A21")),U.append(Te("span","",`\u6D77\u62D4\u7EA6 ${Math.round(f(_(c.x,c.z)))} m`)),c.halls?.length&&U.append(Te("span","",`\u6BBF\u5802 ${c.halls.length} \u5904`)),c.transit?.length&&U.append(Te("span","","\u666F\u533A\u4EA4\u901A\u7AD9\u70B9"));let K=Te("div","card-summary");if(K.append(U),H.append(K),c.featured&&mp(H),c.featured&&H.append(Te("p","lead","\u4E09\u5C42\u9000\u53F0\u7684\u5C71\u5730\u6C11\u5BBF\uFF1A\u5C4B\u9876\u9732\u53F0\u8FDC\u773A\u4E5D\u534E\u8BF8\u5CF0\uFF0C\u4E8C\u5C42\u6728\u5E73\u53F0\u4E0E\u7F57\u6C49\u677E\u5C0F\u9662\uFF0C\u95E8\u524D\u505C\u8F66\u573A\u5E26\u5145\u7535\u6869\uFF0C\u6321\u5899\u4E0A\u65B9\u662F\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u3002")),c.highlight){let k=Te("p","highlight");k.append(Te("b","","\u770B\u70B9"),c.highlight),H.append(k)}if(c.note&&H.append(Te("p","lead",c.note)),c.story?.length){let k=Te("div","story-box");k.append(Te("h4","",c.story.some(J=>J.kind==="\u5730\u8C8C")?"\u5730\u8C8C\u770B\u70B9":"\u6587\u5316\u770B\u70B9"));for(let J of c.story){let j=Te("p","story");j.append(Ld(J.kind),J.text),k.append(j)}H.append(k)}else c.architecture&&H.append(Te("p","",c.architecture));if(c.transit?.length){let k=Te("div","transit");for(let J of c.transit)k.append(Te("p","",`${J.route}${J.stop&&J.route!==J.stop?`\uFF08${J.stop}\u7AD9\uFF09`:""}\uFF1A${J.hours}`)),J.order&&k.append(Te("small","",J.order)),J.phone&&k.append(Te("small","",`\u54A8\u8BE2 ${J.phone}`));k.append(Te("small","",`\u65F6\u95F4\u4EE5\u73B0\u573A\u4E3A\u51C6 \xB7 \u4E5D\u534E\u5C71\u98CE\u666F\u533A\u5B98\u7F51 ${t.transit?.retrieved||""} \u67E5\u8BE2`)),H.append(k)}let q=pp(c.featured?"\u5EFA\u6A21\u8BF4\u660E":c.photos?.length?"\u8D44\u6599\u4E0E\u7167\u7247\u51FA\u5904":"\u8D44\u6599\u4E0E\u4F9D\u636E");if(c.storySources?.length){let k=_u({sources:c.storySources});k.prepend(Te("span","","\u6587\u5B57\u51FA\u5904")),q.append(k)}if(c.halls?.length&&q.append(Te("p","",`\u5BFA\u5185\u6BBF\u5802 ${c.halls.length} \u5904\uFF1A${c.halls.slice(0,8).map(k=>k.n).join("\u3001")}${c.halls.length>8?"\u7B49":""}\uFF1B\u9760\u8FD1\u65F6\u663E\u793A\u4E3A\u5C0F\u6807\u6CE8\u3002`)),c.photos?.length){let k=Te("div","photo-credits");k.append(Te("h4","",`\u5B9E\u62CD\u7167\u7247 \xB7 ${c.photos.length} \u5F20`));for(let J of c.photos)k.append(Te("p","",J.alt),Id(J));q.append(k)}for(let k of[`\u5B9A\u4F4D\uFF1A${bx(c)}`,c.story?.length&&c.architecture,c.modelNote,c.positionNote,c.viewing?.source,c.aliases?.length&&!c.featured&&"\u5176\u4ED6\u540D\u79F0\uFF1A"+c.aliases.slice(0,4).join("\u3001"),c.category==="village"&&c.addressCount&&`\u7EA6 ${c.addressCount} \u4E2A\u516C\u5F00\u5730\u5740\u542B\u6B64\u5730\u540D\u3002`,c.quality?.startsWith("legacy")&&"\u6B64\u70B9\u6CBF\u7528\u539F\u7248\u5BFC\u89C8\u4F4D\u7F6E\uFF0C\u5C1A\u672A\u83B7\u5F97\u72EC\u7ACB\u5750\u6807\u8BC1\u636E\uFF1B\u865A\u7EBF\u6807\u6CE8\u8868\u793A\u5F85\u6838\u3002"])k&&q.append(Te("p","",k));if(q.append(Te("p","coords",`${c.lon?.toFixed(6)??""}\xB0E \xB7 ${c.lat?.toFixed(6)??""}\xB0N`),_u(c)),H.append(q),c.featured){let k=Te("div","card-actions"),J=Te("a","btn accent");J.href="tel:"+Dx,J.innerHTML=Fx,J.append(Te("span","full","\u81F4\u7535 "+dp),Te("span","short","\u81F4\u7535\u6C11\u5BBF")),J.setAttribute("aria-label","\u81F4\u7535\u5C45\u4E4B\u6797\u6C11\u5BBF "+dp),k.append(J),K.append(k)}};if(kn&&(Xt("#panel").classList.add("closed"),Zi()),Yi(".place-item").forEach(N=>N.classList.toggle("selected",N.dataset.name===c.n)),!g){ri?.stopPreview(),vi.cancel(),S();return}let w=Xt("#card");w.classList.contains("show")&&Bo(w,440),op(),gu();let L=c.featured?mu():ap(c);Xt("#flight-hint .fh-name").textContent=c.displayName||(c.featured?c.shortName:c.n),Vs(L,rp(L),()=>{if(v!==za||$i!==c){Zi();return}w.classList.add("arrive"),S(),clearTimeout(w._arrive),w._arrive=setTimeout(()=>w.classList.remove("arrive"),1600)},150)}function zx(c){let g=om(c,Kd);if(g){Yo(g,!1);return}cp(),ri?.stopPreview(),vi.cancel(),za++,Yl();let v=c.positionQuality==="ml_roofprint",S=hp(c.name||c.precinct||c.templeGuess||"\u5BFA\u9662\u5EFA\u7B51","\u5BFA\u9662\u5EFA\u7B51",{cat:"temple",sub:c.precinct?`${c.precinct} \u5BFA\u9662\u8303\u56F4\u5185`:""}),w=Te("div","chips");w.append(Te("span","",`\u5360\u5730\u7EA6 ${Math.round(c.area)} m\xB2`),Te("span","",`${c.levels||"-"} \u5C42`),Te("span","",`\u5899\u9AD8 ${c.wallHeight.toFixed(1)} m`)),S.append(w);let L=pp("\u5916\u89C2\u4E0E\u6570\u636E\u4F9D\u636E");L.append(Te("p","",v?"\u5E73\u9762\u8F6E\u5ED3\u6765\u81EA\u5F71\u50CF\u8BC6\u522B\uFF0C\u53EF\u80FD\u5305\u542B\u8BC6\u522B\u8BEF\u5DEE\u3002":"\u5E73\u9762\u5F62\u72B6\u4E0E\u671D\u5411\u6765\u81EA\u5730\u56FE\u8BB0\u5F55\u3002")),c.styleRule&&L.append(Te("p","",`\u5916\u89C2\u4F9D\u636E\uFF08${{observed:"\u7167\u7247\u89C2\u5BDF",documented:"\u6587\u732E\u8BB0\u8F7D",inferred:"\u63A8\u65AD",secondary:"\u4E8C\u624B\u8D44\u6599"}[c.styleCertainty]||c.styleCertainty||"\u63A8\u65AD"}\uFF09\uFF1A${c.styleRule}\u3002\u9010\u680B\u697C\u5C42\u4E0E\u95E8\u7A97\u672A\u7ECF\u5B9E\u6D4B\u3002`)),L.append(_u({sources:[{name:"\u67E5\u770B\u5EFA\u7B51\u6570\u636E\u6765\u6E90",url:c.source}]})),S.append(L);let N=Te("div","card-actions"),X=Ux("ghost",Ox,"\u73AF\u770B\u8FD9\u680B\u5EFA\u7B51");X.onclick=()=>{op(),Vs(rr(...c.center,Math.max(70,c.width*3),pu()+70,66)),gu()},N.append(X),S.append(N)}let gp=new Ph,xp=new fe;function kx(c){if(vi.active||!$t.visible)return;xp.set(c.clientX/innerWidth*2-1,-c.clientY/innerHeight*2+1),gp.setFromCamera(xp,Bt);let g=gp.intersectObjects(hn,!0)[0],v=g&&rm(g.object,yx,Kd);if(v){Yo(v,!1);return}let S=g&&am(g.object,g.faceIndex,t.buildings,ep);S?.style==="temple"?zx(S):kn&&qo()}let yp=c=>kl==="all"||(Mx[kl]||[kl]).includes(c.category);function Hx(c,g=Ho){return yp(c)&&tp.score(c,g)>=0}function Jl(c){let g=Xt("#place-list");g.classList.toggle("animate",!!c),g.replaceChildren();let v=tp.search(Ho,{accept:w=>yp(w)&&(Gr(Ho)?!0:w.searchable||w===yr)});Xt("#list-summary").textContent=`${v.length} \u4E2A\u7ED3\u679C \xB7 \u53EF\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u516C\u5171\u8BBE\u65BD\u4E0E\u5C45\u4E4B\u6797`;let S=v.slice(0,Ho?400:220);S.forEach((w,L)=>{let N=Te("button","place-item"+(w===yr?" featured":"")+(w===$i?" selected":""));c&&(N.style.animationDelay=Math.min(L,14)*16+"ms"),N.dataset.name=w.n,N.dataset.placeId=w.placeId,N.type="button",N.append(Te("span","pi-icon c-"+w.category,w===yr?"\u5BBF":vx[w.category]||"\xB7"));let X=Te("span","pi-text");X.append(Te("strong","",w.displayName||(w===yr?w.shortName:w.n)),Te("small",lu(w)?"estimate":"",w===yr?`\u7CBE\u9009\u6C11\u5BBF \xB7 ${w.address}`:[fp[w.category],w.highlight||(w.viewing?`\u53EF\u8FDC\u773A${w.viewing.name}`:w.zone)].filter(Boolean).join(" \xB7 ")+(lu(w)?" \xB7 \u4F4D\u7F6E\u5F85\u6838":""))),N.append(X),N.onclick=()=>Yo(w,!0),g.append(N)}),v.length>S.length&&g.append(Te("p","empty",`\u53E6\u6709 ${v.length-S.length} \u4E2A\u70B9\u4F4D\u672A\u5217\u51FA\uFF0C\u8BF7\u8F93\u5165\u540D\u79F0\u3001\u95E8\u724C\u6216\u6751\u540D\u7F29\u5C0F\u8303\u56F4\u3002`)),v.length||g.append(Te("p","empty","\u6CA1\u6709\u5339\u914D\u7684\u5730\u70B9\u3002\u53EF\u4EE5\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u6751\u540D\u6216\u8F66\u7AD9\u3001\u516C\u5395\u3001\u505C\u8F66\u573A\uFF0C\u4F8B\u5982\u201C\u5316\u57CE\u5BFA\u201D\u201C\u51E4\u51F0\u677E\u201D\u201C\u8F66\u7AD9\u201D\u3002"))}let Vx=tm(Xt("#search"),c=>{Ho=c,st=!0,Jl()}),Gx=()=>Vx.flush();Yi("[data-category]").forEach(c=>c.onclick=()=>{Gx(),kl=c.dataset.category,Yi("[data-category]").forEach(g=>g.classList.toggle("active",g===c)),Jl(!0)}),Jl();function _p(){lp(Xt(".panel-tabs"),Xt(".panel-tabs .active"),"--tab-x","--tab-w")}function jl(c){let g=Xt(".panel-tabs .active")?.dataset.tab;Yi(".panel-tabs [data-tab]").forEach(v=>{let S=v.dataset.tab===c;v.classList.toggle("active",S),v.setAttribute("aria-selected",S),v.tabIndex=S?0:-1}),Xt("#tab-routes").hidden=c!=="routes",Xt("#tab-places").hidden=c!=="places",Xt("#tab-guide").hidden=c!=="guide",c==="places"&&g!=="places"&&Jl(!0),_p()}function Kl(c){let g=Xt("#panel"),v=document.activeElement;g.classList.contains("closed")&&!g.contains(v)&&(Mu=v!==document.body?v:null),ri?.stopPreview(),!kn&&(Xt("#card").classList.contains("show")||vi.destination?.onDone)&&qo(!1),vi.cancel(),c&&jl(c),Ga("directory"),g.classList.remove("closed"),Wa(),requestAnimationFrame(_p);let S=Xt(".tab-pane:not([hidden])");$l(S?.id==="tab-places"?Xt("#search"):S?.id==="tab-routes"&&!Xt("#route-detail").hidden?Xt("#route-detail"):Xt('.panel-tabs [aria-selected="true"]'))}Yi(".panel-tabs [data-tab]").forEach(c=>c.onclick=()=>jl(c.dataset.tab)),jl("routes"),Vg(t,Xt("#guide")),Xt(".panel-tabs").addEventListener("keydown",c=>{let g=Yi(".panel-tabs [data-tab]"),v=g.indexOf(document.activeElement),S={ArrowLeft:v-1,ArrowRight:v+1,Home:0,End:g.length-1}[c.key];if(v<0||S===void 0)return;c.preventDefault();let w=g[(S+g.length)%g.length];jl(w.dataset.tab),w.focus()});function vp(){let c=Xt("#panel"),g=c.contains(document.activeElement);return c.classList.add("closed"),Xt("#search").blur(),Wa(),g}function Su(c){(c||Xo())&&ka(Mu,Xt("#panel-open"),Xt("#route-hud .rh-list")),Mu=null}Xt("#panel-close").onclick=()=>{let c=ri?.active&&!ri.canResume&&!Xt("#tab-routes").hidden,g=vp();c&&(ri.close(),yu("town")),Su(g)},Xt("#panel-open").onclick=()=>Kl("places"),Xt("#routes-open").onclick=()=>Kl("routes"),Xt("#guide-open").onclick=()=>Kl("guide"),kn&&Xt("#panel").classList.add("closed"),Xt("#settings-toggle").onclick=()=>{let c=Xt("#settings").classList.contains("collapsed");c&&Ga("settings"),Va(c)},Va(!1),Xt("#featured-cta").onclick=()=>Yo(yr,!0);function Wx(){let c=innerWidth,g=innerHeight,v=Xt("#panel"),S=Xt("#card"),w=!v.classList.contains("closed"),L=Xt("#route-hud"),N=Xt(".rail"),X=N.querySelector(".map-actions"),H=document.body.classList.contains("map-chrome-hidden")?0:Xt(".viewbar").getBoundingClientRect().bottom,U=g,K=0,q=c,k=!!X?.offsetWidth&&getComputedStyle(X).visibility!=="hidden";if(kn)w?v.offsetWidth>c*.6?U=v.offsetTop:q=v.offsetLeft:c>g&&k&&(q=N.offsetLeft-8);else{K=Mp(S.classList.contains("show")?S:w?v:null),k&&(q=N.offsetLeft-12);let J=Xt(".map-meta");J.offsetHeight&&(U=Math.min(g,J.offsetTop-8))}return!L.hidden&&L.offsetParent&&(H=Math.max(H,L.getBoundingClientRect().bottom)),{left:K,top:H,right:q,bottom:U,shiftX:Fr.x,shiftY:Fr.y}}let Xx=".brand,.viewbar,.rail>*,.dock,.map-meta>*,#route-hud,#flight-hint,.settings-wrap";function qx(){let c=[];for(let g of Yi(Xx)){if(!g.offsetWidth||g.closest(".is-hidden")||getComputedStyle(g).visibility==="hidden")continue;let v=g.getBoundingClientRect();c.push([v.left,v.top,v.right,v.bottom])}return c}ri=kg({routes:t.routes||[],scene:qt,world:Tt,camera:Bt,controls:ge,hAt:_,realH:f,fly:Vs,pose:rr,openPanel:Kl,isMobile:()=>kn,visibleRect:Wx,covers:qx,onFrame:c=>np.push(c),cancelFlight:()=>{vi.destination?.onDone||vi.cancel()},onPlaybackChange:()=>{or=null,Vo&&Zi(),Bx()},closeSheetsForRoute:()=>{let c=document.activeElement,g=kn&&!Xt("#panel").classList.contains("closed")&&Xt("#panel").contains(c)||Xt("#card").classList.contains("show")&&Xt("#card").contains(c);qo(!1),kn&&Xt("#panel").classList.add("closed"),Wa(),g&&$l(Xt("#route-hud .rh-play"))}}),Xt("#route-hud .rh-close").onclick=()=>{let c=Xt("#route-hud").contains(document.activeElement),g=Xt("#card").classList.contains("show"),v=!!vi.destination?.onDone;ri.close(),g||v?Ts={...xu(),view:"town"}:yu("town"),(c||Xo())&&ka(g?Xt("#card .card-head h2"):null,v?Ha:null,!kn&&!Xt("#panel").classList.contains("closed")?Xt("#route-list .route-card"):null,Xt("#routes-open"),Xt("#panel-open"))},$g({compact:Dd,closePanel:()=>Su(vp())}),addEventListener("sheetchange",()=>Zi()),Xt("#layer-buildings").onchange=c=>$t.visible=c.target.checked,Xt("#layer-trees").onchange=c=>{Zd=c.target.checked,Jd()},Xt("#layer-trails").onchange=c=>Me.visible=c.target.checked,Xt("#height").oninput=c=>{ge.dispatchEvent({type:"gesturestart"});let g=Tt.scale.y;h=+c.target.value;let v=h/l;c.target.style.setProperty("--fill",(h-1)/.8*100+"%"),Tt.scale.y=v,Xt("#height-value").textContent=h===1?"\u771F\u5B9E\u6BD4\u4F8B \xD71.0":`\u5730\u5F62\u589E\u5F3A \xD7${h.toFixed(1)}`;let S=_(ge.target.x,ge.target.z)*(v-g);if(ge.target.y+=S,Bt.position.y+=S,Ts){let w=_(Ts.target.x,Ts.target.z)*(v-g);Ts.target.y+=w,Ts.pos.y+=w}for(let w of sr)w.label&&(w.label.position.y=(w.top+5)*v);for(let w of Gl)w.label.position.y=(w.top+4)*v},Xt("#data-content").innerHTML=Jg({W:e,D:n,stats:t.stats,transit:t.transit,places:sr});let Eu=null;Xt("#credit-data").onclick=Xt("#credit-mobile").onclick=c=>{Eu=c.currentTarget,Ga("data"),Xt("#data-dialog").showModal(),Zi()},Xt("#data-close").onclick=bu,Xt("#data-dialog").onclick=c=>{c.target===Xt("#data-dialog")&&bu()},Xt("#data-dialog").addEventListener("close",()=>{Vo&&(Zi(),Xo()&&ka(Eu,Xt("#credit-mobile"),Xt("#credit-data")),Eu=null)}),Xt("#capture").onclick=()=>{let c=tx({frame:p.domElement,stats:t.stats,render:v=>(Bt.updateMatrixWorld(),Ep(v),Jt(),p.render(qt,Bt),ri?.updateLabels(performance.now()),wp(),st=!0,[...Y.domElement.children])}),g=document.createElement("a");g.download="\u4E5D\u534E\u5C71\u4E09\u7EF4\u5730\u56FE-\u5B9E\u666F\u589E\u5F3A\u7248.png",g.href=c.toDataURL("image/png"),g.click(),Pl("\u5F53\u524D\u4E09\u7EF4\u753B\u9762\u5DF2\u5BFC\u51FA")};let Yx=43,Or={x:0,y:0},Fr={x:0,y:0};function wu(){let c=innerWidth,g=innerHeight,{x:v,y:S}=Or,w=c+2*Math.abs(v),L=g+2*Math.abs(S);Bt.aspect=w/L,Bt.fov=Math.atan(Math.tan(Yx*Math.PI/360)*L/g)*360/Math.PI,w>c+1||L>g+1?Bt.setViewOffset(w,L,v>0?2*v:0,S>0?2*S:0,c,g):Bt.clearViewOffset(),Bt.updateProjectionMatrix()}function Mp(c){return c&&c.offsetWidth?c.offsetLeft+c.offsetWidth+12:0}function Zi(){let c=innerWidth,g=innerHeight,v=Xt("#card"),S=Xt("#panel"),w=document.body,L=!S.classList.contains("closed"),N=v.classList.contains("show"),X=!Xt("#settings").classList.contains("collapsed"),H=!!vi.destination?.onDone,U=0,K=0,q=Xt("#viewer").classList.contains("show"),k=L||N||H||!!ri?.active||Xt("#data-dialog").open||q,J=kn?k||X:!!ri?.active;w.classList.toggle("panel-open",L),w.classList.toggle("card-open",N),w.classList.toggle("settings-open",X),w.classList.toggle("card-flight",H),w.classList.contains("map-chrome-hidden")!==J&&(w.classList.toggle("map-chrome-hidden",J),J&&nx.stop());for(let pt of Yi(".map-chrome")){let Ut=kn?pt.id==="settings"?k:J:J&&pt.matches(".viewbar");if(pt.inert!==(Ut||q)&&(pt.inert=Ut||q),pt.classList.contains("is-hidden")!==Ut){pt.classList.toggle("is-hidden",Ut),pt.setAttribute("aria-hidden",String(Ut)),pt.matches("button")&&(pt.disabled=Ut);for(let dt of pt.querySelectorAll("button"))dt.disabled=Ut}}for(let pt of Xt("#app").children){if(pt.id==="viewer"||pt.matches(".map-chrome,dialog"))continue;let Ut=q||pt.id==="panel"&&!kn&&N;pt.inert!==Ut&&(pt.inert=Ut)}let j=Xt("#flight-hint"),at=!Il&&H&&!!j.querySelector(".fh-name").textContent;if(at&&!j.classList.contains("show")?Na(j):!at&&j.classList.contains("show")&&Bo(j,240),!kn)U=-Mp(N?v:L||H?S:null)/2;else{let pt=N?v:L?S:null;if(pt&&pt.offsetWidth>c*.6){let Ut=Xt(".viewbar"),dt=J?pt===v?8:0:Ut.offsetTop+Ut.offsetHeight;K=Math.max(0,g/2-(dt+pt.offsetTop)/2)}else pt&&(U=Math.max(0,(c-pt.offsetLeft)/2))}Fr={x:U,y:K},Vo||(Or={x:U,y:K},wu())}function Wa(){st=!0,uo(),A.setCeiling(x()),D(M);let c=innerWidth,g=innerHeight,v=Dd(),S=v!==kn;S&&(kn=v,v&&(Xt("#panel").classList.add("closed"),Va(!1)),p.shadowMap.enabled=Re.castShadow=T()),p.setSize(c,g),Y.setSize(c,g);let w=!kn&&!Xt("#panel").classList.contains("closed");document.body.classList.toggle("with-panel",w),Zi(),wu(),Xl(),S&&$i&&Xt("#card").classList.contains("show")&&!vi.active&&Vs($i.featured?mu():ap($i),700)}function $o(){let c=window.visualViewport,g=c?c.height:innerHeight,v=document.activeElement===Xt("#search"),S=kn&&v&&c?Math.max(0,innerHeight-c.height-c.offsetTop):0;document.documentElement.style.setProperty("--visible-height",`${Math.round(g)}px`),document.documentElement.style.setProperty("--keyboard-inset",S>120?`${Math.round(S)}px`:"0px"),document.body.classList.toggle("keyboard-open",S>120)}window.visualViewport?.addEventListener("resize",$o),window.visualViewport?.addEventListener("scroll",$o),addEventListener("focusin",$o),addEventListener("focusout",()=>requestAnimationFrame($o)),addEventListener("resize",$o),$o(),addEventListener("keydown",c=>{let g=Xt("#viewer");if(!g.hidden){c.key==="Escape"?Ix():(c.key==="ArrowLeft"||c.key==="ArrowRight")&&g._go(c.key==="ArrowLeft"?-1:1);return}if(c.key==="Escape"&&!Xt("#data-dialog").open){let v=Xt("#panel"),S=kn&&!v.classList.contains("closed"),w=v.contains(document.activeElement);qo(),Ga("detail"),kn||Va(!1),S&&Su(w)}}),addEventListener("resize",Wa),Wa();let Xa=new W;function bp(c,g=4,v=0){let S=Bt.position,w=c.label.position,L=v?1-v/Math.max(v*1.2,S.distanceTo(w)):1;for(let N=2;N<24&&N/24<L;N++){let X=N/24,H=S.x+(w.x-S.x)*X,U=S.z+(w.z-S.z)*X;if(!(Math.abs(H)>e/2||Math.abs(U)>n/2)&&_(H,U)*Tt.scale.y>S.y+(w.y-S.y)*X+g)return!0}return!1}let Sp=".brand,.viewbar,.rail>*,.dock,.map-meta,#route-hud,#flight-hint,#panel,#card,.settings-wrap";function $x(c){let g=0,v=0;for(let S=c;S;S=S.offsetParent)g+=S.offsetLeft,v+=S.offsetTop;return[g,v,g+c.offsetWidth,v+c.offsetHeight]}function Zx(){let c=innerWidth,g=innerHeight,v=!Xt("#settings").classList.contains("collapsed");tt=!1,lt=[],bt++;for(let S of Yi(Sp)){if(!S.offsetWidth||S.closest(".is-hidden")||S.id==="panel"&&S.classList.contains("closed")||(S.id==="card"||S.id==="flight-hint")&&!S.classList.contains("show")||S.matches(".settings-wrap")&&!v||getComputedStyle(S).visibility==="hidden")continue;let w=$x(S);S.matches(".sheet")?(kn?S.offsetWidth>c*.6?(w[0]=0,w[2]=c):(w[1]=0,w[2]=c):w[0]=w[1]=0,w[3]=g):(w[0]<16&&(w[0]=0),c-w[2]<16&&(w[2]=c),w[1]<16&&(w[1]=0),g-w[3]<16&&(w[3]=g)),(S.matches(".sheet")||kn&&S.matches(".settings-wrap"))&&w.push(1),lt.push(w)}}function uo(){tt=!0,uo.t||(st=!0),clearTimeout(uo.t),uo.t=setTimeout(()=>{uo.t=0,tt=st=!0},520)}{let c=new MutationObserver(uo),g=window.ResizeObserver&&new ResizeObserver(uo);c.observe(document.body,{attributes:!0,attributeFilter:["class"]});for(let v of Yi(Sp))c.observe(v,{attributes:!0,attributeFilter:["class","hidden"]}),g?.observe(v)}function Jx(c,g){let v=c.pos;if(v&&v.ox===g.ox&&v.oy===g.oy&&v.len===g.len&&v.ang===g.ang)return;c.pos=g;let S=c.el.style;S.setProperty("--dx",g.ox+"px"),S.setProperty("--dy",g.oy+"px"),S.setProperty("--len",g.len+"px"),S.setProperty("--ang",g.ang+"deg")}let jx=c=>({ox:0,oy:-c.stem,len:c.stem,ang:-90});function Ep(c,g=!1){Qt++;let v=!1;E.length=0;let S=Xt("#layer-labels").checked,w=[],L=innerWidth,N=innerHeight,X=Bt.position,H=Qd??(kn?28:60);S&&!c&&tt&&Zx();let U=c||(S?lt:[]),K=U.filter(F=>F[4]),q=U.filter(F=>!F[4]),k=!Xt("#panel").classList.contains("closed")&&!Xt("#tab-places").hidden,J=document.body.classList.contains("route-on");for(let F of Ax){let ot=F.label.position,_t=Math.hypot(ot.x-X.x,ot.y-X.y,ot.z-X.z),it=F===$i?2:F.tier||0,xt=S&&(!J||F===$i)&&(_t<F.limit||F===$i||F.hall&&F.parent===$i&&_t<900)&&(F.road||F.hall||F.featured||F===$i||!k||Hx(F,Ho)),ut=0,rt=0;if(xt){Xa.copy(ot).project(Bt),ut=(Xa.x+1)*L/2,rt=(1-Xa.y)*N/2;let At=F.labelWidth/2,Ce=rt-F.labelHeight;if(Xa.z>1||Xa.z<0||(it?ut<4||ut>L-4||rt<4||rt>N-8:ut<At+4||ut>L-At-4||Ce<4||rt>N-18))xt=!1;else if(it){for(let It of it>1?K:U)if(ut>It[0]&&ut<It[2]&&rt>It[1]&&rt<It[3]){xt=!1;break}}else for(let It of U)if(ut-At<It[2]&&ut+At>It[0]&&Ce<It[3]&&rt+4>It[1]){xt=!1;break}}if(xt&&!F.road&&!F.featured){let At=it?bp(F,F.occ?0:10,150):bp(F);At!==F.occ?(F.occN=(F.occN||0)+1,F.occ===void 0||F.occN>=2?(F.occ=At,F.occN=0):v=!0):F.occN=0,F.occ&&(xt=!1)}w.push({p:F,dist:_t,x:ut,y:rt,v:xt,tier:it})}w.sort((F,ot)=>!!ot.p.featured-!!F.p.featured||(ot.p===$i)-(F.p===$i)||ot.tier-F.tier||F.p.p-ot.p.p||F.dist-ot.dist),Hl=0;let j=(F,ot)=>Math.max(0,Math.min(F[2],ot[2])-Math.max(F[0],ot[0]))*Math.max(0,Math.min(F[3],ot[3])-Math.max(F[1],ot[1])),at=(F,ot,_t)=>F>_t[0]&&F<_t[2]&&ot>_t[1]&&ot<_t[3],pt=(F,ot,_t,it,xt)=>{let ut=0,rt=1,At=_t-F,Ce=it-ot;for(let[It,oe]of[[-At,F-xt[0]],[At,xt[2]-F],[-Ce,ot-xt[1]],[Ce,xt[3]-ot]])if(It){let Rt=oe/It;if(It<0){if(Rt>rt)return!1;Rt>ut&&(ut=Rt)}else{if(Rt<ut)return!1;Rt<rt&&(rt=Rt)}}else if(oe<0)return!1;return rt-ut>.02},Ut=(F,ot)=>{let _t=(it,xt,ut)=>(xt[0]-it[0])*(ut[1]-it[1])-(xt[1]-it[1])*(ut[0]-it[0]);return _t(F[0],F[1],ot[0])*_t(F[0],F[1],ot[1])<0&&_t(ot[0],ot[1],F[0])*_t(ot[0],ot[1],F[1])<0},dt=[],Vt=[],Gt=w.filter(F=>F.v&&F.tier).map(F=>[F.x,F.y,F.p]),St=0;for(let F of w){let ot=null;if(F.v){let _t=F.p,it=_t.labelWidth/2,xt=_t.labelHeight-_t.stem,ut=[F.x,F.y],rt=(At,Ce)=>{let It=[F.x+At-it,F.y+Ce-xt,F.x+At+it,F.y+Ce],oe=si(F.x,It[0],It[2]),Rt=si(F.y,It[1],It[3]),kt=Math.hypot(oe-F.x,Rt-F.y);return{ox:Math.round(At*2)/2,oy:Math.round(Ce*2)/2,len:kt<3?0:Math.round(kt*2)/2,ang:Math.round(Math.atan2(Rt-F.y,oe-F.x)*180/Math.PI),r:It,t:[oe,Rt]}};if(F.tier){let At=[rt(0,-_t.stem)],Ce=_t.pos;Ce&&At.push(rt(Ce.ox,Ce.oy));let It=wt=>{let Nt=Math.max(0,2-wt.r[0])+Math.min(0,L-2-wt.r[2]),Q=Math.max(0,2-wt.r[1])+Math.min(0,N-2-wt.r[3]);return Nt||Q?rt(wt.ox+Nt,wt.oy+Q):null},oe=q.some(wt=>at(F.x,F.y,wt)),Rt=oe?280:190,kt=_t.featured?7:4;for(let wt of oe?[10,26,48,76,110,150,200,250]:[10,26,48,76,110,150])for(let Nt=0;Nt<12;Nt++){let Q=(Nt*30-90)*Math.PI/180,Ft=Math.cos(Q),he=Math.sin(Q),ie=Math.min(Math.abs(Ft)>.001?it/Math.abs(Ft):1e9,Math.abs(he)>.001?xt/2/Math.abs(he):1e9),Oe=rt(Ft*(wt+ie),he*(wt+ie)+xt/2);At.push(Oe);let Je=It(Oe);Je&&At.push(Je)}for(let wt of q)if(!(Math.max(wt[0]-F.x,F.x-wt[2],wt[1]-F.y,F.y-wt[3])>40))for(let Q of[rt(0,wt[3]+4+xt-F.y),rt(0,wt[1]-4-F.y),rt(wt[0]-4-it-F.x,xt/2),rt(wt[2]+4+it-F.x,xt/2)]){At.push(Q);let Ft=It(Q);Ft&&At.push(Ft)}let xe=null,_e=1/0,Z=null,Et=1/0;for(let wt of At){let Nt=wt.r;if(Nt[0]<1||Nt[2]>L-1||Nt[1]<1||Nt[3]>N-1||wt.len>Rt)continue;let Q=.8*Math.max(0,wt.len-_t.stem);if(Ce){let Oe=Math.hypot(wt.ox-Ce.ox,wt.oy-Ce.oy);Q+=g?1.2*Oe+4*Math.max(0,Oe-70):Oe<2?-2:0}if(Q>=_e)continue;let Ft=[Nt[0]-2,Nt[1]-2,Nt[2]+2,Nt[3]+2],he=0;for(let Oe of U)he+=4*j(Nt,Oe);for(let Oe of dt)he+=4*j(Ft,Oe);for(let[Oe,Je,en]of Gt)(en!==_t?at(Oe,Je,[Ft[0]-3,Ft[1]-3,Ft[2]+3,Ft[3]+3]):wt!==At[0]&&at(Oe,Je,[Ft[0]-kt,Ft[1]-kt,Ft[2]+kt,Ft[3]+kt]))&&(he+=en===_t?3e3:1500);for(let[Oe,Je]of Vt)pt(Oe[0],Oe[1],Je[0],Je[1],[Nt[0]+3,Nt[1]+3,Nt[2]-3,Nt[3]-3])&&(he+=1200);if(F.tier<2&&he||he+Q>=_e)continue;if(wt.len){let[Oe,Je]=wt.t;for(let en of dt)pt(F.x,F.y,Oe,Je,[en[0]+3,en[1]+3,en[2]-3,en[3]-3])&&(Q+=1200);for(let en of Vt)Ut([ut,wt.t],en)&&(Q+=600);for(let en of q)!at(F.x,F.y,en)&&pt(F.x,F.y,Oe,Je,[en[0]-4,en[1]-4,en[2]+4,en[3]+4])&&(Q+=900)}let ie=he+Q;if(ie<_e&&(_e=ie,xe=wt),!he&&ie<Et&&(Et=ie,Z=wt),ie<=0)break}ot=F.tier>1?xe||At[0]:Z,ot?(dt.push([ot.r[0]-2,ot.r[1]-2,ot.r[2]+2,ot.r[3]+2]),ot.len&&Vt.push([ut,ot.t]),Hl++):F.v=!1}else{let At=[F.x-it-2,F.y-_t.labelHeight-2,F.x+it+2,F.y+4];St>=H||dt.some(Ce=>j(At,Ce))||Gt.some(([Ce,It])=>at(Ce,It,At))||Vt.some(([Ce,It])=>pt(Ce[0],Ce[1],It[0],It[1],At))?F.v=!1:(dt.push(At),St++,Hl++)}}Jx(F.p,ot||jx(F.p)),F.v?(F.p.label.parent||qt.add(F.p.label),F.p.label.visible=!0,E.push(F.p.label)):F.p.label.parent&&qt.remove(F.p.label)}return v}function wp(){Cx(),R.children=E.filter(g=>g.parent).concat(ri?.labelObjects||[],Nr),Y.render(R,Bt);let c=+Go.style.zIndex||0;for(let g of ri?.labelObjects||[])if(g.element.classList.contains("named")){let v=1e3+(+g.element.style.zIndex||0);g.element.style.zIndex=v,c=Math.max(c,v+1)}Go.style.zIndex=c,mt++}let qa=0,Tp=0,Tu=0,Ql=!1,Br=0,fo=0,Ya=0,As=[],$a=16.7,po=0,Au=0,Ru=!0,Cu=!0,Ap=0,Rp=0,Cp=0,Pp=new Un,Lp=new Un,Ip=new W,Dp=new ds;for(let c of["pointerdown","pointermove","wheel","keydown","input","change","click"])addEventListener(c,g=>{Tu=performance.now(),c!=="pointermove"&&!Wo.contains(g.target)&&(or=null),["keydown","input","change","click"].includes(c)&&(st=!0)},{capture:!0,passive:!0});function tc(c){fo=c,Br=performance.now()+3e3,As=[]}function ec(c,g){c=Math.max(0,Math.min(Ud,c));let v=fi,S=xr;fi=c,xr=g==="emergency",(c!==v||xr!==S)&&jd()}function Up(c,g){if(c.action==="resolution-down"||c.action==="resolution-up")return D(!1,g),!0;if(c.action==="tier-down"){if(Ru=!1,fi>0)ec(fo===2&&fi>Ya?Ya:fi-1,"slow");else if(!xr)ec(0,"emergency");else return!1;return Zh.set("autoTier",fi),!0}return!1}function Kx(c,g){if(!(g-P<500)){if(Br){if(g<Br-2200||(As.push(Math.min(c,250)),g<Br||As.length<12))return;let v=A.observe(As,g);if($a=v.mean,po=0,Up(v,g)){tc(fo===2&&fi>Ya?2:1);return}if(Br=0,As=[],Au=g+3e3,fo===1&&Ru&&v.fast&&A.limit===A.ceiling&&fi<Ud&&!xr){Ru=!1,Ya=fi,ec(fi+1,"probe"),tc(2);return}fo===2&&v.mean>22&&ec(Ya,"probe-revert"),fo=0,Zh.set("autoTier",fi);return}if($a=po?$a+(Math.min(c,250)-$a)*.05:Math.min(c,250),po++,As.push(Math.min(c,250)),As.length>240&&As.shift(),g>Au&&po>45){let v=A.observe(As,g);Up(v,g),po=0,As=[],Au=g+3e3}}}document.addEventListener("visibilitychange",()=>{document.hidden&&(or=null),qa=0,Ql=!1,As=[],po=0,st=!0,!document.hidden&&Br&&tc(fo)});function Np(c){if(requestAnimationFrame(Np),document.hidden){qa=0;return}let g=qa?c-qa:16.7;qa=c;for(let K of np)K(c,g);vi.update(c);let v=ge.update(),S=Or.x!==Fr.x||Or.y!==Fr.y;if(S){let K=Il?1:1-Math.pow(.86,g/16.7);for(let q of["x","y"])Or[q]+=(Fr[q]-Or[q])*K,Math.abs(Or[q]-Fr[q])<.4&&(Or[q]=Fr[q]);wu()}let w=nr&&!Br&&!vi.active&&!v&&!S&&!ri?.previewing&&c-Tu>1500;if(w&&!st&&!Wl&&c-Tp<(c-Tu>8e3?98:48)){Ql=!1;return}Ql&&!w?Kx(g,c):Br||(As=[],po=0),Ql=!0,Tp=c,D(w,c),Cp++;for(let K of ou){let q=Il?K.phase:K.kind==="funicular"?(Math.sin(c/16e3)*.5+.5)*.96+.02:(c/14e4+K.phase)%1,k=K.curve.getPoint(q);K.g.position.copy(k),K.kind==="cable"&&(K.g.position.y-=5.5);let J=K.curve.getTangent(q);K.g.rotation.y=Math.atan2(-J.z,J.x)}let L=Bt.position.distanceTo(ge.target),N=Ir[fi];for(let K of ln)K.visible=L<N.landmarkDist;for(let K of au)K.update(L);for(let K of Ba)K.trunk&&(K.trunk.visible=L<N.trunkDist);for(let K of Hn)K.visible=L<N.detailDist;if(ao){let K=Bt.position.distanceTo(ao.position),q=si(K/160,1,26);ao.scale.setScalar(q),ao.rotation.y=c/1400;let k=yr;k?.label&&(k.label.position.y=(ao.userData.base+ao.userData.head*q)*Tt.scale.y+2*q)}Bt.updateMatrixWorld();let X=!Pp.equals(Bt.matrixWorld)||!Lp.equals(Bt.projectionMatrix);X&&(Cu=!0);let H=st||Cu&&c-Ap>=110;if(H){let K=Bt.position.distanceTo(Ip)>Math.max(.02,Bt.position.distanceTo(ge.target)*4e-4)||Dp.angleTo(Bt.quaternion)>4e-4;Ip.copy(Bt.position),Dp.copy(Bt.quaternion),Cu=Ep(null,K)||K,Ap=c}if(H||X&&c-Rp>=110){Rp=c;let K=ge.target;Re.target.position.copy(K),Re.position.set(K.x-1200,K.y+2100,K.z-1300),Xt("#north-arrow").style.transform=`rotate(${-pu()}deg)`,Xt("#scene-status").textContent=L<350?"\u5EFA\u7B51\u8FD1\u666F \xB7 \u7EC6\u90E8\u590D\u539F":L<2100?"\u4E5D\u534E\u5C71\u8857\u533A \xB7 \u62D6\u52A8\u73AF\u770B":PS.matches?"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u6EDA\u8F6E\u7F29\u653E":"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u53CC\u6307\u7F29\u653E";let q=L*2*Math.tan(43*Math.PI/360)/innerHeight*80;Xt("#scale-line").textContent=q>1e3?`${(q/1e3).toFixed(1)} km`:`${Math.round(q/10)*10||5} m`}Jt(),p.render(qt,Bt);let U=ri?.updateLabels(c);(X||H||U||Wl)&&wp(),st=Wl=!1,Pp.copy(Bt.matrixWorld),Lp.copy(Bt.projectionMatrix),++_x===30&&console.info("Map verification",JSON.stringify(window.mapDiagnostics))}Vo=!0,jd(),tc(1),Xt("#loading").classList.add("done"),setTimeout(()=>{Xt("#loading").hidden=!0,document.body.classList.contains("map-chrome-hidden")||nx.start()},700),requestAnimationFrame(Np),window.mapDiagnostics={version:t.version,buildings:t.stats.buildings,places:sr.length,businesses:t.stats.businesses,trees:Fl.length,bamboo:iu.length,roads:t.roads.length,coordinateSystem:t.geo.crs,randomHouses:0,detailModel:"mapped footprints + area-rule facades; only \u5C45\u4E4B\u6797 named among businesses",signs:0,lanterns:Bn.length,get drawCalls(){return p.info.render.calls},get frames(){return p.info.render.frame},get pixelRatio(){return p.getPixelRatio()},get quality(){return Ir[fi].name+(xr?"-":"")},get tier(){return fi},get frameMs(){return Math.round($a*10)/10},get triangles(){return p.info.render.triangles},get visibleLabels(){return Hl},get resolutionLimit(){return A.limit},get idleResolution(){return M},get spatialMode(){return au.some(c=>c.near)?"near":"far"},get labelPasses(){return mt},get labelSelections(){return Qt},get labelCovers(){return lt.map(c=>c.map(Math.round))},get coverMeasures(){return bt},get animationUpdates(){return Cp}}}
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
