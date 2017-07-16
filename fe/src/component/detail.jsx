
import React, { Component } from 'react';
import { Button } from 'antd-mobile';
import data from "./data.js"
export default class Detail extends Component {

    constructor(props) {
        super(props)
        this.props = props
    }

    getData(id) {
        return data.filter(item => {
            return item.id == id
        })[0]
    }

    render() {
        const { id } = this.props.match.params
        const d = this.getData(id)
        return <div className='detail'>
            <img src={d.thumb} className='big-thumb' />
            <section>
                <p>
                    <label>主演:</label>
                    {d.actors}
                </p>
                <p>
                    <label>类型:</label>
                    {d.type}
                </p>
                <p>
                    <label>上映时间:</label>
                    {d.time}
                </p>
                <p><label>简介:</label>
                    {d.instruct}
                </p>
            </section>
            <Button type="primary" size="small">下载地址</Button>
        </div>
    }

}

