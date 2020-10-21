const School = require('../database/models/School');
const errorHandler = require('../utils/errorHandler');

// @desc    Get schools
// @route   GET /schools
// @access  Private
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

// @desc    Create school
// @route   POST /schools
// @access  Private
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

// @desc    update school
// @route   PATCH /schools/:id
// @access  Private
module.exports.updateSchool = async (req, res) => {
    const possibleUpdates = Object.keys(School.schema.obj);

    const dataToUpdate = req.body;
    const schoolID = req.params.id;

    try {
        const school = await School.findById(schoolID);

        if (!school) {
            return res.status(404).json({ message: 'No school found' });
        }

        for (const property in dataToUpdate) {
            if (possibleUpdates.includes(property)) {
                school[property] = dataToUpdate[property];
            } else {
                return res.status(400).json({ message: `Property not accepted: ${property}` });
            }
        }

        await school.save();

        res.send(school);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
    }
}

// @desc    Delete school
// @route   DELETE /schools/:id
// @access  Private
module.exports.deleteSchool = async (req, res) => {
    try {
        // TODO: restrict who can delete school
        const school = await School.findByIdAndDelete(req.params.id);

        if (!school) {
            return res.status(404).send({ error: 'No school found' });
        }

        res.json(school);
    } catch (err) {
        const { status, error } = errorHandler(err);
        res.status(status).json(error);
    }
}