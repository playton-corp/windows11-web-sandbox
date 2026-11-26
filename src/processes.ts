import {appError,apps,bootCheck,log,type VM,type AppDef} from './model.ts';
export type Process={pid:number;appId:string;name:string;status:'Running'|'Suspended';memory:number;critical?:boolean};
export const initialProcesses=():Process[]=>[
 {pid:4,appId:'system',name:'System',status:'Running',memory:64,critical:true},
 {pid:420,appId:'csrss',name:'csrss.exe',status:'Running',memory:12,critical:true},
 {pid:512,appId:'services',name:'services.exe',status:'Running',memory:25,critical:true},
 {pid:640,appId:'winlogon',name:'winlogon.exe',status:'Running',memory:19,critical:true},
 {pid:768,appId:'shell',name:'explorer.exe',status:'Running',memory:108},
 {pid:824,appId:'svchost',name:'svchost.exe',status:'Running',memory:52},
];
let nextPid=1000;
export function launch(vm:VM,app:AppDef):Process{
 const fail=appError(vm,app);if(fail)throw Error(fail);
 log(vm,'Создан процесс '+(app.exe||app.name));
 return {pid:nextPid++,appId:app.id,name:app.exe||app.name,status:'Running',memory:32+app.name.length*3};
}
export function exitProcess(vm:VM,process:Process){log(vm,'Завершён процесс '+process.name,process.critical?'Critical':'Information');if(process.critical)return {mode:'bsod' as const,code:'CRITICAL_PROCESS_DIED — '+process.name};if(process.appId==='shell')return {mode:'black' as const,code:bootCheck(vm).mode==='normal'?'Оболочка остановлена. Запустите explorer.exe.':bootCheck(vm).code};return null}
export function findApp(vm:VM,name:string){return [...apps,...vm.installed].find(a=>a.id===name||a.exe?.toLowerCase()===name.toLowerCase()||a.name.toLowerCase()===name.toLowerCase())}
