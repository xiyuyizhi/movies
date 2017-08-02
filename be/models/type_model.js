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
            Types.find({}).toArray((err, docs) => {
                callback(err, docs)
            })
        })
    }

    delete(typesArr, callback) {

        // const db = DB.connect()
        // const Types = db.collection('types')
        // typesArr.forEach(item => {
        //     await Types.update({
        //         'type_name': item
        //     }, {
        //             '$inc': { count: -1 }
        //         })
        // })
        // db.close()
        // callback()
        DB.connect().then((db, err) => {
            const Types = db.collection('types')
            typesArr.forEach(item => {
                Types.update({
                    'type_name': item
                }, {
                        '$inc': { count: -1 }
                    })
            })
            callback(db)
        })
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