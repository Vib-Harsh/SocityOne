import type { filterParams, ListPagination, userList } from "@/types";
import { service } from "@/utils";

export const getUsersList = async (
  params: filterParams,
): Promise<{ data: userList[]; pagination: ListPagination<userList> }> => {
  const res = await service.get(`api/v1/users/`, { params });
  return res.data;
};
