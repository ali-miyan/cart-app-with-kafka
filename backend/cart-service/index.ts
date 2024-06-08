import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import Cart from "./models/CartModel";
import consumer from "./cartConsumer";
import UserModel from "./models/UserModel";
import Product from "./models/ProductModel";
import cookieParser from 'cookie-parser';
import {authenticate} from '@alimiyn/authservice'

consumer;

const app = express();
app.use(cookieParser());

interface IProduct {
  name: string;
  price: number;
  _id: mongoose.Schema.Types.ObjectId;
}

interface IUser {
  name: string;
  _id: mongoose.Schema.Types.ObjectId;
}

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));
mongoose
  .connect("mongodb://localhost:27017/kafka-cart")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

  app.post("/add-to-cart", authenticate, async (req, res) => {
    const { userId, productId } = req.body;
    try {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).send({ error: "Product not found" });
      }
  
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({
          userId,
          products: [
            {
              _id: product._id,
              name: product.name,
              price: product.price,
            },
          ],
        });
      } else {
        const existingProductIndex = cart.products.findIndex(
          (item) => item._id.toString() === productId
        );
  
        if (existingProductIndex !== -1) {
          console.log('lol');
          
          return res.json({ error: true });
        }
  
        cart.products.push({
          _id: product._id,
          name: product.name,
          price: product.price,
        });
      }
  
      await cart.save();
  
      res.status(200).send(cart);
    } catch (error) {
      console.error("Error adding to cart:", error);
      res.status(500).send({ error: "Error adding to cart" });
    }
  });
  

app.get("/cart/:id",authenticate, async (req: Request, res: Response) => {
  try {
    const cartItems = await Cart.findOne({userId:req.params.id});
    console.log(req.params.id);
    
    res.json(cartItems);
  } catch (error) {
    res.status(500).send({ error: "Error fetching cart items" });
  }
});

const PORT = 4002;
app.listen(PORT, () => {
  console.log(`cart-service is running on port ${PORT}`);
});
