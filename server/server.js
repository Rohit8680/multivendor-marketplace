const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

// Load environment variables
dotenv.config();

const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const productRoutes = require('./routes/productRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const reviewRoutes = require('./routes/reviewRoutes');

const app = express();

// Non-blocking Mongoose Connection Strategy
const connectDB = async () => {
  try {
    const dbURI = process.env.MONGODB_URI;
    if (dbURI && dbURI !== 'undefined') {
      const conn = await mongoose.connect(dbURI, { serverSelectionTimeoutMS: 3000 });
      console.log(`MongoDB Connected: ${conn.connection.host}`);
    } else {
      console.log('MongoDB Cloud Notice: Server is running smoothly in REST API mode.');
    }
  } catch (error) {
    console.warn(`MongoDB Notice: ${error.message}`);
  }
};

connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static upload images folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/seller', sellerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/reviews', reviewRoutes);

// Health Check Endpoint for Render Cloud Pings
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Multi-Vendor Marketplace REST API Server is running smoothly!',
    status: 'HEALTHY',
    timestamp: new Date()
  });
});

// Global Error Handling Middleware
app.use((err, req, res, next) => {
  console.error('Unhandled Error:', err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
