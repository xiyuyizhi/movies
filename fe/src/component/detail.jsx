
import React, { Component } from 'react';
import {
    Button,
} from 'antd-mobile';
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"
import Util from "../util/Util.js"
import cloneDeep from "lodash/cloneDeep"

import {
    connect
} from "react-redux"

import {
    bindActionCreators
} from "redux"

import {
    loadItemMovie,
    recieveItemMovieInfo,
    recieveMovieAttach
} from "../actions/hompage"

class Detail extends Component {

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


    //movieInfo组件中form表单的回调
    editCallback(data) {
        this.props.recieveItemMovieInfo(data)
    }

    downCallback(data) {
        this.props.recieveMovieAttach(data)
    }

    modifyMovie() {
        const info = cloneDeep(this.props.movieInfo)
        if (this.props.download) {
            info.downloadUrl = this.props.download.url
            info.downloadPwd = this.props.download.pwd
        }
        const _id = info._id
        delete info._id
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

    componentDidMount() {
        const { match, location } = this.props
        const { id } = match.params
        const { login } = location.state
        this.props.loadItemMovie(id, login)
    }

    showButton(isLogin, hasAttach) {

        if (!isLogin || (isLogin && !hasAttach)) {
            return <Button type="primary" size="small" style={{ "margin": "0 10px" }} disabled={!hasAttach} onClick={() => {
                Util.Toast.info('请登录')
            }}>下载地址</Button>
        }

    }

    render() {
        const { location, movieInfo, download } = this.props
        const { state } = location
        return (
            movieInfo ?
                <div style={{ "marginBottom": "120px" }}>
                    <div className="movie-info">
                        <MovieInfo isEdit={state.edit} data={movieInfo} callback={this.editCallback}></MovieInfo>
                        {
                            (state.edit || (movieInfo.attachId && state.login)) && <DownForm data={download} isEdit={state.edit} callback={this.downCallback}></DownForm>
                        }
                        {
                            state.edit ? <Button type="primary" size="small" style={{ "margin": "0 10px" }} onClick={this.modifyMovie}>修改</Button> :
                                this.showButton(state.login, movieInfo.attachId)
                        }
                    </div>
                </div> : null
        )
    }

}



export default connect(
    state => ({
        movieInfo: state.detail.movieInfo,
        download: state.detail.attach
    }),
    dispatch => (bindActionCreators({
        loadItemMovie,
        recieveItemMovieInfo,
        recieveMovieAttach
    }, dispatch))
)(Detail)