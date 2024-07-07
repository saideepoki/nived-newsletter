import { dbConnect } from "@/lib/dbConnect";
import NewsLetter from "@/model/newsletter";

export const dynamic = 'force-dynamic';
export async function GET(req: Request): Promise<any> {
    await dbConnect();
    try {
        const featuredNewsLetters = await NewsLetter.aggregate([
            {$sort: {'createdAt': - 1}},
            {$limit: 4}
        ]);
        if(!featuredNewsLetters || featuredNewsLetters.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "No available NewsLetters"
                },
                {
                    status: 400
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: featuredNewsLetters
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error fetching featured Newsletters"
            },
            {
                status: 500
            }
        )
    }
}