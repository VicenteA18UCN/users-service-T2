import { validate } from "../middlewares/validate.js";
import userService from "../services/userService.js";
import { cleanObject } from "../utils/cleanObject.js";
import { updateProfileSchema } from "../validators/validateUpdateProfile.js";

const userController = {
  async getAll(call, callback) {
    try {
      const users = await userService.getAll();
      callback(null, { users });
    } catch (error) {
      callback(error);
    }
  },
  async profile(call, callback) {
    try {
      const user = await userService.getProfile(call.request.id);
      callback(null, user);
    } catch (error) {
      callback(error);
    }
  },
  async updateProfile(call, callback) {
    try {
      const { id, name, firstLastName, secondLastName } = call.request;
      validate(updateProfileSchema, {
        name,
        firstLastName,
        secondLastName,
      });
      const user = await userService.updateProfile(call.request);
      callback(null, user);
    } catch (error) {
      callback(error);
    }
  },
  async getProgress(call, callback) {
    try {
      const userId = call.request.id;
      const progress = await userService.getProgress(userId);

      callback(null, { progress });
    } catch (error) {
      callback(error);
    }
  },
  async updateProgress(call, callback) {
    try {
      const { userId, addSubjects, removeSubjects } = call.request;
      const updatedProgress = await userService.updateProgress(
        userId,
        addSubjects,
        removeSubjects
      );
      callback(null, { progress: updatedProgress });
    } catch (error) {
      callback(error);
    }
  },
};

export default userController;
