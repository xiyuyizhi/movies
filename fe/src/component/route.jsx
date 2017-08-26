
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from "react-router-dom"
import Header from "./header"
import Nav from "./nav"
import Home from "./home/homePage"
import Detail from "./detail"
import User from "./user"
import Reptile from "./reptile"
import Collect from "./collectList"
import Util from "../util/Util"

export default class Rout extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            login: false
        }
        console.log('route')
        console.log(props)
    }

    componentDidMount() {
        Util.fetch('/api/user/checkLogin').then(res => {
            this.setState({
                login: !res.code
            })
        })
    }

    render() {
        return (
            <Router>
                <div>
                    <Header></Header>
                    <div className="main">
                        <Route exact path="/" render={() =>
                            <Redirect to="/home"></Redirect>
                        }></Route>
                        <Route path="/home" render={(props) => {
                            return <Home login={this.state.login} {...props}></Home>
                        }}></Route>
                        <Route path="/detail/:id" component={Detail}></Route>
                        <Route path="/user" render={(props) => {
                            return <User login={this.state.login} {...props}></User>
                        }}></Route>
                        <Route path="/reptile" render={(props=>{
                            return <Reptile login={this.state.login} {...props}></Reptile>
                        })}></Route>
                        <Route path="/collect" component={Collect}></Route>
                    </div>
                    <Nav login={this.state.login}></Nav>
                </div>
            </Router>
        )
    }

}


