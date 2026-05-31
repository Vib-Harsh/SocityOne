import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoveLeft, Compass } from "lucide-react";

export const RouteNotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-height-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-16 selection:bg-purple-500/30 selection:text-purple-200">
      {/* Dynamic Background Ambient Glow Orbs */}
      <div className="ambient-glow glow-purple opacity-20 dark:opacity-30" />
      <div className="ambient-glow glow-blue opacity-10 dark:opacity-20" />
      <div className="ambient-glow glow-teal opacity-10 dark:opacity-15" />

      {/* Cyber Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--color-text-base) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center fade-in-up">
        {/* Animated Holographic Radar Visual */}
        <div className="relative mx-auto mb-10 h-72 w-72 flex items-center justify-center">
          {/* Outer Pulsing Aura */}
          <div className="absolute inset-0 rounded-full bg-purple-500/5 animate-ping [animation-duration:3s]" />
          
          {/* Rotating Outer Ring */}
          <div className="absolute inset-2 rounded-full border border-dashed border-purple-500/20 animate-[spin_40s_linear_infinite]" />
          
          {/* Scanning Sweep Circle */}
          <div className="absolute inset-8 rounded-full border border-purple-500/10 dark:border-purple-500/20">
            <div className="absolute top-0 left-1/2 -ml-[1px] h-1/2 w-[2px] bg-gradient-to-t from-purple-500 to-transparent origin-bottom animate-[spin_6s_linear_infinite]" />
          </div>

          {/* Core Radar Graphics */}
          <svg
            className="w-full h-full text-purple-500/30 dark:text-purple-500/40"
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Concentric Radar Rings */}
            <circle cx="100" cy="100" r="90" stroke="currentColor" strokeWidth="1" strokeDasharray="4 8" />
            <circle cx="100" cy="100" r="70" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="100" cy="100" r="50" stroke="currentColor" strokeWidth="1" strokeDasharray="3 3" />
            <circle cx="100" cy="100" r="30" stroke="currentColor" strokeWidth="2" />
            
            {/* Radar Coordinates Axes */}
            <line x1="100" y1="10" x2="100" y2="190" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />
            <line x1="10" y1="100" x2="190" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 4" />

            {/* Glowing Pings */}
            <circle cx="65" cy="55" r="4" fill="#0d9488" className="animate-pulse" />
            <circle cx="140" cy="120" r="3.5" fill="#3b82f6" className="animate-ping" style={{ animationDuration: '2s' }} />
            <circle cx="140" cy="120" r="3.5" fill="#3b82f6" />
            <circle cx="70" cy="140" r="5" fill="#7c3aed" className="animate-pulse" style={{ animationDuration: '1.5s' }} />
          </svg>

          {/* High-Tech Glowing Centerpiece for "404" */}
          <div className="absolute inset-0 flex flex-col items-center justify-center select-none">
            <span className="text-6xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-indigo-500 to-teal-400 drop-shadow-[0_0_15px_rgba(124,58,237,0.4)] dark:drop-shadow-[0_0_25px_rgba(124,58,237,0.6)] animate-pulse">
              404
            </span>
            <div className="mt-1 px-2.5 py-0.5 rounded-full border border-purple-500/30 bg-purple-950/20 backdrop-blur-md">
              <span className="text-[10px] uppercase tracking-widest font-mono text-purple-300">
                System Offline
              </span>
            </div>
          </div>
        </div>

        {/* Informative Content */}
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-base)]">
          Coordinates Lost In Space
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
          The requested module or path does not exist, or has been re-routed to another vector in our core system.
        </p>

        {/* Digital Coordinates Footer / Debugging Metadata */}
        <div className="mt-6 flex items-center justify-center gap-6 font-mono text-xs text-purple-400/60 dark:text-purple-400/40">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            ERR: PATH_NOT_FOUND
          </span>
          <span>LAT: 40.4040N</span>
          <span>LNG: 74.0404W</span>
        </div>

        {/* Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border border-[var(--color-border-custom)] bg-[var(--color-bg-card)] text-sm font-medium text-[var(--color-text-base)] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 cursor-pointer shadow-sm active:scale-95"
          >
            <MoveLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            to="/admin_login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-sm font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-purple-500/40 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/35 hover:-translate-y-0.5 cursor-pointer active:scale-95"
          >
            <Compass className="w-4 h-4" />
            SuperAdmin Login
          </Link>
        </div>

        <div className="mt-12 text-xs text-[var(--color-text-muted)] opacity-60">
          Need assistance? Please contact the administrator or check the central registry.
        </div>
      </div>
    </div>
  );
};
