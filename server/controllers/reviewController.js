const Review = require('../models/Review');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Create a product review
// @route   POST /api/products/:id/reviews
// @access  Private/Customer
const createProductReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    const userId = req.user._id;

    if (!rating || !comment) {
      return res.status(400).json({ message: 'Please provide rating and comment' });
    }

    const numericRating = Number(rating);
    if (isNaN(numericRating) || numericRating < 1 || numericRating > 5) {
      return res.status(400).json({ message: 'Rating must be an integer between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Business Rule Check: Verify Customer purchased this product and order status is DELIVERED
    const deliveredOrder = await Order.findOne({
      user: userId,
      orderStatus: 'DELIVERED',
      'items.product': productId
    });

    if (!deliveredOrder) {
      return res.status(403).json({
        message: 'You can only review products you have purchased and received (Order status must be DELIVERED).'
      });
    }

    // Check if user already reviewed this product
    const alreadyReviewed = await Review.findOne({
      user: userId,
      product: productId
    });

    if (alreadyReviewed) {
      return res.status(400).json({ message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: userId,
      product: productId,
      rating: numericRating,
      comment
    });

    // Recalculate Product average rating & reviewCount
    const allReviews = await Review.find({ product: productId });
    const reviewCount = allReviews.length;
    const avgRating =
      allReviews.reduce((acc, item) => acc + item.rating, 0) / reviewCount;

    product.reviewCount = reviewCount;
    product.rating = Number(avgRating.toFixed(1));
    await product.save();

    const populatedReview = await Review.findById(review._id).populate('user', 'name');

    res.status(201).json(populatedReview);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get reviews for a product
// @route   GET /api/products/:id/reviews
// @access  Public
const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.id })
      .populate('user', 'name')
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createProductReview,
  getProductReviews
};
