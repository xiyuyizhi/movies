
import React, { Component } from 'react';
import {
    Button,
} from 'antd-mobile';
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"
import Util from "../util/Util.js"
import {
    connect
} from "react-redux"
import {
    bindActionCreators
} from "redux"
import {
    loadItemMovie,
    modifyMovie
} from "../actions/index"

class Detail extends Component {

    constructor(props) {
        super(props)
        this.modifyMovie = this.modifyMovie.bind(this)
    }

    modifyMovie() {
        this.props.modifyMovie({
            history: this.props.history
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
        const { location, movieInfo } = this.props
        const { state } = location
        return (
            movieInfo ?
                <div style={{ "marginBottom": "120px" }}>
                    <div className="movie-info">
                        <MovieInfo isEdit={state.edit}></MovieInfo>
                        {
                            (state.edit || (movieInfo.attachId && state.login)) && <DownForm isEdit={state.edit} ></DownForm>
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
    }),
    dispatch => (bindActionCreators({
        loadItemMovie,
        modifyMovie
    }, dispatch))
)(Detail)