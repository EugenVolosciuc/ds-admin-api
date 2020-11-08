const Location = require('../database/models/Location');
const { ErrorHandler } = require('../utils/errorHandler');

// @desc    Get school locations
// @route   GET /school-locations
// @access  Private
module.exports.getLocations = (req, res, next) => {
    try {
        if (!res.paginatedResults.locations) throw new ErrorHandler(404, 'No school locations found');

        res.send(res.paginatedResults);
    } catch (error) {
        next(error);
    }
}

// @desc    Search school locations
// @route   GET /school-locations/search
// @access  Private
module.exports.searchLocations = async (req, res, next) => {
    const { search, school } = req.query;

    if (!search) throw new ErrorHandler(400, 'No search params provided');

    try {
        const searchFields = JSON.parse(search);

        const searchableFields = Object.entries(searchFields).reduce((acc, currentValue) => {
            acc[currentValue[0]] = new RegExp(currentValue[1], "i");
            return acc;
        }, {});

        const locations = await Location.find({ ...searchableFields, school });

        res.json(locations);
    } catch (error) {
        next(error);
    }
}