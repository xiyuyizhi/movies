const express = require('express');
const router = express.Router();
const express_jwt = require('express-jwt');
const token = require('../token')

const MoviesModel = require('../models/movies_model')

// router.use(token.validToken.unless({
//   method:['GET','PUT','POST']
// }), token.noAuthorization)

function callback(err, docs, res, next) {
  if (err) {
    next(err)
    return
  }
  res.json({
    code: 0,
    data: docs
  })
}

/* GET users listing. */
router.post('/', function (req, res, next) {
  MoviesModel.addMovies(req.body, (err, docs) => {
    callback(err, docs, res, next)
  })
});

router.put('/:movieId', (req, res, next) => {
  MoviesModel.modifyMovie(req.params.movieId, req.body, (err, docs) => {
    callback(err, docs, res, next)
  })
})

router.get('/', function (req, res, next) {
  console.log(req.user)
  MoviesModel.getList(req.query, (err, docs) => {
    callback(err, docs, res, next)
  })
})

router.get('/:movieId', (req, res, next) => {
  MoviesModel.getOneMovie(req.params.movieId, (err, docs) => {
    callback(err, docs, res, next)
  })
})

router.get('/:movieId/attach', (req, res, next) => {
  MoviesModel.getMovieAttach(req.params.movieId, (err, docs) => {
    callback(err, docs, res, next)
  })
})

router.delete('/:movieId', (req, res, next) => {
  MoviesModel.delete(req.params.movieId, (err, docs) => {
    callback(err, docs, res, next)
  })
})

router.get('/search/by', (req, res, next) => {
  MoviesModel.search(req.query, (err, docs) => {
    callback(err, docs, res, next)
  })

})

module.exports = router;

/**
 * 
 * /api/movies get   get list
 * /api/movies post  add new
 * /api/movies/:movieId  get   get one
 * /api/movies/:movieId  put   modify one
 * /api/movies/:movieId  delete   delete one
 *
 */