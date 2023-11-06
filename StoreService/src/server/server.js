const grpc = require("@grpc/grpc-js");
const STORE_PROTO_PATH = "../SharedFile/proto/services/store/v1/store_service.proto";
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const { connectToDatabase } = require('../utils/db_pgp');
// Connect to the database
connectToDatabase();

var protoLoader = require("@grpc/proto-loader");
// Import the controllers
const storeController = require('../controllers/storeController'); 
const layoutController = require('../controllers/layoutController'); 

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinitionStore = protoLoader.loadSync(STORE_PROTO_PATH, options);
const storeProto = grpc.loadPackageDefinition(packageDefinitionStore);

const server = new grpc.Server();

// store service proto route
server.addService(storeProto.StoreService.service, {
  CreateStore: storeController.createStore,
  UpdateStore: storeController.updateStore,
  DeleteStore: storeController.deleteStore,
  GetStore: storeController.getStore,
  GetStoresList: storeController.getStoresList,
  //layout controller
  GetStoreLayout: layoutController.getStoreLayout, 
  AddLayout: layoutController.addLayout, 
  UpdateLayout: layoutController.updateLayout, 
  DeleteLayout: layoutController.deleteLayout, 
})

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);