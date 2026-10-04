import {clamp} from './dom.js';

// PNG export: the 3D frame, then each label painted from its computed style (so the image follows style.css), the brand
// box and the credits. Canvas shadow blur and offsets ignore the context scale, hence the k factor.
const cssToken=k=>getComputedStyle(document.documentElement).getPropertyValue(k).trim();
const COLOR=/#[0-9a-f]{3,8}\b|rgba?\([^)]*\)/gi;
function roundPath(c,x,y,w,h,r){r=Math.max(0,Math.min(r,w/2,h/2));c.beginPath();if(c.roundRect)c.roundRect(x,y,w,h,r);else{c.moveTo(x+r,y);c.arcTo(x+w,y,x+w,y+h,r);c.arcTo(x+w,y+h,x,y+h,r);c.arcTo(x,y+h,x,y,r);c.arcTo(x,y,x+w,y,r);c.closePath();}}
// A CSS linear-gradient (first and last stop, its angle) or plain background colour; null when transparent.
function cssFill(c,image,color,r){const stops=image&&image!=='none'&&image.match(COLOR);
 if(stops&&stops.length>1){const a=(+(image.match(/([\d.]+)deg/)?.[1]??180))*Math.PI/180,dx=Math.sin(a),dy=-Math.cos(a),l=(Math.abs(r.width*dx)+Math.abs(r.height*dy))/2,cx=r.x+r.width/2,cy=r.y+r.height/2;
  const g=c.createLinearGradient(cx-dx*l,cy-dy*l,cx+dx*l,cy+dy*l);g.addColorStop(0,stops[0]);g.addColorStop(1,stops.at(-1));return g;}
 return !color||/^transparent$|^rgba\(.*,\s*0\)$/.test(color)?null:color;}
// Canvas letter-spacing is not in every browser yet, so glyphs are set one by one.
function spacedText(c,text,x,y,ls){for(const ch of text){c.fillText(ch,x,y);x+=c.measureText(ch).width+ls;}return x;}
const spacedWidth=(c,text,ls)=>c.measureText(text).width+[...text].length*ls;
function paintBox(c,cs,r,k){const rad=parseFloat(cs.borderTopLeftRadius)||0,fill=cssFill(c,cs.backgroundImage,cs.backgroundColor,r),bw=parseFloat(cs.borderTopWidth)||0;
 const shadows=cs.boxShadow==='none'?[]:cs.boxShadow.split(/,(?![^(]*\))/).filter(s=>!/inset/.test(s)).map(s=>({col:s.match(COLOR)?.[0]||'transparent',v:s.replace(COLOR,'').trim().split(/\s+/).map(parseFloat)}));
 for(const s of shadows)if(!s.v[2]&&s.v[3]>0){roundPath(c,r.x+s.v[0]-s.v[3],r.y+s.v[1]-s.v[3],r.width+2*s.v[3],r.height+2*s.v[3],rad+s.v[3]);c.fillStyle=s.col;c.fill();} // rings
 if(fill){const soft=shadows.filter(s=>s.v[2]>0).sort((a,b)=>b.v[2]-a.v[2])[0];c.save();if(soft){c.shadowColor=soft.col;c.shadowBlur=soft.v[2]*k*.8;c.shadowOffsetX=soft.v[0]*k;c.shadowOffsetY=soft.v[1]*k;}
  roundPath(c,r.x,r.y,r.width,r.height,rad);c.fillStyle=fill;c.fill();c.restore();}
 if(bw&&cs.borderTopStyle!=='none'&&cssFill(c,'none',cs.borderTopColor,r)){c.lineWidth=bw;c.strokeStyle=cs.borderTopColor;c.setLineDash(cs.borderTopStyle==='dashed'?[3,2]:[]);roundPath(c,r.x+bw/2,r.y+bw/2,r.width-bw,r.height-bw,rad-bw/2);c.stroke();c.setLineDash([]);}}
function paintContent(c,parent,k){for(const n of parent.childNodes){
 if(n.nodeType===3){const t=n.textContent;if(!t.trim())continue;const cs=getComputedStyle(parent),range=document.createRange();range.selectNodeContents(n);const tr=range.getBoundingClientRect(),ls=parseFloat(cs.letterSpacing)||0,y=tr.y+tr.height/2;
  c.font=`${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;c.textAlign='left';c.textBaseline='middle';
  c.fillStyle=cs.color;
  // a text-shadow (the village names' white halo) as two soft glows under the glyphs
  if(cs.textShadow!=='none'){c.save();c.shadowColor='rgba(255,255,255,.95)';for(const blur of[3,9]){c.shadowBlur=blur*k;spacedText(c,t,tr.x,y,ls);}c.restore();}
  spacedText(c,t,tr.x,y,ls);continue;}
 if(n.nodeType!==1)continue;const cs=getComputedStyle(n);if(cs.display==='none'||cs.visibility==='hidden'||+cs.opacity<.05)continue;const r=n.getBoundingClientRect();
 if(n.tagName.toLowerCase()==='svg'){const vb=n.viewBox?.baseVal,path=n.querySelector('path');if(path&&vb?.width){c.save();c.translate(r.x,r.y);c.scale(r.width/vb.width,r.height/vb.height);c.fillStyle=cs.fill;c.fill(new Path2D(path.getAttribute('d')));c.restore();}continue;}
 paintBox(c,cs,r,k);paintContent(c,n,k);}}
function paintLabel(c,el,k,bottom){const b=el.querySelector('button'),cs=getComputedStyle(b),r=b.getBoundingClientRect();
 if(!r.width||cs.visibility==='hidden'||r.x<0||r.y<0||r.right>innerWidth||r.bottom>bottom)return;
 // stem and ground dot (route-stop stems fade when veiled; others only have the entrance fade, ignored here). A place
 // label's stem is a leader from its point (the bottom centre of the label box) to the pill's nearest edge.
 const i=el.querySelector('i'),is=i&&getComputedStyle(i);
 if(is&&is.display!=='none'){const as=getComputedStyle(i,'::after'),d=parseFloat(as.width)||0;c.save();
  let cx,cy;
  if(el.classList.contains('pin')){const er=el.getBoundingClientRect();cx=er.x+er.width/2;cy=er.bottom;const tx=clamp(cx,r.x,r.right),ty=clamp(cy,r.y,r.bottom);
   if(Math.hypot(tx-cx,ty-cy)>=3){const lw=parseFloat(is.height)||1.5,halo=is.boxShadow.match(/rgba?\([^)]*\)/);c.lineCap='round';
    if(halo){c.strokeStyle=halo[0];c.lineWidth=lw+1.5;c.beginPath();c.moveTo(cx,cy);c.lineTo(tx,ty);c.stroke();}
    c.strokeStyle=is.backgroundColor;c.lineWidth=lw;c.beginPath();c.moveTo(cx,cy);c.lineTo(tx,ty);c.stroke();}}
  else{const ir=i.getBoundingClientRect();c.globalAlpha=el.classList.contains('route-stop')?+is.opacity:1;
   c.fillStyle=cssFill(c,is.backgroundImage,is.backgroundColor,ir)||'transparent';c.fillRect(ir.x,ir.y,ir.width,ir.height);cx=ir.x+ir.width/2;cy=ir.bottom-(parseFloat(as.bottom)||0)-d/2;}
  if(d){const ring=as.boxShadow.match(/(rgba?\([^)]*\)) 0px 0px 0px ([\d.]+)px/);
   if(ring){c.fillStyle=ring[1];c.beginPath();c.arc(cx,cy,d/2+ +ring[2],0,7);c.fill();}c.fillStyle=as.backgroundColor;c.beginPath();c.arc(cx,cy,d/2,0,7);c.fill();}
  c.restore();}
 paintBox(c,cs,r,k);
 const dot=getComputedStyle(b,'::before'),d=parseFloat(dot.width)||0;
 if(d&&dot.display!=='none'&&dot.content!=='none'){c.fillStyle=dot.backgroundColor;c.beginPath();c.arc(r.x+(parseFloat(cs.borderLeftWidth)||0)+(parseFloat(cs.paddingLeft)||0)+d/2,r.y+r.height/2,d/2,0,7);c.fill();}
 paintContent(c,b,k);}
// frame is the WebGL canvas; render(keepClear) draws one frame with the labels placed clear of the given screen
// rectangles (the image's brand box and credits strip) and returns the label elements. Returns the finished canvas.
export function exportMapImage({frame,stats,render}){
 // At least the screen's pixel ratio (up to 2), so labels and text stay sharp when the 3D frame runs at a lowered resolution.
 const vw=innerWidth,vh=innerHeight,k=Math.min(2,Math.max(devicePixelRatio||1,frame.width/vw)),out=document.createElement('canvas');out.width=Math.round(vw*k);out.height=Math.round(vh*k);
 const c=out.getContext('2d'),sans=cssToken('--sans')||'sans-serif',serif=cssToken('--serif')||'serif',ink=cssToken('--ink')||'#1c2a25',muted=cssToken('--muted')||'#5c6962';
 // Credits, wrapped to the image width, in a rice-paper strip along the bottom.
 c.font=`10.5px ${sans}`;const lines=[];
 for(const group of[['© OpenStreetMap contributors','Overture Maps Foundation','Copernicus DEM (ESA)','去哪儿/360地图/OSM 公开地点'],['补充轮廓：Qian Shi 等 / CC BY 4.0','建筑楼高、立面及植被为近似复原']]){let line='';
  for(const s of group){const t=line?line+' · '+s:s;if(line&&c.measureText(t).width>vw-24){lines.push(line);line=s;}else line=t;}lines.push(line);}
 const footH=12+lines.length*15;
 // Brand box as on the page: rice paper, the vermilion seal (九 over 华), the serif wordmark, subtitle and data line.
 const m=vw<600?12:24,pad=15,seal=44,tx=m+pad+seal+13,title='九华山',sub='三维实地导览 · 走近九华',meta=`${stats.buildings} 建筑轮廓 · ${stats.places} 地点 · 2026.09.27`;
 c.font=`600 26px ${serif}`;const tw=spacedWidth(c,title,3.64);c.font=`12.5px ${sans}`;const sw=spacedWidth(c,sub,.75);c.font=`11px ${sans}`;const mw=c.measureText(meta).width;
 const bw=tx-m+Math.max(tw,sw,mw)+20,bh=pad*2+66;
 // The image has none of the page's chrome, only its own brand box and credits strip: labels are placed clear of those;
 // the next frame places them for the screen again.
 const labelEls=render([[m,m,m+bw,m+bh],[0,vh-footH,vw,vh]]);
 c.fillStyle='#dce5df';c.fillRect(0,0,out.width,out.height);c.drawImage(frame,0,0,out.width,out.height);c.scale(k,k);
 for(const el of labelEls.filter(e=>e.classList.contains('maplabel')&&e.style.display!=='none').sort((a,b)=>(parseInt(getComputedStyle(a).zIndex)||0)-(parseInt(getComputedStyle(b).zIndex)||0)))paintLabel(c,el,k,vh-footH);
 c.save();c.shadowColor='rgba(20,32,27,.24)';c.shadowBlur=20*k;c.shadowOffsetY=6*k;roundPath(c,m,m,bw,bh,18);c.fillStyle='rgba(251,249,243,.96)';c.fill();c.restore();
 c.lineWidth=1;c.strokeStyle='rgba(28,42,37,.09)';roundPath(c,m+.5,m+.5,bw-1,bh-1,17.5);c.stroke();
 const sx=m+pad,sy=m+pad,zhu=(cssToken('--zhu-fill').match(COLOR)||['#c24536','#a8322a']);
 c.fillStyle=cssFill(c,`linear-gradient(160deg, ${zhu[0]}, ${zhu.at(-1)})`,null,{x:sx,y:sy,width:seal,height:seal});roundPath(c,sx,sy,seal,seal,10);c.fill();
 c.lineWidth=2;c.strokeStyle='#b23a2d';roundPath(c,sx+1,sy+1,seal-2,seal-2,9);c.stroke();c.lineWidth=1;c.strokeStyle='rgba(251,241,230,.55)';roundPath(c,sx+2.5,sy+2.5,seal-5,seal-5,7.5);c.stroke();
 c.fillStyle='#fbf1e6';c.font=`600 16px ${serif}`;c.textAlign='center';c.textBaseline='middle';c.fillText('九',sx+seal/2,sy+seal/2-8.5);c.fillText('华',sx+seal/2,sy+seal/2+8.5);
 c.textAlign='left';c.textBaseline='alphabetic';c.fillStyle=ink;c.font=`600 26px ${serif}`;spacedText(c,title,tx,sy+25,3.64);
 c.fillStyle=muted;c.font=`12.5px ${sans}`;spacedText(c,sub,tx,sy+46,.75);c.font=`11px ${sans}`;c.fillText(meta,tx,sy+64);
 c.fillStyle='rgba(251,249,243,.95)';c.fillRect(0,vh-footH,vw,footH);c.fillStyle='rgba(28,42,37,.09)';c.fillRect(0,vh-footH,vw,1);
 c.fillStyle=muted;c.font=`10.5px ${sans}`;c.textBaseline='middle';lines.forEach((t,i)=>c.fillText(t,12,vh-footH+13.5+i*15));
 return out;
}
