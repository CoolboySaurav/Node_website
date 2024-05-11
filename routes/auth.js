const express = require('express');
const router = express.Router();
const handleLogin = require('../controllers/authController');

router.post('/', handleLogin);

module.exports = router;


// { "user": "saurav", "pwd": "Aa$12345" }
// { "user": "bot1", "pwd":"fajdsf341@4afj!" }