const Lesson = require('../database/models/Lesson');
const { ErrorHandler } = require('../utils/errorHandler');
const { USER_ROLES } = require('../constants');
const checkForUpdatableProperties = require('../utils/updatablePropertyChecker');

// @desc    Get lessons
// @route   GET /lessons
// @access  Private
module.exports.getLessons = async (req, res, next) => {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const { startAt, endAt, location } = filters;

    const user = req.user;

    // TODO: Check for the user's role to know what lessons to return exactly
    try {
        if (!startAt || !endAt) throw new ErrorHandler(400, 'Please provide a period to search for lessons');

        const getFieldsToPopulate = () => {
            switch (user.role) {
                case USER_ROLES.LOCATION_ADMIN.tag:
                    return ['instructor', 'vehicle', 'student']
                case USER_ROLES.INSTRUCTOR.tag:
                    return ['location', 'vehicle', 'student']
                case USER_ROLES.STUDENT.tag:
                    return ['instructor', 'location', 'vehicle']
                case USER_ROLES.SCHOOL_ADMIN.tag:
                default:
                    return ['instructor', 'location', 'vehicle', 'student']
            }
        }

        const lessons = await Lesson
            .find({
                start: {
                    $gte: new Date(startAt),
                    $lte: new Date(endAt)
                },
                location
            })
            .populate(getFieldsToPopulate());

        res.json(lessons);
    } catch (error) {
        next(error);
    }
}

module.exports.createLesson = async (req, res, next) => {
    const { vehicle, student, instructor, start, end, location } = req.body;
    try {
        // NOTE: 
        // Things to consider: 
        // 1. Before creating a lesson, we should check if there is already a lesson in the set time, if the car and instructor are available and if the student doesn't have already a set lesson in the selected timeslot

        const lesson = await Lesson.create({
            vehicle,
            location: location || req.user.location,
            student: student || req.user._id,
            instructor: instructor || req.user._id,
            start: new Date(start),
            end: new Date(end)
        });

        res.json(lesson);
    } catch (error) {
        next(error);
    }
}