const Exam = require('../database/models/Exam');
const { USER_ROLES } = require('../constants');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');
const lessonAndExamAvailabilityChecker = require('../utils/lessonAndExamAvailabilityChecker');
const { ErrorHandler } = require('../utils/errorHandler');

// @desc    Get exams
// @route   GET /exams
// @access  Private
module.exports.getExams = async (req, res, next) => {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const { startAt, endAt, location } = filters;

    const user = req.user;

    try {
        if (!startAt || !endAt) throw new ErrorHandler(400, 'Please provide a period to search for lessons');

        const getFieldsToPopulate = () => {
            switch (user.role) {
                case USER_ROLES.LOCATION_ADMIN.tag:
                    return ['instructor', 'vehicle', 'student', 'examType']
                case USER_ROLES.INSTRUCTOR.tag:
                    return ['location', 'vehicle', 'student', 'examType']
                case USER_ROLES.STUDENT.tag:
                    return ['instructor', 'location', 'vehicle', 'examType']
                case USER_ROLES.SCHOOL_ADMIN.tag:
                default:
                    return ['instructor', 'location', 'vehicle', 'student', 'examType']
            }
        }

        const exams = await Lesson
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

        res.json(exams);
    } catch (error) {
        next(error);
    }
}

// @desc    Schedule exam
// @route   POST /exams
// @access  Private
module.exports.createExam = async (req, res, next) => {
    const { vehicle, student, instructor, start, end, location, examType } = req.body;

    const user = req.user;

    try {
        await lessonAndExamAvailabilityChecker(user, req.body);

        const exam = await Exam.create({
            examType,
            vehicle,
            location: location || req.user.location,
            student: student || req.user._id,
            instructor: instructor || req.user._id, // TODO: check here
            start: new Date(start),
            end: new Date(end)
        });

        res.json(exam);
    } catch (error) {
        next(error);
    }
}

// @desc    Update exam
// @route   PATCH /exams/:id
// @access  Private
module.exports.updateExam = async (req, res, next) => {
    const possibleUpdates = Object.keys(Exam.schema.obj);
    const dataToUpdate = req.body;
    const user = req.user;

    try {
        await examAndExamAvailabilityChecker(user, req.body, req.params.id);

        const exam = await Exam.findById(req.params.id);

        if (!exam) throw new ErrorHandler(404, 'No exam found');

        checkAndUpdateProperties(exam, dataToUpdate, possibleUpdates);

        await exam.save();

        res.json(exam);
    } catch (error) {
        next(error);
    }
}

// @desc    Delete exam
// @route   DELETE /exams/:id
// @access  Private
module.exports.deleteExam = async (req, res, next) => {
    try {
        const exam = await Exam.findByIdAndDelete(req.params.id);

        if (!exam) throw new ErrorHandler(404, 'No exam found');

        res.json(exam);
    } catch (error) {
        next(error);
    }
}