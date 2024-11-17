const express = require("express");
const cors = require("cors");
const axios = require("axios");
const products = require("./products.json");

const app = express();
app.use(cors());

const goldPriceAPI = "https://api.metals.dev/v1/metal/spot?api_key=ZXXJN6XEWKBTSQEQHYLF771EQHYLF&metal=gold&currency=USD";


app.get("/products", async (req, res) => {
  try {
    const goldPriceResponse = await axios.get(goldPriceAPI);
    const goldPrice = goldPriceResponse.data.price;

    const updatedProducts = products.map((product) => {
      const price = (product.popularityScore + 1) * product.weight * goldPrice;
      return { ...product, price: price.toFixed(2) };
    });

    res.json(updatedProducts);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch gold price" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});
