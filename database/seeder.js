const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');
const School = require('./models/School');
const connectToDB = require('./connect');

const importUsers = async () => {
    try {
        await deleteUsers();

        const users = require('./seedData/users');

        console.log(`Importing ${users.length} users...`);
        await User.insertMany(users);

        console.log("Users imported successfuly!");
    } catch (error) {
        console.error("An error occured while importing users: ", error);
        process.exit(1);
    }
}

const deleteUsers = async () => {
    try {
        console.log("Deleting users...");
        await User.deleteMany();

        console.log("Users deleted successfuly!");
    } catch (error) {
        console.error("An error occured while deleting users: ", error);
        process.exit(1);
    }
}

const importSchools = async () => {
    try {
        await deleteSchools();

        const schools = require('./seedData/schools');

        console.log(`Importing ${schools.length} schools...`);
        await School.insertMany(schools);

        console.log("Schools imported successfuly!");
    } catch (error) {
        console.error("An error occured while importing schools: ", error);
        process.exit(1);
    }
}

const deleteSchools = async () => {
    try {
        console.log("Deleting schools...");
        await School.deleteMany();

        console.log("Schools deleted successfuly!");
    } catch (error) {
        console.error("An error occured while deleting schools: ", error);
        process.exit(1);
    }
}

const mainSeedProcess = async () => {
    await connectToDB();

    switch (process.argv[2]) {
        case 'import-users':
            await importUsers();
            break;
        case 'delete-users':
            await deleteUsers();
            break;
        case 'import-schools':
            await importSchools();
            break;
        case 'delete-schools':
            await deleteSchools();
            break;
        default:
            console.log("Please provide a valid argument: import-users | delete-users")
    }

    process.exit();
}

mainSeedProcess();