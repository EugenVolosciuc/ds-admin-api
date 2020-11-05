const Lesson = require('../database/models/Lesson');
const { ErrorHandler } = require('../utils/errorHandler');
const checkForUpdatableProperties = require('../utils/updatablePropertyChecker');

// @desc    Get lessons
// @route   GET /lessons
// @access  Private
module.exports.getLessons = async (req, res, next) => {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const { startAt, endAt, school } = filters;

    if (!startAt || !endAt) throw new ErrorHandler(400, 'Please provide a period to search for lessons');

    // TODO: Check for the user's role to know what lessons to return exactly
    try {
        const lessons = await Lesson.find({
            start: {
                $gte: new Date(startAt),
                $lte: new Date(endAt)
            },
            school
        });

        res.json(lessons);
    } catch (error) {
        next(error);
    }
}
