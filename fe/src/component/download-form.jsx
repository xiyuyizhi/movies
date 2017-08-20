import React from 'react';
import cloneDeep from "lodash/cloneDeep"

export default class DownForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            download: {
                url: '',
                pwd: ''
            }
        }
        this.handleUrl = this.handleUrl.bind(this)
        this.handlePwd = this.handlePwd.bind(this)
    }


    handleUrl(e) {
        const dm = cloneDeep(this.state.download)
        dm.url = e.target.value
        this.setState({
            download: dm
        })
        this.props.callback(dm)
    }

    handlePwd(e) {
        const dm = cloneDeep(this.state.download)
        dm.pwd = e.target.value
        this.setState({
            download: dm
        })
        this.props.callback(dm)
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.data) {
            this.setState({
                download: nextProps.data
            })
        }
    }

    render() {
        const { isEdit } = this.props
        return (
            <div className='download'>
                <p>
                    <label>下载地址:</label>
                    <input type='text' value={this.state.download.url}
                        disabled={!isEdit} onChange={this.handleUrl}></input>
                </p>
                <p>
                    <label>提取码:</label>
                    <input type='text' value={this.state.download.pwd}
                        disabled={!isEdit} onChange={this.handlePwd}></input>
                </p>
            </div>
        )
    }

}