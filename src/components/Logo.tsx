import { Navbar, NavbarBrand} from "@nextui-org/navbar";
import Link from "next/link";

export default function Logo() {
    return (
        <div className="fixed top-0 left-0 w-full z-20">
            <Navbar className="bg-zinc-950 p-3 border-b-1 border-zinc-800">
            <Link href="/">
                <NavbarBrand>
                    <p className="font-extrabold text-inherit text-lg">EconoBlock</p>
                </NavbarBrand>
            </Link>
            </Navbar>
        </div>
    );
}
