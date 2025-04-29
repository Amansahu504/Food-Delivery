import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { Container, Card, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Backendurl } from "../services/helper.js";

// https://getbootstrap.com/docs/5.0/forms/overview/
export default function Signup() {
  const [credentials, setCredentials] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    location: "",
    phoneNumber: "",
  });
  const [selectedImage, setSelectedImage] = useState(null);

  let navigate = useNavigate();

  const handleClick = async (e) => {
    e.preventDefault();
    
    // Show loading state
    toast.info("Fetching your location...");
    
    // Configure geolocation options
    const options = {
      enableHighAccuracy: true,
      timeout: 15000, // Increased timeout to 15 seconds
      maximumAge: 0
    };

    try {
      // Get current position with options
      const position = await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject, options);
      });

      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      console.log('Coordinates:', { latitude, longitude });

      // Make API call to backend
      const response = await fetch(`${Backendurl}/api/auth/getlocation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ 
          latlong: { 
            lat: latitude, 
            long: longitude 
          } 
        }),
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const responseData = await response.json();
      console.log('Response data:', responseData);

      if (!responseData.success) {
        throw new Error(responseData.message || 'Failed to get location');
      }

      // Update the credentials with the location
      setCredentials(prev => ({ ...prev, location: responseData.location }));
      toast.success("Location fetched successfully!");
    } catch (error) {
      console.error("Error fetching location:", error);
      
      // Handle specific error cases
      if (error.code === 1) {
        toast.error("Please allow location access in your browser settings");
      } else if (error.code === 2) {
        toast.error("Location service is unavailable. Please check your device settings");
      } else if (error.code === 3) {
        toast.error("Location request timed out. Please try again");
      } else if (error.message.includes('Failed to fetch')) {
        toast.error("Network error. Please check your internet connection");
      } else if (error.message.includes('Server error')) {
        toast.error("Server error. Please try again later");
      } else {
        toast.error(error.message || "Failed to fetch location. Please try again");
      }
      
      // Set a default location if needed
      setCredentials(prev => ({ 
        ...prev, 
        location: "Location fetch failed. Please enter manually." 
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setCredentials({
      ...credentials,
      [name]: type === "checkbox" ? !credentials[name] : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate required fields
    if (!credentials.name || !credentials.email || !credentials.password || !credentials.confirmPassword || !credentials.location || !credentials.phoneNumber) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Validate image
    if (!selectedImage) {
      toast.error("Please select a profile image");
      return;
    }

    const formData = new FormData();
    formData.append("name", credentials.name);
    formData.append("email", credentials.email);
    formData.append("password", credentials.password);
    formData.append("confirmPassword", credentials.confirmPassword);
    formData.append("location", credentials.location);
    formData.append("phoneNumber", credentials.phoneNumber);
    formData.append("img", selectedImage);

    try {
      console.log("Sending registration request...");
      const response = await fetch(`${Backendurl}/api/auth/createuser`, {
        method: "POST",
        body: formData,
      });

      console.log("Response status:", response.status);
      const json = await response.json();
      console.log("Response data:", json);

      if (!json.success) {
        toast.error(json.message || "Registration failed");
      } else {
        toast.success(json.message || "Registration successful");
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      toast.error("Registration failed. Please try again.");
    }
  };
  const sharedInputStyles = {
    backgroundColor: "white",
    color: "#2a2e33",
    border: "1px solid #222222",
    borderRadius: "8px",
  };

  return (
    <div>
      <Navbar></Navbar>
      <Container>
        <Card
          className=" my-4 bg-glass"
          style={{
            border: "none",
            borderRadius: "15px",
          }}
        >
          <Card.Body
            className="p-5 form-background"
            style={{
              backgroundColor: "#FFFFFF",
              borderRadius: "15px",
            }}
          >
            <Card.Title className="text-center mb-4 text-primary">
              <h1>Create an Account</h1>
            </Card.Title>
            <Form onSubmit={handleSubmit} encType="multipart/form-data">
              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="name"
                  required
                  style={{ ...sharedInputStyles }}
                  placeholder="Name"
                  value={credentials.name}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="email"
                  name="email"
                  required
                  style={{ ...sharedInputStyles }}
                  placeholder="Email"
                  value={credentials.email}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="password"
                  required
                  style={{ ...sharedInputStyles }}
                  placeholder="Password"
                  value={credentials.password}
                  onChange={handleChange}
                />
              </Form.Group>
              <Form.Group className="mb-3">
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  required
                  style={{ ...sharedInputStyles }}
                  placeholder="Confirm Password"
                  value={credentials.confirmPassword}
                  onChange={handleChange}
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="tel"
                  name="phoneNumber"
                  required
                  style={{ ...sharedInputStyles }}
                  placeholder="Phone Number"
                  value={credentials.phoneNumber}
                  onChange={handleChange}
                  pattern="[0-9]{10}"
                  title="Please enter a valid 10-digit phone number"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Control
                  type="text"
                  name="location"
                  required
                  style={{ ...sharedInputStyles }}
                  placeholder="Click Below to get Current Location"
                  value={credentials.location}
                  onChange={handleChange}
                />
                <div className="d-flex justify-content-between mt-1">
                  {/* <input type="file" name="profileimage" /> */}
                  <Link
                    className="text-primary"
                    onClick={handleClick}
                    name="location"
                  >
                    Fetch Current Location
                  </Link>
                </div>

                <div
                  className="mt-1"
                  style={{ display: "flex", alignItems: "center" }}
                >
                  {selectedImage && (
                    <div
                      className="rounded-circle"
                      style={{ marginRight: "10px" }}
                    >
                      <img
                        className="rounded-circle"
                        alt="not found"
                        width="100px" // Adjust the width as needed
                        src={URL.createObjectURL(selectedImage)}
                      />
                    </div>
                  )}

                  <input
                    type="file"
                    name="myImage"
                    onChange={(event) => {
                      console.log(event.target.files[0]);
                      setSelectedImage(event.target.files[0]);
                    }}
                  />
                </div>
              </Form.Group>
              <div className="">
                <Button
                  className="w-100"
                  type="submit"
                  // style={{ backgroundColor: "#152F55" }}
                >
                  Register
                </Button>
              </div>
              <div className="d-flex justify-content-center mt-4 ">
                <Link to="/login" className="text-black text-decoration-none">
                  Already a User?{" "}
                  <span className="text-danger text-decoration-underline">
                    LOGIN
                  </span>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      <style>
        {`

        /* Common Style for all the devices */
        .card{
           margin:0 auto;
            width:90%;
        }

          /* Media query for desktops */
        @media(min-width:992px){
          .card{
            width:50%;
          }
        }

         /* Media query for tablets */
        @media(min-width:768px) and (max-width:991px){
          .card{
            width:70%;
          }
        }

      /* Media query for phones */
        @media(max-width:767px){
          .card{
            width:90%;
          }
        }
      `}
      </style>

      <ToastContainer />
    </div>
  );
}
