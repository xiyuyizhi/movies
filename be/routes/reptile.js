var express = require('express');
var router = express.Router();
const cheerio = require('cheerio')
const rq = require('request-promise')



function getMovieSubjectUrl(name) {
  return rq('https://movie.douban.com/subject_search?search_text=' + encodeURIComponent(name))
}

function getMovieDetail(href, res, next) {

  rq(href).then(str => {
    const $ = cheerio.load(str)
    const data = fillData($)
    res.json(data)
  })
}


function fillData($) {
  const movie = {
    thumb: '',
    actors: '',
    type: '',
    time: '',
    instruct: ''
  }
  /**
   * 为方便提取数据,换行标签替换
   */
  let info_html = $('#info').html().replace(/<br>/g, '**')
  let txt = cheerio.load(info_html).text()
  txt = txt.replace(/\s+/g, '').split('**')
  movie.thumb = $('#mainpic img').attr('src')
  movie.instruct = $('#link-report').find('span[property]').text()
  movie.actors = txt[2].split(':')[1].split('/')
  movie.type = txt[3].split(':')[1].split('/')
  movie.time = txt[6].split(':')[1]
  return movie
}

/* GET home page. */
router.get('/:name', function (req, res, next) {

  getMovieSubjectUrl(req.params.name).then(str => {
    const $ = cheerio.load(str)
    let tables = $('table')
    if (tables.length !== 1) {
      const a = tables.eq(1).find('.pl2 a')
      getMovieDetail(a.attr('href'), res, next)
    } else {
      res.json({
        'msg':'没有匹配的'
      })
      res.end()
    }
  });

})


module.exports = router;
