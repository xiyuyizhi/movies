import React from 'react';
import {
    Button,
    Switch
} from "antd-mobile"
import cloneDeep from "lodash/cloneDeep"
import Util from "../util/Util.js"
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"
import {
    bindActionCreators
} from "redux"
import {
    connect
} from "react-redux"
import {
    resetStateDetial,
    loadReptileMovie,
    modifyMovie
} from "../actions/index"

class Reptile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            m_name: '',
            on: false, //修改按钮
        }
        this.reptile = this.reptile.bind(this)
        this.addMovie = this.addMovie.bind(this)
    }

    /**
     * 爬取数据
     */
    reptile() {
        if (!this.state.m_name) {
            return
        }
        this.props.loadReptileMovie(this.state.m_name)
    }

    addMovie() {
        this.props.modifyMovie({
            mName: this.state.m_name,
            history: this.props.history,
            isNew: true
        })
    }

    componentDidMount() {
        this.props.resetStateDetial()
    }

    render() {
        const { movieInfo, download } = this.props
        return (
            <div className='reptile'>
                <div className='search-form'>
                    <input type="text" placeholder='电影名' value={this.state.m_name} onChange={(e) => {
                        this.setState({
                            m_name: e.target.value
                        })
                    }} />
                    <Button type="primary" size="small" onClick={this.reptile}>搜索</Button>
                </div>
                {
                    Object.keys(movieInfo).length &&
                    <div className="movie-info">
                        <div style={{ 'marginBottom': '10px' }}>
                            <label>修改:</label>
                            <Switch checked={this.state.on} onChange={() => {
                                this.setState({
                                    on: !this.state.on
                                })
                            }}></Switch>
                        </div>
                        <MovieInfo isEdit={this.state.on}></MovieInfo>
                        <DownForm isEdit={this.state.on}></DownForm>
                        <Button type="primary" size="small" onClick={this.addMovie}>录入</Button>
                    </div>
                }
            </div>
        )
    }

}

export default connect(
    state => ({
        movieInfo: state.detail.movieInfo
    }),
    dispatch => (bindActionCreators({
        resetStateDetial,
        loadReptileMovie,
        modifyMovie
    }, dispatch))
)(Reptile)