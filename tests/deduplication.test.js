const test = require('node:test');
const assert = require('node:assert/strict');
require('dotenv').config();
const { connectDB, disconnectDB } = require('../server/config/db');
const Product = require('../server/models/Product');

test('Deduplication & Part Number Flexibility in MongoDB', async (t) => {
  await connectDB();

  // Clean test records before test
  await Product.deleteMany({ sourceUrl: { $regex: /^https:\/\/test\.example\.com\// } });

  await t.test('Idempotent Upsert via sourceUrl updates rather than duplicating', async () => {
    const testDoc = {
      title: 'Test Injector Model A',
      sourceUrl: 'https://test.example.com/item-1',
      imageUrl: 'https://cdn.example.com/img1.jpg',
      partNumber: 'TEST-001',
      brand: null,
      compatibleBrands: ['Bosch'],
      category: 'Test Category',
      categorySlug: 'test-category',
      description: 'Initial description',
    };

    // First upsert
    await Product.updateOne(
      { sourceUrl: testDoc.sourceUrl },
      { $set: testDoc },
      { upsert: true }
    );
    const countAfterFirst = await Product.countDocuments({ sourceUrl: testDoc.sourceUrl });
    assert.equal(countAfterFirst, 1);

    // Second upsert with updated description (re-running scraper simulation)
    testDoc.description = 'Updated description on rerun';
    await Product.updateOne(
      { sourceUrl: testDoc.sourceUrl },
      { $set: testDoc },
      { upsert: true }
    );
    const countAfterSecond = await Product.countDocuments({ sourceUrl: testDoc.sourceUrl });
    assert.equal(countAfterSecond, 1, 'Rerunning upsert must NOT create duplicate records');

    const updated = await Product.findOne({ sourceUrl: testDoc.sourceUrl });
    assert.equal(updated.description, 'Updated description on rerun');
  });

  await t.test('partNumber allows duplicates and nulls across different sourceUrls', async () => {
    // Two distinct products with null partNumber
    await Product.create([
      {
        title: 'Tool Without Part Number 1',
        sourceUrl: 'https://test.example.com/tool-1',
        partNumber: null,
        category: 'Tools',
        categorySlug: 'tools',
      },
      {
        title: 'Tool Without Part Number 2',
        sourceUrl: 'https://test.example.com/tool-2',
        partNumber: null,
        category: 'Tools',
        categorySlug: 'tools',
      },
      // Two distinct products sharing a part number (e.g. variants or different packages)
      {
        title: 'Common Valve Set Variant A',
        sourceUrl: 'https://test.example.com/valve-a',
        partNumber: 'VALVE-COMMON-1',
        category: 'Valves',
        categorySlug: 'valves',
      },
      {
        title: 'Common Valve Set Variant B',
        sourceUrl: 'https://test.example.com/valve-b',
        partNumber: 'VALVE-COMMON-1',
        category: 'Valves',
        categorySlug: 'valves',
      },
    ]);

    const nullCount = await Product.countDocuments({
      sourceUrl: { $in: ['https://test.example.com/tool-1', 'https://test.example.com/tool-2'] },
      partNumber: null,
    });
    assert.equal(nullCount, 2, 'Multiple null part numbers are allowed');

    const sharedCount = await Product.countDocuments({
      partNumber: 'VALVE-COMMON-1',
    });
    assert.equal(sharedCount, 2, 'Part numbers are not globally constrained to unique values');
  });

  // Clean up test documents
  await Product.deleteMany({ sourceUrl: { $regex: /^https:\/\/test\.example\.com\// } });
  await disconnectDB();
});
