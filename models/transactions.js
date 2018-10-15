/*
const transactions = [
    {id: 4000, cosmeId: 1000, buyerId: 3000, quantity: 1, date: "07/10/2018", status: -1},
    {id: 4001, cosmeId: 1000, buyerId: 3002, quantity: 2, date: "07/10/2018", status: 0},
    {id: 4002, cosmeId: 1002, buyerId: 3001, quantity: 1, date: "07/10/2018", status: 1}
]//status: -1(add to trolley), 0(delivering), 1(finished)

module.exports = transactions;
*/

let mongoose = require('mongoose');

let TransactionsSchema = new mongoose.Schema({
    cosmeId: {
        type: String,
        require: true
    },
    buyerId: {
        type: String,
        require: true
    },
    quantity: {
        type: Number,
        min: 1,
        require: true
    },
    shipping_address: {
        type: String,
        require: true
    },
    contact_Num: {
        type: Number,
        require: true
    },
    last_date: Date,
    status:{ type: String,
        enum: ['unpaid', 'delivering', 'finished']}
},
    {collection: 'transactions'});

module.exports = mongoose.model('Transaction', TransactionsSchema);