import { connect } from "amqplib";

export async function sendMessage(queue, message, data) {
  const con = await connect("amqp://localhost");
  const ch = await con.createChannel();
  await ch.assertQueue(queue);

  const bufferString = JSON.stringify({
    message: message,
    ...data
  });
  ch.sendToQueue(queue, Buffer.from(bufferString));

  setTimeout(()=>{
    ch.close()
    con.close()
  }, 1000);
}
