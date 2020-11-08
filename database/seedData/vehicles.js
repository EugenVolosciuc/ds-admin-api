const faker = require('faker');

const getSchoolIDs = require('../../utils/getSchoolIDs');
const { VEHICLE_STATUSES, VEHICLE_CATEGORIES, TRANSMISSION_TYPES } = require('../../constants');
// const getRandomInt = require('../../utils/getRandomInt');

const getVehicles = async () => {
    const schoolIDs = await getSchoolIDs();

    return [
        {
            brand: 'Skoda',
            model: 'Fabia',
            modelYear: new Date('2008'),
            licensePlate: 'SB 14 BSZ',
            school: schoolIDs.autoIordache,
            category: VEHICLE_CATEGORIES.B.tag,
            transmission: TRANSMISSION_TYPES.MANUAL.tag
        },
        {
            brand: 'Opel',
            model: 'Astra',
            modelYear: new Date('2007'),
            licensePlate: 'IS 72 OPE',
            school: schoolIDs.autoIordache,
            category: VEHICLE_CATEGORIES.B.tag,
            transmission: TRANSMISSION_TYPES.MANUAL.tag
        },
        {
            brand: 'Renault',
            model: 'Megane',
            modelYear: new Date('2010'),
            licensePlate: 'IS 38 MEG',
            school: schoolIDs.autoIordache,
            category: VEHICLE_CATEGORIES.B.tag,
            transmission: TRANSMISSION_TYPES.MANUAL.tag
        },
        {
            brand: 'Honda',
            model: 'CB 600',
            modelYear: new Date('2006'),
            licensePlate: 'IS 02 HON',
            school: schoolIDs.autoIordache,
            category: VEHICLE_CATEGORIES.A.tag
        },
    ]
}

module.exports = getVehicles;