
const express_jwt = require('express-jwt')
const redis = require('./redis')
const jwt = require('jsonwebtoken')
const unless = require('express-unless')

const SECRET = 'MOVIESKEY'
const token = {

    SECRET,
    sign: (user) => {
        return jwt.sign(user, SECRET)
    },
    getToken: function fromHeaderOrQuerystring(req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    },
    validToken: express_jwt({
        secret: SECRET,
        getToken: this.getToken
    }),
    noAuthorization: (err, req, res, next) => {
        if (err.status == 401) {
            res.json(err)
            return
        }
        next()
    },
    checkRedis: (req, res, next) => {
        const tok = token.getToken(req)
        redis.get(tok, (data) => {
            if (data) {
                // token 在redis中存在，延长过期shijian
                redis.updateExpire(tok)
                next()
            } else {
                next(10005)
            }
        })
    },
    add:(tok)=>{
        redis.add(tok)
    },
    remove: (req) => {
        const tok = token.getToken(req)
        tok && redis.remove(tok)
    }
}
token.checkRedis.unless = unless
module.exports = token
