/* gogochinago reading practice - original HSK 1 sentence questions */
(function(){
'use strict';
let session=null;
const bank=()=> (window.HSK_READING_1||[]).filter(q=>!window.HSK_MOCK_RESERVED?.reading?.has(q.id));
const stats=(stage)=>{const qs=bank().filter(q=>stage==null||q.stage===stage), ids=new Set(qs.map(q=>q.id)),last=new Map();for(const a of state.attempts)if(a.type==='reading'&&ids.has(a.readingId))last.set(a.readingId,a);const hits=[...last.values()].filter(a=>a.result==='correct').length;return {total:qs.length,attempted:last.size,correct:hits,pct:qs.length?Math.round(100*hits/qs.length):0}};
window.renderReading=function(){
 state.route='reading';session=null;
 const all=stats();
 show(`${notice()}<h1 class="screen-title">📖 Reading practice</h1><p class="subline">HSK 1 · Learn to understand whole sentences.</p><div class="white-card"><h3>Reading strength · ${all.pct}%</h3><div class="track"><span style="width:${all.pct}%"></span></div><p class="compact-note">${all.attempted} of ${all.total} sentences attempted. Based on your latest answer to each sentence, not vocabulary mastery.</p></div><p class="subline">Choose a difficulty. Each round has 10 multiple-choice translations with explanations after each answer.</p><div class="mode-list">${[[1,'🌱','Getting started','Short, everyday sentences'],[2,'📖','Building confidence','Questions, time and activities'],[3,'🍊','Challenge','Longer sentences and combined ideas']].map(([n,icon,title,detail])=>{const x=stats(n);return `<button class="mode-choice" onclick="startReading(${n})"><span class="mode-icon">${icon}</span><span class="mode-copy"><strong>${title}</strong><small>${detail} · ${x.pct}% strength · ${x.attempted}/${x.total} tried</small></span><span class="arrow">›</span></button>`}).join('')}</div><p class="footer-tip">Original HSK-style learning exercises, not official exam questions. Mock exams will be separate.</p>`);
};
window.startReading=function(level){
 if(![1,2,3].includes(level)||!bank().length)return;
 const all=bank().filter(q=>q.stage===level),last=new Map();for(const a of state.attempts)if(a.type==='reading')last.set(a.readingId,a);
 const ordering=[shuffle(all.filter(q=>!last.has(q.id))),shuffle(all.filter(q=>last.has(q.id)&&last.get(q.id).result!=='correct')),shuffle(all.filter(q=>last.get(q.id)?.result==='correct'))];
 session={level,questions:ordering.flat().slice(0,10).map(q=>({...q,options:shuffle([q.answer,...q.wrong])})),index:0,correct:0,wrong:0,unknown:0,result:null};state.route='readingQuiz';renderReadingQuestion();
};
function renderReadingQuestion(){
 if(!session)return renderReading();
 if(session.index>=session.questions.length)return renderReadingDone();
 const q=session.questions[session.index],pct=100*session.index/session.questions.length;
 show(`<div class="quiz-wrap"><div class="quiz-top"><button class="quit-button" onclick="quitReading()" aria-label="Leave reading practice">×</button><div class="track"><span style="width:${pct}%"></span></div></div><div class="question-num">READING · QUESTION ${session.index+1} OF ${session.questions.length}</div><div class="question-label">What does this sentence mean?</div><div class="question-target" style="min-height:145px"><div class="hanzi" style="font-size:37px;line-height:1.5">${escapeHTML(q.hanzi)}</div></div><div class="answer-options">${q.options.map((option,i)=>`<button class="answer-option" onclick="answerReading(${i})"><span class="letter">${i+1}</span><span style="font-size:15px;font-weight:800">${escapeHTML(option)}</span></button>`).join('')}</div><div class="question-exit"><button onclick="answerReading(-1)">I DON'T KNOW YET</button></div></div>`);
}
window.answerReading=function(choice){
 if(!session||session.result!==null)return;const q=session.questions[session.index],result=choice<0?'unknown':q.options[choice]===q.answer?'correct':'wrong';
 session.result=result;session[result]++;
 state.attempts.push({id:0,readingId:q.id,skill:'reading',type:'reading',result,at:new Date().toISOString()});saveSaved();
 show(`<div class="feedback"><span class="feedback-emoji">${result==='correct'?'🍊':'💛'}</span><h1 class="${result==='correct'?'positive':'negative'}">${result==='correct'?'Correct!':result==='unknown'?"Let's learn it.":'Not quite!'}</h1><div class="feedback-card"><div class="hanzi" style="font-size:35px">${escapeHTML(q.hanzi)}</div><p class="meaning">${escapeHTML(q.answer)}</p><p style="margin:17px 0 0;text-align:left;font-size:13px;color:var(--muted);font-weight:700">💡 ${escapeHTML(q.note)}</p></div><button class="btn btn-primary btn-big" onclick="nextReadingQuestion()">${session.index+1===session.questions.length?'SEE RESULTS':'CONTINUE'}</button></div>`);
};
window.nextReadingQuestion=function(){if(!session)return;session.index++;session.result=null;renderReadingQuestion()};
window.quitReading=function(){session=null;renderReading()};
function renderReadingDone(){
 if(!session)return renderReading();const r=session,total=r.questions.length,score=Math.round(100*r.correct/total);
 show(`<div class="feedback"><span class="feedback-emoji">📖</span><h1>Reading complete!</h1><p class="subline">Keep building your sentence comprehension.</p><div class="score-card"><p>YOUR SCORE</p><strong>${score}%</strong><p>${r.correct} correct · ${r.wrong} incorrect · ${r.unknown} don't know</p><div class="track"><span style="width:${score}%"></span></div></div><button class="btn btn-primary btn-big" onclick="startReading(${r.level})">ANOTHER ROUND</button><div style="height:14px"></div><button class="btn btn-white btn-full" onclick="renderReading()">BACK TO READING</button></div>`);session=null;
}
})();
