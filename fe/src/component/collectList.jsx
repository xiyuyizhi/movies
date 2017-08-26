
import React, { Component } from 'react';
import {
    ListView
} from 'antd-mobile'
import List from "./list"
import Util from "../util/Util"
export default class Collect extends Component {

    constructor(props) {
        super(props)
        this.props = props
        this._data = []
        this.state = {
            loading: true,
            noMore: false
        }
        this.onEndReached = this.onEndReached.bind(this)

    }

    fetch(category, search) {

        Util.fetch('/api/user/collections').then(res => {
            if (!res.code && res.data.length) {
                const ids = res.data.map(item => {
                    return item.movieId
                })
                return Util.fetch(`/api/movies/list/byIds?ids=${ids.join(',')}`)
            }
        }).then(res => {
            if (res && !res.code && res.data.length) {
                this.dataRecieve(res.data)
            } else {
                this.setState({
                    loading: false,
                })
            }
        })
    }

    dataRecieve(data) {
        this._data = this._data.concat(data)
        this.latestTime = this._data[this._data.length - 1].updateTime
        this.setState({
            loading: false,
            noMore: false
        })
    }

    onEndReached(e) {
        if (this.state.loading || this.state.noMore) {
            return
        }
        this.setState({
            loading: true
        })
        Util.fetch('/api/user/collections?latest=' + this.latestTime).then(res => {
            if (!res.code && res.data.length) {
                const ids = res.data.map(item => {
                    return item.movieId
                })
                return Util.fetch(`/api/movies/list/byIds?ids=${ids.join(',')}`)
            }
        }).then(res => {
            if (res && res.data.length) {
                this.dataRecieve(res.data)
            } else {
                this.setState({
                    loading: false,
                    noMore: true,
                })
            }
        })
    }

    componentDidMount() {
        this.fetch()
    }

    render() {
        const { noMore, loading } = this.state
        return <List 
            noMore={noMore}
            loading={loading}
            datasource={this._data}
            dataLen={this._data.length}
            onEndReached={this.onEndReached} parent="collect"></List>

    }

}
