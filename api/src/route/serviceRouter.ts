import express from 'express';
import { handleRESTServiceRequest } from '../controllers/restService' // Adjust the import to the updated function
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const router = express.Router();

const userService_URL = process.env.USER_SERVICE_URL || 'http://localhost:5000';
const aisleService_URL = process.env.AISLE_SERVICE_URL || 'http://localhost:5010';
const storeService_URL = process.env.STORE_SERVICE_URL || 'http://localhost:5020';
const dataVisualizerService_URL = process.env.DATA_VIS_SERVICE_URL || 'http://localhost:5030';

// Route to User Service
router.use('/user', handleRESTServiceRequest(userService_URL));
// Route to Aisle Service
router.use('/aisle', handleRESTServiceRequest(aisleService_URL));
// Route to Store Service // TODO: change to gRPC maybe?
router.use('/store', handleRESTServiceRequest(storeService_URL));
// Route to Data Visualizer Service // TODO: change to gRPC maybe?
router.use('/dataviz', handleRESTServiceRequest(dataVisualizerService_URL));

export default router;
