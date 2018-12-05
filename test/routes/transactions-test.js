import chai from 'chai';
import chaiHttp from 'chai-http' ;
//import server from '../../bin/www';
let expect = chai.expect;
//import datastore from '../../models/transactions';
import _ from 'lodash';
import things from 'chai-things';
chai.use( things);
chai.use(chaiHttp);
/*
let datastore = require('../../models/transactions');
let seller = require('../../models/sellers');
let customer = require('../../models/customers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;
*/
import seller from '../../models/sellers';
import customer from '../../models/customers';

import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

let mongodbUri = 'mongodb://tester:tester100@ds143593.mlab.com:43593/testcosmeticweb';

//chai.use(chaiHttp);
//let _ = require('lodash' );
let tokenSeller = jwt.sign({_id: seller._id}, 'sellerJwtKey');
let tokenCustomer = jwt.sign({_id: customer._id}, 'customerJwtKey');

mongoose.connect(mongodbUri,{useNewUrlParser:true},function(err){
    if(err)
        console.log('Connection Error:' + err);
    else
        console.log('Connection success!');
});
let db = mongoose.connection;

let server = null ; // CHANGED
let datastore = null ; // CHANGED

describe('Transaction', function () {
    before(function (done) {
        delete require.cache[require.resolve('../../bin/www')];
        delete require.cache[require.resolve('../../models/transactions')];
        datastore = require('../../models/transactions');
        server = require('../../bin/www');
        try {
            let transaction = new datastore(
                {
                    'transactionId': '4001',
                    'cosmeId': '1000',
                    'buyerId': '3000',
                    'quantity': 10,
                    'shipping_address': 'Home',
                    'contact_Num': 666,
                    'status': 'unpaid'
                }
            );
            transaction.save(done);
            console.log('Transactions insert success.');
        } catch (e) {
            console.log(e);
        }
    });

    describe('Put /transaction/:id/order', () => {
        it('should change status to paid and return a message', function (done) {
            chai.request(server).put('/transaction/4001/order').set('x-auth-token', tokenCustomer).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Transaction Successfully Updated!');
                done();
            });
        });
        after(function (done) {
            chai.request(server).get('/transactions').end(function (err, res) {
                expect(res.body.length).equal(1);
                let result = _.map(res.body, (transaction) => {
                    return { status: transaction.status};
                });
                expect(result[0]).to.include({status: 'paid'});
                done();
            });
        });
    });
    describe('Put /transaction/:id/delivery', () => {
        it('should change status to delivery and return a message', function (done) {
            chai.request(server).put('/transaction/4001/delivery').set('x-auth-token', tokenSeller).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Transaction Successfully Updated!');
                done();
            });
        });
        after(function (done) {
            chai.request(server).get('/transactions').end(function (err, res) {
                expect(res.body.length).equal(1);
                let result = _.map(res.body, (transaction) => {
                    return { status: transaction.status};
                });
                expect(result[0]).to.include({status: 'delivering'});
                done();
            });
        });
    });
    describe('Put /transaction/:id/confirmReceipt', () => {
        it('should change status to finish and return a message', function (done) {
            chai.request(server).put('/transaction/4001/confirmReceipt').set('x-auth-token', tokenCustomer).end(function (err, res) {
                expect(res.body).to.have.property('message').equal('Transaction Successfully Updated!');
                done();
            });
        });
        after(function (done) {
            chai.request(server).get('/transactions').end(function (err, res) {
                expect(res.body.length).equal(1);
                let result = _.map(res.body, (transaction) => {
                    return { status: transaction.status};
                });
                expect(result[0]).to.include({status: 'finished'});
                done();
            });
        });
    });
    describe('Get /transactions/countSales', () => {
        it('should count total sales of a cosmetic', function(done){
            chai.request(server).get('/transactions/countSales').end(function (err, res) {
                let result = _.map(res.body, (sales) => {
                    return { _id: '1000',total_sales: sales.total_sales};
                });
                expect(result[0]).to.include({_id: '1000',total_sales: 10});
                done();
            });
        });
    });

    after(function(done){
        try{
            db.collection('transactions').deleteMany({'transactionId': { $in: ['4001'] }});
            mongoose.connection.close();
            done();
        }catch (e) {
            console.log(e);
        }
    });
});