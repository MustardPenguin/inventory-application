const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { DateTime } = require('luxon');

const SellerSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
    established: { type: Date },
});

SellerSchema.virtual('url').get(function() {
    return '/inventory/seller/' + this._id;
});

SellerSchema.virtual('established_formatted').get(function() {
    return DateTime.fromJSDate(this.established).toLocaleString(DateTime.DATE_HUGE);
});

const inventory_application = mongoose.connection.useDb('inventory-application');

module.exports = inventory_application.model("Seller", SellerSchema);