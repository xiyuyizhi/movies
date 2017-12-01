

import React from 'react';
import Util from "../util/Util"
import {
    NavLink
} from "react-router-dom"
import Login from "./login"
export default class User extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            uInfo: null
        }
    }

    logout() {
        Util.fetch('/api/user/logout').then(res => {
            if (!res.code) {
                window.localStorage.removeItem('t')
                window.location.reload()
            }
        })
    }

    _getInfo() {
        Util.fetch('/api/user/info').then(res => {
            this.setState({
                uInfo: res.data
            })
        })
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.login !== this.props.login) {
            if (nextProps.login) {
                //查询用户信息
                this._getInfo()
            }
        }
    }

    componentDidMount() {
        if (this.props.login) {
            this._getInfo()
        }
    }

    render() {
        const { login } = this.props
        return <div className="user">
            {
                login ? <div className="uMain">
                    <div className="uInfo">
                        <span className="uname">{this.state.uInfo && this.state.uInfo.fullname}</span>
                    </div>
                    <ul className="uList">
                        <li>
                            <NavLink to="/collect">我的收藏</NavLink>
                        </li>
                        <li onClick={() => {
                            this.logout()
                        }}>退出</li>
                    </ul>
                </div> : <Login></Login>
            }
        </div>
    }

}