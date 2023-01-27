const mongoose = require("mongoose");
const express = require("express");
const cors = require("cors");
const Joi = require("joi");

const PORT = 8080;

const app = express();

const ProductSchema = new mongoose.Schema({
  name: String,
  description: String,
  price: String,
});

const ProductModel = mongoose.model("Product", ProductSchema);

mongoose.set("strictQuery", false);
app.use(express.json());
app.use(cors());

mongoose
  .connect(
    `mongodb+srv://ferid:PSZde9zf0vkXCbWc@cluster0.tnvvtt5.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

const productValSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().required(),
});

// Get All Products
app.get("/api/products", (req, res) => {
  ProductModel.find().exec((error, data) => {
    if (error) return res.status(500).send({ error });
    res.send(data);
  });
});

// Get By id product
app.get("/api/products/:id", (req, res) => {
  if (req.params.id) {
    ProductModel.findById(req.params.id, (error, data) => {
      if (error) return res.status(500).send({ error });
      res.send(data);
    });
  } else return res.status(400).send({ error: "Id not found" });
});

// Create Product
app.post(
  "/api/products",
  (req, res, next) => {
    const { error } = productValSchema.validate(req.body);

    if (error == null) next();
    else {
      const { details } = error;
      const message = details.map((i) => i.message).join(",");
      res.status(422).json({ error: message });
    }
  },
  async (req, res) => {
    const newProduct = new ProductModel({ ...req.body });
    await newProduct.save();
    res
      .status(201)
      .send({ message: "Product succesfully added!", product: newProduct });
  }
);

//Delete Product
app.delete("/api/products/:id", (req, res) => {
  if (req.params.id) {
    ProductModel.findByIdAndDelete(req.params.id, (error, data) => {
      if (error) {
        return res.status(500).send({ error });
      }
      res.send(data);
    });
  } else return res.status(400).send({ error: "Id not found" });
});

app.listen(PORT, () => {
  console.log(`listen start port ${PORT}`);
});
