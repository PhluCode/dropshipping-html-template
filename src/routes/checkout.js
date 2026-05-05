const express = require('express');
const router = express.Router();
const checkoutController = require('../controllers/checkoutController');
const { authenticateToken } = require('../controllers/authController');

router.post('/', authenticateToken, checkoutController.checkout);

module.exports = router;