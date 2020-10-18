const jwt = require('jsonwebtoken');

const User = require('../database/models/User');
const errorHandler = require('../utils/errorHandler');

const maxAge = 3 * 24 * 60 * 60; // days, hours, minutes, seconds

const createToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: maxAge
    });
}

module.exports.getUsers = async (req, res) => {
    try {
        if (!res.paginatedResults.users) {
            return res.status(404).json({ message: 'No users found' });
        }

        res.send(res.paginatedResults);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
    }
}

// @desc    Get logged in user
// @route   GET /users/me
// @access  Private
module.exports.getMe = async (req, res) => {
    try {
        res.send(req.user);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
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
            return res.status(400).send({ message: 'A user with this phone number already exists' });
        }

        const user = await User.create({
            firstName,
            lastName,
            email,
            phoneNumber,
            password,
            role
        });
        const token = createToken(user._id);

        res.cookie('token', token, { httpOnly: true, maxAge: maxAge * 1000 });
        res.status(201).json(user);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
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
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
    }
}

// @desc    Logout user
// @route   POST /users/logout
// @access  Private
module.exports.logoutUser = (req, res) => {
    try {
        res.cookie('token', '', { maxAge: 1 });
        res.send({ message: 'Logged out' });
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
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
                return res.status(400).json({ message: `Property not accepted: ${property}` });
            }
        }

        await user.save();

        res.send(user);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
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
            return res.status(404).send({ error: 'No user found' });
        }

        res.json(user);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
    }
}