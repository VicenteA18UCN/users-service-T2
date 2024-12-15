import authService from "../services/authService.js";
import { registerSchema } from "../validators/validateRegister.js";
import { updatePasswordSchema } from "../validators/validateUpdatePassword.js";
import { validate } from "../middlewares/validate.js";

const authController = {
  async register(call, callback) {
    try {
      const validatedData = validate(registerSchema, call.request);
      const newUser = await authService.register({
        ...validatedData,
      });
      callback(null, newUser);
    } catch (error) {
      callback({
        code: 400,
        message: error.message,
      });
    }
  },
  async updatePassword(call, callback) {
    try {
      console.log(call.request);
      const validatedData = validate(updatePasswordSchema, call.request);
      const response = await authService.updatePassword({ ...validatedData });
      callback(null, response);
    } catch (error) {
      callback({
        code: 400,
        message: error.message,
      });
    }
  },
};

export default authController;
