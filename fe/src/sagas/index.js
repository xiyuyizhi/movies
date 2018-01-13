

import Util from "../util/Util"
import {
    RECIEVE_CHECK_LOAGIN,
    CHECK_LOAGIN,
    LOAD_ITEM_MOVIE,
    LOAD_MOVIE_ATTACH,
    MODIFY_MOVIE,
    LOAD_REPTILE_MOVIE,
    recieveCheckLogin,
    recieveItemMovieInfo,
    recieveMovieAttach,
    loadMovies
} from "../actions/index"

import {
    LOAD_SERVERRANDOM,
    SUBMIT_LOGIN_REGISTE,
    FETCH_LOGIN_OUT,
    FETCH_UINGO,
    changeLoginStatus,
    recieveServerRandom,
    fetchUinfo,
    recieveUInfo
} from "../actions/login"
import {
    put, takeEvery, takeLatest, call, fork, take, select, join
} from "redux-saga/effects"

import {
    watchLoadCateGory,
    watchLoadMovies
} from "./homepage"

//--------check login status
function* checkLogin() {
    const res = yield Util.fetch('/api/user/checkLogin')
    yield put(recieveCheckLogin(!res.code))
    //先判断是否登录后再查列表
    yield put(loadMovies())
    if (!res.code) {
        //已登录
        yield getUinfo()
    }
}
export function* watchCheckLogin() {
    yield takeLatest(CHECK_LOAGIN, checkLogin)
}

// -----------get userinfo
function* getUinfo() {
    const info = yield (Util.fetch('/api/user/info'))
    yield put(recieveUInfo(info.data))
}
export function* watchFtechUinfo() {
    yield takeLatest(FETCH_UINGO, getUinfo)
}

//-------------get movie detail--------

function* getItemMovie(id) {
    return yield Util.fetch(`/api/movies/${id}`)
}

function* getMovieAttach(id) {
    return yield Util.fetch(`/api/movies/${id}/attach`)
}

function* getMovieInfo(action) {
    const { movieId } = action
    const res = yield call(getItemMovie, movieId)
    yield put(recieveItemMovieInfo(res.data[0]))
}

export function* watchLoadItemMovie() {
    yield takeLatest(LOAD_ITEM_MOVIE, getMovieInfo)
}
export function* watchLoadAttach() {
    while (true) {
        const { movieId } = yield take(LOAD_MOVIE_ATTACH)
        const { attachId } = yield select(state => state.detail.movieInfo)
        const attach = yield call(getMovieAttach, movieId)
        yield put(recieveMovieAttach(attach.data[0]))
    }
}


// ---------------modify movie-------

function modifyMovie(_id, data) {
    return Util.fetch(`/api/movies/${_id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    })
}
function addMovie(data) {
    return Util.fetch('/api/movies', {
        method: 'POST',
        body: JSON.stringify(data)
    })
}
export function* watchModifyMovie() {
    while (true) {
        const { history, mName, isNew } = yield take(MODIFY_MOVIE)
        const { movieInfo, attach } = yield select((state) => state.detail)
        const { _id } = movieInfo
        movieInfo.downloadUrl = attach.url
        movieInfo.downloadPwd = attach.pwd
        delete movieInfo._id
        if (isNew) {
            movieInfo.title = mName
            yield call(addMovie, movieInfo)
        } else {
            yield call(modifyMovie, _id, movieInfo)
        }
        yield put(loadMovies('SEARCH'))
        Util.Toast.info('已修改', () => {
            setTimeout(() => {
                history.push('/home')
            }, 0)
        })
    }
}

// --------------reptile movie-----------

function reptileMovie(name) {
    return Util.fetch('/api/reptile/' + name)
}
export function* watchReptileMovie() {
    while (true) {
        const { name } = yield take(LOAD_REPTILE_MOVIE)
        const res = yield call(reptileMovie, name)
        if (res) {
            yield put(recieveItemMovieInfo(res.data))
        }
    }
}

// ----------------login or register----------

function fetchSeverRandom() {
    return Util.fetch('/api/user/randomCode')
}

function* watchLoadServerRandom() {
    while (true) {
        yield take(LOAD_SERVERRANDOM)
        const res = yield call(fetchSeverRandom)
        res && (yield put(recieveServerRandom(res)))
    }
}

function submitLoginRegiste(url, data) {
    return Util.fetch(url, {
        method: 'POST',
        body: data
    })
}

function* watchLoginRegiste() {
    while (true) {
        yield take(SUBMIT_LOGIN_REGISTE)
        let url = '/api/user/login'
        const { switchToRegiste, username, password } = yield select((state) => state.login)
        if (switchToRegiste) {
            url = "/api/user/add"
        }
        const res = yield call(submitLoginRegiste, url, JSON.stringify({
            username,
            password
        }))
        if (!res) continue
        if (switchToRegiste) {
            yield put(changeLoginStatus())
            Util.Toast.info('请登录')
            continue
        }
        window.localStorage.setItem('t', res.token)
        window.sessionStorage.setItem('r', res.role)
        document.cookie = 'auth=' + res.token+';path=/'
        yield put(recieveCheckLogin(true))
        yield put(fetchUinfo())

    }
}

// ------------lgout-------
function logout() {
    return Util.fetch('/api/user/logout')
}
function* watchLogout() {
    while (true) {
        yield take(FETCH_LOGIN_OUT)
        const res1 = yield call(logout)
        if (!res1) continue
        window.localStorage.removeItem('t')
        document.cookie = 'auth=; expires=Thu, 01 Jan 1970 00:00:01 GMT;';
        yield put(recieveCheckLogin(false))
    }
}

export default function* root() {
    yield fork(watchCheckLogin)
    yield fork(watchFtechUinfo)
    yield fork(watchLoadCateGory)
    yield fork(watchLoadMovies)
    yield fork(watchLoadItemMovie)
    yield fork(watchLoadAttach)
    yield fork(watchModifyMovie)
    yield fork(watchReptileMovie)
    yield fork(watchLoadServerRandom)
    yield fork(watchLoginRegiste)
    yield fork(watchLogout)
}


