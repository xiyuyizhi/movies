import React from 'react';
import {
    Button,
    Toast,
    Switch
} from "antd-mobile"
import cloneDeep from "lodash/cloneDeep"
import Util from "../util/Util.js"
import MovieInfo from "./movieInfo"

export default class Reptile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            m_name: '',
            m_info: null,
            on: false, //修改按钮,
            download: {
                url: '',
                pwd: ''
            }
        }
        this.reptile = this.reptile.bind(this)
        this.addMovie = this.addMovie.bind(this)
        this.editCallback = this.editCallback.bind(this)
        this.handleUrl = this.handleUrl.bind(this)
        this.handlePwd = this.handlePwd.bind(this)
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
        const info = cloneDeep(this.state.m_info)
        info.title = this.state.m_name
        info.downloadUrl = this.state.download.url
        info.downloadPwd = this.state.download.pwd
        Util.fetch('/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        }).then(res => {
            Toast.info('已录入', 1.5, () => {
                setTimeout(() => {
                    this.props.history.push('/home')
                }, 0)
            })
        })
    }

    //movieInfo组件中form表单的回调
    editCallback(data) {
        this.setState({
            m_info: data,
        })
    }

    handleUrl(e) {
        const download = this.state.download
        download.url = e.target.value
        this.setState({
            download
        })
    }

    handlePwd(e) {
        const download = this.state.download
        download.pwd = e.target.value
        this.setState({
            download
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
                        <div className='download'>
                            <p>
                                <label>下载地址:</label>
                                <input type='text' value={this.state.download.url}
                                    disabled={!this.state.on} onChange={this.handleUrl}></input>
                            </p>
                            <p>
                                <label>提取码:</label>
                                <input type='text' value={this.state.download.pwd}
                                    disabled={!this.state.on} onChange={this.handlePwd}></input>
                            </p>
                        </div>
                        <Button type="primary" size="small" onClick={this.addMovie}>录入</Button>
                    </div>
                }
            </div>
        )
    }

}