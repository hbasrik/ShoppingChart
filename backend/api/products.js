const axios = require("axios");
const products = require("../data/products.json");

const goldPriceAPI = "https://api.metals.dev/v1/metal/spot?api_key=ZXXJN6XEWKBTSQEQHYLF771EQHYLF&metal=gold&currency=USD";

module.exports = async (req, res) => {
    try {
      const goldResponse = await axios.get(goldPriceAPI);
      const goldPricePerTroyOunce = goldResponse.data.rate.price;
      const goldPricePerGram = goldPricePerTroyOunce / 31.1035;
  
      const updatedProducts = products.map((product) => {
        const price =
          (product.popularityScore + 1) * product.weight * goldPricePerGram;
        return { ...product, price: price.toFixed(2) };
      });
  
      res.status(200).json(updatedProducts);
    } catch (error) {
      console.error("Error fetching gold price:", error.message);
      res.status(500).json({ error: "Failed to fetch gold price" });
    }
  };