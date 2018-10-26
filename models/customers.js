/*
const customers = [
    { id: 3000, name : 'Lily', email : '123456@gmail.com', password: '123123', phoneNum : 123456, address: ""},
    { id: 3001, name : 'Joe', email : '123456@163.com', password: '123123', phoneNum : 123456, address: ""},
    { id: 3002, name : 'Christina', email : '123456@qq.com',password: '123123', phoneNum : 123456, address: ""}
]

module.exports = customers;
*/

let mongoose = require('mongoose');
const jwt = require("jsonwebtoken");

let CustomersSchema = new mongoose.Schema({
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
        phoneNum: String,
        address: String,
        register_date: Date,
        //img_url:
    },
    {collection: 'customers'});

CustomersSchema.methods.generateAuthToken = function(){
    let token = jwt.sign({_id: this._id}, 'customerJwtKey');
    return token;
}

module.exports = mongoose.model('Customer', CustomersSchema);