const User = require("../models/UserSchema");
const userotp = require("../models/userOtpSchema");
const emailValidator = require("email-validator");
const nodemailer = require("nodemailer");

// email config
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.EMAIL_PASSWORD, // Use App Password here
  },
  tls: {
    rejectUnauthorized: false
  }
});

// Verify transporter
transporter.verify((error, success) => {
  if (error) {
    console.log("SMTP Error:", error);
  } else {
    console.log("Mail server is ready to send emails");
  }
});

exports.userOtpSend = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      success: false,
      message: "Please provide an email address",
    });
  }

  if (!emailValidator.validate(email)) {
    return res.status(400).json({
      success: false,
      message: "Please enter a valid email address",
    });
  }

  try {
    const preuser = await User.findOne({ email });

    if (!preuser) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email address. Please register first.",
      });
    }

    const OTP = Math.floor(100000 + Math.random() * 900000);
    console.log("Generated OTP:", OTP);

    // Save or update OTP in database
    const existEmail = await userotp.findOne({ email });
    
    if (existEmail) {
      existEmail.otp = OTP;
      existEmail.createdAt = new Date(); // Reset the creation time for the new OTP
      await existEmail.save();
    } else {
      const otpInfo = new userotp({
        email,
        otp: OTP,
      });
      await otpInfo.save();
    }

    // Prepare email
    const mailOptions = {
      from: {
        name: "Mom's Magic",
        address: process.env.EMAIL
      },
      to: email,
      subject: "Mom's Magic - Your Login OTP",
      html: `
        <html>
          <head>
            <style>
              .container {
                font-family: Arial, sans-serif;
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #ffffff;
              }
              .header {
                background-color: #004aad;
                color: white;
                padding: 20px;
                text-align: center;
                border-radius: 5px 5px 0 0;
              }
              .content {
                padding: 20px;
                border: 1px solid #e0e0e0;
                border-radius: 0 0 5px 5px;
              }
              .otp-box {
                background-color: #f4f4f4;
                border-radius: 5px;
                padding: 15px;
                margin: 20px 0;
                text-align: center;
              }
              .otp-number {
                font-size: 32px;
                color: #004aad;
                letter-spacing: 5px;
                font-weight: bold;
              }
              .warning {
                color: #ff6b6b;
                font-size: 14px;
                margin-top: 20px;
              }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1>Mom's Magic</h1>
              </div>
              <div class="content">
                <h2>Hello ${preuser.name},</h2>
                <p>You've requested to login to your Mom's Magic account. Here's your verification code:</p>
                <div class="otp-box">
                  <div class="otp-number">${OTP}</div>
                </div>
                <p>This code will expire in 10 minutes for security reasons.</p>
                <p class="warning">If you didn't request this code, please ignore this email.</p>
              </div>
            </div>
          </body>
        </html>
      `
    };

    // Send email
    try {
      await transporter.sendMail(mailOptions);
      return res.status(200).json({
        success: true,
        message: "OTP sent successfully to your email"
      });
    } catch (emailError) {
      console.error("Email sending error:", emailError);
      // Delete the OTP from database if email fails
      await userotp.deleteOne({ email });
      return res.status(500).json({
        success: false,
        message: "Failed to send OTP email. Please try again."
      });
    }

  } catch (err) {
    console.error("OTP generation error:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error. Please try again later."
    });
  }
};
