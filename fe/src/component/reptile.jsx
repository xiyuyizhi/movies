import React from 'react';
import {
    Button,
    Toast,
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
        const data = { "code": 0, "data": [{ "_id": "59803c1e4cbe251da7d8edf0", "thumb": "https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p1903380040.jpg", "actors": ["李政宰", "崔岷植", "黄政民", "宋智孝", "朴圣雄"], "type": ["剧情", "犯罪"], "time": "韩语/汉语普通话", "instruct": "\n                                　　金门集团会长、暴力组织在虎派大佬石东出遭遇车祸身亡，该事件在黑白两道引起不小震荡。为了遏制金门集团进一步向合法领域渗透并持续壮大，警方及时提出“新世界计划”，旨在干预金门集团继任大佬的选举。而围绕会长头衔，金门旗下三号人物华侨出身的丁青（黄正民 饰）和四号人物常务理事李仲久（朴圣雄 饰）展开一连串明争暗斗。在危机四伏的当下，警方姜科长（崔岷植 饰）命令卧底十年之久的李子成（李政宰 饰）左右选举结果。子成六年前和丁青结识，并且得到对方的器重和信任。早已厌倦黑道生活的子成无奈受命，却无疑将自己投入了凶险非常的黑色漩涡之中。\n                                    \n                                　　充满鲜血与欲望的战场，新世界何日来临？\n                        ", "title": "新世界", "createTime": 1501576222227, "updateTime": 1501576222227, "attachId": "59803c1e4cbe251da7d8edef" }] }
        this.setState({
            m_info: data.data[0],
        })
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
        info.downloadUrl = this.download.url
        info.downloadPwd = this.download.pwd
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