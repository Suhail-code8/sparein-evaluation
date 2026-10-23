// integration verification script
const http = require('http');

// helper for http get
function request(path) {
  return new Promise((resolve, reject) => {
    http.get('http://localhost:3000' + path, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, body: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    }).on('error', reject);
  });
}

// verify frontend and backend proxy integration
async function runVerification() {
  console.log('Verifying frontend and backend integration...');

  // 1. check frontend html
  const home = await request('/');
  const hasRoot = home.raw && home.raw.includes('id="root"');
  console.log(`1. Frontend HTML: HTTP ${home.status} (${hasRoot ? 'OK' : 'FAIL'})`);

  // 2. check categories proxy
  const cats = await request('/api/categories');
  console.log(`2. /api/categories: HTTP ${cats.status} (${cats.body?.count || 0} categories)`);

  // 3. check products proxy
  const prods = await request('/api/products?page=1&limit=12');
  console.log(`3. /api/products: HTTP ${prods.status} (${prods.body?.pagination?.totalRecords || 0} total records)`);

  // 4. check product search
  const search = await request('/api/products?search=CRS-918');
  console.log(`4. /api/products?search=CRS-918: HTTP ${search.status} (${search.body?.pagination?.totalRecords || 0} matches)`);

  // 5. check category filter
  const catFilter = await request('/api/products?category=bosch-original-parts&limit=5');
  console.log(`5. /api/products?category=bosch-original-parts: HTTP ${catFilter.status} (${catFilter.body?.pagination?.totalRecords || 0} matches)`);

  // 6. check compatible brand filter
  const compFilter = await request('/api/products?compatibleBrand=Delphi&limit=5');
  console.log(`6. /api/products?compatibleBrand=Delphi: HTTP ${compFilter.status} (${compFilter.body?.pagination?.totalRecords || 0} matches)`);

  // 7. check news proxy
  const news = await request('/api/news?limit=3');
  console.log(`7. /api/news: HTTP ${news.status} (${news.body?.data?.length || 0} items)`);

  console.log('Integration checks complete.');
}

runVerification().catch((err) => {
  console.error('Integration verification failed:', err.message);
  process.exit(1);
});
