const express = require('express');

const { getLocations, searchLocations } = require('../controllers/locationController');
const Location = require('../database/models/Location');
const { requireAuth } = require('../middleware/authMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get(
    '/',
    requireAuth([
        USER_ROLES.SUPER_ADMIN.tag,
        USER_ROLES.SCHOOL_ADMIN.tag
    ]),
    paginate(Location),
    getLocations
);

router.get(
    '/search',
    requireAuth([
        USER_ROLES.SUPER_ADMIN.tag,
        USER_ROLES.SCHOOL_ADMIN.tag
    ]),
    searchLocations
);

module.exports = router;