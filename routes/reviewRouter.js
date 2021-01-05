const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const Reviews = require('../models/reviews');

const reviewRouter = express.Router();
reviewRouter.use(bodyParser.json());

reviewRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.get(cors.cors, (req, res, next) => {
    Reviews.find(req.query)
    .populate('author')
    .then((reviews) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(reviews);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.cors, authenticate.verifyUser, (req, res, next) => {
    if(req.body!=null) {
        req.body.author = req.user._id;
        Reviews.create(req.body)
        .then((review) => {
            Reviews.findById(review._id)
            .populate('author')
            .then((review) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(review);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Review not found in request body');
        err.status = 404;
        return next(err);
    }
})
.delete(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Reviews.findByIdAndRemove(req.body._id)
    .then((resp) => {
        Reviews.find({})
        .populate('author')
        .then((reviews) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(reviews);
        })
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = reviewRouter;
