import {runPE32} from './peRuntime';
self.onmessage=(e:MessageEvent<ArrayBuffer>)=>{try{self.postMessage({ok:true,result:runPE32(e.data)})}catch(error){self.postMessage({ok:false,error:error instanceof Error?error.message:String(error)})}};
