import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBListGroup,
  MDBListGroupItem,
  MDBRipple,
  MDBRow,
  MDBTooltip,
  MDBTypography,
} from "mdb-react-ui-kit";
import { ToastContainer, toast } from "react-toastify";
import { useCart, useDispatchCart } from "../components/ContextReducer";
import { Backendurl } from "../services/helper";
import Navbar from "../components/Navbar";
import axios from "axios";

export default function Cards() {
  const data = useCart();
  const dispatch = useDispatchCart();
  const [userName, setUserName] = useState("");
  const [userPhone, setUserPhone] = useState("");
  const [userAddress, setUserAddress] = useState("");
  const [showOrderForm, setShowOrderForm] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const navigate = useNavigate();

  // -------------------------> total price of the cart <--------------------
  const totalPrice = data.reduce((total, food) => total + food.price, 0);

  // --------------------> discount coupon logic part <-----------------
  // Step 1: Coupon state variables
  const [couponCode, setCouponCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState(0);
  const [appliedDiscount, setAppliedDiscount] = useState(0);
  const [afterDiscountTotalprice, setAfterDiscountTotalprice] =
    useState(totalPrice);
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  let discountedPrice = totalPrice; // Declare discountedPrice outside useEffect and set initial no discount

  // Step 2: Apply coupon function
  const applyCoupon = () => {
    const validCouponCode = ""; // Replace with your valid coupon code
    if (couponCode.length > validCouponCode) {
      // Generate a random discount percentage between 20% and 70%
      const randomDiscount = Math.floor(Math.random() * (50 - 20 + 1)) + 20;
      setDiscountPercentage(randomDiscount);

      // Calculate the discount amount
      const discountAmount = (totalPrice * randomDiscount) / 100;
      setAppliedDiscount(discountAmount);

      // Update the total price after applying the discount
      discountedPrice = totalPrice - discountAmount;
      setAfterDiscountTotalprice(discountedPrice);
      // after succesfully applying the coupon set the isCouponApplied to true it it basically for the update the total price after applying the coupon
      setIsCouponApplied(true);
      // Display a toast message or any other feedback to the user
      toast.success(`Coupon applied! You get ${randomDiscount}% off.`);
    } else {
      // Display an error message for invalid coupon code
      toast.error("Invalid coupon code. Please try again.");
    }
  };

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const authToken = localStorage.getItem("authToken");
    if (user && authToken) {
      setUserName(user.name || "");
      // Get saved phone from localStorage if available
      const savedPhone = localStorage.getItem("userPhone");
      if (savedPhone) {
        setUserPhone(savedPhone);
      }
      // Get saved address from localStorage if available
      const savedAddress = localStorage.getItem("userAddress");
      if (savedAddress) {
        setUserAddress(savedAddress);
      }
    }
  }, []);

  // -------------->for the current time and date of the delivery of the food <----------------
  const [countdown, setCountdown] = useState({ minutes: 30, seconds: 0 });
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveredTime, setDeliveredTime] = useState("");

  useEffect(() => {
    const calculateCountdown = () => {
      if (countdown.minutes === 0 && countdown.seconds === 0) {
        // Countdown reached, do something or set state accordingly
        return;
      }
      // use spread operator to copy the state object and update the state (basically clone the original state and update the state)
      const newCountdown = { ...countdown };

      if (newCountdown.seconds === 0) {
        newCountdown.minutes -= 1;
        newCountdown.seconds = 59;
      } else {
        newCountdown.seconds -= 1;
      }

      setCountdown(newCountdown);
    };

    const intervalId = setInterval(calculateCountdown, 1000); // after every 1 second the calculateCountdown function will be called

    return () => clearInterval(intervalId);
  }, [countdown]);

  useEffect(() => {
    const now = new Date();
    // Format current time
    const currentPlus30Minutes = new Date(now.getTime() + 30 * 60000);
    const formattedCurrentTime = `${
      currentPlus30Minutes.getHours() >= 12 ? "PM" : "AM"
    }`;

    // const formattedCurrentTime = `${now.getHours()}:${now.getMinutes()} ${
    //   now.getHours() >= 12 ? "PM" : "AM"
    // }`;

    const deliveryDate = new Date(
      now.getTime() + countdown.minutes * 60000 + countdown.seconds * 1000
    );

    // Format delivery date
    const formattedDeliveryDate = `${deliveryDate.getDate()}.${
      deliveryDate.getMonth() + 1
    }.${deliveryDate.getFullYear()}`;

    // Format delivered time
    const formattedDeliveredTime = `${deliveryDate.getHours()}:${deliveryDate.getMinutes()} ${formattedCurrentTime}`;

    setDeliveryDate(formattedDeliveryDate);
    setDeliveredTime(formattedDeliveredTime);
  }, [countdown]);

  // ------------------------> checkout function <------------------------
  const handleCheckOut = async () => {
    try {
      const authToken = localStorage.getItem("authToken");
      let userEmail = localStorage.getItem("userEmail");
      const userName = localStorage.getItem("userName");

      // Log authentication data for debugging
      console.log("Auth data for checkout:", {
        authToken: authToken ? "Present" : "Missing",
        userEmail: userEmail || "Missing",
        userName: userName || "Missing"
      });

      // Check authentication
      if (!authToken) {
        toast.error("Please login to checkout");
        navigate("/login");
        return;
      }

      // If userEmail is not in localStorage (OTP login case), try to get it from the token
      if (!userEmail && authToken) {
        try {
          // Decode the JWT token to get the email
          const tokenPayload = JSON.parse(atob(authToken.split('.')[1]));
          userEmail = tokenPayload.email;
          console.log("Extracted email from token:", userEmail);
        } catch (tokenError) {
          console.error("Error decoding token:", tokenError);
          toast.error("Authentication error. Please login again");
          navigate("/login");
          return;
        }
      }

      // Validate cart
      if (!data || data.length === 0) {
        toast.error("Your cart is empty");
        return;
      }

      // Validate address
      if (!userAddress || userAddress.trim().length < 5) {
        toast.error("Please enter a valid delivery address");
        return;
      }

      // Save address to localStorage
      localStorage.setItem("userAddress", userAddress);

      // Generate order ID
      const orderId = 'ORD' + Date.now();

      // Prepare order data
      const orderData = {
        order_data: data.map(item => ({
          id: item.id,
          name: item.name,
          qty: item.qty,
          size: item.size,
          price: item.price,
          img: item.img
        })),
        total_price: totalPrice,
        discount: appliedDiscount || 0,
        final_price: isCouponApplied ? afterDiscountTotalprice : totalPrice,
        email: userEmail,
        order_date: new Date().toISOString(),
        delivery_address: userAddress.trim(),
        customer_name: userName || "Guest",
        order_id: orderId,
        status: 'pending',
        payment_status: 'Pending',
        payment_method: 'Cash on Delivery'
      };

      console.log("Sending order data:", orderData); // Debug log

      const response = await axios.post(
        `${Backendurl}/api/auth/orderData`,
        orderData,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${authToken}`
          },
        }
      );

      console.log("Server response:", response.data); // Debug log

      if (response.data.success) {
        toast.success("Order placed successfully!");
        
        // Clear cart after successful order
        setTimeout(() => {
          dispatch({ type: "DROP" });
          navigate("/myOrder");
        }, 1500);
      } else {
        toast.error(response.data.message || "Failed to place order");
      }
    } catch (error) {
      console.error("Order error details:", {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });

      if (error.response?.status === 401) {
        toast.error("Session expired. Please login again");
        localStorage.removeItem("authToken"); // Clear the invalid token
        navigate("/login");
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else if (!navigator.onLine) {
        toast.error("Please check your internet connection");
      } else {
        toast.error("Unable to place order. Please try again later");
      }
    }
  };

  // -------> to increase or decrease the quantity of the food then update the price accordingly <--------
  const handleQuantityChange = (foodItem, quantityChange) => {
    const newQuantity = foodItem.qty + quantityChange;

    if (newQuantity > 0) {
      // Update the quantity in the cart
      dispatch({
        type: "UPDATE",
        id: foodItem.id,
        qty: newQuantity,
        price: foodItem.price,
      });
    } else {
      // Remove the item from the cart
      dispatch({ type: "REMOVE", index: data.indexOf(foodItem) });
    }
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (!userAddress || userAddress.trim().length < 5) {
      errors.address = "Please enter a valid delivery address (minimum 5 characters)";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleCheckOut();
    }
  };

  // -------------> when the cart is empty then display this message to the user <----------------
  if (data.length === 0) {
    return (
      <>
        <Navbar />
        <div
          className="m-5 fs-3 d-flex justify-content-center"
          style={{ color: "#EEF5FF", textAlign: "center" }}
        >
          <span className="text-black">
            Hey{" "}
            <span style={{ color: "#FB641B" }}>
              {userName && userName.toUpperCase()}
            </span>
            , dive into our menu, add some delicious delights to your cart, and
            get ready to savor a delightful meal!
          </span>
        </div>
      </>
    );
  }

  return (
    <div>
      <Navbar />
      <section className="h-100 gradient-custom">
        <MDBContainer className="py-5 h-100">
          <MDBRow className="justify-content-center my-4">
            <MDBCol md="8">
              {/*  Expected delivery section  */}
              <MDBCard className="mb-4 bg-white">
                <MDBCardBody className="text-black">
                  <p>
                    <strong>
                      Expected delivery On{" "}
                      <span className="text-success">{deliveryDate}</span> At{" "}
                      <span className="text-success"> {deliveredTime}</span>
                    </strong>
                  </p>
                  <div className="d-flex justify-content-between">
                    <div>
                      <p className="mb-0">
                        Your Order is Delivered Within{" "}
                        <strong className="text-success">
                          {countdown.minutes.toString().padStart(2, "0")}
                        </strong>{" "}
                        minutes :
                        <strong className="text-success">
                          {countdown.seconds.toString().padStart(2, "0")}
                        </strong>{" "}
                        seconds
                      </p>
                    </div>
                  </div>
                </MDBCardBody>
              </MDBCard>

              {/* Customer Food details Part  */}
              <MDBCard className="mb-4 bg-white text-black">
                <MDBCardHeader className="py-3">
                  <MDBTypography tag="h5" className="mb-0">
                    Cart - {data.length} items
                  </MDBTypography>
                </MDBCardHeader>

                <MDBCardBody>
                  {data.map((food, index) => (
                    <MDBRow key={index} className="mb-4">
                      <MDBCol lg="3" md="12" className="mb-4 mb-lg-0">
                        <MDBRipple
                          rippleTag="div"
                          rippleColor="light"
                          className="bg-image rounded hover-zoom hover-overlay"
                        >
                          <img
                            src={food.img}
                            className="w-100 h-100 rounded"
                            alt={food.name}
                            style={{ maxWidth: "100%", maxHeight: "100%" }}
                          />
                          <a href="#!">
                            <div
                              className="mask"
                              style={{
                                backgroundColor: "rgba(251, 251, 251, 0.2)",
                              }}
                            ></div>
                          </a>
                        </MDBRipple>
                      </MDBCol>

                      <MDBCol lg="5" md="6" className=" mb-4 mb-lg-0">
                        <p>
                          <strong>{food.name}</strong>
                        </p>
                        <p>
                          <strong>Size:</strong> {food.size}
                        </p>

                        <MDBTooltip
                          wrapperProps={{ size: "sm" }}
                          wrapperClass="me-1 mb-2"
                          title="Remove item"
                        >
                          <MDBIcon
                            fas
                            icon="trash"
                            onClick={() =>
                              dispatch({ type: "REMOVE", index: index })
                            }
                          />
                        </MDBTooltip>

                        <MDBTooltip
                          wrapperProps={{ size: "sm", color: "danger" }}
                          wrapperClass="me-1 mb-2"
                          title="Move to the wish list"
                        >
                          <MDBIcon fas icon="heart" />
                        </MDBTooltip>
                      </MDBCol>

                      {/* Logic for updating the price of the food in real-time */}
                      <MDBCol lg="4" md="6" className="mb-4 mb-lg-0">
                        <div
                          className="d-flex mb-4"
                          style={{ maxWidth: "300px" }}
                        >
                          <MDBBtn
                            className="px-3 me-2 quantity-btn decrease-btn"
                            onClick={() => handleQuantityChange(food, -1)}
                            style={{
                              backgroundColor: 'transparent',
                              color: '#dc3545',
                              border: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#dc3545';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#dc3545';
                            }}
                          >
                            <MDBIcon fas icon="minus" />
                          </MDBBtn>

                          <MDBInput
                            value={food.qty}
                            min={0}
                            className="text-black bg-white text-center"
                            type="number"
                            label="Quantity"
                            onChange={(e) =>
                              handleQuantityChange(
                                food,
                                e.target.value - food.qty
                              )
                            }
                          />

                          <MDBBtn
                            className="px-3 ms-2 quantity-btn increase-btn"
                            onClick={() => handleQuantityChange(food, 1)}
                            style={{
                              backgroundColor: 'transparent',
                              color: '#198754',
                              border: 'none',
                              transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                              e.currentTarget.style.backgroundColor = '#198754';
                              e.currentTarget.style.color = 'white';
                            }}
                            onMouseOut={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              e.currentTarget.style.color = '#198754';
                            }}
                          >
                            <MDBIcon fas icon="plus" />
                          </MDBBtn>
                        </div>

                        <p className="text-start text-md-center">
                          <strong>{`₹ ${food.price} /-`}</strong>
                        </p>
                      </MDBCol>
                    </MDBRow>
                  ))}

                  <hr className="my-4" />
                </MDBCardBody>
              </MDBCard>

              {/* Order Details Form */}
              {showOrderForm && (
                <MDBCard className="mb-4">
                  <MDBCardHeader>
                    <MDBTypography tag="h5" className="fw-bold mb-0">
                      Delivery Address
                    </MDBTypography>
                  </MDBCardHeader>
                <MDBCardBody>
                    <form onSubmit={handleFormSubmit}>
                      <div className="mb-4">
                        <MDBInput
                          type="textarea"
                          rows={3}
                          label="Delivery Address"
                          placeholder="Enter complete address (House/Flat No, Street, Area, City)"
                          value={userAddress}
                          onChange={(e) => {
                            setUserAddress(e.target.value);
                            setFormErrors({ ...formErrors, address: "" });
                          }}
                          className={formErrors.address ? "is-invalid" : ""}
                          required
                        />
                        {formErrors.address && (
                          <div className="invalid-feedback">{formErrors.address}</div>
                        )}
                        <small className="form-text text-muted mt-1">
                          Please include house/flat number, street name, area, and city for accurate delivery
                        </small>
                      </div>

                      <div className="d-flex justify-content-between">
                        <MDBBtn
                          color="secondary"
                          onClick={() => setShowOrderForm(false)}
                        >
                          Back to Cart
                        </MDBBtn>
                        <MDBBtn
                          type="submit"
                          color="success"
                        >
                          Place Order
                        </MDBBtn>
                      </div>
                    </form>
                </MDBCardBody>
              </MDBCard>
              )}
            </MDBCol>

            {/*  checkout section  */}
            <MDBCol md="4">
              <MDBCard className="mb-4 bg-white">
                <MDBCardHeader>
                  <MDBTypography
                    tag="h5"
                    className="mb-0 fs-3"
                    style={{ color: "#878787" }}
                  >
                    Summary
                  </MDBTypography>
                </MDBCardHeader>
                <MDBCardBody>
                  <MDBListGroup flush>
                    <MDBListGroupItem className="d-flex text-black justify-content-between align-items-center border-0 px-0 pb-0 bg-white fs-5">
                      Price
                      <span>{`₹ ${totalPrice} /-`}</span>
                    </MDBListGroupItem>

                    {/* Display applied coupon details */}
                    {/* here first we check the if  discountPercentage and  appliedDiscount is more than 0 then we display the coupon discount or discunted price  */}
                    {discountPercentage > 0 && appliedDiscount && (
                      <>
                        <MDBListGroupItem className="d-flex text-black justify-content-between align-items-center px-0 bg-white fs-5">
                          <span>Coupon Discount</span>
                          <span className="text-success">
                            <strong>{`-${discountPercentage}% `}</strong>
                            <span>Off</span>
                          </span>
                        </MDBListGroupItem>
                        <MDBListGroupItem className="d-flex text-black justify-content-between align-items-center px-0 bg-white fs-5">
                          <span>Discounted Price</span>
                          <span className="text-success">
                            <strong>{`₹ ${appliedDiscount} /-`}</strong>
                          </span>
                        </MDBListGroupItem>
                      </>
                    )}
                    {/* UI for applying coupon */}
                    <MDBListGroupItem className="d-flex text-black justify-content-between align-items-center px-0 bg-white fs-5">
                      {/* when coupon is applied then we show the remove coupon button other wise applied coupon button  */}
                      {isCouponApplied ? (
                        <MDBBtn
                          color="danger"
                          size="sm"
                          onClick={() => {
                            setDiscountPercentage(0);
                            setAppliedDiscount(0);
                            setAfterDiscountTotalprice(totalPrice);
                            setIsCouponApplied(false);
                          }}
                        >
                          Remove Coupon
                        </MDBBtn>
                      ) : (
                        <>
                          <MDBInput
                            label="Enter Coupon Code"
                            placeholder="MomsMagic"
                            value={couponCode}
                            style={{ backgroundColor: "white", color: "black" }}
                            onChange={(e) => setCouponCode(e.target.value)}
                          />
                          <MDBBtn
                            size="sm"
                            onClick={applyCoupon}
                            className="text-white"
                            style={{
                              fontSize: "11px",
                              padding: "0.25rem 0.5rem",
                              // backgroundColor: "green",
                            }}
                          >
                            Apply Coupon
                          </MDBBtn>
                        </>
                      )}
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex text-black justify-content-between align-items-center px-0 bg-white fs-5">
                      <span>Delivery Charges</span>
                      <span className="text-success">
                        <del className="text-black">₹45</del> Free
                      </span>
                    </MDBListGroupItem>
                    <MDBListGroupItem className="d-flex text-black justify-content-between align-items-center border-0 px-0 mb-3 bg-white">
                      <div>
                        <strong className="fs-4">Total amount</strong>
                        <strong>
                          <p className="mb-0">(including GST)</p>
                        </strong>
                      </div>
                      {/* when coupon is applied then we so the after discount total price of the food other wise total price */}
                      {isCouponApplied ? (
                        <span className="fs-5">
                          <strong>{`₹ ${afterDiscountTotalprice} /-`}</strong>
                        </span>
                      ) : (
                        <span className="fs-5">
                          <strong>{`₹ ${totalPrice} /-`}</strong>
                        </span>
                      )}
                    </MDBListGroupItem>
                  </MDBListGroup>

                  {!showOrderForm && (
                    <MDBBtn 
                      block 
                      size="lg" 
                      onClick={() => setShowOrderForm(true)}
                      disabled={data.length === 0}
                    >
                      Proceed to Checkout
                  </MDBBtn>
                  )}
                </MDBCardBody>
              </MDBCard>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
        <ToastContainer />
      </section>
    </div>
  );
}

<style jsx>{`
  .table {
    margin-bottom: 2rem;
  }

  .table th {
    background: #f8f9fa;
    font-weight: 600;
  }

  .table td, .table th {
    vertical-align: middle;
  }

  .btn-danger, .btn-success {
    padding: 0.375rem 0.75rem;
    font-size: 0.9rem;
  }

  @media (max-width: 768px) {
    .container {
      padding: 0 0.5rem;
    }

    .table {
      font-size: 0.9rem;
    }

    .table td, .table th {
      padding: 0.5rem;
    }

    .btn-danger, .btn-success {
      padding: 0.25rem 0.5rem;
      font-size: 0.8rem;
    }

    .total-price {
      font-size: 1.2rem;
      margin: 1rem 0;
    }

    .checkout-btn {
      width: 100%;
      margin-bottom: 1rem;
    }
  }

  @media (max-width: 576px) {
    .table {
      font-size: 0.8rem;
    }

    .table td, .table th {
      padding: 0.4rem;
    }

    .quantity-controls {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 0.25rem;
    }
  }
`}</style>
