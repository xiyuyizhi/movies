const DB = require('../db')

class Type {


    addTypes(typesArr, db) {
        const Types = db.collection('types')
        typesArr.forEach(item => {
            Types.update({
                'type_name': item
            }, {
                    '$inc': { count: 1 }
                }, { upsert: true })
        })
    }

    getList(callback) {
        DB.connect().then((db, err) => {
            const Types = db.collection('types')
            Types.find({
                count: {
                    '$gt': 0
                }
            }).toArray((err, docs) => {
                callback(err, docs)
            })
        })
    }

    async delete(typesArr, callback) {
        const db = await DB.connect()
        const Types = db.collection('types')
        typesArr.forEach(async item => {
            await Types.update({
                'type_name': item
            }, { '$inc': { count: -1 } })
        })
        db.close()
    }

    remove(callback) {
        DB.connect().then((db, err) => {
            const Types = db.collection('types')
            Types.remove({}).then(() => {
                db.close()
                callback()
            })
        })
    }

}


module.exports = new Type()