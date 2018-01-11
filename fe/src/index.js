
import "babel-polyfill"
import React from 'react';
import ReactDOM from 'react-dom';

import {
    createStore,
    applyMiddleware
} from "redux"
import createSagaMiddleware from "redux-saga"

import { BrowserRouter as Router, } from "react-router-dom"

import rootSaga from "./sagas"
import {
    Provider
} from "react-redux"
import reducer from "./reducers/index"

import Routes from "./route"

import "./common/index.less"

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    reducer,
    window.__INITIAL_STATE__?JSON.parse(window.__INITIAL_STATE__):{},
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

store.subscribe(() => {
    console.log(store.getState());
})


ReactDOM.hydrate(
    <Provider store={store}>
        <Router>
            <Routes></Routes>
        </Router>
    </Provider>,
    document.getElementById('root')
);
