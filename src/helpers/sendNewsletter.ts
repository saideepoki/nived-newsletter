import { transporter } from "@/lib/nodemailerConfig";
import { ApiResponse } from "@/types/apiResponse";
import { render } from '@react-email/render';
import DarkNewsletterEmail from "../../emails/newsletter";

export async function sendNewsLetter(
    title: string,
    content: string,
    email: string
): Promise<ApiResponse> {
    const newsletterHtml = render(DarkNewsletterEmail({title, content}));
    const options = {
        from: 'deeps2657@gmail.com',
        to: email,
        subject: title,
        html: newsletterHtml
    }
    
    try {
        await transporter.sendMail(options);
        console.log("Newsletter Sent successfully");
        return {
                success: true,
                message: "Newsletter sent successfully"
            }
    } catch(error) {
        return {
               success: false,
               message: "Error in sending Newsletter"
        }
    }

}