

import "babel-polyfill"
import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from "react-dom/server"
import {
    createStore,
    applyMiddleware
} from "redux"
import createSagaMiddleware from "redux-saga"

import rootSaga from "../src/sagas"
import {
    Provider
} from "react-redux"
import reducer from "../src/reducers/index"
import App from "../src/app"
import "../src/common/index.less"

const sagaMiddleware = createSagaMiddleware()

const store = createStore(
    reducer,
    applyMiddleware(sagaMiddleware)
)

sagaMiddleware.run(rootSaga)

store.subscribe(() => {
    console.log(store.getState());
})


console.log(renderToString(<Provider store={store}><App></App></Provider>,));
