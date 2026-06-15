const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  variantId: { type: mongoose.Schema.Types.ObjectId, required: true }, // Referencing the specific variant inside the product array
  productName: { type: String, required: true },
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
  totalPrice: { type: Number, required: true },
  notes: { type: String, default: "" },
  status: { 
    type: String, 
    enum: ['Pending', 'Confirmed', 'Shipped', 'Delivered'], 
    default: 'Pending' 
  },
  orderDate: { type: Date, default: Date.now }
}, {
  timestamps: true
});

const MongooseOrder = mongoose.model('Order', orderSchema);

module.exports = MongooseOrder;
