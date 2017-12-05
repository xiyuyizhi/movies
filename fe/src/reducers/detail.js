
import {
    RECIEVE_ITEM_MOVIE,
    RECIEVE_MOVIE_ATTACH
} from "../actions/hompage"

const defaultState = {
    movieInfo: {
        actors:[],
        type:[]
    },
    attach: {}
}

export default function detail(state = defaultState, action) {

    switch (action.type) {
        case RECIEVE_ITEM_MOVIE:
            return { ...state, movieInfo: action.movieInfo }
        case RECIEVE_MOVIE_ATTACH:
            return { ...state, attach: action.attach }
        default:
            return state
    }

}