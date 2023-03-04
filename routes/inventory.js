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

router.get('/seller/create');

router.get('/seller/:id', sellerController.seller_detail);

// Catalog
router.get('/catalogs', catalogController.catalogs);

router.get('/catalog/create', catalogController.catalog_create);
router.post('/catalog/create', catalogController.catalog_create_post);

router.get('/catalog/:id', catalogController.catalog_detail);

router.get('/catalog/:id/delete', catalogController.catalog_delete);

router.post('/catalog/:id/delete', catalogController.catalog_delete_post);

module.exports = router;