
import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import data from "./data.js"
import MovieInfo from "./movieInfo"
console.log(MovieInfo)
export default class Detail extends Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    getData(id) {
        return data.filter(item => {
            return item.id == id
        })[0]
    }

    render() {
        const { id } = this.props.match.params
        const d = this.getData(id)
        return (
            <div style={{"margin-bottom": "120px"}}>
                <MovieInfo data={d}></MovieInfo>
                <Button type="primary" size="small" style={{"margin":"0 10px"}}>下载地址</Button>
            </div>
        )
    }

}

