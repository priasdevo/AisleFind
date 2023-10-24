const grpc = require("@grpc/grpc-js");
const PROTO_PATH = "../SharedFile/proto/services/news/v1/news_service.proto";
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const { connectToDatabase } = require('../utils/db');
// Connect to the database
connectToDatabase();

var protoLoader = require("@grpc/proto-loader");


const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};
var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);
const newsProto = grpc.loadPackageDefinition(packageDefinition);

const server = new grpc.Server();
let news = [
  { id: "1", title: "Note 1", body: "Content 1", postImage: "Post image 1" },
  { id: "2", title: "Note 2", body: "Content 2 test", postImage: "Post image 2" },
];

//TODO : refactor these into  route and controller-like files 
server.addService(newsProto.NewsService.service, {
  getAllNews: (_, callback) => {
    callback(null, { news: news });
  },
  getNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    callback(null, newsItem);
  },
  addNews: (call, callback) => {
    const _news = { id: Date.now(), ...call.request };
    news.push(_news);
    callback(null, _news);
  },
  editNews: (_, callback) => {
    const newsId = _.request.id;
    const newsItem = news.find(({ id }) => newsId == id);
    newsItem.body = _.request.body;
    newsItem.postImage = _.request.postImage;
    newsItem.title = _.request.title;
    callback(null, newsItem);
  },
  deleteNews: (_, callback) => {
    const newsId = _.request.id;
    news = news.filter(({ id }) => id !== newsId);
    callback(null, {});
  },
});

server.bindAsync(
  "127.0.0.1:50051",
  grpc.ServerCredentials.createInsecure(),
  (error, port) => {
    console.log("Server running at http://127.0.0.1:50051");
    server.start();
  }
);