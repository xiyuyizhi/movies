
import fs from 'fs'
import path from 'path'

import React from 'react';
import ReactDOM from 'react-dom';
import { StaticRouter as Router } from "react-router-dom"
import { renderToString } from "react-dom/server"
import { Provider } from "react-redux"
import Routes from '../src/route';


function getAssets() {
    return getAssets.assets || (() => {
        getAssets.assets = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/webpack-assets.json')))
        return getAssets.assets
    })()
}

export default function renderFullPage(req, res, store) {
    const context = {}
    const html = renderToString(<Provider store={store}>
        <Router location={req.baseUrl}
            context={context}>
            <Routes />
        </Router>
    </Provider>)
    //<Route>中访问/,重定向到/home路由时
    if (context.url) {
        res.redirect('/home')
        return
    }
    const main = getAssets()
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
        <link rel="shortcut icon" href="/movie.ico"> 
        <link href=${cssPath} rel="stylesheet"></link>
        <title>homepage SSR</title>
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
