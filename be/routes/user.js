
const express = require('express')
const router = express.Router()
const UserModel = require('../models/user_model')
const token = require('../token')
const redis = require('../redis')
const unlessPath = {
    path: ['/api/user/login']
}

if (process.env.NODE_ENV != 'test') {
    router.use(
        token.validToken.unless(unlessPath),
        token.noAuthorization,
        token.checkRedis.unless(unlessPath)
    )
}

router.post('/add', (req, res, next) => {
    UserModel.add(req.body).then(result => {
        res.json(result)
    }).catch(err => {
        next(err)
    })
})

router.post('/login', (req, res, next) => {
    const u = req.body
    if (u.username && u.password) {
        UserModel.validUser(u.username).then(docs => {
            if (docs.length) {
                //用户存在
                if (docs[0].password !== u.password) {
                    next(10003)
                    return
                }
                const tok = token.sign(docs[0])
                redis.add(tok)
                res.json({
                    code: 0,
                    token: tok
                })
                return
            }
            next(10002)
        }).catch(err => {
            next(err)
        })
        return
    }
    next(10004)
})

module.exports = router