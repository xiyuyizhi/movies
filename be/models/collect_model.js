
const DB = require('../config/db')
const CONFIG = require('../config/config')
class Collect {


    async addCollect(data) {
        data.createTime = new Date().getTime()
        data.updateTime = new Date().getTime()
        const db = await DB.connect()
        const docs = await db.collection('collect').insertOne(data)
        return docs
    }

    async collectionListByUId(query, uId) {
        const { latest, pageSize } = query
        let params = {
            userId: uId
        }
        if (latest) {
            //分页
            params['updateTime'] = {
                '$lt': Number(latest)
            }
        }
        const db = await DB.connect()
        const movies = await db.collection('collect').find(params).sort({
            updateTime: -1
        }).limit(parseInt(pageSize) || CONFIG.PAGESIZE).toArray()
        db.close()
        return movies
    }

}


module.exports = new Collect()