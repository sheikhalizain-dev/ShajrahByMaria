(function(){
const $=id=>document.getElementById(id),reduce=matchMedia('(prefers-reduced-motion: reduce)').matches,p2=n=>String(n).padStart(2,'0');
if(!$('feed'))return;
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
})();
