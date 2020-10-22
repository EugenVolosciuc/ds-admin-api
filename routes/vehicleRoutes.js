const express = require('express');

const { getVehicles } = require('../controllers/vehicleController');
const Vehicle = require('../database/models/Vehicle');
const { requireAuth } = require('../middleware/authMiddleware');
const { paginate } = require('../middleware/paginationMiddleware');
// const { USER_ROLES } = require('../constants');

const router = express.Router();

router.get(
    '/',
    requireAuth(),
    paginate(Vehicle),
    getVehicles
);

module.exports = router;