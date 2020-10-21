const jwt = require('jsonwebtoken');

const User = require('../database/models/User');
const { USER_ROLES } = require('../constants');
const { ErrorHandler } = require('../utils/errorHandler');

// Roles: Array of role tags that are permitted to continue with the request, undefined/null if any authentication is required
module.exports.requireAuth = roles => {
    return async (req, res, next) => {
        const token = req.cookies.token;

        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({ _id: decoded.id });

                if (!user) throw new ErrorHandler(401, 'Please authenticate');

                if (roles) {
                    if (!roles.includes(USER_ROLES[user.role].tag)) {
                        throw new ErrorHandler(401, 'Please authenticate');
                    }
                }

                req.token = token;
                req.user = user;

                next();
            } else {
                throw new ErrorHandler(401, 'Please authenticate');
            }
        } catch (error) {
            next(error);
        }
    }
}