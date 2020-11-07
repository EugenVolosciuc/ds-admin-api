const mongoose = require('mongoose');

const School = require('./School');

const schoolLocationSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required'],
        set: function(school) {
            this._previousSchool = this.school;
            return school
        }
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

schoolLocationSchema.pre('save', async function (next) {
    // Update locations field in school
    if (this.isModified('school')) {
        try {
            const school = await School.findById(this.school);

            let filteredLocations = school.locations
            if (school.locations.includes(this._previousSchool)) filteredLocations = filteredLocations.filter(location => location !== this._previousSchool)

            school.locations = [...filteredLocations, this._id];

            await school.save();
        } catch (error) {
            next(error);
        }
    }

    next();
});

const SchoolLocation = mongoose.model('SchoolLocation', schoolLocationSchema);

module.exports = SchoolLocation;