const jwt = require('jsonwebtoken');
const User = require('../database/models/User');

module.exports.addLoggedUser = async (req, res, next) => {
    const token = req.cookies.token;

    try {
        if (token) {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            const user = await User.findOne({ _id: decoded.id });

            if (user) {
                req.token = token;
                req.user = user;
            }
        }
    
        next();
    } catch (error) {
        next(error);
    }
}