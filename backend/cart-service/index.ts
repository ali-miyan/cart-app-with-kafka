import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import Cart, { CartItem } from "./models/CartModel";
import consumer from "./cartConsumer";
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

  export async function addToCart(userId: string, product: CartItem) {
    try {
      let cart = await Cart.findOne({ userId });
  
      if (!cart) {
        cart = new Cart({ userId, products: [] });
      }
  
      cart.products.push(product);
  
      await cart.save();
      console.log(`Product added to cart for user ${userId}`);
    } catch (error) {
      console.error("Error adding product to cart:", error);
    }
  }
  

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
