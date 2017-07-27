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
router.post('/add', function (req, res, next) {
  MoviesModel.addMovies(req.body, (err, docs) => {
    callback(err,'ok',res,next)
  })
});

router.get('/list', function (req, res, next) {
  MoviesModel.getList(req.query, (err, docs) => {
    callback(err, docs, res,next)
  })
})
router.get('/list/:movieId', (req, res, next) => {
  MoviesModel.getOneMovie(req.params.movieId, (err, docs) => {
    callback(err, docs, res,next)
  })
})
module.exports = router;
