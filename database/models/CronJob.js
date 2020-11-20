const mongoose = require('mongoose');
const path = require('path');
const dayjs = require('dayjs');

const { ErrorHandler } = require('../../utils/errorHandler');

const pathToTasks = path.join(__dirname, '..', '..', 'cron', 'oneTimeTasks');

const cronJobSchema = mongoose.Schema({
    taskName: {
        type: String,
        required: true
    },
    timeOfExecution: {
        type: Date,
        required: true
    },
    utcOffset: {
        type: Number,
        required: true
    },
    parameters: {
        type: Map
    }
});

cronJobSchema.pre('save', async function (next) {
    // Schedule cron job
    const cronJob = require(path.join(pathToTasks, this.taskName));
    const id = new mongoose.Types.ObjectId();

    this._id = id;

    // For some fucking reason, the date stored in the DB has the additional offset time, so we make up for this by subtracting the utcOffset from the time of execution
    this.timeOfExecution = dayjs(this.timeOfExecution).subtract(this.utcOffset, 'minutes'); 
    // console.log("CREATING JOB IN SERVER, TIME OF EXECUTION SAVED IN DB -> ", this.timeOfExecution);

    if (cronJob.constructor.name === 'AsyncFunction') {
        await cronJob(this.timeOfExecution, this.utcOffset, this.parameters, this._id);
    } else {
        cronJob(this.timeOfExecution, this.utcOffset, this.parameters, this._id);
    }

    next();
});

const CronJob = mongoose.model('CronJob', cronJobSchema);

module.exports = CronJob;