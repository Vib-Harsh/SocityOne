import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { MoveLeft, ShieldAlert, Key } from "lucide-react";

export const AccessDenied: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-height-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-16 selection:bg-rose-500/30 selection:text-rose-200">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient-glow glow-purple opacity-20 dark:opacity-35" />
      {/* Red/Rose emergency accent glow */}
      <div className="ambient-glow absolute rounded-full bg-radial from-rose-600 to-transparent w-[500px] height-[500px] bottom-10 left-10 opacity-10 dark:opacity-15 blur-[120px] pointer-events-none" />

      {/* Cyber Grid Pattern */}
      <div 
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--color-text-base) 1px, transparent 1px)`,
          backgroundSize: '24px 24px'
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center fade-in-up">
        {/* Animated security shield visual */}
        <div className="relative mx-auto mb-10 h-64 w-64 flex items-center justify-center">
          {/* Pulsing warning aura */}
          <div className="absolute inset-4 rounded-full bg-rose-500/5 animate-pulse [animation-duration:2.5s]" />

          {/* Cyber security shield SVG */}
          <svg
            className="w-40 h-40 text-rose-500/80 drop-shadow-[0_0_15px_rgba(244,63,94,0.4)] dark:drop-shadow-[0_0_25px_rgba(244,63,94,0.6)]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Holographic Shield Shape */}
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            
            {/* Center Lock Core */}
            <rect x="9" y="11" width="6" height="5" rx="1" fill="currentColor" fillOpacity="0.25" stroke="currentColor" strokeWidth="1" />
            <path d="M10 11V9a2 2 0 1 1 4 0v2" />
          </svg>

          {/* Biometric/Hologram Scanning Line */}
          <div className="absolute top-1/4 left-1/6 w-2/3 h-[2px] bg-gradient-to-r from-transparent via-rose-500 to-transparent shadow-[0_0_8px_#f43f5e] animate-[bounce_3.5s_ease-in-out_infinite]" />

          {/* Security Ring */}
          <div className="absolute inset-0 rounded-full border border-rose-500/20 border-dashed animate-[spin_60s_linear_infinite]" />
        </div>

        {/* Informative Content */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-rose-500/30 bg-rose-950/20 backdrop-blur-md mb-4 animate-pulse">
          <ShieldAlert className="w-4 h-4 text-rose-400" />
          <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-rose-300">
            Security Override Triggered
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-base)]">
          Access Denied
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
          Your credentials do not possess the required clearance vector for this secure sector.
        </p>

        {/* Digital Clearance Code */}
        <div className="mt-6 flex items-center justify-center gap-6 font-mono text-xs text-rose-400/60 dark:text-rose-400/50">
          <span className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-ping" />
            CLEARANCE: REQUIRED
          </span>
          <span>CODE: 403_FORBIDDEN</span>
        </div>

        {/* Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border border-[var(--color-border-custom)] bg-[var(--color-bg-card)] text-sm font-medium text-[var(--color-text-base)] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500/40 cursor-pointer shadow-sm active:scale-95"
          >
            <MoveLeft className="w-4 h-4" />
            Go Back
          </button>
          
          <Link
            to="/admin_login"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-sm font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-rose-500/40 shadow-lg shadow-rose-500/25 hover:shadow-rose-500/35 hover:-translate-y-0.5 cursor-pointer active:scale-95"
          >
            <Key className="w-4 h-4" />
            Authenticate Again
          </Link>
        </div>

        <div className="mt-12 text-xs text-[var(--color-text-muted)] opacity-60">
          If you believe this is an error, please request clearance credentials from the network coordinator.
        </div>
      </div>
    </div>
  );
};
