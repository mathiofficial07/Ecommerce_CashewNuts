const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mathiyazhagan907_db_user:1234@cluster0.y7ftvp4.mongodb.net/?appName=Cluster0";



// Automatically seed products if empty, and ensure image paths are corrected
async function seedAndFixProducts() {
  try {
    const Product = require('./models/Product');
    
    // Check if Product collection is empty
    const count = await Product.countDocuments({});
    
    const seedData = [
      {
          name: "Premium Roasted Cashews",
          description: "Golden roasted whole cashews with a rich, buttery flavor. Perfectly crunchy and lightly seasoned.",
          image: "/product-roasted.jpg",
          category: "Roasted",
          featured: true,
          variants: [
              { weight: "250g", price: 180, stock: 150 },
              { weight: "500g", price: 350, stock: 100 },
              { weight: "1kg", price: 680, stock: 80 },
          ]
      },
      {
          name: "Natural Raw Cashews",
          description: "Pure, unprocessed cashew nuts straight from the farm. Ideal for cooking and healthy snacking.",
          image: "/product-raw.jpg",
          category: "Raw",
          featured: true,
          variants: [
              { weight: "250g", price: 160, stock: 200 },
              { weight: "500g", price: 310, stock: 150 },
              { weight: "1kg", price: 600, stock: 100 },
          ]
      },
      {
          name: "Honey Glazed Cashews",
          description: "Sweet honey-coated cashews with a delightful crunch. A perfect blend of natural sweetness.",
          image: "/product-honey.jpg",
          category: "Flavored",
          featured: true,
          variants: [
              { weight: "250g", price: 200, stock: 100 },
              { weight: "500g", price: 390, stock: 80 },
              { weight: "1kg", price: 760, stock: 60 },
          ]
      },
      {
          name: "Spicy Masala Cashews",
          description: "Bold and zesty cashews seasoned with traditional Indian spices. A fiery snack experience.",
          image: "/product-masala.jpg",
          category: "Flavored",
          featured: false,
          variants: [
              { weight: "250g", price: 175, stock: 120 },
              { weight: "500g", price: 340, stock: 90 },
              { weight: "1kg", price: 660, stock: 70 },
          ]
      },
      {
          name: "Classic Salted Cashews",
          description: "Lightly salted premium cashews in a convenient resealable pouch. Perfect for any occasion.",
          image: "/product-salted.jpg",
          category: "Salted",
          featured: false,
          variants: [
              { weight: "250g", price: 165, stock: 180 },
              { weight: "500g", price: 320, stock: 140 },
              { weight: "1kg", price: 620, stock: 100 },
          ]
      },
      {
          name: "Chocolate Cashews",
          description: "Rich dark chocolate-coated cashews. An indulgent treat combining nutty and cocoa flavors.",
          image: "/product-chocolate.jpg",
          category: "Premium",
          featured: true,
          variants: [
              { weight: "250g", price: 220, stock: 80 },
              { weight: "500g", price: 430, stock: 60 },
              { weight: "1kg", price: 840, stock: 40 },
          ]
      }
    ];

    if (count === 0) {
      console.log('🌱 No products found in MongoDB. Seeding default products...');
      await Product.insertMany(seedData);
      console.log('✅ Seed data inserted successfully!');
    } else {
      console.log(`ℹ️ Found ${count} products in MongoDB. Checking and correcting image paths...`);
      const products = await Product.find({});
      let updatedCount = 0;
      for (const p of products) {
        if (p.image && p.image.includes('/src/assets/')) {
          p.image = p.image.replace('/src/assets/', '/');
          await p.save();
          updatedCount++;
        }
      }
      if (updatedCount > 0) {
        console.log(`✅ Corrected image paths for ${updatedCount} products in MongoDB.`);
      } else {
        console.log('✅ All product image paths are already correct.');
      }
    }
  } catch (err) {
    console.error('❌ Error seeding/correcting products in MongoDB:', err.message);
  }
}

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB Successfully!');
    // Automatically seed products if needed or fix image paths
    await seedAndFixProducts();
  })
  .catch((err) => console.error('MongoDB connection error:', err));

// Routes
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');

app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Test/Health Route
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Backend is running and healthy' });
});


// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
