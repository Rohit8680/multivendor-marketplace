const express = require('express');
const router = express.Router({ mergeParams: true });
const {
  createProductReview,
  getProductReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router
  .route('/')
  .get(getProductReviews)
  .post(protect, createProductReview);

module.exports = router;
