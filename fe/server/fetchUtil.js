

require('isomorphic-fetch');

export default function fetchUtil(url, token) {
    return fetch(url, {
        headers: token ? {
            'authorization': `Bearer ${token}`
        } : {}
    }).then(res => res.json())
}