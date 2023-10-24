import { createConnection, getRepository  } from 'typeorm';
import Item from '../entity/item';
import Layout from '../entity/layout';
import Store from '../entity/store';
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
      entities: [Item, Layout, Store],
      synchronize: true,
      logging: true,
    });
    console.log('Database connected!');

    // Fetch to create table if not exist
    const itemRepository = getRepository(Item);
    const layoutRepository = getRepository(Layout);
    const storeRepository = getRepository(Store);

    const items = await itemRepository.find();
    const layouts = await layoutRepository.find();
    const stores = await storeRepository.find();
    console.log('Sync Database table completed!');
  } catch (error) {
    console.error(error);
  }
};
