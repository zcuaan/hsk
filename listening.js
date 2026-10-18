/* gogochinago HSK 1 listening comprehension */
(function(){
'use strict';
let session=null, playbackToken=0, timer=null;
const bank=()=>window.HSK_LISTENING_1||[];
const safe=s=>escapeHTML(s);
function stop(){playbackToken++;if(timer){clearTimeout(timer);timer=null}try{window.speechSynthesis?.cancel()}catch(e){}}
function history(){return state.attempts.filter(a=>a.type==='listening_comprehension'&&typeof a.listeningId==='string')}
function stats(stage){
 const qs=bank().filter(q=>stage==null||q.stage===stage),ids=new Set(qs.map(q=>q.id)),last=new Map();
 for(const a of history())if(ids.has(a.listeningId))last.set(a.listeningId,a);
 return {attempted:last.size,total:qs.length,pct:qs.length?Math.round(100*[...last.values()].filter(a=>a.result==='correct').length/qs.length):0};
}
function voiceSupport(){return !!(window.speechSynthesis&&window.SpeechSynthesisUtterance)}
function voiceHint(){return voiceSupport()?'Tap Play to listen. If your device has no Mandarin voice, audio may not play correctly.':'Speech playback is not supported in this browser. Try Safari, Chrome or another browser with Mandarin text-to-speech.'}
window.renderListening=function(){
 stop();session=null;state.route='listening';
 const all=stats();
 show(`${notice()}<h1 class="screen-title">🎧 Listening practice</h1><p class="subline">HSK 1 · Listen first, read the Chinese afterwards.</p><div class="white-card"><h3>Listening comprehension · ${all.pct}%</h3><div class="track"><span style="width:${all.pct}%"></span></div><p class="compact-note">${all.attempted} of ${all.total} recordings attempted · latest answers count. Separate from vocabulary mastery.</p></div><div class="notice">${safe(voiceHint())}</div><div class="mode-list">${[[1,'🔊','Short sentences','Hear a sentence and choose its meaning'],[2,'🎯','Everyday messages','Listen for times, places and details'],[3,'🗣️','Mini-conversations','Follow two speakers and answer a question']].map(([level,icon,title,desc])=>{const x=stats(level);return `<button class="mode-choice" onclick="startListening(${level})" ${voiceSupport()?'':'disabled'}><span class="mode-icon">${icon}</span><span class="mode-copy"><strong>${title}</strong><small>${desc} · ${x.pct}% strength · ${x.attempted}/${x.total} tried</small></span><span class="arrow">›</span></button>`}).join('')}</div><p class="footer-tip">Original HSK-style learning exercises, not official HSK exam recordings.</p>`);
};
window.startListening=function(stage){
 if(!voiceSupport()||![1,2,3].includes(stage))return;
 stop();const all=bank().filter(q=>q.stage===stage),last=new Map();
 for(const a of history())last.set(a.listeningId,a);
 const sorted=[shuffle(all.filter(q=>!last.has(q.id))),shuffle(all.filter(q=>last.has(q.id)&&last.get(q.id).result!=='correct')),shuffle(all.filter(q=>last.get(q.id)?.result==='correct'))].flat();
 session={stage,questions:sorted.slice(0,Math.min(10,sorted.length)).map(q=>({...q,options:shuffle([q.answer,...q.wrong])})),index:0,correct:0,wrong:0,unknown:0,result:null,plays:0};
 state.route='listeningQuiz';renderQuestion();
};
function speech(text,rate,token,onEnd){
 if(token!==playbackToken)return;
 const u=new SpeechSynthesisUtterance(text);u.lang='zh-CN';u.rate=rate;u.pitch=1;
 const voices=window.speechSynthesis.getVoices?.()||[];
 const mandarin=voices.find(v=>/^zh(-|_)CN/i.test(v.lang))||voices.find(v=>/^zh/i.test(v.lang));
 if(mandarin)u.voice=mandarin;
 u.onend=()=>{if(token===playbackToken)onEnd()};
 u.onerror=()=>{if(token===playbackToken){const hint=document.getElementById('listen-audio-status');if(hint)hint.textContent='Playback was interrupted. Try Play again.'}};
 window.speechSynthesis.speak(u);
}
window.playListening=function(slow=false){
 if(!session||session.result!==null)return;
 stop();const q=session.questions[session.index],token=playbackToken;
 session.plays++;
 const hint=document.getElementById('listen-audio-status');
 if(hint)hint.textContent=slow?'Playing slowly…':'Playing…';
 const parts=q.parts,rate=slow?.67:.84;
 const next=i=>{
  if(token!==playbackToken)return;
  if(i>=parts.length){const label=document.getElementById('listen-audio-status');if(label)label.textContent='Finished · Tap to replay';return}
  speech(parts[i],rate,token,()=>{if(i+1<parts.length)timer=setTimeout(()=>next(i+1),550);else next(i+1)});
 };
 next(0);
};
function renderQuestion(){
 if(!session)return renderListening();
 if(session.index>=session.questions.length)return renderDone();
 const q=session.questions[session.index],pct=Math.round(100*session.index/session.questions.length);
 show(`<div class="quiz-wrap"><div class="quiz-top"><button class="quit-button" onclick="quitListening()" aria-label="Leave listening practice">×</button><div class="track"><span style="width:${pct}%"></span></div></div><div class="question-num">LISTENING · QUESTION ${session.index+1} OF ${session.questions.length}</div><div class="question-label">${safe(q.question)}</div><div class="question-target" style="min-height:170px"><span style="font-size:57px" aria-hidden="true">🎧</span><button class="audio-button" style="min-height:62px;padding:12px 24px;font-size:19px" type="button" onclick="playListening(false)">🔊 Play</button><button class="small-link" type="button" onclick="playListening(true)">🐢 Play slowly</button><div class="subtitle" role="status" id="listen-audio-status">Listen before choosing an answer</div></div><div class="answer-options">${q.options.map((option,i)=>`<button class="answer-option" type="button" onclick="answerListening(${i})"><span class="letter">${i+1}</span><span style="font-size:15px;font-weight:800">${safe(option)}</span></button>`).join('')}</div><div class="question-exit"><button type="button" onclick="answerListening(-1)">I DON'T KNOW YET</button></div></div>`);
}
window.answerListening=function(choice){
 if(!session||session.result!==null)return;
 stop();const q=session.questions[session.index],result=choice<0?'unknown':q.options[choice]===q.answer?'correct':'wrong';
 session.result=result;session[result]++;
 state.attempts.push({id:0,listeningId:q.id,skill:'listening_comprehension',type:'listening_comprehension',result,at:new Date().toISOString()});
 saveSaved();
 show(`<div class="feedback"><span class="feedback-emoji">${result==='correct'?'🍊':'💛'}</span><h1 class="${result==='correct'?'positive':'negative'}">${result==='correct'?'Correct!':result==='unknown'?"Let's learn it.":'Not quite!'}</h1><div class="feedback-card"><div class="hanzi" style="font-size:32px;line-height:1.5">${q.parts.map(safe).join('<br>')}</div><p class="meaning">${safe(q.answer)}</p><p style="margin:17px 0 0;text-align:left;font-size:13px;color:var(--muted);font-weight:700">💡 ${safe(q.note)}</p></div><button class="btn btn-primary btn-big" onclick="nextListening()">${session.index+1===session.questions.length?'SEE RESULTS':'CONTINUE'}</button></div>`);
};
window.nextListening=function(){if(!session)return;stop();session.index++;session.result=null;renderQuestion()};
window.quitListening=function(){stop();session=null;renderListening()};
function renderDone(){
 stop();if(!session)return renderListening();
 const r=session,score=Math.round(100*r.correct/r.questions.length);
 show(`<div class="feedback"><span class="feedback-emoji">🎧</span><h1>Listening complete!</h1><p class="subline">You're training your ear for real Chinese.</p><div class="score-card"><p>YOUR SCORE</p><strong>${score}%</strong><p>${r.correct} correct · ${r.wrong} incorrect · ${r.unknown} don't know</p><div class="track"><span style="width:${score}%"></span></div></div><button class="btn btn-primary btn-big" onclick="startListening(${r.stage})">ANOTHER ROUND</button><div style="height:14px"></div><button class="btn btn-white btn-full" onclick="renderListening()">BACK TO LISTENING</button></div>`);session=null;
}
window.stopHSKListening=stop;
})();
