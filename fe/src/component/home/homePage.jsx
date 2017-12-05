import React, { Component } from 'react';
import HomeHeader from "./homeHeader"
import HomeList from "./homeList"
import Util from "../../util/Util.js"

export default class HomePage extends Component {

    constructor(props) {
        super(props)
        this.props = props
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
