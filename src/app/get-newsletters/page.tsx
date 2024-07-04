"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

// Define the Page component
export default function Page() {
  // State to hold newsletters, search term, and selected newsletter
  const [newsLetters, setNewsLetters] = useState<any[]>([]);
  const [filteredNewsLetters, setFilteredNewsLetters] = useState<any[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState<any | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const {data: session} = useSession();

  // Function to fetch newsletters from API
  useEffect(() => {
    async function getNewsletters() {
      try {
        const response = await axios.get('/api/getNewsletters');
        setNewsLetters(response.data.message);
        setFilteredNewsLetters(response.data.message); // Initialize filtered list
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      }
    }
    getNewsletters();
  }, []);

  // Function to handle selecting a newsletter
  const handleNewsletterClick = (newsletter: any) => {
    setSelectedNewsletter(newsletter);
  };

  // Function to handle search input change
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = newsLetters.filter(newsletter =>
      newsletter.title.toLowerCase().includes(term) ||
      newsletter.content.toLowerCase().includes(term)
    );
    setFilteredNewsLetters(filtered);
  };

  if(!session) {
    return (
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 flex flex-col justify-center items-center">
        <h2 className = "font-extrabold text-3xl mb-6 text-center">
        Please sign in to get access to the Newsletter list
        </h2>
        <Link href = "/sign-in">
          <Button className = "px-9 py-4 text-md">Login</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="flex bg-zinc-950 text-white min-h-screen mt-3">
      {/* Left side - Master List */}
      <div className="w-1/3 p-4 border-r border-zinc-800">
        <input
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full p-2 mt-10 mb-6 rounded-lg border border-zinc-500 bg-zinc-950 text-white"
        />
        <ul className="space-y-4 max-h-[calc(100vh-10rem)] overflow-y-auto">
          {filteredNewsLetters.map((newsletter) => (
            <li
              key={newsletter._id}
              className={`p-2 cursor-pointer ${selectedNewsletter?._id === newsletter._id ? 'bg-zinc-900' : 'hover:bg-zinc-900'}`}
              onClick={() => handleNewsletterClick(newsletter)}
            >
              {newsletter.title}
            </li>
          ))}
        </ul>
      </div>

      {/* Right side - Details */}
      <div className="flex-1 p-4 md: mt-12 lg: mt-15">
        {selectedNewsletter ? (
          <div>
            <h1 className="text-2xl font-bold mb-4">{selectedNewsletter.title}</h1>
            <p className="text-gray-300">{new Date(selectedNewsletter.createdAt).toLocaleDateString()}</p>
            <p className="mt-2" dangerouslySetInnerHTML={{__html: selectedNewsletter.content}}/>
          </div>
        ) : (
          <p className="text-gray-300">Select a newsletter to view details</p>
        )}
      </div>
    </div>
  );
}
