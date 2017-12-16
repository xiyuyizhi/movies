
import {
    RECIEVE_ITEM_MOVIE,
    RECIEVE_MOVIE_ATTACH,
    RESET_STATE_DETAIL
} from "../actions/index"

const defaultState = {
    movieInfo: {},
    attach: {}
}

export default function detail(state = defaultState, action) {

    switch (action.type) {
        case RECIEVE_ITEM_MOVIE:
            return { ...state, movieInfo: action.movieInfo }
        case RECIEVE_MOVIE_ATTACH:
            return { ...state, attach: action.attach || {} }
        case RESET_STATE_DETAIL:
            return { ...state, movieInfo: {}, attach: {} }
        default:
            return state
    }

}