const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const PRODUCTS_FILE = path.join(dataDir, 'products.json');
const ORDERS_FILE = path.join(dataDir, 'orders.json');

// Helper to read/write JSON files
function readJSON(file, defaultData = []) {
  try {
    if (!fs.existsSync(file)) {
      fs.writeFileSync(file, JSON.stringify(defaultData, null, 2));
      return defaultData;
    }
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch (e) {
    console.error('Error reading JSON DB file:', file, e);
    return defaultData;
  }
}

function writeJSON(file, data) {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error writing JSON DB file:', file, e);
  }
}

// Seed data from seed.js
const defaultProducts = [
  {
      _id: "660c6d2d4889d1d6438a0001",
      name: "Premium Roasted Cashews",
      description: "Golden roasted whole cashews with a rich, buttery flavor. Perfectly crunchy and lightly seasoned.",
      image: "/product-roasted.jpg",
      category: "Roasted",
      featured: true,
      variants: [
          { _id: "660c6d2d4889d1d6438a0011", weight: "250g", price: 180, stock: 150 },
          { _id: "660c6d2d4889d1d6438a0012", weight: "500g", price: 350, stock: 100 },
          { _id: "660c6d2d4889d1d6438a0013", weight: "1kg", price: 680, stock: 80 },
      ]
  },
  {
      _id: "660c6d2d4889d1d6438a0002",
      name: "Natural Raw Cashews",
      description: "Pure, unprocessed cashew nuts straight from the farm. Ideal for cooking and healthy snacking.",
      image: "/product-raw.jpg",
      category: "Raw",
      featured: true,
      variants: [
          { _id: "660c6d2d4889d1d6438a0021", weight: "250g", price: 160, stock: 200 },
          { _id: "660c6d2d4889d1d6438a0022", weight: "500g", price: 310, stock: 150 },
          { _id: "660c6d2d4889d1d6438a0023", weight: "1kg", price: 600, stock: 100 },
      ]
  },
  {
      _id: "660c6d2d4889d1d6438a0003",
      name: "Honey Glazed Cashews",
      description: "Sweet honey-coated cashews with a delightful crunch. A perfect blend of natural sweetness.",
      image: "/product-honey.jpg",
      category: "Flavored",
      featured: true,
      variants: [
          { _id: "660c6d2d4889d1d6438a0031", weight: "250g", price: 200, stock: 100 },
          { _id: "660c6d2d4889d1d6438a0032", weight: "500g", price: 390, stock: 80 },
          { _id: "660c6d2d4889d1d6438a0033", weight: "1kg", price: 760, stock: 60 },
      ]
  },
  {
      _id: "660c6d2d4889d1d6438a0004",
      name: "Spicy Masala Cashews",
      description: "Bold and zesty cashews seasoned with traditional Indian spices. A fiery snack experience.",
      image: "/product-masala.jpg",
      category: "Flavored",
      featured: false,
      variants: [
          { _id: "660c6d2d4889d1d6438a0041", weight: "250g", price: 175, stock: 120 },
          { _id: "660c6d2d4889d1d6438a0042", weight: "500g", price: 340, stock: 90 },
          { _id: "660c6d2d4889d1d6438a0043", weight: "1kg", price: 660, stock: 70 },
      ]
  },
  {
      _id: "660c6d2d4889d1d6438a0005",
      name: "Classic Salted Cashews",
      description: "Lightly salted premium cashews in a convenient resealable pouch. Perfect for any occasion.",
      image: "/product-salted.jpg",
      category: "Salted",
      featured: false,
      variants: [
          { _id: "660c6d2d4889d1d6438a0051", weight: "250g", price: 165, stock: 180 },
          { _id: "660c6d2d4889d1d6438a0052", weight: "500g", price: 320, stock: 140 },
          { _id: "660c6d2d4889d1d6438a0053", weight: "1kg", price: 620, stock: 100 },
      ]
  },
  {
      _id: "660c6d2d4889d1d6438a0006",
      name: "Chocolate Cashews",
      description: "Rich dark chocolate-coated cashews. An Indulgent treat combining nutty and cocoa flavors.",
      image: "/product-chocolate.jpg",
      category: "Premium",
      featured: true,
      variants: [
          { _id: "660c6d2d4889d1d6438a0061", weight: "250g", price: 220, stock: 80 },
          { _id: "660c6d2d4889d1d6438a0062", weight: "500g", price: 430, stock: 60 },
          { _id: "660c6d2d4889d1d6438a0063", weight: "1kg", price: 840, stock: 40 },
      ]
  }
];

class MockQuery {
  constructor(promise) {
    this.promise = promise;
  }
  sort(sortObj) {
    return new MockQuery(this.promise.then(data => {
      if (!Array.isArray(data)) return data;
      const key = Object.keys(sortObj)[0];
      const dir = sortObj[key];
      return [...data].sort((a, b) => {
        const valA = a[key] || '';
        const valB = b[key] || '';
        if (valA < valB) return dir === -1 ? 1 : -1;
        if (valA > valB) return dir === -1 ? -1 : 1;
        return 0;
      });
    }));
  }
  then(resolve, reject) {
    return this.promise.then(resolve, reject);
  }
}

function decorateProduct(product) {
  if (!product) return product;
  
  // Add support for variants.id() helper
  if (product.variants && Array.isArray(product.variants)) {
    product.variants.id = function(variantId) {
      if (!variantId) return null;
      return this.find(v => v._id.toString() === variantId.toString());
    };
  }
  
  return product;
}

function createMockModel(filename, defaultData = []) {
  const getCollection = () => readJSON(filename, defaultData);
  const saveCollection = (data) => writeJSON(filename, data);

  class MockModel {
    constructor(data) {
      Object.assign(this, data);
      if (!this._id) {
        this._id = new mongoose.Types.ObjectId().toString();
      }
      if (filename === PRODUCTS_FILE) {
        decorateProduct(this);
      }
    }

    async save() {
      const collection = getCollection();
      const idx = collection.findIndex(item => item._id.toString() === this._id.toString());
      
      const now = new Date().toISOString();
      if (!this.createdAt) this.createdAt = now;
      this.updatedAt = now;

      // Extract raw properties (remove functions like save, etc.)
      const rawData = {};
      for (const [key, value] of Object.entries(this)) {
        if (typeof value !== 'function') {
          rawData[key] = value;
        }
      }

      // Ensure variants have _id and correct structures
      if (filename === PRODUCTS_FILE && rawData.variants && Array.isArray(rawData.variants)) {
        rawData.variants = rawData.variants.map(v => {
          const varDoc = { ...v };
          if (!varDoc._id) varDoc._id = new mongoose.Types.ObjectId().toString();
          return varDoc;
        });
      }

      if (idx !== -1) {
        collection[idx] = rawData;
      } else {
        collection.push(rawData);
      }
      
      saveCollection(collection);
      return this;
    }

    static find() {
      return new MockQuery(Promise.resolve(getCollection().map(item => {
        if (filename === PRODUCTS_FILE) return decorateProduct(item);
        return item;
      })));
    }

    static async findById(id) {
      if (!id) return null;
      const collection = getCollection();
      const item = collection.find(item => item._id.toString() === id.toString());
      if (!item) return null;
      
      const instance = new MockModel(item);
      if (filename === PRODUCTS_FILE) decorateProduct(instance);
      return instance;
    }

    static async findByIdAndUpdate(id, updateData, options = {}) {
      const collection = getCollection();
      const idx = collection.findIndex(item => item._id.toString() === id.toString());
      if (idx === -1) return null;

      const now = new Date().toISOString();
      const existing = collection[idx];
      const updated = {
        ...existing,
        ...updateData,
        updatedAt: now
      };
      
      collection[idx] = updated;
      saveCollection(collection);

      const instance = new MockModel(updated);
      if (filename === PRODUCTS_FILE) decorateProduct(instance);
      return instance;
    }

    static async findByIdAndDelete(id) {
      const collection = getCollection();
      const idx = collection.findIndex(item => item._id.toString() === id.toString());
      if (idx === -1) return null;

      const deleted = collection.splice(idx, 1)[0];
      saveCollection(collection);
      
      const instance = new MockModel(deleted);
      if (filename === PRODUCTS_FILE) decorateProduct(instance);
      return instance;
    }

    static async deleteMany(filter = {}) {
      if (Object.keys(filter).length === 0) {
        saveCollection([]);
      }
      return { deletedCount: 0 };
    }

    static async insertMany(items) {
      const collection = getCollection();
      const now = new Date().toISOString();
      const processed = items.map(item => {
        const doc = { ...item };
        if (!doc._id) doc._id = new mongoose.Types.ObjectId().toString();
        if (!doc.createdAt) doc.createdAt = now;
        doc.updatedAt = now;
        
        if (doc.variants && Array.isArray(doc.variants)) {
          doc.variants = doc.variants.map(v => {
            const varDoc = { ...v };
            if (!varDoc._id) varDoc._id = new mongoose.Types.ObjectId().toString();
            return varDoc;
          });
        }
        return doc;
      });
      
      collection.push(...processed);
      saveCollection(collection);
      return processed;
    }
  }

  return MockModel;
}

let MockProduct = null;
let MockOrder = null;

function getMockProductModel() {
  if (!MockProduct) {
    MockProduct = createMockModel(PRODUCTS_FILE, defaultProducts);
  }
  return MockProduct;
}

function getMockOrderModel() {
  if (!MockOrder) {
    MockOrder = createMockModel(ORDERS_FILE, []);
  }
  return MockOrder;
}

module.exports = {
  getMockProductModel,
  getMockOrderModel
};
