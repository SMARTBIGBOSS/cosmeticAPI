import chai from 'chai';
import chaiHttp from 'chai-http' ;
//import server from '../../bin/www';
let expect = chai.expect;
//import datastore from '../../models/donations';
import _ from 'lodash';
import things from 'chai-things';
chai.use( things);
chai.use(chaiHttp);
/*
let datastore = require('../../models/cosmetics');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
*/
import mongoose from 'mongoose';
import seller from '../../models/sellers';
import jwt from 'jsonwebtoken';

let mongodbUri = 'mongodb://tester:tester100@ds143593.mlab.com:43593/testcosmeticweb';

//chai.use(chaiHttp);
//let _ = require('lodash' );
let token = jwt.sign({_id: seller._id}, 'sellerJwtKey');


mongoose.connect(mongodbUri,{useNewUrlParser:true},function(err){
    if(err)
        console.log('Connection Error:' + err);
    else
        console.log('Connection success!');
});
let db = mongoose.connection;

let server = null ; // CHANGED
let datastore = null ; // CHANGED

describe('Cosmetics', function () {
    before(function (done) {
        delete require.cache[require.resolve('../../bin/www')];
        delete require.cache[require.resolve('../../models/cosmetics')];
        datastore = require('../../models/cosmetics');
        server = require('../../bin/www');
        try {
            let cosmetic = new datastore(
                {
                    'cosmeticId': '1001',
                    'name': 'Test Cosmetic_1',
                    'brand': 'Test Brand',
                    'price': 5.00,
                    'publisher': '2000',
                    'release_date': Date.now()
                }
            );
            cosmetic.save(done);
            console.log('Cosmetic insert success.');
        } catch (e) {
            console.log(e);
        }
    });

    describe('Get /cosmetics', () => {
        it('should return all cosmetics', function (done) {
            chai.request(server).get('/cosmetics').end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                let result = _.map(res.body, (cosmetic) => {
                    return { cosmeticId: cosmetic.cosmeticId};
                });
                expect(result[0]).to.include({cosmeticId: '1000'});
                expect(result[1]).to.include({cosmeticId: '1001'});
                done();
            });
        });
    });

    describe('Get /cosmetics', () => {
        it('should return all cosmetics using fuzzy search', function (done) {
            chai.request(server).get('/cosmetics?name=Test').end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                let result = _.map(res.body, (cosmetic) => {
                    return { cosmeticId: cosmetic.cosmeticId};
                });
                expect(result[0]).to.include({cosmeticId: '1001'});
                done();
            });
        });
    });

    describe('Get /cosmetics/:name', () => {
        it('should return special cosmetics by cosmetic name', function (done) {
            chai.request(server).get('/cosmetics/Test Cosmetic_1').end(function (err, res) {
                expect(res).to.have.status(200);
                let result = _.map(res.body, (cosmetic) => {
                    return { cosmeticId: cosmetic.cosmeticId};
                });
                expect(result[0]).to.include({cosmeticId: '1001'});
                done();
            });
        });
    });

    describe('Get /cosmetics/:name/:brand', () => {
        it('should return special cosmetics by brand', function (done) {
            chai.request(server).get('/cosmetics/Test Cosmetic_1/Test Brand').end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                let result = _.map(res.body, (cosmetic) => {
                    return { cosmeticId: cosmetic.cosmeticId};
                });
                expect(result[0]).to.include({cosmeticId: '1001'});
                done();
            });
        });
    });

    describe('Get /cosmetics/sortByLowPrice', () => {
        it('should return cosmetics sorted by low price', function (done) {
            chai.request(server).get('/cosmetics/sortByLowPrice').end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                let result = _.map(res.body, (cosmetic) => {
                    return { cosmeticId: cosmetic.cosmeticId};
                });
                expect(result[0]).to.include({cosmeticId: '1001'});
                expect(result[1]).to.include({cosmeticId: '1000'});
                done();
            });
        });
    });

    describe('Get /cosmetics/sortByHighPrice', () => {
        it('should return cosmetics sorted by high price', function (done) {
            chai.request(server).get('/cosmetics/sortByHighPrice').end(function (err, res) {
                expect(res).to.have.status(200);
                expect(res.body).to.be.a('array');
                let result = _.map(res.body, (cosmetic) => {
                    return { cosmeticId: cosmetic.cosmeticId};
                });
                expect(result[0]).to.include({cosmeticId: '1000'});
                expect(result[1]).to.include({cosmeticId: '1001'});
                done();
            });
        });
    });

    describe('Put /cosmetics/:publisher/:id/edit', () => {
        describe('Invalid edit', () => {
            describe('Boundary test', () => {
                it('No name - should return a validation message', function (done) {
                    let cosmetic = {
                        // "name": "Test Cosmetic_1",
                        'brand': 'Edit Brand',
                        'price': 5.00,
                        'publisher': '2000',
                    };
                    chai.request(server).put('/cosmetics/2000/1001/edit').set('x-auth-token',token).send(cosmetic).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Cosmetic validation failed');
                        done();
                    });
                });
                it('No brand - should return a validation message', function (done) {
                    let cosmetic = {
                        'name': 'Test Cosmetic_1',
                        // "brand": "Edit Brand",
                        'price': 5.00,
                        'publisher': '2000',
                    };
                    chai.request(server).put('/cosmetics/2000/1001/edit').set('x-auth-token',token).send(cosmetic).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Cosmetic validation failed');
                        done();
                    });
                });
                it('No price - should return a validation message', function (done) {
                    let cosmetic = {
                        'name': 'Test Cosmetic_1',
                        'brand': 'Edit Brand',
                        // "price": 5.00,
                        'publisher': '2000',
                    };
                    chai.request(server).put('/cosmetics/2000/1001/edit').set('x-auth-token',token).send(cosmetic).end(function (err, res) {
                        expect(res.body).to.have.property('message').equal('Cosmetic validation failed');
                        done();
                    });
                });
            });
            describe('No token', () => {
                it('should return a 401 status', function (done) {
                    let cosmetic = {
                        'name': 'Test Cosmetic_1',
                        'brand': 'Edit Brand',
                        'price': 5.00,
                        'publisher': '2000',
                    };
                    chai.request(server).put('/cosmetics/2000/1001/edit').send(cosmetic).end(function (err, res) {
                        expect(res).to.have.status(401);
                        done();
                    });
                });
            });
            afterEach(function (done) {
                chai.request(server).get('/cosmetics').end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    let result = _.map(res.body, (cosmetic) => {
                        return { brand: cosmetic.brand};
                    });
                    expect(result[1]).to.include({brand: 'Test Brand'});
                    done();
                });
            });
        });
        describe('Valid edit', () => {
            it('should return a edit successful message', function (done) {
                let cosmetic = {
                    'name': 'Test Cosmetic_1',
                    'brand': 'Edit Brand',
                    'price': 5.00,
                    'publisher': '2000',
                };
                chai.request(server).put('/cosmetics/2000/1001/edit').set('x-auth-token',token).send(cosmetic).end(function (err, res) {
                    expect(res.body).to.have.property('message').equal('Cosmetic Successfully Edited!');
                    done();
                });
            });
            afterEach(function (done) {
                chai.request(server).get('/cosmetics').end(function (err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.be.a('array');
                    let result = _.map(res.body, (cosmetic) => {
                        return { brand: cosmetic.brand};
                    });
                    expect(result[1]).to.include({brand: 'Edit Brand'});
                    done();
                });
            });
        });
    });

    describe('Post /cosmetics/:publisher/add', () => {
        it('should add a cosmetic and return a message', function (done) {
            let cosmetic = {
                'cosmeticId': '1002',
                'name': 'Test Cosmetic_2',
                'brand': 'Test Brand',
                'price': 1.00,
                'publisher': '2000',
            };
            chai.request(server).post('/cosmetics/2000/add').set('x-auth-token',token).send(cosmetic).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Cosmetic Successfully Added!');
                expect(res.body).to.have.property('data').property('name').equal('Test Cosmetic_2');
                done();
            });
        });
        it('should return 401 status', function (done) {
            let cosmetic = {
                'cosmeticId': '1002',
                'name': 'Test Cosmetic_2',
                'brand': 'Test Brand',
                'price': 1.00,
                'publisher': '2000',
            };
            chai.request(server).post('/cosmetics/2000/add').send(cosmetic).end(function (err, res) {
                expect(res).to.have.status(401);
                done();
            });
        });
    });

    describe('Delete /cosmetics/:publisher/:cosmeticId/delete', function () {
        it('should remove a cosmetic and return a message', function (done) {
            chai.request(server).delete('/cosmetics/2000/1002/delete').set('x-auth-token', token).end(function(err, res){
                expect(res.body).to.have.property('message').equal('Cosmetic Successfully Deleted!');
                done();
            });
        });
        afterEach(function (done) {
            chai.request(server).get('/cosmetics').end(function (err, res) {
                expect(res.body.length).equal(2);
                let result = _.map(res.body, (cosmetic) => {
                    return { cosmeticId: cosmetic.cosmeticId};
                });
                expect(result[0]).to.include({cosmeticId: '1000'});
                expect(result[1]).to.include({cosmeticId: '1001'});
                done();
            });
        });
    });

    after(function(done){
        try{
            db.collection('cosmetics').deleteMany({'cosmeticId': { $in: ['1001'] }});
            mongoose.connection.close();
            done();
        }catch (e) {
            console.log(e);
        }
    });
});