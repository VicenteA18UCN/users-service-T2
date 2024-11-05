import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

const authService = {
  async register(data) {
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
    } = data;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new Error("User already exists with this email");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        firstLastName,
        secondLastName,
        rut,
        email,
        hashedPassword,
        career: {
          connect: { id: careerId },
        },
        role: {
          connect: { id: roleId },
        },
        isEnabled: true,
      },
    });

    return {
      id: newUser.id,
      name: newUser.name,
      firstLastName: newUser.firstLastName,
      secondLastName: newUser.secondLastName,
      rut: newUser.rut,
      email: newUser.email,
      careerId: careerId,
      isEnabled: newUser.isEnabled,
      createdAt: newUser.createdAt.toISOString(),
    };
  },
};

export default authService;
