import { service, API_V1 } from "@/utils";
import type { RoleList } from "@/types/roles";

export const getRoles = async (): Promise<RoleList[]> => {
  const res = await service.get(`${API_V1}roles/`);
  return res.data;
};
