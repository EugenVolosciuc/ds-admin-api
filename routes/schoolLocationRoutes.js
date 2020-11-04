const express = require('express');

const { getSchoolLocations, searchSchoolLocations } = require('../controllers/schoolLocationController');
const SchoolLocation = require('../database/models/SchoolLocation');
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
    paginate(SchoolLocation),
    getSchoolLocations
);

router.get(
    '/search',
    requireAuth([
        USER_ROLES.SUPER_ADMIN.tag,
        USER_ROLES.SCHOOL_ADMIN.tag
    ]),
    searchSchoolLocations
);

module.exports = router;