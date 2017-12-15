
import {
    combineReducers
} from "redux"
import {
    RECIEVE_CHECK_LOAGIN
} from "../actions/index"
import {
    RECIEVE_USERINFO
} from "../actions/login"
import homepage from "./homepage"
import detail from "./detail"
import login from "./login"


function loginStatus(state = {
    login: false
}, action) {
    if (action.type == RECIEVE_CHECK_LOAGIN) {
        return { ...state, login: action.loginStatus }
    }
    return state
}

function uInfo(state = {}, action) {
    if (action.type == RECIEVE_USERINFO) {
        return { ...state, data: action.uInfo }

    }
    return state
}

const reducer = combineReducers({
    homepage,
    detail,
    loginStatus,
    login,
    uInfo
})

export default reducer