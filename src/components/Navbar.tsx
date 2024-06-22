import { Navbar, NavbarBrand, NavbarContent, NavbarItem, NavbarMenuToggle, NavbarMenu, NavbarMenuItem } from "@nextui-org/navbar";
import Link from "next/link";
import { Button } from "./ui/button";

export default function NavBar() {
    return (
        <div className="fixed top-0 left-0 w-full z-20">
            <Navbar className="bg-zinc-950 p-3 border-b-1 border-zinc-800">
                <NavbarBrand>
                    <Link href = "/">
                    <p className="font-extrabold text-inherit text-lg">EconoBlock</p>
                    </Link>
                </NavbarBrand>
                <NavbarContent className="hidden sm:flex gap-4" justify="center">
                    <NavbarItem className="font-semibold">
                        <Link color="foreground" href="#featured-newsletters">
                            Featured
                        </Link>
                    </NavbarItem>
                    <NavbarItem isActive className="font-semibold">
                        <Link href="#" aria-current="page">
                            Contact Me
                        </Link>
                    </NavbarItem>
                </NavbarContent>
                <NavbarContent justify="end">
                    <NavbarItem>
                        <Link href = "/sign-in">
                        <Button>
                            Log in
                        </Button>
                        </Link>
                    </NavbarItem>
                </NavbarContent>
            </Navbar>
        </div>
    );
}
