require('./test')
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var code = require('./code')
var reptile = require('./routes/reptile');
var movies = require('./routes/movies');
var types=require('./routes/types')
var user =require('./routes/user')

var app = express();
const pre = '/api'
// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(pre + "/reptile", reptile);
app.use(pre + "/movies", movies);
app.use(pre + "/types", types);
app.use(pre + "/user", user);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log('..........')
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function (err, req, res, next) {
  if (typeof err == 'number') {
    res.json({
      code: err,
      msg: code[err]
    }) 
    return
  }
  next(err)
})

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.json(res.locals);
});


function* test() {

  var a = yield 'start';
  console.log(a);
  var b = yield 'end';
  console.log(b);
  return 'over';

}


module.exports = app;





