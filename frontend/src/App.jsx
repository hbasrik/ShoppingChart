import React, { useEffect, useState } from "react";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import "./style.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((response) => {
      const productsData = response.data;
      setProducts(productsData);

      // Initialize selectedColors with default ("yellow") for all products
      const initialColors = {};
      productsData.forEach((_, index) => {
        initialColors[index] = "yellow";
      });
      setSelectedColors(initialColors);
    });
  }, []);

  const handleColorChange = (index, color) => {
    setSelectedColors((prevColors) => ({
      ...prevColors,
      [index]: color,
    }));
  };

  const renderStars = (popularity) => {
    const roundedPopularity = Math.round(popularity * 2) / 2;
    const fullStars = Math.floor(roundedPopularity);
    const hasHalfStar = roundedPopularity % 1 !== 0;
    const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

    return (
      <div className="star-rating">
        {Array(fullStars)
          .fill()
          .map((_, i) => (
            <span key={`full-${i}`} className="star">
              ★
            </span>
          ))}
        {hasHalfStar && <span className="star">☆</span>}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <span key={`empty-${i}`} className="star empty">
              ★
            </span>
          ))}
      </div>
    );
  };

  const colors = ["yellow", "rose", "white"];
  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    arrows: true,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="app-container">
      <h1 className="title">Product List</h1>

      <div className="slider-wrapper">
        <Slider {...settings}>
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <img
                src={product.images[selectedColors[index]]}
                alt={product.name}
                className="product-image"
              />
              <div className="product-details">
                <h2 className="product-name">{product.name}</h2>
                <p className="product-price">${product.price} USD</p>
                <div className="color-buttons">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => handleColorChange(index, color)}
                      className={`color-button ${
                        selectedColors[index] === color ? "selected" : ""
                      }`}
                      style={{
                        backgroundColor: `var(--${color})`,
                      }}
                    ></button>
                  ))}
                </div>
                <div className="product-rating">
                  <p className="rating-star">{renderStars(product.popularityScore / 20)}</p>
                  <p className="rating-number">{Math.floor((product.popularityScore / 20) * 2) / 2}/5</p>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default App;
