
import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user";
import NextAuth from "next-auth";
import bcrypt from 'bcrypt';


export const authOptions: NextAuthOptions = {
   providers: [
    CredentialsProvider({
        credentials: {
            identifier: { label: "Email / Username", type: "text"},
            password: {label: "Password", type: "text"}
          },
        async authorize(credentials: any) {
            console.log("hurrra")
            await dbConnect();
            try {
                console.log("login try");
                const user = await User.findOne({
                    $or: [
                        {email: credentials.identifier},
                        {username: credentials.identifier}
                    ]
                });
                if(!user) {
                    console.log("!user")
                    throw new Error("No user found")
                }
                if(!user.isVerified) {
                    console.log("!user.isVerified");
                    throw new Error("Please Verify your account before login");
                }
                const isPasswordValid = await bcrypt.compare(credentials.password,user.password)
                if(!isPasswordValid) {
                    throw new Error("Incorrect password");
                }
                console.log(user);
                return user;
            } catch (error: any) {
                throw new Error(error);
            }
        },
     }),
   ],
   pages: { // pages will automatically be handled by next-auth to create forms for us
    signIn: '/sign-in',
   },
   session: {
    strategy: "jwt",
   },
   callbacks: {

    async jwt({ token, user}) {
        if(user) {
        token._id = user._id?.toString();
        token.username = user.username;
        token.role = user.role;
        token.isVerified = user.isVerified;
        }
        return token;
      },
    async session({ session, user, token }) {
        if(token) {
            session.user._id = token._id;
            session.user.username = token.username;
            session.user.isVerified = token.isVerified;
        }
        return session;
      },
   },
   secret: process.env.NEXTAUTH_SECRET // all above are dependent on this secret value
}

export default NextAuth(authOptions);