(function(){
const $=id=>document.getElementById(id);
const grid=document.querySelector('.pgrid'),cards=[...grid.children];
let filter='All',sort='featured';
const by={featured:(a,b)=>a.dataset.order-b.dataset.order,plh:(a,b)=>a.dataset.price-b.dataset.price,phl:(a,b)=>b.dataset.price-a.dataset.price,az:(a,b)=>a.dataset.name.localeCompare(b.dataset.name)};
function apply(){
  let n=0;[...cards].sort(by[sort]).forEach(c=>{const on=filter==='All'||c.dataset.cat===filter;c.hidden=!on;if(on)n++;grid.append(c)});
  $('count').textContent=n+(n===1?' piece':' pieces')+(filter==='All'?'':' in '+filter.toLowerCase());
}
$('sort').onchange=e=>{sort=e.target.value;apply()};
$('filterBtn').onclick=()=>{const f=$('filters');f.hidden=!f.hidden;$('filterBtn').setAttribute('aria-expanded',!f.hidden)};
$('filters').querySelectorAll('button').forEach(b=>b.onclick=()=>{filter=b.dataset.f;$('filters').querySelectorAll('button').forEach(x=>x.setAttribute('aria-pressed',x===b));apply()});
const setView=l=>{grid.classList.toggle('list',l);$('vList').setAttribute('aria-pressed',l);$('vGrid').setAttribute('aria-pressed',!l);try{localStorage.setItem('shajra-view',l?'list':'grid')}catch(e){}};
$('vGrid').onclick=()=>setView(false);$('vList').onclick=()=>setView(true);
try{if(localStorage.getItem('shajra-view')==='list')setView(true)}catch(e){}
})();
