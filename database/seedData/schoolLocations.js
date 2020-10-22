const faker = require('faker');

const getSchoolIDs = require('../../utils/getSchoolIDs');
// const getRandomInt = require('../../utils/getRandomInt');

const getSchoolLocations = async () => {
    const schoolIDs = await getSchoolIDs();

    return [
        {
            name: 'Auto Iordache Iasi',
            school: schoolIDs.autoIordache,
            city: 'Iasi',
            address: faker.address.streetAddress()
        },
        {
            name: 'AutoFany Iasi',
            school: schoolIDs.autoFany,
            city: 'Iasi',
            address: faker.address.streetAddress()
        },
        {
            name: 'AutoCriss Iasi',
            school: schoolIDs.autoCriss,
            city: 'Iasi',
            address: faker.address.streetAddress()
        },
    ]
}

module.exports = getSchoolLocations;