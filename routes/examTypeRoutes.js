const express = require('express');

const { getExamTypes, createExamType, modifyExamType, deleteExamType } = require('../controllers/examTypeController');
const { USER_ROLES } = require('../constants');
const { requireAuth } = require('../middleware/authMiddleware');

const router = express.Router();

router.get(
    '/',
    requireAuth(),
    getExamTypes
);

router.post(
    '/',
    requireAuth([USER_ROLES.SCHOOL_ADMIN.tag]),
    createExamType
);

router.patch(
    '/:id',
    requireAuth([USER_ROLES.SCHOOL_ADMIN.tag]),
    modifyExamType
);

router.delete(
    '/:id',
    requireAuth([USER_ROLES.SCHOOL_ADMIN.tag]),
    deleteExamType
);

module.exports = router;