const test = require('node:test');
const assert = require('node:assert/strict');
const request = require('supertest');
require('dotenv').config();
const { connectDB, disconnectDB } = require('../server/config/db');
const app = require('../server/app');
const Product = require('../server/models/Product');
const Category = require('../server/models/Category');
const News = require('../server/models/News');

test('Express REST API Endpoints', async (t) => {
  await connectDB();

  // Seed minimal test fixtures
  await Product.deleteMany({ sourceUrl: { $regex: /^https:\/\/api-test\.example\.com\// } });
  await Category.deleteMany({ slug: 'api-test-bench' });
  await News.deleteMany({ sourceUrl: { $regex: /^https:\/\/api-test\.example\.com\// } });

  await Category.create({
    name: 'API Test Bench',
    slug: 'api-test-bench',
    description: 'Category for API testing',
    productCount: 2,
  });

  await Product.create([
    {
      title: 'CRS-999 Pro Test Machine',
      rawTitle: 'CRS-999 Pro Test Machine',
      sourceUrl: 'https://api-test.example.com/p1',
      imageUrl: 'https://cdn.example.com/p1.jpg',
      partNumber: 'CRS-999 Pro',
      partNumberRule: 'Rule 1: Equipment Model Pattern',
      brand: null,
      compatibleBrands: ['Bosch', 'Denso'],
      category: 'API Test Bench',
      categorySlug: 'api-test-bench',
      description: 'Advanced testing machine compatible with Bosch injectors.',
    },
    {
      title: 'CRS-111 Standard Tester',
      rawTitle: 'CRS-111 Standard Tester',
      sourceUrl: 'https://api-test.example.com/p2',
      imageUrl: 'https://cdn.example.com/p2.jpg',
      partNumber: 'CRS-111',
      partNumberRule: 'Rule 1: Equipment Model Pattern',
      brand: 'Delphi',
      compatibleBrands: ['Delphi'],
      category: 'API Test Bench',
      categorySlug: 'api-test-bench',
      description: 'Standard testing device.',
    },
  ]);

  await News.create({
    title: 'New Product Announcement 2026',
    sourceUrl: 'https://api-test.example.com/n1',
    imageUrl: 'https://cdn.example.com/n1.jpg',
    publishedDate: new Date('2026-10-15'),
    publishedDateRaw: '2026-10-15',
    excerpt: 'Announcement of the new generation common rail benches.',
  });

  await t.test('GET /api/health returns 200 with database connected', async () => {
    const res = await request(app).get('/api/health');
    assert.equal(res.status, 200);
    assert.equal(res.body.status, 'ok');
    assert.equal(res.body.database, 'connected');
  });

  await t.test('GET /api/products returns paginated results structure', async () => {
    const res = await request(app).get('/api/products?limit=1');
    assert.equal(res.status, 200);
    assert.equal(res.body.success, true);
    assert.ok(Array.isArray(res.body.data));
    assert.equal(res.body.data.length, 1);
    assert.ok(res.body.pagination.totalRecords >= 2);
    assert.equal(res.body.pagination.page, 1);
    assert.equal(res.body.pagination.limit, 1);
    assert.equal(typeof res.body.pagination.totalPages, 'number');
  });

  await t.test('GET /api/products with search filter matches keyword', async () => {
    const res = await request(app).get('/api/products?search=CRS-999');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.length, 1);
    assert.equal(res.body.data[0].partNumber, 'CRS-999 Pro');
  });

  await t.test('GET /api/products with category filter', async () => {
    const res = await request(app).get('/api/products?category=api-test-bench');
    assert.equal(res.status, 200);
    assert.equal(res.body.data.length, 2);
  });

  await t.test('GET /api/products/meta/filters returns facet lists', async () => {
    const res = await request(app).get('/api/products/meta/filters');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data.categories));
    assert.ok(Array.isArray(res.body.data.brands));
    assert.ok(Array.isArray(res.body.data.compatibleBrands));
    assert.ok(res.body.data.totalProducts >= 2);
  });

  await t.test('GET /api/categories returns categories list', async () => {
    const res = await request(app).get('/api/categories');
    assert.equal(res.status, 200);
    assert.ok(res.body.data.length >= 1);
    const cat = res.body.data.find((c) => c.slug === 'api-test-bench');
    assert.ok(cat);
    assert.equal(cat.name, 'API Test Bench');
  });

  await t.test('GET /api/news returns news articles with pagination', async () => {
    const res = await request(app).get('/api/news');
    assert.equal(res.status, 200);
    assert.ok(Array.isArray(res.body.data));
    assert.ok(res.body.data.length >= 1);
  });

  await t.test('GET /api/nonexistent-route returns standard 404 error JSON', async () => {
    const res = await request(app).get('/api/unknown-endpoint');
    assert.equal(res.status, 404);
    assert.equal(res.body.success, false);
    assert.equal(res.body.error, 'Not Found');
    assert.match(res.body.message, /Route not found/);
  });

  // Clean test fixtures
  await Product.deleteMany({ sourceUrl: { $regex: /^https:\/\/api-test\.example\.com\// } });
  await Category.deleteMany({ slug: 'api-test-bench' });
  await News.deleteMany({ sourceUrl: { $regex: /^https:\/\/api-test\.example\.com\// } });
  await disconnectDB();
});
