import { Schema, model, Document } from 'mongoose';

export interface userModel extends Document {
  name: string;
  password:string;
}

const userSchema = new Schema<userModel>({
  name: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  }
});

const User = model<userModel>('User', userSchema);

export default User;
