"use client";

import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";
import { Button } from "./ui/button";
import { useSession, signOut } from "next-auth/react";
import { User } from "next-auth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function NavBar() {
  const { data: session, status } = useSession();
  const user: User = session?.user as User;

  return (
    <div className="fixed top-0 left-0 w-full z-20">
      <Navbar className="bg-zinc-950 p-3 border-b-1 border-zinc-800">
        <NavbarBrand>
          <Link href="/">
            <p className="font-extrabold text-inherit text-lg">EconoBlock</p>
          </Link>
        </NavbarBrand>
        <NavbarContent className="hidden sm:flex gap-4" justify="center">
          <NavbarItem className="font-semibold">
            <Link color="foreground" href="#featured-newsletters">
              Featured
            </Link>
          </NavbarItem>
        </NavbarContent>
        <NavbarContent justify="end">
          <NavbarItem>
            {session ? (
              <div className="flex items-center ml-8">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar>
                      <AvatarImage
                        className="cursor-pointer"
                        src="https://github.com/shadcn.png"
                      />
                      <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-950">
                    <DropdownMenuLabel>
                      {user.username || user.email}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {user.role === "admin" && (
                      <DropdownMenuItem>
                        <Link href="/dashboard">Dashboard</Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem
                      className="text-red-500"
                      onClick={() => signOut({ callbackUrl: "/" })}
                    >
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link className="ml-8" href="/sign-in">
                <Button>Log in</Button>
              </Link>
            )}
          </NavbarItem>
        </NavbarContent>
      </Navbar>
    </div>
  );
}
