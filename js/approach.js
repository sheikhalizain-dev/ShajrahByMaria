(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('apA'))return;
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

STEPS.forEach((s,i)=>{const b=document.createElement('button');b.type='button';b.setAttribute('aria-label','Step '+(i+1)+': '+s[1]);b.onclick=()=>showStep(i);$('apDots').append(b)});
$('apPrev').onclick=()=>showStep(ai-1);$('apNext').onclick=()=>showStep(ai+1);
(function(){const el=document.querySelector('.apc');let x0=null;el.addEventListener('touchstart',e=>{x0=e.touches[0].clientX},{passive:true});el.addEventListener('touchend',e=>{if(x0==null)return;const d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)showStep(ai+(d<0?1:-1));x0=null})})();
showStep(0);
})();
