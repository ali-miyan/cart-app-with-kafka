import CartModel from "./models/CartModel";
import { consumer } from "./kafkaConfig";
import { addToCart } from "./index";


consumer.on("message", async function (message:any) {
  console.log("Received message:", message);
  try {
    if (message.topic === "product-created") {

      const parsedMessage = JSON.parse(message.value);
      const { product, userId } = parsedMessage;

      await addToCart(userId, product);
    }

    consumer.commit((err, data) => {
      if (err) {
        console.error('Offset commit error:', err);
      } else {
        console.log('Offset committed successfully', data);
      }
    });


  } catch (error) {
    console.error("Error processing message:", error);
  }
});

export default consumer
