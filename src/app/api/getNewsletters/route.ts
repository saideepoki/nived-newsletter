import NewsLetter from "@/model/newsletter";
import { dbConnect } from "@/lib/dbConnect";

export async function GET(req: Request) {
    await dbConnect();

    try {
     const newsletters = await NewsLetter.aggregate([
        {$match: {}},
        {$sort: {'createdAt': -1}}
     ])

     if(!newsletters || newsletters.length === 0) {
        return Response.json(
            {
                success: false,
                message: "No newsletters found in database"
            },
            {
                status: 401
            }
        )
     }

     return Response.json(
        {
            success: true,
            message: newsletters
        },
        {
            status: 200
        }
     )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error fetching All NewsLetters"
            },
            {
                status: 401
            }
        )
    }
}