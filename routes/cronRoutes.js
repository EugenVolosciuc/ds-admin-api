const express = require('express');

const { USER_ROLES } = require('../constants');
const { requireAuth } = require('../middleware/authMiddleware');
const { getCronJobs, runCronJobAction } = require('../controllers/cronController');

const router = express.Router();

router.get(
    '/', 
    requireAuth([USER_ROLES.SUPER_ADMIN.tag]),
    getCronJobs
)

router.post(
    '/',
    requireAuth([USER_ROLES.SUPER_ADMIN.tag]),
    runCronJobAction
)

module.exports = router;