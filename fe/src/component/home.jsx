
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
import data from "./data.js"

export default class Home extends Component {

    constructor(props) {
        super(props)
        const ds = new ListView.DataSource({
            rowHasChanged: (r1, r2) => { return r1 !== r2 }
        })
        this.data = data
        this.state = {
            isLoading: false,
            datasource: ds.cloneWithRows(this.data),
            noMore: false,
            reflushing: false
        }
        this.footer = this.footer.bind(this)
        this.onEndReached = this.onEndReached.bind(this)
        this.onRefresh = this.onRefresh.bind(this)
        this.index = 0
    }

    handleData() {
        this.data = this.data.concat(this.data)
        console.log(this.data)
        return this.data
    }

    row(rowData, sectionId, rowId) {
        return <div className='listview-item'>
            <div className="m-item">
                <SwipeAction autoClose right={
                    [
                        {
                            text:'收藏',
                            onPress:()=>{console.log('收藏')},
                            className:'collection'
                        }
                    ]
                }>
                    <Link to={{
                        pathname:`/detail/${rowData.id}`,
                        state:{
                            title:rowData.title
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
        if (this.state.isLoading) {
            return
        }
        if (this.index >= 3) {
            this.setState({
                noMore: true
            })
            return
        }
        this.setState({
            isLoading: true
        })
        this.index++
        setTimeout(() => {
            this.setState({
                datasource: this.state.datasource.cloneWithRows(this.handleData()),
                isLoading: false
            })
        }, 300)
    }

    onRefresh() {
        console.log('reflush')
        this.setState({
            reflushing: true
        })
        setTimeout(() => {
            console.log('why')
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

                    onEndReached={this.onEndReached}
                    onEndReachedThreshold={15}
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