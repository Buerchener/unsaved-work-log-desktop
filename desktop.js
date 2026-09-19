'use strict';
const Desktop=(()=>{
 const apps={
  settings:{name:'设置',symbol:'settings',color:'gray',w:850,h:640},
  office:{name:'协作空间',symbol:'work',color:'blue',w:980,h:660},chat:{name:'聊天',symbol:'chat',color:'green',w:660,h:570},
  email:{name:'邮件',symbol:'mail',color:'sky',w:760,h:600},calendar:{name:'个人日历',symbol:'calendar',color:'coral',w:700,h:570},
  files:{name:'我的文件',symbol:'folder',color:'amber',w:760,h:560},games:{name:'游戏库',symbol:'game',color:'violet',w:690,h:590},
  music:{name:'音乐',symbol:'music',color:'rose',w:620,h:470},photos:{name:'相册',symbol:'photo',color:'teal',w:760,h:590},notes:{name:'便笺',symbol:'note',color:'yellow',w:560,h:470}
 };
 icons.search='<circle cx="10" cy="10" r="6"/><path d="m15 15 5 5"/>';
 icons.game='<path d="M7 7h10c3 0 5 10 3 12-2 2-4-3-5-3H9c-1 0-3 5-5 3C2 17 4 7 7 7Z"/><path d="M8 10v5m-2-2h4M16 11h.01M18 14h.01"/>';
 icons.music='<path d="M9 18V5l11-2v13M9 8l11-2"/><ellipse cx="6" cy="18" rx="3" ry="2"/><ellipse cx="17" cy="16" rx="3" ry="2"/>';
 icons.photo='<rect x="3" y="3" width="18" height="18" rx="3"/><circle cx="9" cy="8" r="2"/><path d="m3 18 6-6 4 4 3-4 5 6"/>';
 icons.note='<path d="M4 3h16v13l-5 5H4Z M15 21v-5h5M8 8h8M8 12h6"/>';
 icons.bell='<path d="M5 17h14l-2-4V9a5 5 0 0 0-10 0v4ZM10 20h4"/>';
 icons.volume='<path d="m3 9 4 0 5-4v14l-5-4H3ZM16 8q5 4 0 8M19 5q7 7 0 14"/>';
 icons.maximize='<rect x="5" y="5" width="14" height="14" rx="1"/>';
 icons.minimize='<path d="M5 16h14"/>';
 icons.restore='<path d="M8 8V4h12v12h-4"/><rect x="4" y="8" width="12" height="12" rx="1"/>';
 let activeBanners=new Map(),notificationJob=null,introTimer=null,observer=null,drag=null,selected=null;
 const defaults=()=>({wallpaper:'bloom-light.jpg',windows:[],front:null,z:10,officeTab:'work',conversation:'ayuan',sound:false,notes:'周末想做的事\n\n给植物换个盆。\n补完湖边那张画。\n读完《看不见的城市》。\n\n阿远说新开的球场灯不错，下次去试试。',noteDraft:null,album:0,folder:'home',game:{cards:['leaf','ball','moon','music','ball','leaf','music','moon'],open:[],matched:[],moves:0},track:0});
 function comp(){return state.computer;}
 function win(id){return comp().windows.find(w=>w.id===id);}
 function badge(id){return id==='office'?unread('work'):id==='chat'?unread('personal'):0;}
 function appIcon(id){return WinShell.appIcon(id);}
 function bounds(w){const mobile=innerWidth<700,aw=innerWidth,ah=innerHeight-48;
  if(mobile){return {x:6,y:8,w:aw-12,h:ah-16};}
  if(w.max)return {x:0,y:0,w:aw,h:ah};
  w.w=Math.max(Math.min(420,aw-24),Math.min(w.w,aw-24));w.h=Math.max(Math.min(330,ah-16),Math.min(w.h,ah-16));
  w.x=Math.max(0,Math.min(w.x,aw-w.w));w.y=Math.max(0,Math.min(w.y,ah-w.h));return w;
 }
 function applyWindow(w){const el=document.querySelector(`[data-window="${w.id}"]`);if(!el)return;const r=bounds(w);el.style.left=r.x+'px';el.style.top=r.y+'px';el.style.width=r.w+'px';el.style.height=r.h+'px';el.style.zIndex=w.z;el.hidden=w.min;el.classList.toggle('foreground',comp().front===w.id);el.classList.toggle('maximized',w.max);if(innerWidth<700)el.hidden=w.min||comp().front!==w.id;const b=el.querySelector('[data-wm="maximize"]');b.innerHTML=icon(w.max?'restore':'maximize');b.setAttribute('aria-label',w.max?'还原窗口':'最大化窗口');}
 function focus(id,keyboard=false){const w=win(id);if(!w)return;w.min=false;w.z=++comp().z;comp().front=id;for(const item of comp().windows)applyWindow(item);chrome();persist();if(keyboard)document.querySelector(`[data-window="${id}"] .window-titlebar`).focus({preventScroll:true});requestAnimationFrame(readVisible);}
 function create(id,app,data={}){let w=win(id);if(w){focus(id);return w;}const a=apps[app]||{w:860,h:630};const n=comp().windows.length;w={id,app,x:150+(n%5)*34,y:64+(n%5)*27,w:a.w,h:a.h,z:++comp().z,min:false,max:false,data};comp().windows.push(w);mount(w);focus(id,true);return w;}
 function mount(w){const el=document.createElement('section');el.className='app-window';el.dataset.window=w.id;el.dataset.app=w.app;el.setAttribute('aria-label',title(w));el.innerHTML=`<header class="window-titlebar" tabindex="-1">${appIcon(w.app)}<span class="window-name">${escapeHTML(title(w))}</span><div class="window-controls"><button data-wm="minimize" aria-label="最小化窗口">${icon('minimize')}</button><button data-wm="maximize" aria-label="最大化窗口">${icon('maximize')}</button><button data-wm="close" aria-label="关闭窗口">${icon('close')}</button></div></header><div class="window-content app-surface"></div><button class="resize-handle" data-wm="resize" aria-label="调整窗口大小（方向键微调）"></button>`;document.getElementById('windows').append(el);renderWindow(w);applyWindow(w);}
 function title(w){return w.app==='document'?(w.data.task==='overtime'?'明早汇总表.xlsx':tasks.find(t=>t.id===w.data.task)?.file||'文档'):apps[w.app].name;}
 function openApp(id){if(!apps[id])return;const w=create(id,id);if(id==='email')w.data.task='email';renderWindow(w);focus(id,true);if(id==='chat'||id==='office')scrollChat(id);}
 function openDocument(id){
  const t=tasks.find(t=>t.id===id);if(!t&&id!=='overtime')return;
  if(id==='email'){openApp('email');return;}
  if(id==='overtime'&&!state.overtimeOffered){toast('主管还没有发来这份文件。');return;}
  if(t&&!state.completed.includes(id)&&(!canWork()||tasks[state.completed.length]?.id!==id)){toast(state.stage==='tuesday'?'周二的工作尚未开放。':'这份文件还在等待前一项事项。');return;}
  const w=create('doc-'+id,'document',{task:id,checks:{},notify:state.friendReply!=='no'});renderWindow(w);focus(w.id,true);
 }
 function close(id){const w=win(id);if(!w)return;if(w.app==='notes'){comp().noteDraft=document.querySelector(`[data-window="notes"] textarea`)?.value??comp().noteDraft;}if(w.app==='music')Leisure.pause();comp().windows=comp().windows.filter(x=>x.id!==id);document.querySelector(`[data-window="${id}"]`)?.remove();if(comp().front===id)comp().front=comp().windows.filter(x=>!x.min).sort((a,b)=>b.z-a.z)[0]?.id||null;for(const item of comp().windows)applyWindow(item);chrome();persist();requestAnimationFrame(readVisible);}
 function minimize(id){const w=win(id);w.min=true;if(comp().front===id)comp().front=comp().windows.filter(x=>!x.min).sort((a,b)=>b.z-a.z)[0]?.id||null;for(const item of comp().windows)applyWindow(item);chrome();persist();}
 function showDesktop(){for(const w of comp().windows){w.min=true;applyWindow(w);}comp().front=null;chrome();persist();}
 function clearWindows(){Leisure.pause();comp().windows=[];comp().front=null;document.getElementById('windows').replaceChildren();chrome();}
 function taskChecks(id){return (win(id==='email'?'email':'doc-'+id)?.data.checks)||{};}
 function taskNotify(){return win('doc-overtime')?.data.notify??true;}
 function hasTask(id){const w=win(id==='email'?'email':'doc-'+id);return !!w&&!w.min;}
 function checkChanged(el){const w=win(el.closest('[data-window]').dataset.window);w.data.checks||={};w.data.checks[el.dataset.check]=el.checked;const btn=el.closest('.window-content').querySelector('[data-action="complete-task"],[data-action="complete-overtime"]');const id=w.data.task;btn.disabled=id==='report'?!(w.data.checks.number&&w.data.checks.note):id==='archive'?!w.data.checks.archive:id==='overtime'?!w.data.checks.overtime:false;persist();}
 function notifyChanged(el){win(el.closest('[data-window]').dataset.window).data.notify=el.checked;persist();}
 function taskView(id){const t=tasks.find(t=>t.id===id);const completed=id==='overtime'?state.overtimeDone:state.completed.includes(id);const enabled=id==='overtime'?canWork()&&state.overtimeOffered:canWork()&&tasks[state.completed.length]?.id===id;
  if(id==='overtime')return `<div class="document-toolbar">项目协作 / 汇总文件</div><div class="document-body"><h2>明早的汇总表</h2><p>整理需求数量、排期与新增需求说明。</p><table class="doc-table"><tr><th>事项</th><th>来源</th></tr><tr><td>本月需求：38</td><td>项目报告</td></tr><tr><td>已确认排期：31</td><td>共享目录</td></tr><tr><td>两条新增需求</td><td>会议纪要</td></tr></table><div class="overtime-note">预计完成于 <strong>19:40</strong>，需要继续工作到晚间。</div>${!completed&&enabled?`<label class="checkline"><input type="checkbox" data-check="overtime">核对来源，并完成汇总</label><aside class="local-reminder"><strong>本机私人提醒</strong><p>18:30 和阿远打球。完成汇总会错过开球时间。</p>${state.friendReply!=='no'?'<label class="checkline"><input type="checkbox" data-notify="friend">提交前给阿远留言，说明今晚去不了。</label>':'<p>你已经告诉阿远今晚不去。</p>'}</aside>`:''}</div><footer class="document-actions">${completed?'<span class="chip done">已提交 · 19:40 · 绩效 +8</span>':`<span>可暂不提交，切换应用调整安排。</span><button class="btn primary" data-action="complete-overtime" disabled>处理并提交汇总表</button>`}</footer>`;
  if(!t)return '';
  return `<div class="document-toolbar">${id==='email'?'发件草稿 / 客户项目组':'项目协作 / 周一'} <span>${completed?'已处理':enabled?'待处理':'等待前序事项'}</span></div><div class="document-body">${taskModalHTML(t)}</div><footer class="document-actions">${completed?`<span class="chip done">${id==='email'?'已发送':'已提交'} · ${t.time} · 绩效 +${t.reward}</span>`:`<span>提交回执将发到协作空间</span><button class="btn primary" data-action="complete-task" data-task="${id}" ${!enabled||['report','archive'].includes(id)?'disabled':''}>${id==='email'?'发送更新版':id==='archive'?'确认归档':id==='meeting'?'确认纪要':'提交更新版'}</button>`}</footer>`;
 }
 function renderWindow(w){
  const content=document.querySelector(`[data-window="${w.id}"] .window-content`);if(!content)return;
  const priorStream=content.querySelector('.chat-stream');const previousScroll=priorStream?.scrollTop??0;const bottom=!priorStream||priorStream.scrollHeight-priorStream.clientHeight-previousScroll<55;const priorFocus=document.activeElement;const focusId=content.contains(priorFocus)?priorFocus.getAttribute('data-focus'):null;
  let html='';if(w.app==='office'){
   const previous=ui.app;ui.app=comp().officeTab;
   const tabs=[['work','消息'],['overview','任务'],['documents','文档'],['journal','日志']];
   html=`<div class="office-header"><span>项目协作</span><span>今日绩效 <strong>${state.performance} / ${state.stage==='tuesday'?25:20}</strong></span></div><nav class="office-tabs">${tabs.map(([id,name])=>`<button data-action="nav" data-app="${id}" class="${comp().officeTab===id?'active':''}">${name}</button>`).join('')}</nav><div class="office-view ${comp().officeTab==='work'?'messaging':''}">${viewHTML()}</div>${footerHTML()}`;ui.app=previous;
  }else if(w.app==='chat'){
   html=chatHTML('personal');
   if(comp().conversation==='lin')html=`<div class="chat-layout"><aside class="chat-contacts">${contactButtons()}</aside><section class="chat-main"><div class="chat-titlebar"><strong>小林</strong></div><div class="chat-stream"><div class="chat-time">上周六</div><div class="bubble-row"><span class="avatar">林</span><div class="bubble">你上次拍的湖边那张真好看，发我当壁纸吧。</div></div><div class="bubble-row mine"><div class="bubble">发你啦，天气好的时候再去一次。</div></div></div><div class="chat-composer"><span class="tiny">这段聊天已保留。</span></div></section></div>`;
   else html=html.replace(/<aside class="chat-contacts">[\s\S]*?<\/aside>/,`<aside class="chat-contacts">${contactButtons()}</aside>`);
  }else if(w.app==='document'||w.app==='email')html=taskView(w.app==='email'?'email':w.data.task);
  else if(w.app==='calendar')html=calendarHTML();
  else html=Leisure.html(w.app,w);
  content.innerHTML=html;
  if(w.data.checks)for(const box of content.querySelectorAll('[data-check]'))box.checked=!!w.data.checks[box.dataset.check];
  const notify=content.querySelector('[data-notify]');if(notify)notify.checked=w.data.notify!==false;
  const taskId=w.app==='email'?'email':w.data.task;if(taskId){const c=w.data.checks||{},btn=content.querySelector('[data-action="complete-task"],[data-action="complete-overtime"]');if(btn&&['report','archive','overtime'].includes(taskId))btn.disabled=taskId==='report'?!(c.number&&c.note):taskId==='archive'?!c.archive:!c.overtime;}
  const stream=content.querySelector('.chat-stream');if(stream){stream.scrollTop=bottom?stream.scrollHeight:previousScroll;stream.addEventListener('scroll',readVisible,{passive:true});}
  if(focusId)content.querySelector(`[data-focus="${focusId}"]`)?.focus({preventScroll:true});
  if(w.app==='notes'){const area=content.querySelector('textarea');area.value=comp().noteDraft??comp().notes;}
  observeMessages();
 }
 function contactButtons(){return `<div class="contact-label">消息</div><button class="contact ${comp().conversation==='ayuan'?'selected':''}" data-desktop="contact" data-contact="ayuan"><span class="avatar friend">远</span><span>阿远${unread('personal')?`<b class="unread-number">${unread('personal')}</b>`:''}</span></button><button class="contact ${comp().conversation==='lin'?'selected':''}" data-desktop="contact" data-contact="lin"><span class="avatar">林</span><span>小林</span></button>`;}
 function refreshStory(){for(const w of comp().windows)if(['office','chat','document','email','calendar'].includes(w.app))renderWindow(w);chrome();scheduleNotifications();}
 function chrome(){
  const shortcuts=document.getElementById('shortcuts');if(!shortcuts.children.length)shortcuts.innerHTML=Object.entries(apps).filter(([id])=>id!=='settings').map(([id,a])=>`<button class="desktop-shortcut" data-launch="${id}" aria-label="${a.name}" title="双击打开 ${a.name}">${appIcon(id)}<span>${a.name}</span><b class="shortcut-badge" hidden></b></button>`).join('');
  for(const el of shortcuts.children){const n=badge(el.dataset.launch),b=el.querySelector('b');b.hidden=!n;b.textContent=n;}
  document.getElementById('desktop').style.backgroundImage=`url('assets/wallpapers/${WinShell.wallpapers.some(x=>x.file===comp().wallpaper)?comp().wallpaper:'bloom-light.jpg'}')`;
  shortcuts.style.gridTemplateRows=`repeat(${Math.max(3,Math.floor((innerHeight-65)/96))},90px)`;
  const taskbar=document.getElementById('taskbar');taskbar.innerHTML=`<div class="taskbar-center"><button class="taskbar-system start-button" data-desktop="menu" aria-label="开始" title="开始">${WinShell.logo()}</button><button class="taskbar-system" data-desktop="search" aria-label="搜索应用" title="搜索">${icon('search')}</button><div class="taskbar-apps">${Object.entries(apps).filter(([id])=>id!=='settings'||win(id)).map(([id,a])=>`<button class="taskbar-app ${win(id)?'running':''} ${comp().front===id?'selected':''}" data-taskbar="${id}" aria-label="${a.name}" title="${a.name}">${appIcon(id)}${badge(id)?`<b>${badge(id)}</b>`:''}</button>`).join('')}${comp().windows.filter(w=>w.app==='document').map(w=>`<button class="taskbar-app running ${comp().front===w.id?'selected':''}" data-taskbar="${w.id}" title="${escapeHTML(title(w))}" aria-label="${escapeHTML(title(w))}">${appIcon('document')}</button>`).join('')}</div></div><div class="system-tray"><span class="input-language" title="中文输入">中</span><button class="tray-quick" data-desktop="quick-settings" aria-label="快速设置">${WinShell.wifi()}${icon('volume')}<span class="battery-icon" aria-hidden="true"></span></button><button class="tray-date" data-desktop="notifications" aria-label="通知中心"><span class="desktop-clock"><strong>${state.clock}</strong><small>${state.stage==='tuesday'?'星期二':'星期一'}</small></span>${icon('bell')}${unread('work')+unread('personal')?'<i></i>':''}</button><button class="show-desktop-edge" data-desktop="show-desktop" aria-label="显示桌面" title="显示桌面"></button></div>`;
  const contact=document.querySelector('[data-contact="ayuan"] .unread-number');if(contact){contact.textContent=unread("personal");contact.hidden=!unread("personal");}
  renderCenter();
 }
 function renderCenter(){const c=document.getElementById('notification-center');if(c.hidden)return;c.innerHTML=`<header><strong>通知中心</strong><button class="icon-button" data-desktop="notifications" aria-label="关闭通知中心">${icon('close')}</button></header>${[...state.notifications].reverse().map(n=>`<button class="notification-history" data-notification-open="${n.id}">${appIcon(n.channel==='personal'?'chat':'office')}<span><strong>${n.channel==='personal'?'聊天 · 阿远':'协作空间 · 主管'}</strong><p>${escapeHTML(n.text)}</p><small>${escapeHTML(n.time)} · ${message(n)?.read?'已读':'未读'}</small></span></button>`).join('')||'<p class="empty-note">还没有新的通知。</p>'}`;}
 function message(n){return (n.channel==='personal'?state.privateMessages:state.workMessages).find(m=>m.id===n.id);}
 function foregroundChannel(channel){if(ui.modal)return false;const id=channel==='personal'?'chat':'office',w=win(id);return !!w&&!w.min&&comp().front===id&&(channel==='personal'?comp().conversation==='ayuan':comp().officeTab==='work');}
 function observeMessages(){if(!observer)observer=new IntersectionObserver(()=>readVisible(),{threshold:.45});observer.disconnect();document.querySelectorAll('[data-message]').forEach(el=>observer.observe(el));requestAnimationFrame(readVisible);}
 function readVisible(){if(document.hidden||ui.modal)return;let changed=false;
  for(const channel of ['work','personal']){if(!foregroundChannel(channel))continue;const id=channel==='personal'?'chat':'office',root=document.querySelector(`[data-window="${id}"] .chat-stream`);if(!root)continue;const r=root.getBoundingClientRect();for(const row of root.querySelectorAll('[data-message]')){const b=row.getBoundingClientRect();if(b.bottom>r.top+8&&b.top<r.bottom-8){const m=(channel==='personal'?state.privateMessages:state.workMessages).find(m=>m.id===row.dataset.message);if(m&&!m.read){m.read=true;changed=true;if(activeBanners.has(m.id))dismiss(m.id);}}}}
  if(changed){persist();chrome();}
 }
 function scrollChat(id,target=null){requestAnimationFrame(()=>{const root=document.querySelector(`[data-window="${id}"] .chat-stream`);if(!root)return;if(target)root.querySelector(`[data-message="${target}"]`)?.scrollIntoView({block:'center'});else root.scrollTop=root.scrollHeight;readVisible();});}
 function scheduleNotifications(){clearTimeout(notificationJob);notificationJob=setTimeout(pump,30);}
 function pump(){
  const pending=state.notifications.filter(n=>!n.shown);
  for(const n of pending){if(activeBanners.size>=2)break;
   if(n.id==='work-intro'&&!state.openingShown)continue;
   if(n.id==='overtime-offer'&&!n.ready){n.ready=true;persist();setTimeout(()=>{n.ready='go';persist();scheduleNotifications();},900);continue;}
   if(n.id==='overtime-offer'&&n.ready===true)continue;
   n.shown=true;persist();if(message(n)?.read||foregroundChannel(n.channel)){readVisible();continue;}showBanner(n);
  }
 }
 function showBanner(n){const el=document.createElement('article');el.className='notification-banner';el.dataset.banner=n.id;el.innerHTML=`<button class="banner-open" data-notification-open="${n.id}">${appIcon(n.channel==='personal'?'chat':'office')}<span><strong>${n.channel==='personal'?'聊天 · 阿远':'协作空间 · 主管'}<small>${escapeHTML(n.time)}</small></strong><p>${escapeHTML(n.text)}</p></span></button><button class="banner-dismiss" data-notification-dismiss="${n.id}" aria-label="收起通知">${icon('close')}</button>`;
  document.getElementById('banners').append(el);const info={el,timer:null,remaining:8000,start:0,hover:false,focus:false};activeBanners.set(n.id,info);
  const pause=()=>{if(info.timer){clearTimeout(info.timer);info.remaining-=performance.now()-info.start;info.timer=null;}};
  const resume=()=>{if(info.hover||info.focus||info.timer)return;info.start=performance.now();info.timer=setTimeout(()=>dismiss(n.id),Math.max(0,info.remaining));};
  el.addEventListener('mouseenter',()=>{info.hover=true;pause();});el.addEventListener('mouseleave',()=>{info.hover=false;resume();});el.addEventListener('focusin',()=>{info.focus=true;pause();});el.addEventListener('focusout',()=>{requestAnimationFrame(()=>{info.focus=el.contains(document.activeElement);resume();});});resume();if(comp().sound)Leisure.chime();
 }
 function dismiss(id){const entry=activeBanners.get(id);if(entry){clearTimeout(entry.timer);entry.el.remove();activeBanners.delete(id);}const n=state.notifications.find(n=>n.id===id);if(n){n.dismissed=true;persist();}scheduleNotifications();}
 function openNotification(id){const n=state.notifications.find(n=>n.id===id);if(!n)return;dismiss(id);if(n.channel==='personal'){comp().conversation='ayuan';openApp('chat');scrollChat('chat',id);}else{comp().officeTab='work';openApp('office');scrollChat('office',id);}document.getElementById('notification-center').hidden=true;}
 function init(){
  state.computer={...defaults(),...(state.computer||{})};state.computer.windows=state.computer.windows.filter(w=>apps[w.app]||w.app==='document');
  state.notifications||=[];for(const m of [...state.workMessages,...state.privateMessages])if(typeof m.read!=='boolean')m.read=m.side==='me';
  if(!state.notifications.length&&state.openingShown){for(const channel of ['work','personal'])for(const m of channel==='work'?state.workMessages:state.privateMessages)if(m.side==='them')state.notifications.push({id:m.id,channel,text:m.text,time:m.time,shown:true,dismissed:true,delivered:true});}
  if(!state.openingShown&&!state.notifications.some(n=>n.id==='work-intro')){const m=state.workMessages.find(m=>m.id==='work-intro');state.notifications.push({id:m.id,channel:'work',text:m.text,time:m.time,shown:false,dismissed:false,delivered:true});}
  for(const n of state.notifications)if(n.id==='overtime-offer'&&n.ready===true)n.ready='go';
  for(const w of comp().windows)mount(w);chrome();persist();
  if(!state.openingShown)introTimer=setTimeout(()=>{state.openingShown=true;persist();scheduleNotifications();},1400);else scheduleNotifications();
  if(storageBlocked)setTimeout(()=>toast(loadNotice),800);
  if(state.migrationNotice&&!comp().migrationShown){comp().migrationShown=true;persist();setTimeout(()=>toast('旧进度已保留。详情见电脑菜单中的帮助。'),800);}
 }
 function newGame(){clearTimeout(introTimer);clearTimeout(notificationJob);for(const v of activeBanners.values())clearTimeout(v.timer);activeBanners.clear();document.getElementById('banners').replaceChildren();document.getElementById('windows').replaceChildren();document.getElementById('shortcuts').replaceChildren();Leisure.pause();state.computer=defaults();init();}
 document.addEventListener('dblclick',e=>{const shortcut=e.target.closest('[data-launch]');if(shortcut)openApp(shortcut.dataset.launch);const bar=e.target.closest('.window-titlebar');if(bar&&!e.target.closest('button'))toggleMax(bar.closest('[data-window]').dataset.window);});
 function toggleMax(id){const w=win(id);w.max=!w.max;focus(id);applyWindow(w);persist();}
 document.addEventListener('click',e=>{
  const shortcut=e.target.closest('[data-launch]');if(shortcut){selected=shortcut.dataset.launch;document.querySelectorAll('[data-launch]').forEach(b=>b.classList.toggle('selected',b===shortcut));if(matchMedia('(pointer:coarse)').matches)openApp(selected);return;}
  const task=e.target.closest('[data-taskbar]');if(task){const id=task.dataset.taskbar;if(win(id)){if(comp().front===id&&!win(id).min)minimize(id);else focus(id,true);}else openApp(id);return;}
  const wc=e.target.closest('[data-wm]');if(wc){const id=wc.closest('[data-window]').dataset.window;if(wc.dataset.wm==='close')close(id);if(wc.dataset.wm==='minimize')minimize(id);if(wc.dataset.wm==='maximize')toggleMax(id);return;}
  const no=e.target.closest('[data-notification-open]');if(no){openNotification(no.dataset.notificationOpen);return;}const nd=e.target.closest('[data-notification-dismiss]');if(nd){dismiss(nd.dataset.notificationDismiss);return;}
  const a=e.target.closest('[data-desktop]');if(!a)return;
  switch(a.dataset.desktop){
   case 'show-desktop':showDesktop();break;
   case 'notifications':{const c=document.getElementById('notification-center');c.hidden=!c.hidden;renderCenter();break;}
   case 'sound':comp().sound=!comp().sound;if(comp().sound)Leisure.unlock();persist();chrome();break;
   case 'menu':WinShell.toggleStart();break;
   case 'search':WinShell.toggleStart(true);break;
   case 'quick-settings':WinShell.quickSettings();break;
   case 'contact':comp().conversation=a.dataset.contact;renderWindow(win('chat'));persist();scrollChat('chat');break;
   case 'calendar-detail':{const detail=document.querySelector('[data-window="calendar"] .event-detail');if(detail)detail.remove();else document.querySelector('[data-window="calendar"] .window-content').insertAdjacentHTML('beforeend',`<div class="event-detail"><strong>18:30 · 和阿远打球</strong><p>室外2号场 · ${actualPlanStatus()}</p><p>球和水杯记得带上。</p><button class="btn" data-action="nav" data-app="personal">联系阿远</button></div>`);break;}
   default:if(!WinShell.action(a.dataset.desktop,a))Leisure.action(a.dataset.desktop,a);
  }
 });
 document.addEventListener('click',e=>{if(e.target.closest('[data-action]'))document.getElementById('system-menu').hidden=true;});
 document.addEventListener('keydown',e=>{const shortcut=e.target.closest('[data-launch]');if(shortcut&&e.key==='Enter'){e.preventDefault();openApp(shortcut.dataset.launch);}const h=e.target.closest('.resize-handle');if(h&&e.key.startsWith('Arrow')){const w=win(h.closest('[data-window]').dataset.window);w.w+=e.key==='ArrowRight'?20:e.key==='ArrowLeft'?-20:0;w.h+=e.key==='ArrowDown'?20:e.key==='ArrowUp'?-20:0;applyWindow(w);persist();e.preventDefault();}});
 document.addEventListener('pointerdown',e=>{const el=e.target.closest('[data-window]');if(!el)return;const w=win(el.dataset.window);if(comp().front!==w.id)focus(w.id);if(innerWidth<700||w.max)return;const resize=e.target.closest('.resize-handle');const bar=e.target.closest('.window-titlebar');if(!resize&&(!bar||e.target.closest('button')))return;drag={id:w.id,x:e.clientX,y:e.clientY,ox:w.x,oy:w.y,ow:w.w,oh:w.h,resize:!!resize};e.preventDefault();el.setPointerCapture(e.pointerId);});
 document.addEventListener('pointermove',e=>{if(!drag)return;const w=win(drag.id);if(drag.resize){w.w=drag.ow+e.clientX-drag.x;w.h=drag.oh+e.clientY-drag.y;}else{w.x=drag.ox+e.clientX-drag.x;w.y=drag.oy+e.clientY-drag.y;}applyWindow(w);});
 document.addEventListener('pointerup',()=>{if(drag){drag=null;persist();}});
 document.addEventListener('input',e=>{if(e.target.matches('.note-editor')){comp().noteDraft=e.target.value;const status=document.querySelector(".note-status");if(status)status.textContent="草稿保留在本机，尚未保存";persist();}});
 addEventListener('resize',()=>{for(const w of comp().windows)applyWindow(w);persist();});
 addEventListener('visibilitychange',readVisible);
 return {init,newGame,refreshStory,apps,openApp,openDocument,clearWindows,scrollChat,readVisible,scheduleNotifications,taskChecks,taskNotify,hasTask,checkChanged,notifyChanged,renderWindow,win,comp,appIcon,focus,showDesktop,chrome};
})();
Desktop.init();
