import React from 'react'
import {
    NavLink,
    withRouter
} from "react-router-dom"
import { Flex } from "antd-mobile"
import Icon from "./customIcon"
import Prop from "./post/popup"
import Util from "../util/Util"
import {
    connect
} from "react-redux"
import userIcon from "../common/svg/user.svg"
import listIcon from "../common/svg/list.svg"
import editIcon from "../common/svg/edit.svg"

class Nav extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            show: false
        }
        this.handleProp = this.handleProp.bind(this)
    }

    handleProp(status) {
        this.setState({
            show: status
        })
    }

    render() {
        const { login, location } = this.props
        const { pathname } = location
        const homeActive = pathname === '/home'
        const userActive = (pathname === '/user' || pathname === '/collect')
        return <div>
            <Prop history={this.props.history} show={this.state.show} handleProp={this.handleProp}></Prop>
            <Flex id="footerNav">
                <Flex.Item>
                    <NavLink activeClassName="active home" to="/home" >
                        <Icon type={listIcon} size="xxs" />
                        <span className="nav-label">首页</span>
                    </NavLink>
                </Flex.Item>
                <Flex.Item>
                    <span className="circle" onClick={(e) => {
                        if (login) {
                            this.handleProp(true)
                        } else {
                            Util.Toast.info('请登录')
                        }
                    }}>
                        <Icon type={editIcon} size="xxs" className="edit" />
                    </span>
                </Flex.Item>
                <Flex.Item>
                    <NavLink activeClassName="active user" to="/user">
                        <Icon type={userIcon} size="xxs" />
                        <span className="nav-label" style={{ color: userActive ? "#108ee9" : "#333" }}>我的</span>
                    </NavLink>
                </Flex.Item>
            </Flex >
        </div>
    }

}

const connectNav = connect(
    state => ({
        login: state.loginStatus.login
    })
)(Nav)

export default withRouter(connectNav) 
