const mongoose = require('mongoose');
const Product = require('./models/Product');
require('dotenv').config();

const MONGODB_URI = process.env.MONGODB_URI || "mongodb+srv://mathiyazhagan907_db_user:1234@cluster0.y7ftvp4.mongodb.net/?appName=Cluster0";

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

mongoose.connect(MONGODB_URI)
  .then(async () => {
    console.log('Connected to MongoDB. Clearing old products...');
    await Product.deleteMany({});
    console.log('Inserting seed data...');
    await Product.insertMany(seedData);
    console.log('Seed data inserted successfully!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
