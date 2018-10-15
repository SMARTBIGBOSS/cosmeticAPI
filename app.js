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
const transactions = require("./routes/transactions");

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
app.get('/transaction/:buyerId', transactions.findByBuyerId)
app.get('/transactions', transactions.findAll);

app.put('/cosmetics/:publisher/:id/edit', cosmetics.editByID);
app.put('/customer/:id/edit', customers.editByID);
app.put('/seller/:id/edit', sellers.editByID);//{"name": "Angel","email":"123456@gmail.com","password":"123456","description":""}
app.put('/transaction/:buyerId/:id/edit', transactions.edit);//{"quantity":3}
app.put('/transaction/:id/order', transactions.order);
app.put('/transaction/:id/confirmReceipt', transactions.ConfirmReceipt);

app.post('/cosmetics/:publisher/add', cosmetics.addCosmetic);
app.post('/customer/signUp', customers.signUp);//{"name" : "Angel","email" : "AnqiLi@gmail.com", "password": "321321", "phoneNum" : "", "address":""}
app.post('/customer/login', customers.login);//{"email" : "123456@qq.com", "password": "123123"}
app.post('/seller/signUp', sellers.register);//{"name":"AnqiLi","email" : "123456@qq.com", "password": "123123"}
app.post('/seller/login', sellers.login);//{"email" : "123456@qq.com", "password": "123123"}
app.post('/transaction/:buyerId/add/:cosmeId',transactions.add);//

app.delete('/cosmetics/:id/delete', cosmetics.removeCosmetic);
app.delete('/transaction/:id/remove', transactions.remove);

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
