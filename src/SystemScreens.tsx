import {useEffect,useState} from 'react';
import {Icon,Glyph} from './icons';
import {Recovery} from './systemApps';
import {download} from './storage';
import type {UIContext} from './uiTypes';
import type {VM} from './model';

export type BootStage='firmware'|'kernel'|'services'|'welcome'|'restart'|'shutdown'|'repair'|'reset';
export function Dots({size=34}:{size?:number}){return <span className="win-loader" style={{width:size,height:size}} role="status" aria-label="Загрузка">{[0,1,2,3,4].map(i=><i key={i} style={{animationDelay:i*.105+'s'}}/>)}</span>}
export function BootScreen({stage,vm,onSetup}:{stage:BootStage;vm:VM;onSetup:()=>void}){
 const login=stage==='welcome';
 const descriptions:Record<BootStage,string>={firmware:'Подготовка оборудования',kernel:'Загрузка Windows',services:'Запуск системных служб',welcome:'Добро пожаловать',restart:'Перезагрузка',shutdown:'Завершение работы',repair:'Диагностика компьютера',reset:'Подготовка Windows'};
 const shutting=['restart','shutdown','repair','reset'].includes(stage);
 return <div className={'boot-screen boot-v2 '+(login?'welcome-boot':'')+(shutting?'action-boot':'')} aria-live="polite">
 {login?<div className="welcome-content"><div className="avatar-lg"><Icon name="user" size={112}/></div><h1>{vm.settings.username}</h1><div className="welcome-status"><Dots size={27}/><span>Добро пожаловать</span></div></div>:<>
 {(stage==='firmware'||stage==='kernel'||stage==='services')&&<div className="boot-mark"><Icon name="start" size={88}/>{stage==='firmware'&&<span>PLAYTON UEFI</span>}</div>}
 <div className="boot-state"><Dots size={39}/><div className="boot-status">{descriptions[stage]}</div>{stage==='repair'&&<small>Проверка виртуального загрузчика и компонентов системы</small>}{stage==='reset'&&<small>Переустановка виртуальных компонентов</small>}</div>
 {stage==='firmware'&&<div className="firmware-details"><p>PLAYTON-PC · {vm.hardware.firmware}</p><p>{vm.hardware.cpu} · {vm.hardware.ram} MB RAM</p><p>Virtual SSD {vm.hardware.ssd} GB · {vm.hardware.secureBoot?'Secure Boot enabled':'Secure Boot disabled'}</p></div>}
 {['firmware','kernel','services'].includes(stage)&&<button title="Параметры встроенного ПО" className="boot-key" onClick={onSetup}><Glyph name="settings" size={15}/> UEFI Setup <kbd>F2</kbd></button>}
 </>}
 </div>
}
export function PowerScreen({onPower,onSetup}:{onPower:()=>void;onSetup:()=>void}){return <div className="off-screen off-v2"><div className="power-led"/><button className="boot-power" title="Включить виртуальный компьютер" aria-label="Включить виртуальный компьютер" onClick={onPower}><Glyph name="power" size={38}/></button><p>Компьютер выключен</p><button className="off-setup" onClick={onSetup}><Glyph name="settings" size={17}/> UEFI Setup</button></div>}
export function LockScreen({vm,login,time,onWake,onUnlock,onRestart,onOff}:{vm:VM;login:boolean;time:Date;onWake:()=>void;onUnlock:()=>void;onRestart:()=>void;onOff:()=>void}){
 return <div className={'lock-screen lock-v2 '+(login?'signin':'')} onClick={()=>!login&&onWake()} onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();login?onUnlock():onWake()}}} tabIndex={0}>
 {!login?<><div className="lock-date"><div className="lock-time">{time.toLocaleTimeString('ru',{hour:'2-digit',minute:'2-digit'})}</div><p>{time.toLocaleDateString('ru',{weekday:'long',day:'numeric',month:'long'})}</p></div><div className="unlock-hint"><Glyph name="chevron-down" size={20}/><span>Нажмите или коснитесь экрана</span></div></>:<div className="login-card"><div className="avatar-lg"><Icon name="user" size={116}/></div><h1>{vm.settings.username}</h1><p>Локальная учётная запись</p><button className="signin-button" onClick={onUnlock}>Войти <Glyph name="arrow-right" size={17}/></button><small>Виртуальная машина Playton</small></div>}
 <div className="lock-tray" onClick={e=>e.stopPropagation()}><Glyph name={vm.settings.wifi?'wifi':'wifi-off'} size={22}/><Glyph name={vm.settings.volume?'volume':'mute'} size={22}/><Glyph name="battery" size={22}/>{login&&<><button className="lock-icon" title="Перезагрузка" aria-label="Перезагрузка" onClick={onRestart}><Glyph name="restart" size={22}/></button><button className="lock-icon" title="Выключение" aria-label="Выключение" onClick={onOff}><Glyph name="power" size={22}/></button></>}</div>
 </div>
}
export function BlueScreen({reason,onRepair,onRestart}:{reason:string;onRepair:()=>void;onRestart:()=>void}){
 const [percent,setPercent]=useState(0);
 useEffect(()=>{setPercent(0);const start=Date.now();const timer=window.setInterval(()=>{const value=Math.min(100,Math.round((Date.now()-start)/32));setPercent(value);if(value===100)clearInterval(timer)},100);return()=>clearInterval(timer)},[reason]);
 return <div className="bsod bsod-v2"><div className="bsod-layout"><div className="sad">:(</div><h1>На вашем компьютере возникла проблема, и его необходимо перезагрузить.</h1><p>Мы только собираем некоторые сведения об ошибке, а затем вы сможете перезагрузить компьютер.</p><div className="bsod-progress">{percent}% завершено</div><div className="bsod-detail"><Glyph name="info" size={44}/><div><p>Код остановки: <strong>{reason}</strong></p><p>Отчёт о сбое виртуальной Windows 11. Настоящее устройство не затронуто.</p></div></div><div className="button-row bsod-buttons"><button onClick={onRepair}><Glyph name="tools" size={18}/> Автоматическое восстановление</button><button onClick={onRestart}><Glyph name="restart" size={18}/> Перезагрузка</button></div></div></div>
}
type RecoveryPage='choose'|'troubleshoot'|'advanced'|'options';
export function WinRE({ui,reason,onContinue,onRepair}:{ui:UIContext;reason:string;onContinue:()=>void;onRepair:()=>void}){
 const [page,setPage]=useState<RecoveryPage>('choose');
 const stack:Record<RecoveryPage,RecoveryPage>={choose:'choose',troubleshoot:'choose',advanced:'troubleshoot',options:'advanced'};
 const titles:Record<RecoveryPage,string>={choose:'Выберите действие',troubleshoot:'Поиск и устранение неисправностей',advanced:'Дополнительные параметры',options:'Восстановление системы'};
 const tile=(icon:string,name:string,description:string,action:()=>void)=><button className="winre-tile" onClick={action}><span className="winre-icon"><Glyph name={icon} size={36}/></span><span className="winre-copy"><strong>{name}</strong><small>{description}</small></span></button>;
 return <div className="recovery-screen winre-v2"><header>{page!=='choose'&&<button className="winre-back" aria-label="Назад" onClick={()=>setPage(stack[page])}><Glyph name="arrow-left" size={24}/></button>}<span>Windows Recovery Environment</span><span className="winre-brand">PLAYTON</span></header><div className="winre-content"><h1>{titles[page]}</h1>{page==='choose'&&reason&&<p className="winre-code">{reason}</p>}
 {page==='choose'&&<div className="winre-tiles">{tile('arrow-right','Продолжить','Выход и продолжение работы Windows 11',onContinue)}{tile('tools','Поиск и устранение неисправностей','Возврат компьютера в исходное состояние или дополнительные параметры',()=>setPage('troubleshoot'))}{tile('computer-off','Выключить компьютер','Завершить работу виртуальной машины',()=>ui.power('off'))}</div>}
 {page==='troubleshoot'&&<div className="winre-tiles">{tile('restart','Вернуть компьютер в исходное состояние','Восстановить виртуальную Windows, сохранив или удалив пользовательские файлы',()=>setPage('options'))}{tile('tools','Дополнительные параметры','Средства диагностики и запуска',()=>setPage('advanced'))}</div>}
 {page==='advanced'&&<div className="winre-tiles advanced-tiles">{tile('tools','Восстановление при загрузке','Устранение проблем, препятствующих загрузке Windows',onRepair)}{tile('settings','Параметры запуска','Включить безопасный режим',()=>ui.power('safe'))}{tile('clock-line','Восстановление системы','Восстановление системных файлов и контрольных точек',()=>setPage('options'))}{tile('display','Параметры встроенного ПО UEFI','Изменить настройки виртуального компьютера',()=>ui.power('bios'))}{tile('download','Резервная копия','Экспортировать состояние виртуальной машины',()=>download('playton-vm-backup.json',JSON.stringify(ui.vm)))}</div>}
 {page==='options'&&<Recovery ui={ui}/>}
 <footer className="winre-footer"><Glyph name="shield-line" size={18}/> Среда восстановления работает только внутри Windows Web Sandbox.</footer></div></div>
}
