import React from 'react'
import { Popup, Icon } from "antd-mobile"
import {
    NavLink,
    withRouter
} from "react-router-dom"
const dayOfWeek = ['日', '一', '二', '三', '四', '五', '六']
function formate() {
    const now = new Date()
    const date = now.toLocaleString().split(' ')[0]
    const weekDay = '星期' + dayOfWeek[now.getDay()]
    return {
        date,
        weekDay
    }
}

const Pop = ({ history }) => {

    const d = formate()
    return (
        <div className='popup'>
            <div className='showtime'>
                <span>{d.date}</span>
                <span className="weekDay">{d.weekDay}</span>
            </div>

            <div className="editBtns">
                {/*<span className="editBtns-item">
                    <Icon type={require('../common/svg/form.svg')} size="lg"></Icon>
                    <label className='name'>表单形式</label>
                </span>*/}
                <span className="editBtns-item" onClick={() => {
                        Popup.hide();
                        history.push('/reptile')
                    }}>
                    <Icon type={require('../common/svg/search.svg')} size="lg"></Icon>
                    <label className='name' >先找找</label>
                </span>
                <span className="editBtns-item">
                    <Icon type={require('../common/svg/upload.svg')} size="lg"></Icon>
                    <label className='name'>文件夹形式</label>
                </span>
            </div>
            <div className='popup-footer'>
                <Icon type={require('../common/svg/close.svg')} size="sm" style={{ position: 'relative', top: '5px' }} onClick={() => {
                    Popup.hide();
                }} />
            </div>
        </div>
    )

}

export default Pop