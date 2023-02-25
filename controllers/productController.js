

exports.products = (req, res) => {
    res.send("Products display");
}

exports.product_detail = (req, res) => {
    res.send("Product detail: " + req.params.id);
}