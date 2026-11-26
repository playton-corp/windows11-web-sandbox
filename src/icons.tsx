import type {CSSProperties} from 'react';
const fills:Record<string,string>={folder:'#efb63c',notepad:'#58afdf',paint:'#d397ed',calc:'#4e97dd',edge:'#08a7ba',store:'#4195e8',terminal:'#21232a',powershell:'#1576c4',taskmgr:'#3696db',regedit:'#45a2c8',control:'#4c9fc8',settings:'#8ca7bd',disk:'#7a94a8',devices:'#7e9bb1',pc:'#367cc6',events:'#66a9d3',recycle:'#afc5d4',photos:'#2789cf',media:'#ce6caa',clock:'#809eab',snip:'#70b8d3',security:'#2792e0',update:'#317bd9',file:'#eee',start:'#208fe9',search:'#567087',user:'#729ec9',power:'#647b92',wifi:'#657e91',battery:'#657e91',volume:'#657e91',desktop:'#699dd9'};
export function Icon({name,size=28,style}:{name:string;size?:number;style?:CSSProperties}){
 const color=fills[name]||'#6198c9';
 const paths:Record<string,React.ReactNode>={
 start:<g fill="#168dec"><path d="M3 3h8.5v8.5H3zM12.5 3H21v8.5h-8.5zM3 12.5h8.5V21H3zM12.5 12.5H21V21h-8.5z"/></g>,
 folder:<><path d="M2 6a2 2 0 0 1 2-2h6l2 3h8a2 2 0 0 1 2 2v11H2Z" fill="#e3a523"/><path d="M2 9h20v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2Z" fill="#f6c34d"/><path d="M5 11h14" stroke="#ffe096" strokeWidth="1.6"/></>,
 pc:<><rect x="2" y="2.8" width="20" height="14.8" rx="2" fill="#8495a8"/><rect x="3.5" y="4.3" width="17" height="11.6" rx="1" fill="#197bc3"/><path d="M9 18h6v3h4v1H5v-1h4Z" fill="#6a7c90"/></>,
 notepad:<><rect x="4" y="2" width="16" height="21" rx="2" fill="#50aee1"/><path d="M7 5h10v16H7Z" fill="#e9f6fb"/><path stroke="#68b2d4" strokeWidth="1" d="M9 8h6m-6 3h6m-6 3h6m-6 3h4"/></>,
 file:<><path d="M5 1h9l5 5v17H5Z" fill="#e9eff4" stroke="#91a2b3"/><path d="M14 1v6h5" fill="#c9d6dd"/><path d="M8 11h8m-8 3h8m-8 3h6" stroke="#8fa5ba"/></>,
 terminal:<><rect x="1" y="3" width="22" height="18" rx="2" fill="#232832" stroke="#91a0b1"/><path d="m5 8 4 4-4 4m6 0h7" fill="none" stroke="#edf1f4" strokeWidth="1.7"/></>,
 powershell:<><rect x="1" y="3" width="22" height="18" rx="2" fill="#197ac7"/><path d="m5 8 5 4-5 4m7 0h7" fill="none" stroke="white" strokeWidth="1.7"/></>,
 edge:<><circle cx="12" cy="12" r="11" fill="#0b5ac1"/><path d="M22 13c-2-4-6-5-10-3-5 2-5 7-1 9 4 3 9 0 11-2-1 5-6 7-11 6C2 22-2 13 3 6 8-2 21 1 23 11Z" fill="#20b9a1"/><path d="M4 10c3-6 13-7 17-1-4-2-10-1-14 3Z" fill="#57d2b8"/></>,
 settings:<><path d="m9.4 2-.9 3-2 .9-2.6-1.5L1.6 8l2.6 2-.1 3-2.6 2 2.3 3.7 2.8-1.3 2 .9.7 3.5h4.7l.8-3.5 2.3-.9 2.7 1.3 2.3-3.7-2.7-2v-3l2.5-2-2.3-3.6-2.5 1.5-2.2-.9-.8-3Z" fill="#91a7ba"/><circle cx="12" cy="12" r="4.4" fill="#d8e8f1" stroke="#627c95" strokeWidth="1.4"/></>,
 store:<><path d="M4 6h16l2 16H2Z" fill="#418ce3"/><path d="M8 7V5a4 4 0 0 1 8 0v2" fill="none" stroke="#a9d9ff" strokeWidth="2"/><path d="M8 11h3.5v3.5H8zm4.5 0H16v3.5h-3.5zM8 15.5h3.5V19H8zm4.5 0H16V19h-3.5z" fill="white"/></>,
 recycle:<><path d="M6 5h12l-1.2 17H7Z" fill="#c6dbe3" stroke="#81a9b8"/><path d="M4 4h16v2H4zM9 2h6v2H9z" fill="#72a0b6"/><path d="m10 10 3-2 3 4-2-1-1 2m-3-2-2 3 3 4 1-2m1 2 4-1 1-4" stroke="#3c9b77" fill="none" strokeWidth="1.3"/></>,
 calc:<><rect x="4" y="1" width="16" height="22" rx="3" fill="#526776"/><rect x="7" y="4" width="10" height="5" rx="1" fill="#d8f0f5"/>{[0,1,2].map(y=>[0,1,2].map(x=><rect key={x+':'+y} x={7+x*3.7} y={11+y*3.6} width="2.5" height="2.5" rx=".6" fill={x===2?'#64baf0':'#c8dbeb'}/>))}</>,
 security:<><path d="M12 1 22 5v7c0 5-6 9-10 11C8 21 2 17 2 12V5Z" fill="#258ce4"/><path d="m7 12 3.5 3.5L17 8" fill="none" stroke="white" strokeWidth="2"/></>,
 search:<><circle cx="10" cy="10" r="6.5" fill="none" stroke="currentColor" strokeWidth="1.6"/><path d="m15 15 6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>,
 user:<><circle cx="12" cy="7" r="4" fill="currentColor"/><path d="M4 22v-4a8 8 0 0 1 16 0v4Z" fill="currentColor"/></>,
 power:<><path d="M12 2v9M6.7 5a9 9 0 1 0 10.6 0" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"/></>,
 wifi:<><path d="M2 8a16 16 0 0 1 20 0M5 12a11 11 0 0 1 14 0m-10 4a5 5 0 0 1 6 0" stroke="currentColor" strokeWidth="1.7" fill="none" strokeLinecap="round"/><circle cx="12" cy="20" r="1.4" fill="currentColor"/></>,
 volume:<><path d="M2 9h4l6-5v16l-6-5H2Z" fill="currentColor"/><path d="M15 8q5 4 0 8m3-11q7 7 0 14" stroke="currentColor" strokeWidth="1.5" fill="none"/></>,
 battery:<><rect x="2" y="6" width="19" height="12" rx="2" stroke="currentColor" fill="none" strokeWidth="1.4"/><rect x="4" y="8" width="15" height="8" rx="1" fill="currentColor"/><path d="M22 10v4" stroke="currentColor" strokeWidth="2"/></>,
 clock:<><circle cx="12" cy="12" r="11" fill="#eef3f6" stroke="#7894a8"/><path d="M12 5v7l5 3" stroke="#3e596e" strokeWidth="1.7" fill="none" strokeLinecap="round"/><circle cx="12" cy="12" r="1.7" fill="#2683ca"/></>,
 paint:<><path d="M12 2a10 10 0 0 0-7 18c2 1 5 2 6-1 .4-1-1-2 0-3 2-2 5 0 8-2 6-5 1-12-7-12Z" fill="#ebd0a5"/><circle cx="6" cy="10" r="2" fill="#e75053"/><circle cx="10" cy="6" r="2" fill="#4d9cf1"/><circle cx="16" cy="6" r="2" fill="#42b75b"/><circle cx="19" cy="10" r="2" fill="#f0c939"/></>,
 photos:<><rect x="2" y="3" width="20" height="18" rx="4" fill="#3c98e3"/><circle cx="16.5" cy="8" r="2.5" fill="#fff1b5"/><path d="M3 19 9 11l4 5 3-3 5 6" fill="#99dcf1"/></>,
 media:<><circle cx="12" cy="12" r="11" fill="#ebadad"/><circle cx="12" cy="12" r="8" fill="#5c2a80"/><path d="m10 7 7 5-7 5Z" fill="white"/></>,
 disk:<><rect x="2" y="4" width="20" height="16" rx="3" fill="#899aa7"/><rect x="4" y="6" width="16" height="9" rx="1" fill="#b9c8d0"/><circle cx="17" cy="17" r="1.4" fill="#3db87c"/><path d="M5 17h7" stroke="white"/></>,
 taskmgr:<><rect x="2" y="3" width="20" height="18" rx="3" fill="#c2e6fb"/><path d="M5 17V9m4 8v-4m4 4V6m4 11v-7" stroke="#2492d6" strokeWidth="2.5"/></>,
 update:<><path d="M20 9a9 9 0 0 0-15-4L2 8m20 8-3 3A9 9 0 0 1 4 15" fill="none" stroke="#2586d8" strokeWidth="3" strokeLinecap="round"/><path d="M2 2v6h6m14 14v-6h-6" fill="none" stroke="#2586d8" strokeWidth="2"/></>,
 regedit:<><g fill="#52a9c8" stroke="#b7e4f3" strokeWidth=".5"><rect x="3" y="3" width="6" height="6"/><rect x="11" y="2" width="5" height="5"/><rect x="17" y="9" width="5" height="5"/><rect x="3" y="11" width="8" height="9"/><rect x="13" y="15" width="7" height="7"/></g></>,
 desktop:<><rect x="2" y="3" width="20" height="14" rx="2" fill="#5999dd"/><path d="M4 5h16v10H4Z" fill="#b9d9fb"/><path d="M8 21h8m-4-4v4" stroke="#4d7195" strokeWidth="2"/></>,
 };
 return <svg width={size} height={size} viewBox="0 0 24 24" style={{color,...style}} aria-hidden="true">{paths[name]||<><rect x="2" y="2" width="20" height="20" rx="4" fill={color}/><path d="M7 7h10v2H7zm0 4h10v2H7zm0 4h7v2H7z" fill="#fff"/></>}</svg>;
}
