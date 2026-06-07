import type { Role } from "./roles";

export type User = {
  id: number;
  name: string;
  email: string;
  is_active: boolean;
  role_id: Role["id"];
  role_name: Role["name"];
};

export type UserList = {
  id: User["id"];
  name: User["name"];
  email: User["email"];
  role: Role["name"];
};
