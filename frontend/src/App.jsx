import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faAngleLeft,
  faStar as solidStar,
  faStarHalfAlt as halfStar,
  faStar as emptyStar,
} from "@fortawesome/free-solid-svg-icons";
import "./style.css";

const App = () => {
  const [products, setProducts] = useState([]);
  const [selectedColors, setSelectedColors] = useState({});
  const sliderRef = useRef(null);

  useEffect(() => {
    axios.get("http://localhost:5000/products").then((response) => {
      const productsData = response.data;
      setProducts(productsData);

      const initialColors = {};
      productsData.forEach((_, index) => {
        initialColors[index] = "yellow";
      });
      setSelectedColors(initialColors);
    });
  }, []);

  const handleScroll = (direction) => {
    const slider = sliderRef.current;
    const cardWidth = slider.children[0].offsetWidth + 20; // Card width + gap

    if (direction === "left") {
      slider.scrollBy({ left: -cardWidth, behavior: "smooth" });
    } else if (direction === "right") {
      slider.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

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
            <FontAwesomeIcon
              key={`full-${i}`}
              icon={solidStar}
              className="star full-star"
            />
          ))}
        {hasHalfStar && (
          <FontAwesomeIcon
            icon={halfStar}
            className="star half-star"
          />
        )}
        {Array(emptyStars)
          .fill()
          .map((_, i) => (
            <FontAwesomeIcon
              key={`empty-${i}`}
              icon={emptyStar}
              className="star empty-star"
            />
          ))}
      </div>
    );
  };

  const colors = ["yellow", "rose", "white"];

  return (
    <div className="app-container">
      <h1 className="title">Product List</h1>
      <div className="slider-navigation">
        <button className="prev-button" onClick={() => handleScroll("left")}>
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>

        <div className="slider-wrapper" ref={sliderRef}>
          {products.map((product, index) => (
            <div key={index} className="product-card">
              <div className="image-container">
              <img
                src={product.images[selectedColors[index]]}
                alt={product.name}
                className="product-image"
              />
              </div>
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
                      style={{ backgroundColor: `var(--${color})` }}
                    ></button>
                  ))}
                </div>
                <div className="selected-product">
                  <span className="selected-color">
                    {selectedColors[index] === "yellow" && "Yellow Gold"}
                    {selectedColors[index] === "rose" && "Rose Gold"}
                    {selectedColors[index] === "white" && "White Gold"}
                  </span>
                </div>
                <div className="product-rating">
                  <p className="rating-star">
                    {renderStars(product.popularityScore / 20)}
                  </p>
                  <p className="rating-number">
                    {Math.floor((product.popularityScore / 20) * 2) / 2}/5
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <button className="next-button" onClick={() => handleScroll("right")}>
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
};

export default App;
