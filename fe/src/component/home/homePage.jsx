import React, { Component } from 'react';
import HomeHeader from "./homeHeader"
import HomeList from "./homeList"

export default class HomePage extends Component {

    constructor(props) {
        super(props)
        this.props = props
        console.log(props.location);
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
