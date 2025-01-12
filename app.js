var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var connectDB = require('./config/dbconnection');
var fileUpload = require('express-fileupload');
var cors = require('cors');
var session = require('express-session');

// Connect to MongoDB
connectDB();

var homeRouter = require('./routes/home');
var adminRouter = require('./routes/admin');
var cartRouter = require('./routes/cart');
var productsRouter = require('./routes/products');
var accountsRouter = require('./routes/accounts');
var errorRouter = require('./routes/error');

var hbs = require('hbs');

var app = express();

// View engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs'); // Set hbs as the view engine

// Middleware
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded data
app.use(express.json()); // Parse JSON data
app.use(fileUpload());
app.use(logger('dev'));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(session({ secret:'key', cookie: { maxAge: 6000000 }}));

// Routes
app.use('/', homeRouter);
app.use('/admin', adminRouter);
app.use('/cart', cartRouter);
app.use('/products', productsRouter);
app.use('/account', accountsRouter);
app.use('/*', errorRouter); // Catch-all route for undefined routes

// Catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// Error handler
app.use(function (err, req, res, next) {
  // Set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
