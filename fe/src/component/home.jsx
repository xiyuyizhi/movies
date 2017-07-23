
import React, { Component } from 'react';
import {
    Link
} from "react-router-dom"
import {
    ListView,
    RefreshControl,
    ActivityIndicator,
    SwipeAction
} from 'antd-mobile'
import Dotdotdot from 'react-dotdotdot'
import "whatwg-fetch"

export default class Home extends Component {

    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => { return r1 !== r2 }
        })
        this._data = []
        this.state = {
            isLoading: false,
            datasource: ds.cloneWithRows([]),
            noMore: false,
            reflushing: false
        }
        this.footer = this.footer.bind(this)
        this.onEndReached = this.onEndReached.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.timer = null
    }

    handleData(data) {
        return this._data.concat(data)
    }

    componentDidMount() {
        this.setState({
            isLoading: true
        })
        fetch('/api/movies/list').then(res => {
            return res.json()
        }).then(data => {
            if (data.data.length) {
                this._data = this._data.concat(data.data)
                this.latestTime = this._data[this._data.length - 1].updateTime
                this.setState({
                    datasource: this.state.datasource.cloneWithRows(this._data),
                })
            }
            this.setState({
                isLoading: false
            })
        })
    }

    row(rowData, sectionId, rowId) {
        return <div className='listview-item'>
            <div className="m-item">
                <SwipeAction autoClose right={
                    [
                        {
                            text: '收藏',
                            onPress: () => { console.log('收藏') },
                            className: 'collection'
                        }
                    ]
                }>
                    <Link to={{
                        pathname: `/detail/${rowData._id}`,
                        state: {
                            title: rowData.title
                        }
                    }}>
                        <img src={rowData.thumb} className="m-item-thumb"></img>
                        <div className="m-item-wrap">
                            <div className="m-item-instruction-props">
                                <span className='label weight'>{rowData.title}</span>
                                <span className='label'>{rowData.type}</span>
                                <span className='label'>{rowData.actors}</span>
                            </div>
                            <Dotdotdot clamp={4}>
                                <p className="m-item-instruct">
                                    {rowData.instruct}
                                </p>
                            </Dotdotdot>
                        </div>
                    </Link>
                </SwipeAction>
            </div>
            <p className="separator"></p>
        </div>
    }

    footer() {
        return <div className="footer" style={{ textAlign: 'center' }}>
            {this.state.noMore ? '没有了' : this.state.isLoading ? 'Loading...' : ''}
        </div>
    }
    onEndReached(e) {
        console.log('ppppp')
        if (this.state.isLoading || this.state.noMore) {
            return
        }
        this.setState({
            isLoading: true
        })
        clearTimeout(this.timer)
        this.timer = setTimeout(() => {
            fetch('/api/movies/list?latest=' + this.latestTime).then(res => {
                return res.json()
            }).then(data => {
                console.log(data)
                if (data.data.length) {
                    this._data = this._data.concat(data.data)
                    this.latestTime = this._data[this._data.length - 1].updateTime
                    this.setState({
                        datasource: this.state.datasource.cloneWithRows(this._data),
                        isLoading: false
                    })
                }else{
                    this.setState({
                        noMore:true,
                        isLoading: false
                    })
                }
            })
        }, 100)

    }

    onRefresh() {
        console.log('reflush')
        this.setState({
            reflushing: true
        })
        setTimeout(() => {
            this.setState({
                reflushing: false
            })
        }, 1000)
    }

    render() {

        return (
            <div>
                <ActivityIndicator
                    toast
                    animating={this.state.isLoading}>
                </ActivityIndicator>
                <ListView className="listview" dataSource={this.state.datasource}
                    renderRow={this.row}
                    renderFooter={this.footer}
                    onScroll={() => { console.log('scroll'); }}
                    style={{
                        height: (document.documentElement.clientHeight - 110)
                    }}
                    pageSize={10}
                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={20}
                    scrollEventThrottle={100}
                    refreshControl={<RefreshControl
                        refreshing={this.state.reflushing}
                        onRefresh={this.onRefresh}
                    />}
                >
                </ListView>
            </div>
        )
    }

}