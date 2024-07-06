import { dbConnect } from "@/lib/dbConnect";
import User from "@/model/user";

export async function GET(req: Request) {
    await dbConnect();

    try {
        const response = await User.aggregate([
            {$count: 'count'}
        ])
        if(!response) {
            return Response.json(
                {
                    success: false,
                    message: "No subscribers found"
                },
                {
                    status: 404,
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: response
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error
            },
            {
                status: 400
            }
        )
    }
}