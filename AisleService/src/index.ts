import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import { connectToDatabase } from './utils/db';
import itemRouter from './route/item'
dotenv.config();

connectToDatabase();

const app: Express = express();
app.use(express.json());
app.use('/items', itemRouter)



const port = process.env.PORT;


app.get('/', (req: Request, res: Response) => {
  res.send('Hello from Aisle service!!!');
});

const server = app.listen(port, () => {
  // console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
  console.log(`⚡️[server]: Server running in ${process.env.NODE_ENV||'DEVELOPMENT'} mode on host http://localhost:${port}`);
});

// Handle promise rejection
process.on("unhandledRejection", (err: Error, Promise) => {
  console.log(`Error: ${err.message}`);
  // close server
  server.close(() => process.exit(1));
});