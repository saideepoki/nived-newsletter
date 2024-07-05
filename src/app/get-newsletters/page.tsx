"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Loader2, Search, Mail, ChevronDown } from "lucide-react";

interface Newsletter {
  _id: string;
  title: string;
  content: string;
  createdAt: string;
}

export default function NewsletterPage() {
  const [newsletters, setNewsletters] = useState<Newsletter[]>([]);
  const [filteredNewsletters, setFilteredNewsletters] = useState<Newsletter[]>([]);
  const [selectedNewsletter, setSelectedNewsletter] = useState<Newsletter | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const { data: session } = useSession();

  useEffect(() => {
    async function fetchNewsletters() {
      try {
        const response = await axios.get<{ message: Newsletter[] }>('/api/getNewsletters');
        setNewsletters(response.data.message);
        setFilteredNewsletters(response.data.message);
      } catch (error) {
        console.error('Error fetching newsletters:', error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchNewsletters();
  }, []);

  const handleNewsletterClick = (newsletter: Newsletter) => {
    setSelectedNewsletter(newsletter);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const term = e.target.value.toLowerCase();
    setSearchTerm(term);

    const filtered = newsletters.filter(newsletter =>
      newsletter.title.toLowerCase().includes(term) ||
      newsletter.content.toLowerCase().includes(term)
    );
    setFilteredNewsletters(filtered);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center">
            Welcome to the Newsletter Hub
          </h2>
          <p className="text-xl mb-8 text-center text-zinc-300">
            Please sign in to access your personalized newsletter list
          </p>
          <Link href="/sign-in" className="flex justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 transition-colors">
              Login to Continue
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
        <Loader2 className="w-12 h-12 animate-spin text-blue-500" />
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row bg-gradient-to-br from-zinc-900 to-black text-white min-h-screen p-6 gap-6 mt-12 relative">
      <Card className="lg:w-1/3 w-full bg-zinc-800/50 border-zinc-700 backdrop-blur-sm mb-6 lg:mb-0 relative">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Mail className="w-6 h-6" /> Newsletters
          </CardTitle>
          <div className="relative">
            <Input
              type="text"
              placeholder="Search newsletters..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 bg-zinc-700/50 border-zinc-600 focus:border-blue-500 transition-colors"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
          </div>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[calc(100vh-12rem)] relative">
            <AnimatePresence>
              {filteredNewsletters.map((newsletter) => (
                <motion.div
                  key={newsletter._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  <Button
                    variant="ghost"
                    className={`w-full justify-start text-left mb-2 ${
                      selectedNewsletter?._id === newsletter._id
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'hover:bg-zinc-700/50'
                    }`}
                    onClick={() => handleNewsletterClick(newsletter)}
                  >
                    {newsletter.title}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
            {/* Scroll down indicator */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 lg:hidden">
              <ChevronDown className="w-6 h-6 animate-bounce text-zinc-400" />
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="flex-1 bg-zinc-800/50 border-zinc-700 backdrop-blur-sm overflow-hidden">
        <CardContent className="p-6 h-full">
          <AnimatePresence mode="wait">
            {selectedNewsletter ? (
              <motion.div
                key={selectedNewsletter._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full overflow-auto"
              >
                <h1 className="text-3xl font-bold mb-2">{selectedNewsletter.title}</h1>
                <p className="text-sm text-zinc-400 mb-4">
                  {new Date(selectedNewsletter.createdAt).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
                <ScrollArea>
                <div
                  className="prose prose-invert max-w-none"
                  dangerouslySetInnerHTML={{ __html: selectedNewsletter.content }}
                />
                </ScrollArea>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="h-full flex items-center justify-center"
              >
                <p className="text-zinc-400 text-lg">Select a newsletter to view details</p>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </div>
  );
}
