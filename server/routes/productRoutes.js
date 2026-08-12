const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeApprovedSeller } = require('../middleware/roleMiddleware');

const reviewRouter = require('./reviewRoutes');

// Re-route into other resource routers for nested routes
router.use('/:id/reviews', reviewRouter);

router
  .route('/')
  .get(getProducts)
  .post(protect, authorizeApprovedSeller, createProduct);

router
  .route('/:id')
  .get(getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
