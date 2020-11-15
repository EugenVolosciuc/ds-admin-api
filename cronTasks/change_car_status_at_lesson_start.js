const cron = require('node-cron');
const dayjs = require('dayjs');
const isEmpty = require('lodash/isEmpty');

const Lesson = require('../database/models/Lesson');
const Vehicle = require('../database/models/Vehicle');
const connectToDB = require('../database/connect');
const { VEHICLE_STATUSES } = require('../constants');

const periodInMinutes = 1;

const change_car_status_at_lesson_start = async () => {
    await connectToDB();
    
    // TODO: I believe a new cron job is instantiated every time I hit stop in the dashboard. I should probably only instantiate it once
    const cronJob = cron.schedule(`*/${periodInMinutes} * * * *`, async () => {
        try {
            // Get all lessons that start in the next two minutes
            const lessons = await Lesson.find({
                start: {
                    $gte: dayjs().toDate(),
                    $lte: dayjs().add(periodInMinutes, 'minutes')
                }
            });
            
            if (!isEmpty(lessons)) {
                lessons.forEach( async lesson => {
                    const vehicle = await Vehicle.findById(lesson.vehicle);

                    if (vehicle.status !== VEHICLE_STATUSES.IN_LESSON.tag) { // just in case it's already in_lesson

                        console.log("VEHICLE", vehicle);
                        vehicle.status = VEHICLE_STATUSES.IN_LESSON.tag
                        await vehicle.save();
                    }
                });
            }
        } catch (error) {
            console.log("Error in change_car_status_at_lesson_start cron job", error);
        }
    });

    cronJob.name = "change_car_status_at_lesson_start";

    return cronJob;
}

module.exports = change_car_status_at_lesson_start;