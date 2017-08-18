
import 'whatwg-fetch'
import {
    Toast
} from "antd-mobile"
const Loading = {
    pendingRequest: 0
}

const Util = {
    open(fn) {
        Loading.open = fn
    },
    close(fn) {
        Loading.close = fn
    },
    fetch(url, options) {
        Loading.open()
        Loading.pendingRequest++
        return fetch(url, options).then(res => {
            Loading.pendingRequest--
            if (Loading.pendingRequest <= 0) {
                Loading.close()
            }
            return res.json()
        }).then(data=>{
            if(data.code){
                Toast.info(data.name || data.message,1)
            }
            console.log(data)
            return data
        })
    },
    Toast:{
        info(txt,callback){
            Toast.info(txt,1,callback)
        }
    }
}

export default Util