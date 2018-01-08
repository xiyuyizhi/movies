

import express from 'express';

import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
const fs = require('fs')
const path = require('path')
import html from "./main"

const app = new express();
const port = 8899;


if (process.env.NODE_ENV === 'development') {
}
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, '../build'),{
    index:false
}))


app.use('*',(req, res, next) => {
    const html = renderFullPage()
    res.send(html)
});

app.listen(port, err => {
    if (err) {
        console.error(err);
    } else {
        console.info(`the express server has been listened at port: ${port},haha`)
    }
})



function renderFullPage() {
    const main = JSON.parse(fs.readFileSync(path.join(__dirname, '../config/webpack-assets.json')))
    const jsPath = main.javascript.main;
    const cssPath = main.styles.main;
    //console.log(injectScriptPath)
    return `
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            
            <title>这是react-ssr</title>
            <link href=${cssPath} rel="stylesheet"></link>
        </head>
        <body>
            <div id="container"><div>${html}</div></div>
            <script>
                window.__INITIAL_STATE__ = {}
            </script>
            <script src=${jsPath}></script>
        </body>
        </html>
    `
}
