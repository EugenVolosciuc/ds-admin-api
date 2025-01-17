const mongoose = require('mongoose');

const schoolSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'School name is required']
    },
    country: {
        type: String,
        required: [true, 'Country is required']
    },
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    locations: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    }],
    lessonDuration: {
        type: Number,
        default: 90
    },
    // Number of lessons it takes to finish school (a student can't request more program lessons if the limit is reached)
    // TODO: when pricing options will be defined (probably as a collection itself), I'll have to add the option in here so that I know how many locations a school can have
}, {
    timestamps: true
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;