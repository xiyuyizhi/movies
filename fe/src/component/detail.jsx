
import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import data from "./data.js"
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"
import Util from "../util/Util.js"

export default class Detail extends Component {

    constructor(props) {
        super(props)
        console.log(props)
        this.state = {
            movieInfo: null
        }
    }

    getData(id) {
        return data.filter(item => {
            return item.id === id
        })[0]
    }


    componentWillMount() {
        Util.fetch(`/api/movies/${this.props.match.params.id}`).then(res => {
            this.setState({
                movieInfo: res.data[0]
            })
        })
    }

    render() {
        const { state } = this.props.location
        return (
            this.state.movieInfo && <div style={{ "marginBottom": "120px" }}>
                <div className="movie-info">
                    <MovieInfo isEdit={state.edit} data={this.state.movieInfo}></MovieInfo>
                    <DownForm isEdit={state.edit} callback={this.downCallback}></DownForm>
                    {
                        state.edit ? <Button type="primary" size="small" style={{ "margin": "0 10px" }}>修改</Button> :
                            <Button type="primary" size="small" style={{ "margin": "0 10px" }}>下载地址</Button>
                    }
                </div>
            </div>
        )
    }

}

