(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('psImg'))return;
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
})();
