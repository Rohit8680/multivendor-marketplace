const express = require('express');
const router = express.Router();
const {
  getAdminDashboard,
  getAllUsers,
  getSellers,
  approveSeller,
  rejectSeller,
  getAllProducts,
  getAllOrders
} = require('../controllers/adminController');
const { protect } = require('../middleware/authMiddleware');
const { authorize } = require('../middleware/roleMiddleware');

router.use(protect, authorize('ADMIN'));

router.get('/dashboard', getAdminDashboard);
router.get('/users', getAllUsers);
router.get('/sellers', getSellers);
router.put('/sellers/:id/approve', approveSeller);
router.put('/sellers/:id/reject', rejectSeller);
router.get('/products', getAllProducts);
router.get('/orders', getAllOrders);

module.exports = router;
