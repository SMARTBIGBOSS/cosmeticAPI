'use strict';

var _transactions = require('../models/transactions');

var _transactions2 = _interopRequireDefault(_transactions);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _cosmetics = require('../models/cosmetics');

var _cosmetics2 = _interopRequireDefault(_cosmetics);

var _customers = require('../models/customers');

var _customers2 = _interopRequireDefault(_customers);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
//let Transaction = require('../models/transactions');

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

router.add = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var transaction = new _transactions2.default();
    transaction.transactionId = req.body.transactionId;
    transaction.cosmeId = req.params.cosmeId;
    transaction.buyerId = req.params.buyerId;
    transaction.quantity = req.body.quantity;
    transaction.shipping_address = req.body.shipping_address;
    transaction.contact_Num = req.body.contact_Num;
    transaction.last_date = Date.now();
    transaction.status = 'unpaid';

    transaction.save(function (err) {
        if (err) res.json({ message: 'Transaction NOT Added!', errmsg: err });else res.json({ message: 'Transaction Successfully Added!', data: transaction });
    });
};

router.remove = function (req, res) {

    _transactions2.default.findOneAndRemove({ buyerId: req.params.buyerId, _id: req.params.id, status: 'unpaid' }, function (err) {
        if (err) res.json({ message: 'Cosmetic NOT DELETED!', errmsg: err });else res.json({ message: 'Cosmetic Successfully Deleted!' });
    });
};

router.edit = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _transactions2.default.findOne({ _id: req.params.id }, function (err, transaction) {
        if (err) res.json({ message: 'Transaction NOT Found!', errmsg: err });else if (transaction.status != 'unpaid') res.json({ message: 'Transaction Cannot Edit!', errmsg: err });else {
            _transactions2.default.update({ '_id': req.params.id }, { buyerId: req.params.buyerId,
                quantity: req.body.quantity,
                contact_Num: req.body.contact_Num,
                shipping_address: req.body.shipping_address,
                last_date: Date.now()
            }, function (err) {
                if (err) res.json({ message: 'Transaction NOT Edited!', errmsg: err });else res.json({ message: 'Transaction Successfully Edited!', data: transaction });
            });
        }
    });
};

router.order = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _transactions2.default.findOne({ transactionId: req.params.id }, function (err, transaction) {
        if (err) res.json({ message: 'Transaction NOT Found!', errmsg: err });else if (transaction.status != 'unpaid') res.json({ message: 'Transaction Already Ordered!', errmsg: err });else {
            _transactions2.default.update({ 'transactionId': req.params.id }, {
                last_date: Date.now(),
                status: 'paid'
            }, function (err, transaction) {
                if (err) res.json({ message: 'Transaction NOT Found!', errmsg: err });else res.json({ message: 'Transaction Successfully Updated!', data: transaction });
            });
        }
    });
};

router.delivery = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _transactions2.default.findOne({ transactionId: req.params.id }, function (err, transaction) {
        if (err) res.json({ message: 'Transaction NOT Found!', errmsg: err });else if (transaction.status == 'paid') {
            _transactions2.default.update({ 'transactionId': req.params.id }, {
                last_date: Date.now(),
                status: 'delivering'
            }, function (err, transaction) {
                if (err) res.json({ message: 'Transaction NOT Found!', errmsg: err });else res.json({ message: 'Transaction Successfully Updated!', data: transaction });
            });
        } else res.json({ message: 'Transaction Cannot Edit!', errmsg: err });
    });
};

router.ConfirmReceipt = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _transactions2.default.findOne({ transactionId: req.params.id }, function (err, transaction) {
        if (err) res.json({ message: 'Transaction NOT Found!', errmsg: err });else if (transaction.status == 'delivering') {
            _transactions2.default.update({ 'transactionId': req.params.id }, {
                last_date: Date.now(),
                status: 'finished'
            }, function (err, transaction) {
                if (err) res.json({ message: 'Transaction NOT Found!', errmsg: err });else res.json({ message: 'Transaction Successfully Updated!', data: transaction });
            });
        } else res.json({ message: 'Transaction Cannot Edit!', errmsg: err });
    });
};

router.findByBuyerId = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var opts = [{ path: 'cosmeId', model: _cosmetics2.default, select: { name: 1, price: 1 } }];

    _transactions2.default.find().populate(opts).exec({ 'buyerId': req.params.buyerId }, function (err, transaction) {
        if (err) res.send(err);else res.send(JSON.stringify(transaction, null, 5));
    });
};

router.findAll = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var opts = [
    // {path: 'cosmeId', model: Cosmetic, select: {name: 1, price: 1}},
    // {path: 'buyerId', model: Customer, select: {name: 1}}
        { $lookup: { from: 'cosmetics', localField: 'cosmeId', foreignField: 'cosmeticId', as: 'cosmetic_info' } }];
    _transactions2.default.aggregate(opts).exec(function (err, transactions) {

        // Transaction.find().populate(opts).exec(function (err, transactions) {
        if (err) res.send(err);else res.send(JSON.stringify(transactions, null, 5));
    });
};

router.countSales = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var rel = [{ path: 'cosmeId', model: _cosmetics2.default, select: { name: 1, publisher: 1 } }];
    var opts = [{ $match: { status: 'finished' } }, { $group: { _id: '$cosmeId', total_sales: { $sum: '$quantity' } } }, { $lookup: { from: 'cosmetics', localField: '_id', foreignField: 'cosmeticId', as: 'cosmetic_info' } }];

    _transactions2.default.aggregate(opts).exec(function (err, transactions) {
        if (err) res.send(err);else {
            // Cosmetic.populate(transactions, rel, function (err, result) {
            //     res.send(JSON.stringify(result, null, 5));
            // });
            res.send(JSON.stringify(transactions, null, 5));
        }
    });
};

module.exports = router;