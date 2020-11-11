const express = require('express');

const LessonRequest = require('../database/models/LessonRequest');
const { getLessonRequestsInPeriod, getPaginatedLessonRequests, createLessonRequest, reviewLessonRequest } = require('../controllers/lessonRequestController');
const { requireAuth } = require('../middleware/authMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get(
    '/', 
    requireAuth(),
    paginate(LessonRequest, ['instructor', 'student', 'vehicle', 'location']),
    getPaginatedLessonRequests
);

router.get(
    '/period', 
    requireAuth(), 
    getLessonRequestsInPeriod
);

router.post(
    '/', 
    requireAuth([USER_ROLES.STUDENT.tag]),
    createLessonRequest
);

router.post(
    '/:id/review',
    requireAuth([
        USER_ROLES.SCHOOL_ADMIN.tag,
        USER_ROLES.LOCATION_ADMIN.tag,
        USER_ROLES.INSTRUCTOR.tag
    ]),
    reviewLessonRequest
);

module.exports = router;