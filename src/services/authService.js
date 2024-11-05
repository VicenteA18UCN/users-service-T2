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

  async updatePassword(userId, oldPassword, newPassword) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
    if (!isMatch) throw new Error("Current password is incorrect");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: hashedNewPassword },
    });
    return { message: "Password updated successfully" };
  },
};

export default authService;
