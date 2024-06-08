import User from "./models/UserModel";
import Product from "./models/ProductModel";
import CartModel from "./models/CartModel";
import { consumer } from "./kafkaConfig";


consumer.on("message", async function (message:any) {
  console.log("Received message:", message);
  try {
    if (message.topic === "user-created") {
      const userData = JSON.parse(message.value);
      console.log("User created:", userData);
      const user = new User({ _id:userData._id, name: userData.name });
      const cartUpdate = new CartModel({ userId:userData._id, name: userData.name });
      await cartUpdate.save();
      await user.save();
    } else if (message.topic === "product-created") {
      const productData = JSON.parse(message.value);
      console.log("Product created:", productData);
      const product = new Product({ _id:productData._id, name: productData.name, price: productData.price });
      await product.save();
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
