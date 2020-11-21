const ExamType = require('../database/models/ExamType');
const { ErrorHandler } = require('../utils/errorHandler');
const checkAndUpdateProperties = require('../utils/updatablePropertyChecker');

// @desc    Get exam types
// @route   GET /exam-types
// @access  Private
module.exports.getExamTypes = async (req, res, next) => {
    const filters = req.query.filters ? JSON.parse(req.query.filters) : {};
    const { school } = filters;

    if (!school) throw new ErrorHandler(400, 'Provide a school id');

    try {
        const examTypes = await ExamType.find({ school });

        res.json(examTypes);
    } catch (error) {
        next(error);
    }
}

// @desc    Create exam type
// @route   POST /exam-types
// @access  Private
module.exports.createExamType = async (req, res, next) => {
    try {
        const examType = await ExamType.create(req.body);

        res.json(examType);
    } catch (error) {
        next(error);
    }
}

// @desc    Modify exam type
// @route   PATCH /exam-types/:id
// @access  Private
module.exports.modifyExamType = async (req, res, next) => {
    const possibleUpdates = Object.keys(ExamType.schema.obj);

    const dataToUpdate = req.body;
    const examTypeID = req.params.id;

    try {
        const examType = await ExamType.findById(examTypeID);

        if (!examType) throw new ErrorHandler(404, 'No exam type found');

        checkAndUpdateProperties(examType, dataToUpdate, possibleUpdates);

        await examType.save();

        res.json(examType);
    } catch (error) {
        next(error);
    }
}

// @desc    Modify exam type
// @route   PATCH /exam-types/:id
// @access  Private
module.exports.deleteExamType = async (req, res, next) => {
    try {
        const examType = await ExamType.findByIdAndDelete(req.params.id);

        if (!examType) throw new ErrorHandler(404, 'No exam type found');

        res.json(examType);
    } catch (error) {
        next(error);
    }
}