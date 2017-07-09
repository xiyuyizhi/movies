
import React, { Component } from 'react';

export default class Detail extends Component{

    constructor(props){
        super(props)
        this.props=props
    }

    render(){
        const {id}= this.props.match.params
        return <div>
            current movie,id is {id}
        </div>
    }

}

