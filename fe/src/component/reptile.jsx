import React from 'react';
import {
    Button,
    ActivityIndicator,
    Toast,
    Switch
} from "antd-mobile"
import Util from "../util/Util.js"
import MovieInfo from "./movieInfo"

export default class Reptile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            m_name: '',
            m_info: null,
            on: false //修改按钮
        }
        this.reptile = this.reptile.bind(this)
        this.addMovie = this.addMovie.bind(this)
        this.editCallback = this.editCallback.bind(this)
    }

    /**
     * 爬取数据
     */
    reptile() {
        if (!this.state.m_name) {
            return
        }
        Util.fetch('/api/reptile/' + this.state.m_name).then(data => {
            if (data.code) {
                Toast.info(data.msg)
                return
            }
            this.setState({
                m_info: data,
            })
        })
    }

    addMovie() {

        this.state.m_info.title = this.state.m_name
        Util.fetch('/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.m_info)
        }).then(res => {
            Toast.info('已录入', 1.5, () => {
                setTimeout(() => {
                    this.props.history.push('/home')
                }, 0)
            })
        })
    }

    editCallback(data) {
        this.setState({
            m_info: data,
        })
    }

    render() {
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
                    this.state.m_info &&
                    <div className="movie-info">
                        <div style={{ 'marginBottom': '10px' }}>
                            <label>修改:</label><Switch checked={this.state.on} onChange={() => {
                                this.setState({
                                    on: !this.state.on
                                })
                            }}></Switch>
                        </div>
                        <MovieInfo isEdit={this.state.on} data={this.state.m_info} callback={this.editCallback}></MovieInfo>
                        <Button type="primary" size="small" onClick={this.addMovie}>录入</Button>
                    </div>
                }
            </div>
        )
    }

}