// scraper for com-rail products and news
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');
const { parseProductCard, parseNewsItem, detectPagination } = require('./parser');

// output file paths
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const NEWS_FILE = path.join(DATA_DIR, 'news.json');
const CATEGORIES_FILE = path.join(DATA_DIR, 'categories.json');
const REPORT_FILE = path.join(DATA_DIR, 'validation-report.json');

const DELAY_MS = 1000;
const MAX_PAGES_PER_CATEGORY = 2;
const MAX_NEWS_PAGES = 2;

const REQUEST_HEADERS = {
  'User-Agent':
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept-Language': 'en-US,en;q=0.9',
  Accept: 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
};

const CATEGORIES_TO_SCRAPE = [
  {
    name: 'Common Rail Test Bench',
    slug: 'common-rail-test-bench',
    baseUrl: 'https://www.com-rail.com/common-rail-test-bench/',
    description: 'High-precision common rail injector and pump test benches with flow sensor technology.',
  },
  {
    name: 'Tester',
    slug: 'tester',
    baseUrl: 'https://www.com-rail.com/tester/',
    description: 'Specialized electronic testers for common rail injectors, sensors, and actuators.',
  },
  {
    name: 'Disassembly Tool',
    slug: 'disassembly-tool',
    baseUrl: 'https://www.com-rail.com/disassembly-tool/',
    description: 'Precision disassembly and assembly tools for diesel injectors and pumps.',
  },
  {
    name: 'Bosch Original Parts',
    slug: 'bosch-original-parts',
    baseUrl: 'https://www.com-rail.com/bosch-original-parts/',
    description: 'Genuine and original Bosch diesel injectors, pumps, nozzles, and valve assemblies.',
  },
  {
    name: 'Denso Original Parts',
    slug: 'denso-original-parts',
    baseUrl: 'https://www.com-rail.com/denso-original-parts/',
    description: 'Original Denso diesel common rail injectors, supply pumps, and orifice valve plates.',
  },
  {
    name: 'Delphi Original Parts',
    slug: 'delphi-original-parts',
    baseUrl: 'https://www.com-rail.com/delphi-original-parts/',
    description: 'Original Delphi common rail control valves, repair kits, and drive shafts.',
  },
];

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// fetch url with retry and polite delay
async function fetchWithRetry(url, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await sleep(DELAY_MS);
      const response = await axios.get(url, {
        headers: REQUEST_HEADERS,
        timeout: 15000,
        maxRedirects: 5,
      });
      return response.data;
    } catch (err) {
      console.warn(`Attempt ${attempt}/${maxRetries} failed for ${url}: ${err.message}`);
      if (attempt === maxRetries) {
        console.error(`All ${maxRetries} attempts failed for ${url}`);
        return null;
      }
      const backoff = DELAY_MS * Math.pow(2, attempt);
      await sleep(backoff);
    }
  }
  return null;
}

// scrape a product category
async function scrapeCategory(cat, productMap) {
  console.log(`Scraping category: ${cat.name}`);
  let pageNum = 1;
  let totalPages = 1;

  while (pageNum <= totalPages && pageNum <= MAX_PAGES_PER_CATEGORY) {
    const pageUrl = pageNum === 1 ? cat.baseUrl : `${cat.baseUrl}?p=${pageNum}`;
    const html = await fetchWithRetry(pageUrl);
    if (!html) {
      pageNum++;
      continue;
    }

    const $ = cheerio.load(html);

    if (pageNum === 1) {
      const paginationInfo = detectPagination($);
      totalPages = paginationInfo.totalPages || 1;
    }

    const cards = $('li.product_list_item, li.side_product_item');
    cards.each((_, el) => {
      const product = parseProductCard($, el, cat.name, cat.slug);
      if (product && product.sourceUrl && !productMap.has(product.sourceUrl)) {
        productMap.set(product.sourceUrl, product);
      }
    });

    pageNum++;
  }
}

// scrape news articles
async function scrapeNews(newsMap) {
  console.log('Scraping news articles');
  const baseUrl = 'https://www.com-rail.com/news/';
  let pageNum = 1;
  let totalPages = 1;

  while (pageNum <= totalPages && pageNum <= MAX_NEWS_PAGES) {
    const pageUrl = pageNum === 1 ? baseUrl : `${baseUrl}?p=${pageNum}`;
    const html = await fetchWithRetry(pageUrl);
    if (!html) {
      pageNum++;
      continue;
    }

    const $ = cheerio.load(html);

    if (pageNum === 1) {
      const paginationInfo = detectPagination($);
      totalPages = paginationInfo.totalPages || 1;
    }

    const items = $('.blog-item, li.news_item, .news_list li');
    items.each((_, el) => {
      const newsItem = parseNewsItem($, el);
      if (newsItem && newsItem.sourceUrl && !newsMap.has(newsItem.sourceUrl)) {
        newsMap.set(newsItem.sourceUrl, newsItem);
      }
    });

    pageNum++;
  }
}

// generate data validation report
function generateValidationReport(products, news) {
  const missingProductFields = {
    title: products.filter((p) => !p.title).length,
    sourceUrl: products.filter((p) => !p.sourceUrl).length,
    imageUrl: products.filter((p) => !p.imageUrl).length,
    partNumber: products.filter((p) => !p.partNumber).length,
    brand: products.filter((p) => !p.brand).length,
    description: products.filter((p) => !p.description).length,
  };

  const missingNewsFields = {
    title: news.filter((n) => !n.title).length,
    sourceUrl: news.filter((n) => !n.sourceUrl).length,
    imageUrl: news.filter((n) => !n.imageUrl).length,
    publishedDate: news.filter((n) => !n.publishedDate).length,
    excerpt: news.filter((n) => !n.excerpt).length,
  };

  const urlMap = new Map();
  products.forEach((p) => urlMap.set(p.sourceUrl, (urlMap.get(p.sourceUrl) || 0) + 1));
  const duplicateSourceUrls = [];
  for (const [url, count] of urlMap.entries()) {
    if (count > 1) duplicateSourceUrls.push({ url, count });
  }

  const partMap = new Map();
  products.forEach((p) => {
    if (p.partNumber) {
      partMap.set(p.partNumber, (partMap.get(p.partNumber) || 0) + 1);
    }
  });
  const sharedPartNumbers = [];
  for (const [partNumber, count] of partMap.entries()) {
    if (count > 1) sharedPartNumbers.push({ partNumber, count });
  }

  const suspiciousBrands = [];
  products.forEach((p) => {
    if (p.brand && /test bench|tester|equipment/i.test(p.title)) {
      if (['Bosch', 'Denso', 'Delphi', 'Siemens'].includes(p.brand)) {
        suspiciousBrands.push({
          title: p.title,
          assignedBrand: p.brand,
          reason: 'Test bench assigned to component brand',
        });
      }
    }
  });

  return {
    scrapedAt: new Date().toISOString(),
    totalProducts: products.length,
    totalNews: news.length,
    missingProductFields,
    missingNewsFields,
    duplicateSourceUrls,
    sharedPartNumbers,
    suspiciousBrands,
  };
}

// run scraper and save json files
async function runScraper() {
  console.log('Starting Com-Rail scraper');
  const productMap = new Map();
  const newsMap = new Map();

  for (const cat of CATEGORIES_TO_SCRAPE) {
    await scrapeCategory(cat, productMap);
  }

  await scrapeNews(newsMap);

  const products = Array.from(productMap.values());
  const news = Array.from(newsMap.values());

  const categories = CATEGORIES_TO_SCRAPE.map((cat) => {
    const count = products.filter((p) => p.categorySlug === cat.slug).length;
    return {
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      productCount: count,
    };
  });

  const report = generateValidationReport(products, news);

  fs.writeFileSync(PRODUCTS_FILE, JSON.stringify(products, null, 2), 'utf-8');
  fs.writeFileSync(NEWS_FILE, JSON.stringify(news, null, 2), 'utf-8');
  fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  fs.writeFileSync(REPORT_FILE, JSON.stringify(report, null, 2), 'utf-8');

  console.log(`Scraped ${products.length} products, ${news.length} news items, ${categories.length} categories`);
  return { products, news, categories, report };
}

if (require.main === module) {
  runScraper().catch((err) => {
    console.error('Scraper failed:', err);
    process.exit(1);
  });
}

module.exports = { runScraper, CATEGORIES_TO_SCRAPE };
