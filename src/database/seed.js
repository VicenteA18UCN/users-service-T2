/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";
import fs from "fs/promises";

const prisma = new PrismaClient();

async function main() {
  // Limpia la base de datos eliminando todos los datos
  await prisma.userProgress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.career.deleteMany();
  await prisma.subject.deleteMany();

  console.log("Base de datos limpiada");

  const dataCareers = await fs.readFile("./mock/Careers.json", "utf-8");
  const careers = JSON.parse(dataCareers);
  const cleanedCareers = careers.map((career) => ({
    id: career.id,
    name: career.name,
  }));

  await Promise.all(
    cleanedCareers.map((career) =>
      prisma.career.create({ data: { ...career } })
    )
  );

  const dataRoles = await fs.readFile("./mock/Roles.json", "utf-8");
  const roles = JSON.parse(dataRoles);
  const cleanedRoles = roles.map((rol) => ({
    id: rol.id,
    name: rol.name,
    description: rol.description,
  }));
  await Promise.all(
    cleanedRoles.map((role) =>
      prisma.role.create({
        data: {
          ...role,
        },
      })
    )
  );

  const dataUsers = await fs.readFile("./mock/Users.json", "utf-8");
  const users = JSON.parse(dataUsers);
  const cleanedUsers = users.map((user) => ({
    id: user.id,
    name: user.name,
    firstLastName: user.firstLastName,
    secondLastName: user.secondLastName,
    rut: user.rut,
    email: user.email,
    hashedPassword: user.hashedPassword,
    careerId: user.careerId,
    roleId: user.roleId,
  }));

  await Promise.all(
    cleanedUsers.map(async (user) => {
      return prisma.user.create({
        data: {
          ...user,
        },
      });
    })
  );

  const subjectsData = await fs.readFile("./mock/Subjects.json", "utf-8");
  const subjects = JSON.parse(subjectsData);
  const cleanedSubjects = subjects.map((subject) => ({
    id: subject.id,
    code: subject.code,
    name: subject.name,
    department: subject.department,
    credits: subject.credits,
    semester: subject.semester,
  }));

  await Promise.all(
    cleanedSubjects.map((subject) =>
      prisma.subject.create({
        data: {
          ...subject,
        },
      })
    )
  );

  const progressData = await fs.readFile("./mock/UserProgress.json", "utf-8");

  const progress = JSON.parse(progressData);
  const cleanedProgress = progress.map((progress) => ({
    id: progress.id,
    userId: progress.userId,
    subjectId: progress.subjectId,
  }));

  await Promise.all(
    cleanedProgress.map(async (progress) => {
      const userExists = await prisma.user.findUnique({
        where: { id: progress.userId },
      });

      const subjectExists = await prisma.subject.findUnique({
        where: { id: progress.subjectId },
      });

      if (!userExists) {
        console.error(`User with ID ${progress.userId} does not exist.`);
        return;
      }

      if (!subjectExists) {
        console.error(`Subject with ID ${progress.subjectId} does not exist.`);
        return;
      }

      await prisma.userProgress.create({ data: { ...progress } });
    })
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
