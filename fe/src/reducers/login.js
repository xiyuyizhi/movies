import {
    RECIEVE_SERVERRANDOM,
    RECIEVE_USERNAME,
    RECIEVE_PASSWORD,
    RECIEVE_RANDOM,
    CHANGE_LOGIN_STATUS
} from "../actions/login"

const defaultState = {
    randomCode: '',
    username: '',
    password: '',
    switchToRegiste: false,
    serverCode: {}
}

function geneUrl(base) {
    return "data:image/png;base64, " + base
}

function loginReducer(state = defaultState, action) {
    switch (action.type) {
        case RECIEVE_SERVERRANDOM:
            action.data.base64 = geneUrl(action.data.base64)
            return { ...state, serverCode: action.data }
        case RECIEVE_USERNAME:
            return { ...state, username: action.e.target.value }
        case RECIEVE_PASSWORD:
            return { ...state, password: action.e.target.value }
        case RECIEVE_RANDOM:
            return { ...state, randomCode: action.e.target.value }
        case CHANGE_LOGIN_STATUS:
            let status = !state.switchToRegiste
            return { ...state, switchToRegiste: status }
        default:
            return state
    }
}

export default loginReducer