const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "monitoring-admin",
  brokers: ["localhost:9092"],
});

async function init() {
  const producer = kafka.producer();
  console.log("Producer Connecting ...");
  await producer.connect();
  console.log("Producer Connected!");

  await producer.send({
    topic: "login-failed",
    messages: [
      {
        key: "login-failed",
        value: "Login Failed!",
      },
    ],
  });
  console.log("Messages Sent!");

  await producer.disconnect();
  console.log("Producer Disconnected!");
}

init().catch(console.error);
