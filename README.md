# Users-Service

Este servicio forma parte del Taller 2 de Arquitectura de Sistemas.

## Requisitos Previos

- Node.js versión 22.11.0
- Base de datos PostgreSQL
- RabbitMQ

## Instalación

**Nota:** Asegúrate de haber ejecutado el docker-compose del [repositorio de la API Gateway](https://github.com/MatiasFontecillaBusch/api-gateway-T2). Esto permitirá tener todos los servicios necesarios para el correcto funcionamiento de este servicio.

1. Clona el repositorio:

   ```bash
   git clone https://github.com/VicenteA18UCN/users-service-T2.git
   cd users-service-T2
   ```

2. Instala las dependencias:

   ```bash
   npm install
   ```

3. Variables de entorno:

   - Copia el archivo `.env.template` a `.env`:

     ```bash
     cp .env.example .env
     ```

   - Modifica las variables de entorno en el archivo `.env` según corresponda.

     ```bash
     DATABASE_URL="postgresql://username:password@localhost:port/server"
     RABBITMQ_URL=amqp://localhost:5672
     SERVER_URL=localhost
     GRPC_PORT=5003
     ```

---

4. Genera el cliente de Prisma:

   ```bash
   npx prisma generate
   npx prisma migrate dev
   ```

5. Ejecuta el comando para llenar la base de datos:

   ```bash
   npm run seed
   ```

6. Ejecuta el comando para iniciar el servicio:
   ```bash
   npm run dev
   ```
