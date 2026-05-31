import { LayoutDashboard, Users, Wrench } from "lucide-react";
import type { ModuleConfig } from "../components/Layout";

export const SUPERUSER_NAVIGATION: ModuleConfig[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: "/admin",
  },
  {
    name: "User Management",
    icon: Users,
    submodules: [
      { name: "User", path: "/admin/users" },
      { name: "Role", path: "/admin/roles" },
    ],
  },
  {
    name: "Module Management",
    icon: Wrench,
    submodules: [
      { name: "Module", path: "/admin/module" },
      { name: "Sub Modules", path: "/admin/sub-module" },
    ],
  },
];
