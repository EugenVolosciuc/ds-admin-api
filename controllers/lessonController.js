const Lesson = require('../database/models/Lesson');
const { ErrorHandler } = require('../utils/errorHandler');
const { USER_ROLES } = require('../constants');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');
const lessonAvailabilityChecker = require('../utils/lessonAvailabilityChecker');

// @desc    Get lessons
// @route   GET /lessons
// @access  Private
module.exports.getLessons = async (req, res, next) => {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const { startAt, endAt, location } = filters;

    const user = req.user;

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
                location,
                ...(user.role === USER_ROLES.INSTRUCTOR.tag && { instructor: user._id }),
                ...(user.role === USER_ROLES.STUDENT.tag && { student: user._id })
            })
            .populate(getFieldsToPopulate());

        res.json(lessons);
    } catch (error) {
        next(error);
    }
}

// @desc    Create lesson
// @route   POST /lessons
// @access  Private
module.exports.createLesson = async (req, res, next) => {
    const { vehicle, student, instructor, start, end, location } = req.body;

    const user = req.user;

    try {
        await lessonAvailabilityChecker(user, req.body);

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

// @desc    Update lesson
// @route   PATCH /lessons/:id
// @access  Private
module.exports.updateLesson = async (req, res, next) => {
    const possibleUpdates = Object.keys(Lesson.schema.obj);
    const dataToUpdate = req.body;
    const user = req.user;

    try {
        await lessonAvailabilityChecker(user, req.body, req.params.id);

        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) throw new ErrorHandler(404, 'No lesson found');

        checkAndUpdateProperties(lesson, dataToUpdate, possibleUpdates);

        await lesson.save();

        res.json(lesson);
    } catch (error) {
        next(error);
    }
}

// @desc    Delete lesson
// @route   DELETE /lessons/:id
// @access  Private
module.exports.deleteLesson = async (req, res, next) => {
    try {
        const lesson = await Lesson.findByIdAndDelete(req.params.id);

        if (!lesson) throw new ErrorHandler(404, 'No lesson found');

        res.json(lesson);
    } catch (error) {
        next(error);
    }
}