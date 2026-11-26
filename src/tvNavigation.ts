/** Android TV D-pad navigation; no hardware permissions required. */
export function installTvNavigation(){
 const tv=/Android TV|Google TV|AFT[A-Z]|Smart-TV|SMARTTV|BrowseHere|TV Browser| BRAVIA|Tizen|webOS/i.test(navigator.userAgent)||(navigator.maxTouchPoints===0&&/Android/i.test(navigator.userAgent));
 if(tv)document.documentElement.dataset.tv='true';
 const selector='button:not([disabled]),a[href],input:not([disabled]):not([type=hidden]),textarea:not([disabled]),select:not([disabled]),[tabindex="0"]';
 const listener=(e:KeyboardEvent)=>{
  if(!['ArrowUp','ArrowDown','ArrowLeft','ArrowRight'].includes(e.key)||e.altKey||e.ctrlKey||e.metaKey)return;
  const from=document.activeElement as HTMLElement|null;
  if(from?.matches('input,textarea,select,[contenteditable="true"]'))return;
  document.documentElement.dataset.tv='true';
  const root=document.querySelector('.uac-backdrop,.cloud-modal,.in-dialog')||document.querySelector('.flyout')||document;
  const visible=Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(el=>{const r=el.getBoundingClientRect();if(el.hidden||r.width<4||r.height<4)return false;const st=getComputedStyle(el);if(st.visibility==='hidden'||st.display==='none')return false;const cx=Math.max(1,Math.min(innerWidth-1,r.left+r.width/2)),cy=Math.max(1,Math.min(innerHeight-1,r.top+r.height/2));const top=document.elementFromPoint(cx,cy);return r.bottom>0&&r.top<innerHeight&&r.right>0&&r.left<innerWidth&&!!top&&(el===top||el.contains(top)||top.contains(el))});
  if(!visible.length)return;
  const choose=(el:HTMLElement)=>{e.preventDefault();e.stopPropagation();el.focus({preventScroll:true});el.scrollIntoView({block:'nearest',inline:'nearest',behavior:'auto'})};
  if(!from||from===document.body||!visible.includes(from)){choose(visible[0]);return}
  const r=from.getBoundingClientRect(),x=r.left+r.width/2,y=r.top+r.height/2,axis=e.key==='ArrowLeft'||e.key==='ArrowRight',sign=e.key==='ArrowLeft'||e.key==='ArrowUp'?-1:1;
  let best:HTMLElement|undefined,score=Infinity;
  for(const el of visible){if(el===from)continue;const t=el.getBoundingClientRect(),dx=t.left+t.width/2-x,dy=t.top+t.height/2-y,forward=(axis?dx:dy)*sign,side=Math.abs(axis?dy:dx);if(forward<4)continue;const s=forward+side*2.8;if(s<score){score=s;best=el}}
  if(best)choose(best);
 };
 window.addEventListener('keydown',listener,true);return()=>window.removeEventListener('keydown',listener,true);
}
