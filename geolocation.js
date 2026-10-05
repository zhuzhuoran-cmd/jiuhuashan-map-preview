// This API consumes WGS84. Do not infer a different CRS from the browser name.
export function mapPosition(coords,geo,{W,D}){
 const {longitude:lon,latitude:lat,accuracy}=coords;
 if(![lon,lat,accuracy].every(Number.isFinite)||Math.abs(lon)>180||Math.abs(lat)>90||accuracy<0)return null;
 const {origin,kx,ky}=geo;
 if(!origin||![origin.lon,origin.lat,kx,ky,W,D].every(Number.isFinite)||kx<=0||ky<=0||W<=0||D<=0)return null;
 const x=(lon-origin.lon)*kx,z=(origin.lat-lat)*ky;
 // Never clamp an outside fix onto the edge of the map.
 return {x,z,accuracy,inside:Math.abs(x)<=W/2&&Math.abs(z)<=D/2};
}

export function createLocationTracker({geo,terrain,onChange,geolocation=navigator.geolocation,
 secure=window.isSecureContext,doc=document,win=window,now=Date.now,
 schedule=setInterval,unschedule=clearInterval,maxAccuracy=100,maxAge=30000,
 retainAge=120000,retryAfter=60000,maxRetryAfter=240000}){
 let enabled=false,destroyed=false,watch=null,epoch=0,timer=null,state='',lastFix=0,lastPoint=null;
 let lastEvent=0,retryDelay=retryAfter,badFixes=0,published=null;
 let hasReliableFix=false,failureRetryAt=null,failureDelay=5000;
 const retained=()=>lastPoint&&now()-lastFix<=retainAge?lastPoint:null;
 const freshPoint=()=>lastPoint&&now()-lastFix<=maxAge;
 // Keep receiving fixes to update freshness, but avoid DOM work for sub-metre jitter.
 function emit(next,point=null,fresh=false){
  const changed=next!==state;state=next;
  const samePoint=point&&published?.point&&Math.hypot(point.x-published.point.x,point.z-published.point.z)<1&&Math.ceil(point.accuracy/10)===Math.ceil(published.point.accuracy/10);
  if(!changed&&published?.enabled===enabled&&published.fresh===fresh&&((!point&&!published.point)||samePoint))return;
  published={state,point,enabled,changed,fresh};onChange(published);
 }
 function clearWatch(){epoch++;if(watch!==null){geolocation.clearWatch(watch);watch=null;}}
 function clear(){failureRetryAt=null;clearWatch();if(timer!==null){unschedule(timer);timer=null;}}
 function forget(){lastPoint=null;lastFix=0;badFixes=0;hasReliableFix=false;failureDelay=5000;}
 function retryInitialFailure(){
  // An explicit startup error is different from a healthy, stationary watch.
  // Repeated errors cannot postpone an already scheduled retry.
  if(!hasReliableFix&&failureRetryAt===null)failureRetryAt=now()+failureDelay;
 }
 function stop(){if(!enabled)return;enabled=false;clear();forget();emit('off');}
 function watchPosition(){
  failureRetryAt=null;clearWatch();lastEvent=now();const token=epoch;
  emit('waiting',retained());
  try{
   const id=geolocation.watchPosition(position=>{
    if(token!==epoch||!enabled||doc.hidden)return;
    lastEvent=now();
    if(!Number.isFinite(position.timestamp)||now()-position.timestamp>maxAge||position.timestamp>now()+5000){retryInitialFailure();emit('stale',retained());return;}
    const point=mapPosition(position.coords,geo,terrain);
    if(!point){retryInitialFailure();emit('unavailable',retained());return;}
    if(point.accuracy>maxAccuracy){
     // Never display an inaccurate new fix as current. Brief threshold wobble may
     // retain the last good fix, explicitly styled as a previous location.
     badFixes++;
     if(point.accuracy>maxAccuracy*2||badFixes>=3){lastPoint=null;lastFix=0;}
     emit(point.accuracy>=1000?'approximate':'inaccurate',retained());return;
    }
    badFixes=0;retryDelay=retryAfter;hasReliableFix=true;failureRetryAt=null;failureDelay=5000;
    // A confirmed outside fix invalidates any older inside fix immediately.
    lastPoint=point.inside?point:null;lastFix=position.timestamp;
    emit(point.inside?'inside':'outside',lastPoint,!!lastPoint);
   },error=>{
    if(token!==epoch||!enabled||doc.hidden)return;
    if(error.code===1){enabled=false;clear();forget();emit('denied');}
    else{retryInitialFailure();emit(error.code===3?'timeout':'unavailable',retained());}
   },{enableHighAccuracy:true,maximumAge:0,timeout:15000});
   // Also handle implementations/mocks that synchronously deny permission.
   if(token===epoch&&enabled)watch=id;else geolocation.clearWatch(id);
  }catch{enabled=false;clear();forget();emit('unavailable');}
 }
 function tick(){
  if(!enabled||doc.hidden)return;
  if(failureRetryAt!==null){
   if(now()>=failureRetryAt){failureDelay=Math.min(60000,failureDelay*2);watchPosition();}
   return;
  }
  const point=retained();
  if(state==='inside'&&!freshPoint())emit('stale',point);
  else if(published?.point&&!point)emit(state);
  // watchPosition is change-driven, not a heartbeat. A quiet watch need not be
  // broken: keep a dated, grey last position and make a bounded fresh request.
  if(now()-lastEvent>=retryDelay){
   retryDelay=Math.min(maxRetryAfter,retryDelay*2);watchPosition();
  }
 }
 function resume(){timer=schedule(tick,5000);watchPosition();}
 function start(){
  if(enabled||destroyed)return;
  if(!secure){emit('insecure');return;}
  if(!geolocation){emit('unsupported');return;}
  forget();retryDelay=retryAfter;enabled=true;
  if(doc.hidden)emit('paused');else resume();
 }
 function visibility(){
  if(!enabled)return;
  clear();
  if(doc.hidden)emit('paused',retained());else resume();
 }
 function pagehide(){if(enabled)stop();}
 doc.addEventListener('visibilitychange',visibility);win.addEventListener('pagehide',pagehide);
 return {start,stop,get enabled(){return enabled;},destroy(){stop();destroyed=true;doc.removeEventListener('visibilitychange',visibility);win.removeEventListener('pagehide',pagehide);}};
}
