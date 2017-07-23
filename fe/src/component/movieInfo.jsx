
import React from 'react';

export default ({data})=>{
    return (
        data?
        <div className="movie_info">
            <img src={data.thumb} className='big-thumb' />
            <section>
                <p>
                    <label>主演:</label>
                    {data.actors.join('/')}
                </p>
                <p>
                    <label>类型:</label>
                    {data.type.join('/')}
                </p>
                <p>
                    <label>上映时间:</label>
                    {data.time}
                </p>
                <p><label>简介:</label>
                    {data.instruct}
                </p>
            </section>
        </div> :null
    )

}