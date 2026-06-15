const mongoose = require('mongoose');

const variantSchema = new mongoose.Schema({
  weight: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  featured: { type: Boolean, default: false },
  variants: [variantSchema],
}, {
  timestamps: true
});

const MongooseProduct = mongoose.model('Product', productSchema);

module.exports = MongooseProduct;
