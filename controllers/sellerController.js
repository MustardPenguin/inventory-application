const Seller = require("../models/seller");
const Product = require("../models/product");

const { body, validationResult } = require('express-validator');
const async = require('async');
const seller = require("../models/seller");
const { DateTime } = require('luxon');

exports.sellers = (req, res, next) => {

    Seller.find().sort({ name: 1 }).exec(function(err, results) {
        if(err) {
            return next(err);
        }
        
        res.render("seller_list", {
            sellers: results,
        });
    });
}

exports.seller_detail = (req, res, next) => {
    async.parallel(
        {
            seller(callback) {
                Seller.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ seller: req.params.id }, 'name').sort({ name: 1 }).exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            if(results == undefined || results.seller == null) {
                err = new Error('Seller not found');
                err.status = 404;
                return next(err);
            }
            
            res.render("seller_detail", {
                seller: results.seller,
                products: results.products,
            });
        }
    );
}

exports.seller_create = (req, res, next) => {
    res.render("create_seller");
}

exports.seller_create_post = [
    body('seller_name', 'Name must not be empty')
      .trim()
      .escape()
      .isLength({ min: 1 }),
    body('seller_description')
      .trim()
      .escape()
      .optional({ checkFalsy: true }),
    body('seller_established')
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
    (req, res, next) => {
        const errors = validationResult(body);

        if(!errors.isEmpty()) {
            res.render("create_seller", {
                seller: req.body,
                errors: errors.array()
            });
            return;
        }
        const seller = new Seller({
            name: req.body.seller_name,
            description: req.body.seller_description,
            established: req.body.seller_established
        });

        seller.save((err) => {
            if(err) {
                return next(err);
            }
            res.redirect('/inventory/sellers');
        });
    }
];

exports.seller_delete = (req, res, next) => {
    async.parallel(
        {
            seller(callback) {
                Seller.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ seller: req.params.id }, 'name').exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(results);
            }
            res.render("delete_seller", {
                products: results.products,
                seller: results.seller
            });
        }
    );
}

exports.seller_delete_post = (req, res, next) => {
    async.parallel(
        {
            seller(callback) {
                Seller.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ seller: req.params.id }, 'name').exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(results);
            }
            if(results.products.length > 0) {
                res.render("delete_catalog", {
                    products: results.products,
                    seller: results.seller
                });
            } else {
                Seller.findByIdAndRemove(req.params.id, (err) => {
                    if(err) {
                        return next(err);
                    }
                    res.redirect("/inventory/sellers");
                });
            }
        }
    );
}

exports.seller_update = (req, res, next) => {
    Seller.findById(req.params.id).exec(function(err, results) {
        if(err) {
            return next(err);
        }
        if(results == null) {
            const error = new Error('Seller not found');
            error.status = 404;
            return next(error);
        }
        
        const formatted_date = results.established ? results.established.toISOString().split('T')[0] : null;
        res.render('create_seller', {
            title: "Update seller",
            seller: {
                seller_name: results.name,
                seller_description: results.description,
                seller_established: formatted_date
            },
        });
    });
}

exports.seller_update_post = [
    body('seller_name', 'Name must not be empty')
      .trim()
      .escape()
      .isLength({ min: 1 }),
    body('seller_description')
      .trim()
      .escape()
      .optional({ checkFalsy: true }),
    body('seller_established')
      .optional({ checkFalsy: true })
      .isISO8601()
      .toDate(),
    (req, res, next) => {
        const errors = validationResult(body);

        if(!errors.isEmpty()) {
            res.render("create_seller", {
                seller: req.body,
                errors: errors.array()
            });
            return;
        }
        const seller = new Seller({
            name: req.body.seller_name,
            description: req.body.seller_description,
            established: req.body.seller_established,
            _id: req.params.id
        });

        Seller.findByIdAndUpdate(req.params.id, seller, {}, (err) => {
            if(err) {
                return next(err);
            }
            res.redirect('/inventory/seller/' + req.params.id);
        });
    }
];