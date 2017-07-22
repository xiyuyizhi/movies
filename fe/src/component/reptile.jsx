import React from 'react';
import {
    Button,
    ActivityIndicator
} from "antd-mobile"
import "whatwg-fetch"
import MovieInfo from "./movieInfo"

export default class Reptile extends React.Component {
    constructor(props) {
        super(props)
        this.reptile = this.reptile.bind(this)
        this.state = {
            m_name: '',
            m_info: null,
            isLoading: false
        }
    }

    reptile() {
        if (!this.state.m_name) {
            return
        }
        this.setState({
            isLoading: true
        })
        fetch('/api/match/' + this.state.m_name).then(res => {
            return res.json()
        }).then(data => {
            this.setState({
                m_info: data,
                isLoading: false
            })
        })
    }

    render() {
        return (
            <div className='reptile'>
                <ActivityIndicator
                    toast
                    animating={this.state.isLoading}>
                </ActivityIndicator>
                <div className='search-form'>
                    <input type="text" placeholder='电影名' value={this.state.m_name} onChange={(e) => {
                        this.setState({
                            m_name: e.target.value
                        })
                    }} />
                    <Button type="primary" size="small" onClick={this.reptile}>搜索</Button>
                </div>
                {
                    this.state.m_info && <div className="movie-info">
                        <MovieInfo data={this.state.m_info}></MovieInfo>
                        <Button type="primary" size="small">录入</Button>
                    </div>
                }
            </div>
        )
    }

}