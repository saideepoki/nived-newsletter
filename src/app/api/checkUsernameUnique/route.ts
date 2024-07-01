import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user";
import { usernameValidation } from "@/schemas/registerSchema";



export async function GET(req: Request): Promise<any> {
    await dbConnect();
    
    try {
        const {searchParams} = new URL(req.url);
        const queryParam = {
            username: searchParams.get('username')
        }
        // validate with zod
        const response = usernameValidation.safeParse(queryParam);
        if(!response.success) {
            const usernameError = response.error.format().username?._errors || [];
            return Response.json(
                {
                    success: false,
                    message: usernameError.length > 0 ?
                    usernameError.join(',') :
                    "Invalid Query parameter"
                }
            )
        }


        const {username} = response.data;

        const existingUser = await User.findOne({
            username,
            isVerified: true
        })

        if(existingUser) {
            return Response.json(
                {
                    success: false,
                    message: "Username is taken"
                },
                {
                    status: 401
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Username is available"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error Checking username"
            },
            {
                status: 401
            }
        )
    }

}