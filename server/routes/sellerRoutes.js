const express = require('express');
const router = express.Router();
const {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  updateSellerOrderStatus
} = require('../controllers/sellerController');
const { protect } = require('../middleware/authMiddleware');
const { authorizeApprovedSeller } = require('../middleware/roleMiddleware');

router.use(protect, authorizeApprovedSeller);

router.get('/dashboard', getSellerDashboard);
router.get('/products', getSellerProducts);
router.get('/orders', getSellerOrders);
router.put('/orders/:id/status', updateSellerOrderStatus);

module.exports = router;
