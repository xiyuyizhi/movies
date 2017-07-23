const DB = require('../db')

class Type {

    
    addTypes(typesArr, callback) {
        DB.connect().then((db, err) => {
            const Types = db.collection('types')
            typesArr.forEach(item => {
                Types.find({
                    type_name:item
                }).toArray((err, docs) => {
                    if(!docs.length){
                        //不存在就插入
                        Types.insertOne({
                            type_name:item
                        })
                    }
                })
            })
        })
    }

    
}


module.exports = Type