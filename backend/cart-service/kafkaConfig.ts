import kafka from "kafka-node";
const { KafkaClient, Consumer } = kafka;

const client = new KafkaClient({ kafkaHost: "localhost:9092" });

const consumer = new Consumer(
  client,
  [{ topic: "user-created" }, { topic: "product-created" }],
  { autoCommit: false }
);

export { consumer };