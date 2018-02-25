
import {
    put, takeEvery, call, select
} from "redux-saga/effects"
import Util from "../util/Util"
import {
    setRefresh,
    LOAD_CATEGORY,
    LOAD_MOVIES,
    LOAD_LATEST_MOVIES,
    recieveTypeList,
    recieveMovies,
    recieveLatestMovies
} from "../actions/index"
import { stat } from "fs";

//---------get category---------

function fetchCateTypes() {
    return Util.fetch('/api/types')
}

function* getCateTypes(action) {
    const types = yield call(fetchCateTypes)
    yield put(recieveTypeList(types.data))
}

export function* watchLoadCateGory() {
    yield takeEvery(LOAD_CATEGORY, getCateTypes);
}


// ---------get movies list
function _handleQuery(category, search) {
    let cateStr
    let searchStr
    category !== '分类' && (cateStr = 'cate=' + category)
    search && (searchStr = 'content=' + search)
    if (cateStr && searchStr) {
        return cateStr + '&' + searchStr
    }
    if (cateStr) {
        return cateStr
    }
    if (searchStr) {
        return searchStr
    }

}
/**
 * loading用来解决antd-mobile ListView组件 onEndReached多次请求的问题
 * 下一页分两种，无搜索时分页，有搜索时分页
 * 
 */
let loading = false
function* getMovies(action) {
    let url
    let latest
    const { category, search, list, noMore } = yield select(state => state.homepage)
    let { types } = action
    if (loading || (types == 'NEXT' && noMore)) {
        return
    }
    const { login } = yield select(state => state.loginStatus)
    if (types == 'NEXT') {
        latest = list[list.length - 1].updateTime
    }
    if (category || search) {
        let query = latest ? _handleQuery(category, search) + '&latest=' + latest : _handleQuery(category, search)
        url = `/api/movies/search/by?${query}`
    } else {
        url = latest ? `/api/movies?latest=${latest}` : '/api/movies'
    }
    loading = true
    const res = yield Util.fetch(url)
    loading = false
    const composeData = yield getCollectStatus(res.data, login)
    yield put(recieveMovies(composeData, types))
}

function* getCollectStatus(list, login) {
    if (!login || !list.length) return list
    const obj = {}
    const ids = list.map(item => {
        return item._id
    })
    const collects = yield Util.fetch(`/api/movies/list/checkCollect/?ids=${ids}`)
    if (collects) {
        collects.data && collects.data.forEach(item => {
            obj[item.movieId] = 1
        })
        return list.map(x => {
            if (obj[x._id]) {
                x.isCollect = true
            }
            return x
        })
    }
    return list
}

export function* watchLoadMovies() {
    yield takeEvery(LOAD_MOVIES, getMovies)
}


//  get latest movies

function* getLatestMovies(){
    yield put(setRefresh())
    const {list}=yield select(state=>state.homepage)
    const latestTime=list[0]&& list[0].updateTime
    const res =yield Util.fetch('/api/movies/latest?latest='+latestTime)
    yield put(recieveLatestMovies(res.data))
}

export function* watchLatestMovies(){
    yield takeEvery(LOAD_LATEST_MOVIES,getLatestMovies)
}