
import React, { Component } from 'react';
import {
    Link
} from "react-router-dom"
import {
    ListView,
    RefreshControl,
    SwipeAction,
    Icon
} from 'antd-mobile'
import Dotdotdot from 'react-dotdotdot'
import Util from "../../util/Util.js"

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
        this.footer = this.footer.bind(this)
        this.onEndReached = this.onEndReached.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.row = this.row.bind(this)
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
        const { search, category } = this.props
        this.setState({
            isSearch: search || category
        })
        this.fetch(category, search)
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

    onRefresh() {
        this.setState({
            reflushing: true
        })
        setTimeout(() => {
            this.setState({
                reflushing: false
            })
        }, 1000)
    }

    deleteOne(id) {
        Util.fetch('/api/movies/' + id, {
            method: 'DELETE'
        }).then(res => {
            this.props.flushTypes()
        })
    }



    row(rowData, sectionId, rowId) {
        return <div className='listview-item' key={rowId}>
            <div className="m-item">
                <SwipeAction autoClose right={
                    [
                        {
                            text: '修改',
                            onPress: () => {
                                this.props.history.push(`/detail/${rowData._id}`, {
                                    title: rowData.title,
                                    edit: true
                                })
                            },
                            className: 'btn'
                        },
                        {
                            text: '删除',
                            onPress: () => { this.deleteOne(rowData._id) },
                            className: 'btn delete'
                        }
                    ]
                }>
                    <Link to={{
                        pathname: `/detail/${rowData._id}`,
                        state: {
                            title: rowData.title
                        }
                    }}>
                        <img src={rowData.thumb} alt={rowData.title} className="m-item-thumb"></img>
                        <div className="m-item-wrap">
                            <div className="m-item-instruction-props">
                                <span className='label weight'>{rowData.title}</span>
                                <span className='label'>{rowData.type.join('/')}</span>
                                <span className='label'>{rowData.actors.join('/')}</span>
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
            {(this.state.noMore && this._data.length > 10) ? '没有了' : this.state.loading ? 'Loading...' : ''}
        </div>
    }

    render() {
        return (
            <div>{
                this.state.noData ? <div className='noData'>
                    <Icon type={require('../../common/svg/no-data.svg')} size="lg" />
                </div>
                    : <ListView className="listview" dataSource={this.state.datasource}
                        renderRow={this.row}
                        renderFooter={this.footer}
                        onScroll={() => { console.log('scroll'); }}
                        style={{
                            height: (document.documentElement.clientHeight - 110)
                        }}
                        useZscroller
                        pageSize={10}
                        onEndReached={this.onEndReached}
                        onEndReachedThreshold={20}
                        scrollEventThrottle={100}
                    >
                        {/*refreshControl={<RefreshControl
                            refreshing={this.state.reflushing}
                            onRefresh={this.onRefresh}
                        />}*/}
                    </ListView>
            }
            </div>
        )
    }

}