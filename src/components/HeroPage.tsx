import {Button} from "@/components/ui/button";
import Link from "next/link";
import { BackgroundBeams } from "./ui/background-beams";

export default function HeroPage() {
    return(
        <div className = "flex flex-col justify-center items-center space-y-7 h-[40rem] z-10 relative">
        <h2 className="uppercase font-extrabold text-xl sm:text-5xl">
          Stay Updated!
        </h2>
        <p className="font-bold text-wrap max-w-[45rem] text-center">
          Subscribe to our newsletter and be the first to receive exclusive content, updates, and special offers straight to your inbox.csdhjcvsdjhcvdshccccccccccccccccccccccccccccccccccc
        </p>
      <Link href = "/register">
      <Button size="lg" className="text-md">Subscribe</Button>
      </Link>
     </div>
    );
}