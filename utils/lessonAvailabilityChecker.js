const isEmpty = require('lodash/isEmpty');

const Lesson = require('../database/models/Lesson');
const { ErrorHandler } = require('../utils/errorHandler');
const { USER_ROLES } = require('../constants');

const lessonAvailabilityChecker = async (user, requestBody, lessonID) => {
    const isNotStudent = user.role !== USER_ROLES.STUDENT.tag;
    const isNotInstructor = user.role !== USER_ROLES.INSTRUCTOR.tag;

    // Check student, vehicle and instructor availability
    const lessonsInProvidedPeriod = await Lesson.find({
        start: {
            $gte: new Date(requestBody.start),
            $lte: new Date(requestBody.end)
        },
        location: requestBody.location
    });

    if (!isEmpty(lessonsInProvidedPeriod)) {
        const errors = [];
        let iterator = 0;

        // errors.length < 4                                Errors length equal 3 when student, vehicle and instructor errors where added
        // iterator < lessonsInProvidedPeriod.length        Iterate through every lesson in the provided period
        while (errors.length < 4 && iterator < lessonsInProvidedPeriod.length) {
            // is an update request

            if (lessonID && lessonsInProvidedPeriod[iterator]._id.toString() === lessonID) {
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

        if (!isEmpty(errors)) throw new ErrorHandler(400, errors);
    }
}

module.exports = lessonAvailabilityChecker;