const cron = require('node-cron');
const dayjs = require('dayjs');
const isEmpty = require('lodash/isEmpty');

const Lesson = require('../../database/models/Lesson');
const Vehicle = require('../../database/models/Vehicle');
const { VEHICLE_STATUSES } = require('../../constants');

const periodInMinutes = 10; // 10 because the minute step when creating a lesson in the modal is 10

const change_car_status_at_lesson_start_and_end = async () => {
    const cronJob = cron.schedule(`*/${periodInMinutes} * * * *`, async () => {
        try {
            // Get all lessons that start in the next 10 minutes
            const lessonsForStart = await Lesson.find({
                start: {
                    $gte: dayjs(),
                    $lte: dayjs().add(periodInMinutes, 'minutes')
                }
            });

            // Get all lessons that ended in the previous 10 minutes
            const lessonsForEnd = await Lesson.find({
                end: {
                    $gte: dayjs().subtract(periodInMinutes, 'minutes'),
                    $lte: dayjs()
                }
            });

            if (!isEmpty(lessonsForStart)) {
                lessons.forEach( async lesson => {
                    const vehicle = await Vehicle.findById(lesson.vehicle);

                    if (vehicle.status !== VEHICLE_STATUSES.IN_LESSON.tag) { // just in case status is already in_lesson
                        vehicle.status = VEHICLE_STATUSES.IN_LESSON.tag;
                        await vehicle.save();
                    }
                });
            }

            if (!isEmpty(lessonsForEnd)) {
                lessonsForEnd.forEach( async lesson => {
                    const vehicle = await Vehicle.findById(lesson.vehicle);

                    if (vehicle.status !== VEHICLE_STATUSES.IDLE.tag) { // just in case status is already idle
                        vehicle.status = VEHICLE_STATUSES.IDLE.tag;
                        await vehicle.save();
                    }
                });
            }
        } catch (error) {
            console.log("Error in change_car_status_at_lesson_start_and_end cron job", error);
        }
    }, {
        scheduled: false
    });

    cronJob.runAtStartup = true;
    cronJob.name = "change_car_status_at_lesson_start_and_end";

    return cronJob;
}

module.exports = change_car_status_at_lesson_start_and_end;