const Cart = require('../models/Cart');
const Product = require('../models/Product');

// @desc    Get current user cart
// @route   GET /api/cart
// @access  Private/Customer
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: [
        { path: 'seller', select: 'name email' },
        { path: 'category', select: 'name slug' }
      ]
    });

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private/Customer
const addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;

    if (!productId) {
      return res.status(400).json({ message: 'Product ID is required' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (product.stock <= 0) {
      return res.status(400).json({ message: 'Product is OUT OF STOCK' });
    }

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    const existingItemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    const currentQtyInCart = existingItemIndex > -1 ? cart.items[existingItemIndex].quantity : 0;
    const targetQuantity = currentQtyInCart + Number(quantity);

    if (targetQuantity > product.stock) {
      return res.status(400).json({
        message: `Cannot add ${quantity} item(s). Available stock: ${product.stock}, items already in cart: ${currentQtyInCart}`
      });
    }

    if (existingItemIndex > -1) {
      cart.items[existingItemIndex].quantity = targetQuantity;
    } else {
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: [
        { path: 'seller', select: 'name email' },
        { path: 'category', select: 'name slug' }
      ]
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update cart item quantity
// @route   PUT /api/cart/:productId
// @access  Private/Customer
const updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity } = req.body;

    if (quantity === undefined || Number(quantity) < 1) {
      return res.status(400).json({ message: 'Quantity must be at least 1' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (Number(quantity) > product.stock) {
      return res.status(400).json({
        message: `Cannot increase quantity beyond available stock (${product.stock})`
      });
    }

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex === -1) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }

    cart.items[itemIndex].quantity = Number(quantity);
    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: [
        { path: 'seller', select: 'name email' },
        { path: 'category', select: 'name slug' }
      ]
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove item from cart
// @route   DELETE /api/cart/:productId
// @access  Private/Customer
const removeFromCart = async (req, res) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();

    const updatedCart = await Cart.findOne({ user: req.user._id }).populate({
      path: 'items.product',
      populate: [
        { path: 'seller', select: 'name email' },
        { path: 'category', select: 'name slug' }
      ]
    });

    res.json(updatedCart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart
};
