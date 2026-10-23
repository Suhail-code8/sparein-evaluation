// news schema
const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'News title is required'],
      trim: true,
      index: true,
    },
    sourceUrl: {
      type: String,
      required: [true, 'News source URL is required for deduplication'],
      unique: true,
      trim: true,
      index: true,
    },
    imageUrl: {
      type: String,
      trim: true,
      default: null,
    },
    publishedDate: {
      type: Date,
      default: null,
      index: true,
    },
    publishedDateRaw: {
      type: String,
      trim: true,
      default: '',
    },
    excerpt: {
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

// compound text index for news search
NewsSchema.index({
  title: 'text',
  excerpt: 'text',
});

module.exports = mongoose.model('News', NewsSchema);
