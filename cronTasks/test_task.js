const cron = require('node-cron');

const test_task = cron.schedule('* * * * * *', () => {
    console.log("RUNNING THIS EVERY SECOND" + (Math.random() * 10));
}, {
    scheduled: false
});

test_task.name = 'test_task';

module.exports = test_task;