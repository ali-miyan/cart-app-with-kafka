import kafka from "kafka-node";
const { KafkaClient, Producer } = kafka;

const client = new KafkaClient({ kafkaHost: "localhost:9092" });

const producer = new Producer(client);

producer.on("ready", () => {
  console.log("User Producer is ready");
});

producer.on("error", (err) => {
  console.error("User Producer error:", err);
});

export { producer };
