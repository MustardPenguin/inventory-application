const Seller = require("../models/seller");

exports.sellers = (req, res, next) => {

    Seller.find().exec(function(err, results) {
        if(err) {
            return next(err);
        }
        console.log(results);
    });

    res.send("Sellers");
}