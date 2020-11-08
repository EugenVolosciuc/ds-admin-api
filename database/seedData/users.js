// const bcrypt = require('bcryptjs');
const faker = require('faker');

const { USER_ROLES } = require('../../constants');
const getRandomInt = require('../../utils/getRandomInt');
const getSchoolIDs = require('../../utils/getSchoolIDs');
const School = require('../models/School');
const Location = require('../models/Location');

const getRandomRoleForFakeUsers = () => {
    // No fake super admin or school admin
    const validRoles = Object.keys(USER_ROLES).filter(role => role !== USER_ROLES.SUPER_ADMIN.tag && role !== USER_ROLES.SCHOOL_ADMIN.tag);

    return validRoles[getRandomInt(0, validRoles.length - 1)];
}

const numOfFakeUsers = 50;
const fakeUsersRange = [];

for (let step = 1; step <= numOfFakeUsers; step++) {
    fakeUsersRange.push(step);
}

const getFakeUsers = async schoolIDs => {
    return Promise.all(
        fakeUsersRange.map(async num => {
            const firstName = faker.name.firstName();
            const lastName = faker.name.lastName();

            // Get location if instructor or student
            const randomRole = getRandomRoleForFakeUsers();
            const randomSchoolID = Object.values(schoolIDs)[getRandomInt(-1, Object.values(schoolIDs).length - 1)] // -1 for min so that some users don't have an assigned school

            const user = {
                firstName,
                lastName,
                phoneNumber: faker.phone.phoneNumber(),
                email: faker.internet.email(),
                password: 'password',
                role: randomRole,
                school: randomSchoolID,
            }

            if (randomRole === USER_ROLES.INSTRUCTOR.tag || randomRole === USER_ROLES.STUDENT.tag) {
                try {
                    const schoolResult = await School.findById(randomSchoolID);

                    if (schoolResult) {
                        if (schoolResult.locations[0]) {
                            const locationResult = await Location.findById(schoolResult.locations[0])
                            user.location = locationResult._id;

                            return user;
                        }
                    }
                } catch (error) {
                    console.log(`Couldn't find school with id ${randomSchoolID}`, error);
                }
            }

            return user;
        })
    )
}

const getUsers = async () => {
    const schoolIDs = await getSchoolIDs();

    const fakeUsers = await getFakeUsers(schoolIDs);

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
        ...fakeUsers
    ]
}

module.exports = getUsers;