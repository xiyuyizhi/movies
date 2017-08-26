

import React from 'react';
import Util from "../util/Util"
import {
    Icon
} from "antd-mobile"
import {
    NavLink
} from "react-router-dom"
import Login from "./login"
export default class User extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    logout() {
        Util.fetch('/api/user/logout').then(res => {
            if (!res.code) {
                window.localStorage.removeItem('t')
                window.location.reload()
            }
        })
    }


    render() {
        const { login } = this.props
        return <div className="user">
            {
                login ? <div className="uMain">
                    <div className="uInfo">
                        <span className="vatar">
                            <Icon type={require('../common/svg/usered.svg')} size="lg" />
                        </span>
                        <span className="uname">西域一支</span>
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