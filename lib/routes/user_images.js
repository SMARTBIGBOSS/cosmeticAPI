'use strict';

var _express = require('express');

var _express2 = _interopRequireDefault(_express);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _multer = require('multer');

var _multer2 = _interopRequireDefault(_multer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//let path = require('path');
//let express = require('express');
var router = _express2.default.Router();
/*
let mongoose = require('mongoose');

let mongodbUri = 'mongodb://cosmeticdb:cosmeticdb100@ds157538.mlab.com:57538/cosmeticdb';

mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.get('/', function(req, res, next) {
    res.render('index', {page:'Home', menuId:'home'});
});
*/

function checkFileType(file, img) {
    var filetypes = /png/;
    var extname = filetypes.test(_path2.default.extname(file.originalname).toLowerCase());
    var mimetype = filetypes.test(file.mimeType);

    if (mimetype && extname) {
        return img(null, true);
    } else {
        img('Error: Only jpeg, jpg, png Images !');
    }
}

router.uploadImage = function (req, res) {
    var storage = _multer2.default.diskStorage({
        destination: function destination(req, file, logo) {
            logo(null, './userLogo');
        },
        filename: function filename(req, file, logo) {
            logo(null, req.params.id + '_' + Date.now() + _path2.default.extname(file.originalname));
        }
    });
    var upload = (0, _multer2.default)({
        storage: storage,
        limits: { fileSize: 1024 * 1024 }
        // fileFilter: function (req, file, logo) {
        //     checkFileType(file, logo);
        // }
    }).single('userLogo');

    upload(req, res, function (err) {
        if (err) {
            res.send(err);
            // res.render('uploadImage',{
            //     msg: err
            // });
        } else {
            // console.log(req.file);
            // console.log(path.extname(req.file.originalname));
            res.json({ message: 'Image Uploaded!', file: 'userLogo/' + req.file.filename });
            // res.render('uploadImage',{
            //     msg: 'File Uploaded',
            //     file: `userLogo/${req.file.filename}`
            // })
        }
    });
};

module.exports = router;