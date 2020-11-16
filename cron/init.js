const { getCronJobs } = require('../utils/getCronJobsFromFS');

const initCronJobs = async () => {
    try {
        module.exports.cronJobs = await getCronJobs();

        console.log("Initiated cron jobs");
    } catch (error) {
        console.log("ERROR instantiating cron jobs", error);
    }
}

module.exports = initCronJobs;