const jwt = require('jsonwebtoken');

const User = require('../database/models/User');

module.exports.requireAuth = async (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.id });

            if (!user) throw new Error('Please authenticate');

            req.token = token;
            req.user = user;

            next();
        } else {
            throw new Error('Please authenticate');
        }
    } catch (error) {
        return res.status(401).json({ message: error.message });
    }
}