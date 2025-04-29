import React, { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import { Backendurl } from "../services/helper";
import { Link } from "react-router-dom";
import {
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBProgress,
  MDBProgressBar,
  MDBRow,
  MDBTypography,
  MDBBadge,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function MyOrder() {
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const checkAndUpdateStatus = (orders) => {
    if (!orders) return orders;
    
    return orders.map(order => {
      const orderDate = new Date(order.order_date);
      const currentTime = new Date();
      const hoursDiff = (currentTime - orderDate) / (1000 * 60 * 60);
      
      let updatedOrder = { ...order };

      // Update order status after 1 hour
      if (order.status === 'pending' && hoursDiff >= 1) {
        updatedOrder.status = 'confirmed';
      }

      // Update payment status after 1 hour
      if ((!order.payment_status || order.payment_status === "Pending") && hoursDiff >= 1) {
        updatedOrder.payment_status = "Done";
      }

      return updatedOrder;
    });
  };

  const fetchMyOrder = async () => {
    try {
      setError(null);
      const userEmail = localStorage.getItem("userEmail");
      const authToken = localStorage.getItem("authToken");

      if (!userEmail || !authToken) {
        setOrderData(null);
        setLoading(false);
        return;
      }

      const response = await fetch(`${Backendurl}/api/auth/myOrderData`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: userEmail
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.orderData) {
        if (!data.orderData.order_data || !Array.isArray(data.orderData.order_data)) {
          setOrderData({ order_data: [] });
          setLoading(false);
          return;
        }

        // Filter valid orders and ensure all required fields are present
        const filteredOrders = data.orderData.order_data.filter(order => 
          order && 
          order.order_id && 
          order.customer_name && 
          order.delivery_address
        );
        
        // Check and update orders status
        const updatedOrders = checkAndUpdateStatus(filteredOrders);
        
        // Sort orders by date (latest first)
        const sortedOrders = updatedOrders.sort((a, b) => {
          const dateA = new Date(a.order_date);
          const dateB = new Date(b.order_date);
          return dateB - dateA;
        });
        
        setOrderData({
          ...data.orderData,
          order_data: sortedOrders
        });
      } else {
        setError(data.message || "Failed to fetch orders");
        setOrderData(null);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to fetch orders. Please try again.");
      setOrderData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyOrder();
    // Set up an interval to check orders every minute
    const intervalId = setInterval(() => {
      fetchMyOrder();
    }, 60000); // Check every minute

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'warning',
      confirmed: 'info',
      preparing: 'primary',
      out_for_delivery: 'info',
      delivered: 'success'
    };
    return colors[status] || 'secondary';
  };

  const getProgressValue = (status) => {
    const values = {
      pending: 20,
      confirmed: 40,
      preparing: 60,
      out_for_delivery: 80,
      delivered: 100
    };
    return values[status] || 0;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div>
        <Navbar />
        <div className="d-flex justify-content-center align-items-center" style={{ height: '70vh' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
          <button className="btn btn-primary mt-3" onClick={fetchMyOrder}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!orderData || !orderData.order_data || orderData.order_data.length === 0) {
    return (
      <div>
        <Navbar />
        <div className="container py-5 text-center">
          <div className="mb-4">
            <img 
              src="https://cdn-icons-png.flaticon.com/512/4555/4555971.png" 
              alt="No Orders" 
              style={{ maxWidth: '200px', opacity: '0.7' }}
            />
          </div>
          <h2 className="mb-3">No Orders Yet</h2>
          <p className="text-muted mb-4">Start shopping to see your orders here</p>
          <Link to="/" className="btn btn-primary">
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-100 h-custom" style={{ backgroundColor: "#f8f9fa" }}>
      <Navbar />
      <div className="container py-5">
        <h1 className="text-center mb-5" style={{ color: "#2b3035", fontWeight: "600" }}>My Orders</h1>
        
        {orderData.order_data.map((order, index) => (
          <MDBCard key={index} className="mb-4 shadow-sm border-1">
            <MDBCardHeader 
              className="px-4 py-3 d-flex justify-content-between align-items-center border-0"
              style={{ backgroundColor: "#f8f9fa" }}
            >
              <div>
                <MDBTypography 
                  tag="h5" 
                  className="mb-0" 
                  style={{ 
                    color: "#2b3035", 
                    fontWeight: "600",
                    fontSize: "1.1rem"
                  }}
                >
                  Order #{order.order_id}
                </MDBTypography>
                <small 
                  style={{ 
                    color: "#6c757d",
                    fontSize: "0.9rem"
                  }}
                >
                  {formatDate(order.order_date)}
                </small>
              </div>
              <MDBBadge 
                color={getStatusColor(order.status)} 
                className="px-3 py-2" 
                style={{
                  fontSize: "0.8rem",
                  fontWeight: "500"
                }}
              >
                {order.status.replace(/_/g, ' ').toUpperCase()}
              </MDBBadge>
            </MDBCardHeader>

            <MDBCardBody className="p-4">
              <div className="d-flex flex-column flex-lg-row">
                <div className="flex-grow-1">
                  <MDBTypography tag="h6" className="text-muted mb-3">
                    Delivery Address
                  </MDBTypography>
                  <MDBTypography tag="h6" style={{ color: "#2b3035" }}>
                    {order.delivery_address}
                  </MDBTypography>

                  <div className="border-top my-4"></div>

                  <MDBTypography tag="h6" className="text-muted mb-3">
                    Order Details
                  </MDBTypography>

                  {order.items.map((item, idx) => (
                    <div key={idx} className="d-flex align-items-center mb-3">
                      <div className="flex-shrink-0">
                        <img
                          src={item.img}
                          style={{ width: "50px", height: "50px", objectFit: "cover" }}
                          className="rounded"
                          alt={item.name}
                        />
                      </div>
                      <div className="flex-grow-1 ms-3">
                        <MDBTypography tag="h6" style={{ color: "#2b3035" }}>
                          {item.name}
                        </MDBTypography>
                        <small className="text-muted">
                          {item.qty} x ₹{item.price/item.qty} = ₹{item.price}
                        </small>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="px-lg-4 border-start flex-shrink-0" style={{ minWidth: "200px" }}>
                  <MDBTypography tag="h6" className="text-muted mb-3">
                    Order Summary
                  </MDBTypography>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Subtotal</span>
                    <span>₹{order.total_price}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Discount</span>
                    <span className="text-success">-₹{order.discount || 0}</span>
                  </div>
                  <div className="d-flex justify-content-between mb-2">
                    <span className="text-muted">Delivery</span>
                    <span>Free</span>
                  </div>
                  <hr />
                  <div className="d-flex justify-content-between fw-bold">
                    <span>Total</span>
                    <span>₹{order.final_price}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <MDBProgress height='12'>
                  <MDBProgressBar
                    width={getProgressValue(order.status)}
                    valuemin={0}
                    valuemax={100}
                    bgColor={getStatusColor(order.status)}
                  />
                </MDBProgress>
              </div>
            </MDBCardBody>
          </MDBCard>
        ))}
      </div>
      <Footer />
    </div>
  );
}
