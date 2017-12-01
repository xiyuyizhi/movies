import React, { Component } from 'react';
import {
    SearchBar,
    Picker,
    List
} from "antd-mobile"

import {
    connect
} from "react-redux"

import {
    bindActionCreators
} from "redux"

import * as HpAction from "../../actions/hompage"

class HomeHeader extends Component {

    constructor(props) {
        super(props)
        this.props = props
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
        this.props.set_search(val)
    }
    onClear() {
        this.props.set_search('')
    }
    /**
     * 分类picker选择
     * @param {*} val 
     */
    onOk(val) {
        this.props.set_category(val)
    }
    onDismiss() {
        this.props.set_category([''])
    }

    render() {
        const { search, category, types } = this.props
        return <div className='header'>
            <div className="homeBar">
                <div className="search">
                    <SearchBar value={search} placeholder="搜索" onChange={(val) => {
                        this.search(val)
                    }} onClear={this.onClear} onSubmit={this.search}></SearchBar>
                </div>
                <div className="typeList">
                    <Picker
                        data={types}
                        cols="1"
                        onOk={this.onOk}
                        onDismiss={this.onDismiss}
                    >
                        <List.Item arrow="horizontal">{category || '分类'}</List.Item>
                    </Picker>
                </div>
            </div>
        </div>

    }
}

function mapStateToProps(state) {
    return {
        category: state.homepage.category,
        search: state.homepage.search,
        types: state.homepage.types
    }
}

function mapActionCreatorsToProps(dispatch) {
    return bindActionCreators(HpAction, dispatch);
}

export default connect(mapStateToProps, mapActionCreatorsToProps)(HomeHeader)