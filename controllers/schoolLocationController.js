const SchoolLocation = require('../database/models/SchoolLocation');
const { ErrorHandler } = require('../utils/errorHandler');

// @desc    Get school locations
// @route   GET /school-locations
// @access  Private
module.exports.getSchoolLocations = (req, res, next) => {
    try {
        if (!res.paginatedResults.schoollocations) {
            throw new ErrorHandler(404, 'No school locations found');
        }

        res.send(res.paginatedResults);
    } catch (error) {
        next(error);
    }
}