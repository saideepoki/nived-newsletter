"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";
import { useEffect, useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
export default function NewsletterTable() {
  const [newsLetters, setNewsLetters] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    async function getNewsletters() {
      try {
        setIsLoading(true);
        const response = await axios.get("/api/getNewsletters");
        setNewsLetters(response.data.message);
      } catch (error) {
        console.error("Error fetching newsletters:", error);
      }
      finally{
        setIsLoading(false);
      }
    }
    getNewsletters();
  }, []);

  const deleteNewsletter = async (id: string) => {
    try {
        setIsLoading(true);
      const response = await axios.post(`/api/deleteNewsletter`, { id: id });
      if (response.data.success) {
        setNewsLetters(
          newsLetters.filter((newsletter) => newsletter._id !== id)
        );
        // toast({
        //     title: "Newsletter deleted successfully",
        //     variant: "default",
        //     description: response.data.message,
        //   });
        console.log("Newsletter deleted successfully");
      } else {
        console.error("Failed to delete newsletter");
      }
    } catch (error) {
      console.error("Error deleting newsletter:", error);
    }
    finally {
        setIsLoading(false);
    }
  };

  if(isLoading) {
    return (
        <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
          <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
        </div>
      );
  }

  return (
    <div className="container absolute mx-auto px-4 mt-10 py-8 flex justify-center items-center">
      <div className="bg-zinc-950 rounded-lg shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="divide-y divide-gray-200">
            <thead className="bg-white text-zinc-950">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Title
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Delete
                </th>
              </tr>
            </thead>
            <tbody className="bg-zinc-900 divide-y divide-gray-700">
              {newsLetters.map((newsletter) => (
                <tr key={newsletter._id}>
                  <td className="px-6 py-4 whitespace-nowrap text-gray-300">
                    {newsletter.title}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="destructive"
                          size="sm"
                        >
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription>
                            This action cannot be undone. This will permanently
                            delete the newsletter
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                          className="bg-red-500 hover:bg-red-600 text-white"
                          onClick={() => deleteNewsletter(newsletter._id)}
                          >Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
