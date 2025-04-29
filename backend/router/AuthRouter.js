const express = require("express");
const AuthRouter = express.Router();
const { signupUser, uploadMiddleware } = require("../controller/signupUser.js");
const { loginUser } = require("../controller/loginUser.js");
const { orderData, myOrderData } = require("../controller/orderData.js");
const { getlocation } = require("../controller/getLocation.js");
const { forgotPassword } = require("../controller/forgotPassword.js");
const { deleteUser } = require("../controller/deleteUser.js");
const { getUserDetails } = require("../controller/getUserDetails.js");
const { updatePhoneNumber } = require("../controller/updatePhoneNumber.js");
const { updateAddress } = require("../controller/updateAddress.js");
const { feedback } = require("../controller/feedback.js");
const { userOtpSend } = require("../controller/userOtpSend.js");
const { otpLogin } = require("../controller/otpLogin.js");
const verifyToken = require("../middleware/auth.js");

// Public routes
AuthRouter.post("/createuser", uploadMiddleware, signupUser);
AuthRouter.post("/login", loginUser);
AuthRouter.post("/forgotPassword", forgotPassword);
AuthRouter.post("/sendotp", userOtpSend);
AuthRouter.post("/otplogin", otpLogin);
AuthRouter.post("/getlocation", getlocation);

// Protected routes - require authentication
AuthRouter.post("/deleteUser", verifyToken, deleteUser);
AuthRouter.post("/getUserDetails", verifyToken, getUserDetails);
AuthRouter.post("/updatePhoneNumber", verifyToken, updatePhoneNumber);
AuthRouter.post("/updateAddress", verifyToken, updateAddress);
AuthRouter.post("/orderData", verifyToken, orderData);
AuthRouter.post("/myOrderData", verifyToken, myOrderData);
AuthRouter.post("/feedback", verifyToken, feedback);

module.exports = AuthRouter;
