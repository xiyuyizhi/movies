
import {
    combineReducers
} from "redux"

import homepage from "./homepage"
import detail from "./detail"

const reducer = combineReducers({
    homepage,
    detail
})

export default reducer