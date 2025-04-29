const User = require("../models/UserSchema");
const userotp = require("../models/userOtpSchema");

exports.otpLogin = async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Please provide both email and OTP",
    });
  }

  try {
    const otpverification = await userotp.findOne({ email });

    if (!otpverification) {
      return res.status(400).json({
        success: false,
        message: "No OTP found for this email. Please request a new OTP",
        expired: true
      });
    }

    // Check if OTP is expired (10 minutes)
    const otpCreationTime = new Date(otpverification.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDiff = (currentTime - otpCreationTime) / (1000 * 60); // difference in minutes

    if (timeDiff > 10) {
      // Delete expired OTP
      await userotp.deleteOne({ email });
      return res.status(400).json({
        success: false,
        message: "OTP has expired. Please request a new one",
        expired: true
      });
    }

    // Convert both OTPs to strings for comparison
    const storedOTP = String(otpverification.otp);
    const providedOTP = String(otp);

    if (storedOTP !== providedOTP) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP. Please try again",
      });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found",
      });
    }

    try {
      // Generate auth token
      const authToken = user.jwtToken();

      // Delete used OTP
      await userotp.deleteOne({ email });

      const cookieOption = {
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: true,
        sameSite: 'Lax',
        path: '/'
      };

      res.cookie("token", authToken, cookieOption);

      return res.status(200).json({
        success: true,
        message: "Login Successful",
        userName: user.name,
        authToken,
      });
    } catch (tokenError) {
      console.error("Token Generation Error:", tokenError);
      return res.status(500).json({
        success: false,
        message: "Error generating authentication token",
      });
    }

  } catch (err) {
    console.error("OTP Login Error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error. Please try again.",
    });
  }
};
