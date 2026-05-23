const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({

  products: Array,

  totalAmount: Number,

  user: String

});

module.exports = mongoose.model("Order", orderSchema);