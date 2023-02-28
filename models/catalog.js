const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CatalogSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
});

CatalogSchema.virtual('url').get(function() {
    return '/inventory/catalog/' + this._id;
});

const inventory_application = mongoose.connection.useDb('inventory-application');

module.exports = inventory_application.model("Catalog", CatalogSchema);