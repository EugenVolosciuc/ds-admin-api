const bcrypt = require('bcryptjs');
const faker = require('faker');

const { USER_ROLES } = require('../../constants');
const getRandomInt = require('../../utils/getRandomInt');

const getRandomRoleForFakeUsers = () => {
    // No fake super admin
    const validRoles = Object.keys(USER_ROLES).filter(role => role !== USER_ROLES.SUPER_ADMIN.tag);

    return validRoles[getRandomInt(0, validRoles.length - 1)];
}

const numOfFakeUsers = 50;

const getFakeUsers = () => {
    const users = []
    for (let step = 0; step < numOfFakeUsers; step++) {
        const firstName = faker.name.firstName();
        const lastName = faker.name.lastName();
        
        users.push({
            firstName,
            lastName,
            phoneNumber: faker.phone.phoneNumber(),
            email: faker.internet.email(),
            password: bcrypt.hashSync('password', 10),
            role: getRandomRoleForFakeUsers()
        });

        console.log(`Created user ${firstName} ${lastName} - ${step + 1}/${numOfFakeUsers}`);
    }

    return users;
}


const users = [
    {
        firstName: 'Eugen',
        lastName: 'Volosciuc',
        phoneNumber: '0763979976',
        email: 'volosciuc.eugen@gmail.com',
        password: bcrypt.hashSync('password', 10),
        role: USER_ROLES.SUPER_ADMIN.tag
    },
    ...getFakeUsers()
]

module.exports = users;