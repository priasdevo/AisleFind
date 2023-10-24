const grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");
const PROTO_PATH = "../../proto/services/news/v1/news_service.proto";

const options = {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

var packageDefinition = protoLoader.loadSync(PROTO_PATH, options);

const NewsService = grpc.loadPackageDefinition(packageDefinition).NewsService;

const client = new NewsService(
  "grpc://127.0.0.1:50051",
  grpc.credentials.createInsecure()
);

client.getAllNews({}, (error, news) => {
    if (!error) throw error
      console.log(news);
  });