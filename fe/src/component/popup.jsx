import React from 'react'
import { Popup, Icon } from "antd-mobile"
import AMap from "AMap"
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
        this.state = {
            position:''
        }
    }

    componentDidMount() {
        const mapObj = new AMap.Map('container',{
            zoom:15
        });
        mapObj.plugin('AMap.Geolocation', () => {
            const geolocation = new AMap.Geolocation({
                enableHighAccuracy: true,//是否使用高精度定位，默认:true
                timeout: 10000,          //超过10秒后停止定位，默认：无穷大
                maximumAge: 0,           //定位结果缓存0毫秒，默认：0
                convert: true,           //自动偏移坐标，偏移后的坐标为高德坐标，默认：true
                showButton: true,        //显示定位按钮，默认：true
                buttonPosition: 'LB',    //定位按钮停靠位置，默认：'LB'，左下角
                buttonOffset: new AMap.Pixel(10, 20),//定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
                showMarker: true,        //定位成功后在定位到的位置显示点标记，默认：true
                showCircle: true,        //定位成功后用圆圈表示定位精度范围，默认：true
                panToLocation: true,     //定位成功后将定位到的位置作为地图中心点，默认：true
                zoomToAccuracy: true      //定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            });
            mapObj.addControl(geolocation);
            geolocation.getCurrentPosition();
            AMap.event.addListener(geolocation, 'complete', position => {
                console.log(position)
                this.setState({
                    position
                })
            });//返回定位信息
            AMap.event.addListener(geolocation, 'error', err => {
                console.log(err)
                this.setState({
                    position:{
                       formattedAddress:'定位失败' 
                    }
                })
            });      //返回定位出错信息
        });
    }

    render() {
        const d = formate()
        const { history } = this.props
        return < div className='popup' >
            <div className="position">
                <label>您的位置:</label>
                <span>{this.state.position.formattedAddress}</span>
            </div>
            <div className='showtime'>
                <span>{d.date}</span>
                <span className="weekDay">{d.weekDay}</span>
            </div>
            <div id='container'></div>

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
        </div >
    }

}

