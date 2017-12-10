
import {
    combineReducers
} from "redux"
import {
    RECIEVE_CHECK_LOAGIN
} from "../actions/index"
import homepage from "./homepage"
import detail from "./detail"

function loginStatus(state = false, action) {
    if (action.type == RECIEVE_CHECK_LOAGIN) {
        return { ...state, login: action.loginStatus }
    }
    return state
}

const reducer = combineReducers({
    homepage,
    detail,
    loginStatus
})

export default reducer