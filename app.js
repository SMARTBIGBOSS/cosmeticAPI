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
const user_images = require("./routes/user_images");
const auth = require("./middleware/auth");

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static('./userLogo'));


app.use('/', indexRouter);
app.use('/users', usersRouter);

//app.get('/uploadImage',function(req,res){ res.render('uploadImage')});

app.get('/cosmetics', cosmetics.findAll);
app.get('/cosmetics/sortByLowPrice', cosmetics.sortByLowPrice);
app.get('/cosmetics/sortByHighPrice', cosmetics.sortByHighPrice);
app.get('/cosmetics/:name', cosmetics.findByName);
app.get('/cosmetics/:brand', cosmetics.filterByBrand);
app.get('/customer/:id', auth, customers.findOne);
app.get('/sellers', sellers.findAll);
app.get('/seller/:id', auth, sellers.findOne);
app.get('/transaction/:buyerId', auth, transactions.findByBuyerId);
app.get('/transactions', transactions.findAll);

app.put('/cosmetics/:publisher/:id/edit', auth, cosmetics.editByID);
app.put('/customer/:id/edit', auth, customers.editByID);
app.put('/seller/:id/edit', auth, sellers.editByID);//{"name": "AnqiLi","email":"123456@qq.com","password":"123123","description":"test"}
app.put('/transaction/:buyerId/:id/edit', auth, transactions.edit);//{"quantity":3}
app.put('/transaction/:id/order', auth, transactions.order);
app.put('/transaction/:id/delivery', auth, transactions.delivery);
app.put('/transaction/:id/confirmReceipt', auth, transactions.ConfirmReceipt);

app.post('/cosmetics/:publisher/add', auth, cosmetics.addCosmetic);
app.post('/customer/signUp', customers.signUp);//{"name" : "Angel","email" : "AnqiLi@gmail.com", "password": "321321", "phoneNum" : "", "address":""}
app.post('/customer/login', customers.login);//{"email" : "123456@qq.com", "password": "123123"}
app.post('/seller/signUp', sellers.register);//{"name":"AnqiLi","email" : "123456@qq.com", "password": "123123"}
app.post('/seller/login', sellers.login);//{"email" : "123456@qq.com", "password": "123123"}
app.post('/transaction/:buyerId/add/:cosmeId',auth, transactions.add);//
app.post('/customer/:id/upload', user_images.uploadImage);

app.delete('/cosmetics/:publisher/:id/delete', auth, cosmetics.removeCosmetic);
app.delete('/transaction/:buyerId/:id/remove', auth, transactions.remove);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

if (process.env.NODE_ENV !== 'test') {
    app.use(logger('dev'));
}

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
