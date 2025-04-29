import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Navbar from "../components/Navbar";
import UpdatePhoneNumberModal from "../Modals/UpdatePhoneNumberModal";
import UpdateAddressModal from "../Modals/UpdateAddressModal";
import DeleteAccountModal from "../Modals/DeleteAccountModal";
import { Backendurl } from "../services/helper.js";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

export default function UserProfile() {
  const [credentials, setCredentials] = useState({
    userName: "",
    userAddress: "",
    userPhoneNumber: "",
    userImage: null,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showUpdatePhoneModal, setShowUpdatePhoneModal] = useState(false);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  const navigate = useNavigate();

  const handleShowUpdatePhoneModal = () => setShowUpdatePhoneModal(true);
  const handleClosePhoneModal = () => setShowUpdatePhoneModal(false);
  const handleShowAddressModal = () => setShowAddressModal(true);
  const handleCloseAddressModal = () => setShowAddressModal(false);
  const handleShowDeleteAccountModal = () => setShowDeleteAccountModal(true);
  const handleCloseDeleteAccountModal = () => setShowDeleteAccountModal(false);

  const getUserDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      // Check if user is logged in
      const userEmail = localStorage.getItem("userEmail");
      const authToken = localStorage.getItem("authToken");

      if (!authToken) {
        toast.error("Please log in to view your profile");
        navigate("/login");
        return;
      }

      const response = await fetch(`${Backendurl}/api/auth/getUserDetails`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: userEmail,
        }),
      });

      const json = await response.json();
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.clear(); // Clear all auth data
          navigate("/login");
          throw new Error("Session expired. Please login again.");
        }
        throw new Error(json.message || "Failed to fetch user details");
      }

      if (json.success) {
        setCredentials({
          userName: json.userName || "",
          userAddress: json.userAddress || "",
          userPhoneNumber: json.userPhoneNumber || "",
          userImage: json.userImage || null,
        });
        localStorage.setItem("userName", json.userName || "");
      } else {
        throw new Error(json.message || "Failed to fetch user details");
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setError(error.message || "An error occurred while fetching your details");
      if (error.message.includes("unauthorized") || error.message.includes("token")) {
        localStorage.clear(); // Clear all auth data
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Check authentication before fetching user details
    const authToken = localStorage.getItem("authToken");
    if (!authToken) {
      navigate("/login");
      return;
    }
    getUserDetails();
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-vh-100 d-flex justify-content-center align-items-center" style={{ 
        background: "linear-gradient(135deg,rgb(172, 196, 193) 0%, #F5F9FF 100%)",
      }}>
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-vh-100" style={{ 
      background: "linear-gradient(135deg,rgb(172, 196, 193) 0%, #F5F9FF 100%)",
    }}>
      <Navbar />
      
      <Container className="py-5">
        <Row className="justify-content-center">
          <Col lg={8} md={10}>
            {error && (
              <div className="alert alert-danger mb-4" role="alert">
                {error}
                <Button 
                  variant="link" 
                  className="p-0 ms-3 text-danger" 
                  onClick={() => {
                    setError(null);
                    getUserDetails();
                  }}
                >
                  Retry
                </Button>
              </div>
            )}

            {/* Profile Header */}
            <div className="text-center mb-4">
              <div className="d-flex flex-column align-items-center">
                <div 
                  className="position-relative mb-3"
                  style={{
                    padding: "4px",
                    background: "linear-gradient(45deg, #ffffff, #2196F3)",
                    borderRadius: "50%",
                    display: "inline-block"
                  }}
                >
                  <div style={{
                    background: "#fff",
                    borderRadius: "50%",
                    padding: "4px",
                  }}>
                    {credentials.userImage ? (
                      <img
                        src={`data:${credentials.userImage.contentType};base64,${credentials.userImage.data}`}
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          border: "4px solid #fff",
                          boxShadow: "0 10px 25px rgba(33, 150, 243, 0.2)"
                        }}
                      />
                    ) : (
                      <img
                        src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava1-bg.webp"
                        alt="Profile"
                        className="rounded-circle"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                          border: "4px solid #fff",
                          boxShadow: "0 10px 25px rgba(33, 150, 243, 0.2)"
                        }}
                      />
                    )}
                  </div>
                </div>
                <div className="text-center">
                  <h2 className="fw-bold mb-1" style={{ 
                    color: "#000000",
                    fontSize: "2.2rem",
                    position: "relative",
                    display: "inline-block",
                    paddingBottom: "8px",
                  }}>
                    {credentials.userName && credentials.userName.toUpperCase()}
                    <div style={{
                      position: "absolute",
                      bottom: 0,
                      left: "50%",
                      transform: "translateX(-50%)",
                      height: "3px",
                      width: "80%",
                      background: "linear-gradient(to right, transparent, #2196F3, transparent)",
                    }}></div>
                  </h2>
                  <p style={{ 
                    color: "#1565C0", 
                    fontWeight: "500",
                    marginBottom: "2rem",
                    fontSize: "1.1rem"
                  }}>Food Enthusiast</p>
                </div>
              </div>
            </div>

            {/* Information Cards */}
            <Card className="border-0 shadow-sm" style={{
              background: "rgba(255, 255, 255, 0.9)",
              backdropFilter: "blur(10px)",
            }}>
              <Card.Body className="p-4">
                <h4 className="mb-4" style={{ 
                  color: "#000000",
                  borderBottom: "2px solid #2196F3",
                  paddingBottom: "0px",
                  display: "inline-block"
                }}>
                  Personal Information
                </h4>
                
                <div className="mb-3 p-3" style={{ 
                  background: "linear-gradient(135deg, #ffffff 0%, #F5F9FF 100%)",
                  borderRadius: "15px",
                  boxShadow: "0 5px 15px rgba(33, 150, 243, 0.05)",
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1" style={{ 
                        fontSize: "0.9rem", 
                        color: "#344767",
                        fontWeight: "500"
                      }}>Email Address</p>
                      <h6 className="mb-0" style={{ color: "#000000", fontWeight: "600" }}>{localStorage.getItem("userEmail")}</h6>
                    </div>
                    <i className="fas fa-envelope" style={{ color: "#2196F3" }}></i>
                  </div>
                </div>

                <div className="mb-3 p-3" style={{ 
                  background: "linear-gradient(135deg, #ffffff 0%, #F5F9FF 100%)",
                  borderRadius: "15px",
                  boxShadow: "0 5px 15px rgba(33, 150, 243, 0.05)",
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1" style={{ 
                        fontSize: "0.9rem", 
                        color: "#344767",
                        fontWeight: "500"
                      }}>Phone Number</p>
                      <h6 className="mb-0" style={{ color: "#000000", fontWeight: "600" }}>
                        {credentials.userPhoneNumber || "Not set"}
                      </h6>
                    </div>
                    <Button
                      variant="link"
                      onClick={handleShowUpdatePhoneModal}
                      style={{ color: "#2196F3" }}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                  </div>
                </div>

                <div className="p-3" style={{ 
                  background: "linear-gradient(135deg, #ffffff 0%, #F5F9FF 100%)",
                  borderRadius: "15px",
                  boxShadow: "0 5px 15px rgba(33, 150, 243, 0.05)",
                }}>
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <p className="mb-1" style={{ 
                        fontSize: "0.9rem", 
                        color: "#344767",
                        fontWeight: "500"
                      }}>Delivery Address</p>
                      <h6 className="mb-0" style={{ color: "#000000", fontWeight: "600" }}>
                        {credentials.userAddress || "Not set"}
                      </h6>
                    </div>
                    <Button
                      variant="link"
                      onClick={handleShowAddressModal}
                      style={{ color: "#2196F3" }}
                    >
                      <i className="fas fa-edit"></i>
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Update Buttons */}
      <div className="d-flex justify-content-center gap-3 mt-4">
        <Button
          variant="outline-primary"
          onClick={handleShowUpdatePhoneModal}
          style={{
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
        >
          <i className="fas fa-phone me-2"></i>
          Update Phone Number
        </Button>
        <Button
          variant="outline-primary"
          onClick={handleShowAddressModal}
          style={{
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
        >
          <i className="fas fa-map-marker-alt me-2"></i>
          Update Address
        </Button>
        <Button
          variant="outline-danger"
          onClick={handleShowDeleteAccountModal}
          style={{
            borderRadius: "10px",
            padding: "10px 20px",
            fontWeight: "500",
            transition: "all 0.3s ease"
          }}
        >
          <i className="fas fa-trash-alt me-2"></i>
          Delete Account
        </Button>
      </div>

      {/* Modals */}
      <UpdatePhoneNumberModal
        show={showUpdatePhoneModal}
        handleClose={handleClosePhoneModal}
        onUpdate={getUserDetails}
        userEmail={localStorage.getItem("userEmail")}
        authToken={localStorage.getItem("authToken")}
      />
      <UpdateAddressModal
        show={showAddressModal}
        handleClose={handleCloseAddressModal}
        onUpdate={getUserDetails}
        userEmail={localStorage.getItem("userEmail")}
        authToken={localStorage.getItem("authToken")}
      />
      <DeleteAccountModal
        show={showDeleteAccountModal}
        handleClose={handleCloseDeleteAccountModal}
        userEmail={localStorage.getItem("userEmail")}
        authToken={localStorage.getItem("authToken")}
      />
      
      <ToastContainer position="top-center" />
      <br />  <br />
    </div>
  );
}
