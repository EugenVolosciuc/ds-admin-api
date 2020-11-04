const Vehicle = require('../database/models/Vehicle');
const { ErrorHandler } = require('../utils/errorHandler');
const checkForUpdatableProperties = require('../utils/updatablePropertyChecker');

// @desc    Get vehicles
// @route   GET /vehicles
// @access  Private
module.exports.getVehicles = (req, res, next) => {
    try {
        if (!res.paginatedResults.vehicles) throw new ErrorHandler(404, 'No vehicles found');


        res.send(res.paginatedResults);
    } catch (error) {
        next(error);
    }
}

// @desc    Create vehicle
// @route   POST /vehicles
// @access  Private
module.exports.createVehicle = async (req, res, next) => {
    const { licensePlate } = req.body;

    try {
        const licensePlateExists = await Vehicle.findOne({ licensePlate });

        if (licensePlateExists) {
            throw new ErrorHandler(400, [{ field: 'licensePlate', message: 'A vehicle with this license plate already exists' }]);
        }

        const vehicle = await Vehicle.create({ ...req.body, school: req.school._id });

        res.status(201).json(vehicle);
    } catch (error) {
        next(error);
    }
}

// @desc    Update vehicle
// @route   PATCH /vehicles/:id
// @access  Private
module.exports.updateVehicle = async (req, res, next) => {
    const possibleUpdates = Object.keys(Vehicle.schema.obj);

    const dataToUpdate = req.body;

    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) throw new ErrorHandler(404, 'No vehicle found');

        checkForUpdatableProperties(vehicle, dataToUpdate, possibleUpdates);

        await vehicle.save();

        res.send(vehicle);
    } catch (error) {
        next(error);
    }
}

// @desc    Delete vehicle
// @route   DELETE /vehicles
// @access  Private
module.exports.deleteVehicle = async (req, res, next) => {
    try {
        // TODO: restrict who can delete vehicle
        const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

        if (!vehicle) throw new ErrorHandler(404, 'No vehicle found');

        res.json(vehicle);
    } catch (error) {
        next(error);
    }
}