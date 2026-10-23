// product routes
const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getProductFilters,
} = require('../controllers/productController');

router.get('/meta/filters', getProductFilters);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
