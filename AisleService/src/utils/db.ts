import { createConnection } from 'typeorm';
import Item from '../entity/item';
import dotenv from 'dotenv';

dotenv.config();

export const connectToDatabase = async () => {
  try {
    await createConnection({
      type: "postgres",
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT), // Convert the port to a number
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      entities: [Item],
      synchronize: true,
      logging: true,
    });
    console.log('Database connected!');
  } catch (error) {
    console.error(error);
  }
};
