import Hero from "../Components/Hero";
import FeaturesSection from '../Components/LandingSectionBottom'
import Nav from "../Components/Nav";

export default function Landing() {
  return (
    <div className=" min-h-screen text-white">
   <Nav />
      <main className="flex-1 flex flex-col items-center overflow-x-hidden w-full bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
        
        {/* Hero */}
        <div className="relative w-full flex justify-center py-2">
          <Hero />

          {/* Pulse Background Glow */}
          <div className="absolute left-[-100px] top-[50px] w-[400px] h-[400px] bg-green-400/20 blur-[120px] rounded-full animate-pulse-slow opacity-30 pointer-events-none" />
          <div className="absolute right-[-80px] bottom-[20px] w-[300px] h-[300px] bg-cyan-400/20 blur-[100px] rounded-full animate-pulse-medium opacity-30 pointer-events-none" />
        </div>

        {/* Features Section */}
        <FeaturesSection />
      </main>
    </div>
  );
}
