const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    catalog: [{ type: Schema.Types.ObjectId, ref: "Catalog", required: true }],
    seller: { type: Schema.Types.ObjectId, ref: "Seller", required: true },    
});

ProductSchema.virtual('url').get(function() {
    return `/inventory/product/${this._id}`;
});

const inventory_application = mongoose.connection.useDb('inventory-application');

module.exports = inventory_application.model("Product", ProductSchema);