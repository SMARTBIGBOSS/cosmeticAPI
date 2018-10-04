let cosmetics = require('../models/cosmetics');
let express = require('express');
let router = express.Router();

function getByBrand(array, brand){
    let result = array.filter(function(obj){return obj.brand == brand;});
    return result ? result : null;
}

function getByName(array,name){
    let result = array.filter(function(obj){return obj.name == name;});
    return result ? result : null;
}

function getIndexByID(array, id){
    let result = array.filter(function(obj){return obj.id == id});
    return result ? result[0] : null;
}

function sortByPrice(array,string){
    let result = array;
    if(string == "sortByLowPrice"){
        for(let i = 1; i < result.length; i++){
            for(let j = 0; j < i; j++){
                if(result[j].price > result[i].price) {
                    let temp = result[i];
                    result[i] = result[j];
                    result[j] = temp;
                }
            }
        }
    }else if(string == "sortByHighPrice"){
        for(let i = 1; i < result.length; i++){
            for(let j = 0; j < i; j++){
                if(result[j].price < result[i].price) {
                    let temp = result[i];
                    result[i] = result[j];
                    result[j] = temp;
                }
            }
        }
    }
    return result;
}

router.filterByBrand = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let cosmeticByName = getByName(cosmetics,req.params.name);
    let cosmetic = getByBrand(cosmeticByName,req.params.brand);

    if(cosmetic.length > 0)
        res.send(JSON.stringify(cosmetic,null,5));
    else
        res.send('Cosmetic Not Found!');
}

router.findByName = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let cosmetic = getByName(cosmetics,req.params.name);

    if(cosmetic.length > 0)
        res.send(JSON.stringify(cosmetic,null,5));
    else
        res.send('Cosmetic Not Found!');
}

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(cosmetics,null,5));
}

router.sortByLowPrice = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let cosmetic = sortByPrice(cosmetics,"sortByLowPrice")
    res.send(JSON.stringify(cosmetic,null,5));
}

router.sortByHighPrice = (req, res) =>{
    res.setHeader('Content-Type', 'application/json');
    let cosmetic = sortByPrice(cosmetics,"sortByHighPrice")
    res.send(JSON.stringify(cosmetic,null,5));
}

router.editByID = (req, res) => {
    let cosmetic = getIndexByID(cosmetics, req.params.id);
    let index = cosmetics.indexOf(cosmetic);
    if(index != -1){
        cosmetics[index] = {"id" : req.params.id, "name" : req.body.name, "brand" : req.body.brand, "price" : req.body.price, "publisher" : req.body.publisher};
        res.json({status : 200, message : "Edit Cosmetic Successful"});
    }else
        res.send("Cosmetic Not Found - Edit Cosmetic Not Successful!");
}

router.removeCosmetic = (req, res) =>{
    let cosmetic = getIndexByID(cosmetics,req.params.id);
    let index = cosmetics.indexOf(cosmetic);
    let currentSize = cosmetics.length;
    cosmetics.splice(index, 1);
    if((currentSize-1) == cosmetics.length)
        res.json({ message: "Cosmetic Deleted!"});
    else
        res.json({ message: "Cosmetic Not Deleted!"});
}

router.addCosmetic = (req, res) => {
    let id = Math.floor((Math.random() * 10000) +1 );
    let currentSize = cosmetics.length;
    cosmetics.push({"id" : id, "name" : req.body.name, "brand" : req.body.brand, "price" : req.body.price, "publisher" : req.body.publisher});
    if((currentSize + 1) == cosmetics.length)
        res.json({message: "Cosmetic Added Successful"});
    else
        res.json({message: "Cosmetic Not Added!"});
}

module.exports = router;