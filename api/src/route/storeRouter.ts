import express from 'express';
import { 
    handleGetStoresList, 
    handleCreateStore, 
    handleUpdateStore, 
    handleDeleteStore, 
    handleGetStore,
    handleGetStoreLayout,
    handleAddLayout,
    handleUpdateLayout,
    handleDeleteLayout
} from '../controllers/storeController';
import dotenv from "dotenv";
import path from "path";
import * as grpc from '@grpc/grpc-js';
import * as protoLoader from '@grpc/proto-loader';
const PROTO_PATH = path.join(__dirname, '..', '..', '..', 'SharedFile', 'proto', 'services', 'store', 'v1', 'store_service.proto'); // Update with actual path

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const serviceProto: any = grpc.loadPackageDefinition(packageDefinition);
dotenv.config({ path: path.resolve(__dirname, "../../.env") });

const storeRouter = (service_URL: string) => {
    const client: any = new serviceProto.StoreService(
        service_URL, 
        grpc.credentials.createInsecure()
    );        
    const expressStoreRouter = express.Router();
    // Get the list of stores
    expressStoreRouter.get('/', handleGetStoresList(client));
    // Get a specific store
    expressStoreRouter.get('/:id', handleGetStore(client));
    // Add a new store
    expressStoreRouter.post('/', handleCreateStore(client));
    // Update a store
    expressStoreRouter.put('/:id', handleUpdateStore(client));
    // Delete a store
    expressStoreRouter.delete('/:id', handleDeleteStore(client));

    // layout

    // Get a store layout
    expressStoreRouter.get('/:id/layout', handleGetStoreLayout(client));
    // Add a new layout to a store
    expressStoreRouter.post('/:id/layout', handleAddLayout(client));
    // Update a layout in a store
    expressStoreRouter.put('/:id/layout/:layoutId', handleUpdateLayout(client));
    // Delete a layout in a store
    expressStoreRouter.delete('/:id/layout/:layoutId', handleDeleteLayout(client));

    return expressStoreRouter
}




export default storeRouter;
