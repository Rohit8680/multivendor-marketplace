const User = require('../models/User');
const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Admin Dashboard Overview statistics
// @route   GET /api/admin/dashboard
// @access  Private/Admin
const getAdminDashboard = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'CUSTOMER' });
    const totalSellers = await User.countDocuments({ role: 'SELLER' });
    const pendingSellers = await User.countDocuments({ role: 'SELLER', sellerStatus: 'PENDING' });
    const totalProducts = await Product.countDocuments();
    const totalOrders = await Order.countDocuments();

    res.json({
      totalUsers,
      totalSellers,
      pendingSellers,
      totalProducts,
      totalOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all registered users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all sellers (or filter by status e.g. PENDING)
// @route   GET /api/admin/sellers
// @access  Private/Admin
const getSellers = async (req, res) => {
  try {
    const filter = { role: 'SELLER' };
    if (req.query.status) {
      filter.sellerStatus = req.query.status.toUpperCase();
    }
    const sellers = await User.find(filter).select('-password').sort({ createdAt: -1 });
    res.json(sellers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Approve a pending seller
// @route   PUT /api/admin/sellers/:id/approve
// @access  Private/Admin
const approveSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'SELLER') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    user.sellerStatus = 'APPROVED';
    await user.save();

    res.json({
      message: `Seller '${user.name}' has been APPROVED successfully`,
      seller: {
        _id: user._id,
        name: user.name,
        email: user.email,
        sellerStatus: user.sellerStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reject a pending seller
// @route   PUT /api/admin/sellers/:id/reject
// @access  Private/Admin
const rejectSeller = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user || user.role !== 'SELLER') {
      return res.status(404).json({ message: 'Seller not found' });
    }

    user.sellerStatus = 'REJECTED';
    await user.save();

    res.json({
      message: `Seller '${user.name}' has been REJECTED`,
      seller: {
        _id: user._id,
        name: user.name,
        email: user.email,
        sellerStatus: user.sellerStatus
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products (Admin audit view)
// @route   GET /api/admin/products
// @access  Private/Admin
const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find({})
      .populate('category', 'name slug')
      .populate('seller', 'name email sellerStatus')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders platform-wide (Admin monitor view)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 });

    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getAdminDashboard,
  getAllUsers,
  getSellers,
  approveSeller,
  rejectSeller,
  getAllProducts,
  getAllOrders
};
