
branch

- redux-redux-saga 加入 redux 和 redux-saga

- [mobx](https://github.com/xiyuyizhi/movies/tree/mobx)

- [master](https://github.com/xiyuyizhi/movies/tree/master)

> 之前做了个好电影搜集的小应用，前端采用react，后端采用express+mongodb，最近又将组件间的状态管理改成了redux，并加入了redux-saga来管理异步操作,记录一些总结

## [在线地址](http://xiyuyizhi.xyz:8080)

[源码](https://github.com/xiyuyizhi/movies)

## 主要功能

- 爬取豆瓣电影信息并录入MongoDB

- 电影列表展示，分类、搜索

- 电影详情展示及附件管理

- 注册、登录

- 权限控制，普通用户可以录入、收藏,administrator录入、修改、删除

- 用户中心，我的收藏列表


![](img/homepage.png)
![](img/category.png) 
![](img/action_menu1.png)
![](img/action_menu2.png)
![](./view.png)
![](img/search.png)
![](img/add.png)
![](img/login.png)
![](img/user.png)
![](img/collect.png)

# 一些总结

## 前端

前端使用了react,redux加redux-saga,对redux简单总结一下，同时记录一个前后接口调用有依赖关系的问题

- ### redux

一句话总结redux，我觉的就是将组件之间的纵向的props传递和父子组件间的state爱恨纠缠给打平了，将一种纵向关系转变成`多个组件和一个独立出来的状态对象直接交互`，这样之后，代码结构确实看上去更加清晰了。

redux的核心概念，action,reducer,和store

`action就是说明我要操作一个状态了，怎么操作是reducer的事，而所有状态存储在store中，store发出动作并交由指定的reducer来处理`

redux强制规范了我们对状态的操作，只能在action和reducer这些东西中,这样，原本错综复杂的业务逻辑处理就换了个地，限制在了action和reducer中，组件看上去就很干净了。其实，该复杂的东西在哪放都复杂，只不过现在更清晰一点

使用redux不好的地方就是太繁琐了，定义各种action,connect各种组件。。。。。

- ### redux-saga

redux-saga用来处理异步调用啥的，借助于generator,让异步代码看起来更简洁，常用的有`take,takeLatest,takeEvery,put,call,fork,select`，使用过程中遇到一个接口调用有前后依赖关系的问题,比较有意思

描述一下:

1. 有一个接口*/api/user/checkLogin*,用来判断是否登录，在最外层的<App></App>组件的componentDidMount中触发action来发起这个请求，并且接口返回状态是登录的话，还要发一个获取用户信息的

```
function* checkLogin() {
    const res = yield Util.fetch('/api/user/checkLogin')
    yield put(recieveCheckLogin(!res.code))
    if (!res.code) {
        //已登录
        yield put(fetchUinfo())
    }
}
export function* watchCheckLogin() {
    yield takeLatest(CHECK_LOAGIN, checkLogin)
}
```

2. 然后我有一个电影详情页组件，在这个组件的*componentDidMount*中会发起*`/api/movies/${id}`*接口获取电影信息，如果用户是登录状态的话，还会发起一个获取电影附件信息的接口*`/api/movies/${id}/attach`*，**整个步骤写在一个generator中**

```
function* getItemMovie(id) {
    return yield Util.fetch(`/api/movies/${id}`)
}

function* getMovieAttach(id) {
    return yield Util.fetch(`/api/movies/${id}/attach`)
}

function* getMovieInfo(action) {
    const { movieId } = action
    let { login } = yield select(state => state.loginStatus)
    const res = yield call(getItemMovie, movieId)
    yield put(recieveItemMovieInfo(res.data[0]))
    if (res.data[0].attachId && login) {
        const attach = yield call(getMovieAttach, movieId)
        yield put(recieveMovieAttach(attach.data[0]))
    }
}

export function* watchLoadItemMovie() {
    yield takeLatest(LOAD_ITEM_MOVIE, getMovieInfo)
}
```

3. 用户登录了，进到详情，流程正常，但如果在详情页刷新了页面，获取附件的接口没触发，原因是此时checkLogin接口还没返回结果，`state.loginStatus`状态还是false，上面就没走到if中

4. 一开始想着怎么控制一些generator中yield的先后顺序来解决(如果用户没有登录的话,再发一个CHECK_LOAGIN,结果返回了流程再继续)，但存在CHECK_LOAGIN调用两次，如果登录了，还会再多一次获取用户信息的接口调用的情况，肯定不行

```
function* getMovieInfo(action) {
    const { movieId } = action
    let { login } = yield select(state => state.loginStatus)
    const res = yield call(getItemMovie, movieId)
    yield put(recieveItemMovieInfo(res.data[0]))
    // if (!login) {
    //     //刷新页面的时候，如果此时checklogin接口还没返回数据或还没发出，应触发一个checklogin
    //     //checklogin返回后才能得到login状态
    //     yield put({
    //         type: CHECK_LOAGIN
    //     })
    //     const ret = yield take(RECIEVE_CHECK_LOAGIN)
    //     login = ret.loginStatus
    // }
    if (res.data[0].attachId && login) {
        const attach = yield call(getMovieAttach, movieId)
        yield put(recieveMovieAttach(attach.data[0]))
    }
}
```

5. 最终的办法,分解generator的职责，componentWillUpdate中合适的触发获取附件的动作

```
//将获取附件的动作从 getMovieInfo这个generator中分离出来
function* getMovieInfo(action) {
    const { movieId } = action
    const res = yield call(getItemMovie, movieId)
    yield put(recieveItemMovieInfo(res.data[0]))
}
function* watchLoadItemMovie() {
    yield takeLatest(LOAD_ITEM_MOVIE, getMovieInfo)
}
function* watchLoadAttach() {
    while (true) {
        const { movieId } = yield take(LOAD_MOVIE_ATTACH)
        const { attachId } = yield select(state => state.detail.movieInfo)
        const attach = yield call(getMovieAttach, movieId)
        yield put(recieveMovieAttach(attach.data[0]))
    }
}

//组件中
componentWillUpdate(nextProps) {
        if (nextProps.loginStatus && (nextProps.movieInfo!==this.props.movieInfo)) {
            //是登录状态，并且movieInfo已经返回时
            const { id } = this.props.match.params
            this.props.loadMovieAttach(id)
        }
}
```
6. 总结，合理使用组件的钩子函数，generator中不要处理太多操作，增加灵活性

## 后端
后端采用express和mongodb，也用到了redis,主要技术点有`使用pm2来管理node应用及部署代码`，[mongodb中开启身份认证](https://github.com/xiyuyizhi/movies/blob/master/dayByday/day3.md)，使用token+redis来做身份认证、在node中写了写单元测试，还是值得记录一下的

- ### 使用 jwt + redis 来做基于token的用户身份认证

基于token的认证流程

1. 客户端发起登录请求

2. 服务端验证用户名密码

3. 验证成功服务端生成一个token，响应给客户端

4. 客户端之后的每次请求header中都带上这个token

5. 服务端对需要认证的接口要验证token，验证成功接收请求



这里采用[jsonwebtoken](https://github.com/auth0/node-jsonwebtoken)来生成token，
```
jwt.sign(payload, secretOrPrivateKey, [options, callback])
```
使用[express-jwt](https://github.com/auth0/express-jwt)验证token（验证成功会把token信息放在request.user中）
```
express_jwt({
        secret: SECRET,
        getToken: (req)=> {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
    }
```

为什么使用redis

**采用jsonwebtoken生成token时可以指定token的有效期，并且jsonwebtoken的verify方法也提供了选项来更新token的有效期，
但这里使用了express_jwt中间件，而express_jwt不提供方法来刷新token**

思路：
1. 客户端请求登录成功，生成token

2. 将此token保存在redis中，设置redis的有效期（例如1h）

3. 新的请求过来，先express_jwt验证token，验证成功， 再验证token是否在redis中存在，存在说明有效

4. 有效期内客户端新的请求过来，提取token,更新此token在redis中的有效期

5. 客户端退出登录请求，删除redis中此token

[具体代码](https://github.com/xiyuyizhi/movies/blob/redux-redux-saga/be/config/token.js)

- ### 使用 mocha + supertest + should 来写单元测试

测试覆盖了所有接口，在开发中，因为没什么进度要求就慢慢写了，写完一个接口就去写一个测试，测试写也还算详细，等测试通过了再前端调接口，整个过程还是挺有意思的

*mocha 是一个node单元测试框架，类似于前端的jasmine,语法也相近*

*supertest 用来测试node接口的库*

*should nodejs断言库，可读性很高*

测试的一个例子，篇幅太长，就不[放在这](https://github.com/xiyuyizhi/movies/blob/redux-redux-saga/dayByday/day5.md)了

## 最后

喜欢可以[关注](https://github.com/xiyuyizhi/movies)下，万一有福利呢。。。。。




