const LessonRequest = require('../database/models/LessonRequest');
const Lesson = require('../database/models/Lesson');
const { ErrorHandler } = require('../utils/errorHandler');
const { USER_ROLES } = require('../constants');
const lessonAvailabilityChecker = require('../utils/lessonAvailabilityChecker');

// @desc    Get paginated lesson requests 
// @route   GET /lesson-requests
// @access  Private
module.exports.getPaginatedLessonRequests = async (req, res, next) => {
    try {
        if (!res.paginatedResults.lessonrequests) throw new ErrorHandler(404, 'No schools found');

        res.send(res.paginatedResults);
    } catch (error) {
        next(error);
    }
}

// @desc    Get lesson requests between two times
// @route   GET /lesson-requests/period
// @access  Private
module.exports.getLessonRequestsInPeriod = async (req, res, next) => {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const { startAt, endAt, location } = filters;

    const user = req.user;

    try {
        if (!startAt || !endAt) throw new ErrorHandler(400, 'Please provide a period to search for lesson requests');

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

        const lessonRequests = await LessonRequest
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

        res.json(lessonRequests);
    } catch (error) {
        next(error);
    }
}

// @desc    Create lesson request
// @route   POST /lesson-requests
// @access  Private
module.exports.createLessonRequest = async (req, res, next) => {
    const { vehicle, instructor, start, end } = req.body;

    const user = req.user;

    try {
        await lessonAvailabilityChecker(user, req.body);

        const lessonRequest = await LessonRequest.create({
            vehicle,
            location: req.user.location,
            student: req.user._id,
            instructor,
            start: new Date(start),
            end: new Date(end)
        });

        res.json(lessonRequest);
    } catch (error) {
        next(error);
    }
}

// @desc    Accept or reject lesson request
// @route   POST /lesson-requests/:id/review
// @access  Private
module.exports.reviewLessonRequest = async (req, res, next) => {
    const { action, rejectionReason } = req.body;
    const { id } = req.params;

    let lessonRequest;

    const user = req.user;

    try {
        switch (action) {
            case 'accept':
                lessonRequest = await LessonRequest.findByIdAndDelete(id);
                if (!lessonRequest) throw new ErrorHandler(404, 'No lesson request found');

                await lessonAvailabilityChecker(user, lessonRequest);

                const lesson = await Lesson.create({
                    vehicle: lessonRequest.vehicle,
                    location: lessonRequest.location,
                    student: lessonRequest.student,
                    instructor: lessonRequest.instructor,
                    start: new Date(lessonRequest.start),
                    end: new Date(lessonRequest.end)
                })

                return res.json(lesson);
            case 'reject':
                lessonRequest = await LessonRequest.findById(id);
                if (!lessonRequest) throw new ErrorHandler(404, 'No lesson request found');

                lessonRequest.rejectionReason = rejectionReason;

                await lessonRequest.save();

                return res.json(lessonRequest);
            default:
                throw new ErrorHandler(400, 'Please provide a valid action: accept or deny');
        }
    } catch (error) {
        next(error);
    }
}