## 一步一步搭建react应用-项目初始化

## 前端初始化

### 目录结构

```
    +----/build
    +
    +----/config
    +
    +----+/public
fe- +                            +--+/less
    +----/scripts   +----/common-+--+/svg
    +               |            +--index.less         
    +----+/src+-----+    
                    |
                    |               +--+nav.jsx
                    +----/component-+--+route.jsx
                    |               +--+header.jsx
                    |               +--+user.jsx
                    |               +。。。。。。
                    |
                    +----+/util---Utils.js
                    |
                    +-----+app.js
                    |
                    +-----+index.js
```


- 脚手架

create-react-app fe

npm run eject  配置文件导出到项目目录下

配置后端代理地址

*package.json中加入 "proxy": "http://XXXXXXX"*

- 引入antd-mobile

具体webpack中的修改和如何自定义主题来覆盖默认样式参见：

[antd 在在 create-react-app 中使用](https://github.com/ant-design/antd-mobile-samples/tree/1.x/create-react-app)


- 路由规划

src/component/route.jsx

项目主要有 头部、底部导航、首页、详情页、我的几个部分

```
+-----------------------+
  | +------------------+  |
  | |     Header       |  |
  | +------------------+  |
  |                       |
  | +-----------------+   |
  | |                 |   |
  | |                 |   |
  | |     Content     |   |
  | |                 |   |
  | |                 |   |
  | |                 |   |
  | +-----------------+   |
  | +------------------+  |
  | |      Nav         |  |
  | +------------------+  |
  +-----------------------+
```
  

主要代码

```
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from "react-router-dom"
import Header from "./header"
import Nav from "./nav"
import Home from "./home/homePage"
import Detail from "./detail"
import User from "./user"
import Reptile from "./reptile"
import Collect from "./collectList"
import Util from "../util/Util"

export default class Rout extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: false
        }
    }

    componentDidMount() {
        <!--传递到各个组件的当前是否登录状态-->
        Util.fetch('/api/user/checkLogin').then(res => {
            this.setState({
                login: !res.code
            })
        })
    }
    render() {
        return (
            <Router>
                <div>
                   <!--头部-->
                    <Header></Header>
                    <div className="main">
                        <Route exact path="/" render={() =>
                            <Redirect to="/home"></Redirect>
                        }></Route>
                        <Route path="/home" render={(props) => {
                            return <Home login={this.state.login} {...props}></Home>
                        }}></Route>
                        <Route path="/detail/:id" component={Detail}></Route>
                        <Route path="/user" render={(props) => {
                            return <User login={this.state.login} {...props}></User>
                        }}></Route>
                        <Route path="/reptile" render={(props=>{
                            return <Reptile login={this.state.login} {...props}></Reptile>
                        })}></Route>
                        <Route path="/collect" component={Collect}></Route>
                    </div>
                    <!--底部菜单-->
                    <Nav login={this.state.login}></Nav>
                </div>
            </Router>
        )
    }

}
```

- 如何实现全局的ajax请求时loading状态

每次有ajax请求时我们要显示正在请求的loading状态，这里我们封装一下fetch

主要代码：src/util/Util.js

```
import 'whatwg-fetch'
const Loading = {
    pendingRequest: 0
}

const Util = {
    open(fn) {
        Loading.open = fn
    },
    close(fn) {
        Loading.close = fn
    },
    fetch(url, options) {
        Loading.open()
        Loading.pendingRequest++
        options = fillTokenToHeader(options)
        return fetch(url, options).then(res => {
            Loading.pendingRequest--
            if (Loading.pendingRequest <= 0) {
                Loading.close()
            }
            return res.json()
        }).then(data => {
            if (url !== '/api/user/checkLogin') {
                if (data.code) {
                    Toast.info(data.name || data.message, 1)
                }
            }
            return data
        })
    }
}
export default Util

```

在最外层的App组件中,定义一个isLoading状态，控制loading活动指示器的显示隐藏。
并将控制isLoading的两个方法传递到Util中，在具体的请求发生时调用
具体代码如下: src/app.js

```
import React, { Component } from 'react'
import Router from "./component/route.jsx"
import {
    ActivityIndicator
} from "antd-mobile"
import Util from "./util/Util"
import initReactFastclick from 'react-fastclick';

initReactFastclick();

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
        Util.open(() => {
            if(this.state.isLoading){
                return
            }
            this.setState({
                    isLoading: true
                })
        })
        Util.close(() => {
            this.setState({
                isLoading: false
            })
        })
    }
    render() {
        return <div>
            <ActivityIndicator
                toast
                animating={this.state.isLoading}>
            </ActivityIndicator>
            <Router></Router>
        </div>

    }

}

```




### 后端初始化

后端基于express框架，使用MongoDB数据库，用户身份认证基于token，并且使用mocha+supertest来对接口进行单元测试

- express-generator初始化项目

```
    npm install express-generator -g
    express -e be

    node ./bin/www 

    浏览器访问localhost:3000 能看到东西就可以了

```

- 引入pm2

pm2 是一个强大的node进程管理工具


```
    npm install -g pm2
```

- 在项目根目录下新建文件ecosystem.config.js

```
module.exports = {
  apps: [ //数组，可以指定多个服务
    {
      name: 'movies-be',
      script: 'bin/www',
      watch: true,
      env: {
        PORT: 9000, //node服务端口
        NODE_ENV: 'development'
      },
      env_production: {
        PORT:9000,
        NODE_ENV: 'production'
      }
    }
  ]
};

```

package.json中
```
"scripts": {
    "start": "pm2 start ecosystem.config.js"
  }
```

启动

npm start 就可以启动我们的node服务

- 开发中常用的pm2 命令

pm2 list 可以查看node服务列表

pm2 logs  查看日志,console打印信息等

pm2 kill 关闭服务

- 之后文章中会介绍如何通过pm2来部署node应用到服务器









