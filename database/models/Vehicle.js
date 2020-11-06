const mongoose = require('mongoose');

const { VEHICLE_STATUSES, VEHICLE_CATEGORIES, TRANSMISSION_TYPES } = require('../../constants');

const validVehicleStatuses = Object.keys(VEHICLE_STATUSES);
const validVehicleCategories = Object.keys(VEHICLE_CATEGORIES);
const validTransmissionTypes = Object.keys(TRANSMISSION_TYPES);

const vehicleSchema = mongoose.Schema({
    brand: {
        type: String,
        required: [true, 'Vehicle brand is required']
    },
    model: {
        type: String,
        required: [true, 'Vehicle model is required']
    },
    modelYear: {
        type: Date,
        required: [true, 'Model year is required']
    },
    licensePlate: {
        type: String,
        required: [true, 'Vehicle license plate is required']
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
        required: [true, 'School is required']
    },
    schoolLocation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SchoolLocation',
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    category: {
        type: String,
        required: [true, 'Vehicle category is required'],
        enum: {
            values: validVehicleCategories,
            message: `Valid vehicle categories are ${validVehicleCategories.join(', ')}`
        }
    },
    status: {
        type: String,
        default: VEHICLE_STATUSES.IDLE.tag,
        enum: {
            values: validVehicleStatuses,
            message: `Valid vehicle statuses are ${validVehicleStatuses.join(', ')}`
        }
    },
    transmission: {
        type: String,
        required: [hasTransmission, 'Transmission is required'],
        enum: {
            values: validTransmissionTypes,
            message: `Valid transmission types are ${validTransmissionTypes.join(', ')}`
        }
    }
}, {
    timestamps: true
});

function hasTransmission() {
    return this.category !== VEHICLE_CATEGORIES.A.tag && this.category !== VEHICLE_CATEGORIES.E.tag;
}

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;