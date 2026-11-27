// Small, bounded, import-free PE32 demonstrator. No native execution or host access.
export type RunResult={exitCode:number;steps:number;imageBase:number;entry:number};
export function runPE32(buffer:ArrayBuffer):RunResult{
 const d=new DataView(buffer),size=buffer.byteLength;
 const check=(o:number,n:number)=>{if(!Number.isInteger(o)||o<0||n<0||o+n>size)throw Error('Повреждённый PE-файл')};
 const u16=(o:number)=>{check(o,2);return d.getUint16(o,true)},u32=(o:number)=>{check(o,4);return d.getUint32(o,true)};
 if(size>8*1024*1024||u16(0)!==0x5a4d)throw Error('Требуется PE32 EXE до 8 МБ');
 const pe=u32(60);if(u32(pe)!==0x4550||u16(pe+4)!==0x14c)throw Error('Поддерживается только x86 PE32');
 const count=u16(pe+6),optSize=u16(pe+20),opt=pe+24;if(count<1||count>32||optSize<96||u16(opt)!==0x10b)throw Error('Неподдерживаемый заголовок PE');check(opt,optSize);
 const entry=u32(opt+16),base=u32(opt+28),imageSize=u32(opt+56),dirCount=u32(opt+92);
 if(imageSize<1||imageSize>16*1024*1024)throw Error('Слишком большой виртуальный образ');
 if(dirCount>1&&optSize>=112&&u32(opt+104)!==0)throw Error('Импорт DLL / Win32 API пока не поддерживается');
 const mem=new Uint8Array(imageSize),codeRanges:{start:number;end:number}[]=[];
 for(let i=0;i<count;i++){const s=opt+optSize+i*40;check(s,40);const va=u32(s+12),virtual=u32(s+8),raw=u32(s+16),ptr=u32(s+20),flags=u32(s+36);const span=Math.max(virtual,raw);if(va+span>imageSize)throw Error('Некорректный раздел PE');if(raw){check(ptr,raw);mem.set(new Uint8Array(buffer,ptr,raw),va)}if(flags&0x20000000)codeRanges.push({start:va,end:va+span})}
 let ip=entry,steps=0,zero=false;const regs=new Uint32Array(8),stack:number[]=[];
 const fetch=()=>{if(!codeRanges.some(r=>ip>=r.start&&ip<r.end))throw Error('Выход за пределы исполняемого раздела');return mem[ip++]};
 const imm=()=>{let v=0;for(let j=0;j<4;j++)v|=fetch()<<(j*8);return v>>>0};
 const push=(v:number)=>{if(stack.length>=4096)throw Error('Переполнение виртуального стека');stack.push(v>>>0)};
 const pop=()=>{if(!stack.length)throw Error('Пустой виртуальный стек');return stack.pop()!};
 const signed=(v:number)=>(v<<24)>>24;
 while(steps++<100000){const at=ip,op=fetch();if(op>=0xb8&&op<=0xbf){regs[op-0xb8]=imm();continue}if(op>=0x50&&op<=0x57){push(regs[op-0x50]);continue}if(op>=0x58&&op<=0x5f){regs[op-0x58]=pop();continue}if(op>=0x40&&op<=0x47){regs[op-0x40]++;zero=regs[op-0x40]===0;continue}if(op>=0x48&&op<=0x4f){regs[op-0x48]--;zero=regs[op-0x48]===0;continue}
 switch(op){case 0x90:break;case 0xc3:if(!stack.length)return {exitCode:regs[0],steps,imageBase:base,entry};ip=pop();break;case 0x68:push(imm());break;case 0x6a:push(signed(fetch()));break;case 0xe8:{const rel=imm()|0;push(ip);ip+=rel;break}case 0xe9:{const rel=imm()|0;ip+=rel;break}case 0xeb:{const rel=signed(fetch());ip+=rel;break}case 0x74:case 0x75:{const rel=signed(fetch());if(zero===(op===0x74))ip+=rel;break}case 0x05:regs[0]+=imm();zero=regs[0]===0;break;case 0x2d:regs[0]-=imm();zero=regs[0]===0;break;case 0x3d:zero=regs[0]===imm();break;case 0x31:case 0x33:case 0x89:case 0x8b:{const m=fetch();if((m&0xc0)!==0xc0)throw Error('Операции через память пока не поддерживаются');const a=m&7,b=(m>>3)&7,dst=op===0x33||op===0x8b?b:a,src=dst===b?a:b;regs[dst]=op===0x31||op===0x33?regs[dst]^regs[src]:regs[src];zero=regs[dst]===0;break}default:throw Error(`Неподдерживаемая инструкция x86 0x${op.toString(16)} (RVA ${at.toString(16)})`)} }
 throw Error('Превышен бюджет 100 000 инструкций');
}

export function samplePE():ArrayBuffer{const b=new ArrayBuffer(1024),v=new DataView(b),a=new Uint8Array(b),w16=(o:number,x:number)=>v.setUint16(o,x,true),w32=(o:number,x:number)=>v.setUint32(o,x,true);w16(0,0x5a4d);w32(60,128);w32(128,0x4550);w16(132,0x14c);w16(134,1);w16(148,224);w16(150,0x102);const o=152;w16(o,0x10b);w32(o+16,0x1000);w32(o+20,0x1000);w32(o+28,0x400000);w32(o+32,0x1000);w32(o+36,0x200);w32(o+56,0x2000);w32(o+60,0x200);w16(o+68,3);w32(o+92,16);const s=o+224;a.set([46,116,101,120,116],s);w32(s+8,11);w32(s+12,0x1000);w32(s+16,0x200);w32(s+20,0x200);w32(s+36,0x60000020);a.set([0xb8,20,0,0,0,0x05,22,0,0,0,0xc3],0x200);return b}
