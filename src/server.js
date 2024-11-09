import { Server } from "@grpc/grpc-js";
import { loadProto } from "./utils/loadProto.js";
import userController from "./controllers/userController.js";
import authController from "./controllers/authController.js";

const server = new Server();

const userProto = loadProto("user");
server.addService(userProto.UserService.service, userController);

const authProto = loadProto("auth");
server.addService(authProto.AuthService.service, authController);

export default server;
