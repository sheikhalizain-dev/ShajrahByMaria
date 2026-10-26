(function(){
const $=id=>document.getElementById(id);
const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
const ARW='<svg viewBox="0 0 18 10" fill="none" stroke="currentColor" stroke-width="1.2"><path d="M0 5h17M13 1l4 4-4 4"/></svg>';

/* ---------- nav ---------- */
const nav=$('nav'),onScroll=()=>nav.classList.toggle('solid',scrollY>40);addEventListener('scroll',onScroll,{passive:true});onScroll();
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

/* ---------- approach: four steps ---------- */
const STEPS=[
  ['p10','Material','The raw beginning of every piece.','A hank of raw, pale fibre on dark wood'],
  ['p07','Thread','The continuous strand that ties the work together.','A cone of undyed yarn with a loose loop of thread'],
  ['p03','Texture','The touch and feel that gives the surface character.','Folds of slubbed plain-weave cloth'],
  ['p04','Form','The final shape an idea takes.','Cloth woven with a raised diamond pattern']
];
let ai=0,layer=0;const bgs=[$('apA'),$('apB')];
function showStep(i){ai=(i+STEPS.length)%STEPS.length;const s=STEPS[ai];
  $('apN').textContent=p2(ai+1)+'/'+p2(STEPS.length);$('apT').textContent=s[1];$('apP').textContent=s[2];
  const im=$('apImg');im.style.opacity=0;setTimeout(()=>{im.src='img/'+s[0]+'.jpg';im.alt=s[3];im.style.opacity=1},reduce?0:160);
  layer^=1;bgs[layer].style.backgroundImage='url(img/'+s[0]+'.jpg)';bgs[layer].classList.add('on');bgs[layer^1].classList.remove('on');
  [...$('apDots').children].forEach((b,j)=>b.setAttribute('aria-current',j===ai))}
const p2=n=>String(n).padStart(2,'0');
STEPS.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Step '+(i+1)+': '+s[1]);b.onclick=()=>showStep(i);$('apDots').append(b)});
$('apPrev').onclick=()=>showStep(ai-1);$('apNext').onclick=()=>showStep(ai+1);
(function(){const el=document.querySelector('.apc');let x0=null;el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});el.addEventListener('touchend',e=>{if(x0==null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)showStep(ai+(d<0?1:-1));x0=null})})();
showStep(0);

/* ---------- first collection (details as supplied by the client) ---------- */
const RUN=[['Runner','14 \u00d7 72 inches'],['Each table mat','12 \u00d7 18 inches']],SET='1 runner + 4 table mats';
const CUSTOM='Customisation is available to suit your space and requirements. Please contact us to discuss your preferred dimensions and customisation options.';
const BLOCK='Crafted from cotton fabric, this coordinated set combines handwoven craftsmanship with traditional hand block printing, bringing together texture and pattern to create a distinctive addition to your dining space.';
const PRODUCTS=[
  {n:'AAKS',slug:'aaks',type:'Handwoven Cushion Set',inc:'2 cushions',dims:[['Size','16 \u00d7 16 inches each']],price:9500,unit:'per set',mats:'Cotton thread, linen thread and banana fibre',
   desc:'Handwoven using cotton and linen threads, complemented by a subtle touch of banana fibre, this cushion set celebrates natural textures and thoughtful craftsmanship, bringing warmth and character to your home.'},
  {n:'BAFT',slug:'baft',type:'Handwoven Cotton Runner Set',inc:SET,dims:RUN,price:8500,unit:'per set',desc:'A handwoven runner designed to bring natural texture and understated character to your dining space.'},
  {n:'RIVAYAAT',slug:'rivayaat',type:'Block-Printed Runner Set',inc:SET,dims:RUN,price:7500,unit:'per set',mats:'Cotton fabric',desc:BLOCK},
  {n:'NAQSH',slug:'naqsh',type:'Block-Printed Runner Set',inc:SET,dims:RUN,price:7500,unit:'per set',mats:'Cotton fabric',desc:BLOCK},
  {n:'CHILMAN',slug:'chilman',type:'Window Blinds',dims:[],price:15000,unit:'',mats:'Naturally dyed yarn, cotton threads and banana fibre',
   desc:'Crafted using naturally dyed yarn and cotton threads, with banana fibre incorporated into the design, these blinds bring natural textures and thoughtful craftsmanship, bringing warmth and character to your home.',custom:CUSTOM},
  {n:'BISAAT',slug:'bisaat',type:'Floor Rug',dims:[['Standard size','40 \u00d7 100 inches']],price:25000,unit:'',mats:'Banana fibre and jute',
   desc:'Made using banana fibre and jute, this floor rug celebrates natural textures and adds an earthy, organic touch to your living space.',custom:CUSTOM},
  {n:'KARGHA',slug:'kargha',type:'Handwoven Grass Runner Set',inc:SET,dims:RUN,price:15000,unit:'per set',mats:'Grass fibre, banana fibre and cotton thread',
   desc:'Handwoven using grass fibre, banana fibre, and cotton thread, this coordinated set brings together natural textures and artisanal craftsmanship, adding an earthy, organic touch to your dining space.'}
];
/* photographs per product, in img/p/<slug>-<n>.jpg */
const PHOTOS={aaks:['img/p/aaks-1.jpg','img/p/aaks-2.jpg','img/p/aaks-3.jpg'],baft:['img/p/baft-1.jpg','img/p/baft-2.jpg','img/p/baft-3.jpg'],rivayaat:['img/p/rivayaat-1.jpg','img/p/rivayaat-2.jpg','img/p/rivayaat-3.jpg'],naqsh:['img/p/naqsh-1.jpg','img/p/naqsh-2.jpg','img/p/naqsh-3.jpg','img/p/naqsh-4.jpg','img/p/naqsh-5.jpg','img/p/naqsh-6.jpg'],chilman:['img/p/chilman-1.jpg','img/p/chilman-2.jpg','img/p/chilman-3.jpg'],bisaat:['img/p/bisaat-1.jpg','img/p/bisaat-2.jpg'],kargha:['img/p/kargha-1.jpg','img/p/kargha-2.jpg','img/p/kargha-3.jpg','img/p/kargha-4.jpg','img/p/kargha-5.jpg']};
const pkr=n=>'PKR '+n.toLocaleString('en-US');
let pi=0;
function setPhoto(k){const d=PRODUCTS[pi],L=PHOTOS[d.slug]||[],im=$('pImg'),T=$('pThumbs');
  if(!L.length){im.hidden=true;im.removeAttribute('src');T.innerHTML='';return}
  im.onload=()=>{im.hidden=false};im.hidden=true;im.src=L[k];im.alt=d.n+', '+d.type+' (photo '+(k+1)+' of '+L.length+')';
  if(T.dataset.s!==d.slug){T.dataset.s=d.slug;T.innerHTML=L.length>1?L.map((s,j)=>'<button type="button" aria-label="Photo '+(j+1)+'"><img src="'+s+'" alt=""></button>').join(''):'';
    [...T.children].forEach((b,j)=>b.onclick=e=>{e.stopPropagation();setPhoto(j)})}
  [...T.children].forEach((b,j)=>b.setAttribute('aria-current',j===k))}
function showProduct(i){pi=(i+PRODUCTS.length)%PRODUCTS.length;const d=PRODUCTS[pi],body=$('pBody');
  body.classList.remove('swap');void body.offsetWidth;body.classList.add('swap');
  $('pCount').textContent=p2(pi+1)+'/'+p2(PRODUCTS.length);$('pName').textContent=d.n;$('pType').textContent=d.type;
  $('pPrice').innerHTML=pkr(d.price)+(d.unit?'<small>'+d.unit+'</small>':'');
  const rows=[];if(d.inc)rows.push(['Includes',d.inc]);d.dims.forEach(x=>rows.push(x));if(d.mats)rows.push(['Materials',d.mats]);
  $('pSpec').innerHTML=rows.map(r=>'<div><dt>'+r[0]+'</dt><dd>'+r[1]+'</dd></div>').join('');$('pSpec').hidden=!rows.length;
  $('pDesc').textContent=d.desc;$('pCust').hidden=!d.custom;if(d.custom)$('pCustT').textContent=d.custom;
  $('phN').textContent=d.n;const im=$('pImg');im.hidden=true;setPhoto(0)
  $('enqNote').textContent='';
  [...$('pList').children].forEach((b,j)=>b.setAttribute('aria-current',j===pi))}
PRODUCTS.forEach((d,i)=>{const b=document.createElement('button');b.type='button';b.className='pli';b.setAttribute('role','listitem');
  b.innerHTML='<span class="no">'+p2(i+1)+'</span><span class="pnm">'+d.n+'</span><span class="tp">'+d.type+'</span><span class="pc">'+pkr(d.price)+(d.unit?' '+d.unit:'')+'</span>';
  b.onclick=()=>{showProduct(i);const r=$('collection').getBoundingClientRect();if(r.top<-20||r.top>innerHeight*.5)scrollTo({top:scrollY+r.top+60,behavior:reduce?'auto':'smooth'})};$('pList').append(b)});
$('pdPrev').onclick=()=>showProduct(pi-1);$('pdNext').onclick=()=>showProduct(pi+1);
$('enq').addEventListener('click',()=>{const d=PRODUCTS[pi],msg='Hello Shajra, I would like to enquire about '+d.n+' ('+d.type+').';
  const ok=()=>{$('enqNote').textContent='Message copied. Paste it into the Instagram chat.'},no=()=>{$('enqNote').textContent='Mention '+d.n+' in your message.'};
  try{navigator.clipboard.writeText(msg).then(ok,no)}catch(e){no()}});
(function(){const el=document.querySelector('.pimg');let x0=null;el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});el.addEventListener('touchend',e=>{if(x0==null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)showProduct(pi+(d<0?1:-1));x0=null})})();
showProduct(0);

/* ---------- cloth cards ---------- */
const CLOTHS=[['p04','Diamond lattice','Taupe cloth with a raised diamond pattern','50% 50%'],['p01','Fine rib','Sand-coloured cloth with a fine vertical rib','50% 50%'],['p03','Open plain weave','Loosely woven sand-coloured cloth','50% 50%'],['p02','Ivory stripe','Brown woven swatch with ivory stripes','50% 90%']];
CLOTHS.forEach((c,i)=>{const a=document.createElement('a');a.className='cc';a.href='https://www.instagram.com/shajrabymaria/';a.target='_blank';a.rel='noopener';
  a.innerHTML='<span class="no">'+p2(i+1)+'</span><div class="im"><img src="img/'+c[0]+'.jpg" alt="'+c[2]+'" style="object-position:'+c[3]+'" loading="lazy"></div><h3>'+c[1]+'</h3>';$('clg').append(a)});

/* ---------- launch teasers ---------- */
const TEASERS=[
  ['n10','DeRmj5siOg4','9 Oct 2026','Can you guess?','We’ve been dropping hints. Any guesses?','a tilted line of green lettering that begins “Can you guess”, with a wooden shuttle'],
  ['n09','DeUNlMUiC8s','10 Oct 2026','We are launching soon','After all the time and work that’s gone into it, we’re finally getting closer to sharing Shajra with you.','a cream envelope sealed with a wax stamp of the Shajra tree: “We are launching soon”'],
  ['n08','DeWwWfViPnS','11 Oct 2026','Swipe to reveal','Months in the making. Almost time.','a plain cream cloth beside a woven strip with fringe: “Swipe to reveal”'],
  ['n07','DeZVQTwiE32','12 Oct 2026','Just this close','We’ve kept you waiting, but not for much longer.','a halftone hand pinching the air: “Just this close”'],
  ['n06','Deb66y2FMR6','13 Oct 2026','Can you keep a secret?','It’s been a while in the making, and we’re nearly there.','a round window onto woven cloth: “Can you keep a secret?”'],
  ['n05','DehU1bnCPcQ','15 Oct 2026','Something big is unfolding','We’ve spent months showing you what goes into Shajra. Soon, you’ll see what comes out of it.','three coloured lines numbered 01 to 03: “Something big is unfolding in”'],
  ['n04','DemSMUmiMaG','17 Oct 2026','Hold the dots and scroll to open','The things we’ve been working on will soon find their place.','a crumpled sheet of paper on kraft: “Hold the dots and scroll to open”'],
  ['n03','DerWvjzoMFy','19 Oct 2026','Guess what’s coming','A little clue to what we’ve been up to','the shadow of a rolled woven runner with fringe: “Guess what’s coming!”'],
  ['n02','DexCZelCJXq','21 Oct 2026','Months in the making','Shajra is almost here.','plain kraft paper with the words “Months in the making”'],
  ['n01','De1pSkXCMbi','23 Oct 2026','Don’t swipe right','We said don’t swipe. We never said there wasn’t a reason to.','plain kraft paper with the words “Don’t swipe right”']
];
let ti=0;
function showTeaser(i){ti=(i+TEASERS.length)%TEASERS.length;const t=TEASERS[ti],nx=TEASERS[(ti+1)%TEASERS.length],im=$('psImg');
  im.style.opacity=0;setTimeout(()=>{im.src='img/'+t[0]+'.jpg';im.alt='Teaser post showing '+t[5];im.style.opacity=1},reduce?0:160);
  $('psDate').textContent=t[2];$('psN').textContent=p2(ti+1)+'/'+p2(TEASERS.length);$('psT').textContent=t[3];$('psP').textContent=t[4];
  $('psNx').src='img/'+nx[0]+'.jpg';$('psNx').alt='Next teaser: '+nx[5];$('psNc').textContent='Next: '+nx[2];$('psLink').href='https://www.instagram.com/p/'+t[1]+'/'}
$('psPrev').onclick=()=>showTeaser(ti-1);$('psNext').onclick=()=>showTeaser(ti+1);
(function(){const el=document.querySelector('.ps-img');let x0=null;el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});el.addEventListener('touchend',e=>{if(x0==null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)showTeaser(ti+(d<0?1:-1));x0=null})})();
showTeaser(0);

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

/* ---------- crossword ---------- */
const WORDS=[
  {n:1,d:'d',r:0,c:5,a:'THREAD',q:'The continuous strand that ties the work together.'},
  {n:2,d:'a',r:2,c:0,a:'TEXTURE',q:'The touch and feel that gives the surface character.'},
  {n:3,d:'d',r:3,c:8,a:'CRAFT',q:"Where Shajra's difference is found."},
  {n:4,d:'a',r:4,c:4,a:'MATERIAL',q:'The raw beginning of every piece.'},
  {n:5,d:'a',r:6,c:8,a:'FORM',q:'The final shape an idea takes.'}
];
const R=8,C=12,cells={},key=(r,c)=>r+'_'+c;
WORDS.forEach((w,wi)=>{w.cells=[];[...w.a].forEach((ch,k)=>{const r=w.r+(w.d==='d'?k:0),c=w.c+(w.d==='a'?k:0),id=key(r,c);
  (cells[id]=cells[id]||{r,c,ch,words:[]}).words.push(wi);w.cells.push(id);if(k===0)cells[id].n=w.n;})});
const grid=$('grid');let active=0;
for(let r=0;r<R;r++)for(let c=0;c<C;c++){
  const o=cells[key(r,c)],el=document.createElement('div');
  if(o){el.className='cell';el.innerHTML=(o.n?'<b>'+o.n+'</b>':'')+'<input id="cw_'+key(r,c)+'" maxlength="2" autocomplete="off" autocapitalize="characters" spellcheck="false" aria-label="Row '+(r+1)+', column '+(c+1)+'">';
    o.el=el;o.inp=el.firstElementChild.tagName==='INPUT'?el.firstElementChild:el.lastElementChild;}
  grid.append(el);
}
const clueBtns=[];
WORDS.forEach((w,wi)=>{const li=document.createElement('li'),b=document.createElement('button');b.type='button';
  b.innerHTML='<span>'+w.n+'.</span><span>'+w.q+' ('+w.a.length+')</span>';
  b.onclick=()=>{setActive(wi);const e=w.cells.map(i=>cells[i]).find(o=>!o.inp.value)||cells[w.cells[0]];e.inp.focus()};
  li.append(b);$(w.d==='a'?'across':'down').append(li);clueBtns[wi]=b;});
function setActive(wi){active=wi;
  Object.values(cells).forEach(o=>o.el.classList.toggle('on',WORDS[wi].cells.includes(key(o.r,o.c))));
  clueBtns.forEach((b,i)=>b.classList.toggle('on',i===wi));}
function move(o,step){const w=WORDS[active],i=w.cells.indexOf(key(o.r,o.c))+step;if(i>=0&&i<w.cells.length){cells[w.cells[i]].inp.focus();return cells[w.cells[i]]}}
function done(){return Object.values(cells).every(o=>o.inp.value===o.ch)}
function say(t,bad){const s=$('status');s.textContent=t;s.classList.toggle('bad',!!bad)}
Object.values(cells).forEach(o=>{
  const inp=o.inp,id=key(o.r,o.c);
  inp.addEventListener('focus',()=>{if(!WORDS[active].cells.includes(id))setActive(o.words[0])});
  inp.addEventListener('mousedown',()=>{if(document.activeElement===inp&&o.words.length>1)setActive(o.words[o.words[0]===active?1:0])});
  inp.addEventListener('input',()=>{const v=inp.value.replace(/[^a-z]/gi,'').slice(-1).toUpperCase();inp.value=v;o.el.classList.remove('wrong');
    if(v){move(o,1);if(done())say('All five. The cloth is finished.')}});
  inp.addEventListener('keydown',e=>{
    if(e.key==='Backspace'&&!inp.value){const p=move(o,-1);if(p){p.inp.value='';e.preventDefault()}}
    const dir={ArrowLeft:[0,-1],ArrowRight:[0,1],ArrowUp:[-1,0],ArrowDown:[1,0]}[e.key];
    if(dir){const t=cells[key(o.r+dir[0],o.c+dir[1])];if(t){e.preventDefault();t.inp.focus()}}
  });
});
$('check').onclick=()=>{let ok=0;
  WORDS.forEach(w=>{if(w.cells.every(i=>cells[i].inp.value===cells[i].ch))ok++});
  Object.values(cells).forEach(o=>o.el.classList.toggle('wrong',!!o.inp.value&&o.inp.value!==o.ch));
  ok===WORDS.length?say('All five. The cloth is finished.'):say(ok+' of '+WORDS.length+' words are right. Wrong letters are marked.',true)};
$('reveal').onclick=()=>{Object.values(cells).forEach(o=>{o.inp.value=o.ch;o.el.classList.remove('wrong')});say('Thread, texture, craft, material, form.')};
$('clear').onclick=()=>{Object.values(cells).forEach(o=>{o.inp.value='';o.el.classList.remove('wrong')});say('')};
setActive(1);

/* ---------- journal ---------- */
const POSTS=[
  ['p10','Dbn_xpsTDe5','Raw fibre on dark wood'],
  ['p09','Db5xp_Uo5Tj','A wooden weaving shuttle'],
  ['p07','Db5yFpmo5cD','A cone of undyed yarn'],
  ['p04','DcQ_4kVKIQ2','Wool shawl cloth'],
  ['p01','Dci4V5cIhCt','Folds of ribbed cloth'],
  ['p05','DcQ_sKnlBGY','Neutrals are never just neutral'],
  ['p03','Dci3orRoJ_3','Loosely woven cloth'],
  ['p11','Dbn_yvcCKN_','The hands behind every piece']
];
POSTS.forEach(p=>{const a=document.createElement('a');a.href='https://www.instagram.com/p/'+p[1]+'/';a.target='_blank';a.rel='noopener';
  a.innerHTML='<div class="im"><img src="img/'+p[0]+'.jpg" alt="'+p[2]+'" loading="lazy"></div><span>'+p[2]+'</span>';$('feed').append(a)});

/* ---------- reels: add {src:'video/name.mp4',poster:'img/name.jpg',label:'...'} entries to show them ---------- */
const REELS=[];
if(REELS.length){const host=$('reels');host.hidden=false;
  REELS.forEach((v,i)=>{const el=document.createElement('video');el.id='reel_'+i;el.src=v.src;if(v.poster)el.poster=v.poster;el.controls=true;el.muted=true;el.loop=true;el.playsInline=true;el.preload='metadata';el.setAttribute('aria-label',v.label||'Reel');host.append(el)})}

/* ---------- copy handle ---------- */
$('copy').onclick=()=>{const b=$('copy'),ok=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy handle',1600)};
  const fall=()=>{const r=document.createRange();r.selectNodeContents($('handle'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press copy'};
  try{navigator.clipboard.writeText('@shajrabymaria').then(ok,fall)}catch(e){fall()}};
})();
