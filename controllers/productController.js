const Product = require('../models/product');
const Seller = require('../models/seller');
const Catalog = require('../models/catalog');

const { body, validationResult } = require('express-validator');
const async = require('async');

exports.products = (req, res, next) => {
    Product.find()
      .populate('catalog')
      .populate('seller')
      .sort({ name: 1 })
      .exec(function(err, results) {
        if(err) {
            return next(err);
        }
        
        res.render("product_list", {
            products: results,
        });
    });
}

exports.product_detail = (req, res, next) => {
    Product.findById(req.params.id)
      .populate('catalog')
      .populate('seller')
      .exec(function(err, results) {
        if(err) {
            return next(err);
        }
        if(results == undefined) {
            err = new Error('Product not found');
            err.status = 404;
            return next(err);
        }
        res.render("product_detail", {
            product: results
        });
      });
}

exports.product_create = (req, res, next) => {
    async.parallel(
        {
            sellers(callback) {
                Seller.find().sort({ name: 1 }).exec(callback);
            },
            catalogs(callback) {
                Catalog.find().exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                if(err) {
                    return next(err);
                }
            }
            
            res.render("create_product", {
                sellers: results.sellers,
                catalogs: results.catalogs,
            });
        }
    );
}

exports.product_create_post = [
    (req, res, next) => {
        if(!req.body.product_catalog) {
            req.body.product_catalog = [];
            console.log("null");
        }
        if(!Array.isArray(req.body.product_catalog)) {
            req.body.product_catalog = [req.body.product_catalog];
        }
        next();
    },
    body('product_name', "Product name must not me empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        
        if(req.body.product_catalog.length === 0) {
            errors.errors[errors.errors.length] = 'Please pick at least 1 catalog';
        }
        if(req.body.product_quantity < 0 || req.body.product_price < 0) {
            errors.errors[errors.errors.length] = 'Please enter a valid number.';
        }

        const product = new Product({
            name: req.body.product_name,
            quantity: req.body.product_quantity,
            description: req.body.product_description,
            price: req.body.product_price,
            catalog: req.body.product_catalog,
            seller: req.body.product_seller
        });
        
        if(!errors.isEmpty()) {
            async.parallel(
                {
                    sellers(callback) {
                        Seller.find().exec(callback);
                    },
                    catalogs(callback) {
                        Catalog.find().exec(callback);
                    }
                },
                (err, results) => {
                    if(err) {
                        return next(err);
                    }
                    for(const catalog of results.catalogs) {
                        if(product.catalog.includes(catalog._id)) {
                            catalog.checked = true;
                        }
                    }
                    
                    res.render("create_product", {
                        sellers: results.sellers,
                        catalogs: results.catalogs,
                        errors: errors,
                        product: req.body
                    });
                }
            );
            return;
        }
        
        product.save((err) => {
            if(err) {
                return next(err);
            }
            res.redirect('/inventory/products');
        });
    }
];

exports.product_delete = (req, res, next) => {
    Product.findById(req.params.id).exec(function(err, results) {
        if(err) {
            return next(err);
        }
        if(results == null) {
            const error = new Error('Product not found');
            error.status = 404;
            return next(error);
        }
        res.render('delete_product', {
            product: results,
        });
    })
}

exports.product_delete_post = (req, res, next) => {
    Product.findByIdAndDelete(req.params.id, (err) => {
        if(err) {
            return next(err);
        }
        res.redirect('/inventory/products')
    });
}