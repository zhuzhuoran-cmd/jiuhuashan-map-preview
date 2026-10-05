import {$,clamp,node,reveal,conceal} from './dom.js';

export function photoCredit(photo){const credit=node('div','photo-credit');
 const text=[photo.author&&`摄影：${photo.author}`,photo.takenAt?`拍摄于 ${photo.takenAt}`:photo.publishedAt?`来源页面 ${photo.publishedAt} · 拍摄日期未注明`:photo.sourceUrl&&'拍摄日期未注明'].filter(Boolean).join(' · ');if(text)credit.append(node('span','',text+' · '));
 for(const [label,url]of [[photo.sourceName||'图片出处',photo.sourceUrl],[photo.license,photo.licenseUrl]]){if(!label||!url)continue;const a=node('a','',label);a.href=url;a.target='_blank';a.rel='noopener noreferrer';if(credit.lastChild?.tagName==='A')credit.append(' · ');credit.append(a);}return credit;}
// onToggle runs as the viewer opens and closes (app.js: syncViewShift, which makes the page behind it inert);
// fallbackFocus is where focus goes when the photo that opened the viewer is gone.
export function createPhotoViewer({reducedMotion,onToggle,focusLost,restoreFocus,fallbackFocus}){
// Photos open inside the page and swipe sideways, including embedded offline images.
// The page behind it is inert while it is open (syncViewShift), so focus stays inside; closing returns it to the photo.
function openViewer(srcs,start,title='居之林民宿实拍',photos=[],opener=document.activeElement){const v=$('#viewer'),strip=v.querySelector('.viewer-strip'),count=v.querySelector('.viewer-count'),prev=v.querySelector('.viewer-prev'),next=v.querySelector('.viewer-next');
 if(!v.classList.contains('show'))v._opener=opener;
 v.setAttribute('aria-label',title+'照片');
 let caption=v.querySelector('.viewer-caption');if(!caption){caption=node('div','viewer-caption');caption.onclick=e=>e.stopPropagation();v.append(caption);}
 // Empty slides preserve the swipe layout without requesting every original in the album.
 const images=srcs.map((src,i)=>{const img=node('img');img.alt=photos[i]?.alt||title+' · '+(i+1);img.decoding='async';return img;});
 const load=i=>{const img=images[i];if(img&&!img.hasAttribute('src'))img.src=srcs[i];};
 strip.replaceChildren(...images.map(img=>{const f=node('div','slide');f.append(img);return f;}));
 // ‹ and › are disabled at either end (both hidden for a single photo); one about to be disabled under focus hands it on.
 const at=()=>clamp(Math.round(strip.scrollLeft/Math.max(1,strip.clientWidth)),0,srcs.length-1),upd=()=>{const i=at();load(i);count.textContent=`${i+1} / ${srcs.length}`;caption.replaceChildren();const photo=photos[i];caption.hidden=!photo;if(photo){caption.append(node('span','',photo.alt));if(photo.sourceUrl)caption.append(photoCredit(photo));}
  const f=document.activeElement;prev.hidden=next.hidden=srcs.length<2;prev.disabled=i===0;next.disabled=i===srcs.length-1;
  if(f===prev&&prev.disabled||f===next&&next.disabled)(next.disabled&&prev.disabled?v.querySelector('.viewer-close'):f===prev?next:prev).focus({preventScroll:true});};strip.onscroll=upd;
 const go=d=>{const i=clamp(at()+d,0,srcs.length-1);load(i);strip.scrollTo({left:i*strip.clientWidth,behavior:reducedMotion?'auto':'smooth'});};v._go=go;
 prev.onclick=e=>{e.stopPropagation();go(-1);};next.onclick=e=>{e.stopPropagation();go(1);};v.onclick=closeViewer;
 reveal(v);strip.scrollLeft=start*strip.clientWidth;upd();onToggle();v.querySelector('.viewer-close').focus({preventScroll:true});}
function closeViewer(){const v=$('#viewer'),o=v._opener,had=v.contains(document.activeElement);v._opener=null;conceal(v,260);onToggle();if(had||focusLost())restoreFocus(o,fallbackFocus());}
return {open:openViewer,close:closeViewer};
}
