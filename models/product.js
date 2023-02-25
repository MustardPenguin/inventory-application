const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: summary },
    price: { type: Number, required: true },
    catalog: { type: Schema.Types.ObjectId, ref: "Catalog", required: true },
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },    
});

ProductSchema.virtual('url').get(function() {
    return `/inventory/product/${this._id}`;
});

module.exports = mongoose.model("Product", ProductSchema);