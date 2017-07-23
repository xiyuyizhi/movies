const DB = require('../db')
const TypeModel = require('./type_model')

class MoviesModel {

    constructor() {
        this.Type = new TypeModel()
    }

    getCollection(db) {
        return db.collection('movies')
    }

    /**
     * 
     * @param {* movie info} data 
     */
    addMovies(data, callback) {
        const types = data.type
        data.createTime = new Date().getTime()
        data.updateTime = new Date().getTime()
        this.Type.addTypes(types)
        DB.connect().then((db, err) => {
            const Movies = this.getCollection(db)
            Movies.insertOne(data).then((docs, err) => {
                console.log(docs)
                callback(docs, err)
                db.close()
            })
        })
    }

    getList(query, callback) {
        const pageSize = 10
        console.log(query)
        if (query.latest) {
            //分页
            DB.connect().then((db, err) => {
                this.getCollection(db).find({
                    updateTime: {
                        '$lt': Number(query.latest)
                    }
                }).sort({
                    updateTime: -1
                }).limit(pageSize).toArray((err, docs) => {
                    callback(err, docs)
                    db.close()
                })
            })
        } else {
            DB.connect().then((db, err) => {
                this.getCollection(db).find().sort({
                    updateTime: -1
                }).limit(pageSize).toArray((err, docs) => {
                    callback(err, docs)
                    db.close()
                })
            })
        }
    }

}

module.exports = new MoviesModel()