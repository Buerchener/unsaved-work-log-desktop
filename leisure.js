'use strict';
const Leisure=(()=>{
 const albums=[['photos/lakeside.png','A weekend by the lake','Last Sunday · Evening'],['photos/court.png','When the lights come on','The court you and Yuan often visit'],['photos/desk.png','A seat by the window','Weekend afternoon · Home']];
 const tracks=[['lakeside.wav','Walk by the Lake','Original · Gentle synthesizer'],['windowlight.wav','Window Light','Original · Soft afternoon piano']];
 let player=null,notificationAudio=null,notificationReady=false;
 const c=()=>Desktop.comp();
 function html(app){
  if(app==='settings')return WinShell.settings();
  if(app==='files')return `<div class="leisure-heading"><small>Files on this computer</small><h2>My files</h2></div><nav class="file-breadcrumb"><button data-desktop="folder" data-folder="home">My files</button> / ${c().folder==='home'?'All files':c().folder==='work'?'Work files':'Personal collection'}</nav><div class="file-grid">${c().folder==='home'?['work','personal'].map((x,i)=>`<button data-desktop="folder" data-folder="${x}">${Desktop.appIcon('files')}<strong>${i?'Personal collection':'Work files'}</strong><small>${i?'Photos and notes':'Reports, emails, and meeting notes'}</small></button>`).join(''):c().folder==='work'?tasks.map(t=>`<button data-desktop="file-task" data-task="${t.id}">${Desktop.appIcon('document')}<strong>${t.file}</strong><small>${state.completed.includes(t.id)?'Processed':'Project file'}</small></button>`).join(''):`<button data-desktop="launch" data-app="photos">${Desktop.appIcon('photos')}<strong>Weekend album</strong><small>3  local images</small></button><button data-desktop="launch" data-app="notes">${Desktop.appIcon('notes')}<strong>Things to do this weekend</strong><small>Personal notes</small></button>`}</div>`;
  if(app==='games'){const g=c().game;return `<div class="game-cover"><small>MY LIBRARY / Local game</small><h2>Take a few minutes for yourself</h2><p>Turn over cards and find four matching pairs.</p></div><div class="game-meta"><strong>Memory Island</strong><span>${g.matched.length===8?'All pairs found!':`Matched ${g.matched.length/2} / 4 · ${g.moves} moves`}</span><button class="btn" data-desktop="game-reset">Shuffle again</button></div><div class="memory-board">${g.cards.map((x,i)=>`<button data-desktop="card" data-card="${i}" class="${g.matched.includes(i)?'matched':g.open.includes(i)?'flipped':''}" aria-label="Card ${i+1}${g.open.includes(i)||g.matched.includes(i)?' '+x:''}" ${g.matched.includes(i)?'disabled':''}>${g.open.includes(i)||g.matched.includes(i)?({leaf:'❧',ball:'◉',moon:'☾',music:'♪'}[x]):'✦'}</button>`).join('')}</div><p class="leisure-footnote">No timer. Put it down whenever you like and pick it up later. Progress is saved automatically.</p><div class="library-shelf"><details><summary>◒ Lakeside Walk <small>Favorites · Notes from a walk</small></summary><p>Saved: Sunday evening, a bench by the lake. A travel sketchbook without a to-do list.</p></details><details><summary>☾ Letters Among the Stars <small>Favorites · Text adventure</small></summary><p>Saved: Letter three. You last read about the mail carrier reaching the hilltop observatory.</p></details></div>`;}
  if(app==='music')return `<div class="music-hero"><div class="record"><span>◒</span></div><div><small>My playlist</small><h2>Keep the volume low</h2><p>Two melodies kept on this computer</p></div></div><div class="track-list">${tracks.map((t,i)=>`<button data-desktop="track" data-track="${i}" class="${c().track===i?'selected':''}"><span>0${i+1}</span><strong>${t[1]}<small>${t[2]}</small></strong><span>0:16</span></button>`).join('')}</div><div class="music-controls"><button class="btn primary" data-desktop="play">${player&&!player.paused?'Pause':'Play'}</button><span class="music-status">${player&&!player.paused?'Now playing':'Paused'} · ${tracks[c().track][1]}</span><progress class="music-progress" max="16" value="${player?.currentTime||0}" aria-label="Playback progress"></progress></div>`;
  if(app==='photos'){const p=albums[c().album];return `<div class="photo-top"><strong>Weekend album</strong><span>${c().album+1} / 3</span><button class="btn" data-desktop="photo-large">${c().photoLarge?'Resume browsing':'View larger'}</button></div><figure class="photo-view ${c().photoLarge?'large':''}"><img src="assets/${p[0]}" alt="${p[1]}"><figcaption><strong>${p[1]}</strong><span>${p[2]}</span></figcaption></figure><div class="photo-controls"><button class="btn" data-desktop="photo-prev">Previous</button><div>${albums.map((p,i)=>`<button data-desktop="photo-pick" data-photo="${i}" aria-label="${p[1]}" class="${i===c().album?'selected':''}"><img src="assets/${p[0]}" alt=""></button>`).join('')}</div><button class="btn" data-desktop="photo-next">Next</button></div>`;}
  if(app==='notes')return `<div class="note-top"><span>Personal notes / Weekend</span><button class="btn" data-desktop="note-save">Save note</button></div><textarea class="note-editor" aria-label="Note content" spellcheck="false"></textarea><div class="note-status">${c().noteDraft!==null?'Draft kept on this computer, not yet saved':'Saved on this computer'}</div>`;
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
  if(a==='note-save'){d.notes=document.querySelector('.note-editor').value;d.noteDraft=null;document.querySelector('.note-status').textContent='Saved on this computer';toast('Note saved.');}
  persist();
 }
 async function toggle(){if(!player||!player.src.endsWith(tracks[c().track][0])){player?.pause();player=new Audio('assets/'+tracks[c().track][0]);player.addEventListener('timeupdate',()=>{const p=document.querySelector('.music-progress');if(p)p.value=player.currentTime;});player.addEventListener('ended',()=>redraw('music'));}if(player.paused){try{await player.play();}catch(e){toast('Audio could not be played. Please try again.');}}else player.pause();redraw('music');}
 function pause(){player?.pause();}
 function notificationPlayer(){
  if(!notificationAudio){notificationAudio=new Audio('assets/wechat-desktop-notify.wav');notificationAudio.preload='auto';notificationAudio.volume=.45;notificationAudio.dataset.notificationAudio='true';notificationAudio.hidden=true;document.body.append(notificationAudio);}
  return notificationAudio;
 }
 function unlock(preview=false){notificationReady=true;notificationPlayer();if(preview)chime(true);}
 function chime(preview=false){
  if(!notificationReady||(!preview&&!Desktop.comp().sound))return;
  const a=notificationPlayer();if(!preview&&!a.paused)return;
  a.pause();a.currentTime=0;
  a.play().catch(()=>{if(preview)toast('Sound could not be played. Check your browser’s sound settings and try again.');});
 }
 function muteNotifications(){notificationAudio?.pause();if(notificationAudio)notificationAudio.currentTime=0;}
 document.addEventListener('pointerdown',e=>{if(e.isTrusted&&typeof Desktop!=='undefined'&&Desktop.comp()?.sound)unlock();},{passive:true});
 document.addEventListener('keydown',e=>{if(e.isTrusted&&typeof Desktop!=='undefined'&&Desktop.comp()?.sound)unlock();});
 return {html,action,pause,unlock,chime,muteNotifications};
})();
