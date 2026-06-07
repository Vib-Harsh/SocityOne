import React, { useState, useEffect, useRef, useMemo } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import {
  LayoutDashboard,
  LogOut,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  ChevronRight,
  Sun,
  Moon,
  User,
  Shield,
  Activity,
  HelpCircle,
  Command,
} from "lucide-react";

export interface SubmoduleConfig {
  name: string;
  path: string;
  icon?: React.ComponentType<{ className?: string }>;
}

export interface ModuleConfig {
  name: string;
  icon: React.ComponentType<{ className?: string }>;
  path?: string;
  submodules?: SubmoduleConfig[];
}

interface NotificationItem {
  id: string;
  title: string;
  description: string;
  time: string;
  unread: boolean;
  path: string;
}

const MOCK_NOTIFICATIONS: NotificationItem[] = [
  {
    id: "1",
    title: "New Maintenance Request",
    description: "Leak reported in Block C - Apt 402",
    time: "2 mins ago",
    unread: true,
    path: "/admin/maintenance",
  },
  {
    id: "2",
    title: "Resident Registered",
    description: "Anjali Sharma joined Block A - Apt 105",
    time: "1 hour ago",
    unread: true,
    path: "/admin/users",
  },
  {
    id: "3",
    title: "Monthly Dues Pending",
    description: "Financial invoices generated for June 2026",
    time: "4 hours ago",
    unread: false,
    path: "/admin/finance",
  },
];

const Layout: React.FC<{ navigation: ModuleConfig[] }> = ({ navigation }) => {
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [openModules, setOpenModules] = useState<Record<string, boolean>>(
    () => {
      const initial: Record<string, boolean> = {};
      navigation.forEach((mod) => {
        if (mod.submodules) {
          const hasActiveSub = mod.submodules.some(
            (sub) => sub.path === location.pathname,
          );
          if (hasActiveSub) {
            initial[mod.name] = true;
          }
        }
      });
      return initial;
    },
  );
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(e.target as Node)
      ) {
        setIsProfileOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(e.target as Node)
      ) {
        setIsNotificationOpen(false);
      }
    };
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement !== searchInputRef.current) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const toggleModule = (moduleName: string) => {
    if (isCollapsed) {
      setIsCollapsed(false);
    }
    setOpenModules((prev) => {
      const isAlreadyOpen = !!prev[moduleName];
      const nextState: Record<string, boolean> = {};
      if (!isAlreadyOpen) {
        nextState[moduleName] = true;
      }
      return nextState;
    });
  };

  // Helper check for active state
  const isModuleActive = (module: ModuleConfig): boolean => {
    if (module.path === location.pathname) return true;
    if (module.submodules) {
      return module.submodules.some((sub) => sub.path === location.pathname);
    }
    return false;
  };

  // Helper calculation for Breadcrumbs
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split("/").filter(Boolean);
    if (pathSegments.length === 0)
      return [{ label: "Home", path: "/", active: true }];

    return pathSegments.map((segment, index) => {
      const path = `/${pathSegments.slice(0, index + 1).join("/")}`;
      // Clean display label
      const label = segment
        .replace(/-/g, " ")
        .replace(/\b\w/g, (char) => char.toUpperCase());

      return {
        label,
        path,
        active: index === pathSegments.length - 1,
      };
    });
  };
  const rootPath = useMemo(() => {
    const path = navigation[0]?.submodules?.[0]?.path || navigation[0]?.path;
    return path || "/";
  }, [navigation]);

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className="relative min-h-screen flex transition-colors duration-300 bg-bg-base text-text-base">
      {/* Background ambient light effects from index.css */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <div className="ambient-glow glow-purple"></div>
        <div className="ambient-glow glow-teal"></div>
        <div className="ambient-glow glow-blue"></div>
      </div>

      {/* MOBILE SIDEBAR DRAWERS BACKDROP */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden transition-opacity duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* SIDEBAR COMPONENT */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-40 h-screen transition-all duration-300 ease-in-out flex flex-col
          border-r border-border-custom bg-bg-card/75 backdrop-blur-xl shadow-lg
          ${isCollapsed ? "w-20" : "w-66"}
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand/Logo Section */}
        <div
          className={`h-16 flex items-center justify-between border-b border-border-custom relative transition-all duration-300
          ${isCollapsed ? "justify-center px-2" : "px-4"}
        `}
        >
          <Link
            to="/admin/dashboard"
            className={`flex items-center gap-3 font-semibold text-lg tracking-tight focus:outline-none transition-all duration-300
              ${isCollapsed ? "justify-center" : ""}
            `}
            onClick={() => setIsMobileOpen(false)}
          >
            <img
              src="/logo-icon.svg"
              className="w-9 h-9 object-contain flex-shrink-0 transition-transform duration-500 hover:scale-110"
              alt="SocietyOne Logo"
            />
            <span
              className={`font-bold transition-all duration-300 bg-gradient-to-r from-violet-600 to-indigo-500 dark:from-violet-400 dark:to-indigo-300 bg-clip-text text-transparent
                ${isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"}
              `}
            >
              <span className="text-black dark:text-white">Society</span>
              <span className="text-primary">One</span>
            </span>
          </Link>

          {/* Floating Edge Handle Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute right-[-14px] top-1/2 -translate-y-1/2 z-50 items-center justify-center w-7 h-7 rounded-full border border-border-custom bg-bg-card hover:bg-black/5 dark:hover:bg-white/5 transition-all shadow-md focus:outline-none cursor-pointer"
            title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
          >
            <ChevronRight
              className={`w-4 h-4 text-text-muted transition-transform duration-300
                ${isCollapsed ? "" : "rotate-180"}
              `}
            />
          </button>

          <button
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-1.5 rounded-lg border border-border-custom hover:bg-black/5 dark:hover:bg-white/5 text-text-muted cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Accordion Menu Items */}
        <div className="flex-1 overflow-y-auto py-3 px-2 space-y-1 scrollbar-thin scrollbar-thumb-border-custom">
          {navigation.map((item) => {
            const Icon = item.icon;
            const hasSubs = !!item.submodules;
            const isOpen = !!openModules[item.name];
            const isActive = isModuleActive(item);

            return (
              <div key={item.name} className="space-y-0.5">
                {hasSubs ? (
                  // Accordion Parent Module Button
                  <button
                    onClick={() => toggleModule(item.name)}
                    className={`w-full flex items-center justify-between py-2 px-2.5 rounded-lg transition-all duration-200 group text-left relative focus:outline-none text-sm
                      ${
                        isActive
                          ? "bg-violet-500/10 text-violet-600 dark:text-violet-400 font-medium"
                          : "hover:bg-black/5 dark:hover:bg-white/5 text-text-muted hover:text-text-base"
                      }
                    `}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon
                        className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 flex-shrink-0
                        ${isActive ? "text-violet-600 dark:text-violet-400" : "text-text-muted"}
                      `}
                      />
                      <span
                        className={`transition-opacity duration-200 whitespace-nowrap text-sm
                          ${isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100"}
                        `}
                      >
                        {item.name}
                      </span>
                    </div>

                    {!isCollapsed && (
                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform duration-200 text-text-muted
                          ${isOpen ? "rotate-180 text-violet-500" : ""}
                        `}
                      />
                    )}

                    {/* Collapsed dot indicators */}
                    {isCollapsed && isActive && (
                      <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-violet-500 animate-pulse" />
                    )}
                  </button>
                ) : (
                  // Direct Link Page Item
                  <Link
                    to={item.path || "#"}
                    onClick={() => setIsMobileOpen(false)}
                    className={`flex items-center gap-2.5 py-2 px-2.5 rounded-lg transition-all duration-200 group relative text-sm
                      ${
                        location.pathname === item.path
                          ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-medium shadow-md shadow-violet-500/10"
                          : "hover:bg-black/5 dark:hover:bg-white/5 text-text-muted hover:text-text-base"
                      }
                    `}
                  >
                    <Icon
                      className={`w-4.5 h-4.5 transition-transform group-hover:scale-105 flex-shrink-0
                      ${location.pathname === item.path ? "text-white" : "text-text-muted"}
                    `}
                    />
                    <span
                      className={`transition-opacity duration-200 whitespace-nowrap text-sm
                        ${isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100"}
                      `}
                    >
                      {item.name}
                    </span>

                    {isCollapsed && location.pathname === item.path && (
                      <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    )}
                  </Link>
                )}

                {/* Submodule Lists with smooth dropdown visibility */}
                {hasSubs && !isCollapsed && isOpen && (
                  <div className="pl-4 pr-1.5 py-0.5 space-y-0.5 border-l border-border-custom ml-4.5 fade-in-up">
                    {item.submodules?.map((sub) => {
                      const isSubActive = location.pathname === sub.path;
                      return (
                        <Link
                          key={sub.name}
                          to={sub.path}
                          onClick={() => setIsMobileOpen(false)}
                          className={`block py-1.5 px-2.5 rounded-md text-xs transition-all duration-150 relative group
                            ${
                              isSubActive
                                ? "text-violet-600 dark:text-violet-400 font-medium"
                                : "text-text-muted hover:text-text-base hover:pl-3"
                            }
                          `}
                        >
                          {sub.name}
                          {isSubActive && (
                            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-1 rounded-full bg-violet-600 dark:bg-violet-400" />
                          )}
                        </Link>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer/Logout Container */}
        <div className="p-2 border-t border-border-custom bg-black/2 dark:bg-white/1 flex flex-col gap-1.5">
          <button
            onClick={() => {
              // Standard sign out action mockup
              navigate("/admin_login");
            }}
            className={`w-full flex items-center gap-2.5 py-2 px-2.5 rounded-lg hover:bg-red-500/10 text-red-500 transition-colors group focus:outline-none text-sm
              ${isCollapsed ? "justify-center" : ""}
            `}
            title="Log Out"
          >
            <LogOut className="w-4.5 h-4.5 transition-transform group-hover:translate-x-0.5 flex-shrink-0" />
            <span
              className={`transition-opacity duration-200 whitespace-nowrap text-xs font-medium
                ${isCollapsed ? "opacity-0 w-0 pointer-events-none" : "opacity-100"}
              `}
            >
              Sign Out
            </span>
          </button>
        </div>
      </aside>

      {/* CORE WORKSPACE CONTENT PANEL */}
      <div className="flex-1 flex flex-col min-w-0 relative z-10">
        <header className="sticky top-0 z-30 h-16 flex items-center justify-between px-4 lg:px-6 border-b border-border-custom bg-bg-card/75 backdrop-blur-xl transition-all">
          {/* Header left panel: mobile toggle & Breadcrumbs */}
          <div className="flex items-center gap-3">
            {/* Mobile Toggle Trigger */}
            <button
              onClick={() => setIsMobileOpen(true)}
              className="lg:hidden p-2 rounded-lg border border-border-custom hover:bg-black/5 dark:hover:bg-white/5 text-text-base focus:outline-none cursor-pointer"
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Premium Breadcrumbs panel */}
            <nav
              className="hidden sm:flex items-center gap-1.5 text-sm"
              aria-label="Breadcrumb"
            >
              <Link
                to={rootPath}
                className="text-text-muted hover:text-text-base flex items-center transition-colors"
              >
                <LayoutDashboard className="w-4 h-4" />
              </Link>
              {breadcrumbs.map((crumb) => (
                <React.Fragment key={crumb.path}>
                  <span className="text-text-muted/40 font-light">/</span>
                  {crumb.active ? (
                    <span className="text-violet-600 dark:text-violet-400 font-medium max-w-[140px] truncate">
                      {crumb.label}
                    </span>
                  ) : (
                    <Link
                      to={crumb.path}
                      className="text-text-muted hover:text-text-base transition-colors max-w-[140px] truncate"
                    >
                      {crumb.label}
                    </Link>
                  )}
                </React.Fragment>
              ))}
            </nav>
          </div>

          {/* Header right panel: Search, Notifications, Theme, Profile */}
          <div className="flex items-center gap-2 lg:gap-3">
            {/* Search Input Widget */}
            <div className="relative hidden md:block">
              <Search className="w-4 h-4 text-text-muted absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-48 xl:w-64 pl-9 pr-8 py-1.5 text-xs rounded-xl border border-border-custom bg-black/5 dark:bg-white/5 focus:bg-transparent focus:outline-none focus:ring-2 focus:ring-violet-500/20 focus:border-violet-500 transition-all text-text-base"
              />
              <kbd className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden xl:flex items-center gap-0.5 px-1.5 py-0.5 rounded border border-border-custom bg-black/10 dark:bg-white/10 text-[9px] text-text-muted font-mono pointer-events-none">
                <Command className="w-2.5 h-2.5" />
                <span>/</span>
              </kbd>
            </div>

            {/* Mobile Search Button toggle icon */}
            <button className="md:hidden p-2 rounded-lg border border-border-custom hover:bg-black/5 dark:hover:bg-white/5 text-text-muted">
              <Search className="w-4 h-4" />
            </button>

            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-border-custom hover:bg-black/5 dark:hover:bg-white/5 text-text-muted transition-colors focus:outline-none"
              title={isDark ? "Activate Light Mode" : "Activate Dark Mode"}
            >
              {isDark ? (
                <Sun className="w-4.5 h-4.5 text-amber-400 rotate-0 transition-transform duration-300 hover:rotate-45" />
              ) : (
                <Moon className="w-4.5 h-4.5 text-indigo-500 rotate-0 transition-transform duration-300 hover:-rotate-12" />
              )}
            </button>

            {/* Notifications Dropdown Widget */}
            <div className="relative" ref={notificationRef}>
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className="p-2 rounded-lg border border-border-custom hover:bg-black/5 dark:hover:bg-white/5 text-text-muted relative focus:outline-none"
                title="Notifications"
              >
                <Bell className="w-4.5 h-4.5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full ring-2 ring-bg-card" />
              </button>

              {/* Glassmorphic Dropdown Panel */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-xl border border-border-custom bg-bg-card/95 backdrop-blur-2xl shadow-xl py-2 z-50 fade-in-up">
                  <div className="px-4 py-2 border-b border-border-custom flex items-center justify-between">
                    <span className="font-semibold text-xs text-text-base">
                      Recent Activities
                    </span>
                    <button className="text-[10px] text-violet-600 dark:text-violet-400 font-medium hover:underline">
                      Mark all read
                    </button>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {MOCK_NOTIFICATIONS.map((n) => (
                      <div
                        key={n.id}
                        className={`px-4 py-3 border-b border-border-custom/50 hover:bg-black/3 dark:hover:bg-white/3 transition-colors cursor-pointer text-left
                          ${n.unread ? "bg-violet-500/5" : ""}
                        `}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`text-xs font-semibold text-text-base ${n.unread ? "text-violet-600 dark:text-violet-400" : ""}`}
                          >
                            {n.title}
                          </span>
                          <span className="text-[9px] text-text-muted whitespace-nowrap">
                            {n.time}
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 line-clamp-2">
                          {n.description}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="px-4 py-2 text-center border-t border-border-custom mt-1">
                    <button className="text-[10px] text-text-muted hover:text-text-base font-semibold">
                      View all logs
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Divider separator */}
            <div className="h-6 w-px bg-border-custom hidden sm:block" />

            {/* Profile Dropdown Widget */}
            <div className="relative" ref={profileRef}>
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 rounded-full sm:rounded-xl border border-border-custom hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none"
              >
                {/* User Avatar Circle */}
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-xs font-bold shadow-md shadow-violet-500/10">
                  AD
                </div>
                {/* User info details */}
                <div className="hidden sm:flex flex-col items-start pr-2">
                  <span className="text-xs font-semibold text-text-base leading-tight">
                    Admin Demo
                  </span>
                  <span className="text-[10px] text-text-muted leading-tight font-medium">
                    Super Admin
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-text-muted mr-1 hidden sm:block" />
              </button>

              {/* Glassmorphic Profile Actions Panel */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-56 rounded-xl border border-border-custom bg-bg-card/95 backdrop-blur-2xl shadow-xl py-2 z-50 fade-in-up text-left">
                  <div className="px-4 py-3 border-b border-border-custom flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-violet-600 to-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                      AD
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text-base">
                        Admin Demo
                      </h4>
                      <p className="text-[10px] text-text-muted">
                        admin@societyone.com
                      </p>
                      <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/10 text-emerald-500 mt-1">
                        <Activity className="w-2.5 h-2.5" />
                        <span>Active Now</span>
                      </span>
                    </div>
                  </div>

                  <div className="py-1">
                    <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-text-muted hover:text-text-base hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none">
                      <User className="w-4 h-4" />
                      <span>My Profile</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-text-muted hover:text-text-base hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none">
                      <Shield className="w-4 h-4" />
                      <span>Role Preferences</span>
                    </button>
                    <button className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-text-muted hover:text-text-base hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus:outline-none">
                      <HelpCircle className="w-4 h-4" />
                      <span>Support Centre</span>
                    </button>
                  </div>

                  <div className="border-t border-border-custom py-1 mt-1">
                    <button
                      onClick={() => navigate("/admin_login")}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-red-500 hover:bg-red-500/10 transition-colors focus:outline-none"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Log Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* WORKSPACE PAGES CONTAINER OUTLET */}
        <main className="flex-1 p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;
