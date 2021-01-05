const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');
const cloudinaryConfig = require('./cloudinary');
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

const Products = require('../models/products');

cloudinary.config({
    cloud_name: cloudinaryConfig.cloud_name,
    api_key: cloudinaryConfig.api_key,
    api_secret: cloudinaryConfig.api_secret
});
const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    folder: "webstore",
    allowedFormats: ["jpg", "png"],
    transformation: [{ width: 200, height: 200}]
});
const parser = multer({ storage: storage });

const addproductRouter = express.Router();
addproductRouter.use(bodyParser.json());
addproductRouter.use(bodyParser.urlencoded({extended: true}));

addproductRouter.route('/')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.post(cors.cors, authenticate.verifyUser, parser.single('image'), (req, res, next) => {
    if(req.body!=null) {
        req.body.seller = req.user._id;
        req.body.image = req.file.url;
        Products.create(req.body)
        .then((product) => {
            Products.findById(product._id)
            .populate('seller')
            .then((product) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(product);
            })
        }, (err) => next(err))
        .catch((err) => next(err));
    }
    else {
        err = new Error('Product not found in request body');
        err.status = 404;
        return next(err);
    }
})

addproductRouter.route('/updatestatus')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.body._id)
    .then((product) => {
        if (product != null) {
            if(req.body.status=="None") {
                req.body.status = "";
            }
            console.log("status", req.body.status);
            Products.findByIdAndUpdate(req.body._id, {$set: { status: req.body.status }})
            .then((product) => {
                Products.findById(product._id)
                .populate('seller')
                .then((product) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Product ' + req.body._id + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

addproductRouter.route('/updateprice')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.body._id)
    .then((product) => {
        if (product != null) {
            Products.findByIdAndUpdate(req.body._id, {$set: { price: req.body.price }})
            .then((product) => {
                Products.findById(product._id)
                .populate('seller')
                .then((product) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Product ' + req.body._id + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

addproductRouter.route('/updatelabel')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.body._id)
    .then((product) => {
        if (product != null) {
            Products.findByIdAndUpdate(req.body._id, {$set: { label: req.body.label }})
            .then((product) => {
                Products.findById(product._id)
                .populate('seller')
                .then((product) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Product ' + req.body._id + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

addproductRouter.route('/updatedescription')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.put(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Products.findById(req.body._id)
    .then((product) => {
        if (product != null) {
            Products.findByIdAndUpdate(req.body._id, {$set: { description: req.body.description }})
            .then((product) => {
                Products.findById(product._id)
                .populate('seller')
                .then((product) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Product ' + req.body._id + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

addproductRouter.route('/updateimage')
.options(cors.cors, (req, res) => { res.sendStatus = 200; })
.put(cors.cors, authenticate.verifyUser, parser.single("image"), (req, res, next) => {
    Products.findById(req.body._id)
    .then((product) => {
        if (product != null) {
            Products.findByIdAndUpdate(req.body._id, {$set: { image: req.file.url }})
            .then((product) => {
                Products.findById(product._id)
                .populate('seller')
                .then((product) => {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(product);
                })
            }, (err) => next(err));
        }
        else {
            err = new Error('Product ' + req.body._id + ' not found');
            err.status = 404;
            return next(err);
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = addproductRouter;
