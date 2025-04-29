import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Backendurl } from "../services/helper";

const UpdateAddressModal = ({ 
  show, 
  handleClose, 
  onUpdate,
  userEmail,
  authToken 
}) => {
  const [newAddress, setNewAddress] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    setNewAddress(e.target.value);
  };

  const handleUpdateAddress = async (e) => {
    e.preventDefault();

    // Validate address
    if (!newAddress || newAddress.trim().length < 5) {
      toast.error("Please enter a valid address (minimum 5 characters)");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Backendurl}/api/auth/updateAddress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: userEmail,
          newAddress: newAddress.trim(),
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update address");
      }

      if (json.success) {
        toast.success("Address updated successfully!");
        setNewAddress("");
        onUpdate(); // Refresh user details
        setTimeout(handleClose, 1500);
      } else {
        throw new Error(json.message || "Failed to update address");
      }
    } catch (error) {
      console.error("Error updating address:", error);
      toast.error(error.message || "Failed to update address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header style={{ backgroundColor: "#EEF5FF" }}>
        <Modal.Title style={{ color: "black" }}>Update Address</Modal.Title>
        <Button
          variant="light"
          className="close"
          onClick={handleClose}
          style={{
            position: "absolute",
            right: "1rem",
            top: "1rem",
            backgroundColor: "transparent",
            border: "none"
          }}
        >
          <i className="fas fa-times"></i>
        </Button>
      </Modal.Header>

      <Modal.Body style={{ backgroundColor: "#EEF5FF" }}>
        <Form onSubmit={handleUpdateAddress}>
          <Form.Group controlId="formNewAddress">
            <Form.Label style={{ color: "black" }}>New Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter complete address (House/Flat No, Street, Area, City)"
              value={newAddress}
              onChange={handleInputChange}
              style={{
                backgroundColor: "white",
                color: "black"
              }}
              required
            />
            <Form.Text className="text-muted">
              Please include house/flat number, street name, area, and city for accurate delivery
            </Form.Text>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-3"
            disabled={loading || !newAddress || newAddress.trim().length < 5}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              "Update Address"
            )}
          </Button>
        </Form>
      </Modal.Body>
      <ToastContainer position="top-center" />
    </Modal>
  );
};

export default UpdateAddressModal;
