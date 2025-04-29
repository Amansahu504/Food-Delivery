const User = require("../models/UserSchema");

exports.getUserDetails = async (req, res) => {
  try {
    // Get user email from the verified token
    const { email } = req.user;

    const user = await User.findOne({ email }).select(
      "+name +location +phoneNumber +img"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Convert image data to base64 if it exists
    const userImage = user.img && user.img.data ? {
      contentType: user.img.contentType,
      data: user.img.data.toString("base64"),
    } : null;

    res.status(200).json({
      success: true,
      message: "User details fetched successfully",
      userAddress: user.location,
      userName: user.name,
      userPhoneNumber: user.phoneNumber,
      userImage: userImage,
    });
  } catch (err) {
    console.error("Error fetching user details:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};
