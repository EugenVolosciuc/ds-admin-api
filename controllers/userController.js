const jwt = require('jsonwebtoken');

const User = require('../database/models/User');
const { ErrorHandler } = require('../utils/errorHandler');

const maxAge = 3 * 24 * 60 * 60; // days, hours, minutes, seconds

const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

// @desc    Get users
// @route   GET /users
// @access  Private
module.exports.getUsers = async (req, res, next) => {
    try {
        if (!res.paginatedResults.users) {
            throw new ErrorHandler(404, 'No users found');
        }

        res.send(res.paginatedResults);
    } catch (error) {
        next(error);
    }
}

// @desc    Get logged in user
// @route   GET /users/me
// @access  Private
module.exports.getMe = async (req, res, next) => {
    try {
        res.send(req.user);
    } catch (error) {
        next(error);
    }
}

// @desc    Create user
// @route   POST /users
// @access  Public
module.exports.createUser = async (req, res, next) => {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;

    try {
        const userExists = await User.findOne({ phoneNumber });

        if (userExists) {
            throw new ErrorHandler(400, [{ field: 'phoneNumber', message: 'A user with this phone number already exists' }]);
        }

        let schoolID;
        let locationID;
        if (req.user) {
            const loggedInUser = req.user;

            // Add school to new user if created by a school admin or a location admin
            schoolID = loggedInUser.school;

            // Add location to new user if created by a location admin
            locationID = loggedInUser.location; 
        }

        // TODO: Create a parameter for this request (ex. withPassword) 
        // to decide if the password is sent by the user (user registers by himself) or from the admin panel (password generated on the backend, sent to email and phone number)
        // In the meantime it will always be 'password' if no pass is provided
        const user = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password: password || 'password',
            role,
            ...(schoolID && { school: schoolID }),
            ...(locationID && { location: locationID })
        });
        
        res.status(201).json(user);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /users/login
// @access  Public
module.exports.loginUser = async (req, res, next) => {
    const { phoneNumber, password } = req.body;
    
    try {
        const user = await User.login(phoneNumber, password);

        const token = createToken(user._id);

        res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json(user);
    } catch (error) {
        next(error);
    }
}

// @desc    Logout user
// @route   POST /users/logout
// @access  Private
module.exports.logoutUser = (req, res, next) => {
    try {
        res.cookie('token', '', { maxAge: 1 });
        res.send({ message: 'Logged out' });
    } catch (error) {
        next(error);
    }
}

// @desc    Update user
// @route   PATCH /users/:id
// @access  Private
module.exports.updateUser = async (req, res, next) => {
    const possibleUpdates = Object.keys(User.schema.obj);

    const dataToUpdate = req.body;
    const user = req.user;

    try {
        for (const property in dataToUpdate) {
            if (possibleUpdates.includes(property)) {
                user[property] = dataToUpdate[property];
            } else {
                throw new ErrorHandler(400, [{ field: property, message: `Property not accepted: ${property}` }]);
            }
        }

        await user.save();

        res.send(user);
    } catch (error) {
        next(error);
    }
}

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Private
module.exports.deleteUser = async (req, res, next) => {
    try {
        // TODO: restrict who can delete users
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            throw new ErrorHandler(404, 'No user found');
        }

        res.json(user);
    } catch (error) {
        next(error);
    }
}