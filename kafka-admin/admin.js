const { Kafka } = require("kafkajs");

const kafka = new Kafka({
  clientId: "monitoring-admin",
  brokers: ["localhost:9092"],
});

async function createTopic(topicName) {
  const admin = kafka.admin();

  await admin.connect();

  console.log("Connected to Kafka");
  await admin.createTopics({
    topics: [
      {
        topic: topicName,
        numPartitions: 1,
      },
    ],
  });
  console.log(`Topic ${topicName} created`);
  await admin.disconnect();
}

createTopic("login-failed");
