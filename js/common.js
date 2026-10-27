(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
/* ---------- nav ---------- */
const nav=$('nav'),onScroll=()=>nav.classList.toggle('solid',scrollY>40||document.body.dataset.nav==='solid');addEventListener('scroll',onScroll,{passive:true});onScroll();
const menu=$('menu'),setMenu=o=>{menu.hidden=!o;$('menuBtn').setAttribute('aria-expanded',o);document.body.style.overflow=o?'hidden':''};
$('menuBtn').onclick=()=>setMenu(true);$('menuClose').onclick=()=>setMenu(false);menu.querySelectorAll('a').forEach(a=>a.onclick=()=>setMenu(false));
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});

/* ---------- waving cloth ---------- */
const cloths=[];
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.target._o)e.target._o.vis=e.isIntersecting}),{rootMargin:'80px'});
function paint(o,t){
  const c=o.ctx,w=o.w,h=o.h,im=o.img,iw=im.naturalWidth,ih=im.naturalHeight;if(!w||!iw)return;
  c.clearRect(0,0,w,h);
  if(o.mode==='hang'){
    const cw=w*.8,x0=w*.1,sc=Math.max(cw/iw,h/ih),sx=(iw-cw/sc)/2,amp=w*.07,sh=3;
    for(let y=0;y<h;y+=sh){const k=Math.pow(y/h,1.4),p=y/h*4.2-t*1.1,xo=(Math.sin(p)*amp+Math.sin(t*.6)*amp*.7)*k;
      c.drawImage(im,sx,y/sc,cw/sc,sh/sc,x0+xo,y,cw,sh+.7);
      const sl=Math.cos(p)*k;c.fillStyle=sl>0?'rgba(255,244,225,'+(sl*.12)+')':'rgba(40,25,10,'+(-sl*.2)+')';c.fillRect(x0+xo,y,cw,sh+.7);}
  }else{
    const sc=Math.max(w/iw,h/ih)*1.14,ox=(w-iw*sc)/2,oy=(h-ih*sc)*o.fy,amp=h*.022,sw=3;
    for(let x=0;x<w;x+=sw){const p=x/w*6.283,a=Math.sin(p*1.4+t)*amp+Math.sin(p*3.1-t*1.4)*amp*.4;
      c.drawImage(im,(x-ox)/sc,0,sw/sc,ih,x,oy+a,sw+.7,ih*sc);
      const sl=Math.cos(p*1.4+t);c.fillStyle=sl>0?'rgba(255,244,225,'+(sl*.1)+')':'rgba(40,25,10,'+(-sl*.17)+')';c.fillRect(x,0,sw+.7,h);}
  }
}
function cloth(cv,src,mode,fy){
  const o={cv,ctx:cv.getContext('2d'),mode,vis:true,ok:false,ph:Math.random()*6};cv._o=o;
  o.size=()=>{const r=cv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,1.5);o.w=r.width;o.h=r.height;cv.width=Math.round(o.w*d);cv.height=Math.round(o.h*d);o.ctx.setTransform(d,0,0,d,0,0)};
  o.set=(s,f)=>{o.ok=false;o.fy=f==null?.5:f;const im=new Image();im.onload=()=>{o.img=im;o.ok=true;o.size();paint(o,o.ph)};im.src=s};
  o.set(src,fy);cloths.push(o);io.observe(cv);return o;
}
document.querySelectorAll('[data-cloth]').forEach(cv=>cloth(cv,cv.dataset.cloth,'ripple'));
document.querySelectorAll('[data-hang]').forEach(cv=>cloth(cv,cv.dataset.hang,'hang'));
if(!reduce)(function tick(ts){const t=ts/1000;cloths.forEach(o=>{if(o.ok&&o.vis)paint(o,t+o.ph)});requestAnimationFrame(tick)})(0);
const remeasure=()=>cloths.forEach(o=>{o.size();if(o.ok)paint(o,o.ph)});
let rt2;addEventListener('resize',()=>{clearTimeout(rt2);rt2=setTimeout(remeasure,150)});
addEventListener('load',remeasure);if(document.fonts&&document.fonts.ready)document.fonts.ready.then(remeasure);
})();
