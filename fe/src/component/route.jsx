
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from "react-router-dom"
import Header from "./header"
import Nav from "./nav"
import Home from "./home"
import Detail from "./detail"
import User from "./user"
import Reptile from "./reptile"

export default class Rout extends React.Component {

    constructor(props){
        super(props)
        this.state={
            category:'',
            search:''
        }
        this.cateCallback=this.cateCallback.bind(this)
        this.searchCallback=this.searchCallback.bind(this)
    }

    cateCallback(val){
        this.setState({
            category:val[0]
        })
    }

    searchCallback(val){
        this.setState({
            search:val
        })
    }

    render() {
        return (
            <Router>
                <div>
                    <Header cateCallback={this.cateCallback} searchCallback={this.searchCallback}></Header>
                    <div className="main">
                        <Route exact path="/" render={() =>
                            <Redirect  to="/home"></Redirect>
                        }></Route>
                        <Route path="/home"  render={(props)=>{
                            return <Home search={this.state.search} category={this.state.category} {...props}></Home>
                        }}></Route>
                        <Route path="/detail/:id" component={Detail}></Route>
                        <Route path="/user" component={User}></Route>
                        <Route path="/reptile" component={Reptile}></Route>
                    </div>
                    <Nav></Nav>
                </div>
            </Router>
        )
    }

}


