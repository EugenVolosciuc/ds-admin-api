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
        ref: 'SchoolLocation'
    }]
}, {
    timestamps: true
});

const School = mongoose.model('School', schoolSchema);

module.exports = School;