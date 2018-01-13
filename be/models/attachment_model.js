
const DB = require('../config/db')

class Attachment {
    addAttach(data, db) {
        const Attach = db.collection('attachment')
        return Attach.insertOne(data)
    }

    getAttach(id,callback) {
        DB.connect().then((db, err) => {
            const Attach = db.collection('attachment')
            Attach.find({
                _id: DB.id(id)
            }).toArray().then((docs,err)=>{
                callback(err,docs)
                // db.close()
            })
        })

    }

    remove(callback) {
        DB.connect().then((db, err) => {
            const Attach = db.collection('attachment')
            Attach.remove({}).then(() => {
                callback()
                // db.close()
            })
        })
    }



}


module.exports = new Attachment()