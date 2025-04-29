const mongoose = require("mongoose");
const { Schema } = mongoose;

const OrderItemSchema = new Schema({
  id: String,
  name: String,
  qty: Number,
  size: String,
  price: Number,
  img: String
});

const OrderSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  order_data: [{
    order_date: {
      type: Date,
      default: Date.now
    },
    items: [OrderItemSchema],
    total_price: Number,
    discount: Number,
    final_price: Number,
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'preparing', 'out_for_delivery', 'delivered'],
      default: 'pending'
    },
    delivery_address: String,
    payment_method: String,
    order_id: {
      type: String,
      unique: true
    },
    customer_name: String,
    customer_phone: String
  }]
});

module.exports = mongoose.model("order", OrderSchema);
