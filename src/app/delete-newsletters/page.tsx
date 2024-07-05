"use client";

import { Button } from '@/components/ui/button';
import axios from 'axios';
import { useEffect, useState } from 'react';
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
  } from "@/components/ui/alert-dialog"

export default function NewsletterTable() {
    const [newsLetters, setNewsLetters] = useState<any[]>([]);

    useEffect(() => {
        async function getNewsletters() {
            try {
                const response = await axios.get('/api/getNewsletters');
                setNewsLetters(response.data.message);
            } catch (error) {
                console.error('Error fetching newsletters:', error);
            }
        }
        getNewsletters();
    }, []);

    const deleteNewsletter = async (id: string) => {
        try {
            const response = await axios.post(`/api/deleteNewsletter`, {id: id});
            if (response.data.success) {
                setNewsLetters(newsLetters.filter(newsletter => newsletter._id !== id));
                console.log('Newsletter deleted successfully');
            } else {
                console.error('Failed to delete newsletter');
            }
        } catch (error) {
            console.error('Error deleting newsletter:', error);
        }
    };

    return (
        <div className="container absolute mx-auto px-4 mt-10 py-8 flex justify-center items-center">
            <div className="bg-zinc-950 rounded-lg shadow-lg overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="divide-y divide-gray-200">
                        <thead className="bg-white text-zinc-950">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Title</th>
                                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Delete</th>
                            </tr>
                        </thead>
                        <tbody className="bg-zinc-900 divide-y divide-gray-700">
                            {newsLetters.map(newsletter => (
                                <tr key={newsletter._id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-300">{newsletter.title}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <Button
                                            onClick={() => deleteNewsletter(newsletter._id)}
                                            variant="destructive"
                                            size="sm"
                                        >
                                            Delete
                                        </Button>
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