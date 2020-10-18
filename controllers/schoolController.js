const School = require('../database/models/School');
const errorHandler = require('../utils/errorHandler');

module.exports.getSchools = async (req, res) => {
    try {
        if (!res.paginatedResults.schools) {
            return res.status(404).json({ message: 'No schools found' });
        }
    
        res.send(res.paginatedResults);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
    }
}

module.exports.createSchool = async (req, res) => {
    const { name, country } = req.body;

    try {
        const school = await School.create({ name, country });

        res.status(201).json(school);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
    }
}
