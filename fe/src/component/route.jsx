
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
export default function () {

    return (
        <Router>
            <div>
                <Header></Header>
                <div className="main">
                    <Route exact path="/" render={() =>
                        <Redirect to="/home"></Redirect>
                    }></Route>
                    <Route path="/home" component={Home}></Route>
                    <Route path="/detail/:id" component={Detail}></Route>
                    <Route path="/user" component={User}></Route>
                    <Route path="/reptile" component={Reptile}></Route>
                </div>
                <Nav></Nav>
            </div>
        </Router>
    )

}
