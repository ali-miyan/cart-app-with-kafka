import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import Product from '../product-service/ProductModel';
import { AddToCartEvent } from './productProducer';
import cookieParser from 'cookie-parser';
import {authenticate} from '@alimiyn/authservice'

const app = express();
app.use(cookieParser());

app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));
mongoose.connect('mongodb://localhost:27017/kafka-product')
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });

app.post('/add-products',authenticate, async (req: Request, res: Response) => {
  const { name, price } = req.body;

  const newProduct = new Product({ name, price });

  try {
    const product = await newProduct.save();
    res.status(200).send(newProduct);
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).send({ error: 'Error creating product' });
  }
});

app.get('/products',authenticate, async (req: Request, res: Response) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching products' });
  }
});

app.post('/add-to-cart',authenticate, async (req: Request, res: Response) => {
  const { userId, productId } = req.body;
  try {
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).send({ error: "Product not found" });
    }

    AddToCartEvent(product,userId)

    res.status(200).send('successfully added to cart');
  } catch (error) {
    console.error("Error adding to cart:", error);
    res.status(500).send({ error: "Error adding to cart" });
  }
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`user-service is running on port ${PORT}`);
});
