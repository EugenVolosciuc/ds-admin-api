const mongoose = require('mongoose');

const School = require('./School');

const locationSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required'],
        set: function (school) {
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
    admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // TODO: add working hours
}, {
    timestamps: true
});

locationSchema.pre('save', async function (next) {
    // Update locations field in school
    if (this.isModified('school')) {
        try {
            const school = await School.findById(this.school);

            let filteredLocations = school.locations;
            if (school.locations.includes(this._previousSchool)) filteredLocations = filteredLocations.filter(location => location !== this._previousSchool);

            const schoolObject = school.toObject();
            delete schoolObject.__v; // to resolve version conflict when seeding locations

            const versionlessSchool = School.hydrate(schoolObject);
            versionlessSchool.locations = [...filteredLocations, this._id];

            await versionlessSchool.save();
        } catch (error) {
            next(error);
        }
    }

    next();
});

locationSchema.post('remove', async function (next) {
    try {
        await School.updateOne({ _id: this.school }, { $pull: { locations: this._id } });

        next();
    } catch (error) {
        next(error);
    }
});

const Location = mongoose.model('Location', locationSchema);

module.exports = Location;