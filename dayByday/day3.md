## 一步一步搭建react应用-mongodb开启身份认证

1. 通过不认证的方式启动Mongodb

```js
	mongod --port 3007  --config mongod.conf
```

2. mongo 连接实例  mongo --port 3307

3. 创建用户超级管理员

```js
use admin
db.createUser(
  {
    user: "myAdmin",
    pwd: "XXXXX",
    roles: [ { role: "userAdminAnyDatabase", db: "admin" } ]
  }
)
```
---

4. 重启mongodb，加上访问控制


```js
	mongod --port 3007  --config mongod.conf --auth
```

5.认证

连接时认证

```js
mongo --port 3307 -u 'xxx' -p 'xxx' --authenticationDatabase "admin"

```
连接后认证

```
mongo --port 3307

use admin

db.auth('username','pwd')

```
---

6. 为其他库创建用户

```
use movies
db.createUser(
  {
    user: "moviesAdmin",
    pwd: "XXXX",
    roles: [ { role: "readWrite", db: "movies" },
             { role: "read", db: "db2" } ]
  }
)
//添加user moviesAdmin,对movies有读写权限，对db2有读权限

```


db.js

```
const {MongoClient,ObjectId} = require('mongodb')
const f = require('util').format
const user = encodeURIComponent('moviesAdmin')
const pwd = encodeURIComponent('xxxxx')
const authMechanism = 'DEFAULT'
let db_name='Movies'
if(process.env.NODE_ENV=='test'){
    db_name='Movies_test'
}
const url = f(`mongodb://%s:%s@localhost:3307/${db_name}?authMechanism=%s`, user, pwd, authMechanism)

module.exports = {
    connect() {
        return MongoClient.connect(url).catch(e=>{
            console.log(e)
        })
    },
    id(id) {
        try {
            if (id) {
                return new ObjectId(id)
            } else {
                return new ObjectId()
            }
        } catch (e) {

        }
    }
}

```