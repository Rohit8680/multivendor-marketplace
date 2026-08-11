const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../models/User');
const Category = require('../models/Category');
const Product = require('../models/Product');
const Cart = require('../models/Cart');
const Order = require('../models/Order');
const Review = require('../models/Review');

dotenv.config({ path: path.join(__dirname, '../.env') });

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Cart.deleteMany({});
    await Order.deleteMany({});
    await Review.deleteMany({});

    console.log('Cleared existing collections...');

    // 1. Create Users
    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@marketplace.com',
      password: 'admin123',
      role: 'ADMIN'
    });

    const sellerA = await User.create({
      name: 'Apex Digital Store',
      email: 'seller@marketplace.com',
      password: 'seller123',
      role: 'SELLER',
      sellerStatus: 'APPROVED'
    });

    const sellerB = await User.create({
      name: 'Urban Lifestyle Fashion',
      email: 'sellerb@marketplace.com',
      password: 'seller123',
      role: 'SELLER',
      sellerStatus: 'APPROVED'
    });

    const pendingSeller = await User.create({
      name: 'Future Electronics',
      email: 'pending@marketplace.com',
      password: 'pending123',
      role: 'SELLER',
      sellerStatus: 'PENDING'
    });

    const customer = await User.create({
      name: 'Rohit Wagh',
      email: 'customer@marketplace.com',
      password: 'customer123',
      role: 'CUSTOMER'
    });

    console.log('Created Users successfully:');
    console.log(' - Admin: admin@marketplace.com / admin123');
    console.log(' - Approved Seller A: seller@marketplace.com / seller123');
    console.log(' - Approved Seller B: sellerb@marketplace.com / seller123');
    console.log(' - Pending Seller: pending@marketplace.com / pending123');
    console.log(' - Customer: customer@marketplace.com / customer123');

    // 2. Create Categories
    const categories = await Category.insertMany([
      {
        name: 'Electronics & Mobiles',
        slug: 'electronics',
        description: 'Latest smartphones, laptops, headphones, and gaming gear.',
        image: 'https://images.unsplash.com/photo-1498049860654-af1a5c566976?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Fashion & Wearables',
        slug: 'fashion',
        description: 'Trendy clothing, leather jackets, ethnic wear, and sneakers.',
        image: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Home & Office Comfort',
        slug: 'home-kitchen',
        description: 'Ergonomic chairs, smart decor, cookware, and study desks.',
        image: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600&auto=format&fit=crop&q=80'
      },
      {
        name: 'Fitness & Sports Gear',
        slug: 'fitness',
        description: 'Gym sets, smart fitness bands, dumbbells, and yoga mats.',
        image: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=600&auto=format&fit=crop&q=80'
      }
    ]);

    console.log(`Created ${categories.length} Categories.`);

    // 3. Create High-Quality Products with Prices in Rupees (₹)
    const electronicsCat = categories.find((c) => c.slug === 'electronics')._id;
    const fashionCat = categories.find((c) => c.slug === 'fashion')._id;
    const homeCat = categories.find((c) => c.slug === 'home-kitchen')._id;
    const fitnessCat = categories.find((c) => c.slug === 'fitness')._id;

    const products = await Product.insertMany([
      {
        name: 'Apple MacBook Pro M3 (16GB RAM, 512GB SSD)',
        description: 'Blazing-fast M3 chip laptop with 14.2-inch Liquid Retina XDR display, 18-hour battery backup, and space grey metallic unibody design.',
        price: 149900,
        image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&auto=format&fit=crop&q=80',
        category: electronicsCat,
        seller: sellerA._id,
        stock: 8,
        rating: 4.9,
        reviewCount: 1
      },
      {
        name: 'Samsung Galaxy S24 Ultra 5G (12GB RAM, 256GB)',
        description: '200MP Quad Camera with AI Photo Assist, Built-in S Pen, Titanium Frame, and Snapdragon 8 Gen 3 Processor.',
        price: 129999,
        image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=600&auto=format&fit=crop&q=80',
        category: electronicsCat,
        seller: sellerA._id,
        stock: 12,
        rating: 4.8,
        reviewCount: 0
      },
      {
        name: 'Sony WH-1000XM5 Noise Canceling Headphones',
        description: 'Industry-leading Active Noise Cancellation with dual processors, 30-hour battery life, and crystal-clear hands-free calling.',
        price: 26990,
        image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&auto=format&fit=crop&q=80',
        category: electronicsCat,
        seller: sellerA._id,
        stock: 15,
        rating: 4.7,
        reviewCount: 0
      },
      {
        name: 'Royal Enfield Genuine Biker Leather Jacket',
        description: 'Handcrafted premium full-grain leather motorcycle jacket with CE level 1 armor padding and vintage matte black finish.',
        price: 14999,
        image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=600&auto=format&fit=crop&q=80',
        category: fashionCat,
        seller: sellerB._id,
        stock: 6,
        rating: 4.8,
        reviewCount: 0
      },
      {
        name: 'Ergonomic High-Back Mesh Office Chair',
        description: '3D adjustable armrests, synchronized tilt mechanism, breathable Korean mesh back, and heavy-duty chrome wheelbase for maximum posture comfort.',
        price: 12999,
        image: 'https://images.unsplash.com/photo-1580481072645-022f9a6d8310?w=600&auto=format&fit=crop&q=80',
        category: homeCat,
        seller: sellerB._id,
        stock: 10,
        rating: 4.6,
        reviewCount: 0
      },
      {
        name: 'Cult.Fit Rubber Encased Hex Dumbbell Set 20kg',
        description: 'Anti-roll hex design solid cast iron dumbbells with ergonomic chrome handles for home workouts and muscle training.',
        price: 4999,
        image: 'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=600&auto=format&fit=crop&q=80',
        category: fitnessCat,
        seller: sellerB._id,
        stock: 20,
        rating: 4.9,
        reviewCount: 0
      }
    ]);

    console.log(`Created ${products.length} High-Quality Products.`);

    // 4. Create an Initial Delivered Order for Customer (allows testing review functionality)
    const macbookProd = products[0];
    const jacketProd = products[3];

    const order = await Order.create({
      user: customer._id,
      items: [
        {
          product: macbookProd._id,
          seller: sellerA._id,
          quantity: 1,
          price: macbookProd.price
        },
        {
          product: jacketProd._id,
          seller: sellerB._id,
          quantity: 1,
          price: jacketProd.price
        }
      ],
      totalAmount: macbookProd.price + jacketProd.price,
      deliveryAddress: {
        fullName: 'Rohit Wagh',
        phone: '9876543210',
        address: 'Flat 402, Sunshine Heights, MG Road',
        city: 'Mumbai',
        state: 'Maharashtra',
        pincode: '400001'
      },
      paymentMethod: 'COD',
      paymentStatus: 'PAID',
      orderStatus: 'DELIVERED'
    });

    console.log(`Created delivered sample Order (${order._id}).`);

    // 5. Create a sample review by Customer on the MacBook
    await Review.create({
      user: customer._id,
      product: macbookProd._id,
      rating: 5,
      comment: 'Superb laptop performance! The Retina XDR display is ultra-crisp and battery easily lasts 2 days.'
    });

    console.log('Created sample review for testing.');

    console.log('\n✅ Database Seeding Completed Successfully with ₹ Prices!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
};

seedData();
