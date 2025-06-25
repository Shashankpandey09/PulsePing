import { SignInButton, useUser } from "@clerk/clerk-react";
import { Link } from "react-router-dom";


const Hero = () => {
  const { isSignedIn } = useUser();
  return (
    <section className="relative overflow-hidden min-h-[90vh]  text-white px-6 sm:px-10 py-24 flex items-center justify-between gap-8 flex-col  lg:flex-row">
      
    
      {/* Content Section */}
      <div className="relative z-10 max-w-3xl space-y-8 lien text-center lg:text-left">
       
   
         <div className=" relative">
                 <div className="absolute -top-4 -right-4 w-4 h-4 bg-green-400 rounded-full animate-ping" />
           <h1 className="text-4xl sm:text-6xl font-extrabold text-center tracking-tight leading-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            Monitor uptime <br />
            <span className="bg-gradient-to-r from-green-500 to-cyan-600 bg-clip-text text-transparent">effortlessly</span>
          </h1>
         </div>
       

        <p className="text-lg sm:text-xl text-gray-400 text-center leading-relaxed">
          Stay ahead of outages with PulsePing’s real-time uptime tracking, instant alerts, and beautiful status dashboards.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col not-even: sm:flex-row justify-center lg:items-center gap-4 pt-4">
          <Link to="/dashboard" className="relative group transition-transform hover:scale-[1.02]">
            <div className="absolute -inset-2 bg-gradient-to-r from-white/10 to-cyan-500/10 rounded-xl blur opacity-40 group-hover:opacity-60 transition" />
            <button className="relative bg-gradient-to-r cursor-pointer from-white to-gray-200 text-black font-semibold px-8 py-4 rounded-xl shadow-2xl hover:shadow-white/20 transition-all duration-200">
              Get Started
              
            </button>
          </Link>
          {!isSignedIn &&  <SignInButton mode="modal">
            <button className="flex cursor-pointer items-center gap-2 border-2 border-white/20 bg-white/5 backdrop-blur-lg px-8 py-4 rounded-xl text-white hover:border-cyan-400 hover:bg-cyan-500/10 transition-all duration-200 group">
              <span >Sign Up</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </button>
          </SignInButton>}
         
        </div>

        {/* Status Preview (Optional) */}
        <div className="mt-10 hidden text-center sm:block">
          <div className="inline-flex items-center space-x-4 p-4 px-6 rounded-xl bg-white/5 backdrop-blur border border-white/10 shadow">
            <span className="w-3 h-3 rounded-full bg-green-400 animate-pulse" />
            <span className="text-white font-medium">Services Operational</span>
            <span className="text-white/60">·</span>
            <span className="text-white/80 font-medium">99.99% Uptime</span>
          </div>
        </div>
      </div>

      {/* Right Side: Image */}
      {/* <div className="relative z-10 w-full lg:w-[800px] flex justify-center">
  <div className="relative w-full overflow-hidden rounded-2xl group"> */}
    {/* Animated border container */}
    {/* <div className="absolute inset-0 rounded-2xl bg-[conic-gradient(from_var(--angle),transparent_20%,#00f7ff_40%,transparent_55%)] animate-border rotate-[--angle] opacity-100 transition-opacity duration-300">
      <div className="absolute inset-[1px] rounded-2xl bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a]" />
    </div> */}

    {/* Main image */}
    {/* <img
      src={pulse}
      alt="PulsePing Status Dashboard"
      className="relative w-full rounded-2xl border border-white/10 shadow-xl object-cover hover:shadow-cyan-400/20 transition duration-300"
    />
  </div>
</div> */}

    </section>
  );
};

export default Hero;
