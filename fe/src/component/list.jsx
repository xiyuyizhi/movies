
import React, { Component } from 'react';
import {
    Link
} from "react-router-dom"
import {
    ListView,
    SwipeAction,
    Icon
} from 'antd-mobile'
import Dotdotdot from 'react-dotdotdot'
import Util from "../util/Util.js"

export default class List extends Component {

    constructor(props) {
        super(props)
        this.props=props
        this._footer = this._footer.bind(this)
        this._row = this._row.bind(this)
    }



    _row(rowData, sectionId, rowId) {
        const { login } = this.props
        let rightBtns = [
            {
                text: '收藏',
                onPress: () => {
                    if (!login) {
                        Util.Toast.info('请登录')
                    }
                },
                className: 'btn'
            }
        ]
        if (login) {
            rightBtns = rightBtns.concat([{
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
                onPress: () => { this.props.deleteOne(rowData._id) },
                className: 'btn delete'
            }])
        }
        return <div className='listview-item' key={rowId}>
            <div className="m-item">
                <SwipeAction autoClose onOpen={
                    () => {
                        console.log('opende......')
                    }
                } right={rightBtns}>
                    <Link to={{
                        pathname: `/detail/${rowData._id}`,
                        state: {
                            title: rowData.title,
                            login
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

    _footer() {
        return <div className="footer" style={{ textAlign: 'center' }}>
            {(this.props.noMore && this.props.dataLen > 10) ? '没有了' : this.props.loading ? 'Loading...' : ''}
        </div>
    }

    render() {
        return (
            <ListView className="listview" dataSource={this.props.datasource}
                renderRow={this._row}
                renderFooter={this._footer}
                onScroll={() => { }}
                style={{
                    height: (document.documentElement.clientHeight - 110)
                }}
                useZscroller
                pageSize={10}
                onEndReached={this.props.onEndReached}
                onEndReachedThreshold={20}
                scrollEventThrottle={100}>
            </ListView>
        )
    }
}