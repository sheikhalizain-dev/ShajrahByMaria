(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('grid'))return;
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
})();
