import {Button} from "@/components/ui/button";
import Link from "next/link";
import { BackgroundBeams } from "./ui/background-beams";

export default function HeroPage() {
    return(
        <div className = "flex flex-col justify-center items-center space-y-7 h-[37rem] z-10 relative">
        <h2 className="uppercase font-extrabold text-xl sm:text-5xl">
          EconoBlock
        </h2>
        <p className="font-bold text-wrap max-w-[45rem] text-center">
        Macroeconomic insights driving stocks and crypto.
        </p>
      <Link href = "/register">
      <Button size="lg" className="text-md">Subscribe</Button>
      </Link>
     </div>
    );
}