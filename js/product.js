(function(){
const $=id=>document.getElementById(id);
const main=$('mainImg'),thumbs=$('thumbs');
if(thumbs)thumbs.querySelectorAll('button').forEach(b=>b.onclick=()=>{
  main.src=b.dataset.src;
  thumbs.querySelectorAll('button').forEach(x=>x.setAttribute('aria-current',x===b));
});
const enq=$('enq'),note=$('enqNote');
if(enq)enq.addEventListener('click',()=>{
  const ok=()=>{note.textContent='Message copied. Paste it into the Instagram chat.'},
        no=()=>{note.textContent='Mention '+enq.dataset.name+' in your message.'};
  try{navigator.clipboard.writeText(enq.dataset.msg).then(ok,no)}catch(e){no()}
});
})();
