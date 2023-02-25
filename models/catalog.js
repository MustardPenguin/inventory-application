const mongoose = require("mongoose");
const catalogSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String },
});

module.exports = mongoose.model("Catalog", catalogSchema);