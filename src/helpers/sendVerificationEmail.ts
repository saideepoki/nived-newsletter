import {resend} from "@/lib/resend";
import VerificationEmail from "../../emails/verificationEmail";
import { ApiResponse } from "@/types/apiResponse";

export async function sendVerificationEmail(
    email: string,
    verifyCode: string
): Promise<ApiResponse>{
  try{
    const { data, error } = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: email,
        subject: 'Test verification Code',
        react: VerificationEmail({otp: verifyCode}),
      });
   return {success: true, message: 'Successfully sent Verification code'};
  } catch(verificationEmailError) {
    console.log("Error sending Verification Email",verificationEmailError);
    return {success: false, message: "Error Sending Verification Email"};
  }
}

