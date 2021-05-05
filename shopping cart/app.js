var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs= require('express-handlebars')
var fileUpload=require('express-fileupload') //to upload file(install npm i express-fileupload)
var db=require('./config/connection')   //FOR DB
var session=require('express-session') // for session (npm i express-session)
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var app = express();
var cors = require('cors')

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
//setup engine for create extra folder partail and layout to make default
app.engine('hbs',hbs( {extname:'hbs',defaultLayout:'layout',layoutsDir:__dirname+'/views/layout/',partialsDir:__dirname+'/views/partials/'}))


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:"key",cookie:{maxAge:600000}}))

db.connect((err)=>{
  if(err) console.log("connectioin error"+err)
  else console.log("Database connected");
}) //for database connection

app.use(fileUpload())  //use fileupload in this middleware
app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
