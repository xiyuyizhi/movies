

import Util from "../util/Util"
import {
    CHECK_LOAGIN,
    LOAD_CATEGORY,
    LOAD_ITEM_MOVIE,
    MODIFY_MOVIE,
    LOAD_REPTILE_MOVIE,
    recieveCheckLogin,
    recieveTypeList,
    recieveItemMovieInfo,
    recieveMovieAttach
} from "../actions/index"

import {
    put, takeEvery, call, fork, take, select
} from "redux-saga/effects"

//--------check login status
function checkLogin() {
    return Util.fetch('/api/user/checkLogin')
}
export function* watchCheckLogin() {
    while (true) {
        yield take(CHECK_LOAGIN)
        const res = yield call(checkLogin)
        yield put(recieveCheckLogin(!res.code))
    }
}

//---------get category---------

function fetchCateTypes() {
    return Util.fetch('/api/types')
}

export function* getCateTypes(action) {
    const types = yield call(fetchCateTypes)
    yield put(recieveTypeList(types.data))
}

export function* watchLoadCateGory() {
    yield takeEvery(LOAD_CATEGORY, getCateTypes);
}

//-------------get movie detail--------

function fetchItemMovie(id) {
    return Util.fetch(`/api/movies/${id}`)
}


export function* getItemMovie(movieId) {
    return yield call(fetchItemMovie, movieId)
}

// --------------get movie attach-------

function fetchItemAttach(id) {
    return Util.fetch(`/api/movies/${id}/attach`)
}

function* getMovieAttach(movieId) {
    return yield call(fetchItemAttach, movieId)
}

export function* watchLoadItemMovie() {
    while (true) {
        const { movieId, loginStatus } = yield take(LOAD_ITEM_MOVIE)
        const res = yield call(getItemMovie, movieId)
        yield put(recieveItemMovieInfo(res.data[0]))
        if (res.data[0].attachId && loginStatus) {
            const attach = yield call(getMovieAttach, movieId)
            yield put(recieveMovieAttach(attach.data[0]))
        }
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

export default function* root() {
    yield fork(watchCheckLogin)
    yield fork(watchLoadCateGory)
    yield fork(watchLoadItemMovie)
    yield fork(watchModifyMovie)
    yield fork(watchReptileMovie)
}


