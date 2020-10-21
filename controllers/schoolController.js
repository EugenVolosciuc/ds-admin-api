const School = require('../database/models/School');
const { ErrorHandler } = require('../utils/errorHandler');

// @desc    Get schools
// @route   GET /schools
// @access  Private
module.exports.getSchools = async (req, res) => {
    try {
        if (!res.paginatedResults.schools) {
            throw new ErrorHandler(404, 'No schools found');
        }

        res.send(res.paginatedResults);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
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
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
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
            throw new ErrorHandler(404, 'No school found');
        }

        for (const property in dataToUpdate) {
            if (possibleUpdates.includes(property)) {
                school[property] = dataToUpdate[property];
            } else {
                throw new ErrorHandler(400, `Property not accepted: ${property}`);
            }
        }

        await school.save();

        res.send(school);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
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
            throw new ErrorHandler(404, 'No school found');
        }

        res.json(school);
    } catch (error) {
        throw new ErrorHandler(500, error.message, error);
    }
}