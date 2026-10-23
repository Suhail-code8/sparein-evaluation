const cheerio = require('cheerio');

// target brands tested on com-rail machines
const KNOWN_TEST_TARGETS = [
  'Bosch',
  'Denso',
  'Delphi',
  'Siemens',
  'Caterpillar',
  'CAT',
  'Cummins',
  'Volvo',
  'Scania',
  'MTU',
];

// extract model code or part number with explainable rules
function extractPartNumber(title) {
  if (!title || typeof title !== 'string') {
    return { partNumber: null, rule: 'none (empty title)' };
  }

  // test bench model patterns like CRS-918 PLUS, CRS-618C Pro, COM-HUP, EUI-200
  const modelRegex = /\b((?:CRS|EUI|HEUI|HU|CU|COM)-[A-Z0-9]+(?:\s+(?:PLUS|PRO|Pro))?)\b/i;
  const modelMatch = title.match(modelRegex);
  if (modelMatch) {
    return {
      partNumber: modelMatch[1].trim(),
      rule: 'Rule 1: Equipment Model Pattern (' + modelMatch[1].trim() + ')',
    };
  }

  // oem diesel replacement part patterns
  const oemPatterns = [
    { name: 'Bosch 10-digit', regex: /\b0\d{9}\b/ },
    { name: 'Denso hyphenated', regex: /\b\d{6}-\d{4}\b/ },
    { name: 'Delphi hyphenated', regex: /\b\d{4}-\d{3,4}\b/ },
    { name: 'Bosch component F00-series', regex: /\bF00[A-Z0-9]{7}\b/i },
    { name: 'Delphi Smart Injector BEBE', regex: /\bBEBE[A-Z0-9]{7}\b/i },
    { name: 'Toyota OEM injector', regex: /\b23670-[0-9A-Z]{5}\b/i },
    { name: 'MTU diesel pump', regex: /\bX\d{11}\b/i },
    { name: '8-digit OEM code', regex: /\b\d{8}\b/ },
  ];

  for (const { name, regex } of oemPatterns) {
    const match = title.match(regex);
    if (match) {
      return {
        partNumber: match[0],
        rule: 'Rule 2: OEM Pattern [' + name + '] (' + match[0] + ')',
      };
    }
  }

  return { partNumber: null, rule: 'none (no valid identifier detected)' };
}

// distinguish product manufacturer from tested brands
function extractProductBrand(title, description, categorySlug) {
  if (!title) return null;

  const brandMatchers = [
    { match: /China United Diesel/i, brand: 'China United Diesel' },
    { match: /Original MTU|MTU Pump/i, brand: 'MTU' },
    { match: /^DELPHI Original|^Delphi /i, brand: 'Delphi' },
    { match: /^BOSCH Original|^Bosch /i, brand: 'Bosch' },
    { match: /^DENSO Original|^Denso /i, brand: 'Denso' },
    { match: /^CATERPILLAR Original|^CAT /i, brand: 'Caterpillar' },
    { match: /^CUMMINS Original|^Cummins /i, brand: 'Cummins' },
    { match: /Liwei/i, brand: 'Liwei' },
    { match: /Befrag/i, brand: 'Befrag' },
  ];

  for (const item of brandMatchers) {
    if (item.match.test(title)) {
      return item.brand;
    }
  }

  if (categorySlug) {
    if (categorySlug.startsWith('bosch')) return 'Bosch';
    if (categorySlug.startsWith('denso')) return 'Denso';
    if (categorySlug.startsWith('delphi')) return 'Delphi';
    if (categorySlug.startsWith('caterpillar')) return 'Caterpillar';
    if (categorySlug.startsWith('cummins')) return 'Cummins';
  }

  return null;
}

// extract compatible systems mentioned in text
function extractCompatibleBrands(title, description) {
  const combined = ((title || '') + ' ' + (description || '')).toLowerCase();
  const compatible = new Set();

  for (const target of KNOWN_TEST_TARGETS) {
    const regex = new RegExp('\\b' + target.toLowerCase() + '\\b', 'i');
    if (regex.test(combined)) {
      compatible.add(target === 'CAT' ? 'Caterpillar' : target);
    }
  }

  return Array.from(compatible);
}

// clean whitespace and limit length
function cleanText(raw, maxLen = 400) {
  if (!raw) return '';
  return raw
    .replace(/\u00a0/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

// parse single product card element
function parseProductCard($, el, category, categorySlug) {
  const $el = $(el);

  const titleAnchor = $el.find('h3.item_title a, figcaption a').first();
  const imgTag = $el.find('span.item_img img, .item-img img, figure img').first();

  const rawAnchorTitle = (titleAnchor.text() || '').trim();
  const anchorAttrTitle = (titleAnchor.attr('title') || '').trim();
  const imgAltTitle = (imgTag.attr('alt') || '').trim();

  let fullTitle = rawAnchorTitle;
  if (fullTitle.endsWith('...') || fullTitle.length < imgAltTitle.length) {
    fullTitle = anchorAttrTitle || imgAltTitle || rawAnchorTitle;
  }
  fullTitle = fullTitle.replace(/\s+/g, ' ').trim();

  if (!fullTitle) return null;

  const sourceUrl = (titleAnchor.attr('href')
    || $el.find('span.item_img a, a.item-img').attr('href') || '').trim() || null;

  const imageUrl = (imgTag.attr('src') || '').trim() || null;
  const description = cleanText($el.find('div.item_info, .item-detail').text());

  const { partNumber, rule: partNumberRule } = extractPartNumber(fullTitle);
  const brand = extractProductBrand(fullTitle, description, categorySlug);
  const compatibleBrands = extractCompatibleBrands(fullTitle, description);

  return {
    rawTitle: rawAnchorTitle,
    title: fullTitle,
    sourceUrl,
    imageUrl,
    partNumber,
    partNumberRule,
    brand,
    compatibleBrands,
    category,
    categorySlug,
    description,
    scrapedAt: new Date().toISOString(),
  };
}

// parse news item from listing page
function parseNewsItem($, el) {
  const $el = $(el);

  const titleAnchor = $el.find('h3.item-title a, h3 a').first();
  const title = (titleAnchor.text() || '').replace(/\s+/g, ' ').trim();
  const sourceUrl = (titleAnchor.attr('href') || $el.find('a.item-img').attr('href') || '').trim() || null;

  if (!title || !sourceUrl) return null;

  const imageUrl = ($el.find('img.blog-img, img').first().attr('src') || '').trim() || null;
  const timeText = ($el.find('time').text() || '').trim();
  const dateMatch = timeText.match(/\d{4}-\d{2}-\d{2}/);
  const publishedDate = dateMatch ? new Date(dateMatch[0]).toISOString() : null;
  const excerpt = cleanText($el.find('div.item-detail').text(), 350);

  return {
    title,
    sourceUrl,
    imageUrl,
    publishedDate,
    publishedDateRaw: timeText,
    excerpt,
    scrapedAt: new Date().toISOString(),
  };
}

// detect total pages from pagination links
function detectPagination($) {
  const pageBarText = $('.pages, .page-bar').text().replace(/\s+/g, ' ').trim();
  const pageSlashMatch = pageBarText.match(/Page\s+(\d+)\s*\/\s*(\d+)/i);
  if (pageSlashMatch) {
    return {
      currentPage: parseInt(pageSlashMatch[1], 10),
      totalPages: parseInt(pageSlashMatch[2], 10),
    };
  }

  let maxPage = 1;
  $('.pages a, .page-bar a').each((_, a) => {
    const num = parseInt($(a).text().trim(), 10);
    if (!isNaN(num) && num > maxPage) maxPage = num;
  });

  return {
    currentPage: 1,
    totalPages: maxPage,
  };
}

module.exports = {
  extractPartNumber,
  extractProductBrand,
  extractCompatibleBrands,
  cleanText,
  parseProductCard,
  parseNewsItem,
  detectPagination,
};
