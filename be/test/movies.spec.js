
process.env.NODE_ENV = 'test'
const should = require('should')
const request = require('supertest')
const app = require('../app')
const MoviesModel = require('../models/movies_model')
const TypeModel = require('../models/type_model')
const AttchModel = require('../models/attachment_model')
const UserModel = require('../models/user_model')
const DB = require('../db')

const data = require('./mock.data')


describe('Movies', function () {
  this.timeout(2000)  //全局定义一下 其下的timeout最大时间



  /**
   * 查询接口
   */
  describe('GET /movies', function () {
    it('response with data property', function (done) {
      request(app)
        .get('/api/movies')
        .end(function (err, res) {
          console.log(res.body)
          should(res.body).have.property('data', [])
          done()
        })
    })

    describe('PageSize', function () {
      beforeEach(function (done) {
        //插入三条记录
        request(app)
          .post('/api/movies').send(data.movieInfo).then(() => {
            return request(app).post('/api/movies').send(data.movieInfo1)
          }).then(() => {
            return request(app).post('/api/movies').send(data.movieInfo2)
          }).then(res => {
            done()
          })
      })
      afterEach(function (done) {
        MoviesModel.remove(() => {
          TypeModel.remove(() => {
            done()
          })
        })
      })

      it('get movies', (done) => {
        request(app)
          .get('/api/movies')
          .end(function (err, res) {
            should(res.body).have.property('data').length(3)
            done()
          })
      })

      it('get movies by pageSize=2', (done) => {
        request(app)
          .get('/api/movies?pageSize=2')
          .end(function (err, res) {
            should(res.body).have.property('data').length(2)
            done()
          })
      })
      //查询下一页
      it('get movies by latest', (done) => {
        let timeBeforeInsert = new Date().getTime()
        request(app)
          .get('/api/movies?latest=' + timeBeforeInsert)
          .end(function (err, res) {
            should(res.body).have.property('data').length(3)
            done()
          })
      })
    })


  })

  /**
   * 添加
   */
  describe('POST /movies', function () {
    beforeEach(function (done) {
      request(app)
        .post('/api/movies').send(data.movieInfo).then(() => {
          return request(app).post('/api/movies').send(data.movieInfo1)
        }).then(res => {
          done()
        })
    })
    afterEach(function (done) {
      MoviesModel.remove(() => {
        TypeModel.remove(() => {
          done()
        })
      })
    })

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
          should(res.body.data[0]).have.property('count', 2)
          done()
        })
    })
  })



  /**
   * 保存带下载地址的
   */

  describe('POST with attchment', function () {

    beforeEach(done => {
      request(app)
        .post('/api/movies').send(data.movieInfo4).end((err, res) => {
          done()
        })
    })

    afterEach(done => {
      MoviesModel.remove(() => {
        TypeModel.remove(() => {
          AttchModel.remove(() => {
            done()
          })
        })
      })
    })

    //Attachment集合中插入了 url,pwd
    it('save movies which have download url', done => {
      request(app)
        .get('/api/movies')
        .end(function (err, res) {
          should(res.body).have.property('data').length(1)
          const mId = res.body.data[0]._id
          request(app)
            .get('/api/movies/' + mId + '/attach').then(res => {
              should(res.body).have.property('data').length(1)
              should(res.body.data[0]).have.property('url', 'urls')
              done()
            })
        })
    })

  })

  /**
   * 搜索
   */
  describe('Search movies', function () {

    beforeEach(function (done) {

      request(app)
        .post('/api/movies').send(data.movieInfo2).then(() => {
          return request(app).post('/api/movies').send(data.movieInfo3)
        }).then(res => {
          done()
        })
    })

    afterEach(function (done) {
      MoviesModel.remove(() => {
        TypeModel.remove(() => {
          done()
        })
      })
    })

    it('search movies by category', function (done) {
      request(app)
        .get(`/api/movies/search/by?cate=${encodeURIComponent('动作')}`)
        .then(res => {
          should(res.body.data).have.length(2)
          should(res.body.data[0]).have.property('type').matchAny('动作')
          done()
        })
    })

    it('search movies by title', function (done) {
      request(app)
        .get(`/api/movies/search/by?content=title`)
        .then(res => {
          should(res.body.data).have.length(1)
          should(res.body.data[0]).have.property('title', 'test seach by title')
          done()
        })
    })




  })


  describe('DELETE /movies', function (done) {

    beforeEach(function (done) {
      request(app)
        .post('/api/movies').send(data.movieInfo).then(() => {
          return request(app).post('/api/movies').send(data.movieInfo1)
        }).then(res => {
          done()
        })
    })
    afterEach(function (done) {
      MoviesModel.remove(() => {
        TypeModel.remove(() => {
          AttchModel.remove(() => {
            done()
          })
        })
      })
    })

    it('delete movie will reduce Type collection count,only get Typs who‘s count >0’', done => {
      request(app)
        .get('/api/movies').then(res => {
          should(res.body).have.property('data').length(2)
          const _id = res.body.data[0]._id
          request(app)
            .get('/api/types').then(res => {
              should(res.body).have.property('data').length(3)
              should(res.body.data[0]).have.property('count', 2)
              should(res.body.data[1]).have.property('count', 2)
              should(res.body.data[2]).have.property('count', 1)
              //删除 title movie1
              request(app)
                .delete('/api/movies/' + _id).then(res => {
                  request(app)
                    .get('/api/types').then(res => {
                      should(res.body).have.property('data').length(2)
                      should(res.body.data[0]).have.property('count', 1)
                      should(res.body.data[1]).have.property('count', 1)
                      done()
                    })

                })
            })

        })
    })
  })

  describe('PUT /movies', function (done) {

    beforeEach(function (done) {
      request(app)
        .post('/api/movies').send(data.movieInfo5).then(() => {
          return request(app).post('/api/movies').send(data.movieInfo6)
        }).then(res => {
          done()
        })
    })
    afterEach(function (done) {
      MoviesModel.remove(() => {
        TypeModel.remove(() => {
          AttchModel.remove(() => {
            done()
          })
        })
      })
    })

    it('modify movies', done => {
      request(app)
        .get('/api/movies').then(res => {
          should(res.body).have.property('data').length(2)
          const _id = res.body.data[1]._id
          request(app)
            .get('/api/types').then(res => {
              should(res.body).have.property('data').length(3)
              should(res.body.data[0]).have.property('count', 2)
              should(res.body.data[1]).have.property('count', 1)
              should(res.body.data[2]).have.property('count', 1)
              request(app)
                .put('/api/movies/' + _id + "/attach")
                .send(data.movieInfo7)
                .then(res => {
                  request(app)
                    .get('/api/types').then(res => {
                      should(res.body).have.property('data').length(3)
                      should(res.body.data[0]).have.property('count', 2)
                      should(res.body.data[1]).have.property('count', 1)
                      should(res.body.data[2]).have.property('count', 1)
                      done()
                    })
                })
            })
        })
    })

  })

  describe('User', (done) => {


    afterEach(done => {
      UserModel.remove()
      done()
    })

    it('add user', (done) => {
      request(app)
        .post('/api/user/add')
        .send({
          username: 'www',
          password: '123'
        }).then(res => {
          should(res.body).have.property('ok', 1)
          done()
        })
    })


    describe('/login', (done) => {

      beforeEach(done => {
        request(app)
          .post('/api/user/add')
          .send({
            username: 'www',
            password: '123'
          }).then(res => {
            done()
          })
      })

      afterEach(done => {
        UserModel.remove()
        done()
      })


      it('login with error username', done => {
        request(app)
          .post('/api/user/login')
          .send({
            username: 'xxx',
            password: 'xxx'
          }).then(res => {
            should(res.body).have.property('code', 10002)
            should(res.body).have.property('msg', '用户不存在')
            done()
          })
      })
      it('login with error password', done => {
        request(app)
          .post('/api/user/login')
          .send({
            username: 'www',
            password: 'xxx'
          }).then(res => {
            should(res.body).have.property('code', 10003)
            should(res.body).have.property('msg', '密码错误')
            done()
          })
      })
      it('login ok', done => {
        request(app)
          .post('/api/user/login')
          .send({
            username: 'www',
            password: '123'
          }).then(res => {
            should(res.body).have.property('token')
            done()
          })
      })

    })

  })

});
