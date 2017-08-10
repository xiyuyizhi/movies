
const express_jwt = require('express-jwt')
const jwt = require('jsonwebtoken')
const SECRET = 'MOVIESKEY'
module.exports = {

    SECRET,

    sign: (user) => {
        return jwt.sign(user, SECRET,
            { expiresIn: 60 * 60 } //1h
        )
    },
    validToken: express_jwt({
        secret: SECRET,
        getToken: function fromHeaderOrQuerystring(req) {
            if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
                return req.headers.authorization.split(' ')[1];
            } else if (req.query && req.query.token) {
                return req.query.token;
            }
            return null;
        }
    }),
    noAuthorization: (err, req, res, next) => {
        if (err.status == 401) {
            res.json(err)
            return
        }
        next()
    }

}