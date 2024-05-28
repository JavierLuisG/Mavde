var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
// implement cors to disable CORS 
var cors = require('cors');

var indexRouter = require('./routes/index');
// add users
var usersRouter = require('./routes/users');
// add products
var productsRouter = require('./routes/products');

var app = express();

// general path
var baseApiPath = "/api";
var apiVersion = "/v1";

// path of users
var usersPath = "/users";
// path of products
var productsPath = "/products";

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// invoke cors
app.use(cors());

app.use('/', indexRouter);
// for users
app.use((baseApiPath + apiVersion + usersPath), usersRouter);
// for products
app.use((baseApiPath + apiVersion + productsPath), productsRouter);

module.exports = app;
