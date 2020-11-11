const mongoose = require('mongoose');

const lessonRequestSchema = mongoose.Schema({
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
    },
    rejectionReason: { type: String }
}, {
    timestamps: true
});

const LessonRequest = mongoose.model('LessonRequest', lessonRequestSchema);

module.exports = LessonRequest;