
const DB = require('../config/db')


class User {

  constructor(){
    this.schmea
  }

  async add(user) {
    const db = await DB.connect()
    const docs = await db.collection('users').insertOne(user)
    return docs
  }

  async remove(callback) {
    const db = await DB.connect()
    await db.collection('users').remove({})
  }

  async validUser(username){
    const db=await DB.connect()
    return await db.collection('users').find({
      username
    }).toArray()
  }


}

module.exports = new User()