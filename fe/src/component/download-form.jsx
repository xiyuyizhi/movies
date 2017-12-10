import React from 'react';
import cloneDeep from "lodash/cloneDeep"
import {
    connect
} from "react-redux"
import {
    bindActionCreators
} from "redux"
import {
    recieveMovieAttach
} from "../actions/index"

class DownForm extends React.Component {
    constructor(props) {
        super(props)
        this.handleUrl = this.handleUrl.bind(this)
        this.handlePwd = this.handlePwd.bind(this)
    }


    handleUrl(e) {
        const dm = cloneDeep(this.props.download)
        dm.url = e.target.value
        this.props.recieveMovieAttach(dm)
    }

    handlePwd(e) {
        const dm = cloneDeep(this.props.download)
        dm.pwd = e.target.value
        this.props.recieveMovieAttach(dm)
    }

    render() {
        const { isEdit, download } = this.props
        return (
            <div className='download'>
                <p>
                    <label>下载地址:</label>
                    <input type='text' value={download.url}
                        disabled={!isEdit} onChange={this.handleUrl}></input>
                </p>
                <p>
                    <label>提取码:</label>
                    <input type='text' value={download.pwd}
                        disabled={!isEdit} onChange={this.handlePwd}></input>
                </p>
            </div>
        )
    }

}

export default connect(
    state => ({
        download: state.detail.attach
    }),
    dispatch => (bindActionCreators({
        recieveMovieAttach
    },dispatch))
)(DownForm)