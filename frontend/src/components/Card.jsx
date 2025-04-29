// https://getbootstrap.com/docs/5.0/components/card/
import React, { useState } from "react";
import { toast } from "react-toastify";
import { useDispatchCart } from "./ContextReducer";
import { Cart, Dash, PlusLg } from "react-bootstrap-icons";

export default function Card({ foodName, ImgSrc, item }) {
  const [qty, setQty] = useState(1);
  const dispatch = useDispatchCart();

  const handleAddToCart = () => {
    try {
      if (!dispatch) {
        console.error("Dispatch function is not available");
        toast.error("Unable to add to cart. Please try again.");
        return;
      }
      
      const finalPrice = qty * 270;
      dispatch({
        type: "ADD",
        id: item._id,
        name: foodName,
        img: ImgSrc,
        qty: qty,
        price: finalPrice
      });
      toast.success("Added to cart!");
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add to cart. Please try again.");
    }
  };

  // Calculate the price based on quantity
  const calculatePrice = () => {
    return qty * 270;
  };

  return (
    <div className="card-container">
      <div className="card-image-container">
        <img src={ImgSrc} alt={foodName} className="card-image" />
        <div className="card-overlay">
          <button className="add-to-cart-btn" onClick={handleAddToCart}>
            <Cart className="cart-icon" />
            Add to Cart
          </button>
        </div>
      </div>

      <div className="card-content">
        <h3 className="card-title">{foodName}</h3>
        
        <div className="quantity-selector">
          <p className="quantity-label">Quantity:</p>
          <div className="quantity-controls">
            <button 
              className={`quantity-btn decrease-btn ${qty === 1 ? 'disabled' : ''}`}
              onClick={() => qty > 1 && setQty(qty - 1)}
              disabled={qty === 1}
            >
              <Dash className="quantity-icon" />
            </button>
            <span className="quantity-value">{qty}</span>
            <button 
              className="quantity-btn increase-btn"
              onClick={() => setQty(qty + 1)}
            >
              <PlusLg className="quantity-icon" />
            </button>
          </div>
        </div>

        <div className="price-section">
          <p className="price-label">Price:</p>
          <p className="price-value">
            ₹{calculatePrice()}
          </p>
        </div>
      </div>

      <style jsx>{`
        .card-container {
          background: white;
          border-radius: 15px;
          overflow: hidden;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          transition: transform 0.3s ease, box-shadow 0.3s ease;
        }

        .card-container:hover {
          transform: translateY(-5px);
          box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
        }

        .card-image-container {
          position: relative;
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .card-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.3s ease;
        }

        .card-container:hover .card-image {
          transform: scale(1.05);
        }

        .card-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          opacity: 0;
          transition: opacity 0.3s ease;
        }

        .card-container:hover .card-overlay {
          opacity: 1;
        }

        .add-to-cart-btn {
          background: #FB641B;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 25px;
          display: flex;
          align-items: center;
          gap: 8px;
          cursor: pointer;
          transition: background-color 0.3s;
        }

        .add-to-cart-btn:hover {
          background: #e55a17;
        }

        .cart-icon {
          font-size: 1.2rem;
        }

        .card-content {
          padding: 20px;
        }

        .card-title {
          margin: 0 0 15px 0;
          font-size: 1.2rem;
          color: #333;
        }

        .quantity-selector {
          margin-bottom: 15px;
        }

        .quantity-label {
          margin: 0 0 8px 0;
          font-size: 0.9rem;
          color: #666;
        }

        .quantity-controls {
          display: flex;
          align-items: center;
          gap: 10px;
          background: #f8f9fa;
          padding: 5px 15px;
          border-radius: 25px;
          width: fit-content;
        }

        .quantity-btn {
          background: none;
          border: none;
          padding: 5px;
          cursor: pointer;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }

        .decrease-btn {
          color: #dc3545;
        }

        .decrease-btn:not(.disabled):hover {
          background: #dc3545;
          color: white;
        }

        .decrease-btn.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .increase-btn {
          color: #198754;
        }

        .increase-btn:hover {
          background: #198754;
          color: white;
        }

        .quantity-value {
          font-weight: 600;
          min-width: 30px;
          text-align: center;
        }

        .price-section {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid #eee;
        }

        .price-label {
          margin: 0;
          font-size: 0.9rem;
          color: #666;
        }

        .price-value {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 600;
          color: #FB641B;
        }

        @media (max-width: 768px) {
          .card-image-container {
            height: 180px;
          }

          .card-content {
            padding: 15px;
          }

          .card-title {
            font-size: 1.1rem;
          }
        }
      `}</style>
    </div>
  );
}
