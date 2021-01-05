const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    productId: {
        type: String,
        required: true
    },
    total: {
        type: Number,
        required: true
    },
    deliverydetails: {
        type: String,
        default: ""
    },
    status: {
        type: String,
        default: "shipped"
    }
},{
    timestamps: true
});

var Orders = mongoose.model("Order", orderSchema);

module.exports = Orders;
