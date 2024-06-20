import mongoose, {Schema,Document} from "mongoose";

export interface UserDocument extends Document {
    email: string;
    role: string;
    verifyCode: string;
    verifyCodeExpiry: Date;
    isVerified: boolean;
}

const UserSchema: Schema<UserDocument> = new Schema({
 email: {
  type: String,
  required: [true, "username is required"],
  unique: true,
  match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please use a valid email address"],
 },
 role: {
   type: String,
   default: 'user',
 },
 verifyCode: {
    type: String,
    required: [true, "Verify Code is required"]
 },
 verifyCodeExpiry: {
    type: Date,
    required: [true, "Verify Code Expiry is required"]
 },
 isVerified: {
    type: Boolean,
    default: false
 }
});

const User = (mongoose.models.User) || (mongoose.model<UserDocument>("User",UserSchema));

export default User;



