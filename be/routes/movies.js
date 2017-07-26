const express = require('express');
const router = express.Router();

const MoviesModel = require('./movies_model')

function callback(err, docs, res) {
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
  MoviesModel.addMovies(req.body, (docs, err) => {
    callback(err,'ok',res)
  })
});

router.get('/list', function (req, res, next) {
  console.log(req.query)
  MoviesModel.getList(req.query, (err, docs) => {
    callback(err, docs, res)
  })
})
router.get('/list/:movieId', (req, res, next) => {
  MoviesModel.getOneMovie(req.params.movieId, (err, docs) => {
    callback(err, docs, res)
  })
})
module.exports = router;
