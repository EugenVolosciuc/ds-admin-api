const { getCronJobs } = require('../utils/getCronJobsFromFS');
const isEmpty = require('lodash/isEmpty');

const CronJob = require('../database/models/CronJob');

const initCronJobs = async () => {
    try {
        const recurringCronJobHandlers = await getCronJobs('recurringTasks');
        const oneTimeCronJobHandlers = await getCronJobs('oneTimeTasks');

        // Modifies oneTimeCronJobHandlers from [{ cronName: func }, { cronName: func }] to { cronName: func, cronName: func }
        const modifiedOneTimeCronJobHandlers = oneTimeCronJobHandlers.reduce((acc, current) => {
            acc[Object.keys(current)[0]] = Object.values(current)[0];
            return acc;
        }, {});

        // Run the recurring cron jobs at server start
        recurringCronJobHandlers.forEach(cronJobData => {
            const cronJob = Object.values(cronJobData)[0];

            if (cronJob.runAtStartup) cronJob.start();
        });

        const oneTimeCronJobsData = await CronJob.find();

        // Run the one time cron jobs at server start
        if (!isEmpty(oneTimeCronJobsData)) {
            oneTimeCronJobsData.forEach(({ taskName, timeOfExecution, utcOffset, parameters, _id }) => {
                // Run one-time cron job
                console.log("CRON DATA", taskName, timeOfExecution, utcOffset, parameters, _id)
                modifiedOneTimeCronJobHandlers[taskName](timeOfExecution, utcOffset, parameters, _id);
            });
        }

        console.log("Initialized cron jobs");
        module.exports.recurringCronJobs = recurringCronJobHandlers;
    } catch (error) {
        console.log("ERROR instantiating cron jobs", error);
    }
}

module.exports = initCronJobs;