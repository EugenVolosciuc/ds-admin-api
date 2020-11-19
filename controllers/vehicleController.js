const dayjs = require('dayjs');
const customParseFormat = require('dayjs/plugin/customParseFormat');

const Vehicle = require('../database/models/Vehicle');
const CronJob = require('../database/models/CronJob');
const Lesson = require('../database/models/Lesson');
const { ErrorHandler } = require('../utils/errorHandler');
const checkForUpdatableProperties = require('../utils/updatablePropertyChecker');
const VEHICLE_STATUSES = require('../constants/VEHICLE_STATUSES');

dayjs.extend(customParseFormat);

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

// @desc    Search vehicles
// @route   GET /vehicles/search
// @access  Private
module.exports.searchVehicles = async (req, res, next) => {
    const { search, school, location, status } = req.query;

    if (!search) throw new ErrorHandler(400, 'No search params provided');

    try {
        const searchFields = JSON.parse(search);

        const searchableFields = Object.entries(searchFields).reduce((acc, currentValue) => {
            acc[currentValue[0]] = new RegExp(currentValue[1], "i");
            return acc;
        }, {});

        const vehicles = await Vehicle.find({
            ...searchableFields,
            school,
            ...(location && { location }),
            ...(status && { status })
        });

        res.json(vehicles);
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

// @desc    Set vehicle usage
// @route   PATCH /vehicles/:id/usage
// @access  Private
module.exports.setVehicleUsage = async (req, res, next) => {
    const { status, start, end } = req.body;
    const { utcOffset } = req.query;

    try {
        const vehicle = await Vehicle.findById(req.params.id);

        if (!vehicle) throw new ErrorHandler(404, 'No vehicle found');

        // Change the vehicle status
        if (!start) {
            vehicle.status = status;
        } else {
            const inoperativeParameters = new Map();
            inoperativeParameters.set('status', VEHICLE_STATUSES.INOPERATIVE.tag);
            inoperativeParameters.set('vehicle', req.params.id);

            const operativeParameters = new Map();
            operativeParameters.set('status', VEHICLE_STATUSES.IDLE.tag);
            operativeParameters.set('vehicle', req.params.id);

            // "start" cron job
            if (!dayjs(start).isBefore(dayjs())) { // If start param is later before present time
                console.log("timeOfExecution when setting vehicle usage!!!", dayjs(start, 'YYYY-MM-DD HH:mm').toDate())
                await CronJob.create({
                    taskName: 'change_vehicle_status',
                    timeOfExecution: dayjs(start, 'YYYY-MM-DD HH:mm').toDate(),
                    utcOffset: Number(utcOffset),
                    parameters: status === VEHICLE_STATUSES.INOPERATIVE.tag ? inoperativeParameters : operativeParameters
                });
            }

            // "end" cron job
            await CronJob.create({
                taskName: 'change_vehicle_status',
                timeOfExecution: dayjs(end, 'YYYY-MM-DD HH:mm').toDate(),
                utcOffset: Number(utcOffset),
                parameters: status === VEHICLE_STATUSES.INOPERATIVE.tag ? operativeParameters : inoperativeParameters
            });
        }

        // Delete all lessons with this vehicle
        if (status === VEHICLE_STATUSES.INOPERATIVE.tag) {
            await Lesson
                .find({
                    vehicle: vehicle._id,
                    start: {
                        $gte: start ? dayjs(start, 'YYYY-MM-DD HH:mm') : new Date(),
                        ...(end && { $lte: dayjs(end, 'YYYY-MM-DD HH:mm') })
                    }
                })
                .deleteMany();
        }

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