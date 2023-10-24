const grpc = require("@grpc/grpc-js");
// const NEWS_PROTO_PATH = "../SharedFile/proto/services/news/v1/news_service.proto";
const STORE_PROTO_PATH = "../SharedFile/proto/services/store/v1/store_service.proto";
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { connectToDatabase } = require('../utils/db_pgp');
// Connect to the database
connectToDatabase();

var protoLoader = require("@grpc/proto-loader");
// Import the controllers
// const newsController = require('../controllers/newsController'); 
const storeController = require('../controllers/storeController'); 
const layoutController = require('../controllers/layoutController'); 

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
// var packageDefinitionNews = protoLoader.loadSync(NEWS_PROTO_PATH, options);
// const newsProto = grpc.loadPackageDefinition(packageDefinitionNews);

var packageDefinitionStore = protoLoader.loadSync(STORE_PROTO_PATH, options);
const storeProto = grpc.loadPackageDefinition(packageDefinitionStore);

const server = new grpc.Server();

// news service proto route
// server.addService(newsProto.NewsService.service, {
//   getAllNews: newsController.getAllNews,
//   getNews: newsController.getNews,
//   addNews: newsController.addNews,
//   editNews: newsController.editNews,
//   deleteNews: newsController.deleteNews,
// });

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
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);