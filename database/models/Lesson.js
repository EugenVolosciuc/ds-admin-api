const mongoose = require('mongoose');

const lessonSchema = mongoose.Schema({
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Instructor is required']
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Student is required']
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
        required: [true, 'Vehicle is required']
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: [true, 'Location is required']
    },
    start: {
        type: Date,
        required: [true, 'Lesson start time is required']
    },
    end: {
        type: Date,
        required: [true, 'Lesson end time is required']
    }
});

const Lesson = mongoose.model('Lesson', lessonSchema);

module.exports = Lesson;