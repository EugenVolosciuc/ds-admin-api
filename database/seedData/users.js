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

const generateFakeUser = async schoolIDs => {
    const firstName = faker.name.firstName();
    const lastName = faker.name.lastName();

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

    if (randomRole === USER_ROLES.INSTRUCTOR.tag || randomRole === USER_ROLES.STUDENT.tag || randomRole === USER_ROLES.LOCATION_ADMIN.tag) {
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
}

const numOfFakeLocationAdmins = 3;
const numOfFakeInstructors = 15;
const numOfFakeStudents = 52;

const fakeLocationAdminsRange = [];
const fakeInstructorsRange = [];
const fakeStudentsRange = [];

for (let locAdminNum = 1; locAdminNum <= numOfFakeLocationAdmins; locAdminNum++) {
    fakeLocationAdminsRange.push(locAdminNum);
}

for (let instructorNum = 1; instructorNum <= numOfFakeInstructors; instructorNum++) {
    fakeInstructorsRange.push(instructorNum);
}

for (let studentNum = 1; studentNum <= numOfFakeStudents; studentNum++) {
    fakeStudentsRange.push(studentNum);
}

const getFakeUsers = async schoolIDs => {
    const fakeLocationAdmins = await Promise.all(fakeLocationAdminsRange.map(async () => await generateFakeUser(schoolIDs)));
    const fakeInstructors = await Promise.all(fakeInstructorsRange.map(async () => await generateFakeUser(schoolIDs)));
    const fakeStudents = await Promise.all(fakeStudentsRange.map(async () => await generateFakeUser(schoolIDs)));

    return [...fakeInstructors, ...fakeLocationAdmins, ...fakeStudents]
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
        {
            firstName: 'Andrei',
            lastName: 'Andriescu',
            phoneNumber: '0767654321',
            email: 'andriescu.andrei@gmail.com',
            password: 'password',
            role: USER_ROLES.SCHOOL_ADMIN.tag,
            school: schoolIDs.autoFany
        },
        ...fakeUsers
    ]
}

module.exports = getUsers;