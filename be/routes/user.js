
const express = require('express')
const router = express.Router()
const UserModel = require('../models/user_model')
const token = require('../token')

router.post('/add', (req, res, next) => {
    UserModel.add(req.body).then(result => {
        res.json(result)
    }).catch(err => {
        next(err)
    })
})

router.post('/login', (req, res, next) => {
    const u = req.body
    UserModel.validUser(u.username).then(docs => {
        if (docs.length) {
            //用户存在
            if (docs[0].password !== u.password) {
                next(10003)
                return
            }
            const tok = token.sign(docs[0])
            // console.log(token)
            res.json({
                code: 0,
                tok
            })
            return
        }
        next(10002)
    }).catch(err => {
        next(err)
    })
})

module.exports = router