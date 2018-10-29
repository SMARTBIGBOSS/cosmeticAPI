let datastore = require('../../models/sellers');
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
let password = bcrypt.hashSync(123456);
let token = jwt.sign({_id: datastore._id}, 'sellerJwtKey');

let seller = [
    {
        "sellerId": "2000",
        "name": "Test Seller_1",
        "email": "TestSeller_1@gmail.com",
        "password": password,
        "description": "Testing seller One"
    },
    {
        "sellerId": "2001",
        "name": "Test Seller_2",
        "email": "TestSeller_2@gmail.com",
        "password": password,
        "description": "Testing seller two"
    }
];

let db = mongoose.connection;

describe('Sellers', function (){
    before(function (done) {
        mongoose.connect(mongodbUri,{useNewUrlParser:true},function(err){
            if(err)
                console.log('Connection Error:' + err);
            else
                console.log('Connection success!');
        });
        try{
            db.collection("sellers").insertMany(seller);
            console.log('Seller insert many success.');
        }catch (e) {
            print (e);
        }
        done();
    });

    describe('GET /sellers', () => {
        it('should return all the sellers in an array', function (done) {
            chai.request(server).get('/sellers').end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                expect(res.body.length).to.equal(2);
                let result = _.map(res.body, (seller) => {
                    return { sellerId: seller.sellerId}
                });
                // console.log(result);
                expect(res.body).to.have.property('[0].sellerId', '2000' );
                // expect(result).to.include({ sellerId: '2001' });
                done();
            });
        });
    });

    describe('GET /seller/:sellerId', () => {
        it('should return a special seller in a object', function (done) {
            chai.request(server).get('/seller/2000').set('x-auth-token',token).end(function (err, res) {
                expect(res).to.have.status(200);
                // console.log(res.body);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('sellerId', '2000' );
                done();
            });
        });
        it('should return a error massage', function (done) {
            chai.request(server).get('/seller/2000').end(function (err, res) {
                expect(res).to.have.status(401);
                done();
            });
        });
        it('should return a error massage', function (done) {
            chai.request(server).get('/seller/200').set('x-auth-token',token).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Seller NOT Found!');
                done();
            });
        })
    });

    describe('Post /seller/login', () => {
        it('should return a message and create a new seller', function (done) {
            let seller = {
                "email": "TestSeller_1@gmail.com",
                "password": "123456"
            };
            chai.request(server).post('/seller/login').send(seller).end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('Seller Successfully Login');
                done();
            });
        });
        it('should return an input incorrect message', function (done) {
            let seller = {
                "email": "TestSeller_1@gmail.com",
                "password": "123"
            };
            chai.request(server).post('/seller/login').send(seller).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Email Address or Password Incorrect!');
                done();
            });
        });
        it('should return a login unsuccessful message', function (done) {
            let seller = {
                "email": "Seller_1@gmail.com",
                "password": "123456"
            };
            chai.request(server).post('/seller/login').send(seller).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Seller NOT Login!');
                done();
            });
        });
    });

    describe('Post /seller/signUp', () => {
        it('should return a message and create a new seller', function (done) {
            let seller = {
                "sellerId": "2002",
                "name": "New Seller",
                "email": "NewSeller@gmail.com",
                "password": "123456",
                "description": "Create a new seller"
            };
            chai.request(server).post('/seller/signUp').send(seller).end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('seller Successfully Sign Up');
                done();
            });
        });
        it('should return a sign up unsuccessful message', function (done) {
            let seller = {
                "sellerId": "2002",
                "name": "New Seller",
                "email": "NewSeller.com",
                "password": "123456",
                "description": "Create a new seller"
            };
            chai.request(server).post('/seller/signUp').send(seller).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Seller NOT Sign Up!');
                done();
            });
        });
    });

    describe('Put /seller/:sellerId/edit', () => {
        it('should return a message and update a seller', function (done) {
            let seller = {
                "name": "New Seller",
                "email": "NewSeller@gmail.com",
                "password": "123456",
                "description": "Edit a new seller"
            };
            chai.request(server).put('/seller/2002/edit').set('x-auth-token',token).send(seller).end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('object');
                expect(res.body).to.have.property('message').equal('Seller Successfully Edited!');
                done();
            });
        });
        it('should return a validation message', function (done) {
            let seller = {
                "name": "New Seller",
                "email": "NewSeller.com",
                "password": "12356",
                "description": "Edit a new seller"
            };
            chai.request(server).put('/seller/2002/edit').set('x-auth-token',token).send(seller).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Seller validation failed');
                done();
            });
        });
        it('should return a message and update a seller', function (done) {
            let seller = {
                "name": "New Seller",
                "email": "NewSeller@gmail.com",
                "password": "123456",
                "description": "Edit a new seller"
            };
            chai.request(server).put('/seller/2002/edit').send(seller).end(function (err, res) {
                expect(res).to.have.status(401);
                done();
            });
        });
    });
});