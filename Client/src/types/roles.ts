export type Role = {
  id: number;
  name: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
};

export type RoleList = {
  id: Role["id"];
  name: Role["name"];
};
