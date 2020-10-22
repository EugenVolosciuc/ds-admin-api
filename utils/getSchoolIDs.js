const School = require('../database/models/School');

const getSchoolIDs = async () => {
    const autoIordache = await School.findOne({ name: 'Auto Iordache' });
    const autoFany = await School.findOne({ name: 'AutoFany' });
    const autoCriss = await School.findOne({ name: 'AutoCriss' });

    return {
        autoIordache: autoIordache._id,
        autoFany: autoFany._id,
        autoCriss: autoCriss._id
    }
}

module.exports = getSchoolIDs;