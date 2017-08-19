
import 'whatwg-fetch'
import {
    Toast
} from "antd-mobile"
const Loading = {
    pendingRequest: 0
}

function fillTokenToHeader(options) {
    const token = localStorage.getItem('t')
    if (options) {
        const headers = options.headers
        if (headers) {
            headers['Content-Type'] = 'application/json'
            headers['authorization'] = `Bearer ${token}`
        } else {
            options.headers = {
                'Content-Type': 'application/json',
                'authorization': `Bearer ${token}`
            }
        }
        return options
    }
    return {
        method: 'GET',
        headers: {
            'authorization': `Bearer ${token}`
        }
    }
}

const Util = {
    isLogin: false,
    open(fn) {
        Loading.open = fn
    },
    close(fn) {
        Loading.close = fn
    },
    fetch(url, options) {
        Loading.open()
        Loading.pendingRequest++
        options = fillTokenToHeader(options)
        return fetch(url, options).then(res => {
            Loading.pendingRequest--
            if (Loading.pendingRequest <= 0) {
                Loading.close()
            }
            return res.json()
        }).then(data => {
            if (url !== '/api/user/checkLogin') {
                if (data.code) {
                    Toast.info(data.name || data.message, 1)
                }
            }
            return data
        })
    },
    Toast: {
        info(txt, callback) {
            Toast.info(txt, 1, callback)
        }
    }
}

export default Util