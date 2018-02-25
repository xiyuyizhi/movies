const DB = require('../config/db')
const TypeModel = require('./type_model')
const AttachModel = require('./attachment_model')
const CONFIG = require('../config/config')

class MoviesModel {

    constructor() {
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
        DB.connect().then((db, err) => {
            TypeModel.addTypes(types, db) //保存分类
            if (data.downloadUrl) {
                const attch = {
                    url: data.downloadUrl,
                    pwd: data.downloadPwd
                }
                delete data.downloadUrl
                delete data.downloadPwd
                //保存下载地址
                AttachModel.addAttach(attch, db).then(docs => {
                    data.attachId = docs.insertedId
                    this.insertOne(db, data, callback)
                })

            } else {
                this.insertOne(db, data, callback)
            }
        }).catch(e => {
            callback(e)
        })
    }


    insertOne(db, data, callback) {
        this.getCollection(db).insertOne(data).then((docs, err) => {
            callback(err, docs)
            // db.close()
        })
    }

    modifyMovie(movieId, data, callback) {
        this.delete(movieId, (err) => {
            if (err) {
                callback(err)
                return
            }
            if (!data.downloadUrl) {
                delete data.downloadUrl
                delete data.downloadPwd
                delete data.attachId
            }
            this.addMovies(data, (err, docs) => {
                callback(err, docs)
            })
        })
    }

    /**
     * 获取电影列表，按更新时间降序排，分页是按每一个最后一条的时间来查询
     * @param {* 查询字符串} query 
     * @param {*} callback 
     */
    getList(query, callback) {
        const { latest, pageSize } = query
        let params
        if (latest) {
            //分页
            params = {
                updateTime: {
                    '$lt': Number(latest)
                }
            }
        } else {
            params = {}
        }
        DB.connect().then((db, err) => {
            this.getCollection(db).find(params).sort({
                updateTime: -1
            }).limit(parseInt(pageSize) || CONFIG.PAGESIZE).toArray((err, docs) => {
                callback(err, docs)
                // db.close()
            })
        }).catch(e => {
            callback(e)
        })
    }


    getLatest(query, callback) {
        const { latest,pageSize } = query
        DB.connect().then((db, err) => {
            this.getCollection(db).find({
                updateTime:{
                    '$gt':Number(latest)
                }
            }).sort({
                updateTime: -1
            }).limit(parseInt(pageSize) || CONFIG.PAGESIZE).toArray((err, docs) => {
                callback(err, docs)
                // db.close()
            })
        })
    }

    /**
     * 按类型分类、按title查询
     * @param {*} query 
     * @param {*} callback 
     */
    search(query, callback) {
        const { cate, content, latest } = query
        const queryObj = {}
        cate && (queryObj['type'] = cate)
        content && (queryObj['title'] = new RegExp(content))
        latest && (queryObj['updateTime'] = {
            '$lt': Number(query.latest)
        })
        DB.connect().then((db, err) => {
            this.getCollection(db).find(queryObj).sort({
                updateTime: -1
            }).toArray().then((docs, err) => {
                callback(err, docs)
                // db.close()
            })
        })
    }


    async getListByIds(ids) {
        const db = await DB.connect()
        const docs = db.collection('movies').find({
            _id: {
                '$in': ids.map(item => {
                    return DB.id(item)
                })
            }
        }).toArray()
        // db.close()
        return docs
    }


    /**
     * 详情
     * @param {*} movieId 
     * @param {*} callback 
     */
    getOneMovie(movieId, callback) {
        DB.connect().then((db, err) => {
            this.getCollection(db).find({
                _id: DB.id(movieId)
            }).toArray((err, docs) => {
                callback(err, docs)
                // db.close()
            })
        }).catch(e => {
            callback(e)
        })
    }

    /**
     * 获取下载地址
     * @param {*} movieId 
     * @param {*} callback 
     */
    getMovieAttach(movieId, callback) {
        this.getOneMovie(movieId, (err, docs) => {
            if (docs.length) {
                const attachId = docs[0].attachId
                AttachModel.getAttach(attachId, (err, docs) => {
                    callback(err, docs)
                })
                return
            }
            callback(err, docs)
        })
    }


    /**
     * 删除，同时type集合相应的类型数量-1
     * @param {*} movieId 
     * @param {*} callback 
     */
    delete(movieId, callback) {
        this.getOneMovie(movieId, (err, docs) => {
            if (err) {
                callback(err)
                return
            }
            if (docs.length) {
                const Types = docs[0].type
                const Dlet = async () => {
                    await TypeModel.delete(Types)
                    const db = await DB.connect()
                    const docs = await this.getCollection(db).remove({
                        _id: DB.id(movieId)
                    })
                    callback(null, docs)
                    // db.close()
                }
                Dlet()
                return
            }
            callback(err, docs)
        })

    }

    remove(callback) {
        DB.connect().then((db, err) => {
            this.getCollection(db).remove({}).then(() => {
                callback()
                // db.close()
            })
        })
    }

}

module.exports = new MoviesModel()