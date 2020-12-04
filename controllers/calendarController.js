const Lesson = require('../database/models/Lesson');
const Exam = require('../database/models/Exam');
const LessonRequest = require('../database/models/LessonRequest');
const { USER_ROLES } = require('../constants');

// @desc    Get calendar events
// @route   GET /calendar
// @access  Private
module.exports.getCalendarEvents = async (req, res, next) => {
    try {
        const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
        const { startAt, endAt, location, eventTypes } = filters; // eventTypes: String[] with options 'exams', 'lessons', 'lesson-requests'

        const user = req.user;

        if (!startAt || !endAt) throw new ErrorHandler(400, 'Please provide a period to search for lessons');

        const requestsLessons = eventTypes.includes('lessons');
        const requestsLessonRequests = eventTypes.includes('lesson-requests');
        const requestsExams = eventTypes.includes('exams');

        let lessons;
        let exams;
        let lessonRequests;

        const getFieldsToPopulate = isExam => {
            const fields = [];
            switch (user.role) {
                case USER_ROLES.LOCATION_ADMIN.tag:
                    fields.push('instructor', 'vehicle', 'student');
                    break;
                case USER_ROLES.INSTRUCTOR.tag:
                    fields.push('location', 'vehicle', 'student');
                    break;
                case USER_ROLES.STUDENT.tag:
                    fields.push('instructor', 'location', 'vehicle');
                    break;
                case USER_ROLES.SCHOOL_ADMIN.tag:
                default:
                    fields.push('instructor', 'location', 'vehicle', 'student');
            }

            if (isExam) fields.push('examType');

            return fields;
        }

        if (requestsLessons) {
            const foundLessons = await Lesson
                .find({
                    start: {
                        $gte: new Date(startAt),
                        $lte: new Date(endAt)
                    },
                    location,
                    ...(user.role === USER_ROLES.INSTRUCTOR.tag && { instructor: user._id }),
                    ...(user.role === USER_ROLES.STUDENT.tag && { student: user._id })
                })
                .populate(getFieldsToPopulate(false));

            lessons = foundLessons;
        }


        if (requestsLessonRequests) {
            const foundLessonRequests = await LessonRequest
                .find({
                    start: {
                        $gte: new Date(startAt),
                        $lte: new Date(endAt)
                    },
                    location,
                    ...(user.role === USER_ROLES.INSTRUCTOR.tag && { instructor: user._id }),
                    ...(user.role === USER_ROLES.STUDENT.tag && { student: user._id })
                })
                .populate(getFieldsToPopulate(false));

            lessonRequests = foundLessonRequests;
        }

        if (requestsExams) {
            const foundExams = await Exam
                .find({
                    start: {
                        $gte: new Date(startAt),
                        $lte: new Date(endAt)
                    },
                    location,
                    ...(user.role === USER_ROLES.INSTRUCTOR.tag && { instructor: user._id }),
                    ...(user.role === USER_ROLES.STUDENT.tag && { student: user._id })
                })
                .populate(getFieldsToPopulate(true));

            exams = foundExams;
        }

        const dataToSend = {
            ...(requestsLessons && { lessons }),
            ...(requestsExams && { exams }),
            ...(requestsLessonRequests && { lessonRequests })
        }
        res.send(dataToSend);
    } catch (error) {
        next(error);
    }
}