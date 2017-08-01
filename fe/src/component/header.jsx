import React, { Component } from 'react'
import {
    SearchBar,
    Picker,
    List,
    NavBar
} from "antd-mobile"
import { withRouter } from "react-router-dom"
import Util from "../util/Util.js"

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            types: [],
            category: '分类',
            search: ''
        }
        this.onOk = this.onOk.bind(this)
        this.onDismiss = this.onDismiss.bind(this)
        this.search = this.search.bind(this)
        this.onClear = this.onClear.bind(this)
    }

    componentWillReceiveProps(nextProps) {

    }

    componentDidMount() {
        Util.fetch('/api/types').then(res => {
            this.setState({
                types: res.data.map(item => {
                    return {
                        label: item.type_name,
                        value: item.type_name
                    }
                })
            })
        })
    }

    isHomepage(path) {
        return path === '/home'
    }
    isDetail(path) {
        return path.indexOf('/detail') !== -1
    }
    isReptile(path) {

        return path.indexOf('/reptile') !== -1
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


    homeEles() {
        return <div className="homeBar">
            <div className="search">
                <SearchBar value={this.state.search} placeholder="搜索" onChange={(val) => {
                    this.setState({
                        search: val
                    })
                }} onClear={this.onClear} onSubmit={this.search}></SearchBar>
            </div>
            <div className="typeList">
                <Picker
                    data={this.state.types}
                    cols="1"
                    onOk={this.onOk}
                    onDismiss={this.onDismiss}
                >
                    <List.Item arrow="horizontal">{this.state.category}</List.Item>
                </Picker>
            </div>
        </div>
    }
    render() {
        const { history, location } = this.props
        const { pathname } = location
        return <div className='header'>
            {
                this.isHomepage(pathname) && this.homeEles()
            }
            {
                this.isDetail(pathname) && <NavBar className="normalBar" leftContent="返回"
                    mode="light"
                    onLeftClick={() => history.go(-1)}
                >{location.state.title}</NavBar>
            }
            {
                this.isReptile(pathname) && <NavBar className="normalBar" leftContent="返回"
                    mode="light"
                    onLeftClick={() => history.push('/home')}
                >找找看</NavBar>
            }
            {
                pathname === '/user' && <NavBar className="normalBar" iconName="false"
                    mode="light"
                >我的</NavBar>
            }
        </div>

    }

}

export default withRouter(Header)