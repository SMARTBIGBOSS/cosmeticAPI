'use strict';

var _sellers = require('../models/sellers');

var _sellers2 = _interopRequireDefault(_sellers);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _bcryptNodejs = require('bcrypt-nodejs');

var _bcryptNodejs2 = _interopRequireDefault(_bcryptNodejs);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
//let Seller = require('../models/sellers');

//let express = require('express');
//let router = express.Router();

//let jwt = require('jsonwebtoken');

var mongodbUri = 'mongodb://tester:tester100@ds143593.mlab.com:43593/testcosmeticweb';

_mongoose2.default.connect(mongodbUri);

var db = _mongoose2.default.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.register = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var seller = new _sellers2.default();
    seller.sellerId = req.body.sellerId;
    seller.name = req.body.name;
    seller.email = req.body.email;
    seller.description = req.body.description;
    seller.register_date = Date.now();
    seller.password = _bcryptNodejs2.default.hashSync(req.body.password);

    seller.save(function (err) {
        if (err) res.json({ message: 'Seller NOT Sign Up!', errmsg: err });else res.json({ message: 'Seller Successfully Sign Up', data: seller });
    });
};

router.login = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _sellers2.default.findOne({ email: req.body.email }, function (err, seller) {
        if (!seller) res.json({ message: 'Seller NOT Login!', errmsg: err });else {
            if (_bcryptNodejs2.default.compareSync(req.body.password, seller.password)) {
                // let token = jwt.sign({_id: seller._id}, 'sellerJwtKey');
                var token = seller.generateAuthToken();
                res.header('x-auth-token', token);
                res.json({ message: 'Seller Successfully Login', data: seller });
            } else res.json({ message: 'Email Address or Password Incorrect!', errmsg: err });
        }
    });
};

router.findOne = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _sellers2.default.findOne({ sellerId: req.params.sellerId }, function (err, seller) {
        if (!seller) res.json({ message: 'Seller NOT Found!', errmsg: err });else res.send(JSON.stringify(seller, null, 5));
    });
};

router.findAll = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _sellers2.default.find(function (err, seller) {
        if (err) res.send(err);else res.send(JSON.stringify(seller, null, 5));
    });
};

router.editByID = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var seller = new _sellers2.default({
        // sellerId: res.params.sellerId,
        name: req.body.name,
        email: req.body.email,
        password: _bcryptNodejs2.default.hashSync(req.body.password),
        description: req.body.description
    });
    var validate = seller.validateSync();

    if (validate != null) {
        res.json({ message: 'Seller validation failed', errmg: validate });
    } else {
        _sellers2.default.updateOne({ 'sellerId': req.params.sellerId }, { name: seller.name,
            email: seller.email,
            password: seller.password,
            description: seller.description
            //img_url:
        }, function (err, seller) {
            if (!seller) res.json({ message: 'Seller NOT Edited!', errmsg: err });else res.json({ message: 'Seller Successfully Edited!', data: seller });
        });
    }
};

module.exports = router;