const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SellerSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    established: { type: Date },
});

const inventory_application = mongoose.connection.useDb('inventory-application');

module.exports = inventory_application.model("Seller", SellerSchema);