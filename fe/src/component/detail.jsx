
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
    loadMovieAttach,
    modifyMovie
} from "../actions/index"

class Detail extends Component {

    constructor(props) {
        super(props)
        this.props = props
        this.modifyMovie = this.modifyMovie.bind(this)
    }

    modifyMovie() {
        this.props.modifyMovie({
            history: this.props.history
        })
    }

    componentWillUpdate(nextProps) {
        if (nextProps.loginStatus && (nextProps.movieInfo!==this.props.movieInfo)) {
            const { id } = this.props.match.params
            this.props.loadMovieAttach(id)
        }
    }

    componentDidMount() {
        const { id } = this.props.match.params
        this.props.loadItemMovie(id)
    }

    showButton(isLogin, hasAttach) {

        if (!isLogin || (isLogin && !hasAttach)) {
            return <Button type="primary" size="small" style={{ "margin": "0 10px" }} disabled={!hasAttach} onClick={() => {
                Util.Toast.info('请登录')
            }}>下载地址</Button>
        }

    }

    render() {
        const { location, movieInfo, loginStatus } = this.props
        const { state } = location
        return (
            movieInfo ?
                <div style={{ "marginBottom": "120px" }}>
                    <div className="movie-info">
                        <MovieInfo isEdit={state.edit}></MovieInfo>
                        {
                            (state.edit || (movieInfo.attachId && loginStatus)) && <DownForm isEdit={state.edit} ></DownForm>
                        }
                        {
                            state.edit ? <Button type="primary" size="small" style={{ "margin": "0 10px" }} onClick={this.modifyMovie}>修改</Button> :
                                this.showButton(loginStatus, movieInfo.attachId)
                        }
                    </div>
                </div> : null
        )
    }

}

export default connect(
    state => ({
        loginStatus: state.loginStatus.login,
        movieInfo: state.detail.movieInfo,
    }),
    dispatch => (bindActionCreators({
        loadItemMovie,
        loadMovieAttach,
        modifyMovie
    }, dispatch))
)(Detail)