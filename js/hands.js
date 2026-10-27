(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('handsCv'))return;
/* ---------- the hands: the drawing itself moves ---------- */
const ez=x=>x*x*(3-2*x);
(function(){
  const cv=$('handsCv'),c=cv.getContext('2d'),im=new Image(),T=4;let on=true,ready=false;
  const G=[
    {per:2.6,p:[[243,250,30,66,16,0,0],[165,238,22,48,-5,2,.5]]},
    {per:2.2,p:[[440,264,16,48,10,0,0],[450,205,26,50,0,-5,.2]]},
    {per:2.4,p:[[160,388,22,44,-10,-2,0],[232,400,22,44,10,3,0]]},
    {per:2.8,p:[[380,387,28,55,-16,-3,0]]},
    {per:1.5,p:[[152,528,28,56,4,9,0]]},
    {per:3.2,p:[[497,560,22,46,-4,-9,0],[362,505,20,42,3,5,.5]]}
  ];
  const stroke=p=>p<.5?ez(p/.5):p<.62?1:1-ez((p-.62)/.38);
  function paint(t){
    c.drawImage(im,0,0);
    G.forEach(g=>{
      let x0=1e9,y0=1e9,x1=0,y1=0;
      const ps=g.p.map(h=>{const a=stroke(((t/g.per+h[6])%1+1)%1);x0=Math.min(x0,h[0]-h[3]);y0=Math.min(y0,h[1]-h[3]);x1=Math.max(x1,h[0]+h[3]);y1=Math.max(y1,h[1]+h[3]);return [h[0],h[1],h[2],h[3],h[4]*a,h[5]*a]});
      x0=Math.floor(x0/T)*T;y0=Math.floor(y0/T)*T;
      for(let y=y0;y<y1;y+=T)for(let x=x0;x<x1;x+=T){
        let dx=0,dy=0;
        for(const h of ps){const r=Math.hypot(x+T/2-h[0],y+T/2-h[1]);if(r>=h[3])continue;const u=r<=h[2]?1:(h[3]-r)/(h[3]-h[2]),w=u*u*(3-2*u);dx+=h[4]*w;dy+=h[5]*w}
        if(dx||dy)c.drawImage(im,x-dx,y-dy,T,T,x,y,T,T);
      }
    });
  }
  im.onload=()=>{ready=true;paint(0)};im.src='img/p11.jpg';
  new IntersectionObserver(es=>{on=es[0].isIntersecting},{rootMargin:'100px'}).observe(cv);
  if(!reduce)(function tick(ts){if(ready&&on)paint(ts/1000);requestAnimationFrame(tick)})(0);
})();
})();
