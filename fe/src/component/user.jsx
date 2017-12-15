

import React from 'react';
import {
    NavLink
} from "react-router-dom"
import {
    connect
} from "react-redux"
import {
    bindActionCreators
} from "redux"
import Login from "./login"
import {
    fetchLoginout
} from "../actions/login"
class User extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        const { login, fetchLoginout, uInfo } = this.props
        return <div className="user">
            {
                login ? <div className="uMain">
                    <div className="uInfo">
                        <span className="uname">{uInfo && uInfo.fullname}</span>
                    </div>
                    <ul className="uList">
                        <li>
                            <NavLink to="/collect">我的收藏</NavLink>
                        </li>
                        <li onClick={fetchLoginout}>退出</li>
                    </ul>
                </div> : <Login></Login>
            }
        </div>
    }

}

export default connect(
    state => ({
        login: state.loginStatus.login,
        uInfo: state.uInfo.data
    }),
    dispatch => (
        bindActionCreators({
            fetchLoginout
        }, dispatch)
    )
)(User)