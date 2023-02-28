const express = require('express');
const router = express.Router();

// Controllers
const productController = require("../controllers/productController");
const catalogController = require("../controllers/catalogController");
const sellerController = require("../controllers/sellerController");

router.get('/', (req, res, next) => {
    res.send("Inventory application");
});

// Products
router.get('/products', productController.products);

router.get('/product/:id', productController.product_detail);

// Seller
router.get('/sellers', sellerController.sellers);

router.get('/seller/:id', sellerController.seller_detail);

// Catalog
router.get('/catalogs', catalogController.catalogs);

router.get('/catalog/:id', catalogController.catalog_detail);


module.exports = router;