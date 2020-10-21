const bcrypt = require('bcryptjs');
const faker = require('faker');

const { USER_ROLES } = require('../../constants');
const getRandomInt = require('../../utils/getRandomInt');
const School = require('../models/School');

const getRandomRoleForFakeUsers = () => {
    // No fake super admin or school admin
    const validRoles = Object.keys(USER_ROLES).filter(role => role !== USER_ROLES.SUPER_ADMIN.tag && role !== USER_ROLES.SCHOOL_ADMIN.tag);

    return validRoles[getRandomInt(0, validRoles.length - 1)];
}

const numOfFakeUsers = 50;

const getFakeUsers = schoolIDs => {
    const users = []
    for (let step = 0; step < numOfFakeUsers; step++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();

        console.log("Object.values(schoolIDs)", Object.values(schoolIDs))
        console.log("getRandomInt(0, schoolIDs.length - 1)", getRandomInt(-1, Object.values(schoolIDs).length - 1))
        console.log("Object.values(schoolIDs)[getRandomInt(-1, schoolIDs.length - 1)]", Object.values(schoolIDs)[getRandomInt(-1, Object.values(schoolIDs).length - 1)])
        
        users.push({
            firstName,
            lastName,
            phoneNumber: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            password: 'password',
            role: getRandomRoleForFakeUsers(),
            school: Object.values(schoolIDs)[getRandomInt(-1, Object.values(schoolIDs).length - 1)] // -1 for min so that some users don't have an assigned school
        });

        console.log(`Created user ${firstName} ${lastName} - ${step + 1}/${numOfFakeUsers}`);
    }

    return users;
}

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

const getUsers = async () => {
    const schoolIDs = await getSchoolIDs();

    return [
        {
            firstName: 'Eugen',
            lastName: 'Volosciuc',
            phoneNumber: '0763979976',
            email: 'volosciuc.eugen@gmail.com',
            password: 'password',
            role: USER_ROLES.SUPER_ADMIN.tag
        },
        {
            firstName: 'Ionut',
            lastName: 'Iordache',
            phoneNumber: '0761234567',
            email: 'iordache.ionut@gmail.com',
            password: 'password',
            role: USER_ROLES.SCHOOL_ADMIN.tag,
            school: schoolIDs.autoIordache
        },
        ...getFakeUsers(schoolIDs)
    ]
}

module.exports = getUsers;