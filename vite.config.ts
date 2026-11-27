import { defineConfig } from 'vite';
import { cpSync, mkdirSync } from 'node:fs';
export default defineConfig({base:'./',build:{target:'es2022'},plugins:[{
 name:'bundle-dos-player',closeBundle(){mkdirSync('dist/dos-runtime',{recursive:true});for(const file of ['js-dos.js','js-dos.css','emulators'])cpSync('node_modules/js-dos/dist/'+file,'dist/dos-runtime/'+file,{recursive:true});}
}]});
