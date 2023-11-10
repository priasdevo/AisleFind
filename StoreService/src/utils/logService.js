// import connect from amqplib
const { connect } = require("amqplib");


async function sendMessage(queue, message, data) {
  const con = await connect("amqp://aislefind.pisuttun.com")
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

module.exports = {
  sendMessage
};
