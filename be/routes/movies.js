var express = require('express');
var router = express.Router();
var DB = require('../db')

DB.then((db, err) => {

  console.log('connect to db success')
  const Users = db.collection('users')
  Users.find({}).toArray((err, docs) => {
    console.log(docs)
    db.close()
  })
}).catch(err=>{
  console.log('error')
  console.log(err)
})
/* GET users listing. */
router.post('/add', function (req, res, next) {
  console.log(req.body)
  res.json(req.body);
});

module.exports = router;
