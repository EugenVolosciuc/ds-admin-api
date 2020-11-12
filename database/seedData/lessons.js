const isEmpty = require('lodash/isEmpty');

const Lesson = require('../models/Lesson');
const Vehicle = require('../models/Vehicle');
const User = require('../models/User');
const getLocationIDs = require('../../utils/getLocationIDs');
const getRandomInt = require('../../utils/getRandomInt');
const { USER_ROLES } = require('../../constants');

const numOfLessons = 20;

const lessonsRange = [];

for (let lessonNum = 1; lessonNum <= numOfLessons; lessonNum++) {
    lessonsRange.push(lessonNum);
}

const getLessons = async () => {
    const locationIDs = await getLocationIDs();

    const lessons = await Promise.all(lessonsRange
        .map(async lessonNum => {
            const randomLocationID = Object.values(locationIDs)[getRandomInt(0, Object.values(locationIDs).length - 1)];

            try {
                const students = await User.find({ role: USER_ROLES.STUDENT.tag, location: randomLocationID });
                const instructors = await User.find({ role: USER_ROLES.INSTRUCTOR.tag, location: randomLocationID });
                const vehicles = await Vehicle.find({ location: randomLocationID });

                if (isEmpty(students) || isEmpty(instructors) || isEmpty(vehicles)) return null;

                const randomStudent = students[getRandomInt(0, students.length - 1)];
                const randomInstructor = instructors[getRandomInt(0, instructors.length - 1)];
                const randomVehicle = vehicles[getRandomInt(0, vehicles.length - 1)];

                const random1To10 = Math.floor(Math.random() * 10) + 1;

                const now = new Date();

                const start = new Date(now.getTime() + (lessonNum * 60 * 60 * 1000 + (random1To10 * 60)));
                const end = new Date(now.getTime() + (lessonNum * 60 * 60 * 1000 + (random1To10 * 60) + (1.5 * 60 * 60 * 1000)));

                return {
                    student: randomStudent._id,
                    instructor: randomInstructor._id,
                    vehicle: randomVehicle._id,
                    location: randomLocationID,
                    start,
                    end,
                }
            } catch (error) {
                console.log(`Error getting data for new lesson: `, error);
                return null;
            }
        }))

        const filteredLessons = lessons.filter(lesson => lesson !== null);
    return filteredLessons;
}

module.exports = getLessons;