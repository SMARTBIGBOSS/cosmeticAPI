let Customer = require('../models/customers');
let bcrypt = require('bcrypt-nodejs');
let express = require('express');
let router = express.Router();
let mongoose = require('mongoose');

let mongodbUri = 'mongodb://tester:tester100@ds143593.mlab.com:43593/testcosmeticweb';

mongoose.connect(mongodbUri);

let db = mongoose.connection;

db.on('error', function (err) {
    console.log('Unable to Connect to [ ' + db.name + ' ]', err);
});

db.once('open', function () {
    console.log('Successfully Connected to [ ' + db.name + ' ]');
});

router.login = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({email: req.body.email},function (err, customer) {
        if(!customer)
            res.json({ message: 'Customer NOT Login!', errmsg : err });
        else{
            if(bcrypt.compareSync(req.body.password,customer.password)){
                let token = customer.generateAuthToken();
                res.header('x-auth-token',token);
                res.json({ message: 'Customer Successfully Login', data: customer });
            }
            else
                res.json({ message: 'Email Address or Password Incorrect!', errmsg : err });
        }
    });
};

router.signUp = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let customer = new Customer();
    customer.customerId = req.body.customerId;
    customer.name = req.body.name;
    customer.email = req.body.email;
    customer.phoneNum = req.body.phoneNum;
    customer.address = req.body.address;
    customer.register_date = Date.now();
    customer.password = bcrypt.hashSync(req.body.password);

    customer.save(function (err){
        if(err)
            res.json({ message: 'Customer NOT Sign Up!', errmsg : err });
        else
            res.json({ message: 'Customer Successfully Sign Up', data: customer });
    });
};

router.editByID = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    let customer = new Customer({
        name: req.body.name,
        email:  req.body.email,
        phoneNum: req.body.phoneNum,
        address: req.body.address,
        password: bcrypt.hashSync(req.body.password)
    });
    let validate = customer.validateSync();

    if(validate != null){
        res.json({message: 'Customer validation failed',errmg: validate});
    }else{
        Customer.updateOne({'customerId': req.params.customerId},
            {   name: customer.name,
                email: customer.email,
                password: customer.password,
                phoneNum: customer.phoneNum,
                address: customer.address
                //img_url:
            },
            function(err,customer) {
                if(err)
                    res.json({ message: 'Customer NOT Edited!', errmsg : err });
                else
                    res.json({ message: 'Customer Successfully Edited!', data: customer });
            });
    }
};

router.findOne = (req, res) => {
    res.setHeader('Content-Type', 'application/json');

    Customer.findOne({customerId:req.params.customerId},function(err, customer) {
        if (!customer)
            res.json({ message: 'Customer NOT Found!', errmsg : err } );
        else
            res.send(JSON.stringify(customer,null,5));
    });
};

module.exports = router;
