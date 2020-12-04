const express = require('express');

const { getCalendarEvents } = require('../controllers/calendarController');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/', requireAuth(), getCalendarEvents);

module.exports = router;