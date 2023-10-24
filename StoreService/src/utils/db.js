const { createConnection } = require("typeorm");

// Require the schemas
const StoreSchema = require("../entities/Store");
const LayoutSchema = require("../entities/Layout");

const connectToDatabase = async () => {
  try {
    await createConnection({
      name: "postgresConnection",
      type: "postgres",
      host: process.env.DB_HOST,
      port: process.env.DB_PORT, // Convert the port to a number
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [StoreSchema, LayoutSchema],
      synchronize: true,
      logging: true,
    });
    console.log('Database connected!');
  } catch (error) {
    console.error(error);
  }
};

module.exports = { connectToDatabase };