const path = require('path');
const { promises: fs } = require('fs');

const { ErrorHandler } = require('./errorHandler');

const pathToTasks = path.join(__dirname, '..', 'cronTasks');

// TODO: figure out if I can use one single DB connection for all cron jobs
module.exports.getCronJobs = async () => {
    const cronJobFilenames = await fs.readdir(pathToTasks);

    const cronJobs = await Promise.all(cronJobFilenames.map(async file => {
        try {
            const cronJob = require(path.join(pathToTasks, file));

            if (cronJob.constructor.name === 'AsyncFunction') {
                const actualCronJob = await cronJob();

                return actualCronJob;
            }

            return cronJob;
        } catch (error) {
            throw new ErrorHandler(500, 'Error getting cron jobs: ' + error.message);
        }
    }));

    return cronJobs;
}

module.exports.getCronJob = async name => {
    try {
        let cronJob = require(path.join(pathToTasks, name));

        if (cronJob.constructor.name === 'AsyncFunction') cronJob = await cronJob();

        return cronJob;
    } catch (error) {
        throw new ErrorHandler(500, 'Error getting cron job: ' + error.message);
    }
}