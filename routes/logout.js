const express = require('express');
const router = express.Router();
const handleLogout = require('../controllers/logoutController');

router.get('/', handleLogout);

module.exports = router;


// { "user": "saurav", "pwd": "Aa$12345" }
// { "user": "bot1", "pwd":"fajdsf341@4afj!" }