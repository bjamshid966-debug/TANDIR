(function(){
const $=id=>document.getElementById(id);
const BREADS=[
{n:"Samarqand patiri",g:"yumshoq",t:"06:30",d:"Qalin, yumshoq, ustiga zira sepiladi.",m:"Sutli xamirdan, 8 daqiqa pishadi. Choy bilan eng yaxshi."},
{n:"Obi non",g:"yumshoq",t:"10:00",d:"Katta, yumaloq, tilla rangli.",m:"Palov va sho'rva yoniga olinadi. Ikki kungacha yumshoqligicha qoladi."},
{n:"Lochira",g:"qatlam",t:"14:00",d:"Yupqa, oson sinadigan, qatlamli non.",m:"Yog'li xamirdan; bir necha soat ichida yeyilgani yaxshi."},
{n:"Qatlama non",g:"qatlam",t:"14:00",d:"Piyozli, ko'p qavatli, xushbo'y.",m:"Qatlamlar orasiga yog' surtiladi, issiqligida mazali."},
{n:"Gijda",g:"quruq",t:"17:30",d:"Kichik, bo'rtib pishadigan, qattiq non.",m:"Bir haftagacha saqlanadi, sayohat uchun qulay."},
{n:"Kulcha",g:"quruq",t:"17:30",d:"Yupqa, qarsildoq; choyga qo'shib yeyiladi.",m:"Mayiz va yong'oq qo'shilgan turi ham bor."}
];
const list=$('list');
function render(f){
 list.innerHTML='';
 BREADS.filter(b=>f==='all'||b.g===f).forEach(b=>{
  const r=document.createElement('button');r.className='row';
  r.innerHTML='<h3>'+b.n+'</h3><span class="time">'+b.t+'</span><p>'+b.d+'</p><p class="more">'+b.m+'</p>';
  r.onclick=()=>r.classList.toggle('open');list.appendChild(r);
 });
}
render('all');
document.querySelectorAll('.chip').forEach(c=>c.onclick=()=>{
 document.querySelectorAll('.chip').forEach(x=>x.classList.remove('on'));c.classList.add('on');render(c.dataset.f);
});
BREADS.forEach(b=>$('typeSel').add(new Option(b.n,b.n)));
const SLOTS=["06:30","10:00","14:00","17:30"];
SLOTS.forEach(s=>$('slotSel').add(new Option(s+" da tortilgan non",s)));

/* next batch clock */
function tick(){
 const n=new Date(),m=n.getHours()*60+n.getMinutes();
 let next=SLOTS.map(s=>{const [h,mm]=s.split(':');return +h*60+ +mm}).find(x=>x>m),tom=false;
 if(next===undefined){next=390;tom=true}
 const diff=next-m+(tom?1440:0),h=Math.floor(diff/60),mm=diff%60;
 const hh=String(Math.floor(next/60)).padStart(2,'0'),mi=String(next%60).padStart(2,'0');
 $('clock').innerHTML='Keyingi issiq non: <b>'+hh+':'+mi+'</b>'+(tom?' (ertaga)':'')+', '+(h?h+' soat ':'')+mm+' daqiqadan keyin';
}
tick();setInterval(tick,30000);

/* scroll gauge */
const steps=[...document.querySelectorAll('#steps li')];
function onScroll(){
 let t=20;
 steps.forEach(li=>{const r=li.getBoundingClientRect();if(r.top<innerHeight*.6){li.classList.add('on');t=+li.dataset.t}else li.classList.remove('on')});
 $('merc').style.height=(t/400*100)+'%';
 $('merc').style.width=(window.innerWidth<=720?(t/400*100)+'%':'');
 $('deg').textContent=t+'°';
}
addEventListener('scroll',onScroll,{passive:true});addEventListener('resize',onScroll);onScroll();

/* dough calc */
function calc(){
 const n=+$('cnt').value,k=+$('kind').value;$('o1').textContent=n;
 const un=Math.round(n*250*k);
 $('r1').textContent=un;$('r2').textContent=Math.round(un*.56);
 $('r3').textContent=Math.round(un*.02);$('r4').textContent=Math.round(un*.016);
}
['cnt','kind'].forEach(i=>$(i).addEventListener('input',calc));calc();

/* form */
$('form').addEventListener('submit',e=>{
 e.preventDefault();const f=e.target;let ok=true;
 const rules={
  name:v=>v.trim().length>=2||"Ismingizni kiriting",
  phone:v=>v.replace(/\D/g,'').length===12&&v.replace(/\D/g,'').startsWith('998')||"Telefon +998 bilan 12 raqam bo'lishi kerak",
  qty:v=>(+v>=1&&+v<=100)||"1 dan 100 gacha son kiriting"};
 Object.keys(rules).forEach(k=>{
  const el=f.elements[k],r=rules[k](el.value),msg=r===true?'':r;
  el.classList.toggle('bad',!!msg);el.parentElement.querySelector('em').textContent=msg;if(msg)ok=false;
 });
 $('ok').textContent=ok?f.elements.name.value.trim()+', buyurtmangiz qabul qilindi. '+f.elements.slot.value+' da nonlar tayyor bo\'ladi.':'';
 if(ok)f.reset();
});

/* embers */
const cv=$('fire'),cx=cv.getContext('2d'),still=matchMedia('(prefers-reduced-motion:reduce)').matches;
let W,H,P=[],mx=null,my=null,t=0;
function resize(){const d=devicePixelRatio||1;W=cv.clientWidth;H=cv.clientHeight;cv.width=W*d;cv.height=H*d;cx.setTransform(d,0,0,d,0,0)}
function spawn(){return{x:Math.random()*W,y:H+10,vx:(Math.random()-.5)*.6,vy:-(.6+Math.random()*1.8),r:1+Math.random()*2.6,l:1,d:.002+Math.random()*.004}}
function move(e){const b=cv.getBoundingClientRect(),p=e.touches?e.touches[0]:e;mx=p.clientX-b.left;my=p.clientY-b.top}
addEventListener('mousemove',move);addEventListener('touchmove',move,{passive:true});
addEventListener('resize',resize);resize();
if(still)for(let i=0;i<120;i++){const p=spawn();p.y=Math.random()*H;P.push(p)}
function draw(){
 t+=.02;cx.clearRect(0,0,W,H);
 const g=cx.createLinearGradient(0,H,0,H*.35);
 g.addColorStop(0,'rgba(255,90,31,.55)');g.addColorStop(.4,'rgba(180,50,10,.2)');g.addColorStop(1,'rgba(20,17,16,0)');
 cx.fillStyle=g;cx.beginPath();cx.moveTo(0,H);
 for(let x=0;x<=W;x+=20)cx.lineTo(x,H*.78+Math.sin(x*.01+t*2)*18+Math.sin(x*.027+t*3)*8);
 cx.lineTo(W,H);cx.fill();
 if(!still){
  if(P.length<220)for(let i=0;i<3;i++)P.push(spawn());
  P.forEach(p=>{
   if(mx!==null){const dx=mx-p.x,dy=my-p.y,d=Math.hypot(dx,dy);if(d<220&&d>1){p.vx+=dx/d*.05;p.vy+=dy/d*.03}}
   p.x+=p.vx+Math.sin(t+p.y*.02)*.3;p.y+=p.vy;p.l-=p.d*3;p.vx*=.99;
  });
  P=P.filter(p=>p.l>0&&p.y>-20);
 }
 P.forEach(p=>{
  cx.fillStyle='rgba('+(255)+','+Math.round(90+p.l*110)+','+Math.round(p.l*40)+','+Math.max(p.l,.15)+')';
  cx.beginPath();cx.arc(p.x,p.y,p.r*Math.max(p.l,.3),0,6.28);cx.fill();
 });
 if(!still)requestAnimationFrame(draw);
}
draw();
})();
