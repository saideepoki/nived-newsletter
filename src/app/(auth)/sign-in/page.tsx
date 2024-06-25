"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";
import { Loader2 } from "lucide-react";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react"
import {z} from 'zod';

export default function LoginPage() {
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            identifier: ""
        }
    });

    const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
        setFormSubmitting(true);
        try {
            const response = await signIn('credentials',{
                redirect: false,
                identifier: data.identifier
            })
            console.log(response);
            if(response?.error) {
                toast({
                    title: "Login failed",
                    description: "No user found with the email or username",
                    variant: "destructive"
                })
                router.refresh();
                console.log("refreshed");
            }
            if(response?.url) {
                toast({
                  title: "Login Success",
                  description: "Redirecting to view Newsletters",
                  variant: "default"
              })
                router.push('/get-newsletters');
            }

        } catch (error) {
            toast({
                title: "Login failed",
                description: `Error logging in ${error}`,
                variant: "destructive"
            })
        }
        finally {
          setFormSubmitting(false);
        }
      };

    return(
        <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white p-6">
        <div className="bg-black rounded-large p-8 text-white w-full max-w-md">
          <div className="flex flex-col justify-center items-center mb-5">
            <h2 className="font-extrabold tracking-tight text-3xl mb-3 text-white">Log In!</h2>
            <p className="text-white text-center">View All the Newsletters</p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="identifier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="sr-only">Username</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          placeholder="Email / Username"
                          {...field}
                          className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex flex-col items-center">
                <Button
                  type="submit"
                  className="w-[10rem]"
                  disabled={formSubmitting}
                >
                  Log in
                </Button>
                {formSubmitting && (
                  <div className="flex items-center mt-3 text-gray-600">
                    <Loader2 className="h-5 w-5 animate-spin mr-2" />
                    <span>Please wait...</span>
                  </div>
                )}
              </div>
            </form>
          </Form>
          <div className="text-center mt-4">
            <p>
              Haven&apos;t Registered?{' '}
              <Link href="/register" className="text-zinc-500">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
};

