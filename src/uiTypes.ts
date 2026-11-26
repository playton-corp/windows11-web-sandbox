import type {VM,Account} from './model';
import type {Process} from './processes';
export type Power='restart'|'off'|'lock'|'recovery'|'bios'|'safe';
export type WindowState={id:number;appId:string;title:string;pid:number;x:number;y:number;w:number;h:number;z:number;desktop:number;min:boolean;max:boolean;snap?:'left'|'right';payload?:string};
export type UIContext={vm:VM;update:(fn:(v:VM)=>void)=>boolean;open:(id:string,payload?:string)=>void;processes:Process[];kill:(pid:number)=>void;suspend:(pid:number)=>void;power:(action:Power)=>void;admin:(account?:Account)=>void;toast:(message:string)=>void;replace:(vm:VM)=>void;reset:(preserve:boolean)=>void;clipboard:{path:string;move:boolean}|null;setClipboard:(v:{path:string;move:boolean}|null)=>void;capture:()=>string};
