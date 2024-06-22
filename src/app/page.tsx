import { BackgroundBeams } from "@/components/ui/background-beams";
import HeroPage from "@/components/HeroPage";
import NavBar from "@/components/NavBar";

export default function Home() {
  return (
    <main className="z-0 relative min-h-screen flex-col items-center justify-between bg-zinc-950">
     <NavBar/>
     <HeroPage/>
    </main>
  );
}
