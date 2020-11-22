const isEmpty = require('lodash/isEmpty');

const Lesson = require('../database/models/Lesson');
const Exam = require('../database/models/Exam');
const ExamType = require('../database/models/ExamType');
const { ErrorHandler } = require('./errorHandler');
const { USER_ROLES, EXAMINATION_TYPES } = require('../constants');

// Check student, vehicle and instructor availability
const lessonAndExamAvailabilityChecker = async (user, requestBody, lessonID, examID) => {
    const isNotStudent = user.role !== USER_ROLES.STUDENT.tag;
    const isNotInstructor = user.role !== USER_ROLES.INSTRUCTOR.tag;

    const checker = (itemsToCheck, itemID, itemType) => {
        const errors = [];
        if (!isEmpty(itemsToCheck)) {
            let iterator = 0;

            // errors.length < 4                     Errors length equal 3 when student, vehicle and instructor errors where added
            // iterator < itemsToCheck.length        Iterate through every lesson or exam in the provided period
            while (errors.length < 4 && iterator < itemsToCheck.length) {

                // is an update request
                if (itemID && itemsToCheck[iterator]._id.toString() === itemID) {
                    iterator++;
                    continue;
                }

                // Check if student is available (only if logged in user is not a student)
                if (isNotStudent && itemsToCheck[iterator].student.toString() === requestBody.student) errors.push({ field: 'student', message: `This student already has a scheduled ${itemType} in this time period` });

                // Check if instructor is available (only if logged in user is not an instructor)
                if (isNotInstructor && itemsToCheck[iterator].instructor.toString() === requestBody.instructor) errors.push({ field: 'instructor', message: `This instructor already has a scheduled ${itemType} in this time period` });

                // Check if vehicle is available
                if (itemsToCheck[iterator].vehicle.toString() === requestBody.vehicle) errors.push({ field: 'vehicle', message: `This vehicle is scheduled for another ${itemType} in this time period` });

                iterator++;
            }
        }

        return errors;
    }

    const lessonsInProvidedPeriod = await Lesson.find({
        start: {
            $gte: new Date(requestBody.start),
            $lte: new Date(requestBody.end)
        },
        location: requestBody.location
    });

    const examTypes = await ExamType.find({ school: user.school._id });
    const filteredExamTypes = examTypes.filter(examType => examType.examination === EXAMINATION_TYPES.ROAD_TEST.tag || examType.withInstructor);
    const filteredExamTypeIDs = filteredExamTypes.map(filteredExamType => filteredExamType._id);

    const examsInProvidedPeriod = await Exam.find({
        examType: { $in: filteredExamTypeIDs },
        start: {
            $gte: new Date(requestBody.start),
            $lte: new Date(requestBody.end)
        },
        location: requestBody.location
    });

    const errors = [
        ...checker(lessonsInProvidedPeriod, lessonID, 'lesson'),
        ...checker(examsInProvidedPeriod, examID, 'exam')
    ];

    if (!isEmpty(errors)) throw new ErrorHandler(400, errors);
}

module.exports = lessonAndExamAvailabilityChecker;