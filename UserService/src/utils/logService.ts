import { connect } from "amqplib";

export async function sendMessage(queue:string, message:string, data:any) {
  const con = await connect("amqp://localhost")
  const ch = await con.createChannel();
  await ch.assertQueue(queue)

  const bufferString = JSON.stringify({
    message: message,
    ...data
  })
  ch.sendToQueue(queue, Buffer.from(bufferString));
}
