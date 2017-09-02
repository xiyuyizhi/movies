import React, { Component } from 'react';
import HomeHeader from "./homeHeader"
import HomeList from "./homeList"
import Util from "../../util/Util.js"

export default class HomePage extends Component {

    constructor(props) {
        super(props)
        this.props = props
        this.state = {
            category: '',
            search: ''
        }
        this.reflushType = this.reflushType.bind(this)
        this.cateCallback = this.cateCallback.bind(this)
        this.searchCallback = this.searchCallback.bind(this)
    }

    cateCallback(val) {
        this.setState({
            category: val[0]
        })
    }

    searchCallback(val) {
        this.setState({
            search: val
        })
    }

    reflushType() {
        this.getTypes()
    }

    componentDidMount() {
        this.getTypes()
    }

    getTypes() {
        Util.fetch('/api/types').then(res => {
            this.setState({
                types: res.data.map(item => {
                    return {
                        label: item.type_name,
                        value: item.type_name
                    }
                })
            })
        })
    }

    render() {
        return (
            <div>
                <HomeHeader types={this.state.types} cateCallback={this.cateCallback} searchCallback={this.searchCallback}></HomeHeader>
                <HomeList login={this.state.login} search={this.state.search} category={this.state.category} flushTypes={this.reflushType} {...this.props}></HomeList>
            </div>
        )



    }




}