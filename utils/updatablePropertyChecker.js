const { ErrorHandler } = require('./errorHandler');

const checkForUpdatableProperties = (updatedItem, dataToUpdate, possibleUpdates) => {
    for (const property in dataToUpdate) {
        if (possibleUpdates.includes(property)) {
            updatedItem[property] = dataToUpdate[property];
        } else {
            throw new ErrorHandler(400, [{ field: property, message: `Property not accepted: ${property}` }]);
        }
    }
}

module.exports = checkForUpdatableProperties;