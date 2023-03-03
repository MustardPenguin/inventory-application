const catalog = require('../models/catalog');
const product = require('../models/product');
const async = require('async');

exports.catalogs = (req, res, next) => {
    catalog.find().sort({ name: 1 }).exec(function(err, results) {
        if(err) {
            return next(err);
        }
        console.log(results);
        res.render("catalog_list", {
            catalogs: results,
        });
    });
}

exports.catalog_detail = (req, res, next) => {
    async.parallel(
        {
            catalog(callback) {
                catalog.findById(req.params.id).exec(callback);
            },
            products(callback) {
                product.find({ catalog: req.params.id }).sort({ name: 1}).exec(callback);
            }
        },
        (err, results) => {
            if(err) {
                return next(err);
            }
            res.render("catalog_detail", {
                catalog: results.catalog,
                products: results.products
            });
        }
    );
}