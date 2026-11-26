import {bootCheck,usedSpace,type VM} from './model';
self.onmessage=(e:MessageEvent<{vm:VM;id:number}>)=>{const {vm,id}=e.data;self.postMessage({id,boot:bootCheck(vm),fileCount:Object.keys(vm.files).length,used:usedSpace(vm)})};
