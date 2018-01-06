
export const SET_CATEGORY = 'SET_CATEGORY'
export const SET_SEARCH = 'SET_SEARCH'
export const LOAD_CATEGORY = 'LOAD_CATEGORY'
export const LOAD_MOVIES = 'LOAD_MOVIES'
export const RECIEVE_TYPE_LIST = 'RECIEVE_TYPE_LIST'
export const RECIEVE_MOVIES = 'RECIEVE_MOVIES'
export const LOAD_ITEM_MOVIE = 'LOAD_ITEM_MOVIE'
export const LOAD_MOVIE_ATTACH = 'LOAD_MOVIE_ATTACH'
export const RECIEVE_ITEM_MOVIE = 'RECIEVE_ITEM_MOVIE'
export const RECIEVE_MOVIE_ATTACH = 'RECIEVE_MOVIE_ATTACH'
export const MODIFY_MOVIE = 'MODIFY_MOVIE'
export const RESET_STATE_DETAIL = 'RESET_STATE_DETAIL'
export const LOAD_REPTILE_MOVIE = 'LOAD_REPTILE_MOVIE'

export const CHECK_LOAGIN = 'CHECK_LOAGIN'
export const RECIEVE_CHECK_LOAGIN = 'RECIEVE_CHECK_LOAGIN'

export function checkLogin() {
    return {
        type: CHECK_LOAGIN
    }
}
export function recieveCheckLogin(loginStatus) {
    return {
        type: RECIEVE_CHECK_LOAGIN,
        loginStatus
    }
}
export function setCategory(category) {
    return {
        type: SET_CATEGORY,
        category
    }
}

export function setSearch(search) {
    return {
        type: SET_SEARCH,
        search
    }
}

export function loadCategory() {
    return {
        type: LOAD_CATEGORY
    }
}

export function loadMovies(types) {
    return {
        type: LOAD_MOVIES,
        types
    }
}


export function recieveTypeList(list) {
    return {
        type: RECIEVE_TYPE_LIST,
        list
    }
}

export function recieveMovies(list,types) {
    return {
        type: RECIEVE_MOVIES,
        list,
        types
    }
}


export function loadItemMovie(movieId, loginStatus) {
    return {
        type: LOAD_ITEM_MOVIE,
        movieId,
        loginStatus
    }
}

export function loadMovieAttach(movieId) {
    return {
        type: LOAD_MOVIE_ATTACH,
        movieId
    }
}

export function recieveItemMovieInfo(info) {
    return {
        type: RECIEVE_ITEM_MOVIE,
        movieInfo: info
    }
}

export function recieveMovieAttach(attach) {
    return {
        type: RECIEVE_MOVIE_ATTACH,
        attach
    }
}

export function modifyMovie(data) {
    return {
        ...{
            type: MODIFY_MOVIE,
        },
        ...data
    }
}

export function resetStateDetial() {
    return {
        type: RESET_STATE_DETAIL
    }
}

export function loadReptileMovie(movieName) {
    return {
        type: LOAD_REPTILE_MOVIE,
        name: movieName
    }
}