const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    seller: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    description: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    label: {
        type: String,
        default: ''
    },
    price: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: ""
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

var Products = mongoose.model("Product", productSchema);

module.exports = Products;
