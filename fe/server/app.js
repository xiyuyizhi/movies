
import express from 'express';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import renderFullPage from "./renderFullPage"
import fetchData from "./dataFetch"


const app = new express();
const port = process.env.PORT || '3000';

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use('*', (req, res, next) => {

    const { promises, store } = fetchData(req)

    Promise.all(promises).then(x => {
        const html = renderFullPage(req, res, store)
        res.send(html)
    }).catch(x=>{
        console.log(x);
        res.end('server error,please visit later')
    })

});

app.listen(port)

console.log('server run on port'+port);


