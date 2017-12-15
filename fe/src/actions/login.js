

export const LOAD_SERVERRANDOM = 'LOAD_SERVERRANDOM'
export const RECIEVE_SERVERRANDOM = 'RECIEVE_SERVERRANDOM'
export const RECIEVE_USERNAME = 'RECIEVE_USERNAME'
export const RECIEVE_PASSWORD = 'RECIEVE_PASSWORD'
export const RECIEVE_RANDOM = 'RECIEVE_RANDOME'
export const CHANGE_LOGIN_STATUS = 'CHANGE_LOGIN_STATUS'
export const SUBMIT_LOGIN_REGISTE = 'SUBMIT_LOGIN_REGISTE'
export const FETCH_LOGIN_OUT = 'FETCH_LOGIN_OUT'
export const FETCH_UINGO = 'FETCH_UINFO'
export const RECIEVE_USERINFO = 'RECIEVE_USERINFO'

export function loadServerRandom() {
    return {
        type: LOAD_SERVERRANDOM
    }
}

export function recieveServerRandom(data) {
    return {
        type: RECIEVE_SERVERRANDOM,
        data
    }
}

export function recieveUsername(e) {
    return {
        type: RECIEVE_USERNAME,
        e
    }
}

export function recievePassword(e) {
    return {
        type: RECIEVE_PASSWORD,
        e
    }
}
export function recieveRandom(e) {
    return {
        type: RECIEVE_RANDOM,
        e
    }
}
export function changeLoginStatus() {
    return {
        type: CHANGE_LOGIN_STATUS
    }
}

export function submitLoginRegiste() {
    return {
        type: SUBMIT_LOGIN_REGISTE
    }
}


export function fetchLoginout() {
    return {
        type: FETCH_LOGIN_OUT
    }
}

export function fetchUinfo() {
    return {
        type: FETCH_UINGO
    }
}

export function recieveUInfo(data) {
    return {
        type: RECIEVE_USERINFO,
        uInfo: data
    }
}