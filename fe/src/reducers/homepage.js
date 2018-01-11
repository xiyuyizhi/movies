
import {
    SET_CATEGORY,
    SET_SEARCH,
    RECIEVE_TYPE_LIST,
    RECIEVE_MOVIES,
    recieveMovies
} from "../actions/index"
// import data from "../mock"
const defaultState = {
    category: '',
    search: '',
    types: [],
    list: [],
    noMore: false
}

export default function homePage(state = defaultState, action) {

    switch (action.type) {
        case SET_CATEGORY:
            return { ...state, category: action.category[0], noMore: false }
        case SET_SEARCH:
            return { ...state, search: action.search, noMore: false }
        case RECIEVE_TYPE_LIST:
            return Object.assign({}, state, {
                types: action.list.map(item => {
                    return {
                        label: item.type_name,
                        value: item.type_name
                    }
                })
            })
        case RECIEVE_MOVIES:
            if (action.types == 'SEARCH') {
                return {
                    ...state,
                    list: action.list,
                    noMore: false
                }
            }
            if (action.list.length) {
                return {
                    ...state,
                    list: [...state.list, ...action.list]
                }
            }
            return { ...state, noMore: true }

        default:
            return state
    }

}