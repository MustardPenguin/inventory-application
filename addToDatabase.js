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
    const product = new Product({
        name: name,
        quantity: quantity,
        description: description,
        price: price,
        seller: seller,
        catalog: catalog,
    });

    //console.log(product);
    product.save((err) => {
        if(err) {
            
            console.log(err);
        }
    });
}

let seller1;

async.parallel(
    {
        seller(callback) {
            Seller.find({ name: "John" }).exec(callback);
        },
        catalog(callback) {
            Catalog.find({ name: "Instruments" }).exec(callback);
        },
    },
    (err, results) => {
        if(err) {
            console.log(err);
            return err;
        }
        const seller = results.seller[0]._id;
        const catalog = results.catalog[0]._id;
        if(seller == null || catalog == null) {
            console.log("Results not found");
            console.log("Seller: " + seller);
            console.log("Catalog: " + catalog);
            return;
        }
        console.log(results);
        createProduct(
            "Guitar",
            5,
            "A guitar for playing music!",
            499.99,
            results.seller[0]._id,
            [results.catalog[0]._id]
        );
    }
);