import dotenv from "dotenv";
import express from "express";
import path from "path";

//dotenv.config({ path: './config/.env' })
dotenv.config({ path: path.resolve(__dirname, "../.env") });

const app = express();
app.use(express.json());

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
