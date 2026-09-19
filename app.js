
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
 {id:'report',title:'修改报告',desc:'项目报告_v3.docx · 核对两处批注',reward:5,time:'09:30',file:'项目报告_v3.docx',symbol:'file'},
 {id:'email',title:'回复客户邮件',desc:'确认更新内容，并发送报告附件',reward:3,time:'11:10',file:'回复：本周项目进度',symbol:'mail'},
 {id:'archive',title:'整理项目资料',desc:'归档已确认版本，更新共享目录',reward:5,time:'14:30',file:'项目资料 / 本周归档',symbol:'folder'},
 {id:'meeting',title:'确认会议纪要',desc:'核对讨论结果，确认后续安排',reward:7,time:'17:20',file:'周一项目例会 · 会议纪要',symbol:'people'}
];
function freshState(){return {
 version:4,stage:'day',clock:'09:00',app:'work',completed:[],performance:0,life:50,
 friendReply:null,overtimeReply:null,inviteSent:false,overtimeOffered:false,overtimeDone:false,
 activity:null,attended:false,notifiedFriend:false,workDirty:true,savedWorkAt:null,savedEntries:[],lastWorkAt:null,
 mondayPerformance:null,migrationNotice:null,computer:null,notifications:[],openingShown:false,
 workMessages:[{id:'work-intro',side:'them',time:'09:00',text:'早，客户补了两处修改，我已经标在报告里了。午饭前更新一下就行。',attachment:'report'}],
 privateMessages:[{id:'friend-reminder',side:'them',time:'周日 22:14',text:'上回你说这周再打，今晚别忘了啊。'}],
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
   if(state.stage==='day'&&next&&state.completed.length){state.workMessages.push({id:'migration-next',side:'them',time:state.clock,text:'接着处理这份就好。',attachment:next.id});}
   state.migrationNotice='已保留并兼容载入上一版进度。原存档仍单独保留；已完成事项和数值没有重新结算。';
  }
  if(parsed.version!==4){state.version=4;state.computer=null;state.notifications=[];state.openingShown=true;state.migrationNotice='已兼容载入旧进度；原始存档独立保留，没有重新结算。详情可在帮助中查看。';}
  for(const channel of ['work','personal']){const list=channel==='work'?state.workMessages:state.privateMessages;list.forEach((m,i)=>{if(typeof m.read!=='boolean')m.read=m.side==='me'||i<(state.read[channel]||0);});}
 }
}catch(_){storageBlocked=true;loadNotice='已有存档暂时无法读取。为避免覆盖，当前为临时体验；原存档未删除。可在帮助中重试，或明确选择重新开始 v0.4。';}
const ui={app:['work','overview','documents','journal','personal','calendar'].includes(state.app)?state.app:'work',modal:null,checks:{},notifyFriend:true,leaveChoice:null,saveBeforeLeave:true,toastTimer:null,lastFocus:null};

function persist(){
 state.app=ui.app;
 if(!storageBlocked)try{localStorage.setItem(STORAGE_KEY,JSON.stringify(state));}catch(_){storageAvailable=false;}
 updateStorageNotice();
}

function updateStorageNotice(){const el=document.getElementById('storage-status');if(el)el.textContent=storageBlocked?'存档未覆盖 · 查看帮助':storageAvailable?'':'本次进度暂时无法存储 · 查看帮助';}

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

function ensureInvite(){if(state.inviteSent)return;state.inviteSent=true;addMessage('personal','them','六点半老地方？我带球，你直接过来就行。','17:20','friend-invite');addEvent('invitation_received',{at:'17:20'});}
function offerOvertime(){if(state.overtimeOffered)return;state.overtimeOffered=true;addMessage('work','them','明早要用的汇总表，今晚有空提前整理一下吗？做完可以记额外绩效。','17:20','overtime-offer','overtime');addEvent('overtime_offered',{at:'17:20'});}
function announce(text){document.getElementById('announcement').textContent=text;}
function toast(text){clearTimeout(ui.toastTimer);document.getElementById('toast-root').innerHTML=`<div class="toast">${icon('check')}<span>${escapeHTML(text)}</span></div>`;ui.toastTimer=setTimeout(()=>{document.getElementById('toast-root').innerHTML='';},4300);}
function canWork(){return state.stage==='day';}
function actualPlanStatus(){
 if(state.activity==='basketball')return '已赴约';
 if(state.activity==='rest')return '未参加 · 在家休息';
 if(state.activity==='overtime')return state.events.some(e=>e.type==='missed_promise')?'未赴约':'未参加';
 return state.friendReply==='yes'?'已确认':state.friendReply==='no'?'已取消':'待确认';
}
function workEntries(){const entries=tasks.filter(t=>state.completed.includes(t.id)).map(t=>({title:t.title,time:t.time,reward:t.reward}));if(state.overtimeDone)entries.push({title:'完成临时汇总表',time:'19:40',reward:8});return entries;}
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
  report:['报告两处批注已经更新，文件已提交。','收到了，麻烦把更新版也发给客户。','email'],
  email:['更新版已发给客户，报告附件一并发送。','好。把这次报告和往来邮件归到本周目录，之后找起来方便。','archive'],
  archive:['本周目录已更新，报告和邮件都归好了。','目录看到了。下午例会的纪要也放在这里，散会后帮忙核对一下。','meeting'],
  meeting:['会议纪要已确认，后续安排没有遗漏。','收到了，今天这几项都齐了。谢谢。',null]
 };
 const [sent,answer,next]=feedback[id];
 addMessage('work','me',sent,task.time,id+'-submitted');
 addMessage('work','them',answer,task.time,id+'-receipt',next);
 if(id==='meeting'){ensureInvite();offerOvertime();}
 ui.modal=null;persist();render();
 toast(`${id==='email'?'邮件已发送':id==='archive'?'资料已归档':'已提交'} · 绩效 +${task.reward}`);
 announce(id==='meeting'?'今日绩效20 / 20。工作消息和私人聊天各有新消息。':`${task.title}已记录，主管有新的回复。`);
}

function respondFriend(reply){
 if(!['yes','no','later'].includes(reply)||!state.inviteSent||state.activity||state.stage==='tuesday'||state.friendReply===reply)return;
 const texts={yes:'来，六点半见。',no:'今天先不去了，手头还有点事。',later:'我晚点确定，再跟你说。'};
 const answers={yes:'好，我给你留个位置。',no:'行，那下次。你忙完早点休息。',later:'好，我六点出门，你定好了告诉我。'};
 addMessage('personal','me',texts[reply]);addMessage('personal','them',answers[reply]);
 state.friendReply=reply;state.notifiedFriend=reply==='no';addEvent('friend_replied',{reply,performanceDelta:0,lifeDelta:0});markRead('personal');persist();render();scrollChat();
}
function respondWork(reply){
 if(!['accepted','deferred'].includes(reply)||!canWork()||!state.overtimeOffered||state.overtimeDone||state.overtimeReply===reply)return;
 addMessage('work','me',reply==='accepted'?'今晚先把汇总做完。':'我明早上班后处理。');
 addMessage('work','them',reply==='accepted'?'好，文件发你了，整理好直接提交就行。':'好，那明早先处理这份。');
 state.overtimeReply=reply;addEvent('overtime_replied',{reply,performanceDelta:0,lifeDelta:0});markRead('work');persist();render();scrollChat();
}
function clockOut(){if(['day','evening'].includes(state.stage)&&!state.activity)openModal('leave');}

function doActivity(activity){
 if(!['day','evening'].includes(state.stage)||state.activity||ui.modal?.kind!=='leave'||!['basketball','rest'].includes(activity))return;
 if(ui.saveBeforeLeave)saveWork();
 addEvent('left_computer',{activity,unfinished:tasks.filter(t=>!state.completed.includes(t.id)).map(t=>t.id),saved:!state.workDirty});
 if(state.overtimeOffered&&state.overtimeReply!=='deferred'){
  addMessage('work','me','我明早上班后处理。');addMessage('work','them','好，那明早先处理这份。');
  state.overtimeReply='deferred';addEvent('overtime_replied',{reply:'deferred',source:'leaving_computer',performanceDelta:0,lifeDelta:0});
 }
 // For an early departure this is an explicit jump to the evening arrangement.
 ensureInvite();state.clock='18:05';
 const prior=state.friendReply;
 if(activity==='basketball'){
  addMessage('personal','me',prior==='yes'?'我出门了，待会见。':'我现在出门，还赶得上。六点半见。','18:05');
  addMessage('personal','them',prior==='yes'?'好，门口等你。':'来得及，老地方。','18:05');
  state.friendReply='yes';state.notifiedFriend=false;state.attended=true;
  addEvent('friend_replied',{reply:'yes',source:'leaving_computer',performanceDelta:0,lifeDelta:0});
  state.life=Math.min(100,state.life+4);addEvent('basketball_attended',{at:'18:30',lifeDelta:4,performanceDelta:0});
  state.clock='22:10';addMessage('personal','them','今天最后那个球可以啊，下周继续？','22:10','ball-followup');
 }else{
  if(prior!=='no'){
   addMessage('personal','me','今晚有点累，我想在家歇一歇。这次先不去了，改天再打。','18:05');
   addMessage('personal','them','没事，你好好休息，改天再打。','18:05');
   addEvent('friend_replied',{reply:'no',source:'leaving_computer',performanceDelta:0,lifeDelta:0});
  }
  state.friendReply='no';state.notifiedFriend=true;state.attended=false;
  addEvent('friend_notified',{at:'18:05',reason:'rest'});
  state.life=Math.min(100,state.life+4);addEvent('rest_taken',{at:'20:30',lifeDelta:4,performanceDelta:0});
  state.clock='21:30';addMessage('personal','them','今晚风有点大。你好好歇着，下回再来。','21:10','rest-followup');
 }
 state.activity=activity;state.stage='night';ui.modal=null;persist();render();openModal('scene',{activity});
}

function finishOvertime(){
 ui.checks=Desktop.taskChecks('overtime');ui.notifyFriend=Desktop.taskNotify();
 if(!Desktop.hasTask('overtime')||!canWork()||!state.overtimeOffered||state.overtimeDone||state.activity||!ui.checks.overtime)return;
 const wasPromised=state.friendReply==='yes';
 if(state.overtimeReply!=='accepted'){
  addMessage('work','me','今晚先把汇总做完。');state.overtimeReply='accepted';
  addEvent('overtime_replied',{reply:'accepted',source:'submission',performanceDelta:0,lifeDelta:0});
 }
 if(ui.notifyFriend&&state.friendReply!=='no'){
  addMessage('personal','me','今天先不去了，手头还有点事。抱歉，临时改了安排。','17:25');
  addMessage('personal','them','行，那我跟他们说一声。你忙完早点休息。','17:25');
  state.friendReply='no';state.notifiedFriend=true;
  addEvent('friend_replied',{at:'17:25',reply:'no',source:'before_overtime',performanceDelta:0,lifeDelta:0});
  addEvent('friend_notified',{at:'17:25',reason:'overtime'});
 }else if(wasPromised){
  state.notifiedFriend=false;
  addMessage('personal','them','我们到了，你到哪了？','18:35');
  addMessage('personal','them','给你留了位置，一直没见你。我先打了。','19:10');
  addEvent('missed_promise',{at:'18:30'});
 }else if(state.friendReply!=='no'){
  state.notifiedFriend=false;addMessage('personal','them','我们开始打了，你今天还过来吗？','18:35');
 }
 state.performance+=8;state.life=Math.max(0,state.life-3);state.overtimeDone=true;state.activity='overtime';state.attended=false;state.workDirty=true;state.lastWorkAt='19:40';
 state.clock='19:40';state.stage='night';
 addEvent('overtime_completed',{performanceDelta:8,lifeDelta:-3,notifiedFriend:state.notifiedFriend,attended:false});
 addMessage('work','them','汇总表收到了。今晚辛苦，额外绩效已记上。','19:40','overtime-received');
 addMessage('personal','them',wasPromised&&!state.notifiedFriend?'下次来不了，提前说一声就好。你忙完早点休息。':'我们刚打完。你忙完早点休息，下次再约。','19:40','overtime-followup');
 ui.modal=null;persist();render();toast('汇总表已提交 · 额外绩效 +8');
}

function endDay(){
 if(state.stage!=='night'||!state.activity||ui.modal?.kind!=='sleep')return;
 if(ui.saveBeforeLeave)saveWork();
 addEvent('day_ended',{activity:state.activity,performance:state.performance,logSaved:!state.workDirty});
 state.mondayPerformance=state.performance;state.performance=0;state.stage='tuesday';state.clock='09:00';
 Desktop.clearWindows();
 addMessage('work','them',state.completed.includes('report')?'早，昨天那份报告客户又补了两处意见，今天再更新一下。':'早，报告里的两处修改，今天先更新一下。','周二 09:00','tuesday-intro');
 if(state.activity==='basketball')addMessage('personal','them','昨天最后那个球可以啊，下周继续？','周二 08:52','tuesday-ball');
 ui.app='work';ui.modal=null;persist();render();announce('周二上午9点。今日绩效目标25。');
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
 return `<div class="view-heading"><h1>项目文档</h1><span class="tiny">本周协作文件</span></div><div class="document-list">${tasks.map((t,i)=>{
 const done=state.completed.includes(t.id),enabled=done||(canWork()&&i===state.completed.length);
 return `<button class="inbox-preview" data-action="task" data-task="${t.id}" ${enabled?'':'disabled'}>${icon(t.symbol)}<span class="inbox-info"><strong>${t.file}</strong><p>${done?'已处理':i===state.completed.length?'待处理':'等待前序事项'}</p></span></button>`;
 }).join('')}${state.overtimeOffered?`<button class="inbox-preview" data-action="task" data-task="overtime" ${canWork()||state.overtimeDone?'':'disabled'}>${icon('file')}<span class="inbox-info"><strong>明早汇总表.xlsx</strong><p>${state.overtimeDone?'已提交':'待处理'}</p></span></button>`:''}</div>`;
}

function performanceHTML(tuesday=false){const p=tuesday?0:state.performance,target=tuesday?25:20;return `<section class="card performance" aria-label="今日绩效 ${p} / ${target}"><div class="perf-head"><span>今日绩效</span>${icon('chart')}</div><div class="perf-number"><strong>${p}</strong><span>/ ${target}</span></div><div class="progress-track" role="progressbar" aria-label="今日绩效目标完成度" aria-valuenow="${Math.min(p,target)}" aria-valuemin="0" aria-valuemax="${target}"><div class="progress-fill" style="width:${Math.min(p/target,1)*100}%"></div></div><div class="perf-note"><span>${p>=target?'今日目标已完成':'Performance target'}</span><span>${p>target?`额外 +${p-target}`:p>=target?'100%':`${Math.round(p/target*100)}%`}</span></div></section>`;}
function planHTML(){const status=actualPlanStatus();return `<section class="card plan-card"><div class="plan-head"><span>个人日历</span><span>${state.stage==='tuesday'?'昨天':status}</span></div><div class="plan-main"><div class="ball-icon">${icon('ball')}</div><div><div class="plan-time">18:30</div><div class="plan-name">和阿远打球</div></div></div><p class="plan-place">市体育馆 · 室外 2 号场${state.stage==='tuesday'?` · ${status}`:''}</p></section>`;}
function inboxPreview(channel){const m=lastIncoming(channel),personal=channel==='personal';return `<button class="inbox-preview" data-action="nav" data-app="${channel}" aria-label="打开${personal?'阿远的私人消息':'主管的工作消息'}"><span class="avatar ${personal?'friend':''}">${personal?'远':'主'}</span><span class="inbox-info"><strong>${personal?'阿远 · 私人聊天':'主管 · 工作消息'}</strong><p>${escapeHTML(m.text)}</p></span>${unread(channel)?'<span class="message-pip"></span>':icon('chevron','task-chevron')}</button>`;}
function overviewHTML(){
 const night=state.stage==='night',done=state.completed.length===tasks.length;
 let heading='我的任务';
 let subtitle=done?'今日常规事项已完成。':'本周项目 / 周一待办';
 return `<div class="welcome"><div><div class="eyebrow">我的工作台 <span>/</span> 本周</div><h1>${heading}</h1><p class="subtext">${subtitle}</p></div><div class="daytag">${icon('calendar')}周一 · 工作日</div></div>
 <div class="dashboard"><div class="stack">

 <section class="card"><div class="card-head"><h2 class="card-title">${icon('dashboard')}今日待办</h2><span class="tiny">${state.completed.length} / 4 已完成</span></div><div class="task-table-head"><span>任务名称</span><span>状态</span><span>绩效</span></div><div class="tasks">${tasks.map((task,i)=>{const isDone=state.completed.includes(task.id),current=!isDone&&i===state.completed.length&&canWork();return `<button class="task ${isDone?'done':''} ${current?'current':''}" data-action="task" data-task="${task.id}" data-focus="task-${task.id}" ${!isDone&&!current?'disabled':''} aria-label="${task.title}，${isDone?'已完成':current?'可处理':'待处理'}，绩效加${task.reward}"><span class="task-check">${icon(isDone?'check':task.symbol)}</span><span class="task-main"><span class="task-name">${task.title}</span><span class="task-desc">${task.desc}</span></span><span class="task-status ${isDone?'complete':current?'pending':''}">${isDone?'已完成':current?'待处理':'待开始'}</span><span class="task-reward">${isDone?'已记入':`+${task.reward}`}</span>${icon('chevron','task-chevron')}</button>`;}).join('')}</div>${!done&&canWork()?`<div class="task-guidance">${icon('info')}事项相关文件和回执也保留在主管的会话中。</div>`:''}</section>
 ${canWork()&&state.overtimeOffered?`<section class="extra-card"><div class="top"><span class="chip blue">${state.overtimeReply==='deferred'?'已安排明早处理':state.overtimeReply==='accepted'?'已接下 · 尚未提交':'可选 · 新任务'}</span><span class="extra-reward">+8</span></div><h3>提前整理明早的汇总表</h3><p>主管发来一项追加工作，预计完成时间为 19:40。</p><div class="button-row"><button class="btn ${state.overtimeReply==='accepted'?'primary':'soft'}" data-action="task" data-task="overtime">${state.overtimeReply==='accepted'?'打开汇总表':'查看任务文件'}${icon('arrow')}</button><button class="btn link" data-action="nav" data-app="work">查看工作消息</button></div></section>`:''}
 ${inboxPreview('work')}
 </div><aside class="stack">${performanceHTML()}</aside></div>`;
}
function footerHTML(){
 const tuesday=state.stage==='tuesday';
 return `<footer class="footerbar"><div class="foot-status"><span class="status-dot ${state.workDirty?'':'saved'}"></span><span>${tuesday?`周一日志 · ${state.workDirty?'有未保存草稿':'已保存'}`:state.workDirty?'工作日志 · 尚未保存':`工作日志已保存 · ${state.savedWorkAt}`}</span></div><div class="button-row">${tuesday?'<button class="btn" data-action="nav" data-app="journal">查看周一日志</button>':`<button class="btn" data-action="save" ${state.workDirty?'':'disabled'}>${icon('save')}保存工作日志</button>`}</div></footer>`;
}

function chatHTML(channel){
 const personal=channel==='personal',messages=personal?state.privateMessages:state.workMessages;
 const contact=personal?'阿远':'主管';let replies='';
 if(personal&&state.inviteSent&&!state.activity&&state.stage!=='tuesday'){
  replies=`<div class="composer-label"><span>${state.friendReply?'更新今晚的安排':'快捷回复'}</span><span>18:30 · 老地方</span></div><div class="reply-buttons">${[['yes','来，六点半见。'],['no','今天先不去了，手头还有点事。'],['later','我晚点确定，再跟你说。']].map(([id,text])=>`<button class="reply-btn ${state.friendReply===id?'selected':''}" data-action="friend-reply" data-reply="${id}" aria-pressed="${state.friendReply===id}" ${state.friendReply===id?'disabled':''}>${text}</button>`).join('')}</div>`;
 }else if(!personal&&canWork()&&state.overtimeOffered){
  replies=`<div class="composer-label"><span>回复这项追加工作</span><span>明早需要 · 额外绩效 +8</span></div><div class="reply-buttons"><button class="reply-btn ${state.overtimeReply==='accepted'?'selected':''}" data-action="work-reply" data-reply="accepted" ${state.overtimeReply==='accepted'?'disabled':''}>今晚先把汇总做完。</button><button class="reply-btn ${state.overtimeReply==='deferred'?'selected':''}" data-action="work-reply" data-reply="deferred" ${state.overtimeReply==='deferred'?'disabled':''}>我明早上班后处理。</button>${state.overtimeReply==='accepted'?'<button class="btn primary" data-action="task" data-task="overtime">打开汇总表</button>':''}</div>`;
 }else if(!personal&&canWork()&&state.completed.length<tasks.length){
  const next=tasks[state.completed.length];
  replies=`<div class="composer-label"><span>会话待办 · ${next.title}</span></div><button class="btn soft" data-action="task" data-task="${next.id}">${icon(next.symbol)}${next.id==='report'?'打开报告中的批注':next.id==='email'?'打开邮件草稿':next.id==='archive'?'打开归档目录':'打开会议纪要'}</button>`;
 }else replies=`<div class="quiet-composer">${personal&&!state.inviteSent?'这是昨晚留下的消息。今天的安排还在日历里。':state.stage==='tuesday'?'周一的消息已保留。':'当前消息已保留。'}</div>`;
 return `<div class="view-heading"><div><div class="eyebrow">${personal?'PERSONAL / MESSAGES':'WORK / MESSAGES'}</div><h1>${personal?'私人聊天':'工作消息'}</h1><p class="subtext">${personal?'联系人与聊天记录':'项目沟通与文件回执'}</p></div><span class="chip ${personal?'warm':''}">${personal?'个人账号':'工作账号'}</span></div><div class="chat-layout ${personal?'personal-chat':''}"><aside class="chat-contacts"><div class="contact-search">${icon('chat')}会话列表</div><div class="contact-label">${personal?'私人会话':'项目会话'}</div><div class="contact" aria-current="true"><div class="avatar ${personal?'friend':''}">${personal?'远':'主'}</div><div><strong>${contact}</strong><p>${personal?'老朋友':'项目沟通'}</p></div></div><p class="contact-note">${personal?'上一次聊天：<br>“下周再打吧。”':'今天的文件与更新，<br>都在这个会话中。'}</p>${!personal?`<div class="conversation-tasks"><div class="shelf-label">${state.stage==='tuesday'?'周一工作':'今日常规工作'}</div>${tasks.map((t,i)=>`<button data-action="task" data-task="${t.id}" ${state.completed.includes(t.id)||(canWork()&&i===state.completed.length)?'':'disabled'}>${icon(state.completed.includes(t.id)?'check':t.symbol)}<span>${t.title}</span><small>${state.completed.includes(t.id)?'已完成':'+'+t.reward}</small></button>`).join('')}</div>`:''}</aside><section class="chat-main" aria-label="与${contact}的聊天"><div class="chat-titlebar"><div><strong>${contact}</strong><p>${personal?'私人聊天 · 仅你可见':'项目沟通'}</p></div>${icon(personal?'chat':'work')}</div><div class="chat-stream" tabindex="0" aria-label="聊天记录">${messages.map(m=>`<div class="chat-time">${escapeHTML(state.stage==='tuesday'&&!m.time.includes('周')?'周一 '+m.time:m.time)}</div><div data-message="${escapeHTML(m.id)}" data-channel="${channel}" class="bubble-row ${m.side==='me'?'mine':''}"><span class="avatar ${m.side==='me'?'self':personal?'friend':''}">${m.side==='me'?'我':personal?'远':'主'}</span><div class="bubble">${escapeHTML(m.text)}${m.attachment?`<button class="attachment" data-action="task" data-task="${escapeHTML(m.attachment)}">${icon('file')}<span>${escapeHTML(m.attachment==='overtime'?'明早汇总表.xlsx':tasks.find(t=>t.id===m.attachment)?.file||'项目文件')}</span></button>`:''}</div></div>`).join('')}</div><div class="chat-composer"><div class="composer-toolbar" aria-hidden="true">${icon('chat')}${icon('file')}<span>会话记录</span></div>${replies}</div></section></div>`;
}
function calendarHTML(){
 const status=actualPlanStatus();
 return `<div class="view-heading"><div><div class="eyebrow">PERSONAL / CALENDAR</div><h1>我的日历</h1><p class="subtext">${state.stage==='tuesday'?'昨天留下的安排':'今天原本的安排'}</p></div><span class="chip warm">个人账号</span></div><div class="calendar-layout"><section class="card"><div class="calendar-date"><div class="calendar-num">一<span>星期</span></div><div><h2>本周日程</h2><p>${state.stage==='tuesday'?'昨天的安排':'本周 / 第一天'}</p></div></div><div class="calendar-timeline"><div class="calendar-row"><div class="cal-time">18:30</div><div class="cal-event personal ${['已取消','未赴约','未参加','已改期'].includes(status)?'cancelled':''}"><h3><button class="calendar-detail-link" data-desktop="calendar-detail">和阿远打球</button><span class="calendar-state">${status}</span></h3><p>市体育馆 · 室外 2 号场</p><p>“上次改到了今天。”</p></div></div>${state.activity==='basketball'?'<div class="calendar-row"><div class="cal-time">22:10</div><div class="cal-event personal"><h3>打完球回到家</h3><p>和阿远打了最后一场，散场后聊了一会儿。</p></div></div>':''}${state.activity==='rest'?'<div class="calendar-row"><div class="cal-time">20:30</div><div class="cal-event personal"><h3>在家休息</h3><p>今晚没有再安排别的事情</p></div></div>':''}</div></section><aside class="card calendar-note"><span class="eyebrow">周末便签</span><p>补完那张画。<br>买一支新笔。<br>给植物换个大一点的盆。</p><button class="btn link" data-action="nav" data-app="personal">打开私人聊天${icon('arrow')}</button></aside></div>`;
}
function journalRows(entries){return entries.length?entries.map(e=>`<tr><td>${escapeHTML(e.time)}</td><td>${escapeHTML(e.title)}</td><td>+${Number(e.reward)||0}</td></tr>`).join(''):'<tr><td colspan="3"><div class="empty-note">还没有已完成的工作记录。</div></td></tr>';}
function journalContent(entries,archive=false){const total=entries.reduce((s,e)=>s+e.reward,0);return `<div class="journal-meta"><div><h2>周一工作日志</h2><div class="journal-date">MONDAY · WORK LOG / 001</div></div><span class="chip ${state.workDirty&&!archive?'warm':'done'}">${archive?'已归档':state.workDirty?'尚未保存':'已保存'}</span></div><table class="journal-table"><thead><tr><th>时间</th><th>已完成事项</th><th>绩效</th></tr></thead><tbody>${journalRows(entries)}</tbody></table><div class="journal-total"><span>工作事项合计</span><strong>${total} / 20</strong></div><p class="journal-disclaimer">记录范围：已完成的工作事项与绩效回执。</p>`;}
function journalHTML(){
 const tuesday=state.stage==='tuesday';
 return `<div class="view-heading"><div><h1>工作日志</h1><p class="subtext">${tuesday?'周一 / 已保存记录':'周一 / 当前工作记录'}</p></div></div><section class="card journal">${journalContent(tuesday?state.savedEntries:workEntries(),tuesday)}</section>${tuesday&&state.workDirty?`<details class="unsaved-draft"><summary>查看周一未保存的草稿（未计入已保存日志）</summary>${journalRowsTable()}</details>`:''}`;
}
function journalRowsTable(){return `<table class="journal-table"><thead><tr><th>时间</th><th>事项</th><th>绩效</th></tr></thead><tbody>${journalRows(workEntries())}</tbody></table>`;}


function tuesdayHTML(){
 const carried=tasks.filter(t=>!state.completed.includes(t.id)).map(t=>[t.title,'从周一延续 · 尚未完成']);
 const tomorrow=carried.length?[...carried,...(state.completed.includes('report')?[["再次修改报告","客户补充了新的意见"]]:[])]:[['再次修改报告','客户补充了新的意见'],['回复新增邮件','请确认本周最新安排'],['更新项目资料','同步已经确认的版本']];
 return `<div class="welcome"><div><div class="eyebrow">TUESDAY / DAY 02</div><h1>周二待办</h1><p class="subtext">新的一天，新的待办。</p></div><div class="daytag">${icon('calendar')}周二 · 工作日</div></div><div class="dashboard"><div class="stack"><section class="card"><div class="card-head"><h2 class="card-title">${icon('dashboard')}今日待办</h2><span class="tiny">待处理</span></div><div class="tasks">${tomorrow.map(([a,b])=>`<div class="tuesday-task"><span class="task-check">${icon('file')}</span><span class="task-main"><span class="task-name">${a}</span><span class="task-desc">${b}</span></span></div>`).join('')}</div></section>${inboxPreview('work')}</div><aside class="stack">${performanceHTML(true)}<section class="card note-card"><div class="plan-head"><span>昨天的工作记录</span>${icon('save')}</div><p>${state.savedEntries.length} 项工作已保存。<br>最后一项完成于 ${state.lastWorkAt||'—'}。</p></section></aside></div>`;
}
function taskModalHTML(task){
 if(task.id==='report')return `<div class="document-grid"><section class="document-paper"><div class="doc-heading">项目进度报告</div><div class="doc-byline">项目协作 / 本周报告 · 版本 3.0</div><div class="doc-section">02 · 本月需求概览</div><table class="doc-table"><thead><tr><th>项目</th><th>当前数据</th></tr></thead><tbody><tr><td>已接收需求</td><td><span class="doc-old">36</span><span class="doc-highlight">38</span></td></tr><tr><td>已确认排期</td><td>31</td></tr></tbody></table><div class="doc-section">03 · 补充说明</div><p class="doc-line"><span class="doc-highlight">两条新增需求将列入下周评估。</span></p><p class="doc-line">其余已确认事项按原计划推进。</p></section><aside class="document-aside"><div class="doc-comment"><strong>主管 · 批注</strong><br>这次只改两处：需求总数更新为 38，并补上新增需求的处理说明。</div><div class="doc-checks-title">提交前核对</div><label class="checkline"><input type="checkbox" data-check="number">已核对数据更新</label><label class="checkline"><input type="checkbox" data-check="note">已确认补充说明</label></aside></div>`;
 if(task.id==='email')return `<div class="email-field"><span>收件人</span>客户项目组 &lt;project@example.com&gt;</div><div class="email-field"><span>主题</span>回复：本周项目进度</div><div class="email-body">您好，<br><br>报告中的两处内容已经更新，最新版本见附件。<br>两条新增需求将列入下周评估，其余事项按原计划推进。<br><br>请查收，谢谢。</div><div class="small-file">${icon('file')}项目报告_v3.docx · 已附加</div>`;
 if(task.id==='archive')return `<h3>把确认过的版本放好。</h3><p class="modal-description">已提交的报告与往来邮件，归入本周项目目录。</p><div class="folder-row">${icon('folder')}项目资料 / 本周归档 / 已确认</div><div class="folder-row">${icon('file')}项目报告_v3.docx<span class="chip blue" style="margin-left:auto">最新版本</span></div><div class="folder-row">${icon('mail')}客户邮件往来 · 周一</div><label class="checkline" style="margin-top:22px"><input type="checkbox" data-check="archive">已确认目录中的报告为更新后的版本</label>`;
 return `<span class="chip">16:00 项目例会</span><h3 style="margin-top:13px">本次讨论结果</h3><ul class="meeting-list"><li>报告更新已提交，等待客户确认。</li><li>两条新增需求在下周进行评估。</li><li>本周共享目录已整理，后续统一使用最新版本。</li></ul><p class="modal-description">确认纪要后，今天的常规待办就处理完了。</p>`;
}
function modalFrame(title,body,actions='',wide=false,symbol='file'){return `<div class="modal-backdrop" data-action="overlay-close"><section class="modal ${wide?'wide':''}" role="dialog" aria-modal="true" aria-labelledby="modal-title" tabindex="-1"><header class="modal-header"><h2 id="modal-title">${icon(symbol)}${title}</h2><button class="close-btn" data-action="close" aria-label="关闭窗口">${icon('close')}</button></header>${body}${actions}</section></div>`;}
function renderModal(){
 const root=document.getElementById('modal-root');
 const background=document.getElementById('desktop');background.inert=!!ui.modal;
 if(!ui.modal){root.innerHTML='';return;}
 const {kind}=ui.modal;let html='';
 if(kind==='leave'){
  const unfinished=tasks.length-state.completed.length;
  html=modalFrame('离开电脑 · 我的安排',`<div class="modal-body"><p class="modal-description">${state.clock<'17:20'?'结束今天的工作，余下时间不再处理新文件。晚间安排如下。':'今天先到这里。接下来打算做什么？'}</p><p class="tiny">${unfinished?`还有 ${unfinished} 项常规工作未完成，会保留到明天。`:'今日常规工作已完成。'}${state.overtimeOffered&&state.overtimeReply!=='deferred'?' 汇总表将回复主管明早处理。':''}</p>
  <fieldset class="departure-options"><legend>今晚的安排</legend><label><input type="radio" name="departure" value="basketball" data-departure><span><strong>现在出门赴约</strong><small>${state.clock<'17:20'?'傍晚 18:05 出门，':''}18:30 到球场。${state.friendReply==='yes'?'会告诉阿远已经出门。':'会先联系阿远，重新确认见面。'}</small></span></label><label><input type="radio" name="departure" value="rest" data-departure><span><strong>今晚在家休息</strong><small>${state.friendReply==='no'?'今晚不再安排工作。':'会先告诉阿远今晚不去，让他不用等。'}</small></span></label></fieldset>
  ${savePromptHTML()}<p class="tiny">取消后仍可留在电脑前，修改回复或处理文件。</p></div>`,`<footer class="modal-actions"><button class="btn" data-action="close">返回电脑</button><button class="btn primary" data-action="confirm-leave" disabled>确认安排并离开</button></footer>`,false,'logout');
 }else if(kind==='sleep'){
  html=modalFrame('合上电脑',`<div class="modal-body"><h3>今天就到这里。</h3><p class="modal-description">${state.activity==='overtime'?'汇总表已经提交。':state.activity==='basketball'?'球已经打完，今晚的消息还留在这里。':'今晚已经歇了歇。'}合上电脑休息，明早再打开。</p>${savePromptHTML()}</div>`,`<footer class="modal-actions"><button class="btn" data-action="close">再看一会儿</button><button class="btn primary" data-action="confirm-sleep">合上电脑</button></footer>`,false,'moon');
 }else if(kind==='scene'){
  const basketball=ui.modal.activity==='basketball';
  html=modalFrame('离开电脑之后',`<div class="scene"><div class="eyebrow">周一 · ${basketball?'18:30 → 22:10':'20:30 → 21:30'}</div><h3>${basketball?'“总算来了，正好差一个。”':'吃过饭，翻了几页书。'}</h3><p>${basketball?'阿远把球抛过来。散场后，你们又聊了一会儿。':'今晚没有再打开新的工作文件。'}</p><p class="scene-quiet">${state.clock}，${basketball?'回到家':'睡前'}。阿远留了条消息。</p></div>`,`<footer class="modal-actions"><span></span><button class="btn primary" data-action="scene-continue">回到电脑，查看消息</button></footer>`,false,basketball?'ball':'moon');
 }else if(kind==='help'){
  html=modalFrame('关于这台电脑',`<div class="modal-body"><h3>未保存的工作日志 · 第一幕 v0.4</h3><p class="modal-description">这是虚构的个人电脑。办公、私人聊天与个人日历彼此独立，不连接真实账号，也不会向真实的人发送消息。</p><p>阅读、切换应用和保存工作日志都不会推进时间。时间只随提交工作、确认离开或合上电脑等明确操作变化。</p><p>保存工作日志只保存已完成的工作；离开电脑时确认实际安排；当晚的行动结束后，可以合上电脑休息。</p><p class="tiny">本次体验到周二入口为止，周二的文件暂不开放。可回看昨天的消息、日历和记录。</p><p>${escapeHTML(state.migrationNotice||'')}</p><p class="help-storage">${storageBlocked?escapeHTML(loadNotice):storageAvailable?'进度自动保存在当前浏览器。原版存档独立保留。':'浏览器未允许存储，关闭页面前请留意：本次进度可能无法恢复。'}</p></div>`,`<footer class="modal-actions"><button class="btn" data-action="reset">重新开始 v0.4</button>${storageBlocked?'<button class="btn" data-action="reload">重试读取存档</button>':''}<button class="btn primary" data-action="close">返回</button></footer>`,false,'info');
 }else if(kind==='receipt'){
  const task=tasks.find(t=>t.id===ui.modal.taskId);
  html=modalFrame('工作回执',`<div class="modal-body"><span class="chip done">已完成</span><h3 style="margin-top:13px">${task.title}</h3><p class="modal-description">${task.file}</p><div class="modal-summary"><span>周一 ${task.time} 已记录</span><strong>绩效 +${task.reward}</strong></div><p class="tiny">这项工作已经记入日志，不会重复计分。</p></div>`,`<footer class="modal-actions"><span></span><button class="btn primary" data-action="close">知道了</button></footer>`);
 }else if(kind==='archive'){
  html=modalFrame('周一 · 已保存的工作日志',`<div class="modal-body review-archive" style="padding:25px 28px">${journalContent(state.savedEntries,true)}</div>`,`<footer class="modal-actions"><span class="tiny">最后保存：周一 ${state.savedWorkAt||'—'}</span><button class="btn" data-action="close">关闭</button></footer>`);
 }else if(kind==='reset'){
  html=modalFrame('重新开始第一幕',`<div class="modal-body"><h3>重新回到周一早晨？</h3><p class="modal-description">这会清除本原型的本地体验进度，包括已完成的任务和对话选择。不会影响浏览器中的其他内容。</p></div>`,`<footer class="modal-actions"><span></span><div class="button-row"><button class="btn" data-action="close">保留当前进度</button><button class="btn primary" data-action="confirm-reset">重新开始</button></div></footer>`,false,'reset');
 }
 root.innerHTML=html;
 requestAnimationFrame(()=>{const dialog=root.querySelector('[role="dialog"]');if(dialog)dialog.focus({preventScroll:true});});
}
function savePromptHTML(){return state.workDirty?'<label class="checkline save-prompt"><input type="checkbox" data-save-before checked><span>同时保存当前工作日志<small>可以取消勾选；未保存草稿仍会留在这台电脑里。</small></span></label>':'<p class="tiny">当前工作日志已保存。</p>';}
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
  case 'save':if(state.stage!=='tuesday'){saveWork();persist();render();toast('工作日志已保存。');}break;
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
