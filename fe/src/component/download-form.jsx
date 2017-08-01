import React from 'react';


export default class DownForm extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            url: '',
            pwd: ''
        }
        this.handleUrl = this.handleUrl.bind(this)
        this.handlePwd = this.handlePwd.bind(this)
    }


    handleUrl(e) {
        this.setState({
            url: e.target.value
        })
        this.props.callback(this.state)
    }

    handlePwd(e) {
        this.setState({
            pwd: e.target.value
        })
        this.props.callback(this.state)
    }

    render() {
        const { isEdit } = this.props
        return (
            <div className='download'>
                <p>
                    <label>下载地址:</label>
                    <input type='text' value={this.state.url}
                        disabled={!isEdit} onChange={this.handleUrl}></input>
                </p>
                <p>
                    <label>提取码:</label>
                    <input type='text' value={this.state.pwd}
                        disabled={!isEdit} onChange={this.handlePwd}></input>
                </p>
            </div>
        )
    }

}