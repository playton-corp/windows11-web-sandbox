import {basename,bootCheck,createFolder,format,get,key, list,normalize,parent,remove,repair,saveFile,SYS,transfer,takeOwnership,usedSpace,log,type VM} from './model.ts';
import type {Process} from './processes.ts';
export type ShellContext={vm:VM;cwd:string;processes:Process[];mode:'cmd'|'powershell';kill:(pid:number)=>void;power:(action:'restart'|'off'|'lock')=>void;open:(name:string)=>void;admin:()=>void};
export type ShellResult={text:string;cwd:string;clear?:boolean;diskpart?:boolean};
const argv=(line:string)=>line.match(/"[^"]*"|'[^']*'|[^\s]+/g)?.map(x=>x.replace(/^["']|["']$/g,''))||[];
const aliases:Record<string,string>={'get-childitem':'dir','ls':'dir','set-location':'cd','pwd':'cd','new-item':'mkdir','remove-item':'del','copy-item':'copy','move-item':'move','rename-item':'ren','get-content':'type','write-output':'echo','clear-host':'cls','get-process':'tasklist','stop-process':'taskkill','restart-computer':'shutdown','get-computerinfo':'systeminfo'};
export function run(line:string,c:ShellContext):ShellResult{
 let cwd=c.cwd;const {vm}=c;const args=argv(line);const raw=(args.shift()||'').toLowerCase();const cmd=aliases[raw]||raw;const p=(a:string)=>normalize(a,cwd);const result=(text=''):ShellResult=>({text,cwd});const nonFlags=args.filter(x=>!/^\/[a-z?]+$/i.test(x)&&!x.startsWith('-'));const a=nonFlags[0]||'',b=nonFlags[1]||'';
 try{
 switch(cmd){
 case '':return result();
 case 'help':return result('Виртуальные команды: dir, cd, mkdir, rmdir, del, copy, move, ren, type, echo, cls, tree, systeminfo, tasklist, taskkill, shutdown, sfc, chkdsk, diskpart, reg, format, whoami, takeown, runas, start, help.\nPowerShell: Get-ChildItem, Get-Content, Get-Process, Set-Location и другие аналоги.\nВсё выполняется только в виртуальной системе.');
 case 'dir':{const target=p(a||'.');if(!get(vm.files,target))throw Error('Путь не найден');const children=list(vm.files,target);return result(' Том в устройстве C: — Windows\n Каталог '+target.replaceAll('/','\\')+'\n\n'+children.map(x=>new Date(x.modified).toLocaleDateString('ru')+'  '+(x.kind==='dir'?'<DIR>':String(x.size).padStart(10))+'  '+basename(x.path)).join('\n')+'\n'+children.length+' объектов')}
 case 'cd':if(!a)return result(cwd);{const target=p(a);if(get(vm.files,target)?.kind!=='dir')throw Error('Указанный путь не найден');cwd=target;return result()}
 case 'mkdir':case 'md':if(!a)throw Error('Укажите папку');createFolder(vm,p(a));return result();
 case 'rmdir':case 'rd':case 'del':case 'erase':if(!a)throw Error('Укажите файл или папку');remove(vm,p(a),true);return result('Удалено.');
 case 'copy':case 'move':case 'ren':case 'rename':if(!a||!b)throw Error('Укажите источник и назначение');transfer(vm,p(a),cmd==='ren'||cmd==='rename'?normalize(b,parent(p(a))):p(b),cmd!=='copy');return result('Операция завершена.');
 case 'type':{const f=get(vm.files,p(a));if(!f||f.kind!=='file')throw Error('Файл не найден');return result(f.content)}
 case 'echo':{const index=line.indexOf('>');if(index>=0){const name=line.slice(index+1).trim();saveFile(vm,p(name),line.slice(5,index).trim());return result()}return result(args.join(' '))}
 case 'cls':return {...result(),clear:true};
 case 'tree':{const root=p(a||'.');let out:string[]=[];const walk=(d:string,depth:number)=>{if(depth>8||out.length>600)return;for(const f of list(vm.files,d)){out.push('  '.repeat(depth)+(f.kind==='dir'?'├─ 📁 ':'├─ ')+basename(f.path));if(f.kind==='dir')walk(f.path,depth+1)}};walk(root,0);return result(root+'\n'+out.join('\n'))}
 case 'systeminfo':return result('Имя узла: PLAYTON-PC\nНазвание ОС: Windows 11 Web Sandbox\nВерсия: 10.0.26100 (виртуальная)\nИзготовитель: Playton Corporation\nПроцессор: '+vm.hardware.cpu+'\nОЗУ: '+vm.hardware.ram+' MB\nBIOS: '+vm.hardware.firmware+'\nДиск: '+vm.hardware.ssd+' GB\nСостояние: '+bootCheck(vm).code);
 case 'tasklist':return result('Имя образа                       PID       Память\n'+c.processes.map(x=>x.name.padEnd(31)+String(x.pid).padEnd(10)+x.memory+' MB').join('\n'));
 case 'taskkill':{const i=args.findIndex(x=>x.toLowerCase()==='/pid'||x.toLowerCase()==='-id');const im=args.findIndex(x=>x.toLowerCase()==='/im');const proc=i>=0?c.processes.find(x=>x.pid===Number(args[i+1])):im>=0?c.processes.find(x=>x.name.toLowerCase()===args[im+1]?.toLowerCase()):c.processes.find(x=>x.pid===Number(a)||x.name===a);if(!proc)throw Error('Процесс не найден');c.kill(proc.pid);return result('УСПЕШНО: процесс завершён.')}
 case 'shutdown':c.power(raw==='restart-computer'||args.includes('/r')?'restart':args.includes('/l')?'lock':'off');return result('Завершение работы...');
 case 'sfc':if(vm.settings.account==='User')throw Error('Запустите от имени администратора');return result('Проверка завершена. Восстановлено файлов: '+repair(vm));
 case 'chkdsk':return result('Проверка виртуального диска C: (NTFS)\nФайлов: '+Object.keys(vm.files).length+'\nИспользовано: '+Math.round(usedSpace(vm)/1024/1024)+' MB\nСостояние загрузки: '+bootCheck(vm).code+'\nПроверка завершена.');
 case 'diskpart':return {...result('Microsoft DiskPart — виртуальная версия\nДиск 0: '+vm.hardware.ssd+' GB\n'+vm.hardware.partitions.map((x,i)=>'Раздел '+(i+1)+'  '+x.name+'  '+x.size+' GB '+x.format).join('\n')+'\nИспользуйте окно «Управление дисками» для изменения разделов.'),diskpart:true};
 case 'reg':{const op=args[0]?.toLowerCase();const path=(args[1]||'').replaceAll('\\','/');if(op==='query')return result(Object.entries(vm.registry).filter(([k])=>k.toLowerCase().startsWith(path.toLowerCase())).map(([k,v])=>k+' = '+v).join('\n')||'Раздел не найден');if(vm.settings.account==='User')throw Error('Требуется администратор');if(!path)throw Error('Укажите ключ');if(op==='delete'){for(const k of Object.keys(vm.registry))if(k===path||k.startsWith(path+'/'))delete vm.registry[k];log(vm,'Удаление записи '+path,'Warning');return result('Запись удалена.')}if(op==='add'){const j=args.indexOf('/d');vm.registry[path]=j>=0?args[j+1]||'':args.slice(2).join(' ');log(vm,'Изменение записи '+path);return result('Запись сохранена.')}throw Error('reg query|add|delete <ключ>')}
 case 'format':if(!args.some(x=>x.toLowerCase()==='/confirm'))return result('Для форматирования ТОЛЬКО виртуального C: введите format C: /confirm');format(vm);return result('Виртуальный диск C: отформатирован.');
 case 'whoami':return result('PLAYTON-PC\\'+vm.settings.account);
 case 'runas':c.admin();return result('Запрос UAC.');
 case 'takeown':{const fi=args.findIndex(x=>x.toLowerCase()==='/f');takeOwnership(vm,p(fi>=0?args[fi+1]:a),'Administrator');return result('Владелец: Administrator')}
 case 'start':c.open(a);return result('Запуск '+a);
 default:if(cmd.endsWith('.exe')){c.open(cmd);return result('Запуск '+cmd)}return result('"'+raw+'" не является внутренней или внешней виртуальной командой.');
 }
 }catch(e){return result('Ошибка: '+(e instanceof Error?e.message:String(e)))}
}
