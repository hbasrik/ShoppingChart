const express = require("express");
const cors = require("cors");
const axios = require("axios");
const products = require("./products.json");

const app = express();
app.use(cors());

const goldPriceAPI = "https://api.metals.dev/v1/metal/spot?api_key=LOFTJQ2CG94PH1CEFDK9485CEFDK9&metal=gold&currency=USD";

app.get("/products", async (req, res) => {
  try {
    
    const goldResponse = await axios.get(goldPriceAPI);
    const goldPricePerTroyOunce = goldResponse.data.rate.price; 
    
    const goldPricePerGram = goldPricePerTroyOunce / 31.1035;
    console.log(`Gold Price Per Gram: ${goldPricePerGram} USD`);

   
    const updatedProducts = products.map((product) => {
      const price = (product.popularityScore + 1) * product.weight * goldPricePerGram;
      return { ...product, price: price.toFixed(2) };
    });

    res.json(updatedProducts);
  } catch (error) {
    console.error("Error fetching gold price:", error.message);
    res.status(500).json({ error: "Failed to fetch gold price" });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Backend is running on http://localhost:${PORT}`);
});