
const MongoClient = require('mongodb').MongoClient
const f=require('util').format
const user=encodeURIComponent('moviesAdmin')
const pwd=encodeURIComponent('wangwei2017')
const authMechanism='DEFAULT'
const url =f('mongodb://%s:%s@localhost:3307/Movies?authMechanism=%s',user,pwd,authMechanism)

module.exports= MongoClient.connect(url)