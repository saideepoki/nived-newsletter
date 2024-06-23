import User from "@/model/user";
import { dbConnect } from "@/lib/dbConnect";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";

export async function POST(req: Request, res: Response) {
    await dbConnect();

    try {
        const {username ,email} = await req.json();

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
        if(existingUserVerification) {
           if(existingUserVerification.isVerified) {
             return Response.json(
                {
                    success: false,
                    message: "email id already exists and verified"
                },
                {
                    status: 500
                }
             )
           }
           else {
             existingUserVerification.verifyCode = verifyCode;
             existingUserVerification.verifyCodeExpiry = new Date(Date.now() + 3600000);
             await existingUserVerification.save();
           }
        } else {
            const codeExpiry = new Date(Date.now() + 3600000);

            const newUser = new User({
                username: username,
                email: email,
                role: 'user',
                verifyCode: verifyCode,
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

