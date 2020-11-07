const School = require('../database/models/School');
const { ErrorHandler } = require('../utils/errorHandler');
const checkForUpdatableProperties = require('../utils/updatablePropertyChecker');

// @desc    Get schools
// @route   GET /schools
// @access  Private
module.exports.getSchools = async (req, res, next) => {
    try {
        if (!res.paginatedResults.schools) throw new ErrorHandler(404, 'No schools found');

        res.send(res.paginatedResults);
    } catch (error) {
        next(error);
    }
}

// @desc    Get school
// @route   GET /schools/:id
// @access  Private
module.exports.getSchool = async (req, res, next) => {
    try {
        const school = await School.findById(req.params.id).populate(['locations', 'admin']);

        if (!school) throw new ErrorHandler(404, 'No school found');

        res.json(school);
    } catch (error) {
        next(error);
    }
}

// @desc    Create school
// @route   POST /schools
// @access  Private
module.exports.createSchool = async (req, res, next) => {
    const { name, country } = req.body;

    try {
        const school = await School.create({ name, country });

        res.status(201).json(school);
    } catch (error) {
        next(error);
    }
}

// @desc    update school
// @route   PATCH /schools/:id
// @access  Private
module.exports.updateSchool = async (req, res, next) => {
    const possibleUpdates = Object.keys(School.schema.obj);

    const dataToUpdate = req.body;
    const schoolID = req.params.id;

    try {
        const school = await School.findById(schoolID);

        if (!school) throw new ErrorHandler(404, 'No school found');

        checkForUpdatableProperties(school, dataToUpdate, possibleUpdates);

        await school.save();

        res.send(school);
    } catch (error) {
        next(error);
    }
}

// @desc    Delete school
// @route   DELETE /schools/:id
// @access  Private
module.exports.deleteSchool = async (req, res, next) => {
    try {
        // TODO: restrict who can delete school
        const school = await School.findByIdAndDelete(req.params.id);

        if (!school) throw new ErrorHandler(404, 'No school found');

        res.json(school);
    } catch (error) {
        next(error);
    }
}