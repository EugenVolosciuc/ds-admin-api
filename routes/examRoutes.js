const express = require('express');

const { getExams, createExam, updateExam, deleteExam } = require('../controllers/examController');
const { requireAuth } = require('../middleware/authMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get(
    '/',
    requireAuth(),
    getExams
);

router.post(
    '/',
    requireAuth([
        USER_ROLES.SCHOOL_ADMIN.tag,
        USER_ROLES.LOCATION_ADMIN.tag,
        USER_ROLES.INSTRUCTOR.tag
    ]),
    createExam
);

router.patch(
    '/:id',
    requireAuth([
        USER_ROLES.SCHOOL_ADMIN.tag,
        USER_ROLES.LOCATION_ADMIN.tag,
        USER_ROLES.INSTRUCTOR.tag
    ]),
    updateExam
);

router.delete(
    '/:id',
    requireAuth([
        USER_ROLES.SCHOOL_ADMIN.tag,
        USER_ROLES.LOCATION_ADMIN.tag,
        USER_ROLES.INSTRUCTOR.tag
    ]),
    deleteExam
);

module.exports = router;