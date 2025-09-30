// backend/routes/headOfSalesDetail.js
const express = require('express');
const router = express.Router();
const headOfSalesDetailController = require('../controllers/headOfSalesDetailController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/:salesId', authMiddleware(['Head Sales', 'Admin']), headOfSalesDetailController.getSalesDetail);

module.exports = router;