import CredentialsProvider from "next-auth/providers/credentials";
import { NextAuthOptions } from "next-auth";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user";

export const authOptions: NextAuthOptions = {
   providers: [
    CredentialsProvider({
        id: 'sign-in',
        credentials: {
            email: { label: "email", type: "text"},
          },
        async authorize(credentials: any): Promise<any> {
            await dbConnect();
            try {
                const user = await User.findOne({email: credentials.email});
                if(!user) {
                    return null;
                }
                if(!user.isVerified) {
                    throw new Error("Please Verify your account before login");
                }
                return user;
            } catch (error) {
                return null;
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
        token._id = user._id?.toString();
        token.isVerified = user.isVerified;
        return token;
      },
    async session({ session, user, token }) {
        if(token) {
            session.user._id = token._id;
            session.user.isVerified = token.isVerified;
        }
        return session
      },
   },
   secret: process.env.NEXTAUTH_SECRET // all above are dependent on this secret value
}