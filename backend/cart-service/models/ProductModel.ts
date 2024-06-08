import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
  _id:mongoose.Schema.Types.ObjectId
  name: string;
  price: number;
}

const ProductSchema: Schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  }

});

const Product = mongoose.model<IProduct>("Product", ProductSchema);

export default Product;
