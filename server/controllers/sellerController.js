const Product = require('../models/Product');
const Order = require('../models/Order');

// @desc    Get Seller Dashboard Metrics
// @route   GET /api/seller/dashboard
// @access  Private/Approved Seller
const getSellerDashboard = async (req, res) => {
  try {
    const sellerId = req.user._id;

    // 1. Total Products owned by seller
    const totalProducts = await Product.countDocuments({ seller: sellerId });

    // 2. Total Stock across seller's products
    const products = await Product.find({ seller: sellerId }).select('stock');
    const totalStock = products.reduce((acc, p) => acc + (p.stock || 0), 0);

    // 3. Orders containing seller's products
    const orders = await Order.find({ 'items.seller': sellerId });

    const activeOrders = orders.filter((order) =>
      ['PLACED', 'CONFIRMED', 'SHIPPED'].includes(order.orderStatus)
    ).length;

    const completedOrders = orders.filter(
      (order) => order.orderStatus === 'DELIVERED'
    ).length;

    res.json({
      totalProducts,
      totalStock,
      activeOrders,
      completedOrders
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all products belonging to authenticated seller
// @route   GET /api/seller/products
// @access  Private/Approved Seller
const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user._id })
      .populate('category', 'name slug')
      .sort({ createdAt: -1 });

    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders containing authenticated seller's products
// @route   GET /api/seller/orders
// @access  Private/Approved Seller
const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user._id.toString();

    // Find orders that contain at least one item owned by this seller
    const rawOrders = await Order.find({ 'items.seller': req.user._id })
      .populate('user', 'name email')
      .populate('items.product', 'name image price')
      .populate('items.seller', 'name email')
      .sort({ createdAt: -1 });

    // Filter order items so seller ONLY sees items belonging to them
    const filteredOrders = rawOrders.map((order) => {
      const orderObj = order.toObject();
      orderObj.items = orderObj.items.filter((item) => {
        if (!item || !item.seller) return false;
        const itemSellerId = item.seller._id ? item.seller._id.toString() : item.seller.toString();
        return itemSellerId === sellerId;
      });

      orderObj.sellerSubtotal = orderObj.items.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      return orderObj;
    });

    res.json(filteredOrders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status for an order containing seller's products
// @route   PUT /api/seller/orders/:id/status
// @access  Private/Approved Seller
const updateSellerOrderStatus = async (req, res) => {
  try {
    const { orderStatus } = req.body;
    const sellerId = req.user._id;

    const allowedStatuses = ['PLACED', 'CONFIRMED', 'SHIPPED', 'DELIVERED'];
    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({ message: `Invalid status. Must be one of: ${allowedStatuses.join(', ')}` });
    }

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Verify order contains items for this seller
    const hasSellerItems = order.items.some(
      (item) => item.seller.toString() === sellerId.toString()
    );

    if (!hasSellerItems && req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Not authorized to update status for orders not containing your products' });
    }

    order.orderStatus = orderStatus;
    if (orderStatus === 'DELIVERED') {
      order.paymentStatus = 'PAID';
    }

    await order.save();

    res.json({
      message: `Order status updated to ${orderStatus}`,
      order
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getSellerDashboard,
  getSellerProducts,
  getSellerOrders,
  updateSellerOrderStatus
};
