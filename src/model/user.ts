import mongoose, {Schema,Document} from "mongoose";

export interface UserDocument extends Document {
    username: string;
    email: string;
    password: string;
    role: string;
    verifyCode?: string;
    verifyCodeExpiry?: Date;
    isVerified: boolean;
}

const UserSchema: Schema<UserDocument> = new Schema({
 username: {
   type: String,
   required: [true, "Username is required"],
   unique: true
},
 email: {
  type: String,
  required: [true, "Email is required"],
  unique: true,
  match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,"Please use a valid email address"],
 },
 password: {
   type: String,
   required: [true, "Password is required"]
 },
 role: {
   type: String,
   default: 'user',
 },
 verifyCode: {
    type: String,
    required: false
 },
 verifyCodeExpiry: {
    type: Date,
    required: false
 },
 isVerified: {
    type: Boolean,
    default: false
 }
});

const User = (mongoose.models.User) || (mongoose.model<UserDocument>("User",UserSchema));

export default User;



