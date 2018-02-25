
import React, { Component } from 'react';
import Util from "../../util/Util.js"
import List from "../list"
import {
    connect
} from "react-redux"
import {
    bindActionCreators
} from "redux"
import {
    loadCategory,
    loadMovies,
} from "../../actions/index"

class Home extends Component {

    constructor(props) {
        super(props)
        this.props = props
        this.onEndReached = this.onEndReached.bind(this)
        this.deleteOne = this.deleteOne.bind(this)
        this.timer = null
    }


    onEndReached(e) {
        if (!this.props.noMore) {
            this.props.loadMovies('NEXT')
        }

    }

    deleteOne(id) {
        return Util.fetch('/api/movies/' + id, {
            method: 'DELETE'
        }).then(res => {
            if (!res.code) {
                this.props.loadCategory()
                return true
            }
        })
    }



    render() {
        const { noMore, list } = this.props
        return <List
            noMore={noMore}
            loading={false}
            datasource={list}
            dataLen={list.length}
            onEndReached={this.onEndReached}
            deleteOne={this.deleteOne}
            {...this.props}></List>
    }

}

function mapStateToProps(state) {
    const { category, list, noMore, search } = state.homepage
    const { login, loginStatus } = state.loginStatus
    return {
        category,
        list,
        noMore,
        search,
        login,
        loginStatus
    }
}

export default connect(
    mapStateToProps,
    (dispatch) => bindActionCreators({
        loadCategory, loadMovies
    }, dispatch)
)(Home)