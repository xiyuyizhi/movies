
import React, { Component } from 'react';
import {
    Button,
    Toast
} from 'antd-mobile';
import data from "./data.js"
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"
import Util from "../util/Util.js"
import cloneDeep from "lodash/cloneDeep"

export default class Detail extends Component {

    constructor(props) {
        super(props)
        this.state = {
            movieInfo: null,
            download: null
        }
        this.editCallback = this.editCallback.bind(this)
        this.downCallback = this.downCallback.bind(this)
        this.modifyMovie = this.modifyMovie.bind(this)
    }

    getData(id) {
        return data.filter(item => {
            return item.id === id
        })[0]
    }

    //movieInfo组件中form表单的回调
    editCallback(data) {
        this.setState({
            movieInfo: data,
        })
    }

    downCallback(data) {
        console.log(JSON.stringify(data))
        this.download = data
    }

    modifyMovie() {
        const info = cloneDeep(this.state.movieInfo)
        info.downloadUrl = this.download.url
        info.downloadPwd = this.download.pwd
        const _id = info._id
        delete info._id
        // return
        Util.fetch(`/api/movies/${_id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        }).then(res => {
            Toast.info('已修改', 1.5, () => {
                setTimeout(() => {
                    this.props.history.push('/home')
                }, 0)
            })
        })
    }

    componentWillMount() {
        const { id } = this.props.match.params
        Util.fetch(`/api/movies/${id}`).then(res => {
            this.setState({
                movieInfo: res.data[0]
            })
            const attachId = res.data[0].attachId
            if (attachId) {
                Util.fetch(`/api/movies/${id}/attach`).then(res => {
                    this.setState({
                        download: res.data[0]
                    })
                    this.download=res.data[0]
                })
            }
        })
    }

    render() {
        const { state } = this.props.location
        return (
            this.state.movieInfo && <div style={{ "marginBottom": "120px" }}>
                <div className="movie-info">
                    <MovieInfo isEdit={state.edit} data={this.state.movieInfo} callback={this.editCallback}></MovieInfo>
                    <DownForm isEdit={state.edit} data={this.state.download} callback={this.downCallback}></DownForm>
                    {
                        state.edit ? <Button type="primary" size="small" style={{ "margin": "0 10px" }} onClick={this.modifyMovie}>修改</Button> :
                            <Button type="primary" size="small" style={{ "margin": "0 10px" }}>下载地址</Button>
                    }
                </div>
            </div>
        )
    }

}

