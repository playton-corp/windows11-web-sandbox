import {apps} from './model';
import type {UIContext,WindowState} from './uiTypes';
import {Explorer,Notepad,Paint,Media,Recycle} from './fileApps';
import {Terminal,TaskManager,Registry,Settings,Recovery,Services,Events,Disks,Devices,Info,Control,Security,Update} from './systemApps';
import {Calculator,Store,Clock,Snip,SandboxedApp} from './extraApps';
import {BrowserApp} from './BrowserApp';
import {DosApp} from './DosApp';
export function AppContent({ui,w}:{ui:UIContext;w:WindowState}){
 const p=w.payload;switch(w.appId){
 case 'explorer':return <Explorer ui={ui} payload={p}/>;
 case 'notepad':return <Notepad ui={ui} payload={p}/>;
 case 'paint':return <Paint ui={ui} payload={p}/>;
 case 'calc':return <Calculator/>;
 case 'edge':return <BrowserApp ui={ui}/>;
 case 'store':return <Store ui={ui}/>;
 case 'playton-dos':return <DosApp/>;
 case 'terminal':case 'cmd':return <Terminal ui={ui}/>;
 case 'powershell':return <Terminal ui={ui} ps/>;
 case 'taskmgr':return <TaskManager ui={ui}/>;
 case 'regedit':return <Registry ui={ui}/>;
 case 'settings':return <Settings ui={ui} payload={p}/>;
 case 'recovery':return <div className="scroll"><h2>Восстановление Windows</h2><Recovery ui={ui}/></div>;
 case 'services':return <Services ui={ui}/>;
 case 'events':return <Events ui={ui}/>;
 case 'disk':return <Disks ui={ui}/>;
 case 'devices':return <Devices ui={ui}/>;
 case 'info':return <Info ui={ui}/>;
 case 'computer':return <Control ui={ui} computer/>;
 case 'control':return <Control ui={ui}/>;
 case 'security':return <Security ui={ui}/>;
 case 'update':return <Update ui={ui}/>;
 case 'recycle':return <Recycle ui={ui}/>;
 case 'photos':return <Media ui={ui} payload={p} photo/>;
 case 'media':return <Media ui={ui} payload={p} photo={false}/>;
 case 'clock':return <Clock/>;
 case 'snip':return <Snip ui={ui}/>;
 default:{const a=ui.vm.installed.find(a=>a.id===w.appId);return a?<SandboxedApp app={a}/>:<div className="empty">Приложение удалено.</div>}
 }
}
