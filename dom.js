// Small DOM and utility helpers shared by app.js.
export const $=s=>document.querySelector(s), $$=s=>[...document.querySelectorAll(s)];
export const store={get(k){try{return localStorage.getItem('jiuhua.'+k);}catch{return null;}},set(k,v){try{localStorage.setItem('jiuhua.'+k,v);}catch{}}};
export const clamp=(v,a,b)=>Math.min(b,Math.max(a,v));
export const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
export function node(tag,cls,text){const n=document.createElement(tag);if(cls)n.className=cls;if(text!==undefined)n.textContent=text;return n;}
// Panels slide/fade in and out: `hidden` is only set once the exit transition has finished.
export function reveal(el){clearTimeout(el._t);el.hidden=false;void el.offsetWidth;el.classList.add('show');}
export function conceal(el,ms=440){el.classList.remove('show');clearTimeout(el._t);el._t=setTimeout(()=>{if(!el.classList.contains('show'))el.hidden=true;},ms);}
export function toast(s){const t=$('#toast');t.textContent=s;reveal(t);clearTimeout(toast.t);toast.t=setTimeout(()=>conceal(t,400),3200);}
