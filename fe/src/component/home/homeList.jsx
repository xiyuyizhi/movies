
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
    return {
        category: state.homepage.category,
        list: state.homepage.list,
        noMore: state.homepage.noMore,
        search: state.homepage.search,
        login: state.loginStatus.login,
        loginStatus: state.loginStatus.login,
    }
}

export default connect(
    mapStateToProps,
    (dispatch) => bindActionCreators({
        loadCategory, loadMovies
    }, dispatch)
)(Home)