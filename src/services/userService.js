import { PrismaClient } from "@prisma/client";
import { cleanObject } from "../utils/cleanObject.js";
import { getChannel } from "../utils/rabbitmq.js";
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

    const updatedUserResponse = {
      id: updatedUser.id,
      name: updatedUser.name,
      firstLastName: updatedUser.firstLastName,
      secondLastName: updatedUser.secondLastName,
    };

    const channel = getChannel();
    channel.sendToQueue(
      "user-update-queue",
      Buffer.from(JSON.stringify(updatedUserResponse)),
      {
        persistent: true,
      }
    );

    return updatedUser;
  },

  async getProgress(userId) {
    const progress = await prisma.userProgress.findMany({
      where: { userId },
      select: {
        subject: {
          select: {
            id: true,
            code: true,
          },
        },
      },
    });

    return progress.map((item) => ({
      id: item.subject.id,
      code: item.subject.code,
    }));
  },

  async updateProgress(userId, addSubjects, removeSubjects) {
    const allSubjects = await prisma.subject.findMany();

    const subjectsToAdd = addSubjects.map((code) => {
      const subject = allSubjects.find(
        (sub) => sub.code.toLowerCase() === code.toLowerCase()
      );
      if (!subject)
        throw new Error(`Asignatura con código ${code} no encontrada`);
      return subject.id;
    });

    const subjectsToRemove = removeSubjects.map((code) => {
      const subject = allSubjects.find(
        (sub) => sub.code.toLowerCase() === code.toLowerCase()
      );
      if (!subject)
        throw new Error(`Asignatura con código ${code} no encontrada`);
      return subject.id;
    });

    const userProgress = await prisma.userProgress.findMany({
      where: { userId },
      select: { subjectId: true },
    });
    const currentSubjectIds = new Set(userProgress.map((up) => up.subjectId));

    const progressToAdd = subjectsToAdd.map((subjectId) => {
      if (currentSubjectIds.has(subjectId)) {
        throw new Error(
          `Asignatura con ID ${subjectId} ya está en el progreso del usuario`
        );
      }
      return { userId, subjectId, createdAt: new Date() };
    });

    const progressToRemove = subjectsToRemove.filter((subjectId) => {
      if (!currentSubjectIds.has(subjectId)) {
        throw new Error(
          `Asignatura con ID ${subjectId} no está en el progreso del usuario`
        );
      }
      return subjectId;
    });

    let addResult = false,
      removeResult = false;

    if (progressToAdd.length > 0) {
      addResult =
        (
          await prisma.userProgress.createMany({
            data: progressToAdd,
            skipDuplicates: true,
          })
        ).count > 0;
    }

    if (progressToRemove.length > 0) {
      removeResult =
        (
          await prisma.userProgress.deleteMany({
            where: { userId, subjectId: { in: progressToRemove } },
          })
        ).count > 0;
    }

    if (!addResult && !removeResult) {
      throw new Error("No se realizaron cambios en el progreso del usuario");
    }

    const updatedProgress = await prisma.userProgress.findMany({
      where: { userId },
      select: {
        subject: {
          select: { id: true, code: true },
        },
      },
    });

    return updatedProgress.map((item) => ({
      id: item.subject.id,
      code: item.subject.code,
    }));
  },
};

export default userService;
