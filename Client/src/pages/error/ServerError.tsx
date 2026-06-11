import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MoveLeft, RotateCw, ServerCrash } from "lucide-react";

export const ServerError: React.FC = () => {
  const navigate = useNavigate();
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryMessage, setRetryMessage] = useState<string | null>(null);

  useEffect(() => {
    const errorActive = sessionStorage.getItem("serverErrorActive");
    if (!errorActive) {
      // If there is no active error flag (manual refresh or direct entry), redirect to "/"
      // navigate("/");
    } else {
      // Clear the flag so subsequent browser reloads/refreshes will redirect to "/"
      sessionStorage.removeItem("serverErrorActive");
    }
  }, [navigate]);

  const handleRetry = () => {
    setIsRetrying(true);
    setRetryMessage(null);

    // Premium feedback latency, then navigate to "/" to attempt re-handshake
    setTimeout(() => {
      setIsRetrying(false);
      navigate("/");
    }, 1200);
  };

  return (
    <div className="relative min-height-screen flex items-center justify-center overflow-hidden bg-[var(--color-bg-base)] px-4 py-16 selection:bg-amber-500/30 selection:text-amber-200">
      {/* Background Ambient Glow Orbs */}
      <div className="ambient-glow glow-purple opacity-20 dark:opacity-30" />
      <div className="ambient-glow glow-blue opacity-10 dark:opacity-20" />
      {/* Amber alert glow */}
      <div className="ambient-glow absolute rounded-full bg-radial from-amber-600 to-transparent w-[500px] height-[500px] top-10 right-10 opacity-10 dark:opacity-15 blur-[120px] pointer-events-none" />

      {/* Cyber Grid Pattern */}
      <div
        className="absolute inset-0 z-0 pointer-events-none opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `radial-gradient(var(--color-text-base) 1px, transparent 1px)`,
          backgroundSize: "24px 24px",
        }}
      />

      <div className="relative z-10 w-full max-w-2xl text-center fade-in-up">
        {/* Pulsing server diagnostic visual */}
        <div className="relative mx-auto mb-8 h-64 w-64 flex items-center justify-center">
          {/* Pulsing glow boundary */}
          <div className="absolute inset-4 rounded-full bg-amber-500/5 animate-pulse [animation-duration:3s]" />

          {/* Core Server Cabinet/Circuit SVG */}
          <svg
            className="w-44 h-44 text-amber-500/80 drop-shadow-[0_0_15px_rgba(245,158,11,0.4)] dark:drop-shadow-[0_0_25px_rgba(245,158,11,0.6)]"
            viewBox="0 0 200 200"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Server Chassis 1 */}
            <rect
              x="50"
              y="50"
              width="100"
              height="28"
              rx="3"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <circle
              cx="70"
              cy="64"
              r="3.5"
              fill="#f59e0b"
              className="animate-pulse"
            />
            <circle cx="85" cy="64" r="2.5" fill="#22c55e" />
            <line
              x1="105"
              y1="64"
              x2="135"
              y2="64"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="3 3"
            />

            {/* Server Chassis 2 (Failing Node) */}
            <rect
              x="50"
              y="90"
              width="100"
              height="28"
              rx="3"
              fill="currentColor"
              fillOpacity="0.1"
              strokeDasharray="4 2"
            />
            <circle
              cx="70"
              cy="104"
              r="3.5"
              fill="#ef4444"
              className="animate-ping"
              style={{ animationDuration: "1.2s" }}
            />
            <circle cx="70" cy="104" r="3.5" fill="#ef4444" />
            <circle
              cx="85"
              cy="104"
              r="2.5"
              fill="#f59e0b"
              className="animate-pulse"
            />
            <line
              x1="105"
              y1="104"
              x2="135"
              y2="104"
              stroke="#ef4444"
              strokeWidth="2"
              strokeDasharray="1 3"
            />

            {/* Server Chassis 3 */}
            <rect
              x="50"
              y="130"
              width="100"
              height="28"
              rx="3"
              fill="currentColor"
              fillOpacity="0.1"
            />
            <circle cx="70" cy="144" r="3.5" fill="#f59e0b" />
            <circle
              cx="85"
              cy="144"
              r="2.5"
              fill="#22c55e"
              className="animate-pulse"
            />
            <line
              x1="105"
              y1="144"
              x2="135"
              y2="144"
              stroke="currentColor"
              strokeWidth="2"
              strokeDasharray="4 4"
            />

            {/* Warning Diagnostic Overlay */}
            <path d="M12 10 L16 10" stroke="#f59e0b" />
          </svg>

          {/* Dotted scanning/connecting path */}
          <div className="absolute inset-0 rounded-full border border-amber-500/20 border-dashed animate-[spin_50s_linear_infinite]" />
        </div>

        {/* Diagnostic warning pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-amber-500/30 bg-amber-950/20 backdrop-blur-md mb-4">
          <ServerCrash className="w-4 h-4 text-amber-400" />
          <span className="text-[11px] font-mono tracking-widest uppercase font-semibold text-amber-300">
            System Overload / Grid Disrupted
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-[var(--color-text-base)]">
          Server Link Severed
        </h1>
        <p className="mt-4 text-base sm:text-lg text-[var(--color-text-muted)] max-w-md mx-auto leading-relaxed">
          The internal microservices network failed to establish a handshake.
          The core database may be updating.
        </p>

        {/* Digital Clearance Code */}
        <div className="mt-6 flex flex-col items-center gap-2 font-mono text-xs text-amber-400/60 dark:text-amber-400/50">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-ping" />
              DB_STATE: DISCONNECTED
            </span>
            <span>CODE: 500_INTERNAL_ERROR</span>
          </div>

          {/* Dynamic mock warning output */}
          {retryMessage && (
            <div className="mt-3 px-4 py-2.5 rounded-lg border border-amber-500/20 bg-amber-950/30 text-amber-300 max-w-xs transition-all duration-300">
              {retryMessage}
            </div>
          )}
        </div>

        {/* Action Controls */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl border border-[var(--color-border-custom)] bg-[var(--color-bg-card)] text-sm font-medium text-[var(--color-text-base)] hover:bg-black/5 dark:hover:bg-white/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 cursor-pointer shadow-sm active:scale-95"
          >
            <MoveLeft className="w-4 h-4" />
            Go Back
          </button>

          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-sm font-medium text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-amber-500/40 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/35 hover:-translate-y-0.5 disabled:opacity-50 disabled:pointer-events-none cursor-pointer active:scale-95"
          >
            <RotateCw
              className={`w-4 h-4 ${isRetrying ? "animate-spin" : ""}`}
            />
            {isRetrying ? "Reconnecting..." : "Retry Connection"}
          </button>
        </div>

        <div className="mt-12 text-xs text-[var(--color-text-muted)] opacity-60">
          The operations dashboard is logging this interruption. Automatic
          diagnostics are already in progress.
        </div>
      </div>
    </div>
  );
};
