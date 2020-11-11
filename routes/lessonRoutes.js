const express = require('express');

const { getLessons, createLesson, updateLesson, deleteLesson } = require('../controllers/lessonController');
const { requireAuth } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get('/', requireAuth(), getLessons);

router.post('/', requireAuth(), createLesson);

router.patch('/:id', requireAuth(), updateLesson);

router.delete('/:id', requireAuth(), deleteLesson);

module.exports = router;