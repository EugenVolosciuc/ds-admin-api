const express = require('express');

const { getLessons } = require('../controllers/lessonController');
const { requireAuth } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get('/', requireAuth(), getLessons);

module.exports = router;