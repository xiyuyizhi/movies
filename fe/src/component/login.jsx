

import React, { Component } from 'react';
import Util from "../util/Util"
import {
    Button
} from "antd-mobile"

export default class Login extends Component {

    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            img: '',
            username: '',
            password: '',
            random: ''
        }
        this.changeUsername = this.changeUsername.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.changeRandom = this.changeRandom.bind(this)
        this.flushRandom = this.flushRandom.bind(this)
        this.sub = this.sub.bind(this)
    }

    getRndom() {
        Util.fetch('/api/user/randomCode').then(res => {
            this.setState({
                img: res
            })
        })
    }

    geneUrl(base) {
        return "data:image/png;base64, " + base
    }

    changeUsername(e) {
        this.setState({
            username: e.target.value
        })
    }

    changePassword(e) {
        this.setState({
            password: e.target.value
        })
    }
    changeRandom(e) {
        this.setState({
            random: e.target.value
        })
    }

    sub() {
        if (!this.valid()) {
            return
        }
        Util.fetch('/api/user/login', {
            method: 'POST',
            body: JSON.stringify({
                username: this.state.username,
                password: this.state.password
            })
        }).then(res => {
            //store token
            window.localStorage.setItem('t', res.token)
            window.location.reload()
        })
    }

    valid() {
        const propers = [{
            name: 'username',
            tips: '请输入用户名'
        }, {
            name: 'password',
            tips: '请输入密码'
        }, {
            name: 'random',
            tips: '请输入验证码'
        }]
        for (const prop of propers) {
            if (!this.state[prop.name]) {
                Util.Toast.info(prop.tips)
                return
            }
        }
        if (this.state.random != this.state.img.random) {
            Util.Toast.info('验证码错误')
            return
        }
        return true
    }

    flushRandom() {
        this.getRndom()
    }

    componentDidMount() {
        this.getRndom()
    }

    render() {

        return <form>
            <div className="form-line">
                <input type="text" placeholder="用户名" onChange={this.changeUsername} />
            </div>
            <div className="form-line">
                <input type="password" placeholder="密码" onChange={this.changePassword} />
            </div>
            <div className="form-line randomcode">
                <input type="text" placeholder="验证码" onChange={this.changeRandom} />
                {
                    this.state.img.base64 && <img src={this.geneUrl(this.state.img.base64)} onClick={this.flushRandom} />
                }
            </div>
            <Button type="primary" size="small" onClick={this.sub}>登录</Button>
        </form>

    }

}