/* eslint-disable no-console */
import { PrismaClient } from "@prisma/client";
import { hash } from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  // Datos para las carreras
  const careersData = [
    { name: "Ingeniería Civil", version: 1 },
    { name: "Ingeniería en Computación", version: 1 },
    { name: "Ingeniería Industrial", version: 1 },
  ];

  const careers = await Promise.all(
    careersData.map((career) => prisma.career.create({ data: career }))
  );

  // Datos para los roles
  const rolesData = [
    {
      name: "Admin",
      description: "Administrador con acceso completo",
      version: 1,
    },
    {
      name: "User",
      description: "Usuario regular con acceso limitado",
      version: 1,
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
      version: 1,
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
      version: 1,
    },
  ];

  await Promise.all(
    usersData.map(async (user) => {
      const hashedPassword = await hash(user.password, 10);
      await prisma.user.create({
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
          version: user.version,
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
      version: 1,
    },
    {
      code: "PHY101",
      name: "Física I",
      department: "Física",
      credits: 6,
      semester: 1,
      version: 1,
    },
  ];

  await Promise.all(
    subjectsData.map((subject) =>
      prisma.subject.create({
        data: {
          code: subject.code,
          name: subject.name,
          department: subject.department,
          credits: subject.credits,
          semester: subject.semester,
          createdAt: new Date(),
          version: subject.version,
        },
      })
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
