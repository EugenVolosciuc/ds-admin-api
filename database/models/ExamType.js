const mongoose = require('mongoose');

const { EXAMINATION_TYPES, EXAM_LOCATIONS } = require('../../constants');

const validExaminationTypes = Object.keys(EXAMINATION_TYPES);
const validExamLocations = Object.keys(EXAM_LOCATIONS);

const examTypeSchema = mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Exam type name is required']
    },
    examination: {
        type: String,
        required: [true, 'Examination type is required'],
        enum: {
            values: validExaminationTypes,
            message: `Valid examination types are ${validExaminationTypes.join(', ')}`
        }
    },
    examLocation: {
        type: String,
        required: [true, 'Exam location is required'],
        enum: {
            values: validExamLocations,
            message: `Valid exam locations are ${validExamLocations.join(', ')}`
        }
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    specificTime: {
        type: Boolean,
        default: true
    },
    isFinalExam: {
        type: Boolean,
        default: false
    }
});

const ExamType = mongoose.model('ExamType', examTypeSchema);

module.exports = ExamType;