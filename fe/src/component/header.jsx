import React, { Component } from 'react'
import {
    SearchBar,
    Picker,
    List,
    NavBar
} from "antd-mobile"
import { withRouter } from "react-router-dom"

class Header extends Component {

    constructor(props) {
        super(props)
        this.state = {
            types: [
                { label: '爱情', value: 0 },
                { label: '动作', value: 1 },
                { label: '喜剧', value: 2 },
                { label: '惊悚', value: 3 },
                { label: '剧情', value: 4 },
            ]
        }
        console.log(this.props)
    }

    search(val) {
        alert(val)
    }

    isHomepage(path) {
        return path === '/home'
    }
    isDetail(path) {
        return path.indexOf('/detail') !== -1
    }
    isReptile(path){

        return path.indexOf('/reptile') !== -1
    }
    homeEles() {
        return <div className="homeBar">
            <div className="search">
                <SearchBar placeholder="搜索" onSubmit={this.search}></SearchBar>
            </div>
            <div className="typeList">
                <Picker
                    data={this.state.types}
                    cols="1"
                    onPickerChange={this.onPickerChange}
                >
                    <List.Item arrow="horizontal" onClick={this.onClick}>分类</List.Item>
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