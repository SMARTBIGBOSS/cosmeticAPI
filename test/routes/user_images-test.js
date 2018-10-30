let datastore = require('../../models/user_images');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let jwt = require("jsonwebtoken");

chai.use(chaiHttp);
let token = jwt.sign({_id: datastore._id}, 'sellerJwtKey');

describe('user_images', function () {
    describe('Post /customer/:id/uploadLogo', function (done) {
        chai.request(server).post('/customer/:id/uploadLogo').end(function (err, res) {

        }
    });
});