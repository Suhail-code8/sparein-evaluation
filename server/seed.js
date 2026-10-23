// database seed script
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { connectDB, disconnectDB } = require('./config/db');
const Product = require('./models/Product');
const Category = require('./models/Category');
const News = require('./models/News');

const DATA_DIR = path.join(__dirname, '..', 'scraper', 'data');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');

// idempotent database seeder
async function seedDatabase(options = {}) {
  const silent = options.silent || false;
  const log = (...args) => !silent && console.log(...args);

  await connectDB(options.mongoUri);

  // load json files
  let products = [];
  let news = [];
  let categories = [];

  if (fs.existsSync(PRODUCTS_FILE)) {
    products = JSON.parse(fs.readFileSync(PRODUCTS_FILE, 'utf-8'));
  } else if (fs.existsSync(path.join(DATA_DIR, 'sample.json'))) {
    products = JSON.parse(fs.readFileSync(path.join(DATA_DIR, 'sample.json'), 'utf-8'));
  }

  if (fs.existsSync(NEWS_FILE)) {
    news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf-8'));
  }

  if (fs.existsSync(CATEGORIES_FILE)) {
    categories = JSON.parse(fs.readFileSync(CATEGORIES_FILE, 'utf-8'));
  }

  // upsert categories by slug
  if (categories.length > 0) {
    const categoryOps = categories.map((cat) => ({
      updateOne: {
        filter: { slug: cat.slug },
        update: {
          $set: {
            name: cat.name,
            slug: cat.slug,
            description: cat.description || '',
          },
        },
        upsert: true,
      },
    }));
    await Category.bulkWrite(categoryOps);
  }

  // upsert products by sourceUrl
  if (products.length > 0) {
    const productOps = products.map((prod) => ({
      updateOne: {
        filter: { sourceUrl: prod.sourceUrl },
        update: {
          $set: {
            title: prod.title,
            rawTitle: prod.rawTitle,
            sourceUrl: prod.sourceUrl,
            imageUrl: prod.imageUrl,
            partNumber: prod.partNumber,
            partNumberRule: prod.partNumberRule,
            brand: prod.brand,
            compatibleBrands: prod.compatibleBrands || [],
            category: prod.category,
            categorySlug: prod.categorySlug,
            description: prod.description || '',
            scrapedAt: prod.scrapedAt ? new Date(prod.scrapedAt) : new Date(),
          },
        },
        upsert: true,
      },
    }));
    await Product.bulkWrite(productOps);
  }

  // upsert news by sourceUrl
  if (news.length > 0) {
    const newsOps = news.map((item) => ({
      updateOne: {
        filter: { sourceUrl: item.sourceUrl },
        update: {
          $set: {
            title: item.title,
            sourceUrl: item.sourceUrl,
            imageUrl: item.imageUrl,
            publishedDate: item.publishedDate ? new Date(item.publishedDate) : null,
            publishedDateRaw: item.publishedDateRaw || '',
            excerpt: item.excerpt || '',
            scrapedAt: item.scrapedAt ? new Date(item.scrapedAt) : new Date(),
          },
        },
        upsert: true,
      },
    }));
    await News.bulkWrite(newsOps);
  }

  // update product counts per category
  const distinctCategories = await Product.distinct('categorySlug');
  for (const slug of distinctCategories) {
    const count = await Product.countDocuments({ categorySlug: slug });
    await Category.updateOne({ slug }, { $set: { productCount: count } });
  }

  const totalProducts = await Product.countDocuments();
  const totalNews = await News.countDocuments();
  const totalCategories = await Category.countDocuments();

  log(`Database seeded: ${totalProducts} products, ${totalNews} news items, ${totalCategories} categories.`);

  if (!options.keepConnection) {
    await disconnectDB();
  }

  return { totalProducts, totalNews, totalCategories };
}

if (require.main === module) {
  seedDatabase().catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
}

module.exports = { seedDatabase };
