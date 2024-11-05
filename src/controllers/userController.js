import userService from "../services/userService.js";

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
