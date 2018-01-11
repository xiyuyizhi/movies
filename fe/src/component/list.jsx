
import React, { Component } from 'react';
import {
    ListView,
    SwipeAction
} from 'antd-mobile'
import Icon from "./customIcon"
import Dotdotdot from 'react-dotdotdot'
import Util from "../util/Util.js"
import IconNodata from '../common/svg/noData.svg'
export default class List extends Component {

    constructor(props) {
        super(props)
        this.props = props
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => { return r1 !== r2 }
        })
        this._footer = this._footer.bind(this)
        this._row = this._row.bind(this)
        this.ds = ds
        this.state = {
            _data: []
        }
    }

    _defaultBtn(rowData, rowId, parent, login) {
        let rightBtns
        if (!parent) {
            rightBtns = [
                {
                    text: rowData.isCollect ? '移除' : '收藏',
                    onPress: () => {
                        if (!login) {
                            Util.Toast.info('请登录')
                            return
                        }
                        if (!rowData.isCollect) {
                            //收藏
                            Util.fetch(`/api/movies/${rowData._id}/collect`, {
                                method: 'POST'
                            }).then(res => {
                                if (!res.code) {
                                    rowData.isCollect = true
                                    this.setState({
                                        _data: this.state._data
                                    })
                                    Util.Toast.info('已收藏')
                                }

                            })
                        } else {
                            Util.fetch(`/api/user/colltions/${rowData._id}/delete`, {
                                method: 'POST'
                            }).then(res => {
                                if (!res.code) {
                                    delete rowData.isCollect
                                    this.setState({
                                        _data: this.state._data
                                    })
                                    Util.Toast.info('已移除')
                                }
                            })
                        }

                    },
                    className: 'btn'
                }
            ]
        }
        //收藏列表中按钮是移除
        if (parent) {
            rightBtns = this._collectDefaultBtn(rowData, rowId)
        }
        return rightBtns
    }

    _collectDefaultBtn(rowData, rowId) {
        return [{
            text: '移除',
            onPress: () => {
                Util.fetch(`/api/user/colltions/${rowData._id}/delete`, {
                    method: 'POST'
                }).then(res => {
                    if (!res.code) {
                        const d = this.state._data
                        d.splice(rowId, 1)
                        this.setState({
                            _data: d
                        })
                        Util.Toast.info('已移除')
                    }
                })
            },
            className: 'btn'
        }]
    }

    //登录后有权限才能看到的菜单
    _renderAllowedBtns(rightBtns, rowData, login, rowId) {
        return rightBtns.concat([{
            text: '修改',
            onPress: () => {
                this.props.history.push(`/detail/${rowData._id}`, {
                    title: rowData.title,
                    edit: true,
                    login
                })
            },
            className: 'btn'
        },
        {
            text: '删除',
            onPress: () => {
                this.props.deleteOne(rowData._id).then((status) => {
                    if (status) {
                        this.state._data.splice(rowId, 1)
                        this.setState({
                            _data: this.state._data
                        })
                        Util.Toast.info('已删除')
                    }
                })

            },
            className: 'btn delete'
        }])
    }

    /**
     * 左划菜单项
     * @param {*} rowData 
     * @param {*} rowId 
     */
    _sectionBtns(rowData, rowId) {
        const { login, parent } = this.props
        let rightBtns = this._defaultBtn(rowData, rowId, parent, login)
        if (login && this.userRole) {
            rightBtns = this._renderAllowedBtns(rightBtns, rowData, login, rowId)
        }
        return rightBtns
    }

    _row(rowData, sectionId, rowId) {
        const { login } = this.props
        const rightBtns = this._sectionBtns(rowData, rowId)
        return <div className='listview-item' key={rowId}>
            <div className="m-item">
                <SwipeAction autoClose right={rightBtns}>
                    <div onClick={(e) => {
                        this.props.history.push(`/detail/${rowData._id}`, {
                            title: rowData.title,
                            login
                        })
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
                    </div>
                </SwipeAction>
            </div>
            <p className="separator"></p>
        </div>
    }

    _footer() {
        return <div className="footer" style={{ textAlign: 'center' }}>
            {(this.props.noMore && this.props.dataLen > 10) ? '没有了' : this.props.loading ? 'Loading...' : ''}
        </div>
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            _data: nextProps.datasource
        })
    }

    componentWillMount() {
        // if (window) {
        //     this.userRole = window.sessionStorage.getItem('r') === '2017'
        // }
        this.setState({
            _data: this.props.datasource
        })
    }

    _noData() {
        const d = this.state._data
        return d.length
    }

    render() {
        const { onEndReached } = this.props
        const dss = this.ds.cloneWithRows(this.state._data)
        if (this._noData()) {
            return <ListView className="listview" dataSource={dss}
                renderRow={this._row}
                renderFooter={this._footer}
                // style={{
                //     height: "557px"
                // }}
                // style={{
                //     height: (document.documentElement.clientHeight - 110)
                // }}
                useZscroller
                initialListSize={10}
                pageSize={10}
                onEndReached={onEndReached}
                onEndReachedThreshold={30}
                scrollEventThrottle={100}>
            </ListView>
        } else {
            return <div className='noData'>
                <Icon type={IconNodata} size="lg" />
            </div>
        }

    }
}