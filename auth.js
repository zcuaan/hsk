/* gogochinago HSK-only account layer.
   Supabase Auth manages sessions/passwords. No secrets or other Qs databases. */
'use strict';
const account = { client:null,user:null,profile:null,revision:null,loading:null,recovery:false,needsSetup:false,syncTimer:0,syncChain:Promise.resolve(),syncBlocked:false,saveStatus:'',authMode:'login' };
const authRoot = document.getElementById('auth-root');
const appHeader = document.querySelector('.app-header');
const appMain = document.getElementById('app');

function authEmailRedirect() {
  if (!/^https?:$/.test(location.protocol)) throw Error('Open the hosted app (HTTPS) to use email links.');
  return location.origin + location.pathname;
}
function switchToAuth(mode) {
  account.authMode = mode;
  account.needsSetup = mode === 'setup';
  appHeader.classList.add('hidden');
  appMain.classList.add('hidden');
  authRoot.classList.remove('hidden');
  const heading = {login:'Welcome back 🍊', signup:'Join gogochinago 🍊',
    forgot:'Reset your password', reset:'Set a new password', setup:'Your Chinese goals 🍊',
    loading:'Just a moment…'}[mode] || 'Welcome';
  const intro = {login:'Sign in to pick up where you left off.', signup:'Save your HSK vocabulary progress across devices.',
    forgot:"We'll email you a link to choose a new password.",
    reset:'Choose a new password for your account.',
    setup:'A quick setup, then straight into practice.'}[mode] || '';
  let form = '';
  if (mode === 'login' || mode === 'signup') {
    const signUp = mode === 'signup';
    form = '<form id="account-auth-form" class="auth-form">' +
      (signUp ? '<label for="auth-name">Name (optional)</label><input id="auth-name" maxlength="60" class="auth-input" autocomplete="name" placeholder="Your name">' : '') +
      '<label for="auth-email">Email</label><input id="auth-email" class="auth-input" type="email" autocomplete="email" required placeholder="you@example.com">' +
      '<label for="auth-password">Password</label>' + passwordField('auth-password',signUp?'new-password':'current-password') +
      (signUp ? '<label for="auth-confirm">Confirm password</label>' + passwordField('auth-confirm','new-password') : '') +
      '<button id="auth-submit" class="btn btn-primary btn-big" type="submit">' + (signUp?'CREATE ACCOUNT':'SIGN IN') + '</button></form>' +
      '<div class="auth-actions">' +
      (signUp ? '<button type="button" data-auth-view="login">Already registered? Sign in</button>' :
        '<button type="button" data-auth-view="forgot">Forgot password?</button><button type="button" data-auth-view="signup">Create account</button>') +
      '</div>';
  } else if (mode === 'forgot') {
    form = '<form id="account-auth-form" class="auth-form"><label for="auth-email">Email</label><input id="auth-email" class="auth-input" type="email" autocomplete="email" required placeholder="you@example.com"><button id="auth-submit" class="btn btn-primary btn-big" type="submit">SEND RESET LINK</button></form><div class="auth-actions"><button type="button" data-auth-view="login">Back to sign in</button></div>';
  } else if (mode === 'reset') {
    form = '<form id="account-auth-form" class="auth-form"><label for="auth-password">New password</label>' + passwordField('auth-password','new-password') +
      '<label for="auth-confirm">Confirm new password</label>' + passwordField('auth-confirm','new-password') +
      '<button id="auth-submit" class="btn btn-primary btn-big" type="submit">UPDATE PASSWORD</button></form>';
  } else if (mode === 'setup') {
    const guest = legacyGuestData();
    const name = String(account.user?.user_metadata?.display_name || '').slice(0,60);
    form = '<form id="account-auth-form" class="auth-form"><label for="setup-name">What should we call you? (optional)</label><input id="setup-name" class="auth-input" maxlength="60" autocomplete="nickname" value="' + escapeHTML(name) + '" placeholder="Your name">' +
      '<label for="setup-level">Your target HSK level</label><select id="setup-level" class="auth-input">' +
      Array.from({length:9},(_,i)=>'<option value="'+(i+1)+'">HSK '+(i+1)+(i===0?' · Available now':' · Future content')+'</option>').join('') +
      '</select><p class="auth-help">Only HSK 1 vocabulary is available so far. You can set any long-term target.</p>' +
      '<label for="setup-daily">Daily practice goal</label><select id="setup-daily" class="auth-input">' +
      [5,10,15,20,30].map(n=>'<option value="'+n+'"'+(n===10?' selected':'')+'>'+n+' questions per day</option>').join('') +
      '</select>' +
      (guest ? '<label class="import-row"><input id="setup-import" type="checkbox"> Import previous practice saved on this device</label>' : '') +
      '<button id="auth-submit" class="btn btn-primary btn-big" type="submit">START LEARNING</button></form>';
  }
  authRoot.innerHTML = '<div class="auth-layout"><div class="auth-brand"><span aria-hidden="true">🍊</span><strong>gogochinago</strong><small>HSK 1–9</small></div><div class="auth-card"><h1>'+heading+'</h1><p>'+intro+'</p>' +
    form + '<p class="auth-message" id="auth-message" role="status" aria-live="polite"></p></div>' +
    '<p class="auth-privacy">Your progress is saved privately to your account.</p></div>';
  authRoot.querySelectorAll('[data-auth-view]').forEach(b=>b.addEventListener('click',()=>switchToAuth(b.dataset.authView)));
  authRoot.querySelectorAll('[data-toggle-password]').forEach(b=>b.addEventListener('click',()=>toggleMonkeyPassword(b)));
  document.getElementById('account-auth-form')?.addEventListener('submit',submitAuthForm);
}
function passwordField(id,autocomplete) {
  return '<div class="password-field"><input id="'+id+'" class="auth-input" type="password" minlength="8" required autocomplete="'+autocomplete+'" placeholder="At least 8 characters">' +
    '<button class="monkey-button" data-toggle-password="'+id+'" type="button" aria-label="Show password" aria-pressed="false" title="Show password">🙈</button></div>';
}
function toggleMonkeyPassword(btn) {
  const input=document.getElementById(btn.dataset.togglePassword);
  if(!input)return;
  const revealing=input.type==='password';
  input.type=revealing?'text':'password';
  btn.textContent=revealing?'🐵':'🙈';
  btn.setAttribute('aria-label',revealing?'Hide password':'Show password');
  btn.setAttribute('title',revealing?'Hide password':'Show password');
  btn.setAttribute('aria-pressed',String(revealing));
  input.focus();
}
function authMessage(message,isError=false) {
  const el=document.getElementById('auth-message');
  if(el){el.textContent=message;el.classList.toggle('auth-error',isError)}
}
function authPending(busy) {
  const btn=document.getElementById('auth-submit');
  if(btn)btn.disabled=busy;
}
async function submitAuthForm(ev) {
  ev.preventDefault();
  const mode=account.authMode;
  const email=document.getElementById('auth-email')?.value.trim() || '';
  const password=document.getElementById('auth-password')?.value || '';
  const confirm=document.getElementById('auth-confirm')?.value || '';
  if ((mode==='signup'||mode==='reset') && password!==confirm){authMessage("The passwords don't match yet.",true);return}
  if (password && password.length<8){authMessage('Please use at least 8 characters.',true);return}
  authPending(true);authMessage('');
  try {
    if(mode==='login'){
      const {data,error}=await account.client.auth.signInWithPassword({email,password});
      if(error)throw error;
      if(data.user)await enterSignedIn(data.user);
    } else if(mode==='signup'){
      const name=(document.getElementById('auth-name')?.value || '').trim().slice(0,60);
      const {data,error}=await account.client.auth.signUp({email,password,options:{
        emailRedirectTo:authEmailRedirect(),data:{display_name:name}
      }});
      if(error)throw error;
      if(data.session && data.user)await enterSignedIn(data.user);
      else authMessage('Check your inbox for the confirmation email, then come back to sign in. 🍊');
    } else if(mode==='forgot'){
      const {error}=await account.client.auth.resetPasswordForEmail(email,{redirectTo:authEmailRedirect()});
      if(error)throw error;
      authMessage('If an account exists for this email, a password reset link is on its way. Check spam too.');
    } else if(mode==='reset'){
      const {error}=await account.client.auth.updateUser({password});
      if(error)throw error;
      account.recovery=false;
      const {data}=await account.client.auth.getUser();
      if(data.user)await enterSignedIn(data.user);
      else {switchToAuth('login');authMessage('Password updated. Please sign in.')}
    } else if(mode==='setup'){
      await finishAccountSetup();
    }
  }catch(err){console.warn('Account action unsuccessful:',err);authMessage(err?.message || 'Something went wrong. Try again.',true)}
  finally{authPending(false)}
}
function legacyGuestData() {
  try{
    const val=JSON.parse(localStorage.getItem(STORE)||'null');
    return val && typeof val==='object' && (Object.keys(val.progress||{}).length || Object.keys(val.flashRatings||{}).length || (val.attempts||[]).length) ? val:null;
  }catch{return null}
}
function snapshotState(){
  return {progress:state.progress||{},flash_ratings:state.flashRatings||{},
    attempts:(state.attempts||[]).slice(-800),xp:Math.max(0,Math.floor(Number(state.xp)||0))};
}
function applySnapshot(data){
  state.progress=data?.progress && typeof data.progress==='object' && !Array.isArray(data.progress)?data.progress:{};
  const ratings=data?.flash_ratings || data?.flashRatings;
  state.flashRatings=ratings && typeof ratings==='object' && !Array.isArray(ratings)?ratings:{};
  state.attempts=Array.isArray(data?.attempts)?data.attempts.slice(-800):[];
  state.xp=Number.isSafeInteger(data?.xp)?Math.max(0,data.xp):0;
}
function resetLearner(){
  state.progress={};state.attempts=[];state.flashRatings={};state.xp=0;
  state.route='home';state.loaded=false;state.quiz=null;state.flash=null;
  state.words=[];state.allWords=[];state.levelEntries=[];state.selectedLevel=1;state.lessons=[];state.lessonItems=[];state.audio.clear();state.characterRefs.clear();
}
async function enterSignedIn(user) {
  if(account.recovery || !user?.id)return;
  if(account.loading)return account.loading;
  if(account.user?.id===user.id && state.loaded)return;
  account.loading=(async()=>{
    appHeader.classList.add('hidden');appMain.classList.add('hidden');authRoot.classList.remove('hidden');
    authRoot.innerHTML='<div class="auth-layout"><div class="auth-brand">🍊 <strong>gogochinago</strong></div><p class="auth-wait">Loading your account…</p></div>';
    const {data:verified,error:verifyError}=await account.client.auth.getUser();
    if(verifyError||verified?.user?.id!==user.id)throw verifyError || Error('Could not verify this session.');
    const [pref,record]=await Promise.all([
      account.client.from('hsk_user_profiles').select('display_name,target_level,daily_goal_questions').eq('user_id',user.id).maybeSingle(),
      account.client.from('hsk_user_app_state').select('progress,flash_ratings,attempts,xp,revision').eq('user_id',user.id).maybeSingle()
    ]);
    if(pref.error)throw pref.error;
    if(record.error)throw record.error;
    account.user=user;account.profile=pref.data;
    account.revision=record.data?.revision??null;account.syncBlocked=false;
    resetLearner();
    if(record.data)applySnapshot(record.data);
    else {try{const cache=JSON.parse(localStorage.getItem(STORE+':'+user.id)||'null');if(cache)applySnapshot(cache)}catch{}}
    window.hskAccountUser=user;
    if(!account.profile){switchToAuth('setup');return}
    await showLearner();
  })().catch(err=>{
    console.error('Could not load HSK account',err);
    switchToAuth('loading');
    authRoot.querySelector('.auth-card')?.insertAdjacentHTML('beforeend','<button class="btn btn-primary btn-full" id="retry-account">RETRY</button>');
    document.getElementById('retry-account')?.addEventListener('click',()=>{account.loading=null;enterSignedIn(user)});
    authMessage(err?.message || 'Could not load your account.',true);
  }).finally(()=>{account.loading=null});
  return account.loading;
}
async function showLearner(){
  authRoot.classList.add('hidden');
  appHeader.classList.remove('hidden');appMain.classList.remove('hidden');
  if(!state.loaded)await bootstrap();
  else go('home');
  account.saveStatus='Your progress syncs to this account.';
}
async function finishAccountSetup(){
  if(!account.user)throw Error('Please sign in again.');
  const target=Number(document.getElementById('setup-level')?.value);
  const daily=Number(document.getElementById('setup-daily')?.value);
  const name=(document.getElementById('setup-name')?.value || '').trim().slice(0,60);
  if(!Number.isInteger(target)||target<1||target>9||![5,10,15,20,30].includes(daily))throw Error('Choose a valid HSK target and daily goal.');
  const importing=!!document.getElementById('setup-import')?.checked;
  const {data,error}=await account.client.from('hsk_user_profiles').upsert({
    user_id:account.user.id,display_name:name||null,target_level:target,daily_goal_questions:daily,updated_at:new Date().toISOString()
  },{onConflict:'user_id'}).select('display_name,target_level,daily_goal_questions').single();
  if(error)throw error;
  account.profile=data;
  if(importing && account.revision===null){const prev=legacyGuestData();if(prev)applySnapshot(prev)}
  await showLearner();
  if(importing)window.hskAccountSave();
}
function persistDeviceSnapshot(payload){
  if(!account.user)return;
  try{localStorage.setItem(STORE+':'+account.user.id,JSON.stringify(payload))}
  catch(e){console.warn('Could not cache progress locally',e)}
}
function queueCloudSave(){
  if(!account.user||!account.profile||account.syncBlocked||!state.loaded)return;
  clearTimeout(account.syncTimer);
  account.syncTimer=setTimeout(()=>enqueueCloudSave(),600);
}
function enqueueCloudSave(){
  clearTimeout(account.syncTimer);
  if(!account.user||!account.profile||account.syncBlocked)return;
  const userId=account.user.id;
  account.syncChain=account.syncChain.catch(()=>{}).then(async()=>{
    if(!account.user || account.user.id!==userId || account.syncBlocked)return;
    const payload=snapshotState();
    let r;
    if(account.revision===null){
      r=await account.client.from('hsk_user_app_state').insert({
        user_id:userId,progress:payload.progress,flash_ratings:payload.flash_ratings,
        attempts:payload.attempts,xp:payload.xp,revision:1
      }).select('revision').single();
    }else{
      r=await account.client.from('hsk_user_app_state').update({
        progress:payload.progress,flash_ratings:payload.flash_ratings,
        attempts:payload.attempts,xp:payload.xp,revision:account.revision+1,
        updated_at:new Date().toISOString()
      }).eq('user_id',userId).eq('revision',account.revision).select('revision').maybeSingle();
      if(!r.error && !r.data)throw Error('This account was updated on another device. Your changes are safe on this device; refresh to review the newer cloud data.');
    }
    if(r.error)throw r.error;
    account.revision=r.data.revision;
    account.saveStatus='☁️ Progress saved';
    const el=document.getElementById('cloud-sync-status');if(el)el.textContent=account.saveStatus;
  }).catch(err=>{
    console.warn('Cloud progress not saved',err);
    account.syncBlocked=true;
    account.saveStatus='⚠️ Cloud sync paused: '+err.message;
    const el=document.getElementById('cloud-sync-status');if(el)el.textContent=account.saveStatus;
  });
}
window.hskAccountSave=function(){
  if(!account.user)return;
  persistDeviceSnapshot(snapshotState());
  queueCloudSave();
};
async function signOutAccount(){
  if(account.syncTimer)enqueueCloudSave();
  await account.syncChain.catch(()=>{});
  await account.client.auth.signOut();
  clearTimeout(account.syncTimer);
  account.user=null;account.profile=null;account.revision=null;
  account.syncBlocked=false;window.hskAccountUser=null;resetLearner();
  switchToAuth('login');
}
function accountView(){
  if(!account.user || !account.profile)return switchToAuth('login');
  state.route='account';
  const p=account.profile;
  show('<div class="header-back"><button class="back" onclick="go(\'home\')">← BACK HOME</button></div>'+
    '<h1 class="screen-title">Your account 🍊</h1><p class="subline">'+escapeHTML(account.user.email||'')+'</p>'+
    '<form class="white-card account-settings" id="settings-form">'+
    '<label for="account-name">Name</label><input class="auth-input" id="account-name" maxlength="60" value="'+escapeHTML(p.display_name||'')+'">'+
    '<label for="account-target">HSK target</label><select class="auth-input" id="account-target">'+Array.from({length:9},(_,i)=>'<option value="'+(i+1)+'"'+(p.target_level===i+1?' selected':'')+'>HSK '+(i+1)+(i?' (coming soon)':'')+'</option>').join('')+'</select>'+
    '<p class="auth-help">Currently practising HSK 1 vocabulary; more levels are coming.</p>'+
    '<label for="account-daily">Daily question goal</label><select class="auth-input" id="account-daily">'+[5,10,15,20,30].map(n=>'<option value="'+n+'"'+(p.daily_goal_questions===n?' selected':'')+'>'+n+' questions</option>').join('')+'</select>'+
    '<button class="btn btn-primary btn-full" type="submit">SAVE GOALS</button><p id="profile-message" role="status" class="auth-message"></p></form>'+
    '<div class="white-card"><p class="compact-note" id="cloud-sync-status">'+escapeHTML(account.saveStatus||'☁️ Progress saved to your account')+'</p>'+
    '<button type="button" class="btn btn-white btn-full" id="logout-button">SIGN OUT</button></div>');
  document.getElementById('settings-form').addEventListener('submit',saveAccountGoals);
  document.getElementById('logout-button').addEventListener('click',signOutAccount);
}
async function saveAccountGoals(e){
  e.preventDefault();
  const name=document.getElementById('account-name').value.trim().slice(0,60);
  const target=Number(document.getElementById('account-target').value);
  const daily=Number(document.getElementById('account-daily').value);
  const msg=document.getElementById('profile-message');
  msg.textContent='Saving…';
  const {data,error}=await account.client.from('hsk_user_profiles').update({
    display_name:name||null,target_level:target,daily_goal_questions:daily,updated_at:new Date().toISOString()
  }).eq('user_id',account.user.id).select('display_name,target_level,daily_goal_questions').single();
  if(error){msg.textContent=error.message;return}
  account.profile=data;msg.textContent='Goals saved! 🍊';
}
window.hskAccountView=accountView;
window.hskDailyGoal=function(){return account.profile?.daily_goal_questions || 10};
window.hskTargetLevel=function(){return account.profile?.target_level || 1};
async function initializeHSKAccounts(){
  if(!window.supabase?.createClient){switchToAuth('login');authMessage('Could not load the account service. Check your connection.',true);return}
  account.client=window.supabase.createClient(HSK_URL,HSK_PUBLIC_KEY,{auth:{
    persistSession:true,autoRefreshToken:true,detectSessionInUrl:true,
    storageKey:'gogochinago-hsk-auth'
  }});
  window.hskClient=account.client;
  account.recovery=/(?:^|[&#])type=recovery(?:&|$)/.test(location.hash);
  account.client.auth.onAuthStateChange((event,session)=>{
    if(event==='PASSWORD_RECOVERY'){account.recovery=true;switchToAuth('reset');return}
    if(event==='SIGNED_OUT'){if(account.user){account.user=null;account.profile=null;window.hskAccountUser=null;resetLearner();switchToAuth('login')}return}
    if(event==='SIGNED_IN' && session?.user && !account.recovery)
      setTimeout(()=>{if(account.user?.id!==session.user.id)enterSignedIn(session.user)},0);
  });
  switchToAuth('loading');
  try{
    const {data,error}=await account.client.auth.getSession();
    if(error)throw error;
    if(account.recovery){switchToAuth('reset');return}
    if(data?.session?.user)await enterSignedIn(data.session.user);
    else {const view=new URLSearchParams(location.search).get('view');switchToAuth(view==='signup'?'signup':'login');}
  }catch(err){switchToAuth('login');authMessage(err.message||'Cannot reach the account service.',true)}
}
initializeHSKAccounts();
