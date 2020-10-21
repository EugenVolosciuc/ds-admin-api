const express = require('express');

const School = require('../database/models/School');
const { createSchool, getSchools } = require('../controllers/schoolController');
const { paginate } = require('../middleware/paginationMiddleware');
const { requireAuth } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

// TODO: add requireRole middleware with specific roles
router.get(
    '/',
    requireAuth([USER_ROLES.SUPER_ADMIN.tag,]),
    paginate(School, ['admin']),
    getSchools
);
router.post('/', createSchool);

module.exports = router;