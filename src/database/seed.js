/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Limpia la base de datos eliminando todos los datos
  await prisma.userProgress.deleteMany();
  await prisma.user.deleteMany();
  await prisma.role.deleteMany();
  await prisma.career.deleteMany();
  await prisma.subject.deleteMany();

  console.log("Base de datos limpiada");

  // Datos para las carreras
  const careersData = [
    { name: "Ingeniería Civil" },
    { name: "Ingeniería en Computación" },
    { name: "Ingeniería Industrial" },
  ];

  const careers = await Promise.all(
    careersData.map((career) => prisma.career.create({ data: career }))
  );

  // Datos para los roles
  const rolesData = [
    {
      name: "Admin",
      description: "Administrador con acceso completo",
    },
    {
      name: "User",
      description: "Usuario regular con acceso limitado",
    },
  ];

  const [roleAdmin, roleUser] = await Promise.all(
    rolesData.map((role) => prisma.role.create({ data: role }))
  );

  // Lista de usuarios
  const usersData = [
    {
      name: "Admin",
      firstLastName: "Perez",
      secondLastName: "Gomez",
      rut: "11111111-1",
      email: "admin@example.com",
      password: "a",
      careerId: careers[0].id,
      roleId: roleAdmin.id,
    },
    {
      name: "User",
      firstLastName: "Lopez",
      secondLastName: "Martinez",
      rut: "22222222-2",
      email: "user@example.com",
      password: "a",
      careerId: careers[1].id,
      roleId: roleUser.id,
    },
  ];

  const users = await Promise.all(
    usersData.map(async (user) => {
      const hashedPassword = await hash(user.password, 10);
      return prisma.user.create({
        data: {
          name: user.name,
          firstLastName: user.firstLastName,
          secondLastName: user.secondLastName,
          rut: user.rut,
          email: user.email,
          hashedPassword,
          careerId: user.careerId,
          roleId: user.roleId,
          isEnabled: true,
          createdAt: new Date(),
        },
      });
    })
  );

  // Datos para las asignaturas
  const subjectsData = [
    {
      code: "MAT101",
      name: "Matemáticas I",
      department: "Matemáticas",
      credits: 6,
      semester: 1,
    },
    {
      code: "PHY101",
      name: "Física I",
      department: "Física",
      credits: 6,
      semester: 1,
    },
    {
      code: "CHE101",
      name: "Química General",
      department: "Química",
      credits: 5,
      semester: 1,
    },
    {
      code: "BIO101",
      name: "Biología General",
      department: "Biología",
      credits: 5,
      semester: 1,
    },
    {
      code: "CS101",
      name: "Introducción a la Computación",
      department: "Ciencias de la Computación",
      credits: 6,
      semester: 1,
    },
  ];

  const subjects = await Promise.all(
    subjectsData.map((subject) =>
      prisma.subject.create({
        data: {
          code: subject.code,
          name: subject.name,
          department: subject.department,
          credits: subject.credits,
          semester: subject.semester,
          createdAt: new Date(),
        },
      })
    )
  );

  // Datos para el progreso del usuario
  const progressData = [
    {
      userId: users[0].id,
      subjectId: subjects[0].id,
      createdAt: new Date(),
    },
    {
      userId: users[0].id,
      subjectId: subjects[1].id,
      createdAt: new Date(),
    },
    {
      userId: users[1].id,
      subjectId: subjects[2].id,
      createdAt: new Date(),
    },
    {
      userId: users[1].id,
      subjectId: subjects[3].id,
      createdAt: new Date(),
    },
  ];

  await Promise.all(
    progressData.map((progress) =>
      prisma.userProgress.create({ data: progress })
    )
  );

  console.log("Datos de seed creados exitosamente");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
