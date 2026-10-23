const Category = require('../models/Category');
const Product = require('../models/Product');

// get all categories
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (error) {
    next(error);
  }
};

// get single category by slug with preview products
exports.getCategoryBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const category = await Category.findOne({ slug: slug.toLowerCase() }).lean();

    if (!category) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `Category not found: ${slug}`,
      });
    }

    const previewProducts = await Product.find({ categorySlug: slug.toLowerCase() })
      .limit(6)
      .lean();

    res.json({
      success: true,
      data: {
        ...category,
        previewProducts,
      },
    });
  } catch (error) {
    next(error);
  }
};
