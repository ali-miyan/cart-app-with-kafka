import express, { Request, Response } from "express";
import cors from "cors";
import mongoose from "mongoose";
import User, { userModel } from "./UserModel";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import { authenticate } from '@alimiyn/authservice';


const app = express();

app.use(cookieParser());
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true 
}));

mongoose
  .connect("mongodb://localhost:27017/kafka-user")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

app.post("/signup", async (req: Request, res: Response) => {
  const { name, password } = req.body;

  const newUser = new User({ name, password });

  try {
    const user = await newUser.save();
    res.status(200).send(user);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).send({ error: "Error creating user" });
  }
});
app.get("/users/:id",authenticate, async (req: Request, res: Response) => {

  const userId = req.params.id;
  try {
    const newUser = await User.findById(userId);
    if (!newUser) {
      return res.status(404).send({ error: 'User not found' });
    }
    res.status(200).send(newUser.name);
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).send({ error: "Error retrieving user" });
  }
});
app.get("/logout", async (req: Request, res: Response) => {
  try {

    res.clearCookie('token', {
      httpOnly: true,
    });
    
    res.status(200).send('logged out');
  } catch (error) {
    console.error("Error retrieving user:", error);
    res.status(500).send({ error: "Error loging out user" });
  }
});

app.post("/login", async (req: Request, res: Response) => {
  console.log(req.body);

  const { name, password } = req.body;

  try {
    const user = await User.findOne({ name });


    if (!user) {
      return res.status(401).send({ error: "Invalid name or password" });
    }

    if (user.password !== password) {
      return res.status(401).send({ error: "Invalid name or password" });
    }

    const token = jwt.sign({ userId: user.id }, "secret-token", {
      expiresIn: "1h",
    });

    console.log(token);
    

    res.cookie('token', token);

    res.status(200).send({ token });
  } catch (error) {
    console.error("Error logging in:", error);
    res.status(500).send({ error: "Error logging in" });
  }
});

const PORT = 4000;
app.listen(PORT, () => {
  console.log(`user-service is running on port ${PORT}`);
});
