
const DB = require('../config/db')


class User {

  constructor(){
    this.schmea
  }

  async add(user) {
    const db = await DB.connect()
    const docs = await db.collection('users').insertOne(user)
    db.close()
    return docs
  }

  async remove(callback) {
    const db = await DB.connect()
    await db.collection('users').remove({})
    db.close()
  }

  async validUser(username){
    const db=await DB.connect()
    const u= await db.collection('users').find({
      username
    }).toArray()
    db.close()
    return u
  }


}

module.exports = new User()