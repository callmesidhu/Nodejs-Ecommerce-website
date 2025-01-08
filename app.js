var createError = require('http-errors');
var express = require('express');
var path = require('path');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB = require('./config/dbconnection');
var fileUpload = require('express-fileupload');

// Connect to MongoDB
connectDB();

var homeRouter = require('./routes/home');
var adminRouter = require('./routes/admin');
var cartRouter = require('./routes/cart');
var errorRouter = require('./routes/error');
var productsRouter = require('./routes/products');
var accountsRouter = require('./routes/accounts');
var connectDB = require('./config/dbconnection'); 



var hbs = require('hbs'); 


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Set hbs as the view engine


// To parse URL-encoded bodies (sent by HTML forms)
app.use(express.urlencoded({ extended: true }));

// To parse JSON bodies
app.use(express.json());
app.use(fileUpload());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/cart', cartRouter);
app.use('/products', productsRouter);
app.use('/account', accountsRouter);
app.use('/*',errorRouter);


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
