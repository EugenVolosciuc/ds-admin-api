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

module.exports.createLesson = async (req, res, next) => {
    const { vehicle, school, student, instructor, start } = req.body;
    try {
        // NOTE: 
        // Things to consider: 
        // 1. Before creating a lesson, we should check if there is already a lesson in the set time, if the car and instructor are available and if the student doesn't have already a set lesson in the selected timeslot

        const lesson = await Lesson.create({ 
            vehicle,
            school: req.user.school,
            student: student || req.user._id,
            instructor: instructor || req.user._id,
            start: new Date(start)
        });

        res.json(lesson);
    } catch (error) {
        next(error);
    }
}