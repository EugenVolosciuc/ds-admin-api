const mongoose = require('mongoose');

const examSchema = mongoose.Schema({
    examType: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ExamType',
        required: [true, 'Exam type is required']
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
        required: [true, 'Location is required']
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    vehicle: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle',
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    // timeIsSpecific: {
    //     type: Boolean,
    //     required: [true, 'It is required to mention if this exam\'s time is exact']
    // },
    start: {
        type: Date,
        required: [true, 'Exam start time is required']
    },
    end: {
        type: Date,
        required: [true, 'Exam end time is required']
    }
});

const Exam = mongoose.model('Exam', examSchema);

module.exports = Exam;