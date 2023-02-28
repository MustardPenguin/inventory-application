const catalog = require('../models/catalog');

exports.catalogs = (req, res, next) => {
    catalog.find().exec(function(err, results) {
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
    res.send("Catalog: " + req.params.id);
}