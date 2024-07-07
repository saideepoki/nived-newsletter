import { dbConnect } from "@/lib/dbConnect";
import { useParams } from "next/navigation";
import NewsLetter from "@/model/newsletter";

export const dynamic = 'force-dynamic';
export async function POST(req: Request, res: Response) {
    await dbConnect();
    try {
        const {id} = await req.json();
        const response = await NewsLetter.deleteOne({_id: id});
        if(!response) {
            return Response.json(
                {
                    success: false,
                    message: "Newsletter not found"
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
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: error
            },
            {
                status: 500
            }
        )
    }

}