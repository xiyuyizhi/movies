
import React from 'react'

const CustomIcon = ({ type, className = '', size = 'md', ...restProps }) => {
    // return <svg
    //     viewBox={`${type.viewBox}`}
    //     className={`am-icon am-icon-${type.id} am-icon-${size} ${className}`}
    //     {...restProps}
    // >
    //     {/* <use xlinkHref={type.default.id} /> svg-sprite-loader@0.3.x */}
    //     <use xlinkHref={`#${type.id}`} />
    // </svg>
    return <img src={type} alt={className} className={`am-icon am-icon-${size} ${className}`} {...restProps}/> 
};


export default CustomIcon