const pgp = require('pg-promise')();

const connection = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,  
    user: process.env.DB_USER,   
    password: process.env.DB_PASSWORD + "",
    database: process.env.DB_NAME,
};

const db = pgp(connection);  // This doesn't actually connect; it's just setting up the connection

const connectToDatabase = () => {
    return db.connect()  // This will attempt to make a single connection to test connectivity
        .then(obj => {
            obj.done();  // Success, release the connection
            console.log('Database connected!');
            return db;
        })
        .catch(error => {
            console.error('Error connecting to the database', error);
            throw error;  // Propagate the error so the caller knows something went wrong
        });
};

module.exports = { connectToDatabase, db };
