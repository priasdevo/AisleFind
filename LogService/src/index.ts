import { connect } from 'amqplib'
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config()
mongoose.set('strictQuery', true);
mongoose.connect(process.env["DATABASE_URL"] || "");
const db = mongoose.connection;
db.on('error', (error) => console.error(error));
db.once('open', () => console.log('Connected to Database'));

export default async function logConsumer(){
  const queue = 'Log';
  const con = await connect('amqp://localhost');

  const ch = await con.createChannel();
  await ch.assertQueue(queue);

  console.log("Watching queue: ",queue);

  const LogModel = mongoose.model('Log', new mongoose.Schema({}, { strict: false, collection: 'Log' }));

  await ch.consume(queue, (msg) => {
    if (msg !== null) {
      console.log('Received:', msg.content.toString());
      const document = JSON.parse(msg.content.toString());
      const unixTimestamp = new Date().getTime() + 7*60*60*1000;

      LogModel.create({
        ...document,
        logTime: new Date(unixTimestamp),
      })
      ch.ack(msg);
    } else {
      console.log('Consumer cancelled by server');
    }
  });

}

logConsumer();