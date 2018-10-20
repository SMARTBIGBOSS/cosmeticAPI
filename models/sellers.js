/*
const sellers = [
    { id: 2000, name : 'Tom', email: '123456@gmail.com', password: '123456', description: "Mainly sell Maybelline cosmetics"},
    { id: 2001, name : 'Jackson', email: '789123@gmail.com', password: '789123', description: "Mainly sell Ponds cosmetics"},
    { id: 2002, name : 'Belly', email: '456789@gmail.com', password: '456789', description: "Mainly sell Etude House cosmetics"}
]

module.exports = sellers;
*/

let mongoose = require('mongoose');

let SellersSchema = new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true
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

module.exports = mongoose.model('Seller', SellersSchema);