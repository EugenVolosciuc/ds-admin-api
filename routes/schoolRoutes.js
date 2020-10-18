const express = require('express');

const School = require('../database/models/School');
const { createSchool, getSchools } = require('../controllers/schoolController');
const { paginate } = require('../middleware/paginationMiddleware');


const router = express.Router();

// TODO: add requireRole middleware with specific roles
router.get('/', paginate(School, ['admin']), getSchools);
router.post('/', createSchool);

module.exports = router;