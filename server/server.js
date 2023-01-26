const moongose = require("mongoose");
const cors = require("cors");
const express = require("express");
const { default: mongoose } = require("mongoose");

const PORT = 8080;

const app = express();

const productSchema = new mongoose.Schema({
  name: String,
  description: String,
  position: String,
});

const ProductModel = mongoose.model("Product", productSchema);

app.get("api/products", (req, res) => {
  const products = ProductModel.find();
  res.send(products);
});

app.get("api/products", (req, res) => {
  const products = ProductModel.find();
  res.send(products);
});

app.listen(() => {
  console.log(`listen start port ${PORT}`);
});
