
import React from 'react';
import {
    Link
} from "react-router-dom"
export default function () {
    return (
        <div>

            {

                [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map((element, index) => {
                    return <h1 key={index}>
                        <Link to={`/detail/${index+1}`}>movie{index + 1}</Link>
                    </h1>
                })
            }

        </div>
    )

}