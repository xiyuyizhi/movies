import React, { Component } from 'react';
import HomeHeader from "./homeHeader"
import HomeList from "./homeList"
import Util from "../../util/Util.js"

import {
    connect
} from "react-redux"

import * as HpAction from "../../actions/hompage"

import {
    bindActionCreators
} from "redux"

class HomePage extends Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    componentDidMount() {
        this.props.load_category()
    }

    render() {
        return (
            <div>
                <HomeHeader></HomeHeader>
                <HomeList  {...this.props}></HomeList>
            </div>
        )
    }
}


export default connect(null,
    (dispatch) => bindActionCreators(HpAction, dispatch)
)(HomePage)