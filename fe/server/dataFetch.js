

import { createStore } from "redux"

import reducers from "../src/reducers/index"

import {
    recieveMovies,
    recieveTypeList,
    recieveCheckLogin
} from "../src/actions/index"

import {
    recieveUInfo
} from "../src/actions/login"

import fetchUtil from "./fetchUtil"

let host = process.argv[2]

const getMoviesList = function (store, auth) {
    return fetchUtil(`${host}/api/movies`).then(res => {
        if (auth) {
            //要查询用户的收藏记录
            return getCollectStatus(res.data, auth).then(() => {
                store.dispatch(recieveMovies(res.data))
            })
        } else {
            store.dispatch(recieveMovies(res.data))
        }
    })
}

const getCategory = function (store) {
    return fetchUtil(`${host}/api/types`).then(res => {
        store.dispatch(recieveTypeList(res.data))
    })
}


async function getCollectStatus(list, token) {
    if (!list.length) return list
    const obj = {}
    const ids = list.map(item => {
        return item._id
    })
    let collects = await fetchUtil(`${host}/api/movies/list/checkCollect/?ids=${ids}`, token)
    collects.data && collects.data.forEach(item => {
        obj[item.movieId] = 1
    })
    list.map(x => {
        if (obj[x._id]) {
            x.isCollect = true
        }
        return x
    })
    return list
}

const checkLogin = function (store, token) {
    return fetchUtil(`${host}/api/user/checkLogin`, token)
        .then(res => {
            store.dispatch(recieveCheckLogin(!res.code))
        })
}

const getUinfo = function (store, token) {
    return fetchUtil(`${host}/api/user/info`, token)
        .then(res => {
            store.dispatch(recieveUInfo(res.data))
        })
}

module.exports = function fetchData(req) {
    const store = createStore(reducers)
    let promises
    const auth = req.cookies.auth
    if (auth) {
        promises = [
            getMoviesList(store, auth),
            getCategory(store),
            checkLogin(store, auth),
            getUinfo(store, auth)
        ]
    } else {
        promises = [
            getMoviesList(store),
            getCategory(store),
        ]
    }

    return {
        promises,
        store
    }
}    