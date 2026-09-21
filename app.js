
'use strict';
// First-act adaptation. Source rules: visible Performance, hidden Self/Life.
// Replying changes plans only; actual activities apply stat changes once.
const STORAGE_KEY = 'unsaved-work-log.act1.v4';
const PREVIOUS_KEY = 'unsaved-work-log.act1.v3';
const LEGACY_KEY = 'unsaved-work-log.act1.v1';
const icons = {
 dashboard:'<rect x="3" y="3" width="7" height="7" rx="1.6"/><rect x="14" y="3" width="7" height="7" rx="1.6"/><rect x="3" y="14" width="7" height="7" rx="1.6"/><rect x="14" y="14" width="7" height="7" rx="1.6"/>',
 work:'<rect x="3" y="7" width="18" height="14" rx="2"/><path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 12a24 24 0 0 0 18 0M10 12v3h4v-3"/>',
 chat:'<path d="M20 11.5a8 8 0 0 1-8.3 8A10 10 0 0 1 7 18.3L3 20l1.3-4A8 8 0 0 1 3 11.5a8.5 8.5 0 0 1 17 0Z"/><path d="M8 11h.01M12 11h.01M16 11h.01"/>',
 calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 10h18M8 14h2M14 14h2M8 17h2"/>',
 file:'<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z"/><path d="M14 2v6h6M8 12h8M8 16h6"/>',
 clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
 check:'<path d="m5 12 4 4L19 6"/>',
 arrow:'<path d="M4 12h16m-6-6 6 6-6 6"/>',
 chevron:'<path d="m9 5 7 7-7 7"/>',
 reset:'<path d="M3 10a9 9 0 1 1 .6 6M3 4v6h6"/>',
 close:'<path d="m6 6 12 12M18 6 6 18"/>',
 mail:'<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 6 9 7 9-7"/>',
 folder:'<path d="M3 6a2 2 0 0 1 2-2h5l2 3h7a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2Z"/>',
 people:'<circle cx="9" cy="7" r="3"/><path d="M3 21v-3a6 6 0 0 1 12 0v3M16 4a3 3 0 0 1 0 6M18 13a5 5 0 0 1 3 5v3"/>',
 ball:'<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3v18M5.4 5.8a8 8 0 0 1 0 12.4M18.6 5.8a8 8 0 0 0 0 12.4"/>',
 moon:'<path d="M20.8 13A9 9 0 0 1 11 3.2 9 9 0 1 0 20.8 13Z"/>',
 sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M5 5l1.5 1.5M17.5 17.5 19 19M5 19l1.5-1.5M17.5 6.5 19 5"/>',
 save:'<path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2Z"/><path d="M7 3v6h9V3M7 21v-7h10v7"/>',
 search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 5 5"/>',
 info:'<circle cx="12" cy="12" r="9"/><path d="M12 11v6M12 7h.01"/>',
 logout:'<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M10 12h11m-5-5 5 5-5 5"/>',
 chart:'<path d="M3 3v18h18M7 15l4-4 4 2 6-7"/>',
 leaf:'<path d="M20 3c0 12-2 16-8 16a7 7 0 0 1-7-7c0-6 6-5 15-9ZM4 21l10-10"/>'
};
function icon(name,extra=''){return `<svg class="icon ${extra}" viewBox="0 0 24 24" aria-hidden="true">${icons[name]||icons.file}</svg>`;}
function escapeHTML(text){return String(text).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
const tasks=[
 {id:'report',title:'Revise report',desc:'Project report_v3.docx · Review two comments',reward:5,time:'09:30',file:'Project report_v3.docx',symbol:'file'},
 {id:'email',title:'Reply to the client email',desc:'Confirm the updates and send the report attachment.',reward:3,time:'11:10',file:'Re: This week’s project update',symbol:'mail'},
 {id:'archive',title:'Organize project files',desc:'File the approved versions and update the shared folder.',reward:5,time:'14:30',file:'Project files / This week’s archive',symbol:'folder'},
 {id:'meeting',title:'Confirm meeting notes',desc:'Check the discussion points and confirm the follow-up actions.',reward:7,time:'17:20',file:'Monday project meeting · Meeting notes',symbol:'people'}
];
function freshState(){return {
 version:4,stage:'day',clock:'09:00',app:'work',completed:[],performance:0,life:50,
 friendReply:null,overtimeReply:null,inviteSent:false,overtimeOffered:false,overtimeDone:false,
 activity:null,attended:false,notifiedFriend:false,workDirty:true,savedWorkAt:null,savedEntries:[],lastWorkAt:null,
 mondayPerformance:null,migrationNotice:null,computer:null,notifications:[],openingShown:false,
 workMessages:[{id:'work-intro',side:'them',time:'09:00',text:'Morning. The client sent two changes. I’ve marked them in the report. Could you update it before lunch?',attachment:'report'}],
 privateMessages:[{id:'friend-reminder',side:'them',time:'Sunday 22:14',text:'You said we’d play this week. Don’t forget tomorrow night!'}],
 read:{work:0,personal:0},events:[],sequence:0
};}
let storageAvailable=true,storageBlocked=false,loadNotice='';
let state=freshState();
function validSave(p){return p&&[1,3,4].includes(p.version)&&['day','evening','night','tuesday'].includes(p.stage)&&Array.isArray(p.completed)&&new Set(p.completed).size===p.completed.length&&p.completed.every(id=>tasks.some(t=>t.id===id))&&Array.isArray(p.events)&&Array.isArray(p.workMessages)&&Array.isArray(p.privateMessages)&&Array.isArray(p.savedEntries)&&p.read&&Number.isFinite(p.life)&&Number.isFinite(p.performance);}
try{
 const current=localStorage.getItem(STORAGE_KEY),legacy=current?null:(localStorage.getItem(PREVIOUS_KEY)||localStorage.getItem(LEGACY_KEY));
 if(current||legacy){
  const parsed=JSON.parse(current||legacy);
  if(!validSave(parsed))throw new Error('unsupported save');
  state={...freshState(),...parsed};
  if(parsed.version===1){
   state.version=4;state.app=parsed.stage==='tuesday'?'overview':'work';
   state.attended=parsed.activity==='basketball';
   state.notifiedFriend=parsed.friendReply==='no';
   if(parsed.stage==='tuesday'){state.mondayPerformance=parsed.performance;state.performance=0;}
   const next=tasks[state.completed.length];
   if(state.stage==='day'&&next&&state.completed.length){state.workMessages.push({id:'migration-next',side:'them',time:state.clock,text:'Please carry on with this file.',attachment:next.id});}
   state.migrationNotice='Your previous progress has been loaded. The original save is kept separately. Completed tasks and scores have not been counted again.';
  }
  if(parsed.version!==4){state.version=4;state.computer=null;state.notifications=[];state.openingShown=true;state.migrationNotice='Your older progress has been loaded without recalculating anything. The original save is kept separately. See Help for details.';}
  for(const channel of ['work','personal']){const list=channel==='work'?state.workMessages:state.privateMessages;list.forEach((m,i)=>{if(typeof m.read!=='boolean')m.read=m.side==='me'||i<(state.read[channel]||0);});}
 }
}catch(_){storageBlocked=true;loadNotice='Your saved progress could not be loaded. This session is temporary to avoid overwriting it. The original save has not been deleted. Retry in Help or explicitly start over with  v0.4. ';}
EnglishCopy.migrate(state, STORAGE_KEY, storageBlocked);
const ui={app:['work','overview','documents','journal','personal','calendar'].includes(state.app)?state.app:'work',modal:null,checks:{},notifyFriend:true,leaveChoice:null,saveBeforeLeave:true,toastTimer:null,lastFocus:null};

function persist(){
 state.app=ui.app;
 if(!storageBlocked)try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){storageAvailable=false;}
 updateStorageNotice();
}

function updateStorageNotice(){const el=document.getElementById('storage-status');if(el)el.textContent=storageBlocked?'Original save preserved · View help':storageAvailable?'':'Progress cannot be saved right now · View help';}

function addEvent(type,data={}){state.events.push({type,at:state.clock,...data});}
function addMessage(channel,side,text,time=state.clock,id=null,attachment=null){
 const list=channel==='work'?state.workMessages:state.privateMessages;
 if(id&&list.some(m=>m.id===id))return;
 const message={id:id||`message-${++state.sequence}`,side,text,time,attachment,read:side==='me'};
 list.push(message);
 if(side==='them'){
  const quiet=id==='meeting-receipt';
  state.notifications.push({id:message.id,channel,time,text,shown:quiet,dismissed:false,delivered:true});
 }
 persist(); // Message fact reaches storage before any animation.
 if(typeof Desktop!=='undefined')Desktop.scheduleNotifications();
}

function unread(channel){return (channel==='work'?state.workMessages:state.privateMessages).filter(m=>m.side==='them'&&!m.read).length;}

function markRead(channel){if(typeof Desktop!=='undefined')Desktop.readVisible();}

function ensureInvite(){if(state.inviteSent)return;state.inviteSent=true;addMessage('personal','them','Same place at six thirty? I’ll bring the ball. Just come straight over.','17:20','friend-invite');addEvent('invitation_received',{at:'17:20'});}
function offerOvertime(){if(state.overtimeOffered)return;state.overtimeOffered=true;addMessage('work','them','We need the summary tomorrow morning. Have time to put it together tonight? It will count toward extra performance credit.','17:20','overtime-offer','overtime');addEvent('overtime_offered',{at:'17:20'});}
function announce(text){document.getElementById('announcement').textContent=text;}
function toast(text){clearTimeout(ui.toastTimer);document.getElementById('toast-root').innerHTML=`<div class="toast">${icon('check')}<span>${escapeHTML(text)}</span></div>`;ui.toastTimer=setTimeout(()=>{document.getElementById('toast-root').innerHTML='';},4300);}
function canWork(){return state.stage==='day';}
function actualPlanStatus(){
 if(state.activity==='basketball')return 'Attended';
 if(state.activity==='rest')return 'Not attending · Rest at home';
 if(state.activity==='overtime')return state.events.some(e=>e.type==='missed_promise')?'Missed the game':'Not attending';
 return state.friendReply==='yes'?'Confirmed':state.friendReply==='no'?'Cancelled':'Awaiting confirmation';
}
function workEntries(){const entries=tasks.filter(t=>state.completed.includes(t.id)).map(t=>({title:t.title,time:t.time,reward:t.reward}));if(state.overtimeDone)entries.push({title:'Complete the additional summary',time:'19:40',reward:8});return entries;}
function saveWork(){
 if(state.stage==='tuesday'||!state.workDirty)return;
 state.savedEntries=workEntries().map(e=>({...e}));state.savedWorkAt=state.clock;state.workDirty=false;
 addEvent('work_log_saved',{entryCount:state.savedEntries.length});
}

function goApp(app){
 ui.modal=null;renderModal();
 if(['overview','documents','journal','work'].includes(app)){state.computer.officeTab=app;Desktop.openApp('office');}
 else {if(app==='personal')state.computer.conversation='ayuan';Desktop.openApp(app==='personal'?'chat':app);}
}

function scrollChat(){if(typeof Desktop!=='undefined')Desktop.scrollChat(ui.app==='personal'?'chat':'office');}

function openModal(kind,data={}){ui.lastFocus=document.activeElement;ui.modal={kind,...data};ui.checks={};ui.notifyFriend=state.friendReply!=='no';ui.leaveChoice=null;ui.saveBeforeLeave=true;renderModal();}

function closeModal(){ui.modal=null;renderModal();if(ui.lastFocus&&ui.lastFocus.isConnected)ui.lastFocus.focus();}
function showTask(id){Desktop.openDocument(id);}

function completeTask(id){
 const task=tasks.find(t=>t.id===id);
 ui.checks=Desktop.taskChecks(id);
 if(!task||!Desktop.hasTask(id)||!canWork()||state.completed.includes(id)||tasks[state.completed.length]?.id!==id)return;
 if(id==='report'&&(!ui.checks.number||!ui.checks.note))return;
 if(id==='archive'&&!ui.checks.archive)return;
 state.completed.push(id);state.performance+=task.reward;state.clock=task.time;state.lastWorkAt=task.time;state.workDirty=true;
 addEvent('task_completed',{task:id,performanceDelta:task.reward,lifeDelta:0});
 const feedback={
  report:['Both comments in the report have been addressed. The file is submitted.','Received, thanks. Could you send the updated version to the client too?','email'],
  email:['The updated report has been emailed to the client as an attachment.','Great. File the report and the emails in this week’s folder so they’re easy to find later.','archive'],
  archive:['This week’s folder is updated. The report and emails are filed.','Got the folder. I’ve also put the afternoon meeting notes here. Could you check them after the meeting?','meeting'],
  meeting:['The meeting notes are confirmed. All follow-up actions are included.','Got it. That’s everything for today. Thanks.',null]
 };
 const [sent,answer,next]=feedback[id];
 addMessage('work','me',sent,task.time,id+'-submitted');
 addMessage('work','them',answer,task.time,id+'-receipt',next);
 if(id==='meeting'){ensureInvite();offerOvertime();}
 ui.modal=null;persist();render();
 toast(`${id==='email'?'Email sent':id==='archive'?'Files archived':'Submitted'} · Performance +${task.reward}`);
 announce(id==='meeting'?'Today’s performance 20 / 20. There are new messages in both work and private chats.':`${task.title} recorded. Your manager has replied.`);
}

function respondFriend(reply){
 if(!['yes','no','later'].includes(reply)||!state.inviteSent||state.activity||state.stage==='tuesday'||state.friendReply===reply)return;
 const texts={yes:'Yes, see you at six thirty.',no:'I can’t make it tonight. I’ve still got a few things to do.',later:'I’ll decide a little later and let you know.'};
 const answers={yes:'Great, I’ll save you a spot.',no:'Okay, another time. Get some rest when you’re done.',later:'Okay. I’m heading out at six. Let me know when you decide.'};
 addMessage('personal','me',texts[reply]);addMessage('personal','them',answers[reply]);
 state.friendReply=reply;state.notifiedFriend=reply==='no';addEvent('friend_replied',{reply,performanceDelta:0,lifeDelta:0});markRead('personal');persist();render();scrollChat();
}
function respondWork(reply){
 if(!['accepted','deferred'].includes(reply)||!canWork()||!state.overtimeOffered||state.overtimeDone||state.overtimeReply===reply)return;
 addMessage('work','me',reply==='accepted'?'I’ll finish the summary tonight.':'I’ll handle it tomorrow morning at work.');
 addMessage('work','them',reply==='accepted'?'Great, I’ve sent the file. Submit it when you’re done.':'All right. Start with that tomorrow morning.');
 state.overtimeReply=reply;addEvent('overtime_replied',{reply,performanceDelta:0,lifeDelta:0});markRead('work');persist();render();scrollChat();
}
function clockOut(){if(['day','evening'].includes(state.stage)&&!state.activity)openModal('leave');}

function doActivity(activity){
 if(!['day','evening'].includes(state.stage)||state.activity||ui.modal?.kind!=='leave'||!['basketball','rest'].includes(activity))return;
 if(ui.saveBeforeLeave)saveWork();
 addEvent('left_computer',{activity,unfinished:tasks.filter(t=>!state.completed.includes(t.id)).map(t=>t.id),saved:!state.workDirty});
 if(state.overtimeOffered&&state.overtimeReply!=='deferred'){
  addMessage('work','me','I’ll handle it tomorrow morning at work.');addMessage('work','them','All right. Start with that tomorrow morning.');
  state.overtimeReply='deferred';addEvent('overtime_replied',{reply:'deferred',source:'leaving_computer',performanceDelta:0,lifeDelta:0});
 }
 // For an early departure this is an explicit jump to the evening arrangement.
 ensureInvite();state.clock='18:05';
 const prior=state.friendReply;
 if(activity==='basketball'){
  addMessage('personal','me',prior==='yes'?'I’m heading out. See you soon.':'I’m heading out now. I can still make it. See you at six thirty.','18:05');
  addMessage('personal','them',prior==='yes'?'Okay, I’ll wait by the entrance.':'There’s still time. Same place.','18:05');
  state.friendReply='yes';state.notifiedFriend=false;state.attended=true;
  addEvent('friend_replied',{reply:'yes',source:'leaving_computer',performanceDelta:0,lifeDelta:0});
  state.life=Math.min(100,state.life+4);addEvent('basketball_attended',{at:'18:30',lifeDelta:4,performanceDelta:0});
  state.clock='22:10';addMessage('personal','them','That last shot today was pretty good! Same again next week?','22:10','ball-followup');
 }else{
  if(prior!=='no'){
   addMessage('personal','me','I’m a bit tired. I think I’ll stay home and take it easy tonight. Let’s play another time.','18:05');
   addMessage('personal','them','No worries. Have a good rest. We’ll play another time.','18:05');
   addEvent('friend_replied',{reply:'no',source:'leaving_computer',performanceDelta:0,lifeDelta:0});
  }
  state.friendReply='no';state.notifiedFriend=true;state.attended=false;
  addEvent('friend_notified',{at:'18:05',reason:'rest'});
  state.life=Math.min(100,state.life+4);addEvent('rest_taken',{at:'20:30',lifeDelta:4,performanceDelta:0});
  state.clock='21:30';addMessage('personal','them','It was pretty windy tonight. Have a good rest. Come along next time.','21:10','rest-followup');
 }
 state.activity=activity;state.stage='night';ui.modal=null;persist();render();openModal('scene',{activity});
}

function finishOvertime(){
 ui.checks=Desktop.taskChecks('overtime');ui.notifyFriend=Desktop.taskNotify();
 if(!Desktop.hasTask('overtime')||!canWork()||!state.overtimeOffered||state.overtimeDone||state.activity||!ui.checks.overtime)return;
 const wasPromised=state.friendReply==='yes';
 if(state.overtimeReply!=='accepted'){
  addMessage('work','me','I’ll finish the summary tonight.');state.overtimeReply='accepted';
  addEvent('overtime_replied',{reply:'accepted',source:'submission',performanceDelta:0,lifeDelta:0});
 }
 if(ui.notifyFriend&&state.friendReply!=='no'){
  addMessage('personal','me','I can’t make it tonight after all. Something came up at work. Sorry for changing plans.','17:25');
  addMessage('personal','them','All right, I’ll let the others know. Get some rest when you’re done.','17:25');
  state.friendReply='no';state.notifiedFriend=true;
  addEvent('friend_replied',{at:'17:25',reply:'no',source:'before_overtime',performanceDelta:0,lifeDelta:0});
  addEvent('friend_notified',{at:'17:25',reason:'overtime'});
 }else if(wasPromised){
  state.notifiedFriend=false;
  addMessage('personal','them','We’re here. Where are you?','18:35');
  addMessage('personal','them','We saved you a spot but haven’t seen you. I’m going to start playing.','19:10');
  addEvent('missed_promise',{at:'18:30'});
 }else if(state.friendReply!=='no'){
  state.notifiedFriend=false;addMessage('personal','them','We’ve started playing. Are you still coming today?','18:35');
 }
 state.performance+=8;state.life=Math.max(0,state.life-3);state.overtimeDone=true;state.activity='overtime';state.attended=false;state.workDirty=true;state.lastWorkAt='19:40';
 state.clock='19:40';state.stage='night';
 addEvent('overtime_completed',{performanceDelta:8,lifeDelta:-3,notifiedFriend:state.notifiedFriend,attended:false});
 addMessage('work','them','Got the summary. Thanks for staying late. I’ve added the extra performance credit.','19:40','overtime-received');
 addMessage('personal','them',wasPromised&&!state.notifiedFriend?'Just let me know ahead of time next time. Get some rest when you’re done.':'We’ve just finished playing. Get some rest when you’re done. Another time!','19:40','overtime-followup');
 ui.modal=null;persist();render();toast('Summary submitted · Extra performance +8');
}

function endDay(){
 if(state.stage!=='night'||!state.activity||ui.modal?.kind!=='sleep')return;
 if(ui.saveBeforeLeave)saveWork();
 addEvent('day_ended',{activity:state.activity,performance:state.performance,logSaved:!state.workDirty});
 state.mondayPerformance=state.performance;state.performance=0;state.stage='tuesday';state.clock='09:00';
 Desktop.clearWindows();
 addMessage('work','them',state.completed.includes('report')?'Morning. The client added two more comments to yesterday’s report. Could you update it again today?':'Morning. Could you start with those two changes in the report today?','Tuesday 09:00','tuesday-intro');
 if(state.activity==='basketball')addMessage('personal','them','That last shot yesterday was pretty good! Same again next week?','Tuesday 08:52','tuesday-ball');
 ui.app='work';ui.modal=null;persist();render();announce('Tuesday morning, 09:00. Today’s performance target: 25. ');
}

function resetExperience(){
 // Explicit reset preserves the original legacy key and backs up any current v3 save.
 try{const old=localStorage.getItem(STORAGE_KEY);if(old)localStorage.setItem(STORAGE_KEY+'.before-reset',old);}catch(_){storageAvailable=false;}
 storageBlocked=false;loadNotice='';state=freshState();ui.app='work';ui.modal=null;Desktop.newGame();persist();render();
}

function lastIncoming(channel){const a=channel==='work'?state.workMessages:state.privateMessages;return [...a].reverse().find(m=>m.side==='them')||a[0];}
function render(){if(typeof Desktop!=='undefined')Desktop.refreshStory();renderModal();}
function viewHTML(){
 if(ui.app==='work')return chatHTML('work');
 if(ui.app==='personal')return chatHTML('personal');
 if(ui.app==='calendar')return calendarHTML();
 if(ui.app==='journal')return journalHTML();
 if(ui.app==='documents')return documentsHTML();
 if(state.stage==='tuesday')return tuesdayHTML();
 return overviewHTML();
}
function documentsHTML(){
 return `<div class="view-heading"><h1>Project documents</h1><span class="tiny">This week’s shared files</span></div><div class="document-list">${tasks.map((t,i)=>{
 const done=state.completed.includes(t.id),enabled=done||(canWork()&&i===state.completed.length);
 return `<button class="inbox-preview" data-action="task" data-task="${t.id}" ${enabled?'':'disabled'}>${icon(t.symbol)}<span class="inbox-info"><strong>${t.file}</strong><p>${done?'Processed':i===state.completed.length?'Pending':'Waiting for the previous task'}</p></span></button>`;
 }).join('')}${state.overtimeOffered?`<button class="inbox-preview" data-action="task" data-task="overtime" ${canWork()||state.overtimeDone?'':'disabled'}>${icon('file')}<span class="inbox-info"><strong>Morning summary.xlsx</strong><p>${state.overtimeDone?'Submitted':'Pending'}</p></span></button>`:''}</div>`;
}

function performanceHTML(tuesday=false){const p=tuesday?0:state.performance,target=tuesday?25:20;return `<section class="card performance" aria-label="Today’s performance ${p} / ${target}"><div class="perf-head"><span>Today’s performance</span>${icon('chart')}</div><div class="perf-number"><strong>${p}</strong><span>/ ${target}</span></div><div class="progress-track" role="progressbar" aria-label="Daily performance target progress" aria-valuenow="${Math.min(p,target)}" aria-valuemin="0" aria-valuemax="${target}"><div class="progress-fill" style="width:${Math.min(p/target,1)*100}%"></div></div><div class="perf-note"><span>${p>=target?'Daily target reached':'Performance target'}</span><span>${p>target?`Extra +${p-target}`:p>=target?'100%':`${Math.round(p/target*100)}%`}</span></div></section>`;}
function planHTML(){const status=actualPlanStatus();return `<section class="card plan-card"><div class="plan-head"><span>Personal calendar</span><span>${state.stage==='tuesday'?'Yesterday':status}</span></div><div class="plan-main"><div class="ball-icon">${icon('ball')}</div><div><div class="plan-time">18:30</div><div class="plan-name">Basketball with Yuan</div></div></div><p class="plan-place">City Sports Center · Outdoor Court 2${state.stage==='tuesday'?` · ${status}`:''}</p></section>`;}
function inboxPreview(channel){const m=lastIncoming(channel),personal=channel==='personal';return `<button class="inbox-preview" data-action="nav" data-app="${channel}" aria-label="Open ${personal?'Yuan’s private messages':'Your manager’s work messages'}"><span class="avatar ${personal?'friend':''}">${personal?'Y':'M'}</span><span class="inbox-info"><strong>${personal?'Yuan · Private chat':'Manager · Work messages'}</strong><p>${escapeHTML(m.text)}</p></span>${unread(channel)?'<span class="message-pip"></span>':icon('chevron','task-chevron')}</button>`;}
function overviewHTML(){
 const night=state.stage==='night',done=state.completed.length===tasks.length;
 let heading='My tasks';
 let subtitle=done?'Today’s regular tasks are complete.':'This week’s project / Monday tasks';
 return `<div class="welcome"><div><div class="eyebrow">My workspace <span>/</span> This week</div><h1>${heading}</h1><p class="subtext">${subtitle}</p></div><div class="daytag">${icon('calendar')}Monday · Workday</div></div>
 <div class="dashboard"><div class="stack">

 <section class="card"><div class="card-head"><h2 class="card-title">${icon('dashboard')}Today’s tasks</h2><span class="tiny">${state.completed.length} / 4 Complete</span></div><div class="task-table-head"><span>Task name</span><span>Status</span><span>Performance</span></div><div class="tasks">${tasks.map((task,i)=>{const isDone=state.completed.includes(task.id),current=!isDone&&i===state.completed.length&&canWork();return `<button class="task ${isDone?'done':''} ${current?'current':''}" data-action="task" data-task="${task.id}" data-focus="task-${task.id}" ${!isDone&&!current?'disabled':''} aria-label="${task.title}, ${isDone?'Complete':current?'Ready':'Pending'}, performance +${task.reward}"><span class="task-check">${icon(isDone?'check':task.symbol)}</span><span class="task-main"><span class="task-name">${task.title}</span><span class="task-desc">${task.desc}</span></span><span class="task-status ${isDone?'complete':current?'pending':''}">${isDone?'Complete':current?'Pending':'Not started'}</span><span class="task-reward">${isDone?'Credited':`+${task.reward}`}</span>${icon('chevron','task-chevron')}</button>`;}).join('')}</div>${!done&&canWork()?`<div class="task-guidance">${icon('info')}Related files and submission receipts are also kept in your manager’s conversation.</div>`:''}</section>
 ${canWork()&&state.overtimeOffered?`<section class="extra-card"><div class="top"><span class="chip blue">${state.overtimeReply==='deferred'?'Scheduled for tomorrow morning':state.overtimeReply==='accepted'?'Accepted · Not submitted yet':'Optional · New task'}</span><span class="extra-reward">+8</span></div><h3>Prepare tomorrow’s summary early</h3><p>Your manager has offered an additional task, expected to finish at  19:40. </p><div class="button-row"><button class="btn ${state.overtimeReply==='accepted'?'primary':'soft'}" data-action="task" data-task="overtime">${state.overtimeReply==='accepted'?'Open summary':'View task file'}${icon('arrow')}</button><button class="btn link" data-action="nav" data-app="work">View work messages</button></div></section>`:''}
 ${inboxPreview('work')}
 </div><aside class="stack">${performanceHTML()}</aside></div>`;
}
function footerHTML(){
 const tuesday=state.stage==='tuesday';
 return `<footer class="footerbar"><div class="foot-status"><span class="status-dot ${state.workDirty?'':'saved'}"></span><span>${tuesday?`Monday log · ${state.workDirty?'Unsaved draft available':'Saved'}`:state.workDirty?'Work log · Not saved yet':`Work log saved · ${state.savedWorkAt}`}</span></div><div class="button-row">${tuesday?'<button class="btn" data-action="nav" data-app="journal">View Monday’s log</button>':`<button class="btn" data-action="save" ${state.workDirty?'':'disabled'}>${icon('save')}Save work log</button>`}</div></footer>`;
}

function chatHTML(channel){
 const personal=channel==='personal',messages=personal?state.privateMessages:state.workMessages;
 const contact=personal?'Yuan':'Manager';let replies='';
 if(personal&&state.inviteSent&&!state.activity&&state.stage!=='tuesday'){
  replies=`<div class="composer-label"><span>${state.friendReply?'Update tonight’s plans':'Quick replies'}</span><span>18:30 · Same place</span></div><div class="reply-buttons">${[['yes','Yes, see you at six thirty.'],['no','I can’t make it tonight. I’ve still got a few things to do.'],['later','I’ll decide a little later and let you know.']].map(([id,text])=>`<button class="reply-btn ${state.friendReply===id?'selected':''}" data-action="friend-reply" data-reply="${id}" aria-pressed="${state.friendReply===id}" ${state.friendReply===id?'disabled':''}>${text}</button>`).join('')}</div>`;
 }else if(!personal&&canWork()&&state.overtimeOffered){
  replies=`<div class="composer-label"><span>Reply to the additional work request</span><span>Needed tomorrow morning · Extra performance +8</span></div><div class="reply-buttons"><button class="reply-btn ${state.overtimeReply==='accepted'?'selected':''}" data-action="work-reply" data-reply="accepted" ${state.overtimeReply==='accepted'?'disabled':''}>I’ll finish the summary tonight.</button><button class="reply-btn ${state.overtimeReply==='deferred'?'selected':''}" data-action="work-reply" data-reply="deferred" ${state.overtimeReply==='deferred'?'disabled':''}>I’ll handle it tomorrow morning at work.</button>${state.overtimeReply==='accepted'?'<button class="btn primary" data-action="task" data-task="overtime">Open summary</button>':''}</div>`;
 }else if(!personal&&canWork()&&state.completed.length<tasks.length){
  const next=tasks[state.completed.length];
  replies=`<div class="composer-label"><span>Conversation tasks · ${next.title}</span></div><button class="btn soft" data-action="task" data-task="${next.id}">${icon(next.symbol)}${next.id==='report'?'Open the comments in the report':next.id==='email'?'Open email draft':next.id==='archive'?'Open archive folder':'Open meeting notes'}</button>`;
 }else replies=`<div class="quiet-composer">${personal&&!state.inviteSent?'This message was left last night. Today’s plans are in your calendar.':state.stage==='tuesday'?'Monday’s messages have been kept.':'Current messages have been kept.'}</div>`;
 return `<div class="view-heading"><div><div class="eyebrow">${personal?'PERSONAL / MESSAGES':'WORK / MESSAGES'}</div><h1>${personal?'Private chat':'Work messages'}</h1><p class="subtext">${personal?'Contacts and chat history':'Project messages and file receipts'}</p></div><span class="chip ${personal?'warm':''}">${personal?'Personal account':'Work account'}</span></div><div class="chat-layout ${personal?'personal-chat':''}"><aside class="chat-contacts"><div class="contact-search">${icon('chat')}Conversations</div><div class="contact-label">${personal?'Private conversations':'Project conversations'}</div><div class="contact" aria-current="true"><div class="avatar ${personal?'friend':''}">${personal?'Y':'M'}</div><div><strong>${contact}</strong><p>${personal?'Old friend':'Project communication'}</p></div></div><p class="contact-note">${personal?'Last conversation: <br>“Let’s play next week.”':'Today’s files and updates <br>are all in this conversation.'}</p>${!personal?`<div class="conversation-tasks"><div class="shelf-label">${state.stage==='tuesday'?'Monday work':'Today’s regular work'}</div>${tasks.map((t,i)=>`<button data-action="task" data-task="${t.id}" ${state.completed.includes(t.id)||(canWork()&&i===state.completed.length)?'':'disabled'}>${icon(state.completed.includes(t.id)?'check':t.symbol)}<span>${t.title}</span><small>${state.completed.includes(t.id)?'Complete':'+'+t.reward}</small></button>`).join('')}</div>`:''}</aside><section class="chat-main" aria-label="Conversation with ${contact}"><div class="chat-titlebar"><div><strong>${contact}</strong><p>${personal?'Private chat · Only visible to you':'Project communication'}</p></div>${icon(personal?'chat':'work')}</div><div class="chat-stream" tabindex="0" aria-label="Chat history">${messages.map(m=>`<div class="chat-time">${escapeHTML(state.stage==='tuesday'&&/^\d{2}:\d{2}$/.test(m.time)?'Monday '+m.time:m.time)}</div><div data-message="${escapeHTML(m.id)}" data-channel="${channel}" class="bubble-row ${m.side==='me'?'mine':''}"><span class="avatar ${m.side==='me'?'self':personal?'friend':''}">${m.side==='me'?'Me':personal?'Y':'M'}</span><div class="bubble">${escapeHTML(m.text)}${m.attachment?`<button class="attachment" data-action="task" data-task="${escapeHTML(m.attachment)}">${icon('file')}<span>${escapeHTML(m.attachment==='overtime'?'Morning summary.xlsx':tasks.find(t=>t.id===m.attachment)?.file||'Project file')}</span></button>`:''}</div></div>`).join('')}</div><div class="chat-composer"><div class="composer-toolbar" aria-hidden="true">${icon('chat')}${icon('file')}<span>Conversation history</span></div>${replies}</div></section></div>`;
}
function calendarHTML(){
 const status=actualPlanStatus();
 return `<div class="view-heading"><div><div class="eyebrow">PERSONAL / CALENDAR</div><h1>My calendar</h1><p class="subtext">${state.stage==='tuesday'?'Yesterday’s plans':'Your original plans for today'}</p></div><span class="chip warm">Personal account</span></div><div class="calendar-layout"><section class="card"><div class="calendar-date"><div class="calendar-num">Mon<span>Weekday</span></div><div><h2>This week’s schedule</h2><p>${state.stage==='tuesday'?'Yesterday’s plans':'This week / Day One'}</p></div></div><div class="calendar-timeline"><div class="calendar-row"><div class="cal-time">18:30</div><div class="cal-event personal ${['Cancelled','Missed the game','Not attending','Rescheduled'].includes(status)?'cancelled':''}"><h3><button class="calendar-detail-link" data-desktop="calendar-detail">Basketball with Yuan</button><span class="calendar-state">${status}</span></h3><p>City Sports Center · Outdoor Court 2</p><p>“We moved it to today last time.”</p></div></div>${state.activity==='basketball'?'<div class="calendar-row"><div class="cal-time">22:10</div><div class="cal-event personal"><h3>Home after the game</h3><p>You played one last game with Yuan, then stayed to chat for a while.</p></div></div>':''}${state.activity==='rest'?'<div class="calendar-row"><div class="cal-time">20:30</div><div class="cal-event personal"><h3>Rest at home</h3><p>Nothing else planned for tonight</p></div></div>':''}</div></section><aside class="card calendar-note"><span class="eyebrow">Weekend note</span><p>Finish that sketch.<br>Buy a new pen.<br>Get a bigger pot for the plant.</p><button class="btn link" data-action="nav" data-app="personal">Open chat${icon('arrow')}</button></aside></div>`;
}
function journalRows(entries){return entries.length?entries.map(e=>`<tr><td>${escapeHTML(e.time)}</td><td>${escapeHTML(e.title)}</td><td>+${Number(e.reward)||0}</td></tr>`).join(''):'<tr><td colspan="3"><div class="empty-note">No completed work has been recorded yet.</div></td></tr>';}
function journalContent(entries,archive=false){const total=entries.reduce((s,e)=>s+e.reward,0);return `<div class="journal-meta"><div><h2>Monday work log</h2><div class="journal-date">MONDAY · WORK LOG / 001</div></div><span class="chip ${state.workDirty&&!archive?'warm':'done'}">${archive?'Archived':state.workDirty?'Not saved yet':'Saved'}</span></div><table class="journal-table"><thead><tr><th>Time</th><th>Completed items</th><th>Performance</th></tr></thead><tbody>${journalRows(entries)}</tbody></table><div class="journal-total"><span>Completed work total</span><strong>${total} / 20</strong></div><p class="journal-disclaimer">This log records completed work and performance receipts.</p>`;}
function journalHTML(){
 const tuesday=state.stage==='tuesday';
 return `<div class="view-heading"><div><h1>Work log</h1><p class="subtext">${tuesday?'Monday / Saved records':'Monday / Current work record'}</p></div></div><section class="card journal">${journalContent(tuesday?state.savedEntries:workEntries(),tuesday)}</section>${tuesday&&state.workDirty?`<details class="unsaved-draft"><summary>View Monday’s unsaved draft (not included in the saved log)</summary>${journalRowsTable()}</details>`:''}`;
}
function journalRowsTable(){return `<table class="journal-table"><thead><tr><th>Time</th><th>Item</th><th>Performance</th></tr></thead><tbody>${journalRows(workEntries())}</tbody></table>`;}


function tuesdayHTML(){
 const carried=tasks.filter(t=>!state.completed.includes(t.id)).map(t=>[t.title,'Carried over from Monday · Not completed yet']);
 const tomorrow=carried.length?[...carried,...(state.completed.includes('report')?[["Revise the report again","The client has added more comments"]]:[])]:[['Revise the report again','The client has added more comments'],['Reply to new emails','Please confirm this week’s latest plans.'],['Update project files','Share the confirmed version']];
 return `<div class="welcome"><div><div class="eyebrow">TUESDAY / DAY 02</div><h1>Tuesday tasks</h1><p class="subtext">A new day, a new to-do list.</p></div><div class="daytag">${icon('calendar')}Tuesday · Workday</div></div><div class="dashboard"><div class="stack"><section class="card"><div class="card-head"><h2 class="card-title">${icon('dashboard')}Today’s tasks</h2><span class="tiny">Pending</span></div><div class="tasks">${tomorrow.map(([a,b])=>`<div class="tuesday-task"><span class="task-check">${icon('file')}</span><span class="task-main"><span class="task-name">${a}</span><span class="task-desc">${b}</span></span></div>`).join('')}</div></section>${inboxPreview('work')}</div><aside class="stack">${performanceHTML(true)}<section class="card note-card"><div class="plan-head"><span>Yesterday’s work record</span>${icon('save')}</div><p>${state.savedEntries.length}  work items saved.<br>Last task completed at  ${state.lastWorkAt||'—'}. </p></section></aside></div>`;
}
function taskModalHTML(task){
 if(task.id==='report')return `<div class="document-grid"><section class="document-paper"><div class="doc-heading">Project progress report</div><div class="doc-byline">Project collaboration / This week’s report · Version 3.0</div><div class="doc-section">02 · Monthly request overview</div><table class="doc-table"><thead><tr><th>Project</th><th>Current data</th></tr></thead><tbody><tr><td>Requests received</td><td><span class="doc-old">36</span><span class="doc-highlight">38</span></td></tr><tr><td>Confirmed schedule</td><td>31</td></tr></tbody></table><div class="doc-section">03 · Additional notes</div><p class="doc-line"><span class="doc-highlight">The two new requests will be reviewed next week.</span></p><p class="doc-line">All other confirmed items stay on schedule.</p></section><aside class="document-aside"><div class="doc-comment"><strong>Manager · Comments</strong><br>Only two changes: update the total number of requests to  38,  and add a note on how the new requests will be handled.</div><div class="doc-checks-title">Check before submitting</div><label class="checkline"><input type="checkbox" data-check="number">Data update checked</label><label class="checkline"><input type="checkbox" data-check="note">Additional note confirmed</label></aside></div>`;
 if(task.id==='email')return `<div class="email-field"><span>To</span>Client project team &lt;project@example.com&gt;</div><div class="email-field"><span>Subject</span>Re: This week’s project update</div><div class="email-body">Hello,<br><br>Both updates are in the report. Please find the latest version attached.<br>The two new requests will be reviewed next week. Everything else stays on schedule.<br><br>Thank you. Please let me know if you need anything else.</div><div class="small-file">${icon('file')}Project report_v3.docx · Attached</div>`;
 if(task.id==='archive')return `<h3>Put the confirmed versions in the folder.</h3><p class="modal-description">File the submitted report and email correspondence in this week’s project folder.</p><div class="folder-row">${icon('folder')}Project files / This week’s archive / Confirmed</div><div class="folder-row">${icon('file')}Project report_v3.docx<span class="chip blue" style="margin-left:auto">Latest version</span></div><div class="folder-row">${icon('mail')}Client correspondence · Monday</div><label class="checkline" style="margin-top:22px"><input type="checkbox" data-check="archive">I have checked that the report in the folder is the updated version.</label>`;
 return `<span class="chip">16:00 Project meeting</span><h3 style="margin-top:13px">Meeting outcomes</h3><ul class="meeting-list"><li>The report update has been submitted and is awaiting client confirmation.</li><li>Review the two new requests next week.</li><li>This week’s shared folder is organized. Please use the latest versions from now on.</li></ul><p class="modal-description">Confirm these notes to finish today’s regular tasks.</p>`;
}
function modalFrame(title,body,actions='',wide=false,symbol='file'){return `<div class="modal-backdrop" data-action="overlay-close"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"><header class="modal-header"><h2 id="modal-title">${icon(symbol)}${title}</h2><button class="close-btn" data-action="close" aria-label="Close window">${icon('close')}</button></header>${body}${actions}</section></div>`;}
function renderModal(){
 const root=document.getElementById('modal-root');
 const background=document.getElementById('desktop');background.inert=!!ui.modal;
 if(!ui.modal){root.innerHTML='';return;}
 const {kind}=ui.modal;let html='';
 if(kind==='leave'){
  const unfinished=tasks.length-state.completed.length;
  html=modalFrame('Leave computer · My plans',`<div class="modal-body"><p class="modal-description">${state.clock<'17:20'?'Finish work for today. No more files this evening. Choose what to do next.':'That’s work done for today. What would you like to do next?'}</p><p class="tiny">${unfinished?`${unfinished} regular task${unfinished===1?'':'s'} remain unfinished and will carry over to tomorrow.`:'Today’s regular work is complete.'}${state.overtimeOffered&&state.overtimeReply!=='deferred'?' Your manager will be told you’ll handle the summary tomorrow morning.':''}</p>
  <fieldset class="departure-options"><legend>Tonight’s plans</legend><label><input type="radio" name="departure" value="basketball" data-departure><span><strong>Head out to the game now</strong><small>Leave at 18:05 and arrive at the court at 18:30. ${state.friendReply==='yes'?'Yuan will be told you’re on your way.':'Yuan will be contacted to confirm that you’re coming after all.'}</small></span></label><label><input type="radio" name="departure" value="rest" data-departure><span><strong>Stay home and rest tonight</strong><small>${state.friendReply==='no'?'No more work planned tonight.':'Yuan will be told you can’t make it so he doesn’t wait.'}</small></span></label></fieldset>
  ${savePromptHTML()}<p class="tiny">Cancel to stay at the computer, change your replies, or work on a file.</p></div>`,`<footer class="modal-actions"><button class="btn" data-action="close">Return to computer</button><button class="btn primary" data-action="confirm-leave" disabled>Confirm plans and leave</button></footer>`,false,'logout');
 }else if(kind==='sleep'){
  html=modalFrame('Close laptop',`<div class="modal-body"><h3>That’s it for today.</h3><p class="modal-description">${state.activity==='overtime'?'The summary has been submitted.':state.activity==='basketball'?'The game is over. Tonight’s messages are still here.':'You’ve had some time to rest tonight.'} Close the laptop and rest. Open it again tomorrow morning.</p>${savePromptHTML()}</div>`,`<footer class="modal-actions"><button class="btn" data-action="close">Stay a little longer</button><button class="btn primary" data-action="confirm-sleep">Close laptop</button></footer>`,false,'moon');
 }else if(kind==='scene'){
  const basketball=ui.modal.activity==='basketball';
  html=modalFrame('After leaving the computer',`<div class="scene"><div class="eyebrow">Monday · ${basketball?'18:30 → 22:10':'20:30 → 21:30'}</div><h3>${basketball?'“There you are! We needed one more player.”':'After dinner, you read a few pages.'}</h3><p>${basketball?'Yuan tosses you the ball. You stay and talk for a while after the game.':'You didn’t open any more work files tonight.'}</p><p class="scene-quiet">${state.clock}, ${basketball?'Home':'Before bed'}. Yuan left a message.</p></div>`,`<footer class="modal-actions"><span></span><button class="btn primary" data-action="scene-continue">Return to the computer and check messages</button></footer>`,false,basketball?'ball':'moon');
 }else if(kind==='help'){
  html=modalFrame('About this computer',`<div class="modal-body"><h3>The Unsaved Work Log · Act One v0.4</h3><p class="modal-description">This is a fictional personal computer. Work, private chats, and your calendar are separate. No real accounts are connected and no messages are sent to real people.</p><p>Reading, switching apps, and saving the work log do not advance time. Time changes only when you submit work, confirm an evening activity, or end the day.</p><p>Saving the work log records completed work only. Leaving the computer confirms your evening plans. Once the evening is over, you can close the laptop and rest.</p><p class="tiny">This experience ends at Tuesday’s opening. Tuesday’s files are not available yet. You can revisit yesterday’s messages, calendar, and records.</p><p>${escapeHTML(state.migrationNotice||'')}</p><p class="help-storage">${storageBlocked?escapeHTML(loadNotice):storageAvailable?'Progress is saved in this browser. Original saves from older versions are kept separately.':'Browser storage is unavailable. Your progress may not be recoverable after you close this page.'}</p></div>`,`<footer class="modal-actions"><button class="btn" data-action="reset">Start over v0.4</button>${storageBlocked?'<button class="btn" data-action="reload">Retry loading saved progress</button>':''}<button class="btn primary" data-action="close">Back</button></footer>`,false,'info');
 }else if(kind==='receipt'){
  const task=tasks.find(t=>t.id===ui.modal.taskId);
  html=modalFrame('Work receipt',`<div class="modal-body"><span class="chip done">Complete</span><h3 style="margin-top:13px">${task.title}</h3><p class="modal-description">${task.file}</p><div class="modal-summary"><span>Monday ${task.time} Recorded</span><strong>Performance +${task.reward}</strong></div><p class="tiny">This task is already in the log. It won’t be counted again.</p></div>`,`<footer class="modal-actions"><span></span><button class="btn primary" data-action="close">Got it</button></footer>`);
 }else if(kind==='archive'){
  html=modalFrame('Monday · Saved work log',`<div class="modal-body review-archive" style="padding:25px 28px">${journalContent(state.savedEntries,true)}</div>`,`<footer class="modal-actions"><span class="tiny">Last saved: Monday  ${state.savedWorkAt||'—'}</span><button class="btn" data-action="close">Close</button></footer>`);
 }else if(kind==='reset'){
  html=modalFrame('Restart Act One',`<div class="modal-body"><h3>Start again on Monday morning?</h3><p class="modal-description">This resets progress in this prototype, including completed tasks and conversation choices. It does not affect anything else in your browser.</p></div>`,`<footer class="modal-actions"><span></span><div class="button-row"><button class="btn" data-action="close">Keep current progress</button><button class="btn primary" data-action="confirm-reset">Start over</button></div></footer>`,false,'reset');
 }
 root.innerHTML=html;
 requestAnimationFrame(()=>{const dialog=root.querySelector('[role="dialog"]');if(dialog)dialog.focus({preventScroll:true});});
}
function savePromptHTML(){return state.workDirty?'<label class="checkline save-prompt"><input type="checkbox" data-save-before checked><span>Also save the current work log<small>You can uncheck this. Unsaved drafts will still remain on this computer.</small></span></label>':'<p class="tiny">The current work log is saved.</p>';}
function syncModalControls(){
 let valid=false;
 if(ui.modal?.kind==='task')valid=ui.modal.taskId==='report'?!!(ui.checks.number&&ui.checks.note):ui.modal.taskId==='archive'?!!ui.checks.archive:true;
 else if(ui.modal?.kind==='overtime')valid=!!ui.checks.overtime;
 const btn=document.querySelector('[data-action="complete-task"],[data-action="complete-overtime"]');if(btn)btn.disabled=!valid;
}
document.addEventListener('change',event=>{
 const el=event.target;
 if(el.matches('[data-check]')){if(el.closest('[data-window]')){Desktop.checkChanged(el);return;}ui.checks[el.dataset.check]=el.checked;syncModalControls();}
 if(el.matches('[data-notify]')){if(el.closest('[data-window]'))Desktop.notifyChanged(el);else ui.notifyFriend=el.checked;}
 if(el.matches('[data-save-before]'))ui.saveBeforeLeave=el.checked;
 if(el.matches('[data-departure]')){ui.leaveChoice=el.value;document.querySelector('[data-action="confirm-leave"]').disabled=false;}
});
document.addEventListener('click',event=>{
 const el=event.target.closest('[data-action]');if(!el||el.disabled)return;
 const source=el.closest('[data-window]');if(source)ui.app=source.dataset.window==='chat'?'personal':'work';
 if(el.dataset.action==='overlay-close'&&event.target!==el)return;
 switch(el.dataset.action){
  case 'nav':goApp(el.dataset.app);break;
  case 'task':showTask(el.dataset.task);break;
  case 'complete-task':completeTask(el.dataset.task);break;
  case 'friend-reply':respondFriend(el.dataset.reply);break;
  case 'work-reply':respondWork(el.dataset.reply);break;
  case 'leave':clockOut();break;
  case 'confirm-leave':doActivity(ui.leaveChoice);break;
  case 'sleep':if(state.stage==='night')openModal('sleep');break;
  case 'confirm-sleep':endDay();break;
  case 'help':openModal('help');break;
  case 'reload':location.reload();break;
  case 'dismiss-notice':state.migrationNotice=null;persist();break;
  case 'complete-overtime':finishOvertime();break;
    case 'scene-continue':goApp('personal');break;
  case 'save':if(state.stage!=='tuesday'){saveWork();persist();render();toast('Work log saved.');}break;
  case 'archive':openModal('archive');break;
  case 'reset':openModal('reset');break;
  case 'confirm-reset':resetExperience();break;
  case 'close':case 'overlay-close':closeModal();break;
 }
});
document.addEventListener('keydown',event=>{
 if(!ui.modal)return;
 if(event.key==='Escape'){event.preventDefault();closeModal();return;}
 if(event.key==='Tab'){
  const items=[...document.querySelectorAll('#modal-root button:not(:disabled),#modal-root input:not(:disabled),#modal-root [tabindex="0"]')].filter(el=>el.getClientRects().length);
  if(!items.length)return;
  const first=items[0],last=items[items.length-1];
  if(event.shiftKey&&(document.activeElement===first||document.activeElement.getAttribute('role')==='dialog')){last.focus();event.preventDefault();}
  else if(!event.shiftKey&&document.activeElement===last){first.focus();event.preventDefault();}
 }
});
window.render_game_to_text=()=>JSON.stringify({app:ui.app,stage:state.stage,clock:state.clock,performance:state.performance,target:state.stage==='tuesday'?25:20,completed:state.completed,activity:state.activity,friendReply:state.friendReply,overtimeReply:state.overtimeReply,workDirty:state.workDirty,unread:{work:unread('work'),personal:unread('personal')}});
