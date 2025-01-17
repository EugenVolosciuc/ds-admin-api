const express = require('express');

const { getVehicles, createVehicle, updateVehicle, deleteVehicle, searchVehicles, setVehicleUsage } = require('../controllers/vehicleController');
const Vehicle = require('../database/models/Vehicle');
const { requireAuth } = require('../middleware/authMiddleware');
const { requireSchool } = require('../middleware/schoolMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');
const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get(
    '/',
    requireAuth(),
    paginate(Vehicle, ['location', 'instructor']),
    getVehicles
);

router.get(
    '/search',
    requireAuth(),
    searchVehicles
);

router.post(
    '/', 
    requireAuth([
        USER_ROLES.SCHOOL_ADMIN.tag,
        USER_ROLES.LOCATION_ADMIN.tag
    ]),
    requireSchool,
    createVehicle
);

router.patch(
    '/:id',
    requireAuth([
        USER_ROLES.SCHOOL_ADMIN.tag,
        USER_ROLES.LOCATION_ADMIN.tag
    ]),
    requireSchool,
    updateVehicle
)

router.patch(
    '/:id/usage',
    requireAuth([
        USER_ROLES.SCHOOL_ADMIN.tag,
        USER_ROLES.LOCATION_ADMIN.tag
    ]),
    requireSchool,
    setVehicleUsage
)

router.delete('/:id', requireAuth(), deleteVehicle);

module.exports = router;