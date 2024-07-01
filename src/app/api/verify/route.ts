import User from "@/model/user";
import { dbConnect } from "@/lib/dbConnect";
import crypto from 'crypto';

export async function POST(req: Request) {
    await dbConnect();

    try {
    const{email, code} = await req.json();
    const user = await User.findOne({email: email});

    if(!user) {
        return Response.json(
            {
                success: false,
                message: "User not found. Please register First"
            } ,
            {
                status: 500
            }
        )
    }
    const hashedOtp = crypto.createHash('sha256').update(code).digest('hex');
    const isUserValid = user.verifyCode === hashedOtp;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date(Date.now());
    if(isUserValid && isCodeNotExpired) {
        user.isVerified = true;
        await user.save();
        console.log("user saved");
        return Response.json(
            {
                success: true,
                message: "Account verified Successfully"
            },
            {
                status: 200
            }
        )
    } else if(!isUserValid) {
        return Response.json(
            {
                success: false,
                message: "Invalid code. Please enter the correct code"
            },
            {
                status: 501
            }
        )
    } else {
        return Response.json(
            {
                success: false,
                message: "Code has Expired. Please register again"
            },
            {
                status: 500
            }
        )
    }
   } catch(error) {
    return Response.json(
        {
            success: false,
            message: "Error verifying user. Please try to register again"
        },
        {
            status: 501
        }
    )
   }
}