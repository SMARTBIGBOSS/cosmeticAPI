import chai from 'chai';
import chaiHttp from 'chai-http' ;
//import server from '../../bin/www';
let expect = chai.expect;
//import datastore from '../../models/user_images';
import _ from 'lodash';
import things from 'chai-things'
chai.use( things);
chai.use(chaiHttp);
/*
let datastore = require('../../models/user_images');
let seller = require('../../models/sellers');
let customer = require('../../models/customers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
*/
import seller from '../../models/sellers';
import customer from '../../models/customers';
import jwt from 'jsonwebtoken';
import fs from 'fs';

//chai.use(chaiHttp);
let tokenSeller = jwt.sign({_id: seller._id}, 'sellerJwtKey');
let tokenCustomer = jwt.sign({_id: customer._id}, 'customerJwtKey');
let path;

let server = null ; // CHANGED
let datastore = null ; // CHANGED

describe('user_images', function () {
    before(function () {
		try {
			delete require.cache[require.resolve('../../bin/www')];
			delete require.cache[require.resolve('../../models/user_images')];
			datastore = require('../../models/user_images');
			server = require('../../bin/www');
		} catch (e) {
            console.log(e);
        }
	});
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
	});
	describe('Post /customer/:id/uploadLogo', () => {
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