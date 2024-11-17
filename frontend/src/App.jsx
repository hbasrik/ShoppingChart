import React, { useEffect, useState } from "react";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({}); 

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((response) => {
      setProducts(response.data);
      
      const initialColors = {};
      response.data.forEach((_, index) => {
        initialColors[index] = "gold";
      });
      setSelectedColors(initialColors);
    });
  }, []);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 768,
        settings: { slidesToShow: 1, slidesToScroll: 1 },
      },
    ],
  };

  const handleColorChange = (index, color) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [index]: color,
    }));
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1 style={{ textAlign: "center" }}>Product List</h1>
      <Slider {...settings}>
        {products.map((product, index) => (
          <div key={index} style={{ textAlign: "center" }}>
            <img
              src={product.images[selectedColors[index]]}
              alt={product.name}
              style={{ width: "100%", height: "200px", objectFit: "contain" }}
            />
            <h2>{product.name}</h2>
            <p>${product.price} USD</p>
            <p>Popularity: {(product.popularityScore / 20).toFixed(1)} / 5</p>
            <div>
              {Object.keys(product.images).map((color) => (
                <button
                  key={color}
                  onClick={() => handleColorChange(index, color)}
                  style={{
                    backgroundColor: color,
                    border:
                      selectedColors[index] === color
                        ? "2px solid black"
                        : "1px solid gray",
                    borderRadius: "50%",
                    width: "20px",
                    height: "20px",
                    margin: "5px",
                    cursor: "pointer",
                  }}
                ></button>
              ))}
            </div>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default App;
