import { PrismaClient } from "@prisma/client";
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
};

export default userService;
