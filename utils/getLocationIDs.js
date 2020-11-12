const Location = require('../database/models/Location');

const getLocationIDs = async () => {
    const autoIordacheIasi = await Location.findOne({ name: 'Auto Iordache Iasi' });
    const autoIordacheBacau = await Location.findOne({ name: 'Auto Iordache Bacau' });
    const autoFanyIasi = await Location.findOne({ name: 'AutoFany Iasi' });
    const autoCrissIasi = await Location.findOne({ name: 'AutoCriss Iasi' });

    return {
        autoIordacheIasi: autoIordacheIasi._id,
        autoIordacheBacau: autoIordacheBacau._id,
        autoFanyIasi: autoFanyIasi._id,
        autoCrissIasi: autoCrissIasi._id
    }
}

module.exports = getLocationIDs;