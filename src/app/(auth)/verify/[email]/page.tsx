"use client";

import { useToast } from "@/components/ui/use-toast";
import { useParams, useRouter } from "next/navigation"
import { zodResolver } from "@hookform/resolvers/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { verifySchema } from "@/schemas/verifySchema";
import * as z from 'zod';
import axios, { AxiosError } from 'axios';
import { ApiResponse } from "@/types/apiResponse";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "@/components/ui/input-otp"

export default function Page() {
    const router = useRouter();
    const params = useParams<{email: string}>();
    const {toast} = useToast();
    const form = useForm({
        resolver: zodResolver(verifySchema),
        defaultValues: {
            code: '',
        }
      });

    const onSubmit: SubmitHandler<z.infer<typeof verifySchema>> = async (data) => {
        try {
            const response = await axios.post(`/api/verify/`,{
                email: decodeURIComponent(params?.email ?? ""),
                code: data.code
            });
            toast({
                title: "Success",
                description: response.data.message
            })
            router.push('/');
        } catch (error) {
            const axiosError = error as AxiosError<ApiResponse>;
            const errorMessage = axiosError.response?.data.message ?? "Error Verifying the Otp";
            toast({
              title: "Sign up failed",
              variant: "destructive",
              description: errorMessage
            })
        }
    }
    return(
        <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white p-6">
      <div className="rounded-lg p-8 text-white w-full max-w-md flex flex-col justify-center items-center">
        <div className="flex flex-col justify-center items-center mb-5">
          <h2 className="font-extrabold tracking-tight text-3xl mb-3 text-white">Verify Your Account</h2>
          <p className="text-white">Enter the verification code sent to your email</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Verification code</FormLabel>
                  <FormControl>
                  <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="flex justify-center items-center">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col items-center">
              <Button
                type="submit"
                className=""
              >
                Verify
              </Button>
            </div>
          </form>
        </Form>
        <div className = "text-center mt-4">
          <p>
            Already registered?{' '}
            <Link href = "/sign-in" className = "text-zinc-500">
            Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
    );
}