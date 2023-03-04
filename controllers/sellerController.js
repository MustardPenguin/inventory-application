const Seller = require("../models/seller");
const Product = require("../models/product");
const async = require('async');

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
            
            console.log(results);
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

];