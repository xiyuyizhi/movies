
process.env.NODE_ENV = 'test'
const should = require('should')
const request = require('supertest')
const app = require('../app')
const MoviesModel = require('../models/movies_model')
const TypeModel = require('../models/type_model')
const AttchModel = require('../models/attachment_model')
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
    it('repeat type not saved', function (done) {
      request(app)
        .get('/api/types')
        .then(res => {
          should(res.body.data).have.length(3)
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

    it('save movies which have download url', done => {
      request(app)
        .get('/api/movies')
        .end(function (err, res) {
          should(res.body).have.property('data').length(1)
          const mId = res.body.data[0]._id
          request(app)
            .get('/api/movies/' + mId + '/attach').then(res => {
              should(res.body).have.property('data').length(1)
              should(res.body.data[0]).have.property('url','urls')
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


});
