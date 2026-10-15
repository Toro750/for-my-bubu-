/* 1 Initialization */
(function(){'use strict';
var D=document,reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
var scenes=[].slice.call(D.querySelectorAll('.scene')),dots=[].slice.call(D.querySelectorAll('.dots a'));
var bar=D.querySelector('.bar'),label=D.getElementById('plabel'),prog=D.querySelector('.progress');
function pad(n){return n<10?'0'+n:''+n}
/* 2 Scroll progress (real scroll position) */
var ticking=false;
function update(){ticking=false;var max=D.documentElement.scrollHeight-innerHeight;
var p=max>0?Math.min(1,Math.max(0,scrollY/max)):0;bar.style.transform='scaleX('+p+')';
prog.setAttribute('aria-valuenow',Math.round(p*100));}
function onScroll(){if(!ticking){ticking=true;requestAnimationFrame(update)}}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);addEventListener('orientationchange',onScroll);update();
/* 3 Active scene tracking */
function setActive(i){label.textContent='OUR LITTLE SKY · '+pad(i)+' / 10';
dots.forEach(function(d,k){d.classList.toggle('on',k===i-1)})}
setActive(1);
if('IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting)setActive(+e.target.dataset.index)})},{rootMargin:'-45% 0px -45% 0px'});
scenes.forEach(function(s){io.observe(s)});
/* 4 Reveal effects */
var ro=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target)}})},{threshold:.15});
D.querySelectorAll('.reveal').forEach(function(r){ro.observe(r)});
}else{D.querySelectorAll('.reveal').forEach(function(r){r.classList.add('in')})}
/* 6 Atmosphere: stars and clouds (lightweight, generated once) */
var st=D.getElementById('stars'),frag=D.createDocumentFragment(),i;
for(i=0;i<70;i++){var s=D.createElement('i');s.className='star';var z=Math.random();
s.style.cssText='left:'+Math.random()*100+'%;top:'+Math.random()*80+'%;opacity:'+(.4+z*.6)+';transform:scale('+(.6+z*1.4)+');animation-duration:'+(2+Math.random()*4)+'s;animation-delay:-'+Math.random()*5+'s';frag.appendChild(s)}
st.appendChild(frag);
['c1','c2'].forEach(function(id){var el=D.getElementById(id),h='';
for(var k=0;k<6;k++){h+='<svg viewBox="0 0 160 60" style="margin-top:'+(k%3)*14+'px;transform:scale('+(.8+(k%3)*.25)+')"><use href="#cloud"/></svg>'}
el.innerHTML=h});
/* Shooting stars: occasional */
var m=D.querySelector('.meteor'),mt;
function shoot(){if(!D.hidden&&!reduce){m.style.top=(5+Math.random()*30)+'%';m.style.left=(Math.random()*40)+'%';m.classList.remove('go');void m.offsetWidth;m.classList.add('go')}
mt=setTimeout(shoot,7000+Math.random()*9000)}
mt=setTimeout(shoot,3500);
/* 5,7,8 Interactions */
function note(btn,text){var n=btn.closest('.panel').querySelector('.note');n.textContent=text}
D.querySelectorAll('[data-note]').forEach(function(b){b.addEventListener('click',function(){note(b,b.dataset.note)})});
D.querySelectorAll('.lantern').forEach(function(b){b.addEventListener('click',function(){b.classList.toggle('bright');note(b,'Warm light, just for you.')})});
var env=D.querySelector('.envelope'),let_=D.getElementById('letter-body');
if(env){env.addEventListener('click',function(){var open=let_.hidden;let_.hidden=!open;env.setAttribute('aria-expanded',open);env.textContent=open?'Close the envelope':'Open the envelope'})}
/* 9 Performance: pause meteors when hidden */
D.addEventListener('visibilitychange',function(){if(D.hidden)clearTimeout(mt);else mt=setTimeout(shoot,3000)});
/* 10 Reduced motion: CSS handles it; content stays fully visible */
})();