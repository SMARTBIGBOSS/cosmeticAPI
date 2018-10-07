let customers = require('../models/customers');
let express = require('express');
let router = express.Router();

function isEmail(str) {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}

function customerIsExist(array,email){
    let result = array.filter(function(obj){return obj.email == email});
    return result ? result : false;
}

function loginByValue(array,email,password) {
    let result = array.filter(function(obj){
        return ((obj.email == email) && (obj.password == password)) });
    return result ? result[0] : null;
}

function getByID(array, id){
    let result = array.filter(function(obj){ return obj.id == id});
    return result ? result[0] : null;
}

router.login = (req, res) => {
    let customer = loginByValue(customers,req.body.email,req.body.password);

    if(customer != null)
        res.send({status : 200, message:'Login successful'});
    else
        res.send({message: 'Email address or password incorrect!'});
}

router.signUp = (req, res) => {
    let id = Math.floor((Math.random() * 10000) +1 );
    let currentSize = customers.length;

    if(req.body.email == "")
        res.send({message: 'Email Cannot be NUll!'});
    else if(!isEmail(req.body.email))
        res.send({message: 'Incorrect Email Format!'});
    else{
        if(customerIsExist(customers,req.body.email) == false){
            customers.push({"id": id, "name" : req.body.name, "email" : req.body.email, "password": req.body.password,
                "phoneNum" : req.body.phoneNum, "address": req.body.address});
            if((currentSize+1) == customers.length)
                res.json({status : 200, message: "Customer Sign Up Successful"});
            else
                res.json({message: "Customer Not Sign Up!"});
        }else
            res.send({message: 'This Email is used!'})
    }
}

router.editByID = (req, res) => {
    let customer = getByID(customers,req.params.id);
    let index = customers.indexOf(customer);

    if(index != -1){
        customers[index] = {"id": req.params.id, "name" : req.body.name,
            "email" : req.body.email, "password": req.body.password,
            "phoneNum" : req.body.phoneNum, "address": req.body.address};
        res.json({status : 200, message : "Edit Customer Successful"});
    }else
        res.json({message: "Customer Not Found - Edit Customer Not Successful!"});
}

router.findOne = (req, res) => {
    let customer = getByID(customers,req.params.id);

    if(customer != null)
        res.send(JSON.stringify(customer,null,5));
    else
        res.send({message: 'Customer Not Found!'});
}

module.exports = router;