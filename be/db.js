
const MongoClient = require('mongodb').MongoClient
const f = require('util').format
const user = encodeURIComponent('moviesAdmin')
const pwd = encodeURIComponent('wangwei2017')
const authMechanism = 'DEFAULT'
const url = f('mongodb://%s:%s@localhost:3307/Movies?authMechanism=%s', user, pwd, authMechanism)

module.exports = {
    connect() {
        return MongoClient.connect(url)
    },
    id(id) {
        try {
            if (id) {
                return new MongoClient.ObjectId(id)
            } else {
                return new MongoClient.ObjectId()
            }
        } catch (e) {

        }
    }
}
