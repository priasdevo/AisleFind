import express from 'express';
import { handleRESTServiceRequest } from '../controllers/RESTController' 

import dotenv from "dotenv";
import path from "path";

import storeRouter from './storeRouter'; 


const router = express.Router();

// Get URL path from .env
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
const userService_URL = process.env.USER_SERVICE_URL || 'http://localhost:5000';
const aisleService_URL = process.env.AISLE_SERVICE_URL || 'http://localhost:7000';

// Route to User Service
router.use('/user', handleRESTServiceRequest(userService_URL));
// Route to Aisle Service
router.use('/aisle', handleRESTServiceRequest(aisleService_URL));
// Route to Store Service 
router.use('/store', storeRouter);

export default router;
