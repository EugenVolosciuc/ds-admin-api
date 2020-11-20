// const cron = require('node-cron');
const schedule = require('node-schedule');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');

const Vehicle = require('../../database/models/Vehicle');
const CronJob = require('../../database/models/CronJob');

dayjs.extend(utc);

const change_vehicle_status = (timeOfExecution, utcOffset, parameters, _id) => {

    // TODO: For it to work properly, we should add ".add(utcOffset, 'minutes')" to the day below. 
    // Because our machines have a +2h timezone and I can't change the process' timezone, for the moment I won't add it, 
    // but when we'll use Docker for the API, the server will have UTC 0 timezone, and I'll add the offset back here
    const timeToStartCronJob = dayjs(timeOfExecution).toDate();
    // const timeToStartCronJob = dayjs(timeOfExecution).toDate(); // Add .add(utcOffset, 'minutes') before .toDate()

    // console.log("timeToStartCronJob as is!!!!!", timeToStartCronJob)
    // console.log("timeToStartCronJob as is, but true!!!!!", dayjs(timeOfExecution).utcOffset(Number(utcOffset), true))
    // console.log("timeToStartCronJob as DATE!!!!!", timeToStartCronJob.toDate())
    // console.log("timeToStartCronJob as DATE STRING!!!!!", timeToStartCronJob.toString())
    try {
        schedule.scheduleJob(timeToStartCronJob, async () => {
            console.log("FETCHING VEHICLE TO UPDATE")
            await Vehicle.findByIdAndUpdate(parameters.get('vehicle'), { status: parameters.get('status') });

            console.log("DELETING CRON!")
            await CronJob.findByIdAndDelete(_id);
        });
    } catch (error) {
        console.log("ERROR CHANGING VEHICLE STATUS", error); // TODO: store error in log file with winston package
    }
}

module.exports = change_vehicle_status;