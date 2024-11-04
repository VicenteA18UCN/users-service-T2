const grpc = require("@grpc/grpc-js");
const protoLoader = require("@grpc/proto-loader");
const path = require("path");
const userServiceGrpc = require("./services/userService");

const PROTO_PATH = path.join(__dirname, "grpc", "user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const server = new grpc.Server();
server.addService(userProto.UserService.service, userServiceGrpc);

const PORT = process.env.GRPC_PORT || 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`gRPC server running on port ${PORT}`);
  }
);
