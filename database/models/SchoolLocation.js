const mongoose = require('mongoose');

const schoolLocationSchema = mongoose.Schema({
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    address: {
        type: String,
        required: [true, 'Address is required']
    },
    // TODO: add working hours
});

const SchoolLocation = mongoose.model('SchoolLocation', schoolLocationSchema);

module.exports = SchoolLocation;