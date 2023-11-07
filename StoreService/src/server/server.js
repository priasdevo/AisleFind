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
// Import the auth middleware
const { protect, protectOwnerRole } = require('../middleware/auth');

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

// Wrap the service handlers with the middleware
server.addService(storeProto.StoreService.service, {
  GetStore: protect(storeController.getStore),
  GetStoresList: protect(storeController.getStoresList),
  CreateStore: protectOwnerRole(storeController.createStore),
  UpdateStore: protectOwnerRole(storeController.updateStore),
  DeleteStore: protectOwnerRole(storeController.deleteStore),
  // Layout controller can also be wrapped accordingly
  GetStoreLayout: protect(layoutController.getStoreLayout), 
  AddLayout: protectOwnerRole(layoutController.addLayout), 
  UpdateLayout: protectOwnerRole(layoutController.updateLayout), 
  DeleteLayout: protectOwnerRole(layoutController.deleteLayout), 
});

server.bindAsync(
  "0.0.0.0:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    if (error) {
      console.error(error);
      return;
    }
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);
