import express from 'express';
import { handleRESTServiceRequest } from '../controllers/RESTController' 

import dotenv from "dotenv";
import path from "path";
import Consul from "consul";

import storeRouter from './storeRouter';


const router = express.Router();
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

process.setMaxListeners(0);

const consulClient = new Consul({
  host: process.env.CONSUL_HOST || "localhost",
  port: process.env.CONSUL_PORT || "8500",
});

interface consulNode {
  ServiceAddress: string;
  ServicePort: number;
}
async function getURL(serviceName:string){
  try{
    const services:consulNode[] = await consulClient.catalog.service.nodes(serviceName);
    return services[0].ServiceAddress + ":" + services[0].ServicePort
  }
  catch(err){
    console.log(err)
    return ''
  }
}

// Get URL path from consul
let userService_URL = 'http://localhost:5000';
let aisleService_URL = 'http://localhost:7000';
let storeService_URL = 'http://localhost:50051';

async function setURLs(){
  userService_URL = await getURL('User-service')
  aisleService_URL = await getURL('Aisle-service')
  storeService_URL = await getURL('Store-service')
  console.log(userService_URL)
  // Route to User Service
  router.use('/user', handleRESTServiceRequest(userService_URL));
  // Route to Aisle Service
  router.use('/aisle', handleRESTServiceRequest(aisleService_URL));
  // Route to Store Service // TODO: change to gRPC maybe?
  router.use('/store', storeRouter);
}
setURLs()


export default router;
