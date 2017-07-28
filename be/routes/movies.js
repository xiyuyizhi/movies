const express = require('express');
const router = express.Router();

const MoviesModel = require('../models/movies_model')

function callback(err, docs, res,next) {
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
    callback(err,'ok',res,next)
  })
});

router.get('/', function (req, res, next) {
  MoviesModel.getList(req.query, (err, docs) => {
    callback(err, docs, res,next)
  })
})
router.get('/:movieId', (req, res, next) => {
  MoviesModel.getOneMovie(req.params.movieId, (err, docs) => {
    callback(err, docs, res,next)
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