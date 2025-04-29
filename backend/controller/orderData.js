// when user order some food then we store the data in the database 

const Order = require("../models/orderSchema");
const User = require("../models/UserSchema");

exports.orderData = async (req, res) => {
  try {
    const { order_data, total_price, Discount, final_price, email, order_date } = req.body;
    
    // Get user details
    const user = await User.findOne({ email }).select("+name +phoneNumber");
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }
    
    // Generate a unique order ID
    const order_id = 'ORD' + Date.now().toString().slice(-6);
    
    const orderItems = order_data.map(item => ({
      id: item.id,
      name: item.name,
      qty: item.qty,
      size: item.size || 'regular',
      price: item.price,
      img: item.img
    }));

    const newOrder = {
      order_date: new Date(order_date),
      items: orderItems,
      total_price,
      discount: Discount || 0,
      final_price,
      status: 'pending',
      delivery_address: req.body.delivery_address || 'Default Address',
      payment_method: req.body.payment_method || 'Cash on Delivery',
      order_id,
      customer_name: user.name,
      customer_phone: user.phoneNumber
    };

    let existingOrder = await Order.findOne({ email });

    if (!existingOrder) {
      // Create new order document
      await Order.create({
        email,
        order_data: [newOrder]
      });
    } else {
      // Add to existing orders
      await Order.findOneAndUpdate(
        { email },
        { $push: { order_data: newOrder } }
      );
    }

    res.json({ 
      success: true,
      message: "Order placed successfully",
      order_id
    });
  } catch (error) {
    console.error("Error placing order:", error);
    res.status(500).json({ 
      success: false,
      message: "Server Error",
      error: error.message 
    });
  }
};

// Fetch user's orders
exports.myOrderData = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Verify user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not found"
      });
    }

    // Find orders for the user
    const orders = await Order.findOne({ email });
    
    if (!orders || !orders.order_data || orders.order_data.length === 0) {
      return res.status(200).json({
        success: true,
        orderData: {
          order_data: []
        }
      });
    }

    // Sort orders by date (newest first)
    const sortedOrders = orders.order_data.sort((a, b) => 
      new Date(b.order_date) - new Date(a.order_date)
    );

    res.status(200).json({
      success: true,
      orderData: {
        order_data: sortedOrders
      }
    });

  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({
      success: false,
      message: "Error fetching orders",
      error: error.message
    });
  }
};
