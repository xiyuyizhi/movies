

import React from 'react';
import ReactDOM from 'react-dom';
import { renderToString } from "react-dom/server"
import { Provider } from "react-redux"


require('isomorphic-fetch');
import { StaticRouter as Router, } from "react-router-dom"

import express from 'express';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const fs = require('fs')
const path = require('path')
// import html from "./main"

import Routes from '../src/route';

import fetchData from "./initFetch"


const app = new express();
// const port = 7777;


if (process.env.NODE_ENV === 'development') {
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build'), {
    index: false
}))


app.use('*', (req, res, next) => {

    if (process.env.NODE_ENV !== 'production') {
        webpackIsomorphicTools.refresh()
    }
    const { promises, store } = fetchData(req)

    Promise.all(promises).then(x => {
        const html = renderFullPage(req, res, store)
        console.log(store.getState());
        res.send(html)
    })

});


module.exports = app


function renderFullPage(req, res, store) {
    //    console.log(initState);
    console.log('cookie');
    console.log(req.cookies);
    const context = {}
    const html = renderToString(<Provider store={store}>
        <Router location={req.baseUrl}
            context={context}>
            <Routes />
        </Router>

    </Provider>)
    console.log("1111111" + context.url);
    if (context.url) {
        res.redirect('/home')
        return
    }
    const main = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/webpack-assets.json')))
    const jsPath = main.javascript.main;
    const cssPath = main.styles.main;

    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
        <meta name="theme-color" content="#000000">
        <link rel="manifest" href="/manifest.json">
        <link rel="shortcut icon" href="/favicon.ico"> 
        <link href=${cssPath} rel="stylesheet"></link>
        <title>React SSR</title>
    </head>
    <body>
        <noscript>
        You need to enable JavaScript to run this app.
        </noscript>
        <div id="root">
        ${html}
        </div>
    </body>
    <script>
        window.__INITIAL_STATE__ = ${JSON.stringify(store.getState())}
    </script>
    <script src=${jsPath}></script>
    </html>
    `
}
