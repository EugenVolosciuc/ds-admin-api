const express = require('express');

const { getLessons, createLesson } = require('../controllers/lessonController');
const { requireAuth } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get('/', requireAuth(), getLessons);

router.post('/', requireAuth(), createLesson);

module.exports = router;