
import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import data from "./data.js"
import MovieInfo from "./movieInfo"
import Util from "../util/Util.js"

export default class Detail extends Component {

    constructor(props) {
        super(props)
        this.state={
            movieInfo:null
        }
    }

    getData(id) {
        return data.filter(item => {
            return item.id == id
        })[0]
    }


    componentWillMount(){
        Util.fetch(`/api/movies/list/${this.props.match.params.id}`).then(res=>{
            this.setState({
                movieInfo:res.data[0]
            })
        })
    }

    render() {
        return (
            <div style={{"marginBottom": "120px"}}>
                <MovieInfo data={this.state.movieInfo}></MovieInfo>
                <Button type="primary" size="small" style={{"margin":"0 10px"}}>下载地址</Button>
            </div>
        )
    }

}

