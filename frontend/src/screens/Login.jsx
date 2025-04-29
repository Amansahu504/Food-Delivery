import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// import Footer from "../components/Footer";
import { LockFill, Google } from "react-bootstrap-icons";
import Navbar from "../components/Navbar";
import { Container, Card, Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Backendurl } from "../services/helper.js";

export default function Login() {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });

  let navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${Backendurl}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: credentials.email,
          password: credentials.password,
        }),
      });
      
      const json = await response.json();
      
      if (json.success) {
        localStorage.setItem("userEmail", credentials.email);
        localStorage.setItem("authToken", json.authToken);
        localStorage.setItem("userName", json.userName);

        toast.success("Login successful!");
        setTimeout(() => {
          navigate("/");
        }, 1000);
      } else {
        toast.error(json.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Something went wrong. Please try again.");
    }
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
  };

  const sharedInputStyles = {
    backgroundColor: "white",
    color: "#2a2e33",
    border: "1px solid #222222",
    borderRadius: "8px",
  };

  return (
    <div>
      <Navbar> </Navbar>
      <Container>
        <Card
          className=" my-5 bg-glass"
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
              <h1>Welcome Back, Log In</h1>
            </Card.Title>
            <Form onSubmit={handleSubmit}>
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

              <Form.Group className="mb-0.75 ">
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

              {/* <div className="mt-4">
                <Link to="/forgotPassword" className="text-danger">
                  <span>Forgot Password ?</span>
                </Link>
              </div> */}
              <br></br>
              <div className="mt-1">
                <Button
                  className="w-100 "
                  // style={{ backgroundColor: "#152F55" }}
                  type="submit"
                >
                  Log In
                </Button>
              </div>

              <div className="d-flex align-items-center justify-content-center mt-2">
                <hr
                  className="bg-black flex-grow-1 mx-2"
                  style={{ height: "2px", backgroundColor: "black" }}
                />
                <span className="mx-2 text-black">OR</span>
                <hr
                  className="bg-black flex-grow-1 mx-2"
                  style={{ height: "2px", backgroundColor: "black" }}
                />
              </div>

              <div className="d-flex justify-content-center mt-2">
                <span className="text-black"> Log In with - {"  "}</span>
                <Link to="/sendotp" className=" text-black ml-3 text-decoration-none ">
                  <span style={{ marginLeft: "5px", marginRight: "5px" }}>
                    {" "}
                    OTP
                  </span>
                  <LockFill className="mr-2" />
                </Link>
                {/* <span className="text-black"> , </span>
                <Link to="/googleAuthentication" className="text-success ml-3">
                  <span style={{ marginRight: "5px", marginLeft: "3px" }}>
                    Google
                  </span>
                  <Google className="mr-2" />
                </Link> */}
              </div>

              <div className=" d-flex justify-content-center mt-4 ">
                <Link
                  to="/createuser"
                  className="text-black text-decoration-none"
                >
                  Don't Have an Account?{" "}
                  <span className="text-danger text-decoration-underline ">
                    REGISTER
                  </span>
                </Link>
              </div>
            </Form>
          </Card.Body>
        </Card>
      </Container>
      <style>
        {`
          /* Common styles for all devices */
          .card {
            margin: 0 auto; /* Center the card */
            width: 90%; /* Adjust the width as needed */
          }

          /* Media query for desktops */
          @media (min-width: 992px) {
            .card {
              width: 50%; /* Adjust the width for desktops */
            }
          }

          /* Media query for tablets */
          @media (min-width: 768px) and (max-width: 991px) {
            .card {
              width: 70%; /* Adjust the width for tablets */
            }
          }

          /* Media query for phones */
          @media (max-width: 767px) and (max-height: 823px) {
            .card {
              width: 90%; /* Adjust the width for phones */
            }
          }
          
        `}
      </style>

      <ToastContainer />
    </div>
  );
}
