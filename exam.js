/* HSK 1 exam-style mock, original questions based on the app's HSK 1 banks.
   Not an official HSK paper or an official readiness prediction. */
(function(){
'use strict';
let run=null;
const escape=s=>escapeHTML(s);
const banks=()=>({reading:window.HSK_READING_1||[],listening:window.HSK_LISTENING_1||[]});
const shuffleCopy=a=>shuffle(a.slice());
const storage=()=>state.attempts.filter(a=>a.type==='mock_exam'&&a.examVersion==='hsk1-v1');
const percent=(n,d)=>d?Math.round(100*n/d):0;
const MAX_MOCKS=2;
function unlock(){const a=state.attempts,reading=a.filter(x=>x.type==='reading'),listening=a.filter(x=>x.type==='listening_comprehension');const latest=arr=>{const m=new Map();for(const x of arr)m.set(x.readingId||x.listeningId,x);return [...m.values()]};const r=latest(reading),l=latest(listening);const accuracy=items=>items.length?Math.round(100*items.filter(x=>x.result==='correct').length/items.length):0;const vocab=Object.values(state.progress||{}).filter(x=>x&&typeof x.mastery==='number');const mastered=vocab.filter(x=>x.mastery>=60).length;return {r:r.length,l:l.length,rAccuracy:accuracy(r),lAccuracy:accuracy(l),mastered,ready:r.length>=30&&l.length>=24&&accuracy(r)>=75&&accuracy(l)>=75&&mastered>=60}}

const EXAM_MINUTES=40;
let clock=null;
function stopClock(){if(clock!==null){clearInterval(clock);clock=null}}
function timeLeft(){if(!run)return '40:00';const sec=Math.max(0,Math.ceil((run.deadline-Date.now())/1000));return String(Math.floor(sec/60)).padStart(2,'0')+':'+String(sec%60).padStart(2,'0')}
function updateClock(){if(!run){stopClock();return}const node=document.getElementById('exam-clock');if(node)node.textContent=timeLeft();if(Date.now()>=run.deadline){stopClock();finish()}}
function beginClock(){stopClock();clock=setInterval(updateClock,1000)}
function makeQuestions(){
 const b=banks();
 const reading=shuffleCopy(b.reading.filter(q=>q.stage<=2)).slice(0,15).concat(shuffleCopy(b.reading.filter(q=>q.stage===3)).slice(0,5)).map(q=>({...q,section:'reading'}));
 const listening=shuffleCopy(b.listening.filter(q=>q.stage<=2)).slice(0,15).concat(shuffleCopy(b.listening.filter(q=>q.stage===3)).slice(0,5)).map(q=>({...q,section:'listening'}));
 return [...listening,...reading].map(q=>({...q,options:shuffleCopy([q.answer,...q.wrong])}));
}
window.renderExam=function(){
 state.route='exam';run=null;window.stopHSKListening?.();
 const attempts=storage(),last=attempts.at(-1),u=unlock(),available=u.ready&&attempts.length<MAX_MOCKS;
 show(`${notice()}<h1 class="screen-title">📝 HSK 1 Mock Exam</h1><p class="subline">Test your listening and reading in one sitting.</p><div class="white-card"><h3>40 questions · 20 listening + 20 reading</h3><p class="compact-note">An original, HSK-inspired practice test. Questions are drawn from the exercises in this app, so it is <strong>not</strong> an unseen or official HSK exam. A 40-minute practice timer is included, but this is not an official pass prediction.</p><p class="compact-note">Chinese transcripts and correct answers stay hidden until you finish. You can replay the audio.</p>${last?`<p class="compact-note"><strong>Last completed mock:</strong> ${last.score}% · Listening ${last.listeningScore}% · Reading ${last.readingScore}%</p>`:''}<p class="compact-note"><strong>Unlock requirements:</strong> 30 reading sentences and 24 listening prompts attempted, at least 75% latest-answer accuracy in each, and 60 vocabulary skill scores at 60%+ mastery.</p><p class="compact-note">📖 ${u.r}/30 (${u.rAccuracy}%) · 🎧 ${u.l}/24 (${u.lAccuracy}%) · 🧠 ${u.mastered}/60 vocabulary skill scores</p><p class="compact-note">${attempts.length}/${MAX_MOCKS} mock attempts used. ${attempts.length>=MAX_MOCKS?'All mock attempts completed.':available?'Unlocked!':'Keep practising to unlock.'}</p></div><button class="btn btn-primary btn-big" onclick="startExam()" ${available?'':'disabled'}>${attempts.length>=MAX_MOCKS?'MOCK COMPLETED':available?'START MOCK EXAM':'🔒 MOCK LOCKED'}</button><p class="footer-tip">You can leave at any time. Only finished mocks are saved.</p>`);
};
window.startExam=function(){
 if(!unlock().ready||storage().length>=MAX_MOCKS)return renderExam();
 if(!window.speechSynthesis||!window.SpeechSynthesisUtterance){show('<div class="notice">This mock needs Mandarin speech playback. Please open it in a browser with speech synthesis support.</div><button class="btn btn-white btn-full" onclick="renderExam()">BACK</button>');return}
 const questions=makeQuestions();if(questions.length!==40)return;
 run={questions,index:0,answers:[],startedAt:new Date().toISOString(),deadline:Date.now()+EXAM_MINUTES*60000,locked:false,playToken:0};state.route='examQuiz';beginClock();draw();
};
function speak(q,slow){
 window.stopHSKListening?.();
 if(!window.speechSynthesis||!window.SpeechSynthesisUtterance)return;
 const voices=window.speechSynthesis.getVoices?.()||[],v=voices.find(x=>/^zh[-_]CN/i.test(x.lang))||voices.find(x=>/^zh/i.test(x.lang));
 const parts=q.parts||[],token=(run.playToken=(run.playToken||0)+1);
 function next(i){if(!run||run.playToken!==token||i>=parts.length)return;
 const utterance=new SpeechSynthesisUtterance(parts[i]);utterance.lang='zh-CN';utterance.rate=slow?.68:.84;if(v)utterance.voice=v;
 utterance.onend=()=>{if(run&&run.playToken===token)next(i+1)};window.speechSynthesis.speak(utterance)}
 window.speechSynthesis.cancel();next(0);
}
window.playExam=function(slow=false){if(run&&run.questions[run.index]?.section==='listening')speak(run.questions[run.index],slow)};
function draw(){
 if(!run)return renderExam();
 if(run.index===run.questions.length)return finish();
 if(Date.now()>=run.deadline)return finish();
 const q=run.questions[run.index],n=run.index+1,pct=percent(run.index,run.questions.length),audio=q.section==='listening';
 const prompt=audio?`<div style="font-size:54px">🎧</div><button class="audio-button" onclick="playExam()">🔊 Play audio</button><button class="small-link" onclick="playExam(true)">🐢 Play slowly</button><p class="compact-note">Listen before answering. The transcript is hidden.</p>`:`<div class="hanzi" style="font-size:34px;line-height:1.5">${escape(q.hanzi)}</div>`;
 show(`<div class="quiz-wrap"><div class="quiz-top"><button class="quit-button" onclick="leaveExam()" aria-label="Exit mock exam">×</button><div class="track"><span style="width:${pct}%"></span></div></div><div class="question-num">MOCK EXAM · ${audio?'🎧 LISTENING':'📖 READING'} · ${n} / 40 · <span id="exam-clock">${timeLeft()}</span> remaining</div><div class="question-label">${escape(audio?q.question:'What does this sentence mean?')}</div><div class="question-target" style="min-height:170px">${prompt}</div><div class="answer-options">${q.options.map((o,i)=>`<button class="answer-option" onclick="answerExam(${i})"><span class="letter">${i+1}</span><span style="font-size:15px;font-weight:800">${escape(o)}</span></button>`).join('')}</div><div class="question-exit"><button onclick="answerExam(-1)">SKIP QUESTION</button></div></div>`);
}
window.answerExam=function(i){
 if(!run||run.locked)return;
 if(Date.now()>=run.deadline){finish();return}
 run.locked=true;const q=run.questions[run.index];
 if(q.section==='listening'){run.playToken=(run.playToken||0)+1;window.speechSynthesis?.cancel()}
 run.answers.push({id:q.id,section:q.section,correct:i>=0&&q.options[i]===q.answer,skipped:i<0,chosen:i>=0?q.options[i]:null});
 run.index++;run.locked=false;draw();
};
window.leaveExam=function(){stopClock();if(run){run.playToken=(run.playToken||0)+1;window.speechSynthesis?.cancel()}run=null;renderExam()};
function finish(){
 if(!run)return;
 stopClock();run.playToken++;window.speechSynthesis?.cancel();
 while(run.answers.length<run.questions.length){const q=run.questions[run.answers.length];run.answers.push({id:q.id,section:q.section,correct:false,skipped:true,chosen:null})}
 const a=run.answers,l=a.filter(x=>x.section==='listening'),r=a.filter(x=>x.section==='reading');
 const ls=percent(l.filter(x=>x.correct).length,20),rs=percent(r.filter(x=>x.correct).length,20),score=percent(a.filter(x=>x.correct).length,40);
 state.attempts.push({type:'mock_exam',skill:'mock_exam',examVersion:'hsk1-v1',result:'complete',score,listeningScore:ls,readingScore:rs,at:new Date().toISOString()});
 saveSaved();
 const missed=run.questions.filter(q=>!a.find(x=>x.id===q.id&&x.correct));
 run=null;state.route='examResult';
 show(`<div class="feedback"><span class="feedback-emoji">📝</span><h1>Mock complete!</h1><div class="score-card"><p>YOUR PRACTICE SCORE</p><strong>${score}%</strong><p>${a.filter(x=>x.correct).length} of 40 correct</p><div class="track"><span style="width:${score}%"></span></div></div><div class="white-card"><h3>🎧 Listening: ${ls}%</h3><h3>📖 Reading: ${rs}%</h3><p class="compact-note">These are practice scores, not an official HSK pass prediction.</p></div><h3>Review ${missed.length} missed questions</h3>${missed.slice(0,20).map(q=>`<div class="white-card" style="margin:10px 0;text-align:left"><strong>${q.section==='listening'?'🎧':'📖'} ${escape(q.parts?q.parts.join(' / '):q.hanzi)}</strong><p>${escape(q.answer)}</p><p class="compact-note">${escape(q.note)}</p></div>`).join('')}<button class="btn btn-primary btn-big" onclick="renderExam()">BACK TO MOCK EXAMS</button></div>`);
}
})();
