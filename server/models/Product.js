// product schema
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Product title is required'],
      trim: true,
      index: true,
    },
    rawTitle: {
      type: String,
      trim: true,
    },
    sourceUrl: {
      type: String,
      required: [true, 'Source URL is required for deduplication'],
      unique: true,
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    partNumber: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
    partNumberRule: {
      type: String,
      default: null,
      trim: true,
    },
    brand: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
    compatibleBrands: {
      type: [String],
      default: [],
      index: true,
    },
    category: {
      type: String,
      required: [true, 'Category name is required'],
      trim: true,
      index: true,
    },
    categorySlug: {
      type: String,
      required: [true, 'Category slug is required'],
      trim: true,
      lowercase: true,
      index: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    scrapedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

// compound text index for search
ProductSchema.index({
  title: 'text',
  partNumber: 'text',
  description: 'text',
  compatibleBrands: 'text',
});

module.exports = mongoose.model('Product', ProductSchema);
