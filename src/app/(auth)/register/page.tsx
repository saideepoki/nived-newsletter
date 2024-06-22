"use client";

import { useState } from 'react';
import * as z from 'zod';
import { useToast } from "@/components/ui/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { loginSchema } from '@/schemas/loginSchema';
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/types/apiResponse';
import { Form, FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function Page() {
  const [email, setEmail] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
    }
  });

  const onSubmit: SubmitHandler<z.infer<typeof loginSchema>> = async (data) => {
    setFormSubmitting(true);
    try {
      const response = await axios.post('/api/register', data);
      toast({
        title: "Success",
        description: response.data.message,
      });
      router.push(`/verify/${data.email}`);
    } catch (error) {
      console.error("Error Signing up user");
      const axiosError = error as AxiosError<ApiResponse>;
      const errorMessage = axiosError.response?.data.message ?? "Error Registering the user";
      toast({
        title: "Sign up failed",
        variant: "destructive",
        description: errorMessage,
      });
    } finally {
      setFormSubmitting(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-950 text-white p-6">
      <div className="bg-black rounded-large p-8 text-white w-full max-w-md">
        <div className="flex flex-col justify-center items-center mb-5">
          <h2 className="font-extrabold tracking-tight text-3xl mb-3 text-white">Join Our Newsletter!</h2>
          <p className="text-white text-center">Register now to receive the latest newsletters directly in your inbox.</p>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="Enter your email"
                      {...field}
                      className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
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
                Register
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
