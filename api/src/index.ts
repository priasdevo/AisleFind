import dotenv from "dotenv";
import express from "express";
import serviceRouter from './route/serviceRouter';
import path from "path";
import cors from 'cors';
import { sendMessage } from "./utils/logService";

//dotenv.config({ path: './config/.env' })
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());

// Use the CORS middleware
app.use(cors({
  origin: ["http://localhost:3000"],
}))

app.get('/', (req, res) => {
  res.send('hello from api gateway')
})
// console logging requests
app.use((req, res, next) => {
  sendMessage('Log', 'gateway request', { method: req.method, url: req.url });
  next();
});

app.use(serviceRouter)


const PORT = process.env.PORT || 6000;
const server = app.listen(PORT, () => {
  console.log("Server running in", process.env.NODE_ENV, "mode on port", PORT);
});

// Handle promise rejection
process.on("unhandledRejection", (err: Error, Promise) => {
  sendMessage('Log', 'error', { error: err.message });
  // close server
  server.close(() => process.exit(1));
});
