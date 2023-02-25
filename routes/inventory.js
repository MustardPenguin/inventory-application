const express = require('express');
const router = express.Router();

// Controllers


router.get('/', (req, res, next) => {
    res.send('Inventory');
});

// Products
router.get('/products', (req, res) => {
    res.send("Products here");
});

router.get('/product/:id', (req, res) => {
    res.send("Specific product here: " + req.params.id);
});

// Seller
router.get('/sellers', (req, res) => res.send("sellers"));

// Catalog

module.exports = router;