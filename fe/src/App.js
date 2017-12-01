import React, { Component } from 'react'
import Router from "./route.jsx"
import {
    ActivityIndicator
} from "antd-mobile"
import Util from "./util/Util"
import initReactFastclick from 'react-fastclick';

initReactFastclick();

export default class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
        Util.open(() => {
            if(this.state.isLoading){
                return
            }
            this.setState({
                    isLoading: true
                })
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