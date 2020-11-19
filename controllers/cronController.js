const path = require('path');

const { ErrorHandler } = require('../utils/errorHandler');

// @desc    Get recurring cron jobs
// @route   GET /cron
// @access  Private
module.exports.getCronJobs = async (req, res, next) => {
    try {
        const { recurringCronJobs } = require('../cron/init');

        const cronJobsData = recurringCronJobs.map(cronJob => {
            return {
                name: Object.keys(cronJob)[0],
                status: Object.values(cronJob)[0].getStatus() || 'not scheduled'
            }
        })

        res.json(cronJobsData);
    } catch (error) {
        next(error);
    }
}

// @desc    Run action on recurring cron job
// @route   POST /cron
// @access  Private
module.exports.runCronJobAction = async (req, res, next) => {
    const { name, action } = req.body;
    try {
        if (!name || !action) throw new ErrorHandler(400, 'Provide a cron job name and action');
        
        const { recurringCronJobs } = require('../cron/init');
        const cronJob = recurringCronJobs.find(cronJob => Object.keys(cronJob)[0] === name);

        cronJob[name][action]();

        res.json();
    } catch (error) {
        next(error);
    }
}