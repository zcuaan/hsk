/* Shared HSK 1 learning helpers. All pinyin comes from the app's syllabus
   vocabulary rows; never guess a reading for an unknown character. */
(function(){
'use strict';

function levelOneEntries(){
 const vocab=new Set((state.levelEntries||[]).filter(x=>Number(x.level)===1).map(x=>Number(x.vocabulary_id)));
 // Preview has only 15 words; a missing reading should remain missing.
 return (state.allWords||[]).filter(w=>vocab.has(Number(w.id))&&w.simplified&&w.pinyin);
}
function lexicon(){
 const map=new Map();
 for(const w of levelOneEntries())if(!map.has(w.simplified))map.set(w.simplified,String(w.pinyin));
 return [...map].sort((a,b)=>[...b[0]].length-[...a[0]].length);
}
function lexicalTokens(hanzi){
 const characters=Array.from(hanzi),words=lexicon();
 const dp=new Array(characters.length+1).fill(null);dp[characters.length]=[];
 for(let i=characters.length-1;i>=0;i--){
  for(const [written,pinyin] of words){
   const chars=Array.from(written),slice=characters.slice(i,i+chars.length).join('');
   if(slice===written&&dp[i+chars.length]!==null){
    dp[i]=[{text:written,pinyin},...dp[i+chars.length]];break;
   }
  }
 }
 return dp[0];
}
function readingPinyin(text){
 const pieces=String(text||'').match(/[\p{Script=Han}]+|[^\p{Script=Han}]+/gu)||[];
 const parts=[];
 for(const p of pieces){
  if(/[\p{Script=Han}]/u.test(p)){
   const tokens=lexicalTokens(p);
   if(!tokens)return null;
   parts.push(tokens.map(t=>t.pinyin).join(' '));
  }else{
   parts.push(p.replace(/，/g,',').replace(/。/g,'.').replace(/？/g,'?').replace(/！/g,'!').replace(/；/g,';').replace(/：/g,':'));
  }
 }
 return parts.join('').replace(/\s+([,.!?;:])/g,'$1').trim();
}
// Divide slow listening into short meaningful groups, not just at punctuation.
// SpeechSynth voices on some phones ignore changes to rate, so the extra pauses
// between groups create an audible distinction from normal playback.
function slowSpeechChunks(sentence){
 const clauses=String(sentence||'').match(/[^，。！？；]+[，。！？；]?/gu)||[];
 const segments=[];
 for(const clause of clauses){
  const match=clause.match(/^([^，。！？；]+)([，。！？；]?)$/u);
  if(!match){segments.push(clause);continue}
  const body=match[1],punct=match[2],tokens=lexicalTokens(body);
  const units=tokens?tokens.map(t=>t.text):Array.from(body);
  let current='';
  for(const unit of units){
   if(current&&Array.from(current).length+Array.from(unit).length>4){
    segments.push(current);current='';
   }
   current+=unit;
  }
  if(current)segments.push(current+punct);
  else if(punct&&segments.length)segments[segments.length-1]+=punct;
 }
 return segments.filter(Boolean);
}
window.hskReadingPinyin=readingPinyin;
window.hskSlowSpeechChunks=slowSpeechChunks;
})();
