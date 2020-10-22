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
    start: {
        type: Date,
        required: [true, 'Lesson time is required']
    }
}, {
    timestamps: true
})

const Lesson = mongoose.model('Lesson', lessonSchema)

module.exports = Lesson