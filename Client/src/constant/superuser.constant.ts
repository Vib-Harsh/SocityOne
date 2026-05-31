import { LayoutDashboard, Users, Wrench } from "lucide-react";
import type { ModuleConfig } from "../components/Layout";
import { SUPERUSER } from "./URL";

export const SUPERUSER_NAVIGATION: ModuleConfig[] = [
  {
    name: "Dashboard",
    icon: LayoutDashboard,
    path: SUPERUSER.dashboard,
  },
  {
    name: "User Management",
    icon: Users,
    submodules: [
      { name: "User", path: SUPERUSER.users },
      { name: "Role", path: SUPERUSER.roles },
    ],
  },
  {
    name: "Module Management",
    icon: Wrench,
    submodules: [
      { name: "Module", path: SUPERUSER.module },
      { name: "Sub Modules", path: SUPERUSER.submodule },
    ],
  },
];
