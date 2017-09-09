## 一步一步搭建react应用-使用 jwt + redis 来做基于token的用户身份认证

- ### 基于token的认证流程

1. 客户端用户发登录请求
2. 服务端验证用户名密码
3. 验证成功服务端生成一个token，响应给客户端
4. 客户端之后的每次请求header中都带上这个token
5. 服务端对需要认证的接口要验证token，验证成功接收请求

这里我们采用[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)来生成token，
```
jwt.sign(payload, secretOrPrivateKey, [options, callback])
```
使用[express-jwt](https://github.com/auth0/express-jwt)验证token（验证成功会把token信息放在request.user中）
```
express_jwt({
        secret: SECRET,
        getToken: (req)=> {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
    }
```

- ### 为什么使用redis

**采用jsonwebtoken生成token时可以指定token的有效期，并且jsonwebtoken的verify方法也提供了选项来更新token的有效期，
但这里使用了express_jwt中间件，express_jwt不提供方法来刷新token**

思路：
1. 客户端请求登录成功，生成token
2. 将此token保存在redis中，设置redis的有效期（例如1h）
3. 新的请求过来，先express_jwt验证token，验证成功， 再验证token是否在redis中存在，存在说明有效
4. 有效期内客户端新的请求过来，提取token,更新此token在redis中的有效期
5. 客户端退出登录请求，删除redis中此token


```

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
    //token在redis中存在，更新有效期，不存在说明已退出登录
    checkRedis: (req, res, next) => {
        const tok = token.getToken(req)
        redis.get(tok, (data) => {
            if (data) {
                // token 在redis中存在，延长过期时间
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

```


- ### 使用

routes/movies.js

```
const unlessPath = {
  path: [
    { url: '/api/movies', methods: ['GET'] },
    { url: '/api/movies/search/by', methods: ['GET'] },
    { url: /movies\/[^\/]+$/, methods: ['GET'] },
  ]
}

if (process.env.NODE_ENV != 'test') {
  router.use(
    token.validToken.unless(unlessPath),
    token.noAuthorization,
    token.checkRedis.unless(unlessPath)
  )
}

router.get('/',(req,res,next)=>{})
router.post('/',(req,res,next)=>{})
router.put('/:movieId',(req,res,next)=>{})

```



