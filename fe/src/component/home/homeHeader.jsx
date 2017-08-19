import React, { Component } from 'react';
import {
    SearchBar,
    Picker,
    List
} from "antd-mobile"

export default class HomeHeader extends Component {

    constructor(props) {
        super(props)
        this.props=props
        this.state = {
            category: '分类',
            search: ''
        }
        this.onOk = this.onOk.bind(this)
        this.onDismiss = this.onDismiss.bind(this)
        this.search = this.search.bind(this)
        this.onClear = this.onClear.bind(this)
    }

    /**
     * 搜索
     * @param {*} val 
     */
    search(val) {
        this.setState({
            search: val
        })
        this.props.searchCallback(val)
    }
    onClear() {
        this.props.searchCallback('')
    }
    /**
     * 分类picker选择
     * @param {*} val 
     */
    onOk(val) {
        this.setState({
            category: val
        })
        this.props.cateCallback(val)
    }
    onDismiss() {
        this.setState({
            category: '分类'
        })
        this.props.cateCallback([''])
    }

    

    render() {

        return <div className='header'>
            <div className="homeBar">
                <div className="search">
                    <SearchBar value={this.state.search} placeholder="搜索" onChange={(val) => {
                        this.setState({
                            search: val
                        })
                    }} onClear={this.onClear} onSubmit={this.search}></SearchBar>
                </div>
                <div className="typeList">
                    <Picker
                        data={this.props.types}
                        cols="1"
                        onOk={this.onOk}
                        onDismiss={this.onDismiss}
                    >
                        <List.Item arrow="horizontal">{this.state.category}</List.Item>
                    </Picker>
                </div>
            </div>
        </div>

    }




}