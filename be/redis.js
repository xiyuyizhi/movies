
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

module.exports = {
    getToken: getToken
}