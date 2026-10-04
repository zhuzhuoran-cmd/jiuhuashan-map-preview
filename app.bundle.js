var Wr=i=>String(i??"").normalize("NFKC").toLowerCase().replace(/[\s()（）·.,，。\-_/]+/g,""),$p=[["toilet",["\u516C\u5171\u5395\u6240","\u516C\u5395","\u5395\u6240","\u536B\u751F\u95F4","\u6D17\u624B\u95F4","wc"],i=>i.k==="\u516C\u5171\u5395\u6240"],["cable",["\u7D22\u9053","\u7F06\u8F66"],i=>i.category==="transport"&&/索道|缆车/.test(i.n)||i.k==="cable-car"],["bus",["\u666F\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u8F66\u7AD9","\u516C\u4EA4\u7AD9","\u5BA2\u8FD0\u7AD9","\u5DF4\u58EB\u7AD9","\u4E58\u8F66\u5904","\u8F66\u7AD9"],i=>i.category==="transport"&&/bus/.test(i.k)],["visitor",["\u6E38\u5BA2\u670D\u52A1\u5206\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3","\u6E38\u5BA2\u4E2D\u5FC3","\u6E38\u5BA2\u670D\u52A1\u7AD9"],i=>i.k==="\u6E38\u5BA2\u670D\u52A1\u4E2D\u5FC3"],["ticket",["\u552E\u7968\u5904","\u552E\u7968\u70B9","\u552E\u7968\u4EAD","\u7968\u52A1"],i=>/售票/.test([i.n,...i.aliases||[]].join(" "))],["parking",["\u505C\u8F66\u573A","\u505C\u8F66\u5904","\u505C\u8F66\u4F4D","\u505C\u8F66"],i=>i.category==="service"&&/停车场|car park/.test(i.k)],["temple",["\u5BFA\u5E99","\u5BFA\u9662"],i=>i.category==="temple"],["hotel",["\u4F4F\u5BBF","\u9152\u5E97","\u65C5\u9986","\u65C5\u5E97"],i=>i.category==="hotel"],["guesthouse",["\u6C11\u5BBF","\u5BA2\u6808"],i=>i.category==="hotel"&&/民宿|客栈/.test(i.n+(i.k||""))],["food",["\u9910\u996E","\u9910\u5385","\u9910\u9986","\u996D\u5E97","\u996D\u9986","\u5403\u996D"],i=>i.category==="food"],["shop",["\u8D2D\u7269","\u5546\u5E97","\u5546\u94FA","\u5E97\u94FA"],i=>i.category==="shop"],["market",["\u8D85\u5E02","\u4FBF\u5229\u5E97","\u5C0F\u5356\u90E8"],i=>i.category==="shop"&&/超市|便利|小卖部/.test(i.n+(i.k||""))],["sight",["\u666F\u70B9","\u666F\u89C2"],i=>["sight","nature"].includes(i.category)],["nature",["\u81EA\u7136\u666F\u89C2","\u5C71\u6C34\u666F\u89C2","\u5C71\u6C34"],i=>i.category==="nature"],["village",["\u6751\u843D","\u6751\u5E84","\u5730\u540D","\u793E\u533A"],i=>i.category==="village"],["service",["\u516C\u5171\u8BBE\u65BD","\u516C\u5171\u670D\u52A1"],i=>["service","transport"].includes(i.category)],["transport",["\u4EA4\u901A","\u4EA4\u901A\u8BBE\u65BD"],i=>i.category==="transport"]],f1=$p.flatMap(([i,t])=>t.map(e=>({term:Wr(e),id:i}))).sort((i,t)=>t.term.length-i.term.length);function d1(i){let t=[];for(let e of String(i??"").normalize("NFKC").toLowerCase().trim().split(/\s+/)){let n=Wr(e),s="";for(;n;){let r=f1.find(a=>n.startsWith(a.term));r?(s&&t.push({text:s}),s="",t.push({group:r.id}),n=n.slice(r.term.length)):(s+=n[0],n=n.slice(1))}s&&t.push({text:s})}return t}function Zp(i){let t=new Set,e=[];for(let a of i){if(!a.n||!Number.isFinite(a.x)||!Number.isFinite(a.z))continue;let o=a.placeId||a.n;if(t.has(o))continue;t.add(o);let l=[a.n,a.displayName].filter(Boolean).map(Wr),h=[a.shortName,...a.aliases||[],a.viewing?.name].filter(Boolean).map(Wr),u=[...l,...h,a.address,a.zone,a.k].filter(Boolean).map(Wr),f=new Set($p.filter(([,,m])=>m(a)).map(([m])=>m));e.push({place:a,names:l,aliases:h,texts:u,groups:f})}let n=null,s=new Map;function r(a){let o=String(a??"");if(o===n||(n=o,s=new Map,o.length>200))return s;let l=Wr(a),h=d1(a);for(let u of e){let f=-1;if(!String(a??"").trim())f=0;else if(!l)f=-1;else if(u.names.includes(l))f=1e3;else if(u.aliases.includes(l))f=900;else if(h.length&&h.every(m=>m.group?u.groups.has(m.group):u.texts.some(d=>d.includes(m.text)))){let m=h.filter(d=>d.text);f=u.names.some(d=>d.startsWith(l))?800:u.names.some(d=>d.includes(l))?700:u.aliases.some(d=>d.includes(l))?600:m.some(d=>u.names.some(y=>y.includes(d.text)))?500:m.some(d=>u.aliases.some(y=>y.includes(d.text)))?400:200}s.set(u.place,f)}return s}return{score(a,o){return r(o).get(a)??-1},search(a,{accept:o=()=>!0}={}){let l=r(a);return e.filter(h=>l.get(h.place)>=0&&o(h.place)).sort((h,u)=>l.get(u.place)-l.get(h.place)||(u.place.featured?1:0)-(h.place.featured?1:0)||(h.place.p??99)-(u.place.p??99)||h.place.n.localeCompare(u.place.n,"zh-CN")).map(h=>h.place)}}}function Jp(i,t,{delay:e=90}={}){let n=!1,s,r=()=>{clearTimeout(s),s=void 0},a=()=>{r(),n||t(i.value.trim())},o=u=>{r(),!(n||u?.isComposing)&&(s=setTimeout(a,e))},l=()=>{n=!0,r()},h=()=>{n=!1,o()};return i.addEventListener("input",o),i.addEventListener("compositionstart",l),i.addEventListener("compositionend",h),{flush:a,destroy(){r(),i.removeEventListener("input",o),i.removeEventListener("compositionstart",l),i.removeEventListener("compositionend",h)}}}function jp(i){let t=1/0,e=-1/0;for(let n=0;n<i.length;n++)i[n]<t&&(t=i[n]),i[n]>e&&(e=i[n]);return{min:t,max:e}}var Kp={"\u516C\u5395\uFF08\u4E09\u89D2\u6D32\u8F66\u7AD9\u505C\u8F66\u573A\u65C1\uFF09":609946470,"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":609892484,"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":609980796,"\u516C\u5171\u5395\u6240(AH-CIZ-0666)":609909660},p1={"\u516C\u5395\uFF08\u4E1C\u5D16\u5BBE\u9986\u9644\u8FD1\uFF09":"facility:toilet-dongya","\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09":"facility:toilet-huxingshan",\u864E\u5F62\u5C71\u8F66\u7AD9:"transport:huxingshan-station"},sl=i=>p1[i]||`place:${i}`,Qp="\u4E1A\u4E3B\u6307\u8BA4 \xB7 \u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E";function tm(i){i.places.some(e=>e.n==="\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09")||i.places.push({n:"\u516C\u5395\uFF08\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1\uFF09",shortName:"\u516C\u5395",category:"service",k:"\u516C\u5171\u5395\u6240",p:3,zone:"\u4E5D\u534E\u8857\uFF08\u9547\u533A\uFF09",x:-1424,z:-17,lon:117.8115+-1424/95950,lat:30.482- -17/110900,address:"\u864E\u5F62\u5C71\u8F66\u7AD9\u65C1",quality:"owner_reported",src:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09",sources:[{name:"\u4E1A\u4E3B\u6307\u8BA4\uFF082026-10-01\uFF09\uFF0C\u4F4D\u7F6E\u6309\u6A21\u578B\u4F30\u8BA1\uFF0C\u672A\u72EC\u7ACB\u6838\u5B9E",url:""}],sourceFamilies:["owner"],coordinateMethod:"\u6A21\u578B\u5E73\u9762\u5750\u6807\u6309\u9879\u76EE\u6295\u5F71\u6362\u7B97\u4E3A\u8FD1\u4F3C WGS84",modelQuality:"schematic",note:"\u8BBE\u65BD\u7531\u4E1A\u4E3B\u6307\u8BA4\uFF1B\u4F4D\u7F6E\u53CA\u5F53\u524D\u5F00\u653E\u72B6\u6001\u672A\u72EC\u7ACB\u6838\u5B9E\u3002",searchable:!0});let t=i.places.find(e=>e.n==="\u864E\u5F62\u5C71\u8F66\u7AD9");t&&(t.aliases=[...new Set([...t.aliases||[],"\u864E\u5F62\u5C71\u8F66\u7AD9\u552E\u7968\u5904","\u864E\u5F62\u5C71\u552E\u7968\u5904"])]);for(let e of i.places)e.placeId=sl(e.n);return i.places}function em(i,t,e){for(let n=i;n;n=n.parent){if(n.userData?.placeId)return t.get(n.userData.placeId);if(n.userData?.landmark&&e.has(n.userData.landmark))return e.get(n.userData.landmark)}}var Do={LEFT:0,MIDDLE:1,RIGHT:2,ROTATE:0,DOLLY:1,PAN:2},Uo={ROTATE:0,PAN:1,DOLLY_PAN:2,DOLLY_ROTATE:3},m1=0,nm=1,g1=2;var z0=1,dd=2,Cr=3,eo=0,gs=1,mn=2;var Kr=0,_a=1,im=2,sm=3,rm=4,x1=5,bo=100,y1=101,_1=102,om=103,am=104,v1=200,M1=201,b1=202,S1=203,Sf=204,Ef=205,E1=206,w1=207,T1=208,A1=209,R1=210,C1=211,P1=212,L1=213,I1=214,D1=0,U1=1,N1=2,Vc=3,O1=4,F1=5,B1=6,z1=7,pd=0,k1=1,H1=2,Qr=0,V1=1,G1=2,W1=3,md=4,X1=5,q1=6;var k0=300,ba=301,Sa=302,wf=303,Tf=304,Uh=306,no=1e3,Js=1001,Af=1002,Pi=1003,lm=1004;var Vu=1005;var ms=1006,Y1=1007;var xl=1008;var to=1009,$1=1010,Z1=1011,gd=1012,H0=1013,Jr=1014,jr=1015,yl=1016,V0=1017,G0=1018,Eo=1020,J1=1021,js=1023,j1=1024,K1=1025,wo=1026,Ea=1027,Q1=1028,W0=1029,ty=1030,X0=1031,q0=1033,Gu=33776,Wu=33777,Xu=33778,qu=33779,cm=35840,hm=35841,um=35842,fm=35843,Y0=36196,dm=37492,pm=37496,mm=37808,gm=37809,xm=37810,ym=37811,_m=37812,vm=37813,Mm=37814,bm=37815,Sm=37816,Em=37817,wm=37818,Tm=37819,Am=37820,Rm=37821,Yu=36492,Cm=36494,Pm=36495,ey=36283,Lm=36284,Im=36285,Dm=36286;var Gc=2300,Wc=2301,$u=2302,Um=2400,Nm=2401,Om=2402;var $0=3e3,To=3001,ny=3200,iy=3201,Nh=0,sy=1,Bs="",kn="srgb",Lr="srgb-linear",xd="display-p3",Oh="display-p3-linear",Xc="linear",oi="srgb",qc="rec709",Yc="p3";var Ko=7680;var Fm=519,ry=512,oy=513,ay=514,Z0=515,ly=516,cy=517,hy=518,uy=519,Rf=35044;var Bm="300 es",Cf=1035,Pr=2e3,$c=2001,pr=class{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});let n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){if(this._listeners===void 0)return!1;let n=this._listeners;return n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){if(this._listeners===void 0)return;let s=this._listeners[t];if(s!==void 0){let r=s.indexOf(e);r!==-1&&s.splice(r,1)}}dispatchEvent(t){if(this._listeners===void 0)return;let n=this._listeners[t.type];if(n!==void 0){t.target=this;let s=n.slice(0);for(let r=0,a=s.length;r<a;r++)s[r].call(this,t);t.target=null}}},Qi=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],zm=1234567,ul=Math.PI/180,_l=180/Math.PI;function dr(){let i=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Qi[i&255]+Qi[i>>8&255]+Qi[i>>16&255]+Qi[i>>24&255]+"-"+Qi[t&255]+Qi[t>>8&255]+"-"+Qi[t>>16&15|64]+Qi[t>>24&255]+"-"+Qi[e&63|128]+Qi[e>>8&255]+"-"+Qi[e>>16&255]+Qi[e>>24&255]+Qi[n&255]+Qi[n>>8&255]+Qi[n>>16&255]+Qi[n>>24&255]).toLowerCase()}function Li(i,t,e){return Math.max(t,Math.min(e,i))}function yd(i,t){return(i%t+t)%t}function fy(i,t,e,n,s){return n+(i-t)*(s-n)/(e-t)}function dy(i,t,e){return i!==t?(e-i)/(t-i):0}function fl(i,t,e){return(1-e)*i+e*t}function py(i,t,e,n){return fl(i,t,1-Math.exp(-e*n))}function my(i,t=1){return t-Math.abs(yd(i,t*2)-t)}function gy(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*(3-2*i))}function xy(i,t,e){return i<=t?0:i>=e?1:(i=(i-t)/(e-t),i*i*i*(i*(i*6-15)+10))}function yy(i,t){return i+Math.floor(Math.random()*(t-i+1))}function _y(i,t){return i+Math.random()*(t-i)}function vy(i){return i*(.5-Math.random())}function My(i){i!==void 0&&(zm=i);let t=zm+=1831565813;return t=Math.imul(t^t>>>15,t|1),t^=t+Math.imul(t^t>>>7,t|61),((t^t>>>14)>>>0)/4294967296}function by(i){return i*ul}function Sy(i){return i*_l}function Pf(i){return(i&i-1)===0&&i!==0}function Ey(i){return Math.pow(2,Math.ceil(Math.log(i)/Math.LN2))}function Zc(i){return Math.pow(2,Math.floor(Math.log(i)/Math.LN2))}function wy(i,t,e,n,s){let r=Math.cos,a=Math.sin,o=r(e/2),l=a(e/2),h=r((t+n)/2),u=a((t+n)/2),f=r((t-n)/2),m=a((t-n)/2),d=r((n-t)/2),y=a((n-t)/2);switch(s){case"XYX":i.set(o*u,l*f,l*m,o*h);break;case"YZY":i.set(l*m,o*u,l*f,o*h);break;case"ZXZ":i.set(l*f,l*m,o*u,o*h);break;case"XZX":i.set(o*u,l*y,l*d,o*h);break;case"YXY":i.set(l*d,o*u,l*y,o*h);break;case"ZYZ":i.set(l*y,l*d,o*u,o*h);break;default:console.warn("THREE.MathUtils: .setQuaternionFromProperEuler() encountered an unknown order: "+s)}}function fr(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return i/4294967295;case Uint16Array:return i/65535;case Uint8Array:return i/255;case Int32Array:return Math.max(i/2147483647,-1);case Int16Array:return Math.max(i/32767,-1);case Int8Array:return Math.max(i/127,-1);default:throw new Error("Invalid component type.")}}function Gn(i,t){switch(t.constructor){case Float32Array:return i;case Uint32Array:return Math.round(i*4294967295);case Uint16Array:return Math.round(i*65535);case Uint8Array:return Math.round(i*255);case Int32Array:return Math.round(i*2147483647);case Int16Array:return Math.round(i*32767);case Int8Array:return Math.round(i*127);default:throw new Error("Invalid component type.")}}var Fh={DEG2RAD:ul,RAD2DEG:_l,generateUUID:dr,clamp:Li,euclideanModulo:yd,mapLinear:fy,inverseLerp:dy,lerp:fl,damp:py,pingpong:my,smoothstep:gy,smootherstep:xy,randInt:yy,randFloat:_y,randFloatSpread:vy,seededRandom:My,degToRad:by,radToDeg:Sy,isPowerOfTwo:Pf,ceilPowerOfTwo:Ey,floorPowerOfTwo:Zc,setQuaternionFromProperEuler:wy,normalize:Gn,denormalize:fr},de=class i{constructor(t=0,e=0){i.prototype.isVector2=!0,this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){let e=this.x,n=this.y,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6],this.y=s[1]*e+s[4]*n+s[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Li(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){let n=Math.cos(e),s=Math.sin(e),r=this.x-t.x,a=this.y-t.y;return this.x=r*n-a*s+t.x,this.y=r*s+a*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}},En=class i{constructor(t,e,n,s,r,a,o,l,h){i.prototype.isMatrix3=!0,this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h)}set(t,e,n,s,r,a,o,l,h){let u=this.elements;return u[0]=t,u[1]=s,u[2]=o,u[3]=e,u[4]=r,u[5]=l,u[6]=n,u[7]=a,u[8]=h,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){let e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[3],l=n[6],h=n[1],u=n[4],f=n[7],m=n[2],d=n[5],y=n[8],v=s[0],p=s[3],x=s[6],T=s[1],M=s[4],C=s[7],P=s[2],I=s[5],z=s[8];return r[0]=a*v+o*T+l*P,r[3]=a*p+o*M+l*I,r[6]=a*x+o*C+l*z,r[1]=h*v+u*T+f*P,r[4]=h*p+u*M+f*I,r[7]=h*x+u*C+f*z,r[2]=m*v+d*T+y*P,r[5]=m*p+d*M+y*I,r[8]=m*x+d*C+y*z,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8];return e*a*u-e*o*h-n*r*u+n*o*l+s*r*h-s*a*l}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8],f=u*a-o*h,m=o*l-u*r,d=h*r-a*l,y=e*f+n*m+s*d;if(y===0)return this.set(0,0,0,0,0,0,0,0,0);let v=1/y;return t[0]=f*v,t[1]=(s*h-u*n)*v,t[2]=(o*n-s*a)*v,t[3]=m*v,t[4]=(u*e-s*l)*v,t[5]=(s*r-o*e)*v,t[6]=d*v,t[7]=(n*l-h*e)*v,t[8]=(a*e-n*r)*v,this}transpose(){let t,e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){let e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,s,r,a,o){let l=Math.cos(r),h=Math.sin(r);return this.set(n*l,n*h,-n*(l*a+h*o)+a+t,-s*h,s*l,-s*(-h*a+l*o)+o+e,0,0,1),this}scale(t,e){return this.premultiply(Zu.makeScale(t,e)),this}rotate(t){return this.premultiply(Zu.makeRotation(-t)),this}translate(t,e){return this.premultiply(Zu.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<9;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}},Zu=new En;function J0(i){for(let t=i.length-1;t>=0;--t)if(i[t]>=65535)return!0;return!1}function Jc(i){return document.createElementNS("http://www.w3.org/1999/xhtml",i)}function Ty(){let i=Jc("canvas");return i.style.display="block",i}var km={};function dl(i){i in km||(km[i]=!0,console.warn(i))}var Hm=new En().set(.8224621,.177538,0,.0331941,.9668058,0,.0170827,.0723974,.9105199),Vm=new En().set(1.2249401,-.2249404,0,-.0420569,1.0420571,0,-.0196376,-.0786361,1.0982735),dc={[Lr]:{transfer:Xc,primaries:qc,toReference:i=>i,fromReference:i=>i},[kn]:{transfer:oi,primaries:qc,toReference:i=>i.convertSRGBToLinear(),fromReference:i=>i.convertLinearToSRGB()},[Oh]:{transfer:Xc,primaries:Yc,toReference:i=>i.applyMatrix3(Vm),fromReference:i=>i.applyMatrix3(Hm)},[xd]:{transfer:oi,primaries:Yc,toReference:i=>i.convertSRGBToLinear().applyMatrix3(Vm),fromReference:i=>i.applyMatrix3(Hm).convertLinearToSRGB()}},Ay=new Set([Lr,Oh]),Wn={enabled:!0,_workingColorSpace:Lr,get workingColorSpace(){return this._workingColorSpace},set workingColorSpace(i){if(!Ay.has(i))throw new Error(`Unsupported working color space, "${i}".`);this._workingColorSpace=i},convert:function(i,t,e){if(this.enabled===!1||t===e||!t||!e)return i;let n=dc[t].toReference,s=dc[e].fromReference;return s(n(i))},fromWorkingColorSpace:function(i,t){return this.convert(i,this._workingColorSpace,t)},toWorkingColorSpace:function(i,t){return this.convert(i,t,this._workingColorSpace)},getPrimaries:function(i){return dc[i].primaries},getTransfer:function(i){return i===Bs?Xc:dc[i].transfer}};function va(i){return i<.04045?i*.0773993808:Math.pow(i*.9478672986+.0521327014,2.4)}function Ju(i){return i<.0031308?i*12.92:1.055*Math.pow(i,.41666)-.055}var Qo,jc=class{static getDataURL(t){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let e;if(t instanceof HTMLCanvasElement)e=t;else{Qo===void 0&&(Qo=Jc("canvas")),Qo.width=t.width,Qo.height=t.height;let n=Qo.getContext("2d");t instanceof ImageData?n.putImageData(t,0,0):n.drawImage(t,0,0,t.width,t.height),e=Qo}return e.width>2048||e.height>2048?(console.warn("THREE.ImageUtils.getDataURL: Image converted to jpg for performance reasons",t),e.toDataURL("image/jpeg",.6)):e.toDataURL("image/png")}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){let e=Jc("canvas");e.width=t.width,e.height=t.height;let n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);let s=n.getImageData(0,0,t.width,t.height),r=s.data;for(let a=0;a<r.length;a++)r[a]=va(r[a]/255)*255;return n.putImageData(s,0,0),e}else if(t.data){let e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(va(e[n]/255)*255):e[n]=va(e[n]);return{data:e,width:t.width,height:t.height}}else return console.warn("THREE.ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}},Ry=0,Kc=class{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:Ry++}),this.uuid=dr(),this.data=t,this.version=0}set needsUpdate(t){t===!0&&this.version++}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];let n={uuid:this.uuid,url:""},s=this.data;if(s!==null){let r;if(Array.isArray(s)){r=[];for(let a=0,o=s.length;a<o;a++)s[a].isDataTexture?r.push(ju(s[a].image)):r.push(ju(s[a]))}else r=ju(s);n.url=r}return e||(t.images[this.uuid]=n),n}};function ju(i){return typeof HTMLImageElement<"u"&&i instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&i instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&i instanceof ImageBitmap?jc.getDataURL(i):i.data?{data:Array.from(i.data),width:i.width,height:i.height,type:i.data.constructor.name}:(console.warn("THREE.Texture: Unable to serialize Texture."),{})}var Cy=0,As=class i extends pr{constructor(t=i.DEFAULT_IMAGE,e=i.DEFAULT_MAPPING,n=Js,s=Js,r=ms,a=xl,o=js,l=to,h=i.DEFAULT_ANISOTROPY,u=Bs){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Cy++}),this.uuid=dr(),this.name="",this.source=new Kc(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=s,this.magFilter=r,this.minFilter=a,this.anisotropy=h,this.format=o,this.internalFormat=null,this.type=l,this.offset=new de(0,0),this.repeat=new de(1,1),this.center=new de(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new En,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,typeof u=="string"?this.colorSpace=u:(dl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=u===To?kn:Bs),this.userData={},this.version=0,this.onUpdate=null,this.isRenderTargetTexture=!1,this.needsPMREMUpdate=!1}get image(){return this.source.data}set image(t=null){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}toJSON(t){let e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];let n={metadata:{version:4.6,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==k0)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case no:t.x=t.x-Math.floor(t.x);break;case Js:t.x=t.x<0?0:1;break;case Af:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case no:t.y=t.y-Math.floor(t.y);break;case Js:t.y=t.y<0?0:1;break;case Af:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}get encoding(){return dl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace===kn?To:$0}set encoding(t){dl("THREE.Texture: Property .encoding has been replaced by .colorSpace."),this.colorSpace=t===To?kn:Bs}};As.DEFAULT_IMAGE=null;As.DEFAULT_MAPPING=k0;As.DEFAULT_ANISOTROPY=1;var Fn=class i{constructor(t=0,e=0,n=0,s=1){i.prototype.isVector4=!0,this.x=t,this.y=e,this.z=n,this.w=s}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,s){return this.x=t,this.y=e,this.z=n,this.w=s,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=this.w,a=t.elements;return this.x=a[0]*e+a[4]*n+a[8]*s+a[12]*r,this.y=a[1]*e+a[5]*n+a[9]*s+a[13]*r,this.z=a[2]*e+a[6]*n+a[10]*s+a[14]*r,this.w=a[3]*e+a[7]*n+a[11]*s+a[15]*r,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);let e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,s,r,l=t.elements,h=l[0],u=l[4],f=l[8],m=l[1],d=l[5],y=l[9],v=l[2],p=l[6],x=l[10];if(Math.abs(u-m)<.01&&Math.abs(f-v)<.01&&Math.abs(y-p)<.01){if(Math.abs(u+m)<.1&&Math.abs(f+v)<.1&&Math.abs(y+p)<.1&&Math.abs(h+d+x-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;let M=(h+1)/2,C=(d+1)/2,P=(x+1)/2,I=(u+m)/4,z=(f+v)/4,nt=(y+p)/4;return M>C&&M>P?M<.01?(n=0,s=.707106781,r=.707106781):(n=Math.sqrt(M),s=I/n,r=z/n):C>P?C<.01?(n=.707106781,s=0,r=.707106781):(s=Math.sqrt(C),n=I/s,r=nt/s):P<.01?(n=.707106781,s=.707106781,r=0):(r=Math.sqrt(P),n=z/r,s=nt/r),this.set(n,s,r,e),this}let T=Math.sqrt((p-y)*(p-y)+(f-v)*(f-v)+(m-u)*(m-u));return Math.abs(T)<.001&&(T=1),this.x=(p-y)/T,this.y=(f-v)/T,this.z=(m-u)/T,this.w=Math.acos((h+d+x-1)/2),this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this.w=Math.max(t.w,Math.min(e.w,this.w)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this.w=Math.max(t,Math.min(e,this.w)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}},Lf=class extends pr{constructor(t=1,e=1,n={}){super(),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=1,this.scissor=new Fn(0,0,t,e),this.scissorTest=!1,this.viewport=new Fn(0,0,t,e);let s={width:t,height:e,depth:1};n.encoding!==void 0&&(dl("THREE.WebGLRenderTarget: option.encoding has been replaced by option.colorSpace."),n.colorSpace=n.encoding===To?kn:Bs),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:ms,depthBuffer:!0,stencilBuffer:!1,depthTexture:null,samples:0},n),this.texture=new As(s,n.mapping,n.wrapS,n.wrapT,n.magFilter,n.minFilter,n.format,n.type,n.anisotropy,n.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.flipY=!1,this.texture.generateMipmaps=n.generateMipmaps,this.texture.internalFormat=n.internalFormat,this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.depthTexture=n.depthTexture,this.samples=n.samples}setSize(t,e,n=1){(this.width!==t||this.height!==e||this.depth!==n)&&(this.width=t,this.height=e,this.depth=n,this.texture.image.width=t,this.texture.image.height=e,this.texture.image.depth=n,this.dispose()),this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.texture=t.texture.clone(),this.texture.isRenderTargetTexture=!0;let e=Object.assign({},t.texture.image);return this.texture.source=new Kc(e),this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this}dispose(){this.dispatchEvent({type:"dispose"})}},Ir=class extends Lf{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}},Qc=class extends As{constructor(t=null,e=1,n=1,s=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pi,this.minFilter=Pi,this.wrapR=Js,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var If=class extends As{constructor(t=null,e=1,n=1,s=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:s},this.magFilter=Pi,this.minFilter=Pi,this.wrapR=Js,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var xs=class{constructor(t=0,e=0,n=0,s=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=s}static slerpFlat(t,e,n,s,r,a,o){let l=n[s+0],h=n[s+1],u=n[s+2],f=n[s+3],m=r[a+0],d=r[a+1],y=r[a+2],v=r[a+3];if(o===0){t[e+0]=l,t[e+1]=h,t[e+2]=u,t[e+3]=f;return}if(o===1){t[e+0]=m,t[e+1]=d,t[e+2]=y,t[e+3]=v;return}if(f!==v||l!==m||h!==d||u!==y){let p=1-o,x=l*m+h*d+u*y+f*v,T=x>=0?1:-1,M=1-x*x;if(M>Number.EPSILON){let P=Math.sqrt(M),I=Math.atan2(P,x*T);p=Math.sin(p*I)/P,o=Math.sin(o*I)/P}let C=o*T;if(l=l*p+m*C,h=h*p+d*C,u=u*p+y*C,f=f*p+v*C,p===1-o){let P=1/Math.sqrt(l*l+h*h+u*u+f*f);l*=P,h*=P,u*=P,f*=P}}t[e]=l,t[e+1]=h,t[e+2]=u,t[e+3]=f}static multiplyQuaternionsFlat(t,e,n,s,r,a){let o=n[s],l=n[s+1],h=n[s+2],u=n[s+3],f=r[a],m=r[a+1],d=r[a+2],y=r[a+3];return t[e]=o*y+u*f+l*d-h*m,t[e+1]=l*y+u*m+h*f-o*d,t[e+2]=h*y+u*d+o*m-l*f,t[e+3]=u*y-o*f-l*m-h*d,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,s){return this._x=t,this._y=e,this._z=n,this._w=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){let n=t._x,s=t._y,r=t._z,a=t._order,o=Math.cos,l=Math.sin,h=o(n/2),u=o(s/2),f=o(r/2),m=l(n/2),d=l(s/2),y=l(r/2);switch(a){case"XYZ":this._x=m*u*f+h*d*y,this._y=h*d*f-m*u*y,this._z=h*u*y+m*d*f,this._w=h*u*f-m*d*y;break;case"YXZ":this._x=m*u*f+h*d*y,this._y=h*d*f-m*u*y,this._z=h*u*y-m*d*f,this._w=h*u*f+m*d*y;break;case"ZXY":this._x=m*u*f-h*d*y,this._y=h*d*f+m*u*y,this._z=h*u*y+m*d*f,this._w=h*u*f-m*d*y;break;case"ZYX":this._x=m*u*f-h*d*y,this._y=h*d*f+m*u*y,this._z=h*u*y-m*d*f,this._w=h*u*f+m*d*y;break;case"YZX":this._x=m*u*f+h*d*y,this._y=h*d*f+m*u*y,this._z=h*u*y-m*d*f,this._w=h*u*f-m*d*y;break;case"XZY":this._x=m*u*f-h*d*y,this._y=h*d*f-m*u*y,this._z=h*u*y+m*d*f,this._w=h*u*f+m*d*y;break;default:console.warn("THREE.Quaternion: .setFromEuler() encountered an unknown order: "+a)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){let n=e/2,s=Math.sin(n);return this._x=t.x*s,this._y=t.y*s,this._z=t.z*s,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){let e=t.elements,n=e[0],s=e[4],r=e[8],a=e[1],o=e[5],l=e[9],h=e[2],u=e[6],f=e[10],m=n+o+f;if(m>0){let d=.5/Math.sqrt(m+1);this._w=.25/d,this._x=(u-l)*d,this._y=(r-h)*d,this._z=(a-s)*d}else if(n>o&&n>f){let d=2*Math.sqrt(1+n-o-f);this._w=(u-l)/d,this._x=.25*d,this._y=(s+a)/d,this._z=(r+h)/d}else if(o>f){let d=2*Math.sqrt(1+o-n-f);this._w=(r-h)/d,this._x=(s+a)/d,this._y=.25*d,this._z=(l+u)/d}else{let d=2*Math.sqrt(1+f-n-o);this._w=(a-s)/d,this._x=(r+h)/d,this._y=(l+u)/d,this._z=.25*d}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<Number.EPSILON?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(Li(this.dot(t),-1,1)))}rotateTowards(t,e){let n=this.angleTo(t);if(n===0)return this;let s=Math.min(1,e/n);return this.slerp(t,s),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){let n=t._x,s=t._y,r=t._z,a=t._w,o=e._x,l=e._y,h=e._z,u=e._w;return this._x=n*u+a*o+s*h-r*l,this._y=s*u+a*l+r*o-n*h,this._z=r*u+a*h+n*l-s*o,this._w=a*u-n*o-s*l-r*h,this._onChangeCallback(),this}slerp(t,e){if(e===0)return this;if(e===1)return this.copy(t);let n=this._x,s=this._y,r=this._z,a=this._w,o=a*t._w+n*t._x+s*t._y+r*t._z;if(o<0?(this._w=-t._w,this._x=-t._x,this._y=-t._y,this._z=-t._z,o=-o):this.copy(t),o>=1)return this._w=a,this._x=n,this._y=s,this._z=r,this;let l=1-o*o;if(l<=Number.EPSILON){let d=1-e;return this._w=d*a+e*this._w,this._x=d*n+e*this._x,this._y=d*s+e*this._y,this._z=d*r+e*this._z,this.normalize(),this}let h=Math.sqrt(l),u=Math.atan2(h,o),f=Math.sin((1-e)*u)/h,m=Math.sin(e*u)/h;return this._w=a*f+this._w*m,this._x=n*f+this._x*m,this._y=s*f+this._y*m,this._z=r*f+this._z*m,this._onChangeCallback(),this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){let t=Math.random(),e=Math.sqrt(1-t),n=Math.sqrt(t),s=2*Math.PI*Math.random(),r=2*Math.PI*Math.random();return this.set(e*Math.cos(s),n*Math.sin(r),n*Math.cos(r),e*Math.sin(s))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}},X=class i{constructor(t=0,e=0,n=0){i.prototype.isVector3=!0,this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Gm.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Gm.setFromAxisAngle(t,e))}applyMatrix3(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[3]*n+r[6]*s,this.y=r[1]*e+r[4]*n+r[7]*s,this.z=r[2]*e+r[5]*n+r[8]*s,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){let e=this.x,n=this.y,s=this.z,r=t.elements,a=1/(r[3]*e+r[7]*n+r[11]*s+r[15]);return this.x=(r[0]*e+r[4]*n+r[8]*s+r[12])*a,this.y=(r[1]*e+r[5]*n+r[9]*s+r[13])*a,this.z=(r[2]*e+r[6]*n+r[10]*s+r[14])*a,this}applyQuaternion(t){let e=this.x,n=this.y,s=this.z,r=t.x,a=t.y,o=t.z,l=t.w,h=2*(a*s-o*n),u=2*(o*e-r*s),f=2*(r*n-a*e);return this.x=e+l*h+a*f-o*u,this.y=n+l*u+o*h-r*f,this.z=s+l*f+r*u-a*h,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){let e=this.x,n=this.y,s=this.z,r=t.elements;return this.x=r[0]*e+r[4]*n+r[8]*s,this.y=r[1]*e+r[5]*n+r[9]*s,this.z=r[2]*e+r[6]*n+r[10]*s,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=Math.max(t.x,Math.min(e.x,this.x)),this.y=Math.max(t.y,Math.min(e.y,this.y)),this.z=Math.max(t.z,Math.min(e.z,this.z)),this}clampScalar(t,e){return this.x=Math.max(t,Math.min(e,this.x)),this.y=Math.max(t,Math.min(e,this.y)),this.z=Math.max(t,Math.min(e,this.z)),this}clampLength(t,e){let n=this.length();return this.divideScalar(n||1).multiplyScalar(Math.max(t,Math.min(e,n)))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){let n=t.x,s=t.y,r=t.z,a=e.x,o=e.y,l=e.z;return this.x=s*l-r*o,this.y=r*a-n*l,this.z=n*o-s*a,this}projectOnVector(t){let e=t.lengthSq();if(e===0)return this.set(0,0,0);let n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return Ku.copy(this).projectOnVector(t),this.sub(Ku)}reflect(t){return this.sub(Ku.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){let e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;let n=this.dot(t)/e;return Math.acos(Li(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){let e=this.x-t.x,n=this.y-t.y,s=this.z-t.z;return e*e+n*n+s*s}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){let s=Math.sin(e)*t;return this.x=s*Math.sin(n),this.y=Math.cos(e)*t,this.z=s*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){let e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){let e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),s=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=s,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){let t=(Math.random()-.5)*2,e=Math.random()*Math.PI*2,n=Math.sqrt(1-t**2);return this.x=n*Math.cos(e),this.y=n*Math.sin(e),this.z=t,this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}},Ku=new X,Gm=new xs,es=class{constructor(t=new X(1/0,1/0,1/0),e=new X(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(qs.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(qs.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){let n=qs.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);let n=t.geometry;if(n!==void 0){let r=n.getAttribute("position");if(e===!0&&r!==void 0&&t.isInstancedMesh!==!0)for(let a=0,o=r.count;a<o;a++)t.isMesh===!0?t.getVertexPosition(a,qs):qs.fromBufferAttribute(r,a),qs.applyMatrix4(t.matrixWorld),this.expandByPoint(qs);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),pc.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),pc.copy(n.boundingBox)),pc.applyMatrix4(t.matrixWorld),this.union(pc)}let s=t.children;for(let r=0,a=s.length;r<a;r++)this.expandByObject(s[r],e);return this}containsPoint(t){return!(t.x<this.min.x||t.x>this.max.x||t.y<this.min.y||t.y>this.max.y||t.z<this.min.z||t.z>this.max.z)}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return!(t.max.x<this.min.x||t.min.x>this.max.x||t.max.y<this.min.y||t.min.y>this.max.y||t.max.z<this.min.z||t.min.z>this.max.z)}intersectsSphere(t){return this.clampPoint(t.center,qs),qs.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(rl),mc.subVectors(this.max,rl),ta.subVectors(t.a,rl),ea.subVectors(t.b,rl),na.subVectors(t.c,rl),Xr.subVectors(ea,ta),qr.subVectors(na,ea),xo.subVectors(ta,na);let e=[0,-Xr.z,Xr.y,0,-qr.z,qr.y,0,-xo.z,xo.y,Xr.z,0,-Xr.x,qr.z,0,-qr.x,xo.z,0,-xo.x,-Xr.y,Xr.x,0,-qr.y,qr.x,0,-xo.y,xo.x,0];return!Qu(e,ta,ea,na,mc)||(e=[1,0,0,0,1,0,0,0,1],!Qu(e,ta,ea,na,mc))?!1:(gc.crossVectors(Xr,qr),e=[gc.x,gc.y,gc.z],Qu(e,ta,ea,na,mc))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,qs).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(qs).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Er[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Er[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Er[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Er[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Er[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Er[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Er[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Er[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Er),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}},Er=[new X,new X,new X,new X,new X,new X,new X,new X],qs=new X,pc=new es,ta=new X,ea=new X,na=new X,Xr=new X,qr=new X,xo=new X,rl=new X,mc=new X,gc=new X,yo=new X;function Qu(i,t,e,n,s){for(let r=0,a=i.length-3;r<=a;r+=3){yo.fromArray(i,r);let o=s.x*Math.abs(yo.x)+s.y*Math.abs(yo.y)+s.z*Math.abs(yo.z),l=t.dot(yo),h=e.dot(yo),u=n.dot(yo);if(Math.max(-Math.max(l,h,u),Math.min(l,h,u))>o)return!1}return!0}var Py=new es,ol=new X,tf=new X,ys=class{constructor(t=new X,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){let n=this.center;e!==void 0?n.copy(e):Py.setFromPoints(t).getCenter(n);let s=0;for(let r=0,a=t.length;r<a;r++)s=Math.max(s,n.distanceToSquared(t[r]));return this.radius=Math.sqrt(s),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){let e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){let n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;ol.subVectors(t,this.center);let e=ol.lengthSq();if(e>this.radius*this.radius){let n=Math.sqrt(e),s=(n-this.radius)*.5;this.center.addScaledVector(ol,s/n),this.radius+=s}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(tf.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(ol.copy(t.center).add(tf)),this.expandByPoint(ol.copy(t.center).sub(tf))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}},wr=new X,ef=new X,xc=new X,Yr=new X,nf=new X,yc=new X,sf=new X,Ao=class{constructor(t=new X,e=new X(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,wr)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);let n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){let e=wr.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(wr.copy(this.origin).addScaledVector(this.direction,e),wr.distanceToSquared(t))}distanceSqToSegment(t,e,n,s){ef.copy(t).add(e).multiplyScalar(.5),xc.copy(e).sub(t).normalize(),Yr.copy(this.origin).sub(ef);let r=t.distanceTo(e)*.5,a=-this.direction.dot(xc),o=Yr.dot(this.direction),l=-Yr.dot(xc),h=Yr.lengthSq(),u=Math.abs(1-a*a),f,m,d,y;if(u>0)if(f=a*l-o,m=a*o-l,y=r*u,f>=0)if(m>=-y)if(m<=y){let v=1/u;f*=v,m*=v,d=f*(f+a*m+2*o)+m*(a*f+m+2*l)+h}else m=r,f=Math.max(0,-(a*m+o)),d=-f*f+m*(m+2*l)+h;else m=-r,f=Math.max(0,-(a*m+o)),d=-f*f+m*(m+2*l)+h;else m<=-y?(f=Math.max(0,-(-a*r+o)),m=f>0?-r:Math.min(Math.max(-r,-l),r),d=-f*f+m*(m+2*l)+h):m<=y?(f=0,m=Math.min(Math.max(-r,-l),r),d=m*(m+2*l)+h):(f=Math.max(0,-(a*r+o)),m=f>0?r:Math.min(Math.max(-r,-l),r),d=-f*f+m*(m+2*l)+h);else m=a>0?-r:r,f=Math.max(0,-(a*m+o)),d=-f*f+m*(m+2*l)+h;return n&&n.copy(this.origin).addScaledVector(this.direction,f),s&&s.copy(ef).addScaledVector(xc,m),d}intersectSphere(t,e){wr.subVectors(t.center,this.origin);let n=wr.dot(this.direction),s=wr.dot(wr)-n*n,r=t.radius*t.radius;if(s>r)return null;let a=Math.sqrt(r-s),o=n-a,l=n+a;return l<0?null:o<0?this.at(l,e):this.at(o,e)}intersectsSphere(t){return this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){let e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;let n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){let n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){let e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,s,r,a,o,l,h=1/this.direction.x,u=1/this.direction.y,f=1/this.direction.z,m=this.origin;return h>=0?(n=(t.min.x-m.x)*h,s=(t.max.x-m.x)*h):(n=(t.max.x-m.x)*h,s=(t.min.x-m.x)*h),u>=0?(r=(t.min.y-m.y)*u,a=(t.max.y-m.y)*u):(r=(t.max.y-m.y)*u,a=(t.min.y-m.y)*u),n>a||r>s||((r>n||isNaN(n))&&(n=r),(a<s||isNaN(s))&&(s=a),f>=0?(o=(t.min.z-m.z)*f,l=(t.max.z-m.z)*f):(o=(t.max.z-m.z)*f,l=(t.min.z-m.z)*f),n>l||o>s)||((o>n||n!==n)&&(n=o),(l<s||s!==s)&&(s=l),s<0)?null:this.at(n>=0?n:s,e)}intersectsBox(t){return this.intersectBox(t,wr)!==null}intersectTriangle(t,e,n,s,r){nf.subVectors(e,t),yc.subVectors(n,t),sf.crossVectors(nf,yc);let a=this.direction.dot(sf),o;if(a>0){if(s)return null;o=1}else if(a<0)o=-1,a=-a;else return null;Yr.subVectors(this.origin,t);let l=o*this.direction.dot(yc.crossVectors(Yr,yc));if(l<0)return null;let h=o*this.direction.dot(nf.cross(Yr));if(h<0||l+h>a)return null;let u=-o*Yr.dot(sf);return u<0?null:this.at(u/a,r)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}},Nn=class i{constructor(t,e,n,s,r,a,o,l,h,u,f,m,d,y,v,p){i.prototype.isMatrix4=!0,this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,s,r,a,o,l,h,u,f,m,d,y,v,p)}set(t,e,n,s,r,a,o,l,h,u,f,m,d,y,v,p){let x=this.elements;return x[0]=t,x[4]=e,x[8]=n,x[12]=s,x[1]=r,x[5]=a,x[9]=o,x[13]=l,x[2]=h,x[6]=u,x[10]=f,x[14]=m,x[3]=d,x[7]=y,x[11]=v,x[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new i().fromArray(this.elements)}copy(t){let e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){let e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){let e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){let e=this.elements,n=t.elements,s=1/ia.setFromMatrixColumn(t,0).length(),r=1/ia.setFromMatrixColumn(t,1).length(),a=1/ia.setFromMatrixColumn(t,2).length();return e[0]=n[0]*s,e[1]=n[1]*s,e[2]=n[2]*s,e[3]=0,e[4]=n[4]*r,e[5]=n[5]*r,e[6]=n[6]*r,e[7]=0,e[8]=n[8]*a,e[9]=n[9]*a,e[10]=n[10]*a,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){let e=this.elements,n=t.x,s=t.y,r=t.z,a=Math.cos(n),o=Math.sin(n),l=Math.cos(s),h=Math.sin(s),u=Math.cos(r),f=Math.sin(r);if(t.order==="XYZ"){let m=a*u,d=a*f,y=o*u,v=o*f;e[0]=l*u,e[4]=-l*f,e[8]=h,e[1]=d+y*h,e[5]=m-v*h,e[9]=-o*l,e[2]=v-m*h,e[6]=y+d*h,e[10]=a*l}else if(t.order==="YXZ"){let m=l*u,d=l*f,y=h*u,v=h*f;e[0]=m+v*o,e[4]=y*o-d,e[8]=a*h,e[1]=a*f,e[5]=a*u,e[9]=-o,e[2]=d*o-y,e[6]=v+m*o,e[10]=a*l}else if(t.order==="ZXY"){let m=l*u,d=l*f,y=h*u,v=h*f;e[0]=m-v*o,e[4]=-a*f,e[8]=y+d*o,e[1]=d+y*o,e[5]=a*u,e[9]=v-m*o,e[2]=-a*h,e[6]=o,e[10]=a*l}else if(t.order==="ZYX"){let m=a*u,d=a*f,y=o*u,v=o*f;e[0]=l*u,e[4]=y*h-d,e[8]=m*h+v,e[1]=l*f,e[5]=v*h+m,e[9]=d*h-y,e[2]=-h,e[6]=o*l,e[10]=a*l}else if(t.order==="YZX"){let m=a*l,d=a*h,y=o*l,v=o*h;e[0]=l*u,e[4]=v-m*f,e[8]=y*f+d,e[1]=f,e[5]=a*u,e[9]=-o*u,e[2]=-h*u,e[6]=d*f+y,e[10]=m-v*f}else if(t.order==="XZY"){let m=a*l,d=a*h,y=o*l,v=o*h;e[0]=l*u,e[4]=-f,e[8]=h*u,e[1]=m*f+v,e[5]=a*u,e[9]=d*f-y,e[2]=y*f-d,e[6]=o*u,e[10]=v*f+m}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Ly,t,Iy)}lookAt(t,e,n){let s=this.elements;return ws.subVectors(t,e),ws.lengthSq()===0&&(ws.z=1),ws.normalize(),$r.crossVectors(n,ws),$r.lengthSq()===0&&(Math.abs(n.z)===1?ws.x+=1e-4:ws.z+=1e-4,ws.normalize(),$r.crossVectors(n,ws)),$r.normalize(),_c.crossVectors(ws,$r),s[0]=$r.x,s[4]=_c.x,s[8]=ws.x,s[1]=$r.y,s[5]=_c.y,s[9]=ws.y,s[2]=$r.z,s[6]=_c.z,s[10]=ws.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){let n=t.elements,s=e.elements,r=this.elements,a=n[0],o=n[4],l=n[8],h=n[12],u=n[1],f=n[5],m=n[9],d=n[13],y=n[2],v=n[6],p=n[10],x=n[14],T=n[3],M=n[7],C=n[11],P=n[15],I=s[0],z=s[4],nt=s[8],R=s[12],w=s[1],at=s[5],wt=s[9],ce=s[13],et=s[2],ft=s[6],Rt=s[10],Xt=s[14],Qt=s[3],Lt=s[7],jt=s[11],fe=s[15];return r[0]=a*I+o*w+l*et+h*Qt,r[4]=a*z+o*at+l*ft+h*Lt,r[8]=a*nt+o*wt+l*Rt+h*jt,r[12]=a*R+o*ce+l*Xt+h*fe,r[1]=u*I+f*w+m*et+d*Qt,r[5]=u*z+f*at+m*ft+d*Lt,r[9]=u*nt+f*wt+m*Rt+d*jt,r[13]=u*R+f*ce+m*Xt+d*fe,r[2]=y*I+v*w+p*et+x*Qt,r[6]=y*z+v*at+p*ft+x*Lt,r[10]=y*nt+v*wt+p*Rt+x*jt,r[14]=y*R+v*ce+p*Xt+x*fe,r[3]=T*I+M*w+C*et+P*Qt,r[7]=T*z+M*at+C*ft+P*Lt,r[11]=T*nt+M*wt+C*Rt+P*jt,r[15]=T*R+M*ce+C*Xt+P*fe,this}multiplyScalar(t){let e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){let t=this.elements,e=t[0],n=t[4],s=t[8],r=t[12],a=t[1],o=t[5],l=t[9],h=t[13],u=t[2],f=t[6],m=t[10],d=t[14],y=t[3],v=t[7],p=t[11],x=t[15];return y*(+r*l*f-s*h*f-r*o*m+n*h*m+s*o*d-n*l*d)+v*(+e*l*d-e*h*m+r*a*m-s*a*d+s*h*u-r*l*u)+p*(+e*h*f-e*o*d-r*a*f+n*a*d+r*o*u-n*h*u)+x*(-s*o*u-e*l*f+e*o*m+s*a*f-n*a*m+n*l*u)}transpose(){let t=this.elements,e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){let s=this.elements;return t.isVector3?(s[12]=t.x,s[13]=t.y,s[14]=t.z):(s[12]=t,s[13]=e,s[14]=n),this}invert(){let t=this.elements,e=t[0],n=t[1],s=t[2],r=t[3],a=t[4],o=t[5],l=t[6],h=t[7],u=t[8],f=t[9],m=t[10],d=t[11],y=t[12],v=t[13],p=t[14],x=t[15],T=f*p*h-v*m*h+v*l*d-o*p*d-f*l*x+o*m*x,M=y*m*h-u*p*h-y*l*d+a*p*d+u*l*x-a*m*x,C=u*v*h-y*f*h+y*o*d-a*v*d-u*o*x+a*f*x,P=y*f*l-u*v*l-y*o*m+a*v*m+u*o*p-a*f*p,I=e*T+n*M+s*C+r*P;if(I===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);let z=1/I;return t[0]=T*z,t[1]=(v*m*r-f*p*r-v*s*d+n*p*d+f*s*x-n*m*x)*z,t[2]=(o*p*r-v*l*r+v*s*h-n*p*h-o*s*x+n*l*x)*z,t[3]=(f*l*r-o*m*r-f*s*h+n*m*h+o*s*d-n*l*d)*z,t[4]=M*z,t[5]=(u*p*r-y*m*r+y*s*d-e*p*d-u*s*x+e*m*x)*z,t[6]=(y*l*r-a*p*r-y*s*h+e*p*h+a*s*x-e*l*x)*z,t[7]=(a*m*r-u*l*r+u*s*h-e*m*h-a*s*d+e*l*d)*z,t[8]=C*z,t[9]=(y*f*r-u*v*r-y*n*d+e*v*d+u*n*x-e*f*x)*z,t[10]=(a*v*r-y*o*r+y*n*h-e*v*h-a*n*x+e*o*x)*z,t[11]=(u*o*r-a*f*r-u*n*h+e*f*h+a*n*d-e*o*d)*z,t[12]=P*z,t[13]=(u*v*s-y*f*s+y*n*m-e*v*m-u*n*p+e*f*p)*z,t[14]=(y*o*s-a*v*s-y*n*l+e*v*l+a*n*p-e*o*p)*z,t[15]=(a*f*s-u*o*s+u*n*l-e*f*l-a*n*m+e*o*m)*z,this}scale(t){let e=this.elements,n=t.x,s=t.y,r=t.z;return e[0]*=n,e[4]*=s,e[8]*=r,e[1]*=n,e[5]*=s,e[9]*=r,e[2]*=n,e[6]*=s,e[10]*=r,e[3]*=n,e[7]*=s,e[11]*=r,this}getMaxScaleOnAxis(){let t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],s=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,s))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){let e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){let e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){let n=Math.cos(e),s=Math.sin(e),r=1-n,a=t.x,o=t.y,l=t.z,h=r*a,u=r*o;return this.set(h*a+n,h*o-s*l,h*l+s*o,0,h*o+s*l,u*o+n,u*l-s*a,0,h*l-s*o,u*l+s*a,r*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,s,r,a){return this.set(1,n,r,0,t,1,a,0,e,s,1,0,0,0,0,1),this}compose(t,e,n){let s=this.elements,r=e._x,a=e._y,o=e._z,l=e._w,h=r+r,u=a+a,f=o+o,m=r*h,d=r*u,y=r*f,v=a*u,p=a*f,x=o*f,T=l*h,M=l*u,C=l*f,P=n.x,I=n.y,z=n.z;return s[0]=(1-(v+x))*P,s[1]=(d+C)*P,s[2]=(y-M)*P,s[3]=0,s[4]=(d-C)*I,s[5]=(1-(m+x))*I,s[6]=(p+T)*I,s[7]=0,s[8]=(y+M)*z,s[9]=(p-T)*z,s[10]=(1-(m+v))*z,s[11]=0,s[12]=t.x,s[13]=t.y,s[14]=t.z,s[15]=1,this}decompose(t,e,n){let s=this.elements,r=ia.set(s[0],s[1],s[2]).length(),a=ia.set(s[4],s[5],s[6]).length(),o=ia.set(s[8],s[9],s[10]).length();this.determinant()<0&&(r=-r),t.x=s[12],t.y=s[13],t.z=s[14],Ys.copy(this);let h=1/r,u=1/a,f=1/o;return Ys.elements[0]*=h,Ys.elements[1]*=h,Ys.elements[2]*=h,Ys.elements[4]*=u,Ys.elements[5]*=u,Ys.elements[6]*=u,Ys.elements[8]*=f,Ys.elements[9]*=f,Ys.elements[10]*=f,e.setFromRotationMatrix(Ys),n.x=r,n.y=a,n.z=o,this}makePerspective(t,e,n,s,r,a,o=Pr){let l=this.elements,h=2*r/(e-t),u=2*r/(n-s),f=(e+t)/(e-t),m=(n+s)/(n-s),d,y;if(o===Pr)d=-(a+r)/(a-r),y=-2*a*r/(a-r);else if(o===$c)d=-a/(a-r),y=-a*r/(a-r);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+o);return l[0]=h,l[4]=0,l[8]=f,l[12]=0,l[1]=0,l[5]=u,l[9]=m,l[13]=0,l[2]=0,l[6]=0,l[10]=d,l[14]=y,l[3]=0,l[7]=0,l[11]=-1,l[15]=0,this}makeOrthographic(t,e,n,s,r,a,o=Pr){let l=this.elements,h=1/(e-t),u=1/(n-s),f=1/(a-r),m=(e+t)*h,d=(n+s)*u,y,v;if(o===Pr)y=(a+r)*f,v=-2*f;else if(o===$c)y=r*f,v=-1*f;else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+o);return l[0]=2*h,l[4]=0,l[8]=0,l[12]=-m,l[1]=0,l[5]=2*u,l[9]=0,l[13]=-d,l[2]=0,l[6]=0,l[10]=v,l[14]=-y,l[3]=0,l[7]=0,l[11]=0,l[15]=1,this}equals(t){let e=this.elements,n=t.elements;for(let s=0;s<16;s++)if(e[s]!==n[s])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){let n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}},ia=new X,Ys=new Nn,Ly=new X(0,0,0),Iy=new X(1,1,1),$r=new X,_c=new X,ws=new X,Wm=new Nn,Xm=new xs,th=class i{constructor(t=0,e=0,n=0,s=i.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=s}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,s=this._order){return this._x=t,this._y=e,this._z=n,this._order=s,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){let s=t.elements,r=s[0],a=s[4],o=s[8],l=s[1],h=s[5],u=s[9],f=s[2],m=s[6],d=s[10];switch(e){case"XYZ":this._y=Math.asin(Li(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(-u,d),this._z=Math.atan2(-a,r)):(this._x=Math.atan2(m,h),this._z=0);break;case"YXZ":this._x=Math.asin(-Li(u,-1,1)),Math.abs(u)<.9999999?(this._y=Math.atan2(o,d),this._z=Math.atan2(l,h)):(this._y=Math.atan2(-f,r),this._z=0);break;case"ZXY":this._x=Math.asin(Li(m,-1,1)),Math.abs(m)<.9999999?(this._y=Math.atan2(-f,d),this._z=Math.atan2(-a,h)):(this._y=0,this._z=Math.atan2(l,r));break;case"ZYX":this._y=Math.asin(-Li(f,-1,1)),Math.abs(f)<.9999999?(this._x=Math.atan2(m,d),this._z=Math.atan2(l,r)):(this._x=0,this._z=Math.atan2(-a,h));break;case"YZX":this._z=Math.asin(Li(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-u,h),this._y=Math.atan2(-f,r)):(this._x=0,this._y=Math.atan2(o,d));break;case"XZY":this._z=Math.asin(-Li(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(m,h),this._y=Math.atan2(o,r)):(this._x=Math.atan2(-u,d),this._y=0);break;default:console.warn("THREE.Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Wm.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Wm,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xm.setFromEuler(this),this.setFromQuaternion(Xm,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}};th.DEFAULT_ORDER="XYZ";var vl=class{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}},Dy=0,qm=new X,sa=new xs,Tr=new Nn,vc=new X,al=new X,Uy=new X,Ny=new xs,Ym=new X(1,0,0),$m=new X(0,1,0),Zm=new X(0,0,1),Oy={type:"added"},Fy={type:"removed"},vi=class i extends pr{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:Dy++}),this.uuid=dr(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=i.DEFAULT_UP.clone();let t=new X,e=new th,n=new xs,s=new X(1,1,1);function r(){n.setFromEuler(e,!1)}function a(){e.setFromQuaternion(n,void 0,!1)}e._onChange(r),n._onChange(a),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:s},modelViewMatrix:{value:new Nn},normalMatrix:{value:new En}}),this.matrix=new Nn,this.matrixWorld=new Nn,this.matrixAutoUpdate=i.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=i.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new vl,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.userData={}}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return sa.setFromAxisAngle(t,e),this.quaternion.multiply(sa),this}rotateOnWorldAxis(t,e){return sa.setFromAxisAngle(t,e),this.quaternion.premultiply(sa),this}rotateX(t){return this.rotateOnAxis(Ym,t)}rotateY(t){return this.rotateOnAxis($m,t)}rotateZ(t){return this.rotateOnAxis(Zm,t)}translateOnAxis(t,e){return qm.copy(t).applyQuaternion(this.quaternion),this.position.add(qm.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ym,t)}translateY(t){return this.translateOnAxis($m,t)}translateZ(t){return this.translateOnAxis(Zm,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(Tr.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?vc.copy(t):vc.set(t,e,n);let s=this.parent;this.updateWorldMatrix(!0,!1),al.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?Tr.lookAt(al,vc,this.up):Tr.lookAt(vc,al,this.up),this.quaternion.setFromRotationMatrix(Tr),s&&(Tr.extractRotation(s.matrixWorld),sa.setFromRotationMatrix(Tr),this.quaternion.premultiply(sa.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(console.error("THREE.Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.parent!==null&&t.parent.remove(t),t.parent=this,this.children.push(t),t.dispatchEvent(Oy)):console.error("THREE.Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}let e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(Fy)),this}removeFromParent(){let t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),Tr.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),Tr.multiply(t.parent.matrixWorld)),t.applyMatrix4(Tr),this.add(t),t.updateWorldMatrix(!1,!0),this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,s=this.children.length;n<s;n++){let a=this.children[n].getObjectByProperty(t,e);if(a!==void 0)return a}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);let s=this.children;for(let r=0,a=s.length;r<a;r++)s[r].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(al,t,Uy),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(al,Ny,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);let e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);let e=this.children;for(let n=0,s=e.length;n<s;n++)e[n].traverseVisible(t)}traverseAncestors(t){let e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale),this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),this.matrixWorldNeedsUpdate=!1,t=!0);let e=this.children;for(let n=0,s=e.length;n<s;n++){let r=e[n];(r.matrixWorldAutoUpdate===!0||t===!0)&&r.updateMatrixWorld(t)}}updateWorldMatrix(t,e){let n=this.parent;if(t===!0&&n!==null&&n.matrixWorldAutoUpdate===!0&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix),e===!0){let s=this.children;for(let r=0,a=s.length;r<a;r++){let o=s[r];o.matrixWorldAutoUpdate===!0&&o.updateWorldMatrix(!1,!0)}}}toJSON(t){let e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.6,type:"Object",generator:"Object3D.toJSON"});let s={};s.uuid=this.uuid,s.type=this.type,this.name!==""&&(s.name=this.name),this.castShadow===!0&&(s.castShadow=!0),this.receiveShadow===!0&&(s.receiveShadow=!0),this.visible===!1&&(s.visible=!1),this.frustumCulled===!1&&(s.frustumCulled=!1),this.renderOrder!==0&&(s.renderOrder=this.renderOrder),Object.keys(this.userData).length>0&&(s.userData=this.userData),s.layers=this.layers.mask,s.matrix=this.matrix.toArray(),s.up=this.up.toArray(),this.matrixAutoUpdate===!1&&(s.matrixAutoUpdate=!1),this.isInstancedMesh&&(s.type="InstancedMesh",s.count=this.count,s.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(s.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(s.type="BatchedMesh",s.perObjectFrustumCulled=this.perObjectFrustumCulled,s.sortObjects=this.sortObjects,s.drawRanges=this._drawRanges,s.reservedRanges=this._reservedRanges,s.visibility=this._visibility,s.active=this._active,s.bounds=this._bounds.map(o=>({boxInitialized:o.boxInitialized,boxMin:o.box.min.toArray(),boxMax:o.box.max.toArray(),sphereInitialized:o.sphereInitialized,sphereRadius:o.sphere.radius,sphereCenter:o.sphere.center.toArray()})),s.maxGeometryCount=this._maxGeometryCount,s.maxVertexCount=this._maxVertexCount,s.maxIndexCount=this._maxIndexCount,s.geometryInitialized=this._geometryInitialized,s.geometryCount=this._geometryCount,s.matricesTexture=this._matricesTexture.toJSON(t),this.boundingSphere!==null&&(s.boundingSphere={center:s.boundingSphere.center.toArray(),radius:s.boundingSphere.radius}),this.boundingBox!==null&&(s.boundingBox={min:s.boundingBox.min.toArray(),max:s.boundingBox.max.toArray()}));function r(o,l){return o[l.uuid]===void 0&&(o[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?s.background=this.background.toJSON():this.background.isTexture&&(s.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(s.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){s.geometry=r(t.geometries,this.geometry);let o=this.geometry.parameters;if(o!==void 0&&o.shapes!==void 0){let l=o.shapes;if(Array.isArray(l))for(let h=0,u=l.length;h<u;h++){let f=l[h];r(t.shapes,f)}else r(t.shapes,l)}}if(this.isSkinnedMesh&&(s.bindMode=this.bindMode,s.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(r(t.skeletons,this.skeleton),s.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){let o=[];for(let l=0,h=this.material.length;l<h;l++)o.push(r(t.materials,this.material[l]));s.material=o}else s.material=r(t.materials,this.material);if(this.children.length>0){s.children=[];for(let o=0;o<this.children.length;o++)s.children.push(this.children[o].toJSON(t).object)}if(this.animations.length>0){s.animations=[];for(let o=0;o<this.animations.length;o++){let l=this.animations[o];s.animations.push(r(t.animations,l))}}if(e){let o=a(t.geometries),l=a(t.materials),h=a(t.textures),u=a(t.images),f=a(t.shapes),m=a(t.skeletons),d=a(t.animations),y=a(t.nodes);o.length>0&&(n.geometries=o),l.length>0&&(n.materials=l),h.length>0&&(n.textures=h),u.length>0&&(n.images=u),f.length>0&&(n.shapes=f),m.length>0&&(n.skeletons=m),d.length>0&&(n.animations=d),y.length>0&&(n.nodes=y)}return n.object=s,n;function a(o){let l=[];for(let h in o){let u=o[h];delete u.metadata,l.push(u)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){let s=t.children[n];this.add(s.clone())}return this}};vi.DEFAULT_UP=new X(0,1,0);vi.DEFAULT_MATRIX_AUTO_UPDATE=!0;vi.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;var $s=new X,Ar=new X,rf=new X,Rr=new X,ra=new X,oa=new X,Jm=new X,of=new X,af=new X,lf=new X,Mc=!1,ma=class i{constructor(t=new X,e=new X,n=new X){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,s){s.subVectors(n,e),$s.subVectors(t,e),s.cross($s);let r=s.lengthSq();return r>0?s.multiplyScalar(1/Math.sqrt(r)):s.set(0,0,0)}static getBarycoord(t,e,n,s,r){$s.subVectors(s,e),Ar.subVectors(n,e),rf.subVectors(t,e);let a=$s.dot($s),o=$s.dot(Ar),l=$s.dot(rf),h=Ar.dot(Ar),u=Ar.dot(rf),f=a*h-o*o;if(f===0)return r.set(0,0,0),null;let m=1/f,d=(h*l-o*u)*m,y=(a*u-o*l)*m;return r.set(1-d-y,y,d)}static containsPoint(t,e,n,s){return this.getBarycoord(t,e,n,s,Rr)===null?!1:Rr.x>=0&&Rr.y>=0&&Rr.x+Rr.y<=1}static getUV(t,e,n,s,r,a,o,l){return Mc===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Mc=!0),this.getInterpolation(t,e,n,s,r,a,o,l)}static getInterpolation(t,e,n,s,r,a,o,l){return this.getBarycoord(t,e,n,s,Rr)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(r,Rr.x),l.addScaledVector(a,Rr.y),l.addScaledVector(o,Rr.z),l)}static isFrontFacing(t,e,n,s){return $s.subVectors(n,e),Ar.subVectors(t,e),$s.cross(Ar).dot(s)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,s){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[s]),this}setFromAttributeAndIndices(t,e,n,s){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,s),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return $s.subVectors(this.c,this.b),Ar.subVectors(this.a,this.b),$s.cross(Ar).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return i.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return i.getBarycoord(t,this.a,this.b,this.c,e)}getUV(t,e,n,s,r){return Mc===!1&&(console.warn("THREE.Triangle.getUV() has been renamed to THREE.Triangle.getInterpolation()."),Mc=!0),i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}getInterpolation(t,e,n,s,r){return i.getInterpolation(t,this.a,this.b,this.c,e,n,s,r)}containsPoint(t){return i.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return i.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){let n=this.a,s=this.b,r=this.c,a,o;ra.subVectors(s,n),oa.subVectors(r,n),of.subVectors(t,n);let l=ra.dot(of),h=oa.dot(of);if(l<=0&&h<=0)return e.copy(n);af.subVectors(t,s);let u=ra.dot(af),f=oa.dot(af);if(u>=0&&f<=u)return e.copy(s);let m=l*f-u*h;if(m<=0&&l>=0&&u<=0)return a=l/(l-u),e.copy(n).addScaledVector(ra,a);lf.subVectors(t,r);let d=ra.dot(lf),y=oa.dot(lf);if(y>=0&&d<=y)return e.copy(r);let v=d*h-l*y;if(v<=0&&h>=0&&y<=0)return o=h/(h-y),e.copy(n).addScaledVector(oa,o);let p=u*y-d*f;if(p<=0&&f-u>=0&&d-y>=0)return Jm.subVectors(r,s),o=(f-u)/(f-u+(d-y)),e.copy(s).addScaledVector(Jm,o);let x=1/(p+v+m);return a=v*x,o=m*x,e.copy(n).addScaledVector(ra,a).addScaledVector(oa,o)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}},j0={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Zr={h:0,s:0,l:0},bc={h:0,s:0,l:0};function cf(i,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?i+(t-i)*6*e:e<1/2?t:e<2/3?i+(t-i)*6*(2/3-e):i}var fn=class{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){let s=t;s&&s.isColor?this.copy(s):typeof s=="number"?this.setHex(s):typeof s=="string"&&this.setStyle(s)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=kn){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,Wn.toWorkingColorSpace(this,e),this}setRGB(t,e,n,s=Wn.workingColorSpace){return this.r=t,this.g=e,this.b=n,Wn.toWorkingColorSpace(this,s),this}setHSL(t,e,n,s=Wn.workingColorSpace){if(t=yd(t,1),e=Li(e,0,1),n=Li(n,0,1),e===0)this.r=this.g=this.b=n;else{let r=n<=.5?n*(1+e):n+e-n*e,a=2*n-r;this.r=cf(a,r,t+1/3),this.g=cf(a,r,t),this.b=cf(a,r,t-1/3)}return Wn.toWorkingColorSpace(this,s),this}setStyle(t,e=kn){function n(r){r!==void 0&&parseFloat(r)<1&&console.warn("THREE.Color: Alpha component of "+t+" will be ignored.")}let s;if(s=/^(\w+)\(([^\)]*)\)/.exec(t)){let r,a=s[1],o=s[2];switch(a){case"rgb":case"rgba":if(r=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(255,parseInt(r[1],10))/255,Math.min(255,parseInt(r[2],10))/255,Math.min(255,parseInt(r[3],10))/255,e);if(r=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setRGB(Math.min(100,parseInt(r[1],10))/100,Math.min(100,parseInt(r[2],10))/100,Math.min(100,parseInt(r[3],10))/100,e);break;case"hsl":case"hsla":if(r=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(o))return n(r[4]),this.setHSL(parseFloat(r[1])/360,parseFloat(r[2])/100,parseFloat(r[3])/100,e);break;default:console.warn("THREE.Color: Unknown color model "+t)}}else if(s=/^\#([A-Fa-f\d]+)$/.exec(t)){let r=s[1],a=r.length;if(a===3)return this.setRGB(parseInt(r.charAt(0),16)/15,parseInt(r.charAt(1),16)/15,parseInt(r.charAt(2),16)/15,e);if(a===6)return this.setHex(parseInt(r,16),e);console.warn("THREE.Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=kn){let n=j0[t.toLowerCase()];return n!==void 0?this.setHex(n,e):console.warn("THREE.Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=va(t.r),this.g=va(t.g),this.b=va(t.b),this}copyLinearToSRGB(t){return this.r=Ju(t.r),this.g=Ju(t.g),this.b=Ju(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=kn){return Wn.fromWorkingColorSpace(ts.copy(this),t),Math.round(Li(ts.r*255,0,255))*65536+Math.round(Li(ts.g*255,0,255))*256+Math.round(Li(ts.b*255,0,255))}getHexString(t=kn){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=Wn.workingColorSpace){Wn.fromWorkingColorSpace(ts.copy(this),e);let n=ts.r,s=ts.g,r=ts.b,a=Math.max(n,s,r),o=Math.min(n,s,r),l,h,u=(o+a)/2;if(o===a)l=0,h=0;else{let f=a-o;switch(h=u<=.5?f/(a+o):f/(2-a-o),a){case n:l=(s-r)/f+(s<r?6:0);break;case s:l=(r-n)/f+2;break;case r:l=(n-s)/f+4;break}l/=6}return t.h=l,t.s=h,t.l=u,t}getRGB(t,e=Wn.workingColorSpace){return Wn.fromWorkingColorSpace(ts.copy(this),e),t.r=ts.r,t.g=ts.g,t.b=ts.b,t}getStyle(t=kn){Wn.fromWorkingColorSpace(ts.copy(this),t);let e=ts.r,n=ts.g,s=ts.b;return t!==kn?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${s.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(s*255)})`}offsetHSL(t,e,n){return this.getHSL(Zr),this.setHSL(Zr.h+t,Zr.s+e,Zr.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Zr),t.getHSL(bc);let n=fl(Zr.h,bc.h,e),s=fl(Zr.s,bc.s,e),r=fl(Zr.l,bc.l,e);return this.setHSL(n,s,r),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){let e=this.r,n=this.g,s=this.b,r=t.elements;return this.r=r[0]*e+r[3]*n+r[6]*s,this.g=r[1]*e+r[4]*n+r[7]*s,this.b=r[2]*e+r[5]*n+r[8]*s,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}},ts=new fn;fn.NAMES=j0;var By=0,mr=class extends pr{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:By++}),this.uuid=dr(),this.name="",this.type="Material",this.blending=_a,this.side=eo,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=Sf,this.blendDst=Ef,this.blendEquation=bo,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new fn(0,0,0),this.blendAlpha=0,this.depthFunc=Vc,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fm,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=Ko,this.stencilZFail=Ko,this.stencilZPass=Ko,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBuild(){}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(let e in t){let n=t[e];if(n===void 0){console.warn(`THREE.Material: parameter '${e}' has value of undefined.`);continue}let s=this[e];if(s===void 0){console.warn(`THREE.Material: '${e}' is not a property of THREE.${this.type}.`);continue}s&&s.isColor?s.set(n):s&&s.isVector3&&n&&n.isVector3?s.copy(n):this[e]=n}}toJSON(t){let e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});let n={metadata:{version:4.6,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==_a&&(n.blending=this.blending),this.side!==eo&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==Sf&&(n.blendSrc=this.blendSrc),this.blendDst!==Ef&&(n.blendDst=this.blendDst),this.blendEquation!==bo&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Vc&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fm&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==Ko&&(n.stencilFail=this.stencilFail),this.stencilZFail!==Ko&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==Ko&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function s(r){let a=[];for(let o in r){let l=r[o];delete l.metadata,a.push(l)}return a}if(e){let r=s(t.textures),a=s(t.images);r.length>0&&(n.textures=r),a.length>0&&(n.images=a)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;let e=t.clippingPlanes,n=null;if(e!==null){let s=e.length;n=new Array(s);for(let r=0;r!==s;++r)n[r]=e[r].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}},os=class extends mr{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=pd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ai=new X,Sc=new de,Zn=class{constructor(t,e,n=!1){if(Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Rf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.gpuType=jr,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.BufferAttribute: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let s=0,r=this.itemSize;s<r;s++)this.array[t+s]=e.array[n+s];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)Sc.fromBufferAttribute(this,e),Sc.applyMatrix3(t),this.setXY(e,Sc.x,Sc.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.applyMatrix3(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.applyMatrix4(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.applyNormalMatrix(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)Ai.fromBufferAttribute(this,e),Ai.transformDirection(t),this.setXYZ(e,Ai.x,Ai.y,Ai.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=fr(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=Gn(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=fr(e,this.array)),e}setX(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=fr(e,this.array)),e}setY(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=fr(e,this.array)),e}setZ(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=fr(e,this.array)),e}setW(t,e){return this.normalized&&(e=Gn(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,s){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t*=this.itemSize,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array),r=Gn(r,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=s,this.array[t+3]=r,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){let t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Rf&&(t.usage=this.usage),t}};var eh=class extends Zn{constructor(t,e,n){super(new Uint16Array(t),e,n)}};var nh=class extends Zn{constructor(t,e,n){super(new Uint32Array(t),e,n)}};var Qe=class extends Zn{constructor(t,e,n){super(new Float32Array(t),e,n)}};var zy=0,Fs=new Nn,hf=new vi,aa=new X,Ts=new es,ll=new es,zi=new X,Ln=class i extends pr{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:zy++}),this.uuid=dr(),this.name="",this.type="BufferGeometry",this.index=null,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(J0(t)?nh:eh)(t,1):this.index=t,this}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){let e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);let n=this.attributes.normal;if(n!==void 0){let r=new En().getNormalMatrix(t);n.applyNormalMatrix(r),n.needsUpdate=!0}let s=this.attributes.tangent;return s!==void 0&&(s.transformDirection(t),s.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return Fs.makeRotationFromQuaternion(t),this.applyMatrix4(Fs),this}rotateX(t){return Fs.makeRotationX(t),this.applyMatrix4(Fs),this}rotateY(t){return Fs.makeRotationY(t),this.applyMatrix4(Fs),this}rotateZ(t){return Fs.makeRotationZ(t),this.applyMatrix4(Fs),this}translate(t,e,n){return Fs.makeTranslation(t,e,n),this.applyMatrix4(Fs),this}scale(t,e,n){return Fs.makeScale(t,e,n),this.applyMatrix4(Fs),this}lookAt(t){return hf.lookAt(t),hf.updateMatrix(),this.applyMatrix4(hf.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(aa).negate(),this.translate(aa.x,aa.y,aa.z),this}setFromPoints(t){let e=[];for(let n=0,s=t.length;n<s;n++){let r=t[n];e.push(r.x,r.y,r.z||0)}return this.setAttribute("position",new Qe(e,3)),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingBox.set(new X(-1/0,-1/0,-1/0),new X(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,s=e.length;n<s;n++){let r=e[n];Ts.setFromBufferAttribute(r),this.morphTargetsRelative?(zi.addVectors(this.boundingBox.min,Ts.min),this.boundingBox.expandByPoint(zi),zi.addVectors(this.boundingBox.max,Ts.max),this.boundingBox.expandByPoint(zi)):(this.boundingBox.expandByPoint(Ts.min),this.boundingBox.expandByPoint(Ts.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&console.error('THREE.BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ys);let t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){console.error('THREE.BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere. Alternatively set "mesh.frustumCulled" to "false".',this),this.boundingSphere.set(new X,1/0);return}if(t){let n=this.boundingSphere.center;if(Ts.setFromBufferAttribute(t),e)for(let r=0,a=e.length;r<a;r++){let o=e[r];ll.setFromBufferAttribute(o),this.morphTargetsRelative?(zi.addVectors(Ts.min,ll.min),Ts.expandByPoint(zi),zi.addVectors(Ts.max,ll.max),Ts.expandByPoint(zi)):(Ts.expandByPoint(ll.min),Ts.expandByPoint(ll.max))}Ts.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)zi.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(zi));if(e)for(let r=0,a=e.length;r<a;r++){let o=e[r],l=this.morphTargetsRelative;for(let h=0,u=o.count;h<u;h++)zi.fromBufferAttribute(o,h),l&&(aa.fromBufferAttribute(t,h),zi.add(aa)),s=Math.max(s,n.distanceToSquared(zi))}this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error('THREE.BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){let t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){console.error("THREE.BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}let n=t.array,s=e.position.array,r=e.normal.array,a=e.uv.array,o=s.length/3;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Zn(new Float32Array(4*o),4));let l=this.getAttribute("tangent").array,h=[],u=[];for(let w=0;w<o;w++)h[w]=new X,u[w]=new X;let f=new X,m=new X,d=new X,y=new de,v=new de,p=new de,x=new X,T=new X;function M(w,at,wt){f.fromArray(s,w*3),m.fromArray(s,at*3),d.fromArray(s,wt*3),y.fromArray(a,w*2),v.fromArray(a,at*2),p.fromArray(a,wt*2),m.sub(f),d.sub(f),v.sub(y),p.sub(y);let ce=1/(v.x*p.y-p.x*v.y);isFinite(ce)&&(x.copy(m).multiplyScalar(p.y).addScaledVector(d,-v.y).multiplyScalar(ce),T.copy(d).multiplyScalar(v.x).addScaledVector(m,-p.x).multiplyScalar(ce),h[w].add(x),h[at].add(x),h[wt].add(x),u[w].add(T),u[at].add(T),u[wt].add(T))}let C=this.groups;C.length===0&&(C=[{start:0,count:n.length}]);for(let w=0,at=C.length;w<at;++w){let wt=C[w],ce=wt.start,et=wt.count;for(let ft=ce,Rt=ce+et;ft<Rt;ft+=3)M(n[ft+0],n[ft+1],n[ft+2])}let P=new X,I=new X,z=new X,nt=new X;function R(w){z.fromArray(r,w*3),nt.copy(z);let at=h[w];P.copy(at),P.sub(z.multiplyScalar(z.dot(at))).normalize(),I.crossVectors(nt,at);let ce=I.dot(u[w])<0?-1:1;l[w*4]=P.x,l[w*4+1]=P.y,l[w*4+2]=P.z,l[w*4+3]=ce}for(let w=0,at=C.length;w<at;++w){let wt=C[w],ce=wt.start,et=wt.count;for(let ft=ce,Rt=ce+et;ft<Rt;ft+=3)R(n[ft+0]),R(n[ft+1]),R(n[ft+2])}}computeVertexNormals(){let t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Zn(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let m=0,d=n.count;m<d;m++)n.setXYZ(m,0,0,0);let s=new X,r=new X,a=new X,o=new X,l=new X,h=new X,u=new X,f=new X;if(t)for(let m=0,d=t.count;m<d;m+=3){let y=t.getX(m+0),v=t.getX(m+1),p=t.getX(m+2);s.fromBufferAttribute(e,y),r.fromBufferAttribute(e,v),a.fromBufferAttribute(e,p),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),o.fromBufferAttribute(n,y),l.fromBufferAttribute(n,v),h.fromBufferAttribute(n,p),o.add(u),l.add(u),h.add(u),n.setXYZ(y,o.x,o.y,o.z),n.setXYZ(v,l.x,l.y,l.z),n.setXYZ(p,h.x,h.y,h.z)}else for(let m=0,d=e.count;m<d;m+=3)s.fromBufferAttribute(e,m+0),r.fromBufferAttribute(e,m+1),a.fromBufferAttribute(e,m+2),u.subVectors(a,r),f.subVectors(s,r),u.cross(f),n.setXYZ(m+0,u.x,u.y,u.z),n.setXYZ(m+1,u.x,u.y,u.z),n.setXYZ(m+2,u.x,u.y,u.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){let t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)zi.fromBufferAttribute(t,e),zi.normalize(),t.setXYZ(e,zi.x,zi.y,zi.z)}toNonIndexed(){function t(o,l){let h=o.array,u=o.itemSize,f=o.normalized,m=new h.constructor(l.length*u),d=0,y=0;for(let v=0,p=l.length;v<p;v++){o.isInterleavedBufferAttribute?d=l[v]*o.data.stride+o.offset:d=l[v]*u;for(let x=0;x<u;x++)m[y++]=h[d++]}return new Zn(m,u,f)}if(this.index===null)return console.warn("THREE.BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;let e=new i,n=this.index.array,s=this.attributes;for(let o in s){let l=s[o],h=t(l,n);e.setAttribute(o,h)}let r=this.morphAttributes;for(let o in r){let l=[],h=r[o];for(let u=0,f=h.length;u<f;u++){let m=h[u],d=t(m,n);l.push(d)}e.morphAttributes[o]=l}e.morphTargetsRelative=this.morphTargetsRelative;let a=this.groups;for(let o=0,l=a.length;o<l;o++){let h=a[o];e.addGroup(h.start,h.count,h.materialIndex)}return e}toJSON(){let t={metadata:{version:4.6,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){let l=this.parameters;for(let h in l)l[h]!==void 0&&(t[h]=l[h]);return t}t.data={attributes:{}};let e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});let n=this.attributes;for(let l in n){let h=n[l];t.data.attributes[l]=h.toJSON(t.data)}let s={},r=!1;for(let l in this.morphAttributes){let h=this.morphAttributes[l],u=[];for(let f=0,m=h.length;f<m;f++){let d=h[f];u.push(d.toJSON(t.data))}u.length>0&&(s[l]=u,r=!0)}r&&(t.data.morphAttributes=s,t.data.morphTargetsRelative=this.morphTargetsRelative);let a=this.groups;a.length>0&&(t.data.groups=JSON.parse(JSON.stringify(a)));let o=this.boundingSphere;return o!==null&&(t.data.boundingSphere={center:o.center.toArray(),radius:o.radius}),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;let e={};this.name=t.name;let n=t.index;n!==null&&this.setIndex(n.clone(e));let s=t.attributes;for(let h in s){let u=s[h];this.setAttribute(h,u.clone(e))}let r=t.morphAttributes;for(let h in r){let u=[],f=r[h];for(let m=0,d=f.length;m<d;m++)u.push(f[m].clone(e));this.morphAttributes[h]=u}this.morphTargetsRelative=t.morphTargetsRelative;let a=t.groups;for(let h=0,u=a.length;h<u;h++){let f=a[h];this.addGroup(f.start,f.count,f.materialIndex)}let o=t.boundingBox;o!==null&&(this.boundingBox=o.clone());let l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}},jm=new Nn,_o=new Ao,Ec=new ys,Km=new X,la=new X,ca=new X,ha=new X,uf=new X,wc=new X,Tc=new de,Ac=new de,Rc=new de,Qm=new X,t0=new X,e0=new X,Cc=new X,Pc=new X,Je=class extends vi{constructor(t=new Ln,e=new os){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}getVertexPosition(t,e){let n=this.geometry,s=n.attributes.position,r=n.morphAttributes.position,a=n.morphTargetsRelative;e.fromBufferAttribute(s,t);let o=this.morphTargetInfluences;if(r&&o){wc.set(0,0,0);for(let l=0,h=r.length;l<h;l++){let u=o[l],f=r[l];u!==0&&(uf.fromBufferAttribute(f,t),a?wc.addScaledVector(uf,u):wc.addScaledVector(uf.sub(e),u))}e.add(wc)}return e}raycast(t,e){let n=this.geometry,s=this.material,r=this.matrixWorld;s!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),Ec.copy(n.boundingSphere),Ec.applyMatrix4(r),_o.copy(t.ray).recast(t.near),!(Ec.containsPoint(_o.origin)===!1&&(_o.intersectSphere(Ec,Km)===null||_o.origin.distanceToSquared(Km)>(t.far-t.near)**2))&&(jm.copy(r).invert(),_o.copy(t.ray).applyMatrix4(jm),!(n.boundingBox!==null&&_o.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,_o)))}_computeIntersections(t,e,n){let s,r=this.geometry,a=this.material,o=r.index,l=r.attributes.position,h=r.attributes.uv,u=r.attributes.uv1,f=r.attributes.normal,m=r.groups,d=r.drawRange;if(o!==null)if(Array.isArray(a))for(let y=0,v=m.length;y<v;y++){let p=m[y],x=a[p.materialIndex],T=Math.max(p.start,d.start),M=Math.min(o.count,Math.min(p.start+p.count,d.start+d.count));for(let C=T,P=M;C<P;C+=3){let I=o.getX(C),z=o.getX(C+1),nt=o.getX(C+2);s=Lc(this,x,t,n,h,u,f,I,z,nt),s&&(s.faceIndex=Math.floor(C/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),v=Math.min(o.count,d.start+d.count);for(let p=y,x=v;p<x;p+=3){let T=o.getX(p),M=o.getX(p+1),C=o.getX(p+2);s=Lc(this,a,t,n,h,u,f,T,M,C),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}else if(l!==void 0)if(Array.isArray(a))for(let y=0,v=m.length;y<v;y++){let p=m[y],x=a[p.materialIndex],T=Math.max(p.start,d.start),M=Math.min(l.count,Math.min(p.start+p.count,d.start+d.count));for(let C=T,P=M;C<P;C+=3){let I=C,z=C+1,nt=C+2;s=Lc(this,x,t,n,h,u,f,I,z,nt),s&&(s.faceIndex=Math.floor(C/3),s.face.materialIndex=p.materialIndex,e.push(s))}}else{let y=Math.max(0,d.start),v=Math.min(l.count,d.start+d.count);for(let p=y,x=v;p<x;p+=3){let T=p,M=p+1,C=p+2;s=Lc(this,a,t,n,h,u,f,T,M,C),s&&(s.faceIndex=Math.floor(p/3),e.push(s))}}}};function ky(i,t,e,n,s,r,a,o){let l;if(t.side===gs?l=n.intersectTriangle(a,r,s,!0,o):l=n.intersectTriangle(s,r,a,t.side===eo,o),l===null)return null;Pc.copy(o),Pc.applyMatrix4(i.matrixWorld);let h=e.ray.origin.distanceTo(Pc);return h<e.near||h>e.far?null:{distance:h,point:Pc.clone(),object:i}}function Lc(i,t,e,n,s,r,a,o,l,h){i.getVertexPosition(o,la),i.getVertexPosition(l,ca),i.getVertexPosition(h,ha);let u=ky(i,t,e,n,la,ca,ha,Cc);if(u){s&&(Tc.fromBufferAttribute(s,o),Ac.fromBufferAttribute(s,l),Rc.fromBufferAttribute(s,h),u.uv=ma.getInterpolation(Cc,la,ca,ha,Tc,Ac,Rc,new de)),r&&(Tc.fromBufferAttribute(r,o),Ac.fromBufferAttribute(r,l),Rc.fromBufferAttribute(r,h),u.uv1=ma.getInterpolation(Cc,la,ca,ha,Tc,Ac,Rc,new de),u.uv2=u.uv1),a&&(Qm.fromBufferAttribute(a,o),t0.fromBufferAttribute(a,l),e0.fromBufferAttribute(a,h),u.normal=ma.getInterpolation(Cc,la,ca,ha,Qm,t0,e0,new X),u.normal.dot(n.direction)>0&&u.normal.multiplyScalar(-1));let f={a:o,b:l,c:h,normal:new X,materialIndex:0};ma.getNormal(la,ca,ha,f.normal),u.face=f}return u}var Ri=class i extends Ln{constructor(t=1,e=1,n=1,s=1,r=1,a=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:s,heightSegments:r,depthSegments:a};let o=this;s=Math.floor(s),r=Math.floor(r),a=Math.floor(a);let l=[],h=[],u=[],f=[],m=0,d=0;y("z","y","x",-1,-1,n,e,t,a,r,0),y("z","y","x",1,-1,n,e,-t,a,r,1),y("x","z","y",1,1,t,n,e,s,a,2),y("x","z","y",1,-1,t,n,-e,s,a,3),y("x","y","z",1,-1,t,e,n,s,r,4),y("x","y","z",-1,-1,t,e,-n,s,r,5),this.setIndex(l),this.setAttribute("position",new Qe(h,3)),this.setAttribute("normal",new Qe(u,3)),this.setAttribute("uv",new Qe(f,2));function y(v,p,x,T,M,C,P,I,z,nt,R){let w=C/z,at=P/nt,wt=C/2,ce=P/2,et=I/2,ft=z+1,Rt=nt+1,Xt=0,Qt=0,Lt=new X;for(let jt=0;jt<Rt;jt++){let fe=jt*at-ce;for(let we=0;we<ft;we++){let Ct=we*w-wt;Lt[v]=Ct*T,Lt[p]=fe*M,Lt[x]=et,h.push(Lt.x,Lt.y,Lt.z),Lt[v]=0,Lt[p]=0,Lt[x]=I>0?1:-1,u.push(Lt.x,Lt.y,Lt.z),f.push(we/z),f.push(1-jt/nt),Xt+=1}}for(let jt=0;jt<nt;jt++)for(let fe=0;fe<z;fe++){let we=m+fe+ft*jt,Ct=m+fe+ft*(jt+1),It=m+(fe+1)+ft*(jt+1),se=m+(fe+1)+ft*jt;l.push(we,Ct,se),l.push(Ct,It,se),Qt+=6}o.addGroup(d,Qt,R),d+=Qt,m+=Xt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}};function wa(i){let t={};for(let e in i){t[e]={};for(let n in i[e]){let s=i[e][n];s&&(s.isColor||s.isMatrix3||s.isMatrix4||s.isVector2||s.isVector3||s.isVector4||s.isTexture||s.isQuaternion)?s.isRenderTargetTexture?(console.warn("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=s.clone():Array.isArray(s)?t[e][n]=s.slice():t[e][n]=s}}return t}function ss(i){let t={};for(let e=0;e<i.length;e++){let n=wa(i[e]);for(let s in n)t[s]=n[s]}return t}function Hy(i){let t=[];for(let e=0;e<i.length;e++)t.push(i[e].clone());return t}function K0(i){return i.getRenderTarget()===null?i.outputColorSpace:Wn.workingColorSpace}var Bh={clone:wa,merge:ss},Vy=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,Gy=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`,Qs=class extends mr{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Vy,this.fragmentShader=Gy,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={derivatives:!1,fragDepth:!1,drawBuffers:!1,shaderTextureLOD:!1,clipCullDistance:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=wa(t.uniforms),this.uniformsGroups=Hy(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this}toJSON(t){let e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(let s in this.uniforms){let a=this.uniforms[s].value;a&&a.isTexture?e.uniforms[s]={type:"t",value:a.toJSON(t).uuid}:a&&a.isColor?e.uniforms[s]={type:"c",value:a.getHex()}:a&&a.isVector2?e.uniforms[s]={type:"v2",value:a.toArray()}:a&&a.isVector3?e.uniforms[s]={type:"v3",value:a.toArray()}:a&&a.isVector4?e.uniforms[s]={type:"v4",value:a.toArray()}:a&&a.isMatrix3?e.uniforms[s]={type:"m3",value:a.toArray()}:a&&a.isMatrix4?e.uniforms[s]={type:"m4",value:a.toArray()}:e.uniforms[s]={value:a}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;let n={};for(let s in this.extensions)this.extensions[s]===!0&&(n[s]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}},ih=class extends vi{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Nn,this.projectionMatrix=new Nn,this.projectionMatrixInverse=new Nn,this.coordinateSystem=Pr}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorldInverse.copy(this.matrixWorld).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorldInverse.copy(this.matrixWorld).invert()}clone(){return new this.constructor().copy(this)}},Gi=class extends ih{constructor(t=50,e=1,n=.1,s=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=s,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){let e=.5*this.getFilmHeight()/t;this.fov=_l*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){let t=Math.tan(ul*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return _l*2*Math.atan(Math.tan(ul*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}setViewOffset(t,e,n,s,r,a){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=this.near,e=t*Math.tan(ul*.5*this.fov)/this.zoom,n=2*e,s=this.aspect*n,r=-.5*s,a=this.view;if(this.view!==null&&this.view.enabled){let l=a.fullWidth,h=a.fullHeight;r+=a.offsetX*s/l,e-=a.offsetY*n/h,s*=a.width/l,n*=a.height/h}let o=this.filmOffset;o!==0&&(r+=t*o/this.getFilmWidth()),this.projectionMatrix.makePerspective(r,r+s,e,e-n,t,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}},ua=-90,fa=1,Df=class extends vi{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;let s=new Gi(ua,fa,t,e);s.layers=this.layers,this.add(s);let r=new Gi(ua,fa,t,e);r.layers=this.layers,this.add(r);let a=new Gi(ua,fa,t,e);a.layers=this.layers,this.add(a);let o=new Gi(ua,fa,t,e);o.layers=this.layers,this.add(o);let l=new Gi(ua,fa,t,e);l.layers=this.layers,this.add(l);let h=new Gi(ua,fa,t,e);h.layers=this.layers,this.add(h)}updateCoordinateSystem(){let t=this.coordinateSystem,e=this.children.concat(),[n,s,r,a,o,l]=e;for(let h of e)this.remove(h);if(t===Pr)n.up.set(0,1,0),n.lookAt(1,0,0),s.up.set(0,1,0),s.lookAt(-1,0,0),r.up.set(0,0,-1),r.lookAt(0,1,0),a.up.set(0,0,1),a.lookAt(0,-1,0),o.up.set(0,1,0),o.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===$c)n.up.set(0,-1,0),n.lookAt(-1,0,0),s.up.set(0,-1,0),s.lookAt(1,0,0),r.up.set(0,0,1),r.lookAt(0,1,0),a.up.set(0,0,-1),a.lookAt(0,-1,0),o.up.set(0,-1,0),o.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(let h of e)this.add(h),h.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();let{renderTarget:n,activeMipmapLevel:s}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());let[r,a,o,l,h,u]=this.children,f=t.getRenderTarget(),m=t.getActiveCubeFace(),d=t.getActiveMipmapLevel(),y=t.xr.enabled;t.xr.enabled=!1;let v=n.texture.generateMipmaps;n.texture.generateMipmaps=!1,t.setRenderTarget(n,0,s),t.render(e,r),t.setRenderTarget(n,1,s),t.render(e,a),t.setRenderTarget(n,2,s),t.render(e,o),t.setRenderTarget(n,3,s),t.render(e,l),t.setRenderTarget(n,4,s),t.render(e,h),n.texture.generateMipmaps=v,t.setRenderTarget(n,5,s),t.render(e,u),t.setRenderTarget(f,m,d),t.xr.enabled=y,n.texture.needsPMREMUpdate=!0}},sh=class extends As{constructor(t,e,n,s,r,a,o,l,h,u){t=t!==void 0?t:[],e=e!==void 0?e:ba,super(t,e,n,s,r,a,o,l,h,u),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}},Uf=class extends Ir{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;let n={width:t,height:t,depth:1},s=[n,n,n,n,n,n];e.encoding!==void 0&&(dl("THREE.WebGLCubeRenderTarget: option.encoding has been replaced by option.colorSpace."),e.colorSpace=e.encoding===To?kn:Bs),this.texture=new sh(s,e.mapping,e.wrapS,e.wrapT,e.magFilter,e.minFilter,e.format,e.type,e.anisotropy,e.colorSpace),this.texture.isRenderTargetTexture=!0,this.texture.generateMipmaps=e.generateMipmaps!==void 0?e.generateMipmaps:!1,this.texture.minFilter=e.minFilter!==void 0?e.minFilter:ms}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;let n={uniforms:{tEquirect:{value:null}},vertexShader:`

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
			`},s=new Ri(5,5,5),r=new Qs({name:"CubemapFromEquirect",uniforms:wa(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:gs,blending:Kr});r.uniforms.tEquirect.value=e;let a=new Je(s,r),o=e.minFilter;return e.minFilter===xl&&(e.minFilter=ms),new Df(1,10,this).update(t,a),e.minFilter=o,a.geometry.dispose(),a.material.dispose(),this}clear(t,e,n,s){let r=t.getRenderTarget();for(let a=0;a<6;a++)t.setRenderTarget(this,a),t.clear(e,n,s);t.setRenderTarget(r)}},ff=new X,Wy=new X,Xy=new En,Zs=class{constructor(t=new X(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,s){return this.normal.set(t,e,n),this.constant=s,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){let s=ff.subVectors(n,e).cross(Wy.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(s,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){let t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e){let n=t.delta(ff),s=this.normal.dot(n);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;let r=-(t.start.dot(this.normal)+this.constant)/s;return r<0||r>1?null:e.copy(t.start).addScaledVector(n,r)}intersectsLine(t){let e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){let n=e||Xy.getNormalMatrix(t),s=this.coplanarPoint(ff).applyMatrix4(t),r=this.normal.applyMatrix3(n).normalize();return this.constant=-s.dot(r),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}},vo=new ys,Ic=new X,Ml=class{constructor(t=new Zs,e=new Zs,n=new Zs,s=new Zs,r=new Zs,a=new Zs){this.planes=[t,e,n,s,r,a]}set(t,e,n,s,r,a){let o=this.planes;return o[0].copy(t),o[1].copy(e),o[2].copy(n),o[3].copy(s),o[4].copy(r),o[5].copy(a),this}copy(t){let e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=Pr){let n=this.planes,s=t.elements,r=s[0],a=s[1],o=s[2],l=s[3],h=s[4],u=s[5],f=s[6],m=s[7],d=s[8],y=s[9],v=s[10],p=s[11],x=s[12],T=s[13],M=s[14],C=s[15];if(n[0].setComponents(l-r,m-h,p-d,C-x).normalize(),n[1].setComponents(l+r,m+h,p+d,C+x).normalize(),n[2].setComponents(l+a,m+u,p+y,C+T).normalize(),n[3].setComponents(l-a,m-u,p-y,C-T).normalize(),n[4].setComponents(l-o,m-f,p-v,C-M).normalize(),e===Pr)n[5].setComponents(l+o,m+f,p+v,C+M).normalize();else if(e===$c)n[5].setComponents(o,f,v,M).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),vo.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{let e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),vo.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(vo)}intersectsSprite(t){return vo.center.set(0,0,0),vo.radius=.7071067811865476,vo.applyMatrix4(t.matrixWorld),this.intersectsSphere(vo)}intersectsSphere(t){let e=this.planes,n=t.center,s=-t.radius;for(let r=0;r<6;r++)if(e[r].distanceToPoint(n)<s)return!1;return!0}intersectsBox(t){let e=this.planes;for(let n=0;n<6;n++){let s=e[n];if(Ic.x=s.normal.x>0?t.max.x:t.min.x,Ic.y=s.normal.y>0?t.max.y:t.min.y,Ic.z=s.normal.z>0?t.max.z:t.min.z,s.distanceToPoint(Ic)<0)return!1}return!0}containsPoint(t){let e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}};function Q0(){let i=null,t=!1,e=null,n=null;function s(r,a){e(r,a),n=i.requestAnimationFrame(s)}return{start:function(){t!==!0&&e!==null&&(n=i.requestAnimationFrame(s),t=!0)},stop:function(){i.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(r){e=r},setContext:function(r){i=r}}}function qy(i,t){let e=t.isWebGL2,n=new WeakMap;function s(h,u){let f=h.array,m=h.usage,d=f.byteLength,y=i.createBuffer();i.bindBuffer(u,y),i.bufferData(u,f,m),h.onUploadCallback();let v;if(f instanceof Float32Array)v=i.FLOAT;else if(f instanceof Uint16Array)if(h.isFloat16BufferAttribute)if(e)v=i.HALF_FLOAT;else throw new Error("THREE.WebGLAttributes: Usage of Float16BufferAttribute requires WebGL2.");else v=i.UNSIGNED_SHORT;else if(f instanceof Int16Array)v=i.SHORT;else if(f instanceof Uint32Array)v=i.UNSIGNED_INT;else if(f instanceof Int32Array)v=i.INT;else if(f instanceof Int8Array)v=i.BYTE;else if(f instanceof Uint8Array)v=i.UNSIGNED_BYTE;else if(f instanceof Uint8ClampedArray)v=i.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+f);return{buffer:y,type:v,bytesPerElement:f.BYTES_PER_ELEMENT,version:h.version,size:d}}function r(h,u,f){let m=u.array,d=u._updateRange,y=u.updateRanges;if(i.bindBuffer(f,h),d.count===-1&&y.length===0&&i.bufferSubData(f,0,m),y.length!==0){for(let v=0,p=y.length;v<p;v++){let x=y[v];e?i.bufferSubData(f,x.start*m.BYTES_PER_ELEMENT,m,x.start,x.count):i.bufferSubData(f,x.start*m.BYTES_PER_ELEMENT,m.subarray(x.start,x.start+x.count))}u.clearUpdateRanges()}d.count!==-1&&(e?i.bufferSubData(f,d.offset*m.BYTES_PER_ELEMENT,m,d.offset,d.count):i.bufferSubData(f,d.offset*m.BYTES_PER_ELEMENT,m.subarray(d.offset,d.offset+d.count)),d.count=-1),u.onUploadCallback()}function a(h){return h.isInterleavedBufferAttribute&&(h=h.data),n.get(h)}function o(h){h.isInterleavedBufferAttribute&&(h=h.data);let u=n.get(h);u&&(i.deleteBuffer(u.buffer),n.delete(h))}function l(h,u){if(h.isGLBufferAttribute){let m=n.get(h);(!m||m.version<h.version)&&n.set(h,{buffer:h.buffer,type:h.type,bytesPerElement:h.elementSize,version:h.version});return}h.isInterleavedBufferAttribute&&(h=h.data);let f=n.get(h);if(f===void 0)n.set(h,s(h,u));else if(f.version<h.version){if(f.size!==h.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");r(f.buffer,h,u),f.version=h.version}}return{get:a,remove:o,update:l}}var _s=class i extends Ln{constructor(t=1,e=1,n=1,s=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:s};let r=t/2,a=e/2,o=Math.floor(n),l=Math.floor(s),h=o+1,u=l+1,f=t/o,m=e/l,d=[],y=[],v=[],p=[];for(let x=0;x<u;x++){let T=x*m-a;for(let M=0;M<h;M++){let C=M*f-r;y.push(C,-T,0),v.push(0,0,1),p.push(M/o),p.push(1-x/l)}}for(let x=0;x<l;x++)for(let T=0;T<o;T++){let M=T+h*x,C=T+h*(x+1),P=T+1+h*(x+1),I=T+1+h*x;d.push(M,C,I),d.push(C,P,I)}this.setIndex(d),this.setAttribute("position",new Qe(y,3)),this.setAttribute("normal",new Qe(v,3)),this.setAttribute("uv",new Qe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.width,t.height,t.widthSegments,t.heightSegments)}},Yy=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,$y=`#ifdef USE_ALPHAHASH
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
#endif`,Zy=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,Jy=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,jy=`#ifdef USE_ALPHATEST
	if ( diffuseColor.a < alphaTest ) discard;
#endif`,Ky=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,Qy=`#ifdef USE_AOMAP
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
#endif`,t_=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,e_=`#ifdef USE_BATCHING
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
#endif`,n_=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( batchId );
#endif`,i_=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,s_=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,r_=`float G_BlinnPhong_Implicit( ) {
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
} // validated`,o_=`#ifdef USE_IRIDESCENCE
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
#endif`,a_=`#ifdef USE_BUMPMAP
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
#endif`,l_=`#if NUM_CLIPPING_PLANES > 0
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
#endif`,c_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,h_=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,u_=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,f_=`#if defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#elif defined( USE_COLOR )
	diffuseColor.rgb *= vColor;
#endif`,d_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR )
	varying vec3 vColor;
#endif`,p_=`#if defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	varying vec3 vColor;
#endif`,m_=`#if defined( USE_COLOR_ALPHA )
	vColor = vec4( 1.0 );
#elif defined( USE_COLOR ) || defined( USE_INSTANCING_COLOR )
	vColor = vec3( 1.0 );
#endif
#ifdef USE_COLOR
	vColor *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.xyz *= instanceColor.xyz;
#endif`,g_=`#define PI 3.141592653589793
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
} // validated`,x_=`#ifdef ENVMAP_TYPE_CUBE_UV
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
#endif`,y_=`vec3 transformedNormal = objectNormal;
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
#endif`,__=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,v_=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,M_=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,b_=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,S_="gl_FragColor = linearToOutputTexel( gl_FragColor );",E_=`
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
}`,w_=`#ifdef USE_ENVMAP
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
#endif`,T_=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform float flipEnvMap;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
	
#endif`,A_=`#ifdef USE_ENVMAP
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
#endif`,R_=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,C_=`#ifdef USE_ENVMAP
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
#endif`,P_=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,L_=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,I_=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,D_=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,U_=`#ifdef USE_GRADIENTMAP
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
}`,N_=`#ifdef USE_LIGHTMAP
	vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
	vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
	reflectedLight.indirectDiffuse += lightMapIrradiance;
#endif`,O_=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,F_=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,B_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,z_=`uniform bool receiveShadow;
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
#endif`,k_=`#ifdef USE_ENVMAP
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
#endif`,H_=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,V_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,G_=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,W_=`varying vec3 vViewPosition;
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
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,X_=`PhysicalMaterial material;
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
#endif`,q_=`struct PhysicalMaterial {
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
}`,Y_=`
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
#endif`,$_=`#if defined( RE_IndirectDiffuse )
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
#endif`,Z_=`#if defined( RE_IndirectDiffuse )
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,J_=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	gl_FragDepthEXT = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,j_=`#if defined( USE_LOGDEPTHBUF ) && defined( USE_LOGDEPTHBUF_EXT )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,K_=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		varying float vFragDepth;
		varying float vIsPerspective;
	#else
		uniform float logDepthBufFC;
	#endif
#endif`,Q_=`#ifdef USE_LOGDEPTHBUF
	#ifdef USE_LOGDEPTHBUF_EXT
		vFragDepth = 1.0 + gl_Position.w;
		vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
	#else
		if ( isPerspectiveMatrix( projectionMatrix ) ) {
			gl_Position.z = log2( max( EPSILON, gl_Position.w + 1.0 ) ) * logDepthBufFC - 1.0;
			gl_Position.z *= gl_Position.w;
		}
	#endif
#endif`,tv=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = vec4( mix( pow( sampledDiffuseColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), sampledDiffuseColor.rgb * 0.0773993808, vec3( lessThanEqual( sampledDiffuseColor.rgb, vec3( 0.04045 ) ) ) ), sampledDiffuseColor.w );
	
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,ev=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,nv=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
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
#endif`,iv=`#if defined( USE_POINTS_UV )
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
#endif`,sv=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,rv=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,ov=`#if defined( USE_MORPHCOLORS ) && defined( MORPHTARGETS_TEXTURE )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,av=`#ifdef USE_MORPHNORMALS
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
#endif`,lv=`#ifdef USE_MORPHTARGETS
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
#endif`,cv=`#ifdef USE_MORPHTARGETS
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
#endif`,hv=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
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
vec3 nonPerturbedNormal = normal;`,uv=`#ifdef USE_NORMALMAP_OBJECTSPACE
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
#endif`,fv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,dv=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,pv=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,mv=`#ifdef USE_NORMALMAP
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
#endif`,gv=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,xv=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,yv=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,_v=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,vv=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Mv=`vec3 packNormalToRGB( const in vec3 normal ) {
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
}`,bv=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Sv=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,Ev=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,wv=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Tv=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Av=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Rv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Cv=`#if NUM_SPOT_LIGHT_COORDS > 0
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
#endif`,Pv=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
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
#endif`,Lv=`float getShadowMask() {
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
}`,Iv=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,Dv=`#ifdef USE_SKINNING
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
#endif`,Uv=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Nv=`#ifdef USE_SKINNING
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
#endif`,Ov=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,Fv=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Bv=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,zv=`#ifndef saturate
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
vec3 CustomToneMapping( vec3 color ) { return color; }`,kv=`#ifdef USE_TRANSMISSION
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
#endif`,Hv=`#ifdef USE_TRANSMISSION
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
#endif`,Vv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Gv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Wv=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
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
#endif`,Xv=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`,qv=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,Yv=`uniform sampler2D t2D;
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
}`,$v=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,Zv=`#ifdef ENVMAP_TYPE_CUBE
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
}`,Jv=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,jv=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,Kv=`#include <common>
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
}`,Qv=`#if DEPTH_PACKING == 3200
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
}`,tM=`#define DISTANCE
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
}`,eM=`#define DISTANCE
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
}`,nM=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,iM=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,sM=`uniform float scale;
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
}`,rM=`uniform vec3 diffuse;
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
}`,oM=`#include <common>
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
}`,aM=`uniform vec3 diffuse;
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
}`,lM=`#define LAMBERT
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
}`,cM=`#define LAMBERT
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
}`,hM=`#define MATCAP
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
}`,uM=`#define MATCAP
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
}`,fM=`#define NORMAL
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
}`,dM=`#define NORMAL
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
}`,pM=`#define PHONG
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
}`,mM=`#define PHONG
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
}`,gM=`#define STANDARD
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
}`,xM=`#define STANDARD
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
}`,yM=`#define TOON
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
}`,_M=`#define TOON
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
}`,vM=`uniform float size;
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
}`,MM=`uniform vec3 diffuse;
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
}`,bM=`#include <common>
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
}`,SM=`uniform vec3 color;
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
}`,EM=`uniform float rotation;
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
}`,wM=`uniform vec3 diffuse;
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
}`,Mn={alphahash_fragment:Yy,alphahash_pars_fragment:$y,alphamap_fragment:Zy,alphamap_pars_fragment:Jy,alphatest_fragment:jy,alphatest_pars_fragment:Ky,aomap_fragment:Qy,aomap_pars_fragment:t_,batching_pars_vertex:e_,batching_vertex:n_,begin_vertex:i_,beginnormal_vertex:s_,bsdfs:r_,iridescence_fragment:o_,bumpmap_pars_fragment:a_,clipping_planes_fragment:l_,clipping_planes_pars_fragment:c_,clipping_planes_pars_vertex:h_,clipping_planes_vertex:u_,color_fragment:f_,color_pars_fragment:d_,color_pars_vertex:p_,color_vertex:m_,common:g_,cube_uv_reflection_fragment:x_,defaultnormal_vertex:y_,displacementmap_pars_vertex:__,displacementmap_vertex:v_,emissivemap_fragment:M_,emissivemap_pars_fragment:b_,colorspace_fragment:S_,colorspace_pars_fragment:E_,envmap_fragment:w_,envmap_common_pars_fragment:T_,envmap_pars_fragment:A_,envmap_pars_vertex:R_,envmap_physical_pars_fragment:k_,envmap_vertex:C_,fog_vertex:P_,fog_pars_vertex:L_,fog_fragment:I_,fog_pars_fragment:D_,gradientmap_pars_fragment:U_,lightmap_fragment:N_,lightmap_pars_fragment:O_,lights_lambert_fragment:F_,lights_lambert_pars_fragment:B_,lights_pars_begin:z_,lights_toon_fragment:H_,lights_toon_pars_fragment:V_,lights_phong_fragment:G_,lights_phong_pars_fragment:W_,lights_physical_fragment:X_,lights_physical_pars_fragment:q_,lights_fragment_begin:Y_,lights_fragment_maps:$_,lights_fragment_end:Z_,logdepthbuf_fragment:J_,logdepthbuf_pars_fragment:j_,logdepthbuf_pars_vertex:K_,logdepthbuf_vertex:Q_,map_fragment:tv,map_pars_fragment:ev,map_particle_fragment:nv,map_particle_pars_fragment:iv,metalnessmap_fragment:sv,metalnessmap_pars_fragment:rv,morphcolor_vertex:ov,morphnormal_vertex:av,morphtarget_pars_vertex:lv,morphtarget_vertex:cv,normal_fragment_begin:hv,normal_fragment_maps:uv,normal_pars_fragment:fv,normal_pars_vertex:dv,normal_vertex:pv,normalmap_pars_fragment:mv,clearcoat_normal_fragment_begin:gv,clearcoat_normal_fragment_maps:xv,clearcoat_pars_fragment:yv,iridescence_pars_fragment:_v,opaque_fragment:vv,packing:Mv,premultiplied_alpha_fragment:bv,project_vertex:Sv,dithering_fragment:Ev,dithering_pars_fragment:wv,roughnessmap_fragment:Tv,roughnessmap_pars_fragment:Av,shadowmap_pars_fragment:Rv,shadowmap_pars_vertex:Cv,shadowmap_vertex:Pv,shadowmask_pars_fragment:Lv,skinbase_vertex:Iv,skinning_pars_vertex:Dv,skinning_vertex:Uv,skinnormal_vertex:Nv,specularmap_fragment:Ov,specularmap_pars_fragment:Fv,tonemapping_fragment:Bv,tonemapping_pars_fragment:zv,transmission_fragment:kv,transmission_pars_fragment:Hv,uv_pars_fragment:Vv,uv_pars_vertex:Gv,uv_vertex:Wv,worldpos_vertex:Xv,background_vert:qv,background_frag:Yv,backgroundCube_vert:$v,backgroundCube_frag:Zv,cube_vert:Jv,cube_frag:jv,depth_vert:Kv,depth_frag:Qv,distanceRGBA_vert:tM,distanceRGBA_frag:eM,equirect_vert:nM,equirect_frag:iM,linedashed_vert:sM,linedashed_frag:rM,meshbasic_vert:oM,meshbasic_frag:aM,meshlambert_vert:lM,meshlambert_frag:cM,meshmatcap_vert:hM,meshmatcap_frag:uM,meshnormal_vert:fM,meshnormal_frag:dM,meshphong_vert:pM,meshphong_frag:mM,meshphysical_vert:gM,meshphysical_frag:xM,meshtoon_vert:yM,meshtoon_frag:_M,points_vert:vM,points_frag:MM,shadow_vert:bM,shadow_frag:SM,sprite_vert:EM,sprite_frag:wM},Te={common:{diffuse:{value:new fn(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new En}},envmap:{envMap:{value:null},flipEnvMap:{value:-1},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new En}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new En}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new En},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new En},normalScale:{value:new de(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new En},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new En}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new En}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new En}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new fn(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMap:{value:[]},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotShadowMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMap:{value:[]},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null}},points:{diffuse:{value:new fn(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0},uvTransform:{value:new En}},sprite:{diffuse:{value:new fn(16777215)},opacity:{value:1},center:{value:new de(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new En},alphaMap:{value:null},alphaMapTransform:{value:new En},alphaTest:{value:0}}},rs={basic:{uniforms:ss([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.fog]),vertexShader:Mn.meshbasic_vert,fragmentShader:Mn.meshbasic_frag},lambert:{uniforms:ss([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new fn(0)}}]),vertexShader:Mn.meshlambert_vert,fragmentShader:Mn.meshlambert_frag},phong:{uniforms:ss([Te.common,Te.specularmap,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,Te.lights,{emissive:{value:new fn(0)},specular:{value:new fn(1118481)},shininess:{value:30}}]),vertexShader:Mn.meshphong_vert,fragmentShader:Mn.meshphong_frag},standard:{uniforms:ss([Te.common,Te.envmap,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.roughnessmap,Te.metalnessmap,Te.fog,Te.lights,{emissive:{value:new fn(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Mn.meshphysical_vert,fragmentShader:Mn.meshphysical_frag},toon:{uniforms:ss([Te.common,Te.aomap,Te.lightmap,Te.emissivemap,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.gradientmap,Te.fog,Te.lights,{emissive:{value:new fn(0)}}]),vertexShader:Mn.meshtoon_vert,fragmentShader:Mn.meshtoon_frag},matcap:{uniforms:ss([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,Te.fog,{matcap:{value:null}}]),vertexShader:Mn.meshmatcap_vert,fragmentShader:Mn.meshmatcap_frag},points:{uniforms:ss([Te.points,Te.fog]),vertexShader:Mn.points_vert,fragmentShader:Mn.points_frag},dashed:{uniforms:ss([Te.common,Te.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Mn.linedashed_vert,fragmentShader:Mn.linedashed_frag},depth:{uniforms:ss([Te.common,Te.displacementmap]),vertexShader:Mn.depth_vert,fragmentShader:Mn.depth_frag},normal:{uniforms:ss([Te.common,Te.bumpmap,Te.normalmap,Te.displacementmap,{opacity:{value:1}}]),vertexShader:Mn.meshnormal_vert,fragmentShader:Mn.meshnormal_frag},sprite:{uniforms:ss([Te.sprite,Te.fog]),vertexShader:Mn.sprite_vert,fragmentShader:Mn.sprite_frag},background:{uniforms:{uvTransform:{value:new En},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Mn.background_vert,fragmentShader:Mn.background_frag},backgroundCube:{uniforms:{envMap:{value:null},flipEnvMap:{value:-1},backgroundBlurriness:{value:0},backgroundIntensity:{value:1}},vertexShader:Mn.backgroundCube_vert,fragmentShader:Mn.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Mn.cube_vert,fragmentShader:Mn.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Mn.equirect_vert,fragmentShader:Mn.equirect_frag},distanceRGBA:{uniforms:ss([Te.common,Te.displacementmap,{referencePosition:{value:new X},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Mn.distanceRGBA_vert,fragmentShader:Mn.distanceRGBA_frag},shadow:{uniforms:ss([Te.lights,Te.fog,{color:{value:new fn(0)},opacity:{value:1}}]),vertexShader:Mn.shadow_vert,fragmentShader:Mn.shadow_frag}};rs.physical={uniforms:ss([rs.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new En},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new En},clearcoatNormalScale:{value:new de(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new En},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new En},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new En},sheen:{value:0},sheenColor:{value:new fn(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new En},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new En},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new En},transmissionSamplerSize:{value:new de},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new En},attenuationDistance:{value:0},attenuationColor:{value:new fn(0)},specularColor:{value:new fn(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new En},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new En},anisotropyVector:{value:new de},anisotropyMap:{value:null},anisotropyMapTransform:{value:new En}}]),vertexShader:Mn.meshphysical_vert,fragmentShader:Mn.meshphysical_frag};var Dc={r:0,b:0,g:0};function TM(i,t,e,n,s,r,a){let o=new fn(0),l=r===!0?0:1,h,u,f=null,m=0,d=null;function y(p,x){let T=!1,M=x.isScene===!0?x.background:null;M&&M.isTexture&&(M=(x.backgroundBlurriness>0?e:t).get(M)),M===null?v(o,l):M&&M.isColor&&(v(M,1),T=!0);let C=i.xr.getEnvironmentBlendMode();C==="additive"?n.buffers.color.setClear(0,0,0,1,a):C==="alpha-blend"&&n.buffers.color.setClear(0,0,0,0,a),(i.autoClear||T)&&i.clear(i.autoClearColor,i.autoClearDepth,i.autoClearStencil),M&&(M.isCubeTexture||M.mapping===Uh)?(u===void 0&&(u=new Je(new Ri(1,1,1),new Qs({name:"BackgroundCubeMaterial",uniforms:wa(rs.backgroundCube.uniforms),vertexShader:rs.backgroundCube.vertexShader,fragmentShader:rs.backgroundCube.fragmentShader,side:gs,depthTest:!1,depthWrite:!1,fog:!1})),u.geometry.deleteAttribute("normal"),u.geometry.deleteAttribute("uv"),u.onBeforeRender=function(P,I,z){this.matrixWorld.copyPosition(z.matrixWorld)},Object.defineProperty(u.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),s.update(u)),u.material.uniforms.envMap.value=M,u.material.uniforms.flipEnvMap.value=M.isCubeTexture&&M.isRenderTargetTexture===!1?-1:1,u.material.uniforms.backgroundBlurriness.value=x.backgroundBlurriness,u.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,u.material.toneMapped=Wn.getTransfer(M.colorSpace)!==oi,(f!==M||m!==M.version||d!==i.toneMapping)&&(u.material.needsUpdate=!0,f=M,m=M.version,d=i.toneMapping),u.layers.enableAll(),p.unshift(u,u.geometry,u.material,0,0,null)):M&&M.isTexture&&(h===void 0&&(h=new Je(new _s(2,2),new Qs({name:"BackgroundMaterial",uniforms:wa(rs.background.uniforms),vertexShader:rs.background.vertexShader,fragmentShader:rs.background.fragmentShader,side:eo,depthTest:!1,depthWrite:!1,fog:!1})),h.geometry.deleteAttribute("normal"),Object.defineProperty(h.material,"map",{get:function(){return this.uniforms.t2D.value}}),s.update(h)),h.material.uniforms.t2D.value=M,h.material.uniforms.backgroundIntensity.value=x.backgroundIntensity,h.material.toneMapped=Wn.getTransfer(M.colorSpace)!==oi,M.matrixAutoUpdate===!0&&M.updateMatrix(),h.material.uniforms.uvTransform.value.copy(M.matrix),(f!==M||m!==M.version||d!==i.toneMapping)&&(h.material.needsUpdate=!0,f=M,m=M.version,d=i.toneMapping),h.layers.enableAll(),p.unshift(h,h.geometry,h.material,0,0,null))}function v(p,x){p.getRGB(Dc,K0(i)),n.buffers.color.setClear(Dc.r,Dc.g,Dc.b,x,a)}return{getClearColor:function(){return o},setClearColor:function(p,x=1){o.set(p),l=x,v(o,l)},getClearAlpha:function(){return l},setClearAlpha:function(p){l=p,v(o,l)},render:y}}function AM(i,t,e,n){let s=i.getParameter(i.MAX_VERTEX_ATTRIBS),r=n.isWebGL2?null:t.get("OES_vertex_array_object"),a=n.isWebGL2||r!==null,o={},l=p(null),h=l,u=!1;function f(et,ft,Rt,Xt,Qt){let Lt=!1;if(a){let jt=v(Xt,Rt,ft);h!==jt&&(h=jt,d(h.object)),Lt=x(et,Xt,Rt,Qt),Lt&&T(et,Xt,Rt,Qt)}else{let jt=ft.wireframe===!0;(h.geometry!==Xt.id||h.program!==Rt.id||h.wireframe!==jt)&&(h.geometry=Xt.id,h.program=Rt.id,h.wireframe=jt,Lt=!0)}Qt!==null&&e.update(Qt,i.ELEMENT_ARRAY_BUFFER),(Lt||u)&&(u=!1,nt(et,ft,Rt,Xt),Qt!==null&&i.bindBuffer(i.ELEMENT_ARRAY_BUFFER,e.get(Qt).buffer))}function m(){return n.isWebGL2?i.createVertexArray():r.createVertexArrayOES()}function d(et){return n.isWebGL2?i.bindVertexArray(et):r.bindVertexArrayOES(et)}function y(et){return n.isWebGL2?i.deleteVertexArray(et):r.deleteVertexArrayOES(et)}function v(et,ft,Rt){let Xt=Rt.wireframe===!0,Qt=o[et.id];Qt===void 0&&(Qt={},o[et.id]=Qt);let Lt=Qt[ft.id];Lt===void 0&&(Lt={},Qt[ft.id]=Lt);let jt=Lt[Xt];return jt===void 0&&(jt=p(m()),Lt[Xt]=jt),jt}function p(et){let ft=[],Rt=[],Xt=[];for(let Qt=0;Qt<s;Qt++)ft[Qt]=0,Rt[Qt]=0,Xt[Qt]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:ft,enabledAttributes:Rt,attributeDivisors:Xt,object:et,attributes:{},index:null}}function x(et,ft,Rt,Xt){let Qt=h.attributes,Lt=ft.attributes,jt=0,fe=Rt.getAttributes();for(let we in fe)if(fe[we].location>=0){let It=Qt[we],se=Lt[we];if(se===void 0&&(we==="instanceMatrix"&&et.instanceMatrix&&(se=et.instanceMatrix),we==="instanceColor"&&et.instanceColor&&(se=et.instanceColor)),It===void 0||It.attribute!==se||se&&It.data!==se.data)return!0;jt++}return h.attributesNum!==jt||h.index!==Xt}function T(et,ft,Rt,Xt){let Qt={},Lt=ft.attributes,jt=0,fe=Rt.getAttributes();for(let we in fe)if(fe[we].location>=0){let It=Lt[we];It===void 0&&(we==="instanceMatrix"&&et.instanceMatrix&&(It=et.instanceMatrix),we==="instanceColor"&&et.instanceColor&&(It=et.instanceColor));let se={};se.attribute=It,It&&It.data&&(se.data=It.data),Qt[we]=se,jt++}h.attributes=Qt,h.attributesNum=jt,h.index=Xt}function M(){let et=h.newAttributes;for(let ft=0,Rt=et.length;ft<Rt;ft++)et[ft]=0}function C(et){P(et,0)}function P(et,ft){let Rt=h.newAttributes,Xt=h.enabledAttributes,Qt=h.attributeDivisors;Rt[et]=1,Xt[et]===0&&(i.enableVertexAttribArray(et),Xt[et]=1),Qt[et]!==ft&&((n.isWebGL2?i:t.get("ANGLE_instanced_arrays"))[n.isWebGL2?"vertexAttribDivisor":"vertexAttribDivisorANGLE"](et,ft),Qt[et]=ft)}function I(){let et=h.newAttributes,ft=h.enabledAttributes;for(let Rt=0,Xt=ft.length;Rt<Xt;Rt++)ft[Rt]!==et[Rt]&&(i.disableVertexAttribArray(Rt),ft[Rt]=0)}function z(et,ft,Rt,Xt,Qt,Lt,jt){jt===!0?i.vertexAttribIPointer(et,ft,Rt,Qt,Lt):i.vertexAttribPointer(et,ft,Rt,Xt,Qt,Lt)}function nt(et,ft,Rt,Xt){if(n.isWebGL2===!1&&(et.isInstancedMesh||Xt.isInstancedBufferGeometry)&&t.get("ANGLE_instanced_arrays")===null)return;M();let Qt=Xt.attributes,Lt=Rt.getAttributes(),jt=ft.defaultAttributeValues;for(let fe in Lt){let we=Lt[fe];if(we.location>=0){let Ct=Qt[fe];if(Ct===void 0&&(fe==="instanceMatrix"&&et.instanceMatrix&&(Ct=et.instanceMatrix),fe==="instanceColor"&&et.instanceColor&&(Ct=et.instanceColor)),Ct!==void 0){let It=Ct.normalized,se=Ct.itemSize,Le=e.get(Ct);if(Le===void 0)continue;let Ne=Le.buffer,sn=Le.type,on=Le.bytesPerElement,Ve=n.isWebGL2===!0&&(sn===i.INT||sn===i.UNSIGNED_INT||Ct.gpuType===H0);if(Ct.isInterleavedBufferAttribute){let We=Ct.data,K=We.stride,be=Ct.offset;if(We.isInstancedInterleavedBuffer){for(let lt=0;lt<we.locationSize;lt++)P(we.location+lt,We.meshPerAttribute);et.isInstancedMesh!==!0&&Xt._maxInstanceCount===void 0&&(Xt._maxInstanceCount=We.meshPerAttribute*We.count)}else for(let lt=0;lt<we.locationSize;lt++)C(we.location+lt);i.bindBuffer(i.ARRAY_BUFFER,Ne);for(let lt=0;lt<we.locationSize;lt++)z(we.location+lt,se/we.locationSize,sn,It,K*on,(be+se/we.locationSize*lt)*on,Ve)}else{if(Ct.isInstancedBufferAttribute){for(let We=0;We<we.locationSize;We++)P(we.location+We,Ct.meshPerAttribute);et.isInstancedMesh!==!0&&Xt._maxInstanceCount===void 0&&(Xt._maxInstanceCount=Ct.meshPerAttribute*Ct.count)}else for(let We=0;We<we.locationSize;We++)C(we.location+We);i.bindBuffer(i.ARRAY_BUFFER,Ne);for(let We=0;We<we.locationSize;We++)z(we.location+We,se/we.locationSize,sn,It,se*on,se/we.locationSize*We*on,Ve)}}else if(jt!==void 0){let It=jt[fe];if(It!==void 0)switch(It.length){case 2:i.vertexAttrib2fv(we.location,It);break;case 3:i.vertexAttrib3fv(we.location,It);break;case 4:i.vertexAttrib4fv(we.location,It);break;default:i.vertexAttrib1fv(we.location,It)}}}}I()}function R(){wt();for(let et in o){let ft=o[et];for(let Rt in ft){let Xt=ft[Rt];for(let Qt in Xt)y(Xt[Qt].object),delete Xt[Qt];delete ft[Rt]}delete o[et]}}function w(et){if(o[et.id]===void 0)return;let ft=o[et.id];for(let Rt in ft){let Xt=ft[Rt];for(let Qt in Xt)y(Xt[Qt].object),delete Xt[Qt];delete ft[Rt]}delete o[et.id]}function at(et){for(let ft in o){let Rt=o[ft];if(Rt[et.id]===void 0)continue;let Xt=Rt[et.id];for(let Qt in Xt)y(Xt[Qt].object),delete Xt[Qt];delete Rt[et.id]}}function wt(){ce(),u=!0,h!==l&&(h=l,d(h.object))}function ce(){l.geometry=null,l.program=null,l.wireframe=!1}return{setup:f,reset:wt,resetDefaultState:ce,dispose:R,releaseStatesOfGeometry:w,releaseStatesOfProgram:at,initAttributes:M,enableAttribute:C,disableUnusedAttributes:I}}function RM(i,t,e,n){let s=n.isWebGL2,r;function a(u){r=u}function o(u,f){i.drawArrays(r,u,f),e.update(f,r,1)}function l(u,f,m){if(m===0)return;let d,y;if(s)d=i,y="drawArraysInstanced";else if(d=t.get("ANGLE_instanced_arrays"),y="drawArraysInstancedANGLE",d===null){console.error("THREE.WebGLBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}d[y](r,u,f,m),e.update(f,r,m)}function h(u,f,m){if(m===0)return;let d=t.get("WEBGL_multi_draw");if(d===null)for(let y=0;y<m;y++)this.render(u[y],f[y]);else{d.multiDrawArraysWEBGL(r,u,0,f,0,m);let y=0;for(let v=0;v<m;v++)y+=f[v];e.update(y,r,1)}}this.setMode=a,this.render=o,this.renderInstances=l,this.renderMultiDraw=h}function CM(i,t,e){let n;function s(){if(n!==void 0)return n;if(t.has("EXT_texture_filter_anisotropic")===!0){let z=t.get("EXT_texture_filter_anisotropic");n=i.getParameter(z.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else n=0;return n}function r(z){if(z==="highp"){if(i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.HIGH_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.HIGH_FLOAT).precision>0)return"highp";z="mediump"}return z==="mediump"&&i.getShaderPrecisionFormat(i.VERTEX_SHADER,i.MEDIUM_FLOAT).precision>0&&i.getShaderPrecisionFormat(i.FRAGMENT_SHADER,i.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let a=typeof WebGL2RenderingContext<"u"&&i.constructor.name==="WebGL2RenderingContext",o=e.precision!==void 0?e.precision:"highp",l=r(o);l!==o&&(console.warn("THREE.WebGLRenderer:",o,"not supported, using",l,"instead."),o=l);let h=a||t.has("WEBGL_draw_buffers"),u=e.logarithmicDepthBuffer===!0,f=i.getParameter(i.MAX_TEXTURE_IMAGE_UNITS),m=i.getParameter(i.MAX_VERTEX_TEXTURE_IMAGE_UNITS),d=i.getParameter(i.MAX_TEXTURE_SIZE),y=i.getParameter(i.MAX_CUBE_MAP_TEXTURE_SIZE),v=i.getParameter(i.MAX_VERTEX_ATTRIBS),p=i.getParameter(i.MAX_VERTEX_UNIFORM_VECTORS),x=i.getParameter(i.MAX_VARYING_VECTORS),T=i.getParameter(i.MAX_FRAGMENT_UNIFORM_VECTORS),M=m>0,C=a||t.has("OES_texture_float"),P=M&&C,I=a?i.getParameter(i.MAX_SAMPLES):0;return{isWebGL2:a,drawBuffers:h,getMaxAnisotropy:s,getMaxPrecision:r,precision:o,logarithmicDepthBuffer:u,maxTextures:f,maxVertexTextures:m,maxTextureSize:d,maxCubemapSize:y,maxAttributes:v,maxVertexUniforms:p,maxVaryings:x,maxFragmentUniforms:T,vertexTextures:M,floatFragmentTextures:C,floatVertexTextures:P,maxSamples:I}}function PM(i){let t=this,e=null,n=0,s=!1,r=!1,a=new Zs,o=new En,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(f,m){let d=f.length!==0||m||n!==0||s;return s=m,n=f.length,d},this.beginShadows=function(){r=!0,u(null)},this.endShadows=function(){r=!1},this.setGlobalState=function(f,m){e=u(f,m,0)},this.setState=function(f,m,d){let y=f.clippingPlanes,v=f.clipIntersection,p=f.clipShadows,x=i.get(f);if(!s||y===null||y.length===0||r&&!p)r?u(null):h();else{let T=r?0:n,M=T*4,C=x.clippingState||null;l.value=C,C=u(y,m,M,d);for(let P=0;P!==M;++P)C[P]=e[P];x.clippingState=C,this.numIntersection=v?this.numPlanes:0,this.numPlanes+=T}};function h(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function u(f,m,d,y){let v=f!==null?f.length:0,p=null;if(v!==0){if(p=l.value,y!==!0||p===null){let x=d+v*4,T=m.matrixWorldInverse;o.getNormalMatrix(T),(p===null||p.length<x)&&(p=new Float32Array(x));for(let M=0,C=d;M!==v;++M,C+=4)a.copy(f[M]).applyMatrix4(T,o),a.normal.toArray(p,C),p[C+3]=a.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=v,t.numIntersection=0,p}}function LM(i){let t=new WeakMap;function e(a,o){return o===wf?a.mapping=ba:o===Tf&&(a.mapping=Sa),a}function n(a){if(a&&a.isTexture){let o=a.mapping;if(o===wf||o===Tf)if(t.has(a)){let l=t.get(a).texture;return e(l,a.mapping)}else{let l=a.image;if(l&&l.height>0){let h=new Uf(l.height/2);return h.fromEquirectangularTexture(i,a),t.set(a,h),a.addEventListener("dispose",s),e(h.texture,a.mapping)}else return null}}return a}function s(a){let o=a.target;o.removeEventListener("dispose",s);let l=t.get(o);l!==void 0&&(t.delete(o),l.dispose())}function r(){t=new WeakMap}return{get:n,dispose:r}}var rh=class extends ih{constructor(t=-1,e=1,n=1,s=-1,r=.1,a=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=s,this.near=r,this.far=a,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,s,r,a){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=s,this.view.width=r,this.view.height=a,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){let t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,s=(this.top+this.bottom)/2,r=n-t,a=n+t,o=s+e,l=s-e;if(this.view!==null&&this.view.enabled){let h=(this.right-this.left)/this.view.fullWidth/this.zoom,u=(this.top-this.bottom)/this.view.fullHeight/this.zoom;r+=h*this.view.offsetX,a=r+h*this.view.width,o-=u*this.view.offsetY,l=o-u*this.view.height}this.projectionMatrix.makeOrthographic(r,a,o,l,this.near,this.far,this.coordinateSystem),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){let e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}},ga=4,n0=[.125,.215,.35,.446,.526,.582],So=20,df=new rh,i0=new fn,pf=null,mf=0,gf=0,Mo=(1+Math.sqrt(5))/2,da=1/Mo,s0=[new X(1,1,1),new X(-1,1,1),new X(1,1,-1),new X(-1,1,-1),new X(0,Mo,da),new X(0,Mo,-da),new X(da,0,Mo),new X(-da,0,Mo),new X(Mo,da,0),new X(-Mo,da,0)],oh=class{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._lodPlanes=[],this._sizeLods=[],this._sigmas=[],this._blurMaterial=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._compileMaterial(this._blurMaterial)}fromScene(t,e=0,n=.1,s=100){pf=this._renderer.getRenderTarget(),mf=this._renderer.getActiveCubeFace(),gf=this._renderer.getActiveMipmapLevel(),this._setSize(256);let r=this._allocateTargets();return r.depthBuffer=!0,this._sceneToCubeUV(t,n,s,r),e>0&&this._blur(r,0,0,e),this._applyPMREM(r),this._cleanup(r),r}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=a0(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=o0(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose()}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodPlanes.length;t++)this._lodPlanes[t].dispose()}_cleanup(t){this._renderer.setRenderTarget(pf,mf,gf),t.scissorTest=!1,Uc(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ba||t.mapping===Sa?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),pf=this._renderer.getRenderTarget(),mf=this._renderer.getActiveCubeFace(),gf=this._renderer.getActiveMipmapLevel();let n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){let t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:ms,minFilter:ms,generateMipmaps:!1,type:yl,format:js,colorSpace:Lr,depthBuffer:!1},s=r0(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=r0(t,e,n);let{_lodMax:r}=this;({sizeLods:this._sizeLods,lodPlanes:this._lodPlanes,sigmas:this._sigmas}=IM(r)),this._blurMaterial=DM(r,t,e)}return s}_compileMaterial(t){let e=new Je(this._lodPlanes[0],t);this._renderer.compile(e,df)}_sceneToCubeUV(t,e,n,s){let o=new Gi(90,1,e,n),l=[1,-1,1,1,1,1],h=[1,1,1,-1,-1,-1],u=this._renderer,f=u.autoClear,m=u.toneMapping;u.getClearColor(i0),u.toneMapping=Qr,u.autoClear=!1;let d=new os({name:"PMREM.Background",side:gs,depthWrite:!1,depthTest:!1}),y=new Je(new Ri,d),v=!1,p=t.background;p?p.isColor&&(d.color.copy(p),t.background=null,v=!0):(d.color.copy(i0),v=!0);for(let x=0;x<6;x++){let T=x%3;T===0?(o.up.set(0,l[x],0),o.lookAt(h[x],0,0)):T===1?(o.up.set(0,0,l[x]),o.lookAt(0,h[x],0)):(o.up.set(0,l[x],0),o.lookAt(0,0,h[x]));let M=this._cubeSize;Uc(s,T*M,x>2?M:0,M,M),u.setRenderTarget(s),v&&u.render(y,o),u.render(t,o)}y.geometry.dispose(),y.material.dispose(),u.toneMapping=m,u.autoClear=f,t.background=p}_textureToCubeUV(t,e){let n=this._renderer,s=t.mapping===ba||t.mapping===Sa;s?(this._cubemapMaterial===null&&(this._cubemapMaterial=a0()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=o0());let r=s?this._cubemapMaterial:this._equirectMaterial,a=new Je(this._lodPlanes[0],r),o=r.uniforms;o.envMap.value=t;let l=this._cubeSize;Uc(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(a,df)}_applyPMREM(t){let e=this._renderer,n=e.autoClear;e.autoClear=!1;for(let s=1;s<this._lodPlanes.length;s++){let r=Math.sqrt(this._sigmas[s]*this._sigmas[s]-this._sigmas[s-1]*this._sigmas[s-1]),a=s0[(s-1)%s0.length];this._blur(t,s-1,s,r,a)}e.autoClear=n}_blur(t,e,n,s,r){let a=this._pingPongRenderTarget;this._halfBlur(t,a,e,n,s,"latitudinal",r),this._halfBlur(a,t,n,n,s,"longitudinal",r)}_halfBlur(t,e,n,s,r,a,o){let l=this._renderer,h=this._blurMaterial;a!=="latitudinal"&&a!=="longitudinal"&&console.error("blur direction must be either latitudinal or longitudinal!");let u=3,f=new Je(this._lodPlanes[s],h),m=h.uniforms,d=this._sizeLods[n]-1,y=isFinite(r)?Math.PI/(2*d):2*Math.PI/(2*So-1),v=r/y,p=isFinite(r)?1+Math.floor(u*v):So;p>So&&console.warn(`sigmaRadians, ${r}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${So}`);let x=[],T=0;for(let z=0;z<So;++z){let nt=z/v,R=Math.exp(-nt*nt/2);x.push(R),z===0?T+=R:z<p&&(T+=2*R)}for(let z=0;z<x.length;z++)x[z]=x[z]/T;m.envMap.value=t.texture,m.samples.value=p,m.weights.value=x,m.latitudinal.value=a==="latitudinal",o&&(m.poleAxis.value=o);let{_lodMax:M}=this;m.dTheta.value=y,m.mipInt.value=M-n;let C=this._sizeLods[s],P=3*C*(s>M-ga?s-M+ga:0),I=4*(this._cubeSize-C);Uc(e,P,I,3*C,2*C),l.setRenderTarget(e),l.render(f,df)}};function IM(i){let t=[],e=[],n=[],s=i,r=i-ga+1+n0.length;for(let a=0;a<r;a++){let o=Math.pow(2,s);e.push(o);let l=1/o;a>i-ga?l=n0[a-i+ga-1]:a===0&&(l=0),n.push(l);let h=1/(o-2),u=-h,f=1+h,m=[u,u,f,u,f,f,u,u,f,f,u,f],d=6,y=6,v=3,p=2,x=1,T=new Float32Array(v*y*d),M=new Float32Array(p*y*d),C=new Float32Array(x*y*d);for(let I=0;I<d;I++){let z=I%3*2/3-1,nt=I>2?0:-1,R=[z,nt,0,z+2/3,nt,0,z+2/3,nt+1,0,z,nt,0,z+2/3,nt+1,0,z,nt+1,0];T.set(R,v*y*I),M.set(m,p*y*I);let w=[I,I,I,I,I,I];C.set(w,x*y*I)}let P=new Ln;P.setAttribute("position",new Zn(T,v)),P.setAttribute("uv",new Zn(M,p)),P.setAttribute("faceIndex",new Zn(C,x)),t.push(P),s>ga&&s--}return{lodPlanes:t,sizeLods:e,sigmas:n}}function r0(i,t,e){let n=new Ir(i,t,e);return n.texture.mapping=Uh,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Uc(i,t,e,n,s){i.viewport.set(t,e,n,s),i.scissor.set(t,e,n,s)}function DM(i,t,e){let n=new Float32Array(So),s=new X(0,1,0);return new Qs({name:"SphericalGaussianBlur",defines:{n:So,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${i}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:s}},vertexShader:_d(),fragmentShader:`

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
		`,blending:Kr,depthTest:!1,depthWrite:!1})}function o0(){return new Qs({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:_d(),fragmentShader:`

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
		`,blending:Kr,depthTest:!1,depthWrite:!1})}function a0(){return new Qs({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:_d(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Kr,depthTest:!1,depthWrite:!1})}function _d(){return`

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
	`}function UM(i){let t=new WeakMap,e=null;function n(o){if(o&&o.isTexture){let l=o.mapping,h=l===wf||l===Tf,u=l===ba||l===Sa;if(h||u)if(o.isRenderTargetTexture&&o.needsPMREMUpdate===!0){o.needsPMREMUpdate=!1;let f=t.get(o);return e===null&&(e=new oh(i)),f=h?e.fromEquirectangular(o,f):e.fromCubemap(o,f),t.set(o,f),f.texture}else{if(t.has(o))return t.get(o).texture;{let f=o.image;if(h&&f&&f.height>0||u&&f&&s(f)){e===null&&(e=new oh(i));let m=h?e.fromEquirectangular(o):e.fromCubemap(o);return t.set(o,m),o.addEventListener("dispose",r),m.texture}else return null}}}return o}function s(o){let l=0,h=6;for(let u=0;u<h;u++)o[u]!==void 0&&l++;return l===h}function r(o){let l=o.target;l.removeEventListener("dispose",r);let h=t.get(l);h!==void 0&&(t.delete(l),h.dispose())}function a(){t=new WeakMap,e!==null&&(e.dispose(),e=null)}return{get:n,dispose:a}}function NM(i){let t={};function e(n){if(t[n]!==void 0)return t[n];let s;switch(n){case"WEBGL_depth_texture":s=i.getExtension("WEBGL_depth_texture")||i.getExtension("MOZ_WEBGL_depth_texture")||i.getExtension("WEBKIT_WEBGL_depth_texture");break;case"EXT_texture_filter_anisotropic":s=i.getExtension("EXT_texture_filter_anisotropic")||i.getExtension("MOZ_EXT_texture_filter_anisotropic")||i.getExtension("WEBKIT_EXT_texture_filter_anisotropic");break;case"WEBGL_compressed_texture_s3tc":s=i.getExtension("WEBGL_compressed_texture_s3tc")||i.getExtension("MOZ_WEBGL_compressed_texture_s3tc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_s3tc");break;case"WEBGL_compressed_texture_pvrtc":s=i.getExtension("WEBGL_compressed_texture_pvrtc")||i.getExtension("WEBKIT_WEBGL_compressed_texture_pvrtc");break;default:s=i.getExtension(n)}return t[n]=s,s}return{has:function(n){return e(n)!==null},init:function(n){n.isWebGL2?(e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance")):(e("WEBGL_depth_texture"),e("OES_texture_float"),e("OES_texture_half_float"),e("OES_texture_half_float_linear"),e("OES_standard_derivatives"),e("OES_element_index_uint"),e("OES_vertex_array_object"),e("ANGLE_instanced_arrays")),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture")},get:function(n){let s=e(n);return s===null&&console.warn("THREE.WebGLRenderer: "+n+" extension not supported."),s}}}function OM(i,t,e,n){let s={},r=new WeakMap;function a(f){let m=f.target;m.index!==null&&t.remove(m.index);for(let y in m.attributes)t.remove(m.attributes[y]);for(let y in m.morphAttributes){let v=m.morphAttributes[y];for(let p=0,x=v.length;p<x;p++)t.remove(v[p])}m.removeEventListener("dispose",a),delete s[m.id];let d=r.get(m);d&&(t.remove(d),r.delete(m)),n.releaseStatesOfGeometry(m),m.isInstancedBufferGeometry===!0&&delete m._maxInstanceCount,e.memory.geometries--}function o(f,m){return s[m.id]===!0||(m.addEventListener("dispose",a),s[m.id]=!0,e.memory.geometries++),m}function l(f){let m=f.attributes;for(let y in m)t.update(m[y],i.ARRAY_BUFFER);let d=f.morphAttributes;for(let y in d){let v=d[y];for(let p=0,x=v.length;p<x;p++)t.update(v[p],i.ARRAY_BUFFER)}}function h(f){let m=[],d=f.index,y=f.attributes.position,v=0;if(d!==null){let T=d.array;v=d.version;for(let M=0,C=T.length;M<C;M+=3){let P=T[M+0],I=T[M+1],z=T[M+2];m.push(P,I,I,z,z,P)}}else if(y!==void 0){let T=y.array;v=y.version;for(let M=0,C=T.length/3-1;M<C;M+=3){let P=M+0,I=M+1,z=M+2;m.push(P,I,I,z,z,P)}}else return;let p=new(J0(m)?nh:eh)(m,1);p.version=v;let x=r.get(f);x&&t.remove(x),r.set(f,p)}function u(f){let m=r.get(f);if(m){let d=f.index;d!==null&&m.version<d.version&&h(f)}else h(f);return r.get(f)}return{get:o,update:l,getWireframeAttribute:u}}function FM(i,t,e,n){let s=n.isWebGL2,r;function a(d){r=d}let o,l;function h(d){o=d.type,l=d.bytesPerElement}function u(d,y){i.drawElements(r,y,o,d*l),e.update(y,r,1)}function f(d,y,v){if(v===0)return;let p,x;if(s)p=i,x="drawElementsInstanced";else if(p=t.get("ANGLE_instanced_arrays"),x="drawElementsInstancedANGLE",p===null){console.error("THREE.WebGLIndexedBufferRenderer: using THREE.InstancedBufferGeometry but hardware does not support extension ANGLE_instanced_arrays.");return}p[x](r,y,o,d*l,v),e.update(y,r,v)}function m(d,y,v){if(v===0)return;let p=t.get("WEBGL_multi_draw");if(p===null)for(let x=0;x<v;x++)this.render(d[x]/l,y[x]);else{p.multiDrawElementsWEBGL(r,y,0,o,d,0,v);let x=0;for(let T=0;T<v;T++)x+=y[T];e.update(x,r,1)}}this.setMode=a,this.setIndex=h,this.render=u,this.renderInstances=f,this.renderMultiDraw=m}function BM(i){let t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(r,a,o){switch(e.calls++,a){case i.TRIANGLES:e.triangles+=o*(r/3);break;case i.LINES:e.lines+=o*(r/2);break;case i.LINE_STRIP:e.lines+=o*(r-1);break;case i.LINE_LOOP:e.lines+=o*r;break;case i.POINTS:e.points+=o*r;break;default:console.error("THREE.WebGLInfo: Unknown draw mode:",a);break}}function s(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:s,update:n}}function zM(i,t){return i[0]-t[0]}function kM(i,t){return Math.abs(t[1])-Math.abs(i[1])}function HM(i,t,e){let n={},s=new Float32Array(8),r=new WeakMap,a=new Fn,o=[];for(let h=0;h<8;h++)o[h]=[h,0];function l(h,u,f){let m=h.morphTargetInfluences;if(t.isWebGL2===!0){let d=u.morphAttributes.position||u.morphAttributes.normal||u.morphAttributes.color,y=d!==void 0?d.length:0,v=r.get(u);if(v===void 0||v.count!==y){let et=function(){wt.dispose(),r.delete(u),u.removeEventListener("dispose",et)};v!==void 0&&v.texture.dispose();let T=u.morphAttributes.position!==void 0,M=u.morphAttributes.normal!==void 0,C=u.morphAttributes.color!==void 0,P=u.morphAttributes.position||[],I=u.morphAttributes.normal||[],z=u.morphAttributes.color||[],nt=0;T===!0&&(nt=1),M===!0&&(nt=2),C===!0&&(nt=3);let R=u.attributes.position.count*nt,w=1;R>t.maxTextureSize&&(w=Math.ceil(R/t.maxTextureSize),R=t.maxTextureSize);let at=new Float32Array(R*w*4*y),wt=new Qc(at,R,w,y);wt.type=jr,wt.needsUpdate=!0;let ce=nt*4;for(let ft=0;ft<y;ft++){let Rt=P[ft],Xt=I[ft],Qt=z[ft],Lt=R*w*4*ft;for(let jt=0;jt<Rt.count;jt++){let fe=jt*ce;T===!0&&(a.fromBufferAttribute(Rt,jt),at[Lt+fe+0]=a.x,at[Lt+fe+1]=a.y,at[Lt+fe+2]=a.z,at[Lt+fe+3]=0),M===!0&&(a.fromBufferAttribute(Xt,jt),at[Lt+fe+4]=a.x,at[Lt+fe+5]=a.y,at[Lt+fe+6]=a.z,at[Lt+fe+7]=0),C===!0&&(a.fromBufferAttribute(Qt,jt),at[Lt+fe+8]=a.x,at[Lt+fe+9]=a.y,at[Lt+fe+10]=a.z,at[Lt+fe+11]=Qt.itemSize===4?a.w:1)}}v={count:y,texture:wt,size:new de(R,w)},r.set(u,v),u.addEventListener("dispose",et)}let p=0;for(let T=0;T<m.length;T++)p+=m[T];let x=u.morphTargetsRelative?1:1-p;f.getUniforms().setValue(i,"morphTargetBaseInfluence",x),f.getUniforms().setValue(i,"morphTargetInfluences",m),f.getUniforms().setValue(i,"morphTargetsTexture",v.texture,e),f.getUniforms().setValue(i,"morphTargetsTextureSize",v.size)}else{let d=m===void 0?0:m.length,y=n[u.id];if(y===void 0||y.length!==d){y=[];for(let M=0;M<d;M++)y[M]=[M,0];n[u.id]=y}for(let M=0;M<d;M++){let C=y[M];C[0]=M,C[1]=m[M]}y.sort(kM);for(let M=0;M<8;M++)M<d&&y[M][1]?(o[M][0]=y[M][0],o[M][1]=y[M][1]):(o[M][0]=Number.MAX_SAFE_INTEGER,o[M][1]=0);o.sort(zM);let v=u.morphAttributes.position,p=u.morphAttributes.normal,x=0;for(let M=0;M<8;M++){let C=o[M],P=C[0],I=C[1];P!==Number.MAX_SAFE_INTEGER&&I?(v&&u.getAttribute("morphTarget"+M)!==v[P]&&u.setAttribute("morphTarget"+M,v[P]),p&&u.getAttribute("morphNormal"+M)!==p[P]&&u.setAttribute("morphNormal"+M,p[P]),s[M]=I,x+=I):(v&&u.hasAttribute("morphTarget"+M)===!0&&u.deleteAttribute("morphTarget"+M),p&&u.hasAttribute("morphNormal"+M)===!0&&u.deleteAttribute("morphNormal"+M),s[M]=0)}let T=u.morphTargetsRelative?1:1-x;f.getUniforms().setValue(i,"morphTargetBaseInfluence",T),f.getUniforms().setValue(i,"morphTargetInfluences",s)}}return{update:l}}function VM(i,t,e,n){let s=new WeakMap;function r(l){let h=n.render.frame,u=l.geometry,f=t.get(l,u);if(s.get(f)!==h&&(t.update(f),s.set(f,h)),l.isInstancedMesh&&(l.hasEventListener("dispose",o)===!1&&l.addEventListener("dispose",o),s.get(l)!==h&&(e.update(l.instanceMatrix,i.ARRAY_BUFFER),l.instanceColor!==null&&e.update(l.instanceColor,i.ARRAY_BUFFER),s.set(l,h))),l.isSkinnedMesh){let m=l.skeleton;s.get(m)!==h&&(m.update(),s.set(m,h))}return f}function a(){s=new WeakMap}function o(l){let h=l.target;h.removeEventListener("dispose",o),e.remove(h.instanceMatrix),h.instanceColor!==null&&e.remove(h.instanceColor)}return{update:r,dispose:a}}var ah=class extends As{constructor(t,e,n,s,r,a,o,l,h,u){if(u=u!==void 0?u:wo,u!==wo&&u!==Ea)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");n===void 0&&u===wo&&(n=Jr),n===void 0&&u===Ea&&(n=Eo),super(null,s,r,a,o,l,u,n,h),this.isDepthTexture=!0,this.image={width:t,height:e},this.magFilter=o!==void 0?o:Pi,this.minFilter=l!==void 0?l:Pi,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.compareFunction=t.compareFunction,this}toJSON(t){let e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}},tg=new As,eg=new ah(1,1);eg.compareFunction=Z0;var ng=new Qc,ig=new If,sg=new sh,l0=[],c0=[],h0=new Float32Array(16),u0=new Float32Array(9),f0=new Float32Array(4);function Ra(i,t,e){let n=i[0];if(n<=0||n>0)return i;let s=t*e,r=l0[s];if(r===void 0&&(r=new Float32Array(s),l0[s]=r),t!==0){n.toArray(r,0);for(let a=1,o=0;a!==t;++a)o+=e,i[a].toArray(r,o)}return r}function Ii(i,t){if(i.length!==t.length)return!1;for(let e=0,n=i.length;e<n;e++)if(i[e]!==t[e])return!1;return!0}function Di(i,t){for(let e=0,n=t.length;e<n;e++)i[e]=t[e]}function zh(i,t){let e=c0[t];e===void 0&&(e=new Int32Array(t),c0[t]=e);for(let n=0;n!==t;++n)e[n]=i.allocateTextureUnit();return e}function GM(i,t){let e=this.cache;e[0]!==t&&(i.uniform1f(this.addr,t),e[0]=t)}function WM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ii(e,t))return;i.uniform2fv(this.addr,t),Di(e,t)}}function XM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(i.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Ii(e,t))return;i.uniform3fv(this.addr,t),Di(e,t)}}function qM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ii(e,t))return;i.uniform4fv(this.addr,t),Di(e,t)}}function YM(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ii(e,t))return;i.uniformMatrix2fv(this.addr,!1,t),Di(e,t)}else{if(Ii(e,n))return;f0.set(n),i.uniformMatrix2fv(this.addr,!1,f0),Di(e,n)}}function $M(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ii(e,t))return;i.uniformMatrix3fv(this.addr,!1,t),Di(e,t)}else{if(Ii(e,n))return;u0.set(n),i.uniformMatrix3fv(this.addr,!1,u0),Di(e,n)}}function ZM(i,t){let e=this.cache,n=t.elements;if(n===void 0){if(Ii(e,t))return;i.uniformMatrix4fv(this.addr,!1,t),Di(e,t)}else{if(Ii(e,n))return;h0.set(n),i.uniformMatrix4fv(this.addr,!1,h0),Di(e,n)}}function JM(i,t){let e=this.cache;e[0]!==t&&(i.uniform1i(this.addr,t),e[0]=t)}function jM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ii(e,t))return;i.uniform2iv(this.addr,t),Di(e,t)}}function KM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ii(e,t))return;i.uniform3iv(this.addr,t),Di(e,t)}}function QM(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ii(e,t))return;i.uniform4iv(this.addr,t),Di(e,t)}}function tb(i,t){let e=this.cache;e[0]!==t&&(i.uniform1ui(this.addr,t),e[0]=t)}function eb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(i.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Ii(e,t))return;i.uniform2uiv(this.addr,t),Di(e,t)}}function nb(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(i.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Ii(e,t))return;i.uniform3uiv(this.addr,t),Di(e,t)}}function ib(i,t){let e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(i.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Ii(e,t))return;i.uniform4uiv(this.addr,t),Di(e,t)}}function sb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s);let r=this.type===i.SAMPLER_2D_SHADOW?eg:tg;e.setTexture2D(t||r,s)}function rb(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture3D(t||ig,s)}function ob(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTextureCube(t||sg,s)}function ab(i,t,e){let n=this.cache,s=e.allocateTextureUnit();n[0]!==s&&(i.uniform1i(this.addr,s),n[0]=s),e.setTexture2DArray(t||ng,s)}function lb(i){switch(i){case 5126:return GM;case 35664:return WM;case 35665:return XM;case 35666:return qM;case 35674:return YM;case 35675:return $M;case 35676:return ZM;case 5124:case 35670:return JM;case 35667:case 35671:return jM;case 35668:case 35672:return KM;case 35669:case 35673:return QM;case 5125:return tb;case 36294:return eb;case 36295:return nb;case 36296:return ib;case 35678:case 36198:case 36298:case 36306:case 35682:return sb;case 35679:case 36299:case 36307:return rb;case 35680:case 36300:case 36308:case 36293:return ob;case 36289:case 36303:case 36311:case 36292:return ab}}function cb(i,t){i.uniform1fv(this.addr,t)}function hb(i,t){let e=Ra(t,this.size,2);i.uniform2fv(this.addr,e)}function ub(i,t){let e=Ra(t,this.size,3);i.uniform3fv(this.addr,e)}function fb(i,t){let e=Ra(t,this.size,4);i.uniform4fv(this.addr,e)}function db(i,t){let e=Ra(t,this.size,4);i.uniformMatrix2fv(this.addr,!1,e)}function pb(i,t){let e=Ra(t,this.size,9);i.uniformMatrix3fv(this.addr,!1,e)}function mb(i,t){let e=Ra(t,this.size,16);i.uniformMatrix4fv(this.addr,!1,e)}function gb(i,t){i.uniform1iv(this.addr,t)}function xb(i,t){i.uniform2iv(this.addr,t)}function yb(i,t){i.uniform3iv(this.addr,t)}function _b(i,t){i.uniform4iv(this.addr,t)}function vb(i,t){i.uniform1uiv(this.addr,t)}function Mb(i,t){i.uniform2uiv(this.addr,t)}function bb(i,t){i.uniform3uiv(this.addr,t)}function Sb(i,t){i.uniform4uiv(this.addr,t)}function Eb(i,t,e){let n=this.cache,s=t.length,r=zh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTexture2D(t[a]||tg,r[a])}function wb(i,t,e){let n=this.cache,s=t.length,r=zh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTexture3D(t[a]||ig,r[a])}function Tb(i,t,e){let n=this.cache,s=t.length,r=zh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTextureCube(t[a]||sg,r[a])}function Ab(i,t,e){let n=this.cache,s=t.length,r=zh(e,s);Ii(n,r)||(i.uniform1iv(this.addr,r),Di(n,r));for(let a=0;a!==s;++a)e.setTexture2DArray(t[a]||ng,r[a])}function Rb(i){switch(i){case 5126:return cb;case 35664:return hb;case 35665:return ub;case 35666:return fb;case 35674:return db;case 35675:return pb;case 35676:return mb;case 5124:case 35670:return gb;case 35667:case 35671:return xb;case 35668:case 35672:return yb;case 35669:case 35673:return _b;case 5125:return vb;case 36294:return Mb;case 36295:return bb;case 36296:return Sb;case 35678:case 36198:case 36298:case 36306:case 35682:return Eb;case 35679:case 36299:case 36307:return wb;case 35680:case 36300:case 36308:case 36293:return Tb;case 36289:case 36303:case 36311:case 36292:return Ab}}var Nf=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=lb(e.type)}},Of=class{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=Rb(e.type)}},Ff=class{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){let s=this.seq;for(let r=0,a=s.length;r!==a;++r){let o=s[r];o.setValue(t,e[o.id],n)}}},xf=/(\w+)(\])?(\[|\.)?/g;function d0(i,t){i.seq.push(t),i.map[t.id]=t}function Cb(i,t,e){let n=i.name,s=n.length;for(xf.lastIndex=0;;){let r=xf.exec(n),a=xf.lastIndex,o=r[1],l=r[2]==="]",h=r[3];if(l&&(o=o|0),h===void 0||h==="["&&a+2===s){d0(e,h===void 0?new Nf(o,i,t):new Of(o,i,t));break}else{let f=e.map[o];f===void 0&&(f=new Ff(o),d0(e,f)),e=f}}}var Ma=class{constructor(t,e){this.seq=[],this.map={};let n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let s=0;s<n;++s){let r=t.getActiveUniform(e,s),a=t.getUniformLocation(e,r.name);Cb(r,a,this)}}setValue(t,e,n,s){let r=this.map[e];r!==void 0&&r.setValue(t,n,s)}setOptional(t,e,n){let s=e[n];s!==void 0&&this.setValue(t,n,s)}static upload(t,e,n,s){for(let r=0,a=e.length;r!==a;++r){let o=e[r],l=n[o.id];l.needsUpdate!==!1&&o.setValue(t,l.value,s)}}static seqWithValue(t,e){let n=[];for(let s=0,r=t.length;s!==r;++s){let a=t[s];a.id in e&&n.push(a)}return n}};function p0(i,t,e){let n=i.createShader(t);return i.shaderSource(n,e),i.compileShader(n),n}var Pb=37297,Lb=0;function Ib(i,t){let e=i.split(`
`),n=[],s=Math.max(t-6,0),r=Math.min(t+6,e.length);for(let a=s;a<r;a++){let o=a+1;n.push(`${o===t?">":" "} ${o}: ${e[a]}`)}return n.join(`
`)}function Db(i){let t=Wn.getPrimaries(Wn.workingColorSpace),e=Wn.getPrimaries(i),n;switch(t===e?n="":t===Yc&&e===qc?n="LinearDisplayP3ToLinearSRGB":t===qc&&e===Yc&&(n="LinearSRGBToLinearDisplayP3"),i){case Lr:case Oh:return[n,"LinearTransferOETF"];case kn:case xd:return[n,"sRGBTransferOETF"];default:return console.warn("THREE.WebGLProgram: Unsupported color space:",i),[n,"LinearTransferOETF"]}}function m0(i,t,e){let n=i.getShaderParameter(t,i.COMPILE_STATUS),s=i.getShaderInfoLog(t).trim();if(n&&s==="")return"";let r=/ERROR: 0:(\d+)/.exec(s);if(r){let a=parseInt(r[1]);return e.toUpperCase()+`

`+s+`

`+Ib(i.getShaderSource(t),a)}else return s}function Ub(i,t){let e=Db(t);return`vec4 ${i}( vec4 value ) { return ${e[0]}( ${e[1]}( value ) ); }`}function Nb(i,t){let e;switch(t){case V1:e="Linear";break;case G1:e="Reinhard";break;case W1:e="OptimizedCineon";break;case md:e="ACESFilmic";break;case q1:e="AgX";break;case X1:e="Custom";break;default:console.warn("THREE.WebGLProgram: Unsupported toneMapping:",t),e="Linear"}return"vec3 "+i+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}function Ob(i){return[i.extensionDerivatives||i.envMapCubeUVHeight||i.bumpMap||i.normalMapTangentSpace||i.clearcoatNormalMap||i.flatShading||i.shaderID==="physical"?"#extension GL_OES_standard_derivatives : enable":"",(i.extensionFragDepth||i.logarithmicDepthBuffer)&&i.rendererExtensionFragDepth?"#extension GL_EXT_frag_depth : enable":"",i.extensionDrawBuffers&&i.rendererExtensionDrawBuffers?"#extension GL_EXT_draw_buffers : require":"",(i.extensionShaderTextureLOD||i.envMap||i.transmission)&&i.rendererExtensionShaderTextureLod?"#extension GL_EXT_shader_texture_lod : enable":""].filter(xa).join(`
`)}function Fb(i){return[i.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":""].filter(xa).join(`
`)}function Bb(i){let t=[];for(let e in i){let n=i[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function zb(i,t){let e={},n=i.getProgramParameter(t,i.ACTIVE_ATTRIBUTES);for(let s=0;s<n;s++){let r=i.getActiveAttrib(t,s),a=r.name,o=1;r.type===i.FLOAT_MAT2&&(o=2),r.type===i.FLOAT_MAT3&&(o=3),r.type===i.FLOAT_MAT4&&(o=4),e[a]={type:r.type,location:i.getAttribLocation(t,a),locationSize:o}}return e}function xa(i){return i!==""}function g0(i,t){let e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return i.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function x0(i,t){return i.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}var kb=/^[ \t]*#include +<([\w\d./]+)>/gm;function Bf(i){return i.replace(kb,Vb)}var Hb=new Map([["encodings_fragment","colorspace_fragment"],["encodings_pars_fragment","colorspace_pars_fragment"],["output_fragment","opaque_fragment"]]);function Vb(i,t){let e=Mn[t];if(e===void 0){let n=Hb.get(t);if(n!==void 0)e=Mn[n],console.warn('THREE.WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Bf(e)}var Gb=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function y0(i){return i.replace(Gb,Wb)}function Wb(i,t,e,n){let s="";for(let r=parseInt(t);r<parseInt(e);r++)s+=n.replace(/\[\s*i\s*\]/g,"[ "+r+" ]").replace(/UNROLLED_LOOP_INDEX/g,r);return s}function _0(i){let t="precision "+i.precision+` float;
precision `+i.precision+" int;";return i.precision==="highp"?t+=`
#define HIGH_PRECISION`:i.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:i.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}function Xb(i){let t="SHADOWMAP_TYPE_BASIC";return i.shadowMapType===z0?t="SHADOWMAP_TYPE_PCF":i.shadowMapType===dd?t="SHADOWMAP_TYPE_PCF_SOFT":i.shadowMapType===Cr&&(t="SHADOWMAP_TYPE_VSM"),t}function qb(i){let t="ENVMAP_TYPE_CUBE";if(i.envMap)switch(i.envMapMode){case ba:case Sa:t="ENVMAP_TYPE_CUBE";break;case Uh:t="ENVMAP_TYPE_CUBE_UV";break}return t}function Yb(i){let t="ENVMAP_MODE_REFLECTION";if(i.envMap)switch(i.envMapMode){case Sa:t="ENVMAP_MODE_REFRACTION";break}return t}function $b(i){let t="ENVMAP_BLENDING_NONE";if(i.envMap)switch(i.combine){case pd:t="ENVMAP_BLENDING_MULTIPLY";break;case k1:t="ENVMAP_BLENDING_MIX";break;case H1:t="ENVMAP_BLENDING_ADD";break}return t}function Zb(i){let t=i.envMapCubeUVHeight;if(t===null)return null;let e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),112)),texelHeight:n,maxMip:e}}function Jb(i,t,e,n){let s=i.getContext(),r=e.defines,a=e.vertexShader,o=e.fragmentShader,l=Xb(e),h=qb(e),u=Yb(e),f=$b(e),m=Zb(e),d=e.isWebGL2?"":Ob(e),y=Fb(e),v=Bb(r),p=s.createProgram(),x,T,M=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(x=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(xa).join(`
`),x.length>0&&(x+=`
`),T=[d,"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v].filter(xa).join(`
`),T.length>0&&(T+=`
`)):(x=[_0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+u:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors&&e.isWebGL2?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE":"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0&&e.isWebGL2?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#if ( defined( USE_MORPHTARGETS ) && ! defined( MORPHTARGETS_TEXTURE ) )","	attribute vec3 morphTarget0;","	attribute vec3 morphTarget1;","	attribute vec3 morphTarget2;","	attribute vec3 morphTarget3;","	#ifdef USE_MORPHNORMALS","		attribute vec3 morphNormal0;","		attribute vec3 morphNormal1;","		attribute vec3 morphNormal2;","		attribute vec3 morphNormal3;","	#else","		attribute vec3 morphTarget4;","		attribute vec3 morphTarget5;","		attribute vec3 morphTarget6;","		attribute vec3 morphTarget7;","	#endif","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(xa).join(`
`),T=[d,_0(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,v,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+h:"",e.envMap?"#define "+u:"",e.envMap?"#define "+f:"",m?"#define CUBEUV_TEXEL_WIDTH "+m.texelWidth:"",m?"#define CUBEUV_TEXEL_HEIGHT "+m.texelHeight:"",m?"#define CUBEUV_MAX_MIP "+m.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.useLegacyLights?"#define LEGACY_LIGHTS":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.logarithmicDepthBuffer?"#define USE_LOGDEPTHBUF":"",e.logarithmicDepthBuffer&&e.rendererExtensionFragDepth?"#define USE_LOGDEPTHBUF_EXT":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==Qr?"#define TONE_MAPPING":"",e.toneMapping!==Qr?Mn.tonemapping_pars_fragment:"",e.toneMapping!==Qr?Nb("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Mn.colorspace_pars_fragment,Ub("linearToOutputTexel",e.outputColorSpace),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(xa).join(`
`)),a=Bf(a),a=g0(a,e),a=x0(a,e),o=Bf(o),o=g0(o,e),o=x0(o,e),a=y0(a),o=y0(o),e.isWebGL2&&e.isRawShaderMaterial!==!0&&(M=`#version 300 es
`,x=[y,"precision mediump sampler2DArray;","#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+x,T=["precision mediump sampler2DArray;","#define varying in",e.glslVersion===Bm?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Bm?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+T);let C=M+x+a,P=M+T+o,I=p0(s,s.VERTEX_SHADER,C),z=p0(s,s.FRAGMENT_SHADER,P);s.attachShader(p,I),s.attachShader(p,z),e.index0AttributeName!==void 0?s.bindAttribLocation(p,0,e.index0AttributeName):e.morphTargets===!0&&s.bindAttribLocation(p,0,"position"),s.linkProgram(p);function nt(wt){if(i.debug.checkShaderErrors){let ce=s.getProgramInfoLog(p).trim(),et=s.getShaderInfoLog(I).trim(),ft=s.getShaderInfoLog(z).trim(),Rt=!0,Xt=!0;if(s.getProgramParameter(p,s.LINK_STATUS)===!1)if(Rt=!1,typeof i.debug.onShaderError=="function")i.debug.onShaderError(s,p,I,z);else{let Qt=m0(s,I,"vertex"),Lt=m0(s,z,"fragment");console.error("THREE.WebGLProgram: Shader Error "+s.getError()+" - VALIDATE_STATUS "+s.getProgramParameter(p,s.VALIDATE_STATUS)+`

Program Info Log: `+ce+`
`+Qt+`
`+Lt)}else ce!==""?console.warn("THREE.WebGLProgram: Program Info Log:",ce):(et===""||ft==="")&&(Xt=!1);Xt&&(wt.diagnostics={runnable:Rt,programLog:ce,vertexShader:{log:et,prefix:x},fragmentShader:{log:ft,prefix:T}})}s.deleteShader(I),s.deleteShader(z),R=new Ma(s,p),w=zb(s,p)}let R;this.getUniforms=function(){return R===void 0&&nt(this),R};let w;this.getAttributes=function(){return w===void 0&&nt(this),w};let at=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return at===!1&&(at=s.getProgramParameter(p,Pb)),at},this.destroy=function(){n.releaseStatesOfProgram(this),s.deleteProgram(p),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=Lb++,this.cacheKey=t,this.usedTimes=1,this.program=p,this.vertexShader=I,this.fragmentShader=z,this}var jb=0,zf=class{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){let e=t.vertexShader,n=t.fragmentShader,s=this._getShaderStage(e),r=this._getShaderStage(n),a=this._getShaderCacheForMaterial(t);return a.has(s)===!1&&(a.add(s),s.usedTimes++),a.has(r)===!1&&(a.add(r),r.usedTimes++),this}remove(t){let e=this.materialCache.get(t);for(let n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){let e=this.materialCache,n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){let e=this.shaderCache,n=e.get(t);return n===void 0&&(n=new kf(t),e.set(t,n)),n}},kf=class{constructor(t){this.id=jb++,this.code=t,this.usedTimes=0}};function Kb(i,t,e,n,s,r,a){let o=new vl,l=new zf,h=[],u=s.isWebGL2,f=s.logarithmicDepthBuffer,m=s.vertexTextures,d=s.precision,y={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distanceRGBA",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function v(R){return R===0?"uv":`uv${R}`}function p(R,w,at,wt,ce){let et=wt.fog,ft=ce.geometry,Rt=R.isMeshStandardMaterial?wt.environment:null,Xt=(R.isMeshStandardMaterial?e:t).get(R.envMap||Rt),Qt=Xt&&Xt.mapping===Uh?Xt.image.height:null,Lt=y[R.type];R.precision!==null&&(d=s.getMaxPrecision(R.precision),d!==R.precision&&console.warn("THREE.WebGLProgram.getParameters:",R.precision,"not supported, using",d,"instead."));let jt=ft.morphAttributes.position||ft.morphAttributes.normal||ft.morphAttributes.color,fe=jt!==void 0?jt.length:0,we=0;ft.morphAttributes.position!==void 0&&(we=1),ft.morphAttributes.normal!==void 0&&(we=2),ft.morphAttributes.color!==void 0&&(we=3);let Ct,It,se,Le;if(Lt){let ze=rs[Lt];Ct=ze.vertexShader,It=ze.fragmentShader}else Ct=R.vertexShader,It=R.fragmentShader,l.update(R),se=l.getVertexShaderID(R),Le=l.getFragmentShaderID(R);let Ne=i.getRenderTarget(),sn=ce.isInstancedMesh===!0,on=ce.isBatchedMesh===!0,Ve=!!R.map,We=!!R.matcap,K=!!Xt,be=!!R.aoMap,lt=!!R.lightMap,_e=!!R.bumpMap,$t=!!R.normalMap,Be=!!R.displacementMap,Me=!!R.emissiveMap,O=!!R.metalnessMap,L=!!R.roughnessMap,yt=R.anisotropy>0,ye=R.clearcoat>0,pe=R.iridescence>0,he=R.sheen>0,Ge=R.transmission>0,qt=yt&&!!R.anisotropyMap,Ee=ye&&!!R.clearcoatMap,$e=ye&&!!R.clearcoatNormalMap,tn=ye&&!!R.clearcoatRoughnessMap,me=pe&&!!R.iridescenceMap,gn=pe&&!!R.iridescenceThicknessMap,G=he&&!!R.sheenColorMap,ue=he&&!!R.sheenRoughnessMap,ve=!!R.specularMap,tt=!!R.specularColorMap,dt=!!R.specularIntensityMap,Zt=Ge&&!!R.transmissionMap,Kt=Ge&&!!R.thicknessMap,te=!!R.gradientMap,ct=!!R.alphaMap,V=R.alphaTest>0,Pt=!!R.alphaHash,zt=!!R.extensions,re=!!ft.attributes.uv1,ae=!!ft.attributes.uv2,Ie=!!ft.attributes.uv3,Jt=Qr;return R.toneMapped&&(Ne===null||Ne.isXRRenderTarget===!0)&&(Jt=i.toneMapping),{isWebGL2:u,shaderID:Lt,shaderType:R.type,shaderName:R.name,vertexShader:Ct,fragmentShader:It,defines:R.defines,customVertexShaderID:se,customFragmentShaderID:Le,isRawShaderMaterial:R.isRawShaderMaterial===!0,glslVersion:R.glslVersion,precision:d,batching:on,instancing:sn,instancingColor:sn&&ce.instanceColor!==null,supportsVertexTextures:m,outputColorSpace:Ne===null?i.outputColorSpace:Ne.isXRRenderTarget===!0?Ne.texture.colorSpace:Lr,map:Ve,matcap:We,envMap:K,envMapMode:K&&Xt.mapping,envMapCubeUVHeight:Qt,aoMap:be,lightMap:lt,bumpMap:_e,normalMap:$t,displacementMap:m&&Be,emissiveMap:Me,normalMapObjectSpace:$t&&R.normalMapType===sy,normalMapTangentSpace:$t&&R.normalMapType===Nh,metalnessMap:O,roughnessMap:L,anisotropy:yt,anisotropyMap:qt,clearcoat:ye,clearcoatMap:Ee,clearcoatNormalMap:$e,clearcoatRoughnessMap:tn,iridescence:pe,iridescenceMap:me,iridescenceThicknessMap:gn,sheen:he,sheenColorMap:G,sheenRoughnessMap:ue,specularMap:ve,specularColorMap:tt,specularIntensityMap:dt,transmission:Ge,transmissionMap:Zt,thicknessMap:Kt,gradientMap:te,opaque:R.transparent===!1&&R.blending===_a,alphaMap:ct,alphaTest:V,alphaHash:Pt,combine:R.combine,mapUv:Ve&&v(R.map.channel),aoMapUv:be&&v(R.aoMap.channel),lightMapUv:lt&&v(R.lightMap.channel),bumpMapUv:_e&&v(R.bumpMap.channel),normalMapUv:$t&&v(R.normalMap.channel),displacementMapUv:Be&&v(R.displacementMap.channel),emissiveMapUv:Me&&v(R.emissiveMap.channel),metalnessMapUv:O&&v(R.metalnessMap.channel),roughnessMapUv:L&&v(R.roughnessMap.channel),anisotropyMapUv:qt&&v(R.anisotropyMap.channel),clearcoatMapUv:Ee&&v(R.clearcoatMap.channel),clearcoatNormalMapUv:$e&&v(R.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:tn&&v(R.clearcoatRoughnessMap.channel),iridescenceMapUv:me&&v(R.iridescenceMap.channel),iridescenceThicknessMapUv:gn&&v(R.iridescenceThicknessMap.channel),sheenColorMapUv:G&&v(R.sheenColorMap.channel),sheenRoughnessMapUv:ue&&v(R.sheenRoughnessMap.channel),specularMapUv:ve&&v(R.specularMap.channel),specularColorMapUv:tt&&v(R.specularColorMap.channel),specularIntensityMapUv:dt&&v(R.specularIntensityMap.channel),transmissionMapUv:Zt&&v(R.transmissionMap.channel),thicknessMapUv:Kt&&v(R.thicknessMap.channel),alphaMapUv:ct&&v(R.alphaMap.channel),vertexTangents:!!ft.attributes.tangent&&($t||yt),vertexColors:R.vertexColors,vertexAlphas:R.vertexColors===!0&&!!ft.attributes.color&&ft.attributes.color.itemSize===4,vertexUv1s:re,vertexUv2s:ae,vertexUv3s:Ie,pointsUvs:ce.isPoints===!0&&!!ft.attributes.uv&&(Ve||ct),fog:!!et,useFog:R.fog===!0,fogExp2:et&&et.isFogExp2,flatShading:R.flatShading===!0,sizeAttenuation:R.sizeAttenuation===!0,logarithmicDepthBuffer:f,skinning:ce.isSkinnedMesh===!0,morphTargets:ft.morphAttributes.position!==void 0,morphNormals:ft.morphAttributes.normal!==void 0,morphColors:ft.morphAttributes.color!==void 0,morphTargetsCount:fe,morphTextureStride:we,numDirLights:w.directional.length,numPointLights:w.point.length,numSpotLights:w.spot.length,numSpotLightMaps:w.spotLightMap.length,numRectAreaLights:w.rectArea.length,numHemiLights:w.hemi.length,numDirLightShadows:w.directionalShadowMap.length,numPointLightShadows:w.pointShadowMap.length,numSpotLightShadows:w.spotShadowMap.length,numSpotLightShadowsWithMaps:w.numSpotLightShadowsWithMaps,numLightProbes:w.numLightProbes,numClippingPlanes:a.numPlanes,numClipIntersection:a.numIntersection,dithering:R.dithering,shadowMapEnabled:i.shadowMap.enabled&&at.length>0,shadowMapType:i.shadowMap.type,toneMapping:Jt,useLegacyLights:i._useLegacyLights,decodeVideoTexture:Ve&&R.map.isVideoTexture===!0&&Wn.getTransfer(R.map.colorSpace)===oi,premultipliedAlpha:R.premultipliedAlpha,doubleSided:R.side===mn,flipSided:R.side===gs,useDepthPacking:R.depthPacking>=0,depthPacking:R.depthPacking||0,index0AttributeName:R.index0AttributeName,extensionDerivatives:zt&&R.extensions.derivatives===!0,extensionFragDepth:zt&&R.extensions.fragDepth===!0,extensionDrawBuffers:zt&&R.extensions.drawBuffers===!0,extensionShaderTextureLOD:zt&&R.extensions.shaderTextureLOD===!0,extensionClipCullDistance:zt&&R.extensions.clipCullDistance&&n.has("WEBGL_clip_cull_distance"),rendererExtensionFragDepth:u||n.has("EXT_frag_depth"),rendererExtensionDrawBuffers:u||n.has("WEBGL_draw_buffers"),rendererExtensionShaderTextureLod:u||n.has("EXT_shader_texture_lod"),rendererExtensionParallelShaderCompile:n.has("KHR_parallel_shader_compile"),customProgramCacheKey:R.customProgramCacheKey()}}function x(R){let w=[];if(R.shaderID?w.push(R.shaderID):(w.push(R.customVertexShaderID),w.push(R.customFragmentShaderID)),R.defines!==void 0)for(let at in R.defines)w.push(at),w.push(R.defines[at]);return R.isRawShaderMaterial===!1&&(T(w,R),M(w,R),w.push(i.outputColorSpace)),w.push(R.customProgramCacheKey),w.join()}function T(R,w){R.push(w.precision),R.push(w.outputColorSpace),R.push(w.envMapMode),R.push(w.envMapCubeUVHeight),R.push(w.mapUv),R.push(w.alphaMapUv),R.push(w.lightMapUv),R.push(w.aoMapUv),R.push(w.bumpMapUv),R.push(w.normalMapUv),R.push(w.displacementMapUv),R.push(w.emissiveMapUv),R.push(w.metalnessMapUv),R.push(w.roughnessMapUv),R.push(w.anisotropyMapUv),R.push(w.clearcoatMapUv),R.push(w.clearcoatNormalMapUv),R.push(w.clearcoatRoughnessMapUv),R.push(w.iridescenceMapUv),R.push(w.iridescenceThicknessMapUv),R.push(w.sheenColorMapUv),R.push(w.sheenRoughnessMapUv),R.push(w.specularMapUv),R.push(w.specularColorMapUv),R.push(w.specularIntensityMapUv),R.push(w.transmissionMapUv),R.push(w.thicknessMapUv),R.push(w.combine),R.push(w.fogExp2),R.push(w.sizeAttenuation),R.push(w.morphTargetsCount),R.push(w.morphAttributeCount),R.push(w.numDirLights),R.push(w.numPointLights),R.push(w.numSpotLights),R.push(w.numSpotLightMaps),R.push(w.numHemiLights),R.push(w.numRectAreaLights),R.push(w.numDirLightShadows),R.push(w.numPointLightShadows),R.push(w.numSpotLightShadows),R.push(w.numSpotLightShadowsWithMaps),R.push(w.numLightProbes),R.push(w.shadowMapType),R.push(w.toneMapping),R.push(w.numClippingPlanes),R.push(w.numClipIntersection),R.push(w.depthPacking)}function M(R,w){o.disableAll(),w.isWebGL2&&o.enable(0),w.supportsVertexTextures&&o.enable(1),w.instancing&&o.enable(2),w.instancingColor&&o.enable(3),w.matcap&&o.enable(4),w.envMap&&o.enable(5),w.normalMapObjectSpace&&o.enable(6),w.normalMapTangentSpace&&o.enable(7),w.clearcoat&&o.enable(8),w.iridescence&&o.enable(9),w.alphaTest&&o.enable(10),w.vertexColors&&o.enable(11),w.vertexAlphas&&o.enable(12),w.vertexUv1s&&o.enable(13),w.vertexUv2s&&o.enable(14),w.vertexUv3s&&o.enable(15),w.vertexTangents&&o.enable(16),w.anisotropy&&o.enable(17),w.alphaHash&&o.enable(18),w.batching&&o.enable(19),R.push(o.mask),o.disableAll(),w.fog&&o.enable(0),w.useFog&&o.enable(1),w.flatShading&&o.enable(2),w.logarithmicDepthBuffer&&o.enable(3),w.skinning&&o.enable(4),w.morphTargets&&o.enable(5),w.morphNormals&&o.enable(6),w.morphColors&&o.enable(7),w.premultipliedAlpha&&o.enable(8),w.shadowMapEnabled&&o.enable(9),w.useLegacyLights&&o.enable(10),w.doubleSided&&o.enable(11),w.flipSided&&o.enable(12),w.useDepthPacking&&o.enable(13),w.dithering&&o.enable(14),w.transmission&&o.enable(15),w.sheen&&o.enable(16),w.opaque&&o.enable(17),w.pointsUvs&&o.enable(18),w.decodeVideoTexture&&o.enable(19),R.push(o.mask)}function C(R){let w=y[R.type],at;if(w){let wt=rs[w];at=Bh.clone(wt.uniforms)}else at=R.uniforms;return at}function P(R,w){let at;for(let wt=0,ce=h.length;wt<ce;wt++){let et=h[wt];if(et.cacheKey===w){at=et,++at.usedTimes;break}}return at===void 0&&(at=new Jb(i,w,R,r),h.push(at)),at}function I(R){if(--R.usedTimes===0){let w=h.indexOf(R);h[w]=h[h.length-1],h.pop(),R.destroy()}}function z(R){l.remove(R)}function nt(){l.dispose()}return{getParameters:p,getProgramCacheKey:x,getUniforms:C,acquireProgram:P,releaseProgram:I,releaseShaderCache:z,programs:h,dispose:nt}}function Qb(){let i=new WeakMap;function t(r){let a=i.get(r);return a===void 0&&(a={},i.set(r,a)),a}function e(r){i.delete(r)}function n(r,a,o){i.get(r)[a]=o}function s(){i=new WeakMap}return{get:t,remove:e,update:n,dispose:s}}function tS(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.material.id!==t.material.id?i.material.id-t.material.id:i.z!==t.z?i.z-t.z:i.id-t.id}function v0(i,t){return i.groupOrder!==t.groupOrder?i.groupOrder-t.groupOrder:i.renderOrder!==t.renderOrder?i.renderOrder-t.renderOrder:i.z!==t.z?t.z-i.z:i.id-t.id}function M0(){let i=[],t=0,e=[],n=[],s=[];function r(){t=0,e.length=0,n.length=0,s.length=0}function a(f,m,d,y,v,p){let x=i[t];return x===void 0?(x={id:f.id,object:f,geometry:m,material:d,groupOrder:y,renderOrder:f.renderOrder,z:v,group:p},i[t]=x):(x.id=f.id,x.object=f,x.geometry=m,x.material=d,x.groupOrder=y,x.renderOrder=f.renderOrder,x.z=v,x.group=p),t++,x}function o(f,m,d,y,v,p){let x=a(f,m,d,y,v,p);d.transmission>0?n.push(x):d.transparent===!0?s.push(x):e.push(x)}function l(f,m,d,y,v,p){let x=a(f,m,d,y,v,p);d.transmission>0?n.unshift(x):d.transparent===!0?s.unshift(x):e.unshift(x)}function h(f,m){e.length>1&&e.sort(f||tS),n.length>1&&n.sort(m||v0),s.length>1&&s.sort(m||v0)}function u(){for(let f=t,m=i.length;f<m;f++){let d=i[f];if(d.id===null)break;d.id=null,d.object=null,d.geometry=null,d.material=null,d.group=null}}return{opaque:e,transmissive:n,transparent:s,init:r,push:o,unshift:l,finish:u,sort:h}}function eS(){let i=new WeakMap;function t(n,s){let r=i.get(n),a;return r===void 0?(a=new M0,i.set(n,[a])):s>=r.length?(a=new M0,r.push(a)):a=r[s],a}function e(){i=new WeakMap}return{get:t,dispose:e}}function nS(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new X,color:new fn};break;case"SpotLight":e={position:new X,direction:new X,color:new fn,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new X,color:new fn,distance:0,decay:0};break;case"HemisphereLight":e={direction:new X,skyColor:new fn,groundColor:new fn};break;case"RectAreaLight":e={color:new fn,position:new X,halfWidth:new X,halfHeight:new X};break}return i[t.id]=e,e}}}function iS(){let i={};return{get:function(t){if(i[t.id]!==void 0)return i[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"SpotLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de};break;case"PointLight":e={shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new de,shadowCameraNear:1,shadowCameraFar:1e3};break}return i[t.id]=e,e}}}var sS=0;function rS(i,t){return(t.castShadow?2:0)-(i.castShadow?2:0)+(t.map?1:0)-(i.map?1:0)}function oS(i,t){let e=new nS,n=iS(),s={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let u=0;u<9;u++)s.probe.push(new X);let r=new X,a=new Nn,o=new Nn;function l(u,f){let m=0,d=0,y=0;for(let wt=0;wt<9;wt++)s.probe[wt].set(0,0,0);let v=0,p=0,x=0,T=0,M=0,C=0,P=0,I=0,z=0,nt=0,R=0;u.sort(rS);let w=f===!0?Math.PI:1;for(let wt=0,ce=u.length;wt<ce;wt++){let et=u[wt],ft=et.color,Rt=et.intensity,Xt=et.distance,Qt=et.shadow&&et.shadow.map?et.shadow.map.texture:null;if(et.isAmbientLight)m+=ft.r*Rt*w,d+=ft.g*Rt*w,y+=ft.b*Rt*w;else if(et.isLightProbe){for(let Lt=0;Lt<9;Lt++)s.probe[Lt].addScaledVector(et.sh.coefficients[Lt],Rt);R++}else if(et.isDirectionalLight){let Lt=e.get(et);if(Lt.color.copy(et.color).multiplyScalar(et.intensity*w),et.castShadow){let jt=et.shadow,fe=n.get(et);fe.shadowBias=jt.bias,fe.shadowNormalBias=jt.normalBias,fe.shadowRadius=jt.radius,fe.shadowMapSize=jt.mapSize,s.directionalShadow[v]=fe,s.directionalShadowMap[v]=Qt,s.directionalShadowMatrix[v]=et.shadow.matrix,C++}s.directional[v]=Lt,v++}else if(et.isSpotLight){let Lt=e.get(et);Lt.position.setFromMatrixPosition(et.matrixWorld),Lt.color.copy(ft).multiplyScalar(Rt*w),Lt.distance=Xt,Lt.coneCos=Math.cos(et.angle),Lt.penumbraCos=Math.cos(et.angle*(1-et.penumbra)),Lt.decay=et.decay,s.spot[x]=Lt;let jt=et.shadow;if(et.map&&(s.spotLightMap[z]=et.map,z++,jt.updateMatrices(et),et.castShadow&&nt++),s.spotLightMatrix[x]=jt.matrix,et.castShadow){let fe=n.get(et);fe.shadowBias=jt.bias,fe.shadowNormalBias=jt.normalBias,fe.shadowRadius=jt.radius,fe.shadowMapSize=jt.mapSize,s.spotShadow[x]=fe,s.spotShadowMap[x]=Qt,I++}x++}else if(et.isRectAreaLight){let Lt=e.get(et);Lt.color.copy(ft).multiplyScalar(Rt),Lt.halfWidth.set(et.width*.5,0,0),Lt.halfHeight.set(0,et.height*.5,0),s.rectArea[T]=Lt,T++}else if(et.isPointLight){let Lt=e.get(et);if(Lt.color.copy(et.color).multiplyScalar(et.intensity*w),Lt.distance=et.distance,Lt.decay=et.decay,et.castShadow){let jt=et.shadow,fe=n.get(et);fe.shadowBias=jt.bias,fe.shadowNormalBias=jt.normalBias,fe.shadowRadius=jt.radius,fe.shadowMapSize=jt.mapSize,fe.shadowCameraNear=jt.camera.near,fe.shadowCameraFar=jt.camera.far,s.pointShadow[p]=fe,s.pointShadowMap[p]=Qt,s.pointShadowMatrix[p]=et.shadow.matrix,P++}s.point[p]=Lt,p++}else if(et.isHemisphereLight){let Lt=e.get(et);Lt.skyColor.copy(et.color).multiplyScalar(Rt*w),Lt.groundColor.copy(et.groundColor).multiplyScalar(Rt*w),s.hemi[M]=Lt,M++}}T>0&&(t.isWebGL2?i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Te.LTC_FLOAT_1,s.rectAreaLTC2=Te.LTC_FLOAT_2):(s.rectAreaLTC1=Te.LTC_HALF_1,s.rectAreaLTC2=Te.LTC_HALF_2):i.has("OES_texture_float_linear")===!0?(s.rectAreaLTC1=Te.LTC_FLOAT_1,s.rectAreaLTC2=Te.LTC_FLOAT_2):i.has("OES_texture_half_float_linear")===!0?(s.rectAreaLTC1=Te.LTC_HALF_1,s.rectAreaLTC2=Te.LTC_HALF_2):console.error("THREE.WebGLRenderer: Unable to use RectAreaLight. Missing WebGL extensions.")),s.ambient[0]=m,s.ambient[1]=d,s.ambient[2]=y;let at=s.hash;(at.directionalLength!==v||at.pointLength!==p||at.spotLength!==x||at.rectAreaLength!==T||at.hemiLength!==M||at.numDirectionalShadows!==C||at.numPointShadows!==P||at.numSpotShadows!==I||at.numSpotMaps!==z||at.numLightProbes!==R)&&(s.directional.length=v,s.spot.length=x,s.rectArea.length=T,s.point.length=p,s.hemi.length=M,s.directionalShadow.length=C,s.directionalShadowMap.length=C,s.pointShadow.length=P,s.pointShadowMap.length=P,s.spotShadow.length=I,s.spotShadowMap.length=I,s.directionalShadowMatrix.length=C,s.pointShadowMatrix.length=P,s.spotLightMatrix.length=I+z-nt,s.spotLightMap.length=z,s.numSpotLightShadowsWithMaps=nt,s.numLightProbes=R,at.directionalLength=v,at.pointLength=p,at.spotLength=x,at.rectAreaLength=T,at.hemiLength=M,at.numDirectionalShadows=C,at.numPointShadows=P,at.numSpotShadows=I,at.numSpotMaps=z,at.numLightProbes=R,s.version=sS++)}function h(u,f){let m=0,d=0,y=0,v=0,p=0,x=f.matrixWorldInverse;for(let T=0,M=u.length;T<M;T++){let C=u[T];if(C.isDirectionalLight){let P=s.directional[m];P.direction.setFromMatrixPosition(C.matrixWorld),r.setFromMatrixPosition(C.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(x),m++}else if(C.isSpotLight){let P=s.spot[y];P.position.setFromMatrixPosition(C.matrixWorld),P.position.applyMatrix4(x),P.direction.setFromMatrixPosition(C.matrixWorld),r.setFromMatrixPosition(C.target.matrixWorld),P.direction.sub(r),P.direction.transformDirection(x),y++}else if(C.isRectAreaLight){let P=s.rectArea[v];P.position.setFromMatrixPosition(C.matrixWorld),P.position.applyMatrix4(x),o.identity(),a.copy(C.matrixWorld),a.premultiply(x),o.extractRotation(a),P.halfWidth.set(C.width*.5,0,0),P.halfHeight.set(0,C.height*.5,0),P.halfWidth.applyMatrix4(o),P.halfHeight.applyMatrix4(o),v++}else if(C.isPointLight){let P=s.point[d];P.position.setFromMatrixPosition(C.matrixWorld),P.position.applyMatrix4(x),d++}else if(C.isHemisphereLight){let P=s.hemi[p];P.direction.setFromMatrixPosition(C.matrixWorld),P.direction.transformDirection(x),p++}}}return{setup:l,setupView:h,state:s}}function b0(i,t){let e=new oS(i,t),n=[],s=[];function r(){n.length=0,s.length=0}function a(f){n.push(f)}function o(f){s.push(f)}function l(f){e.setup(n,f)}function h(f){e.setupView(n,f)}return{init:r,state:{lightsArray:n,shadowsArray:s,lights:e},setupLights:l,setupLightsView:h,pushLight:a,pushShadow:o}}function aS(i,t){let e=new WeakMap;function n(r,a=0){let o=e.get(r),l;return o===void 0?(l=new b0(i,t),e.set(r,[l])):a>=o.length?(l=new b0(i,t),o.push(l)):l=o[a],l}function s(){e=new WeakMap}return{get:n,dispose:s}}var Hf=class extends mr{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=ny,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}},Vf=class extends mr{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}},lS=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,cS=`uniform sampler2D shadow_pass;
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
}`;function hS(i,t,e){let n=new Ml,s=new de,r=new de,a=new Fn,o=new Hf({depthPacking:iy}),l=new Vf,h={},u=e.maxTextureSize,f={[eo]:gs,[gs]:eo,[mn]:mn},m=new Qs({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new de},radius:{value:4}},vertexShader:lS,fragmentShader:cS}),d=m.clone();d.defines.HORIZONTAL_PASS=1;let y=new Ln;y.setAttribute("position",new Zn(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));let v=new Je(y,m),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=z0;let x=this.type;this.render=function(I,z,nt){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||I.length===0)return;let R=i.getRenderTarget(),w=i.getActiveCubeFace(),at=i.getActiveMipmapLevel(),wt=i.state;wt.setBlending(Kr),wt.buffers.color.setClear(1,1,1,1),wt.buffers.depth.setTest(!0),wt.setScissorTest(!1);let ce=x!==Cr&&this.type===Cr,et=x===Cr&&this.type!==Cr;for(let ft=0,Rt=I.length;ft<Rt;ft++){let Xt=I[ft],Qt=Xt.shadow;if(Qt===void 0){console.warn("THREE.WebGLShadowMap:",Xt,"has no shadow.");continue}if(Qt.autoUpdate===!1&&Qt.needsUpdate===!1)continue;s.copy(Qt.mapSize);let Lt=Qt.getFrameExtents();if(s.multiply(Lt),r.copy(Qt.mapSize),(s.x>u||s.y>u)&&(s.x>u&&(r.x=Math.floor(u/Lt.x),s.x=r.x*Lt.x,Qt.mapSize.x=r.x),s.y>u&&(r.y=Math.floor(u/Lt.y),s.y=r.y*Lt.y,Qt.mapSize.y=r.y)),Qt.map===null||ce===!0||et===!0){let fe=this.type!==Cr?{minFilter:Pi,magFilter:Pi}:{};Qt.map!==null&&Qt.map.dispose(),Qt.map=new Ir(s.x,s.y,fe),Qt.map.texture.name=Xt.name+".shadowMap",Qt.camera.updateProjectionMatrix()}i.setRenderTarget(Qt.map),i.clear();let jt=Qt.getViewportCount();for(let fe=0;fe<jt;fe++){let we=Qt.getViewport(fe);a.set(r.x*we.x,r.y*we.y,r.x*we.z,r.y*we.w),wt.viewport(a),Qt.updateMatrices(Xt,fe),n=Qt.getFrustum(),C(z,nt,Qt.camera,Xt,this.type)}Qt.isPointLightShadow!==!0&&this.type===Cr&&T(Qt,nt),Qt.needsUpdate=!1}x=this.type,p.needsUpdate=!1,i.setRenderTarget(R,w,at)};function T(I,z){let nt=t.update(v);m.defines.VSM_SAMPLES!==I.blurSamples&&(m.defines.VSM_SAMPLES=I.blurSamples,d.defines.VSM_SAMPLES=I.blurSamples,m.needsUpdate=!0,d.needsUpdate=!0),I.mapPass===null&&(I.mapPass=new Ir(s.x,s.y)),m.uniforms.shadow_pass.value=I.map.texture,m.uniforms.resolution.value=I.mapSize,m.uniforms.radius.value=I.radius,i.setRenderTarget(I.mapPass),i.clear(),i.renderBufferDirect(z,null,nt,m,v,null),d.uniforms.shadow_pass.value=I.mapPass.texture,d.uniforms.resolution.value=I.mapSize,d.uniforms.radius.value=I.radius,i.setRenderTarget(I.map),i.clear(),i.renderBufferDirect(z,null,nt,d,v,null)}function M(I,z,nt,R){let w=null,at=nt.isPointLight===!0?I.customDistanceMaterial:I.customDepthMaterial;if(at!==void 0)w=at;else if(w=nt.isPointLight===!0?l:o,i.localClippingEnabled&&z.clipShadows===!0&&Array.isArray(z.clippingPlanes)&&z.clippingPlanes.length!==0||z.displacementMap&&z.displacementScale!==0||z.alphaMap&&z.alphaTest>0||z.map&&z.alphaTest>0){let wt=w.uuid,ce=z.uuid,et=h[wt];et===void 0&&(et={},h[wt]=et);let ft=et[ce];ft===void 0&&(ft=w.clone(),et[ce]=ft,z.addEventListener("dispose",P)),w=ft}if(w.visible=z.visible,w.wireframe=z.wireframe,R===Cr?w.side=z.shadowSide!==null?z.shadowSide:z.side:w.side=z.shadowSide!==null?z.shadowSide:f[z.side],w.alphaMap=z.alphaMap,w.alphaTest=z.alphaTest,w.map=z.map,w.clipShadows=z.clipShadows,w.clippingPlanes=z.clippingPlanes,w.clipIntersection=z.clipIntersection,w.displacementMap=z.displacementMap,w.displacementScale=z.displacementScale,w.displacementBias=z.displacementBias,w.wireframeLinewidth=z.wireframeLinewidth,w.linewidth=z.linewidth,nt.isPointLight===!0&&w.isMeshDistanceMaterial===!0){let wt=i.properties.get(w);wt.light=nt}return w}function C(I,z,nt,R,w){if(I.visible===!1)return;if(I.layers.test(z.layers)&&(I.isMesh||I.isLine||I.isPoints)&&(I.castShadow||I.receiveShadow&&w===Cr)&&(!I.frustumCulled||n.intersectsObject(I))){I.modelViewMatrix.multiplyMatrices(nt.matrixWorldInverse,I.matrixWorld);let ce=t.update(I),et=I.material;if(Array.isArray(et)){let ft=ce.groups;for(let Rt=0,Xt=ft.length;Rt<Xt;Rt++){let Qt=ft[Rt],Lt=et[Qt.materialIndex];if(Lt&&Lt.visible){let jt=M(I,Lt,R,w);I.onBeforeShadow(i,I,z,nt,ce,jt,Qt),i.renderBufferDirect(nt,null,ce,jt,I,Qt),I.onAfterShadow(i,I,z,nt,ce,jt,Qt)}}}else if(et.visible){let ft=M(I,et,R,w);I.onBeforeShadow(i,I,z,nt,ce,ft,null),i.renderBufferDirect(nt,null,ce,ft,I,null),I.onAfterShadow(i,I,z,nt,ce,ft,null)}}let wt=I.children;for(let ce=0,et=wt.length;ce<et;ce++)C(wt[ce],z,nt,R,w)}function P(I){I.target.removeEventListener("dispose",P);for(let nt in h){let R=h[nt],w=I.target.uuid;w in R&&(R[w].dispose(),delete R[w])}}}function uS(i,t,e){let n=e.isWebGL2;function s(){let V=!1,Pt=new Fn,zt=null,re=new Fn(0,0,0,0);return{setMask:function(ae){zt!==ae&&!V&&(i.colorMask(ae,ae,ae,ae),zt=ae)},setLocked:function(ae){V=ae},setClear:function(ae,Ie,Jt,De,ze){ze===!0&&(ae*=De,Ie*=De,Jt*=De),Pt.set(ae,Ie,Jt,De),re.equals(Pt)===!1&&(i.clearColor(ae,Ie,Jt,De),re.copy(Pt))},reset:function(){V=!1,zt=null,re.set(-1,0,0,0)}}}function r(){let V=!1,Pt=null,zt=null,re=null;return{setTest:function(ae){ae?on(i.DEPTH_TEST):Ve(i.DEPTH_TEST)},setMask:function(ae){Pt!==ae&&!V&&(i.depthMask(ae),Pt=ae)},setFunc:function(ae){if(zt!==ae){switch(ae){case D1:i.depthFunc(i.NEVER);break;case U1:i.depthFunc(i.ALWAYS);break;case N1:i.depthFunc(i.LESS);break;case Vc:i.depthFunc(i.LEQUAL);break;case O1:i.depthFunc(i.EQUAL);break;case F1:i.depthFunc(i.GEQUAL);break;case B1:i.depthFunc(i.GREATER);break;case z1:i.depthFunc(i.NOTEQUAL);break;default:i.depthFunc(i.LEQUAL)}zt=ae}},setLocked:function(ae){V=ae},setClear:function(ae){re!==ae&&(i.clearDepth(ae),re=ae)},reset:function(){V=!1,Pt=null,zt=null,re=null}}}function a(){let V=!1,Pt=null,zt=null,re=null,ae=null,Ie=null,Jt=null,De=null,ze=null;return{setTest:function(Ue){V||(Ue?on(i.STENCIL_TEST):Ve(i.STENCIL_TEST))},setMask:function(Ue){Pt!==Ue&&!V&&(i.stencilMask(Ue),Pt=Ue)},setFunc:function(Ue,en,hn){(zt!==Ue||re!==en||ae!==hn)&&(i.stencilFunc(Ue,en,hn),zt=Ue,re=en,ae=hn)},setOp:function(Ue,en,hn){(Ie!==Ue||Jt!==en||De!==hn)&&(i.stencilOp(Ue,en,hn),Ie=Ue,Jt=en,De=hn)},setLocked:function(Ue){V=Ue},setClear:function(Ue){ze!==Ue&&(i.clearStencil(Ue),ze=Ue)},reset:function(){V=!1,Pt=null,zt=null,re=null,ae=null,Ie=null,Jt=null,De=null,ze=null}}}let o=new s,l=new r,h=new a,u=new WeakMap,f=new WeakMap,m={},d={},y=new WeakMap,v=[],p=null,x=!1,T=null,M=null,C=null,P=null,I=null,z=null,nt=null,R=new fn(0,0,0),w=0,at=!1,wt=null,ce=null,et=null,ft=null,Rt=null,Xt=i.getParameter(i.MAX_COMBINED_TEXTURE_IMAGE_UNITS),Qt=!1,Lt=0,jt=i.getParameter(i.VERSION);jt.indexOf("WebGL")!==-1?(Lt=parseFloat(/^WebGL (\d)/.exec(jt)[1]),Qt=Lt>=1):jt.indexOf("OpenGL ES")!==-1&&(Lt=parseFloat(/^OpenGL ES (\d)/.exec(jt)[1]),Qt=Lt>=2);let fe=null,we={},Ct=i.getParameter(i.SCISSOR_BOX),It=i.getParameter(i.VIEWPORT),se=new Fn().fromArray(Ct),Le=new Fn().fromArray(It);function Ne(V,Pt,zt,re){let ae=new Uint8Array(4),Ie=i.createTexture();i.bindTexture(V,Ie),i.texParameteri(V,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(V,i.TEXTURE_MAG_FILTER,i.NEAREST);for(let Jt=0;Jt<zt;Jt++)n&&(V===i.TEXTURE_3D||V===i.TEXTURE_2D_ARRAY)?i.texImage3D(Pt,0,i.RGBA,1,1,re,0,i.RGBA,i.UNSIGNED_BYTE,ae):i.texImage2D(Pt+Jt,0,i.RGBA,1,1,0,i.RGBA,i.UNSIGNED_BYTE,ae);return Ie}let sn={};sn[i.TEXTURE_2D]=Ne(i.TEXTURE_2D,i.TEXTURE_2D,1),sn[i.TEXTURE_CUBE_MAP]=Ne(i.TEXTURE_CUBE_MAP,i.TEXTURE_CUBE_MAP_POSITIVE_X,6),n&&(sn[i.TEXTURE_2D_ARRAY]=Ne(i.TEXTURE_2D_ARRAY,i.TEXTURE_2D_ARRAY,1,1),sn[i.TEXTURE_3D]=Ne(i.TEXTURE_3D,i.TEXTURE_3D,1,1)),o.setClear(0,0,0,1),l.setClear(1),h.setClear(0),on(i.DEPTH_TEST),l.setFunc(Vc),Me(!1),O(nm),on(i.CULL_FACE),$t(Kr);function on(V){m[V]!==!0&&(i.enable(V),m[V]=!0)}function Ve(V){m[V]!==!1&&(i.disable(V),m[V]=!1)}function We(V,Pt){return d[V]!==Pt?(i.bindFramebuffer(V,Pt),d[V]=Pt,n&&(V===i.DRAW_FRAMEBUFFER&&(d[i.FRAMEBUFFER]=Pt),V===i.FRAMEBUFFER&&(d[i.DRAW_FRAMEBUFFER]=Pt)),!0):!1}function K(V,Pt){let zt=v,re=!1;if(V)if(zt=y.get(Pt),zt===void 0&&(zt=[],y.set(Pt,zt)),V.isWebGLMultipleRenderTargets){let ae=V.texture;if(zt.length!==ae.length||zt[0]!==i.COLOR_ATTACHMENT0){for(let Ie=0,Jt=ae.length;Ie<Jt;Ie++)zt[Ie]=i.COLOR_ATTACHMENT0+Ie;zt.length=ae.length,re=!0}}else zt[0]!==i.COLOR_ATTACHMENT0&&(zt[0]=i.COLOR_ATTACHMENT0,re=!0);else zt[0]!==i.BACK&&(zt[0]=i.BACK,re=!0);re&&(e.isWebGL2?i.drawBuffers(zt):t.get("WEBGL_draw_buffers").drawBuffersWEBGL(zt))}function be(V){return p!==V?(i.useProgram(V),p=V,!0):!1}let lt={[bo]:i.FUNC_ADD,[y1]:i.FUNC_SUBTRACT,[_1]:i.FUNC_REVERSE_SUBTRACT};if(n)lt[om]=i.MIN,lt[am]=i.MAX;else{let V=t.get("EXT_blend_minmax");V!==null&&(lt[om]=V.MIN_EXT,lt[am]=V.MAX_EXT)}let _e={[v1]:i.ZERO,[M1]:i.ONE,[b1]:i.SRC_COLOR,[Sf]:i.SRC_ALPHA,[R1]:i.SRC_ALPHA_SATURATE,[T1]:i.DST_COLOR,[E1]:i.DST_ALPHA,[S1]:i.ONE_MINUS_SRC_COLOR,[Ef]:i.ONE_MINUS_SRC_ALPHA,[A1]:i.ONE_MINUS_DST_COLOR,[w1]:i.ONE_MINUS_DST_ALPHA,[C1]:i.CONSTANT_COLOR,[P1]:i.ONE_MINUS_CONSTANT_COLOR,[L1]:i.CONSTANT_ALPHA,[I1]:i.ONE_MINUS_CONSTANT_ALPHA};function $t(V,Pt,zt,re,ae,Ie,Jt,De,ze,Ue){if(V===Kr){x===!0&&(Ve(i.BLEND),x=!1);return}if(x===!1&&(on(i.BLEND),x=!0),V!==x1){if(V!==T||Ue!==at){if((M!==bo||I!==bo)&&(i.blendEquation(i.FUNC_ADD),M=bo,I=bo),Ue)switch(V){case _a:i.blendFuncSeparate(i.ONE,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case im:i.blendFunc(i.ONE,i.ONE);break;case sm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case rm:i.blendFuncSeparate(i.ZERO,i.SRC_COLOR,i.ZERO,i.SRC_ALPHA);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}else switch(V){case _a:i.blendFuncSeparate(i.SRC_ALPHA,i.ONE_MINUS_SRC_ALPHA,i.ONE,i.ONE_MINUS_SRC_ALPHA);break;case im:i.blendFunc(i.SRC_ALPHA,i.ONE);break;case sm:i.blendFuncSeparate(i.ZERO,i.ONE_MINUS_SRC_COLOR,i.ZERO,i.ONE);break;case rm:i.blendFunc(i.ZERO,i.SRC_COLOR);break;default:console.error("THREE.WebGLState: Invalid blending: ",V);break}C=null,P=null,z=null,nt=null,R.set(0,0,0),w=0,T=V,at=Ue}return}ae=ae||Pt,Ie=Ie||zt,Jt=Jt||re,(Pt!==M||ae!==I)&&(i.blendEquationSeparate(lt[Pt],lt[ae]),M=Pt,I=ae),(zt!==C||re!==P||Ie!==z||Jt!==nt)&&(i.blendFuncSeparate(_e[zt],_e[re],_e[Ie],_e[Jt]),C=zt,P=re,z=Ie,nt=Jt),(De.equals(R)===!1||ze!==w)&&(i.blendColor(De.r,De.g,De.b,ze),R.copy(De),w=ze),T=V,at=!1}function Be(V,Pt){V.side===mn?Ve(i.CULL_FACE):on(i.CULL_FACE);let zt=V.side===gs;Pt&&(zt=!zt),Me(zt),V.blending===_a&&V.transparent===!1?$t(Kr):$t(V.blending,V.blendEquation,V.blendSrc,V.blendDst,V.blendEquationAlpha,V.blendSrcAlpha,V.blendDstAlpha,V.blendColor,V.blendAlpha,V.premultipliedAlpha),l.setFunc(V.depthFunc),l.setTest(V.depthTest),l.setMask(V.depthWrite),o.setMask(V.colorWrite);let re=V.stencilWrite;h.setTest(re),re&&(h.setMask(V.stencilWriteMask),h.setFunc(V.stencilFunc,V.stencilRef,V.stencilFuncMask),h.setOp(V.stencilFail,V.stencilZFail,V.stencilZPass)),yt(V.polygonOffset,V.polygonOffsetFactor,V.polygonOffsetUnits),V.alphaToCoverage===!0?on(i.SAMPLE_ALPHA_TO_COVERAGE):Ve(i.SAMPLE_ALPHA_TO_COVERAGE)}function Me(V){wt!==V&&(V?i.frontFace(i.CW):i.frontFace(i.CCW),wt=V)}function O(V){V!==m1?(on(i.CULL_FACE),V!==ce&&(V===nm?i.cullFace(i.BACK):V===g1?i.cullFace(i.FRONT):i.cullFace(i.FRONT_AND_BACK))):Ve(i.CULL_FACE),ce=V}function L(V){V!==et&&(Qt&&i.lineWidth(V),et=V)}function yt(V,Pt,zt){V?(on(i.POLYGON_OFFSET_FILL),(ft!==Pt||Rt!==zt)&&(i.polygonOffset(Pt,zt),ft=Pt,Rt=zt)):Ve(i.POLYGON_OFFSET_FILL)}function ye(V){V?on(i.SCISSOR_TEST):Ve(i.SCISSOR_TEST)}function pe(V){V===void 0&&(V=i.TEXTURE0+Xt-1),fe!==V&&(i.activeTexture(V),fe=V)}function he(V,Pt,zt){zt===void 0&&(fe===null?zt=i.TEXTURE0+Xt-1:zt=fe);let re=we[zt];re===void 0&&(re={type:void 0,texture:void 0},we[zt]=re),(re.type!==V||re.texture!==Pt)&&(fe!==zt&&(i.activeTexture(zt),fe=zt),i.bindTexture(V,Pt||sn[V]),re.type=V,re.texture=Pt)}function Ge(){let V=we[fe];V!==void 0&&V.type!==void 0&&(i.bindTexture(V.type,null),V.type=void 0,V.texture=void 0)}function qt(){try{i.compressedTexImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function Ee(){try{i.compressedTexImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function $e(){try{i.texSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function tn(){try{i.texSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function me(){try{i.compressedTexSubImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function gn(){try{i.compressedTexSubImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function G(){try{i.texStorage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ue(){try{i.texStorage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function ve(){try{i.texImage2D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function tt(){try{i.texImage3D.apply(i,arguments)}catch(V){console.error("THREE.WebGLState:",V)}}function dt(V){se.equals(V)===!1&&(i.scissor(V.x,V.y,V.z,V.w),se.copy(V))}function Zt(V){Le.equals(V)===!1&&(i.viewport(V.x,V.y,V.z,V.w),Le.copy(V))}function Kt(V,Pt){let zt=f.get(Pt);zt===void 0&&(zt=new WeakMap,f.set(Pt,zt));let re=zt.get(V);re===void 0&&(re=i.getUniformBlockIndex(Pt,V.name),zt.set(V,re))}function te(V,Pt){let re=f.get(Pt).get(V);u.get(Pt)!==re&&(i.uniformBlockBinding(Pt,re,V.__bindingPointIndex),u.set(Pt,re))}function ct(){i.disable(i.BLEND),i.disable(i.CULL_FACE),i.disable(i.DEPTH_TEST),i.disable(i.POLYGON_OFFSET_FILL),i.disable(i.SCISSOR_TEST),i.disable(i.STENCIL_TEST),i.disable(i.SAMPLE_ALPHA_TO_COVERAGE),i.blendEquation(i.FUNC_ADD),i.blendFunc(i.ONE,i.ZERO),i.blendFuncSeparate(i.ONE,i.ZERO,i.ONE,i.ZERO),i.blendColor(0,0,0,0),i.colorMask(!0,!0,!0,!0),i.clearColor(0,0,0,0),i.depthMask(!0),i.depthFunc(i.LESS),i.clearDepth(1),i.stencilMask(4294967295),i.stencilFunc(i.ALWAYS,0,4294967295),i.stencilOp(i.KEEP,i.KEEP,i.KEEP),i.clearStencil(0),i.cullFace(i.BACK),i.frontFace(i.CCW),i.polygonOffset(0,0),i.activeTexture(i.TEXTURE0),i.bindFramebuffer(i.FRAMEBUFFER,null),n===!0&&(i.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),i.bindFramebuffer(i.READ_FRAMEBUFFER,null)),i.useProgram(null),i.lineWidth(1),i.scissor(0,0,i.canvas.width,i.canvas.height),i.viewport(0,0,i.canvas.width,i.canvas.height),m={},fe=null,we={},d={},y=new WeakMap,v=[],p=null,x=!1,T=null,M=null,C=null,P=null,I=null,z=null,nt=null,R=new fn(0,0,0),w=0,at=!1,wt=null,ce=null,et=null,ft=null,Rt=null,se.set(0,0,i.canvas.width,i.canvas.height),Le.set(0,0,i.canvas.width,i.canvas.height),o.reset(),l.reset(),h.reset()}return{buffers:{color:o,depth:l,stencil:h},enable:on,disable:Ve,bindFramebuffer:We,drawBuffers:K,useProgram:be,setBlending:$t,setMaterial:Be,setFlipSided:Me,setCullFace:O,setLineWidth:L,setPolygonOffset:yt,setScissorTest:ye,activeTexture:pe,bindTexture:he,unbindTexture:Ge,compressedTexImage2D:qt,compressedTexImage3D:Ee,texImage2D:ve,texImage3D:tt,updateUBOMapping:Kt,uniformBlockBinding:te,texStorage2D:G,texStorage3D:ue,texSubImage2D:$e,texSubImage3D:tn,compressedTexSubImage2D:me,compressedTexSubImage3D:gn,scissor:dt,viewport:Zt,reset:ct}}function fS(i,t,e,n,s,r,a){let o=s.isWebGL2,l=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,h=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),u=new WeakMap,f,m=new WeakMap,d=!1;try{d=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(O,L){return d?new OffscreenCanvas(O,L):Jc("canvas")}function v(O,L,yt,ye){let pe=1;if((O.width>ye||O.height>ye)&&(pe=ye/Math.max(O.width,O.height)),pe<1||L===!0)if(typeof HTMLImageElement<"u"&&O instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&O instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&O instanceof ImageBitmap){let he=L?Zc:Math.floor,Ge=he(pe*O.width),qt=he(pe*O.height);f===void 0&&(f=y(Ge,qt));let Ee=yt?y(Ge,qt):f;return Ee.width=Ge,Ee.height=qt,Ee.getContext("2d").drawImage(O,0,0,Ge,qt),console.warn("THREE.WebGLRenderer: Texture has been resized from ("+O.width+"x"+O.height+") to ("+Ge+"x"+qt+")."),Ee}else return"data"in O&&console.warn("THREE.WebGLRenderer: Image in DataTexture is too big ("+O.width+"x"+O.height+")."),O;return O}function p(O){return Pf(O.width)&&Pf(O.height)}function x(O){return o?!1:O.wrapS!==Js||O.wrapT!==Js||O.minFilter!==Pi&&O.minFilter!==ms}function T(O,L){return O.generateMipmaps&&L&&O.minFilter!==Pi&&O.minFilter!==ms}function M(O){i.generateMipmap(O)}function C(O,L,yt,ye,pe=!1){if(o===!1)return L;if(O!==null){if(i[O]!==void 0)return i[O];console.warn("THREE.WebGLRenderer: Attempt to use non-existing WebGL internal format '"+O+"'")}let he=L;if(L===i.RED&&(yt===i.FLOAT&&(he=i.R32F),yt===i.HALF_FLOAT&&(he=i.R16F),yt===i.UNSIGNED_BYTE&&(he=i.R8)),L===i.RED_INTEGER&&(yt===i.UNSIGNED_BYTE&&(he=i.R8UI),yt===i.UNSIGNED_SHORT&&(he=i.R16UI),yt===i.UNSIGNED_INT&&(he=i.R32UI),yt===i.BYTE&&(he=i.R8I),yt===i.SHORT&&(he=i.R16I),yt===i.INT&&(he=i.R32I)),L===i.RG&&(yt===i.FLOAT&&(he=i.RG32F),yt===i.HALF_FLOAT&&(he=i.RG16F),yt===i.UNSIGNED_BYTE&&(he=i.RG8)),L===i.RGBA){let Ge=pe?Xc:Wn.getTransfer(ye);yt===i.FLOAT&&(he=i.RGBA32F),yt===i.HALF_FLOAT&&(he=i.RGBA16F),yt===i.UNSIGNED_BYTE&&(he=Ge===oi?i.SRGB8_ALPHA8:i.RGBA8),yt===i.UNSIGNED_SHORT_4_4_4_4&&(he=i.RGBA4),yt===i.UNSIGNED_SHORT_5_5_5_1&&(he=i.RGB5_A1)}return(he===i.R16F||he===i.R32F||he===i.RG16F||he===i.RG32F||he===i.RGBA16F||he===i.RGBA32F)&&t.get("EXT_color_buffer_float"),he}function P(O,L,yt){return T(O,yt)===!0||O.isFramebufferTexture&&O.minFilter!==Pi&&O.minFilter!==ms?Math.log2(Math.max(L.width,L.height))+1:O.mipmaps!==void 0&&O.mipmaps.length>0?O.mipmaps.length:O.isCompressedTexture&&Array.isArray(O.image)?L.mipmaps.length:1}function I(O){return O===Pi||O===lm||O===Vu?i.NEAREST:i.LINEAR}function z(O){let L=O.target;L.removeEventListener("dispose",z),R(L),L.isVideoTexture&&u.delete(L)}function nt(O){let L=O.target;L.removeEventListener("dispose",nt),at(L)}function R(O){let L=n.get(O);if(L.__webglInit===void 0)return;let yt=O.source,ye=m.get(yt);if(ye){let pe=ye[L.__cacheKey];pe.usedTimes--,pe.usedTimes===0&&w(O),Object.keys(ye).length===0&&m.delete(yt)}n.remove(O)}function w(O){let L=n.get(O);i.deleteTexture(L.__webglTexture);let yt=O.source,ye=m.get(yt);delete ye[L.__cacheKey],a.memory.textures--}function at(O){let L=O.texture,yt=n.get(O),ye=n.get(L);if(ye.__webglTexture!==void 0&&(i.deleteTexture(ye.__webglTexture),a.memory.textures--),O.depthTexture&&O.depthTexture.dispose(),O.isWebGLCubeRenderTarget)for(let pe=0;pe<6;pe++){if(Array.isArray(yt.__webglFramebuffer[pe]))for(let he=0;he<yt.__webglFramebuffer[pe].length;he++)i.deleteFramebuffer(yt.__webglFramebuffer[pe][he]);else i.deleteFramebuffer(yt.__webglFramebuffer[pe]);yt.__webglDepthbuffer&&i.deleteRenderbuffer(yt.__webglDepthbuffer[pe])}else{if(Array.isArray(yt.__webglFramebuffer))for(let pe=0;pe<yt.__webglFramebuffer.length;pe++)i.deleteFramebuffer(yt.__webglFramebuffer[pe]);else i.deleteFramebuffer(yt.__webglFramebuffer);if(yt.__webglDepthbuffer&&i.deleteRenderbuffer(yt.__webglDepthbuffer),yt.__webglMultisampledFramebuffer&&i.deleteFramebuffer(yt.__webglMultisampledFramebuffer),yt.__webglColorRenderbuffer)for(let pe=0;pe<yt.__webglColorRenderbuffer.length;pe++)yt.__webglColorRenderbuffer[pe]&&i.deleteRenderbuffer(yt.__webglColorRenderbuffer[pe]);yt.__webglDepthRenderbuffer&&i.deleteRenderbuffer(yt.__webglDepthRenderbuffer)}if(O.isWebGLMultipleRenderTargets)for(let pe=0,he=L.length;pe<he;pe++){let Ge=n.get(L[pe]);Ge.__webglTexture&&(i.deleteTexture(Ge.__webglTexture),a.memory.textures--),n.remove(L[pe])}n.remove(L),n.remove(O)}let wt=0;function ce(){wt=0}function et(){let O=wt;return O>=s.maxTextures&&console.warn("THREE.WebGLTextures: Trying to use "+O+" texture units while this GPU supports only "+s.maxTextures),wt+=1,O}function ft(O){let L=[];return L.push(O.wrapS),L.push(O.wrapT),L.push(O.wrapR||0),L.push(O.magFilter),L.push(O.minFilter),L.push(O.anisotropy),L.push(O.internalFormat),L.push(O.format),L.push(O.type),L.push(O.generateMipmaps),L.push(O.premultiplyAlpha),L.push(O.flipY),L.push(O.unpackAlignment),L.push(O.colorSpace),L.join()}function Rt(O,L){let yt=n.get(O);if(O.isVideoTexture&&Be(O),O.isRenderTargetTexture===!1&&O.version>0&&yt.__version!==O.version){let ye=O.image;if(ye===null)console.warn("THREE.WebGLRenderer: Texture marked for update but no image data found.");else if(ye.complete===!1)console.warn("THREE.WebGLRenderer: Texture marked for update but image is incomplete");else{se(yt,O,L);return}}e.bindTexture(i.TEXTURE_2D,yt.__webglTexture,i.TEXTURE0+L)}function Xt(O,L){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){se(yt,O,L);return}e.bindTexture(i.TEXTURE_2D_ARRAY,yt.__webglTexture,i.TEXTURE0+L)}function Qt(O,L){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){se(yt,O,L);return}e.bindTexture(i.TEXTURE_3D,yt.__webglTexture,i.TEXTURE0+L)}function Lt(O,L){let yt=n.get(O);if(O.version>0&&yt.__version!==O.version){Le(yt,O,L);return}e.bindTexture(i.TEXTURE_CUBE_MAP,yt.__webglTexture,i.TEXTURE0+L)}let jt={[no]:i.REPEAT,[Js]:i.CLAMP_TO_EDGE,[Af]:i.MIRRORED_REPEAT},fe={[Pi]:i.NEAREST,[lm]:i.NEAREST_MIPMAP_NEAREST,[Vu]:i.NEAREST_MIPMAP_LINEAR,[ms]:i.LINEAR,[Y1]:i.LINEAR_MIPMAP_NEAREST,[xl]:i.LINEAR_MIPMAP_LINEAR},we={[ry]:i.NEVER,[uy]:i.ALWAYS,[oy]:i.LESS,[Z0]:i.LEQUAL,[ay]:i.EQUAL,[hy]:i.GEQUAL,[ly]:i.GREATER,[cy]:i.NOTEQUAL};function Ct(O,L,yt){if(yt?(i.texParameteri(O,i.TEXTURE_WRAP_S,jt[L.wrapS]),i.texParameteri(O,i.TEXTURE_WRAP_T,jt[L.wrapT]),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,jt[L.wrapR]),i.texParameteri(O,i.TEXTURE_MAG_FILTER,fe[L.magFilter]),i.texParameteri(O,i.TEXTURE_MIN_FILTER,fe[L.minFilter])):(i.texParameteri(O,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(O,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),(O===i.TEXTURE_3D||O===i.TEXTURE_2D_ARRAY)&&i.texParameteri(O,i.TEXTURE_WRAP_R,i.CLAMP_TO_EDGE),(L.wrapS!==Js||L.wrapT!==Js)&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.wrapS and Texture.wrapT should be set to THREE.ClampToEdgeWrapping."),i.texParameteri(O,i.TEXTURE_MAG_FILTER,I(L.magFilter)),i.texParameteri(O,i.TEXTURE_MIN_FILTER,I(L.minFilter)),L.minFilter!==Pi&&L.minFilter!==ms&&console.warn("THREE.WebGLRenderer: Texture is not power of two. Texture.minFilter should be set to THREE.NearestFilter or THREE.LinearFilter.")),L.compareFunction&&(i.texParameteri(O,i.TEXTURE_COMPARE_MODE,i.COMPARE_REF_TO_TEXTURE),i.texParameteri(O,i.TEXTURE_COMPARE_FUNC,we[L.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){let ye=t.get("EXT_texture_filter_anisotropic");if(L.magFilter===Pi||L.minFilter!==Vu&&L.minFilter!==xl||L.type===jr&&t.has("OES_texture_float_linear")===!1||o===!1&&L.type===yl&&t.has("OES_texture_half_float_linear")===!1)return;(L.anisotropy>1||n.get(L).__currentAnisotropy)&&(i.texParameterf(O,ye.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(L.anisotropy,s.getMaxAnisotropy())),n.get(L).__currentAnisotropy=L.anisotropy)}}function It(O,L){let yt=!1;O.__webglInit===void 0&&(O.__webglInit=!0,L.addEventListener("dispose",z));let ye=L.source,pe=m.get(ye);pe===void 0&&(pe={},m.set(ye,pe));let he=ft(L);if(he!==O.__cacheKey){pe[he]===void 0&&(pe[he]={texture:i.createTexture(),usedTimes:0},a.memory.textures++,yt=!0),pe[he].usedTimes++;let Ge=pe[O.__cacheKey];Ge!==void 0&&(pe[O.__cacheKey].usedTimes--,Ge.usedTimes===0&&w(L)),O.__cacheKey=he,O.__webglTexture=pe[he].texture}return yt}function se(O,L,yt){let ye=i.TEXTURE_2D;(L.isDataArrayTexture||L.isCompressedArrayTexture)&&(ye=i.TEXTURE_2D_ARRAY),L.isData3DTexture&&(ye=i.TEXTURE_3D);let pe=It(O,L),he=L.source;e.bindTexture(ye,O.__webglTexture,i.TEXTURE0+yt);let Ge=n.get(he);if(he.version!==Ge.__version||pe===!0){e.activeTexture(i.TEXTURE0+yt);let qt=Wn.getPrimaries(Wn.workingColorSpace),Ee=L.colorSpace===Bs?null:Wn.getPrimaries(L.colorSpace),$e=L.colorSpace===Bs||qt===Ee?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,L.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,L.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,$e);let tn=x(L)&&p(L.image)===!1,me=v(L.image,tn,!1,s.maxTextureSize);me=Me(L,me);let gn=p(me)||o,G=r.convert(L.format,L.colorSpace),ue=r.convert(L.type),ve=C(L.internalFormat,G,ue,L.colorSpace,L.isVideoTexture);Ct(ye,L,gn);let tt,dt=L.mipmaps,Zt=o&&L.isVideoTexture!==!0&&ve!==Y0,Kt=Ge.__version===void 0||pe===!0,te=P(L,me,gn);if(L.isDepthTexture)ve=i.DEPTH_COMPONENT,o?L.type===jr?ve=i.DEPTH_COMPONENT32F:L.type===Jr?ve=i.DEPTH_COMPONENT24:L.type===Eo?ve=i.DEPTH24_STENCIL8:ve=i.DEPTH_COMPONENT16:L.type===jr&&console.error("WebGLRenderer: Floating point depth texture requires WebGL2."),L.format===wo&&ve===i.DEPTH_COMPONENT&&L.type!==gd&&L.type!==Jr&&(console.warn("THREE.WebGLRenderer: Use UnsignedShortType or UnsignedIntType for DepthFormat DepthTexture."),L.type=Jr,ue=r.convert(L.type)),L.format===Ea&&ve===i.DEPTH_COMPONENT&&(ve=i.DEPTH_STENCIL,L.type!==Eo&&(console.warn("THREE.WebGLRenderer: Use UnsignedInt248Type for DepthStencilFormat DepthTexture."),L.type=Eo,ue=r.convert(L.type))),Kt&&(Zt?e.texStorage2D(i.TEXTURE_2D,1,ve,me.width,me.height):e.texImage2D(i.TEXTURE_2D,0,ve,me.width,me.height,0,G,ue,null));else if(L.isDataTexture)if(dt.length>0&&gn){Zt&&Kt&&e.texStorage2D(i.TEXTURE_2D,te,ve,dt[0].width,dt[0].height);for(let ct=0,V=dt.length;ct<V;ct++)tt=dt[ct],Zt?e.texSubImage2D(i.TEXTURE_2D,ct,0,0,tt.width,tt.height,G,ue,tt.data):e.texImage2D(i.TEXTURE_2D,ct,ve,tt.width,tt.height,0,G,ue,tt.data);L.generateMipmaps=!1}else Zt?(Kt&&e.texStorage2D(i.TEXTURE_2D,te,ve,me.width,me.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,me.width,me.height,G,ue,me.data)):e.texImage2D(i.TEXTURE_2D,0,ve,me.width,me.height,0,G,ue,me.data);else if(L.isCompressedTexture)if(L.isCompressedArrayTexture){Zt&&Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,te,ve,dt[0].width,dt[0].height,me.depth);for(let ct=0,V=dt.length;ct<V;ct++)tt=dt[ct],L.format!==js?G!==null?Zt?e.compressedTexSubImage3D(i.TEXTURE_2D_ARRAY,ct,0,0,0,tt.width,tt.height,me.depth,G,tt.data,0,0):e.compressedTexImage3D(i.TEXTURE_2D_ARRAY,ct,ve,tt.width,tt.height,me.depth,0,tt.data,0,0):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage3D(i.TEXTURE_2D_ARRAY,ct,0,0,0,tt.width,tt.height,me.depth,G,ue,tt.data):e.texImage3D(i.TEXTURE_2D_ARRAY,ct,ve,tt.width,tt.height,me.depth,0,G,ue,tt.data)}else{Zt&&Kt&&e.texStorage2D(i.TEXTURE_2D,te,ve,dt[0].width,dt[0].height);for(let ct=0,V=dt.length;ct<V;ct++)tt=dt[ct],L.format!==js?G!==null?Zt?e.compressedTexSubImage2D(i.TEXTURE_2D,ct,0,0,tt.width,tt.height,G,tt.data):e.compressedTexImage2D(i.TEXTURE_2D,ct,ve,tt.width,tt.height,0,tt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Zt?e.texSubImage2D(i.TEXTURE_2D,ct,0,0,tt.width,tt.height,G,ue,tt.data):e.texImage2D(i.TEXTURE_2D,ct,ve,tt.width,tt.height,0,G,ue,tt.data)}else if(L.isDataArrayTexture)Zt?(Kt&&e.texStorage3D(i.TEXTURE_2D_ARRAY,te,ve,me.width,me.height,me.depth),e.texSubImage3D(i.TEXTURE_2D_ARRAY,0,0,0,0,me.width,me.height,me.depth,G,ue,me.data)):e.texImage3D(i.TEXTURE_2D_ARRAY,0,ve,me.width,me.height,me.depth,0,G,ue,me.data);else if(L.isData3DTexture)Zt?(Kt&&e.texStorage3D(i.TEXTURE_3D,te,ve,me.width,me.height,me.depth),e.texSubImage3D(i.TEXTURE_3D,0,0,0,0,me.width,me.height,me.depth,G,ue,me.data)):e.texImage3D(i.TEXTURE_3D,0,ve,me.width,me.height,me.depth,0,G,ue,me.data);else if(L.isFramebufferTexture){if(Kt)if(Zt)e.texStorage2D(i.TEXTURE_2D,te,ve,me.width,me.height);else{let ct=me.width,V=me.height;for(let Pt=0;Pt<te;Pt++)e.texImage2D(i.TEXTURE_2D,Pt,ve,ct,V,0,G,ue,null),ct>>=1,V>>=1}}else if(dt.length>0&&gn){Zt&&Kt&&e.texStorage2D(i.TEXTURE_2D,te,ve,dt[0].width,dt[0].height);for(let ct=0,V=dt.length;ct<V;ct++)tt=dt[ct],Zt?e.texSubImage2D(i.TEXTURE_2D,ct,0,0,G,ue,tt):e.texImage2D(i.TEXTURE_2D,ct,ve,G,ue,tt);L.generateMipmaps=!1}else Zt?(Kt&&e.texStorage2D(i.TEXTURE_2D,te,ve,me.width,me.height),e.texSubImage2D(i.TEXTURE_2D,0,0,0,G,ue,me)):e.texImage2D(i.TEXTURE_2D,0,ve,G,ue,me);T(L,gn)&&M(ye),Ge.__version=he.version,L.onUpdate&&L.onUpdate(L)}O.__version=L.version}function Le(O,L,yt){if(L.image.length!==6)return;let ye=It(O,L),pe=L.source;e.bindTexture(i.TEXTURE_CUBE_MAP,O.__webglTexture,i.TEXTURE0+yt);let he=n.get(pe);if(pe.version!==he.__version||ye===!0){e.activeTexture(i.TEXTURE0+yt);let Ge=Wn.getPrimaries(Wn.workingColorSpace),qt=L.colorSpace===Bs?null:Wn.getPrimaries(L.colorSpace),Ee=L.colorSpace===Bs||Ge===qt?i.NONE:i.BROWSER_DEFAULT_WEBGL;i.pixelStorei(i.UNPACK_FLIP_Y_WEBGL,L.flipY),i.pixelStorei(i.UNPACK_PREMULTIPLY_ALPHA_WEBGL,L.premultiplyAlpha),i.pixelStorei(i.UNPACK_ALIGNMENT,L.unpackAlignment),i.pixelStorei(i.UNPACK_COLORSPACE_CONVERSION_WEBGL,Ee);let $e=L.isCompressedTexture||L.image[0].isCompressedTexture,tn=L.image[0]&&L.image[0].isDataTexture,me=[];for(let ct=0;ct<6;ct++)!$e&&!tn?me[ct]=v(L.image[ct],!1,!0,s.maxCubemapSize):me[ct]=tn?L.image[ct].image:L.image[ct],me[ct]=Me(L,me[ct]);let gn=me[0],G=p(gn)||o,ue=r.convert(L.format,L.colorSpace),ve=r.convert(L.type),tt=C(L.internalFormat,ue,ve,L.colorSpace),dt=o&&L.isVideoTexture!==!0,Zt=he.__version===void 0||ye===!0,Kt=P(L,gn,G);Ct(i.TEXTURE_CUBE_MAP,L,G);let te;if($e){dt&&Zt&&e.texStorage2D(i.TEXTURE_CUBE_MAP,Kt,tt,gn.width,gn.height);for(let ct=0;ct<6;ct++){te=me[ct].mipmaps;for(let V=0;V<te.length;V++){let Pt=te[V];L.format!==js?ue!==null?dt?e.compressedTexSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,0,0,Pt.width,Pt.height,ue,Pt.data):e.compressedTexImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,tt,Pt.width,Pt.height,0,Pt.data):console.warn("THREE.WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,0,0,Pt.width,Pt.height,ue,ve,Pt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V,tt,Pt.width,Pt.height,0,ue,ve,Pt.data)}}}else{te=L.mipmaps,dt&&Zt&&(te.length>0&&Kt++,e.texStorage2D(i.TEXTURE_CUBE_MAP,Kt,tt,me[0].width,me[0].height));for(let ct=0;ct<6;ct++)if(tn){dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,me[ct].width,me[ct].height,ue,ve,me[ct].data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,tt,me[ct].width,me[ct].height,0,ue,ve,me[ct].data);for(let V=0;V<te.length;V++){let zt=te[V].image[ct].image;dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,0,0,zt.width,zt.height,ue,ve,zt.data):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,tt,zt.width,zt.height,0,ue,ve,zt.data)}}else{dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,0,0,ue,ve,me[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,0,tt,ue,ve,me[ct]);for(let V=0;V<te.length;V++){let Pt=te[V];dt?e.texSubImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,0,0,ue,ve,Pt.image[ct]):e.texImage2D(i.TEXTURE_CUBE_MAP_POSITIVE_X+ct,V+1,tt,ue,ve,Pt.image[ct])}}}T(L,G)&&M(i.TEXTURE_CUBE_MAP),he.__version=pe.version,L.onUpdate&&L.onUpdate(L)}O.__version=L.version}function Ne(O,L,yt,ye,pe,he){let Ge=r.convert(yt.format,yt.colorSpace),qt=r.convert(yt.type),Ee=C(yt.internalFormat,Ge,qt,yt.colorSpace);if(!n.get(L).__hasExternalTextures){let tn=Math.max(1,L.width>>he),me=Math.max(1,L.height>>he);pe===i.TEXTURE_3D||pe===i.TEXTURE_2D_ARRAY?e.texImage3D(pe,he,Ee,tn,me,L.depth,0,Ge,qt,null):e.texImage2D(pe,he,Ee,tn,me,0,Ge,qt,null)}e.bindFramebuffer(i.FRAMEBUFFER,O),$t(L)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,ye,pe,n.get(yt).__webglTexture,0,_e(L)):(pe===i.TEXTURE_2D||pe>=i.TEXTURE_CUBE_MAP_POSITIVE_X&&pe<=i.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&i.framebufferTexture2D(i.FRAMEBUFFER,ye,pe,n.get(yt).__webglTexture,he),e.bindFramebuffer(i.FRAMEBUFFER,null)}function sn(O,L,yt){if(i.bindRenderbuffer(i.RENDERBUFFER,O),L.depthBuffer&&!L.stencilBuffer){let ye=o===!0?i.DEPTH_COMPONENT24:i.DEPTH_COMPONENT16;if(yt||$t(L)){let pe=L.depthTexture;pe&&pe.isDepthTexture&&(pe.type===jr?ye=i.DEPTH_COMPONENT32F:pe.type===Jr&&(ye=i.DEPTH_COMPONENT24));let he=_e(L);$t(L)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,he,ye,L.width,L.height):i.renderbufferStorageMultisample(i.RENDERBUFFER,he,ye,L.width,L.height)}else i.renderbufferStorage(i.RENDERBUFFER,ye,L.width,L.height);i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.RENDERBUFFER,O)}else if(L.depthBuffer&&L.stencilBuffer){let ye=_e(L);yt&&$t(L)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,ye,i.DEPTH24_STENCIL8,L.width,L.height):$t(L)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,ye,i.DEPTH24_STENCIL8,L.width,L.height):i.renderbufferStorage(i.RENDERBUFFER,i.DEPTH_STENCIL,L.width,L.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.RENDERBUFFER,O)}else{let ye=L.isWebGLMultipleRenderTargets===!0?L.texture:[L.texture];for(let pe=0;pe<ye.length;pe++){let he=ye[pe],Ge=r.convert(he.format,he.colorSpace),qt=r.convert(he.type),Ee=C(he.internalFormat,Ge,qt,he.colorSpace),$e=_e(L);yt&&$t(L)===!1?i.renderbufferStorageMultisample(i.RENDERBUFFER,$e,Ee,L.width,L.height):$t(L)?l.renderbufferStorageMultisampleEXT(i.RENDERBUFFER,$e,Ee,L.width,L.height):i.renderbufferStorage(i.RENDERBUFFER,Ee,L.width,L.height)}}i.bindRenderbuffer(i.RENDERBUFFER,null)}function on(O,L){if(L&&L.isWebGLCubeRenderTarget)throw new Error("Depth Texture with cube render targets is not supported");if(e.bindFramebuffer(i.FRAMEBUFFER,O),!(L.depthTexture&&L.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");(!n.get(L.depthTexture).__webglTexture||L.depthTexture.image.width!==L.width||L.depthTexture.image.height!==L.height)&&(L.depthTexture.image.width=L.width,L.depthTexture.image.height=L.height,L.depthTexture.needsUpdate=!0),Rt(L.depthTexture,0);let ye=n.get(L.depthTexture).__webglTexture,pe=_e(L);if(L.depthTexture.format===wo)$t(L)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ye,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_ATTACHMENT,i.TEXTURE_2D,ye,0);else if(L.depthTexture.format===Ea)$t(L)?l.framebufferTexture2DMultisampleEXT(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ye,0,pe):i.framebufferTexture2D(i.FRAMEBUFFER,i.DEPTH_STENCIL_ATTACHMENT,i.TEXTURE_2D,ye,0);else throw new Error("Unknown depthTexture format")}function Ve(O){let L=n.get(O),yt=O.isWebGLCubeRenderTarget===!0;if(O.depthTexture&&!L.__autoAllocateDepthBuffer){if(yt)throw new Error("target.depthTexture not supported in Cube render targets");on(L.__webglFramebuffer,O)}else if(yt){L.__webglDepthbuffer=[];for(let ye=0;ye<6;ye++)e.bindFramebuffer(i.FRAMEBUFFER,L.__webglFramebuffer[ye]),L.__webglDepthbuffer[ye]=i.createRenderbuffer(),sn(L.__webglDepthbuffer[ye],O,!1)}else e.bindFramebuffer(i.FRAMEBUFFER,L.__webglFramebuffer),L.__webglDepthbuffer=i.createRenderbuffer(),sn(L.__webglDepthbuffer,O,!1);e.bindFramebuffer(i.FRAMEBUFFER,null)}function We(O,L,yt){let ye=n.get(O);L!==void 0&&Ne(ye.__webglFramebuffer,O,O.texture,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,0),yt!==void 0&&Ve(O)}function K(O){let L=O.texture,yt=n.get(O),ye=n.get(L);O.addEventListener("dispose",nt),O.isWebGLMultipleRenderTargets!==!0&&(ye.__webglTexture===void 0&&(ye.__webglTexture=i.createTexture()),ye.__version=L.version,a.memory.textures++);let pe=O.isWebGLCubeRenderTarget===!0,he=O.isWebGLMultipleRenderTargets===!0,Ge=p(O)||o;if(pe){yt.__webglFramebuffer=[];for(let qt=0;qt<6;qt++)if(o&&L.mipmaps&&L.mipmaps.length>0){yt.__webglFramebuffer[qt]=[];for(let Ee=0;Ee<L.mipmaps.length;Ee++)yt.__webglFramebuffer[qt][Ee]=i.createFramebuffer()}else yt.__webglFramebuffer[qt]=i.createFramebuffer()}else{if(o&&L.mipmaps&&L.mipmaps.length>0){yt.__webglFramebuffer=[];for(let qt=0;qt<L.mipmaps.length;qt++)yt.__webglFramebuffer[qt]=i.createFramebuffer()}else yt.__webglFramebuffer=i.createFramebuffer();if(he)if(s.drawBuffers){let qt=O.texture;for(let Ee=0,$e=qt.length;Ee<$e;Ee++){let tn=n.get(qt[Ee]);tn.__webglTexture===void 0&&(tn.__webglTexture=i.createTexture(),a.memory.textures++)}}else console.warn("THREE.WebGLRenderer: WebGLMultipleRenderTargets can only be used with WebGL2 or WEBGL_draw_buffers extension.");if(o&&O.samples>0&&$t(O)===!1){let qt=he?L:[L];yt.__webglMultisampledFramebuffer=i.createFramebuffer(),yt.__webglColorRenderbuffer=[],e.bindFramebuffer(i.FRAMEBUFFER,yt.__webglMultisampledFramebuffer);for(let Ee=0;Ee<qt.length;Ee++){let $e=qt[Ee];yt.__webglColorRenderbuffer[Ee]=i.createRenderbuffer(),i.bindRenderbuffer(i.RENDERBUFFER,yt.__webglColorRenderbuffer[Ee]);let tn=r.convert($e.format,$e.colorSpace),me=r.convert($e.type),gn=C($e.internalFormat,tn,me,$e.colorSpace,O.isXRRenderTarget===!0),G=_e(O);i.renderbufferStorageMultisample(i.RENDERBUFFER,G,gn,O.width,O.height),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+Ee,i.RENDERBUFFER,yt.__webglColorRenderbuffer[Ee])}i.bindRenderbuffer(i.RENDERBUFFER,null),O.depthBuffer&&(yt.__webglDepthRenderbuffer=i.createRenderbuffer(),sn(yt.__webglDepthRenderbuffer,O,!0)),e.bindFramebuffer(i.FRAMEBUFFER,null)}}if(pe){e.bindTexture(i.TEXTURE_CUBE_MAP,ye.__webglTexture),Ct(i.TEXTURE_CUBE_MAP,L,Ge);for(let qt=0;qt<6;qt++)if(o&&L.mipmaps&&L.mipmaps.length>0)for(let Ee=0;Ee<L.mipmaps.length;Ee++)Ne(yt.__webglFramebuffer[qt][Ee],O,L,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+qt,Ee);else Ne(yt.__webglFramebuffer[qt],O,L,i.COLOR_ATTACHMENT0,i.TEXTURE_CUBE_MAP_POSITIVE_X+qt,0);T(L,Ge)&&M(i.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(he){let qt=O.texture;for(let Ee=0,$e=qt.length;Ee<$e;Ee++){let tn=qt[Ee],me=n.get(tn);e.bindTexture(i.TEXTURE_2D,me.__webglTexture),Ct(i.TEXTURE_2D,tn,Ge),Ne(yt.__webglFramebuffer,O,tn,i.COLOR_ATTACHMENT0+Ee,i.TEXTURE_2D,0),T(tn,Ge)&&M(i.TEXTURE_2D)}e.unbindTexture()}else{let qt=i.TEXTURE_2D;if((O.isWebGL3DRenderTarget||O.isWebGLArrayRenderTarget)&&(o?qt=O.isWebGL3DRenderTarget?i.TEXTURE_3D:i.TEXTURE_2D_ARRAY:console.error("THREE.WebGLTextures: THREE.Data3DTexture and THREE.DataArrayTexture only supported with WebGL2.")),e.bindTexture(qt,ye.__webglTexture),Ct(qt,L,Ge),o&&L.mipmaps&&L.mipmaps.length>0)for(let Ee=0;Ee<L.mipmaps.length;Ee++)Ne(yt.__webglFramebuffer[Ee],O,L,i.COLOR_ATTACHMENT0,qt,Ee);else Ne(yt.__webglFramebuffer,O,L,i.COLOR_ATTACHMENT0,qt,0);T(L,Ge)&&M(qt),e.unbindTexture()}O.depthBuffer&&Ve(O)}function be(O){let L=p(O)||o,yt=O.isWebGLMultipleRenderTargets===!0?O.texture:[O.texture];for(let ye=0,pe=yt.length;ye<pe;ye++){let he=yt[ye];if(T(he,L)){let Ge=O.isWebGLCubeRenderTarget?i.TEXTURE_CUBE_MAP:i.TEXTURE_2D,qt=n.get(he).__webglTexture;e.bindTexture(Ge,qt),M(Ge),e.unbindTexture()}}}function lt(O){if(o&&O.samples>0&&$t(O)===!1){let L=O.isWebGLMultipleRenderTargets?O.texture:[O.texture],yt=O.width,ye=O.height,pe=i.COLOR_BUFFER_BIT,he=[],Ge=O.stencilBuffer?i.DEPTH_STENCIL_ATTACHMENT:i.DEPTH_ATTACHMENT,qt=n.get(O),Ee=O.isWebGLMultipleRenderTargets===!0;if(Ee)for(let $e=0;$e<L.length;$e++)e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$e,i.RENDERBUFFER,null),e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+$e,i.TEXTURE_2D,null,0);e.bindFramebuffer(i.READ_FRAMEBUFFER,qt.__webglMultisampledFramebuffer),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,qt.__webglFramebuffer);for(let $e=0;$e<L.length;$e++){he.push(i.COLOR_ATTACHMENT0+$e),O.depthBuffer&&he.push(Ge);let tn=qt.__ignoreDepthValues!==void 0?qt.__ignoreDepthValues:!1;if(tn===!1&&(O.depthBuffer&&(pe|=i.DEPTH_BUFFER_BIT),O.stencilBuffer&&(pe|=i.STENCIL_BUFFER_BIT)),Ee&&i.framebufferRenderbuffer(i.READ_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.RENDERBUFFER,qt.__webglColorRenderbuffer[$e]),tn===!0&&(i.invalidateFramebuffer(i.READ_FRAMEBUFFER,[Ge]),i.invalidateFramebuffer(i.DRAW_FRAMEBUFFER,[Ge])),Ee){let me=n.get(L[$e]).__webglTexture;i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,me,0)}i.blitFramebuffer(0,0,yt,ye,0,0,yt,ye,pe,i.NEAREST),h&&i.invalidateFramebuffer(i.READ_FRAMEBUFFER,he)}if(e.bindFramebuffer(i.READ_FRAMEBUFFER,null),e.bindFramebuffer(i.DRAW_FRAMEBUFFER,null),Ee)for(let $e=0;$e<L.length;$e++){e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglMultisampledFramebuffer),i.framebufferRenderbuffer(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0+$e,i.RENDERBUFFER,qt.__webglColorRenderbuffer[$e]);let tn=n.get(L[$e]).__webglTexture;e.bindFramebuffer(i.FRAMEBUFFER,qt.__webglFramebuffer),i.framebufferTexture2D(i.DRAW_FRAMEBUFFER,i.COLOR_ATTACHMENT0+$e,i.TEXTURE_2D,tn,0)}e.bindFramebuffer(i.DRAW_FRAMEBUFFER,qt.__webglMultisampledFramebuffer)}}function _e(O){return Math.min(s.maxSamples,O.samples)}function $t(O){let L=n.get(O);return o&&O.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&L.__useRenderToTexture!==!1}function Be(O){let L=a.render.frame;u.get(O)!==L&&(u.set(O,L),O.update())}function Me(O,L){let yt=O.colorSpace,ye=O.format,pe=O.type;return O.isCompressedTexture===!0||O.isVideoTexture===!0||O.format===Cf||yt!==Lr&&yt!==Bs&&(Wn.getTransfer(yt)===oi?o===!1?t.has("EXT_sRGB")===!0&&ye===js?(O.format=Cf,O.minFilter=ms,O.generateMipmaps=!1):L=jc.sRGBToLinear(L):(ye!==js||pe!==to)&&console.warn("THREE.WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):console.error("THREE.WebGLTextures: Unsupported texture color space:",yt)),L}this.allocateTextureUnit=et,this.resetTextureUnits=ce,this.setTexture2D=Rt,this.setTexture2DArray=Xt,this.setTexture3D=Qt,this.setTextureCube=Lt,this.rebindTextures=We,this.setupRenderTarget=K,this.updateRenderTargetMipmap=be,this.updateMultisampleRenderTarget=lt,this.setupDepthRenderbuffer=Ve,this.setupFrameBufferTexture=Ne,this.useMultisampledRTT=$t}function dS(i,t,e){let n=e.isWebGL2;function s(r,a=Bs){let o,l=Wn.getTransfer(a);if(r===to)return i.UNSIGNED_BYTE;if(r===V0)return i.UNSIGNED_SHORT_4_4_4_4;if(r===G0)return i.UNSIGNED_SHORT_5_5_5_1;if(r===$1)return i.BYTE;if(r===Z1)return i.SHORT;if(r===gd)return i.UNSIGNED_SHORT;if(r===H0)return i.INT;if(r===Jr)return i.UNSIGNED_INT;if(r===jr)return i.FLOAT;if(r===yl)return n?i.HALF_FLOAT:(o=t.get("OES_texture_half_float"),o!==null?o.HALF_FLOAT_OES:null);if(r===J1)return i.ALPHA;if(r===js)return i.RGBA;if(r===j1)return i.LUMINANCE;if(r===K1)return i.LUMINANCE_ALPHA;if(r===wo)return i.DEPTH_COMPONENT;if(r===Ea)return i.DEPTH_STENCIL;if(r===Cf)return o=t.get("EXT_sRGB"),o!==null?o.SRGB_ALPHA_EXT:null;if(r===Q1)return i.RED;if(r===W0)return i.RED_INTEGER;if(r===ty)return i.RG;if(r===X0)return i.RG_INTEGER;if(r===q0)return i.RGBA_INTEGER;if(r===Gu||r===Wu||r===Xu||r===qu)if(l===oi)if(o=t.get("WEBGL_compressed_texture_s3tc_srgb"),o!==null){if(r===Gu)return o.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(r===Wu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(r===Xu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(r===qu)return o.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(o=t.get("WEBGL_compressed_texture_s3tc"),o!==null){if(r===Gu)return o.COMPRESSED_RGB_S3TC_DXT1_EXT;if(r===Wu)return o.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(r===Xu)return o.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(r===qu)return o.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(r===cm||r===hm||r===um||r===fm)if(o=t.get("WEBGL_compressed_texture_pvrtc"),o!==null){if(r===cm)return o.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(r===hm)return o.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(r===um)return o.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(r===fm)return o.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(r===Y0)return o=t.get("WEBGL_compressed_texture_etc1"),o!==null?o.COMPRESSED_RGB_ETC1_WEBGL:null;if(r===dm||r===pm)if(o=t.get("WEBGL_compressed_texture_etc"),o!==null){if(r===dm)return l===oi?o.COMPRESSED_SRGB8_ETC2:o.COMPRESSED_RGB8_ETC2;if(r===pm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:o.COMPRESSED_RGBA8_ETC2_EAC}else return null;if(r===mm||r===gm||r===xm||r===ym||r===_m||r===vm||r===Mm||r===bm||r===Sm||r===Em||r===wm||r===Tm||r===Am||r===Rm)if(o=t.get("WEBGL_compressed_texture_astc"),o!==null){if(r===mm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:o.COMPRESSED_RGBA_ASTC_4x4_KHR;if(r===gm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:o.COMPRESSED_RGBA_ASTC_5x4_KHR;if(r===xm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:o.COMPRESSED_RGBA_ASTC_5x5_KHR;if(r===ym)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:o.COMPRESSED_RGBA_ASTC_6x5_KHR;if(r===_m)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:o.COMPRESSED_RGBA_ASTC_6x6_KHR;if(r===vm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:o.COMPRESSED_RGBA_ASTC_8x5_KHR;if(r===Mm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:o.COMPRESSED_RGBA_ASTC_8x6_KHR;if(r===bm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:o.COMPRESSED_RGBA_ASTC_8x8_KHR;if(r===Sm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:o.COMPRESSED_RGBA_ASTC_10x5_KHR;if(r===Em)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:o.COMPRESSED_RGBA_ASTC_10x6_KHR;if(r===wm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:o.COMPRESSED_RGBA_ASTC_10x8_KHR;if(r===Tm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:o.COMPRESSED_RGBA_ASTC_10x10_KHR;if(r===Am)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:o.COMPRESSED_RGBA_ASTC_12x10_KHR;if(r===Rm)return l===oi?o.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:o.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(r===Yu||r===Cm||r===Pm)if(o=t.get("EXT_texture_compression_bptc"),o!==null){if(r===Yu)return l===oi?o.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:o.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(r===Cm)return o.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(r===Pm)return o.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(r===ey||r===Lm||r===Im||r===Dm)if(o=t.get("EXT_texture_compression_rgtc"),o!==null){if(r===Yu)return o.COMPRESSED_RED_RGTC1_EXT;if(r===Lm)return o.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(r===Im)return o.COMPRESSED_RED_GREEN_RGTC2_EXT;if(r===Dm)return o.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return r===Eo?n?i.UNSIGNED_INT_24_8:(o=t.get("WEBGL_depth_texture"),o!==null?o.UNSIGNED_INT_24_8_WEBGL:null):i[r]!==void 0?i[r]:null}return{convert:s}}var Gf=class extends Gi{constructor(t=[]){super(),this.isArrayCamera=!0,this.cameras=t}},Pn=class extends vi{constructor(){super(),this.isGroup=!0,this.type="Group"}},pS={type:"move"},pl=class{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new Pn,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new Pn,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new X,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new X),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new Pn,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new X,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new X),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){let e=this._hand;if(e)for(let n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let s=null,r=null,a=null,o=this._targetRay,l=this._grip,h=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(h&&t.hand){a=!0;for(let v of t.hand.values()){let p=e.getJointPose(v,n),x=this._getHandJoint(h,v);p!==null&&(x.matrix.fromArray(p.transform.matrix),x.matrix.decompose(x.position,x.rotation,x.scale),x.matrixWorldNeedsUpdate=!0,x.jointRadius=p.radius),x.visible=p!==null}let u=h.joints["index-finger-tip"],f=h.joints["thumb-tip"],m=u.position.distanceTo(f.position),d=.02,y=.005;h.inputState.pinching&&m>d+y?(h.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!h.inputState.pinching&&m<=d-y&&(h.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(r=e.getPose(t.gripSpace,n),r!==null&&(l.matrix.fromArray(r.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,r.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(r.linearVelocity)):l.hasLinearVelocity=!1,r.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(r.angularVelocity)):l.hasAngularVelocity=!1));o!==null&&(s=e.getPose(t.targetRaySpace,n),s===null&&r!==null&&(s=r),s!==null&&(o.matrix.fromArray(s.transform.matrix),o.matrix.decompose(o.position,o.rotation,o.scale),o.matrixWorldNeedsUpdate=!0,s.linearVelocity?(o.hasLinearVelocity=!0,o.linearVelocity.copy(s.linearVelocity)):o.hasLinearVelocity=!1,s.angularVelocity?(o.hasAngularVelocity=!0,o.angularVelocity.copy(s.angularVelocity)):o.hasAngularVelocity=!1,this.dispatchEvent(pS)))}return o!==null&&(o.visible=s!==null),l!==null&&(l.visible=r!==null),h!==null&&(h.visible=a!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){let n=new Pn;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}},Wf=class extends pr{constructor(t,e){super();let n=this,s=null,r=1,a=null,o="local-floor",l=1,h=null,u=null,f=null,m=null,d=null,y=null,v=e.getContextAttributes(),p=null,x=null,T=[],M=[],C=new de,P=null,I=new Gi;I.layers.enable(1),I.viewport=new Fn;let z=new Gi;z.layers.enable(2),z.viewport=new Fn;let nt=[I,z],R=new Gf;R.layers.enable(1),R.layers.enable(2);let w=null,at=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(Ct){let It=T[Ct];return It===void 0&&(It=new pl,T[Ct]=It),It.getTargetRaySpace()},this.getControllerGrip=function(Ct){let It=T[Ct];return It===void 0&&(It=new pl,T[Ct]=It),It.getGripSpace()},this.getHand=function(Ct){let It=T[Ct];return It===void 0&&(It=new pl,T[Ct]=It),It.getHandSpace()};function wt(Ct){let It=M.indexOf(Ct.inputSource);if(It===-1)return;let se=T[It];se!==void 0&&(se.update(Ct.inputSource,Ct.frame,h||a),se.dispatchEvent({type:Ct.type,data:Ct.inputSource}))}function ce(){s.removeEventListener("select",wt),s.removeEventListener("selectstart",wt),s.removeEventListener("selectend",wt),s.removeEventListener("squeeze",wt),s.removeEventListener("squeezestart",wt),s.removeEventListener("squeezeend",wt),s.removeEventListener("end",ce),s.removeEventListener("inputsourceschange",et);for(let Ct=0;Ct<T.length;Ct++){let It=M[Ct];It!==null&&(M[Ct]=null,T[Ct].disconnect(It))}w=null,at=null,t.setRenderTarget(p),d=null,m=null,f=null,s=null,x=null,we.stop(),n.isPresenting=!1,t.setPixelRatio(P),t.setSize(C.width,C.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(Ct){r=Ct,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(Ct){o=Ct,n.isPresenting===!0&&console.warn("THREE.WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return h||a},this.setReferenceSpace=function(Ct){h=Ct},this.getBaseLayer=function(){return m!==null?m:d},this.getBinding=function(){return f},this.getFrame=function(){return y},this.getSession=function(){return s},this.setSession=async function(Ct){if(s=Ct,s!==null){if(p=t.getRenderTarget(),s.addEventListener("select",wt),s.addEventListener("selectstart",wt),s.addEventListener("selectend",wt),s.addEventListener("squeeze",wt),s.addEventListener("squeezestart",wt),s.addEventListener("squeezeend",wt),s.addEventListener("end",ce),s.addEventListener("inputsourceschange",et),v.xrCompatible!==!0&&await e.makeXRCompatible(),P=t.getPixelRatio(),t.getSize(C),s.renderState.layers===void 0||t.capabilities.isWebGL2===!1){let It={antialias:s.renderState.layers===void 0?v.antialias:!0,alpha:!0,depth:v.depth,stencil:v.stencil,framebufferScaleFactor:r};d=new XRWebGLLayer(s,e,It),s.updateRenderState({baseLayer:d}),t.setPixelRatio(1),t.setSize(d.framebufferWidth,d.framebufferHeight,!1),x=new Ir(d.framebufferWidth,d.framebufferHeight,{format:js,type:to,colorSpace:t.outputColorSpace,stencilBuffer:v.stencil})}else{let It=null,se=null,Le=null;v.depth&&(Le=v.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,It=v.stencil?Ea:wo,se=v.stencil?Eo:Jr);let Ne={colorFormat:e.RGBA8,depthFormat:Le,scaleFactor:r};f=new XRWebGLBinding(s,e),m=f.createProjectionLayer(Ne),s.updateRenderState({layers:[m]}),t.setPixelRatio(1),t.setSize(m.textureWidth,m.textureHeight,!1),x=new Ir(m.textureWidth,m.textureHeight,{format:js,type:to,depthTexture:new ah(m.textureWidth,m.textureHeight,se,void 0,void 0,void 0,void 0,void 0,void 0,It),stencilBuffer:v.stencil,colorSpace:t.outputColorSpace,samples:v.antialias?4:0});let sn=t.properties.get(x);sn.__ignoreDepthValues=m.ignoreDepthValues}x.isXRRenderTarget=!0,this.setFoveation(l),h=null,a=await s.requestReferenceSpace(o),we.setContext(s),we.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(s!==null)return s.environmentBlendMode};function et(Ct){for(let It=0;It<Ct.removed.length;It++){let se=Ct.removed[It],Le=M.indexOf(se);Le>=0&&(M[Le]=null,T[Le].disconnect(se))}for(let It=0;It<Ct.added.length;It++){let se=Ct.added[It],Le=M.indexOf(se);if(Le===-1){for(let sn=0;sn<T.length;sn++)if(sn>=M.length){M.push(se),Le=sn;break}else if(M[sn]===null){M[sn]=se,Le=sn;break}if(Le===-1)break}let Ne=T[Le];Ne&&Ne.connect(se)}}let ft=new X,Rt=new X;function Xt(Ct,It,se){ft.setFromMatrixPosition(It.matrixWorld),Rt.setFromMatrixPosition(se.matrixWorld);let Le=ft.distanceTo(Rt),Ne=It.projectionMatrix.elements,sn=se.projectionMatrix.elements,on=Ne[14]/(Ne[10]-1),Ve=Ne[14]/(Ne[10]+1),We=(Ne[9]+1)/Ne[5],K=(Ne[9]-1)/Ne[5],be=(Ne[8]-1)/Ne[0],lt=(sn[8]+1)/sn[0],_e=on*be,$t=on*lt,Be=Le/(-be+lt),Me=Be*-be;It.matrixWorld.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.translateX(Me),Ct.translateZ(Be),Ct.matrixWorld.compose(Ct.position,Ct.quaternion,Ct.scale),Ct.matrixWorldInverse.copy(Ct.matrixWorld).invert();let O=on+Be,L=Ve+Be,yt=_e-Me,ye=$t+(Le-Me),pe=We*Ve/L*O,he=K*Ve/L*O;Ct.projectionMatrix.makePerspective(yt,ye,pe,he,O,L),Ct.projectionMatrixInverse.copy(Ct.projectionMatrix).invert()}function Qt(Ct,It){It===null?Ct.matrixWorld.copy(Ct.matrix):Ct.matrixWorld.multiplyMatrices(It.matrixWorld,Ct.matrix),Ct.matrixWorldInverse.copy(Ct.matrixWorld).invert()}this.updateCamera=function(Ct){if(s===null)return;R.near=z.near=I.near=Ct.near,R.far=z.far=I.far=Ct.far,(w!==R.near||at!==R.far)&&(s.updateRenderState({depthNear:R.near,depthFar:R.far}),w=R.near,at=R.far);let It=Ct.parent,se=R.cameras;Qt(R,It);for(let Le=0;Le<se.length;Le++)Qt(se[Le],It);se.length===2?Xt(R,I,z):R.projectionMatrix.copy(I.projectionMatrix),Lt(Ct,R,It)};function Lt(Ct,It,se){se===null?Ct.matrix.copy(It.matrixWorld):(Ct.matrix.copy(se.matrixWorld),Ct.matrix.invert(),Ct.matrix.multiply(It.matrixWorld)),Ct.matrix.decompose(Ct.position,Ct.quaternion,Ct.scale),Ct.updateMatrixWorld(!0),Ct.projectionMatrix.copy(It.projectionMatrix),Ct.projectionMatrixInverse.copy(It.projectionMatrixInverse),Ct.isPerspectiveCamera&&(Ct.fov=_l*2*Math.atan(1/Ct.projectionMatrix.elements[5]),Ct.zoom=1)}this.getCamera=function(){return R},this.getFoveation=function(){if(!(m===null&&d===null))return l},this.setFoveation=function(Ct){l=Ct,m!==null&&(m.fixedFoveation=Ct),d!==null&&d.fixedFoveation!==void 0&&(d.fixedFoveation=Ct)};let jt=null;function fe(Ct,It){if(u=It.getViewerPose(h||a),y=It,u!==null){let se=u.views;d!==null&&(t.setRenderTargetFramebuffer(x,d.framebuffer),t.setRenderTarget(x));let Le=!1;se.length!==R.cameras.length&&(R.cameras.length=0,Le=!0);for(let Ne=0;Ne<se.length;Ne++){let sn=se[Ne],on=null;if(d!==null)on=d.getViewport(sn);else{let We=f.getViewSubImage(m,sn);on=We.viewport,Ne===0&&(t.setRenderTargetTextures(x,We.colorTexture,m.ignoreDepthValues?void 0:We.depthStencilTexture),t.setRenderTarget(x))}let Ve=nt[Ne];Ve===void 0&&(Ve=new Gi,Ve.layers.enable(Ne),Ve.viewport=new Fn,nt[Ne]=Ve),Ve.matrix.fromArray(sn.transform.matrix),Ve.matrix.decompose(Ve.position,Ve.quaternion,Ve.scale),Ve.projectionMatrix.fromArray(sn.projectionMatrix),Ve.projectionMatrixInverse.copy(Ve.projectionMatrix).invert(),Ve.viewport.set(on.x,on.y,on.width,on.height),Ne===0&&(R.matrix.copy(Ve.matrix),R.matrix.decompose(R.position,R.quaternion,R.scale)),Le===!0&&R.cameras.push(Ve)}}for(let se=0;se<T.length;se++){let Le=M[se],Ne=T[se];Le!==null&&Ne!==void 0&&Ne.update(Le,It,h||a)}jt&&jt(Ct,It),It.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:It}),y=null}let we=new Q0;we.setAnimationLoop(fe),this.setAnimationLoop=function(Ct){jt=Ct},this.dispose=function(){}}};function mS(i,t){function e(p,x){p.matrixAutoUpdate===!0&&p.updateMatrix(),x.value.copy(p.matrix)}function n(p,x){x.color.getRGB(p.fogColor.value,K0(i)),x.isFog?(p.fogNear.value=x.near,p.fogFar.value=x.far):x.isFogExp2&&(p.fogDensity.value=x.density)}function s(p,x,T,M,C){x.isMeshBasicMaterial||x.isMeshLambertMaterial?r(p,x):x.isMeshToonMaterial?(r(p,x),f(p,x)):x.isMeshPhongMaterial?(r(p,x),u(p,x)):x.isMeshStandardMaterial?(r(p,x),m(p,x),x.isMeshPhysicalMaterial&&d(p,x,C)):x.isMeshMatcapMaterial?(r(p,x),y(p,x)):x.isMeshDepthMaterial?r(p,x):x.isMeshDistanceMaterial?(r(p,x),v(p,x)):x.isMeshNormalMaterial?r(p,x):x.isLineBasicMaterial?(a(p,x),x.isLineDashedMaterial&&o(p,x)):x.isPointsMaterial?l(p,x,T,M):x.isSpriteMaterial?h(p,x):x.isShadowMaterial?(p.color.value.copy(x.color),p.opacity.value=x.opacity):x.isShaderMaterial&&(x.uniformsNeedUpdate=!1)}function r(p,x){p.opacity.value=x.opacity,x.color&&p.diffuse.value.copy(x.color),x.emissive&&p.emissive.value.copy(x.emissive).multiplyScalar(x.emissiveIntensity),x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.bumpMap&&(p.bumpMap.value=x.bumpMap,e(x.bumpMap,p.bumpMapTransform),p.bumpScale.value=x.bumpScale,x.side===gs&&(p.bumpScale.value*=-1)),x.normalMap&&(p.normalMap.value=x.normalMap,e(x.normalMap,p.normalMapTransform),p.normalScale.value.copy(x.normalScale),x.side===gs&&p.normalScale.value.negate()),x.displacementMap&&(p.displacementMap.value=x.displacementMap,e(x.displacementMap,p.displacementMapTransform),p.displacementScale.value=x.displacementScale,p.displacementBias.value=x.displacementBias),x.emissiveMap&&(p.emissiveMap.value=x.emissiveMap,e(x.emissiveMap,p.emissiveMapTransform)),x.specularMap&&(p.specularMap.value=x.specularMap,e(x.specularMap,p.specularMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest);let T=t.get(x).envMap;if(T&&(p.envMap.value=T,p.flipEnvMap.value=T.isCubeTexture&&T.isRenderTargetTexture===!1?-1:1,p.reflectivity.value=x.reflectivity,p.ior.value=x.ior,p.refractionRatio.value=x.refractionRatio),x.lightMap){p.lightMap.value=x.lightMap;let M=i._useLegacyLights===!0?Math.PI:1;p.lightMapIntensity.value=x.lightMapIntensity*M,e(x.lightMap,p.lightMapTransform)}x.aoMap&&(p.aoMap.value=x.aoMap,p.aoMapIntensity.value=x.aoMapIntensity,e(x.aoMap,p.aoMapTransform))}function a(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform))}function o(p,x){p.dashSize.value=x.dashSize,p.totalSize.value=x.dashSize+x.gapSize,p.scale.value=x.scale}function l(p,x,T,M){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.size.value=x.size*T,p.scale.value=M*.5,x.map&&(p.map.value=x.map,e(x.map,p.uvTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function h(p,x){p.diffuse.value.copy(x.color),p.opacity.value=x.opacity,p.rotation.value=x.rotation,x.map&&(p.map.value=x.map,e(x.map,p.mapTransform)),x.alphaMap&&(p.alphaMap.value=x.alphaMap,e(x.alphaMap,p.alphaMapTransform)),x.alphaTest>0&&(p.alphaTest.value=x.alphaTest)}function u(p,x){p.specular.value.copy(x.specular),p.shininess.value=Math.max(x.shininess,1e-4)}function f(p,x){x.gradientMap&&(p.gradientMap.value=x.gradientMap)}function m(p,x){p.metalness.value=x.metalness,x.metalnessMap&&(p.metalnessMap.value=x.metalnessMap,e(x.metalnessMap,p.metalnessMapTransform)),p.roughness.value=x.roughness,x.roughnessMap&&(p.roughnessMap.value=x.roughnessMap,e(x.roughnessMap,p.roughnessMapTransform)),t.get(x).envMap&&(p.envMapIntensity.value=x.envMapIntensity)}function d(p,x,T){p.ior.value=x.ior,x.sheen>0&&(p.sheenColor.value.copy(x.sheenColor).multiplyScalar(x.sheen),p.sheenRoughness.value=x.sheenRoughness,x.sheenColorMap&&(p.sheenColorMap.value=x.sheenColorMap,e(x.sheenColorMap,p.sheenColorMapTransform)),x.sheenRoughnessMap&&(p.sheenRoughnessMap.value=x.sheenRoughnessMap,e(x.sheenRoughnessMap,p.sheenRoughnessMapTransform))),x.clearcoat>0&&(p.clearcoat.value=x.clearcoat,p.clearcoatRoughness.value=x.clearcoatRoughness,x.clearcoatMap&&(p.clearcoatMap.value=x.clearcoatMap,e(x.clearcoatMap,p.clearcoatMapTransform)),x.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=x.clearcoatRoughnessMap,e(x.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),x.clearcoatNormalMap&&(p.clearcoatNormalMap.value=x.clearcoatNormalMap,e(x.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(x.clearcoatNormalScale),x.side===gs&&p.clearcoatNormalScale.value.negate())),x.iridescence>0&&(p.iridescence.value=x.iridescence,p.iridescenceIOR.value=x.iridescenceIOR,p.iridescenceThicknessMinimum.value=x.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=x.iridescenceThicknessRange[1],x.iridescenceMap&&(p.iridescenceMap.value=x.iridescenceMap,e(x.iridescenceMap,p.iridescenceMapTransform)),x.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=x.iridescenceThicknessMap,e(x.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),x.transmission>0&&(p.transmission.value=x.transmission,p.transmissionSamplerMap.value=T.texture,p.transmissionSamplerSize.value.set(T.width,T.height),x.transmissionMap&&(p.transmissionMap.value=x.transmissionMap,e(x.transmissionMap,p.transmissionMapTransform)),p.thickness.value=x.thickness,x.thicknessMap&&(p.thicknessMap.value=x.thicknessMap,e(x.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=x.attenuationDistance,p.attenuationColor.value.copy(x.attenuationColor)),x.anisotropy>0&&(p.anisotropyVector.value.set(x.anisotropy*Math.cos(x.anisotropyRotation),x.anisotropy*Math.sin(x.anisotropyRotation)),x.anisotropyMap&&(p.anisotropyMap.value=x.anisotropyMap,e(x.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=x.specularIntensity,p.specularColor.value.copy(x.specularColor),x.specularColorMap&&(p.specularColorMap.value=x.specularColorMap,e(x.specularColorMap,p.specularColorMapTransform)),x.specularIntensityMap&&(p.specularIntensityMap.value=x.specularIntensityMap,e(x.specularIntensityMap,p.specularIntensityMapTransform))}function y(p,x){x.matcap&&(p.matcap.value=x.matcap)}function v(p,x){let T=t.get(x).light;p.referencePosition.value.setFromMatrixPosition(T.matrixWorld),p.nearDistance.value=T.shadow.camera.near,p.farDistance.value=T.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:s}}function gS(i,t,e,n){let s={},r={},a=[],o=e.isWebGL2?i.getParameter(i.MAX_UNIFORM_BUFFER_BINDINGS):0;function l(T,M){let C=M.program;n.uniformBlockBinding(T,C)}function h(T,M){let C=s[T.id];C===void 0&&(y(T),C=u(T),s[T.id]=C,T.addEventListener("dispose",p));let P=M.program;n.updateUBOMapping(T,P);let I=t.render.frame;r[T.id]!==I&&(m(T),r[T.id]=I)}function u(T){let M=f();T.__bindingPointIndex=M;let C=i.createBuffer(),P=T.__size,I=T.usage;return i.bindBuffer(i.UNIFORM_BUFFER,C),i.bufferData(i.UNIFORM_BUFFER,P,I),i.bindBuffer(i.UNIFORM_BUFFER,null),i.bindBufferBase(i.UNIFORM_BUFFER,M,C),C}function f(){for(let T=0;T<o;T++)if(a.indexOf(T)===-1)return a.push(T),T;return console.error("THREE.WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function m(T){let M=s[T.id],C=T.uniforms,P=T.__cache;i.bindBuffer(i.UNIFORM_BUFFER,M);for(let I=0,z=C.length;I<z;I++){let nt=Array.isArray(C[I])?C[I]:[C[I]];for(let R=0,w=nt.length;R<w;R++){let at=nt[R];if(d(at,I,R,P)===!0){let wt=at.__offset,ce=Array.isArray(at.value)?at.value:[at.value],et=0;for(let ft=0;ft<ce.length;ft++){let Rt=ce[ft],Xt=v(Rt);typeof Rt=="number"||typeof Rt=="boolean"?(at.__data[0]=Rt,i.bufferSubData(i.UNIFORM_BUFFER,wt+et,at.__data)):Rt.isMatrix3?(at.__data[0]=Rt.elements[0],at.__data[1]=Rt.elements[1],at.__data[2]=Rt.elements[2],at.__data[3]=0,at.__data[4]=Rt.elements[3],at.__data[5]=Rt.elements[4],at.__data[6]=Rt.elements[5],at.__data[7]=0,at.__data[8]=Rt.elements[6],at.__data[9]=Rt.elements[7],at.__data[10]=Rt.elements[8],at.__data[11]=0):(Rt.toArray(at.__data,et),et+=Xt.storage/Float32Array.BYTES_PER_ELEMENT)}i.bufferSubData(i.UNIFORM_BUFFER,wt,at.__data)}}}i.bindBuffer(i.UNIFORM_BUFFER,null)}function d(T,M,C,P){let I=T.value,z=M+"_"+C;if(P[z]===void 0)return typeof I=="number"||typeof I=="boolean"?P[z]=I:P[z]=I.clone(),!0;{let nt=P[z];if(typeof I=="number"||typeof I=="boolean"){if(nt!==I)return P[z]=I,!0}else if(nt.equals(I)===!1)return nt.copy(I),!0}return!1}function y(T){let M=T.uniforms,C=0,P=16;for(let z=0,nt=M.length;z<nt;z++){let R=Array.isArray(M[z])?M[z]:[M[z]];for(let w=0,at=R.length;w<at;w++){let wt=R[w],ce=Array.isArray(wt.value)?wt.value:[wt.value];for(let et=0,ft=ce.length;et<ft;et++){let Rt=ce[et],Xt=v(Rt),Qt=C%P;Qt!==0&&P-Qt<Xt.boundary&&(C+=P-Qt),wt.__data=new Float32Array(Xt.storage/Float32Array.BYTES_PER_ELEMENT),wt.__offset=C,C+=Xt.storage}}}let I=C%P;return I>0&&(C+=P-I),T.__size=C,T.__cache={},this}function v(T){let M={boundary:0,storage:0};return typeof T=="number"||typeof T=="boolean"?(M.boundary=4,M.storage=4):T.isVector2?(M.boundary=8,M.storage=8):T.isVector3||T.isColor?(M.boundary=16,M.storage=12):T.isVector4?(M.boundary=16,M.storage=16):T.isMatrix3?(M.boundary=48,M.storage=48):T.isMatrix4?(M.boundary=64,M.storage=64):T.isTexture?console.warn("THREE.WebGLRenderer: Texture samplers can not be part of an uniforms group."):console.warn("THREE.WebGLRenderer: Unsupported uniform value type.",T),M}function p(T){let M=T.target;M.removeEventListener("dispose",p);let C=a.indexOf(M.__bindingPointIndex);a.splice(C,1),i.deleteBuffer(s[M.id]),delete s[M.id],delete r[M.id]}function x(){for(let T in s)i.deleteBuffer(s[T]);a=[],s={},r={}}return{bind:l,update:h,dispose:x}}var bl=class{constructor(t={}){let{canvas:e=Ty(),context:n=null,depth:s=!0,stencil:r=!0,alpha:a=!1,antialias:o=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:h=!1,powerPreference:u="default",failIfMajorPerformanceCaveat:f=!1}=t;this.isWebGLRenderer=!0;let m;n!==null?m=n.getContextAttributes().alpha:m=a;let d=new Uint32Array(4),y=new Int32Array(4),v=null,p=null,x=[],T=[];this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this._outputColorSpace=kn,this._useLegacyLights=!1,this.toneMapping=Qr,this.toneMappingExposure=1;let M=this,C=!1,P=0,I=0,z=null,nt=-1,R=null,w=new Fn,at=new Fn,wt=null,ce=new fn(0),et=0,ft=e.width,Rt=e.height,Xt=1,Qt=null,Lt=null,jt=new Fn(0,0,ft,Rt),fe=new Fn(0,0,ft,Rt),we=!1,Ct=new Ml,It=!1,se=!1,Le=null,Ne=new Nn,sn=new de,on=new X,Ve={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};function We(){return z===null?Xt:1}let K=n;function be(B,gt){for(let Tt=0;Tt<B.length;Tt++){let Ft=B[Tt],At=e.getContext(Ft,gt);if(At!==null)return At}return null}try{let B={alpha:!0,depth:s,stencil:r,antialias:o,premultipliedAlpha:l,preserveDrawingBuffer:h,powerPreference:u,failIfMajorPerformanceCaveat:f};if("setAttribute"in e&&e.setAttribute("data-engine","three.js r160"),e.addEventListener("webglcontextlost",ct,!1),e.addEventListener("webglcontextrestored",V,!1),e.addEventListener("webglcontextcreationerror",Pt,!1),K===null){let gt=["webgl2","webgl","experimental-webgl"];if(M.isWebGL1Renderer===!0&&gt.shift(),K=be(gt,B),K===null)throw be(gt)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}typeof WebGLRenderingContext<"u"&&K instanceof WebGLRenderingContext&&console.warn("THREE.WebGLRenderer: WebGL 1 support was deprecated in r153 and will be removed in r163."),K.getShaderPrecisionFormat===void 0&&(K.getShaderPrecisionFormat=function(){return{rangeMin:1,rangeMax:1,precision:1}})}catch(B){throw console.error("THREE.WebGLRenderer: "+B.message),B}let lt,_e,$t,Be,Me,O,L,yt,ye,pe,he,Ge,qt,Ee,$e,tn,me,gn,G,ue,ve,tt,dt,Zt;function Kt(){lt=new NM(K),_e=new CM(K,lt,t),lt.init(_e),tt=new dS(K,lt,_e),$t=new uS(K,lt,_e),Be=new BM(K),Me=new Qb,O=new fS(K,lt,$t,Me,_e,tt,Be),L=new LM(M),yt=new UM(M),ye=new qy(K,_e),dt=new AM(K,lt,ye,_e),pe=new OM(K,ye,Be,dt),he=new VM(K,pe,ye,Be),G=new HM(K,_e,O),tn=new PM(Me),Ge=new Kb(M,L,yt,lt,_e,dt,tn),qt=new mS(M,Me),Ee=new eS,$e=new aS(lt,_e),gn=new TM(M,L,yt,$t,he,m,l),me=new hS(M,he,_e),Zt=new gS(K,Be,_e,$t),ue=new RM(K,lt,Be,_e),ve=new FM(K,lt,Be,_e),Be.programs=Ge.programs,M.capabilities=_e,M.extensions=lt,M.properties=Me,M.renderLists=Ee,M.shadowMap=me,M.state=$t,M.info=Be}Kt();let te=new Wf(M,K);this.xr=te,this.getContext=function(){return K},this.getContextAttributes=function(){return K.getContextAttributes()},this.forceContextLoss=function(){let B=lt.get("WEBGL_lose_context");B&&B.loseContext()},this.forceContextRestore=function(){let B=lt.get("WEBGL_lose_context");B&&B.restoreContext()},this.getPixelRatio=function(){return Xt},this.setPixelRatio=function(B){B!==void 0&&(Xt=B,this.setSize(ft,Rt,!1))},this.getSize=function(B){return B.set(ft,Rt)},this.setSize=function(B,gt,Tt=!0){if(te.isPresenting){console.warn("THREE.WebGLRenderer: Can't change size while VR device is presenting.");return}ft=B,Rt=gt,e.width=Math.floor(B*Xt),e.height=Math.floor(gt*Xt),Tt===!0&&(e.style.width=B+"px",e.style.height=gt+"px"),this.setViewport(0,0,B,gt)},this.getDrawingBufferSize=function(B){return B.set(ft*Xt,Rt*Xt).floor()},this.setDrawingBufferSize=function(B,gt,Tt){ft=B,Rt=gt,Xt=Tt,e.width=Math.floor(B*Tt),e.height=Math.floor(gt*Tt),this.setViewport(0,0,B,gt)},this.getCurrentViewport=function(B){return B.copy(w)},this.getViewport=function(B){return B.copy(jt)},this.setViewport=function(B,gt,Tt,Ft){B.isVector4?jt.set(B.x,B.y,B.z,B.w):jt.set(B,gt,Tt,Ft),$t.viewport(w.copy(jt).multiplyScalar(Xt).floor())},this.getScissor=function(B){return B.copy(fe)},this.setScissor=function(B,gt,Tt,Ft){B.isVector4?fe.set(B.x,B.y,B.z,B.w):fe.set(B,gt,Tt,Ft),$t.scissor(at.copy(fe).multiplyScalar(Xt).floor())},this.getScissorTest=function(){return we},this.setScissorTest=function(B){$t.setScissorTest(we=B)},this.setOpaqueSort=function(B){Qt=B},this.setTransparentSort=function(B){Lt=B},this.getClearColor=function(B){return B.copy(gn.getClearColor())},this.setClearColor=function(){gn.setClearColor.apply(gn,arguments)},this.getClearAlpha=function(){return gn.getClearAlpha()},this.setClearAlpha=function(){gn.setClearAlpha.apply(gn,arguments)},this.clear=function(B=!0,gt=!0,Tt=!0){let Ft=0;if(B){let At=!1;if(z!==null){let Pe=z.texture.format;At=Pe===q0||Pe===X0||Pe===W0}if(At){let Pe=z.texture.type,Ye=Pe===to||Pe===Jr||Pe===gd||Pe===Eo||Pe===V0||Pe===G0,je=gn.getClearColor(),rn=gn.getClearAlpha(),dn=je.r,un=je.g,an=je.b;Ye?(d[0]=dn,d[1]=un,d[2]=an,d[3]=rn,K.clearBufferuiv(K.COLOR,0,d)):(y[0]=dn,y[1]=un,y[2]=an,y[3]=rn,K.clearBufferiv(K.COLOR,0,y))}else Ft|=K.COLOR_BUFFER_BIT}gt&&(Ft|=K.DEPTH_BUFFER_BIT),Tt&&(Ft|=K.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),K.clear(Ft)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.dispose=function(){e.removeEventListener("webglcontextlost",ct,!1),e.removeEventListener("webglcontextrestored",V,!1),e.removeEventListener("webglcontextcreationerror",Pt,!1),Ee.dispose(),$e.dispose(),Me.dispose(),L.dispose(),yt.dispose(),he.dispose(),dt.dispose(),Zt.dispose(),Ge.dispose(),te.dispose(),te.removeEventListener("sessionstart",ze),te.removeEventListener("sessionend",Ue),Le&&(Le.dispose(),Le=null),en.stop()};function ct(B){B.preventDefault(),console.log("THREE.WebGLRenderer: Context Lost."),C=!0}function V(){console.log("THREE.WebGLRenderer: Context Restored."),C=!1;let B=Be.autoReset,gt=me.enabled,Tt=me.autoUpdate,Ft=me.needsUpdate,At=me.type;Kt(),Be.autoReset=B,me.enabled=gt,me.autoUpdate=Tt,me.needsUpdate=Ft,me.type=At}function Pt(B){console.error("THREE.WebGLRenderer: A WebGL context could not be created. Reason: ",B.statusMessage)}function zt(B){let gt=B.target;gt.removeEventListener("dispose",zt),re(gt)}function re(B){ae(B),Me.remove(B)}function ae(B){let gt=Me.get(B).programs;gt!==void 0&&(gt.forEach(function(Tt){Ge.releaseProgram(Tt)}),B.isShaderMaterial&&Ge.releaseShaderCache(B))}this.renderBufferDirect=function(B,gt,Tt,Ft,At,Pe){gt===null&&(gt=Ve);let Ye=At.isMesh&&At.matrixWorld.determinant()<0,je=In(B,gt,Tt,Ft,At);$t.setMaterial(Ft,Ye);let rn=Tt.index,dn=1;if(Ft.wireframe===!0){if(rn=pe.getWireframeAttribute(Tt),rn===void 0)return;dn=2}let un=Tt.drawRange,an=Tt.attributes.position,Vn=un.start*dn,Si=(un.start+un.count)*dn;Pe!==null&&(Vn=Math.max(Vn,Pe.start*dn),Si=Math.min(Si,(Pe.start+Pe.count)*dn)),rn!==null?(Vn=Math.max(Vn,0),Si=Math.min(Si,rn.count)):an!=null&&(Vn=Math.max(Vn,0),Si=Math.min(Si,an.count));let ci=Si-Vn;if(ci<0||ci===1/0)return;dt.setup(At,Ft,je,Tt,rn);let cs,si=ue;if(rn!==null&&(cs=ye.get(rn),si=ve,si.setIndex(cs)),At.isMesh)Ft.wireframe===!0?($t.setLineWidth(Ft.wireframeLinewidth*We()),si.setMode(K.LINES)):si.setMode(K.TRIANGLES);else if(At.isLine){let _n=Ft.linewidth;_n===void 0&&(_n=1),$t.setLineWidth(_n*We()),At.isLineSegments?si.setMode(K.LINES):At.isLineLoop?si.setMode(K.LINE_LOOP):si.setMode(K.LINE_STRIP)}else At.isPoints?si.setMode(K.POINTS):At.isSprite&&si.setMode(K.TRIANGLES);if(At.isBatchedMesh)si.renderMultiDraw(At._multiDrawStarts,At._multiDrawCounts,At._multiDrawCount);else if(At.isInstancedMesh)si.renderInstances(Vn,ci,At.count);else if(Tt.isInstancedBufferGeometry){let _n=Tt._maxInstanceCount!==void 0?Tt._maxInstanceCount:1/0,nr=Math.min(Tt.instanceCount,_n);si.renderInstances(Vn,ci,nr)}else si.render(Vn,ci)};function Ie(B,gt,Tt){B.transparent===!0&&B.side===mn&&B.forceSinglePass===!1?(B.side=gs,B.needsUpdate=!0,li(B,gt,Tt),B.side=eo,B.needsUpdate=!0,li(B,gt,Tt),B.side=mn):li(B,gt,Tt)}this.compile=function(B,gt,Tt=null){Tt===null&&(Tt=B),p=$e.get(Tt),p.init(),T.push(p),Tt.traverseVisible(function(At){At.isLight&&At.layers.test(gt.layers)&&(p.pushLight(At),At.castShadow&&p.pushShadow(At))}),B!==Tt&&B.traverseVisible(function(At){At.isLight&&At.layers.test(gt.layers)&&(p.pushLight(At),At.castShadow&&p.pushShadow(At))}),p.setupLights(M._useLegacyLights);let Ft=new Set;return B.traverse(function(At){let Pe=At.material;if(Pe)if(Array.isArray(Pe))for(let Ye=0;Ye<Pe.length;Ye++){let je=Pe[Ye];Ie(je,Tt,At),Ft.add(je)}else Ie(Pe,Tt,At),Ft.add(Pe)}),T.pop(),p=null,Ft},this.compileAsync=function(B,gt,Tt=null){let Ft=this.compile(B,gt,Tt);return new Promise(At=>{function Pe(){if(Ft.forEach(function(Ye){Me.get(Ye).currentProgram.isReady()&&Ft.delete(Ye)}),Ft.size===0){At(B);return}setTimeout(Pe,10)}lt.get("KHR_parallel_shader_compile")!==null?Pe():setTimeout(Pe,10)})};let Jt=null;function De(B){Jt&&Jt(B)}function ze(){en.stop()}function Ue(){en.start()}let en=new Q0;en.setAnimationLoop(De),typeof self<"u"&&en.setContext(self),this.setAnimationLoop=function(B){Jt=B,te.setAnimationLoop(B),B===null?en.stop():en.start()},te.addEventListener("sessionstart",ze),te.addEventListener("sessionend",Ue),this.render=function(B,gt){if(gt!==void 0&&gt.isCamera!==!0){console.error("THREE.WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(C===!0)return;B.matrixWorldAutoUpdate===!0&&B.updateMatrixWorld(),gt.parent===null&&gt.matrixWorldAutoUpdate===!0&&gt.updateMatrixWorld(),te.enabled===!0&&te.isPresenting===!0&&(te.cameraAutoUpdate===!0&&te.updateCamera(gt),gt=te.getCamera()),B.isScene===!0&&B.onBeforeRender(M,B,gt,z),p=$e.get(B,T.length),p.init(),T.push(p),Ne.multiplyMatrices(gt.projectionMatrix,gt.matrixWorldInverse),Ct.setFromProjectionMatrix(Ne),se=this.localClippingEnabled,It=tn.init(this.clippingPlanes,se),v=Ee.get(B,x.length),v.init(),x.push(v),hn(B,gt,0,M.sortObjects),v.finish(),M.sortObjects===!0&&v.sort(Qt,Lt),this.info.render.frame++,It===!0&&tn.beginShadows();let Tt=p.state.shadowsArray;if(me.render(Tt,B,gt),It===!0&&tn.endShadows(),this.info.autoReset===!0&&this.info.reset(),gn.render(v,B),p.setupLights(M._useLegacyLights),gt.isArrayCamera){let Ft=gt.cameras;for(let At=0,Pe=Ft.length;At<Pe;At++){let Ye=Ft[At];pn(v,B,Ye,Ye.viewport)}}else pn(v,B,gt);z!==null&&(O.updateMultisampleRenderTarget(z),O.updateRenderTargetMipmap(z)),B.isScene===!0&&B.onAfterRender(M,B,gt),dt.resetDefaultState(),nt=-1,R=null,T.pop(),T.length>0?p=T[T.length-1]:p=null,x.pop(),x.length>0?v=x[x.length-1]:v=null};function hn(B,gt,Tt,Ft){if(B.visible===!1)return;if(B.layers.test(gt.layers)){if(B.isGroup)Tt=B.renderOrder;else if(B.isLOD)B.autoUpdate===!0&&B.update(gt);else if(B.isLight)p.pushLight(B),B.castShadow&&p.pushShadow(B);else if(B.isSprite){if(!B.frustumCulled||Ct.intersectsSprite(B)){Ft&&on.setFromMatrixPosition(B.matrixWorld).applyMatrix4(Ne);let Ye=he.update(B),je=B.material;je.visible&&v.push(B,Ye,je,Tt,on.z,null)}}else if((B.isMesh||B.isLine||B.isPoints)&&(!B.frustumCulled||Ct.intersectsObject(B))){let Ye=he.update(B),je=B.material;if(Ft&&(B.boundingSphere!==void 0?(B.boundingSphere===null&&B.computeBoundingSphere(),on.copy(B.boundingSphere.center)):(Ye.boundingSphere===null&&Ye.computeBoundingSphere(),on.copy(Ye.boundingSphere.center)),on.applyMatrix4(B.matrixWorld).applyMatrix4(Ne)),Array.isArray(je)){let rn=Ye.groups;for(let dn=0,un=rn.length;dn<un;dn++){let an=rn[dn],Vn=je[an.materialIndex];Vn&&Vn.visible&&v.push(B,Ye,Vn,Tt,on.z,an)}}else je.visible&&v.push(B,Ye,je,Tt,on.z,null)}}let Pe=B.children;for(let Ye=0,je=Pe.length;Ye<je;Ye++)hn(Pe[Ye],gt,Tt,Ft)}function pn(B,gt,Tt,Ft){let At=B.opaque,Pe=B.transmissive,Ye=B.transparent;p.setupLightsView(Tt),It===!0&&tn.setGlobalState(M.clippingPlanes,Tt),Pe.length>0&&Rn(At,Pe,gt,Tt),Ft&&$t.viewport(w.copy(Ft)),At.length>0&&Tn(At,gt,Tt),Pe.length>0&&Tn(Pe,gt,Tt),Ye.length>0&&Tn(Ye,gt,Tt),$t.buffers.depth.setTest(!0),$t.buffers.depth.setMask(!0),$t.buffers.color.setMask(!0),$t.setPolygonOffset(!1)}function Rn(B,gt,Tt,Ft){if((Tt.isScene===!0?Tt.overrideMaterial:null)!==null)return;let Pe=_e.isWebGL2;Le===null&&(Le=new Ir(1,1,{generateMipmaps:!0,type:lt.has("EXT_color_buffer_half_float")?yl:to,minFilter:xl,samples:Pe?4:0})),M.getDrawingBufferSize(sn),Pe?Le.setSize(sn.x,sn.y):Le.setSize(Zc(sn.x),Zc(sn.y));let Ye=M.getRenderTarget();M.setRenderTarget(Le),M.getClearColor(ce),et=M.getClearAlpha(),et<1&&M.setClearColor(16777215,.5),M.clear();let je=M.toneMapping;M.toneMapping=Qr,Tn(B,Tt,Ft),O.updateMultisampleRenderTarget(Le),O.updateRenderTargetMipmap(Le);let rn=!1;for(let dn=0,un=gt.length;dn<un;dn++){let an=gt[dn],Vn=an.object,Si=an.geometry,ci=an.material,cs=an.group;if(ci.side===mn&&Vn.layers.test(Ft.layers)){let si=ci.side;ci.side=gs,ci.needsUpdate=!0,Bn(Vn,Tt,Ft,Si,ci,cs),ci.side=si,ci.needsUpdate=!0,rn=!0}}rn===!0&&(O.updateMultisampleRenderTarget(Le),O.updateRenderTargetMipmap(Le)),M.setRenderTarget(Ye),M.setClearColor(ce,et),M.toneMapping=je}function Tn(B,gt,Tt){let Ft=gt.isScene===!0?gt.overrideMaterial:null;for(let At=0,Pe=B.length;At<Pe;At++){let Ye=B[At],je=Ye.object,rn=Ye.geometry,dn=Ft===null?Ye.material:Ft,un=Ye.group;je.layers.test(Tt.layers)&&Bn(je,gt,Tt,rn,dn,un)}}function Bn(B,gt,Tt,Ft,At,Pe){B.onBeforeRender(M,gt,Tt,Ft,At,Pe),B.modelViewMatrix.multiplyMatrices(Tt.matrixWorldInverse,B.matrixWorld),B.normalMatrix.getNormalMatrix(B.modelViewMatrix),At.onBeforeRender(M,gt,Tt,Ft,B,Pe),At.transparent===!0&&At.side===mn&&At.forceSinglePass===!1?(At.side=gs,At.needsUpdate=!0,M.renderBufferDirect(Tt,gt,Ft,At,B,Pe),At.side=eo,At.needsUpdate=!0,M.renderBufferDirect(Tt,gt,Ft,At,B,Pe),At.side=mn):M.renderBufferDirect(Tt,gt,Ft,At,B,Pe),B.onAfterRender(M,gt,Tt,Ft,At,Pe)}function li(B,gt,Tt){gt.isScene!==!0&&(gt=Ve);let Ft=Me.get(B),At=p.state.lights,Pe=p.state.shadowsArray,Ye=At.state.version,je=Ge.getParameters(B,At.state,Pe,gt,Tt),rn=Ge.getProgramCacheKey(je),dn=Ft.programs;Ft.environment=B.isMeshStandardMaterial?gt.environment:null,Ft.fog=gt.fog,Ft.envMap=(B.isMeshStandardMaterial?yt:L).get(B.envMap||Ft.environment),dn===void 0&&(B.addEventListener("dispose",zt),dn=new Map,Ft.programs=dn);let un=dn.get(rn);if(un!==void 0){if(Ft.currentProgram===un&&Ft.lightsStateVersion===Ye)return ls(B,je),un}else je.uniforms=Ge.getUniforms(B),B.onBuild(Tt,je,M),B.onBeforeCompile(je,M),un=Ge.acquireProgram(je,rn),dn.set(rn,un),Ft.uniforms=je.uniforms;let an=Ft.uniforms;return(!B.isShaderMaterial&&!B.isRawShaderMaterial||B.clipping===!0)&&(an.clippingPlanes=tn.uniform),ls(B,je),Ft.needsLights=Vs(B),Ft.lightsStateVersion=Ye,Ft.needsLights&&(an.ambientLightColor.value=At.state.ambient,an.lightProbe.value=At.state.probe,an.directionalLights.value=At.state.directional,an.directionalLightShadows.value=At.state.directionalShadow,an.spotLights.value=At.state.spot,an.spotLightShadows.value=At.state.spotShadow,an.rectAreaLights.value=At.state.rectArea,an.ltc_1.value=At.state.rectAreaLTC1,an.ltc_2.value=At.state.rectAreaLTC2,an.pointLights.value=At.state.point,an.pointLightShadows.value=At.state.pointShadow,an.hemisphereLights.value=At.state.hemi,an.directionalShadowMap.value=At.state.directionalShadowMap,an.directionalShadowMatrix.value=At.state.directionalShadowMatrix,an.spotShadowMap.value=At.state.spotShadowMap,an.spotLightMatrix.value=At.state.spotLightMatrix,an.spotLightMap.value=At.state.spotLightMap,an.pointShadowMap.value=At.state.pointShadowMap,an.pointShadowMatrix.value=At.state.pointShadowMatrix),Ft.currentProgram=un,Ft.uniformsList=null,un}function Hs(B){if(B.uniformsList===null){let gt=B.currentProgram.getUniforms();B.uniformsList=Ma.seqWithValue(gt.seq,B.uniforms)}return B.uniformsList}function ls(B,gt){let Tt=Me.get(B);Tt.outputColorSpace=gt.outputColorSpace,Tt.batching=gt.batching,Tt.instancing=gt.instancing,Tt.instancingColor=gt.instancingColor,Tt.skinning=gt.skinning,Tt.morphTargets=gt.morphTargets,Tt.morphNormals=gt.morphNormals,Tt.morphColors=gt.morphColors,Tt.morphTargetsCount=gt.morphTargetsCount,Tt.numClippingPlanes=gt.numClippingPlanes,Tt.numIntersection=gt.numClipIntersection,Tt.vertexAlphas=gt.vertexAlphas,Tt.vertexTangents=gt.vertexTangents,Tt.toneMapping=gt.toneMapping}function In(B,gt,Tt,Ft,At){gt.isScene!==!0&&(gt=Ve),O.resetTextureUnits();let Pe=gt.fog,Ye=Ft.isMeshStandardMaterial?gt.environment:null,je=z===null?M.outputColorSpace:z.isXRRenderTarget===!0?z.texture.colorSpace:Lr,rn=(Ft.isMeshStandardMaterial?yt:L).get(Ft.envMap||Ye),dn=Ft.vertexColors===!0&&!!Tt.attributes.color&&Tt.attributes.color.itemSize===4,un=!!Tt.attributes.tangent&&(!!Ft.normalMap||Ft.anisotropy>0),an=!!Tt.morphAttributes.position,Vn=!!Tt.morphAttributes.normal,Si=!!Tt.morphAttributes.color,ci=Qr;Ft.toneMapped&&(z===null||z.isXRRenderTarget===!0)&&(ci=M.toneMapping);let cs=Tt.morphAttributes.position||Tt.morphAttributes.normal||Tt.morphAttributes.color,si=cs!==void 0?cs.length:0,_n=Me.get(Ft),nr=p.state.lights;if(It===!0&&(se===!0||B!==R)){let fs=B===R&&Ft.id===nt;tn.setState(Ft,B,fs)}let qn=!1;Ft.version===_n.__version?(_n.needsLights&&_n.lightsStateVersion!==nr.state.version||_n.outputColorSpace!==je||At.isBatchedMesh&&_n.batching===!1||!At.isBatchedMesh&&_n.batching===!0||At.isInstancedMesh&&_n.instancing===!1||!At.isInstancedMesh&&_n.instancing===!0||At.isSkinnedMesh&&_n.skinning===!1||!At.isSkinnedMesh&&_n.skinning===!0||At.isInstancedMesh&&_n.instancingColor===!0&&At.instanceColor===null||At.isInstancedMesh&&_n.instancingColor===!1&&At.instanceColor!==null||_n.envMap!==rn||Ft.fog===!0&&_n.fog!==Pe||_n.numClippingPlanes!==void 0&&(_n.numClippingPlanes!==tn.numPlanes||_n.numIntersection!==tn.numIntersection)||_n.vertexAlphas!==dn||_n.vertexTangents!==un||_n.morphTargets!==an||_n.morphNormals!==Vn||_n.morphColors!==Si||_n.toneMapping!==ci||_e.isWebGL2===!0&&_n.morphTargetsCount!==si)&&(qn=!0):(qn=!0,_n.__version=Ft.version);let Ji=_n.currentProgram;qn===!0&&(Ji=li(Ft,gt,At));let ir=!1,sr=!1,Bo=!1,Ei=Ji.getUniforms(),hs=_n.uniforms;if($t.useProgram(Ji.program)&&(ir=!0,sr=!0,Bo=!0),Ft.id!==nt&&(nt=Ft.id,sr=!0),ir||R!==B){Ei.setValue(K,"projectionMatrix",B.projectionMatrix),Ei.setValue(K,"viewMatrix",B.matrixWorldInverse);let fs=Ei.map.cameraPosition;fs!==void 0&&fs.setValue(K,on.setFromMatrixPosition(B.matrixWorld)),_e.logarithmicDepthBuffer&&Ei.setValue(K,"logDepthBufFC",2/(Math.log(B.far+1)/Math.LN2)),(Ft.isMeshPhongMaterial||Ft.isMeshToonMaterial||Ft.isMeshLambertMaterial||Ft.isMeshBasicMaterial||Ft.isMeshStandardMaterial||Ft.isShaderMaterial)&&Ei.setValue(K,"isOrthographic",B.isOrthographicCamera===!0),R!==B&&(R=B,sr=!0,Bo=!0)}if(At.isSkinnedMesh){Ei.setOptional(K,At,"bindMatrix"),Ei.setOptional(K,At,"bindMatrixInverse");let fs=At.skeleton;fs&&(_e.floatVertexTextures?(fs.boneTexture===null&&fs.computeBoneTexture(),Ei.setValue(K,"boneTexture",fs.boneTexture,O)):console.warn("THREE.WebGLRenderer: SkinnedMesh can only be used with WebGL 2. With WebGL 1 OES_texture_float and vertex textures support is required."))}At.isBatchedMesh&&(Ei.setOptional(K,At,"batchingTexture"),Ei.setValue(K,"batchingTexture",At._matricesTexture,O));let us=Tt.morphAttributes;if((us.position!==void 0||us.normal!==void 0||us.color!==void 0&&_e.isWebGL2===!0)&&G.update(At,Tt,Ji),(sr||_n.receiveShadow!==At.receiveShadow)&&(_n.receiveShadow=At.receiveShadow,Ei.setValue(K,"receiveShadow",At.receiveShadow)),Ft.isMeshGouraudMaterial&&Ft.envMap!==null&&(hs.envMap.value=rn,hs.flipEnvMap.value=rn.isCubeTexture&&rn.isRenderTargetTexture===!1?-1:1),sr&&(Ei.setValue(K,"toneMappingExposure",M.toneMappingExposure),_n.needsLights&&xn(hs,Bo),Pe&&Ft.fog===!0&&qt.refreshFogUniforms(hs,Pe),qt.refreshMaterialUniforms(hs,Ft,Xt,Rt,Le),Ma.upload(K,Hs(_n),hs,O)),Ft.isShaderMaterial&&Ft.uniformsNeedUpdate===!0&&(Ma.upload(K,Hs(_n),hs,O),Ft.uniformsNeedUpdate=!1),Ft.isSpriteMaterial&&Ei.setValue(K,"center",At.center),Ei.setValue(K,"modelViewMatrix",At.modelViewMatrix),Ei.setValue(K,"normalMatrix",At.normalMatrix),Ei.setValue(K,"modelMatrix",At.matrixWorld),Ft.isShaderMaterial||Ft.isRawShaderMaterial){let fs=Ft.uniformsGroups;for(let Na=0,Or=fs.length;Na<Or;Na++)if(_e.isWebGL2){let zo=fs[Na];Zt.update(zo,Ji),Zt.bind(zo,Ji)}else console.warn("THREE.WebGLRenderer: Uniform Buffer Objects can only be used with WebGL 2.")}return Ji}function xn(B,gt){B.ambientLightColor.needsUpdate=gt,B.lightProbe.needsUpdate=gt,B.directionalLights.needsUpdate=gt,B.directionalLightShadows.needsUpdate=gt,B.pointLights.needsUpdate=gt,B.pointLightShadows.needsUpdate=gt,B.spotLights.needsUpdate=gt,B.spotLightShadows.needsUpdate=gt,B.rectAreaLights.needsUpdate=gt,B.hemisphereLights.needsUpdate=gt}function Vs(B){return B.isMeshLambertMaterial||B.isMeshToonMaterial||B.isMeshPhongMaterial||B.isMeshStandardMaterial||B.isShadowMaterial||B.isShaderMaterial&&B.lights===!0}this.getActiveCubeFace=function(){return P},this.getActiveMipmapLevel=function(){return I},this.getRenderTarget=function(){return z},this.setRenderTargetTextures=function(B,gt,Tt){Me.get(B.texture).__webglTexture=gt,Me.get(B.depthTexture).__webglTexture=Tt;let Ft=Me.get(B);Ft.__hasExternalTextures=!0,Ft.__hasExternalTextures&&(Ft.__autoAllocateDepthBuffer=Tt===void 0,Ft.__autoAllocateDepthBuffer||lt.has("WEBGL_multisampled_render_to_texture")===!0&&(console.warn("THREE.WebGLRenderer: Render-to-texture extension was disabled because an external texture was provided"),Ft.__useRenderToTexture=!1))},this.setRenderTargetFramebuffer=function(B,gt){let Tt=Me.get(B);Tt.__webglFramebuffer=gt,Tt.__useDefaultFramebuffer=gt===void 0},this.setRenderTarget=function(B,gt=0,Tt=0){z=B,P=gt,I=Tt;let Ft=!0,At=null,Pe=!1,Ye=!1;if(B){let rn=Me.get(B);rn.__useDefaultFramebuffer!==void 0?($t.bindFramebuffer(K.FRAMEBUFFER,null),Ft=!1):rn.__webglFramebuffer===void 0?O.setupRenderTarget(B):rn.__hasExternalTextures&&O.rebindTextures(B,Me.get(B.texture).__webglTexture,Me.get(B.depthTexture).__webglTexture);let dn=B.texture;(dn.isData3DTexture||dn.isDataArrayTexture||dn.isCompressedArrayTexture)&&(Ye=!0);let un=Me.get(B).__webglFramebuffer;B.isWebGLCubeRenderTarget?(Array.isArray(un[gt])?At=un[gt][Tt]:At=un[gt],Pe=!0):_e.isWebGL2&&B.samples>0&&O.useMultisampledRTT(B)===!1?At=Me.get(B).__webglMultisampledFramebuffer:Array.isArray(un)?At=un[Tt]:At=un,w.copy(B.viewport),at.copy(B.scissor),wt=B.scissorTest}else w.copy(jt).multiplyScalar(Xt).floor(),at.copy(fe).multiplyScalar(Xt).floor(),wt=we;if($t.bindFramebuffer(K.FRAMEBUFFER,At)&&_e.drawBuffers&&Ft&&$t.drawBuffers(B,At),$t.viewport(w),$t.scissor(at),$t.setScissorTest(wt),Pe){let rn=Me.get(B.texture);K.framebufferTexture2D(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,K.TEXTURE_CUBE_MAP_POSITIVE_X+gt,rn.__webglTexture,Tt)}else if(Ye){let rn=Me.get(B.texture),dn=gt||0;K.framebufferTextureLayer(K.FRAMEBUFFER,K.COLOR_ATTACHMENT0,rn.__webglTexture,Tt||0,dn)}nt=-1},this.readRenderTargetPixels=function(B,gt,Tt,Ft,At,Pe,Ye){if(!(B&&B.isWebGLRenderTarget)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let je=Me.get(B).__webglFramebuffer;if(B.isWebGLCubeRenderTarget&&Ye!==void 0&&(je=je[Ye]),je){$t.bindFramebuffer(K.FRAMEBUFFER,je);try{let rn=B.texture,dn=rn.format,un=rn.type;if(dn!==js&&tt.convert(dn)!==K.getParameter(K.IMPLEMENTATION_COLOR_READ_FORMAT)){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}let an=un===yl&&(lt.has("EXT_color_buffer_half_float")||_e.isWebGL2&&lt.has("EXT_color_buffer_float"));if(un!==to&&tt.convert(un)!==K.getParameter(K.IMPLEMENTATION_COLOR_READ_TYPE)&&!(un===jr&&(_e.isWebGL2||lt.has("OES_texture_float")||lt.has("WEBGL_color_buffer_float")))&&!an){console.error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}gt>=0&&gt<=B.width-Ft&&Tt>=0&&Tt<=B.height-At&&K.readPixels(gt,Tt,Ft,At,tt.convert(dn),tt.convert(un),Pe)}finally{let rn=z!==null?Me.get(z).__webglFramebuffer:null;$t.bindFramebuffer(K.FRAMEBUFFER,rn)}}},this.copyFramebufferToTexture=function(B,gt,Tt=0){let Ft=Math.pow(2,-Tt),At=Math.floor(gt.image.width*Ft),Pe=Math.floor(gt.image.height*Ft);O.setTexture2D(gt,0),K.copyTexSubImage2D(K.TEXTURE_2D,Tt,0,0,B.x,B.y,At,Pe),$t.unbindTexture()},this.copyTextureToTexture=function(B,gt,Tt,Ft=0){let At=gt.image.width,Pe=gt.image.height,Ye=tt.convert(Tt.format),je=tt.convert(Tt.type);O.setTexture2D(Tt,0),K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,Tt.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Tt.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,Tt.unpackAlignment),gt.isDataTexture?K.texSubImage2D(K.TEXTURE_2D,Ft,B.x,B.y,At,Pe,Ye,je,gt.image.data):gt.isCompressedTexture?K.compressedTexSubImage2D(K.TEXTURE_2D,Ft,B.x,B.y,gt.mipmaps[0].width,gt.mipmaps[0].height,Ye,gt.mipmaps[0].data):K.texSubImage2D(K.TEXTURE_2D,Ft,B.x,B.y,Ye,je,gt.image),Ft===0&&Tt.generateMipmaps&&K.generateMipmap(K.TEXTURE_2D),$t.unbindTexture()},this.copyTextureToTexture3D=function(B,gt,Tt,Ft,At=0){if(M.isWebGL1Renderer){console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: can only be used with WebGL2.");return}let Pe=B.max.x-B.min.x+1,Ye=B.max.y-B.min.y+1,je=B.max.z-B.min.z+1,rn=tt.convert(Ft.format),dn=tt.convert(Ft.type),un;if(Ft.isData3DTexture)O.setTexture3D(Ft,0),un=K.TEXTURE_3D;else if(Ft.isDataArrayTexture||Ft.isCompressedArrayTexture)O.setTexture2DArray(Ft,0),un=K.TEXTURE_2D_ARRAY;else{console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: only supports THREE.DataTexture3D and THREE.DataTexture2DArray.");return}K.pixelStorei(K.UNPACK_FLIP_Y_WEBGL,Ft.flipY),K.pixelStorei(K.UNPACK_PREMULTIPLY_ALPHA_WEBGL,Ft.premultiplyAlpha),K.pixelStorei(K.UNPACK_ALIGNMENT,Ft.unpackAlignment);let an=K.getParameter(K.UNPACK_ROW_LENGTH),Vn=K.getParameter(K.UNPACK_IMAGE_HEIGHT),Si=K.getParameter(K.UNPACK_SKIP_PIXELS),ci=K.getParameter(K.UNPACK_SKIP_ROWS),cs=K.getParameter(K.UNPACK_SKIP_IMAGES),si=Tt.isCompressedTexture?Tt.mipmaps[At]:Tt.image;K.pixelStorei(K.UNPACK_ROW_LENGTH,si.width),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,si.height),K.pixelStorei(K.UNPACK_SKIP_PIXELS,B.min.x),K.pixelStorei(K.UNPACK_SKIP_ROWS,B.min.y),K.pixelStorei(K.UNPACK_SKIP_IMAGES,B.min.z),Tt.isDataTexture||Tt.isData3DTexture?K.texSubImage3D(un,At,gt.x,gt.y,gt.z,Pe,Ye,je,rn,dn,si.data):Tt.isCompressedArrayTexture?(console.warn("THREE.WebGLRenderer.copyTextureToTexture3D: untested support for compressed srcTexture."),K.compressedTexSubImage3D(un,At,gt.x,gt.y,gt.z,Pe,Ye,je,rn,si.data)):K.texSubImage3D(un,At,gt.x,gt.y,gt.z,Pe,Ye,je,rn,dn,si),K.pixelStorei(K.UNPACK_ROW_LENGTH,an),K.pixelStorei(K.UNPACK_IMAGE_HEIGHT,Vn),K.pixelStorei(K.UNPACK_SKIP_PIXELS,Si),K.pixelStorei(K.UNPACK_SKIP_ROWS,ci),K.pixelStorei(K.UNPACK_SKIP_IMAGES,cs),At===0&&Ft.generateMipmaps&&K.generateMipmap(un),$t.unbindTexture()},this.initTexture=function(B){B.isCubeTexture?O.setTextureCube(B,0):B.isData3DTexture?O.setTexture3D(B,0):B.isDataArrayTexture||B.isCompressedArrayTexture?O.setTexture2DArray(B,0):O.setTexture2D(B,0),$t.unbindTexture()},this.resetState=function(){P=0,I=0,z=null,$t.reset(),dt.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return Pr}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;let e=this.getContext();e.drawingBufferColorSpace=t===xd?"display-p3":"srgb",e.unpackColorSpace=Wn.workingColorSpace===Oh?"display-p3":"srgb"}get outputEncoding(){return console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace===kn?To:$0}set outputEncoding(t){console.warn("THREE.WebGLRenderer: Property .outputEncoding has been removed. Use .outputColorSpace instead."),this.outputColorSpace=t===To?kn:Lr}get useLegacyLights(){return console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights}set useLegacyLights(t){console.warn("THREE.WebGLRenderer: The property .useLegacyLights has been deprecated. Migrate your lighting according to the following guide: https://discourse.threejs.org/t/updates-to-lighting-in-three-js-r155/53733."),this._useLegacyLights=t}},Xf=class extends bl{};Xf.prototype.isWebGL1Renderer=!0;var lh=class i{constructor(t,e=25e-5){this.isFogExp2=!0,this.name="",this.color=new fn(t),this.density=e}clone(){return new i(this.color,this.density)}toJSON(){return{type:"FogExp2",name:this.name,color:this.color.getHex(),density:this.density}}};var ch=class extends vi{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){let e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e}},hh=class{constructor(t,e){this.isInterleavedBuffer=!0,this.array=t,this.stride=e,this.count=t!==void 0?t.length/e:0,this.usage=Rf,this._updateRange={offset:0,count:-1},this.updateRanges=[],this.version=0,this.uuid=dr()}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}get updateRange(){return console.warn("THREE.InterleavedBuffer: updateRange() is deprecated and will be removed in r169. Use addUpdateRange() instead."),this._updateRange}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.array=new t.array.constructor(t.array),this.count=t.count,this.stride=t.stride,this.usage=t.usage,this}copyAt(t,e,n){t*=this.stride,n*=e.stride;for(let s=0,r=this.stride;s<r;s++)this.array[t+s]=e.array[n+s];return this}set(t,e=0){return this.array.set(t,e),this}clone(t){t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=dr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=this.array.slice(0).buffer);let e=new this.array.constructor(t.arrayBuffers[this.array.buffer._uuid]),n=new this.constructor(e,this.stride);return n.setUsage(this.usage),n}onUpload(t){return this.onUploadCallback=t,this}toJSON(t){return t.arrayBuffers===void 0&&(t.arrayBuffers={}),this.array.buffer._uuid===void 0&&(this.array.buffer._uuid=dr()),t.arrayBuffers[this.array.buffer._uuid]===void 0&&(t.arrayBuffers[this.array.buffer._uuid]=Array.from(new Uint32Array(this.array.buffer))),{uuid:this.uuid,buffer:this.array.buffer._uuid,type:this.array.constructor.name,stride:this.stride}}},is=new X,tr=class i{constructor(t,e,n,s=!1){this.isInterleavedBufferAttribute=!0,this.name="",this.data=t,this.itemSize=e,this.offset=n,this.normalized=s}get count(){return this.data.count}get array(){return this.data.array}set needsUpdate(t){this.data.needsUpdate=t}applyMatrix4(t){for(let e=0,n=this.data.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyMatrix4(t),this.setXYZ(e,is.x,is.y,is.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.applyNormalMatrix(t),this.setXYZ(e,is.x,is.y,is.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)is.fromBufferAttribute(this,e),is.transformDirection(t),this.setXYZ(e,is.x,is.y,is.z);return this}setX(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset]=e,this}setY(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+1]=e,this}setZ(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+2]=e,this}setW(t,e){return this.normalized&&(e=Gn(e,this.array)),this.data.array[t*this.data.stride+this.offset+3]=e,this}getX(t){let e=this.data.array[t*this.data.stride+this.offset];return this.normalized&&(e=fr(e,this.array)),e}getY(t){let e=this.data.array[t*this.data.stride+this.offset+1];return this.normalized&&(e=fr(e,this.array)),e}getZ(t){let e=this.data.array[t*this.data.stride+this.offset+2];return this.normalized&&(e=fr(e,this.array)),e}getW(t){let e=this.data.array[t*this.data.stride+this.offset+3];return this.normalized&&(e=fr(e,this.array)),e}setXY(t,e,n){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this}setXYZ(t,e,n,s){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this}setXYZW(t,e,n,s,r){return t=t*this.data.stride+this.offset,this.normalized&&(e=Gn(e,this.array),n=Gn(n,this.array),s=Gn(s,this.array),r=Gn(r,this.array)),this.data.array[t+0]=e,this.data.array[t+1]=n,this.data.array[t+2]=s,this.data.array[t+3]=r,this}clone(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.clone(): Cloning an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return new Zn(new this.array.constructor(e),this.itemSize,this.normalized)}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.clone(t)),new i(t.interleavedBuffers[this.data.uuid],this.itemSize,this.offset,this.normalized)}toJSON(t){if(t===void 0){console.log("THREE.InterleavedBufferAttribute.toJSON(): Serializing an interleaved buffer attribute will de-interleave buffer data.");let e=[];for(let n=0;n<this.count;n++){let s=n*this.data.stride+this.offset;for(let r=0;r<this.itemSize;r++)e.push(this.data.array[s+r])}return{itemSize:this.itemSize,type:this.array.constructor.name,array:e,normalized:this.normalized}}else return t.interleavedBuffers===void 0&&(t.interleavedBuffers={}),t.interleavedBuffers[this.data.uuid]===void 0&&(t.interleavedBuffers[this.data.uuid]=this.data.toJSON(t)),{isInterleavedBufferAttribute:!0,itemSize:this.itemSize,data:this.data.uuid,offset:this.offset,normalized:this.normalized}}};var uh=class extends As{constructor(t=null,e=1,n=1,s,r,a,o,l,h=Pi,u=Pi,f,m){super(null,a,o,l,h,u,s,r,f,m),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}};var Sl=class extends Zn{constructor(t,e,n,s=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=s}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){let t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}},pa=new Nn,S0=new Nn,Nc=[],E0=new es,xS=new Nn,cl=new Je,hl=new ys,Dr=class extends Je{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new Sl(new Float32Array(n*16),16),this.instanceColor=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let s=0;s<n;s++)this.setMatrixAt(s,xS)}computeBoundingBox(){let t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new es),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,pa),E0.copy(t.boundingBox).applyMatrix4(pa),this.boundingBox.union(E0)}computeBoundingSphere(){let t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new ys),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,pa),hl.copy(t.boundingSphere).applyMatrix4(pa),this.boundingSphere.union(hl)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){e.fromArray(this.instanceMatrix.array,t*16)}raycast(t,e){let n=this.matrixWorld,s=this.count;if(cl.geometry=this.geometry,cl.material=this.material,cl.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),hl.copy(this.boundingSphere),hl.applyMatrix4(n),t.ray.intersectsSphere(hl)!==!1))for(let r=0;r<s;r++){this.getMatrixAt(r,pa),S0.multiplyMatrices(n,pa),cl.matrixWorld=S0,cl.raycast(t,Nc);for(let a=0,o=Nc.length;a<o;a++){let l=Nc[a];l.instanceId=r,l.object=this,e.push(l)}Nc.length=0}}setColorAt(t,e){this.instanceColor===null&&(this.instanceColor=new Sl(new Float32Array(this.instanceMatrix.count*3),3)),e.toArray(this.instanceColor.array,t*3)}setMatrixAt(t,e){e.toArray(this.instanceMatrix.array,t*16)}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"})}};var Ta=class extends mr{constructor(t){super(),this.isLineBasicMaterial=!0,this.type="LineBasicMaterial",this.color=new fn(16777215),this.map=null,this.linewidth=1,this.linecap="round",this.linejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.linewidth=t.linewidth,this.linecap=t.linecap,this.linejoin=t.linejoin,this.fog=t.fog,this}},w0=new X,T0=new X,A0=new Nn,yf=new Ao,Oc=new ys,qf=class extends vi{constructor(t=new Ln,e=new Ta){super(),this.isLine=!0,this.type="Line",this.geometry=t,this.material=e,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[0];for(let s=1,r=e.count;s<r;s++)w0.fromBufferAttribute(e,s-1),T0.fromBufferAttribute(e,s),n[s]=n[s-1],n[s]+=w0.distanceTo(T0);t.setAttribute("lineDistance",new Qe(n,1))}else console.warn("THREE.Line.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}raycast(t,e){let n=this.geometry,s=this.matrixWorld,r=t.params.Line.threshold,a=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),Oc.copy(n.boundingSphere),Oc.applyMatrix4(s),Oc.radius+=r,t.ray.intersectsSphere(Oc)===!1)return;A0.copy(s).invert(),yf.copy(t.ray).applyMatrix4(A0);let o=r/((this.scale.x+this.scale.y+this.scale.z)/3),l=o*o,h=new X,u=new X,f=new X,m=new X,d=this.isLineSegments?2:1,y=n.index,p=n.attributes.position;if(y!==null){let x=Math.max(0,a.start),T=Math.min(y.count,a.start+a.count);for(let M=x,C=T-1;M<C;M+=d){let P=y.getX(M),I=y.getX(M+1);if(h.fromBufferAttribute(p,P),u.fromBufferAttribute(p,I),yf.distanceSqToSegment(h,u,m,f)>l)continue;m.applyMatrix4(this.matrixWorld);let nt=t.ray.origin.distanceTo(m);nt<t.near||nt>t.far||e.push({distance:nt,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}else{let x=Math.max(0,a.start),T=Math.min(p.count,a.start+a.count);for(let M=x,C=T-1;M<C;M+=d){if(h.fromBufferAttribute(p,M),u.fromBufferAttribute(p,M+1),yf.distanceSqToSegment(h,u,m,f)>l)continue;m.applyMatrix4(this.matrixWorld);let I=t.ray.origin.distanceTo(m);I<t.near||I>t.far||e.push({distance:I,point:f.clone().applyMatrix4(this.matrixWorld),index:M,face:null,faceIndex:null,object:this})}}}updateMorphTargets(){let e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){let s=e[n[0]];if(s!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let r=0,a=s.length;r<a;r++){let o=s[r].name||String(r);this.morphTargetInfluences.push(0),this.morphTargetDictionary[o]=r}}}}},R0=new X,C0=new X,El=class extends qf{constructor(t,e){super(t,e),this.isLineSegments=!0,this.type="LineSegments"}computeLineDistances(){let t=this.geometry;if(t.index===null){let e=t.attributes.position,n=[];for(let s=0,r=e.count;s<r;s+=2)R0.fromBufferAttribute(e,s),C0.fromBufferAttribute(e,s+1),n[s]=s===0?0:n[s-1],n[s+1]=n[s]+R0.distanceTo(C0);t.setAttribute("lineDistance",new Qe(n,1))}else console.warn("THREE.LineSegments.computeLineDistances(): Computation only possible with non-indexed BufferGeometry.");return this}};var as=class extends As{constructor(t,e,n,s,r,a,o,l,h){super(t,e,n,s,r,a,o,l,h),this.isCanvasTexture=!0,this.needsUpdate=!0}},zs=class{constructor(){this.type="Curve",this.arcLengthDivisions=200}getPoint(){return console.warn("THREE.Curve: .getPoint() not implemented."),null}getPointAt(t,e){let n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){let e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){let t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;let e=[],n,s=this.getPoint(0),r=0;e.push(0);for(let a=1;a<=t;a++)n=this.getPoint(a/t),r+=n.distanceTo(s),e.push(r),s=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e){let n=this.getLengths(),s=0,r=n.length,a;e?a=e:a=t*n[r-1];let o=0,l=r-1,h;for(;o<=l;)if(s=Math.floor(o+(l-o)/2),h=n[s]-a,h<0)o=s+1;else if(h>0)l=s-1;else{l=s;break}if(s=l,n[s]===a)return s/(r-1);let u=n[s],m=n[s+1]-u,d=(a-u)/m;return(s+d)/(r-1)}getTangent(t,e){let s=t-1e-4,r=t+1e-4;s<0&&(s=0),r>1&&(r=1);let a=this.getPoint(s),o=this.getPoint(r),l=e||(a.isVector2?new de:new X);return l.copy(o).sub(a).normalize(),l}getTangentAt(t,e){let n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e){let n=new X,s=[],r=[],a=[],o=new X,l=new Nn;for(let d=0;d<=t;d++){let y=d/t;s[d]=this.getTangentAt(y,new X)}r[0]=new X,a[0]=new X;let h=Number.MAX_VALUE,u=Math.abs(s[0].x),f=Math.abs(s[0].y),m=Math.abs(s[0].z);u<=h&&(h=u,n.set(1,0,0)),f<=h&&(h=f,n.set(0,1,0)),m<=h&&n.set(0,0,1),o.crossVectors(s[0],n).normalize(),r[0].crossVectors(s[0],o),a[0].crossVectors(s[0],r[0]);for(let d=1;d<=t;d++){if(r[d]=r[d-1].clone(),a[d]=a[d-1].clone(),o.crossVectors(s[d-1],s[d]),o.length()>Number.EPSILON){o.normalize();let y=Math.acos(Li(s[d-1].dot(s[d]),-1,1));r[d].applyMatrix4(l.makeRotationAxis(o,y))}a[d].crossVectors(s[d],r[d])}if(e===!0){let d=Math.acos(Li(r[0].dot(r[t]),-1,1));d/=t,s[0].dot(o.crossVectors(r[0],r[t]))>0&&(d=-d);for(let y=1;y<=t;y++)r[y].applyMatrix4(l.makeRotationAxis(s[y],d*y)),a[y].crossVectors(s[y],r[y])}return{tangents:s,normals:r,binormals:a}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){let t={metadata:{version:4.6,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}},wl=class extends zs{constructor(t=0,e=0,n=1,s=1,r=0,a=Math.PI*2,o=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=s,this.aStartAngle=r,this.aEndAngle=a,this.aClockwise=o,this.aRotation=l}getPoint(t,e){let n=e||new de,s=Math.PI*2,r=this.aEndAngle-this.aStartAngle,a=Math.abs(r)<Number.EPSILON;for(;r<0;)r+=s;for(;r>s;)r-=s;r<Number.EPSILON&&(a?r=0:r=s),this.aClockwise===!0&&!a&&(r===s?r=-s:r=r-s);let o=this.aStartAngle+t*r,l=this.aX+this.xRadius*Math.cos(o),h=this.aY+this.yRadius*Math.sin(o);if(this.aRotation!==0){let u=Math.cos(this.aRotation),f=Math.sin(this.aRotation),m=l-this.aX,d=h-this.aY;l=m*u-d*f+this.aX,h=m*f+d*u+this.aY}return n.set(l,h)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){let t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}},Yf=class extends wl{constructor(t,e,n,s,r,a){super(t,e,n,n,s,r,a),this.isArcCurve=!0,this.type="ArcCurve"}};function vd(){let i=0,t=0,e=0,n=0;function s(r,a,o,l){i=r,t=o,e=-3*r+3*a-2*o-l,n=2*r-2*a+o+l}return{initCatmullRom:function(r,a,o,l,h){s(a,o,h*(o-r),h*(l-a))},initNonuniformCatmullRom:function(r,a,o,l,h,u,f){let m=(a-r)/h-(o-r)/(h+u)+(o-a)/u,d=(o-a)/u-(l-a)/(u+f)+(l-o)/f;m*=u,d*=u,s(a,o,m,d)},calc:function(r){let a=r*r,o=a*r;return i+t*r+e*a+n*o}}}var Fc=new X,_f=new vd,vf=new vd,Mf=new vd,Ro=class extends zs{constructor(t=[],e=!1,n="centripetal",s=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=s}getPoint(t,e=new X){let n=e,s=this.points,r=s.length,a=(r-(this.closed?0:1))*t,o=Math.floor(a),l=a-o;this.closed?o+=o>0?0:(Math.floor(Math.abs(o)/r)+1)*r:l===0&&o===r-1&&(o=r-2,l=1);let h,u;this.closed||o>0?h=s[(o-1)%r]:(Fc.subVectors(s[0],s[1]).add(s[0]),h=Fc);let f=s[o%r],m=s[(o+1)%r];if(this.closed||o+2<r?u=s[(o+2)%r]:(Fc.subVectors(s[r-1],s[r-2]).add(s[r-1]),u=Fc),this.curveType==="centripetal"||this.curveType==="chordal"){let d=this.curveType==="chordal"?.5:.25,y=Math.pow(h.distanceToSquared(f),d),v=Math.pow(f.distanceToSquared(m),d),p=Math.pow(m.distanceToSquared(u),d);v<1e-4&&(v=1),y<1e-4&&(y=v),p<1e-4&&(p=v),_f.initNonuniformCatmullRom(h.x,f.x,m.x,u.x,y,v,p),vf.initNonuniformCatmullRom(h.y,f.y,m.y,u.y,y,v,p),Mf.initNonuniformCatmullRom(h.z,f.z,m.z,u.z,y,v,p)}else this.curveType==="catmullrom"&&(_f.initCatmullRom(h.x,f.x,m.x,u.x,this.tension),vf.initCatmullRom(h.y,f.y,m.y,u.y,this.tension),Mf.initCatmullRom(h.z,f.z,m.z,u.z,this.tension));return n.set(_f.calc(l),vf.calc(l),Mf.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new X().fromArray(s))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}};function P0(i,t,e,n,s){let r=(n-t)*.5,a=(s-e)*.5,o=i*i,l=i*o;return(2*e-2*n+r+a)*l+(-3*e+3*n-2*r-a)*o+r*i+e}function yS(i,t){let e=1-i;return e*e*t}function _S(i,t){return 2*(1-i)*i*t}function vS(i,t){return i*i*t}function ml(i,t,e,n){return yS(i,t)+_S(i,e)+vS(i,n)}function MS(i,t){let e=1-i;return e*e*e*t}function bS(i,t){let e=1-i;return 3*e*e*i*t}function SS(i,t){return 3*(1-i)*i*i*t}function ES(i,t){return i*i*i*t}function gl(i,t,e,n,s){return MS(i,t)+bS(i,e)+SS(i,n)+ES(i,s)}var fh=class extends zs{constructor(t=new de,e=new de,n=new de,s=new de){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new de){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(gl(t,s.x,r.x,a.x,o.x),gl(t,s.y,r.y,a.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},$f=class extends zs{constructor(t=new X,e=new X,n=new X,s=new X){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=s}getPoint(t,e=new X){let n=e,s=this.v0,r=this.v1,a=this.v2,o=this.v3;return n.set(gl(t,s.x,r.x,a.x,o.x),gl(t,s.y,r.y,a.y,o.y),gl(t,s.z,r.z,a.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}},dh=class extends zs{constructor(t=new de,e=new de){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new de){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new de){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},Zf=class extends zs{constructor(t=new X,e=new X){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new X){let n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new X){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},ph=class extends zs{constructor(t=new de,e=new de,n=new de){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new de){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ml(t,s.x,r.x,a.x),ml(t,s.y,r.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},mh=class extends zs{constructor(t=new X,e=new X,n=new X){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new X){let n=e,s=this.v0,r=this.v1,a=this.v2;return n.set(ml(t,s.x,r.x,a.x),ml(t,s.y,r.y,a.y),ml(t,s.z,r.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){let t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}},gh=class extends zs{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new de){let n=e,s=this.points,r=(s.length-1)*t,a=Math.floor(r),o=r-a,l=s[a===0?a:a-1],h=s[a],u=s[a>s.length-2?s.length-1:a+1],f=s[a>s.length-3?s.length-1:a+2];return n.set(P0(o,l.x,h.x,u.x,f.x),P0(o,l.y,h.y,u.y,f.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){let s=this.points[e];t.points.push(s.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){let s=t.points[e];this.points.push(new de().fromArray(s))}return this}},xh=Object.freeze({__proto__:null,ArcCurve:Yf,CatmullRomCurve3:Ro,CubicBezierCurve:fh,CubicBezierCurve3:$f,EllipseCurve:wl,LineCurve:dh,LineCurve3:Zf,QuadraticBezierCurve:ph,QuadraticBezierCurve3:mh,SplineCurve:gh}),Jf=class extends zs{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){let t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){let n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new xh[n](e,t))}return this}getPoint(t,e){let n=t*this.getLength(),s=this.getCurveLengths(),r=0;for(;r<s.length;){if(s[r]>=n){let a=s[r]-n,o=this.curves[r],l=o.getLength(),h=l===0?0:1-a/l;return o.getPointAt(h,e)}r++}return null}getLength(){let t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;let t=[],e=0;for(let n=0,s=this.curves.length;n<s;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){let e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){let e=[],n;for(let s=0,r=this.curves;s<r.length;s++){let a=r[s],o=a.isEllipseCurve?t*2:a.isLineCurve||a.isLineCurve3?1:a.isSplineCurve?t*a.points.length:t,l=a.getPoints(o);for(let h=0;h<l.length;h++){let u=l[h];n&&n.equals(u)||(e.push(u),n=u)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(s.clone())}return this.autoClose=t.autoClose,this}toJSON(){let t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){let s=this.curves[e];t.curves.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){let s=t.curves[e];this.curves.push(new xh[s.type]().fromJSON(s))}return this}},yh=class extends Jf{constructor(t){super(),this.type="Path",this.currentPoint=new de,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){let n=new dh(this.currentPoint.clone(),new de(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,s){let r=new ph(this.currentPoint.clone(),new de(t,e),new de(n,s));return this.curves.push(r),this.currentPoint.set(n,s),this}bezierCurveTo(t,e,n,s,r,a){let o=new fh(this.currentPoint.clone(),new de(t,e),new de(n,s),new de(r,a));return this.curves.push(o),this.currentPoint.set(r,a),this}splineThru(t){let e=[this.currentPoint.clone()].concat(t),n=new gh(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,s,r,a){let o=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+o,e+l,n,s,r,a),this}absarc(t,e,n,s,r,a){return this.absellipse(t,e,n,n,s,r,a),this}ellipse(t,e,n,s,r,a,o,l){let h=this.currentPoint.x,u=this.currentPoint.y;return this.absellipse(t+h,e+u,n,s,r,a,o,l),this}absellipse(t,e,n,s,r,a,o,l){let h=new wl(t,e,n,s,r,a,o,l);if(this.curves.length>0){let f=h.getPoint(0);f.equals(this.currentPoint)||this.lineTo(f.x,f.y)}this.curves.push(h);let u=h.getPoint(1);return this.currentPoint.copy(u),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){let t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}};var _h=class i extends Ln{constructor(t=1,e=32,n=0,s=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:s},e=Math.max(3,e);let r=[],a=[],o=[],l=[],h=new X,u=new de;a.push(0,0,0),o.push(0,0,1),l.push(.5,.5);for(let f=0,m=3;f<=e;f++,m+=3){let d=n+f/e*s;h.x=t*Math.cos(d),h.y=t*Math.sin(d),a.push(h.x,h.y,h.z),o.push(0,0,1),u.x=(a[m]/t+1)/2,u.y=(a[m+1]/t+1)/2,l.push(u.x,u.y)}for(let f=1;f<=e;f++)r.push(f,f+1,0);this.setIndex(r),this.setAttribute("position",new Qe(a,3)),this.setAttribute("normal",new Qe(o,3)),this.setAttribute("uv",new Qe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.segments,t.thetaStart,t.thetaLength)}},Wi=class i extends Ln{constructor(t=1,e=1,n=1,s=32,r=1,a=!1,o=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:s,heightSegments:r,openEnded:a,thetaStart:o,thetaLength:l};let h=this;s=Math.floor(s),r=Math.floor(r);let u=[],f=[],m=[],d=[],y=0,v=[],p=n/2,x=0;T(),a===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(u),this.setAttribute("position",new Qe(f,3)),this.setAttribute("normal",new Qe(m,3)),this.setAttribute("uv",new Qe(d,2));function T(){let C=new X,P=new X,I=0,z=(e-t)/n;for(let nt=0;nt<=r;nt++){let R=[],w=nt/r,at=w*(e-t)+t;for(let wt=0;wt<=s;wt++){let ce=wt/s,et=ce*l+o,ft=Math.sin(et),Rt=Math.cos(et);P.x=at*ft,P.y=-w*n+p,P.z=at*Rt,f.push(P.x,P.y,P.z),C.set(ft,z,Rt).normalize(),m.push(C.x,C.y,C.z),d.push(ce,1-w),R.push(y++)}v.push(R)}for(let nt=0;nt<s;nt++)for(let R=0;R<r;R++){let w=v[R][nt],at=v[R+1][nt],wt=v[R+1][nt+1],ce=v[R][nt+1];u.push(w,at,ce),u.push(at,wt,ce),I+=6}h.addGroup(x,I,0),x+=I}function M(C){let P=y,I=new de,z=new X,nt=0,R=C===!0?t:e,w=C===!0?1:-1;for(let wt=1;wt<=s;wt++)f.push(0,p*w,0),m.push(0,w,0),d.push(.5,.5),y++;let at=y;for(let wt=0;wt<=s;wt++){let et=wt/s*l+o,ft=Math.cos(et),Rt=Math.sin(et);z.x=R*Rt,z.y=p*w,z.z=R*ft,f.push(z.x,z.y,z.z),m.push(0,w,0),I.x=ft*.5+.5,I.y=Rt*.5*w+.5,d.push(I.x,I.y),y++}for(let wt=0;wt<s;wt++){let ce=P+wt,et=at+wt;C===!0?u.push(et,et+1,ce):u.push(et+1,et,ce),nt+=3}h.addGroup(x,nt,C===!0?1:2),x+=nt}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},io=class i extends Wi{constructor(t=1,e=1,n=32,s=1,r=!1,a=0,o=Math.PI*2){super(0,t,e,n,s,r,a,o),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:s,openEnded:r,thetaStart:a,thetaLength:o}}static fromJSON(t){return new i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}},jf=class i extends Ln{constructor(t=[],e=[],n=1,s=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:s};let r=[],a=[];o(s),h(n),u(),this.setAttribute("position",new Qe(r,3)),this.setAttribute("normal",new Qe(r.slice(),3)),this.setAttribute("uv",new Qe(a,2)),s===0?this.computeVertexNormals():this.normalizeNormals();function o(T){let M=new X,C=new X,P=new X;for(let I=0;I<e.length;I+=3)d(e[I+0],M),d(e[I+1],C),d(e[I+2],P),l(M,C,P,T)}function l(T,M,C,P){let I=P+1,z=[];for(let nt=0;nt<=I;nt++){z[nt]=[];let R=T.clone().lerp(C,nt/I),w=M.clone().lerp(C,nt/I),at=I-nt;for(let wt=0;wt<=at;wt++)wt===0&&nt===I?z[nt][wt]=R:z[nt][wt]=R.clone().lerp(w,wt/at)}for(let nt=0;nt<I;nt++)for(let R=0;R<2*(I-nt)-1;R++){let w=Math.floor(R/2);R%2===0?(m(z[nt][w+1]),m(z[nt+1][w]),m(z[nt][w])):(m(z[nt][w+1]),m(z[nt+1][w+1]),m(z[nt+1][w]))}}function h(T){let M=new X;for(let C=0;C<r.length;C+=3)M.x=r[C+0],M.y=r[C+1],M.z=r[C+2],M.normalize().multiplyScalar(T),r[C+0]=M.x,r[C+1]=M.y,r[C+2]=M.z}function u(){let T=new X;for(let M=0;M<r.length;M+=3){T.x=r[M+0],T.y=r[M+1],T.z=r[M+2];let C=p(T)/2/Math.PI+.5,P=x(T)/Math.PI+.5;a.push(C,1-P)}y(),f()}function f(){for(let T=0;T<a.length;T+=6){let M=a[T+0],C=a[T+2],P=a[T+4],I=Math.max(M,C,P),z=Math.min(M,C,P);I>.9&&z<.1&&(M<.2&&(a[T+0]+=1),C<.2&&(a[T+2]+=1),P<.2&&(a[T+4]+=1))}}function m(T){r.push(T.x,T.y,T.z)}function d(T,M){let C=T*3;M.x=t[C+0],M.y=t[C+1],M.z=t[C+2]}function y(){let T=new X,M=new X,C=new X,P=new X,I=new de,z=new de,nt=new de;for(let R=0,w=0;R<r.length;R+=9,w+=6){T.set(r[R+0],r[R+1],r[R+2]),M.set(r[R+3],r[R+4],r[R+5]),C.set(r[R+6],r[R+7],r[R+8]),I.set(a[w+0],a[w+1]),z.set(a[w+2],a[w+3]),nt.set(a[w+4],a[w+5]),P.copy(T).add(M).add(C).divideScalar(3);let at=p(P);v(I,w+0,T,at),v(z,w+2,M,at),v(nt,w+4,C,at)}}function v(T,M,C,P){P<0&&T.x===1&&(a[M]=T.x-1),C.x===0&&C.z===0&&(a[M]=P/2/Math.PI+.5)}function p(T){return Math.atan2(T.z,-T.x)}function x(T){return Math.atan2(-T.y,Math.sqrt(T.x*T.x+T.z*T.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.vertices,t.indices,t.radius,t.details)}};var Ur=class extends yh{constructor(t){super(t),this.uuid=dr(),this.type="Shape",this.holes=[]}getPointsHoles(t){let e=[];for(let n=0,s=this.holes.length;n<s;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(s.clone())}return this}toJSON(){let t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){let s=this.holes[e];t.holes.push(s.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){let s=t.holes[e];this.holes.push(new yh().fromJSON(s))}return this}},wS={triangulate:function(i,t,e=2){let n=t&&t.length,s=n?t[0]*e:i.length,r=rg(i,0,s,e,!0),a=[];if(!r||r.next===r.prev)return a;let o,l,h,u,f,m,d;if(n&&(r=PS(i,t,r,e)),i.length>80*e){o=h=i[0],l=u=i[1];for(let y=e;y<s;y+=e)f=i[y],m=i[y+1],f<o&&(o=f),m<l&&(l=m),f>h&&(h=f),m>u&&(u=m);d=Math.max(h-o,u-l),d=d!==0?32767/d:0}return Tl(r,a,e,o,l,d,0),a}};function rg(i,t,e,n,s){let r,a;if(s===HS(i,t,e,n)>0)for(r=t;r<e;r+=n)a=L0(r,i[r],i[r+1],a);else for(r=e-n;r>=t;r-=n)a=L0(r,i[r],i[r+1],a);return a&&kh(a,a.next)&&(Rl(a),a=a.next),a}function Co(i,t){if(!i)return i;t||(t=i);let e=i,n;do if(n=!1,!e.steiner&&(kh(e,e.next)||_i(e.prev,e,e.next)===0)){if(Rl(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function Tl(i,t,e,n,s,r,a){if(!i)return;!a&&r&&NS(i,n,s,r);let o=i,l,h;for(;i.prev!==i.next;){if(l=i.prev,h=i.next,r?AS(i,n,s,r):TS(i)){t.push(l.i/e|0),t.push(i.i/e|0),t.push(h.i/e|0),Rl(i),i=h.next,o=h.next;continue}if(i=h,i===o){a?a===1?(i=RS(Co(i),t,e),Tl(i,t,e,n,s,r,2)):a===2&&CS(i,t,e,n,s,r):Tl(Co(i),t,e,n,s,r,1);break}}}function TS(i){let t=i.prev,e=i,n=i.next;if(_i(t,e,n)>=0)return!1;let s=t.x,r=e.x,a=n.x,o=t.y,l=e.y,h=n.y,u=s<r?s<a?s:a:r<a?r:a,f=o<l?o<h?o:h:l<h?l:h,m=s>r?s>a?s:a:r>a?r:a,d=o>l?o>h?o:h:l>h?l:h,y=n.next;for(;y!==t;){if(y.x>=u&&y.x<=m&&y.y>=f&&y.y<=d&&ya(s,o,r,l,a,h,y.x,y.y)&&_i(y.prev,y,y.next)>=0)return!1;y=y.next}return!0}function AS(i,t,e,n){let s=i.prev,r=i,a=i.next;if(_i(s,r,a)>=0)return!1;let o=s.x,l=r.x,h=a.x,u=s.y,f=r.y,m=a.y,d=o<l?o<h?o:h:l<h?l:h,y=u<f?u<m?u:m:f<m?f:m,v=o>l?o>h?o:h:l>h?l:h,p=u>f?u>m?u:m:f>m?f:m,x=Kf(d,y,t,e,n),T=Kf(v,p,t,e,n),M=i.prevZ,C=i.nextZ;for(;M&&M.z>=x&&C&&C.z<=T;){if(M.x>=d&&M.x<=v&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&ya(o,u,l,f,h,m,M.x,M.y)&&_i(M.prev,M,M.next)>=0||(M=M.prevZ,C.x>=d&&C.x<=v&&C.y>=y&&C.y<=p&&C!==s&&C!==a&&ya(o,u,l,f,h,m,C.x,C.y)&&_i(C.prev,C,C.next)>=0))return!1;C=C.nextZ}for(;M&&M.z>=x;){if(M.x>=d&&M.x<=v&&M.y>=y&&M.y<=p&&M!==s&&M!==a&&ya(o,u,l,f,h,m,M.x,M.y)&&_i(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;C&&C.z<=T;){if(C.x>=d&&C.x<=v&&C.y>=y&&C.y<=p&&C!==s&&C!==a&&ya(o,u,l,f,h,m,C.x,C.y)&&_i(C.prev,C,C.next)>=0)return!1;C=C.nextZ}return!0}function RS(i,t,e){let n=i;do{let s=n.prev,r=n.next.next;!kh(s,r)&&og(s,n,n.next,r)&&Al(s,r)&&Al(r,s)&&(t.push(s.i/e|0),t.push(n.i/e|0),t.push(r.i/e|0),Rl(n),Rl(n.next),n=i=r),n=n.next}while(n!==i);return Co(n)}function CS(i,t,e,n,s,r){let a=i;do{let o=a.next.next;for(;o!==a.prev;){if(a.i!==o.i&&BS(a,o)){let l=ag(a,o);a=Co(a,a.next),l=Co(l,l.next),Tl(a,t,e,n,s,r,0),Tl(l,t,e,n,s,r,0);return}o=o.next}a=a.next}while(a!==i)}function PS(i,t,e,n){let s=[],r,a,o,l,h;for(r=0,a=t.length;r<a;r++)o=t[r]*n,l=r<a-1?t[r+1]*n:i.length,h=rg(i,o,l,n,!1),h===h.next&&(h.steiner=!0),s.push(FS(h));for(s.sort(LS),r=0;r<s.length;r++)e=IS(s[r],e);return e}function LS(i,t){return i.x-t.x}function IS(i,t){let e=DS(i,t);if(!e)return t;let n=ag(e,i);return Co(n,n.next),Co(e,e.next)}function DS(i,t){let e=t,n=-1/0,s,r=i.x,a=i.y;do{if(a<=e.y&&a>=e.next.y&&e.next.y!==e.y){let m=e.x+(a-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(m<=r&&m>n&&(n=m,s=e.x<e.next.x?e:e.next,m===r))return s}e=e.next}while(e!==t);if(!s)return null;let o=s,l=s.x,h=s.y,u=1/0,f;e=s;do r>=e.x&&e.x>=l&&r!==e.x&&ya(a<h?r:n,a,l,h,a<h?n:r,a,e.x,e.y)&&(f=Math.abs(a-e.y)/(r-e.x),Al(e,i)&&(f<u||f===u&&(e.x>s.x||e.x===s.x&&US(s,e)))&&(s=e,u=f)),e=e.next;while(e!==o);return s}function US(i,t){return _i(i.prev,i,t.prev)<0&&_i(t.next,i,i.next)<0}function NS(i,t,e,n){let s=i;do s.z===0&&(s.z=Kf(s.x,s.y,t,e,n)),s.prevZ=s.prev,s.nextZ=s.next,s=s.next;while(s!==i);s.prevZ.nextZ=null,s.prevZ=null,OS(s)}function OS(i){let t,e,n,s,r,a,o,l,h=1;do{for(e=i,i=null,r=null,a=0;e;){for(a++,n=e,o=0,t=0;t<h&&(o++,n=n.nextZ,!!n);t++);for(l=h;o>0||l>0&&n;)o!==0&&(l===0||!n||e.z<=n.z)?(s=e,e=e.nextZ,o--):(s=n,n=n.nextZ,l--),r?r.nextZ=s:i=s,s.prevZ=r,r=s;e=n}r.nextZ=null,h*=2}while(a>1);return i}function Kf(i,t,e,n,s){return i=(i-e)*s|0,t=(t-n)*s|0,i=(i|i<<8)&16711935,i=(i|i<<4)&252645135,i=(i|i<<2)&858993459,i=(i|i<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,i|t<<1}function FS(i){let t=i,e=i;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==i);return e}function ya(i,t,e,n,s,r,a,o){return(s-a)*(t-o)>=(i-a)*(r-o)&&(i-a)*(n-o)>=(e-a)*(t-o)&&(e-a)*(r-o)>=(s-a)*(n-o)}function BS(i,t){return i.next.i!==t.i&&i.prev.i!==t.i&&!zS(i,t)&&(Al(i,t)&&Al(t,i)&&kS(i,t)&&(_i(i.prev,i,t.prev)||_i(i,t.prev,t))||kh(i,t)&&_i(i.prev,i,i.next)>0&&_i(t.prev,t,t.next)>0)}function _i(i,t,e){return(t.y-i.y)*(e.x-t.x)-(t.x-i.x)*(e.y-t.y)}function kh(i,t){return i.x===t.x&&i.y===t.y}function og(i,t,e,n){let s=zc(_i(i,t,e)),r=zc(_i(i,t,n)),a=zc(_i(e,n,i)),o=zc(_i(e,n,t));return!!(s!==r&&a!==o||s===0&&Bc(i,e,t)||r===0&&Bc(i,n,t)||a===0&&Bc(e,i,n)||o===0&&Bc(e,t,n))}function Bc(i,t,e){return t.x<=Math.max(i.x,e.x)&&t.x>=Math.min(i.x,e.x)&&t.y<=Math.max(i.y,e.y)&&t.y>=Math.min(i.y,e.y)}function zc(i){return i>0?1:i<0?-1:0}function zS(i,t){let e=i;do{if(e.i!==i.i&&e.next.i!==i.i&&e.i!==t.i&&e.next.i!==t.i&&og(e,e.next,i,t))return!0;e=e.next}while(e!==i);return!1}function Al(i,t){return _i(i.prev,i,i.next)<0?_i(i,t,i.next)>=0&&_i(i,i.prev,t)>=0:_i(i,t,i.prev)<0||_i(i,i.next,t)<0}function kS(i,t){let e=i,n=!1,s=(i.x+t.x)/2,r=(i.y+t.y)/2;do e.y>r!=e.next.y>r&&e.next.y!==e.y&&s<(e.next.x-e.x)*(r-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==i);return n}function ag(i,t){let e=new Qf(i.i,i.x,i.y),n=new Qf(t.i,t.x,t.y),s=i.next,r=t.prev;return i.next=t,t.prev=i,e.next=s,s.prev=e,n.next=e,e.prev=n,r.next=n,n.prev=r,n}function L0(i,t,e,n){let s=new Qf(i,t,e);return n?(s.next=n.next,s.prev=n,n.next.prev=s,n.next=s):(s.prev=s,s.next=s),s}function Rl(i){i.next.prev=i.prev,i.prev.next=i.next,i.prevZ&&(i.prevZ.nextZ=i.nextZ),i.nextZ&&(i.nextZ.prevZ=i.prevZ)}function Qf(i,t,e){this.i=i,this.x=t,this.y=e,this.prev=null,this.next=null,this.z=0,this.prevZ=null,this.nextZ=null,this.steiner=!1}function HS(i,t,e,n){let s=0;for(let r=t,a=e-n;r<e;r+=n)s+=(i[a]-i[r])*(i[r+1]+i[a+1]),a=r;return s}var Ks=class i{static area(t){let e=t.length,n=0;for(let s=e-1,r=0;r<e;s=r++)n+=t[s].x*t[r].y-t[r].x*t[s].y;return n*.5}static isClockWise(t){return i.area(t)<0}static triangulateShape(t,e){let n=[],s=[],r=[];I0(t),D0(n,t);let a=t.length;e.forEach(I0);for(let l=0;l<e.length;l++)s.push(a),a+=e[l].length,D0(n,e[l]);let o=wS.triangulate(n,s);for(let l=0;l<o.length;l+=3)r.push(o.slice(l,l+3));return r}};function I0(i){let t=i.length;t>2&&i[t-1].equals(i[0])&&i.pop()}function D0(i,t){for(let e=0;e<t.length;e++)i.push(t[e].x),i.push(t[e].y)}var Cl=class i extends Ln{constructor(t=new Ur([new de(.5,.5),new de(-.5,.5),new de(-.5,-.5),new de(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];let n=this,s=[],r=[];for(let o=0,l=t.length;o<l;o++){let h=t[o];a(h)}this.setAttribute("position",new Qe(s,3)),this.setAttribute("uv",new Qe(r,2)),this.computeVertexNormals();function a(o){let l=[],h=e.curveSegments!==void 0?e.curveSegments:12,u=e.steps!==void 0?e.steps:1,f=e.depth!==void 0?e.depth:1,m=e.bevelEnabled!==void 0?e.bevelEnabled:!0,d=e.bevelThickness!==void 0?e.bevelThickness:.2,y=e.bevelSize!==void 0?e.bevelSize:d-.1,v=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3,x=e.extrudePath,T=e.UVGenerator!==void 0?e.UVGenerator:VS,M,C=!1,P,I,z,nt;x&&(M=x.getSpacedPoints(u),C=!0,m=!1,P=x.computeFrenetFrames(u,!1),I=new X,z=new X,nt=new X),m||(p=0,d=0,y=0,v=0);let R=o.extractPoints(h),w=R.shape,at=R.holes;if(!Ks.isClockWise(w)){w=w.reverse();for(let K=0,be=at.length;K<be;K++){let lt=at[K];Ks.isClockWise(lt)&&(at[K]=lt.reverse())}}let ce=Ks.triangulateShape(w,at),et=w;for(let K=0,be=at.length;K<be;K++){let lt=at[K];w=w.concat(lt)}function ft(K,be,lt){return be||console.error("THREE.ExtrudeGeometry: vec does not exist"),K.clone().addScaledVector(be,lt)}let Rt=w.length,Xt=ce.length;function Qt(K,be,lt){let _e,$t,Be,Me=K.x-be.x,O=K.y-be.y,L=lt.x-K.x,yt=lt.y-K.y,ye=Me*Me+O*O,pe=Me*yt-O*L;if(Math.abs(pe)>Number.EPSILON){let he=Math.sqrt(ye),Ge=Math.sqrt(L*L+yt*yt),qt=be.x-O/he,Ee=be.y+Me/he,$e=lt.x-yt/Ge,tn=lt.y+L/Ge,me=(($e-qt)*yt-(tn-Ee)*L)/(Me*yt-O*L);_e=qt+Me*me-K.x,$t=Ee+O*me-K.y;let gn=_e*_e+$t*$t;if(gn<=2)return new de(_e,$t);Be=Math.sqrt(gn/2)}else{let he=!1;Me>Number.EPSILON?L>Number.EPSILON&&(he=!0):Me<-Number.EPSILON?L<-Number.EPSILON&&(he=!0):Math.sign(O)===Math.sign(yt)&&(he=!0),he?(_e=-O,$t=Me,Be=Math.sqrt(ye)):(_e=Me,$t=O,Be=Math.sqrt(ye/2))}return new de(_e/Be,$t/Be)}let Lt=[];for(let K=0,be=et.length,lt=be-1,_e=K+1;K<be;K++,lt++,_e++)lt===be&&(lt=0),_e===be&&(_e=0),Lt[K]=Qt(et[K],et[lt],et[_e]);let jt=[],fe,we=Lt.concat();for(let K=0,be=at.length;K<be;K++){let lt=at[K];fe=[];for(let _e=0,$t=lt.length,Be=$t-1,Me=_e+1;_e<$t;_e++,Be++,Me++)Be===$t&&(Be=0),Me===$t&&(Me=0),fe[_e]=Qt(lt[_e],lt[Be],lt[Me]);jt.push(fe),we=we.concat(fe)}for(let K=0;K<p;K++){let be=K/p,lt=d*Math.cos(be*Math.PI/2),_e=y*Math.sin(be*Math.PI/2)+v;for(let $t=0,Be=et.length;$t<Be;$t++){let Me=ft(et[$t],Lt[$t],_e);Ne(Me.x,Me.y,-lt)}for(let $t=0,Be=at.length;$t<Be;$t++){let Me=at[$t];fe=jt[$t];for(let O=0,L=Me.length;O<L;O++){let yt=ft(Me[O],fe[O],_e);Ne(yt.x,yt.y,-lt)}}}let Ct=y+v;for(let K=0;K<Rt;K++){let be=m?ft(w[K],we[K],Ct):w[K];C?(z.copy(P.normals[0]).multiplyScalar(be.x),I.copy(P.binormals[0]).multiplyScalar(be.y),nt.copy(M[0]).add(z).add(I),Ne(nt.x,nt.y,nt.z)):Ne(be.x,be.y,0)}for(let K=1;K<=u;K++)for(let be=0;be<Rt;be++){let lt=m?ft(w[be],we[be],Ct):w[be];C?(z.copy(P.normals[K]).multiplyScalar(lt.x),I.copy(P.binormals[K]).multiplyScalar(lt.y),nt.copy(M[K]).add(z).add(I),Ne(nt.x,nt.y,nt.z)):Ne(lt.x,lt.y,f/u*K)}for(let K=p-1;K>=0;K--){let be=K/p,lt=d*Math.cos(be*Math.PI/2),_e=y*Math.sin(be*Math.PI/2)+v;for(let $t=0,Be=et.length;$t<Be;$t++){let Me=ft(et[$t],Lt[$t],_e);Ne(Me.x,Me.y,f+lt)}for(let $t=0,Be=at.length;$t<Be;$t++){let Me=at[$t];fe=jt[$t];for(let O=0,L=Me.length;O<L;O++){let yt=ft(Me[O],fe[O],_e);C?Ne(yt.x,yt.y+M[u-1].y,M[u-1].x+lt):Ne(yt.x,yt.y,f+lt)}}}It(),se();function It(){let K=s.length/3;if(m){let be=0,lt=Rt*be;for(let _e=0;_e<Xt;_e++){let $t=ce[_e];sn($t[2]+lt,$t[1]+lt,$t[0]+lt)}be=u+p*2,lt=Rt*be;for(let _e=0;_e<Xt;_e++){let $t=ce[_e];sn($t[0]+lt,$t[1]+lt,$t[2]+lt)}}else{for(let be=0;be<Xt;be++){let lt=ce[be];sn(lt[2],lt[1],lt[0])}for(let be=0;be<Xt;be++){let lt=ce[be];sn(lt[0]+Rt*u,lt[1]+Rt*u,lt[2]+Rt*u)}}n.addGroup(K,s.length/3-K,0)}function se(){let K=s.length/3,be=0;Le(et,be),be+=et.length;for(let lt=0,_e=at.length;lt<_e;lt++){let $t=at[lt];Le($t,be),be+=$t.length}n.addGroup(K,s.length/3-K,1)}function Le(K,be){let lt=K.length;for(;--lt>=0;){let _e=lt,$t=lt-1;$t<0&&($t=K.length-1);for(let Be=0,Me=u+p*2;Be<Me;Be++){let O=Rt*Be,L=Rt*(Be+1),yt=be+_e+O,ye=be+$t+O,pe=be+$t+L,he=be+_e+L;on(yt,ye,pe,he)}}}function Ne(K,be,lt){l.push(K),l.push(be),l.push(lt)}function sn(K,be,lt){Ve(K),Ve(be),Ve(lt);let _e=s.length/3,$t=T.generateTopUV(n,s,_e-3,_e-2,_e-1);We($t[0]),We($t[1]),We($t[2])}function on(K,be,lt,_e){Ve(K),Ve(be),Ve(_e),Ve(be),Ve(lt),Ve(_e);let $t=s.length/3,Be=T.generateSideWallUV(n,s,$t-6,$t-3,$t-2,$t-1);We(Be[0]),We(Be[1]),We(Be[3]),We(Be[1]),We(Be[2]),We(Be[3])}function Ve(K){s.push(l[K*3+0]),s.push(l[K*3+1]),s.push(l[K*3+2])}function We(K){r.push(K.x),r.push(K.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return GS(e,n,t)}static fromJSON(t,e){let n=[];for(let r=0,a=t.shapes.length;r<a;r++){let o=e[t.shapes[r]];n.push(o)}let s=t.options.extrudePath;return s!==void 0&&(t.options.extrudePath=new xh[s.type]().fromJSON(s)),new i(n,t.options)}},VS={generateTopUV:function(i,t,e,n,s){let r=t[e*3],a=t[e*3+1],o=t[n*3],l=t[n*3+1],h=t[s*3],u=t[s*3+1];return[new de(r,a),new de(o,l),new de(h,u)]},generateSideWallUV:function(i,t,e,n,s,r){let a=t[e*3],o=t[e*3+1],l=t[e*3+2],h=t[n*3],u=t[n*3+1],f=t[n*3+2],m=t[s*3],d=t[s*3+1],y=t[s*3+2],v=t[r*3],p=t[r*3+1],x=t[r*3+2];return Math.abs(o-u)<Math.abs(a-h)?[new de(a,1-l),new de(h,1-f),new de(m,1-y),new de(v,1-x)]:[new de(o,1-l),new de(u,1-f),new de(d,1-y),new de(p,1-x)]}};function GS(i,t,e){if(e.shapes=[],Array.isArray(i))for(let n=0,s=i.length;n<s;n++){let r=i[n];e.shapes.push(r.uuid)}else e.shapes.push(i.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}var vh=class i extends jf{constructor(t=1,e=0){let n=(1+Math.sqrt(5))/2,s=[-1,n,0,1,n,0,-1,-n,0,1,-n,0,0,-1,n,0,1,n,0,-1,-n,0,1,-n,n,0,-1,n,0,1,-n,0,-1,-n,0,1],r=[0,11,5,0,5,1,0,1,7,0,7,10,0,10,11,1,5,9,5,11,4,11,10,2,10,7,6,7,1,8,3,9,4,3,4,2,3,2,6,3,6,8,3,8,9,4,9,5,2,4,11,6,2,10,8,6,7,9,8,1];super(s,r,t,e),this.type="IcosahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new i(t.radius,t.detail)}};var Mh=class i extends Ln{constructor(t=.5,e=1,n=32,s=1,r=0,a=Math.PI*2){super(),this.type="RingGeometry",this.parameters={innerRadius:t,outerRadius:e,thetaSegments:n,phiSegments:s,thetaStart:r,thetaLength:a},n=Math.max(3,n),s=Math.max(1,s);let o=[],l=[],h=[],u=[],f=t,m=(e-t)/s,d=new X,y=new de;for(let v=0;v<=s;v++){for(let p=0;p<=n;p++){let x=r+p/n*a;d.x=f*Math.cos(x),d.y=f*Math.sin(x),l.push(d.x,d.y,d.z),h.push(0,0,1),y.x=(d.x/e+1)/2,y.y=(d.y/e+1)/2,u.push(y.x,y.y)}f+=m}for(let v=0;v<s;v++){let p=v*(n+1);for(let x=0;x<n;x++){let T=x+p,M=T,C=T+n+1,P=T+n+2,I=T+1;o.push(M,C,I),o.push(C,P,I)}}this.setIndex(o),this.setAttribute("position",new Qe(l,3)),this.setAttribute("normal",new Qe(h,3)),this.setAttribute("uv",new Qe(u,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.innerRadius,t.outerRadius,t.thetaSegments,t.phiSegments,t.thetaStart,t.thetaLength)}},Pl=class i extends Ln{constructor(t=new Ur([new de(0,.5),new de(-.5,-.5),new de(.5,-.5)]),e=12){super(),this.type="ShapeGeometry",this.parameters={shapes:t,curveSegments:e};let n=[],s=[],r=[],a=[],o=0,l=0;if(Array.isArray(t)===!1)h(t);else for(let u=0;u<t.length;u++)h(t[u]),this.addGroup(o,l,u),o+=l,l=0;this.setIndex(n),this.setAttribute("position",new Qe(s,3)),this.setAttribute("normal",new Qe(r,3)),this.setAttribute("uv",new Qe(a,2));function h(u){let f=s.length/3,m=u.extractPoints(e),d=m.shape,y=m.holes;Ks.isClockWise(d)===!1&&(d=d.reverse());for(let p=0,x=y.length;p<x;p++){let T=y[p];Ks.isClockWise(T)===!0&&(y[p]=T.reverse())}let v=Ks.triangulateShape(d,y);for(let p=0,x=y.length;p<x;p++){let T=y[p];d=d.concat(T)}for(let p=0,x=d.length;p<x;p++){let T=d[p];s.push(T.x,T.y,0),r.push(0,0,1),a.push(T.x,T.y)}for(let p=0,x=v.length;p<x;p++){let T=v[p],M=T[0]+f,C=T[1]+f,P=T[2]+f;n.push(M,C,P),l+=3}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON(),e=this.parameters.shapes;return WS(e,t)}static fromJSON(t,e){let n=[];for(let s=0,r=t.shapes.length;s<r;s++){let a=e[t.shapes[s]];n.push(a)}return new i(n,t.curveSegments)}};function WS(i,t){if(t.shapes=[],Array.isArray(i))for(let e=0,n=i.length;e<n;e++){let s=i[e];t.shapes.push(s.uuid)}else t.shapes.push(i.uuid);return t}var Xi=class i extends Ln{constructor(t=1,e=32,n=16,s=0,r=Math.PI*2,a=0,o=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:s,phiLength:r,thetaStart:a,thetaLength:o},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));let l=Math.min(a+o,Math.PI),h=0,u=[],f=new X,m=new X,d=[],y=[],v=[],p=[];for(let x=0;x<=n;x++){let T=[],M=x/n,C=0;x===0&&a===0?C=.5/e:x===n&&l===Math.PI&&(C=-.5/e);for(let P=0;P<=e;P++){let I=P/e;f.x=-t*Math.cos(s+I*r)*Math.sin(a+M*o),f.y=t*Math.cos(a+M*o),f.z=t*Math.sin(s+I*r)*Math.sin(a+M*o),y.push(f.x,f.y,f.z),m.copy(f).normalize(),v.push(m.x,m.y,m.z),p.push(I+C,1-M),T.push(h++)}u.push(T)}for(let x=0;x<n;x++)for(let T=0;T<e;T++){let M=u[x][T+1],C=u[x][T],P=u[x+1][T],I=u[x+1][T+1];(x!==0||a>0)&&d.push(M,C,I),(x!==n-1||l<Math.PI)&&d.push(C,P,I)}this.setIndex(d),this.setAttribute("position",new Qe(y,3)),this.setAttribute("normal",new Qe(v,3)),this.setAttribute("uv",new Qe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}};var bh=class i extends Ln{constructor(t=1,e=.4,n=12,s=48,r=Math.PI*2){super(),this.type="TorusGeometry",this.parameters={radius:t,tube:e,radialSegments:n,tubularSegments:s,arc:r},n=Math.floor(n),s=Math.floor(s);let a=[],o=[],l=[],h=[],u=new X,f=new X,m=new X;for(let d=0;d<=n;d++)for(let y=0;y<=s;y++){let v=y/s*r,p=d/n*Math.PI*2;f.x=(t+e*Math.cos(p))*Math.cos(v),f.y=(t+e*Math.cos(p))*Math.sin(v),f.z=e*Math.sin(p),o.push(f.x,f.y,f.z),u.x=t*Math.cos(v),u.y=t*Math.sin(v),m.subVectors(f,u).normalize(),l.push(m.x,m.y,m.z),h.push(y/s),h.push(d/n)}for(let d=1;d<=n;d++)for(let y=1;y<=s;y++){let v=(s+1)*d+y-1,p=(s+1)*(d-1)+y-1,x=(s+1)*(d-1)+y,T=(s+1)*d+y;a.push(v,p,T),a.push(p,x,T)}this.setIndex(a),this.setAttribute("position",new Qe(o,3)),this.setAttribute("normal",new Qe(l,3)),this.setAttribute("uv",new Qe(h,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new i(t.radius,t.tube,t.radialSegments,t.tubularSegments,t.arc)}};var Sh=class i extends Ln{constructor(t=new mh(new X(-1,-1,0),new X(-1,1,0),new X(1,1,0)),e=64,n=1,s=8,r=!1){super(),this.type="TubeGeometry",this.parameters={path:t,tubularSegments:e,radius:n,radialSegments:s,closed:r};let a=t.computeFrenetFrames(e,r);this.tangents=a.tangents,this.normals=a.normals,this.binormals=a.binormals;let o=new X,l=new X,h=new de,u=new X,f=[],m=[],d=[],y=[];v(),this.setIndex(y),this.setAttribute("position",new Qe(f,3)),this.setAttribute("normal",new Qe(m,3)),this.setAttribute("uv",new Qe(d,2));function v(){for(let M=0;M<e;M++)p(M);p(r===!1?e:0),T(),x()}function p(M){u=t.getPointAt(M/e,u);let C=a.normals[M],P=a.binormals[M];for(let I=0;I<=s;I++){let z=I/s*Math.PI*2,nt=Math.sin(z),R=-Math.cos(z);l.x=R*C.x+nt*P.x,l.y=R*C.y+nt*P.y,l.z=R*C.z+nt*P.z,l.normalize(),m.push(l.x,l.y,l.z),o.x=u.x+n*l.x,o.y=u.y+n*l.y,o.z=u.z+n*l.z,f.push(o.x,o.y,o.z)}}function x(){for(let M=1;M<=e;M++)for(let C=1;C<=s;C++){let P=(s+1)*(M-1)+(C-1),I=(s+1)*M+(C-1),z=(s+1)*M+C,nt=(s+1)*(M-1)+C;y.push(P,I,nt),y.push(I,z,nt)}}function T(){for(let M=0;M<=e;M++)for(let C=0;C<=s;C++)h.x=M/e,h.y=C/s,d.push(h.x,h.y)}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){let t=super.toJSON();return t.path=this.parameters.path.toJSON(),t}static fromJSON(t){return new i(new xh[t.path.type]().fromJSON(t.path),t.tubularSegments,t.radius,t.radialSegments,t.closed)}},Eh=class extends Ln{constructor(t=null){if(super(),this.type="WireframeGeometry",this.parameters={geometry:t},t!==null){let e=[],n=new Set,s=new X,r=new X;if(t.index!==null){let a=t.attributes.position,o=t.index,l=t.groups;l.length===0&&(l=[{start:0,count:o.count,materialIndex:0}]);for(let h=0,u=l.length;h<u;++h){let f=l[h],m=f.start,d=f.count;for(let y=m,v=m+d;y<v;y+=3)for(let p=0;p<3;p++){let x=o.getX(y+p),T=o.getX(y+(p+1)%3);s.fromBufferAttribute(a,x),r.fromBufferAttribute(a,T),U0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}}else{let a=t.attributes.position;for(let o=0,l=a.count/3;o<l;o++)for(let h=0;h<3;h++){let u=3*o+h,f=3*o+(h+1)%3;s.fromBufferAttribute(a,u),r.fromBufferAttribute(a,f),U0(s,r,n)===!0&&(e.push(s.x,s.y,s.z),e.push(r.x,r.y,r.z))}}this.setAttribute("position",new Qe(e,3))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}};function U0(i,t,e){let n=`${i.x},${i.y},${i.z}-${t.x},${t.y},${t.z}`,s=`${t.x},${t.y},${t.z}-${i.x},${i.y},${i.z}`;return e.has(n)===!0||e.has(s)===!0?!1:(e.add(n),e.add(s),!0)}var wh=class extends mr{constructor(t){super(),this.isMeshStandardMaterial=!0,this.defines={STANDARD:""},this.type="MeshStandardMaterial",this.color=new fn(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nh,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};var Th=class extends mr{constructor(t){super(),this.isMeshToonMaterial=!0,this.defines={TOON:""},this.type="MeshToonMaterial",this.color=new fn(16777215),this.map=null,this.gradientMap=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nh,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.alphaMap=null,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.gradientMap=t.gradientMap,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.alphaMap=t.alphaMap,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}};var Ah=class extends mr{constructor(t){super(),this.isMeshLambertMaterial=!0,this.type="MeshLambertMaterial",this.color=new fn(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new fn(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Nh,this.normalScale=new de(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.combine=pd,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}};function kc(i,t,e){return!i||!e&&i.constructor===t?i:typeof t.BYTES_PER_ELEMENT=="number"?new t(i):Array.prototype.slice.call(i)}function XS(i){return ArrayBuffer.isView(i)&&!(i instanceof DataView)}var Aa=class{constructor(t,e,n,s){this.parameterPositions=t,this._cachedIndex=0,this.resultBuffer=s!==void 0?s:new e.constructor(n),this.sampleValues=e,this.valueSize=n,this.settings=null,this.DefaultSettings_={}}evaluate(t){let e=this.parameterPositions,n=this._cachedIndex,s=e[n],r=e[n-1];n:{t:{let a;e:{i:if(!(t<s)){for(let o=n+2;;){if(s===void 0){if(t<r)break i;return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}if(n===o)break;if(r=s,s=e[++n],t<s)break t}a=e.length;break e}if(!(t>=r)){let o=e[1];t<o&&(n=2,r=o);for(let l=n-2;;){if(r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(n===l)break;if(s=r,r=e[--n-1],t>=r)break t}a=n,n=0;break e}break n}for(;n<a;){let o=n+a>>>1;t<e[o]?a=o:n=o+1}if(s=e[n],r=e[n-1],r===void 0)return this._cachedIndex=0,this.copySampleValue_(0);if(s===void 0)return n=e.length,this._cachedIndex=n,this.copySampleValue_(n-1)}this._cachedIndex=n,this.intervalChanged_(n,r,s)}return this.interpolate_(n,r,t,s)}getSettings_(){return this.settings||this.DefaultSettings_}copySampleValue_(t){let e=this.resultBuffer,n=this.sampleValues,s=this.valueSize,r=t*s;for(let a=0;a!==s;++a)e[a]=n[r+a];return e}interpolate_(){throw new Error("call to abstract method")}intervalChanged_(){}},td=class extends Aa{constructor(t,e,n,s){super(t,e,n,s),this._weightPrev=-0,this._offsetPrev=-0,this._weightNext=-0,this._offsetNext=-0,this.DefaultSettings_={endingStart:Um,endingEnd:Um}}intervalChanged_(t,e,n){let s=this.parameterPositions,r=t-2,a=t+1,o=s[r],l=s[a];if(o===void 0)switch(this.getSettings_().endingStart){case Nm:r=t,o=2*e-n;break;case Om:r=s.length-2,o=e+s[r]-s[r+1];break;default:r=t,o=n}if(l===void 0)switch(this.getSettings_().endingEnd){case Nm:a=t,l=2*n-e;break;case Om:a=1,l=n+s[1]-s[0];break;default:a=t-1,l=e}let h=(n-e)*.5,u=this.valueSize;this._weightPrev=h/(e-o),this._weightNext=h/(l-n),this._offsetPrev=r*u,this._offsetNext=a*u}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,h=l-o,u=this._offsetPrev,f=this._offsetNext,m=this._weightPrev,d=this._weightNext,y=(n-e)/(s-e),v=y*y,p=v*y,x=-m*p+2*m*v-m*y,T=(1+m)*p+(-1.5-2*m)*v+(-.5+m)*y+1,M=(-1-d)*p+(1.5+d)*v+.5*y,C=d*p-d*v;for(let P=0;P!==o;++P)r[P]=x*a[u+P]+T*a[h+P]+M*a[l+P]+C*a[f+P];return r}},ed=class extends Aa{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=t*o,h=l-o,u=(n-e)/(s-e),f=1-u;for(let m=0;m!==o;++m)r[m]=a[h+m]*f+a[l+m]*u;return r}},nd=class extends Aa{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t){return this.copySampleValue_(t-1)}},er=class{constructor(t,e,n,s){if(t===void 0)throw new Error("THREE.KeyframeTrack: track name is undefined");if(e===void 0||e.length===0)throw new Error("THREE.KeyframeTrack: no keyframes in track named "+t);this.name=t,this.times=kc(e,this.TimeBufferType),this.values=kc(n,this.ValueBufferType),this.setInterpolation(s||this.DefaultInterpolation)}static toJSON(t){let e=t.constructor,n;if(e.toJSON!==this.toJSON)n=e.toJSON(t);else{n={name:t.name,times:kc(t.times,Array),values:kc(t.values,Array)};let s=t.getInterpolation();s!==t.DefaultInterpolation&&(n.interpolation=s)}return n.type=t.ValueTypeName,n}InterpolantFactoryMethodDiscrete(t){return new nd(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodLinear(t){return new ed(this.times,this.values,this.getValueSize(),t)}InterpolantFactoryMethodSmooth(t){return new td(this.times,this.values,this.getValueSize(),t)}setInterpolation(t){let e;switch(t){case Gc:e=this.InterpolantFactoryMethodDiscrete;break;case Wc:e=this.InterpolantFactoryMethodLinear;break;case $u:e=this.InterpolantFactoryMethodSmooth;break}if(e===void 0){let n="unsupported interpolation for "+this.ValueTypeName+" keyframe track named "+this.name;if(this.createInterpolant===void 0)if(t!==this.DefaultInterpolation)this.setInterpolation(this.DefaultInterpolation);else throw new Error(n);return console.warn("THREE.KeyframeTrack:",n),this}return this.createInterpolant=e,this}getInterpolation(){switch(this.createInterpolant){case this.InterpolantFactoryMethodDiscrete:return Gc;case this.InterpolantFactoryMethodLinear:return Wc;case this.InterpolantFactoryMethodSmooth:return $u}}getValueSize(){return this.values.length/this.times.length}shift(t){if(t!==0){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]+=t}return this}scale(t){if(t!==1){let e=this.times;for(let n=0,s=e.length;n!==s;++n)e[n]*=t}return this}trim(t,e){let n=this.times,s=n.length,r=0,a=s-1;for(;r!==s&&n[r]<t;)++r;for(;a!==-1&&n[a]>e;)--a;if(++a,r!==0||a!==s){r>=a&&(a=Math.max(a,1),r=a-1);let o=this.getValueSize();this.times=n.slice(r,a),this.values=this.values.slice(r*o,a*o)}return this}validate(){let t=!0,e=this.getValueSize();e-Math.floor(e)!==0&&(console.error("THREE.KeyframeTrack: Invalid value size in track.",this),t=!1);let n=this.times,s=this.values,r=n.length;r===0&&(console.error("THREE.KeyframeTrack: Track is empty.",this),t=!1);let a=null;for(let o=0;o!==r;o++){let l=n[o];if(typeof l=="number"&&isNaN(l)){console.error("THREE.KeyframeTrack: Time is not a valid number.",this,o,l),t=!1;break}if(a!==null&&a>l){console.error("THREE.KeyframeTrack: Out of order keys.",this,o,l,a),t=!1;break}a=l}if(s!==void 0&&XS(s))for(let o=0,l=s.length;o!==l;++o){let h=s[o];if(isNaN(h)){console.error("THREE.KeyframeTrack: Value is not a valid number.",this,o,h),t=!1;break}}return t}optimize(){let t=this.times.slice(),e=this.values.slice(),n=this.getValueSize(),s=this.getInterpolation()===$u,r=t.length-1,a=1;for(let o=1;o<r;++o){let l=!1,h=t[o],u=t[o+1];if(h!==u&&(o!==1||h!==t[0]))if(s)l=!0;else{let f=o*n,m=f-n,d=f+n;for(let y=0;y!==n;++y){let v=e[f+y];if(v!==e[m+y]||v!==e[d+y]){l=!0;break}}}if(l){if(o!==a){t[a]=t[o];let f=o*n,m=a*n;for(let d=0;d!==n;++d)e[m+d]=e[f+d]}++a}}if(r>0){t[a]=t[r];for(let o=r*n,l=a*n,h=0;h!==n;++h)e[l+h]=e[o+h];++a}return a!==t.length?(this.times=t.slice(0,a),this.values=e.slice(0,a*n)):(this.times=t,this.values=e),this}clone(){let t=this.times.slice(),e=this.values.slice(),n=this.constructor,s=new n(this.name,t,e);return s.createInterpolant=this.createInterpolant,s}};er.prototype.TimeBufferType=Float32Array;er.prototype.ValueBufferType=Float32Array;er.prototype.DefaultInterpolation=Wc;var Po=class extends er{};Po.prototype.ValueTypeName="bool";Po.prototype.ValueBufferType=Array;Po.prototype.DefaultInterpolation=Gc;Po.prototype.InterpolantFactoryMethodLinear=void 0;Po.prototype.InterpolantFactoryMethodSmooth=void 0;var id=class extends er{};id.prototype.ValueTypeName="color";var sd=class extends er{};sd.prototype.ValueTypeName="number";var rd=class extends Aa{constructor(t,e,n,s){super(t,e,n,s)}interpolate_(t,e,n,s){let r=this.resultBuffer,a=this.sampleValues,o=this.valueSize,l=(n-e)/(s-e),h=t*o;for(let u=h+o;h!==u;h+=4)xs.slerpFlat(r,0,a,h-o,a,h,l);return r}},Ll=class extends er{InterpolantFactoryMethodLinear(t){return new rd(this.times,this.values,this.getValueSize(),t)}};Ll.prototype.ValueTypeName="quaternion";Ll.prototype.DefaultInterpolation=Wc;Ll.prototype.InterpolantFactoryMethodSmooth=void 0;var Lo=class extends er{};Lo.prototype.ValueTypeName="string";Lo.prototype.ValueBufferType=Array;Lo.prototype.DefaultInterpolation=Gc;Lo.prototype.InterpolantFactoryMethodLinear=void 0;Lo.prototype.InterpolantFactoryMethodSmooth=void 0;var od=class extends er{};od.prototype.ValueTypeName="vector";var ad=class{constructor(t,e,n){let s=this,r=!1,a=0,o=0,l,h=[];this.onStart=void 0,this.onLoad=t,this.onProgress=e,this.onError=n,this.itemStart=function(u){o++,r===!1&&s.onStart!==void 0&&s.onStart(u,a,o),r=!0},this.itemEnd=function(u){a++,s.onProgress!==void 0&&s.onProgress(u,a,o),a===o&&(r=!1,s.onLoad!==void 0&&s.onLoad())},this.itemError=function(u){s.onError!==void 0&&s.onError(u)},this.resolveURL=function(u){return l?l(u):u},this.setURLModifier=function(u){return l=u,this},this.addHandler=function(u,f){return h.push(u,f),this},this.removeHandler=function(u){let f=h.indexOf(u);return f!==-1&&h.splice(f,2),this},this.getHandler=function(u){for(let f=0,m=h.length;f<m;f+=2){let d=h[f],y=h[f+1];if(d.global&&(d.lastIndex=0),d.test(u))return y}return null}}},qS=new ad,ld=class{constructor(t){this.manager=t!==void 0?t:qS,this.crossOrigin="anonymous",this.withCredentials=!1,this.path="",this.resourcePath="",this.requestHeader={}}load(){}loadAsync(t,e){let n=this;return new Promise(function(s,r){n.load(t,s,e,r)})}parse(){}setCrossOrigin(t){return this.crossOrigin=t,this}setWithCredentials(t){return this.withCredentials=t,this}setPath(t){return this.path=t,this}setResourcePath(t){return this.resourcePath=t,this}setRequestHeader(t){return this.requestHeader=t,this}};ld.DEFAULT_MATERIAL_NAME="__DEFAULT";var Rh=class extends vi{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new fn(t),this.intensity=e}dispose(){}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){let e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,this.groundColor!==void 0&&(e.object.groundColor=this.groundColor.getHex()),this.distance!==void 0&&(e.object.distance=this.distance),this.angle!==void 0&&(e.object.angle=this.angle),this.decay!==void 0&&(e.object.decay=this.decay),this.penumbra!==void 0&&(e.object.penumbra=this.penumbra),this.shadow!==void 0&&(e.object.shadow=this.shadow.toJSON()),e}},Ch=class extends Rh{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(vi.DEFAULT_UP),this.updateMatrix(),this.groundColor=new fn(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}},bf=new Nn,N0=new X,O0=new X,cd=class{constructor(t){this.camera=t,this.bias=0,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new de(512,512),this.map=null,this.mapPass=null,this.matrix=new Nn,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new Ml,this._frameExtents=new de(1,1),this._viewportCount=1,this._viewports=[new Fn(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){let e=this.camera,n=this.matrix;N0.setFromMatrixPosition(t.matrixWorld),e.position.copy(N0),O0.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(O0),e.updateMatrixWorld(),bf.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(bf),n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(bf)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.bias=t.bias,this.radius=t.radius,this.mapSize.copy(t.mapSize),this}clone(){return new this.constructor().copy(this)}toJSON(){let t={};return this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}};var hd=class extends cd{constructor(){super(new rh(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}},Ph=class extends Rh{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(vi.DEFAULT_UP),this.updateMatrix(),this.target=new vi,this.shadow=new hd}dispose(){this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}};var Lh=class extends Ln{constructor(){super(),this.isInstancedBufferGeometry=!0,this.type="InstancedBufferGeometry",this.instanceCount=1/0}copy(t){return super.copy(t),this.instanceCount=t.instanceCount,this}toJSON(){let t=super.toJSON();return t.instanceCount=this.instanceCount,t.isInstancedBufferGeometry=!0,t}};var Md="\\[\\]\\.:\\/",YS=new RegExp("["+Md+"]","g"),bd="[^"+Md+"]",$S="[^"+Md.replace("\\.","")+"]",ZS=/((?:WC+[\/:])*)/.source.replace("WC",bd),JS=/(WCOD+)?/.source.replace("WCOD",$S),jS=/(?:\.(WC+)(?:\[(.+)\])?)?/.source.replace("WC",bd),KS=/\.(WC+)(?:\[(.+)\])?/.source.replace("WC",bd),QS=new RegExp("^"+ZS+JS+jS+KS+"$"),t2=["material","materials","bones","map"],ud=class{constructor(t,e,n){let s=n||ui.parseTrackName(e);this._targetGroup=t,this._bindings=t.subscribe_(e,s)}getValue(t,e){this.bind();let n=this._targetGroup.nCachedObjects_,s=this._bindings[n];s!==void 0&&s.getValue(t,e)}setValue(t,e){let n=this._bindings;for(let s=this._targetGroup.nCachedObjects_,r=n.length;s!==r;++s)n[s].setValue(t,e)}bind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].bind()}unbind(){let t=this._bindings;for(let e=this._targetGroup.nCachedObjects_,n=t.length;e!==n;++e)t[e].unbind()}},ui=class i{constructor(t,e,n){this.path=e,this.parsedPath=n||i.parseTrackName(e),this.node=i.findNode(t,this.parsedPath.nodeName),this.rootNode=t,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}static create(t,e,n){return t&&t.isAnimationObjectGroup?new i.Composite(t,e,n):new i(t,e,n)}static sanitizeNodeName(t){return t.replace(/\s/g,"_").replace(YS,"")}static parseTrackName(t){let e=QS.exec(t);if(e===null)throw new Error("PropertyBinding: Cannot parse trackName: "+t);let n={nodeName:e[2],objectName:e[3],objectIndex:e[4],propertyName:e[5],propertyIndex:e[6]},s=n.nodeName&&n.nodeName.lastIndexOf(".");if(s!==void 0&&s!==-1){let r=n.nodeName.substring(s+1);t2.indexOf(r)!==-1&&(n.nodeName=n.nodeName.substring(0,s),n.objectName=r)}if(n.propertyName===null||n.propertyName.length===0)throw new Error("PropertyBinding: can not parse propertyName from trackName: "+t);return n}static findNode(t,e){if(e===void 0||e===""||e==="."||e===-1||e===t.name||e===t.uuid)return t;if(t.skeleton){let n=t.skeleton.getBoneByName(e);if(n!==void 0)return n}if(t.children){let n=function(r){for(let a=0;a<r.length;a++){let o=r[a];if(o.name===e||o.uuid===e)return o;let l=n(o.children);if(l)return l}return null},s=n(t.children);if(s)return s}return null}_getValue_unavailable(){}_setValue_unavailable(){}_getValue_direct(t,e){t[e]=this.targetObject[this.propertyName]}_getValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)t[e++]=n[s]}_getValue_arrayElement(t,e){t[e]=this.resolvedProperty[this.propertyIndex]}_getValue_toArray(t,e){this.resolvedProperty.toArray(t,e)}_setValue_direct(t,e){this.targetObject[this.propertyName]=t[e]}_setValue_direct_setNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.needsUpdate=!0}_setValue_direct_setMatrixWorldNeedsUpdate(t,e){this.targetObject[this.propertyName]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_array(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++]}_setValue_array_setNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.needsUpdate=!0}_setValue_array_setMatrixWorldNeedsUpdate(t,e){let n=this.resolvedProperty;for(let s=0,r=n.length;s!==r;++s)n[s]=t[e++];this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_arrayElement(t,e){this.resolvedProperty[this.propertyIndex]=t[e]}_setValue_arrayElement_setNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.needsUpdate=!0}_setValue_arrayElement_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty[this.propertyIndex]=t[e],this.targetObject.matrixWorldNeedsUpdate=!0}_setValue_fromArray(t,e){this.resolvedProperty.fromArray(t,e)}_setValue_fromArray_setNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.needsUpdate=!0}_setValue_fromArray_setMatrixWorldNeedsUpdate(t,e){this.resolvedProperty.fromArray(t,e),this.targetObject.matrixWorldNeedsUpdate=!0}_getValue_unbound(t,e){this.bind(),this.getValue(t,e)}_setValue_unbound(t,e){this.bind(),this.setValue(t,e)}bind(){let t=this.node,e=this.parsedPath,n=e.objectName,s=e.propertyName,r=e.propertyIndex;if(t||(t=i.findNode(this.rootNode,e.nodeName),this.node=t),this.getValue=this._getValue_unavailable,this.setValue=this._setValue_unavailable,!t){console.warn("THREE.PropertyBinding: No target node found for track: "+this.path+".");return}if(n){let h=e.objectIndex;switch(n){case"materials":if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.materials){console.error("THREE.PropertyBinding: Can not bind to material.materials as node.material does not have a materials array.",this);return}t=t.material.materials;break;case"bones":if(!t.skeleton){console.error("THREE.PropertyBinding: Can not bind to bones as node does not have a skeleton.",this);return}t=t.skeleton.bones;for(let u=0;u<t.length;u++)if(t[u].name===h){h=u;break}break;case"map":if("map"in t){t=t.map;break}if(!t.material){console.error("THREE.PropertyBinding: Can not bind to material as node does not have a material.",this);return}if(!t.material.map){console.error("THREE.PropertyBinding: Can not bind to material.map as node.material does not have a map.",this);return}t=t.material.map;break;default:if(t[n]===void 0){console.error("THREE.PropertyBinding: Can not bind to objectName of node undefined.",this);return}t=t[n]}if(h!==void 0){if(t[h]===void 0){console.error("THREE.PropertyBinding: Trying to bind to objectIndex of objectName, but is undefined.",this,t);return}t=t[h]}}let a=t[s];if(a===void 0){let h=e.nodeName;console.error("THREE.PropertyBinding: Trying to update property for track: "+h+"."+s+" but it wasn't found.",t);return}let o=this.Versioning.None;this.targetObject=t,t.needsUpdate!==void 0?o=this.Versioning.NeedsUpdate:t.matrixWorldNeedsUpdate!==void 0&&(o=this.Versioning.MatrixWorldNeedsUpdate);let l=this.BindingType.Direct;if(r!==void 0){if(s==="morphTargetInfluences"){if(!t.geometry){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.",this);return}if(!t.geometry.morphAttributes){console.error("THREE.PropertyBinding: Can not bind to morphTargetInfluences because node does not have a geometry.morphAttributes.",this);return}t.morphTargetDictionary[r]!==void 0&&(r=t.morphTargetDictionary[r])}l=this.BindingType.ArrayElement,this.resolvedProperty=a,this.propertyIndex=r}else a.fromArray!==void 0&&a.toArray!==void 0?(l=this.BindingType.HasFromToArray,this.resolvedProperty=a):Array.isArray(a)?(l=this.BindingType.EntireArray,this.resolvedProperty=a):this.propertyName=s;this.getValue=this.GetterByBindingType[l],this.setValue=this.SetterByBindingTypeAndVersioning[l][o]}unbind(){this.node=null,this.getValue=this._getValue_unbound,this.setValue=this._setValue_unbound}};ui.Composite=ud;ui.prototype.BindingType={Direct:0,EntireArray:1,ArrayElement:2,HasFromToArray:3};ui.prototype.Versioning={None:0,NeedsUpdate:1,MatrixWorldNeedsUpdate:2};ui.prototype.GetterByBindingType=[ui.prototype._getValue_direct,ui.prototype._getValue_array,ui.prototype._getValue_arrayElement,ui.prototype._getValue_toArray];ui.prototype.SetterByBindingTypeAndVersioning=[[ui.prototype._setValue_direct,ui.prototype._setValue_direct_setNeedsUpdate,ui.prototype._setValue_direct_setMatrixWorldNeedsUpdate],[ui.prototype._setValue_array,ui.prototype._setValue_array_setNeedsUpdate,ui.prototype._setValue_array_setMatrixWorldNeedsUpdate],[ui.prototype._setValue_arrayElement,ui.prototype._setValue_arrayElement_setNeedsUpdate,ui.prototype._setValue_arrayElement_setMatrixWorldNeedsUpdate],[ui.prototype._setValue_fromArray,ui.prototype._setValue_fromArray_setNeedsUpdate,ui.prototype._setValue_fromArray_setMatrixWorldNeedsUpdate]];var R2=new Float32Array(1);var Io=class extends hh{constructor(t,e,n=1){super(t,e),this.isInstancedInterleavedBuffer=!0,this.meshPerAttribute=n}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}clone(t){let e=super.clone(t);return e.meshPerAttribute=this.meshPerAttribute,e}toJSON(t){let e=super.toJSON(t);return e.isInstancedInterleavedBuffer=!0,e.meshPerAttribute=this.meshPerAttribute,e}};var Ih=class{constructor(t,e,n=0,s=1/0){this.ray=new Ao(t,e),this.near=n,this.far=s,this.camera=null,this.layers=new vl,this.params={Mesh:{},Line:{threshold:1},LOD:{},Points:{threshold:1},Sprite:{}}}set(t,e){this.ray.set(t,e)}setFromCamera(t,e){e.isPerspectiveCamera?(this.ray.origin.setFromMatrixPosition(e.matrixWorld),this.ray.direction.set(t.x,t.y,.5).unproject(e).sub(this.ray.origin).normalize(),this.camera=e):e.isOrthographicCamera?(this.ray.origin.set(t.x,t.y,(e.near+e.far)/(e.near-e.far)).unproject(e),this.ray.direction.set(0,0,-1).transformDirection(e.matrixWorld),this.camera=e):console.error("THREE.Raycaster: Unsupported camera type: "+e.type)}intersectObject(t,e=!0,n=[]){return fd(t,this,n,e),n.sort(F0),n}intersectObjects(t,e=!0,n=[]){for(let s=0,r=t.length;s<r;s++)fd(t[s],this,n,e);return n.sort(F0),n}};function F0(i,t){return i.distance-t.distance}function fd(i,t,e,n){if(i.layers.test(t.layers)&&i.raycast(t,e),n===!0){let s=i.children;for(let r=0,a=s.length;r<a;r++)fd(s[r],t,e,!0)}}var Il=class{constructor(t=1,e=0,n=0){return this.radius=t,this.phi=e,this.theta=n,this}set(t,e,n){return this.radius=t,this.phi=e,this.theta=n,this}copy(t){return this.radius=t.radius,this.phi=t.phi,this.theta=t.theta,this}makeSafe(){return this.phi=Math.max(1e-6,Math.min(Math.PI-1e-6,this.phi)),this}setFromVector3(t){return this.setFromCartesianCoords(t.x,t.y,t.z)}setFromCartesianCoords(t,e,n){return this.radius=Math.sqrt(t*t+e*e+n*n),this.radius===0?(this.theta=0,this.phi=0):(this.theta=Math.atan2(t,n),this.phi=Math.acos(Li(e/this.radius,-1,1))),this}clone(){return new this.constructor().copy(this)}};var B0=new X,Hc=new X,Dh=class{constructor(t=new X,e=new X){this.start=t,this.end=e}set(t,e){return this.start.copy(t),this.end.copy(e),this}copy(t){return this.start.copy(t.start),this.end.copy(t.end),this}getCenter(t){return t.addVectors(this.start,this.end).multiplyScalar(.5)}delta(t){return t.subVectors(this.end,this.start)}distanceSq(){return this.start.distanceToSquared(this.end)}distance(){return this.start.distanceTo(this.end)}at(t,e){return this.delta(e).multiplyScalar(t).add(this.start)}closestPointToPointParameter(t,e){B0.subVectors(t,this.start),Hc.subVectors(this.end,this.start);let n=Hc.dot(Hc),r=Hc.dot(B0)/n;return e&&(r=Li(r,0,1)),r}closestPointToPoint(t,e,n){let s=this.closestPointToPointParameter(t,e);return this.delta(n).multiplyScalar(s).add(this.start)}applyMatrix4(t){return this.start.applyMatrix4(t),this.end.applyMatrix4(t),this}equals(t){return t.start.equals(this.start)&&t.end.equals(this.end)}clone(){return new this.constructor().copy(this)}};typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:"160"}}));typeof window<"u"&&(window.__THREE__?console.warn("WARNING: Multiple instances of Three.js being imported."):window.__THREE__="160");var lg={type:"change"},Sd={type:"start"},cg={type:"end"},Hh=new Ao,hg=new Zs,e2=Math.cos(70*Fh.DEG2RAD),Vh=class extends pr{constructor(t,e){super(),this.object=t,this.domElement=e,this.domElement.style.touchAction="none",this.enabled=!0,this.target=new X,this.cursor=new X,this.minDistance=0,this.maxDistance=1/0,this.minZoom=0,this.maxZoom=1/0,this.minTargetRadius=0,this.maxTargetRadius=1/0,this.minPolarAngle=0,this.maxPolarAngle=Math.PI,this.minAzimuthAngle=-1/0,this.maxAzimuthAngle=1/0,this.enableDamping=!1,this.dampingFactor=.05,this.enableZoom=!0,this.zoomSpeed=1,this.enableRotate=!0,this.rotateSpeed=1,this.enablePan=!0,this.panSpeed=1,this.screenSpacePanning=!0,this.keyPanSpeed=7,this.zoomToCursor=!1,this.autoRotate=!1,this.autoRotateSpeed=2,this.keys={LEFT:"ArrowLeft",UP:"ArrowUp",RIGHT:"ArrowRight",BOTTOM:"ArrowDown"},this.mouseButtons={LEFT:Do.ROTATE,MIDDLE:Do.DOLLY,RIGHT:Do.PAN},this.touches={ONE:Uo.ROTATE,TWO:Uo.DOLLY_PAN},this.target0=this.target.clone(),this.position0=this.object.position.clone(),this.zoom0=this.object.zoom,this._domElementKeyEvents=null,this.getPolarAngle=function(){return o.phi},this.getAzimuthalAngle=function(){return o.theta},this.getDistance=function(){return this.object.position.distanceTo(this.target)},this.listenToKeyEvents=function(G){G.addEventListener("keydown",he),this._domElementKeyEvents=G},this.stopListenToKeyEvents=function(){this._domElementKeyEvents.removeEventListener("keydown",he),this._domElementKeyEvents=null},this.saveState=function(){n.target0.copy(n.target),n.position0.copy(n.object.position),n.zoom0=n.object.zoom},this.reset=function(){n.target.copy(n.target0),n.object.position.copy(n.position0),n.object.zoom=n.zoom0,n.object.updateProjectionMatrix(),n.dispatchEvent(lg),n.update(),r=s.NONE},this.update=(function(){let G=new X,ue=new xs().setFromUnitVectors(t.up,new X(0,1,0)),ve=ue.clone().invert(),tt=new X,dt=new xs,Zt=new X,Kt=2*Math.PI;return function(ct=null){let V=n.object.position;G.copy(V).sub(n.target),G.applyQuaternion(ue),o.setFromVector3(G),n.autoRotate&&r===s.NONE&&at(R(ct)),n.enableDamping?(o.theta+=l.theta*n.dampingFactor,o.phi+=l.phi*n.dampingFactor):(o.theta+=l.theta,o.phi+=l.phi);let Pt=n.minAzimuthAngle,zt=n.maxAzimuthAngle;isFinite(Pt)&&isFinite(zt)&&(Pt<-Math.PI?Pt+=Kt:Pt>Math.PI&&(Pt-=Kt),zt<-Math.PI?zt+=Kt:zt>Math.PI&&(zt-=Kt),Pt<=zt?o.theta=Math.max(Pt,Math.min(zt,o.theta)):o.theta=o.theta>(Pt+zt)/2?Math.max(Pt,o.theta):Math.min(zt,o.theta)),o.phi=Math.max(n.minPolarAngle,Math.min(n.maxPolarAngle,o.phi)),o.makeSafe(),n.enableDamping===!0?n.target.addScaledVector(u,n.dampingFactor):n.target.add(u),n.target.sub(n.cursor),n.target.clampLength(n.minTargetRadius,n.maxTargetRadius),n.target.add(n.cursor),n.zoomToCursor&&I||n.object.isOrthographicCamera?o.radius=Lt(o.radius):o.radius=Lt(o.radius*h),G.setFromSpherical(o),G.applyQuaternion(ve),V.copy(n.target).add(G),n.object.lookAt(n.target),n.enableDamping===!0?(l.theta*=1-n.dampingFactor,l.phi*=1-n.dampingFactor,u.multiplyScalar(1-n.dampingFactor)):(l.set(0,0,0),u.set(0,0,0));let re=!1;if(n.zoomToCursor&&I){let ae=null;if(n.object.isPerspectiveCamera){let Ie=G.length();ae=Lt(Ie*h);let Jt=Ie-ae;n.object.position.addScaledVector(C,Jt),n.object.updateMatrixWorld()}else if(n.object.isOrthographicCamera){let Ie=new X(P.x,P.y,0);Ie.unproject(n.object),n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),re=!0;let Jt=new X(P.x,P.y,0);Jt.unproject(n.object),n.object.position.sub(Jt).add(Ie),n.object.updateMatrixWorld(),ae=G.length()}else console.warn("WARNING: OrbitControls.js encountered an unknown camera type - zoom to cursor disabled."),n.zoomToCursor=!1;ae!==null&&(this.screenSpacePanning?n.target.set(0,0,-1).transformDirection(n.object.matrix).multiplyScalar(ae).add(n.object.position):(Hh.origin.copy(n.object.position),Hh.direction.set(0,0,-1).transformDirection(n.object.matrix),Math.abs(n.object.up.dot(Hh.direction))<e2?t.lookAt(n.target):(hg.setFromNormalAndCoplanarPoint(n.object.up,n.target),Hh.intersectPlane(hg,n.target))))}else n.object.isOrthographicCamera&&(n.object.zoom=Math.max(n.minZoom,Math.min(n.maxZoom,n.object.zoom/h)),n.object.updateProjectionMatrix(),re=!0);return h=1,I=!1,re||tt.distanceToSquared(n.object.position)>a||8*(1-dt.dot(n.object.quaternion))>a||Zt.distanceToSquared(n.target)>0?(n.dispatchEvent(lg),tt.copy(n.object.position),dt.copy(n.object.quaternion),Zt.copy(n.target),!0):!1}})(),this.dispose=function(){n.domElement.removeEventListener("contextmenu",Ee),n.domElement.removeEventListener("pointerdown",Me),n.domElement.removeEventListener("pointercancel",L),n.domElement.removeEventListener("wheel",pe),n.domElement.removeEventListener("pointermove",O),n.domElement.removeEventListener("pointerup",L),n._domElementKeyEvents!==null&&(n._domElementKeyEvents.removeEventListener("keydown",he),n._domElementKeyEvents=null)};let n=this,s={NONE:-1,ROTATE:0,DOLLY:1,PAN:2,TOUCH_ROTATE:3,TOUCH_PAN:4,TOUCH_DOLLY_PAN:5,TOUCH_DOLLY_ROTATE:6},r=s.NONE,a=1e-6,o=new Il,l=new Il,h=1,u=new X,f=new de,m=new de,d=new de,y=new de,v=new de,p=new de,x=new de,T=new de,M=new de,C=new X,P=new de,I=!1,z=[],nt={};function R(G){return G!==null?2*Math.PI/60*n.autoRotateSpeed*G:2*Math.PI/60/60*n.autoRotateSpeed}function w(G){let ue=Math.abs(G)/(100*(window.devicePixelRatio|0));return Math.pow(.95,n.zoomSpeed*ue)}function at(G){l.theta-=G}function wt(G){l.phi-=G}let ce=(function(){let G=new X;return function(ve,tt){G.setFromMatrixColumn(tt,0),G.multiplyScalar(-ve),u.add(G)}})(),et=(function(){let G=new X;return function(ve,tt){n.screenSpacePanning===!0?G.setFromMatrixColumn(tt,1):(G.setFromMatrixColumn(tt,0),G.crossVectors(n.object.up,G)),G.multiplyScalar(ve),u.add(G)}})(),ft=(function(){let G=new X;return function(ve,tt){let dt=n.domElement;if(n.object.isPerspectiveCamera){let Zt=n.object.position;G.copy(Zt).sub(n.target);let Kt=G.length();Kt*=Math.tan(n.object.fov/2*Math.PI/180),ce(2*ve*Kt/dt.clientHeight,n.object.matrix),et(2*tt*Kt/dt.clientHeight,n.object.matrix)}else n.object.isOrthographicCamera?(ce(ve*(n.object.right-n.object.left)/n.object.zoom/dt.clientWidth,n.object.matrix),et(tt*(n.object.top-n.object.bottom)/n.object.zoom/dt.clientHeight,n.object.matrix)):(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - pan disabled."),n.enablePan=!1)}})();function Rt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h/=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Xt(G){n.object.isPerspectiveCamera||n.object.isOrthographicCamera?h*=G:(console.warn("WARNING: OrbitControls.js encountered an unknown camera type - dolly/zoom disabled."),n.enableZoom=!1)}function Qt(G,ue){if(!n.zoomToCursor)return;I=!0;let ve=n.domElement.getBoundingClientRect(),tt=G-ve.left,dt=ue-ve.top,Zt=ve.width,Kt=ve.height;P.x=tt/Zt*2-1,P.y=-(dt/Kt)*2+1,C.set(P.x,P.y,1).unproject(n.object).sub(n.object.position).normalize()}function Lt(G){return Math.max(n.minDistance,Math.min(n.maxDistance,G))}function jt(G){f.set(G.clientX,G.clientY)}function fe(G){Qt(G.clientX,G.clientX),x.set(G.clientX,G.clientY)}function we(G){y.set(G.clientX,G.clientY)}function Ct(G){m.set(G.clientX,G.clientY),d.subVectors(m,f).multiplyScalar(n.rotateSpeed);let ue=n.domElement;at(2*Math.PI*d.x/ue.clientHeight),wt(2*Math.PI*d.y/ue.clientHeight),f.copy(m),n.update()}function It(G){T.set(G.clientX,G.clientY),M.subVectors(T,x),M.y>0?Rt(w(M.y)):M.y<0&&Xt(w(M.y)),x.copy(T),n.update()}function se(G){v.set(G.clientX,G.clientY),p.subVectors(v,y).multiplyScalar(n.panSpeed),ft(p.x,p.y),y.copy(v),n.update()}function Le(G){Qt(G.clientX,G.clientY),G.deltaY<0?Xt(w(G.deltaY)):G.deltaY>0&&Rt(w(G.deltaY)),n.update()}function Ne(G){let ue=!1;switch(G.code){case n.keys.UP:G.ctrlKey||G.metaKey||G.shiftKey?wt(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(0,n.keyPanSpeed),ue=!0;break;case n.keys.BOTTOM:G.ctrlKey||G.metaKey||G.shiftKey?wt(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(0,-n.keyPanSpeed),ue=!0;break;case n.keys.LEFT:G.ctrlKey||G.metaKey||G.shiftKey?at(2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(n.keyPanSpeed,0),ue=!0;break;case n.keys.RIGHT:G.ctrlKey||G.metaKey||G.shiftKey?at(-2*Math.PI*n.rotateSpeed/n.domElement.clientHeight):ft(-n.keyPanSpeed,0),ue=!0;break}ue&&(G.preventDefault(),n.update())}function sn(G){if(z.length===1)f.set(G.pageX,G.pageY);else{let ue=gn(G),ve=.5*(G.pageX+ue.x),tt=.5*(G.pageY+ue.y);f.set(ve,tt)}}function on(G){if(z.length===1)y.set(G.pageX,G.pageY);else{let ue=gn(G),ve=.5*(G.pageX+ue.x),tt=.5*(G.pageY+ue.y);y.set(ve,tt)}}function Ve(G){let ue=gn(G),ve=G.pageX-ue.x,tt=G.pageY-ue.y,dt=Math.sqrt(ve*ve+tt*tt);x.set(0,dt)}function We(G){n.enableZoom&&Ve(G),n.enablePan&&on(G)}function K(G){n.enableZoom&&Ve(G),n.enableRotate&&sn(G)}function be(G){if(z.length==1)m.set(G.pageX,G.pageY);else{let ve=gn(G),tt=.5*(G.pageX+ve.x),dt=.5*(G.pageY+ve.y);m.set(tt,dt)}d.subVectors(m,f).multiplyScalar(n.rotateSpeed);let ue=n.domElement;at(2*Math.PI*d.x/ue.clientHeight),wt(2*Math.PI*d.y/ue.clientHeight),f.copy(m)}function lt(G){if(z.length===1)v.set(G.pageX,G.pageY);else{let ue=gn(G),ve=.5*(G.pageX+ue.x),tt=.5*(G.pageY+ue.y);v.set(ve,tt)}p.subVectors(v,y).multiplyScalar(n.panSpeed),ft(p.x,p.y),y.copy(v)}function _e(G){let ue=gn(G),ve=G.pageX-ue.x,tt=G.pageY-ue.y,dt=Math.sqrt(ve*ve+tt*tt);T.set(0,dt),M.set(0,Math.pow(T.y/x.y,n.zoomSpeed)),Rt(M.y),x.copy(T);let Zt=(G.pageX+ue.x)*.5,Kt=(G.pageY+ue.y)*.5;Qt(Zt,Kt)}function $t(G){n.enableZoom&&_e(G),n.enablePan&&lt(G)}function Be(G){n.enableZoom&&_e(G),n.enableRotate&&be(G)}function Me(G){n.enabled!==!1&&(z.length===0&&(n.domElement.setPointerCapture(G.pointerId),n.domElement.addEventListener("pointermove",O),n.domElement.addEventListener("pointerup",L)),$e(G),G.pointerType==="touch"?Ge(G):yt(G))}function O(G){n.enabled!==!1&&(G.pointerType==="touch"?qt(G):ye(G))}function L(G){tn(G),z.length===0&&(n.domElement.releasePointerCapture(G.pointerId),n.domElement.removeEventListener("pointermove",O),n.domElement.removeEventListener("pointerup",L)),n.dispatchEvent(cg),r=s.NONE}function yt(G){let ue;switch(G.button){case 0:ue=n.mouseButtons.LEFT;break;case 1:ue=n.mouseButtons.MIDDLE;break;case 2:ue=n.mouseButtons.RIGHT;break;default:ue=-1}switch(ue){case Do.DOLLY:if(n.enableZoom===!1)return;fe(G),r=s.DOLLY;break;case Do.ROTATE:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enablePan===!1)return;we(G),r=s.PAN}else{if(n.enableRotate===!1)return;jt(G),r=s.ROTATE}break;case Do.PAN:if(G.ctrlKey||G.metaKey||G.shiftKey){if(n.enableRotate===!1)return;jt(G),r=s.ROTATE}else{if(n.enablePan===!1)return;we(G),r=s.PAN}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Sd)}function ye(G){switch(r){case s.ROTATE:if(n.enableRotate===!1)return;Ct(G);break;case s.DOLLY:if(n.enableZoom===!1)return;It(G);break;case s.PAN:if(n.enablePan===!1)return;se(G);break}}function pe(G){n.enabled===!1||n.enableZoom===!1||r!==s.NONE||(G.preventDefault(),n.dispatchEvent(Sd),Le(G),n.dispatchEvent(cg))}function he(G){n.enabled===!1||n.enablePan===!1||Ne(G)}function Ge(G){switch(me(G),z.length){case 1:switch(n.touches.ONE){case Uo.ROTATE:if(n.enableRotate===!1)return;sn(G),r=s.TOUCH_ROTATE;break;case Uo.PAN:if(n.enablePan===!1)return;on(G),r=s.TOUCH_PAN;break;default:r=s.NONE}break;case 2:switch(n.touches.TWO){case Uo.DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;We(G),r=s.TOUCH_DOLLY_PAN;break;case Uo.DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;K(G),r=s.TOUCH_DOLLY_ROTATE;break;default:r=s.NONE}break;default:r=s.NONE}r!==s.NONE&&n.dispatchEvent(Sd)}function qt(G){switch(me(G),r){case s.TOUCH_ROTATE:if(n.enableRotate===!1)return;be(G),n.update();break;case s.TOUCH_PAN:if(n.enablePan===!1)return;lt(G),n.update();break;case s.TOUCH_DOLLY_PAN:if(n.enableZoom===!1&&n.enablePan===!1)return;$t(G),n.update();break;case s.TOUCH_DOLLY_ROTATE:if(n.enableZoom===!1&&n.enableRotate===!1)return;Be(G),n.update();break;default:r=s.NONE}}function Ee(G){n.enabled!==!1&&G.preventDefault()}function $e(G){z.push(G.pointerId)}function tn(G){delete nt[G.pointerId];for(let ue=0;ue<z.length;ue++)if(z[ue]==G.pointerId){z.splice(ue,1);return}}function me(G){let ue=nt[G.pointerId];ue===void 0&&(ue=new de,nt[G.pointerId]=ue),ue.set(G.pageX,G.pageY)}function gn(G){let ue=G.pointerId===z[0]?z[1]:z[0];return nt[ue]}n.domElement.addEventListener("contextmenu",Ee),n.domElement.addEventListener("pointerdown",Me),n.domElement.addEventListener("pointercancel",L),n.domElement.addEventListener("wheel",pe,{passive:!1}),this.update()}};function ug(i,t,e){let n=new Vh(i,t),s=new Set,r=null,a=()=>{r?.gesture||(r&&(r.gesture=!0),n.dispatchEvent({type:"gesturestart"}))};n.stopMotion=()=>{let l=i.position.clone(),h=n.target.clone(),u=n.enableDamping;n.enableDamping=!1,n.update(),i.position.copy(l),n.target.copy(h),n.enableDamping=u,n.update()},t.addEventListener("pointerdown",l=>{s.size||(r={id:l.pointerId,x:l.clientX,y:l.clientY,time:l.timeStamp,primary:l.button===0,tolerance:l.pointerType==="mouse"?5:8,label:l.target.closest?.(".maplabel button"),moved:!1,multiple:!1}),s.add(l.pointerId),t.setPointerCapture(l.pointerId),r&&s.size>1&&(r.multiple=!0,a())}),t.addEventListener("pointermove",l=>{r&&r.id===l.pointerId&&Math.hypot(l.clientX-r.x,l.clientY-r.y)>=r.tolerance&&(r.moved=!0,a())}),t.addEventListener("pointerup",l=>{let h=s.has(l.pointerId)&&s.size===1&&r&&r.id===l.pointerId&&r.primary&&!r.multiple&&!r.moved&&l.timeStamp-r.time<550&&Math.hypot(l.clientX-r.x,l.clientY-r.y)<r.tolerance,u=r?.label;s.delete(l.pointerId),s.size||(r=null),h&&(u?u.isConnected&&u.click():e(l))});let o=l=>{s.delete(l.pointerId)&&(r=null)};return t.addEventListener("pointercancel",o),t.addEventListener("lostpointercapture",o),t.addEventListener("wheel",a,{passive:!0}),t.addEventListener("click",l=>{(l.detail>0||l.pointerType)&&l.target.closest?.(".maplabel button")&&(l.preventDefault(),l.stopPropagation())},!0),n}function fg(i,t,{now:e=()=>performance.now(),reducedMotion:n=!1}={}){let s=null,r=()=>{s=null};function a(l,h=1200,u=null,f=0){r(),t.stopMotion?.(),s={from:i.position.clone(),targetFrom:t.target.clone(),pos:l.pos.clone(),target:l.target.clone(),start:e(),duration:n?0:h,onDone:u,arrivalDelay:n?0:f},s.duration||o(s.start)}function o(l){if(!s)return!1;let h=s,u=h.duration?Math.max(0,Math.min(1,(l-h.start)/h.duration)):1,f=u<.5?4*u*u*u:1-(-2*u+2)**3/2;return i.position.lerpVectors(h.from,h.pos,f),t.target.lerpVectors(h.targetFrom,h.target,f),i.position.y+=Math.sin(u*Math.PI)*Math.min(180,h.from.distanceTo(h.pos)*.12),u===1&&l>=h.start+h.duration+h.arrivalDelay&&(s=null,h.onDone?.()),!0}return{move:a,update:o,cancel:r,get active(){return!!s},get destination(){return s}}}var Pa=class extends vi{constructor(t=document.createElement("div")){super(),this.isCSS2DObject=!0,this.element=t,this.element.style.position="absolute",this.element.style.userSelect="none",this.element.setAttribute("draggable",!1),this.center=new de(.5,.5),this.addEventListener("removed",function(){this.traverse(function(e){e.element instanceof Element&&e.element.parentNode!==null&&e.element.parentNode.removeChild(e.element)})})}copy(t,e){return super.copy(t,e),this.element=t.element.cloneNode(!0),this.center=t.center,this}},Ca=new X,dg=new Nn,pg=new Nn,mg=new X,gg=new X,Gh=class{constructor(t={}){let e=this,n,s,r,a,o={objects:new WeakMap},l=t.element!==void 0?t.element:document.createElement("div");l.style.overflow="hidden",this.domElement=l,this.getSize=function(){return{width:n,height:s}},this.render=function(d,y){d.matrixWorldAutoUpdate===!0&&d.updateMatrixWorld(),y.parent===null&&y.matrixWorldAutoUpdate===!0&&y.updateMatrixWorld(),dg.copy(y.matrixWorldInverse),pg.multiplyMatrices(y.projectionMatrix,dg),h(d,d,y),m(d)},this.setSize=function(d,y){n=d,s=y,r=n/2,a=s/2,l.style.width=d+"px",l.style.height=y+"px"};function h(d,y,v){if(d.isCSS2DObject){Ca.setFromMatrixPosition(d.matrixWorld),Ca.applyMatrix4(pg);let p=d.visible===!0&&Ca.z>=-1&&Ca.z<=1&&d.layers.test(v.layers)===!0;if(d.element.style.display=p===!0?"":"none",p===!0){d.onBeforeRender(e,y,v);let T=d.element;T.style.transform="translate("+-100*d.center.x+"%,"+-100*d.center.y+"%)translate("+(Ca.x*r+r)+"px,"+(-Ca.y*a+a)+"px)",T.parentNode!==l&&l.appendChild(T),d.onAfterRender(e,y,v)}let x={distanceToCameraSquared:u(v,d)};o.objects.set(d,x)}for(let p=0,x=d.children.length;p<x;p++)h(d.children[p],y,v)}function u(d,y){return mg.setFromMatrixPosition(d.matrixWorld),gg.setFromMatrixPosition(y.matrixWorld),mg.distanceToSquared(gg)}function f(d){let y=[];return d.traverse(function(v){v.isCSS2DObject&&y.push(v)}),y}function m(d){let y=f(d).sort(function(p,x){if(p.renderOrder!==x.renderOrder)return x.renderOrder-p.renderOrder;let T=o.objects.get(p).distanceToCameraSquared,M=o.objects.get(x).distanceToCameraSquared;return T-M}),v=y.length;for(let p=0,x=y.length;p<x;p++)y[p].element.style.zIndex=v-p}}};function xg(){let i=document.querySelector("#gesture-tour"),t=document.querySelector("#help-open"),e=document.querySelector("#tour-skip"),n=[...i.querySelectorAll(".tour-step")],s=[...i.querySelectorAll(".tour-progress i")],r=matchMedia("(prefers-reduced-motion:reduce)"),a=[],o;function l(){a.forEach(clearTimeout),a=[],cancelAnimationFrame(o)}function h(m){n.forEach((d,y)=>{d.classList.toggle("active",y===m),d.setAttribute("aria-hidden",String(y!==m)),s[y].classList.toggle("active",y===m)})}function u(){l(),i.classList.remove("show"),i.contains(document.activeElement)&&t.focus({preventScroll:!0}),a.push(setTimeout(()=>{i.hidden=!0},r.matches?0:600))}function f(){l(),i.classList.remove("show"),n.forEach(m=>m.classList.remove("active")),i.hidden=!1,i.offsetWidth,h(0),o=requestAnimationFrame(()=>i.classList.add("show")),a.push(setTimeout(()=>h(1),3800)),a.push(setTimeout(()=>h(2),6500)),a.push(setTimeout(u,9300))}return t.addEventListener("click",f),e.addEventListener("click",u),document.addEventListener("keydown",m=>{m.key==="Escape"&&!i.hidden&&u()}),document.addEventListener("pointerdown",m=>{!i.hidden&&m.target instanceof Element&&!m.target.closest("#gesture-tour,#help-open")&&u()},{passive:!0}),document.addEventListener("visibilitychange",()=>{document.hidden&&u()}),{start:f,stop:u}}var yg=new es,Wh=new X,La=class extends Lh{constructor(){super(),this.isLineSegmentsGeometry=!0,this.type="LineSegmentsGeometry";let t=[-1,2,0,1,2,0,-1,1,0,1,1,0,-1,0,0,1,0,0,-1,-1,0,1,-1,0],e=[-1,2,1,2,-1,1,1,1,-1,-1,1,-1,-1,-2,1,-2],n=[0,2,1,2,3,1,2,4,3,4,5,3,4,6,5,6,7,5];this.setIndex(n),this.setAttribute("position",new Qe(t,3)),this.setAttribute("uv",new Qe(e,2))}applyMatrix4(t){let e=this.attributes.instanceStart,n=this.attributes.instanceEnd;return e!==void 0&&(e.applyMatrix4(t),n.applyMatrix4(t),e.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}setPositions(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new Io(e,6,1);return this.setAttribute("instanceStart",new tr(n,3,0)),this.setAttribute("instanceEnd",new tr(n,3,3)),this.computeBoundingBox(),this.computeBoundingSphere(),this}setColors(t){let e;t instanceof Float32Array?e=t:Array.isArray(t)&&(e=new Float32Array(t));let n=new Io(e,6,1);return this.setAttribute("instanceColorStart",new tr(n,3,0)),this.setAttribute("instanceColorEnd",new tr(n,3,3)),this}fromWireframeGeometry(t){return this.setPositions(t.attributes.position.array),this}fromEdgesGeometry(t){return this.setPositions(t.attributes.position.array),this}fromMesh(t){return this.fromWireframeGeometry(new Eh(t.geometry)),this}fromLineSegments(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new es);let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;t!==void 0&&e!==void 0&&(this.boundingBox.setFromBufferAttribute(t),yg.setFromBufferAttribute(e),this.boundingBox.union(yg))}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new ys),this.boundingBox===null&&this.computeBoundingBox();let t=this.attributes.instanceStart,e=this.attributes.instanceEnd;if(t!==void 0&&e!==void 0){let n=this.boundingSphere.center;this.boundingBox.getCenter(n);let s=0;for(let r=0,a=t.count;r<a;r++)Wh.fromBufferAttribute(t,r),s=Math.max(s,n.distanceToSquared(Wh)),Wh.fromBufferAttribute(e,r),s=Math.max(s,n.distanceToSquared(Wh));this.boundingSphere.radius=Math.sqrt(s),isNaN(this.boundingSphere.radius)&&console.error("THREE.LineSegmentsGeometry.computeBoundingSphere(): Computed radius is NaN. The instanced position data is likely to have NaN values.",this)}}toJSON(){}applyMatrix(t){return console.warn("THREE.LineSegmentsGeometry: applyMatrix() has been renamed to applyMatrix4()."),this.applyMatrix4(t)}};Te.line={worldUnits:{value:1},linewidth:{value:1},resolution:{value:new de(1,1)},dashOffset:{value:0},dashScale:{value:1},dashSize:{value:1},gapSize:{value:1}};rs.line={uniforms:Bh.merge([Te.common,Te.fog,Te.line]),vertexShader:`
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
		`};var so=class extends Qs{constructor(t){super({type:"LineMaterial",uniforms:Bh.clone(rs.line.uniforms),vertexShader:rs.line.vertexShader,fragmentShader:rs.line.fragmentShader,clipping:!0}),this.isLineMaterial=!0,this.setValues(t)}get color(){return this.uniforms.diffuse.value}set color(t){this.uniforms.diffuse.value=t}get worldUnits(){return"WORLD_UNITS"in this.defines}set worldUnits(t){t===!0?this.defines.WORLD_UNITS="":delete this.defines.WORLD_UNITS}get linewidth(){return this.uniforms.linewidth.value}set linewidth(t){this.uniforms.linewidth&&(this.uniforms.linewidth.value=t)}get dashed(){return"USE_DASH"in this.defines}set dashed(t){t===!0!==this.dashed&&(this.needsUpdate=!0),t===!0?this.defines.USE_DASH="":delete this.defines.USE_DASH}get dashScale(){return this.uniforms.dashScale.value}set dashScale(t){this.uniforms.dashScale.value=t}get dashSize(){return this.uniforms.dashSize.value}set dashSize(t){this.uniforms.dashSize.value=t}get dashOffset(){return this.uniforms.dashOffset.value}set dashOffset(t){this.uniforms.dashOffset.value=t}get gapSize(){return this.uniforms.gapSize.value}set gapSize(t){this.uniforms.gapSize.value=t}get opacity(){return this.uniforms.opacity.value}set opacity(t){this.uniforms&&(this.uniforms.opacity.value=t)}get resolution(){return this.uniforms.resolution.value}set resolution(t){this.uniforms.resolution.value.copy(t)}get alphaToCoverage(){return"USE_ALPHA_TO_COVERAGE"in this.defines}set alphaToCoverage(t){this.defines&&(t===!0!==this.alphaToCoverage&&(this.needsUpdate=!0),t===!0?(this.defines.USE_ALPHA_TO_COVERAGE="",this.extensions.derivatives=!0):(delete this.defines.USE_ALPHA_TO_COVERAGE,this.extensions.derivatives=!1))}};var _g=new X,vg=new X,qi=new Fn,Yi=new Fn,gr=new Fn,Ed=new X,wd=new Nn,$i=new Dh,Mg=new X,Xh=new es,qh=new ys,xr=new Fn,yr,No;function bg(i,t,e){return xr.set(0,0,-t,1).applyMatrix4(i.projectionMatrix),xr.multiplyScalar(1/xr.w),xr.x=No/e.width,xr.y=No/e.height,xr.applyMatrix4(i.projectionMatrixInverse),xr.multiplyScalar(1/xr.w),Math.abs(Math.max(xr.x,xr.y))}function n2(i,t){let e=i.matrixWorld,n=i.geometry,s=n.attributes.instanceStart,r=n.attributes.instanceEnd,a=Math.min(n.instanceCount,s.count);for(let o=0,l=a;o<l;o++){$i.start.fromBufferAttribute(s,o),$i.end.fromBufferAttribute(r,o),$i.applyMatrix4(e);let h=new X,u=new X;yr.distanceSqToSegment($i.start,$i.end,u,h),u.distanceTo(h)<No*.5&&t.push({point:u,pointOnLine:h,distance:yr.origin.distanceTo(u),object:i,face:null,faceIndex:o,uv:null,uv1:null})}}function i2(i,t,e){let n=t.projectionMatrix,r=i.material.resolution,a=i.matrixWorld,o=i.geometry,l=o.attributes.instanceStart,h=o.attributes.instanceEnd,u=Math.min(o.instanceCount,l.count),f=-t.near;yr.at(1,gr),gr.w=1,gr.applyMatrix4(t.matrixWorldInverse),gr.applyMatrix4(n),gr.multiplyScalar(1/gr.w),gr.x*=r.x/2,gr.y*=r.y/2,gr.z=0,Ed.copy(gr),wd.multiplyMatrices(t.matrixWorldInverse,a);for(let m=0,d=u;m<d;m++){if(qi.fromBufferAttribute(l,m),Yi.fromBufferAttribute(h,m),qi.w=1,Yi.w=1,qi.applyMatrix4(wd),Yi.applyMatrix4(wd),qi.z>f&&Yi.z>f)continue;if(qi.z>f){let M=qi.z-Yi.z,C=(qi.z-f)/M;qi.lerp(Yi,C)}else if(Yi.z>f){let M=Yi.z-qi.z,C=(Yi.z-f)/M;Yi.lerp(qi,C)}qi.applyMatrix4(n),Yi.applyMatrix4(n),qi.multiplyScalar(1/qi.w),Yi.multiplyScalar(1/Yi.w),qi.x*=r.x/2,qi.y*=r.y/2,Yi.x*=r.x/2,Yi.y*=r.y/2,$i.start.copy(qi),$i.start.z=0,$i.end.copy(Yi),$i.end.z=0;let v=$i.closestPointToPointParameter(Ed,!0);$i.at(v,Mg);let p=Fh.lerp(qi.z,Yi.z,v),x=p>=-1&&p<=1,T=Ed.distanceTo(Mg)<No*.5;if(x&&T){$i.start.fromBufferAttribute(l,m),$i.end.fromBufferAttribute(h,m),$i.start.applyMatrix4(a),$i.end.applyMatrix4(a);let M=new X,C=new X;yr.distanceSqToSegment($i.start,$i.end,C,M),e.push({point:C,pointOnLine:M,distance:yr.origin.distanceTo(C),object:i,face:null,faceIndex:m,uv:null,uv1:null})}}}var Yh=class extends Je{constructor(t=new La,e=new so({color:Math.random()*16777215})){super(t,e),this.isLineSegments2=!0,this.type="LineSegments2"}computeLineDistances(){let t=this.geometry,e=t.attributes.instanceStart,n=t.attributes.instanceEnd,s=new Float32Array(2*e.count);for(let a=0,o=0,l=e.count;a<l;a++,o+=2)_g.fromBufferAttribute(e,a),vg.fromBufferAttribute(n,a),s[o]=o===0?0:s[o-1],s[o+1]=s[o]+_g.distanceTo(vg);let r=new Io(s,2,1);return t.setAttribute("instanceDistanceStart",new tr(r,1,0)),t.setAttribute("instanceDistanceEnd",new tr(r,1,1)),this}raycast(t,e){let n=this.material.worldUnits,s=t.camera;s===null&&!n&&console.error('LineSegments2: "Raycaster.camera" needs to be set in order to raycast against LineSegments2 while worldUnits is set to false.');let r=t.params.Line2!==void 0&&t.params.Line2.threshold||0;yr=t.ray;let a=this.matrixWorld,o=this.geometry,l=this.material;No=l.linewidth+r,o.boundingSphere===null&&o.computeBoundingSphere(),qh.copy(o.boundingSphere).applyMatrix4(a);let h;if(n)h=No*.5;else{let f=Math.max(s.near,qh.distanceToPoint(yr.origin));h=bg(s,f,l.resolution)}if(qh.radius+=h,yr.intersectsSphere(qh)===!1)return;o.boundingBox===null&&o.computeBoundingBox(),Xh.copy(o.boundingBox).applyMatrix4(a);let u;if(n)u=No*.5;else{let f=Math.max(s.near,Xh.distanceToPoint(yr.origin));u=bg(s,f,l.resolution)}Xh.expandByScalar(u),yr.intersectsBox(Xh)!==!1&&(n?n2(this,e):i2(this,s,e))}};var Ia=class extends La{constructor(){super(),this.isLineGeometry=!0,this.type="LineGeometry"}setPositions(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setPositions(n),this}setColors(t){let e=t.length-3,n=new Float32Array(2*e);for(let s=0;s<e;s+=3)n[2*s]=t[s],n[2*s+1]=t[s+1],n[2*s+2]=t[s+2],n[2*s+3]=t[s+3],n[2*s+4]=t[s+4],n[2*s+5]=t[s+5];return super.setColors(n),this}fromLine(t){let e=t.geometry;return this.setPositions(e.attributes.position.array),this}};var $h=class extends Yh{constructor(t=new Ia,e=new so({color:Math.random()*16777215})){super(t,e),this.isLine2=!0,this.type="Line2"}};function ro(i,t=!1){let e=i[0].index!==null,n=new Set(Object.keys(i[0].attributes)),s=new Set(Object.keys(i[0].morphAttributes)),r={},a={},o=i[0].morphTargetsRelative,l=new Ln,h=0;for(let u=0;u<i.length;++u){let f=i[u],m=0;if(e!==(f.index!==null))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". All geometries must have compatible attributes; make sure index attribute exists among all geometries, or in none of them."),null;for(let d in f.attributes){if(!n.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+'. All geometries must have compatible attributes; make sure "'+d+'" attribute exists among all geometries, or in none of them.'),null;r[d]===void 0&&(r[d]=[]),r[d].push(f.attributes[d]),m++}if(m!==n.size)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". Make sure all geometries have the same number of attributes."),null;if(o!==f.morphTargetsRelative)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". .morphTargetsRelative must be consistent throughout all geometries."),null;for(let d in f.morphAttributes){if(!s.has(d))return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+".  .morphAttributes must be consistent throughout all geometries."),null;a[d]===void 0&&(a[d]=[]),a[d].push(f.morphAttributes[d])}if(t){let d;if(e)d=f.index.count;else if(f.attributes.position!==void 0)d=f.attributes.position.count;else return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed with geometry at index "+u+". The geometry must have either an index or a position attribute"),null;l.addGroup(h,d,u),h+=d}}if(e){let u=0,f=[];for(let m=0;m<i.length;++m){let d=i[m].index;for(let y=0;y<d.count;++y)f.push(d.getX(y)+u);u+=i[m].attributes.position.count}l.setIndex(f)}for(let u in r){let f=Sg(r[u]);if(!f)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" attribute."),null;l.setAttribute(u,f)}for(let u in a){let f=a[u][0].length;if(f===0)break;l.morphAttributes=l.morphAttributes||{},l.morphAttributes[u]=[];for(let m=0;m<f;++m){let d=[];for(let v=0;v<a[u].length;++v)d.push(a[u][v][m]);let y=Sg(d);if(!y)return console.error("THREE.BufferGeometryUtils: .mergeGeometries() failed while trying to merge the "+u+" morphAttribute."),null;l.morphAttributes[u].push(y)}}return l}function Sg(i){let t,e,n,s=-1,r=0;for(let h=0;h<i.length;++h){let u=i[h];if(u.isInterleavedBufferAttribute)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. InterleavedBufferAttributes are not supported."),null;if(t===void 0&&(t=u.array.constructor),t!==u.array.constructor)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.array must be of consistent array types across matching attributes."),null;if(e===void 0&&(e=u.itemSize),e!==u.itemSize)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.itemSize must be consistent across matching attributes."),null;if(n===void 0&&(n=u.normalized),n!==u.normalized)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.normalized must be consistent across matching attributes."),null;if(s===-1&&(s=u.gpuType),s!==u.gpuType)return console.error("THREE.BufferGeometryUtils: .mergeAttributes() failed. BufferAttribute.gpuType must be consistent across matching attributes."),null;r+=u.array.length}let a=new t(r),o=0;for(let h=0;h<i.length;++h)a.set(i[h].array,o),o+=i[h].array.length;let l=new Zn(a,e,n);return s!==void 0&&(l.gpuType=s),l}function Eg(i,t=1e-4){t=Math.max(t,Number.EPSILON);let e={},n=i.getIndex(),s=i.getAttribute("position"),r=n?n.count:s.count,a=0,o=Object.keys(i.attributes),l={},h={},u=[],f=["getX","getY","getZ","getW"],m=["setX","setY","setZ","setW"];for(let T=0,M=o.length;T<M;T++){let C=o[T],P=i.attributes[C];l[C]=new Zn(new P.array.constructor(P.count*P.itemSize),P.itemSize,P.normalized);let I=i.morphAttributes[C];I&&(h[C]=new Zn(new I.array.constructor(I.count*I.itemSize),I.itemSize,I.normalized))}let d=t*.5,y=Math.log10(1/t),v=Math.pow(10,y),p=d*v;for(let T=0;T<r;T++){let M=n?n.getX(T):T,C="";for(let P=0,I=o.length;P<I;P++){let z=o[P],nt=i.getAttribute(z),R=nt.itemSize;for(let w=0;w<R;w++)C+=`${~~(nt[f[w]](M)*v+p)},`}if(C in e)u.push(e[C]);else{for(let P=0,I=o.length;P<I;P++){let z=o[P],nt=i.getAttribute(z),R=i.morphAttributes[z],w=nt.itemSize,at=l[z],wt=h[z];for(let ce=0;ce<w;ce++){let et=f[ce],ft=m[ce];if(at[ft](a,nt[et](M)),R)for(let Rt=0,Xt=R.length;Rt<Xt;Rt++)wt[Rt][ft](a,R[Rt][et](M))}}e[C]=a,u.push(a),a++}}let x=i.clone();for(let T in i.attributes){let M=l[T];if(x.setAttribute(T,new Zn(M.array.slice(0,a*M.itemSize),M.itemSize,M.normalized)),T in h)for(let C=0;C<h[T].length;C++){let P=h[T][C];x.morphAttributes[T][C]=new Zn(P.array.slice(0,a*P.itemSize),P.itemSize,P.normalized)}}return x.setIndex(u),x}var Td=new X(-.4,.85,.35).normalize();function Zh(i,t,e=0,n=0,s=0){let r=i.index?i.toNonIndexed():i;r.deleteAttribute("uv"),r.translate(e,n,s),r.computeVertexNormals();let a=new fn(t),o=r.attributes.normal,l=new Float32Array(o.count*3);for(let h=0;h<o.count;h++){let u=.62+.38*Math.max(0,o.getX(h)*Td.x+o.getY(h)*Td.y+o.getZ(h)*Td.z);l[h*3]=a.r*u,l[h*3+1]=a.g*u,l[h*3+2]=a.b*u}return r.deleteAttribute("normal"),r.setAttribute("color",new Zn(l,3)),r}var ii=(i,t,e,n,s,r,a)=>Zh(new Ri(i,t,e),n,s,r,a),wg="#e2862b",s2="#f0c8a0",r2="#3b4a63",o2="#7c5b3c",Tg="#f3e6c4",Oo="#466266",Rg="#943f2d",Cg="#eee8d8",Ag="#2e6fd0",a2="#7a4fc9",Ad="#26282a";function l2(i){let t=new Pn;t.add(new Je(ro([ii(.3,.36,.19,wg,0,.64,0),ii(.22,.27,.1,o2,0,.66,.14),ii(.08,.33,.1,"#d27a22",-.195,.625,0),ii(.08,.33,.1,"#d27a22",.195,.625,0),Zh(new Xi(.115,8,6),s2,0,.91,0),Zh(new Wi(.17,.17,.025,10),Tg,0,.975,0),Zh(new Wi(.09,.11,.08,10),Tg,0,1.02,0)]),i));let e=s=>{let r=new Je(ii(.11,.44,.13,r2,0,-.22,0),i);return r.position.set(s,.46,0),t.add(r),r},n=[e(-.075),e(.075)];return{group:t,px:34,real:1.65,base:[wg,1,1],box:[-.32,-1.12,.32,.22],swing(s){n[0].rotation.x=s*.55,n[1].rotation.x=-s*.55}}}function c2(i){let t=new Pn;return t.add(new Je(ro([ii(.34,.27,1,Ag,0,.195,0),ii(.352,.1,.8,Oo,0,.255,.04),ii(.3,.11,.02,Oo,0,.25,-.505),ii(.26,.09,.02,Oo,0,.26,.505),ii(.351,.025,.98,"#f7f5ee",0,.13,0),ii(.28,.03,.86,"#d9e6f7",0,.345,.02),ii(.36,.1,.14,Ad,0,.06,-.32),ii(.36,.1,.14,Ad,0,.06,.32),ii(.05,.03,.01,"#ffe9a8",-.11,.12,-.505),ii(.05,.03,.01,"#ffe9a8",.11,.12,-.505)]),i)),{group:t,px:64,real:11,base:[Ag,1.05,1.55],pitch:!0,box:[-.55,-.5,.55,.28]}}function h2(i){let t=new Pn;return t.add(new Je(ro([ii(.3,.3,.8,Cg,0,.21,0),ii(.312,.12,.7,Oo,0,.25,0),ii(.26,.1,.012,Oo,0,.25,-.405),ii(.26,.1,.012,Oo,0,.25,.405),ii(.32,.05,.84,Rg,0,.385,0),ii(.24,.06,.6,Ad,0,.03,0)]),i)),{group:t,px:64,real:13,base:[a2,.95,1.3],pitch:!0,box:[-.5,-.55,.5,.28]}}function u2(i){let t=new Pn;return t.add(new Je(ro([ii(.12,.07,.2,"#3e514c",0,-.035,0),ii(.035,.24,.035,"#594937",0,-.19,0),ii(.44,.38,.38,Rg,0,-.5,0),ii(.452,.14,.392,Oo,0,-.46,0),ii(.36,.04,.32,Cg,0,-.29,0)]),i)),{group:t,px:76,real:3.8,box:[-.3,-.12,.3,.72]}}function Pg(i){let t=new Pn;t.visible=!1,t.renderOrder=1e6,i.add(t);let e=new os({vertexColors:!0,transparent:!0,fog:!1,toneMapped:!1}),n=new os({vertexColors:!0,transparent:!0,depthWrite:!1,fog:!1,toneMapped:!1}),s=(p,x,T)=>{let M=new fn(x),C=p.attributes.position.count,P=new Float32Array(C*4);for(let I=0;I<C;I++)P.set([M.r,M.g,M.b,T],I*4);return p.deleteAttribute("uv"),p.deleteAttribute("normal"),p.setAttribute("color",new Zn(P,4)),p},r=([p,x,T])=>new Je(ro([s(new _h(.34,24),p,.32),s(new Mh(.34,.42,24),"#ffffff",.92)]).rotateX(-Math.PI/2).scale(x,1,T).translate(0,.005,0),n),a={walk:l2(e),bus:c2(e),funicular:h2(e),cable:u2(e)};for(let p of Object.values(a))p.group.rotation.order="YXZ",p.group.visible=!1,t.add(p.group),p.base&&p.group.add(r(p.base));let o=-1,l=p=>{let x=p.info.render.frame;x!==o&&(o=x,p.state.buffers.depth.setMask(!0),p.clearDepth())};t.traverse(p=>{p.isGroup?p.renderOrder=1e6:p.isMesh&&(p.onBeforeRender=l,p.renderOrder=p.material===e?1:0)});let h=null,u=0,f=null,m=0,d=0,y=0,v=new X;return{get visible(){return t.visible},get mode(){return h},show(p,x){p!==h&&(h&&(a[h].group.visible=!1),h=p,a[h].group.visible=!0,t.visible=!0,u=x)},hide(){h&&(a[h].group.visible=!1),t.visible=!1,h=null,f=null,d=0},update(p,x,T,M,C,P,I){if(!h)return;let z=a[h],nt=Math.min(1,(C-u)/320),R=nt<1?.35+.65*(1+2.2*(nt-1)**3+1.2*(nt-1)**2):1,w=Math.max(z.real,z.px/I);if(y=w*I,t.position.copy(p),t.scale.setScalar(w*R),x!==null)if(f===null)f=x;else{let at=Math.atan2(Math.sin(x-f),Math.cos(x-f));f+=at*Math.min(1,P*10)}d+=((M?1:0)-d)*Math.min(1,P*8),M&&(m+=P*Math.PI*2*2.3),z.group.rotation.set(z.pitch?Math.max(-.5,Math.min(.5,T)):0,-(f??0),h==="cable"?Math.sin(C/320)*.05*d:0),z.swing?.(Math.sin(m)*d)},screenBox(p,x,T){if(!t.visible||!h||(v.copy(t.position).project(p),v.z<-1||v.z>1))return null;let M=(v.x+1)/2*x,C=(1-v.y)/2*T,P=a[h].box,I=y;return[M+P[0]*I,C+P[1]*I,M+P[2]*I,C+P[3]*I]}}}var Lg={walk:{name:"\u6B65\u884C",color:"#e2862b"},funicular:{name:"\u7F06\u8F66",color:"#7a4fc9"},cable:{name:"\u7D22\u9053",color:"#7a4fc9"},bus:{name:"\u666F\u4EA4\u8F66",color:"#2e6fd0"}},Rd={walk:1,funicular:1.3,cable:1.6,bus:2.5},f2={walk:1,funicular:1.3,cable:1.6,bus:2.4},d2='<svg viewBox="0 0 24 24"><circle cx="13" cy="4.5" r="1.8"/><path d="m9 21 2.5-7.5L14 16v5M8 12l2-4.5 3-.5 2.5 3.5L18 11M10.5 7.8 9 13"/></svg>',p2='<svg viewBox="0 0 24 24"><path d="M3 5.5 21 3M12 4.3V8M6.5 8h11a1.5 1.5 0 0 1 1.5 1.5v7a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 16.5v-7A1.5 1.5 0 0 1 6.5 8zM5 12.5h14"/></svg>',m2='<svg viewBox="0 0 24 24"><rect x="4.5" y="3.5" width="15" height="15" rx="2.5"/><path d="M4.5 11h15M8 18.5V21M16 18.5V21"/><circle cx="8.5" cy="15" r=".9"/><circle cx="15.5" cy="15" r=".9"/></svg>',Cd='<svg viewBox="0 0 24 24"><path d="M8 5.5v13l10.5-6.5z"/></svg>',Ig='<svg viewBox="0 0 24 24"><rect x="7" y="7" width="10" height="10" rx="1.5"/></svg>',g2='<svg viewBox="0 0 24 24"><path d="M4 9V4h5M20 9V4h-5M4 15v5h5M20 15v5h-5"/></svg>',Da=i=>i>=1e3?`${(i/1e3).toFixed(1)} \u516C\u91CC`:`${Math.round(i/10)*10} \u7C73`;function Ze(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function Dg(i){let{routes:t,world:e,camera:n,controls:s,hAt:r,realH:a=tt=>tt,fly:o,pose:l,cancelFlight:h,openPanel:u,closeSheetsForRoute:f,onFrame:m,isMobile:d,visibleRect:y}=i,v=document.querySelector("#route-list"),p=document.querySelector("#route-detail"),x=document.querySelector("#route-hud"),T=x.querySelector(".rh-stops"),M=x.querySelector(".rh-bar i"),C=new Pn;C.renderOrder=5,e.add(C);let P=[],I=null,z=[],nt=[],R=null,w=null,at=-1,wt=null,ce=()=>{clearTimeout(wt),wt=null};function et(tt){let dt=tt.pts,Zt=[],Kt=tt.mode==="cable"?22:2.6,te=r(...dt[0])+Kt,ct=r(...dt.at(-1))+Kt,V=0,Pt=[];for(let re=1;re<dt.length;re++){let ae=Math.hypot(dt[re][0]-dt[re-1][0],dt[re][1]-dt[re-1][1]);Pt.push(ae),V+=ae}let zt=0;for(let re=0;re<dt.length;re++)if(re>0){let[ae,Ie]=dt[re-1],[Jt,De]=dt[re],ze=Pt[re-1],Ue=Math.max(1,Math.ceil(ze/6));for(let en=1;en<=Ue;en++){let hn=en/Ue,pn=ae+(Jt-ae)*hn,Rn=Ie+(De-Ie)*hn,Tn=zt+ze*hn,Bn=r(pn,Rn)+2.6,li=tt.mode==="cable"?Math.max(Bn+12,te+(ct-te)*(Tn/V)):Bn;Zt.push(new X(pn,li,Rn))}zt+=ze}else Zt.push(new X(dt[0][0],tt.mode==="cable"?te:r(...dt[0])+2.6,dt[0][1]));return Zt}function ft(tt,dt,Zt,Kt={}){let te=new Ia;te.setPositions(tt.flatMap(Pt=>[Pt.x,Pt.y,Pt.z]));let ct=new so({color:dt,linewidth:Zt,transparent:!0,opacity:Kt.opacity??1,depthTest:Kt.depthTest??!0,depthWrite:!1,dashed:!!Kt.dashed,dashSize:9,gapSize:7});ct.resolution.set(innerWidth,innerHeight),P.push(ct);let V=new $h(te,ct);return Kt.dashed&&V.computeLineDistances(),V.renderOrder=Kt.order??5,V.frustumCulled=!1,C.add(V),V}addEventListener("resize",()=>{for(let tt of P)tt.resolution.set(innerWidth,innerHeight)});function Rt(tt){Xt();let dt=[];tt.legs.forEach((te,ct)=>te.parts.forEach(V=>{let Pt=Lg[V.mode].color,zt=V.mode!=="walk",re=V.segments||[{pts:V.pts,estimated:!1}];for(let ae of re){let Ie=et({...V,pts:ae.pts}),Jt=ae.estimated,De={dashed:zt||Jt};ft(Ie,Pt,4,{...De,depthTest:!1,opacity:.38,order:4}),ft(Ie,"#ffffff",8.5,{...De,order:5}),ft(Ie,Pt,5,{...De,opacity:Jt?.75:1,order:6});for(let ze of Ie)dt.push({p:ze,mode:V.mode,leg:ct})}}));let Zt=new Map;tt.stops.forEach((te,ct)=>{Zt.has(te.place)||Zt.set(te.place,{s:te,idx:[]}),Zt.get(te.place).idx.push(ct)});let Kt=tt.stops.length-1;for(let{s:te,idx:ct}of Zt.values()){let V=Ze("div","maplabel route-stop"+(ct.includes(0)?" start":ct.includes(Kt)?" end":"")),Pt=Ze("button"),zt=Ze("span","rs-name",te.n);Pt.type="button",Pt.title=te.n,Pt.tabIndex=-1,Pt.append(Ze("span","rs-num"+(ct.length>1?" multi":""),ct.map(Ie=>Ie+1).join("\xB7")),zt),Pt.onclick=()=>Ve(ct[0]);let re=Ze("i");V.append(Pt,re);let ae=new Pa(V);ae.center.set(.5,1),ae.position.set(te.x,r(te.x,te.z)+9,te.z),C.add(ae);for(let Ie of ct)z[Ie]=V;nt.push({box:V,b:Pt,name:zt,stem:re,label:ae,lift:0,rank:ct.includes(0)||ct.includes(Kt)?1:2+ct[0]/100})}Qt="",R=se(tt,dt),document.body.classList.add("route-on")}function Xt(){for(let tt of[...C.children])C.remove(tt),tt.isLine2&&(tt.geometry.dispose(),tt.material.dispose()),tt.isCSS2DObject&&tt.element.remove();P.length=0,z=[],nt=[],R=null,document.body.classList.remove("route-on")}let Qt="",Lt=0,jt=null,fe=[],we=-1e9,Ct=new X;function It(tt){if(!nt.length)return!1;n.updateMatrixWorld();let dt=n.matrixWorld.elements.map(Jt=>Jt.toFixed(1)).join()+n.projectionMatrix.elements.join()+innerWidth+"x"+innerHeight+":"+at+":"+(K.mode??"");if(dt===Qt&&tt-Lt<500)return!1;(!jt||tt-we>=500)&&(jt=y(),fe=i.covers?.()??[],we=tt),Qt=dt,Lt=tt;let Zt=jt,Kt=innerWidth,te=innerHeight,ct=[],V=[],Pt=z[at],zt=(Jt,De)=>De.some(ze=>Jt[0]<ze[2]&&Jt[2]>ze[0]&&Jt[1]<ze[3]&&Jt[3]>ze[1]),re=(Jt,De)=>[Jt[0]+De,Jt[1]+De,Jt[2]-De,Jt[3]-De],ae=[...nt].sort((Jt,De)=>(De.box===Pt)-(Jt.box===Pt)||Jt.rank-De.rank),Ie=K.screenBox(n,Kt,te);Ie&&ct.push(Ie);for(let Jt of ae){!Jt.bh&&Jt.b.offsetHeight&&(Jt.bw=Jt.b.offsetWidth,Jt.bh=Jt.b.offsetHeight,Jt.h=Jt.box.offsetHeight-Jt.lift,Jt.nw=Jt.name.offsetWidth,Jt.nh=Jt.name.offsetHeight),Jt.label.getWorldPosition(Ct).project(n),Jt.on=Ct.z>-1&&Ct.z<1;let De=Jt.bw||26,ze=Jt.bh||26,Ue=(Ct.x+1)/2*Kt,en=(1-Ct.y)/2*te-(Jt.h||36)+ze/2,hn=Rn=>[Ue-De/2,en-Rn-ze/2,Ue+De/2,en-Rn+ze/2],pn=0;if(Jt.on){let Rn=hn(0),Tn=ct.filter(li=>zt(re(Rn,6),[li])),Bn=Tn.length?Math.max(...Tn.map(li=>Rn[3]-li[1]+2)):0;Bn&&Bn<=2*ze+6&&hn(Bn)[1]>=Zt.top&&!zt(re(hn(Bn),4),ct)&&!zt(hn(Bn),fe)&&(pn=Math.round(Bn))}Jt.dot=hn(pn),Jt.on&&ct.push(Jt.dot),Jt.stemBox=Jt.on?[Ue-4,Jt.dot[3],Ue+4,(1-Ct.y)/2*te+5]:null,Jt.stemBox&&V.push(Jt.stemBox),pn!==Jt.lift&&(Jt.lift=pn,Jt.stem.style.height=pn?`${10+pn}px`:""),Jt.box.classList.toggle("veiled",!!Ie&&Jt.on&&zt([Ue-4,Jt.dot[3],Ue+4,(1-Ct.y)/2*te+6],[Ie]))}for(let Jt of ae){let De=0;if(Jt.on){let ze=Jt.nw||[...Jt.name.textContent].length*12+20,Ue=Jt.nh||22,[en,hn,pn,Rn]=Jt.dot,Tn=(hn+Rn)/2,Bn=[[pn+3,Tn-Ue/2,pn+3+ze,Tn+Ue/2],[en-3-ze,Tn-Ue/2,en-3,Tn+Ue/2]],li=xn=>xn[0]>=Zt.left+4&&xn[2]<=Zt.right-4&&xn[1]>=Zt.top+2&&xn[3]<=Zt.bottom-2,Hs=V.filter(xn=>xn!==Jt.stemBox),ls=xn=>li(xn)&&!zt(xn,fe),In=Bn.findIndex(xn=>ls(xn)&&!zt(xn,ct)&&!zt(xn,Hs));In<0&&Jt.box===Pt&&(In=Bn.findIndex(xn=>ls(xn)&&!(Ie&&zt(xn,[Ie]))),In<0&&(In=Bn.findIndex(ls)),In<0&&(In=Bn.findIndex(li)),In<0&&(In=Math.max(0,Bn.findIndex(xn=>xn[0]>=0&&xn[2]<=Kt)))),In>=0&&(De=In?-1:1,ct.push(Bn[In]))}Jt.box.classList.toggle("named",De!==0),Jt.box.classList.toggle("flip",De===-1)}return!0}function se(tt,dt){let Zt=[],Kt=[],te=[],ct=0;dt.forEach((re,ae)=>{ae&&(ct+=re.p.distanceTo(dt[ae-1].p)/Rd[re.mode]),Zt.push(re.p),Kt.push(ct),te.push(re.mode)});let V=tt.stops.map((re,ae)=>{if(ae===0)return 0;let Ie=0,Jt=1/0,De=dt.findLastIndex(ze=>ze.leg===ae-1);for(let ze=Math.max(0,De-40);ze<=De;ze++){let Ue=Math.hypot(Zt[ze].x-re.x,Zt[ze].z-re.z);Ue<Jt&&(Jt=Ue,Ie=ze)}return Kt[Ie]}),Pt=tt.legs.map((re,ae)=>Kt[dt.findLastIndex(Ie=>Ie.leg===ae)]),zt=[];for(let re=1;re<dt.length;re++)dt[re].mode!==dt[re-1].mode&&dt[re].leg===dt[re-1].leg&&zt.push(Kt[re-1]);return{pts:Zt,cum:Kt,modes:te,total:ct,stopAt:V,legEnd:Pt,switches:zt}}function Le(tt,dt){let{pts:Zt,cum:Kt}=tt,te=0,ct=Kt.length-1;if(dt<=0)return Zt[0].clone();if(dt>=Kt[ct])return Zt[ct].clone();for(;ct-te>1;){let Pt=te+ct>>1;Kt[Pt]<=dt?te=Pt:ct=Pt}let V=(dt-Kt[te])/Math.max(1e-6,Kt[ct]-Kt[te]);return Zt[te].clone().lerp(Zt[ct],V)}function Ne(tt,dt){let{cum:Zt,modes:Kt}=tt,te=0,ct=Zt.length-1;if(dt>=Zt[ct])return Kt[ct];for(;ct-te>1;){let V=te+ct>>1;Zt[V]<=dt?te=V:ct=V}return Kt[ct]}function sn(tt){let dt=[];tt.legs.forEach(In=>In.parts.forEach(xn=>xn.pts.forEach(([Vs,B],gt)=>{(gt%3===0||gt===xn.pts.length-1)&&dt.push([Vs,B,8,0,0])}))),tt.stops.forEach(In=>dt.push([In.x,In.z,9,15,38]));let Zt=dt.length,Kt=dt.reduce((In,xn)=>In+xn[0],0)/Zt,te=dt.reduce((In,xn)=>In+xn[1],0)/Zt,ct=0,V=0,Pt=0;for(let[In,xn]of dt)ct+=(In-Kt)**2,V+=(xn-te)**2,Pt+=(In-Kt)*(xn-te);let zt=Math.atan2(2*Pt,ct-V)/2*180/Math.PI;for(;zt-25>90;)zt-=180;for(;25-zt>90;)zt+=180;let re=52,ae=y(),Ie=innerWidth,Jt=innerHeight,De=22,ze=16,Ue={w:ae.right-ae.left,h:ae.bottom-ae.top},en=(ae.left+ae.right)/2+ae.shiftX,hn=(ae.top+ae.bottom)/2+ae.shiftY,pn=new Gi(43,Ie/Jt,1,6e4),Rn=new X,Tn=new X,Bn=new X,li=Kt,Hs=te,ls=1600;for(let In=0;In<30;In++){let xn=l(li,Hs,ls,zt,re);pn.position.copy(xn.pos),pn.lookAt(xn.target),pn.updateMatrixWorld();let Vs=1/0,B=-1/0,gt=1/0,Tt=-1/0;for(let[rn,dn,un,an,Vn]of dt){Rn.set(rn,(r(rn,dn)+un)*e.scale.y,dn).project(pn);let Si=(Rn.x+1)/2*Ie,ci=(1-Rn.y)/2*Jt;Vs=Math.min(Vs,Si-an),B=Math.max(B,Si+an),gt=Math.min(gt,ci-Vn),Tt=Math.max(Tt,ci)}let Ft=Math.max((B-Vs)/Math.max(80,Ue.w-2*De),(Tt-gt)/Math.max(60,Ue.h-2*ze)),At=2*ls*Math.tan(43*Math.PI/360)/Jt,Pe=(Vs+B)/2-en,Ye=(gt+Tt)/2-hn;Tn.setFromMatrixColumn(pn.matrixWorld,0).setY(0).normalize(),Bn.setFromMatrixColumn(pn.matrixWorld,2).negate().setY(0).normalize();let je=At/Math.cos(re*Math.PI/180);if(li+=(Tn.x*Pe*At-Bn.x*Ye*je)*.85,Hs+=(Tn.z*Pe*At-Bn.z*Ye*je)*.85,ls=Math.min(12e3,Math.max(250,ls*Math.min(1.8,Math.max(.55,Ft)))),Math.abs(Ft-1)<.01&&Math.abs(Pe)<2&&Math.abs(Ye)<2)break}return l(li,Hs,ls*1.06,zt,re)}function on(){if(Be(),!I)return;let tt=sn(I);o(tt,1500)}function Ve(tt){if(!I)return;Be();let dt=I.stops[tt];o(l(dt.x,dt.z,I.id==="tiantai-classic"?420:260,25,55),1300),We(tt)}function We(tt){at=tt;for(let dt of new Set(z))dt.classList.toggle("active",dt===z[tt]);p.querySelectorAll(".rs-stop").forEach(dt=>dt.classList.toggle("active",+dt.dataset.i===tt)),ve()}let K=Pg(i.scene??e.parent??e),be={walk:"\u6B65\u884C",bus:"\u4E58\u666F\u4EA4\u8F66",funicular:"\u4E58\u7F06\u8F66",cable:"\u4E58\u7D22\u9053"},lt={bus:"\u666F\u4EA4\u8F66",funicular:"\u7F06\u8F66",cable:"\u7D22\u9053"},_e=(tt,dt)=>dt==="walk"?`\u4E0B${tt==="bus"?"\u8F66":lt[tt]}\u6B65\u884C`:tt==="walk"?`\u4E58${lt[dt]}`:`\u6362\u4E58${lt[dt]}`;function $t(){if(!I||!R)return;ce(),h(),f(),s.stopMotion?.();let tt=Math.min(50,Math.max(22,R.total/90)),dt=I.id==="tiantai-classic"?430:250;w??={s:0,speed:R.total/tt,pause:1.2,stop:0,heading:null,dist:dt,camDist:dt},w.paused=!1,We(w.stop),ve()}function Be(){ce(),!(!w||w.paused)&&(w.paused=!0,ve())}function Me(tt){if(w.pause>0)w.pause-=tt,w.pause<=0&&(w.switching=!1);else{let Ue=w.s,en=w.stop+1,hn=en<R.stopAt.length?R.stopAt[en]:1/0,pn=Math.min(R.total,Ue+w.speed*tt),Rn=R.switches.find(Tn=>Tn>Ue&&Tn<=pn&&Tn<hn);Rn!==void 0?(pn=Rn,w.pause=.8,w.switching=!0):pn>=hn&&(pn=hn,w.stop=en,w.pause=1.1),w.s=pn,w.stop===en&&We(en)}let dt=Ne(R,w.s),Zt=Rd[dt];w.camDist+=(w.dist*f2[O()]-w.camDist)*Math.min(1,tt*.7);let Kt=w.camDist/w.dist,te=Le(R,w.s),ct=Le(R,w.s+Math.min(160*(w.speed/90),400*Kt/Zt)),V=Math.atan2(ct.x-te.x,-(ct.z-te.z));w.heading===null&&(w.heading=V);let Pt=V-w.heading;Pt=Math.atan2(Math.sin(Pt),Math.cos(Pt)),w.heading+=Pt*Math.min(1,tt*1.6/Kt);let zt=te.y*e.scale.y,re=57*Math.PI/180,ae=w.camDist,Ie=new X(te.x,zt,te.z),Jt=Ie.clone().add(new X(-Math.sin(w.heading)*ae*Math.sin(re),ae*Math.cos(re),Math.cos(w.heading)*ae*Math.sin(re))),De=Math.min(1,tt*3.2*Zt/Kt);s.target.lerp(Ie,De),n.position.lerp(Jt,De);let ze=w.pause<=0&&w.stop+1<R.stopAt.length;ze!==w.moving&&(w.moving=ze,ze&&(w.swapped=!1),ve()),ue(w.s/R.total),w.s>=R.total&&w.pause<=0&&(w=null,We(-1),ve(!0),wt=setTimeout(()=>{wt=null,u("routes"),p.scrollTop=0,on()},400))}function O(){let tt=w.stop,dt=I.legs[tt];return dt&&tt>0&&w.s<=R.legEnd[tt-1]?dt.parts[0].mode:Ne(R,w.s)}let L=new X;function yt(tt,dt){let Zt=O();Zt!==w.mode&&(w.fromMode=w.mode,w.mode=Zt,w.swapped=!!w.fromMode,K.show(Zt,tt),ve());let Kt=Le(R,w.s),te=r(Kt.x,Kt.z);L.set(Kt.x,(Zt==="cable"?Math.max(Kt.y,te+20):te+2.6)*e.scale.y,Kt.z);let ct=10/Rd[Zt],V=Le(R,Math.max(0,w.s-ct)),Pt=Le(R,Math.min(R.total,w.s+ct)),zt=Math.hypot(Pt.x-V.x,Pt.z-V.z),re=zt>1?Math.atan2(Pt.x-V.x,-(Pt.z-V.z)):null,ae=zt>1?Math.atan2((Pt.y-V.y)*e.scale.y,zt):0,Ie=innerHeight/(2*Math.max(1,n.position.distanceTo(L))*Math.tan(43*Math.PI/360));K.update(L,re,ae,!w.paused&&w.pause<=0,tt,dt,Ie)}m((tt,dt)=>{if(!w||!R){K.visible&&K.hide();return}let Zt=Math.min(dt,64)/1e3;w.paused||Me(Zt),w&&yt(tt,Zt)}),s.addEventListener("gesturestart",Be);function ye(tt){let dt=Ze("button","route-card"+(tt.featured?" featured":""));return dt.type="button",dt.append(Ze("span","rc-by",tt.by),Ze("strong","",tt.name),Ze("span","rc-meta",`${tt.duration} \xB7 \u6B65\u884C ${Da(tt.walkM)} \xB7 \u722C\u5347 ${tt.climb} \u7C73`)),tt.fit&&dt.append(Ze("span","rc-fit","\u9002\u5408\uFF1A"+tt.fit)),dt.append(Ze("span","rc-path",tt.stops.map(Zt=>Zt.n).filter((Zt,Kt,te)=>te.indexOf(Zt)===Kt).join(" \u2192 "))),dt.onclick=()=>$e(tt.id),dt}function pe(){v.replaceChildren(...t.map(ye))}function he(tt){let dt=[],Zt=[],Kt=[],te=0;tt.legs.forEach((Ue,en)=>{Kt.push({s:te,i:en}),Ue.parts.forEach(hn=>{if(hn.mode==="bus")return;let pn=et(hn);pn.forEach((Rn,Tn)=>{(Tn||!dt.length)&&(dt.length&&(te+=Math.hypot(Rn.x-pn[Math.max(0,Tn-1)].x,Rn.z-pn[Math.max(0,Tn-1)].z)),dt.push(te),Zt.push(a(Rn.y-2.6)))})})}),Kt.push({s:te,i:tt.stops.length-1});let ct=300,V=64,Pt=Math.min(...Zt),zt=Math.max(...Zt),re=Math.max(40,zt-Pt),ae=Ue=>Ue/Math.max(1,te)*ct,Ie=Ue=>V-6-(Ue-Pt)/re*(V-16),Jt=dt.map((Ue,en)=>`${en?"L":"M"}${ae(Ue).toFixed(1)} ${Ie(Zt[en]).toFixed(1)}`).join(""),De=`<svg viewBox="0 0 ${ct} ${V}" preserveAspectRatio="none" aria-hidden="true"><path class="pf-area" d="${Jt}L${ct} ${V}L0 ${V}Z"/><path class="pf-line" d="${Jt}"/>${Kt.map(Ue=>{let en=dt.findIndex(pn=>pn>=Ue.s),hn=Ie(Zt[Math.max(0,en===-1?Zt.length-1:en)]);return`<circle cx="${ae(Ue.s).toFixed(1)}" cy="${hn.toFixed(1)}" r="3"/>`}).join("")}</svg>`,ze=Ze("div","route-profile");return ze.innerHTML=De,ze.append(Ze("span","pf-hi",`${Math.round(zt)} \u7C73`),Ze("span","pf-lo",`${Math.round(Pt)} \u7C73`),Ze("span","pf-cap","\u6CBF\u9014\u6D77\u62D4")),ze}function Ge(tt){let dt=tt.parts.map(ct=>ct.mode==="walk"?`\u6B65\u884C${tt.minutesBy!=="\u4F30\u7B97"&&tt.parts.length===1?"\u7EA6 "+tt.minutes:"\u7EA6 "+ct.minutes} \u5206\u949F \xB7 ${Da(ct.m)}${ct.up>=15?` \xB7 \u4E0A\u5761 ${ct.up} \u7C73`:ct.down>=15?` \xB7 \u4E0B\u5761 ${ct.down} \u7C73`:""}`:ct.mode==="bus"?`\u5750${ct.line}\u7EA6 ${ct.minutes} \u5206\u949F \xB7 ${Da(ct.m)}`:`\u5750${ct.line}\u7EA6 ${ct.minutes} \u5206\u949F`),Zt=tt.parts.flatMap(ct=>ct.segments||[]).filter(ct=>ct.estimated).reduce((ct,V)=>ct+V.m,0),Kt=tt.parts.at(-1)?.segments?.at(-1),te=Kt?.estimated?Kt.m:0;return dt.join("\uFF0C\u518D")+(Zt>=1?` \xB7 \u542B\u7EA6 ${Da(Zt)}\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF08\u672A\u6838\u5B9E\u901A\u884C${te>=10?`\uFF0C\u672B\u6BB5\u7EA6 ${Da(te)}`:""}\uFF09`:"")}function qt(tt){let dt=tt.parts.find(Zt=>Zt.mode!=="walk")?.mode;return dt==="bus"?m2:dt?p2:d2}function Ee(tt){p.replaceChildren();let dt=Ze("div","route-top"),Zt=Ze("button","route-back","\u5168\u90E8\u8DEF\u7EBF");Zt.type="button",Zt.onclick=tn,dt.append(Zt,Ze("span","rc-by",tt.by));let Kt=Ze("div","route-stats"),te=tt.walkMinutes>=60?`\u7EA6 ${(tt.walkMinutes/60).toFixed(1)} \u5C0F\u65F6`:`\u7EA6 ${tt.walkMinutes} \u5206\u949F`;for(let[De,ze]of[[tt.duration,"\u5168\u7A0B"],[Da(tt.walkM),"\u6B65\u884C"],[te,"\u6B65\u884C\u7528\u65F6"],[`${tt.climb} \u7C73`,"\u7D2F\u8BA1\u722C\u5347"]]){let Ue=Ze("span");Ue.append(Ze("b","",De),Ze("small","",ze)),Kt.append(Ue)}let ct=Ze("div","route-actions"),V=Ze("button","btn primary route-play");V.type="button",V.innerHTML=Cd,V.append("\u8DEF\u7EBF\u9884\u6F14"),V.onclick=()=>w&&!w.paused?Be():$t();let Pt=Ze("button","btn ghost");Pt.type="button",Pt.innerHTML=g2,Pt.append("\u770B\u5168\u7A0B"),Pt.onclick=on,ct.append(V,Pt);let zt=Ze("ol","route-steps");tt.stops.forEach((De,ze)=>{let Ue=Ze("li","rs-stop");Ue.dataset.i=ze;let en=Ze("button");en.type="button",en.onclick=()=>Ve(ze),en.append(Ze("span","rs-num",String(ze+1)),Ze("strong","",De.n)),De.note&&en.append(Ze("small","",De.note)),Ue.append(en),zt.append(Ue);let hn=tt.legs[ze];if(hn){let pn=Ze("li","rs-leg"),Rn=Ze("span","rs-icon");Rn.innerHTML=qt(hn);let Tn=Ze("span","rs-leg-text",Ge(hn));hn.note&&Tn.append(Ze("em","",hn.note)),pn.append(Rn,Tn),zt.append(pn)}});let re=Ze("ul","route-tips");for(let De of tt.tips)re.append(Ze("li","",De));let ae=Ze("details","more");ae.append(Ze("summary","","\u8D44\u6599\u4E0E\u4F9D\u636E")),ae.append(Ze("p","","\u7EBF\u8DEF\u6CBF\u5730\u56FE\u4E0A\u7684\u6B65\u9053\u3001\u53F0\u9636\u548C\u8857\u9053\u7ED8\u5236\uFF1B\u5730\u56FE\u7F3A\u5931\u5904\u3001\u70B9\u4F4D\u5230\u8DEF\u7F51\u3001\u7A7F\u8FC7\u5E7F\u573A\u548C\u5317\u95E8\u95E8\u697C\u7B49\u5F3A\u5236\u8FDE\u63A5\u6BB5\u6309\u76F4\u7EBF\u793A\u610F\uFF08\u865A\u7EBF\uFF09\uFF0C\u4E0D\u4EE3\u8868\u5B9E\u6D4B\u6216\u5DF2\u6838\u5B9E\u53EF\u901A\u884C\u9053\u8DEF\uFF0C\u8BF7\u4EE5\u73B0\u573A\u9053\u8DEF\u4E3A\u51C6\u3002\u6B65\u884C\u65F6\u95F4\u6309\u8DDD\u79BB\u548C\u5761\u5EA6\u4F30\u7B97\uFF08\u53F0\u9636\u7528\u65F6\u589E\u52A0\u4E09\u6210\uFF09\uFF0C\u6BCF\u4E2A\u4EBA\u5FEB\u6162\u4E0D\u540C\uFF1B\u6807\u201C\u4E1A\u4E3B\u63D0\u4F9B\u201D\u7684\u4E3A\u5C45\u4E4B\u6797\u4E1A\u4E3B\u7ED9\u51FA\u7684\u65F6\u95F4\u3002\u7F06\u8F66\u3001\u7D22\u9053\u548C\u666F\u4EA4\u8F66\u7684\u4E58\u5750\u65F6\u95F4\u6309\u7EBF\u8DEF\u957F\u5EA6\u4F30\u7B97\uFF0C\u4E0D\u542B\u6392\u961F\u3002\u5F00\u653E\u548C\u8FD0\u884C\u65F6\u95F4\u4EE5\u73B0\u573A\u516C\u793A\u4E3A\u51C6\u3002"));let Ie=Ze("div","links");for(let De of tt.sources)if(De.url){let ze=Ze("a","",De.name);ze.href=De.url,ze.target="_blank",ze.rel="noopener",Ie.append(ze)}else Ie.append(Ze("span","",De.name));ae.append(Ie);let Jt=Ze("p","route-summary route-legend","\u6A59\u8272\u5B9E\u7EBF\uFF1A\u5730\u56FE\u6B65\u9053\uFF1B\u6A59\u8272\u865A\u7EBF\uFF1A\u76F4\u7EBF\u793A\u610F\u63A5\u9A73\uFF0C\u672A\u6838\u5B9E\u53EF\u901A\u884C\uFF1B\u84DD\uFF0F\u7D2B\u865A\u7EBF\uFF1A\u4E58\u8F66\u6BB5\uFF08\u5176\u4E2D\u76F4\u7EBF\u63A5\u9A73\u89C1\u884C\u7A0B\u63D0\u793A\uFF09\u3002");p.append(dt,Ze("h3","route-title",tt.name),Kt,ct,Jt,Ze("p","route-summary",tt.summary),he(tt),zt,Ze("h4","","\u51FA\u53D1\u524D\u770B\u770B"),re,ae),p.scrollTop=0}function $e(tt){let dt=t.find(Kt=>Kt.id===tt);if(!dt)return;Be(),w=null,I=dt,at=-1,u("routes"),v.hidden=!0,p.hidden=!1,Ee(dt),Rt(dt),gn(dt),G="",ve();let Zt=sn(dt);o(Zt,1600),p.focus?.({preventScroll:!0})}function tn(){let tt=I,dt=p.contains(document.activeElement);Be(),h(),w=null,I=null,Xt(),T.replaceChildren(),p.hidden=!0,v.hidden=!1,ve(),dt&&tt&&v.children[t.indexOf(tt)]?.focus?.({preventScroll:!0})}function me(tt){let dt=tt.parts.find(Zt=>Zt.mode!=="walk");return`${dt?Lg[dt.mode].name:"\u6B65\u884C"} ${tt.minutes} \u5206\u949F`}function gn(tt){T.replaceChildren(),tt.stops.forEach((dt,Zt)=>{let Kt=Ze("li","rh-stop"+(Zt===0?" start":Zt===tt.stops.length-1?" end":""));Kt.dataset.i=Zt;let te=Ze("button");te.type="button",te.onclick=()=>Ve(Zt),te.append(Ze("span","rs-num",String(Zt+1)),Ze("span","rh-name",dt.n)),Kt.append(te),T.append(Kt);let ct=tt.legs[Zt];if(ct){let V=Ze("li","rh-leg");V.dataset.i=Zt;let Pt=Ze("span","rs-icon");Pt.innerHTML=qt(ct),V.append(Pt,Ze("span","",me(ct))),T.append(V)}})}let G="";function ue(tt){M.style.transform=`scaleX(${Math.max(0,Math.min(1,tt)).toFixed(4)})`}function ve(tt){i.onPlaybackChange?.();let dt=!!w&&!w.paused,Zt=dt?"\u6682\u505C\u9884\u6F14":w?"\u7EE7\u7EED\u9884\u6F14":"\u8DEF\u7EBF\u9884\u6F14",Kt=p.querySelector(".route-play");if(Kt&&(Kt.innerHTML=dt?Ig:Cd,Kt.append(Zt)),!I){x.hidden=!0;return}let te=I.stops.length,ct=w?w.stop:at,V=!!w?.moving,Pt=I.stops[Math.max(0,ct)],zt=I.stops[ct+1];x.querySelector("b").textContent=I.short;let re=(Jt,De,ze)=>{let Ue=Ze("span","rh-where",Jt),en=De?ze?[Ze("span","rh-note",De),Ue]:[Ue,Ze("span","rh-note",De)]:[Ue];w?.paused&&en.unshift(Ze("span","rh-note","\u5DF2\u6682\u505C \xB7\xA0")),x.querySelector("small").replaceChildren(...en)};w?V&&zt?re(`${be[w.mode]??"\u6B63\u5728"}\u524D\u5F80 ${zt.n}`):w.switching&&zt?re(`\xA0\xB7 \u524D\u5F80 ${zt.n}`,_e(w.fromMode,w.mode),!0):re(ct===0?`\u4ECE ${Pt.n} \u51FA\u53D1`:`${ct+1}/${te} \u5230\u8FBE ${Pt.n}`,w.swapped?`\xA0\xB7 ${_e(w.fromMode,w.mode)}`:""):re(ct>=0?`${ct+1}/${te} \xB7 ${Pt.n}`:tt?"\u9884\u6F14\u5B8C\u6BD5 \xB7 \u53EF\u518D\u770B\u4E00\u6B21":`${te} \u7AD9 \xB7 ${I.duration} \xB7 \u70B9 \u25B6 \u5F00\u59CB\u9884\u6F14`);let ae=x.querySelector(".rh-play");ae.innerHTML=dt?Ig:Cd,ae.setAttribute("aria-label",Zt),x.hidden=!1,x.classList.toggle("playing",dt),x.classList.toggle("live",!!w);for(let Jt of T.children){let De=+Jt.dataset.i,ze=Jt.classList.contains("rh-stop");Jt.classList.toggle("done",!!tt||De<ct),ze?(Jt.classList.toggle("current",De===ct),Jt.classList.toggle("next",!!w&&De===ct+1)):Jt.classList.toggle("moving",V&&De===ct)}ue(w?w.s/R.total:tt?1:ct>=0&&R?R.stopAt[ct]/R.total:0);let Ie=`${I.id}:${ct}:${!!w}`;if(Ie!==G&&x.offsetParent){G=Ie;let Jt=T.querySelector(`.rh-stop[data-i="${Math.max(0,ct)}"]`);if(Jt){let De=parseFloat(globalThis.getComputedStyle?.(T).paddingLeft??12);T.scrollTo?.({left:Math.max(0,Jt.offsetLeft-De),behavior:globalThis.matchMedia?.("(prefers-reduced-motion: reduce)").matches?"auto":"smooth"})}}}return x.querySelector(".rh-play").onclick=()=>w&&!w.paused?Be():$t(),x.querySelector(".rh-list").onclick=()=>{Be(),u("routes")},x.querySelector(".rh-close").onclick=tn,addEventListener("keydown",tt=>{tt.key==="Escape"&&w&&Be()}),pe(),{open:$e,close:tn,stopPreview:Be,startPreview:$t,updateLabels:It,get labelObjects(){return nt.map(tt=>tt.label)},get active(){return I},get previewing(){return!!w&&!w.paused},get canResume(){return!!w?.paused}}}var x2={\u53F2\u6599:"history",\u4FE1\u4EF0:"belief",\u4F20\u8BF4:"legend",\u5EFA\u7B51:"building",\u5730\u8C8C:"building",\u63D0\u793A:"tip"};function ai(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function Pd(i){return ai("span","kind k-"+(x2[i]||"tip"),i)}var y2=i=>/^1\d{10}$/.test(i)?`${i.slice(0,3)} ${i.slice(3,7)} ${i.slice(7)}`:i;function _2(i){let t=ai("p","guide-src");return t.append(ai("span","","\u6765\u6E90\uFF1A")),i.forEach((e,n)=>{let s=ai("a","",e.name);s.href=e.url,s.target="_blank",s.rel="noopener",t.append(s),n<i.length-1&&t.append("\uFF1B")}),t}function Ug(i){let t=ai("dl","guide-rows");for(let[e,n]of i)t.append(ai("dt","",e),ai("dd","",n));return t}function Ng(i,t){let e=i.guide;if(!e){t.replaceChildren(ai("p","empty","\u6E38\u89C8\u987B\u77E5\u6682\u65F6\u6CA1\u6709\u52A0\u8F7D\uFF0C\u5237\u65B0\u9875\u9762\u518D\u8BD5\u3002"));return}t.replaceChildren(ai("p","guide-intro",`\u51FA\u53D1\u524D\u770B\u770B \xB7 \u5B98\u65B9\u8D44\u6599 ${e.verified} \u6838\u9A8C`));for(let n of e.sections){let s=ai("details","guide-sec"),r=ai("summary"),a=ai("div","guide-body");s.dataset.id=n.id,r.append(ai("b","",n.title),ai("small","",n.teaser)),s.append(r,a);for(let[o,l]of n.paras||[]){let h=ai("p","story");h.append(Pd(o),l),a.append(h)}if(n.rows?.length&&a.append(Ug(n.rows)),n.transitHours&&i.transit&&a.append(ai("h4","","\u8FD0\u8425\u65F6\u95F4"),Ug([...i.transit.routes.map(o=>[o.name,o.hours]),...i.transit.cableways.map(o=>[o.name,o.hours+(o.phone?` \xB7 \u54A8\u8BE2 ${o.phone}`:"")])])),n.items?.length){let o=ai("ul","guide-list");for(let l of n.items)o.append(ai("li","",l));a.append(o)}if(n.phones?.length){let o=ai("ul","guide-phones");for(let[l,h,u]of n.phones){let f=ai("li"),m=ai("span","nums");for(let d of h){let y=ai("a","",y2(d));y.href="tel:"+d.replace(/\D/g,""),m.append(y)}f.append(ai("span","who",l),m),u&&f.append(ai("small","",u)),o.append(f)}a.append(o)}n.note&&a.append(ai("p","guide-note",n.note)),n.sources?.length&&a.append(_2(n.sources)),t.append(s)}}function Og(i,t){if(i?.model?.kind!=="entrance-checkpoint")return null;let[e,n]=i.model.front,s=Math.hypot(e,n),r=e/s,a=n/s,o=[i.x,i.z],l=t(...o)+.55,h=y=>(y=Math.max(0,Math.min(1,y)),y*y*(3-2*y)),u=(y,v)=>{let p=y-o[0],x=v-o[1];return[p*a-x*r,p*r+x*a]};return{origin:o,floor:l,fx:r,fz:a,local:u,world:(y,v)=>[o[0]+y*a+v*r,o[1]-y*r+v*a],outer:{x:18,z:14},height:(y,v,p)=>{if(Math.abs(y-o[0])>32||Math.abs(v-o[1])>32)return p;let[x,T]=u(y,v),M=(1-h((Math.abs(x)-10.3)/7.7))*(1-h((Math.abs(T)-6.2)/7.8));if(!M)return p;let C=l-.14-Math.min(.9,Math.max(0,T-2.7)*.45);return p+(C-p)*M},rotation:Math.atan2(r,a),viewAzimuth:Math.atan2(-r,a)*180/Math.PI}}function Fg(i,t,e,n,s){let r=[],a=[],o=[],l=i.outer.x*2,h=i.outer.z*2;for(let m=0;m<=h;m++)for(let d=0;d<=l;d++){let[y,v]=i.world(d-i.outer.x,m-i.outer.z);r.push(y,i.height(y,v,t(y,v)),v),a.push((y+e/2)/e,1-(v+n/2)/n)}for(let m=0;m<h;m++)for(let d=0;d<l;d++){let y=m*(l+1)+d,v=y+1,p=y+l+1,x=p+1;o.push(y,p,v,v,p,x)}let u=new Ln;u.setAttribute("position",new Qe(r,3)),u.setAttribute("uv",new Qe(a,2)),u.setIndex(o),u.computeVertexNormals();let f=new Je(u,s);return f.receiveShadow=!0,f}function v2(){let i=document.createElement("canvas");i.width=1024,i.height=512;let t=i.getContext("2d");t.textAlign="center",t.textBaseline="middle",t.fillStyle="#ff322b",t.font='700 76px "PingFang SC",sans-serif',t.shadowColor="#ef1d16",t.shadowBlur=3,t.fillText("\u4E5D\u534E\u5C71\u98CE\u666F\u533A\u6B22\u8FCE\u60A8",512,48),t.shadowBlur=0,t.fillStyle="#d9cd8f",t.font='700 174px "Kaiti SC","STKaiti","Songti SC",serif',["\u4E5D","\u83EF","\u5C71"].forEach((n,s)=>t.fillText(n,s*224+112,208));let e=new as(i);return e.colorSpace=kn,e.anisotropy=4,new os({map:e,transparent:!0,alphaTest:.16,side:mn,toneMapped:!1})}function Bg(i,t,{signs:e=!0}={}){let n=new Pn;n.position.set(i.origin[0],i.floor,i.origin[1]),n.rotation.y=i.rotation,n.userData.landmark="\u666F\u533A\u68C0\u7968\u53E3";let s=new Ri(1,1,1),r=t("#40332d"),a=t("#373c3a"),o=t("#b9b2a4"),l=t("#9caeae"),h=t("#192626"),u=t("#e5dfcb"),f=t("#658b90"),m=t("#205b9c"),d=(y,v,p,x,T,M,C)=>{let P=new Je(s,C);return P.position.set(y,v+T/2,p),P.scale.set(x,T,M),P.castShadow=P.receiveShadow=!0,n.add(P),P};d(0,-.3,-.65,19.2,.3,7.5,o);for(let y=0;y<5;y++)d(0,-1.3,3.3+y*.4,19.2,1.3-(y+1)*.18,.4,o);d(0,-1.16,5.65,19.2,.15,1.1,o);for(let y of[-9.1,-4.2,4.2,9.1]){let v=Math.abs(y)<5?5.4:4.65;d(y,0,2.7,.7,.8,.7,o),d(y,.8,2.7,.46,v-.8,.46,r),d(y,0,-3.7,.38,3.9,.38,r)}d(0,3.85,-.5,18.8,.2,6.6,a);for(let[y,v,p]of[[0,9.6,5.4],[-6.9,5.7,4.65],[6.9,5.7,4.65]])d(y,p-.35,2.7,v-.6,.35,.5,r),d(y,p,2.8,v,.28,1.65,a);d(0,3.65,2.7,18.4,.23,.32,r),d(0,4.32,3.025,7.95,.93,.18,r),d(0,4.39,3.125,7.72,.78,.035,h);for(let y of[-2.85,0,2.85])d(y,5.68,2.7,.065,1.08,.065,h);for(let y of[-3.1,-1.1,.9,2.9])d(y,0,.35,.38,.98,1.55,l),d(y,.98,.35,.4,.1,1.6,h);for(let y of[-8.5,-5.6]){for(let v of[-3.1,-.6,1.9])d(y,0,v,.065,1.05,.065,h);d(y,1,-.6,.07,.085,5.2,h)}if(d(6.6,0,-.5,3.7,2.65,4.7,u),d(6.6,1.02,1.867,3.38,1.34,.04,f),d(4.73,1.02,-.5,.04,1.34,4.34,f),d(6.6,1,1.904,.09,1.4,.07,r),d(6.6,2.65,-.5,4,.19,4.95,a),d(5.55,0,2.35,.82,1.68,.6,m),d(5.55,1,2.66,.65,.48,.035,u),d(5.55,1.08,2.688,.44,.27,.018,h),e){let y=v2(),v=(p,x,T,M,C,P,I,z,nt)=>{let R=new _s(M,C),w=R.attributes.uv;for(let wt=0;wt<w.count;wt++)w.setXY(wt,(P+w.getX(wt)*z)/1024,1-(I+(1-w.getY(wt))*nt)/512);let at=new Je(R,y);at.position.set(p,x,T),n.add(at)};v(0,4.8,3.152,7.35,.69,0,0,1024,96),[-2.85,0,2.85].forEach((p,x)=>v(p,6.55,2.74,1.85,1.85,x*224,112,224,208))}return n.userData.checkpoint={width:19.2,depth:10.65,height:7.5,steps:5,validators:4,approximateDimensions:!0},n}function zg(i,{cellSize:t=400,enterDistance:e=2100,exitDistance:n=2500}={}){let s=i.geometry,r=s.attributes.position,a=s.index;if(Array.isArray(i.material)||s.groups.length||!r)return null;let o=a?a.count:r.count,l=new Map,h=new X;for(let y=0;y<o;y+=3){let v=a?a.getX(y):y,p=a?a.getX(y+1):y+1,x=a?a.getX(y+2):y+2,T=(r.getX(v)+r.getX(p)+r.getX(x))/3,M=(r.getZ(v)+r.getZ(p)+r.getZ(x))/3,C=Math.floor(T/t)+","+Math.floor(M/t),P=l.get(C);P||(P={indices:[],box:new es},l.set(C,P)),P.indices.push(v,p,x);for(let I of[v,p,x])P.box.expandByPoint(h.fromBufferAttribute(r,I))}let u=[];for(let{indices:y,box:v}of l.values()){let p=new Ln;for(let[C,P]of Object.entries(s.attributes))p.setAttribute(C,P);p.setIndex(y);let x=v.getCenter(new X),T=0;for(let C of y)T=Math.max(T,h.fromBufferAttribute(r,C).distanceToSquared(x));p.boundingBox=v,p.boundingSphere=new ys(x,Math.sqrt(T));let M=new Je(p,i.material);M.castShadow=i.castShadow,M.receiveShadow=i.receiveShadow,M.renderOrder=i.renderOrder,M.layers.mask=i.layers.mask,M.matrixAutoUpdate=!1,M.visible=!1,M.raycast=()=>{},i.add(M),u.push(M)}let f={...s.drawRange},m=i.raycast;i.raycast=function(y,v){if(!this.visible)return;let{start:p,count:x}=s.drawRange;s.setDrawRange(f.start,f.count);try{m.call(this,y,v)}finally{s.setDrawRange(p,x)}};let d=!1;return{mesh:i,chunks:u,get near(){return d},update(y){let v=d?y<n:y<e;if(v===d)return!1;d=v,s.setDrawRange(f.start,d?0:f.count);for(let p of u)p.visible=d;return!0}}}function M2(i){let t=i.filter(s=>Number.isFinite(s)&&s>0).sort((s,r)=>s-r);if(!t.length)return{mean:0,p90:0,slow:!1,fast:!1};let e=t.reduce((s,r)=>s+r,0)/t.length,n=t[Math.min(t.length-1,Math.floor(t.length*.9))];return{mean:e,p90:n,slow:e>34||n>50,fast:e<19.5&&n<24}}var Jh=class{constructor(t){this.setCeiling(t,!0)}setCeiling(t,e=!1){this.ceiling=t,this.floor=Math.min(1,t),this.limit=e?t:Math.max(this.floor,Math.min(this.limit,t)),e&&(this.holdUntil=0,this.recoverAfter=0)}pixelRatio(t=!1){return t?this.ceiling:this.limit}observe(t,e){let n=M2(t);if(!n.mean||e<this.holdUntil)return{...n,action:"hold"};let s="hold";return n.slow?(this.recoverAfter=e+15e3,this.limit>this.floor+.01?(this.limit=Math.max(this.floor,Math.round((this.limit-.25)*100)/100),this.holdUntil=e+2500,s="resolution-down"):s="tier-down"):n.fast&&e>=this.recoverAfter&&this.limit<this.ceiling-.01&&(this.limit=Math.min(this.ceiling,Math.round((this.limit+.25)*100)/100),this.holdUntil=e+4e3,this.recoverAfter=e+15e3,s="resolution-up"),{...n,action:s}}};var kg="button,a,input,select,textarea,label,summary";function Hg({compact:i,closePanel:t=null}){let e=P=>document.querySelector(P),n=e("#panel"),s=e("#card"),r=e("#settings"),a=r?.querySelector(".settings-wrap"),o=0,l=()=>{dispatchEvent(new Event("sheetchange")),clearTimeout(o),o=setTimeout(()=>dispatchEvent(new Event("sheetchange")),500)},h=[{el:n,watch:n,grow:!0,open:()=>!n.classList.contains("closed"),close:()=>t?t():e("#panel-close")?.click(),grab:(P,I)=>P.closest(".sheet-grip")?"grip":P.closest(kg)?null:I<24?"grip":P.closest(".panel-head")?"head":null},{el:s,watch:s,grow:!0,open:()=>s.classList.contains("show"),close:()=>s.querySelector(":scope > .close")?.click(),grab:(P,I)=>P.closest("button,input,select,textarea,label,summary")?null:I<24?"grip":P.closest(".card-head")?P.closest("a")?null:"head":P.closest(".card-hero")?"hero":null},{el:a,watch:r,grow:!1,open:()=>!r.classList.contains("collapsed"),close:()=>e("#settings-toggle")?.click(),grab:(P,I)=>P.closest(kg)?null:I<24||P.closest(".settings-head")?"head":null}].filter(P=>P.el&&P.watch),u=P=>P.open()&&i()&&P.el.offsetWidth>innerWidth*.6,f=null,m=0,d=P=>{P.style.transition="",P.style.transform=""},y=P=>{try{f.s.el.setPointerCapture(P.pointerId)}catch{}},v=()=>{let P=f.trail[0],I=f.trail[f.trail.length-1];return I[0]>P[0]?(I[1]-P[1])/(I[0]-P[0]):0},p=P=>{let I=P.timeStamp;for(f.trail.push([I,P.clientY]);f.trail.length>2&&I-f.trail[0][0]>100;)f.trail.shift()};function x(P,I){if(I.isPrimary&&I.button===0&&(m=0),f||!I.isPrimary||I.button!==0||!(I.target instanceof Element)||!u(P))return;let z=P.grab(I.target,I.clientY-P.el.getBoundingClientRect().top);z&&(f={s:P,kind:z,id:I.pointerId,x0:I.clientX,y0:I.clientY,drag:!1,trail:[[I.timeStamp,I.clientY]],expanded:P.el.classList.contains("expanded")},z!=="hero"&&y(I))}function T(P){if(!f||P.pointerId!==f.id)return;let I=P.clientX-f.x0,z=P.clientY-f.y0;if(!f.drag){if(Math.hypot(I,z)<8)return;if(f.kind==="hero"&&Math.abs(z)<=Math.abs(I)){f=null;return}f.drag=!0,y(P),f.s.el.style.transition="none"}p(P);let nt=f.s.grow&&!f.expanded,R=z>=0?z:nt?z>-40?z:Math.max(-64,-40+(z+40)*.2):Math.max(-40,z*.35);f.s.el.style.transform=`translateY(${R}px)`}function M(P){if(!f||P.pointerId!==f.id)return;let{s:I,kind:z,drag:nt,expanded:R}=f;if(!nt){f=null,z==="grip"&&I.grow&&(m=performance.now()+350,I.el.classList.toggle("expanded"),l());return}p(P);let w=P.clientY-f.y0,at=v(),wt=I.el.offsetHeight;f=null,d(I.el),w>0&&(w>90||at>.6)?R&&I.grow&&w<=wt*.45?(I.el.classList.remove("expanded"),l()):I.close():w<0&&I.grow&&!R&&(w<-50||at<-.5)&&(I.el.classList.add("expanded"),l()),m=performance.now()+350}function C(P){!f||P.pointerId!==f.id||(f.drag&&d(f.s.el),f=null)}for(let P of h){P.el.addEventListener("pointerdown",nt=>x(P,nt)),P.el.addEventListener("pointermove",T),P.el.addEventListener("pointerup",M),P.el.addEventListener("pointercancel",C),P.el.addEventListener("click",nt=>{nt.detail===0&&!nt.pointerType||performance.now()<m&&(m=0,nt.preventDefault(),nt.stopPropagation())},!0),P.el.addEventListener("dragstart",nt=>{f?.s===P&&nt.preventDefault()}),P.grow||P.el.addEventListener("touchmove",nt=>{f?.s===P&&f.kind!=="hero"&&nt.preventDefault()},{passive:!1});let I=P.open(),z=0;new MutationObserver(()=>{let nt=P.open();nt!==I&&(I=nt,clearTimeout(z),nt?z&&(z=0,P.el.classList.remove("expanded"),l()):(f?.s===P&&(d(P.el),f=null),P.el.classList.contains("expanded")&&(z=setTimeout(()=>{z=0,P.open()||(P.el.classList.remove("expanded"),l())},480))))}).observe(P.watch,{attributes:!0,attributeFilter:["class"]})}}var Gt=i=>document.querySelector(i),Zi=i=>[...document.querySelectorAll(i)],Kh={get(i){try{return localStorage.getItem("jiuhua."+i)}catch{return null}},set(i,t){try{localStorage.setItem("jiuhua."+i,t)}catch{}}},Xn=(i,t,e)=>Math.min(e,Math.max(t,i)),Ui=i=>()=>{i|=0,i=i+1831565813|0;let t=Math.imul(i^i>>>15,1|i);return t=t+Math.imul(t^t>>>7,61|t)^t,((t^t>>>14)>>>0)/4294967296};function Ae(i,t,e){let n=document.createElement(i);return t&&(n.className=t),e!==void 0&&(n.textContent=e),n}function Ua(i){clearTimeout(i._t),i.hidden=!1,i.offsetWidth,i.classList.add("show")}function Fo(i,t=440){i.classList.remove("show"),clearTimeout(i._t),i._t=setTimeout(()=>{i.classList.contains("show")||(i.hidden=!0)},t)}function jh(i){let t=Gt("#toast");t.textContent=i,Ua(t),clearTimeout(jh.t),jh.t=setTimeout(()=>Fo(t,400),3200)}function Ld(i){let t=Ae("div","photo-credit"),e=[i.author&&`\u6444\u5F71\uFF1A${i.author}`,i.takenAt&&`\u62CD\u6444\u4E8E ${i.takenAt}`].filter(Boolean).join(" \xB7 ");e&&t.append(Ae("span","",e+" \xB7 "));for(let[n,s]of[[i.sourceName||"\u56FE\u7247\u51FA\u5904",i.sourceUrl],[i.license,i.licenseUrl]]){if(!n||!s)continue;let r=Ae("a","",n);r.href=s,r.target="_blank",r.rel="noopener noreferrer",t.lastChild?.tagName==="A"&&t.append(" \xB7 "),t.append(r)}return t}function Vg({reducedMotion:i,onToggle:t,focusLost:e,restoreFocus:n,fallbackFocus:s}){function r(o,l,h="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",u=[],f=document.activeElement){let m=Gt("#viewer"),d=m.querySelector(".viewer-strip"),y=m.querySelector(".viewer-count"),v=m.querySelector(".viewer-prev"),p=m.querySelector(".viewer-next");m.classList.contains("show")||(m._opener=f),m.setAttribute("aria-label",h+"\u7167\u7247");let x=m.querySelector(".viewer-caption");x||(x=Ae("div","viewer-caption"),x.onclick=P=>P.stopPropagation(),m.append(x)),d.replaceChildren(...o.map((P,I)=>{let z=Ae("div","slide"),nt=Ae("img");return nt.src=P,nt.alt=u[I]?.alt||h+" \xB7 "+(I+1),z.append(nt),z}));let T=()=>Xn(Math.round(d.scrollLeft/Math.max(1,d.clientWidth)),0,o.length-1),M=()=>{let P=T();y.textContent=`${P+1} / ${o.length}`,x.replaceChildren();let I=u[P];x.hidden=!I,I&&(x.append(Ae("span","",I.alt)),I.sourceUrl&&x.append(Ld(I)));let z=document.activeElement;v.hidden=p.hidden=o.length<2,v.disabled=P===0,p.disabled=P===o.length-1,(z===v&&v.disabled||z===p&&p.disabled)&&(p.disabled&&v.disabled?m.querySelector(".viewer-close"):z===v?p:v).focus({preventScroll:!0})};d.onscroll=M;let C=P=>d.scrollTo({left:Xn(T()+P,0,o.length-1)*d.clientWidth,behavior:i?"auto":"smooth"});m._go=C,v.onclick=P=>{P.stopPropagation(),C(-1)},p.onclick=P=>{P.stopPropagation(),C(1)},m.onclick=a,Ua(m),d.scrollLeft=l*d.clientWidth,M(),t(),m.querySelector(".viewer-close").focus({preventScroll:!0})}function a(){let o=Gt("#viewer"),l=o._opener,h=o.contains(document.activeElement);o._opener=null,Fo(o,260),t(),(h||e())&&n(l,s())}return{open:r,close:a}}function Gg({W:i,D:t,stats:e,transit:n,places:s}){let r=s.filter(o=>o.searchable&&["service","transport"].includes(o.category)).length,a=s.filter(o=>["sight","nature","village"].includes(o.category)).length;return`<p>\u672C\u6B21\u66F4\u65B0\uFF1A2026 \u5E74 9 \u6708 28 \u65E5\u3002\u8986\u76D6\u7EA6 ${(i/1e3).toFixed(2)} \xD7 ${(t/1e3).toFixed(2)} \u516C\u91CC\uFF0C\u91CD\u70B9\u4E3A\u4E5D\u534E\u8857\u3001\u767E\u5C81\u5BAB\u3001\u95F5\u56ED\u3001\u5929\u53F0\u4E0E\u82B1\u53F0\u3002\u5B83\u662F\u4F9D\u636E\u516C\u5F00\u8D44\u6599\u91CD\u5EFA\u7684\u53EF\u4EA4\u4E92\u6A21\u578B\uFF0C\u4E0D\u662F\u503E\u659C\u6444\u5F71\u6216\u5B9E\u6D4B\u6210\u679C\u3002</p>
<table><tr><th>\u5185\u5BB9</th><th>\u4F9D\u636E\u4E0E\u7CBE\u5EA6</th></tr>
<tr><td>\u5C45\u4E4B\u6797\u6C11\u5BBF</td><td>\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u4E0E\u822A\u62CD\u56FE\u624B\u5DE5\u5EFA\u6A21\uFF1B\u73B0\u6709\u536B\u661F\u5F71\u50CF\u65E9\u4E8E\u65B0\u5EFA\uFF0C\u843D\u4F4D\u6309\u95E8\u724C\u987A\u5E8F\u4F30\u8BA1\uFF0C\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002</td></tr>
<tr><td>${e.buildings} \u4E2A\u5EFA\u7B51\u8F6E\u5ED3</td><td>${e.osmBuildings} \u4E2A OpenStreetMap \u8F6E\u5ED3 + ${e.supplementaryBuildings} \u4E2A Overture \u5F71\u50CF\u8BC6\u522B\u8865\u5145\u8F6E\u5ED3\u3002\u697C\u5C42\u3001\u5899\u8272\u3001\u74E6\u8272\u3001\u9A6C\u5934\u5899\u3001\u62AB\u6A90\u3001\u5E97\u9762\u6309\u7247\u533A\u89C4\u5F8B\u5206\u914D\uFF08${e.levelsRankedByGlobfp||0} \u680B\u7684\u697C\u5C42\u9AD8\u4F4E\u987A\u5E8F\u53C2\u8003 3D-GloBFP \u4F30\u7B97\u9AD8\u5EA6\uFF09\uFF0C\u89C4\u5F8B\u6765\u81EA\u89C4\u5212\u6587\u4EF6\u4E0E\u516C\u5F00\u7167\u7247\uFF0C\u9010\u680B\u672A\u5B9E\u6D4B\u3002\u70B9\u5EFA\u7B51\u53EF\u770B\u4F9D\u636E\u3002</td></tr>
<tr><td>\u5730\u70B9\u6807\u6CE8</td><td>\u5BFA\u5E99 ${e.temples} \xB7 \u666F\u70B9\u5C71\u6C34\u4E0E\u6751\u843D ${a} \xB7 \u516C\u5171\u8BBE\u65BD ${r}\uFF08\u8F66\u7AD9\u3001\u7D22\u9053\u3001\u505C\u8F66\u573A\u3001\u516C\u5395\u3001\u6E38\u5BA2\u4E2D\u5FC3\u3001\u6D3E\u51FA\u6240\u3001\u533B\u9662\u7B49\uFF09\uFF1B\u53E6\u6709 ${e.halls} \u5904\u6BBF\u5802\u5C0F\u6807\u6CE8\u3002\u591A\u4E2A\u5E73\u53F0\u7684\u540C\u4E00\u5730\u70B9\u5DF2\u5408\u5E76\u3002\u9664\u5C45\u4E4B\u6797\u5916\uFF0C\u5730\u56FE\u4E0D\u6807\u6CE8\u5546\u5BB6\u3002</td></tr>
<tr><td>\u771F\u5B9E\u5730\u5F62</td><td>Copernicus GLO-30\uFF082011\u20132015 \u96F7\u8FBE\u6D4B\u91CF\uFF09\uFF0C257\xD7257 \u7F51\u683C\u7EA6 21 m \u95F4\u8DDD\uFF1B\u4E0E SRTM \u76F8\u6BD4\u5CF0\u9876\u548C\u7D22\u9053\u9AD8\u5DEE\u66F4\u63A5\u8FD1\u5B98\u65B9\u6570\u636E\u3002\u5C40\u90E8\u4E0E\u5176\u4ED6\u9AD8\u7A0B\u6E90\u76F8\u5DEE 30 m \u4EE5\u4E0A\u7684\u683C\u70B9\u53D6\u56DB\u6E90\u4E2D\u4F4D\u6570\u3002\u4ECD\u662F\u8868\u9762\u6A21\u578B\uFF08\u542B\u6811\u51A0\uFF09\u3002</td></tr>
<tr><td>\u4E3B\u8981\u5BFA\u9662</td><td>\u5316\u57CE\u5BFA\u3001\u7947\u56ED\u5BFA\u3001\u8089\u8EAB\u5B9D\u6BBF\u3001\u767E\u5C81\u5BAB\u3001\u65C3\u6A80\u7985\u6797\u7B49\u7684\u5899\u8272\u3001\u74E6\u8272\u3001\u5C4B\u9876\u5F62\u5F0F\u4F9D\u636E\u5B98\u65B9\u89C4\u5212\u3001\u516C\u5F00\u7167\u7247\u4E0E\u536B\u661F\u5F71\u50CF\uFF1B\u6BBF\u4F53\u6BD4\u4F8B\u3001\u7EC6\u90E8\u4ECD\u5C5E\u590D\u539F\u3002</td></tr></table>
<h3>\u666F\u533A\u4EA4\u901A\uFF08\u5B98\u7F51 ${n?.retrieved||""}\uFF09</h3>${(n?.routes||[]).map(o=>`<p><b>${o.name}</b>\u3000${o.hours}<br><small>${o.stops.join(" \u2192 ")}${o.note?"\u3002"+o.note:""}</small></p>`).join("")}<p>${(n?.cableways||[]).map(o=>`${o.name} ${o.hours}`).join("\u3000\xB7\u3000")}<br><small>\u65C5\u6E38\u54A8\u8BE2 ${n?.hotlines?.\u65C5\u6E38\u54A8\u8BE2\u6295\u8BC9||""} \xB7 \u7D27\u6025\u6551\u63F4 ${n?.hotlines?.\u7D27\u6025\u6551\u63F4||""} \xB7 \u5C1A\u65E0\u516C\u5F00\u5750\u6807\u7684\u7AD9\u70B9\uFF1A${(n?.unlocatedStops||[]).join("\u3001")}</small></p>
<h3>\u5750\u6807\u4E0E\u6570\u636E\u8D28\u91CF</h3><p>\u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u7B49\u5E73\u53F0\u7684 GCJ-02 \u5750\u6807\u5747\u7528 coordtransform \u6362\u7B97\u4E3A WGS84\uFF0C\u539F\u59CB\u5750\u6807\u4FDD\u5B58\u5728\u6570\u636E\u4E2D\uFF1B\u6BCF\u4E2A\u6570\u636E\u96C6\u90FD\u7ECF\u8FC7\u72EC\u7ACB\u62BD\u68C0\u3002\u7EF4\u57FA\u6570\u636E\u7B49\u5F00\u653E\u6570\u636E\u4E2D\u7EA6 1 km \u504F\u79FB\u7684\u5BFA\u5E99\u70B9\uFF08\u767E\u5EA6\u5750\u6807\u8BEF\u6807\u4E3A WGS84\uFF09\u672A\u7528\u4E8E\u5B9A\u4F4D\u3002\u5730\u70B9\u5B9A\u4F4D\u4F9D\u636E\u53EF\u5728\u7B80\u4ECB\u5361\u7684\u201C\u8D44\u6599\u4E0E\u4F9D\u636E\u201D\u4E2D\u67E5\u770B\u3002</p>
<h3>\u8D44\u6599\u4E0E\u8BB8\u53EF</h3><p><a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap contributors / ODbL</a> \xB7 <a href="https://docs.overturemaps.org/attribution/" target="_blank" rel="noopener">Overture Maps\uFF1A\u5EFA\u7B51 ODbL\uFF1B\u5730\u70B9 CDLA-Permissive 2.0</a> \xB7 <a href="https://spacedata.copernicus.eu/collections/copernicus-digital-elevation-model" target="_blank" rel="noopener">Copernicus DEM GLO-30 \xA9 DLR e.V. 2010-2014 and \xA9 Airbus Defence and Space GmbH 2014-2018\uFF0C\u7531 ESA \u5728 Copernicus \u8BA1\u5212\u4E0B\u63D0\u4F9B</a> \xB7 <a href="https://www.jiuhuashan.gov.cn/file_cz/54/202506/202506269aaa0b14711f440284eefd14e047a66e.pdf" target="_blank" rel="noopener">\u4E5D\u534E\u5C71\u5B98\u65B9\u5730\u8D28\u516C\u56ED\u89C4\u5212</a> \xB7 <a href="https://doi.org/10.5194/essd-16-5357-2024" target="_blank" rel="noopener">3D-GloBFP \u5EFA\u7B51\u9AD8\u5EA6\uFF08Che \u7B49 2024\uFF0CCC BY 4.0\uFF09</a>\uFF0C\u4EC5\u7528\u4E8E\u540C\u7247\u533A\u5185\u697C\u5C42\u9AD8\u4F4E\u6392\u5E8F \xB7 \u53BB\u54EA\u513F\u3001360 \u5730\u56FE\u516C\u5F00\u9875\u9762\uFF08\u9010\u6761\u94FE\u63A5\u89C1\u5730\u70B9\u5361\u7247\uFF09</p><p>\u8865\u5145\u5EFA\u7B51\u7531 Qian Shi \u7B49\u7684\u4E1C\u4E9A\u5EFA\u7B51\u6570\u636E\u7ECF Overture \u63D0\u4F9B\uFF0C\u539F\u59CB\u6570\u636E\u4E3A <a href="https://doi.org/10.5281/zenodo.8174931" target="_blank" rel="noopener">CC BY 4.0</a>\uFF1B\u672C\u9879\u76EE\u505A\u4E86\u88C1\u526A\u3001\u53BB\u91CD\u4E0E\u5C4B\u9876\u91CD\u5EFA\u3002\u5B98\u65B9\u7167\u7247\u4E0E\u516C\u5F00\u7167\u7247\u4EC5\u7528\u4E8E\u5F52\u7EB3\u5916\u89C2\u89C4\u5F8B\uFF0C\u672A\u4F5C\u4E3A\u8D34\u56FE\u3002</p>`}var Ul=i=>getComputedStyle(document.documentElement).getPropertyValue(i).trim(),Qh=/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;function oo(i,t,e,n,s,r){r=Math.max(0,Math.min(r,n/2,s/2)),i.beginPath(),i.roundRect?i.roundRect(t,e,n,s,r):(i.moveTo(t+r,e),i.arcTo(t+n,e,t+n,e+s,r),i.arcTo(t+n,e+s,t,e+s,r),i.arcTo(t,e+s,t,e,r),i.arcTo(t,e,t+n,e,r),i.closePath())}function tu(i,t,e,n){let s=t&&t!=="none"&&t.match(Qh);if(s&&s.length>1){let r=+(t.match(/([\d.]+)deg/)?.[1]??180)*Math.PI/180,a=Math.sin(r),o=-Math.cos(r),l=(Math.abs(n.width*a)+Math.abs(n.height*o))/2,h=n.x+n.width/2,u=n.y+n.height/2,f=i.createLinearGradient(h-a*l,u-o*l,h+a*l,u+o*l);return f.addColorStop(0,s[0]),f.addColorStop(1,s.at(-1)),f}return!e||/^transparent$|^rgba\(.*,\s*0\)$/.test(e)?null:e}function eu(i,t,e,n,s){for(let r of t)i.fillText(r,e,n),e+=i.measureText(r).width+s;return e}var Wg=(i,t,e)=>i.measureText(t).width+[...t].length*e;function Xg(i,t,e,n){let s=parseFloat(t.borderTopLeftRadius)||0,r=tu(i,t.backgroundImage,t.backgroundColor,e),a=parseFloat(t.borderTopWidth)||0,o=t.boxShadow==="none"?[]:t.boxShadow.split(/,(?![^(]*\))/).filter(l=>!/inset/.test(l)).map(l=>({col:l.match(Qh)?.[0]||"transparent",v:l.replace(Qh,"").trim().split(/\s+/).map(parseFloat)}));for(let l of o)!l.v[2]&&l.v[3]>0&&(oo(i,e.x+l.v[0]-l.v[3],e.y+l.v[1]-l.v[3],e.width+2*l.v[3],e.height+2*l.v[3],s+l.v[3]),i.fillStyle=l.col,i.fill());if(r){let l=o.filter(h=>h.v[2]>0).sort((h,u)=>u.v[2]-h.v[2])[0];i.save(),l&&(i.shadowColor=l.col,i.shadowBlur=l.v[2]*n*.8,i.shadowOffsetX=l.v[0]*n,i.shadowOffsetY=l.v[1]*n),oo(i,e.x,e.y,e.width,e.height,s),i.fillStyle=r,i.fill(),i.restore()}a&&t.borderTopStyle!=="none"&&tu(i,"none",t.borderTopColor,e)&&(i.lineWidth=a,i.strokeStyle=t.borderTopColor,i.setLineDash(t.borderTopStyle==="dashed"?[3,2]:[]),oo(i,e.x+a/2,e.y+a/2,e.width-a,e.height-a,s-a/2),i.stroke(),i.setLineDash([]))}function qg(i,t,e){for(let n of t.childNodes){if(n.nodeType===3){let a=n.textContent;if(!a.trim())continue;let o=getComputedStyle(t),l=document.createRange();l.selectNodeContents(n);let h=l.getBoundingClientRect(),u=parseFloat(o.letterSpacing)||0,f=h.y+h.height/2;if(i.font=`${o.fontStyle} ${o.fontWeight} ${o.fontSize} ${o.fontFamily}`,i.textAlign="left",i.textBaseline="middle",i.fillStyle=o.color,o.textShadow!=="none"){i.save(),i.shadowColor="rgba(255,255,255,.95)";for(let m of[3,9])i.shadowBlur=m*e,eu(i,a,h.x,f,u);i.restore()}eu(i,a,h.x,f,u);continue}if(n.nodeType!==1)continue;let s=getComputedStyle(n);if(s.display==="none"||s.visibility==="hidden"||+s.opacity<.05)continue;let r=n.getBoundingClientRect();if(n.tagName.toLowerCase()==="svg"){let a=n.viewBox?.baseVal,o=n.querySelector("path");o&&a?.width&&(i.save(),i.translate(r.x,r.y),i.scale(r.width/a.width,r.height/a.height),i.fillStyle=s.fill,i.fill(new Path2D(o.getAttribute("d"))),i.restore());continue}Xg(i,s,r,e),qg(i,n,e)}}function b2(i,t,e,n){let s=t.querySelector("button"),r=getComputedStyle(s),a=s.getBoundingClientRect();if(!a.width||r.visibility==="hidden"||a.x<0||a.y<0||a.right>innerWidth||a.bottom>n)return;let o=t.querySelector("i"),l=o&&getComputedStyle(o);if(l&&l.display!=="none"){let f=getComputedStyle(o,"::after"),m=parseFloat(f.width)||0;i.save();let d,y;if(t.classList.contains("pin")){let v=t.getBoundingClientRect();d=v.x+v.width/2,y=v.bottom;let p=Xn(d,a.x,a.right),x=Xn(y,a.y,a.bottom);if(Math.hypot(p-d,x-y)>=3){let T=parseFloat(l.height)||1.5,M=l.boxShadow.match(/rgba?\([^)]*\)/);i.lineCap="round",M&&(i.strokeStyle=M[0],i.lineWidth=T+1.5,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()),i.strokeStyle=l.backgroundColor,i.lineWidth=T,i.beginPath(),i.moveTo(d,y),i.lineTo(p,x),i.stroke()}}else{let v=o.getBoundingClientRect();i.globalAlpha=t.classList.contains("route-stop")?+l.opacity:1,i.fillStyle=tu(i,l.backgroundImage,l.backgroundColor,v)||"transparent",i.fillRect(v.x,v.y,v.width,v.height),d=v.x+v.width/2,y=v.bottom-(parseFloat(f.bottom)||0)-m/2}if(m){let v=f.boxShadow.match(/(rgba?\([^)]*\)) 0px 0px 0px ([\d.]+)px/);v&&(i.fillStyle=v[1],i.beginPath(),i.arc(d,y,m/2+ +v[2],0,7),i.fill()),i.fillStyle=f.backgroundColor,i.beginPath(),i.arc(d,y,m/2,0,7),i.fill()}i.restore()}Xg(i,r,a,e);let h=getComputedStyle(s,"::before"),u=parseFloat(h.width)||0;u&&h.display!=="none"&&h.content!=="none"&&(i.fillStyle=h.backgroundColor,i.beginPath(),i.arc(a.x+(parseFloat(r.borderLeftWidth)||0)+(parseFloat(r.paddingLeft)||0)+u/2,a.y+a.height/2,u/2,0,7),i.fill()),qg(i,s,e)}function Yg({frame:i,stats:t,render:e}){let n=innerWidth,s=innerHeight,r=Math.min(2,Math.max(devicePixelRatio||1,i.width/n)),a=document.createElement("canvas");a.width=Math.round(n*r),a.height=Math.round(s*r);let o=a.getContext("2d"),l=Ul("--sans")||"sans-serif",h=Ul("--serif")||"serif",u=Ul("--ink")||"#1c2a25",f=Ul("--muted")||"#5c6962";o.font=`10.5px ${l}`;let m=[];for(let et of[["\xA9 OpenStreetMap contributors","Overture Maps Foundation","Copernicus DEM (ESA)","\u53BB\u54EA\u513F/360\u5730\u56FE/OSM \u516C\u5F00\u5730\u70B9"],["\u8865\u5145\u8F6E\u5ED3\uFF1AQian Shi \u7B49 / CC BY 4.0","\u5EFA\u7B51\u697C\u9AD8\u3001\u7ACB\u9762\u53CA\u690D\u88AB\u4E3A\u8FD1\u4F3C\u590D\u539F"]]){let ft="";for(let Rt of et){let Xt=ft?ft+" \xB7 "+Rt:Rt;ft&&o.measureText(Xt).width>n-24?(m.push(ft),ft=Rt):ft=Xt}m.push(ft)}let d=12+m.length*15,y=n<600?12:24,v=15,p=44,x=y+v+p+13,T="\u4E5D\u534E\u5C71",M="\u4E09\u7EF4\u5B9E\u5730\u5BFC\u89C8 \xB7 \u8D70\u8FD1\u4E5D\u534E",C=`${t.buildings} \u5EFA\u7B51\u8F6E\u5ED3 \xB7 ${t.places} \u5730\u70B9 \xB7 2026.09.27`;o.font=`600 26px ${h}`;let P=Wg(o,T,3.64);o.font=`12.5px ${l}`;let I=Wg(o,M,.75);o.font=`11px ${l}`;let z=o.measureText(C).width,nt=x-y+Math.max(P,I,z)+20,R=v*2+66,w=e([[y,y,y+nt,y+R],[0,s-d,n,s]]);o.fillStyle="#dce5df",o.fillRect(0,0,a.width,a.height),o.drawImage(i,0,0,a.width,a.height),o.scale(r,r);for(let et of w.filter(ft=>ft.classList.contains("maplabel")&&ft.style.display!=="none").sort((ft,Rt)=>(parseInt(getComputedStyle(ft).zIndex)||0)-(parseInt(getComputedStyle(Rt).zIndex)||0)))b2(o,et,r,s-d);o.save(),o.shadowColor="rgba(20,32,27,.24)",o.shadowBlur=20*r,o.shadowOffsetY=6*r,oo(o,y,y,nt,R,18),o.fillStyle="rgba(251,249,243,.96)",o.fill(),o.restore(),o.lineWidth=1,o.strokeStyle="rgba(28,42,37,.09)",oo(o,y+.5,y+.5,nt-1,R-1,17.5),o.stroke();let at=y+v,wt=y+v,ce=Ul("--zhu-fill").match(Qh)||["#c24536","#a8322a"];return o.fillStyle=tu(o,`linear-gradient(160deg, ${ce[0]}, ${ce.at(-1)})`,null,{x:at,y:wt,width:p,height:p}),oo(o,at,wt,p,p,10),o.fill(),o.lineWidth=2,o.strokeStyle="#b23a2d",oo(o,at+1,wt+1,p-2,p-2,9),o.stroke(),o.lineWidth=1,o.strokeStyle="rgba(251,241,230,.55)",oo(o,at+2.5,wt+2.5,p-5,p-5,7.5),o.stroke(),o.fillStyle="#fbf1e6",o.font=`600 16px ${h}`,o.textAlign="center",o.textBaseline="middle",o.fillText("\u4E5D",at+p/2,wt+p/2-8.5),o.fillText("\u534E",at+p/2,wt+p/2+8.5),o.textAlign="left",o.textBaseline="alphabetic",o.fillStyle=u,o.font=`600 26px ${h}`,eu(o,T,x,wt+25,3.64),o.fillStyle=f,o.font=`12.5px ${l}`,eu(o,M,x,wt+46,.75),o.font=`11px ${l}`,o.fillText(C,x,wt+64),o.fillStyle="rgba(251,249,243,.95)",o.fillRect(0,s-d,n,d),o.fillStyle="rgba(28,42,37,.09)",o.fillRect(0,s-d,n,1),o.fillStyle=f,o.font=`10.5px ${l}`,o.textBaseline="middle",m.forEach((et,ft)=>o.fillText(et,12,s-d+13.5+ft*15)),a}var $g=xg(),Id=()=>matchMedia("(max-width:820px), (max-width:960px) and (orientation:landscape) and (max-height:520px)").matches,Hn=Id(),ks=Hn||matchMedia("(pointer:coarse)").matches&&!matchMedia("(any-pointer:fine)").matches,Nr=[{name:"\u6D41\u7545",dpr:1,pbr:!1,blur:!1,hiShapes:!1,forest:0,bamboo:!1,trunkDist:0,detailDist:450,landmarkDist:2600,labelCap:16,shadows:!1},{name:"\u6807\u51C6",dpr:1.5,pbr:!1,blur:!1,hiShapes:!1,forest:1,bamboo:!0,trunkDist:1400,detailDist:900,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u9AD8\u6E05",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:2600,detailDist:2600,landmarkDist:4e3,labelCap:null,shadows:!1},{name:"\u6781\u81F4",dpr:2,pbr:!0,blur:!0,hiShapes:!0,forest:1,bamboo:!0,trunkDist:1e9,detailDist:1e9,landmarkDist:4e3,labelCap:null,shadows:!0}],Dd=ks?2:3,fi=+(Kh.get("autoTier")??(ks?1:3));fi>=0&&fi<=Dd||(fi=ks?1:3);var _r=!1,Nl=matchMedia("(prefers-reduced-motion:reduce)").matches,S2=matchMedia("(hover:hover) and (pointer:fine)");function Zg(i){let t=Gt("#loading");t.hidden=!1,t.classList.remove("done"),t.classList.add("failed"),Gt("#load-text").textContent=i;let e=Gt("#reload");e.hidden=!1,e.onclick=()=>location.reload()}addEventListener("gesturestart",i=>i.preventDefault());function E2(){let i=Gt("#reload");i.hidden||Gt("#loading").classList.contains("failed")||(i.hidden=!0,Gt("#load-text").textContent="\u8BFB\u53D6\u5730\u5F62\u4E0E\u771F\u5B9E\u5EFA\u7B51\u8F6E\u5ED3")}try{await w2()}catch(i){console.error(i),Zg(/webgl/i.test(i.message)?"\u8FD9\u4E2A\u6D4F\u89C8\u5668\u65E0\u6CD5\u663E\u793A\u4E09\u7EF4\u5730\u56FE\uFF08WebGL \u4E0D\u53EF\u7528\uFF09\u3002\u8BF7\u6362\u7528\u7CFB\u7EDF\u6D4F\u89C8\u5668\u6216\u66F4\u65B0\u6D4F\u89C8\u5668\u540E\u91CD\u8BD5\uFF1B\u5728\u5FAE\u4FE1\u91CC\u53EF\u70B9\u53F3\u4E0A\u89D2\u201C\xB7\xB7\xB7\u201D\uFF0C\u9009\u201C\u5728\u6D4F\u89C8\u5668\u6253\u5F00\u201D\u3002":"\u5730\u56FE\u52A0\u8F7D\u5931\u8D25\uFF0C\u8BF7\u91CD\u65B0\u52A0\u8F7D\u3002"+i.message)}async function w2(){let[i,t]=window.__JIUHUA_DATA__||await Promise.all(["data/terrain.json","data/geodata.json?v=20261004-details-photos"].map(async c=>{let g=await fetch(c);if(!g.ok)throw new Error(c);return g.json()}));E2(),t.water=t.water.filter(c=>!(c.kind==="stream"&&c.pts.every(g=>g[0]>=-1900&&g[0]<=-1195&&g[1]>=-165&&g[1]<=230)));for(let c of t.water){let g=c.pts;if(c.kind!=="river"||Math.hypot(g[0][0]+1226,g[0][1]+159)>5)continue;let _=g.findIndex(S=>S[1]<-761.7);if(_>0){let S=g[_-1],E=g[_],A=(-761.7-S[1])/(E[1]-S[1]);c.pts=[[S[0]+(E[0]-S[0])*A,-761.7],...g.slice(_)]}}t.areas.push({kind:"plaza",ring:[[-1338,-60],[-1372,10],[-1398,-1],[-1370,-70]]}),tm(t),t.roads.push({id:"lane-hushan-plaza",name:"",kind:"alley",width:1.5,drape:!0,pts:[[-1341.3,-48.2],[-1376,0]]}),t.roads.push({id:"lane-hushan-huacheng",name:"",kind:"alley",width:1.5,pts:[[-1376,0],[-1386,27],[-1385,56],[-1378,64],[-1357,101],[-1350.5,108],[-1350.5,114.5],[-1355.8,120.5],[-1355,126],[-1352,133],[-1349.5,140]]}),t.roads.push({id:"lane-police",name:"",kind:"alley",width:2,pts:[[-1408.5,-146.8],[-1424,-140],[-1450,-128.5],[-1475,-117],[-1481,-116.5],[-1487.5,-110]]}),t.roads.push({id:"lane-huacheng",name:"",kind:"alley",width:1.2,pts:[[-1330.4,238.6],[-1330.4,226.5],[-1330.6,224.6],[-1334.5,222.3],[-1341.5,219.6],[-1344.6,211],[-1347.6,205.6],[-1348.4,201]]});let{W:e,D:n,N:s}=i,r=Uint8Array.from(atob(i.h),c=>c.charCodeAt(0)),a=new DataView(r.buffer),o=new Float32Array(s*s);for(let c=0;c<o.length;c++)o[c]=a.getUint16(c*2,!0)/4;let l=1.6,h=l,u=jp(o).min;for(let c=0;c<o.length;c++)o[c]=u+(o[c]-u)*l;let f=c=>u+(c-u)/l;for(let c of t.buildings)c.base=u+(c.base-u)*l;function m(c,g){let _=Xn((c+e/2)/e*(s-1),0,s-1.001),S=Xn((g+n/2)/n*(s-1),0,s-1.001),E=_|0,A=S|0,U=_-E,W=S-A;return(o[A*s+E]*(1-U)+o[A*s+E+1]*U)*(1-W)+(o[(A+1)*s+E]*(1-U)+o[(A+1)*s+E+1]*U)*W}let d=t.places.find(c=>c.model?.kind==="entrance-checkpoint"),y=Og(d,m);function v(c,g){let _=m(c,g);return y?y.height(c,g,_):_}let p=new bl({antialias:!(ks&&devicePixelRatio>=2),alpha:!0,powerPreference:"high-performance"});document.documentElement.classList.toggle("lite",!Nr[fi].blur);let x=()=>Math.min(devicePixelRatio,_r?.8:Nr[fi].dpr),T=new Jh(x()),M=!1,C=0,P=()=>T.pixelRatio(M),I=()=>Nr[fi].shadows&&!Hn&&!ks;function z(c=!1,g=performance.now()){M=c;let _=P();Math.abs(p.getPixelRatio()-_)<.01||(p.setPixelRatio(_),C=g)}p.setPixelRatio(P()),p.outputColorSpace=kn,p.toneMapping=md,p.toneMappingExposure=1,p.shadowMap.enabled=I(),p.shadowMap.type=dd,Gt("#stage").appendChild(p.domElement),p.domElement.addEventListener("webglcontextlost",c=>{c.preventDefault(),Zg("\u8BBE\u5907\u56FE\u5F62\u5185\u5B58\u4E0D\u8DB3\uFF0C\u4E09\u7EF4\u753B\u9762\u5DF2\u505C\u6B62\u3002\u5173\u95ED\u5176\u4ED6\u9875\u9762\u540E\u70B9\u201C\u91CD\u65B0\u52A0\u8F7D\u201D\u3002")});let nt=new Gh;nt.domElement.className="labels",Gt("#stage").appendChild(nt.domElement);let R=new Pn;R.matrixWorldAutoUpdate=!1;let w=[],at=!0,wt=0,ce=0,et=!0,ft=[],Rt=0,Xt=new ch;Xt.fog=new lh("#f4dcc0",2e-4);let Qt=()=>{Xt.fog.density=.13/Xn(It.position.distanceTo(se.target),600,2e4)},Lt=new Pn,jt=new Pn,fe=new Pn,we=new Pn,Ct=new Pn;Xt.add(Lt),Lt.add(jt,fe,we,Ct);let It=new Gi(43,1,.7,32e3),se=ug(It,Gt("#stage"),Ux);se.enableDamping=!0,se.dampingFactor=.075,se.minDistance=10,se.maxDistance=12500,se.maxPolarAngle=Math.PI*.482,se.zoomToCursor=!0,se.screenSpacePanning=!1,Xt.add(new Ch("#fff6e8","#7a8a70",1.1));let Le=new Ph("#fff0d6",2.6);Le.position.set(-2600,1900,-1500),Le.castShadow=I(),Le.shadow.mapSize.set(4096,4096),Object.assign(Le.shadow.camera,{left:-850,right:850,top:850,bottom:-850,near:10,far:6500}),Le.shadow.bias=-1e-4,Le.shadow.normalBias=.7,Xt.add(Le,Le.target);let Ne=c=>new fn(c),sn=["roughness","metalness","roughnessMap","metalnessMap","envMapIntensity"],on=c=>{let g={...c};for(let _ of sn)delete g[_];return g},Ve=(()=>{let c=new uh(new Uint8Array([168,168,168,255,214,214,214,255,255,255,255,255]),3,1);return c.minFilter=c.magFilter=Pi,c.needsUpdate=!0,c})();function We(c={}){let g=new Th({...on(c),gradientMap:Ve});return g.userData.params=c,g}let K=["side","transparent","opacity","depthWrite","depthTest","polygonOffset","polygonOffsetFactor","polygonOffsetUnits","alphaTest","vertexColors","map","emissiveMap","emissiveIntensity","fog","toneMapped","flatShading","name"];function be(c,g){if(c.isMeshToonMaterial||!c.userData.params||c.isMeshStandardMaterial===g)return c;if(c.userData.twin)return c.userData.twin;let _=g?new wh(c.userData.params):new Ah(on(c.userData.params));for(let S of K)S in c&&S in _&&(_[S]=c[S]);return _.color?.copy(c.color),_.emissive?.copy(c.emissive),_.onBeforeCompile=c.onBeforeCompile,_.userData.params=c.userData.params,_.userData.twin=c,c.userData.twin=_,_}let lt=(c,g={})=>We({color:c,roughness:.9,metalness:0,...g}),_e={},$t=null;function Be(c){return _e[c]??=c?{leaf:Ba(),pine:new io(1,1,6),trunk:new Wi(.18,.3,1,4,1,!0),bamboo:Ba(),lantern:new Xi(.24,10,8)}:{leaf:Ba(),pine:new io(1,1,6,1,!0),trunk:new Wi(.18,.3,1,3,1,!0),bamboo:Ba(),lantern:Ba().scale(.24,.24,.24)}}let Me=lt("#b9b7a4"),O=lt("#594937"),L=lt("#e0a83a",{roughness:.67}),yt=lt("#c0452f"),ye=lt("#77889a"),pe=lt("#466266",{roughness:.3,metalness:.15}),he=new Ri(1,1,1),Ge=new Wi(1,1,1,8);function qt(c,g,_,S,E,A,U,W){let H=new Je(he,W);return H.position.set(g,_+A/2,S),H.scale.set(E,A,U),H.castShadow=!0,H.receiveShadow=!0,c.add(H),H}function Ee(c,g,_,S,E,A,U){let W=new Je(Ge,U);return W.position.set(g,_+A/2,S),W.scale.set(E,A,E),W.castShadow=!0,c.add(W),W}let $e=new Map;function tn(c,g,_="#777865"){let S=$e.get(c);S||(S={p:[],c:[]},$e.set(c,S));let E=Ne(_);for(let A=1;A<g.length;A++)S.p.push(...g[A-1],...g[A]),S.c.push(E.r,E.g,E.b,E.r,E.g,E.b)}let me=new Map,gn=c=>{if(typeof c!="string")return Ne(c);let g=me.get(c);return g||me.set(c,g=Ne(c)),g};class G{constructor(){this.p=[],this.c=[],this.uv=[],this.ids=[]}tri(g,_,S,E="#ffffff",A=null,U=-1){this.p.push(g[0],g[1],g[2],_[0],_[1],_[2],S[0],S[1],S[2]);let W=gn(E),H=W.r,D=W.g,j=W.b;this.c.push(H,D,j,H,D,j,H,D,j),A?this.uv.push(A[0][0],A[0][1],A[1][0],A[1][1],A[2][0],A[2][1]):this.uv.push(g[0]/8,g[2]/8,_[0]/8,_[2]/8,S[0]/8,S[2]/8),this.ids.push(U)}quad(g,_,S,E,A,U=null,W=-1){this.tri(g,_,S,A,U?[U[0],U[1],U[2]]:null,W),this.tri(g,S,E,A,U?[U[0],U[2],U[3]]:null,W)}mesh(g,_){let S=new Ln;S.setAttribute("position",new Qe(this.p,3)),S.setAttribute("color",new Qe(this.c,3)),S.setAttribute("uv",new Qe(this.uv,2)),S.computeVertexNormals();let E=new Je(S,g);return E.castShadow=!0,E.receiveShadow=!0,E.userData.triangleIds=this.ids,_.add(E),E}}let ue=c=>c*c*(3-2*c),ve=(()=>{let c=Ui(4711),g=256,_=new Float32Array(g*g);for(let E=0;E<_.length;E++)_[E]=c();let S=(E,A)=>{let U=Math.floor(E),W=Math.floor(A),H=E-U,D=A-W,j=ue,Y=(k,Z)=>_[(Z&255)*g+(k&255)];return(Y(U,W)*(1-j(H))+Y(U+1,W)*j(H))*(1-j(D))+(Y(U,W+1)*(1-j(H))+Y(U+1,W+1)*j(H))*j(D)};return(E,A)=>.55*S(E/400+31,A/400+17)+.3*S(E/160+5,A/160+93)+.15*S(E/60+71,A/60+3)})(),tt=(c,g,_)=>_<100||_>1310?0:Xn((ve(c,g)-.42)/.2,0,1),dt=ks?1024:2048,Zt=document.createElement("canvas");Zt.width=Zt.height=dt;let Kt=Zt.getContext("2d"),te=(c,g)=>[(c+e/2)/e*dt,(g+n/2)/n*dt],ct=document.createElement("canvas");ct.width=ct.height=1024;let V=ct.getContext("2d"),Pt=(c,g)=>[(c+e/2)/e*1024,(g+n/2)/n*1024];function zt(c,g,_,S=!1){c.beginPath(),g.forEach((E,A)=>{let U=_(...E);A?c.lineTo(...U):c.moveTo(...U)}),S&&c.closePath()}let re=Kt.createImageData(dt,dt),ae=Ui(23),Ie=new X,Jt=new X(-.72,.53,-.42).normalize();for(let c=0;c<dt;c++)for(let g=0;g<dt;g++){let _=(g/dt-.5)*e,S=(c/dt-.5)*n,E=v(_,S),A=v(_+30,S),U=v(_-30,S),W=v(_,S+30),H=v(_,S-30),D=(A-U)/60,j=(W-H)/60,Y=Xn(-(A+U+W+H-4*E)/900*14,-.22,.22);Ie.set(-D,1,-j).normalize();let k=f(E),Z=1/Math.sqrt(1+(D*D+j*j)/(l*l)),J=Xn((1-Z-.27)*2.8,0,.67)*(k>720?1:.35),ot=(ae()-.5)*10,pt=Math.sin(_*.008)*Math.cos(S*.007)*4,Ut=Xn((k-430)/760,0,1),xt=Ut+(Math.floor(Ut*5)+ue(Math.min(1,Math.max(0,(Ut*5%1-.35)/.3)))-Ut*5)/5*.6,Ht=Xn(1-xt*2,0,1),kt=Xn(xt*2-1,0,1),Mt=Math.max(0,Ie.dot(Jt)),N=[0,1,2].map(st=>[136,184,96][st]*Ht+[86,146,74][st]*(1-Ht-kt)+[108,146,92][st]*kt+pt),rt=(.55+.55*Mt)*(1+Y),mt=(c*dt+g)*4;{let st=tt(_,S,k)*(1-J*1.4),ht=.82+.3*ve(_*7.3,S*7.3);if(st>0)for(let ut=0;ut<3;ut++)N[ut]+=([44,104,62][ut]*ht-N[ut])*ue(Math.min(1,st))*.78}for(let st=0;st<3;st++)re.data[mt+st]=(N[st]*(1-J)+[200,190,164][st]*J)*rt+[6,4,-6][st]*Mt+[-6,-2,8][st]*(1-Mt)+ot;re.data[mt+3]=255}Kt.putImageData(re,0,0);for(let c of t.areas)["residential","religious","parking","water","grass","meadow","plaza","site"].includes(c.kind)&&(zt(Kt,c.ring,te,!0),Kt.fillStyle={residential:"#b7b6a0",religious:"#bdb9a6",parking:"#92998f",water:"#4fa6d8",grass:"#849268",meadow:"#899767",plaza:"#b9b4a1",site:"#a9a89c"}[c.kind],Kt.fill(),["residential","religious","parking","water","plaza","site"].includes(c.kind)&&(zt(V,c.ring,Pt,!0),V.fill()));Kt.lineJoin="round";for(let c of t.buildings)c.style==="rural"||c.style==="tiantai"||(zt(Kt,c.ring,te,!0),Kt.strokeStyle="#a9a797",Kt.lineWidth=Math.max(1.2,7/e*dt),Kt.stroke());for(let c of t.buildings)zt(Kt,c.ring,te,!0),Kt.fillStyle="#bcbcaf",Kt.fill(),zt(V,c.ring,Pt,!0),V.fill(),V.lineWidth=3,V.stroke();for(let c of t.roads)zt(V,c.pts,Pt),V.lineWidth=Math.max(2,(c.width+7)/e*1024),V.stroke();for(let c of t.water)zt(Kt,c.pts,te),Kt.strokeStyle="#4a9fd0",Kt.lineWidth=c.kind==="river"?3:1,Kt.stroke(),zt(V,c.pts,Pt),V.lineWidth=5,V.stroke();let De=V.getImageData(0,0,1024,1024).data,ze=(c,g)=>{let[_,S]=Pt(c,g).map(Math.floor);return _<0||S<0||_>=1024||S>=1024||De[(S*1024+_)*4+3]>0},Ue=ks?2048:4096,en=document.createElement("canvas");en.width=en.height=Ue;let hn=en.getContext("2d"),pn=new as(en);pn.flipY=!1,pn.generateMipmaps=!1,pn.minFilter=pn.magFilter=ms;let Rn=new as(Zt);Rn.colorSpace=kn,Rn.anisotropy=p.capabilities.getMaxAnisotropy();let Tn=new _s(e,n,s-1,s-1).rotateX(-Math.PI/2);for(let c=0;c<o.length;c++)Tn.attributes.position.setY(c,o[c]);Tn.computeVertexNormals();let Bn=new Je(Tn,lt("#ffffff",{map:Rn}));Bn.receiveShadow=!0,Lt.add(Bn),y&&Lt.add(Fg(y,Nd,e,n,lt("#ffffff",{map:Rn})));let li={o:new Fn(0,0,1,0),s:new Fn(1,0,1,0)},Hs=y?{o:new Fn(...y.origin,y.fz,-y.fx),s:new Fn(-18,18,-14,14)}:{o:new Fn(0,0,1,0),s:new Fn(1,0,1,0)},ls=(c,g)=>{let _=li.o,S=li.s,E=c-_.x,A=g-_.y,U=E*_.z+A*_.w,W=E*_.w-A*_.z;return U>S.x-3&&U<S.y+3&&W>S.z-3&&W<S.w+3};{let c=document.createElement("canvas");c.width=c.height=256;let g=c.getContext("2d"),_=g.createImageData(256,256),S=Ui(7),E=(D,j)=>{let Y=new Float32Array((D+1)*(D+1)),k=Ui(j);for(let Z=0;Z<Y.length;Z++)Y[Z]=k();return(Z,J)=>{let ot=Z*D,pt=J*D,Ut=Math.floor(ot),xt=Math.floor(pt),Ht=ot-Ut,kt=pt-xt,Mt=rt=>rt*rt*(3-2*rt),N=(rt,mt)=>Y[mt%D*(D+1)+rt%D];return(N(Ut,xt)*(1-Mt(Ht))+N(Ut+1,xt)*Mt(Ht))*(1-Mt(kt))+(N(Ut,xt+1)*(1-Mt(Ht))+N(Ut+1,xt+1)*Mt(Ht))*Mt(kt)}},A=E(64,11),U=E(16,12),W=E(8,13);for(let D=0;D<256;D++)for(let j=0;j<256;j++){let Y=j/256,k=D/256,Z=(D*256+j)*4,J=.55*A(Y,k)+.45*S();_.data[Z]=J*255,_.data[Z+1]=(.6*U(Y,k)+.4*W(Y,k))*255,_.data[Z+2]=128,_.data[Z+3]=255}g.putImageData(_,0,0);let H=new as(c);H.wrapS=H.wrapT=no,H.anisotropy=8,Bn.material.onBeforeCompile=D=>{D.uniforms.detailMap={value:H},D.uniforms.roadMask={value:pn},D.uniforms.terrainWD={value:new de(e,n)},D.uniforms.cutO={value:li.o},D.uniforms.cutS={value:li.s},D.uniforms.checkpointO={value:Hs.o},D.uniforms.checkpointS={value:Hs.s},D.vertexShader=D.vertexShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;`).replace("#include <project_vertex>",`#include <project_vertex>
vDetailPos=(modelMatrix*vec4(transformed,1.0)).xyz;`),D.fragmentShader=D.fragmentShader.replace("#include <common>",`#include <common>
varying vec3 vDetailPos;uniform sampler2D detailMap;uniform vec4 cutO;uniform vec4 cutS;uniform sampler2D roadMask;uniform vec2 terrainWD;`).replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
if(texture2D(roadMask,vDetailPos.xz/terrainWD+.5).r>.5)discard;
{vec2 dq=vDetailPos.xz-cutO.xy;float cu=dot(dq,cutO.zw),cv=dot(dq,vec2(cutO.w,-cutO.z));if(cu>cutS.x&&cu<cutS.y&&cv>cutS.z&&cv<cutS.w)discard;}`).replace("#include <map_fragment>",`#include <map_fragment>
{float near=smoothstep(1600.0,150.0,length(vDetailPos-cameraPosition));float fine=texture2D(detailMap,vDetailPos.xz/7.0).r;float mid=texture2D(detailMap,vDetailPos.xz/61.0).g;diffuseColor.rgb*=mix(1.0,0.74+0.38*fine+0.22*(mid-0.5),near);}`);let j=D.fragmentShader;D.fragmentShader=j.replace("uniform vec4 cutS;","uniform vec4 cutS;uniform vec4 checkpointO;uniform vec4 checkpointS;").replace("#include <clipping_planes_fragment>",`#include <clipping_planes_fragment>
{vec2 dq=vDetailPos.xz-checkpointO.xy;float cu=dot(dq,checkpointO.zw),cv=dot(dq,vec2(-checkpointO.w,checkpointO.z));if(cu>checkpointS.x&&cu<checkpointS.y&&cv>checkpointS.z&&cv<checkpointS.w)discard;}`)},Bn.material.needsUpdate=!0}let In=new G,xn=[];for(let c=0;c<s;c++)xn.push([c,0]);for(let c=1;c<s;c++)xn.push([s-1,c]);for(let c=s-2;c>=0;c--)xn.push([c,s-1]);for(let c=s-2;c>=0;c--)xn.push([0,c]);for(let c=1;c<xn.length;c++){let[g,_]=xn[c-1],[S,E]=xn[c],A=-e/2+g*e/(s-1),U=-n/2+_*n/(s-1),W=-e/2+S*e/(s-1),H=-n/2+E*n/(s-1);In.quad([A,o[_*s+g],U],[W,o[E*s+S],H],[W,u-90,H],[A,u-90,U],"#8f8974")}{let c=In.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),Lt),g=c.geometry.attributes.position,_=c.geometry.attributes.color,S=Ne("#6c6f5c"),E=Ne("#f3d6b2"),A=new fn;for(let U=0;U<g.count;U++)A.copy(S).lerp(E,g.getY(U)<u-80?1:0),_.setXYZ(U,A.r,A.g,A.b);c.castShadow=c.receiveShadow=!1}Gt("#load-text").textContent="\u6309\u771F\u5B9E\u8F6E\u5ED3\u91CD\u5EFA\u5C4B\u9876\u3001\u7A97\u6237\u548C\u6CBF\u8857\u7ACB\u9762",await new Promise(requestAnimationFrame);function Vs(c){let g=document.createElement("canvas");g.width=g.height=256;let _=g.getContext("2d");_.fillStyle=c==="roof"?"#e4e2da":"#e6e3d9",_.fillRect(0,0,256,256);let S=Ui(c==="roof"?44:98);for(let A=0;A<3500;A++)_.fillStyle=`rgba(${S()>.5?"255,255,255":"50,55,44"},${S()*.07})`,_.fillRect(S()*256,S()*256,1+S()*3,1+S()*2);if(c==="roof"){for(let A=0;A<256;A+=12)_.fillStyle="#e3dfd540",_.fillRect(A,0,3,256),_.fillStyle="#222c2c2c",_.fillRect(A+8,0,2,256);for(let A=0;A<256;A+=20)_.fillStyle="#23333122",_.fillRect(0,A,256,1)}let E=new as(g);return E.wrapS=E.wrapT=no,E.colorSpace=kn,E.anisotropy=8,E}let B={"#6A6F72":"#7b8da2","#8A4B35":"#a9483a","#B4623F":"#c9603d","#D9A93A":"#f6c02c","#7A2E26":"#b63a2a","#8C6A3E":"#b98a45","#3D4141":"#6f7f92","#C0582E":"#dc6435"},gt={"#F0EEE8":"#fbf4e6","#D8D6CF":"#e6dece","#EAEAE6":"#f5efe2","#D8A035":"#f2b33a","#E4D9C4":"#f3e3c0"},Tt=Vs("roof"),Ft=Vs("wall"),At=new G,Pe=new G,Ye=new G,je=new G,rn=new G,dn=new G,un=[],an=[],Vn=[],Si=[],ci="overture-6eed6b02-0a6b-40b7-9326-5247a9383063",cs=new Set([609757872,609561169,t.buildings.find(c=>c.id===ci)?.osmId,609909704,609909706]);for(let c of t.areas)for(let g of c.frame?.replaces||[])cs.add(t.buildings.find(_=>_.id===g)?.osmId);let si=["#D9A93A","#7A2E26","#C0582E"],_n=t.buildings.filter(c=>c.style==="temple"&&c.area>=240&&(si.includes(c.roofColor)||c.osmId===609990009));for(let c of _n)cs.add(c.osmId);let nr=Kp,qn=new Set(Object.values(nr));for(let c of qn)cs.add(c);let Ji=256,ir=48,sr=8,Bo=ks?24:44,Ei=[],hs=document.createElement("canvas");hs.width=Ji*sr,hs.height=ir*Bo;let us=hs.getContext("2d");function fs(c){let g=Ei.length;if(g>=sr*Bo)return null;Ei.push(c);let _=g%sr*Ji,S=Math.floor(g/sr)*ir;us.fillStyle="#1c1a17",us.fillRect(_,S,Ji,ir),us.strokeStyle="#8b6d30",us.lineWidth=3,us.strokeRect(_+4,S+4,Ji-8,ir-8),us.fillStyle="#dcb95c";let E=Math.min(32,Math.floor((Ji-26)/Math.max(2,[...c].length)));us.font=`600 ${E}px "Songti SC","STSong","Noto Serif SC","PingFang SC",serif`,us.textAlign="center",us.textBaseline="middle",us.fillText(c,_+Ji/2,S+ir/2+1);let A=hs.width,U=hs.height;return[[_/A,1-(S+ir)/U],[(_+Ji)/A,1-(S+ir)/U],[(_+Ji)/A,1-S/U],[_/A,1-S/U]]}let Na=c=>[...c.replace(/^(九华山上?|池州|花筑·?)/,"").replace(/[（(].*$/,"").replace(/(精品|主题)?(民宿|客栈|山庄|宾馆|酒店)$/,_=>_.length>2?_.slice(-2):_).trim()].slice(0,9).join(""),Or=[],zo=[],Oa=(c,g)=>{let _=new fn(c);return _.offsetHSL(0,0,g),"#"+_.getHexString()};for(let c=0;c<t.buildings.length;c++){let le=function(ie){let ee=-(ie[0]-Mt)*kt+(ie[1]-N)*Ht;return S+mt*Xn(1-Math.abs(ee)/rt,0,1)},g=t.buildings[c];if(cs.has(g.osmId))continue;let _=g.ring,S=g.base+g.wallHeight,E=Ui(g.osmId),A=E(),U=g.style==="temple",W=gt[g.wallColor]||g.wallColor||(g.precinct==="\u767E\u5C81\u5BAB"?"#e8dfc2":g.kind==="temple"?g.roofColor==="gold"?"#cdb787":"#e6dbc1":"#ebe6d9"),H=B[g.roofColor]||(g.roofColor?.startsWith("#")?g.roofColor:g.roofColor==="gold"?"#c1a14e":"#5b6062"),D=Oa(H,(A-.5)*.06),j=g.levels||2,Y=(g.wallHeight-.35)/j,k=!!g.lattice,Z=(g.eave??.5)*1.6,J=k?"#2f2721":"#56676a",ot=k?"#3a3029":"#687675",pt=0;_.forEach((ie,ee)=>{let ge=_[(ee+1)%_.length];pt+=ie[0]*ge[1]-ge[0]*ie[1]});let Ut=!0,xt=new Set(g.partyEdges||[]);for(let ie=0;ie<_.length;ie++){let Jn=function(wn,Yn,Cn,jn,zn,Yo,$o=.035,Ka=null,sc=!1){let Fi=ee[0]+Wt*Yn+Nt*$o,Ls=ee[1]+Ce*Yn+xe*$o,Ci=jn/2,br=sc?ln:Wt,gi=sc?nn:Ce;wn.quad([Fi-br*Ci,Cn,Ls-gi*Ci],[Fi+br*Ci,Cn,Ls+gi*Ci],[Fi+br*Ci,Cn+zn,Ls+gi*Ci],[Fi-br*Ci,Cn+zn,Ls-gi*Ci],Yo,Ka)},ee=_[ie],ge=_[(ie+1)%_.length],q=Math.hypot(ge[0]-ee[0],ge[1]-ee[1]);if(q<.1)continue;let bt=Math.min(g.base,v(...ee)-.12),St=Math.min(g.base,v(...ge)-.12),Ot=U?g.base+.5:Math.min(g.base+.5,bt+1.2),Q=U?g.base+.5:Math.min(g.base+.5,St+1.2);if(At.quad([ee[0],Ot,ee[1]],[ge[0],Q,ge[1]],[ge[0],S,ge[1]],[ee[0],S,ee[1]],W,[[0,Ot/8],[q/8,Q/8],[q/8,S/8],[0,S/8]],c),(Ot-bt>.25||Q-St>.25)&&Ye.quad([ee[0],bt,ee[1]],[ge[0],St,ge[1]],[ge[0],Q,ge[1]],[ee[0],Ot,ee[1]],"#9c9a93",null,c),xt.has(ie))continue;let Nt=(pt>0?1:-1)*(ge[1]-ee[1])/q,xe=(pt>0?-1:1)*(ge[0]-ee[0])/q,Wt=(ge[0]-ee[0])/q,Ce=(ge[1]-ee[1])/q,ln=xe,nn=-Nt,Gs=ie===g.front&&g.frontDist!=null&&g.frontDist<14,Oi=g.shopfront&&Gs&&q>2.4;if(q>2.4){let wn=Math.max(1,Math.floor(q/(U?3.1:3.3))),Yn=U?0:-Math.floor((g.base+.35-Math.min(Ot,Q))/Y);for(let Cn=Yn;Cn<j;Cn++)if(!(Cn===0&&Oi))for(let jn=0;jn<wn;jn++){if(ie!==g.front||Cn!==j-1||jn%2)continue;let zn=(jn+.5)*q/wn,Yo=g.base+.35+Cn*Y+(Cn===0?.95:.8),$o=Math.min(1.75,Y*.54),Ka=U?1.3:k?1.1:1.4;Cn<0&&Yo<Ot+(Q-Ot)*zn/q+.35||Jn(je,zn,Yo,Ka,$o,(jn+Cn)%3?J:ot,.055)}if(ie===g.front&&!Oi&&!U&&q>3&&(Jn(je,q/2,g.base+.33,1.3,2.35,"#3a342d",.07),g.lanterns))for(let Cn of[-1.15,1.15])Or.push([ee[0]+Wt*(q/2+Cn)+Nt*.45,g.base+2.45,ee[1]+Ce*(q/2+Cn)+xe*.45])}if(Oi){let wn=Math.max(1,Math.floor(q/3.2)),Yn=q/wn;for(let Cn=0;Cn<wn;Cn++){let jn=(Cn+.5)*Yn;Jn(je,jn,g.base+.42,Yn-.42,2.3,Cn%2?"#2b2622":"#322b25",.06),g.lanterns&&Cn<4&&Or.push([ee[0]+Wt*(jn-Yn/2+.3)+Nt*.62,g.base+2.55,ee[1]+Ce*(jn-Yn/2+.3)+xe*.62])}Jn(rn,q/2,g.base+2.78,q-.1,.42,g.style==="oldStreet"?"#7b2d22":"#6d5a45",.07)}if(!Ut&&Gs&&q>2.2){let wn=Oi&&g.businesses.find(jn=>jn.category!=="hotel")||g.businesses[0],Yn=Na(wn.short||wn.n),Cn=Yn?fs(Yn):null;if(Cn){let jn=Math.min(q*.82,.62*[...Yn].length+1.1),zn=Oi?g.base+3.28:g.base+Math.min(g.wallHeight-1.1,3.25);Jn(dn,q/2,zn,jn,Math.min(.95,jn*.19),"#ffffff",.14,Cn,!0),Ut=!0}}}let[Ht,kt]=g.axis,[Mt,N]=g.rectCenter,rt=Math.max(.8,g.depth/2),mt=g.roofRise;if([541482372,538484526,538484527,538484528,609990014,609990009].includes(g.osmId))continue;let ht=(ie,ee)=>[ie/6,ee/6],ut=g.area/Math.max(1,g.width*g.depth),it=g.partyGable?.12:Z,Et=g.partyEave?Math.min(Z,.15):Z;if(g.hip&&ut>.82){let ie=g.width/2+it,ee=g.depth/2+Et,ge=S-mt*Et/rt,q=Math.max(0,g.width/2-g.depth/2),bt=(Ce,ln,nn)=>[Mt+Ht*Ce-kt*ln,nn,N+kt*Ce+Ht*ln],St=bt(-ie,-ee,ge),Ot=bt(ie,-ee,ge),Q=bt(ie,ee,ge),Nt=bt(-ie,ee,ge),xe=bt(-q,0,S+mt),Wt=bt(q,0,S+mt);Pe.quad(St,Ot,Wt,xe,D,[ht(-ie,-ee),ht(ie,-ee),ht(q,0),ht(-q,0)],c),Pe.quad(Q,Nt,xe,Wt,D,[ht(ie,ee),ht(-ie,ee),ht(-q,0),ht(q,0)],c),Pe.tri(Ot,Q,Wt,Oa(H,-.03),[ht(ie,-ee),ht(ie,ee),ht(q,0)],c),Pe.tri(Nt,St,xe,Oa(H,-.03),[ht(-ie,ee),ht(-ie,-ee),ht(-q,0)],c);for(let[Ce,ln]of[[St,Ot],[Ot,Q],[Q,Nt],[Nt,St],[xe,Wt],[St,xe],[Ot,Wt],[Q,Wt],[Nt,xe]])un.push(...Ce,...ln);continue}let Re=g.horseHead?1:1+2*it/Math.max(2,g.width),Dt=1+2*Et/Math.max(2,g.depth),oe=ie=>{let ee=(ie[0]-Mt)*Ht+(ie[1]-N)*kt,ge=-(ie[0]-Mt)*kt+(ie[1]-N)*Ht,q=ee*Re,bt=ge*Dt;return[Mt+Ht*q-kt*bt,S+mt*(1-Math.abs(bt)/rt),N+kt*q+Ht*bt,q,bt]};for(let ie=0;ie<_.length;ie++){let ee=_[ie],ge=_[(ie+1)%_.length],q=-(ee[0]-Mt)*kt+(ee[1]-N)*Ht,bt=-(ge[0]-Mt)*kt+(ge[1]-N)*Ht,St=Math.hypot(ge[0]-ee[0],ge[1]-ee[1]),Ot=q*bt<0;if(Ot&&g.horseHead&&St>4){let Nt=St>9?5:3,xe=Nt===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let Wt=0;Wt<Nt;Wt++){let Ce=Wt/Nt,ln=(Wt+1)/Nt,nn=[ee[0]+(ge[0]-ee[0])*Ce,ee[1]+(ge[1]-ee[1])*Ce],Jn=[ee[0]+(ge[0]-ee[0])*ln,ee[1]+(ge[1]-ee[1])*ln],Gs=S+(mt+.95)*xe[Wt]+.25,Oi=Math.max(le(nn),le(Jn))+.45,wn=Math.max(Gs,Oi);At.quad([nn[0],S,nn[1]],[Jn[0],S,Jn[1]],[Jn[0],wn,Jn[1]],[nn[0],wn,nn[1]],W,null,c);let Yn=-(ge[1]-ee[1])/St*.3,Cn=(ge[0]-ee[0])/St*.3;rn.quad([nn[0]-Yn,wn-.04,nn[1]-Cn],[Jn[0]-Yn,wn-.04,Jn[1]-Cn],[Jn[0],wn+.2,Jn[1]],[nn[0],wn+.2,nn[1]],"#3e4144"),rn.quad([nn[0],wn+.2,nn[1]],[Jn[0],wn+.2,Jn[1]],[Jn[0]+Yn,wn-.04,Jn[1]+Cn],[nn[0]+Yn,wn-.04,nn[1]+Cn],"#3e4144")}continue}let Q=[ee];if(Ot){let Nt=q/(q-bt);Q.push([ee[0]+(ge[0]-ee[0])*Nt,ee[1]+(ge[1]-ee[1])*Nt])}Q.push(ge);for(let Nt=1;Nt<Q.length;Nt++){let xe=Q[Nt-1],Wt=Q[Nt];At.quad([xe[0],S,xe[1]],[Wt[0],S,Wt[1]],[Wt[0],le(Wt),Wt[1]],[xe[0],le(xe),xe[1]],W,null,c)}}for(let ie of g.roofTriangles){let ee=ie.map(oe);Pe.tri(...ee.map(ge=>ge.slice(0,3)),D,ee.map(ge=>ht(ge[3],ge[4])),c)}for(let ie=0;ie<_.length;ie++){let ee=oe(_[ie]),ge=oe(_[(ie+1)%_.length]);un.push(ee[0],ee[1]+.06,ee[2],ge[0],ge[1]+.06,ge[2])}}let Jg=At.mesh(lt("#ffffff",{vertexColors:!0,map:Ft,side:mn}),jt),jg=Pe.mesh(lt("#ffffff",{vertexColors:!0,map:Tt,side:mn}),jt);Vn.push(Ye.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),jt)),Si.push(je.mesh(lt("#ffffff",{vertexColors:!0,roughness:.4,metalness:.05,side:mn}),jt)),rn.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),jt),Vn.push(Jg,jg);let Ol=new as(hs);if(Ol.colorSpace=kn,Ol.anisotropy=8,dn.mesh(We({map:Ol,roughness:.55,side:mn,emissive:"#ffffff",emissiveMap:Ol,emissiveIntensity:.18}),jt),Or.length){let c=$t=new Dr(Be(Nr[fi].hiShapes).lantern,We({color:"#c8261c",emissive:"#8a1208",emissiveIntensity:.55,roughness:.5}),Or.length),g=new vi;Or.forEach((_,S)=>{g.position.set(..._),g.scale.set(1,1.25,1),g.updateMatrix(),c.setMatrixAt(S,g.matrix)}),jt.add(c),Si.push(c)}if(zo.length){let c=new Dr(new Ri(.8,.55,.3),lt("#d8d8d2",{roughness:.6}),zo.length),g=new vi;zo.forEach((_,S)=>{g.position.set(_[0],_[1],_[2]),g.rotation.set(0,_[3],0),g.updateMatrix(),c.setMatrixAt(S,g.matrix)}),jt.add(c)}let Ud=new Ln;Ud.setAttribute("position",new Qe(un,3)),jt.add(new El(Ud,new Ta({color:"#2b2420",transparent:!0,opacity:.9})));function rr(c,g,_,S,E,A,U,W=ye,{hip:H=!1,upturn:D=!1}={}){let j=new G,Y=E/2,k=A/2,Z=H?Math.max(1,Y-k*.8):Y,J=[g-Y,_+(D?.6:0),S-k],ot=[g+Y,_+(D?.6:0),S-k],pt=[g+Y,_+(D?.6:0),S+k],Ut=[g-Y,_+(D?.6:0),S+k],xt=[g-Z,_+U,S],Ht=[g+Z,_+U,S];j.quad(J,ot,Ht,xt,"#ffffff"),j.quad(Ut,xt,Ht,pt,"#ffffff"),j.tri(J,xt,Ut,"#ffffff"),j.tri(ot,pt,Ht,"#ffffff");let kt=W.clone();if(kt.map=Tt,kt.side=mn,j.mesh(kt,c),tn(c,[xt,Ht],W===L?"#ba9144":"#5b6459"),D)for(let[Mt,N,rt,mt]of[[g-Y,S-k,-1,-1],[g+Y,S-k,1,-1],[g-Y,S+k,-1,1],[g+Y,S+k,1,1]])tn(c,[[Mt-rt*3,_+.03,N-mt*1.8],[Mt,_+.6,N],[Mt+rt*.65,_+1.05,N+mt*.5]],"#71694c")}function or(c,g,_){let S=new Pn;return S.position.set(c,v(c,g),g),S.userData.landmark=_,S.userData.placeId=sl(_),jt.add(S),an.push(S),S}function Fa(c,g,_,S){let E=Math.atan2(_,S),A=Math.cos(E),U=Math.sin(E);return{rot:E,wp:(W,H)=>[c+W*A+H*U,g-W*U+H*A]}}function bn(c,g,_,S,E,A,U,W){let H=(k,Z,J)=>[[0,0],[k/8,0],[k/8,J/8],[0,J/8]],D=E-S,j=_-g,Y=U-A;c.quad([g,S,U],[_,S,U],[_,E,U],[g,E,U],W,H(j,0,D)),c.quad([_,S,A],[g,S,A],[g,E,A],[_,E,A],W,H(j,0,D)),c.quad([_,S,U],[_,S,A],[_,E,A],[_,E,U],W,H(Y,0,D)),c.quad([g,S,A],[g,S,U],[g,E,U],[g,E,A],W,H(Y,0,D)),c.quad([g,E,U],[_,E,U],[_,E,A],[g,E,A],W,[[g/8,U/8],[_/8,U/8],[_/8,A/8],[g/8,A/8]])}let vr=new Map;{let c=t.buildings.find(g=>g.name==="\u5316\u57CE\u5BFA");if(c){let[g,_]=c.rectCenter,{rot:S,wp:E}=Fa(g,_,-c.axis[0],-c.axis[1]),A=c.depth/2,U=c.width/2,W=c.width/58.75,H=or(g,_,"\u5316\u57CE\u5BFA");H.rotation.y=S;let D=H.position.y,j=gt[c.wallColor]||c.wallColor||"#fbf4e6",Y=B[c.roofColor]||c.roofColor||"#7b8da2",k="#3e4144",Z="#4a4f50",J=new G,ot=new G,pt=new G,Ut=(mt,st,ht)=>{let ut=ht===Math.max?-1e9:1e9;for(let it=0;it<=4;it++)for(let Et=-2;Et<=2;Et++)ut=ht(ut,v(...E(Et*A/2,mt+(st-mt)*it/4)));return ut-D},xt=[{name:"\u7075\u5B98\u6BBF",hall:8,court:3.75,doc:3.7,h:6,rise:2.4,wing:2.6},{name:"\u5929\u738B\u6BBF",hall:9.5,court:4.5,doc:5.2,h:6.4,rise:2.85,wing:2.6},{name:"\u5927\u96C4\u5B9D\u6BBF",hall:11.5,court:7.5,doc:6.4,h:8,rise:3.45,wing:3},{name:"\u85CF\u7ECF\u697C",hall:14,court:0,doc:9.1,h:10.5,rise:4.2}],Ht=v(...E(0,U+6))-D,kt=U,Mt=-1e9;for(let mt of xt){mt.front=kt,mt.hallBack=kt-mt.hall*W,mt.back=mt.hallBack-mt.court*W,kt=mt.back,mt.y=Math.max(Ht+mt.doc,Ut(mt.back,mt.front,Math.max)+.3,Mt),Mt=mt.y;let st=Ut(mt.back,mt.front,Math.min)-1.2;bn(pt,-A,A,st,mt.y,mt.back,mt.front,"#b9b7a4")}let N=.8;for(let[mt,st]of xt.entries()){let ht=st.hallBack,ut=st.front,it=(ht+ut)/2,Et=(ut-ht)/2,Re=st.y+st.h,Dt=Re+st.rise,oe=Re-st.rise*N/Et,le=Math.hypot(Et+N,Dt-oe);bn(J,-A,A,st.y,Re,ht,ut,j);for(let q of[-1,1])J.tri([q*A,Re,ht],[q*A,Re,ut],[q*A,Dt,it],j,[[0,0],[Et/4,0],[Et/8,st.rise/8]]);ot.quad([-A,oe,ut+N],[A,oe,ut+N],[A,Dt,it],[-A,Dt,it],Y,[[-A/6,0],[A/6,0],[A/6,le/6],[-A/6,le/6]]),ot.quad([A,oe,ht-N],[-A,oe,ht-N],[-A,Dt,it],[A,Dt,it],Y,[[A/6,0],[-A/6,0],[-A/6,le/6],[A/6,le/6]]),bn(pt,-A,A,Dt-.12,Dt+.32,it-.22,it+.22,Z);let ie=st.hall>9?5:3,ee=ie===5?[.42,.74,1,.74,.42]:[.6,1,.6];for(let q of[-1,1])for(let bt=0;bt<ie;bt++){let St=ht+(ut-ht)*bt/ie,Ot=ht+(ut-ht)*(bt+1)/ie,Q=Re+(st.rise+.95)*ee[bt]+.3,Nt=q*A-q*.36,xe=q*A+q*.06,Wt=q*A-q*.48,Ce=q*A+q*.18;bn(J,Math.min(Nt,xe),Math.max(Nt,xe),Re,Q,St,Ot,j),bn(pt,Math.min(Wt,Ce),Math.max(Wt,Ce),Q,Q+.2,St-.06,Ot+.06,k)}let ge=ut+.06;if(mt===0){for(let q of[-A*.46,0,A*.46]){let bt=q?2.6:3.3,St=q?3.7:4.5,Ot=new Ur;Ot.moveTo(-bt/2,0),Ot.lineTo(bt/2,0),Ot.lineTo(bt/2,St-bt/2),Ot.absarc(0,St-bt/2,bt/2,0,Math.PI,!1),Ot.lineTo(-bt/2,0);let Q=new Je(new Pl(Ot,14),O);Q.position.set(q,st.y+.02,ge),H.add(Q)}bn(pt,-2.2,2.2,st.y+4.9,st.y+5.7,ge,ge+.12,"#2b2622");for(let q of[-A*.7,-A*.23,A*.23,A*.7]){let bt=new Je(new Xi(.42,10,7),yt);bt.position.set(q,Re-.75,ut+.55),bt.scale.y=1.22,H.add(bt)}}else if(mt===1){bn(pt,-1.8,1.8,st.y,st.y+3.4,ge-.02,ge+.06,"#3a2a1f");for(let q of[-1,1])bn(pt,q*5.2-1.1,q*5.2+1.1,st.y+1.4,st.y+3.2,ge-.02,ge+.05,"#3a3029")}else if(mt===2){for(let bt=0;bt<=5;bt++){let St=-A+1.2+bt*(2*A-2.4)/5;Ee(H,St,st.y,ut+.42,.2,st.h-.1,yt)}for(let bt=0;bt<5;bt++){let St=-A+1.2+(bt+.5)*(2*A-2.4)/5,Ot=(2*A-2.4)/5-.5;bn(pt,St-Ot/2,St+Ot/2,st.y+.2,st.y+st.h*.72,ge-.02,ge+.05,"#8a3a2a");for(let Q=1;Q<4;Q++)bn(pt,St-Ot/2,St+Ot/2,st.y+.2+Q*st.h*.18-.04,st.y+.2+Q*st.h*.18+.04,ge,ge+.08,"#4a2a20")}bn(pt,-2,2,Re-1.3,Re-.5,ge+.05,ge+.14,"#2b2622")}else{for(let q of[ut+.05,ht-.05])for(let bt=0;bt<3;bt++)for(let St=0;St<5;St++){let Ot=-A+(St+.5)*2*A/5,Q=st.y+.9+bt*3.3;bn(pt,Ot-.85,Ot+.85,Q,Q+1.7,q-.03,q+.03,"#3a2a1f"),bn(pt,Ot-.04,Ot+.04,Q,Q+1.7,q-.05,q+.05,"#5a4633")}for(let q=1;q<3;q++)bn(pt,-A,A,st.y+q*3.3+.2,st.y+q*3.3+.38,ut,ut+.45,"#5a4633")}if(st.court>0){let q=st.back,bt=st.hallBack,St=st.wing;for(let Wt of[-1,1]){let Ce=Wt*A,ln=Wt*(A-St),nn=mt===2?3.2:3.6,Jn=st.y+nn+1.1,Gs=st.y+nn-.1;bn(J,Math.min(Ce,ln),Math.max(Ce,ln),st.y,st.y+nn,q+.02,bt-.02,j),bn(J,Math.min(Ce,Ce-Wt*.3),Math.max(Ce,Ce-Wt*.3),st.y+nn,Jn,q+.02,bt-.02,j),ot.quad([Ce,Jn,q],[Ce,Jn,bt],[ln-Wt*.6,Gs,bt],[ln-Wt*.6,Gs,q],Y,[[q/6,0],[bt/6,0],[bt/6,(St+.6)/6],[q/6,(St+.6)/6]]);let Oi=ln-Wt*.05;if(mt===2)for(let wn=0;wn<4;wn++){let Yn=q+(bt-q)*(wn+.5)/4;bn(pt,Math.min(Oi,Oi-Wt*.18),Math.max(Oi,Oi-Wt*.18),st.y+.3,st.y+2.3,Yn-.55,Yn+.55,"#77736a")}else for(let wn=0;wn<2;wn++){let Yn=q+(bt-q)*(wn+.5)/2;bn(pt,Math.min(Oi,Oi-Wt*.06),Math.max(Oi,Oi-Wt*.06),st.y+1,st.y+2.6,Yn-.7,Yn+.7,"#3a3029")}}let Ot=xt[mt+1],Q=Ot.y-st.y,Nt=Math.max(1,Math.ceil(Q/.18)),xe=Math.min(.32,(bt-q)*.7/Nt);for(let Wt=0;Wt<Nt;Wt++)bn(pt,-3,3,st.y-.05,Ot.y-Wt*Q/Nt,q+Wt*xe,q+(Wt+1)*xe,"#c2bfb0")}}{let mt=xt[0],st=v(...E(0,U+3))-D,ht=mt.y-st;if(ht>.25){let ut=Math.ceil(ht/.17),it=.33;for(let Et=0;Et<ut;Et++)bn(pt,-4.5,4.5,Math.min(st,Ht)-1,mt.y-(Et+1)*ht/ut,U+Et*it,U+(Et+1)*it,"#c2bfb0");for(let Et of[-1,1])bn(pt,Et*5.4-.5,Et*5.4+.5,st,st+.7,U+ut*it-1.1,U+ut*it-.1,"#9f9d92"),bn(pt,Et*5.4-.35,Et*5.4+.35,st+.7,st+1.8,U+ut*it-.95,U+ut*it-.25,"#9f9d92")}}J.mesh(lt("#ffffff",{vertexColors:!0,map:Ft,side:mn}),H),ot.mesh(lt("#ffffff",{vertexColors:!0,map:Tt,side:mn}),H),pt.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),H),vr.set("\u5316\u57CE\u5BFA",D+xt[2].y+xt[2].h+xt[2].rise);let rt=t.places.find(mt=>mt.n==="\u5316\u57CE\u5BFA");rt&&(rt.modelNote="\u6A21\u578B\u6309 OpenStreetMap \u5B9E\u6D4B\u5360\u5730\uFF08\u7EA6 59 \xD7 20 \u7C73\uFF0C\u8F74\u7EBF\u671D\u5411\u653E\u751F\u6C60\uFF09\u590D\u539F\u56DB\u8FDB\u9662\u843D\uFF1A\u7075\u5B98\u6BBF\u3001\u5929\u738B\u6BBF\u3001\u5927\u96C4\u5B9D\u6BBF\u3001\u85CF\u7ECF\u697C\uFF0C\u8FDB\u6DF1\u6309\u5B98\u65B9\u89C4\u5212\u6BD4\u4F8B\u7F29\u653E\uFF0C\u53F0\u57FA\u9010\u8FDB\u5347\u9AD8 3.7 / 1.5 / \u7EA6 1.2 / 2.7 \u7C73\uFF1B\u7B2C\u4E09\u3001\u56DB\u8FDB\u4E4B\u95F4\u4E3A\u7891\u5ECA\u9662\u3002\u5355\u4F53\u7ACB\u9762\u4E0E\u7EC6\u90E8\u4E3A\u8FD1\u4F3C\u3002")}}{let c=t.buildings.find(_=>_.id===ci),g=t.places.find(_=>_.n==="\u8089\u8EAB\u5B9D\u6BBF");if(c&&g){let[_,S]=c.rectCenter,{rot:E,wp:A}=Fa(_,S,-c.axis[0],-c.axis[1]),U=c.depth,W=c.width,H=or(_,S,"\u8089\u8EAB\u5B9D\u6BBF");H.rotation.y=E;let D=H.position.y,j=lt("#55606a",{roughness:.7,metalness:.25}),Y=-1e9,k=1e9;for(let kt=-2;kt<=2;kt++)for(let Mt=-2;Mt<=2;Mt++){let N=v(...A(kt*U/4,Mt*W/4));Y=Math.max(Y,N),k=Math.min(k,N)}let Z=Y-D+.9,J=U-3.6,ot=W-3.6;qt(H,0,k-D-1,0,U+1.2,Z-(k-D-1),W+1.2,Me),qt(H,0,Z,0,J,6.2,ot,yt),rr(H,0,Z+6.2,0,U+1.2,W+1.2,2.4,j,{hip:!0,upturn:!0}),qt(H,0,Z+6.2,0,J*.72,4.6,ot*.72,yt),rr(H,0,Z+10.8,0,J*.72+2.6,ot*.72+2.6,3.6,j,{hip:!0,upturn:!0});let pt=[...Array(6)].map((kt,Mt)=>-(U/2-.45)+Mt*(U-.9)/5),Ut=[1,2,3,4].map(kt=>-(W/2-.45)+kt*(W-.9)/5);for(let kt of[-1,1]){for(let Mt of pt)Ee(H,Mt,Z,kt*(W/2-.45),.22,6.2,Me);for(let Mt of Ut)Ee(H,kt*(U/2-.45),Z,Mt,.22,6.2,Me)}for(let kt of[-J/3,0,J/3])qt(H,kt,Z+.1,ot/2+.02,J/3-.5,4.3,.1,O);qt(H,0,Z+4.8,ot/2+.08,2.6,.8,.12,L);let xt=v(...A(0,W/2+2.5))-D,Ht=Z-xt;if(Ht>.2){let kt=Math.ceil(Ht/.17);for(let Mt=0;Mt<kt;Mt++)qt(H,0,xt-.6,W/2+.6+Mt*.32+.16,6,Z-(Mt+1)*Ht/kt-(xt-.6),.32,Me)}vr.set("\u8089\u8EAB\u5B9D\u6BBF",D+Z+14.4),g.modelNote="\u6309\u5B98\u65B9\u63CF\u8FF0\u590D\u539F\u5317\u5411\u5165\u53E3\u3001\u7EA2\u5899\u3001\u6DF1\u8272\u94C1\u74E6\u91CD\u6A90\u6B47\u5C71\u3001\u7EA6 15 \u7C73\u6BBF\u9AD8\u4E0E 20 \u6839\u5916\u56F4\u77F3\u67F1\uFF1B\u4E3B\u6BBF\u843D\u5728\u5730\u56FE\u70B9\u4F4D\u5904\u7684\u5F71\u50CF\u8BC6\u522B\u8F6E\u5ED3\u4E0A\uFF0C\u4E24\u4FA7\u9EC4\u5899\u914D\u6BBF\u6309\u5404\u81EA\u8F6E\u5ED3\u5EFA\u6A21\u3002\u6BBF\u4F53\u6BD4\u4F8B\u4E0E\u53F0\u9636\u4E3A\u8FD1\u4F3C\u3002"}}function di(c,g,_,{repeat:S=!1}={}){let E=document.createElement("canvas");E.width=c,E.height=g,_(E.getContext("2d"),c,g);let A=new as(E);return A.colorSpace=kn,A.anisotropy=8,S&&(A.wrapS=A.wrapT=no),A}function Rs(c,g,_,S,E,A,U,{back:W=!1,emissive:H=0}={}){let D=new Je(new _s(E,A),We({map:U,roughness:.6,emissive:H?"#ffffff":"#000000",emissiveMap:H?U:null,emissiveIntensity:H}));return D.position.set(g,_+A/2,S),W&&(D.rotation.y=Math.PI),c.add(D),D}let nu='"Songti SC","STSong","Noto Serif SC","PingFang SC",serif';function Nd(c,g){let _=Xn((c+e/2)/e*(s-1),0,s-1.001),S=Xn((g+n/2)/n*(s-1),0,s-1.001),E=_|0,A=S|0,U=_-E,W=S-A,H=o[A*s+E],D=o[A*s+E+1],j=o[(A+1)*s+E],Y=o[(A+1)*s+E+1];return U+W<=1?H+U*(D-H)+W*(j-H):Y+(1-U)*(j-Y)+(1-W)*(D-Y)}function pi(c,g){let _=Nd(c,g);return y?y.height(c,g,_):_}function Od(c,g,_,S,E=3.5,A=[]){let U=Ks.triangulateShape(g.map(D=>new de(D[0],D[1])),A.map(D=>D.map(j=>new de(j[0],j[1])))),W=g.concat(...A),H=(D,j,Y)=>{if(Math.max(Math.hypot(D[0]-j[0],D[1]-j[1]),Math.hypot(j[0]-Y[0],j[1]-Y[1]),Math.hypot(Y[0]-D[0],Y[1]-D[1]))>E){let Z=(Ut,xt)=>[(Ut[0]+xt[0])/2,(Ut[1]+xt[1])/2],J=Z(D,j),ot=Z(j,Y),pt=Z(Y,D);H(D,J,pt),H(J,j,ot),H(pt,ot,Y),H(J,ot,pt);return}(j[1]-D[1])*(Y[0]-D[0])-(j[0]-D[0])*(Y[1]-D[1])<0&&([j,Y]=[Y,j]),c.tri([D[0],pi(...D)+_,D[1]],[j[0],pi(...j)+_,j[1]],[Y[0],pi(...Y)+_,Y[1]],S)};for(let[D,j,Y]of U)H(W[D],W[j],W[Y])}function Fd(c){let g=0;return c.forEach((_,S)=>{let E=c[(S+1)%c.length];g+=_[0]*E[1]-E[0]*_[1]}),g>0?1:-1}function Bd(c,g,{h:_=.3,w:S=.35,co:E="#a39e91"}={}){let A=Fd(g);for(let U=0;U<g.length;U++){let W=g[U],H=g[(U+1)%g.length],D=Math.hypot(H[0]-W[0],H[1]-W[1]);if(D<.05)continue;let j=Math.ceil(D/2.5),Y=-A*(H[1]-W[1])/D*S,k=A*(H[0]-W[0])/D*S;for(let Z=0;Z<j;Z++){let J=[W[0]+(H[0]-W[0])*Z/j,W[1]+(H[1]-W[1])*Z/j],ot=[W[0]+(H[0]-W[0])*(Z+1)/j,W[1]+(H[1]-W[1])*(Z+1)/j],pt=pi(...J),Ut=pi(...ot),xt=[J[0]+Y,J[1]+k],Ht=[ot[0]+Y,ot[1]+k],kt=pi(...xt),Mt=pi(...Ht);c.quad([J[0],pt-.25,J[1]],[ot[0],Ut-.25,ot[1]],[ot[0],Ut+_,ot[1]],[J[0],pt+_,J[1]],E),c.quad([J[0],pt+_,J[1]],[ot[0],Ut+_,ot[1]],[Ht[0],Mt+_,Ht[1]],[xt[0],kt+_,xt[1]],E),c.quad([xt[0],kt+_,xt[1]],[Ht[0],Mt+_,Ht[1]],[Ht[0],Mt+.08,Ht[1]],[xt[0],kt+.08,xt[1]],E)}}}{let c=t.areas.filter(_=>_.kind==="plaza"),g=t.areas.find(_=>_.id==="r4-plaza-lawn");if(c.length){let _=di(512,512,(D,j)=>{let Y=Ui(311),k=64;D.fillStyle="#7f7a70",D.fillRect(0,0,j,j);for(let Z=0;Z<16;Z++)for(let J=-1;J<9;J++){let ot=Y(),pt=J*k+Z%2*k/2,Ut=Z*k/2,xt=((Math.floor((pt+k/4)/256)+Math.floor(Ut/256))%2+2)%2,Ht=xt?[172,166,153]:[188,182,168];D.fillStyle=`rgb(${Ht[0]+ot*18|0},${Ht[1]+ot*16|0},${Ht[2]+ot*14|0})`,D.fillRect(pt+1.5,Ut+1.5,k-3,k/2-3)}D.fillStyle="#857f73",D.fillRect(0,0,j,32),D.fillRect(0,0,32,j),D.fillStyle="#c9c2b0",D.fillRect(0,32,j,5),D.fillRect(32,0,5,j),D.fillRect(0,0,j,3),D.fillRect(0,0,3,j);for(let Z=0;Z<12e3;Z++)D.fillStyle=`rgba(${Y()<.5?"255,255,255":"40,40,36"},${Y()*.1})`,D.fillRect(Y()*j,Y()*j,1.5,1.5)},{repeat:!0}),S=new G,E=new G,A=(D,j)=>{let Y=!1;for(let k=0,Z=j.length-1;k<j.length;Z=k++){let J=j[k],ot=j[Z];J[1]>D[1]!=ot[1]>D[1]&&D[0]<(ot[0]-J[0])*(D[1]-J[1])/(ot[1]-J[1])+J[0]&&(Y=!Y)}return Y};for(let D of c)Od(S,D.ring,.16,"#ffffff",3.5,g&&g.ring.every(j=>A(j,D.ring))?[g.ring]:[]),Bd(E,D.ring);let U=S.mesh(lt("#ffffff",{map:_,roughness:.93}),Lt);if(U.castShadow=!1,g){let D=di(256,256,(N,rt)=>{let mt=Ui(77);N.fillStyle="#6f8b4f",N.fillRect(0,0,rt,rt);for(let st=0;st<6e3;st++)N.fillStyle=`rgba(${mt()<.5?"150,180,100":"50,80,40"},${.25*mt()})`,N.fillRect(mt()*rt,mt()*rt,1,2+mt()*3)},{repeat:!0}),j=new G;Od(j,g.ring,.24,"#ffffff",1.5);let Y=j.mesh(lt("#ffffff",{map:D,roughness:1}),Lt);Y.castShadow=!1,Bd(E,g.ring,{h:.4,w:.3,co:"#b3ad9f"});let k=g.ring,Z=[k.reduce((N,rt)=>N+rt[0],0)/k.length,k.reduce((N,rt)=>N+rt[1],0)/k.length],J=[k[1][0]-k[0][0],k[1][1]-k[0][1]],ot=[k[2][0]-k[1][0],k[2][1]-k[1][1]],pt=Math.hypot(...J),Ut=Math.hypot(...ot),xt=[J[0]/pt,J[1]/pt],Ht=[ot[0]/Ut,ot[1]/Ut],kt=[];for(let N=0;N<=128;N++){let rt=N/128*Math.PI*2;kt.push([Z[0]+xt[0]*Math.cos(rt)*pt*.36+Ht[0]*Math.sin(rt)*Ut*.4,Z[1]+xt[1]*Math.cos(rt)*pt*.36+Ht[1]*Math.sin(rt)*Ut*.4])}let Mt=new G;for(let N=1;N<kt.length;N++){let rt=kt[N-1],mt=kt[N],st=Math.hypot(mt[0]-rt[0],mt[1]-rt[1]),ht=-(mt[1]-rt[1])/st*.8,ut=(mt[0]-rt[0])/st*.8;Mt.quad([rt[0]-ht,pi(rt[0]-ht,rt[1]-ut)+.45,rt[1]-ut],[mt[0]-ht,pi(mt[0]-ht,mt[1]-ut)+.45,mt[1]-ut],[mt[0]+ht,pi(mt[0]+ht,mt[1]+ut)+.45,mt[1]+ut],[rt[0]+ht,pi(rt[0]+ht,rt[1]+ut)+.45,rt[1]+ut],"#c9c3b2")}Mt.mesh(lt("#ffffff",{vertexColors:!0,roughness:.95,side:mn,polygonOffset:!0,polygonOffsetFactor:-2,polygonOffsetUnits:-2}),Lt)}E.mesh(lt("#ffffff",{vertexColors:!0,roughness:.9,side:mn}),Lt);let W=[];for(let D of c){let j=Fd(D.ring),Y=8;for(let k=0;k<D.ring.length;k++){let Z=D.ring[k],J=D.ring[(k+1)%D.ring.length],ot=Math.hypot(J[0]-Z[0],J[1]-Z[1]);if(ot<.05)continue;let pt=-j*(J[1]-Z[1])/ot,Ut=j*(J[0]-Z[0])/ot;for(let xt=Y;xt<ot;xt+=16){let Ht=Z[0]+(J[0]-Z[0])*xt/ot+pt*1.2,kt=Z[1]+(J[1]-Z[1])*xt/ot+Ut*1.2;W.push([Ht,pi(Ht,kt)+.16,kt])}Y=((Y-ot)%16+16)%16}}if(W.length){let D=new vi,j=new Dr(new Wi(.07,.11,4.2,6),lt("#34383a",{roughness:.5,metalness:.4}),W.length),Y=new Dr(new Ri(.46,.62,.46),We({color:"#f3e2b8",emissive:"#ffcf7a",emissiveIntensity:.45,roughness:.5}),W.length),k=new Dr(new io(.42,.34,4),lt("#2f3333"),W.length);W.forEach((Z,J)=>{D.rotation.set(0,Math.PI/4,0),D.position.set(Z[0],Z[1]+2.1,Z[2]),D.updateMatrix(),j.setMatrixAt(J,D.matrix),D.position.set(Z[0],Z[1]+4.45,Z[2]),D.updateMatrix(),Y.setMatrixAt(J,D.matrix),D.position.set(Z[0],Z[1]+4.93,Z[2]),D.updateMatrix(),k.setMatrixAt(J,D.matrix)});for(let Z of[j,Y,k])Z.castShadow=!0,Ct.add(Z)}let H=t.places.find(D=>D.n==="\u795E\u5149\u5CAD\u5E7F\u573A");H&&(vr.set(H.n,v(H.x,H.z)+3),H.modelNote="\u5E7F\u573A\u94FA\u88C5\u3001\u8DEF\u7F18\u3001\u706F\u67F1\u4E0E\u897F\u5317\u89D2\u8349\u576A\u6309\u536B\u661F\u5F71\u50CF\u793A\u610F\u590D\u539F\uFF1B\u94FA\u5730\u7EB9\u6837\u4E0E\u706F\u5177\u6837\u5F0F\u4E3A\u793A\u610F\u3002")}}for(let c of t.roads){if(c.model!=="stair")continue;let[g,_]=c.pts,S=Math.hypot(_[0]-g[0],_[1]-g[1]),E=c.width/2,A=.4,U=E-A,{rot:W,wp:H}=Fa(g[0],g[1],(_[0]-g[0])/S,(_[1]-g[1])/S),D=or(g[0],g[1],"\u4E09\u89D2\u6D32\u8F66\u7AD9");D.rotation.y=W;let j=D.position.y,Y=(rt,mt)=>{let[st,ht]=H(rt,mt);return Math.max(v(st,ht),pi(st,ht))},k=.25,Z=Math.ceil(S/k),J=[];for(let rt=0;rt<=Z;rt++){let mt=-1e9;for(let st=-E;st<=E+.01;st+=E/3)mt=Math.max(mt,Y(st,Math.min(S,rt*k)));J.push(mt+.06)}for(let rt=Z-1;rt>=0;rt--)J[rt]=Math.max(J[rt],J[rt+1]);let ot=J[0],pt=J[Z],Ut=Math.max(1,Math.round((ot-pt)/.15)),xt=(ot-pt)/Ut,Ht=lt("#bdb8aa",{roughness:.85}),kt=lt("#9d998b",{roughness:.9}),Mt=lt("#d2cdc0",{roughness:.8});for(let rt=0,mt=0,st=0;rt<Ut&&st<S;rt++){let ht=ot-rt*xt;for(;mt<Z&&J[mt]>ht-xt+1e-6;)mt++;let ut=Math.min(S,Math.max(st+.28,mt*k)),it=(st+ut)/2,Et=1e9;for(let oe of[st,it,ut])for(let le of[-E,0,E])Et=Math.min(Et,Y(le,oe));let Re=Et-.8-j,Dt=ht-j;qt(D,0,Re,it,2*U,Dt-Re,ut-st,Ht);for(let oe of[-1,1])qt(D,oe*(U+A/2),Re,it,A,Dt+.85-Re,ut-st,kt),qt(D,oe*(U+A/2),Dt+.85,it,A+.1,.1,ut-st,Mt);st=ut}let N=t.places.find(rt=>rt.n==="\u4E09\u89D2\u6D32\u8F66\u7AD9");N&&(N.modelNote="\u8F66\u7AD9\u65C1\u4E0B\u5230\u795E\u5149\u5CAD\u5E7F\u573A\u7684\u53F0\u9636\u6309\u7528\u6237\u8BF4\u660E\u793A\u610F\u590D\u539F\uFF1A\u9AD8\u5DEE\u7EA6 12 \u7C73\uFF08\u5E7F\u573A\u5730\u9762\u5DF2\u6309\u6B64\u4FEE\u6B63\uFF09\uFF1B\u53F0\u9636\u5BBD\u5EA6\u3001\u7EA7\u6570\u548C\u8E0F\u6B65\u5C3A\u5BF8\u4E3A\u4F30\u8BA1\u3002")}{let c=t.buildings.find(_=>_.osmId===609909704),g=t.places.find(_=>_.n==="\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");if(c){let[_,S]=c.rectCenter,E=-c.axis[1],A=c.axis[0];v(_+E*6,S+A*6)>v(_-E*6,S-A*6)&&(E=-E,A=-A);let{rot:U,wp:W}=Fa(_,S,E,A),H=or(_,S,g?g.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8");H.rotation.y=U;let D=H.position.y,j=c.width,Y=c.depth,k=-1e9,Z=1e9;for(let q=-3;q<=3;q++){k=Math.max(k,v(...W(q*j/6,-Y/2)),v(...W(q*j/6,0)));for(let bt of[-Y/2,0,Y/2,Y/2+4])Z=Math.min(Z,v(...W(q*j/6,bt)))}let J=v(...W(0,Y/2+3))-D,ot=Math.max(k-D+.25,J+1.2),pt=Z-D-1.2,Ut=lt("#b3312a",{roughness:.7}),xt=lt("#dcd9cf",{roughness:.6}),Ht=lt("#5d6a74",{roughness:.8}),kt=lt("#2a6184",{roughness:.7}),Mt=new Pn;Mt.position.y=ot,H.add(Mt),qt(H,0,pt,(-Y/2+2.8)/2,j-.2,ot-pt,2.8+Y/2,Me);{let q=ot-J,bt=Math.max(1,Math.ceil(q/.16)),St=new G;for(let Ot=0;Ot<bt;Ot++){let Q=ot-(Ot+1)*q/bt,Nt=2.8+Ot*.32;qt(H,0,pt,Nt+.16,17,Q-pt,.32,xt);for(let xe of[-1,1]){let Wt=xe*8.72;St.quad([Wt-.14*xe,Q,Nt],[Wt-.14*xe,Q,Nt+.32],[Wt-.14*xe,Q+.9,Nt+.32],[Wt-.14*xe,Q+.9,Nt],"#e2dfd6"),St.quad([Wt+.14*xe,Q,Nt],[Wt+.14*xe,Q,Nt+.32],[Wt+.14*xe,Q+.9,Nt+.32],[Wt+.14*xe,Q+.9,Nt],"#d6d3c9"),St.quad([Wt-.14,Q+.9,Nt],[Wt+.14,Q+.9,Nt],[Wt+.14,Q+.9,Nt+.32],[Wt-.14,Q+.9,Nt+.32],"#eeebe3"),Ot%3===0&&qt(H,Wt,Q,Nt+.16,.3,1.15,.3,xt)}}St.mesh(lt("#ffffff",{vertexColors:!0,roughness:.6,side:mn}),H)}let N=10.7,rt=9,mt=new Ur,st=(q,bt,St)=>{mt.lineTo(q-bt,0),mt.lineTo(q-bt,St),mt.absarc(q,St,bt,Math.PI,0,!0),mt.lineTo(q+bt,0)};mt.moveTo(-N,0),st(-6.8,1.9,3.9),st(0,2.7,5.2),st(6.8,1.9,3.9),mt.lineTo(N,0),mt.lineTo(N,rt),mt.lineTo(-N,rt),mt.lineTo(-N,0);let ht=new Je(new Cl(mt,{depth:1.5,bevelEnabled:!1,curveSegments:18}),Ut);ht.position.z=-.2,ht.castShadow=ht.receiveShadow=!0,Mt.add(ht);for(let[q,bt,St]of[[-6.8,1.9,3.9],[0,2.7,5.2],[6.8,1.9,3.9]]){let Ot=new Ur;Ot.moveTo(q-bt-.32,0),Ot.lineTo(q-bt-.32,St),Ot.absarc(q,St,bt+.32,Math.PI,0,!0),Ot.lineTo(q+bt+.32,0),Ot.lineTo(q+bt,0),Ot.lineTo(q+bt,St),Ot.absarc(q,St,bt,0,Math.PI,!1),Ot.lineTo(q-bt,0),Ot.lineTo(q-bt-.32,0);let Q=new Je(new Cl(Ot,{depth:.06,bevelEnabled:!1,curveSegments:18}),lt("#e4ddca",{roughness:.6}));Q.position.z=1.3,Mt.add(Q)}for(let q of[-9.7,-3.8,3.8,9.7])qt(Mt,q,0,.55,q*q>40?2.3:2.5,.7,1.8,xt);let ut=q=>di(128,700,(bt,St,Ot)=>{bt.fillStyle="#a52a22",bt.fillRect(0,0,St,Ot),bt.strokeStyle="#d9b04a",bt.lineWidth=5,bt.strokeRect(8,8,St-16,Ot-16),bt.fillStyle="#f0c85a",bt.font=`700 70px ${nu}`,bt.textAlign="center",bt.textBaseline="middle",[...q].forEach((Q,Nt)=>bt.fillText(Q,St/2,50+Nt*(Ot-100)/(q.length-1)))});Rs(Mt,-3.8,2.95,1.33,1.05,5.85,ut("\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B")),Rs(Mt,3.8,2.95,1.33,1.05,5.85,ut("\u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0"));let it=di(2048,160,(q,bt,St)=>{q.fillStyle="#1f4f78",q.fillRect(0,0,bt,St),q.fillStyle="#2f8466",q.fillRect(0,0,bt,26),q.fillRect(0,St-26,bt,26),q.fillStyle="#d8ad45",q.fillRect(0,26,bt,5),q.fillRect(0,St-31,bt,5);let Ot=Ui(5);for(let Q=40;Q<bt;Q+=170){q.strokeStyle="#e8e4d6",q.lineWidth=4,q.beginPath(),q.arc(Q,St/2,34,0,Math.PI*2),q.stroke(),q.fillStyle="#3a7fb0",q.beginPath(),q.arc(Q,St/2,26,0,Math.PI*2),q.fill(),q.fillStyle="#d8ad45",q.beginPath(),q.arc(Q,St/2,9,0,Math.PI*2),q.fill(),q.strokeStyle="#d8ad45",q.lineWidth=5,q.beginPath(),q.moveTo(Q+48,St/2);for(let Nt=0;Nt<6;Nt++)q.quadraticCurveTo(Q+58+Nt*14,St/2+(Nt%2?-22:22)*(.6+Ot()*.4),Q+66+Nt*14,St/2);q.stroke()}for(let Q=0;Q<bt;Q+=18)q.fillStyle=Q%36?"#f4f1e6":"#c44b3a",q.fillRect(Q,8,10,10),q.fillRect(Q,St-18,10,10)});qt(Mt,0,rt,.55,2*N+.5,1.75,1.75,kt),Rs(Mt,0,rt,1.43,2*N+.5,1.75,it),Rs(Mt,0,rt,-.33,2*N+.5,1.75,it,{back:!0});let Et=di(840,250,(q,bt,St)=>{q.fillStyle="#b8862f",q.fillRect(0,0,bt,St),q.fillStyle="#e3bf62",q.fillRect(10,10,bt-20,St-20),q.fillStyle="#161412",q.fillRect(34,34,bt-68,St-68),q.fillStyle="#e6c25e",q.font=`700 132px ${nu}`,q.textAlign="center",q.textBaseline="middle",["\u76E1","\u7121","\u9858","\u884C"].forEach((Ot,Q)=>q.fillText(Ot,bt*(.2+.2*Q),St/2+4))});Rs(Mt,0,rt+.15,1.5,4.2,1.25,Et,{emissive:.12});let Re=di(512,160,(q,bt,St)=>{q.fillStyle="#2c6a52",q.fillRect(0,0,bt,St);for(let Ot=0;Ot<bt;Ot+=64)q.fillStyle="#1f4f78",q.fillRect(Ot+6,20,52,70),q.fillStyle="#d8ad45",q.fillRect(Ot+26,10,12,90),q.fillStyle="#8a2f25",q.fillRect(Ot+4,100,56,40);q.fillStyle="#d8ad45",q.fillRect(0,0,bt,6),q.fillRect(0,St-6,bt,6)});qt(Mt,0,rt+1.75,.55,6.8,2.55,1.3,kt),Rs(Mt,0,rt+1.75,1.21,6.8,2.55,Re),Rs(Mt,0,rt+1.75,-.11,6.8,2.55,Re,{back:!0});let Dt=di(180,320,(q,bt,St)=>{q.fillStyle="#c79a3c",q.fillRect(0,0,bt,St),q.fillStyle="#1a1715",q.fillRect(22,34,bt-44,St-68),q.fillStyle="#e6c25e",q.font=`700 92px ${nu}`,q.textAlign="center",q.textBaseline="middle",q.fillText("\u5C71",bt/2,St*.33),q.fillText("\u9580",bt/2,St*.68)});Rs(Mt,0,rt+1.95,1.25,.8,1.45,Dt,{emissive:.12});for(let q of[-1,1])qt(Mt,q*6.8,rt+1.75,.55,4.8,1.05,1.1,kt),Rs(Mt,q*6.8,rt+1.75,1.11,4.8,1.05,Re);rr(Mt,0,rt+4.3,.55,9.4,4.8,2.3,Ht,{hip:!0,upturn:!0});for(let q of[-1,1])rr(Mt,q*6.8,rt+2.8,.55,6.4,4.2,1.8,Ht,{hip:!0,upturn:!0}),rr(Mt,q*10.4,rt+1.7,.55,3.6,3.8,1.5,Ht,{hip:!0,upturn:!0});{let q=rt+4.3+2.3,bt=lt("#3d4a44",{roughness:.6,metalness:.2}),St=new Je(new Xi(.26,12,10),L);St.position.set(0,q+.55,.55),Mt.add(St),Ee(Mt,0,q,.55,.08,.35,L);for(let Ot of[-1,1]){let Q=[];for(let Ce=0;Ce<=12;Ce++){let ln=Ce/12;Q.push(new X(Ot*(.45+ln*2.1),q+.12+Math.sin(ln*Math.PI*2.2)*.22+(1-ln)*.25,.55))}let Nt=new Je(new Sh(new Ro(Q),32,.09,6),bt);Mt.add(Nt);let xe=new Je(new Xi(.16,8,6),bt);xe.position.copy(Q[0]),xe.position.y+=.12,Mt.add(xe);let Wt=qt(Mt,Ot*2.78,q-.1,.55,.28,.95,.32,bt);Wt.rotation.z=-Ot*.25}}let oe=di(128,128,(q,bt)=>{q.fillStyle="#22201e",q.fillRect(0,0,bt,bt);for(let St of[32,96])for(let Ot of[32,96]){let Q=q.createRadialGradient(St-5,Ot-5,2,St,Ot,15);Q.addColorStop(0,"#77716a"),Q.addColorStop(1,"#2a2724"),q.fillStyle=Q,q.beginPath(),q.arc(St,Ot,13,0,Math.PI*2),q.fill()}},{repeat:!0});oe.repeat.set(2,2);let le=new Ur,ie=q=>{let bt=Math.abs(q);return bt<3.9?6.7+.9*(q/3.9)**2:5.3+.9*((bt-7.15)/3.25)**2};le.moveTo(-10.4,0),le.lineTo(10.4,0);for(let q=0;q<=80;q++){let bt=10.4-q*20.8/80;le.lineTo(bt,ie(bt))}le.lineTo(-10.4,0);let ee=new Je(new Pl(le,4),We({map:oe,roughness:.55,metalness:.35,side:mn}));ee.position.z=-1.15,Mt.add(ee);for(let q of[-1,1]){let bt=new Je(new bh(.24,.045,6,16),L);bt.position.set(q*.75,3.1,-1.08),Mt.add(bt)}let ge=lt("#cfcbc0",{roughness:.8});for(let q of[-9.7,-3.8,3.8,9.7]){qt(Mt,q,0,2.05,1.15,1.25,1.25,xt);let bt=new Pn;bt.position.set(q,1.25,2.05),Mt.add(bt),qt(bt,0,0,-.05,.62,.75,.95,ge);let St=new Je(new Xi(.4,10,8),ge);St.position.set(0,1.05,.2),St.scale.set(1,.95,.85),bt.add(St);let Ot=new Je(new Xi(.47,10,8),ge);Ot.position.set(0,.95,.05),Ot.scale.set(1.05,1,.7),bt.add(Ot);let Q=new Je(new Xi(.17,8,6),ge);Q.position.set(q<0?.22:-.22,.1,.42),bt.add(Q)}for(let q of[-1,1])qt(Mt,q*11.75,0,.1,1.7,4.2,.9,lt("#d6a13a")),qt(Mt,q*11.75,4.2,.1,2,.32,1.3,Ht);vr.set(g?g.n:"\u8089\u8EAB\u5B9D\u6BBF\u5317\u95E8",D+ot+17),g&&(g.modelNote="\u95E8\u697C\u6309\u7528\u6237\u63D0\u4F9B\u7684\u5B9E\u666F\u7167\u7247\u590D\u539F\uFF1A\u4E09\u62F1\u7EA2\u8272\u724C\u697C\u3001\u5185\u4FA7\u4E24\u67F1\u91D1\u5B57\u5BF9\u8054\uFF08\u5730\u7344\u672A\u7A7A\u8A93\u4E0D\u6210\u4F5B / \u773E\u751F\u5EA6\u76E1\u65B9\u8B49\u83E9\u63D0\uFF09\u3001\u5F69\u753B\u989D\u678B\u3001\u4E2D\u533E\u201C\u884C\u9858\u7121\u76E1\u201D\u3001\u4E0A\u90E8\u201C\u5C71\u9580\u201D\u7AD6\u533E\u3001\u4E94\u5EA7\u5C4B\u9876\uFF0C\u62F1\u540E\u4E3A\u9ED1\u8272\u94C1\u9489\u5927\u95E8\uFF0C\u95E8\u524D\u77F3\u72EE\u4E0E\u6C49\u767D\u7389\u680F\u6746\u77F3\u9636\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002")}}{let c=t.buildings.find(S=>S.osmId===609909706),g=t.buildings.find(S=>S.osmId===609909704),_=t.places.find(S=>S.n==="\u8089\u8EAB\u5B9D\u6BBF-\u5730\u85CF\u7985\u5BFA");if(c){let[S,E]=c.rectCenter,A=-c.axis[0],U=-c.axis[1];g&&(g.center[0]-S)*A+(g.center[1]-E)*U<0&&(A=-A,U=-U);let{rot:W,wp:H}=Fa(S,E,A,U),D=Math.cos(W),j=Math.sin(W),Y=([Q,Nt])=>[(Q-S)*D-(Nt-E)*j,(Q-S)*j+(Nt-E)*D],k=c.ring.map(Y),Z=k.map(Q=>Q[0]),J=(Math.max(...Z)-Math.min(...Z))/2,ot=(Math.max(...Z)+Math.min(...Z))/2,pt=k.filter(Q=>Math.abs(Q[0]-ot)>J*.6),Ut=Math.max(...pt.map(Q=>Q[1])),xt=Math.min(...pt.map(Q=>Q[1])),Ht=Math.min(...k.map(Q=>Q[1])),kt=k.filter(Q=>Q[1]<xt-.5),Mt=or(S,E,_?_.n:"\u5730\u85CF\u7985\u5BFA");Mt.rotation.y=W;let N=Mt.position.y,rt=lt("#a8302a",{roughness:.7}),mt=lt("#5d6a74",{roughness:.8}),st=lt("#d6a23c"),ht=lt("#4a2a22"),ut=[],it=1e9;for(let Q=0;Q<=6;Q++)for(let Nt=0;Nt<=6;Nt++){let xe=v(...H(ot-J+Q*J/3,xt+(Ut-xt)*Nt/6));ut.push(xe),it=Math.min(it,xe)}ut.sort((Q,Nt)=>Q-Nt);let Et=ut[Math.floor(ut.length*.7)]-N+.5,Re=it-N-1.2,Dt=2*J,oe=Ut-xt,le=(Ut+xt)/2;qt(Mt,ot,Re,le,Dt+1.6,Et-Re,oe+1.6,Me);{let Q=v(...H(ot,Ut+4))-N,Nt=Et-Q;if(Nt>.2){let xe=Math.ceil(Nt/.16);for(let Wt=0;Wt<xe;Wt++)qt(Mt,ot,Re,Ut+.8+Wt*.3+.15,10,Et-(Wt+1)*Nt/xe-Re,.3,Me);for(let Wt of[-1,1])qt(Mt,ot+Wt*5.3,Re,Ut+.8+xe*.15,.5,Et+.9-Re,xe*.3,Me)}}let ie=6.8;qt(Mt,ot,Et,le,Dt-4.4,ie,oe-4.4,st);let ee=di(256,256,(Q,Nt)=>{Q.fillStyle="#6b2a20",Q.fillRect(0,0,Nt,Nt),Q.strokeStyle="#3a1a14",Q.lineWidth=3;for(let xe=8;xe<Nt;xe+=16)Q.beginPath(),Q.moveTo(xe,0),Q.lineTo(xe,Nt*.7),Q.stroke(),Q.beginPath(),Q.moveTo(0,xe*.7),Q.lineTo(Nt,xe*.7),Q.stroke();Q.fillStyle="#5a221a",Q.fillRect(0,Nt*.72,Nt,Nt*.28),Q.strokeStyle="#c9a24a",Q.lineWidth=4,Q.strokeRect(4,4,Nt-8,Nt-8)}),ge=7;for(let Q=0;Q<ge;Q++){let Nt=ot-(Dt-4.4)/2+(Q+.5)*(Dt-4.4)/ge;Rs(Mt,Nt,Et+.15,Ut-2.2+.03,(Dt-4.4)/ge-.35,ie*.75,ee)}for(let Q=0;Q<=8;Q++){let Nt=ot-Dt/2+.6+Q*(Dt-1.2)/8;Ee(Mt,Nt,Et,Ut-.6,.3,ie,rt),Ee(Mt,Nt,Et,xt+.6,.3,ie,rt)}for(let Q=1;Q<7;Q++){let Nt=xt+.6+Q*(oe-1.2)/7;Ee(Mt,ot-Dt/2+.6,Et,Nt,.3,ie,rt),Ee(Mt,ot+Dt/2-.6,Et,Nt,.3,ie,rt)}qt(Mt,ot,Et+ie-.9,Ut-.6,Dt-.6,.9,.5,rt),rr(Mt,ot,Et+ie,le,Dt+2.4,oe+2.4,3.1,mt,{hip:!0,upturn:!0});let q=Dt*.6,bt=oe*.55,St=5.4;qt(Mt,ot,Et+ie,le,q,St,bt,ht);for(let Q=0;Q<=6;Q++)Ee(Mt,ot-q/2+.3+Q*(q-.6)/6,Et+ie+2.2,le+bt/2+.25,.24,St-2.2,rt);for(let Q=0;Q<6;Q++){let Nt=ot-q/2+.3+(Q+.5)*(q-.6)/6;Rs(Mt,Nt,Et+ie+2.6,le+bt/2+.02,(q-.6)/6-.4,2.2,ee)}let Ot=di(420,140,(Q,Nt,xe)=>{Q.fillStyle="#c79a3c",Q.fillRect(0,0,Nt,xe),Q.fillStyle="#1a1715",Q.fillRect(16,16,Nt-32,xe-32),Q.strokeStyle="#e6c25e",Q.lineWidth=3,Q.strokeRect(24,24,Nt-48,xe-48)});Rs(Mt,ot,Et+ie+St-1.6,le+bt/2+.35,3.6,1.2,Ot),rr(Mt,ot,Et+ie+St,le,q+3.4,bt+3.4,3.8,mt,{hip:!0,upturn:!0});{let Q=Et+ie+St+3.8,Nt=lt("#3d4a44",{roughness:.6,metalness:.2}),xe=Math.max(1,(q+3.4)/2-(bt+3.4)/2*.8);for(let Ce of[-1,1]){let ln=qt(Mt,ot+Ce*xe,Q-.15,le,.35,1.2,.4,Nt);ln.rotation.z=-Ce*.25}Ee(Mt,ot,Q,le,.1,.5,L);let Wt=new Je(new Xi(.3,12,10),L);Wt.position.set(ot,Q+.75,le),Mt.add(Wt)}if(kt.length){let Q=kt.map(nn=>nn[0]),Nt=Math.max(...Q)-Math.min(...Q),xe=(Math.max(...Q)+Math.min(...Q))/2,Wt=(xt+Ht)/2,Ce=xt-Ht,ln=Math.max(...[0,.5,1].map(nn=>v(...H(xe,Ht+Ce*nn))))-N;qt(Mt,xe,Math.min(ln,Et)-1,Wt,Nt,Math.max(Et,ln+.3)-Math.min(ln,Et)+1+4.6,Ce,st),rr(Mt,xe,Math.max(Et,ln+.3)+4.6,Wt,Nt+1.6,Ce+1.6,2,mt,{hip:!0,upturn:!0})}vr.set(_?_.n:"\u5730\u85CF\u7985\u5BFA",Math.max(vr.get(_?.n)??0,N+Et+ie+St+5)),_&&(_.modelNote="\u5317\u95E8\u540E\u7684\u5927\u6BBF\u6309\u7528\u6237\u6307\u8BA4\uFF08OSM way 609909706\uFF09\u505A\u6210\u91CD\u6A90\u6B47\u5C71\u6BBF\u5802\uFF1A\u77F3\u53F0\u57FA\u3001\u7EA2\u67F1\u56DE\u5ECA\u3001\u6728\u683C\u95E8\u3001\u9EC4\u5899\u3001\u4E0A\u5C42\u6728\u6784\u3002\u6BBF\u540D\u4E0E\u5C3A\u5BF8\u672A\u89C1\u516C\u5F00\u8D44\u6599\uFF0C\u5F62\u5236\u4E3A\u793A\u610F\uFF1B\u9662\u4E2D\u65B9\u4EAD\u6309\u536B\u661F\u5F71\u50CF\u4E0E\u5B9E\u666F\u7167\u7247\u8865\u51FA\u3002");{let[Q,Nt]=[-1807,82],xe=or(Q,Nt,_?_.n:"\u5730\u85CF\u7985\u5BFA");xe.rotation.y=W,qt(xe,0,-1.2,0,7.6,1.6,7.6,Me);for(let ln of[-1,1])for(let nn of[-1,1])Ee(xe,ln*2.9,.4,nn*2.9,.22,3.6,rt);qt(xe,0,3.6,0,6.4,.45,6.4,lt("#2a6184",{roughness:.7})),rr(xe,0,4.05,0,8.6,8.6,2.8,mt,{hip:!0,upturn:!0});let Wt=new Je(new Xi(.28,12,10),L);Wt.position.set(0,7.2,0),xe.add(Wt),Ee(xe,0,6.8,0,.08,.4,L);let Ce=lt("#6a5534",{roughness:.45,metalness:.55});Ee(xe,0,.4,0,.7,1.1,Ce),rr(xe,0,1.5,0,1.7,1.7,.7,Ce,{hip:!0,upturn:!0})}}}let ao=null;{let c=t.areas.find(_=>_.id==="r4-juzhilin-site"),g=t.places.find(_=>_.featured);if(c&&g){let pt=function(b,F,$,_t,Bt,Vt=256){return di(Vt,Vt,(ne,Se)=>{let qe=Ui(b),He=[];for(let Sn=0;Sn<F;Sn++)for(let Un=0;Un<F;Un++)He.push([(Un+.12+.76*qe())*Se/F,(Sn+.12+.76*qe())*Se/F,ot($[Math.floor(qe()*$.length)]),.86+.28*qe()]);let cn=ne.createImageData(Se,Se),vn=ot(_t);for(let Sn=0;Sn<Se;Sn++)for(let Un=0;Un<Se;Un++){let On=1e9,bi=1e9,Ss=null;for(let ns of He){let ur=Math.abs(Un-ns[0]),il=Math.abs(Sn-ns[1]);ur=Math.min(ur,Se-ur),il=Math.min(il,Se-il);let fc=ur*ur+il*il;fc<On?(bi=On,On=fc,Ss=ns):fc<bi&&(bi=fc)}let Es=(Sn*Se+Un)*4,Os=Math.sqrt(bi)-Math.sqrt(On),Gr=(qe()-.5)*18;if(Os<Bt)for(let ns=0;ns<3;ns++)cn.data[Es+ns]=vn[ns]+Gr*.4;else{let ns=Ss[3]*(Os<Bt+2.5?.82:1);for(let ur=0;ur<3;ur++)cn.data[Es+ur]=Ss[2][ur]*ns+Gr}cn.data[Es+3]=255}ne.putImageData(cn,0,0)},{repeat:!0})},vt=function(b,F,$,_t,Bt,Vt,ne,Se=2){if($-F<.001||Bt-_t<.001||ne-Vt<.001)return;let qe=$-F,He=Bt-_t,cn=ne-Vt,vn=new Ri(qe,He,cn),Sn=vn.attributes.uv,Un=[[cn,He,Vt,_t],[cn,He,Vt,_t],[qe,cn,F,Vt],[qe,cn,F,Vt],[qe,He,F,_t],[qe,He,F,_t]];for(let On=0;On<6;On++)for(let bi=0;bi<4;bi++){let Ss=On*4+bi;Sn.setXY(Ss,(Sn.getX(Ss)*Un[On][0]+Un[On][2])/Se,(Sn.getY(Ss)*Un[On][1]+Un[On][3])/Se)}vn.translate((F+$)/2,(_t+Bt)/2,-(Vt+ne)/2),gi(vn,b)},wi=function(b,F,$,_t,Bt,Vt=[[0,0],[1,0],[1,1],[0,1]]){let ne=new Ln,Se=[F,$,_t,F,_t,Bt].map(Ip).flat(),qe=[0,1,2,0,2,3].map(He=>Vt[He]).flat();ne.setAttribute("position",new Qe(Se,3)),ne.setAttribute("uv",new Qe(qe,2)),ne.computeVertexNormals(),gi(ne,b)},Yx=function(b,F,$,_t,Bt=[[0,0],[1,0],[.5,1]]){let Vt=new Ln;Vt.setAttribute("position",new Qe([F,$,_t].map(Ip).flat(),3)),Vt.setAttribute("uv",new Qe(Bt.flat(),2)),Vt.computeVertexNormals(),gi(Vt,b)},Sr=function(b,F,$=1.05){for(let _t=1;_t<b.length;_t++){let Bt=b[_t-1],Vt=b[_t],ne=F[_t-1],Se=F[_t];wi(Ka,[Bt[0],ne,Bt[1]],[Vt[0],Se,Vt[1]],[Vt[0],Se+$,Vt[1]],[Bt[0],ne+$,Bt[1]]);let qe=new Ri(1,1,1),He=Vt[0]-Bt[0],cn=Vt[1]-Bt[1],vn=Math.hypot(He,cn);qe.scale(vn,.035,.05),qe.rotateY(Math.atan2(cn,He)),qe.rotateZ(0),qe.translate((Bt[0]+Vt[0])/2,(ne+Se)/2+$,-(Bt[1]+Vt[1])/2),gi(qe,sc)}},xi=function(b,F,$,_t=Cn){ds(_t,b,F,$,.3,.42,10,.26),Hi(_t,b,F+.62,$+.18,.3,.28,.12)},Ws=function(b,F,$,_t=.45){ds(zn,b,F,$,.05,.7,6),ds(jn,b,F+.7,$,_t,.05,16)},Hr=function(b,F,$,_t=.12,Bt=.35,Vt=1){vt(Ls,b-_t/2,b+_t/2,F,F+Bt,$-.02,$+.04*Vt)},_=c.frame,S=_.origin,E=_.u,A=[E[1],-E[0]],U=_.length,W=_.depth,H=_.front,D=-9,j=(b,F)=>[S[0]+E[0]*b+A[0]*F,S[1]+E[1]*b+A[1]*F],Y=v(...j(3,H))+.25,k=b=>v(...j(b,H))+.25-Y,Z=(b,F)=>pi(...j(b,F))-Y;li.o.set(S[0],S[1],E[0],E[1]),li.s.set(0,U,H,W);let J=or(S[0],S[1],g.n);J.position.y=Y,J.rotation.y=Math.atan2(-A[0],-A[1]);let ot=b=>[parseInt(b.slice(1,3),16),parseInt(b.slice(3,5),16),parseInt(b.slice(5,7),16)],Ut=pt(41,9,["#8e8b84","#7d7a73","#9a968d","#6f6d68","#a8a296"],"#c9c5bb",1.6),xt=pt(57,7,["#a8855f","#94765a","#b99c78","#7f6a55","#c2a784","#8c7b6b"],"#efe9dc",2.4),Ht=di(256,256,(b,F)=>{let $=Ui(9);for(let _t=0;_t<16;_t++){let Bt=$();b.fillStyle=`rgb(${104+Bt*18|0},${70+Bt*12|0},${48+Bt*9|0})`,b.fillRect(_t*16,0,16,F),b.fillStyle="#3b2618",b.fillRect(_t*16+14,0,2,F)}for(let _t=0;_t<2500;_t++)b.fillStyle=`rgba(40,22,12,${$()*.12})`,b.fillRect($()*F,$()*F,1,6+$()*14)},{repeat:!0}),kt=di(256,256,(b,F)=>{let $=Ui(13);for(let _t=0;_t<18;_t++){let Bt=_t*F/18;for(let Vt=-(_t*53%120);Vt<F;Vt+=120+_t*31%60){let ne=$();b.fillStyle=`rgb(${120+ne*22|0},${80+ne*14|0},${60+ne*10|0})`,b.fillRect(Vt,Bt,118+_t*31%60,F/18-1.6)}}for(let _t=0;_t<3e3;_t++)b.fillStyle=`rgba(50,28,18,${$()*.1})`,b.fillRect($()*F,$()*F,10+$()*20,1)},{repeat:!0}),Mt=di(256,256,(b,F)=>{let $=Ui(21);b.fillStyle="#5e2716",b.fillRect(0,0,F,F);let _t=F/10,Bt=F/8;for(let Vt=0;Vt<8;Vt++)for(let ne=0;ne<10;ne++){let Se=ne*_t,qe=Vt*Bt,He=$(),cn=b.createLinearGradient(Se,0,Se+_t,0),vn=[184+He*20,86+He*16,48+He*10];cn.addColorStop(0,`rgb(${vn[0]*.55|0},${vn[1]*.55|0},${vn[2]*.55|0})`),cn.addColorStop(.45,`rgb(${vn[0]|0},${vn[1]|0},${vn[2]|0})`),cn.addColorStop(.62,`rgb(${Math.min(255,vn[0]*1.14)|0},${vn[1]*1.12|0},${vn[2]*1.1|0})`),cn.addColorStop(1,`rgb(${vn[0]*.5|0},${vn[1]*.5|0},${vn[2]*.5|0})`),b.fillStyle=cn,b.fillRect(Se+1,qe+2,_t-2,Bt-2),b.fillStyle="rgba(40,14,6,.55)",b.fillRect(Se,qe,_t,3)}},{repeat:!0}),N=(b,F,$)=>di(128,128,(_t,Bt)=>{let Vt=Ui($);_t.fillStyle=b,_t.fillRect(0,0,Bt,Bt);for(let ne=0;ne<3500;ne++)_t.fillStyle=F[Math.floor(Vt()*F.length)],_t.fillRect(Vt()*Bt,Vt()*Bt,1+Vt()*1.5,1+Vt()*1.5)},{repeat:!0}),rt=N("#cdc2ae",["#e6dccb","#a99b86","#bfb09a","#8f8270"],3),mt=N("#565f6b",["#79828d","#3c434c","#8b939c","#4a525c"],4),st=N("#edebe5",["#f6f4ef","#e2dfd7","#e8e5de"],5),ht=di(128,128,(b,F)=>{b.fillStyle="#d8d3c7",b.fillRect(0,0,F,F),b.strokeStyle="#b8b2a5",b.lineWidth=2;for(let $=0;$<=F;$+=F/2)b.beginPath(),b.moveTo($,0),b.lineTo($,F),b.stroke(),b.beginPath(),b.moveTo(0,$),b.lineTo(F,$),b.stroke()},{repeat:!0}),ut=di(256,192,(b,F,$)=>{let _t=b.createLinearGradient(0,0,0,$);_t.addColorStop(0,"#ffe2ad"),_t.addColorStop(.55,"#f4bf73"),_t.addColorStop(1,"#c8813e"),b.fillStyle=_t,b.fillRect(0,0,F,$),b.fillStyle="#f7ecd6",b.fillRect(F*.1,$*.62,F*.46,$*.2),b.fillStyle="#8a5a36",b.fillRect(F*.1,$*.52,F*.46,$*.1),b.fillStyle="#fff3d8",b.beginPath(),b.arc(F*.75,$*.34,$*.1,0,Math.PI*2),b.fill(),b.fillStyle="#6d4a30",b.fillRect(F*.72,$*.44,F*.06,$*.4),b.fillStyle="#2a2b2d",b.fillRect(0,0,F,7),b.fillRect(0,$-7,F,7),b.fillRect(0,0,7,$),b.fillRect(F-7,0,7,$),b.fillRect(F/2-3,0,6,$)}),it=(b,F={})=>We({color:b,roughness:.85,side:mn,...F}),Et=it("#ffffff",{map:st}),Re=it("#223044"),Dt=it("#ffffff",{map:Ht,roughness:.75}),oe=it("#ffffff",{map:Ut,roughness:.95}),le=it("#ffffff",{map:xt,roughness:.95}),ie=it("#ffffff",{map:Mt,roughness:.7}),ee=it("#8a3b21",{roughness:.7}),ge=it("#ffffff",{map:kt,roughness:.8}),q=it("#ffffff",{map:rt}),bt=it("#ffffff",{map:mt}),St=it("#ffffff",{map:ht}),Ot=it("#a9a99f"),Q=it("#c9c4b8"),Nt=it("#2c2e31",{roughness:.5}),xe=it("#6e2c1f",{roughness:.6}),Wt=it("#4a4e52",{roughness:.6}),Ce=it("#ddd8cc"),ln=it("#ebe8e0"),nn=it("#8d3c26"),Jn=it("#9a6a36"),Gs=it("#56683a"),Oi=it("#3b5a33"),wn=it("#5b4636"),Yn=it("#bd8e78"),Cn=it("#a9763d"),jn=it("#6b4a30"),zn=it("#26282b",{roughness:.45,metalness:.5}),Yo=it("#c93a24"),$o=it("#17344d",{roughness:.06,metalness:.45}),Ka=We({color:"#cfeee9",transparent:!0,opacity:.26,roughness:.05,metalness:.1,side:mn,depthWrite:!1}),sc=it("#8fe0d2",{emissive:"#7fe7d6",emissiveIntensity:.55}),Fi=it("#ffb24a",{emissive:"#ff9f2e",emissiveIntensity:2.2}),Ls=it("#ffdca0",{emissive:"#ffc46b",emissiveIntensity:1.8}),Ci=We({map:ut,emissive:"#ffffff",emissiveMap:ut,emissiveIntensity:.8,roughness:.25,side:mn}),br=new Map,gi=(b,F)=>{br.has(F)||br.set(F,[]),br.get(F).push(b.index?b.toNonIndexed():b)},Ip=([b,F,$])=>[b,F,-$],Zo=(b,F,$,_t,Bt,Vt)=>{let ne=new _s($-F,Bt-_t);ne.translate((F+$)/2,(_t+Bt)/2,-Vt),gi(ne,b)},rc=(b,F,$,_t,Bt,Vt,ne)=>{let Se=new _s(_t-$,Vt-Bt);Se.rotateY(ne*Math.PI/2),Se.translate(F,(Bt+Vt)/2,-($+_t)/2),gi(Se,b)},ds=(b,F,$,_t,Bt,Vt,ne=12,Se=Bt)=>{let qe=new Wi(Se,Bt,Vt,ne);qe.translate(F,$+Vt/2,-_t),gi(qe,b)},Hi=(b,F,$,_t,Bt,Vt,ne)=>{let Se=new Xi(1,10,7);Se.scale(Bt,Vt,ne),Se.translate(F,$,-_t),gi(Se,b)},$x=(b,F,$,_t,Bt=.5)=>{let Vt=Ui(Math.round(b*97+_t*13));for(let ne=b+.3;ne<F-.1;ne+=.55)Hi(Vt()<.7?nn:Jn,ne,$+.22,_t+(Vt()-.5)*Bt*.4,.38,.3+Vt()*.12,Bt*.55)},kr=(b,F,$,_t,Bt,Vt=.55)=>{vt(ln,b,F,$,$+Vt,_t,Bt),$x(b,F,$+Vt,(_t+Bt)/2,Bt-_t)},Jo=(b,F,$,_t,Bt,Vt)=>Sr([[b,F],[$,_t]],[Bt,Bt],Vt),Yt=4.2,Oe=8.4,Kn=.6,Fe=Math.min(k(32)+.45,0),Qn=6.5,ri=24.5,yi=27.3,Zx=38,Xe=44.3,ti=36.6,ke=3.65,Dn=k(Xe),yn=Yt+1.4;for(let b=0;b<Xe-1e-6;b+=1){let F=Math.min(Xe,b+1),$=k(b),_t=k(F);wi(Ot,[b,$,1.2],[F,_t,1.2],[F,_t,H],[b,$,H],[[b/2,.6],[F/2,.6],[F/2,-.4],[b/2,-.4]]),wi(Ot,[b,D,H],[F,D,H],[F,_t,H],[b,$,H])}wi(Ot,[0,D,1.2],[0,D,H],[0,k(0),H],[0,k(0),1.2]),vt(Re,0,Qn,D,.38,1,8.5),vt(Et,0,Qn,.38,3.95,1,8.5,4),vt(Q,-.05,Qn+.05,3.95,Yt,.95,8.5),vt(q,0,Qn,Yt,Yt+.02,1,8.5);for(let b of[1.85,4.65])Zo(Ci,b-1.1,b+1.1,.95,3,.99),vt(Nt,b-1.16,b+1.16,.89,.95,.94,1),vt(Nt,b-1.16,b+1.16,3,3.06,.94,1);Hr(3.25,2.1,.97,.12,.32),Hr(.35,2.1,.97,.12,.32),Hr(Qn-.35,2.1,.97,.12,.32),rc(Ci,-.01,4.2,6.4,1,2.9,-1),Jo(0,1.02,Qn,1.02,Yt,1.05),Jo(.02,1,.02,8.5,Yt,1.05),Jo(Qn-.02,1,Qn-.02,4.6,Yt,1.05),ds(ln,1.5,Yt,2.6,.78,.5,24),Hi(nn,1.5,Yt+.75,2.6,.62,.36,.62),xi(3.6,Yt,2.2,zn),xi(4.6,Yt,2.5,zn),Ws(4.1,Yt,3.2,.3),vt(oe,Qn,ri,D,Kn,1.2,4.6,3),vt(St,Qn,ri,Kn,Kn+.04,1.75,4.6),vt(oe,Qn,ri,Kn,Kn+1.05,1.2,1.75,3),vt(Q,Qn-.05,ri,Kn+1.05,Kn+1.15,1.15,1.8);let Cu=(ri-Qn)/5;for(let b=0;b<5;b++){let F=Qn+(b+.5)*Cu;Zo(Ci,F-1.15,F+1.15,Kn+.08,Kn+2.6,4.52),vt(Nt,F-1.2,F+1.2,Kn+2.6,Kn+2.68,4.5,4.56),vt(Nt,F-.03,F+.03,Kn+.08,Kn+2.6,4.49,4.53),xi(F-.75,Kn,3),xi(F+.75,Kn,3),Ws(F,Kn,2.6,.28),b&&vt(oe,Qn+b*Cu-.2,Qn+b*Cu+.2,Kn,Kn+1.75,1.75,4.5,3)}vt(Et,Qn,ri,Kn,3.9,4.6,10.5,4),vt(Dt,Qn,ri,Kn,3.62,4.52,4.6),wi(Dt,[Qn,3.85,4.6],[ri,3.85,4.6],[ri,3.62,3],[Qn,3.62,3],[[0,0],[9,0],[9,.8],[0,.8]]),vt(jn,Qn,ri,3.44,3.64,2.95,3.05),vt(Fi,Qn,ri,3.4,3.45,2.98,3.06),vt(Q,Qn,ri,3.9,Yt,4.45,10.5);let oc=k(25.9),Pu=Math.ceil((Yt-oc)/.165),Jx=(Yt-oc)/Pu,Lu=1.3+Pu*.28;for(let b=0;b<Pu;b++){let F=1.3+b*.28,$=oc+(b+1)*Jx;vt(Ce,ri+.4,yi-.4,D,$,F,F+.28),vt(Fi,ri+.4,yi-.4,$-.07,$-.035,F-.02,F+.01),vt(Et,ri,ri+.4,D,$+.95,F,F+.28,4),vt(Et,yi-.4,yi,D,$+.18,F,F+.28,4)}Sr([[yi-.2,1.3],[yi-.2,Lu]],[oc+.18,Yt+.18],.95),vt(Et,ri-.3,ri+.4,k(24.6)-.2,Kn+2.3,.3,1.3,4),vt(Et,yi-.4,yi+.3,k(27.4)-.2,Kn+2.3,.3,1.3,4),vt(Q,ri-.35,ri+.45,Kn+2.3,Kn+2.4,.25,1.35),vt(Q,yi-.45,yi+.35,Kn+2.3,Kn+2.4,.25,1.35);let hr=[29,30.8],ac=Math.max(0,Math.ceil((Fe-k(29.9))/.16)),jx=ac?(Fe-k(29.9))/ac:0,Kx=1.2+ac*.3;vt(oe,yi,hr[0],D,Fe,1.2,5.6,3),vt(oe,hr[1],ti,D,Fe,1.2,5.6,3),vt(oe,hr[0],hr[1],D,Fe,Kx,5.6,3);for(let b=0;b<ac;b++){let F=1.2+b*.3;vt(Ce,hr[0],hr[1],D,k(29.9)+(b+1)*jx,F,F+.3)}vt(St,yi,ti,Fe,Fe+.04,1.75,5.6),vt(oe,yi,hr[0],Fe,Fe+.85,1.2,1.7,3),vt(oe,hr[1],ti-.9,Fe,Fe+.85,1.2,1.7,3),vt(Q,yi,hr[0],Fe+.85,Fe+.95,1.15,1.75),vt(Q,hr[1],ti-.9,Fe+.85,Fe+.95,1.15,1.75),vt(Et,yi,Xe,Fe,3.9,5.6,12.5,4),vt(Dt,yi,ti,Fe,3.9,5.52,5.6);let lc=Math.min(3.5,3.6-Fe-.2);for(let[b,F]of[[27.9,31.3],[31.9,35.9]]){Zo(Ci,b,F,Fe+.05,Fe+lc,5.5),vt(Nt,b-.05,F+.05,Fe+lc,Fe+lc+.07,5.47,5.53);for(let $=b+(F-b)/3;$<F-.1;$+=(F-b)/3)vt(Nt,$-.03,$+.03,Fe+.05,Fe+lc,5.46,5.5)}for(let b of[32.3,33.1,33.9])ds(zn,b,Fe,4.9,.03,.9,5),Hi(Yo,b,Fe+1.05,4.9,.28,.34,.28);vt(Wt,yi,ti,3.9,Yt+.05,5.42,5.6),vt(Fi,yi,ti,3.86,3.9,5.44,5.52),vt(oe,0,Qn,D,Yt,8.5,W,3),vt(oe,Qn,ri,D,Yt,10.5,W,3),vt(oe,ri,yi,D,Yt,Lu,W,3),vt(oe,yi,Zx,D,Yt,12.5,W,3),vt(q,0,4,Yt,Yt+.03,8.5,14.8);let $n=[4,18.5],Ke=[5.2,14.2],Xs=7.8,Dp=2.6,Is=(Ke[0]+Ke[1])/2,Ds=Xs+Dp,Qa=Dp/((Ke[1]-Ke[0])/2),An=.6,tl=.35,Up=b=>Ds-Qa*(b-Is),mo=Is+(Ds-Oe)/Qa,hi=[9.9,13.1],ps=[mo+.2,mo+3.4],Iu=ps[1]+.2;kr(Qn+.1,$n[1]-.1,Yt,4.5,5.15,.5),vt(Et,$n[0],$n[1],Yt,Xs,Ke[0],Ke[1],4);for(let b=0;b<4;b++){let F=$n[0]+(b+.5)*($n[1]-$n[0])/4;Zo(Ci,F-1.3,F+1.3,Yt+.45,Yt+2.85,Ke[0]-.02),vt(xe,F-1.42,F+1.42,Yt+.33,Yt+.45,Ke[0]-.08,Ke[0]),vt(xe,F-1.42,F+1.42,Yt+2.85,Yt+2.97,Ke[0]-.08,Ke[0]),vt(xe,F-1.42,F-1.3,Yt+.45,Yt+2.85,Ke[0]-.08,Ke[0]),vt(xe,F+1.3,F+1.42,Yt+.45,Yt+2.85,Ke[0]-.08,Ke[0]),vt(Nt,F-.03,F+.03,Yt+.45,Yt+2.85,Ke[0]-.06,Ke[0]-.02),vt(Nt,F-1.3,F+1.3,Yt+2.2,Yt+2.25,Ke[0]-.06,Ke[0]-.02),b<3&&Hr($n[0]+(b+1)*($n[1]-$n[0])/4,Yt+1.9,Ke[0]-.03,.12,.34)}vt(xe,$n[0],$n[1],Xs-.5,Xs-.12,Ke[0]-.08,Ke[0]),vt(Fi,$n[0],$n[1],Xs-.12,Xs-.06,Ke[0]-.12,Ke[0]-.02),rc(Ci,$n[0]-.01,8.6,10.8,Yt+.8,Yt+2.6,-1);{let b=Xs-Qa*An,F=$n[0]-tl,$=$n[1]+tl,_t=($-F)/2,Bt=Math.hypot(Is-Ke[0]+An,Ds-b)/2;wi(ie,[F,b,Ke[0]-An],[$,b,Ke[0]-An],[$,Ds,Is],[F,Ds,Is],[[0,Bt],[_t,Bt],[_t,0],[0,0]]),wi(ie,[$,b,Ke[1]+An],[F,b,Ke[1]+An],[F,Ds,Is],[$,Ds,Is],[[_t,Bt],[0,Bt],[0,0],[_t,0]]),wi(ee,[F,b-.14,Ke[0]-An],[$,b-.14,Ke[0]-An],[$,b,Ke[0]-An],[F,b,Ke[0]-An]),wi(ee,[$,b-.14,Ke[1]+An],[F,b-.14,Ke[1]+An],[F,b,Ke[1]+An],[$,b,Ke[1]+An]);let Vt=new Wi(.17,.17,$-F+.3,10);Vt.rotateZ(Math.PI/2),Vt.translate((F+$)/2,Ds+.06,-Is),gi(Vt,ee);for(let[ne,Se]of[[F-.1,-1],[$+.1,1]]){let qe=new Ri(.7,.24,.3);qe.rotateZ(Se*.55),qe.translate(ne+Se*.12,Ds+.25,-Is),gi(qe,ee)}for(let ne of $n){Yx(Et,[ne,Xs,Ke[0]],[ne,Xs,Ke[1]],[ne,Ds,Is]);for(let[Se,qe]of[[Ke[0]-An,Is],[Ke[1]+An,Is]]){let He=Xs-Qa*An,cn=ne===$n[0]?-tl:tl;wi(ee,[ne+cn,He,Se],[ne+cn,Ds,qe],[ne+cn,Ds+.2,qe],[ne+cn,He+.2,Se])}for(let Se of[Ke[0]-An,Ke[1]+An]){let qe=new Ri(.28,.5,.28),He=ne===$n[0]?-1:1;qe.rotateZ(He*.5),qe.translate(ne+He*(tl+.1),Xs-Qa*An+.25,-Se),gi(qe,ee)}}for(let[ne,Se,qe]of[[6,10.4,3],[12.6,17,3],[10.4,12.6,1]])for(let He=3-qe;He<3;He++){let cn=mo-.8*He,vn=cn-.8,Sn=Up(vn)+.35;vt(Dt,ne,Se,Up(cn)-.2,Sn-.05,vn,cn,1),vt(ge,ne-.03,Se+.03,Sn-.06,Sn,vn-.02,cn+.05),vt(Fi,ne,Se,Sn-.13,Sn-.08,cn+.01,cn+.05)}for(let ne of[8.2,14.8])Hr(ne,Oe+.6,mo+.02,.14,.22);vt(ge,$n[0],hi[0],Oe-.3,Oe+.03,mo,Ke[1]+An),vt(ge,hi[1],$n[1],Oe-.3,Oe+.03,mo,Ke[1]+An),vt(ge,hi[0],hi[1],Oe-.3,Oe+.03,mo,ps[0]),vt($o,hi[0],hi[1],Oe-.6,Oe-.08,ps[0],ps[1]),vt(Q,hi[0]-.2,hi[1]+.2,Oe-.1,Oe+.06,ps[1],ps[1]+.2),vt(Q,hi[0]-.2,hi[0],Oe-.1,Oe+.06,ps[0],ps[1]),vt(Q,hi[1],hi[1]+.2,Oe-.1,Oe+.06,ps[0],ps[1]),kr(7.4,hi[0]-.3,Oe,ps[1]-.6,ps[1]+.9,.6),kr(hi[1]+.3,15.6,Oe,ps[1]-.6,ps[1]+.9,.6)}let Ms=[35.3,37.3];vt(le,0,hi[0]-.2,Yt,Oe,Ke[1]+An,W,3),vt(le,hi[1]+.2,Ms[0],Yt,Oe,Ke[1]+An,W,3),vt(le,hi[0]-.2,hi[1]+.2,Yt,Oe,Iu,W,3),vt(le,hi[0]-.2,hi[1]+.2,Yt,Oe-.6,Ke[1]+An,Iu,3),vt(le,$n[1],20.5,Yt,Oe,12.5,Ke[1]+An,3),vt(q,0,hi[0]-.2,Oe,Oe+.03,Ke[1]+An,W),vt(q,hi[1]+.2,Ms[0],Oe,Oe+.03,Ke[1]+An,W),vt(q,hi[0]-.2,hi[1]+.2,Oe,Oe+.03,Iu,W),vt(q,$n[1],20.5,Oe,Oe+.03,12.5,Ke[1]+An),vt(ge,15.8,18.3,Oe+.02,Oe+.05,Ke[1]+An,W-1),Jo(0,Ke[1]+An+.02,$n[0],Ke[1]+An+.02,Oe,1.05);{for(let $ of[-1,1])for(let _t of[-1,1]){let Bt=new Ri(.06,2.3,.06);Bt.rotateX(_t*.18),Bt.translate(2.4+$*1,Oe+1.1,-(19.5+_t*.2)),gi(Bt,zn)}vt(zn,2.4-1.05,2.4+1.05,Oe+2.2,Oe+2.26,19.5-.05,19.5+.05),wi(Wt,[2.4-1.2,Oe+2.35,19.5-.8],[2.4+1.2,Oe+2.35,19.5-.8],[2.4+1.2,Oe+2.1,19.5+.8],[2.4-1.2,Oe+2.1,19.5+.8]),vt(Wt,2.4-.8,2.4+.8,Oe+.55,Oe+.7,19.5-.25,19.5+.25)}Ws(6.5,Oe,21.5,.45),xi(5.8,Oe,21.5,zn),xi(7.2,Oe,21.5,zn),vt(ge,$n[1],ri,Yt,Yt+.05,4.6,12.5),vt(ge,ri,yi,Yt,Yt+.05,Lu,12.5),vt(ge,yi,Xe,Yt,Yt+.05,5.6,12.5),vt(ge,ti,Xe,Yt,Yt+.05,ke,5.6),Jo($n[1],4.62,ri,4.62,Yt,1.05),Sr([[yi,5.62],[ti,5.62],[ti,ke+.02],[Xe-.02,ke+.02],[Xe-.02,12.5]],[Yt,Yt,Yt,Yt,Yt],1.05);{ds(wn,21.6,Yt,9.3,.16,1.6,8,.2);let $=new Wi(.09,.13,1.4,6);$.rotateZ(.7),$.translate(21.6+.45,Yt+1.7,-9.3),gi($,wn);for(let[_t,Bt,Vt,ne]of[[-.6,1.2,.1,1],[.5,1.7,-.1,1.15],[1.2,2.25,.2,.9],[-.1,2.45,0,.95],[.3,3,.05,.7]])Hi(Oi,21.6+_t,Yt+Bt,9.3+Vt,ne,.22,ne*.8);vt(Et,21.6-1.3,21.6+1.3,Yt,Yt+.4,9.3-1.3,9.3+1.3,4),Hi(nn,21.6+.9,Yt+.55,9.3+.9,.5,.3,.45),Hi(Jn,21.6-.8,Yt+.55,9.3+.8,.45,.28,.4)}vt(bt,23.5,33.5,Yt+.03,Yt+.08,9.1,11.2,1.5);for(let b of[25.2,28.6,32])for(let F of[9.4,10.2,11])vt(St,b-.45,b+.45,Yt+.05,Yt+.11,F-.28,F+.28,1);kr(19,22.8,Yt,11.4,12.3),kr(24.6,28.4,Yt+.02,11.55,12.3),kr(30.2,33.8,Yt+.02,11.55,12.3);for(let b of[26.2,31.2])vt(Yn,b,b+1.7,Yt+.05,Yt+.5,7.25,7.7,1);{let b=new Wi(.62,.72,.1,9);b.translate(28.9,Yt+.72,-7.5),gi(b,jn),ds(jn,28.9,Yt+.05,7.5,.18,.67,7)}Ws(34.6,Yt+.05,8.2,.4),xi(33.9,Yt+.05,8.2,zn),xi(35.3,Yt+.05,8.2,zn),Ws(36.7,Yt+.05,10.2,.4),xi(36,Yt+.05,10.2,zn),xi(37.4,Yt+.05,10.2,zn),Ws(41.3,Yt+.05,8.4,.45),xi(40.6,Yt+.05,8.4,zn),xi(42,Yt+.05,8.4,zn),Ws(39.2,Yt+.05,5,.4),xi(38.5,Yt+.05,5,zn),xi(39.9,Yt+.05,5,zn);let Vi=[20.5,35],ei=[12.5,18],Vr=7.6;vt(Et,Vi[0],Vi[1],Yt,Vr,ei[0],ei[1],4),vt(Wt,Vi[0],Vi[1],Yt,Yt+.14,ei[0]-.06,ei[0]);for(let[b,F]of[[21.3,23.9],[25.5,28.1],[29.3,33.3]])Zo(Ci,b,F,Yt+.08,Yt+2.75,ei[0]-.02),vt(Nt,b-.06,F+.06,Yt+2.75,Yt+2.83,ei[0]-.07,ei[0]),vt(Nt,b-.06,b,Yt+.08,Yt+2.75,ei[0]-.07,ei[0]),vt(Nt,F,F+.06,Yt+.08,Yt+2.75,ei[0]-.07,ei[0]),vt(Nt,(b+F)/2-.03,(b+F)/2+.03,Yt+.08,Yt+2.75,ei[0]-.06,ei[0]-.02);for(let b of[24.7,28.7,34.1])Hr(b,Yt+1.3,ei[0]-.03,.06,1.3);vt(Wt,Vi[0]-.3,Vi[1]+.3,Vr,Oe,ei[0]-1,ei[1]+.2),vt(Fi,Vi[0]-.3,Vi[1]+.3,Vr-.05,Vr,ei[0]-1,ei[0]-.94),vt(Fi,Vi[0]-.3,Vi[0]-.24,Vr-.05,Vr,ei[0]-1,ei[1]);for(let b=Vi[0]+1;b<Vi[1];b+=2.4)vt(Ls,b-.09,b+.09,Vr-.03,Vr,ei[0]-.62,ei[0]-.44);vt(q,Vi[0],Vi[1],Oe,Oe+.03,ei[0]-1,ei[1]);{let b=[[$n[1],12.52],[Vi[0]-.3,12.52]];for(let F=1;F<=8;F++){let $=F/8*Math.PI/2;b.push([Vi[0]-.3+2.2*Math.sin($),ei[0]-.98+1*Math.cos($)])}b.push([Vi[1]+.3,ei[0]-.98]),Sr(b,b.map(()=>Oe),1.05)}Ws(24,Oe+.03,14.5,.45),xi(23.3,Oe+.03,14.5,zn),xi(24.7,Oe+.03,14.5,zn),Ws(30,Oe+.03,15.2,.45),xi(29.3,Oe+.03,15.2,zn),xi(30.7,Oe+.03,15.2,zn);let Qx=it("#34363a",{roughness:.95}),Np=it("#e9e7df",{roughness:.8}),t1=it("#2b3440"),Op=it("#a8a39a",{roughness:.95}),e1=it("#bdb2a0",{roughness:.95}),n1=it("#ddd6c8",{roughness:.8}),Du=it("#c9cdd1",{roughness:.35,metalness:.12}),Uu=it("#1f262c",{roughness:.1,metalness:.3}),Nu=it("#18191b"),Fp=it("#f2f3f1",{roughness:.4}),i1=it("#3f7dff",{emissive:"#3d78ff",emissiveIntensity:1.6}),Bp=it("#4c3a2c",{roughness:1}),s1=it("#2e4b2c",{roughness:.95}),zp=it("#3a5b35",{roughness:.95}),r1=it("#4a6c3f",{roughness:.95}),kp=it("#5d5a55",{roughness:.7}),o1=it("#a8743f",{roughness:.6}),Hp=it("#eeebe4"),a1=it("#6c6a66",{roughness:.9}),l1=it("#5f7a3e",{roughness:1}),c1=it("#b9bbb8",{roughness:.5}),Vp=it("#d2311f",{emissive:"#8a150a",emissiveIntensity:.55,roughness:.6}),Gp=it("#e67a2c",{emissive:"#8a3a0c",emissiveIntensity:.5,roughness:.6}),h1=it("#e8c74c",{emissive:"#7d6414",emissiveIntensity:.45,roughness:.6}),el=(b,F,$,_t,Bt=_t)=>{let Vt=new X(F[0],F[1],-F[2]),ne=new X($[0],$[1],-$[2]),Se=ne.clone().sub(Vt),qe=Se.length(),He=new Wi(Bt,_t,qe,7);He.translate(0,qe/2,0),He.applyQuaternion(new xs().setFromUnitVectors(new X(0,1,0),Se.normalize())),He.translate(Vt.x,Vt.y,Vt.z),gi(He,b)},Ou=(b,F=0)=>We({map:b,roughness:.55,emissive:F?"#ffffff":"#000000",emissiveMap:F?b:null,emissiveIntensity:F,side:mn}),Fu=(b,F,$,_t,Bt,Vt,{emissive:ne=0}={})=>{let Se=new Je(new _s($-F,Bt-_t),Ou(b,ne));return Se.position.set((F+$)/2,(_t+Bt)/2,-Vt+.01),J.add(Se),Se},Wp=(b,F,$,_t,Bt,Vt,{emissive:ne=0}={})=>{let Se=new Je(new _s(_t-$,Vt-Bt),Ou(b,ne));return Se.rotation.y=Math.PI/2,Se.position.set(F,(Bt+Vt)/2,-($+_t)/2),J.add(Se),Se},Bu='"Xingkai SC","STXingkai","Kaiti SC","STKaiti","KaiTi",serif',Ti=b=>k(b)+.03,cc=Dn+3.3,Us=Yt-.9,ni=12.5,Bi=19.9,zu=Math.max(1,Math.ceil((Fe-Dn)/.165)),Xp=(Fe-Dn)/zu,hc=.38,Ns=Xe-zu*hc;vt(Et,ti,Xe,Fe,3.9,ke,5.6,4),vt(oe,ti,Xe-.42,D,Fe,ke,5.6,3),vt(le,ti,Xe-.01,D,Fe+.06,ke-.08,ke,2),vt(Dt,ti,Xe,Fe+.06,3.9,ke-.08,ke,1),vt(Dt,ti-.08,ti,Fe,3.9,ke,5.6,1);{let b=Ns+.35,F=Xe-1.35;Zo(Ci,b,F,Fe+.45,Fe+2.85,ke-.1);for(let[$,_t,Bt,Vt]of[[b-.15,F+.15,Fe+.3,Fe+.45],[b-.15,F+.15,Fe+2.85,Fe+3],[b-.15,b,Fe+.3,Fe+3],[F,F+.15,Fe+.3,Fe+3],[(b+F)/2-.05,(b+F)/2+.05,Fe+.45,Fe+2.85]])vt(o1,$,_t,Bt,Vt,ke-.17,ke-.08);vt(Nt,b-.25,F+.25,Fe+.2,Fe+3.1,ke-.1,ke-.08);for(let $ of[ti+.8,Xe-.6])vt(Ls,$-.03,$+.03,Fe+1.2,Fe+2.6,ke-.12,ke-.08)}rc(Ci,ti-.09,ke+.35,ke+1.45,Fe+.05,Fe+2.55,-1),vt(Nt,ti-.12,ti-.08,Fe+2.55,Fe+2.65,ke+.3,ke+1.5),Fu(di(128,72,(b,F,$)=>{b.fillStyle="#1d3f6e",b.fillRect(0,0,F,$),b.fillStyle="#fff",b.font='600 18px "PingFang SC",sans-serif',b.textAlign="center",b.fillText("\u51E4\u5F62\u65B0\u6751",F/2,28),b.font='700 28px "PingFang SC",sans-serif',b.fillText("19",F/2,62)}),Xe-.55,Xe-.2,Fe+.1,Fe+.32,ke-.1),vt(Wt,ti,Xe,3.9,Yt+.05,ke-.35,ke),vt(Hp,ti,Xe,3.88,3.9,ke-.33,ke),vt(Fi,ti,Xe,3.84,3.88,ke-.35,ke-.3);for(let b=0;b<zu;b++){let F=Xe-b*hc,$=F-hc,_t=Dn+(b+1)*Xp;vt(Op,$,F+.02,D,_t,1.75,ke,1),vt(Nt,$,$+.025,_t-.03,_t+.004,1.75,ke)}vt(n1,ti,Ns,Fe,Fe+.04,1.75,ke,1),vt(oe,ti,Ns,D,Fe,1.75,ke,3);{let b=$=>$<=Ns?Fe+.9:Dn+(Math.floor((Xe-$)/hc)+1)*Xp+.9,F=Ui(733);for(let $=ti-.9;$<Xe-.01;$+=.62){let _t=Math.min(Xe,$+.6),Bt=b(Math.min($+.3,Xe-.01))+(F()-.5)*.06;vt(F()<.5?e1:Op,$,_t,D,Bt,1.2,1.75,1),vt(Q,$-.01,_t+.01,Bt,Bt+.07,1.18,1.77)}for(let[$,_t]of[[Ns-.8,1],[Ns+.5,.8],[Ns+2.6,1],[Xe-.9,.8]]){let Bt=b($)+.07;ds(kp,$,Bt,1.48,.16*_t,.32*_t,10,.12*_t),Hi(kp,$,Bt+.42*_t,1.48,.13*_t,.15*_t,.13*_t)}}{let b=Ns-1.45;vt(Et,b,b+.55,Fe,Fe+1.35,ke-.6,ke-.05,4),vt(Ls,b+.04,b+.51,Fe+1.35,Fe+1.8,ke-.56,ke-.09),vt(Nt,b,b+.55,Fe+1.8,Fe+1.86,ke-.6,ke-.05);for(let F of[.14,.27,.4])vt(Nt,b+F,b+F+.02,Fe+1.36,Fe+1.79,ke-.61,ke-.59);vt(ln,b+.65,Ns,Fe,Fe+.4,ke-.55,ke-.05);for(let F=b+.8;F<Ns-.1;F+=.33)Hi(Gs,F,Fe+.72,ke-.3,.3,.38,.26);ds(wn,Ns-.35,Fe+.4,ke-.3,.05,1.4,6);for(let[F,$]of[[0,1.9],[.2,1.6],[-.2,1.7]])Hi(Gs,Ns-.35+F,Fe+$,ke-.3,.35,.45,.3)}vt(t1,Xe-.4,Xe,D,Dn+1.25,ke,12.5),vt(Et,Xe-.4,Xe,Dn+1.25,Fe,ke,12.5,4),vt(Wt,Xe-.35,Xe+.12,3.9,Yt+.05,ke,12.5),vt(Fi,Xe+.08,Xe+.13,3.86,3.9,ke,12.5),Wp(di(200,250,(b,F,$)=>{b.fillStyle="#24211e",b.fillRect(0,0,F,$),b.strokeStyle="#4a443c",b.lineWidth=4,b.strokeRect(6,6,F-12,$-12),b.fillStyle="#d8b56a",b.font=`70px ${Bu}`,b.textAlign="center",b.textBaseline="middle",b.fillText("\u5C45",F*.4,$*.24),b.fillText("\u4E4B",F*.62,$*.5),b.fillText("\u6797",F*.42,$*.76),b.font="10px sans-serif",b.fillText("JU ZHI LIN",F*.24,$*.5)}),Xe+.02,ke+.3,ke+1.2,Dn+1.75,Dn+2.85),vt(Wt,Xe,Xe+.16,Dn+2.95,Dn+3.07,ke+.6,ke+.9);for(let[b,F]of[[ke+2,ke+4.2],[ke+4.8,ke+6.4]]){rc(Ci,Xe+.01,b,F,Dn+2.4,Dn+4.7,1);for(let[$,_t,Bt,Vt]of[[b-.06,F+.06,Dn+2.34,Dn+2.4],[b-.06,F+.06,Dn+4.7,Dn+4.76],[b-.06,b,Dn+2.4,Dn+4.7],[F,F+.06,Dn+2.4,Dn+4.7],[(b+F)/2-.03,(b+F)/2+.03,Dn+2.4,Dn+4.7]])vt(Nt,Xe,Xe+.07,Bt,Vt,$,_t)}for(let b of[ke+1.6,ke+4.5,ke+6.8])vt(Ls,Xe,Xe+.05,Dn+2.6,Dn+4.2,b-.03,b+.03);vt(Fp,Xe,Xe+.3,Dn+2.5,Dn+3.05,ke+7.3,ke+7.95),Wp(di(96,64,(b,F,$)=>{b.fillStyle="#e9eae7",b.fillRect(0,0,F,$),b.fillStyle="#55585a",b.beginPath(),b.arc(F*.42,$/2,$*.4,0,Math.PI*2),b.fill(),b.strokeStyle="#e9eae7",b.lineWidth=2;for(let _t=4;_t<$*.4;_t+=4)b.beginPath(),b.arc(F*.42,$/2,_t,0,Math.PI*2),b.stroke()}),Xe+.31,ke+7.32,ke+7.93,Dn+2.52,Dn+3.03),vt(c1,Xe,Xe+.2,Dn+.85,Dn+1.95,ke+7.4,ke+8),ds(Et,Xe+.08,D,ke+.1,.055,Yt-D-.3,8);let qp=b=>[(b[0]-S[0])*E[0]+(b[1]-S[1])*E[1],(b[0]-S[0])*A[0]+(b[1]-S[1])*A[1]],u1=b=>{let F=-1e9;for(let $ of t.roads)if(!["footway","path","steps","pedestrian"].includes($.kind))for(let _t=1;_t<$.pts.length;_t++){let Bt=qp($.pts[_t-1]),Vt=qp($.pts[_t]);if((Bt[0]-b)*(Vt[0]-b)>0||Bt[0]===Vt[0])continue;let ne=Bt[1]+(Vt[1]-Bt[1])*(b-Bt[0])/(Vt[0]-Bt[0]);ne>-10&&ne<8&&(F=Math.max(F,ne+$.width/2))}return F},uc=b=>Math.max(H,u1(b)-.3);for(let b=Xe;b<U-1e-6;b+=.5){let F=Math.min(U,b+.5),$=uc(b),_t=uc(F);wi(Qx,[b,Ti(b),ni],[F,Ti(F),ni],[F,Ti(F),_t],[b,Ti(b),$],[[b/2,ni/2],[F/2,ni/2],[F/2,_t/2],[b/2,$/2]]),wi(Ot,[b,D,$],[F,D,_t],[F,Ti(F),_t],[b,Ti(b),$])}wi(Ot,[U,D,uc(U)],[U,D,ni],[U,Ti(U),ni],[U,Ti(U),uc(U)]);let nl=[44.6,47.2,49.8,52.4,55,57.6],jo=ni-5.3,Mi=nl[1];for(let b of nl)wi(Np,[b-.06,Ti(b)+.02,ni-.05],[b+.06,Ti(b)+.02,ni-.05],[b+.06,Ti(b)+.02,jo],[b-.06,Ti(b)+.02,jo]);for(let b=nl[0]-.06;b<nl.at(-1)+.06-1e-6;b+=.5){let F=Math.min(nl.at(-1)+.06,b+.5);wi(Np,[b,Ti(b)+.02,jo+.06],[F,Ti(F)+.02,jo+.06],[F,Ti(F)+.02,jo-.06],[b,Ti(b)+.02,jo-.06])}{let b=Mi+1.3,F=.95,$=ni-.4,_t=$-4.7,Bt=Ti(b);vt(Du,b-F,b+F,Bt+.34,Bt+1,_t,$),vt(Du,b-F+.04,b+F-.04,Bt+.5,Bt+.98,_t-.02,_t+.3),vt(Uu,b-F+.1,b+F-.1,Bt+1,Bt+1.56,_t+1.45,$-.5),vt(Du,b-F+.14,b+F-.14,Bt+1.56,Bt+1.64,_t+1.5,$-.55),wi(Uu,[b-F+.1,Bt+1,_t+.85],[b+F-.1,Bt+1,_t+.85],[b+F-.14,Bt+1.56,_t+1.45],[b-F+.14,Bt+1.56,_t+1.45]),vt(Fi,b-F+.2,b+F-.2,Bt+.84,Bt+.88,_t-.03,_t);for(let ne of[b-F+.04,b+F-.04])for(let Se of[_t+.95,$-.95]){let qe=new Wi(.37,.37,.26,16);qe.rotateZ(Math.PI/2),qe.translate(ne,Bt+.37,-Se),gi(qe,Nu)}let Vt=Ti(Mi);vt(Fp,Mi-.3,Mi+.3,Vt+.45,Vt+1.2,ni-.28,ni),vt(Uu,Mi-.1,Mi+.1,Vt+.88,Vt+1.06,ni-.3,ni-.28),vt(i1,Mi-.26,Mi-.22,Vt+.52,Vt+1.1,ni-.3,ni-.28),el(Et,[Xe,Ti(Xe)+.14,ni-.08],[Mi-.3,Vt+.14,ni-.08],.045),el(Nu,[Mi+.22,Vt+.52,ni-.3],[Mi+.55,Vt+.08,ni-.9],.02),el(Nu,[Mi+.55,Vt+.08,ni-.9],[b-F,Bt+.8,$-.7],.02)}let bs=ni+.32,go=ni+.58;vt(oe,Xe,U,D,cc,ni,bs,2.4),vt(Q,Xe,U,cc,cc+.08,ni-.05,bs),vt(oe,Xe,U,cc,Us,bs,go,2.4),vt(Et,Xe,U,Us,yn+.1,bs,go,4),vt(Q,Xe,U,yn+.1,yn+.18,bs-.04,go+.04),Sr([[38,12.52],[Xe,12.52],[Xe,go+.02],[U,go+.02]],[yn+.1,yn+.1,yn+.1,yn+.1],1.05);{vt(Wt,Mi-1.85,Mi+1.85,Us+.62,Us+1.72,bs-.1,bs),Fu(di(512,176,(b,F,$)=>{b.fillStyle="#141414",b.fillRect(0,0,F,$),b.strokeStyle="#3a3a3a",b.lineWidth=6,b.strokeRect(3,3,F-6,$-6),b.fillStyle="#fbfbf6",b.shadowColor="#ffffff",b.shadowBlur=10,b.font=`120px ${Bu}`,b.textAlign="center",b.textBaseline="middle",b.fillText("\u5C45\u4E4B\u6797",F/2,$/2+6)}),Mi-1.75,Mi+1.75,Us+.67,Us+1.67,bs-.11,{emissive:.9}),vt(Wt,Mi-2.6,Mi+2.6,Us+.1,Us+.5,bs-.06,bs),Fu(di(700,52,(b,F,$)=>{b.fillStyle="#101318",b.fillRect(0,0,F,$),b.fillStyle="#f5f7ff",b.shadowColor="#bcd0ff",b.shadowBlur=6,b.font='700 30px "PingFang SC",sans-serif',b.textBaseline="middle",b.fillText("173 5664 8281",18,$/2+1),b.fillStyle="#3a3e46",b.fillRect(262,6,4,$-12),b.fillStyle="#f5f7ff",b.font='700 32px "PingFang SC",sans-serif',b.fillText("\u9690\u4E8E\u5C71\u6797  \u5F52\u4E8E\u81EA\u7136",290,$/2+1)}),Mi-2.5,Mi+2.5,Us+.13,Us+.47,bs-.07,{emissive:1});for(let b of[Mi-1.9,Mi+1.9])vt(Ls,b-.08,b+.08,Us-.8,Us-.5,bs-.06,bs)}vt(oe,38,Xe,D,yn,12.5,Bi,3),vt(Et,38,Xe,Yt,yn+.1,12.42,12.5,4),vt(Et,37.92,38,Yt,yn+.1,12.5,14.1,4),vt(oe,Ms[0],38,D,yn,15.3,Bi,3),vt(Et,Ms[0],38,Yt,yn+.1,15.22,15.3,4),vt(q,Ms[0],38,yn,yn+.03,15.3,Bi),vt(q,38,Xe,yn,yn+.03,12.5,Bi),vt(oe,Xe,U,D,yn,go,Bi,3),vt(q,Xe,U,yn,yn+.03,go,Bi),Sr([[38,14.1],[38,12.52]],[yn+.1,yn+.1],1.05),Sr([[Ms[0],15.32],[37.2,15.32]],[yn+.1,yn+.1],1.05),Ws(42.2,yn+.03,13.7,.45),xi(41.5,yn+.03,13.7,jn),xi(42.9,yn+.03,13.7,jn),ds(zn,43.1,yn+.03,14.9,.03,2.2,6),ds(Hp,43.1,yn+1.2,14.9,.02,1.1,10,.13);for(let[b,F,$]of[[39,40.8,17.2],[45.4,47.2,19.3]])vt(Yn,b,F,yn+.03,yn+.48,$,$+.45,1);Ws(51.5,yn+.03,15.6,.45),xi(50.8,yn+.03,15.6,jn),xi(52.2,yn+.03,15.6,jn),vt(ge,Ms[0]-.3,38,Yt,Yt+.05,12.5,15.3);{let b=Math.max(1,Math.ceil((yn-Yt)/.16)),F=(yn-Yt)/b,$=Vt=>[36.4+1.6*(1-Math.cos(Math.PI*Vt/2)),12+2.35*Math.sin(Math.PI*Vt/2)],_t=[[],[]],Bt=[];for(let Vt=0;Vt<b;Vt++){let ne=$(Vt/b),Se=$((Vt+1)/b),qe=Yt+(Vt+1)*F,He=[(ne[0]+Se[0])/2,(ne[1]+Se[1])/2],cn=Math.hypot(Se[0]-ne[0],Se[1]-ne[1]),vn=new Ri(1.4,qe-Yt+.3,Math.max(.28,cn));vn.translate(0,-(qe-Yt+.3)/2,0),vn.rotateY(Math.atan2(Se[0]-ne[0],-(Se[1]-ne[1]))),vn.translate(He[0],qe,-He[1]),gi(vn,Ce);let Sn=new Ri(1.36,.035,.03);Sn.rotateY(Math.atan2(Se[0]-ne[0],-(Se[1]-ne[1]))),Sn.translate(ne[0],qe-.06,-ne[1]),gi(Sn,Fi);let Un=-(Se[1]-ne[1])/cn,On=(Se[0]-ne[0])/cn;for(let bi of[0,1])_t[bi].push([He[0]+(bi?1:-1)*.72*Un,He[1]+(bi?1:-1)*.72*On]);Bt.push(qe)}for(let Vt of[0,1])Sr(_t[Vt],Bt.map(ne=>ne+.05),1)}for(let[b,F,$]of[[35.55,13,.7],[35.75,14.2,.9],[36.2,15,.55]])Hi(a1,b,Yt+$*.5,F,$,$*.7,$*.8);vt(l1,Ms[0]-.3,36.2,Yt+.05,Yt+.08,12.6,15.2),ds(wn,35.5,Yt,14.8,.06,1.6,6),Hi(nn,35.5,Yt+1.9,14.8,.55,.6,.5);{let b=Math.max(1,Math.ceil((Oe-yn)/.165)),F=(Oe-yn)/b,$=.28,_t=Ms[0]+b*$;for(let Bt=0;Bt<b;Bt++){let Vt=_t-Bt*$,ne=Vt-$,Se=yn+(Bt+1)*F;vt(Ce,ne,Vt,yn,Se,18.45,Bi-.02,1),vt(Fi,ne-.01,ne+.01,Se-.07,Se-.04,18.47,Bi-.05)}Sr([[_t,18.43],[Ms[0],18.43]],[yn+.05,Oe+.05],1)}vt(le,Ms[0],U,D,Oe,Bi,W,3),vt(q,Ms[0],U,Oe,Oe+.03,Bi,W),Jo(Ms[0],Bi+.02,U,Bi+.02,Oe,1.05),kr(37.5,43.9,Oe,Bi+.4,Bi+1.3),kr(47.7,56,Oe,Bi+.4,Bi+1.3),Hr(45.5,yn+2.6,Bi-.03,.22,.4);{let $=Ui(1771),_t=17,Bt=Oe;ds(le,45.8,Bt,21.3,1.1,.35,20),el(Bp,[45.8,Bt,21.3],[45.8+.35,Bt+_t*.86,21.3-.25],.55,.16);let Vt=[[4.8,5.4],[6.6,6],[8.4,5.6],[10.2,4.9],[11.9,4.1],[13.5,3.1],[15,2.1],[16.3,1.1]],ne=[];for(let[He,cn]of Vt){let vn=Math.max(3,Math.round(cn*1.7)),Sn=45.8+He*.02,Un=21.3-He*.015;for(let On=0;On<vn*2;On++){let bi=On/(vn*2)*Math.PI*2+$()*.9,Ss=cn*(.25+.6*$()),Es=Sn+Math.cos(bi)*Ss,Os=Un+Math.sin(bi)*Ss*.9,Gr=Bt+He+($()-.3)*.9,ns=cn*(.22+.16*$())+.55;Hi($()<.35?s1:zp,Es,Gr,Os,ns,.75+.55*$(),ns*(.85+.3*$())),$()<.5&&Hi(r1,Es+($()-.5)*.8,Gr+.55,Os+($()-.5)*.8,ns*.6,.45+.3*$(),ns*.55),He<12&&On%2&&el(Bp,[Sn,Gr-.3,Un],[Sn+(Es-Sn)*.8,Gr-.1,Un+(Os-Un)*.8],.12,.06),He<9&&On%2&&ne.push([Es-Math.cos(bi)*.6,Gr-.55,Os-Math.sin(bi)*.6])}Hi(zp,Sn,Bt+He+.35,Un,cn*.4,.8,cn*.4)}let Se=[Vp,Gp,h1,Vp,Gp];for(let[He,cn,vn]of ne)for(let Sn=0,Un=3+Math.floor($()*3);Sn<Un;Sn++){let On=.24+.06*$();Hi(Se[Math.floor($()*Se.length)],He,cn-.35-Sn*.62,vn,On,On*.88,On)}let qe=new Je(new _s(.5,2.2),Ou(di(96,420,(He,cn,vn)=>{He.fillStyle="#f3efe6",He.fillRect(0,0,cn,vn),He.fillStyle="#1b1b1b",He.font=`62px ${Bu}`,He.textAlign="center",He.textBaseline="middle",[..."\u65E0\u4E8B\u5C0F\u795E\u4ED9"].forEach((Sn,Un)=>He.fillText(Sn,cn/2,48+Un*80))})));qe.position.set(45.8+2.3,Bt+3.4,-(21.3-2.4)),qe.rotation.y=1.2,J.add(qe)}vt(ln,13.5,27,Oe,Oe+.45,W-1.3,W-.25);for(let b=13.8;b<26.8;b+=.62)Hi(Gs,b,Oe+.95,W-.78,.42,.55,.42);for(let b of[16,16.9,17.8,18.7])xi(b,Oe+.03,W-2.1,jn);vt(Dt,5,27,Oe,12.6,W-.22,W,1),vt(Wt,5,27,12.6,12.72,W-.3,W);for(let b=6.5;b<27;b+=3)Hr(b,10.7,W-.25,.22,.42);let Yp={left:b=>b<1?k(0):b<Ke[1]+An?Yt:Oe,right:b=>b<ni?Ti(U):b<Bi?yn:Oe,back:()=>Oe},ku=(b,F,$,_t)=>{for(let Bt=1;Bt<F.length;Bt++){let[Vt,ne]=[F[Bt-1],F[Bt]],Se=$(Vt),qe=$(ne),He=Z(Vt[0],Vt[1]),cn=Z(ne[0],ne[1]);if(Math.max(He-Se,cn-qe)<.05)continue;let vn=[Vt[0],Math.min(Se,He)-.3,Vt[1]],Sn=[ne[0],Math.min(qe,cn)-.3,ne[1]],Un=[ne[0],Math.max(qe,cn)+.15,ne[1]],On=[Vt[0],Math.max(Se,He)+.15,Vt[1]],bi=Math.hypot(ne[0]-Vt[0],ne[1]-Vt[1]),Ss=[[0,vn[1]/3],[bi/3,Sn[1]/3],[bi/3,Un[1]/3],[0,On[1]/3]];_t>0?wi(b,vn,Sn,Un,On,Ss):wi(b,Sn,vn,On,Un,Ss);let Es=-(ne[1]-Vt[1])/bi*.2,Os=(ne[0]-Vt[0])/bi*.2;wi(Q,[Vt[0]-Es,On[1],Vt[1]-Os],[ne[0]-Es,Un[1],ne[1]-Os],[ne[0]+Es,Un[1],ne[1]+Os],[Vt[0]+Es,On[1],Vt[1]+Os])}},Hu=(b,F,$=Math.ceil(Math.hypot(F[0]-b[0],F[1]-b[1])/1.25))=>[...Array($+1)].map((_t,Bt)=>[b[0]+(F[0]-b[0])*Bt/$,b[1]+(F[1]-b[1])*Bt/$]);ku(le,Hu([0,H],[0,W]),b=>Yp.left(b[1]),1),ku(oe,Hu([U,H],[U,W]),b=>Yp.right(b[1]),-1),ku(le,Hu([0,W],[U,W]),()=>Oe,1);for(let[b,F]of br){let $=0;for(let He of F)$+=He.attributes.position.count;let _t=new Float32Array($*3),Bt=new Float32Array($*3),Vt=new Float32Array($*2),ne=0;for(let He of F)_t.set(He.attributes.position.array,ne*3),Bt.set(He.attributes.normal.array,ne*3),He.attributes.uv&&Vt.set(He.attributes.uv.array,ne*2),ne+=He.attributes.position.count;let Se=new Ln;Se.setAttribute("position",new Zn(_t,3)),Se.setAttribute("normal",new Zn(Bt,3)),Se.setAttribute("uv",new Zn(Vt,2)),Se.computeBoundingSphere();let qe=new Je(Se,b);qe.castShadow=!b.transparent&&b!==Fi&&b!==Ls,qe.receiveShadow=!b.transparent,J.add(qe)}{let b=new Pn,F=We({color:"#c3302a",emissive:"#8f160f",emissiveIntensity:.55,roughness:.35}),$=new Je(new Xi(1.5,24,16),F),_t=new Je(new io(1.32,3.2,24),F),Bt=new Je(new Xi(.62,16,12),We({color:"#fff4dc",emissive:"#ffe3a8",emissiveIntensity:.6}));_t.rotation.x=Math.PI,_t.position.y=1.6,$.position.y=3.9,Bt.position.set(0,3.9,1.2),b.add(_t,$,Bt);let Vt=j(25,11);b.position.set(Vt[0],Y+15.5,Vt[1]),b.userData={base:Y+15.5,head:5.4},Ct.add(b),ao=b}vr.set(g.n,Y+15.5+5.4),g.modelNote="\u4E09\u7EF4\u6A21\u578B\u6309\u4E1A\u4E3B\u63D0\u4F9B\u7684\u5B9E\u62CD\u7167\u7247\u548C\u822A\u62CD\u56FE\u5EFA\u9020\uFF1A\u4E00\u5C42\u767D\u8272\u8F6C\u89D2\u623F\u3001\u4E94\u95F4\u5E26\u77F3\u5899\u5C0F\u9662\u7684\u5BA2\u623F\u3001\u706F\u5149\u76F4\u68AF\u4E0E\u73BB\u7483\u95E8\u5927\u5802\uFF1B\u4E1C\u5934\u8336\u5BA4\u4E34\u8DEF\u4E00\u9762\u4E3A\u77F3\u6750\u52D2\u811A\u3001\u6728\u9970\u9762\u548C\u6728\u6846\u5927\u7A97\uFF0C\u5165\u6237\u77F3\u9636\u6CBF\u8336\u5BA4\u5411\u897F\u4E0A\u5230\u524D\u9662\uFF0C\u5916\u4FA7\u662F\u5927\u5757\u82B1\u5C97\u5CA9\u6321\u5899\u548C\u5C0F\u77F3\u50E7\u50CF\uFF1B\u8336\u5BA4\u4E1C\u5C71\u5899\u767D\u5899\u6DF1\u84DD\u52D2\u811A\uFF0C\u6302\u201C\u5C45\u4E4B\u6797\u201D\u7AD6\u533E\uFF0C\u9762\u671D\u505C\u8F66\u573A\uFF1B\u505C\u8F66\u573A\u671D\u5357\uFF0C\u4E00\u6392\u8F66\u4F4D\u5782\u76F4\u4E8E\u5317\u4FA7\u4E24\u7EA7\u6BDB\u77F3\u6321\u5899\uFF0C\u8F66\u5934\u671D\u5357\uFF0C\u5145\u7535\u6869\u6302\u5728\u6321\u5899\u4E0A\u3001\u6B63\u4E0A\u65B9\u662F\u53D1\u5149\u62DB\u724C\u201C\u5C45\u4E4B\u6797\u201D\u548C\u201C173 5664 8281\u3000\u9690\u4E8E\u5C71\u6797 \u5F52\u4E8E\u81EA\u7136\u201D\uFF1B\u6321\u5899\u4E0A\u65B9\u662F\u6709\u684C\u6905\u7684\u5E73\u53F0\uFF0C\u7531\u4E8C\u5C42\u6728\u5E73\u53F0\u7ECF\u5F27\u5F62\u706F\u5149\u697C\u68AF\u4E0A\u53BB\uFF0C\u518D\u6CBF\u77F3\u5899\u76F4\u68AF\u4E0A\u5230\u4E09\u5C42\uFF0C\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u957F\u5728\u4E09\u5C42\uFF1B\u4E8C\u5C42\u7EA2\u9676\u74E6\u5761\u9876\u5BA2\u623F\u548C\u5E73\u9876\u767D\u8272\u697C\uFF0C\u524D\u6709\u7F57\u6C49\u677E\u3001\u767D\u8272\u82B1\u6C60\u3001\u783E\u77F3\u6C40\u6B65\u4E0E\u6728\u5E73\u53F0\uFF1B\u4E09\u5C42\u5C4B\u9876\u9732\u53F0\u6709\u74E6\u5C4B\u9762\u4E0A\u7684\u6728\u8D28\u9636\u68AF\u5EA7\u3001\u6C34\u666F\u6C60\u548C\u6728\u683C\u6805\u6321\u5899\u58C1\u706F\u3002\u5C3A\u5BF8\u6309\u7167\u7247\u6BD4\u4F8B\u4F30\u8BA1\u3002"}}{let c=t.buildings.find(g=>g.osmId===541482372);if(c){let g=or(...c.rectCenter,"\u767E\u5C81\u5BAB");g.position.y=c.base,g.rotation.y=Math.atan2(-c.axis[1],c.axis[0]);let _=c.width,S=c.depth,E=new G,A=[[-_/2-1,-S/2-1],[_/2+1,-S/2-1],[_/2+1,S/2+1],[-_/2-1,S/2+1]],U=[[-_*.14,-S*.2],[_*.14,-S*.2],[_*.14,S*.2],[-_*.14,S*.2]],W=A.map((k,Z)=>[(k[0]+U[Z][0])*.5,(k[1]+U[Z][1])*.5]),H=(k,Z)=>[k[0],Z,k[1]],D=c.wallHeight+.4,j=D+3.1;for(let k=0;k<4;k++){let Z=(k+1)%4;E.quad(H(A[k],D),H(A[Z],D),H(W[Z],j),H(W[k],j)),E.quad(H(W[k],j),H(W[Z],j),H(U[Z],D),H(U[k],D)),tn(g,[H(W[k],j+.08),H(W[Z],j+.08)],"#4e564c")}E.mesh(lt("#7b8da2",{map:Tt,side:mn}),g);let Y=new G;for(let k=0;k<4;k++){let Z=(k+1)%4;Y.quad(H(U[k],D-4),H(U[Z],D-4),H(U[Z],D),H(U[k],D),"#c7c4b4")}Y.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),g),qt(g,0,D-4,0,_*.28,.15,S*.4,Me);for(let k of[-1,1])for(let Z=1;Z<5;Z++)qt(g,0,Z*3,k*(S/2+.24),_,.2,.6,Me)}}function Kg(c,{double:g=!1,roofCol:_="#f0b52e",wallCol:S="#f2b33a"}={}){let E=or(...c.rectCenter,c.precinct||c.name||"\u5BFA\u9662");E.position.y=c.base,E.rotation.y=Math.atan2(-c.axis[1],c.axis[0]);let A=Math.cos(E.rotation.y),U=Math.sin(E.rotation.y),W=(Dt,oe)=>[c.rectCenter[0]+Dt*A+oe*U,c.rectCenter[1]-Dt*U+oe*A],H=c.width/2,D=c.depth/2,j=Math.max(c.wallHeight,g?11:7.5),Y=new G,k=new G,Z=new G,J=new G,ot=0;for(let[Dt,oe]of[[-H,-D],[H,-D],[H,D],[-H,D],[0,D],[0,-D]])ot=Math.min(ot,v(...W(Dt*1.1,oe*1.1))-c.base);let pt=.9;bn(Y,-H-.6,H+.6,ot-.5,pt,-D-.6,D+.6,"#d8d0bc"),bn(Y,-H-.75,H+.75,pt-.12,pt+.05,-D-.75,D+.75,"#c4bba5");for(let Dt=0;Dt<4;Dt++)bn(Y,-3.2,3.2,ot-.5,pt-Dt*.22,D+.6+Dt*.38,D+.98+Dt*.38,"#d2cab5");let Ut=1.9,xt=H-Ut,Ht=D-Ut,kt=g?j*.56:j*.86;bn(k,-xt,xt,pt,kt,-Ht,Ht,S);let Mt="#b8332a",N=(Dt,oe,le,ie)=>bn(k,Dt-.28,Dt+.28,le,ie,oe-.28,oe+.28,Mt),rt=Math.max(2,Math.round(2*H/3.4)),mt=Math.max(2,Math.round(2*D/3.4));for(let Dt=0;Dt<=rt;Dt++){let oe=-H+.5+Dt*(2*H-1)/rt;N(oe,-D+.5,pt,kt),N(oe,D-.5,pt,kt)}for(let Dt=1;Dt<mt;Dt++){let oe=-D+.5+Dt*(2*D-1)/mt;N(-H+.5,oe,pt,kt),N(H-.5,oe,pt,kt)}let st=(Dt,oe,le,ie,ee)=>{bn(J,Dt,oe,ee-.75,ee,le,ie,"#2f6f6c"),bn(J,Dt-.01,oe+.01,ee-.85,ee-.75,le-.01,ie+.01,"#e2b64a")};st(-H+.2,H-.2,-D+.2,-D+.75,kt),st(-H+.2,H-.2,D-.75,D-.2,kt),st(-H+.2,-H+.75,-D+.2,D-.2,kt),st(H-.75,H-.2,-D+.2,D-.2,kt);let ht=Math.max(3,Math.min(7,Math.round(2*xt/3.4)|1)),ut=2*xt/ht;for(let Dt=0;Dt<ht;Dt++){let oe=-xt+Dt*ut+.25,le=-xt+(Dt+1)*ut-.25;bn(J,oe,le,pt+.1,Math.min(kt-1,pt+4.2),Ht,Ht+.08,"#8e2a20");for(let ie=1;ie<4;ie++){let ee=pt+.1+ie*(Math.min(kt-1,pt+4.2)-pt-.1)/4;bn(J,oe,le,ee-.04,ee+.04,Ht+.08,Ht+.12,"#d9ad4c")}bn(J,(oe+le)/2-.04,(oe+le)/2+.04,pt+.1,Math.min(kt-1,pt+4.2),Ht+.08,Ht+.12,"#d9ad4c")}function it(Dt,oe,le,ie,ee,ge=1.5){let q=le+ie*.48,bt=le+ie,St=Math.max(1,Dt-oe*.62),Ot=oe*.5,Q=10,Nt=Wt=>ge*Math.pow(Wt,3),xe=(Wt,Ce)=>[Wt,le+Nt(Math.max(Math.abs(Wt)/Dt,Math.abs(Ce)/oe)),Ce];for(let Wt of[-1,1])for(let Ce=0;Ce<Q;Ce++){let ln=-1+2*Ce/Q,nn=-1+2*(Ce+1)/Q;Z.quad(xe(ln*Dt,Wt*oe),xe(nn*Dt,Wt*oe),[nn*St,q,Wt*Ot],[ln*St,q,Wt*Ot],ee)}for(let Wt of[-1,1])for(let Ce=0;Ce<Q;Ce++){let ln=-1+2*Ce/Q,nn=-1+2*(Ce+1)/Q;Z.quad(xe(Wt*Dt,ln*oe),xe(Wt*Dt,nn*oe),[Wt*St,q,nn*Ot],[Wt*St,q,ln*Ot],ee)}for(let Wt of[-1,1])Z.quad([-St,q,Wt*Ot],[St,q,Wt*Ot],[St+.15,bt,0],[-St-.15,bt,0],ee);for(let Wt of[-1,1])k.tri([Wt*St,q,-Ot],[Wt*St,q,Ot],[Wt*St,bt,0],Mt);bn(J,-St-.4,St+.4,bt-.15,bt+.55,-.32,.32,Oa(ee,-.18));for(let Wt of[-1,1])bn(J,Wt*(St+.1)-.35,Wt*(St+.1)+.35,bt,bt+1.7,-.3,.3,"#c9952e"),bn(J,Wt*(St+.1)-(Wt>0?.9:-.5),Wt*(St+.1)+(Wt>0?-.5:.9),bt+1.2,bt+1.7,-.26,.26,"#c9952e");for(let[Wt,Ce]of[[-1,-1],[1,-1],[1,1],[-1,1]])bn(J,Wt*Dt-.18,Wt*Dt+.18,le+ge-.05,le+ge+.45,Ce*oe-.18,Ce*oe+.18,Oa(ee,-.22))}let Et=_,Re=Math.max(c.roofRise||0,D*.55,3.5);if(g){let Dt=xt-.2,oe=Ht-.2;bn(k,-Dt,Dt,kt,j,-oe,oe,S);for(let Ot=0;Ot<=rt;Ot++){let Q=-Dt+Ot*2*Dt/rt;bn(k,Q-.22,Q+.22,kt+1.4,j,oe,oe+.06,Mt),bn(k,Q-.22,Q+.22,kt+1.4,j,-oe-.06,-oe,Mt)}let le=H+1.3,ie=D+1.3,ee=kt+.2,ge=ee+1.9,q=10,bt=Ot=>1.1*Math.pow(Ot,3),St=(Ot,Q)=>[Ot,ee+bt(Math.max(Math.abs(Ot)/le,Math.abs(Q)/ie)),Q];for(let Ot of[-1,1])for(let Q=0;Q<q;Q++){let Nt=-1+2*Q/q,xe=-1+2*(Q+1)/q;Z.quad(St(Nt*le,Ot*ie),St(xe*le,Ot*ie),[xe*Dt,ge,Ot*oe],[Nt*Dt,ge,Ot*oe],Et)}for(let Ot of[-1,1])for(let Q=0;Q<q;Q++){let Nt=-1+2*Q/q,xe=-1+2*(Q+1)/q;Z.quad(St(Ot*le,Nt*ie),St(Ot*le,xe*ie),[Ot*Dt,ge,xe*oe],[Ot*Dt,ge,Nt*oe],Et)}st(-Dt,Dt,oe,oe+.1,j),st(-Dt,Dt,-oe-.1,-oe,j),it(Dt+1.6,oe+1.6,j,Re,Et,1.6)}else it(H+1.4,D+1.4,kt+.15,Re,Et,1.5);Y.mesh(lt("#ffffff",{vertexColors:!0}),E),k.mesh(lt("#ffffff",{vertexColors:!0,map:Ft,side:mn}),E),Z.mesh(lt("#ffffff",{vertexColors:!0,map:Tt,side:mn}),E),J.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),E)}for(let c of qn){let g=t.buildings.find(_=>_.osmId===c);if(g){let _=g.ring,S=g.base-.4,E=3.9,A=g.base+E,U=new G,W=new G,H=0;_.forEach((ht,ut)=>{let it=_[(ut+1)%_.length];H+=ht[0]*it[1]-it[0]*ht[1]});for(let ht=0;ht<_.length;ht++){let ut=_[ht],it=_[(ht+1)%_.length],Et=Math.hypot(it[0]-ut[0],it[1]-ut[1]);U.quad([ut[0],S,ut[1]],[it[0],S,it[1]],[it[0],A,it[1]],[ut[0],A,ut[1]],"#f6f7f5",[[0,S/.6],[Et/.6,S/.6],[Et/.6,A/.6],[0,A/.6]]);let Re=(H>0?1:-1)*(it[1]-ut[1])/Et*.03,Dt=(H>0?-1:1)*(it[0]-ut[0])/Et*.03;U.quad([ut[0]+Re,S,ut[1]+Dt],[it[0]+Re,S,it[1]+Dt],[it[0]+Re,g.base+1.1,it[1]+Dt],[ut[0]+Re,g.base+1.1,ut[1]+Dt],"#9aa2a6",[[0,0],[Et/.6,0],[Et/.6,1.5/.6],[0,1.5/.6]]);let oe=Re*12,le=Dt*12;W.quad([ut[0]+oe,A,ut[1]+le],[it[0]+oe,A,it[1]+le],[it[0]+oe,A+.45,it[1]+le],[ut[0]+oe,A+.45,ut[1]+le],"#6f7a80")}let D=new G;for(let ht of Ks.triangulateShape(_.map(ut=>new de(ut[0],ut[1])),[]))D.tri(...ht.map(ut=>[_[ut][0],A+.3,_[ut][1]]),"#b9bec0");let j=_[g.front],Y=_[(g.front+1)%_.length],k=Math.hypot(Y[0]-j[0],Y[1]-j[1]),Z=(Y[0]-j[0])/k,J=(Y[1]-j[1])/k,ot=(H>0?1:-1)*J,pt=(H>0?-1:1)*Z,Ut=document.createElement("canvas");Ut.width=1024,Ut.height=256;let xt=Ut.getContext("2d");xt.fillStyle="#1f5fae",xt.fillRect(0,0,1024,128),xt.fillStyle="#fff",xt.font='bold 84px "PingFang SC","Noto Sans SC",sans-serif',xt.textAlign="center",xt.textBaseline="middle",xt.fillText("\u516C\u5171\u5395\u6240  WC",512,68);let Ht=(ht,ut,it)=>{xt.fillStyle=ut,xt.fillRect(ht,128,128,128),xt.fillStyle="#fff",xt.beginPath(),xt.arc(ht+64,158,14,0,7),xt.fill(),it?(xt.beginPath(),xt.moveTo(ht+64,174),xt.lineTo(ht+92,224),xt.lineTo(ht+36,224),xt.fill(),xt.fillRect(ht+52,224,8,22),xt.fillRect(ht+68,224,8,22)):(xt.fillRect(ht+48,174,32,46),xt.fillRect(ht+50,220,11,28),xt.fillRect(ht+67,220,11,28))};Ht(0,"#1f5fae",!1),Ht(128,"#d0342c",!0),xt.font='bold 92px "PingFang SC",sans-serif',xt.fillStyle="#1f5fae",xt.fillText("\u7537",320,194),xt.fillStyle="#d0342c",xt.fillText("\u5973",448,194);let kt=new as(Ut);kt.colorSpace=kn,kt.anisotropy=8;let Mt=new G,N=(ht,ut,it,Et,Re,Dt,oe,le)=>{let ie=j[0]+Z*ut+ot*Dt,ee=j[1]+J*ut+pt*Dt;ht.quad([ie-Z*Et/2,it,ee-J*Et/2],[ie+Z*Et/2,it,ee+J*Et/2],[ie+Z*Et/2,it+Re,ee+J*Et/2],[ie-Z*Et/2,it+Re,ee-J*Et/2],oe,le)},rt=Math.min(k*.7,7.5);N(Mt,k/2,g.base+2.75,rt,rt/8,.08,"#ffffff",[[0,.5],[1,.5],[1,1],[0,1]]);for(let[ht,ut]of[[0,.27],[1,.73]]){let it=k*ut;N(W,it,g.base,1.5,2.35,.06,"#2f3a40"),N(W,it,g.base,1.7,.12,.07,"#e9ece9"),N(W,it-.85,g.base,.12,2.47,.07,"#e9ece9"),N(W,it+.85,g.base,.12,2.47,.07,"#e9ece9"),N(Mt,it+(ht?-1.35:1.35),g.base+1.45,.62,.62,.09,"#ffffff",[[ht*.125,0],[ht*.125+.125,0],[ht*.125+.125,.5],[ht*.125,.5]])}N(Mt,k*.27,g.base+2.42,.5,.25,.09,"#ffffff",[[.25,.08],[.375,.08],[.375,.42],[.25,.42]]),N(Mt,k*.73,g.base+2.42,.5,.25,.09,"#ffffff",[[.375,.08],[.5,.08],[.5,.42],[.375,.42]]);let mt=(()=>{let ht=document.createElement("canvas");ht.width=ht.height=64;let ut=ht.getContext("2d");ut.fillStyle="#fff",ut.fillRect(0,0,64,64),ut.fillStyle="#c9cfd2",ut.fillRect(0,0,64,3),ut.fillRect(0,0,3,64);let it=new as(ht);return it.wrapS=it.wrapT=no,it.colorSpace=kn,it})(),st=new Pn;st.userData.placeId=sl(Object.keys(nr).find(ht=>nr[ht]===c)),jt.add(st),an.push(st),U.mesh(lt("#ffffff",{vertexColors:!0,map:mt,side:mn}),st),W.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),st),D.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),st),Mt.mesh(new os({map:kt,toneMapped:!1,side:mn,polygonOffset:!0,polygonOffsetFactor:-2}),st)}}{let _=pi(-1372,-25),S=new Pn;S.position.set(-1372,_,-25),S.rotation.y=Math.atan2(10,-37),S.userData.placeId=sl("\u864E\u5F62\u5C71\u8F66\u7AD9"),jt.add(S),an.push(S);let E=3,A=2.2,U=3.3,W=lt("#f6f4ee"),H=lt("#2a62c9"),D=lt("#33424a");qt(S,0,-.6,0,E*2+.6,.6,A*2+.6,lt("#c9c3b3")),qt(S,0,0,0,E*2,U,A*2,W),qt(S,0,U,0,E*2+.8,.35,A*2+.8,lt("#d8dcdc")),qt(S,0,U-.9,A+.03,E*2+.1,.75,.12,H),qt(S,-.9,.95,A+.02,1.6,1.15,.08,lt("#7fa4b5")),qt(S,-.9,.9,A+.2,1.9,.08,.4,D),qt(S,1.25,0,A+.02,1,2.2,.08,D);let j=document.createElement("canvas");j.width=512,j.height=96;let Y=j.getContext("2d");Y.fillStyle="#2a62c9",Y.fillRect(0,0,512,96),Y.fillStyle="#fff",Y.font='bold 64px "PingFang SC","Noto Sans SC",sans-serif',Y.textAlign="center",Y.textBaseline="middle",Y.fillText("\u552E \u7968 \u5904",256,52);let k=new as(j);k.colorSpace=kn;let Z=new Je(new _s(E*2-.4,.62),new os({map:k,toneMapped:!1}));Z.position.set(0,U-.52,A+.1),S.add(Z)}for(let c of _n){let g=c.area>=600,_=c.osmId===609990009?"#D9A93A":c.roofColor;Kg(c,{double:g,roofCol:B[_]||_,wallCol:gt[c.wallColor]||c.wallColor||"#f2b33a"})}{let c=t.buildings.find(g=>g.name==="\u4E07\u4F5B\u5854");if(c){let g=or(...c.center,"\u4E07\u4F5B\u5854");g.position.y=c.base;for(let _=0;_<7;_++){let S=6.2-_*.51;Ee(g,0,_*4.3,0,S,3.5,L);let E=new io(S+1.4,1.4,8),A=new Je(E,L);A.position.y=_*4.3+4,g.add(A)}Ee(g,0,30,0,.36,3,L)}}function Qg(c,g=2){let _=c;for(let S=0;S<g&&_.length>2;S++){let E=[_[0]];for(let A=1;A<_.length;A++){let U=_[A-1],W=_[A];E.push([U[0]*.75+W[0]*.25,U[1]*.75+W[1]*.25],[U[0]*.25+W[0]*.75,U[1]*.25+W[1]*.75])}E.push(_.at(-1)),_=E}return _}function tx(c,g){let _=0,S=[];for(let H=1;H<c.length;H++){let D=Math.hypot(c[H][0]-c[H-1][0],c[H][1]-c[H-1][1]);S.push(D),_+=D}let E=Math.max(1,Math.round(_/g)),A=[c[0]],U=0,W=0;for(let H=1;H<E;H++){let D=_*H/E;for(;U<S.length-1&&W+S[U]<D;)W+=S[U],U++;let j=S[U]?(D-W)/S[U]:0,Y=c[U],k=c[U+1];A.push([Y[0]+(k[0]-Y[0])*j,Y[1]+(k[1]-Y[1])*j])}return A.push(c.at(-1)),A}let Fl=new Map,Bl=8,ex=(c,g)=>Math.floor(c/Bl)+","+Math.floor(g/Bl);function lo(c,g,_,S=-1,E=!1){let A=null,U=_,W=Math.floor(c/Bl),H=Math.floor(g/Bl);for(let D=-1;D<=1;D++)for(let j=-1;j<=1;j++)for(let Y of Fl.get(W+D+","+(H+j))||[]){if(Y[7]===S)continue;let k=Y[2]-Y[0],Z=Y[3]-Y[1],J=k*k+Z*Z||1,ot=Xn(((c-Y[0])*k+(g-Y[1])*Z)/J,0,1),pt=Y[0]+k*ot,Ut=Y[1]+Z*ot,xt=Math.hypot(c-pt,g-Ut);xt<U&&(E||xt<Y[6])&&(U=xt,A=[pt,Ut,Y[4]+(Y[5]-Y[4])*ot,Y[6],Y[7]])}return A}let iu=0,zd=[],kd=[],nx=(c,g)=>[(c+e/2)/e,1-(g+n/2)/n];function Hd(c,g,_,S,E=null,{lift:A=.15,step:U=3,smooth:W=!0,level:H=!0,shoulder:D=2,bridge:j=!1}={}){let Y=tx(W?Qg(c):c,U).filter((N,rt,mt)=>!rt||Math.hypot(N[0]-mt[rt-1][0],N[1]-mt[rt-1][1])>.05);if(Y.length<2)return Y;let k=g/2,Z=E?Math.min(.6,g*.2):0,J=Y.length,ot=Y.map(N=>pi(N[0],N[1]));if(j){let N=ut=>lo(Y[ut][0],Y[ut][1],8)?.[2]??ot[ut],rt=N(0),mt=N(J-1),st=0,ht=[0];for(let ut=1;ut<J;ut++)ht.push(st+=Math.hypot(Y[ut][0]-Y[ut-1][0],Y[ut][1]-Y[ut-1][1]));ot=ht.map(ut=>rt+(mt-rt)*ut/(st||1))}else if(H){let N=Math.max(1,Math.round(8/U));ot=ot.map((st,ht)=>{let ut=0,it=0;for(let Et=Math.max(0,ht-N);Et<=Math.min(J-1,ht+N);Et++)ut+=ot[Et],it++;return ut/it});let rt=[0];for(let st=1;st<J;st++)rt.push(rt[st-1]+Math.hypot(Y[st][0]-Y[st-1][0],Y[st][1]-Y[st-1][1]));let mt=Y.map((st,ht)=>{let ut=ht===0||ht===J-1,it=ut?lo(st[0],st[1],k+3,-1,!0):lo(st[0],st[1],k+2);return it&&(ut||it[3]>=k+.2)?it[2]:null});for(let st of kd){let ht=-1,ut=k+1.5;for(let it=0;it<J;it++){let Et=Math.hypot(Y[it][0]-st[0],Y[it][1]-st[1]);Et<ut&&(ut=Et,ht=it)}ht>=0&&mt[ht]==null&&(mt[ht]=st[2])}ot=ot.map((st,ht)=>{if(mt[ht]!=null)return mt[ht];let ut=null,it=15;for(let Dt=0;Dt<J;Dt++)mt[Dt]!=null&&Math.abs(rt[Dt]-rt[ht])<it&&(it=Math.abs(rt[Dt]-rt[ht]),ut=mt[Dt]);if(ut==null)return st;let Et=it/15,Re=Et*Et*(3-2*Et);return ut+(st-ut)*Re})}let pt=Y.map((N,rt)=>{let mt=Y[Math.max(0,rt-1)],st=Y[Math.min(J-1,rt+1)],ht=Math.hypot(st[0]-mt[0],st[1]-mt[1])||1;return[(st[0]-mt[0])/ht,(st[1]-mt[1])/ht]}),Ut=new Map,xt=N=>{if(!Ut.has(N)){let rt,mt;Ut.set(N,Y.map((st,ht)=>{let ut=st[0]-pt[ht][1]*N,it=st[1]+pt[ht][0]*N;return ht&&(ut-rt)*pt[ht][0]+(it-mt)*pt[ht][1]<=0&&(ut=rt,it=mt),rt=ut,mt=it,[ut,it]}))}return Ut.get(N)},Ht=(N,rt,mt)=>{let[st,ht]=xt(rt)[N];return[st,H?mt:pi(st,ht)+mt-ot[N],ht]},kt=N=>ot[N]+A,Mt=N=>ot[N]+A-.04;for(let N=1;N<J;N++)Z&&(_.edge.quad(Ht(N-1,-k,Mt(N-1)),Ht(N,-k,Mt(N)),Ht(N,-k+Z,Mt(N)),Ht(N-1,-k+Z,Mt(N-1)),E),_.edge.quad(Ht(N-1,k-Z,Mt(N-1)),Ht(N,k-Z,Mt(N)),Ht(N,k,Mt(N)),Ht(N-1,k,Mt(N-1)),E)),_.fill.quad(Ht(N-1,-k+Z,kt(N-1)),Ht(N,-k+Z,kt(N)),Ht(N,k-Z,kt(N)),Ht(N-1,k-Z,kt(N-1)),S);for(let[N,rt]of[[0,-1],[J-1,1]]){let mt=Y[N],st=Math.atan2(pt[N][1],pt[N][0]),ht=(ut,it,Et)=>[mt[0]+Math.cos(ut)*it*rt,Et,mt[1]+Math.sin(ut)*it*rt];for(let ut=0;ut<8;ut++){let it=st-Math.PI/2+Math.PI*ut/8,Et=st-Math.PI/2+Math.PI*(ut+1)/8;_.fill.tri([mt[0],kt(N),mt[1]],ht(it,k-Z,kt(N)),ht(Et,k-Z,kt(N)),S),Z&&_.edge.quad(ht(it,k-Z,Mt(N)),ht(Et,k-Z,Mt(N)),ht(Et,k,Mt(N)),ht(it,k,Mt(N)),E)}}if(j)for(let N of[-1,1])for(let rt=1;rt<J;rt++)_.edge.quad(Ht(rt-1,N*k,Mt(rt-1)),Ht(rt,N*k,Mt(rt)),Ht(rt,N*k,Mt(rt)-1),Ht(rt-1,N*k,Mt(rt-1)-1),"#cfc8b6");if(H&&_.skirt&&!j){zd.push({s:Y,h:ot,dir:pt,w:k,shoulder:D,lift:A,id:iu,L:_,off:xt}),kd.push([Y[0][0],Y[0][1],ot[0]],[Y[J-1][0],Y[J-1][1],ot[J-1]]),hn.lineCap=hn.lineJoin="round",hn.strokeStyle="#fff",hn.lineWidth=(g+D*1.1)/e*Ue,hn.beginPath(),Y.forEach((N,rt)=>{let mt=(N[0]+e/2)/e*Ue,st=(N[1]+n/2)/n*Ue;rt?hn.lineTo(mt,st):hn.moveTo(mt,st)}),hn.stroke();for(let N=1;N<J;N++){let rt=[Y[N-1][0],Y[N-1][1],Y[N][0],Y[N][1],ot[N-1],ot[N],k,iu],mt=new Set;for(let st of[0,.25,.5,.75,1])mt.add(ex(Y[N-1][0]+(Y[N][0]-Y[N-1][0])*st,Y[N-1][1]+(Y[N][1]-Y[N-1][1])*st));for(let st of mt)Fl.has(st)||Fl.set(st,[]),Fl.get(st).push(rt)}}return iu++,Y}let ko={fill:"#62676b",edge:"#d6d1c4"},Vd={primary:{w:6.5,...ko},tertiary:{w:4.6,...ko},residential:{w:4,...ko},unclassified:{w:4,...ko},service:{w:3.4,...ko},bus_stop:{w:3,...ko},footway:{w:2.2,fill:"#d9d4c7",edge:"#9c9483"},path:{w:1.9,fill:"#e2bf84",edge:"#a27a45"},steps:{w:2.4,fill:"#cfc9bb",edge:"#8f8776"},alley:{w:1.2,fill:"#d3cec1",edge:"#8f887a"}},su={primary:6,tertiary:5,residential:4,unclassified:4,service:3,bus_stop:3,footway:2,steps:2,alley:1,path:1},Gd=()=>({edge:new G,fill:new G,skirt:new G}),zl=Gd(),kl=Gd(),Wd=new G,ru={edge:new G,fill:new G,skirt:null},ix=c=>[c.pts[0],c.pts.at(-1)].filter(g=>t.roads.some(_=>_!==c&&_.pts.some((S,E)=>E&&E<_.pts.length-1&&Math.hypot(S[0]-g[0],S[1]-g[1])<6||E&&(()=>{let A=_.pts[E-1],U=S[0]-A[0],W=S[1]-A[1],H=U*U+W*W||1,D=Xn(((g[0]-A[0])*U+(g[1]-A[1])*W)/H,.05,.95);return Math.hypot(g[0]-A[0]-U*D,g[1]-A[1]-W*D)<2})()))).length;for(let c of t.roads)c._ends=ix(c);for(let c of[...t.roads].sort((g,_)=>!!g.bridge-!!_.bridge||(su[_.kind]||3)-(su[g.kind]||3)||g._ends-_._ends)){if(c.model==="stair")continue;let g=Vd[c.kind]||Vd.service,_=["steps","path","footway","alley"].includes(c.kind),S=Math.max(c.width,g.w),E=su[c.kind]||3,A=Hd(c.pts,S,_?kl:zl,g.fill,g.edge,{lift:.14+E*.012+(c.drape?.12:0),step:c.drape?1:_?4:5,bridge:!!c.bridge,smooth:!c.bridge,level:!c.drape,shoulder:_?1.4:2.2});if(c.kind==="primary"||c.kind==="tertiary"){let U=A.map(W=>lo(W[0],W[1],1)?.[2]??pi(W[0],W[1]));for(let W=0;W+1<A.length;W+=3){let H=(U[W]+U[W+1])/2+.14+E*.012+.03;Wd.quad(...[[A[W],-.11],[A[W+1],-.11],[A[W+1],.11],[A[W],.11]].map(([D,j])=>{let Y=[A[W+1][0]-A[W][0],A[W+1][1]-A[W][1]],k=Math.hypot(...Y)||1;return[D[0]-Y[1]/k*j,H,D[1]+Y[0]/k*j]}),"#ffffff")}}if(c.kind==="steps"){let U=0;for(let W=1;W<A.length;W++){let H=A[W-1],D=A[W],j=Math.hypot(D[0]-H[0],D[1]-H[1]),Y=-(D[1]-H[1])/j,k=(D[0]-H[0])/j;for(let Z=(.7-U%.7)/j;Z<1;Z+=.7/j){let J=H[0]+(D[0]-H[0])*Z,ot=H[1]+(D[1]-H[1])*Z,pt=S*.4,Ut=(lo(J,ot,1)?.[2]??pi(J,ot))+.2+E*.012;tn(we,[[J+Y*pt,Ut,ot+k*pt],[J-Y*pt,Ut,ot-k*pt]],"#9c8a6c")}U+=j}}if(c.bridge)for(let U of[-1,1]){let W=c.pts.map((H,D)=>{let j=c.pts[Math.min(D+1,c.pts.length-1)]||H,Y=c.pts[Math.max(0,D-1)],k=j[0]-Y[0],Z=j[1]-Y[1],J=Math.hypot(k,Z)||1,ot=H[0]-Z/J*S/2*U,pt=H[1]+k/J*S/2*U;return[ot,(lo(H[0],H[1],S)?.[2]??v(...H))+1.1,pt]});tn(Ct,W,"#ceccc0")}}for(let c of zd){let{s:g,h:_,dir:S,w:E,shoulder:A,lift:U,id:W,L:H,off:D}=c,j=g.length,Y=(J,ot,pt)=>{let[Ut,xt]=D(ot)[J];return[Ut,pt??pi(Ut,xt),xt]},k=J=>{let ot=lo(J[0],J[2],12,W);return ot&&(J[1]=Math.min(J[1],ot[2]-.15)),J},Z=(J,ot,pt,Ut)=>H.skirt.quad(...[J,ot,pt,Ut].map(k),"#ffffff",[J,ot,pt,Ut].map(xt=>nx(xt[0],xt[2])));for(let J of[-1,1])for(let ot=1;ot<j;ot++)Z(Y(ot-1,J*E,_[ot-1]+U-.06),Y(ot,J*E,_[ot]+U-.06),Y(ot,J*(E+A)),Y(ot-1,J*(E+A)));for(let[J,ot]of[[0,-1],[j-1,1]]){let pt=g[J],Ut=S[J],xt=Math.atan2(Ut[1],Ut[0]),Ht=_[J]+U-.06;for(let kt=0;kt<8;kt++){let Mt=xt-Math.PI/2+Math.PI*kt/8,N=xt-Math.PI/2+Math.PI*(kt+1)/8,rt=st=>[pt[0]+Math.cos(st)*E*ot,Ht,pt[1]+Math.sin(st)*E*ot],mt=st=>{let ht=pt[0]+Math.cos(st)*(E+A)*ot,ut=pt[1]+Math.sin(st)*(E+A)*ot;return[ht,pi(ht,ut),ut]};Z(rt(Mt),rt(N),mt(N),mt(Mt))}}}pn.needsUpdate=!0;for(let c of t.water)Hd(c.pts,c.kind==="river"?5:1.8,ru,"#5fb4dc",c.kind==="river"?"#3f8fbd":null,{lift:.1,step:5,level:!1});let co=c=>new os({vertexColors:!0,side:mn,toneMapped:!1,polygonOffset:!0,polygonOffsetFactor:-1,polygonOffsetUnits:c}),Xd=new os({map:Rn,color:"#d9d9d9",side:mn});zl.skirt.mesh(Xd,Lt),kl.skirt.mesh(Xd,we),zl.edge.mesh(co(-2),Lt),kl.edge.mesh(co(-2),we),ru.edge.mesh(co(-2),Lt),ru.fill.mesh(co(-4),Lt),kl.fill.mesh(co(-4),we),zl.fill.mesh(co(-6),Lt),Wd.mesh(co(-8),Lt);for(let c of t.areas.filter(g=>g.kind==="water")){let g=new G;for(let _ of c.triangles)g.tri(..._.map(S=>[S[0],v(...S)+.3,S[1]]),"#6b9290");g.mesh(lt("#ffffff",{vertexColors:!0,roughness:.25,side:mn}),Lt)}Gt("#load-text").textContent="\u94FA\u8BBE\u5C71\u6797\u3001\u7F06\u8F66\u4E0E\u5546\u5BB6\u6807\u8BB0",await new Promise(requestAnimationFrame);let sx=t.places.filter(c=>["\u4E0A\u95F5\u56ED","\u4E2D\u95F5\u56ED","\u4E0B\u95F5\u56ED","\u95F5\u56ED"].includes(c.n)).map(c=>[c.x,c.z]);function rx(c,g,_,S){if(_<420||_>1e3||S>1.1)return 0;let E=1e9;for(let[A,U]of sx)E=Math.min(E,Math.hypot(c-A,g-U));return E<900?.55:_<760&&E<2600?.12:0}let ou=[],Hl=[],ar=Ui(892),qd=ks?3600:16e3;for(let c=0;c<qd*8&&Hl.length<qd;c++){let g=(ar()-.5)*e*.998,_=(ar()-.5)*n*.998,S=v(g,_),E=f(S);if(ze(g,_)||E<100||E>1310)continue;let A=Math.hypot(v(g+10,_)-v(g-10,_),v(g,_+10)-v(g,_-10))/20/l;if(A>1.7&&ar()<.84)continue;let U=tt(g,_,E);if(ar()>.06+.94*U*U)continue;let W=(6.5+ar()*6.7)*(U>.6?1.15:.9),H=rx(g,_,E,A);if(H&&ar()<H){ou.push({x:g,z:_,h:S,s:9+ar()*4,r:ar()});continue}Hl.push({x:g,z:_,h:S,s:W,r:ar(),pine:ar()<.18+(E>800?.25:0)})}let ho=3,Yd=(c,g)=>Math.min(ho-1,Math.max(0,Math.floor((c+e/2)/e*ho)))*ho+Math.min(ho-1,Math.max(0,Math.floor((g+n/2)/n*ho)));function Ba(){let c=new vh(1,0);c.deleteAttribute("normal"),c.deleteAttribute("uv");let g=Eg(c);return g.setAttribute("normal",g.getAttribute("position").clone()),g}let Vl=Be(Nr[fi].hiShapes),ox=lt("#686854"),ax=lt("#ffffff"),lx=lt("#ffffff"),cx=lt("#ffffff",{roughness:.85}),au=ks?1:4,$d=ks?1.35:1,za=[],lu=[...Array(ho*ho)].map(()=>({list:[],bamboo:[]}));for(let c of Hl)lu[Yd(c.x,c.z)].list.push(c);for(let c of ou)lu[Yd(c.x,c.z)].bamboo.push(c);let Ni=new vi,Ho=new fn,Gl=(c,g,_,S)=>{if(!_)return null;let E=new Dr(c,g,_);return E.receiveShadow=S,fe.add(E),E};for(let c of lu){let g=c.list,_=[0],S=[0];for(let k of g)_.push(_.at(-1)+(k.pine?0:1)),S.push(S.at(-1)+(k.pine?1:0));let E=Gl(Vl.trunk,ox,g.length,!1),A=Gl(Vl.leaf,ax,_.at(-1),!0),U=Gl(Vl.pine,lx,S.at(-1)*2,!0),W=Gl(Vl.bamboo,cx,c.bamboo.length*au,!0),H=0,D=0,j=0,Y=0;for(let k of g){Ni.position.set(k.x,k.h+k.s*.35,k.z),Ni.rotation.set(0,k.r*6.28,0),Ni.scale.set(1,k.s*.7,1),Ni.updateMatrix(),E.setMatrixAt(H++,Ni.matrix);for(let Z=0;Z<2;Z++)k.pine?(Ni.position.set(k.x,k.h+k.s*(.68+Z*.36),k.z),Ni.scale.set(k.s*(.5-Z*.12),k.s*.91,k.s*(.5-Z*.12)),Ho.set(k.r>.5?"#2e7a52":"#3d8c5a"),Ni.updateMatrix(),U.setMatrixAt(j,Ni.matrix),U.setColorAt(j++,Ho)):Z||(Ni.position.set(k.x,k.h+k.s*.72,k.z),Ni.scale.set(k.s*.74,k.s*.5,k.s*.72),Ho.set(k.r<.05?"#f0b23e":k.r>.965?"#e86a3f":["#5aa646","#78bb4e","#3f8f45","#93c95a"][Math.floor(k.r*4)]),Ni.updateMatrix(),A.setMatrixAt(D,Ni.matrix),A.setColorAt(D++,Ho))}for(let k of c.bamboo)for(let Z=0;Z<au;Z++){let J=k.r*6.28+Z*1.9,ot=Z?2.2+(k.r*97+Z*13)%1*1.8:0;Ni.position.set(k.x+Math.cos(J)*ot,k.h+k.s*(.6-.05*Z),k.z+Math.sin(J)*ot),Ni.rotation.set(Math.sin(J)*.22,0,Math.cos(J)*.22),Ni.scale.set((2.1+.4*(Z*7%3))*$d,k.s*.46*(1-.06*Z),(2.1+.4*(Z*5%3))*$d),Ni.updateMatrix(),W.setMatrixAt(Y,Ni.matrix),Ho.set(["#8cc25a","#99ca62","#7fb852","#a6d16c"][(Z+Math.floor(k.r*4))%4]),W.setColorAt(Y++,Ho)}for(let k of[E,A,U,W])k&&(k.instanceMatrix.needsUpdate=!0,k.instanceColor&&(k.instanceColor.needsUpdate=!0),k.computeBoundingSphere());za.push({trunk:E,crown:A,cone:U,bam:W,n:g.length,leafPre:_,pinePre:S,nb:c.bamboo.length})}function hx(c){for(let g of za){let _=Math.round(c*g.n);g.trunk&&(g.trunk.count=_),g.crown&&(g.crown.count=g.leafPre[_]),g.cone&&(g.cone.count=2*g.pinePre[_]),g.bam&&(g.bam.count=Math.round(c*g.nb)*au)}}let Zd=null;function Jd(){let c=Nr[fi],g=Zd??(c.forest>0&&!_r);fe.visible=g,Gt("#layer-trees").checked=g,g&&hx(c.forest||1)}function ux(c){let g=Be(c);for(let _ of za)_.trunk&&(_.trunk.geometry=g.trunk),_.crown&&(_.crown.geometry=g.leaf),_.cone&&(_.cone.geometry=g.pine),_.bam&&(_.bam.geometry=g.bamboo);$t&&($t.geometry=g.lantern)}function jd(){let c=Nr[fi];T.setCeiling(x(),!0),z(!1),at=!0,Xt.traverse(_=>{_.isMesh&&_.material&&!Array.isArray(_.material)&&(_.material=be(_.material,c.pbr))}),document.documentElement.classList.toggle("lite",!c.blur),ux(c.hiShapes),Jd();for(let _ of za)_.bam&&(_.bam.visible=c.bamboo&&!_r);Kd=_r?12:c.labelCap;let g=I();p.shadowMap.enabled!==g&&(p.shadowMap.enabled=Le.castShadow=g,Xt.traverse(_=>{if(_.material)for(let S of[].concat(_.material))S.needsUpdate=!0}))}let cu=[];for(let c of t.cables){let g=c.pts[0],_=c.pts.at(-1),S=Math.hypot(_[0]-g[0],_[1]-g[1]),E=[];for(let H=0;H<=90;H++){let D=H/90,j=g[0]+(_[0]-g[0])*D,Y=g[1]+(_[1]-g[1])*D,k=Math.max(v(j,Y)+13,v(...g)*(1-D)+v(..._)*D+23-Math.sin(D*Math.PI)*S*.017);E.push(new X(j,k,Y))}let A=new Ro(E),U=-(_[1]-g[1])/S*2,W=(_[0]-g[0])/S*2;for(let H of[-1,1])tn(Ct,E.map(D=>[D.x+U*H,D.y,D.z+W*H]),"#3e514c");for(let H of[.2,.43,.67,.84]){let D=A.getPoint(H),j=v(D.x,D.z);Ee(Ct,D.x,j,D.z,.6,D.y-j,Me),qt(Ct,D.x,D.y-1,D.z,10,.65,1.2,Me)}for(let H=0;H<6;H++){let D=new Pn;qt(D,0,0,0,3.6,2.6,2.4,yt),qt(D,0,1,0,3.7,1,2.45,pe),qt(D,0,2.8,0,.2,3,.2,O),Ct.add(D),cu.push({g:D,curve:A,phase:H/6,kind:"cable"})}}for(let c of t.funicular){let g=[];for(let A=1;A<c.pts.length;A++){let U=c.pts[A-1],W=c.pts[A],H=Math.ceil(Math.hypot(W[0]-U[0],W[1]-U[1])/3);for(let D=0;D<H;D++){let j=D/H,Y=U[0]+(W[0]-U[0])*j,k=U[1]+(W[1]-U[1])*j;g.push(new X(Y,v(Y,k)+.8,k))}}let _=c.pts.at(-1);g.push(new X(_[0],v(..._)+.8,_[1]));let S=new Ro(g);for(let A of[-1,1])tn(Ct,g.map(U=>[U.x,U.y,U.z+A*.8]),"#dad8c3");let E=new Pn;qt(E,0,0,0,7,2.5,2.4,lt("#eee8d8")),qt(E,0,.8,0,6.8,1.2,2.45,pe),qt(E,0,2.3,0,7,.45,2.6,yt),Ct.add(E),cu.push({g:E,curve:S,phase:.4,kind:"funicular"})}{let c=[[/厕|洗手亭/,"wc"],[/停车场/,"park"],[/索道|缆车/,"cable"],[/加油站/,"fuel"],[/充电站/,"charge"],[/车站|客运站/,"bus"],[/售票|检票/,"ticket"],[/游客服务/,"info"],[/卫生院|医院/,"hospital"],[/药房|药堂/,"pharmacy"],[/派出所|公安|警/,"police"],[/小学|幼儿园|学校/,"school"],[/邮政|邮局/,"post"],[/银行/,"bank"]],g={wc:["#2f7fd0","WC"],park:["#2a62c9","P"],cable:["#7a52c2","\u7F06"],fuel:["#d9432f","\u6CB9"],charge:["#13a07a","\u7535"],bus:["#1d9a5b","bus"],ticket:["#e08a1e","\u7968"],info:["#2b8fd6","i"],hospital:["#ffffff","+r"],pharmacy:["#ffffff","+g"],police:["#1f4fa3","\u8B66"],school:["#e5a72e","\u5B66"],post:["#1a8a4a","\u90AE"],bank:["#c0392b","\xA5"]},_=Object.keys(g),S=document.createElement("canvas");S.width=S.height=512;let E=S.getContext("2d");_.forEach((J,ot)=>{let[pt,Ut]=g[J],xt=ot%4*128,Ht=Math.floor(ot/4)*128;E.fillStyle=pt,E.fillRect(xt,Ht,128,128),E.strokeStyle="rgba(0,0,0,.18)",E.lineWidth=6,E.strokeRect(xt+3,Ht+3,122,122),E.fillStyle="#fff",E.textAlign="center",E.textBaseline="middle",Ut==="+r"||Ut==="+g"?(E.fillStyle=Ut==="+r"?"#d8312a":"#1f9a52",E.fillRect(xt+50,Ht+22,28,84),E.fillRect(xt+22,Ht+50,84,28)):Ut==="bus"?(E.beginPath(),E.roundRect(xt+22,Ht+26,84,66,10),E.fill(),E.fillStyle=pt,E.fillRect(xt+30,Ht+36,68,24),E.fillStyle="#fff",E.beginPath(),E.arc(xt+42,Ht+98,10,0,7),E.arc(xt+86,Ht+98,10,0,7),E.fill()):(E.font=`bold ${Ut.length>1&&/^[A-Z]/.test(Ut)?64:Ut==="i"?92:76}px "PingFang SC","Noto Sans SC",sans-serif`,E.fillText(Ut,xt+64,Ht+68))});let A=new as(S);A.colorSpace=kn,A.anisotropy=8;let U=new G,W=new G,H=new G,D=(J,ot,pt)=>{let Ut=!1;for(let xt=0,Ht=pt.length-1;xt<pt.length;Ht=xt++){let kt=pt[xt],Mt=pt[Ht];kt[1]>ot!=Mt[1]>ot&&J<(Mt[0]-kt[0])*(ot-kt[1])/(Mt[1]-kt[1])+kt[0]&&(Ut=!Ut)}return Ut},j=(J,ot)=>{let pt=null,Ut=40;for(let xt of t.roads)if(!["footway","path","steps"].includes(xt.kind))for(let Ht=1;Ht<xt.pts.length;Ht++){let kt=xt.pts[Ht-1],Mt=xt.pts[Ht],N=Mt[0]-kt[0],rt=Mt[1]-kt[1],mt=N*N+rt*rt||1,st=Xn(((J-kt[0])*N+(ot-kt[1])*rt)/mt,0,1),ht=kt[0]+N*st,ut=kt[1]+rt*st,it=Math.hypot(J-ht,ot-ut);it<Ut&&(Ut=it,pt={x:ht,z:ut,ux:N/Math.sqrt(mt),uz:rt/Math.sqrt(mt)})}return pt},Y=(J,ot,pt,Ut,xt,Ht,kt,Mt)=>{let N=[[ot,Ut,Ht],[pt,Ut,Ht],[pt,Ut,kt],[ot,Ut,kt],[ot,xt,Ht],[pt,xt,Ht],[pt,xt,kt],[ot,xt,kt]];for(let rt of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])J.quad(N[rt[0]],N[rt[1]],N[rt[2]],N[rt[3]],Mt)},k=(J,ot,pt,Ut,xt,Ht,kt,Mt,N,rt)=>{let mt=-xt,st=Ut,ht=(it,Et,Re)=>[ot+Ut*it+mt*Et,Re,pt+xt*it+st*Et],ut=[ht(-Ht,-kt,Mt),ht(Ht,-kt,Mt),ht(Ht,kt,Mt),ht(-Ht,kt,Mt),ht(-Ht,-kt,N),ht(Ht,-kt,N),ht(Ht,kt,N),ht(-Ht,kt,N)];for(let it of[[0,1,5,4],[1,2,6,5],[2,3,7,6],[3,0,4,7],[4,5,6,7]])J.quad(ut[it[0]],ut[it[1]],ut[it[2]],ut[it[3]],rt)};for(let J of t.places){if(J.category!=="service"&&J.category!=="transport")continue;let ot=c.find(([le])=>le.test(J.n))?.[1];if(!ot||/公司|营业厅/.test(J.n)||nr[J.n])continue;let pt=_.indexOf(ot),Ut=pt%4/4,xt=1-Math.floor(pt/4)/4,Ht=[[Ut+.004,xt-.246],[Ut+.246,xt-.246],[Ut+.246,xt-.004],[Ut+.004,xt-.004]],kt=t.buildings.find(le=>Math.abs(le.rectCenter[0]-J.x)<40&&Math.abs(le.rectCenter[1]-J.z)<40&&D(J.x,J.z,le.ring)),Mt=pi(J.x,J.z),N=kt?qn.has(kt.osmId)?kt.base+4.2:kt.base+kt.wallHeight+(kt.roofRise||0):Mt,rt=5.5,mt=N+(kt?1.5:7),st=rt/2;Y(W,J.x-.18,J.x+.18,kt?N-.5:Mt,mt,J.z-.18,J.z+.18,"#5b6066");let ht=J.x-st,ut=J.x+st,it=J.z-st,Et=J.z+st,Re=mt,Dt=mt+rt;U.quad([ht,Re,Et],[ut,Re,Et],[ut,Dt,Et],[ht,Dt,Et],"#ffffff",Ht),U.quad([ut,Re,it],[ht,Re,it],[ht,Dt,it],[ut,Dt,it],"#ffffff",Ht),U.quad([ut,Re,Et],[ut,Re,it],[ut,Dt,it],[ut,Dt,Et],"#ffffff",Ht),U.quad([ht,Re,it],[ht,Re,Et],[ht,Dt,Et],[ht,Dt,it],"#ffffff",Ht);let oe=[[Ut+.12,xt-.12],[Ut+.13,xt-.12],[Ut+.13,xt-.13],[Ut+.12,xt-.13]];if(U.quad([ht,Dt,Et],[ut,Dt,Et],[ut,Dt,it],[ht,Dt,it],"#ffffff",oe),ot==="bus"&&J.n!=="\u4E09\u89D2\u6D32\u8F66\u7AD9"){let le=j(J.x,J.z);if(le){let ie=le.x,ee=le.z,ge=pi(ie,ee)+.45;k(H,ie,ee,le.ux,le.uz,4.6,1.25,ge,ge+2.9,"#2fae6a"),k(H,ie,ee,le.ux,le.uz,4.62,1.27,ge+1.55,ge+2.45,"#2b3a40"),k(H,ie,ee,le.ux,le.uz,4.5,1.2,ge+2.9,ge+3.1,"#f4f1e8");for(let q of[-2.9,2.9])for(let bt of[-1,1]){let St=ie+le.ux*q-le.uz*1.2*bt,Ot=ee+le.uz*q+le.ux*1.2*bt;k(H,St,Ot,le.ux,le.uz,.5,.18,ge-.45,ge+.5,"#2a2a2a")}}}if(ot==="fuel"){let le=Mt+5.2;Y(H,J.x-6,J.x+6,le,le+.8,J.z-4.5,J.z+4.5,"#f4f1e8"),Y(H,J.x-6.05,J.x+6.05,le+.15,le+.55,J.z-4.55,J.z+4.55,"#d9432f");for(let[ie,ee]of[[-5,-3.5],[5,-3.5],[-5,3.5],[5,3.5]])Y(H,J.x+ie-.2,J.x+ie+.2,Mt,le,J.z+ee-.2,J.z+ee+.2,"#e8e4da");for(let ie of[-2.2,2.2])Y(H,J.x+ie-.5,J.x+ie+.5,Mt,Mt+1.9,J.z-.35,J.z+.35,"#d9432f")}}let Z=new Pn;Ct.add(Z),Si.push(U.mesh(new os({map:A,toneMapped:!1}),Z),W.mesh(lt("#ffffff",{vertexColors:!0}),Z)),H.p.length&&H.mesh(lt("#ffffff",{vertexColors:!0,side:mn}),Z)}for(let[c,g]of $e){let _=new Ln;_.setAttribute("position",new Qe(g.p,3)),_.setAttribute("color",new Qe(g.c,3)),c.add(new El(_,new Ta({vertexColors:!0})))}if(y){let c=Bg(y,lt);jt.add(c),an.push(c),vr.set(d.n,y.floor+7.5)}{let c=new Map,g=E=>[E.type,E.color?.getHexString(),E.emissive?.getHexString(),E.emissiveIntensity,E.roughness,E.metalness,E.opacity,E.transparent,E.side,E.map?.uuid,E.emissiveMap?.uuid,E.vertexColors,E.flatShading,E.depthWrite,E.depthTest,E.alphaTest,E.polygonOffset,E.polygonOffsetFactor,E.polygonOffsetUnits,E.fog,E.toneMapped].join("/"),_=E=>{let A=g(E);return c.has(A)||c.set(A,E),c.get(A)},S=E=>{for(let U of[...E.children])!U.isMesh&&U.children.length&&S(U);let A=new Map;for(let U of E.children){if(!U.isMesh||U.isInstancedMesh||U.isSkinnedMesh||Array.isArray(U.material)||U.children.length||!U.visible||Object.keys(U.geometry.morphAttributes).length)continue;U.material=_(U.material);let W=U.geometry,H=g(U.material)+"|"+Object.keys(W.attributes).sort().join()+"|"+!!W.index+"|"+U.castShadow+U.receiveShadow+"|"+U.renderOrder;A.has(H)||A.set(H,[]),A.get(H).push(U)}for(let U of A.values()){if(U.length<2)continue;let W=ro(U.map(D=>(D.matrixAutoUpdate&&D.updateMatrix(),D.geometry.clone().applyMatrix4(D.matrix))));if(!W)continue;let H=new Je(W,U[0].material);H.castShadow=U[0].castShadow,H.receiveShadow=U[0].receiveShadow,H.renderOrder=U[0].renderOrder;for(let D of U)E.remove(D);E.add(H)}};for(let E of jt.children)E.isGroup&&S(E)}for(let c of an)Vn.push(c);let hu=[];if(p.capabilities.isWebGL2||p.extensions.has("OES_element_index_uint")){let c=[Bn,...jt.children.filter(g=>g.isMesh&&!g.isInstancedMesh&&!g.material.transparent&&!g.children.length&&g.geometry.attributes.position.count>3e3)];for(let g of c){let _=zg(g);_&&hu.push(_)}}Lt.traverse(c=>{c.isMesh&&(c.updateMatrix(),c.matrixAutoUpdate=!1)});let lr=t.places.map(c=>({...c})),fx=new Map(lr.map(c=>[c.n,c])),dx=new Map(lr.map(c=>[c.placeId,c])),uu=c=>["hotel","food","shop"].includes(c.category),fu=c=>c.quality?.startsWith("legacy")||["overture","unverified_listing","derived_area","owner_reported"].includes(c.quality),ji=null,Wl="all",Vo="",px=0,Xl=0,Kd=null,mx={temple:"\u5BFA",hotel:"\u5BBF",food:"\u98DF",shop:"\u8D2D",transport:"\u884C",nature:"\u5C71",sight:"\u666F",village:"\u6751",service:"\u516C"},gx={temple:["temple"],sight:["sight","nature","village"],service:["service","transport"]},Qd=Zp(lr),Mr=lr.find(c=>c.featured),xx=c=>c.quality==="owner_reported"?Qp:c.featured?"\u4E1A\u4E3B\u63D0\u4F9B\u5B9E\u62CD \xB7 \u4F4D\u7F6E\u6309\u95E8\u724C\u4F30\u8BA1":c.qualityLabel||{converted_listing:"\u643A\u7A0B\u516C\u5F00\u5750\u6807 \xB7 \u5DF2\u6362\u7B97",mapped:"OpenStreetMap \u5730\u56FE\u8BB0\u5F55",multi_source:"\u591A\u4E2A\u5E73\u53F0\u5750\u6807\u76F8\u4E92\u5370\u8BC1",platform_listing:"\u516C\u5F00\u5E73\u53F0\u5750\u6807 \xB7 \u5355\u4E00\u6765\u6E90",unverified_listing:"\u5355\u4E00\u5E73\u53F0\u6536\u5F55 \xB7 \u4F4D\u7F6E\u4E0E\u8425\u4E1A\u72B6\u6001\u5F85\u6838",derived_area:"\u7531\u95E8\u724C\u5730\u5740\u8303\u56F4\u63A8\u7B97",overture:"\u516C\u5F00\u5730\u56FE\u8BB0\u5F55 \xB7 \u5F85\u590D\u6838",legacy_osm:"\u65E7\u7248\u5730\u56FE\u70B9 \xB7 \u5F85\u590D\u6838",user_confirmed:"\u7528\u6237\u5B9E\u5730\u786E\u8BA4"}[c.quality]||"\u65E7\u7248\u4F30\u8BA1\u4F4D\u7F6E \xB7 \u5F85\u6838",ql=new Map;for(let c of t.buildings){let g=Math.floor(c.center[0]/60)+","+Math.floor(c.center[1]/60);ql.has(g)||ql.set(g,[]),ql.get(g).push(c)}function yx(c,g=20){let _=null,S=g,E=Math.floor(c.x/60),A=Math.floor(c.z/60);for(let U=-1;U<=1;U++)for(let W=-1;W<=1;W++)for(let H of ql.get(E+U+","+(A+W))||[]){let D=Math.hypot(c.x-H.center[0],c.z-H.center[1]);D<S&&(_=H,S=D)}return _}let _x=new Map(t.buildings.map(c=>[c.id,c])),vx='<svg viewBox="0 0 24 24"><path d="M4 11.2 12 4.5l8 6.7V19a1 1 0 0 1-1 1h-4.6v-5.2H9.6V20H5a1 1 0 0 1-1-1z"/></svg>',Mx={featured:[14.85,9.5,48,39],area:[16.5,11.5,4,15],major:[14.04,8.8,34,34],small:[10.71,6.6,24,27],road:[10.2,6.2,18,20],plain:[12.24,7.5,29,31]};function bx(c,g){let[_,S,E,A]=Mx[["featured","area","major","small","road"].find(W=>c.includes(W))||"plain"],U=E;for(let W of g)U+=W.codePointAt(0)>=11904?_:S;return[Math.ceil(U),A]}function du(c,g,_,S){let E=Ae("div","maplabel pin "+g);c.placeId&&(E.dataset.placeId=c.placeId),c.stem=g.includes("featured")?9:g.includes("area")||g.includes("road")?0:7;let A=Ae("button","");if(A.type="button",A.tabIndex=-1,c.featured){let W=Ae("span","lb-icon");W.innerHTML=vx,A.append(W)}A.append(_),S&&(A.onclick=S),E.append(A,Ae("i"));let U=new Pa(E);return U.center.set(.5,1),c.label=U,c.el=E,[c.labelWidth,c.labelHeight]=bx(g,_),U}for(let c of lr){if(!Number.isFinite(c.x)||!Number.isFinite(c.z)||!(c.searchable||c.featured))continue;let g=(c.featured?"featured ":"")+"c-"+c.category+(c.p===1&&!c.featured?" major":"")+(fu(c)?" estimated":"")+(c.category==="village"?" area":""),_=du(c,g,c.displayName||c.shortName||c.n,()=>qa(c,!0));c.tier=c.featured||c.p===1?2:c.category==="temple"&&c.story?1:0;let S=c.n==="\u767E\u5C81\u5BAB"?t.buildings.find(A=>A.osmId===541482372):nr[c.n]?t.buildings.find(A=>A.osmId===nr[c.n]):null,E=S||c.buildingId&&_x.get(c.buildingId)||yx(c,uu(c)?12:35);c.top=vr.get(c.n)??(qn.has(S?.osmId)?S.base+4.4:c.category==="village"?v(c.x,c.z)+40:E?E.base+E.wallHeight+E.roofRise:v(c.x,c.z)+(c.category==="temple"?22:uu(c)?9:11)),_.position.set(S?S.center[0]:c.x,c.top+5,S?S.center[1]:c.z),c.nearest=E,c.limit=c.featured||c.p===1?1/0:c.category==="village"?2600:uu(c)?c.quality==="unverified_listing"?650:1250:c.category==="temple"||c.p<=2?3600:1900}let Yl=[];for(let c of lr)for(let g of c.halls||[]){let _={n:g.n,x:g.x,z:g.z,p:5,parent:c,limit:300,hall:!0};du(_,"small hall",g.n,()=>qa(c,!1)),_.top=v(g.x,g.z)+9,_.label.position.set(g.x,_.top+4,g.z),Yl.push(_)}{let c=new Map;for(let g of t.roads){if(!g.name||g.pts.length<2)continue;let _=0;for(let S=1;S<g.pts.length;S++)_+=Math.hypot(g.pts[S][0]-g.pts[S-1][0],g.pts[S][1]-g.pts[S-1][1]);(!c.has(g.name)||c.get(g.name).len<_)&&c.set(g.name,{r:g,len:_})}for(let[g,{r:_}]of c){let S=_.pts[Math.floor(_.pts.length/2)],E={n:g,x:S[0],z:S[1],p:4,limit:2200,road:!0};du(E,"road",g.replace(/\s*\(.*\)$/,""),null),E.top=v(S[0],S[1]),E.label.position.set(S[0],E.top+3,S[1]),Yl.push(E)}}let Sx=lr.concat(Yl).filter(c=>c.label);function vs(c,g,_=900,S=145,E=57){let A=new X(c,v(c,g)*Lt.scale.y,g),U=S*Math.PI/180,W=E*Math.PI/180;return{target:A,pos:A.clone().add(new X(-Math.sin(U)*_*Math.sin(W),_*Math.cos(W),Math.cos(U)*_*Math.sin(W)))}}let mi=null,Go=!1,tp=[],ki=fg(It,se,{reducedMotion:Nl});function cr(c,g=1200,_=null,S=0){mi?.stopPreview(),ki.move(c,g,_,S),Go&&Ki()}let ep=c=>Xn(900+It.position.distanceTo(c.pos)*.35,1100,2400),Cs=null;function np(){let c=ki.destination;Cs??={pos:(c?c.pos:It.position).clone(),target:(c?c.target:se.target).clone(),view:Gt(".viewbar button.active")?.dataset.view}}function Ex(){let c=Cs;Cs=null,c&&(cr(c,Math.round(ep(c)*1.2)),Zi("[data-view]").forEach(g=>g.classList.toggle("active",g.dataset.view===c.view)),$l())}let ka=()=>{let c=se.target.clone().sub(It.position);return Math.atan2(c.x,-c.z)*180/Math.PI};function pu(c=Hn?220:160){return vs(Mr.x,Mr.z,c,15,57)}function ip(c){return c.model?.kind==="entrance-checkpoint"&&y?vs(c.x,c.z,Hn?150:110,y.viewAzimuth,59):vs(c.x,c.z,c.category==="temple"?400:300,ka(),57)}function sp(c,g,_,S){let E=c.getBoundingClientRect(),A=g.getBoundingClientRect(),U=E.width/c.offsetWidth||1;c.style.setProperty(_,((A.left-E.left)/U-c.clientLeft).toFixed(2)+"px"),c.style.setProperty(S,(A.width/U).toFixed(2)+"px")}function $l(){let c=Gt(".viewbar"),g=c.querySelector("button.active");if(!g){c.style.setProperty("--ind-o",0);return}sp(c,g,"--ind-x","--ind-w"),c.style.setProperty("--ind-o",1)}function mu(){Zi("[data-view]").forEach(c=>c.classList.remove("active")),$l()}let gu=()=>vs(-1390,50,Hn?1550:1370,38,53);function xu(c){Cs=null,cr({town:gu,all:()=>vs(-150,200,7800,110,51),top:()=>vs(se.target.x,se.target.z,Math.max(900,It.position.distanceTo(se.target)),0,1),baisui:()=>{let _=t.buildings.find(S=>S.osmId===541482372);return vs(..._.center,260,60,63)},juzhilin:()=>pu(),tiantai:()=>vs(773,1635,520,130,64)}[c]()),Zi("[data-view]").forEach(_=>_.classList.toggle("active",_.dataset.view===c)),$l()}Zi("[data-view]").forEach(c=>c.onclick=()=>xu(c.dataset.view)),se.addEventListener("gesturestart",()=>{let c=!!ki.destination?.onDone;ki.cancel(),mu(),c&&!Gt("#card").classList.contains("show")&&(Ha++,Zl(),Cs=null),Ki()}),cr(gu(),0),Gt("#north").onclick=()=>cr(vs(se.target.x,se.target.z,It.position.distanceTo(se.target),0,se.getPolarAngle()*180/Math.PI)),Gt("#zoom-in").onclick=()=>cr(vs(se.target.x,se.target.z,Math.max(40,It.position.distanceTo(se.target)*.65),ka(),se.getPolarAngle()*180/Math.PI),450),Gt("#zoom-out").onclick=()=>cr(vs(se.target.x,se.target.z,Math.min(12e3,It.position.distanceTo(se.target)*1.5),ka(),se.getPolarAngle()*180/Math.PI),450);function yu(c){let g=Ae("div","links");for(let _ of c.sources||[]){if(!/^https:\/\//.test(_.url))continue;let S=Ae("a","",_.name);S.href=_.url,S.target="_blank",S.rel="noopener",g.append(S)}return g}function Zl(){ji?.el&&ji.el.classList.remove("selected"),ji=null;for(let c of Zi(".place-item.selected"))c.classList.remove("selected")}let Ha=0,_u=c=>!!c?.isConnected&&!c.disabled&&!c.closest("[inert]")&&c.getClientRects().length>0&&getComputedStyle(c).visibility!=="hidden",Wo=()=>{let c=document.activeElement;return!c||c===document.body||!_u(c)};function Jl(c){if(!c)return;let g=()=>{_u(c)&&document.activeElement!==c&&c.focus({preventScroll:!0})};g(),document.activeElement!==c&&requestAnimationFrame(g)}function Va(...c){for(let g of c)if(_u(g))return g.focus({preventScroll:!0}),!0;return!1}let Ga=null,jl=null,vu=null;function rp(){let c=Gt("#card"),g=document.activeElement;c.classList.contains("show")||c.contains(g)||(Ga=g&&g!==document.body?g:null,jl=g?.matches?.(".place-item")?g.dataset.name:null)}function Xo(c=!0){let g=Gt("#card"),_=g.classList.contains("show"),S=g.contains(document.activeElement);if(Ha++,ki.cancel(),Zl(),Fo(g),Ki(),c?Ex():Cs=null,_&&(S||Wo())){let E=jl&&[...Zi("#place-list .place-item")].find(A=>A.dataset.name===jl);Va(Ga,E,!Hn&&!Gt("#panel").classList.contains("closed")?Gt('.panel-tabs [aria-selected="true"]'):null,Gt("#panel-open"))}Ga=jl=null}function Wa(c){let g=Gt("#settings"),_=!c&&g.querySelector(".settings-wrap").contains(document.activeElement);g.classList.toggle("collapsed",!c),Gt("#settings-toggle").setAttribute("aria-expanded",c),Go&&Ki(),_&&Jl(Gt("#settings-toggle"))}function Mu(){let c=Gt("#data-dialog");c.open&&(c.classList.add("closing"),setTimeout(()=>{c.classList.remove("closing"),c.close(),Ki()},190))}function Xa(c){Hn&&(c!=="directory"&&(Gt("#panel").classList.add("closed"),Gt("#search").blur(),Ki()),c!=="detail"&&Xo(!1),c!=="settings"&&Wa(!1),c!=="data"&&Mu())}let wx='<svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg>';function op(c,g,{cat:_="",sub:S="",hero:E=null,featured:A=!1}={}){Xa("detail");let U=Gt("#card"),W=U.classList.contains("show");U.replaceChildren(),U.classList.toggle("featured",A);let H=Ae("div","card-head"),D=Ae("div","card-content"+(W?" swap":"")),j=Ae("button","close icon-btn");j.innerHTML=wx,j.setAttribute("aria-label","\u5173\u95ED\u5730\u70B9\u8BE6\u60C5"),j.onclick=()=>Xo();let Y=Ae("h2","",c);Y.tabIndex=-1,H.append(Ae("span","tag"+(_?" c-"+_:""),g),Y),S&&H.append(Ae("p","sub",S)),D.tabIndex=0,D.setAttribute("role","region"),D.setAttribute("aria-label","\u5730\u70B9\u8BE6\u7EC6\u5185\u5BB9");let k=document.activeElement,Z=k===Ga||U.contains(k),J=Ae("div","sheet-grip");return J.setAttribute("aria-hidden","true"),E&&U.append(E),U.append(j,H,D,J),W||Ua(U),Ki(),requestAnimationFrame(Ki),(Z||Wo())&&Jl(Y),D}let{open:ap,close:Tx}=Vg({reducedMotion:Nl,onToggle:()=>Ki(),focusLost:Wo,restoreFocus:Va,fallbackFocus:()=>Gt("#card .card-head h2")}),lp={temple:"\u5BFA\u9662",sight:"\u666F\u70B9",nature:"\u5C71\u6C34\u666F\u89C2",village:"\u6751\u843D\u5730\u540D",service:"\u516C\u5171\u670D\u52A1",transport:"\u4EA4\u901A",hotel:"\u4F4F\u5BBF",food:"\u9910\u996E",shop:"\u8D2D\u7269"},Ax="17356648281",cp="173 5664 8281";function hp(c){let g=Ae("details","more");return g.append(Ae("summary","",c)),g}function Rx(c,g,_){let S=Ae("button","btn "+c);return S.type="button",S.innerHTML=g,S.append(_),S}let Cx='<svg viewBox="0 0 24 24"><circle cx="6" cy="18" r="2.2"/><circle cx="18" cy="6" r="2.2"/><path d="M8.2 18H15a3 3 0 0 0 0-6H9a3 3 0 0 1 0-6h6.8"/></svg>',Px='<svg viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6"/><path d="M20 4v4h-4"/></svg>',Lx='<svg viewBox="0 0 24 24"><path d="M6.5 3.5h3l1.5 4-2 1.3a11 11 0 0 0 6.2 6.2l1.3-2 4 1.5v3a2 2 0 0 1-2 2A16.5 16.5 0 0 1 4.5 5.5a2 2 0 0 1 2-2z"/></svg>';function up(c){let g=t.routes?.find(H=>H.id==="juzhilin-halfday"),_=mi?.canResume?mi.active:null,S=c.querySelector(".route-teaser"),E=_?"resume:"+_.id:g?"start":"";if((S?.dataset.kind||"")===E)return;if(!E){S?.remove();return}let A=Ae("button","route-teaser"),U=Ae("span","");A.type="button",A.dataset.kind=E,A.innerHTML=Cx,_?(U.append(Ae("b","","\u7EE7\u7EED\u8DEF\u7EBF\u9884\u6F14"),Ae("small","",_.short+" \xB7 \u4ECE\u521A\u624D\u6682\u505C\u7684\u4F4D\u7F6E\u7EE7\u7EED")),A.onclick=()=>mi.canResume&&mi.active===_?mi.startPreview():mi.open(_.id)):(U.append(Ae("b","","\u4ECE\u8FD9\u91CC\u51FA\u53D1 \xB7 "+g.short),Ae("small","",`${g.duration} \xB7 \u8089\u8EAB\u5B9D\u6BBF \u2192 \u5316\u57CE\u5BFA \u2192 \u7F06\u8F66\u4E0A\u767E\u5C81\u5BAB \xB7 \u770B\u8DEF\u7EBF`)),A.onclick=()=>mi?.open(g.id)),A.append(U);let W=c.querySelector(".card-summary");if(S){let H=document.activeElement===S;S.replaceWith(A),H&&A.focus({preventScroll:!0})}else W?W.after(A):c.append(A)}function Ix(){let c=Gt("#card");c.classList.contains("show")&&c.classList.contains("featured")&&up(c.querySelector(".card-content"))}function qa(c,g){rp(),Zl(),ji=c,c.el&&c.el.classList.add("selected");let _=++Ha,S=()=>{let U=null;if(c.featured){U=Ae("div","card-hero");let k=[["jzl-1",640],["jzl-2",541],["jzl-5",720],["jzl-6",540],["jzl-3",540],["jzl-4",640]],Z=k.map(([J])=>{let ot=`media/juzhilin/${J}.jpg`;return window.__JIUHUA_MEDIA__?.[ot]||ot});for(let[J,ot]of Z.entries()){let pt=Ae("a");pt.href=ot,pt.target="_blank",pt.rel="noopener",pt.onclick=xt=>{xt.preventDefault(),ap(Z,J,void 0,void 0,pt)};let Ut=Ae("img");Ut.width=960,Ut.height=k[J][1],Ut.src=ot,Ut.alt="\u5C45\u4E4B\u6797\u6C11\u5BBF\u5B9E\u62CD",Ut.loading="lazy",pt.append(Ut),U.append(pt)}}let W=[...c.photos||[],...c.viewing?.photos||[]];if(W.length){U=Ae("div","card-hero");let k=W,Z=k.map(J=>window.__JIUHUA_MEDIA__?.[J.src]||J.src);for(let[J,ot]of k.entries()){let pt=Ae("a");pt.href=Z[J],pt.setAttribute("aria-label",ot.alt+"\uFF0C\u70B9\u5F00\u653E\u5927"),pt.onclick=kt=>{kt.preventDefault(),ap(Z,J,c.n,k,pt)};let Ut=Ae("img"),xt=window.__JIUHUA_MEDIA__,Ht=ot.thumb&&(xt?xt[ot.thumb]:ot.thumb);Ut.src=Ht||Z[J],Ut.width=ot.width,Ut.height=ot.height,Ut.alt=ot.alt,Ut.loading="lazy",pt.append(Ut),ot.takenAt&&pt.append(Ae("span","photo-date",ot.takenAt.slice(0,4)+"\u5E74\u5B9E\u62CD \xB7 \u70B9\u5F00\u653E\u5927")),U.append(pt)}}let H=op(c.displayName||(c.featured?c.shortName:c.n),c.featured?"\u7CBE\u9009\u6C11\u5BBF \xB7 \u5B9E\u62CD\u5EFA\u6A21":lp[c.category]||"\u5730\u70B9",{cat:c.category,hero:U,featured:!!c.featured}),D=Ae("div","chips");(c.address||c.zone)&&D.append(Ae("span","",c.address||c.zone)),c.featured&&D.append(Ae("span","","\u4E1A\u4E3B\u5B9E\u62CD \xB7 \u4E09\u7EF4\u5EFA\u6A21")),D.append(Ae("span","",`\u6D77\u62D4\u7EA6 ${Math.round(f(v(c.x,c.z)))} m`)),c.halls?.length&&D.append(Ae("span","",`\u6BBF\u5802 ${c.halls.length} \u5904`)),c.transit?.length&&D.append(Ae("span","","\u666F\u533A\u4EA4\u901A\u7AD9\u70B9"));let j=Ae("div","card-summary");if(j.append(D),H.append(j),c.featured&&up(H),c.featured&&H.append(Ae("p","lead","\u4E09\u5C42\u9000\u53F0\u7684\u5C71\u5730\u6C11\u5BBF\uFF1A\u5C4B\u9876\u9732\u53F0\u8FDC\u773A\u4E5D\u534E\u8BF8\u5CF0\uFF0C\u4E8C\u5C42\u6728\u5E73\u53F0\u4E0E\u7F57\u6C49\u677E\u5C0F\u9662\uFF0C\u95E8\u524D\u505C\u8F66\u573A\u5E26\u5145\u7535\u6869\uFF0C\u6321\u5899\u4E0A\u65B9\u662F\u6302\u6EE1\u706F\u7B3C\u7684\u5927\u677E\u6811\u3002")),c.highlight){let k=Ae("p","highlight");k.append(Ae("b","","\u770B\u70B9"),c.highlight),H.append(k)}if(c.note&&H.append(Ae("p","lead",c.note)),c.story?.length){let k=Ae("div","story-box");k.append(Ae("h4","",c.story.some(Z=>Z.kind==="\u5730\u8C8C")?"\u5730\u8C8C\u770B\u70B9":"\u6587\u5316\u770B\u70B9"));for(let Z of c.story){let J=Ae("p","story");J.append(Pd(Z.kind),Z.text),k.append(J)}H.append(k)}else c.architecture&&H.append(Ae("p","",c.architecture));if(c.transit?.length){let k=Ae("div","transit");for(let Z of c.transit)k.append(Ae("p","",`${Z.route}${Z.stop&&Z.route!==Z.stop?`\uFF08${Z.stop}\u7AD9\uFF09`:""}\uFF1A${Z.hours}`)),Z.order&&k.append(Ae("small","",Z.order)),Z.phone&&k.append(Ae("small","",`\u54A8\u8BE2 ${Z.phone}`));k.append(Ae("small","",`\u65F6\u95F4\u4EE5\u73B0\u573A\u4E3A\u51C6 \xB7 \u4E5D\u534E\u5C71\u98CE\u666F\u533A\u5B98\u7F51 ${t.transit?.retrieved||""} \u67E5\u8BE2`)),H.append(k)}let Y=hp(c.featured?"\u5EFA\u6A21\u8BF4\u660E":c.photos?.length?"\u8D44\u6599\u4E0E\u7167\u7247\u51FA\u5904":"\u8D44\u6599\u4E0E\u4F9D\u636E");if(c.storySources?.length){let k=yu({sources:c.storySources});k.prepend(Ae("span","","\u6587\u5B57\u51FA\u5904")),Y.append(k)}if(c.halls?.length&&Y.append(Ae("p","",`\u5BFA\u5185\u6BBF\u5802 ${c.halls.length} \u5904\uFF1A${c.halls.slice(0,8).map(k=>k.n).join("\u3001")}${c.halls.length>8?"\u7B49":""}\uFF1B\u9760\u8FD1\u65F6\u663E\u793A\u4E3A\u5C0F\u6807\u6CE8\u3002`)),c.photos?.length){let k=Ae("div","photo-credits");k.append(Ae("h4","",`\u5B9E\u62CD\u7167\u7247 \xB7 ${c.photos.length} \u5F20`));for(let Z of c.photos)k.append(Ae("p","",Z.alt),Ld(Z));Y.append(k)}for(let k of[`\u5B9A\u4F4D\uFF1A${xx(c)}`,c.story?.length&&c.architecture,c.modelNote,c.positionNote,c.viewing?.source,c.aliases?.length&&!c.featured&&"\u5176\u4ED6\u540D\u79F0\uFF1A"+c.aliases.slice(0,4).join("\u3001"),c.category==="village"&&c.addressCount&&`\u7EA6 ${c.addressCount} \u4E2A\u516C\u5F00\u5730\u5740\u542B\u6B64\u5730\u540D\u3002`,c.quality?.startsWith("legacy")&&"\u6B64\u70B9\u6CBF\u7528\u539F\u7248\u5BFC\u89C8\u4F4D\u7F6E\uFF0C\u5C1A\u672A\u83B7\u5F97\u72EC\u7ACB\u5750\u6807\u8BC1\u636E\uFF1B\u865A\u7EBF\u6807\u6CE8\u8868\u793A\u5F85\u6838\u3002"])k&&Y.append(Ae("p","",k));if(Y.append(Ae("p","coords",`${c.lon?.toFixed(6)??""}\xB0E \xB7 ${c.lat?.toFixed(6)??""}\xB0N`),yu(c)),H.append(Y),c.featured){let k=Ae("div","card-actions"),Z=Ae("a","btn accent");Z.href="tel:"+Ax,Z.innerHTML=Lx,Z.append(Ae("span","full","\u81F4\u7535 "+cp),Ae("span","short","\u81F4\u7535\u6C11\u5BBF")),Z.setAttribute("aria-label","\u81F4\u7535\u5C45\u4E4B\u6797\u6C11\u5BBF "+cp),k.append(Z),j.append(k)}};if(Hn&&(Gt("#panel").classList.add("closed"),Ki()),Zi(".place-item").forEach(U=>U.classList.toggle("selected",U.dataset.name===c.n)),!g){mi?.stopPreview(),ki.cancel(),S();return}let E=Gt("#card");E.classList.contains("show")&&Fo(E,440),np(),mu();let A=c.featured?pu():ip(c);Gt("#flight-hint .fh-name").textContent=c.displayName||(c.featured?c.shortName:c.n),cr(A,ep(A),()=>{if(_!==Ha||ji!==c){Ki();return}E.classList.add("arrive"),S(),clearTimeout(E._arrive),E._arrive=setTimeout(()=>E.classList.remove("arrive"),1600)},150)}function Dx(c){rp(),mi?.stopPreview(),ki.cancel(),Ha++,Zl();let g=c.positionQuality==="ml_roofprint",_=op(c.name||c.precinct||c.templeGuess||"\u5BFA\u9662\u5EFA\u7B51","\u5BFA\u9662\u5EFA\u7B51",{cat:"temple",sub:c.precinct?`${c.precinct} \u5BFA\u9662\u8303\u56F4\u5185`:""}),S=Ae("div","chips");S.append(Ae("span","",`\u5360\u5730\u7EA6 ${Math.round(c.area)} m\xB2`),Ae("span","",`${c.levels||"-"} \u5C42`),Ae("span","",`\u5899\u9AD8 ${c.wallHeight.toFixed(1)} m`)),_.append(S);let E=hp("\u5916\u89C2\u4E0E\u6570\u636E\u4F9D\u636E");E.append(Ae("p","",g?"\u5E73\u9762\u8F6E\u5ED3\u6765\u81EA\u5F71\u50CF\u8BC6\u522B\uFF0C\u53EF\u80FD\u5305\u542B\u8BC6\u522B\u8BEF\u5DEE\u3002":"\u5E73\u9762\u5F62\u72B6\u4E0E\u671D\u5411\u6765\u81EA\u5730\u56FE\u8BB0\u5F55\u3002")),c.styleRule&&E.append(Ae("p","",`\u5916\u89C2\u4F9D\u636E\uFF08${{observed:"\u7167\u7247\u89C2\u5BDF",documented:"\u6587\u732E\u8BB0\u8F7D",inferred:"\u63A8\u65AD",secondary:"\u4E8C\u624B\u8D44\u6599"}[c.styleCertainty]||c.styleCertainty||"\u63A8\u65AD"}\uFF09\uFF1A${c.styleRule}\u3002\u9010\u680B\u697C\u5C42\u4E0E\u95E8\u7A97\u672A\u7ECF\u5B9E\u6D4B\u3002`)),E.append(yu({sources:[{name:"\u67E5\u770B\u5EFA\u7B51\u6570\u636E\u6765\u6E90",url:c.source}]})),_.append(E);let A=Ae("div","card-actions"),U=Rx("ghost",Px,"\u73AF\u770B\u8FD9\u680B\u5EFA\u7B51");U.onclick=()=>{np(),cr(vs(...c.center,Math.max(70,c.width*3),ka()+70,66)),mu()},A.append(U),_.append(A)}let fp=new Ih,dp=new de;function Ux(c){if(ki.active||!jt.visible)return;dp.set(c.clientX/innerWidth*2-1,-c.clientY/innerHeight*2+1),fp.setFromCamera(dp,It);let g=fp.intersectObjects(Vn,!0)[0],_=g&&em(g.object,dx,fx);if(_){qa(_,!1);return}let S=g&&t.buildings[g.object.userData.triangleIds?.[g.faceIndex]];S?.style==="temple"?Dx(S):Hn&&Xo()}let pp=c=>Wl==="all"||(gx[Wl]||[Wl]).includes(c.category);function Nx(c,g=Vo){return pp(c)&&Qd.score(c,g)>=0}function Kl(c){let g=Gt("#place-list");g.classList.toggle("animate",!!c),g.replaceChildren();let _=Qd.search(Vo,{accept:E=>pp(E)&&(Wr(Vo)?!0:E.searchable||E===Mr)});Gt("#list-summary").textContent=`${_.length} \u4E2A\u7ED3\u679C \xB7 \u53EF\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u516C\u5171\u8BBE\u65BD\u4E0E\u5546\u5BB6`;let S=_.slice(0,Vo?400:220);S.forEach((E,A)=>{let U=Ae("button","place-item"+(E===Mr?" featured":"")+(E===ji?" selected":""));c&&(U.style.animationDelay=Math.min(A,14)*16+"ms"),U.dataset.name=E.n,U.dataset.placeId=E.placeId,U.type="button",U.append(Ae("span","pi-icon c-"+E.category,E===Mr?"\u5BBF":mx[E.category]||"\xB7"));let W=Ae("span","pi-text");W.append(Ae("strong","",E.displayName||(E===Mr?E.shortName:E.n)),Ae("small",fu(E)?"estimate":"",E===Mr?`\u7CBE\u9009\u6C11\u5BBF \xB7 ${E.address}`:[lp[E.category],E.highlight||(E.viewing?`\u53EF\u8FDC\u773A${E.viewing.name}`:E.zone)].filter(Boolean).join(" \xB7 ")+(fu(E)?" \xB7 \u4F4D\u7F6E\u5F85\u6838":""))),U.append(W),U.onclick=()=>qa(E,!0),g.append(U)}),_.length>S.length&&g.append(Ae("p","empty",`\u53E6\u6709 ${_.length-S.length} \u4E2A\u70B9\u4F4D\u672A\u5217\u51FA\uFF0C\u8BF7\u8F93\u5165\u540D\u79F0\u3001\u95E8\u724C\u6216\u6751\u540D\u7F29\u5C0F\u8303\u56F4\u3002`)),_.length||g.append(Ae("p","empty","\u6CA1\u6709\u5339\u914D\u7684\u5730\u70B9\u3002\u53EF\u4EE5\u641C\u5BFA\u5E99\u3001\u666F\u70B9\u3001\u6751\u540D\u6216\u8F66\u7AD9\u3001\u516C\u5395\u3001\u505C\u8F66\u573A\uFF0C\u4F8B\u5982\u201C\u5316\u57CE\u5BFA\u201D\u201C\u51E4\u51F0\u677E\u201D\u201C\u8F66\u7AD9\u201D\u3002"))}let Ox=Jp(Gt("#search"),c=>{Vo=c,at=!0,Kl()}),Fx=()=>Ox.flush();Zi("[data-category]").forEach(c=>c.onclick=()=>{Fx(),Wl=c.dataset.category,Zi("[data-category]").forEach(g=>g.classList.toggle("active",g===c)),Kl(!0)}),Kl();function mp(){sp(Gt(".panel-tabs"),Gt(".panel-tabs .active"),"--tab-x","--tab-w")}function Ql(c){let g=Gt(".panel-tabs .active")?.dataset.tab;Zi(".panel-tabs [data-tab]").forEach(_=>{let S=_.dataset.tab===c;_.classList.toggle("active",S),_.setAttribute("aria-selected",S),_.tabIndex=S?0:-1}),Gt("#tab-routes").hidden=c!=="routes",Gt("#tab-places").hidden=c!=="places",Gt("#tab-guide").hidden=c!=="guide",c==="places"&&g!=="places"&&Kl(!0),mp()}function tc(c){let g=Gt("#panel"),_=document.activeElement;g.classList.contains("closed")&&!g.contains(_)&&(vu=_!==document.body?_:null),mi?.stopPreview(),!Hn&&(Gt("#card").classList.contains("show")||ki.destination?.onDone)&&Xo(!1),ki.cancel(),c&&Ql(c),Xa("directory"),g.classList.remove("closed"),Ya(),requestAnimationFrame(mp);let S=Gt(".tab-pane:not([hidden])");Jl(S?.id==="tab-places"?Gt("#search"):S?.id==="tab-routes"&&!Gt("#route-detail").hidden?Gt("#route-detail"):Gt('.panel-tabs [aria-selected="true"]'))}Zi(".panel-tabs [data-tab]").forEach(c=>c.onclick=()=>Ql(c.dataset.tab)),Ql("routes"),Ng(t,Gt("#guide")),Gt(".panel-tabs").addEventListener("keydown",c=>{let g=Zi(".panel-tabs [data-tab]"),_=g.indexOf(document.activeElement),S={ArrowLeft:_-1,ArrowRight:_+1,Home:0,End:g.length-1}[c.key];if(_<0||S===void 0)return;c.preventDefault();let E=g[(S+g.length)%g.length];Ql(E.dataset.tab),E.focus()});function gp(){let c=Gt("#panel"),g=c.contains(document.activeElement);return c.classList.add("closed"),Gt("#search").blur(),Ya(),g}function bu(c){(c||Wo())&&Va(vu,Gt("#panel-open"),Gt("#route-hud .rh-list")),vu=null}Gt("#panel-close").onclick=()=>{let c=mi?.active&&!mi.canResume&&!Gt("#tab-routes").hidden,g=gp();c&&(mi.close(),xu("town")),bu(g)},Gt("#panel-open").onclick=()=>tc("places"),Gt("#routes-open").onclick=()=>tc("routes"),Gt("#guide-open").onclick=()=>tc("guide"),Hn&&Gt("#panel").classList.add("closed"),Gt("#settings-toggle").onclick=()=>{let c=Gt("#settings").classList.contains("collapsed");c&&Xa("settings"),Wa(c)},Wa(!1),Gt("#featured-cta").onclick=()=>qa(Mr,!0);function Bx(){let c=innerWidth,g=innerHeight,_=Gt("#panel"),S=Gt("#card"),E=!_.classList.contains("closed"),A=Gt("#route-hud"),U=Gt(".rail"),W=U.querySelector(".map-actions"),H=document.body.classList.contains("map-chrome-hidden")?0:Gt(".viewbar").getBoundingClientRect().bottom,D=g,j=0,Y=c,k=!!W?.offsetWidth&&getComputedStyle(W).visibility!=="hidden";if(Hn)E?_.offsetWidth>c*.6?D=_.offsetTop:Y=_.offsetLeft:c>g&&k&&(Y=U.offsetLeft-8);else{j=xp(S.classList.contains("show")?S:E?_:null),k&&(Y=U.offsetLeft-12);let Z=Gt(".map-meta");Z.offsetHeight&&(D=Math.min(g,Z.offsetTop-8))}return!A.hidden&&A.offsetParent&&(H=Math.max(H,A.getBoundingClientRect().bottom)),{left:j,top:H,right:Y,bottom:D,shiftX:Br.x,shiftY:Br.y}}let zx=".brand,.viewbar,.rail>*,.dock,.map-meta>*,#route-hud,#flight-hint,.settings-wrap";function kx(){let c=[];for(let g of Zi(zx)){if(!g.offsetWidth||g.closest(".is-hidden")||getComputedStyle(g).visibility==="hidden")continue;let _=g.getBoundingClientRect();c.push([_.left,_.top,_.right,_.bottom])}return c}mi=Dg({routes:t.routes||[],scene:Xt,world:Lt,camera:It,controls:se,hAt:v,realH:f,fly:cr,pose:vs,openPanel:tc,isMobile:()=>Hn,visibleRect:Bx,covers:kx,onFrame:c=>tp.push(c),cancelFlight:()=>{ki.destination?.onDone||ki.cancel()},onPlaybackChange:()=>{Go&&Ki(),Ix()},closeSheetsForRoute:()=>{let c=document.activeElement,g=Hn&&!Gt("#panel").classList.contains("closed")&&Gt("#panel").contains(c)||Gt("#card").classList.contains("show")&&Gt("#card").contains(c);Xo(!1),Hn&&Gt("#panel").classList.add("closed"),Ya(),g&&Jl(Gt("#route-hud .rh-play"))}}),Gt("#route-hud .rh-close").onclick=()=>{let c=Gt("#route-hud").contains(document.activeElement),g=Gt("#card").classList.contains("show"),_=!!ki.destination?.onDone;mi.close(),g||_?Cs={...gu(),view:"town"}:xu("town"),(c||Wo())&&Va(g?Gt("#card .card-head h2"):null,_?Ga:null,!Hn&&!Gt("#panel").classList.contains("closed")?Gt("#route-list .route-card"):null,Gt("#routes-open"),Gt("#panel-open"))},Hg({compact:Id,closePanel:()=>bu(gp())}),addEventListener("sheetchange",()=>Ki()),Gt("#layer-buildings").onchange=c=>jt.visible=c.target.checked,Gt("#layer-trees").onchange=c=>{Zd=c.target.checked,Jd()},Gt("#layer-trails").onchange=c=>we.visible=c.target.checked,Gt("#height").oninput=c=>{let g=Lt.scale.y;h=+c.target.value;let _=h/l;c.target.style.setProperty("--fill",(h-1)/.8*100+"%"),Lt.scale.y=_,Gt("#height-value").textContent=h===1?"\u771F\u5B9E\u6BD4\u4F8B \xD71.0":`\u5730\u5F62\u589E\u5F3A \xD7${h.toFixed(1)}`;let S=v(se.target.x,se.target.z)*(_-g);if(se.target.y+=S,It.position.y+=S,Cs){let E=v(Cs.target.x,Cs.target.z)*(_-g);Cs.target.y+=E,Cs.pos.y+=E}for(let E of lr)E.label&&(E.label.position.y=(E.top+5)*_);for(let E of Yl)E.label.position.y=(E.top+4)*_},Gt("#data-content").innerHTML=Gg({W:e,D:n,stats:t.stats,transit:t.transit,places:lr});let Su=null;Gt("#credit-data").onclick=Gt("#credit-mobile").onclick=c=>{Su=c.currentTarget,Xa("data"),Gt("#data-dialog").showModal(),Ki()},Gt("#data-close").onclick=Mu,Gt("#data-dialog").onclick=c=>{c.target===Gt("#data-dialog")&&Mu()},Gt("#data-dialog").addEventListener("close",()=>{Go&&(Ki(),Wo()&&Va(Su,Gt("#credit-mobile"),Gt("#credit-data")),Su=null)}),Gt("#capture").onclick=()=>{let c=Yg({frame:p.domElement,stats:t.stats,render:_=>(It.updateMatrixWorld(),vp(_),Qt(),p.render(Xt,It),mi?.updateLabels(performance.now()),Mp(),at=!0,[...nt.domElement.children])}),g=document.createElement("a");g.download="\u4E5D\u534E\u5C71\u4E09\u7EF4\u5730\u56FE-\u5B9E\u666F\u589E\u5F3A\u7248.png",g.href=c.toDataURL("image/png"),g.click(),jh("\u5F53\u524D\u4E09\u7EF4\u753B\u9762\u5DF2\u5BFC\u51FA")};let Hx=43,Fr={x:0,y:0},Br={x:0,y:0};function Eu(){let c=innerWidth,g=innerHeight,{x:_,y:S}=Fr,E=c+2*Math.abs(_),A=g+2*Math.abs(S);It.aspect=E/A,It.fov=Math.atan(Math.tan(Hx*Math.PI/360)*A/g)*360/Math.PI,E>c+1||A>g+1?It.setViewOffset(E,A,_>0?2*_:0,S>0?2*S:0,c,g):It.clearViewOffset(),It.updateProjectionMatrix()}function xp(c){return c&&c.offsetWidth?c.offsetLeft+c.offsetWidth+12:0}function Ki(){let c=innerWidth,g=innerHeight,_=Gt("#card"),S=Gt("#panel"),E=document.body,A=!S.classList.contains("closed"),U=_.classList.contains("show"),W=!Gt("#settings").classList.contains("collapsed"),H=!!ki.destination?.onDone,D=0,j=0,Y=Gt("#viewer").classList.contains("show"),k=A||U||H||!!mi?.active||Gt("#data-dialog").open||Y,Z=Hn?k||W:!!mi?.active;E.classList.toggle("panel-open",A),E.classList.toggle("card-open",U),E.classList.toggle("settings-open",W),E.classList.toggle("card-flight",H),E.classList.contains("map-chrome-hidden")!==Z&&(E.classList.toggle("map-chrome-hidden",Z),Z&&$g.stop());for(let pt of Zi(".map-chrome")){let Ut=Hn?pt.id==="settings"?k:Z:Z&&pt.matches(".viewbar");if(pt.inert!==(Ut||Y)&&(pt.inert=Ut||Y),pt.classList.contains("is-hidden")!==Ut){pt.classList.toggle("is-hidden",Ut),pt.setAttribute("aria-hidden",String(Ut)),pt.matches("button")&&(pt.disabled=Ut);for(let xt of pt.querySelectorAll("button"))xt.disabled=Ut}}for(let pt of Gt("#app").children){if(pt.id==="viewer"||pt.matches(".map-chrome,dialog"))continue;let Ut=Y||pt.id==="panel"&&!Hn&&U;pt.inert!==Ut&&(pt.inert=Ut)}let J=Gt("#flight-hint"),ot=!Nl&&H&&!!J.querySelector(".fh-name").textContent;if(ot&&!J.classList.contains("show")?Ua(J):!ot&&J.classList.contains("show")&&Fo(J,240),!Hn)D=-xp(U?_:A||H?S:null)/2;else{let pt=U?_:A?S:null;if(pt&&pt.offsetWidth>c*.6){let Ut=Gt(".viewbar"),xt=Z?pt===_?8:0:Ut.offsetTop+Ut.offsetHeight;j=Math.max(0,g/2-(xt+pt.offsetTop)/2)}else pt&&(D=Math.max(0,(c-pt.offsetLeft)/2))}Br={x:D,y:j},Go||(Fr={x:D,y:j},Eu())}function Ya(){at=!0,uo(),T.setCeiling(x()),z(M);let c=innerWidth,g=innerHeight,_=Id(),S=_!==Hn;S&&(Hn=_,_&&(Gt("#panel").classList.add("closed"),Wa(!1)),p.shadowMap.enabled=Le.castShadow=I()),p.setSize(c,g),nt.setSize(c,g);let E=!Hn&&!Gt("#panel").classList.contains("closed");document.body.classList.toggle("with-panel",E),Ki(),Eu(),$l(),S&&ji&&Gt("#card").classList.contains("show")&&!ki.active&&cr(ji.featured?pu():ip(ji),700)}function qo(){let c=window.visualViewport,g=c?c.height:innerHeight,_=document.activeElement===Gt("#search"),S=Hn&&_&&c?Math.max(0,innerHeight-c.height-c.offsetTop):0;document.documentElement.style.setProperty("--visible-height",`${Math.round(g)}px`),document.documentElement.style.setProperty("--keyboard-inset",S>120?`${Math.round(S)}px`:"0px"),document.body.classList.toggle("keyboard-open",S>120)}window.visualViewport?.addEventListener("resize",qo),window.visualViewport?.addEventListener("scroll",qo),addEventListener("focusin",qo),addEventListener("focusout",()=>requestAnimationFrame(qo)),addEventListener("resize",qo),qo(),addEventListener("keydown",c=>{let g=Gt("#viewer");if(!g.hidden){c.key==="Escape"?Tx():(c.key==="ArrowLeft"||c.key==="ArrowRight")&&g._go(c.key==="ArrowLeft"?-1:1);return}if(c.key==="Escape"&&!Gt("#data-dialog").open){let _=Gt("#panel"),S=Hn&&!_.classList.contains("closed"),E=_.contains(document.activeElement);Xo(),Xa("detail"),Hn||Wa(!1),S&&bu(E)}}),addEventListener("resize",Ya),Ya();let $a=new X;function yp(c,g=4,_=0){let S=It.position,E=c.label.position,A=_?1-_/Math.max(_*1.2,S.distanceTo(E)):1;for(let U=2;U<24&&U/24<A;U++){let W=U/24,H=S.x+(E.x-S.x)*W,D=S.z+(E.z-S.z)*W;if(!(Math.abs(H)>e/2||Math.abs(D)>n/2)&&v(H,D)*Lt.scale.y>S.y+(E.y-S.y)*W+g)return!0}return!1}let _p=".brand,.viewbar,.rail>*,.dock,.map-meta,#route-hud,#flight-hint,#panel,#card,.settings-wrap";function Vx(c){let g=0,_=0;for(let S=c;S;S=S.offsetParent)g+=S.offsetLeft,_+=S.offsetTop;return[g,_,g+c.offsetWidth,_+c.offsetHeight]}function Gx(){let c=innerWidth,g=innerHeight,_=!Gt("#settings").classList.contains("collapsed");et=!1,ft=[],Rt++;for(let S of Zi(_p)){if(!S.offsetWidth||S.closest(".is-hidden")||S.id==="panel"&&S.classList.contains("closed")||(S.id==="card"||S.id==="flight-hint")&&!S.classList.contains("show")||S.matches(".settings-wrap")&&!_||getComputedStyle(S).visibility==="hidden")continue;let E=Vx(S);S.matches(".sheet")?(Hn?S.offsetWidth>c*.6?(E[0]=0,E[2]=c):(E[1]=0,E[2]=c):E[0]=E[1]=0,E[3]=g):(E[0]<16&&(E[0]=0),c-E[2]<16&&(E[2]=c),E[1]<16&&(E[1]=0),g-E[3]<16&&(E[3]=g)),(S.matches(".sheet")||Hn&&S.matches(".settings-wrap"))&&E.push(1),ft.push(E)}}function uo(){et=!0,uo.t||(at=!0),clearTimeout(uo.t),uo.t=setTimeout(()=>{uo.t=0,et=at=!0},520)}{let c=new MutationObserver(uo),g=window.ResizeObserver&&new ResizeObserver(uo);c.observe(document.body,{attributes:!0,attributeFilter:["class"]});for(let _ of Zi(_p))c.observe(_,{attributes:!0,attributeFilter:["class","hidden"]}),g?.observe(_)}function Wx(c,g){let _=c.pos;if(_&&_.ox===g.ox&&_.oy===g.oy&&_.len===g.len&&_.ang===g.ang)return;c.pos=g;let S=c.el.style;S.setProperty("--dx",g.ox+"px"),S.setProperty("--dy",g.oy+"px"),S.setProperty("--len",g.len+"px"),S.setProperty("--ang",g.ang+"deg")}let Xx=c=>({ox:0,oy:-c.stem,len:c.stem,ang:-90});function vp(c,g=!1){ce++;let _=!1;w.length=0;let S=Gt("#layer-labels").checked,E=[],A=innerWidth,U=innerHeight,W=It.position,H=Kd??(Hn?28:60);S&&!c&&et&&Gx();let D=c||(S?ft:[]),j=D.filter(N=>N[4]),Y=D.filter(N=>!N[4]),k=!Gt("#panel").classList.contains("closed")&&!Gt("#tab-places").hidden,Z=document.body.classList.contains("route-on");for(let N of Sx){let rt=N.label.position,mt=Math.hypot(rt.x-W.x,rt.y-W.y,rt.z-W.z),st=N===ji?2:N.tier||0,ht=S&&(!Z||N===ji)&&(mt<N.limit||N===ji||N.hall&&N.parent===ji&&mt<900)&&(N.road||N.hall||N.featured||N===ji||!k||Nx(N,Vo)),ut=0,it=0;if(ht){$a.copy(rt).project(It),ut=($a.x+1)*A/2,it=(1-$a.y)*U/2;let Et=N.labelWidth/2,Re=it-N.labelHeight;if($a.z>1||$a.z<0||(st?ut<4||ut>A-4||it<4||it>U-8:ut<Et+4||ut>A-Et-4||Re<4||it>U-18))ht=!1;else if(st){for(let Dt of st>1?j:D)if(ut>Dt[0]&&ut<Dt[2]&&it>Dt[1]&&it<Dt[3]){ht=!1;break}}else for(let Dt of D)if(ut-Et<Dt[2]&&ut+Et>Dt[0]&&Re<Dt[3]&&it+4>Dt[1]){ht=!1;break}}if(ht&&!N.road&&!N.featured){let Et=st?yp(N,N.occ?0:10,150):yp(N);Et!==N.occ?(N.occN=(N.occN||0)+1,N.occ===void 0||N.occN>=2?(N.occ=Et,N.occN=0):_=!0):N.occN=0,N.occ&&(ht=!1)}E.push({p:N,dist:mt,x:ut,y:it,v:ht,tier:st})}E.sort((N,rt)=>!!rt.p.featured-!!N.p.featured||(rt.p===ji)-(N.p===ji)||rt.tier-N.tier||N.p.p-rt.p.p||N.dist-rt.dist),Xl=0;let J=(N,rt)=>Math.max(0,Math.min(N[2],rt[2])-Math.max(N[0],rt[0]))*Math.max(0,Math.min(N[3],rt[3])-Math.max(N[1],rt[1])),ot=(N,rt,mt)=>N>mt[0]&&N<mt[2]&&rt>mt[1]&&rt<mt[3],pt=(N,rt,mt,st,ht)=>{let ut=0,it=1,Et=mt-N,Re=st-rt;for(let[Dt,oe]of[[-Et,N-ht[0]],[Et,ht[2]-N],[-Re,rt-ht[1]],[Re,ht[3]-rt]])if(Dt){let le=oe/Dt;if(Dt<0){if(le>it)return!1;le>ut&&(ut=le)}else{if(le<ut)return!1;le<it&&(it=le)}}else if(oe<0)return!1;return it-ut>.02},Ut=(N,rt)=>{let mt=(st,ht,ut)=>(ht[0]-st[0])*(ut[1]-st[1])-(ht[1]-st[1])*(ut[0]-st[0]);return mt(N[0],N[1],rt[0])*mt(N[0],N[1],rt[1])<0&&mt(rt[0],rt[1],N[0])*mt(rt[0],rt[1],N[1])<0},xt=[],Ht=[],kt=E.filter(N=>N.v&&N.tier).map(N=>[N.x,N.y,N.p]),Mt=0;for(let N of E){let rt=null;if(N.v){let mt=N.p,st=mt.labelWidth/2,ht=mt.labelHeight-mt.stem,ut=[N.x,N.y],it=(Et,Re)=>{let Dt=[N.x+Et-st,N.y+Re-ht,N.x+Et+st,N.y+Re],oe=Xn(N.x,Dt[0],Dt[2]),le=Xn(N.y,Dt[1],Dt[3]),ie=Math.hypot(oe-N.x,le-N.y);return{ox:Math.round(Et*2)/2,oy:Math.round(Re*2)/2,len:ie<3?0:Math.round(ie*2)/2,ang:Math.round(Math.atan2(le-N.y,oe-N.x)*180/Math.PI),r:Dt,t:[oe,le]}};if(N.tier){let Et=[it(0,-mt.stem)],Re=mt.pos;Re&&Et.push(it(Re.ox,Re.oy));let Dt=St=>{let Ot=Math.max(0,2-St.r[0])+Math.min(0,A-2-St.r[2]),Q=Math.max(0,2-St.r[1])+Math.min(0,U-2-St.r[3]);return Ot||Q?it(St.ox+Ot,St.oy+Q):null},oe=Y.some(St=>ot(N.x,N.y,St)),le=oe?280:190,ie=mt.featured?7:4;for(let St of oe?[10,26,48,76,110,150,200,250]:[10,26,48,76,110,150])for(let Ot=0;Ot<12;Ot++){let Q=(Ot*30-90)*Math.PI/180,Nt=Math.cos(Q),xe=Math.sin(Q),Wt=Math.min(Math.abs(Nt)>.001?st/Math.abs(Nt):1e9,Math.abs(xe)>.001?ht/2/Math.abs(xe):1e9),Ce=it(Nt*(St+Wt),xe*(St+Wt)+ht/2);Et.push(Ce);let ln=Dt(Ce);ln&&Et.push(ln)}for(let St of Y)if(!(Math.max(St[0]-N.x,N.x-St[2],St[1]-N.y,N.y-St[3])>40))for(let Q of[it(0,St[3]+4+ht-N.y),it(0,St[1]-4-N.y),it(St[0]-4-st-N.x,ht/2),it(St[2]+4+st-N.x,ht/2)]){Et.push(Q);let Nt=Dt(Q);Nt&&Et.push(Nt)}let ee=null,ge=1/0,q=null,bt=1/0;for(let St of Et){let Ot=St.r;if(Ot[0]<1||Ot[2]>A-1||Ot[1]<1||Ot[3]>U-1||St.len>le)continue;let Q=.8*Math.max(0,St.len-mt.stem);if(Re){let Ce=Math.hypot(St.ox-Re.ox,St.oy-Re.oy);Q+=g?1.2*Ce+4*Math.max(0,Ce-70):Ce<2?-2:0}if(Q>=ge)continue;let Nt=[Ot[0]-2,Ot[1]-2,Ot[2]+2,Ot[3]+2],xe=0;for(let Ce of D)xe+=4*J(Ot,Ce);for(let Ce of xt)xe+=4*J(Nt,Ce);for(let[Ce,ln,nn]of kt)(nn!==mt?ot(Ce,ln,[Nt[0]-3,Nt[1]-3,Nt[2]+3,Nt[3]+3]):St!==Et[0]&&ot(Ce,ln,[Nt[0]-ie,Nt[1]-ie,Nt[2]+ie,Nt[3]+ie]))&&(xe+=nn===mt?3e3:1500);for(let[Ce,ln]of Ht)pt(Ce[0],Ce[1],ln[0],ln[1],[Ot[0]+3,Ot[1]+3,Ot[2]-3,Ot[3]-3])&&(xe+=1200);if(N.tier<2&&xe||xe+Q>=ge)continue;if(St.len){let[Ce,ln]=St.t;for(let nn of xt)pt(N.x,N.y,Ce,ln,[nn[0]+3,nn[1]+3,nn[2]-3,nn[3]-3])&&(Q+=1200);for(let nn of Ht)Ut([ut,St.t],nn)&&(Q+=600);for(let nn of Y)!ot(N.x,N.y,nn)&&pt(N.x,N.y,Ce,ln,[nn[0]-4,nn[1]-4,nn[2]+4,nn[3]+4])&&(Q+=900)}let Wt=xe+Q;if(Wt<ge&&(ge=Wt,ee=St),!xe&&Wt<bt&&(bt=Wt,q=St),Wt<=0)break}rt=N.tier>1?ee||Et[0]:q,rt?(xt.push([rt.r[0]-2,rt.r[1]-2,rt.r[2]+2,rt.r[3]+2]),rt.len&&Ht.push([ut,rt.t]),Xl++):N.v=!1}else{let Et=[N.x-st-2,N.y-mt.labelHeight-2,N.x+st+2,N.y+4];Mt>=H||xt.some(Re=>J(Et,Re))||kt.some(([Re,Dt])=>ot(Re,Dt,Et))||Ht.some(([Re,Dt])=>pt(Re[0],Re[1],Dt[0],Dt[1],Et))?N.v=!1:(xt.push(Et),Mt++,Xl++)}}Wx(N.p,rt||Xx(N.p)),N.v?(N.p.label.parent||Xt.add(N.p.label),N.p.label.visible=!0,w.push(N.p.label)):N.p.label.parent&&Xt.remove(N.p.label)}return _}function Mp(){R.children=w.filter(c=>c.parent).concat(mi?.labelObjects||[]),nt.render(R,It);for(let c of mi?.labelObjects||[])c.element.classList.contains("named")&&(c.element.style.zIndex=1e3+(+c.element.style.zIndex||0));wt++}let Za=0,bp=0,wu=0,ec=!1,zr=0,fo=0,Ja=0,Ps=[],ja=16.7,po=0,Tu=0,Au=!0,Ru=!0,Sp=0,Ep=0,wp=0,Tp=new Nn,Ap=new Nn,Rp=new X,Cp=new xs;for(let c of["pointerdown","pointermove","wheel","keydown","input","change","click"])addEventListener(c,()=>{wu=performance.now(),["keydown","input","change","click"].includes(c)&&(at=!0)},{capture:!0,passive:!0});function nc(c){fo=c,zr=performance.now()+3e3,Ps=[]}function ic(c,g){c=Math.max(0,Math.min(Dd,c));let _=fi,S=_r;fi=c,_r=g==="emergency",(c!==_||_r!==S)&&jd()}function Pp(c,g){if(c.action==="resolution-down"||c.action==="resolution-up")return z(!1,g),!0;if(c.action==="tier-down"){if(Au=!1,fi>0)ic(fo===2&&fi>Ja?Ja:fi-1,"slow");else if(!_r)ic(0,"emergency");else return!1;return Kh.set("autoTier",fi),!0}return!1}function qx(c,g){if(!(g-C<500)){if(zr){if(g<zr-2200||(Ps.push(Math.min(c,250)),g<zr||Ps.length<12))return;let _=T.observe(Ps,g);if(ja=_.mean,po=0,Pp(_,g)){nc(fo===2&&fi>Ja?2:1);return}if(zr=0,Ps=[],Tu=g+3e3,fo===1&&Au&&_.fast&&T.limit===T.ceiling&&fi<Dd&&!_r){Au=!1,Ja=fi,ic(fi+1,"probe"),nc(2);return}fo===2&&_.mean>22&&ic(Ja,"probe-revert"),fo=0,Kh.set("autoTier",fi);return}if(ja=po?ja+(Math.min(c,250)-ja)*.05:Math.min(c,250),po++,Ps.push(Math.min(c,250)),Ps.length>240&&Ps.shift(),g>Tu&&po>45){let _=T.observe(Ps,g);Pp(_,g),po=0,Ps=[],Tu=g+3e3}}}document.addEventListener("visibilitychange",()=>{Za=0,ec=!1,Ps=[],po=0,at=!0,!document.hidden&&zr&&nc(fo)});function Lp(c){if(requestAnimationFrame(Lp),document.hidden){Za=0;return}let g=Za?c-Za:16.7;Za=c;for(let j of tp)j(c,g);ki.update(c),se.target.x=Xn(se.target.x,-e/2,e/2),se.target.z=Xn(se.target.z,-n/2,n/2);let _=se.update();Math.abs(It.position.x)<e/2&&Math.abs(It.position.z)<n/2&&!ls(It.position.x,It.position.z)&&(It.position.y=Math.max(It.position.y,v(It.position.x,It.position.z)*Lt.scale.y+8));let S=Fr.x!==Br.x||Fr.y!==Br.y;if(S){let j=Nl?1:1-Math.pow(.86,g/16.7);for(let Y of["x","y"])Fr[Y]+=(Br[Y]-Fr[Y])*j,Math.abs(Fr[Y]-Br[Y])<.4&&(Fr[Y]=Br[Y]);Eu()}let E=ks&&!zr&&!ki.active&&!_&&!S&&!mi?.previewing&&c-wu>1500;if(E&&!at&&c-bp<(c-wu>8e3?98:48)){ec=!1;return}ec&&!E?qx(g,c):zr||(Ps=[],po=0),ec=!0,bp=c,z(E,c),wp++;for(let j of cu){let Y=Nl?j.phase:j.kind==="funicular"?(Math.sin(c/16e3)*.5+.5)*.96+.02:(c/14e4+j.phase)%1,k=j.curve.getPoint(Y);j.g.position.copy(k),j.kind==="cable"&&(j.g.position.y-=5.5);let Z=j.curve.getTangent(Y);j.g.rotation.y=Math.atan2(-Z.z,Z.x)}let A=It.position.distanceTo(se.target),U=Nr[fi];for(let j of an)j.visible=A<U.landmarkDist;for(let j of hu)j.update(A);for(let j of za)j.trunk&&(j.trunk.visible=A<U.trunkDist);for(let j of Si)j.visible=A<U.detailDist;if(ao){let j=It.position.distanceTo(ao.position),Y=Xn(j/160,1,26);ao.scale.setScalar(Y),ao.rotation.y=c/1400;let k=Mr;k?.label&&(k.label.position.y=(ao.userData.base+ao.userData.head*Y)*Lt.scale.y+2*Y)}It.updateMatrixWorld();let W=!Tp.equals(It.matrixWorld)||!Ap.equals(It.projectionMatrix);W&&(Ru=!0);let H=at||Ru&&c-Sp>=110;if(H){let j=It.position.distanceTo(Rp)>Math.max(.02,It.position.distanceTo(se.target)*4e-4)||Cp.angleTo(It.quaternion)>4e-4;Rp.copy(It.position),Cp.copy(It.quaternion),Ru=vp(null,j)||j,Sp=c}if(H||W&&c-Ep>=110){Ep=c;let j=se.target;Le.target.position.copy(j),Le.position.set(j.x-1200,j.y+2100,j.z-1300),Gt("#north-arrow").style.transform=`rotate(${-ka()}deg)`,Gt("#scene-status").textContent=A<350?"\u5EFA\u7B51\u8FD1\u666F \xB7 \u7EC6\u90E8\u590D\u539F":A<2100?"\u4E5D\u534E\u5C71\u8857\u533A \xB7 \u62D6\u52A8\u73AF\u770B":S2.matches?"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u6EDA\u8F6E\u7F29\u653E":"\u4E5D\u534E\u5C71\u5168\u666F \xB7 \u53CC\u6307\u7F29\u653E";let Y=A*2*Math.tan(43*Math.PI/360)/innerHeight*80;Gt("#scale-line").textContent=Y>1e3?`${(Y/1e3).toFixed(1)} km`:`${Math.round(Y/10)*10||5} m`}Qt(),p.render(Xt,It);let D=mi?.updateLabels(c);(W||H||D)&&Mp(),at=!1,Tp.copy(It.matrixWorld),Ap.copy(It.projectionMatrix),++px===30&&console.info("Map verification",JSON.stringify(window.mapDiagnostics))}Go=!0,jd(),nc(1),Gt("#loading").classList.add("done"),setTimeout(()=>{Gt("#loading").hidden=!0,document.body.classList.contains("map-chrome-hidden")||$g.start()},700),requestAnimationFrame(Lp),window.mapDiagnostics={version:t.version,buildings:t.stats.buildings,places:lr.length,businesses:t.stats.businesses,trees:Hl.length,bamboo:ou.length,roads:t.roads.length,coordinateSystem:t.geo.crs,randomHouses:0,detailModel:"mapped footprints + area-rule facades; only \u5C45\u4E4B\u6797 named among businesses",signs:Ei.length,lanterns:Or.length,get drawCalls(){return p.info.render.calls},get frames(){return p.info.render.frame},get pixelRatio(){return p.getPixelRatio()},get quality(){return Nr[fi].name+(_r?"-":"")},get tier(){return fi},get frameMs(){return Math.round(ja*10)/10},get triangles(){return p.info.render.triangles},get visibleLabels(){return Xl},get resolutionLimit(){return T.limit},get idleResolution(){return M},get spatialMode(){return hu.some(c=>c.near)?"near":"far"},get labelPasses(){return wt},get labelSelections(){return ce},get labelCovers(){return ft.map(c=>c.map(Math.round))},get coverMeasures(){return Rt},get animationUpdates(){return wp}}}
/**
 * @license
 * Copyright 2010-2023 Three.js Authors
 * SPDX-License-Identifier: MIT
 */
