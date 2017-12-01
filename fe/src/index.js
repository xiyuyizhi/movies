
import "babel-polyfill"
import React from 'react';
import ReactDOM from 'react-dom';

import {
    createStore,
    applyMiddleware
} from "redux"
import createSagaMiddleware from "redux-saga"

import {
    watchLoadCateGory
} from "./sagas"
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

sagaMiddleware.run(watchLoadCateGory)

store.subscribe(() => {
    console.log(store.getState());
})
store.dispatch({
    type: 'FETCH_LIST_SUCCESS',
    list: [1, 2, 3]
})

ReactDOM.render(<Provider store={store}><App></App></Provider>, document.getElementById('root'));
