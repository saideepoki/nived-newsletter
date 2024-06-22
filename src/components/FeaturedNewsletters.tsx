"use client"

import { BellIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/apiResponse";
import { useEffect, useState } from "react";
import { NewsletterDocument } from "@/model/newsletter";
import Link from "next/link";


type CardProps = React.ComponentProps<typeof Card>

export default function FeaturedNewsLetters({ className, ...props }: CardProps) {

    const[featuredNewsletters, setFeaturedNewsletters] = useState<NewsletterDocument[]>([]);

    useEffect(() => {
        async function getFeaturedNewsLetters() {
            try {
                const response = await axios.get('/api/featuredNewsletters');
                console.log(response.data.message);
                setFeaturedNewsletters(response.data.message);
            } catch (error) {
                const axiosError = error as AxiosError<ApiResponse>;
                const err = axiosError.response?.data.message ?? "Error Fetching Featured newsletters";
                console.log(err);
                return err;
            }
        }
        getFeaturedNewsLetters();
    },[])

    function truncateText(content: string): string {
        if(content.length < 100) return content;
        return content.slice(0,100) + '...';
    }

  return (
    <div id= "featured-newsletters" className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 mx-5">
      {featuredNewsletters.map((newsletter) => (
        <Card key={newsletter._id as string} className={`${cn("w-full", className)} bg-zinc-950`} {...props}>
          <CardHeader>
            <CardTitle>{newsletter.title}</CardTitle>
            <CardDescription>{new Date(newsletter.createdAt).toLocaleDateString()}</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              {truncateText(newsletter.content)}
            </p>
          </CardContent>
          <CardFooter>
            <Link href={`/newsletter/${newsletter._id}`} >
            <Button className="w-full">
              <CheckIcon className="mr-2 h-4 w-4" /> Read More
            </Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}