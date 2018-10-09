let transactions = require('../models/transactions');
let express = require('express');
let router = express.Router();

function getByBuyerID(array, buyerId) {
    let result = array.filter(function(obj){return obj.buyerId == buyerId})
    return result ? result : null;
}

function getByID(array, id){
    let result = array.filter(function(obj){return obj.id == id})
    return result ? result[0] : null;
}

router.add = (req, res) => {
    let id = Math.floor((Math.random() * 10000) +1 );
    let currentSize = transactions.length;

    transactions.push({"id" : id, "cosmeId" : req.body.cosmeId, "buyerId" : parseInt(req.params.buyerId),
        "quantity" : req.body.quantity, "date" : req.body.date, "status": 0});
    if((currentSize + 1) == transactions.length)
        res.json({status : 200, message: "Cosmetic Add to Trolley Successfully"});
    else
        res.json({message: "Cosmetic Not Added!"});
}

router.remove = (req, res) => {
    let transaction = getByID(transactions,req.params.id);
    let index = transactions.indexOf(transaction);
    let currentSize = transactions.length;

    transactions.splice(index, 1);
    if((currentSize-1) == transactions.length)
        res.json({status : 200, message: "Transaction Removed successful"});
    else
        res.json({ message: "Transaction Not Removed!"});
}

router.edit = (req, res) => {
    let transaction = getByID(transactions,req.params.id);
    let index = transactions.indexOf(transaction);

    if(transaction != null){
        if(transactions[index].status == -1){
            transactions[index].quantity = req.body.quantity;
            transactions[index].date = req.body.date;
            res.json({status : 200, message : "Edit Transaction Successful"});
        }else
            res.send("Transaction Unable Edit!");
    }else
        res.send("Transaction Not Found - Edit Transaction Not Success!");
}

router.order = (req, res) => {
    let transaction = getByID(transactions, req.params.id);
    let index = transactions.indexOf(transaction);

    if(index != -1){
        if(transactions[index].status == -1){
            transactions[index].status = 0;
            res.json({status : 200, message : "Order Cosmetics Successful"});
        }else
            res.send("Transaction Ordered!");
    }else
        res.send("Transaction Not Found - Order Cosmetics Not Success!");
}

router.ConfirmReceipt = (req, res) => {
    let transaction = getByID(transactions, req.params.id);
    let index = transactions.indexOf(transaction);

    if(index != -1){
        transactions[index].status = 1;
        res.json({status : 200, message : "Transaction Finished"});
    }else
        res.send("Transaction Not Found - Confirm Receipt Not Success!");
}

router.findByBuyerId = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    let transaction = getByBuyerID(transactions,req.params.buyerId);

    if(transaction.length > 0)
        res.send(JSON.stringify(transaction,null,5));
    else
        res.send('Transaction Not Found!');
}

router.findAll = (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(transactions,null,5));
}

module.exports = router;