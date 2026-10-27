(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('clg'))return;
/* ---------- cloth cards ---------- */
const CLOTHS=[['p04','Diamond lattice','Taupe cloth with a raised diamond pattern','50% 50%'],['p01','Fine rib','Sand-coloured cloth with a fine vertical rib','50% 50%'],['p03','Open plain weave','Loosely woven sand-coloured cloth','50% 50%'],['p02','Ivory stripe','Brown woven swatch with ivory stripes','50% 90%']];
CLOTHS.forEach((c,i)=>{const a=document.createElement('a');a.className='cc';a.href='https://www.instagram.com/shajrabymaria/';a.target='_blank';a.rel='noopener';
  a.innerHTML='<span class="no">'+p2(i+1)+'</span><div class="im"><img src="img/'+c[0]+'.jpg" alt="'+c[2]+'" style="object-position:'+c[3]+'" loading="lazy"></div><h3>'+c[1]+'</h3>';$('clg').append(a)});
})();
