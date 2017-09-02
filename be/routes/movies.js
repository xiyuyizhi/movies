const express = require('express');
const router = express.Router();
const token = require('../config/token')
const CONFIG = require('../config/config')
const MoviesModel = require('../models/movies_model')
const CollectModel = require('../models/collect_model')
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

router.get('/', function (req, res, next) {
  MoviesModel.getList(req.query, (err, docs) => {
    callback(err, docs, res, next)
  })
})

/* GET users listing. */
router.post('/', function (req, res, next) {
  MoviesModel.addMovies(req.body, (err, docs) => {
    callback(err, docs, res, next)
  })
});

router.put('/:movieId', (req, res, next) => {
  if (req.user.role != 2017) {
    next(10006)
    return
  }
  MoviesModel.modifyMovie(req.params.movieId, req.body, (err, docs) => {
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
  if (req.user.role != 2017) {
    next(10006)
    return
  }
  MoviesModel.delete(req.params.movieId, (err, docs) => {
    callback(err, docs, res, next)
  })
})

router.get('/search/by', (req, res, next) => {
  MoviesModel.search(req.query, (err, docs) => {
    callback(err, docs, res, next)
  })

})

router.post('/:movieId/collect', (req, res, next) => {
  const user = req.user
  CollectModel.addCollect({
    userId: user._id,
    movieId: req.params.movieId
  }).then(docs => {
    callback(null, docs, res, next)
  }).catch(err => {
    next(err)
  })
})

//通过movie ids查询列表
router.get('/list/byIds', (req, res, next) => {
  const ids = req.query.ids
  const idsArr = ids.split(',')
  if (ids && idsArr.length) {
    MoviesModel.getListByIds(idsArr).then(docs => {
      callback(null, docs, res, next)
    }).catch(err => {
      next(err)
    })
  } else {
    next(10004)
  }
})

router.get('/list/checkCollect', (req, res, next) => {
  const ids = req.query.ids
  const idsArr = ids.split(',')
  if (ids && idsArr.length) {
    CollectModel.checkCollect({
      userId: req.user._id,
      idsArr
    }).then(docs => {
      const collected = idsArr.map(id => {
        for (let collect of docs) {
          if (id == collect.movieId) {
            return {
              movieId: id,
              isCollect: true
            }
          }
        }
      }).filter(item => {
        return !!item
      })
      callback(null, collected, res, next)
    }).catch(err => {
      next(err)
    })
  } else {
    next(10004)
  }
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