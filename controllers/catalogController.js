const Catalog = require('../models/catalog');
const Product = require('../models/product');

const { body, validationResult } = require("express-validator");
const async = require('async');

exports.catalogs = (req, res, next) => {
    Catalog.find().sort({ name: 1 }).exec(function(err, results) {
        if(err) {
            return next(err);
        }
        res.render("catalog_list", {
            catalogs: results,
        });
    });
}

exports.catalog_detail = (req, res, next) => {
    async.parallel(
        {
            catalog(callback) {
                Catalog.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ catalog: req.params.id }, 'name').sort({ name: 1}).exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            if(results == undefined || results.catalog == undefined) {
                err = new Error("Catalog not found");
                err.status = 404;
                return next(err);
            }

            res.render("catalog_detail", {
                catalog: results.catalog,
                products: results.products
            });
        }
    );
}

exports.catalog_create = (req, res, next) => {
    res.render("create_catalog");
}

exports.catalog_create_post = [
    body('catalog_name', "Catalog must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('catalog_description')
      .optional({ checkFalsy: true })
      .trim()
      .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render("create_catalog", {
                catalog: req.body,
                errors: errors
            });
            return;
        }
        const catalog = new Catalog({
            name: req.body.catalog_name,
            description: req.body.catalog_description
        });
        catalog.save((err) => {
            if(err) {
                return next(err);
            }
        });
        res.redirect('/inventory/catalogs');
    }
];

exports.catalog_delete = (req, res, next) => {
    async.parallel(
        {
            catalog(callback) {
                Catalog.findById(req.params.id).exec(callback);
            },
            products(callback) {
                Product.find({ catalog: req.params.id }, "name").exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            if(results.catalog == null) {
                const err = new Error("Catalog not found");
                err.status = 404;
                return next(err);
            }
            res.render("delete_catalog", {
                catalog: results.catalog,
                products: results.products
            });
        }
    );
}

exports.catalog_delete_post = (req, res, next) => {
    async.parallel(
        {
            catalog(callback) {
                Catalog.findById(req.body.catalogid).exec(callback);
            },
            products(callback) {
                Product.find({ seller: req.body.catalogid }).exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(err);
            }

            if(results.products.length > 0) {
                res.render("delete_catalog", {
                    catalog: results.catalog,
                    products: results.products
                });
            } else {
                Catalog.findByIdAndRemove(req.body.catalogid, (err) => {
                    if(err) {
                        return next(err);
                    }
                    res.redirect('/inventory/catalogs');
                });
            }
        }
    );
};

exports.catalog_update = (req, res, next) => {
    Catalog.findById(req.params.id).exec(function(err, results) {
        if(err) {
            return next(err);
        }
        if(results == null) {
            const error = new Error('Catalog not found');
            error.status = 404;
            return next(error);
        }

        res.render("create_catalog", {
            catalog: {
                title: "Update catalog",
                catalog_name: results.name,
                catalog_description: results.description
            },
        });
    });
}

exports.catalog_update_post = [
    body('catalog_name', "Catalog must not be empty")
      .trim()
      .isLength({ min: 1 })
      .escape(),
    body('catalog_description')
      .optional({ checkFalsy: true })
      .trim()
      .escape(),
    (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()) {
            res.render("create_catalog", {
                catalog: req.body,
                errors: errors
            });
            return;
        }
        const catalog = new Catalog({
            name: req.body.catalog_name,
            description: req.body.catalog_description,
            _id: req.params.id
        });
        Catalog.findByIdAndUpdate(req.params.id, catalog, {}, (err, updatedCatalog) => {
            if(err) {
                return next(err);
            }
            res.redirect('/inventory/catalog/' + req.params.id);
        });
    }
]