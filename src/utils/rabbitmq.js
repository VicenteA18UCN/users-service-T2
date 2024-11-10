import amqp from "amqplib";

let channel;

export async function connectRabbitMQ() {
  try {
    const connection = await amqp.connect(
      process.env.RABBITMQ_URL || "amqp://localhost"
    );
    channel = await connection.createChannel();
    await channel.assertQueue("user-create-queue", { durable: true });
    console.log("Connected to RabbitMQ and queue 'user-create-queue' created");
    await channel.assertQueue("user-update-password-queue", { durable: true });
    console.log(
      "Connected to RabbitMQ and queue 'user-update-password-queue' created"
    );
  } catch (error) {
    console.error("Failed to connect to RabbitMQ", error);
    process.exit(1);
  }
}

export function getChannel() {
  if (!channel) {
    throw new Error(
      "RabbitMQ channel is not initialized. Call connectRabbitMQ first."
    );
  }
  return channel;
}
