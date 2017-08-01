import React, { Component } from 'react'
import Router from "./component/route.jsx"
import {
    ActivityIndicator
} from "antd-mobile"
import Util from "./util/Util"

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
        this.timer = null
        Util.open(() => {
            clearTimeout(this.timer)
            this.timer = setTimeout(() => {
                this.setState({
                    isLoading: true
                })
            },0)

        })
        Util.close(() => {
            this.setState({
                isLoading: false
            })
        })

    }

    render() {

        return <div>
            <ActivityIndicator
                toast
                animating={this.state.isLoading}>
            </ActivityIndicator>
            <Router></Router>
        </div>

    }

}