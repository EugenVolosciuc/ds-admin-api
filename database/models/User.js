const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcryptjs');

const { USER_ROLES } = require('../../constants');
const School = require('./School');
const Location = require('./Location');
const { ErrorHandler } = require('../../utils/errorHandler');

const validUserRoles = Object.keys(USER_ROLES);

const userSchema = mongoose.Schema({
    firstName: {
        type: String,
        required: [true, 'Please provide a first name']
    },
    lastName: {
        type: String,
        required: [true, 'Please provide a last name']
    },
    email: {
        type: String,
        validate: [isEmail, 'Please provide a valid email']
    },
    phoneNumber: {
        type: String,
        unique: true,
        required: [true, 'Please provide a phone number']
    },
    password: {
        type: String,
        required: [true, 'Please provide a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    role: {
        type: String,
        required: [true, 'Please provide a user role'],
        enum: {
            values: validUserRoles,
            message: `Valid user roles are ${validUserRoles.join(', ')}`
        }
    },
    // TODO: comments under
    school: { // For SCHOOL_ADMIN, LOCATION_ADMIN, INSTRUCTOR, STUDENT
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School'
    },
    location: { // For LOCATION_ADMIN, INSTRUCTOR, STUDENT
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location'
    },
    vehicle: { // For INSTRUCTOR, STUDENT
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Vehicle'
    },
    instructor: { // For STUDENT
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
    // For students - number of program lessons already taken (e.g. 3/15),
}, { 
    timestamps: true
});

// Remove password from the returned user object
userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
}

// Login method
userSchema.statics.login = async function(phoneNumber, password) {
    const user = await this.findOne({ phoneNumber }).populate(['school', 'location']);

    if (user) {
        const auth = await bcrypt.compare(password, user.password);

        if (auth) return user
    } 

    throw new ErrorHandler(401, 'Incorrect phone number or password');
}


userSchema.pre('save', async function (next) {
    // Hash password before saving user to DB
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    // Update school admin field in school
    if (this.isModified('school') && this.role === USER_ROLES.SCHOOL_ADMIN.tag) {
        try {
            const school = await School.findById(this.school);

            school.admin = this._id;

            await school.save();
        } catch (error) {
            next(error);
        }
    }

    // Update location admin field in location
    if (this.isModified('location') && this.role === USER_ROLES.LOCATION_ADMIN.tag) {
        try {
            const location = await Location.findById(this.location);

            location.admin = this._id;

            await location.save();
        } catch (error) {
            next(error);
        }
    }

    next();
});

const User = mongoose.model('User', userSchema);

module.exports = User;