'use strict';

var _cosmetics = require('../models/cosmetics');

var _cosmetics2 = _interopRequireDefault(_cosmetics);

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var router = _express2.default.Router();
//let Cosmetic = require('../models/cosmetics');
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

router.filterByBrand = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _cosmetics2.default.find({ 'name': req.params.name, 'brand': req.params.brand }, function (err, cosmetics) {
        if (err) res.send(err);else res.send(JSON.stringify(cosmetics, null, 5));
    });
};

router.findByName = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _cosmetics2.default.find({ 'name': req.params.name }, function (err, cosmetics) {
        if (err) res.send(err);else res.send(JSON.stringify(cosmetics, null, 5));
    });
};

function escapeRegex(str) {
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
}

router.findAll = function (req, res) {
    res.setHeader('Content-Type', 'application/json');
    //console.log(req.query.name);
    if (req.query.name) {
        var regex = new RegExp(escapeRegex(req.query.name), 'gi');
        _cosmetics2.default.find({ name: regex }, function (err, cosmetics) {
            if (err) res.send(err);else res.send(JSON.stringify(cosmetics, null, 5));
        });
    } else {
        _cosmetics2.default.find(function (err, cosmetics) {
            if (err) res.send(err);else res.send(JSON.stringify(cosmetics, null, 5));
        });
    }
};

router.sortByLowPrice = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _cosmetics2.default.find(function (err, cosmetics) {
        if (err) res.send(err);else res.send(JSON.stringify(cosmetics, null, 5));
    }).sort({ price: 1 });
};

router.sortByHighPrice = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    _cosmetics2.default.find(function (err, cosmetics) {
        if (err) res.send(err);else res.send(JSON.stringify(cosmetics, null, 5));
    }).sort({ price: -1 });
};

router.editByID = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var cosmetic = new _cosmetics2.default({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        publisher: req.params.publisher,
        release_date: Date.now()
    });

    var validate = cosmetic.validateSync();

    if (validate != null) {
        res.json({ message: 'Cosmetic validation failed', errmg: validate });
    } else {
        _cosmetics2.default.updateOne({ 'cosmeticId': req.params.cosmeticId }, {
            name: cosmetic.name,
            brand: cosmetic.brand,
            price: cosmetic.price,
            publisher: cosmetic.publisher,
            release_date: cosmetic.release_date
        }, function (err, cosmetics) {
            if (!cosmetics) res.json({ message: 'Cosmetic NOT Found!', errmsg: err });else res.json({ message: 'Cosmetic Successfully Edited!', data: cosmetics });
        });
    }
};

router.removeCosmetic = function (req, res) {
    _cosmetics2.default.findOneAndRemove({ publisher: req.params.publisher, cosmeticId: req.params.cosmeticId }, function (err) {
        if (err) res.json({ message: 'Cosmetic NOT DELETED!', errmsg: err });else res.json({ message: 'Cosmetic Successfully Deleted!' });
    });
};

router.addCosmetic = function (req, res) {
    res.setHeader('Content-Type', 'application/json');

    var cosmetic = new _cosmetics2.default();
    cosmetic.cosmeticId = req.body.cosmeticId;
    cosmetic.name = req.body.name;
    cosmetic.brand = req.body.brand;
    cosmetic.price = req.body.price;
    cosmetic.publisher = req.params.publisher;
    cosmetic.release_date = Date.now();

    cosmetic.save(function (err) {
        if (err) res.json({ message: 'Cosmetic NOT Added!', errmsg: err });else res.json({ message: 'Cosmetic Successfully Added!', data: cosmetic });
    });
};

module.exports = router;