import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar.jsx";
import { Container, Card, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Backendurl } from "../services/helper.js";

export default function OtpLogin() {
  const [credentials, setCredentials] = useState({
    otp: "",
  });
  const [loading, setLoading] = useState(false);

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate OTP
    if (!credentials.otp) {
      toast.error("Please enter the OTP");
      return;
    }

    if (!/^\d{6}$/.test(credentials.otp)) {
      toast.error("OTP must be exactly 6 digits");
      return;
    }

    const email = localStorage.getItem("userEmail");
    if (!email) {
      toast.error("Email not found. Please try again");
      navigate("/sendotp");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Backendurl}/api/auth/otplogin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          otp: credentials.otp,
          email: email,
        }),
      });

      const json = await response.json();
      
      if (json.success) {
        // Store authentication data in localStorage
        localStorage.setItem("authToken", json.authToken);
        localStorage.setItem("userName", json.userName);
        localStorage.setItem("userEmail", email); // Keep the email in localStorage
        
        // Log the stored data for debugging
        console.log("Stored auth data:", {
          authToken: json.authToken,
          userName: json.userName,
          userEmail: email
        });
        
        toast.success(json.message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(json.message || "Invalid OTP");
        if (json.expired) {
          setTimeout(() => {
            navigate("/sendotp");
          }, 2000);
        }
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 6);
    setCredentials({ ...credentials, [e.target.name]: value });
  };

  const handleResendOTP = async () => {
    const email = localStorage.getItem("userEmail");
    if (!email) {
      toast.error("Email not found. Please try again");
      navigate("/sendotp");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Backendurl}/api/auth/sendotp`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const json = await response.json();
      if (json.success) {
        toast.success("New OTP sent successfully!");
      } else {
        toast.error(json.message || "Failed to send OTP");
      }
    } catch (error) {
      toast.error("Failed to resend OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const sharedInputStyles = {
    backgroundColor: "white",
    color: "#2a2e33",
    border: "1px solid #222222",
    borderRadius: "8px",
    fontSize: "1.2rem",
    letterSpacing: "0.2rem",
    textAlign: "center"
  };

  return (
    <div>
      <Navbar />
      <Container>
        <Card
          className="my-5 bg-glass"
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
              <h1>Enter Verification Code</h1>
              <p className="text-muted mt-2">
                We've sent a 6-digit code to your email
              </p>
            </Card.Title>
            <Form onSubmit={handleSubmit} className="mt-4">
              <Form.Group className="mb-4">
                <Form.Control
                  type="text"
                  name="otp"
                  required
                  style={sharedInputStyles}
                  placeholder="Enter 6-digit OTP"
                  value={credentials.otp}
                  onChange={handleChange}
                  disabled={loading}
                />
              </Form.Group>

              <div className="mt-4">
                <Button
                  className="w-100"
                  style={{ backgroundColor: "#152F55" }}
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                      Verifying...
                    </>
                  ) : (
                    "Verify OTP"
                  )}
                </Button>
              </div>

              <div className="text-center mt-3">
                <Button
                  variant="link"
                  onClick={handleResendOTP}
                  disabled={loading}
                  className="text-decoration-none"
                >
                  Didn't receive the code? Resend OTP
                </Button>
              </div>

              <div className="d-flex justify-content-center mt-4">
                <Link
                  to="/createuser"
                  className="text-black text-decoration-none"
                >
                  Don't Have an Account?{" "}
                  <span className="text-danger text-decoration-underline">
                    Register
                  </span>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <style>
        {`
          .card {
            margin: 0 auto;
            width: 90%;
          }

          @media (min-width: 992px) {
            .card {
              width: 50%;
            }
          }

          @media (min-width: 768px) and (max-width: 991px) {
            .card {
              width: 70%;
            }
          }

          @media (max-width: 767px) {
            .card {
              width: 90%;
            }
          }
        `}
      </style>
      <ToastContainer />
    </div>
  );
}
