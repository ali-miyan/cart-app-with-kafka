import mongoose, { Document, Schema } from "mongoose";

export interface CartItem {
  _id: mongoose.Schema.Types.ObjectId;
  name: string;
  price: number;
}

interface Cart extends Document {
  userId: string;
  products: CartItem[];
}

const CartSchema: Schema = new Schema({
  userId: {
    type: String,
    required: true,
  },
  products: [
    {
      name: {
        type: String,
      },
      price: {
        type: Number,
      },
    },
  ],
});

export default mongoose.model<Cart>("Cart", CartSchema);
