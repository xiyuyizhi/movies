const express = require('express');
const router = express.Router();

const MoviesModel = require('./movies_model')

/* GET users listing. */
router.post('/add', function (req, res, next) {
  MoviesModel.addMovies(req.body, (docs, err) => {
    if (err) {
      next(err)
      return
    }
    res.json({
      code:0,
      data:'ok'
    });
  })
});

router.get('/list',function(req,res,next){
  console.log(req.query)
    MoviesModel.getList(req.query,(err,docs)=>{
      if(err){
        next(err)
        return
      }
      res.json({
        code:0,
        data:docs
      })
    })
})
module.exports = router;
