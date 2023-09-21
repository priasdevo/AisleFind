import dotenv from "dotenv";
import express from "express";
import authRouter from "./route/auth"
import mongoose from "mongoose";

dotenv.config();
mongoose.set('strictQuery', true);
mongoose.connect(process.env["DATABASE_URL"] || "");
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

const app = express();
app.use(express.json());
app.use('/auth', authRouter)
app.get('/', (req, res) => {
  res.send('hello from express')
})

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log("Server running in", process.env.NODE_ENV, "mode on port", PORT);
});

// Handle promise rejection
process.on("unhandledRejection", (err: Error, Promise) => {
  console.log(`Error: ${err.message}`);
  // close server
  server.close(() => process.exit(1));
});