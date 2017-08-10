
const redis = require('redis');
const redisClient = redis.createClient(6379);
const EXPIRES = 60 * 60
redisClient.on('error', function (err) {
    console.log('redis Error:' + err);
})

redisClient.on('connect', function () {
    console.log('redis ready');
});

function getToken(header) {
    var authorization = header.authorization;
    if (authorization) {
        var tokenArr = authorization.split(" ");
        if (tokenArr.length) {
            return tokenArr[1];
        }
        return null;

    }
    return null;
}

function setValue(value) {
    redisClient.set(value, { is_expired: true })
    redisClient.expire(value,EXPIRES);
}

function getValue(value, req, res, next) {

    redisClient.get(value, function (err, result) {
        if (err) {

            res.status(500).json({
                'status': 'redis error'
            });

            return false;
        }


        if (result) {
            res.status(401).json({
                'status': 'UnauthorizedError'
            });
            return false;
        }
        next();
    })
}

module.exports = {
    set: setValue,
    get: getValue,
    getToken: getToken
}