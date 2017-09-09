## node中使用 mocha + supertest + should 来写单元测试


*mocha 是一个node单元测试框架，类似于前端的jasmine,语法也相近*

*supertest 用来测试node接口的库*

*should nodejs断言库，可读性很高*

- ### 搭建

```
npm install mocha should supertest --save-dev

```

项目根目录下新建test文件夹，movies.spec.js

package.json中

```
"scripts": {
    "start": "pm2 start ecosystem.config.js",
    "test": "mocha --watch" //监听 test文件下的所有文件
  },

```

- ### 接口描述

这里我们来测试一个添加一条电影的接口 

```
    method: POST
    api:   /api/movies
    document:  {
        "title": 'movie0',
        "thumb": "public/p1075586949.jpg",
        "actors": [
            "河正宇",
            "金允石",
            "郑满植"
        ],
        "type": [
            "动作",
            "犯罪"
        ],
        "instruct": 'instruct...',
        "time": "2010-12-22(韩国)",
    }
```
这里电影信息会保存到movies集合中，类型信息保存在types集合中
需要注意的是如果多条电影有相同的type，则同一个电影类型在collection中只存一次，但会inc count字段

**大体代码**

*/routes/movies.js*

```
 const MoviesModel = require('../models/movies_model')
 const CONFIG = require('../config/config')

 function callback(err, docs, res, next) {
    if (err) {
        next(err)
        return
    }
    res.json({
        code: CONFIG.ERR_OK,
        data: docs
    })
}

 router.post('/', function (req, res, next) {
    MoviesModel.addMovies(req.body, (err, docs) => {
        callback(err, docs, res, next)
    })
 });

```

*/models/movies_model.js*

```
    const TypeModel = require('./type_model')
    class MoviesModel{

        addMovies(data, callback) {
            const types = data.type
            DB.connect().then((db, err) => {
                TypeModel.addTypes(types, db) //保存分类
                this.insertOne(db, data, callback)
            }).catch(e => {
                callback(e)
            })
        }
    }
```
*/models/type_model.js*

```
 class Type{

    addTypes(typesArr, db) {
            const Types = db.collection('types')
            typesArr.forEach(item => {
                Types.update({
                    'type_name': item
                }, {
                    '$inc': { count: 1 }
                }, { upsert: true })
            })
        }

 }

```

- ### 测试

测试中我们录入两条电影信息，两条的type字段中会有一个相同的类型

我们要验证的结论：

两条电影都成功录入，types集合中有三条document,"动作"的count是2，另两条count是1

*当前环境是test时，使用测试数据库*
```
/config/db.js

let db_name='Movies'
if(process.env.NODE_ENV=='test'){
    db_name='Movies_test'
}
const url = f(`mongodb://%s:%s@localhost:3307/${db_name}?authMechanism=%s`, user, pwd, authMechanism)

```


*测试数据*

```
const movieInfo = {
    "title": 'movie0'，"thumb": "public/p1075586949.jpg",
    "actors": [
        "河正宇",
    ],
    "type": [
        "动作",
        "犯罪"
    ],
    "instruct": 'instruct...',"time": "2010-12-22(韩国)",
}
const movieInfo1 = {
    "title": 'movie1',"thumb": "public/p1075586949.jpg",
    "actors": [
        "河正宇",
    ],
    "type": [
        "动作",
        "爱情"
    ],
    "instruct": 'instruct...',"time": "2010-12-22(韩国)",
}
```

*测试代码*

```
process.env.NODE_ENV = 'test' //运行时，会将当前环境设置为test，连接数据库时使用Movies_test库,如上
const should = require('should')
const request = require('supertest')
const app = require('../app')

describe('Movies Test',()=>{

    describe('POST /movies',()=>{
        //每个it语句运行开始之前会插入数据
        beforeEach(function (done) {
            request(app) //启动node服务
                .post('/api/movies').send(movieInfo).then(() => {
                    return request(app).post('/api/movies').send(movieInfo1)
                }).then(res => {
                    done()
                })
        })

        //每个it语句运行完之后会清除表数据
        afterEach(function (done) {
            MoviesModel.remove(() => {
                TypeModel.remove(() => {
                    done()
                })
            })
       })

        //测试录入成功
        it('add movie and get the added movie', function (done) {
            request(app)
                .get('/api/movies')
                .end((er, res) => {
                    should(res.body.data).have.length(2)
                    should(res.body.data[0]).have.property('title', 'movie1')
                    done()
                })
        })

        //类型已经存在的就不在存了
        it('repeat type not saved,will only increment count', function (done) {
            request(app)
                .get('/api/types')
                .then(res => {
                    should(res.body.data).have.length(3)
                    should(res.body.data[0]).have.property('count', 2) //"动作"的count是2
                    should(res.body.data[1]).have.property('count', 1) 
                    should(res.body.data[2]).have.property('count', 1) 
                    done()
                })
        })
    })

})
```

详细完整的对每个接口的测试见 [test](https://github.com/xiyuyizhi/movies/tree/master/be/test)