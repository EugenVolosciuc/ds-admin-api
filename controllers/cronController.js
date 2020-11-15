const path = require('path');

const { getCronJobs, getCronJob } = require('../utils/getCronJobsFromFS');
const { ErrorHandler } = require('../utils/errorHandler');

// @desc    Get cron jobs
// @route   GET /cron
// @access  Private
module.exports.getCronJobs = async (req, res, next) => {
    try {
        const cronJobs = await getCronJobs();

        const cronJobsData = cronJobs.map(cronJob => {
            return {
                name: cronJob.name,
                status: cronJob.getStatus() || 'not scheduled'
            }
        })

        res.json(cronJobsData);
    } catch (error) {
        next(error);
    }
}

// @desc    Run action on cron job
// @route   POST /cron
// @access  Private
module.exports.runCronJobAction = async (req, res, next) => {
    const { name, action } = req.body;
    // name, action
    try {
        if (!name || !action) throw new ErrorHandler(400, 'Provide a cron job name and action');
        
        const cronJob = await getCronJob(name);

        console.log("CRON JOB", cronJob);
        console.log("STATUS BEFORE", cronJob.getStatus());
        cronJob[action]();

        console.log("STATUS AFTER", cronJob.getStatus());

        res.json();
    } catch (error) {
        next(error);
    }
}