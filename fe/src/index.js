
import "babel-polyfill"
import React from 'react';
import ReactDOM from 'react-dom';

import {
    createStore,
    applyMiddleware
} from "redux"
import createSagaMiddleware from "redux-saga"

import rootSaga from "./sagas"
import {
    Provider
} from "react-redux"
import reducer from "./reducers/index"
import App from "./app"
import "./common/index.less"

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

store.subscribe(() => {
    console.log(store.getState());
})


ReactDOM.render(
    <Provider store={store}><App></App></Provider>,
    document.getElementById('root')
);
