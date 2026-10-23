const mongoose = require('mongoose');
const Product = require('../models/Product');

// get all products with filters, search, and pagination
exports.getProducts = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit, 10) || 12));
    const { search, q, category, brand, compatibleBrand, hasPartNumber, sortBy, order } = req.query;

    const filter = {};
    const conditions = [];

    // search keyword across title, part number, description, and compatible brands
    const searchTerm = (search || q || '').trim();
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      conditions.push({
        $or: [
          { title: regex },
          { partNumber: regex },
          { description: regex },
          { compatibleBrands: regex },
        ],
      });
    }

    // category filter by slug or category name
    if (category && category.trim()) {
      const cat = category.trim();
      conditions.push({
        $or: [
          { categorySlug: cat.toLowerCase() },
          { category: new RegExp(`^${cat}$`, 'i') },
        ],
      });
    }

    if (conditions.length > 0) {
      filter.$and = conditions;
    }

    // brand filter
    if (brand && brand.trim()) {
      const b = brand.trim();
      filter.brand = (b.toLowerCase() === 'null' || b.toLowerCase() === 'unknown') ? null : new RegExp(`^${b}$`, 'i');
    }

    // compatible brand filter
    if (compatibleBrand && compatibleBrand.trim()) {
      filter.compatibleBrands = new RegExp(compatibleBrand.trim(), 'i');
    }

    // part number presence filter
    if (hasPartNumber === 'true') {
      filter.partNumber = { $ne: null };
    } else if (hasPartNumber === 'false') {
      filter.partNumber = null;
    }

    // sorting
    const sort = {};
    const sortOrder = order === 'asc' ? 1 : -1;
    const allowedSortFields = ['createdAt', 'title', 'partNumber', 'category'];
    const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt';
    sort[sortField] = sortOrder;

    const totalRecords = await Product.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const skip = (page - 1) * limit;

    const products = await Product.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: products.length,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      data: products,
    });
  } catch (error) {
    next(error);
  }
};

// get single product by id or source url
exports.getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let product = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      product = await Product.findById(id).lean();
    }
    if (!product) {
      product = await Product.findOne({ sourceUrl: id }).lean();
    }

    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Product not found: ${id}`,
      });
    }

    res.json({
      success: true,
      data: product,
    });
  } catch (error) {
    next(error);
  }
};

// get filter options for categories and brands
exports.getProductFilters = async (req, res, next) => {
  try {
    const [categories, brands, compatibleBrands, totalProducts, withPartNumberCount] =
      await Promise.all([
        Product.distinct('category'),
        Product.distinct('brand'),
        Product.distinct('compatibleBrands'),
        Product.countDocuments(),
        Product.countDocuments({ partNumber: { $ne: null } }),
      ]);

    res.json({
      success: true,
      data: {
        categories: categories.sort(),
        brands: brands.filter(Boolean).sort(),
        compatibleBrands: compatibleBrands.filter(Boolean).sort(),
        totalProducts,
        withPartNumberCount,
      },
    });
  } catch (error) {
    next(error);
  }
};
