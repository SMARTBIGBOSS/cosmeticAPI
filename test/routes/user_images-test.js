let datastore = require('../../models/user_images');
let seller = require('../../models/sellers');
let customer = require('../../models/customers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let jwt = require("jsonwebtoken");
let fs = require('fs');

chai.use(chaiHttp);
let tokenSeller = jwt.sign({_id: seller._id}, 'sellerJwtKey');
let tokenCustomer = jwt.sign({_id: customer._id}, 'customerJwtKey');
let path;

describe('user_images', function () {
    describe('Post /seller/:id/uploadLogo', () => {
        it('should upload a seller and return a massage', function (done) {
            chai.request(server).post('/seller/2000/uploadLogo').set('x-auth-token',tokenSeller)
                .set('Content-Type', "multipart/form-data")
                .attach("userLogo","../cosmeticweb/test/image/Stitch.jpg")
                .end(function (err, res) {
                    // console.log(res.body);
                    path = res.body.file;
                    expect(res.body).to.have.property('message').equal('Image Uploaded!');
                    done();
                });
        });
        it('should upload a customer and return a massage', function (done) {
            chai.request(server).post('/customer/3000/uploadLogo').set('x-auth-token',tokenCustomer)
                .set('Content-Type', "multipart/form-data")
                .attach("userLogo","../cosmeticweb/test/image/Stitch.jpg")
                .end(function (err, res) {
                    // console.log(res);
                    path = res.body.file;
                    expect(res.body).to.have.property('message').equal('Image Uploaded!');
                    done();
                });
        });
        after(function (done) {
            fs.readFile(path,function (err) {
                if(err)
                    console.log(err);
                else{
                    console.log('Image Exist');
                    done();
                }
            });
        });
    });
    after(function (done) {
        fs.unlink(path);
        done();
    });
});