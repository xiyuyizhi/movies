
import React, { Component } from 'react';
import {
    Button,
} from 'antd-mobile';
import data from "./data.js"
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"
import Util from "../util/Util.js"
import cloneDeep from "lodash/cloneDeep"

export default class Detail extends Component {

    constructor(props) {
        super(props)
        console.log(props)
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
            movieInfo: data
        })
    }

    downCallback(data) {
        this.download = data
        
    }

    modifyMovie() {
        const info = cloneDeep(this.state.movieInfo)
        if (this.download) {
            info.downloadUrl = this.download.url
            info.downloadPwd = this.download.pwd
        }
        const _id = info._id
        delete info._id
        this.setState({
            download:this.download
        })
        Util.fetch(`/api/movies/${_id}`, {
            method: 'PUT',
            body: JSON.stringify(info)
        }).then(res => {
            if (res.code) {
                return
            }
            Util.Toast.info('已修改', () => {
                setTimeout(() => {
                    this.props.history.push('/home')
                }, 0)
            })
        })
    }

    componentWillMount() {
        const { match, location } = this.props
        const { id } = match.params
        const { login } = location.state
        Util.fetch(`/api/movies/${id}`).then(res => {
            this.setState({
                movieInfo: res.data[0]
            })
            const attachId = res.data[0].attachId
            if (attachId && login) {
                Util.fetch(`/api/movies/${id}/attach`).then(res => {
                    this.setState({
                        download: res.data[0]
                    })
                    this.download = res.data[0]
                })
            }
        })
    }

    showButton(isLogin, hasAttach) {

        if (!isLogin || (isLogin && !hasAttach)) {
            return <Button type="primary" size="small" style={{ "margin": "0 10px" }} disabled={!hasAttach} onClick={() => {
                Util.Toast.info('请登录')
            }}>下载地址</Button>
        }

    }

    render() {
        const { login, location } = this.props
        const { state } = location
        return (
            this.state.movieInfo ? <div style={{ "marginBottom": "120px" }}>
                <div className="movie-info">
                    <MovieInfo isEdit={state.edit} data={this.state.movieInfo} callback={this.editCallback}></MovieInfo>
                    {
                        (state.edit || (this.state.movieInfo.attachId && state.login)) && <DownForm isEdit={state.edit} data={this.state.download} callback={this.downCallback}></DownForm>
                    }
                    {
                        state.edit ? <Button type="primary" size="small" style={{ "margin": "0 10px" }} onClick={this.modifyMovie}>修改</Button> :
                            this.showButton(state.login, this.state.movieInfo.attachId)
                    }
                </div>
            </div>: null
        )
    }

}

