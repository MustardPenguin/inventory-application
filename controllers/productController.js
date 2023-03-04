const Product = require('../models/product');

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