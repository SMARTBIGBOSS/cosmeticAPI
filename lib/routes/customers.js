'use strict';

var _customers = require('../models/customers');

var _customers2 = _interopRequireDefault(_customers);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();

//let Customer = require('../models/customers');

//let express = require('express');
//let router = express.Router();


var mongodbUri = 'mongodb://tester:tester100@ds143593.mlab.com:43593/testcosmeticweb';

_mongoose2.default.connect(mongodbUri);

var db = _mongoose2.default.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.login = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _customers2.default.findOne({ email: req.body.email }, function (err, customer) {
        if (!customer) res.json({ message: 'Customer NOT Login!', errmsg: err });else {
            if (_bcryptNodejs2.default.compareSync(req.body.password, customer.password)) {
                var token = customer.generateAuthToken();
                res.header('x-auth-token', token);
                res.json({ message: 'Customer Successfully Login', data: customer });
            } else res.json({ message: 'Email Address or Password Incorrect!', errmsg: err });
        }
    });
};

router.signUp = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var customer = new _customers2.default();
    customer.customerId = req.body.customerId;
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.phoneNum = req.body.phoneNum;
    customer.address = req.body.address;
    customer.register_date = Date.now();
    customer.password = _bcryptNodejs2.default.hashSync(req.body.password);

    customer.save(function (err) {
        if (err) res.json({ message: 'Customer NOT Sign Up!', errmsg: err });else res.json({ message: 'Customer Successfully Sign Up', data: customer });
    });
};

router.editByID = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var customer = new _customers2.default({
        name: req.body.name,
        email: req.body.email,
        phoneNum: req.body.phoneNum,
        address: req.body.address,
        password: _bcryptNodejs2.default.hashSync(req.body.password)
    });
    var validate = customer.validateSync();

    if (validate != null) {
        res.json({ message: 'Customer validation failed', errmg: validate });
    } else {
        _customers2.default.updateOne({ 'customerId': req.params.customerId }, { name: customer.name,
            email: customer.email,
            password: customer.password,
            phoneNum: customer.phoneNum,
            address: customer.address
            //img_url:
        }, function (err, customer) {
            if (err) res.json({ message: 'Customer NOT Edited!', errmsg: err });else res.json({ message: 'Customer Successfully Edited!', data: customer });
        });
    }
};

router.findOne = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _customers2.default.findOne({ customerId: req.params.customerId }, function (err, customer) {
        if (!customer) res.json({ message: 'Customer NOT Found!', errmsg: err });else res.send(JSON.stringify(customer, null, 5));
    });
};

module.exports = router;