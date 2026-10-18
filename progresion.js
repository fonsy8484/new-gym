'use strict';
(function(){
let lastHTML='';
const TOP=12,BOT=8,DEF=35;
const inc=m=>/Barra|Rack|Polea|Jalón|Remo|Curl femoral/.test(m||'')?2.5:2;
const sw=n=>{a.startWeights=a.startWeights||{};if(a.startWeights[n]==null)a.startWeights[n]=DEF;return a.startWeights[n]};
function lastWeight(n){for(const s of a.history){const v=(s.exercisesData||[]).find(e=>match(e,n));const st=(v&&v.sets||[]).filter(valid);if(st.length){const ws=st.map(s=>num(s.weight)).filter(x=>x>0);if(ws.length)return Math.max(...ws)}}return null}
function box(){let b=document.querySelector('#progress-advice');if(!b){b=document.createElement('div');b.id='progress-advice';b.className='exercise-info';b.style.marginTop='12px';const info=document.querySelector('#exercise-info');if(info)info.after(b);else document.querySelector('#exercise-screen .exercise-hero').after(b)}return b}
function render(){
 if(!document.querySelector('#exercise-screen').classList.contains('active'))return;
 const n=ids()[current],e=get(n),b=box();
 if(e.seconds){const h='<b>PESO INICIAL</b><br>Este ejercicio se registra por tiempo, no por peso.';if(h!==lastHTML){b.innerHTML=h;lastHTML=h}return}
 const x=entry(),base=lastWeight(n)??sw(n);
 document.querySelectorAll('#set-list input[data-field="weight"]').forEach(i=>{if(!i.value)i.value=base});
 const done=x.sets.filter(valid),reps=done.map(s=>num(s.reps)),ws=done.map(s=>num(s.weight)).filter(v=>v>0);
 const w=ws.length?Math.max(...ws):base;
 let msg;
 if(!done.length)msg='Empieza con <b>'+base+' kg</b>. Marca cada serie completada para recibir la recomendación.';
 else if(reps.some(r=>r<BOT))msg='Mantén <b>'+w+' kg</b>. Consigue al menos '+BOT+' reps en todas las series antes de subir.';
 else if(reps.every(r=>r>=TOP))msg='¡Objetivo conseguido! La próxima sesión sube a <b>'+(w+inc(e.m))+' kg</b>.';
 else msg='Buen trabajo: mantén <b>'+w+' kg</b> e intenta llegar a '+TOP+' reps en todas las series.';
 const h='<b>PROGRESIÓN</b><br>'+msg+'<br><label style="display:block;margin-top:8px">Peso inicial: <input id="start-weight" type="number" min="0" step="0.5" value="'+sw(n)+'" style="width:90px"></label>';
 if(h!==lastHTML){b.innerHTML=h;lastHTML=h;const si=document.querySelector('#start-weight');if(si)si.onchange=()=>{a.startWeights[n]=num(si.value);save();lastHTML='';render()}}
}
new MutationObserver(render).observe(document.body,{childList:true,subtree:true,characterData:true});
document.addEventListener('input',e=>{if(e.target.closest&&e.target.closest('#set-list'))setTimeout(render,60)});
document.addEventListener('click',e=>{if(e.target.closest&&e.target.closest('[data-check]'))setTimeout(render,60)});
})();