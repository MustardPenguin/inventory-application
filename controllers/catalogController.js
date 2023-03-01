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
    catalog
      .findById(req.params.id)
      .exec(function(err, results) {
        if(err) {
            return next(err);
        }
        console.log(results);
        res.render("catalog_detail", {
            catalog: results,
        });
      });
}