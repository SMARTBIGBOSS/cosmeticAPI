let datastore = require('../../models/sellers');
let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../../bin/www');
let expect = chai.expect;

chai.use(chaiHttp);
let _ = require('lodash' );

chai.use(require('chai-things'));

describe('Sellers', function (){

    describe('POST /seller/signUp',  () => {
        it('should return the information of a seller and a message', function(done) {
            let seller = {
                name:"AnqiLi",
                email: "123456@qq.com",
                password: "123123",
                description: "test",
                register_date: Date.now(),
            };
            chai.request(server)
                .post('/seller/signUp')
                .send(seller)
                .end(function(err, res) {
                    expect(res).to.have.status(200);
                    expect(res.body).to.have.property('message').equal('seller Successfully Sign Up' );
                    done();
                });
        });
        after(function  (done) {
            chai.request(server)
                .get('/sellers')
                .end(function(err, res) {
                    let result = _.map(res.body, (seller) => {
                        return { name: seller.name,
                            email: seller.email };
                    }  );
                    expect(result).to.include( { name: 'AnqiLi', email: "123456@qq.com"  } );
                    done();
                });
        });
    });
}