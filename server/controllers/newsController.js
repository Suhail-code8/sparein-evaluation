const mongoose = require('mongoose');
const News = require('../models/News');

// get all news articles with pagination and search
exports.getNews = async (req, res, next) => {
  try {
    const page = Math.max(1, parseInt(req.query.page, 10) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 6));
    const searchTerm = (req.query.search || req.query.q || '').trim();

    const filter = {};
    if (searchTerm) {
      const regex = new RegExp(searchTerm, 'i');
      filter.$or = [{ title: regex }, { excerpt: regex }];
    }

    const totalRecords = await News.countDocuments(filter);
    const totalPages = Math.ceil(totalRecords / limit) || 1;
    const skip = (page - 1) * limit;

    const newsList = await News.find(filter)
      .sort({ publishedDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: newsList.length,
      pagination: {
        page,
        limit,
        totalRecords,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
      data: newsList,
    });
  } catch (error) {
    next(error);
  }
};

// get single news article by id or source url
exports.getNewsById = async (req, res, next) => {
  try {
    const { id } = req.params;
    let article = null;

    if (mongoose.Types.ObjectId.isValid(id)) {
      article = await News.findById(id).lean();
    }
    if (!article) {
      article = await News.findOne({ sourceUrl: id }).lean();
    }

    if (!article) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: `News article not found: ${id}`,
      });
    }

    res.json({
      success: true,
      data: article,
    });
  } catch (error) {
    next(error);
  }
};
