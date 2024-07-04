import User from "@/model/user";
import { dbConnect } from "@/lib/dbConnect";
import { sendNewsLetter } from "@/helpers/sendNewsletter";
import NewsLetter from "@/model/newsletter";


export async function POST(req: Request): Promise<any> {
    await dbConnect();

    try {
        const {title, content} = await req.json();
        const newsLetter = new NewsLetter({
            title: title,
            content: content,
            createdAt: Date.now()
        })
        await newsLetter.save();

        const verifiedUsers = await User.find({isVerified: true});
        if(!verifiedUsers || verifiedUsers.length === 0) {
            return Response.json({
                success: false,
                message: "No users registered or verified"
            },
            {
            status: 500
            })
        }

        const emailPromises = verifiedUsers.map((user) => (
           sendNewsLetter(title, content, user.email)
        ))

        // Promise.all to wait for all promises to resolve
        const emailResults = await Promise.all(emailPromises);
        const failedResults = emailResults.filter((result) => !result.success);
        if(failedResults.length > 0) {
            return Response.json(
                {
                    success: false,
                    message: "Newsletter not sent to everyone"
                },
                {
                    status: 500
                }
            )
        }

        return Response.json(
            {
                success: true,
                message: "Newsletter Successfully sent"
            },
            {
                status: 200
            }
        )
    } catch (error) {
        return Response.json(
            {
                success: false,
                message: "Error posting newsletters "
            },
            {
                status: 500
            }
            )
    }
}