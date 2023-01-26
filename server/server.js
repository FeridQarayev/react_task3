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

mongoose.set("strictQuery", false);
app.use(express.json());
app.use(cors());
mongoose
  .connect(
    `mongodb+srv://ferid:PSZde9zf0vkXCbWc@cluster0.tnvvtt5.mongodb.net/?retryWrites=true&w=majority`
  )
  .then(() => console.log("Connected to database"))
  .catch((err) => console.error(err));

const ProductModel = mongoose.model("Product", productSchema);

app.get("/api/products", async (req, res) => {
  const products = await ProductModel.find();
  res.send(products);
});

app.post("/api/products", async (req, res) => {
  const data = req.body;
  const addData = new ProductModel(data);
  await addData.save();
  res.send(addData);
});

app.delete("/api/products/:id", (req, res) => {
  if (req.params.id)
    ProductModel.findByIdAndDelete(req.params.id, (error, data) => {
      if (error) {
        return res.status(500).send({ error });
      }
      res.send(data);
    });
});

app.listen(PORT, () => {
  console.log(`listen start port ${PORT}`);
});
