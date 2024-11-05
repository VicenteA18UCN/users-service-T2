import { PrismaClient } from "@prisma/client";
import { cleanObject } from "../utils/cleanObject.js";
const prisma = new PrismaClient();

const userService = {
  async getAll() {
    return await prisma.user.findMany();
  },
  async getProfile(userId) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        firstLastName: true,
        secondLastName: true,
        email: true,
        rut: true,
        career: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
    if (!user) throw new Error("User not found");
    return user;
  },
  async updateProfile(data) {
    const { id, ...fields } = data;

    if (!id) {
      throw new Error("El ID no puede ser nulo");
    }

    const updateData = cleanObject(fields);

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData,
    });
    return updatedUser;
  },
};

export default userService;
