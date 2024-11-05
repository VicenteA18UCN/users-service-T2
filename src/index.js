import grpc from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
import userController from "./controllers/userController.js";

const PROTO_PATH = path.join("src", "grpc", "user.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const userProto = grpc.loadPackageDefinition(packageDefinition).user;

const server = new grpc.Server();
server.addService(userProto.UserService.service, userController);

const PORT = process.env.GRPC_PORT || 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`gRPC server running on port ${PORT}`);
  }
);
