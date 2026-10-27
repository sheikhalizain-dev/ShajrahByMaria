(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('copy'))return;
/* ---------- copy handle ---------- */
$('copy').onclick=()=>{const b=$('copy'),ok=()=>{b.textContent='Copied';setTimeout(()=>b.textContent='Copy handle',1600)};
  const fall=()=>{const r=document.createRange();r.selectNodeContents($('handle'));const s=getSelection();s.removeAllRanges();s.addRange(r);b.textContent='Selected, press copy'};
  try{navigator.clipboard.writeText('@shajrabymaria').then(ok,fall)}catch(e){fall()}};
})();
