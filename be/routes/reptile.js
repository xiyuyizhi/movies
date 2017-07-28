var express = require('express');
var router = express.Router();
const cheerio = require('cheerio')
const rq = require('request-promise')
var phantom = require("phantom");

function getMovieSubjectUrl(name) {
  var _ph, _page, _outObj;
  return phantom.create().then(ph => {
    _ph = ph;
    return _ph.createPage();
  }).then(page => {
    _page = page;
    return _page.open('https://movie.douban.com/subject_search?search_text=' + encodeURIComponent(name));
  }).then(status => {
    return _page.property('content')
  }).then(content => {
    _page.close();
    _ph.exit();
    return content
  }).catch(e => console.log(e));
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
    let detail = $('.detail')
    if (detail.length !== 1) {
      const a = detail.eq(1).find('.title a')
      getMovieDetail(a.attr('href'), res, next)
    } else {
      next(10001)
    }
  });

})


module.exports = router;
