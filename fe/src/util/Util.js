
import 'whatwg-fetch'

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
        // if (!Loading.pendingRequest) {
        //     Loading.open()
        // }
        Loading.open()
        Loading.pendingRequest++
        return fetch(url, options).then(res => {
            Loading.pendingRequest--
            if (Loading.pendingRequest <= 0) {
                Loading.close()
            }
            return res.json()
        })
    }
}

export default Util