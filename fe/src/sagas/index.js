

import Util from "../util/Util"
import {
    LOAD_CATEGORY,
    LOAD_ITEM_MOVIE,
    recieveTypeList,
    recieveItemMovieInfo,
    recieveMovieAttach
} from "../actions/hompage"

import {
    put, takeEvery, call, fork, take
} from "redux-saga/effects"

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
        const { movieId, loginStatus} = yield take(LOAD_ITEM_MOVIE)
        const res = yield call(getItemMovie, movieId)
        yield put(recieveItemMovieInfo(res.data[0]))
        console.log('loginStatus '+loginStatus);
        if (res.data[0].attachId && loginStatus) {
            const attach = yield call(getMovieAttach, movieId)
            yield put(recieveMovieAttach(attach.data[0]))
        }
    }
}

export default function* root() {
    yield fork(watchLoadCateGory)
    yield fork(watchLoadItemMovie)
}


