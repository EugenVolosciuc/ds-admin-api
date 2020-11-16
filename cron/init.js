const { getCronJobs } = require('../utils/getCronJobsFromFS');

const initCronJobs = async () => {
    try {
        const cronJobs = await getCronJobs();

        cronJobs.forEach(cronJobData => {
            const cronJob = Object.values(cronJobData)[0];

            if (cronJob.runAtStartup) cronJob.start();
        })

        console.log("Initiated cron jobs");
        module.exports.cronJobs = cronJobs;
    } catch (error) {
        console.log("ERROR instantiating cron jobs", error);
    }
}

module.exports = initCronJobs;