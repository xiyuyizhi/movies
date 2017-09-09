## 一步一步搭建react应用-爬取豆瓣电影的电影信息

*自己写表单录入电影信息比较费劲，所以选择爬取豆瓣电影的信息
主要爬取电影的封面、主演、年份、产地、简介等信息
前端有个输入框,输入电影名然后去爬取电影信息录入到MongoDB中*

![](/img/day2_1.png)![](/img/day2_2.png)

- ### 分析

打开豆瓣电影，搜索千与千寻
![](/img/day2_3.png)

通过分析，发现
1. 搜索后的列表是通过
https://movie.douban.com/subject_search?search_text=%E5%8D%83%E4%B8%8E%E5%8D%83%E5%AF%BB&cat=1002这个请求获取的

PS(比较有意思的是最开始我爬取的时候，想要的信息就在这个接口的响应中，从响应里面提取出来就行，但后来我发现响应里没有了，豆瓣电影里的搜索后的列表信息变成了js动态渲染出来的，所有的信息在响应的window_data中存放，所以又把代码修改了下，使用phantom来渲染爬取到的页面)

2. 要搜的电影一般都是列表的第一条，有时搜出来的第一条是明星的信息

3. 需要的电影有一个url，指向这条电影的详情，而我们想要的信息就在详情接口里

所有大体逻辑就是通过接口A获取一个电影列表，从列表中提取出我们需要的电影详情的url B,爬取B接口,获取详情，从详情中提取信息

- ### 工具

1. phantom 通过plantom渲染爬取的页面，页面中的js代码也会相应的执行
2. cheerio 服务端的一个实现jquery功能的库，可以方便的获取响应中的html中我们要的信息

- ### 爬取

项目接口 /api/reptile/:name

代码

```
var express = require('express');
var router = express.Router();
const CONFIG = require('../config/config')
const cheerio = require('cheerio')
const rq = require('request-promise')
var phantom = require("phantom");

<!--获取电影列表-->
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
    res.json({
      code: CONFIG.ERR_OK,
      data
    })
  })
}

<!--提取电影信息-->
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


router.get('/:name', function (req, res, next) {
  getMovieSubjectUrl(req.params.name).then(str => {
    const $ = cheerio.load(str)
    let detail = $('.detail')
    if (detail.length) {
      let a
      if (detail.eq(0).has('.rating_nums').length) {
        a = detail.eq(0).find('.title a')
      } else {
        a = detail.eq(1).find('.title a')
      }
      getMovieDetail(a.attr('href'), res, next)
    } else {
      next(10001)
    }
  });

})
module.exports = router;

```


- ### 前端

reptile.jsx

```

import React from 'react';
import {
    Button,
    Switch
} from "antd-mobile"
import cloneDeep from "lodash/cloneDeep"
import Util from "../util/Util.js"
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"

export default class Reptile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            m_name: '',
            m_info: null,
        }
        this.reptile = this.reptile.bind(this)
    }

    /**
     * 爬取数据
     */
    reptile() {
        if (!this.state.m_name) {
            return
        }
        Util.fetch('/api/reptile/' + this.state.m_name).then(data => {
            if (data.code) {
                Util.Toast.info(data.message)
                return
            }
            this.setState({
                m_info: data.data,
            })
        })
    }

    render() {
        return (
            <div className='reptile'>
                <div className='search-form'>
                    <input type="text" placeholder='电影名' value={this.state.m_name} onChange={(e) => {
                        this.setState({
                            m_name: e.target.value
                        })
                    }} />
                    <Button type="primary" size="small" onClick={this.reptile}>搜索</Button>
                </div>
            </div>
        )
    }

}

```



