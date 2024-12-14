import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { getChannel } from "../utils/rabbitmq.js";

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
      password,
    } = data;

    const role = await prisma.role.findFirst({
      where: { name: "Supervisor" },
    });

    if (!role) throw new Error("Rol no encontrado");

    const carrer = await prisma.career.findUnique({
      where: { id: careerId },
    });

    if (!carrer) throw new Error("Carrera no encontrada");

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });
    if (existingUser) throw new Error("El usuario ya existe con ese correo");

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
          connect: { id: role.id },
        },
        isEnabled: true,
      },
    });

    const creationUserResponse = {
      id: newUser.id,
      email: newUser.email,
      password: hashedPassword,
      roleId: role.id,
    };

    const channel = getChannel();
    channel.sendToQueue(
      "user-create-queue",
      Buffer.from(JSON.stringify(creationUserResponse)),
      {
        persistent: true,
      }
    );

    return {
      id: newUser.id,
      name: newUser.name,
      firstLastName: newUser.firstLastName,
      secondLastName: newUser.secondLastName,
      rut: newUser.rut,
      email: newUser.email,
      careerId: careerId,
      roleId: role.id,
      isEnabled: newUser.isEnabled,
      createdAt: newUser.createdAt.toISOString(),
    };
  },

  async updatePassword(data) {
    const { userId, oldPassword, newPassword } = data;
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("Usuario no encontrado");

    const isMatch = await bcrypt.compare(oldPassword, user.hashedPassword);
    if (!isMatch) throw new Error("La contraseña actual no coincide");

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { hashedPassword: hashedNewPassword },
    });

    const changePasswordResponse = {
      id: updatedUser.id,
      hashedNewPassword: updatedUser.hashedPassword,
    };

    const channel = getChannel();
    channel.sendToQueue(
      "user-update-password-queue",
      Buffer.from(JSON.stringify(changePasswordResponse)),
      {
        persistent: true,
      }
    );
    return { message: "Contraseña actualizada correctamente" };
  },
};

export default authService;
