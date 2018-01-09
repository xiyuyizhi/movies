import React from 'react'
import { Modal } from "antd-mobile"
import Icon from "../customIcon"
import Util from "../../util/Util"
import Iconsearch from '../../common/svg/search.svg'
import Iconupload from '../../common/svg/upload.svg'
import Iconclose from '../../common/svg/close.svg'
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
export default class Pop extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    render() {
        const d = formate()
        const { history } = this.props
        return <Modal popup
            visible={this.props.show}
            animationType="slide-up"
            maskClosable={false} >
            <div className='popup' >
                <div className='showtime'>
                    <span>{d.date}</span>
                    <span className="weekDay">{d.weekDay}</span>
                </div>
                <div id='container'></div>

                <div className="editBtns">
                    <span className="editBtns-item" onClick={() => {
                        this.props.handleProp(false)
                        history.push('/reptile')
                    }}>
                        <Icon type={Iconsearch} size="lg"></Icon>
                        <label className='name' >先找找</label>
                    </span>
                    <span className="editBtns-item" onClick={() => {
                        Util.Toast.info('暂不支持')
                    }}>
                        <Icon type={Iconupload} size="lg"></Icon>
                        <label className='name'>文件夹形式</label>
                    </span>
                </div>
                <div className='popup-footer'>
                    <Icon type={Iconclose} size="sm" style={{ position: 'relative', top: '5px' }} onClick={() => {
                        this.props.handleProp(false)
                    }} />
                </div>

            </div >
        </Modal >

    }

}

