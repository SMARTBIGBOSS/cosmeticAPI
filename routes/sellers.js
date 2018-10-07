let sellers = require('../models/sellers');
let express = require('express');
let router = express.Router();

function sellerIsExist(array,num){
    let result = array.filter(function(obj){return obj.IDCardNum == num});
    return result ? result : false;
}

function isEmail(str) {
    let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/;
    return reg.test(str);
}

function loginByValue(array, email, password){
    let result = array.filter(function(obj){return (obj.email == email) && (obj.password == password)});
    return result ? result : false;
}

function getByID(array, id){
    let result = array.filter(function(obj){return obj.id == id});
    return result ? result[0] : null;
}

router.register = (req, res) => {
    let id = Math.floor(Math.random() * 10000 + 1);
    let currentSize = sellers.length;

    if(req.body.name == "")
        res.send({message: 'Seller name Cannot be NUll!'});
    else if(req.body.email == null)
        res.send({message: 'Email Cannot be NUll!'});
    else if(!isEmail(req.body.email))
        res.send({message: 'Incorrect Email Format!'});
    else if(sellerIsExist(sellers, req.body.email) != false)
        res.json({message: "Seller Already Sign Up!"});
    else{
        sellers.push({"id": id, "name": req.body.name, "email": req.body.email, "password": req.body.password, "description": req.body.description});
        if((currentSize + 1) == sellers.length)
            res.json({status : 200, message: "Seller Sign Up Successful"});
        else
            res.json({message: "Seller Not Sign Up!"});
    }
}

router.login = (req, res) => {
    let seller = loginByValue(sellers, req.body.email, req.body.password);

    if(seller == false)
        res.json({message: "Email address or password incorrect!"});
    else
        res.json({status : 200, message: "Seller Login Successful"});
}

router.findOne = (req, res) => {
    let seller = getByID(sellers, req.params.id);
    if(seller != null){
        res.send(JSON.stringify(seller,null,5));
    }else
        res.send({message: 'Seller Not Found!'});
}

router.editByID = (req, res) => {
    let seller = getByID(sellers, req.params.id);
    let index = sellers.indexOf(seller);

    if(index != -1){
        sellers[index] = {"id": req.params.id, "name": req.body.name, "email": req.body.email, "password": req.body.password, "description": req.body.description};
        res.json({status : 200, message : "Edit Seller Successful"});
    }else
        res.json({message: "Seller Not Found - Edit Seller Not Successful!"});
}

module.exports = router;