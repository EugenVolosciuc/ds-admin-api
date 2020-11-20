const cron = require('node-cron');

const LessonRequest = require('../../database/models/LessonRequest');

const delete_old_lesson_requests = async () => {
    const cronJob = cron.schedule('0 7 * * 1', async () => { // At 07:00 on Monday
        try {
            await LessonRequest.deleteMany({
                start: { $lte: new Date() }
            });
        } catch (error) {
            console.log("Error in delete_old_lesson_requests cron job", error);
        }
    }, {
        scheduled: false
    });

    cronJob.runAtStartup = true;
    cronJob.name = "delete_old_lesson_requests";

    return cronJob;
}

module.exports = delete_old_lesson_requests;