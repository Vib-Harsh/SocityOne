import type { Role } from "./roles";

export type User = {
  id: number;
  name: string;
  email: string;
  password: string;
  is_active: boolean;
  role_id: Role["id"];
  role_name: Role["name"];
};

export type UserForm = Partial<Omit<User, "id" | "role_name">>;

export type UserList = {
  id: User["id"];
  name: User["name"];
  email: User["email"];
  role: Role["name"];
};
