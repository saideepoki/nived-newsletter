// import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";
import { render } from '@react-email/render';
import { transporter } from "@/lib/nodemailerConfig";

export async function sendVerificationEmail(
    email: string,
    verifyCode: string
): Promise<ApiResponse>{

  const emailHtml = render(VerificationEmail({otp: verifyCode}));

  const options = {
    from: 'deeps2657@gmail.com',
    to: email,
    subject: 'hello world',
    html: emailHtml,
  };

  try{
    await transporter.sendMail(options);
   return {success: true, message: 'Successfully sent Verification code'};
  } catch(verificationEmailError) {
    console.log("Error sending Verification Email",verificationEmailError);
    return {success: false, message: "Error Sending Verification Email"};
  }
}

