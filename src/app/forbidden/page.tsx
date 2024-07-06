import React from 'react';
import { ShieldAlert } from "lucide-react";

export default function Page() {
  return (
    <div className="h-screen flex flex-col justify-center items-center bg-zinc-950 text-zinc-100 p-4">
      <ShieldAlert className="w-16 h-16 text-red-500 mb-4" />
      <h1 className="text-3xl font-bold mb-2">Access Forbidden</h1>
      <p className="text-xl text-zinc-400 text-center max-w-md">
        This page can only be accessed by administrators.
      </p>
      <p className="mt-8 text-sm text-zinc-500">
        If you believe you should have access, please contact the system administrator.
      </p>
    </div>
  );
}