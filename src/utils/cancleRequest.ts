import axios from 'axios';

export class cancelRequestAxios {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    cancelRequest: any;
    
    constructor() {
      // refference to API call
      this.cancelRequest = null;
    }

    // Cancel API call if refference is there and create a new cancelToken for new API call 
    cancelAndCreateToken = () => {
        if(this.cancelRequest){
            this.cancelRequest.cancel();
        }
        this.cancelRequest = axios.CancelToken.source();
    }

    // reset Cancel token
    resetCancelToken = () => {
        this.cancelRequest = null;
    }
}