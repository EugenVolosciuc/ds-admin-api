const express = require('express');

const router = express.Router();

// Used to check the API
router.get('/ping', (req, res) => res.json('pong'));

module.exports = router;