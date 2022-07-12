import * as amqplib from 'amqplib';

import { config } from '../../config';

async function connect() {
  const connection = await amqplib.connect(config.AMQP_URI);

  return connection;
}

type IConsumer = {
  connection: amqplib.Connection;
  queue: string;
  callback: (message: any) => void
}

type IProducer = {
  connection: amqplib.Connection;
  queue: string;
  message: any
}

export async function consumer({ connection, queue, callback }: IConsumer) {
  console.log(`Creating consumer queue ${queue}`);

  const channel = await connection.createChannel();
  
  channel.assertQueue(queue);

  await channel.consume(queue, callback);
}

export async function producer({ connection, queue, message }: IProducer) {
  console.log(`Calling producer queue ${queue}`);

  const channel = await connection.createChannel();

  channel.assertQueue(queue);

  await channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
}
