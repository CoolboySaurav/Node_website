const express = require('express');
const router = express.Router();
const path = require('path');

router.get('^/$|/default(.html)?', ( req, res) => {
    res.sendFile(path.join(__dirname, '..','views', 'subdir', 'default.html'));
});


module.exports = router;