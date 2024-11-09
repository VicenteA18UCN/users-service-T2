import dotenv from "dotenv";
import { ServerCredentials } from "@grpc/grpc-js";
import server from "./server.js";
import { connectRabbitMQ } from "./utils/rabbitmq.js";

dotenv.config({ path: "./.env" });

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION! Apagando el servidor...");
  console.error(err.name, err.message);
  process.exit(1);
});

(async () => {
  await connectRabbitMQ();

  if (!process.env.SERVER_URL || !process.env.GRPC_PORT) {
    throw new Error("Faltan variables de entorno: SERVER_URL o GRPC_PORT.");
  }

  const PORT = process.env.GRPC_PORT || 50051;
  server.bindAsync(
    `${process.env.SERVER_URL}:${PORT}`,
    ServerCredentials.createInsecure(),
    (error, port) => {
      if (error) {
        console.error("Error al iniciar el servidor:", error);
      } else {
        console.log(`gRPC server running on ${process.env.SERVER_URL}:${port}`);
      }
    }
  );
})();
