(function(){
const BASE=(document.currentScript&&document.currentScript.src||'').replace(/js\/cart\.js.*$/,'');
const KEY='shajra-cart',IG='https://ig.me/m/shajrabymaria';
/* Set a WhatsApp number in international format without + (for example '923001234567') to show a button that opens WhatsApp with the order already typed in. */
const WA='923144778804';
const IGI='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.2" cy="6.8" r=".6" fill="currentColor"/></svg>',WAI='<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3.5 20.5l1.4-4.3A8.5 8.5 0 1 1 8 19.3l-4.5 1.2z"/><path d="M9.2 8.3c-.3 1.9 2.7 6 6.4 6.4l1.3-1.5-2.2-1-1 .8c-1.2-.5-2.2-1.5-2.7-2.7l.8-1-1-2.2-1.6 1.2z"/></svg>';
const pkr=n=>'PKR '+n.toLocaleString('en-US');
const $=id=>document.getElementById(id);
let items={};
try{items=JSON.parse(localStorage.getItem(KEY)||'{}')||{}}catch(e){items={}}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(items))}catch(e){}};
const root=document.createElement('div');
root.innerHTML='<div class="cscrim" hidden></div><aside class="cdrawer" id="cdrawer" role="dialog" aria-modal="true" aria-label="Shopping cart" hidden><div class="chead"><h2>Your cart</h2><button type="button" data-cart-close>Close</button></div><div class="clines" id="clines"></div><div class="cfoot2" id="cfoot2"></div></aside>';
document.body.append(...root.children);
const scrim=document.querySelector('.cscrim'),drawer=$('cdrawer');
const count=()=>Object.values(items).reduce((a,i)=>a+i.q,0);
const total=()=>Object.values(items).reduce((a,i)=>a+i.q*i.price,0);
function badge(){const n=count();document.querySelectorAll('[data-cart-count]').forEach(b=>{b.textContent=n;b.hidden=false})}
function render(){
  const L=$('clines'),F=$('cfoot2'),ks=Object.keys(items);
  if(!ks.length){L.innerHTML='<p class="cempty">Your cart is empty.</p>';F.innerHTML='<a class="bt" href="'+BASE+'shop.html">Continue shopping</a>';return}
  L.innerHTML=ks.map(k=>{const i=items[k];return '<div class="cline"><img src="'+BASE+i.img+'" alt=""><div><b>'+i.n+'</b><span>'+i.t+'</span><span>'+pkr(i.price)+(i.unit?' '+i.unit:'')+'</span>'
    +'<div class="qty"><button type="button" data-q="-1" data-k="'+k+'" aria-label="Decrease">&minus;</button><output>'+i.q+'</output><button type="button" data-q="1" data-k="'+k+'" aria-label="Increase">+</button><button class="rm" type="button" data-rm="'+k+'">Remove</button></div></div><span class="lt">'+pkr(i.q*i.price)+'</span></div>'}).join('');
  F.innerHTML='<div class="ctot"><span>Total</span><b>'+pkr(total())+'</b></div><p class="cnote">No payment is taken on this site. Send your order on WhatsApp or Instagram and we will confirm the details with you.</p>'+(WA?'<a class="bt solid" id="cwa" target="_blank" rel="noopener" href="https://wa.me/'+WA+'?text='+encodeURIComponent(msg())+'">'+WAI+'Send order on WhatsApp</a>':'')+'<button class="bt'+(WA?'':' solid')+'" id="corder" type="button">'+IGI+'Send order on Instagram</button><span class="enq-note" id="cnote" aria-live="polite"></span>';
  $('corder').onclick=order;
}
function msg(){const ks=Object.keys(items);return 'Hello Shajra, I would like to order:\n'+ks.map(k=>'- '+items[k].q+' x '+items[k].n+' ('+items[k].t+') '+pkr(items[k].price)+(items[k].unit?' '+items[k].unit:'')).join('\n')+'\nTotal: '+pkr(total())}
function order(){
  const m=msg();
  const note=$('cnote'),ok=()=>{note.textContent='Order copied. Paste it into the Instagram chat.'},no=()=>{note.textContent='Open the chat and list the pieces in your cart.'};
  try{navigator.clipboard.writeText(m).then(ok,no)}catch(e){no()}
  window.open(IG,'_blank','noopener');
}
function show(o){drawer.hidden=scrim.hidden=!o;document.body.style.overflow=o?'hidden':'';if(o)render()}
document.addEventListener('click',e=>{
  const t=e.target.closest('button');if(!t)return;
  if(t.hasAttribute('data-add')){const k=t.dataset.add;
    if(items[k])items[k].q++;else items[k]={n:t.dataset.n,t:t.dataset.t,price:+t.dataset.price,unit:t.dataset.unit,img:t.dataset.img,q:1};
    save();badge();const old=t.textContent;t.textContent='Added';t.classList.add('done');setTimeout(()=>{t.textContent=old;t.classList.remove('done')},1100);show(true);return}
  if(t.hasAttribute('data-cart-open'))return show(true);
  if(t.hasAttribute('data-cart-close'))return show(false);
  if(t.dataset.q){const i=items[t.dataset.k];i.q+=+t.dataset.q;if(i.q<1)delete items[t.dataset.k];save();badge();render()}
  if(t.dataset.rm){delete items[t.dataset.rm];save();badge();render()}
});
scrim.addEventListener('click',()=>show(false));
addEventListener('keydown',e=>{if(e.key==='Escape'&&!drawer.hidden)show(false)});
badge();
})();
