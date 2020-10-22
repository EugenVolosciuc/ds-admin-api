const mongoose = require('mongoose');

const schoolLocationSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    city: {
        type: String,
        required: [true, 'City is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    // TODO: add working hours
}, {
    timestamps: true
});

const SchoolLocation = mongoose.model('SchoolLocation', schoolLocationSchema);

module.exports = SchoolLocation;