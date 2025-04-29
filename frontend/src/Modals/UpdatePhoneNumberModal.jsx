import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import { Backendurl } from "../services/helper";

const UpdatePhoneNumberModal = ({
  show,
  handleClose,
  onUpdate,
  userEmail,
  authToken
}) => {
  const [newPhoneNumber, setNewPhoneNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    // Only allow numbers and limit to 10 digits
    const value = e.target.value.replace(/\D/g, '').slice(0, 10);
    setNewPhoneNumber(value);
  };

  const handleUpdatePhoneNumber = async (e) => {
    e.preventDefault();
    
    // Validate phone number
    if (!newPhoneNumber || newPhoneNumber.length !== 10) {
      toast.error("Please enter a valid 10-digit phone number");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Backendurl}/api/auth/updatePhoneNumber`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: userEmail,
          newPhoneNumber: newPhoneNumber,
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to update phone number");
      }

      if (json.success) {
        toast.success("Phone number updated successfully!");
        setNewPhoneNumber("");
        onUpdate(); // Refresh user details
        setTimeout(handleClose, 1500);
      } else {
        throw new Error(json.message || "Failed to update phone number");
      }
    } catch (error) {
      console.error("Error updating phone number:", error);
      toast.error(error.message || "Failed to update phone number");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header style={{ backgroundColor: "#EEF5FF" }}>
        <Modal.Title style={{ color: "black" }}>
          Update Phone Number
        </Modal.Title>
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
        <Form onSubmit={handleUpdatePhoneNumber}>
          <Form.Group controlId="formNewPhoneNumber">
            <Form.Label style={{ color: "black" }}>New Phone Number</Form.Label>
            <Form.Control
              type="tel"
              placeholder="Enter 10-digit phone number"
              value={newPhoneNumber}
              onChange={handleInputChange}
              style={{
                backgroundColor: "white",
                color: "black"
              }}
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />
            <Form.Text className="text-muted">
              Enter a valid 10-digit phone number
            </Form.Text>
          </Form.Group>
          <Button
            variant="primary"
            type="submit"
            className="w-100 mt-3"
            disabled={loading || !newPhoneNumber || newPhoneNumber.length !== 10}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Updating...
              </>
            ) : (
              "Update Phone Number"
            )}
          </Button>
        </Form>
      </Modal.Body>
      <ToastContainer position="top-center" />
    </Modal>
  );
};

export default UpdatePhoneNumberModal;
