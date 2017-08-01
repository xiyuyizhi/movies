import React from 'react'
import { Popup, Icon, Button } from "antd-mobile"
import MovieInfo from "./movieInfo"
import DownForm from "./download-form"

const Pop = ({ history }) => {

    const data = { "code": 0, "data": [{ "_id": "59803c1e4cbe251da7d8edf0", "thumb": "https://img3.doubanio.com/view/movie_poster_cover/lpst/public/p1903380040.jpg", "actors": ["李政宰", "崔岷植", "黄政民", "宋智孝", "朴圣雄"], "type": ["剧情", "犯罪"], "time": "韩语/汉语普通话", "instruct": "\n                                　　金门集团会长、暴力组织在虎派大佬石东出遭遇车祸身亡，该事件在黑白两道引起不小震荡。为了遏制金门集团进一步向合法领域渗透并持续壮大，警方及时提出“新世界计划”，旨在干预金门集团继任大佬的选举。而围绕会长头衔，金门旗下三号人物华侨出身的丁青（黄正民 饰）和四号人物常务理事李仲久（朴圣雄 饰）展开一连串明争暗斗。在危机四伏的当下，警方姜科长（崔岷植 饰）命令卧底十年之久的李子成（李政宰 饰）左右选举结果。子成六年前和丁青结识，并且得到对方的器重和信任。早已厌倦黑道生活的子成无奈受命，却无疑将自己投入了凶险非常的黑色漩涡之中。\n                                    \n                                　　充满鲜血与欲望的战场，新世界何日来临？\n                        ", "title": "新世界", "createTime": 1501576222227, "updateTime": 1501576222227, "attachId": "59803c1e4cbe251da7d8edef" }] }

    return (
        <div className='popup modify'>
            <div className='popup-close'>
                <Icon type={require('../common/svg/close.svg')} size="sm" style={{ position: 'relative', top: '5px' }} onClick={() => {
                    Popup.hide();
                }} />
                <Button type="primary" size="small">修改</Button>
            </div>
            <MovieInfo isEdit={true} data={data.data[0]}></MovieInfo>
            <DownForm isEdit={true}></DownForm>
        </div>
    )

}

export default Pop