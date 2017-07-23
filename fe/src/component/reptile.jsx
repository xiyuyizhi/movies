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
        this.state = {
            m_name: '',
            m_info: null,
            isLoading: false
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
        this.setState({
            isLoading: true
        })
        fetch('/api/reptile/' + this.state.m_name).then(res => {
            return res.json()
        }).then(data => {
            this.setState({
                m_info: data,
                isLoading: false
            })
        })
    }

    addMovie() {
        if(this.state.isLoading){
            return
        }
        this.setState({
            isLoading: true
        })
        this.state.m_info.title=this.state.m_name
        fetch('/api/movies/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(this.state.m_info)
        }).then(res => {
            this.setState({
                isLoading: false
            })
            this.props.history.push('/home')
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
                        <Button type="primary" size="small" onClick={this.addMovie}>录入</Button>
                    </div>
                }
            </div>
        )
    }

}