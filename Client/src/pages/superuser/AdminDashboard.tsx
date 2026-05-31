import React from "react";
import {
  Users,
  Wrench,
  Calendar,
  TrendingUp,
  Clock,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  PlusCircle,
  FileText,
  DoorOpen,
} from "lucide-react";

const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border-custom pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center justify-center p-1 rounded-md bg-violet-500/10 text-violet-500">
              <Sparkles className="w-4 h-4" />
            </span>
            <h1 className="text-2xl font-bold tracking-tight">
              SuperAdmin Command Centre
            </h1>
          </div>
          <p className="text-sm text-text-muted mt-1">
            Welcome back! Here's a live look at your residential society
            operations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl border border-border-custom bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 transition-colors focus:outline-none">
            <FileText className="w-3.5 h-3.5" />
            <span>Operational Audit</span>
          </button>
          <button className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-violet-600 text-white hover:bg-violet-700 shadow-md shadow-violet-500/10 transition-colors focus:outline-none">
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Add Resident</span>
          </button>
        </div>
      </div>

      {/* Grid of operational stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Stat card 1 */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-card/45 backdrop-blur-md hover:border-violet-500/30 transition-all group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-text-muted">
              Total Residents
            </span>
            <span className="p-2 rounded-xl bg-violet-500/10 text-violet-500 group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">1,248</h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-emerald-500 bg-emerald-500/10 px-1.5 py-0.5 rounded-full">
                <TrendingUp className="w-3 h-3" />
                <span>+8.2%</span>
              </span>
              <span className="text-[10px] text-text-muted">
                since last month
              </span>
            </div>
          </div>
        </div>

        {/* Stat card 2 */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-card/45 backdrop-blur-md hover:border-rose-500/30 transition-all group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-text-muted">
              Active Workorders
            </span>
            <span className="p-2 rounded-xl bg-rose-500/10 text-rose-500 group-hover:scale-110 transition-transform">
              <Wrench className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">14</h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-rose-500 bg-rose-500/10 px-1.5 py-0.5 rounded-full">
                <span>3 Critical</span>
              </span>
              <span className="text-[10px] text-text-muted">
                requires immediate dispatch
              </span>
            </div>
          </div>
        </div>

        {/* Stat card 3 */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-card/45 backdrop-blur-md hover:border-blue-500/30 transition-all group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-text-muted">
              Active Bookings
            </span>
            <span className="p-2 rounded-xl bg-blue-500/10 text-blue-500 group-hover:scale-110 transition-transform">
              <Calendar className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">48</h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-blue-500 bg-blue-500/10 px-1.5 py-0.5 rounded-full">
                <span>4 Today</span>
              </span>
              <span className="text-[10px] text-text-muted">
                amenities in use
              </span>
            </div>
          </div>
        </div>

        {/* Stat card 4 */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-card/45 backdrop-blur-md hover:border-amber-500/30 transition-all group">
          <div className="flex items-start justify-between">
            <span className="text-xs font-semibold text-text-muted">
              Gate Registrations
            </span>
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-500 group-hover:scale-110 transition-transform">
              <DoorOpen className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold">384</h3>
            <div className="flex items-center gap-1.5 mt-2">
              <span className="inline-flex items-center gap-0.5 text-[10px] font-semibold text-amber-500 bg-amber-500/10 px-1.5 py-0.5 rounded-full">
                <span>12 Active Guests</span>
              </span>
              <span className="text-[10px] text-text-muted">
                authorized check-ins
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main double column grid details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Recent Maintenance Requests */}
        <div className="lg:col-span-2 p-5 rounded-2xl border border-border-custom bg-bg-card/45 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-border-custom pb-3">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping" />
              <h2 className="text-sm font-bold text-text-base">
                Pending Maintenance Requests
              </h2>
            </div>
            <button className="text-xs font-semibold text-violet-600 dark:text-violet-400 hover:underline inline-flex items-center gap-0.5">
              <span>Dispatcher Desk</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="divide-y divide-border-custom/50">
            {/* Item 1 */}
            <div className="py-3 flex items-center justify-between gap-4 first:pt-0 last:pb-0">
              <div className="flex items-start gap-3 min-w-0">
                <span className="p-2.5 rounded-xl bg-rose-500/10 text-rose-500 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text-base truncate">
                    Elevator malfunction (Block B)
                  </h4>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Reported by Resident Aman S. • 12 mins ago
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-rose-500/10 text-rose-500 uppercase tracking-wider flex-shrink-0">
                Critical
              </span>
            </div>

            {/* Item 2 */}
            <div className="py-3 flex items-center justify-between gap-4 last:pb-0">
              <div className="flex items-start gap-3 min-w-0">
                <span className="p-2.5 rounded-xl bg-amber-500/10 text-amber-500 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text-base truncate">
                    Corridor Lights Flickering (Block D)
                  </h4>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Reported by Resident Megha K. • 1 hour ago
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-500/10 text-amber-500 uppercase tracking-wider flex-shrink-0">
                Medium
              </span>
            </div>

            {/* Item 3 */}
            <div className="py-3 flex items-center justify-between gap-4 last:pb-0">
              <div className="flex items-start gap-3 min-w-0">
                <span className="p-2.5 rounded-xl bg-blue-500/10 text-blue-500 mt-0.5">
                  <Wrench className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <h4 className="text-xs font-bold text-text-base truncate">
                    Main gate access card reader offline
                  </h4>
                  <p className="text-[10px] text-text-muted mt-0.5">
                    Reported by Gate Guard Ram • 3 hours ago
                  </p>
                </div>
              </div>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-blue-500/10 text-blue-500 uppercase tracking-wider flex-shrink-0">
                Low
              </span>
            </div>
          </div>
        </div>

        {/* Right Side: Security / Operations Logs */}
        <div className="p-5 rounded-2xl border border-border-custom bg-bg-card/45 backdrop-blur-md space-y-4">
          <div className="flex items-center justify-between border-b border-border-custom pb-3">
            <h2 className="text-sm font-bold text-text-base">System Logs</h2>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/10 text-emerald-500">
              <ShieldCheck className="w-3 h-3" />
              <span>Secure</span>
            </span>
          </div>

          <div className="space-y-3.5">
            {/* Log item 1 */}
            <div className="flex gap-2.5 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5 mt-0.5 text-text-muted/65 flex-shrink-0" />
              <div>
                <p className="text-text-base font-semibold">Staff checked in</p>
                <p className="text-[10px] mt-0.5">
                  Manager Rohit (ID-302) marked attendance
                </p>
                <span className="text-[9px] text-text-muted/60 mt-0.5 block">
                  10:04 AM
                </span>
              </div>
            </div>

            {/* Log item 2 */}
            <div className="flex gap-2.5 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5 mt-0.5 text-text-muted/65 flex-shrink-0" />
              <div>
                <p className="text-text-base font-semibold">
                  Gate Alert Resolved
                </p>
                <p className="text-[10px] mt-0.5">
                  Blocked vehicle allowed manual entry by Guard
                </p>
                <span className="text-[9px] text-text-muted/60 mt-0.5 block">
                  09:52 AM
                </span>
              </div>
            </div>

            {/* Log item 3 */}
            <div className="flex gap-2.5 text-xs text-text-muted">
              <Clock className="w-3.5 h-3.5 mt-0.5 text-text-muted/65 flex-shrink-0" />
              <div>
                <p className="text-text-base font-semibold">
                  Backup Power Test Completed
                </p>
                <p className="text-[10px] mt-0.5">
                  Monthly diesel generator sequence check successful
                </p>
                <span className="text-[9px] text-text-muted/60 mt-0.5 block">
                  Yesterday, 06:12 PM
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub shortcuts */}
      <div className="p-5 rounded-2xl border border-border-custom bg-bg-card/45 backdrop-blur-md space-y-4">
        <h2 className="text-sm font-bold text-text-base">
          Operations Quick Action Hub
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <button className="p-3.5 rounded-xl border border-border-custom hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-center focus:outline-none group">
            <span className="text-xs font-semibold text-text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 block">
              Manage Invoices
            </span>
            <span className="text-[9px] text-text-muted mt-1 block">
              Generate bills & receipts
            </span>
          </button>
          <button className="p-3.5 rounded-xl border border-border-custom hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-center focus:outline-none group">
            <span className="text-xs font-semibold text-text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 block">
              Gate Pass Setup
            </span>
            <span className="text-[9px] text-text-muted mt-1 block">
              Configure active protocols
            </span>
          </button>
          <button className="p-3.5 rounded-xl border border-border-custom hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-center focus:outline-none group">
            <span className="text-xs font-semibold text-text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 block">
              Amenity Booking
            </span>
            <span className="text-[9px] text-text-muted mt-1 block">
              Check availability & approve
            </span>
          </button>
          <button className="p-3.5 rounded-xl border border-border-custom hover:border-violet-500/30 hover:bg-violet-500/5 transition-all text-center focus:outline-none group">
            <span className="text-xs font-semibold text-text-base group-hover:text-violet-600 dark:group-hover:text-violet-400 block">
              Broadcast Alert
            </span>
            <span className="text-[9px] text-text-muted mt-1 block">
              Send circulars to residents
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
