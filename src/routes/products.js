const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// 3. ตรงนี้ต้องเป็น '/' เท่านั้น
// เพราะมันจะเอาไปต่อกับ '/api/products' จาก app.js รวมกันเป็น '/api/products/'
router.get('/', productController.getProducts);

module.exports = router;