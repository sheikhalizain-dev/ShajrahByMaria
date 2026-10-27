(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('loomCanvas'))return;
/* ---------- loom ---------- */
const YARNS=[['Ivory','#f1e9db'],['Kraft','#d4b98f'],['Flax','#c2a074'],['Gold','#b08a3a'],['Walnut','#5a4128'],['Olive','#5f6e35'],['Rust','#9b3b27']];
const mod=(n,m)=>((n%m)+m)%m, tri=(n,p)=>p-Math.abs(mod(n,2*p)-p);
const WEAVES=[
  {id:'plain',label:'Plain weave',note:'1/1',up:(x,y)=>(x+y)%2===0},
  {id:'twill',label:'Twill',note:'2/2',up:(x,y)=>mod(x-y,4)<2},
  {id:'herringbone',label:'Herringbone',note:'2/2',up:(x,y)=>mod(Math.floor(x/8)%2?x+y:x-y,4)<2},
  {id:'diamond',label:'Diamond twill',note:'2/2',up:(x,y)=>mod(tri(x,6)+tri(y,6),4)<2}
];
const st={weave:3,weft:3,warp:0};
const lcv=$('loomCanvas'),ctx=lcv.getContext('2d');
let W=0,H=0,s=12,cols=0,rows=0,woven=0,raf=0;
const shade=(hex,a)=>{const n=parseInt(hex.slice(1),16);const f=v=>Math.max(0,Math.min(255,v+a));return 'rgb('+f(n>>16)+','+f(n>>8&255)+','+f(n&255)+')'};
const jit=n=>Math.round((Math.sin(n*12.9898)*43758.5453%1)*9);
function size(){
  const r=lcv.getBoundingClientRect(),d=Math.min(devicePixelRatio||1,2);
  W=r.width;H=r.height;s=W<520?9:12;cols=Math.ceil(W/s);rows=Math.ceil(H/s);
  lcv.width=Math.round(W*d);lcv.height=Math.round(H*d);ctx.setTransform(d,0,0,d,0,0);
}
function draw(){
  const up=WEAVES[st.weave].up,wf=YARNS[st.weft][1],wp=YARNS[st.warp][1];
  ctx.fillStyle=shade(wp,-70);ctx.fillRect(0,0,W,H);
  for(let x=0;x<cols;x++){ctx.fillStyle=shade(wp,jit(x));ctx.fillRect(x*s+1,0,s-2,H);}
  for(let y=0;y<woven;y++){
    const Y=y*s;
    ctx.fillStyle=shade(wf,jit(y+99));ctx.fillRect(0,Y,W,s);
    ctx.fillStyle='rgba(255,255,255,.16)';ctx.fillRect(0,Y+1,W,1.5);
    ctx.fillStyle='rgba(0,0,0,.22)';ctx.fillRect(0,Y+s-1.5,W,1.5);
    for(let x=0;x<cols;x++){ if(!up(x,y)) continue;
      const X=x*s;
      ctx.fillStyle='rgba(0,0,0,.28)';ctx.fillRect(X,Y,s,s);
      ctx.fillStyle=shade(wp,jit(x));ctx.fillRect(X+1,Y,s-2,s);
      ctx.fillStyle='rgba(255,255,255,.18)';ctx.fillRect(X+2,Y,1.5,s);
      ctx.fillStyle='rgba(0,0,0,.2)';ctx.fillRect(X+s-3,Y,1.5,s);
    }
  }
}
function weave(animate){
  cancelAnimationFrame(raf);
  if(!animate||reduce){woven=rows;draw();return}
  woven=0;const step=Math.max(1,Math.ceil(rows/48));
  (function tick(){woven=Math.min(rows,woven+step);draw();if(woven<rows)raf=requestAnimationFrame(tick)})();
}
function caption(){const w=WEAVES[st.weave];$('loomCap').textContent=w.note+' '+w.label.toLowerCase()+', '+YARNS[st.weft][0].toLowerCase()+' weft on '+YARNS[st.warp][0].toLowerCase()+' warp'}
function pick(host,key,i){st[key]=i;[...host.children].forEach((b,j)=>b.setAttribute('aria-pressed',j===i));caption();weave(true)}
WEAVES.forEach((w,i)=>{const b=document.createElement('button');b.type='button';b.className='bt';b.textContent=w.label;b.setAttribute('aria-pressed',i===st.weave);b.onclick=()=>pick($('weaves'),'weave',i);$('weaves').append(b)});
['weft','warp'].forEach(k=>YARNS.forEach((y,i)=>{const b=document.createElement('button');b.type='button';b.style.setProperty('--c',y[1]);b.title=y[0];b.setAttribute('aria-label',y[0]);b.setAttribute('aria-pressed',i===st[k]);b.onclick=()=>pick($(k),k,i);$(k).append(b)}));
$('again').onclick=()=>weave(true);
size();caption();weave(false);
let rt;addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{size();weave(false)},120)});
})();
