const ExamType = require('../database/models/ExamType');
const { ErrorHandler } = require('../utils/errorHandler');

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