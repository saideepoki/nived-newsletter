import User from "@/model/user";
import { dbConnect } from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import crypto from 'crypto';
import bcrypt from 'bcrypt';

export async function POST(req: Request, res: Response) {
    await dbConnect();

    try {
        const {username ,email, password} = await req.json();
        console.log(password);

        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true
        });

        if(existingUserVerifiedByUsername) {
            return Response.json(
                {
                    success: false,
                    message: "User already exists and verified"
                },
                {
                    status: 500
                }
            )
        }

        const existingUserVerification = await User.findOne({email});

        const verifyCode = Math.floor(100000 + Math.random()*90000).toString();
        const otpHash = crypto.createHash('sha256').update(verifyCode).digest('hex');
        if(existingUserVerification) {
           if(existingUserVerification.isVerified) {
             return Response.json(
                {
                    success: false,
                    message: "email id already exists and verified. Please login"
                },
                {
                    status: 500
                }
             )
           }
           else {
             const salt = await bcrypt.genSalt(10);
             const hashedPassword = await bcrypt.hash(password, salt);
             existingUserVerification.verifyCode = otpHash;
             existingUserVerification.verifyCodeExpiry = new Date(Date.now() + 10*60*1000);
             existingUserVerification.password = hashedPassword;
             await existingUserVerification.save();
           }
        } else {
            const codeExpiry = new Date(Date.now() + 10*60*1000);
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            const newUser = new User({
                username: username,
                email: email,
                password: hashedPassword,
                role: 'user',
                verifyCode: otpHash,
                verifyCodeExpiry: codeExpiry,
                isVerified: false,
            });

            await newUser.save();
        }

        const emailResponse = await sendVerificationEmail(email, verifyCode);
        console.log(`Sending mail to ${email}`)
        if(!emailResponse.success) {
          return Response.json(
            {
                success: false,
                message: emailResponse.message
            },
            {
                status: 201
            }
          )
        }

        return Response.json(
            {
                success: true,
                message: 'Please verify you email to register yourself'
            },
            {
                status: 200
            }
        )

    } catch (error) {
        console.error("Error registering user");
        return Response.json(
            {
                success: false,
                message: "Error registering user"
            },
            {
                status: 500
            }
        )
    }
}

