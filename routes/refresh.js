const express = require('express');
const router = express.Router();
const handleRefreshToken = require('../controllers/refreshTokenController');

router.get('/', handleRefreshToken);

module.exports = router;


// { "user": "saurav", "pwd": "Aa$12345" }
// { "user": "bot1", "pwd":"fajdsf341@4afj!" }