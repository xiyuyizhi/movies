
import React from 'react';

export default class MovieInfo extends React.Component {

    constructor(props) {
        super(props)
        this.props = props
        this.change = this.change.bind(this)
    }

    change(data, property, value) {
        data[property] = value
        this.setState({
            data
        })
        this.props.callback(data)
    }
    
    render() {
        const { isEdit,data} = this.props
        return (
            data ?
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
