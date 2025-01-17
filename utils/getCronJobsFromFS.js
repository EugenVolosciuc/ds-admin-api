const path = require('path');
const { promises: fs } = require('fs');

const { ErrorHandler } = require('./errorHandler');


module.exports.getCronJobs = async type => {
    const pathToTasks = path.join(__dirname, '..', 'cron', type);

    const cronJobFilenames = await fs.readdir(pathToTasks);

    const cronJobs = await Promise.all(cronJobFilenames.map(async file => {
        try {
            let cronJob = require(path.join(pathToTasks, file));

            if (cronJob.constructor.name === 'AsyncFunction') {
                cronJob = await cronJob();
            }

            return { [cronJob.name]: cronJob }
        } catch (error) {
            throw new ErrorHandler(500, 'Error getting cron jobs: ' + error.message);
        }
    }));

    return cronJobs;
}