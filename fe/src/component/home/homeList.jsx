
import React, { Component } from 'react';
import Util from "../../util/Util.js"
import List from "../list"
import {
    connect
} from "react-redux"
import {
    bindActionCreators
} from "redux"
import {
    loadCategory
} from "../../actions/index"

class Home extends Component {

    constructor(props) {
        super(props)
        this.props = props
        this._data = []
        this.state = {
            loading: true,
            noMore: false,
            noData: false,
            isSearch: false
        }
        this.onEndReached = this.onEndReached.bind(this)
        this.deleteOne = this.deleteOne.bind(this)
        this.timer = null
    }

    /**
     * 当选择了分类，或输入了搜索内容时，数据传递进来，查询
     * @param {*} nextProps 
     */
    componentWillReceiveProps(nextProps) {
        const { category, search } = nextProps
        if (this.props.category !== category || this.props.search !== search) {
            if (this.state.loading) {
                return
            }
            this.setState({
                loading: true,
                isSearch: true,
                noData: false
            })
            this._fetch(category, search)
        }
    }


    _handleQuery(category, search) {
        let cateStr
        let searchStr
        category !== '分类' && (cateStr = 'cate=' + category)
        search && (searchStr = 'content=' + search)
        if (cateStr && searchStr) {
            return cateStr + '&' + searchStr
        }
        if (cateStr) {
            return cateStr
        }
        if (searchStr) {
            return searchStr
        }

    }

    /**
     * 根据props中的值来判断发搜索请求还是直接获取列表
     */

    _fetch(category, search) {
        let promise
        if (category || search) {
            const str = this._handleQuery(category, search)
            promise = Util.fetch('/api/movies/search/by?' + str)
            //分类、搜索时不分页
        }
        if (!category && !search) {
            this.setState({
                isSearch: false
            })
            promise = Util.fetch('/api/movies')
        }
        promise.then(res => {
            if (!res.code) {
                this._data = []
                this._mergeCollectStatus(res.data)
            } else {
                this.setState({
                    loading: false,
                })
            }
        })
    }

    /**
     * 登录状态下，要去查询用户的收藏列表，将收藏状态加到电影列表中
     * @param {*} data 
     */
    _mergeCollectStatus(data) {

        if (!this.props.login) {
            this.dataRecieve(data)
            return
        }
        const ids = data.map(item => {
            return item._id
        })
        const obj = {}
        if (!ids.length) {
            this.dataRecieve(data)
            return
        }
        Util.fetch(`/api/movies/list/checkCollect/?ids=${ids}`).then(collects => {
            if (collects)
                collects.data && collects.data.forEach(item => {
                    if (item) {
                        obj[item.movieId] = item.isCollect
                    }
                })
            data.forEach(item => {
                if (obj[item._id]) {
                    item.isCollect = true
                }
            })
            this.dataRecieve(data)
        })

    }


    dataRecieve(data) {
        this._data = this._data.concat(data)
        if (this._data.length) {
            this.latestTime = this._data[this._data.length - 1].updateTime
            this.setState({
                loading: false,
                noMore: false
            })
        } else {
            this.setState({
                loading: false,
                noMore: false,
                noData: true
            })
        }

    }

    onEndReached(e) {
        if (this.state.loading || this.state.noMore || this.state.isSearch) {
            return
        }
        this.setState({
            loading: true
        })
        Util.fetch('/api/movies?latest=' + this.latestTime).then(res => {
            if (res.data.length) {
                this._mergeCollectStatus(res.data)
            } else {
                this.setState({
                    loading: false,
                    noMore: true,
                })
            }
        })

    }

    deleteOne(id) {
        return Util.fetch('/api/movies/' + id, {
            method: 'DELETE'
        }).then(res => {
            if (!res.code) {
                this.props.loadCategory()
                return true
            }
        })
    }


    componentDidMount() {
        this._fetch()
    }


    render() {
        const { noMore, loading, noData } = this.state
        return <List
            noData={noData}
            noMore={noMore}
            loading={loading}
            datasource={this._data}
            dataLen={this._data.length}
            onEndReached={this.onEndReached}
            deleteOne={this.deleteOne}
            {...this.props}></List>
    }

}

function mapStateToProps(state) {
    return {
        category: state.homepage.category,
        search: state.homepage.search,
        login: state.loginStatus.login
    }
}

export default connect(
    mapStateToProps,
    (dispatch) => bindActionCreators({ loadCategory }, dispatch)
)(Home)