let Cosmetic = require('../models/cosmetics');
let express = require('express');
let router = express.Router();
let mongoose =require('mongoose');

let mongodbUri = 'mongodb://tester:tester100@ds143593.mlab.com:43593/testcosmeticweb';

mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.filterByBrand = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Cosmetic.find({'name': req.params.name,'brand': req.params.brand }, function (err,cosmetics) {
        if(err)
            res.send(err);
        else
            res.send(JSON.stringify(cosmetics,null,5));
    });
};

router.findByName = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Cosmetic.find({ 'name': req.params.name }, function (err,cosmetics) {
        if(err)
            res.send(err);
        else
            res.send(JSON.stringify(cosmetics,null,5));
    });
};

function escapeRegex(str){
    return str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g,'\\$&');
}

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    //console.log(req.query.name);
    if(req.query.name){
        const regex = new RegExp(escapeRegex(req.query.name), 'gi');
        Cosmetic.find({name: regex}, function (err, cosmetics) {
            if(err)
                res.send(err);
            else
                res.send(JSON.stringify(cosmetics,null,5));
        });
    }else{
        Cosmetic.find(function (err, cosmetics) {
            if(err)
                res.send(err);
            else
                res.send(JSON.stringify(cosmetics,null,5));
        });
    }
};

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Cosmetic.findById(req.params.id,function(err, cosmetic) {
        if (err)
            res.json({ message: 'Cosmetic NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(cosmetic,null,5));
    });
}

router.sortByLowPrice = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');

    Cosmetic.find(function (err, cosmetics) {
        if(err)
            res.send(err);
        else
            res.send(JSON.stringify(cosmetics,null,5));
    }).sort({price: 1});
};

router.sortByHighPrice = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');

    Cosmetic.find(function (err, cosmetics) {
        if(err)
            res.send(err);
        else
            res.send(JSON.stringify(cosmetics,null,5));
    }).sort({price: -1});
};

router.editByID = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let cosmetic = new Cosmetic({
        name: req.body.name,
        brand: req.body.brand,
        price: req.body.price,
        publisher: req.params.publisher,
        release_date: Date.now()
    });

    let validate = cosmetic.validateSync();

    if(validate != null){
        res.json({message: 'Cosmetic validation failed',errmg: validate});
    }else{
        Cosmetic.updateOne({ 'cosmeticId': req.params.cosmeticId },
            {
                name: cosmetic.name,
                brand: cosmetic.brand,
                price: cosmetic.price,
                publisher: cosmetic.publisher,
                release_date: cosmetic.release_date
            }, function (err, cosmetics) {
                if (!cosmetics)
                    res.json({message: 'Cosmetic NOT Found!', errmsg: err});
                else
                    res.json({message: 'Cosmetic Successfully Edited!', data: cosmetics});
            });
    }
};

router.removeCosmetic = (req, res) =>{
    Cosmetic.findOneAndRemove({publisher: req.params.publisher, cosmeticId: req.params.cosmeticId}, function (err) {
        if(err)
            res.json({ message: 'Cosmetic NOT DELETED!', errmsg : err } );
        else
            res.json({ message: 'Cosmetic Successfully Deleted!'});
    });
};

router.addCosmetic = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let cosmetic = new Cosmetic();
    cosmetic.cosmeticId = req.body.cosmeticId;
    cosmetic.name = req.body.name;
    cosmetic.brand = req.body.brand;
    cosmetic.price = req.body.price;
    cosmetic.publisher = req.params.publisher;
    cosmetic.release_date = Date.now();

    cosmetic.save(function (err) {
        if(err)
            res.json({ message: 'Cosmetic NOT Added!', errmsg : err });
        else
            res.json({ message: 'Cosmetic Successfully Added!', data: cosmetic });
    });
};

module.exports = router;
