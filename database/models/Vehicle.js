const mongoose = require('mongoose');

const { VEHICLE_STATUSES, VEHICLE_CATEGORIES } = require('../../constants');

const validVehicleStatuses = Object.keys(VEHICLE_STATUSES);
const validVehicleCategories = Object.keys(VEHICLE_CATEGORIES);

const vehicleSchema = mongoose.Schema({
    model: {
        type: String,
        required: [true, 'Vehicle model is required']
    },
    licensePlate: {
        type: String,
        required: [true, 'Vehicle license plate is required']
    },
    instructor: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    school: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'School',
    },
    location: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Location',
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
        required: [true, 'Vehicle status is required'],
        default: VEHICLE_STATUSES.IDLE.tag,
        enum: {
            values: validVehicleStatuses,
            message: `Valid vehicle statuses are ${validVehicleStatuses.join(', ')}`
        }
    }
}, {
    timestamps: true
});

const Vehicle = mongoose.model('Vehicle', vehicleSchema);

module.exports = Vehicle;