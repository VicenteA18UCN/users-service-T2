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
};

export default userController;
