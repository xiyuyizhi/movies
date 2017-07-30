
process.env.NODE_ENV = 'test'

const should = require('should')
const request = require('supertest')
const app = require('../app')
const MoviesModel = require('../models/movies_model')
const DB = require('../db')
describe('Movies', function () {
  describe('GET /movies', function () {

    this.timeout(2000)  //全局定义一下 其下的timeout最大时间

    it('response with data property', function (done) {
      request(app)
        .get('/api/movies')
        .end(function (err, res) {
          should(res.body).have.property('data', [])
          done()
        })
    })
    describe('POST /movies', function () {
      beforeEach(function (done) {
        const movieInfo = {
          "title": 'movie1',
          "thumb": "public/p1075586949.jpg",
          "actors": [
            "河正宇",
            "金允石",
            "郑满植"
          ],
          "type": [
            "剧情",
            "动作",
            "犯罪"
          ],
          "instruct": 'instruct...',
          "time": "2010-12-22(韩国)",
        }
        const movieInfo1 = {
          "title": 'movie1',
          "thumb": "public/p1075586949.jpg",
          "actors": [
            "河正宇",
            "金允石",
            "郑满植"
          ],
          "type": [
            "剧情",
            "动作",
            "犯罪"
          ],
          "instruct": 'instruct...',
          "time": "2010-12-22(韩国)",
        }

        DB.connect().then((db, err) => {
          db.collection('movies').insertMany([movieInfo,movieInfo1]).then(() => {
            done()
            db.close()
          })
        })
      })
      afterEach(function (done) {
        MoviesModel.remove(() => {
          done()
        })
      })
      it('add movie and get the added movie', function (done) {
        request(app)
          .get('/api/movies')
          .end((er, res) => {
            should(res.body.data).have.length(2)
            should(res.body.data).matchEach(item => {
              item.should.have.property('title', 'movie1')
            })
            done()
          })
      })

    })




  })

});
