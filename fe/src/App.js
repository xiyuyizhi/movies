import React, { Component } from 'react'
import {
    ActivityIndicator
} from "antd-mobile"
import Util from "./util/Util"
// import initReactFastclick from 'react-fastclick';
import {
    connect
} from "react-redux"

import {
    loadCategory,
    checkLogin
} from "./actions/index"

import {
    bindActionCreators
} from "redux"

// initReactFastclick();

class App extends Component {

    constructor(props) {
        super(props)
        this.state = {
            isLoading: false
        }
        Util.open(() => {
            if (this.state.isLoading) {
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

    componentDidMount() {
        if (!window.__INITIAL_STATE__) {
            this.props.checkLogin()
            this.props.loadCategory()
        }
    }

    render() {
        return <div>
            <ActivityIndicator
                toast
                animating={this.state.isLoading}>
            </ActivityIndicator>
            {this.props.children}
        </div>

    }

}

export default connect(null,
    (dispatch) => bindActionCreators({
        loadCategory,
        checkLogin
    }, dispatch)
)(App)