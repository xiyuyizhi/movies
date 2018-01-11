

import { createStore } from "redux"

import reducers from "../src/reducers/index"

const getD = function (store) {
    return fetch('http://localhost:9000/api/movies').then(res => res.json())
        .then(res => {
            //   console.log(res);
            store.dispatch({
                type: 'RECIEVE_MOVIES',
                list: res.data
            })

            console.log('获取数据');
        })

}
const checkLogin = function (store, token) {
    return fetch('http://localhost:9000/api/user/checkLogin', {
        headers: {
            'authorization': `Bearer ${token}`
        }
    }).then(res => res.json())
        .then(res => {
            console.log(res);
            store.dispatch({
                type: 'RECIEVE_CHECK_LOAGIN',
                loginStatus: !res.code
            })
        })
}

const loadCategory=function(store){
    return fetch('http://localhost:9000/api/types').then(res=>res.json())
    .then(res=>{
        store.dispatch({
            type: 'RECIEVE_TYPE_LIST',
            list: res.data
        })
    })
}




module.exports = function fetchData(req) {
    const store = createStore(reducers)
    let promises = [getD(store),loadCategory(store)]
    promises = [
        getD(store),
        loadCategory(store),
        checkLogin(store, req.cookies.auth)
    ]
    return {
        promises,
        store
    }
}    