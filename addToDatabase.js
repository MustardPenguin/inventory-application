const Catalog = require('./models/catalog');
const Product = require('./models/product');
const Seller = require('./models/seller');

const async = require('async');
const mongoose = require('mongoose');
mongoose.set('strictQuery', false); // Prepare for Mongoose 7

require('dotenv').config();
const mongoDB = process.env.mongo_url;

main().catch(err => console.log(err));
async function main() {
  await mongoose.connect(mongoDB);
}

const createProduct = (name, quantity, description, price, seller, catalog) => {
    const catalogArr = [];
    for(let i = 0; i < catalog.length; i++) {
        catalogArr[catalogArr.length] = catalog[i]._id;
        console.log(catalog[i].name);
    }
    console.log(catalogArr);
    
    const product = new Product({
        name: name,
        quantity: quantity,
        description: description,
        price: price,
        seller: seller,
        catalog: catalogArr,
    });

    console.log(product);
    
    product.save((err) => {
        if(err) {
            console.log(err);
        }
    });
}

const createSeller = (name, description, established) => {
    const seller = new Seller({
        name: name,
        description: description,
        established: established
    });
    console.log(seller);
    seller.save((err) => {
        if(err) {
            console.log(err);
        }
    });
}

createSeller(
    "Timmy",
    "The guy that sells products...",
    '2010-04-23'
);

/*
async.parallel(
    {
        seller(callback) {
            Seller.find({ name: "Tan" }).exec(callback);
        },
        catalog(callback) {
            Catalog.find({ name: {$in: ['Electronics', 'Gaming']} }).exec(callback);
        },
    },
    (err, results) => {
        if(err) {
            console.log(err);
            return err;
        }
        
        console.log(results);
        
        createProduct(
            "Gaming console",
            70,
            "For the gamers",
            399.99,
            results.seller[0]._id,
            results.catalog
        );
    }
);
*/