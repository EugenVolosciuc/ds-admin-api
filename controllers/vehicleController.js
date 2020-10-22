const Vehicle = require('../database/models/Vehicle');
const { ErrorHandler } = require('../utils/errorHandler');

// @desc    Get vehicles
// @route   GET /vehicles
// @access  Private
module.exports.getVehicles = (req, res, next) => {
    try {
        if (!res.paginatedResults.vehicles) {
            throw new ErrorHandler(404, 'No vehicles found');
        }

        res.send(res.paginatedResults);
    } catch (error) {
        next(error);
    }
}