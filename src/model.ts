export type Account='User'|'Administrator'|'SYSTEM'|'TrustedInstaller';
export type VFile={path:string;kind:'file'|'dir';content:string;size:number;owner:Account;system:boolean;component?:string;signature?:string;created:number;modified:number};
export type Files=Record<string,VFile>;
export type AppDef={id:string;name:string;icon:string;exe?:string;deps?:string[];html?:string};
export type Service={name:string;display:string;file:string;running:boolean;startup:'Automatic'|'Manual'|'Disabled';critical?:boolean};
export type Hardware={cpu:string;ram:number;gpu:string;ssd:number;secureBoot:boolean;tpm:boolean;firmware:'UEFI'|'BIOS';bootOrder:'SSD'|'Recovery'|'USB';partitions:{name:string;size:number;format:string}[]};
export type VM={version:1;files:Files;registry:Record<string,string>;services:Service[];hardware:Hardware;installed:AppDef[];settings:{theme:'light'|'dark';wallpaper:string;scale:number;volume:number;wifi:boolean;bluetooth:boolean;sounds:boolean;account:Account;username:string;night:boolean};events:{time:number;level:string;message:string}[];trash:VFile[];snapshots:{name:string;time:number;data:string}[];lastBoot:string;updated:number};
export const SYS='C:/Windows/System32';
export const HOME='C:/Users/User';
export const normalize=(s:string,cwd='C:/'):string=>{
 let p=s.trim().replace(/^["']|["']$/g,'').replaceAll('\\','/');
 if(!p||p==='.')p=cwd;
 if(!/^[a-z]:/i.test(p))p=p.startsWith('/')?'C:'+p:cwd.replace(/\/$/,'')+'/'+p;
 if(!/^c:/i.test(p))throw Error('Доступен только виртуальный диск C:');
 const seg:string[]=[];for(const bit of p.slice(2).split('/')){if(!bit||bit==='.')continue;if(bit==='..')seg.pop();else{if(/[\x00-\x1f:*?<>|]/.test(bit))throw Error('Недопустимое имя');seg.push(bit)}}
 return 'C:/'+seg.join('/');
};
export const key=(path:string)=>normalize(path).toLowerCase();
export const basename=(path:string)=>path.split('/').at(-1)||'C:';
export const parent=(path:string)=>path==='C:/'?'C:/':path.slice(0,path.lastIndexOf('/'))||'C:/';
export const get=(files:Files,path:string)=>files[key(path)];
export const list=(files:Files,path:string)=>Object.values(files).filter(x=>x.path!=='C:/'&&key(parent(x.path))===key(path)).sort((a,b)=>a.kind===b.kind?a.path.localeCompare(b.path):a.kind==='dir'?-1:1);
export const write=(files:Files,path:string,kind:VFile['kind'],content='',system=false,component?:string,size?:number):VFile=>{
 path=normalize(path);const prior=get(files,path);const t=Date.now();
 const f:VFile={path,kind,content,size:size??new TextEncoder().encode(content).length,owner:system?'TrustedInstaller':'User',system,component,signature:system&&kind==='file'?content:undefined,created:prior?.created??t,modified:t};files[key(path)]=f;return f;
};
export const makeDir=(files:Files,path:string,system=false)=>{
 path=normalize(path);if(get(files,path)){if(get(files,path).kind!=='dir')throw Error('Имя занято файлом');return}
 if(path!=='C:/')makeDir(files,parent(path),system);write(files,path,'dir','',system);
};
export const apps:AppDef[]=[
 {id:'explorer',name:'Проводник',icon:'folder',exe:'explorer.exe'},
 {id:'notepad',name:'Блокнот',icon:'notepad',exe:'notepad.exe'},
 {id:'paint',name:'Paint',icon:'paint',exe:'mspaint.exe',deps:['gdi32.dll']},
 {id:'calc',name:'Калькулятор',icon:'calc',exe:'calc.exe'},
 {id:'edge',name:'Microsoft Edge',icon:'edge',exe:'msedge.exe',deps:['wininet.dll']},
 {id:'store',name:'Playton Store',icon:'store',exe:'WinStore.App.exe'},
 {id:'terminal',name:'Терминал',icon:'terminal',exe:'cmd.exe'},
 {id:'cmd',name:'Командная строка',icon:'cmd',exe:'cmd.exe'},
 {id:'powershell',name:'PowerShell',icon:'powershell',exe:'powershell.exe'},
 {id:'taskmgr',name:'Диспетчер задач',icon:'taskmgr',exe:'taskmgr.exe'},
 {id:'regedit',name:'Редактор реестра',icon:'regedit',exe:'regedit.exe',deps:['advapi32.dll']},
 {id:'control',name:'Панель управления',icon:'control',exe:'control.exe'},
 {id:'settings',name:'Параметры',icon:'settings',exe:'SystemSettings.exe'},
 {id:'disk',name:'Управление дисками',icon:'disk',exe:'diskmgmt.msc'},
 {id:'devices',name:'Диспетчер устройств',icon:'devices',exe:'devmgmt.msc'},
 {id:'computer',name:'Управление компьютером',icon:'pc',exe:'compmgmt.msc'},
 {id:'events',name:'Просмотр событий',icon:'events',exe:'eventvwr.exe'},
 {id:'services',name:'Службы',icon:'settings',exe:'services.msc'},
 {id:'recycle',name:'Корзина',icon:'recycle',exe:'explorer.exe'},
 {id:'photos',name:'Фотографии',icon:'photos',exe:'Photos.exe'},
 {id:'media',name:'Медиаплеер',icon:'media',exe:'wmplayer.exe'},
 {id:'clock',name:'Часы',icon:'clock',exe:'Clock.exe'},
 {id:'snip',name:'Ножницы',icon:'snip',exe:'SnippingTool.exe'},
 {id:'info',name:'Сведения о системе',icon:'pc',exe:'msinfo32.exe'},
 {id:'security',name:'Безопасность Windows',icon:'security',exe:'SecurityHealth.exe'},
 {id:'update',name:'Центр обновления',icon:'update',exe:'SystemSettings.exe'},
 {id:'recovery',name:'Восстановление',icon:'update',exe:'Recovery.exe'},
];
export const defaultServices:Service[]=[
 {name:'RpcSs',display:'Удалённый вызов процедур (RPC)',file:'rpcss.dll',running:true,startup:'Automatic',critical:true},
 {name:'Winmgmt',display:'Инструментарий управления Windows',file:'wbemcore.dll',running:true,startup:'Automatic'},
 {name:'AudioSrv',display:'Windows Audio',file:'audiosrv.dll',running:true,startup:'Automatic'},
 {name:'wuauserv',display:'Центр обновления Windows',file:'wuaueng.dll',running:true,startup:'Automatic'},
 {name:'Dnscache',display:'DNS-клиент',file:'dnsapi.dll',running:true,startup:'Automatic'},
 {name:'EventLog',display:'Журнал событий Windows',file:'wevtsvc.dll',running:true,startup:'Automatic'},
 {name:'Themes',display:'Темы',file:'themeservice.dll',running:true,startup:'Automatic'},
 {name:'WinDefend',display:'Виртуальная защита',file:'MsMpEng.exe',running:true,startup:'Automatic'},
 {name:'Spooler',display:'Диспетчер печати',file:'spoolsv.exe',running:true,startup:'Manual'},
 {name:'PlugPlay',display:'Plug and Play',file:'umpnpmgr.dll',running:true,startup:'Automatic'},
];
export const coreFiles:Record<string,string>={
 'C:/bootmgr':'boot','C:/Windows/Boot/EFI/bootmgfw.efi':'boot','C:/Windows/System32/winload.efi':'boot',
 [SYS+'/ntoskrnl.exe']:'kernel',[SYS+'/hal.dll']:'kernel',[SYS+'/ntdll.dll']:'runtime',
 [SYS+'/kernel32.dll']:'runtime',[SYS+'/kernelbase.dll']:'runtime',[SYS+'/user32.dll']:'graphics',
 [SYS+'/gdi32.dll']:'graphics',[SYS+'/win32k.sys']:'graphics',[SYS+'/services.exe']:'service',
 [SYS+'/svchost.exe']:'service',[SYS+'/csrss.exe']:'session',[SYS+'/winlogon.exe']:'session',
 ['C:/Windows/explorer.exe']:'shell',[SYS+'/explorer.exe']:'shell',
 [SYS+'/drivers/disk.sys']:'storage',[SYS+'/drivers/ntfs.sys']:'storage',[SYS+'/drivers/storahci.sys']:'storage',
 [SYS+'/drivers/basicdisplay.sys']:'graphics',[SYS+'/drivers/tcpip.sys']:'network',[SYS+'/drivers/portcls.sys']:'audio',
 [SYS+'/config/SYSTEM']:'registry',[SYS+'/config/SOFTWARE']:'registry',[SYS+'/config/SAM']:'registry',
 [SYS+'/config/SECURITY']:'registry',[SYS+'/config/DEFAULT']:'registry',
 [SYS+'/advapi32.dll']:'registry',[SYS+'/wininet.dll']:'network',
};
export function fresh():VM{
 const files:Files={};makeDir(files,'C:/',true);
 const dirs=['Windows','Windows/System32','Windows/SysWOW64','Windows/WinSxS','Windows/Boot/EFI','Windows/Fonts','Windows/System32/drivers','Windows/System32/config','Windows/System32/DriverStore/FileRepository','Windows/Logs','Windows/Temp','Windows/SoftwareDistribution/Download','Program Files','Program Files (x86)','ProgramData','Users','Users/User/Desktop','Users/User/Documents','Users/User/Downloads','Users/User/Pictures','Users/User/Music','Users/User/Videos','Users/User/AppData/Local','Users/User/AppData/Roaming','Users/Administrator','Recovery','PerfLogs','$Recycle.Bin'];
 dirs.forEach(d=>makeDir(files,'C:/'+d,!d.startsWith('Users')));
 Object.entries(coreFiles).forEach(([p,c])=>write(files,p,'file','VIRTUAL:'+c+':'+basename(p),true,c,Math.floor(24000+basename(p).length*8271)));
 apps.forEach(a=>{if(a.exe&&!get(files,SYS+'/'+a.exe))write(files,SYS+'/'+a.exe,'file','VIRTUAL:application:'+a.id,true,'application',200000)});
 defaultServices.forEach(s=>write(files,SYS+'/'+s.file,'file','VIRTUAL:service:'+s.name,true,'service',70000));
 const components=['Microsoft.Windows.Shell','Microsoft.Windows.Network','Microsoft.Windows.Core','Microsoft.Windows.Graphics','Microsoft.Windows.Audio','Microsoft.Windows.Security','Microsoft.Windows.Storage','Microsoft.Windows.Printing','Microsoft.Windows.Input','Microsoft.Windows.Fonts','Microsoft.Windows.Update','Microsoft.Windows.Media','Microsoft.Windows.Globalization','Microsoft.Windows.Management','Microsoft.Windows.Explorer','Microsoft.Windows.Diagnostics','Microsoft.Windows.UI','Microsoft.Windows.Runtime','Microsoft.Windows.Devices','Microsoft.Windows.Recovery'];
 for(const [i,component] of components.entries()){
  const d='C:/Windows/WinSxS/amd64_'+component.toLowerCase()+'_10.0.26100.'+(1000+i);makeDir(files,d,true);
  write(files,d+'/component.manifest','file',JSON.stringify({simulation:true,component,version:'10.0.26100',dependencies:['runtime']}),true,component);
  for(let j=0;j<110;j++){const n=component.split('.').at(-1)!.toLowerCase()+'_'+String(j+1).padStart(3,'0');write(files,d+'/'+n+'.dll','file','VIRTUAL:'+component+':'+n,true,component,32768+j*4096);if(j<25)write(files,SYS+'/'+n+'.dll','file','VIRTUAL:'+component+':'+n,true,component,65536+j*1024)}
 }
 ['segoeui','segoeuib','segmdl2','arial','consola','calibri'].forEach(x=>write(files,'C:/Windows/Fonts/'+x+'.ttf','file','VIRTUAL:font:'+x,true,'font',340000));
 write(files,HOME+'/Documents/Добро пожаловать.txt','file','Добро пожаловать в Windows 11 Web Sandbox!\n\nЭто виртуальная ОС Playton Corporation. Все файлы и команды изолированы в браузере. Создайте контрольную точку перед экспериментами.');
 write(files,HOME+'/Desktop/README.txt','file','Windows 11 Web Sandbox\nPlayton Corporation\nВиртуальная система, не Microsoft Windows.');
 return {version:1,files,registry:{'HKLM/SYSTEM/CurrentControlSet/Control/Session Manager/BootExecute':'autocheck autochk *','HKLM/SOFTWARE/Microsoft/Windows NT/CurrentVersion/Winlogon/Shell':'explorer.exe','HKLM/SYSTEM/CurrentControlSet/Services/RpcSs/Start':'2','HKCU/Control Panel/Desktop/Wallpaper':'bloom','HKCU/Software/Microsoft/Windows/CurrentVersion/Themes/Personalize/AppsUseLightTheme':'1'},services:structuredClone(defaultServices),hardware:{cpu:'Playton Virtual CPU 8-core',ram:8192,gpu:'Playton Virtual Graphics',ssd:128,secureBoot:true,tpm:true,firmware:'UEFI',bootOrder:'SSD',partitions:[{name:'EFI',size:0.26,format:'FAT32'},{name:'C:',size:126.7,format:'NTFS'},{name:'Recovery',size:1,format:'NTFS'}]},installed:[],settings:{theme:'light',wallpaper:'bloom',scale:100,volume:55,wifi:true,bluetooth:false,sounds:true,account:'User',username:'User',night:false},events:[{time:Date.now(),level:'Information',message:'Виртуальная система установлена.'}],trash:[],snapshots:[],lastBoot:'normal',updated:Date.now()};
}
export function log(vm:VM,message:string,level='Information'){vm.events.unshift({time:Date.now(),level,message});vm.events=vm.events.slice(0,500);vm.updated=Date.now()}
export function canModify(vm:VM,path:string):boolean{
 const f=get(vm.files,path)||get(vm.files,parent(normalize(path)));return !f||!f.system||vm.settings.account==='TrustedInstaller'||vm.settings.account==='SYSTEM'||(vm.settings.account==='Administrator'&&f.owner==='Administrator');
}
export function requireAccess(vm:VM,path:string){if(!canModify(vm,path))throw Error('Отказано в доступе. Требуется виртуальный владелец TrustedInstaller или SYSTEM.')}
export function takeOwnership(vm:VM,path:string,owner:Account){if(vm.settings.account==='User')throw Error('Требуются права администратора');const f=get(vm.files,path);if(!f)throw Error('Файл не найден');for(const x of Object.values(vm.files))if(key(x.path)===key(path)||key(x.path).startsWith(key(path)+'/'))x.owner=owner;log(vm,'Владелец изменён: '+path+' → '+owner)}
export function saveFile(vm:VM,path:string,content:string){path=normalize(path);requireAccess(vm,path);if(!get(vm.files,parent(path)))throw Error('Папка не существует');const f=get(vm.files,path);if(f?.kind==='dir')throw Error('Это папка');if(f){f.content=content;f.modified=Date.now();f.size=new TextEncoder().encode(content).length}else write(vm.files,path,'file',content);log(vm,'Запись: '+path)}
export function createFolder(vm:VM,path:string){requireAccess(vm,path);makeDir(vm.files,path);log(vm,'Создана папка '+path)}
export function remove(vm:VM,path:string,permanent=false){path=normalize(path);if(path==='C:/')throw Error('Используйте форматирование виртуального раздела');if(!get(vm.files,path))throw Error('Файл не найден');const targets=Object.values(vm.files).filter(x=>key(x.path)===key(path)||key(x.path).startsWith(key(path)+'/'));targets.forEach(x=>requireAccess(vm,x.path));for(const f of targets){if(!permanent)vm.trash.push({...f});delete vm.files[key(f.path)]}log(vm,'Удалено: '+path+' ('+targets.length+')',targets.some(f=>f.system)?'Warning':'Information')}
export function transfer(vm:VM,source:string,dest:string,move=false){source=normalize(source);dest=normalize(dest);const f=get(vm.files,source);if(!f)throw Error('Источник не найден');if(get(vm.files,dest)?.kind==='dir')dest=normalize(dest+'/'+basename(source));if(key(dest)===key(source)||key(dest).startsWith(key(source)+'/'))throw Error('Недопустимое назначение');if(!get(vm.files,parent(dest)))throw Error('Папка назначения не существует');requireAccess(vm,dest);const targets=Object.values(vm.files).filter(x=>key(x.path)===key(source)||key(x.path).startsWith(key(source)+'/'));if(move)targets.forEach(x=>requireAccess(vm,x.path));for(const x of targets){const p=dest+x.path.slice(source.length);if(get(vm.files,p))throw Error('Файл назначения уже существует: '+p)}for(const x of targets){const p=dest+x.path.slice(source.length);vm.files[key(p)]={...x,path:p,owner:move?x.owner:'User',system:move?x.system:false,modified:Date.now()};if(move)delete vm.files[key(x.path)]}log(vm,(move?'Перемещено: ':'Скопировано: ')+source+' → '+dest)}
export function restoreTrash(vm:VM){for(const f of vm.trash.sort((a,b)=>a.path.length-b.path.length)){if(!get(vm.files,f.path)){makeDir(vm.files,parent(f.path),f.system);vm.files[key(f.path)]=f}}vm.trash=[];log(vm,'Корзина восстановлена')}
export function format(vm:VM){if(vm.settings.account==='User')throw Error('Требуются права администратора');vm.files={};makeDir(vm.files,'C:/',true);vm.registry={};vm.installed=[];vm.trash=[];vm.services.forEach(s=>s.running=false);log(vm,'Виртуальный диск C: отформатирован','Critical')}
const expectedCore=Object.fromEntries(Object.entries(coreFiles).map(([p,c])=>[key(p),'VIRTUAL:'+c+':'+basename(p)]));
export const valid=(vm:VM,path:string)=>{const f=get(vm.files,path);const expected=expectedCore[key(path)];return Boolean(f&&f.kind==='file'&&f.content.startsWith('VIRTUAL:')&&f.signature===f.content&&(!expected||f.content===expected))};
export const bootCheck=(vm:VM):{mode:'normal'|'bsod'|'black'|'recovery'|'bios';code:string}=>{
 if(vm.hardware.bootOrder==='Recovery')return {mode:'recovery',code:'Выбран раздел восстановления'};
 if(vm.hardware.bootOrder==='USB')return {mode:'bios',code:'No bootable virtual USB device'};
 for(const p of ['C:/bootmgr','C:/Windows/Boot/EFI/bootmgfw.efi',SYS+'/winload.efi'])if(!valid(vm,p))return {mode:'recovery',code:'0xc000000f — '+p};
 if(vm.hardware.ram<1024)return {mode:'bsod',code:'MEMORY_MANAGEMENT'};
 for(const [p,c] of Object.entries(coreFiles))if(['kernel','storage','session','service','registry'].includes(c)&&!valid(vm,p))return {mode:'bsod',code:({kernel:'CRITICAL_PROCESS_DIED',storage:'INACCESSIBLE_BOOT_DEVICE',registry:'BAD_SYSTEM_CONFIG_INFO',session:'SESSION_INITIALIZATION_FAILED',service:'CRITICAL_PROCESS_DIED'} as Record<string,string>)[c]+' — '+basename(p)};
 if(!vm.registry['HKLM/SYSTEM/CurrentControlSet/Control/Session Manager/BootExecute'])return {mode:'bsod',code:'BAD_SYSTEM_CONFIG_INFO'};
 if(!valid(vm,'C:/Windows/explorer.exe')||!valid(vm,SYS+'/explorer.exe')||!valid(vm,SYS+'/user32.dll')||!valid(vm,SYS+'/drivers/basicdisplay.sys')||!valid(vm,SYS+'/ntdll.dll')||vm.registry['HKLM/SOFTWARE/Microsoft/Windows NT/CurrentVersion/Winlogon/Shell']!=='explorer.exe')return {mode:'black',code:'Графическая оболочка не запущена'};
 return {mode:'normal',code:'OK'};
};
export function appError(vm:VM,a:AppDef):string|undefined{
 if(a.exe&&!valid(vm,SYS+'/'+a.exe))return a.exe+' не найден или повреждён (0xc000012f)';
 for(const dll of ['ntdll.dll','kernel32.dll','kernelbase.dll','user32.dll',...(a.deps||[])])if(!valid(vm,SYS+'/'+dll))return dll+' отсутствует. Запуск невозможен (0xc0000135).';
 if(a.id==='explorer'&&!valid(vm,'C:/Windows/explorer.exe'))return 'explorer.exe отсутствует';
 if(a.id==='edge'&&(!vm.settings.wifi||!valid(vm,SYS+'/drivers/tcpip.sys')))return 'Виртуальная сеть недоступна';
 if(a.id!=='recovery'&&vm.services.some(s=>s.critical&&(!s.running||!valid(vm,SYS+'/'+s.file))))return 'RPC server unavailable (0x800706BA)';
 return undefined;
}
export function repair(vm:VM){const clean=fresh();let count=0;for(const f of Object.values(clean.files)){const current=get(vm.files,f.path);if(f.system&&(!current||current.content!==f.content)){vm.files[key(f.path)]={...f};count++}}for(const [k,v] of Object.entries(clean.registry))if(!vm.registry[k])vm.registry[k]=v;vm.services=vm.services.map(s=>({...s,running:s.startup!=='Disabled'}));log(vm,'Проверка SFC восстановила элементов: '+count);return count}
export function makeSnapshot(vm:VM,name:string){const data=JSON.stringify({...vm,snapshots:[]});vm.snapshots.unshift({name,time:Date.now(),data});vm.snapshots=vm.snapshots.slice(0,5);log(vm,'Создана контрольная точка: '+name)}
export function restoreSnapshot(vm:VM,index:number){const s=vm.snapshots[index];if(!s)throw Error('Контрольная точка не найдена');const keep=vm.snapshots;Object.assign(vm,parseBackup(s.data));vm.snapshots=keep;log(vm,'Восстановлена контрольная точка: '+s.name)}
export function parseBackup(data:string):VM{const v=JSON.parse(data);if(v.version!==1||!v.files||typeof v.files!=='object'||!v.registry||!v.hardware||!v.settings||!Array.isArray(v.services)||!Array.isArray(v.installed)||!Array.isArray(v.events)||!Array.isArray(v.snapshots)||!Array.isArray(v.trash))throw Error('Неверный формат резервной копии');if(Object.keys(v.files).length>50000)throw Error('Слишком много файлов');for(const [k,f] of Object.entries(v.files) as [string,VFile][]){if(!f||typeof f.path!=='string'||key(f.path)!==k||!['file','dir'].includes(f.kind)||typeof f.content!=='string')throw Error('Повреждён индекс файлов')}return v as VM}
export function usedSpace(vm:VM){return Object.values(vm.files).reduce((n,f)=>n+f.size,0)}
