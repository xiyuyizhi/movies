
import React from 'react';
import {
    bindActionCreators
} from "redux"
import {
    connect
} from "react-redux"
import {
    recieveItemMovieInfo
} from "../actions/index"

class MovieInfo extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
        this.change = this.change.bind(this)
    }

    change(data, property, value) {
        const d = { ...data }
        d[property] = value
        this.props.recieveItemMovieInfo(d)
    }

    render() {
        const { isEdit, data } = this.props
        return (
            Object.keys(data).length ?
                <div className="movie_info">
                    <img src={data.thumb} alt={data.title} className='big-thumb' />
                    <section>
                        <p>
                            <label>主演:</label>
                            {
                                isEdit ? <textarea value={data.actors.join('/')} onChange={(e) => {
                                    this.change(data, 'actors', e.target.value.split('/'))
                                }} /> : data.actors.join('/')
                            }
                        </p>
                        <p>
                            <label>类型:</label>
                            {
                                isEdit ? <textarea value={data.type.join('/')} onChange={(e) => {
                                    this.change(data, 'type', e.target.value.split('/'))
                                }} /> : data.type.join('/')
                            }
                        </p>
                        <p>
                            <label>上映时间:</label>
                            {
                                isEdit ? <textarea value={data.time} onChange={(e) => {
                                    this.change(data, 'time', e.target.value)
                                }} /> : data.time
                            }
                        </p>
                        <p><label>简介:</label>
                            {
                                isEdit ? <textarea className='lg' value={data.instruct} onChange={(e) => {
                                    this.change(data, 'instruct', e.target.value)
                                }} /> : data.instruct
                            }
                        </p>
                    </section>
                </div> : null
        )
    }
}

export default connect(
    state => ({
        data: state.detail.movieInfo
    }),
    dispatch => (bindActionCreators({
        recieveItemMovieInfo
    }, dispatch))
)(MovieInfo)