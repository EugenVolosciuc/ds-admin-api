require('dotenv').config();

const User = require('./models/User');
const School = require('./models/School');
const Vehicle = require('./models/Vehicle');
const Location = require('./models/Location');
const connectToDB = require('./connect');

const importUsers = async () => {
    try {
        await deleteUsers();

        const getUsers = require('./seedData/users');
        const users = await getUsers();

        console.log(`Importing ${users.length} users...`);
        await User.create(users);

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
        await School.create(schools);

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

const importLocations = async () => {
    try {
        await deleteLocations();

        const getLocations = require('./seedData/locations');
        const locations = await getLocations();

        console.log(`Importing ${locations.length} locations...`);
        await Location.create(locations);

        console.log("Locations imported successfuly!");
    } catch (error) {
        console.error("An error occured while importing locations: ", error);
        process.exit(1);
    }
}

const deleteLocations = async () => {
    try {
        console.log("Deleting locations...");
        await Location.deleteMany();

        console.log("Locations deleted successfuly!");
    } catch (error) {
        console.error("An error occured while deleting locations: ", error);
        process.exit(1);
    }
}

const importVehicles = async () => {
    try {
        await deleteVehicles();

        const getVehicles = require('./seedData/vehicles');
        const vehicles = await getVehicles();

        console.log(`Importing ${vehicles.length} vehicles...`);
        await Vehicle.create(vehicles);

        console.log("Vehicles imported successfuly!");
    } catch (error) {
        console.error("An error occured while importing vehicles: ", error);
        process.exit(1);
    }
}

const deleteVehicles = async () => {
    try {
        console.log("Deleting vehicles...");
        await Vehicle.deleteMany();

        console.log("Vehicles deleted successfuly!");
    } catch (error) {
        console.error("An error occured while deleting vehicles: ", error);
        process.exit(1);
    }
}

const importData = async () => {
    await importSchools();
    await importLocations();
    await importVehicles();
    await importUsers();

    console.log("-----")
    console.log("Imported all data successfully!");
}

const mainSeedProcess = async () => {
    await connectToDB();

    switch (process.argv[2]) {
        case 'import-data':
            await importData();
            break;
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
        case 'import-locations':
            await importLocations();
            break;
        case 'delete-locations':
            await deleteLocations();
            break;
        case 'import-vehicles':
            await importVehicles();
            break;
        case 'delete-vehicles':
            await deleteVehicles();
            break;
        default:
            console.log("Please provide a valid argument")
    }

    process.exit();
}

mainSeedProcess();