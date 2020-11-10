const isEmpty = require('lodash/isEmpty');

const Lesson = require('../database/models/Lesson');
const { ErrorHandler } = require('../utils/errorHandler');
const { USER_ROLES } = require('../constants');
const checkForUpdatableProperties = require('../utils/updatablePropertyChecker');

const availabilityChecker = async (user, requestBody, lessonID) => {
    const isNotStudent = user.role !== USER_ROLES.STUDENT.tag;
    const isNotInstructor = user.role !== USER_ROLES.INSTRUCTOR.tag;

    // Check student, vehicle and instructor availability
    const lessonsInProvidedPeriod = await Lesson.find({
        start: {
            $gte: new Date(requestBody.start),
            $lte: new Date(requestBody.end)
        },
        location: requestBody.location
    })

    if (!isEmpty(lessonsInProvidedPeriod)) {
        const errors = [];
        let iterator = 0;

        // errors.length < 4                                Errors length equal 3 when student, vehicle and instructor errors where added
        // iterator < lessonsInProvidedPeriod.length        Iterate through every lesson in the provided period
        while (errors.length < 4 && iterator < lessonsInProvidedPeriod.length) {
            // is an update request
            if (lessonID && lessonsInProvidedPeriod[iterator]._id === lessonID) {
                iterator++;
                continue;
            }

            // Check if student is available (only if logged in user is not a student)
            if (isNotStudent && lessonsInProvidedPeriod[iterator].student.toString() === requestBody.student) errors.push({ field: 'student', message: 'This student already has a scheduled lesson in this time period' })

            // Check if instructor is available (only if logged in user is not an instructor)
            if (isNotInstructor && lessonsInProvidedPeriod[iterator].instructor.toString() === requestBody.instructor) errors.push({ field: 'instructor', message: 'This instructor already has a scheduled lesson in this time period' })

            // Check if vehicle is available
            if (lessonsInProvidedPeriod[iterator].vehicle.toString() === requestBody.vehicle) errors.push({ field: 'vehicle', message: 'This vehicle is scheduled for another lesson in this time period' })

            iterator++;
        }

        throw new ErrorHandler(400, errors);
    }
}

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

module.exports.createLesson = async (req, res, next) => {
    const { vehicle, student, instructor, start, end, location } = req.body;

    const user = req.user;

    try {
        await availabilityChecker(user, req.body);

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

module.exports.updateLesson = async (req, res, next) => {
    const { start, end, location } = req.body;
    const possibleUpdates = Object.keys(Lesson.schema.obj);
    const dataToUpdate = req.body;
    const user = req.user;

    try {
        await availabilityChecker(user, req.body);

        const lesson = await Lesson.findById(req.params.id);

        if (!lesson) throw new ErrorHandler(404, 'No lesson found');

        checkForUpdatableProperties(lesson, dataToUpdate, possibleUpdates);

        await lesson.save();

        res.json(lesson);
    } catch (error) {
        next(error);
    }
}