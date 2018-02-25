
import {
    SET_CATEGORY,
    SET_SEARCH,
    SET_REFRESH,
    RECIEVE_TYPE_LIST,
    RECIEVE_MOVIES,
    RECIEVE_LATEST_MOVIES
} from "../actions/index"
import { stat } from "fs";
const defaultState = {
    category: '',
    search: '',
    types: [],
    list: [],
    noMore: false,
    onRefresh:false
}

export default function homePage(state = defaultState, action) {

    switch (action.type) {
        case SET_CATEGORY:
            return { ...state, category: action.category[0], noMore: false }
        case SET_SEARCH:
            return { ...state, search: action.search, noMore: false }
        case SET_REFRESH:
            return {...state,onRefresh:true}    
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
        case RECIEVE_LATEST_MOVIES:
            return {
                ...state,
                onRefresh:false,
                list:[...action.list,...state.list]
            }
        default:
            return state
    }

}