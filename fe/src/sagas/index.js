

import Util from "../util/Util"
import {
    LOAD_CATEGORY,
    RECIEVE_TYPE_LIST
} from "../actions/hompage"
import {
    put, takeEvery, call
} from "redux-saga/effects"

function fetchCateTypes() {
    return Util.fetch('/api/types')
}

export function* getCateTypes() {
    const types = yield fetchCateTypes()
    yield put({
        type: RECIEVE_TYPE_LIST,
        list: types.data
    })
}


export function* watchLoadCateGory() {
    yield takeEvery(LOAD_CATEGORY, getCateTypes);
}



