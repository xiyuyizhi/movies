
const express = require('express')
const router = express.Router()
const CONFIG = require('../config/config')
const captchapng = require('captchapng');
const UserModel = require('../models/user_model')
const CollectModel = require('../models//collect_model')
const token = require('../config/token')
const unlessPath = {
    path: [
        { url: '/api/user/login', methods: ['POST'] },
        { url: '/api/user/add', methods: ['POST'] },
        { url: '/api/user/randomCode', methods: ['GET'] },
        { url: '/api/user/checkLogin', methods: ['GET'] },
    ]
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
                /**
                 * 保存token到redis
                 */
                token.add(tok)
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

router.get('/logout', (req, res, next) => {
    token.remove(req)
    res.json({
        code: CONFIG.ERR_OK,
        status: 'ok'
    })
})

router.get('/randomCode', (req, res, next) => {
    const random = parseInt(Math.random() * 9000 + 1000)
    var p = new captchapng(80, 30, random); // width,height,numeric captcha
    p.color(0, 0, 0, 0);  // First color: background (red, green, blue, alpha)
    p.color(80, 80, 80, 255); // Second color: paint (red, green, blue, alpha)

    var img = p.getBase64();
    res.json({
        code: CONFIG.ERR_OK,
        base64: img,
        random
    })
})

router.get('/checkLogin', (req, res, next) => {
    token.checkRedis(req, res, next)
}, (req, res, next) => {
    res.json({
        code: CONFIG.ERR_OK,
        login: true
    })
})

/**
 * 收藏列表
 */

router.get('/collections', (req, res, next) => {

    CollectModel.collectionListByUId(req.query, req.user._id).then(docs => {
        res.json({
            code: CONFIG.ERR_OK,
            data: docs
        })
    }).catch(err => {
        next(err)
    })
})


module.exports = router