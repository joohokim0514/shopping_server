const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const Orders = require('../models/orders');

const orderRouter = express.Router();
orderRouter.use(bodyParser.json());
orderRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.get(cors.cors, (req, res, next) => {
    Orders.find({})
    .populate('buyer')
    .then((products) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(products);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    if(req.body!=null) {
        req.body.buyer = req.user._id;
        Orders.create(req.body)
        .then((order) => {
            Orders.findById(order._id)
            .populate('buyer')
            .then((order) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(order);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Order not found in request body');
        err.status = 404;
        return next(err);
    }
})
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Orders.findById(req.body.orderId)
    .then((order) => {
        if (order != null) {
            Orders.findByIdAndUpdate(req.body.orderId, {$set: { status: "refunded" }})
            .then((order) => {
                Orders.findById(order._id)
                .populate('buyer')
                .then((order) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(order);
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Order ' + req.body.orderId + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = orderRouter;
