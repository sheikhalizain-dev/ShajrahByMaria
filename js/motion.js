(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('reels'))return;
/* ---------- reels: add {src:'video/name.mp4',poster:'img/name.jpg',label:'...'} entries to show them ---------- */
const REELS=[];
if(REELS.length){const host=$('reels');host.hidden=false;
  REELS.forEach((v,i)=>{const el=document.createElement('video');el.id='reel_'+i;el.src=v.src;if(v.poster)el.poster=v.poster;el.controls=true;el.muted=true;el.loop=true;el.playsInline=true;el.preload='metadata';el.setAttribute('aria-label',v.label||'Reel');host.append(el)})}
})();
