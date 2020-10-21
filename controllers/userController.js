const jwt = require('jsonwebtoken');

const User = require('../database/models/User');
const { ErrorHandler } = require('../utils/errorHandler');

const maxAge = 3 * 24 * 60 * 60; // days, hours, minutes, seconds

const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.getUsers = async (req, res) => {
    try {
        if (!res.paginatedResults.users) {
            throw new ErrorHandler(404, 'No users found');
        }

        res.send(res.paginatedResults);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}

// @desc    Get logged in user
// @route   GET /users/me
// @access  Private
module.exports.getMe = async (req, res) => {
    try {
        res.send(req.user);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}

// @desc    Create user
// @route   POST /users
// @access  Public
module.exports.createUser = async (req, res) => {
    const { firstName, lastName, email, phoneNumber, password, role } = req.body;

    try {
        const userExists = await User.findOne({ phoneNumber });

        if (userExists) {
            throw new ErrorHandler(400, 'A user with this phone number already exists');
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
            role
        });
        
        res.status(201).json(user);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
};

// @desc    Login user
// @route   POST /users/login
// @access  Public
module.exports.loginUser = async (req, res) => {
    const { phoneNumber, password } = req.body;
    try {
        const user = await User.login(phoneNumber, password);
        const token = createToken(user._id);

        res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(200).json(user);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}

// @desc    Logout user
// @route   POST /users/logout
// @access  Private
module.exports.logoutUser = (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 1 });
        res.send({ message: 'Logged out' });
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}

// @desc    Update user
// @route   PATCH /users/:id
// @access  Private
module.exports.updateUser = async (req, res) => {
    const possibleUpdates = Object.keys(User.schema.obj);

    const dataToUpdate = req.body;
    const user = req.user;

    try {
        for (const property in dataToUpdate) {
            if (possibleUpdates.includes(property)) {
                user[property] = dataToUpdate[property];
            } else {
                throw new ErrorHandler(400, `Property not accepted: ${property}`);
            }
        }

        await user.save();

        res.send(user);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Private
module.exports.deleteUser = async (req, res) => {
    try {
        // TODO: restrict who can delete users
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            throw new ErrorHandler(404, 'No user found');
        }

        res.json(user);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}