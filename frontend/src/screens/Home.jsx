import React, { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import food_items from "./data/food_items.json";
import foodCategory from "./data/food_categories.json";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Card from "../components/Card";
import { Search, Filter } from "react-bootstrap-icons";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [filteredItems, setFilteredItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter items based on search and category
  useEffect(() => {
    const filtered = food_items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = selectedCategory === "All" || item.CategoryName === selectedCategory;
      return matchesSearch && matchesCategory;
    });
    setFilteredItems(filtered);
  }, [search, selectedCategory]);

  const categories = ["All", ...new Set(food_items.map((item) => item.CategoryName))];

  return (
    <div className="home-container">
        <Navbar />
      
      {/* Hero Section with Search */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Mom's Magic Food</h1>
          <p className="hero-subtitle">Delicious homemade food delivered to your doorstep</p>
          
          <div className="search-container">
            <div className="search-box">
              <Search className="search-icon" />
                <input
                className="search-input"
                type="text"
                placeholder="Search for food..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            
            <div className="category-filter">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`category-btn ${selectedCategory === category ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Food Items Display */}
      <div className="container food-container">
        {isLoading ? (
          <div className="loading-container">
            <div className="spinner"></div>
            <p>Loading delicious food for you...</p>
              </div>
        ) : filteredItems.length > 0 ? (
          <div className="food-grid">
            {filteredItems.map((item) => (
              <div key={item.id} className="food-item">
                      <Card
                  foodName={item.name}
                  item={item}
                  options={item.options[0]}
                  ImgSrc={item.img}
                      />
                    </div>
            ))}
            </div>
        ) : (
          <div className="no-results">
            <h3>No items found</h3>
            <p>Try adjusting your search or filter</p>
            <button 
              className="reset-button"
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
              }}
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

        <Footer />
      <ToastContainer />

      <style jsx>{`
        .home-container {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
        }
        
        .hero-section {
          background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                      url('https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mzh8fGZvb2R8ZW58MHx8MHx8fDA%3D');
          background-size: cover;
          background-position: center;
          height: 400px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          color: white;
          margin-bottom: 40px;
        }
        
        .hero-content {
          max-width: 800px;
          padding: 0 20px;
        }
        
        .hero-title {
          font-size: 3rem;
          font-weight: bold;
          margin-bottom: 10px;
          text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
        }
        
        .hero-subtitle {
          font-size: 1.2rem;
          margin-bottom: 30px;
          text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
        }
        
        .search-container {
          display: flex;
          flex-direction: column;
          gap: 15px;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .search-box {
          position: relative;
          display: flex;
          align-items: center;
        }
        
        .search-icon {
          position: absolute;
          left: 15px;
          color: #666;
        }
        
        .search-input {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: none;
          border-radius: 30px;
          font-size: 1rem;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
        }
        
        .category-filter {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
          justify-content: center;
        }
        
        .category-btn {
          padding: 8px 20px;
          border: none;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          cursor: pointer;
          transition: all 0.3s;
        }
        
        .category-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }
        
        .category-btn.active {
          background: #FB641B;
        }
        
        .food-container {
          padding: 20px;
          flex-grow: 1;
        }
        
        .food-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 30px;
        }
        
        .food-item {
          transition: transform 0.3s ease;
        }
        
        .food-item:hover {
          transform: translateY(-5px);
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 50px;
        }
        
        .spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #FB641B;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin-bottom: 20px;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .no-results {
          text-align: center;
          padding: 50px 20px;
        }
        
        .reset-button {
          background-color: #FB641B;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 20px;
          margin-top: 15px;
          cursor: pointer;
          transition: background-color 0.3s;
        }
        
        .reset-button:hover {
          background-color: #e55a17;
        }
        
        @media (max-width: 768px) {
          .hero-title {
            font-size: 2rem;
          }
          
          .hero-subtitle {
            font-size: 1rem;
          }
          
          .search-container {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
