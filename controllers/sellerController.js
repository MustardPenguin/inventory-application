const Seller = require("../models/seller");

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
    Seller
      .findById(req.params.id)
      .exec(function(err, results) {
        if(err) {
            return next(err);
        }
        res.render("seller_detail", {
            seller: results
        });
      });
}