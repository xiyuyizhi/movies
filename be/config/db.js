
const { MongoClient, ObjectId } = require('mongodb')
const f = require('util').format
const user = encodeURIComponent('moviesAdmin')
const pwd = encodeURIComponent('wangwei2017')
const authMechanism = 'DEFAULT'
let db_name = 'Movies'
if (process.env.NODE_ENV == 'test') {
    db_name = 'Movies_test'
}
const url = f(`mongodb://%s:%s@localhost:3307/${db_name}?authMechanism=%s`, user, pwd, authMechanism)

module.exports = {
    mongodbclient: null,
    connect() {
        if (this.mongodbclient) {
            return this.mongodbclient
        }
        return (this.mongodbclient = MongoClient.connect(url).catch(e => {
            console.log(e)
        }))
    },
    id(id) {
        try {
            if (id) {
                return new ObjectId(id)
            } else {
                return new ObjectId()
            }
        } catch (e) {

        }
    }
}
