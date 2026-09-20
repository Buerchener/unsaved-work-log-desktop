'use strict';
const Leisure=(()=>{
 const albums=[['photos/lakeside.png','周末的湖边','上周日 · 傍晚'],['photos/court.png','灯亮起来的时候','和阿远常去的球场'],['photos/desk.png','靠窗的位置','周末午后 · 家里']];
 const tracks=[['lakeside.wav','湖边散步','原创 · 轻柔合成器'],['windowlight.wav','窗边微光','原创 · 午后钢琴音色']];
 let player=null,notificationAudio=null,notificationReady=false;
 const c=()=>Desktop.comp();
 function html(app){
  if(app==='settings')return WinShell.settings();
  if(app==='files')return `<div class="leisure-heading"><small>本机文件</small><h2>我的文件</h2></div><nav class="file-breadcrumb"><button data-desktop="folder" data-folder="home">我的文件</button> / ${c().folder==='home'?'所有文件':c().folder==='work'?'工作资料':'个人收藏'}</nav><div class="file-grid">${c().folder==='home'?['work','personal'].map((x,i)=>`<button data-desktop="folder" data-folder="${x}">${Desktop.appIcon('files')}<strong>${i?'个人收藏':'工作资料'}</strong><small>${i?'照片与便笺':'报告、邮件与纪要'}</small></button>`).join(''):c().folder==='work'?tasks.map(t=>`<button data-desktop="file-task" data-task="${t.id}">${Desktop.appIcon('document')}<strong>${t.file}</strong><small>${state.completed.includes(t.id)?'已处理':'项目文件'}</small></button>`).join(''):`<button data-desktop="launch" data-app="photos">${Desktop.appIcon('photos')}<strong>周末相册</strong><small>3 张本地图片</small></button><button data-desktop="launch" data-app="notes">${Desktop.appIcon('notes')}<strong>周末想做的事</strong><small>个人便笺</small></button>`}</div>`;
  if(app==='games'){const g=c().game;return `<div class="game-cover"><small>MY LIBRARY / 本地游戏</small><h2>给自己几分钟</h2><p>翻开卡片，找出四组相同的图案。</p></div><div class="game-meta"><strong>记忆小岛</strong><span>${g.matched.length===8?'全部找到了！':`已配对 ${g.matched.length/2} / 4 · 翻牌 ${g.moves} 次`}</span><button class="btn" data-desktop="game-reset">重新洗牌</button></div><div class="memory-board">${g.cards.map((x,i)=>`<button data-desktop="card" data-card="${i}" class="${g.matched.includes(i)?'matched':g.open.includes(i)?'flipped':''}" aria-label="卡片 ${i+1}${g.open.includes(i)||g.matched.includes(i)?' '+x:''}" ${g.matched.includes(i)?'disabled':''}>${g.open.includes(i)||g.matched.includes(i)?({leaf:'❧',ball:'◉',moon:'☾',music:'♪'}[x]):'✦'}</button>`).join('')}</div><p class="leisure-footnote">没有倒计时。随时放下，下次接着玩。存档会自动保留。</p><div class="library-shelf"><details><summary>◒ 湖畔慢行 <small>收藏 · 散步随记</small></summary><p>存档：周日黄昏，湖畔长椅。一本没有任务清单的旅行画册。</p></details><details><summary>☾ 星间来信 <small>收藏 · 文字冒险</small></summary><p>存档：第三封信。上次读到邮递员抵达山顶观测站。</p></details></div>`;}
  if(app==='music')return `<div class="music-hero"><div class="record"><span>◒</span></div><div><small>我的播放列表</small><h2>把音量放轻</h2><p>两段留在电脑里的旋律</p></div></div><div class="track-list">${tracks.map((t,i)=>`<button data-desktop="track" data-track="${i}" class="${c().track===i?'selected':''}"><span>0${i+1}</span><strong>${t[1]}<small>${t[2]}</small></strong><span>0:16</span></button>`).join('')}</div><div class="music-controls"><button class="btn primary" data-desktop="play">${player&&!player.paused?'暂停':'播放'}</button><span class="music-status">${player&&!player.paused?'正在播放':'已暂停'} · ${tracks[c().track][1]}</span><progress class="music-progress" max="16" value="${player?.currentTime||0}" aria-label="播放进度"></progress></div>`;
  if(app==='photos'){const p=albums[c().album];return `<div class="photo-top"><strong>周末相册</strong><span>${c().album+1} / 3</span><button class="btn" data-desktop="photo-large">${c().photoLarge?'恢复浏览':'放大查看'}</button></div><figure class="photo-view ${c().photoLarge?'large':''}"><img src="assets/${p[0]}" alt="${p[1]}"><figcaption><strong>${p[1]}</strong><span>${p[2]}</span></figcaption></figure><div class="photo-controls"><button class="btn" data-desktop="photo-prev">上一张</button><div>${albums.map((p,i)=>`<button data-desktop="photo-pick" data-photo="${i}" aria-label="${p[1]}" class="${i===c().album?'selected':''}"><img src="assets/${p[0]}" alt=""></button>`).join('')}</div><button class="btn" data-desktop="photo-next">下一张</button></div>`;}
  if(app==='notes')return `<div class="note-top"><span>个人便笺 / 周末</span><button class="btn" data-desktop="note-save">保存便笺</button></div><textarea class="note-editor" aria-label="便笺内容" spellcheck="false"></textarea><div class="note-status">${c().noteDraft!==null?'草稿保留在本机，尚未保存':'已保存到本机'}</div>`;
  return '';
 }
 function redraw(app){const w=Desktop.win(app);if(w)Desktop.renderWindow(w);}
 function action(a,el){const d=c();
  if(a==='folder'){d.folder=el.dataset.folder;redraw('files');}
  if(a==='file-task')Desktop.openDocument(el.dataset.task);
  if(a==='launch')Desktop.openApp(el.dataset.app);
  if(a==='game-reset'){d.game={cards:['leaf','ball','moon','music','ball','leaf','music','moon'].sort(()=>Math.random()-.5),open:[],matched:[],moves:0};redraw('games');}
  if(a==='card'){const g=d.game,i=+el.dataset.card;if(g.open.includes(i)||g.matched.includes(i))return;if(g.open.length===2)g.open=[];g.open.push(i);g.moves++;if(g.open.length===2&&g.cards[g.open[0]]===g.cards[g.open[1]]){g.matched.push(...g.open);g.open=[];}redraw('games');}
  if(a==='track'){pause();d.track=+el.dataset.track;player=null;redraw('music');}
  if(a==='play')toggle();
  if(a==='photo-next'||a==='photo-prev'){d.album=(d.album+(a==='photo-next'?1:2))%3;redraw('photos');}
  if(a==='photo-pick'){d.album=+el.dataset.photo;redraw('photos');}
  if(a==='photo-large'){d.photoLarge=!d.photoLarge;redraw('photos');}
  if(a==='note-save'){d.notes=document.querySelector('.note-editor').value;d.noteDraft=null;document.querySelector('.note-status').textContent='已保存到本机';toast('便笺已保存。');}
  persist();
 }
 async function toggle(){if(!player||!player.src.endsWith(tracks[c().track][0])){player?.pause();player=new Audio('assets/'+tracks[c().track][0]);player.addEventListener('timeupdate',()=>{const p=document.querySelector('.music-progress');if(p)p.value=player.currentTime;});player.addEventListener('ended',()=>redraw('music'));}if(player.paused){try{await player.play();}catch(e){toast('音频暂时无法播放，请重试。');}}else player.pause();redraw('music');}
 function pause(){player?.pause();}
 function notificationPlayer(){
  if(!notificationAudio){notificationAudio=new Audio('assets/windows-xp-notify.wav');notificationAudio.preload='auto';notificationAudio.volume=.45;notificationAudio.dataset.notificationAudio='true';notificationAudio.hidden=true;document.body.append(notificationAudio);}
  return notificationAudio;
 }
 function unlock(preview=false){notificationReady=true;notificationPlayer();if(preview)chime(true);}
 function chime(preview=false){
  if(!notificationReady||(!preview&&!Desktop.comp().sound))return;
  const a=notificationPlayer();if(!preview&&!a.paused)return;
  a.pause();a.currentTime=0;
  a.play().catch(()=>{if(preview)toast('声音暂时无法播放，请检查浏览器声音设置后重试。');});
 }
 function muteNotifications(){notificationAudio?.pause();if(notificationAudio)notificationAudio.currentTime=0;}
 document.addEventListener('pointerdown',e=>{if(e.isTrusted&&typeof Desktop!=='undefined'&&Desktop.comp()?.sound)unlock();},{passive:true});
 document.addEventListener('keydown',e=>{if(e.isTrusted&&typeof Desktop!=='undefined'&&Desktop.comp()?.sound)unlock();});
 return {html,action,pause,unlock,chime,muteNotifications};
})();
