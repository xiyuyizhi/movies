
import {
    SET_CATEGORY,
    SET_SEARCH,
    RECIEVE_TYPE_LIST
} from "../actions/index"

const defaultState = {
    category: '',
    search: '',
    types: []
}

export default function homePage(state = defaultState, action) {

    switch (action.type) {
        case SET_CATEGORY:
            return { ...state, category: action.category[0] }
        case SET_SEARCH:
            return { ...state, search: action.search }
        case RECIEVE_TYPE_LIST:
            return Object.assign({}, state, {
                types: action.list.map(item => {
                    return {
                        label: item.type_name,
                        value: item.type_name
                    }
                })
            })
        default:
            return state
    }

}