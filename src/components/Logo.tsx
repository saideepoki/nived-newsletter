import { Navbar, NavbarBrand, NavbarContent, NavbarItem} from "@nextui-org/navbar";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";

export default function Logo() {
    const {data: session, status} = useSession();
    const user = session?.user;

    return (
        <div className="fixed top-0 left-0 w-full z-20">
            <Navbar className="bg-zinc-950 p-3 border-b-1 border-zinc-800">
            <Link href="/">
                <NavbarBrand>
                    <p className="font-extrabold text-inherit text-lg">EconoBlock</p>
                </NavbarBrand>
            </Link>
            <NavbarContent justify = "end">
            <NavbarItem>
                        {session ? (
                            <div className="flex items-center">
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                    <Avatar>
                                        <AvatarImage className = "cursor-pointer" src="https://github.com/shadcn.png" />
                                            <AvatarFallback>CN</AvatarFallback>
                                        </Avatar>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="bg-zinc-950">
                                    <DropdownMenuLabel>{user?.username || user?.email}</DropdownMenuLabel>
                                    <DropdownMenuSeparator/>
                                    <DropdownMenuItem className = "text-red-500" onClick = {() => signOut()}>
                                        Logout
                                    </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        ) : (
                           ''
                        )}
                </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
}
