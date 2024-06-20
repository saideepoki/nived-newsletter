import mongoose, {Schema,Document} from "mongoose";

export interface UserDocument extends Document {
    email: string;
    role: string,
    createdAt: Date;
}

const UserSchema: Schema<UserDocument> = new Schema({
 email: {
  type: String,
  required: [true, "username is required"],
  unique: true,
  match: [/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,"Please use a valid email address"],
 },
 role: {
   type: String,
   default: 'user',
 },
 createdAt: {
    type: Date,
    default: Date.now,
 }
});

const User = (mongoose.models.User) || (mongoose.model<UserDocument>("User",UserSchema));

export default User;



