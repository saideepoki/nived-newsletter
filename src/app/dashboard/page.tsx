"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Send, Trash2 } from "lucide-react";
import axios from "axios";
import Link from "next/link";
import { motion} from "framer-motion";
import { useSession } from "next-auth/react";

export default function Page() {
  const [subscriberCount, setSubscriberCount] = useState<number>(0);
  const {data: session} = useSession();

  useEffect(() => {
    const getSubscriberCount = async () => {
      const response = await axios.get("/api/subscribersCount");
      setSubscriberCount(response.data.message[0].count);
    };
    getSubscriberCount();
  }, []);

  if(!session) {
    return (
    <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-zinc-900 to-black text-white">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl font-bold mb-6 text-center">
            Welcome to the Dashboard
          </h2>
          <p className="text-xl mb-8 text-center text-zinc-300">
            Please sign in to access your dashboard
          </p>
          <Link href="/sign-in" className="flex justify-center">
            <Button size="lg" className="bg-slate-50 hover:bg-blue-100 transition-colors">
              Login to Continue
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-zinc-950 p-4">
      <Card className="w-full max-w-md bg-zinc-900 border border-zinc-800 shadow-xl flex flex-col justify-center">
        <CardHeader className="border-b border-zinc-800">
          <CardTitle className="text-2xl font-bold text-center text-zinc-100">
            Newsletter Dashboard
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 mt-6">
          <div className="flex items-center justify-center space-x-3 bg-zinc-800 p-4 rounded-lg">
            <Users className="h-8 w-8 text-emerald-400" />
            <span className="text-2xl font-semibold text-zinc-100">
              {subscriberCount} Subscribers
            </span>
          </div>
          <div className="flex flex-col space-y-3">
            <Link href="/post-newsletter">
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-zinc-100">
                <Send className="mr-2 h-4 w-4" /> Post Newsletters
              </Button>
            </Link>
            <Link href="/delete-newsletters">
              <Button variant="outline" className="w-full bg-white text-zinc-950">
                <Trash2 className="mr-2 h-4 w-4" /> Delete Newsletters
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
