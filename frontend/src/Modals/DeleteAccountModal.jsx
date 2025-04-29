import React, { useState } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { Backendurl } from "../services/helper";
import { useNavigate } from "react-router-dom";

const DeleteAccountModal = ({ show, handleClose, userEmail, authToken }) => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDeleteAccount = async (e) => {
    e.preventDefault();
    
    if (!password) {
      toast.error("Please enter your password to confirm account deletion");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`${Backendurl}/api/auth/deleteUser`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${authToken}`
        },
        body: JSON.stringify({
          email: userEmail,
          password: password
        }),
      });

      const json = await response.json();

      if (!response.ok) {
        throw new Error(json.message || "Failed to delete account");
      }

      if (json.success) {
        toast.success("Account deleted successfully");
        // Clear local storage
        localStorage.clear();
        // Redirect to home page
        setTimeout(() => {
          navigate("/");
        }, 1500);
      } else {
        throw new Error(json.message || "Failed to delete account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      toast.error(error.message || "Failed to delete account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header style={{ backgroundColor: "#EEF5FF" }}>
        <Modal.Title style={{ color: "black" }}>
          Delete Account
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
        <div className="alert alert-warning mb-4">
          <i className="fas fa-exclamation-triangle me-2"></i>
          Warning: This action cannot be undone. All your data will be permanently deleted.
        </div>
        
        <Form onSubmit={handleDeleteAccount}>
          <Form.Group controlId="formPassword">
            <Form.Label style={{ color: "black" }}>Enter your password to confirm</Form.Label>
            <Form.Control
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                backgroundColor: "white",
                color: "black"
              }}
              required
            />
          </Form.Group>
          <Button
            variant="danger"
            type="submit"
            className="w-100 mt-3"
            disabled={loading || !password}
          >
            {loading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Deleting Account...
              </>
            ) : (
              "Delete Account"
            )}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default DeleteAccountModal; 