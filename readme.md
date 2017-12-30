

## [在线地址](http://xiyuyizhi.xyz) 推荐浏览器开发者工具开启手机设备模式


## 笔记

- [一步一步搭建react应用-前后端初始化](/dayByday/day1.md)

- [爬取豆瓣电影的电影信息](/dayByday/day2.md)

- [mongodb开启身份认证](/dayByday/day3.md)

- [使用 jwt + redis 来做基于token的用户身份认证](/dayByday/day4.md)

- [node中使用 mocha + supertest + should 来写单元测试](/dayByday/day5.md)

- [部署](/dayByday/day6.md)

## 技术栈

- react + react-router + antd-mobile + fetch
- redux(master分支没有用)
- express + mongodb + redis


## 运行

clone代码到本地

前端:
```
    npm install
    npm start

```

后端:
```
    1. 需要安装mogondb 本项目mogondb端口 3307,并开启权限认证。可以在/BE/config/db.js中修改

    2. 需要安装redis  brew install redis

    3. npm install -g pm2

    3. node 版本最好最新版本，因为使用了 async await,推荐nvm来管理node版本

    4. npm install 

    5. npm run test 运行单元测试

    6. npm start


```







