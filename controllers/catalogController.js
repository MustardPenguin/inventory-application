const catalog = require('../models/catalog');

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
    catalog
      .findById(req.params.id)
      .exec(function(err, results) {
        if(err) {
            return next(err);
        }
        res.render("catalog_detail", {
            catalog: results,
        });
      });
}