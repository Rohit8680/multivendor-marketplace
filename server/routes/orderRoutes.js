const express = require('express');
const router = express.Router();
const {
  createOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getMyOrders,
  getOrderById
} = require('../controllers/orderController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router
  .route('/')
  .post(createOrder)
  .get(getMyOrders);

router.post('/razorpay/create-order', createRazorpayOrder);
router.post('/razorpay/verify-payment', verifyRazorpayPayment);

router.route('/:id').get(getOrderById);

module.exports = router;
