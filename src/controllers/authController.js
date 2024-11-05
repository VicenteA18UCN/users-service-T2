import authService from "../services/authService.js";

const authController = {
  async register(call, callback) {
    try {
      const {
        name,
        firstLastName,
        secondLastName,
        rut,
        email,
        careerId,
        roleId,
        password,
        confirmPassword,
      } = call.request;
      const newUser = await authService.register({
        name,
        firstLastName,
        secondLastName,
        rut,
        email,
        careerId,
        roleId,
        password,
        confirmPassword,
      });
      callback(null, newUser);
    } catch (error) {
      callback({
        code: 400,
        message: error.message,
      });
    }
  },
};

export default authController;
