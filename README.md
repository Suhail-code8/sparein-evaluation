# Com-Rail B2B Full-Stack Platform

A clean, full-stack industrial B2B application inspired by Carbus24's layout hierarchy, built with **React + Vite**, **Node.js + Express**, and **MongoDB**. Powered by authentic product and news data scraped from [com-rail.com](https://www.com-rail.com/).

---

## Architecture Overview

```
sparein-evaluation/
├── client/                     # React + Vite frontend
│   ├── src/
│   │   ├── components/         # Modular UI components
│   │   ├── index.css           # Vanilla CSS design system
│   │   └── App.jsx             # Main state coordinator & API caller
│   └── vite.config.js          # Dev server and reverse proxy (/api -> :5001)
├── server/                     # Express REST API & MongoDB data layer
│   ├── config/db.js            # MongoDB connection
│   ├── models/                 # Mongoose schemas: Product, Category, News
│   ├── controllers/            # Clean query builders, pagination & filtering
│   ├── routes/                 # Express route definitions
│   ├── middleware/             # Error handling middleware
│   ├── seed.js                 # Idempotent bulk database seeder
│   └── index.js & app.js       # Express server entry point
├── scraper/                    # Web scraper & parser
│   ├── parser.js               # Explainable regex rules for part numbers & brands
│   ├── scraper.js              # Polite scraping with retries and pagination
│   └── data/                   # Scraped JSON datasets
├── tests/                      # Automated test suite (18 tests)
│   ├── parser.test.js          # Parser rule tests
│   ├── deduplication.test.js   # Database upsert & uniqueness tests
│   └── api.test.js             # Express API endpoint tests
└── scripts/
    └── verify-integration.js   # Live integration verification script
```

---

## Quick Start Instructions

### 1. Prerequisites
- **Node.js** (v18+)
- **MongoDB** running locally on port `27017`

### 2. Install Dependencies
```bash
# Install root/backend dependencies
npm install

# Install client dependencies
cd client
npm install
cd ..
```

### 3. Environment Configuration
Create a `.env` file in the root directory (or copy from `.env.example`):
```env
PORT=5001
MONGODB_URI=mongodb://localhost:27017/sparein_evaluation
NODE_ENV=development
```

### 4. Run Scraper & Seed Database
```bash
# Run scraper to extract products and news from Com-Rail
npm run scrape

# Seed data into MongoDB (idempotent upsert via sourceUrl)
npm run seed
```

### 5. Run Automated Tests
```bash
npm test
```
*Runs all 18 automated tests across parser rules, MongoDB deduplication, and Express API routes.*

### 6. Start the Application
Run the backend server:
```bash
npm start
```
*API runs at `http://localhost:5001`.*

In a separate terminal, run the frontend development server:
```bash
cd client
npm run dev
```
*Open `http://localhost:3000` in your browser.*

### 7. Build for Production
```bash
cd client
npm run build
```

---

## Core Engineering Decisions

1. **Authentic Data Only:** No invented prices, fake stock, or unverified certifications. Uses authentic B2B RFQ inquiry flow and verified manufacturer contact information (+8613205380077, biz@com-rail.com).
2. **Brand Isolation:** Avoids misclassifying test equipment as Bosch/Denso just because they test those systems. Equipment manufacturer is Taian Common Diesel, while compatible injector brands are stored in `compatibleBrands`.
3. **Flexible Part Numbers:** Part numbers are extracted using explainable rules. When no valid part number is present in the source title, it is stored as `null` rather than guessing arbitrary words.
4. **Idempotent Seeding:** Upserts records using `sourceUrl` as the unique key so rerunning the scraper or seed command never produces duplicates.
