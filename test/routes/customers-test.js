let datastore = require('../../models/customers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
let mongoose = require('mongoose');
let bcrypt = require('bcrypt-nodejs');
let jwt = require("jsonwebtoken");

let mongodbUri = 'mongodb://tester:tester100@ds143593.mlab.com:43593/testcosmeticweb';

chai.use(chaiHttp);
let _ = require('lodash' );
let password = bcrypt.hashSync(123123);
let token = jwt.sign({_id: datastore._id}, 'customerJwtKey');

mongoose.connect(mongodbUri,{useNewUrlParser:true},function(err){
    if(err)
        console.log('Connection Error:' + err);
    else
        console.log('Connection success!');
});
let db = mongoose.connection;

describe('Customers', function () {
    before(function (done) {
        try {
            let customer = new datastore(
                {
                    "customerId": "3001",
                    "name": "Test Customer_1",
                    "email": "TestCustomer_1@gmail.com",
                    "password": password,
                    "phoneNum": 123123,
                    "address": "My Home"
                }
            );
            customer.save(done);
            console.log('Customer insert success.');
        } catch (e) {
            console.log(e);
        }
    });

    describe('GET /customer/:customerId', () => {
        it('should return a special customer in a object', function (done) {
            chai.request(server).get('/customer/3001').set('x-auth-token',token).end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('customerId', '3001' );
                done();
            });
        });
        it('should return 401 status', function (done) {
            chai.request(server).get('/customer/3001').end(function (err, res) {
                expect(res).to.have.status(401);
                done();
            });
        });
        it('should return a error massage', function (done) {
            chai.request(server).get('/customer/300').set('x-auth-token',token).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Customer NOT Found!');
                done();
            });
        })
    });

    after(function(done){
        try{
            db.collection("customers").deleteMany({"customerId": { $in: ['3001'] }});
            done();
        }catch (e) {
            print(e);
        }
    });

});