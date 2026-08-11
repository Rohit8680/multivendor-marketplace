const Product = require('../models/Product');
const Category = require('../models/Category');

// @desc    Fetch all products with search, category filter, and pagination
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const pageSize = Number(req.query.limit) || 10;
    const page = Number(req.query.page) || 1;

    const keyword = req.query.search
      ? {
          name: {
            $regex: req.query.search,
            $options: 'i'
          }
        }
      : {};

    let categoryFilter = {};
    if (req.query.category) {
      // Can pass category ID or category slug
      const category = await Category.findOne({
        $or: [{ _id: req.query.category.match(/^[0-9a-fA-F]{24}$/) ? req.query.category : null }, { slug: req.query.category }]
      });
      if (category) {
        categoryFilter = { category: category._id };
      }
    }

    const query = { ...keyword, ...categoryFilter };

    const count = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate('category', 'name slug')
      .populate('seller', 'name email sellerStatus')
      .sort({ createdAt: -1 })
      .limit(pageSize)
      .skip(pageSize * (page - 1));

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
      totalProducts: count
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product by ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug')
      .populate('seller', 'name email');

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Approved Seller
const createProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;

    if (!name || !description || price === undefined || !image || !category || stock === undefined) {
      return res.status(400).json({ message: 'Please provide all required product details' });
    }

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      return res.status(404).json({ message: 'Category not found' });
    }

    const product = new Product({
      name,
      description,
      price: Number(price),
      image,
      category,
      seller: req.user._id, // Automatically associate logged-in seller
      stock: Number(stock)
    });

    const createdProduct = await product.save();
    const populatedProduct = await Product.findById(createdProduct._id)
      .populate('category', 'name slug')
      .populate('seller', 'name email');

    res.status(201).json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Approved Seller or Admin
const updateProduct = async (req, res) => {
  try {
    const { name, description, price, image, category, stock } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify product ownership: seller can only update own product (Admin can update any)
    if (req.user.role !== 'ADMIN' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to update products belonging to another seller' });
    }

    if (name) product.name = name;
    if (description) product.description = description;
    if (price !== undefined) product.price = Number(price);
    if (image) product.image = image;
    if (category) {
      const categoryExists = await Category.findById(category);
      if (!categoryExists) {
        return res.status(404).json({ message: 'Category not found' });
      }
      product.category = category;
    }
    if (stock !== undefined) product.stock = Number(stock);

    const updatedProduct = await product.save();
    const populatedProduct = await Product.findById(updatedProduct._id)
      .populate('category', 'name slug')
      .populate('seller', 'name email');

    res.json(populatedProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Approved Seller or Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Verify ownership
    if (req.user.role !== 'ADMIN' && product.seller.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete products belonging to another seller' });
    }

    await Product.deleteOne({ _id: product._id });
    res.json({ message: 'Product removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
};
