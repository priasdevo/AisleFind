const { createConnection } = require("typeorm");

// Require the schemas
const StoreSchema = require("../entities/store");
const LayoutSchema = require("../entities/layout");

const connectToDatabase = async () => {
  try {
    await createConnection({
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