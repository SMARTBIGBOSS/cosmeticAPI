/*
const sellers = [
    { id: 2000, name : 'Tom', email: '123456@gmail.com', password: '123456', description: "Mainly sell Maybelline cosmetics"},
    { id: 2001, name : 'Jackson', email: '789123@gmail.com', password: '789123', description: "Mainly sell Ponds cosmetics"},
    { id: 2002, name : 'Belly', email: '456789@gmail.com', password: '456789', description: "Mainly sell Etude House cosmetics"}
]

module.exports = sellers;
*/

let mongoose = require('mongoose');
let Joi = require('joi');
const jwt = require("jsonwebtoken");

let SellersSchema = new mongoose.Schema({
        sellerId: {
            type: String,
            // required: true
        },
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            match:/^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(\.[a-zA-Z0-9_-])+/,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        description: String,
        register_date: Date,
        //img_url:
    },
    {collection: 'sellers'});

// function validateSeller(seller){
//     let schema = {
//         name: Joi.string().required().unique(),
//         email: Joi.string().match().required().unique(),
//         password: Joi.string().required()
//     };
//     return Joi.validate(seller, schema);
// }

SellersSchema.methods.generateAuthToken = function(){
    let token = jwt.sign({_id: this._id}, 'sellerJwtKey');
    return token;
}

//module.exports.validateSeller = validateSeller;
module.exports = mongoose.model('Seller', SellersSchema);