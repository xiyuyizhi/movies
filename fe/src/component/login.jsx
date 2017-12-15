

import React, { Component } from 'react';
import Util from "../util/Util"
import {
    Button,
    Switch
} from "antd-mobile"
import {
    bindActionCreators
} from "redux"
import {
    connect
} from "react-redux"
import {
    recieveUsername,
    recievePassword,
    recieveRandom,
    loadServerRandom,
    changeLoginStatus,
    submitLoginRegiste
} from "../actions/login"

class Login extends Component {

    constructor(props) {
        super(props)
        this.props = props
        this.flushRandom = this.flushRandom.bind(this)
        this.sub = this.sub.bind(this)
    }

    sub() {
        if (!this.valid()) {
            return
        }
        this.props.submitLoginRegiste()
    }

    valid() {
        const propers = [{
            name: 'username',
            tips: '请输入用户名'
        }, {
            name: 'password',
            tips: '请输入密码'
        }, {
            name: 'randomCode',
            tips: '请输入验证码'
        }]
        for (const prop of propers) {
            if (!this.props[prop.name]) {
                Util.Toast.info(prop.tips)
                return
            }
        }
        if (this.props.randomCode != this.props.serverCode.random) {
            Util.Toast.info('验证码错误')
            return
        }
        return true
    }

    flushRandom() {
        this.props.loadServerRandom()
    }

    componentDidMount() {
        this.props.loadServerRandom()
    }

    render() {
        const { username, password, randomCode, serverCode, switchToRegiste } = this.props
        return <form>
            <div className="form-line">
                <input type="text" placeholder="用户名" value={username} onChange={this.props.recieveUsername} />
            </div>
            <div className="form-line">
                <input type="password" placeholder="密码" value={password} onChange={this.props.recievePassword} />
            </div>
            <div className="form-line randomcode">
                <input type="text" placeholder="验证码" value={randomCode} onChange={this.props.recieveRandom} />
                {
                    serverCode.base64 && <img alt="code" src={serverCode.base64} onClick={this.flushRandom} />
                }
            </div>
            <Button type="primary" size="small" onClick={this.sub}>{switchToRegiste ? "注册" : "登录"}</Button>
            <div className="regisiter">
                <label className="label">注册</label>
                <Switch checked={switchToRegiste} onChange={this.props.changeLoginStatus}></Switch>
            </div>
        </form>

    }

}
export default connect(
    state => {
        return state.login
    },
    dispatch => (bindActionCreators({
        recieveUsername,
        recievePassword,
        recieveRandom,
        loadServerRandom,
        changeLoginStatus,
        submitLoginRegiste
    }, dispatch))
)(Login)