"use client";

import { useEffect, useState } from 'react';
import * as z from 'zod';
import { useToast } from "@/components/ui/use-toast";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from 'axios';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { ApiResponse } from '@/types/apiResponse';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { registerSchema } from '@/schemas/registerSchema';
import { useDebounceCallback } from 'usehooks-ts'

export default function Page() {
  const [username, setUsername] = useState('');
  const [usernameMessage, setUsernameMessage] = useState('');
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const debounced = useDebounceCallback(setUsername, 500);
  const { toast } = useToast();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      username: "",
      email: "",
    }
  });

  useEffect(() => {
    async function checkUsername() {
      if (username) {
        setIsCheckingUsername(true);
        setUsernameMessage('');
        try {
          const response = await axios.get(`/api/checkUsernameUnique?username=${username}`);
          setUsernameMessage(response.data.message);
        } catch (error) {
          const axiosError = error as AxiosError<ApiResponse>;
          const usernameError = axiosError.response?.data.message ?? "Error checking username";
          setUsernameMessage(usernameError);
        } finally {
          setIsCheckingUsername(false);
        }
      }
    }
    checkUsername();

  }, [username])

  const onSubmit: SubmitHandler<z.infer<typeof registerSchema>> = async (data) => {
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
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Username</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        placeholder="username"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e)
                          debounced(e.target.value)}}
                        className="w-full p-3 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {isCheckingUsername && <Loader2 className='absolute right-2 top-2 h-5 w-5 animate-spin' />}
                      <p className={`text-sm mt-1 ${usernameMessage === "Username is available" ? 'text-green-500' : 'text-red-500'}`}>
                        {usernameMessage}
                      </p>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="sr-only">Email</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="email"
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
        <div className="text-center mt-4">
          <p>
            Already registered?{' '}
            <Link href="/sign-in" className="text-zinc-500">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
