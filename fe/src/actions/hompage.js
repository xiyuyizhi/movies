
export const SET_CATEGORY = 'SET_CATEGORY'
export const SET_SEARCH = 'SET_SEARCH'
export const RECIEVE_TYPE_LIST = 'RECIEVE_TYPE_LIST'
export const LOAD_CATEGORY ='LOAD_CATEGORY'

export function set_category(category) {
    return {
        type: SET_CATEGORY,
        category
    }
}

export function set_search(search) {
    return {
        type: SET_SEARCH,
        search
    }
}

export function load_category(){
    return {
        type:LOAD_CATEGORY
    }
}

export function recieve_type_list(list) {
    return {
        type: RECIEVE_TYPE_LIST,
        list
    }
}