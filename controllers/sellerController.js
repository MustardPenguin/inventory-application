const Seller = require("../models/seller");

exports.sellers = (req, res, next) => {

    Seller.find().exec(function(err, results) {
        if(err) {
            return next(err);
        }
        
        res.render("seller_list", {
            sellers: results,
        });
    });
}

exports.seller_detail = (req, res, next) => {
    res.send("Seller id: " + (req.params.id));
}