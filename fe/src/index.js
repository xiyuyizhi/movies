
import "babel-polyfill"
import React from 'react';
import { hydrate } from 'react-dom';

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
console.log(window.__INITIAL_STATE__);
const store = createStore(
    reducer,
    window.__INITIAL_STATE__,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

store.subscribe(() => {
    console.log(store.getState());
})

function onUpdate() {
    if (window.__INITIAL_STATE__ !== null) {
        window.__INITIAL_STATE__ = null;
        return;
    }
}

hydrate(
    <Provider store={store}>
        <Router onUpdate={onUpdate}>
            <Routes></Routes>
        </Router>
    </Provider>,
    document.getElementById('root')
);
