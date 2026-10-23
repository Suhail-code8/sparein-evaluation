const test = require('node:test');
const assert = require('node:assert/strict');
const cheerio = require('cheerio');
const {
  extractPartNumber,
  extractProductBrand,
  extractCompatibleBrands,
  parseProductCard,
  parseNewsItem,
  detectPagination,
} = require('../scraper/parser');

test('Parser — extractPartNumber Rule 1 (Equipment Models)', () => {
  const t1 = extractPartNumber('CRS-918 PLUS common rail injector and pump test bench');
  assert.equal(t1.partNumber, 'CRS-918 PLUS');
  assert.match(t1.rule, /Equipment Model Pattern/);

  const t2 = extractPartNumber('CRS-618C Pro common rail injector and pump test bench');
  assert.equal(t2.partNumber, 'CRS-618C Pro');

  const t3 = extractPartNumber('CAT actuate pump test equipment COM-HUP');
  assert.equal(t3.partNumber, 'COM-HUP');

  const t4 = extractPartNumber('EUI-200 test bench');
  assert.equal(t4.partNumber, 'EUI-200');

  const t5 = extractPartNumber('COM-1800S EUI EUP TEST BENCH');
  assert.equal(t5.partNumber, 'COM-1800S');
});

test('Parser — extractPartNumber Rule 2 (OEM Diesel Spare Parts)', () => {
  const p1 = extractPartNumber('Bosch injector 0445110591 for Cummins');
  assert.equal(p1.partNumber, '0445110591');
  assert.match(p1.rule, /Bosch 10-digit/);

  const p2 = extractPartNumber('China United Diesel Brand 295040-9417 G17 Orifice Valve Plate');
  assert.equal(p2.partNumber, '295040-9417');
  assert.match(p2.rule, /Denso hyphenated/);

  const p3 = extractPartNumber('DELPHI Nozzle Control Valve 7206-0857 for DAF MX');
  assert.equal(p3.partNumber, '7206-0857');
  assert.match(p3.rule, /Delphi hyphenated/);

  const p4 = extractPartNumber('Bosch F00BJ00006 Fuel injector for Cummins');
  assert.equal(p4.partNumber, 'F00BJ00006');
});

test('Parser — extractPartNumber Fallback (Strictly null, no guessing)', () => {
  const generic = extractPartNumber('General Diesel Repair Tools and Hardware Kit');
  assert.equal(generic.partNumber, null);
  assert.match(generic.rule, /none/);

  // Does not extract arbitrary words like "ACTUATE" or "BENCH"
  const wordTest = extractPartNumber('Special High Pressure Actuate Device');
  assert.equal(wordTest.partNumber, null);
});

test('Parser — Brand vs Compatibility Isolation', () => {
  const desc = 'CRS-918 PLUS is a test bench, it can test injector of BOSCH, SIEMENS, DELPHI and DENSO.';
  const brand = extractProductBrand('CRS-918 PLUS common rail test bench', desc, 'common-rail-test-bench');
  assert.equal(brand, null, 'Must NOT infer Bosch as brand for a Common Rail test bench');

  const compatible = extractCompatibleBrands('CRS-918 PLUS', desc);
  assert.ok(compatible.includes('Bosch'));
  assert.ok(compatible.includes('Siemens'));
  assert.ok(compatible.includes('Delphi'));
  assert.ok(compatible.includes('Denso'));
});

test('Parser — parseNewsItem HTML parsing', () => {
  const html = `
    <li class="blog-item">
      <figure class="item-wrap">
        <a class="item-img" href="https://www.com-rail.com/news/canton-fair-2026"><img class="blog-img" src="https://cdn.globalso.com/com-rail/fair.jpg" alt="Fair"></a>
        <figcaption class="item-info">
          <h3 class="item-title"><a href="https://www.com-rail.com/news/canton-fair-2026">The 140th Canton Fair Success</a></h3>
          <time>by admin on 2026-10-16</time>
          <div class="item-detail">Taian Common Diesel Industry participated in the fair exhibiting at booth 11.3K47.</div>
        </figcaption>
      </figure>
    </li>
  `;
  const $ = cheerio.load(html);
  const parsed = parseNewsItem($, $('.blog-item'));

  assert.equal(parsed.title, 'The 140th Canton Fair Success');
  assert.equal(parsed.sourceUrl, 'https://www.com-rail.com/news/canton-fair-2026');
  assert.equal(parsed.imageUrl, 'https://cdn.globalso.com/com-rail/fair.jpg');
  assert.ok(parsed.publishedDate.startsWith('2026-10-16'));
  assert.match(parsed.excerpt, /Taian Common Diesel/);
});

test('Parser — detectPagination detects page counts', () => {
  const html = '<div class="pages">1 2 3 <a href="?p=2">Next &gt;</a> Page 1 / 8</div>';
  const $ = cheerio.load(html);
  const pagination = detectPagination($);

  assert.equal(pagination.currentPage, 1);
  assert.equal(pagination.totalPages, 8);
});
