const jwt = require('jsonwebtoken');

const User = require('../database/models/User');
const { USER_ROLES } = require('../constants');

// Roles: Array of role tags that are permitted to continue with the request, undefined/null if any authentication is required
module.exports.requireAuth = roles => {
    return async (req, res, next) => {
        const token = req.cookies.token;

        console.log("DO I EVEN GET HERE?")

        try {
            if (token) {
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                const user = await User.findOne({ _id: decoded.id });

                if (!user) throw new Error('Please authenticate');

                if (roles) {
                    console.log("GETS TO ROLES? :|")
                    if (!roles.includes(USER_ROLES[user.role].tag)) {
                        return res.status(401).json({ message: 'Unauthorized' });
                    }
                }

                req.token = token;
                req.user = user;

                console.log("NEAR NEXT")
                next();
            } else {
                throw new Error('Please authenticate');
            }
        } catch (error) {
            return res.status(401).json({ message: error.message });
        }
    }
}