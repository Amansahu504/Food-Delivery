import React from "react";
import { useState } from "react";

export default function Carousel() {
  const [search, setSearch] = useState("");
  return (
    <div>
      <div>
        <div
          id="carouselExampleFade"
          className="carousel slide carousel-fade"
          data-bs-ride="carousel"
          style={{ objectFit: "contain !important" }}
        >
          <div className="carousel-inner" id="carousel">
            <div className="carousel-caption" style={{ zIndex: "10" }}>
              <div className="d-flex justify-content-center">
                {" "}
                <input
                  className="form-control me-2 w-75"
                  type="search"
                  style={{ backgroundColor: "#EEF5FF", color: "#161A1F" }}
                  placeholder="Search in here..."
                  aria-label="Search"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                />
                <button
                  className="btn  text-white searchButton "
                  // style={{
                  //   padding: "8px 16px",
                  //   border: "none",
                  //   borderRadius: "5px",
                  //   // backgroundColor: "#FB641B",
                  // }}
                  onClick={() => {
                    setSearch("");
                  }}
                >
                  Search
                </button>
              </div>
            </div>

            <div className="carousel-item active">
              <img
                src="../images/img1.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(90%)", objectFit: "cover" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="../images/img2.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(90%)", objectFit: "cover" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="../images/img3.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(90%)", objectFit: "cover" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="../images/img4.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(90%)", objectFit: "cover" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="../images/img5.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(90%)", objectFit: "cover" }}
                alt="..."
              />
            </div>
            <div className="carousel-item">
              <img
                src="../images/img6.jpg"
                className="d-block w-100"
                style={{ filter: "brightness(90%)", objectFit: "cover" }}
                alt="..."
              />
            </div>
          </div>
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Previous</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselExampleFade"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Next</span>
          </button>
        </div>
      </div>
    </div>
  );
}
