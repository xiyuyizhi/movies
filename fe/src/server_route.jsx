
import React from 'react';
import {
    // BrowserRouter as Router,
    StaticRouter as Router,
    Route,
    Redirect
} from "react-router-dom"

import Header from "./component/header"
import Nav from "./component/nav"
import Home from "./component/home/homePage"
// import Detail from "./component/detail"
// import User from "./component/user/user"
// import Reptile from "./component/post/reptile"
// import Collect from "./component/user/collectList"

export default class Rout extends React.Component {

    render() {
        return (
            <Router context={{}}>
                <div>
                    <Header></Header>
                    <div className="main">
                        <Home></Home>
                    </div>
                    <Nav></Nav>
                </div>
            </Router>
            // <Router context={{}}>
            //     <div>
            //         <Header></Header>
            //         <div className="main">
            //             <Route exact path="/" render={() =>
            //                 <Redirect to="/home"></Redirect>
            //             }></Route>
            //             <Route path="/home" component={Home}></Route>
            //             <Route path="/detail/:id" component={Detail}></Route>
            //             <Route path="/user" component={User}></Route>
            //             <Route path="/reptile" component={Reptile}></Route>
            //             <Route path="/collect" component={Collect}></Route>
            //         </div>
            //         <Nav></Nav>
            //     </div>
            // </Router>
        )
    }

}


