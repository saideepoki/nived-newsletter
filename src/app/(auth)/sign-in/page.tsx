"use client"

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm, SubmitHandler  } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@/schemas/loginSchema";

export default function LoginPage(){
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
        }
    });

    return(
        <>
        </>
    );
};

