
import React from 'react';
import {
    BrowserRouter as Router,
    Route,
    Redirect
} from "react-router-dom"
import Home from "./home"
import Nav from "./nav"
import User from "./user"
export default function () {

    return (
        <Router>
            <div>
                <Route exact path="/" render={() =>
                    <Redirect to="/home"></Redirect>
                }></Route>
                <Route path="/home" component={Home}></Route>
                <Route path="/user" component={User}></Route>
                <Nav></Nav>
            </div>
        </Router>
    )

}
