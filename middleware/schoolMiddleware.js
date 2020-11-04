const School = require('../database/models/School');
const { ErrorHandler } = require('../utils/errorHandler');

module.exports.requireSchool = async (req, res, next) => {
    try {
        if (!req.user) throw new ErrorHandler(401, 'Access denied to this resource');

        const school = await School.findById(req.user.school);

        if (!school) throw new ErrorHandler(401, 'No associated school was found');

        req.school = school;

        next();
    } catch (error) {
        next(error);
    }
}