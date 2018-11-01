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

    describe('Put /customer/:id/edit', () => {
        describe('Invalid edit', () => {
            it('should return a validation message', function (done) {
                let customer = {
                    "customerId": "3001",
                    "name": "Test Customer_1",
                    "email": "TestCustomer_1gmail.com",
                    "password": password,
                    "phoneNum": 123123,
                    "address": "My New Home"
                };
                chai.request(server).put('/customer/3001/edit').set('x-auth-token',token).send(customer).end(function (err, res) {
                    expect(res.body).to.have.property('message').equal('Customer validation failed');
                    done();
                });
            });
            it('should return a 401 status', function (done) {
                let customer = {
                    "customerId": "3001",
                    "name": "Test Customer_1",
                    "email": "TestCustomer_1@gmail.com",
                    "password": password,
                    "phoneNum": 123123,
                    "address": "My New Home"
                };
                chai.request(server).put('/customer/3001/edit').send(customer).end(function (err, res) {
                    expect(res).to.have.status(401);
                    done();
                });
            });
            afterEach(function (done) {
                chai.request(server).get('/customer/3001').set('x-auth-token',token).end(function (err, res) {
                    expect(res.body).to.have.property('address').equal('My Home');
                    done();
                });
            });
        });

        describe('Valid edit', () => {
            it('should return a message and update a customer', function (done) {
                let customer = {
                    "customerId": "3001",
                    "name": "Test Customer_1",
                    "email": "TestCustomer_1@gmail.com",
                    "password": password,
                    "phoneNum": 123123,
                    "address": "My New Home"
                };
                chai.request(server).put('/customer/3001/edit').set('x-auth-token',token).send(customer).end(function (err, res) {
                    expect(res.body).to.have.property('message').equal('Customer Successfully Edited!');
                    done();
                });
            });
            afterEach(function (done) {
                chai.request(server).get('/customer/3001').set('x-auth-token',token).end(function (err, res) {
                    expect(res.body).to.have.property('address').equal('My New Home');
                    done();
                });
            });
        });
    });

    describe('Post /customer/signUp', () => {
        describe('Invalid sign up', () => {
            let customers = [{
                "customerId": "3002",
                // "name": "Test Customer_2",
                "email": "TestCustomer_2@gmail.com",
                "password": "123123",
                "phoneNum": 123123,
                "address": "My Home"
            },{
                "customerId": "3002",
                "name": "Test Customer_1",
                "email": "TestCustomer_2@gmail.com",
                "password": "123123",
                "phoneNum": 123123,
                "address": "My Home"
            },{
                "customerId": "3002",
                "name": "Test Customer_2",
                // "email": "TestCustomer_2@gmail.com",
                "password": "123123",
                "phoneNum": 123123,
                "address": "My Home"
            },{
                "customerId": "3002",
                "name": "Test Customer_2",
                "email": "TestCustomer_1@gmail.com",
                "password": "123123",
                "phoneNum": 123123,
                "address": "My Home"
            },{
                "customerId": "3002",
                "name": "Test Customer_2",
                "email": "TestCustomer_2.com",
                "password": "123123",
                "phoneNum": 123123,
                "address": "My Home"
            }];
            describe('Name boundary test', () => {
                it('No Name - should return a sign up unsuccessful message', function (done) {
                    chai.request(server).post('/customer/signUp').send(customers[0]).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Customer NOT Sign Up!');
                        done();
                    });
                });
                it('Replicate Name - should return a sign up unsuccessful message', function (done) {
                    chai.request(server).post('/customer/signUp').send(customers[1]).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Customer NOT Sign Up!');
                        done();
                    });
                });
            });
            describe('Email boundary test', () => {
                it('No Email - should return a sign up unsuccessful message', function (done) {
                    chai.request(server).post('/customer/signUp').send(customers[2]).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Customer NOT Sign Up!');
                        done();
                    });
                });
                it('Replicate Email - should return a sign up unsuccessful message', function (done) {
                    chai.request(server).post('/customer/signUp').send(customers[3]).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Customer NOT Sign Up!');
                        done();
                    });
                });
                it('Wrong Format - should return a sign up unsuccessful message', function (done) {
                    chai.request(server).post('/customer/signUp').send(customers[4]).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Customer NOT Sign Up!');
                        done();
                    });
                });
            });
            afterEach(function (done) {
                chai.request(server).get('/customer/3002').set('x-auth-token',token).end(function (err, res) {
                    expect(res.body).to.have.property('message').equal('Customer NOT Found!');
                    done();
                });
            });
        });
        describe('Valid sign up', () => {
            it('should return a message and create a new customer', function (done) {
                let customer = {
                    "customerId": "3002",
                    "name": "Test Customer_2",
                    "email": "TestCustomer_2@gmail.com",
                    "password": "123123",
                    "phoneNum": 123123,
                    "address": "My Home"
                };
                chai.request(server).post('/customer/signUp').send(customer).end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('message').equal('Customer Successfully Sign Up');
                    done();
                });
            });
            afterEach(function (done) {
                chai.request(server).get('/customer/3002').set('x-auth-token',token).end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('object');
                    expect(res.body).to.have.property('customerId', '3002' );
                    done();
                });
            });
        });
    });

    after(function(done){
        try{
            db.collection("customers").deleteMany({"customerId": { $in: ['3001','3002'] }});
            mongoose.connection.close();
            done();
        }catch (e) {
            print(e);
        }
    });

});