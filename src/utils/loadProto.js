import protoLoader from "@grpc/proto-loader";
import grpc from "@grpc/grpc-js";
import path from "path";

export function loadProto(serviceName) {
  const PROTO_PATH = path.join("src", "grpc", `${serviceName}.proto`);
  const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
  });

  return grpc.loadPackageDefinition(packageDefinition)[serviceName];
}
