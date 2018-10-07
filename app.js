var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const cosmetics = require("./routes/cosmetics");
const customers = require("./routes/customers");
const sellers = require("./routes/sellers");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.get('/cosmetics', cosmetics.findAll);
app.get('/cosmetics/sortByLowPrice', cosmetics.sortByLowPrice);
app.get('/cosmetics/sortByHighPrice', cosmetics.sortByHighPrice);
app.get('/cosmetics/:name', cosmetics.findByName);
app.get('/cosmetics/:name/:brand', cosmetics.filterByBrand);
app.get('/customer/:id', customers.findOne);
app.get('/seller/:id', sellers.findOne);

app.put('/cosmetics/:id/edit', cosmetics.editByID);
app.put('/customer/:id/edit', customers.editByID);
app.put('/seller/:id/edit', sellers.editByID);//{"id":0,"name": "Angel","email":"123456@gmail.com","password":"123456","description":""}

app.post('/cosmetics/add', cosmetics.addCosmetic);
app.post('/customer/signUp', customers.signUp);//{"id": 0, "name" : "Angel","email" : "AnqiLi@gmail.com", "password": "321321", "phoneNum" : "", "address":""}
app.post('/customer/login', customers.login);//{"email" : "123456@qq.com", "password": "123123"}
app.post('/seller/signUp', sellers.register);//{"name":"AnqiLi","email" : "123456@qq.com", "password": "123123"}
app.post('/seller/login', sellers.login);//{"email" : "123456@qq.com", "password": "123123"}

app.delete('/cosmetics/:id/delete', cosmetics.removeCosmetic);

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
