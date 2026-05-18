const express = require('express');
const router = express.Router();
const { getRecommendation } = require('../controllers/aiController');
const { protect } = require('../middleware/auth');

router.post('/recommend', protect, getRecommendation);

module.exports = router;
