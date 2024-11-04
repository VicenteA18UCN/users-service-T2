const grpc = require("@grpc/grpc-js");
const path = require("path");

const server = new grpc.Server();

const PORT = process.env.GRPC_PORT || 50051;
server.bindAsync(
  `0.0.0.0:${PORT}`,
  grpc.ServerCredentials.createInsecure(),
  () => {
    server.start();
    console.log(`gRPC server running on port ${PORT}`);
  }
);
