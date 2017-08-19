import React from 'react';
import {
    Button,
    Switch
} from "antd-mobile"
import cloneDeep from "lodash/cloneDeep"
import Util from "../util/Util.js"
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"

export default class Reptile extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            m_name: '',
            m_info: null,
            on: false, //修改按钮
        }
        this.reptile = this.reptile.bind(this)
        this.addMovie = this.addMovie.bind(this)
        this.editCallback = this.editCallback.bind(this)
        this.downCallback = this.downCallback.bind(this)

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
                Util.Toast.info(data.message)
                return
            }
            this.setState({
                m_info: data.data,
            })
        })
    }

    addMovie() {
        const info = cloneDeep(this.state.m_info)
        info.title = this.state.m_name
        if (this.download) {
            info.downloadUrl = this.download.url
            info.downloadPwd = this.download.pwd
        }
        Util.fetch('/api/movies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(info)
        }).then(res => {
            if (!res.code) {
                Util.Toast.info('已录入', () => {
                    setTimeout(() => {
                        //this.props.history.push('/home')
                    }, 0)
                })
            }
        })
    }

    //movieInfo组件中form表单的回调
    editCallback(data) {
        this.setState({
            m_info: data,
        })
    }

    downCallback(data) {
        console.log(data)
        this.download = data
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
                            <label>修改:</label>
                            <Switch checked={this.state.on} onChange={() => {
                                this.setState({
                                    on: !this.state.on
                                })
                            }}></Switch>
                        </div>
                        <MovieInfo isEdit={this.state.on} data={this.state.m_info} callback={this.editCallback}></MovieInfo>
                        <DownForm isEdit={this.state.on} callback={this.downCallback}></DownForm>
                        <Button type="primary" size="small" onClick={this.addMovie}>录入</Button>
                    </div>
                }
            </div>
        )
    }

}