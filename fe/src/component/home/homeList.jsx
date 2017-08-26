
import React, { Component } from 'react';

import {
    ListView,
    Icon
} from 'antd-mobile'
import Util from "../../util/Util.js"
import List from "../list"

export default class Home extends Component {

    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => { return r1 !== r2 }
        })
        this._data = []
        this.props = props
        this.state = {
            loading: true,
            datasource: ds.cloneWithRows([]),
            noData: false,
            noMore: false,
            reflushing: false,
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
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            if (this.state.loading) {
                return
            }
            this.setState({
                loading: true,
                isSearch: true
            })
            this.fetch(category, search)
        }, 0)
    }


    handleQuery(category, search) {
        let cateStr
        let searchStr
        category && (cateStr = 'cate=' + category)
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

    fetch(category, search) {
        let promise
        if (category || search) {
            const str = this.handleQuery(category, search)
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
            if (!res.code && res.data.length) {
                this._data = []
                this.dataRecieve(res.data)
            } else {
                this.setState({
                    loading: false,
                    noData: true
                })
            }
        })
    }

    componentDidMount() {
        this.fetch()
    }

    dataRecieve(data) {
        this._data = this._data.concat(data)
        this.latestTime = this._data[this._data.length - 1].updateTime
        this.setState({
            datasource: this.state.datasource.cloneWithRows(this._data),
            loading: false,
            noData: false,
            noMore: false
        })
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
                this.dataRecieve(res.data)
            } else {
                this.setState({
                    loading: false,
                    noMore: true,
                })
            }
        })

    }

    deleteOne(id) {
        Util.fetch('/api/movies/' + id, {
            method: 'DELETE'
        }).then(res => {
            this.props.flushTypes()
        })
    }




    render() {
        const { noData, noMore, loading, datasource } = this.state
        return (
            <div>{
                noData ? <div className='noData'>
                    <Icon type={require('../../common/svg/no-data.svg')} size="lg" />
                </div> : <List noMore={noMore} 
                    loading={loading}
                    datasource={datasource}
                    dataLen={this._data.length}
                    onEndReached={this.onEndReached}
                    deleteOne={this.deleteOne}
                    {...this.props}></List>
            }
            </div>
        )
    }

    /**
     * noMore
     * loading
     * dataLen
     * datasource
     * onEndReached
     * deleteOne
     * 
     * login
     * history
     */

}